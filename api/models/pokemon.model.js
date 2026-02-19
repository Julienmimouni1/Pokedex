import { DataTypes, Model } from "sequelize";
import {sequelize}from "./sequelize.client.js";

export class Pokemon extends Model {}

Pokemon.init({
  name : {
    type : DataTypes.STRING(225), 
    allowNull : false, 
    unique : true, 
  }, 
  hp : { 
    type : DataTypes.INTEGER, // On pourait mettre max 100 car c'est 100 HP max je crois 
    allowNull : false, 
  },
  atk: { 
    type : DataTypes.INTEGER, // On pourait mettre max 100 
    allowNull : false, 
  }, 
  def: { 
    type : DataTypes.INTEGER, // On pourait mettre max 100 
    allowNull : false, 
  },
  atk_spe: { 
    type : DataTypes.INTEGER, // On pourait mettre max 100 
    allowNull : false, 
  },
  def_spe: { 
    type : DataTypes.INTEGER, // On pourait mettre max 100 
    allowNull : false, 
  },
  speed: { 
    type : DataTypes.INTEGER, // On pourait mettre max 100
     
  },
  }, {
    sequelize,  
    tableName : "pokemon"
  }
)