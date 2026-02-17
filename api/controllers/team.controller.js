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

