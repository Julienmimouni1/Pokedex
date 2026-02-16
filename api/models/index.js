import Pokemon from "./pokemon.model.js"
import Type from "./type.model.js"
import Team from "./team.model.js"
import { sequelize } from "./sequelize.client.js";


Pokemon.belongsToMany(Type, {
    through : "pokemon_type",
    as : "types", 
    foreignKey : {
        name : "pokemon_id", 
        allowNull : false, 
    }, 
    onDelete : "CASCADE"
}); 

Type.belongsToMany(Pokemon, {
through : "pokemon_type", 
foreignKey : "type_id", 
}); 


Pokemon.belongsToMany(Team, {
    through : 'team_pokemon', 
    foreignKey : "pokemon_id", 
    otherKey : "team_id", 
    as : "teams", 
}); 

Team.belongsToMany(Pokemon,{
    through : 'team_pokemon', 
    foreignKey : 'team_id', 
    otherKey : 'pokemon_id', 
    as : "pokemons"
}); 

export {Pokemon, Type, Team, sequelize} ; 