import { default as express } from 'express';
const router = new express.Router();
import { UserStore } from "../models/user-store-class/user-store.mjs";
import { default as DEBUG } from 'debug';
import * as util from 'util';
import { authenticateApiKey } from "../app-supprt.mjs";



const debug = DEBUG("users:find-all-users-router");
const debugError = DEBUG("users:error-find-all-users-router");

router.get("/all-users", authenticateApiKey, async(request, response) => {
    try{
        const allUsernames = await UserStore.usernamelist();

        const promiseUsersList = allUsernames.map(username => {
            return UserStore.read(username);
        });

        const users = await Promise.all(promiseUsersList)
        const usersList = users.map(user => user.userInformation() );

        response.json(usersList);
        }
    catch(error){
        response.status(500).json({"get-all-users-error": error.message});
    }
    
})

export { router };