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
			if( player1 !== undefined ){
				this.player1Type = ( player1 === playerType.COMPUTER )? playerType.COMPUTER : playerType.HUMAN ;
				this.player2Type = ( player2 === playerType.COMPUTER )? playerType.COMPUTER : playerType.HUMAN ;
			}
		},

		isPlayer1Computer: function () {
			return this.player1Type === playerType.COMPUTER;
		},

		isValidPlayerType: function ( playerType ){
			return (playerType === playerType.COMPUTER || playerType === playerType.HUMAN );
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
		resetGame: function() {
			this.player1Type = "";
			this.player2Type = "";
			this.currentPlayer = player.PLAYER1;
			this.playCount = 0;
			this.board = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
		},

		isPositionEmpty: function ( position ) {
			return ( this.board[ position ] === counter.X || this.board[ position ] === counter.O ) ? false : true;
		},

		updateBoard: function ( position, counter ) {
			this.board[ position ] = counter;
		},

		getCounter: function (){
			return this.currentPlayer ? (this.currentPlayer === player.PLAYER1 ? counter.X : counter.O) : counter.X;
		},

		getOpponentsCounter: function () {
			return this.getCounter() === counter.X ? counter.O : counter.X;
		},

		findPlayerPositions: function ( counter ) {
			return this.board.filterIndex( function( element, index ) {
				return element === counter;
			});
		},

		incPlayCount: function () {
			return this.playCount++;
		},

		switchCurrentPlayer: function () {
			this.currentPlayer = this.currentPlayer === undefined ? player.PLAYER1 : (this.currentPlayer === player.PLAYER1 ) ? player.PLAYER2 : player.PLAYER1;
			return this.currentPlayer;
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
			var position = -1;
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

		found: function ( counter, position ){
			return this.board[ position ] === counter;
		},

		getNextPosition: function (){
			// Get a Computer player's next move.
			// The Computer should win or draw but never lose.
			var position = -1;

			position = minimax( this.board, playerType.COMPUTER, this.getCounter() );
	
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

		startGame: function ( player1, player2) {

			boardGameModel.init( player1, player2 );
			// player1 and player2 model: ??

			gameView.renderNewGame( player1, player2 );
			// if( player1Model.isComputer() ) ...
			boardGameModel.isPlayer1Computer() ? this.computerGame() : gameView.enableBoard();
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
			return this.playMove( boardGameModel.generateComputerMove() );	
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
	window.boardGameModel = boardGameModel;
	window.gameView = gameView;
	window.gameController = gameController;
	gameController.init();
})();

window.minimax = minimax;
