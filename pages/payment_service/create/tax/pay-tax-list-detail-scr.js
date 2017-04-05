var strXml = "";
/*** HEADER ***/
var gprsResp = new GprsRespObj("", "", "", "");
var XmlLocal;
var storedObj;
var data;
var storeXML;

/*** INIT VIEW ***/
function loadInitXML() {
  var tmpXml = getReviewXmlStore();
  XmlLocal = tmpXml;
  if (strXml == '' || strXml == undefined) {
    strXml = XMLToString(tmpXml);
  }

  // logInfo(docXml);

  return tmpXml;
}

function viewDidLoadSuccess() {
	logInfo('review load success');
	onloadtable();
	init();
}

function init() {
    angular.module('EbankApp').controller('pay-tax-list-detail-scr', function ($scope) {
		navController.getBottomBar().hide();
        if(gCredit.DataTable[5] == "null - undefined"){
            gCredit.tienHQ = "";
        }else{
            gCredit.tienHQ = gCredit.DataTable[5];
        }
        if(gCredit.DataTable[7] == "null - undefined"){
            gCredit.tienHQ = "";
        }else{
            gCredit.maXNK = gCredit.DataTable[5];
        }
        $scope.infoCredit = gCredit;
        if ($scope.infoCredit.transstatus == 'INT' || $scope.infoCredit.transstatus == 'RBH') {
        	document.getElementById('INT_CANCE').style.display = '';
        	document.getElementById('ABH_PRINT').style.display = 'none';
        }else if($scope.infoCredit.transstatus == 'ABH'){
        	document.getElementById('INT_CANCE').style.display = 'none';
        	document.getElementById('ABH_PRINT').style.display = '';
        }else{
            document.getElementById('INT_CANCE').style.display = 'none';
            document.getElementById('ABH_PRINT').style.display = 'none';
        }
		$scope.goBack = function(){
			navController.popView(true);
		}

        $scope.cancelPayTax = function(){
            navCachedPages['payment_service/create/tax/pay-tax-authen'] = null;
            navController.pushToView("payment_service/create/tax/pay-tax-authen", true,'html');
        }
		
		$scope.createReport = function(){
			var jsonData = new Object();
			jsonData.sequence_id = "1";
			jsonData.idfcatref = gTax.idFcatref;
			jsonData.taxType = gTax.taxType;
            jsonData.refNum = gTax.refTax;
            jsonData.userId = gCustomerNo;
			jsonData.idtxn = "B00";

			//console.log("jsonData" + jsonData);

			  var args = new Array();
			  args.push("1");
			  args.push(jsonData);
			  var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_CREATE_TAX_REPORT'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
			  var data = getDataFromGprsCmd(gprsCmd);
			  requestMBServiceCorp(data, true, 0, createTaxReportSuccess, createTaxReportFail);
		}
		function createTaxReportSuccess(e) {
			var gprsResp = JSON.parse(e);
			setRespObjStore(gprsResp);
			if (gprsResp.respJsonObj != '') {
                var UrlLink = gprsResp.respJsonObj;
                UrlLink = UrlLink.replace("/bizv3","");
				openLinkInWindows(UrlLink);
			} else {
				showAlertText(CONST_STR.get(CONST_STR.get('CORP_ERROR_MSG_CANCEL_SUCCESS')));
			}
		}

		function createTaxReportFail() {}

    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}
function onloadtable(){
	var tmpNode = document.getElementById('id.table');
	var obj = gCredit.obj;
	if (gCredit.GetTaxType == '01' || gCredit.GetTaxType == '02' || gCredit.GetTaxType == '05'){
		tmpNode.innerHTML = CreateTable1(obj);
	}
	if (gCredit.GetTaxType == '06'){
		tmpNode.innerHTML = CreateTable2(obj);
	}
	
}
function CreateTable1(inArrAcc){
	var length = inArrAcc.list.length;
    var contentItem = '';
    for (var i = 0; i < length; i++) {
        var inAccObj = inArrAcc.list[i];

        var  economyContent = inAccObj.NOI_DUNG_KINH_TE;
        if(economyContent ==''||economyContent ==null || typeof economyContent == 'undefined' )
            economyContent = inAccObj.MA_NOI_DUNG_KINH_TE;
        if(inAccObj.KY_THUE == null || inAccObj.KY_THUE == undefined ){
            var kyThue = "";
        }else{
            kyThue = inAccObj.KY_THUE;
        }
        // title
    var contentHTML = '';
        contentHTML += "<table style='width: 99% !important' align='center' class='recycler-table-ebank desktopview'>";
        contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
        contentHTML += "<td width='6%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_NO') + "</span></td>";
        contentHTML += "<td width='12%' class='recycler-row-align-midle'><span>" + CONST_STR.get('TAX_CHAPTER') + "</span></</td>";
        contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('TAX_CONTENT') + "</span></td>";
        contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_AMOUNT') + "</span></td>";
        contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('TAX_PERIODIC') + "</span></td>";
        contentHTML += "</tr>";

        contentItem += '<tr class="recycler-row-title recycler-list">';
        contentItem += '<td class="recycler-row-align-midle"><span>' + (i + 1) + '</span></td>';
        contentItem += '<td class="recycler-row-align-midle"><span>' + inAccObj.CHUONG + '</span></td>';
        contentItem += '<td class="recycler-row-align-midle"><span>' + economyContent + '</span></td>';
        contentItem += '<td class="recycler-row-align-midle"><span>' + (formatNumberToCurrency(inAccObj.SO_TIEN) + ' VND') + '</span></td>';
        contentItem += '<td class="recycler-row-align-midle"><span>' + (inAccObj.kyThue ? inAccObj.kyThue : '') + '</span></td></tr>';
    }

    var contentItemmb = '';
    var contentHTMLmb = '';
    contentHTMLmb += "<div align='center' class='recycler-table-ebank  mobileview'>";
    for (var j = 0; j < 5; j++) {
        var inAccObj = inArrAcc.list[j];
        if (inAccObj != undefined) {
            contentItemmb += "<table style='margin-bottom:10px;' width='98%'  class='recycler-list'>";
            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_NO') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (j + 1) + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('TAX_CHAPTER') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.CHUONG + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('TAX_CONTENT') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  economyContent + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_AMOUNT') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (formatNumberToCurrency(inAccObj.SO_TIEN) + ' VND') + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('TAX_PERIODIC') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (inAccObj.kyThue ? inAccObj.kyThue : '') + '</span></td></tr></table>';
        }
    }

	contentHTML += contentItem + "</tbody></table>";
    contentHTMLmb += contentItemmb + '</div>';
    return contentHTML += contentHTMLmb +'<div align="right" style="float: right; width:100%">'
    + '<div id="pageIndicatorNums" style="text-align: right; display: inline-block;" /></div></div>';
}
function CreateTable2(inArrAcc){
	var length = inArrAcc.list.length;
    var contentItem = '';
    for (var i = 0; i < length; i++) {
    	var inAccObj = inArrAcc.list[i];

		var contentHTML = '';
	    contentHTML += "<table width='96%' align='center' class='recycler-table-ebank desktopview'>";
	    contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
	    contentHTML += "<td width='6%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_NO') + "</span></td>";
	    contentHTML += "<td width='12%' class='recycler-row-align-midle'><span>" + CONST_STR.get('TAX_CONTENT') + "</span></</td>";
	    contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('TAX_CONTENT_TITLE') + "</span></td>";
	    contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('TAX_CURRENCY_MONEY') + "</span></td>";
	    contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('TAX_CURRENCY_MONEY_LOCAL') + "</span></td>";
	    contentHTML += "<td width='8%' class='recycler-row-align-midle'><span>" + CONST_STR.get('TAX_CURRENCY_NOTE') + "</span></td>";
	    contentHTML += "</tr>";

	    contentItem += '<tr class="recycler-row-title recycler-list">';
	    contentItem += '<td class="recycler-row-align-midle"><span>' + (i + 1) + '</span></td>';
	    contentItem += '<td class="recycler-row-align-midle"><span>' + inAccObj.MA_NOI_DUNG_KINH_TE + '</span></td>';
	    contentItem += '<td class="recycler-row-align-midle"><span>' + inAccObj.NOI_DUNG_KINH_TE + '</span></td>';
	    contentItem += '<td class="recycler-row-align-midle"><span>' + formatNumberToCurrency(inAccObj.SO_TIEN_NGUYEN_TE) + '</span></td>';
	    contentItem += '<td class="recycler-row-align-midle"><span>' + formatNumberToCurrency(inAccObj.SO_TIEN) + '</span></td>';
	    contentItem += '<td class="recycler-row-align-midle"><span>' + inAccObj.GHICHU + '</span></td></tr>';
    }
    var contentItemmb = '';
    var contentHTMLmb = '';
    contentHTMLmb += "<div align='center' class='recycler-table-ebank  mobileview'>";
    for (var j = 0; j < 5; j++) {
        var inAccObj = inArrAcc.list[j];
        if (inAccObj != undefined) {
            contentItemmb += "<table style='margin-bottom:10px;' width='98%'  class='recycler-list'>";
            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_NO') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (j + 1) + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('TAX_CONTENT') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.MA_NOI_DUNG_KINH_TE + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('TAX_CONTENT_TITLE') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.NOI_DUNG_KINH_TE + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('TAX_CURRENCY_MONEY') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  formatNumberToCurrency(inAccObj.SO_TIEN_NGUYEN_TE) + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('TAX_CURRENCY_MONEY_LOCAL') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  formatNumberToCurrency(inAccObj.SO_TIEN) + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('TAX_CURRENCY_NOTE') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.GHICHU + '</span></td></tr></table>';
        }
    }
	
	contentHTML += contentItem + "</tbody></table>";
    contentHTMLmb += contentItemmb + '</div>';
    return contentHTML += contentHTMLmb +'<div align="right" style="float: right; width:100%">'
    + '<div id="pageIndicatorNums" style="text-align: right; display: inline-block;" /></div></div>';
}