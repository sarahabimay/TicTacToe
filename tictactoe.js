// helper functions to keep code d.r.y.
var isPlayer1Computer;
// var board = [ [0,0,0], [0,0,0], [0,0,0] ];
var board = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
var romans = [ "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"];
var gameOn = false;

function resetGame (){
	isPlayer1Computer = undefined;
	// board = [ [0,0,0], [0,0,0], [0,0,0] ];
	board = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
	var fields = $( ".field" );
	$( ".gameboard" ).find( fields ).text( "-" );
	var p1Text = "Player1: ";
	var p2Text = "Player2: ";
	$("#p1Text").text( p1Text );
	$("#p2Text").text( p2Text );
	$("#stateofplay").hide();
	$("#playerselect").show();
}
function getUnfilledPositions(){
	var fieldsWithoutXorO = board.filter( function( value, index) {
		return ( value === "X" || value === "O" ) ? false : true;
	});
	console.log( 'Unfilled Positions: ' + fieldsWithoutXorO );
	return fieldsWithoutXorO;
}
function playComputerMove( position ) {
	// The html game board has id's which are numbered 1 to 9 in roman numerals so I'm going to need
	// to map romans to numbers
	// This function will place an X or O on the button element with id equivalent to 'position'.
	// We also need to 'cache' the position in the global (for now) 'board' array to keep track of what spaces are still free.  
	// This is just a global var for now and will only be changed in this function or when the game is restarted.
	var counter = isPlayer1Computer ? "X" : "O";
	board[ position - 1 ] = counter;

	// update DOM
	var field = $( "#" + romans[ position - 1] );
	$( ".gameboard" ).find( field ).text( counter );
}
function badChoice( position ) {
	// if x and y are found in the badChoices list then return true
	// var badChoices = [ [1],[0,2], [1]];
	var badChoices = [ 2, 4, 6, 8 ];
	// var yBasedOnX = badChoices[ xpos ];
	// var isBad = yBasedOnX.indexOf( ypos ) !== -1;
	var isBad = badChoices.indexOf( position ) !== -1;
	console.log( isBad ? "Bad Choice" : "Good Choice");
	return isBad;
}

function generateComputerOpeningMove (position) {
	// Board array is like this: [  1, 2, 3, 4, 5, 6, 7, 8, 9 ];
	// Where 1 is the top, left corner on the tictactoe board, 3 is top, right corner etc..
	// Player1 is 'X'
	
	// The first time this function is called xpos and ypos will be undefined and the function
	// will randomly choose an x and y position.
	// We want the computer to always win or draw so we should only use center or edge positions.
	// In order to ensure this, the function badChoices will tell us if a 'bad' choice (or non-edge or non-center)
	// position has been generated.  If so then recursively generate another y position and test with badChoice again.
	var unfilledPositions = getUnfilledPositions();
	// if( position === undefined ) {
		// position = Math.floor((Math.random() * 9) + 1);
	position = unfilledPositions[Math.floor(Math.random() * unfilledPositions.length)];
		// ypos = Math.floor((Math.random() * 9) + 1);
	// }
	// else {
	// 	// Must have been recursively called because of a bad choice of position,
	// 	// so reset y value only till a good position is found.
	// 	// This should at most take only 2 more tries.
	// 	// position = Math.floor((Math.random() * 9) + 1);
	// 	position = unfilledPositions[Math.floor(Math.random() * unfilledPositions.length)];
	// }

	// var bad = [xpos, ypos].filter( badChoice );
	// if( bad ) 
	console.log( "position: " + position );
  return ( badChoice( position )) ? generateComputerOpeningMove (position) : position;
}
function generateComputerPlay ( xpos, ypos ) {
	// Board array is like this: [ [0,0,0], [0,0,0], [0,0,0] ];
	// Where [0,0] is the top, left position on the tictactoe board

	// check if computer is player1 e.g. X or player2 e.g. O
	// Randomly pick an x and y position on the board.
	// If the (x,y) position is one of the 'bad' choices then choose another y position
	var xyChoices = [0, 1, 2];
	if( xpos === undefined && ypos === undefined ) {
		xpos = Math.floor((Math.random() * 2) + 1);
		ypos = Math.floor((Math.random() * 2) + 1);
	}
	else {
		// Must have been recursively called because of a bad choice of position,
		// so reset y value only till a good position is found.
		// This should at most take only 2 more tries.

		ypos = Math.floor((Math.random() * 2) + 1);
	}

	// var bad = [xpos, ypos].filter( badChoice );
	// if( bad ) 
	console.log( "x and y positions: " + xpos + ", " + ypos );
  return ( badChoice( xpos, ypos )) ? generateComputerOpeningMove (xpos, ypos) : [xpos, ypos];
}
$(document).ready (function(){
	
	$("#player1").click (function(){
		isPlayer1Computer = false;
		$('#readyModal').modal('show');
  });

  $("#player2").click (function(){
  	isPlayer1Computer = true;
		$('#readyModal').modal('show');
  });

	$(".readytoplay").click (function() {
		var openingMove = [];
		var p1Text = "Player1: " + ( isPlayer1Computer ? "Computer" : "You");
		var p2Text = "Player2: " + ( isPlayer1Computer ? "You" : "Computer");
		$("#p1Text").text( p1Text );
		$("#p2Text").text( p2Text );
		$('#readyModal').modal('hide');
		$("#playerselect").hide();
		$("#stateofplay").show();

		if( isPlayer1Computer ) {
			openingMove = generateComputerOpeningMove();
			console.log( "Generate opening move: " + openingMove);
			playComputerMove( openingMove );
		}
	});

	$(".notreadytoplay").click (function() {
		$('#readyModal').modal('hide');
		resetGame();
	});

	$("#reset").click (function() {
		resetGame();
	});

	// user game play:
	$(".fields").click (function(){

	});
});