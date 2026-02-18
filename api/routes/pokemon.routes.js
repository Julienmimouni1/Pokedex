import express from "express"; 

import { getAllPokemon, getPokemonbyId } from "../controllers/pokemon.controller.js";
import { validateID } from "../middlewares/common.middleware.js";

const router = express.Router(); 

router.get('/', getAllPokemon); 
router.get('/:id', validateID, getPokemonbyId)

export default router ; 