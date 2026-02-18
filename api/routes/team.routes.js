import express from "express"; 

import { getAllTeam, createTeam, getTeamById, updateTeam, addPokemonToTeam, deletePokemonFromTeam, deleteTeam} from "../controllers/team.controller.js";
import { validateTeamCreation, validateTeamUpdate } from "../middlewares/team.middleware.js";
import { validateID } from "../middlewares/common.middleware.js";
import { isAuthed } from "../middlewares/auth.middleware.js";

const router = express.Router(); 

router.get('/', getAllTeam); 
router.get('/:id', validateID, getTeamById)

router.post('/', isAuthed, validateTeamCreation, createTeam)
router.post('/:teamId/pokemon/:pokemonId', isAuthed, addPokemonToTeam)

router.delete('/:teamId/pokemon/:pokemonId', isAuthed, deletePokemonFromTeam)

router.delete('/:id', isAuthed, validateID, deleteTeam)

router.patch('/:id', isAuthed, validateID, validateTeamUpdate, updateTeam)

export default router ; 