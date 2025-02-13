import { v4 as uuid } from 'uuid';
import DatabaseEngine from '@/Database/Engine';
import { GetFileMD5 } from '@/utils/file';
import { TStorageFile } from './types';
import { Nullable } from '@/utils/types';

class StorageFile {
  readonly db = new DatabaseEngine<TStorageFile>('editor_storage_files', 1, {
    structures: [
      { name: 'id', options: { key: true, unique: true } },
      { name: 'md5', options: { unique: true, index: true } },
      { name: 'blob' },
    ]
  });

  add(blob: Blob): Promise<{ md5: string }> {return new Promise(async (res, rej) => {
    const id = uuid();
    const md5 = await GetFileMD5(blob);
    const fileData = await this.db.get(md5);
    if (fileData) return res(fileData);

    this.db.add({
      id, md5, blob
    }).then(() => res({ md5 }))
      .catch(e => rej(e));
  })}

  remove(md5: string) {
    return this.db.delete(md5);
  }

  get(id: string | string[]): Promise<Nullable<TStorageFile | TStorageFile[]>> {
    if (typeof id === 'string') return this.db.get(id);
    return new Promise(async (res) => {
      const allFiles = await this.db.getAll();
      res(allFiles.filter((e) => id.includes(e.id)));
    });
  }

  getByMD5(md5: string | string[]): Promise<Nullable<TStorageFile | TStorageFile[]>> {
    if (typeof md5 === 'string') return this.db.get(md5, 'md5');
    return new Promise(async (res) => {
      const allFiles = await this.db.getAll();
      res(allFiles.filter((e) => md5.includes(e.md5)));
    });
  }

  update(id: string, file: Blob): Promise<{ md5: string }> {return new Promise(async (res, rej) => {
    const md5 = await GetFileMD5(file);

    this.db.update(id, {
      id, md5, blob: file,
    }).then(() => res({ md5 }))
      .catch((e) => rej(e));
  })}
}

const file = new StorageFile;
export default file;
export { StorageFile };
