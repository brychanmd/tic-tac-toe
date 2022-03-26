"use strict";

// Player Factory
const Player = (name, symbol) => {
	var name = name;
	var symbol = symbol;
	var wins = 0;

	return {name, symbol, wins};
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

	return {container, cells, resetBtn, replayBtn, resultWindow, board };

})();

// Display Controller Module
const displayController = (() => {

	var bleep = new Audio('./assets/click.mp3');

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
		bleep.currentTime = 0
		bleep.play();
		
		player.cells.push( parseInt(index) );
		player.cells.sort();

        // Also remove event listener?
	}

	const displayResults = ( roundWinner ) => {

		// Add logic to display round winner on the front end. 
		gameBoard.container.classList.add('disabled');
		document.getElementById('result').innerHTML = `
				<p>${ roundWinner ? roundWinner.name +  ' Wins!' : 'It\'s a tie!' }</p>
				<p>${gameLogic.player1.name}: ${gameLogic.player1.wins} wins</p>
				<p>${gameLogic.player2.name}: ${gameLogic.player2.wins} wins</p>
		`;
		gameBoard.resultWindow.style.display = "block";
		

	} // Calculate result and show results div.

	return { resetBoard, placeMarker, displayResults};

})();

// Game Logic Module
const gameLogic = (() => {

	var onePlayerMode = false;
	var player1 = Player('Player 1', 'cross');
	var player2 = Player('Player 2', 'circle');
	
	var startingPlayer = player1;
	var activePlayer = startingPlayer;
	let moves = 0;

    const winningCells = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

    const setupGame = ( mode, p1name, p2name ) => {
        if ( '1player' === mode ) {
            onePlayerMode = true
            player1.name = p1name;
            player2.name = p2name;
        } else {
            onePlayerMode = false;
            player1.name = p1name;
            player2.name = 'AI';
        }
        startGame();
    }

    const startGame = () => {

        gameBoard.container.style.display = 'flex';        

        if ( onePlayerMode ) {

            if ( startingPlayer === player2 ) {
                aiMove();
            }

            gameBoard.cells.forEach((value) => {
                value.addEventListener('click', () => {
        
                    playerMove( value.id );
                    
                }); // Set event listener on each cell.
                
            });

        } else if ( !onePlayerMode ) {

            gameBoard.cells.forEach((value) => {
                value.addEventListener('click', () => {
        
                    playerMove( value.id );
                    
                }); // Set event listener on each cell.
                
            });

        }
    }

    const playerMove = ( cell ) => {

        // Place Marker.
        displayController.placeMarker(cell, activePlayer);

        // Check results after current move.
        if ( checkResults( gameBoard.board, activePlayer ) ) {
            // Winner!
            displayController.displayResults( activePlayer );
       } else if (9 >= moves) {
            // Draw :/
            displayController.displayResults( null )
       } else {
            // Switch active player and move on..
            moves++;
            activePlayer == player1 ? activePlayer = player2 : activePlayer = player1;
            onePlayerMode ? aiMove() : ''; // Trigger AI move if it's single player mode.
       }
    }

    const aiMove = () => {
        
        // Find best move, make move.
        let bestMove = findBestMove( gameBoard.board, player2, 0 );
        displayController.placeMarker( bestMove, player2 );

        // Check results after move.
        if ( checkResults( gameBoard.board, player2 ) ) {
            // Winner!
            displayController.displayResults( player2 );
        } else if (9 >= moves) {
            // Draw :/
            displayController.displayResults( null )
        } else {
            // Move on..
            moves++;
            activePlayer = player1;
        }
    }

    // Uses the minimax algorithm to find the best move.
    const findBestMove = ( gameBoard, player, depth ) => {
        

        let currentBoardState = [...gameBoard];

        

        
    }

	const checkResults = ( boardstate, currentPlayer ) => {
		
        let check = winningCells.some( wc => { 
            return wc.every( val => boardstate[val] === currentPlayer.symbol );
		} );

        return check;

	}

	const resetGame = () => {
        moves = 0;
		player1.cells = [];
		player2.cells = [];
		displayController.resetBoard();
		activePlayer = startingPlayer;
	}

	gameBoard.resetBtn.addEventListener('click', () => {
		resetGame();
	}); // Event listener for the reset button.
	gameBoard.replayBtn.addEventListener('click', () => {
		startingPlayer === player1 ? startingPlayer = player2 : startingPlayer = player1; //  Take turns starting new game.
		resetGame();
	}); // Event listener for the reset button.

	return { setupGame, player1, player2};
})();

// Game Menu Module
const gameMenu = (() => {

	const container = document.querySelector('#menu');
    const radios = container.querySelectorAll('input[name="mode"]');
    const p1Wrapper = container.querySelector('#p1-wrapper');
    const p2Wrapper = container.querySelector('#p2-wrapper');
    const submitBtn = container.querySelector('input[type="submit"]');
    
    let mode = '1player';
    let name1;
    let name2;

    const toggleP2wrapper = ( mode ) => { 
        mode === '1player' ? p2Wrapper.style.display = 'none' : p2Wrapper.style.display = 'block';
    }

    radios.forEach(radio => {
        radio.addEventListener('click', function () {
            mode = radio.value;
            toggleP2wrapper( mode );
        });
    });

    toggleP2wrapper( mode );

    submitBtn.addEventListener('click', function ( event ) {
        event.preventDefault();

        p1Wrapper.querySelector('input').value ? name1 = p1Wrapper.querySelector('input').value : name1 = 'Player 1';
        p1Wrapper.querySelector('input').value ? name2 = p2Wrapper.querySelector('input').value : name2 = 'Player 2';

        container.style.display = 'none';
        
        gameLogic.setupGame( mode, name1, name2 );

    });


})();

// listen for submit button

// start game
