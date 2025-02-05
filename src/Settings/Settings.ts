import EventEmitter from 'eventemitter3';
import { TSettings } from './types';

const STORAGE_KEY_NAME = 'editor-settings';

class Settings {
  readonly storage = window.localStorage;
  readonly event = new EventEmitter();
  private _current: TSettings = {
    // Default settings goes here
    noteScale: 8000,
  };

  constructor() {
    const storagedSettings = JSON.parse(this.storage.getItem(STORAGE_KEY_NAME) ?? '{}') as TSettings;

    this._current = {
      ...this._current,
      ...storagedSettings,
    };
    this.storage.setItem(STORAGE_KEY_NAME, JSON.stringify(this._current));
    this.event.emit('settings.updated', { ...this._current });
  }

  /**
   * Get single setting's value
   */
  get(name: keyof TSettings): TSettings[keyof TSettings] {
    return this._current[name];
  }

  set(name: keyof TSettings, value: TSettings[keyof TSettings]) {
    this._current[name] = value;
    this.storage.setItem(STORAGE_KEY_NAME, JSON.stringify(this._current));

    this.event.emit('settings.updated', { ...this._current });
    return this._current;
  }

  get current() {
    return this._current;
  }
}

const settings = new Settings();
export default settings;
export { Settings };
