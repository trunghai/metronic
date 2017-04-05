/**
 * Created by HaiDT1 on 6/27/2016.
 */
/**
 * Created by HaiDT1 on 6/27/2016.
 */


gCorp.countOTP = 0;
gCorp.timerOTP = 90;
gCorp.OTPTimeout = null;
gCorp.authenType = "";
var tmpOTPkey ="";
function viewDidLoadSuccess() {

    initData();

    //Tooltip when hover book

}

function initData() {
    angular.module('EbankApp').controller('pay_bill_authen', function ($scope, requestMBServiceCorp) {
        navController.getBottomBar().hide();
        $scope.review = gPayment.review;
        if(gUserInfo.lang === 'VN'){
            if ($scope.review.issavepayee === 'TH'){
                $scope.thuhuong = CONST_VAL_PAYEE_NOT_TEMPLATE_VN[1];
            }else {
                $scope.thuhuong = CONST_VAL_PAYEE_NOT_TEMPLATE_VN[0];
            }
        }else {
            if ($scope.review.issavepayee === 'TH'){
                $scope.thuhuong = CONST_VAL_PAYEE_NOT_TEMPLATE_EN[1];
            }else {
                $scope.thuhuong = CONST_VAL_PAYEE_NOT_TEMPLATE_EN[0];
            }
        }

        gCorp.authenType = gUserInfo.valicationType;

        var nodeTokenType = document.getElementById('authen.tokentype');
        var label = "";
        if (gCorp.authenType == "OTP") {
            label = CONST_STR.get("AUTHEN_LABEL_OTP");
            var nodeProgressWrapper = document.getElementById('authen.progressbar');
            nodeProgressWrapper.style.display = 'block';
        } else if (gCorp.authenType == "MTX") {
            label = CONST_STR.get("AUTHEN_LABEL_MATRIX");
            var nodeProgressWrapper = document.getElementById('authen.progressbar');
            nodeProgressWrapper.style.display = 'block';
        } else {
            label = CONST_STR.get("AUTHEN_LABEL_TOKEN");
        }
        nodeTokenType.innerHTML = label;

        sendInitRequest();

        $scope.sendJSONRequest = function () {
            var nodeTokenKey = document.getElementById("authen.tokenkey");
            var tmpTokenStr = nodeTokenKey.value;
            if (tmpTokenStr.length != 6) {
                showAlertText(CONST_STR.get('ERR_INPUT_TOKEN_EMPTY'));
                return;
            }

            var args = [];
            var request = {
                cmdType: '1711',
                request: {
                    transId: gPayment.transactionId,
                    sequence_id: 3,
                    idtxn: gPayment.payType,
                    issavepayee: gPayment.review.issavepayee,
                    sampleName: gPayment.review.beneName
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
            nodeTokenKey.value = "";

            requestMBServiceCorp.post(data,true, function (response){
                var objResponse = JSON.parse(JSON.stringify(response));
                gPayment.result = {};
                gPayment.result.message = objResponse.respContent;
                gPayment.result.respJsonObj = objResponse.respJsonObj;

                
                if (objResponse.respCode === '0'){
                    gPayment.result.messageIconClass = "icon-correct";


                }else {

                    if (objResponse.respCode == RESP.get("COM_INVALID_TOKEN")) {
                        showAlertText(CONST_STR.get("ERR_INPUT_TOKEN_EMPTY"));
                        return;
                    }
                    gPayment.result.messageIconClass = "icon-cross";

                }

                navCachedPages["payment_service/create/bill/pay_bill_result"] = null;
                navController.pushToView("payment_service/create/bill/pay_bill_result", true);

            
            }, function (response) {
                var objResponse = JSON.parse(JSON.stringify(response));
                showAlertText(objResponse.respContent);
            });
        }

        $scope.onBackClick = function () {
            navCachedPages["payment_service/create/bill/pay_bill_review"] = null;
            navController.popView(true);
            return;
        }

        $scope.onCancelClick = function () {
            navCachedPages["payment_service/create/bill/pay_bill_create"] = null;
            navController.initWithRootView("payment_service/create/bill/pay_bill_create",true, 'html');
        }

        // Khi OTP timeout
        function handleOTPTimeout() {
            document.addEventListener("alertConfirmOK", handleOTPResendAlert, false);
            document.addEventListener("alertConfirmCancel", handleOTPResendAlertCancel, false);
            clearOTPTimeout();
            showAlertConfirmText(CONST_STR.get("MSG_OTP_TIME_PERIOD"));
        }

        // Gui lai OTP
        function handleOTPResendAlert(e) {
            document.removeEventListener("alertConfirmOK", handleOTPResendAlert, false);
            document.removeEventListener("alertConfirmCancel", handleOTPResendAlertCancel, false);
            clearOTPTimeout();
            sendInitRequest();
        }

        // Huy OTP
        function handleOTPResendAlertCancel(e) {
            document.removeEventListener("alertConfirmOK", handleOTPResendAlert, false);
            document.removeEventListener("alertConfirmCancel", handleOTPResendAlertCancel, false);
            clearOTPTimeout();
            goToMainScreen();
        }

        // Qua 5 lan nhap token
        function handleOTPGetOver() {
            document.removeEventListener("closeAlertView", handleOTPGetOver, false);
            goToMainScreen();
        }

        function goToMainScreen() {
            clearOTPTimeout();
            navCachedPages["payment_service/create/bill/pay_bill_create"] = null;
            navController.initWithRootView("payment_service/create/bill/pay_bill_create",true, 'html');
        }

        function clearOTPTimeout() {
            clearTimeout(gCorp.OTPTimeout);
            gCorp.OTPTimeout = null;
            stopProgressBar('authen.progressbarotp'); //stop progress bar
        }

        function sendInitRequest() {
            gCorp.countOTP++;
            if (gCorp.countOTP > 5) {
                document.addEventListener("closeAlertView", handleOTPGetOver, false);
                clearOTPTimeout();
                showAlertText(CONST_STR.get("MSG_OTP_LIMIT_GET_TIME"));
                return;
            }

            var args = [""]; // Bo trong element dau
            args.push({
                sequence_id: 1
            });

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_AUTHENTICATE_TOKEN"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data,true, function (responseText) {
                var nodeInputToken = document.getElementById("authen.tokenkey");
                // mainContentScroll.scrollToElement(nodeInputToken, 50);
                nodeInputToken.select();

                nodeInputToken.focus();

                startProgressBar("authen.progressbarotp", gCorp.timerOTP);
                gCorp.OTPTimeout = setTimeout(function doAfterProgress() {
                    handleOTPTimeout();
                }, gCorp.timerOTP * 1000);
                var response = JSON.parse(JSON.stringify(responseText));
                gCorp.authenType = response.respJsonObj.tokenType;
                if (gCorp.authenType == "MTX") {
                    var mtxPos = response.respJsonObj.MTXPOS;
                    var nodeTokenType = document.getElementById("authen.tokentype");
                    nodeTokenType.innerHTML = formatString(CONST_STR.get("COM_TOKEN_MTX_INPUT_LABEL"), [mtxPos]);
                }

                var nodeAuthenTitle = document.getElementById("auth.title");
                nodeAuthenTitle.innerHTML = CONST_STR.get("AUTHEN_TXT_INPUT_KEY_TITLE");


                setInputOnlyNumber('authen.tokenkey', CONST_STR.get("ERR_INPUT_ONLY_NUMBER"));
                // nodeInputToken.addEventListener('evtSpecialKeyPressed', handleEnterPressed, false);

            });
        }
        $scope.clickOnDiv = function (id) {
            /*  document.getElementById(id).remove();
             var input = document.createElement("input");
             input.id = id;
             document.getElementById('input-group').appendChild(input);*/
            document.getElementById(id).focus();
            setListener(id);
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
                //var nodeResendOTP = document.getElementById('authen.resendotp');
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
        angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}

