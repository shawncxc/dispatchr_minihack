//use noconflict mode for JQuery
$.noConflict();


jQuery(function(){
	//show login modal
	$('#loginModal').modal('show');

	//clear all the input when modal is closed
	$('.modal').on('hidden.bs.modal', function(){
	    $(this).find('form')[0].reset();
	});
});