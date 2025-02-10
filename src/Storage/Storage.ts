import DatabaseEngine from '@/Database/Engine';
import { GetFileMD5 } from '@/utils/file';
import { TStorageFile } from './types';

class Storage {
  readonly db = new DatabaseEngine<TStorageFile>('editor_storage', 1, {
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

  getFiles(md5s: string[]): Promise<TStorageFile[]> {return new Promise(async (res) => {
    const allFiles = await this.db.getAll();
    res(allFiles.filter((e) => md5s.includes(e.md5)));
  })}
}

const storage = new Storage;
export default storage;
export { Storage };
