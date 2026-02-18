import express from "express"; 

import { getAllType, getTypeById } from "../controllers/type.controller.js";

const router = express.Router(); 

router.get('/', getAllType)
router.get('/:id', getTypeById )

export default router ; 
