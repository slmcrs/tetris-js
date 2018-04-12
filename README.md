# tetris-js
Just another tetris clone in HTML5 + JS

---Important design question---
Is it acceptable that we have hardcoded rotation variations,
or would it be better to implement a matrix-rotation
algorithm? I guess it comes down to what exactly Shirazi 
is looking for.

## What is left to do:
- Important:
  * side panel that shows next piece & score
  * scoring system
  * add start & pause menu
- Not so important:
  * make 'gameOver' action more interesting.
  * when a line is cleared, if a piece is broken apart from it, the broken 'clumps'
  should fall until there is no empty space. Not all tetris games implement this,
  but I might implement it later.
  * when player rotates against the wall, push block over to accommodate new width
  * show ghost piece at the lowest point the piece can go straight down
  * add button to send piece down instantly
  * delay setting of piece if player moves across or rotates --Think it already
  does this, at least it does for me--
