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