import {readFile} from 'node:fs/promises'
import {default as jsyaml} from 'js-yaml';
import  Sequelize from 'sequelize'
import { default as DEBUG } from 'debug';

const debug = DEBUG('notes:sequelize-model');
const debugError = DEBUG('notes:error-sequelize-model');


let sequelizeObj;

export async function connectToDatabaseWithSequilize() {
    if(sequelizeObj === undefined){
        const yamlText = await readFile(process.env.SEQUELIZE_CONNECT, 'utf-8');
        const params = jsyaml.load(yamlText, 'utf-8');
    

        /**
         * All the if clauses are need just in-case yaml file don't exist
         * and the attributes for the databases are passed as an enviromental
         * variables
         */
        if(typeof process.env.SEQUELIZE_DBNAME !== 'undefined' &&
            process.env.SEQUELIZE_DBNAME !== ''){
                params.dbname = process.env.SEQUELIZE_DBNAME;
            }
        if(typeof process.env.SEQUELIZE_DBUSER !== 'undefined' &&
            process.env.SEQUELIZE_DBUSER !== ''){
                params.username = process.env.SEQUELIZE_DBUSER;
            }
        if(typeof process.env.SEQUELIZE_DBPASSWD !== 'undefined' &&
            process.env.SEQUELIZE_DBPASSWD !== ''){
                params.password = process.env.SEQUELIZE_DBPASSWD;
            }
        if(typeof process.env.SEQUELIZE_DBHOST !== 'undefined' &&
            process.env.SEQUELIZE_DBHOST !== ''){
                params.params.host = process.env.SEQUELIZE_DBHOST;
            }
        if(typeof process.env.SEQUELIZE_DBPORT !== 'undefined' &&
            process.env.SEQUELIZE_DBPORT !== ''){
                params.params.port = process.env.SEQUELIZE_DBPORT;
            }
        if(typeof process.env.SEQUELIZE_DBDILECT !== 'undefined' &&
            process.env.SEQUELIZE_DBDILECT !== ''){
                params.params.dialect = process.env.SEQUELIZE_DBDILECT;
            }

        sequelizeObj = new Sequelize(params.dbname,
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
            //Test the connection by authenticate
            await sequelizeObj.authenticate();
        }
        catch(error){
            throw new Error(`Unable to connect to database.\nError: ${error}`);
        }
        
        
    }

    return sequelizeObj;
}

export async function close(){
    if(sequelizeObj){
        await sequelizeObj.close();
    }
    sequelizeObj = undefined;
}