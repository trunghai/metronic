/**
 * Created by GiangBM.FSOFT
 * Date: 1/5/2017
 */
gTrans.idtxn = "T70";
var rowsPerPage = 10;
var totalPages;
var searchInfo;
//searchInfo.transType = "T20";
gTrans.curPage;
function viewBackFromOther() {
    //Flag check
    gTrans.isBack = true;
}
function viewDidLoadSuccess(){
    setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_TIT_T20'));
    init();
    if (!gTrans.isBack) {
        searchInfo = {
            transType: "T19",
            transMaker: "",
            transStatus: "",
            dateBegin: "",
            dateEnd: ""
        };

        totalPages = 0;
        gTrans.curPage = 1;
    }
    gTrans.isBack = false;
}
function init(){
    angular.module("EbankApp").controller("identification-trans-auth-src", function ($scope, requestMBServiceCorp) {
        navCachedPages["authorize/auth-transfer"] = null;
        if(gModeScreenView == CONST_MODE_SCR_SMALL ){
            document.getElementById("nav.btn.home").style.display = "block";
        }
        document.getElementById('maker').value = CONST_STR.get("COM_ALL");
        document.getElementById('status').value = (gUserInfo.lang == 'EN') ? INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_EN[0]: INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_VN[0];

        // $scope.srcmobile = 'pages/authorize/transfer/views/auth-trans-table-mobile-list.html';
        // $scope.src = 'pages/authorize/transfer/search-pending/identification/auth-trans-identification-desk-list.html';
        
        $scope.initData = function () {
            var jsonData = new Object();
            jsonData.idtxn = gTrans.idtxn;
            jsonData.sequenceId = 1;
            jsonData.transId ="";
            jsonData.transDetailCode="";

            var args = new Array();
            args.push(1);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_AUTHORIZE_IDENTIFICATION"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if(response.respCode == '0' && response.respJsonObj.makers.length > 0 && response.respJsonObj.limit) {
                    var result = document.getElementById('id.searchResult');
                    if (response.respJsonObj.list_pending.length > 0) {
                        result.style.display = '';
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
                    }else{
                         result.style.display = 'none';
                        document.getElementById('id.message').style.display = 'block';
                        document.getElementById('id.message.value').innerHTML = CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST");
                    }

                }else {
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                    gotoHomePage();
                }
            }, function () {
                showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                gotoHomePage();
            });

        }
        $scope.sendJSONRequest = function (){
            searchInfo.dateBegin = document.getElementById("trans.begindate").value;
            searchInfo.dateEnd = document.getElementById("trans.enddate").value;
            searchInfo.transStatus = document.getElementById("status").value;
            searchInfo.transMaker = document.getElementById("maker").value;
            if(searchInfo.transStatus == CONST_STR.get('COM_ALL')){
                searchInfo.transStatus = "";
            }
            if(searchInfo.transMaker == CONST_STR.get('COM_ALL')){
                searchInfo.transMaker = "";
            }
            var jsonData = new Object();
            jsonData.sequenceId = "2";
            jsonData.idtxn = gTrans.idtxn;

//            jsonData.transType = searchInfo.transType;
            jsonData.transType = "T12";
            jsonData.transStatus = searchInfo.transStatus;
            jsonData.transMaker = searchInfo.transMaker;
            jsonData.dateBegin = searchInfo.dateBegin;
            jsonData.dateEnd = searchInfo.dateEnd;

            var args = new Array();
            args.push("2");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_AUTHORIZE_IDENTIFICATION'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true, function (response) {

                if (response.respCode === '0'){
                    var result = document.getElementById('id.searchResult');
                    if (response.respJsonObj.list_pending == null){
                        result.style.display = 'none';
                        $scope.listPending.list_pending = [];
                    }else {
                        $scope.listPending = response.respJsonObj.list_pending;
                        if ($scope.listPending.length > 0) {
                            result.style.display = 'block';
                            document.getElementById('id.message').style.display = 'none';
                            // for(var i = 0 ;i< $scope.listPending.length;i++ )
                                // $scope.listPending[i].SO_TIEN =  formatNumberToCurrency( $scope.listPending[i].SO_TIEN) + $scope.listPending[i].DV_TIEN;
                        }
                        else
                        {
                            result.style.display = 'none';
                            document.getElementById('id.message').style.display = 'block';
                            document.getElementById('id.message.value').innerHTML = CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST");
                        }

                    }

                }else {
                    this.message = response.respContent;
                }
            }, function (response) {

            });
        }
        
//        Loai giao dich
        $scope.showTransTypeSelection =function () {
            var tmpArray1 = (gUserInfo.lang == 'EN')? CONST_TRANS_TYPE_IDENTIFICATION_EN :CONST_TRANS_TYPE_IDENTIFICATION_VN;
            var tmpArray2 = CONST_TRANS_TYPE_IDENTIFICATION_KEY;
            document.addEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showTransTypeSelectionOpen(e) {
            if (currentPage == "authorize/transfer/search-pending/identification/identification-trans-auth-src") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null) && e.selectedValue2 == 'T70') {
                    document.getElementById('id-trans-local').value = e.selectedValue1;
                    document.getElementById('id-trans-local-value').value = e.selectedValue2;
                    showTransTypeSelectionClose();
                }
            }
        }

        function showTransTypeSelectionClose() {
            if (currentPage == "authorize/transfer/search-pending/identification/identification-trans-auth-src") {
                document.removeEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            }
        }
//        end Loai giao dich
        //Nguoi lap
        $scope.showMakerSelection =function () {
            var tmpArray1 = gTrans.listMaker;
            var tmpArray2 = gTrans.listMakerValue;
            document.addEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showMakerSelectionOpen(e) {
            if (currentPage == "authorize/transfer/search-pending/identification/identification-trans-auth-src") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('maker').value = e.selectedValue1;
                    document.getElementById('makerVal').value = e.selectedValue2;
                    showMakerSelectionClose();
                }
            }
        }

        function showMakerSelectionClose() {
            if (currentPage == "authorize/transfer/search-pending/identification/identification-trans-auth-src") {
                document.removeEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
            }
        }
        //Trang thai
        $scope.showStatusSelection =function () {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_EN: INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_VN;
            var tmpArray2 = INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_KEY;
            document.addEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showStatusSelectionOpen(e) {
            if (currentPage == "authorize/transfer/search-pending/identification/identification-trans-auth-src") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('status').value = e.selectedValue1;
                    document.getElementById('statusVal').value = e.selectedValue2;
                    showStatusSelectionClose();
                }
            }
        }

        function showStatusSelectionClose() {
            if (currentPage == "authorize/transfer/search-pending/identification/identification-trans-auth-src") {
                document.removeEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
            }
        }
        //Duyệt một giao dịch
        $scope.goToViewScreen = function(e){
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
            gTrans.transInfo.BALANCE_BEFOR = formatNumberToCurrency(gTrans.transInfo.BALANCE_BEFOR) + ' ';
            gTrans.transInfo.LOAI_GIAO_DICH = CONST_STR.get('AUTHORIZE_TRANS_TIT_T20');
            gTrans.transInfoRequest.transId = gTrans.transInfo.IDFCATREF;
            gTrans.transInfoRequest.idTxn = gTrans.transInfo.IDSRCACCT;
            gTrans.transInfoRequest.userIdRef = gTrans.transInfo.IDUSERREFERENCE;
            gTrans.listRequset.push(gTrans.transInfoRequest);
            gTrans.idtxn = 'T70';
            gTrans.transInfo.nguoichiuphi = CONST_STR.get("TRANS_FPTS_ACC_FEE");
            gTrans.transInfo.guitb = CONST_STR.get("COM_NOTIFY_1");
            gTrans.transInfo.qlthuhuong = CONST_STR.get("COM_DO_NOT_SAVE");
            gTrans.cmdType = CONSTANTS.get('CMD_CO_AUTHORIZE_IDENTIFICATION');
            gTrans.scr = 'pages/authorize/transfer/search-pending/identification/auth-once-trans-identification-view.html';
            gTrans.srcViewListPending = 'authorize/transfer/search-pending/identification/identification-trans-auth-src';
            navCachedPages['authorize/transfer/common-review/auth-once-trans-review'] = null;
            navController.pushToView('authorize/transfer/common-review/auth-once-trans-review', true, 'html');
        }
        //Duyệt nhiều giao dịch
        $scope.authorizeTransaction = function () {
            gTrans.listSelectedTrans = [];
            gTrans.listRequset = [];
//            gTrans.transInfoRequest = {
//                idtxn: gTrans.idtxn,
//                sequenceId: 8
//            };
//            var checkBoxAll = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
//            for (var i = 0; i < checkBoxAll.length; i++) {
//                if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
//                    for (var j in $scope.listPending){
//                        if (checkBoxAll[i].name == $scope.listPending[j].IDFCATREF){
//                            gTrans.listSelectedTrans.push($scope.listPending[j]);
//                            gTrans.obj = {};
//                            gTrans.obj.transIds = $scope.listPending[j].IDFCATREF;
//                            gTrans.obj.userIdRef = $scope.listPending[j].IDUSERREFERENCE;
//                            gTrans.listRequset.push(gTrans.obj);
//                        }
//                    }
//                }
//            }


            var checkBoxAll = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
            gTrans.obj = {};
            for (var i = 0; i < checkBoxAll.length; i++) {
                if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                    for (var j in $scope.listPending) {
                        if (checkBoxAll[i].name == $scope.listPending[j].IDFCATREF) {
                            gTrans.listSelectedTrans.push($scope.listPending[j]);
                            if (gTrans.obj.transIds == undefined || gTrans.obj.transIds == null) {
                                gTrans.obj.transIds = $scope.listPending[j].IDFCATREF;
                                gTrans.obj.userIdRef = $scope.listPending[j].IDUSERREFERENCE;
                            } else {
                                gTrans.obj.transIds = gTrans.obj.transIds + "," + $scope.listPending[j].IDFCATREF;
                                gTrans.obj.userIdRef = gTrans.obj.userIdRef + "," + $scope.listPending[j].IDUSERREFERENCE;
                            }
                        }
                    }
                }
            }
            gTrans.listRequset.push(gTrans.obj);

            if (gTrans.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }

            if(!validate()) return;
            gTrans.reason = "";
            gTrans.authen = true;
            gTrans.sequenceId = 8;
            gTrans.idtxn = 'T70';
            gTrans.cmdType = CONSTANTS.get('CMD_CO_AUTHORIZE_IDENTIFICATION');
            gTrans.srcViewListPending = 'authorize/transfer/search-pending/identification/identification-trans-auth-src';
            gTrans.srcAuthenDesktop = 'pages/authorize/transfer/search-pending/identification/auth-review-trans-identification-desktop.html';
            gTrans.srcAuthenMobile = 'pages/authorize/transfer/search-pending/identification/auth-review-trans-identification-mobile.html';
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
            gTrans.obj = {};
            for (var i = 0; i < checkBoxAll.length; i++) {
                if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                    for (var j in $scope.listPending) {
                        if (checkBoxAll[i].name == $scope.listPending[j].IDFCATREF) {
                            gTrans.listSelectedTrans.push($scope.listPending[j]);
                            if (gTrans.obj.transIds == undefined || gTrans.obj.transIds == null) {
                                gTrans.obj.transIds = $scope.listPending[j].IDFCATREF;
                            } else {
                                gTrans.obj.transIds = gTrans.obj.transIds + "," + $scope.listPending[j].IDFCATREF;
                            }
                        }
                    }
                }
            }
            gTrans.listRequset.push(gTrans.obj);

            if (gTrans.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }

            gTrans.reason = reason;
            gTrans.authen = false;
            gTrans.sequenceId = 7;
            gTrans.idtxn = 'T70';
            gTrans.cmdType = CONSTANTS.get('CMD_CO_AUTHORIZE_IDENTIFICATION');
            gTrans.srcViewListPending = 'authorize/transfer/search-pending/identification/identification-trans-auth-src';
            gTrans.srcAuthenDesktop = 'pages/authorize/transfer/search-pending/identification/auth-review-trans-identification-desktop.html';
            gTrans.srcAuthenMobile = 'pages/authorize/transfer/search-pending/identification/auth-review-trans-identification-mobile.html';
            navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
            navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');

        }



        function validate() {
            var reasontpb = document.getElementById('trans.reason').value;
            if(reasontpb){
                showAlertText(CONST_STR.get("COM_CHECK_REJECT_BUTTON"));
                return false;
            }
            // Kiem tra so du kha dung
            for (var i in gTrans.listSourceAccounts){
                var totalAmount = 0;
                for (var j in gTrans.listSelectedTrans){
                    if (gTrans.listSelectedTrans[j].IDSRCACCT == gTrans.listSourceAccounts[i].account){
                        totalAmount = totalAmount + parseInt(gTrans.listSelectedTrans[j].NUMAMOUNT);
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
                totalAmount = totalAmount + parseInt(gTrans.listSelectedTrans[i].NUMAMOUNT);
            }

            var errorMsgTime = "CORP_MSG_COM_LIMIT_EXCEEDED_TIME_AUTH";
            var errorMsgDay = "CORP_MSG_COM_LIMIT_EXCEEDED_DAY_AUTH";

            if (parseInt(gTrans.limit.limitTime) < parseInt(totalAmount)) {
                var errMsg = formatString(CONST_STR.get(errorMsgTime),
                    [formatNumberToCurrency(gTrans.limit.limitTime)]);
                showAlertText(errMsg);
                return false;
            }
            if (parseInt(gTrans.limit.limitDay) < parseInt(totalAmount) + parseInt(gTrans.limit.totalDay)) {
                var errMsg = formatString(CONST_STR.get(errorMsgDay),
                    [formatNumberToCurrency(gTrans.limit.limitDay)]);
                showAlertText(errMsg);
                return false;
            }


            return true;
        }
            $scope.initData();
    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}

function exportExcelDebtHistory() {
    var transIds = "";
    var jsonObj = gTrans.listPending;
    for (var i in jsonObj) {
        transIds += jsonObj[i].IDFCATREF + ",";
    }
    var arrayClientInfo = new Array();
    arrayClientInfo.push(null);
    arrayClientInfo.push({
        sequenceId: "18",
        transType: "T20",
        transIds: transIds
    });

    var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_EXPORT_EXCEL_REPORT"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

    data = getDataFromGprsCmd(gprsCmd);

    corpExportExcel(data);
}