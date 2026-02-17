import express from "express"; 

import { getAllTeam, createTeam} from "../controllers/team.controller.js";
import { validateTeamCreation } from "../middlewares/team.middleware.js";

const router = express.Router(); 

router.get('/', getAllTeam); 

router.post('/', validateTeamCreation, createTeam)

export default router ; 