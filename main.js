"use strict";


// Game Board Module
const gameboard = (() => {

	var cells = document.querySelectorAll('.cell');
	cells.forEach(element => element.addEventListener('click', () => {
		console.log(element.id);
		element.style.backgroundImage = "url(/assets/o.png)";
	}));

})();

// Player Factory
const Player = (name, symbol) => {

};