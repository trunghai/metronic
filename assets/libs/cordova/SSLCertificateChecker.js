"use strict";
function SSLCertificateChecker() {
}

SSLCertificateChecker.prototype.check = function (successCallback, errorCallback, serverURL, allowedSHA1Fingerprint, allowedSHA1FingerprintAlt) {
  if (typeof errorCallback != "function") {
    console.log("SSLCertificateChecker.find failure: errorCallback parameter must be a function");
    return
  }
	else {
		console.log("SSLCertificateChecker.find success: found fail function");
	}
  if (typeof successCallback != "function") {
    console.log("SSLCertificateChecker.find failure: successCallback parameter must be a function");
    return
  }
  else {
	  console.log("SSLCertificateChecker.find success: found success function");
	 }
  cordova.exec(successCallback, errorCallback, "SSLCertificateChecker", "check", [serverURL, allowedSHA1Fingerprint, allowedSHA1FingerprintAlt]);
};

SSLCertificateChecker.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.sslCertificateChecker = new SSLCertificateChecker();
  return window.plugins.sslCertificateChecker;
};

cordova.addConstructor(SSLCertificateChecker.install);