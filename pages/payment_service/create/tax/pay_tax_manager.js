/**
 * User: HaiNM.FSOFT
 * Date: 1/5/17
 * Time: 11:51 AM
 **/
 
var rowsPerPage = 10;
var totalPages = 0;
var flag = true;

var searchData ;

gTax.results;
gTax.curPage;

function viewBackFromOther() {
    flag = false;
    navController.getBottomBar().hide();
    if(sessionStorage.getItem('searchTaxManager')){
        var searchDataTax = JSON.parse(sessionStorage.getItem('searchTaxManager'));
        searchData = {
            taxType: searchDataTax.taxType,
            taxDetail: searchDataTax.taxDetail,
            status: searchDataTax.status,
            idFcatref: searchDataTax.idFcatref,
            startDate: searchDataTax.startDate,
            enddate: searchDataTax.enddate,
            pageID: 1,
            pageSize: 10000000
        };
    }

}

function viewDidLoadSuccess() {
    navController.getBottomBar().hide();
    if(CONST_DESKTOP_MODE && !checkScreenisMobilePX()){
        rowsPerPage = 10;
    }else{
        rowsPerPage = 5;
    }
    if (flag) {
        console.log("viewDidLoadSuccess");
        searchData = {
            taxType: '',
            taxDetail: '',
            status: '',
            idFcatref: '',
            startDate: '',
            enddate: '',
            pageID: 1,
            pageSize: 10000000
        };
        document.getElementById('id.search').innerHTML = "";
        document.getElementById('pageIndicatorNums').innerHTML = "";
        if (gUserInfo.lang == 'EN') {
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                document.getElementById("id.taxType").value = CONST_MNG_TAX_TYPE_VALUE_EN[0];
                document.getElementById("id.taxDetail").value = CONST_MNG_TAX_DETAIL_VALUE_EN[0];
                document.getElementById("id.stt").value = CONST_MNG_TAX_STATUS_DETAIL_VALUE_EN[0];
            }else{
                document.getElementById("id.taxTypemb").value = CONST_MNG_TAX_TYPE_VALUE_EN[0];
                document.getElementById("id.taxDetailmb").value = CONST_MNG_TAX_DETAIL_VALUE_EN[0];
                document.getElementById("id.sttmb").value = CONST_MNG_TAX_STATUS_DETAIL_VALUE_EN[0];
            }
        } else {
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                document.getElementById("id.taxType").value = CONST_MNG_TAX_TYPE_VALUE_VN[0];
                document.getElementById("id.taxDetail").value = CONST_MNG_TAX_DETAIL_VALUE_VN[0];
                document.getElementById("id.stt").value = CONST_MNG_TAX_STATUS_DETAIL_VALUE_VN[0];
            }else{
                document.getElementById("id.taxTypemb").value = CONST_MNG_TAX_TYPE_VALUE_VN[0];
                document.getElementById("id.taxDetailmb").value = CONST_MNG_TAX_DETAIL_VALUE_VN[0];
                document.getElementById("id.sttmb").value = CONST_MNG_TAX_STATUS_DETAIL_VALUE_VN[0];
            }
        };
       // sendJsonRequest();
    }
    else { // chuc nang back lai
        setTimeout(function () {
        //    sendJsonRequest();
        }, 150);

    }
	iniData();
}

function iniData() {
    angular.module('EbankApp').controller('pay-tax-manager', function ($scope) {
		
		$scope.sendJsonRequest = function () {
			var taxDtl;
			var idFcatref;
			var startDate;
            var endDate;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                taxDtl = document.getElementById("id.taxDetail").value;
                idFcatref = document.getElementById("idFcatref").value;
                startDate = document.getElementById("id.begindate").value;
                endDate = document.getElementById("id.mngenddate").value;
            }else{
                taxDtl = document.getElementById("id.taxDetailmb").value;
                idFcatref = document.getElementById("idFcatrefmb").value;
                startDate = document.getElementById("id.begindatemb").value;
                endDate = document.getElementById("id.mngenddatemb").value;
            }
			searchData.startDate = startDate;
			searchData.endDate = endDate;
			searchData.idFcatref = idFcatref;
			if (taxDtl == "") {
				showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("CONST_SETUP_QUERY_TIT_TRANS_TYPE_DTL")]));
				return;
			}

			if (calculateDifferentMonth(startDate, endDate)) {
				showAlertText(CONST_STR.get("CORP_MSG_ACC_TIME_SEARCH_NOT_VALID"));
				return;
			}
			searchData.pageID = 1;
			gTax.sequence_id = "1";
			gTax.taxType = searchData.taxType;
			gTax.taxDetail = searchData.taxDetail;
			gTax.status = searchData.status;
			gTax.idFcatref = idFcatref;
			gTax.startDate = startDate;
			gTax.endDate = endDate;
			gTax.pageSize = searchData.pageSize;
			gTax.pageId = searchData.pageID;
			gTax.idtxn = "B00";
			gTax.curPage = 1;
			sessionStorage.setItem('searchTaxManager',  JSON.stringify(searchData));
			var args = new Array();
			args.push("1");
			args.push(gTax);
			var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_PAY_TAX_MANAGER'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
			var data = getDataFromGprsCmd(gprsCmd);
			requestMBServiceCorp(data, true, 0, requestSearchSuccess, requestSearchFail);
		}
		
		function requestSearchSuccess(e) {
			var resp = JSON.parse(e);
			if (resp.respCode == '0' && resp.respJsonObj.length > 0) {
				
				gTax.results = resp.respJsonObj;
			//	var xmlData = genResultTable(resp.respJsonObj);
			//	var docXsl = getCachePageXsl("payment_service/create/tax/pay-tax-list-result");
				totalPages = getTotalPages(resp.respJsonObj.length);

			//	genHTMLStringWithXML(xmlData, docXsl, function(html) {
					var tmpNode = document.getElementById('id.search');
					tmpNode.innerHTML = genResultTable(resp.respJsonObj);
					genPagging(totalPages, gTax.curPage);
					//document.getElementById('id.excel').style.display = "";
			//	});

			} else{
				document.getElementById('id.search').innerHTML = "<h5>" + CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST") + "</h5>";
				document.getElementById('pageIndicatorNums').innerHTML = "";
			}	
		}
		
		$scope.resetInput = function () {

			if (gUserInfo.lang == 'EN') {
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                document.getElementById("id.taxType").value = CONST_MNG_TAX_TYPE_VALUE_EN[0];
                document.getElementById("id.taxDetail").value = CONST_MNG_TAX_DETAIL_VALUE_EN[0];
                document.getElementById("id.stt").value = CONST_MNG_TAX_STATUS_DETAIL_VALUE_EN[0];
            }else{
                document.getElementById("id.taxTypemb").value = CONST_MNG_TAX_TYPE_VALUE_EN[0];
                document.getElementById("id.taxDetailmb").value = CONST_MNG_TAX_DETAIL_VALUE_EN[0];
                document.getElementById("id.sttmb").value = CONST_MNG_TAX_STATUS_DETAIL_VALUE_EN[0];
            }
        } else {
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                document.getElementById("id.taxType").value = CONST_MNG_TAX_TYPE_VALUE_VN[0];
                document.getElementById("id.taxDetail").value = CONST_MNG_TAX_DETAIL_VALUE_VN[0];
                document.getElementById("id.stt").value = CONST_MNG_TAX_STATUS_DETAIL_VALUE_VN[0];
            }else{
                document.getElementById("id.taxTypemb").value = CONST_MNG_TAX_TYPE_VALUE_VN[0];
                document.getElementById("id.taxDetailmb").value = CONST_MNG_TAX_DETAIL_VALUE_VN[0];
                document.getElementById("id.sttmb").value = CONST_MNG_TAX_STATUS_DETAIL_VALUE_VN[0];
            }
        };
        if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
            document.getElementById("idFcatref").value = '';
            document.getElementById("id.begindate").value = '';
            document.getElementById("id.mngenddate").value = '';
            document.getElementById("id.begindate").innerHTML = '';
            document.getElementById("id.mngenddate").innerHTML = '';
        }else{
            document.getElementById("idFcatrefmb").value = '';
            document.getElementById("id.begindatemb").value = '';
            document.getElementById("id.mngenddatemb").value = '';
            document.getElementById("id.begindatemb").innerHTML = '';
            document.getElementById("id.mngenddatemb").innerHTML = '';
        }
			
			document.getElementById("id.search").innerHTML = '';
			document.getElementById("pageIndicatorNums").innerHTML = '';
			
			
			searchData.taxDetail = '';
			searchData.status  = '';
	
		}
		
	});
	angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}

//Show loại giao dịch
function showTaxType() {
    var value = (gUserInfo.lang == 'EN') ? CONST_MNG_TAX_TYPE_VALUE_EN : CONST_MNG_TAX_TYPE_VALUE_VN;
    var key = CONST_MNG_TAX_TYPE_KEY;

    var handleSelectTaxType = function(e) {
        if (currentPage == "payment_service/create/tax/pay_tax_manager") {
            document.removeEventListener("evtSelectionDialog", handleSelectTaxType, false);
            if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                var taxType;
                if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                    taxType = document.getElementById('id.taxType');
                }else{
                    taxType = document.getElementById('id.taxTypemb');
                }
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

    var handleSelectTaxTypeClose = function() {
        if (currentPage == "payment_service/create/tax/pay_tax_manager") {
            document.removeEventListener("evtSelectionDialogClose", handleSelectTaxTypeClose, false);
            document.removeEventListener("evtSelectionDialog", handleSelectTaxType, false);
        }
    }

    document.addEventListener("evtSelectionDialog", handleSelectTaxType, false);
    document.addEventListener("evtSelectionDialogClose", handleSelectTaxTypeClose, false);
    showDialogList(CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC'), value, key, false);
}

// Chi tiết loại giao dịch
function showTaxDetail() {
    var value = (gUserInfo.lang == 'EN') ? CONST_MNG_TAX_DETAIL_VALUE_EN : CONST_MNG_TAX_DETAIL_VALUE_VN;
    var key = CONST_MNG_TAX_DETAIL_KEY;

    var handleSelectTaxDetail = function(e) {
        if (currentPage == "payment_service/create/tax/pay_tax_manager") {
            document.removeEventListener("evtSelectionDialog", handleSelectTaxDetail, false);
            if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                var taxDetail;
                if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                    taxDetail = document.getElementById('id.taxDetail');
                }else{
                    taxDetail = document.getElementById('id.taxDetailmb');
                }
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

    var handleSelectTaxDetailClose = function() {
        if (currentPage == "payment_service/create/tax/pay_tax_manager") {
            document.removeEventListener("evtSelectionDialogClose", handleSelectTaxDetailClose, false);
            document.removeEventListener("evtSelectionDialog", handleSelectTaxDetail, false);
        }
    }

    document.addEventListener("evtSelectionDialog", handleSelectTaxDetail, false);
    document.addEventListener("evtSelectionDialogClose", handleSelectTaxDetailClose, false);
    showDialogList(CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC'), value, key, false);
}

// Trạng thái
function showStatus() {
    var value = (gUserInfo.lang == 'EN') ? CONST_MNG_TAX_STATUS_DETAIL_VALUE_EN : CONST_MNG_TAX_STATUS_DETAIL_VALUE_VN;
    var key = CONST_MNG_TAX_STATUS_DETAIL_KEY;

    var handleSelectTaxStatus = function(e) {
        if (currentPage == "payment_service/create/tax/pay_tax_manager") {
            document.removeEventListener("evtSelectionDialog", handleSelectTaxStatus, false);
            if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                var taxStatus;
                if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                    taxStatus = document.getElementById('id.stt');
                }else{
                    taxStatus = document.getElementById('id.sttmb');
                }
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

    var handleSelectTaxStatusClose = function() {
        if (currentPage == "payment_service/create/tax/pay_tax_manager") {
            document.removeEventListener("evtSelectionDialogClose", handleSelectTaxStatusClose, false);
            document.removeEventListener("evtSelectionDialog", handleSelectTaxStatus, false);
        }
    }

    document.addEventListener("evtSelectionDialog", handleSelectTaxStatus, false);
    document.addEventListener("evtSelectionDialogClose", handleSelectTaxStatusClose, false);
    showDialogList(CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC'), value, key, false);
}

function requestSearchFail() {
    console.log("Error request")
}

function genResultTable(inArrAcc) {
	
	var contentItem = '';
	var i = (gTax.curPage - 1) * rowsPerPage;
    var j = i + rowsPerPage;
    for (i; i < j; i++) {
        var inAccObj = inArrAcc[i];
        if (typeof inAccObj !== "undefined") {	
			var contentHTML = '';
			contentHTML += "<table width='96%' align='center' class='recycler-table-ebank desktopview'>";
			contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
			contentHTML += "<td width='6%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_NO') + "</span></td>";
			contentHTML += "<td width='12%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_CREATED_DATE') + "</span></</td>";
			contentHTML += "<td width='16%' class='recycler-row-align-midle'><span>" + CONST_STR.get('CONST_SETUP_QUERY_TIT_TRANS_TYPE_DTL') + "</span></td>";
			contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_STATUS') + "</span></td>";
			contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_AMOUNT') + "</span></td>";
			contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_CHEKER') + "</span></td>";
			contentHTML += "<td width='20%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_TRANS_CODE') + "</span></td>";
			contentHTML += "</tr>";

			contentItem += '<tr class="recycler-row-title recycler-list">';
			contentItem += '<td class="recycler-row-align-midle" ><span>' + (i + 1) + '</span></td>';
			contentItem += '<td class="recycler-row-align-midle" ><span>' + inAccObj.DATMAKE + '</span></td>';
			contentItem += '<td class="recycler-row-align-midle" ><span>' + (CONST_STR.get("CONST_TAX_" + inAccObj.TAX_TYPE)) + '</span></td>';
			contentItem += '<td class="recycler-row-align-midle" ><span>' + (CONST_STR.get("TRANS_STATUS_" + inAccObj.CODSTATUS)) + '</span></td>';
			contentItem += '<td class="recycler-row-align-midle" ><span>' + (formatNumberToCurrency(inAccObj.NUMAMOUNT) + ' VND') + '</span></td>';
			contentItem += '<td class="recycler-row-align-midle" ><span>' + (inAccObj.SIGNEDBY == null || inAccObj.SIGNEDBY == undefined ? "" : inAccObj.SIGNEDBY) + '</span></td>';
			contentItem += '<td class="recycler-row-align-midle" style="word-break: break-all;"><span><a style="cursor:pointer; white-space:pre-wrap;" onclick="showDetailPayTax('
			+ inAccObj.IDFCATREF + ')"'
			+ 'href="javascript:void(0)">' + inAccObj.IDFCATREF + '</a></span></td></tr>';

	    }
    };

    var contentItemmb = '';
    var contentHTMLmb = '';
    contentHTMLmb += "<div align='center' class='recycler-table-ebank  mobileview'>";
    /*for (var k = 0; k < 5; k++) {*/
    var k = (gTax.curPage - 1) * rowsPerPage;
    for (k; k < j; k++) {
        var inAccObj = inArrAcc[k];
        if(inAccObj != undefined){
            contentItemmb += "<table style='margin-bottom:10px;' width='96%'  class='recycler-list'>";
            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_NO') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (k + 1) + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_CREATED_DATE') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.DATMAKE + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('CONST_SETUP_QUERY_TIT_TRANS_TYPE_DTL') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (CONST_STR.get("CONST_TAX_" + inAccObj.TAX_TYPE)) + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_STATUS') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (CONST_STR.get("TRANS_STATUS_" + inAccObj.CODSTATUS)) + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_AMOUNT') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (formatNumberToCurrency(inAccObj.NUMAMOUNT) + ' VND') + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_CHEKER') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (inAccObj.SIGNEDBY == null || inAccObj.SIGNEDBY == undefined ? "" : inAccObj.SIGNEDBY) + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_TRANS_CODE') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right" style="word-break: break-all;"><div class="content-detail"><span><a style="cursor:pointer; white-space:pre-wrap;" onclick="showDetailPayTax('
                +inAccObj.IDFCATREF+')"'
                + 'href="javascript:void(0)">' + inAccObj.IDFCATREF + '</a></span></div></td></tr></table>';
            }
        }


	contentHTML += contentItem + "</tbody></table>";
    contentHTMLmb += contentItemmb + '</div>';
    return contentHTML += contentHTMLmb;
//    return contentHTML ;
}

function showDetailPayTax(args) {
    var jsonData = new Object();
    jsonData.sequence_id = "2";
    jsonData.idFcatref = args;
    jsonData.idtxn = "B00";

    gTax.idFcatref = args;

    var args = new Array();
    args.push("2");
    args.push(jsonData);
    var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_PAY_TAX_MANAGER'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
    var data = getDataFromGprsCmd(gprsCmd);
    requestMBServiceCorp(data, true, 0, showDetailPayTaxSuccess, showDetailPayTaxFail);
}

function showDetailPayTaxSuccess(e) {
    var gprsResp = JSON.parse(e);
    setRespObjStore(gprsResp);
    if (gprsResp.respCode == 0 && gprsResp.respJsonObj.detail.length > 0 && gprsResp.respJsonObj.list.length > 0) {
        var obj = gprsResp.respJsonObj;
        gTax.refTax = obj.detail[0].REF_TAX;
        gTax.taxType = obj.detail[0].LOAI_THUE;
        genReviewScreen(obj);
    } else {
        showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST'));
    };
};

function showDetailPayTaxFail() {

};

function genReviewScreen(obj) {
//	var docXml = createXMLDoc();
  //ma giao dich
	gCredit.transcode = obj.detail[0].MA_GIAO_DICH;
	 // ngay lap
	gCredit.createdate = obj.detail[0].NGAY_LAP;
	// ngay duyet
	gCredit.checkdate = obj.detail[0].NGAY_DUYET;
	//trang thai
	gCredit.comstatus = CONST_STR.get("TRANS_STATUS_" + obj.detail[0].TRANG_THAI);
	//ly do huy
	gCredit.transstatus =obj.detail[0].TRANG_THAI;
	gCredit.denialreason = obj.detail[0].LY_DO;


	//tai khoa chyuen
	gCredit.acclabel = obj.detail[0].TAI_KHOAN_CHUYEN;
	//So du kha dung
	gCredit.surplus = formatNumberToCurrency(obj.detail[0].SO_DU_KHA_DUNG) + ' VND';

	//Ma so thue
	gCredit.taxnumber = obj.detail[0].MA_SO_THUE;
	//Nguoi nop thue
	gCredit.custpaytax = obj.detail[0].NGUOI_NOP_THUE;
	//Dia chi nguoi nop thue
	gCredit.taxaddress = obj.detail[0].DIA_CHI_NGUOI_NOP_THUE;

	gCredit.obj=obj;
	gCredit.GetTaxType = obj.detail[0].LOAI_THUE;
	
    if(obj.detail[0].LOAI_THUE == '01' || obj.detail[0].LOAI_THUE == '02' || obj.detail[0].LOAI_THUE == '05')
    {
	
		gCredit.NameTable=[
			CONST_STR.get('TAX_INFO'), //title
			CONST_STR.get('COM_TAX_TYPE'),
			CONST_STR.get('TAX_TREASURY_NAME'),
			CONST_STR.get('TAX_TREASURY_ACC'),
			CONST_STR.get('TAX_TREASURY_MNG'),
			CONST_STR.get('COM_DECLAR'),
			CONST_STR.get('TAX_MONEY_TYPE'),
			CONST_STR.get('TAX_DECLAR_DATE'),
			CONST_STR.get('TAX_IE_CODE_TYPE'),
		];
						
		//TK thu NSNN
        var treasuryAccNumValue =  obj.detail[0].TK_THU_NSNN ;
        if (treasuryAccNumValue == '7111') {
            treasuryAccNumValue = treasuryAccNumValue + ' - '+ CONST_STR.get('TAX_TREASURY_ACC_NOP_NSNN');
        } else if (treasuryAccNumValue == '3511') {
            treasuryAccNumValue = treasuryAccNumValue + ' - '+ CONST_STR.get('TAX_TREASURY_ACC_TAM_THU');
        } else {
            treasuryAccNumValue = treasuryAccNumValue + ' - '+ CONST_STR.get('TAX_TREASURY_ACC_THU_QUY');
        }
		
		gCredit.DataTable=[
			(obj.detail[0].LOAI_THUE +" - " +CONST_STR.get("CONST_TAX_" + obj.detail[0].LOAI_THUE)),  //Loai Thue
			obj.detail[0].KBNN_THU +" - " + obj.detail[0].TEN_KB_NN_THU, //KBNN thu
			treasuryAccNumValue,
			obj.detail[0].MA_CQ_QL_THU +' - '+ obj.detail[0].CQ_QL_THU, //CQ QL Thu
			obj.detail[0].SO_TO_KHAI, //so to khai
			obj.detail[0].LOAI_TIEN_HAI_QUAN +' - '+ CONST_STR.get('K_TAX_HQ_' + obj.detail[0].LOAI_TIEN_HAI_QUAN), //loai tien
			obj.detail[0].NGAY_DANG_KY_TO_KHAI, // ngay dang ky to khai
			obj.detail[0].MA_LOAI_HINH_XNK +' - '+  obj.detail[0].TEN_LH //ma loai xuat nhap khau
		];
	
		//Bảng
		// gCredit.TableAcc=[
			// CONST_STR.get('COM_NO'),
			// CONST_STR.get('TAX_CHAPTER'),
			// CONST_STR.get('TAX_CONTENT'),
			// CONST_STR.get('COM_AMOUNT'),
			// CONST_STR.get('TAX_PERIODIC'),
		// ];

        // for (var i in obj.list) {
            // var  economyContent = obj.list[i].NOI_DUNG_KINH_TE;
            // if(economyContent ==''||economyContent ==null || typeof economyContent == 'undefined' )
                // economyContent = obj.list[i].MA_NOI_DUNG_KINH_TE;

			// gCredit.TableAcc1= [
				// (parseInt(i) + 1),
				// obj.list[i].CHUONG,
				// economyContent,
				// (formatNumberToCurrency(obj.list[i].SO_TIEN) + ' VND'),
				// obj.detail[0].LOAI_THUE
			// ];
		// }
		
    }

    if(obj.detail[0].LOAI_THUE == '06')
    {
		gCredit.NameTable=[
			CONST_STR.get('TAX_INFO_REVENUE'), //title
			CONST_STR.get('COM_TAX_TYPE'),
			CONST_STR.get('TAX_BANK_BENEFICIARY_CODE'),
			CONST_STR.get('TAX_BANK_BENEFICIARY_NAME'),
			CONST_STR.get('TAX_ACCOUNT_BENEFICIARY'),
			CONST_STR.get('TAX_ACCOUNT_BENEFICIARY_NAME'),
			CONST_STR.get('TAX_EXCHANGERATES_CODE'),
			CONST_STR.get('TAX_EXCHANGERATES_VALUE'),
			CONST_STR.get('TAX_EXCHANGE_SUM'),
		];
		gCredit.DataTable=[
			(obj.detail[0].LOAI_THUE +" - " +CONST_STR.get("CONST_TAX_" + obj.detail[0].LOAI_THUE)),
			obj.detail[0].MA_NH_NHAN,
			obj.detail[0].TEN_NH_THU_HUONG,
			obj.detail[0].TK_THU_HUONG,
			obj.detail[0].TEN_TK_THU_HUONG,
			obj.detail[0].MA_NGUYEN_TE,
			obj.detail[0].TY_GIA,
			formatNumberToCurrency( obj.detail[0].TONG_TIEN_NGUYEN_TE)
		];

        //Bảng
		// gCredit.TableAcc=[
			// CONST_STR.get('COM_NO'),
			// CONST_STR.get('TAX_CONTENT'),
			// CONST_STR.get('TAX_CONTENT_TITLE'),
			// CONST_STR.get('TAX_CURRENCY_MONEY'),
			// CONST_STR.get('TAX_CURRENCY_MONEY_LOCAL'),
			// CONST_STR.get('TAX_CURRENCY_NOTE')
		// ];
		
        // var sttNo = 0;
        // for (var i in obj.list) {
            // sttNo = sttNo + 1;
			
			// gCredit.TableAcc1=[
				// sttNo,
				// obj.list[i].MA_NOI_DUNG_KINH_TE,
				// obj.list[i].NOI_DUNG_KINH_TE,
				// formatNumberToCurrency(obj.list[i].SO_TIEN_NGUYEN_TE),
				// formatNumberToCurrency(obj.list[i].SO_TIEN),
				// obj.list[i].GHICHU
			// ];
			
        // }
    }

    if(obj.detail[0].LOAI_THUE == '01')
    {
		gCredit.TaxTreasuryCode=obj.detail[0].TEN_KHO_BAC;
    }
	
	gCredit.TotalPayMoney=formatNumberToCurrency(obj.detail[0].SO_TIEN_THANH_TOAN) + ' VND';
	//Phi giao dich
	gCredit.TaxFee=formatNumberToCurrency(obj.detail[0].PHI_GIAO_DICH) + ' VND';
	//Noi dung
	gCredit.TaxDescription=obj.detail[0].NOI_DUNG;
    //Luu ma so thue
    var isSave = (obj.detail[0].ISSAVE == '1') ? CONST_STR.get("TAX_SAVE_CODE") : CONST_STR.get("TAX_NO_SAVE_CODE");
	gCredit.TaxSaveTax=isSave;
    //SEND METHOD
	gCredit.SendMSGApprover=CONST_STR.get("COM_NOTIFY_" + obj.detail[0].SEND_METHOD);

    //luu xml trong cache
    // if (obj.detail[0].TRANG_THAI == 'ABH') {
        // createXMLNode('print', '', docXml, tmpXmlRootNode);
    // } else if (obj.detail[0].TRANG_THAI == 'INT') {
        // createXMLNode('cancel', '', docXml, tmpXmlRootNode);
    // };

    // setRespObjStore(obj);
    // setReviewXmlStore(docXml);

    //navCachedPages["payment_service/create/tax/pay-tax-list-detail-scr"] = null;
    navController.pushToView("payment_service/create/tax/pay-tax-list-detail-scr", true, 'html');

}

function getTotalPages(totalRows) {
    return totalRows % rowsPerPage == 0 ? Math.floor(totalRows / rowsPerPage) : Math.floor(totalRows / rowsPerPage) + 1;
}

function pageIndicatorSelected(selectedIdx, selectedPage) {
    gTax.curPage = selectedIdx;

    var tmpNode = document.getElementById('id.search');
    tmpNode.innerHTML = genResultTable(gTax.results);
    genPagging(totalPages, gTax.curPage);

}

function genPagging(totalPages, pageIdx) {
    var nodepage = document.getElementById('pageIndicatorNums');
    var tmpStr = genPageIndicatorHtml(totalPages, pageIdx);
    nodepage.innerHTML = tmpStr;
}


function calculateDifferentMonth(valFromDate, valToDate) {
    var from = valFromDate.split("/");
    var to = valToDate.split("/");
    var fromDate = new Date(parseInt(from[2], 10), parseInt(from[1], 10) - 1, parseInt(from[0], 10));
    var toDate = new Date(parseInt(to[2], 10), parseInt(to[1], 10) - 1, parseInt(to[0], 10));

    if (fromDate > toDate) {
        return true;
    }
    return false;
}

function sendRequestExportExcel() {
    var taxDtl;
    var idFcatref;
    var startDate; 
    var endDate;
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        taxDtl = document.getElementById("id.taxDetail").value;
        idFcatref = document.getElementById("idFcatref").value;
        startDate = document.getElementById("id.begindate").value;
        endDate = document.getElementById("id.mngenddate").value;
    }else{
        taxDtl = document.getElementById("id.taxDetailmb").value;
        idFcatref = document.getElementById("idFcatrefmb").value;
        startDate = document.getElementById("id.begindatemb").value;
        endDate = document.getElementById("id.mngenddatemb").value;
    }
    searchData.startDate = startDate;
    searchData.endDate = endDate;
    searchData.idFcatref = idFcatref;

    gTax.sequenceId = "13";
    gTax.taxType = searchData.taxType;
    gTax.taxDetail = searchData.taxDetail;
    gTax.status = searchData.status;
    gTax.idFcatref = idFcatref;
    gTax.startDate = startDate;
    gTax.endDate = endDate;
    gTax.idtxn = "B00";

    var arrayClientInfo = new Array();
    arrayClientInfo.push(2);
    arrayClientInfo.push(gTax);

    var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_EXPORT_EXCEL_REPORT"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);
    data = getDataFromGprsCmd(gprsCmd);
    corpExportExcel(data);
}