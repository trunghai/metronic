/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 1/7/17
 * Time: 9:58 AM
 * To change this template use File | Settings | File Templates.
 */
var gprsResp = new GprsRespObj("","","","");
var countOTP = 0;
var timerOTP = 90; // OTP timeout = 90s
var OTPTimeout;
var tmpOTPkey ="";
var authenType = '';

function viewDidLoadSuccess(){
    resizeMainViewContent(currentPage);
    initData();
}
function initData() {
    angular.module('EbankApp').controller('query-transfer-view', function ($scope, requestMBServiceCorp) {
        $scope.statusVN = {"ABH" : "Hoàn thành giao dịch", "INT": "Chờ duyệt", "REJ": "Từ chối", "CAN": "Hủy giao dịch", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công", "CAC": "Hủy giao dịch", "STH" : "Đang xử lý",
            "HBH" : "Hồ sơ đã được tiếp nhận", "REH" : "Hoàn chứng từ", "IBS" : "Chờ duyệt bổ sung chứng từ", "APS" : "Duyệt một phần BS chứng từ",
            "RES" : "Từ chối BS chứng từ", "RBS" : "Duyệt BS CTừ  không thành công", "SBS" : "Đang xử lý BS chứng từ", "RJS" : "TPBank từ chối BS chứng từ","RSA":"TPBank từ chối"};
        $scope.infoTrans1 = gTrans.infoDetail;
        var arrMedial = new Array();
        arrMedial = gTrans.detailInfo;
        document.getElementById("infoAccAU").innerHTML = genAccInfo(arrMedial);

        var arrTrans = new Array();
        arrTrans= gTrans.detailInfo;
        document.getElementById("infoTransAU").innerHTML = genInfoTrans(arrTrans);

        $scope.onBackClick = function(){
            navCachedPages['transfer/query/transfer-detail'] = null;
            navController.popView(true);
        }
        $scope.onCancelClick = function () {
            clearOTPTimeout();
            navCachedPages['transfer/query/query-transfer'] = null;
            navController.popToView('transfer/query/query-transfer', true, 'html');
        }
        navController.getBottomBar().hide();
        $scope.infoTrans = gTrans.transInfo;
        setTimeout(function () {
            changeLanguageInView();
        }, 200);


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
            if (currentPage = "transfer/query/query-transfer-authen"){
                showAlertConfirmText(CONST_STR.get('MSG_OTP_TIME_PERIOD'));
            }
        }

        function handleOTPResendAlert(e) {
            if (currentPage == "query-transfer-authen") {
                document.removeEventListener("alertConfirmOK", handleOTPResendAlert, false);
                document.removeEventListener("alertConfirmCancel", handleOTPResendAlertCancel, false);
                clearOTPTimeout();
                $scope.sendJSONRequestOTP();
            }
        }

        function handleOTPResendAlertCancel(e) {
            if (currentPage == "query-transfer-authen") {
                document.removeEventListener("alertConfirmOK", handleOTPResendAlert, false);
                document.removeEventListener("alertConfirmCancel", handleOTPResendAlertCancel, false);
                clearOTPTimeout();
                goToMainScreen();
            }
        }

        //handle OTP over 5 times
        function handleOTPGetOver() {
            if (currentPage == "query-transfer-authen") {
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

        $scope.onContinuteClick = function () {
            var tmpTokenStr = document.getElementById('authen.tokenkey').value;
            if (tmpTokenStr.length != 6) {
                showAlertText(CONST_STR.get('ERR_INPUT_TOKEN_EMPTY'));
                return;
            }

            var args = [];

            var request = {};
            if (gTrans.idtxn == 'T02'){
                request.cmdType = CONSTANTS.get("CMD_QUERY_TRANSFER");
                request.request ={
                    sequenceId : 3,
                    idtxn : "T02",
                    userId: gCustomerNo,
                    transTypeId: gTrans.query.request.transTypeId,
                    transStatus: gTrans.query.request.transStatus,
                    maker: gTrans.query.request.maker,
                    dateBegin: gTrans.query.request.dateBegin,
                    dateEnd: gTrans.query.request.dateEnd,
                    pageId: gTrans.pageId,
                    pageSize: gTrans.pageSize,
                    transId: gTrans.infoDetail.IDFCATREF
                };
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
                gTrans.result.message = response.respContent;
                gTrans.result.respJsonObj = response.respJsonObj;
                if (response.respCode == '0'){
//                    gTrans.transInfo.createTime = response.respJsonObj.time;
                    /*HaiNM*/
                    if (response.responseType == 1202 || response.responseType == 1 || response.responseType == 1203) {
                        gTrans.transInfo.transId = response.respJsonObj.transId;
                    }
                    /*End*/
                    gTrans.result.messageIconClass = "icon-correct";
                    navCachedPages['transfer/query/query-transfer-result'] = null;
                    navController.pushToView('transfer/query/query-transfer-result', true, 'html');
                }else {

                    if (response.respCode == RESP.get("COM_INVALID_TOKEN")) {
                        showAlertText(CONST_STR.get("ERR_INPUT_TOKEN_EMPTY"));
                        return;
                    }
                    gTrans.result.messageIconClass = "icon-cross";

                }
            });
        }
        $scope.initView();
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}
// thong tin tai khoan
function genAccInfo(inArrTrans){
    var transInfo =gTrans.detailInfo[0]
    var contentHTML = '';
    for (var i=0; i< inArrTrans.length; i++ ){
        var inAccObj = inArrTrans[i];
        contentHTML += "<table width='100%' align='center' class='recycler-table-ebank'>";
        contentHTML += "<tr class='recycler-row-normal'>";
        contentHTML += "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('COM_TYPE_TRANSACTION')+"</span></td>";
        if(transInfo.IDTXN == "T12"){
            contentHTML += "<td class='recycler-row-align-midle-right'><span>"+CONST_STR.get('TRANS_BATCH_TYPE_TPB')+"</span></td>";
        }
        if(transInfo.IDTXN == "T13"){
            contentHTML += "<td class='recycler-row-align-midle-right'><span>"+CONST_STR.get('TRANS_BATCH_TYPE_OTHER')+"</span></td>";
        }
        if(transInfo.IDTXN == "T19"){
            contentHTML += "<td class='recycler-row-align-midle-right'><span>"+CONST_STR.get('AUTHORIZE_TRANS_TIT_T19')+"</span></td>";
        }
        if(transInfo.IDTXN == "T20"){
            contentHTML += "<td class='recycler-row-align-midle-right'><span>"+CONST_STR.get('AUTHORIZE_TRANS_TIT_T20')+"</span></td>";
        }
        if(transInfo.IDTXN == "T21"){
            contentHTML += "<td class='recycler-row-align-midle-right'><span>"+CONST_STR.get('AUTHORIZE_TRANS_TIT_T21')+"</span></td>";
        }
        contentHTML += "</tr>";
        contentHTML += "<tr class='recycler-row-normal'>"+
            "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('TRANS_BATCH_ACC_LABEL')+"</span></td>"+
            "<td class='recycler-row-align-midle-right'><span>"+ inAccObj.IDSRCACCT+"</span></td>"+
            "</tr>";
        contentHTML += "<tr class='recycler-row-normal'>"+
            "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('ACC_AVAI_BALANCE_TITLE')+"</span></td>"+
            "<td class='recycler-row-align-midle-right'><span>"+ formatNumberToCurrency(inAccObj.BALANCE_BEFOR)  + ' ' + inAccObj .CODTRNCURR+"</span></td>"+
            "</tr>";

    }
    contentHTML +=  "</table>";
    return contentHTML;
}
// thong tin giao dich
function genInfoTrans(inArrTransInfo){
    var destAcc =gTrans.detailInfo[0];
    var contentHTML = '';
    for (var i=0; i< inArrTransInfo.length; i++ ){
        var inTrans = inArrTransInfo[i];
        contentHTML += "<table width='100%' align='center' class='recycler-table-ebank'>";
        if(destAcc.IDTXN == "T20"){
            // so cmtnd, ho chieu
            contentHTML += "<tr class='recycler-row-normal'>"+
                "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('IDENTIFICATION_NUMBER')+"</span></td>"+
                "<td class='recycler-row-align-midle-right'><span>"+ inTrans.PASSPORT +"</span></td>"+
                "</tr>";
            // ngay cap
            contentHTML += "<tr class='recycler-row-normal'>"+
                "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('IDENTIFICATION_TIME')+"</span></td>"+
                "<td class='recycler-row-align-midle-right'><span>"+ inTrans.DATISSUE +"</span></td>"+
                "</tr>";
            // noi cap
            contentHTML += "<tr class='recycler-row-normal'>"+
                "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('IDENTIFICATION_PLACE')+"</span></td>"+
                "<td class='recycler-row-align-midle-right'><span>"+ inTrans.PLACEISSUE +"</span></td>"+
                "</tr>";
            // so dien thoai
            contentHTML += "<tr class='recycler-row-normal'>"+
                "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('IDENTIFICATION_PHONE_NUMBER_2')+"</span></td>"+
                "<td class='recycler-row-align-midle-right'><span>"+ inTrans.TXTPAYMTDETAILS4 +"</span></td>"+
                "</tr>";
        }else{
            // tai khoan nhan
            contentHTML += "<tr class='recycler-row-normal'>";
            if(destAcc.IDTXN == "T19"){
                contentHTML += "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('TRANS_CARD_CARD_NUMBER')+"</span></td>";
            }else{
                contentHTML += "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('TRANS_LOCAL_ACC_DESTINATION')+"</span></td>";
            }
            contentHTML += "<td class='recycler-row-align-midle-right'><span>"+ inTrans.TXTDESTACCT +"</span></td>"+
                "</tr>";
        }
        // chu tai khoan nhan
        contentHTML += "<tr class='recycler-row-normal'>";
        if(destAcc.IDTXN == "T21"){
            contentHTML += "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('IDENTIFICATION_RECEIVER_NAME')+"</span></td>";
        }else{
            contentHTML += "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('TRANS_DEST_ACCOUNT_NAME_TITLE')+"</span></td>";
        }
        contentHTML += "<td class='recycler-row-align-midle-right'><span>"+ inTrans.TXTBENNAME +"</span></td>"+
            "</tr>";
        // ngan hang nhan
        if(destAcc.IDTXN == 'T13' || destAcc.IDTXN == 'T19' || destAcc.IDTXN == 'T20' || destAcc.IDTXN == 'T21'){
            contentHTML += "<tr class='recycler-row-normal'>"+
                "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('TRANS_BANK_TITLE')+"</span></td>"+
                "<td class='recycler-row-align-midle-right'><span>"+ inTrans.BANK_NAME1 +"</span></td>"+
                "</tr>";
        }
        // so tien
        contentHTML += "<tr class='recycler-row-normal'>"+
            "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('TRANS_PERIODIC_AMOUNT')+"</span></td>"+
            "<td class='recycler-row-align-midle-right'><span>"+ formatNumberToCurrency(inTrans.NUMAMOUNT) + " " + inTrans.CODTRNCURR+"</span></td>"+
            "</tr>";
        // phi dich vu
        contentHTML += "<tr class='recycler-row-normal'>"+
            "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('CREDIT_CARD_PAYMENT_FEE')+"</span></td>"+
            "<td class='recycler-row-align-midle-right'><span>"+ formatNumberToCurrency(inTrans.CHARGEFORDOM) + " " + inTrans.CODTRNCURR +"</span></td>"+
            "</tr>";
        // nguoi chiu phi
        contentHTML += "<tr class='recycler-row-normal'>"+
            "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('COM_SENDER_CHARGE')+"</span></td>";
        if(destAcc.CHARGEINCL =='N'){
            contentHTML += "<td class='recycler-row-align-midle-right'><span>"+ CONST_STR.get('IDENTIFICATION_FEE_SENDER') +"</span></td>";
        }else{
            contentHTML += "<td class='recycler-row-align-midle-right'><span>"+ CONST_STR.get('IDENTIFICATION_FEE_RECEIVER_PAY') +"</span></td>";
        }
        contentHTML += "</tr>";
        // noi dung
        contentHTML += "<tr class='recycler-row-normal'>"+
            "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('TRANS_PERIODIC_CONTENT')+"</span></td>"+
            "<td class='recycler-row-align-midle-right'><span>"+ inTrans.TXTPAYMTDETAILS1+"</span></td>"+
            "</tr>";
        // quan ly nguoi thu huong
        if(destAcc.IDTXN != 'T11'){
            contentHTML += "<tr class='recycler-row-normal'>"+
                "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('COM_SAVE_BENE')+"</span></td>"+
                "<td class='recycler-row-align-midle-right'><span>"+getTransTempInfo(inTrans.TYPE_TEMPLATE)+"</span></td>"+
                "</tr>";
        }
        // gui thong bao
        contentHTML += "<tr class='recycler-row-normal'>"+
            "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('COM_SEND_MSG_APPROVER')+"</span></td>"+
            "<td class='recycler-row-align-midle-right'><span>"+getSendMethodText(inTrans.SEND_METHOD)+"</span></td>"+
            "</tr>";
    }
    contentHTML +=  "</table>";
    return contentHTML;
}
function getTransTempInfo(templateType) {
    if (templateType == 404) {
        return CONST_STR.get("TAX_NO_SAVE_CODE");
    } else if (templateType == 0) {
        return CONST_STR.get("COM_SAVE_BENEFICIARY");
    } else if (templateType == 1) {
        return CONST_STR.get("COM_SAVE_TEMPLATE_TRANS");
    }
}
function getSendMethodText(sendMethod) {
    if (sendMethod == 0) {
        return CONST_STR.get("COM_NOTIFY_0");
    } else if (sendMethod == 1) {
        return CONST_STR.get("COM_NOTIFY_1");
    } else if (sendMethod == 2) {
        return CONST_STR.get("COM_NOTIFY_2");
    } else if (sendMethod == 3) {
        return CONST_STR.get("COM_NOTIFY_3");
    }
}

