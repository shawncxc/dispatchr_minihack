var app = angular.module('cartApp', ['ngCookies']);
//testing testing kq
app.controller('MainCtrl', function($scope, $http, $cookieStore){
	console.log("into the MainCtrl");

	$scope.allRecords = [];
	$scope.editTrue = "";
	$scope.auth = false;
	$scope.currentCustomer = "";
	$scope.showOrd = true;
	$scope.showInv = false;

	showAll();
	showAllInv();

	//toggle the order list and inventory list
	$scope.showOrder = function(){
		$scope.showOrd = true;
		$scope.showInv = false;
	};
	$scope.showInven = function(){
		$scope.showOrd = false;
		$scope.showInv = true;
	};

	//pull and show all the orders and customers
	function showAll(){
		$http.get('/showAll')
			.success(function(data){
				$scope.allRecords = data;
			});
	}

	//judge whether user is a sales rep or an inventory admin
	$scope.changeAuth = function(){
		$scope.auth = true;
	};

	//get the customer name while adding new order
	$scope.setCustomerUsername = function(customer){
		$scope.currentCustomer = customer;
	};

	//-----------------------------------Customer Ajax------------------------------

	//show or hide order list
	$scope.hasOrders = function(index){
		return $scope.allRecords[index].Orders.length === 0;
	};

	//add new customer and their first order
	$scope.addNewCustomer = function(){
		var NewCustomerInfo = {};
		NewCustomerInfo.CustomerUsername = $scope.CustomerUsername;
		NewCustomerInfo.Password = $scope.pwd;
		NewCustomerInfo.Address = $scope.Address;
		NewCustomerInfo.Phone = $scope.Phone;
		NewCustomerInfo.Email = $scope.Email;

		$http.post('/addNewCustomer', NewCustomerInfo);

		var order = {};
		order.OrderName = $scope.OrderName.inventoryName;
		order.Amount = $scope.Amount;
		order.Rate = parseInt($scope.OrderName.inventoryRate);
		order.Key = $scope.CustomerUsername + $scope.OrderName.inventoryName + $scope.Amount + $scope.OrderName.inventoryRate;

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
		order.OrderName = $scope.ExOrderName.inventoryName;
		order.Amount = $scope.ExAmount;
		order.Rate = parseInt($scope.ExOrderName.inventoryRate);
		order.Key = $scope.currentCustomer + $scope.ExOrderName + $scope.ExAmount + $scope.ExRate;

		/*var item = {};

		order._id = $scope.ExOrderName._id;
		order.Amount = $scope.ExAmount;
		item = push[]
		order.Rate = parseInt($scope.ExOrderName.inventoryRate);
		//order.createdBy = $scope.;
		order.createAt = new Date();
*/
		var ExCustomerData = {};
		ExCustomerData.CustomerUsername = $scope.currentCustomer;
		ExCustomerData.NewOrder = order;

		$http.post('/AddNewOrder', ExCustomerData)
			.success(function(data){
				if(data == "FAIL") alert("Please enter an existing customer");
				else{
					showAllInv();
					showAll();
				} 
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

	//-------------------------------Inventory Ajax--------------------------------------
	$scope.addInventory = function(invName, invRate, invAmount){
		var JSONdata = {
			inventoryName: invName, 
			inventoryRate: invRate,
			inventoryAmount: parseInt(invAmount)
		};
		$http.put('/addInventory', JSONdata)
			.success(function(){
				console.log("add inventory successful");
				showAllInv();
			});
	};

	function showAllInv(){
		$http.get('/showInventory')
			.success(function(inventory){
				$scope.inventory = inventory;
			});
	}

	//----------------------------Add Sales Rep---------------------
	$scope.addNewUser = function(){
		var salesRep = {};
		salesRep.username = $scope.SalesRepUsername;
		salesRep.password = $scope.SalesRepPwd;

		//console.log(salesRep);

		$http.post('addNewUser', salesRep)
			.success(function(){
				console.log("sales rep added");
			});
	};

	//-----------------------Validate User sales rep---------------
	$scope.validateUser = function(){
		var JsonData = {};
		JsonData.username = $scope.sploginUsername;
		JsonData.password = $scope.sploginPwd;

		$http.post('/validateUser', JsonData)
			.success(function(res){
				if(res == "fail"){
					alert("Wrong password or Wrong username");
					location.reload();
				}
				else{
					$cookieStore.put("USERNAME", $scope.sploginUsername);
					console.log($cookieStore.get("USERNAME"));
				}
			});
	};

	//------------------ login cookie -----------------
	$scope.isLogged = function(){
		if($cookieStore.get('USERNAME') != "" && $cookieStore.get('USERNAME') != undefined){
			return "nonmodal";
		}
		else{
			return "modal";
		} 
	};

	$scope.signout = function(){
		$cookieStore.remove("USERNAME");
		location.reload();
	};

});


