import { default as express } from 'express';
import { UserStore } from "../models/user-store-class/user-store.mjs";
import { default as DEBUG } from 'debug';
import * as util from 'util';
import bcrypt from 'bcrypt';
import { authenticateApiKey } from '../app-supprt.mjs';
import jwt from "jsonwebtoken";

const debug = DEBUG("users:create-user-router");
const debugError = DEBUG("users:error-create-user-router");

const router = new express.Router();

router.post("/find-or-create-user", authenticateApiKey, async(request, response, next) => {
    try{
        const { username, password, givenname, middlename, familyname, email } = request.body;
        let user = await UserStore.read(username);

        if(!user){
            
            user = await UserStore.create(username, password, givenname, middlename, familyname, email);

        }

        if(user){
            const token = jwt.sign({ username}, process.env.JWT_SECRET, { expiresIn: "1h" });
            return response.json(
            {
                token,
                username: `${user.username}`,
                givenName: `${user.givenName}`,
                middleName: `${user.middleName}`,
                familyName: `${user.familyName}`,
                email: `${user.email}`
            });
            }        
    }
    catch(error){
        next(error);
    }
})

export { router };