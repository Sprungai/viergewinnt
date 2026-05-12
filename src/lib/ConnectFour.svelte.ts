export type Player = 1 | 2;
export type Cell = Player | null;

export class ConnectFourGame {
	rows = 6;
	cols = 7;

	board = $state<Cell[][]>(this.createEmptyBoard());
	currentPlayer = $state<Player>(1);
	winner = $state<Player | 'draw' | null>(null);
	winningCells = $state<{ row: number; col: number }[]>([]);
	
	isAiEnabled = $state(false);
	isAiThinking = $state(false);

	createEmptyBoard(): Cell[][] {
		return Array(this.rows)
			.fill(null)
			.map(() => Array(this.cols).fill(null));
	}

	reset() {
		this.board = this.createEmptyBoard();
		this.currentPlayer = 1;
		this.winner = null;
		this.winningCells = [];
		this.isAiThinking = false;
	}

	toggleAi() {
		this.isAiEnabled = !this.isAiEnabled;
		if (this.isAiEnabled && this.currentPlayer === 2 && !this.winner) {
			this.triggerAiMove();
		}
	}

	async dropToken(col: number) {
		if (this.winner || this.isAiThinking || col < 0 || col >= this.cols) return false;

		const success = this.executeMove(col);
		
		if (success && this.isAiEnabled && !this.winner && this.currentPlayer === 2) {
			await this.triggerAiMove();
		}

		return success;
	}

	private executeMove(col: number): boolean {
		for (let row = this.rows - 1; row >= 0; row--) {
			if (this.board[row][col] === null) {
				this.board[row][col] = this.currentPlayer;
				
				if (this.checkWin(row, col, this.board)) {
					this.winner = this.currentPlayer;
					// Winning cells are set inside checkWin for the real board
				} else if (this.checkDraw(this.board)) {
					this.winner = 'draw';
				} else {
					this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
				}
				return true;
			}
		}
		return false;
	}

	private async triggerAiMove() {
		this.isAiThinking = true;
		// Small delay to make it feel more natural
		await new Promise(resolve => setTimeout(resolve, 600));
		
		const bestMove = this.getBestMove();
		this.isAiThinking = false;
		
		if (bestMove !== -1) {
			this.executeMove(bestMove);
		}
	}

	private getBestMove(): number {
		let bestScore = -Infinity;
		const moves = this.getValidMoves(this.board);
		let bestMove = moves[Math.floor(Math.random() * moves.length)];

		for (const col of moves) {
			const tempBoard = this.cloneBoard(this.board);
			this.makeTempMove(tempBoard, col, 2);
			const score = this.minimax(tempBoard, 6, -Infinity, Infinity, false);
			if (score > bestScore) {
				bestScore = score;
				bestMove = col;
			}
		}

		return bestMove;
	}

	private minimax(board: Cell[][], depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
		const result = this.getBoardStatus(board);
		if (result === 2) return 1000000 + depth;
		if (result === 1) return -1000000 - depth;
		if (result === 'draw' || depth === 0) return this.evaluateBoard(board);

		if (isMaximizing) {
			let maxEval = -Infinity;
			for (const col of this.getValidMoves(board)) {
				const tempBoard = this.cloneBoard(board);
				this.makeTempMove(tempBoard, col, 2);
				const evalScore = this.minimax(tempBoard, depth - 1, alpha, beta, false);
				maxEval = Math.max(maxEval, evalScore);
				alpha = Math.max(alpha, evalScore);
				if (beta <= alpha) break;
			}
			return maxEval;
		} else {
			let minEval = Infinity;
			for (const col of this.getValidMoves(board)) {
				const tempBoard = this.cloneBoard(board);
				this.makeTempMove(tempBoard, col, 1);
				const evalScore = this.minimax(tempBoard, depth - 1, alpha, beta, true);
				minEval = Math.min(minEval, evalScore);
				beta = Math.min(beta, evalScore);
				if (beta <= alpha) break;
			}
			return minEval;
		}
	}

	private evaluateBoard(board: Cell[][]): number {
		let score = 0;
		// Prioritize center column
		const centerCol = Math.floor(this.cols / 2);
		for (let row = 0; row < this.rows; row++) {
			if (board[row][centerCol] === 2) score += 3;
			if (board[row][centerCol] === 1) score -= 3;
		}

		score += this.countSets(board, 2) * 10;
		score -= this.countSets(board, 1) * 10;
		
		return score;
	}

	private countSets(board: Cell[][], player: Player): number {
		let count = 0;
		
		// Check horizontal
		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.cols - 3; c++) {
				const window = [board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]];
				if (this.isPotentialWin(window, player)) count++;
			}
		}

		// Check vertical
		for (let r = 0; r < this.rows - 3; r++) {
			for (let c = 0; c < this.cols; c++) {
				const window = [board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]];
				if (this.isPotentialWin(window, player)) count++;
			}
		}

		// Check diagonals
		for (let r = 0; r < this.rows - 3; r++) {
			for (let c = 0; c < this.cols - 3; c++) {
				const window = [board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]];
				if (this.isPotentialWin(window, player)) count++;
			}
			for (let c = 3; c < this.cols; c++) {
				const window = [board[r][c], board[r+1][c-1], board[r+2][c-2], board[r+3][c-3]];
				if (this.isPotentialWin(window, player)) count++;
			}
		}

		return count; 
	}

	private isPotentialWin(window: (Cell)[], player: Player): boolean {
		const playerCount = window.filter(c => c === player).length;
		const emptyCount = window.filter(c => c === null).length;
		return playerCount === 3 && emptyCount === 1;
	}

	private getBoardStatus(board: Cell[][]): Player | 'draw' | null {
		// Check for win without setting winningCells
		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.cols; c++) {
				if (board[r][c] !== null && this.checkWinOnly(r, c, board)) {
					return board[r][c] as Player;
				}
			}
		}
		if (this.checkDraw(board)) return 'draw';
		return null;
	}

	private getValidMoves(board: Cell[][]): number[] {
		const moves: number[] = [];
		for (let c = 0; c < this.cols; c++) {
			if (board[0][c] === null) moves.push(c);
		}
		return moves;
	}

	private makeTempMove(board: Cell[][], col: number, player: Player) {
		for (let r = this.rows - 1; r >= 0; r--) {
			if (board[r][col] === null) {
				board[r][col] = player;
				break;
			}
		}
	}

	private cloneBoard(board: Cell[][]): Cell[][] {
		return board.map(row => [...row]);
	}

	private checkDraw(board: Cell[][]) {
		return board[0].every(cell => cell !== null);
	}

	private checkWin(row: number, col: number, board: Cell[][]) {
		const directions = [
			[[0, 1], [0, -1]], // horizontal
			[[1, 0], [-1, 0]], // vertical
			[[1, 1], [-1, -1]], // diagonal down-right
			[[1, -1], [-1, 1]]  // diagonal up-right
		];

		const player = board[row][col];
		if (!player) return false;

		for (const dir of directions) {
			let count = 1;
			const winningPath = [{ row, col }];

			for (const [dRow, dCol] of dir) {
				let r = row + dRow;
				let c = col + dCol;
				
				while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && board[r][c] === player) {
					count++;
					winningPath.push({ row: r, col: c });
					r += dRow;
					c += dCol;
				}
			}

			if (count >= 4) {
				if (board === this.board) this.winningCells = winningPath;
				return true;
			}
		}
		return false;
	}

	private checkWinOnly(row: number, col: number, board: Cell[][]) {
		const directions = [
			[0, 1], [1, 0], [1, 1], [1, -1]
		];
		const player = board[row][col];
		for (const [dr, dc] of directions) {
			let count = 1;
			// check one direction
			for (let i = 1; i < 4; i++) {
				const r = row + dr * i, c = col + dc * i;
				if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && board[r][c] === player) count++;
				else break;
			}
			// check opposite direction
			for (let i = 1; i < 4; i++) {
				const r = row - dr * i, c = col - dc * i;
				if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && board[r][c] === player) count++;
				else break;
			}
			if (count >= 4) return true;
		}
		return false;
	}
}
