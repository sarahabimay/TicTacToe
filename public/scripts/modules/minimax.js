var computerCounter = "";

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

function getInverseUser ( playersTurn ) {
	return playersTurn === "Computer" ? "Human" : "Computer";
}

function getInverseCounter ( counter ) {
	return counter === "X" ? "O" : "X";
}

function getAvailableMoves ( currentStateOfBoard ){
	return currentStateOfBoard.filter( function( e, i ) {
			return e !== "X" && e !== "O" ;
	});
}

function found ( counter, position, stateOfBoard ){
	return stateOfBoard[ position ] === counter;
}
function found3InARow ( counter, stateOfBoard ) {
	// this could be improved to use the 'winningPositions' array
	var winningPositions = [ [0,1,2],[0,4,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[3,4,5],[6,7,8]];
	var results = winningPositions.filter( function( element ) {
		return element.every( function( e ){
			return found( counter, e, stateOfBoard );
		},this);
	},this);

	return results.length > 0 ? true : false;
}
function gameOver ( stateOfBoard ) {
	var availMoves = [];
	if( found3InARow( "X", stateOfBoard ) || found3InARow( "O", stateOfBoard ) ) {
		return true;
	}
	else {
		availMoves = getAvailableMoves( stateOfBoard );
		return availMoves.length === 0;
	}
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
function evaluateLine ( counter, board, pos1, pos2, pos3 ) {
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

function getScore( stateOfBoard, depth ) {
	return evaluate( computerCounter, stateOfBoard );
}

function maxOfArray( array ) {
	return Math.max.apply(null, array );
}
function minOfArray( array ) {
	return Math.min.apply(null, array );
}

module.exports = function( stateOfBoard, player, counter ){
	var stateOfBoardAfterMove = stateOfBoard;
	var score, bestScore,  bestMove, maxScoreIndex, minScoreIndex;

	var scores = [], // an array of scores
		moves = [];  // an array of moves

	var availableMoves = getAvailableMoves( stateOfBoard );
	var depth = 0;

	computerCounter = counter;

	availableMoves.forEach( function( aMove, i ) {
		stateOfBoardAfterMove[ aMove ] = counter;
		score=minimax(depth, stateOfBoardAfterMove, getInverseUser( player ), getInverseCounter(counter) );
		stateOfBoardAfterMove[aMove] = aMove;
		scores.push(score);
		moves.push( aMove );
	});
	// Do the min or the max calculation
	if( player === "Computer"){
		//This is the max calculation
		maxScoreIndex = scores.indexOf( maxOfArray( scores ) );
		console.log( "Scores: ", scores );
		console.log( "Moves: ", moves );
		bestMove = moves[maxScoreIndex];
		console.log( "Computer's Best Next Move: ", bestMove );
		return bestMove;
	}
	else {
		//This is the min calculation
		minScoreIndex = scores.indexOf( minOfArray( scores ) );
		bestMove = moves[minScoreIndex];
		return bestMove;
	}
};

function minimax ( depth, stateOfBoard, player, counter ) {
	var stateOfBoardAfterMove = stateOfBoard;
	var score, bestScore;
	var scores = []; // an array of scores
	var availableMoves = getAvailableMoves( stateOfBoard );

	if( gameOver( stateOfBoard, depth ) ) {
		// return 1 if AI wins, 0 if draw, -1 if user wins
		return getScore( stateOfBoard, depth );
	}
	
	++depth;

	//Populate the scores array, recursing as needed
	availableMoves.forEach( function( aMove, i ) {
		stateOfBoardAfterMove[ aMove ] = counter;
		score=minimax(depth, stateOfBoardAfterMove, getInverseUser( player ), getInverseCounter(counter) );
		stateOfBoardAfterMove[aMove] = aMove;
		scores.push(score);
	});
	// Do the min or the max calculation
	if( player === "Computer"){
		//This is the max calculation
		bestScore = maxOfArray( scores );
		return bestScore;
	}
	else {
		//This is the min calculation
		bestScore = minOfArray( scores );
		return bestScore;
	}
}