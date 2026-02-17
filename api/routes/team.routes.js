import express from "express"; 

import { getAllTeam, createTeam, getTeamById} from "../controllers/team.controller.js";
import { validateTeamCreation } from "../middlewares/team.middleware.js";
import { validateID } from "../middlewares/common.middleware.js";

const router = express.Router(); 

router.get('/', getAllTeam); 
router.get('/:id', validateID, getTeamById)

router.post('/', validateTeamCreation, createTeam)

export default router ; 