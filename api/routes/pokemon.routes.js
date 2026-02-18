import express from "express"; 

import { getAllPokemon, getPokemonbyId } from "../controllers/pokemon.controller.js";
import { validateID } from "../middlewares/common.middleware.js";

const router = express.Router(); 

/**
 * @swagger
 * tags:
 *   name: Pokemons
 *   description: Gestion des Pokémons
 */

/**
 * @swagger
 * /pokemon:
 *   get:
 *     summary: Récupérer tous les Pokémons
 *     tags: [Pokemons]
 *     responses:
 *       200:
 *         description: Liste des Pokémons récupérée avec succès
 */
router.get('/', getAllPokemon); 

/**
 * @swagger
 * /pokemon/{id}:
 *   get:
 *     summary: Récupérer un Pokémon par son ID
 *     tags: [Pokemons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du Pokémon
 *     responses:
 *       200:
 *         description: Détails du Pokémon
 *       404:
 *         description: Pokémon non trouvé
 *       400:
 *         description: ID invalide
 */
router.get('/:id', validateID, getPokemonbyId)

export default router ; 