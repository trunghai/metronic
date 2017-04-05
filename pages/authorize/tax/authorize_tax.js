var rowsPerPage = 10;
var totalPages = 0;
var results;
var limit;
var flag = true;

var searchData;
gTrans.transInfo = {};
gTrans.makers;
gTrans.curPage;

var listSelectedTrans = [];

function viewDidLoadSuccess() {
    if(CONST_DESKTOP_MODE && !checkScreenisMobilePX()){
        rowsPerPage = 10;
    }else{
        rowsPerPage = 5;
    }
    
    init();
    resizeMainViewContent();
    if(gModeScreenView == CONST_MODE_SCR_SMALL){
        document.getElementById('nav.btn.home').style.display = 'block';
    }
}

function viewBackFromOther() {
    flag = false;
    if (sessionStorage.getItem('searchDataTax')) {
        var searchDataTax = JSON.parse(sessionStorage.getItem('searchDataTax'));
        searchData = {
            taxType: searchDataTax.taxType,
            taxDetail: searchDataTax.taxDetail,
            status: searchDataTax.status,
            maker: searchDataTax.maker,
            startDate: searchDataTax.startDate,
            enddate: searchDataTax.enddate,
            pageID: 1,
            pageSize: 10000000
        };
    }
}

function init() {
    angular.module('EbankApp').controller('authorize_tax', function ($scope, requestMBServiceCorp) {
        navController.getBottomBar().hide();
        clearCache = true;
        navCachedPages["authorize/auth-transfer"] = null;
        if (flag) {
            searchData = {
                taxType: '',
                taxDetail: '',
                status: '',
                maker: '',
                startDate: '',
                enddate: '',
                pageID: 1,
                pageSize: 10000000
            };
            console.log("viewDidLoadSuccess");
            gTrans.makers = [];
            gTrans.curPage = 1;
            limit = {};

            if (gUserInfo.lang == 'EN') {
                document.getElementById("id.taxType").value = CONST_MNG_TAX_TYPE_VALUE_EN[0];
                document.getElementById("id.taxDetail").value = CONST_MNG_TAX_DETAIL_VALUE_EN[0];
                document.getElementById("id.stt").value = CONST_AUTH_TAX_STATUS_DETAIL_VALUE_EN[0];
            } else {
                document.getElementById("id.taxType").value = CONST_MNG_TAX_TYPE_VALUE_VN[0];
                document.getElementById("id.taxDetail").value = CONST_MNG_TAX_DETAIL_VALUE_VN[0];
                document.getElementById("id.stt").value = CONST_AUTH_TAX_STATUS_DETAIL_VALUE_VN[0];
            }
        }


        //Show loại giao dịch
        $scope.showTaxType = function () {
            var value = (gUserInfo.lang == 'EN') ? CONST_MNG_TAX_TYPE_VALUE_EN : CONST_MNG_TAX_TYPE_VALUE_VN;
            var key = CONST_MNG_TAX_TYPE_KEY;

            var handleSelectTaxType = function (e) {
                if (currentPage == "authorize/tax/authorize_tax") {
                    document.removeEventListener("evtSelectionDialog", handleSelectTaxType, false);
                    if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                        var taxType = document.getElementById('id.taxType');
                        if (taxType.nodeName == "INPUT") {
                            taxType.value = e.selectedValue1;
                        } else {
                            taxType.innerHTML = e.selectedValue1;
                        }
                    }
                    if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                        searchData.taxType = e.selectedValue2;
                    }
                    navController.getBottomBar().hide();
                }
            }

            var handleSelectTaxTypeClose = function () {
                if (currentPage == "authorize/tax/authorize_tax") {
                    document.removeEventListener("evtSelectionDialogClose", handleSelectTaxTypeClose, false);
                    document.removeEventListener("evtSelectionDialog", handleSelectTaxType, false);
                }
            }

            document.addEventListener("evtSelectionDialog", handleSelectTaxType, false);
            document.addEventListener("evtSelectionDialogClose", handleSelectTaxTypeClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC'), value, key, false);
        }

        // Chi tiết loại giao dịch
        $scope.showTaxDetail = function () {
            var value = (gUserInfo.lang == 'EN') ? CONST_MNG_TAX_DETAIL_VALUE_EN : CONST_MNG_TAX_DETAIL_VALUE_VN;
            var key = CONST_MNG_TAX_DETAIL_KEY;

            var handleSelectTaxDetail = function (e) {
                if (currentPage == "authorize/tax/authorize_tax") {
                    document.removeEventListener("evtSelectionDialog", handleSelectTaxDetail, false);
                    if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                        var taxDetail = document.getElementById('id.taxDetail');
                        if (taxDetail.nodeName == "INPUT") {
                            taxDetail.value = e.selectedValue1;
                        } else {
                            taxDetail.innerHTML = e.selectedValue1;
                        }
                    }
                    if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                        searchData.taxDetail = e.selectedValue2;
                    }
                    navController.getBottomBar().hide();
                }
            }

            var handleSelectTaxDetailClose = function () {
                if (currentPage == "authorize/tax/authorize_tax") {
                    document.removeEventListener("evtSelectionDialogClose", handleSelectTaxDetailClose, false);
                    document.removeEventListener("evtSelectionDialog", handleSelectTaxDetail, false);
                }
            }

            document.addEventListener("evtSelectionDialog", handleSelectTaxDetail, false);
            document.addEventListener("evtSelectionDialogClose", handleSelectTaxDetailClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC'), value, key, false);
        }

        // Trạng thái
        $scope.showStatus = function () {
            var value = (gUserInfo.lang == 'EN') ? CONST_AUTH_TAX_STATUS_DETAIL_VALUE_EN : CONST_AUTH_TAX_STATUS_DETAIL_VALUE_VN;
            var key = CONST_AUTH_TAX_STATUS_DETAIL_KEY;

            var handleSelectTaxStatus = function (e) {
                if (currentPage == "authorize/tax/authorize_tax") {
                    document.removeEventListener("evtSelectionDialog", handleSelectTaxStatus, false);
                    if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                        var taxStatus = document.getElementById('id.stt');
                        if (taxStatus.nodeName == "INPUT") {
                            taxStatus.value = e.selectedValue1;
                        } else {
                            taxStatus.innerHTML = e.selectedValue1;
                        }
                    }
                    if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                        searchData.status = e.selectedValue2;
                    }
                    navController.getBottomBar().hide();
                }
            }

            var handleSelectTaxStatusClose = function () {
                if (currentPage == "authorize/tax/authorize_tax") {
                    document.removeEventListener("evtSelectionDialogClose", handleSelectTaxStatusClose, false);
                    document.removeEventListener("evtSelectionDialog", handleSelectTaxStatus, false);
                }
            }

            document.addEventListener("evtSelectionDialog", handleSelectTaxStatus, false);
            document.addEventListener("evtSelectionDialogClose", handleSelectTaxStatusClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC'), value, key, false);
        }

        //Chon nguoi lap giao dich
        $scope.showMakers = function () {
            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn = "B61";
            var args = new Array();
            args.push("2");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_PAY_TAX_AUTHORIZE"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, getMakersSuccess, function () {
            });
        }
		
		function getMakersSuccess(e) {
			var resp = e;
			if (resp.respCode == 0 || resp.respJsonObj.makers.length > 0) {
				var cbxText = [];
				var cbxValues = [];
				cbxText.push(CONST_STR.get("COM_ALL"));
				cbxValues.push("");
				for (var i in resp.respJsonObj.makers) {
					var userId = resp.respJsonObj.makers[i].IDUSER;
					cbxText.push(userId);
					cbxValues.push(userId);
				}
				addEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
				showDialogList(CONST_STR.get('COM_CHOOSE_MAKER'), cbxText, cbxValues, false);
			} else
				showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_LIST_MAKER'));
		}

		function handleSelectMaker(e) {
			removeEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
			searchData.maker = e.selectedValue2;
			document.getElementById('id.maker').value = e.selectedValue1;
		}

		function handleCloseMakerCbx() {
			removeEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
		}
		
        //Gui request Search Authorize Tax
        $scope.searchAuthorizeTax = function () {
            var startDate = document.getElementById("id.begindate").value;
            var endDate = document.getElementById("id.mngenddate").value;

            var jsonData = new Object();
            searchData.pageID = 1;
            jsonData.sequence_id = "2";
            jsonData.taxType = searchData.taxType;
            jsonData.taxDetail = searchData.taxDetail;
            jsonData.status = searchData.status;
            jsonData.maker = searchData.maker;
            jsonData.startDate = startDate;
            jsonData.endDate = endDate;
            jsonData.idtxn = "B61";

            jsonData.pageSize = searchData.pageSize;
            jsonData.pageId = searchData.pageID;

            sessionStorage.setItem('searchDataTax', JSON.stringify(searchData));
            gTrans.curPage = 1;
            if (validateDate(jsonData.startDate, jsonData.endDate)) {
                var args = new Array();
                args.push("2");
                args.push(jsonData);
                var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_PAY_TAX_AUTHORIZE'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
                var data = getDataFromGprsCmd(gprsCmd);
				requestMBServiceCorp.post(data, true, function (response) {
					if (response.respCode == '0') {
						results = response.respJsonObj.list_pending;
						limit = response.respJsonObj.limit;
						gCorp.limit = response.respJsonObj.limit;
						var result = document.getElementById('id.searchResult');
						if (response.respJsonObj == null){
							result.style.display = 'none';
							$scope.listPending = [];
						}else {
							$scope.listPending = results;
							if (results.length > 0) {
								result.style.display = 'block';
								document.getElementById('id.message').style.display = 'none';
							}else{
								result.style.display = 'none';
								document.getElementById('id.message').style.display = 'block';
								document.getElementById('id.message.value').innerHTML = "<h5>" + CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST") + "</h5>";
							}
						}

					}else {
						showAlertText(response.respContent);
					}
				}, function () {
					showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
				});
            }
        }

        $scope.showDetailTransaction = function (e) {

            var jsonData = {};
			
			jsonData.sequence_id = "3";
			jsonData.idFcatref = e;
			jsonData.idtxn = "B61";
			
            var args = new Array();
			args.push("3");
			args.push(jsonData);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_PAY_TAX_AUTHORIZE"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, showDetailAuthorizeTaxSuccess, showDetailAuthorizeTaxFail);
        }
		
		function showDetailAuthorizeTaxSuccess(e) {
			var gprsResp = e;
			var date = new Date();
			if (gprsResp.respCode == 0 && gprsResp.respJsonObj.detail.length > 0 && gprsResp.respJsonObj.list.length > 0) {
				if (date.getHours() > 16 && (date.getHours() > 16 || date.getMinutes() > 30)) {
					showAlertConfirmText(CONST_STR.get('CORP_MSG_CUT_OF_TIME_OVER'));
					document.addEventListener("alertConfirmOK", function (e) {
						var obj = gprsResp.respJsonObj;
						genReviewHTML(obj);
						navCachedPages["authorize/trasfer/auth-trans-review"] = null;
					}, true);
				} else {
					var obj = gprsResp.respJsonObj;
					genReviewHTML(obj);
					navCachedPages["authorize/trasfer/auth-trans-review"] = null;
				}
			} else {
				showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST'));
			}
			;
		}

		function showDetailAuthorizeTaxFail() {
		}

        $scope.authorizeTax = function () {
            var reasontpb = document.getElementById('trans.reason').value;
            if(reasontpb){
                showAlertText(CONST_STR.get("COM_CHECK_REJECT_BUTTON"));
                return false;
            }
            console.log("results", results);
            console.log("gTrans.curPage", gTrans.curPage);
            var checkboxes = document.getElementsByClassName("trans.checkbox");
            var i;
            listSelectedTrans = [];
            for (i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked == true) {
                    if (i < checkboxes.length/2) {
                        listSelectedTrans.push(results[(gTrans.curPage - 1) * rowsPerPage + i]);
                    }
                    else {
                        listSelectedTrans.push(results[(gTrans.curPage - 1) * rowsPerPage + i - checkboxes.length/2]);   
                    }
                }
            }

            if (listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_EMPTY_TRANS_SELECTED"));
                return;
            }

            //Tinh tong so tien
            var totalAmount = 0;
            for (var j = 0; j < listSelectedTrans.length; j++) {
                totalAmount += parseInt(listSelectedTrans[j].NUMAMOUNT);
            }
            console.log("totalAmount", totalAmount);
            console.log("limitTime", gCorp.limit.limitTime);
            console.log("limitDay", gCorp.limit.limitDay);
            console.log("totalDay", gCorp.limit.totalDay);

            gCorp.rootView = currentPage;
            if (parseInt(totalAmount) > parseInt(gCorp.limit.limitTime)) {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_LIMIT_EXCEEDED_TIME"), [formatNumberToCurrency(limit.limitTime)]));
                return;
            }

            if ((parseInt(totalAmount) + parseInt(gCorp.limit.totalDay)) > parseInt(gCorp.limit.limitDay)) {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_LIMIT_EXCEEDED_DAY"), [formatNumberToCurrency(limit.limitDay)]));
                return;
            }

            var date = new Date();
            if (date.getHours() > 16 && (date.getHours() > 16 || date.getMinutes() > 30)) {
                showAlertConfirmText(CONST_STR.get('CORP_MSG_CUT_OF_TIME_OVER'));
                document.addEventListener("alertConfirmOK", function (e) {
                    //var docXml = genReviewTableXML("authorize");
                    gTrans.listRequset = [];
                    for (var i in listSelectedTrans) {
                        gTrans.listRequset.push({
                            transinfo: listSelectedTrans[i].IDFCATREF
                        });
                    }

                    gTrans.listSelectedTrans = listSelectedTrans;
                    for (var i in gTrans.listSelectedTrans) {
                        var tran = gTrans.listSelectedTrans[i];
                        gTrans.listSelectedTrans[i].TAX_TYPE_VIEW = CONST_STR.get("CONST_TAX_" + tran.TAX_TYPE);
                        gTrans.listSelectedTrans[i].CODSTATUS_VIEW = CONST_STR.get("TRANS_STATUS_" + tran.CODSTATUS);
                        gTrans.listSelectedTrans[i].NUMAMOUNT_VIEW = formatNumberToCurrency(tran.NUMAMOUNT) + " VND";
                    }
                    gTrans.reason = "";
                    gTrans.authen = true;
                    gTrans.sequenceId = "4";
                    gTrans.idtxn = 'B61';
                    gTrans.cmdType = CONSTANTS.get('CMD_CO_PAY_TAX_AUTHORIZE');
                    gTrans.srcAuthenDesktop = 'pages/authorize/tax/views/auth-tax-view-desktop.html';
					gTrans.srcAuthenMobile = 'pages/authorize/tax/views/auth-tax-view-mobile.html';
                    gTrans.srcViewListPending = 'authorize/tax/authorize_tax';
                    navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
                    navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');

                }, true);
            } else {
                //var docXml = genReviewTableXML("authorize");
                gTrans.listRequset = [];
                for (var i in listSelectedTrans) {
                    gTrans.listRequset.push({
                        transinfo: listSelectedTrans[i].IDFCATREF
                    });
                }

                gTrans.listSelectedTrans = listSelectedTrans;
                for (var i in gTrans.listSelectedTrans) {
                    var tran = gTrans.listSelectedTrans[i];
                    gTrans.listSelectedTrans[i].TAX_TYPE_VIEW = CONST_STR.get("CONST_TAX_" + tran.TAX_TYPE);
                    gTrans.listSelectedTrans[i].CODSTATUS_VIEW = CONST_STR.get("TRANS_STATUS_" + tran.CODSTATUS);
                    gTrans.listSelectedTrans[i].NUMAMOUNT_VIEW = formatNumberToCurrency(tran.NUMAMOUNT) + " VND";
                }
                gTrans.reason = "";
                gTrans.authen = true;
                gTrans.sequenceId = "4";
                gTrans.idtxn = 'B61';
                gTrans.cmdType = CONSTANTS.get('CMD_CO_PAY_TAX_AUTHORIZE');
                gTrans.srcAuthenDesktop = 'pages/authorize/tax/views/auth-tax-view-desktop.html';
				gTrans.srcAuthenMobile = 'pages/authorize/tax/views/auth-tax-view-mobile.html';
                gTrans.srcViewListPending = 'authorize/tax/authorize_tax';
                navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
                navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');


                /*setReviewXmlStore(docXml);
                 navCachedPages["common/review/com-review"] = null;
                 navController.pushToView("common/review/com-review", true, 'xsl');
                 console.log("request", request);*/
            }
        }

        $scope.rejectTax = function () {
            var checkboxes = document.getElementsByClassName("trans.checkbox");
            var reasonRej = document.getElementById("trans.reason").value;
            var i;
            listSelectedTrans = [];
            for (i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked == true) {
                    if (i < checkboxes.length/2){
                        listSelectedTrans.push(results[(gTrans.curPage - 1) * rowsPerPage + i]);
                    }
                    else {
                        listSelectedTrans.push(results[(gTrans.curPage - 1) * rowsPerPage + i - checkboxes.length/2]);
                    }
                }
            }

            if (listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_EMPTY_TRANS_SELECTED"));
                return;
            }

            if (reasonRej == "") {
                showAlertText(CONST_STR.get("COM_CHECK_EMPTY_REJECT_REASON"));
                return;
            }

            //var docXml = genReviewTableXML("reject");
            var transInfo = [];
            for (var i in listSelectedTrans) {
                transInfo.push({
                    transinfo: listSelectedTrans[i].IDFCATREF
                });
            }

            console.log(reasonRej);
            gTrans.listRequset = transInfo;

            gTrans.listSelectedTrans = listSelectedTrans;
            for (var i in gTrans.listSelectedTrans) {
                var tran = gTrans.listSelectedTrans[i];
                gTrans.listSelectedTrans[i].TAX_TYPE_VIEW = CONST_STR.get("CONST_TAX_" + tran.TAX_TYPE);
                gTrans.listSelectedTrans[i].CODSTATUS_VIEW = CONST_STR.get("TRANS_STATUS_" + tran.CODSTATUS);
                gTrans.listSelectedTrans[i].NUMAMOUNT_VIEW = formatNumberToCurrency(tran.NUMAMOUNT) + " VND";
            }

            gTrans.cmdType = CONSTANTS.get("CMD_CO_PAY_TAX_AUTHORIZE");
            gTrans.sequenceId = "5";
            gTrans.idtxn = "B61";
            gTrans.reason = reasonRej;
            gTrans.authen = false;
			gTrans.srcAuthenDesktop = 'pages/authorize/tax/views/auth-tax-view-desktop.html';
			gTrans.srcAuthenMobile = 'pages/authorize/tax/views/auth-tax-view-mobile.html';
            gTrans.srcViewListPending = 'authorize/tax/authorize_tax';
            navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
            navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');
        }
        $scope.sendRequestExportExcel = function () {
            var transIds = "";
            for (var i in results) {
                transIds += results[i].IDFCATREF + ",";
            }
            var arrayClientInfo = new Array();
            arrayClientInfo.push(null);
            arrayClientInfo.push({
                sequenceId: "2",
                transType: "B11",
                transIds: transIds
            });

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_EXPORT_EXCEL_REPORT"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

            data = getDataFromGprsCmd(gprsCmd);

            corpExportExcel(data);
        }


        $scope.searchAuthorizeTax();
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}

function addEventListenerToCombobox(selectHandle, closeHandle) {
    document.addEventListener("evtSelectionDialog", selectHandle, false);
    document.addEventListener("evtSelectionDialogClose", closeHandle, false);
}

function removeEventListenerToCombobox(selectHandle, closeHandle) {
    document.removeEventListener("evtSelectionDialog", selectHandle, false);
    document.removeEventListener("evtSelectionDialogClose", closeHandle, false);
}

function validateDate(fromDate, endDate) {
    var currentDate = new Date();
    var strCurrentDate = ('0' + (currentDate.getDate())) + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
    /*
     if (gInternational.searchInfo.fromDate === 'dd/mm/yyyy'){
     gInternational.searchInfo.fromDate = '';
     }

     if (gInternational.searchInfo.endDate === 'dd/mm/yyyy'){
     gInternational.searchInfo.endDate = '';
     }*/


    if (!this.calculateDifferentMonth(fromDate, strCurrentDate)) {
        showAlertText(formatString(CONST_STR.get("GUA_NOT_GREATER_TODAY"), [CONST_STR.get("COM_FROM")]));
        return false;
    }

    if (!this.calculateDifferentMonth(endDate, strCurrentDate)) {
        showAlertText(formatString(CONST_STR.get("GUA_NOT_GREATER_TODAY"), [CONST_STR.get("COM_TO_DATE")]));
        return false;
    }

    if (!this.calculateDifferentMonth(fromDate, endDate)) {
        showAlertText(CONST_STR.get("GUA_PERIODIC_END_DATE_LESS_TO_DATE"));
        return false;
    }
    return true;
}

function calculateDifferentMonth(valFromDate, valToDate) {
    if (valFromDate == '' || valFromDate == undefined) {
        return true;
    }
    ;
    var from = valFromDate.split("/");
    var to = valToDate.split("/");
    var fromDate = new Date(parseInt(from[2], 10), parseInt(from[1], 10) - 1, parseInt(from[0], 10));
    var toDate = new Date(parseInt(to[2], 10), parseInt(to[1], 10) - 1, parseInt(to[0], 10));
    if (fromDate > toDate) {
        return false;
    }
    return true;
}

function genPagging(totalPages, pageIdx) {
    var nodepage = document.getElementById('pageIndicatorNums');
    var tmpStr = genPageIndicatorHtml(totalPages, pageIdx);
    nodepage.innerHTML = tmpStr;
}

function getTotalPages(totalRows) {
    return totalRows % rowsPerPage == 0 ? Math.floor(totalRows / rowsPerPage) : Math.floor(totalRows / rowsPerPage) + 1;
}

function pageIndicatorSelected(selectedIdx, selectedPage) {
    gTrans.curPage = selectedIdx;
    document.getElementById("id.searchResult").innerHTML = genHtmlDoc(results);
    document.getElementById("export_file").style.display = 'inline-table';
    genPagging(totalPages, gTrans.curPage);
}

function genReviewHTML(obj) {
    var transInfo = [];
    transInfo.push({
        transinfo: obj.detail[0].MA_GIAO_DICH
    });
    var rejectRequest = transInfo;
    gCorp.requests = [rejectRequest];

    gTrans.transInfo.MA_GIAO_DICH = obj.detail[0].MA_GIAO_DICH;
    gTrans.transInfo.NGAY_LAP = obj.detail[0].NGAY_LAP;
    gTrans.transInfo.TRANG_THAI_VIEW = CONST_STR.get("TRANS_STATUS_" + obj.detail[0].TRANG_THAI);
    gTrans.transInfo.TAI_KHOAN_CHUYEN_TIEN = obj.detail[0].TAI_KHOAN_CHUYEN_TIEN;
    gTrans.transInfo.SO_DU_KHA_DUNG_VIEW = formatNumberToCurrency(obj.detail[0].SO_DU_KHA_DUNG) + " VND";
    gTrans.transInfo.MA_SO_THUE = obj.detail[0].MA_SO_THUE;
    gTrans.transInfo.NGUOI_NOP_THUE = obj.detail[0].NGUOI_NOP_THUE;
    gTrans.transInfo.DIA_CHI_NGUOI_NOP_THUE = obj.detail[0].DIA_CHI_NGUOI_NOP_THUE;
    gTrans.transInfo.CQ_QL_THU = obj.detail[0].CQ_QL_THU;
    gTrans.transInfo.LOAI_THUE = obj.detail[0].LOAI_THUE;

    var treasuryAccNumValue = obj.detail[0].TK_THU_NSNN + ' - ';
    if (obj.detail[0].TK_THU_NSNN == '7111') {
        treasuryAccNumValue = treasuryAccNumValue + CONST_STR.get('TAX_TREASURY_ACC_NOP_NSNN');
    } else if (obj.detail[0].TK_THU_NSNN == '3511') {
        treasuryAccNumValue = treasuryAccNumValue + CONST_STR.get('TAX_TREASURY_ACC_TAM_THU');
    } else {
        treasuryAccNumValue = treasuryAccNumValue + CONST_STR.get('TAX_TREASURY_ACC_THU_QUY');
    }

    if (obj.detail[0].LOAI_THUE == "02" || obj.detail[0].LOAI_THUE == "05") {
        gTrans.transInfo.LOAI_THUE_VIEW = obj.detail[0].LOAI_THUE + " - " + CONST_STR.get("CONST_TAX_" + obj.detail[0].LOAI_THUE);
        gTrans.transInfo.TEN_KHO_BAC_VIEW = obj.detail[0].KBNN_THU + " - " + obj.detail[0].TEN_KHO_BAC;
        gTrans.transInfo.TK_THU_NSNN_VIEW = treasuryAccNumValue;
        gTrans.transInfo.MA_CQ_QL_THU_VIEW = obj.detail[0].MA_CQ_QL_THU + " - " + obj.detail[0].CQ_QL_THU;
        gTrans.transInfo.SO_TO_KHAI = obj.detail[0].SO_TO_KHAI;
        gTrans.transInfo.LOAI_TIEN_HAI_QUAN_VIEW = obj.detail[0].LOAI_TIEN_HAI_QUAN + ' - ' + CONST_STR.get('K_TAX_HQ_' + obj.detail[0].LOAI_TIEN_HAI_QUAN);
        gTrans.transInfo.NGAY_DANG_KY_TO_KHAI = obj.detail[0].NGAY_DANG_KY_TO_KHAI;
        gTrans.transInfo.MA_LOAI_HINH_XNK_VIEW = obj.detail[0].MA_LOAI_HINH_XNK + ' - ' + obj.detail[0].TEN_LH;
    } else if (obj.detail[0].LOAI_THUE == "06") {
        gTrans.transInfo.MA_NH_NHAN = obj.detail[0].MA_NH_NHAN;
        gTrans.transInfo.TEN_NH_THU_HUONG = obj.detail[0].TEN_NH_THU_HUONG;
        gTrans.transInfo.TK_THU_HUONG = obj.detail[0].TK_THU_HUONG;
        gTrans.transInfo.TEN_TK_THU_HUONG = obj.detail[0].TEN_TK_THU_HUONG;
        gTrans.transInfo.MA_NGUYEN_TE = obj.detail[0].MA_NGUYEN_TE;
        gTrans.transInfo.TY_GIA = obj.detail[0].TY_GIA;
        gTrans.transInfo.TONG_TIEN_NGUYEN_TE_VIEW = formatNumberToCurrency(obj.detail[0].TONG_TIEN_NGUYEN_TE);
    } else {
        gTrans.transInfo.LOAI_THUE_VIEW = CONST_STR.get("CONST_TAX_" + obj.detail[0].LOAI_THUE);
        gTrans.transInfo.TEN_KHO_BAC_VIEW = obj.detail[0].KBNN_THU + " - " + obj.detail[0].TEN_KHO_BAC;
        gTrans.transInfo.TK_THU_NSNN_VIEW = treasuryAccNumValue;
    }
    gTrans.transInfo.listPending = new Array();
    if (obj.detail[0].LOAI_THUE == '06') {
        for (var i = 0; i < obj.list.length; i++) {
            obj.list[i].SO_TIEN_NGUYEN_TE_VIEW = formatNumberToCurrency(obj.list[i].SO_TIEN_NGUYEN_TE) + ' ' + obj.detail[0].MA_NGUYEN_TE;
            obj.list[i].SO_TIEN_VIEW = formatNumberToCurrency(obj.list[i].SO_TIEN) + ' VND';
            gTrans.transInfo.listPending.push(obj.list[i]);
        }
    } else {
        for (var i = 0; i < obj.list.length; i++) {
            var economyContent = obj.list[i].NOI_DUNG_KINH_TE;
            if (economyContent == '' || economyContent == null || typeof economyContent == 'undefined')
                economyContent = obj.list[i].MA_NOI_DUNG_KINH_TE;
            obj.list[i].economyContent = economyContent;
            obj.list[i].SO_TIEN_VIEW = formatNumberToCurrency(obj.list[i].SO_TIEN) + ' VND';
            gTrans.transInfo.listPending.push(obj.list[i]);

        }
    }

    if (obj.detail[0].LOAI_THUE == '02' || obj.detail[0].LOAI_THUE == '05') {
        //So tien
        gTrans.transInfo.SO_TIEN_THANH_TOAN_VIEW = formatNumberToCurrency(obj.detail[0].SO_TIEN_THANH_TOAN) + " VND";
        gTrans.transInfo.PHI_GIAO_DICH_VIEW = formatNumberToCurrency(obj.detail[0].PHI_GIAO_DICH) + " VND";
        gTrans.transInfo.NOI_DUNG = obj.detail[0].NOI_DUNG;

    } else if (obj.detail[0].LOAI_THUE == '06') {
        //So tien
        gTrans.transInfo.SO_TIEN_THANH_TOAN_VIEW = formatNumberToCurrency(obj.detail[0].SO_TIEN_THANH_TOAN) + " VND";
        gTrans.transInfo.PHI_GIAO_DICH_VIEW = formatNumberToCurrency(obj.detail[0].PHI_GIAO_DICH) + " VND";
        gTrans.transInfo.NOI_DUNG = obj.detail[0].MOTA;
    } else {
        gTrans.transInfo.SO_HIEU_KHO_BAC_VIEW = obj.detail[0].SO_HIEU_KHO_BAC + " - " + obj.detail[0].TEN_KHO_BAC; // SP LAY TEN
        //So tien
        gTrans.transInfo.SO_TIEN_THANH_TOAN_VIEW = formatNumberToCurrency(obj.detail[0].SO_TIEN_THANH_TOAN) + " VND";
        gTrans.transInfo.PHI_GIAO_DICH_VIEW = formatNumberToCurrency(obj.detail[0].PHI_GIAO_DICH) + " VND";
        gTrans.transInfo.NOI_DUNG = obj.detail[0].NOI_DUNG;

    }
    gTrans.listRequset = [];
    gTrans.cmdType = CONSTANTS.get('CMD_CO_PAY_TAX_AUTHORIZE');
    gTrans.listRequset = gCorp.requests;
    gTrans.idtxn = "B61";
    gTrans.scr = 'pages/authorize/tax/views/auth-tax-view-detail.html';
    gTrans.srcViewListPending = 'authorize/tax/authorize_tax';
    navCachedPages['authorize/transfer/common-review/auth-once-trans-review'] = null;
    navController.pushToView('authorize/transfer/common-review/auth-once-trans-review', true, 'html');
}

function transSelectedChange(e) {
    if (e.name == "true") {
        var checkboxes = document.getElementsByClassName("trans.checkbox");
        var i;
        for (i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
        }
        e.name = "false";
    } else {
        var checkboxes = document.getElementsByClassName("trans.checkbox");
        var i;
        for (i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
        e.name = "true";
    }
}

function genReviewTableXML(action) {
    var xmlDoc = createXMLDoc();
    var rootNode;
    rootNode = createXMLNode('review', '', xmlDoc);

    var sectionNode = createXMLNode('section', '', xmlDoc, rootNode);

    var tableNode = createXMLNode("table", "", xmlDoc, sectionNode);
    var theadNode = createXMLNode("thead", "", xmlDoc, tableNode);
    createXMLNode("th", CONST_STR.get('COM_NO'), xmlDoc, theadNode);
    createXMLNode("th", CONST_STR.get('COM_MAKER'), xmlDoc, theadNode);
    createXMLNode("th", CONST_STR.get('COM_CREATED_DATE'), xmlDoc, theadNode);
    createXMLNode("th", CONST_STR.get('COM_TYPE_TRANSACTION'), xmlDoc, theadNode);
    createXMLNode("th", CONST_STR.get('TRANS_PERIODIC_MNG_STT'), xmlDoc, theadNode);
    createXMLNode("th", CONST_STR.get('TRANS_ACCNO_AMOUNT_CONT'), xmlDoc, theadNode);
    createXMLNode("th", CONST_STR.get('COM_CHEKER'), xmlDoc, theadNode);
    createXMLNode("th", CONST_STR.get('COM_TRANS_CODE'), xmlDoc, theadNode);

    var tbodyNode = createXMLNode("tbody", "", xmlDoc, tableNode);

    for (var i in listSelectedTrans) {
        var tran = listSelectedTrans[i];
        var tdNode;
        var trNode = createXMLNode("tr", "", xmlDoc, tbodyNode);
        tdNode = createXMLNode("td", parseInt(i) + 1, xmlDoc, trNode);
        createXMLNode("title", CONST_STR.get("COM_NO"), xmlDoc, tdNode);

        tdNode = createXMLNode("td", tran.SHORTNAME, xmlDoc, trNode);
        createXMLNode("title", CONST_STR.get("COM_MAKER"), xmlDoc, tdNode);

        tdNode = createXMLNode("td", tran.DATMAKE, xmlDoc, trNode);
        createXMLNode("title", CONST_STR.get("COM_CREATED_DATE"), xmlDoc, tdNode);

        tdNode = createXMLNode("td", CONST_STR.get("CONST_TAX_" + tran.TAX_TYPE), xmlDoc, trNode);
        createXMLNode("title", CONST_STR.get("COM_TYPE_TRANSACTION"), xmlDoc, tdNode);

        tdNode = createXMLNode("td", CONST_STR.get("TRANS_STATUS_" + tran.CODSTATUS), xmlDoc, trNode);
        createXMLNode("title", CONST_STR.get("TRANS_PERIODIC_MNG_STT"), xmlDoc, tdNode);

        tdNode = createXMLNode("td", formatNumberToCurrency(tran.NUMAMOUNT) + " VND", xmlDoc, trNode);
        createXMLNode("title", CONST_STR.get("TRANS_ACCNO_AMOUNT_CONT"), xmlDoc, tdNode);

        tdNode = createXMLNode("td", tran.SIGNEDBY, xmlDoc, trNode);
        createXMLNode("title", CONST_STR.get("COM_CHEKER"), xmlDoc, tdNode);

        tdNode = createXMLNode("td", '', xmlDoc, trNode);
        createXMLNode("onclick", "showDetailAuthorizeTax(" + tran.IDFCATREF + ", " + true + ")",
            xmlDoc, tdNode);
        createXMLNode("value", tran.IDFCATREF, xmlDoc, tdNode);
        createXMLNode("title", CONST_STR.get("COM_TRANS_CODE"), xmlDoc, tdNode);
    }

    if (action == "reject") {
        var reasonElement = document.getElementById("id.reason-rej");
        sectionNode = createXMLNode('section', '', xmlDoc, rootNode);
        createXMLNode("row-one-col", CONST_STR.get("COM_AUTH_DENIAL_REASON") + ": " + reasonElement.value, xmlDoc, sectionNode);
    }
    ;

    var buttonNode = createXMLNode('button', '', xmlDoc, rootNode);
    var typeNode = createXMLNode('type', 'back', xmlDoc, buttonNode);
    var btnLabelNode = createXMLNode('label', CONST_STR.get('ESAVING_CHANGEINFO_BTN_BK'), xmlDoc, buttonNode);

    buttonNode = createXMLNode('button', '', xmlDoc, rootNode);
    typeNode = createXMLNode('type', 'authorize', xmlDoc, buttonNode);

    if (action == "reject") {
        btnLabelNode = createXMLNode('label', CONST_STR.get('ESAVING_CHANGEINFO_BTN_CON'), xmlDoc, buttonNode);
    }

    if (action == "authorize") {
        btnLabelNode = createXMLNode('label', CONST_STR.get('ESAVING_CHANGEINFO_BTN_CON'), xmlDoc, buttonNode);
    }

    return xmlDoc;
}

function compareCurrentTime() {
    var date = new Date();
    return (date.getHours() > 16 || (date.getHours == 16 && date.getMinutes() > 30));
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
    var arrayClientInfo = new Array();
    arrayClientInfo.push(null);
    arrayClientInfo.push({
        sequenceId: "25",
        idfcatref: 'T13'
    });

    var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_EXPORT_EXCEL_REPORT"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

    data = getDataFromGprsCmd(gprsCmd);

    requestMBServiceCorp(data, true, 0,
        function (data) {
        var resp = data;
        if (resp.respCode == "0") {
            var fileName = resp.respContent;
            window.open("./download/" + fileName);
        }
    });
}

