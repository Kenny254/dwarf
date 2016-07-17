/*! dwarf - v0.1.0 - 2016-07-17
* https://github.com/bonfimtm/dwarf#readme
* Copyright (c) 2016 Thiago Bonfim; Licensed GNU */


function scsmsg(msg) {
    $(".alert-success").show(300);
    $(".alert-success .message-content").append(msg + "<br>");
}

function infmsg(msg) {
    $(".alert-info").show(300);
    $(".alert-info .message-content").append(msg + "<br>");
    setTimeout(function() {
        $(".alert-info").hide(300);
    }, 5000);
}

function wrnmsg(msg) {
    $(".alert-warning").show(300);
    $(".alert-warning .message-content").append(msg + "<br>");
}

function errmsg(msg) {
    $(".alert-danger").show(300);
    $(".alert-danger .message-content").append(msg + "<br>");
}

function clsmsg() {
	var $allAlerts = $(".alert-success .message-content, .alert-info .message-content, .alert-warning .message-content, .alert-danger .message-content");
    $allAlerts.html("");
    $allAlerts.hide(500);
}

function jsonToString(jsonObj) {
    return JSON.stringify(jsonObj, null, 2);
}

function json(jsonObj) {
    $(".json-content").show();
    $(".json-content").append( jsonToString(jsonObj) + "\n");
}

var $mainLoading = $("#mainLoading");

function beginl($loader, $replace) {
    if (typeof $replace !== "undefined") {
    	$replace.hide();
    }
    if (typeof $loader !== "undefined") {
    	$loader.show();
    } else {
    	$mainLoading.show();
    }
}

function endl($loader, $replace) {
    if (typeof $replace !== "undefined") {
        $replace.show();
    }
    if (typeof $loader !== "undefined") {
        $loader.hide();
    } else {
        $mainLoading.hide();
    }
}

function beginr($elm) {
    $elm.find(".fa").addClass("fa-refresh fa-spin");
}

function endr($elm) {
    $elm.find(".fa").removeClass("fa-refresh fa-spin");
}

function beginc($elm) {
    $elm.find(".fa").addClass("fa-cog fa-spin");
}

function endc($elm) {
    $elm.find(".fa").removeClass("fa-cog fa-spin");
}

(function() {
	angular.module('app').controller('AdminCtrl', ['$scope', '$routeParams', "$firebaseAuth", "$firebaseArray", "currentAuth",
		function($scope, $routeParams, $firebaseAuth, $firebaseArray, currentAuth) {

			// currentAuth (provided by resolve) will contain the
			// authenticated user or null if not logged in

			$scope.path = "/admin";

			// ====================================================================================================
			// ====================================================================================================

			$scope.init = function() {};

			$scope.isAuth = function() {
				return typeof currentAuth !== "undefined" && currentAuth !== null;
			};

			// ====================================================================================================
			// ====================================================================================================

			$scope.init();

		}
	]);
})();

(function() {
	angular.module('app').controller("AdminLoginCtrl", ["$scope", "$routeParams", "$firebaseAuth", "$firebaseArray", "currentAuth",
		function($scope, $routeParams, $firebaseAuth, $firebaseArray, currentAuth) {

			// currentAuth (provided by resolve) will contain the
			// authenticated user or null if not logged in

			$scope.path = "/admin/login";
			$scope.auth = $firebaseAuth();

			// ====================================================================================================
			// ====================================================================================================

			$scope.init = function() {};

			$scope.submitLogin = function() {
				beginr($("#signinBtn"));
				$scope.auth.$signInWithEmailAndPassword(
					$scope.email,
					$scope.password
				).then(function(firebaseUser) {
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

		}
	]);
})();

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

(function() {
	angular.module('app').controller('AdminPostFormCtrl', ['$scope', '$routeParams', "$firebaseAuth", "$firebaseObject", "$firebaseArray", "ImageService", "msg",
		function($scope, $routeParams, $firebaseAuth, $firebaseObject, $firebaseArray, ImageService, msg) {

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

				}
				else {
					$scope.initPost();
				}
			};

			$scope.initPost = function() {
				$scope.post = {
					title: null,
					subtitle: null,
					urlAddress: null,
					videoLink: null,
					images: null,
					content: null,
					published: true,
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
					$scope.post.published = $scope.post.published !== "0" ? true : false;
					$("#imageView").css("background-image", "url('img/ajax-loader.gif')");
					beginr($("#submitPostBtn"));
					$scope.post.$save().then(function(ref) {
						endr($("#submitPostBtn"));
						//infmsg("Postagem atualizada.");
						msg.inf("Postagem atualizada.");
						console.log(msg.messages.inf)
						//window.location = "#/admin/posts";
					}, function(error) {
						endr($("#submitPostBtn"));
						console.error(error);
					});
				}
				else {
					// Create
					$scope.post.urlAddress = slug($scope.post.title.toLowerCase());
					$scope.post.createdAt = now;
					$scope.post.published = false;
					beginc($("#submitPostBtn"));
					ref.child("posts").push($scope.post, function(error) {
						endc($("#submitPostBtn"));
						if (error) {
							console.error(error);
						}
						else {
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

		}
	]);
})();

(function() {
	angular.module('app').controller('AdminPostListCtrl', ['$scope', '$routeParams', "$firebaseAuth", "$firebaseArray",
		function($scope, $routeParams, $firebaseAuth, $firebaseArray) {

			$scope.path = "/admin/posts";
			$scope.posts = $firebaseArray(ref.child("posts"));

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

(function() {
  'use strict'

  angular.module('app', [
    'ngRoute',
    'firebase'
  ]);

})();

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

(function() {
    'use strict'

    angular.module('app').directive('staticInclude',
        function($http, $templateCache, $compile) {
            return function(scope, element, attrs) {
                var templatePath = attrs.staticInclude;
                $http.get(templatePath, {
                    cache: $templateCache
                }).success(function(response) {
                    var contents = element.html(response).contents();
                    $compile(contents)(scope);
                });
            };
        });
})();

(function() {
    'use strict'

})();

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

(function() {
	angular.module('app').controller("HomeNavbarCtrl", ["$scope", "$routeParams", "$firebaseAuth",
		function($scope, $routeParams, $firebaseAuth) {



			// ====================================================================================================
			// ====================================================================================================

			$scope.init = function() {};

			// ====================================================================================================
			// ====================================================================================================

			$scope.init();

		}
	]);
})();

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

(function() {
    'use strict'

    angular.module('app')

    .directive('tmMsg', function() {
        return {
            restrict: 'E',
            controller: ["msg", function(msg) {
                var tmMsgCtrl = this;
                
                tmMsgCtrl.messages = msg.messages;
            }],
            controllerAs: "tmMsgCtrl",
            templateUrl: 'partials/msg.html'
        };
    })

    .service('msg', function() {

        var msg = this;

        msg.scs = function(msgContent) {
            msg.messages.scs.push(msgContent);
        }

        msg.inf = function(msgContent) {
            msg.messages.inf.push(msgContent);
        }

        msg.wrn = function(msgContent) {
            msg.messages.wrn.push(msgContent);
        }

        msg.err = function(msgContent) {
            msg.messages.err.push(msgContent);
        }

        msg.init = (function() {
            msg.messages = {
                scs: [],
                inf: [],
                wrn: [],
                err: []
            }
        })();

    });
})();

(function() {
    'use strict'

    angular.module('app').run(["$rootScope", "$location", function($rootScope, $location) {

        $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
            // We can catch the error thrown when the $requireAuth promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $location.path("/admin/login");
            }
        });
    }]);
})();

(function() {
    'use strict'

    angular.module('app')
    
    .service('ImageService', function() {
        var imageService = this;

        imageService.downloadImage = function(id, selector, height) {
            if (typeof id !== "undefined") {
                imageService.fetchImage(id, function(image) {
                    $(selector).find("img").attr("src", image.data);
                    $(selector).find("img").css("height", height ? height : "250px");
                    $(selector).find("img").css("width", "auto");
                    $(selector).find("a").attr("href", image.data);
                });
            }
        };

        imageService.downloadBackground = function(id, selector, height, width) {
            if (typeof id !== "undefined") {
                imageService.fetchImage(id, function(image) {
                    $(selector).css("background-image", "url('" + image.data + "')");
                    $(selector).css("height", height ? height : "100px");
                    $(selector).css("width", width ? width : "100%");
                });
            }
        };

        imageService.fetchImage = function(id, callback) {
            if (typeof id !== "undefined") {
                // A hash was passed in, so let's retrieve and render it.
                ref.child("images").child(id).once('value', function(snap) {
                    var image = snap.val();
                    if (image.data != null) {
                        callback(image);
                    }
                    else {
                        errmsg("Imagem não encontrada.");
                    }
                });
            }
        };
    });
})();

var CryptoJS=CryptoJS||function(i,p){var f={},q=f.lib={},j=q.Base=function(){function a(){}return{extend:function(h){a.prototype=this;var d=new a;h&&d.mixIn(h);d.$super=this;return d},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var d in a)a.hasOwnProperty(d)&&(this[d]=a[d]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}}}(),k=q.WordArray=j.extend({init:function(a,h){a=
this.words=a||[];this.sigBytes=h!=p?h:4*a.length},toString:function(a){return(a||m).stringify(this)},concat:function(a){var h=this.words,d=a.words,c=this.sigBytes,a=a.sigBytes;this.clamp();if(c%4)for(var b=0;b<a;b++)h[c+b>>>2]|=(d[b>>>2]>>>24-8*(b%4)&255)<<24-8*((c+b)%4);else if(65535<d.length)for(b=0;b<a;b+=4)h[c+b>>>2]=d[b>>>2];else h.push.apply(h,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<32-8*(b%4);a.length=i.ceil(b/4)},clone:function(){var a=
j.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var b=[],d=0;d<a;d+=4)b.push(4294967296*i.random()|0);return k.create(b,a)}}),r=f.enc={},m=r.Hex={stringify:function(a){for(var b=a.words,a=a.sigBytes,d=[],c=0;c<a;c++){var e=b[c>>>2]>>>24-8*(c%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var b=a.length,d=[],c=0;c<b;c+=2)d[c>>>3]|=parseInt(a.substr(c,2),16)<<24-4*(c%8);return k.create(d,b/2)}},s=r.Latin1={stringify:function(a){for(var b=
a.words,a=a.sigBytes,d=[],c=0;c<a;c++)d.push(String.fromCharCode(b[c>>>2]>>>24-8*(c%4)&255));return d.join("")},parse:function(a){for(var b=a.length,d=[],c=0;c<b;c++)d[c>>>2]|=(a.charCodeAt(c)&255)<<24-8*(c%4);return k.create(d,b)}},g=r.Utf8={stringify:function(a){try{return decodeURIComponent(escape(s.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return s.parse(unescape(encodeURIComponent(a)))}},b=q.BufferedBlockAlgorithm=j.extend({reset:function(){this._data=k.create();
this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=g.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,d=b.words,c=b.sigBytes,e=this.blockSize,f=c/(4*e),f=a?i.ceil(f):i.max((f|0)-this._minBufferSize,0),a=f*e,c=i.min(4*a,c);if(a){for(var g=0;g<a;g+=e)this._doProcessBlock(d,g);g=d.splice(0,a);b.sigBytes-=c}return k.create(g,c)},clone:function(){var a=j.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});q.Hasher=b.extend({init:function(){this.reset()},
reset:function(){b.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=b.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(b,d){return a.create(d).finalize(b)}},_createHmacHelper:function(a){return function(b,d){return e.HMAC.create(a,d).finalize(b)}}});var e=f.algo={};return f}(Math);
(function(i){var p=CryptoJS,f=p.lib,q=f.WordArray,f=f.Hasher,j=p.algo,k=[],r=[];(function(){function f(a){for(var b=i.sqrt(a),d=2;d<=b;d++)if(!(a%d))return!1;return!0}function g(a){return 4294967296*(a-(a|0))|0}for(var b=2,e=0;64>e;)f(b)&&(8>e&&(k[e]=g(i.pow(b,0.5))),r[e]=g(i.pow(b,1/3)),e++),b++})();var m=[],j=j.SHA256=f.extend({_doReset:function(){this._hash=q.create(k.slice(0))},_doProcessBlock:function(f,g){for(var b=this._hash.words,e=b[0],a=b[1],h=b[2],d=b[3],c=b[4],i=b[5],j=b[6],k=b[7],l=0;64>
l;l++){if(16>l)m[l]=f[g+l]|0;else{var n=m[l-15],o=m[l-2];m[l]=((n<<25|n>>>7)^(n<<14|n>>>18)^n>>>3)+m[l-7]+((o<<15|o>>>17)^(o<<13|o>>>19)^o>>>10)+m[l-16]}n=k+((c<<26|c>>>6)^(c<<21|c>>>11)^(c<<7|c>>>25))+(c&i^~c&j)+r[l]+m[l];o=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&a^e&h^a&h);k=j;j=i;i=c;c=d+n|0;d=h;h=a;a=e;e=n+o|0}b[0]=b[0]+e|0;b[1]=b[1]+a|0;b[2]=b[2]+h|0;b[3]=b[3]+d|0;b[4]=b[4]+c|0;b[5]=b[5]+i|0;b[6]=b[6]+j|0;b[7]=b[7]+k|0},_doFinalize:function(){var f=this._data,g=f.words,b=8*this._nDataBytes,
e=8*f.sigBytes;g[e>>>5]|=128<<24-e%32;g[(e+64>>>9<<4)+15]=b;f.sigBytes=4*g.length;this._process()}});p.SHA256=f._createHelper(j);p.HmacSHA256=f._createHmacHelper(j)})(Math);


(function (root) {
// lazy require symbols table
var _symbols, removelist;
function symbols(code) {
    if (_symbols) return _symbols[code];
    _symbols = require('unicode/category/So');
    removelist = ['sign','cross','of','symbol','staff','hand','black','white']
        .map(function (word) {return new RegExp(word, 'gi')});
    return _symbols[code];
}

function slug(string, opts) {
    string = string.toString();
    if ('string' === typeof opts)
        opts = {replacement:opts};
    opts = opts || {};
    opts.mode = opts.mode || slug.defaults.mode;
    var defaults = slug.defaults.modes[opts.mode];
    var keys = ['replacement','multicharmap','charmap','remove','lower'];
    for (var key, i = 0, l = keys.length; i < l; i++) { key = keys[i];
        opts[key] = (key in opts) ? opts[key] : defaults[key];
    }
    if ('undefined' === typeof opts.symbols)
        opts.symbols = defaults.symbols;

    var lengths = [];
    for (var key in opts.multicharmap) {
        if (!opts.multicharmap.hasOwnProperty(key))
            continue;

        var len = key.length;
        if (lengths.indexOf(len) === -1)
            lengths.push(len);
    }

    var code, unicode, result = "";
    for (var char, i = 0, l = string.length; i < l; i++) { char = string[i];
        if (!lengths.some(function (len) {
            var str = string.substr(i, len);
            if (opts.multicharmap[str]) {
                i += len - 1;
                char = opts.multicharmap[str];
                return true;
            } else return false;
        })) {
            if (opts.charmap[char]) {
                char = opts.charmap[char];
                code = char.charCodeAt(0);
            } else {
                code = string.charCodeAt(i);
            }
            if (opts.symbols && (unicode = symbols(code))) {
                char = unicode.name.toLowerCase();
                for(var j = 0, rl = removelist.length; j < rl; j++) {
                    char = char.replace(removelist[j], '');
                }
                char = char.replace(/^\s+|\s+$/g, '');
            }
        }
        char = char.replace(/[^\w\s\-\.\_~]/g, ''); // allowed
        if (opts.remove) char = char.replace(opts.remove, ''); // add flavour
        result += char;
    }
    result = result.replace(/^\s+|\s+$/g, ''); // trim leading/trailing spaces
    result = result.replace(/[-\s]+/g, opts.replacement); // convert spaces
    result = result.replace(opts.replacement+"$",''); // remove trailing separator
    if (opts.lower)
      result = result.toLowerCase();
    return result;
};

slug.defaults = {
    mode: 'pretty',
};

slug.multicharmap = slug.defaults.multicharmap = {
    '<3': 'love', '&&': 'and', '||': 'or', 'w/': 'with',
};

// https://code.djangoproject.com/browser/django/trunk/django/contrib/admin/media/js/urlify.js
slug.charmap  = slug.defaults.charmap = {
    // latin
    'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE',
    'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I',
    'Î': 'I', 'Ï': 'I', 'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O',
    'Õ': 'O', 'Ö': 'O', 'Ő': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U',
    'Ü': 'U', 'Ű': 'U', 'Ý': 'Y', 'Þ': 'TH', 'ß': 'ss', 'à':'a', 'á':'a',
    'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c', 'è': 'e',
    'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ő': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u',
    'ý': 'y', 'þ': 'th', 'ÿ': 'y', 'ẞ': 'SS',
    // greek
    'α':'a', 'β':'b', 'γ':'g', 'δ':'d', 'ε':'e', 'ζ':'z', 'η':'h', 'θ':'8',
    'ι':'i', 'κ':'k', 'λ':'l', 'μ':'m', 'ν':'n', 'ξ':'3', 'ο':'o', 'π':'p',
    'ρ':'r', 'σ':'s', 'τ':'t', 'υ':'y', 'φ':'f', 'χ':'x', 'ψ':'ps', 'ω':'w',
    'ά':'a', 'έ':'e', 'ί':'i', 'ό':'o', 'ύ':'y', 'ή':'h', 'ώ':'w', 'ς':'s',
    'ϊ':'i', 'ΰ':'y', 'ϋ':'y', 'ΐ':'i',
    'Α':'A', 'Β':'B', 'Γ':'G', 'Δ':'D', 'Ε':'E', 'Ζ':'Z', 'Η':'H', 'Θ':'8',
    'Ι':'I', 'Κ':'K', 'Λ':'L', 'Μ':'M', 'Ν':'N', 'Ξ':'3', 'Ο':'O', 'Π':'P',
    'Ρ':'R', 'Σ':'S', 'Τ':'T', 'Υ':'Y', 'Φ':'F', 'Χ':'X', 'Ψ':'PS', 'Ω':'W',
    'Ά':'A', 'Έ':'E', 'Ί':'I', 'Ό':'O', 'Ύ':'Y', 'Ή':'H', 'Ώ':'W', 'Ϊ':'I',
    'Ϋ':'Y',
    // turkish
    'ş':'s', 'Ş':'S', 'ı':'i', 'İ':'I',
    'ğ':'g', 'Ğ':'G',
    // russian
    'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ё':'yo', 'ж':'zh',
    'з':'z', 'и':'i', 'й':'j', 'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o',
    'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'х':'h', 'ц':'c',
    'ч':'ch', 'ш':'sh', 'щ':'sh', 'ъ':'u', 'ы':'y', 'ь':'', 'э':'e', 'ю':'yu',
    'я':'ya',
    'А':'A', 'Б':'B', 'В':'V', 'Г':'G', 'Д':'D', 'Е':'E', 'Ё':'Yo', 'Ж':'Zh',
    'З':'Z', 'И':'I', 'Й':'J', 'К':'K', 'Л':'L', 'М':'M', 'Н':'N', 'О':'O',
    'П':'P', 'Р':'R', 'С':'S', 'Т':'T', 'У':'U', 'Ф':'F', 'Х':'H', 'Ц':'C',
    'Ч':'Ch', 'Ш':'Sh', 'Щ':'Sh', 'Ъ':'U', 'Ы':'Y', 'Ь':'', 'Э':'E', 'Ю':'Yu',
    'Я':'Ya',
    // ukranian
    'Є':'Ye', 'І':'I', 'Ї':'Yi', 'Ґ':'G', 'є':'ye', 'і':'i', 'ї':'yi', 'ґ':'g',
    // czech
    'č':'c', 'ď':'d', 'ě':'e', 'ň': 'n', 'ř':'r', 'š':'s', 'ť':'t', 'ů':'u',
    'ž':'z', 'Č':'C', 'Ď':'D', 'Ě':'E', 'Ň': 'N', 'Ř':'R', 'Š':'S', 'Ť':'T',
    'Ů':'U', 'Ž':'Z',
    // polish
    'ą':'a', 'ć':'c', 'ę':'e', 'ł':'l', 'ń':'n', 'ś':'s', 'ź':'z',
    'ż':'z', 'Ą':'A', 'Ć':'C', 'Ę':'E', 'Ł':'L', 'Ń':'N', 'Ś':'S',
    'Ź':'Z', 'Ż':'Z',
    // latvian
    'ā':'a', 'ē':'e', 'ģ':'g', 'ī':'i', 'ķ':'k', 'ļ':'l', 'ņ':'n',
    'ū':'u', 'Ā':'A', 'Ē':'E', 'Ģ':'G', 'Ī':'I',
    'Ķ':'K', 'Ļ':'L', 'Ņ':'N', 'Ū':'U',
    // lithuanian
    'ė':'e', 'į':'i', 'ų':'u', 'Ė': 'E', 'Į': 'I', 'Ų':'U',
    // romanian
    'ț':'t', 'Ț':'T', 'ţ':'t', 'Ţ':'T', 'ș':'s', 'Ș':'S', 'ă':'a', 'Ă':'A',
    // vietnamese
    'Ạ': 'A', 'Ả': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
    'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ẹ': 'E', 'Ẻ': 'E',
    'Ẽ': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ị': 'I',
    'Ỉ': 'I', 'Ĩ': 'I', 'Ọ': 'O', 'Ỏ': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O',
    'Ổ': 'O', 'Ỗ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O',
    'Ỡ': 'O', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U',
    'Ự': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ỳ': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
    'Đ': 'D', 'ạ': 'a', 'ả': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a',
    'ẫ': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ẹ': 'e',
    'ẻ': 'e', 'ẽ': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ị': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ọ': 'o', 'ỏ': 'o', 'ồ': 'o', 'ố': 'o',
    'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o',
    'ở': 'o', 'ỡ': 'o', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u',
    'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u', 'ỳ': 'y', 'ỵ': 'y', 'ỷ': 'y',
    'ỹ': 'y', 'đ': 'd',
    // currency
    '€': 'euro', '₢': 'cruzeiro', '₣': 'french franc', '£': 'pound',
    '₤': 'lira', '₥': 'mill', '₦': 'naira', '₧': 'peseta', '₨': 'rupee',
    '₩': 'won', '₪': 'new shequel', '₫': 'dong', '₭': 'kip', '₮': 'tugrik',
    '₯': 'drachma', '₰': 'penny', '₱': 'peso', '₲': 'guarani', '₳': 'austral',
    '₴': 'hryvnia', '₵': 'cedi', '¢': 'cent', '¥': 'yen', '元': 'yuan',
    '円': 'yen', '﷼': 'rial', '₠': 'ecu', '¤': 'currency', '฿': 'baht',
    "$": 'dollar', '₹': 'indian rupee',
    // symbols
    '©':'(c)', 'œ': 'oe', 'Œ': 'OE', '∑': 'sum', '®': '(r)', '†': '+',
    '“': '"', '”': '"', '‘': "'", '’': "'", '∂': 'd', 'ƒ': 'f', '™': 'tm',
    '℠': 'sm', '…': '...', '˚': 'o', 'º': 'o', 'ª': 'a', '•': '*',
    '∆': 'delta', '∞': 'infinity', '♥': 'love', '&': 'and', '|': 'or',
    '<': 'less', '>': 'greater',
};

slug.defaults.modes = {
    rfc3986: {
        replacement: '-',
        symbols: true,
        remove: null,
        lower: true,
        charmap: slug.defaults.charmap,
        multicharmap: slug.defaults.multicharmap,
    },
    pretty: {
        replacement: '-',
        symbols: true,
        remove: /[.]/g,
        lower: false,
        charmap: slug.defaults.charmap,
        multicharmap: slug.defaults.multicharmap,
    },
};

// Be compatible with different module systems

if (typeof define !== 'undefined' && define.amd) { // AMD
    // dont load symbols table in the browser
    for (var key in slug.defaults.modes) {
        if (!slug.defaults.modes.hasOwnProperty(key))
            continue;

        slug.defaults.modes[key].symbols = false;
    }
    define([], function () {return slug});
} else if (typeof module !== 'undefined' && module.exports) { // CommonJS
    symbols(); // preload symbols table
    module.exports = slug;
} else { // Script tag
    // dont load symbols table in the browser
    for (var key in slug.defaults.modes) {
        if (!slug.defaults.modes.hasOwnProperty(key))
            continue;

        slug.defaults.modes[key].symbols = false;
    }
    root.slug = slug;
}

}(this));
