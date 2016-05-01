var app = angular.module('app', [
  'ngRoute',
  'controllers',
  'firebase'
]);

var controllers = angular.module('controllers', []);

app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    
    $routeProvider.
      
      when('/', {
        templateUrl: 'partials/home/home.html',
        controller: 'HomeCtrl'
      }).
      
      when('/post/:postUrlAddress', {
        templateUrl: 'partials/home/post.html',
        controller: 'HomePostCtrl'
      }).
      
      
      when('/admin/login', {
        templateUrl: 'partials/admin/login.html',
        controller: 'AdminLoginCtrl',
        resolve: {
          // controller will not be loaded until $waitForAuth resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["Auth", function(Auth) {
            // $waitForAuth returns a promise so the resolve waits for it to complete
            return Auth.$waitForAuth();
          }]
        }
      }).
      
      
      when('/admin', {
        templateUrl: 'partials/admin/home.html',
        controller: 'AdminCtrl',
        resolve: {
          // controller will not be loaded until $requireAuth resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["Auth", function(Auth) {
            // $requireAuth returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireAuth();
          }]
        }
      }).

      when('/admin/posts', {
        templateUrl: 'partials/admin/post-list.html',
        controller: 'AdminPostListCtrl',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireAuth();
          }]
        }
      }).
      when('/admin/create/post', {
        templateUrl: 'partials/admin/post-form.html',
        controller: 'AdminPostFormCtrl',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireAuth();
          }]
        }
      }).
      when('/admin/edit/post/:postId', {
        templateUrl: 'partials/admin/post-form.html',
        controller: 'AdminPostFormCtrl',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireAuth();
          }]
        }
      }).

      
      otherwise({
        redirectTo: '/'
      });

  }]);
	
app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://www.youtube.com/embed/**'
  ]);
});

app.directive('staticInclude',
	function($http, $templateCache, $compile) {
	    return function(scope, element, attrs) {
	        var templatePath = attrs.staticInclude;
	        $http.get(templatePath, { cache: $templateCache }).success(function(response) {
	            var contents = element.html(response).contents();
	            $compile(contents)(scope);
	        });
	    };
	});

app.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/admin/login");
    }
  });
}]);

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth(ref);
  }
]);

app.factory('ImageServiceFactory', function() {
  var factory = {};
  	
  factory.downloadImage = function(id, selector, height) {
    if (typeof id !== "undefined") {
      factory.fetchImage(id, function (image) {
        $(selector).find("img").attr("src", image.data);
        $(selector).find("img").css("height", height ? height : "250px");
        $(selector).find("img").css("width", "auto");
        $(selector).find("a").attr("href", image.data);
      });
    }
  };
		
	factory.downloadBackground = function(id, selector, height) {
    if (typeof id !== "undefined") {
      factory.fetchImage(id, function (image) {
        $(selector).css("background-image", "url('" + image.data + "')");
        $(selector).css("height", height ? height : "250px");
        $(selector).css("width", height ? height : "250px");
      });
    }
	};
	
	factory.fetchImage = function(id, callback) {
		if (typeof id !== "undefined") {
		  // A hash was passed in, so let's retrieve and render it.
		  ref.child("images").child(id).once('value', function(snap) {
		    var image = snap.val();
		    if (image.data != null) {
		      callback(image);
		    } else {
		      errmsg("Imagem não encontrada.");
		    }
		  });
		}
	};
   
  return factory;
}); 

app.service('ImageService', function(ImageServiceFactory){
   this.downloadImage = function(id, selector, height) {
      return ImageServiceFactory.downloadImage(id, selector, height);
   }
   this.downloadBackground = function(id, selector, height) {
      return ImageServiceFactory.downloadBackground(id, selector, height);
   }
   this.fetchImage = function(id, callback) {
      return ImageServiceFactory.fetchImage(id, callback);
   }
});