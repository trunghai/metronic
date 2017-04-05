/**
 * Created by DungLHQ on 1/25/2016.
 */
cordova.define("tpb.ebank.GoogleMap", function(require, exports, module) {

    var exec = require("cordova/exec");


    function GoogleMap() {
    };


    GoogleMap.prototype.call = function (successCallback, errorCallback, data, config) {

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
            console.log("GoogleMap.scan failure: failure parameter not a function");
            return;
        }

        if (typeof successCallback != "function") {
            console.log("GoogleMap.scan failure: success callback parameter must be a function");
            return;
        }

        exec(successCallback, errorCallback, 'GoogleMap', data, config);
    };

    var googleMap = new GoogleMap();
    module.exports = googleMap;

});