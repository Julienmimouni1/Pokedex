import {DataTypes, Model} from 'sequelize' ; 
import {sequelize} from './sequelize.client.js'; 

export class User extends Model {} 

User.init ({
    username : {
        type : DataTypes.TEXT, 
        unique : true, 
        allowNull : false
    },
    password : {
        type : DataTypes.TEXT, //TEXT = illimité 
        allowNull : False 
    }, 

    // Pour l'instant je n'ai pas gérer les rôles. 
}, {
    sequelize, 
    modelName : "User", 
    tableName : "user"
}, 
)