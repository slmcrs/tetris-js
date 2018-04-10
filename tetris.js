window.onload = function() {

	const canvas = document.getElementById('play_area');
	const ctx = canvas.getContext('2d');

	const gameRowCount = 24;
	const gameColumnCount = 10;
	const squareSize = 30;
	const startPosition = {row: 0, col: 3};

	canvas.width = gameColumnCount * squareSize;
	canvas.height = (gameRowCount) * squareSize;

	ctx.fillStyle = 'black';


	// returns a random integer within 0 through max
	function randomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}


	// creates a 2d array with the given dimmensions
	function createMatrix(w, h) {
		let matrix = [];
		while (h--) {
			matrix.push(new Array(w).fill(0));
		}
		return matrix;
	}


	// returns a random shape
	function randomShape() {
		let count = 0;
		let choice = randomInt(7);
		for (let shape in shapes) {
			if (count++ == choice) {
				return shapes[shape];
			}
		}
	}


	// this tracks all of the pieces that have been set and are not controlled by the player
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

		addPiece(piece) {
			for (let row = 0; row < piece.shape.length; row++) {
				for (let col = 0; col < piece.shape[row].length; col++) {
					if (piece.shape[row][col] != 0) {
						this.matrix[row + piece.position.row][col + piece.position.col] = piece.shape[row][col];
					}
				 }
			}
		}

	}
	

	// this class is used to track the falling piece that is controlled by the player
	class FallingPiece {
		constructor() {
			let temp = randomShape();
			this.color = temp.color;
			this.shape = temp.variants[randomInt(temp.variants.length)];
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

		// moves the piece down by 1 row
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
				// console.log('position updated');
				this.position = potentialPosition
			
			// piece could not be moved any more, add to board
			} else {
				board.addPiece(this);
				this.shape = randomShape().variants[0];
				this.position = startPosition;
			}
		}

		// moves the piece left or right depending on given input
		shiftAcross(direction) {

			let potentialPosition = {row: this.position.row, col: this.position.col + direction};
			let safe = true;

			for (let row = 0; row < this.shape.length; row++) {
				for (let col = 0; col < this.shape[row].length; col++) {
					if (this.shape[row][col] != 0) {

						let checkRow = row + potentialPosition.row;
						let checkCol = col + potentialPosition.col;

						// the piece has reached the bottom of the board
						if (col >= board.matrix[0].length) {
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
				// console.log('position updated');
				this.position = potentialPosition
			
			// piece could not be moved any more, add to board
			} else {

			}

		}


		rotate() {

		}


	}

	// create the board and player objects
	let board = new FrozenPieces();
	let player = new FallingPiece();
	
	// draws the current state of the game
	function update() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		board.draw();
		player.draw();
	}

	document.onkeydown = check;

	// function to check for player keypresses
	function check(e) {

		e = e || window.event;

		if (e.keyCode == '38') {
			// up arrow
			console.log('up key');
		}

		else if (e.keyCode == '40') {
			// down arrow
			player.shiftDown(board);
			update();			
		}

		else if (e.keyCode == '37') {
			// left arrow
			player.shiftAcross(-1);
			update();	   
		}

		else if (e.keyCode == '39') {
			// right arrow
			player.shiftAcross(1);
			update();	   
		}
		
	}

	// game timer
	let gameTimer = setInterval( function() {
		
		update();
		player.shiftDown(board);

	}, 300);

}