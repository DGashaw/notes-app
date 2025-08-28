const __note_key = Symbol('key');
const __note_body = Symbol('body');
const __note_title = Symbol('title');

export class Note{
    constructor(key, title, body){
        this.__note_key = key;
        this.__note_title = title;
        this.__note_body = body;
    }

    get key(){return this.__note_key;}
    
    get title() {return this.__note_title;}
    set title(newNoteTitle) {this.__note_title = newNoteTitle;}

    get body() {return this.__note_body;}
    set body(newNoteBody) {this.__note_body = newNoteBody;}
}

export class AbstractNotesStore{
    async close() {}
    async update(key, updateObject) {}
    async create(key, title, body) {}
    async read(key) {}
    async destroy(key) {}
    async keylist() {}
    async count() {}
}

