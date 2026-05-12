<script lang="ts">
	import { ConnectFourGame } from '$lib/ConnectFour.svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	const game = new ConnectFourGame();

	function handleColumnClick(col: number) {
		game.dropToken(col);
	}
</script>

<svelte:head>
	<title>Neon Nexus | Connect Four</title>
</svelte:head>

<main class="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
	<!-- Background glow effects -->
	<div class="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 transition-colors duration-1000 ease-in-out"
		class:bg-primary={game.currentPlayer === 1}
		class:bg-secondary={game.currentPlayer === 2}
	></div>

	<!-- Title & Header -->
	<div class="z-10 text-center mb-12">
		<h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-on-surface tracking-tighter uppercase mb-2">
			Neon Nexus
		</h1>
		<p class="text-on-surface-variant tracking-[0.2em] text-xs font-semibold uppercase">
			Connect Four // Digital Installation
		</p>
	</div>

	<!-- Player Indicators -->
	<div class="z-10 flex gap-12 md:gap-24 mb-12">
		<!-- Player 1 -->
		<div class="flex flex-col items-center gap-3 transition-all duration-300 {game.currentPlayer === 1 ? 'opacity-100 scale-110' : 'opacity-40'}">
			<div class="w-12 h-12 rounded-full bg-[radial-gradient(circle_at_30%_30%,theme(colors.primary),theme(colors.primary-container))] {game.currentPlayer === 1 ? 'neon-shadow-primary' : ''}"></div>
			<span class="font-display font-bold text-lg text-primary tracking-wide">PLAYER 1</span>
		</div>
		<!-- Player 2 -->
		<div class="flex flex-col items-center gap-3 transition-all duration-300 {game.currentPlayer === 2 ? 'opacity-100 scale-110' : 'opacity-40'}">
			<div class="w-12 h-12 rounded-full bg-[radial-gradient(circle_at_30%_30%,theme(colors.secondary),theme(colors.secondary-container))] {game.currentPlayer === 2 ? 'neon-shadow-secondary' : ''}"></div>
			<span class="font-display font-bold text-lg text-secondary tracking-wide">PLAYER 2</span>
		</div>
	</div>

	<!-- Game Board -->
	<div class="z-10 relative">
		<!-- Board Panel -->
		<div class="bg-surface-container-low p-4 md:p-6 rounded-3xl glass-panel relative">
			<div class="grid grid-cols-7 gap-3 md:gap-4">
				{#each Array(game.rows) as _, row}
					{#each Array(game.cols) as _, col}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div 
							class="w-10 h-10 md:w-14 md:h-14 rounded-full bg-surface-container-lowest relative cursor-pointer overflow-hidden shadow-inner group"
							onclick={() => handleColumnClick(col)}
						>
							<!-- Hover indicator column -->
							<div class="absolute inset-0 bg-surface-variant/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

							<!-- Token -->
							{#if game.board[row][col] === 1}
								<div 
									in:scale={{ duration: 400, easing: cubicOut, start: 0.5 }}
									class="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_30%_30%,theme(colors.primary),theme(colors.primary-container))] neon-shadow-primary"
								></div>
							{:else if game.board[row][col] === 2}
								<div 
									in:scale={{ duration: 400, easing: cubicOut, start: 0.5 }}
									class="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_30%_30%,theme(colors.secondary),theme(colors.secondary-container))] neon-shadow-secondary"
								></div>
							{/if}

							<!-- Winning Highlight -->
							{#if game.winningCells.some(c => c.row === row && c.col === col)}
								<div class="absolute inset-0 bg-white/30 rounded-full animate-pulse pointer-events-none"></div>
							{/if}
						</div>
					{/each}
				{/each}
			</div>
		</div>
	</div>

	<!-- Victory / Draw Modal -->
	{#if game.winner}
		<div 
			in:fade={{ duration: 300 }}
			class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
		>
			<button class="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-auto cursor-default border-none w-full h-full" onclick={() => game.reset()} aria-label="Close modal"></button>
			
			<div class="relative z-10 flex flex-col items-center bg-surface-container-high p-12 rounded-3xl shadow-ambient pointer-events-auto"
				 in:scale={{ duration: 500, start: 0.9, easing: cubicOut }}>
				<h2 class="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-4 text-transparent bg-clip-text
					{game.winner === 1 ? 'bg-gradient-to-br from-primary to-primary-container neon-shadow-primary' : ''}
					{game.winner === 2 ? 'bg-gradient-to-br from-secondary to-secondary-container neon-shadow-secondary' : ''}
					{game.winner === 'draw' ? 'bg-on-surface' : ''}
				">
					{#if game.winner === 'draw'}
						DRAW
					{:else}
						PLAYER {game.winner} WINS
					{/if}
				</h2>
				
				<p class="font-body text-on-surface-variant uppercase tracking-widest mb-8">
					{#if game.winner === 'draw'}
						THE VOID CLAIMS ALL
					{:else}
						TOTAL DOMINATION
					{/if}
				</p>

				<button 
					onclick={() => game.reset()}
					class="font-display font-bold text-lg uppercase tracking-wider px-8 py-4 rounded-2xl transition-all duration-300
					{game.winner === 1 ? 'text-background bg-primary hover:bg-primary-container' : ''}
					{game.winner === 2 ? 'text-background bg-secondary hover:bg-secondary-container' : ''}
					{game.winner === 'draw' ? 'text-background bg-on-surface hover:bg-white' : ''}"
				>
					Play Again
				</button>
			</div>
		</div>
	{/if}
	
	<!-- Footer control -->
	<div class="z-10 mt-12">
		<button 
			onclick={() => game.reset()}
			class="font-display text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors ghost-border px-6 py-2 rounded-full bg-surface-container-highest cursor-pointer"
		>
			Reset Board
		</button>
	</div>
</main>
