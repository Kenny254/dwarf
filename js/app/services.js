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