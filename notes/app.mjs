import {__dirname} from './appRootDirectory.mjs'
import {default as express} from 'express';
import {default as path} from 'path';
import {default as cookieParser} from 'cookie-parser';
import {default as logger} from 'morgan';
import * as rfs from 'rotating-file-stream';
import * as http from 'http';
import {normalizePort, onError, onListening, handle404, basicErrorHandler} from './utility/appSupport.mjs';
import {default as hbs} from 'hbs';
import crypto from 'node:crypto';

import {default as expressSession} from 'express-session';
import sessionFileStore from 'session-file-store';
import {default as bodyParser} from 'body-parser';

import { credential } from './config/development_credential.mjs'; 
import {router as indexRouter} from './routes/index.mjs';
import { router as noteRouter } from "./routes/notes.mjs";
import {router as singleNoteRouter} from "./routes/viewNote.mjs";
import {router as deleteNoteRouter} from "./routes/deleteNote.mjs";
import {router as deleteConfirmRouter} from "./routes/deleteConfirmNote.mjs";
import {router as editNoteRouter} from "./routes/editNote.mjs";

import {useModel} from "./models/notes-store-class/note-store.mjs";
import {default as dotenv} from 'dotenv'

import {default as DEBUG} from 'debug';

//user routes
import { router as userRouter, initPassport } from "./routes/users.mjs"
dotenv.config();

const debug = DEBUG('notes:app.js');
const debugError = DEBUG("notes:error-app.js");

const FileStore = sessionFileStore(expressSession);
export const sessionCookieName = 'notescookie.sid';

/**
 * Dynamically select the data store for the notes app based on
 * passed enviromental value. The default will be memory-store 
 */
useModel(process.env.NOTES_MODEL ? process.env.NOTES_MODEL : "memory")
    .then(() => {})
    .catch(error => {onError({code: 'ENOTESSTORE', error})});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/**
 * Use of morgan with rotating file stream to 
 * write the logs on a file if the request_log_format is
 * provided. Otherwise, the logs are printed on the screen
 */
app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev', 
    {stream: process.env.REQUEST_LOG_FILE ? 
        rfs.createStream(path.join(__dirname, process.env.REQUEST_LOG_FILE),{
            size: '10M',
            interval: '1d',
            compress: 'gzip'
        } 
        ) : process.stdout
    }
));

//This parses application/x-www-form-urlencoded (form submissions)
app.use(bodyParser.urlencoded({extended: true}));

//This parses json paylods(application/json)
app.use(bodyParser.json());

//setting a cookie parser
app.use(cookieParser(credential().cookieSecret))

//setting a session middlewear
app.use(expressSession({
    store: new FileStore({ path: "session" }),
    resave: true,
    saveUninitialized: true,
    secret: `${credential().cookieSecret}`,
    name: sessionCookieName,
   
}));



//Middlewear to generate and store csrf token
app.use((request, response, next) => {
    if(!request.session.csrfToken){
        request.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    response.locals.csrf = request.session.csrfToken;
    next();
})

app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(path.join(__dirname, 'views/partials/'));

hbs.registerHelper('getCurrentYear',  function(){
            return (new Date()).getFullYear();
        });

//Initialize the app with passport
initPassport(app);

app.use('/', indexRouter);
app.use("/notes", noteRouter);
app.use("/notes", singleNoteRouter);
app.use("/notes", deleteNoteRouter);
app.use("/notes", deleteConfirmRouter);
app.use("/notes", editNoteRouter);
app.use("/users", userRouter);

//custom 404
app.use(handle404);
//custom 500
app.use(basicErrorHandler);

export const port = normalizePort(process.env.PORT || '3000');
export const hostname = process.env.HOSTNAME || 'localhost';
export const enviroment = process.env.NODE_ENV || 'uknown';

app.set('port', port);
app.set('hostname', hostname);
app.set('enviroment', enviroment);

export const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.on('request', (request, response) => {
    debug(`${new Date().toISOString()} request ${request.method}: ${request.url}`);
})
