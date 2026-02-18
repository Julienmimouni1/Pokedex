import express from "express"; 

import { getAllTeam, createTeam, getTeamById, updateTeam, addPokemonToTeam, deletePokemonFromTeam, deleteTeam} from "../controllers/team.controller.js";
import { validateTeamCreation, validateTeamUpdate } from "../middlewares/team.middleware.js";
import { validateID } from "../middlewares/common.middleware.js";
import { isAuthed } from "../middlewares/auth.middleware.js";

const router = express.Router(); 

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: Gestion des équipes de Pokémons
 */

/**
 * @swagger
 * /team:
 *   get:
 *     summary: Récupérer toutes les équipes
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: Liste des équipes récupérée avec succès
 */
router.get('/', getAllTeam); 

/**
 * @swagger
 * /team/{id}:
 *   get:
 *     summary: Récupérer une équipe par son ID
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'équipe
 *     responses:
 *       200:
 *         description: Détails de l'équipe
 *       404:
 *         description: Équipe non trouvée
 *       400:
 *         description: ID invalide
 */
router.get('/:id', validateID, getTeamById)

/**
 * @swagger
 * /team:
 *   post:
 *     summary: Créer une nouvelle équipe
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Équipe créée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé (Token manquant ou invalide)
 */
router.post('/', isAuthed, validateTeamCreation, createTeam)

/**
 * @swagger
 * /team/{teamId}/pokemon/{pokemonId}:
 *   post:
 *     summary: Ajouter un Pokémon à une équipe
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'équipe
 *       - in: path
 *         name: pokemonId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du Pokémon
 *     responses:
 *       200:
 *         description: Pokémon ajouté à l'équipe
 *       404:
 *         description: Équipe ou Pokémon non trouvé
 *       401:
 *         description: Non autorisé
 */
router.post('/:teamId/pokemon/:pokemonId', isAuthed, addPokemonToTeam)

/**
 * @swagger
 * /team/{teamId}/pokemon/{pokemonId}:
 *   delete:
 *     summary: Retirer un Pokémon d'une équipe
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'équipe
 *       - in: path
 *         name: pokemonId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du Pokémon
 *     responses:
 *       200:
 *         description: Pokémon retiré de l'équipe
 *       404:
 *         description: Équipe ou Pokémon non trouvé
 *       401:
 *         description: Non autorisé
 */
router.delete('/:teamId/pokemon/:pokemonId', isAuthed, deletePokemonFromTeam)

/**
 * @swagger
 * /team/{id}:
 *   delete:
 *     summary: Supprimer une équipe
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'équipe à supprimer
 *     responses:
 *       204:
 *         description: Équipe supprimée avec succès
 *       404:
 *         description: Équipe non trouvée
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', isAuthed, validateID, deleteTeam)

/**
 * @swagger
 * /team/{id}:
 *   patch:
 *     summary: Mettre à jour une équipe
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'équipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Équipe mise à jour
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Équipe non trouvée
 *       401:
 *         description: Non autorisé
 */
router.patch('/:id', isAuthed, validateID, validateTeamUpdate, updateTeam)

export default router ; 