controllers.controller("AdminLoginCtrl", ["$scope", "$routeParams", "$firebaseAuth", "$firebaseArray", "Auth", "currentAuth",
	function($scope, $routeParams, $firebaseAuth, $firebaseArray, Auth, currentAuth) {

		// currentAuth (provided by resolve) will contain the
  		// authenticated user or null if not logged in
		
		$scope.path = "/admin/login";
		$scope.auth = Auth;
		
		// ====================================================================================================
		// ====================================================================================================

		$scope.init = function() {
		};
		
		$scope.submitLogin = function() {
			beginr($("#signinBtn"));
			$scope.auth.$authWithPassword({
				email: $scope.email,
				password: $scope.password
			}).then(function(authData) {
				endr($("#signinBtn"));
				window.location.href = '#/admin';
			}).catch(function(error) {
				endr($("#signinBtn"));
				console.error("Authentication failed:", error);
				errmsg("Informações de login inválidas.");
			});
		};
		
		$scope.resetPassword = function() {
			beginc($("#passwdResetBtn"));
			$scope.auth.$resetPassword({
				email: $scope.resetEmail
			}).then(function() {
				endc($("#passwdResetBtn"));
				infmsg("Uma mensagem foi enviada ao seu e-mail.");
			}).catch(function(error) {
				endc($("#passwdResetBtn"));
				console.error("Error: ", error);
				errmsg("Usuário não encontrado.");
			});
		};

		// ====================================================================================================
		// ====================================================================================================

		$scope.init();

	}]);