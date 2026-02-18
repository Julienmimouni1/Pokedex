import jwt from "jsonwebtoken";
import { HttpUnauthorizedError } from "../errors/http.errors.js";

export function isAuthed(req, res, next) {
    // 1. Récupérer le token depuis le cookie (prioritaire) ou le header Authorization
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
        // Support fallback pour les clients non-navigateurs ou Swagger
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        throw new HttpUnauthorizedError("Token manquant");
    }

    try {
        // 3. Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_temporaire");
        
        // 4. Ajouter l'ID utilisateur à la requête pour les contrôleurs suivants
        req.userId = decoded.userId;
        
        next();
    } catch (error) {
        throw new HttpUnauthorizedError("Token invalide ou expiré");
    }
}
