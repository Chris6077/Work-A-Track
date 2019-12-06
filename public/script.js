var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope, $http) {
    $scope.errormessage = "";
    $scope.successmessage = "";
    $scope.username = "";
    var password = "";
    $scope.loggedIn = 'false';
    $scope.workouts = [];
	$scope.api = "home";
	$scope.apimessage = "API Usage";
	$scope.refreshed = false;
    function herror(err){
        if(err) $scope.errormessage = err;
        terror();
    }
    function hsuccess(suc){
        if(suc) $scope.successmessage = suc;
        tsuccess();
    }
	$scope.tapi = function(){
		if($scope.api == "home"){
		  $scope.api = "api";
          $scope.apimessage = "Back to Work-A-Track";
		  setTimeout(AOS.init,1);
        }
        else {
		  $scope.api = "home";
          $scope.apimessage = "API Usage";
		  setTimeout(AOS.init,1);
        }
	}
    $scope.signup = function(){
		if($("#sign-up-form")[0].elements["username"].value && $("#sign-up-form")[0].elements["username"].value != ""){
			$scope.loggedIn = 'loading';
			$scope.username = $("#sign-up-form")[0].elements["username"].value;
			password = $("#sign-up-form")[0].elements["password"].value;
			$.ajax({
				url: "https://workatrack.bashit.me/user/new",
				type: "POST",
				async: false,
				dataType: "JSON",
				data: $("#sign-up-form").serialize(),
				success: function(e) {
					if (e.message) {
						$scope.loggedIn = 'true';
					} else {
						$scope.username = "";
						$scope.loggedIn = 'false';
						password = "";
						herror(e.responseJSON.error);
					}
				},
				error: function(data) {
					$scope.username = "";
					$scope.loggedIn = 'false';
					password = "";
					herror(data.responseJSON.error);
				}
			});  
		}
    };
	$scope.logout = function(){
		$scope.username = "";
		password = "";
		$scope.loggedIn = "false";
	}
    $scope.login = function(){
		if($("#sign-up-form")[0].elements["username"].value && $("#sign-up-form")[0].elements["username"].value != ""){
			$scope.loggedIn = 'loading';
			$scope.username = $("#sign-up-form")[0].elements["username"].value;
			password = $("#sign-up-form")[0].elements["password"].value;
			$.ajax({
				url: "https://workatrack.bashit.me/user/login",
				type: "POST",
				async: false,
				dataType: "JSON",
				data: $("#sign-up-form").serialize(),
				success: function(e) {
					if (e.message) {
						$scope.loggedIn = 'true';
						setTimeout($scope.refresh, 10);
					} else {
						$scope.username = "";
						$scope.loggedIn = 'false';
						password = "";
						herror(e.responseJSON.error);
					}
				},
				error: function(data) {
					$scope.username = "";
					$scope.loggedIn = 'false';
					password = "";
					herror(data.responseJSON.error);
				}
			});
		}
    };
    $scope.addworkout = function(){
		if($("#add-workout-form")[0].elements["duration"].value && $("#add-workout-form")[0].elements["duration"].value >= 1 && $scope.loggedIn == "true"){
			$loggedIn = 'loading';
			$.ajax({
				url: "https://workatrack.bashit.me/workout/new",
				type: "POST",
				async: false,
				dataType: "JSON",
				data: $("#add-workout-form").serialize() + '&username=' + $scope.username + '&password=' + password,
				success: function(e) {
					if (e.message) {
						hsuccess(e.message);
					} else {
						herror(e.responseJSON.error);
					}
				},
				error: function(data) {
					herror(data.responseJSON.error);
				}
			});  
			$scope.loggedIn = "true";
		}
    };
    $scope.showworkouts = function(){
		if($scope.loggedIn == "true"){
			$scope.loggedIn = "loading";
			$.ajax({
				url: "https://workatrack.bashit.me/user/workouts",
				type: "POST",
				dataType: "JSON",
				data: $("#show-workouts-form").serialize() + '&username=' + $scope.username + '&password=' + password,
				success: function(e) {
					if (e) {
						$scope.workouts = [];
						for(var idx = 0; idx < e.length; idx++){
							$scope.workouts.push(Object.assign({},e[idx]));
						}
						$scope.tworkout();
					} else {
						herror(e.responseJSON.error);
					}
				},
				error: function(data) {
					herror(data.responseJSON.error);
				}
			});  
			$scope.loggedIn = "true";
		}
    };
	$scope.tworkout = function(){
		$scope.api = "workout";
		$scope.apimessage = "Back to Work-A-Track";
		setTimeout(AOS.init,1);
	};
});
function terror(){
    $('#serror').modal('toggle');
}
function tsuccess(){
    $('#ssucc').modal('toggle');
}