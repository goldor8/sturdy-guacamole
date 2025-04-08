<script lang="ts">
    import { goto } from '$app/navigation';

    let criteriaOptions = ['Year Published', 'Game Category'];
    let selectedCriterion = 'Year Published';
    let yearRange = [2000, 2010];
    let selectedCategory = '';
    const categories = ['Fantastique', 'Science-fiction', 'Historique', 'Stratégie'];

    function handleStart() {
        const params = new URLSearchParams();
        params.set('criterion', selectedCriterion);
        if (selectedCriterion === 'Year Published') {
        params.set('minYear', yearRange[0].toString());
        params.set('maxYear', yearRange[1].toString());
        } else {
        params.set('category', selectedCategory);
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
        <label class="input-label">YEAR PUBLISHED:</label>
        <div class="slider-group">
            <input type="range" min="-3500" max="2050" bind:value={yearRange[0]} step="10" />
            <input type="range" min="-3500" max="2050" bind:value={yearRange[1]} step="10" />
            <div class="range-label">From {yearRange[0]} to {yearRange[1]}</div>
        </div>
        {:else}
        <label class="input-label">GAME CATEGORY:</label>
        <select bind:value={selectedCategory} class="dropdown">
            <option value="">-- Select a category --</option>
            {#each categories as cat}
            <option value={cat}>{cat}</option>
            {/each}
        </select>
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