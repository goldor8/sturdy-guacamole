<script lang="ts">
    import GameCard from '$lib/components/GameCard.svelte';
    import { onMount } from 'svelte';
    import type { Game } from '$lib/models/game';


    let games: Game[] = [];
    let current = 0;
    let error: string | null = null;

    onMount(async () => {
        // 1. Lecture des params initiaux depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);

        // 2. Reconstruction des params pour l'API Express
        const apiParams = new URLSearchParams();

        // Catégorie de jeu
        if (urlParams.has('category')) {
            apiParams.set('categories', urlParams.get('category')!);
        }

        // Années publiées
        if (urlParams.has('minYear') && urlParams.has('maxYear')) {
            apiParams.set('yearFirst', urlParams.get('minYear')!);
            apiParams.set('yearLast',  urlParams.get('maxYear')!);
        }

        // Nombre de joueurs
        if (urlParams.has('minPlayers') && urlParams.has('maxPlayers')) {
            apiParams.set('minplayers', urlParams.get('minPlayers')!);
            apiParams.set('maxplayers', urlParams.get('maxPlayers')!);
        }

        // Temps de jeu moyen
        if (urlParams.has('minTime') && urlParams.has('maxTime')) {
            apiParams.set('playTimeMin', urlParams.get('minTime')!);
            apiParams.set('playTimeMax', urlParams.get('maxTime')!);
        }

        const apiUrl = `http://localhost:3000/games/duel?${apiParams.toString()}`;
        console.log('Fetching', apiUrl);

        try {
            const res = await fetch(apiUrl);
            if (!res.ok) {
                throw new Error(`Erreur ${res.status} : ${res.statusText}`);
            }
            games = await res.json();
            games=games[0]
            console.log(games);
            if (games.length === 0) {
                error = 'Aucun jeu trouvé pour ces critères.';
            }
        } catch (err: any) {
            error = err.message;
        }
    });
    function next() {
        if (current < games.length - 1) current += 1;
    }
    function prev() {
        if (current > 0) current -= 1;
    }

</script>

<div class="page">

    <h1>GAME CHOICE</h1>

    <div class="cards-container">
        <div class="arrow left">←<br />SWIPE</div>
        {#if error}
            <p class="error">{error}</p>
        {:else if games.length === 0}
            <p>Pas de jeu </p>
        {:else}
        <GameCard
                title={games[0].primary_name}
                year={games[0].year_published}
                minPlayers={games[0].min_players}
                maxPlayers={games[0].max_players}
                playingTime={games[0].playing_time}
                category={"{games[0].category}"}
                description={games[0].description}
        />

        <GameCard
                title={games[1].primary_name}
                year={games[1].year_published}
                minPlayers={games[1].min_players}
                maxPlayers={games[1].max_players}
                playingTime={games[1].playing_time}
                category={"{games[0].category}"}
                description={games[1].description}
        />

        <div class="arrow right">SWIPE<br />→</div>
        {/if}

    </div>
    <!-- Add button stop game -->
    <button id="stopGame" class="arrow" >STOP<br />GAME</button>
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
        height: 60vh;
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
