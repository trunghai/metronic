/**
 * Created by JetBrains WebStorm.
 * User: AnhNTT.FSOFT
 * Date: 2/6/17
 * Time: 10:30 AM
 * To change this template use File | Settings | File Templates.
 */


var gDisabledLuuMau = false;
var lastClickSwitch;
gTrans.transInfo = {};
gTrans.transInfo.schedule  = false;
var viewBack = false;
gTrans.idtxn = "D60";


function viewDidLoadSuccess() {
    actionbar.showStepSequence("com-authentication-scr");
    init();
}

function init(){
    angular.module('EbankApp').controller('auth-trans-list-pending', function ($scope, requestMBServiceCorp) {
        navCachedPages["authorize/auth-transfer"] = null;
        document.getElementById('maker').value = CONST_STR.get("COM_ALL");
        document.getElementById('status').value = (gUserInfo.lang == 'EN') ? INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_EN[0]: INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_VN[0];

        $scope.srcmobile = 'pages/authorize/cardservice/payment-credit-debit-blance/views/auth-payment-credit-blance-mobi.html';
        $scope.src = 'pages/authorize/cardservice/payment-credit-debit-blance/views/auth-payment-credit-blance-desktop.html';
        navController.getBottomBar().hide();

        setTimeout(function () {
            changeLanguageInView();
            reGenContent();
        }, 250);
        $scope.initData = function () {
            var jsonData = new Object();
            jsonData.sequenceId = "1";
            jsonData.idtxn = gTrans.idtxn;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_AUTHORIZE_PAYMENT_CREDIT'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if(response.respCode == '0' && response.respJsonObj.makers.length > 0) {
                    document.addEventListener('evtChangeWidthDesktop',reGenContent,false);
                    document.addEventListener('evtChangeWidthMobile',reGenContent,false);

                    gTrans.makers = response.respJsonObj.makers;
                    gTrans.limit = response.respJsonObj.limit;
                    gTrans.listSourceAccounts = response.respJsonObj.listSourceAccounts;
                    $scope.listPending = response.respJsonObj.list_pending;
                    gTrans.listPending = response.respJsonObj.list_pending;
                    gTrans.listMaker = [];
                    gTrans.listMakerValue = [];
                    gTrans.listMaker.push(CONST_STR.get("COM_ALL"));
                    gTrans.listMakerValue.push("");
                    for (var i in gTrans.makers){
                        gTrans.listMaker.push(gTrans.makers[i].IDUSER);
                        gTrans.listMakerValue.push(gTrans.makers[i].IDUSER);
                    }
                    setTimeout(function () {
                        changeLanguageInView();
                    }, 10);

                }else {
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                    gotoHomePage();
                }
            }, function () {
                showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                gotoHomePage();
            });

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
            }, 250);
        }

        $scope.goToBack = function () {
            document.removeEventListener('evtChangeWidthDesktop',reGenContent,false);
            document.removeEventListener('evtChangeWidthMobile',reGenContent,false);
            navCachedPages['authorize/transfer/auth-transfer'] = null;
            navController.popView(true);
        }

        //=================SHOW DIALOG TRANSTYPE====================================//
        $scope.showTransTypeSelection =function () {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_INTERNAL_TRANS_TYPE_EN : CONST_INTERNAL_TRANS_TYPE_VN;
            var tmpArray2 = CONST_INTERNAL_TRANS_TYPE_KEY;
            document.addEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showTransTypeSelectionOpen(e) {
            if (currentPage == "authorize/cardservice/payment-credit-debit-blance/auth-payment-credit-debit-blance") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('transType').value = e.selectedValue1;
                    document.getElementById('transTypeVal').value = e.selectedValue2;
                    showTransTypeSelectionClose();
                }
            }
        }

        function showTransTypeSelectionClose() {
            if (currentPage == "authorize/cardservice/payment-credit-debit-blance/auth-payment-credit-debit-blance") {
                document.removeEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            }
        }

        //=================SHOW DIALOG MAKER====================================//
        $scope.showMakerSelection =function () {
            if(currentPage == "authorize/cardservice/payment-credit-debit-blance/auth-payment-credit-debit-blance"){
                var tmpArray1 = gTrans.listMaker;
                var tmpArray2 = gTrans.listMakerValue;
                document.addEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
                document.addEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
                showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
            }
        }

        function showMakerSelectionOpen(e) {
            if(currentPage == "authorize/cardservice/payment-credit-debit-blance/auth-payment-credit-debit-blance"){
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('maker').value = e.selectedValue1;
                    document.getElementById('makerVal').value = e.selectedValue2;
                    showMakerSelectionClose();
                }
            }
        }

        function showMakerSelectionClose() {
            if(currentPage == "authorize/cardservice/payment-credit-debit-blance/auth-payment-credit-debit-blance"){
                document.removeEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
            }
        }

        //=================SHOW DIALOG STATUS====================================//
        $scope.showStatusSelection =function () {
            if(currentPage == "authorize/cardservice/payment-credit-debit-blance/auth-payment-credit-debit-blance"){
                var tmpArray1 = (gUserInfo.lang == 'EN') ? UNLOCK_CARD_TRANS_AUTH_STATUS_EN : UNLOCK_CARD_TRANS_AUTH_STATUS_VN;
                var tmpArray2 = UNLOCK_CARD_TRANS_AUTH_STATUS_KEY;
                document.addEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
                document.addEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
                showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
            }
        }

        function showStatusSelectionOpen(e) {
            if (currentPage == "authorize/cardservice/payment-credit-debit-blance/auth-payment-credit-debit-blance") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('status').value = e.selectedValue1;
                    document.getElementById('statusVal').value = e.selectedValue2;
                    showStatusSelectionClose();
                }
            }
        }

        function showStatusSelectionClose() {
            if (currentPage == "authorize/cardservice/payment-credit-debit-blance/auth-payment-credit-debit-blance") {
                document.removeEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
            }
        }

       // tim kiem giao dich
       $scope.onSearchPending = function(e){
           var jsonData = new Object();
           jsonData.sequenceId = "2";
           jsonData.idtxn = gTrans.idtxn;

           jsonData.status = document.getElementById("statusVal").value;
           jsonData.maker = document.getElementById("makerVal").value;
           jsonData.fromDate = document.getElementById("fromDate").value;
           jsonData.endDate = document.getElementById("toDate").value;

           var args = new Array();
           args.push(null);
           args.push(jsonData);
           var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_AUTHORIZE_PAYMENT_CREDIT'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
           var data = getDataFromGprsCmd(gprsCmd);

           requestMBServiceCorp.post(data, true, function (response) {
               if(response.respCode == '0'){
                   $scope.listPending = response.respJsonObj.list_pending;
               }
           }, function () {
               showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
               gotoHomePage();
           });


       }
        //Duyệt một giao dịch
        $scope.goToViewScreen = function(e){
            gTrans.listSelectedTrans = [];
            for (var i in gTrans.listPending){
                if (e == gTrans.listPending[i].MA_GD){
                    gTrans.transInfo = gTrans.listPending[i];
                    gTrans.listSelectedTrans.push(gTrans.transInfo);
                    break;
                }
            }
            var datetime = getDateTime();
            gTrans.transInfo.dateValue = datetime;
            gTrans.listRequset = [];
            gTrans.transInfoRequest = {};
            gTrans.transInfoRequest.transId = gTrans.transInfo.MA_GD;
            gTrans.transInfoRequest.idTxn = 'D12';
            gTrans.transInfoRequest.userIdRef = gTrans.transInfo.MA_THAM_CHIEU;
            gTrans.listRequset.push(gTrans.transInfoRequest);
            gTrans.idtxn = 'D60';
            gTrans.cmdType = CONSTANTS.get('CMD_CO_AUTHORIZE_PAYMENT_CREDIT');
            gTrans.scr = 'pages/authorize/cardservice/payment-credit-debit-blance/views/auth-once-payment-credit-views.html';
            gTrans.srcViewListPending = 'authorize/cardservice/payment-credit-debit-blance/auth-payment-credit-debit-blance';
            navCachedPages['authorize/transfer/common-review/auth-once-trans-review'] = null;
            navController.pushToView('authorize/transfer/common-review/auth-once-trans-review', true, 'html');
        }

        $scope.rejectTransaction = function () {
            gTrans.listSelectedTrans = [];
            gTrans.listRequset = [];
            var reason = document.getElementById("trans.reason").value;
            if (!reason) {
                showAlertText(CONST_STR.get("COM_CHECK_EMPTY_REJECT_REASON"));
                return;
            }

            var checkBoxAll = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
            for (var i = 0; i < checkBoxAll.length; i++) {
                if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                    for (var j in $scope.listPending){
                        if (checkBoxAll[i].name == $scope.listPending[j].MA_GD){
                            gTrans.listSelectedTrans.push($scope.listPending[j]);
                            gTrans.obj = {};
                            gTrans.obj.transId = $scope.listPending[j].MA_GD;
                            gTrans.obj.idTxn = 'D12';
                            gTrans.obj.userIdRef = $scope.listPending[j].MA_THAM_CHIEU;
                            gTrans.listRequset.push(gTrans.obj);
                        }
                    }
                }
            }

            if (gTrans.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }


            gTrans.reason = reason;
            gTrans.authen = false;
            gTrans.sequenceId = 3;
            gTrans.idtxn = 'D60';
            gTrans.cmdType = CONSTANTS.get('CMD_CO_AUTHORIZE_PAYMENT_CREDIT');
            gTrans.srcViewListPending = 'authorize/cardservice/payment-credit-debit-blance/auth-payment-credit-debit-blance';
            gTrans.srcAuthenDesktop = 'pages/authorize/cardservice/payment-credit-debit-blance/views/auth-review-payment-credit-desktop.html';
            gTrans.srcAuthenMobile = 'pages/authorize/cardservice/payment-credit-debit-blance/views/auth-review-payment-credit-mobile.html';
            navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
            navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');
        }

        //Duyệt nhiều giao dịch
        $scope.authorizeTransaction = function () {
            gTrans.listSelectedTrans = [];
            gTrans.listRequset = [];
            var checkBoxAll = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
            for (var i = 0; i < checkBoxAll.length; i++) {
                if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                    for (var j in $scope.listPending){
                        if (checkBoxAll[i].name == $scope.listPending[j].MA_GD){
                            gTrans.listSelectedTrans.push($scope.listPending[j]);
                            gTrans.obj = {};
                            gTrans.obj.transId = $scope.listPending[j].MA_GD;
//                            gTrans.obj.cardId = $scope.listPending[j].MA_THE;
//                            gTrans.obj.idSrc = $scope.listPending[j].TK_CHUYEN;
//                            gTrans.obj.amount = $scope.listPending[j].SO_TIEN;
                            gTrans.obj.idTxn = 'D12';
                            gTrans.obj.userIdRef = $scope.listPending[j].MA_THAM_CHIEU;
                            gTrans.listRequset.push(gTrans.obj);
                        }
                    }
                }
            }

            if (gTrans.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }

            if(!validate()) return;
            var textAuTrans = document.getElementById('trans.reason').value;
            if (textAuTrans != "") {
                showAlertText(CONST_STR.get('COM_CHECK_REJECT_BUTTON'));
                return;
            }
            gTrans.reason = "";
            gTrans.authen = true;
            gTrans.sequenceId = 4;
            gTrans.idtxn = 'D60';
            gTrans.cmdType = CONSTANTS.get('CMD_CO_AUTHORIZE_PAYMENT_CREDIT');
            gTrans.srcViewListPending = 'authorize/cardservice/payment-credit-debit-blance/auth-payment-credit-debit-blance';
            gTrans.srcAuthenDesktop = 'pages/authorize/cardservice/payment-credit-debit-blance/views/auth-review-payment-credit-desktop.html';
            gTrans.srcAuthenMobile = 'pages/authorize/cardservice/payment-credit-debit-blance/views/auth-review-payment-credit-mobile.html';
            navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
            navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');
        }

        function validate() {
            // Kiem tra so du kha dung
            for (var i in gTrans.listSourceAccounts){
                var totalAmount = 0;
                for (var j in gTrans.listSelectedTrans){
                    if (gTrans.listSelectedTrans[j].TK_CHUYEN == gTrans.listSourceAccounts[i].account){
                        totalAmount = totalAmount + parseInt(gTrans.listSelectedTrans[j].SO_TIEN);
                    }
                }

                if(totalAmount > parseInt(removeSpecialChar(gTrans.listSourceAccounts[i].balance))){
                    showAlertText(CONST_STR.get("CORP_MSG_TRANS_BATCH_BALANCE_NOT_ENOUGH"));
                    return false;
                }
            }
//            // Kiem tra han muc neu co
//            var totalAmount = 0;
//            for (var i in gTrans.listSelectedTrans){
//                totalAmount = totalAmount + parseInt(gTrans.listSelectedTrans[i].SO_TIEN);
//            }
            return true;
        }

        if (!viewBack){
            $scope.initData();
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}

function handleInputAmount (e, des) {
    var tmpVale = des.value;
    formatCurrency(e, des);
    //des.value = formatNumberToCurrency(des.value);
    var numStr = convertNum2WordWithLang(keepOnlyNumber(tmpVale), gUserInfo.lang);

    var nodeNumTxt = document.getElementById("trans.amounttotext");

    //nodeNumTxt.innerHTML = "<h6 class='h6style'>" + CONST_STR.get('TRANS_LOCAL_NUM_TO_WORD') + ": <b>" + numStr + "</b></h6>";
    //ngocdt3 chinh sua bo bang chu
    //nodeNumTxt.innerHTML = "<div class='txtmoneystyle'>" + CONST_STR.get('TRANS_LOCAL_NUM_TO_WORD') + ": " + numStr + "</div>";
    nodeNumTxt.innerHTML = "<div class='txtmoneystyle'>" + numStr + "</div>";
}

function controlInputText(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccent(field.value);
        field.value = field.value.replace(/[!"#$%&*'\+:;<=>?\\`^~{|}]/g, '');
    }
}