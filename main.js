"use strict";

const gameboard = (() => {

// Players

const Player = (name, symbol) => {

};

// Game Board

var cells = document.querySelectorAll('.cell');
cells.forEach(element => element.addEventListener('click', () => {
	console.log(element.id);
	element.style()
}));



})();