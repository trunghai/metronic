/**
 * Created by HaiDT1 on 6/28/2016.
 */
//gCorp.isBack = false;

function viewBackFromOther() {
    // gCorp.isBack = true;
}
function viewDidLoadSuccess() {
     
	var aMountPay;
	var searchInfo;
	initData();
    
}



function initData() {
    angular.module('EbankApp').controller('auth-payment-bill', function ($rootScope, $scope, requestMBServiceCorp) {
        navCachedPages["authorize/auth-transfer"] = null;
        var _this = this;
        navController.getBottomBar().hide();
        clearCache= true;

        $scope.listSelectedTrans = [];
        gTrans.idtxn = 'B63';
		
        // if (gCorp.isBack){
            searchInfo = {
                transType : "B12",
                maker : "",
                status : "",
                fromDate : "",
                endDate : ""
            };
            
            var jsonData = {};
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;

            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_AUTHORIZE_PAYMENT_BILL"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true, handleSuccessCallBackGet);
        

        function handleSuccessCallBackGet (response) {
            if (response.respCode === '0'){

                gTrans.makers = response.respJsonObj.makers;
                if (response.respJsonObj.list_pending == null){
                    $scope.listPending = [];

                }else {
                    $scope.listPending = response.respJsonObj.list_pending;

                }
				if (response.respJsonObj.limit == null){
                    $scope.limit = [];
                }else {
                    $scope.limit = response.respJsonObj.limit;
                }
            var result = document.getElementById('id.searchResult');
                if ($scope.listPending.length > 0) {
                    result.style.display = '';
                }else{
                     result.style.display = 'none';
                    document.getElementById('id.message').style.display = 'block';
                    document.getElementById('id.message.value').innerHTML = CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST");
                }

            }else {
                showAlertText(response.respContent);
            }

        }


        $scope.goToViewScreen = function (e, amount) {
            gTrans.detail = {};
            gTrans.detail.transId = e;
			aMountPay = amount;
            var jsonData = {};
            jsonData.transIds = gTrans.detail.transId;
            jsonData.sequence_id = '5';
            jsonData.idtxn = 'B63';

            var args = new Array();
            args.push(null);
            args.push(jsonData);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_AUTHORIZE_PAYMENT_BILL"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, handleSuccessCallBack, handleErrorCallBack);
        }

        function handleSuccessCallBack(response) {

            if (response.respCode === '0'){

                var transInfo = [];
                var infoCommon = {};
                var common = response.respJsonObj.info_trans[0];
                infoCommon.transId = common.IDFCATREF;
                infoCommon.createTime = common.CREATE_TIME;
                infoCommon.sourceAcc = common.IDSRCACCT;
                infoCommon.balance = formatNumberToCurrency(common.SO_DU_KHA_DUNG) + ' VND';
                infoCommon.idUserRef = common.IDUSERREFERENCE;
                if (gUserInfo.lang === 'VN'){
                    infoCommon.transType = common.SRV_DESC;
                    infoCommon.transProvider = common.PR_DESC;
                }else {
                    infoCommon.transType = common.SRV_DESC_EN;
                    infoCommon.transProvider = common.PR_DESC_EN;
                }

                var infoTrans = [];
                for (var i in response.respJsonObj.lst_valquery){
                    info = response.respJsonObj.lst_valquery[i];

                    if (gUserInfo.lang === 'VN'){
						if (info.MSG_FIELD_TYPE === 'NUMBER')
						{
                            infoTrans.push({'key' : info.MSG_FIELD_DESC, 'value' : formatNumberToCurrency(Number(info.FIELD_VALUE)) + ' VND'});
						}
						else
						{
							infoTrans.push({'key' : info.MSG_FIELD_DESC, 'value' : info.FIELD_VALUE});
					    }
                    }else {
						if (info.MSG_FIELD_TYPE === 'NUMBER')
						{
                            infoTrans.push({'key' : info.MSG_FIELD_DESC_EN, 'value' : formatNumberToCurrency(Number(info.FIELD_VALUE)) + ' VND'});
						}
						else
						{
							infoTrans.push({'key' : info.MSG_FIELD_DESC_EN, 'value' : info.FIELD_VALUE});
					    }
                        
                    }
                }

                transInfo.push(infoCommon);
                transInfo.push(infoTrans);
                gTrans.detail.transInfo = transInfo;
				gTrans.detail.amount = aMountPay;
				gTrans.limit = $scope.limit;
                navCachedPages["authorize/payment_service/bill/auth-payment-bill-detail"] = null;
                navController.pushToView("authorize/payment_service/bill/auth-payment-bill-detail", true);
            }else {
                showAlertText(response.respContent);
            }
        }

        function handleErrorCallBack() {

        }
        
        $scope.authorizeTransaction = function () {
            var reasontpb = document.getElementById('trans.reason').value;
            if(reasontpb){
                showAlertText(CONST_STR.get("COM_CHECK_REJECT_BUTTON"));
                return false;
            }
            gTrans = {};
			var reason = document.getElementById("trans.reason").value;

            gTrans.listSelectedTrans = [];
            /*var checkBoxAll = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
            for (var i = 0; i < checkBoxAll.length; i++) {
                if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                    for (var j in $scope.listPending){
                        if (checkBoxAll[i].name == $scope.listPending[j].MA_GD){
                            gTrans.listSelectedTrans.push($scope.listPending[j]);
                        }
                    }
                }
            }*/
            
            var checkboxes = document.getElementsByClassName("trans.checkbox");
            var i;
            for (i = 0; i < checkboxes.length; i++){
                if (checkboxes[i].checked == true){
                    if (i < checkboxes.length/2){
                        gTrans.listSelectedTrans.push($scope.listPending[i]);
                    }
                    else
                    {
                        gTrans.listSelectedTrans.push($scope.listPending[i - checkboxes.length/2]);
                    }
                }
            }

            if (gTrans.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }



            gTrans.authen = true;
			gTrans.listPending = $scope.listPending;
			gTrans.reason = reason;
			gTrans.limit = $scope.limit;
            navCachedPages["authorize/payment_service/bill/auth-payment-bill-view"] = null;
            navController.pushToView("authorize/payment_service/bill/auth-payment-bill-view", true);
            

        }
        
        $scope.rejectTransaction = function () {
            var reason = document.getElementById("trans.reason").value;
            if (!reason) {
                showAlertText(CONST_STR.get("COM_CHECK_EMPTY_REJECT_REASON"));
                return;
            }

            var checkboxes = document.getElementsByClassName("trans.checkbox");
            var i;
            for (i = 0; i < checkboxes.length; i++){
                if (checkboxes[i].checked == true){
                    if (i < checkboxes.length/2){
                        $scope.listSelectedTrans.push($scope.listPending[i]);
                    }
                    else
                    {
                        $scope.listSelectedTrans.push($scope.listPending[i - checkboxes.length/2]);
                    }
                }
            }

            if ($scope.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }

            gTrans = {};
            gTrans.authen = false;
            gTrans.reason = reason;
			gTrans.limit = $scope.limit;
			gTrans.listPending = $scope.listPending;
            gTrans.listSelectedTrans = $scope.listSelectedTrans;
            navCachedPages["authorize/payment_service/bill/auth-payment-bill-view"] = null;
            navController.pushToView("authorize/payment_service/bill/auth-payment-bill-view", true);
            
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

         //show loai giao dich
        $scope.showTypeTrans =function () {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_PAYMENT_BILL_TYPE_EN : CONST_PAYMENT_BILL_TYPE_VN;
            var tmpArray2 = CONST_PAYMENT_BILL_TYPE_KEY;
            document.addEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showTransTypeSelectionOpen(e) {
            if (currentPage == "authorize/payment_service/bill/auth-payment-bill") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    showTransTypeSelectionClose();
                }
            }
        }

        function showTransTypeSelectionClose() {
            if (currentPage == "authorize/payment_service/bill/auth-payment-bill") {
                document.removeEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            }
        }
//        end show loai gd
        //--2. Xử lý chọn trạng thái
        $scope.showTransStatusSelection = function () {
            var cbxValues = (gUserInfo.lang == 'EN')? INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_EN: INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_VN;
            addEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
            showDialogList(CONST_STR.get('COM_CHOOSE_STATUS'), cbxValues, INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_KEY, false);
        }

        function handleSelectdTransStatus(e) {
            removeEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
            searchInfo.status = e.selectedValue2;
            document.getElementById("id.status").value = e.selectedValue1;
        }

        function handleCloseTransStatusCbx(e) {
            removeEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
        }
        //--END 2

        //--3. Xử lý chọn người lập
        $scope.showMakers = function (){
            var cbxText = [];
            var cbxValues = [];
            cbxText.push(CONST_STR.get("COM_ALL"));
            cbxValues.push("");
            for (var i in gTrans.makers) {
                var userId = gTrans.makers[i].IDUSER;
                cbxText.push(userId);
                cbxValues.push(userId);
            }
            addEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
            showDialogList(CONST_STR.get('COM_CHOOSE_MAKER'), cbxText, cbxValues, false);
        }

        function handleSelectMaker(e){
            removeEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
            searchInfo.maker = e.selectedValue2;
            document.getElementById('id.maker').value = e.selectedValue1;
        }
        function handleCloseMakerCbx(){
            removeEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
        }
//--END 3

        //--4. Gửi thông tin tìm kiếm
        $scope.sendJSONRequestSearch = function (){


            searchInfo.fromDate = document.getElementById("id.begindate").value;
            searchInfo.endDate = document.getElementById("id.enddate").value;

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
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_AUTHORIZE_PAYMENT_BILL'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode === '0'){
                    /*gTrans.limit = {
                        limitTime: response.respJsonObj.limit.limitTime,
                        currency: response.respJsonObj.limit.currency,
                        limitDay: response.respJsonObj.limit.limitDay,
                        totalDay: response.respJsonObj.limit.totalDay,
                    }*/
                    var result = document.getElementById('id.searchResult');
                    if (response.respJsonObj == null){
                        result.style.display = 'none';
                        $scope.listPending = [];
                    }else {
                        $scope.listPending = response.respJsonObj;
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
                    _this.message = response.respContent;
                }
            }, function (response) {
                
            });
        }
        
    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
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