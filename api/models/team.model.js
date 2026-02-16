import { DataTypes, Model } from "sequelize";
import {sequelize} from "./sequelize.client.js";

export class Team extends Model {}

Team.init({
  name : {
    type : DataTypes.STRING(225), 
    allowNull : false, 
  }, 
  description : {
    type : DataTypes.TEXT
  },
  }, {
    sequelize,  
    tableName : "team"
  }
)