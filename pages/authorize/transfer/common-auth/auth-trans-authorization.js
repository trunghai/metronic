/**
 * Created by HaiDT1 on 12/21/2016.
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
    angular.module("EbankApp").controller("auth-trans-authorization", function ($scope, requestMBServiceCorp) {
        $scope.listPending = gTrans.listSelectedTrans;

        $scope.srcAuthenDesktop = gTrans.srcAuthenDesktop;
        $scope.srcAuthenMobile = gTrans.srcAuthenMobile;
		$scope.reason = gTrans.reason;

        document.getElementById('trans.reason').value = gTrans.reason;
        setTimeout(function () {
            // document.getElementById('id.reason').style.display = 'none';
            changeLanguageInView();
            reGenContent();
        }, 200);

        if (gTrans.authen){
            document.getElementById('trans.reason').style.display = 'none';
        }else {
            document.getElementById('trans.reason').style.display = 'block';
            // document.getElementById('id.reason').value = gTrans.reason;
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
            if (currentPage == "authorize/transfer/common-auth/auth-trans-aithorization"){
                showAlertConfirmText(CONST_STR.get('MSG_OTP_TIME_PERIOD'));
            }
        }

        function handleOTPResendAlert(e) {
            if (currentPage == "authorize/transfer/common-auth/auth-trans-aithorization") {
                document.removeEventListener("alertConfirmOK", handleOTPResendAlert, false);
                document.removeEventListener("alertConfirmCancel", handleOTPResendAlertCancel, false);
                clearOTPTimeout();
                $scope.sendJSONRequestOTP();
            }
        }

        function handleOTPResendAlertCancel(e) {
            if (currentPage == "authorize/transfer/common-auth/auth-trans-aithorization") {
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
            if (currentPage == "authorize/transfer/common-auth/auth-trans-aithorization") {
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
            if (gTrans.idtxn == 'B62'){
                request.cmdType = gTrans.cmdType;
                request.request = gTrans.transInfoRequest;
            }
            else if(gTrans.idtxn == 'T70'){
                request.cmdType = gTrans.cmdType;
                request.request = {
                    sequenceId: gTrans.sequenceId,
                    idtxn:gTrans.idtxn,
                    transInfo: gTrans.listRequset,
                    rejectReason: gTrans.reason,
                    listIdUserRef:gTrans.obj.listIdUserRef
                }
            }else if(gTrans.idtxn == 'T71'){
                request.cmdType = gTrans.cmdType;
                request.request = {
                    sequence_id: gTrans.sequenceId,
                    idtxn: gTrans.idtxn,
                    transInfo: gTrans.listRequset,
                    rejectReason: gTrans.reason
                }
            }
            else if(gTrans.idtxn == 'T63'){
                request.cmdType = gTrans.cmdType;
                request.request = gTrans.listRequset[0];
            }else if(gTrans.idtxn == 'C60'){
                request.cmdType = gTrans.cmdType;
                request.request =gTrans.listRequset;
            }else if(gTrans.idtxn == 'D60'){
                request.cmdType = gTrans.cmdType;
                request.request = {
                    sequenceId: gTrans.sequenceId,
                    idtxn: gTrans.idtxn,
                    transInfo: gTrans.listRequset,
                    rejectReason: gTrans.reason
                }
            }else if(gTrans.idtxn == 'T64'){
                request.cmdType = gTrans.cmdType;
                request.request = {
                    idtxn: gTrans.idtxn,
                    sequenceId: gTrans.sequenceId,
                    transIds:gTrans.obj.transIds,
                    listIdUserRef:gTrans.obj.listIdUserRef
                }
            }else if(gTrans.idtxn == 'A63'){
                request.cmdType = gTrans.cmdType;
                request.request = {
                    sequenceId: gTrans.sequenceId,
                    idtxn: gTrans.idtxn,
                    transInfo: gTrans.listRequset,
                    rejectReason: gTrans.reason
                }
            }else {

                request.cmdType = gTrans.cmdType;
                request.request = {
                        sequence_id: gTrans.sequenceId,
                        idtxn: gTrans.idtxn,
                        transInfo: gTrans.listRequset,
                        rejectReason: gTrans.reason
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
                gTrans.reject =[];
                gTrans.final =[];
                gTrans.result.message = response.respContent;
                gTrans.result.respJsonObj = response.respJsonObj;
                if (response.respCode == '0'){
                    gTrans.result.info = response.respJsonObj.table;
                    if(gTrans.idtxn != 'C60'){
                        gTrans.result.DATCHECK = response.respJsonObj.table[0].DATCHECK;
                    }
                    if(gTrans.idtxn == 'C60'){
                        for(var i =0; i<response.respJsonObj.table.length; i++){
                            gTrans.final.push(response.respJsonObj.table[i]);

                        }
                        $scope.final = gTrans.final;
                    }
                    gTrans.result.messageIconClass = "icon-correct";
                    navCachedPages['authorize/transfer/common-result/auth-trans-result'] = null;
                    navController.pushToView('authorize/transfer/common-result/auth-trans-result', true, 'html');
                }else {

                    if (response.respCode == RESP.get("COM_INVALID_TOKEN")) {
                        showAlertText(CONST_STR.get("ERR_INPUT_TOKEN_EMPTY"));
                        return;
                    }
                    gTrans.result.messageIconClass = "icon-cross";

                }
            });

        }

        $scope.onCancelClick = function(){
            navCachedPages[gTrans.srcViewListPending] = null;
            navController.popToView(gTrans.srcViewListPending);
        }

        function reGenContent() {
            if (!checkScreenisMobilePX()){
                (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "block" : '';
                (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "none" : '';
            }else{
                (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "none" : '';
                (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "block" : '';

            }

            setTimeout(function () {
                changeLanguageInView();
            }, 100);
        }

        $scope.initView();
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
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