let mouseHeld = false,
    mouseX = mouseY = null,
    draggingStart = false;

function initMouse() {
	canvas.addEventListener('mousemove', updateMousePos)
	document.addEventListener('mousedown', updateMousedown);
	document.addEventListener('mouseup', updateMouseup);
}

function updateMousePos(e) {
	mouseX = e.clientX - canvas.getBoundingClientRect().left;
	mouseY = e.clientY - canvas.getBoundingClientRect().top;

	let mouseCol = Math.floor(mouseX / TILE_W),
		mouseRow = Math.floor(mouseY / TILE_H),
		gIndex = (mouseRow * GRID_COLS) + mouseCol;

	if (draggingStart == true && gIndex != pathStart) {
		pathFound.length = 0;
		pathStart = gIndex;
		cameFrom.fill(-1);
	}
}

function updateMousedown(e) {
	mouseHeld = true;

	let mouseCol = Math.floor(mouseX / TILE_W),
		mouseRow = Math.floor(mouseY / TILE_H),
		gIndex = (mouseRow * GRID_COLS) + mouseCol;

	if (gIndex == pathStart) {
		draggingStart = true;
	}
}

function updateMouseup(e) {
	mouseHeld = false;

	if (draggingStart) {
		draggingStart = false;
	} else {
		let mouseCol = Math.floor(mouseX / TILE_W),
			mouseRow = Math.floor(mouseY / TILE_H),
			gIndex = (mouseRow * GRID_COLS) + mouseCol;
		
		if (grid[gIndex] !== 1) {
			//pathFound = earlyExitBF(pathStart, gIndex, grid);
			pathFound = uniformCostSearch(pathStart, gIndex, grid);
			//pathFound = greedyBestFirst(pathStart, gIndex, grid);
			//pathFound = aStarSearch(pathStart, gIndex, grid);
		}
	}
}