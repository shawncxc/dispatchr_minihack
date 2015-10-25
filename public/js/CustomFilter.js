angular.module("CustomFilter", [])
	.filter('searchByCustomer', function(){
		console.log("into the customfilter");
		return function(customers, target){
			var result = [];
			for(var i = 0; i < customers.length; i++){
				if(customers[i].CustomerUsername == target || 
					target == null ||
					target == ""){
					result.push(customers[i]);
				}
			}
			return result;
		};
	});