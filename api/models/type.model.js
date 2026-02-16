import { DataTypes, Model } from "sequelize";
import {sequelize}from "../database.js";

class Type extends Model {}

Type.init({
  name : {
    type : DataTypes.STRING(225), 
    allowNull : false, 
  }, 
  color : {
    type : DataTypes.STRING(7)
  },
  
    sequelize,  
    tableName : "type"
  }
)