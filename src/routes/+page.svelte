<script lang="ts">
	import { ConnectFourGame, type Difficulty } from '$lib/ConnectFour.svelte';
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
		class:bg-primary={game.currentPlayer === 1 || game.gameState === 'menu'}
		class:bg-secondary={game.currentPlayer === 2 && game.gameState === 'playing'}
	></div>

	{#if game.gameState === 'menu'}
		<!-- Main Menu -->
		<div in:fade={{ duration: 600 }} class="z-10 flex flex-col items-center text-center max-w-2xl px-6">
			<h1 class="text-6xl md:text-8xl font-display font-bold text-on-surface tracking-tighter uppercase mb-6 neon-text-primary">
				NEON NEXUS
			</h1>
			<p class="text-on-surface-variant font-body text-sm md:text-base tracking-widest uppercase mb-16 max-w-md opacity-80 leading-relaxed">
				Experience the classic battle of wits reinvented through a lens of kinetic light and digital precision.
			</p>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
				<button 
					onclick={() => game.startGame('single')}
					class="group relative flex flex-col items-center gap-4 p-8 rounded-3xl bg-surface-container-high transition-all duration-300 hover:bg-surface-container-highest ghost-border hover:scale-105 active:scale-95"
				>
					<span class="text-3xl mb-2 group-hover:animate-pulse">🤖</span>
					<span class="font-display font-bold text-xl tracking-wider text-primary">SINGLE PLAYER</span>
					<span class="text-[10px] font-body text-on-surface-variant tracking-[0.2em] uppercase opacity-60">VS NEON ENGINE</span>
				</button>

				<button 
					onclick={() => game.startGame('local')}
					class="group relative flex flex-col items-center gap-4 p-8 rounded-3xl bg-surface-container-high transition-all duration-300 hover:bg-surface-container-highest ghost-border hover:scale-105 active:scale-95"
				>
					<span class="text-3xl mb-2 group-hover:animate-pulse">⚔️</span>
					<span class="font-display font-bold text-xl tracking-wider text-secondary">LOCAL BATTLE</span>
					<span class="text-[10px] font-body text-on-surface-variant tracking-[0.2em] uppercase opacity-60">SHARED SCREEN DUEL</span>
				</button>
			</div>

			<div class="mt-12 flex gap-8">
				<button 
					onclick={() => game.showLeaderboard()}
					class="text-[10px] font-display font-bold uppercase tracking-[0.4em] text-on-surface-variant hover:text-on-surface transition-colors"
				>
					STATS
				</button>
				<button 
					onclick={() => game.showHistory()}
					class="text-[10px] font-display font-bold uppercase tracking-[0.4em] text-on-surface-variant hover:text-on-surface transition-colors"
				>
					HISTORY
				</button>
				<button class="text-[10px] font-display font-bold uppercase tracking-[0.4em] text-on-surface-variant hover:text-on-surface transition-colors">
					ABOUT
				</button>
			</div>
		</div>
	{:else if game.gameState === 'leaderboard'}
		<!-- Leaderboard View -->
		<div in:fade={{ duration: 400 }} class="z-10 flex flex-col items-center w-full max-w-md px-6">
			<button 
				onclick={() => game.goToMenu()}
				class="mb-12 text-[10px] font-display font-bold uppercase tracking-[0.4em] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 group"
			>
				<span class="group-hover:-translate-x-1 transition-transform">←</span> BACK TO MENU
			</button>
			
			<h2 class="text-4xl font-display font-bold text-on-surface tracking-tighter uppercase mb-12">SYSTEM STATS</h2>
			
			<div class="w-full space-y-4">
				<div class="flex justify-between items-center p-6 rounded-2xl bg-surface-container-high ghost-border">
					<span class="font-display text-xs font-bold uppercase tracking-widest text-primary">CYBER_PUNK</span>
					<span class="text-2xl font-display font-bold text-on-surface">{game.stats.player1Wins}</span>
				</div>
				<div class="flex justify-between items-center p-6 rounded-2xl bg-surface-container-high ghost-border">
					<span class="font-display text-xs font-bold uppercase tracking-widest text-secondary">NEON_RAIDER</span>
					<span class="text-2xl font-display font-bold text-on-surface">{game.stats.player2Wins}</span>
				</div>
				<div class="flex justify-between items-center p-6 rounded-2xl bg-surface-container-high ghost-border opacity-60">
					<span class="font-display text-xs font-bold uppercase tracking-widest text-on-surface-variant">DRAW / VOID</span>
					<span class="text-2xl font-display font-bold text-on-surface">{game.stats.draws}</span>
				</div>
			</div>

			<button 
				onclick={() => game.clearStats()}
				class="mt-12 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-error hover:opacity-80 transition-opacity"
			>
				PURGE DATABASE
			</button>
		</div>
	{:else if game.gameState === 'history'}
		<!-- Match History / Record View -->
		<div in:fade={{ duration: 400 }} class="z-10 flex flex-col items-center w-full max-w-2xl px-6">
			<button 
				onclick={() => game.goToMenu()}
				class="mb-12 text-[10px] font-display font-bold uppercase tracking-[0.4em] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 group"
			>
				<span class="group-hover:-translate-x-1 transition-transform">←</span> BACK TO MENU
			</button>
			
			<h2 class="text-4xl font-display font-bold text-on-surface tracking-tighter uppercase mb-12">MATCH REPLAY</h2>
			
			<div class="w-full space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
				{#each game.savedReplays as replay (replay.id)}
					<div class="flex items-center justify-between p-6 rounded-2xl bg-surface-container-low ghost-border hover:bg-surface-container-high transition-colors group">
						<div class="flex flex-col gap-1">
							<span class="font-display text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
								{replay.date} // {replay.mode.toUpperCase()}
							</span>
							<span class="font-display text-sm font-bold uppercase tracking-widest {replay.winner === 1 ? 'text-primary' : replay.winner === 2 ? 'text-secondary' : 'text-on-surface'}">
								{replay.winner === 'draw' ? 'STALEMATE' : `VICTORY: PLAYER ${replay.winner}`}
							</span>
						</div>
						
						<div class="flex gap-4">
							<button 
								onclick={() => game.playReplay(replay)}
								class="p-3 rounded-xl bg-surface-container-highest text-on-surface hover:text-primary transition-colors"
								title="Watch Replay"
							>
								▶️
							</button>
							<button 
								onclick={() => game.deleteReplay(replay.id)}
								class="p-3 rounded-xl bg-surface-container-highest text-on-surface-variant hover:text-error transition-colors"
								title="Delete"
							>
								🗑️
							</button>
						</div>
					</div>
				{:else}
					<p class="text-center text-on-surface-variant font-body text-xs uppercase tracking-widest opacity-40 py-12">
						NO RECORDS FOUND IN NEURAL CACHE
					</p>
				{/each}
			</div>
		</div>
	{:else if game.gameState === 'playing'}
		<!-- Game Header -->
		<div in:fade={{ duration: 400 }} class="z-10 text-center mb-12 flex flex-col items-center">
			<button 
				onclick={() => game.goToMenu()}
				class="mb-8 text-[10px] font-display font-bold uppercase tracking-[0.4em] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 group"
			>
				<span class="group-hover:-translate-x-1 transition-transform">←</span> BACK TO MENU
			</button>
			<h2 class="text-4xl md:text-5xl font-display font-bold text-on-surface tracking-tighter uppercase mb-2">
				{game.gameMode === 'single' ? 'SINGLE PLAYER' : 'LOCAL BATTLE'}
			</h2>
			<div class="flex items-center gap-3">
				<div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
				<span class="text-on-surface-variant tracking-[0.3em] text-[10px] font-semibold uppercase opacity-60">System active...</span>
			</div>
		</div>

		<!-- Player Indicators -->
		<div class="z-10 flex gap-12 md:gap-24 mb-12">
			<!-- Player 1 -->
			<div class="flex flex-col items-center gap-3 transition-all duration-300 {game.currentPlayer === 1 ? 'opacity-100 scale-110' : 'opacity-30'}">
				<div class="w-12 h-12 rounded-full bg-[radial-gradient(circle_at_30%_30%,theme(colors.primary),theme(colors.primary-container))] {game.currentPlayer === 1 ? 'neon-shadow-primary' : ''}"></div>
				<span class="font-display font-bold text-sm text-primary tracking-widest uppercase">CYBER_PUNK</span>
			</div>
			<!-- Player 2 -->
			<div class="flex flex-col items-center gap-3 transition-all duration-300 {game.currentPlayer === 2 ? 'opacity-100 scale-110' : 'opacity-30'}">
				<div class="w-12 h-12 rounded-full bg-[radial-gradient(circle_at_30%_30%,theme(colors.secondary),theme(colors.secondary-container))] {game.currentPlayer === 2 ? 'neon-shadow-secondary' : ''}"></div>
				<span class="font-display font-bold text-sm text-secondary tracking-widest uppercase">
					{game.gameMode === 'single' ? 'NEON_ENGINE' : 'NEON_RAIDER'}
				</span>
			</div>
		</div>

		<!-- Game Board -->
		<div class="z-10 relative">
			<!-- Board Panel -->
			<div class="bg-surface-container-low p-4 md:p-6 rounded-3xl glass-panel relative">
				<div class="grid grid-cols-7 gap-3 md:gap-4">
					{#each game.board as row, rowIndex (rowIndex)}
						{#each row as cell, colIndex (colIndex)}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div 
								class="w-10 h-10 md:w-14 md:h-14 rounded-full bg-surface-container-lowest relative cursor-pointer overflow-hidden shadow-inner group"
								onclick={() => !game.isAiThinking && handleColumnClick(colIndex)}
							>
								<!-- Hover indicator column -->
								<div class="absolute inset-0 bg-surface-variant/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

								<!-- Token -->
								{#if cell === 1}
									<div 
										in:scale={{ duration: 400, easing: cubicOut, start: 0.5 }}
										class="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_30%_30%,theme(colors.primary),theme(colors.primary-container))] neon-shadow-primary"
									></div>
								{:else if cell === 2}
									<div 
										in:scale={{ duration: 400, easing: cubicOut, start: 0.5 }}
										class="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_30%_30%,theme(colors.secondary),theme(colors.secondary-container))] neon-shadow-secondary"
									></div>
								{/if}

								<!-- Winning Highlight -->
								{#if game.winningCells.some(c => c.row === rowIndex && c.col === colIndex)}
									<div class="absolute inset-0 bg-white/30 rounded-full animate-pulse pointer-events-none"></div>
								{/if}
							</div>
						{/each}
					{/each}
				</div>
			</div>
		</div>

		<!-- Footer control -->
		<div class="z-10 mt-12 flex flex-col items-center gap-8">
			<!-- AI Difficulty Selector (only when AI is enabled) -->
			{#if game.isAiEnabled}
				<div in:fade={{ duration: 300 }} class="flex flex-col items-center gap-4">
					<span class="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">Strategy Level</span>
					<div class="flex p-1 rounded-2xl bg-surface-container-highest ghost-border">
						{#each ['Beginner', 'Intermediate', 'Expert'] as level (level)}
							<button 
								onclick={() => game.aiDifficulty = level as Difficulty}
								class="px-4 py-2 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer
								{game.aiDifficulty === level ? 'bg-secondary text-background neon-shadow-secondary' : 'text-on-surface-variant hover:text-on-surface'}"
							>
								{level}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<button 
				onclick={() => game.reset()}
				class="font-display text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors ghost-border px-8 py-3 rounded-full bg-surface-container-highest cursor-pointer active:scale-95"
			>
				Reset System
			</button>
		</div>
	{/if}

	<!-- Victory / Draw Modal -->
	{#if game.winner && game.gameState === 'playing'}
		<div 
			in:fade={{ duration: 300 }}
			class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
		>
			<button class="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-auto cursor-default border-none w-full h-full" onclick={() => game.reset()} aria-label="Close modal"></button>
			
			<div class="relative z-10 flex flex-col items-center bg-surface-container-high p-12 rounded-3xl shadow-ambient pointer-events-auto border border-white/5"
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
				
				<p class="font-body text-on-surface-variant uppercase tracking-widest mb-8 text-xs opacity-60">
					{#if game.winner === 'draw'}
						THE VOID CLAIMS ALL
					{:else}
						SYSTEM OVERRIDE SUCCESSFUL
					{/if}
				</p>

				<div class="flex gap-4">
					<button 
						onclick={() => game.reset()}
						class="font-display font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-2xl transition-all duration-300
						{game.winner === 1 ? 'text-background bg-primary hover:bg-primary-container' : ''}
						{game.winner === 2 ? 'text-background bg-secondary hover:bg-secondary-container' : ''}
						{game.winner === 'draw' ? 'text-background bg-on-surface hover:bg-white' : ''}"
					>
						Reboot Match
					</button>
					<button 
						onclick={() => game.goToMenu()}
						class="font-display font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-2xl transition-all duration-300 ghost-border text-on-surface hover:bg-surface-container-highest"
					>
						Exit
					</button>
				</div>
			</div>
		</div>
	{/if}
	
	<!-- AI Thinking Indicator -->
	{#if game.isAiThinking && game.gameState === 'playing'}
		<div 
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200 }}
			class="fixed bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-6 py-3 rounded-full bg-surface-container-high shadow-ambient glass-panel"
		>
			<div class="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
			<span class="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Neural Link Active...</span>
		</div>
	{/if}
</main>
