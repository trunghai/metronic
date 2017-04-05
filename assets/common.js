/**
 * Created by HuyNT2.
 * User:
 * Date: 12/17/13
 * Time: 5:35 PM
 */

/*common*/

/*** DETECT DEVICE Environment.isMobile()***/

// Init App FrameWork SangNT1 Add
var myApp = new Framework7({
    modalTitle:'TPBank',
    // Enable Material theme
    material:true
});
var $$ = Dom7;
//SangNT1 End
var menuIdArray = ['30','1','2','3','4','46','5','34'];
var Environment = {
    //mobile or desktop compatible event name, to be used with '.on' function
    TOUCH_DOWN_EVENT_NAME:'mousedown touchstart',
    TOUCH_UP_EVENT_NAME:'mouseup touchend',
    TOUCH_MOVE_EVENT_NAME:'mousemove touchmove',
    TOUCH_DOUBLE_TAB_EVENT_NAME:'dblclick dbltap',
    isAndroid:function () {
        return navigator.userAgent.match(/Android/i);
    },
    isBlackBerry:function () {
        return navigator.userAgent.match(/BlackBerry|BB10/i);
    },
    isIOS:function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    isOpera:function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    isWindows:function () {
        return navigator.userAgent.match(/IEMobile|WPDesktop/i);
    },
    isMobile:function () {
        return (Environment.isAndroid() || Environment.isBlackBerry() || Environment.isIOS() || Environment.isWindows());
    }
};
//Environment.isAndroid() && !Environment.isWindows //Environment.isMobile()
//Check iOS version
function iOSversion() {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
        // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        //return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        return parseInt(v[1], 10);
    }
}
/*
 ver = iOSversion();

 if (ver[0] >= 5) {
 alert('This is running iOS 5 or later.');
 }
 */

// Android Mobile
var isAndroidMobile = navigator.userAgent.indexOf('Android') > -1 && navigator.userAgent.indexOf('Mozilla/5.0') > -1 && navigator.userAgent.indexOf('AppleWebKit') > -1;

//event change width content
var evtChangeWidthMobile = document.createEvent('Event');
evtChangeWidthMobile.initEvent('evtChangeWidthMobile',true,true);
var evtChangeWidthMobileClose = document.createEvent('Event');
evtChangeWidthMobileClose.initEvent('evtChangeWidthMobileClose',true,true);
var evtChangeWidthDesktop = document.createEvent('Event');
evtChangeWidthDesktop.initEvent('evtChangeWidthDesktop',true,true);
var evtChangeWidthDesktopClose = document.createEvent('Event');
evtChangeWidthDesktopClose.initEvent('evtChangeWidthDesktopClose',true,true);
// Android Browser (not Chrome)
var regExAppleWebKit = new RegExp(/AppleWebKit\/([\d.]+)/);
var resultAppleWebKitRegEx = regExAppleWebKit.exec(navigator.userAgent);
var appleWebKitVersion = (resultAppleWebKitRegEx === null ? null : parseFloat(regExAppleWebKit.exec(navigator.userAgent)[1]));
var isAndroidBrowserAbove4 = isAndroidMobile && appleWebKitVersion !== null && appleWebKitVersion >= 534;

// first get the size from the window
// if that didnt work, get it from the body
var ScreenSize = {
    width:window.innerWidth || document.body.clientWidth,
    height:window.innerHeight || document.body.clientHeight,
    isRetina:function () {
        if (window.matchMedia) { //define retina with pixel ratio = 1.3
            var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
            if (mq && mq.matches || (window.devicePixelRatio > 1)) {
                return true;
            } else {
                return false;
            }
        }
    }
}
var isMobileMode = (ScreenSize.width < 801) ? true : false;
//Full detect browser
!function (name, definition) {
    if (typeof define == 'function') define(definition);
    else if (typeof module != 'undefined' && module.exports) module.exports.browser = definition();
    else this[name] = definition();
}('bowser', function () {
    /**
     * navigator.userAgent =>
     * Chrome:  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_7) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.57 Safari/534.24"
     * Opera:   "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.7; U; en) Presto/2.7.62 Version/11.01"
     * Safari:  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_7; en-us) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1"
     * IE:      "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C)"
     * IE>=11:  "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; Media Center PC 6.0; rv:11.0) like Gecko"
     * Firefox: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:2.0) Gecko/20100101 Firefox/4.0"
     * BlackBerry10: "Mozilla/5.0 (BB10; <Device Type>) AppleWebKit/537.10+ (KHTML, like Gecko) Version/<BB Version #> Mobile Safari/537.10+"
     * BlackBerry TabletOS: "Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.0.0; en-US) AppleWebKit/535.8+ (KHTML, like Gecko) Version/7.2.0.0 Safari/535.8+"
     * iPhone:  "Mozilla/5.0 (iPhone Simulator; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5"
     * iPad:    "Mozilla/5.0 (iPad; U; CPU OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5",
     * Android: "Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; T-Mobile G2 Build/GRJ22) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"
     * Touchpad: "Mozilla/5.0 (hp-tabled;Linux;hpwOS/3.0.5; U; en-US)) AppleWebKit/534.6 (KHTML, like Gecko) wOSBrowser/234.83 Safari/534.6 TouchPad/1.0"
     * PhantomJS: "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.5.0 Safari/534.34"
     */

    var ua = navigator.userAgent,
        t = true,
        ie = /(msie|trident)/i.test(ua),
        iemobile = /(iemobile)/i.test(ua),
        chrome = /chrome|crios/i.test(ua),
        phantom = /phantom/i.test(ua),
        safari = /safari/i.test(ua) && !chrome && !phantom,
        iphone = /iphone/i.test(ua),
        ipod = /ipod/i.test(ua),
        ipad = /ipad/i.test(ua),
        touchpad = /touchpad/i.test(ua),
        android = /android/i.test(ua),
        blackberry = /blackberry|bb10/i.test(ua),
        opera = /opera/i.test(ua) || /opr/i.test(ua),
        firefox = /firefox/i.test(ua),
        gecko = /gecko\//i.test(ua),
        seamonkey = /seamonkey\//i.test(ua),
        webkitVersion = /version\/(\d+(\.\d+)?)/i,
        firefoxVersion = /firefox\/(\d+(\.\d+)?)/i,
        o;

    function detect() {

        if (ie) return {
            name:'IE',
            msie:t,
            version:ua.match(/(msie |rv:)(\d+(\.\d+)?)/i)[2]
        };
        if (iemobile) return {
            name:'IEMobile',
            msie:t,
            version:ua.match(/(msie |rv:)(\d+(\.\d+)?)/i)[2]
        };
        if (opera) return {
            name:'Opera',
            opera:t,
            version:ua.match(webkitVersion) ? ua.match(webkitVersion)[1] : ua.match(/opr\/(\d+(\.\d+)?)/i)[1]
        };
        if (chrome) return {
            name:'Chrome',
            webkit:t,
            chrome:t,
            version:ua.match(/(?:chrome|crios)\/(\d+(\.\d+)?)/i)[1]
        };
        if (phantom) return {
            name:'PhantomJS',
            webkit:t,
            phantom:t,
            version:ua.match(/phantomjs\/(\d+(\.\d+)+)/i)[1]
        };
        if (touchpad) return {
            name:'TouchPad',
            webkit:t,
            touchpad:t,
            version:ua.match(/touchpad\/(\d+(\.\d+)?)/i)[1]
        };
        if (blackberry) return {
            name:'BlackBerry',
            webkit:t,
            touchpad:t,
            version:ua.match(/blackberry\/(\d+(\.\d+)?)/i)[1]
        };
        if (iphone || ipad || ipod) {
            o = {
                name:ipad ? 'iPad' : 'iPhone',
                webkit:t,
                mobile:t,
                ios:t,
                iphone:iphone,
                ipad:ipad
            };
            // WTF: version is not part of user agent in web apps
            if (webkitVersion.test(ua)) {
                o.version = ua.match(webkitVersion)[1];
            }
            return o;
        }
        if (android) return {
            name:'Android',
            webkit:t,
            android:t,
            mobile:t,
            version:(ua.match(webkitVersion) || ua.match(firefoxVersion))[1]
        };
        if (safari) return {
            name:'Safari',
            webkit:t,
            safari:t,
            version:ua.match(webkitVersion)[1]
        };
        if (gecko) {
            o = {
                name:'Gecko',
                gecko:t,
                mozilla:t,
                version:ua.match(firefoxVersion)[1]
            };
            if (firefox) {
                o.name = 'Firefox';
                o.firefox = t;
            }
            return o;
        }
        if (seamonkey) return {
            name:'SeaMonkey',
            seamonkey:t,
            version:ua.match(/seamonkey\/(\d+(\.\d+)?)/i)[1]
        };
        return {};
    }

    var bowser = detect();

    // Graded Browser Support
    // http://developer.yahoo.com/yui/articles/gbs
    if ((bowser.msie && bowser.version >= 8) ||
        (bowser.chrome && bowser.version >= 10) ||
        (bowser.firefox && bowser.version >= 4.0) ||
        (bowser.safari && bowser.version >= 5) ||
        (bowser.opera && bowser.version >= 10.0)) {
        bowser.a = t;
    }

    else if ((bowser.msie && bowser.version < 8) ||
        (bowser.chrome && bowser.version < 10) ||
        (bowser.firefox && bowser.version < 4.0) ||
        (bowser.safari && bowser.version < 5) ||
        (bowser.opera && bowser.version < 10.0)) {
        bowser.c = t;
    } else bowser.x = t;

    return bowser;
});
//alert(JSON.stringify(bowser, null, '    '));

/*** DETECT DEVICE END ***/

/*** limit input text length ***/
function textLimit(field, maxlen) {
    //if (field.value.length > maxlen)
    //alert("Giới hạn ký tự " + maxlen);
    if (field.value.length > maxlen)
        field.value = field.value.substring(0, maxlen);
}
/*** INPUT HANDLE ***/
var evtSpecialKeyPressed = document.createEvent('Event');
evtSpecialKeyPressed.initEvent('evtSpecialKeyPressed', true, true);

function setInputOnlyASCII(inID, inAlert, inputNormalCharFunc, inputSpecCharFunc) {
    if (!inID) return;
    var inputNode = (typeof(inID) == 'string') ? document.getElementById(inID) : inID;
    inputNode.onkeyup = function (e) {
        e.preventDefault();
        var evt = e || window.event;
        var ew = evt.keyCode || evt.which;
        if ((ew == 13) || (ew == 9)) //enter key, tab key
        {
            //fire event listener
            evtSpecialKeyPressed.keyPress = ew;
            inputNode.dispatchEvent(evtSpecialKeyPressed);
            if (typeof(inputSpecCharFunc) == 'function') {
                inputSpecCharFunc(ew);
            }
        }
        //inputNode.value = removeSpecialChar(inputNode.value);
        var str = String.fromCharCode(ew);
        //if(str.match(/^[a-zA-Z0-9]*$/) || (ew == 8) || (ew == 46))  {
        if (str.match(/^[a-zA-Z0-9-.,*\(\)]*$/) || (ew == 8) || (ew == 46)) {
            if (!Environment.isAndroid()) inputNode.value = removeAccent(inputNode.value);
            if (typeof(inputNormalCharFunc) == 'function') {
                inputNormalCharFunc();//CALL THIS FUNC TO FILLTER DATA FOR DIALOG WITH INPUT FORM
            }

            return true;
        }
        else {
            return false;
        }
        //inputNode.value = removeAccent(inputNode.value);

        //return false;
    };
}
//ngocdt them cho chuyen tien lien ngan hang
function setInputOnlyASCIILNH(inID, inAlert, inputNormalCharFunc, inputSpecCharFunc) {
    if (!inID) return;
    var inputNode = (typeof(inID) == 'string') ? document.getElementById(inID) : inID;
    inputNode.onkeyup = function (e) {
        e.preventDefault();
        var evt = e || window.event;
        var ew = evt.keyCode || evt.which;
        if ((ew == 13) || (ew == 9)) //enter key, tab key
        {
            //fire event listener
            evtSpecialKeyPressed.keyPress = ew;
            inputNode.dispatchEvent(evtSpecialKeyPressed);
            if (typeof(inputSpecCharFunc) == 'function') {
                inputSpecCharFunc(ew);
            }
        }
        //inputNode.value = removeSpecialChar(inputNode.value);
        var str = String.fromCharCode(ew);
        //if(str.match(/^[a-zA-Z0-9]*$/) || (ew == 8) || (ew == 46))  {

        if (str.match(/^[a-zA-Z0-9-.,*&\(\)]*$/) || (ew == 8) || (ew == 46) || (ew == 188) || (ew ==  190) || (ew == 191)) {
            inputNode.value = removeAccentLNH(inputNode.value);
            if (typeof(inputNormalCharFunc) == 'function') {
                inputNormalCharFunc();//CALL THIS FUNC TO FILLTER DATA FOR DIALOG WITH INPUT FORM
            }

            return true;
        }
        else {
            return false;
        }
        //inputNode.value = removeAccent(inputNode.value);

        //return false;
    };
}
function removeAccentLNH(sText) {
    var sNewText = new String(sText);
    sNewText = regReplace(sNewText, "à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ", "a");
    sNewText = regReplace(sNewText, "À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ", "A");
    sNewText = regReplace(sNewText, "è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ", "e");
    sNewText = regReplace(sNewText, "È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ", "E");
    sNewText = regReplace(sNewText, "ì|í|ị|ỉ|ĩ", "i");
    sNewText = regReplace(sNewText, "Ì|Í|Ị|Ỉ|Ĩ", "I");
    sNewText = regReplace(sNewText, "ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ", "o");
    sNewText = regReplace(sNewText, "Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ", "O");
    sNewText = regReplace(sNewText, "ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ", "u");
    sNewText = regReplace(sNewText, "Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ", "U");
    sNewText = regReplace(sNewText, "ỳ|ý|ỵ|ỷ|ỹ", "y");
    sNewText = regReplace(sNewText, "Ỳ|Ý|Ỵ|Ỷ|Ỹ", "Y");
    sNewText = regReplace(sNewText, "Đ", "D");
    sNewText = regReplace(sNewText, "đ", "d");
    //sNewText = removeSpecialCharForText(sNewText);
    sNewText = sNewText.replace(/[!"#$%'\+:;<=>?@\\`^~{|}]/g, ''); //!"#$%&'+/:;<=>?@[\]`^{|}~   //-.*,()
    return sNewText;

}
//ngocdt3 bo sung cho phep nhap ky tu @ khi nhap email trong tinh nang thay doi thong tin ca nhan
function setInputOnlyASCIIinfo(inID, inAlert, inputNormalCharFunc, inputSpecCharFunc) {
    if (!inID) return;
    var inputNode = (typeof(inID) == 'string') ? document.getElementById(inID) : inID;
    inputNode.onkeyup = function (e) {
        e.preventDefault();
        var evt = e || window.event;
        var ew = evt.keyCode || evt.which;
        if ((ew == 13) || (ew == 9)) //enter key, tab key
        {
            //fire event listener
            evtSpecialKeyPressed.keyPress = ew;
            inputNode.dispatchEvent(evtSpecialKeyPressed);
            if (typeof(inputSpecCharFunc) == 'function') {
                inputSpecCharFunc(ew);
            }
        }
        //inputNode.value = removeSpecialChar(inputNode.value);
        var str = String.fromCharCode(ew);
        //if(str.match(/^[a-zA-Z0-9]*$/) || (ew == 8) || (ew == 46))  {

        if (str.match(/^[a-zA-Z0-9-.,*@\(\)]*$/) || (ew == 8) || (ew == 46)) {
            if (!Environment.isAndroid()) inputNode.value = removeAccentinfo(inputNode.value);
            if (typeof(inputNormalCharFunc) == 'function') {
                inputNormalCharFunc();//CALL THIS FUNC TO FILLTER DATA FOR DIALOG WITH INPUT FORM
            }

            return true;
        }
        else {
            return false;
        }
        //inputNode.value = removeAccent(inputNode.value);

        //return false;
    };
}
function removeAccentinfo(sText) {
    var sNewText = new String(sText);
    sNewText = regReplace(sNewText, "à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ", "a");
    sNewText = regReplace(sNewText, "À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ", "A");
    sNewText = regReplace(sNewText, "è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ", "e");
    sNewText = regReplace(sNewText, "È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ", "E");
    sNewText = regReplace(sNewText, "ì|í|ị|ỉ|ĩ", "i");
    sNewText = regReplace(sNewText, "Ì|Í|Ị|Ỉ|Ĩ", "I");
    sNewText = regReplace(sNewText, "ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ", "o");
    sNewText = regReplace(sNewText, "Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ", "O");
    sNewText = regReplace(sNewText, "ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ", "u");
    sNewText = regReplace(sNewText, "Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ", "U");
    sNewText = regReplace(sNewText, "ỳ|ý|ỵ|ỷ|ỹ", "y");
    sNewText = regReplace(sNewText, "Ỳ|Ý|Ỵ|Ỷ|Ỹ", "Y");
    sNewText = regReplace(sNewText, "Đ", "D");
    sNewText = regReplace(sNewText, "đ", "d");
    //sNewText = removeSpecialCharForText(sNewText);
    sNewText = sNewText.replace(/[!"#$%'\+:;<=>?\\`^~{|}]/g, ''); //!"#$%&'+/:;<=>?@[\]`^{|}~   //-.*,()
    return sNewText;

}
function removeAccent(sText) {
    var sNewText = new String(sText);
    sNewText = regReplace(sNewText, "à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ", "a");
    sNewText = regReplace(sNewText, "À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ", "A");
    sNewText = regReplace(sNewText, "è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ", "e");
    sNewText = regReplace(sNewText, "È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ", "E");
    sNewText = regReplace(sNewText, "ì|í|ị|ỉ|ĩ", "i");
    sNewText = regReplace(sNewText, "Ì|Í|Ị|Ỉ|Ĩ", "I");
    sNewText = regReplace(sNewText, "ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ", "o");
    sNewText = regReplace(sNewText, "Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ", "O");
    sNewText = regReplace(sNewText, "ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ", "u");
    sNewText = regReplace(sNewText, "Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ", "U");
    sNewText = regReplace(sNewText, "ỳ|ý|ỵ|ỷ|ỹ", "y");
    sNewText = regReplace(sNewText, "Ỳ|Ý|Ỵ|Ỷ|Ỹ", "Y");
    sNewText = regReplace(sNewText, "Đ", "D");
    sNewText = regReplace(sNewText, "đ", "d");
    //sNewText = removeSpecialCharForText(sNewText);
    sNewText = sNewText.replace(/[!#$%&'\+:;"<=>?@\\`^~{|}]/g, ''); //!"#$%&'+/:;<=>?@[\]`^{|}~   //-.*,()
    return sNewText;

}
//ngocdt3 bo sung chan k cho nhap dau cach, dau cham o cac phan input thanh toan hoa don
function setInputOnlyASCIIBLL(inID, inAlert, inputNormalCharFunc, inputSpecCharFunc) {
    if (!inID) return;
    var inputNode = (typeof(inID) == 'string') ? document.getElementById(inID) : inID;
    inputNode.onkeyup = function (e) {
        e.preventDefault();
        var evt = e || window.event;
        var ew = evt.keyCode || evt.which;
        if (ew == 46) //space key
            return false;
        if ((ew == 13) || (ew == 9)) //enter key, tab key
        {
            evtSpecialKeyPressed.keyPress = ew;
            inputNode.dispatchEvent(evtSpecialKeyPressed);
            if (typeof(inputSpecCharFunc) == 'function') {
                inputSpecCharFunc(ew);
            }
        }
        var str = String.fromCharCode(ew);
        if (str.match(/^[a-zA-Z0-9-,*\(\)]*$/) || (ew == 8)) {
            if (!Environment.isAndroid()) inputNode.value = removeAccentBBL(inputNode.value);
            if (typeof(inputNormalCharFunc) == 'function') {
                inputNormalCharFunc();//CALL THIS FUNC TO FILLTER DATA FOR DIALOG WITH INPUT FORM
            }

            return true;
        }
        else {
            return false;
        }

    };
}

function removeAccentBBL(sText) {
    var sNewText = new String(sText);
    sNewText = regReplace(sNewText, "à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ", "a");
    sNewText = regReplace(sNewText, "À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ", "A");
    sNewText = regReplace(sNewText, "è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ", "e");
    sNewText = regReplace(sNewText, "È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ", "E");
    sNewText = regReplace(sNewText, "ì|í|ị|ỉ|ĩ", "i");
    sNewText = regReplace(sNewText, "Ì|Í|Ị|Ỉ|Ĩ", "I");
    sNewText = regReplace(sNewText, "ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ", "o");
    sNewText = regReplace(sNewText, "Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ", "O");
    sNewText = regReplace(sNewText, "ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ", "u");
    sNewText = regReplace(sNewText, "Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ", "U");
    sNewText = regReplace(sNewText, "ỳ|ý|ỵ|ỷ|ỹ", "y");
    sNewText = regReplace(sNewText, "Ỳ|Ý|Ỵ|Ỷ|Ỹ", "Y");
    sNewText = regReplace(sNewText, "Đ", "D");
    sNewText = regReplace(sNewText, "đ", "d");
    //sNewText = removeSpecialCharForText(sNewText);
    sNewText = sNewText.replace(/[!"#$%&'\+:;<=>?@\\`^~{|}.]/g, ''); //!"#$%&'+/:;<=>?@[\]`^{|}~   //-.*,()
    return sNewText;

}
function setInputOnlyNumberBBL(inID, inAlert) {
    if (!inID) return;
    var inputNode = (typeof(inID) == 'string') ? document.getElementById(inID) : inID;
    inputNode.onkeypress = function (e) {
        //e.preventDefault();
        var evt = e || window.event;
        var ew = evt.keyCode || evt.which;
        if (ew == 8 || ew == 37 || ew == 38 || ew == 39 || ew == 40) //backspace key
            return true;
        if (ew == 32 || ew == 46) //space key
            return false;
        if (48 <= ew && ew <= 57)
            return true;
        if ((ew == 13) || (ew == 9)) //enter key, tab key
        {
            //fire event listener
            evtSpecialKeyPressed.keyPress = ew;
            inputNode.dispatchEvent(evtSpecialKeyPressed);
            return true;
        }
        if ((inAlert != undefined) && (inAlert != null) && (inAlert.length > 0)) {
            showAlertText(inAlert);
        }
        return false;
    };
}
function setInputOnlyNumberTopup(inID, inAlert) {
    if (!inID) return;
    var inputNode = (typeof(inID) == 'string') ? document.getElementById(inID) : inID;
    inputNode.onkeypress = function (e) {
        //e.preventDefault();
        var evt = e || window.event;
        var ew = evt.keyCode || evt.which;
        if (ew == 8 || ew == 46 || ew == 37 || ew == 38 || ew == 39 || ew == 40) //backspace key
            return true;
        if (48 <= ew && ew <= 57)
            return true;
        if (ew == 64)//ky tu @
            return true;
        if ((ew == 13) || (ew == 9)) //enter key, tab key
        {
            //fire event listener
            evtSpecialKeyPressed.keyPress = ew;
            inputNode.dispatchEvent(evtSpecialKeyPressed);
            return true;
        }
        if ((inAlert != undefined) && (inAlert != null) && (inAlert.length > 0)) {
            showAlertText(inAlert);
        }
        return false;
    };
}

//ngocdt3 end
function removeAccentff(sText) {
    var sNewText = new String(sText);
    sNewText = regReplace(sNewText, "&quot;", '"');

    //sNewText=regReplace(sNewText,"<br />", '\n');
    //sNewText=regReplace(sNewText,"<br>", "\n");
    sNewText = regReplace(sNewText, "&lt;br /&gt;", "<br>");
    sNewText = regReplace(sNewText, "&amp;&nbsp;", " ");
    sNewText = regReplace(sNewText, "&lt;", "<");
    sNewText = regReplace(sNewText, "&gt;", ">");

    sNewText = regReplace(sNewText, "&nbsp;", " ");
    sNewText = regReplace(sNewText, "&iexcl;", "i");
    sNewText = regReplace(sNewText, "&macr;", "-");
    sNewText = regReplace(sNewText, "&ordf", "a");
    sNewText = regReplace(sNewText, "&plusmn;", "+|-");
    sNewText = regReplace(sNewText, "&sup1;", "1");
    sNewText = regReplace(sNewText, "&sup2;", "2");
    sNewText = regReplace(sNewText, "&sup3;", "3");
    sNewText = regReplace(sNewText, "&ordm", "0");
    sNewText = regReplace(sNewText, "&raquo", "»");
    sNewText = regReplace(sNewText, "&frac14", "1/4");
    sNewText = regReplace(sNewText, "&frac12", "1/2");
    sNewText = regReplace(sNewText, "&frac34", "3/4");
    sNewText = regReplace(sNewText, "&times;", "x");
    sNewText = regReplace(sNewText, "&divide;", "÷");
    sNewText = regReplace(sNewText, "&Agrave;", "À");
    sNewText = regReplace(sNewText, "&Aacute;", "Á");
    sNewText = regReplace(sNewText, "&Acirc;", "Â");
    sNewText = regReplace(sNewText, "&Atilde;", "Ã");
    sNewText = regReplace(sNewText, "&Auml;", "Ä");
    sNewText = regReplace(sNewText, "&Aring;", "Å");
    sNewText = regReplace(sNewText, "&AElig;", "Æ");
    sNewText = regReplace(sNewText, "&Ccedil;", "Ç");
    sNewText = regReplace(sNewText, "&Egrave;", "È");
    sNewText = regReplace(sNewText, "&Eacute;", "É");
    sNewText = regReplace(sNewText, "&Ecirc;", "Ê");
    sNewText = regReplace(sNewText, "&Euml;", "Ë");
    sNewText = regReplace(sNewText, "&Igrave;", "Ì");
    sNewText = regReplace(sNewText, "&Iacute;", "Í");
    sNewText = regReplace(sNewText, "&Icirc;", "Î");
    sNewText = regReplace(sNewText, "&Iuml;", "Ï");
    sNewText = regReplace(sNewText, "&ETH;", "Ð");
    sNewText = regReplace(sNewText, "&Ntilde;", "Ñ");
    sNewText = regReplace(sNewText, "&Ograve;", "Ò");
    sNewText = regReplace(sNewText, "&Oacute;", "Ó");
    sNewText = regReplace(sNewText, "&Ocirc;", "Ô");
    sNewText = regReplace(sNewText, "&Otilde;", "Õ");
    sNewText = regReplace(sNewText, "&Ouml;", "Ö");
    sNewText = regReplace(sNewText, "&Oslash;", "Ø");
    sNewText = regReplace(sNewText, "&Ugrave;", "Ù");
    sNewText = regReplace(sNewText, "&Uacute;", "Ú");
    sNewText = regReplace(sNewText, "&Ucirc;", "Û");
    sNewText = regReplace(sNewText, "&Uuml;", "Ü");
    sNewText = regReplace(sNewText, "&Yacute;", "Ý");
    sNewText = regReplace(sNewText, "&THORN;", "Þ");
    sNewText = regReplace(sNewText, "&szlig;", "ß");
    sNewText = regReplace(sNewText, "&agrave;", "à");
    sNewText = regReplace(sNewText, "&aacute;", "á");
    sNewText = regReplace(sNewText, "&acirc;", "â");
    sNewText = regReplace(sNewText, "&atilde;", "ã");
    sNewText = regReplace(sNewText, "&auml;", "ä");
    sNewText = regReplace(sNewText, "&aring;", "å");
    sNewText = regReplace(sNewText, "&aelig;", "æ");
    sNewText = regReplace(sNewText, "&ccedil;", "ç");
    sNewText = regReplace(sNewText, "&egrave;", "è");
    sNewText = regReplace(sNewText, "&eacute;", "é");
    sNewText = regReplace(sNewText, "&ecirc;", "ê");
    sNewText = regReplace(sNewText, "&euml;", "ë");
    sNewText = regReplace(sNewText, "&igrave;", "ì");
    sNewText = regReplace(sNewText, "&iacute;", "í");
    sNewText = regReplace(sNewText, "&icirc;", "î");
    sNewText = regReplace(sNewText, "&iuml;", "ï");
    sNewText = regReplace(sNewText, "&eth;", "ð");
    sNewText = regReplace(sNewText, "&ntilde;", "ñ");
    sNewText = regReplace(sNewText, "&ograve;", "ò");
    sNewText = regReplace(sNewText, "&oacute;", "ó");
    sNewText = regReplace(sNewText, "&ocirc;", "ô");
    sNewText = regReplace(sNewText, "&otilde;", "õ");
    sNewText = regReplace(sNewText, "&oslash;", "ø");
    sNewText = regReplace(sNewText, "&ugrave;", "ù");
    sNewText = regReplace(sNewText, "&uacute;", "ú");
    sNewText = regReplace(sNewText, "&ucirc;", "û");
    sNewText = regReplace(sNewText, "&uuml;", "ü");
    sNewText = regReplace(sNewText, "&yacute;", "ý");
    sNewText = regReplace(sNewText, "&thorn;", "þ");
    sNewText = regReplace(sNewText, "&yuml;", "ÿ");
    sNewText = regReplace(sNewText, "&amp;", '&');
    sNewText = regReplace(sNewText, "&amp;ecirc;", "ê");
    sNewText = regReplace(sNewText, "&amp;aacute;", "á");
    sNewText = regReplace(sNewText, "&amp;oacute;", "ó");
    sNewText = regReplace(sNewText, "&amp;atilde;", "ã");
    sNewText = regReplace(sNewText, "&amp;agrave;", "à");
    sNewText = regReplace(sNewText, "&amp;ocirc;", "ô");
    sNewText = regReplace(sNewText, "&amp;igrave;", "ì");
    sNewText = regReplace(sNewText, "&amp;Agrave;", "À");
    sNewText = regReplace(sNewText, "&amp;Aacute;", "Á");
    sNewText = regReplace(sNewText, "&amp;Acirc;", "Â");
    sNewText = regReplace(sNewText, "&amp;Atilde;", "Ã");
    sNewText = regReplace(sNewText, "&amp;Auml;", "Ä");
    sNewText = regReplace(sNewText, "&amp;Aring;", "Å");
    sNewText = regReplace(sNewText, "&amp;AElig;", "Æ");
    sNewText = regReplace(sNewText, "&amp;Egrave;", "È");
    sNewText = regReplace(sNewText, "&amp;Ccedil;", "Ç");
    sNewText = regReplace(sNewText, "&amp;Eacute;", "É");
    sNewText = regReplace(sNewText, "&amp;Ecirc;", "Ê");
    sNewText = regReplace(sNewText, "&amp;Euml;", "Ë");
    sNewText = regReplace(sNewText, "&amp;Igrave;", "Ì");
    sNewText = regReplace(sNewText, "&amp;&Iacute;", "Í");
    sNewText = regReplace(sNewText, "&amp;&Icirc;", "Î");
    sNewText = regReplace(sNewText, "&amp;&Iuml;", "Ï");
    sNewText = regReplace(sNewText, "&amp;&ETH;", "Ð");
    sNewText = regReplace(sNewText, "&amp;&Ntilde;", "Ñ");
    sNewText = regReplace(sNewText, "&amp;&Ograve;", "Ò");
    sNewText = regReplace(sNewText, "&amp;&Oacute;", "Ó");
    sNewText = regReplace(sNewText, "&amp;&Ocirc;", "Ô");
    sNewText = regReplace(sNewText, "&amp;&Otilde;", "Õ");
    sNewText = regReplace(sNewText, "&amp;&Ouml;", "Ö");
    sNewText = regReplace(sNewText, "&amp;&Oslash;", "Ø");
    sNewText = regReplace(sNewText, "&amp;&Ugrave;", "Ù");
    sNewText = regReplace(sNewText, "&amp;&Uacute;", "Ú");
    sNewText = regReplace(sNewText, "&amp;&Ucirc;", "Û");
    sNewText = regReplace(sNewText, "&amp;&Uuml;", "Ü");
    sNewText = regReplace(sNewText, "&amp;&Yacute;", "Ý");
    sNewText = regReplace(sNewText, "&amp;&THORN;", "Þ");
    sNewText = regReplace(sNewText, "&amp;&szlig;", "ß");
    sNewText = regReplace(sNewText, "&amp;&acirc;", "â");
    sNewText = regReplace(sNewText, "&amp;&auml;", "ä");
    sNewText = regReplace(sNewText, "&amp;&aring;", "å");
    sNewText = regReplace(sNewText, "&amp;&aelig;", "æ");
    sNewText = regReplace(sNewText, "&amp;&ccedil;", "ç");
    sNewText = regReplace(sNewText, "&amp;&egrave;", "è");
    sNewText = regReplace(sNewText, "&amp;&eacute;", "é");
    sNewText = regReplace(sNewText, "&amp;&euml;", "ë");
    sNewText = regReplace(sNewText, "&amp;&igrave;", "ì");
    sNewText = regReplace(sNewText, "&amp;&iacute;", "í");
    sNewText = regReplace(sNewText, "&amp;&icirc;", "î");
    sNewText = regReplace(sNewText, "&amp;&iuml;", "ï");
    sNewText = regReplace(sNewText, "&amp;&eth;", "ð");
    sNewText = regReplace(sNewText, "&amp;&ntilde;", "ñ");
    sNewText = regReplace(sNewText, "&amp;&ograve;", "ò");
    sNewText = regReplace(sNewText, "&amp;&otilde;", "õ");
    sNewText = regReplace(sNewText, "&amp;&oslash;", "ø");
    sNewText = regReplace(sNewText, "&amp;&ugrave;", "ù");
    sNewText = regReplace(sNewText, "&amp;&uacute;", "ú");
    sNewText = regReplace(sNewText, "&amp;&ucirc;", "û");
    sNewText = regReplace(sNewText, "&amp;&uuml;", "ü");
    sNewText = regReplace(sNewText, "&amp;&yacute;", "ý");
    sNewText = regReplace(sNewText, "&amp;&thorn;", "þ");
    sNewText = regReplace(sNewText, "&amp;&yuml;", "ÿ");

    //sNewText=regReplace(sNewText,">","&gt;");
    //sNewText=regReplace(sNewText,"<","&lt;");

    //sNewText=regReplace(sNewText,"<!\[CDATA\[", " ");
    //sNewText=regReplace(sNewText,"\]\]>", " ");
    return sNewText;

}
function removeSpecialCharForText(sText) {
    var tmpStr = sText.replace(/[|&;$%@"<>()+,]/g, ''); //!"#$%&'+/:;<=>?@[\]`^{|}~   //-.*,()
    //return sText.replace(/([^a-z0-9.,*])+/gi, '-');//parseFloat(amount.replace(/[^0-9-.]/g, ''));
    return tmpStr;
}

function checkSpecialChar(sText) {
    return sText.match(/[!@#$^%&*?><.(]/gi);
}
function checkVietnameseChar(sText) {
    return sText.match(/[àáạảãâầấậẩẫăằắặẳẵÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴèéẹẻẽêềếệểễÈÉẸẺẼÊỀẾỆỂỄìíịỉĩÌÍỊỈĨòóọỏõôồốộổỗơờớợởỡÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠùúụủũưừứựửữÙÚỤỦŨƯỪỨỰỬỮỳýỵỷỹĐđ]/g);
}

function checkAvailableChar(sText) {
    return sText.match(/^[a-zA-Z0-9_\/\-\(\):,. ]*$/gi);
}
function checkAvailableCharLNH(sText) {
    return sText.match(/^[a-zA-Z0-9_\/\-\(\):,.& ]*$/gi);
}
function checkAvailableCharUsername(sText) {
    return sText.match(/^[a-zA-Z0-9]*$/gi);
}
function regReplace(sInput, sReg, sNew) {
    var re = new RegExp(sReg, "g");
    return sInput.replace(re, sNew);
}

function setInputOnlyCharAndUpcase(inID, inAlert) {
    if (!inID) return;
    var inputNode = (typeof(inID) == 'string') ? document.getElementById(inID) : inID;
    inputNode.onkeyup = function (e) {
        e.preventDefault();
        var evt = e || window.event;
        var ew = evt.keyCode || evt.which;
        if ((ew == 13) || (ew == 9)) //enter key, tab key
        {
            //fire event listener
            evtSpecialKeyPressed.keyPress = ew;
            inputNode.dispatchEvent(evtSpecialKeyPressed);
        }

        var str = String.fromCharCode(ew);
        if (str.match(/^[a-zA-Z0-9]*$/) || (ew == 8) || (ew == 46)) {
            if (!Environment.isAndroid()) inputNode.value = removeAccent(inputNode.value);
            return true;
        }
        else {
            return false;
        }
        //inputNode.value = inputNode.value + replaceVietnameseChars(String.fromCharCode(ew)).toUpperCase();
        //inputNode.value = removeAccent(inputNode.value);
        //return false;
    };
}

function setInputCharNumberAndUpcase(inID, inAlert) {
    if (!inID) return;
    var inputNode = (typeof(inID) == 'string') ? document.getElementById(inID) : inID;
    inputNode.onkeyup = function (e) { //must using keypress event to get keycode from char code
        e.preventDefault();
        var evt = e || window.event;
        var ew = evt.keyCode || evt.which;
        if ((ew == 13) || (ew == 9)) //enter key, tab key
        {
            //fire event listener
            evtSpecialKeyPressed.keyPress = ew;
            inputNode.dispatchEvent(evtSpecialKeyPressed);
        }
        var str = String.fromCharCode(ew);
        if (str.match(/^[a-zA-Z0-9]*$/) || (ew == 8) || (ew == 46)) {
            if (!Environment.isAndroid()) inputNode.value = removeAccent(inputNode.value);
            return true;
        }
        else {
            return false;
        }
        //inputNode.value = inputNode.value + replaceVietnameseChars(String.fromCharCode(ew)).toUpperCase();
        //inputNode.value = removeAccent(inputNode.value);

        //return false;
    };
}

function setInputOnlyNumberAndChar(inID, inAlert) {
    if (!inID) return;
    var inputNode = (typeof(inID) == 'string') ? document.getElementById(inID) : inID;
    inputNode.onkeypress = function (e) {
        //e.preventDefault();
        var evt = e || window.event;
        var ew = evt.keyCode || evt.which;
        if (ew == 8 || ew == 37 || ew == 38 || ew == 39 || ew == 40) //backspace key
            return true;
        if (48 <= ew && ew <= 57)
            return true;
        if (65 <= ew && ew <= 90)
            return true;
        if (97 <= ew && ew <= 122)
            return true;
        if ((ew == 13) || (ew == 9)) //enter key, tab key
        {
            //fire event listener
            evtSpecialKeyPressed.keyPress = ew;
            inputNode.dispatchEvent(evtSpecialKeyPressed);
            return true;
        }
        if ((inAlert != undefined) && (inAlert != null) && (inAlert.length > 0)) {
            showAlertText(inAlert);
        }
        return false;
    };
}

function setInputOnlyNumber(inID, inAlert) {
    if (!inID) return;
    var inputNode = (typeof(inID) == 'string') ? document.getElementById(inID) : inID;
    inputNode.onkeypress = function (e) {
        //e.preventDefault();
        var evt = e || window.event;
        var ew = evt.keyCode || evt.which;
        if (ew == 8 || ew == 46 || ew == 37 || ew == 38 || ew == 39 || ew == 40) //backspace key
            return true;
        if (48 <= ew && ew <= 57)
            return true;
        if ((ew == 13) || (ew == 9)) //enter key, tab key
        {
            //fire event listener
            evtSpecialKeyPressed.keyPress = ew;
            inputNode.dispatchEvent(evtSpecialKeyPressed);
            return true;
        }
        if ((inAlert != undefined) && (inAlert != null) && (inAlert.length > 0)) {
            showAlertText(inAlert);
        }
        return false;
    };
}
//ngocdt chinh sua cho phep nhap dau '-' truong so dien thoai trong thay doi thong tin ca nhan
function setInputOnlyNumberInfo(inID, inAlert) {
    if (!inID) return;
    var inputNode = (typeof(inID) == 'string') ? document.getElementById(inID) : inID;
    inputNode.onkeypress = function (e) {
        //e.preventDefault();
        var evt = e || window.event;
        var ew = evt.keyCode || evt.which;
        if (ew == 37 || ew == 38 || ew == 40 || ew == 41) {
            return false;
        }
        if (ew == 8 || ew == 46 || ew == 39 || ew == 45) //backspace key
            return true;
        if (48 <= ew && ew <= 57)
            return true;
        if ((ew == 13) || (ew == 9)) //enter key, tab key
        {
            //fire event listener
            evtSpecialKeyPressed.keyPress = ew;
            inputNode.dispatchEvent(evtSpecialKeyPressed);
            return true;
        }
        if ((inAlert != undefined) && (inAlert != null) && (inAlert.length > 0)) {
            showAlertText(inAlert);
        }
        return false;
    };
}
//ngocdt3 end

/*** ALERT VIEW ***/

// create the event
var evt = document.createEvent('Event');
// define that the event name is `closeAlertView`
evt.initEvent('closeAlertView', true, true);


function closealert() {
    var alertdg = document.getElementById("alert-info-dialog");
    //alertdg.style.display = "none";
    alertdg.style.opacity = 0;
    setTimeout(function () {
        alertdg.style.zIndex = 0;
        alertdg.style.display = 'none';
    }, 500);
    //fire event listener
    document.dispatchEvent(evt);
}
function createDialogMessage(msg,focusElAffterClose){
        modalDialog = new ModalDialog({
            type:2,
            title: CONST_STR.get('LOGIN_NOTIFICATION'),
            contentMessage:msg,
            isCloseShow: true,
            cancel: CONST_STR.get('ALERT_BTN_CLOSE_TITLE'),
            // agree: "Đồng ý",
            parentNote:""
        });
        modalDialog.setParentShow("mainview");
        modalDialog.setCallback(function(param){
            document.dispatchEvent(evt);
            if(typeof(focusElAffterClose) != 'undefined'){
                setTimeout(function(){
                    focusElAffterClose.focus();
                },1000)
            }
        });

        modalDialog.onCreateDialog();

    }

function showAlertText(inContent,focusElAffterClose) {
    hiddenKeyBoard();
    createDialogMessage(inContent,focusElAffterClose);
    modalDialog.showDialog();


   // var alertContent = document.getElementById("alert-info-content");
   // alertContent.innerHTML = inContent;
   // var alertdg = document.getElementById("alert-info-dialog");

   // alertdg.style.zIndex = 2011;
   // alertdg.style.display = "block";
   // setTimeout(function (e) {
   // alertdg.style.opacity = 1;
   // if (!Environment.isMobile()) {
   //      alertdg.getElementsByTagName('input')[0].focus();
   // }
   // }, 300);

}

/*** ALERT VIEW END ***/

/*** ALERT CONFIRM VIEW ***/

var evtCancel = document.createEvent('Event');
evtCancel.initEvent('alertConfirmCancel', true, true);
var evtOK = document.createEvent('Event');
evtOK.initEvent('alertConfirmOK', true, true);
// var oks = document.getElementById('eb_dialog_agree').setAttribute('onclick','doSomething();' + onclick)
function abc(n){

}
function closeAlertConfirm(inStatus) {
    var alertdg = document.getElementById("alert-confirm-dialog");
    //alertdg.style.display = "none";
    alertdg.style.opacity = 0;
    setTimeout(function () {
        alertdg.style.zIndex = 0;
        alertdg.style.display = 'none';
    }, 500);
    //fire event listener
    if (inStatus) {
        document.dispatchEvent(evtOK);
    }
    else {
        document.dispatchEvent(evtCancel);
    }

}

function showAlertConfirmText(inContent) {
    hiddenKeyBoard();

    var alertContent = document.getElementById("alert-confirm-content");
    alertContent.innerHTML = inContent;

    var alertdg = document.getElementById("alert-confirm-dialog");
    alertdg.style.display = "block";
    alertdg.style.zIndex = 2010;

    //setTimeout(function (e) {
    alertdg.style.opacity = 1;
    if (!Environment.isMobile()) {
        if (alertdg.getElementsByTagName('input')[1]) alertdg.getElementsByTagName('input')[1].focus();
    }

    // }, 300);
}

//New alert confirm
var alertAppConfirmCancel = document.createEvent('Event');
alertAppConfirmCancel.initEvent('alertAppConfirmCancel', true, true);
var alertAppConfirmOK = document.createEvent('Event');
alertAppConfirmOK.initEvent('alertAppConfirmOK', true, true);

function closeAlertApp(inStatus) {
    var alertdg = document.getElementById("alert-app-confirm");
    alertdg.style.display = "none";
    alertdg.style.opacity = 0;
    setTimeout(function () {
        alertdg.style.zIndex = 0;
        alertdg.style.display = 'none';
    }, 500);
    //fire event listener
    if (inStatus) {
        document.dispatchEvent(alertAppConfirmOK);
    }
    else {
        document.dispatchEvent(alertAppConfirmCancel);
    }

}

function showAlertAppText(inContent, inBtnOKTitle, inBtnCancelTitle, inImgAlertSrc) {
    hiddenKeyBoard();
    // createDialogApptext1(inContent,inBtnCancelTitle,inBtnOKTitle,inImgAlertSrc)
    // notificationdialog.showDialog();
    var alertContent = document.getElementById("alert-app-content");
    /*if(inImgAlertSrc && inImgAlertSrc.length > 1) {
     //<img width="50" height="50" style="border:1px solid #000;display: inline;margin: 5px;">
     alertContent.innerHTML = '<img width="50" height="50" style="border:1px solid #000;margin: 5px 5px 5px 0px;" src=\'' + inImgAlertSrc + '\'>' + inContent;
     alertContent.style.padding = "15px 15px 15px 5px";
     }
     else {*/
    alertContent.innerHTML = inContent;
    // }

    //OK button
    if (inBtnOKTitle && inBtnOKTitle.length > 0) {
        document.getElementById('btnAlertAppOk').value = inBtnOKTitle;
    }
    //Cancel button
    if (inBtnCancelTitle && inBtnCancelTitle.length > 0) {
        document.getElementById('btnAlertAppCancel').value = inBtnCancelTitle;
    }
    var alertdg = document.getElementById("alert-app-confirm");
    alertdg.style.display = "block";
    alertdg.style.zIndex = 2010;

    //setTimeout(function (e) {
    alertdg.style.opacity = 1;
    if (!Environment.isMobile()) {
        if (alertdg.getElementsByTagName('input')[1]) alertdg.getElementsByTagName('input')[1].focus();
    }

    // }, 300);
}

//20140830
function closeAlertConfirmScheduleBank(inStatus) {
    var alertdg = document.getElementById("alert-confirm-dialog-schedulebank");
    //alertdg.style.display = "none";
    alertdg.style.opacity = 0;
    setTimeout(function () {
        alertdg.style.zIndex = 0;
        alertdg.style.display = 'none';
    }, 500);
    //fire event listener
    if (inStatus) {
        document.dispatchEvent(evtOK);
    }
    else {
        document.dispatchEvent(evtCancel);
    }

}

function showAlertConfirmTextScheduleBank(inContent) {
    hiddenKeyBoard();

    var alertContent = document.getElementById("alert-confirm-content-schedulebank");
    alertContent.innerHTML = inContent;
    var alertdg = document.getElementById("alert-confirm-dialog-schedulebank");
    alertdg.style.display = "block";
    alertdg.style.zIndex = 2010;

    //setTimeout(function (e) {
    alertdg.style.opacity = 1;
    // }, 300);
}
//20140830

function showAlertKHCN_KHDN_TERMS(inContent) {
    hiddenKeyBoard();

    var alertContent = document.getElementById("alert-KHCN-KHDN-TERMS-content");
    alertContent.innerHTML = inContent;
    var alertdg = document.getElementById("alert-KHCN-KHDN-TERMS-dialog");
    alertdg.style.display = "block";
    alertdg.style.zIndex = 2010;

    //setTimeout(function (e) {
    alertdg.style.opacity = 1;
    // }, 300);
}
function showAlertNOT_ALLOW_USE_FINGERSPRINT(mycontent) {
    hiddenKeyBoard();
    var alertdg = document.getElementById("alert-NOT-ALLOW-USE-FINGERSPRINT-dialog");
    alertdg.style.display = "block";
    alertdg.style.zIndex = 2010;
	document.getElementById("content-not-allow-use-finger").innerHTML = mycontent;
    //setTimeout(function (e) {
    alertdg.style.opacity = 1;
    // }, 300);
}
function showAlertKHCN_KHDN_INSTRUCTION(inContent) {
    hiddenKeyBoard();

    var alertContent = document.getElementById("alert-KHCN-KHDN-INSTRUCTION-content");
    alertContent.innerHTML = inContent;
    var alertdg = document.getElementById("alert-KHCN-KHDN-INSTRUCTION-dialog");
    alertdg.style.display = "block";
    alertdg.style.zIndex = 2010;

    //setTimeout(function (e) {
    alertdg.style.opacity = 1;
    // }, 300);
}

function showAlertKHCN_KHDN_FAQ(inContent) {
    hiddenKeyBoard();

    var alertContent = document.getElementById("alert-KHCN-KHDN-FAQ-content");
    alertContent.innerHTML = inContent;
    var alertdg = document.getElementById("alert-KHCN-KHDN-FAQ-dialog");
    alertdg.style.display = "block";
    alertdg.style.zIndex = 2010;

    //setTimeout(function (e) {
    alertdg.style.opacity = 1;
    // }, 300);
}


function closealertKHCN_KHDN_TERMS() {
    var alertdg = document.getElementById("alert-KHCN-KHDN-TERMS-dialog");
    //alertdg.style.display = "none";
    alertdg.style.opacity = 0;
    setTimeout(function () {
        alertdg.style.zIndex = 0;
        alertdg.style.display = 'none';
    }, 500);
    //fire event listener
    document.dispatchEvent(evt);
}

function closealertKHDN_TERMS() {
    var alertdg = document.getElementById("alert-KHCN-KHDN-TERMS-dialog");
    //alertdg.style.display = "none";
    alertdg.style.opacity = 0;
    setTimeout(function () {
        alertdg.style.zIndex = 0;
        alertdg.style.display = 'none';
    }, 500);
    //fire event listener
    document.dispatchEvent(evt);

    //check VN EN
    if (gUserInfo.lang == 'EN') {
        //window.open('./download/Dieu khoan dieu kien eBank - KHDN - Vietnamese.pdf');
        openLinkInWindows('./download/Dieu khoan dieu kien eBank - KHDN - Vietnamese.pdf');
    }
    else {
        //window.open('./download/Dieu khoan dieu kien eBank - KHDN - Vietnamese.pdf');
        openLinkInWindows('./download/Dieu khoan dieu kien eBank - KHDN - Vietnamese.pdf');
    }
}

function closealertKHCN_TERMS() {
    var alertdg = document.getElementById("alert-KHCN-KHDN-TERMS-dialog");
    //alertdg.style.display = "none";
    alertdg.style.opacity = 0;
    setTimeout(function () {
        alertdg.style.zIndex = 0;
        alertdg.style.display = 'none';
    }, 500);
    //fire event listener
    document.dispatchEvent(evt);

    //check VN EN
    if (gUserInfo.lang == 'EN') {
        //window.open('./download/Dieu khoan dieu kien eBank - KHCN - English.pdf');
        openLinkInWindows('./download/Dieu khoan dieu kien eBank - KHCN - English.pdf');
    }
    else {
        //window.open('./download/Dieu khoan dieu kien eBank - KHCN - Vietnamese.pdf');
        openLinkInWindows('./download/Dieu khoan dieu kien eBank - KHCN - Vietnamese.pdf');
    }
}

function closealertKHCN_KHDN_INSTRUCTION() {
    var alertdg = document.getElementById("alert-KHCN-KHDN-INSTRUCTION-dialog");
    //alertdg.style.display = "none";
    alertdg.style.opacity = 0;
    setTimeout(function () {
        alertdg.style.zIndex = 0;
        alertdg.style.display = 'none';
    }, 500);
    //fire event listener
    document.dispatchEvent(evt);
}

function closealertKHDN_INSTRUCTION() {
    var alertdg = document.getElementById("alert-KHCN-KHDN-INSTRUCTION-dialog");
    //alertdg.style.display = "none";
    alertdg.style.opacity = 0;
    setTimeout(function () {
        alertdg.style.zIndex = 0;
        alertdg.style.display = 'none';
    }, 500);
    //fire event listener
    document.dispatchEvent(evt);

    //check VN EN
    if (gUserInfo.lang == 'EN') {
        //window.open('./download/HDSD Internet Banking - KHDN - Vietnamese.pdf');
        openLinkInWindows('./download/HDSD Internet Banking - KHDN - Vietnamese.pdf');
    }
    else {
        //window.open('./download/HDSD Internet Banking - KHDN - Vietnamese.pdf');
        openLinkInWindows('./download/HDSD Internet Banking - KHDN - Vietnamese.pdf');
    }
}

function closealertKHCN_INSTRUCTION() {
    var alertdg = document.getElementById("alert-KHCN-KHDN-INSTRUCTION-dialog");
    //alertdg.style.display = "none";
    alertdg.style.opacity = 0;
    setTimeout(function () {
        alertdg.style.zIndex = 0;
        alertdg.style.display = 'none';
    }, 500);
    //fire event listener
    document.dispatchEvent(evt);

    //check VN EN
    if (gUserInfo.lang == 'EN') {
        //window.open('./download/HDSD Internet Banking - KHCN - Vietnamese.pdf');
        if (gModeScreenView == CONST_MODE_SCR_SMALL) {
            openLinkInWindows('./download/HDSD Internet Banking - KHCN - Vietnamese (smallscreen).pdf');
        }
        else {
            openLinkInWindows('./download/HDSD Internet Banking - KHCN - Vietnamese.pdf');
        }
    }
    else {
        //window.open('./download/HDSD Internet Banking - KHCN - Vietnamese.pdf');
        if (gModeScreenView == CONST_MODE_SCR_SMALL) {
            openLinkInWindows('./download/HDSD Internet Banking - KHCN - Vietnamese (smallscreen).pdf');
        }
        else {
            openLinkInWindows('./download/HDSD Internet Banking - KHCN - Vietnamese.pdf');
        }
    }
}
function closealertNOT_ALLOW_USE_FINGERSPRINT() {
    var alertdg = document.getElementById("alert-NOT-ALLOW-USE-FINGERSPRINT-dialog");
    //alertdg.style.display = "none";
    alertdg.style.opacity = 0;
    setTimeout(function () {
        alertdg.style.zIndex = 0;
        alertdg.style.display = 'none';
    }, 500);
    //fire event listener
    document.dispatchEvent(evt);
}
function closealertKHCN_KHDN_FAQ() {
    var alertdg = document.getElementById("alert-KHCN-KHDN-FAQ-dialog");
    //alertdg.style.display = "none";
    alertdg.style.opacity = 0;
    setTimeout(function () {
        alertdg.style.zIndex = 0;
        alertdg.style.display = 'none';
    }, 500);
    //fire event listener
    document.dispatchEvent(evt);
}

function closealertKHDN_FAQ() {
    var alertdg = document.getElementById("alert-KHCN-KHDN-FAQ-dialog");
    //alertdg.style.display = "none";
    alertdg.style.opacity = 0;
    setTimeout(function () {
        alertdg.style.zIndex = 0;
        alertdg.style.display = 'none';
    }, 500);
    //fire event listener
    document.dispatchEvent(evt);

    //20140911: hien box lien he - begin
    var tmpNodeMain = document.getElementById('mainview');
    tmpNodeMain.style.cssFloat = 'right';
    tmpNodeMain.style.width = '100%';
//    document.getElementById('box_lienhe').style.display = 'block';
    //20140911: hien box lien he - end

    //check VN EN
    if (gUserInfo.lang == 'EN') {
        navController.initWithRootView('faq-scr-eng', true, 'html');
    }
    else {
        navController.initWithRootView('faq-scr-vie', true, 'html');
    }
}

function closealertKHCN_FAQ() {
    var alertdg = document.getElementById("alert-KHCN-KHDN-FAQ-dialog");
    //alertdg.style.display = "none";
    alertdg.style.opacity = 0;
    setTimeout(function () {
        alertdg.style.zIndex = 0;
        alertdg.style.display = 'none';
    }, 500);
    //fire event listener
    document.dispatchEvent(evt);

    //20140911: hien box lien he - begin
    var tmpNodeMain = document.getElementById('mainview');
    tmpNodeMain.style.cssFloat = 'right';
    tmpNodeMain.style.width = '100%';
//    document.getElementById('box_lienhe').style.display = 'block';
    //20140911: hien box lien he - end

    //check VN EN
    if (gUserInfo.lang == 'EN') {
        navController.initWithRootView('faq-scr-eng', true, 'html');
    }
    else {
        navController.initWithRootView('faq-scr-vie', true, 'html');
    }
}

/*** ALERT CONFIRM VIEW END ***/

/*** LOADING VIEW ***/
function hideLoadingMask() {
    console.log("############### Vao hideLoadingMask")
    var sender = document.getElementById('loadingMask');
    sender.style.opacity = 0;
    sender.style.display = 'none';
    isShowingMask = false;
    //setTimeout(function () {
    //    sender.style.display = 'none';
    //	console.log("############### Ra hideLoadingMask")
    // }, 900);

}
function showLoadingMask(sender) {
    isShowingMask = true;
    hiddenKeyBoard();
    windowScrollToTop();
    var sender = document.getElementById('loadingMask');
    sender.style.display = 'block';
    sender.style.opacity = 1;
}

/*** LOADING VIEW END ***/

//*********************************************************************************************/
//********************************THUANTM DIALOG INPUT ************************************///

var evtSelectionDialogInput = document.createEvent('Event');
evtSelectionDialogInput.initEvent('evtSelectionDialogInput', true, true);

var evtSelectionDialogCloseInput = document.createEvent('Event');
evtSelectionDialogCloseInput.initEvent('evtSelectionDialogCloseInput', true, true);

var evtChangeTab = document.createEvent('Event');
evtChangeTab.initEvent('tabChange', true, true);

var evtInputSelected = document.createEvent('Event');
evtInputSelected.initEvent('onInputSelected', true, true);

//TẠO ĐỐI TƯỢNG DIALOG
function DialogListInput(inTitle, inTransType, inGPayeeCode) {
    //Title for dialog
    this.title = inTitle;
    //Key chuyển khoản nội bộ hay tới ngân hàng
    this.transType = inTransType;	//ARG1
    //Key cho biết tab nào được chọn
    this.gPayeeCode = inGPayeeCode;  //ARG2

    tab1Loaded = false;//Kiem tra xem du lieu da duoc load hay chưa
    tab2Loaded = false;//Kiem tra xem du lieu da duoc load hay chưa
}
//HÀM SHOW DIALOG
DialogListInput.prototype.showDialog = function (showDialogSuccessed, args) {
    hiddenKeyBoard();
    var dialogInputCurrent = this;
    setTimeout(function () {
        //Khi dialog show len thi mac dinh tab chua duoc load
        DialogListInput.prototype.tab1Loaded = false;
        DialogListInput.prototype.tab2Loaded = false;

        var divID = 'divListGroupInput';
        var divNode = document.getElementById(divID);
        if ((divNode != null) && (divNode != undefined)) {
            divNode.innerHTML = "";
        }
        else {
            logInfo('Dialog not exist divID: ' + divID);
            return;
        }

        var dialogDivAll = document.createElement('div');
        var aNodeTitle = document.createElement("a");
        aNodeTitle.setAttribute("class", "list-group-item active dialog-payee-caption");
        aNodeTitle.innerHTML = dialogInputCurrent.title;
        divNode.appendChild(aNodeTitle);

        //Add Input tag
        var inputNode = document.createElement("div");

        var contentInput = "";
        contentInput += "<table>" +
            "<tr>" +
            "<td align='center' valign='middle' class='td-text' width='80%'>" +
            "<div style='border-bottom:none' class='input-group'>" +
            "<span class='input-group-addon' style='white-space:pre-wrap; width:0%'>"/*"+CONST_STR.get('TRANS_LOCAL_ACC_DESTINATION')*/ + "</span>" +
            "<input id='id.inputAcc' style='padding-right:10px !important' type='text' class='form-control-input-dialog form-control-righttext' placeholder='" + CONST_STR.get('ESAVING_CHANGEINFO_VF_ARR1') + "' />" +
            "<span class='input-group-addon input-group-symbol'></span>" +
            "</div>" +
            "</td>" +
            "<td width='20%'><input id='inputDone'  style='width: 92px' type = 'button' class='btnshadow btn-second'    value = '" + CONST_STR.get('TRANSFER_REMITTANCE_DONE_BUTTON') + "' onClick = 'selectedClick();'/></td>" +
            "</tr>";
        contentInput +=
            "<tr id = 'tr-tab'>" +
                "<td colspan = '2'>" +
                "<div class='tab' style='margin-top: 0px;'>" +
                "<div class='item selected' id = 'tab1' onClick = 'tabChange(this);'>" +
                "<div class='left'></div>" +
                //"<div class='text'><span>"+CONST_STR.get('TRANSFER_REMITTANCE_SAVE_BENEFIC1')+"</span></div>"+
                "<div class='text'><span>" + CONST_STR.get('MENU_LIST_BENEFIC_TITLE') + "</span></div>" +
                "<div class='right'></div>" +
                "</div>" +
                "<div class='item' id = 'tab2' onClick = 'tabChange(this);'>" +
                "<div class='left'></div>" +
                "<div class='text'><span>" + CONST_STR.get('TRANSFER_REMITTANCE_TEMPLATE') + "</span></div>" +
                "<div class='right'></div>" +
                "</div>" +
                "</div>" +
                "</td>" +
                "</tr>";
        contentInput += "</table>"
        inputNode.innerHTML = contentInput;

        inputNode.setAttribute("class", "list-group-item active dialog-payee-input");
        inputNode.setAttribute('style', 'padding-bottom:0px;');
        divNode.appendChild(inputNode);

        var dialogDivContainerScroll = document.getElementById('selection-dialog-scroll');
        if (dialogDivContainerScroll == null || dialogDivContainerScroll == undefined) {
            dialogDivContainerScroll
        } else {
            dialogDivContainerScroll.parentNode.removeChild(dialogDivContainerScroll);
        }

        dialogDivContainerScroll = document.createElement('div');

        dialogDivContainerScroll.setAttribute('id', 'selection-dialog-scroll');
        dialogDivContainerScroll.setAttribute('class', 'dialog-scroll-content');

        dialogDivAll.appendChild(dialogDivContainerScroll);

        divNode.appendChild(dialogDivAll);


        var divContentInput;
        if (document.getElementById('divContent') != null) {
            divContentInput = document.getElementById('divContent');
        }
        else {
            divContentInput = document.createElement('div');
        }
        divContentInput.setAttribute('id', 'divContent');
        dialogDivContainerScroll.appendChild(divContentInput);


        var tmpNodeCaptcha = document.getElementById('id.inputAcc');
        setInputOnlyASCII('id.inputAcc', CONST_STR.get("ERR_INPUT_ONLY_ASCII_CHAR"), inputNormalCharFunc);
        tmpNodeCaptcha.addEventListener('evtSpecialKeyPressed', function (e) {
            //tmpNodePass.removeEventListener('evtSpecialKeyPressed', handleSpecialKeyPressd, false);
            var ew = e.keyPress;
            if (ew == 13) { //Enter pressed
                selectedClick();
            }
            else {
                //inputNormalCharFunc(tmpNodeCaptcha.value);
                return;
            }
        }, false);

        if ((typeof(showDialogSuccessed) == 'function') && (args == null || args == undefined || args == '')) {
            showDialogSuccessed.apply(this);
        }
        //Add du lieu neu co truyen vao
        if (args != null && args != undefined && args.length > 0) {
            //this.addListData(showDialogSuccessed, args);

        } else {
            //B1 add loading
            gPayeeList = new Array();
            //lstTemplate = new Array();
            dialogInputCurrent.requestData('tab1');
        }
        divNode.style.top = (clientHeight - 117) / 2 + 71 + 'px';
        var dialogContainer = document.getElementById("selection-dialog-input");
        if (dialogContainer != null) {
            dialogContainer.style.zIndex = 2001;
            dialogContainer.style.display = "block";
            //setTimeout(function (e) {
            dialogContainer.style.opacity = 1;
            // }, 300);
        }
        if (!Environment.isMobile()) {
            document.getElementById('id.inputAcc').focus();
        }
    }, 300);

};

//HÀM INSERT DATA VÀO DIALOG
DialogListInput.prototype.addListData = function (addDataToDialogSuccessed, args, tab) {//args la mang 2 phan tu (value1, value2)
    var dialogDivContainerScroll = document.getElementById('selection-dialog-scroll');
    var divContentInput;
    if (document.getElementById('divContent') != null) {
        divContentInput = document.getElementById('divContent');
    }
    else {
        divContentInput = document.createElement('div');
    }
    divContentInput.setAttribute('id', 'divContent');
    var dialogDivContainer;

    if (tab == 'tab1') {
        if (document.getElementById('container1') != null) {
            dialogDivContainer = document.getElementById('container1');
        }
        else {
            dialogDivContainer = document.createElement('div');
        }
        dialogDivContainer.setAttribute('id', 'container1');
        DialogListInput.prototype.tab1Loaded = true;
    } else if (tab == 'tab2') {
        if (document.getElementById('container2') != null) {
            dialogDivContainer = document.getElementById('container2');
        }
        else {
            dialogDivContainer = document.createElement('div');
        }

        dialogDivContainer.setAttribute('id', 'container2');
        DialogListInput.prototype.tab2Loaded = true;
    }
    this.removeData(tab);
    for (var x = 1; x < args.length + 1; x++) {
        var aNode = document.createElement("a");
        aNode.setAttribute("class", "list-group-item");
        if (showValue) {
            aNode.style.textAlign = "left";
        }
        else {
            aNode.style.textAlign = "center";
        }

        aNode.setAttribute("onClick", "selectedItemOnDialogInput(this," + x + "," + args[x - 1].index + ");");
        aNode.innerHTML = args[x - 1].value1;

        var tmpValue = args[x - 1].value2;
        if ((tmpValue != undefined) && (tmpValue != null)) {
            var spanNode = document.createElement("span");
            spanNode.setAttribute("class", "badge");
            spanNode.innerHTML = tmpValue;
            if (!showValue) {
                spanNode.style.display = 'none';
            }
            aNode.appendChild(spanNode);
        }
        dialogDivContainer.appendChild(aNode);
        // }

    }
    if (args.length <= 0) {
        dialogDivContainer.innerHTML = CONST_STR.get('BANK_INFO_EMPTY_DATA');
        dialogDivContainer.setAttribute('style', 'padding-top:20px;padding-bottom:10px;');
    }
    divContentInput.appendChild(dialogDivContainer);
    if (!Environment.isMobile()) {
        document.getElementById('id.inputAcc').focus();
    }
    if (typeof(addDataToDialogSuccessed) == 'function') {
        addDataToDialogSuccessed.apply(this);
    }
    DialogListInput.prototype.activeDataOnTab(tab);
}

function showMask() {
    var dialogDivContainerScroll = document.getElementById('selection-dialog-scroll');
    var divMask;
    if (document.getElementById('divMask') != null) {
        divMask = document.getElementById('divMask');
        divMask.style.display = 'block';
    }
    else {
        divMask = document.createElement('div');
        divMask.innerHTML = "<span style = 'display:block;margin:0 auto;padding-top:3px;'>" + CONST_STR.get('ERR_LOADING_PAGE_MSG') + "</span>" +
            "<span class='window8-1'></span>" +
            "<span class='window8-2'></span>" +
            "<span class='window8-3'></span>" +
            "<span class='window8-4'></span>" +
            "<span class='window8-5'></span>" +
            "<span class='window8-6'></span>" +
            "<span class='window8-7'></span>" +
            "<span class='window8-8'></span>";
        divMask.setAttribute('id', 'divMask');
        divMask.setAttribute('style', 'padding-top:0px;margin:0 auto;');
        dialogDivContainerScroll.appendChild(divMask);
    }

}
function hiddenMask() {
    if (document.getElementById('divMask') != null) {
        document.getElementById('divMask').style.display = 'none';
    }
}
//HÀM XÓA DỮ LIỆU TỪ DIALOG
DialogListInput.prototype.removeData = function (tab) {
    if (tab == 'tab1') {
        var container1 = document.getElementById('container1');
        //Xoa cac node con
        while (container1 != null && container1.firstChild) container1.removeChild(container1.firstChild);
    }
    else if (tab == 'tab2') {
        var container2 = document.getElementById('container2');
        //Xoa cac node con
        while (container2 != null && container2.firstChild) container2.removeChild(container2.firstChild);
    }
    /*
     var dialogDivContainerScroll = document.getElementById('selection-dialog-scroll');
     //Xoa cac node con
     while ( dialogDivContainerScroll.firstChild ) dialogDivContainerScroll.removeChild( dialogDivContainerScroll.firstChild );
     //Xoa thanh cong
     if(typeof(removeDataSuccessed) == 'function'){
     removeDataSuccessed.apply(this);
     }*/
}
DialogListInput.prototype.allowInputType = function (paramterType) {
    var inputNode = document.getElementById('id.inputAcc');
    inputNode.setAttribute('type', paramterType);
    //Sẽ kiểm tra và validate sau
    //1.Phone number
    //2. Text
    //3. Account....
}
DialogListInput.prototype.activeDataOnTab = function (tab) {

    var nodeTab1 = document.getElementById('container1');
    var nodeTab2 = document.getElementById('container2');
    if (tab == 'tab2') {

        if (nodeTab1 != null && nodeTab1 != undefined) {
            nodeTab1.style.display = 'none';
        }

        if (nodeTab2 != null && nodeTab2 != undefined) {
            nodeTab2.style.display = 'block';
        }
    } else {

        if (nodeTab1 != null && nodeTab1 != undefined) {
            nodeTab1.style.display = 'block';
        }

        if (nodeTab2 != null && nodeTab2 != undefined) {
            nodeTab2.style.display = 'none';
        }
    }
    if (!Environment.isMobile()) {
        document.getElementById('id.inputAcc').focus();
    }
}

//Request server
DialogListInput.prototype.requestData = function (tabName) {
    sendJSONRequestDialog(this.transType, this.gPayeeCode, tabName);
}

//ẨN TAB
DialogListInput.prototype.hiddenTab2 = function () {
    document.getElementById('tab1').setAttribute("class", "item selected");
    document.getElementById('tab2').style.display = 'none';
}
//Hiển thị tab2
DialogListInput.prototype.showTab2 = function () {
    document.getElementById('tab2').style.display = '';
}
//*****handleFilterOnDialog******//
function handleFilterOnDialog(evt, node) {
    var valueFilter = node.value;
    if (typeof(onFilterDialog) == 'function') {
        onFilterDialog(valueFilter);
    }
}
//Function get tabSelected
function getTabSelected() {
    var tab1 = document.getElementById('tab1');
    var tab2 = document.getElementById('tab2');
    if (tab1 != null && tab1.getAttribute('class') == "item selected") {
        return 'tab1';
    }
    if (tab2 != null && tab2.getAttribute('class') == "item selected") {
        return 'tab2';
    }
    return 'tab1';
}
//User click on Button
//User click on Button
function selectedClick() {
    var inputNode = document.getElementById("id.inputAcc");
    var dialogSelection = document.getElementById("selection-dialog-input");
    if (inputNode != null /*&& inputNode.value.length>0*/) {
        dialogSelection.style.opacity = 0;
        var tmpDialogTimer = setTimeout(function (e) {
            dialogSelection.style.zIndex = 0;
            dialogSelection.style.display = "none";
            clearTimeout(tmpDialogTimer);
            if (inputNode != null && inputNode.value.length > 0) {
                evtInputSelected.selectedValue = inputNode.value;
                document.dispatchEvent(evtInputSelected);
            }

        }, 500);
    }
    /*else{
     var tmpStr = CONST_STR.get("ERR_INPUT_PAYEE_EMPTY").replace('%s', getCominputAccountHtmlTitle());
     showAlertText(tmpStr);
     }*/

}
//User Selected Item
function selectedItemOnDialogInput(inNode, index, idx) {
    event.stopPropagation();
    var dialogSelection = document.getElementById("selection-dialog-input");
    if (inNode.nodeType == 1) {
        if (inNode.tagName == "A") {
            var tabSelected = getTabSelected();
            //fire event listener

            dialogSelection.style.opacity = 0;
            var tmpDialogTimer = setTimeout(function (e) {
                dialogSelection.style.zIndex = 0;
                dialogSelection.style.display = "none";
                clearTimeout(tmpDialogTimer);

                if (tabSelected == 'tab1') {
                    var obj = gPayeeList[idx];
                    evtSelectionDialogInput.dataObject = obj;
                }
                else {
                    var nameKey = inNode.childNodes[0].nodeValue;
                    var obj = lstTemplate[idx];
                    evtSelectionDialogInput.dataObject = obj;
                }
                evtSelectionDialogInput.selectedIndex = idx;

                evtSelectionDialogInput.tabSelected = tabSelected;
                /*var obj = new Object();
                 obj.value1 = inNode.childNodes[0].nodeValue;
                 obj.value2 = inNode.childNodes[1].innerHTML;
                 evtSelectionDialogInput.selectedValue2 = inNode.childNodes[1].innerHTML;

                 if (inNode.childNodes[0] != undefined) {
                 evtSelectionDialogInput.selectedValue1 = inNode.childNodes[0].nodeValue;
                 }
                 if (inNode.childNodes[1] != undefined) {
                 evtSelectionDialogInput.selectedValue2 = inNode.childNodes[1].innerHTML;
                 }*/


                document.dispatchEvent(evtSelectionDialogInput);
            }, 500);
        }
    }
}
//User closed Dialog
function closeDialogInput(inNode) {
    var dialogSelection = document.getElementById("selection-dialog-input");

    if (inNode.nodeType == 1) {
        dialogSelection.style.opacity = 0;
        var tmpDialogTimer = setTimeout(function (e) {
            dialogSelection.style.zIndex = 0;
            dialogSelection.style.display = "none";
            clearTimeout(tmpDialogTimer);
            document.dispatchEvent(evtSelectionDialogCloseInput);
        }, 500);

    }
}
//User click to change tab
function tabChange(node) {
    evtChangeTab.selectedValueTab = node;
    document.dispatchEvent(evtChangeTab);
    if (node.getAttribute("class") == "item selected") {
        return;
    }
    node.setAttribute("class", "item selected");
    if (node.id == 'tab1') {
        document.getElementById('tab2').setAttribute("class", "item");
    }
    else {
        document.getElementById('tab1').setAttribute("class", "item");
    }
}
function sendJSONRequestDialog(transType, gPayeeCode, tabName) {
    var data = {};
    var arrayArgs = new Array();
    if (tabName == 'tab1' && !DialogListInput.prototype.tab1Loaded) {
        //Lấy danh sách tin cậy
        showMask(tabName);
        arrayArgs.push(gPayeeCode);//CONST_PAYEE_INTER_TRANSFER);
        arrayArgs.push(transType);
        requestBacgroundMBService('CMD_TYPE_LOOKUP_PAYEE', arrayArgs, requestMBServiceSuccesssDialog, requestMBServiceFailDialog);
    }
    else
    if (tabName == 'tab2' && !DialogListInput.prototype.tab2Loaded) {
        showMask(tabName);
        arrayArgs.push(gPayeeCode);
        arrayArgs.push(transType);//0 là chuyển khoản nội bộ, 1 là chuyển khoản tới ngân hàng khác
        //Lấy danh sách mẫu
        requestBacgroundMBService('CMD_TRANSFER_TEMPLATE_TEMPLATE', arrayArgs, requestMBServiceSuccesssDialog, requestMBServiceFailDialog);
    }
}
function showEmptyInputData() {

}

function requestMBServiceSuccesssDialog(e) {

    gprsResp = parserJSON(e, false);
    var historyArray = gprsResp.arguments;
    var args = new Array();

    if (gprsResp.respCode != '0') {
        //showAlertText(gprsResp.respContent);
        return;
    }
    hiddenMask();
    if ((gprsResp.respCode == '0') && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_TYPE_LOOKUP_PAYEE")))) {

        //DialogListInput.prototype.tab1Loaded = true;
        gPayeeList = new Array();
        if (historyArray != undefined) {
            for (var i = 0; i < historyArray.length; i++) {
                var payeeArrTemp = historyArray[i].split("#");
                var payeeObjTemp = new PayeeObj();
                payeeObjTemp.customerNo = payeeArrTemp[0];
                payeeObjTemp.payeeType = payeeArrTemp[1];
                payeeObjTemp.transType = payeeArrTemp[2];
                payeeObjTemp.transValue = payeeArrTemp[3];
                payeeObjTemp.peopleName = payeeArrTemp[4];
                payeeObjTemp.partnerCode = payeeArrTemp[5];
                payeeObjTemp.provinceCode = payeeArrTemp[6];
                payeeObjTemp.citadCode = payeeArrTemp[7];
                payeeObjTemp.partnerName = payeeArrTemp[8];
                payeeObjTemp.fancyName = payeeArrTemp[9];
                payeeObjTemp.shortname = payeeArrTemp[10];//NGOCDT3 CHINH SUA
                payeeObjTemp.bincode = payeeArrTemp[11];//NGOCDT3 CHINH SUA
                gPayeeList.push(payeeObjTemp);

                var obj = new Object();
                obj.value1 = payeeObjTemp.transValue;
                if (!payeeObjTemp.shortname || payeeObjTemp.shortname == null || payeeObjTemp.shortname == undefined) {
                    obj.value2 = payeeObjTemp.peopleName
                }
                else {
                    obj.value2 = payeeObjTemp.peopleName + ' - ' + payeeObjTemp.shortname;
                }

                obj.index = i;
                args.push(obj);
            }
        }
        DialogListInput.prototype.addListData(addSuccessed, args, 'tab1');
    }
    if ((gprsResp.respCode == '0') && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_TRANSFER_TEMPLATE_TEMPLATE")))) {
        //DialogListInput.prototype.tab2Loaded = true;
        lstTemplate = new Array();
        if (historyArray != undefined) {
            for (var k = 0; k < historyArray.length; k++) {
                tempArrStr = historyArray[k].split("#");
                objtemp = new Object();
                objtemp.name = tempArrStr[0];
                objtemp.tai_khoan_nguon = tempArrStr[1];
                objtemp.ten_tai_khoan_dich = tempArrStr[2];
                objtemp.tai_khoan_dich = tempArrStr[3];
                objtemp.so_tien = tempArrStr[4];
                objtemp.noi_dung = tempArrStr[5];
                objtemp.ngan_hang_nhan = tempArrStr[6];
                objtemp.ma_citad = tempArrStr[7];
                objtemp.loai_chuyen_tien = tempArrStr[8];
                objtemp.bincode = tempArrStr[9];
                lstTemplate.push(objtemp);

                var obj = new Object();
                obj.value1 = objtemp.tai_khoan_dich;
                obj.value2 = objtemp.name;
                obj.index = k;
                args.push(obj);

            }
        }
        DialogListInput.prototype.addListData(addSuccessed, args, 'tab2');
    }

}
function addSuccessed(node) {
}

function requestMBServiceFailDialog(e) {
    //gprsResp = parserJSON(e);
    //showAlertText(gprsResp.respContent);
}

//HÀM FILTER CHO DIALOG
function inputNormalCharFunc() {
    var node = document.getElementById('id.inputAcc');
    var value = "";
    if (node == null || node == undefined) {
        return;
    }
    else {
        value = node.value;
    }
    var args = new Array();
    var lstToFilter = new Array();

    var tabSelected = getTabSelected();

    if (gPayeeList != null && gPayeeList != undefined) {
        for (var i in gPayeeList) {
            var obj = new Object();
            obj.value1 = gPayeeList[i].transValue;
            obj.value2 = gPayeeList[i].peopleName;
            obj.index = i;
            lstToFilter.push(obj);
        }
        for (var i = 0; i < lstToFilter.length; i++) {
            var nameParent1 = lstToFilter[i].value1;
            var nameParent2 = lstToFilter[i].value2
            var ok = false;
            if (nameParent1 != null && nameParent1 != undefined) {
                nameParent1 = nameParent1.toLowerCase();
                if (nameParent1.indexOf(value.toLowerCase()) > -1) {
                    args.push(lstToFilter[i]);
                    ok = true;
                }
            }
            if (!ok) {
                if (nameParent2 != null && nameParent2 != undefined) {
                    nameParent2 = nameParent2.toLowerCase();
                    if (nameParent2.indexOf(value.toLowerCase()) > -1) {
                        args.push(lstToFilter[i]);
                    }
                }
            }
        }
        DialogListInput.prototype.removeData('tab1');
        DialogListInput.prototype.addListData(addDatasuccessefull, args, 'tab1');
    }
    var args1 = new Array();
    var lstToFilter1 = new Array();
    //else
    if (lstTemplate != null && lstTemplate != undefined) {
        for (var i in lstTemplate) {
            var obj = new Object();
            obj.value1 = lstTemplate[i].tai_khoan_dich;
            obj.value2 = lstTemplate[i].name;
            obj.index = i;
            lstToFilter1.push(obj);
        }
        for (var i = 0; i < lstToFilter1.length; i++) {
            var nameParent1 = lstToFilter1[i].value1;
            var nameParent2 = lstToFilter1[i].value2
            var ok = false;
            if (nameParent1 != null && nameParent1 != undefined) {
                nameParent1 = nameParent1.toLowerCase();
                if (nameParent1.indexOf(value.toLowerCase()) > -1) {
                    args1.push(lstToFilter1[i]);
                    ok = true;
                }
            }
            if (!ok) {
                if (nameParent2 != null && nameParent2 != undefined) {
                    nameParent2 = nameParent2.toLowerCase();
                    if (nameParent2.indexOf(value.toLowerCase()) > -1) {
                        args1.push(lstToFilter1[i]);
                    }
                }
            }
        }
        DialogListInput.prototype.removeData('tab2');
        DialogListInput.prototype.addListData(addDatasuccessefull, args1, 'tab2');

    }
    DialogListInput.prototype.activeDataOnTab(getTabSelected());
    /*
     if(value == ''){
     args = 	lstToFilter;
     }else{
     for(var i = 0; i<lstToFilter.length; i++){
     var nameParent1 = lstToFilter[i].value1;
     var nameParent2 = lstToFilter[i].value2
     var ok = false;
     if(nameParent1 != null && nameParent1 != undefined){
     nameParent1 = nameParent1.toLowerCase();
     if(nameParent1.indexOf(value.toLowerCase()) > -1){
     args.push(lstToFilter[i]);
     ok = true;
     }
     }
     if(!ok){
     if(nameParent2 != null && nameParent2 != undefined){
     nameParent2 = nameParent2.toLowerCase();
     if(nameParent2.indexOf(value.toLowerCase()) > -1){
     args.push(lstToFilter[i]);
     }
     }
     }
     }
     }
     DialogListInput.prototype.removeData();
     DialogListInput.prototype.addListData(addDatasuccessefull, args,tabSelected);
     */
}
//*********************************************************************************************/
//********************************THUANTM DIALOG INPUT END ************************************/

function addDatasuccessefull(node) {
}

/*** DIALOG ***/

var evtSelectionDialog = document.createEvent('Event');
evtSelectionDialog.initEvent('evtSelectionDialog', true, true);
var evtSelectionDialogClose = document.createEvent('Event');
evtSelectionDialogClose.initEvent('evtSelectionDialogClose', true, true);
// show dialog list
function showDialogListWith4Arr(inTitle, inArray1, inArray2, inArray3, inArray4, showValue,isHasBottomBar){
    hiddenKeyBoard();
    setTimeout(function () {
        var dialogHeight = 0;
        var divID = 'divListGroup';
        var divNode = document.getElementById(divID);
        if ((divNode != null) && (divNode != undefined)) {
            divNode.innerHTML = "";
        }
        else {
            logInfo('Dialog not exist divID: ' + divID);
            return;
        }
        if (inArray1.length <= 0) {
            logInfo('Dialog do not have inArray1 data');
            return;
        }
        var dialogDivAll = document.createElement('div');
        var dialogDivContainerScroll = document.createElement('div');
        dialogDivContainerScroll.setAttribute('id', 'selection-dialog-scroll');
        dialogDivContainerScroll.setAttribute('class', 'dialog-scroll-content div-selection-dialog');
        var dialogDivContainer = document.createElement('div');
        for (var x = 1; x < inArray1.length + 1; x++) {
            if (x < 6) {
                dialogHeight = dialogHeight + 39;
            }
            var aNode = document.createElement("a");
            aNode.setAttribute("class", "list-group-item");
            if (showValue) {
                aNode.style.textAlign = "left";
            }
            else {
                aNode.style.textAlign = "center";
            }
            aNode.setAttribute("onClick", "selectedItemOnDialog(this," + x + "," + isHasBottomBar + ");");
            aNode.innerHTML = inArray1[x - 1];
            var tmpValue = inArray2[x - 1] + "/" +inArray3[x - 1];
            if ((tmpValue != undefined) && (tmpValue != null)) {
                var spanNode = document.createElement("span");
                spanNode.setAttribute("class", "badge");
                spanNode.setAttribute("style", "width: 25%");
                spanNode.innerHTML = tmpValue;
                spanNode.style.display = 'none';
                aNode.appendChild(spanNode);
            }
            dialogDivContainer.appendChild(aNode);
            var tmpValue3 = inArray3[x - 1];
            if ((tmpValue3 != undefined) && (tmpValue3 != null)) {
                var spanNode = document.createElement("span");
                spanNode.setAttribute("class", "badge");
                spanNode.innerHTML = tmpValue3;
                if (!showValue) {
                    spanNode.style.display = 'none';
                }
                aNode.appendChild(spanNode);
            }
            dialogDivContainer.appendChild(aNode);

            var tmpValue4 = inArray4[x - 1];
            if ((tmpValue4 != undefined) && (tmpValue4 != null)) {
                var spanNode = document.createElement("span");
                spanNode.setAttribute("class", "badge");
                spanNode.innerHTML = tmpValue4;
                if (!showValue) {
                    spanNode.style.display = 'none';
                }
                aNode.appendChild(spanNode);
            }
            dialogDivContainer.appendChild(aNode);
        }
        dialogDivContainerScroll.appendChild(dialogDivContainer);
        dialogDivAll.appendChild(dialogDivContainerScroll);
        divNode.appendChild(dialogDivAll);
        initDialog(inTitle,divNode.innerHTML,"FIX-DEFAULT",function callbackClose(){
            document.dispatchEvent(evtSelectionDialogClose);
        },function callbackLoadXSL(){
            modalDialog.showDialogFull();
            actionbar.hideActionbar();
            bottomBar.hide();
        },false);
    }, 300);
}
// show dialog list
function showDialogList(inTitle, inArray1, inArray2, showValue, isHasBottomBar) { //inArray1 is the most important, showValue: true - text align left, false - text align right
    // hiddenKeyBoard();
    setTimeout(function () {
        var dialogHeight = 0;
        var divID = 'divListGroup';
        var divNode = document.getElementById(divID);
        if ((divNode != null) && (divNode != undefined)) {
            divNode.innerHTML = "";
        }
        else {
            logInfo('Dialog not exist divID: ' + divID);
            return;
        }
        if (inArray1.length <= 0) {
            logInfo('Dialog do not have inArray1 data');
            return;
        }

        var dialogDivAll = document.createElement('div');
        var dialogDivContainerScroll = document.createElement('div');
        dialogDivContainerScroll.setAttribute('id', 'selection-dialog-scroll');
        dialogDivContainerScroll.setAttribute('class', 'dialog-scroll-content div-selection-dialog');
        // dialogDivContainerScroll.setAttribute('style', 'width:97%;margin:10px auto;border-radius:5px;background: rgba(255, 229, 245, 0.33);');
        var dialogDivContainer = document.createElement('div');

        for (var x = 1; x < inArray1.length + 1; x++) {
            if (x < 6) {
                dialogHeight = dialogHeight + 39;
            }
            var aNode = document.createElement("a");

            /*if (x == 0) {
             aNode.setAttribute("class", "list-group-item active");
             aNode.innerHTML = inTitle;
             divNode.appendChild(aNode);
             }
             else {*/
            aNode.setAttribute("class", "list-group-item");
            if (showValue) {
                aNode.style.textAlign = "left";
            }
            else {
                aNode.style.textAlign = "center";
            }

            aNode.setAttribute("onClick", "selectedItemOnDialog(this," + x + "," + isHasBottomBar + ");");
            aNode.innerHTML = inArray1[x - 1];

            var tmpValue = inArray2[x - 1];
            if ((tmpValue != undefined) && (tmpValue != null)) {
                var spanNode = document.createElement("span");
                spanNode.setAttribute("class", "badge");
                spanNode.innerHTML = tmpValue;
                if (!showValue) {
                    spanNode.style.display = 'none';
                }
                aNode.appendChild(spanNode);
            }
            dialogDivContainer.appendChild(aNode);
            // }

        }

        dialogDivContainerScroll.appendChild(dialogDivContainer);
        //divNode.appendChild(dialogDivContainerScroll);
        dialogDivAll.appendChild(dialogDivContainerScroll);

        divNode.appendChild(dialogDivAll);
        initDialog(inTitle,divNode.innerHTML,"FIX-DEFAULT",function callbackClose(){
            var dialogFullPri = document.getElementById("myModalFullDialog");
            if(dialogFullPri){
                if(dialogFullPri.style.display == 'block'){
                    return;
                }
            }
            actionbar.showActionBar();
            if(typeof isHasBottomBar == 'undefined'){
                bottomBar.show();
            }else if(isHasBottomBar == true){
                bottomBar.show();
            }


            document.dispatchEvent(evtSelectionDialogClose);
        },function callbackLoadXSL(){
            actionbar.hideActionbar();
            bottomBar.hide();
            modalDialog.showDialogFull();
        },false);
    }, 300);

}

function showDialogLists(inTitle, support, inArray1, inArray2, showValue) { //inArray1 is the most important, showValue: true - text align left, false - text align right
    hiddenKeyBoard();
    setTimeout(function () {
        var supports = support;
        var dialogHeight = 0;
        var divID = 'divListGroup';
        var divNode = document.getElementById(divID);
        if ((divNode != null) && (divNode != undefined)) {
            divNode.innerHTML = "";
        }
        else {
            logInfo('Dialog not exist divID: ' + divID);
            return;
        }
        if (inArray1.length <= 0) {
            logInfo('Dialog do not have inArray1 data');
            return;
        }

        var dialogDivAll = document.createElement('div');
        var dialogDivContainerScroll = document.createElement('div');
        dialogDivContainerScroll.setAttribute('id', 'selection-dialog-scroll');
        dialogDivContainerScroll.setAttribute('class', 'dialog-scroll-content div-selection-dialog');
        // dialogDivContainerScroll.setAttribute('style', 'width:97%;margin:10px auto;border-radius:5px;background: rgba(255, 229, 245, 0.33);');
        var dialogDivContainer = document.createElement('div');

        for (var x = 1; x < inArray1.length + 1; x++) {
            if (x < 6) {
                dialogHeight = dialogHeight + 39;
            }
            var aNode = document.createElement("a");

            /*if (x == 0) {
             aNode.setAttribute("class", "list-group-item active");
             aNode.innerHTML = inTitle;
             divNode.appendChild(aNode);
             }
             else {*/
            aNode.setAttribute("class", "list-group-item");
            if (showValue) {
                aNode.style.textAlign = "left";
            }
            else {
                aNode.style.textAlign = "center";
            }

            aNode.setAttribute("onClick", "SupportClick(" + supports+ "," + x + ");");
            aNode.innerHTML = inArray1[x - 1];

            var tmpValue = inArray2[x - 1];
            if ((tmpValue != undefined) && (tmpValue != null)) {
                var spanNode = document.createElement("span");
                spanNode.setAttribute("class", "badge");
                spanNode.innerHTML = tmpValue;
                if (!showValue) {
                    spanNode.style.display = 'none';
                }
                aNode.appendChild(spanNode);
            }
            dialogDivContainer.appendChild(aNode);
            // }

        }

        dialogDivContainerScroll.appendChild(dialogDivContainer);
        //divNode.appendChild(dialogDivContainerScroll);
        dialogDivAll.appendChild(dialogDivContainerScroll);

        divNode.appendChild(dialogDivAll);
        initDialog(inTitle,divNode.innerHTML,"FIX-DEFAULT",function callbackClose(){
            actionbar.showActionBar();
            document.dispatchEvent(evtSelectionDialogClose);
        },function callbackLoadXSL(){
            actionbar.hideActionbar();
            modalDialog.showDialogFull();
        },false);
    }, 300);

}

    function selectedItemOnDialog(inNode, index, isHasBottomBar) {
    if (navigator.userAgent.search('Firefox') ==  -1){
        event.stopPropagation();
    }

    var dialogSelection = document.getElementById("selection-dialog");
    if (inNode.nodeType == 1) {
        if (inNode.tagName == "A") {

            /*var dialogContainer = document.getElementById("selection-dialog");

             if (dialogContainer != null) {
             dialogContainer.style.opacity = 1;
             dialogContainer.style.zIndex = 2001;
             dialogContainer.style.display = "block";
             }*/

            //fire event listener

            dialogSelection.style.opacity = 0;
            var tmpDialogTimer = setTimeout(function (e) {
                dialogSelection.style.zIndex = 0;
                dialogSelection.style.display = "none";
                clearTimeout(tmpDialogTimer);
                if (inNode.childNodes[0] != undefined) {
                    evtSelectionDialog.selectedValue1 = inNode.childNodes[0].nodeValue;
                }
                if (inNode.childNodes[1] != undefined) {
                    evtSelectionDialog.selectedValue2 = inNode.childNodes[1].innerHTML;
                }
                evtSelectionDialog.selectedIndex = index;
                document.dispatchEvent(evtSelectionDialog);
            }, 500);
        }
    }
    setTimeout(function(){
        document.getElementById("myModalFullDialog-second").style.display = "none";
        var dialogFullPri = document.getElementById("myModalFullDialog");
        if(dialogFullPri){
            if(dialogFullPri.style.display == 'block'){
                return;
            }
        }
        actionbar.showActionBar();
        if(typeof isHasBottomBar == 'undefined'){
                bottomBar.show();
            }else if(isHasBottomBar == true){
                bottomBar.show();
            }
        }, 300);
}
function closeDialog(inNode) {
    var dialogSelection = document.getElementById("selection-dialog");

    if (inNode.nodeType == 1) {
        dialogSelection.style.opacity = 0;
        var tmpDialogTimer = setTimeout(function (e) {
            dialogSelection.style.zIndex = 0;
            dialogSelection.style.display = "none";
            clearTimeout(tmpDialogTimer);
            document.dispatchEvent(evtSelectionDialogClose);
        }, 500);

    }
}
/*** DIALOG END ***/

/*** DATE PICKER ***/

function initDatePicker(inLang) {
    if (SpinningWheel.openned) {
        SpinningWheel.destroy();
    }
    var now = new Date();
    var days = { };
    var years = { };
    var months = {};/*{ 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' };*/
    if (inLang == 'EN') {
        months = { 1:'Jan', 2:'Feb', 3:'Mar', 4:'Apr', 5:'May', 6:'Jun', 7:'Jul', 8:'Aug', 9:'Sep', 10:'Oct', 11:'Nov', 12:'Dec' };
        SpinningWheel.setBtnDoneTitle('Done');
        SpinningWheel.setBtnCancelTitle('Cancel');
    }
    else {
        months = { 1:'1', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6', 7:'7', 8:'8', 9:'9', 10:'10', 11:'11', 12:'12' };
        SpinningWheel.setBtnDoneTitle('Xong');
        SpinningWheel.setBtnCancelTitle('Hủy');
    }
    for (var i = 1; i < 32; i += 1) {
        days[i] = i;
    }

    var currentYear = now.getFullYear();
    if (currentYear < 2014) { //Fix if system time is reset
        currentYear = 2014;
        for (i = currentYear - 5; i < currentYear + 5; i++) {
            years[i] = i;
        }
    }
    else {
        for (i = currentYear - 5; i < currentYear + 3; i++) {
            years[i] = i;
        }
    }

    SpinningWheel.addSlot(days, 'center', now.getDate());
    SpinningWheel.addSlot(months, 'center', now.getMonth());
    SpinningWheel.addSlot(years, 'center', currentYear);
}


/*** DATE PICKER END ***/

/*** MASK VISA CARD ***/

function maskCardNumber(inString) {
    var tmpCardNo = inString.match(/[4|5][-0-9_ \.\,]+/gi);
    if ((tmpCardNo == null) || (tmpCardNo == undefined)) {
        return inString;
    }
    var matches = tmpCardNo.toString();
    var index = inString.indexOf(matches);
    var s1 = inString.substring(0, index);
    var s2 = matches.replace(/[-_ \.\,]/gi, "");
    if (s2.length == 16) {
        s2 = s2.substring(0, 6) + "xxxxxx" + s2.substring(12, 16);
    }
    else {
        return inString;
    }
    var s3 = inString.substring(index + matches.length, inString.length);
    if (s3 == "") {
        inString = s1 + s2 + s3;
    } else if (s3.length > 0) {
        inString = s1 + s2 + " " + s3;
    }
    return inString;
}

/*** MASK VISA CARD END ***/

var listCard;
var cardPicked;

/*** GEN SLIDE VIEW WITH ARRAY DATA ***/

function genSlideViewWith(inArrayData, inRow) {
    var numOfRows = inRow;  //row per page
    var numOfPages = 0;

    if (inRow == 0) {
        var currentClientHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
        var tmpSlideHeight = currentClientHeight - (80 + 40 + 15 + 40);
        var tmpRowHeightWithGap = 46 + 4;
        numOfRows = Math.floor(tmpSlideHeight / tmpRowHeightWithGap);
    }

    if (inArrayData.length % numOfRows == 0) {
        numOfPages = inArrayData.length / numOfRows;
    }
    else {
        numOfPages = Math.floor(inArrayData.length / numOfRows) + 1;
    }

    var screenWidth = window.innerWidth || document.body.clientWidth;
    var textLength = Math.round(screenWidth * 0.6);

    var tmpSlideViewListHtml = "<ul>";
    for (var idxPage = 0; idxPage < numOfPages; idxPage++) {
        tmpSlideViewListHtml = tmpSlideViewListHtml + "<li>";
        tmpSlideViewListHtml = tmpSlideViewListHtml + "<table width='100%' align='center' class='background-blacktrans'>";
        for (var idxRow = 0; idxRow < numOfRows; idxRow++) {
            var idxOfTransObj = idxPage * numOfRows + idxRow;
            if (idxOfTransObj >= inArrayData.length) {
                break;
            }
            var tmpSlideViewRowObj = new SlideViewRowObj();
            tmpSlideViewRowObj = inArrayData[idxOfTransObj];

            if (tmpSlideViewRowObj.subTitleType == 2) {
                //background-color:rgba(0,204,255,0.4);
                tmpSlideViewListHtml = tmpSlideViewListHtml + "<tr class='trow-default' onClick='showDetailSlideView(" + idxOfTransObj + ")'><td class='td-left'>" +
                    tmpSlideViewRowObj.titleSlideView +
                    "</td>" +
                    "<td rowspan='2' class='td-right-detail-plus'>" +
                    "+" + tmpSlideViewRowObj.subTitleSlideView + " " + "<span class='icon-movenext'></span>" +
                    "</td></tr>";

                tmpSlideViewListHtml = tmpSlideViewListHtml + "<tr class='trow-default' onClick='showDetailSlideView(" + idxOfTransObj + ")'><td class='td-left-detail'><div class='divsubtitle' style='width:" + textLength + "px;'>" +
                    tmpSlideViewRowObj.detailSlideView +
                    "</div></td></tr>";
            }
            else if (tmpSlideViewRowObj.subTitleType == 3) {
                //background-color:rgba(0,204,255,0.4);
                tmpSlideViewListHtml = tmpSlideViewListHtml + "<tr class='trow-default' onClick='showDetailSlideView(" + idxOfTransObj + ")'><td class='td-left'>" +
                    tmpSlideViewRowObj.titleSlideView +
                    "</td>" +
                    "<td rowspan='2' class='td-right-detail-minus'>" +
                    "-" + tmpSlideViewRowObj.subTitleSlideView + " " + "<span class='icon-movenext'></span>" +
                    "</td></tr>";

                tmpSlideViewListHtml = tmpSlideViewListHtml + "<tr class='trow-default' onClick='showDetailSlideView(" + idxOfTransObj + ")'><td class='td-left-detail'><div class='divsubtitle' style='width:" + textLength + "px;'>" +
                    tmpSlideViewRowObj.detailSlideView +
                    "</div></td></tr>";
            }
            else {
                tmpSlideViewListHtml = tmpSlideViewListHtml + "<tr class='trow-default' onClick='showDetailSlideView(" + idxOfTransObj + ")'><td class='td-left'>" +
                    tmpSlideViewRowObj.titleSlideView +
                    "</td>" +
                    "<td rowspan='2' class='td-right-detail'>" +
                    tmpSlideViewRowObj.subTitleSlideView + " " + "<span class='icon-movenext'></span>" +
                    "</td></tr>";

                tmpSlideViewListHtml = tmpSlideViewListHtml + "<tr class='trow-default' onClick='showDetailSlideView(" + idxOfTransObj + ")'><td class='td-left-detail'><div class='divsubtitle' style='width:" + textLength + "px;'>" +
                    tmpSlideViewRowObj.detailSlideView +
                    "</div></td></tr>";
            }

        }
        tmpSlideViewListHtml = tmpSlideViewListHtml + "</table>";
        tmpSlideViewListHtml = tmpSlideViewListHtml + "</li>";
    }
    tmpSlideViewListHtml = tmpSlideViewListHtml + "</ul>";

    return tmpSlideViewListHtml;
}

/*** GEN SLIDE VIEW WITH ARRAY DATA END ***/

/*** NUMBER UTILITY ***/
//remove special character

function removeSpecialChar(amount) {
    //var tmpStr = amount.replace(/[^0-9.]/g, '');
    return amount.replace(/[^0-9-.]/g, '');
    //parseFloat(amount.replace(/[^0-9-.]/g, ''));
    //return amount.replace(/[\D\.]/g, '');
}
function removeSpecialCharForNumber(sText) {
    sText = sText.replace(/[^0-9.,]/g, '');
}
function keepOnlyNumber(sText) {
    return sText.replace(/[^0-9.]/g, '');
}
//format currency

function formatNumberToCurrency(amount) {
    var tmpAmount = amount;
    if (typeof(amount) == 'string') {
        //var tmpAmountStr = amount.replace(/\,/g,'');
        var tmpAmountStr = removeSpecialChar(tmpAmount);
        tmpAmount = parseInt(tmpAmountStr);
    }
    places = 0; //phan thap phan
    symbol = "";//" VND";
    thousand = ",";
    decimal = ".";
    var number = this,
        negative = tmpAmount < 0 ? "-" : "",
        i = parseInt(tmpAmount = Math.abs(+tmpAmount || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(tmpAmount - i).toFixed(places).slice(2) : "" + symbol);
    //return (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(tmpAmount - i).toFixed(places).slice(2) : "" + symbol);
}
function formatNumberToCurrencyWithSymbol(amount, inSymbol) {
    if(inSymbol!=undefined && inSymbol.trim()=='USD' && amount!=undefined && amount.length>1 && amount.slice(0,1)=='.'){
        return amount + inSymbol;
    }
    var tmpAmount = amount;
    if (typeof(amount) == 'string') {
        //var tmpAmountStr = amount.replace(/\,\-/g,'');
        var tmpAmountStr = removeSpecialChar(tmpAmount);
        tmpAmount = parseInt(tmpAmountStr);
    }
    places = 0; //phan thap phan
    symbol = ((inSymbol == undefined) || (inSymbol == null)) ? "" : inSymbol;//" VND";
    thousand = ",";
    decimal = ".";
    var number = this,
        negative = tmpAmount < 0 ? "-" : "",
        i = parseInt(tmpAmount = Math.abs(+tmpAmount || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(tmpAmount - i).toFixed(places).slice(2) : "" + symbol);
    //return (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(tmpAmount - i).toFixed(places).slice(2) : "" + symbol);
}

function CurrencyFormatted(amount) {
    var re = new RegExp(',', 'g');
    amount = amount.replace(re, '');
    var delimiter = ","; // replace comma if desired
    amount = new String(amount);
    var a = amount.split('.', 2)
    var d = a[1];
    var i = Number((a[0]));
    if (i == 0)
        return '';

    if (isNaN(i)) {
        return '';
    }
    var minus = '';
    if (i < 0) {
        minus = '-';
    }
    i = Math.abs(i);
    var n = new String(i);
    var a = [];
    while (n.length > 3) {
        var nn = n.substr(n.length - 3);
        a.unshift(nn);
        n = n.substr(0, n.length - 3);
    }

    if (n.length > 0) {
        a.unshift(n);
    }

    n = a.join(delimiter);
    //alert(n);
    return n;
    /**
     if(d.length < 1)
     {
     amount = n;
     }
     else {
     amount = n + '.' + d;
     }
     amount = minus + amount;
     */
    return amount;
}

function formatCurrency(e, des) {
    if (e == undefined) {
        e = window.event || e;
    }
    if(e.type == 'paste'){
        e.preventDefault();
        return;
    }
    var keyUnicode = e.charCode || e.keyCode;
    if (e !== undefined) {
        switch (keyUnicode) {

            case 16:
                break; // Shift
            case 17:
                break; // Ctrl
            case 18:
                break; // Alt
            case 27:
                this.value = '';
                break; // Esc: clear entry
            case 35:
                break; // End
            case 36:
                break; // Home
            case 37:
                break; // cursor left
            case 38:
                break; // cursor up
            case 39:
                break; // cursor right
            case 40:
                break; // cursor down
            case 78:
                break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
            case 110:
                break; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
            case 190:
                break; // .
            default:
            {
                //alert('a');
                var amount = CurrencyFormatted(removeSpecialChar(des.value));
                des.value = amount;
                //alert(amount);
            }
        }
    }
}

//DOC SO THANH CHU TIENG VIET

function convertNum2WordWithLang(inVal, inLang) {
    var outStr;
    if (inLang == 'EN') {
        outStr = convertNumToWord(inVal);
    }
    else {
        outStr = DocTienBangChu(inVal);
    }
    return outStr;
}

var ChuSo = new Array(" không ", " một ", " hai ", " ba ", " bốn ", " năm ", " sáu ", " bảy ", " tám ", " chín ");
var Tien = new Array("", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ");

//1. Hàm đọc số có ba chữ số;
function DocSo3ChuSo(baso) {
    var tram;
    var chuc;
    var donvi;
    var KetQua = "";
    tram = parseInt(baso / 100);
    chuc = parseInt((baso % 100) / 10);
    donvi = baso % 10;
    if (tram == 0 && chuc == 0 && donvi == 0) return "";
    if (tram != 0) {
        KetQua += ChuSo[tram] + " trăm ";
        if ((chuc == 0) && (donvi != 0)) KetQua += " linh ";
    }
    if ((chuc != 0) && (chuc != 1)) {
        KetQua += ChuSo[chuc] + " mươi";
        if ((chuc == 0) && (donvi != 0)) KetQua = KetQua + " linh ";
    }
    if (chuc == 1) KetQua += " mười ";
    switch (donvi) {
        case 1:
            if ((chuc != 0) && (chuc != 1)) {
                KetQua += " mốt ";
            }
            else {
                KetQua += ChuSo[donvi];
            }
            break;
        case 5:
            if (chuc == 0) {
                KetQua += ChuSo[donvi];
            }
            else {
                KetQua += " lăm ";
            }
            break;
        default:
            if (donvi != 0) {
                KetQua += ChuSo[donvi];
            }
            break;
    }
    return KetQua;
}

//2. Hàm đọc số thành chữ (Sử dụng hàm đọc số có ba chữ số)

function DocTienBangChu(SoTien) {
    var lan = 0;
    var i = 0;
    var so = 0;
    var KetQua = "";
    var tmp = "";
    var soAm = false;
    var ViTri = new Array();
    if (SoTien < 0) soAm = true;//return "Số tiền âm !";
    if (SoTien == 0) return "";//"Không đồng !";
    if (SoTien > 0) {
        so = SoTien;
    }
    else {
        so = -SoTien;
    }
    if (SoTien > 8999999999999999) {
        //SoTien = 0;
        return "";//"Số quá lớn!";
    }
    ViTri[5] = Math.floor(so / 1000000000000000);
    if (isNaN(ViTri[5]))
        ViTri[5] = "0";
    so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
    ViTri[4] = Math.floor(so / 1000000000000);
    if (isNaN(ViTri[4]))
        ViTri[4] = "0";
    so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
    ViTri[3] = Math.floor(so / 1000000000);
    if (isNaN(ViTri[3]))
        ViTri[3] = "0";
    so = so - parseFloat(ViTri[3].toString()) * 1000000000;
    ViTri[2] = parseInt(so / 1000000);
    if (isNaN(ViTri[2]))
        ViTri[2] = "0";
    ViTri[1] = parseInt((so % 1000000) / 1000);
    if (isNaN(ViTri[1]))
        ViTri[1] = "0";
    ViTri[0] = parseInt(so % 1000);
    if (isNaN(ViTri[0]))
        ViTri[0] = "0";
    if (ViTri[5] > 0) {
        lan = 5;
    }
    else if (ViTri[4] > 0) {
        lan = 4;
    }
    else if (ViTri[3] > 0) {
        lan = 3;
    }
    else if (ViTri[2] > 0) {
        lan = 2;
    }
    else if (ViTri[1] > 0) {
        lan = 1;
    }
    else {
        lan = 0;
    }
    for (i = lan; i >= 0; i--) {
        tmp = DocSo3ChuSo(ViTri[i]);
        KetQua += tmp;
        if (ViTri[i] > 0) KetQua += Tien[i];
        if ((i > 0) && (tmp.length > 0)) KetQua += '';//',';//&& (!string.IsNullOrEmpty(tmp))
    }
    if (KetQua.substring(KetQua.length - 1) == ',') {
        KetQua = KetQua.substring(0, KetQua.length - 1);
    }
    KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
    if (soAm) {
        return "Âm " + KetQua + " đồng";//.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
    }
    else {
        return KetQua + " đồng";//.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
    }

}

//ENGLISH: convert integer to words
var lt20 = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen" ],
    tens = ["", "ten", "twenty", "thirty", "fourty", "fifty", "sixty", "seventy", "eightty", "ninety" ],
    scales = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion" ],
    max = scales.length * 3;

function convertNumToWord(val) {
    var len;

    // special cases
    if (val[0] === "-") {
        return "negative " + convert(val.slice(1) + " dong");
    }
    if (val === "0") {
        return "zero" + " dong";
    }

    val = trim_zeros(val);
    len = val.length;

    // general cases
    if (len < max) {
        return convert_lt_max(val) + " dong";
    }
    if (len >= max) {
        return convert_max(val) + " dong";
    }
}

function convert_max(val) {
    return split_rl(val, max)
        .map(function (val, i, arr) {
            if (i < arr.length - 1) {
                return convert_lt_max(val) + " " + scales.slice(-1);
            }
            return convert_lt_max(val);
        })
        .join(" ");
}

function convert_lt_max(val) {
    var l = val.length;
    if (l < 4) {
        return convert_lt1000(val).trim();
    } else {
        return split_rl(val, 3)
            .map(convert_lt1000)
            .reverse()
            .map(with_scale)
            .reverse()
            .join(" ")
            .trim();
    }
}

function convert_lt1000(val) {
    var rem, l;

    val = trim_zeros(val);
    l = val.length;

    if (l === 0) {
        return "";
    }
    if (l < 3) {
        return convert_lt100(val);
    }
    if (l === 3) { //less than 1000
        rem = val.slice(1);
        if (rem) {
            return lt20[val[0]] + " hundred " + convert_lt1000(rem);
        } else {
            return lt20[val[0]] + " hundred";
        }
    }
}

function convert_lt100(val) {
    if (is_lt20(val)) { // less than 20
        return lt20[val];
    } else if (val[1] === "0") {
        return tens[val[0]];
    } else {
        return tens[val[0]] + "-" + lt20[val[1]];
    }
}


function split_rl(str, n) {
    // takes a string 'str' and an integer 'n'. Splits 'str' into
    // groups of 'n' chars and returns the result as an array. Works
    // from right to left.
    if (str) {
        return Array.prototype.concat
            .apply(split_rl(str.slice(0, (-n)), n), [str.slice(-n)]);
    } else {
        return [];
    }
}

function with_scale(str, i) {
    var scale;
    if (str && i > (-1)) {
        scale = scales[i];
        if (scale !== undefined) {
            return str.trim() + " " + scale;
        } else {
            return convert(str.trim());
        }
    } else {
        return "";
    }
}

function trim_zeros(val) {
    return val.replace(/^0*/, "");
}

function is_lt20(val) {
    return parseInt(val, 10) < 20;
}
//END ENGLISH: convert integer to words

/*** NUMBER UTILITY END ***/

/** TUANNM5 UPDATE FOR JUMBO**/
function checkJumboAccExist(liItem) {
	var data = {};
	var arrayArgs = new Array();
	if (gJumboAccExistedStat != null) {
		if (gJumboAccExistedStat == false) {
			displaySubMenuForJumboAcc(false);
		} else {
			displaySubMenuForJumboAcc(true);
		}
		applyScrollForMe(liItem);

		var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
		data = getDataFromGprsCmd(gprsCmd);
		requestBacgroundMBService('CMD_CHECK_EXIST_JUMBO_ACC', arrayArgs, function(e){
			gprsResp = parserJSON(e);
			if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
				if (gprsResp.arguments[0] == 'N') {
					gJumboAccExistedStat = false;
					gliItemJumbo = liItem;
					gJumboAccInfo = gprsResp.arguments;
				} else {
					gJumboAccExistedStat = true;
				}
			}
		}, function(){
				console.log('Get data from Jumbo fail!');
		});
	} else {
				var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
				data = getDataFromGprsCmd(gprsCmd);
				requestMBService(data, true, 0, function(e){
					gprsResp = parserJSON(e);
					if (gprsResp.respCode != '0' && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
						console.log('Get data from Jumbo fail!');
						var tmpPageName = navController.getDefaultPage();
						var tmpPageType = navController.getDefaultPageType();
						navController.pushToView(tmpPageName, true, tmpPageType);
					}
					if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
						//genReviewScreen();
						if (gprsResp.arguments[0] == 'N') {
							gJumboAccExistedStat = false;
							displaySubMenuForJumboAcc(false);
							gliItemJumbo = liItem;
							gJumboAccInfo = gprsResp.arguments;
						} else {
							gJumboAccExistedStat = true;
							displaySubMenuForJumboAcc(true);
						}
						applyScrollForMe(liItem);

					}
				}, function(){
						console.log('Get data from Jumbo fail!');
				});
	}
}

function checkJumboAccExist_New(liItem) {
	var data = {};
	var arrayArgs = new Array();
	if (gJumboAccExistedStat != null) {
		if (gJumboAccExistedStat == false) {
			displaySubMenuForJumboAcc(false);
		} else {
			displaySubMenuForJumboAcc(true);
		}
		//applyScrollForMe(liItem);
		navController.pushToView('jumbo/jumbo_check_auto_saving', true, 'xsl')

		var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
		data = getDataFromGprsCmd(gprsCmd);
		requestBacgroundMBService('CMD_CHECK_EXIST_JUMBO_ACC', arrayArgs, function(e){
			gprsResp = parserJSON(e);
			if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
				if (gprsResp.arguments[0] == 'N') {
					gJumboAccExistedStat = false;
					gliItemJumbo = liItem;
					gJumboAccInfo = gprsResp.arguments;
				} else {
					gJumboAccExistedStat = true;
				}
			}
		}, function(){
				console.log('Get data from Jumbo fail!');
		});
	} else {
				var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
				data = getDataFromGprsCmd(gprsCmd);
				requestMBService(data, true, 0, function(e){
					gprsResp = parserJSON(e);
					if (gprsResp.respCode != '0' && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
						console.log('Get data from Jumbo fail!');
						var tmpPageName = navController.getDefaultPage();
						var tmpPageType = navController.getDefaultPageType();
						navController.pushToView(tmpPageName, true, tmpPageType);
					}
					if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
						//genReviewScreen();
						if (gprsResp.arguments[0] == 'N') {
							gJumboAccExistedStat = false;
							displaySubMenuForJumboAcc(false);
							gliItemJumbo = liItem;
							gJumboAccInfo = gprsResp.arguments;
						} else {
							gJumboAccExistedStat = true;
							displaySubMenuForJumboAcc(true);
						}
						//applyScrollForMe(liItem);
						navController.pushToView('jumbo/jumbo_check_auto_saving', true, 'xsl')

					}
				}, function(){
						console.log('Get data from Jumbo fail!');
				});
	}
}

function displaySubMenuForJumboAcc(isExisted) {
    var wrapper = document.getElementById('wrapper_jumboAcc');
    if(wrapper != null){
        wrapper.innerHTML = gJumboMenuElements;
    }

	changeLanguageInNodeWithClass('langNoStyle');

    if(wrapper == null){
        return;
    }
	var parentDiv = document.getElementById('wrapper_jumboAcc').getElementsByTagName('div')[0];
	if (isExisted == false) {
		//gMenuRawData
		var subMenuAccInfo = document.getElementById('liJumboAccInfo');
		var subMenuRemoveEasy = document.getElementById('liJumboAccUnreg');
		//ngocdt3 bo sug theo ver7
		var subMenuLoan= document.getElementById('liJumboSavingApplyLimit');
		var subMenuAutoSaving = document.getElementById('liJumboCreateAutoSaving');
		var subMenuCardAdvance = document.getElementById('liJumboCreditApplyLimit');
		//ngocdt3 end
        if(subMenuAccInfo != null){
            parentDiv.removeChild(subMenuAccInfo);
        }
        if(subMenuRemoveEasy != null){
            parentDiv.removeChild(subMenuRemoveEasy);
        }
		if(subMenuLoan != null){
            parentDiv.removeChild(subMenuLoan);
        }
		if(subMenuAutoSaving != null){
            parentDiv.removeChild(subMenuAutoSaving);
        }
		if(subMenuCardAdvance != null){
            parentDiv.removeChild(subMenuCardAdvance);
        }
		displaySubMenuForJumboAccV7(false);
	} else {
		var subMenuCreateAcc = document.getElementById('liJumboCreateAcc');
        if(subMenuCreateAcc != null){
            parentDiv.removeChild(subMenuCreateAcc);
        }
		displaySubMenuForJumboAccV7(true);
	}

}
//ngocdt3 bo sung cho v7
function checkJumboAccExistV7(liItem) {
	var data = {};
	var arrayArgs = new Array();
	if (gJumboAccExistedStat != null) {
		if (gJumboAccExistedStat == false) {
			displaySubMenuForJumboAccV7(false);
		} else {
			displaySubMenuForJumboAccV7(true);
		}
        interlockStatus = false;
		applyScrollForMe(liItem);

		var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
		data = getDataFromGprsCmd(gprsCmd);
		requestBacgroundMBService('CMD_CHECK_EXIST_JUMBO_ACC', arrayArgs, function(e){
			gprsResp = parserJSON(e);
			if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
				if (gprsResp.arguments[0] == 'N') {
					gJumboAccExistedStat = false;
					gliItemJumboNew = liItem;
					gJumboAccInfo = gprsResp.arguments;
				} else {
					gJumboAccExistedStat = true;
				}
			}
		}, function(){
				console.log('Get data from Jumbo fail!');
		});
	} else {
				var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
				data = getDataFromGprsCmd(gprsCmd);
				requestMBService(data, true, 0, function(e){
					gprsResp = parserJSON(e);
					if (gprsResp.respCode != '0' && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
						console.log('Get data from Jumbo fail!');
						var tmpPageName = navController.getDefaultPage();
						var tmpPageType = navController.getDefaultPageType();
						navController.pushToView(tmpPageName, true, tmpPageType);
					}
					if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
						//genReviewScreen();
						if (gprsResp.arguments[0] == 'N') {
							gJumboAccExistedStat = false;
							displaySubMenuForJumboAccV7(false);
							gliItemJumboNew = liItem;
							gJumboAccInfo = gprsResp.arguments;
						} else {
							gJumboAccExistedStat = true;
							displaySubMenuForJumboAccV7(true);
						}
                        interlockStatus = false;
						applyScrollForMe(liItem);

					}
				}, function(){
						console.log('Get data from Jumbo fail!');
				});
	}
}
function displaySubMenuForJumboAccV7(isExisted) {
	document.getElementById('wrapper_mAccInfo').innerHTML = gAccInfoMenuElements;
	changeLanguageInNodeWithClass('langNoStyle');
	var parentAccDiv = document.getElementById('wrapper_mAccInfo').getElementsByTagName('div')[0];
	if (isExisted == false) {
		var subJumboAccInfoNew = document.getElementById('liJumboAccInfoNew');//ngocdt3 bo sung
        if(subJumboAccInfoNew != null){
            parentAccDiv.removeChild(subJumboAccInfoNew);
        }
	} else {
		var subMenuCreateAccNew = document.getElementById('liJumboCreateAccNew');//ngocdt3 bo sung
        if(subMenuCreateAccNew != null){
            parentAccDiv.removeChild(subMenuCreateAccNew);
        }
		var subJumboAccInfoNew = document.getElementById('liJumboAccInfoNew');//ngocdt3 bo sung
        if(subJumboAccInfoNew != null){
            parentAccDiv.removeChild(subJumboAccInfoNew);
        }
	}
	navController.pushToView('accountxsl/account-scr', true,'xsl');
}
function checkJumboAccExistSetting(liItem) {
	var data = {};
	var arrayArgs = new Array();
	if (gJumboAccExistedStat != null) {
		applyScrollForMe(liItem);

		var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
		data = getDataFromGprsCmd(gprsCmd);
		requestBacgroundMBService('CMD_CHECK_EXIST_JUMBO_ACC', arrayArgs, function(e){
			gprsResp = parserJSON(e);
			if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
				if (gprsResp.arguments[0] == 'N') {
					gJumboAccExistedStat = false;
				} else {
					gJumboAccExistedStat = true;
				}
			}
		}, function(){
				console.log('Get data from Jumbo fail!');
		});
	} else {
				var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
				data = getDataFromGprsCmd(gprsCmd);
				requestMBService(data, true, 0, function(e){
					gprsResp = parserJSON(e);
					if (gprsResp.respCode != '0' && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
						console.log('Get data from Jumbo fail!');
						var tmpPageName = navController.getDefaultPage();
						var tmpPageType = navController.getDefaultPageType();
						navController.pushToView(tmpPageName, true, tmpPageType);
					}
					if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
						//genReviewScreen();
						if (gprsResp.arguments[0] == 'N') {
							gJumboAccExistedStat = false;
						} else {
							gJumboAccExistedStat = true;
						}
						applyScrollForMe(liItem);

					}
				}, function(){
						console.log('Get data from Jumbo fail!');
				});
	}
}
/**TUANNM5 END UPDATE**/
/*** LOGOUT ***/
//timer to logout
//var CONST_TIMER_TO_LOGOUT = 120; //cu 2 phut
var CONST_TIMER_TO_LOGOUT = 300;//timeout 15'
var gLastUsingTime;

function logout() {
    if (!interlockStatus) {
        //save logut status
        showLoadingMask();
        var arrayArgs = new Array();
        arrayArgs.push("LOGOUT");
        requestBacgroundMBService("CMD_TYPE_LOGOUT", arrayArgs, function (e) {
            window.onbeforeunload = '';
            var url = location.protocol + '//' + location.host + location.pathname;
            if (getURLParam('ver')) {
                url += '?ver=' + getURLParam('ver');
            }
            window.top.location.href = url;
        }, function () {
            window.onbeforeunload = '';
            var url = location.protocol + '//' + location.host + location.pathname;
            if (getURLParam('ver')) {
                url += '?ver=' + getURLParam('ver');
            }
            window.top.location.href = url;
        });
        setTimeout(function () {
            window.onbeforeunload = '';
            var url = location.protocol + '//' + location.host + location.pathname;
            if (getURLParam('ver')) {
                url += '?ver=' + getURLParam('ver');
            }
            window.top.location.href = url;
        }, 5000);
        if( localStorage.localUUID == undefined){
            localStorage.localUUID = guid();
        }
    }
    setInterlockEnable();
}

function logoutExit() {
    document.getElementById("header_div_logout").parentNode.onclick="";
    if (!interlockStatus) {
        //save logut status
        showLoadingMask();
        var arrayArgs = new Array();
        arrayArgs.push("LOGOUT");
        requestBacgroundMBService("CMD_TYPE_LOGOUT", arrayArgs, function (e) {
            window.onbeforeunload = '';
            var url = location.protocol + '//' + location.host + location.pathname;
            if (getURLParam('ver')) {
                url += '?ver=' + getURLParam('ver');
            }
            window.top.location.href = url;
        }, function () {
            window.onbeforeunload = '';
            var url = location.protocol + '//' + location.host + location.pathname;
            if (getURLParam('ver')) {
                url += '?ver=' + getURLParam('ver');
            }
            window.top.location.href = url;
        });
        setTimeout(function () {
            window.onbeforeunload = '';
            var url = location.protocol + '//' + location.host + location.pathname;
            if (getURLParam('ver')) {
                url += '?ver=' + getURLParam('ver');
            }
            window.top.location.href = url;
        }, 5000);
        if( localStorage.localUUID == undefined){
            localStorage.localUUID = guid();
        }

    }
    setInterlockEnable();

    THEBTouchID.quitApplication('abc', function () {

    }, function () {

    });
}

function setTimerCheckLogout() {
    if (document.addEventListener) {
        var events = ['click', 'mousemove', 'keydown', 'touchstart','touchmove','touchend'],
            evtLength = events.length,
            timer = 2,
            delay = CONST_TIMER_TO_LOGOUT * 1000,
            resetTimeToLogout = function () {
                clearTimeout(timer);
                gLastUsingTime = getCurrentTime();
                if (gIsLogin) {
                    timer = setTimeout(logout, delay);
                }
            };
        while (evtLength--) {
            document.addEventListener(events[evtLength], resetTimeToLogout, false);
        }
        resetTimeToLogout();
    }
    else {
        window.attachEvent("onload", function () {
            var wait = setTimeout(logout, CONST_TIMER_TO_LOGOUT * 1000);

            function resetTimeoutLogout() {
                clearTimeout(wait);

                gLastUsingTime = getCurrentTime();
                if (gIsLogin) {
                    wait = setTimeout(logout, CONST_TIMER_TO_LOGOUT * 1000);
                }
            }

            window.document.attachEvent("onmousemove", resetTimeoutLogout);
            window.document.attachEvent("onclick", resetTimeoutLogout);
            window.document.attachEvent("onkeydown", resetTimeoutLogout);
        });
    }
}

/*** LOGOUT END ***/

/*** DETECT VISIBLE ***/

/*var stateVisiblePage = (function(){
 var stateKey, eventKey, keys = {
 hidden: "visibilitychange",
 webkitHidden: "webkitvisibilitychange",
 mozHidden: "mozvisibilitychange",
 msHidden: "msvisibilitychange"
 };
 for (stateKey in keys) {
 if (stateKey in document) {
 eventKey = keys[stateKey];
 break;
 }
 }
 return function(c) {
 if (c) document.addEventListener(eventKey, c);
 return !document[stateKey];
 }
 })();

 var gTimerVisiblePage;

 stateVisiblePage(function(){
 var tmpStatus = stateVisiblePage();
 if(!tmpStatus) {
 gTimerVisiblePage = setTimeout(function() {
 if(gIsLogin) {
 window.onbeforeunload = '';
 window.location.href = '';
 }
 }, 120*1000);
 }
 else {
 clearTimeout(gTimerVisiblePage);
 }
 });*/


/*** DETECT VISIBLE END ***/

/*** APP PHONEGAP ***/

var app = {
    // Application Constructor
    initialize:function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents:function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady:function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent:function (id) {
        /*var parentElement = document.getElementById(id);
         var listeningElement = parentElement.querySelector('.listening');
         var receivedElement = parentElement.querySelector('.received');

         listeningElement.setAttribute('style', 'display:none;');
         receivedElement.setAttribute('style', 'display:block;');*/

        var server = "https://ebank.tpb.vn/";
        var fingerprint = "8B 63 26 BD 8A 94 29 0F D9 ED 88 BE A0 E9 FB 51 F7 27 D8 E6"; // valid until sep 2014

        window.plugins.sslCertificateChecker.check(successCallback, errorCallback, server, fingerprint);

        function successCallback(message) {
            //alert(message);
            // Message is always: CONNECTION_SECURE.
            // Now do something with the trusted server.
        }

        function errorCallback(message) {
            //alert(message);
            if (message == "CONNECTION_NOT_SECURE") {
                // There is likely a man in the middle attack going on, be careful!
            } else if (message == "CONNECTION_FAILED") {
                // There was no connection (yet). Internet may be down. Try again (a few times) after a little timeout.
            }
        }

        logInfo('Received Event: ' + id);
    }
};

/*** APP PHONEGAP END ***/

/*** LOAD CORDOVA JS FILE ***/
var loadedPGlib = false;
function loadPhoneGapJS() {
    var phonegapJS = document.createElement('script');
    phonegapJS.setAttribute("id", "phonegapJS");
    phonegapJS.type = 'text/javascript';
    //alert('Load PG js');
    if (Environment.isIOS() && !Environment.isWindows()) {
        phonegapJS.src = CONST_WEB_URL_LINK + 'assets/libs/cordova/' + 'cordova_iOS.js';
        loadedPGlib = true;
    }
    else if (Environment.isAndroid()) {
        phonegapJS.src = CONST_WEB_URL_LINK + 'assets/libs/cordova/' + 'cordova_Android.js';
        loadedPGlib = true;
    }
    else if (Environment.isWindows()) {
        phonegapJS.src = CONST_WEB_URL_LINK + 'assets/libs/cordova/' + 'cordova_WP.js';
        loadedPGlib = true;
    }
    head = document.getElementsByTagName('body')[0];

    head.appendChild(phonegapJS);
}

/*** LOAD CORDOVA JS FILE ***/

/*** HANDLE SWEPT LEFT-RIGHT ***/

var pointStartX = 0,
    pointStartY = 0,
    pointEndX = 0,
    pointEndY = 0;

var hasTouch = 'ontouchstart' in window,
    isMSIE = window.navigator.msPointerEnabled,
    START_EV = hasTouch ? 'touchstart' : 'mousedown',
    MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
    END_EV = hasTouch ? 'touchend' : 'mouseup',
    CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';

/*START_EV = isMSIE ? 'MSPointerDown' : START_EV,
 MOVE_EV = isMSIE ? 'MSPointerMove' : MOVE_EV,
 END_EV = isMSIE ? 'MSPointerUp' : END_EV,
 CANCEL_EV = isMSIE ? 'MSPointerUp' : 'mouseup';*/

function HandleTouchEvent() {
    document.addEventListener(START_EV, handleTouchStart, false);
}

function isIOS_Safari() {
    if ((browserName.toString() == 'Safari') || (browserName.toString() == 'iPad') || (browserName.toString() == 'iPhone')) {
        return true;
    }
    else {
        return false;
    }
}

function hiddenKeyBoard() {
    //if(!Environment.isMobile) return;
    //if(Environment.isAndroid()) return;
    if ((Environment.isIOS() && !Environment.isWindows()) || Environment.isAndroid()) //except windows phone
    {
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
}

var lockTouchSlide = false;
var touchArrayNodeIDLockSlide = ['loadingMask' , 'alert-confirm-dialog', 'alert-info-dialog', 'selection-dialog'];
function checkTouchLocked() {
    for (var i = 0; i < touchArrayNodeIDLockSlide.length; i++) {
        var tmpNode = document.getElementById(touchArrayNodeIDLockSlide[i]);
        if ((tmpNode != undefined) && (tmpNode.style.display != 'none')) {
            return true;
        }
    }
    return false;
}

function checkToLogoutSystem() {
    if ((getCurrentTime() - gLastUsingTime > CONST_TIMER_TO_LOGOUT * 1000) && gIsLogin) {
        //if((getCurrentTime() - gLastUsingTime > 10 * 1000) && gIsLogin) {
        logInfo('logout');
        logout();
    }

}

function handleTouchStart(evt) {
    //evt.preventDefault();
    checkToLogoutSystem();

    if (evt.target.nodeType != 1) return;

    if (evt.target.className.indexOf('break-slide') != -1) return;
    if (evt.target.localName.indexOf('canvas') != -1) return;
    //var tmpMenu = document.getElementById('menu-section');
    //if(tmpMenu.style.display != 'none'  || !gIsLogin) return;
    if (gModeScreenView != CONST_MODE_SCR_SMALL) return; // || !gIsLogin

    if ((currentPage == "bankinfo/bank-info-tpb-atm-map")) return;

    lockTouchSlide = checkTouchLocked();
    if ((browserName.toString() == 'Safari') || (browserName.toString() == 'iPad') || (browserName.toString() == 'iPhone')) {
        //lockTouchSlide = true;
    }
    if (!lockTouchSlide) {

        /*if (Environment.isAndroid() || Environment.isBlackBerry() || Environment.isIOS()) {
         hiddenKeyBoard();
         }*/

        if (hasTouch) {
            pointStartX = evt.touches[0].pageX;
            pointStartY = evt.touches[0].pageY;
        }
        else {
            pointStartX = evt.pageX;
            pointStartY = evt.pageY;
        }
        pointEndX = pointStartX;
        pointEndY = pointStartY;
        //logInfo('Start touch: X= ' + pointStartX + ' Y= ' + pointStartY);

        document.addEventListener(MOVE_EV, handleTouchMove, false);
        document.addEventListener(END_EV, handleTouchEnd, false);
        document.addEventListener(CANCEL_EV, handleTouchEnd, false);
    }
}

function handleTouchMove(evt) {
//	evt.preventDefault();
    if (gModeScreenView != CONST_MODE_SCR_SMALL) return;

    if (hasTouch) {
        pointEndX = evt.touches[0].pageX;
        pointEndY = evt.touches[0].pageY;
    }
    else {
        pointEndX = evt.pageX;
        pointEndY = evt.pageY;
    }
    var scrollPos = document.getElementById('mainViewContent').scrollTop;
//    if (scrollPos == 0 && pointEndY > pointStartY) {
//        logInfo(scrollPos + '   ' + pointEndY + '   ' + pointStartY);
//        evt.preventDefault();
//    }
    //logInfo('Move touch: X= ' + pointEndX + ' Y= ' + pointEndY);
}

function handleTouchEnd(evt) {
    //evt.preventDefault();
    if (gModeScreenView != CONST_MODE_SCR_SMALL) return;

    var distX = 0,
        distY = 0;
    distX = Math.abs(pointEndX - pointStartX);
    distY = Math.abs(pointEndY - pointStartY);
    //logInfo('End touch: X= ' + pointEndX + ' Y= ' + pointEndY + ' distX= ' + distX + ' distY= ' + distY);
    /*if ((distX > 10) || (distY > 0)) {
     //hiddenKeyBoard();
     //if (Environment.isAndroid() || Environment.isBlackBerry() || Environment.isIOS()) {
     if((Environment.isIOS() && !Environment.isWindows()) || Environment.isBlackBerry()) {// || Environment.isAndroid())
     hiddenKeyBoard();
     }
     }*/
    if ((distX > 80) && (distX > distY + 5) && (pointStartX < pointEndX)) {
        var stNode = checkIsChildOfClass(evt.target, 'main-layout');
        var accNode = checkIsChildOfClass(evt.target, 'account-select');
        var slideViewNode = checkIsChildOfClass(evt.target, 'slide-view-select');
        if (content != undefined && gIsLogin) {
            if (!content.isOpen && !contentPromotion.isOpen && stNode && !accNode && !slideViewNode) {
                openMenuContent();
            }

        }
    }
    else if ((distX > 80) && (distX > distY + 5) && (pointStartX > pointEndX)) {
        var stNode = checkIsChildOfClass(evt.target, 'main-layout');
        var accNode = checkIsChildOfClass(evt.target, 'account-select');
        var slideViewNode = checkIsChildOfClass(evt.target, 'slide-view-select');
        if ((content != undefined) && (content.isOpen) && stNode && !accNode && !slideViewNode) {
            closeMenuContent();
        }

    }
    else if ((distX < 5) && (distY < 5)) {
        var stNode = checkIsChildOfClass(evt.target, 'main-layout');
        if ((content != undefined) && content.isOpen && stNode) {
            closeMenuContent();
        }
    }
    else {
        var stNode = checkIsChildOfClass(evt.target, 'main-layout');
        if ((content != undefined) && content.isOpen && stNode) {
            closeMenuContent();
        }
    }
    document.removeEventListener(MOVE_EV, handleTouchMove, false);
    document.removeEventListener(END_EV, handleTouchEnd, false);
    document.removeEventListener(CANCEL_EV, handleTouchEnd, false);
}

function displayMenuSection(isDisplayOn) {
    if (isDisplayOn) {
        var transitionProperty = prefix.js + 'TransitionProperty';
        menuSection.style[transitionProperty] = prefix.css + 'transform';
        var transitionDuration = prefix.js + 'TransitionDuration';

        if (prefix.lowercase == 'ms') {
            menuSection.style[transitionDuration] = '350ms';
        }
        else {
            menuSection.style[transitionDuration] = '500ms';
        }

        menuSection.style.display = 'block';
        menuSection.style.opacity = 1;

        var transformJS = prefix.js + 'Transform';
        //var transitionTiming = prefix.js + 'TransitionTimingFunction';
        //this.container.style[transitionTiming] = 'ease linear ease';
        //this.container.style.webkitTransform = 'translate3d(' + pos + 'px,0,0)';

        //this.container.style[transformJS] = 'translate3d(' + pos + 'px,0,0)';
        menuSection.style[transformJS] = 'translate(' + 260 + 'px,0)' + translateZ;


        showMaskSlideMenu(true);
    } else {

        var transitionProperty = prefix.js + 'TransitionProperty';
        menuSection.style[transitionProperty] = prefix.css + 'transform';
        var transitionDuration = prefix.js + 'TransitionDuration';

        if (prefix.lowercase == 'ms') {
            menuSection.style[transitionDuration] = '350ms';
        }
        else {
            menuSection.style[transitionDuration] = '500ms';
        }

        menuSection.style.display = 'block';
        menuSection.style.opacity = 1;

        var transformJS = prefix.js + 'Transform';
        //var transitionTiming = prefix.js + 'TransitionTimingFunction';
        //this.container.style[transitionTiming] = 'ease linear ease';
        //this.container.style.webkitTransform = 'translate3d(' + pos + 'px,0,0)';

        //this.container.style[transformJS] = 'translate3d(' + pos + 'px,0,0)';
        menuSection.style[transformJS] = 'translate(' + -260 + 'px,0)' + translateZ;

        showMaskSlideMenu(false);

        //menuSection.style.opacity = 0;
        //setTimeout(function () {
        //    menuSection.style.display = 'none';
        //    showMaskSlideMenu(false);
        // }, 300);
    }
}

function checkIsChildOfClass(inNode, pClassName) {
    var pNode = inNode.parentNode;
    var found = false;
    var pTag = pNode.nodeName;
    while (pTag != 'BODY') {
        if (pNode.className == pClassName) {
            found = true;
            break;
        }
        pNode = pNode.parentNode;
        if ((pNode == undefined) || (pNode == null)) {
            break;
        }
        pTag = pNode.tagName;
    }
    return found;
}

/*** HANDLE SWEPT LEFT-RIGHT END ***/

/*** INTERLOCK ***/

var interlockStatus = false;

function setInterlockEnable() {
    interlockStatus = true;
    setTimeout(function (evt) {
        interlockStatus = false;
    }, 1000);
}

/*** INTERLOCK END***/

/*** PROGRESS-BAR ***/

function startProgressBar(nodeID, timeout) {
    var progressNode = document.getElementById(nodeID);
    progressNode.innerHTML = "<progress value='0' max='100' min='0'></progress>";
    var isWebKit = (/webkit/gi).test(navigator.appVersion);
    if (isWebKit) {
        progressNode.childNodes[0].style.setProperty('-webkit-animation', 'loadbar ' + timeout + 's');
    }
    else {
        progressNode.childNodes[0].style.setProperty('animation', 'loadbar ' + timeout + 's');
    }
}

function stopProgressBar(nodeID) {
    var progressNode = document.getElementById(nodeID);
	if(progressNode != null && progressNode != undefined){
		 progressNode.innerHTML = "";
	}


}

/*** PROGRESS-BAR END ***/

/*** CHANGE LANGUAGE ***/

function changeLanguageInView() {

    //hide module eGold - do not have English language
    if (gUserInfo.lang == 'EN') {
        if (document.getElementById('goldTrade')) document.getElementById('goldTrade').style.display = 'none';
    }
    else {
        if (document.getElementById('goldTrade')) document.getElementById('goldTrade').style.display = '';
    }
    changeLanguageInMainContentInAtt('placeholder', 'mainViewContent');
    changeLanguageInMainContentInAtt('value', 'mainViewContent');
    changeLanguageInMainContentInAtt('placeholder', 'mainViewVerticalSlide');
    changeLanguageInMainContentInAtt('value', 'mainViewVerticalSlide');
    changeLanguageInMainContentInAtt('value', 'accountSelectContents');
    changeLanguageInMainContentInAtt('value', 'divbottomcenter');
    changeLanguageInMainContentInAtt('value', 'alert-confirm-dialog');
    changeLanguageInMainContentInAtt('value', 'alert-info-dialog');
    changeLanguageInMainContentInAtt('value', 'esaving.accountselection');

    changeLanguageInMainContentInAtt('value', 'alert-KHCN-KHDN-TERMS-dialog');
    changeLanguageInMainContentInAtt('value', 'alert-KHCN-KHDN-INSTRUCTION-dialog');
    changeLanguageInMainContentInAtt('value', 'alert-KHCN-KHDN-FAQ-dialog');
    changeLanguageInMainContentInAtt('value', 'alert-confirm-dialog-schedulebank');
    changeLanguageInMainContentInAtt('value', 'myModalFullDialog');
    changeLanguageInMainContentInAtt('value', 'myModalFullDialog-second');

    changeLanguageInNodeWithTag('span');
	/*HaiNM*/
	gTrans.reName="";
	if (gUserInfo.accountName.length > 26){
		gTrans.reName="" +gUserInfo.accountName.substring(0, 21)+"...";
	}else{
		gTrans.reName=gUserInfo.accountName;
	}
	/*End*/

    if (gIsLogin) {
		document.getElementById('menu-profile-name').innerHTML = gTrans.reName +"<br/><span class='cifval style-infor-user' style='font-size: 11px;font-weight: bold;color: #7b1fa2'>"+gCompanyName+"</span>"+"<br/><span class='cifval' style='font-size: 10px;font-weight: bold;'>"+CONST_STR.get("HOME_PAGE_LAST_LOGIN")+"<br/>"+gLastLogin+"</span>";
        // document.getElementById('menu-profile-name').innerHTML = gUserInfo.accountName +"<br/><span class='cifval style-infor-user' style='font-size: 11px;font-weight: bold;color: #7b1fa2'>"+gCompanyName+"</span>"+"<br/><span class='cifval' style='font-size: 10px;font-weight: bold;'>"+CONST_STR.get("HOME_PAGE_LAST_LOGIN")+"<br/>"+gLastLogin+"</span>";
        // document.getElementById('menu-profile-name').innerHTML = gUserInfo.accountName +"<br/><span class='cifval'>User : "+gCustomerNo+"</span>"+"<br/><span class='cifval' style='font-size: 10px;font-weight: bold;'>"+gCompanyName+"</span>";
    }
}

function changeLanguageInMainContentInAtt(attribute, inNodeID) {
    var nodeMainContent = document.getElementById(inNodeID);
    if ((nodeMainContent == undefined) || (nodeMainContent == null)) {
        return;
    }
    var allElements = nodeMainContent.getElementsByTagName('*');
    for (var i = 0; i < allElements.length; i++) {
        if (allElements[i].getAttribute(attribute)) {
            var tmpNode = allElements[i];
            for (var j = 0, attrs = tmpNode.attributes, l = attrs.length; j < l; j++) {
                attr = attrs.item(j);
                var tmpStr = attr.nodeValue || attr.value;
                if ((CONST_STR.get(tmpStr) != null) && (CONST_STR.get(tmpStr) != undefined)) {
                    if (attr.nodeValue) {
                        attr.nodeValue = CONST_STR.get(tmpStr);
                    }
                    else {
                        attr.value = CONST_STR.get(tmpStr);
                    }
                }
            }
        }
    }
}

function    changeLanguageInNodeWithTag(tagName) {
    var tagNodeArr = document.getElementsByTagName(tagName);
    for (var i = 0; i < tagNodeArr.length; i++) {
        var tmpNode = tagNodeArr[i];
        /*var tmpValue = tmpNode.innerHTML;*/
        var tmpValue = tmpNode.innerHTML;
        if ((CONST_STR.get(tmpValue) != null) && (CONST_STR.get(tmpValue) != undefined)) {
            /*tmpNode.innerHTML = CONST_STR.get(tmpValue);*/
            tmpNode.innerHTML = CONST_STR.get(tmpValue);
        }
    }
}

function changeLanguageInNodeWithClass(className) {
    var tagNodeArr = document.getElementsByClassName(className);
    for (var i = 0; i < tagNodeArr.length; i++) {
        var tmpNode = tagNodeArr[i];
        var tmpValue = tmpNode.innerHTML;
        //var tmpValue = tmpNode.innerHTML;
        if ((CONST_STR.get(tmpValue) != null) && (CONST_STR.get(tmpValue) != undefined)) {
            tmpNode.innerHTML = CONST_STR.get(tmpValue);
            //tmpNode.innerHTML = CONST_STR.get(tmpValue);
        }
    }
}
function gotoEditCustomerInfo(){
    navController.pushToView('setup/create/system/changeUserInfo/set_user_info', true, 'html');
}
function gotoChangeAvatar(){
    navController.pushToView('utilitiesxsl/personal-info-view-scr', true, 'xsl');
}
//anhntt lay thong tn nguoi dung
function GetUserInfo() {
    var objectValueClient = new Object();
    objectValueClient.idtxn = "S11";
    objectValueClient.sequenceId = "1";

    var arrayClientInfo = new Array();
    arrayClientInfo.push("1");
    arrayClientInfo.push(objectValueClient);

    var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_SETUP_CHANGE_PERSON_INFO'), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

    data = getDataFromGprsCmd(gprsCmd);

    requestMBServiceCorp(data, false, 0, requestServiceSuccessUserinfor, requestServiceFaill);
}

function requestServiceSuccessUserinfor(e) {
    gprsResp = JSON.parse(e);
    var obj = gprsResp.respJsonObj;
    tmpData = obj;
    if (gprsResp.respCode == '0') {
        obj = obj[0];
        userInfo.IDUSER = obj.IDUSER;
        userInfo.FULLNAME = obj.FULLNAME;
        userInfo.SHORTNAME = obj.SHORTNAME;
        userInfo.IDENTITYCARDNUMBER = obj.IDENTITYCARDNUMBER;
        userInfo.ALLOCATEDATE = obj.ALLOCATEDATE;
        userInfo.oldPosition = obj.POSITION;
        userInfo.address = obj.ADDRESS;
        userInfo.oldEmail = obj.EMAIL;
        userInfo.oldPhoneNumber = obj.PHONENUMBER;

        document.getElementById('cus-profile-fullname').innerHTML = userInfo.FULLNAME;
        document.getElementById('cus-profile-birthday').innerHTML = userInfo.ALLOCATEDATE;
        document.getElementById('cus-profile-userid').innerHTML = userInfo.IDUSER;
        document.getElementById('cus-profile-address').innerHTML +=userInfo.address;
        document.getElementById('cus-profile-mobile').innerHTML = userInfo.oldPhoneNumber;
        document.getElementById('cus-profile-email').innerHTML = userInfo.oldEmail;
        document.getElementById('cus-profile-cif').innerHTML = gCustomerNo;
        fInfo = 0;
    }
}

function requestServiceFaill(e){

}
var fInfo = 1 // bien luu truu lay thong tin khach hang
function changeMenuLanguage() {
    var tmpNodeMenu = document.getElementById('menu-section');
    tmpNodeMenu.innerHTML = gMenuRawData;
    changeLanguageInNodeWithClass('langNoStyle');
    if (document.getElementById('menu-profile-name') && gUserInfo.accountName) {
        /*Tucvv lấy thêm CIF*/
        document.getElementById('menu-profile-name').innerHTML = gUserInfo.accountName +"<br/><marquee class='cifval style-infor-user' style='font-size: 11px;font-weight: bold;color: #7b1fa2'>"+gCompanyName+"</marquee>"+"<br/><span class='cifval' style='font-size: 10px;font-weight: bold;'>"+CONST_STR.get("HOME_PAGE_LAST_LOGIN")+"<br/>"+gLastLogin+"</span>";
    }
    if (document.getElementById('menu-profile-avatar') && gUserInfo.userAvatar && gUserInfo.userAvatar.length > 1) {
        //document.getElementById('menu-profile-avatar').innerHTML = '<img width="25" height="25" style="margin-top:-1px;" src="' + gUserInfo.userAvatar + '" />';
        document.getElementById('menu-profile-avatar').innerHTML = '<img onerror="this.src=\'./assets/images/acc-info-img.png\'" class="avatar-size" style="margin-top:-1px" src="' + gUserInfo.userAvatar + '" />';
        document.getElementById('menu-profile-avatar').style.backgroundColor = "transparent";
    }
    document.getElementById('menu-profile-avatar').removeAttribute("onClick");
    document.getElementById('menu-profile-name').removeAttribute("onClick");
    var html="";
    html+=" <div class='table-customer-info'><ul>";
    html+="<li><span class='list-style'></span><span class='label-left-menu'>"+CONST_STR.get('CUS_PROFILE_FULLNAME')+"</span><span class='infor-left-value' id='cus-profile-fullname'></span></li>";
    html+="<li><span class='list-style'></span><span class='label-left-menu'>"+CONST_STR.get('CUS_PROFILE_BIRTHDAY')+"</span><span class='infor-left-value' id='cus-profile-birthday'></span></li>";
    html+="<li><span class='list-style'></span><span class='label-left-menu'>"+CONST_STR.get('CUS_PROFILE_USERID')+"</span><span class='infor-left-value' id='cus-profile-userid'></span></li>";
    html+="<li id='cus-profile-address' style='word-break: break-word;'><span class='list-style'></span><span class='label-left-menu' style='padding-right: 20px;'>"+CONST_STR.get('CUS_PROFILE_ADDRESS')+"</span><span class='infor-left-value' id='cus-profile-address'></span></li>";
    html+="<li><span class='list-style'></span><span class='label-left-menu'>"+CONST_STR.get('CUS_PROFILE_MOBILE')+"</span><span class='infor-left-value' id='cus-profile-mobile'></span></li>";
    html+="<li><span class='list-style'></span><span class='label-left-menu'>"+CONST_STR.get('CUS_PROFILE_EMAIL')+"</span><span class='infor-left-value' id='cus-profile-email'></span></li>";
    html+="<li><span class='list-style'></span><span class='label-left-menu'>"+CONST_STR.get('CUS_PROFILE_CIF')+"</span><span class='infor-left-value' id='cus-profile-cif'></span></li>";

    html+="</ul></div>";
    html+="<div  id='btn_edit_information' ><span class='langNoStyle'>"+CONST_STR.get('TRANSFER_REMITTANCE_MODIFY')+"</span>"
    //tucvv tạo div chứa thông tin cá nhân

    var customerinfo=document.getElementById('wrapper-menu');
    var divinfo=document.createElement('div');
    divinfo.id='bg-customer-info';
    divinfo.style.display='none';
    customerinfo.appendChild(divinfo);
    //tucvv Tạo thêm down arrow click xổ xuống thông tin cá nhân
//    var link_change_avatar=document.createElement("span");
//    link_change_avatar.id="link_change_avatar";
//    link_change_avatar.innerHTML=CONST_STR.get('ESAVING_CHANGEINFO_BTN_CHOICE');
//    document.getElementById("menu-profile-avatar").appendChild(link_change_avatar);
//    link_change_avatar.style.display="none";
    var menuheader=document.getElementsByClassName('menu-header');
    if (menuheader === null) alert('does not exist!');

    var divnarrow=document.createElement('div');
    divnarrow.id='header_down_narrow';
    divnarrow.className='header-down-narrow';
    var spanicon=document.createElement('span');
    spanicon.className='icon-movenext';
    divnarrow.appendChild(spanicon);
    menuheader[0].appendChild(divnarrow);
    menuheader[0].setAttribute('onClick','showCustomerInfo()');

    //Tucvv add icon thoát
    var divlogout=document.createElement('div');
    divlogout.id='header_div_logout';
    var spanicon1=document.createElement('span');
    spanicon1.innerHTML=CONST_STR.get("MENU_LOGOUT");
    spanicon1.setAttribute('style','bottom: 20%; right: 30%;font-size: 13px;font-weight: bold;color: #f69013')
    var spanicon2=document.createElement('span')
    spanicon2.className='icon-logout';
    spanicon2.setAttribute('style','margin-left: -15px; bottom: 20%; right: 30%; color: #f69013');
    divlogout.appendChild(spanicon1);
    divlogout.appendChild(spanicon2);
    menuheader[0].appendChild(divlogout);
    divlogout.setAttribute('class','btnshadow btn-second ripple-add-on');
    divlogout.setAttribute('style','width: 27%;border-radius: 10px;height: 30px; background: #f3e5f5');
    divlogout.setAttribute('onClick','logoutExit()');
    //end add icon thoát
    document.getElementById('bg-customer-info').innerHTML=html;
    var btnedit=document.getElementById('btn_edit_information');
    btnedit.setAttribute('onClick','gotoEditCustomerInfo()');

//    var data = {};
//    var arrayArgs = new Array();

    // var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_TYPE_CHNG_CUS_INFO"), "", "", gUserInfo.lang , gUserInfo.sessionID, arrayArgs);
    //
    // data = getDataFromGprsCmd(gprsCmd);
    //
    // requestMBService(data, true, 0, function(e){
    //     gprsResp = parserJSON(e);
    //     if ((gprsResp.respCode == '0') &&
    //         (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_TYPE_CHNG_CUS_INFO"))) &&
    //         gprsResp.arguments != undefined) {
    //         logInfo(gprsResp.arguments);
    //
    //         var tmpArr = gprsResp.arguments;
    //         if (tmpArr.length >= 15) {
    //             /*cusInfoObj = {"name":tmpArr[0], "birthday":tmpArr[1], "idPassport":tmpArr[2], "occupation":tmpArr[3],
    //              "workPlace":tmpArr[4], "workAddress1":tmpArr[5], "workAddress2":tmpArr[6], "workAddress3":tmpArr[7],
    //              "workTel":tmpArr[8], "currAddress1":tmpArr[9], "currAddress2":tmpArr[10], "currAddress3":tmpArr[11],
    //              "currAddress4":tmpArr[12], "mobile":tmpArr[13], "email":tmpArr[14]};*/
    //             document.getElementById('cus-profile-fullname').innerHTML = tmpArr[0];
    //             document.getElementById('cus-profile-birthday').innerHTML = tmpArr[1];
    //             document.getElementById('cus-profile-userid').innerHTML = tmpArr[2];
    //             document.getElementById('cus-profile-address').innerHTML +=" "+ tmpArr[9] + ', ' + tmpArr[10] + ', ' + tmpArr[11] + ', ' + tmpArr[12];
    //             document.getElementById('cus-profile-mobile').innerHTML = tmpArr[13];
    //             document.getElementById('cus-profile-email').innerHTML = tmpArr[14];
    //             document.getElementById('cus-profile-cif').innerHTML = gCustomerNo;
    //         } else {
    //             showAlertText(CONST_STR.get('UTILITIES_CHNG_PER_INFO_SERVICE_ERROR_MSG'));
    //         }
    //
    //     }
    // }, function(){
    //
    // });
}
function showCustomerInfo(){
    if (fInfo == 1) {
        userInfo = {};
        GetUserInfo();
    }
    var classname = document.getElementById("header_down_narrow").className;
    if(classname=='header-down-narrow')
    {
     document.getElementById("header_down_narrow").className="header-up-narrow";
     document.getElementById("bg-customer-info").style.display="block";
//     document.getElementById('menu-profile-avatar').setAttribute("onClick","gotoChangeAvatar()");
//     document.getElementById("link_change_avatar").style.display="block";
//     document.getElementById('link_change_avatar').setAttribute("onClick","gotoChangeAvatar()");

    }
    else
    {
        document.getElementById("header_down_narrow").className="header-down-narrow";
        document.getElementById("bg-customer-info").style.display="none";
        document.getElementById('menu-profile-avatar').removeAttribute("onClick");
//        document.getElementById("link_change_avatar").style.display="none";
//        document.getElementById('link_change_avatar').removeAttribute("onClick");
    }
}
function getElementsByAttrName(inAtt) {
    var matchingElements = [];
    var allElements = document.getElementsByTagName('*');
    for (var i = 0, n = allElements.length; i < n; i++) {
        if (allElements[i].getAttribute(inAtt)) {
            // Element exists with attribute. Add to array.
            matchingElements.push(allElements[i]);
        }
    }
    return matchingElements;
}

/*** CHANGE LANGUAGE END ***/

/*** LOG WITH CHECK DEBUG MODE ***/

function logInfo(inContent) {
    if (!CONST_DEBUG_MODE) {
        return;
    }
    else {
        if (inContent == undefined) return;
        try {

            console.log((inContent));

        }
        catch (err) {
            console.log('error console.log: ' + err);
        }
    }
}

/*** LOG WITH CHECK DEBUG MODE END ***/

/*** REMOVE VIETNAMESE CHAR ***/

function replaceVietnameseKey(str, e) {

    if (e == undefined) {
        e = window.event || e;
    }
    var keyUnicode = e.charCode || e.keyCode;
    if (e !== undefined) {
        switch (keyUnicode) {
            case 16:
                break; // Shift
            case 17:
                break; // Ctrl
            case 18:
                break; // Alt
            case 27:
                this.value = '';
                break; // Esc: clear entry
            case 35:
                break; // End
            case 36:
                break; // Home
            case 37:
                break; // cursor left
            case 38:
                break; // cursor up
            case 39:
                break; // cursor right
            case 40:
                break; // cursor down
            case 46:
            {
                //str = "";
                break;
            }
            case 78:
                break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
            case 110:
                break; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
            case 190:
                break; // .
            default:
            {
                //str= str.toLowerCase();
                str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
                str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
                str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
                str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
                str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
                str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
                str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
                str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
                str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
                str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
                str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
                str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
                str = str.replace(/đ/g, "d");
                str = str.replace(/Đ/g, "D");
            }
        }
    }
    //str = str.toUpperCase();
    return str;
}

function replaceVietnameseChars(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/Đ/g, "D");
    return str;
}


/*** REMOVE VIETNAMESE CHAR ***/


/*** SEARCH ***/

var evtSearchResultDone = document.createEvent('Event');
evtSearchResultDone.initEvent('evtSearchResultDone', true, true);

function searchWhenInputAtIDWithArrayString(inNodeID, inArrayData) {
    var timeToCheckInputChange;
    var tmpNodeInputValue = document.getElementById(inNodeID);
    if (tmpNodeInputValue != null && tmpNodeInputValue.text != '') {
        tmpNodeInputValue.onkeydown = function (e) {
            var tmpSearchResultArray = new Array();
            if ((timeToCheckInputChange != null) && (timeToCheckInputChange != undefined)) {
                clearTimeout(timeToCheckInputChange);
            }
            timeToCheckInputChange = setTimeout(function (et) {
                clearTimeout(timeToCheckInputChange);
                tmpSearchResultArray = searchStringInArrayString(tmpNodeInputValue.value, inArrayData);
                evtSearchResultDone.searchResult = tmpSearchResultArray;
                tmpNodeInputValue.dispatchEvent(evtSearchResultDone);
            }, 500);

            replaceVietnameseKey(tmpNodeInputValue.value, e);

            var evt = e || window.event;
            var ew = evt.keyCode || evt.which;

            if ((ew == 13) || (ew == 9)) //enter key, tab key
            {
                clearTimeout(timeToCheckInputChange);
                tmpSearchResultArray = searchStringInArrayString(tmpNodeInputValue.value, inArrayData);
                evtSearchResultDone.searchResult = tmpSearchResultArray;
                tmpNodeInputValue.dispatchEvent(evtSearchResultDone);
                return false;
            }

            //tmpNodeInputValue.value = tmpNodeInputValue.value + replaceVietnameseChars(String.fromCharCode(ew))
            //return false;
        };
    }

    function searchStringInArrayString(searchStr, inArrayData) {
        var searchString = removeAccent(searchStr);
        searchString = searchString.toLowerCase();
        var searchArrayResult = new Array();
        for (var i = 0; i < inArrayData.length; i++) {
            var tmpStr = inArrayData[i];
            var tmpStrLowerCase = tmpStr.toLowerCase();
            tmpStrLowerCase = replaceVietnameseChars(tmpStrLowerCase);
            if (tmpStrLowerCase.indexOf(searchString) != -1) {
                searchArrayResult.push(tmpStr);
            }
        }
        return searchArrayResult;
    }
}

/*** SEARCH END ***/

/***ANHNTT.FSOFT STORAGE KEYLAYOUT***/
function setLayoutConfig(inKey){
    if (typeof(Storage) !== "undefined") {
        // Web storage is supported
        try {
            gKeylayout=inKey;
            localStorage.setItem('TPBankUserLayout', inKey);
        }
        catch (err) {
            logInfo('Browser not support local store');
        }
    }
    else {
        // Web storage is NOT supported
        logInfo('Browser not support local store');
    }
}

function getLayoutConfig() {
    if (typeof(Storage) !== "undefined") {
        try {
            // Web storage is supported
            var tmpUserNo = localStorage.getItem('TPBankUserNumber');
            if ((tmpUserNo != undefined) && (tmpUserNo != null) && (tmpUserNo.length == 8)) {
                gKeylayout = localStorage.getItem('TPBankUserLayout');
                return true ;
            }
            return false;
        }
        catch (err) {
            logInfo('Browser not support local store');
            return false ;
        }
    }
    else {
        // Web storage is NOT supported
        logInfo('Browser not support local store');
        return false ;
    }
}



/***ANHNTT.FSOFT CHANGE LAYOUTBACKGROUND***/
function setChangeBackGr(iKey){
    if (typeof(Storage) !== "undefined") {
        // Web storage is supported
        try {
            changeBackGround=iKey;
            localStorage.setItem('TPBankUserBackground', iKey);
        }
        catch (err) {
            logInfo('Browser not support local store');
        }
    }
    else {
        // Web storage is NOT supported
        logInfo('Browser not support local store');
    }
}

function getChangeBackGr() {
    if (typeof(Storage) !== "undefined") {
        try {
            // Web storage is supported
            var tmpUserNo = localStorage.getItem('TPBankUserNumber');
            if ((tmpUserNo != undefined) && (tmpUserNo != null) && (tmpUserNo.length == 8)) {
                changeBackGround = localStorage.getItem('TPBankUserBackground');
                return true ;
            }
            return false;
        }
        catch (err) {
            logInfo('Browser not support local store');
            return false ;
        }
    }
    else {
        // Web storage is NOT supported
        logInfo('Browser not support local store');
        return false ;
    }
}

/*** STORAGE DATA ***/

function setLanguageConfig(inStr) {
    if (typeof(Storage) !== "undefined") {
        // Web storage is supported
        try {
            localStorage.setItem('TPBankUserLang', inStr);
        }
        catch (err) {
            logInfo('Browser not support local store');
        }
    }
    else {
        // Web storage is NOT supported
        logInfo('Browser not support local store');
    }
}

function getLanguageConfig() {
    if (typeof(Storage) !== "undefined") {
        try {
            // Web storage is supported
            var tmpLang = localStorage.getItem('TPBankUserLang');
            if ((tmpLang != undefined) && (tmpLang != null)) {
                return tmpLang;
            }
            return 'VN';
        }
        catch (err) {
            logInfo('Browser not support local store');
            return 'VN';
        }
    }
    else {
        // Web storage is NOT supported
        logInfo('Browser not support local store');
        return 'VN';
    }
}

//anhpv1 avatar
function setUserAvatarToLocal(inUserAvatar) {
    if (typeof(Storage) !== "undefined") {
        try {
			if(inUserAvatar == "")
				gUserAvatar = './assets/images/acc-info-img.png';
			else
				gUserAvatar = inUserAvatar;
            localStorage.setItem('TPBankUserAvatar', gUserAvatar);
        }
        catch (err) {
            logInfo('Browser not support local store');
        }
    }
    else {
        // Web storage is NOT supported
        logInfo('Browser not support local store');
    }
}
function getUserAvatarFromLocal() {
    if (typeof(Storage) !== "undefined") {
        try {
            // Web storage is supported
            var tmpUserNo = localStorage.getItem('TPBankUserNumber');

            if ((tmpUserNo != undefined) && (tmpUserNo != null) && (tmpUserNo.length == 8)) {
                gUserAvatar = localStorage.getItem('TPBankUserAvatar');
                return true;
            }
            return false;
        }
        catch (err) {
            logInfo('Browser not support local store');
            return false;
        }

    }
    else {
        // Web storage is NOT supported
        logInfo('Browser not support local store');
        return false;
    }
}
function setUserInfoToLocal(inAccNo, inAccName) {
    if (typeof(Storage) !== "undefined") {
        try {
            // Web storage is supported
            gCustomerNo = inAccNo;
            gCustomerNanme = inAccName;
            localStorage.setItem('TPBankUserNumber', inAccNo);
            localStorage.setItem('TPBankUserName', inAccName);
        }
        catch (err) {
            logInfo('Browser not support local store');
        }
    }
    else {
        // Web storage is NOT supported
        logInfo('Browser not support local store');
    }
}

function getUserInfoToLocal() {
    if (typeof(Storage) !== "undefined") {
        try {
            // Web storage is supported
            var tmpUserNo = localStorage.getItem('TPBankUserNumber');

            if ((tmpUserNo != undefined) && (tmpUserNo != null) && (tmpUserNo.length == 10)) {
                gCustomerNo = tmpUserNo;
                gCustomerNanme = localStorage.getItem('TPBankUserName');
                return true;
            }
            return false;
        }
        catch (err) {
            logInfo('Browser not support local store');
            return false;
        }

    }
    else {
        // Web storage is NOT supported
        logInfo('Browser not support local store');
        return false;
    }
}

function setGoldTerm(inStr) {
    if (typeof(Storage) !== "undefined") {
        try {
            // Web storage is supported
            localStorage.setItem('TPBankUserLang', inStr);
        }
        catch (err) {
            logInfo('Browser not support local store');
        }

    }
    else {
        // Web storage is NOT supported
        logInfo('Browser not support local store');
    }
}

function getLanguageConfig() {
    if (typeof(Storage) !== "undefined") {
        try {
            // Web storage is supported
            var tmpLang = localStorage.getItem('TPBankUserLang');
            if ((tmpLang != undefined) && (tmpLang != null)) {
                return tmpLang;
            }
            return 'VN';
        }
        catch (err) {
            return 'VN';
        }
    }
    else {
        // Web storage is NOT supported
        logInfo('Browser not support local store');
        return 'VN';
    }
}
//set download app
function setAgreeDownloadApp(inStr) {
    if (typeof(Storage) !== "undefined") {
        try {
            // Web storage is supported
            localStorage.setItem('TPBankDownloadStatus', inStr);
        }
        catch (err) {
            logInfo('Browser not support local store');
        }
    }
    else {
        // Web storage is NOT supported
        logInfo('Browser not support local store');
    }
}

function getAgreeDownloadApp() {
    if (typeof(Storage) !== "undefined") {
        try {
            // Web storage is supported
            var tmpLang = localStorage.getItem('TPBankDownloadStatus');
            if ((tmpLang != undefined) && (tmpLang != null)) {
                return tmpLang;
            }
            return 'N';
        }
        catch (err) {
            logInfo('Browser not support local store');
            return 'N';
        }
    }
    else {
        // Web storage is NOT supported
        logInfo('Browser not support local store');
        return 'N';
    }
}

/*** STORAGE DATA END ***/

/*** HANDLE KEYBOARD ***/

function handleKeyboardShowAndHidden() {
    var arrayInputs = document.getElementById('tabHost').getElementsByTagName('input');
    var arrayInputsTextArea = document.getElementById('tabHost').getElementsByTagName('textarea');
    //var focused = false;
    var timeOutFocus;
    var tmpWP = navigator.userAgent.match(/IEMobile|WPDesktop/i);
    var tmpIPad = navigator.userAgent.match(/iPad/i);

    if (arrayInputs && arrayInputs.length > 0) {
        for (var i = 0; i < arrayInputs.length; i++) {
            var elm = arrayInputs[i];
            elm.setAttribute('autocomplete', 'off');
            elm.setAttribute('autocorrect', 'off');
            elm.setAttribute('autocapitalize', 'off');
            elm.setAttribute('spellcheck', 'off');
            elm.addEventListener('focus', function () {
                if (Environment.isMobile()) {
                    if (gModeScreenView == CONST_MODE_SCR_SMALL) {
                        //document.getElementById('mainlayoutfooter').style.display = 'none';
                    }
                    else {
                        //document.getElementById('pageFooter').style.display = 'none';
                    }
                    clearTimeout(timeOutToChangeSize); //fix on iPad iOS6
                    timeOutToChangeSize = null;
                }

                clearTimeout(timeOutFocus);
                timeOutFocus = null;
            }, true);
            if (!tmpWP) {
                elm.addEventListener('blur', function () {
                    if (Environment.isMobile()) {
                        if (gModeScreenView == CONST_MODE_SCR_SMALL) {
                            // document.getElementById('mainlayoutfooter').style.display = '';
                        }
                        else {
                            // document.getElementById('pageFooter').style.display = '';
                        }
                    }
                    timeOutFocus = setTimeout(function () {
                        if (timeOutFocus) {
                            clearTimeout(timeOutFocus);
                            timeOutFocus = null;
                        }
                        if (tmpIPad) {
                            window.scroll(0, 0); //fix on ipad
                        }
                        if (Environment.isMobile()) {
                            applyDynamicCommonStyleSheet();
                            applyDynamicPageStyleSheet(true);
                            //applyVerticalScrollPage(true, -80);
                            //applyDynamicPromotionWithNumOfItems(gPromotionContentArray.length);
                            // applyDynamicPromotionWithNumOfItems(10);
                        }
                    }, 500);

                }, true);
            }
        }
    }

    if (arrayInputsTextArea && arrayInputsTextArea.length > 0) {
        for (var i = 0; i < arrayInputsTextArea.length; i++) {
            var elm = arrayInputsTextArea[i];
            elm.setAttribute('autocomplete', 'off');
            elm.setAttribute('autocorrect', 'off');
            elm.setAttribute('autocapitalize', 'off');
            elm.setAttribute('spellcheck', 'off');
            elm.addEventListener('focus', function () {
                if (Environment.isMobile()) {
                    if (gModeScreenView == CONST_MODE_SCR_SMALL) {
                        // document.getElementById('mainlayoutfooter').style.display = 'none';
                    }
                    else {
                        // document.getElementById('pageFooter').style.display = 'none';
                    }
                    clearTimeout(timeOutToChangeSize); //fix on iPad iOS6
                    timeOutToChangeSize = null;
                }
                clearTimeout(timeOutFocus);
                timeOutFocus = null;

            }, true);
            if (!tmpWP) {
                elm.addEventListener('blur', function () {
                    if (Environment.isMobile()) {
                        if (gModeScreenView == CONST_MODE_SCR_SMALL) {
                            // document.getElementById('mainlayoutfooter').style.display = '';
                        }
                        else {
                            // document.getElementById('pageFooter').style.display = '';
                        }
                    }
                    timeOutFocus = setTimeout(function () {
                        if (timeOutFocus) {
                            clearTimeout(timeOutFocus);
                            timeOutFocus = null;
                        }
                        if (tmpIPad) {
                            window.scroll(0, 0); //fix on ipad
                        }
                        if (Environment.isMobile()) {
                            applyDynamicCommonStyleSheet();
                            applyDynamicPageStyleSheet(true);
                            //applyVerticalScrollPage(true, -80);
                            //applyDynamicPromotionWithNumOfItems(gPromotionContentArray.length);
                            // applyDynamicPromotionWithNumOfItems(10);
                        }
                    }, 500);

                }, true);
            }
        }
    }
}

/*** HANDLE KEYBOARD END ***/

/*** EGOLD TRANSACTION ***/

function openEGoldView() {

    //openEGoldMenu();
    if (!gUserInfo.goldTermConfirmed) {
        navController.pushToView('egold/gold-term-confirm-scr', true);
    }
    else {
        navController.initWithRootView('egold/gold-main-page-scr', true);
        openEGoldMenu();
    }
}

function openEGoldMenu() {
    setTimeout(function (e) {
        if (!content.isOpen && !contentPromotion.isOpen) {
            openMenuContent();

            var nodeEGoldMenu = document.getElementById('goldTrade');
            if ((nodeEGoldMenu != undefined) && (nodeEGoldMenu != null) && (currentDisplayMenu != nodeEGoldMenu)) {
                applyScrollForMe(nodeEGoldMenu);
            }
        }
    }, 300);
}

/*** EGOLD TRANSACTION END ***/

/*** STRING UTILITY ***/

String.prototype.format = String.prototype.f = function () {
    var args = arguments;
    return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
        if (m == "{{") {
            return "{";
        }
        if (m == "}}") {
            return "}";
        }
        return args[n];
    });
};

/*** STRING UTILITY END ***/

/*** MASK WHEN SHOW SLIDE MENU ***/

function openMenuContent() {
    showMaskSlideMenu(true);
    if (content.container) {
        content.open();
    }
    displayMenuSection(content.isOpen);
    setInterlockEnable();
}
function closeMenuContent() {
    showMaskSlideMenu(false);
    if (content.container) {
        content.close();
    }
    displayMenuSection(content.isOpen);
    setInterlockEnable();
}
function closeAllSlideMenu(inStatus) {
    var tmpNodeMenu = document.getElementById('menu-section');
    //tmpNodeMenu.style.display = 'block'; //document.getElementById('menu-section').style.display = 'block';
    //if(CONST_DESKTOP_MODE) return;
    if (content && tmpNodeMenu.style.display != 'none') {
        if (!inStatus) closeMenuContent();
        else content.close();
    }
    showMaskSlideMenu(false);
}
function showMaskSlideMenu(inStatus) {
    var tmpMaskNode = document.getElementById('mask-slideview');
    //if (navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS 5_\d/i)) {
    //tmpMaskNode.style.display = 'none';
    // }
    //else {
    if (inStatus == true) {
        tmpMaskNode.style.opacity = 0;
        var timeToHiddenMask = setTimeout(function () {
            clearTimeout(timeToHiddenMask);
            tmpMaskNode.style.display = 'block';
            tmpMaskNode.style.opacity = 0.8;
        }, 500);
    }
    else {
        tmpMaskNode.style.opacity = 0.8;
        var timeToHiddenMask = setTimeout(function () {
            clearTimeout(timeToHiddenMask);
            tmpMaskNode.style.display = 'none';
            tmpMaskNode.style.opacity = 0;
        }, 500);
    }
    // }

}

/*** MASK WHEN SHOW SLIDE MENU END ***/

/*** DISPLAY ON DESKTOP ***/

function setViewOnDesktopWhenLogin() {

    var tmpNodeMenu = document.getElementById('menu-section');
    tmpNodeMenu.style.display = 'block';

    //updateViewForDesktop();

    updateMainContentWidth();
}

function updateViewForDesktop() {
    document.getElementById("nav.btn.home").style.display = 'none';
    if(!gIsLogin){
        document.getElementById("menu-section").style.display = 'none';
        var navAction = document.getElementById("navActionbar");
        navAction.style.position = "absolute";
        navAction.style.marginLeft = "147px";
        document.getElementById("nav.title").style.color = "black";
        document.getElementById("nav.title").style.textAlign = "left";
        document.getElementById("nav.title").style.position = "relative";
    }
    //close menu & promotion view before update resize
    if (content != undefined) content.close();
    if (contentPromotion != undefined) contentPromotion.close();
    document.body.style.backgroundColor = '#F1F1F1';
    var tmpNodeMain = document.getElementById('mainview');
    var tmpNodePage = document.getElementById('fullPage');
    var tmpPageBorder = document.getElementById('pageBorder');
    var tmpNodeHeader = tmpNodeMain.getElementsByClassName('header')[0];
    var mainViewContent= document.getElementById('mainViewContent');
    if(currentPage != "login-scr"){
        document.getElementById('mainlayoutfooter').style.display='none';
    }
    if (!gIsLogin) {
        tmpNodePage.setAttribute('align', 'center');
        tmpNodeMain.style.cssFloat = 'none';
        if (tmpPageBorder != undefined) tmpPageBorder.style.width = '500px';
        tmpNodeHeader.style.display = 'none';
        return;
    }
    else {
        tmpNodeMain.style.cssFloat = 'left';
        tmpNodeHeader.style.display = 'none';
    }
    var navTitle=document.getElementById('nav.title');
    if(navTitle){
        navTitle.style.color="black";
        navTitle.style.textAlign="left";
    }
    var tmpNodePage = document.getElementById('fullPage');
    if (mainViewContent) {
    document.getElementById('mainViewContent').style.top = '0px';
    }
    var tmpNodeHeader = tmpNodeMain.getElementsByClassName('header')[0];
    tmpNodeHeader.style.display = 'block';
    document.getElementById('headermb').style.display = 'none';
    if (gIsLogin) {
        document.getElementById('nav.btn.right2').style.display='none';
        document.getElementById('id.qrcode.btn').style.display='none';
        document.getElementById('id.call.btn').style.display='none';
        document.getElementById('nav.icon.tpbank').style.display='none';
        document.getElementById('nav.btn.home').style.display='none';
    }
    if(gIsLogin){
        actionbar.refreshActionBar(currentPage);
    }
    if(gIsLogin &&currentPage == "homepage/homepage-dynamic-scr"){
        actionbar.hideNavHeaderBar();
        actionbar.setHavingBackground(false);
        actionbar.showActionBar();
    }
    document.getElementById('mainlayoutfooter').style.display = 'none';

}

function updateViewForMobile() {
    //close menu & promotion view before update resize
    if (content != undefined) content.close();
    if (contentPromotion != undefined) contentPromotion.close();
    var mainViewVerticalSlide=document.getElementById('mainViewVerticalSlide');
    document.body.style.backgroundColor = '#5F2F85';
    var tmpNodePage = document.getElementById('fullPage');
    tmpNodePage.setAttribute('align', 'left'); //left
    var mainViewContent=document.getElementById('mainViewContent');
    var menuSection=document.getElementById('menu-section');
    if (menuSection) {
        menuSection.style.height='100%';
    }
    if (mainViewContent) {
        mainViewContent.style.height='100%';
    }

    var tmpNodeMain = document.getElementById('mainview');
    tmpNodeMain.style.cssFloat = 'left';
    tmpNodeMain.style.height='100%'
    tmpNodeMain.style.borderLeftStyle = 'none';
    tmpNodeMain.style.borderRightStyle = 'none';
    var tmpNodeHeader = tmpNodeMain.getElementsByClassName('header')[0];
    tmpNodeHeader.style.display = 'block';
    var iconTa=document.getElementById("iconTa");
    if (mainViewVerticalSlide) {
        mainViewVerticalSlide.style.height ='100%';
    }
    if(iconTa){
        iconTa.style.display="none";
    }
    var navTitle=document.getElementById('nav.title');
    if(navTitle){
        navTitle.style.color="#eee";
        navTitle.style.textAlign="center";
    }
    var tmpPageBorder = document.getElementById('pageBorder');
    if (tmpPageBorder != undefined) tmpPageBorder.style.width = '100%';
    document.getElementById('pageHeader').style.display = 'none';
    document.getElementById('pageFooter').style.display = 'none';
    document.getElementById('menu-section').style.display = 'block';
    if(currentPage!="login-scr"){
        document.getElementById('mainlayoutfooter').style.display='none';
        document.getElementById('headermb').style.display = 'none';
    }
    if(gIsLogin&&currentPage=="homepage/homepage-dynamic-scr"){
        document.getElementById('nav.btn.right2').style.display='block';
        if (gUserInfo.userAvatar) {
            document.getElementById('nav.btn.right2').innerHTML = '<div id="notifi-number-top" class="icon-number-notifi" style="visibility:hidden; right: 0px;padding: 4px;position: absolute;background: #f2571a;border-radius: 50%;"></div><img width="28px" onclick="onpenNotification();" height="28px" style="border: solid 2px #fff;border-radius: 100%;" src="' + gUserInfo.userAvatar + '" />';
            document.getElementById('nav.btn.right2').style.backgroundColor = "transparent";
            document.getElementById('nav.btn.right2').style.marginRight = '6px';
            document.getElementById('nav.btn.right2').style.marginTop = '8px';
        } else {
            document.getElementById('nav.btn.right2').innerHTML = '<span onclick="onpenNotification();"  class="icon-logo ripple-add-on" style="font-size:20px;border-radius: 100%;background: #561f45;padding: 5px;"/>';
            document.getElementById('nav.btn.right2').style.marginRight = '6px';
            document.getElementById('nav.btn.right2').style.marginTop = '12px';
        }
        document.getElementById('id.qrcode.btn').style.display='block';

        if(currentPage=="homepage/homepage-dynamic-scr"){
            document.getElementById('nav.icon.tpbank').style.display='block';
            document.getElementById('id.call.btn').style.display='block';
            document.getElementById('id.qrcode.btn').style.display='block';
            document.getElementById('nav.btn.home').style.display='none';
        }
    }
     if(gIsLogin && currentPage!="homepage/homepage-dynamic-scr"){
         actionbar.refreshActionBar(currentPage);
     }
    if(gIsLogin &&currentPage=="homepage/homepage-dynamic-scr"){
        actionbar.showNavHeaderBar();
        actionbar.setHavingBackground(true);
        actionbar.showActionBar();
    }
    if(currentPage!="login-scr"){
        document.getElementById('headermb').style.display = 'none';
    }
    if(!gIsLogin){
        var navAction = document.getElementById("navActionbar");
        document.getElementById("nav.title").style.color = '';
        navAction.style.position = '';
        navAction.style.marginLeft = '';
    }

}
var CONST_MODE_SCR_SMALL = 1;
var CONST_MODE_SCR_MEDIUM = 2;
var CONST_MODE_SCR_FULL = 3;
var gFlagTran;
//var gModeScreenView = CONST_MODE_SCR_MEDIUM;
//var isModelMobile = navigator.userAgent.match(/Android|iPhone|iPod|IEMobile/i);
function updateMainContentWidth(inWidth, inHeight) {
    if (!inWidth) {
        inWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
    }
    if (!inHeight) {
        inHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
    }
    var tmpNodePageHeader = document.getElementById('pageHeader');

    var isIPad = navigator.userAgent.match(/iPad/i);
    //TUANNM5 update pinpad
    document.getElementById('div-pinpad').style.width = inWidth;
    document.getElementById('div-pinpad').style.height = inHeight;

    var tmpNodeMain = document.getElementById('mainview');
    var tmpMainViewWidth = 0;
    if (inWidth < 801) { //width to change mode

        var tmpNodePage = document.getElementById('fullPage');
        tmpNodePage.style.height = inHeight + 'px';
        tmpMainViewWidth = inWidth;

        if (gModeScreenView == CONST_MODE_SCR_SMALL && !gIsLogin) return;
        gModeScreenView = CONST_MODE_SCR_SMALL;
        if (inHeight < 640 && isModelMobile) {
            tmpNodePageHeader.style.display = 'none';
        }
        else {
            tmpNodePageHeader.style.display = 'block';
        }
        updateViewForMobile();
        document.getElementById('header-desktopmode').style.display='none';
        document.getElementById('pageFooterDesktop').style.display='none';
            if(gIsLogin){
                document.getElementById('menu-section').style.left = -260+'px';
                document.getElementById('menu-section').style.height = '100%';
                document.getElementById('nav.btn.homeright').style.display = 'none';
                bottomBar.reviewHome(inWidth,inHeight);

                var navbarB = document.getElementById("navBottomBar");
                if(navbarB){
                    navbarB.style.left= 0+"px";
                    navbarB.style.top = (inHeight-60)+"px";
                    navbarB.style.height= 60+"px";
                }
                var bottomBarH = document.getElementById('bottomBarHome');
                if(bottomBarH){
                    bottomBarH.style.bottom="-60px";
                    bottomBarH.style.transform =  'translate(0px, -60px) translateZ(0px)' ;
                }
                var bottomShotCut = document.getElementsByClassName("bottomBarShortCut");
                if(bottomShotCut){
                    for (var i = 0; i < bottomShotCut.length; i++) {
                        bottomShotCut[i].style.bottom = "-47px";
                        bottomShotCut[i].style.transform = 'translate(0px, -47px) translateZ(0px)';
                    }
                }
                var bottomText= document.getElementsByClassName("bottomBarText");
                if(bottomText){
                    for (var i = 0; i < bottomText.length; i++) {
                        bottomText[i].style.bottom = "-40px";
                        bottomText[i].style.transform ='transform: translate(0px, -40px) translateZ(0px)';
                    }
                }
            }

        if(currentPage == 'homepage/homepage-dynamic-scr'){
            document.getElementById('mainViewContent').style.top = '161px';
        } else if(document.getElementById('mainViewContent')){
            document.getElementById('mainViewContent').style.top = '50px';
            document.getElementById('nav.btn.home').style.display='block';
        }

        tmpNodeMain.style.borderRightStyle = 'none';
        if(gFlagTran!=gModeScreenView){

            var blackTran=document.getElementById("hideAll");
            blackTran.style.visibility='visible';
           if(gKeylayout == 1){
                changeJSandCSStoMB();
            }else if (gKeylayout == 2) {
                changeJSandCSStoMBLight();
            }else{
                changeJSandCSStoMB();
            }
            setTimeout(function(){
                blackTran.style.visibility='hidden';
            },500);
            gFlagTran=gModeScreenView;
        }
        if(!isMobileMode){
            isMobileMode = true;
            document.dispatchEvent(evtChangeWidthMobile);
        }
    }
    else {
        var tmpNodePage = document.getElementById('fullPage');
        tmpNodePage.style.height = inHeight + 'px';
        tmpMainViewWidth = (inWidth - 260);
        logInfo('Main view width: ' + tmpMainViewWidth);
        document.getElementById('header-desktopmode').style.display='block';
        document.getElementById('pageFooterDesktop').style.display='block';
        var tmpNodePage = document.getElementById('fullPage');
        tmpNodePage.style.height = (inHeight - 93) + 'px'
        if (inWidth < 920) {
            document.getElementById('block_download_qrcode').style.display='none';
        }
        else{
            document.getElementById('block_download_qrcode').style.display='block';
        }
        if (gModeScreenView == CONST_MODE_SCR_MEDIUM && !gIsLogin) return;
        gModeScreenView = CONST_MODE_SCR_MEDIUM;
        if (inHeight < 640 && isModelMobile) {
            tmpNodePageHeader.style.display = 'none';
        }
        else {
            tmpNodePageHeader.style.display = 'block';
        }

        document.body.height = inHeight;
        windowScrollToTop();
        updateViewForDesktop();

        var iconTa = document.getElementById("iconTa");
        if(iconTa && currentTitle!=''){
            iconTa.style.display="block";
        }
        document.getElementById('nav.btn.homeright').style.display='none';
        tmpNodeMain.style.borderRightStyle = 'none';
        if (gIsLogin) {
            document.getElementById('mainview').style.background = 'rgba(255,255,255,0.9)';
            var mainview= document.getElementById('mainview');
            mainview.style.height = ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)-127) +'px';
            mainview.style.display = 'block';
//            mainview.style.top = '25px';
            resizeMainViewContent(currentPage);
            var tmpMenu = document.getElementById('menu-section');
            tmpMenu.style.display = 'block';
            tmpMenu.style.opacity = 1;
            tmpMenu.style.left = 0;
            tmpMenu.style.transform='none';
            tmpMenu.style.height = ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)-126.5) +'px';
            tmpMenu.style.display = 'block';
//            tmpMenu.style.top = '25px';
            var homePageContent = document.getElementById('homePageContent');
            if(homePageContent){
                homePageContent.style.height=inHeight+"px";
            }
            var navbarB = document.getElementById("navBottomBar");
            if(navbarB){
                navbarB.style.left =0;
                navbarB.style.top = (document.getElementById('mainview').clientHeight + 10 - 70 - document.getElementById('navActionbar').clientHeight + 33) + "px";
                navbarB.style.height= 35+"px";
            }
            var bottomBarH = document.getElementById('bottomBarHome');
            if(bottomBarH){
                bottomBarH.style.bottom="0";
                bottomBarH.style.transform = 'none';
                bottomBarH.style.transitionDuration = 'none';
            }
            var bottomShotCut = document.getElementsByClassName("bottomBarShortCut");
            if(bottomShotCut){
                for (var i = 0; i < bottomShotCut.length; i++) {
                    bottomShotCut[i].style.bottom = "0";
                    bottomShotCut[i].style.transform = 'none';
                    bottomShotCut[i].style.transitionProperty = 'none';
                    bottomShotCut[i].style.transitionDuration = 'none';

                }
            }
            var bottomText= document.getElementsByClassName("bottomBarText");
            if(bottomText){
                for (var i = 0; i < bottomText.length; i++) {
                    bottomText[i].style.bottom = "0";
                    bottomText[i].style.transform ='none';
                    bottomText[i].style.transitionProperty = 'none';
                    bottomText[i].style.transitionDuration = 'none';
                }
            }
        }

        if(isMobileMode){
            isMobileMode = false;
            document.dispatchEvent(evtChangeWidthDesktop);
        }
    }

    if (gIsLogin) {
        tmpNodeMain.style.width = tmpMainViewWidth + 'px';
        if(tmpMainViewWidth > 740){
            bottomBar.reviewHome(740,inHeight);
        }else{
            bottomBar.reviewHome(tmpMainViewWidth,inHeight);
        }


    } else{
        document.getElementById('menu-section').display="none";
    }
    if(gFlagTran != gModeScreenView){
        var blackTran=document.getElementById("hideAll");
        blackTran.style.visibility='visible';
        if(gKeylayout==1){
            changeJSandCSStoIB();
        }else if (gKeylayout==2) {
            changeJSandCSSLighttoIB();
        }else{
            changeJSandCSStoIB();
        }
        setTimeout(function(){
            blackTran.style.visibility='hidden';
        },500);
        gFlagTran=gModeScreenView;
    }
}


function keyboardEvent() {

    var tmpArrayInput = document.getElementsByTagName('input');
    for (var i = 0; i < tmpArrayInput.length; i++) {
        var tmpInputNode = tmpArrayInput[i];
        tmpInputNode.onfocus = function () {
            var currentClientHeight = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;
            gOldDeviceHeight = currentClientHeight;
            //setTimeout(function() {
            //alert('focus me!!');
            // }, 10);
        }
        tmpInputNode.onblur = function () {
            setTimeout(function () {
                //alert('blur me!!');
                var currentClientHeight = window.innerHeight
                    || document.documentElement.clientHeight
                    || document.body.clientHeight;
                if (gOldDeviceHeight < currentClientHeight) {
                    gOldDeviceHeight = currentClientHeight;
                    windowScrollToTop();
                }

            }, 10);

        }
    }
    var tmpArrayTextarea = document.getElementsByTagName('textarea');
    for (var i = 0; i < tmpArrayTextarea.length; i++) {
        var tmpTextareNode = tmpArrayTextarea[i];
        tmpTextareNode.onfocus = function () {
            var currentClientHeight = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;
            gOldDeviceHeight = currentClientHeight;
            //setTimeout(function(){
            //alert('focus me!!');
            // }, 10);
        }
        tmpTextareNode.onblur = function () {
            setTimeout(function () {
                //alert('blur me!!');
                var currentClientHeight = window.innerHeight
                    || document.documentElement.clientHeight
                    || document.body.clientHeight;
                if (gOldDeviceHeight < currentClientHeight) {
                    gOldDeviceHeight = currentClientHeight;
                    windowScrollToTop();
                }
            }, 10);
        }
    }
}
var clientHeightAbc;
function windowScrollToTop() {
    var isIPad = navigator.userAgent.match(/iPad/i);
    if (!clientHeightAbc) {
        clientHeightAbc = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
        //alert('clientHeight 1 = ' + clientHeightAbc);
    }
    //alert('clientHeight 2 = ' + clientHeightAbc);
    document.body.height = clientHeightAbc;
    //if(isIPad) window.scrollTo(0, 0);
}

/*** DISPLAY ON DESKTOP END ***/


/*** CHANGE LANGUAGE IN IB VERSION ***/
/*
 mode = 0 : mobile
 mode = 1 : desktop
 */
//function initLanguageOnIB(mode) {
function initLanguageOnIB() {

    //document.getElementById('lblChangLanguageIBTitle').innerHTML = CONST_STR.get('TPBANK_TITLE');
//    document.getElementById('lblChangLanguage').innerHTML = CONST_STR.get('MAIN_SCR_HEADER_TITLE');

    document.getElementById('btnTERMS_KHDN').value = CONST_STR.get('ALERT_BTN_KHDN');
    document.getElementById('btnTERMS_KHCN').value = CONST_STR.get('ALERT_BTN_KHCN');
    document.getElementById('btnINSTR_KHDN').value = CONST_STR.get('ALERT_BTN_KHDN');
    document.getElementById('btnINSTR_KHCN').value = CONST_STR.get('ALERT_BTN_KHCN');
    document.getElementById('btnFAQ_KHDN').value = CONST_STR.get('ALERT_BTN_KHDN');
    document.getElementById('btnFAQ_KHCN').value = CONST_STR.get('ALERT_BTN_KHCN');
    document.getElementById('btnOK_SCHEDULE').value = CONST_STR.get('ALERT_BTN_OK_TITLE_SCHEDULE');
    document.getElementById('btnCANCEL_SCHEDULE').value = CONST_STR.get('ALERT_BTN_CANCEL_TITLE_SCHEDULE');

//    document.getElementById('spanLoginContact').innerHTML = CONST_STR.get('LOGIN_CONTACT');
//    document.getElementById('spanCustomerService').innerHTML = CONST_STR.get('LOGIN_CUSTOMER_SERVICE');
//    document.getElementById('spanLoginBranch').innerHTML = CONST_STR.get('LOGIN_BRANCH');
//    document.getElementById('spanLoginATM').innerHTML = CONST_STR.get('LOGIN_ATM');
//    document.getElementById('spanLoginEmail').innerHTML = CONST_STR.get('LOGIN_EMAIL');
//    document.getElementById('spanLoginChat').innerHTML = CONST_STR.get('LOGIN_CHAT');

    //load btn icon language
    var nodeBtnLang = document.getElementById('btnChangLanguage'); //mb language button
    if (gUserInfo.lang == "EN") {
        nodeBtnLang.innerHTML = "<img src='./assets/images/vietnam.png' onClick='changeLanguageOnIB()' style='width: 30px; vertical-align: baseline !important;'>";
    }
    else {
        gUserInfo.lang = "VN";
        nodeBtnLang.innerHTML = "<img src='./assets/images/english.png' onClick='changeLanguageOnIB()' style='width: 30px; vertical-align: baseline !important;'>";
    }

    var nodeBtnLangIB = document.getElementById('btnChangLanguageIB'); //ib language button
    if (gUserInfo.lang == "EN") {
        nodeBtnLangIB.innerHTML = "<img class='languageEnglishFlag' src='./assets/images/vietnam.png' onClick='changeLanguageOnIB()' style='width: 30px; vertical-align: baseline !important;'>";
    }
    else {
        gUserInfo.lang = "VN";
        nodeBtnLangIB.innerHTML = "<img class='languageEnglishFlag' src='./assets/images/english.png' onClick='changeLanguageOnIB()' style='width: 30px; vertical-align: baseline !important;'>";
    }
}
function changeMenuLogout() {
    var menu_logout = document.getElementById('id.menu_logout.caption');
    if (menu_logout != null) {
        menu_logout.innerHTML = CONST_STR.get('MENU_LOGOUT');
    }
}
//function changeLanguageOnIB(mode) {
function changeLanguageOnIB() {


    if (gUserInfo.lang == "VN") {
        gUserInfo.lang = "EN";
        setLanguageConfig(gUserInfo.lang);
    }
    else {
        gUserInfo.lang = "VN";
        setLanguageConfig(gUserInfo.lang);
    }
    document.getElementById("SlideFooter").innerHTML =  CONST_STR.get('MENU_FAST_REGISTER');
    document.getElementById("SlideFooter1").innerHTML =  CONST_STR.get('QRCODE_SCAN_TITLE');
    document.getElementById("SlideFooter2").innerHTML =  CONST_STR.get('MENU_DEAL');
    document.getElementById("SlideFooter3").innerHTML =  CONST_STR.get('MENU_RATE_INTEREST');
    document.getElementById("SlideFooter4").innerHTML =  CONST_STR.get('MENU_BRANCH_ATM');
    document.getElementById("SlideFooter5").innerHTML =  CONST_STR.get('MENU_UTILITIES_CALCULATOR');
    document.getElementById("SlideFooter6").innerHTML =  CONST_STR.get('MENU_SUPPORT_DETAIL');
	if(gIsLogin){
		changeMenuLanguage();
	}

    //initLanguageOnIB(mode);
    initLanguageOnIB();
    //initFeedback();

    if (gIsLogin) {
        //reset cache
        navController.resetAll();
        //navController.initWithRootView('account/account-scr', true);
        var tmpPageName = navController.getDefaultPage();
        var tmpPageType = navController.getDefaultPageType();
        navController.initWithRootView(tmpPageName, true, tmpPageType);
        navController.resetAll();
    }
    else {
        currentPage = "";
        navController.initWithRootView('login-scr', true);

        //20140911: hien box lien he - begin
        var tmpNodeMain = document.getElementById('mainview');
        tmpNodeMain.style.cssFloat = 'none';
        //20140911: hien box lien he - end
    }
    changeMenuLogout();
}

/*** CHANGE LANGUAGE IN IB VERSION END ***/

/*** VALIDATE FUNCTION ***/

var gConditions = {    "amount":{
    "allow":"[,.0-9]",
    "notallow":"",
    "minlength":"0",
    "maxlength":"18",
    "func":""
},
    "account":{
        "allow":"[0-9]",
        "notallow":"",
        "minlength":"11",
        "maxlength":"11",
        "func":""
    },
    "content":{
        "allow":"[a-zA-Z0-9]",
        "notallow":"",
        "minlength":"0",
        "maxlength":"200",
        "func":""
    },
    "sample":{
        "allow":"[a-zA-Z0-9]",
        "notallow":"",
        "minlength":"0",
        "maxlength":"50",
        "func":""
    }

}

function validateFunc(inValue, inConditions) {
    if (inConditions == undefined || inConditions == null) return;
    if (typeof(inValue) == 'number') inStr = inValue.toString();
    else var inStr = inValue;
    var tmpValidateObj = inConditions;//inConditions[tmpObj]
    for (var tmpObjProperty in tmpValidateObj) {
        //alert(tmpObjProperty);
        var tmpValue = tmpValidateObj[tmpObjProperty];
        if ((tmpValue == undefined) || (tmpValue.length == 0)) continue;
        switch (tmpObjProperty) {
            case "allow":
            {
                var rex = new RegExp(tmpValue, "gi");
                var tmprex = inStr.match(rex);
                if ((tmprex == undefined) || (tmprex.length < 1)) {
                    console.log('allow');
                    return false;
                }
                break;
            }
            case "notallow":
            {
                var rex = new RegExp(tmpValue, "gi");
                var tmprex = inStr.match(rex);
                if ((tmprex == undefined) || (tmprex.length > 0)) {
                    console.log('not allow');
                    return false;
                }
                break;
            }
            case "minlength":
            {
                if (!(inStr.length > (parseInt(tmpValue) - 1))) {
                    console.log('min length fail');
                    return false;
                }
                break;
            }
            case "maxlength":
            {
                if (!(inStr.length < (parseInt(tmpValue) + 1))) {
                    console.log('max length fail');
                    return false;
                }
                break;
            }
            case "func":
            {
                if (tmpValue != undefined) {
                    console.log('call function');
                    if (typeof(tmpValue) == 'function') {
                        if (!tmpValue()) {
                            console.log('condition extent fail');
                            return false;
                        }
                    }
                    else if (typeof(tmpValue) == 'string' && (typeof(window[tmpValue]) == 'function')) {
                        if (!window[tmpValue]()) {
                            console.log('condition extent fail');
                            return false;
                        }
                    }
                    else {
                        console.log('not exist function');
                    }
                }
                break;
            }
            default:
            {
                console.log('do not match property.');
                return false;
                break;
            }
        }
    }
    return true;
}

/*** VALIDATE FUNCTION END ***/

/*** JSON UTILITY ***/

var gProvincesData = new Array();
function getProvincesData() {
    if (gProvincesData && gProvincesData.length > 0) {
        return gProvincesData;
    }
    else {
        var tmpObj = getObjFromJSON(provinces);
        gProvincesData = tmpObj.data;
        return gProvincesData;
    }
}
var gDistrictsData = new Array();
function getDistrictsData() {
    if (gDistrictsData && gDistrictsData.length > 0) {
        return gDistrictsData;
    }
    else {
        var tmpObj = getObjFromJSON(districts);
        gDistrictsData = tmpObj.data;
        return gDistrictsData;
    }
}
var gBranchInterbanksData = new Array();
function getBranchInterbanksData() {
    if (gBranchInterbanksData && gBranchInterbanksData.length > 0) {
        return gBranchInterbanksData;
    }
    else {
        var tmpObj = getObjFromJSON(branchInterbanks);
        gBranchInterbanksData = tmpObj.data;
        return gBranchInterbanksData;
    }
}
var gBranchsData = new Array();
function getBranchsData() {
    if (gBranchsData && gBranchsData.length > 0) {
        return gBranchsData;
    }
    else {
        var tmpObj = getObjFromJSON(branchs);
        gBranchsData = tmpObj.data;
        return gBranchsData;
    }
}
function getObjWithKeyFromData(inStrKey, inStrContent, inArrObjs) {
    if (inArrObjs && (typeof(inStrKey) == 'string') && (typeof(inStrContent) == 'string')) {
        var tmpObj;
        for (var i = 0; i < inArrObjs.length; i++) {
            tmpObj = inArrObjs[i];
            if (tmpObj[inStrKey] == inStrContent) {
                return tmpObj;
            }
        }
    }
    else {
        logInfo('Error input get obj by key from data');
        return null;
    }
}
function getObjFromJSON(inStr) {
    if (typeof(inStr) == 'string') {
        inStr = JSON.stringify(eval('(' + inStr + ')')); //JSON string validate
        return JSON.parse(inStr); //convert to Object
    }
    else if (typeof(inStr) == 'object') {
        return inStr;
    }
    else {
        logInfo('Error parser JSON');
        return null;
    }
}

/*** JSON UTILITY END ***/

/*** PAGE INDICATOR ***/

function genPageIndicatorHtml(inTotalPages, inCurIdx, inMaxBtn, inArrDisable) {

    if (inTotalPages < 2) {
        return '';
    }

    var pageIndicator = '<ul class="pagination">';
    var pageTotal = inTotalPages;//8;
    var pageCurrentIdx = inCurIdx ? inCurIdx : 1; //min is 1
    var maxShowNum = (inMaxBtn && (inMaxBtn != 0)) ? inMaxBtn : 6; //default: 6
    var arrDisable = inArrDisable; //[2];//inArrDisable;

    if (pageTotal < maxShowNum + 1) {
        for (var i = 0; i < pageTotal; i++) {
            if (pageCurrentIdx == i + 1) {
                pageIndicator += '<li class="active"><span>' + (i + 1) + '</span></li>';
            }
            else {
                var tmpStt = false;
                if (arrDisable && arrDisable.length > 0) {
                    for (var j = 0; j < arrDisable.length; j++) {
                        if ((i + 1) == arrDisable[j]) {
                            tmpStt = true;
                            break;
                        }
                    }
                }
                if (tmpStt) {
                    pageIndicator += '<li class="disabled"><span>' + (i + 1) + '</span></li>';
                }
                else {
                    pageIndicator += '<li onClick="selectedPageAtIndex(' + (i + 1) + ', this, ' + pageTotal + ', ' + maxShowNum + ', ' + arrDisable + ');"><span>' + (i + 1) + '</span></li>';
                }
            }
        }
    }
    else {
        if (pageCurrentIdx < 3) {
            for (var i = 0; i < maxShowNum; i++) {
                switch (i) {
                    case (maxShowNum - 1):
                    {
                        var tmpStt = false;
                        if (arrDisable && arrDisable.length > 0) {
                            for (var j = 0; j < arrDisable.length; j++) {
                                if ((pageTotal) == arrDisable[j]) {
                                    tmpStt = true;
                                    break;
                                }
                            }
                        }
                        if (tmpStt) {
                            pageIndicator += '<li class="disabled"><span>' + (pageTotal) + '</span></li>';
                        }
                        else {
                            pageIndicator += '<li onClick="selectedPageAtIndex(' + (pageTotal) + ', this, ' + pageTotal + ', ' + maxShowNum + ', ' + arrDisable + ');"><span>' + pageTotal + '</span></li>';
                        }
                        break;
                    }
                    case (maxShowNum - 2):
                    {
                        var tmpStt = false;
                        if (arrDisable && arrDisable.length > 0) {
                            for (var j = 0; j < arrDisable.length; j++) {
                                if ((pageTotal - 1) == arrDisable[j]) {
                                    tmpStt = true;
                                    break;
                                }
                            }
                        }
                        if (tmpStt) {
                            pageIndicator += '<li class="disabled"><span>' + (pageTotal - 1) + '</span></li>';
                        }
                        else {
                            pageIndicator += '<li onClick="selectedPageAtIndex(' + (pageTotal - 1) + ', this, ' + pageTotal + ', ' + maxShowNum + ', ' + arrDisable + ');"><span>' + (pageTotal - 1) + '</span></li>';
                        }
                        break;
                    }
                    case (maxShowNum - 3):
                    {
                        pageIndicator += '<li><span>...</span></li>';
                        break;
                    }
                    default:
                    {
                        if (pageCurrentIdx == i + 1) {
                            pageIndicator += '<li class="active"><span>' + (i + 1) + '</span></li>';
                        }
                        else {
                            var tmpStt = false;
                            if (arrDisable && arrDisable.length > 0) {
                                for (var j = 0; j < arrDisable.length; j++) {
                                    if ((i + 1) == arrDisable[j]) {
                                        tmpStt = true;
                                        break;
                                    }
                                }
                            }
                            if (tmpStt) {
                                pageIndicator += '<li class="disabled"><span>' + (i + 1) + '</span></li>';
                            }
                            else {
                                pageIndicator += '<li onClick="selectedPageAtIndex(' + (i + 1) + ', this, ' + pageTotal + ', ' + maxShowNum + ', ' + arrDisable + ');"><span>' + (i + 1) + '</span></li>';
                            }
                        }
                        break;
                    }
                }
            }
        }
        else if (pageCurrentIdx > pageTotal - 2) {
            for (var i = 0; i < maxShowNum; i++) {
                switch (i) {
                    case 0:
                    case 1:
                    {
                        var tmpStt = false;
                        if (arrDisable && arrDisable.length > 0) {
                            for (var j = 0; j < arrDisable.length; j++) {
                                if ((i + 1) == arrDisable[j]) {
                                    tmpStt = true;
                                    break;
                                }
                            }
                        }
                        if (tmpStt) {
                            pageIndicator += '<li class="disabled"><span>' + (i + 1) + '</span></li>';
                        }
                        else {
                            pageIndicator += '<li onClick="selectedPageAtIndex(' + (i + 1) + ', this, ' + pageTotal + ', ' + maxShowNum + ', ' + arrDisable + ');"><span>' + (i + 1) + '</span></li>';
                        }
                        break;
                    }
                    case 2:
                    {
                        pageIndicator += '<li><span>...</span></li>';
                        break;
                    }
                    default:
                    {
                        if (pageCurrentIdx == (pageTotal - maxShowNum + i + 1)) {
                            pageIndicator += '<li class="active"><span>' + (pageTotal - maxShowNum + i + 1) + '</span></li>';
                        }
                        else {
                            var tmpStt = false;
                            if (arrDisable && arrDisable.length > 0) {
                                for (var j = 0; j < arrDisable.length; j++) {
                                    if ((pageTotal - maxShowNum + i + 1) == arrDisable[j]) {
                                        tmpStt = true;
                                        break;
                                    }
                                }
                            }
                            if (tmpStt) {
                                pageIndicator += '<li class="disabled"><span>' + (pageTotal - maxShowNum + i + 1) + '</span></li>';
                            }
                            else {
                                pageIndicator += '<li onClick="selectedPageAtIndex(' + (pageTotal - maxShowNum + i + 1) + ', this, ' + pageTotal + ', ' + maxShowNum + ', ' + arrDisable + ');"><span>' + (pageTotal - maxShowNum + i + 1) + '</span></li>';
                            }
                        }
                        break;
                    }
                }
            }
        }
        else {
            var mid = parseInt(maxShowNum / 2);
            for (var i = 0; i < maxShowNum + 1; i++) { //1: is second three-dots
                switch (i) {
                    case 0:
                    {
                        var tmpStt = false;
                        if (arrDisable && arrDisable.length > 0) {
                            for (var j = 0; j < arrDisable.length; j++) {
                                if ((i + 1) == arrDisable[j]) {
                                    tmpStt = true;
                                    break;
                                }
                            }
                        }
                        if (tmpStt) {
                            pageIndicator += '<li class="disabled"><span>' + (i + 1) + '</span></li>';
                        }
                        else {
                            pageIndicator += '<li onClick="selectedPageAtIndex(' + (i + 1) + ', this, ' + pageTotal + ', ' + maxShowNum + ', ' + arrDisable + ');"><span>' + (i + 1) + '</span></li>';
                        }
                        break;
                    }
                    case 1:
                    {
                        if (pageCurrentIdx != 3) {
                            pageIndicator += '<li><span>...</span></li>';
                        }
                        break;
                    }
                    case (maxShowNum):
                    {
                        var tmpStt = false;
                        if (arrDisable && arrDisable.length > 0) {
                            for (var j = 0; j < arrDisable.length; j++) {
                                if ((pageTotal) == arrDisable[j]) {
                                    tmpStt = true;
                                    break;
                                }
                            }
                        }
                        if (tmpStt) {
                            pageIndicator += '<li class="disabled"><span>' + (pageTotal) + '</span></li>';
                        }
                        else {
                            pageIndicator += '<li onClick="selectedPageAtIndex(' + (pageTotal) + ', this, ' + pageTotal + ', ' + maxShowNum + ', ' + arrDisable + ');"><span>' + pageTotal + '</span></li>';
                        }
                        break;
                    }
                    case (maxShowNum - 1):
                    {
                        if (pageCurrentIdx != pageTotal - 2) {
                            pageIndicator += '<li><span>...</span></li>';
                        }
                        break;
                    }
                    default:
                    {
                        if (pageCurrentIdx == (pageCurrentIdx + i - mid)) {
                            pageIndicator += '<li class="active"><span>' + (pageCurrentIdx + i - mid) + '</span></li>';
                        }
                        else {
                            var tmpStt = false;
                            if (arrDisable && arrDisable.length > 0) {
                                for (var j = 0; j < arrDisable.length; j++) {
                                    if ((pageCurrentIdx + i - mid) == arrDisable[j]) {
                                        tmpStt = true;
                                        break;
                                    }
                                }
                            }
                            if (tmpStt) {
                                pageIndicator += '<li class="disabled"><span>' + (pageCurrentIdx + i - mid) + '</span></li>';
                            }
                            else {
                                pageIndicator += '<li onClick="selectedPageAtIndex(' + (pageCurrentIdx + i - mid) + ', this, ' + pageTotal + ', ' + maxShowNum + ', ' + arrDisable + ');"><span>' + (pageCurrentIdx + i - mid) + '</span></li>';
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    pageIndicator += '</ul>';
    return pageIndicator;
}

function selectedPageAtIndex(idx, inNode, inTotalPage, inMaxNum, inArrDisable) {
    isNotNeedReloadPageStyleSheet = true;
    fadeOutMainContentScreen();
    setTimeout(function () {
        logInfo('page index = ' + idx);
        var nodePager1 = inNode.parentNode.parentNode;
        var tmpStr = genPageIndicatorHtml(inTotalPage, idx, inMaxNum, inArrDisable);
        nodePager1.innerHTML = tmpStr;
        if (typeof(window['pageIndicatorSelected']) == 'function') {
            window['pageIndicatorSelected'](idx, nodePager1);
        }
    }, 500);
    fadeInMainContentScreen();
}

/*** PAGE INDICATOR END ***/

/*** PRINT ***/

function printNodeWithAll(inNode) {
    //Save old page
    var oldPage = document.body.innerHTML;

    var printContainer = document.createElement("div");
    printContainer.setAttribute("style", "sytle='padding-top:10px;'");
    printContainer.innerHTML = inNode.innerHTML;

    var linkStyle1 = document.createElement("link");
    linkStyle1.setAttribute("rel", "stylesheet");
    linkStyle1.setAttribute("type", "text/css");
    linkStyle1.setAttribute("href", "css/style.css");
    printContainer.appendChild(linkStyle1);
    var linkStyle2 = document.createElement("link");
    linkStyle2.setAttribute("rel", "stylesheet");
    linkStyle2.setAttribute("type", "text/css");
    linkStyle2.setAttribute("href", "css/ebankstyle.css");
    printContainer.appendChild(linkStyle2);

    /*var pri = document.getElementById("ifmcontentstoprint").contentWindow;
     pri.document.open();
     pri.document.write(printContainer.innerHTML);
     pri.document.close();
     pri.focus();
     //pri.scroll(0,0);
     pri.print();*/
    document.body.innerHTML =
        "<html><head><title></title></head><body>" +
            printContainer.innerHTML + "</body>";
    setTimeout(function () {
        //Print Page
        window.print();

        //Restore orignal HTML
        document.body.innerHTML = oldPage;
    }, 300);

}

/*** PRINT END ***/







/*** EXT ***/

//TuanNQ1.FSoft
//Pervent on paste function
// Register onpaste on inputs and textareas in browsers that don't
// natively support it.
/*(function () {
 var onload = window.onload;

 window.onload = function () {
 if (typeof onload == "function") {
 onload.apply(this, arguments);
 }

 var fields = [];
 var inputs = document.getElementsByTagName("input");
 var textareas = document.getElementsByTagName("textarea");

 for (var i = 0; i < inputs.length; i++) {
 fields.push(inputs[i]);
 }

 for (var i = 0; i < textareas.length; i++) {
 fields.push(textareas[i]);
 }

 for (var i = 0; i < fields.length; i++) {
 var field = fields[i];

 if (typeof field.onpaste != "function" && !!field.getAttribute("onpaste")) {
 field.onpaste = eval("(function () { " + field.getAttribute("onpaste") + " })");
 }

 if (typeof field.onpaste == "function") {
 var oninput = field.oninput;

 field.oninput = function () {
 if (typeof oninput == "function") {
 oninput.apply(this, arguments);
 }

 if (typeof this.previousValue == "undefined") {
 this.previousValue = this.value;
 }

 var pasted = (Math.abs(this.previousValue.length - this.value.length) > 1 && this.value != "");

 if (pasted && !this.onpaste.apply(this, arguments)) {
 this.value = this.previousValue;
 }

 this.previousValue = this.value;
 };

 if (field.addEventListener) {
 field.addEventListener("input", field.oninput, false);
 } else if (field.attachEvent) {
 field.attachEvent("oninput", field.oninput);
 }
 }
 }
 }
 })();*/

//TuanNQ1.FSoft
// replace the 'n'th character of 's' with 't'
function replaceAt(s, n, t) {
    return s.substring(0, n) + t + s.substring(n + 1);
}

//TuanNQ1.FSoft
//global variables of calendar
var carretPos;
var newDayStr;
var newMonthStr;
var newYearStr;
var minYear = 1900;
var maxYear = 2100;

//TuanNQ1.FSoft
//handle calendar using navigation (arrow keys, delete key), and numberic keys
//dd/mm/yyyy
function handleCalendarNav(tbx, e) {
    var keynum;
    carretPos = carretPos == undefined ? 0 : carretPos;
    var day;
    var month;
    var year;
    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    if (tbx.value.length == 0) {
        tbx.value = "dd/mm/yyyy";
    }

    if (tbx.value.length > 0) {
        var tmpArr = tbx.value.split('/');
        tmpArr[0] = tmpArr[0] == "dd" ? "1" : tmpArr[0];
        day = Number(tmpArr[0]);
        tmpArr[1] = tmpArr[1] == "mm" ? "1" : tmpArr[1];
        month = Number(tmpArr[1]);
        tmpArr[2] = tmpArr[2] == "yyyy" ? minYear + "" : tmpArr[2];
        year = Number(tmpArr[2]);

        // Adjust for leap years
        if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
            monthLength[1] = 29;
        } else {
            monthLength[1] = 28;
        }
    }

    if (e.type == "click") {
        carretPos = 0;
        setSelection(tbx, 0, 0);
        newDayStr = "";
        newMonthStr = "";
        newYearStr = "";
        return;
    }

    if (window.event) { // IE
        keynum = e.keyCode;
    } else if (e.which) { // Netscape/Firefox/Opera
        keynum = e.which;
    }
//	logInfo(keynum);
    if (keynum == 9) {
        return true;
    }
    if (keynum != 8 && keynum != 32 && keynum != 37 && keynum != 38 && keynum != 39 && keynum != 40 && (keynum < 48 || (keynum > 57 && keynum < 96) || keynum > 105)) {
        return false;
    }

    //HANDLE NAVIGATION KEY

    //left
    if (keynum == 37) {
        if (carretPos == 6) {
            newMonthStr = "";
            setSelection(tbx, 3, 5);
        } else if (carretPos == 3) {
            newDayStr = "";
            setSelection(tbx, 0, 2);
        }
        return false;
        //up
    } else if (keynum == 38) {

        //dd
        if (carretPos == 0) {
            // Check the range of the day
            if (day < monthLength[month - 1]) {
                day++;
                tbx.value = day < 10 ? "0" + day + "/" : day + "/";
                tbx.value += month < 10 ? "0" + month + "/" + year : month + "/" + year;
            }
            setSelection(tbx, 0, 2);
            //mm
        } else if (carretPos == 3) {
            // Check the range of the month
            if (month < 12) {
                month++;

                if (day > monthLength[month - 1]) {
                    day = monthLength[month - 1];
                }

                tbx.value = day < 10 ? "0" + day + "/" : day + "/";
                tbx.value += month < 10 ? "0" + month + "/" + year : month + "/" + year;
            }
            setSelection(tbx, 3, 5);
            //yyyy
        } else if (carretPos == 6) {
            // Check the range of the year
            if (year < maxYear) {
                year++;

                // Adjust for leap years
                if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
                    monthLength[1] = 29;
                } else {
                    monthLength[1] = 28;
                }

                if (day > monthLength[month - 1]) {
                    day = monthLength[month - 1];
                }

                tbx.value = day < 10 ? "0" + day + "/" : day + "/";
                tbx.value += month < 10 ? "0" + month + "/" + year : month + "/" + year;
            }
            setSelection(tbx, 6, 10);
        }
        return false;
        //right and space
    } else if (keynum == 39 || keynum == 32) {
        if (carretPos == 3) {
            newYearStr = "";
            setSelection(tbx, 6, 10);
        } else if (carretPos == 0) {
            newMonthStr = "";
            setSelection(tbx, 3, 5);
        }
        return false;
        //down
    } else if (keynum == 40) {

        //dd
        if (carretPos == 0) {
            // Check the range of the day
            if (day > 1) {
                day--;
                tbx.value = day < 10 ? "0" + day + "/" : day + "/";
                tbx.value += month < 10 ? "0" + month + "/" + year : month + "/" + year;
            }
            setSelection(tbx, 0, 2);
            //mm
        } else if (carretPos == 3) {
            // Check the range of the month
            if (month > 1) {
                month--;

                if (day > monthLength[month - 1]) {
                    day = monthLength[month - 1];
                }

                tbx.value = day < 10 ? "0" + day + "/" : day + "/";
                tbx.value += month < 10 ? "0" + month + "/" + year : month + "/" + year;
            }
            setSelection(tbx, 3, 5);
            //yyyy
        } else if (carretPos == 6) {
            // Check the range of the year
            if (year > minYear) {
                year--;

                // Adjust for leap years
                if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
                    monthLength[1] = 29;
                } else {
                    monthLength[1] = 28;
                }

                if (day > monthLength[month - 1]) {
                    day = monthLength[month - 1];
                }
                tbx.value = day < 10 ? "0" + day + "/" : day + "/";
                tbx.value += month < 10 ? "0" + month + "/" + year : month + "/" + year;
            }
            setSelection(tbx, 6, 10);
        }
        return false;
    }

    //HANDLE NUMBERIC KEY and DELETE KEY
    if (keynum == 8 || (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105)) {


        if (keynum == 8) {
            e.preventDefault();
            e.stopPropagation();
        }

        var tmpDate = tbx.value;
        var oriDate = tmpDate;
        var newDay, newMonth, newYear;
        keynum = keynum > 57 ? keynum - 48 : keynum;

        //dd
        if (carretPos == 0) {

            //delete key
            if (keynum == 8) {
                tmpDate = replaceAt(tmpDate, 0, "d");
                tmpDate = replaceAt(tmpDate, 1, "d");
                tbx.value = tmpDate;
                newDayStr = "";
                setSelection(tbx, 0, 2);
                return;
            }

            if (newDayStr.length == 0 || newDayStr.length >= 2) {
                newDayStr = String.fromCharCode(keynum);
                newDay = Number(newDayStr);
            } else {
                newDayStr += String.fromCharCode(keynum);
                newDay = Number(newDayStr);
            }

            // Check the range of the day
            if (newDay >= 1 && newDay <= monthLength[month - 1]) {
                tbx.value = newDay < 10 ? "0" + newDay + "/" : newDay + "/";
                tbx.value += month < 10 ? "0" + month + "/" : month + "/";
                if (year < 10) {
                    tbx.value += "000" + year;
                } else if (year < 100) {
                    tbx.value += "00" + year;
                } else if (year < 1000) {
                    tbx.value += "0" + year;
                } else {
                    tbx.value += year;
                }

                if ((newDayStr.length == 1 && newDay > 3) ||
                    (newDayStr.length == 2)) {
                    carretPos = 3;
                }
            } else {
                if (keynum != 48 && keynum != 96) {
                    e.preventDefault();
                    e.stopPropagation();
                    newDayStr = "";
                }
                else {
                    newDayStr = "0";
                }
                //newDayStr = newDayStr.length == 2 ? newDayStr.charAt(1) : "";
                carretPos = 0;
                tbx.value = oriDate;
            }
            if (carretPos == 3) {
                setSelection(tbx, 3, 5);
            } else {
                setSelection(tbx, 0, 0);
            }
            //mm
        } else if (carretPos == 3) {

            //delete key
            if (keynum == 8) {
                if (tmpDate.substring(3, 5) == "mm") {
                    tmpDate = replaceAt(tmpDate, 0, "d");
                    tmpDate = replaceAt(tmpDate, 1, "d");
                    tbx.value = tmpDate;
                    newDayStr = "";
                    carretPos = 0;
                    setSelection(tbx, 0, 2);
                    return;
                } else {
                    tmpDate = replaceAt(tmpDate, 3, "m");
                    tmpDate = replaceAt(tmpDate, 4, "m");
                    tbx.value = tmpDate;
                    newMonthStr = "";
                    setSelection(tbx, 3, 5);
                    return;
                }
            }

            if (newMonthStr.length == 0 || newMonthStr.length >= 2) {
                newMonthStr = String.fromCharCode(keynum);
                newMonth = Number(newMonthStr);
            } else {
                newMonthStr += String.fromCharCode(keynum);
                newMonth = Number(newMonthStr);
            }

            // Check the range of the month
            if (newMonth >= 1 && newMonth <= 12) {

                if (day > monthLength[newMonth - 1]) {
                    day = monthLength[newMonth - 1];
                }

                tbx.value = day < 10 ? "0" + day + "/" : day + "/";
                tbx.value += newMonth < 10 ? "0" + newMonth + "/" : newMonth + "/";
                if (year < 10) {
                    tbx.value += "000" + year;
                } else if (year < 100) {
                    tbx.value += "00" + year;
                } else if (year < 1000) {
                    tbx.value += "0" + year;
                } else {
                    tbx.value += year;
                }

                if ((newMonthStr.length == 1 && newMonth > 1) || (newMonthStr.length == 2)) {
                    carretPos = 6;
                }
            } else {
                if (keynum != 48 && keynum != 96) {
                    e.preventDefault();
                    e.stopPropagation();
                    newMonthStr = "";
                } else {
                    newMonthStr = "0";
                }

                //newMonthStr = newMonthStr.length == 2 ? newMonthStr.charAt(1) : "";

                carretPos = 3;
                tbx.value = oriDate;
            }
            if (carretPos == 6) {
                setSelection(tbx, 6, 10);
            } else {
                setSelection(tbx, 3, 5);
            }
            //yyyy
        } else if (carretPos == 6) {

            //delete key
            if (keynum == 8) {
                if (tmpDate.substring(6, 10) == "yyyy") {
                    tmpDate = replaceAt(tmpDate, 3, "m");
                    tmpDate = replaceAt(tmpDate, 4, "m");
                    tbx.value = tmpDate;
                    newMonthStr = "";
                    carretPos = 3;
                    setSelection(tbx, 3, 5);
                    return;
                } else {
                    tmpDate = replaceAt(tmpDate, 6, "y");
                    tmpDate = replaceAt(tmpDate, 7, "y");
                    tmpDate = replaceAt(tmpDate, 8, "y");
                    tmpDate = replaceAt(tmpDate, 9, "y");
                    tbx.value = tmpDate;
                    newYearStr = "";
                    setSelection(tbx, 6, 10);
                    return;
                }
            }

            if (newYearStr.length == 0 || newYearStr.length >= 4) {
                newYearStr = String.fromCharCode(keynum);
                newYear = Number(newYearStr);
            } else {
                newYearStr += String.fromCharCode(keynum);
                newYear = Number(newYearStr);
            }

            // Check the range of the year
            if (newYear >= 1 && newYear <= maxYear) {

                // Adjust for leap years
                if (newYear % 400 == 0 || (newYear % 100 != 0 && newYear % 4 == 0)) {
                    monthLength[1] = 29;
                } else {
                    monthLength[1] = 28;
                }

                if (day > monthLength[month - 1]) {
                    day = monthLength[month - 1];
                }

                tbx.value = day < 10 ? "0" + day + "/" : day + "/";
                tbx.value += month < 10 ? "0" + month + "/" : month + "/";
                if (newYear < 10) {
                    tbx.value += "000" + newYear;
                } else if (newYear < 100) {
                    tbx.value += "00" + newYear;
                } else if (newYear < 1000) {
                    tbx.value += "0" + newYear;
                } else {
                    tbx.value += newYear;
                }
                carretPos = 6;
            } else {
                e.preventDefault();
                e.stopPropagation();
                newYearStr = newYearStr.length == 4 ? "" : newYearStr;
                //newYearStr = "";
                carretPos = 6;
                tbx.value = oriDate;
            }
            setSelection(tbx, 6, 10);
        }

        return false;
    }
}

//TuanNQ1.FSoft
// Validates that the input string is a valid date formatted as "dd/mm/yyyy"
function isValidDate(dateString) {
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < minYear || year > maxYear || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}
;

//TuanNQ1.FSoft
//set selection in textbox
function setSelection(elem, start, end) {
    if (elem != null) {
        carretPos = start;
        elem.focus();
        elem.setSelectionRange(start, end);
    }
}

function getDiffDaysBetween(inStart, inEnd, inType) {
    var date1 = (typeof(inStart) == 'string') ? getDateFromString(inStart, inType) : inStart;
    var date2 = (typeof(inEnd) == 'string') ? getDateFromString(inEnd, inType) : inEnd;
    var timeDiff = date2.getTime() - date1.getTime();//Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
}

function getDateFromString(inStr, inType) {
    var dt;
    if (inType == 'dd/MM/yyyy') {
        var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
        dt = new Date(inStr.replace(pattern, '$2/$1/$3'));
    }
    else if (inType == 'MM/dd/yyyy') {
        var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
        dt = new Date(inStr.replace(pattern, '$1/$2/$3'));
    }
    else {
        logInfo('Not support this type: ' + inType);
    }
    return dt;
}

function getStringFromDate(inDate) { //output format dd/MM/yyyy
    var td = new Date();
    var d = td.getDate();
    var m = td.getMonth() + 1;
    var y = td.getFullYear();
    d = (d < 10) ? '0' + d : d;
    m = (m < 10) ? '0' + m : m;
    return d + '/' + m + '/' + y;
}

// sort
var sort_by = function (field, reverse, primer) {

    var key = primer ?
        function (x) {
            return primer(x[field])
        } :
        function (x) {
            return x[field]
        };

    reverse = [-1, 1][+!!reverse];

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}

/*** EXT END ***/

/*** IN-APP BROWSER ***/

function openLinkInWindows(inUrl, inType, startFunc, stopFunc, errFunc, exitFunc) {
    //alert('download');
    /*if(inUrl.indexOf('../') == 0) {
     inUrl = CONST_WEB_URL_LINK + inUrl.substr(3, inUrl.length);
     }
     else if(inUrl.indexOf('./') == 0) {
     inUrl = CONST_WEB_URL_LINK + inUrl.substr(2, inUrl.length);
     }
     else if(inUrl.indexOf('/') == 0) {
     inUrl = CONST_WEB_URL_LINK + inUrl.substr(1, inUrl.length);
     }*/
    CONST_WEB_URL_LINK = CONST_WEB_URL_LINK.substring(0,CONST_WEB_URL_LINK.length-1); //remove lastIndexOf '/'
    var to = CONST_WEB_URL_LINK.lastIndexOf('/');
    CONST_WEB_URL_LINK = CONST_WEB_URL_LINK.substring(0,to);
    if (loadedPGlib) { //only using on app

        //fix for app.
        if (inUrl.indexOf('../') == 0) {
            inUrl = CONST_WEB_URL_LINK + inUrl.substr(3, inUrl.length);
        }
        else if (inUrl.indexOf('./') == 0) {
            inUrl = CONST_WEB_URL_LINK + inUrl.substr(2, inUrl.length);
        }
        else if (inUrl.indexOf('/') == 0) {
            inUrl = CONST_WEB_URL_LINK + inUrl.substr(1, inUrl.length);
        }

        /*
         inType:
         _self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
         _blank: Opens in the InAppBrowser.
         _system: Opens in the system's web browser.
         */
        if (!inUrl) {
            logInfo('NOT HAVE INPUT LINK');
            return;
        }
        if (!inType || inType == '')
            inType = '_blank';
        //  if(Environment.isAndroid()){
        //      if(inUrl.indexOf("docs.google.com") !== -1){
        //          inUrl = inUrl;
        //      }else if(inUrl.indexOf('.pdf') !== -1 || inUrl.indexOf('.PDF') !== -1){
        //         inUrl = "http://docs.google.com/viewer?url=" + inUrl;
        //      }else{
        //          inUrl = inUrl;
        //      }
        //  }

        var ref = window.open(inUrl, inType, 'location=yes');
        ref.addEventListener('loadstart', function (event) {
            logInfo('open link start: ' + event.url);
            if (typeof(startFunc) == 'function') {
                startFunc();
            }
        });
        ref.addEventListener('loadstop', function (event) {
            logInfo('open link stop: ' + event.url);
            if (typeof(stopFunc) == 'function') {
                stopFunc();
            }
        });
        ref.addEventListener('loaderror', function (event) {
            logInfo('open link error ' + inUrl + ': ' + event.message);
            if (typeof(errFunc) == 'function') {
                errFunc();
            }
        });
        ref.addEventListener('exit', function (event) {
            logInfo('exit open link' + inUrl + ': ' + event.type);
            if (typeof(exitFunc) == 'function') {
                exitFunc();
            }
        });
    }
    else {
        if (inUrl.indexOf('../') == 0) {
            inUrl = CONST_WEB_URL_LINK + inUrl.substr(3, inUrl.length);
        }
        else if (inUrl.indexOf('./') == 0) {
            inUrl = CONST_WEB_URL_LINK + inUrl.substr(2, inUrl.length);
        }
        else if (inUrl.indexOf('/') == 0) {
            inUrl = CONST_WEB_URL_LINK + inUrl.substr(1, inUrl.length);
        }


        var tmpANode = document.getElementById('atag-opentab');
        if (Environment.isAndroid()) {

            window.open(inUrl); //fix được với Android
        }
        else if (tmpANode) {
            tmpANode.setAttribute('href', inUrl);
            tmpANode.setAttribute('target', '_blank');
            tmpANode.click();
        }
        else {
            tmpANode = document.createElement('a');
            tmpANode.setAttribute('href', inUrl);
            tmpANode.setAttribute('target', '_blank');
            tmpANode.setAttribute('id', 'atag-opentab');
            document.body.appendChild(tmpANode);
            tmpANode.click();
        }
    }
}

/*** IN-APP BROWSER END ***/

/*** SEND FEEDBACK ***/

var dataURLFeedback;
var isFeedbackOpened = false;
function Html2Canvas(inNode) {
//initFeedback();
    if (!isFeedbackOpened) {
        document.getElementById('btnFeedback').style.display = 'none';
        //inNode.style.display = 'none';
        html2canvas(document.body, {
            onrendered:function (canvas) {
                // canvas is the final rendered <canvas> element
                dataURLFeedback = canvas.toDataURL();
                navController.pushToView('accessory/feedback', true, 'xsl');
                isFeedbackOpened = true;
            }
        });
    } else {
        isFeedbackOpened = false;
        navController.popView(true);
    }
}

/*** SEND FEEDBACK END ***/


/*** CUSTOMIZE MENU ***/
function genMenuSection() {
    var menuContentList = document.createElement('ul');
    menuContentList.setAttribute('id', 'menu.slideview');
    menuContentList.setAttribute('class', 'menu-layout-contents');
    menuContentList.style.listStyleType = 'none';
    for (var k = 0; k < gMenuUserOrder.length; k++) {
        for (var i = 0; i < gMenuList.length; i++) {
            var tmpMenuObj = gMenuList[i];

            if (tmpMenuObj.menuID.length > 0 && tmpMenuObj.parentMenuID == "0" && gMenuUserOrder[k] == tmpMenuObj.menuID) {
                var tmpModuleNode = document.createElement('li');
                tmpModuleNode.setAttribute('id', tmpMenuObj.menuID);
                tmpModuleNode.setAttribute('class','menu-style-li');
                var tmpModuleDiv = document.createElement('div');
                tmpModuleDiv.setAttribute('id','menuStyle_' + k);
				//tmpModuleDiv.setAttribute('id', tmpMenuObj.path);//lapnv cmt
                tmpModuleDiv.setAttribute('class','newClassMenu');

                if (gUserInfo.userRole.indexOf('CorpAuth') != -1){
                    if(tmpMenuObj.menuID=='30')
                    {
                        tmpModuleDiv.setAttribute('onClick', tmpMenuObj.onClick+"MenuHome('" + tmpMenuObj.menuID + "','textMenu_"+k+"')");
                    }
                    else
                    {
                        tmpModuleDiv.setAttribute('onClick', tmpMenuObj.onClick + ";setTitleBar('" + CONST_STR.get(tmpMenuObj.keyLang) + "');");
                    }
                }else {
                    if(tmpMenuObj.menuID=='30')
                    {
                        tmpModuleDiv.setAttribute('onClick', tmpMenuObj.onClick+"MenuHome('" + tmpMenuObj.menuID + "','textMenu_"+k+"')");
                    }
                    else
                    {
                        tmpModuleDiv.setAttribute('onClick', "initMenuDetail('" + tmpMenuObj.menuID + "');setTitleBar('" + CONST_STR.get(tmpMenuObj.keyLang) + "');MenuHome('" + tmpMenuObj.menuID + "','textMenu_"+k+"')");
                    }
                }


                tmpModuleNode.appendChild(tmpModuleDiv);
                var tmpModuleEm = document.createElement('em');
                tmpModuleEm.setAttribute('class', tmpMenuObj.iconCode);
                tmpModuleDiv.appendChild(tmpModuleEm);
                var tmpModuleDivLang = document.createElement('div');
                tmpModuleDivLang.setAttribute('id','textMenu_' + k);
                tmpModuleDivLang.setAttribute('class', 'langNoStyle');
                //tmpModuleDivLang.style.fontWeight = 'bold';
                tmpModuleDivLang.innerHTML = tmpMenuObj.keyLang;
                tmpModuleDiv.appendChild(tmpModuleDivLang);
                var tmpModuleSpan = document.createElement('span');
                tmpModuleSpan.innerHTML = '1';
                tmpModuleDiv.appendChild(tmpModuleSpan);

                if (tmpMenuObj.imgHighlight && tmpMenuObj.imgHighlight.length > 0) {
                    var tmpModuleImg = document.createElement('img');
                    tmpModuleImg.setAttribute('src', tmpMenuObj.imgHighlight);
                    tmpModuleImg.width = '30';
                    tmpModuleImg.height = '25';
                    tmpModuleDiv.appendChild(tmpModuleImg);
                }
                var childNodeStatus = false;
                for (var j = 0; j < gMenuList.length; j++) {
                    var tmpChildMenu = gMenuList[j];
                    if (tmpChildMenu.parentMenuID != "0" && tmpChildMenu.parentMenuID == tmpMenuObj.menuID) {
                        childNodeStatus = true;
                        break;
                    }
                }

                /*if (childNodeStatus) {
                 var tmpChildMenu = document.createElement('ul');
                 tmpChildMenu.setAttribute('class', 'menu-layout-contents-sub');
                 tmpModuleNode.appendChild(tmpChildMenu);

                 var tmpChildDiv = document.createElement('div');
                 tmpChildDiv.setAttribute('id', 'wrapper_' + tmpMenuObj.menuID);
                 tmpChildDiv.setAttribute('class', 'wrapper');
                 tmpChildMenu.appendChild(tmpChildDiv);

                 var tmpChildScrollDiv = document.createElement('div');
                 tmpChildDiv.appendChild(tmpChildScrollDiv);

                 for (var j = 0; j < gMenuList.length; j++) {
                 var tmpChildMenuObj = gMenuList[j];
                 if (tmpChildMenuObj.parentMenuID.length > 0 && tmpChildMenuObj.parentMenuID == tmpMenuObj.menuID && tmpChildMenuObj.hiddenStatus == 'N') {
                 var tmpFuncLi = document.createElement('li');
                 tmpFuncLi.setAttribute('id', tmpChildMenuObj.menuID);
                 //tmpFuncLi.setAttribute('style', 'while-space:pre-wrap;width:90%;');
                 tmpChildScrollDiv.appendChild(tmpFuncLi);
                 var tmpFuncDiv = document.createElement('div');
                 tmpFuncDiv.setAttribute('onClick', tmpChildMenuObj.onClick);
                 tmpFuncDiv.setAttribute('id', tmpChildMenuObj.path);
                 tmpFuncLi.appendChild(tmpFuncDiv);

                 var tmpFuncEm = document.createElement('em');
                 tmpFuncEm.setAttribute('class', tmpChildMenuObj.iconCode);
                 tmpFuncDiv.appendChild(tmpFuncEm);
                 var tmpFuncDivLang = document.createElement('div');
                 tmpFuncDivLang.setAttribute('class', 'langNoStyle');
                 tmpFuncDivLang.innerHTML = tmpChildMenuObj.keyLang;
                 tmpFuncDiv.appendChild(tmpFuncDivLang);
                 var tmpFuncSpan = document.createElement('span');
                 *//*if(tmpChildMenuObj.parentMenuID =='transfer'&&tmpChildMenuObj.keyLang=='MENU_VIEW_FUNDSTRANSFER' ){
                 tmpFuncSpan.setAttribute('class','icon-help icon-helpstyle');
                 tmpFuncSpan.setAttribute('onClick','show_hint(event, "QUICK_TIP_VIEW_FUNDTRANFER");');
                 tmpFuncSpan.style.display ='block';
                 }
                 if(tmpChildMenuObj.parentMenuID =='transfer'&&tmpChildMenuObj.keyLang=='MENU_LIST_BENEFIC' ){
                 tmpFuncSpan.setAttribute('class','icon-help icon-helpstyle');
                 tmpFuncSpan.setAttribute('onClick','show_hint(event, "QUICK_TIP_BENEFIC_LIST");');
                 tmpFuncSpan.style.display ='block';
                 }
                 if(tmpChildMenuObj.parentMenuID =='jumboAcc'&&tmpChildMenuObj.keyLang=='JUMBO_AUTO_SAVINGS_TITLE' ){
                 tmpFuncSpan.setAttribute('class','icon-help icon-helpstyle');
                 tmpFuncSpan.setAttribute('onClick','show_hint(event, "QUICK_TIP_AUTO_SAVING");');
                 tmpFuncSpan.style.display ='block';

                 }
                 if(tmpChildMenuObj.parentMenuID =='mLoan'&&tmpChildMenuObj.keyLang=='LOAN_MENU_PARENT' ){
                 tmpFuncSpan.setAttribute('class','icon-help icon-helpstyle');
                 tmpFuncSpan.setAttribute('onClick','show_hint(event, "QUICK_TIP_LOAN_SAVING");');
                 tmpFuncSpan.style.display ='block';
                 }
                 if(tmpChildMenuObj.parentMenuID =='cardservice'&&tmpChildMenuObj.keyLang=='MENU_CARD_ADVANCE' ){
                 tmpFuncSpan.setAttribute('class','icon-help icon-helpstyle');
                 tmpFuncSpan.setAttribute('onClick','show_hint(event, "QUICK_TIP_CARD_ADVANCE");');
                 tmpFuncSpan.style.display ='block';
                 }
                 if(tmpChildMenuObj.parentMenuID =='setting'&&tmpChildMenuObj.keyLang=='CUSTOMIZE_MENU_TITLE' ){
                 tmpFuncSpan.setAttribute('class','icon-help icon-helpstyle');
                 tmpFuncSpan.setAttribute('onClick','show_hint(event, "QUICK_TIP_CUSTOMIZE_MENU");');
                 tmpFuncSpan.style.display ='block';
                 }*//*


                 tmpFuncDiv.appendChild(tmpFuncSpan);
                 if (tmpChildMenuObj.imgHighlight && tmpChildMenuObj.imgHighlight.length > 0) {
                 var tmpFuncImg = document.createElement('img');
                 tmpFuncImg.setAttribute('src', tmpChildMenuObj.imgHighlight);
                 tmpFuncImg.width = '30';
                 tmpFuncImg.height = '25';
                 tmpFuncDiv.appendChild(tmpFuncImg);
                 }
                 }
                 }
                 }*/
                logInfo('Module li: ' + tmpModuleNode);
                menuContentList.appendChild(tmpModuleNode);
            }
        }
    }

    //logInfo('Menu section: ' + menuContentList.innerHTML);
    //var gMenuRawData = document.createElement('div');
    // add quick change menu style default
    //Tucvv add menu Thoát
    var liLogout=document.createElement('li');
    liLogout.setAttribute('id','logout_link');
    liLogout.setAttribute('class','desktop-mode');
    liLogout.setAttribute('onClick','logoutExit()');
//    liLogout.style.marginBottom='10px';
    var logoutEm = document.createElement('em');
    logoutEm.setAttribute('class', 'icon-logout');
    var logoutDiv = document.createElement('div');
    var logoutDiv1 = document.createElement('div');
    logoutDiv1.setAttribute('class', 'langNoStyle');
    logoutDiv1.innerHTML = 'MENU_LOGOUT';
    logoutDiv.appendChild(logoutEm);
    logoutDiv.appendChild(logoutDiv1);
    liLogout.appendChild(logoutDiv);
    menuContentList.appendChild(liLogout);
    //end menu Thoát
    // var tmpModuleNode = document.createElement('li');
    // tmpModuleNode.setAttribute('id', 'quick_default_menu_btn');
    // tmpModuleNode.setAttribute('style', 'display: none;padding-top:17px');
    // if (gModeScreenView == CONST_MODE_SCR_SMALL) {
    //     tmpModuleNode.setAttribute('style', 'display: none;padding-top:0px');
    // }
    //
    // var aDiv = document.createElement('div');
    // aDiv.setAttribute('style', 'background-color: #f69013; width: 92%; font-size: 16px; font-weight: bold; color: #fff; border-style: hidden;border-radius:20px;');
    // aDiv.setAttribute('onClick', 'quickChangeMenuStyleDefault(true)');
    // aDiv.setAttribute('targetMenuStyle', 'default');
    //
    // var aEm = document.createElement('em');
    // aEm.setAttribute('class', 'icon-circle-down icon-style');
    // var bDiv = document.createElement('div');
    // bDiv.setAttribute('class', 'langNoStyle');
    // bDiv.setAttribute('id','quick');
    // bDiv.innerHTML = 'QUICK_SET_MENU_STYLE_DEFAULT';
    //
    // aDiv.appendChild(aEm);
    // aDiv.appendChild(bDiv);
    // tmpModuleNode.appendChild(aDiv);
    // menuContentList.appendChild(tmpModuleNode);
    //
    // // add quick change menu style simple
    // var tmpModuleNode = document.createElement('li');
    // tmpModuleNode.setAttribute('id', 'quick_simple_menu_btn');
    // tmpModuleNode.setAttribute('style', 'padding-top: 17px;');
    // if (gModeScreenView == CONST_MODE_SCR_SMALL) {
    //     tmpModuleNode.setAttribute('style', 'display: none;padding-top:0px');
    // }
    //
    // var aDiv = document.createElement('div');
    // aDiv.setAttribute('style', 'background-color: #f69013; width:92%; font-size: 15px; font-weight: bold; color: #fff; border-style: hidden;border-radius:20px');
    // aDiv.setAttribute('onClick', 'quickChangeMenuStyleSimple(true)');
    // aDiv.setAttribute('targetMenuStyle', 'simple');
    //
    // var aEm = document.createElement('em');
    // //  aEm.setAttribute('class','icon-setting');
    // aEm.setAttribute('class', 'icon-circle-up icon-style');
    // var bDiv = document.createElement('div');
    // bDiv.setAttribute('class', 'langNoStyle');
    // bDiv.setAttribute('id','quick');
    // bDiv.innerHTML = 'QUICK_SET_MENU_STYLE_SIMPLE';
    //
    // aDiv.appendChild(aEm);
    // aDiv.appendChild(bDiv);
    // tmpModuleNode.appendChild(aDiv);
    // menuContentList.appendChild(tmpModuleNode);
    //
    // // add quick change menu style custom
    // var tmpModuleNode = document.createElement('li');
    // tmpModuleNode.setAttribute('id', 'quick_custom_menu_btn');
    // tmpModuleNode.setAttribute('style', 'display: none;');
    //
    // var aDiv = document.createElement('div');
    // aDiv.setAttribute('style', 'background-color: #f69013; width: 100%; font-size: 15px; font-weight: bold; color: #fff; border-style: hidden; margin-top:10px');
    // aDiv.setAttribute('onClick', 'quickChangeMenuStyleCustom(this)');
    // aDiv.setAttribute('targetMenuStyle', 'custom');
    //
    // var aEm = document.createElement('em');
    // aEm.setAttribute('class', 'icon-circle-right icon-style');
    // var bDiv = document.createElement('div');
    // bDiv.setAttribute('class', 'langNoStyle');
    // bDiv.innerHTML = 'QUICK_SET_MENU_STYLE_CUSTOM';
    //
    // aDiv.appendChild(aEm);
    // aDiv.appendChild(bDiv);
    // tmpModuleNode.appendChild(aDiv);
    // menuContentList.appendChild(tmpModuleNode);

    // add space
    var tmpModuleNode = document.createElement('li');
    tmpModuleNode.setAttribute('id','final_li');
    var aDiv = document.createElement('div');
    aDiv.setAttribute('style', '; width: 233px; font-size: 15px; font-weight: bold; color: #fff; border-style: hidden;');
    tmpModuleNode.appendChild(aDiv);
    menuContentList.appendChild(tmpModuleNode);

    var tmpModuleNode = document.createElement('li');
    tmpModuleNode.setAttribute('id','final_li_2');
    var aDiv = document.createElement('div');
    aDiv.setAttribute('style', '; height:187px; width: 233px; font-size: 15px; font-weight: bold; color: #fff; border-style: hidden;');
    tmpModuleNode.appendChild(aDiv);
    menuContentList.appendChild(tmpModuleNode);

    document.getElementById('menu-section').innerHTML = gMenuRawData;
    document.getElementById('menu.slideview').innerHTML = menuContentList.innerHTML;
    gMenuRawData = document.getElementById('menu-section').innerHTML;
    if (document.getElementById('wrapper_jumboAcc')) {
        gJumboMenuElements = document.getElementById('wrapper_jumboAcc').innerHTML; //FIX FOR JUMBO
    }
    if (document.getElementById('wrapper_mAccInfo')) {
        gAccInfoMenuElements = document.getElementById('wrapper_mAccInfo').innerHTML; //FIX FOR JUMBO
    }

    changeMenuLanguage();
    // applyDynamicCommonStyleSheet();
}
function quickChangeMenuStyleDefault(_saveToServer) {
    for (var i = 0; i < gMenuList.length; i++) {
        var tempMenuObj = gMenuList[i];
        if (tempMenuObj.priority == '1' || tempMenuObj.priority == '2') {
            gMenuList[i].hiddenStatus = 'N';
            gMenuList[i].reOrderStatus = 'N';
        } else {
            gMenuList[i].hiddenStatus = 'Y';
        }
    }

    var tmpMenuCfg = '';
    var tmpSubMenuCfg = '';

    for (var i = 0; i < gMenuList.length; i++) {
        var tmpMenuObj = gMenuList[i];
        if (tmpMenuObj.menuID.length > 0 && tmpMenuObj.parentMenuID.length == 0 && tmpMenuObj.hiddenStatus == 'N') {
            tmpMenuCfg = tmpMenuCfg + tmpMenuObj.menuID + '#';
        }
        //if(tmpMenuObj.menuID.length == 0 && tmpMenuObj.parentMenuID.length > 0 && tmpMenuObj.hiddenStatus == 'N') {
        if (tmpMenuObj.parentMenuID.length > 0 && tmpMenuObj.hiddenStatus == 'N') {
            tmpSubMenuCfg = tmpSubMenuCfg + tmpMenuObj.parentMenuID + '_' + tmpMenuObj.keyLang + '#';
        }
    }

    gMenuUserOrder = tmpMenuCfg.split('#');

    if (!_saveToServer) {
        genMenuSection();

        document.getElementById('quick_default_menu_btn').style.display = 'none';
        document.getElementById('quick_simple_menu_btn').style.display = '';
        document.getElementById('quick_custom_menu_btn').style.display = 'none';
        return;
    }

    var data = {};
    var arrayArgs = new Array();
    //arrayArgs.push(tmpMenuCfg);
    arrayArgs.push(tmpMenuCfg + '-CUSTOM-MENU-' + tmpSubMenuCfg + '-CUSTOM-MENU-' + 'default');
    var gprsCmd = new GprsCmdObj("87", "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);

    data = getDataFromGprsCmd(gprsCmd);

    requestMBService(data, true, 0, function (e) {
        logInfo("Customize menu success");
        genMenuSection();

        document.getElementById('quick_default_menu_btn').style.display = 'none';
        document.getElementById('quick_simple_menu_btn').style.display = '';
        document.getElementById('quick_custom_menu_btn').style.display = 'none';
        //showAlertText(CONST_STR.get('ALERT_CUSTOMIZE_MENU_SUCCESS'));
        reloadHomepage();

    }, function () {
        logInfo("Customize menu fail");
        //showAlertText(CONST_STR.get('ALERT_CUSTOMIZE_MENU_FAIL'));
    });


}
function quickChangeMenuStyleSimple(_saveToServer) {
    for (var i = 0; i < gMenuList.length; i++) {
        var tempMenuObj = gMenuList[i];
        if (tempMenuObj.priority == '1') {
            gMenuList[i].hiddenStatus = 'N';
            gMenuList[i].reOrderStatus = 'N';
        } else {
            gMenuList[i].hiddenStatus = 'Y';
        }
    }

    var tmpMenuCfg = '';
    var tmpSubMenuCfg = '';

    for (var i = 0; i < gMenuList.length; i++) {
        var tmpMenuObj = gMenuList[i];
        if (tmpMenuObj.menuID.length > 0 && tmpMenuObj.parentMenuID.length == 0 && tmpMenuObj.hiddenStatus == 'N') {
            tmpMenuCfg = tmpMenuCfg + tmpMenuObj.menuID + '#';
        }
        if (tmpMenuObj.parentMenuID.length > 0 && tmpMenuObj.hiddenStatus == 'N') {
            //if(tmpMenuObj.menuID.length == 0 && tmpMenuObj.parentMenuID.length > 0 && tmpMenuObj.hiddenStatus == 'N') {
            tmpSubMenuCfg = tmpSubMenuCfg + tmpMenuObj.parentMenuID + '_' + tmpMenuObj.keyLang + '#';
        } else {
        }
    }
    gMenuUserOrder = tmpMenuCfg.split('#');

    if (!_saveToServer) {
        genMenuSection();


        document.getElementById('quick_default_menu_btn').style.display = '';
        document.getElementById('quick_simple_menu_btn').style.display = 'none';
        document.getElementById('quick_custom_menu_btn').style.display = 'none';
        return;

    }

    var data = {};
    var arrayArgs = new Array();
    //arrayArgs.push(tmpMenuCfg);
    arrayArgs.push(tmpMenuCfg + '-CUSTOM-MENU-' + tmpSubMenuCfg + '-CUSTOM-MENU-' + 'simple');
    var gprsCmd = new GprsCmdObj("87", "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);

    data = getDataFromGprsCmd(gprsCmd);

    requestMBService(data, true, 0, function (e) {
        logInfo("Customize menu success");

            genMenuSection();

        document.getElementById('quick_default_menu_btn').style.display = '';
        document.getElementById('quick_simple_menu_btn').style.display = 'none';
        document.getElementById('quick_custom_menu_btn').style.display = 'none';

//        showAlertText(CONST_STR.get('ALERT_CUSTOMIZE_MENU_SUCCESS'));

        reloadHomepage();
    }, function () {
        logInfo("Customize menu fail");
        //showAlertText(CONST_STR.get('ALERT_CUSTOMIZE_MENU_FAIL'));
    });
}
function quickChangeMenuStyleCustom(evt) {
    navController.initWithRootView('setting/customize-menu-scr', true, 'xsl');
}

/*** CUSTOMIZE MENU END ***/
/*** CUSTOMIZE MENU END ***/


/* SHOW HINT - TIPS*/
function show_hint(event, content) {
    var hint = document.getElementById("hint-info-dialog");
    if (content == 1) {
        document.getElementById("search_dialog").innerHTML = CONST_STR.get("HINT_MESSAGE");
    } else {
        document.getElementById("search_dialog").innerHTML = CONST_STR.get(content);
    }
    hint.style.display = "block";
    hint.style.zIndex = 2011;
    if (!event) {
        event = window.event;
    }
    var hinttip = document.getElementById("search_dialog");
    var left = event.clientX - hinttip.clientWidth / 2;
    if (left < 0 || screen.width < 450) left = 0;
    if (screen.width < 450) hinttip.style.width = screen.width + "px";
    if ((left + hinttip.clientWidth) > clientWidth) {
        left = clientWidth - hinttip.clientWidth;
    }
    var top = event.clientY - hinttip.clientHeight - document.getElementById(event.target.id).offsetHeight;
    hinttip.style.left = left + "px";
    hinttip.style.top = top + 100 + "px";

}


function closeHint() {
    document.getElementById("hint-info-dialog").style.display = "none";
    document.getElementById("hint-info-dialog").style.zIndex = 0;
}

/*END SHOW HINT - TIPS*/

// DatMD QR code

function showQRCodeView() {

    /*
     THEBTouchID.checkRebootTime('abc', 'def', 'Huynt2', function(){

     }, function(e) {
     });
     */


    console.log("dunglhq :VAO DAY");
    barcodeScanner.scan(
        function (result) {
            if (result.cancelled != 1) {
                var format = result.format;
                console.log("dunglhq qrcode success");
                if (format == 'QR_CODE') {
                    var qrCodeText = result.text;
                    if (qrCodeText.indexOf('xacthucbaolanh') > -1) {
                        // bao lanh
                        var firstIndex = qrCodeText.indexOf('serial=') + 7;
                        var lastIndex = qrCodeText.indexOf('&contractid');
                        var serial = qrCodeText.substring(firstIndex, lastIndex);

                        firstIndex = qrCodeText.indexOf('contractid=') + 11;
                        var contractid = qrCodeText.substring(firstIndex, qrCodeText.length);

                        var baoLanhUrl = "https://xacthucbaolanh.tpb.vn/xacthucbaolanh/Default.aspx?serial=" + serial + "&contractid=" + contractid;
                        openLinkInWindows(baoLanhUrl);
                    } else {
                        //if(qrCodeText.length == 11 && (!isNaN(qrCodeText))){
                        var qrCodeUpperCase = qrCodeText.toUpperCase();
                        if (qrCodeUpperCase.indexOf('A001') > -1) {

                            var data = {};
                            arrayArgs = new Array();
                            arrayArgs.push('SAVING');
                            arrayArgs.push(encodeURIComponent(qrCodeText.substring(4, qrCodeText.length)));
                            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_GET_QRCODE_INFO"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
                            data = getDataFromGprsCmd(gprsCmd);
                            requestMBService(data, true, 0, requestMBServiceQRSuccesss, requestMBServiceQRFail);
                        } else {
                            console.log("dunglhq qrcode incorrect");
                            //khong phai qrcode STK hay qrcode TBL - hien thi binh thuong
                            setReviewXmlStore('incorrect-qrcode#' + qrCodeText);
                            if (currentPage == "stk") {
                                reloadStk();
                            } else {
                                navController.pushToView('stk', true, 'html');
                            }
                        }
                    }
                } else {
                    // khong phai QR_CODE
                    showAlertText(CONST_STR.get('QR_CODE_SCAN_FAIL'));
                    return;
                }

            } else {
                // cancle
            }
        },
        function (error) {
            // showAlertText(CONST_STR.get('QR_CODE_SCAN_FAIL'));
            console.log("dunglhq qrcode error: ", error);

            if (error == "TIME_OUT") {
                setReviewXmlStore('TIME_OUT');
                if (currentPage == "stk") {
                    reloadStk();
                } else {
                    navController.pushToView('stk', true, 'html');
                }
            } else if (error == "SELF_INPUT") {
                setReviewXmlStore('SELF_INPUT');
                if (currentPage == "stk") {
                    reloadStk();
                } else {
                    navController.pushToView('stk', true, 'html');
                }
            } else {
                showAlertText(CONST_STR.get('QR_CODE_SCAN_FAIL'));
            }
        }
    );
}

function requestMBServiceQRSuccesss(e) {
    gprsResp = parserJSON(e);

    if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_GET_QRCODE_INFO")))) {
        var respArgs = gprsResp.arguments;
        setReviewXmlStore(respArgs);
        if (currentPage == "stk") {
            reloadStk();
        } else {
            navController.pushToView('stk', true, 'html');
        }

    } else {
        setReviewXmlStore('not_found');
        if (currentPage == "stk") {
            reloadStk();
        } else {
            navController.pushToView('stk', true, 'html');
        }

    }
}

function requestMBServiceQRFail(e) {
    var tmpPageName = navController.getDefaultPage();
    var tmpPageType = navController.getDefaultPageType();
    navController.initWithRootView(tmpPageName, true, tmpPageType);
}
//ngocdt3 bo sung cho loyalty
function removeAccentLoyalty(sText) {
    var sNewText = new String(sText);
    sNewText = regReplace(sNewText, "JAN", "01");
    sNewText = regReplace(sNewText, "FEB", "02");
    sNewText = regReplace(sNewText, "MAR", "03");
    sNewText = regReplace(sNewText, "APR", "04");
    sNewText = regReplace(sNewText, "MAY", "05");
    sNewText = regReplace(sNewText, "JUN", "06");
    sNewText = regReplace(sNewText, "JUL", "07");
    sNewText = regReplace(sNewText, "AUG", "08");
    sNewText = regReplace(sNewText, "SEP", "09");
    sNewText = regReplace(sNewText, "OCT", "10");
    sNewText = regReplace(sNewText, "NOV", "11");
    sNewText = regReplace(sNewText, "DEC", "12");
    //sNewText = removeSpecialCharForText(sNewText);
    return sNewText;

}

function checkRebootAndroid() {


    console.log("dunglhq : call checkreboot");
    checkReboot.check(
        function (result) {
            if (result.text == "SUCCESS") {
                console.log("dunglhq receiver checkreboot sucesss");
            }
        },
        function (error) {

        }
    );


}

function checkReboot() {

    checkRebootAndroid();

}
function reloadHomepage() {
    document.getElementById('home-dynamic').innerHTML = "";

//    document.getElementById("account_name").innerHTML = gCustomerNanme; anhntt cmt

    var mMenuList_1 = new Array();
    for (var i = 0; i < gMenuUserOrder.length; i++) {
        for (var j = 0; j < gMenuList.length; j++) {
            var tmpMenuObj = gMenuList[j];
            //alert(gMenuList[j].menuID);
            if (gMenuUserOrder[i].length > 0 && gMenuUserOrder[i] == tmpMenuObj.menuID &&
                tmpMenuObj.menuID != 'mHomePage') {
                gMenuList[j].hiddenStatus = 'N';
                mMenuList_1.push(gMenuList[j]);

                break;
            }
        }
    }

    var tmpBodyHome = null;
    tmpBodyHome = document.createElement('tbody');
    var tmpRowIcon;
    var tmpRowLabel;
    for (var i = 0; i < mMenuList_1.length; i++) {
        var tmpMenuObj = mMenuList_1[i];
        if (i % 3 == 0) {
            tmpRowIcon = document.createElement('tr');
            tmpRowLabel = document.createElement('tr');
            tmpBodyHome.appendChild(tmpRowIcon);
            tmpBodyHome.appendChild(tmpRowLabel);
        }
        if (tmpMenuObj.path == 'accountxsl/account-scr') {
            var tmpCellIcon = document.createElement('td');
            var att = document.createAttribute("align");       // Create a "class" attribute
            att.value = "center";
            tmpCellIcon.setAttributeNode(att);
            tmpCellIcon.style.width = '33%';
//            tmpCellIcon.innerHTML = "<div class='icon_div' onclick=\"" + tmpMenuObj.onClick + ";\" id='" + "'> <em class='" + tmpMenuObj.iconCode + " icon_font' style='color:" + tmpMenuObj.color + "'></em> </div>";
            tmpCellIcon.innerHTML = "<div class='icon_div_main ripple-add-on' onclick=\"" + tmpMenuObj.onClick + ";\" id='" + "'> <em class='" + tmpMenuObj.iconCode + " icon_font_v8' style='color:" + tmpMenuObj.color + "'></em> </div>";
            tmpRowIcon.appendChild(tmpCellIcon);

            var tmpCellLabel = document.createElement('td');
            var attlb = document.createAttribute("align");       // Create a "class" attribute
            attlb.value = "center";
            tmpCellLabel.setAttributeNode(attlb);
            tmpCellLabel.style.verticalAlign = 'middle';
            tmpCellLabel.innerHTML = "<a style='text-decoration:none; color:#FFF; cursor:pointer' onclick=\"" + tmpMenuObj.onClick + "\">" +
                "<div class='icon_div_title'> <span class='icon_title'>" + CONST_STR.get(tmpMenuObj.keyLang) + "</span> </div>" +
                "</a>";
            tmpRowLabel.appendChild(tmpCellLabel);
        }
        else {
            var tmpCellIcon = document.createElement('td');
            var att = document.createAttribute("align");       // Create a "class" attribute
            att.value = "center";
            tmpCellIcon.setAttributeNode(att);
            tmpCellIcon.style.width = '33%';
//            tmpCellIcon.innerHTML = "<div class='icon_div' onclick=\"gotoMenuList('" + tmpMenuObj.menuID + "');\" id='" + "'> <em class='" + tmpMenuObj.iconCode + " icon_font' style='color:" + tmpMenuObj.color + "'></em> </div>";
            var onclkStr = "handleOnClickToBlockDoubleClick('initMenuDetail(\\'" + tmpMenuObj.menuID + "\\');setTitleBar(\\'" + CONST_STR.get(tmpMenuObj.keyLang) + "\\');');";
            tmpCellIcon.innerHTML = "<div class='icon_div_main ripple-add-on' onclick=\""+ onclkStr +"\"   id='" + "'> <em class='" + tmpMenuObj.iconCode + " icon_font_v8' style='color:" + tmpMenuObj.color + "'></em> </div>";
            tmpRowIcon.appendChild(tmpCellIcon);

            var tmpCellLabel = document.createElement('td');
            var attlb = document.createAttribute("align");       // Create a "class" attribute
            attlb.value = "center";
            tmpCellLabel.setAttributeNode(attlb);
            tmpCellLabel.style.verticalAlign = 'middle';
            tmpCellLabel.innerHTML = "<a style='text-decoration:none; color:#FFF; cursor:pointer' onclick=\"" + tmpMenuObj.onClick + "\">" +
                "<div class='icon_div_title'> <span class='icon_title'>" + CONST_STR.get(tmpMenuObj.keyLang) + "</span> </div>" +
                "</a>";
            tmpRowLabel.appendChild(tmpCellLabel);
        }

    }
    document.getElementById('home-dynamic').innerHTML = tmpBodyHome.innerHTML;

}
//======================thuanTM========================================
function getNumberOfRow(inArrayData, inRow) {
    var numOfRows = inRow;
    if (inRow == 0) {
        var currentClientHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
        var tmpSlideHeight = currentClientHeight - (80 + 40 + 15 + 40);
        var tmpRowHeightWithGap = 46 + 4;
        numOfRows = Math.floor(tmpSlideHeight / tmpRowHeightWithGap);
    }
    return numOfRows;
}

function getNumberOfPage(inArrayData, inRow) {
    var numOfRows = getNumberOfRow(inArrayData, inRow);
    var numOfPages = 0;
    if (inArrayData.length % numOfRows == 0) {
        numOfPages = inArrayData.length / numOfRows;
    }
    else {
        numOfPages = Math.floor(inArrayData.length / numOfRows) + 1;
    }
    return numOfPages;
}

//Calendar SangNT1
function loadCalendar(isMultiple, calendarDateChange,values) {
    document.getElementById("calendarShowExactly").innerHTML = '';
    var calendarShow = document.getElementById("calendarShow");
    var calendarVitual = document.getElementById("calendarShowVitual");
    var img = document.getElementById('user-background-image'),
        style = img.currentStyle || window.getComputedStyle(img, false),
        imgResource = style.backgroundImage.slice(4, -1).replace(/"/g, "");
    console.log(imgResource);
    //calendarVitual.style.backgroundImage = "url('" + imgResource + "')";
    scaleAnimationFullTo(document.getElementById("calendarShowExactly"), 0.6);
    document.getElementById("exitcalender").addEventListener('click', function () {
        hideCalendar();

    });
    initMyCalendar(isMultiple, calendarDateChange,"#calendarShowExactly",values);
}
function initCalendar(isMultiple, calendarDateChange, initID,values) {
    var length;
    if(values != undefined)
        length = values.length;
    var inlineCalendar = myApp.calendar({
        container:initID,
        value:(length != undefined && length>0) ? values : ((isMultiple)?'':[new Date()]),
       // value:values,
        monthNames:((gUserInfo.lang == 'EN') ? CONST_KEY_CALENDAR_MONTHNAME_EN : CONST_KEY_CALENDAR_MONTHNAME_VN),
        monthNamesShort:((gUserInfo.lang == 'EN') ? CONST_KEY_CALENDAR_MONTHNAME_SHORT_EN : CONST_KEY_CALENDAR_MONTHNAME_SHORT_VN),
        dayNames:((gUserInfo.lang == 'EN') ? CONST_KEY_CALENDAR_DAYNAME_EN : CONST_KEY_CALENDAR_DAYNAME_VN),
        dayNamesShort:((gUserInfo.lang == 'EN') ? CONST_KEY_CALENDAR_DAYNAME_SHORT_EN : CONST_KEY_CALENDAR_DAYNAME_SHORT_VN),
        firstDay:0, // First day of the week, Monday
        weekendDays:[0, 6], // Sunday and Saturday
        multiple:isMultiple,
        rangePicker:false,
        dateFormat:'dd/mm/yyyy',
        direction:'horizontal', // or 'vertical'
        minDate:null,
        maxDate:null,
        disabled:null, // dates range of disabled days
        events:null, // dates range of days with events
        rangesClasses:null, //array with custom classes date ranges
        touchMove:true,
        animate:true,
        closeOnSelect:false,
        monthPicker:true,
        monthPickerTemplate:'<div class="picker-calendar-month-picker">' +
            '<a href="#" class="link icon-only picker-calendar-prev-month"><i class="icon-back"></i></a>' +
            '<span class="current-month-value"></span>' +
            '<a href="#" class="link icon-only picker-calendar-next-month"><i class="icon-arrowright"></i></a>' +
            '</div>',
        yearPicker:true,
        yearPickerTemplate:'<div class="picker-calendar-year-picker">' +
            '<a href="#" class="link icon-only picker-calendar-prev-year"><i class="icon-back"></i></a>' +
            '<span class="current-year-value"></span>' +
            '<a href="#" class="link icon-only picker-calendar-next-year"><i class="icon-arrowright"></i></a>' +
            '</div>',
        weekHeader:true,
        // Common settings
        closeByOutsideClick:true,
        scrollToInput:true,
        inputReadOnly:true,
        convertToPopover:true,
        onlyInPopover:false,
        toolbar:true,
        toolbarCloseText:'Done',
        headerPlaceholder:'Select date',
        header:false,
        footer:false,
        toolbarTemplate:'<div class="toolbar">' +
            '<div class="toolbar-inner">' +
            '{{monthPicker}}' +
            '{{yearPicker}}' +
            '</div>' +
            '</div>',
        headerTemplate:'<div class="picker-header">' +
            '<div class="picker-calendar-selected-date">{{placeholder}}</div>' +
            '</div>',
        footerTemplate:'<div class="picker-footer">' +
            '<a  onclick="calendarDefault.close();" class="button close-picker">{{closeText}}</a>' +
            '</div>',
        onChange:function (p, values, displayValues) {


            var contentData = new Array();
            var length = values.length;
            if (isMultiple) {
                for (var i = 0; i < length; i++) {
                    contentData.push(fomatDateForCalendar(values[i]));
                }

            } else {

                contentData = fomatDateForCalendar(values);
            }

            if (typeof calendarDateChange !== 'undefined') {
                getDataCalendar(contentData, calendarDateChange);
            }

        }

    });
}
function initMyCalendar(isMultiple, calendarDateChange, initID,values) {
    var length;
    if(values != undefined)
        length = values.length;
    var inlineCalendar = myApp.calendar({
        container:initID,
        value:(length != undefined && length>0) ? values : ((isMultiple)?'':[new Date()]),
       // value:values,
        monthNames:((gUserInfo.lang == 'EN') ? CONST_KEY_CALENDAR_MONTHNAME_EN : CONST_KEY_CALENDAR_MONTHNAME_VN),
        monthNamesShort:((gUserInfo.lang == 'EN') ? CONST_KEY_CALENDAR_MONTHNAME_SHORT_EN : CONST_KEY_CALENDAR_MONTHNAME_SHORT_VN),
        dayNames:((gUserInfo.lang == 'EN') ? CONST_KEY_CALENDAR_DAYNAME_EN : CONST_KEY_CALENDAR_DAYNAME_VN),
        dayNamesShort:((gUserInfo.lang == 'EN') ? CONST_KEY_CALENDAR_DAYNAME_SHORT_EN : CONST_KEY_CALENDAR_DAYNAME_SHORT_VN),
        firstDay:0, // First day of the week, Monday
        weekendDays:[0, 6], // Sunday and Saturday
        multiple:isMultiple,
        rangePicker:false,
        dateFormat:'dd/mm/yyyy',
        direction:'horizontal', // or 'vertical'
        minDate:null,
        maxDate:null,
        disabled:null, // dates range of disabled days
        events:null, // dates range of days with events
        rangesClasses:null, //array with custom classes date ranges
        touchMove:true,
        animate:true,
        closeOnSelect:false,
        monthPicker:true,
        monthPickerTemplate:'<div class="picker-calendar-month-picker">' +
            '<a href="#" class="link icon-only picker-calendar-prev-month"><i class="icon-back"></i></a>' +
            '<span class="current-month-value"></span>' +
            '<a href="#" class="link icon-only picker-calendar-next-month"><i class="icon-arrowright"></i></a>' +
            '</div>',
        yearPicker:true,
        yearPickerTemplate:'<div class="picker-calendar-year-picker">' +
            '<a href="#" class="link icon-only picker-calendar-prev-year"><i class="icon-back"></i></a>' +
            '<span class="current-year-value"></span>' +
            '<a href="#" class="link icon-only picker-calendar-next-year"><i class="icon-arrowright"></i></a>' +
            '</div>',
        weekHeader:true,
        // Common settings
        closeByOutsideClick:true,
        scrollToInput:true,
        inputReadOnly:true,
        convertToPopover:true,
        onlyInPopover:false,
        toolbar:true,
        toolbarCloseText:CONST_STR.get('TRANSFER_REMITTANCE_DONE_BUTTON'),
        headerPlaceholder:'Select date',
        header:true,
        footer:true,
        toolbarTemplate:'<div class="toolbar">' +
            '<div class="toolbar-inner">' +
            '{{monthPicker}}' +
            '{{yearPicker}}' +
            '</div>' +
            '</div>',
        headerTemplate:'<div class="picker-header">' +
           CONST_STR.get('VISA_SELECT_DATE_TITLE')+
            '</div>',
        footerTemplate:'<div class="picker-footer">' +
            '<div  onclick="hideCalendar();" class="button close-picker btn-done-destop">{{closeText}}</div>' +
            '</div>',
        onChange:function (p, values, displayValues) {


            var contentData = new Array();
            var length = values.length;
            if (isMultiple) {
                for (var i = 0; i < length; i++) {
                    contentData.push(fomatDateForCalendar(values[i]));
                }

            } else {

                contentData = fomatDateForCalendar(values);
            }

            if (typeof calendarDateChange !== 'undefined') {
                getDataCalendar(contentData, calendarDateChange);
            }

        }

    });
}

function showCalendar() {
    console.log("ShowCalendar");
    var cEx = document.getElementById("calendarShowExactly");
    document.getElementById("mask-blacktrans").style.display = 'block';
    document.getElementById("calendarShow").style.display = 'block';
    cEx.style.display = 'block';

    setTimeout(function () {
        scaleAnimationToFull(cEx);
        fadeInAnimation(cEx);
    }, 100);

}
var dd;
var mm;
var yyyy;
var selected;
function hideCalendar() {
    console.log("HideCalendar");
    var cEx = document.getElementById("calendarShowExactly");
    document.getElementById("mask-blacktrans").style.display = 'none';
    scaleAnimationFullTo(cEx, 0.6);
    fadeOutAnimation(cEx);
    setTimeout(function () {
        document.getElementById("calendarShow").style.display = 'none';
        cEx.style.display = 'none';
    }, 500);
    selected = document.getElementsByClassName("picker-calendar-day-selected")[0]||"";

    dd = (selected == undefined )?"":selected.getAttribute("data-day");
    mm = (selected == undefined )?"":selected.getAttribute("data-month");
    yyyy = (selected == undefined )?"":selected.getAttribute("data-year");

    if(dd < 10){
        dd = "0" + dd;
    }
    mm = (parseInt(mm) + 1);
    if(mm < 10){
        mm = "0" + mm;
    }

    document.getElementById(comCalendar).value = dd + "/" + mm + "/" + yyyy;
}
function getDataCalendar(dataCalendar, callback) {
    callback(dataCalendar);

}
function scaleAnimationToFull(ele) {

    ele.style.transform = 'scale(' + 1 + ')';
    ele.style['-o-transform'] = 'scale(' + 1 + ')';
    ele.style['-webkit-transform'] = 'scale(' + 1 + ')';
    ele.style['-moz-transform'] = 'scale(' + 1 + ')';
    ele.style['-webkit-transition-duration'] = '' + 0.6 + 's';
    ele.style['-moz-transition-duration'] = '' + 0.6 + 's';
    ele.style['-o-transition-duration'] = '' + 0.6 + 's';


}
function scaleAnimationFullTo(ele, percent) {

    ele.style.transform = 'scale(' + percent + ')';
    ele.style['-o-transform'] = 'scale(' + percent + ')';
    ele.style['-webkit-transform'] = 'scale(' + percent + ')';
    ele.style['-moz-transform'] = 'scale(' + percent + ')';
    ele.style['-webkit-transition-duration'] = '' + 0.6 + 's';
    ele.style['-moz-transition-duration'] = '' + 0.6 + 's';
    ele.style['-o-transition-duration'] = '' + 0.6 + 's';
}


function fadeOutAnimation(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);

        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.2;

    }, 10);
}

function fadeInAnimation(element) {
    var op = 0.2;  // initial opacity
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);

        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;

    }, 10);
}

function loadCalendarInline(elementId, isMultiple, calendarDateChange,values) {
    var ele = document.getElementById(elementId);
    ele.innerHTML = '';
    initCalendar(isMultiple, calendarDateChange, "#" + elementId,values);

}
function fomatDateForCalendar(values) {
    var date;
    if (isNaN(values)) {
        date = new Date(values);
    } else {
        date = new Date(Number(values));
    }

    var day = date.getDate();

    var monthIndex = date.getMonth();
    var year = date.getFullYear();
   var content = ((day<10)?('0' + day ) : day)+ "/" + (((monthIndex+1)<10)?('0'+(monthIndex + 1)): (monthIndex + 1))+ "/" + year;

    return content;
}
//End Calendar SangNT1
//lantb handle shedule transfer money
function getDate(str){
    if(str === "today"){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        var today = dd+'/'+ mm + '/' + yyyy;
        return today;
    }
}
function shedulerObj(opt){
    var array = (gUserInfo.lang == 'EN') ? CONST_KEY_PERIODIC_FREQUENCY_EN : CONST_KEY_PERIODIC_FREQUENCY_VN;
    this.type = opt.type || array[0];
    this.startDate = opt.startDate || getDate("today");
    this.endDate = opt.endDate ||  getDate("today") ;
    this.dayInWeek = opt.dayInWeek || "0";
    this.dayTransfer = opt.dayTransfer || getDate("today");
}
function tempSchedulerObj(){
    var array = (gUserInfo.lang == 'EN') ? CONST_KEY_PERIODIC_FREQUENCY_EN : CONST_KEY_PERIODIC_FREQUENCY_VN;
    this.type =  array[0];
    this.startDate = getDate("today");
    this.endDate = "Vào ngày";
    this.dayInWeek =  "7";
    this.dayTransfer = getDate("today");
}
function setDaySelected(e){
    var val = e.getAttribute("value");
    var className = e.className;
    e.className = className + " picker-calendar-day-selected";
    var allNodes = document.getElementById("dayWeek").getElementsByClassName("picker-calendar-day");
    for(var i = 0; i < allNodes.length;i++){
        var el = allNodes[i];
        var tmp = el.getAttribute("value");
        if(tmp !== val){
            var className = el.className;
            if(className.indexOf('picker-calendar-day-selected')!=-1){
                className = className.replace('picker-calendar-day-selected','');
            }
            el.className = className;
        }
    }
}

/*function getDayInWeekSelected(){
    var nodeSelected = document.getElementById("dayWeek").getElementsByClassName("picker-calendar-day-selected")[0];
    if(typeof nodeSelected !== "undefined"){
        return nodeSelected.getAttribute("value");
    }
    return "";

}*/
//calendar let user choose day
function showSchedulerType(){
    var checker = document.getElementById("warning-validate");
    if(checker != null){
        checker.innerHTML = "";
    }
    document.addEventListener("evtSelectionDialog", handleSelectionScheduleType, false);
    document.addEventListener("evtSelectionDialogClose", handleDialogScheduleClose, false);
    var array = (gUserInfo.lang == 'EN') ? CONST_KEY_PERIODIC_FREQUENCY_EN : CONST_KEY_PERIODIC_FREQUENCY_VN;
    var bd = document.getElementById("schedulerlist");
    bd.style.borderBottomLeftRadius = "0px";
    bd.style.borderBottomRightRadius = "0px";
    document.getElementById("narrowspin").style.transform = "rotate(90deg)";

    var dialogHeight = 0;
    var divNode = document.getElementById('viewScheduler');

    if ((divNode != null) && (divNode != undefined)) {
        divNode.innerHTML = "";
    }

    var dialogDivAll = document.createElement('div');
    var dialogDivContainerScroll = document.createElement('div');
    dialogDivContainerScroll.setAttribute('id', 'selection-dialog-scroll');
    dialogDivContainerScroll.setAttribute('class', 'dialog-scroll-content div-selection-dialog');
    var dialogDivContainer = document.createElement('div');

            for (var x = 1; x < array.length + 1; x++) {
                if (x < 6) {
                    dialogHeight = dialogHeight + 39;
                }
                var aNode = document.createElement("a");

                if (x == 0) {
                 aNode.setAttribute("class", "list-group-item active");
                 aNode.innerHTML = inTitle;
                 divNode.appendChild(aNode);
                 }
                 else {
                aNode.setAttribute("class", "list-group-item");
                if (showValue) {
                    aNode.style.textAlign = "center";
                }
                else {
                    aNode.style.textAlign = "center";
                }
                aNode.setAttribute("onClick", "selectedScheduler(this," + x + ");");
                aNode.innerHTML = array[x - 1];
                dialogDivContainer.appendChild(aNode);
                }
            }
            dialogDivContainerScroll.appendChild(dialogDivContainer);
            dialogDivAll.appendChild(dialogDivContainerScroll);
            divNode.appendChild(dialogDivAll);
    if(divNode.style.display == 'block'){
        divNode.style.display = 'none';
        document.getElementById("schedulerlist").style.borderBottomLeftRadius = "8px";
        document.getElementById("schedulerlist").style.borderBottomRightRadius = "8px";
        document.getElementById("narrowspin").style.transform = "rotate(0)";

    }else{
        divNode.style.display = 'block';
    }
}
function selectedScheduler(inNode, index){
    var dialogSelection = document.getElementById("selection-dialog");
        if (inNode.nodeType == 1) {
            if (inNode.tagName == "A") {
                //fire event listener
                var tmpDialogTimer = setTimeout(function (e) {
                    clearTimeout(tmpDialogTimer);
                    if (inNode.childNodes[0] != undefined) {
                        evtSelectionDialog.selectedValue1 = inNode.childNodes[0].nodeValue;
                    }
                    if (inNode.childNodes[1] != undefined) {
                        evtSelectionDialog.selectedValue2 = inNode.childNodes[1].innerHTML;
                    }
                    evtSelectionDialog.selectedIndex = index;
                    document.dispatchEvent(evtSelectionDialog);
                }, 500);
            }
        }
    document.getElementById('viewScheduler').style.display = 'none';
    var bd = document.getElementById("schedulerlist");
    bd.style.borderBottomLeftRadius = "8px";
    bd.style.borderBottomRightRadius = "8px";
    document.getElementById("narrowspin").style.transform = "rotate(0)";
}
function handleDialogScheduleClose(){
    document.removeEventListener("evtSelectionDialogClose", handleDialogScheduleClose, false);
    document.removeEventListener("evtSelectionDialog", handleSelectionScheduleType, false);
}


function handleSelectionScheduleType(e){
    var type = e.selectedValue1;
    document.getElementById("type-schedule-value").innerHTML = type;
    var array = (gUserInfo.lang == 'EN') ? CONST_KEY_PERIODIC_FREQUENCY_EN : CONST_KEY_PERIODIC_FREQUENCY_VN;
    if(type === array[0]){
        //chi 1 lan
        document.getElementById("holder-date-transfer").style.display = "block";
        document.getElementById("holder-start-end-date").style.display = "none";
       // document.getElementById("holder-calendar-day-week").style.display = "none";
        document.getElementById("holder-calendar-pick").style.display = "none";
        document.getElementById("date-transfer").innerHTML = getDate("today");
    }else if(type === array[1]){
        //hang ngay
        document.getElementById("holder-start-end-date").style.display = "block";
       // document.getElementById("holder-calendar-day-week").style.display = "none";
        document.getElementById("holder-date-transfer").style.display = "none";
        document.getElementById("holder-calendar-pick").style.display = "none";
        document.getElementById("start-date-value").innerHTML = getDate("today");
    }else if (type === array[2]){
        //hang tuan
        document.getElementById("holder-start-end-date").style.display = "block";
       // document.getElementById("holder-calendar-day-week").style.display = "none";
        document.getElementById("holder-date-transfer").style.display = "none";
        document.getElementById("holder-calendar-pick").style.display = "none";
        document.getElementById("start-date-value").innerHTML = getDate("today");
    }else if(type === array[3]){
        //hang thang
        document.getElementById("holder-start-end-date").style.display = "block";
        document.getElementById("holder-date-transfer").style.display = "none";
       // document.getElementById("holder-calendar-day-week").style.display = "none";
        document.getElementById("holder-calendar-pick").style.display = "none";
        document.getElementById("start-date-value").innerHTML = getDate("today");
    }else if(type == array[4]){
        //hang nam
        document.getElementById("holder-start-end-date").style.display = "block";
        document.getElementById("holder-date-transfer").style.display = "none";
        //document.getElementById("holder-calendar-day-week").style.display = "none";
        document.getElementById("holder-calendar-pick").style.display = "none";
        document.getElementById("start-date-value").innerHTML = getDate("today");
    }

}

function changeStringToArrayDate(str){
    var array = new Array();
    if(str.indexOf("/") != -1){
        var tmp = str.split(",");
        for(var i = 0 ; i < tmp.length;i++){
            var d = tmp[i].split("/");
            array.push(new Date(parseInt(d[2]),parseInt(d[1]) -1,parseInt(d[0])));
        }
    }else{
        var today = getDate("today");
        var d = today.split("/");
        array.push(new Date(parseInt(d[2]),parseInt(d[1]),parseInt(d[0])));
    }
    return array;
}

function loadCalendarByType(e){
    e.childNodes[1].style.borderBottomLeftRadius = "0px";
    e.childNodes[1].style.borderBottomRightRadius = "0px";
    e.childNodes[3].style.transform = "rotate(90deg)";
   var checker = document.getElementById("warning-validate");
    if(checker != null){
        checker.innerHTML = "";
    }
   var type = e.id;
   var array = (gUserInfo.lang == 'EN') ? CONST_KEY_PERIODIC_FREQUENCY_EN : CONST_KEY_PERIODIC_FREQUENCY_VN;
   var schedulerType = document.getElementById("type-schedule-value").innerHTML;
   if(type === "holder-date-transfer"){
       var dayTransfer = document.getElementById("date-transfer").innerHTML;
       document.getElementById('holder-calendar-pick').style.display = "block";
      // document.getElementById('holder-calendar-day-week').style.display = "none";
       if(schedulerType !== array[0]){
           loadCalendarInline("calendar-pick",true,setDayTransfers,changeStringToArrayDate(dayTransfer));
       }else{
           loadCalendarInline("calendar-pick",false,setDayTransfers,changeStringToArrayDate(dayTransfer));
       }
   }else if(type === "startDate"){
       var startDateHtml = document.getElementById("start-date-value").innerHTML;
       document.getElementById('holder-calendar-picker').style.display = "block";
      // document.getElementById('holder-calendar-day-week').style.display = "none";
       loadCalendarInline("calendar-picker",false,setStartDateScheduleer,changeStringToArrayDate(startDateHtml));
   }else if(type === "endDate"){
       var endDateHtml = document.getElementById("end-date-value").innerText;
       document.getElementById('holder-calendar-pickers').style.display = "block";
       //document.getElementById('holder-calendar-day-week').style.display = "none";
       loadCalendarInline("calendar-pickers",false,setEndDateScheduleers,changeStringToArrayDate(endDateHtml));
   }
}
var calenderFistLoad=0;

function setDayTransfer(e){
    console.log("choose : " + e);
    var schedulerType = document.getElementById("type-schedule-value").innerHTML;
    var array = (gUserInfo.lang == 'EN') ? CONST_KEY_PERIODIC_FREQUENCY_EN : CONST_KEY_PERIODIC_FREQUENCY_VN;
    if(schedulerType != array[0]){
        document.getElementById("dayTransfer").value = e;
        document.getElementById("date-transfer").innerHTML = e;
    }else{
        if(calenderFistLoad != 0){
            document.getElementById("dayTransfer").value = e;
            document.getElementById("date-transfer").innerHTML = e;
            document.getElementById('calendar-pick').innerHTML = "";
            document.getElementById('holder-calendar-pick').style.display = "none";
            calenderFistLoad = 0;
        }else{
            calenderFistLoad = 1;
        }
    }
}
function setDayTransfers(e){
    console.log("choose : " + e);
    var schedulerType = document.getElementById("type-schedule-value").innerHTML;
    var array = (gUserInfo.lang == 'EN') ? CONST_KEY_PERIODIC_FREQUENCY_EN : CONST_KEY_PERIODIC_FREQUENCY_VN;
    if(schedulerType != array[0]){
        document.getElementById("dayTransfer").value = e;
        document.getElementById("date-transfer").innerHTML = e;
    }else{
        if(calenderFistLoad != 0){
            document.getElementById("dayTransfer").value = e;
            document.getElementById("date-transfer").innerHTML = e;
            document.getElementById('calendar-pick').innerHTML = "";
            document.getElementById('holder-calendar-pick').style.display = "none";
            document.getElementById("select-date-trans").style.borderBottomLeftRadius = "8px";
            document.getElementById("select-date-trans").style.borderBottomRightRadius = "8px";
            document.getElementById("narrowspin1").style.transform = "rotate(0deg)";
            calenderFistLoad = 0;
        }else{
            calenderFistLoad = 1;
        }
    }
}

function setStartDateSchedule(e){
    console.log("choose : " + e);
    if(calenderFistLoad != 0){
        document.getElementById("sDate").value = e;
        document.getElementById("start-date-value").innerHTML = e;
        document.getElementById('calendar-pick').innerHTML = "";
        document.getElementById('holder-calendar-pick').style.display = "none";
        calenderFistLoad=0;
    }else{
        calenderFistLoad = 1;
    }

}
function setStartDateScheduleer(e){
    console.log("choose : " + e);
    if(calenderFistLoad != 0){
        document.getElementById("sDate").value = e;
        document.getElementById("start-date-value").innerHTML = e;
        document.getElementById('calendar-picker').innerHTML = "";
        document.getElementById('holder-calendar-picker').style.display = "none";
        document.getElementById("select-startDate").style.borderBottomLeftRadius = "8px";
        document.getElementById("select-startDate").style.borderBottomRightRadius = "8px";
        document.getElementById("narrowspin2").style.transform = "rotate(0deg)";
        calenderFistLoad=0;
    }else{
        calenderFistLoad = 1;
    }

}

function setEndDateSchedule(e){
    console.log("choose : " + e);
    if(calenderFistLoad != 0){
        document.getElementById("eDate").value = e;
        document.getElementById("end-date-value").innerHTML = e;
        document.getElementById('calendar-pick').innerHTML = "";
        document.getElementById('holder-calendar-pick').style.display = "none";
        calenderFistLoad=0;
    }else{
        calenderFistLoad = 1;
    }
}
function setEndDateScheduleers(e){
    console.log("choose : " + e);
    if(calenderFistLoad != 0){
        document.getElementById("eDate").value = e;
        document.getElementById("end-date-value").innerHTML = e;
        document.getElementById('calendar-pickers').innerHTML = "";
        document.getElementById('holder-calendar-pickers').style.display = "none";
        document.getElementById("select-endDate").style.borderBottomLeftRadius = "8px";
        document.getElementById("select-endDate").style.borderBottomRightRadius = "8px";
        document.getElementById("narrowspin3").style.transform = "rotate(0deg)";
        calenderFistLoad=0;
    }else{
        calenderFistLoad = 1;
    }
}
function createDialogApptext(titler, Text, cancelText, okText){
        notificationdialog = new NotificationDialog({
            type:2,
            title: titler,
            contentMessage:Text,
            isCloseShow: true,
            cancel: cancelText,
            agree: okText,
            parentNote:""
        });
        notificationdialog.setParentShow("mainview");
        notificationdialog.setCallback(function(param){
            console.log("setCallbackAgree " +param);
        });

        notificationdialog.onCreateDialog();

    }

function showAlertAppText1(inTitle, inContent, inBtnCancelTitle,inBtnOKTitle , inImgAlertSrc) {
    hiddenKeyBoard();
    var alertTitle = document.getElementById("alert-title");
    alertTitle.innerHTML = inTitle;

    var alertContent = document.getElementById("alert-app-content");
    alertContent.innerHTML = inContent;

    //OK button
    if (inBtnOKTitle && inBtnOKTitle.length > 0) {
        document.getElementById('btnAlertAppOk').value = inBtnOKTitle;
    }
    //Cancel button
    if (inBtnCancelTitle && inBtnCancelTitle.length > 0) {
        document.getElementById('btnAlertAppCancel').value = inBtnCancelTitle;
    }
    var alertdg = document.getElementById("alert-app-confirm");
    alertdg.style.display = "block";
    alertdg.style.zIndex = 2010;

    //setTimeout(function (e) {
    alertdg.style.opacity = 1;
    if (!Environment.isMobile()) {
        if (alertdg.getElementsByTagName('input')[1]) alertdg.getElementsByTagName('input')[1].focus();
    }
    // var alertTitle = document.g    //     document.getElementById('btnAlertAppOk').value = inBtnOKTitleetElementById('alert-title');
    // var alertContent = document.getElementById("alert-app-content");
    /*if(inImgAlertSrc && inImgAlertSrc.length > 1) {
     //<img width="50" height="50" style="border:1px solid #000;display: inline;margin: 5px;">
     alertContent.innerHTML = '<img width="50" height="50" style="border:1px solid #000;margin: 5px 5px 5px 0px;" src=\'' + inImgAlertSrc + '\'>' + inContent;
     alertContent.style.padding = "15px 15px 15px 5px";
     }
     else {*/

    // alertTitle.innerHTML = inTitle;
    // alertContent.innerHTML = inContent;
    // }

        //OK button
    // if (inBtnOKTitle && inBtnOKTitle.length > 0) {
    //     document.getElementById('btnAlertAppOk').value = inBtnOKTitle;

    //Cancel button
    // if (inBtnCancelTitle && inBtnCancelTitle.length > 0) {
    //     document.getElementById('btnAlertAppCancel').value = inBtnCancelTitle;
    // }
    // var alertdg = document.getElementById("alert-app-confirm");
    // alertdg.style.display = "block";
    // alertdg.style.zIndex = 2010;

    // //setTimeout(function (e) {
    // alertdg.style.opacity = 1;
    // if (!Environment.isMobile()) {
    //     if (alertdg.getElementsByTagName('input')[1]) alertdg.getElementsByTagName('input')[1].focus();
    // }

    // }, 300);
}



function dateIsPast(dateSelected,dateCompare){
    var tmp = dateSelected.split("/");
    var d1 = Date.parse(tmp[2] + "-" + "-" + tmp[1] + "-" + tmp[0]);
    tmp = dateCompare.split("/");
    var d2 = Date.parse(tmp[2] + "-" + "-" + tmp[1] + "-" + tmp[0]);
    if (d1 < d2) {
        return true;
    }
    return false;
}

function getFlag(dateSelected,dateCompare){
    var tmp = dateSelected.split("/");
    var d1 = Date.parse(tmp[2] + "-" + "-" + tmp[1] + "-" + tmp[0]);
    tmp = dateCompare.split("/");
    var d2 = Date.parse(tmp[2] + "-" + "-" + tmp[1] + "-" + tmp[0]);
    if(d1 > d2){
        return "FUR";
    }
    return "PRD";
}

function compare8number(account1,accoutn2){
    if (account1.substring(0, 8).indexOf(accoutn2.substring(0, 8)) != -1) {
        return true;
    }
    return false;
}
function closeAllDialogOfModalLibrary() {
    var modalFull = document.getElementById('myModalFullDialog');
    var modalFullSecond = document.getElementById('myModalFullDialog-second');
    var modalAlert = document.getElementById('myModalDialog');
    if (modalFull != undefined) {
        modalFull.style.display = "none";
    }
    if (modalFullSecond != undefined) {
        modalFullSecond.style.display = "none";
    }
    if (modalAlert != undefined) {
        modalAlert.style.display = "none";
    }
}

function MenuBottom(title, icon) {
    this.title = title;
    this.icon = icon;
    this.keyLang = title;
}

/***********Process double & delay click event***********/
var clickDelay = 1;
function handleOnClickToBlockDoubleClick(jsFunc) {
    if (clickDelay) clearTimeout(clickDelay);
    clickDelay = setTimeout(function() {
        var listFuncs = jsFunc.split(';');
        for(var i=0;i<listFuncs.length;i++){
            var funcToProcess = listFuncs[i];
            if(funcToProcess.trim().length > 0){
                var funcDetail = funcToProcess.trim().split('(');
                var funcNameAsString = funcDetail[0];

                var namespaces = funcNameAsString.split(".");
                var funcNameFinal = namespaces.pop();
                var context = window;
                for(var j = 0; j < namespaces.length; j++) {
                    context = context[namespaces[j]];
                }

                var funcArgsAsString = typeof (funcDetail[1]) == 'undefined' ? undefined : funcDetail[1].substring(0,funcDetail[1].length - 1);
                var args = new Array();
                if(funcArgsAsString){
                    var argNameArray = funcArgsAsString.split(',');
                    for(var k=0;k<argNameArray.length;k++){
                        if(argNameArray[k].trim().charAt(0) == '\'' || argNameArray[k].trim().charAt(0) == '"'){
                            args[k] = argNameArray[k].trim().substring(1,argNameArray[k].trim().length - 1);
                        }else if(argNameArray[k].toUpperCase().trim() =='TRUE'){
                            args[k] = true;
                        }else if(argNameArray[k].toUpperCase().trim() =='FALSE'){
                            args[k] = false;
                        }
                        else{
                            args[k] = window[argNameArray[k]];
                        }
                    }
                }
                context[funcNameFinal].apply(context, args);
            }
        }
    }, 500);
};

/***********RIPPLE EFFECT START***********/
var isCssSupport = (function() {
    var div = document.createElement('div'),
        vendors = 'Khtml Ms O Moz Webkit'.split(' '),
        len = vendors.length;

    return function(prop) {
        if ( prop in div.style ) return true;

        prop = prop.replace(/^[a-z]/, function(val) {
            return val.toUpperCase();
        });

        while(len--) {
            if ( vendors[len] + prop in div.style ) {
                // browser supports box-shadow. Do what you need.
                // Or use a bang (!) to test if the browser doesn't.
                return true;
            }
        }
        return false;
    };
})();

if(window.addEventListener) {
    document.addEventListener('mousedown',processMouseDownEvent,false);
}
else if(window.attachEvent) {
    document.attachEvent('onmousedown',processMouseDownEvent);
}

function processMouseDownEvent(e){
    //LamPT tam thoi disable wave effect do chua xu ly duoc tren mot so may bi loi
    return;
    //----------------
//    if(isCssSupport('animation')){
//        startRippleEffect(e);
//    }
}



function startRippleEffect(e) {
    e = e || window.event;
    if (e) {
        var mouseOffsetToFinalTarget = {
            X: e.offsetX,
            Y: e.offsetY
        };
        var el = e.target;
        while (el) {
            if ((el.tagName == "DIV" || el.tagName == "TD" || el.tagName == "LI")  && el.getAttribute('class')) {
                if(el.getAttribute('class').indexOf('ripple-add-on') != -1){
                    var buttonWidth = el.clientWidth;
                    var buttonHeight = el.clientHeight;

                    var newNode = document.createElement('span');
                    newNode.className = 'ripple-span';

                    el.appendChild(newNode);
                    // Make it round!
                    if (buttonWidth >= buttonHeight) {
                        buttonHeight = buttonWidth;
                    } else {
                        buttonWidth = buttonHeight;
                    }

                    var x = mouseOffsetToFinalTarget.X - buttonWidth / 2;
                    var y = mouseOffsetToFinalTarget.Y - buttonHeight / 2;

                    newNode.className += " " + "ripple-span-effect";
                    newNode.style.width = buttonWidth + "px";
                    newNode.style.height = buttonHeight + "px";
                    newNode.style.top = y + "px";
                    newNode.style.left = x + "px";

                    setTimeout(function(){
                        //remove span affter effect finish
                        var spans = el.getElementsByTagName("span");
                        var len = spans.length;
                        for (var i = 0; i < len; i++) {
                            if(spans[i]){
                                if (spans[i].className.toLowerCase() == "ripple-span ripple-span-effect") {
                                    spans[i].parentNode.removeChild(spans[i]);
                                }
                            }
                        }
                    },1000);

                    return;
                }
            }else{
                mouseOffsetToFinalTarget.X = mouseOffsetToFinalTarget.X + el.offsetLeft;
                mouseOffsetToFinalTarget.Y = mouseOffsetToFinalTarget.Y + el.offsetTop;
            }
            el = el.parentNode;
        }
    }
}


function changeSwitchUI(e){
    console.log("-->>changeSwitchUI")
    console.log(e)
    if(e == null){
        return;
    }
    var tmpCheckNode = e.getElementsByTagName('input')[0];
    var switchBackground = e;
    var switchHandle = e.getElementsByClassName("custom-switch-handle")[0];
    var switchLabel = e.getElementsByClassName("custom-switch-label")[0];

    if(switchBackground != null){
        console.log("-->>switchBackground")
        if(!tmpCheckNode || (tmpCheckNode && tmpCheckNode.checked)) {
            console.log("-->>tmpCheckNode");
            console.log(switchHandle.classList);
            // switch
            if(!switchBackground.classList.contains('custom-switch-on')){
                switchBackground.classList.add('custom-switch-on');
                switchBackground.getElementsByClassName("custom-switch-label").innerHTML = "on";
                console.log("-->>1")
            }
            if(switchBackground.classList.contains('custom-switch-off')){
                switchBackground.classList.remove('custom-switch-off');
                console.log("-->>2")
            }
            // handle
            if(!switchHandle.classList.contains('custom-switch-handle-on')){
                switchHandle.classList.add('custom-switch-handle-on');
                console.log("-->>3")
            }else{
                /** bat truong hop  custom-switch-handle-on la true **/
                if(!switchBackground.classList.contains('custom-switch-off')){
                    switchBackground.classList.add('custom-switch-off');
                    switchBackground.getElementsByClassName("custom-switch-label").innerHTML = "off";
                    console.log("custom-switch-handle-on -->>1")
                }
                if(switchBackground.classList.contains('custom-switch-on')){
                    switchBackground.classList.remove('custom-switch-on');
                    console.log("custom-switch-handle-on -->>2")
                }
                // handle
                if(!switchHandle.classList.contains('custom-switch-handle-off')){
                    switchHandle.classList.add('custom-switch-handle-off');
                    console.log("custom-switch-handle-on -->>3")
                }
                if(switchHandle.classList.contains('custom-switch-handle-on')){
                    switchHandle.classList.remove('custom-switch-handle-on');
                    console.log("custom-switch-handle-on -->>4")
                }
                // label
                switchLabel.innerHTML = "off";
                if(!switchLabel.classList.contains('custom-switch-label-off')){
                    switchLabel.classList.add('custom-switch-label-off');
                    console.log(" custom-switch-handle-on -->>5")
                }
                if(switchLabel.classList.contains('custom-switch-label-on')){
                    switchLabel.classList.remove('custom-switch-label-on');
                    console.log("custom-switch-handle-on -->>6")
                }

            }
            if(switchHandle.classList.contains('custom-switch-handle-off')){
                switchHandle.classList.remove('custom-switch-handle-off');
                console.log("-->>4")
            }

            // label
            switchLabel.innerHTML = "on";
            if(!switchLabel.classList.contains('custom-switch-label-on')){
                switchLabel.classList.add('custom-switch-label-on');
                console.log("-->>6")
            }
            if(switchLabel.classList.contains('custom-switch-label-off')){
                switchLabel.classList.remove('custom-switch-label-off');
                console.log("-->>7")
            }
        } else {
            if(!switchBackground.classList.contains('custom-switch-off')){
                switchBackground.classList.add('custom-switch-off');
                switchBackground.getElementsByClassName("custom-switch-label").innerHTML = "off";
                console.log("-->>1")
            }
            if(switchBackground.classList.contains('custom-switch-on')){
                switchBackground.classList.remove('custom-switch-on');
                console.log("-->>2")
            }
            // handle
            if(!switchHandle.classList.contains('custom-switch-handle-off')){
                switchHandle.classList.add('custom-switch-handle-off');
                console.log("-->>3")
            }
            if(switchHandle.classList.contains('custom-switch-handle-on')){
                switchHandle.classList.remove('custom-switch-handle-on');
                console.log("-->>4")
            }
            // label
            switchLabel.innerHTML = "off";
            if(!switchLabel.classList.contains('custom-switch-label-off')){
                switchLabel.classList.add('custom-switch-label-off');
                console.log("-->>5")
            }
            if(switchLabel.classList.contains('custom-switch-label-on')){
                switchLabel.classList.remove('custom-switch-label-on');
                console.log("-->>6")
            }
        }
    }
}


function getDescType(str){
    var array = (gUserInfo.lang == 'EN') ? CONST_KEY_PERIODIC_FREQUENCY_EN : CONST_KEY_PERIODIC_FREQUENCY_VN;
    for(var i = 0 ; i < array.length;i++){
        if(array[i] === str){
            var tmp = CONST_VAL_PERIODIC_FREQUENCY;
            return tmp[i];
        }
    }
}

function convertDateToService(str){
    var tmpDate = str.split("/");
    var date = tmpDate[2]+tmpDate[1]+tmpDate[0];//thoi gian chuyen
    return date;
}


/*********NamNH5 bo sung lam calendar common*********/


function callbackCloseDialogCal(param){
    console.log('load calendar done : ' + param);
    if (comCalendar != "" || comCalendar != null)
    {
        var noteContent = document.getElementById(comCalendar);
        if(noteContent !=undefined){
            noteContent .value = param;
        }
    }
    //bottomBar.resumeView('esaving/future-esaving-open-scr','testgame');
    actionbar.showActionBar();
}

var flagCal = 0;

function initDialogCal(divappend){
    comCalendar = divappend;
    var content = document.getElementById(divappend);
    var valueDate = null;
    if(content!=undefined){
          var value = content.value;
          if(value!=undefined && value.length>0 ){
              var arr = new Array(); arr = value.split('/');
              console.log(value);
              valueDate = new Date(arr[2],(arr[1]-1),arr[0]);
          }

    }

     if (flagCal == 0)
    {
        loadCalendar(false,callbackCloseDialogCal,valueDate);
        flagCal = 1;
     }
    showCalendar();



}

/***********RIPPLE EFFECT END***********/


/***function for all transfer page ****/
function replaceAt(str , character)  {
    var tempArr = str.split("%s");
    var resultArr = str.split("%s");
    console.log(tempArr);
    character = character.reverse()
    var s = 1;
    for (var i = 0; i < tempArr.length; i++){

        if (character.length > 0)
        {
            var stringChange = character.pop();

            resultArr.splice(i+s, 0, stringChange);
            s +=1
        }
    }

    return resultArr.join("");
}


function showDescriptionTransfer(obj){
    var array =(gUserInfo.lang == 'EN') ? CONST_KEY_PERIODIC_FREQUENCY_EN : CONST_KEY_PERIODIC_FREQUENCY_VN;
    var html = ""
    if(obj.type === array[0]){
        html = replaceAt(CONST_STR.get('DESCRIPTION_TRANSFER_ONCE_TIME') + " %s", [obj.dayTransfer]);
    }else if(obj.type === array[1]){
        html = replaceAt(CONST_STR.get('DESCRIPTION_TRANSFER_DAILY') + " %s "+CONST_STR.get('DESCRIPTION_TRANSFER_TO_DATE') + " %s", [obj.startDate, obj.endDate ]);
    }else if(obj.type === array[2]){
        var array = (gUserInfo.lang == 'EN') ? CONST_KEY_CALENDAR_DAYNAME_EN : CONST_KEY_CALENDAR_DAYNAME_VN;
        html = replaceAt( CONST_STR.get('DESCRIPTION_TRANSFER_WEEKLY') +" %s "+CONST_STR.get('DESCRIPTION_TRANSFER_TO_DATE') + " %s", [obj.startDate, obj.endDate ]);

    }else if(obj.type === array[3]){
        html = replaceAt(CONST_STR.get('DESCRIPTION_TRANSFER_MONTHLY') + " %s " +CONST_STR.get('DESCRIPTION_TRANSFER_TO_DATE')+" %s ", [obj.startDate, obj.endDate ]);
    }else if(obj.type === array[4]){
        html = replaceAt(CONST_STR.get('DESCRIPTION_TRANSFER_YEARLY') + " %s "+CONST_STR.get('DESCRIPTION_TRANSFER_TO_DATE')+" %s ", [obj.startDate, obj.endDate ]);
    }
    document.getElementById('schedule.information').innerHTML = "<span>"+html+"</span>" ;
    document.getElementById('trans.schedule.information').style.display = "";
}


function searchListArr(idDivList, arr, keyword, parserService, fieldsRow, fieldsHidden,  button, doubleClickItem, nonTop) {
    var strKeyword = keyword.value;
    var arrSearchTmp = new Array();

    for(var i in arr) {
        for(var val in arr[i]){
            if(arr[i][val] !== undefined){
                var str = arr[i][val].toLowerCase();
                if(arr[i][val].toLowerCase().search(strKeyword.toLowerCase()) >= 0)
                {
                    arrSearchTmp.push(arr[i]);
                    break;
                }
            }
        }
    }
    genScreen(idDivList, arrSearchTmp, parserService,
        fieldsRow ,
        fieldsHidden,  button, doubleClickItem, nonTop
    );
}

function genScreen(idDivList, respArr, parserService, fieldsRow, fieldsHidden, button, doubleClickItem,nonTop) {

    //define width button
    var maxWidthButton=0;
    if(button != null){
        maxWidthButton= 50 * button.length;
    }

    if(nonTop != undefined && nonTop == true)
    {
        respArr = respArr;
    }
    else{
        //respArr = respArr.slice(0, 10);
    }

    // List View
    var list = new ListView({
        data :  respArr,
        idParent: "list-view-search",
        parserService : parserService,
        fieldsRow : fieldsRow,
        fieldsHidden : fieldsHidden,
        fieldsFomatCurrency: ['amount'],
        avatar : {status: true},
        option : "default",
        numberRecords :10,
        maxWidthButton : maxWidthButton,
        doubleClickItem : doubleClickItem || null, // la function
        button : button || [
            { name : 'func', icon : 'icon-exit', action: function(id){
                console.log('func' + id);

            }, type: 'func'},
            { name : 'link', icon : 'icon-help', action: 'google.com', type: 'link'},
            { name : 'delete', icon : 'icon-help', action: function(id){
                console.log('delete' + id);
                var pValue = document.getElementById(id).getElementsByClassName("p-value")[0];
            }, type: 'delete'}
        ]
    });

    var div = document.getElementById(idDivList);
    list.showList(div);

    hideLoadingMask();
    //
}

function resultListNull(idDivList){
    var div = document.getElementById(idDivList);
    if(!div) return;
    var divNull= document.createElement("div");
    divNull.innerHTML = CONST_STR.get('NO_RESULT_SEARCH');
    divNull.style.textAlign = "center";
    divNull.style.padding = "10px";
    div.innerHTML ="";
    div.appendChild(divNull);
}

function showPopUpDetail(event, content , pBottomOffset) {
    var hint = document.getElementById("hint-info-dialog");
    hint.className = "list-view-detail " + hint.className.replace("list-view-detail ","");

    document.getElementById("search_dialog").innerHTML = content;

    hint.style.display = "block";
    hint.style.zIndex = 2011;
    if (!event) {
        event = window.event;
    }
    var hinttip = document.getElementById("search_dialog");

    hinttip.style.top =  pBottomOffset +  "px";

    var left = event.clientX - hinttip.clientWidth / 2;
    if (left < 0 || screen.width < 450) left = 0;
    if (screen.width < 450) hinttip.style.width = screen.width + "px";
    if ((left + hinttip.clientWidth) > clientWidth) {
        left = clientWidth - hinttip.clientWidth;
    }
    var screenHeight = (window.screen.height +150)/2;

    var top = screenHeight < (pBottomOffset )? pBottomOffset  - hinttip.clientHeight - 50 : pBottomOffset - 15 ;

    hinttip.style.top =  top  +  "px";

}

function getObjectValue(parent){
    // ham lay gia tri an trong row

    var resultObj = {};
    try{
        var nodeList = parent.getElementsByClassName("p-value")[0].childNodes;
        for(var i = 0 ; i < nodeList.length; i++  ){
            var nameField = nodeList[i].className.replace("p-value-","").replace(" break-slide","");
            resultObj[nameField] = nodeList[i].innerHTML;

        }
        return resultObj;
    }catch(e){
        console.log("loi khong lay duoc gia tri");
    }
    return null;
}


function initObjectServiceList(arrService,fieldsName){
    // ham parse tao object co service
    var lenArrService = arrService.length;
    var resultsObject= [];
    for(var i=0;i<lenArrService ; i++){
        var arrTemp = arrService[i].split("#");
        var dictTemp = {};
        for(var j=0; j< fieldsName.length; j++)
        {
            dictTemp[fieldsName[j]] = arrTemp[j];
        }
        resultsObject.push(dictTemp);
    }
    return resultsObject;
}


function checkInArray(arrData,value)
{
    var i;
    for (i=0; i < arrData.length; i++)
    {
        if (arrData[i] == value)
        {
            return true;
        }
    }
    return false;
}

function updateDayTransferScreen(idSpan,dayTransfer){
    try{
        var holder = document.getElementById(idSpan);
        var content = holder.innerText;
        content =  dayTransfer;
        holder.innerText = content;
    }catch(e){

    }
}
//-----------DucNT.Fsoft-------
function ChangeImg(index){
    if (gModeScreenView == CONST_MODE_SCR_SMALL) {
        for(var i=1;i<=24;i++) {
            var url= "url('./assets/images/back-ground/mb/";
            var image= i+ ".jpg')" ;

    if(index==i){
        document.getElementsByClassName("gradient-background-layer-0")[0].style.backgroundImage=url+image ;

    }
        }
}
else{
            for(var i=1;i<=18;i++) {
                var url= "url('./assets/images/back-ground/ib/";
                var imageib= i+ ".jpg')" ;
    if(index==i){
        document.getElementsByClassName("fullPage")[0].style.backgroundImage=url+ imageib;
    }
}
    }}

//SangNT1 init menu
function initMenuDetail(inID) {
    for(var i = 0;i < menuIdArray.length; i++){
        if(inID == menuIdArray[i]){
            MenuHome(menuIdArray[i],'textMenu_'+i);
        }
    }
	closeAllDialogOfModalLibrary();
	function MenuContent() {
		this.title = "";
		this.icon = "";
		this.src = "";
		this.color = "";
		this.keyLang = "";
	}
    var arrHeader = new Array();
    var arrFooter = new Array();
	var arrBottom = new Array();
	var contentItem;
	var item;

	console.log("inID " + inID);
	if (inID == "mAccInfo" || inID == "jumboAcc" || inID =="esaving") {
		checkJumbo(function () {
			for (var i = 0; i < gMenuList.length; i++) {
				item = gMenuList[i];
				console.log("item.menuID " +item.menuID);
				if (item.parentMenuID == inID && item.hiddenStatus == 'N') {
					contentItem = new MenuContent();
					contentItem.title = CONST_STR.get(item.keyLang);
					contentItem.keyLang = item.keyLang;
					contentItem.icon = item.iconCode;
					contentItem.src = item.onClick + ";setTitleBar('" + CONST_STR.get(item.keyLang) + "');";
                    contentItem.src = "handleOnClickToBlockDoubleClick('" + contentItem.src.replace(/'/g , "\\'") +"');";
					contentItem.color = item.color;
					if (inID == "mAccInfo") {
						if (item.menuID != "liJumboCreateAccNew" && item.menuID != "liJumboAccInfoNew" ) {
							if (item.ismainmenu == "C") {
								arrHeader.push(contentItem);
							} else {
								arrFooter.push(contentItem);
							}
							if (item.isbottombar == "Y") {
								arrBottom.push(contentItem);
							}
						}

					} else if (inID == "jumboAcc") {
						if (item.menuID != "liJumboCreateAcc") {
							if (item.ismainmenu == "C") {
								arrHeader.push(contentItem);
							} else {
								arrFooter.push(contentItem);
							}
							if (item.isbottombar == "Y") {
								arrBottom.push(contentItem);
							}
						}
					}else if(inID == "esaving"){
							if (item.ismainmenu == "C") {
								arrHeader.push(contentItem);
							}else{
								arrFooter.push(contentItem);
							}
							if (item.isbottombar == "Y") {
								arrBottom.push(contentItem);
							}
					}



				}
			}
			genSlidePushtoView(inID, arrHeader, arrFooter, arrBottom);
		}, function () {
			for (var i = 0; i < gMenuList.length; i++) {
				item = gMenuList[i];
				console.log("item.menuID " +item.menuID);
				if (item.parentMenuID == inID && item.hiddenStatus == 'N') {
					contentItem = new MenuContent();
					contentItem.title = CONST_STR.get(item.keyLang);
					contentItem.icon = item.iconCode;
					contentItem.keyLang = item.keyLang;
					contentItem.src = item.onClick + ";setTitleBar('" + CONST_STR.get(item.keyLang) + "');";
                    contentItem.src = "handleOnClickToBlockDoubleClick('" + contentItem.src.replace(/'/g , "\\'") +"');";
					contentItem.color = item.color;

					if (inID == "mAccInfo") {
						if (item.menuID != "liJumboAccInfoNew") {
							if (item.ismainmenu == "C") {
								arrHeader.push(contentItem);
							} else {
								arrFooter.push(contentItem);
							}
							if (item.isbottombar == "Y") {
								arrBottom.push(contentItem);
							}
						}

					} else if (inID == "jumboAcc") {
						console.log("item.menuID " +item.menuID);
						if (item.menuID != "liJumboAccUnreg" && item.menuID != "liJumboCreateAutoSaving" && item.menuID != "liJumboAccInfo" && item.menuID != "liJumboCreditApplyLimit" && item.menuID != "liJumboSavingApplyLimit") {
							console.log("item.menuID 2" +item.menuID);
							if (item.ismainmenu == "C") {
								arrHeader.push(contentItem);
							} else {
								arrFooter.push(contentItem);
							}
							if (item.isbottombar == "Y") {
								arrBottom.push(contentItem);
							}
						}
					}else if(inID == "esaving"){
						if (item.menuID != "liAutoSaving") {
							if (item.ismainmenu == "C") {
								arrHeader.push(contentItem);
							} else {
								arrFooter.push(contentItem);
							}
							if (item.isbottombar == "Y") {
								arrBottom.push(contentItem);
							}
						}
					}


				}
			}
			genSlidePushtoView(inID, arrHeader, arrFooter, arrBottom);
		});



	}
	else {
		for (var i = 0; i < gMenuList.length; i++) {
			item = gMenuList[i];

			if (item.parentMenuID == inID && item.hiddenStatus == 'N') {
				contentItem = new MenuContent();
				contentItem.title = CONST_STR.get(item.keyLang);
				contentItem.icon = item.iconCode;
                var title=CONST_STR.get(item.keyLang);
				contentItem.src = item.onClick + ";setTitleBar('" + title + "');";
                contentItem.src = "handleOnClickToBlockDoubleClick('" + contentItem.src.replace(/'/g , "\\'") +"');";
				contentItem.color = item.color;
				contentItem.keyLang = item.keyLang;
				console.log("item.onClick "+item.onClick);
				if (item.ismainmenu == "C") {
					arrHeader.push(contentItem);
				} else if (item.ismainmenu == "P") {
					arrFooter.push(contentItem);
				}
				if (item.isbottombar == "Y") {
						arrBottom.push(contentItem);
				} else {

				}

			}
		}
		genSlidePushtoView(inID, arrHeader, arrFooter, arrBottom);
	}
}
//lapnv add style onclick .menu-layout-contents
function MenuHome(MenuStyle,textStyle){
    if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
        for (var i = 0; i < gMenuUserOrder.length; i++){
            var colorMenu = document.getElementById('textMenu_'+ i);
            if(gMenuUserOrder[i] != ""){
                document.getElementById(gMenuUserOrder[i]).setAttribute('class','menu-style-li');
                colorMenu.style.color ='#424242';
            }
        }
        // document.getElementById(textStyle).style.color = '#f69013';
        // document.getElementById(MenuStyle).setAttribute('class','');
        // document.getElementById(MenuStyle).className += " bg-transparent";
        var noteText =  document.getElementById(textStyle);
        var noteMenuStyle =  document.getElementById(MenuStyle);
        if(noteText!=undefined){
            noteText.style.color = '#ff8c29';
        }

        if(noteMenuStyle!=undefined){
            noteMenuStyle.setAttribute('class','');
            noteMenuStyle.className += " bg-transparent";
        }
    }
}
function setTitleBar(title) {
    navController.getActionBar().setTitleBarOnly(title);
}
function genSlidePushtoView(inID,arrHeader, arrFooter,arrBottom) {
	var menuslide = new MenuSlide({
        numberIteminLine: 3,
        maxLinePageSlide: 2,
        classItemSlide: "swiper-slide",
        classWrapContent: "swiper-wrapper",
        classSwiperPageinationHeader: "swiper-pagination_header",
        classSwiperPageinationFooter: "swiper-pagination_footer",
        classHeader: "swiper-menu-header",
        classFooter: "swiper-menu-footer",
        classTableRow: "swiper-menu-tablerow",
        classTableItem: "icon-div-menuslide-item",
		classTableItemIcon: "swiper-menu-item-icon ripple-add-on",
        classTableItemText: "swiper-menu-item-text",
		itemClick: "gotoItemAction"
    });
	menuslide.addHeaderContent(arrHeader);
	menuslide.addFooterContent(arrFooter);

	gDynamicMenu ="<div id='homedynamic_contentslide'>"+ menuslide.contentHTML()+"</div>";


	navController.pushToViewAndRemoveAllOtherPageAndInitBottomBar('menuxsl/dynamic-menu-scr', 'menuxsl/dynamic-menu-scr', inID, arrBottom, true, 'html');
}
function checkJumbo(callbackJumboSuccess,callbackJumboFail) {
	var arrayArgs = new Array();
	var isJumbo;
	var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
	data = getDataFromGprsCmd(gprsCmd);
	requestBacgroundMBService('CMD_CHECK_EXIST_JUMBO_ACC', arrayArgs, function (e) {
		gprsResp = parserJSON(e);
		if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
			if (gprsResp.arguments[0] == 'N') {
				gJumboAccExistedStat = false;
				//gliItemJumbo = liItem;
				gJumboAccInfo = gprsResp.arguments;
				callbackJumboFail();

			} else {
				gJumboAccExistedStat = true;
				callbackJumboSuccess();
			}
		}
	},function (e) {
		callbackJumboFail();
	});
	return isJumbo;

}

function checkScreenisMobilePX(){
    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if(screenWidth>800){
        return false;
    }else{
        return true;
    }
}
//ThanhHC add swipedetect
function swipedetect(el, callback){

    var touchsurface = el;
    var swipedir;
    var startX;
    var startY;
    var distX;
    var distY;
    var threshold = 5; //required min distance traveled to be considered swipe
    var restraint = 10; // maximum distance allowed at the same time in perpendicular direction
    var allowedTime = 800; // maximum time allowed to travel that distance
    var elapsedTime;
    var startTime;
    var handleswipe = callback || function(swipedir){};

    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0];
        swipedir = 'none';
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
        e.preventDefault();
    }, false);

    touchsurface.addEventListener('touchmove', function(e){
        e.preventDefault(); // prevent scrolling when inside DIV
    }, false);

    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime; // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir,touchsurface);
        e.preventDefault();
    }, false);
}
//ThanhHC add swipedetect end

//ThanhHC check empty object
// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
//ThanhHC check empty object end


//Sangnt1 add parse useragent
function getNavigatorInfoUser(){
     var parser = new UAParser();
     var uastring = navigator.userAgent;
     parser.setUA(uastring);
     var browerName ="";
     var browserVersion="";
     var deviceName="";
     var deviceModel="";
     var deviceType="";
     var osname="";
     var latitude="";
     var longitude="";
    var result = parser.getResult();
    var address = "";
    // alert("browser " + JSON.stringify(result.browser) + " result.device " + JSON.stringify(result.device) +" result.os " + JSON.stringify(result.os) +" result.os.version "
    // + JSON.stringify(result.os.version) +" result.engine.name" + JSON.stringify(result.engine.name )
    // +" result.cpu.architecture " + JSON.stringify(result.cpu.architecture)  );
    if(result.browser.name != undefined){
         browerName  = result.browser.name;
    }
      if(result.browser.version != undefined){
        browserVersion = result.browser.version;
      }
       if(result.device.vendor != undefined){
        deviceName = result.device.vendor;
       }
       if(result.device.model != undefined){
            deviceModel = result.device.model;
       }
      if(result.device.type != undefined){
            deviceType = result.device.type;
      }
       if(result.os.name != undefined){
        osname = result.os.name;
       }
       if(result.os.version != undefined){
        osversion = result.os.version;
       }

    if (navigator.geolocation && localStorage.latitude==undefined && localStorage.longitude==undefined && localStorage.address == undefined) {
        navigator.geolocation.getCurrentPosition(function(location) {
            latitude = location.coords.latitude;
            longitude = location.coords.longitude;
            localStorage.latitude = latitude;
            localStorage.longitude=longitude;

            if(latitude !=undefined && longitude!=undefined){
                 var latlng = new google.maps.LatLng(latitude, longitude);
                  var geocoder= new google.maps.Geocoder();
                    geocoder.geocode({'latLng': latlng}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {

                         if (results[1]) {
                           console.log(results[0].formatted_address);
                            address = results[0].formatted_address;
                            localStorage.address = address;
                         }


                    }
                });
            }

        });
    }else{
        if(localStorage.latitude != undefined){
            latitude =   localStorage.latitude ;
        }
        if(localStorage.longitude != undefined){
            longitude =  localStorage.longitude;
         }
        if(localStorage.address != undefined){
            address =   localStorage.address;
        }
    }
  var screenSize = '';
        if (screen.width) {
            width = (screen.width) ? screen.width : '';
            height = (screen.height) ? screen.height : '';
            screenSize += '' + width + " x " + height;
        }
    var deviceId = "";
    if(typeof device !== 'undefined'){
        deviceId =   device.uuid ;
    }
  var localUUID ="";
  if(localStorage.localUUID!=undefined){
      localUUID = localStorage.localUUID;
  }
  //var content= deviceId +"#"+localUUID +"#"+browerName +"#"+ browserVersion + "#"+deviceName+ "#"+deviceModel+ "#"+deviceType+ "#"+osname+ "#"+osversion +"#"+screenSize+"#"+latitude +"#"+longitude;
   console.log(deviceId +"#"+localUUID +"#"+browerName +"#"+ browserVersion + "#"+deviceName+ "#"+deviceModel+ "#"+deviceType+ "#"+osname+ "#"+osversion +"#"+screenSize+"#"+latitude +"#"+longitude+"#"+address);
   console.log(navigator.userAgent);
  // var content = localUUID +"~"+ deviceId+"~"+browerName +"~"+ browserVersion + "~"+deviceName+ "~"+deviceModel+ "~"+deviceType+ "~"+osname+ "~"+osversion +"~"+screenSize+"~"+latitude +"~"+longitude;
    var content = localUUID +"~"+ deviceId+"~"+browerName +"~"+ browserVersion + "~"+deviceName+ "~"+deviceModel+ "~"+deviceType+ "~"+osname+ "~"+osversion +"~"+screenSize+"~"+latitude +"~"+longitude+"~"+address;
    return content;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  var sdate = new Date();
  var time = sdate.getTime();
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()+'-'+time;
}

function transTypeName(cmd) {
    if (gUserInfo.lang == 'VN'){
        return CONST_TRANFER_TYPE_VN[cmd];
    }else {
        return CONST_TRANFER_TYPE_EN[cmd];
    }
}

function clearCachedPagePushToView(page) {
    navCachedPages[page] = null;
    navController.pushToView(page, true, 'html')
}

function clearCachedPageToPopView(page) {
    if(navCachedPages[page] != null || navCachedPages[page] != undefined){
        navCachedPages[page] = null;
        navController.popToView(page, true)
    }else {
        navCachedPages[page] = null;
        navController.pushToView(page, true, 'html')
    }
}

function clearCachedPageToView(page) {
    navCachedPages[page] = null;
    navController.pushToView(page, true, 'html')
}

function settingViewFromAuth() {
    document.getElementById('navActionbar').style.height = '44px';
    document.getElementById('navActionbar').style.background = 'rgba(255, 255, 255, 0)';
    // document.getElementById('navActionbar').style.borderBottom = 'none';
    document.getElementById('nav.headerbar').style.display = 'none';

}

// Thuc hien format lai chuoi message
function formatString(sourceString, itemReplace){
    var result = sourceString;
    for(var i = 0; i < itemReplace.length; i++){
        result = result.replace('{' + i +'}', itemReplace[i]);
    }

    return result;
}

/**
 * Action khi click vao 1 row cua table-checkbox
 */
function selectAllRow(tagID, tagID2, row) {
    var checkBoxAll = document.getElementById(tagID).getElementsByTagName('input');
    var checkBoxAll2 = document.getElementsByClassName(tagID2);

    if (row.checked) {
        for (var i = 0; i < checkBoxAll.length; i++) {
            if (checkBoxAll[i].type == 'checkbox') {
                checkBoxAll[i].checked = true;
            }
        }
    } else {
        for (var i = 0; i < checkBoxAll.length; i++) {
            console.log(i)
            if (checkBoxAll[i].type == 'checkbox') {
                checkBoxAll[i].checked = false;
            }
        }
    }

    if (checkBoxAll2 != null && checkBoxAll2 != undefined){
        if (row.checked) {
            for(var i = 0; i < checkBoxAll2.length; i++){
                var checkbox = checkBoxAll2[i].children[0].children[0].getElementsByTagName('input');
                for(var j = 0 ; j < checkbox.length; j++){
                    if (checkbox[j].type =='checkbox'){
                        checkbox[j].checked = true;
                    }
                }
            }
        } else {
            for(var i = 0; i < checkBoxAll2.length; i++){
                var checkbox = checkBoxAll2[i].children[0].children[0].getElementsByTagName('input');
                for(var j = 0 ; j < checkbox.length; j++){
                    if (checkbox[j].type == 'checkbox'){
                        checkbox[j].checked = false;
                    }
                }
            }
        }
    }

}

function deSelectRow(tagID, tagID2, row){
    var checkBoxAll = document.getElementById(tagID).getElementsByTagName('input');
    var checkBoxAll2 = document.getElementsByClassName(tagID2);

    if (checkBoxAll2 != null && checkBoxAll2 != undefined){
        for(var i = 0; i < checkBoxAll2.length; i++){
            var checkbox = checkBoxAll2[i].children[0].children[0].getElementsByTagName('input');
            for(var j = 0 ; j < checkbox.length; j++){
                if (checkbox[j].type =='checkbox' && checkbox[j].name == row.name){
                    checkbox[j].checked = row.checked;
                    break;
                }
            }
        }
    }

    for (var i = 0; i < checkBoxAll.length; i++) {
        if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].name == row.name) {
            checkBoxAll[i].checked = row.checked;
        }
    }

    if (!row.checked){
        checkBoxAll[0].checked = false;

    }else{
        var  flag = 0;
        for (var i = 0; i < checkBoxAll.length; i++) {
            if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                flag++;
            }
        }

        if (flag == checkBoxAll.length - 1){
            checkBoxAll[0].checked = true;
        }
    }
}

/**
 * Send request xuat excel
 */
function corpExportExcel(request) {
    var form = document.createElement("form");
    form.target = "_blank";
    form.setAttribute("method", "POST");
    form.setAttribute("action", gMBServiceUrl + "/report");

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "request");
    hiddenField.setAttribute("value", JSON.stringify(request));
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

/**
 * Send request xuat excel
 */
function corpExportPDF(request, url) {
    var form = document.createElement("form");
    form.target = "_blank";
    form.setAttribute("method", "POST");
    form.setAttribute("action", gMBServiceUrl + "/" + url);

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "request");
    hiddenField.setAttribute("value", JSON.stringify(request));
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}
function inputOnlyNumber(e){
    e.value = e.value.replace(/[^0-9]/g, '');
}

//anhntt getDateTime
function getDateTime() {
    var currentdate = new Date();
    var datetime =  currentdate.getDate() + "/" + (currentdate.getMonth()+1) + "/" + currentdate.getFullYear() + "  " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    return datetime;
}
// thanhhc add common func
function formatFloatNumberToCurrency(amount) {
    var tmpAmount = amount;
    var indexDec = tmpAmount.lastIndexOf(".")
    if(indexDec === -1){
        return formatNumberToCurrency(tmpAmount);
    }else{
        return formatNumberToCurrency(tmpAmount.substr(0,indexDec)) + tmpAmount.substr(indexDec);
    }
}
function getTransTempInfo(templateType) {
    if (templateType == null || templateType == 404 ) {
        return CONST_STR.get("COM_DO_NOT_SAVE");
    } else if (templateType == 0) {
        return CONST_STR.get("COM_SAVE_BENEFICIARY");
    } else if (templateType == 1) {
        return CONST_STR.get("COM_SAVE_TEMPLATE_TRANS");
    }
}
function getSendMethod(sendMethod) {
    if(sendMethod == 0){
        return CONST_STR.get("COM_NOTIFY_0");
    }else if (sendMethod == 1) {
        return CONST_STR.get("COM_NOTIFY_1");
    } else if (sendMethod == 2) {
        return CONST_STR.get("COM_NOTIFY_2");
    } else if (sendMethod == 3) {
        return CONST_STR.get("COM_NOTIFY_3");
    }
}

function controlInputText(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccent(field.value);
        field.value = field.value.replace(/[\[\]\,!"#$%&*'\+\-:;<=>?\\`^~{|}]/g, '');
    }
}
function controlInputText2(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
//        field.value = removeAccent(field.value);
        field.value = field.value.replace(/[\[\]\,!"#$%&*'\+\-:;<=>?\\`^~{|}]/g, '');
    }
}
function checkInputAmount(field, maxlen, enableUnicode){
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccent(field.value);
        field.value = field.value.replace(/[\[\]\,!"#$%&*'\+\-:.;<=>?\\`^~{|}]/g, '');
    }
}
function initDefaultCalendar(idFromDate, idToDate){
    //set up calendar
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    var prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    if(dd<10) {
        dd='0'+dd;
    }

    if(mm<10) {
        mm='0'+mm;
    }

    today = yyyy+'-'+mm+'-'+dd;

    var fromDate;
    var toDate;

    if (gUserInfo.lang == 'VN') {
        fromDate = new DatePicker(
            {
                show : function(data) {},
                hide : function(data) {},
                seek : function(data) {},
                select : function(data, fn) {
                    document.getElementById(idFromDate).value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
                    fromDate.hide();
                }
            },
            {
                tmpl_field   : 'd/m/Y',
                range_min    : '01-01-2005',
                range_max    : '01-01-2051',
                async_selection : true,

                dictionaries : {
                    'custom' : {
                        common : {
                            bwd  : 'Trước',
                            fwd  : 'Sau',
                            hide : 'Đóng'
                        },
                        weekdays : {
                            motu : 'T2;T3;T4;T5;T6;T7;CN'
                        },
                        monthes : {
                            full : 'Tháng 1;Tháng 2;Tháng 3;Tháng 4;Tháng 5;Tháng 6;Tháng 7;Tháng 8;Tháng 9;Tháng 10;Tháng 11;Tháng 12'
                        }
                    }
                }
            }
        );

        toDate = new DatePicker(
            {
                show : function(data) {},
                hide : function(data) {},
                seek : function(data) {},
                select : function(data, fn) {
                    document.getElementById(idToDate).value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
                    toDate.hide();
                }
            },
            {
                tmpl_field   : 'd/m/Y',
                range_min    : '01-01-2005',
                range_max    : '01-01-2051',
                async_selection : true,

                dictionaries : {
                    'custom' : {
                        common : {
                            bwd  : 'Trước',
                            fwd  : 'Sau',
                            hide : 'Đóng'
                        },
                        weekdays : {
                            motu : 'T2;T3;T4;T5;T6;T7;CN'
                        },
                        monthes : {
                            full : 'Tháng 1;Tháng 2;Tháng 3;Tháng 4;Tháng 5;Tháng 6;Tháng 7;Tháng 8;Tháng 9;Tháng 10;Tháng 11;Tháng 12'
                        }
                    }
                }
            }
        );

    }
    else {
        fromDate = new DatePicker(
            {
                show : function(data) {},
                hide : function(data) {},
                seek : function(data) {},
                select : function(data, fn) {
                    document.getElementById(idFromDate).value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
                    fromDate.hide();
                }
            },
            {
                tmpl_field   : 'd/m/Y',
                range_min    : '01-01-2005',
                range_max    : '01-01-2051',
                async_selection : true,

                dictionaries : {
                    'custom' : {
                        common : {
                            bwd  : 'Previous',
                            fwd  : 'Next',
                            hide : 'Close'
                        },
                        weekdays : {
                            motu : 'Mo;Tu;We;Th;Fr;Sa;Su'
                        },
                        monthes : {
                            full : 'January;Feburary;March;April;May;June;July;August;September;October;November;December'
                        },
                    }
                }
            }
        );
        toDate = new DatePicker(
            {
                show : function(data) {},
                hide : function(data) {},
                seek : function(data) {},
                select : function(data, fn) {
                    document.getElementById(idToDate).value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
                    toDate.hide();
                }
            },
            {
                tmpl_field   : 'd/m/Y',
                range_min    : '01-01-2005',
                range_max    : '01-01-2051',
                async_selection : true,

                dictionaries : {
                    'custom' : {
                        common : {
                            bwd  : 'Previous',
                            fwd  : 'Next',
                            hide : 'Close'
                        },
                        weekdays : {
                            motu : 'Mo;Tu;We;Th;Fr;Sa;Su'
                        },
                        monthes : {
                            full : 'January;Feburary;March;April;May;June;July;August;September;October;November;December'
                        }
                    }
                }
            }
        );
    }

    fromDate.select(prevMonth);
    toDate.select(today);
}
// thanhhc add common func end
// thuatnt
function replaceTextareaContent(e){
    for (var i = 0; e.value.length; i++){
        if (e.value.substr(0,1) == "-"){
            e.value = e.value.replace("-",'');
        }else {
            break;
        }
    }
    e.value = e.value.replace(/[^a-zA-Z0-9 ,.\/\(\)]/g, '');
}
function controlInputTextReason(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
//        field.value = removeAccent(field.value);
        field.value = field.value.replace(/[\[\]\!"#$%&*'\+\-:;<=>?\\`^~{|}]/g, '');
    }
}
// end thuatnt
//Hien thi ra popup danh sach template thue xuat nhap khau
function showTemplateEITax(inTitle, inArray1, inArray2, inArray3, inArray4, showValue) {
    // hiddenKeyBoard();
    var dialogHeight = 0;
    var divID = 'divListGroup';
    var divNode = document.getElementById(divID);
    if ((divNode != null) && (divNode != undefined)) {
        divNode.innerHTML = "";
    } else {
        logInfo('Dialog not exist divID: ' + divID);
        return;
    }
    if (inArray1.length <= 0) {
        logInfo('Dialog do not have inArray1 data');
        return;
    }
    if (inArray2.length <= 0) {
        logInfo('Dialog do not have inArray2 data');
        return;
    }
    if (inArray3.length <= 0) {
        logInfo('Dialog do not have inArray3 data');
        return;
    }
    if (inArray4.length <= 0) {
        logInfo('Dialog do not have inArray4 data');
        return;
    }

    var contentInput = "";
    var inputButton = document.createElement("div");
    inputButton.setAttribute("class", "list-group-item active dialog-payee-input");
    inputButton.setAttribute('style', 'padding: 0px;');

    var aNodeTitle = document.createElement("a");
    aNodeTitle.setAttribute("class", "list-group-item active dialog-caption");
    aNodeTitle.innerHTML = inTitle;
    inputButton.appendChild(aNodeTitle);

    var inputTable = document.createElement("div");
    contentInput += "<table>" +
        "<tr>" +
        "<td colspan='2' align='center' valign='middle' class='td-text' width='80%'>" +
        "<div style='border-bottom:none' class='input-group'>" +
        "<span class='input-group-addon' style='white-space:pre-wrap; width:0%'>" /*"+CONST_STR.get('TRANS_LOCAL_ACC_DESTINATION')*/ + "</span>" +
        "<input id='id.inputAcc' style='padding-right:10px !important;' type='text' class='form-control-input-dialog form-control-righttext' placeholder='" + CONST_STR.get('ESAVING_CHANGEINFO_VF_ARR1') + "' onkeyup='dataFilter();'/>" +
        "<span class='input-group-addon input-group-symbol'></span>" +
        "</div>" +
        "</td>" +
        "<td colspan='2' width='20%'><input id='inputDone'  style='width: 92px' type = 'button' class='btnshadow btn-second' value = '" + CONST_STR.get('TRANSFER_REMITTANCE_DONE_BUTTON') + "' onClick = 'btnFinClick();'/></td>" +
        "</tr>";

    contentInput += "</table>";
    inputTable.innerHTML = contentInput;
    inputButton.appendChild(inputTable);

    var dialogDivContainerScroll = document.createElement('div');
    dialogDivContainerScroll.setAttribute('id', 'selection-dialog-scroll');
    dialogDivContainerScroll.setAttribute('class', 'dialog-scroll-content');
    var dialogDivContainer = document.createElement('div');

    for (var x = 1; x < inArray1.length + 1; x++) {
        if (x < 6) {
            dialogHeight = dialogHeight + 39;
        }
        var aNode = document.createElement("a");
        aNode.setAttribute("class", "list-group-item");
        aNode.setAttribute("name", "dataDisplay");
        aNode.setAttribute("style", "width: 100%");
        if (showValue) {
            aNode.style.textAlign = "left";
        } else {
            aNode.style.textAlign = "center";
        }

        aNode.setAttribute("onClick", "selectedItemOnDialog(this," + x + ");");
        aNode.innerHTML = inArray1[x - 1];

        var tmpValue = inArray3[x - 1] + "/" + inArray4[x - 1];
        if ((tmpValue != undefined) && (tmpValue != null)) {
            var spanNode = document.createElement("span");
            spanNode.setAttribute("class", "badge");
            spanNode.setAttribute("style", "width: 25%");
            spanNode.innerHTML = tmpValue;
            spanNode.style.display = 'none';
            aNode.appendChild(spanNode);
        }
        dialogDivContainer.appendChild(aNode);

        var value2 = inArray3[x - 1];
        if ((value2 != undefined) && (value2 != null)) {
            var spanNode = document.createElement("span");
            spanNode.setAttribute("class", "badge");
            spanNode.setAttribute("style", "width: 25%");
            spanNode.innerHTML = value2;
            if (!showValue) {
                spanNode.style.display = 'none';
            }
            aNode.appendChild(spanNode);
        }
        dialogDivContainer.appendChild(aNode);
    }

    // Hien thi title "Khong co du lieu"
    var aNode = document.createElement("a");
    aNode.setAttribute("class", "list-group-item");
    aNode.setAttribute("id", "noDataFound");
    aNode.setAttribute("style", "width: 100%; display:none");
    aNode.innerHTML = CONST_STR.get('CORP_MSG_COM_NO_DATA_FOUND');
    dialogDivContainer.appendChild(aNode);

    dialogDivContainerScroll.appendChild(dialogDivContainer);
    inputButton.appendChild(dialogDivContainerScroll);

    divNode.appendChild(inputButton);

    divNode.style.top = (clientHeight - dialogHeight) / 2 + 20 + 'px';

    if (inArray1.length > 5) {

        dialogScroll = new IScroll('#selection-dialog-scroll', {
            scrollbars:true,
            mouseWheel:true,
            draggableScrollbars:true,
            onScrollMove:function () {
                hasDialogContentScrollEvent = true;
            },
            onScrollEnd:function () {
                hasDialogContentScrollEvent = false;
            },
        });
        setTimeout(function () {
            dialogScroll.refresh();
        }, 200);
    }

    var dialogContainer = document.getElementById("selection-dialog");
    if (dialogContainer != null) {
        dialogContainer.style.zIndex = 2001;
        dialogContainer.style.display = "block";
        dialogContainer.style.opacity = 1;
    }
}
// Hien thi ra popup danh sach template thue noi dia
function showTemplateDomesticTax(inTitle, inArray1, inArray2, showValue) {
    // hiddenKeyBoard();
    var dialogHeight = 0;
    var divID = 'divListGroup';
    var divNode = document.getElementById(divID);
    if ((divNode != null) && (divNode != undefined)) {
        divNode.innerHTML = "";
    } else {
        logInfo('Dialog not exist divID: ' + divID);
        return;
    }
    if (inArray1.length <= 0) {
        logInfo('Dialog do not have inArray1 data');
        return;
    }

    //var dialogDivAll = document.createElement('div');
    var inputButton = document.createElement("div");
    inputButton.setAttribute("class", "list-group-item active dialog-payee-input");
    inputButton.setAttribute('style', 'padding: 0px;');

    var aNodeTitle = document.createElement("a");
    aNodeTitle.setAttribute("class", "list-group-item active dialog-caption");
    aNodeTitle.innerHTML = inTitle;
    inputButton.appendChild(aNodeTitle);

    var inputNode = document.createElement("div");
    var contentInput = "";
    contentInput += "<table>" +
        "<tr>" +
        "<td colspan='2' align='center'  valign='middle' class='td-text' width='80%'>" +
        "<div style='border-bottom: none;' class='input-group'>" +
        "<span class='input-group-addon' style='white-space:pre-wrap; width:0%'>" /*"+CONST_STR.get('TRANS_LOCAL_ACC_DESTINATION')*/ + "</span>" +
        "<input id='id.inputAcc' style='padding-right:10px !important' type='text' class='form-control-input-dialog form-control-righttext' placeholder='" + CONST_STR.get('ESAVING_CHANGEINFO_VF_ARR1') + "' onkeyup='dataFilter();'/>" +
        "<span class='input-group-addon input-group-symbol'></span>" +
        "</div>" +
        "</td>" +
        "<td colspan='2' width='20%'><input id='inputDone'  style='width: 92px' type = 'button' class='btnshadow btn-second' value = '" + CONST_STR.get('TRANSFER_REMITTANCE_DONE_BUTTON') + "' onClick = 'btnFinClick();'/></td>" +
        "</tr>";
    contentInput += "</table>";
    inputNode.innerHTML = contentInput;
    inputButton.appendChild(inputNode);

    var dialogDivContainerScroll = document.createElement('div');
    dialogDivContainerScroll.setAttribute('id', 'selection-dialog-scroll');
    dialogDivContainerScroll.setAttribute('class', 'dialog-scroll-content');
    var dialogDivContainer = document.createElement('div');

    for (var x = 1; x < inArray1.length + 1; x++) {
        if (x < 6) {
            dialogHeight = dialogHeight + 39;
        }
        var aNode = document.createElement("a");
        aNode.setAttribute("class", "list-group-item");
        aNode.setAttribute("name", "dataDisplay");
        aNode.setAttribute("style", "width: 100%");
        if (showValue) {
            aNode.style.textAlign = "left";
        } else {
            aNode.style.textAlign = "center";
        }

        aNode.setAttribute("onClick", "selectedItemOnDialog(this," + x + ");");
        aNode.innerHTML = inArray1[x - 1];

        var tmpValue = inArray2[x - 1];
        if ((tmpValue != undefined) && (tmpValue != null)) {
            var spanNode = document.createElement("span");
            spanNode.setAttribute("class", "badge");
            spanNode.setAttribute("style", "width: 25%");
            spanNode.innerHTML = tmpValue;
            if (!showValue) {
                spanNode.style.display = 'none';
            }
            aNode.appendChild(spanNode);
        }
        dialogDivContainer.appendChild(aNode);
        dialogDivContainer.appendChild(aNode);
    }
    // Hien thi title "Khong co du lieu"
    var aNode = document.createElement("a");
    aNode.setAttribute("class", "list-group-item");
    aNode.setAttribute("id", "noDataFound");
    aNode.setAttribute("style", "width: 100%; display:none");
    aNode.innerHTML = CONST_STR.get('CORP_MSG_COM_NO_DATA_FOUND');
    dialogDivContainer.appendChild(aNode);

    dialogDivContainerScroll.appendChild(dialogDivContainer);
    inputButton.appendChild(dialogDivContainerScroll);

    divNode.appendChild(inputButton);
    divNode.style.top = (clientHeight - dialogHeight) / 2 + 20 + 'px';

    if (inArray1.length > 5) {

        dialogScroll = new IScroll('#selection-dialog-scroll', {
            scrollbars:true,
            mouseWheel:true,

            draggableScrollbars:true,
            onScrollMove:function () {
                hasDialogContentScrollEvent = true;
            },
            onScrollEnd:function () {
                hasDialogContentScrollEvent = false;
            },
        });
        setTimeout(function () {
            dialogScroll.refresh();
        }, 200);
    }

    var dialogContainer = document.getElementById("selection-dialog");
    if (dialogContainer != null) {
        dialogContainer.style.zIndex = 2001;
        dialogContainer.style.display = "block";
        dialogContainer.style.opacity = 1;
    }
}