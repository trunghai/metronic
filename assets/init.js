/**
 * Created by HuyNT2.
 * Update: HuyNT2
 * Date: 11/4/13
 * Time: 5:35 PM
 */


function loaded() {
    //alert(JSON.stringify(bowser, null, '    ')); //check browser
    //add listener PhoneGap
    if (!CONST_BROWSER_MODE) {
        loadPhoneGapJS();
        document.addEventListener("deviceready", onDeviceReady, true);

        if (Environment.isIOS()) {
        }
    } else {
        //		document.getElementById('id.qrcode.btn').style.display = 'none';
        document.getElementById('btnQRcode').style.display = 'none';
    }

    //Chuyen toan bo thanh WEB
     CONST_APP_NAME = CONST_APP_WEB_CONFIG;
    //Neu khong phai la mobile thi chuyen WAP--> WEB
/*    if (!Environment.isMobile()) {
        CONST_APP_NAME = CONST_APP_WEB_CONFIG;

    } else {
        if (Environment.isAndroid()) {
            CONST_APP_NAME = CONST_APP_ANDROID_CONFIG;
        } else if (Environment.isIOS()) {
            CONST_APP_NAME = CONST_APP_IPHONE_CONFIG;
        }
    }*/

    //set time out
    setTimerCheckLogout();

    //disable right click
    if (document.layers) {
        document.captureEvents('mousedown');
        document.onmousedown = clickNS;
    }
    else {
        document.onmouseup = clickNS;
        document.oncontextmenu = clickIE;
    }

    //get language config
    gUserInfo.lang = getLanguageConfig();
    initLanguageOnIB();

    //store raw menu
    //gMenuRawData = document.getElementById('menu-section').innerHTML;
    //changeLanguageInNodeWithClass('langNoStyle');


    // SangNt1 ---- evtEBNativeInfo

    document.addEventListener('evtEBNativeInfo', function (e) {
        console.log("dunglhq event listener");
        if (e[0] == "REGISTER_TOKEN") {
            if (gIsRegisterNotify == "0") {
                gIsRegisterNotify = "1";
                gDeviceNotifyToken = e[1];//save gDeviceNotifyToken for register Notify after login
                gDeviceTokenPush = device.uuid;
                if (gDeviceTokenPush == null)
                    gDeviceTokenPush = "";

                localStorage.gDeviceTokenPush = gDeviceTokenPush;

                var arrayArgs = new Array();
                arrayArgs.push(gDeviceNotifyToken);
                arrayArgs.push(device.uuid);
               // alert("Check xem co dang ky notification hay khong : gDeviceNotifyToken " + gDeviceNotifyToken + "-------device.uuid " + device.uuid);
                /*var divNotifi = document.getElementById("notification-id");
				divNotifi.setAttribute("onClick","window.open('./index-non-ebank.html?menu=notification&devtoken="+ gDeviceTokenPush +"','_self');");*/
                //alert(gDeviceNotifyToken);
                //alert(device.uuid);

                requestBacgroundMBService('CMD_TYPE_POST_DEVICE_TOKEN', arrayArgs, eventNativeInfoSuccess, eventNativeInfoFail);

            }

        } else if (e[0] == "OPEN_NOTIFICATION") {

            openLinkInWindows(e[1]);
            var arrayArgs = new Array();
            arrayArgs.push(gDeviceTokenPush);
            arrayArgs.push(e[2]);
            arrayArgs.push("R");
            requestBacgroundMBService('CMD_TYPE_READ_NOTIFICATION', arrayArgs, eventNativeInfoSuccess, eventNativeInfoFail);
        } else if (e[0] == "AUTHEN_TOKENKEY") {
            console.log("dunglhq receiver key:  " + e[1]);
            document.getElementById("authen.tokenkey").value = e[1];
        } else if (e[0] == "REBOOT_EVENT") {
            console.log("dunglhq receiver REBOOT_EVENT:  ");

        }else if(e[0] == "backbutton"){
            onBackKeyDown();
        }



    }, false);

    function eventNativeInfoSuccess(e) {
        console.log("eventnativeInfoSuccess" + e);
        getCountDataNotificationUnread();

    }

    function eventNativeInfoFail(e) {
        console.log("eventNativeInfoFail" + e);
    }




    //End SangNt1 ---- evtEBNativeInfo

    //document.addEventListener('touchmove', function (e) {
    //e.preventDefault();
    //}, false);

    applyDynamicCommonStyleSheet();
    if (hasPageJS) applyDynamicPageStyleSheet(false);

    //navController.setDefaultPage('login-scr');
    //TUANNM5 REACTIVE
    if (getURLParam('def') && getURLParam('def').length > 0) {
        localStorage.gIdUser = getURLParam('def');
        navController.initWithRootView('reactive-cust-ebank-scr', true);
    } else {
        navController.initWithRootView('login-scr', true);
    }
    //TUANNM5 REACTIVE END

    content = new slideInMenu('mainview', false);
    contentPromotion = new slideInMenu('mainview', false, true);
    promotionSection = document.getElementById('promotion-section');
    //promotionSection.style.display = 'block';
    //updatePromotionView();

    HandleTouchEvent();
    updateMainContentWidth();

    /*if(CONST_DESKTOP_MODE) {
		(function() {
			//var startingTime = new Date().getTime();
			// Load the script
			var script = document.createElement("SCRIPT");
			script.src = './assets/libs/jquery.js';
			script.type = 'text/javascript';
			document.getElementsByTagName("head")[0].appendChild(script);
			
			// Poll for jQuery to come into existance
			var checkReady = function(callback) {
				if (window.jQuery) {
					callback(jQuery);
				}
				else {
					window.setTimeout(function() { 
						checkReady(callback); 
					}, 20);
				}
			};
		
			// Start polling...
			checkReady(function($) {
				$(function() {
					//var endingTime = new Date().getTime();
					//var tookTime = endingTime - startingTime;
					//window.alert("jQuery is loaded, after " + tookTime + " milliseconds!");
				});
			});
		})();
	}*/

    // get news data
    //	getNewsFromSV();

    //suggest download app
    if (CONST_BROWSER_MODE && !getURLParam('cif')) {
        var downloadStatus = getAgreeDownloadApp();
        //if(downloadStatus == 'Y' && (Environment.isAndroid() || (true))) {
        if (downloadStatus == 'N' && (Environment.isAndroid() || (Environment.isIOS() && !Environment.isWindows()))) {
            showAlertAppText(CONST_STR.get('BANNER_ALERT_MOBILE_APP_CONTENT'), CONST_STR.get('BANNER_ALERT_MOBILE_BTN_OK'), CONST_STR.get('BANNER_ALERT_MOBILE_BTN_CANCEL'));
            document.addEventListener('alertAppConfirmOK', downloadAppSelectionOK, false);
            document.addEventListener('alertAppConfirmCancel', downloadAppSelectionCancel, false);
        }
    }

    //3D touch event
    document.addEventListener("evtTouch3D", quickActionTouch3D, true);


    //neu la iPad thi chuyen icon phone thanh icon chat
    /*if(isIPad) {
		document.getElementById('mainlayoutfooter').getElementsByClassName('callsupport')[0].innerHTML = document.getElementById('pageFooter').getElementsByClassName('callsupport')[0].innerHTML;
	}*/
    //load menu
    //store raw menu
    gMenuRawData = document.getElementById('menu-section').innerHTML;

    var wrapper = document.getElementById('wrapper_jumboAcc');
    if (wrapper != null) {
        gJumboMenuElements = document.getElementById('wrapper_jumboAcc').innerHTML;
    }
    applyDynamicCommonStyleSheet();
    changeLanguageInNodeWithClass('langNoStyle');



    //Load config and libs
    loadjscssfile('./assets/libs/calendar/datepicker.css', 'css');
    loadjscssfile('./assets/libs/calendar/datepicker.js', 'js');
    loadjscssfile('./assets/libs/slip.js', 'js');

    setTimeout(function () {
        loadjscssfile(CONST_WEB_URL_LINK + 'assets/system-payment-config.js', 'js');
        loadjscssfile(CONST_WEB_URL_LINK + 'assets/sysdata/paymentComboFields.js', 'js');
        loadjscssfile(CONST_WEB_URL_LINK + 'assets/sysdata/paymentGroups.js', 'js');
        loadjscssfile(CONST_WEB_URL_LINK + 'assets/sysdata/paymentProviders.js', 'js');
        loadjscssfile(CONST_WEB_URL_LINK + 'assets/sysdata/paymentRequestFields.js', 'js');
        loadjscssfile(CONST_WEB_URL_LINK + 'assets/sysdata/paymentServices.js', 'js');
        setTimeout(function () {
            loadjscssfile(CONST_WEB_URL_LINK + 'assets/sysdata/branchInterbanks.js', 'js');
            loadjscssfile(CONST_WEB_URL_LINK + 'assets/sysdata/branchs.js', 'js');
            loadjscssfile(CONST_WEB_URL_LINK + 'assets/sysdata/countries.js', 'js');
            loadjscssfile(CONST_WEB_URL_LINK + 'assets/sysdata/districts.js', 'js');
            loadjscssfile(CONST_WEB_URL_LINK + 'assets/sysdata/interbanks.js', 'js');
            loadjscssfile(CONST_WEB_URL_LINK + 'assets/sysdata/provinces.js', 'js');
            loadjscssfile(CONST_WEB_URL_LINK + 'assets/system-data.js', 'js');
        }, 1000);
//        reloadTopBanner();
    }, 1000);

    //HuyNT2: Check page load ready
    /*var timerCheckPageReady = window.setInterval(checkPageReady, 500);
	var timerTimeOutConnect = 0;
    function checkPageReady() {
        if (document.getElementsByTagName('body')[0] !== undefined && currentPage !== undefined && CONST_APP_NAME !== undefined && gUserInfo !== undefined && document.getElementById('current_md5_capcha') !== undefined) {
			window.clearInterval(timerCheckPageReady);
			document.getElementById('bodyPage').style.display = 'block';
			document.getElementById('loadingPage').style.display = 'none';
			document.getElementById('loadingPage').innerHTML = '';
        }
		else {
			if (timerTimeOutConnect > 60) {
				window.clearInterval(timerCheckPageReady);
				document.getElementById('loadingPage').innerHTML = "<div style='color: #F1F1F1; font-size: 125%; margin-top: 30%;'>Connection to server timed out</div>";
			}
			timerTimeOutConnect++;
		}
    }*/
    // Sangnt1 ------ getCount Notification
    getCountDataNotificationUnread();
    var getCountPush = setInterval(function () {
        getCountDataNotificationUnread();
    }, 1 * 60000);

//    testUserControls();

}


function testUserControls() {

    //pass over testting... comment if you want to test something right on the login page...
    // return;

    handlerFloatingButton('fullPage');
    //var screenW = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
    //var screenH = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);


    //var bottomBar = new BottomBar({
    //    screenWidth: screenW,
    //    screenHeight: screenH,
    //    backgroundColor: '#825896',
    //    lineHeightNormal: 1,
    //    lineColorNormal: '#a177a9',
    //    totalItem: 4,
    //    iconNormal: ["home.png", "write.png", "wallet.png", "stopwatch.png"],
    //    iconSelected: ["home_active.png", "write_active.png", "wallet_active.png", "stopwatch_active.png"],
    //    textContent: ["Gần đây", "Mẫu chuyển tiền", "Danh bạ", "Lệnh chuyển tiền định kỳ"],
    //    textColorNomal: '#ffffff',
    //    textColorSelected: '#fb9600',
    //    selectIndex: function (indexTabar) {
    //        console.log('khanhduy.le : ' + indexTabar);
    //    }
    //});

    //bottomBar.showBottomBar('mainview');




    //var bottomBar = new BottomBar({
    //screenWidth: screenW,
    //screenHeight: screenH,
    //height: 40,
    //backgroundColor: '#825896',
    //backgroundColorSelected: '#6F4182',
    //totalItem: 2,
    //textContent: ["Gần đây", "Mẫu chuyển tiền", "Danh bạ", "Lệnh chuyển tiền định kỳ"],
    //textColorNomal: '#ffffff',
    //textColorSelected: '#ff8e01',
    //lineHeightNormal: 1,
    //lineHeightSelected: 4,
    //lineColorNormal: '#a177a9',
    //lineColorSelected: '#ff8e01',
    //selectIndex: function (indexTabar) {
    //console.log('khanhduy.le : ' + indexTabar);
    //}
    //});

    // bottomBar.showBottomBar('mainview');
    //bottomBar.setSelectedtAtIndex(1);
    //bottomBar.removeSelected();*/

    //var pieChart = new PieChart({
    //    width: screenW,
    //    textColor: '#ffffff',
    //    weightLine: 2,
    //    textSizePercent : 32,
    //    textSizeTitle : 18,
    //    paddingTitle : 10,
    //    totalItems: 7,
    //    stepTouch : 15,
    //    titleItems: ["Tổng quan", "Tài khoản", "Tài khoản thẻ", "Thẻ tín dụng", "Test bieu do", "Tổng quan1", "Tài khoản1"],
    //    percentItemsTitle: ["155,5", "68,9", "150", "170","100,2", "50" , "80"],
    //    percentItems: [40.5, 88.6, 50.8, 80.99, 70.5, 88.6, 50.8],
    //    strokeColors: ["#FF0000", "#22b14c", "#ff00ff", "#ff7f27", "#0000FF", "#ffee11", "#0095D5"],
    //    textColor: "#ffffff",
    //    beginSelectIndex: function (index) {
    //        console.log('khanhduy.le : begin select ' + index);
    //    },
    //    endSelectIndex: function (index) {
    //        console.log('khanhduy.le : end select ' + index);
    //    }
    //});
    //pieChart.showChart("mainview");





    //var recycler = new RecyclerView({
    //    type: "ACTION",
    //    typeTextAlign: "MIDLE",
    //    title: "Chuyển tiền",
    //	titleAlign:"LEFT",
    //	opacity:false
    //});
    //var arrItem = new Array();
    //var arrData = new Array();
    //arrItem.push("chuyen tien");
    //arrItem.push("dinh ky");
    //for(var i=0;i<10;i++){
    //	arrData.push(arrItem);
    //}

    //recycler.setData(arrData);
    //recycler.init();
}

function myFunction() {
    navController.popView();
}

/*
 function View(nameScreen) {
     this.nameScreen = nameScreen;
     this.parentView = null;
     this.childrenViews = new Array();
 }

||||||| .r6800


=======
>>>>>>> .r6913
 function ManagerView(nameView) {
     var _view = new View(nameView);
     this._root = _view;
     this._currentView = _view;
 }

 ManagerView.prototype.traverseDF = function (callback) {

     // this is a recurse and immediately-invoking function
     (function recurse(currentNode) {
         // step 2
         for (var i = 0, length = currentNode.children.length; i < length; i++) {
             // step 3
             recurse(currentNode.children[i]);
         }

         // step 4
         callback(currentNode);

         // step 1
     })(this._root);

 };

 ManagerView.prototype.traverseBF = function (callback) {
     var queue = new Queue();

     queue.enqueue(this._root);

     currentTree = queue.dequeue();

     while (currentTree) {
         if (currentTree.childrenViews) {
             for (var i = 0, length = currentTree.childrenViews.length; i < length; i++) {
                 queue.enqueue(currentTree.childrenViews[i]);
             }
         }

         callback(currentTree);
         currentTree = queue.dequeue();
     }
 };

 ManagerView.prototype.add = function (data, toData, traversal) {
     var child = new View(data),
         parent = null,
         callback = function (node) {
             if (node.nameScreen === toData) {
                 parent = node;
             }
         };

     this.contains(callback, traversal);

     if (parent) {
         parent.childrenViews.push(child);
         child.parentView = parent;
     } else {
         throw new Error('Cannot add node to a non-existent parent.');
     }
 };

 ManagerView.prototype.remove = function (data, fromData, traversal) {
     var tree = this,
         parent = null,
         childToRemove = null,
         index;

     var callback = function (node) {
         if (node.nameScreen === fromData) {
             parent = node;
         }
     };

     this.contains(callback, traversal);

     if (parent) {
         index = findIndex(parent.childrenViews, data);

         if (index === undefined) {
             throw new Error('Node to remove does not exist.');
         } else {
             childToRemove = parent.childrenViews.splice(index, 1);
         }
     } else {
         throw new Error('Parent does not exist.');
     }

     return childToRemove;
 };

 ManagerView.prototype.contains = function (callback, traversal) {
     traversal.call(this, callback);
 };

 ManagerView.prototype.setSelectView = function(data){
    
 }

 function findIndex(arr, data) {
     var index;

     for (var i = 0; i < arr.length; i++) {
         if (arr[i].nameScreen === data) {
             index = i;
         }
     }

     return index;
 }


 var Queue = function () {
     this.first = null;
     this.size = 0;
 };

 var Node = function (data) {
     this.data = data;
     this.next = null;
 };

 Queue.prototype.enqueue = function (data) {
     var node = new Node(data);

     if (!this.first) {
         this.first = node;
     } else {
         n = this.first;
         while (n.next) {
             n = n.next;
         }
         n.next = node;
     }

     this.size += 1;
     return node;
 };

 Queue.prototype.dequeue = function () {
     temp = this.first;
     if(this.first)
        this.first = this.first.next;
     this.size -= 1;
     return temp;
 };
 */
//3D touch event
function quickActionTouch3D(e) {
    //document.removeEventListener('evtTouch3D', quickActionTouch3D, false);

    if (e[0] == 'shortcut_1') {
        logout();
    } else if (e[0] == 'shortcut_2') {
        var pinpadDiv = document.getElementById("div-pinpad");
        if (pinpadDiv != null) {
            pinpadDiv.style.display = "none";
        }

        showSlidePromotion();
    } else if (e[0] == 'shortcut_3') {
        showLoadingMask();
        displayPromotionSection(false);
        displayMenuSection(false);
        setTimeout(function () {
            window.open('./index-non-ebank.html?menu=rate&ver=app', '_self');
        }, 500);
    } else if (e[0] == 'shortcut_4') {
        showLoadingMask();
        displayPromotionSection(false);
        displayMenuSection(false);
        setTimeout(function () {
            window.open('./index-non-ebank.html?menu=branch&ver=app', '_self');
        }, 500);
    }
    THEBTouchID.received3DTouch('abc', function () {

    }, function () {

    });
}

//function reloadTopBanner() {
//    var tmpTopBanner = "";
//    for (var k = 0; k < bannersTPBank.topBanner.length; k++) {
//        if (gUserInfo.lang == 'EN') {
//            tmpTopBanner += '<a href="' + bannersTPBank.topBanner[k].bannerLinkEN + '"> <img src="' + bannersTPBank.topBanner[k].bannerImageEN + '" alt="" /> </a>';
//        }
//        else {
//            tmpTopBanner += '<a href="' + bannersTPBank.topBanner[k].bannerLinkVN + '" target="_blank"> <img src="' + bannersTPBank.topBanner[k].bannerImageVN + '" alt="" /> </a>';
//        }
//    }
//
//    document.getElementById('slideShow').innerHTML = '<div id="sliderFrame">' +
//                      '<div id="slider"> ' + tmpTopBanner +
//					  '</div></div>';
//}

/*function closeBannerSuggestApp() {
	document.getElementById('banner-suggest-id').style.display = 'none';
}*/

function downloadAppSelectionOK() {
    downloadAppSelectionCancel();
    setAgreeDownloadApp('Y');
    if (Environment.isIOS() && !Environment.isWindows()) {
        openLinkInWindows(CONST_WEB_URL_LINK + 'app/');
    }
    else if (Environment.isAndroid()) {
        openLinkInWindows(CONST_WEB_URL_LINK + 'app/');
    }

}
function downloadAppSelectionCancel() {
    setAgreeDownloadApp('N');
    document.removeEventListener('alertAppConfirmOK', downloadAppSelectionOK, false);
    document.removeEventListener('alertAppConfirmCancel', downloadAppSelectionCancel, false);
}

function reloadNews() {
    //	getNewsFromSV();
}

function getNewsFromSV() {
    //	try{
    //		var arrayArgs = new Array();
    //		arrayArgs.push("PROMOTION");
    //		//arrayArgs.push("NEW#1#HN");
    //		requestBacgroundMBService("CMD_TYPE_GET_PROMOTION", arrayArgs, requestQuickPromotionSuccess, requestQuickPromotionFail);
    //		//var docXsl = getCachePageXsl("newsxsl/list_news_cat_menu_scr");
    //		//genHTMLStringWithXML(docXml, docXsl, successMenuNewsCallback, failMenuNewsCallback);
    //	}
    //	catch (err){
    //		logInfo(err.message);
    //	}
}

function successMenuNewsCallback(oStr) {
    //	var tabh = document.getElementById("promotion.slideview");
    //	tabh.innerHTML = oStr;
    //
    //	if(navigator.userAgent.match(/firefox/i)){
    //		var cat = document.getElementsByName("nm.category");
    //		for(var i = 0; i < cat.length; i++){
    //		    cat[i].style.marginTop = "15px"
    //		}
    //	}
    //	//applyDynamicPromotionWithNumOfItems(gPromotionContentArray.length);
    //	applyDynamicPromotionWithNumOfItems(10);
}

function failMenuNewsCallback() {

}

function requestQuickPromotionSuccess(e) {
    //	var tmpRespObj = parserJSON(e, false);
    //	if (tmpRespObj.arguments && tmpRespObj.arguments.length > 0) {
    //		logInfo('recevice promotion category: ' + tmpRespObj.arguments[0]);
    //		var docXml = stringtoXML(tmpRespObj.arguments[0]);
    //		var docXsl = getCachePageXsl("newsxsl/list_news_cat_menu_scr");
    //		genHTMLStringWithXML(docXml, docXsl, successMenuNewsCallback, failMenuNewsCallback);
    //	}
}

function requestQuickPromotionFail(e) {

}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(loaded, 100);

}, false);

var timeOutResize;
var gClientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var gClientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var timeOutToChangeSize; //fix on iPad iOS6
var isModelMobileRotate = navigator.userAgent.match(/Android|BB10|iPhone|iPod|iPad|WPDesktop|IEMobile/i);
window.onresize = function (e) {

    if (timeOutResize) {
        clearTimeout(timeOutResize);
        timeOutResize = null;
    }
    var currentClientHeight = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    var currentClientWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    //alert('Size' + ' current height: ' + gClientHeight + ' width: ' + gClientWidth + ' update height:' + currentClientHeight + ' width: ' + currentClientWidth);
    if (((gClientHeight == currentClientHeight) || (gClientWidth == currentClientWidth)) && isModelMobileRotate) {
        //alert('not resize' + ' current height: ' + gClientHeight + ' width: ' + gClientWidth + ' update height:' + currentClientHeight + ' width: ' + currentClientWidth);
        return;
    }
    else {
        if (timeOutToChangeSize && !isModelMobileRotate) {
            clearTimeout(timeOutToChangeSize);
            timeOutToChangeSize = null;
            if (navigator.userAgent.match(/(iPhone|iPad|iPod)\sOS\s6/.test(navigator.userAgent))) {
                return;//fix on iPad iOS6
            }
        }
        //alert('resize' + ' current height: ' + gClientHeight + ' width: ' + gClientWidth + ' update height:' + currentClientHeight + ' width: ' + currentClientWidth);
        gClientHeight = currentClientHeight;
        gClientWidth = currentClientWidth;
    }

    var tmpWP = navigator.userAgent.match(/IEMobile|WPDesktop/i);
    if (tmpWP) {
        //alert('2' + e.type + ' - ' + navigator.userAgent);
        //document.activeElement.blur(); //hidden keyboard
        var tmpArrInputNote = document.getElementsByTagName('input');
        if (tmpArrInputNote && tmpArrInputNote.length > 0) {
            for (var i = 0; i < tmpArrInputNote.length; i++) {
                if (tmpArrInputNote[i])
                    tmpArrInputNote[i].blur();
            }
        }
        updateMainContentWidth(currentClientWidth, currentClientHeight);
        setTimeout(function (e) {

            applyDynamicCommonStyleSheet();
            applyDynamicPageStyleSheet(true);
            applyVerticalScrollPage(true, -80);
            //applyDynamicPromotionWithNumOfItems(gPromotionContentArray.length);
            //			applyDynamicPromotionWithNumOfItems(10);
            setTimeout(function () {
                if (typeof (window['viewChangedSize']) == 'function') {
                    window['viewChangedSize']();
                }
            }, 100);
        }, 100);

    }
    else {
        updateMainContentWidth(currentClientWidth, currentClientHeight);
        timeOutToChangeSize = setTimeout(function (e) { //fix on iPad iOS6
            //alert('bcm.1');
            clearTimeout(timeOutToChangeSize);
            timeOutToChangeSize = null;

            applyDynamicCommonStyleSheet();
            applyDynamicPageStyleSheet(true);
            applyVerticalScrollPage(true, -80);
            //applyDynamicPromotionWithNumOfItems(gPromotionContentArray.length);
            //			applyDynamicPromotionWithNumOfItems(10);
            setTimeout(function () {
                if (typeof (window['viewChangedSize']) == 'function') {
                    window['viewChangedSize']();
                }
            }, 100);
        }, 200);

    }
}
//RESIZE_EVENT = 'onorientationchange' in window ? 'orientationchange' : 'resize';
if ('onorientationchange' in window) {
    window.addEventListener('orientationchange', function (e) {
        //alert('4' + e.type + ' - ' + navigator.userAgent);
        timeOutResize = setTimeout(function () {
            if (timeOutResize) {
                clearTimeout(timeOutResize);
                timeOutResize = null;
            }
            var currentClientHeight = window.innerHeight
				|| document.documentElement.clientHeight
				|| document.body.clientHeight;
            var currentClientWidth = window.innerWidth
				|| document.documentElement.clientWidth
				|| document.body.clientWidth;

            if ((gClientHeight && gClientHeight == currentClientHeight) || (gClientWidth && gClientWidth == currentClientWidth)) {
                return;
            }
            else {
                gClientHeight = currentClientHeight;
                gClientWidth = currentClientWidth;
            }

            var tmpWP1 = navigator.userAgent.match(/IEMobile|WPDesktop/i);
            if (tmpWP1) {
                //alert('3' + e.type + ' - ' + navigator.userAgent);
                var tmpArrInputNote = document.getElementsByTagName('input');
                if (tmpArrInputNote && tmpArrInputNote.length > 0) {
                    for (var i = 0; i < tmpArrInputNote.length; i++) {
                        if (tmpArrInputNote[i])
                            tmpArrInputNote[i].blur();
                    }
                }
                updateMainContentWidth(currentClientWidth, currentClientHeight);
                setTimeout(function (e) {
                    applyDynamicCommonStyleSheet();
                    applyDynamicPageStyleSheet(true);
                    applyVerticalScrollPage(true, -80);
                    //applyDynamicPromotionWithNumOfItems(gPromotionContentArray.length);
                    //					applyDynamicPromotionWithNumOfItems(10);
                    setTimeout(function () {
                        if (typeof (window['viewChangedSize']) == 'function') {
                            window['viewChangedSize']();
                        }
                    }, 100);
                }, 200);
            }
            else {
                //alert('bcm.2');
                if ((Environment.isIOS() && !Environment.isWindows()) || Environment.isAndroid()) { //except windows phone
                    if (document.activeElement)
                        document.activeElement.blur(); //hidden keyboard
                }

                var tmpArrInputNote = document.getElementsByTagName('input');
                if (tmpArrInputNote && tmpArrInputNote.length > 0) {
                    for (var i = 0; i < tmpArrInputNote.length; i++) {
                        if (tmpArrInputNote[i])
                            tmpArrInputNote[i].blur();
                    }
                }
                updateMainContentWidth(currentClientWidth, currentClientHeight);
                setTimeout(function (e) {
                    applyDynamicCommonStyleSheet();
                    applyDynamicPageStyleSheet(true);
                    applyVerticalScrollPage(true, -80);
                    //applyDynamicPromotionWithNumOfItems(gPromotionContentArray.length);
                    //					applyDynamicPromotionWithNumOfItems(10);
                    setTimeout(function () {
                        if (typeof (window['viewChangedSize']) == 'function') {
                            window['viewChangedSize']();
                        }
                    }, 10);

                }, 100);
            }
        }, 100);
    }, true);
}

/*var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
if(is_firefox) {
	replacejscssfile('./assets/mb-service.js', './other/mb-service.js', 'js');
	replacejscssfile('./assets/common.js', './other/common.js', 'js');
}*/

//handle escape page
if (CONST_BROWSER_MODE) {
    window.onbeforeunload = function (e) {
        if (gIsLogin && (gModeScreenView == CONST_MODE_SCR_SMALL)) {
            var e = e || window.event;
            var msg = CONST_STR.get('ALERT_WARNING_BACK_ACTION');

            // For IE and Firefox
            if (e) {
                e.returnValue = msg;
            }
            // For Safari / chrome
            return msg;
        }
    };
    document.onkeydown = function (e) {
        if (gIsLogin && (gModeScreenView != CONST_MODE_SCR_SMALL)) {
            var key;
            if (window.event) {
                key = event.keyCode
            }
            else {
                var unicode = e.keyCode ? e.keyCode : e.charCode
                key = unicode
            }
            switch (key) {//event.keyCode
                case 116: //F5 button
                    if (event.ctrlKey) return true; //enable Crlt+F5 for testing
                    event.returnValue = false;
                    key = 0; //event.keyCode = 0;
                    return false;
                case 82: //R button
                    if (event.ctrlKey) {
                        event.returnValue = false;
                        key = 0; //event.keyCode = 0;
                        return false;
                    }
                    else return true;
                case 91: // ctrl + R Button
                    event.returnValue = false;
                    key = 0;
                    return false;
            }
        }
    }
}
else {
    //using cordovar lib
    //app.initialize();
    var numPressToExit = 0;
    var numPressedTime;

    //var gDeviceStatus;
    //document.addEventListener("deviceready", onDeviceReady, true);
    function onDeviceReady() {
        //alert('Device ready!');
        //alert('Loaded Phonegap: ' + device.name + ' UUID: ' + device.uuid);
        /*alert('Device Name: '     + device.name     + '<br />' +
                            'Device Cordova: '  + device.cordova  + '<br />' +
                            'Device Platform: ' + device.platform + '<br />' +
                            'Device UUID: '     + device.uuid     + '<br />' +
                            'Device Version: '  + device.version  + '<br />');*/
        gDeviceToken = device.uuid;

        THEBTouchID.init3DTouch('abc', function () {

        }, function () {

        });

        if (Environment.isAndroid()) {
            console.log("dunglhq : call checkreboot");
            checkReboot.check(
				function (result) {

				    if (result.text == "REBOOT") {
				        gDeviceRestartFlag = true;
				        console.log('Ohh ooopp....Restarted');
				    }
				},
				function (error) {

				}
			);
        } else if (Environment.isIOS()) {
            THEBTouchID.checkRebootTime('abc', function (e) {
                //alert(e);
                if (typeof (Storage) !== "undefined") {
                    // Web storage is supported
                    try {
                        //check xem co phai vua restart ko
                        var localStorageTime = localStorage.getItem('LastLoginTimeInSec');
                        localStorage.setItem('LastLoginTimeInSec', e);
                        if (localStorageTime != null && localStorageTime != '') {
                            if (Math.abs(localStorageTime - e) < 5) {
                                console.log('Not restarted: \n saved delta = ' + localStorageTime + '\ncurrent delta = ' + e);

                            } else {
                                gDeviceRestartFlag = true;
                                console.log('Ohh ooopp....Restarted: \n saved delta = ' + localStorageTime + '\ncurrent delta = ' + e);
                            }
                        }
                    }
                    catch (err) {
                        logInfo('Browser not support local store');
                    }
                }
                else {
                    // Web storage is NOT supported
                    logInfo('Browser not support local store');
                }
            }, function () {

            });
        }

        startupAppCheckVersion();

        function getPhoneGapPath() {
            var path = window.location.pathname;
            var phoneGapPath = path.substring(0, path.lastIndexOf('/') + 1);
            phoneGapPath = (phoneGapPath.length > 5) ? phoneGapPath : "";
            phoneGapPath = (phoneGapPath.indexOf("http://") != -1) ? phoneGapPath : "";
            return phoneGapPath;
        };
        gDeviceWWWFolder = getPhoneGapPath();
        //alert("path: " + gDeviceWWWFolder);

        document.addEventListener("backbutton", onBackKeyDown, true);
        document.addEventListener("menubutton", menuKeyDown, true);
		
    }

	
	
    function onBackKeyDown() {
        if (isShowingMask) {
            return;
        }

        var dialogAlert = document.getElementById('myModalDialog');
        var dialogFull = document.getElementById('myModalFullDialog');
        var modalFullSecond = document.getElementById('myModalFullDialog-second');
        if (dialogAlert != undefined) {
            if (dialogAlert.style.display != 'none') {
                closeAllDialogOfModalLibrary();

                return;
            }

        }
        if (dialogFull != undefined) {
            if (dialogFull.style.display != 'none') {
                closeAllDialogOfModalLibrary();
                navController.getActionBar().showActionBar();
                if (navArrayScr != undefined && navArrayScr.length > 0) {
                    bottomBar.resumeView(navArrayScr[navArrayScr.length - 1], navPageBottomId[navArrayScr[navArrayScr.length - 1]]);
                }

                return;
            }

        }
        if (modalFullSecond != undefined) {
             if (modalFullSecond.style.display != 'none') {
                closeAllDialogOfModalLibrary();
                navController.getActionBar().showActionBar();
                if (navArrayScr != undefined && navArrayScr.length > 0) {
                    bottomBar.resumeView(navArrayScr[navArrayScr.length - 1], navPageBottomId[navArrayScr[navArrayScr.length - 1]]);
                }

                return;
            }
        }

        //close alert
        closealert();
        closeAlertConfirm(false);
        closeAlertConfirmScheduleBank(false);
        closealertKHCN_KHDN_TERMS();
        closealertKHCN_KHDN_INSTRUCTION();
        closealertKHCN_KHDN_FAQ();

        if (currentPage == "transfer/fast-register-scr") {
            document.getElementById('navActionbar').style.display = 'block';
            document.getElementById('footerSlide').style.display = 'block';
            document.getElementById('floatingButton').style.display = 'block';
        }


        //closeDialog(document.getElementById('dialog-backgroundtrans'));
        //document.getElementById('mask-blacktrans').click();

        // if (numPressToExit > 1) {
        // 	numPressToExit = 0;
        // 	clearTimeout(numPressedTime);
        //     showAlertConfirmText(CONST_STR.get('ALERT_CONFIRM_EXIT_APP'));
        //     document.addEventListener("alertConfirmOK", function (e) {
        //         document.removeEventListener("alertConfirmOK");
        //         if (navigator.app && navigator.app.exitApp) {
        //             navigator.app.exitApp();
        //         } else if (navigator.device && navigator.device.exitApp) {
        //             navigator.device.exitApp();
        //         }
        //     }, true);
        // }
        // else {
        //     numPressToExit++;
        // 	if(numPressedTime != undefined) {
        // 		clearTimeout(numPressedTime);
        // 	}
        //     numPressedTime = setTimeout(function () {
        //         numPressToExit = 0;
        //     }, 2000);

        // 	if(checkTouchLocked()) return; //disable back button when show alert, loading, dialog
        // 	if(navArrayScr && navArrayScr.length < 2) {
        // 		showSlideMenu();
        // 	}
        // 	else {
        //     	navController.popView(true);
        // 	}
        // }


        var countView = navController.countCurrentView();
        if (countView > 1) {
            var page = navController.getCurrentPage();
            if (page == 'com-review-result-scr' || page == 'com-result-scr') {
                navController.popViewInit(true);
            } else {
                navController.popView(true);
            }
        } else {
            showSlideMenu();
        }
        return false;
    }

    function menuKeyDown() {
        if (gIsLogin) {
            setTimeout(function () {
                //content.toggle();
                showSlideMenu();
            }, 200);
        }
    }

    //exec(null, null, "App", "overrideBackbutton", [true]);
   

}


//Sangnt1 request lấy số lượng notification chưa đọc

function getCountDataNotificationUnread() {
    if (gDeviceTokenPush == null || gDeviceTokenPush == "") {
        if (localStorage.gDeviceTokenPush == null || localStorage.gDeviceTokenPush == "" || localStorage.gDeviceTokenPush.length == 0) {
            if (typeof device !== 'undefined') {
                if (device == null || device.uuid == null || device.uuid == "" || device.uuid.length == 0)
                    return;
                else
                    gDeviceTokenPush = device.uuid;
            } else {
                return;
            }
        }
        else
            gDeviceTokenPush = localStorage.gDeviceTokenPush;
    }

    var arrayArgs = new Array();

    if (gDeviceTokenPush == null || gDeviceTokenPush == "") {
        return;
    }
    arrayArgs.push(gDeviceTokenPush);
    requestBacgroundMBService('CMD_TYPE_GET_LIST_NOTIFICATION', arrayArgs, requestMBServiceCountNotificationSuccess, requestMBServiceCountNotificationFail);
}

function requestMBServiceCountNotificationSuccess(e) {

    countUnreadNotification = 0;
    if (e != "") {
        var arrContent = JSON.parse(e).arguments;
        if (arrContent != undefined) {
            var length = arrContent.length;
            var content;
            for (i = 0; i < length; i++) {

                content = arrContent[i].split("#");
                if (content[6].trim() == 0) {
                    countUnreadNotification += 1;
                }

            }
        }

    }


    bindCountUnreadNotification(countUnreadNotification);


}
function requestMBServiceCountNotificationFail(e) {

    bindCountUnreadNotification(0);

}
function bindCountUnreadNotification(count) {
    var divNotifi = document.getElementById("notifi-number-top");
    var divNotifiWeb = document.getElementById("notifi-number-web");
    if (count == 0 || count == null) {
		if(divNotifi!=undefined){
			divNotifi.style.visibility = "hidden";
		}
        if(divNotifiWeb!=undefined){
			divNotifiWeb.style.visibility = "hidden";
		}
        
        //        var divNoti = document.getElementById("notifi-number");
        //        if(divNoti!=null)
        //            divNoti.style.visibility = "hidden";
    } else {
        //        var liNotifi = document.getElementById("notification/list_notification_src");
        //        if(liNotifi != null){
        //
        //            if(liNotifi.getElementsByClassName("icon-number-notifi")[0]==null){
        //                var element = document.createElement("div");
        //                element.setAttribute("id","notifi-number");
        //                element.setAttribute("class","icon-number-notifi");
        //                liNotifi.appendChild(element);
        //            }
        //        }
		if(divNotifi!=undefined){
				divNotifi.style.visibility = "visible";
//				divNotifi.innerHTML = count;
		}
		 if(divNotifiWeb!=undefined){
			divNotifiWeb.style.visibility = "visible";
//			divNotifiWeb.innerHTML = count;
		 }
        //        var divNoti = document.getElementById("notifi-number");
        //        if(divNoti != null){
        //            divNoti.style.visibility = "visible";
        //            divNoti.innerHTML = count;
        //        }

    }

}

//end Sangnt1 request lấy số lượng notification chưa đọc

/*SANGNT1 Set onclick for action notification*/
function onClickActionNotification() {


    navController.initWithRootView('notification/list_notification_scr', true, 'xsl');

}

/*End onclick action notification*/

