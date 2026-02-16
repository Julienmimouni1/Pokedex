import express from "express"; 

import { getAllPokemon } from "../controllers/pokemon.controller.js";

const router = express.Router(); 

router.get('/', getAllPokemon); 

export default router ; 