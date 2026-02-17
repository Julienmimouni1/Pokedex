import { Team } from "../models/team.model.js";

export async function getAllTeam(req, res){
    const teams = await Team.findAll({
    })
    res.status(200).json(teams)
} ;

export async function createTeam(req, res){
    const teams = await Team.create(req.body); 
    res.status(201).json(teams);
}

export async function getTeamById(req,res){
    const team = await Team.findByPk(req.params.id); 
    if(!team){
        return res.status(404).json({error : 'Team not found'}); 
    }
    res.status(200).json(team);
    }

export async function updateTeam(req, res){
    // on déstructure car la méthode update de Sequelize nous renvoit un tableau contenant le nombre de lignes modifiées 
    // et les lignes qui ont été modifiées 
    const [updatedCount, updatedTeam] = await Team.update(req.body,{
        where : {
            id : req.params.id  
        }, 
        // Par défaut, un UPDATE SQL ne renvoit pas les données modifiées, juste le nombre de lignes touchées.
         // renvoit alors la team complète après la modification, ça évite de refaire un findByPk ensuite.  
        returning : true 
    }); 
    // on vérifie si la base de données a modifié quelque chose, si compteur à 0 alors aucune équipe avec cet ID n'existe.
    if (updatedCount ===0){
        return res.status(404).json ({error: 'Team not found'}) ; 
    }; 
    // On renvoie l'équipe modifiée au format JSON. UpdatedTeam est un tableau et comme on a filtré par ID, on sait qu'il 
    // y a un seul résultat, donc on prend le premier élément du tableau. 
    res.status(200).json(updatedTeam[0]); 
}