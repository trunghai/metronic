/**
 * Created by HaiNM *
 **/

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
    angular.module("EbankApp").controller('auth-cre-request-detail-authen', function ($scope, requestMBServiceCorp) {
        $scope.detailCommon = gTrans.common;
        $scope.detailCheckList = gTrans.checklistProfile;
        $scope.authen = gTrans.common.authen;
		$scope.tranTypeTxt= function (e) {
			return CONST_STR.get('COM_IDTXN_' + e);
		}
		
        $scope.status=function(statusType) {
            var guaranteeTypeOfLanguage=[];
            var keyTypes =CONST_KEY_TRANS_CRE_REQUEST_CREATE_STT;
            if (gUserInfo.lang === 'VN') {
                guaranteeTypeOfLanguage = CONST_VALUE_TRANS_CRE_REQUEST_CREATE_VN;
            } else {
                guaranteeTypeOfLanguage = CONST_VALUE_TRANS_CRE_REQUEST_CREATE_EN;
            }
            var index =this.getIndexArr(statusType,keyTypes);
            return guaranteeTypeOfLanguage[index];
        }
		
        $scope.getIndexArr=function(guaranteeType,arr){

            for(var i =0;i<arr.length;i++)
            {
                if(arr[i]==guaranteeType)
                {
                    return i;
                }
            }
            return 0;
        }
		
        $scope.onBackClick = function () {
            navCachedPages["authorize/setup/setup-search-detail"] = null;
            navController.popView(true);
        }
        $scope.onCancelClick = function () {
            navCachedPages["authorize/setup/setup-search"] = null;
            navController.initWithRootView("authorize/setup/setup-search",true, 'html');
        }
        
        $scope.onContinuteClick = function () {
            var nodeTokenKey = document.getElementById("authen.tokenkey");
            var tmpTokenStr = nodeTokenKey.value;
            if (tmpTokenStr.length != 6) {
                showAlertText(CONST_STR.get('ERR_INPUT_TOKEN_EMPTY'));
                return;
            }


            if (gTrans.common.authen){
                var args = [];
                var request = {}
                request.sequenceId = 2;
                request.idtxn = 'S65';
                request.transIds = gTrans.common.MA_GD;
				request.transType = gTrans.common.LOAI_GD;


                args.push({
                    cmdType: CONSTANTS.get('CMD_CO_AUTHORIZE_SETUP'),
                    request: request,

                });
                args.push({
                    sequence_id: 2,
                    tokenType: gCorp.authenType,
                    tokenKey: tmpTokenStr
                });

                var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_AUTHENTICATE_TOKEN"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
                var data = getDataFromGprsCmd(gprsCmd);
            }else {
                //Từ chối
                var args = [];
                var request = {}
                request.sequenceId = 3;
                request.idtxn = 'S65';
                request.transIds = gTrans.common.MA_GD;
				request.transType = gTrans.common.LOAI_GD;
                request.rejectReason = gTrans.common.reason;

                args.push({
                    cmdType: CONSTANTS.get('CMD_CO_AUTHORIZE_SETUP'),
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
            nodeTokenKey.value = "";
            requestMBServiceCorp.post(data, true, function (response) {
                gTrans.result = {};
                console.log(response);
                gTrans.result.message = response.respContent;
                gTrans.result.table =  response.respJsonObj.table[0];
                // gTrans.result.DATCHECK = tableRespone.DATCHECK;
                // gTrans.result.DATMAKE = tableRespone.DATMAKE;
                // gTrans.result.IDFCATREF = tableRespone.IDFCATREF;
                // gTrans.result.MAKER = tableRespone.MAKER;
                // gTrans.result.SIGNEDBY = tableRespone.SIGNEDBY;
                // gTrans.result.STATUS = tableRespone.STATUS;
                if (response.respCode == RESP.get('COM_SUCCESS')){
                    gTrans.result.messageIconClass = "icon-correct";
                }else {
                    if (response.respCode == RESP.get("COM_INVALID_TOKEN")) {
                        showAlertText(CONST_STR.get("ERR_INPUT_TOKEN_EMPTY"));
                        return;
                    }
                    gTrans.result.messageIconClass = "icon-cross";
                }
                navCachedPages["authorize/setup/setup-search-detail-result"] = null;
                navController.pushToView("authorize/setup/setup-search-detail-result", true);
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
            else if(authenType =='TOKEN'){
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
            else if (authenType == 'VAS') {
                document.getElementById('auth.note').style.display ='none';
                document.getElementById('auth.note.support').style.display ='none';
				document.getElementById('auth.note.hard.token').style.display ='none';
                document.getElementById('auth.note.mca').style.display ='none';
                document.getElementById('auth.note.soft.token').style.display ='none';
                document.getElementById('auth.note.hard.token.plus').style.display = '';
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
            if (currentPage == "authorize/credit/guarantee/auth-cre-request-detail-authen"){
                showAlertConfirmText(CONST_STR.get('MSG_OTP_TIME_PERIOD'));
            }
        }

        function handleOTPResendAlert(e) {
            if (currentPage == "authorize/credit/guarantee/auth-cre-request-detail-authen") {
                document.removeEventListener("alertConfirmOK", handleOTPResendAlert, false);
                document.removeEventListener("alertConfirmCancel", handleOTPResendAlertCancel, false);
                clearOTPTimeout();
                $scope.sendJSONRequestOTP();
            }
        }

        function handleOTPResendAlertCancel(e) {
            if (currentPage == "authorize/credit/guarantee/auth-cre-request-detail-authen") {
                document.removeEventListener("alertConfirmOK", handleOTPResendAlert, false);
                document.removeEventListener("alertConfirmCancel", handleOTPResendAlertCancel, false);
                clearOTPTimeout();
                goToMainScreen();
            }
        }

        function goToMainScreen() {
            clearOTPTimeout();
            navCachedPages['authorize/credit/guarantee/auth-cre-request']= null;
            navController.popToView('authorize/credit/guarantee/auth-cre-request', true, 'html');
        }

        //handle OTP over 5 times
        function handleOTPGetOver() {
            if (currentPage == "authorize/credit/guarantee/auth-cre-request-detail-authen") {
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
    angular.bootstrap(document.getElementById('mainViewContent'), ["EbankApp"]);
}