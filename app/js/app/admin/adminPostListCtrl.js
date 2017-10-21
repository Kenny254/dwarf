(function() {
	angular.module('app').controller('AdminPostListCtrl', ['$scope', '$routeParams', "$firebaseAuth", "$firebaseArray",
		function($scope, $routeParams, $firebaseAuth, $firebaseArray) {

			$scope.path = "/admin/posts";
			$scope.posts = $firebaseArray(ref.child("dwarf").child("posts"));

			beginl($("#adminPostListLoading"), $("#adminPostList"));
			$scope.posts.$loaded(
				function(data) {
					endl($("#adminPostListLoading"), $("#adminPostList"));
				},
				function(error) {
					endl($("#adminPostListLoading"), $("#adminPostList"));
					console.error("Error:", error);
				}
			);

			// ====================================================================================================
			// ====================================================================================================

			$scope.init = function() {};

			$scope.removePost = function(item) {
				beginc($("#remBtn" + item.$id));
				$scope.posts.$remove(item).then(function(ref) {
					endc($("#remBtn" + item.$id));
					infmsg("Postagem removida.");
				});
			};

			// ====================================================================================================
			// ====================================================================================================

			$scope.init();

		}
	]);
})();