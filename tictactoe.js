
var domStuff = {
		romans : [ "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"]

};
var BoardGame = (function(){


	// Instance stores a reference to the Singleton
  var instance;

  function init( player1 ) {

    // Singleton

    /// private members
		var isPlayer1 = player1;
		var playCount = 0;
		var board = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
		var that = this;

		//private methods
		function updateBoard( position, counter ) {
			board[ position ] = counter;
		}

		function foundPositionToBlock( counter ) {
			// search for any possible winning scenarios for counter.
			// return the position that could block that win.

		}

		function found3InARow ( counter ) {
			if( ( board[ 0 ] === counter && board[ 1 ] === counter && board[ 2 ] === counter ) ||
				  ( board[ 3 ] === counter && board[ 4 ] === counter && board[ 5 ] === counter ) ||
				  ( board[ 6 ] === counter && board[ 7 ] === counter && board[ 8 ] === counter ) ||
				  ( board[ 0 ] === counter && board[ 3 ] === counter && board[ 0 ] === counter ) ||
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

		function incPlayCount(){
			return playCount++;
		}

		function newGame() {
			isPlayer1 = undefined;
			board = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
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

		return {

		  // Public methods and variables
		  isPlayer1Computer : function() {
		  	return isPlayer1Computer();
		  },
		  resetGame : function(){
		  	newGame();
		  },
		  getCounter : function (isComputer) {
		  	return getCounter(isComputer);
		  },

		  positionToBlock : function() {
		  	var counter = isPlayer1Computer() ? "O": "X";
		  	return foundPositionToBlock( counter );
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
function enableGame(){
	var fields = $( ".field" );
	$( ".gameboard" ).find( fields ).attr("disabled", false);
}
function resetGame (){
	// isPlayer1Computer = undefined;
	// board = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
	var game = BoardGame.getInstance();
	game.resetGame();
	var fields = $( ".field" );
	$( ".gameboard" ).find( fields ).text( "-" );
	var p1Text = "Player1: ";
	var p2Text = "Player2: ";
	$("#p1Text").text( p1Text );
	$("#p2Text").text( p2Text );
	$("#stateofplay").hide();
	$("#playerselect").show();
}

function updateGameBoard ( game, position, isComputer ){
	// This function will place an X or O on the button element with id equivalent to 'position'.
	// The html game board has id's which are numbered 1 to 9 in roman numerals so array 'romans'
	// maps roman numerals to numbers.
	var counter = game.getCounter( isComputer );
	var field = $( "#" + domStuff.romans[ position ] );
	$( ".gameboard" ).find( field ).text( counter );
	$( ".gameboard" ).find( field ).attr( "disabled", true );
	field.addClass( "disable");
}

function playComputerMove ( game ) {
	// We also need to 'cache' the position in BoardGame to keep track of what spaces are still free.  
	
	var position = generateComputerMove(game);
	// update DOM
	updateGameBoard( game, position -1, true );

	// update cache
	var result = game.checkForGameOver( position - 1, true );

}

function badChoice ( position, game ) {
	// We want the computer to always win or draw so we should only use center or edge positions unless there
	// is no other option.
	// In order to ensure this, the function badChoice will tell us if a edge has been selected 
	// when a non-edge is available.
	var edgeSpaces = [ 2, 4, 6, 8 ];
	var isEdge = false;
	var unfilledSpaces = game.getUnfilledSpaces();
	// This is how I'm checking if there are only the edge spaces left:
	// I take the unfilledSpaces array and filter out any edge spaces.
	// If the resulting array is empty then there is nothing but edge spaces left.
	// In this case the move/position should be allowed.
	// If the resulting array is not empty then there are alternative positions and we'd 
	// want to play one of those first.
	var nonEdgeSpaces = unfilledSpaces.filter( function(val) { return edgeSpaces.indexOf( val ) < 0; });
	if( nonEdgeSpaces.length ) {
		isEdge = edgeSpaces.indexOf( position ) !== -1;
	}
	return isEdge;
}

function generateComputerMove (game) {
	// Board array is like this: [  1, 2, 3, 4, 5, 6, 7, 8, 9 ];
	// Where 1 is the top, left corner on the tictactoe board, 3 is top, right corner etc..
	// Player1 is 'X'
	
	// The first time this function is called position will be undefined and the function
	// will randomly choose a position.
	// If position a 'bad' choice then recursively generate another position and test with badChoice again.

	// First check if we need to block the other player's win.
	var position = game.positionToBlock();
	if( position.length ) return position[ 0 ];

	var unfilledSpaces = game.getUnfilledSpaces();
	position = unfilledSpaces[Math.floor(Math.random() * unfilledSpaces.length)];
  return ( badChoice( position, game )) ? generateComputerMove (game) : position;
}

$(document).ready (function(){
	
	$("#player1").click (function(){
		var isPlayer1Computer = false;
		var game = BoardGame.getInstance( "You");
		$('#readyModal').modal('show');
  });

  $("#player2").click (function(){
  	var isPlayer1Computer = true;
  	var game = BoardGame.getInstance( "Computer");
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
			if( playComputerMove( game ) ){
				console.log( "Someone has won" );
			}
		}
		enableGame();
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
			updateGameBoard( game, position, false );

			//update cache
			if( game.checkForGameOver( position, false ) ) {
				console.log( "Someone has won");
				resetGame();
			}
			else {
				// trigger computer move
				if( playComputerMove( game ) ){
					console.log( "Someone has won" );
					resetGame();
				}
			}
		}
	});
});