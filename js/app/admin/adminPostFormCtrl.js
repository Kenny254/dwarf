controllers.controller('AdminPostFormCtrl', ['$scope', '$routeParams', "$firebaseAuth", "$firebaseObject", "$firebaseArray", "ImageService",
	function($scope, $routeParams, $firebaseAuth, $firebaseObject, $firebaseArray, ImageService) {

		$scope.path = "/admin/posts";

		// ====================================================================================================
		// ====================================================================================================

		$scope.init = function() {
			
			$scope.initFileUpload();
			
			if ($routeParams.postId) {
				$scope.post = $firebaseObject(ref.child('posts').child($routeParams.postId));
				
				$scope.post.$loaded(
				  function(post) {
				  	// Images
				  	if (post.images) {
				  		for (image in post.images) {
				  			ImageService.downloadBackground(image, "#imageView");
				  		}
				  	}
				  },
				  function(error) {
				    console.error("Error:", error);
				  }
				);
				
			} else {
				$scope.initPost();
			}
		};

		$scope.initPost = function() {
			$scope.post = {
				title:		null,
				subtitle:	null,
				urlAddress:	null,
				videoLink:	null,
				images:		null,
				content:	null,
				published:	true,
			};
			$scope.initPostForm();
		};

		$scope.initPostForm = function() {
			if ($scope.postForm !== undefined) {
				
				$scope.postForm.title.$dirty = false;
				$scope.postForm.title.$touched = false;
				
				$scope.postForm.content.$dirty = false;
				$scope.postForm.content.$touched = false;
			}
		};

		// ====================================================================================================
		// ====================================================================================================
		
		$scope.submitPost = function() {
			
			var now = new Date().getTime();
			$scope.post.updatedAt = now;

			if ($routeParams.postId) {
				// Edit
				$scope.post.published = $scope.post.published !== "0"? true : false;
				$("#imageView").css("background-image", "url('img/ajax-loader.gif')");
				beginr($("#submitPostBtn"));
				$scope.post.$save().then(function(ref) {
					endr($("#submitPostBtn"));
					infmsg("Postagem atualizada.");
					window.location = "#/admin/posts";
				}, function(error) {
					endr($("#submitPostBtn"));
					console.error(error);
				});
			} else {
				// Create
				$scope.post.urlAddress = slug($scope.post.title.toLowerCase());
				$scope.post.createdAt = now;
				$scope.post.published = false;
				beginc($("#submitPostBtn"));
				ref.child("posts").push($scope.post, function(error){
					endc($("#submitPostBtn"));
					if (error) {
						console.error(error);
					} else {
						infmsg("Postagem criada.");
						window.location = "#/admin/posts";
					}
				});
			}
		};
		
		// ==================================================================================================================================================================================
		// =================================================================================== File Upload ==================================================================================
		// ==================================================================================================================================================================================
		
		$scope.initFileUpload = function() {
			document.getElementById("imageFileInput").addEventListener('change', uploadImage, false);
		};
		
		function uploadImage(evt) {
			var f = evt.target.files[0];
			var reader = new FileReader();
			reader.onload = (function(theFile) {
			  return function(e) {
			    var filePayload = e.target.result;
			    beginl();
			    // Set the file payload to Firebase and register an onComplete handler to stop the spinner and show the preview
			    var imageRef = ref.child("images").push();
			    console.log(f);
			    imageRef.set({
			    	lastModified: f.lastModified,
			    	lastModifiedDate: f.lastModifiedDate,
			    	name: f.name,
			    	size: f.size,
			    	type: f.type,
			    	data: filePayload
			    }, function() {
			      endl();
			      $("#imageFileInput").val(null);
			      ImageService.downloadBackground(imageRef.key(), $("#imageView"));
			      $scope.post.images = {};
			      $scope.post.images[imageRef.key()] = true;
			    });
			  };
			})(f);
			reader.readAsDataURL(f);
		};

		// ====================================================================================================
		// ====================================================================================================

		$scope.init();

	}]);