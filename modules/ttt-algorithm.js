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

function getInverseUser( playersTurn ) {
    return playersTurn === "Computer" ? "Human" : "Computer";
}

function getInverseCounter( counter ) {
    return counter === "X" ? "O" : "X";
}

function pointsWon( playersTurn ) {
    return playersTurn === "Computer" ? 1 : -1;
}

function getAvailableMoves( currentStateOfBoard ){
    // currentStateOfBoard = [ 0, 1, 2, 3, 4, ..8 ]
    var availableMoves = currentStateOfBoard.filter( function( e, i ) {
        return ( e !== "X" && e !== "O" ) && true;
    });
    return availableMoves;
}
function findCounterPositions ( counter, board ) {
    if( board === undefined ) console.log( "board undefined");
	return board.filterIndex( function( element, index ) {
		if( element === counter ) return true;
	});
}


function found3InARow ( counter, stateOfBoard ) {
	// this could be improved to use the 'winningPositions' array
	var positions;
		var winningPositions = [ [[1,2],[4,8],[3,6]], [[0,2],[4,7]], [[1,0],[5,8],[4,6]], [[0,6],[4,5]], [[3,5],[1,7],[0,8],[2,6]],
		             [[2,8],[3,4]], [[0,3],[2,4],[7,8]], [[6,8],[1,4]], [[6,7],[2,5],[0,4]]];
	var counterIndexes = findCounterPositions( counter, stateOfBoard );
	for (var i = 0; i < counterIndexes.length; i++) {
		positions = winningPositions[ counterIndexes[ i ] ];
		for (var j = 0; j < positions.length; j++ ) {
			if ( (counterIndexes.indexOf( positions[j][0] ) >=0 && counterIndexes.indexOf( positions[j][1] ) >= 0 ) ) {
				console.log( "!!!!!!!!!! ", counter, " IS THE WINNER!!!!!!!!!!!!");
				return true;
			}
		}
	}
}
function gameOver( stateOfBoard ) {
  
	if( found3InARow( "X", stateOfBoard ) || found3InARow( "O", stateOfBoard ) ) {
		return true;
	}
	else {
	    var availMoves = getAvailableMoves( stateOfBoard );
	   // console.log( "In gameOver: AvailableMoves: ", availMoves );
	    if ( availMoves.length === 0 ) {
		  //  console.log(  "!!!!!!!!! It's a DRAW!!!!!!!!!!!!!");
		    return true;
	    }
	    else {
	    	return false;
    	}
	}
}
function isWinner ( counter, stateOfBoard ){
    // var temp = found3InARow( counter, stateOfBoard );
    // if( temp ) console.log( "!!!!!!!!!! ", counter, " IS THE WINNER!!!!!!!!!!!!");
    return found3InARow( counter, stateOfBoard );
}

function evaluate ( counter, board ) {
  var score = 0;
  // Evaluate score for each of the 8 lines (3 rows, 3 columns, 2 diagonals)
  score += evaluateLine(counter, board, 0, 1, 2);  // row 0
  score += evaluateLine(counter, board, 3, 4, 5);  // row 1
  score += evaluateLine(counter, board, 6, 7, 8);  // row 2
  score += evaluateLine(counter, board, 0, 3, 6);  // col 0
  score += evaluateLine(counter, board, 1, 4, 7);  // col 1
  score += evaluateLine(counter, board, 2, 5, 8);  // col 2
  score += evaluateLine(counter, board, 0, 4, 8);  // diagonal
  score += evaluateLine(counter, board, 2, 4, 6);  // alternate diagonal
  return score;
}

/** The heuristic evaluation function for the given line of 3 cells
   @Return +100, +10, +1 for 3-, 2-, 1-in-a-line for computer.
           -100, -10, -1 for 3-, 2-, 1-in-a-line for opponent.
           0 otherwise */
function evaluateLine ( computerCounter, board, pos1, pos2, pos3 ) {
  var score = 0;

  // First cell
  if (board[ pos1 ] === computerCounter) {
     score = 1;
  } 
  else if (board[ pos1 ] === getInverseCounter( computerCounter ) ) {
     score = -1;
  }

  // Second cell
  if (board[ pos2 ] === computerCounter) {
     if (score === 1) {   // board[ pos1 ] is counter
        score = 10;
     } 
     else if (score === -1) {  // board[ pos1 ] is other counter
        return 0;
     } 
     else {  // board[ pos1 ] is empty
        score = 1;
     }
  } 
  else if (board[ pos2 ] === getInverseCounter( computerCounter )) {
     if (score == -1) { // board[ pos1 ] is opponent counter
        score = -10;
     } 
     else if (score === 1) { // board[ pos1 ] is counter
        return 0;
     } 
     else {  // board[ pos1 ] is empty
        score = -1;
     }
  }

  // Third cell
  if (board[ pos3 ] === computerCounter) {
     if (score > 0) {  // board[ pos1 ] and/or board[ pos2 ] is counter
        score *= 10;
     } 
     else if (score < 0) {  // board[ pos1 ] and/or board[ pos2 ] is opponent counter
        return 0;
     } 
     else {  // board[ pos1 ] and board[ pos2 ] are empty
        score = 1;
     }
  } 
  else if (board[ pos3 ] === getInverseCounter( computerCounter ) ) {
     if (score < 0) {  // board[ pos1 ] and/or board[ pos2 ] is opponent counter
        score *= 10;
     } 
     else if (score > 1) {  // board[ pos1 ] and/or board[ pos2 ] is counter
        return 0;
     } 
     else {  // board[ pos1 ] and board[ pos2 ] are empty
        score = -1;
     }
  }
  return score;
}
function getFutureScoreOfMove(stateOfBoard, playersTurn, playersCounter) {
    var stateOfBoardAfterMove = stateOfBoard;
    if( gameOver( stateOfBoard ) ) {
        // return 1 if AI wins, 0 if draw, -1 if user wins
        return evaluate( ( playersTurn === "Computer" ? playersCounter : getInverseCounter( playersCounter ) ), stateOfBoard );
        // return isWinner( playersCounter, stateOfBoard ) ? pointsWon(playersTurn) :         isWinner( getInverseCounter( playersCounter), stateOfBoard ) ? pointsWon( getInverseUser( playersTurn )) : 0;
    }
    
    if(playersTurn==="Computer") {
        currentBestScore= -100000; //this is the worst case for AI
    }
    else{
        currentBestScore= +100000; //this is the worst case for Player
    }
    
    var availableMoves = getAvailableMoves( stateOfBoard );
    var countOfMoves = availableMoves.length;
    var movesTried = [];
    // console.log( "availableMoves for player: ", playersTurn );
    // console.log( availableMoves );
    availableMoves.forEach( function( aMove, i ) {
        console.log( "Next Move for Counter: ", playersCounter, " is: ", aMove );
        if( aMove === "X" || aMove === "O" || movesTried.indexOf( aMove ) >=0 ){
            // if( stateOfBoard[i] === "X" || stateOfBoard[i] === "O") {
            // these aren't legal as they are already taken so skip
            return false;
         }
        // record when we have tried a move so we don't try it again later
        movesTried.push( aMove );
        stateOfBoardAfterMove[ aMove ] = playersCounter;
        // console.log( "Board after move: ", playersCounter );
        // console.log( stateOfBoardAfterMove );
        score=getFutureScoreOfMove(stateOfBoardAfterMove , getInverseUser( playersTurn ), getInverseCounter(playersCounter) );
        // console.log( "Score: ", score );
        // console.log( "playersTurn: ", playersTurn );
        // console.log( "lastMove: ", aMove );
        // console.log( "AvailableMoves for player: ", playersTurn, " ", availableMoves );
        if(playersTurn === "Computer" && score>currentBestScore) { //AI wants positive score
            currentBestScore=score;
        }
        if( playersTurn === "Human" && score<currentBestScore) { //user wants          negative score
            currentBestScore=score;
        }
        // remove counter from stateOfBoardAFterMove as we will try a different move if there are any available
        stateOfBoardAfterMove[aMove] = aMove;
        // if there are available moves left then choose one of those and reverse the last move
        // if there aren't any
        console.log( "Current Best Score: ", currentBestScore );
    });
    
    console.log( "CurrentBestScore: ", currentBestScore );
    console.log( "************************************************");
    return currentBestScore;
}

module.exports = function /*determineNextMove*/  (currentStateOfBoard, computerPlayer, computerCounter ) {
    var currentBestMove= null;
    var score = null;
    var currentBestScore= -100000;
    var stateOfBoardAfterMove = currentStateOfBoard;
    var availableMoves = getAvailableMoves( currentStateOfBoard );
    // console.log( "availableMoves: " );
    // console.log( availableMoves );
    availableMoves.forEach( function( aMove, i ) {

        if( availableMoves[i] === "X" || availableMoves[i] === "O")         {
            // these aren't legal as they are already taken so skip
            return false;
        }
        console.log( "NEXT OPENING MOVE FOR COMPUTER: ", aMove );
        stateOfBoardAfterMove[ aMove ] = computerCounter;
        // console.log( "Board after move: ", computerPlayer );
        // console.log( stateOfBoardAfterMove );
        score=getFutureScoreOfMove(stateOfBoardAfterMove , "Human", getInverseCounter( computerCounter ));
        console.log( "Score in determineNextMove: ", score );
        console.log( "lastMove: ", aMove );
        console.log( "currentBestScore: ", currentBestScore );
        if( score>currentBestScore) {
            // console.log
            currentBestMove=aMove;
            currentBestScore=score;
        }
        stateOfBoardAfterMove[aMove] = aMove;
    });
    console.log( "OVERALL NEXT BEST MOVE FOR THE COMPUTER: ", currentBestMove );
    return currentBestMove;
};


// };