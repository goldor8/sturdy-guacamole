<script lang="ts">
    import { goto } from '$app/navigation';
    import {onMount} from "svelte";

    let criteriaOptions = ['Year Published', 'Game Category', 'Numbers of Players', 'Average Play Time'];
    let selectedCriterion = 'Year Published';
    let selectedCategory = '';
    let playerRange = [2, 10];
    let playTimeRange = [30, 250]; // en minutes
    let categories: string[] = [];
    

    const MIN_YEAR = -3500;
    const BREAK1 = 1900;
    const BREAK2 = 1980;
    const MAX_YEAR = 2050;

    // % de la plage attribuée à chaque zone
    const zone1Percent = 30; // Antiquité à 1900
    const zone2Percent = 30; // 1900 à 1980
    const zone3Percent = 40; // 1980 à 2050

    // Taille réelle de chaque zone
    const size1 = BREAK1 - MIN_YEAR;
    const size2 = BREAK2 - BREAK1;
    const size3 = MAX_YEAR - BREAK2;

    // Total "pondéré" pour interpolation
    const totalWeight = zone1Percent / size1 + zone2Percent / size2 + zone3Percent / size3;

    // Convert % (0–100 slider) → année
    function percentToYear(p: number): number {
        if (p <= zone1Percent) {
            const ratio = p / zone1Percent;
            return Math.round(MIN_YEAR + ratio * size1);
        } else if (p <= zone1Percent + zone2Percent) {
            const ratio = (p - zone1Percent) / zone2Percent;
            return Math.round(BREAK1 + ratio * size2);
        } else {
            const ratio = (p - zone1Percent - zone2Percent) / zone3Percent;
            return Math.round(BREAK2 + ratio * size3);
        }
    }
    onMount(async () => {
        try {
            const res = await fetch('http://localhost:3000/games/allcategory');
            if (!res.ok) throw new Error(`Erreur ${res.status}`);
            categories = await res.json();             // on suppose un tableau de chaînes
        } catch (e) {
            console.error('Impossible de charger les catégories :', e);
        }
    });
    // Convert année → % pour slider
    function yearToPercent(y: number): number {
        if (y <= BREAK1) {
            const ratio = (y - MIN_YEAR) / size1;
            return ratio * zone1Percent;
        } else if (y <= BREAK2) {
            const ratio = (y - BREAK1) / size2;
            return zone1Percent + ratio * zone2Percent;
        } else {
            const ratio = (y - BREAK2) / size3;
            return zone1Percent + zone2Percent + ratio * zone3Percent;
        }
    }

    // Valeurs initiales pour le slider en %
    let linearRange = [
        yearToPercent(2000),
        yearToPercent(2010)
    ];

    // Conversion réactive pour affichage lisible
    let yearRange = [2000, 2010];
    $: yearRange = [
        Math.min(percentToYear(linearRange[0]), percentToYear(linearRange[1])),
        Math.max(percentToYear(linearRange[0]), percentToYear(linearRange[1]))
    ];
    function handleStart() {
        const params = new URLSearchParams();
        params.set('criterion', selectedCriterion);
        if (selectedCriterion === 'Year Published') {
        params.set('minYear', yearRange[0].toString());
        params.set('maxYear', yearRange[1].toString());
        } else if (selectedCriterion === 'Game Category'){
        params.set('category', selectedCategory);
        } else if (selectedCriterion === 'Numbers of Players'){
            const [minPlayers, maxPlayers] = [Math.min(...playerRange), Math.max(...playerRange)];
			params.set('minPlayers', minPlayers.toString());
			params.set('maxPlayers', maxPlayers.toString());
        } else if (selectedCriterion === 'Average Play Time') {
            params.set('minTime', playTimeRange[0].toString());
            params.set('maxTime', playTimeRange[1].toString());
        }
        goto(`/swipe?${params.toString()}`);
    }
</script>

<main class="container">
    <h1 class="title">GAME CHOICE</h1>

    <div class="criteria-box">
        <span class="criteria-label">CRITERIA :</span>
        {#each criteriaOptions as crit}
        <button
                class="criteria-button {selectedCriterion === crit ? 'selected' : ''}"
                on:click={() => selectedCriterion = crit}
        >{crit.toUpperCase()}</button>
        {/each}
    </div>

    <div class="selection-box">
        {#if selectedCriterion === 'Year Published'}
        <label class="input-label" for="min-year">YEAR PUBLISHED:</label>
        <div class="slider-group" id="min-year">
            <input
            id="min-year"
            type="range"
            min="0"
            max="100"
            step="1"
            bind:value={linearRange[0]}
        />
        <input
            id="max-year"
            type="range"
            min="0"         
            max="100"
            step="1"
            bind:value={linearRange[1]}
        />
            <div class="range-label">From {yearRange[0]} to {yearRange[1]}</div>
        </div>
        {:else if selectedCriterion === 'Game Category'}
        <label class="input-label" for="game-category">GAME CATEGORY:</label>
        <select bind:value={selectedCategory} class="dropdown">
            <option value="">-- Select a category --</option>
            {#each categories as cat}
            <option value={cat}>{cat}</option>
            {/each}
        </select>
        {:else if selectedCriterion === 'Numbers of Players'}
            <label class="input-label" for="players-slider">NUMBER OF PLAYERS:</label>
            <div class="slider-group" id="players-slider">
                <input type="range" min="1" max="20" bind:value={playerRange[0]} step="1" />
                <input type="range" min="1" max="20" bind:value={playerRange[1]} step="1" />
                <div class="range-label">From {playerRange[0]} to {playerRange[1]} players</div>
            </div>
        {:else if selectedCriterion === 'Average Play Time'}
            <label class="input-label" for="playtime-slider">AVERAGE PLAY TIME (minutes):</label>
            <div class="slider-group" id="playtime-slider">
              <input type="range" min="5" max="300" bind:value={playTimeRange[0]} step="5" />
              <input type="range" min="5" max="300" bind:value={playTimeRange[1]} step="5" />
              <div class="range-label">From {playTimeRange[0]} min to {playTimeRange[1]} min</div>
            </div>           
        {/if}
    </div>

    <button class="start-button" on:click={handleStart}>START</button>
    <footer class="footer">CORENTIN DIMITRI JULES 2025</footer>
</main>

<style>

    :global {
        body{
            margin: 0;
            font-family: 'Courier New', Courier, monospace;
        }
    }

    .container {
        background-color: #2E2C7E;
        color: white;
        min-height: 100vh;
        padding: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .title {
        font-size: 48px;
        font-weight: bold;
        margin-bottom: 30px;
    }

    .criteria-box {
        background-color: #b6ff00;
        color: black;
        padding: 16px;
        border-radius: 12px;
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
    }

    .criteria-label {
        font-weight: bold;
        font-size: 18px;
    }

    .criteria-button {
        background-color: black;
        color: #b6ff00;
        padding: 8px 12px;
        border: 1px solid #000;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
    }

    .criteria-button.selected {
        background-color: white;
        color: black;
    }

    .selection-box {
        margin-top: 40px;
        width: 100%;
        max-width: 500px;
    }

    .input-label {
        font-size: 18px;
        display: block;
        margin-bottom: 10px;
    }

    .slider-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .range-label {
        font-size: 14px;
    }

    .dropdown {
        width: 100%;
        padding: 8px;
        font-size: 16px;
        border-radius: 8px;
        border: none;
        color: black;
    }

    .start-button {
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

    .start-button:hover {
        background-color: #d4ff4c;
        transform: scale(1.05);
    }

    .footer {
        margin-top: 60px;
        font-size: 14px;
        opacity: 0.8;
    }
</style>