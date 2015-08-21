(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var computerCounter = "";

Array.prototype.filterIndex = function (fun/*, thisArg*/) {
	'use strict';

	if (this === void 0 || this === null) {
		throw new TypeError();
	}

	var t = Object(this);
	var len = t.length >>> 0;
	if (typeof fun !== 'function') {
		throw new TypeError();
	}

	var res = [];
	var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
	for (var i = 0; i < len; i++) {
		if (i in t) {
			var val = t[i];
			if (fun.call(thisArg, val, i, t)) {
				res.push(i);
			}
		}
	}
	return res;
};

function getInverseUser ( playersTurn ) {
	return playersTurn === "Computer" ? "Human" : "Computer";
}

function getInverseCounter ( counter ) {
	return counter === "X" ? "O" : "X";
}

function getAvailableMoves ( currentStateOfBoard ){
	return currentStateOfBoard.filter( function( e, i ) {
			return e !== "X" && e !== "O" ;
	});
}

function found ( counter, position, stateOfBoard ){
	return stateOfBoard[ position ] === counter;
}
function found3InARow ( counter, stateOfBoard ) {
	// this could be improved to use the 'winningPositions' array
	var winningPositions = [ [0,1,2],[0,4,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[3,4,5],[6,7,8]];
	var results = winningPositions.filter( function( element ) {
		return element.every( function( e ){
			return found( counter, e, stateOfBoard );
		},this);
	},this);

	return results.length > 0 ? true : false;
}
function gameOver ( stateOfBoard ) {
	var availMoves = [];
	if( found3InARow( "X", stateOfBoard ) || found3InARow( "O", stateOfBoard ) ) {
		return true;
	}
	else {
		availMoves = getAvailableMoves( stateOfBoard );
		return availMoves.length === 0;
	}
}

function evaluate ( counter, board ) {
	var score = 0;
	// Evaluate score for each of the 8 lines (3 rows, 3 columns, 2 diagonals)
	score += evaluateLine(counter, board, 0, 1, 2);  // row 0
	score += evaluateLine(counter, board, 3, 4, 5);  // row 1
	score += evaluateLine(counter, board, 6, 7, 8);  // row 2
	score += evaluateLine(counter, board, 0, 3, 6);  // col 0
	score += evaluateLine(counter, board, 1, 4, 7);  // col 1
	score += evaluateLine(counter, board, 2, 5, 8);  // col 2
	score += evaluateLine(counter, board, 0, 4, 8);  // diagonal
	score += evaluateLine(counter, board, 2, 4, 6);  // alternate diagonal
	return score;
}

/** The heuristic evaluation function for the given line of 3 cells
	 @Return +100, +10, +1 for 3-, 2-, 1-in-a-line for computer.
					 -100, -10, -1 for 3-, 2-, 1-in-a-line for opponent.
					 0 otherwise */
function evaluateLine ( counter, board, pos1, pos2, pos3 ) {
	var score = 0;

	// First cell
	if (board[ pos1 ] === computerCounter) {
		 score = 1;
	} 
	else if (board[ pos1 ] === getInverseCounter( computerCounter ) ) {
		 score = -1;
	}

	// Second cell
	if (board[ pos2 ] === computerCounter) {
		 if (score === 1) {   // board[ pos1 ] is counter
				score = 10;
		 } 
		 else if (score === -1) {  // board[ pos1 ] is other counter
				return 0;
		 } 
		 else {  // board[ pos1 ] is empty
				score = 1;
		 }
	} 
	else if (board[ pos2 ] === getInverseCounter( computerCounter )) {
		 if (score == -1) { // board[ pos1 ] is opponent counter
				score = -10;
		 } 
		 else if (score === 1) { // board[ pos1 ] is counter
				return 0;
		 } 
		 else {  // board[ pos1 ] is empty
				score = -1;
		 }
	}

	// Third cell
	if (board[ pos3 ] === computerCounter) {
		 if (score > 0) {  // board[ pos1 ] and/or board[ pos2 ] is counter
				score *= 10;
		 } 
		 else if (score < 0) {  // board[ pos1 ] and/or board[ pos2 ] is opponent counter
				return 0;
		 } 
		 else {  // board[ pos1 ] and board[ pos2 ] are empty
				score = 1;
		 }
	} 
	else if (board[ pos3 ] === getInverseCounter( computerCounter ) ) {
		 if (score < 0) {  // board[ pos1 ] and/or board[ pos2 ] is opponent counter
				score *= 10;
		 } 
		 else if (score > 1) {  // board[ pos1 ] and/or board[ pos2 ] is counter
				return 0;
		 } 
		 else {  // board[ pos1 ] and board[ pos2 ] are empty
				score = -1;
		 }
	}
	return score;
}

function getScore( stateOfBoard, depth ) {
	return evaluate( computerCounter, stateOfBoard );
}

function maxOfArray( array ) {
	return Math.max.apply(null, array );
}
function minOfArray( array ) {
	return Math.min.apply(null, array );
}

module.exports = function( stateOfBoard, player, counter ){
	var stateOfBoardAfterMove = stateOfBoard;
	var score, bestScore,  bestMove, maxScoreIndex, minScoreIndex;

	var scores = [], // an array of scores
		moves = [];  // an array of moves

	var availableMoves = getAvailableMoves( stateOfBoard );
	var depth = 0;

	computerCounter = counter;

	availableMoves.forEach( function( aMove, i ) {
		stateOfBoardAfterMove[ aMove ] = counter;
		score=minimax(depth, stateOfBoardAfterMove, getInverseUser( player ), getInverseCounter(counter) );
		stateOfBoardAfterMove[aMove] = aMove;
		scores.push(score);
		moves.push( aMove );
	});
	// Do the min or the max calculation
	if( player === "Computer"){
		//This is the max calculation
		maxScoreIndex = scores.indexOf( maxOfArray( scores ) );
		console.log( "Scores: ", scores );
		console.log( "Moves: ", moves );
		bestMove = moves[maxScoreIndex];
		console.log( "Computer's Best Next Move: ", bestMove );
		return bestMove;
	}
	else {
		//This is the min calculation
		minScoreIndex = scores.indexOf( minOfArray( scores ) );
		bestMove = moves[minScoreIndex];
		return bestMove;
	}
};

function minimax ( depth, stateOfBoard, player, counter ) {
	var stateOfBoardAfterMove = stateOfBoard;
	var score, bestScore;
	var scores = []; // an array of scores
	var availableMoves = getAvailableMoves( stateOfBoard );

	if( gameOver( stateOfBoard, depth ) ) {
		// return 1 if AI wins, 0 if draw, -1 if user wins
		return getScore( stateOfBoard, depth );
	}
	
	++depth;

	//Populate the scores array, recursing as needed
	availableMoves.forEach( function( aMove, i ) {
		stateOfBoardAfterMove[ aMove ] = counter;
		score=minimax(depth, stateOfBoardAfterMove, getInverseUser( player ), getInverseCounter(counter) );
		stateOfBoardAfterMove[aMove] = aMove;
		scores.push(score);
	});
	// Do the min or the max calculation
	if( player === "Computer"){
		//This is the max calculation
		bestScore = maxOfArray( scores );
		return bestScore;
	}
	else {
		//This is the min calculation
		bestScore = minOfArray( scores );
		return bestScore;
	}
}
},{}],2:[function(require,module,exports){
var minimax = require( "./modules/minimax.js" );
// adapt JS Array filter method to return the index instead of the value
Array.prototype.filterIndex = function (fun/*, thisArg*/) {
	'use strict';

	if (this === void 0 || this === null) {
		throw new TypeError();
	}

	var t = Object(this);
	var len = t.length >>> 0;
	if (typeof fun !== 'function') {
		throw new TypeError();
	}

	var res = [];
	var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
	for (var i = 0; i < len; i++) {
		if (i in t) {
			var val = t[i];
			if (fun.call(thisArg, val, i, t)) {
				res.push(i);
			}
		}
	}
	return res;
};

// adapt ES6 Array find method such that it returns the value returned from the callback 
Array.prototype.findValue = function (predicate) {
	if (this === null) {
		throw new TypeError('Array.prototype.findValue called on null or undefined');
	}
	if (typeof predicate !== 'function') {
		throw new TypeError('predicate must be a function');
	}
	var list = Object(this);
	var length = list.length >>> 0;
	var thisArg = arguments[1];
	var value;
	var result;

	for (var i = 0; i < length; i++) {
		value = list[i];
		result = predicate.call(thisArg, value, i, list);
		if ( result !== undefined ) {
			return result;
		}
	}
	return undefined;
};

(function() {

	var Counter = {
		X : "X",
		O : "O"
	};

	var romans = [ "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix" ];

	var gameMode = {
		HVC : "HvC",
		HVH : "HvH",
		CVC : "CvC"
	};
	var playerType = {
		COMPUTER : "Computer",
		HUMAN : "Human",
	};

	var player = {
		PLAYER1 : "player1",
		PLAYER2 : "player2"
	};

	var counter = {
		X : "X",
		O : "O"
	};

	// The computer player MODEL in the MVC
	var computerPlayerModel = {
		computerCounter    : "",
		playerPosition	   : "",

		init : function ( player1, player2 ) {
			if( player1 === playerType.COMPUTER ) {
				this.computerCounter = counter.X;
				this.playerPosition = player.PLAYER1;
			}
			else if( player2 === playerType.COMPUTER ){
				this.computerCounter = counter.O;
				this.playerPosition = player.PLAYER2;	
			}
		},
		isPlayer1 : function () {
			return this.playerPosition === player.PLAYER1;
		},

		validCounter : function ( aCounter ) {
			return aCounter === counter.X || aCounter === counter.O;
		},
		generateComputerMove : function ( board ) {
			return this.validCounter( this.computerCounter ) ? minimax( board, playerType.COMPUTER, this.computerCounter ) : -1;
		},
		
	};

	// The board MODEL in the MVC
	var boardGameModel = {
		player1Type    : "",
		player2Type    : "",
		currentPlayer  : player.PLAYER1, // start with player1
		playCount      : 0,
		board : [ 0, 1, 2, 3, 4, 5, 6, 7, 8],

		winningPositions : [ [0,1,2],[0,4,8],[0,3,6],[1,4,7], [2,5,8],[2,4,6],[3,4,5],[6,7,8] ],

		init: function ( player1, player2 ){
			if( player1 !== undefined ){
				this.player1Type = ( player1 === playerType.COMPUTER )? playerType.COMPUTER : playerType.HUMAN ;
				this.player2Type = ( player2 === playerType.COMPUTER )? playerType.COMPUTER : playerType.HUMAN ;
			}
		},

		resetGame: function() {
			this.player1Type = "";
			this.player2Type = "";
			this.currentPlayer = player.PLAYER1;
			this.playCount = 0;
			this.board = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
		},

		gameMode: function () {
			if( this.player1Type === playerType.HUMAN ) {
				if( this.player2Type === playerType.HUMAN) {
					return gameMode.HVH;
				}
				else if( this.player2Type === playerType.COMPUTER ) {
					return gameMode.HVC;
				}
			}
			else {
				if( this.player2Type === playerType.HUMAN) {
					return gameMode.HVC;
				}
				else if( this.player2Type === playerType.COMPUTER ) {
					return gameMode.CVC;
				}
			}
		},

		isPositionEmpty: function ( position ) {
			return ( this.board[ position ] === counter.X || this.board[ position ] === counter.O ) ? false : true;
		},

		updateBoard: function ( position, counter ) {
			this.board[ position ] = counter;
		},

		incPlayCount: function () {
			return this.playCount++;
		},

		switchCurrentPlayer: function () {
			this.currentPlayer = this.currentPlayer === undefined ? player.PLAYER1 : (this.currentPlayer === player.PLAYER1 ) ? player.PLAYER2 : player.PLAYER1;
			return this.currentPlayer;
		},

		found: function ( counter, position ){
			return this.board[ position ] === counter;
		},

		playMove : function ( position ) {
			this.updateBoard( position, this.getCounter() );
			this.switchCurrentPlayer();
			this.incPlayCount();
			return this;
		},

		getCounter : function (){
			return this.currentPlayer ? (this.currentPlayer === player.PLAYER1 ? counter.X : counter.O) : counter.X;
		},

		found3InARow: function ( counter ) {
			var results = this.winningPositions.filter( function( element ) {
				return element.every( function( e ){
					return this.found( counter, e );
				},this);
			},this);
			if( results.length ) {
				alert( counter + ' has won the game. Start a new game');
				return true;
			}
			return false; 
		},

		isGameOver : function () {
			if( this.playCount < 3) {
				return false;
			}
			if( this.found3InARow( counter.X ) || this.found3InARow( counter.O ) ) {
				return true;
			}
			else if ( this.playCount === 9 ) {
				alert(  "It's a DRAW!! Start a new game");
				return true;
			}
			else {
				return false;
			}
		}			 
	};

	var gameView = {
		
		init: function () {
			$('#play').click( function () {
				var p1 = document.getElementById("player1");
				var player1 = p1.options[p1.selectedIndex].text;
				var p2 = document.getElementById("player2");
				var player2 = p2.options[p2.selectedIndex].text;
				gameController.startGame( player1, player2 );
			});

			$("#reset").click (function () {
				gameController.resetGame();
			});

			$(".field").click (function () {
				gameController.newUserMove( romans.indexOf( $(this).attr('id') ) );
			});

		},

		renderNewGame: function ( player1Type, player2Type ) {
			$("#p1Text").text( "Player1: " + player1Type );
			$("#p2Text").text( "Player2: " + player2Type );
			$("#playerselect").hide();
			$("#stateofplay").show();
		},

		resetGame: function () {
			var p1Text, p2Text, fields;
			this.disableBoard();
			fields = $( ".field" );
			$( ".gameboard" ).find( fields ).text( "-" );
			p1Text = "Player1: ";
			p2Text = "Player2: ";
			$("#p1Text").text( p1Text );
			$("#p2Text").text( p2Text );
			$("#stateofplay").hide();
			$("#playerselect").show();
		},

		enableBoard : function () {
			this.setDisable( false );
		},

		disableBoard : function () {
			this.setDisable( true );
		},
		setDisable: function ( toggle ) {
			var fields = $( ".field" );
			$( ".gameboard" ).find( fields ).prop( 'disabled', toggle );
		},

		updateBoard: function( counter, position ) {
			var field = $( "#" + romans[ position ] );
			$( ".gameboard" ).find( field ).text( counter );
		}
	};

	var gameController = {

		init: function () {
			gameView.init();
		},

		startGame : function ( player1, player2) {
			boardGameModel.init( player1, player2 );
			computerPlayerModel.init( player1, player2 );
			gameView.renderNewGame( player1, player2 );
			computerPlayerModel.isPlayer1() ? this.computerGame() : gameView.enableBoard();
		},

		resetGame : function () {
			boardGameModel.resetGame();
			gameView.resetGame();
		},

		playMove : function ( position ) {
			var self = this;
			gameView.updateBoard( boardGameModel.getCounter(), position );
			return boardGameModel.playMove( position );
		},

		computerGame : function () {
			var self = this;
			setTimeout( function() { 
				if( self.playComputerMove().isGameOver() ) {
					self.gameOver();
				}
				else if( boardGameModel.gameMode() === gameMode.CVC ){
					self.computerGame();
				}
				else {
					gameView.enableBoard();
				}
			}, 1000 ); 
		},

		playComputerMove : function () {
			return this.playMove( computerPlayerModel.generateComputerMove( boardGameModel.board ) );	
		},

		gameOver : function () {
			gameView.resetGame();
			boardGameModel.resetGame();
		},

		newUserMove : function ( position ) {
			var computersNextMove = -1;
			var mode, result;
			if( boardGameModel.isPositionEmpty( position ) ) {
				if( this.playMove( position ).isGameOver() ) {
					this.gameOver();
				}
				else if( boardGameModel.gameMode() === gameMode.HVC ){
					gameView.disableBoard();
					this.computerGame();
				}
			}
		}
	};
	// this is needed for Qunit testing
	window.boardGameModel = boardGameModel;
	window.gameView = gameView;
	window.gameController = gameController;
	// window.computerPlayerModel = computerPlayerModel;
	gameController.init();
})();

window.minimax = minimax;

},{"./modules/minimax.js":1}]},{},[2]);
