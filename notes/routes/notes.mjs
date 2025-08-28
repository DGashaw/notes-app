import {default as express} from 'express';
import { NotesStore as notes } from '../models/notes-store-class/note-store.mjs';
import { ensureAuthenticated } from "./users.mjs";
const router = express.Router();

/**
 * Handle the GET request for adding new note
 */
router.get("/add", ensureAuthenticated, async(request, response, next) => {
  response.status = 200;
  response.render("addNoteForm", { title: "Add New Note", user: request.user });
});

/**
 * Handle the POST request for adding new note
 */
router.post("/add", ensureAuthenticated, async(request, response, next) => {
  const {key, title, body} = request.body;
  try{
    const note = await notes.create(key, title, body);
    //console.log(`note: ${JSON.stringify(note, undefined, 2)}`)
    response.redirect(303, "/");
  }
  catch(error){
    next(error);
  }
})

export {router};
