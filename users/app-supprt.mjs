import jwt from 'jsonwebtoken';
import * as util from "util";
import { default as DEBUG } from 'debug';

const debug = DEBUG('users:debug-app-support');
const debugError = DEBUG('users:error-app-support');

export async function authenticateToken(request, response, next){
    try{
        const authHeader = request.headers.authorization;
        if(!authHeader){
            return response.status(401).json("No token provided");
        }
        const token = authHeader && authHeader.split(" ")[1];

        if(!token) { return response.status(401).json("No token provided"); }

        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
            //Invalid or expired token
            if(error) { return response.status(403).json("Invalid/expired token"); }

            request.user = user;
            next();
        })
    }
    catch(error){
        return response.status(500);
    }
}


export async function authenticateApiKey(request, response, next){
    try{
        const apiKey = request.headers.api_key;
        if(!apiKey){ return response.status(401).json({"error" : "API Key not provided"}); }
        
        const checkApiKey = (apiKey === process.env.API_KEY) ? true : false;

        if(!checkApiKey){ return response.status(401).json({"error" : "Invalid API Key"})}

        request.apiKey = "valid and authorized";
        next();
    }
    catch(error){
        return response.status(500);
    }

}