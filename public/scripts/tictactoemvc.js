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
		playerPosition	   : "",

		init : function ( player1, player2 ) {
			var computer = this;
			if( player1 === playerType.COMPUTER ) {
				computer.playerPosition = player.PLAYER1;
			}
			else if( player2 === playerType.COMPUTER ){
				computer.playerPosition = player.PLAYER2;	
			}
		},

		isPlayer1 : function () {
			var computer = this;
			return computer.playerPosition === player.PLAYER1;
		},

		validCounter : function ( aCounter ) {
			return aCounter === counter.X || aCounter === counter.O;
		},

		generateComputerMove : function ( board, currentCounter ) {
			var computer = this;
			return computer.validCounter( currentCounter ) ? minimax( board, playerType.COMPUTER, currentCounter ) : -1;
		},
		
	};

	// The board MODEL in the MVC
	var boardGameModel = {
		player1Type    : "",
		player2Type    : "",
		currentPlayer  : player.PLAYER1, // start with player1
		playCount      : 0,
		board : [ 0, 1, 2, 3, 4, 5, 6, 7, 8],

		winningPositions : [ [0,1,2],[0,4,8],[0,3,6],[1,4,7], [2,5,8],[2,4,6],[3,4,5],[6,7,8] ],

		init: function ( player1, player2 ){
			var board = this;
			if( player1 !== undefined ){
				board.player1Type = ( player1 === playerType.COMPUTER )? playerType.COMPUTER : playerType.HUMAN ;
				board.player2Type = ( player2 === playerType.COMPUTER )? playerType.COMPUTER : playerType.HUMAN ;
			}
		},

		resetGame: function() {
			var board = this;
			board.player1Type = "";
			board.player2Type = "";
			board.currentPlayer = player.PLAYER1;
			board.playCount = 0;
			board.board = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
		},

		gameMode: function () {
			var board = this;
			if( board.player1Type === playerType.HUMAN ) {
				if( board.player2Type === playerType.HUMAN) {
					return gameMode.HVH;
				}
				else if( board.player2Type === playerType.COMPUTER ) {
					return gameMode.HVC;
				}
			}
			else {
				if( board.player2Type === playerType.HUMAN) {
					return gameMode.HVC;
				}
				else if( board.player2Type === playerType.COMPUTER ) {
					return gameMode.CVC;
				}
			}
		},

		isPositionEmpty: function ( position ) {
			var board = this;
			return ( board.board[ position ] === counter.X || board.board[ position ] === counter.O ) ? false : true;
		},

		updateBoard: function ( position, counter ) {
			var board = this;
			board.board[ position ] = counter;
		},

		incPlayCount: function () {
			var board = this;
			return this.playCount++;
		},

		switchCurrentPlayer: function () {
			var board = this;
			board.currentPlayer = board.currentPlayer === undefined ? player.PLAYER1 : (board.currentPlayer === player.PLAYER1 ) ? player.PLAYER2 : player.PLAYER1;
			return board.currentPlayer;
		},

		found: function ( counter, position ){
			var board = this;
			return board.board[ position ] === counter;
		},

		playMove : function ( position ) {
			var board = this;
			board.updateBoard( position, board.getCounter() );
			board.switchCurrentPlayer();
			board.incPlayCount();
			return board;
		},

		getCounter : function (){
			var board = this;
			return board.currentPlayer ? (board.currentPlayer === player.PLAYER1 ? counter.X : counter.O) : counter.X;
		},

		found3InARow: function ( counter ) {
			var board = this;
			var results = board.winningPositions.filter( function( element ) {
				return element.every( function( e ){
					return this.found( counter, e );
				},board);
			},board);

			if( results.length ) {
				alert( counter + ' has won the game. Start a new game');
				return true;
			}
			return false; 
		},

		isGameOver : function () {
			var board = this;
			if( board.playCount < 3) {
				return false;
			}
			if( board.playCount === 9 ) {
				alert(  "It's a DRAW!! Start a new game");
				return true;
			}
			if ( board.found3InARow( counter.X ) || board.found3InARow( counter.O ) ) {
				return true;
			}
			return false;
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
				var view = this;
				gameController.newUserMove( romans.indexOf( $(view).attr('id') ) );
			});

		},

		renderNewGame: function ( player1Type, player2Type ) {
			$("#p1Text").text( "Player1: " + player1Type );
			$("#p2Text").text( "Player2: " + player2Type );
			$("#playerselect").hide();
			$("#stateofplay").show();
		},

		resetGame: function () {
			var view = this;
			var p1Text, p2Text, fields;
			view.disableBoard();
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
			var view = this;
			view.setDisable( false );
		},

		disableBoard : function () {
			var view = this;
			view.setDisable( true );
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

		startGame : function ( player1, player2) {
			var controller = this;
			boardGameModel.init( player1, player2 );
			computerPlayerModel.init( player1, player2 );
			gameView.renderNewGame( player1, player2 );
			computerPlayerModel.isPlayer1() ? controller.computerGame() : gameView.enableBoard();
		},

		resetGame : function () {
			boardGameModel.resetGame();
			gameView.resetGame();
		},

		playMove : function ( position ) {
			gameView.updateBoard( boardGameModel.getCounter(), position );
			return boardGameModel.playMove( position );
		},

		computerGame : function () {
			var controller = this;
			setTimeout( function() { 
				if( controller.playComputerMove().isGameOver() ) {
					controller.gameOver();
				}
				else if( boardGameModel.gameMode() === gameMode.CVC ){
					controller.computerGame();
				}
				else {
					gameView.enableBoard();
				}
			}, 1000 ); 
		},

		playComputerMove : function () {
			var controller = this;
			return controller.playMove( computerPlayerModel.generateComputerMove( boardGameModel.board, boardGameModel.getCounter() ) );	
		},

		gameOver : function () {
			gameView.resetGame();
			boardGameModel.resetGame();
		},

		newUserMove : function ( position ) {
			var controller = this;
			var computersNextMove = -1;
			var mode, result;
			if( boardGameModel.isPositionEmpty( position ) ) {
				if( controller.playMove( position ).isGameOver() ) {
					controller.gameOver();
				}
				else if( boardGameModel.gameMode() === gameMode.HVC ){
					gameView.disableBoard();
					controller.computerGame();
				}
			}
		}
	};
	// this is needed for Qunit testing
	window.boardGameModel = boardGameModel;
	window.gameView = gameView;
	window.gameController = gameController;
	// window.computerPlayerModel = computerPlayerModel;
	gameController.init();
})();

window.minimax = minimax;
