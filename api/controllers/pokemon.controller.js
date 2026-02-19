import { Pokemon } from "../models/pokemon.model.js";

export async function getAllPokemon(req, res){
const pokemons = await Pokemon.findAll({
    raw: true // Force Sequelize à renvoyer les vraies colonnes de la BDD (incluant speed)
})
res.status(200).json(pokemons)
}; 

export async function getPokemonbyId(req, res){
    const pokemon = await Pokemon.findByPk(req.params.id, { raw: true }); 
    if (!pokemon){
        return res.status(404).json({error:'Pokemon not found'}); 
    }; 
    res.status(200).json(pokemon);

}
