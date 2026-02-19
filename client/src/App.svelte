<script>
  import { onMount } from 'svelte';
  let pokemons = [];

  onMount(async () => {
      const response = await fetch('http://localhost:3000/pokemon');
      pokemons = await response.json();
     
    }
);

let isLogin = true; // Bascule entre Connexion et Inscription
  let showModal = false;
  let username = "";
  let password = "";
  let confirm = "";
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
    if (password !== confirm) {
      message = "Les mots de passe ne correspondent pas";
      return;
    }

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, confirm }),
    });

    const data = await response.json();

    if (response.ok) {
      message = "Inscription réussie ! Connectez-vous.";
      isLogin = true; // Retour à la connexion
      password = "";
      confirm = "";
    } else {
      message = data.message || data.error || "Erreur d'inscription";
    }
  }
</script>

<main>
  <header>
    <h1>POKEDEX</h1>
    <div class="nav-buttons">
      <button>Pokemon</button>
      <button>Types</button>
      <button>Equipes</button>
    </div>
    <div class="buttons">
      {#if user}
        <span>Bienvenue {user.username}</span>
        <button on:click={() => user = null}>Déconnexion</button>
      {:else}
        <button on:click={() => { isLogin = true; showModal = true; message = ""; }}>Connexion</button>
        <button on:click={() => { isLogin = false; showModal = true; message = ""; }}>Inscription</button>
      {/if}
    </div>
  </header>

  <div class="pokemon-grid">
    {#each pokemons as pokemon}
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
        <h2>{isLogin ? "Connexion" : "Inscription"}</h2>
        <input type="text" placeholder="Pseudo" bind:value={username} />
        <input type="password" placeholder="Mot de passe" bind:value={password} />
        {#if !isLogin}
          <input type="password" placeholder="Confirmer le mot de passe" bind:value={confirm} />
        {/if}
        <button on:click={isLogin ? handleLogin : handleSignup}>
          {isLogin ? "Se connecter" : "S'inscrire"}
        </button>
        {#if message} <p class="message">{message}</p> {/if}
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
    background-color: #f0f0f0;
    border-bottom: 1px solid #ccc;
  }

  .nav-buttons {
    display: flex;
    gap: 10px;
  }

  .buttons {
    display: flex;
    gap: 10px; /* Espace entre les boutons */
  }

  .pokemon-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr); /* Force 8 colonnes */
    gap: 10px;
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
</style>
