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
	var resultWindow = document.querySelector('#result');

	var board = [
		'', '', '', 
		'', '', '', 
		'', '', '',
	];
	var board2 = [
		'circle', 'cross', 'circle', 
		'cross', 'cross', 'cross', 
		'cross', 'cross', 'circle',
	];
	
	var winningCells = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	return {cells, resetBtn, resultWindow, board, winningCells};

})();

// Display Controller Module
const displayController = (() => {

	const resetBoard = () => {

		gameBoard.cells.forEach((value) => {
			value.classList.remove('circle', 'cross'); // Remove tokens from the board.
			gameBoard.board[value.id] = ''; // Replace board array with all empty values.

		});
		
		gameBoard.resultWindow.style.display = "none"; // Hide the results div. 
		
	}

	const placeMarker = ( index, player ) => {
		gameBoard.cells[index].classList.add(player.symbol);
		gameBoard.board.splice(index, 1, player.symbol);
		console.log(gameBoard.board);
	}

	const displayResults = () => {

		gameBoard.resultWindow.style.display = "flex";

	} // Calculate result and show results div.

	gameBoard.resetBtn.addEventListener('click', () => {
		resetBoard();
	}); // Event listener for the reset button.

	return {resetBoard, placeMarker, displayResults};

})();

// Game Logic Module
const gameLogic = (() => {

	var player1 = Player('Brychan', 'circle');
	var player2 = Player('Ai', 'cross');
	var activePlayer = player1;

	gameBoard.cells.forEach((value) => {
		value.addEventListener('click', () => {

			if (activePlayer == player1 && !gameBoard.board[value.id] ) {
				displayController.placeMarker(value.id, player1);
				activePlayer = player2;
			} else if (activePlayer == player2 && !gameBoard.board[value.id] ) {
				displayController.placeMarker(value.id, player2);
				activePlayer = player1;
			} 
			
		}); // Set event listener on each cell.
		
	});


})();

displayController.resetBoard();
