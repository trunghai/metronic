var viewBack = false;
gTrans.transInfo = {};
gTrans.idtxn = "T64"
var searchInfo;

function viewDidLoadSuccess() {
    if (!viewBack){
        document.getElementById('transType').value = (gUserInfo.lang == 'VN') ? CONST_TRANS_TYPE_PERIODIC_VN[0] : CONST_TRANS_TYPE_PERIODIC_EN[0];
        document.getElementById('maker').value = (gUserInfo.lang == 'VN') ? "Tất cả" : "All";
        document.getElementById('status').value = (gUserInfo.lang == 'VN') ? CONST_APPROVE_TRANS_STATUS_VN[0] : CONST_APPROVE_TRANS_STATUS_EN[0];
		searchInfo = {
			transType : "T14",
			maker : "ALL",
			status : CONST_APPROVE_TRANS_STATUS[0],
			fromDate : "",
			endDate : ""
		};
    }

    init();
}

function init() {
    angular.module('EbankApp').controller('periodic-transfer', function ($scope, requestMBServiceCorp) {
        navCachedPages["authorize/auth-transfer"] = null;
        if(gModeScreenView == CONST_MODE_SCR_SMALL ){
            document.getElementById("nav.btn.home").style.display = "block";
        }
        // $scope.srcmobile = 'pages/authorize/transfer/search-pending/domestic/views/auth-domestic-pending-mobile.html';
        // $scope.src = 'pages/authorize/transfer/search-pending/domestic/views/auth-domestic-pending-desktop.html';
		$scope.clickBackWaitTransfer = function () {
			navCachedPages["authorize/auth-transfer"] = null;
			navController.pushToView("authorize/auth-transfer", true, "html");
		}
	
        $scope.initData = function () {
            var jsonData = new Object();
            jsonData.idtxn = gTrans.idtxn;
            jsonData.sequenceId = "1";
            jsonData.transId = "";
            jsonData.transDetailCode = "";

            var	args = new Array();
            args.push("1");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_AUTHORIZE_PERIODIC_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if(response.respCode == '0' && response.respJsonObj.makers.length > 0 && response.respJsonObj.limit) {
                    gTrans.makers = response.respJsonObj.makers;
                    gTrans.limit = response.respJsonObj.limit;
                    gTrans.listSourceAccounts = response.respJsonObj.listSourceAccounts;
                    gTrans.listPending = response.respJsonObj.list_pending;
                    gTrans.listMaker = [];
                    gTrans.listMakerValue = [];
                    gTrans.listMaker.push(CONST_STR.get("COM_ALL"));
                    gTrans.listMakerValue.push("");
                    for (var i in gTrans.makers){
                        gTrans.listMaker.push(gTrans.makers[i].IDUSER);
                        gTrans.listMakerValue.push(gTrans.makers[i].IDUSER);

                    }

					var result = document.getElementById('id.searchResult');
						if (response.respJsonObj == null){
							result.style.display = 'none';
							$scope.listPending = [];
						}else {
							$scope.listPending = response.respJsonObj.list_pending;
							if (response.respJsonObj.list_pending.length > 0) {
								result.style.display = 'block';
								document.getElementById('id.message').style.display = 'none';
							}else{
								result.style.display = 'none';
								document.getElementById('id.message').style.display = 'block';
								document.getElementById('id.message.value').innerHTML = CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST");
							}
						}
					} else {
						showAlertText(response.respContent);
					}
				}, function() {
					showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
				});
			}

        //=================SHOW DIALOG TRANSTYPE====================================//
        $scope.showTransTypeSelection =function () {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_TRANS_TYPE_PERIODIC_EN : CONST_TRANS_TYPE_PERIODIC_VN;
            var tmpArray2 = CONST_TRANS_TYPE_PERIODIC_ID;
            document.addEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showTransTypeSelectionOpen(e) {
            if (currentPage == "authorize/transfer/search-pending/periodic/periodic-transfer") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('transType').value = e.selectedValue1;
					searchInfo.transType = e.selectedValue2;
                    showTransTypeSelectionClose();
                }
            }
        }

        function showTransTypeSelectionClose() {
            if (currentPage == "authorize/transfer/search-pending/periodic/periodic-transfer") {
                document.removeEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            }
        }

        //=================SHOW DIALOG MAKER====================================//
        $scope.showMakerSelection =function () {
            var tmpArray1 = gTrans.listMaker;
            var tmpArray2 = gTrans.listMakerValue;
            document.addEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showMakerSelectionOpen(e) {
            if (currentPage == "authorize/transfer/search-pending/periodic/periodic-transfer") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('maker').value = e.selectedValue1;
                    document.getElementById('makerVal').value = e.selectedValue2;
					searchInfo.maker = e.selectedValue2;
                    showMakerSelectionClose();
                }
            }
        }

        function showMakerSelectionClose() {
            if (currentPage == "authorize/transfer/search-pending/periodic/periodic-transfer") {
                document.removeEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
            }
        }

        //=================SHOW DIALOG STATUS====================================//
        $scope.showStatusSelection =function () {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_APPROVE_TRANS_STATUS_EN: CONST_APPROVE_TRANS_STATUS_VN;
            var tmpArray2 = CONST_APPROVE_TRANS_STATUS;
            document.addEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showStatusSelectionOpen(e) {
            if (currentPage == "authorize/transfer/search-pending/periodic/periodic-transfer") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('status').value = e.selectedValue1;
					searchInfo.status = e.selectedValue2;
                    showStatusSelectionClose();
                }
            }
        }

        function showStatusSelectionClose() {
            if (currentPage == "authorize/transfer/search-pending/periodic/periodic-transfer") {
                document.removeEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
            }
        }

        $scope.goToViewScreen = function (e, e1) {
            gTrans.listSelectedTrans = [];
            for (var i in gTrans.listPending){
                if (e == gTrans.listPending[i].IDFCATREF){
                    gTrans.transInfo = gTrans.listPending[i];
                    gTrans.listSelectedTrans.push(gTrans.transInfo);
                    break;
                }
            }
            requestInfoDetailTrans(e1);
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

        function requestInfoDetailTrans(IDUSERREFERENCE) {
            var jsonData = new Object();
            jsonData.idtxn = 'T63';
            jsonData.sequenceId = "3";
            jsonData.transId = "";
            jsonData.transDetailCode = IDUSERREFERENCE;

            var	args = new Array();
            args.push("2");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_AUTHORIZE_DOMESTIC_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if(response.respCode == '0'){
                    gTrans.transInfo = response.respJsonObj[0];
					gTrans.transInfo.method = CONST_STR.get("COM_NOTIFY_"+gTrans.transInfo.SEND_METHOD+"");
					gTrans.transInfo.Frequency = CONST_STR.get("CONST_TRANS_FREQUENCY_"+gTrans.transInfo.TYPEFREQUENCY+"");
					
					if (gTrans.transInfo.TYPE_TEMPLATE == 404) {
						gTrans.transInfo.Template=CONST_STR.get("TAX_NO_SAVE_CODE");
					} else if (gTrans.transInfo.TYPE_TEMPLATE == 0) {
						gTrans.transInfo.Template=CONST_STR.get("COM_SAVE_BENEFICIARY");
					} else if (gTrans.transInfo.TYPE_TEMPLATE == 1) {
						gTrans.transInfo.Template=CONST_STR.get("COM_SAVE_TEMPLATE_TRANS");
					}
					
					gTrans.transInfo.FEE=formatNumberToCurrency(gTrans.transInfo.CHARGEFORDOM) + " " + gTrans.transInfo.CODTRNCURR;
					
                    if(!validate()) return;
                    gTrans.listRequset = [];
                    gTrans.transInfoRequest = {};
                    gTrans.transInfoRequest.transId = gTrans.transInfo.IDFCATREF;
                    gTrans.transInfoRequest.idtxn = "T64";
                    gTrans.transInfoRequest.transDetailCode = gTrans.transInfo.IDUSERREFERENCE;
                    gTrans.transInfoRequest.sequenceId = 5;
                    gTrans.transId  = gTrans.transInfo.IDFCATREF;
                    gTrans.transDetailCode  = gTrans.transInfo.IDUSERREFERENCE;
                    gTrans.listRequset.push(gTrans.transInfoRequest);
                    gTrans.idtxn = 'T64';
                    gTrans.cmdType = CONSTANTS.get('CMD_CO_AUTHORIZE_PERIODIC_TRANSFER');
                    gTrans.scr = 'pages/authorize/transfer/search-pending/periodic/auth-periodic-info-view.html';
                    gTrans.srcViewListPending = 'authorize/transfer/search-pending/periodic/periodic-transfer';
                    navCachedPages['authorize/transfer/common-review/auth-once-trans-review'] = null;
                    navController.pushToView('authorize/transfer/common-review/auth-once-trans-review', true, 'html');
                }
            });
        }

		/*HaiNM - Nút tìm kiếm*/
		$scope.onSearchPending = function () {
            if(!this.checkDateValue())
                return;

			searchInfo.fromDate = document.getElementById("fromDate").value;
			searchInfo.endDate = document.getElementById("toDate").value;

			
            var jsonData = new Object();
			jsonData.sequenceId = 2;
			jsonData.idtxn = gTrans.idtxn;
			jsonData.transTypeId = searchInfo.transType;
			jsonData.transStatus = searchInfo.status;
			if (searchInfo.maker ==""){
				jsonData.transMaker = "ALL";
			}else{
				jsonData.transMaker = searchInfo.maker;

			}
			jsonData.transId="";
			jsonData.dateBegin = searchInfo.fromDate;
			jsonData.dateEnd = searchInfo.endDate;
			jsonData.pageId=1;
			jsonData.pageSize=10000000;
			
            var args = new Array();
            args.push("1");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_AUTHORIZE_PERIODIC_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
				if (response.respCode == '0') {
                    var result = document.getElementById('id.searchResult');
                    if (response.respJsonObj == null){
                        result.style.display = 'none';
                        $scope.listPending = [];
                    }else {
                        $scope.listPending = response.respJsonObj.list_pending;
                        if (response.respJsonObj.list_pending.length > 0) {
                            result.style.display = 'block';
                            document.getElementById('id.message').style.display = 'none';
                        }else{
                            result.style.display = 'none';
                            document.getElementById('id.message').style.display = 'block';
                            document.getElementById('id.message.value').innerHTML = CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST");
                        }
                    }
                }else {
					showAlertText(response.respContent);
                }
            }, function () {
                showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
            });
        }
		
        $scope.checkDateValue = function(){
            var startDate = document.getElementById("begindate").value;
            var endDate = document.getElementById("enddate").value;
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
		/*HaiNM	- End*/
		
        //Duyệt nhiều giao dịch
        $scope.authorizeTransaction = function () {
            gTrans.listSelectedTrans = [];
            gTrans.listRequset = [];
            gTrans.obj = {};
            var checkBoxAll = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
            for (var i = 0; i < checkBoxAll.length; i++) {
                if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                    for (var j in $scope.listPending){
                        if (checkBoxAll[i].name == $scope.listPending[j].IDFCATREF){
                            gTrans.listSelectedTrans.push($scope.listPending[j]);

                            if(gTrans.obj.transIds == null || gTrans.obj.transIds == undefined){
                                gTrans.obj.transIds = $scope.listPending[j].IDFCATREF;
                                gTrans.obj.listIdUserRef = $scope.listPending[j].IDUSERREFERENCE;
                            }else {
                                gTrans.obj.transIds = gTrans.obj.transIds+ ',' + $scope.listPending[j].IDFCATREF;
                                gTrans.obj.listIdUserRef = gTrans.obj.listIdUserRef + ',' + $scope.listPending[j].IDUSERREFERENCE;
                            }

                        }
                    }
                }
            }

            gTrans.obj.sequenceId = 6;
            gTrans.obj.idtxn = 'T64';
            gTrans.listRequset.push(gTrans.obj);

            if (gTrans.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }

            if(!validate()) return;
            gTrans.reason = "";
            gTrans.authen = true;
            gTrans.sequenceId = 6;
            gTrans.idtxn = 'T64';
            gTrans.cmdType = CONSTANTS.get('CMD_CO_AUTHORIZE_PERIODIC_TRANSFER');
            gTrans.srcViewListPending = 'authorize/transfer/search-pending/periodic/periodic-transfer';
            gTrans.srcAuthenDesktop = 'pages/authorize/transfer/search-pending/periodic/auth-periodic-review-destop.html';
            gTrans.srcAuthenMobile = 'pages/authorize/transfer/search-pending/periodic/auth-periodic-review-mobile.html';
            navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
            navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');
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
            gTrans.obj = {};
            for (var i = 0; i < checkBoxAll.length; i++) {
                if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                    for (var j in $scope.listPending){
                        if (checkBoxAll[i].name == $scope.listPending[j].IDFCATREF){
                            gTrans.listSelectedTrans.push($scope.listPending[j]);

                            if(gTrans.obj.transIds == null || gTrans.obj.transIds == undefined){
                                gTrans.obj.transIds = $scope.listPending[j].IDFCATREF;
                                gTrans.obj.listIdUserRef = $scope.listPending[j].IDUSERREFERENCE;
                            }else {
                                gTrans.obj.transIds = gTrans.obj.transIds + ',' + $scope.listPending[j].IDFCATREF;
                                gTrans.obj.listIdUserRef = gTrans.obj.listIdUserRef + ',' + $scope.listPending[j].IDUSERREFERENCE;
                            }
                        }
                    }
                }
            }
            gTrans.obj.sequenceId = 5;
            gTrans.obj.idtxn = 'T64';
            gTrans.listRequset.push(gTrans.obj);

            if (gTrans.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }


            gTrans.reason = reason;
            gTrans.authen = false;
            gTrans.sequenceId = 5;
            gTrans.idtxn = 'T64';
            gTrans.cmdType = CONSTANTS.get('CMD_CO_AUTHORIZE_PERIODIC_TRANSFER');
            gTrans.srcViewListPending = 'authorize/transfer/search-pending/periodic/periodic-transfer';
            gTrans.srcAuthenDesktop = 'pages/authorize/transfer/search-pending/periodic/auth-periodic-review-destop.html';
            gTrans.srcAuthenMobile = 'pages/authorize/transfer/search-pending/periodic/auth-periodic-review-mobile.html';
            navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
            navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');

        }
        $scope.onSearchPending();
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
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
function exportExcelDebtHistory () {
    var transIds = "";
	var jsonObj = gTrans.listPending;
	for (var i in jsonObj) {
		transIds += jsonObj[i].IDFCATREF + ",";
	}
	var arrayClientInfo = new Array();
	arrayClientInfo.push(null);
	arrayClientInfo.push({
		sequenceId: "5",
		transType: "T14",
		transIds: transIds
	});

	var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_EXPORT_EXCEL_REPORT"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

	data = getDataFromGprsCmd(gprsCmd);

	corpExportExcel(data);
}