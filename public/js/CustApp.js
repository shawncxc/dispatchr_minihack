var custApp = angular.module('custApp', ['ngCookies']);

custApp.controller('custCtrl', function($scope, $http, $cookieStore){
	console.log("into the custCtrl");

	custShowAllInv();

	//toggle two tables
	$scope.showCartTab = true;
	$scope.showInvTab = false;

	$scope.seeCartTab = function(){
		$scope.showCartTab = true;
		$scope.showInvTab = false;
	}

	$scope.seeInvTab = function(){
		$scope.showCartTab = false;
		$scope.showInvTab = true;
	}
	
	//-------------------------------login, sign up and sign out part-------------------
	//detect if is a guest login
	$scope.isGuest = isGuestDetect();
	$scope.modalOrNot = removeModal();

	//after refresh, retrieve data if is not guest
	if(!isGuestDetect()){
		custShowAll($cookieStore.get("USERNAME"));
		custShowInfo($cookieStore.get("USERNAME"));
	}

	//ajax for login
	$scope.custLogin = function(username, pwd){
		var loginJsonData = {
			CustomerUsername: username,
			Password: pwd
		};
		$http.post('/custLogin', loginJsonData)
			.success(function(res){
				if(res != "FAIL"){
					$scope.CustomerUsername = res.data.CustomerUsername;
					$scope.Address = res.data.Address;
					$scope.Phone = res.data.Phone;
					$scope.Email = res.data.Email;
					$scope.usericon = res.usericon;

					$cookieStore.put('USERNAME', res.data.CustomerUsername);
					$scope.isGuest = isGuestDetect();

					custShowAll(res.data.CustomerUsername);

					if($scope.usericon != undefined){
						location.reload();
					}
				}
				else{
					alert("Password or Username is wrong, login as guest");
				}
		});
	};

	//ajax for sigup
	$scope.custSignup = function(custSignUser, custPwd, custSignAddrs, custSignPhone, custSignEml){
		var NewCustomerInfo = {};
		NewCustomerInfo.CustomerUsername = custSignUser;
		NewCustomerInfo.Password = custPwd;
		NewCustomerInfo.Address = custSignAddrs;
		NewCustomerInfo.Phone = custSignPhone;
		NewCustomerInfo.Email = custSignEml;

		$http.post('/addNewCustomer', NewCustomerInfo);

		var NewCustomerOrderData = {};
		NewCustomerOrderData.CustomerUsername = custSignUser;
		NewCustomerOrderData.Orders = [];

		$http.post('/addNewCustomerOrder', NewCustomerOrderData)
			.success(function(){
				custShowInfo(custSignUser)
				$http.post('/custLogin', {CustomerUsername: custSignUser})
					.success(function(res){
						if(res != "FAIL"){
							$scope.CustomerUsername = res.data.CustomerUsername;
							$scope.Address = res.data.Address;
							$scope.Phone = res.data.Phone;
							$scope.Email = res.data.Email;
							$scope.usericon = res.usericon;

						    $cookieStore.put('USERNAME', res.data.CustomerUsername);
						    $scope.isGuest = isGuestDetect();

						    if($scope.usericon != undefined){
								location.reload();
							}

							custShowAll(res.data.CustomerUsername);
						}
				});
			});
	};

	$scope.signout = function(){
		$cookieStore.remove("USERNAME");
		location.reload();
	};

	//------------------------------customer buy new product-----------------------

	$scope.custAddNewOrder = function(product, amount, rate, CustomerUsername){
		if(amount != "" && amount != undefined){
			var order = {};
			order.OrderName = product;
			order.Amount = amount;
			order.Rate = parseInt(rate);
			order.Key = CustomerUsername + product + amount + rate;

			var ExCustomerData = {};
			ExCustomerData.CustomerUsername = CustomerUsername;
			ExCustomerData.NewOrder = order;

			$http.post('/AddNewOrder', ExCustomerData)
				.success(function(data){
					if(data == "FAIL") alert("Please enter an existing customer");
					else{
						custShowAll(CustomerUsername);
					} 
				});
		}
		else{
			alert("The Amount can not be blank");
		}
		
	};

	//------------------------------initialization function-------------------------

	function custShowAll(username){
		$http.post('/custShowAll', {CustomerUsername: username})
			.success(function(res){
				$scope.items = res;
			});
	}

	function custShowAllInv(){
		$http.get('/showInventory')
			.success(function(inventory){
				$scope.inventory = inventory;
			});
	}

	function isGuestDetect(){
		if($cookieStore.get('USERNAME') == "" || $cookieStore.get('USERNAME') == undefined){
			return true;
		}
		else return false;
	}

	function removeModal(){
		if($scope.isGuest) return "modal";
		else return "Nonmodal";
	};

	function custShowInfo(username){
		$http.post('/custLogin', {CustomerUsername: username})
			.success(function(res){
				if(res != "FAIL"){
					$scope.CustomerUsername = res.data.CustomerUsername;
					$scope.Address = res.data.Address;
					$scope.Phone = res.data.Phone;
					$scope.Email = res.data.Email;
					$scope.usericon = res.usericon;
				}
		});
	}
});
