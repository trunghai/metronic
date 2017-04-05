/**
 * Created by HaiNM *
 **/

gCorp.isBack = false;

var searchInfo;
gTrans.checklistProfile="";

function viewDidLoadSuccess() {
    initData();

}

function viewBackFromOther() {
    gCorp.isBack = true;
}

function initData() {
    angular.module('EbankApp').controller('setup-search', function ($rootScope, $scope, requestMBServiceCorp) {
        navCachedPages["authorize/auth-transfer"] = null;
        $scope.listSelectedTrans = [];
			
        gTrans.idtxn = 'T66';
        if (!gCorp.isBack){
            searchInfo = {			
				pageId: 1,
				pageSize: 10,
				transType: CONST_SETUP_AUTHORIZE_LIST_TRANS_TYPE_KEY[0],				
                maker : "",
                status : "",
                fromDate : "",
                endDate : ""
			};

            var jsonData = {};
            jsonData.sequenceId = "1";
            jsonData.idtxn = gTrans.idtxn;

            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_AUTHORIZE_BATCH_TRANSFER_SALARY"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data,handleSuccessCallBackGet);
        }
        else {
                document.getElementById("id.status").value = status(searchInfo.status);
                if( searchInfo.maker =="")
                {
                    document.getElementById("id.maker").value = "Tất cả";
                }
                else
                {
                    document.getElementById("id.maker").value = searchInfo.maker;
                }
                document.getElementById("id.begindate").value = searchInfo.fromDate;
                document.getElementById("id.enddate").value = searchInfo.endDate;
        }
		
        function handleSuccessCallBackGet (response) {
            if (response.respCode === '0'){
                var result = document.getElementById('id.searchResult');

                gTrans.makers = response.respJsonObj.makers;
                if (response.respJsonObj.list_pending == null){
                    $scope.currentListTrans = [];
                    result.style.display = 'none';
                }else {
                    $scope.currentListTrans = response.respJsonObj;
                    result.style.display = 'block';
                }
                setTimeout(function () {
                    if (mainContentScroll) {
                        mainContentScroll.refresh();
                    }
                }, 100);

            }else {
                showAlertText(response.respContent);
            }

        }
		
		$scope.tranTypeTxt= function (e) {
			return CONST_STR.get('COM_IDTXN_' + e);
		}
		
        $scope.showDetailTransaction = function (e) {
            gTrans.detail = {};
            gTrans.detail.transId = e;

            var jsonData = {};

			jsonData.sequence_id = 8;
			jsonData.idtxn = "S03";
			jsonData.transId= gTrans.detail.transId;

            var args = new Array();
            args.push("");
            args.push(jsonData);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_SETUP_QUERY_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, handleSuccessCallBack, handleErrorCallBack);
        }

        function handleSuccessCallBack(response) {

            if (response.respCode === '0'){
                var infoCommon = response.respJsonObj.results[0];
                var currentUserLimit = response.respJsonObj.limit;
				
					gTrans.checklistProfile=[
						{
							TENDV : CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_" + currentUserLimit[0].MA_DV),
							HAN_MUC_LAN_MAX : currentUserLimit[0].HAN_MUC_LAN_MAX,
							HAN_MUC_NGAY_MAX : currentUserLimit[0].HAN_MUC_NGAY_MAX,
							HAN_MUC_LAN : infoCommon.NEW_GACCO_ONE,
							HAN_MUC_NGAY : infoCommon.NEW_GACCO_DAY,	
						},
						{
							TENDV :	CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_" + currentUserLimit[1].MA_DV),
							HAN_MUC_LAN_MAX : currentUserLimit[1].HAN_MUC_LAN_MAX,
							HAN_MUC_NGAY_MAX : currentUserLimit[1].HAN_MUC_NGAY_MAX,
							HAN_MUC_LAN : infoCommon.NEW_GPAYI_ONE,
							HAN_MUC_NGAY : infoCommon.NEW_GPAYI_DAY,
						},
						{		
							TENDV : CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_" + currentUserLimit[2].MA_DV),
							HAN_MUC_LAN_MAX : currentUserLimit[2].HAN_MUC_LAN_MAX,
							HAN_MUC_NGAY_MAX : currentUserLimit[2].HAN_MUC_NGAY_MAX,
							HAN_MUC_LAN : infoCommon.NEW_GPAYS_ONE,
							HAN_MUC_NGAY : infoCommon.NEW_GPAYS_DAY,
						},
						{
							TENDV : CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_" + currentUserLimit[3].MA_DV),
							HAN_MUC_LAN_MAX : currentUserLimit[3].HAN_MUC_LAN_MAX,
							HAN_MUC_NGAY_MAX : currentUserLimit[3].HAN_MUC_NGAY_MAX,
							HAN_MUC_LAN : infoCommon.NEW_GTRAN_ONE,
							HAN_MUC_NGAY : infoCommon.NEW_GTRAN_DAY,
						},
					];
					
                // infoCommon.transId = common.IDFCATREF; // mã giao dịch
                // infoCommon.createTime = common.CREATE_TIME; //thời gian tạo
                // infoCommon.sourceAcc = common.IDMAKER; //người nhập
                // infoCommon.idUserRef = common.IDUSERREFERENCE;
				// infoCommon.status = CONST_STR.get("TRANS_STATUS_" + common.CODSTATUS) //trạng thái
				
                gTrans.common = infoCommon;

                navCachedPages["authorize/setup/setup-search-detail"] = null;
                navController.pushToView("authorize/setup/setup-search-detail", true);
            }else {
                showAlertText(response.respContent);
            }
        }

        function handleErrorCallBack() {

        }

        $scope.authorizeTransaction = function () {
            gTrans = {};
			var reason = document.getElementById("trans.reason").value;
            if(reason){
                showAlertText(CONST_STR.get("COM_CHECK_REJECT_BUTTON"));
                return;
            }

            gTrans.listSelectedTrans = [];
            var checkBoxAll = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
            for (var i = 0; i < checkBoxAll.length; i++) {
                if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                    for (var j in $scope.currentListTrans){
                        if (checkBoxAll[i].name == $scope.currentListTrans[j].MA_GD){
                            gTrans.listSelectedTrans.push($scope.currentListTrans[j]);
                        }
                    }
                }
            }

            if (gTrans.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }

            gTrans.authen = true;
			gTrans.currentListTrans = $scope.currentListTrans;
			gTrans.reason = reason;
            navCachedPages["authorize/setup/auth-search-view"] = null;
            navController.pushToView("authorize/setup/auth-search-view", true);

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
                    $scope.listSelectedTrans.push($scope.currentListTrans[i]);
                }
            }

            if ($scope.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }

            gTrans = {};
            gTrans.authen = false;
            gTrans.reason = reason;
			gTrans.currentListTrans = $scope.currentListTrans;
            gTrans.listSelectedTrans = $scope.listSelectedTrans;
            navCachedPages["authorize/setup/auth-search-view"] = null;
            navController.pushToView("authorize/setup/auth-search-view", true);

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

		// Khi chon loai giao dich
		$scope.chooseTransType = function () {		
            var cbxValues = (gUserInfo.lang == 'EN')? CONST_SETUP_AUTHORIZE_LIST_TRANS_TYPE_EN: CONST_SETUP_AUTHORIZE_LIST_TRANS_TYPE_VN;
            addEventListenerToCombobox(handleSelectdTransType, handleCloseTransTypeCbx);
            showDialogList(CONST_STR.get('COM_CHOOSEN_TYPE_TRANS'), cbxValues, CONST_SETUP_AUTHORIZE_LIST_TRANS_TYPE_KEY, false);
		}
		
        function handleSelectdTransType(e) {
            removeEventListenerToCombobox(handleSelectdTransType, handleCloseTransTypeCbx);
            searchInfo.status = e.selectedValue2;
            document.getElementById("id.trans-type").value = e.selectedValue1;
        }

        function handleCloseTransTypeCbx(e) {
            removeEventListenerToCombobox(handleSelectdTransType, handleCloseTransTypeCbx);
        }
		
        //--2. Xử lý chọn trạng thái
        $scope.chooseStatus = function () {
            var cbxValues = (gUserInfo.lang == 'EN')? CONST_APPROVE_TRANS_STATUS_EN: CONST_APPROVE_TRANS_STATUS_VN;
            addEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
            showDialogList(CONST_STR.get('COM_CHOOSE_STATUS'), cbxValues, CONST_APPROVE_TRANS_STATUS, false);
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
        $scope.chooseMaker = function (){
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

            if(!this.checkDateValue())
                return;

            searchInfo.fromDate = document.getElementById("id.begindate").value;
            searchInfo.endDate = document.getElementById("id.enddate").value;

            var jsonData = new Object();
            jsonData.sequenceId = 1;
            jsonData.idtxn = "S65";

            jsonData.transType = searchInfo.transType;
            jsonData.makerId = searchInfo.maker;
            jsonData.transStatus = searchInfo.status;
            jsonData.fromDate = searchInfo.fromDate;
            jsonData.endDate = searchInfo.endDate;
			jsonData.pageId = searchInfo.pageId;
			jsonData.pageSize = searchInfo.pageSize;
			
            var	args = new Array();
            args.push("");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_AUTHORIZE_SETUP"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {

                if (response.respCode === '0'){
                    var result = document.getElementById('id.searchResult');
                    if (response.respJsonObj == null){
                        result.style.display = 'none';
                        $scope.currentListTrans = [];
                    }else {
                        gTrans.listObj = response.respJsonObj;
                        $scope.currentListTrans = response.respJsonObj;
                        if (response.respJsonObj.length > 0) {
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
					showAlertText(response.respContent);
                }
            }, function () {
				showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
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

        $scope.guaranteeType = function(guaranteeType) {
            var guaranteeTypeOfLanguage=[];
            var keyTypes =CONST_GUARANTEE_TRANS_TYPE_KEY;
            if (gUserInfo.lang === 'VN') {
                guaranteeTypeOfLanguage = CONST_SETUP_CRE_REQUEST_CREATE_VN;
            } else {
                guaranteeTypeOfLanguage = CONST_SETUP_CRE_REQUEST_CREATE_EN;
            }
            var index =this.getIndexArr(guaranteeType,keyTypes);
            return guaranteeTypeOfLanguage[index];
        }

        $scope.status=function(statusType) {
            var guaranteeTypeOfLanguage=[];
            var keyTypes =CONST_GUARANTEE_QUERY_TYPE_STATUS_VALUE;
            if (gUserInfo.lang === 'VN') {
                guaranteeTypeOfLanguage = CONST_GUARANTEE_QUERY_TYPE_STATUS_VN;
            } else {
                guaranteeTypeOfLanguage = CONST_GUARANTEE_QUERY_TYPE_STATUS_EN;
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

function status(statusType) {
    var guaranteeTypeOfLanguage=[];
    var keyTypes =CONST_GUARANTEE_QUERY_TYPE_STATUS_VALUE;
    if (gUserInfo.lang === 'VN') {
        guaranteeTypeOfLanguage = CONST_GUARANTEE_QUERY_TYPE_STATUS_VN;
    } else {
        guaranteeTypeOfLanguage = CONST_GUARANTEE_QUERY_TYPE_STATUS_EN;
    }
    var index =this.getIndexArr(statusType,keyTypes);
    return guaranteeTypeOfLanguage[index];
}

function getIndexArr(guaranteeType,arr){
    for(var i =0;i<arr.length;i++)
        {
            if(arr[i]==guaranteeType)
            {
                return i;
            }
        }
     return 0;
}
function exportExcelDebtHistory() {
  var transIds = "";
  for (var i in gTrans.listObj) {
    transIds += gTrans.listObj[i].MA_GD + ",";
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
