(function() { // We are using an immediately invoked function expression to avoid global variables.

// DOM constants
const startScreen = document.getElementById('start');
const boardScreen = document.getElementById('board');
const finishScreen = document.getElementById('finish');
const startBtn = document.getElementById('start-button');
const newGameBtn = document.getElementById('new-game-button');

const oPLayer = document.getElementById('player1');
const xPLayer = document.getElementById('player2');

const gameBoard = document.getElementById('game-board');
const messageP = document.getElementsByClassName('message')[0];
// Main game object / singelton
// player 1 is O
// player 2 is X
var ticTacToe = {
	board: [ // The board can use three different numbers: 0 menas empty, 1 menas player one and 2 menas player two
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	],
	player: 1,
	reset: function() {
		this.player = 1;
		this.board = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		];
	},
	isEmptySquare: function(row, column) {
		return (this.board[row][column] === 0);
	},
	makeMove: function(row, column) {
		if (this.isEmptySquare(row, column)) {
			this.board[row][column] = this.player;
		}
	},
	changePLayer: function () {
		const newPLayer = (this.player === 1) ? 2 : 1;
		this.player = newPLayer;
		return newPLayer;
	},
	checkForWinner: function() {
		// Check for horizontal winner
		for( let i = 0; i < 3; i += 1 ) {
			if ( (this.board[i][0] === this.player) && (this.board[i][1] === this.player) && (this.board[i][2] === this.player) ) {
				return true;
			}
		}

		// check fo vertical winner
		for( let i = 0; i < 3; i += 1 ) {
			if ( (this.board[0][i] === this.player) && (this.board[1][i] === this.player) && (this.board[2][i] === this.player) ) {
				return true;
			}
		}

		// Check for diagonal winner
		const topLeft = this.board[0][0] === this.player;
		const topRight = this.board[0][2] === this.player;
		const bottomLeft = this.board[2][0] === this.player;
		const bottomRight = this.board[2][2] === this.player;
		const middle = this.board[1][1] === this.player;
		if ( (topLeft) && (middle) && (bottomRight) ) {
			return true
		}
		if ( (topRight) && (middle) && (bottomLeft) ) {
			return true;
		}
	},
	checkForTie: function() {
		console.log(this.board);
		for (let i = 0; i < this.board.length; i += 1) {
			for (let j = 0; j < this.board[i].length; j += 1) {
				if (this.board[i][j] === 0) {
					return false;
				}
			}
		}
		return true;
	}
}

// Helper cuntions
function changeScreen(from, to) {
	from.style.display = 'none';
	to.style.display = ''; // empty string means, set back to defaul
}

function attachClassName(el, name) {
	el.setAttribute('class', el.getAttribute('class') + ' ' + name);
}

function removeClassName(el, name) {
	let old = el.getAttribute('class');
	old = old.split(' ');
	const newArray = old.filter((className) => {
		return className !== name;
	});

	el.setAttribute('class', newArray.join());
}

function toogleActive(player) {
	const active = 'active';
	if (player === 1) {
		removeClassName(xPLayer, active);
		attachClassName(oPLayer, active);
	}

	if (player === 2) {
		removeClassName(oPLayer, active);
		attachClassName(xPLayer, active);
	}
}

function resetInterface() {
	const lis = gameBoard.children
	const len = lis.length;
	for (let i = 0;  i < len; i += 1) {
		lis[i].setAttribute('class', 'box');
	}
}

function endGame(message) {
	changeScreen(boardScreen, finishScreen);
	messageP.textContent = message;
	ticTacToe.reset();
	resetInterface();
}

startBtn.addEventListener('click', function (evt) {
	evt.preventDefault(); // prevent the link from refreshing the page

	changeScreen(startScreen, boardScreen);
	attachClassName(oPLayer, 'active');
}, false);

newGameBtn.addEventListener('click', function() {
	ticTacToe.reset();
	changeScreen(finishScreen, boardScreen);
}, false);

let lastHoverSquare;
gameBoard.addEventListener('mouseover', function (evt) {
	if ( lastHoverSquare ) {lastHoverSquare.style.backgroundImage = '';}
	
	const row = parseInt(evt.target.getAttribute('data-row'));
	const column = parseInt(evt.target.getAttribute('data-column'));
	if (ticTacToe.isEmptySquare(row, column)) {
		if (ticTacToe.player === 1) {
			evt.target.style.backgroundImage = 'url(img/o.svg)';
		} else {
			evt.target.style.backgroundImage = 'url(img/x.svg)';
		}
	}
	lastHoverSquare = evt.target;
}, false);

gameBoard.addEventListener('click', function (evt) {

	const row = parseInt(evt.target.getAttribute('data-row'));
	const column = parseInt(evt.target.getAttribute('data-column'));

	if (ticTacToe.isEmptySquare(row, column)) {
		
		// Update the UI
		switch (ticTacToe.player) {
			case 1: attachClassName(evt.target, 'box-filled-1'); break;
			case 2: attachClassName(evt.target, 'box-filled-2'); break;
		}
		
		// Make a move and switch player
		ticTacToe.makeMove(row, column);
		
		if ( ticTacToe.checkForWinner() ) {
			
			if (ticTacToe.player === 1) { attachClassName(finishScreen, 'screen-win-one'); }
			if (ticTacToe.player === 2) { attachClassName(finishScreen, 'screen-win-two'); }
			endGame('Winner');

		} else if (ticTacToe.checkForTie()) {
			attachClassName(finishScreen, 'screen-win-tie');
			endGame("It's a Tie!");
		} else {
			toogleActive(ticTacToe.changePLayer());
		}
	}

}, false);

}());