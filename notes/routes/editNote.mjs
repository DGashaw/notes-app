import {default as express} from 'express';
import { NotesStore as notes } from '../models/notes-store-class/note-store.mjs';
import { ensureAuthenticated } from './users.mjs';
export const router = express.Router();

/**
 * Handle notes edit POST request
 */
router.post("/edit", ensureAuthenticated, async(request, response, next) => {
    const {key, title, body} = request.body;
    try{
        const note = await notes.update(key, title, body);
        response.redirect(303, `view?key=${key}`);
    }
    catch(error){
        next(error);
    }

});

/**
 * Handle notes edit GET request
 */
router.get("/edit", ensureAuthenticated, async(request, response, next) => {
    try{
        const note = await notes.read(request.query.key);
        response.render("editNoteForm", {note, title: `Edit ${note.title}`, user: request.user});

    }
    catch(error){
        next(error);
    }
    
});
