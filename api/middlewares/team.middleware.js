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
