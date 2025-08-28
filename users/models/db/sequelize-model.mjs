import { Sequelize } from "sequelize";
import { default as DEBUG } from 'debug';

const debug = DEBUG("users:sequelize-model");
const debugError = DEBUG("users:error-sequelize-model");

export class SQUser extends Sequelize.Model {
    static initModel(sequelize){
        SQUser.init({
            username: {type: Sequelize.DataTypes.STRING, unique: true, primaryKey: true},
            password: {type: Sequelize.DataTypes.STRING},
            familyname: {type: Sequelize.DataTypes.STRING},
            givenname: {type: Sequelize.DataTypes.STRING},
            middlename: {type: Sequelize.DataTypes.STRING},
            email: {type: Sequelize.DataTypes.STRING},
        }, {
            sequelize,
            modelName: 'SQUser',
            tableName: 'users',
            timestamps: false
        });
    }
}