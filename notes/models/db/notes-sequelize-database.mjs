import { Note, AbstractNotesStore } from "../notes-store-class/notes.mjs";
import { connectToDatabaseWithSequilize, close as closeSequelize } from "./sequelize.mjs";
import { SQNote } from "./sequelize_model.mjs";
import { default as DEBUG } from 'debug';

const debug = DEBUG('notes:notes-sequelize');
const debugError = DEBUG('notes:error-sequelize');

let initialize = false;

//Since we define a Note class, we call this as SQNote - SequelizeNote

async function connectAndInitialize() {
    const sequelize = await connectToDatabaseWithSequilize();
    
    if(!initialize){
        SQNote.initModel(sequelize);
        await SQNote.sync();
        initialize = true;
    }
    
    return sequelize;
}
export default class SequelizeNotesStore extends AbstractNotesStore{
    async close() {
        await closeSequelize();
        initialize = false;
    }

    async update(key, title, body) {
        try{
            await connectAndInitialize();
            const note = await SQNote.findOne({where: {notekey: key}});

            if(!note) { throw new Error(`Note with key ${key}, can not be found`); }
            else{
                await SQNote.update({title, body}, {where: {notekey: key}});
                const note = await SQNote.findOne({where: {notekey: key}});
                return this.read(key);
        }
    }
        catch(error){
            throw error;   
            }
        

    }

    async create(key, title, body) {
        try{
             await connectAndInitialize();
            const sqnote = await SQNote.create({
                notekey: key,
                title: title,
                body: body
        });

        return new Note(sqnote.notekey, sqnote.title, sqnote.body);
        }
        catch(error){
            throw error;
        }
       
    }

    async read(key) {
        try{
            await connectAndInitialize();
            const note = await SQNote.findOne({where: {notekey: key}});

            if(!note){
                throw new Error(`No note found with key:${key}`);
            }
            else{
                return new Note(note.notekey, note.title, note.body);
            }
        }
        catch(error){
            throw error;
        }
        
    }

    async destroy(key) {}

    async keylist() {
        try{
            await connectAndInitialize();
            const notes = await SQNote.findAll({ attributes: ['notekey'] });
            const noteKeys = notes.map(note => note.notekey);

            return noteKeys;
        }
        catch(error){
            throw error;
        }
        
    }
    async count() {}
}