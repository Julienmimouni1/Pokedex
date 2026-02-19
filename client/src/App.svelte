<script>
  import { onMount } from 'svelte';
  let pokemons = [];
  let types = [];
  let teams = [];
  let currentView = 'pokemon'; // 'pokemon', 'types', 'teams'
  let searchTerm = "";
  let pokemonSearchTerm = ""; // Recherche spécifique pour la modale d'ajout

  $: filteredPokemonsForModal = pokemons.filter(pokemon => 
    pokemon.name.toLowerCase().includes(pokemonSearchTerm.toLowerCase())
  );

  $: filteredPokemons = pokemons.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  onMount(async () => {
      // Vérifier si l'utilisateur est déjà connecté (cookie de session)
      const authRes = await fetch('/api/auth/me', { credentials: 'include' });
      if (authRes.ok) {
        user = await authRes.json();
      }

      const response = await fetch('/pokemon');
      pokemons = await response.json();
    }
);

  async function showView(view) {
    currentView = view;
    
    if (view === 'types' && types.length === 0) {
      const res = await fetch('/type');
      types = await res.json();
    }
    
    if (view === 'teams') {
      // On recharge les équipes à chaque fois pour voir les changements (création/suppression)
      const res = await fetch('/team');
      teams = await res.json();
    }
  }

let isLogin = true; // Bascule entre Connexion et Inscription
  let isCreateTeam = false; // Pour savoir si on est en mode "Création d'équipe"
  let showModal = false;
  let showAddPokemonModal = false;
  let currentTeamIdToAdd = null;
  let username = "";
  let password = "";
  let confirmPassword = "";
  let teamName = "";
  let teamDescription = "";
  let user = null;
  let message = "";

  // Gestion de la connexion
  async function handleLogin() {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      user = data.user;
      message = "";
      password = "";
      showModal = false;
    } else {
      message = data.message || data.error || "Erreur de connexion";
    }
  }

  // Gestion de l'inscription
  async function handleSignup() {
    if (password !== confirmPassword) {
      message = "Les mots de passe ne correspondent pas";
      return;
    }

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, confirm: confirmPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      user = data.user; // On connecte l'utilisateur directement
      message = "";
      showModal = false; // On ferme la modale
      password = "";
      confirmPassword = "";
    } else {
      message = data.message || data.error || "Erreur d'inscription";
    }
  }

  // Création d'une équipe
  async function handleCreateTeam() {
    const response = await fetch("/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: teamName, description: teamDescription }),
    });

    if (response.ok) {
      showModal = false;
      teamName = "";
      teamDescription = "";
      showView('teams'); // On rafraîchit la liste
    } else {
      message = "Erreur lors de la création de l'équipe";
    }
  }

  // Suppression d'une équipe
  async function handleDeleteTeam(id) {
    if (!confirm("Voulez-vous vraiment supprimer cette équipe ?")) return;
    
    await fetch(`/team/${id}`, { method: "DELETE" });
    showView('teams'); // On rafraîchit la liste
  }

  const typeColors = {
    normal: '#A8A77A', feu: '#EE8130', fire: '#EE8130', eau: '#6390F0', water: '#6390F0',
    plante: '#7AC74C', grass: '#7AC74C', electrik: '#F7D02C', electric: '#F7D02C',
    glace: '#96D9D6', ice: '#96D9D6', combat: '#C22E28', fighting: '#C22E28',
    poison: '#A33EA1', sol: '#E2BF65', ground: '#E2BF65', vol: '#A98FF3', flying: '#A98FF3',
    psy: '#F95587', psychic: '#F95587', insecte: '#A6B91A', bug: '#A6B91A',
    roche: '#B6A136', rock: '#B6A136', spectre: '#735797', ghost: '#735797',
    dragon: '#6F35FC', acier: '#B7B7CE', steel: '#B7B7CE', fee: '#D685AD', fairy: '#D685AD'
  };

  function openAddPokemonModal(teamId) {
    currentTeamIdToAdd = teamId;
    pokemonSearchTerm = "";
    showAddPokemonModal = true;
  }

  async function handleAddPokemonToTeam(pokemonId) {
    const response = await fetch(`/team/${currentTeamIdToAdd}/pokemon/${pokemonId}`, {
      method: 'POST'
    });
    
    if (response.ok) {
      showAddPokemonModal = false;
      showView('teams'); // On rafraîchit la liste pour voir le nouveau Pokémon
    } else {
      alert("Erreur lors de l'ajout du Pokémon");
    }
  }
</script>

<main>
  <header>
    <h1 class="logo">POKÉDEX</h1>
    <div class="nav-buttons">
      <input 
        type="text" 
        placeholder="Rechercher..." 
        bind:value={searchTerm} 
        on:focus={() => showView('pokemon')}
        class="search-bar"
      />
      <button on:click={() => showView('types')}>Types</button>
      <button on:click={() => showView('teams')}>Equipes</button>
    </div>
    <div class="buttons">
      {#if user}
        <span>Bienvenue {user.username}</span>
        <button class="btn-logout" on:click={() => user = null}>Déconnexion</button>
      {:else}
        <button class="btn-login" on:click={() => { isLogin = true; isCreateTeam = false; showModal = true; message = ""; }}>Connexion</button>
        <button class="btn-signup" on:click={() => { isLogin = false; isCreateTeam = false; showModal = true; message = ""; }}>Inscription</button>
      {/if}
    </div>
  </header>

  {#if currentView === 'pokemon'}
  <div class="pokemon-grid">
    {#each filteredPokemons as pokemon}
      <div class="card">
        <h3>#{pokemon.id} <br> {pokemon.name}</h3>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{pokemon.id}.png" alt={pokemon.name} />
        <div class="stats">
          <p>PV: {pokemon.hp}</p>
          <p>Atk: {pokemon.atk}</p>
          <p>Def: {pokemon.def}</p>
          <p>Atk Spé: {pokemon.atk_spe}</p>
          <p>Def Spé: {pokemon.def_spe}</p>
          <p>Vit: {pokemon.speed}</p>
        </div>
      </div>
    {/each}
  </div>
  {:else if currentView === 'types'}
    <div class="pokemon-grid">
      {#each types as type}
        <div class="type-card" style="background-color: {typeColors[type.name.toLowerCase()] || '#777'};">
          <span class="type-name">{type.name}</span>
        </div>
      {/each}
    </div>
  {:else if currentView === 'teams'}
    <!-- On change un peu la grille pour les équipes car elles prennent plus de place -->
    {#if user}
      <div class="actions">
        <button class="btn-submit" on:click={() => { isCreateTeam = true; showModal = true; message = ""; }}>
          + Créer une équipe
        </button>
      </div>
    {/if}
    <div class="teams-grid">
      {#each teams as team}
        <div class="team-card">
          <div class="card-header">
            <h3>{team.name}</h3>
            <p class="description">{team.description || 'Pas de description'}</p>
            {#if user}
              <button class="btn-delete-small" on:click={() => handleDeleteTeam(team.id)}>Supprimer</button>
            {/if}
          </div>
          <div class="roster">
            {#if team.pokemons && team.pokemons.length > 0}
              {#each team.pokemons as pokemon}
                <div class="pokemon-slot" title={pokemon.name}>
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} alt={pokemon.name} />
                  <span class="pokemon-name">{pokemon.name}</span>
                </div>
              {/each}
            {/if}
            {#if user}
              <button class="add-pokemon-slot" on:click={() => openAddPokemonModal(team.id)} title="Ajouter un Pokémon">
                <span>+</span>
              </button>
            {:else if !team.pokemons || team.pokemons.length === 0}
              <div class="empty-roster">Aucun Pokémon</div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if showModal}
    <div
      class="modal-backdrop"
      role="button"
      tabindex="0"
      on:click={() => showModal = false}
      on:keydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          showModal = false;
        }
      }}
      aria-label="Fermer la fenêtre modale"
    >
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-label={isLogin ? "Fenêtre de connexion" : "Fenêtre d'inscription"}
        tabindex="-1"
        on:click|stopPropagation
        on:keydown={(e) => {
          if (e.key === 'Escape') {
            showModal = false;
          }
        }}
      >
        {#if isCreateTeam}
          <h2>Créer une équipe</h2>
          <input type="text" placeholder="Nom de l'équipe" bind:value={teamName} />
          <input type="text" placeholder="Description" bind:value={teamDescription} />
          <button class="btn-submit" on:click={handleCreateTeam}>Créer</button>
        {:else}
          <h2>{isLogin ? "Connexion" : "Inscription"}</h2>
          <input type="text" placeholder="Pseudo" bind:value={username} />
          <input type="password" placeholder="Mot de passe" bind:value={password} />
          {#if !isLogin}
            <input type="password" placeholder="Confirmer le mot de passe" bind:value={confirmPassword} />
          {/if}
          <button class="btn-submit" on:click={isLogin ? handleLogin : handleSignup}>
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        {/if}
        {#if message} <p class="message">{message}</p> {/if}
      </div>
    </div>
  {/if}

  {#if showAddPokemonModal}
    <div class="modal-backdrop" on:click={() => showAddPokemonModal = false}>
      <div class="modal pc-box" on:click|stopPropagation>
        <h2>Choisir un Pokémon</h2>
        <input type="text" placeholder="Rechercher un Pokémon..." bind:value={pokemonSearchTerm} class="search-bar" />
        <div class="pc-grid">
          {#each filteredPokemonsForModal as pokemon}
            <div class="pc-slot" on:click={() => handleAddPokemonToTeam(pokemon.id)}>
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} alt={pokemon.name} />
              <span class="pc-name">{pokemon.name}</span>
            </div>
          {/each}
        </div>
        <button class="btn-close" on:click={() => showAddPokemonModal = false}>Annuler</button>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
  }

  header {
    display: flex;
    justify-content: space-between; /* Espace max entre le titre et les boutons */
    align-items: center; /* Centrage vertical */
    padding: 20px;
    background-color: #ff3e3e; /* Rouge Pokédex */
    border-bottom: 4px solid #222; /* Ligne noire style cartoon */
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    color: white;
  }

  .logo {
    margin: 0;
    font-family: 'Arial Black', sans-serif;
    font-size: 2rem;
    color: #ffcb05; /* Jaune Pokémon */
    text-shadow: 3px 3px 0 #2a75bb; /* Ombre Bleue */
    letter-spacing: 2px;
    -webkit-text-stroke: 1px #2a75bb;
  }

  .nav-buttons {
    display: flex;
    gap: 15px;
  }

  .buttons {
    display: flex;
    align-items: center;
    gap: 10px; /* Espace entre les boutons */
    font-weight: bold;
  }

  /* Style général des boutons "Physiques" */
  button {
    border: none;
    border-radius: 25px; /* Arrondi */
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.1s;
    text-transform: uppercase;
    font-family: sans-serif;
    box-shadow: 0 4px 0 rgba(0,0,0,0.2); /* Effet 3D */
    position: relative;
    top: 0;
  }

  button:active {
    top: 4px; /* Le bouton s'enfonce */
    box-shadow: none;
  }

  /* Boutons de navigation (Blanc) */
  .nav-buttons button {
    background-color: white;
    color: #333;
  }
  .nav-buttons button:hover {
    background-color: #f2f2f2;
  }

  .search-bar {
    padding: 10px 15px;
    border-radius: 25px;
    border: none;
    font-size: 0.9rem;
    outline: none;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  }

  /* Boutons d'action (Bleu) */
  .btn-login, .btn-signup, .btn-submit {
    background-color: #3b4cca;
    color: white;
  }
  .btn-login:hover, .btn-signup:hover, .btn-submit:hover {
    background-color: #2a3b9e;
  }

  /* Bouton Déconnexion (Rouge foncé) */
  .btn-logout {
    background-color: #cc0000;
    color: white;
    border: 1px solid white;
  }
  .btn-logout:hover {
    background-color: #a30000;
  }

  .btn-delete {
    background-color: #cc0000;
    color: white;
    margin-top: 10px;
    font-size: 0.8rem;
    padding: 5px 10px;
    display: block;
    width: 100%;
  }

  .btn-delete-small {
    background-color: #cc0000;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.7rem;
    margin-top: 5px;
  }

  .actions {
    text-align: center;
    margin: 20px 0;
  }

  .pokemon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); /* Grille responsive */
    gap: 20px;
    padding: 20px;
  }

  .card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .card img {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }

  .stats p {
    margin: 2px 0;
    font-size: 0.75rem; /* Texte un peu plus petit pour que ça rentre */
    color: #555;
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .modal {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 300px;
  }

  .modal input {
    padding: 0.5rem;
    font-size: 1rem;
  }

  .message {
    color: green;
    font-size: 0.9rem;
  }

  /* Styles pour les Types */
  .type-card {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    border-radius: 15px;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
    transition: transform 0.2s;
  }
  .type-card:hover {
    transform: scale(1.05);
  }

  /* Styles pour les Équipes */
  .teams-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
  }

  .team-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    overflow: hidden;
    border: 1px solid #e0e0e0;
    transition: transform 0.2s;
  }

  .team-card:hover {
    transform: translateY(-5px);
  }

  .card-header {
    background-color: #ffcb05;
    color: #3b4cca;
    padding: 15px;
    border-bottom: 4px solid #3b4cca;
  }

  .card-header h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .roster {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 15px;
    gap: 10px;
    background-color: #f9f9f9;
    min-height: 100px;
  }

  .pokemon-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60px;
  }

  .pokemon-slot img {
    width: 50px;
    height: 50px;
    image-rendering: pixelated;
  }
  
  .pokemon-name {
    font-size: 0.6rem;
    text-transform: capitalize;
    color: #333;
  }
  
  .empty-roster {
    color: #999;
    font-style: italic;
    align-self: center;
  }

  /* Bouton Ajouter Pokémon (+) */
  .add-pokemon-slot {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px dashed #ccc;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #ccc;
    font-size: 2rem;
    padding: 0;
    box-shadow: none;
    transition: all 0.2s;
  }

  .add-pokemon-slot:hover {
    border-color: #3b4cca;
    color: #3b4cca;
    background-color: rgba(59, 76, 202, 0.1);
    transform: scale(1.1);
  }

  /* Style PC Box pour la modale */
  .pc-box {
    max-width: 800px;
    width: 90%;
    max-height: 80vh;
    background-color: #f0f0f0;
    border: 4px solid #555;
  }

  .pc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 10px;
    overflow-y: auto;
    max-height: 50vh;
    padding: 10px;
    background-color: white;
    border: 2px inset #ccc;
    margin-top: 10px;
  }

  .pc-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 5px;
    border-radius: 5px;
  }
  .pc-slot:hover { background-color: #e0e0e0; }
  .pc-slot img { width: 60px; height: 60px; }
  .pc-name { font-size: 0.7rem; text-transform: capitalize; }
  .btn-close { background-color: #777; color: white; margin-top: 10px; }
</style>
