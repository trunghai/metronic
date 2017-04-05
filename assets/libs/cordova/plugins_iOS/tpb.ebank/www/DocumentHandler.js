/**
 * Created by HaiDT1 on 3/30/2017.
 */

cordova.define("tpb.ebank.DocumentHandler", function(require, exports, module) {
    var myFunc = function (
        successHandler,
        failureHandler,
        url) {
        cordova.exec(
            successHandler,
            failureHandler,
            "DocumentHandler",
            "HandleDocumentWithURL",
            [{"url" : url}]);
    };

    window.handleDocumentWithURL = myFunc;

    if(module && module.exports) {
        module.exports = myFunc;
    }
});

