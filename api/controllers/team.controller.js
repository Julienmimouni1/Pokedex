import { Team } from "../models/team.model.js";
import { Pokemon } from "../models/pokemon.model.js";

export async function getAllTeam(req, res){
    const teams = await Team.findAll({
        include: {
            model: Pokemon,
            as: 'pokemons',
            through: {
                attributes: [] // Permet de ne pas afficher les détails techniques de la table de liaison
            }
        }
    })
    res.status(200).json(teams)
} ;

export async function createTeam(req, res){
    const teams = await Team.create(req.body); 
    res.status(201).json(teams);
}

export async function getTeamById(req,res){
    const team = await Team.findByPk(req.params.id, {
        include: {
            model: Pokemon,
            as: 'pokemons',
            through: {
                attributes: []
            }
        }
    }); 
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

export async function addPokemonToTeam(req, res){
    // On récupère les IDs définis dans la route (/:teamId/pokemon/:pokemonId)
    const { teamId, pokemonId } = req.params;

    const team = await Team.findByPk(teamId);
    if (!team) {
        return res.status(404).json({ error: 'Team not found' });
    }

    const pokemon = await Pokemon.findByPk(pokemonId);
    if (!pokemon) {
        return res.status(404).json({ error: 'Pokemon not found' });
    }
// cela permet d'executer une requête SQL INSERT dans ma table de liaison. Exemple: Si team a l'ID 1 (Team Rocket) et pokemon a l'ID 25 (Pikachu),
// Sequelize va executer quelque chose comme ça : INSERT INTO "team_pokemon" ("team_id", "pokemon_id") VALUES (1, 25);
// en fait, ca modifie pas la table Team ni la table Pokemon mais ca crée uniquement le lien entre les deux tables. 
    await team.addPokemon(pokemon);
    res.status(200).json(team);
}

export async function deletePokemonFromTeam(req, res){
    const { teamId, pokemonId } = req.params;

    const team = await Team.findByPk(teamId);
    if (!team) {
        return res.status(404).json({ error: 'Team not found' });
    }

    const pokemon = await Pokemon.findByPk(pokemonId);
    if (!pokemon) {
        return res.status(404).json({ error: 'Pokemon not found' });
    }

    await team.removePokemon(pokemon);
    res.status(200).json(team);
}

export async function deleteTeam(req, res){
    const deletedTeam = await Team.destroy({
        where : {
            id : req.params.id 
        }
    })
    if (deletedTeam === 0) {
        return res.status(404).json({error : 'Team not found'});
    }
    res.status(204).send(); 
}