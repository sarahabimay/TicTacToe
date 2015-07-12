$(function() {

	var boardGameModel = {
		isPlayer1      : player1,
		player1Type    : player1,
		player2Type    : player2,
		currentPlayer  : "player1", // start with undefined player
		playCount      : 0,
		board : [ 0, 1, 2, 3, 4, 5, 6, 7, 8],
		// the 'winningPositions' array represents all of the ways to win based on your starting position
		// =>e.g. [0] starting position has 3 possible ways to win: (0,1,2), (0,4,8), (0,3,6),
		// =>e.g. [1] starting positon has 2 possible ways to win: (1,4, 7), (1,0,2), etc..
		winningPositions : [ [[1,2],[4,8],[3,6]], [[0,2],[4,7]], [[1,0],[5,8],[4,6]], [[0,6],[4,5]], [[3,5],[1,7],[0,8],[2,6]],
		             [[2,8],[3,4]], [[0,3],[2,4],[7,8]], [[6,8],[1,4]], [[6,7],[2,5],[0,4]]],

		init: function( player1, player2 ){
			isPlayer1 = player1;
			player1Type=player1;
			player2Type=player2;
			currentPlayer = "player1"; // start with undefined player
			playCount = 0;
			board = [ 0, 1, 2, 3, 4, 5, 6, 7, 8];
		},

		playerType: function ( isPlayer1 ){
			// return the 'name' of player1 if isPlayer1 is true, else return 'name' of player2.
	  	return isPlayer1 ? player1Type : player2Type;
		},

		gameMode: function () {
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
		},
		resetGame: function() {
			// reset private variables when a new game begins
			isPlayer1 = "";
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

		////////////////////////////////////////////////////////////////////////////////////////////////////////
	  //////// playMove fn is used to play a computer move  //////////////////////////////////////////////////
	  ////////////////////////////////////////////////////////////////////////////////////////////////////////
	  playMove : function ( position, isComputer ) {
	  	this.updateBoard( position, this.getCounter() );
	  	this.switchCurrentPlayer();
	  	this.incPlayCount();
	  	return this;
	  },

	  ////////////////////////////////////////////////////////////////////////////////////////////////////////
	  //////// checkForGameOver - checks if either player has won or if there is a draw //////////////////////
	  ////////////////////////////////////////////////////////////////////////////////////////////////////////
		checkForGameOver : function () {
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

		renderNewGame: function ( gameMode, player1Type, player2Type ) {
			$("#p1Text").text( "Player1: " + player1Type );
			$("#p2Text").text( "Player2: " + player2Type );
			$("#playerselect").hide();
			$("#stateofplay").show();
			if( gameMode === "HvH" || gameMode === "HvC" ){
				this.setDisable( false );
			}
		},

		resetGame: function () {
			var p1Text, p2Text, fields;
			this.setDisable( true );
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
			boardGameModel.init( player1, player2 );
			var gameMode = boardGameModel.gameMode();
			gameView.renderNewGame( gameMode, boardGameModel.playerType( true ), boardGameModel.playerType(false) );
		},

		resetGame: function () {
			boardGameModel.resetGame();
			gameView.resetGame();
		},

		newUserMove: function ( position ) {
			
			if( boardGameModel.isPositionEmpty( position ) ) {
				gameView.updateBoard( boardGameModel.getCounter(), position );
				if( boardGameModel.playMove( position, false ).checkForGameOver() ) {
					gameView.resetGame();
					boardGameModel.resetGame();
				}
			}
		}

	};
	gameController.init();
});

$(document).ready (function () {
	
});