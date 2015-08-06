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

$(function() {
	var gameMode = {
		HVC : "HvC",
		HVH : "HvH",
		CVC : "CvC"
	};
	var playerType = {
		COMPUTER : "Computer",
		HUMAN : "Human",
	};
	// The computer player MODEL in the MVC
	var computerPlayerModel = {
		
	};
	// The board MODEL in the MVC
	var boardGameModel = {
		player1Type    : "",
		player2Type    : "",
		currentPlayer  : "player1", // start with player1
		playCount      : 0,
		board : [ 0, 1, 2, 3, 4, 5, 6, 7, 8],
		// the 'winningPositions' array represents all of the ways to win based on your starting position
		// =>e.g. [0] starting position has 3 possible ways to win: (0,1,2), (0,4,8), (0,3,6),
		// =>e.g. [1] starting positon has 2 possible ways to win: (1,4, 7), (1,0,2), etc..
		winningPositions : [[[1,2],[4,8],[3,6]], [[0,2],[4,7]], [[1,0],[5,8],[4,6]], [[0,6],[4,5]], 
												[[3,5],[1,7],[0,8],[2,6]], [[2,8],[3,4]], [[0,3],[2,4],[7,8]], [[6,8],[1,4]], [[6,7],[2,5],[0,4]]],

		winningPositions2 : [ [0,1,2],[0,4,8],[0, 3,6], [1,0,2],[1,4,7], 
													[2,1,0],[2,5,8],[2,4,6], [3,0,6],[3,4,5], [4,3,5],[4,1,7],[4,0,8],[4,2,6],
		             					[5,2,8],[5,3,4], [6,0,3],[6,2,4],[6,7,8], [7,6,8],[7,1,4], [8,6,7],[8,2,5],[8,0,4]],		             

		init: function ( player1, player2 ){
			player1Type = ( player1 === playerType.COMPUTER )? playerType.COMPUTER : playerType.HUMAN ;
			player2Type = ( player2 === playerType.COMPUTER )? playerType.COMPUTER : playerType.HUMAN ;
			currentPlayer = "player1"; // start with undefined player
			playCount = 0;
			board = [ 0, 1, 2, 3, 4, 5, 6, 7, 8];
			// winningPositions = [ [[1,2],[4,8],[3,6]], [[0,2],[4,7]], [[1,0],[5,8],[4,6]], [[0,6],[4,5]], [[3,5],[1,7],[0,8],[2,6]],
		 //             [[2,8],[3,4]], [[0,3],[2,4],[7,8]], [[6,8],[1,4]], [[6,7],[2,5],[0,4]]];

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
			// reset private variables when a new game begins
			isPlayer1AComputer = false;
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

		getOpponentsCounter: function () {
		  	return this.getCounter() === "X" ? "O" : "X";
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

		//////////////////////////////////////////////////////////////////////////////////////////////////
		//////// functions used by 'generateComputerMove'  ///////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////////
    
  	getUnfilledSpaces: function () {
			var fieldsWithoutXorO = board.filter( function( value, index) {
				return ( value === "X" || value === "O" ) ? false : true;
			});
			return fieldsWithoutXorO;
		},

		needToCheckForUserWin: function ( counter ) {
	    	// This checks whether the user has played at least 2 moves and returns if they have.
	    	// The number of plays made is different depending on whether the User or the Computer went first.
		  	var userPlayCount = this.findCounterPositions( counter ).length;
		  	if ( userPlayCount < 2) return false;
		  	return true;
		},

		findWinningPosition: function ( counter ) {
			// Search for any possible winning scenarios for 'counter'.
			// Return the position that could block that win.
			var possibleWins = [];
			var position, possPos = -1;
			// find all of the index positions of the 'counter' element value 
			var counterIndexes = this.findCounterPositions ( counter );

			if( counterIndexes ){
				return counterIndexes.findValue( function ( element ) {
					possibleWins = this.winningPositions[element];
						return  possibleWins.findValue( function ( e ) {
							if( counterIndexes.indexOf( e[0]) >= 0 && this.isPositionEmpty( e[1] ) ){
								return e[1]; 
							}
							else if( counterIndexes.indexOf( e[1]) >= 0 && this.isPositionEmpty( e[0] ) ) {
								return e[0];
							}
							else return undefined;
						}, this );
				}, this );
			}
			return position;
		},
		
	  blockUserPosition: function () {
	  	if ( !this.needToCheckForUserWin( this.getOpponentsCounter() ) ) return -1;
	  	return this.findWinningPosition( this.getOpponentsCounter() );
	  },

	  computerWinPosition: function () {
	  	if( !this.needToCheckForUserWin( this.getCounter() ) ) return -1;
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
			return ( board[ position ] === counter ) && true;
		},

		opponentOnDiagCorners: function () {
			var oppCounter = this.getOpponentsCounter();
			var positions = this.findCounterPositions( oppCounter );
			var diagonals = [ [0,8], [2,6] ];
			return diagonals.some( function( element ) {
				if( positions.length !== element.length ) return false;

				return ( this.found( oppCounter, element[0]) && this.found( oppCounter, element[ 1 ] ) ) && true;
			}, this );
		},

		getDiagonalStrategy: function () {
			// pick any edge
			var edges = [ 1, 3, 5, 7 ];
			return edges[ Math.floor(Math.random() * edges.length) ];
		},

		getWildPosition: function ( that ) {
			// if not first play then choose center position if available otherwise use minimax algo
			var unfilledSpaces = that.getUnfilledSpaces();
  		var position = unfilledSpaces.indexOf( 4 ) >=0 ? 	4 : minimax( board, playerType.COMPUTER, that.getCounter() );
			return position;
			// If position is a 'bad' choice then recursively generate another position and test with badChoice again.
  		// return ( that.badChoice( position )) ? that.getNextPosition() : position;  
		},

		usesDiagonalStrategy: function () {
			// if opponent has marked two opposing diagonal corners and current player is in the center 
			// then this is a diagonal strategy.
			var unfilledSpaces = this.getUnfilledSpaces();
			return ( unfilledSpaces.length === 6 && this.opponentOnDiagCorners() && this.found( this.getCounter(), 4 ) ) && true;
		},

	  getStrategy: function (){
	  	// if diagonalStrategy() then return diagonalStrategy
	  	// otherwise generate a center or corner position.
	  	return ( this.usesDiagonalStrategy()) ? this.getDiagonalStrategy : this.getWildPosition;
	  },

	  getNextPosition: function (){
	  	var unfilledSpaces = this.getUnfilledSpaces(); 
	  	var position, strategy, randomIndex = -1;
	
			// if first play then choose randomly from corner or center positions
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
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
		////// generateComputerMove is used to generate a new computer move ////////////////////
	  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
		generateComputerMove : function () {
			// First, check if there is a potential win for the computer.  If so then this is the next position.
			// Finally, randomly select any remaining corner position or if there are none then select any of the 
			// remaining 'edge' positions.
			// First check if there is a position which could win the game for the computer.
			var position = this.computerWinPosition();
			if( position >= 0 && position<9 ) { return position; }
			// Then check if we need to block the other player's win.
			position = this.blockUserPosition();
			if( position >= 0 && position<9 ) { return position; } 

			return this.getNextPosition();
		},

		////////////////////////////////////////////////////////////////////////////////////////////////////////
	  //////// playMove fn is used to play a computer move  //////////////////////////////////////////////////
	  ////////////////////////////////////////////////////////////////////////////////////////////////////////
	  playMove : function ( position ) {
	  	this.updateBoard( position, this.getCounter() );
	  	this.switchCurrentPlayer();
	  	this.incPlayCount();
	  	return this;
	  },

		////////////////////////////////////////////////////////////////////////////////////////////////////
	  ///////// functions used by 'checkForGameOver'  ////////////////////////////////////////////////////
	  ////////////////////////////////////////////////////////////////////////////////////////////////////
		found3InARow: function ( counter ) {
			// this could be improved to use the 'winningPositions' array
			var positions;
			var counterIndexes = this.findCounterPositions( counter );
			for (var i = 0; i < counterIndexes.length; i++) {
				positions = this.winningPositions[ counterIndexes[ i ] ];
				for (var j = 0; j < positions.length; j++ ) {
					if ( (counterIndexes.indexOf( positions[j][0] ) >=0 && counterIndexes.indexOf( positions[j][1] ) >= 0 ) ) {
						alert( counter + ' has won the game. Start a new game');
						return true;
					}
				}
			}
		},

	  ////////////////////////////////////////////////////////////////////////////////////////////////////////
	  //////// checkForGameOver - checks if either player has won or if there is a draw //////////////////////
	  ////////////////////////////////////////////////////////////////////////////////////////////////////////
		isGameOver : function () {
	  	if( playCount < 3) {
				return false;
			}
			if( this.found3InARow( "X" ) || this.found3InARow( "O" ) ) {
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
			var computersNextMove = -1;
			boardGameModel.init( player1, player2 );
			// player1 and player2 model: ??

			gameView.renderNewGame( player1, player2 );
			// if( player1Model.isComputer() ) ...
			if( boardGameModel.isPlayer1Computer() ) {
				this.computerGameMode();
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

		computerGameMode : function () {
			if( this.computerMove().isGameOver() ) {
				this.gameOver();
			}
			else if( boardGameModel.gameMode() === gameMode.CVC ){
				this.computerGameMode();
			}
			else {
				gameView.enableBoard();
			}
		},
		computerMove : function (/*player1Model*/) {
			// generate computer move and update view with it:
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
				else{
					mode = boardGameModel.gameMode();
					if( mode === gameMode.HVC ){
						// trigger computer move
						gameView.disableBoard();
						this.computerMove().isGameOver() ? this.gameOver() : gameView.enableBoard(); 
					}
				}

			}
		}
	};

	gameController.init();
});
