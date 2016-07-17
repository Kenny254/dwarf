(function() {
	angular.module('app').controller("HomeCtrl", ["$scope", "$routeParams", "$firebaseAuth", "$firebaseArray", "ImageService",
		function($scope, $routeParams, $firebaseAuth, $firebaseArray, ImageService) {

			$scope.path = "/";
			$scope.posts = $firebaseArray(ref.child("posts").limitToLast(10).orderByChild('updatedAt'));

			// ====================================================================================================
			// ====================================================================================================

			$scope.init = function() {
				beginl($("#homePostListLoading"), $("#homePostList"));
				$scope.posts.$loaded(
					function(data) {
						endl($("#homePostListLoading"), $("#homePostList"));

						// Images
						for (var i = 0; i < data.length; i++) {
							if (data[i].images) {
								for (image in data[i].images) {
									ImageService.downloadBackground(image, "#imageView" + image, "100px");
								}
							}
						}

					},
					function(error) {
						endl($("#homePostListLoading"), $("#homePostList"));
						console.error("Error:", error);
					}
				);
			};

			// ====================================================================================================
			// ====================================================================================================

			$scope.init();

		}
	]);
})();