var app = angular.module('cartApp', []);

app.controller('MainCtrl', function($scope, $http){
	console.log("into the MainCtrl");
	$scope.allRecords = [];
	$scope.editTrue = "";

	showAll();

	function showAll(){
		$http.get('/showAll')
			.success(function(data){
				$scope.allRecords = data;
			});
	}

	//-----------------------------------Customer Ajax------------------------------

	$scope.addNewCustomer = function(){
		var NewCustomerInfo = {};
		NewCustomerInfo.CustomerUsername = $scope.CustomerUsername;
		NewCustomerInfo.Address = $scope.Address;
		NewCustomerInfo.Phone = $scope.Phone;
		NewCustomerInfo.Email = $scope.Email;

		$http.post('/addNewCustomer', NewCustomerInfo);

		var order = {};
		order.OrderName = $scope.OrderName;
		order.Amount = $scope.Amount;
		order.Key = $scope.CustomerUsername + $scope.OrderName + $scope.Amount;

		var NewCustomerOrderData = {};
		NewCustomerOrderData.CustomerUsername = $scope.CustomerUsername;
		NewCustomerOrderData.Orders = [];
		NewCustomerOrderData.Orders.push(order);

		$http.post('/addNewCustomerOrder', NewCustomerOrderData)
			.success(function(){
				showAll();
			});
	};

	$scope.editCustomerData = function(name){
		var CustomerUsername = {CustomerUsername: name};

		$http.post('/getCustomerInfo', CustomerUsername)
			.success(function(data){
				$scope.CustomerInfo = data;
				$scope.showCustomerInfo = name;
			});
	};

	$scope.updateExCustomer = function(name){
		var updateData = {};
		updateData.CustomerUsername = name;
		updateData.Address = $scope.CustomerInfo[0].Address;
		updateData.Phone = $scope.CustomerInfo[0].Phone;
		updateData.Email = $scope.CustomerInfo[0].Email;
		console.log(updateData);
		$http.post('/updateExCustomer', updateData)
			.success(function(){
				$scope.showCustomerInfo = "";
			});
	};

	$scope.updateExCustomerCancel = function(){
		$scope.showCustomerInfo = "";
	};

	//-------------------------------Order Ajax--------------------------------------

	$scope.addNewOrder = function(){
		var order = {};
		order.OrderName = $scope.ExOrderName;
		order.Amount = $scope.ExAmount;
		order.Key = $scope.ExCustomerUsername + $scope.ExOrderName + $scope.ExAmount;

		var ExCustomerData = {};
		ExCustomerData.CustomerUsername = $scope.ExCustomerUsername;
		ExCustomerData.NewOrder = order;

		$http.post('/AddNewOrder', ExCustomerData)
			.success(function(){
				showAll();
			});
	};

	$scope.editExOrder = function(Key){
		$scope.editTrue = Key;
	};

	$scope.updateExOrder = function(CustomerUsername, editOrderName, editOrderAmount, originKey){
		var editExOrderData = {};
		editExOrderData.CustomerUsername = CustomerUsername;
		editExOrderData.OrderName = editOrderName;
		editExOrderData.Amount = editOrderAmount;
		editExOrderData.Key = CustomerUsername + editOrderName + editOrderAmount;
		editExOrderData.originKey = originKey;
		$http.post('/updateExOrder', editExOrderData)
			.success(function(){
				showAll();
		});
	};

	$scope.updateExOrderCancel = function(){
		$scope.editTrue = "";
	};

	$scope.deleteExOrder = function(CustomerUsername, Key){
		$http.post('/deleteExOrder', {CustomerUsername: CustomerUsername, Key: Key})
			.success(function(){
				showAll();
			});
	};
});