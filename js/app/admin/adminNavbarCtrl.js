controllers.controller('AdminNavbarCtrl', ['$scope', '$routeParams', "$firebaseAuth", "Auth",
	function($scope, $routeParams, $firebaseAuth, Auth) {

		$scope.auth = Auth;
		$scope.currentUser = { displayName: $scope.auth.$getAuth().password.email };
		
		// ====================================================================================================
		// ====================================================================================================

		$scope.init = function() {
			$scope.initAuth();
		};
		
		$scope.initAuth = function() {
			// any time auth status updates, add the user data to scope
			$scope.auth.$onAuth(function(authData) {
				if (!authData) {
					window.location.href = '#/';
				}
			});
		};
        
        $scope.logout = function() {
        	$scope.auth.$unauth();
        };

		// ====================================================================================================
		// ====================================================================================================

		$scope.init();

	}]);