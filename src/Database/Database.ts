import DatabaseEngine from './Engine';
import { TProject } from './types';

class Database {
  readonly project = new DatabaseEngine<TProject>('editor_db_project', 1, {
    structures: [
      { name: 'id', options: { key: true, unique: true } },
      { name: 'filesID', options: { unique: true } },
      { name: 'chartID', options: { unique: true } },
    ],
  });
};

const database = new Database();
export default database;
export { Database };
