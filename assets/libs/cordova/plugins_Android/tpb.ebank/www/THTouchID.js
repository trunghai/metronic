
cordova.define("tpb.ebank.THEBTouchID", function(require, exports, module) {

module.exports = {
  alert: function(title, message, buttonLabel, successCallback, failCallback) {
    cordova.exec(successCallback,
                 null, // No failure callback
                 "THEBTouchID",
                 "alert",
                 [title, message, buttonLabel]);
  }
};

});