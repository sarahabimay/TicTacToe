
var domStuff = {
		romans : [ "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"]

};

// adapt JS Array filter method to return the index instead of the value
Array.prototype.filterIndex = function(fun/*, thisArg*/) {
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
Array.prototype.findValue = function(predicate) {
  if (this === null) {
    throw new TypeError('Array.prototype.find called on null or undefined');
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

var BoardGame = (function(){


	// Instance stores a reference to the Singleton
  var instance;

  function init( player1 ) {

    // Singleton

    /// private members
		var isPlayer1 = player1;
		var playCount = 0;
		var board = [ 0, 1, 2, 3, 4, 5, 6, 7, 8];
		// the 'winningPositions' array represents all of the ways to win based on your starting position
		// =>e.g. [0] starting position has 3 possible ways to win: (0,1,2), (0,4,8), (0,3,6),
		// =>e.g. [1] starting positon has 2 possible ways to win: (1,4, 7), (1,0,2), etc..
		var winningPositions = [ [[1,2],[4,8],[3,6]], [[0,2],[4,7]], [[1,0],[5,8],[4,6]], [[0,6],[4,5]], [[3,5],[1,7],[0,8],[2,6]],
		             [[2,8],[3,4]], [[0,3],[2,4],[7,8]], [[6,8],[1,4]], [[6,7],[2,5],[0,4]]];
		
		//private methods
		function incPlayCount(){
			return playCount++;
		}

		function newGame() {
			// reset private variables when a new game begins
			isPlayer1 = undefined;
			playCount = 0;
			board = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
		}

		function isPlayer1Computer() {
			return ( isPlayer1 === "Computer" ) ? true : false;
		}

		function getCounter( isComputer ){
			if( isComputer ) {
				return isPlayer1Computer() ? "X" : "O";
			}
			else {
				return isPlayer1Computer() ? "O" : "X";
			}
		}
		function updateBoard( position, counter ) {
			board[ position ] = counter;
		}

    function isPositionFilled( position ) {
    	return ( board[ position ] === "X" || board[ position ] === "O" ) ? true : false;
    }

    function needToCheckForUserWin() {
    	// This checks whether the user has played at least 2 moves and returns if they have.
    	// The number of plays made is different depending on whether the User or the Computer went first.
	  	var userPlayCount = isPlayer1Computer() ? 3 : 2;
	  	if (playCount <= userPlayCount) return false;
	  	return true;
		}

		function findWinningPosition ( isComputer ) {
			// Search for any possible winning scenarios for 'counter'.
			// Return the position that could block that win.
			var position;
		  var counter = getCounter( isComputer );// this is the counter for the user or computer
			var counterIndexes = board.filterIndex( function( element, index ) {
					if( element === counter ) return true;
			});

			if( counterIndexes ){
				position = counterIndexes.findValue( function( element, index) {
					var possibleWins = winningPositions[element];
						var possPos =  possibleWins.findValue( function ( e, i) {
							if( counterIndexes.indexOf( e[0]) >= 0 && !isPositionFilled( e[1] ) ){
								return e[1]; 
							}
							else if( counterIndexes.indexOf( e[1]) >= 0 && !isPositionFilled( e[0] ) ) {
								return e[0];
							}
							else return undefined;
						});
						if( possPos ) return possPos;
				});
			}
			return position;
		}
		
		function found3InARow ( counter ) {
			if( ( board[ 0 ] === counter && board[ 1 ] === counter && board[ 2 ] === counter ) ||
				  ( board[ 3 ] === counter && board[ 4 ] === counter && board[ 5 ] === counter ) ||
				  ( board[ 6 ] === counter && board[ 7 ] === counter && board[ 8 ] === counter ) ||
				  ( board[ 0 ] === counter && board[ 3 ] === counter && board[ 6 ] === counter ) ||
				  ( board[ 1 ] === counter && board[ 4 ] === counter && board[ 7 ] === counter ) ||
				  ( board[ 2 ] === counter && board[ 5 ] === counter && board[ 8 ] === counter ) ||
				  ( board[ 0 ] === counter && board[ 4 ] === counter && board[ 8 ] === counter ) ||
				  ( board[ 2 ] === counter && board[ 4 ] === counter && board[ 6 ] === counter ) ) {
		   			alert( counter + ' has won the game. Start a new game');
		   		return true;
			}
		}

		function checkForGameOver(){
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
		  isPlayer1Computer : function() {
		  	return isPlayer1Computer();
		  },
		  setPlayer1 : function ( player1 ) {
		  	isPlayer1 = player1;
		  },
		  resetGame : function(){
		  	newGame();
		  },
		  getCounter : function (isComputer) {
		  	return getCounter(isComputer);
		  },

		  blockUserPosition : function() {
		  	if ( !needToCheckForUserWin() ) return -1;
		  	return findWinningPosition( false );
		  },

		  computerWinPosition : function() {
		  	if( !needToCheckForUserWin() ) return -1;
		  	return findWinningPosition( true );
		  },

			checkForGameOver : function( position, isComputer ) {
		  	updateBoard( position, getCounter( isComputer ) );
		  	incPlayCount();
		  	return checkForGameOver();
		  },
		  
		  isPositionEmpty : function ( position ) {
				if( board[ position ] === "X" || board[ position ] === "Y" ){
					return false;
				}
				return true;
			},

			getUnfilledSpaces : function (){
				var fieldsWithoutXorO = board.filter( function( value, index) {
					return ( value === "X" || value === "O" ) ? false : true;
				});
				console.log( 'Unfilled Positions: ' + fieldsWithoutXorO );
				return fieldsWithoutXorO;
			}
	  };
	}

	return {

    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function ( player1 ) {

      if ( !instance ) {
        instance = init( player1 );
      }
      
    	return instance;
  	}

	};
})();

	

// helper functions to keep code d.r.y.
function setDisable( toggle ){
	var fields = $( ".field" );
	$( ".gameboard" ).find( fields ).attr("disabled", toggle);
}
function resetGame (){
	var game = BoardGame.getInstance();
	game.resetGame();
	var fields = $( ".field" );
	$( ".gameboard" ).find( fields ).text( "-" );
	setDisable( true );
	var p1Text = "Player1: ";
	var p2Text = "Player2: ";
	$("#p1Text").text( p1Text );
	$("#p2Text").text( p2Text );
	$("#stateofplay").hide();
	$("#playerselect").show();
}

function updateGameBoardUI ( game, position, isComputer ){
	// This function will place an X or O on the button element with id equivalent to 'position'.
	// The html game board has id's which are numbered 1 to 9 in roman numerals so array 'romans'
	// maps roman numerals to numbers.
	var counter = game.getCounter( isComputer );
	var field = $( "#" + domStuff.romans[ position ] );
	$( ".gameboard" ).find( field ).text( counter );
	// $( ".gameboard" ).find( field ).attr( "disabled", true );
	field.addClass( "disable");
}

function playComputerMove ( game ) {
	// We also need to 'cache' the position in BoardGame to keep track of what spaces are still free.  
	
	var position = generateComputerMove(game);
	// update DOM
	updateGameBoardUI( game, position, true );

	// update cache
	return game.checkForGameOver( position, true );

}

function badChoice ( position, game ) {
	// We want the computer to always win or draw so we should only use center or edge positions unless there
	// is no other option.
	// In order to ensure this, the function badChoice will tell us if a edge has been selected 
	// when a non-edge is available.
	var edgeSpaces = [ 1, 3, 5, 7 ];
	var isEdge = false;
	var unfilledSpaces = game.getUnfilledSpaces();
	var nonEdgeSpaces = unfilledSpaces.filter( function(val) { return edgeSpaces.indexOf( val ) < 0; });
	if( nonEdgeSpaces.length ) {
		isEdge = edgeSpaces.indexOf( position ) !== -1;
	}
	return isEdge;
}

function generateComputerMove (game) {
	// First, check if computer needs to block a potential user win.  If so then this is the next position.
	// Then, check if there is a potential win for the computer.  If so then this is the next position.
	// Finally, randomly select any remaining corner position or if there are none then select any of the 
	// remaining 'edge' positions.

	// First check if we need to block the other player's win.
	var position = game.blockUserPosition();
	if( position >= 0 ) {
		if( position && position>=0 && position<9 ) return position;
	}
	// Then check if there is a position which could win the game for the computer.
	position = game.computerWinPosition();
	if( position >= 0 ) {
		if( position && position>=0 && position<9 ) return position;
	}
	var unfilledSpaces = game.getUnfilledSpaces();
	position = unfilledSpaces[Math.floor(Math.random() * unfilledSpaces.length)];
	// If position is a 'bad' choice then recursively generate another position and test with badChoice again.
  return ( badChoice( position, game )) ? generateComputerMove (game) : position;
}

$(document).ready (function(){

	document.addEventListener( 'computersturn', function(e) {
		var game = BoardGame.getInstance();
		if( playComputerMove( game ) ){
					console.log( "Someone has won or drawn" );
					resetGame();
		}
	});

	$("#player1").click (function(){
		var game = BoardGame.getInstance( "You");
		game.setPlayer1("You");
		$('#readyModal').modal('show');
  });

  $("#player2").click (function(){
  	var game = BoardGame.getInstance( "Computer");
		game.setPlayer1("Computer");
		$('#readyModal').modal('show');
  });

	$(".readytoplay").click (function() {
		var game = BoardGame.getInstance();
		var p1Text = "Player1: " + ( game.isPlayer1Computer() ? "Computer" : "You");
		var p2Text = "Player2: " + ( game.isPlayer1Computer() ? "You" : "Computer");
		$("#p1Text").text( p1Text );
		$("#p2Text").text( p2Text );
		$('#readyModal').modal('hide');
		$("#playerselect").hide();
		$("#stateofplay").show();

		if( game.isPlayer1Computer() ) {
			// trigger computer move
			document.dispatchEvent( new Event('computersturn') );
		}
		// set disable=false to enable game play
		setDisable( false );
	});

	$(".notreadytoplay").click (function() {
		$('#readyModal').modal('hide');
		resetGame();
	});

	$("#reset").click (function() {
		resetGame();
	});

	// user game play:
	$(".field").click (function(){
		var game = BoardGame.getInstance();
		var thisID = $(this).attr('id');
		var position = domStuff.romans.indexOf( thisID );
		
		if( game.isPositionEmpty( position )){

			// update DOM
			updateGameBoardUI( game, position, false );

			//update cache
			if( game.checkForGameOver( position, false ) ) {
				console.log( "Someone has won or drawn");
				resetGame();
			}
			else {
				// trigger computer move
				document.dispatchEvent( new Event('computersturn') );
			}
		}
	});
});