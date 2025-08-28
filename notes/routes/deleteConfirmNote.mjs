import {default as express} from 'express';
import { NotesStore as notes } from '../models/notes-store-class/note-store.mjs';
import { ensureAuthenticated  } from './users.mjs';
export const router = express.Router();

/**
 * Handles POST request for deleting confirmed note
 */
router.post("/remove/confirm", ensureAuthenticated, async(request, response, next) => {
    const notekey = request.body.notekey;
    try{
        await notes.destroy(notekey);
        response.redirect(303, "/");

    }
    catch(error){
        next(error);
    }
})