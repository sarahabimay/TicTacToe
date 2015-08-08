(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

function pointsWon ( playersTurn ) {
	return playersTurn === "Computer" ? 1 : -1;
}

function getAvailableMoves ( currentStateOfBoard ){
	return currentStateOfBoard.filter( function( e, i ) {
			return e !== "X" && e !== "O" ;
	});
}

function findPlayerPositions ( counter, board ) {
	return board.filterIndex( function( element, index ) {
		return element === counter;
	});
}
function found ( counter, position, stateOfBoard ){
	return stateOfBoard[ position ] === counter;
}
function found3InARow ( counter, stateOfBoard ) {
	// this could be improved to use the 'winningPositions' array
	var winningPositions = [ [0,1,2],[0,4,8],[0,3,6],[1,4,7], 
							[2,5,8],[2,4,6],[3,4,5],[6,7,8]];
	var results = winningPositions.filter( function( element ) {
		return element.every( function( e ){
			return found( counter, e, stateOfBoard );
		},this);
	},this);

	if( results.length ) {
		if( counter === "O"){
			console.log( "O win");
		}
		console.log( "!!!!!!!!!! ", counter, " IS THE WINNER!!!!!!!!!!!!");
		return true;
	}
	return false; 
}
function gameOver ( stateOfBoard ) {
	
	if( found3InARow( "X", stateOfBoard ) || found3InARow( "O", stateOfBoard ) ) {
		return true;
	}
	else {
			var availMoves = getAvailableMoves( stateOfBoard );
		 // console.log( "In gameOver: AvailableMoves: ", availMoves );
			return availMoves.length === 0;
	}
}

// function evaluate ( counter, board ) {
// 	var score = 0;
// 	// Evaluate score for each of the 8 lines (3 rows, 3 columns, 2 diagonals)
// 	score += evaluateLine(counter, board, 0, 1, 2);  // row 0
// 	score += evaluateLine(counter, board, 3, 4, 5);  // row 1
// 	score += evaluateLine(counter, board, 6, 7, 8);  // row 2
// 	score += evaluateLine(counter, board, 0, 3, 6);  // col 0
// 	score += evaluateLine(counter, board, 1, 4, 7);  // col 1
// 	score += evaluateLine(counter, board, 2, 5, 8);  // col 2
// 	score += evaluateLine(counter, board, 0, 4, 8);  // diagonal
// 	score += evaluateLine(counter, board, 2, 4, 6);  // alternate diagonal
// 	return score;
// }

// /** The heuristic evaluation function for the given line of 3 cells
// 	 @Return +100, +10, +1 for 3-, 2-, 1-in-a-line for computer.
// 					 -100, -10, -1 for 3-, 2-, 1-in-a-line for opponent.
// 					 0 otherwise */
// function evaluateLine ( computerCounter, board, pos1, pos2, pos3 ) {
// 	var score = 0;

// 	// First cell
// 	if (board[ pos1 ] === computerCounter) {
// 		 score = 1;
// 	} 
// 	else if (board[ pos1 ] === getInverseCounter( computerCounter ) ) {
// 		 score = -1;
// 	}

// 	// Second cell
// 	if (board[ pos2 ] === computerCounter) {
// 		 if (score === 1) {   // board[ pos1 ] is counter
// 				score = 10;
// 		 } 
// 		 else if (score === -1) {  // board[ pos1 ] is other counter
// 				return 0;
// 		 } 
// 		 else {  // board[ pos1 ] is empty
// 				score = 1;
// 		 }
// 	} 
// 	else if (board[ pos2 ] === getInverseCounter( computerCounter )) {
// 		 if (score == -1) { // board[ pos1 ] is opponent counter
// 				score = -10;
// 		 } 
// 		 else if (score === 1) { // board[ pos1 ] is counter
// 				return 0;
// 		 } 
// 		 else {  // board[ pos1 ] is empty
// 				score = -1;
// 		 }
// 	}

// 	// Third cell
// 	if (board[ pos3 ] === computerCounter) {
// 		 if (score > 0) {  // board[ pos1 ] and/or board[ pos2 ] is counter
// 				score *= 10;
// 		 } 
// 		 else if (score < 0) {  // board[ pos1 ] and/or board[ pos2 ] is opponent counter
// 				return 0;
// 		 } 
// 		 else {  // board[ pos1 ] and board[ pos2 ] are empty
// 				score = 1;
// 		 }
// 	} 
// 	else if (board[ pos3 ] === getInverseCounter( computerCounter ) ) {
// 		 if (score < 0) {  // board[ pos1 ] and/or board[ pos2 ] is opponent counter
// 				score *= 10;
// 		 } 
// 		 else if (score > 1) {  // board[ pos1 ] and/or board[ pos2 ] is counter
// 				return 0;
// 		 } 
// 		 else {  // board[ pos1 ] and board[ pos2 ] are empty
// 				score = -1;
// 		 }
// 	}
// 	return score;
// }



function getScore( stateOfBoard ) {
	if( found3InARow( computerCounter, stateOfBoard ) ) {
		return 10;
	}
	else if( found3InARow( getInverseCounter( computerCounter ), stateOfBoard ) ) {
		return -10;
	}
	else {
		return 0;
	}
}
// function getFutureScoreOfMove (stateOfBoard, depth, playersTurn, counter) {
// 	var stateOfBoardAfterMove = stateOfBoard;
// 	var availableMoves = getAvailableMoves( stateOfBoard );
// 	var countOfMoves = availableMoves.length;
// 	var score, currentBestScore, currentBestMove;
// 	var movesTried = [];
// 	if( gameOver( stateOfBoard ) ) {
// 		// return 1 if AI wins, 0 if draw, -1 if user wins
// 		return evaluate( counter, stateOfBoard );
// 		// return evaluate( ( playersTurn === "Computer" ? playersCounter : getInverseCounter( playersCounter ) ), stateOfBoard );
// 	}
	
// 	if( playersTurn==="Computer") {
// 		currentBestScore= -100000; //this is the worst case for AI
// 	}
// 	else{
// 		currentBestScore= +100000; //this is the worst case for Player
// 	}
	
// 	availableMoves.forEach( function( aMove, i ) {
// 		console.log( "Board at Depth: ", depth, " : ", counter );
// 		console.log( stateOfBoard );
	 
// 		if( aMove === "X" || aMove === "O" || movesTried.indexOf( aMove ) >=0 ){
// 			// if( stateOfBoard[i] === "X" || stateOfBoard[i] === "O") {
// 			// these aren't legal as they are already taken so skip
// 			return false;
// 		 }
// 		// record when we have tried a move so we don't try it again later
// 		movesTried.push( aMove );
// 		stateOfBoardAfterMove[ aMove ] = counter;
// 		console.log( "Board after move: ", counter );
// 		console.log( stateOfBoardAfterMove );
// 		score=getFutureScoreOfMove(stateOfBoardAfterMove , depth+1, getInverseUser( playersTurn ), getInverseCounter(counter) );
// 		if(playersTurn === "Computer" && score>currentBestScore) { //AI wants positive score
// 			currentBestScore=score;
// 			currentBestMove = aMove;
// 		}
// 		if( playersTurn === "Human" && score<currentBestScore) { //user wants          negative score
// 			currentBestScore=score;
// 			currentBestMove = aMove;
// 		}
// 		// remove counter from stateOfBoardAFterMove as we will try a different move if there are any available
// 		stateOfBoardAfterMove[aMove] = aMove;
// 	});
	
// 	console.log( "Best Score at Depth: ", depth, " ; CurrentBestMove: ", currentBestMove, "; CurrentBestScore: ", currentBestScore );
// 	console.log( "************************************************");
// 	return currentBestScore;
// }
function maxOfArray( array ) {
	return Math.max.apply(null, array );
}
function minOfArray( array ) {
	return Math.min.apply(null, array );
}
var computerCounter = "";

module.exports = function( stateOfBoard, player, counter ){
	var stateOfBoardAfterMove = stateOfBoard;
	var score, bestScore,  bestMove, maxScoreIndex, minScoreIndex;

	var scores = [], // an array of scores
		moves = [];  // an array of moves

	var availableMoves = getAvailableMoves( stateOfBoard );

	computerCounter = counter;

	availableMoves.forEach( function( aMove, i ) {
		stateOfBoardAfterMove[ aMove ] = counter;
		score=/*exports.*/minimax(stateOfBoardAfterMove, getInverseUser( player ), getInverseCounter(counter) );
		stateOfBoardAfterMove[aMove] = aMove;
		scores.push(score);
		moves.push( aMove );
	});
	// Do the min or the max calculation
	if( player === "Computer"){
		//This is the max calculation
		bestScore = maxOfArray( scores );
		maxScoreIndex = scores.indexOf( bestScore );
		bestMove = moves[maxScoreIndex];
		return bestMove;
	}
	else {
		//This is the min calculation
		bestScore = minOfArray( scores );
		minScoreIndex = scores.indexOf( bestScore );
		bestMove = moves[minScoreIndex];
		return bestMove;
	}
};
function minimax ( stateOfBoard, player, counter ) {
// exports.minimax = function ( stateOfBoard, player, counter ) {
	var stateOfBoardAfterMove = stateOfBoard;
	var availableMoves = getAvailableMoves( stateOfBoard );
	var countOfMoves = availableMoves.length;
	var score, bestScore,  bestMove, maxScoreIndex, minScoreIndex;
	var scores = [], // an array of scores
		moves = [];  // an array of moves
	if( gameOver( stateOfBoard ) ) {
		// return 1 if AI wins, 0 if draw, -1 if user wins
		return getScore( stateOfBoard );
		// return evaluate( counter, stateOfBoard );
	}

	//Populate the scores array, recursing as needed
	availableMoves.forEach( function( aMove, i ) {
		stateOfBoardAfterMove[ aMove ] = counter;
		score=/*exports.*/minimax(stateOfBoardAfterMove, getInverseUser( player ), getInverseCounter(counter) );
		stateOfBoardAfterMove[aMove] = aMove;
		scores.push(score);
		moves.push( aMove );
	});
	// Do the min or the max calculation
	if( player === "Computer"){
		//This is the max calculation
		bestScore = maxOfArray( scores );
		// maxScoreIndex = scores.indexOf( bestScore );
		// bestMove = moves[maxScoreIndex];
		return bestScore;
	}
	else {
		//This is the min calculation
		bestScore = minOfArray( scores );
		// minScoreIndex = scores.indexOf( bestScore );
		// bestMove = moves[minScoreIndex];
		return bestScore;
	}
}

// module.exports = function (currentStateOfBoard, computerPlayer, computerCounter ) {
// 	var currentBestMove= null;
// 	var score = null;
// 	var currentBestScore= -100000;
// 	var stateOfBoardAfterMove = currentStateOfBoard;
// 	var availableMoves = getAvailableMoves( currentStateOfBoard );
// 	availableMoves.forEach( function( aMove, i ) {

// 		if( availableMoves[i] === "X" || availableMoves[i] === "O")         {
// 				// these aren't legal as they are already taken so skip
// 				return false;
// 		}
// 		console.log( "NEXT OPENING MOVE FOR COMPUTER: ", aMove );
// 		stateOfBoardAfterMove[ aMove ] = computerCounter;
// 		// console.log( "Board after move: ", computerPlayer );
// 		// console.log( stateOfBoardAfterMove );
// 		score=getFutureScoreOfMove(stateOfBoardAfterMove , 1/*depth*/,"Human", getInverseCounter( computerCounter ));
		
// 		if( score>=currentBestScore) {
// 			console.log( "Current Best Score at Depth: 0 : ", score );
// 			console.log( "lastMove: ", aMove );
// 			console.log( "currentBestScore: ", currentBestScore );
// 			currentBestMove=aMove;
// 			currentBestScore=score;
// 		}
// 		stateOfBoardAfterMove[aMove] = aMove;
// 	});
// 	console.log( "OVERALL NEXT BEST MOVE FOR THE COMPUTER: ", currentBestMove );
// 	return currentBestMove;
// };


// };
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

$(function() {

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
		player1Type    : "",
		currentPlayer  : player.PLAYER1, // start with player1
		
	};
	// The board MODEL in the MVC
	var boardGameModel = {
		player1Type    : "",
		player2Type    : "",
		currentPlayer  : player.PLAYER1, // start with player1
		playCount      : 0,
		board : [ 0, 1, 2, 3, 4, 5, 6, 7, 8],

		winningPositions : [ [0,1,2],[0,4,8],[0,3,6],[1,4,7], 
													[2,5,8],[2,4,6],[3,4,5],[6,7,8]],

		init: function ( player1, player2 ){
			player1Type = ( player1 === playerType.COMPUTER )? playerType.COMPUTER : playerType.HUMAN ;
			player2Type = ( player2 === playerType.COMPUTER )? playerType.COMPUTER : playerType.HUMAN ;
			currentPlayer = player.PLAYER1; // start with undefined player
			playCount = 0;
			board = [ 0, 1, 2, 3, 4, 5, 6, 7, 8];

		},

		isPlayer1Computer: function () {
			return player1Type === playerType.COMPUTER;
		},

		isValidPlayerType: function ( playerType ){
			return (playerType === playerType.COMPUTER || playerType === playerType.HUMAN );
		},

		gameMode: function () {
			if( player1Type === playerType.HUMAN ) {
				if( player2Type === playerType.HUMAN) {
					return gameMode.HVH;
				}
				else if( player2Type === playerType.COMPUTER ) {
					return gameMode.HVC;
				}
			}
			else {
				if( player2Type === playerType.HUMAN) {
					return gameMode.HVC;
				}
				else if( player2Type === playerType.COMPUTER ) {
					return gameMode.CVC;
				}
			}
		},
		resetGame: function() {
			player1Type = "";
			player2Type = "";
			currentPlayer = player.PLAYER1;
			playCount = 0;
			board = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
		},

		isPositionEmpty: function ( position ) {
			return ( board[ position ] === counter.X || board[ position ] === counter.O ) ? false : true;
		},

		updateBoard: function ( position, counter ) {
			board[ position ] = counter;
		},

		getCounter: function (){
			return currentPlayer ? (currentPlayer === player.PLAYER1 ? counter.X : counter.O) : counter.X;
		},

		getOpponentsCounter: function () {
			return this.getCounter() === counter.X ? counter.O : counter.X;
		},

		findPlayerPositions: function ( counter ) {
			return board.filterIndex( function( element, index ) {
				return element === counter;
			});
		},

		incPlayCount: function () {
			return playCount++;
		},

		switchCurrentPlayer: function () {
			currentPlayer = currentPlayer === undefined ? player.PLAYER1 : (currentPlayer === player.PLAYER1 ) ? player.PLAYER2 : player.PLAYER1;
			return currentPlayer;
		},

		getUnfilledSpaces: function () {
			return board.filter( function( value, index) {
				return ( value === counter.X || value === counter.O ) ? false : true;
			});
		},

		counterPlayedTwice: function ( counter ) {
			var userPlayCount = this.findPlayerPositions( counter ).length;
			return userPlayCount >= 2;
		},

		findPossibleWin : function( playerPositions ) {
			return this.winningPositions.findValue( function( e ) {
        var foundCount = e.filter( function(elem) {
            return playerPositions.indexOf( elem ) < 0;
        });
        
        return ( foundCount.length === 1 && this.isPositionEmpty( foundCount[0])) ? foundCount[0] : undefined;
    	}, this);
		},

		findWinningPosition: function ( counter ) {
			var possibleWins = [];
			var position, possPos = -1;
			var counterIndexes = this.findPlayerPositions ( counter );
			return ( counterIndexes.length <= 1 ) ? position : this.findPossibleWin( counterIndexes );
		},
		
		blockUserPosition: function () {
			if ( !this.counterPlayedTwice( this.getOpponentsCounter() ) ) return -1;
			return this.findWinningPosition( this.getOpponentsCounter() );
		},

		computerWinPosition: function () {
			if( !this.counterPlayedTwice( this.getCounter() ) ) return -1;
			return this.findWinningPosition( this.getCounter() );
		},

		badChoice: function ( position ) {
			// We want the computer to always win or draw so we should only use center or edge positions unless there
			// is no other option.
			// In order to ensure this, the function badChoice will tell us if a edge has been selected 
			// when a non-edge is available.
			var edgeSpaces = [ 1, 3, 5, 7 ];
			var isEdge = false;
			var unfilledSpaces = this.getUnfilledSpaces();
			var nonEdgeSpaces = unfilledSpaces.filter( function(val) { return edgeSpaces.indexOf( val ) < 0; });

			if( position && nonEdgeSpaces.length ) {
				isEdge = edgeSpaces.indexOf( position ) !== -1;
			}
			return isEdge;
		},

		found: function ( counter, position ){
			return board[ position ] === counter;
		},

		opponentOnDiagCorners: function () {
			var oppCounter = this.getOpponentsCounter();
			var positions = this.findPlayerPositions( oppCounter );
			var diagonals = [ [0,8], [2,6] ];
			return diagonals.some( function( element ) {
				if( positions.length !== element.length ) return false;

				return this.found( oppCounter, element[0]) && this.found( oppCounter, element[ 1 ] );
			}, this );
		},

		getDiagonalStrategy: function ( that ) {
			var edges = [ 1, 3, 5, 7 ];
			return edges[ Math.floor(Math.random() * edges.length) ];
		},

		getEdgeOppositeCornersStrategy: function ( that ) {
			var corners = [ 0, 2, 6, 8 ];
			var edges = [ 1, 3, 5, 7 ];
			var oppCounter = that.getOpponentsCounter();
			var counterIndexes = this.findPlayerPositions ( oppCounter );

		},

		getWildPosition: function ( that ) {
			// if not first play then choose center position if available otherwise use minimax algo
			var unfilledSpaces = that.getUnfilledSpaces();
			return unfilledSpaces.indexOf( 4 ) >=0 ? 	4 : minimax( board, playerType.COMPUTER, that.getCounter() );
			// If position is a 'bad' choice then recursively generate another position and test with badChoice again.
			// return ( that.badChoice( position )) ? that.getNextPosition() : position;  
		},

		usesDiagonalStrategy: function () {
			// if opponent has marked two opposing diagonal corners and current player is in the center 
			// then this is a diagonal strategy.
			var unfilledSpaces = this.getUnfilledSpaces();
			return ( unfilledSpaces.length === 6 && this.opponentOnDiagCorners() && this.found( this.getCounter(), 4 ) ) && true;
		},

		useEdgeAndOppositeCornerStrategy: function() {
			// Another way of winning if you start on an edge:
			// If you mark an edge, followed by opponent marking center, then you mark one of the two corners farthest
			// away from your edge positon.  If opponent marks the other corner farthest from your edge then you have won.
			// Need to block this.

		},
		getStrategy: function (){
			// If diagonalStrategy() then return diagonalStrategy
			// otherwise generate a center or corner position.
			return ( this.usesDiagonalStrategy()) ? this.getDiagonalStrategy : this.getWildPosition;
		},

		getNextPosition: function (){
			// Get a Computer player's next move.
			// The Computer should win or draw but never lose.
			var unfilledSpaces = this.getUnfilledSpaces(); 
			var position, strategy, randomIndex = -1;

			position = minimax( board, playerType.COMPUTER, this.getCounter() );
	
			// If first play then choose randomly from corner or center positions
			/*if ( unfilledSpaces.length === 9 ) {
				randomIndex = Math.floor(Math.random() * unfilledSpaces.length);
				position = unfilledSpaces[ randomIndex ];
			}
			else {
				// Check if a strategy is needed, otherwise centre or corner position will be chosen.
				strategy = this.getStrategy();
				position = strategy && strategy( this );
			}*/
			return position;	
		},

		generateComputerMove : function () {
			var position = this.computerWinPosition();
			if( position >= 0 && position<9 ) { return position; }
			position = this.blockUserPosition();
			if( position >= 0 && position<9 ) { return position; } 

			return this.getNextPosition();
		},

		playMove : function ( position ) {
			this.updateBoard( position, this.getCounter() );
			this.switchCurrentPlayer();
			this.incPlayCount();
			return this;
		},

		found3InARow: function ( counter ) {
			var positions;
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

		////////////////////////////////////////////////////////////////////////////////////////////////////////
		//////// isGameOver - checks if either player has won or if there is a draw //////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////
		isGameOver : function () {
			if( playCount < 3) {
				return false;
			}
			if( this.found3InARow( counter.X ) || this.found3InARow( counter.O ) ) {
				return true;
			}
			else if ( playCount === 9 ) {
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
			count = 0;
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

	var count = 0;
	var gameController = {
	

		init: function () {
			boardGameModel.init();
			gameView.init();
		},

		startGame: function ( player1, player2) {
			var computersNextMove = -1;
			boardGameModel.init( player1, player2 );
			// player1 and player2 model: ??

			gameView.renderNewGame( player1, player2 );
			// if( player1Model.isComputer() ) ...
			if( boardGameModel.isPlayer1Computer() ) {
				this.computerGame();
			}
			else {
				gameView.enableBoard();
			}
		},

		resetGame: function () {
			boardGameModel.resetGame();
			gameView.resetGame();
		},

		playMove : function ( position ) {
			gameView.updateBoard( /*player1Model.getCounter()*/boardGameModel.getCounter(), position );
			return boardGameModel.playMove( position );
		},

		computerGame : function () {
			if( this.computerMove().isGameOver() ) {
				this.gameOver();
			}
			else if( boardGameModel.gameMode() === gameMode.CVC ){
				this.computerGame();
			}
			else {
				gameView.enableBoard();
			}
		},
		computerMove : function (/*player1Model*/) {
			var computerMove = boardGameModel.generateComputerMove();
			return this.playMove( computerMove );	
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

	gameController.init();
});

},{"./modules/minimax.js":1}]},{},[2]);
