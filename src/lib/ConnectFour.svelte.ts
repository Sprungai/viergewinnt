export type Player = 1 | 2;
export type Cell = Player | null;

export class ConnectFourGame {
	rows = 6;
	cols = 7;

	board = $state<Cell[][]>(this.createEmptyBoard());
	currentPlayer = $state<Player>(1);
	winner = $state<Player | 'draw' | null>(null);
	winningCells = $state<{ row: number; col: number }[]>([]);

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
	}

	dropToken(col: number) {
		if (this.winner || col < 0 || col >= this.cols) return false;

		// Find lowest empty row
		for (let row = this.rows - 1; row >= 0; row--) {
			if (this.board[row][col] === null) {
				this.board[row][col] = this.currentPlayer;
				
				if (this.checkWin(row, col)) {
					this.winner = this.currentPlayer;
				} else if (this.checkDraw()) {
					this.winner = 'draw';
				} else {
					this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
				}
				
				return true;
			}
		}
		return false; // Column is full
	}

	private checkDraw() {
		return this.board[0].every(cell => cell !== null);
	}

	private checkWin(row: number, col: number) {
		const directions = [
			[[0, 1], [0, -1]], // horizontal
			[[1, 0], [-1, 0]], // vertical
			[[1, 1], [-1, -1]], // diagonal down-right
			[[1, -1], [-1, 1]]  // diagonal up-right
		];

		const player = this.board[row][col];

		for (const dir of directions) {
			let count = 1;
			const winningPath = [{ row, col }];

			for (const [dRow, dCol] of dir) {
				let r = row + dRow;
				let c = col + dCol;
				
				while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.board[r][c] === player) {
					count++;
					winningPath.push({ row: r, col: c });
					r += dRow;
					c += dCol;
				}
			}

			if (count >= 4) {
				this.winningCells = winningPath;
				return true;
			}
		}

		return false;
	}
}
