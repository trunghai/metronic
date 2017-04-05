gTrans.idtxn = "B62";
gTrans.isBack = false;

function viewBackFromOther() {
	gTrans.isBack = true;
}

function viewDidLoadSuccess() {
	
	if (!gTrans.isBack){
		searchInfo = {};
	}
	
	init();
	
}

function init() {
	angular.module("EbankApp").controller("auth-foreign-exchange",function ($scope, requestMBServiceCorp) {
		navCachedPages["authorize/auth-transfer"] = null;
		// document.addEventListener('evtChangeWidthDesktop',reGenContent,false);
		// document.addEventListener('evtChangeWidthMobile',reGenContent,false);
		// $scope.src = 'pages/authorize/exchange/views/auth-foreign-pending-desktop.html';
		// $scope.srcmobile = 'pages/authorize/exchange/views/auth-foreign-pending-mobile.html';

		// setTimeout(function () {
			// changeLanguageInView();
			// reGenContent();
		// }, 250);


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

		$scope.requestInit = function () {
			var jsonData = new Object();
			jsonData.sequence_id = "1";
			jsonData.idtxn = gTrans.idtxn;
			var	args = new Array();
			args.push(null);
			args.push(jsonData);
			var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_AUTH_FOREIGN_EXCHANGE"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
			var data = getDataFromGprsCmd(gprsCmd);
			requestMBServiceCorp.post(data, true, function(response) {
				gTrans.objJSON = response;
				if (response.respCode === '0' && response.respJsonObj.makers.length > 0 && response.respJsonObj.limit) {
					gTrans.makers = response.respJsonObj.makers;
					gTrans.limit = response.respJsonObj.limit;
					gTrans.listPending = response.respJsonObj.listpending;
					gTrans.listSourceAccounts = response.respJsonObj.listAccountUSD;
					$scope.listPending = gTrans.listPending;

				} else {
					showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
					gotoHomePage();
				}
			}, function() {
				showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
				gotoHomePage();
			});
		}

		//Duyệt một giao dịch
		$scope.goToViewScreen = function (e) {

			gTrans.listSelectedTrans = [];
			gTrans.listSelectedTrans.push(e);
			// if(!validate()){
				// gTrans.listSelectedTrans = [];
				// return;
			// };
			if(!validate()) return;
            gTrans.transInfo = [];
            for (var i in gTrans.listPending) {
                if (e == gTrans.listPending[i].MA_GD) {
                   gTrans.transInfo.push(gTrans.listPending[i]);
                   break;
                }
            }
			
			gTrans.listRequset = [];
			gTrans.transInfoRequest = {};
			gTrans.transInfoRequest.transIds = gTrans.transInfo[0].MA_GD;
			gTrans.transInfoRequest.idtxn = gTrans.idtxn;
			gTrans.transInfoRequest.sequence_id = "4";
			gTrans.listRequset.push(gTrans.transInfoRequest);
			gTrans.cmdType = CONSTANTS.get('CMD_CO_AUTH_FOREIGN_EXCHANGE');
			gTrans.scr = 'pages/authorize/exchange/views/auth-foreign-exchange-view.html';
			gTrans.srcViewListPending = 'authorize/exchange/auth-foreign-exchange';

			navCachedPages['authorize/transfer/common-review/auth-once-trans-review'] = null;
			navController.pushToView('authorize/transfer/common-review/auth-once-trans-review', true, 'html');
		}

		//Duyệt nhiều giao dịch
		$scope.authorizeTransaction = function () {
			gTrans.listSelectedTrans = [];
			gTrans.listRequset = [];
			gTrans.transInfoRequest = {};
			var checkBoxAll = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
			for (var i = 0; i < checkBoxAll.length; i++) {
				if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
					for (var j in $scope.listPending){
						if (checkBoxAll[i].name == $scope.listPending[j].MA_GD){
							gTrans.listSelectedTrans.push($scope.listPending[j]);
							if(gTrans.transInfoRequest.transIds == null || gTrans.transInfoRequest.transIds == undefined){
								gTrans.transInfoRequest.transIds = $scope.listPending[j].MA_GD;
							}else {
								gTrans.transInfoRequest.transIds =gTrans.transInfoRequest.transIds + ',' + $scope.listPending[j].MA_GD;
							}
						}
					}
				}
			}

			if (gTrans.listSelectedTrans.length == 0) {
				showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
				return;
			}

			if(!validate()) return;
			gTrans.reason = "";
			gTrans.authen = true;
			gTrans.transInfoRequest.idtxn = gTrans.idtxn;
			gTrans.transInfoRequest.sequence_id = "4";
			gTrans.cmdType = CONSTANTS.get('CMD_CO_AUTH_FOREIGN_EXCHANGE');
			gTrans.srcViewListPending = 'authorize/exchange/auth-foreign-exchange';
			gTrans.srcAuthenDesktop = 'pages/authorize/exchange/views/auth-once-more-foreign-desktop.html';
			gTrans.srcAuthenMobile = 'pages/authorize/exchange/views/auth-once-more-foreign-mobile.html';
			navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
			navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');
		}

		$scope.rejectTransaction = function () {
			gTrans.listSelectedTrans = [];
			gTrans.listRequset = [];
			gTrans.transInfoRequest = {};
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
							if(gTrans.transInfoRequest.transIds == null || gTrans.transInfoRequest.transIds == undefined){
								gTrans.transInfoRequest.transIds = $scope.listPending[j].MA_GD;
							}else {
								gTrans.transInfoRequest.transIds =gTrans.transInfoRequest.transIds + ',' + $scope.listPending[j].MA_GD;
							}
						}
					}
				}
			}

			if (gTrans.listSelectedTrans.length == 0) {
				showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
				return;
			}
			gTrans.authen = false;
			gTrans.transInfoRequest.idtxn = gTrans.idtxn;
			gTrans.transInfoRequest.sequence_id = "3";
			gTrans.transInfoRequest.rejectReason = reason;
			gTrans.reason = reason;
			gTrans.cmdType = CONSTANTS.get('CMD_CO_AUTH_FOREIGN_EXCHANGE');
			gTrans.srcViewListPending = 'authorize/exchange/auth-foreign-exchange';
			gTrans.srcAuthenDesktop = 'pages/authorize/exchange/views/auth-once-more-foreign-desktop.html';
			gTrans.srcAuthenMobile = 'pages/authorize/exchange/views/auth-once-more-foreign-mobile.html';
			navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
			navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');
		}
		
		$scope.onSearchPending = function () {
			searchInfo.maker = document.getElementById("makerVal").value;
			searchInfo.status = document.getElementById("statusVal").value;
			searchInfo.fromDate = document.getElementById("fromDate").value;
			searchInfo.endDate = document.getElementById("toDate").value;

			var jsonData = new Object();
			jsonData.sequence_id = "2";
			jsonData.idtxn = gTrans.idtxn;

			jsonData.status = searchInfo.status;
			jsonData.maker = searchInfo.maker;
			jsonData.fromDate = searchInfo.fromDate;
			jsonData.endDate = searchInfo.endDate;

			var	args = new Array();
			args.push("2");
			args.push(jsonData);
			var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_AUTH_FOREIGN_EXCHANGE'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
			var data = getDataFromGprsCmd(gprsCmd);

			requestMBServiceCorp.post(data, true, function (response) {
				if(response.respCode == '0'){
					$scope.listPending = response.respJsonObj;
				}
			}, function () {
				
			});
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
					if (gTrans.listSelectedTrans[j].TK_CHUYEN == gTrans.listSourceAccounts[i].IDACCOUNT){
						totalAmount = totalAmount + parseInt(gTrans.listSelectedTrans[j].SO_LUONG);
					}
				}

				if(totalAmount > parseInt(gTrans.listSourceAccounts[i].NUMAVAILABLE)){
					showAlertText(CONST_STR.get("CORP_MSG_TRANS_BATCH_BALANCE_NOT_ENOUGH"));
					return false;
				}
			}


			// Kiem tra han muc neu co
			var totalAmount = 0;
			for (var i in gTrans.listSelectedTrans){
				totalAmount = totalAmount + parseInt(gTrans.listSelectedTrans[i].TONG_TIEN_QUY_DOI);
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

		//=================SHOW DIALOG MAKER====================================//
		$scope.showMakerSelection =function () {
			var tmpArray1 = [];
			var tmpArray2 = [];

			for (var i in gTrans.makers){
				tmpArray1.push(gTrans.makers[i].IDUSER);
				tmpArray2.push(gTrans.makers[i].IDUSER);
			}
			document.addEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
			document.addEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
			showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
		}

		function showMakerSelectionOpen(e) {
			if (currentPage == "authorize/exchange/auth-foreign-exchange") {
				if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
					document.getElementById('maker').value = e.selectedValue1;
					document.getElementById('makerVal').value = e.selectedValue2;
					showMakerSelectionClose();
				}
			}
		}

		function showMakerSelectionClose() {
			if (currentPage == "authorize/exchange/auth-foreign-exchange") {
				document.removeEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
				document.removeEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
			}
		}
		//=================SHOW DIALOG STATUS====================================//
		$scope.showStatusSelection =function () {
			var tmpArray1 = (gUserInfo.lang == 'EN') ? INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_EN: INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_VN;
			var tmpArray2 = INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_KEY;
			document.addEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
			document.addEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
			showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
		}

		function showStatusSelectionOpen(e) {
			if (currentPage == "authorize/exchange/auth-foreign-exchange") {
				if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
					document.getElementById('status').value = e.selectedValue1;
					document.getElementById('statusVal').value = e.selectedValue2;
					showStatusSelectionClose();
				}
			}
		}

		function showStatusSelectionClose() {
			if (currentPage == "authorize/exchange/auth-foreign-exchange") {
				document.removeEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
				document.removeEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
			}
		}
		//=================END DIALOG STATUS====================================//
	});
	angular.bootstrap(document.getElementById('mainViewContent'), ["EbankApp"]);
}

function exportExcelDebtHistory() {
	  var transIds = "";
	  for (var i in gTrans.listPending) {
		transIds += gTrans.listPending[i].MA_GD + ",";
	  }
	  var arrayClientInfo = new Array();
	  arrayClientInfo.push(null);
	  arrayClientInfo.push({
		sequenceId: "16",
		transType: "A13",
		transIds: transIds
	  });

	  var gprsCmd = new GprsCmdObj(CONSTANTS.get('COM_EXPORT_EXCEL_REPORT'), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

	  data = getDataFromGprsCmd(gprsCmd);

	  corpExportExcel(data);
}