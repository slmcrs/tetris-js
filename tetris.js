window.onload = function () {

	const canvas = document.getElementById('play_area');
	const ctx = canvas.getContext('2d');

	const gameRowCount = 24;
	const gameColumnCount = 10;
	const squareSize = 30;

	canvas.width = gameColumnCount * squareSize;
	canvas.height = (gameRowCount) * squareSize;

	ctx.fillStyle = 'black';


	// creates a 2d array with the given dimmensions
	function createMatrix (w, h) {
	    let matrix = [];
	    while (h--) {
	    	matrix.push(new Array(w).fill(0));
	    }
	    return matrix;
	}


	class FrozenPieces {
		constructor() {
			this.matrix = createMatrix(gameColumnCount, gameRowCount);
			this.matrix[23][2] = 1;
			this.matrix[23][1] = 1;
			this.matrix[22][2] = 1;
			this.matrix[23][3] = 1;
		}

		draw() {
			for (let row = 0; row < this.matrix.length; row++) {
				for (let col = 0; col < this.matrix[row].length; col++) {
					if (this.matrix[row][col] != 0) {
						ctx.strokeRect(col * squareSize, row * squareSize, squareSize, squareSize);
					}
				}
			}
		}
	}
	

	class FallingPiece {
		constructor(shape) {
			this.shape = shape;
			this.position = { row: 0, col: 3 };
		}


		draw() {
			for (let row = 0; row < this.shape.length; row++) {
				for (let col = 0; col < this.shape[row].length; col++) {
					if (this.shape[row][col] != 0) {
						let drawCol = this.position.col + col;
						let drawRow = this.position.row + row;
						ctx.strokeRect(drawCol * squareSize, drawRow * squareSize, squareSize, squareSize);
					}
				 }
			}
		}


		shiftDown(board) {

			let potentialPosition = {row: this.position.row + 1, col: this.position.col};
			let safe = true;

			for (let row = 0; row < this.shape.length; row++) {
				for (let col = 0; col < this.shape[row].length; col++) {
					if (this.shape[row][col] != 0) {

						let checkRow = row + potentialPosition.row;
						let checkCol = col + potentialPosition.col;

						// the piece has reached the bottom of the board
						if (checkRow >= board.matrix.length) {
							safe = false;

						// the piece has collided with a set block
						} else if (board.matrix[checkRow][checkCol] !== 0) {
							safe = false;
						}

					}	
				}
			}

			// piece did not have any issues, update to new position
			if (safe) {
				console.log('position updated');
				this.position = potentialPosition
			
			// piece could not be moved any more, add to board
			} else {

			}
		}


		shiftAcross(direction) {

		}


		rotate() {

		}


	}

	let board = new FrozenPieces();
	let player = new FallingPiece(shapes['L'].variants[0]);

	// game timer
	let gameTimer = setInterval( function() {
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		board.draw();

		player.draw();
		player.shiftDown(board);


	}, 300);

}