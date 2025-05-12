<script lang="ts">
    import GameCard from '$lib/components/GameCard.svelte';
  
    const games = [
      {
        title: "Catan",
        year: 1995,
        minPlayers: 3,
        maxPlayers: 4,
        playingTime: 60,
        category: "Strategy",
        description: "Trade, build and settle an island in this classic game of resource management."
      },
      {
        title: "Carcassonne",
        year: 2000,
        minPlayers: 2,
        maxPlayers: 5,
        playingTime: 45,
        category: "Tile-laying",
        description: "Build a medieval landscape with roads, cities and fields!"
      }
    ];
  
    let swipedCardIndex: number | null = null;
    let swipeDirection: 'left' | 'right' | null = null;
  
    function swipeCard(index: number, direction: 'left' | 'right') {
      swipedCardIndex = index;
      swipeDirection = direction;
  
      // Attendre l'animation avant de retirer la carte
      setTimeout(() => {
        games.splice(index, 1);
        swipedCardIndex = null;
        swipeDirection = null;
      }, 500); // durée de l'animation
    }
  </script>
  
  <div class="page">
    <h1>GAME CHOICE</h1>
  
    <div class="cards-container">
      <div class="arrow left" on:click={() => swipeCard(0, 'left')}>←<br />SWIPE</div>
  
      {#each games as game, index}
      <GameCard
      {...game}
      onSwipe={(dir) => swipeCard(index, dir)}
      class={`card 
        ${swipedCardIndex === index && swipeDirection === 'left' ? 'swipe-left' : ''} 
        ${swipedCardIndex === index && swipeDirection === 'right' ? 'swipe-right' : ''}`}
    />
      {/each}
  
      <div class="arrow right" on:click={() => swipeCard(0, 'right')}>SWIPE<br />→</div>
    </div>
  
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
  