import Joi from "joi"; 
import jwt from "jsonwebtoken"; 
import argon2 from "argon2"; 
import { HttpBadRequestError, HttpConflictError, httpStatusCodes, HttpUnauthorizedError, HttpNotFoundError } from "../errors/http.errors.js";

import {User} from "../models/user.model.js";

export async function registerUser(req, res){
       const registerUserSchema = Joi.object({
        username : Joi.string().min(4).required(), // string au moins 4 caractères, obligatoire
        password : Joi.string().min(8).regex(/[0-9]/).regex(/[a-z]/).regex(/[A-Z]/).required(), // - password : au moins 8 caractères, 1 chiffre, 1 majuscule, 1 minuscule
        confirm: Joi.string().min(8).regex(/[0-9]/).regex(/[a-z]/).regex(/[A-Z]/).required() // Alternativement : Joi.ref('password')
       }); 

       // On vérifie que le mdp et la confirmation correspondent 
       const {username, password, confirm} = Joi.attempt(req.body, registerUserSchema); 
       if (password!==confirm){
        throw new HttpBadRequestError("Le mot de passe et sa confirmation ne correspondent pas");
       }
       // on vérifie sir le username n'est pas déjà pris 
       const alreadyExistingUser = await User.findOne({where : {username }}); 
       if (alreadyExistingUser){
        throw new HttpConflictError("Ce pseudo est déjà utilisé");
       }
       // on hache le mot de passe à l'aide de argon2 
       const hashedPassword = await argon2.hash(password); 

       // On enregistre l'utilisateur en BDD via le modèle User
       const createdUser = await User.create({
        username: username, 
        password : hashedPassword // on enregistre le mdp haché dans la BDD
       }); 
       // On renvoit la confirmation de création de compte au client ( sans renvoyer le mdp)
       res.status(httpStatusCodes.CREATED).json({
        id : createdUser.id, 
        username : createdUser.username, 
        created_at : createdUser.created_at, 
        updated_at : createdUser.updated_at
       }); 

       } 
    


    export async function loginUser(req, res){
        // on récupère le body (username + mdp) et on valide 
        const loginUserSchema = Joi.object({
            username : Joi.string().required(), 
            password : Joi.string().required(),
            }); 

        const {username, password} = Joi.attempt(req.body, loginUserSchema); 
        
        // Récupérer l'utilisateur en BDD et si KO alors 401 : mauvais couple username/mdp 
        const user = await User.findOne({ where : {username}}) ; 
        if (!user){
            throw new HttpUnauthorizedError("Le pseudo et le mot de passe ne correspondent pas");
        }

        // on compare le MDP stocké (haché) avec le MDP fourni
        // - SI KO : 401 : mauvais couple username/mdp
        const isMatching = await argon2.verify(user.password, password);
        if (! isMatching) {
            throw new HttpUnauthorizedError("Le pseudo et le mot de passe ne correspondent pas");
    }

    // On génère le token d'accès JWT : 
    // Payload : {userId + username}
    // Durée de vie : 24h 
    // signature : clé secrète à génerer et à stocker dans le .env 

    const token = jwt.sign(
        {userId : user.id, username : user.username,}, // Ca c'est le payload. J'ai pas encore géré les rôles mais il faudra que j'indique le rôle user. 
        process.env.JWT_SECRET || "secret_temporaire", // signature (fallback si .env manquant)
        {expiresIn: "24h"}
    ); 
    // on renvoie le token ainsi que le user 
    res.json({
      token,
      message : "Connexion réussie", 
      user: {
        id: user.id,
        role: user.role,
        username: user.username,
        created_at: user.created_at,
        updated_at: user.updated_at
      } });
    }

    // Cette fonction sert à recharger l'utilisateur quand on rafraichit la page
  export async function getCurrentUserInfo(req, res){
    const userId = req.userId ; 

    // on récupère le user (sans son mdp)
    const user = await User.findByPk(userId, {
        attributes : {exclude : ['password']}
    });
    if (!user){
        throw new HttpNotFoundError("Utilisateur introuvable");
    }
    // On le renvoie
    res.json(user);
};