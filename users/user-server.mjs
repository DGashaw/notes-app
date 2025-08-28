import {default as express} from 'express';
import { useModel, UserStore as users } from "./models/user-store-class/user-store.mjs";
import { default as logger } from 'morgan';
import { default as DEBUG } from 'debug';
import * as util from 'util';
import { router as createUserRouter } from './routes/create-user.mjs';
import { router as userLoginRouter } from "./routes/user-login.mjs";
import { router as userProfileRouter } from "./routes/user-profile.mjs";
import { router as findUserByUsernameRoute } from "./routes/find-user-by-username.mjs";
import { router as findAllUsersRoute } from "./routes/find-all-users.mjs";
import { router as updateUserInfoRoute } from "./routes/update-user-info.mjs";
import { router as deleteUserRoute } from "./routes/delete-user.mjs";
import { router as passwordCheckRoute } from "./routes/password-check.mjs";
import { router as findOrCreateUser } from "./routes/find-or-create-user.mjs";

import { default as dotenv } from 'dotenv';

dotenv.config();
await useModel(process.env.NOTES_MODEL);

const server = express();

const debug = DEBUG('users:user-server');
const debugError = DEBUG('users:server-error');

server.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev', 
    {stream: process.env.REQUEST_LOG_FILE ? 
        rfs.createStream(path.join(__dirname, process.env.REQUEST_LOG_FILE),{
            size: '10M',
            interval: '1d',
            compress: 'gzip'
        } 
        ) : process.stdout
    }
));

server.use(express.json());


server.use("/users", createUserRouter);
server.use("/auth", userLoginRouter);
server.use("/users", userProfileRouter);
server.use("/users/find", findUserByUsernameRoute);
server.use("/users", findAllUsersRoute);
server.use("/users", updateUserInfoRoute);
server.use("/users", deleteUserRoute);
server.use("/users", passwordCheckRoute);
server.use("/users", findOrCreateUser);

const url = new URL("http://localhost");
url.host = process.env.host || 'localhost';
url.port = process.env.PORT;
server.url = url;

server.listen(process.env.PORT, "localhost", function(){
    console.log(`${server.name} listening at ${server.url}`)});

process.on('uncaughtException', function(error){
    console.error("UNCAUGHT EXCEPTION - " + (error.stack || error));
    process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
    console.error(`UNHANDLED PROMISE REJECTION: ${util.inspect(p)}\nReason: ${reason}`);
    process.exit(1);
});