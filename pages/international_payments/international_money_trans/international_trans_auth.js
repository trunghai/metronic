/**
 * Created by HaiDT1 on 8/30/2016.
 */

var gprsResp = new GprsRespObj("","","","");
var countOTP = 0;
var timerOTP = 90; // OTP timeout = 90s
var OTPTimeout;
var tmpOTPkey ="";
var authenType = '';
function viewDidLoadSuccess() {
    init();
}

function init() {
    angular.module('EbankApp').controller('international_trans_auth', function ($scope, requestMBServiceCorp) {
        navController.getBottomBar().hide();
        $scope.infoTrans = gInternational.info;
        $scope.profileNote = gTrans.instructionFile;
        ($scope.infoTrans.feeMethod.value == 'BEN') ? $scope.dos = 2 : $scope.dos = 0;
        ($scope.infoTrans.swifCode.length == 0) ? $scope.swifCode = false : $scope.swifCode = true;
        ($scope.infoTrans.addressBen.length == 0) ? $scope.addressBen = false : $scope.addressBen = true;

        if(gInternational.info.transMethod.value == 'CS01'){
            ($scope.infoTrans.swifCode.length == 0) ? $scope.swifCode = false : $scope.swifCode = true;
            $scope.addressBen = false;

        }else if(gInternational.info.transMethod.value == 'CS02'){
            $scope.swifCode = false;

            ($scope.infoTrans.addressBen.length == 0) ? $scope.addressBen = false : $scope.addressBen = true;
        }

        if(gInternational.info.interMediaryBank.value == 'IBN'){
            $scope.swiftCodeNHTG = false;
            $scope.NHTG = false;
            $scope.addressNHTG = false;
            $scope.nationBankNHTG = false;

        }else if(gInternational.info.interMediaryBank.value == 'IBY'){
            $scope.nationBankNHTG = true;
            $scope.NHTG = true;
            if(gInternational.info.transMethodNHTG.value == 'CSTG01'){
                ($scope.infoTrans.swiftCodeNHTG.length == 0) ? $scope.swiftCodeNHTG = false : $scope.swiftCodeNHTG = true;
                $scope.addressNHTG = false;
            }else if(gInternational.info.transMethodNHTG.value == 'CSTG02'){
                $scope.swiftCodeNHTG = false;
                ($scope.infoTrans.addressNHTG.length == 0) ? $scope.addressNHTG = false : $scope.addressNHTG = true;
            }
        }

        //Chuyển sang tab quản lý giao dịch
        $scope.changeTab = function () {
            navCachedPages['international_payments/international_money_trans/manager_international_trans/manager_international_trans'] = null;
            navController.initWithRootView('international_payments/international_money_trans/manager_international_trans/manager_international_trans', true, 'html');
        }

        $scope.onViewPDF = function (e) {
            /*var arrayString = e.split("/");
            var stringUrl = "";
            for (var i in arrayString){
                if(i >= 5){
                    stringUrl = stringUrl + "/" + arrayString[i];
                }
            }*/

            if (Environment.isMobile()){
                openLinkInWindows(response.respJsonObj.url);
            }else {
                var widthScreen = (window.innerWidth-800)/2;
                var heightScreen = (window.innerHeight-800)/2;

                var string = "width=800,height=800,top=" + heightScreen + ",left=" + widthScreen;
                window.open(e, "", string);
            }
        }

        // $scope.onViewPDF = function (e) {
        //     var jsonData = new Object();
        //     jsonData.sequence_id = "4";
        //     jsonData.idtxn = gInternational.idtxn;
        //     jsonData.iduserreference = e;
        //     var args = new Array();
        //     args.push(null);
        //     args.push(jsonData);
        //     var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_PAYMENT_INTERNATIONAL"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
        //     var data = getDataFromGprsCmd(gprsCmd);
        //     requestMBServiceCorp.post(data,true, function (response) {
        //         if (Environment.isMobile()){
        //             openLinkInWindows(response.respJsonObj.url);
        //         }else {
        //             var widthScreen = (window.innerWidth-800)/2;
        //             var heightScreen = (window.innerHeight-800)/2;
        //
        //             var string = "width=800,height=800,top=" + heightScreen + ",left=" + widthScreen;
        //             window.open(response.respJsonObj.url, "", string);
        //         }
        //     });
        // }

        $scope.onBackClick = function () {
            navCachedPages["international_payments/international_money_trans/international_trans_review"] = null;
            navController.popView(true);
            return;
        }

        $scope.onCancelClick = function () {
            navCachedPages["international_payments/international_money_trans/international_trans_create"] = null;
            navController.initWithRootView("international_payments/international_money_trans/international_trans_create",true, 'html');
        }

        $scope.onContinuteClick = function () {
            var tmpTokenStr = document.getElementById('authen.tokenkey').value;
            if (tmpTokenStr.length != 6) {
                showAlertText(CONST_STR.get('ERR_INPUT_TOKEN_EMPTY'));
                return;
            }

            var args = [];
            var request = {
                cmdType: CONSTANTS.get("CMD_PAYMENT_INTERNATIONAL"),
                request: {
                    transId: gInternational.info.idfcatref,
                    sequence_id: 3,
                    idtxn: gInternational.idtxn,
                    sampleName : gInternational.info.managerBenInputName,
                    issavepayee : gInternational.info.managerBen.value,
                    beneId: gInternational.info.beneIds,
                    content: gInternational.info.noteFile
                }
            }
            args.push(request);
            args.push({
                sequence_id: 2,
                tokenType: gCorp.authenType,
                tokenKey: tmpTokenStr
            });

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_AUTHENTICATE_TOKEN"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            clearOTPTimeout();
            tmpTokenStr = "";

            requestMBServiceCorp.post(data, true, function (response){
                var objResponse = JSON.parse(JSON.stringify(response));
                gInternational.result = {};
                gInternational.result.message = objResponse.respContent;
                gInternational.result.respJsonObj = objResponse.respJsonObj;
                gInternational.info.transId = objResponse.respJsonObj.transId;
                gInternational.info.time = objResponse.respJsonObj.time;


                if (objResponse.respCode === '0'){
                    gInternational.result.messageIconClass = "icon-correct";


                }else {

                    if (objResponse.respCode == RESP.get("COM_INVALID_TOKEN")) {
                        showAlertText(CONST_STR.get("ERR_INPUT_TOKEN_EMPTY"));
                        return;
                    }
                    gInternational.result.messageIconClass = "icon-cross";

                }

                navCachedPages["international_payments/international_money_trans/international_trans_result"] = null;
                navController.pushToView("international_payments/international_money_trans/international_trans_result", true);


            }, function (response) {
                var objResponse = JSON.parse(JSON.stringify(response));
                showAlertText(objResponse.respContent);
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
            if (currentPage = "transfer/common-auth/transfer-auth-scr"){
                showAlertConfirmText(CONST_STR.get('MSG_OTP_TIME_PERIOD'));
            }
        }

        function handleOTPResendAlert(e) {
            if (currentPage == "com-authentication-scr") {
                document.removeEventListener("alertConfirmOK", handleOTPResendAlert, false);
                document.removeEventListener("alertConfirmCancel", handleOTPResendAlertCancel, false);
                clearOTPTimeout();
                $scope.sendJSONRequestOTP();
            }
        }

        function handleOTPResendAlertCancel(e) {
            if (currentPage == "com-authentication-scr") {
                document.removeEventListener("alertConfirmOK", handleOTPResendAlert, false);
                document.removeEventListener("alertConfirmCancel", handleOTPResendAlertCancel, false);
                clearOTPTimeout();
                goToMainScreen();
            }
        }

        //handle OTP over 5 times
        function handleOTPGetOver() {
            if (currentPage == "com-authentication-scr") {
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