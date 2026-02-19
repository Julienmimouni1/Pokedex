<script>
  import { onMount } from 'svelte';
  let pokemons = [];

  onMount(async () => {
      const response = await fetch('http://localhost:3000/pokemon');
      pokemons = await response.json();
     
    }
);
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
      <button>Connexion</button>
      <button>Inscription</button>
    </div>
  </header>

  <div class="pokemon-grid">
    {#each pokemons as pokemon}
      <div class="card">
        <h3>#{pokemon.id} <br> {pokemon.name}</h3>
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

  .stats p {
    margin: 2px 0;
    font-size: 0.75rem; /* Texte un peu plus petit pour que ça rentre */
    color: #555;
  }
</style>
