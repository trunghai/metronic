/**
 * Created by HaiDT1 on 12/19/2016.
 */

var gprsResp = new GprsRespObj("", "", "", "");
var countOTP = 0;
var timerOTP = 90; // OTP timeout = 90s
var OTPTimeout;
var tmpOTPkey = "";
var authenType = '';
function viewDidLoadSuccess() {
    init();

}

function init() {
    angular.module("EbankApp").controller("auth-once-trans-authorization", function ($scope, requestMBServiceCorp) {
        $scope.scr = gTrans.scr;
        $scope.infoTrans = gTrans.transInfo;
        $scope.reason = gTrans.reason;
        $scope.guarantee = gTrans.guarantee;
        $scope.val = gTrans.valquery;
        $scope.statusVN = {
            "ABH": "Đã duyệt",
            "INT": "Chờ duyệt",
            "REJ": "Từ chối",
            "APT": "Duyệt một phần",
            "RBH": "Duyệt không thành công",
            "CAC": "Hủy giao dịch",
            "STH": "Đang xử lý",
            "HBH": "Hồ sơ đã được tiếp nhận",
            "REH": "Hoàn chứng từ",
            "IBS": "Chờ duyệt bổ sung chứng từ",
            "APS": "Duyệt một phần BS chứng từ",
            "RES": "Từ chối BS chứng từ",
            "RBS": "Duyệt BS CTừ  không thành công",
            "SBS": "Đang xử lý BS chứng từ",
            "RJS": "TPBank từ chối BS chứng từ"
        };

        if(gTrans.idtxn == 'B66'){
            $scope.listProfile = gTrans.transInfo.profile;
        }
		
		$scope.status=function(e) {
            return e = CONST_STR.get('COM_TRANS_STATUS_'+e+'');
		}
		
        $scope.onClickViewPDF = function (idfile, file_name) {
            var jsonData = new Object();
            jsonData.sequence_id = "6";
            jsonData.idtxn = 'B66';
            jsonData.idFile = idfile;
            jsonData.nameFile = file_name;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(gTrans.cmdType, "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0'){
                    if (Environment.isMobile()){
                        window.open(response.respJsonObj.url, "", "fullscreen=yes");
                    }else {
                        var widthScreen = (window.innerWidth-800)/2;
                        var heightScreen = (window.innerHeight-800)/2;

                        var string = "width=800,height=800,top=" + heightScreen + ",left=" + widthScreen;
                        window.open(response.respJsonObj.url, "", string);
                    }
                }else {
                    showAlertText(response.respContent);
                }
            });
        }

        $scope.onClickCancel = function () {
            navCachedPages[gTrans.srcViewListPending] = null;
            navController.popToView(gTrans.srcViewListPending, true, 'html');
        }

        setTimeout(function () {
            if (!gTrans.authen) {
                document.getElementById("id.reason").style.zoom = '';
            } else {
                document.getElementById("id.reason").style.display = 'none';
            }
            changeLanguageInView();
        }, 100);

        $scope.initView = function () {
            authenType = gUserInfo.valicationType;
            if (authenType == 'MCA') {
                document.getElementById('id.ca00').style.display = 'none';
                document.getElementById('id.ca02').style.display = 'none';
                document.getElementById('auth.note').style.display = 'none';
                document.getElementById('auth.note.support').style.display = 'none';
                document.getElementById('auth.note.hard.token').style.display = 'none';
                document.getElementById('auth.note.soft.token').style.display = 'none';
                document.getElementById('auth.note.mca').style.display = '';

            }
            else if (authenType == 'OTP') {
                document.getElementById('auth.note.hard.token').style.display = 'none';
                document.getElementById('auth.note.soft.token').style.display = 'none';
                document.getElementById('auth.note.mca').style.display = 'none';

            }
            else if (authenType == 'TOKEN') {
                document.getElementById('auth.note').style.display = 'none';
                document.getElementById('auth.note.support').style.display = 'none';
                document.getElementById('auth.note.hard.token').style.display = '';
                document.getElementById('auth.note.mca').style.display = 'none';
                document.getElementById('auth.note.soft.token').style.display = 'none';

            }
            else if (authenType == 'MKS') {
                document.getElementById('auth.note').style.display = 'none';
                document.getElementById('auth.note.support').style.display = 'none';
                document.getElementById('auth.note.hard.token').style.display = 'none';
                document.getElementById('auth.note.mca').style.display = 'none';
                document.getElementById('auth.note.soft.token').style.display = '';
            }

            if (authenType == 'OTP') {
                var nodeTokenType = document.getElementById('authen.tokentype');
                //nodeTokenType.innerHTML = 'OTP CODE';/cu
                nodeTokenType.innerHTML = CONST_STR.get("AUTHEN_LABEL_OTP");
                var nodeProgressWrapper = document.getElementById('authen.progressbar');
                nodeProgressWrapper.style.display = 'block';
                //do not show resend OTP button
                var nodeResendOTP = document.getElementById('authen.resendotp');
                //nodeResendOTP.style.display = '';
                $scope.sendJSONRequestOTP();
            }

            var nodeAuthenTitle = document.getElementById('auth.title');
            //nodeAuthenTitle.innerHTML = CONST_STR.get('AUTHEN_TXT_INPUT_KEY_TITLE');

            var nodeInputToken = document.getElementById('authen.tokenkey');
            setInputOnlyNumber('authen.tokenkey', CONST_STR.get("ERR_INPUT_ONLY_NUMBER"));
            nodeInputToken.addEventListener('evtSpecialKeyPressed', handleSpecialKeyPressd, false);
            $scope.clickOnDiv('input-trigger');
        }
        $scope.sendJSONRequestOTP = function () {
            var args = [""]; // Bo trong element dau
            args.push({
                sequence_id: 1
            });

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_AUTHENTICATE_TOKEN"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            //data = getDataFromGprsCmd(gGprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                countOTP++;
                if (countOTP <= 5) {

                    startProgressBar('authen.progressbarotp', timerOTP);
                    OTPTimeout = setTimeout(function doAfterProgress() {
                        handleOTPTimeout();
                    }, timerOTP * 1000);
                    authenType = response.respJsonObj.tokenType;
                    // //requestMBService(data, false); //send request OTP
                    // requestBacgroundMBService('CMD_TYPE_OTP_REQUEST', arrayArgs);
                }
                else {
                    document.addEventListener("closeAlertView", handleOTPGetOver, false);
                    clearOTPTimeout();
                    showAlertText(CONST_STR.get('MSG_OTP_LIMIT_GET_TIME'));
                }
            });

            //Service request OTP do not need message response
            //set timeout request OTP

        }

        //handle OTP time-out
        function handleOTPTimeout() {
            document.addEventListener("alertConfirmOK", handleOTPResendAlert, false);
            document.addEventListener("alertConfirmCancel", handleOTPResendAlertCancel, false);
            clearOTPTimeout();
            if (currentPage == "authorize/transfer/common-auth/auth-once-trans-aithorization") {
                showAlertConfirmText(CONST_STR.get('MSG_OTP_TIME_PERIOD'));
            }
        }

        function handleOTPResendAlert(e) {
            if (currentPage == "authorize/transfer/common-auth/auth-once-trans-aithorization") {
                document.removeEventListener("alertConfirmOK", handleOTPResendAlert, false);
                document.removeEventListener("alertConfirmCancel", handleOTPResendAlertCancel, false);
                clearOTPTimeout();
                $scope.sendJSONRequestOTP();
            }
        }

        function handleOTPResendAlertCancel(e) {
            if (currentPage == "authorize/transfer/common-auth/auth-once-trans-aithorization") {
                document.removeEventListener("alertConfirmOK", handleOTPResendAlert, false);
                document.removeEventListener("alertConfirmCancel", handleOTPResendAlertCancel, false);
                clearOTPTimeout();
                goToMainScreen();
            }
        }

        function goToMainScreen() {
            clearOTPTimeout();
            navCachedPages[gTrans.srcViewListPending] = null;
            navController.popToView(gTrans.srcViewListPending, true, 'html');
        }

        //handle OTP over 5 times
        function handleOTPGetOver() {
            if (currentPage == "authorize/transfer/common-auth/auth-once-trans-aithorization") {
                document.removeEventListener("closeAlertView", handleOTPGetOver, false);
                goToMainScreen();
            }
        }

        function clearOTPTimeout() {
            clearTimeout(OTPTimeout);
            OTPTimeout = null;
            stopProgressBar('authen.progressbarotp'); //stop progress bar
        }

        $scope.clickOnDiv = function (id) {
            /*  document.getElementById(id).remove();
             var input = document.createElement("input");
             input.id = id;
             document.getElementById('input-group').appendChild(input);*/
            document.getElementById(id).focus();
            setListener(id);
        }

        var getKeyCode = function (str) {
            return str.charCodeAt(str.length - 1);
        }
        var setListenerInput = false;

        function setListener(id) {
            document.getElementById(id).removeEventListener("keyup", function () {
                console.log("remove event")
            });
            if (!setListenerInput) {
                document.getElementById(id).addEventListener("keyup", function (e) {
                    var kCd = e.keyCode || e.which;

                    if (kCd == 0 || kCd == 229) { //for android chrome keycode fix
                        kCd = getKeyCode(document.getElementById(id).value);
                    }
                    //alert('keycode : ' + kCd);
                    if (tmpOTPkey.length > 6) {
                        return false;
                    }
                    if (kCd == 8 && tmpOTPkey.length == 0) {
                        return false;
                    }
                    if (kCd == 8 && tmpOTPkey.length > 0) {
                        var tmpkey = tmpOTPkey;
                        tmpOTPkey = "";
                        for (var i = 0; i < tmpkey.length - 1; i++) {
                            tmpOTPkey += tmpkey.charAt(i);
                        }
                        checkvalidateotp();

                    } else if ((kCd >= 48 && kCd <= 57) || (kCd >= 96 && kCd <= 105)) { //0-9 only{
                        //alert('check keycode' + e.keyCode);
                        if (tmpOTPkey.length < 6) {
                            tmpOTPkey = tmpOTPkey + "" + getkeycodeotp(kCd);
                            checkvalidateotp();
                        }
                    }
                    // alert(tmpOTPkey);
                    var appendotp = document.getElementById('authen.tokenkey');
                    appendotp.value = tmpOTPkey;
                    if (tmpOTPkey.length == 0) {
                        var hiddendiv = document.getElementById('tess');
                        hiddendiv.style.display = 'none';
                    }
                    else {
                        var hiddendiv = document.getElementById('tess');
                        hiddendiv.style.display = 'block';
                    }
                });
                setListenerInput = true;
            }

        }

        function checkvalidateotp() {
            for (var i = 1; i < 7; i++) {
                var tmpli = document.getElementById('li' + i);
                tmpli.style.setProperty('font-family', '\'eBankPro\'', 'important');
                tmpli.setAttribute('class', 'icon-radio-unchecked');
                tmpli.innerText = "";
            }
            var idt = 1;
            for (var j = 0; j < tmpOTPkey.length; j++) {
                var tmpli = document.getElementById('li' + idt);
                tmpli.setAttribute('class', 'icon-incheck-number');
                tmpli.style.setProperty('font-family', 'TPBNeoSans', 'important');
                tmpli.innerText = tmpOTPkey.charAt(j);
                idt++;
            }
        }

        function getkeycodeotp(keycode) {

            var keychar;
            if (keycode == 48 || keycode == 96) {
                keychar = "0";
            }
            else if (keycode == 49 || keycode == 97) {
                keychar = "1";
            }
            else if (keycode == 50 || keycode == 98) {
                keychar = "2";
            }
            else if (keycode == 51 || keycode == 99) {
                keychar = "3";
            }
            else if (keycode == 52 || keycode == 100) {
                keychar = "4";
            }
            else if (keycode == 53 || keycode == 101) {
                keychar = "5";
            }
            else if (keycode == 54 || keycode == 102) {
                keychar = "6";
            }
            else if (keycode == 55 || keycode == 103) {
                keychar = "7";
            }
            else if (keycode == 56 || keycode == 104) {
                keychar = "8";
            }
            else if (keycode == 57 || keycode == 105) {
                keychar = "9";
            }
            return keychar;
        }

        $scope.removeotp = function () {
            tmpOTPkey = "";
            checkvalidateotp();
            var appendotp = document.getElementById('authen.tokenkey');
            appendotp.value = tmpOTPkey;
            var hiddendiv = document.getElementById('tess');
            hiddendiv.style.display = 'none';
        }

        $scope.sendJSONAuthenRequest = function () {
            var tmpTokenStr = document.getElementById('authen.tokenkey').value;
            if (tmpTokenStr.length != 6) {
                showAlertText(CONST_STR.get('ERR_INPUT_TOKEN_EMPTY'));
                return;
            }

            var args = [];
            var request = {};
            if (gTrans.idtxn == 'T61') {
                request.cmdType = gTrans.cmdType;
                request.request = {
                    sequence_id: gTrans.sequenceId,
                    idtxn: gTrans.idtxn,
                    transInfo: [gTrans.transInfoRequest],
                    rejectReason: gTrans.reason
                }
            }
            else if(gTrans.idtxn == 'T64'){
                request.cmdType = gTrans.cmdType;
                request.request = {
                    idtxn: gTrans.idtxn,
                    sequenceId: gTrans.sequenceId,
                    transId: gTrans.transId,
                    transDetailCode:gTrans.transDetailCode,
                    rejectReason: gTrans.reason
                }
            }
            else if (gTrans.idtxn == 'B62') {
                request.cmdType = gTrans.cmdType;
                request.request = gTrans.transInfoRequest;
            } else if (gTrans.idtxn == 'T69') {
                request.cmdType = gTrans.cmdType;
                request.request = {
                    sequence_id: gTrans.sequenceId,
                    idtxn: gTrans.idtxn,
                    transInfo: [gTrans.transInfoRequest],
                    rejectReason: gTrans.reason
                }
            }
            else if(gTrans.idtxn == 'T71'){
                request.cmdType = gTrans.cmdType;
                request.request = {
                    sequence_id: gTrans.sequenceId,
                    idtxn:gTrans.idtxn,
                    transInfo: [gTrans.transInfoRequest],
                    rejectReason: gTrans.reason
                }
            }
            else if(gTrans.idtxn == 'A63'){
                request.cmdType = gTrans.cmdType;
                request.request = {
                    idtxn:gTrans.idtxn,
                    sequenceId: gTrans.sequenceId,
                    transInfo: [gTrans.transInfoRequest]
                }
            }
            else if(gTrans.idtxn == 'T70'){
               request.cmdType = gTrans.cmdType;
                request.request = {
                    idtxn: gTrans.idtxn,
                    sequenceId: gTrans.sequenceId,
                    transId: gTrans.listRequset[0].transId,
                    transDetailCode: gTrans.listRequset[0].userIdRef,
                    rejectReason: gTrans.reason
                }
            } else if (gTrans.idtxn == 'B61') {
                request.cmdType = gTrans.cmdType;
                request.request = {
                    sequence_id: gTrans.sequenceId,
                    idtxn: gTrans.idtxn,
                    transInfo: gTrans.requset,
                    rejectReason: gTrans.reason
                }
            }else if (gTrans.idtxn == 'T66') {
                request.cmdType = gTrans.cmdType;
                request.request = {
                    sequenceId: gTrans.sequenceId,
                    transId: gTrans.transId,
                    idtxn: gTrans.idtxn,
                    transInfo: gTrans.requset,
                    rejectReason: gTrans.reason
                }
            }else if (gTrans.idtxn == 'T63') {
                request.cmdType = gTrans.cmdType;
                request.request = gTrans.transInfoRequest;

            }else if(gTrans.idtxn == 'C60'){
                request.cmdType = gTrans.cmdType;
                request.request = {
                    sequence_id: gTrans.sequenceId,
                    transIds: gTrans.transIds,
                    idtxn: gTrans.idtxn,
                    transInfo: gTrans.listRequset,
                    rejectReason: gTrans.reason
                }
            } else if(gTrans.idtxn == 'D60'){
                request.cmdType = gTrans.cmdType;
                request.request = {
                    sequenceId: gTrans.sequenceId,
                    idtxn: gTrans.idtxn,
                    transInfo: [gTrans.transInfoRequest],
                    rejectReason: gTrans.reason
                }
            }else if(gTrans.idtxn == 'B66'){
                request.cmdType = gTrans.cmdType;
                if (gTrans.sequence_id == '3'){
                    request.request = {
                        sequence_id: gTrans.sequence_id,
                        idtxn: gTrans.idtxn,
                        transIds: gTrans.transInfo.MA_GD,
                        rejectReason: gTrans.reason
                    }
                }else if(gTrans.sequence_id == '4'){
                    request.request = {
                        sequence_id: gTrans.sequence_id,
                        idtxn: gTrans.idtxn,
                        transInfo: [{'transId' : gTrans.transInfo.MA_GD, 'userIdRef' : gTrans.transInfo.IDFCATREF}],
                        rejectReason: gTrans.reason
                    }
                }
            }

            args.push(request);
            args.push({
                sequence_id: 2,
                tokenType: authenType,
                tokenKey: tmpTokenStr
            });

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_AUTHENTICATE_TOKEN"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            clearOTPTimeout();
            tmpTokenStr = "";

            requestMBServiceCorp.post(data, true, function (response) {
                gTrans.result = {};
                gTrans.final = [];
                gTrans.result.message = response.respContent;
                gTrans.result.respJsonObj = response.respJsonObj;
                if (response.respCode == '0') {
                    gTrans.result.info = response.respJsonObj.table;
                    if(gTrans.idtxn != 'C60'){
                        gTrans.result.DATCHECK = response.respJsonObj.table[0].DATCHECK;
                    }
                    if(gTrans.idtxn == 'C60'){
                        for(var i = 0; i< gTrans.result.info.length; i++){
                            gTrans.final.push(gTrans.result.info[i]) ;
                        }
                        $scope.final = gTrans.final;
                    }
                    gTrans.result.messageIconClass = "icon-correct";
                    navCachedPages['authorize/transfer/common-result/auth-trans-result'] = null;
                    navController.pushToView('authorize/transfer/common-result/auth-trans-result', true, 'html');
                } else {

                    if (response.respCode == RESP.get("COM_INVALID_TOKEN")) {
                        showAlertText(CONST_STR.get("ERR_INPUT_TOKEN_EMPTY"));
                        return;
                    }
                    gTrans.result.messageIconClass = "icon-cross";

                }
            });
        }
        $scope.onViewPDF = function (e) {
            var jsonData = new Object();
            jsonData.sequence_id = "6";
            jsonData.idtxn = "C60";
            jsonData.idFile = e;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_GUARANTEE_AUTH_SUGGEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {

                if (Environment.isMobile()){
                    openLinkInWindows(response.respJsonObj.url);
                }else {
                    var widthScreen = (window.innerWidth-800)/2;
                    var heightScreen = (window.innerHeight-800)/2;

                    var string = "width=800,height=800,top=" + heightScreen + ",left=" + widthScreen;
                    window.open(response.respJsonObj.url, "", string);
                }

            });
        }

        $scope.initView();
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}