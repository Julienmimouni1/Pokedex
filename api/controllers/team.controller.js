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

    