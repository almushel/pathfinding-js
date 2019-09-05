let mouseHeld = false,
	mouseX = mouseY = null;

const C_WIDTH = 800;
const C_HEIGHT = 600;
const TILE_W = 40;
const TILE_H = 40;
const GRID_COLS = C_WIDTH / TILE_W;
const GRID_ROWS = C_HEIGHT / TILE_H;

let pathStart = Math.round(GRID_COLS * GRID_ROWS / 2);
let draggingStart = false;

let canvas, ctx,
	grid = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 0, 0, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1,
			1, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 1,
			1, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
			1, 0, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
			1, 0, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
			1, 0, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
			1, 0, 0, 0, 2, 2, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
			1, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
			1, 0, 0, 0, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1,
			1, 0, 0, 0, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1,
			1, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
	cameFrom = [],
	pathFound = [];

window.onload = function () {
	canvas = document.getElementById('gridCanvas');
	ctx = canvas.getContext('2d');
	initMouse();
	update();
}

function update() {
	drawGrid();
	drawCameFrom();
	drawPathFound();
	drawMouseTile();
	requestAnimationFrame(update);
}

function generateGrid() {
	let index = 0;
	for (let row = 0; row < GRID_ROWS; row++) {
		for (let col = 0; col < GRID_COLS; col++) {
			if (col == 0 || col == GRID_COLS - 1) {
				grid[index] = 1;
			} else if (row == 0 || row == GRID_ROWS - 1) {
				grid[index] = 1;
			} else {
				grid[index] = 0;
			}
			index++;
		}
	}
	logGrid(grid, GRID_COLS, GRID_ROWS);
}

function logGrid(grid, width, height) {
	let gString = '';
	let index = 0;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			gString += grid[index] + ', ';
			index++
		}
		gString += '\n';
	}

	console.log(gString);
}

function breadthFirstSearch(start, graph) {
	let frontier = [];
	frontier.push(start);

	cameFrom.length = graph.length;
	cameFrom.fill(-1);
	cameFrom[start] = null;

	while (frontier.length > 0) {
		let current = frontier[0],
			currentNeighbors = getNeighborsBF(current, graph, false);

		for (let i = 0; i < currentNeighbors.length; i++) {
			if (cameFrom[currentNeighbors[i]] === -1) {
				frontier.push(currentNeighbors[i]);
				cameFrom[currentNeighbors[i]] = current;
			}
		}
		frontier.shift();
	}
}

function earlyExitBF(start, goal, graph) {
	let frontier = [];
	frontier.push(start);

	cameFrom.length = graph.length;
	cameFrom.fill(-1);
	cameFrom[start] = null;

	while (frontier.length > 0) {
		let current = frontier[0],
			currentNeighbors = getNeighborsBF(current, graph, false);

		if (current == goal) break;

		for (let i = 0; i < currentNeighbors.length; i++) {
			if (cameFrom[currentNeighbors[i]] === -1) {
				frontier.push(currentNeighbors[i]);
				cameFrom[currentNeighbors[i]] = current;
			}
		}
		frontier.shift();
	}

	return getPath(start, goal, cameFrom);
}

function uniformCostSearch(start, goal, graph) {
	let frontier = new PriorityQueue();
	frontier.insertWithPriority(start, 0);

	costSoFar = [];
	costSoFar[start] = 0;
	cameFrom.length = graph.length;
	cameFrom.fill(-1);
	cameFrom[start] = null;

	while (!frontier.isEmpty()) {
		let current = frontier.pullLowestPriority(),
			currentNeighbors = getNeighbors(current, graph, false);

		if (current == goal) break;

		for (let i = 0; i < currentNeighbors.length; i++) {
			let neighbor = currentNeighbors[i],
				newCost = costSoFar[current] + getMoveCost(neighbor, grid);

			if (costSoFar[neighbor] === undefined || newCost < costSoFar[neighbor]) {
				costSoFar[neighbor] = newCost;
				let priority = newCost;
				frontier.insertWithPriority(neighbor, priority);
				cameFrom[neighbor] = current;
			}
		}
	}
	return getPath(start, goal, cameFrom);
}

function greedyBestFirst(start, goal, graph) {
	let frontier = new PriorityQueue();
	frontier.insertWithPriority(start, 0);

	cameFrom.length = 0;
	cameFrom.length = graph.length;
	cameFrom[start] = null;

	while (!frontier.isEmpty()) {
		let current = frontier.pullLowestPriority(),
			currentNeighbors = getNeighborsBF(current, graph, false);

		if (current == goal) break;

		for (let i = 0; i < currentNeighbors.length; i++) {
			let neighbor = currentNeighbors[i],
				priority = heuristic(goal, neighbor);
			if (cameFrom[currentNeighbors[i]] === undefined) {
				frontier.insertWithPriority(neighbor, priority);
				cameFrom[neighbor] = current;
			}
		}
	}

	return getPath(start, goal, cameFrom);
}

function aStarSearch(start, goal, graph) {
	let frontier = new PriorityQueue();
	frontier.insertWithPriority(start, 0);

	costSoFar = [];
	costSoFar[start] = 0;
	cameFrom.length = graph.length;
	cameFrom.fill(-1);
	cameFrom[start] = null;

	while (!frontier.isEmpty()) {
		let current = frontier.pullLowestPriority(),
			currentNeighbors = getNeighbors(current, graph, false);

		if (current == goal) break;

		for (let i = 0; i < currentNeighbors.length; i++) {
			let neighbor = currentNeighbors[i],
				newCost = costSoFar[current] + getMoveCost(neighbor, grid);

			if (costSoFar[neighbor] === undefined || newCost < costSoFar[neighbor]) {
				costSoFar[neighbor] = newCost;
				let priority = newCost + heuristic(goal, neighbor);
				frontier.insertWithPriority(neighbor, priority);
				cameFrom[neighbor] = current;
			}
		}
	}
	return getPath(start, goal, cameFrom);
}

function getPath(start, goal, searchGraph) {
	let current = goal;
	path = [];

	while (current != start) {
		path.push(current);
		current = searchGraph[current];
	}

	return path;
}

function getNeighborsBF(index, grid, diagonal) {
	let neighbors = [];

	for (let i = -1; i < 2; i++) {
		for (let e = -1; e < 2; e++) {
			if (!diagonal && Math.abs(i) == 1 && Math.abs(e) == 1) {
				continue;
			}

			let neighbor = index + e + (i * GRID_COLS);
			if (neighbor < 0 || neighbor > grid.length - 1 || grid[neighbor] === 1) {
				continue;
			}

			if (neighbor % GRID_COLS >= 0 && neighbor % GRID_COLS < GRID_COLS && neighbor != index) {
				if (Math.floor(neighbor / GRID_COLS) == Math.floor(index / GRID_COLS) + i) {
					neighbors.push(neighbor);
				}

			}
		}
	}
	return neighbors;
}

function getNeighbors(index, grid, diagonal) {
	let neighbors = [];

	for (let i = -1; i < 2; i++) {
		for (let e = -1; e < 2; e++) {
			if (!diagonal && Math.abs(i) == 1 && Math.abs(e) == 1) {
				continue;
			}

			let neighbor = index + e + (i * GRID_COLS);
			if (neighbor < 0 || neighbor > grid.length - 1) { //) || grid[neighbor] === 1) {
				continue;
			}

			if (neighbor % GRID_COLS >= 0 && neighbor % GRID_COLS < GRID_COLS && neighbor != index) {
				if (Math.floor(neighbor / GRID_COLS) == Math.floor(index / GRID_COLS) + i) {
					neighbors.push(neighbor);
				}

			}
		}
	}
	return neighbors;
}

function getMoveCost(node, graph) {
	switch(graph[node]) {
		case 0:
			return 1;
		case 1:
			return 100;
		case 2:
			return 5;
		default:
			return 1;
	}
}

function heuristic(aIndex, bIndex) {
	let a = indexToColRow(aIndex, GRID_COLS, GRID_ROWS),
		b = indexToColRow(bIndex, GRID_COLS, GRID_ROWS);

	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function indexToColRow(index, width, height) {
	let col = index % width,
		row = Math.floor(index / height);

	return {x: row, y: col};
}