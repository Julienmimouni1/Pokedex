import { Type } from "../models/type.model.js";
import { Pokemon } from "../models/pokemon.model.js";

export async function getAllType(req,res){
    const types = await Type.findAll({ 
        include: {
            model: Pokemon,
            through: {
                attributes: [] // Permet de ne pas afficher les détails techniques de la table de liaison
            }
        }
    })
    res.status(200).json(types);
    }
    
    
export async function getTypeById(req, res){
    const id = req.params.id; 
    const type = await Type.findByPk(id, {
        include : {
            model : Pokemon,
            through : {
                attributes : []
            }
        }
    }); 
    if (!type){
        return res.status(404).json({error:'Type not found'})
    }
    res.status(200).json(type); 
}
