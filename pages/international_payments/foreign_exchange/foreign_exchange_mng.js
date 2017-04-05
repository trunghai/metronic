gPay.rowsPerPage = 10;
var totalPages = 0;

gCorp.isBack = false;

function viewBackFromOther() {
  //Flag check
  gCorp.isBack = true;
}

function viewDidLoadSuccess() {

  // createDatePicker('id.begindate', 'span.begindate');
  // createDatePicker('id.mngenddate', 'span.enddate');
  if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
    gPay.rowsPerPage = 10;
  }else{
    gPay.rowsPerPage = 5;
  }

  if(!gCorp.isBack){
    document.getElementById('tblContent').innerHTML = "";
     if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        document.getElementById('id.transType').value = CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC');
        document.getElementById('id.stt').value = CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC');
        document.getElementById('id.moneyType').value = CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC');
        document.getElementById('id.accountno').value = CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC');
        document.getElementById('id.begindate').value = "";
        document.getElementById('id.mngenddate').value = "";
      }else{
        document.getElementById('id.transTypemb').value = CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC');
        document.getElementById('id.sttmb').value = CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC');
        document.getElementById('id.moneyTypemb').value = CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC');
        document.getElementById('id.accountnomb').value =CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC');
        document.getElementById('id.begindatemb').value = "";
        document.getElementById('id.mngenddatemb').value = "";
      }
    gPay.searchData = {
      sequenceId: "1",
      transType: "",
      status: "",
      moneyUnit: "",
      idMaker: "",
      startDate: "",
      endDate: ""
    }
    gPay.searchData.transType = CONST_FOREIGN_TRANS_TYPE_KEY[0];
    gPay.searchData.status = CONST_FOREIGN_STATUS_KEY[0];
    gPay.searchData.moneyUnit = CONST_FOREIGN_MONEY_UNIT_KEY[0];
    gPay.searchData.idMaker = '';
  }
  init();
}


function init(){
  angular.module('EbankApp').controller('foreign_exchange_mng', function ($scope, requestMBServiceCorp){
      navController.getBottomBar().hide();
    // show loại giao dịch
    $scope.showTransferType = function() {
      var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_FOREIGN_TRANS_TYPE_EN : CONST_FOREIGN_TRANS_TYPE_VN;
      var tmpArray2 = CONST_FOREIGN_TRANS_TYPE_KEY;

      var selectedTransType = function(e) {
        if (currentPage == "international_payments/foreign_exchange/foreign_exchange_mng") {
          document.removeEventListener("evtSelectionDialog", selectedTransType, false);
          var transType;
          if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
            transType = document.getElementById('id.transType');
          }else{
            transType = document.getElementById('id.transTypemb');
          }
          if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
            transType.value = e.selectedValue1;
          } else {
            transType.innerHTML = e.selectedValue1;
          }

          if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
            gPay.searchData.transType = e.selectedValue2;
          }
        }
      }

      var selectedTransTypeClose = function() {
        if (currentPage == "international_payments/foreign_exchange/foreign_exchange_mng") {
          document.removeEventListener("evtSelectionDialogClose", selectedTransTypeClose, false);
          document.removeEventListener("evtSelectionDialog", selectedTransType, false);
        }
      }

      document.addEventListener("evtSelectionDialog", selectedTransType, false);
      document.addEventListener("evtSelectionDialogClose", selectedTransTypeClose, false);
      showDialogList(CONST_STR.get('COM_CHOOSEN_TYPE_TRANS'), tmpArray1, tmpArray2, false);
    }

    $scope.onGoBack = function () {
        navCachedPages['international_payments/foreign_exchange/foreign_exchange'] = null;
        navController.popToViewInit('international_payments/foreign_exchange/foreign_exchange', true, 'html');
    }

    // Lấy danh sách người tạo giao dịch
    $scope.getListMaker = function() {
      dataObj = new Object();
      dataObj.sequence_id = "1";
      dataObj.idtxn = "T00";

      var arrArgs = new Array();
      arrArgs.push("1");
      arrArgs.push(dataObj);

      var _success = function(e) {
        var gprsResp = e;//JSON.parse(e);
        setRespObjStore(gprsResp);
        var obj = gprsResp.respJsonObj;

        var listUser = [];
        listUser.push(CONST_STR.get("COM_ALL"));

        var keyListUser = [];
        keyListUser.push("");

        for (var i in obj) {
          listUser.push(obj[i].IDUSER);
          keyListUser.push(obj[i].IDUSER);
        }

        document.addEventListener("evtSelectionDialog", handleSelectUser, false);
        document.addEventListener("evtSelectionDialogClose", handleCloseUserClose, false);
        showDialogList(CONST_STR.get('COM_CHOOSE_MAKER_TRADE'), listUser, keyListUser, false);
      }

      function handleSelectUser(e) {
        handleCloseUserClose();
        // searchData.accdeb = e.selectedValue2;
        var maker;
        if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
          maker = document.getElementById('id.accountno');
        }else{
          maker = document.getElementById('id.accountnomb');
        }
        maker.value = e.selectedValue1;
        gPay.searchData.idMaker = e.selectedValue1;
      }

      function handleCloseUserClose() {
        document.removeEventListener("evtSelectionDialogClose", handleCloseUserClose, false);
        document.removeEventListener("evtSelectionDialog", handleSelectUser, false);
      }

      var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_USER_CREATED_TRANSACTION"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrArgs);
      var data = getDataFromGprsCmd(gprsCmd);
      requestMBServiceCorp.post(data, true, _success, "");
    }

    // Show trạng thái giao dịch
    $scope.showStatus = function() {
      var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_FOREIGN_STATUS_EN : CONST_FOREIGN_STATUS_VN;
      var tmpArray2 = CONST_FOREIGN_STATUS_KEY;

      var selectedStatus = function(e) {

        if (currentPage == "international_payments/foreign_exchange/foreign_exchange_mng") {
          document.removeEventListener("evtSelectionDialog", selectedStatus, false);
          var status;
          if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
            status = document.getElementById('id.stt');
          }else{
            status = document.getElementById('id.sttmb');
          }
          if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
            status.value = e.selectedValue1;
          } else {
            status.innerHTML = e.selectedValue1;
          }

          if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
            gPay.searchData.status = e.selectedValue2;
          }
        }
      }

      var selectedStatusClose = function() {
        if (currentPage == "international_payments/foreign_exchange/foreign_exchange_mng") {
          document.removeEventListener("evtSelectionDialogClose", selectedStatusClose, false);
          document.removeEventListener("evtSelectionDialog", selectedStatus, false);
        }
      }

      document.addEventListener("evtSelectionDialog", selectedStatus, false);
      document.addEventListener("evtSelectionDialogClose", selectedStatusClose, false);
      showDialogList(CONST_STR.get('COM_CHOOSE_STATUS'), tmpArray1, tmpArray2, false);
    }

    // Show loại tiền tệ
    $scope.showMoneyUnit = function() {
      var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_FOREIGN_MONEY_UNIT_EN : CONST_FOREIGN_MONEY_UNIT_VN;
      var tmpArray2 = CONST_FOREIGN_MONEY_UNIT_KEY;

      var selectedMoneyUnit = function(e) {
        if (currentPage == "international_payments/foreign_exchange/foreign_exchange_mng") {
          document.removeEventListener("evtSelectionDialog", selectedMoneyUnit, false);
          var moneyUnit;
          if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
            moneyUnit = document.getElementById('id.moneyType');
          }else{
            moneyUnit = document.getElementById('id.moneyTypemb');
          }
          if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
            moneyUnit.value = e.selectedValue1;
          } else {
            moneyUnit.innerHTML = e.selectedValue1;
          }

          if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
            gPay.searchData.moneyUnit = e.selectedValue2;
          }
        }
      }

      var selectedMoneyUnitClose = function() {
        if (currentPage == "international_payments/foreign_exchange/foreign_exchange_mng") {
          document.removeEventListener("evtSelectionDialogClose", selectedMoneyUnitClose, false);
          document.removeEventListener("evtSelectionDialog", selectedMoneyUnit, false);
        }
      }

      document.addEventListener("evtSelectionDialog", selectedMoneyUnit, false);
      document.addEventListener("evtSelectionDialogClose", selectedMoneyUnitClose, false);
      showDialogList(CONST_STR.get('FOREGIN_CHOOSE_MONEY_UNIT'), tmpArray1, tmpArray2, false);
    }
	
	$scope.changeTab = function () {
        navCachedPages['international_payments/foreign_exchange/foreign_exchange'] = null;
        navController.pushToView('international_payments/foreign_exchange/foreign_exchange', true, 'html');
    }
	
    $scope.searchExchangeTransfer = function() {
      var msgValidate = new Array();
      if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        if (!debtCheckFormatDate(document.getElementById("id.begindate").value)) {
            msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
        }

        if (!debtCheckFormatDate(document.getElementById("id.mngenddate").value)) {
            msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
        }

        var fromDate = document.getElementById("id.begindate").value;
        var endDate = document.getElementById("id.mngenddate").value;
        var diffDays = getDiffDaysBetween(fromDate, endDate, "dd/MM/yyyy");
        if (diffDays < 0) {
            msgValidate.push(CONST_STR.get("ACC_HIS_INVALID_QUERY_DATE"));
        }
    }else{
        if (!debtCheckFormatDate(document.getElementById("id.begindatemb").value)) {
            msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
        }

        if (!debtCheckFormatDate(document.getElementById("id.mngenddate").value)) {
            msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
        }

        var fromDate = document.getElementById("id.begindatemb").value;
        var endDate = document.getElementById("id.mngenddatemb").value;
        var diffDays = getDiffDaysBetween(fromDate, endDate, "dd/MM/yyyy");
        if (diffDays < 0) {
            msgValidate.push(CONST_STR.get("ACC_HIS_INVALID_QUERY_DATE"));
        }
    }
    if (msgValidate.length > 0) {
        showAlertText(msgValidate[0]);
    } else {
		    var jsonData = new Object();
            jsonData.idtxn = "B13";
            jsonData.sequenceId = gPay.searchData.sequenceId;
            jsonData.transType = gPay.searchData.transType;
            jsonData.status = gPay.searchData.status;
            jsonData.moneyUnit = gPay.searchData.moneyUnit;
            jsonData.idMaker = gPay.searchData.idMaker;
            jsonData.startDate = gPay.searchData.startDate;
            jsonData.endDate = gPay.searchData.endDate;
			
            var	args = new Array();
            args.push("1");
            args.push(jsonData);
			
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_INT_PAYMENT_EXCHANGE_MANAGER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if(response.respCode == '0') {
					var result = document.getElementById('id.searchResult');
						if (response.respJsonObj == null){
							result.style.display = 'none';
							$scope.listPending = [];
						}else {
							$scope.listPending = response.respJsonObj;
							if (response.respJsonObj.length > 0) {
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
	}

		$scope.status=function(statusType) {
            var guaranteeTypeOfLanguage=[];
            var keyTypes =CONST_FOREIGN_STATUS_KEY;
            if (gUserInfo.lang === 'VN') {
                guaranteeTypeOfLanguage = CONST_FOREIGN_STATUS_VN;
            } else {
                guaranteeTypeOfLanguage = CONST_FOREIGN_STATUS_EN;
            }
            var index =this.getIndexArr(statusType,keyTypes);
            return guaranteeTypeOfLanguage[index];
        }
		
        $scope.getIndexArr=function(guaranteeType,arr){

            for(var i =0;i<arr.length;i++)
            {
                if(arr[i]==guaranteeType)
                {
                    return i;
                }
            }
            return 0;
        }
		
        $scope.showTransferDetail = function (transId,userref) {

            var jsonData = {};
            jsonData.sequenceId = '2';
            jsonData.IDTXN = 'B01';
            jsonData.idFcatref = transId;
            jsonData.idUserReference = userref;

            var args = new Array();
            args.push(null);
            args.push(jsonData);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_INT_PAYMENT_EXCHANGE_MANAGER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0'){
					var infoCommon = {};
					gTrans.common = infoCommon;
					infoCommon.transCode = response.respJsonObj[0].MA_GIAO_DICH;
					infoCommon.dateMake = response.respJsonObj[0].NGAY_LAP;
					infoCommon.datePend = response.respJsonObj[0].NGAY_DUYET;
					infoCommon.status = CONST_STR.get('TRANS_STATUS_' + response.respJsonObj[0].TRANG_THAI);
					infoCommon.CODSTATUS=response.respJsonObj[0].TRANG_THAI;
					infoCommon.transType = CONST_STR.get("TRANS_TYPE_" + response.respJsonObj[0].LOAI_GIAO_DICH);
					infoCommon.accGet = response.respJsonObj[0].TK_CHUYEN;
					infoCommon.accSend = response.respJsonObj[0].TK_NHAN;
					infoCommon.amountEX =formatCurrentWithSysbol(response.respJsonObj[0].SO_LUONG_DOI,"") + ' ' + response.respJsonObj[0].DON_VI_TIEN;
					infoCommon.rate = formatNumberToCurrency(response.respJsonObj[0].RATE);
					infoCommon.amountRece = formatNumberToCurrency(response.respJsonObj[0].SO_TIEN_NHAN_DUOC) + ' VND';
					infoCommon.TPBank="TPBank";
					infoCommon.AmountBalance = formatCurrentWithSysbol(gPay.listAccoutForeign[0].NUMAVAILABLE - response.respJsonObj[0].SO_LUONG_DOI,"") + ' ' + gPay.listAccoutForeign[0].CODACCTCURR;
					infoCommon.serviceCharge = "0 VND";
					infoCommon.content = response.respJsonObj[0].NOI_DUNG;
					infoCommon.approved = response.respJsonObj[0].NGUOI_DUYET;
					infoCommon.notification = CONST_STR.get("COM_NOTIFY_" + response.respJsonObj[0].SEND_METHOD);

					navCachedPages["international_payments/foreign_exchange/foreign_exchange_detail"] = null;
					navController.pushToView("international_payments/foreign_exchange/foreign_exchange_detail", true, 'html');
                }else {
                    showAlertText(response.respContent)
                }
            }, function (response) {

            });
        }
	});
  angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}

// check format tai cac truong nhap thoi gian
function debtCheckFormatDate(dataCheck) {
    var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (dataCheck == '' || dataCheck == 'dd/mm/yyyy') {
        return true;
    } else {
        if (!dataCheck.match(re)) {
            return false;
        } else {
            return true;
        }
    }
}

function formatCurrentWithSysbol(n, currency) {
  
  var k;
    k = currency + "" + Math.abs(n).toFixed(2).replace(/./g, function(c, i, a) {
        return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });
  if(k.substr(k.length - 2, k.length)==='00')
  {
    k = k.substr(0,k.length - 3);
  }
  return k;
}
function sendRequestExportExcel() {
    var request = {
        sequenceId: 20,
        idtxn: "T02",
        transTypeId: gPay.searchData.transType,
        transStatus: gPay.searchData.status,
        moneytype: gPay.searchData.moneyUnit,
        maker: gPay.searchData.idMaker,
        dateBegin: gPay.searchData.startDate,
        dateEnd: gPay.searchData.endDate
    };
    if (request.maker == CONST_STR.get("COM_ALL")) {
        request.maker = "ALL";
    }

    var args = ["", request];

    var gprsCmd = new GprsCmdObj(CONSTANTS.get('COM_EXPORT_EXCEL_REPORT'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
    var data = getDataFromGprsCmd(gprsCmd);

    corpExportExcel(data);
}