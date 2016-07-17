(function() {
	angular.module('app').controller('AdminNavbarCtrl', ['$scope', '$routeParams', "$firebaseAuth",
		function($scope, $routeParams, $firebaseAuth) {

			$scope.auth = $firebaseAuth();
			$scope.currentUser = {
				displayName: $scope.auth.$getAuth().email
			};

			// ====================================================================================================
			// ====================================================================================================

			$scope.init = function() {
				$scope.initAuth();
			};

			$scope.initAuth = function() {
				// any time auth status updates, add the user data to scope
				$scope.auth.$onAuthStateChanged(function(firebaseUser) {
					if (!firebaseUser) {
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

		}
	]);
})();