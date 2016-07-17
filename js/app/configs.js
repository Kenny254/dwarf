(function() {
    'use strict'

    angular.module('app')
    
    .config(['$routeProvider', '$locationProvider',
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
                    "currentAuth": ["$firebaseAuth", function($firebaseAuth) {
                        // $waitForAuth returns a promise so the resolve waits for it to complete
                        return $firebaseAuth().$waitForSignIn();
                    }]
                }
            }).


            when('/admin', {
                templateUrl: 'partials/admin/home.html',
                controller: 'AdminCtrl',
                resolve: {
                    // controller will not be loaded until $requireSignIn resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": ["$firebaseAuth", function($firebaseAuth) {
                        // $requireSignIn returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return $firebaseAuth().$requireSignIn();
                    }]
                }
            }).

            when('/admin/posts', {
                templateUrl: 'partials/admin/post-list.html',
                controller: 'AdminPostListCtrl',
                resolve: {
                    "currentAuth": ["$firebaseAuth", function($firebaseAuth) {
                        return $firebaseAuth().$requireSignIn();
                    }]
                }
            }).
            when('/admin/create/post', {
                templateUrl: 'partials/admin/post-form.html',
                controller: 'AdminPostFormCtrl',
                resolve: {
                    "currentAuth": ["$firebaseAuth", function($firebaseAuth) {
                        return $firebaseAuth().$requireSignIn();
                    }]
                }
            }).
            when('/admin/edit/post/:postId', {
                templateUrl: 'partials/admin/post-form.html',
                controller: 'AdminPostFormCtrl',
                resolve: {
                    "currentAuth": ["$firebaseAuth", function($firebaseAuth) {
                        return $firebaseAuth().$requireSignIn();
                    }]
                }
            }).


            otherwise({
                redirectTo: '/'
            });

        }
    ])

    .config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'https://www.youtube.com/embed/**'
        ]);
    });

})();