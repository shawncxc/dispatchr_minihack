var app = angular.module('cartApp', []);

app.controller('MainCtrl', function($scope, $http){
	console.log("into the MainCtrl");
	$scope.allRecords = [];
	$scope.editTrue = "";
	$scope.auth = false;

	showAll();

	//pull and show all the orders and customers
	function showAll(){
		$http.get('/showAll')
			.success(function(data){
				$scope.allRecords = data;
			});
	}

	$scope.changeAuth = function(){
		$scope.auth = true;
	};

	//-----------------------------------Customer Ajax------------------------------

	//add new customer and their first order
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
		order.Rate = $scope.Rate;
		order.Key = $scope.CustomerUsername + $scope.OrderName + $scope.Amount + $scope.Rate;

		var NewCustomerOrderData = {};
		NewCustomerOrderData.CustomerUsername = $scope.CustomerUsername;
		NewCustomerOrderData.Orders = [];
		NewCustomerOrderData.Orders.push(order);

		$http.post('/addNewCustomerOrder', NewCustomerOrderData)
			.success(function(){
				showAll();
			});
	};

	//modify customer's info
	$scope.editCustomerData = function(name){
		var CustomerUsername = {CustomerUsername: name};

		$http.post('/getCustomerInfo', CustomerUsername)
			.success(function(data){
				$scope.CustomerInfo = data;
				$scope.showCustomerInfo = name;
			});
	};

	//update and save existing customer's info
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

	//cancel updating customer's info
	$scope.updateExCustomerCancel = function(){
		$scope.showCustomerInfo = "";
	};

	//-------------------------------Order Ajax--------------------------------------

	//add new order for existing customers
	$scope.addNewOrder = function(){
		var order = {};
		order.OrderName = $scope.ExOrderName;
		order.Amount = $scope.ExAmount;
		order.Rate = $scope.ExRate;
		order.Key = $scope.ExCustomerUsername + $scope.ExOrderName + $scope.ExAmount + $scope.ExRate;

		var ExCustomerData = {};
		ExCustomerData.CustomerUsername = $scope.ExCustomerUsername;
		ExCustomerData.NewOrder = order;

		$http.post('/AddNewOrder', ExCustomerData)
			.success(function(data){
				if(data == "FAIL") alert("Please enter an existing customer");
				else showAll();
			});
	};

	//edit existing order
	$scope.editExOrder = function(Key){
		$scope.editTrue = Key;
	};

	//update and save existing order
	$scope.updateExOrder = function(CustomerUsername, editOrderName, editOrderAmount, editOrderRate, originKey){
		var editExOrderData = {};
		editExOrderData.CustomerUsername = CustomerUsername;
		editExOrderData.OrderName = editOrderName;
		editExOrderData.Amount = editOrderAmount;
		editExOrderData.Rate = editOrderRate;
		editExOrderData.Key = CustomerUsername + editOrderName + editOrderAmount + editOrderRate;
		editExOrderData.originKey = originKey;
		$http.post('/updateExOrder', editExOrderData)
			.success(function(){
				showAll();
		});
	};

	//cancel updating orders
	$scope.updateExOrderCancel = function(){
		$scope.editTrue = "";
	};

	//delete existing orders
	$scope.deleteExOrder = function(CustomerUsername, Key){
		$http.post('/deleteExOrder', {CustomerUsername: CustomerUsername, Key: Key})
			.success(function(){
				showAll();
			});
	};
});


