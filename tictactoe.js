$(document).ready(function(){
	$(".player").click(function(){
		// e.preventDefault();
		$('#readyModal').modal('show');
  	});
	$(".readytoplay").click( function() {
		$('#readyModal').modal('hide');
	} );

	$(".notreadytoplay").click( function() {
		$('#readyModal').modal('hide');
	} );
});