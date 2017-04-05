/**
 * Created by GiangBM.FSOFT on 1/3/2017.
 */
gTrans.idtxn = "T69";

var rowsPerPage = 10;
var totalPages;

var results;
var curTrans;
var listSelectedTrans;

gTrans.makers;
gTrans.limit;
gTrans.curPage;

var searchInfo;

function viewBackFromOther() {
    //Flag check
    gTrans.isBack = true;
}

function viewDidLoadSuccess() {
    setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_CARD'));

    gCorp.limit = undefined;

    if (!gTrans.isBack) {
        searchInfo = {
            transType: "T19",
            maker: "",
            status: "",
            fromDate: "",
            endDate: ""
        };

        totalPages = 0;
        gTrans.curPage = 1;


    }
    init();
    gTrans.isBack = false;
}

//--0. common
function addEventListenerToCombobox(selectHandle, closeHandle) {
    document.addEventListener("evtSelectionDialog", selectHandle, false);
    document.addEventListener("evtSelectionDialogClose", closeHandle, false);
}

function removeEventListenerToCombobox(selectHandle, closeHandle) {
    document.removeEventListener("evtSelectionDialog", selectHandle, false);
    document.removeEventListener("evtSelectionDialogClose", closeHandle, false);
}
//--END 0

function init() {
    angular.module("EbankApp").controller("card-trans-auth-src", function ($scope, requestMBServiceCorp) {
        clearCache = true;
        if(gModeScreenView == CONST_MODE_SCR_SMALL ){
            document.getElementById("nav.btn.home").style.display = "block";
        }
        navCachedPages["authorize/auth-transfer"] = null;
        document.getElementById('maker').value = CONST_STR.get("COM_ALL");
        document.getElementById('status').value = (gUserInfo.lang == 'EN') ? INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_EN[0] : INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_VN[0];
        // $scope.srcmobile = 'pages/authorize/transfer/views/auth-trans-table-mobile-list-card.html';
        // $scope.src = 'pages/authorize/transfer/views/auth-trans-table-desk-list.html';
        
        $scope.initData = function () {
            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_AUTHORIZE_CARD_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0' && response.respJsonObj.makers.length > 0 && response.respJsonObj.limit) {
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
                        for (var i in gTrans.makers) {
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
                } else {
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                    gotoHomePage();

                }
            }, function () {
                showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                gotoHomePage();
            });

        }

//        Loai giao dich
        $scope.showTransTypeSelection = function () {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_CARD_TRANS_TYPE_EN : CONST_CARD_TRANS_TYPE_VN;
            var tmpArray2 = CONST_CARD_TRANS_TYPE_KEY;
            document.addEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showTransTypeSelectionOpen(e) {
            if (currentPage == "authorize/transfer/search-pending/card/card-trans-auth-src") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null) && e.selectedValue2 == 'T69') {
                    document.getElementById('id-trans-local').value = e.selectedValue1;
                    document.getElementById('id-trans-local-value').value = e.selectedValue2;
                    showTransTypeSelectionClose();
                } else {
					navCachedPages['authorize/transfer/search-pending/account/account-trans-auth-src'] = null;
                    navController.pushToView('authorize/transfer/search-pending/account/account-trans-auth-src', true, 'html');	
                }
            }
        }

        function showTransTypeSelectionClose() {
            if (currentPage == "authorize/transfer/search-pending/card/card-trans-auth-src") {
                document.removeEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            }
        }

//        end Loai giao dich

        //Nguoi lap
        $scope.showMakerSelection = function () {
            var tmpArray1 = gTrans.listMaker;
            var tmpArray2 = gTrans.listMakerValue;
            document.addEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showMakerSelectionOpen(e) {
            if (currentPage == "authorize/transfer/search-pending/card/card-trans-auth-src") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('maker').value = e.selectedValue1;
                    document.getElementById('makerVal').value = e.selectedValue2;
                    showMakerSelectionClose();
                }
            }
        }

        function showMakerSelectionClose() {
            if (currentPage == "authorize/transfer/search-pending/card/card-trans-auth-src") {
                document.removeEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
            }
        }

        //Trang thai
        $scope.showStatusSelection = function () {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_EN : INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_VN;
            var tmpArray2 = INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_KEY;
            document.addEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showStatusSelectionOpen(e) {
            if (currentPage == "authorize/transfer/search-pending/card/card-trans-auth-src") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('status').value = e.selectedValue1;
                    document.getElementById('statusVal').value = e.selectedValue2;
                    showStatusSelectionClose();
                }
            }
        }

        function showStatusSelectionClose() {
            if (currentPage == "authorize/transfer/search-pending/card/card-trans-auth-src") {
                document.removeEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
            }
        }

        //Duyệt một giao dịch
        $scope.goToViewScreen = function (e) {
            gTrans.listSelectedTrans = [];
            for (var i in gTrans.listPending) {
                if (e == gTrans.listPending[i].MA_GD) {
                    gTrans.transInfo = gTrans.listPending[i];
                    gTrans.listSelectedTrans.push(gTrans.transInfo);
                    break;
                }
            }

            if (!validate()) return;
            gTrans.listRequset = [];
            gTrans.transInfoRequest = {};
            gTrans.transInfo.LOAI_GIAO_DICH = CONST_STR.get('AUTHORIZE_TRANS_TIT_CARD_TRANSFER');
            gTrans.transInfoRequest.transIds = gTrans.transInfo.MA_GD;
            gTrans.transInfoRequest.idTxn = gTrans.transInfo.LOAI_GD;
            gTrans.transInfoRequest.userIdRef = gTrans.transInfo.IDUSERREFERENCE;
            gTrans.listRequset.push(gTrans.transInfoRequest);
            gTrans.idtxn = 'T69';
            // thuatnt
            var setPersonCharged;
            if (gTrans.transInfo.NGUOI_CHIU_PHI == 'N') {
                setPersonCharged = CONST_STR.get('IDENTIFICATION_FEE_SENDER');
            } else {
                setPersonCharged = CONST_STR.get('IDENTIFICATION_FEE_RECEIVER_PAY');
            }
            gTrans.transInfo.personCharged = setPersonCharged;
            gTrans.transInfo.mngBeneficiaries = getTransTempInfo(gTrans.transInfo.TYPE_TEMPLATE);
            gTrans.transInfo.inotification = getSendMethod(gTrans.transInfo.SENDMETHOD);
            // end thuatnt
            gTrans.transInfo.sodu = gTrans.transInfo.SO_DU_KHA_DUNG - gTrans.transInfo.SO_TIEN - gTrans.transInfo.PHI_DV;
            if(gTrans.transInfo.sodu < 0){
                showAlertText(CONST_STR.get("CORP_MSG_TRANS_BATCH_BALANCE_NOT_ENOUGH"));
                return;
            }
            gTrans.cmdType = CONSTANTS.get('CMD_CO_AUTHORIZE_CARD_TRANSFER');
            gTrans.scr = 'pages/authorize/transfer/search-pending/card/auth-once-trans-card-view.html';
            gTrans.srcViewListPending = 'authorize/transfer/search-pending/card/card-trans-auth-src';
            navCachedPages['authorize/transfer/common-review/auth-once-trans-review'] = null;
            navController.pushToView('authorize/transfer/common-review/auth-once-trans-review', true, 'html');
        }
        //Duyệt nhiều giao dịch
        $scope.authorizeTransaction = function () {
            var reason = document.getElementById('trans.reason').value;
            if(reason){
                showAlertText(CONST_STR.get("COM_CHECK_REJECT_BUTTON"));
                return;
            }
            gTrans.listSelectedTrans = [];
            gTrans.listRequset = [];
            var checkBoxAll = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
            for (var i = 0; i < checkBoxAll.length; i++) {
                if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                    for (var j in $scope.listPending) {
                        if (checkBoxAll[i].name == $scope.listPending[j].MA_GD) {
                            gTrans.listSelectedTrans.push($scope.listPending[j]);
                            gTrans.obj = {};
                            gTrans.obj.transIds = $scope.listPending[j].MA_GD;
                            gTrans.obj.idTxn = $scope.listPending[j].LOAI_GD;
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

            if (!validate()) return;
            gTrans.reason = "";
            gTrans.authen = true;
            gTrans.sequenceId = 4;
            gTrans.idtxn = 'T69';
            gTrans.cmdType = CONSTANTS.get('CMD_CO_AUTHORIZE_CARD_TRANSFER');
            gTrans.srcViewListPending = 'authorize/transfer/search-pending/card/card-trans-auth-src';
            gTrans.srcAuthenDesktop = 'pages/authorize/transfer/search-pending/card/auth-review-trans-card-desktop.html';
            gTrans.srcAuthenMobile = 'pages/authorize/transfer/search-pending/card/auth-review-trans-card-mobile.html';
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
                        if (checkBoxAll[i].name == $scope.listPending[j].MA_GD) {
                            gTrans.listSelectedTrans.push($scope.listPending[j]);
                            if (gTrans.obj.transIds == undefined || gTrans.obj.transIds == null) {
                                gTrans.obj.transIds = $scope.listPending[j].MA_GD;
                            } else {
                                gTrans.obj.transIds = gTrans.obj.transIds + "," + $scope.listPending[j].MA_GD;
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

            for(var i = 0; i < gTrans.listSelectedTrans.length; i++){
                gTrans.listSelectedTrans[i].mngBeneficiaries = getTransTempInfo(gTrans.listSelectedTrans[i].TYPE_TEMPLATE);
            }
            gTrans.reason = reason;
            gTrans.authen = false;
            gTrans.sequenceId = 3;
            gTrans.idtxn = 'T69';
            gTrans.cmdType = CONSTANTS.get('CMD_CO_AUTHORIZE_CARD_TRANSFER');
            gTrans.srcViewListPending = 'authorize/transfer/search-pending/card/card-trans-auth-src';
            gTrans.srcAuthenDesktop = 'pages/authorize/transfer/search-pending/card/auth-review-trans-card-desktop.html';
            gTrans.srcAuthenMobile = 'pages/authorize/transfer/search-pending/card/auth-review-trans-card-mobile.html';
            navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
            navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');

        }


        function validate() {
            // Kiem tra so du kha dung
            for (var i in gTrans.listSourceAccounts) {
                var totalAmount = 0;
                for (var j in gTrans.listSelectedTrans) {
                    if (gTrans.listSelectedTrans[j].TK_CHUYEN == gTrans.listSourceAccounts[i].account) {
                        totalAmount = totalAmount + parseInt(gTrans.listSelectedTrans[j].SO_TIEN);
                    }
                }

                if (totalAmount > parseInt(removeSpecialChar(gTrans.listSourceAccounts[i].balance))) {
                    showAlertText(CONST_STR.get("CORP_MSG_TRANS_BATCH_BALANCE_NOT_ENOUGH"));
                    return false;
                }
            }


            // Kiem tra han muc neu co
            var totalAmount = 0;
            for (var i in gTrans.listSelectedTrans) {
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
            if (parseInt(gTrans.limit.limitDay) < parseInt(totalAmount) + parseInt(gTrans.limit.totalDay)) {
                var errMsg = formatString(CONST_STR.get(errorMsgDay),
                    [formatNumberToCurrency(gTrans.limit.limitDay)]);
                showAlertText(errMsg);
                return false;
            }


            return true;
        }


        $scope.initData();

        //--4. Gửi thông tin tìm kiếm
		$scope.sendJSONRequest = function (){
			// document.getElementById('id.searchResult').innerHTML = "";
            if(!this.checkDateValue())
                    return;
                
			searchInfo.fromDate = document.getElementById("id.begindate").value;
            searchInfo.endDate = document.getElementById("id.enddate").value;
			searchInfo.status = document.getElementById("status").value;
            searchInfo.maker = document.getElementById("maker").value;
            if(searchInfo.status == CONST_STR.get('COM_ALL')){
                searchInfo.status = "";
            }
            if(searchInfo.maker == CONST_STR.get('COM_ALL')){
                searchInfo.maker = "";
            }
			var jsonData = new Object();
			jsonData.sequence_id = "2";
			jsonData.idtxn = gTrans.idtxn;

			jsonData.transType = searchInfo.transType;
			jsonData.status = searchInfo.status;
			jsonData.maker = searchInfo.maker;
			jsonData.fromDate = searchInfo.fromDate;
			jsonData.endDate = searchInfo.endDate;

			var	args = new Array();
			args.push("2");
			args.push(jsonData);
			var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_AUTHORIZE_CARD_TRANSFER'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
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

        $scope.checkDateValue = function(){
                var startDate = document.getElementById("id.begindate").value;
                var endDate = document.getElementById("id.enddate").value;
                var startDateValueInt = parseInt(startDate);
                var currentDate = new Date();

                var strCurrentDate = ('0' + (currentDate.getDate())) + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();

                if (!this.calculateDifferentMonth(startDate, strCurrentDate)) {
                    showAlertText(formatString(CONST_STR.get("GUA_NOT_GREATER_TODAY"), [CONST_STR.get("COM_START_DATE")]));
                    return false;
                }

                if (!this.calculateDifferentMonth(endDate, strCurrentDate)) {
                    showAlertText(formatString(CONST_STR.get("GUA_NOT_GREATER_TODAY"), [CONST_STR.get("COM_TO_DATE")]));
                    return false;
                }

                if (!this.calculateDifferentMonth(startDate,endDate)) {
                    showAlertText(CONST_STR.get("GUA_PERIODIC_END_DATE_LESS_TO_DATE"));
                    return false;
                }

                return true;
            }

            $scope.calculateDifferentMonth =function (valFromDate, valToDate) {
                if (valFromDate == '' || valFromDate == undefined) {
                    return true;
                };
                var from = valFromDate.split("/");
                var to = valToDate.split("/");
                var fromDate = new Date(parseInt(from[2], 10), parseInt(from[1], 10) - 1, parseInt(from[0], 10));
                var toDate = new Date(parseInt(to[2], 10), parseInt(to[1], 10) - 1, parseInt(to[0], 10));
                if (fromDate > toDate) {
                    return false;
                }
                return true;
            }
    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}
//send du lieu len de xuat file excel
function exportExcelDebtHistory() {
    var transIds = "";
    for (var i in results) {
        transIds += results[i].MA_GD + ",";
    }
    var arrayClientInfo = new Array();
    arrayClientInfo.push(null);
    arrayClientInfo.push({
        sequenceId : "17",
        transType : "T19",
        transIds : transIds
    });

    var gprsCmd = new GprsCmdObj(CONSTANTS.get('COM_EXPORT_EXCEL_REPORT'), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

    data = getDataFromGprsCmd(gprsCmd);

    corpExportExcel(data);
}
