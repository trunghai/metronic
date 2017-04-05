cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins_Android/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins_Android/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins_Android/org.apache.cordova.camera/www/CameraConstants.js",
        "id": "org.apache.cordova.camera.Camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "file": "plugins_Android/org.apache.cordova.camera/www/CameraPopoverOptions.js",
        "id": "org.apache.cordova.camera.CameraPopoverOptions",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "file": "plugins_Android/org.apache.cordova.camera/www/Camera.js",
        "id": "org.apache.cordova.camera.camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "file": "plugins_Android/org.apache.cordova.camera/www/CameraPopoverHandle.js",
        "id": "org.apache.cordova.camera.CameraPopoverHandle",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
    {
        "file": "plugins_Android/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
	{
        "file": "plugins_iOS/tpb.ebank/www/THTouchID.js",
        "id": "tpb.ebank.THEBTouchID",
        "clobbers": [
            "THEBTouchID"
        ]
    },
    {
        "file": "plugins_Android/phonegap-plugin-barcodescanner/www/barcodescanner.js",
        "id": "phonegap-plugin-barcodescanner.BarcodeScanner",
        "clobbers": [
            "barcodeScanner"
        ]
    },
    {
        "file": "plugins_Android/tpb.ebank/www/GoogleMap.js",
        "id": "tpb.ebank.GoogleMap",
        "clobbers": [
            "googleMap"
        ]
    },
    {
        "file": "plugins_Android/tpb.ebank/www/CheckReboot.js",
        "id": "tpb.ebank.CheckReboot",
        "clobbers": [
            "checkReboot"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.splashscreen": "1.0.0",
    "org.apache.cordova.inappbrowser": "0.6.0",
    "org.apache.cordova.camera": "0.3.6",
    "org.apache.cordova.geolocation": "0.3.12",
    "cordova-plugin-device": "1.0.1-dev",
    "phonegap-plugin-barcodescanner": "4.0.1"
}
// BOTTOM OF METADATA
});