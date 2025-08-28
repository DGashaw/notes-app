import {Note, AbstractNotesStore} from '../notes-store-class/notes.mjs';

const notes = [];

export default class InMemoryNotesStore extends AbstractNotesStore
{
    //This is irrelevant for in-memory array storage
    async close() {}
    //Save a new note
    async create(key, title, body){
        notes[key] = new Note(key, title, body);
        return notes[key];
    }

    //Read an existing note
    async read(key){
        if(notes[key]){
            return notes[key];
        }
        else{
            throw new Error(`Note ${key} does not exist`);
        }
    }

    //update an existing note
    async update(key, title, body){
        if(notes[key]){
            notes[key] = new Note(key, title, body);
        }
    }

    //Deleting an existing note
    async destroy(key){
        if(notes[key]){
            delete notes[key];
        }
        else{
            throw new Error(`Note ${key} does not exist`);
        }
    }

    //Get the notes keys
    async keylist(){
        return Object.keys(notes);
    }

    //Get the numbers of notes
    async count() {
        return notes.length;
    }
}