controllers.controller('AdminCtrl', ['$scope', '$routeParams', "$firebaseAuth", "$firebaseArray", "currentAuth",
	function($scope, $routeParams, $firebaseAuth, $firebaseArray, currentAuth) {
		
		// currentAuth (provided by resolve) will contain the
  		// authenticated user or null if not logged in

		$scope.path = "/admin";
		
		// ====================================================================================================
		// ====================================================================================================

		$scope.init = function() {
		};

		$scope.isAuth = function() {
			return typeof currentAuth !== "undefined" && currentAuth !== null;
		};

		// ====================================================================================================
		// ====================================================================================================

		$scope.init();

	}]);