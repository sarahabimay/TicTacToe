var domStuff = {
		romans : [ "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"]
};

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

var BoardGame = (function () {


	// Instance stores a reference to the Singleton
  var instance;

  function init( player1, player2 ) {

    // Singleton

    /// private members
		var isPlayer1 = player1;
		var player1Type=player1;
		var player2Type=player2;
		var currentPlayer = "player1"; // start with undefined player
		var playCount = 0;
		var board = [ 0, 1, 2, 3, 4, 5, 6, 7, 8];
		// the 'winningPositions' array represents all of the ways to win based on your starting position
		// =>e.g. [0] starting position has 3 possible ways to win: (0,1,2), (0,4,8), (0,3,6),
		// =>e.g. [1] starting positon has 2 possible ways to win: (1,4, 7), (1,0,2), etc..
		var winningPositions = [ [[1,2],[4,8],[3,6]], [[0,2],[4,7]], [[1,0],[5,8],[4,6]], [[0,6],[4,5]], [[3,5],[1,7],[0,8],[2,6]],
		             [[2,8],[3,4]], [[0,3],[2,4],[7,8]], [[6,8],[1,4]], [[6,7],[2,5],[0,4]]];
		
		//private methods
		function gameMode () {
			if( player1Type === "Human" ) {
				if( player2Type === "Human") {
					return "HvH";
				}
				else if( player2Type === "Computer" ) {
					return "HvC";
				}
			}
			else {
				if( player2Type === "Human") {
					return "HvC";
				}
				else if( player2Type === "Computer" ) {
					return "CvC";
				}
			}
		}

		function switchCurrentPlayer () {
			currentPlayer = currentPlayer === undefined ? "player1" : (currentPlayer === "player1" ? "player2" : "player1");
			return currentPlayer;
		}

		function incPlayCount () {
			return playCount++;
		}

		function newGame () {
			// reset private variables when a new game begins
			isPlayer1 = "";
			player1Type = "";
			player2Type = "";
			currentPlayer = "player1";
			playCount = 0;
			board = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
		}

 		function isPositionEmpty ( position ) {
			if( board[ position ] === "X" || board[ position ] === "Y" ){
				return false;
			}
			return true;
		}

		function isPlayer1Computer() {
			return ( isPlayer1 === "Computer" ) ? true : false;
		}

		function getCounter(){
			return currentPlayer ? (currentPlayer === "player1" ? "X" : "O") : "X";
		}

		function getOpponentsCounter () {
		  	return getCounter() === "X" ? "O" : "X";
		}
		
		function findCounterPositions( counter ) {
			return board.filterIndex( function( element, index ) {
					if( element === counter ) return true;
			});
		}

		function updateBoard( position, counter ) {
			board[ position ] = counter;
		}

		//////////////////////////////////////////////////////////////////////////////////////////////////
		//////// functions used by 'generateComputerMove'  ///////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////////
    
    	function getUnfilledSpaces () {
			var fieldsWithoutXorO = board.filter( function( value, index) {
				return ( value === "X" || value === "O" ) ? false : true;
			});
			return fieldsWithoutXorO;
		}

		function needToCheckForUserWin ( counter ) {
	    	// This checks whether the user has played at least 2 moves and returns if they have.
	    	// The number of plays made is different depending on whether the User or the Computer went first.
		  	var userPlayCount = findCounterPositions( counter ).length;
		  	if ( userPlayCount < 2) return false;
		  	return true;
		}

		function findWinningPosition ( counter ) {
			// Search for any possible winning scenarios for 'counter'.
			// Return the position that could block that win.
			var possibleWins = [];
			var position, possPos = -1;
			// find all of the index positions of the 'counter' element value 
			var counterIndexes = findCounterPositions ( counter );

			if( counterIndexes ){
				return counterIndexes.findValue( function ( element ) {
					possibleWins = winningPositions[element];
						return  possibleWins.findValue( function ( e ) {
							if( counterIndexes.indexOf( e[0]) >= 0 && isPositionEmpty( e[1] ) ){
								return e[1]; 
							}
							else if( counterIndexes.indexOf( e[1]) >= 0 && isPositionEmpty( e[0] ) ) {
								return e[0];
							}
							else return undefined;
						});
				});
			}
			return position;
		}
		
	  function blockUserPosition () {
	  	if ( !needToCheckForUserWin( getOpponentsCounter() ) ) return -1;
	  	return findWinningPosition( getOpponentsCounter() );
	  }

	  function computerWinPosition () {
	  	if( !needToCheckForUserWin( getCounter() ) ) return -1;
	  	return findWinningPosition( getCounter() );
	  }

		function badChoice ( position ) {
			// We want the computer to always win or draw so we should only use center or edge positions unless there
			// is no other option.
			// In order to ensure this, the function badChoice will tell us if a edge has been selected 
			// when a non-edge is available.
			var edgeSpaces = [ 1, 3, 5, 7 ];
			var isEdge = false;
			var unfilledSpaces = getUnfilledSpaces();
			var nonEdgeSpaces = unfilledSpaces.filter( function(val) { return edgeSpaces.indexOf( val ) < 0; });

			if( position && nonEdgeSpaces.length ) {
				isEdge = edgeSpaces.indexOf( position ) !== -1;
			}
			return isEdge;
		}

		function found ( counter, position ){
			return ( board[ position ] === counter ) && true;
		}

		function opponentOnDiagCorners () {
			var oppCounter = getOpponentsCounter();
			var positions = findCounterPositions( oppCounter );
			var diagonals = [ [0,8], [2,6] ];
			return diagonals.some( function( element ) {
				if( positions.length !== element.length ) return false;

				return ( found( oppCounter, element[0]) && found( oppCounter, element[ 1 ] ) ) && true;
			});
		}
		function getDiagonalStrategy () {
			// pick any edge
			var edges = [ 1, 3, 5, 7 ];
			return edges[ Math.floor(Math.random() * edges.length) ];
		}

		function getWildPosition () {
			// if not first play then choose center position if available otherwise random choice out of remainder
			var unfilledSpaces = getUnfilledSpaces();
  		var position = unfilledSpaces.indexOf( 4 ) >=0 ? 	4 : unfilledSpaces[ Math.floor(Math.random() * unfilledSpaces.length) ];
			// If position is a 'bad' choice then recursively generate another position and test with badChoice again.
  		return ( badChoice( position )) ? getNextPosition() : position;  
		}
		function diagonalStrategy () {
			// if opponent has marked two opposing diagonal corners and current player is in the center 
			// then this is a diagonal strategy.

			var unfilledSpaces = getUnfilledSpaces();
			return ( unfilledSpaces.length === 6 && opponentOnDiagCorners() && found( getCounter(), 4 ) ) && true;
		}
	  function getStrategy (){
	  	
	  	// if diagonalStrategy() then return diagonalStrategy
	  	// otherwise generate a center or corner position.
	  	return ( diagonalStrategy()) ? getDiagonalStrategy : getWildPosition;
	  }

	  function getNextPosition (){
	  	var unfilledSpaces = []; 
	  	var position, strategy, randomIndex = -1;
	
			// if first play then choose randomly from corner or center positions
	  	if ( unfilledSpaces.length === 9 ) {
	  		unfilledSpaces = getUnfilledSpaces();
	  		randomIndex = Math.floor(Math.random() * unfilledSpaces.length);
				position = unfilledSpaces[ randomIndex ];
	  	}
	  	else {
		  	// Check if a strategy is needed, otherwise centre or corner position will be chosen.
		  	strategy = getStrategy();
		  	position = strategy && strategy();	
			}
			return position;
	  }

	  function generateComputerMove () {
			// First, check if there is a potential win for the computer.  If so then this is the next position.
			// Finally, randomly select any remaining corner position or if there are none then select any of the 
			// remaining 'edge' positions.
			// First check if there is a position which could win the game for the computer.
			var position = computerWinPosition();
			if( position >= 0 && position<9 ) { return position; }
			// Then check if we need to block the other player's win.
			position = blockUserPosition();
			if( position >= 0 && position<9 ) { return position; } 

			return getNextPosition();
		}

	  ////////////////////////////////////////////////////////////////////////////////////////////////////
	  ///////// functions used by 'checkForGameOver'  ////////////////////////////////////////////////////
	  ////////////////////////////////////////////////////////////////////////////////////////////////////
		function found3InARow ( counter ) {
			// this could be improved to use the 'winningPositions' array
			var positions;
			var counterIndexes = findCounterPositions( counter );
			for (var i = 0; i < counterIndexes.length; i++) {
				positions = winningPositions[ counterIndexes[ i ] ];
				for (var j = 0; j < positions.length; j++ ) {
					if ( (counterIndexes.indexOf( positions[j][0] ) >=0 && counterIndexes.indexOf( positions[j][1] ) >= 0 ) ) {
						alert( counter + ' has won the game. Start a new game');
						return true;
					}
				}
			}
		}

		function checkForGameOver () {
			if( playCount < 3) {
				return false;
			}
			if( found3InARow( "X" ) || found3InARow( "O" ) ) {
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
		
		return {

		  // Public methods and variables
		  gameMode : function () {
		  	return gameMode();
		  },
		  isPlayer1Computer : function() {
		  	return isPlayer1Computer();
		  },
		  setPlayers : function ( player1, player2 ) {
		  	player1Type=player1;
				player2Type=player2;
		  	isPlayer1 = player1;
		  },
		  resetGame : function () {
		  	newGame();
		  },

		  getCurrentPlayer: function(){
		  	return currentPlayer;
		  },

		  whoIsPlayer : function ( isPlayerAComputer ) {
		  	// return the 'name' of player1 if isPlayer1 is true, else return 'name' of player2.
		  	return isPlayerAComputer ? player1Type : player2Type;
		  },
		
		  getCounter : function (isComputer) {
		  	return getCounter(isComputer);
		  },

		  isPositionEmpty : function ( position ) {
		  	isPositionEmpty( position );
			},

		  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
			////// generateComputerMove' are used to generate a new computer move ////////////////////
		  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
		  
			generateComputerMove : function () {
				return generateComputerMove();
			},
		  
		  ////////////////////////////////////////////////////////////////////////////////////////////////////////
		  //////// playMove fn is used to play a computer move  //////////////////////////////////////////////////
		  ////////////////////////////////////////////////////////////////////////////////////////////////////////
		  playMove : function ( position ) {
		  	updateBoard( position, getCounter() );
		  	switchCurrentPlayer();
		  	incPlayCount();
		  	return this;
		  },

		  ////////////////////////////////////////////////////////////////////////////////////////////////////////
		  //////// checkForGameOver - checks if either player has won or if there is a draw //////////////////////
		  ////////////////////////////////////////////////////////////////////////////////////////////////////////
			checkForGameOver : function () {
		  	return checkForGameOver();
		  }			
	  };
	}

	return {

    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function ( player1, player2 ) {

      if ( !instance ) {
        instance = init( player1, player2 );
      }
      
    	return instance;
  	}

	};
})();

	

// helper functions to keep code d.r.y.
function setDisable ( toggle ) {
	var fields = $( ".field" );
	$( ".gameboard" ).find( fields ).prop( 'disabled', toggle );
}

function resetGame () {
	var p1Text, p2Text, fields;
	var game = BoardGame.getInstance();
	game.resetGame();
	setDisable( true );
	fields = $( ".field" );
	$( ".gameboard" ).find( fields ).text( "-" );
	p1Text = "Player1: ";
	p2Text = "Player2: ";
	$("#p1Text").text( p1Text );
	$("#p2Text").text( p2Text );
	$("#stateofplay").hide();
	$("#playerselect").show();
	count = 0;
}

function updateGameBoardUI ( counter, position ) {
	// This function will place an X or O on the button element with id equivalent to 'position'.
	// The html game board has id's which are numbered 1 to 9 in roman numerals so array 'romans'
	// maps roman numerals to numbers.
	var field = $( "#" + domStuff.romans[ position ] );
	$( ".gameboard" ).find( field ).text( counter );
}
var count = 0;
function playComputerMove ( game ) {
	// generate the computer's next move	
	var position = game.generateComputerMove();
	console.log( count++ + '. Position: ' + position + '. Player: ' + game.getCurrentPlayer());
	// update DOM
	updateGameBoardUI( game.getCounter(), position );

	// update BoardGame 'cache'
	return game.playMove( position ).checkForGameOver();
}

$(document).ready (function () {

	document.addEventListener( 'HvH', function (e) {
		// set disable=false to enable game play
		setDisable( false );
	});

	document.addEventListener( 'HvC', function (e) {
		var game = BoardGame.getInstance();
		if( game.isPlayer1Computer() ) {
			// trigger computer move
			document.dispatchEvent( new Event('computersturn') );
		}
		else {
			// set disable=false to enable game play
			setDisable( false );
		}
	});

	document.addEventListener( 'CvC', function (e) {
		var game = BoardGame.getInstance();
		if( playComputerMove( game ) ){
			// If there is a win after the computer's move then game over!
			resetGame();
		}
		else {
			// trigger computer turn after 1.5 seconds so it's not too fast
			setTimeout(function(){ document.dispatchEvent( new Event('CvC') ); }, 1000);
		}
	});

	document.addEventListener( 'computersturn', function (e) {
		var game = BoardGame.getInstance();
		if( playComputerMove( game ) ){
			// If there is a win after the computer's move then game over!
			resetGame();
		}
		else if( game.gameMode() === "CvC" ){
			// I don't think we should ever enter here for CvC mode... but need to check before removing
			setTimeout(function(){ document.dispatchEvent( new Event('CvC') ); }, 1000);
		}
		else{ 
			// set disable=false to enable game play for a human!
			setDisable( false );
		}
	});

	$('#play').click( function () {
		var p1 = document.getElementById("player1");
		var player1 = p1.options[p1.selectedIndex].text;
		var p2 = document.getElementById("player2");
		var player2 = p2.options[p2.selectedIndex].text;
		var game = BoardGame.getInstance( player1, player2);
		game.setPlayers(player1, player2);
		console.log( game.gameMode());

		$("#p1Text").text( "Player1: " + game.whoIsPlayer( true ) );
		$("#p2Text").text( "Player2: " + game.whoIsPlayer( false ) );
		$("#playerselect").hide();
		$("#stateofplay").show();

		// there are 3 game mode's: Human v Human; Human v Computer and Computer V Computer
		gameMode = game.gameMode();
		document.dispatchEvent( new Event( gameMode ) );
	});

	$("#reset").click (function () {
		resetGame();
	});

	// user game play:
	$(".field").click (function () {
		var game = BoardGame.getInstance();
		var thisID = $(this).attr('id');
		var position = domStuff.romans.indexOf( thisID );
		
		if( game.isPositionEmpty( position )){

			// update DOM
			updateGameBoardUI( game.getCounter(), position );

			//update cache
			if( game.playMove( position ).checkForGameOver() ) {
				resetGame();
			}
			else if( game.gameMode() === "HvC" ){
				// if playing a Human vs Computer game then trigger computer move after 1.5 seconds so not too fast
				setDisable(true);
				setTimeout(function(){ document.dispatchEvent( new Event('computersturn') ); }, 1000);
			}
		}
	});
});