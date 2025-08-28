import { __dirname } from "../appRootDirectory.mjs";
import path from 'node:path';
import { pathToFileURL } from "node:url";
import { default as DEBUG } from 'debug';

const debug = DEBUG('notes:dynamic-import');
const debugError = DEBUG('notes:error-dynmaic-import');

/**
 * 
 * @param {string} relativePath - the relative path of the module from the cllaer file
 * @returns {Promise<any>} The imported module
 */
export async function dynamicImport(relativePath){
    const absolutePath = path.join(__dirname, relativePath);
    debug(`absolute-path: ${absolutePath}`);
    debug(`import: ${await JSON.stringify(import(pathToFileURL(absolutePath)))}`);

    return import(pathToFileURL(absolutePath));
}