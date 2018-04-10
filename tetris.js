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


	// create matrices for the game
	function TetrisGrid (width, height) {

		// creates the 2d array that will track the occupied positions
		this.grid = createMatrix(width, height);


		// adds a block to the given position
		this.addBlock = function (x, y) {
			let matrix = this.grid;
			matrix[matrix.length - (1 + y)][x] = 1;
		}


		// removes a block from the given position
		this.removeBlock = function (x, y) {
			let matrix = this.grid;
			matrix[matrix.length - (1 + y)][x] = 0;
		}


		// draws the occupied blocks in the grid to the canvas
		this.drawGrid = function () {

			let matrix = this.grid;

			for (let r = matrix.length - 1; r >= 0; r--) {
				for (let c = 0; c < matrix[r].length; c++) {

					// only draw block if it is occupied
					if (matrix[r][c] === 1) {
						ctx.fillRect(c * squareSize, r * squareSize, squareSize, squareSize);
					}

					ctx.lineWidth = 0.1;
					ctx.strokeRect(c * squareSize, r * squareSize, squareSize, squareSize);

				}
			}
		}


	}

	function addShape (x, y) {


		let shape = [[0, 0, 0], [0, 1, 0], [1, 1, 1]];
		ctx.fillStyle = 'purple';

		for (let row = 0; row < shape.length; row++) {
			for (let col = 0; col < shape[row].length; col++) {
				if (shape[row][col] == 1) {
					fallingBlocks.addBlock(x + col, y - row);
				}
			}
		}


	}


	let setBlocks = new TetrisGrid(gameColumnCount, gameRowCount);
	let fallingBlocks = new TetrisGrid(gameColumnCount, gameRowCount);


	// let blocky = 23;
	// let blockx = 5;

	addShape(1, 6);

	let gameTimer = setInterval( function() {
		
		// if (blocky > 0) {
		// 	fallingBlocks.removeBlock(blockx, blocky);
		// 	fallingBlocks.addBlock(blockx, --blocky);
		// }

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		setBlocks.drawGrid();
		fallingBlocks.drawGrid();

	}, 300);

}