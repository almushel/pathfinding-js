const C_WIDTH = 800;
const C_HEIGHT = 600;
const TILE_W = 40;
const TILE_H = 40;
const GRID_COLS = C_WIDTH / TILE_W;
const GRID_ROWS = C_HEIGHT / TILE_H;

let pathStart = Math.round(GRID_COLS * GRID_ROWS / 2);

let grid = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
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


//Get neighbors, excluding wall nodes
function getNeighborsBF(index, grid, diagonal) {
    let neighbors = [];

    for (let i = -1; i < 2; i++) {
        for (let e = -1; e < 2; e++) {
            //Skip corners if not diagonal
            if (!diagonal && Math.abs(i) == 1 && Math.abs(e) == 1) {
                continue;
            }

            let neighbor = index + e + (i * GRID_COLS);
            //Continue to next iteration if neighbor is outside of array
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
            //Skip corners if not diagonal
            if (!diagonal && Math.abs(i) == 1 && Math.abs(e) == 1) {
                continue;
            }

            let neighbor = index + e + (i * GRID_COLS);
            //Continue to next iteration if neighbor is outside of array
            if (neighbor < 0 || neighbor > grid.length - 1) {
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
    switch (graph[node]) {
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

    return { x: row, y: col };
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