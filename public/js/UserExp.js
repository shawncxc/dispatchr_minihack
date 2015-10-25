$.noConflict();
jQuery(function(){
	$('.modal').on('hidden.bs.modal', function(){
	    $(this).find('form')[0].reset();
	});
});