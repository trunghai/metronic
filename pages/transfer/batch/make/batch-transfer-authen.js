var tmpOTPkey ="";
(function() {
    resizeMainViewContent();
    gCorp.countOTP = 0;
    gCorp.timerOTP = 90;
    gCorp.OTPTimeout = null;
    gCorp.authenType = "";
    
    var app = angular.module("batch-transfer-authen", []);

    app.controller("Main", ["$scope", function($scope) {
        var _this = this;
        bottomBar.hide();
        _this.transType = gTrans.batch.transType;
        _this.account = gTrans.batch.account;
        _this.data = gTrans.batch.respObj.respJson;
        _this.currentListTrans = [];
        _this.pageSize = 10;

        // Phan trang ket qua
        _this.setPagination = function(pageId) {
            var totalPage = Math.ceil(_this.data.listTrans.length / _this.pageSize);
            _this.currentListTrans = _this.data.listTrans.slice((pageId - 1) * _this.pageSize, pageId * _this.pageSize);
            var pagination = document.getElementById("acc-pagination");
            var paginationHTML = genPageIndicatorHtml(totalPage, pageId);
            paginationHTML = paginationHTML.replace(/selectedPageAtIndex/g, "gTrans.changePage");
            pagination.innerHTML = paginationHTML;
        };

        // Khi user chuyen trang
        gTrans.changePage = function(idx, inNode, inTotalPage, inMaxNum, inArrDisable) {
            _this.setPagination(idx);
            $scope.$apply();
            mainContentScroll.refresh();
        };

        _this.setPagination(1);

        // Kiem tra so du va han muc
        if (_this.data.balanceError == 1)
            showAlertText(CONST_STR.get("CORP_MSG_TRANS_BATCH_BALANCE_NOT_ENOUGH"));
        else if (_this.data.limitTimeError != 0) {
        	var errorMessage = formatString(CONST_STR.get("CORP_MSG_COM_LIMIT_EXCEEDED_TIME"), 
    							[formatNumberToCurrency(_this.data.limitTime)]);
            showAlertText(errorMessage);
        } else if (_this.data.limitDayError != 0) {
            var errorMessage = formatString(CONST_STR.get("CORP_MSG_COM_LIMIT_EXCEEDED_DAY"), 
					[formatNumberToCurrency(_this.data.limitDay)]);
            showAlertText(errorMessage);
        }

        // Get message loi
        _this.getErrorMsg = function(errorCode) {
            return CONST_STR.get("TRANS_BATCH_ERR_" + errorCode);
        };

        // Convert sang kieu tien te
        _this.toCurrency = function(amount) {
            return formatNumberToCurrency(amount);
        };

        // Khi NSD click tiep tuc
        _this.continue = function() {
            sendJSONRequest();
        };

        // Khi NSD click huy
        _this.cancel = function() {
            gTrans.batch = null;
            for(var i=0; i<navArrayScr.length;i++){
                if(navArrayScr[i] == 'transfer/batch/make/batch-transfer-create'){
                    clearCachedPageToView(navArrayScr[i], true,'html');
                    navArrayScr = navArrayScr.slice(0,i+1);
                    return;
                }
            }
        };

        // Quay lai man hinh truoc, giu nguyen cac gia tri nhap
        _this.goBack = function() {
            for(var i=0; i<navArrayScr.length;i++){
                if(navArrayScr[i] == 'transfer/batch/make/batch-transfer-review'){
                    clearCachedPageToView(navArrayScr[i], true,'html');
                    navArrayScr = navArrayScr.slice(0,i+1);
                    return;
                }
            }
        };

        // Khi NSD click chuyen tab
        _this.changeTab = function() {
            navController.initWithRootView('transfer/batch/mng/batch-transfer-mng-scr', true, 'html');
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

        // Get Token type
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

        // Gui request lan dau len service
        sendInitRequest();

        var nodeAuthenTitle = document.getElementById("auth.title");
        nodeAuthenTitle.innerHTML = CONST_STR.get("AUTHEN_TXT_INPUT_KEY_TITLE");

        $scope.clickOnDiv('input-trigger');
        var nodeInputToken = document.getElementById("authen.tokenkey");
        setInputOnlyNumber('authen.tokenkey', CONST_STR.get("ERR_INPUT_ONLY_NUMBER"));
        nodeInputToken.addEventListener('evtSpecialKeyPressed', handleEnterPressed, false);

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

    }]);

    // Start app
    angular.bootstrap(document.getElementById("mainViewContent"), ["batch-transfer-authen"]);

    // Gui request lan dau len service
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

        requestMBServiceCorp(data, true, 0, function(responseText) {
            var nodeInputToken = document.getElementById("authen.tokenkey");
            //mainContentScroll.scrollToElement(nodeInputToken, 50);
            nodeInputToken.select();
            nodeInputToken.focus();
        
            startProgressBar("authen.progressbarotp", gCorp.timerOTP);
            gCorp.OTPTimeout = setTimeout(function doAfterProgress() {
                handleOTPTimeout();
            }, gCorp.timerOTP * 1000);
            var response = JSON.parse(responseText);
            gCorp.authenType = response.respJsonObj.tokenType;
            if (gCorp.authenType == "MTX") {
                var mtxPos = response.respJsonObj.MTXPOS;
                var nodeTokenType = document.getElementById("authen.tokentype");
                nodeTokenType.innerHTML = formatString(CONST_STR.get("COM_TOKEN_MTX_INPUT_LABEL"), [mtxPos]);
            }
            document.getElementById('input-trigger').focus();
        });
    }

    //send confirm message
    function sendJSONRequest() {
        var nodeTokenKey = document.getElementById("authen.tokenkey");
        var tmpTokenStr = nodeTokenKey.value;
        if (tmpTokenStr.length != 6) {
            showAlertText(CONST_STR.get('ERR_INPUT_TOKEN_EMPTY'));
            return;
        }

        var args = [];
        var request = {
            cmdType: gTrans.batch.respObj.responseType,
            request: {
                transactionId: gTrans.batch.respObj.respJson.transactionId,
                sequenceId: 3,
                idtxn: gTrans.batch.transType.key
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

        var respSuccess = function(data) {
            var response = JSON.parse(data);
            if (response.respCode == 0) {
                gTrans.batch.message = response.respContent;
                gTrans.batch.messageIconClass = "icon-correct";
            } else {
                if (response.respCode == RESP.get("COM_INVALID_TOKEN")) {
                    showAlertText(CONST_STR.get("ERR_INPUT_TOKEN_EMPTY"));
                    return;
                }
                gTrans.batch.message = response.respContent;
                gTrans.batch.messageIconClass = "icon-cross";
            }
            if (typeof(response.respJsonObj.date) !== "undefined")
                gTrans.batch.respObj.respJson.date = response.respJsonObj.date;
            navCachedPages["transfer/batch/make/batch-transfer-result"] = null;
            navController.pushToView("transfer/batch/make/batch-transfer-result", true);
            if (checkScreenisMobilePX()) {
                document.getElementById('nav.btn.home').style.display ='none';
            }
        };

        var respFailed = function(data) {
            showAlertText(response.respContent);
        };

        requestMBServiceCorp(data, true, 0, respSuccess, respFailed);
    }

    // Khi click nut enter
    function handleEnterPressed(e) {
        var ew = e.keyPress;
        if (ew == 13) {
            sendJSONRequest();
        } else {
            return;
        }
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
        navController.popToRootView(true);
    }

    function clearOTPTimeout() {
        clearTimeout(gCorp.OTPTimeout);
        gCorp.OTPTimeout = null;
        stopProgressBar('authen.progressbarotp'); //stop progress bar
    }

    function resendOTP() {
        clearOTPTimeout();
        sendJSONRequestOTP();
    }

    function handleRequestConfirmAlertOK() {
        document.removeEventListener("alertConfirmOK", handleRequestConfirmAlertOK, false);
        document.removeEventListener("alertConfirmCancel", handleRequestConfirmAlertCancel, false);
        navController.resetBranchView();
    }

    function handleRequestConfirmAlertCancel() {
        document.removeEventListener("alertConfirmOK", handleRequestConfirmAlertOK, false);
        document.removeEventListener("alertConfirmCancel", handleRequestConfirmAlertCancel, false);
        var tmpPageName = navController.getDefaultPage();
        var tmpPageType = navController.getDefaultPageType();
        navController.initWithRootView(tmpPageName, true, tmpPageType);
        navController.resetCacheBranch();
    }

})();
