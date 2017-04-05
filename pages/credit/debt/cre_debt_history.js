/**
 * Created by NguyenTDK
 * User:
 * Date: 05/10/15
 * Time: 8:00 PM
 */

gCredit.rowsPerPage = 10;
gCredit.totalPages = 0;

/*** INIT VIEW ***/
function loadInitXML() {
    logInfo('debt history init');
}

/*** VIEW BACK FROM OTHER ***/

function viewBackFromOther() {
    logInfo('Back debt history');
}

/*** VIEW LOAD SUCCESS ***/
function viewDidLoadSuccess() {
    init();
    logInfo('debt history load success');
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        gCredit.rowsPerPage = 10;
    }else{
        gCredit.rowsPerPage = 5;
    }

}

/*** VIEW WILL UNLOAD ***/
function viewWillUnload() {
    logInfo('Send info user approve will unload');
}

function init() {
    angular.module('EbankApp').controller('cre_debt_history', function ($scope, requestMBServiceCorp) {
        // Set dữ liệu trước khi gọi service
        var argsArray = [];
        argsArray.push("3");
        argsArray.push(JSON.stringify({
            idtxn: "C00",
            indentureNo: gCredit.indentureNo
        }));

        var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_CREDIT_DEBT_INFO"), "", "", gUserInfo.lang, gUserInfo.sessionID, argsArray);
        data = getDataFromGprsCmd(gprsCmd);

        // gọi service và xử lí logic
        requestMBServiceCorp.post(data, true,
            function (data) {
                var response = data;
                if (response.respCode == RESP.get('COM_SUCCESS')
                    && response.responseType == CONSTANTS.get("CMD_CO_CREDIT_DEBT_INFO")) {
                    // mainContentScroll.refresh();

                    gCredit.results = response.respJsonObj.rows;
                    if (gCredit.results.length == 0) {
                        document.getElementById("tblContent").innerHTML = CONST_STR.get('CORP_MSG_COM_NO_DATA_FOUND');
                    } else {
                        var listPending = new Array();
                        gCredit.totalPages = getTotalPages(gCredit.results.length);
                        if(gCredit.results.length > gCredit.rowsPerPage){
                            for(var i = 0; i < gCredit.rowsPerPage; i++){
                                listPending.push(gCredit.results[i]);
                            }
                        }else{
                            for(var i = 0; i < gCredit.results.length; i++){
                                listPending.push(gCredit.results[i]);
                            }
                        }
                        document.getElementById('tblContent').innerHTML = genHtmlDoc(listPending);
                        genPagging(gCredit.totalPages, 1);
                    }
                }
                else {
                    if (gprsResp.respCode == '1019') {
                        showAlertText(gprsResp.respContent);
                    } else {
                        showAlertText(CONST_STR.get('ERR_COM_TRANS_FAILED'));
                    }
                    var tmpPageName = navController.getDefaultPage();
                    var tmpPageType = navController.getDefaultPageType();
                    navController.pushToView(tmpPageName, true, tmpPageType);
                }
            });

        // Quay lại màn hinh cũ
        $scope.creHistoryCallBack = function () {
            navController.popView(true);
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

            var startIdx = (selectedIdx - 1) * gCredit.rowsPerPage;
            var endIdx = startIdx + gCredit.rowsPerPage;
            var listPending = new Array();
                for(var i = startIdx; i < endIdx; i++){
                    if(gCredit.results[i] != undefined ){
                        listPending.push(gCredit.results[i]);
                    }
                }
            document.getElementById('tblContent').innerHTML = genHtmlDoc(listPending);
            genPagging(gCredit.totalPages, selectedIdx);
        }

        $scope.exportExcelDebtHistory = function () {
            var arrayClientInfo = new Array();
            arrayClientInfo.push(null);
            arrayClientInfo.push({
                sequenceId: "8",
                transType: "T13",
                indentureNo: gCredit.indentureNo,
                dataExport: gCredit.results
            });

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_EXPORT_EXCEL_REPORT"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

            data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true,
                function (data) {
                var resp = data;
                if (resp.respCode == "0") {
                    var fileName = resp.respContent;
                    window.open("./download/" + fileName);
                }
            });
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}
function genHtmlDoc(inArrAcc) {
    var length = inArrAcc.length;
    var contentItem = '';
    var contentHTML = '';
    if(!checkScreenisMobilePX()){
        contentHTML += '<table width="98%" align = "center" class="table-account recycler-table-ebank desktopview">';
        contentHTML += '<tr class="recycler-row-title-header recycler-list">';
        contentHTML += '<td width="12%"  class="recycler-row-align-midle"><span>' + CONST_STR.get('COM_DEADLINE_DATE') + '</span></td>';
        contentHTML += '<td width="14%" class="recycler-row-align-midle"><span>' + CONST_STR.get('CRE_DEBT_ROOT_MONEY_PAY') + '</span></td>';
        contentHTML += '<td width="14%" class="recycler-row-align-midle"><span>' + CONST_STR.get('CRE_DEBT_INTEREST_MONEY_PAY') + '</span></td>';
        contentHTML += '<td width="16%" class="recycler-row-align-midle"><span>' + CONST_STR.get('CRE_DEBT_TOTAL_MONEY_PAY') + '</span></td>';
        contentHTML += '<td width="10%" class="recycler-row-align-midle"><span>' + CONST_STR.get('CRE_DEBT_ROOT_MONEY_ACTUALLY_PAY') + '</span></td>';
        contentHTML += '<td width="10%" class="recycler-row-align-midle"><span>' + CONST_STR.get('CRE_DEBT_INTEREST_MONEY_ACTUALLY_PAY') + '</span></td>';
        contentHTML += '</tr>';

        for (var i = 0; i < length; i++) {
            var inAccObj = inArrAcc[i];
            contentItem += '<tr class="recycler-row-title recycler-list">'
            contentItem += '<td class="recycler-row-align-midle"><span>'+ inAccObj.NGAY_DEN_HAN + '</span></td>';
            contentItem += '<td class="recycler-row-align-midle"><span>'+ inAccObj.INTEREST_MONEY_PAY +'</span></td>';
            contentItem += '<td class="recycler-row-align-midle"><span>'+ inAccObj.INTEREST_MONEY_ACTUALLY_PAY + '</span></td>';
            contentItem += '<td class="recycler-row-align-midle"><span>'+ inAccObj.TOTAL_MONEY_PAY + '</span></td>';
            contentItem += '<td class="recycler-row-align-midle"><span>'+ inAccObj.ROOT_MONEY_PAY + '</span></td>';
            contentItem += '<td class="recycler-row-align-midle"><span>'+ inAccObj.ROOT_MONEY_ACTUALLY_PAY + '</span></td>';
            contentItem += '</tr>';
        }

        contentHTML += contentItem + "</table>";

    }else{
        for (var j = 0; j < 5; j++) {
        var inAccObj = inArrAcc[j];
            if(inAccObj != undefined){
                contentItem += '<div style="margin-top: 10px" class="recycler-list mobileview">';
                contentItem += '<table class="recycler-table-ebank" id="recycler_table_ebank" style="width: 98%">';
                contentItem += '<tr class="recycler-row-parity">';
                contentItem += '<td class="recycler-row-align-midle-left">';
                contentItem += '<span>' + CONST_STR.get('COM_DEADLINE_DATE') + '</span>';
                contentItem += '</td>';
                contentItem += '<td class="recycler-row-align-midle-right">';
                contentItem += '<span>' + inAccObj.NGAY_DEN_HAN + '</span>';
                contentItem += '</td>';
                contentItem += '</tr>';
                contentItem += '<tr class="recycler-row-parity">';
                contentItem += '<td class="recycler-row-align-midle-left">';
                contentItem += '<span>' + CONST_STR.get('CRE_DEBT_ROOT_MONEY_PAY') + '</span>';
                contentItem += '</td>';
                contentItem += '<td class="recycler-row-align-midle-right">';
                contentItem += '<span>' + inAccObj.INTEREST_MONEY_PAY + '</span>';
                contentItem += '</td>';
                contentItem += '</tr><tr class="recycler-row-parity">';
                contentItem += '<td class="recycler-row-align-midle-left">';
                contentItem += '<span>' + CONST_STR.get('CRE_DEBT_INTEREST_MONEY_PAY') + '</span>';
                contentItem += '</td>';
                contentItem += '<td class="recycler-row-align-midle-right">';
                contentItem += '<span>' + inAccObj.INTEREST_MONEY_ACTUALLY_PAY + '</span>';
                contentItem += '</td>';
                contentItem += '</tr><tr class="recycler-row-parity">';
                contentItem += '<td class="recycler-row-align-midle-left">';
                contentItem += '<span>' + CONST_STR.get('CRE_DEBT_TOTAL_MONEY_PAY') + '</span>';
                contentItem += '</td>';
                contentItem += '<td class="recycler-row-align-midle-right">';
                contentItem += '<span>' + inAccObj.TOTAL_MONEY_PAY + '</span>';
                contentItem += '</td>';
                contentItem += '</tr><tr class="recycler-row-parity">';
                contentItem += '<td class="recycler-row-align-midle-left">';
                contentItem += '<span>' + CONST_STR.get('CRE_DEBT_ROOT_MONEY_ACTUALLY_PAY') + '</span>';
                contentItem += '</td>';
                contentItem += '<td class="recycler-row-align-midle-right">';
                contentItem += '<span>' + inAccObj.ROOT_MONEY_PAY + '</span>';
                contentItem += '</td>';
                contentItem += '</tr><tr class="recycler-row-parity">';
                contentItem += '<td class="recycler-row-align-midle-left">';
                contentItem += '<span>' + CONST_STR.get('CRE_DEBT_INTEREST_MONEY_ACTUALLY_PAY') + '</span>';
                contentItem += '</td>';
                contentItem += '<td class="recycler-row-align-midle-right">';
                contentItem += '<span>' + inAccObj.ROOT_MONEY_ACTUALLY_PAY + '</span>';
                contentItem += '</td>';
                contentItem += '</tr>';
                contentItem += '</table></div>';
            }
        }
        contentHTML += contentItem;
        
    }
    return contentHTML;
}
