import {Note, AbstractNotesStore} from "../notes-store-class/notes.mjs";
import {MongoClient} from 'mongodb';
import {default as DEBUG} from 'debug';

const debug = DEBUG("notes:notes-mongodb");
const debugError = DEBUG("notes:mongodb-error");

let client = null;

async function connectToDatabase() {
    if(!client)
    {
        client = await MongoClient.connect(process.env.DEVELOPMENT_MONGO_DB_CONNECTION_STRING);
    }

    return client;
}

const db = () => client.db(process.env.DATABASE_NAME);

export default class MongoDBNotesStore extends AbstractNotesStore
{
    async close() {
        if(client){
            await db.close();
            client = null;
        }
    }
    async create(key, title, body) {
        await connectToDatabase();
        const note = new Note(key, title, body);
        const collection = db().collection('notes');
        await collection.insertOne({
            notekey: key,
            title: title,
            body: body
        });

        return note;
    }
    async read(key) {
        await connectToDatabase();
        const collection = await db().collection('notes');
        const doc = await collection.findOne({notekey: key}, {_id: 0});
        const note = new Note(doc.notekey, doc.title, doc.body);
    
        return note;
    }
    async update(key, title, body) {
        await connectToDatabase();
        const collection = await db().collection('notes');

        await collection.updateOne({notekey: key}, {$set: {title: title, body: body}})
        const note = await collection.findOne({notekey: key});

        return new Note(note.notekey, note.title, note.body);
    }
    async destroy(key) {
        await connectToDatabase();
        const collection = await db().collection('notes');

        const doc = await collection.findOne({notekey: key});
        if(!doc){
            throw new Error(`A note with key-${key} can not be found`);
        }
        else{
            await collection.findOneAndDelete({notekey: key});
        }
    }
    async keylist() {
        let keys = [];

        await connectToDatabase();
        const collection = await db().collection('notes');
        keys = (await collection.find({}).toArray()).map(note => note.notekey);
    
        return keys;
        
    }
    async count() {}
}