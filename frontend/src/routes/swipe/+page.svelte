<script lang="ts">
  import GameCard from '$lib/components/GameCard.svelte';
  import { onMount } from 'svelte';
  import type { Game } from '$lib/models/game';
  import {goto} from "$app/navigation";
  import { getGameThumbnailById } from '$lib/gamesApi';

  const urlParams = new URLSearchParams(window.location.search);
  const apiParams = new URLSearchParams();
  let games: Game[] = [];
  let gamesThumbnails: (string | null)[] = [];
  let error: string | null = null;
  let swipedCardIndex: number | null = null;
  let swipeDirection: 'left' | 'right' | null = null;
  const shownGameIds = new Set<number>();

  let swipeCount = 0;
  const memoryCount: Record<number, number> = {};
  function updateRemoveIdParam() {
    apiParams.set('removeId', Array.from(new Set([...shownGameIds])).filter(id => !isNaN(id)).join(','));

  }

  async function fetchNextGame(): Promise<Game | null> {
    try {
      updateRemoveIdParam();
      const apiUrl = `http://localhost:3000/games/gameCategory?${apiParams}`;
      const res = await fetch(apiUrl);
      if (!res.ok) return null;

      const raw = await res.json();
      const rows: any[] = Array.isArray(raw) ? raw[0] : [];

      if (rows.length > 0) {
        const g = rows[0];
        shownGameIds.add(g.id_game);

        const nextGame: Game = {
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
        };
        return nextGame;
      }

      return null;
    } catch {
      return null;
    }
  }
  onMount(async () => {

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
    updateRemoveIdParam();
    const apiUrl = `http://localhost:3000/games/duel?${apiParams}`;
    console.log('Fetching', apiUrl);

    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`Erreur ${res.status} : ${res.statusText}`);

      // MySQL returns [rows, metadata]
      const raw = await res.json();
      const rows: any[] = Array.isArray(raw) ? raw[0] : [];

      games = rows.map(g =>
      {
        shownGameIds.add(g.id_game);
        return{
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
      };
      });

      for (let i = 0; i < games.length; i++) {
        const game = games[i];
        gamesThumbnails[i] = await getGameThumbnailById(game.id_game);
      }
      
      console.log('Games:', games);
      console.log('Thumbnails:', gamesThumbnails);
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
    const keptIndex = index === 0 ? 1 : 0;
    const keptGame = games[keptIndex];
    if (keptGame) {
      memoryCount[keptGame.id_game] = (memoryCount[keptGame.id_game] || 0) + 1;
    }

    swipeCount++;

    setTimeout(async () => {
      // Remplacer la carte swipée par un nouveau jeu
      const next = await fetchNextGame();
      if (next) {
        gamesThumbnails[index] = await getGameThumbnailById(next.id_game);
        games[index] = next;
      } else {
        games.splice(index, 1);
      }
      swipedCardIndex = null;
      swipeDirection = null;
      // **3. Si on a fait 10 swipes, on affiche le podium**
      if (swipeCount >= 10) {
       await  handleStop();
      }

    }, 500);
  }
  function handleStop() {
    const json = JSON.stringify(memoryCount);
    const encoded = encodeURIComponent(json);

     goto(`/podium?results=${encoded}`);
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
                  thumbnailUrl={gamesThumbnails[index]}
                  onSwipe={(side) => swipeCard(index, side)}
          />
        </div>
      {/each}
      <div class="arrow right" on:click={() => swipeCard(1, 'right')}>SWIPE →</div>
    </div>
  {/if}
  <button class="stop-button" on:click={handleStop}>STOP</button>
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
      overflow: hidden;
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
    .stop-button {
        margin-top: 40px;
        background-color: #b6ff00;
        color: black;
        font-size: 24px;
        font-weight: bold;
        padding: 16px 48px;
        border: none;
        border-radius: 40px;
        box-shadow: 4px 4px 0px #2b2b2b;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
      }

    .sto-button:hover {
      background-color: #d4ff4c;
      transform: scale(1.05);
    }
  </style>
  