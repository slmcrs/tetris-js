//window.onload = function() {

	
	//now game starts after pressing 'space'.
	//at 'gameOver' goes back to start screen 
	//after alert prompt.
	var started = false;
	
	window.onkeydown = function(event){
		
		event = event || window.event;
		
		
		if(event.keyCode == '32' && !started){
			
			started = true;
			
			var pause = false;
			
			document.getElementById('startScreen').style.display = "none";
			document.getElementById('play_area').style.display = "block";
			
			const canvas = document.getElementById('play_area');
			const ctx = canvas.getContext('2d');
			
			const pauseImg = new Image();
		    pauseImg.src = './img/paused.png';
			
			const gameRowCount = 24;
			const gameColumnCount = 10;
			const squareSize = 30;
			const startPosition = {row: -4, col: 3};

			canvas.width = gameColumnCount * squareSize;
			canvas.height = gameRowCount * squareSize;

			var gameOver = false;

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
			
			// maps the color number to the img file
			// works for now but should work on a better
			// solution later
			function getImgSrc(number) {
				switch (number) {
					case 0:
						return './img/white.png';
					case 1:
						return './img/orange.png';
					case 2:
						return './img/blue.png';
					case 3:
						return './img/purple.png';
					case 4:
						return './img/green.png';
					case 5:
						return './img/red.png';
					case 6:
						return './img/aqua.png';
					case 7:
						return './img/yellow.png';
					default:
						break;
				}
			}

			// draws the block png at the specified position
			function drawBlock(colorInt, col, row) {
				let img = new Image();
				img.src = getImgSrc(colorInt);
				ctx.drawImage(img, col * img.width, row * img.height);
			}

			// board object, for all the pieces that have been set
			let board = {
				matrix: createMatrix(gameColumnCount, gameRowCount),

				draw: function() {
					
					this.checkForLines();
					
					for (let row = 0; row < this.matrix.length; row++) {
						for (let col = 0; col < this.matrix[row].length; col++) {
							if (this.matrix[row][col] != 0) {
								drawBlock(this.matrix[row][col], col, row);
							}
						}
					}
				},

				//if piece cannot be added (triggers an error) flag 'gameOver' 
				//to end game
				addPiece: function(shape) {
					for (let row = 0; row < shape.piece.length; row++) {
						for (let col = 0; col < shape.piece[row].length; col++) {
							if (shape.piece[row][col] != 0) {
								try{
								this.matrix[row + shape.position.row][col + shape.position.col] = shape.color;
								
								}catch(error){
									gameOver = true;	
								}
							}
						}
					}
				},
				
				
				// see if there are any lines in the row
				// if so clear them.
				checkForLines: function(){
				
					let line = true;
					let shiftNeeded = true;
					
					for (let row = 0; row < this.matrix.length; row++) {
						for (let col = 0; col < this.matrix[row].length; col++) {
							if (this.matrix[row][col] == 0) {	
								line = false;
							}
						}
						if (line == true) {

							for (let col = 0; col < this.matrix[row].length; col++) {
								this.matrix[row][col] = 0;
							}
							// Slide blocks down if there is space beneath them
							// after clear.
							let index = row;

							for (index; index > 0; index--) {
								for (let col = 0; col < this.matrix[index].length; col++) {
									if (this.matrix[index][col] == 0 && this.matrix[index - 1][col] != 0) {
										this.matrix[index][col] = this.matrix[index - 1][col];
										this.matrix[index - 1][col] = 0;
									}

								}

							}
							
						}
						line = true;
					}
				
				}
			
			}


			// initial piece info
			let first_shape = randomShape();
			let first_color = first_shape.colorNumber;
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
								drawBlock(this.color, drawCol, drawRow);
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

								if (checkRow < 0) {
									continue;

								// the piece has reached the bottom of the board
								} else if (checkRow >= board.matrix.length) {
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
						this.position = potentialPosition
					
					// piece could not be moved any more, add to board
					} else {
						board.addPiece(this);
						
						//added so variables change for a different piece
						this.shape = randomShape();
						this.index = randomInt(this.shape.variants.length);
						this.piece = this.shape.variants[this.index];
						this.color = this.shape.colorNumber;
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

								if (checkRow < 0) {
									continue;

								// the piece has collided with a set block
								} else if (board.matrix[checkRow][checkCol] !== 0) {
									safe = false;
								}

							}	
						}
					}

					// piece did not have any issues, update to new position
					if (safe) {
						this.position = potentialPosition;
					}
				},

				rotate: function(){
					//fairly simple, switch variants without going
					//out of bounds of array
					
					let newIndex = this.index;
					
					if (this.index == this.shape.variants.length - 1) {
						newIndex = 0;
					} else {
						newIndex++;
					}

					this.index = newIndex;
					let potentialPiece = this.shape.variants[newIndex];
					
					
					//TODO: working on function to determine new position
					//after rotation. As of right now rotating seems to move
					//pieces left or right by one collumn level.

					// TODO: Push piece over if attempted rotate against wall
					
					let safe = true;
				
					for (let row = 0; row < potentialPiece.length; row++) {
						for (let col = 0; col < potentialPiece[row].length; col++) {
							if (potentialPiece[row][col] != 0 ) {

								let checkRow = row + this.position.row;
								let checkCol = col + this.position.col;

								// the piece has collided with a set block
								if (board.matrix[checkRow][checkCol] !== 0) {
									safe = false;
								}

							}	
						}
					}

					// piece did not have any issues, update to new piece
					if (safe) {
						this.piece = potentialPiece;
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
					update();
				}

				else if (e.keyCode == '40') {
					// down arrow
					player.shiftDown();
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
				
				else if (e.keyCode == '32') {
					// spaceBar
					if(pause){
						pause = false;
					} else {
						pause = true;
						ctx.drawImage(pauseImg, 150 - (pauseImg.width/2), 360 - (pauseImg.height/2));
					}
				}
			}


			// draws the current state of the game
			function update() {
				
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				
				board.draw();
				player.draw();
				
			}

			function showPaused() {
				
			}

			// game timer
			
			//if 'gameOver' is flagged we show a 
			//game over message and reload. Primitive for now
			//but we can make it fancier later if neccessary
			
			//need to pause timer when 'paused'.
			//not sure how to do this. Could just
			//scrap the timer, tetris isn't a long game and
			//if player can continue scoring why limit time?
			let gameTimer = setInterval( function() {
				if(!gameOver && !pause){
					update();
					player.shiftDown();
				
				} else if(gameOver){
					console.log("over");
					alert("GAME OVER");
					document.location.reload();
				}
			}, 300);
		}
	}
	
//}



