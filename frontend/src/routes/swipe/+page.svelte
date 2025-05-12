<script lang="ts">
  import GameCard from '$lib/components/GameCard.svelte';
  import { onMount } from 'svelte';
  import type { Game } from '$lib/models/game';

  let games: Game[] = [];
  let error: string | null = null;
  let swipedCardIndex: number | null = null;
  let swipeDirection: 'left' | 'right' | null = null;

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const apiParams = new URLSearchParams();

    if (urlParams.has('category')) {
      apiParams.set('categories', urlParams.get('category')!);
    }
    if (urlParams.has('minYear') && urlParams.has('maxYear')) {
      apiParams.set('yearFirst', urlParams.get('minYear')!);
      apiParams.set('yearLast',  urlParams.get('maxYear')!);
    }
    if (urlParams.has('minPlayers') && urlParams.has('maxPlayers')) {
      apiParams.set('min_players', urlParams.get('minPlayers')!);
      apiParams.set('max_players', urlParams.get('maxPlayers')!);
    }
    if (urlParams.has('minTime') && urlParams.has('maxTime')) {
      apiParams.set('playTimeMin', urlParams.get('minTime')!);
      apiParams.set('playTimeMax', urlParams.get('maxTime')!);
    }

    const apiUrl = `http://localhost:3000/games/duel?${apiParams}`;
    console.log('Fetching', apiUrl);

    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`Erreur ${res.status} : ${res.statusText}`);

      // MySQL returns [rows, metadata]
      const raw = await res.json();
      const rows: any[] = Array.isArray(raw) ? raw[0] : [];

      games = rows.map(g => ({
        id_game:       g.id_game,
        num:           g.num,
        primary_name:  g.primary_name,
        year_published:g.year_published,
        min_players:   g.min_players,
        max_players:   g.max_players,
        playing_time:  g.playing_time,
        description:   g.description,
        min_age:       g.min_age,
        owned:         g.owned,
        trading:       g.trading,
        wanting:       g.wanting,
        wishing:       g.wishing
      }));
      console.log('Games:', games);
      if (games.length === 0) {
        error = 'Aucun jeu trouvé pour ces critères.';
      }
    } catch (e: any) {
      error = e.message;
    }
  });

  function swipeCard(index: number, direction: 'left' | 'right') {
    swipedCardIndex = index;
    swipeDirection = direction;
    setTimeout(() => {
      games.splice(index, 1);
      swipedCardIndex = null;
      swipeDirection = null;
    }, 500);
  }
</script>

<div class="page">
  <h1>GAME CHOICE</h1>
  {#if error}
    <p class="error">{error}</p>
  {:else if games.length === 0}
    <p>Chargement…</p>
  {:else}
    <div class="cards-container">
      <div class="arrow left" on:click={() => swipeCard(0, 'left')}>← SWIPE</div>
      {#each games as game, index}
        <div class="card
          {swipedCardIndex === index && swipeDirection === 'left'  ? 'swipe-left'  : ''}
          {swipedCardIndex === index && swipeDirection === 'right' ? 'swipe-right' : ''}">
          <GameCard
                  {...game}
                  on:swipe={(e) => swipeCard(index, e.detail)}
          />
        </div>
      {/each}
      <div class="arrow right" on:click={() => swipeCard(0, 'right')}>SWIPE →</div>
    </div>
  {/if}
  <footer>CORENTIN DIMITRI JULES 2025</footer>
</div>
  
  <style>
    .page {
      background-color: #2e2c7e;
      color: white;
      font-family: 'Press Start 2P', monospace;
      text-align: center;
      padding: 2rem 2rem 0;
      min-height: 100vh;
    }
  
    h1 {
      font-size: 5rem;
      margin-bottom: 1.5rem;
    }
  
    .cards-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      height: 70vh;
    }
  
    .arrow {
      font-size: 3rem;
      color: white;
      text-align: center;
      cursor: pointer;
    }
  
    .left {
      margin-right: 1rem;
    }
  
    .right {
      margin-left: 1rem;
    }
  
    footer {
      margin-top: 1.5rem;
      font-size: 2rem;
    }
  
    /* Animations */
    .swipe-left {
      animation: swipeLeft 0.5s ease-out forwards;
    }
  
    .swipe-right {
      animation: swipeRight 0.5s ease-out forwards;
    }
  
    @keyframes swipeLeft {
      to {
        transform: translateX(-150%) rotate(-20deg);
        opacity: 0;
      }
    }
  
    @keyframes swipeRight {
      to {
        transform: translateX(150%) rotate(20deg);
        opacity: 0;
      }
    }
  </style>
  