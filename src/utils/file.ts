import decodeAudio from 'audio-decode';
import SparkMD5 from 'spark-md5';
import AudioClip from '@/Audio/Clip';
import { IFile, Nullable } from './types';
import { ChartExported } from '@/Chart/Chart';

export const PopupReadFiles = (multiple = false, accept: string | Array<string> = ''): Promise<Nullable<FileList>> => new Promise((res) => {
  const fileDOM = document.createElement('input');
  fileDOM.type = 'file';
  fileDOM.multiple = multiple;
  fileDOM.accept = typeof accept === 'string' ? accept : accept?.join(',');

  fileDOM.addEventListener('input', () => {
    const { files } = fileDOM;
    res(files);
  });

  fileDOM.click();
});

export const ReadFileAsText = (file: File | Blob): Promise<string> => new Promise((res, rej) => {
  const reader = new FileReader();

  reader.onload = () => {
    res(reader.result as string);
  };

  reader.onerror = (e) => {
    rej(e);
  };

  reader.readAsText(file);
});

export const ReadFileAsArrayBuffer = (file: File | Blob): Promise<ArrayBuffer> => new Promise((res, rej) => {
  const reader = new FileReader();

  reader.onload = () => {
    res(reader.result as ArrayBuffer);
  };

  reader.onerror = (e) => {
    rej(e);
  };

  reader.readAsArrayBuffer(file);
});

export const ReadFileAsAudioBuffer = (file: File | Blob): Promise<AudioBuffer> => new Promise(async (res, rej) => {
  try {
    const arrayBuffer = await ReadFileAsArrayBuffer(file);
    const audioBuffer = await decodeAudio(arrayBuffer);
    res(audioBuffer);
  } catch (e) {
    rej(e);
  }
});

export const GetFileMD5 = (file: Blob, chunkSize = 2097152): Promise<string> => new Promise((res, rej) => {
  const chunks = Math.ceil(file.size / chunkSize);
  const spark = new SparkMD5.ArrayBuffer();
  const reader = new FileReader();
  let currentChunk = 0;

  const loadChunk = () => {
    const start = currentChunk * chunkSize;
    const end = (start + chunkSize) < file.size ? start + chunkSize : file.size;
    reader.readAsArrayBuffer(file.slice(start, end));
  };

  reader.onload = (e) => {
    spark.append((e.target as FileReader).result as ArrayBuffer);
    currentChunk++;

    if (currentChunk < chunks) loadChunk();
    else {
      res(spark.end());
      spark.destroy();
    }
  };

  reader.onerror = (e) => {
    rej(e);
  };

  loadChunk();
});

export const DecodeFile = (file: File): Promise<IFile> => new Promise((res, rej) => {
  (new Promise(() => {
    throw new Error('Promise chain!');
  })).catch(async () => {
    // Decode as chart file
    const fileText = await ReadFileAsText(file);
    const chartJson = JSON.parse(fileText) as ChartExported;
    res({
      type: 'chart',
      data: chartJson,
    });
  }).catch(async () => {
    // Decode as image
    const bitmap = await window.createImageBitmap(file);
    res({
      type: 'image',
      data: bitmap
    });
  }).catch(async () => {
    // Decode as audio file
    const audioResult = await AudioClip.from(file);
    res({
      type: 'audio',
      data: audioResult,
    });
  }).catch(() => {
    rej(`Unsupported file type. File name: ${file.name}`);
  });
});
