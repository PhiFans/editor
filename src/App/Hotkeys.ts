import { EventEmitter } from 'pixi.js';
import hotkeys from 'hotkeys-js';

export class Hotkeys {
    keymap: { [key: string]: string };
    event: EventEmitter;

    constructor(e: EventEmitter) {
        this.keymap = {};
        this.event = e;
    }

    add(key: string, id: string) {
        this.keymap[key] = id;
        hotkeys(key, (event: KeyboardEvent,) => { 
            event.preventDefault();
            this.event.emit(id); 
        });
    }

    remove(key: string) {
        hotkeys.unbind(key);
        delete this.keymap[key];
    }

    on(id: string, callback: () => void) {
        this.event.on(id, callback);
    }
}