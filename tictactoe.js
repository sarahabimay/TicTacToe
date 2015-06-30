// helper functions to keep code d.r.y.
var resetGame = function(){
	isPlayer1Computer = undefined;
	var p1Text = "Player1: ";
	var p2Text = "Player2: ";
	$("#p1Text").text( p1Text );
	$("#p2Text").text( p2Text );
	$("#stateofplay").hide();
	$("#playerselect").show();
};

$(document).ready(function(){
	var isPlayer1Computer;
	$("#player1").click(function(){
		isPlayer1Computer = false;
		$('#readyModal').modal('show');
  	});
  	$("#player2").click(function(){
  		isPlayer1Computer = true;
		$('#readyModal').modal('show');
  	});
	$(".readytoplay").click( function() {
		var p1Text = "Player1: " + ( isPlayer1Computer ? "Computer" : "You");
		var p2Text = "Player2: " + ( isPlayer1Computer ? "You" : "Computer");
		$("#p1Text").text( p1Text );
		$("#p2Text").text( p2Text );
		$('#readyModal').modal('hide');
		$("#playerselect").hide();
		$("#stateofplay").show();
	} );

	$(".notreadytoplay").click( function() {
		$('#readyModal').modal('hide');
		resetGame();
	} );

	$("#reset").click( function() {
		resetGame();
	} );
});