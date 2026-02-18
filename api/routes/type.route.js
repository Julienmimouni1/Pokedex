import express from "express"; 

import { getAllType, getTypeById } from "../controllers/type.controller.js";

const router = express.Router(); 

/**
 * @swagger
 * tags:
 *   name: Types
 *   description: Gestion des types de Pokémons
 */

/**
 * @swagger
 * /type:
 *   get:
 *     summary: Récupérer tous les types
 *     tags: [Types]
 *     responses:
 *       200:
 *         description: Liste des types récupérée avec succès
 */
router.get('/', getAllType)

/**
 * @swagger
 * /type/{id}:
 *   get:
 *     summary: Récupérer un type par son ID
 *     tags: [Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du type
 *     responses:
 *       200:
 *         description: Détails du type
 *       404:
 *         description: Type non trouvé
 */
router.get('/:id', getTypeById )

export default router ; 
