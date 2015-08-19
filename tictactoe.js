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
	};
	// The board MODEL in the MVC
	var boardGameModel = {
		player1Type    : "",
		player2Type    : "",
		currentPlayer  : player.PLAYER1, // start with player1
		playCount      : 0,
		board : [ 0, 1, 2, 3, 4, 5, 6, 7, 8],

		winningPositions : [ [0,1,2],[0,4,8],[0, 3,6], [1,0,2],[1,4,7], 
													[2,1,0],[2,5,8],[2,4,6], [3,0,6],[3,4,5], [4,3,5],[4,1,7],[4,0,8],[4,2,6],
													[5,2,8],[5,3,4], [6,0,3],[6,2,4],[6,7,8], [7,6,8],[7,1,4], [8,6,7],[8,2,5],[8,0,4]],		             

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
        
        return ( foundCount.length === 1 ) ? foundCount[0] : undefined;
    	});
		},

		findWinningPosition: function ( counter ) {
			var possibleWins = [];
			var position, possPos = -1;
			var counterIndexes = this.findPlayerPositions ( counter );
			return ( counterIndexes.length <= 0 ) ? position : this.findPossibleWin( counterIndexes );
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
	
			// If first play then choose randomly from corner or center positions
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
