import {default as express } from 'express';
import {default as DEBUG} from 'debug';
import { UserStore } from "../models/user-store-class/user-store.mjs"
import bcrypt from 'bcrypt';

import * as util from 'util';
import jwt from 'jsonwebtoken';

import { authenticateApiKey, authenticateToken } from "../app-supprt.mjs";
import { User } from "../models/user-store-class/user.mjs";

const debug = DEBUG("users:update-user-info");
const debugError = DEBUG("users:error-update-user-info");

const router = express.Router();

router.post("/update-user/:username", authenticateApiKey, async(request, response) => {
    try{
        const updateObject = request.body;
        const username = request.params.username;

        const currentUser = await UserStore.read(username);
        
        if(!currentUser){
            return response.status(400).json({"error": `Update failed as no user with username, ${username}, can be found`});
        }

        if(updateObject.password){ updateObject.password = (await bcrypt.hash(updateObject.password, 10)).toString('hex'); }
        const result = await UserStore.update(username, updateObject);

        return response.status(201).json(result);

    }
    catch(error){
        return response.status(500).json({"user-info-update-error": error.message});
    }
}) 

export { router };