(function() {
	angular.module('app').controller('HomePostCtrl', ['$scope', '$routeParams', "$firebaseAuth", "$firebaseObject", "$firebaseArray", "ImageService",
		function($scope, $routeParams, $firebaseAuth, $firebaseObject, $firebaseArray, ImageService) {

			$scope.path = "/posts";

			// ====================================================================================================
			// ====================================================================================================

			$scope.init = function() {
				if ($routeParams.postUrlAddress) {
					$scope.posts = $firebaseArray(ref.child('posts').orderByChild("urlAddress").equalTo($routeParams.postUrlAddress).limitToLast(1));

					beginl($("#homePostLoading"), $("#homePost"));
					$scope.posts.$loaded(
						function(data) {
							endl($("#homePostLoading"), $("#homePost"));

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
							endl($("#homePostLoading"), $("#homePost"));
							console.error("Error:", error);
						}
					);
				}
				else {
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

		}
	]);
})();