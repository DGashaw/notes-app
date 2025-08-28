import { default as request } from 'superagent';
import * as util from 'util';
import { default as DEBUG } from 'debug';
import dotenv from 'dotenv';

dotenv.config();

const debug = DEBUG("users:users-superagnet");
const debugError = DEBUG("users:error-users-superagent");

const apiKey = process.env.API_KEY;
debug(`apiKey: ${apiKey}`);


function requiredURL(path){
    const requiredUrl = new URL(process.env.USER_SERVICE_URL);
    requiredUrl.pathname = path;
    return requiredUrl.toString();
}

export async function create(username, password, givenName, middleName, familyName, email){
    const response = await request  
        .post(requiredURL('/users/create-user'))
        .send({username, password, givenName, middleName, familyName, email})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set("api_key", apiKey);
    return response.body;
}

export async function find(username){
    const response = await request
        .post(requiredURL(`/users/find/${username}`))
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('api_key', apiKey);
        debug(`response.body: ${util.inspect(response.body)}`)
    return response.body;
}

export async function userPasswordCheck(username, password){
    const response = await request
        .post(requiredURL('/users/password-check'))
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('api_key', apiKey)
        .send({ username, password });
    return response.body;
}

export async function findOrCreateUser(username, password, givenName, middleName, familyName, email)
{
    const response = await request
        .post(requiredURL("/users/find-or-create-user"))
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('api_key', apiKey)
        .send({username, password, givenName,middleName, familyName, email });
    return response.body;
}

