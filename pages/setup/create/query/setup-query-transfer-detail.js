/**
 * Created by HaiNM *
 **/
 
gSetUp.idtxn = "S03";

var xmlStored;
var respStored;
var gprsCmdStored = {};
var contentHTML = '';

function loadInitXML() {
	xmlStored = getReviewXmlStore();
	return xmlStored;
}

function viewDidLoadSuccess() {
	init();
}

function init() {
    angular.module('EbankApp').controller('query-transfer-detail', function ($scope) {
       navController.getBottomBar().hide();
        $scope.infoCredit = gCredit;
        $scope.showElement = true;
        $scope.showTransCancel = true;
        if(gCredit.transaction.TRANG_THAI != 'INT')
        {
            $scope.showTransCancel = false;
        }
        if(gUserInfo.userRole.indexOf('CorpInput') == -1 || CONST_BROWSER_MODE == false) {
            $scope.showElement =false;
            $scope.showTransCancel = false;
        }
		
        setTimeout(function () {
            changeLanguageInView();
        }, 200);
		
		// var btnNext = document.getElementById('btnNext');
		// btnNext.style.display = "none";


		// if (gCredit.LOAI_GD == "S14") {
			// if (gTrans.transInfo.A5 == 'INT' && gUserInfo.userRole.indexOf('CorpInput') != -1)
			  // btnNext.style.display = "";
		// }

		// if (gCredit.LOAI_GD == 'S15') {
			// if (gCredit.TRANG_THAI == 'INT' && gUserInfo.userRole.indexOf('CorpInput') != -1)
			  // btnNext.style.display = "";
		// }
		var transaction=gCredit.transaction;
		var tmpNode = document.getElementById('id.table');
		if (gCredit.LOAI_GD=="S11"){
			tmpNode.innerHTML = genDetailChangeInfo(transaction);
		}
		else if (gCredit.LOAI_GD=="S12"){
			tmpNode.innerHTML = genDetailChangePassword(transaction);
		}
		else if (gCredit.LOAI_GD=="S13"){
			tmpNode.innerHTML = genDetailChangeSendMethod(transaction);
		}
		else if (gCredit.LOAI_GD=="S14"){
			tmpNode.innerHTML = genDetailChangeAuthMethod(transaction);
		}
		else if (gCredit.LOAI_GD=="S15"){
			var limit=gCredit.limit;
			tmpNode.innerHTML = genDetailChangeTransLimit(transaction,limit);
		}

		$scope.btnBackClick = function () {
			navCachedPages['setup/create/query/setup-query-transfer-src'] = null;
			navController.popView(true);
		}
		$scope.onCancelClick = function () {

			if (gCredit.LOAI_GD == 'S15') {
				navCachedPages['setup/create/query/setup-query-transfer-authen'] = null;
				navController.pushToView("setup/create/query/setup-query-transfer-authen", true,'html'); 
			}	
		}
		

    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}
			
function AllTable(transaction){
	var DataAllTable=[
		CONST_STR.get('CONST_SETUP_QUERY_TIT_TRANS_TYPE_DTL'),
		CONST_STR.get('COM_IDTXN_' + transaction.LOAI_GD),
		CONST_STR.get('COM_TRANS_CODE'), 
		transaction.MA_GD,
		CONST_STR.get('COM_CREATED_DATE'),
		transaction.NGAY_THUC_HIEN,
		CONST_STR.get('COM_CHECK_DATE'),
		transaction.NGAY_DUYET,
		CONST_STR.get('COM_STATUS'), 
		CONST_STR.get("TRANS_STATUS_" + transaction.TRANG_THAI),
	]
	/*table 1*/
	contentHTML += "<tr><td colspan='2'><div align='center'><div id='recycler_list' class='recycler-list'>"
	contentHTML += "<table id='recycler_table_ebank' class='recycler-table-ebank'><tbody>";
	for (i = 0; i < 10; i = i + 2) {
		contentHTML += "<tr class='recycler-row-normal'><td class='recycler-row-align-midle-left'><span>"+ DataAllTable[i] +"</span></td>";
		contentHTML += "<td class='recycler-row-align-midle-right'><span>" + DataAllTable[i+1] + "</span></td></tr>";
	}
	
	if (gCredit.LOAI_GD=="S14" || gCredit.LOAI_GD=="S15"){
		if (transaction.TRANG_THAI == "REJ" && transaction.LY_DO_TU_CHOI && transaction.LY_DO_TU_CHOI != null && transaction.LY_DO_TU_CHOI.trim() != ""){
			contentHTML += "<tr class='recycler-row-normal'><td class='recycler-row-align-midle-left'><span>"+ CONST_STR.get('AUTHORIZE_TXT_REASON') +"</span></td>";
			contentHTML += "<td class='recycler-row-align-midle-right'><span>" + transaction.LY_DO_TU_CHOI + "</span></td></tr>";
		}		
	}

	contentHTML += "</tbody></table></div></div></td></tr>";

}	

function genDetailChangeInfo(transaction){
	var DataTable=[
		CONST_STR.get('INTRODUCE_INFO_NAME'),
		transaction.HO_TEN,
		CONST_STR.get('COM_SHORT_NAME'),
		transaction.TEN_NGAN,
		CONST_STR.get('INTRODUCE_INFO_ID'),
		transaction.CMND_HO_CHIEU,
		CONST_STR.get('DATEOFISSUE_TITLE_BGN'),
		transaction.NGAY_CAP,
		CONST_STR.get('POSITION_TITLE_BGN'),
		transaction.VI_TRI_CU,
		CONST_STR.get('EMAIL_TITLE'),
		transaction.EMAIL_CU,
		CONST_STR.get('SET_USER_PHONE_NUMBER'),
		transaction.SDT_CU
	];
			
		contentHTML += "<table width='100%'><tbody>"
		/*table 1*/
		AllTable(transaction);
		/*table 2*/
		contentHTML += "<tr><td colspan='2'><h5 class='header-title'><span>"+ CONST_STR.get('SET_USER_ITLE_GET_USER_INFO') +"</span></h5></td></tr>";
		contentHTML += "<tr><td colspan='2'><div align='center'><div class='recycler-list'><table class='recycler-table-ebank'><tbody>";
		for (i = 0; i < 14; i = i + 2) {
			contentHTML += "<tr class='recycler-row-normal'><td class='recycler-row-align-midle-left'><span>"+ DataTable[i] +"</span></td>";
			contentHTML += "<td class='recycler-row-align-midle-right'><span>" + DataTable[i+1] + "</span></td></tr>";
		}
		contentHTML += "</tbody></table></div></div></td></tr>";
		
		/*table 3*/
		if (transaction.VI_TRI_CU != transaction.VI_TRI_MOI || transaction.EMAIL_CU != transaction.EMAIL_MOI || transaction.SDT_CU != transaction.SDT_MOI ){
			contentHTML += "<tr><td colspan='2'><h5 class='header-title'><span>"+ CONST_STR.get('CONST_SETUP_QUERY_CHANGED_INFO') +"</span></h5></td></tr>"; //title
			contentHTML += "<tr><td colspan='2'><div align='center'><div class='recycler-list'><table class='recycler-table-ebank'><tbody>";
			if (transaction.VI_TRI_CU != transaction.VI_TRI_MOI) {
				contentHTML += "<tr class='recycler-row-normal'>";
				contentHTML += "<td class='recycler-row-align-midle-left'><span>" + CONST_STR.get('POSITION_TITLE_BGN') + "</span></td>";
				contentHTML += "<td class='recycler-row-align-midle-right'><span>" + transaction.VI_TRI_MOI + "</span></td>";
				contentHTML += "</tr>";
			}
			if (transaction.EMAIL_CU != transaction.EMAIL_MOI) {
				contentHTML += "<tr class='recycler-row-normal'>";
				contentHTML += "<td class='recycler-row-align-midle-left'><span>" + CONST_STR.get('EMAIL_TITLE') + "</span></td>";
				contentHTML += "<td class='recycler-row-align-midle-right'><span>" + transaction.EMAIL_MOI + "</span></td>";
				contentHTML += "</tr>";
			}
			if (transaction.SDT_CU != transaction.SDT_MOI) {
				contentHTML += "<tr class='recycler-row-normal'>";
				contentHTML += "<td class='recycler-row-align-midle-left'><span>" + CONST_STR.get('SET_USER_PHONE_NUMBER') + "</span></td>";
				contentHTML += "<td class='recycler-row-align-midle-right'><span>" + transaction.SDT_MOI + "</span></td>";	
				contentHTML += "</tr>";
			}
			contentHTML += "</tbody></table></div></div></td></tr>";
			contentHTML += "</tbody></table>";
		}	
	return contentHTML;
}

function genDetailChangePassword(transaction){
	AllTable(transaction);
	return contentHTML;
}

function genDetailChangeSendMethod(transaction){
	
	contentHTML += "<table width='100%'><tbody>"
	/*table 1*/
	AllTable(transaction);
	/*table 2*/
		contentHTML += "<tr><td colspan='2'><h5 class='header-title'><span>"+ CONST_STR.get('COM_METHOD_CHOOSE_AUTHORIZE') +"</span></h5></td></tr>"; //title
		contentHTML += "<tr><td colspan='2'><div align='center'><div class='recycler-list'><table class='recycler-table-ebank'><tbody>";
		contentHTML += "<tr class='recycler-row-normal'>";
			if(transaction.KIEU_SEND_MOI == "0"){
				contentHTML += "<td width='1%'><input type='radio' checked='checked' disabled='true'/></td>";
			}else{
				contentHTML += "<td width='1%'> <input type='radio' disabled='true'/></td>";
			}	
		contentHTML += "<td width='99%' style='text-align:left;'><span>" + CONST_STR.get('SET_SEND_CHOOSE_NO_SEND') + "</span></td>";
		contentHTML += "</tr>";

		contentHTML += "<tr class='recycler-row-normal'>";
			if(transaction.KIEU_SEND_MOI == "1"){
				contentHTML += "<td width='1%'><input type='radio' checked='checked' disabled='true'/></td>";
			}else{
				contentHTML += "<td width='1%'> <input type='radio' disabled='true'/></td>";
			}
		contentHTML += "<td width='99%' style='text-align:left;'><span>" + CONST_STR.get('SET_SEND_CHOOSE_SEND_EMAIL') + "</span></td>";
		contentHTML += "</tr>";

		contentHTML += "<tr class='recycler-row-normal'>";
			if(transaction.KIEU_SEND_MOI == "2"){
				contentHTML += "<td width='1%'><input type='radio' checked='checked' disabled='true'/></td>";
			}else{
				contentHTML += "<td width='1%'> <input type='radio' disabled='true'/></td>";
			}
		contentHTML += "<td width='99%' style='text-align:left;'><span>" + CONST_STR.get('SET_SEND_CHOOSE_SEND_SMS') + "</span></td>";
		contentHTML += "</tr>";
				
		contentHTML += "<tr class='recycler-row-normal'>";
			if(transaction.KIEU_SEND_MOI == "3"){
				contentHTML += "<td width='1%'><input type='radio' checked='checked' disabled='true'/></td>";
			}else{
				contentHTML += "<td width='1%'> <input type='radio' disabled='true'/></td>";
			}
		contentHTML += "<td width='99%' style='text-align:left;'><span>" + CONST_STR.get('SET_SEND_CHOOSE_SEND_ALL') + "</span></td>";
		contentHTML += "</tr>";
				
	contentHTML += "</tbody></table></div></div></td></tr>";
	contentHTML += "</tbody></table>";
	return contentHTML;
	
}

function genDetailChangeAuthMethod(transaction){
		
	contentHTML += "<table width='100%'><tbody>"
	/*table 1*/
	AllTable(transaction);
	/*table 2*/
	contentHTML += "<tr><td colspan='2'><div align='center'><div class='recycler-list'><table class='recycler-table-ebank'><tbody>";
	contentHTML += "<tr class='recycler-row-normal'><td class='recycler-row-align-midle-left'><span>"+ CONST_STR.get('COM_METHOD_ARE_USED') +"</span></td>";
	contentHTML += "<td class='recycler-row-align-midle-right'><span>" + CONST_STR.get('COM_TOKEN_' + transaction.KIEU_XAC_THUC_CU) + "</span></td></tr>";
	contentHTML += "<tr class='recycler-row-normal'><td class='recycler-row-align-midle-left'><span>"+ CONST_STR.get('CONST_SETUP_QUERY_TIT_AUTH_METHOD_NEW') +"</span></td>";
	contentHTML += "<td class='recycler-row-align-midle-right'><span>" + CONST_STR.get('COM_TOKEN_' + transaction.KIEU_XAC_THUC_MOI) + "</span></td></tr>";
	contentHTML += "</tbody></table></div></div></td></tr>";
	contentHTML += "</tbody></table>";
	
	return contentHTML;
}

function btnNextClick() {
	if (gSetUp.transType == 'S14') {
        var currentTrans = respStored.respJsonObj[0];
		var xmlDoc = genDetailChangeAuthMethodScreen(currentTrans);
		var req = {
			sequence_id : "7",
            idtxn : gSetUp.idtxn,
			transId : currentTrans.MA_GD
		};
		gCorp.cmdType = CONSTANTS.get('CMD_CO_SETUP_QUERY_TRANSFER');
	    gCorp.requests = [req, null];

		setReviewXmlStore(xmlDoc);
		navCachedPages["corp/common/review/com-review"] = null;
		navController.pushToView("corp/common/review/com-review", true, 'xsl');
	}

	if (gCredit.LOAI_GD == 'S15') {
        var currentTrans = respStored.respJsonObj;
		var xmlDoc = genDetailChangeTransLimitScreen(currentTrans);
		var req = {
			sequence_id : "9",
            idtxn : gSetUp.idtxn,
			transId : currentTrans.results[0].MA_GD
		};
		gCorp.cmdType = CONSTANTS.get('CMD_CO_SETUP_QUERY_TRANSFER');
	    gCorp.requests = [req, null];

		setReviewXmlStore(xmlDoc);
		navCachedPages["corp/common/review/com-review"] = null;
		navController.pushToView("corp/common/review/com-review", true, 'xsl');
	}

}

function genDetailChangeAuthMethodScreen(reviewData) {
	var xmlDoc = createXMLDoc();

    var rootNode = createXMLNode("review", "", xmlDoc);

    var sectionNode = createXMLNode("section", "", xmlDoc, rootNode);

    var rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
    createXMLNode("label", CONST_STR.get('CONST_SETUP_QUERY_TIT_TRANS_TYPE_DTL'), xmlDoc, rowNode);
    createXMLNode("value", CONST_STR.get('COM_IDTXN_' + reviewData.LOAI_GD), xmlDoc, rowNode);

	rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
	createXMLNode("label", CONST_STR.get('COM_TRANS_CODE'), xmlDoc, rowNode);
	createXMLNode("value", reviewData.MA_GD, xmlDoc, rowNode);

	rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
	createXMLNode("label", CONST_STR.get('COM_CREATED_DATE'), xmlDoc, rowNode);
	createXMLNode("value", reviewData.NGAY_THUC_HIEN, xmlDoc, rowNode);

    sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
    createXMLNode("title", CONST_STR.get('COM_METHOD_ARE_USED'), xmlDoc, sectionNode);
    createXMLNode("row-one-col", CONST_STR.get('COM_TOKEN_' + reviewData.KIEU_XAC_THUC_CU), xmlDoc, sectionNode);

    sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
    createXMLNode("title", CONST_STR.get('CONST_SETUP_QUERY_TIT_AUTH_METHOD_NEW'), xmlDoc, sectionNode);
    createXMLNode("row-one-col", CONST_STR.get('COM_TOKEN_' + reviewData.KIEU_XAC_THUC_MOI), xmlDoc, sectionNode);

    var buttonNode = createXMLNode("button", "", xmlDoc, rootNode);
    createXMLNode("type", "cancel", xmlDoc, buttonNode);
    createXMLNode("label", CONST_STR.get("REVIEW_BTN_CANCEL"), xmlDoc, buttonNode);

    buttonNode = createXMLNode("button", "", xmlDoc, rootNode);
    createXMLNode("type", "back", xmlDoc, buttonNode);
    createXMLNode("label", CONST_STR.get("REVIEW_BTN_BACK"), xmlDoc, buttonNode);

    buttonNode = createXMLNode("button", "", xmlDoc, rootNode);
    createXMLNode("type", "authorize", xmlDoc, buttonNode);
    createXMLNode("label", CONST_STR.get("REVIEW_BTN_NEXT"), xmlDoc, buttonNode);

    return xmlDoc;
}

function genDetailChangeTransLimit(transaction, limit){
		var datatbl=[
			limit[0].MA_DV,
			limit[0].HAN_MUC_LAN_MAX,
			limit[0].HAN_MUC_NGAY_MAX,
			transaction.NEW_GACCO_ONE,
			transaction.NEW_GACCO_DAY,
			
			limit[1].MA_DV,
			limit[1].HAN_MUC_LAN_MAX,
			limit[1].HAN_MUC_NGAY_MAX,
			transaction.NEW_GPAYI_ONE,
			transaction.NEW_GPAYI_DAY,
			
			limit[2].MA_DV,
			limit[2].HAN_MUC_LAN_MAX,
			limit[2].HAN_MUC_NGAY_MAX,
			transaction.NEW_GPAYS_ONE,
			transaction.NEW_GPAYS_DAY,
			
			limit[3].MA_DV,
			limit[3].HAN_MUC_LAN_MAX,
			limit[3].HAN_MUC_NGAY_MAX,
			transaction.NEW_GTRAN_ONE,
			transaction.NEW_GTRAN_DAY,			
		]	
		contentHTML += "<table width='100%'><tbody>"
		/*table 1*/
		AllTable(transaction);
		/*table 2*/
		contentHTML += "<table class='recycler-table-ebank desktopview' width='100%' align='center' style='table-layout: fixed;'>";
		contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
		contentHTML += "<td class='recycler-row-align-midle' rowspan='2''><span>" + CONST_STR.get('CONST_TRANS_LIMIT_TIT_SERVICE') + "</span></td>";
		contentHTML += "<td class='recycler-row-align-midle' colspan='2''><span>" + CONST_STR.get('CONST_TRANS_LIMIT_TIT_MAX_LIMIT') + "</span></td>";
		contentHTML += "<td class='recycler-row-align-midle' colspan='2'><span>" + CONST_STR.get('CONST_TRANS_LIMIT_TIT_SELECTED_LIMIT') + "</span></td>";
		contentHTML += "</tr>";
		
		contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
		contentHTML += "<td class='recycler-row-align-midle'><span>" + CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME') + "</span></td>";
		contentHTML += "<td class='recycler-row-align-midle'><span>" + CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY') + "</span></td>";
		contentHTML += "<td class='recycler-row-align-midle'><span>" + CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME') + "</span></td>";
		contentHTML += "<td class='recycler-row-align-midle'><span>" + CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY') + "</span></td>";
		contentHTML += "</tr>";
		
	//	for (var i in datatbl) {
	//		var service = datatbl[i];
		for (i = 0; i < datatbl.length; i = i +5) {
			contentHTML +="<tr class='recycler-row-title recycler-list recycler-row-align-midle' align='center'>";
			contentHTML +="<td class='recycler-row-align-midle'><span>" + CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_" + datatbl[i]) + "</span></td>";
			contentHTML +="<td class='recycler-row-align-midle'><span>" + formatCurrency2(parseInt(datatbl[i+1])) + "</span></td>";
			contentHTML +="<td class='recycler-row-align-midle'><span>" + formatCurrency2(parseInt(datatbl[i+2])) + "</span></td>";
			contentHTML +="<td class='recycler-row-align-midle'><span>" + formatCurrency2(parseInt(datatbl[i+3])) + "</span></td>";
			contentHTML +="<td class='recycler-row-align-midle'><span>" + formatCurrency2(parseInt(datatbl[i+4])) + "</span></td>";
			contentHTML +="</tr>"
		}
		
		contentHTML +="</tbody></table>";
		
		// for (var i in datatbl) {
			// var service = datatbl[i];
		for (i = 0; i < datatbl.length; i = i +5) {
			contentHTML += "<div class='recycler_table_ebank-mobile mobileview'><div id='recycler_list' class='recycler-list margin-bottom'><table id='recycler_table_ebank-mobile' class='recycler-table-ebank'>";
			contentHTML += "<tr class='recycler-row-normal'>"
			contentHTML += "<td class='recycler-row-align-midle-left'><span>"+ CONST_STR.get('CONST_TRANS_LIMIT_TIT_SERVICE')+"</span></td>"
			contentHTML += "<td class='recycler-row-align-midle-right'><span>"+ (CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_" + datatbl[i]))+"</span></td>"
			contentHTML += "</tr>";
			contentHTML += "<tr class='recycler-row-normal'>"
			contentHTML += "<td class='recycler-row-align-midle-left'><span>"+ CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME_MAX')+"</span></td>"
			contentHTML += "<td class='recycler-row-align-midle-right'><span>"+ formatCurrency2(parseInt(datatbl[i+1]))+"</span></td>"
			contentHTML += "</tr>";	
			contentHTML += "<tr class='recycler-row-normal'>"
			contentHTML += "<td class='recycler-row-align-midle-left'><span>"+ CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY_MAX')+"</span></td>"
			contentHTML += "<td class='recycler-row-align-midle-right'><span>"+ formatCurrency2(parseInt(datatbl[i+2]))+"</span></td>"
			contentHTML += "</tr>"
			contentHTML += "<tr class='recycler-row-normal'>"
			contentHTML += "<td class='recycler-row-align-midle-left'><span>"+ CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME')+"</span></td>"
			contentHTML += "<td class='recycler-row-align-midle-right'><span>"+ formatCurrency2(parseInt(datatbl[i+3]))+"</span></td>"
			contentHTML += "</tr>"
			contentHTML += "<tr class='recycler-row-normal'>"
			contentHTML += "<td class='recycler-row-align-midle-left'><span>"+ CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY')+"</span></td>"
			contentHTML += "<td class='recycler-row-align-midle-right'><span>"+ formatCurrency2(parseInt(datatbl[i+4]))+"</span></td>"
			contentHTML += "</tr></tbody></table></div></div>";	
		}
		
	return contentHTML;
}

function genDetailChangeTransLimitScreen(data) {
    var GACCOService;
    var GTRANService;
    var GPAYSService;
    var GPAYIService;
    for (var i in data.limit) {
        var service = data.limit[i];
        if (service.MA_DV == "GACCO") {
            GACCOService = service;
        }
        if (service.MA_DV == "GTRAN") {
            GTRANService = service;
        }
        if (service.MA_DV == "GPAYS") {
            GPAYSService = service;
        }
        if (service.MA_DV == "GPAYI") {
            GPAYIService = service;
        }
    }

    var reviewData = data.results[0];
	var xmlDoc = createXMLDoc();

    var rootNode = createXMLNode("review", "", xmlDoc);

    var sectionNode = createXMLNode("section", "", xmlDoc, rootNode);

    var rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
    createXMLNode("label", CONST_STR.get('CONST_SETUP_QUERY_TIT_TRANS_TYPE_DTL'), xmlDoc, rowNode);
    createXMLNode("value", CONST_STR.get('COM_IDTXN_' + reviewData.LOAI_GD), xmlDoc, rowNode);

	rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
	createXMLNode("label", CONST_STR.get('COM_TRANS_CODE'), xmlDoc, rowNode);
	createXMLNode("value", reviewData.MA_GD, xmlDoc, rowNode);

	rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
	createXMLNode("label", CONST_STR.get('BATCH_SALARY_PROCESSED_DATE'), xmlDoc, rowNode);
	createXMLNode("value", reviewData.NGAY_THUC_HIEN, xmlDoc, rowNode);

    sectionNode = createXMLNode("section", "", xmlDoc, rootNode);

    var tableNode = createXMLNode("table", "", xmlDoc, sectionNode);
    var theadNode = createXMLNode("thead", "", xmlDoc, tableNode);
    var trNode = createXMLNode("tr", '', xmlDoc, theadNode);
    createXMLNode("class", 'trow-title', xmlDoc, trNode);

    var thNode = createXMLNode("th", CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE"), xmlDoc, trNode);
    createXMLNode("rowspan", '2', xmlDoc, thNode);
    thNode = createXMLNode("th", CONST_STR.get("CONST_TRANS_LIMIT_TIT_MAX_LIMIT"), xmlDoc, trNode);
    createXMLNode("colspan", '2', xmlDoc, thNode);
    thNode = createXMLNode("th", CONST_STR.get("CONST_TRANS_LIMIT_TIT_SELECTED_LIMIT"), xmlDoc, trNode);
    createXMLNode("colspan", '2', xmlDoc, thNode);
    
    trNode = createXMLNode("tr", '', xmlDoc, theadNode);
    createXMLNode("class", 'trow-title', xmlDoc, trNode);
    createXMLNode("th", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME"), xmlDoc, trNode);
    createXMLNode("th", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY"), xmlDoc, trNode);
    createXMLNode("th", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME"), xmlDoc, trNode);
    createXMLNode("th", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY"), xmlDoc, trNode);

    var tbodyNode = createXMLNode("tbody", "", xmlDoc, tableNode);
    
	var trNode = createXMLNode("tr", "", xmlDoc, tbodyNode);
    createXMLNode("class", 'tdselct td-head-color', xmlDoc, trNode);
	var tdNode = createXMLNode("td", CONST_STR.get("COM_ACCOUNT"), xmlDoc, trNode);
	createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(GACCOService.HAN_MUC_LAN_MAX), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME_MAX"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(GACCOService.HAN_MUC_NGAY_MAX), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY_MAX"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(reviewData.NEW_GACCO_ONE), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(reviewData.NEW_GACCO_DAY), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY"), xmlDoc, tdNode);

    trNode = createXMLNode("tr", "", xmlDoc, tbodyNode);
    createXMLNode("class", 'tdselct td-head-color', xmlDoc, trNode);
	tdNode = createXMLNode("td", CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_GTRAN"), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(GTRANService.HAN_MUC_LAN_MAX), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME_MAX"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(GTRANService.HAN_MUC_NGAY_MAX), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY_MAX"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(reviewData.NEW_GTRAN_ONE), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(reviewData.NEW_GTRAN_DAY), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY"), xmlDoc, tdNode);

    trNode = createXMLNode("tr", "", xmlDoc, tbodyNode);
    createXMLNode("class", 'tdselct td-head-color', xmlDoc, trNode);
	tdNode = createXMLNode("td", CONST_STR.get("COM_PAY_SERVICE"), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(GPAYSService.HAN_MUC_LAN_MAX), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME_MAX"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(GPAYSService.HAN_MUC_NGAY_MAX), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY_MAX"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(reviewData.NEW_GPAYS_ONE), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(reviewData.NEW_GPAYS_DAY), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY"), xmlDoc, tdNode);

    trNode = createXMLNode("tr", "", xmlDoc, tbodyNode);
    createXMLNode("class", 'tdselct td-head-color', xmlDoc, trNode);
	tdNode = createXMLNode("td", CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_GPAYI"), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(GPAYIService.HAN_MUC_LAN_MAX), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME_MAX"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(GPAYIService.HAN_MUC_NGAY_MAX), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY_MAX"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(reviewData.NEW_GPAYI_ONE), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME"), xmlDoc, tdNode);
    tdNode = createXMLNode("td", formatCurrency2(reviewData.NEW_GPAYI_DAY), xmlDoc, trNode);
    createXMLNode("title", CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY"), xmlDoc, tdNode);

    var buttonNode = createXMLNode("button", "", xmlDoc, rootNode);
    createXMLNode("type", "cancel", xmlDoc, buttonNode);
    createXMLNode("label", CONST_STR.get("REVIEW_BTN_CANCEL"), xmlDoc, buttonNode);

    buttonNode = createXMLNode("button", "", xmlDoc, rootNode);
    createXMLNode("type", "back", xmlDoc, buttonNode);
    createXMLNode("label", CONST_STR.get("REVIEW_BTN_BACK"), xmlDoc, buttonNode);

    buttonNode = createXMLNode("button", "", xmlDoc, rootNode);
    createXMLNode("type", "authorize", xmlDoc, buttonNode);
    createXMLNode("label", CONST_STR.get("REVIEW_BTN_NEXT"), xmlDoc, buttonNode);

    return xmlDoc;
}