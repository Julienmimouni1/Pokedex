import Joi from "joi"; 

export function validateTeamCreation(req, res, next){
    const createTeamSchema = Joi.object({
       name : Joi.string().required(), 
        description : Joi.string()
    }); 
    const validation  = createTeamSchema.validate(req.body); 
    if (validation.error){
        return res.status(400).json(validation.error)
    }
    next();
}

export function validateTeamUpdate(req, res, next){
    const updateTeamSchema = Joi.object({
        name: Joi.string(),
        description: Joi.string()
    }).min(1); // On exige qu'au moins un des champs soit présent dans le body. Faut qu'il y ait au moins une modif. 

    const validation = updateTeamSchema.validate(req.body);
    if (validation.error) {
        return res.status(400).json(validation.error);
    }
    next();
}