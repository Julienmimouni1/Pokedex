import express from "express";
import { registerUser, loginUser, getCurrentUserInfo } from "../controllers/auth.controller.js";
import { isAuthed } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);

// Route protégée : on utilise le middleware isAuthed avant le contrôleur
router.get('/me', isAuthed, getCurrentUserInfo);

export default router;
