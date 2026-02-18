import jwt from "jsonwebtoken";
import { HttpUnauthorizedError } from "../errors/http.errors.js";

export function isAuthed(req, res, next) {
    // 1. Récupérer le header "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        throw new HttpUnauthorizedError("Token manquant");
    }

    // 2. Extraire le token (on enlève "Bearer ")
    const token = authHeader.split(" ")[1];

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
