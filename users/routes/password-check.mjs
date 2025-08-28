import { default as express } from 'express';
import { UserStore } from "../models/user-store-class/user-store.mjs";
import { default as DEBUG } from 'debug';
import * as util from 'util';
import bcrypt from 'bcrypt';
import { authenticateApiKey } from '../app-supprt.mjs';


const router = express.Router();
const debug = DEBUG('users:password-check');
const debugError = DEBUG("users:error-password-check");


router.post("/password-check", authenticateApiKey, async(request, response) => {
    try{
        const {username, password} = request.body;
        const currentUser = await UserStore.read(username);
        
        if(!currentUser){
            return response.status(400).json({"password-check": false, 
                                       "username": username, 
                                       "message": "Unable to find a user"
                                    });
        }
        const passwordCheck = await bcrypt.compare(password, currentUser.password);
        
        if(!passwordCheck){
            return response.status(401).json({"password-check": false, "username": username});
        }

        return response.status(200).json({"password-check": true, "username": username});

        
    }
    catch(error){
        response.status(500).json({"password-check-error": error.message});
    }
})

export { router };
