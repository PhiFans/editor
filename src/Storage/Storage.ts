import DatabaseEngine from '@/Database/Engine';
import { DecodeFile, GetFileMD5 } from '@/utils/file';
import { IFile } from '@/utils/types';

export type TGameDBFile = {
  md5: string,
  blob: Blob,
};

class Storage {
  readonly decodedFiles: { md5: string, file: IFile }[] = [];
  readonly db = new DatabaseEngine<TGameDBFile>('editor_storage', 1, {
    structures: [
      { name: 'md5', options: { key: true } },
      { name: 'blob' },
    ]
  });

  addFile(blob: Blob): Promise<{ md5: string }> {return new Promise(async (res, rej) => {
    const md5 = await GetFileMD5(blob);
    const fileData = await this.db.get(md5);
    if (fileData) return res(fileData);

    this.db.add({
      md5, blob
    }).then(() => res({ md5 }))
      .catch(e => rej(e));
  })}

  getFile(md5: string) {
    return this.db.get(md5);
  }

  getFiles(md5s: string[]): Promise<TGameDBFile[]> {return new Promise(async (res) => {
    const allFiles = await this.db.getAll();
    res(allFiles.filter((e) => md5s.includes(e.md5)));
  })}

  getDecodedFile(md5: string) {
    return this.decodedFiles.find(e => e.md5 === md5);
  }

  /**
   * **Note:** Undecoded files will be decoded and added to cache.
   */
  getDecodedFiles(md5s: string[]): Promise<{ md5: string, file: IFile }[]> {return new Promise(async (res) => {
    const decodedFiles = this.decodedFiles.filter((e) => md5s.includes(e.md5));
    const decodedMD5 = decodedFiles.map((e) => e.md5);
    const undecodedFiles = await this.getFiles(md5s.filter((e) => !decodedMD5.includes(e)));

    for (const undeccodedFile of undecodedFiles) {
      const { md5: rawMD5, blob } = undeccodedFile;
      const decodedFile = await DecodeFile(new File([ blob ], ''));
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
