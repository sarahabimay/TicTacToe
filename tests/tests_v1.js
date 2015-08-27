test( "check model, view, controller objects exist" , function( assert) {
	ok( boardGameModel, "Found board model" );
	ok( gameView, "Found game view" );
	ok( gameController, "Found controller" );
});

module( "testing initialization and game reset")
test( "check the board has been reset and is 'empty'", function( assert ) {
	gameController.init();
	ok( boardGameModel.board, "Found board model's board array" );
	deepEqual( boardGameModel.board, [0,1,2,3,4,5,6,7,8], "after initialization board should have been reset");
	deepEqual( boardGameModel.playCount, 0, "after initialization board model playcount should be 0");
	// view should be uninitialized e.g. no player selected
	var playerText = $("#p1Text").text().trim();
	deepEqual( playerText, "Player1:", "Player1 field should be blank" );
	playerText = $("#p2Text").text().trim();
	deepEqual( playerText, "Player2:", "Player2 field should be blank" );
});

test( "board model state is correct for human v computer game", function( assert ) {
	boardGameModel.init( "Human", "Computer" );
	equal( boardGameModel.player1Type, "Human", "model player1Type is Human");
	equal( boardGameModel.player2Type, "Computer", "model player1Type is Computer" );
});

test( "view state is correct for human v computer game", function( assert ) {
	gameView.renderNewGame("Human", "Computer" );
	var playerText = $("#p1Text").text().trim();
	deepEqual( playerText, "Player1: Human", "Player1 field should be Human" );
	playerText = $("#p2Text").text().trim();
	deepEqual( playerText, "Player2: Computer", "Player2 field should be COoputer" );
	// notOk( boardGameModel.player1Type === "Computer", "Player 1 is NOT the computer" );
	// ok( boardGameModel.player2Type === "Computer", "Player 2 is the computer" );
});
test( "board model state is correct for human v human game", function( assert ) {
	boardGameModel.init( "Human", "Human" );
	equal( boardGameModel.player1Type, "Human", "model player1Type is Human");
	equal( boardGameModel.player2Type, "Human", "model player1Type is Human");
});
test( "view state is correct for human v human game", function( assert ) {
	gameView.renderNewGame("Human", "Human" );
	var playerText = $("#p1Text").text().trim();
	deepEqual( playerText, "Player1: Human", "Player1 field should be Human" );
	playerText = $("#p2Text").text().trim();
	deepEqual( playerText, "Player2: Human", "Player2 field should be Human" );
});

test( "computer model is created for Human v Computer game", function( assert ) {
	computerPlayerModel.init( "Human", "Computer" );
	ok( computerPlayerModel.isComputerPlaying(), "A computer player should be in the game" );
	notOk( computerPlayerModel.isPlayer1(), "Player1 is NOT the computer" );
	ok( computerPlayerModel.player2IsComputer, "Player 2 is the computer" );
});

test( "computer model is created for Computer v Computer game", function( assert ) {
	computerPlayerModel.init( "Computer", "Computer" );
	ok( computerPlayerModel.isComputerPlaying(), "A computer player should be in the game" );
	ok( computerPlayerModel.isPlayer1(), "Player1 is a computer" );
	ok( computerPlayerModel.player2IsComputer, "Player 2 is also a computer" );

});
test( "start over button reset's the board, computer model and the view", function( assert ) {
	gameController.resetGame();
	deepEqual( boardGameModel.board, [0,1,2,3,4,5,6,7,8], "board reset so should be empty");
	notOk( computerPlayerModel.isComputerPlaying(), "computer should not be playing once reset" );
	var playerText = $("#p1Text").text().trim();
	deepEqual( playerText, "Player1:", "Player1 field should be blank" );
	playerText = $("#p2Text").text().trim();
	deepEqual( playerText, "Player2:", "Player2 field should be blank" );
	// check view  such that stateofplay has style='display: none'
	// check players model such that they are undefined 
});

module( "test boardGameModel helper functions");
test( "Human v Human game has mode HVH", function ( assert ) {
	boardGameModel.init( "Human", "Human" );
	equal( boardGameModel.gameMode(), "HvH", "GameMode should be HvH");
});
test( "Human v Computer game has mode HVC", function ( assert ) {
boardGameModel.init( "Human", "Computer" );
	equal( boardGameModel.gameMode(), "HvC", "GameMode should be HvC");
});
test( "Computer v Human game has mode HVC", function ( assert ) {
boardGameModel.init( "Computer", "Human" );
	equal( boardGameModel.gameMode(), "HvC", "GameMode should be HvC");
});
test( "Computer v Computer game has mode CVC", function ( assert ) {
	boardGameModel.init( "Computer", "Computer" );
	equal( boardGameModel.gameMode(), "CvC", "GameMode should be CvC");
});

test( "board has been updated correctly after move", function ( assert ) {
	boardGameModel.init( "Human", "Human" );
	boardGameModel.updateBoard( 0, "X" );
	deepEqual( boardGameModel.board, ["X",1,2,3,4,5,6,7,8], "X counter in position 0");
});
test( "isPositionEmpty() returns true if counter is already there", function ( assert ) {
	boardGameModel.init( "Human", "Human" );
	boardGameModel.updateBoard( 0, "X" );
	notOk( boardGameModel.isPositionEmpty( 0 ), "Position 0 already filled" );
});
test( "found3InARow finds a win", function (asset) {
	boardGameModel.init( "Human", "Human" );
	boardGameModel.updateBoard( 0, "X" );
	boardGameModel.updateBoard( 4, "X" );
	boardGameModel.updateBoard( 8, "X" );
	ok( boardGameModel.found3InARow( "X"), "Found a win for X");

});
module( "test computerPlayerModel::generateComputerMove with game scenario 1");
test( "next game starting with 4 moves", function( assert ) { 
	var board = [ 0 ,1,"X","X",4,5,6,"O","O"];
	var counter = "X";
	var nextPosition = computerPlayerModel.generateComputerMove( board, "X" );
	equal( nextPosition, 6, "result should be position 6");
});
test( "next game starting with 6 moves", function( assert ) { 
	var board = [ "O" ,1,"X","X",4,5,"X","O","O"];
	var nextPosition = computerPlayerModel.generateComputerMove( board, "X" );
	equal( nextPosition, 4, "result should be position 4");
});

module( "test minimax game scenario 2");
test( "next game starting with 1 move", function( assert ) { 
	var board = [ 0 ,1, 2, 3, 4, 5, 6, 7, "X" ];
	var nextPosition = minimax( board, "Computer", "O" );
	equal( nextPosition, 4, "result should be position 4");
});
test( "next game starting with 3 moves", function( assert ) { 
	var board = [ "X" ,1, 2, 3, "O", 5, 6, 7, "X" ];
	var nextPosition = minimax( board, "Computer", "O" );
	equal( nextPosition, 1, "result should be position 1");
});
test( "next game starting with 5 moves", function( assert ) { 
	var board = [ "X" ,"O", 2, 3, "O", 5, 6, "X", "X" ];
	var nextPosition = minimax( board, "Computer", "O" );
	equal( nextPosition, 6, "result should be position 6");
});
test( "next game starting with 7 moves", function( assert ) { 
	var board = [ "X" ,"O", "X", 3, "O", 5, "O", "X", "X" ];
	var nextPosition = minimax( board, "Computer", "O" );
	equal( nextPosition, 5, "result should be position 5");
});

module( "test minimax game scenario 3");
test( "next game starting with 3 moves", function( assert ) { 
	var board = [ 0 ,1, "X", 3, "O", 5, 6, 7, "X" ];
	var nextPosition = minimax( board, "Computer", "O" );
	equal( nextPosition, 5, "result should be position 5 to block X win");
});
test( "user makes a mistake and computer should be able to win", function( assert ) { 
	var board = [ 0 ,1, "X", 3, "O", "O", "X", 7, "X" ];
	var nextPosition = minimax( board, "Computer", "O" );
	equal( nextPosition, 3, "result should be position 3 to win");
});


// opponent goes first
// module( "test computer prolongs play by choosing the longest win or draw game" );
// test( "test minimax returns the position which will prolong the game", function( assert) {
// 	var board = [ 0 ,"X", 2, 3, 4, "X", "O", "O", "X" ];
// 	var nextPosition = minimax( board, "Computer", "X" );
// 	equal( nextPosition, 2, "result should be position 2 to tie");
// });

// test( "temp test", function( assert) {
// 	var board = [ "O", 1, 2, "O", "X", 5,6,7, "X" ];
// 	var nextPosition = minimax( board, "Computer", "X" );
// 	equal( nextPosition, 6, "result should be position 6 to win");
// });
// computer starting in center and opponent plays perfectly then this is a way to tie
module( "test minimax game scenario 4.1");
test( "computer center start and opponent ties", function( assert ) { 
	var board = [ 0 ,1, 2, 3, "X", 5, "O", 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 0, "result should be position 0 to tie");
});
// computer starting in center and opponent plays perfectly then this is a way to tie
module( "test minimax game scenario 4.1");
test( "computer center start and opponent top left corner", function( assert ) { 
	var board = [ "O" ,1, "X", 3, "X", 5, "O", 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 3, "result should be position 3 to tie");
});

// if opponent plays perfectly, starting in center, then this is the only way computer can tie
module( "test minimax game scenario 4 but computer as player2 ");
test( "opp center start and computer take corner", function( assert ) { 
	var board = [ 0 ,1, 2, 3, "X", 5, 6, 7, 8 ];
	var nextPosition = minimax( board, "Computer", "O" );
	equal( nextPosition, 0, "result should be position 0 to tie");
});
test( "opponent takes corner and computer takes corner", function( assert ) { 
	var board = [ "O" ,1, 2, 3, "X", 5, 6, 7, "X" ];
	var nextPosition = minimax( board, "Computer", "O" );
	equal( nextPosition, 2, "result should be position 2 to tie");
});
test( "opponent blocks computer and then so does computer", function( assert ) { 
	var board = [ "O", "X", "O", 3, "X", 5, 6, 7, "X" ];
	var nextPosition = minimax( board, "Computer", "O" );
	equal( nextPosition, 7, "result should be position 7 to tie");
});

module( "test minimax - computer starting in center - 5.1");
test( "computer starting in center", function( assert ) { 
	var board = [ 0 ,1, 2, "O", "X", 5, 6, 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 8, "result should be position 8 to win");
});
test( "computer takes top edge", function( assert ) { 
	var board = [ "O" ,1, 2, "O", "X", 5, 6, 7, "X" ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 6, "result should be position 6 with two ways to win");
});

module( "test minimax -computer starting in center - 5.2");
test( "opp on edge, comp should win", function( assert ) { 
	var board = [ 0 ,1, 2, "O", "X", 5, 6, 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 8, "result should be position 8 to win");
});
test( "opp on edge, comp should win", function( assert ) { 
	var board = [ "O" ,1, 2, "O", "X", 5, 6, "O", "X" ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 6, "result should be position 6 to win");
});
module( "test minimax -computer starting in center - 5.3");
test( "computer takes top edge to win", function( assert ) { 
	var board = [ "X" ,1, 2, "O", "X", 5, 6, 7, "O" ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 2, "result should be position 2 to win");
});

module( "test minimax - computer starting on corner, opp takes nearest edge - 6.1");
test( "computer takes top left corner", function( assert ) { 
	var board = [ "X" ,1, 2, "O", 4, 5, 6, 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 4, "result should be position 4 to win");
});

module( "test minimax - computer starting on corner, opp takes nearest edge - 6.2");
test( "computer takes bottom right corner", function( assert ) { 
	var board = [ 0 ,1, 2, "O", 4, 5, "X", 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 4, "result should be position  to win");
});
test( "computer takes top right corner", function( assert ) { 
	var board = [  0 ,1, "O", "O", "X", 5, "X", 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 8, "result should be position 8 to win");
});

module( "test minimax - computer starting on corner, opp takes nearest edge - 6.3");
test( "computer takes center", function( assert ) { 
	var board = [  "X" ,"O", "X", "O", 4, 5, 6, 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 4, "result should be center position 4 to win");
});
//
module( "test minimax - computer starting on corner, opp on nearest corner - 7.1");
test( "computer takes bottom edge", function( assert ) { 
	var board = [ "O" ,1, 2, 3, 4, 5, "X", 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 7, "result should be position 7 to win");
});
test( "computer will take center", function( assert ) { 
	var board = [ "O" ,1, 2, 3, 4, 5, "X", "X", "O" ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 4, "result should be position 4 to win");
});
test( "computer will take top right corner", function( assert ) { 
	var board = [ "O" ,"O", 2, 3, 4, 5, "X", "X", "O" ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 2, "result should be position 2 to win");
});

module( "test minimax - computer starting on corner, opp on nearest corner - 7.2");
test( "computer will take top right corner", function( assert ) { 
	var board = [ "O" ,1, 2, 3, 4, 5, "X", "O", "X" ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 2, "result should be position 2 to win");
});

module( "test minimax - computer starting on corner, opp on edge in last column - 8.1");
test( "computer takes top left corner", function( assert ) { 
	var board = [ 0, 1, 2, 3, 4, "O", "X", 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 0, "result should be position 0 to win");
});
test( "computer will take center", function( assert ) { 
	var board = [ "X" ,1, 2, "O", 4, "O", "X", 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 4, "result should be position 4 to win");
});
test( "computer will take top edge", function( assert ) { 
	var board = [ "X" ,1, "O", "O", 4, "O", "X", 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 8, "result should be position 8 to win");
});

module( "test minimax - computer starting on corner, opp on edge in last column - 8.2");
test( "computer will take center", function( assert ) { 
	var board = [ 0 ,1, 2, 3, 4, "O", "X", "O", "X" ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 4, "result should be position 4 to win");
});

module( "test minimax - computer starting on bottom left corner, opp top right corner - 9");
test( "computer takes bottom right corner", function( assert ) { 
	var board = [ 0, 1, "O", 3, 4, 5, "X", 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 8, "result should be position 8 to win");
});
test( "computer will top left corner", function( assert ) { 
	var board = [ 0 , 1, "O", 3, 4, 5, "X", "O", "X" ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 0, "result should be position 0 to win");
});

module( "test minimax - computer starting on bottom left corner, opp top row's edge position - 10");
test( "computer takes bottom right corner", function( assert ) { 
	var board = [ 0, "O", 2, 3, 4, 5, "X", 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 8, "result should be position 8 to win");
});
test( "computer will take centre", function( assert ) { 
	var board = [ 0 , "O", 2, 3, 4, 5, "X", "O", "X" ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 4, "result should be position 4 to win");
});

// if opponent plays less than perfectly..
//, comp takes top right corner and opp takes top left corner 
module( "test minimax - computer starting on bottom left corner, opp takes center - 11.1");
test( "computer takes bottom right corner", function( assert ) { 
	var board = [ "O", 1, "X", 3, "O", 5, "X", 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 8, "result should be position 2 to win");
});
test( "computer takes top edge", function( assert ) { 
	var board = [ "O", 1, "X", 3, "O", 5, "X", "O", "X" ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 5, "result should be position 5 to win");
});
// however, there's a chance the opp won't play perfectly so we should choose position 2 as then there is a
// chance for a win or a tie.  but this doesn't happen.  find out why
module( "test minimax - computer starts on corner and opp takes center - 11.2");
test( "computer takes top right corner", function( assert ) { 
	var board = [ 0, 1, 2, 3, "O", 5, "X", 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 0, "result should be position 0 to tie");
});
test( "computer takes top right corner", function( assert ) { 
	var board = [ "X", 1, 2, "O", "O", 5, "X", 7, 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 5, "result should be position 5 to tie");
});

module( "test minimax - computer starting on bottom left corner, opp takes center - 12");
test( "opp takes bottom row edge so computer can only block and then tie", function( assert ) { 
	var board = [ 0, 1, "X", 3, "O", 5, "X", "O", 8 ];
	var nextPosition = minimax( board, "Computer", "X" );
	equal( nextPosition, 1, "result should be position 1 to tie");
});
module( "test minimax - opponent starts on a corner - 13");
test( "computer takes center", function( assert ) { 
	var board = [ 0, 1, 2, 3, 4, 5, "X", 7, 8 ];
	var nextPosition = minimax( board, "Computer", "O" );
	equal( nextPosition, 4, "result should be position 4 to tie");
});
test( "opp takes top right corner and computer takes bottom row edge", function( assert ) { 
	var board = [ 0, 1, "X", 3, "O", 5, "X", 7, 8 ];
	var nextPosition = minimax( board, "Computer", "O" );
	equal( nextPosition, 1, "result should be position 1 to tie");
});
test( "opp takes top right corner and computer takes bottom row edge", function( assert ) { 
	var board = [ 0, "O", "X", 3, "O", 5, "X", "X", 8 ];
	var nextPosition = minimax( board, "Computer", "O" );
	equal( nextPosition, 8, "result should be position 8 to tie");
});

module( "test minimax - 14");
test( "computer blocks", function( assert ) { 
	var board = [ "X", 1, "O", "X", 4, 5, 6, 7, 8 ];
	var nextPosition = minimax( board, "Computer", "O" );
	equal( nextPosition, 6, "result should be position 6 to tie");
});
