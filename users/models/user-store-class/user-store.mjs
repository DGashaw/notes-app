/**
 * This module is used to dynamically select a data store based on 
 * the enviroment variable
 */
import * as util from 'util';
import {default as DEBUG} from 'debug';
//import { dynamicImport } from '../../utility/dynamicImport.mjs';

const debug = DEBUG("users:user-store");
const debugError = DEBUG("users:error-user-store")

let _UsersStore = null;
/**
 * 
 * @param {string} model-represent the data store model that is going to be used
 * @returns {AbstractUsersStore} - an instance of a NotesStore class based on the dynamic selected model
 */
export async function useModel(model){
    try{
        const UserStoreModule = await import(`../db/users-${model}-database.mjs`);
        const UserStoreClass = UserStoreModule.default;
    
        _UsersStore = new UserStoreClass();
        return _UsersStore;
    }
    catch(error){
        throw new Error(`No recognized UserStore in ${model}.\nError: ${error}`);
    }
}

export {_UsersStore as UserStore };