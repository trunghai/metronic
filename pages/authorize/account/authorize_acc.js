/**
 * Created by GiangBM on 1/10/2017.
 */
var docXml;
var periodicResult;
var itemsPerPage = 10;
var pageIndex;
var currentPageIndex;
var pageCurrent = "authorize/account/authorize_acc";
var typeTransaction;
var typeStatus;
var listObj;
var sequenceId;
var transaction;
var stt;
gTrans.idtxn = "A63"
var gAccount;
gAccount.transactionId;
gAccount.idTxnAuthAccSaving;
gAccount.listObjSelected;

var searchInfo;

function viewBackFromOther() {
  //Flag check
  gTrans.isBack = true;
}


function viewDidLoadSuccess() {
    if (gTrans.isBack) {
        if(gModeScreenView == CONST_MODE_SCR_SMALL){
            document.getElementById('nav.btn.home').style.display = 'block';
        }

    }
    setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_TIT_A13'));
    init();

  gTrans.isBack = false;

}
function init(){
    angular.module('EbankApp').controller('authorize_acc', function ($scope, requestMBServiceCorp) {
        navCachedPages["authorize/auth-transfer"] = null;
        document.getElementById('transType').value = (gUserInfo.lang == 'EN') ? CONST_ACC_QUERY_TYPE_TRANSACTION_EN[[0]] : CONST_ACC_QUERY_TYPE_TRANSACTION_VN[0]
        document.getElementById('transTypeVal').value = CONST_ACC_QUERY_TYPE_TRANSACTION_VAL[0];
        document.getElementById('maker').value = CONST_STR.get("COM_ALL");
        document.getElementById('status').value = (gUserInfo.lang == 'EN') ? INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_EN[0]: INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_VN[0];

        // $scope.srcmobile = 'pages/authorize/transfer/views/auth-trans-table-mobile-list.html';
        // $scope.src = 'pages/authorize/account/auth-trans-account-desk-list.html';


        // setTimeout(function () {
            // changeLanguageInView();
            // reGenContent();
        // }, 250);

        $scope.loadInitData = function(){
           var jsonData = new Object();
            jsonData.idtxn = gTrans.idtxn;
            jsonData.sequenceId = "1";

            var	args = new Array();
            args.push(1);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_AUTH_ACC_OPEN_SAVING_TRANSACTION"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                gTrans.makers = response.respJsonObj;
            });
        }
        $scope.loadInitData();

        $scope.sendJSONRequest = function(){
            var json = new Object();
            json.idtxn = gTrans.idtxn;
            json.sequenceId = "2";
            json.typeTransaction = document.getElementById("transTypeVal").value;
            json.status = document.getElementById("statusVal").value;
            json.creator = document.getElementById("makerVal").value;
            json.fromDate = document.getElementById("id.begindate").value;
            json.toDate = document.getElementById("id.enddate").value;

            var	args = new Array();
            args.push("2");
            args.push(json);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_AUTH_ACC_OPEN_SAVING_TRANSACTION"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true,
                function (response) {
                    if(response.respCode == '0'){
                        if(response.respJsonObj.listTran.length > 0){
                            $scope.listPending = response.respJsonObj.listTran;
                            gTrans.limit = response.respJsonObj.limit;
                            gTrans.listPending = response.respJsonObj.listTran;
                            document.getElementById('searchacc').style.display = 'block';
                            document.getElementById('searchacc').style.width = '100%';
                            document.getElementById('trans.message').style.display = 'none';
                        }else{
                            document.getElementById('searchacc').style.display = 'none';
                            document.getElementById('trans.message').style.display = 'block';
                            document.getElementById("msgacc").innerHTML = CONST_STR.get('CORP_MSG_COM_NO_DATA_FOUND');
                        }

                    }else{
                        showAlertText(response.respContent);
                    }
            }, function () {
                showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                gotoHomePage();
            });
        }
        $scope.sendJSONRequest();
        // function reGenContent() {
            // if (!checkScreenisMobilePX()){
                // (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "block" : '';
                // (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "none" : '';
            // }else{
                // (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "none" : '';
                // (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "block" : '';

            // }

            // setTimeout(function () {
                // changeLanguageInView();
            // }, 250);
        // }
        //=================SHOW DIALOG TRANSTYPE====================================//
        $scope.showTransTypeSelection =function () {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_ACC_QUERY_TYPE_TRANSACTION_EN : CONST_ACC_QUERY_TYPE_TRANSACTION_VN;
            var tmpArray2 = CONST_ACC_QUERY_TYPE_TRANSACTION_VAL;
            document.addEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showTransTypeSelectionOpen(e) {
            if (currentPage == "authorize/account/authorize_acc") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('transType').value = e.selectedValue1;
                    document.getElementById('transTypeVal').value = e.selectedValue2;
                    showTransTypeSelectionClose();
                }
            }
        }

        function showTransTypeSelectionClose() {
            if (currentPage == "authorize/account/authorize_acc") {
                document.removeEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            }
        }
        //=================SHOW DIALOG MAKER====================================//
        $scope.showMakerSelection =function () {
            var tmpArray1 = [];
            var tmpArray2 = [];
            tmpArray1.push(CONST_STR.get("COM_ALL"));
            tmpArray2.push("");

            for (var i in gTrans.makers) {
                var userId = gTrans.makers[i].IDUSER;
                tmpArray1.push(userId);
                tmpArray2.push(userId);
            }
            document.addEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showMakerSelectionOpen(e) {
            if (currentPage == "authorize/account/authorize_acc") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('maker').value = e.selectedValue1;
                    document.getElementById('makerVal').value = e.selectedValue2;
                    showMakerSelectionClose();
                }
            }
        }

        function showMakerSelectionClose() {
            if (currentPage == "authorize/account/authorize_acc") {
                document.removeEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
            }
        }
        //=================Trang thai====================================//
        $scope.showStatusSelection =function () {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_EN: INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_VN;
            var tmpArray2 = INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_KEY;
            document.addEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showStatusSelectionOpen(e) {
            if (currentPage == "authorize/account/authorize_acc") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('status').value = e.selectedValue1;
                    document.getElementById('statusVal').value = e.selectedValue2;
                    showStatusSelectionClose();
                }
            }
        }

        function showStatusSelectionClose() {
            if (currentPage == "authorize/account/authorize_acc") {
                document.removeEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
            }
        }
        //Duyệt một giao dịch
        $scope.goToViewScreen = function(e){
            // thuatnt thêm hạn mức
            for (var j in gTrans.listSelectedTrans){
                var  totalAmountLimit = gTrans.listSelectedTrans[j].NUMAMOUNT;
            }
            if(totalAmountLimit > 200000000){
                showAlertText(CONST_STR.get("TRANSACTION_AMOUNT_EXCEEDS_LIMIT_APPROVAL_LOCAL"));
                return false;
            }   
            gTrans.listSelectedTrans = [];
            for (var i in gTrans.listPending){
                if (e == gTrans.listPending[i].IDFCATREF){
                    gTrans.transInfo = gTrans.listPending[i];
                    gTrans.listSelectedTrans.push(gTrans.transInfo);
                    break;
                }
            }

            if(!validate()) return;
            gTrans.listRequset = [];
            gTrans.transInfoRequest = {};
            gTrans.transInfoRequest.transactionId = gTrans.transInfo.IDFCATREF;
            gTrans.transInfoRequest.userId = gTrans.transInfo.IDSRCACCT;
            gTrans.transInfoRequest.idUserReference = gTrans.transInfo.IDUSERREFERENCE;
            gTrans.transInfoRequest.idTxn = gTrans.transInfo.IDTXN;
            gTrans.transInfoRequest.person = gTrans.transInfo.SHORTNAME;
            gTrans.transInfoRequest.date = gTrans.transInfo.DATE_SEND;
            gTrans.transInfoRequest.amount = gTrans.transInfo.NUMAMOUNT;
            gTrans.transInfoRequest.approveBy = gTrans.transInfo.APPROVE_BY;
            gTrans.transInfoRequest.idAccount = gTrans.transInfo.IDSRCACCT;
            gTrans.transInfoRequest.status = gTrans.transInfo.CODSTATUS;
            gTrans.transInfoRequest.approver = "";
            gTrans.transInfoRequest.transIds = gTrans.transInfo.IDFCATREF;
            gTrans.listRequset.push(gTrans.transInfoRequest);
            gTrans.idtxn = 'A63';
            gTrans.transInfo.nguoichiuphi = "Người gửi chịu phí";
            gTrans.transInfo.guitb = getSendMethod(gTrans.transInfo.SENDMETHOD);
            gTrans.transInfo.qlthuhuong = "Không lưu";
            gTrans.cmdType = CONSTANTS.get('CMD_AUTH_ACC_OPEN_SAVING_TRANSACTION');
            gTrans.scr = 'pages/authorize/account/auth-once-trans-account-view.html';
            gTrans.srcViewListPending = 'authorize/account/authorize_acc';
            navCachedPages['authorize/transfer/common-review/auth-once-trans-review'] = null;
            navController.pushToView('authorize/transfer/common-review/auth-once-trans-review', true, 'html');
            if(gTrans.transInfo.DUETYPE == 1){
                gTrans.transInfo.chithidaohan = CONST_STR.get("ESAVING_CHANGEINFO_EXI_REN");
            }else if(gTrans.transInfo.DUETYPE == 2){
                gTrans.transInfo.chithidaohan = CONST_STR.get("ESAVING_CHANGEINFO_RD_REN")+ " " +gTrans.transInfo.TXTDESTACCT ;
            }else if(gTrans.transInfo.DUETYPE == 3){
                gTrans.transInfo.chithidaohan = CONST_STR.get("ESAVING_CHANGEINFO_RD_NOREN")+ " " +gTrans.transInfo.TXTDESTACCT;
            }
        }

        //Duyệt nhiều giao dịch
        $scope.authorizeTransaction = function (e) {
            gTrans.listSelectedTrans = [];
            gTrans.listRequset = [];
            gTrans.transInfoRequest = {
                idtxn: gTrans.idtxn,
                sequenceId: 5
            };
            var checkBoxAll = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
            for (var i = 0; i < checkBoxAll.length; i++) {
                if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                    for (var j in $scope.listPending){
                        if (checkBoxAll[i].name == $scope.listPending[j].IDFCATREF){
                            gTrans.listSelectedTrans.push($scope.listPending[j]);
                            gTrans.obj = {};
                            gTrans.obj.transIds = $scope.listPending[j].IDFCATREF;
                            gTrans.obj.idTxn = $scope.listPending[j].IDTXN;
                            gTrans.obj.userIdRef = $scope.listPending[j].IDUSERREFERENCE;
                            gTrans.listRequset.push(gTrans.obj);

                        }
                    }
                }
            }

            if (gTrans.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }
            if (gTrans.listSelectedTrans.length > 1) {
                showAlertText(CONST_STR.get("CORP_MSG_OVER_NUMB_TRANS_DEPOSIT"));
                return;
            }

            if(!validate()) return;
            gTrans.reason = "";
            gTrans.authen = true;
            gTrans.sequenceId = 4;
            gTrans.idtxn = 'A63';
            gTrans.cmdType = CONSTANTS.get('CMD_AUTH_ACC_OPEN_SAVING_TRANSACTION');
            gTrans.srcViewListPending = 'authorize/account/authorize_acc';
            gTrans.srcAuthenDesktop = 'pages/authorize/account/auth-review-trans-account-desktop.html';
            gTrans.srcAuthenMobile = 'pages/authorize/account/auth-review-trans-account-mobile.html';
            navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
            navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');
        }

        //Huy gd
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
                        if (checkBoxAll[i].name == $scope.listPending[j].IDFCATREF){
                            gTrans.listSelectedTrans.push($scope.listPending[j]);
                            gTrans.obj = {};
                            gTrans.obj.transIds = $scope.listPending[j].IDFCATREF;
                            gTrans.obj.idTxn = $scope.listPending[j].IDTXN;
                            gTrans.obj.userIdRef = $scope.listPending[j].IDUSERREFERENCE;
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
            gTrans.idtxn = 'A63';
            gTrans.cmdType = CONSTANTS.get('CMD_AUTH_ACC_OPEN_SAVING_TRANSACTION');
            gTrans.srcAuthenDesktop = 'pages/authorize/account/auth-review-trans-account-desktop.html';
            gTrans.srcAuthenMobile = 'pages/authorize/account/auth-review-trans-account-mobile.html';
            gTrans.srcViewListPending = 'authorize/account/authorize_acc';
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


            // Kiem tra han muc neu co
            var totalAmount = 0;
            for (var i in gTrans.listSelectedTrans){
                totalAmount = totalAmount + parseInt(gTrans.listSelectedTrans[i].SO_TIEN);
            }

            var errorMsgTime = "CORP_MSG_COM_LIMIT_EXCEEDED_TIME_AUTH";
            var errorMsgDay = "CORP_MSG_COM_LIMIT_EXCEEDED_DAY_AUTH";

            if (parseInt(gTrans.limit.limitTime) < parseInt(totalAmount)) {
                var errMsg = formatString(CONST_STR.get(errorMsgTime),
                    [formatNumberToCurrency(gTrans.limit.limitTime)]);
                showAlertText(errMsg);
                return false;
            }
            if (parseInt(gTrans.limit.limitDay) < parseInt(gTrans.totalAmount) + parseInt(gTrans.limit.totalDay)) {
                var errMsg = formatString(CONST_STR.get(errorMsgDay),
                    [formatNumberToCurrency(gTrans.limit.limitDay)]);
                showAlertText(errMsg);
                return false;
            }


            return true;
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])

}

function exportExcelDebtHistory() {
  var transIds = "";
  for (var i in listObj) {
    transIds += listObj[i].IDFCATREF + ",";
  }
  var arrayClientInfo = new Array();
  arrayClientInfo.push(null);
  arrayClientInfo.push({
    sequenceId: "1",
    transType: "A13",
    transIds: transIds
  });

  var gprsCmd = new GprsCmdObj(CONSTANTS.get('COM_EXPORT_EXCEL_REPORT'), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

  data = getDataFromGprsCmd(gprsCmd);

  corpExportExcel(data);
}