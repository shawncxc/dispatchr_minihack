var custApp = angular.module('custApp', []);

custApp.controller('custCtrl', function($scope, $http){
	console.log("into the custCtrl");

	custShowAllInv();

	//-------------------------------login and sign up part------------------------
	//detect if is a guest login
	$scope.isGuest = true;

	//ajax for login
	$scope.custLogin = function(username){
		var loginJsonData = {CustomerUsername: username};
		$http.post('/custLogin', loginJsonData)
			.success(function(res){
				if(res != "FAIL"){
					$scope.isGuest = false;
					$scope.CustomerUsername = res.CustomerUsername;
					$scope.Address = res.Address;
					$scope.Phone = res.Phone;
					$scope.Email = res.Email;

					custShowAll($scope.CustomerUsername);
				}
		});
	};

	//------------------------------initialization part-------------------------

	function custShowAll(username){
		$http.post('/custShowAll', {CustomerUsername: username})
			.success(function(res){
				$scope.items = res;
			});
	}

	function custShowAllInv(){
		$http.get('/showInventory')
			.success(function(inventory){
				console.log(inventory);
				$scope.inventory = inventory;
			});
	}
});