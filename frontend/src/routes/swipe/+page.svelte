<script>
    import GameCard from '$lib/components/GameCard.svelte';
</script>

<div class="page">
    <h1>GAME CHOICE</h1>

    <div class="cards-container">
        <div class="arrow left">←<br />SWIPE</div>

        <GameCard
                title="Catan"
                year={1995}
                minPlayers={3}
                maxPlayers={4}
                playingTime={60}
                category="Strategy"
                description="Trade, build and settle an island in this classic game of resource management."
        />

        <GameCard
                title="Carcassonne"
                year={2000}
                minPlayers={2}
                maxPlayers={5}
                playingTime={45}
                category="Tile-laying"
                description="Build a medieval landscape with roads, cities and fields!"
        />

        <div class="arrow right">SWIPE<br />→</div>
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
</style>
