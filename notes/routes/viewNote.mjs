import {default as express} from 'express';
import { NotesStore as notes } from '../models/notes-store-class/note-store.mjs';
import { ensureAuthenticated  } from './users.mjs';
const router = express.Router();

/**
 * Handle the GET request to display the details of a note
 */
router.get('/view', ensureAuthenticated, async(request, response, next) => {
    const key = request.query.key;
    try{
        const note = await notes.read(key);
        response.render('noteView', {note, title:`${note.title}`, user: request.user})
    }
    catch(error){
        next(error);
    }
    
})

export {router};