/**
 * Created by HaiDT1 on 2/9/2017.
 */

/*** DEVICE STATUS ***/
var CONST_APP_VERSION = "5.0.1";
var CONST_APP_NAME = "GPRS_WAP";

var CONST_APP_WEB_CONFIG = "GPRS_WEB"; //do not change
var CONST_APP_IPHONE_CONFIG = "GPRS_IPHONE"; //do not change
var CONST_APP_ANDROID_CONFIG = "GPRS_ANDROID"; //do not change

/*** DEVICE STATUS END ***/

/*** DEFINE SERVICE CODE WILL QUERY INFO AFTER CHANGE ACCOUNT ***/

var CONST_SERVICE_CODE_QUERY_ACCOUNT = ['17', '110', '19', '18', '150'];

var CONST_DEBUG_MODE = true;  //change DEBUG MODE
var CONST_BROWSER_MODE = true;  //change APP/BROWSER MODE
var CONST_DESKTOP_MODE = true;  //using auto-update view when resize windows

//NOTE FOR iOS remove code at comment: DISABLE_FOR_APP_iOS

var CONST_WEB_URL_LINK = "http://localhost:8088/"; //using for mobile app
var CONST_WEB_CORP_URL_LINK = "https://ebank.tpb.vn/ibank/entry"; //using for mobile app


var CONST_WEB_SERVICE_LINK = CONST_DEBUG_MODE? "http://localhost:8090/EBCorpServer/ebservice" : "http://localhost:8090/EBCorpServer/ebservice";

