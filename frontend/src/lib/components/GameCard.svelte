<script lang="ts">
    export let title: string;
    export let year: number;
    export let minPlayers: number;
    export let maxPlayers: number;
    export let playingTime: number;
    export let category: string;
    export let description: string;
</script>

<div class="card">
    <h2>{title}</h2>
    <div class="info"><strong>Year:</strong> {year}</div>
    <div class="info"><strong>Players:</strong> {minPlayers} - {maxPlayers}</div>
    <div class="info"><strong>Time:</strong> {playingTime} min</div>
    <div class="info"><strong>Category:</strong> {category}</div>
    <div class="description">{description}</div>
</div>

<style>
    .card {
        background-color: #6BC04B;
        border-radius: 20px;
        padding: 1.5rem;
        width: 500px;
        font-family: 'Press Start 2P', monospace;
        color: black;
        box-shadow: 3px 3px 0 #2e2c7e;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        height: 450px;
    }

    h2 {
        font-size: 3rem;
        text-align: center;
        margin: 0;
    }

    .info {
        font-size: 1.2rem;
    }

    .description {
        font-size:1.5rem;
        margin-top: 0.5rem;
        height: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
