window.onload = function() {

	const canvas = document.getElementById('play_area');
	const ctx = canvas.getContext('2d');

	const gameRowCount = 24;
	const gameColumnCount = 10;
	const squareSize = 30;
	const startPosition = {row: 0, col: 3};

	canvas.width = gameColumnCount * squareSize;
	canvas.height = gameRowCount * squareSize;


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

	// board object, for all the pieces that have been set
	let board = {
		matrix: createMatrix(gameColumnCount, gameRowCount),

		draw: function() {
			for (let row = 0; row < this.matrix.length; row++) {
				for (let col = 0; col < this.matrix[row].length; col++) {
					if (this.matrix[row][col] != 0) {
						ctx.strokeRect(col * squareSize, row * squareSize, squareSize, squareSize);
					}
				}
			}
		},

		addPiece: function(shape) {
			for (let row = 0; row < shape.piece.length; row++) {
				for (let col = 0; col < shape.piece[row].length; col++) {
					if (shape.piece[row][col] != 0) {
						this.matrix[row + shape.position.row][col + shape.position.col] = shape.piece[row][col];
					}
				 }
			}
		}
	}


	// initial piece info
	let first_shape = randomShape();
	let first_color = first_shape.color;
	let first_index = randomInt(first_shape.variants.length);
	let first_piece = first_shape.variants[first_index];


	// player object, contains all code related to moving piece
	let player = {
		shape: first_shape,
		color: first_color,
		index: first_index,
		piece: first_piece,
		position: startPosition,

		// draws the piece at its current position
		draw: function() {
			for (let row = 0; row < this.piece.length; row++) {
				for (let col = 0; col < this.piece[row].length; col++) {
					if (this.piece[row][col] != 0) {
						let drawCol = this.position.col + col;
						let drawRow = this.position.row + row;
						ctx.strokeRect(drawCol * squareSize, drawRow * squareSize, squareSize, squareSize);
					}
				 }
			}
		},

		// shifts the piece down one row
		shiftDown: function() {
			let potentialPosition = {row: this.position.row + 1, col: this.position.col};
			let safe = true;

			for (let row = 0; row < this.piece.length; row++) {
				for (let col = 0; col < this.piece[row].length; col++) {
					if (this.piece[row][col] != 0) {

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
				this.piece = randomShape().variants[0];
				this.position = startPosition;
			}
		},
		
		// moves piece left or right depending on input
		shiftAcross: function(direction) {
			let potentialPosition = {row: this.position.row, col: this.position.col + direction};
			let safe = true;

			for (let row = 0; row < this.piece.length; row++) {
				for (let col = 0; col < this.piece[row].length; col++) {
					if (this.piece[row][col] != 0) {

						let checkRow = row + potentialPosition.row;
						let checkCol = col + potentialPosition.col;

						// the piece has reached the sides of the board
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
			}
		}

	}


	// listen for keypresses
	document.onkeydown = check;

	// handle each keypress
	function check(e) {

		e = e || window.event;

		if (e.keyCode == '38') {
			// up arrow
			player.rotate();
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


	// draws the current state of the game
	function update() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		board.draw();
		player.draw();
	}


	// game timer
	let gameTimer = setInterval( function() {
		
		update();
		player.shiftDown();

	}, 300);

}