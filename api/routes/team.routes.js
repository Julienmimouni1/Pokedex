import express from "express"; 

import { getAllTeam, createTeam, getTeamById, updateTeam, addPokemonToTeam} from "../controllers/team.controller.js";
import { validateTeamCreation, validateTeamUpdate } from "../middlewares/team.middleware.js";
import { validateID } from "../middlewares/common.middleware.js";

const router = express.Router(); 

router.get('/', getAllTeam); 
router.get('/:id', validateID, getTeamById)

router.post('/', validateTeamCreation, createTeam)
router.post('/:teamId/pokemon/:pokemonId', addPokemonToTeam)

router.patch('/:id', validateID, validateTeamUpdate, updateTeam)

export default router ; 