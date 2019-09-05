function drawGrid() {
	ctx.fillStyle = 'dimgrey';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	let index = 0;
	for (let row = 0; row < GRID_ROWS; row++) {
		for (let col = 0; col < GRID_COLS; col++) {
			if (index == pathStart) {
				ctx.fillStyle = 'purple';
				ctx.fillRect(col * TILE_W + 1, row * TILE_H + 1, TILE_W - 2, TILE_H - 2);
			} else if (grid[index] == 1) {
				ctx.fillStyle = 'black';
				ctx.fillRect(col * TILE_W + 1, row * TILE_H + 1, TILE_W - 2, TILE_H - 2);
			} else if (grid[index] == 2) {
                ctx.fillStyle = 'darkblue';
				ctx.fillRect(col * TILE_W + 1, row * TILE_H + 1, TILE_W - 2, TILE_H - 2);
            }

			ctx.fillStyle = 'white';
			ctx.font = 'Arial 30px';
			ctx.textAlign = 'center';
			let tX = (col * TILE_W + 1) + (TILE_W - 2) / 2,
				tY = (row * TILE_H + 1) + (TILE_H - 2) / 2;

			ctx.fillText(index, tX, tY);

			index++;
		}
	}
}

function drawCameFrom() {
	let index = 0;
	for (let row = 0; row < GRID_ROWS; row++) {
		for (let col = 0; col < GRID_COLS; col++) {
			if (cameFrom[index] >= 0 && cameFrom[index] !== null) {
                if (grid[index] == 0) {
                    ctx.fillStyle = 'green';
                } else if (grid[index] == 1) {
                    ctx.fillStyle = '#353535';
                } else if (grid[index] == 2) {
                    ctx.fillStyle = 'blue';
                }
                
				ctx.fillRect(col * TILE_W + 1, row * TILE_H + 1, TILE_W - 2, TILE_H - 2);
			}

			index++;
		}
	}
}

function drawPathFound() {
	ctx.fillStyle = 'teal';
	for (let i = 0; i < pathFound.length; i++) {
		if (i == 1) {
			ctx.fillStyle = 'orange';
		}

		let col = pathFound[i] % GRID_COLS,
			row = Math.floor(pathFound[i] / GRID_COLS);
		ctx.fillRect(col * TILE_W, row * TILE_H, TILE_W, TILE_H);
	}
}

function drawMouseTile() {
	ctx.strokeStyle = 'blue';
	ctx.beginPath();
	ctx.rect(mouseX - (mouseX % TILE_W), mouseY - (mouseY % TILE_H), TILE_W, TILE_H);
	ctx.stroke();
}