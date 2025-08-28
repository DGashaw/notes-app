import { default as express } from 'express';
const router = new express.Router();
import { UserStore } from "../models/user-store-class/user-store.mjs";
import { default as DEBUG } from 'debug';
import * as util from 'util';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


const debug = DEBUG("users:find-user-router");
const debugError = DEBUG("users:error-find-user-router");


router.post("/:username", async(request, response) => {
    try{
        const username = request.params.username;
        const user = await UserStore.read(username);

        if(!user){
            return response.status(404).json({"error": `A user with username, ${username}, do not exist`});
        }
        
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
    catch(error){
        return response.status(500).json("find-by-username-error", error.message);
    }
})

export { router };