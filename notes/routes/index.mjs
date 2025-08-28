import  { default as express } from 'express';
import { NotesStore as notes } from '../models/notes-store-class/note-store.mjs';
import {default as DEBUG} from 'debug';
const debug = DEBUG('notes: notes-index.mjs');
const debugError = DEBUG('notes: error-index.mjs');
const router = express.Router();

/* GET home page. */
router.get('/', async(request, response, next) => {
  try{
    const keylist = await notes.keylist();
    const keyPromises = keylist.map(key => {
      return notes.read(key);
    });

    const notesList = await Promise.all(keyPromises);
    response.render("index", {"title" : "Notes-App", 
                              "notesList": notesList,
                              "user": request.user ? request.user : undefined});

  }
  catch(error)
  {
    next(error);
  }

});

export {router};
