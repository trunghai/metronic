
var sequenceId;

gCredit.rowsPerPage = 10;
flagCreGuarantee = true;
/*** INIT VIEW ***/
function loadInitXML() {
	logInfo('Search guarantee init');
}

/*** VIEW BACK FROM OTHER ***/

function viewBackFromOther() {
	logInfo('Back search debt');
	flagCreGuarantee = false;
}

/*** VIEW LOAD SUCCESS ***/
function viewDidLoadSuccess() {	
	// resizeMainViewContent();
	init();
	logInfo('Search guarantee load success');
	// Load for datetime picker
	// createDatePicker('trans.releaseStartdate', 'span.releaseStartdate');
	// createDatePicker('trans.releaseEnddate', 'span.releaseEnddate');
	// createDatePicker('trans.deadlineStartdate', 'span.deadlineStartdate');
	// createDatePicker('trans.deadlineEnddate', 'span.deadlineEnddate');
	//reload
	if (flagCreGuarantee) {
		document.getElementById('tblContent').innerHTML = "";
		document.getElementById('trans.releaseStartdate').value = "";
		document.getElementById('trans.releaseStartdatemb').value = "";
		document.getElementById('trans.deadlineStartdate').value = "";
		document.getElementById('trans.deadlineStartdatemb').value = "";
		document.getElementById('trans.releaseEnddate').value = "";
		document.getElementById('trans.releaseEnddatemb').value = "";
		document.getElementById('trans.deadlineEnddate').value = "";
		document.getElementById('trans.deadlineEnddatemb').value = "";
		document.getElementById('cre_type_guarantee').value = CONST_STR.get('COM_ALL');
		document.getElementById('cre_type_guaranteemb').value = CONST_STR.get('COM_ALL');
		document.getElementById('cre_type_money').value = (gUserInfo.lang == 'EN')? CONST_TYPE_MONEY_EN[0] : CONST_TYPE_MONEY_VN[0];
		document.getElementById('cre_type_moneymb').value = (gUserInfo.lang == 'EN')? CONST_TYPE_MONEY_EN[0] : CONST_TYPE_MONEY_VN[0];

	}
	COST_TYPE_GUARANTEE = [CONST_STR.get('COM_ALL'),
	                       CONST_STR.get('GUA_GROUP_LOAD'),
	                       CONST_STR.get('GUA_GROUP_CONTRACT'),
	                       CONST_STR.get('GUA_GROUP_PAYMENT'),
	                       CONST_STR.get('GUA_GROUP_CONSIGNEE'),
	                       CONST_STR.get('GUA_GROUP_BID'),
	                       CONST_STR.get('GUA_GROUP_AD_PAYMENT'),
	                       CONST_STR.get('GUA_GROUP_OTHER')];
	COST_TYPE_GUARANTEE_VALUE = ['BLVV,BLVD,BLTH,BLHD,BLTT,BLTD,SG00,SGUT,BLDT,BLDD,BLTU,BLKH,BLKD',
	                             'BLVV,BLVD', 
	                             'BLTH,BLHD', 
	                             'BLTT,BLTD', 
	                             'SG00,SGUT', 
	                             'BLDT,BLDD', 
	                             'BLTU', 
	                             'BLKH,BLKD'];
	
}

/*** VIEW WILL UNLOAD ***/
function viewWillUnload() {
	logInfo('Search guarantee will unload');
}

function init(){
	angular.module('EbankApp').controller('cre_guarantee_info', function ($scope, requestMBServiceCorp) {
		// Thực hiện tìm kiếm
$scope.creGuaranteeSearchInfo = function(){
	var msgValidate = new Array();
	
	// Ngay nhan no[tu ngay]
	if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
		if(!guaCheckFormatDate(document.getElementById("trans.releaseStartdate").value)){
			msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
		}
	}else{
		if(!guaCheckFormatDate(document.getElementById("trans.releaseStartdatemb").value)){
			msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
		}
	}
	
	// Ngay nhan no[den ngay]
	if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
		if(!guaCheckFormatDate(document.getElementById("trans.releaseEnddate").value)){
			msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
		}
	}else{
		if(!guaCheckFormatDate(document.getElementById("trans.releaseEnddatemb").value)){
			msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
		}
	}
	
	
	var fromDate; 
	var endDate; 
	if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
		fromDate = document.getElementById("trans.releaseStartdate").value;
		endDate = document.getElementById("trans.releaseEnddate").value;
	}else{
		fromDate = document.getElementById("trans.releaseStartdatemb").value;
		endDate = document.getElementById("trans.releaseEnddatemb").value;
	}
	var diffDays = getDiffDaysBetween(fromDate, endDate, "dd/MM/yyyy");
	if (diffDays < 0) {
		msgValidate.push(CONST_STR.get("ACC_HIS_INVALID_QUERY_DATE"));
	}
	
	// Ngay dao han[tu ngay]
	if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
		if(!guaCheckFormatDate(document.getElementById("trans.deadlineStartdate").value)){
			msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
		}
	}else{
		if(!guaCheckFormatDate(document.getElementById("trans.deadlineStartdatemb").value)){
			msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
		}
	}
	
	// Ngay dao han[den ngay]
	if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
		if(!guaCheckFormatDate(document.getElementById("trans.deadlineEnddate").value)){
			msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
		}
	}else{
		if(!guaCheckFormatDate(document.getElementById("trans.deadlineEnddatemb").value)){
			msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
		}
	}
	
	if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
		fromDate = document.getElementById("trans.deadlineStartdate").value;
		endDate = document.getElementById("trans.deadlineEnddate").value;
	}else{
		fromDate = document.getElementById("trans.deadlineStartdatemb").value;
		endDate = document.getElementById("trans.deadlineEnddatemb").value;
	}
	diffDays = getDiffDaysBetween(fromDate, endDate, "dd/MM/yyyy");
	if (diffDays < 0) {
		msgValidate.push(CONST_STR.get("ACC_HIS_INVALID_QUERY_DATE"));
	}
	
	if(msgValidate.length > 0){
		showAlertText(msgValidate[0]);
	}else{
		// Set dữ liệu trước khi gọi service
		var argsArray = [];
		argsArray.push("2");
		if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
			argsArray.push(JSON.stringify({
				idtxn: "C01",
				releaseStartDate : (document.getElementById('trans.releaseStartdate').value == 'dd/mm/yyyy') ? '' : document.getElementById('trans.releaseStartdate').value,
				releaseEndDate : (document.getElementById('trans.releaseEnddate').value == 'dd/mm/yyyy') ? '' : document.getElementById('trans.releaseEnddate').value,
				deadlineStartDate : (document.getElementById('trans.deadlineStartdate').value == 'dd/mm/yyyy') ? '' : document.getElementById('trans.deadlineStartdate').value,
				deadlineEndDate : (document.getElementById('trans.deadlineEnddate').value == 'dd/mm/yyyy') ? '' : document.getElementById('trans.deadlineEnddate').value,
				typeMoney : document.getElementById('cre_type_money_value').value,
				typeGuarantee : document.getElementById('cre_type_guarantee_value').value
	    	}));
		}else{
			argsArray.push(JSON.stringify({
				idtxn: "C01",
				releaseStartDate : (document.getElementById('trans.releaseStartdatemb').value == 'dd/mm/yyyy') ? '' : document.getElementById('trans.releaseStartdatemb').value,
				releaseEndDate : (document.getElementById('trans.releaseEnddatemb').value == 'dd/mm/yyyy') ? '' : document.getElementById('trans.releaseEnddatemb').value,
				deadlineStartDate : (document.getElementById('trans.deadlineStartdatemb').value == 'dd/mm/yyyy') ? '' : document.getElementById('trans.deadlineStartdatemb').value,
				deadlineEndDate : (document.getElementById('trans.deadlineEnddatemb').value == 'dd/mm/yyyy') ? '' : document.getElementById('trans.deadlineEnddatemb').value,
				typeMoney : document.getElementById('cre_type_money_valuemb').value,
				typeGuarantee : document.getElementById('cre_type_guarantee_valuemb').value
	    	}));
		}
		
		
		var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_CREDIT_GUARANTEE_INFO"), "", "", gUserInfo.lang, gUserInfo.sessionID, argsArray);
	    data = getDataFromGprsCmd(gprsCmd);
	    
	    // gọi service và xử lí logic
	    requestMBServiceCorp.post(data, true, 
	    	function(data) {
	        var response = data;
	        if (response.respCode == RESP.get('COM_SUCCESS') 
	        		&& response.responseType == CONSTANTS.get('CMD_CO_CREDIT_GUARANTEE_INFO')) {
	        	// mainContentScroll.refresh();
	    		
	        	gCredit.results = response.respJsonObj.resultSearch;
	        	if(gCredit.results.length == 0){
	        		if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
	        			document.getElementById("tblContent").innerHTML = CONST_STR.get('CORP_MSG_COM_NO_DATA_FOUND');
	        			document.getElementById("tblContent").style.color = '#333';
	        		}else{
	        			document.getElementById("tblContent").innerHTML = CONST_STR.get('CORP_MSG_COM_NO_DATA_FOUND');
	        			document.getElementById("tblContent").style.color = '#FFF';
	        		}
	        		
	        		document.getElementById("pageIndicatorNums").innerHTML = '';
	        	}else{
	        		gCredit.totalPages = getTotalPages(response.respJsonObj.resultSearch.length);
	            	var dataPerPage = [];
	            	for (var i = 0; i < gCredit.rowsPerPage; i++) {
	            		var dataRow = gCredit.results[i];
	            		if (typeof dataRow != "undefined") {
	            			for(var j = 1; j < COST_TYPE_GUARANTEE_VALUE.length; j++){
	            				if(COST_TYPE_GUARANTEE_VALUE[j].indexOf(dataRow.GUARANTEE_TYPE) != -1){
	            					dataRow.GUARANTEE_TYPE = COST_TYPE_GUARANTEE[j];
	            				}
		            		}
	            			
	            			dataPerPage.push(dataRow);
	            		}
	            	}
	        		
	            	navCachedPages["credit/guarantee/cre_guarantee_info_tbl"] = null;
	        		// getDataTblToDiv(dataPerPage, "credit/create/guarantee/cre_guarantee_info_tbl", "tblContent");
	        		document.getElementById('tblContent').innerHTML = genHtmlDoc(dataPerPage);
	        		genPagging(gCredit.totalPages, 1);
	        	}
	    	}else{
	    		if(gprsResp.respCode == '1019'){
	    			showAlertText(gprsResp.respContent);
	    		}else{
	    			showAlertText(CONST_STR.get('ERR_COM_TRANS_FAILED'));
	    		}
	    		var tmpPageName = navController.getDefaultPage();
	    		var tmpPageType = navController.getDefaultPageType();
	    		navController.pushToView(tmpPageName, true, tmpPageType);
	    	}
	    });
	}
}


		/*** Start Liên quan item chọn loại bảo lãnh***/
$scope.showTypeGuarantee = function(){
	var tmpArray1 = COST_TYPE_GUARANTEE;
	var tmpArray2 = COST_TYPE_GUARANTEE_VALUE;
	document.addEventListener("evtSelectionDialog", handleInputTypeGuarantee, false);
	document.addEventListener("evtSelectionDialogClose", handleInputTypeGuaranteeClose, false);
	showDialogList(CONST_STR.get('CRE_TYPE_GUA_POPUP_TITLE'), tmpArray1, tmpArray2, false);
}

function handleInputTypeGuarantee(e) {
	if (currentPage == "credit/guarantee/cre_guarantee_info") {
		document.removeEventListener("evtSelectionDialog", handleInputTypeGuarantee, false);
		
		if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
			if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
				document.getElementById('cre_type_guarantee').value = e.selectedValue1;
				document.getElementById('cre_type_guarantee_value').value = e.selectedValue2;
			}else{
				document.getElementById('cre_type_guaranteemb').value = e.selectedValue1;
				document.getElementById('cre_type_guarantee_valuemb').value = e.selectedValue2;
			}
		}
	}
}

function handleInputTypeGuaranteeClose() {
	if (currentPage == "credit/guarantee/cre_guarantee_info") {
		document.removeEventListener("evtSelectionDialogClose", handleInputTypeGuaranteeClose, false);
		document.removeEventListener("evtSelectionDialog", handleInputTypeGuarantee, false);
	}
}
/*** End Liên quan item chọn loại bảo lãnh***/

/*** Start Liên quan item chọn loại tiền***/
$scope.showTypeMoney = function(){
	var tmpArray1 = (gUserInfo.lang == 'EN')? CONST_TYPE_MONEY_EN: CONST_TYPE_MONEY_VN;
	var tmpArray2 = CONST_TYPE_MONEY_VALUE;
	document.addEventListener("evtSelectionDialog", handleInputTypeMoney, false);
	document.addEventListener("evtSelectionDialogClose", handleInputTypeMoneyClose, false);
	showDialogList(CONST_STR.get('CRE_TYPE_MONEY_POPUP_TITLE'), tmpArray1, tmpArray2, false);
}

function handleInputTypeMoney(e) {
	if (currentPage == "credit/guarantee/cre_guarantee_info") {
		document.removeEventListener("evtSelectionDialog", handleInputTypeMoney, false);
		
		if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
			if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
				document.getElementById('cre_type_money').value = e.selectedValue1;
				document.getElementById('cre_type_money_value').value = e.selectedValue2;
			}else{
				document.getElementById('cre_type_moneymb').value = e.selectedValue1;
				document.getElementById('cre_type_money_valuemb').value = e.selectedValue2;
			}
		}
	}
}

function handleInputTypeMoneyClose() {
	if (currentPage == "credit/guarantee/cre_guarantee_info") {
		document.removeEventListener("evtSelectionDialogClose", handleInputTypeMoneyClose, false);
		document.removeEventListener("evtSelectionDialog", handleInputTypeMoney, false);
	}
}
/*** End Liên quan item chọn loại tiền***/
$scope.creGuaranteeSearchInfo();
	});
	angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}


function getTotalPages(totalRows) {
	return totalRows % gCredit.rowsPerPage == 0 ? Math.floor(totalRows / gCredit.rowsPerPage) : Math.floor(totalRows / gCredit.rowsPerPage) + 1;
}

function genPagging(totalPages, pageIdx) {
	var nodepage = document.getElementById('pageIndicatorNums');
	var tmpStr = genPageIndicatorHtml(totalPages, pageIdx); //Tong so trang - trang hien tai
	nodepage.innerHTML = tmpStr;
}

function pageIndicatorSelected(selectedIdx, selectedPage) { 
	document.getElementById('tblContent').innerHTML = "";
	document.getElementById('pageIndicatorNums').innerHTML = "";
	var dataPerPage = [];
	var tmp = (selectedIdx - 1) * gCredit.rowsPerPage;
	for (var i = tmp; i < tmp + gCredit.rowsPerPage; i++) {
		var dataRow = gCredit.results[i];
		if (typeof dataRow != "undefined") {
			for(var j = 1; j < COST_TYPE_GUARANTEE_VALUE.length; j++){
				if(COST_TYPE_GUARANTEE_VALUE[j].indexOf(dataRow.GUARANTEE_TYPE) != -1){
					dataRow.GUARANTEE_TYPE = COST_TYPE_GUARANTEE[j];
				}
    		}
			
			dataPerPage.push(dataRow);
		}
	}
	
	navCachedPages["credit/guarantee/cre_guarantee_info_tbl"] = null;
	// getDataTblToDiv(dataPerPage, "credit/guarantee/cre_guarantee_info_tbl", "tblContent", tmp);
	document.getElementById('tblContent').innerHTML = genHtmlDoc(dataPerPage);	
	genPagging(gCredit.totalPages, selectedIdx);
}

//check format tai cac truong nhap thoi gian
function guaCheckFormatDate(dataCheck){
	var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
	if(dataCheck == '' || dataCheck == 'dd/mm/yyyy'){
		return true;
	}else{
		if(!dataCheck.match(re)){
			return false;
		}else{
			return true;
		}
	}
}

// Thực hiện chuyển sang màn hình detail
function detailGuarantee (guarantee_no, guarantee_type, guarantee_amount, guarantee_receiver, 
		release_date, deadline_date, seri_no, status, guarantee_content){
	// Chuyen du lieu vao bien toan cuc
	gCredit.guaranteeNo = guarantee_no;
	gCredit.guaranteeType = guarantee_type;
	gCredit.guaranteeAmount = guarantee_amount;
	gCredit.guaranteeReceiver = guarantee_receiver;
	gCredit.releaseDate = release_date;
	gCredit.deadlineDate = deadline_date;
	gCredit.seriNo = seri_no;
	gCredit.status = status;
	gCredit.guaranteeContent = guarantee_content;
	
	// goto screen
	updateAccountListInfo(); 
	navController.pushToView('credit/guarantee/cre_guarantee_info_dtl', true, 'html');
}
function genHtmlDoc(inArrAcc) {
    var length = inArrAcc.length;
    var contentItem = '';
    for (var i = 0; i < length; i++) {
        var inAccObj = inArrAcc[i];
        var guaranteeNo = "'" + inAccObj.GUARANTEE_NO + "'";
        var guaranteeType = "'" + inAccObj.GUARANTEE_TYPE + "'";
        var guaranteeAmount = "'" + inAccObj.GUARANTEE_AMOUNT + "'";
        var guaranteeReceiver = "'" + inAccObj.GUARANTEE_RECEIVER + "'";
        var releaseDate = "'" + inAccObj.RELEASE_DATE + "'";
        var deadlineDate = "'" + inAccObj.DEADLINE_DATE + "'";
        var seriNo = "'" + inAccObj.SERI_NO + "'";
        var status = "'" + inAccObj.STATUS + "'";
        var guaranteeContent = "'" + inAccObj.GUARANTEE_CONTENT + "'";
        // title
    var contentHTML = '';
	    contentHTML += "<table width='96%' align='center' class='recycler-table-ebank desktopview'>";
		contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
		contentHTML += "<td width='7%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_NO') + "</span></td>";
		contentHTML += "<td class='recycler-row-align-midle'><span>" + CONST_STR.get('CRE_TYPE_GUARANTEE') + "</span></td>";
		contentHTML += "<td class='recycler-row-align-midle'><span>" + CONST_STR.get('CRE_ITEM_GUARANTEE_GUA_RECEIVER') + "</span></td>";
		contentHTML += "<td class='recycler-row-align-midle'><span>" + CONST_STR.get('CRE_ITEM_GUARANTEE_GUA_AMOUNT') + "</span></td>";
		contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_EXPIRE_DATE') + "</span></td>";
		contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_DEADLINE_DATE') + "</span></td>";
		contentHTML += "<td class='recycler-row-align-midle'><span>" + CONST_STR.get('CRE_ITEM_GUARANTEE_GUA_NO')  + "</span></td>";
		contentHTML += "</tr>";
	    // value
        contentItem += '<tr class="recycler-row-title recycler-list">';
        contentItem += '<td class="recycler-row-align-midle"><span">' + (i + 1) + '</span></td>';
        contentItem += '<td class="recycler-row-align-midle"><span">' + inAccObj.GUARANTEE_TYPE + '</span></td>';
        contentItem += '<td class="recycler-row-align-midle"><span">' + inAccObj.GUARANTEE_RECEIVER + '</span></td>';
        contentItem += '<td class="recycler-row-align-midle"><span">' + inAccObj.GUARANTEE_AMOUNT + '</span></td>';
        contentItem += '<td class="recycler-row-align-midle"><span">' + inAccObj.DEADLINE_DATE + '</span></td>';
        contentItem += '<td class="recycler-row-align-midle"><span">' + inAccObj.RELEASE_DATE + '</span></td>';
        contentItem += '<td class="recycler-row-align-midle"><div class="content-detail"><span><a class="ref-link" onclick="detailGuarantee('
        + guaranteeNo + ',' + guaranteeType + ',' + guaranteeAmount + ',' + guaranteeReceiver + ','
        + releaseDate + ',' + deadlineDate + ',' + seriNo + ',' + status + ',' + guaranteeContent + ')"'
        + 'href="javascript:void(0)">' + inAccObj.GUARANTEE_NO + '</a></span></div></td></tr>';

    }

    var contentItemmb = '';
    var contentHTMLmb = '';
    contentHTMLmb += "<div align='center' class='recycler-table-ebank  mobileview'>";
    for (var j = 0; j < 5; j++) {
        var inAccObj = inArrAcc[j];
        if (inAccObj != undefined) {
        	contentItemmb += "<table style='margin-bottom:10px;' width='96%'  class='recycler-list'>";
	        contentItemmb += '<tr class="recycler-row-normal">';
	        contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_NO') + '</span></td>';
	        contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (j + 1) + '</span></td></tr>';

	        contentItemmb += '<tr class="recycler-row-normal">';
	        contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('CRE_TYPE_GUARANTEE') + '</span></td>';
	        contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.GUARANTEE_TYPE + '</span></td></tr>';

	        contentItemmb += '<tr class="recycler-row-normal">';
	        contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('CRE_ITEM_GUARANTEE_GUA_RECEIVER') + '</span></td>';
	        contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.GUARANTEE_RECEIVER + '</span></td></tr>';

	        contentItemmb += '<tr class="recycler-row-normal">';
	        contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('CRE_ITEM_GUARANTEE_GUA_AMOUNT') + '</span></td>';
	        contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.GUARANTEE_AMOUNT + '</span></td></tr>';

	        contentItemmb += '<tr class="recycler-row-normal">';
	        contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_EXPIRE_DATE') + '</span></td>';
	        contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.DEADLINE_DATE + '</span></td></tr>';

	        contentItemmb += '<tr class="recycler-row-normal">';
	        contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_DEADLINE_DATE') + '</span></td>';
	        contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.RELEASE_DATE + '</span></td></tr>';

	        contentItemmb += '<tr class="recycler-row-normal">';
	        contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('CRE_ITEM_GUARANTEE_GUA_NO') + '</span></td>';
	        contentItemmb += '<td class="recycler-row-align-midle-right" style="word-break: break-all;"><div class="content-detail"><span><a style="cursor:pointer; white-space:pre-wrap;" onclick="detailGuarantee('
	                    + guaranteeNo + ',' + guaranteeType + ',' + guaranteeAmount + ',' + guaranteeReceiver + ','
	        			+ releaseDate + ',' + deadlineDate + ',' + seriNo + ',' + status + ',' + guaranteeContent + ')"'
	                    + 'href="javascript:void(0)">' + inAccObj.GUARANTEE_NO + '</a></span></div></td></tr></table>';
        }
        
        }

    contentHTML += contentItem + "</tbody></table>";
    contentHTMLmb += contentItemmb + '</div>';
    return contentHTML += contentHTMLmb;

}
