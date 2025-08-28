import { Sequelize } from "sequelize";
import { default as jsyaml } from 'js-yaml';
import { readFile } from 'node:fs/promises';
import * as util from 'util';
import { default as DEBUG } from 'debug';

const debug = DEBUG('users:sequelize');
const debugError = DEBUG('users:error-sequelize');

let sequelizeObj;
export async function connectToDatabaseWithSequilize(){
    if(sequelizeObj){ return sequelizeObj; }

    const yamlText = await readFile(process.env.SEQUELIZE_CONNECT, 'utf-8');
    const params = jsyaml.load(yamlText, 'utf-8');

    sequelizeObj = new Sequelize(
        params.dbname,
        params.username,
        params.password,
        {
            host: params.params.host,
            dialect: params.params.dialect,
            port: params.params.port,
            logging: false

        }
    );

    //Verify it's a Sequelize instance before returning
    if (!(sequelizeObj instanceof Sequelize)) {
        throw new Error("Sequelize instance creation failed");
    }

    try{
        await sequelizeObj.authenticate();
    }
    catch(error){
        throw new Error(`Unable to connect to database.\nError: ${error}`);
    }

    return sequelizeObj;

}

export async function close(){
    if(sequelizeObj){
        sequelizeObj.close();
    }
    sequelizeObj = undefined;
}


