import Joi from "joi"; 
import jwt from "jsonwebtoken"; 
import argon2 from "argon2"; 
import { HttpBadRequestError, HttpConflictError, httpStatusCodes, HttpUnauthorizedError } from "../errors/http.errors.js";

import {User} from "../models/user.model.js";

export const authController = {
    async registerUser(req, res){
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
    }
