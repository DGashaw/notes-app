import { default as DEBUG } from 'debug';
import { connectToDatabaseWithSequilize, close as closeSequelizeConnection } from "./sequelize.mjs";
import { SQUser } from "./sequelize-model.mjs";
import { User, AbstarctUserStore } from "../user-store-class/user.mjs"
import bcrypt from "bcrypt";
import * as util from 'util';

const debug = DEBUG("users:users-postgres-database");
const debugError = DEBUG("users:error-postgres-database");

let initialize = false; 

async function initializeAndConnect(){
    const sequelize = await connectToDatabaseWithSequilize();

    if(!initialize){
        SQUser.initModel(sequelize);
        await SQUser.sync();
        initialize = true;
    }

    return sequelize;
}



export default class SequelizeUserStore extends AbstarctUserStore{

    async close(){
        if(initialize){
            await closeSequelizeConnection();
            initialize = false;
        }
    }

    async create(username, password, givenName, middleName, familyName, email){
        try{
            await initializeAndConnect();
        
            const squser = await SQUser.create({
                username: username, 
                password: password, 
                givenname: givenName, 
                middlename: middleName, 
                familyname: familyName, 
                email: email
            });
            return {"username": username, "action": "created"};
        }
        catch(error){
            throw new Error(`Unable to create new user\nError Details: ${error.message}`);
        }
        }
        

    async read(username) {
        try{
            await initializeAndConnect();

            const user = await SQUser.findOne({where: {username}});
            if(user){
                return new User(user.username, user.password, user.givenname, user.middlename, user.familyname, user.email);
            }
            else{ return null; }
            }
        catch(error){
            throw new Error(`Error occurred while reading a user\nError detail: ${error.message}`);
        }
        }

    async update(username, updateObject) {
        try{
            await initializeAndConnect();

            await SQUser.update(updateObject, {where: {"username": username}});
            
            return {"username": username, "action": "updated"}
        }
        catch(error){
            throw error;
        }
    }
    async destroy(username) {
        try{
            await initializeAndConnect();

            const user = await this.read(username);

            if(!user){
                throw new Error(`User with username, ${username}, can not be found`);
            }

            await SQUser.destroy({where: {"username": username}});
            return {"username": username, "action": "deleted"};
        }
        catch(error){
            throw error;
        }
    }
    async usernamelist() {
        try{
            await initializeAndConnect();
            const users = await SQUser.findAll({ attributes: ['username'] });

            const usernames = users.map(user => {
                return user.username;
            });

            return usernames;
        }
        catch(error){
            throw error;
        }
        
    }
    async count() {}

}