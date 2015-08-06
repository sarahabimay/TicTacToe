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
    // currentStateOfBoard = [ 0, 1, 2, 3, 4, ..8 ]
    var availableMoves = currentStateOfBoard.filter( function( e, i ) {
        return ( e !== "X" && e !== "O" ) && true;
    });
    return availableMoves;
}
function findCounterPositions ( counter, board ) {
    if( board === undefined ) console.log( "board undefined");
	return board.filterIndex( function( element, index ) {
		if( element === counter ) return true;
	});
}


function found3InARow ( counter, stateOfBoard ) {
	// this could be improved to use the 'winningPositions' array
	var positions;
		var winningPositions = [ [[1,2],[4,8],[3,6]], [[0,2],[4,7]], [[1,0],[5,8],[4,6]], [[0,6],[4,5]], [[3,5],[1,7],[0,8],[2,6]],
		             [[2,8],[3,4]], [[0,3],[2,4],[7,8]], [[6,8],[1,4]], [[6,7],[2,5],[0,4]]];
	var counterIndexes = findCounterPositions( counter, stateOfBoard );
	for (var i = 0; i < counterIndexes.length; i++) {
		positions = winningPositions[ counterIndexes[ i ] ];
		for (var j = 0; j < positions.length; j++ ) {
			if ( (counterIndexes.indexOf( positions[j][0] ) >=0 && counterIndexes.indexOf( positions[j][1] ) >= 0 ) ) {
				console.log( "!!!!!!!!!! ", counter, " IS THE WINNER!!!!!!!!!!!!");
				return true;
			}
		}
	}
}
function gameOver ( stateOfBoard ) {
  
	if( found3InARow( "X", stateOfBoard ) || found3InARow( "O", stateOfBoard ) ) {
		return true;
	}
	else {
	    var availMoves = getAvailableMoves( stateOfBoard );
	   // console.log( "In gameOver: AvailableMoves: ", availMoves );
	    if ( availMoves.length === 0 ) {
		  //  console.log(  "!!!!!!!!! It's a DRAW!!!!!!!!!!!!!");
		    return true;
	    }
	    else {
	    	return false;
    	}
	}
}
function isWinner ( counter, stateOfBoard ){
    // var temp = found3InARow( counter, stateOfBoard );
    // if( temp ) console.log( "!!!!!!!!!! ", counter, " IS THE WINNER!!!!!!!!!!!!");
    return found3InARow( counter, stateOfBoard );
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
function evaluateLine ( computerCounter, board, pos1, pos2, pos3 ) {
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
function getFutureScoreOfMove (stateOfBoard, depth, playersTurn, playersCounter) {
  var stateOfBoardAfterMove = stateOfBoard;
  var availableMoves = getAvailableMoves( stateOfBoard );
  var countOfMoves = availableMoves.length;
  var currentBestScore, currentBestMove;
  var movesTried = [];
  if( gameOver( stateOfBoard ) ) {
      // return 1 if AI wins, 0 if draw, -1 if user wins
      return evaluate( ( playersTurn === "Computer" ? playersCounter : getInverseCounter( playersCounter ) ), stateOfBoard );
  }
  
  if(playersTurn==="Computer") {
      currentBestScore= -100000; //this is the worst case for AI
  }
  else{
      currentBestScore= +100000; //this is the worst case for Player
  }
  
  availableMoves.forEach( function( aMove, i ) {
  	console.log( "Board at Depth: ", depth, " : ", playersCounter );
    console.log( stateOfBoard );
   
    if( aMove === "X" || aMove === "O" || movesTried.indexOf( aMove ) >=0 ){
        // if( stateOfBoard[i] === "X" || stateOfBoard[i] === "O") {
        // these aren't legal as they are already taken so skip
        return false;
     }
    // record when we have tried a move so we don't try it again later
    movesTried.push( aMove );
    stateOfBoardAfterMove[ aMove ] = playersCounter;
    console.log( "Board after move: ", playersCounter );
    console.log( stateOfBoardAfterMove );
    score=getFutureScoreOfMove(stateOfBoardAfterMove , depth+1, getInverseUser( playersTurn ), getInverseCounter(playersCounter) );
    if(playersTurn === "Computer" && score>currentBestScore) { //AI wants positive score
        currentBestScore=score;
        currentBestMove = aMove;
    }
    if( playersTurn === "Human" && score<currentBestScore) { //user wants          negative score
        currentBestScore=score;
        currentBestMove = aMove;
    }
    // remove counter from stateOfBoardAFterMove as we will try a different move if there are any available
    stateOfBoardAfterMove[aMove] = aMove;
  });
  
  console.log( "Best Score at Depth: ", depth, " ; CurrentBestMove: ", currentBestMove, "; CurrentBestScore: ", currentBestScore );
  console.log( "************************************************");
  return currentBestScore;
}

module.exports = function (currentStateOfBoard, computerPlayer, computerCounter ) {
  var currentBestMove= null;
  var score = null;
  var currentBestScore= -100000;
  var stateOfBoardAfterMove = currentStateOfBoard;
  var availableMoves = getAvailableMoves( currentStateOfBoard );
  availableMoves.forEach( function( aMove, i ) {

    if( availableMoves[i] === "X" || availableMoves[i] === "O")         {
        // these aren't legal as they are already taken so skip
        return false;
    }
    console.log( "NEXT OPENING MOVE FOR COMPUTER: ", aMove );
    stateOfBoardAfterMove[ aMove ] = computerCounter;
    // console.log( "Board after move: ", computerPlayer );
    // console.log( stateOfBoardAfterMove );
    score=getFutureScoreOfMove(stateOfBoardAfterMove , 1/*depth*/,"Human", getInverseCounter( computerCounter ));
    
    if( score>=currentBestScore) {
      console.log( "Current Best Score at Depth: 0 : ", score );
      console.log( "lastMove: ", aMove );
      console.log( "currentBestScore: ", currentBestScore );
      currentBestMove=aMove;
      currentBestScore=score;
    }
    stateOfBoardAfterMove[aMove] = aMove;
  });
  console.log( "OVERALL NEXT BEST MOVE FOR THE COMPUTER: ", currentBestMove );
  return currentBestMove;
};


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

// adapt ES6 Array find method such that it just return the first found value 
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
	var gameMode = {
		HVC : "HvC",
		HVH : "HvH",
		CVC : "CvC"
	};
	var playerType = {
		COMPUTER : "Computer",
		HUMAN : "Human",
	};
	// The computer player MODEL in the MVC
	var computerPlayerModel = {
		
	};
	// The board MODEL in the MVC
	var boardGameModel = {
		player1Type    : "",
		player2Type    : "",
		currentPlayer  : "player1", // start with player1
		playCount      : 0,
		board : [ 0, 1, 2, 3, 4, 5, 6, 7, 8],
		// the 'winningPositions' array represents all of the ways to win based on your starting position
		// =>e.g. [0] starting position has 3 possible ways to win: (0,1,2), (0,4,8), (0,3,6),
		// =>e.g. [1] starting positon has 2 possible ways to win: (1,4, 7), (1,0,2), etc..
		winningPositions : [[[1,2],[4,8],[3,6]], [[0,2],[4,7]], [[1,0],[5,8],[4,6]], [[0,6],[4,5]], 
												[[3,5],[1,7],[0,8],[2,6]], [[2,8],[3,4]], [[0,3],[2,4],[7,8]], [[6,8],[1,4]], [[6,7],[2,5],[0,4]]],

		winningPositions2 : [ [0,1,2],[0,4,8],[0, 3,6], [1,0,2],[1,4,7], 
													[2,1,0],[2,5,8],[2,4,6], [3,0,6],[3,4,5], [4,3,5],[4,1,7],[4,0,8],[4,2,6],
		             					[5,2,8],[5,3,4], [6,0,3],[6,2,4],[6,7,8], [7,6,8],[7,1,4], [8,6,7],[8,2,5],[8,0,4]],		             

		init: function ( player1, player2 ){
			player1Type = ( player1 === playerType.COMPUTER )? playerType.COMPUTER : playerType.HUMAN ;
			player2Type = ( player2 === playerType.COMPUTER )? playerType.COMPUTER : playerType.HUMAN ;
			currentPlayer = "player1"; // start with undefined player
			playCount = 0;
			board = [ 0, 1, 2, 3, 4, 5, 6, 7, 8];
			// winningPositions = [ [[1,2],[4,8],[3,6]], [[0,2],[4,7]], [[1,0],[5,8],[4,6]], [[0,6],[4,5]], [[3,5],[1,7],[0,8],[2,6]],
		 //             [[2,8],[3,4]], [[0,3],[2,4],[7,8]], [[6,8],[1,4]], [[6,7],[2,5],[0,4]]];

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
			// reset private variables when a new game begins
			isPlayer1AComputer = false;
			player1Type = "";
			player2Type = "";
			currentPlayer = "player1";
			playCount = 0;
			board = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
		},

    isPositionEmpty: function ( position ) {
    	return ( board[ position ] === "X" || board[ position ] === "O" ) ? false : true;
    },

		updateBoard: function ( position, counter ) {
			board[ position ] = counter;
		},

		getCounter: function (){
			return currentPlayer ? (currentPlayer === "player1" ? "X" : "O") : "X";
		},

		getOpponentsCounter: function () {
		  	return this.getCounter() === "X" ? "O" : "X";
		},

		findCounterPositions: function ( counter ) {
			return board.filterIndex( function( element, index ) {
				if( element === counter ) return true;
			});
		},

		incPlayCount: function () {
			return playCount++;
		},

		switchCurrentPlayer: function () {
			currentPlayer = currentPlayer === undefined ? "player1" : (currentPlayer === "player1" ? "player2" : "player1");
			return currentPlayer;
		},

		//////////////////////////////////////////////////////////////////////////////////////////////////
		//////// functions used by 'generateComputerMove'  ///////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////////
    
  	getUnfilledSpaces: function () {
			var fieldsWithoutXorO = board.filter( function( value, index) {
				return ( value === "X" || value === "O" ) ? false : true;
			});
			return fieldsWithoutXorO;
		},

		needToCheckForUserWin: function ( counter ) {
	    	// This checks whether the user has played at least 2 moves and returns if they have.
	    	// The number of plays made is different depending on whether the User or the Computer went first.
		  	var userPlayCount = this.findCounterPositions( counter ).length;
		  	if ( userPlayCount < 2) return false;
		  	return true;
		},

		findWinningPosition: function ( counter ) {
			// Search for any possible winning scenarios for 'counter'.
			// Return the position that could block that win.
			var possibleWins = [];
			var position, possPos = -1;
			// find all of the index positions of the 'counter' element value 
			var counterIndexes = this.findCounterPositions ( counter );

			if( counterIndexes ){
				return counterIndexes.findValue( function ( element ) {
					possibleWins = this.winningPositions[element];
						return  possibleWins.findValue( function ( e ) {
							if( counterIndexes.indexOf( e[0]) >= 0 && this.isPositionEmpty( e[1] ) ){
								return e[1]; 
							}
							else if( counterIndexes.indexOf( e[1]) >= 0 && this.isPositionEmpty( e[0] ) ) {
								return e[0];
							}
							else return undefined;
						}, this );
				}, this );
			}
			return position;
		},
		
	  blockUserPosition: function () {
	  	if ( !this.needToCheckForUserWin( this.getOpponentsCounter() ) ) return -1;
	  	return this.findWinningPosition( this.getOpponentsCounter() );
	  },

	  computerWinPosition: function () {
	  	if( !this.needToCheckForUserWin( this.getCounter() ) ) return -1;
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
			return ( board[ position ] === counter ) && true;
		},

		opponentOnDiagCorners: function () {
			var oppCounter = this.getOpponentsCounter();
			var positions = this.findCounterPositions( oppCounter );
			var diagonals = [ [0,8], [2,6] ];
			return diagonals.some( function( element ) {
				if( positions.length !== element.length ) return false;

				return ( this.found( oppCounter, element[0]) && this.found( oppCounter, element[ 1 ] ) ) && true;
			}, this );
		},

		getDiagonalStrategy: function () {
			// pick any edge
			var edges = [ 1, 3, 5, 7 ];
			return edges[ Math.floor(Math.random() * edges.length) ];
		},

		getWildPosition: function ( that ) {
			// if not first play then choose center position if available otherwise use minimax algo
			var unfilledSpaces = that.getUnfilledSpaces();
  		var position = unfilledSpaces.indexOf( 4 ) >=0 ? 	4 : minimax( board, playerType.COMPUTER, that.getCounter() );
			return position;
			// If position is a 'bad' choice then recursively generate another position and test with badChoice again.
  		// return ( that.badChoice( position )) ? that.getNextPosition() : position;  
		},

		usesDiagonalStrategy: function () {
			// if opponent has marked two opposing diagonal corners and current player is in the center 
			// then this is a diagonal strategy.
			var unfilledSpaces = this.getUnfilledSpaces();
			return ( unfilledSpaces.length === 6 && this.opponentOnDiagCorners() && this.found( this.getCounter(), 4 ) ) && true;
		},

	  getStrategy: function (){
	  	// if diagonalStrategy() then return diagonalStrategy
	  	// otherwise generate a center or corner position.
	  	return ( this.usesDiagonalStrategy()) ? this.getDiagonalStrategy : this.getWildPosition;
	  },

	  getNextPosition: function (){
	  	var unfilledSpaces = this.getUnfilledSpaces(); 
	  	var position, strategy, randomIndex = -1;
	
			// if first play then choose randomly from corner or center positions
	  	if ( unfilledSpaces.length === 9 ) {
	  		randomIndex = Math.floor(Math.random() * unfilledSpaces.length);
				position = unfilledSpaces[ randomIndex ];
	  	}
	  	else {
		  	// Check if a strategy is needed, otherwise centre or corner position will be chosen.
		  	strategy = this.getStrategy();
		  	position = strategy && strategy( this );
			}
			return position;	
	  },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
		////// generateComputerMove is used to generate a new computer move ////////////////////
	  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
		generateComputerMove : function () {
			// First, check if there is a potential win for the computer.  If so then this is the next position.
			// Finally, randomly select any remaining corner position or if there are none then select any of the 
			// remaining 'edge' positions.
			// First check if there is a position which could win the game for the computer.
			var position = this.computerWinPosition();
			if( position >= 0 && position<9 ) { return position; }
			// Then check if we need to block the other player's win.
			position = this.blockUserPosition();
			if( position >= 0 && position<9 ) { return position; } 

			return this.getNextPosition();
		},

		////////////////////////////////////////////////////////////////////////////////////////////////////////
	  //////// playMove fn is used to play a computer move  //////////////////////////////////////////////////
	  ////////////////////////////////////////////////////////////////////////////////////////////////////////
	  playMove : function ( position ) {
	  	this.updateBoard( position, this.getCounter() );
	  	this.switchCurrentPlayer();
	  	this.incPlayCount();
	  	return this;
	  },

		////////////////////////////////////////////////////////////////////////////////////////////////////
	  ///////// functions used by 'checkForGameOver'  ////////////////////////////////////////////////////
	  ////////////////////////////////////////////////////////////////////////////////////////////////////
		found3InARow: function ( counter ) {
			// this could be improved to use the 'winningPositions' array
			var positions;
			var counterIndexes = this.findCounterPositions( counter );
			for (var i = 0; i < counterIndexes.length; i++) {
				positions = this.winningPositions[ counterIndexes[ i ] ];
				for (var j = 0; j < positions.length; j++ ) {
					if ( (counterIndexes.indexOf( positions[j][0] ) >=0 && counterIndexes.indexOf( positions[j][1] ) >= 0 ) ) {
						alert( counter + ' has won the game. Start a new game');
						return true;
					}
				}
			}
		},

	  ////////////////////////////////////////////////////////////////////////////////////////////////////////
	  //////// checkForGameOver - checks if either player has won or if there is a draw //////////////////////
	  ////////////////////////////////////////////////////////////////////////////////////////////////////////
		isGameOver : function () {
	  	if( playCount < 3) {
				return false;
			}
			if( this.found3InARow( "X" ) || this.found3InARow( "O" ) ) {
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
				var romans = [ "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix" ];
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
			// This function will place an X or O on the button element with id equivalent to 'position'.
			// The html game board has id's which are numbered 1 to 9 in roman numerals so array 'romans'
			// maps roman numerals to numbers.
			var romans = [ "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix" ];

			var field = $( "#" + romans[ position ] );
			$( ".gameboard" ).find( field ).text( counter );
		}
	};

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
				this.computerGameMode();
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

		computerGameMode : function () {
			if( this.computerMove().isGameOver() ) {
				this.gameOver();
			}
			else if( boardGameModel.gameMode() === gameMode.CVC ){
				this.computerGameMode();
			}
			else {
				gameView.enableBoard();
			}
		},
		computerMove : function (/*player1Model*/) {
			// generate computer move and update view with it:
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
				else{
					mode = boardGameModel.gameMode();
					if( mode === gameMode.HVC ){
						// trigger computer move
						gameView.disableBoard();
						this.computerMove().isGameOver() ? this.gameOver() : gameView.enableBoard(); 
					}
				}

			}
		}
	};

	gameController.init();
});

},{"./modules/minimax.js":1}]},{},[2]);
