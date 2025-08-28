import { default as express } from 'express';
const router = new express.Router();
import { UserStore } from "../models/user-store-class/user-store.mjs";
import { default as DEBUG } from 'debug';
import * as util from 'util';
import bcrypt from 'bcrypt';
import { authenticateApiKey } from '../app-supprt.mjs';

const debug = DEBUG("users:create-user-router");
const debugError = DEBUG("users:error-create-user-router");

router.post("/create-user", authenticateApiKey, async(request, response) => {
    try{
        const user = await UserStore.read(request.body.username);

        if(user){
            return response.status(400).json(`Error: username ${request.body.username} exits`);
        }
        else{
            const {username, password, givenName, familyName, middleName, email} = request.body;
            const hashPassword = (await bcrypt.hash(password, 10)).toString('hex');
            let result = await UserStore.create(username, hashPassword, givenName, middleName, familyName, email);

            if(result){
                return response.status(201).json(result);
            }
            else{
                throw new Error("Unable to create a user");
            }
        }
    }
    catch(error){
        return response.send(500).json({"create-user-error": error.message});
    }
})

export { router };