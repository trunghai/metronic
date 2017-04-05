/**
 * Created by HaiDT1 on 9/6/2016.
 */

var gprsResp = new GprsRespObj("","","","");
var countOTP = 0;
var timerOTP = 90; // OTP timeout = 90s
var OTPTimeout;
var tmpOTPkey ="";
var authenType = '';

function viewDidLoadSuccess() {
    initData();

}


function initData() {
    angular.module('EbankApp').controller('auth_international_trans_authen', function ($scope, requestMBServiceCorp) {
        $scope.inMoblie = (Environment.isMobile()) ? false : true;
        $scope.infoTrans = gInternational.detail;
        $scope.detailCheckList = gInternational.detail.checklistProfile;
        $scope.profileNote= (gInternational.detail.FILE_DESCRIPTION == null) ? "" : gInternational.detail.FILE_DESCRIPTION;
        $scope.reason = gInternational.reason;
        if(!gInternational.authen || (gInternational.reason != "" && gInternational.authen == "2")){
            $scope.authen = true;
        }else {
            $scope.authen = false;
        }


        $scope.statusVN = {"ABH" : "Đã duyệt", "INT": "Chờ duyệt", "REJ": "Từ chối", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công", "CAC": "Hủy giao dịch", "STH" : "Đang xử lý",
            "HBH" : "Hồ sơ đã được tiếp nhận", "REH" : "Hoàn chứng từ", "IBS" : "Chờ duyệt bổ sung chứng từ", "APS" : "Duyệt một phần BS chứng từ", "APS" : "Duyệt một phần BS chứng từ",
            "RES" : "Từ chối BS chứng từ", "RBS" : "Duyệt BS CTừ  không thành công", "SBS" : "Đang xử lý BS chứng từ", "RJS" : "TPBank từ chối BS chứng từ"};

        (gInternational.detail.CHARGEMETHOD == 'BEN') ? $scope.dos = 2 : $scope.dos = 0;
        (gInternational.detail.CHARGEMETHOD == 'BEN') ? $scope.currencyType = gInternational.detail.MONEYTYPE : $scope.currencyType = 'VND';
        ($scope.infoTrans.BENEFICIARYSWIFTCODE == '' || $scope.infoTrans.BENEFICIARYSWIFTCODE == null) ? $scope.swifCode = false : $scope.swifCode = true;
        ($scope.infoTrans.BENEFICIARYBANKADDRESS == null || $scope.infoTrans.BENEFICIARYBANKADDRESS == '') ? $scope.addressBen = false : $scope.addressBen = true;

        if($scope.infoTrans.NAMTRANSACTIONTYPE == 'CS01'){
            ($scope.infoTrans.SWIFTCODE.length == 0) ? $scope.swifCode = false : $scope.swifCode = true;
            $scope.addressBen = false;

        }else if($scope.infoTrans.NAMTRANSACTIONTYPE == 'CS02'){
            $scope.swifCode = false;
            ($scope.infoTrans.BENEFICIARYADDRESS.length == 0) ? $scope.addressBen = false : $scope.addressBen = true;
        }

        if($scope.infoTrans.METHOD == 'IBN'){
            $scope.swiftCodeNHTG = false;
            $scope.NHTG = false;
            $scope.addressNHTG = false;
            $scope.nationBankNHTG = false;

        }else if($scope.infoTrans.METHOD == 'IBY'){
            $scope.nationBankNHTG = true;
            if($scope.infoTrans.BANKMETHOD == 'CSTG01'){
                ($scope.infoTrans.BANKSWIFTCODE.length == 0) ? $scope.swiftCodeNHTG = false : $scope.swiftCodeNHTG = true;
                $scope.NHTG = false;
                $scope.addressNHTG = false;

            }else if($scope.infoTrans.BANKMETHOD == 'CSTG02'){
                $scope.swiftCodeNHTG = false;
                ($scope.infoTrans.BANKNAME.length == 0) ? $scope.NHTG = false : $scope.NHTG = true;
                ($scope.infoTrans.BANKADDRESS.length == 0) ? $scope.addressNHTG = false : $scope.addressNHTG = true;
            }
        }

        $scope.onViewPDF = function (e, namefile) {
            var jsonData = new Object();
            jsonData.sequence_id = "6";
            jsonData.idtxn = 'B65';
            jsonData.idFile = e;
            jsonData.nameFile = namefile;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_AUTHORIZE_PAYMNET_INTERNATIONAL"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0'){
                    // var html = '<embed width="100%" height="640"'
                    //     + ' type="application/pdf"'
                    //     + ' src="'
                    //     + response.respJsonObj.url
                    //     + '"></embed>';
                    //
                    // document.getElementById('contentView').innerHTML = html;
                    // var modal = document.getElementById('myModal');
                    // modal.style.display = "block";
                    // window.onclick = function(event) {
                    //     if (event.target == modal) {
                    //         modal.style.display = "none";
                    //     }
                    // }
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

        $scope.onCancelClick = function () {
            navCachedPages["authorize/international/auth_international_trans"] = null;
            navController.initWithRootView("authorize/international/auth_international_trans", true, 'html');
        }

        $scope.onBackClick = function () {
           // navCachedPages["corp/authorize/international/auth_international_trans_detail"] = null;
            navController.popView(true);
        }

        $scope.onContinuteClick = function () {
            var tmpTokenStr = document.getElementById('authen.tokenkey').value;
            if (tmpTokenStr.length != 6) {
                showAlertText(CONST_STR.get('ERR_INPUT_TOKEN_EMPTY'));
                return;
            }

            if (gInternational.authen == "3"){
                var args = [];
                var request = {}
                gInternational.transInfo = [];
                gInternational.transInfo.push({'transId': gInternational.detail.IDFCATREF, 'userIdRef': gInternational.detail.IDUSERREFERENCE});
                request.sequence_id = '4';
                request.idtxn = 'B65';
                request.transInfo = gInternational.transInfo;


                args.push({
                    cmdType: CONSTANTS.get('CMD_AUTHORIZE_PAYMNET_INTERNATIONAL'),
                    request: request,

                });
                args.push({
                    sequence_id: 2,
                    tokenType: gCorp.authenType,
                    tokenKey: tmpTokenStr
                });

                var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_AUTHENTICATE_TOKEN"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
                var data = getDataFromGprsCmd(gprsCmd);
            }else if (gInternational.authen == "2"){
                //Từ chối
                var args = [];
                var request = {}
                request.sequence_id = '3';
                request.idtxn = 'B65';
                request.rejectReason = gInternational.reason;
                request.transIds = gInternational.detail.IDFCATREF;

                args.push({
                    cmdType: CONSTANTS.get('CMD_AUTHORIZE_PAYMNET_INTERNATIONAL'),
                    request: request,

                });
                args.push({
                    sequence_id: 2,
                    tokenType: gCorp.authenType,
                    tokenKey: tmpTokenStr
                });

                var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_AUTHENTICATE_TOKEN"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
                var data = getDataFromGprsCmd(gprsCmd);
            }else  if(gInternational.authen == "1"){

                var args = [];
                var request = {}

                request.sequence_id = "7";
                request.idtxn = "B65";
                request.transIds = gInternational.detail.IDFCATREF;

                args.push({
                    cmdType: CONSTANTS.get('CMD_AUTHORIZE_PAYMNET_INTERNATIONAL'),
                    request: request,

                });

                args.push({
                    sequence_id: 2,
                    tokenType: gCorp.authenType,
                    tokenKey: tmpTokenStr
                });

                var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_AUTHENTICATE_TOKEN"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
                var data = getDataFromGprsCmd(gprsCmd);

            }
            clearOTPTimeout();
            tmpTokenStr = "";
            requestMBServiceCorp.post(data, true, function (response) {
                gInternational.result = {};
                gInternational.result.message = response.respContent;
                if (response.respCode == RESP.get('COM_SUCCESS')){
                    gInternational.result.messageIconClass = "icon-correct";
                }else {
                    if (response.respCode == RESP.get("COM_INVALID_TOKEN")) {
                        showAlertText(CONST_STR.get("ERR_INPUT_TOKEN_EMPTY"));
                        return;
                    }
                    gInternational.result.messageIconClass = "icon-cross";
                }

                gInternational.detail.SIGNEDBY = response.respJsonObj.table[0].SIGNEDBY;
                gInternational.detail.DATCHECK = response.respJsonObj.table[0].DATCHECK;
                gInternational.detail.STATUS = response.respJsonObj.table[0].STATUS;
                gInternational.detail.DATMAKE = response.respJsonObj.table[0].DATMAKE;
                gInternational.detail.MAKER = response.respJsonObj.table[0].MAKER;
                gInternational.isDetail = true;
                navCachedPages["authorize/international/auth_international_trans_result"] = null;
                navController.pushToView("authorize/international/auth_international_trans_result", true);
            });

        }

        $scope.initView = function () {
            authenType = gUserInfo.valicationType;
            if(authenType =='MCA'){
                document.getElementById('id.ca00').style.display ='none';
                document.getElementById('id.ca02').style.display ='none';
                document.getElementById('auth.note').style.display ='none';
                document.getElementById('auth.note.support').style.display ='none';
                document.getElementById('auth.note.hard.token').style.display ='none';
                document.getElementById('auth.note.soft.token').style.display ='none';
                document.getElementById('auth.note.mca').style.display ='';
				document.getElementById('auth.note.mtx').style.display ='none';

            }
            else if(authenType =='OTP'){
                document.getElementById('auth.note.hard.token').style.display ='none';
                document.getElementById('auth.note.soft.token').style.display ='none';
                document.getElementById('auth.note.mca').style.display ='none';
				document.getElementById('auth.note.mtx').style.display ='none';

            }
            else if(authenType =='VAS'){
                document.getElementById('auth.note').style.display ='none';
                document.getElementById('auth.note.support').style.display ='none';
                document.getElementById('auth.note.hard.token').style.display ='';
                document.getElementById('auth.note.mca').style.display ='none';
                document.getElementById('auth.note.soft.token').style.display ='none';
				document.getElementById('auth.note.mtx').style.display ='none';

            }
            else if(authenType =='MKS'){
                document.getElementById('auth.note').style.display ='none';
                document.getElementById('auth.note.support').style.display ='none';
                document.getElementById('auth.note.hard.token').style.display ='none';
                document.getElementById('auth.note.mca').style.display ='none';
                document.getElementById('auth.note.soft.token').style.display ='';
				document.getElementById('auth.note.mtx').style.display ='none';
            }
			else if(authenType =='MTX'){
                document.getElementById('auth.note').style.display ='none';
                document.getElementById('auth.note.support').style.display ='none';
                document.getElementById('auth.note.hard.token').style.display ='none';
                document.getElementById('auth.note.mca').style.display ='none';
                document.getElementById('auth.note.soft.token').style.display ='none';
				document.getElementById('auth.note.mtx').style.display ='';
            }

            if (authenType == 'OTP') {
                var nodeTokenType = document.getElementById('authen.tokentype');
                //nodeTokenType.innerHTML = 'OTP CODE';/cu
                nodeTokenType.innerHTML =CONST_STR.get("AUTHEN_LABEL_OTP");
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
            if (currentPage == "authorize/international/auth_international_trans_authen"){
                showAlertConfirmText(CONST_STR.get('MSG_OTP_TIME_PERIOD'));
            }
        }

        function handleOTPResendAlert(e) {
            if (currentPage == "authorize/international/auth_international_trans_authen") {
                document.removeEventListener("alertConfirmOK", handleOTPResendAlert, false);
                document.removeEventListener("alertConfirmCancel", handleOTPResendAlertCancel, false);
                clearOTPTimeout();
                $scope.sendJSONRequestOTP();
            }
        }

        function handleOTPResendAlertCancel(e) {
            if (currentPage == "authorize/international/auth_international_trans_authen") {
                document.removeEventListener("alertConfirmOK", handleOTPResendAlert, false);
                document.removeEventListener("alertConfirmCancel", handleOTPResendAlertCancel, false);
                clearOTPTimeout();
                goToMainScreen();
            }
        }

        function goToMainScreen() {
            clearOTPTimeout();
            navCachedPages['authorize/international/auth_international_trans'] = null;
            navController.popToView('authorize/international/auth_international_trans', true, 'html');
        }

        //handle OTP over 5 times
        function handleOTPGetOver() {
            if (currentPage == "authorize/international/auth_international_trans_authen") {
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

        $scope.initView();
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}