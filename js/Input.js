let mouseHeld = false,
	mouseX = mouseY = null,
	draggingStart = false,
	currentSearch = 1;

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
		cameFrom.length = 0;
		update();
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
			switch (currentSearch) {
				case 1:
					pathFound = breadthFirstSearch(pathStart, gIndex, grid);
					break;
				case 2:
					pathFound = earlyExitBF(pathStart, gIndex, grid);
					break;
				case 3:
					pathFound = uniformCostSearch(pathStart, gIndex, grid);
					break;
				case 4:
					pathFound = greedyBestFirst(pathStart, gIndex, grid);
					break;
				case 5:
					pathFound = aStarSearch(pathStart, gIndex, grid);
					break
			}
			update();
		}
	}
}

function setSearchType(type) {
	currentSearch = type;
	let searchTitle = document.getElementById('searchtype'),
		titleString;

	switch (type) {
		case 1:
			titleString = 'Breadth-First Search'
			break;
		case 2:
			titleString = 'Early Exit Breadth-First Search'
			break;
		case 3:
			titleString = 'Uniform-Cost Search'
			break;
		case 4:
			titleString = 'Greedy Best-First Search'
			break;
		case 5:
			titleString = 'A* Search'
			break;
	}

	searchTitle.innerHTML = titleString;
}