import { default as express } from 'express';
const router = new express.Router();
import { UserStore } from "../models/user-store-class/user-store.mjs";
import { default as DEBUG } from 'debug';
import * as util from 'util';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


const debug = DEBUG("users:user-login-router");
const debugError = DEBUG("users:error-user-login-router");

router.post("/login", async(request, response) => {
    try{
        const { username, password } = request.body;
        const user = await UserStore.read(username);
        if(!user){
            return response.status(401).json("Error: Invalid credentials");
        }

        const validUser = await bcrypt.compare(password, user.password);
        
        if(!validUser){
            return response.status(401).json("Error: Invalid credentials");
        }
        else{
            const token = jwt.sign({ username}, process.env.JWT_SECRET, { expiresIn: "1h" });
            return response.json({token});
        }
        
    }
    catch(error){
        return response.status(500).json({"login-in-error": error.message});

    }
})

export { router };