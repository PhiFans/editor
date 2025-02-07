import DatabaseEngine from '@/Database/Engine';
import { DecodeFile, GetFileMD5 } from '@/utils/file';
import { IFile } from '@/utils/types';

export type TGameDBFile = {
  md5: string,
  filename: string,
  blob: Blob,
};

class Storage {
  readonly decodedFiles: { md5: string, file: IFile }[] = [];
  readonly db = new DatabaseEngine<TGameDBFile>('file_db', 1, {
    structures: [
      { name: 'md5', options: { key: true } },
      { name: 'filename', options: { index: true, unique: false } },
      { name: 'blob' },
    ]
  });

  addFile(filename: string, blob: Blob): Promise<{ md5: string, filename: string }> {return new Promise(async (res, rej) => {
    const md5 = await GetFileMD5(blob);
    const fileData = await this.db.get(md5);
    if (fileData) return res(fileData);

    this.db.add({
      md5, filename, blob
    }).then(() => res({ md5, filename }))
      .catch(e => rej(e));
  })}

  getFile(md5: string) {
    return this.db.get(md5);
  }

  getFileByName(filename: string) {
    return this.db.get(filename, 'filename');
  }

  getFilesByMD5(md5s: string[]): Promise<TGameDBFile[]> {return new Promise(async (res) => {
    const allFiles = await this.db.getAll();
    res(allFiles.filter((e) => md5s.includes(e.md5)));
  })}

  getDecodedFile(md5: string) {
    return this.decodedFiles.find(e => e.md5 === md5);
  }

  /**
   * **Note:** Undecoded files will be decoded and added to cache.
   */
  getDecodedFilesByMD5(md5s: string[]): Promise<{ md5: string, file: IFile }[]> {return new Promise(async (res) => {
    const decodedFiles = this.decodedFiles.filter((e) => md5s.includes(e.md5));
    const decodedMD5 = decodedFiles.map((e) => e.md5);
    const undecodedFiles = await this.getFilesByMD5(md5s.filter((e) => !decodedMD5.includes(e)));

    for (const undeccodedFile of undecodedFiles) {
      const { md5: rawMD5, blob, filename } = undeccodedFile;
      const decodedFile = await DecodeFile(new File([ blob ], filename));
      decodedFiles.push({ md5: rawMD5, file: decodedFile });
      this.addDecodedFile(rawMD5, decodedFile);
    }

    res(decodedFiles);
  })}

  addDecodedFile(md5: string, file: IFile) {
    const oldFile = this.getDecodedFile(md5);
    if (oldFile) return null;
    this.decodedFiles.push({
      md5, file
    });
  }
}

const storage = new Storage;
export default storage;
export { Storage };
