
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
    return {

      // Public methods and variables
      isPlayer1Computer : function() {
      	return isPlayer1Computer();
      },
      resetGame : function(){
      	that.newGame();
      	console.log( "isPlayer1: " + isPlayer1);
      	console.log( "board: " + board);
      },
      updatePlayCount : function (){
      	return incPlayCount();
      },
      updateBoardWithMove : function( position, counter ) {
      	updateBoard( position, counter );
      },
      getCounter : function( isComputer ){
				if( isComputer ) {
					return isPlayer1Computer() ? "X" : "O";
				}
				else {
					return isPlayer1Computer() ? "O" : "X";
				}
			},
      isPositionEmpty : function ( position ) {
				if( board[ position ] === "X" || board[ position ] === "Y" ){
					return false;
				}
				return true;
			},

			getUnfilledPositions : function (){
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

function updateGameBoard ( position, counter ){
	var field = $( "#" + domStuff.romans[ position ] );
	$( ".gameboard" ).find( field ).text( counter );
	$( ".gameboard" ).find( field ).attr( "disabled", true );
}

function playComputerMove( game, position ) {
	// The html game board has id's which are numbered 1 to 9 in roman numerals so I'm going to need
	// to map romans to numbers
	// This function will place an X or O on the button element with id equivalent to 'position'.
	// We also need to 'cache' the position in the global (for now) 'board' array to keep track of what spaces are still free.  
	// This is just a global var for now and will only be changed in this function or when the game is restarted.
	
	// update cache
	var counter = game.getCounter( true );
	game.updateBoardWithMove( position - 1, counter);

	// update DOM
	updateGameBoard( position -1, counter );
}
function badChoice( position ) {
	// if x and y are found in the badChoices list then return true
	var badChoices = [ 2, 4, 6, 8 ];
	
	var isBad = badChoices.indexOf( position ) !== -1;
	console.log( isBad ? "Bad Choice" : "Good Choice");
	return isBad;
}

function generateComputerOpeningMove (game) {
	// Board array is like this: [  1, 2, 3, 4, 5, 6, 7, 8, 9 ];
	// Where 1 is the top, left corner on the tictactoe board, 3 is top, right corner etc..
	// Player1 is 'X'
	
	// The first time this function is called xpos and ypos will be undefined and the function
	// will randomly choose a position.
	// We want the computer to always win or draw so we should only use center or edge positions.
	// In order to ensure this, the function badChoices will tell us if a 'bad' choice (or non-edge or non-center)
	// position has been generated.  If so then recursively generate another y position and test with badChoice again.
	var unfilledPositions = game.getUnfilledPositions();
	position = unfilledPositions[Math.floor(Math.random() * unfilledPositions.length)];
	
	console.log( "position: " + position );
  return ( badChoice( position )) ? generateComputerOpeningMove (game) : position;
}
function generateComputerPlay ( game ) {
	// Board array is like this: [  1, 2, 3, 4, 5, 6, 7, 8, 9 ];
	// Where 1 is the top, left corner on the tictactoe board, 3 is top, right corner etc..

	// Check if computer is player1 e.g. X or player2 e.g. O
	// Randomly pick a position on the board.
	// If the position is one of the 'bad' choices then choose another position
	var unfilledPositions = game.getUnfilledPositions();
	// if( unfilledPosition.length === )
	position = unfilledPositions[Math.floor(Math.random() * unfilledPositions.length)];

  return ( badChoice( position )) ? generateComputerPlay(game) : position;
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
		var openingMove = [];
		var game = BoardGame.getInstance();

		var p1Text = "Player1: " + ( game.isPlayer1Computer() ? "Computer" : "You");
		var p2Text = "Player2: " + ( game.isPlayer1Computer() ? "You" : "Computer");
		$("#p1Text").text( p1Text );
		$("#p2Text").text( p2Text );
		$('#readyModal').modal('hide');
		$("#playerselect").hide();
		$("#stateofplay").show();

		if( game.isPlayer1Computer() ) {
			openingMove = generateComputerOpeningMove(game);
			console.log( "Generate opening move: " + openingMove);
			playComputerMove( game, openingMove );
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
			//update cache
			var counter = game.getCounter( false );
			game.updateBoardWithMove( position, counter);
			// update DOM
			updateGameBoard( position, counter );
		}
	});
});