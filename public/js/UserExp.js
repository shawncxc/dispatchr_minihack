//use noconflict mode for JQuery
$.noConflict();

//clear all the input when modal is closed
jQuery(function(){
	$('#loginModal').modal('show');

	$('.modal').on('hidden.bs.modal', function(){
	    $(this).find('form')[0].reset();
	});
});