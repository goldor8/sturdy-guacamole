<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type { Game } from '$lib/models/game';
    import GameCard from '$lib/components/GameCard.svelte';


    const urlParams = new URLSearchParams(window.location.search);
    const raw = urlParams.get('results');
    let podiumOrder: { id_game: number; count: number }[] = [];

    let games: (Game & { thumbnailUrl: string | null; count: number })[] = [];
    let error: string | null = null;


    async function fetchGameDetails(id: number) {
        const [resGame, resThumb] = await Promise.all([
            fetch(`http://localhost:3000/games/id/${id}`),
            fetch(`http://localhost:3000/games/thumbnail/${id}`)
        ]);
        if (!resGame.ok) throw new Error(`Jeu ${id} non trouvé`);
        const game: Game = await resGame.json();
        const thumbData = resThumb.ok ? await resThumb.json() : null;
        return { ...game, thumbnailUrl: thumbData?.url || null };
    }

    onMount(async () => {
        if (!raw) {
            error = 'Aucun résultat de podium.';
            return;
        }
        try {

            const obj = JSON.parse(decodeURIComponent(raw));
            podiumOrder = Object.entries(obj)
                .map(([id, cnt]) => ({ id_game: +id, count: cnt as number }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);


            games = await Promise.all(
                podiumOrder.map(async entry => {
                    const details = await fetchGameDetails(entry.id_game);
                    return { ...details, count: entry.count };
                })
            );
        } catch (e: any) {
            error = e.message;
        }
    });

    function backToMenu() {
        goto('/');
    }
</script>

<svelte:head>
    <title>Podium - Vos jeux préférés</title>
</svelte:head>

<main class="podium-page">
    <button class="back-button" on:click={backToMenu}>⬅️ Menu</button>
    <h1>🏆 Podium des jeux</h1>

    {#if error}
        <p class="error">{error}</p>
    {:else if games.length === 0}
        <p>Chargement du podium…</p>
    {:else}
        <div class="podium-list">
            {#each games as game, index}
                <div class="podium-wrapper place-{index+1}">
                    <div class="place-badge">{index + 1}</div>
                    <GameCard
                            primary_name={game.primary_name}
                            year_published={game.year_published}
                            min_players={game.min_players}
                            max_players={game.max_players}
                            playing_time={game.playing_time}
                            description={game.description}
                            thumbnailUrl={game.thumbnailUrl}
                            onSwipe={() => {}} />
                </div>
            {/each}
        </div>
    {/if}
</main>

<style>
    h1{
        font-size: 48px;
        font-weight: bold;
        margin-bottom: 30px;
        color:white;
    }
    .podium-page {
        padding: 2rem;
        font-family: sans-serif;
        text-align: center;
    }

    .back-button {
        position: absolute;
        top: 1rem;
        left: 1rem;

        border: none;
        padding: 0.5rem 1rem;
        cursor: pointer;
        border-radius: 5px;
        background-color: #d4ff4c;
        color: black;
    }

    .podium-list {
        display: grid;
        gap: 2rem;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        margin-top: 2rem;
    }

    .podium-wrapper {
        position: relative;
    }

    .place-badge {
        position: absolute;
        top: -10px;
        left: -10px;
        background: gold;
        color: black;
        font-size: 1.2rem;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(0,0,0,0.2);
        z-index: 1;
    }

    .error {
        color: red;
    }
</style>