import { Pokemon } from "../models/pokemon.model.js";

export async function getAllPokemon(req, res){
const pokemons = await Pokemon.findAll({
})
res.status(200).json(pokemons)
}; 


