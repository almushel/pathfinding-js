//Breadth-first
function breadthFirstSearch(start, goal, graph) {
	let frontier = [];
	frontier.push(start);

	cameFrom.length = 0;
	cameFrom[start] = null;

	while (frontier.length > 0) {
		let current = frontier[0],
			currentNeighbors = getNeighborsBF(current, graph, false);

		for (let i = 0; i < currentNeighbors.length; i++) {
			if (cameFrom[currentNeighbors[i]] === undefined) {
				frontier.push(currentNeighbors[i]);
				cameFrom[currentNeighbors[i]] = current;
			}
		}
		frontier.shift();
	}
	return getPath(start, goal, cameFrom);
}

//Early Exit Breadth-first
function earlyExitBF(start, goal, graph) {
	let frontier = [];
	frontier.push(start);

    cameFrom.length = 0;
	cameFrom[start] = null;

	while (frontier.length > 0) {
		let current = frontier[0],
			currentNeighbors = getNeighborsBF(current, graph, false);

		if (current == goal) break;

		for (let i = 0; i < currentNeighbors.length; i++) {
			if (cameFrom[currentNeighbors[i]] === undefined) {
				frontier.push(currentNeighbors[i]);
				cameFrom[currentNeighbors[i]] = current;
			}
		}
		frontier.shift();
	}

	return getPath(start, goal, cameFrom);
}

//Uniform-cost Search / Dijkstra's algorithm 
function uniformCostSearch(start, goal, graph) {
	let frontier = new PriorityQueue();
	frontier.insertWithPriority(start, 0);

	costSoFar = [];
    costSoFar[start] = 0;
    
	cameFrom.length = 0;
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

//Greedy Best-first
function greedyBestFirst(start, goal, graph) {
	let frontier = new PriorityQueue();
	frontier.insertWithPriority(start, 0);

	cameFrom.length = 0;
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

//A*
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