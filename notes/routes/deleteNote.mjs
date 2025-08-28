import {default as express} from 'express';
import { NotesStore as notes } from '../models/notes-store-class/note-store.mjs';
import { ensureAuthenticated } from './users.mjs';
export const router = express.Router();

/**
 * Handles GET request for deleting selected note
 */
router.get("/remove", ensureAuthenticated, async(request, response, next) => {
    const notekey = request.query.key;
    try{
        const note = await notes.read(notekey);
        response.render('confirmRemove', {title:`${note.title}`, key: `${notekey}`, user: request.user});
    }
    catch(error){
        next(error);
    }

});

