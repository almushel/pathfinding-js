let canvas, ctx,
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
}