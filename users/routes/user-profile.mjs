import { default as express } from 'express';
const router = new express.Router();
import { UserStore } from "../models/user-store-class/user-store.mjs";
import { default as DEBUG } from 'debug';
import * as util from 'util';
import jwt from "jsonwebtoken";
import  { authenticateToken } from '../app-supprt.mjs';

const debug = DEBUG('users:user-profile');
const debugError = DEBUG('users:error-user-profile');


router.get("/profile", authenticateToken, async(request, response) => {
    response.json({message: `Welcome ${request.user.username}`, username: `${request.user.username}`});

})

export { router };