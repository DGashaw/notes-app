import { default as express } from 'express';
import { authenticateApiKey } from '../app-supprt.mjs';
import { default as DEBUG } from 'debug';
import { UserStore } from '../models/user-store-class/user-store.mjs';

const debug = DEBUG("users:delete-user-router");
const debugError = DEBUG("users:error-delete-users-router");

const router = express.Router();

router.post("/delete-user/:username", authenticateApiKey, async(request, response) => {
    try{
        const username = request.params.username;
        const user = await UserStore.read(username);

        if(!user){
            return response.status(400).json({"error": `User with username, ${username}, can not be found`});
        }

        const result = await UserStore.destroy(username);
        if(!result){
            return response.status(500).json({"error": "Unable to delete a user"});
        }
        return response.status(200).json(result);
    }
    catch(error){
        return response.status(500).json({"delete-user-error": error.message});
    }
    
})

export { router };