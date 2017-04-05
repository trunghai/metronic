/**
 * Created by HaiNM *
 **/
 
gSetUp.idtxn = "S03";

var rowsPerPage = 10;

var searchInfo;

var allResults;
var isBack = false;
function viewBackFromOther() {
	//Flag check
	isBack = true;
}

function viewDidLoadSuccess() {

	if (!isBack) {
		searchInfo = {
			transType : "",
			transTypeDtl : "",
			status : "",
			maker : "",
			transId : "",
			fromDate : "",
			endDate : "",
			pageSize : 10,
			pageIdx : 1
		}
		// if (gUserInfo.lang == 'EN') {
			// document.getElementById('id.trans-type').value = CONST_SETUP_QUERY_TRANS_TYPE_EN[0];
		// }else{
			// document.getElementById('id.trans-type').value = CONST_SETUP_QUERY_TRANS_TYPE_VN[0];
		// }
		document.getElementById('id.trans-type-dtl').value = CONST_STR.get('COM_ALL');
		document.getElementById('id.status').value = CONST_STR.get('COM_ALL');
		document.getElementById('id.maker').value = CONST_STR.get('COM_ALL');
		document.getElementById('id.trans-id').value = "";
		document.getElementById('id.begindate').value = "";
		document.getElementById('id.enddate').value = "";
		// document.getElementById('id.searchResult').innerHTML = "";
	}

	// isBack = false;		
	initData();
}

/*** INIT DATA ***/
function initData() {
    angular.module('EbankApp').controller('steup-query-transfer', function ($scope , requestMBServiceCorp) {
		
		$scope.showTransTypeSelection = function() {
			var cbxValues = (gUserInfo.lang == 'EN')? CONST_SETUP_QUERY_TRANS_TYPE_EN: CONST_SETUP_QUERY_TRANS_TYPE_VN;
			addEventListenerToCombobox(handleSelectTransType, handleCloseTransTypeCbx);
			showDialogList(CONST_STR.get('TRANS_PERIODIC_DIALOG_TITLE_ACCTYPE'), cbxValues, CONST_SETUP_QUERY_TRANS_TYPE_KEY, false);
		}
		// chi tiết giao dịch	
		$scope.showTransTypeDetailSelection = function() {
			if (searchInfo.transType == "S01") {
				var cbxText = (gUserInfo.lang == 'EN')? CONST_SETUP_QUERY_TRANS_TYPE_DTL_S01_EN: CONST_SETUP_QUERY_TRANS_TYPE_DTL_S01_VN;
				var cbxValues = CONST_SETUP_QUERY_TRANS_TYPE_DTL_S01_KEY;
			} else if (searchInfo.transType == "S02") {
				var cbxText = (gUserInfo.lang == 'EN')? CONST_SETUP_QUERY_TRANS_TYPE_DTL_S02_EN: CONST_SETUP_QUERY_TRANS_TYPE_DTL_S02_VN;
				var cbxValues = CONST_SETUP_QUERY_TRANS_TYPE_DTL_S02_KEY;
			} else {
				var cbxText = (gUserInfo.lang == 'EN')? CONST_SETUP_QUERY_TRANS_TYPE_DTL_ALL_EN: CONST_SETUP_QUERY_TRANS_TYPE_DTL_ALL_VN;
				var cbxValues = CONST_SETUP_QUERY_TRANS_TYPE_DTL_ALL_KEY;
			}
			addEventListenerToCombobox(handleSelectTransTypeDetail, handleCloseTransTypeDetailCbx);
			showDialogList(CONST_STR.get('CONST_SETUP_QUERY_TIT_TRANS_TYPE_DTL'), cbxText, cbxValues, false);
		}
		
		function handleSelectTransTypeDetail(e) {
			removeEventListenerToCombobox(handleSelectTransTypeDetail, handleCloseTransTypeDetailCbx);
			searchInfo.transTypeDtl = e.selectedValue2;
			if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
				document.getElementById('id.trans-type-dtl').value = e.selectedValue1;
			}else{
				document.getElementById('id.trans-type-dtlmb').value = e.selectedValue1;
			}
		}

		function handleCloseTransTypeDetailCbx() {
			removeEventListenerToCombobox(handleSelectTransTypeDetail, handleCloseTransTypeDetailCbx);
		}
		
		// trạng thái
		$scope.showTransStatusSelection = function() {
			var cbxValues = (gUserInfo.lang == 'EN')? CONST_SETUP_QUERY_LIST_STATUS_EN: CONST_SETUP_QUERY_LIST_STATUS_VN;
			addEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
			showDialogList(CONST_STR.get('COM_CHOOSE_STATUS'), cbxValues, CONST_SETUP_QUERY_LIST_STATUS_KEY, false);
		}
		function handleSelectdTransStatus(e) {
			removeEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
			searchInfo.status = e.selectedValue2;
			if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
				document.getElementById("id.status").value = e.selectedValue1;
			}else{
				document.getElementById("id.statusmb").value = e.selectedValue1;
			}
		}

		function handleCloseTransStatusCbx(e) {
			removeEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
		}
		
		// người lập
		$scope.showMakers = function() {	
			var jsonData = new Object();
			jsonData.sequence_id = "1";
			jsonData.idtxn = gSetUp.idtxn;
			var	args = new Array();
			args.push("2");
			args.push(jsonData);
			var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_SETUP_QUERY_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
			var data = getDataFromGprsCmd(gprsCmd);
			requestMBServiceCorp.post(data, true, getMakersSuccess, function(){});
		}

		function getMakersSuccess(e) {
			var resp = e;
			if (resp.respCode == "0" || resp.respJsonObj.length > 0) {
				var cbxText = [];
				var cbxValues = [];
				cbxText.push(CONST_STR.get("COM_ALL"));
				cbxValues.push("");
				for (var i in resp.respJsonObj) {
					var userId = resp.respJsonObj[i].IDUSER;
					cbxText.push(userId);
					cbxValues.push(userId);
				}
				addEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
				showDialogList(CONST_STR.get('COM_DIALOG_TITLE_ACCNO_CHOISE'), cbxText, cbxValues, false);
			} else 
				showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_LIST_MAKER'));
		}
		
		function handleSelectMaker(e){
			removeEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
			searchInfo.maker = e.selectedValue2;
			if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
				document.getElementById('id.maker').value = e.selectedValue1;
			}else{
				document.getElementById('id.makermb').value = e.selectedValue1;
			}
		}
		function handleCloseMakerCbx(){
			removeEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
		}
		
        $scope.sendJSONRequest = function () {
            var data = {};
			var jsonData = new Object();
			jsonData.sequence_id = "2";
			jsonData.idtxn = gSetUp.idtxn;

			jsonData.transType = (searchInfo.transTypeDtl == "") ? searchInfo.transType : searchInfo.transTypeDtl;
			jsonData.status = searchInfo.status;
			jsonData.maker = searchInfo.maker;
			jsonData.transId = searchInfo.transId;
			jsonData.fromDate = searchInfo.fromDate;
			jsonData.endDate = searchInfo.endDate;
			jsonData.pageSize = searchInfo.pageSize;
			jsonData.pageIdx = searchInfo.pageIdx;

			var isValid = validate(jsonData.fromDate, jsonData.endDate);
			if (!isValid) {
				return;
			}
				
			var	args = new Array();
			args.push("2");
			args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_SETUP_QUERY_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if(response.respCode == '0') {
					var result = document.getElementById('id.searchResult');
						if (response.respJsonObj == null){
							result.style.display = 'none';
							// document.getElementById("pageIndicatorNums").innerHTML = "";
							$scope.listPending = [];
						}else {
							$scope.listPending = response.respJsonObj;
							gTrans.listPending = response.respJsonObj;
							if (response.respJsonObj.length > 0) {
								gTrans.totalPage = Math.ceil((gTrans.listPending[0].TOTAL_ROW)/searchInfo.pageSize);
								$scope.arrPage = [];
								for (var i = 1; i <= gTrans.totalPage; i++) {
									$scope.arrPage.push(i);
								}
								setTimeout(function(){
									displayPageCurent(searchInfo.pageIdx);
								},100)
								// genPagging(getTotalPages(response.respJsonObj[0].TOTAL_ROW), searchInfo.pageIdx);
								result.style.display = 'block';
								document.getElementById('id.message').style.display = 'none';
								if (gTrans.totalPage <= 1) {
									document.getElementById('pagination').style.display = 'none';
								}
							}else{
								// document.getElementById("pageIndicatorNums").innerHTML = "";
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
		$scope.status=function(statusType) {
            var guaranteeTypeOfLanguage=[];
            var keyTypes =CONST_ACCOUNT_QUERY_TYPE_STATUS_VALUE;
            if (gUserInfo.lang === 'VN') {
                guaranteeTypeOfLanguage = CONST_ACCOUNT_QUERY_TYPE_STATUS_VN;
            } else {
                guaranteeTypeOfLanguage = CONST_ACCOUNT_QUERY_TYPE_STATUS_EN;
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
		$scope.TypeTrans=function(e) {
			return TypeTransOfLanguage = CONST_STR.get("COM_IDTXN_" + e);
		}
		
		$scope.showDetailTransaction=function(transId){
			gTrans.selectedTrans =[];
			for (var i in gTrans.listPending) {
				if (transId == gTrans.listPending[i].MA_GD) {
                   gTrans.selectedTrans.push(gTrans.listPending[i]);
                   break;
				}
			}
			
			if (gTrans.selectedTrans[0].LOAI_GD == "S11") {
				getDetailChangeInfo(transId);
			}
			if (gTrans.selectedTrans[0].LOAI_GD == "S12") {
				getDetailChangePassword(transId);
			}
			if (gTrans.selectedTrans[0].LOAI_GD == "S13") {
				getDetailChangeSendMethod(transId);
			}
			if (gTrans.selectedTrans[0].LOAI_GD == "S14") {
				getDetailChangeAuthMethod(transId);
			}
			if (gTrans.selectedTrans[0].LOAI_GD == "S15") {
				getDetailChangeTransLimit(transId);
			}
		}
        $scope.changePage = function (idx) {
            document.getElementById('page_'+searchInfo.pageIdx).className = '';
			if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
				searchInfo.fromDate = document.getElementById("id.begindate").value;
				searchInfo.endDate = document.getElementById("id.enddate").value;
				searchInfo.transId = document.getElementById("id.trans-id").value;
			}else{
				searchInfo.fromDate = document.getElementById("id.begindatemb").value;
				searchInfo.endDate = document.getElementById("id.enddatemb").value;
				searchInfo.transId = document.getElementById("id.trans-idmb").value;
			}
			searchInfo.pageIdx = idx;
            $scope.sendJSONRequest();
            displayPageCurent(idx);
        }
       
	});
	angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}
		
function addEventListenerToCombobox(selectHandle, closeHandle) {
	document.addEventListener("evtSelectionDialog", selectHandle, false);
	document.addEventListener("evtSelectionDialogClose", closeHandle, false);
}

function removeEventListenerToCombobox(selectHandle, closeHandle) {
	document.removeEventListener("evtSelectionDialog", selectHandle, false);
	document.removeEventListener("evtSelectionDialogClose", closeHandle, false);
}

function handleSelectTransType(e) {
	removeEventListenerToCombobox(handleSelectTransType, handleCloseTransTypeCbx);
	searchInfo.transType = e.selectedValue2;
	if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
		document.getElementById('id.trans-type').value = e.selectedValue1;
	}else{
		document.getElementById('id.trans-typemb').value = e.selectedValue1;
	}
	searchInfo.transTypeDtl = "";
	if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
		document.getElementById('id.trans-type-dtl').value = CONST_STR.get("COM_ALL");
	}else{
		document.getElementById('id.trans-type-dtlmb').value = CONST_STR.get("COM_ALL");
	}
}

function handleCloseTransTypeCbx() {
	removeEventListenerToCombobox(handleSelectTransType, handleCloseTransTypeCbx);
}

function getTotalPages(totalRows) {
	return totalRows % rowsPerPage == 0 ? Math.floor(totalRows / rowsPerPage) : Math.floor(totalRows / rowsPerPage) + 1;
}

function validate(fromDateStr, endDateStr) {
	var diff = getDiffDaysBetween(fromDateStr, endDateStr, "dd/MM/yyyy");
	if (diff != NaN && diff < 0) {
		showAlertText(CONST_STR.get("ACC_HIS_INVALID_QUERY_DATE"));
		return false;
	}
	return true;
}

function  displayPageCurent(page) {
    var paging = document.getElementById("pagingTrans");
    if(paging.childElementCount >0)
    {
        for(var i = 0;i<paging.childElementCount;i++)
        {
            var child = paging.children[i];
            child.className ="";
        }
        document.getElementById('page_'+page).className = 'active';
    }
}

function getDetailChangeInfo(transId) {
	var jsonData = new Object();
	jsonData.sequence_id = "3";
	jsonData.idtxn = gSetUp.idtxn;
	jsonData.transId = transId;

	var	args = new Array();
	args.push("2");
	args.push(jsonData);
	var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_SETUP_QUERY_TRANSFER'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
	var data = getDataFromGprsCmd(gprsCmd);
	
	requestMBServiceCorp(data, true, 0, getDetailChangeInfoSuccess, function() {showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST'));});
}

function getDetailChangeInfoSuccess(e) {
	var resp = JSON.parse(e);
	if (resp.respCode == '0' && resp.respJsonObj.length > 0) {		
		gCredit.LOAI_GD = resp.respJsonObj[0].LOAI_GD;
		gCredit.transaction=resp.respJsonObj[0];
		navCachedPages["setup/create/query/setup-query-transfer-detail"] = null;
		navController.pushToView("setup/create/query/setup-query-transfer-detail", true, 'html');
	} else 
		showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST'));
}

function getDetailChangePassword(transId) {
	var jsonData = new Object();
	jsonData.sequence_id = "4";
	jsonData.idtxn = gSetUp.idtxn;
	jsonData.transId = transId;

	var	args = new Array();
	args.push("2");
	args.push(jsonData);
	var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_SETUP_QUERY_TRANSFER'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
	var data = getDataFromGprsCmd(gprsCmd);
	
	requestMBServiceCorp(data, true, 0, getDetailChangePasswordSuccess, function() {showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST'));});
}

function getDetailChangePasswordSuccess(e) {
	var resp = JSON.parse(e);
	if (resp.respCode == '0' && resp.respJsonObj.length > 0) {
		gCredit.LOAI_GD = resp.respJsonObj[0].LOAI_GD;
		gCredit.transaction=resp.respJsonObj[0];
		navCachedPages["setup/create/query/setup-query-transfer-detail"] = null;
		navController.pushToView("setup/create/query/setup-query-transfer-detail", true, 'html');
	} else 
		showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST'));
}

function getDetailChangeSendMethod(transId) {
	var jsonData = new Object();
	jsonData.sequence_id = "5";
	jsonData.idtxn = gSetUp.idtxn;
	jsonData.transId = transId;

	var	args = new Array();
	args.push("2");
	args.push(jsonData);
	var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_SETUP_QUERY_TRANSFER'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
	var data = getDataFromGprsCmd(gprsCmd);
	
	requestMBServiceCorp(data, true, 0, getDetailChangeSendMethodSuccess, function() {showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST'));});
}

function getDetailChangeSendMethodSuccess(e) {
	var resp = JSON.parse(e);
	if (resp.respCode == '0' && resp.respJsonObj.length > 0) {
		gCredit.LOAI_GD = resp.respJsonObj[0].LOAI_GD;
		gCredit.transaction=resp.respJsonObj[0];
		navCachedPages["setup/create/query/setup-query-transfer-detail"] = null;
		navController.pushToView("setup/create/query/setup-query-transfer-detail", true, 'html');
	} else 
		showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST'));
}

function getDetailChangeAuthMethod(transId) {
	var jsonData = new Object();
	jsonData.sequence_id = "6";
	jsonData.idtxn = gSetUp.idtxn;
	jsonData.transId = transId;

	var	args = new Array();
	args.push("2");
	args.push(jsonData);
	var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_SETUP_QUERY_TRANSFER'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
	var data = getDataFromGprsCmd(gprsCmd);
	
	requestMBServiceCorp(data, true, 0, getDetailChangeAuthMethodSuccess, function() {showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST'));});
}

function getDetailChangeAuthMethodSuccess(e) {
	var resp = JSON.parse(e);
	if (resp.respCode == '0' && resp.respJsonObj.length > 0) {
		var docXml = genDetailChangeAuthMethod(resp.respJsonObj[0]);
		setReviewXmlStore(docXml);
		setRespObjStore(resp);
		navCachedPages["setup/create/query/setup-query-transfer-detail"] = null;
    	navController.pushToView("setup/create/query/setup-query-transfer-detail", true, 'xsl');
	} else 
		showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST'));
}

function getDetailChangeTransLimit(transId) {
	var jsonData = new Object();
	jsonData.sequence_id = "8";
	jsonData.idtxn = gSetUp.idtxn;
	jsonData.transId = transId;

	var	args = new Array();
	args.push("2");
	args.push(jsonData);
	var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_SETUP_QUERY_TRANSFER'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
	var data = getDataFromGprsCmd(gprsCmd);
	
	requestMBServiceCorp(data, true, 0, getDetailChangeTransLimitSuccess, function() {showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST'));});
}

function getDetailChangeTransLimitSuccess(e) {
	var resp = JSON.parse(e);
	if (resp.respCode == '0' && resp.respJsonObj.limit.length == 4 && resp.respJsonObj.results.length > 0) {
		gCredit.LOAI_GD = resp.respJsonObj.results[0].LOAI_GD;
		gCredit.TRANG_THAI=resp.respJsonObj.results[0].TRANG_THAI;
		gCredit.transaction=resp.respJsonObj.results[0];
		gCredit.limit=resp.respJsonObj.limit;
		navCachedPages["setup/create/query/setup-query-transfer-detail"] = null;
    	navController.pushToView("setup/create/query/setup-query-transfer-detail", true, 'html');
	} else 
		showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST'));
}

function genDetailChangeAuthMethod(transaction) {
	gSetUp.transType = "S14";

	var docXml = createXMLDoc();
	var tmpXmlRootNode = createXMLNode('review', '', docXml);
	
	var tmpXmlNodeInfo = createXMLNode('transinfo', '', docXml, tmpXmlRootNode);
		
	var tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
	createXMLNode('key', CONST_STR.get('CONST_SETUP_QUERY_TIT_TRANS_TYPE_DTL'), docXml, tmpTransContentNode);
	createXMLNode('value', CONST_STR.get('COM_IDTXN_' + transaction.LOAI_GD), docXml, tmpTransContentNode);

	tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
	createXMLNode('key', CONST_STR.get('COM_TRANS_CODE'), docXml, tmpTransContentNode);
	createXMLNode('value', transaction.MA_GD, docXml, tmpTransContentNode);

	tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
	createXMLNode('key', CONST_STR.get('COM_CREATED_DATE'), docXml, tmpTransContentNode);
	createXMLNode('value', transaction.NGAY_THUC_HIEN, docXml, tmpTransContentNode);

	tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
	createXMLNode('key', CONST_STR.get('COM_CHECK_DATE'), docXml, tmpTransContentNode);
	createXMLNode('value', transaction.NGAY_DUYET, docXml, tmpTransContentNode);

	tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
	createXMLNode('key', CONST_STR.get('COM_STATUS'), docXml, tmpTransContentNode);
	createXMLNode('value', CONST_STR.get("TRANS_STATUS_" + transaction.TRANG_THAI), docXml, tmpTransContentNode);

	if (transaction.TRANG_THAI == "REJ" && transaction.LY_DO_TU_CHOI && transaction.LY_DO_TU_CHOI != null && transaction.LY_DO_TU_CHOI.trim() != "") {
		tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
		createXMLNode('key', CONST_STR.get('AUTHORIZE_TXT_REASON'), docXml, tmpTransContentNode);
		createXMLNode('value', transaction.LY_DO_TU_CHOI, docXml, tmpTransContentNode);
	}

	tmpXmlNodeInfo = createXMLNode('transinfo2', '', docXml, tmpXmlRootNode);
	tmpXmlNodeTransTitle = createXMLNode('transtitle', CONST_STR.get('COM_METHOD_ARE_USED'), docXml, tmpXmlNodeInfo);	
	tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
	createXMLNode('value', CONST_STR.get('COM_TOKEN_' + transaction.KIEU_XAC_THUC_CU), docXml, tmpTransContentNode);

	tmpXmlNodeInfo = createXMLNode('transinfo2', '', docXml, tmpXmlRootNode);
	tmpXmlNodeTransTitle = createXMLNode('transtitle', CONST_STR.get('CONST_SETUP_QUERY_TIT_AUTH_METHOD_NEW'), docXml, tmpXmlNodeInfo);	
	tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
	createXMLNode('value', CONST_STR.get('COM_TOKEN_' + transaction.KIEU_XAC_THUC_MOI), docXml, tmpTransContentNode);

	return docXml;
}

function formatCurrency2(num) {
	num = num.toString().replace(/\$|\,/g,'');
	if(isNaN(num))
	num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num*100+0.50000000001);
	num = Math.floor(num/100).toString();
	for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
	num = num.substring(0,num.length-(4*i+3))+','+
	num.substring(num.length-(4*i+3));
	return (((sign)?'':'-') + num);
}