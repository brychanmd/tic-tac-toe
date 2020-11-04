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
	
	var container = document.querySelector('.board');
	var cells = document.querySelectorAll('.cell');
	var resetBtn = document.querySelector('#reset');
	var replayBtn = document.querySelector('#replay');
	var resultWindow = document.querySelector('#overlay');

	var board = [
		'', '', '', 
		'', '', '', 
		'', '', '',
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

	return {container, cells, resetBtn, replayBtn, resultWindow, board, winningCells};

})();

// Display Controller Module
const displayController = (() => {

	const resetBoard = () => {

		gameBoard.cells.forEach((value) => {
			value.classList.remove('circle', 'cross'); // Remove tokens from the board.
			gameBoard.board[value.id] = ''; // Replace board array with all empty values.
			gameBoard.container.classList.remove('disabled');

		});

		gameBoard.resultWindow.style.display = "none"; // Hide the results div. 
	}

	const placeMarker = ( index, player ) => {

		gameBoard.cells[index].classList.add(player.symbol);
		gameBoard.board.splice(index, 1, player.symbol);
		
		player.cells.push( parseInt(index) );
		player.cells.sort();	
	}

	const displayResults = ( roundWinner ) => {

		// Add logic to display round winner on the front end. 
		gameBoard.container.classList.remove('disabled');
		gameBoard.resultWindow.innerHTML = `
		<div id="result">
				<p>${roundWinner.name} Wins this round!</p>
				<p>${gameLogic.player1.name}: ${gameLogic.player1.wins} wins</p>
				<p>${gameLogic.player2.name}: ${gameLogic.player2.wins} wins</p>
				<button type="reset">Replay?</button>
		</div>
		`;
		gameBoard.resultWindow.style.display = "block";
		

	} // Calculate result and show results div.

	return { resetBoard, placeMarker, displayResults};

})();

// Game Logic Module
const gameLogic = (() => {

	var player1 = Player('Brychan', 'cross');
	var player2 = Player('Ai', 'circle');
	var activePlayer = player1;
	var startingPlayer = player1;

	gameBoard.cells.forEach((value) => {
		value.addEventListener('click', () => {

			if (activePlayer == player1 && !gameBoard.board[value.id] ) {
				displayController.placeMarker(value.id, player1);
				checkResults(player1);
				activePlayer = player2;
			} else if (activePlayer == player2 && !gameBoard.board[value.id] ) {
				displayController.placeMarker(value.id, player2);
				checkResults(player2);
				activePlayer = player1;
			} 
			
		}); // Set event listener on each cell.
		
	});

	// Check Results
	// check if current player has winning combination.
	// check if all spots are taken with no winner.

	const checkResults = ( currentPlayer ) => {
		
		let check = gameBoard.winningCells.some( wc => { 
			return wc.every( val => currentPlayer.cells.includes(val));
		} );

		if (check) {
			currentPlayer.wins++;
			displayController.displayResults( currentPlayer );
		}

	}

	const resetGame = () => {
		player1.cells = [];
		player2.cells = [];
		displayController.resetBoard();
	}

	gameBoard.resetBtn.addEventListener('click', () => {
		resetGame();
	}); // Event listener for the reset button.
	gameBoard.replayBtn.addEventListener('click', () => {
		resetGame();
	}); // Event listener for the reset button.

	return {player1, player2};
})();


