controllers.controller('HomePostCtrl', ['$scope', '$routeParams', "$firebaseAuth", "$firebaseObject", "$firebaseArray",
	function($scope, $routeParams, $firebaseAuth, $firebaseObject, $firebaseArray) {

		$scope.path = "/posts";

		// ====================================================================================================
		// ====================================================================================================

		$scope.init = function() {
			if ($scope.isValidPost()) {
				$scope.posts = $firebaseArray(ref.child('posts').orderByChild("urlAddress").equalTo($routeParams.postUrlAddress).limitToLast(1));
				
				beginl($("#homePostLoading"), $("#homePost"));
				$scope.posts.$loaded(
				  function(data) {
				  	endl($("#homePostLoading"), $("#homePost"));
				  },
				  function(error) {
				  	endl($("#homePostLoading"), $("#homePost"));
				    console.error("Error:", error);
				  }
				);
			} else {
				endl($("#homePostLoading"), $("#homePost"));
				errmsg("Postagem não encontrada.")
			}
		};
		
		$scope.isValidPost = function() {
			return $routeParams.postUrlAddress !== undefined && $routeParams.postUrlAddress !== null;
		};

		// ====================================================================================================
		// ====================================================================================================

		$scope.init();

	}]);