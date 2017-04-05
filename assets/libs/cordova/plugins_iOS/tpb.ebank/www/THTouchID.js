
cordova.define("tpb.ebank.THEBTouchID", function(require, exports, module) {

module.exports = {
  alert: function(title, message, buttonLabel, successCallback, failCallback) {
    cordova.exec(successCallback,
                 failCallback, //null, // No failure callback
                 "THEBTouchID",
                 "alert",
                 [title, message, buttonLabel]);
  },
  checkTouchID: function(title, successCallback, failCallback) {
    cordova.exec(successCallback,
                 failCallback, 
                 "THEBTouchID",
                 "checkTouchID",
                 [title]);
  },
  init3DTouch: function(title, successCallback, failCallback) {
    cordova.exec(successCallback,
                 failCallback, 
                 "THEBTouchID",
                 "init3DTouch",
                 [title]);
  },
  received3DTouch: function(title, successCallback, failCallback) {
    cordova.exec(successCallback,
                 failCallback, 
                 "THEBTouchID",
                 "received3DTouch",
                 [title]);
  },
  quitApplication: function(title, successCallback, failCallback) {
    cordova.exec(successCallback,
                 failCallback, 
                 "THEBTouchID",
                 "quitApplication",
                 [title]);
  },
  checkRebootTime: function(title, successCallback, failCallback) {
    cordova.exec(successCallback,
                 failCallback, 
                 "THEBTouchID",
                 "checkRebootTime",
                 [title]);
  },
  /*,
  getTokenDevice: function(title, successCallback, failCallback) {
  	cordova.exec(successCallback,
                 failCallback, 
                 "THEBTouchID",
                 "getTokenDevice",
                 [title]);
  },
  */
  showFingerprintWithPIN: function(title, message, buttonLabel, successCallback, failCallback) {
    cordova.exec(successCallback,
                 failCallback, //null, // No failure callback
                 "THEBTouchID",
                 "showFingerprintWithPIN",
                 [title, message, buttonLabel]);
  }
  
};

});