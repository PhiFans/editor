import DatabaseEngine from '@/Database/Engine';
import StorageFile from './File';
import { TStorage, TStorageStructure } from './types';

class Storage {
  readonly file = StorageFile;
  readonly db = new DatabaseEngine<TStorage>('editor_storage_structure', 1, {
    structures: [
      { name: 'id', options: { key: true, unique: true } },
      { name: 'structure' }
    ],
  });

  add(id: string, structure: TStorageStructure) {
    return this.db.add({
      id, structure
    });
  }

  remove(id: string) {
    return this.db.delete(id);
  }

  get(id: string) {
    return this.db.get(id);
  }

  getAll() {
    return this.db.getAll();
  }

  update(id: string, structure: TStorageStructure) {
    return this.db.update(id, {
      id, structure
    });
  }
}

const storage = new Storage();
export default storage;
export { Storage };
