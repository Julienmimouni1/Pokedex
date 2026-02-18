import express from "express";
import { registerUser, loginUser, getCurrentUserInfo } from "../controllers/auth.controller.js";
import { isAuthed } from "../middlewares/auth.middleware.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestion de l'authentification
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - confirm
 *             properties:
 *               username:
 *                 type: string
 *                 description: Le pseudo de l'utilisateur (min 4 char)
 *               password:
 *                 type: string
 *                 description: Le mot de passe (min 8 char, 1 maj, 1 min, 1 chiffre)
 *               confirm:
 *                 type: string
 *                 description: Confirmation du mot de passe
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Pseudo déjà utilisé
 */
// router.post('/signup', authController.registerUser);
router.post('/signup', registerUser);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne le token JWT
 *       401:
 *         description: Identifiants incorrects
 */
router.post('/login', loginUser);

// Route protégée : on utilise le middleware isAuthed avant le contrôleur
router.get('/me', isAuthed, getCurrentUserInfo);

export default router;
