import {Note, AbstractNotesStore} from '../notes-store-class/notes.mjs';
import {default as DEBUG} from 'debug';
import util from 'util';
import {default as sqlite3} from 'sqlite3';

const debug = DEBUG('notes:notes-sqlite3');
const debugError = DEBUG('notes:sqlite3-error');

let db = null;
async function connectToDatabase(){
    if(db){
        return db;
    }

    const databaseFilePath = process.env.SQLITE_FILE || "./models/db/database.sqlite3";
    await new Promise((resolve, reject) => {
        db = new sqlite3.Database(databaseFilePath, sqlite3.OPEN_READWRITE || sqlite3.OPEN_CREATE, 
            error => {
                if(error){
                    debugError(error);
                    reject(error);
                }
                resolve();
            }
        )
    });
    return db;
}

export default class SQLITE3NotesStore extends AbstractNotesStore
{
    async close(){
        const _db = db;
        db = undefined;

        return _db ? 
            new Promise((resolve, reject) => {
                _db.close(error => {
                    if(error) { reject(error); }
                    else{ resolve(); }
                })
            }) : undefined
    }

    async create(key, title, body){
        const db = await connectToDatabase();
        const note = new Note(key, title, body);

        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO notes (notekey, title, body) VALUES (?, ?, ?)`, [key, title, body], 
                error => {
                    if(error){ reject(error);}
                    resolve(note);
                }
            );

            return note;
        })
    }

    async read(key){
        const db = await connectToDatabase();

        const note = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM notes WHERE notekey= ?", [key], 
                (error, row) => {
                    if(error){
                        reject(error);
                    }
                    const note = new Note(row.notekey, row.title, row.body)
                    resolve(note);
                }
            );
        });
        return note;

    }


    async keylist(){
        const db = await connectToDatabase();

        const keys = await new Promise((resolve, reject) => {
            const keys = [];
            db.all("SELECT notekey FROM notes",
                (error, rows) => {
                    if(error){ reject(error); }
                    resolve(rows.map(row => {
                        return row.notekey;
                    }));
                }
            );
        });
        return keys;
    }

    async update(key, title, body) {
        const db = await connectToDatabase();
        const note = new Note(key, title, body);

        await new Promise((resolve, reject) => {
            db.run("UPDATE notes SET title = ? , body = ? WHERE notekey = ? ",[title, body, key], 
                error => {
                    if(error){
                        reject(error);
                    }
                    resolve(note);
                }
             );
        });
        return note
    }
    async destroy(key) {
        const db = await connectToDatabase();
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM notes WHERE notekey = ? ;", [ key ], 
                error => {
                    if(error) { reject(error); }
                    resolve();
                }
            );
        });
    }
    async count() {
        const db = await connectToDatabase();
        const count = new Promise((resolve, reject) => {
            db.get("SELECT COUNT(notekey) as count FROM notes", 
                error => {
                    if(error){
                        reject(error);
                        resolve(row.count);
                    }
                }
            );
        });
        return count;
    }
    
}

