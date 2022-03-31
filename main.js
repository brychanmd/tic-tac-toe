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

    // For use by the minimax function.
    var nodesMap = new Map();
    var maxDepth = -1;

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
            player2.name = 'AI';
        } else {
            onePlayerMode = false;
            player1.name = p1name;
            player2.name = p2name;
        }
        gameBoard.cells.forEach((value) => {
            value.addEventListener('click', () => {
    
                playerMove( value.id );
                
            }); // Set event listener on each cell.
            
        });
        startGame();
    }

    const startGame = () => {

        gameBoard.container.style.display = 'flex';

        if ( onePlayerMode ) {

            if ( startingPlayer === player2 ) {
                aiMove();
            }

        }
    }

    const playerMove = ( cell ) => {

        // Place Marker.
        displayController.placeMarker(cell, activePlayer);

        let result = checkResults( gameBoard.board );

        // Check results after current move.
        if ( activePlayer.symbol === result ) {
            // Winner!
            activePlayer.wins++;
            displayController.displayResults( activePlayer );
       } else if ( 'draw' === result ) {
            // Draw :/
            displayController.displayResults( null )
       } else {
           // Switch active player and move on..
           activePlayer == player1 ? activePlayer = player2 : activePlayer = player1;
            if ( onePlayerMode ) {
                setTimeout(() => {
                    aiMove(); // Trigger AI move if it's single player mode.
                }, 500);
            }
       }
    }

    const aiMove = () => {
        
        // Find best move, make move.
        let bestMove = findBestMove( gameBoard.board );
        displayController.placeMarker( bestMove, player2 );

        let result = checkResults( gameBoard.board );

        // Check results after move.
        if ( player2.symbol === result ) {
            // Winner!
            player2.wins++;
            displayController.displayResults( player2 );
        } else if ( 'draw' === result ) {
            // Draw :/
            displayController.displayResults( null )
        } else {
            // Move on..
            activePlayer = player1;
        }
    }

    // Uses the minimax algorithm to find the best move.
    const findBestMove = ( gameBoard ) => {
        return miniMax(gameBoard);
    }

    const miniMax = (
        gameBoard,
        maximising = true, 
        callback = () => {},
        depth = 0, 
    ) => {
        

        // Clear nodesMap if the function is called for a new move
        if(depth == 0) nodesMap.clear();

        // If the board state is a terminal one, return the heuristic value
        if ( checkResults( gameBoard ) || depth === maxDepth ) {
            if( checkResults( gameBoard ) === 'circle') {
                return 100 - depth;
            } else if ( checkResults( gameBoard ) === 'cross') {
                return -100 + depth;
            }
            return 0;
        }

        if ( maximising ) {
            let best = -100;
            let availableMoves = [];
            gameBoard.forEach( (val, index) => val === '' ? availableMoves.push(index) : '');
            availableMoves.forEach( index => {
                
                // Initialize new board with copy of current state.
                const child = [...gameBoard];
                // Create a child node by inserting the maximizing symbol 'circle' into the current empty cell
                child[index] = 'circle';
                //Recursively calling miniMax this time with the new board and minimizing turn and incrementing the depth
                const nodeValue = miniMax(child, false, callback, depth + 1);
                //Updating best value
                best = Math.max(best, nodeValue);
                
                //If it's the main function call, not a recursive one, map each heuristic value with it's moves indices
                if ( depth == 0 ) {
                    // Comma separated indices if multiple moves have the same heuristic value
                    const moves = nodesMap.has(nodeValue)
                        ? `${nodesMap.get(nodeValue)},${index}`
                        : index;
                    nodesMap.set(nodeValue, moves);
                }

            });
            
            //If it's the main call, return the index of the best move or a random index if multiple indices have the same value
            if ( depth == 0 ) {
                if (typeof nodesMap.get(best) == "string") {
                    const arr = nodesMap.get(best).split(",");
                    const rand = Math.floor(Math.random() * arr.length);
                    var myret = arr[rand];
                } else {
                    var myret = nodesMap.get(best);
                }
                //run a callback after calculation and return the index
                callback( myret );
                return myret;
            }
            //If not main call (recursive) return the heuristic value for next calculation
            return best;

        }

        if ( ! maximising ) {
            let best = 100;
            let availableMoves = [];
            gameBoard.forEach( (val, index) => val === '' ? availableMoves.push(index) : '');
            availableMoves.forEach( index => {
                
                // Initialize new board with copy of current state.
                const child = [...gameBoard];
                // Create a child node by inserting the maximizing symbol 'cross' into the current empty cell
                child[index] = 'cross';
                //Recursively calling miniMax this time with the new board and minimizing turn and incrementing the depth
                const nodeValue = miniMax(child, true, callback, depth + 1);
                //Updating best value
                best = Math.min(best, nodeValue);
                
                //If it's the main function call, not a recursive one, map each heuristic value with it's moves indices
                if ( depth == 0 ) {
                    // Comma separated indices if multiple moves have the same heuristic value
                    const moves = nodesMap.has(nodeValue)
                        ? `${nodesMap.get(nodeValue)},${index}`
                        : index;
                    nodesMap.set(nodeValue, moves);
                }

            });
            
            //If it's the main call, return the index of the best move or a random index if multiple indices have the same value
            if ( depth == 0 ) {
                if ( typeof nodesMap.get(best) == "string" ) {
                    const arr = nodesMap.get(best).split(",");
                    const rand = Math.floor( Math.random() * arr.length );
                    var myret = arr[rand];
                } else {
                    var myret = nodesMap.get(best);
                }
                //run a callback after calculation and return the index
                callback( myret );
                return myret;
            }
            //If not main call (recursive) return the heuristic value for next calculation
            return best;

        }

    }

	const checkResults = ( boardstate ) => {
		
        // X wins.
        let checkCross = winningCells.some( wc => { 
            return wc.every( val => boardstate[val] === 'cross' );
		} );
        if ( checkCross ) return 'cross';

        // O wins.
        let checkCircle = winningCells.some( wc => { 
            return wc.every( val => boardstate[val] === 'circle' );
		} );
        if ( checkCircle ) return 'circle';

        // It's a tie.
        let drawCheck = boardstate.every( val => val !== '' );
        if ( drawCheck ) return 'draw';

        // Game is not in a terminal state.
        return null;

	}

	const resetGame = () => {
        startingPlayer == player1 ? startingPlayer = player2 : startingPlayer = player1; //  Take turns starting new game.
		displayController.resetBoard();
		activePlayer = startingPlayer;
        startGame();

	}

	gameBoard.resetBtn.addEventListener('click', () => {
		resetGame();
	}); // Event listener for the reset button.
	gameBoard.replayBtn.addEventListener('click', () => {
		resetGame();
	}); // Event listener for the reset button.

	return { setupGame, player1, player2};
})();

// Game Menu Module
const gameMenu = (() => {

	const container = document.querySelector('#menu');
    const radios = container.querySelectorAll('input[name="mode"]');
    const submitBtn = container.querySelector('input[type="submit"]');

    const p2elems = container.querySelectorAll('.user2');
    
    let mode = '1player';
    let name1;
    let name2;

    const toggleP2wrapper = ( mode ) => { 
        p2elems.forEach( elem => {
            mode === '1player' ? elem.style.display = 'none' : elem.style.display = 'block';
        } );
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

        container.querySelector('#player-1').value ? name1 = container.querySelector('#player-1').value : name1 = 'Player 1';
        container.querySelector('#player-2').value ? name2 = container.querySelector('#player-2').value : name2 = 'Player 2';

        container.style.display = 'none';
        
        gameLogic.setupGame( mode, name1, name2 );

    });


})();

// listen for submit button

// start game
