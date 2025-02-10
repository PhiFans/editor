import DatabaseEngine from '@/Database/Engine';
import { GetFileMD5 } from '@/utils/file';
import { TStorageFile } from './types';
import { Nullable } from '@/utils/types';

class StorageFile {
  readonly db = new DatabaseEngine<TStorageFile>('editor_storage_files', 1, {
    structures: [
      { name: 'md5', options: { key: true } },
      { name: 'blob' },
    ]
  });

  add(blob: Blob): Promise<{ md5: string }> {return new Promise(async (res, rej) => {
    const md5 = await GetFileMD5(blob);
    const fileData = await this.db.get(md5);
    if (fileData) return res(fileData);

    this.db.add({
      md5, blob
    }).then(() => res({ md5 }))
      .catch(e => rej(e));
  })}

  remove(md5: string) {
    return this.db.delete(md5);
  }

  get(md5: string | string[]): Promise<Nullable<TStorageFile | TStorageFile[]>> {
    if (typeof md5 === 'string') return this.db.get(md5);
    return new Promise(async (res) => {
      const allFiles = await this.db.getAll();
      res(allFiles.filter((e) => md5.includes(e.md5)));
    });
  }
}

const file = new StorageFile;
export default file;
export { StorageFile };
