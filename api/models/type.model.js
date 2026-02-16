import { DataTypes, Model } from "sequelize";
import {sequelize} from "./sequelize.client.js";

export class Type extends Model {}

Type.init({
  name : {
    type : DataTypes.STRING(225), 
    allowNull : false, 
  }, 
  color : {
    type : DataTypes.STRING(7)
  },
  }, {
    sequelize,  
    tableName : "type"
  }
)