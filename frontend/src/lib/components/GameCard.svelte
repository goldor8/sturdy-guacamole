<script lang="ts">
    interface Props {
      primary_name: string;
      year_published: number;
      min_players: number;
      max_players: number;
      playing_time: number;
      description: string;
      onSwipe: (direction: 'left' | 'right') => void;
    }

    let {
      primary_name,
      year_published,
      min_players,
      max_players,
      playing_time,
      description,
      onSwipe,
      ...restProps
    }: Props = $props();

    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let cardElem: HTMLDivElement;
  
    function handlePointerDown(event: PointerEvent) {
      startX = event.clientX;
      isDragging = true;
      cardElem.setPointerCapture(event.pointerId);
    }
  
    function handlePointerMove(event: PointerEvent) {
      if (!isDragging) return;
      currentX = event.clientX - startX;
      cardElem.style.transform = `translateX(${currentX}px) rotate(${currentX / 20}deg)`;
    }
  
    function handlePointerUp(event: PointerEvent) {
      if (!isDragging) return;
      isDragging = false;
      cardElem.releasePointerCapture(event.pointerId);
  
      if (currentX < -100) {
        onSwipe('left');
      } else if (currentX > 100) {
        onSwipe('right');
      }

      // cardElem.style.transition = 'transform 0.3s';
      // 

      // Retour à la position initiale
      setTimeout(() => {
        
        cardElem.style.transform = 'translateX(0) rotate(0)';
        // cardElem.style.transition = '';
      }, 500);
  
      currentX = 0;
    }
  </script>
  
  <div {...restProps}
    bind:this={cardElem}
    class="card"
    on:pointerdown={handlePointerDown}
    on:pointermove={handlePointerMove}
    on:pointerup={handlePointerUp}
  >
    <h2>{primary_name}</h2>
    <div class="info"><strong>Year:</strong> {year_published}</div>
    <div class="info"><strong>Players:</strong> {min_players} - {max_players}</div>
    <div class="info"><strong>Time:</strong> {playing_time} min</div>

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
		touch-action: pan-y;
		user-select: none;
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
		font-size: 1.5rem;
		margin-top: 0.5rem;

		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
