import { Sequelize } from "sequelize";
import { default as DEBUG } from 'debug';

const debug = DEBUG('notes:notes-sequelize');
const debugError = DEBUG('notes:error-sequelize');


//Since we define a Note class, we call this as SQNote - SequelizeNote
export class SQNote extends Sequelize.Model{
    static initModel(sequelize){
        SQNote.init(
        {
            notekey: {type: Sequelize.DataTypes.STRING,
                      primaryKey: true,
                      unique: true
                    },
            title: {type: Sequelize.DataTypes.STRING},
            body: {type: Sequelize.DataTypes.TEXT}
        },
        {   
            sequelize,
            modelName: 'SQNote',
            tableName: 'notes',
            timestamps: false
        }
    );

    }
}
