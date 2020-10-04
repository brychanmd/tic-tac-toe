"use strict";

// Player Factory
const Player = (name, symbol) => {
	var name = name;
	var symbol = symbol;
	var cells = [];
	var wins = 0;

	return {name, symbol, cells, wins};
};

// Game Board Module
const gameBoard = (() => {
	
	var cells = document.querySelectorAll('.cell');
	var resetBtn = document.querySelector('#reset');
	var result = document.querySelector('#result');
	var winningCells = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]

	return {cells, resetBtn, result, winningCells};

})();

// Display Controller Module
const displayController = (() => {

	const resetBoard = () => {

		gameBoard.cells.forEach((value) => {
			value.classList.remove('circle', 'cross'); // Remove tokens from the board.
			value.addEventListener('click', () => {
				value.classList.add('circle');
			}, {once: true}); // Reset event listener on each cell.

		});
		gameBoard.result.style.display = "none"; // Hide the results div. 
		
		
	}

	const displayResults = () => {

		gameBoard.result.style.display = "flex";

	}

	gameBoard.resetBtn.addEventListener('click', () => {
		resetBoard();
	}); // Event listener for the reset button.

	return {resetBoard, displayResults};

})();

// Game Logic Module
const gameLogic = (() => {

	let player1 = Player('Brychan', 'circle');
	let player2 = Player('Ai', 'cross');


})();

displayController.resetBoard();
