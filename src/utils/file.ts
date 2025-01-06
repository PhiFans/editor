import decodeAudio from 'audio-decode';
import { Nullable } from './types';

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
