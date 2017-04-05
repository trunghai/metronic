/**
 * Created by DungLHQ on 1/26/2016.
 */
cordova.define("tpb.ebank.CheckReboot", function(require, exports, module) {

    var exec = require("cordova/exec");


    function CheckReboot() {
    };


    CheckReboot.prototype.check = function (successCallback, errorCallback, config) {

        if(config instanceof Array) {
            // do nothing
        } else {
            if(typeof(config) === 'object') {
                config = [ config ];
            } else {
                config = [];
            }
        }

        if (errorCallback == null) {
            errorCallback = function () {
            };
        }

        if (typeof errorCallback != "function") {
            console.log("CheckReboot.scan failure: failure parameter not a function");
            return;
        }

        if (typeof successCallback != "function") {
            console.log("CheckReboot.scan failure: success callback parameter must be a function");
            return;
        }

        exec(successCallback, errorCallback, 'CheckReboot', 'check', config);
    };

    var checkReboot = new CheckReboot();
    module.exports = checkReboot;

});