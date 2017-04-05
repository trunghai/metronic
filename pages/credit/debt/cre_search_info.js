flagCreSearch = true;
var rowsPerPage = 10;
var totalPages = 0;
/*** INIT VIEW ***/
function loadInitXML() {
    logInfo('Search debt init');
}

/*** VIEW BACK FROM OTHER ***/

function viewBackFromOther() {
    logInfo('Back search debt');
    flagCreSearch = false;
}


/*** VIEW LOAD SUCCESS ***/
function viewDidLoadSuccess() {
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        gCredit.rowsPerPage = 10;
    }else{
        gCredit.rowsPerPage = 5;
    }
    init();
    logInfo('Search debt load success');
    // Load for datetime picker
    // createDatePicker('trans.debtStartdate', 'span.debtStartdate');
    // createDatePicker('trans.debtEnddate', 'span.debtEnddate');
    // createDatePicker('trans.expireStartdate', 'span.expireStartdate');
    // createDatePicker('trans.expireEnddate', 'span.expireEnddate');
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        if (flagCreSearch) {
            if(document.getElementById("tblContent")){
                document.getElementById("tblContent").innerHTML  = "";
            }
            document.getElementById('pageIndicatorNums').innerHTML = "";  
            document.getElementById('trans.debtStartdate').value = "";    
            document.getElementById('trans.expireStartdate').value = ""; 
            document.getElementById('trans.debtEnddate').value = "";    
            document.getElementById('trans.expireEnddate').value = "";     
            document.getElementById('cre_type_money').value =  (gUserInfo.lang == 'EN') ? CONST_TYPE_MONEY_EN[0] : CONST_TYPE_MONEY_VN[0];     
            document.getElementById('cre_type_deadline').value = (gUserInfo.lang == 'EN') ? CONST_TYPE_DEADLINE_EN[0]: CONST_TYPE_DEADLINE_VN[0];    
        }
    }else{
        if (flagCreSearch) {
            if(document.getElementById("tblContent")){
                document.getElementById("tblContent").innerHTML  = "";
            }
            document.getElementById('pageIndicatorNums').innerHTML = "";  
            document.getElementById('trans.debtStartdatemb').value = "";    
            document.getElementById('trans.expireStartdatemb').value = ""; 
            document.getElementById('trans.debtEnddatemb').value = "";    
            document.getElementById('trans.expireEnddatemb').value = "";     
            document.getElementById('cre_type_moneymb').value =  (gUserInfo.lang == 'EN') ? CONST_TYPE_MONEY_EN[0] : CONST_TYPE_MONEY_VN[0];     
            document.getElementById('cre_type_deadlinemb').value = (gUserInfo.lang == 'EN') ? CONST_TYPE_DEADLINE_EN[0]: CONST_TYPE_DEADLINE_VN[0];    
        }
    }
    
}

/*** VIEW WILL UNLOAD ***/
function viewWillUnload() {
    logInfo('Search debt will unload');
}

function init() {
    angular.module('EbankApp').controller('cre_search_info', function ($scope, requestMBServiceCorp) {
        /*** Start Liên quan item chọn loại tiền***/
        $scope.showTypeMoney = function () {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_TYPE_MONEY_EN : CONST_TYPE_MONEY_VN;
            var tmpArray2 = CONST_TYPE_MONEY_VALUE;
            document.addEventListener("evtSelectionDialog", handleInputTypeMoney, false);
            document.addEventListener("evtSelectionDialogClose", handleInputTypeMoneyClose, false);
            showDialogList(CONST_STR.get('CRE_TYPE_MONEY_POPUP_TITLE'), tmpArray1, tmpArray2, false);
        }

        function handleInputTypeMoney(e) {
            if (currentPage == "credit/debt/cre_search_info") {
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
            if (currentPage == "credit/debt/cre_search_info") {
                document.removeEventListener("evtSelectionDialogClose", handleInputTypeMoneyClose, false);
                document.removeEventListener("evtSelectionDialog", handleInputTypeMoney, false);
            }
        }

        /*** End Liên quan item chọn loại tiền***/

        /*** Start Liên quan item chọn loại vay***/
        $scope.showTypeDebt = function () {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_TYPE_DEBT_EN : CONST_TYPE_DEBT_VN;
            var tmpArray2 = CONST_TYPE_DEBT_VALUE;
            document.addEventListener("evtSelectionDialog", handleInputTypeDebt, false);
            document.addEventListener("evtSelectionDialogClose", handleInputTypeDebtClose, false);
            showDialogList(CONST_STR.get('CRE_TYPE_DEBT_POPUP_TITLE'), tmpArray1, tmpArray2, false);
        }

        function handleInputTypeDebt(e) {
            if (currentPage == "credit/debt/cre_search_info") {
                document.removeEventListener("evtSelectionDialog", handleInputTypeDebt, false);

                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    if (e.selectedValue2 != 1) {
                        if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                            document.getElementById('cre_debt_type').value = e.selectedValue1;
                            document.getElementById('cre_debt_type_value').value = e.selectedValue2;
                        }else{
                            document.getElementById('cre_debt_typemb').value = e.selectedValue1;
                            document.getElementById('cre_debt_type_valuemb').value = e.selectedValue2;
                        }
                    } else {
                        // chuyển đến màn hình thấu chi
                        var argsArray = [];
                        argsArray.push("4");
                        argsArray.push(JSON.stringify({
                            idtxn: "C00"
                        }));
                        
                        var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_CREDIT_DEBT_INFO"), "", "", gUserInfo.lang, gUserInfo.sessionID, argsArray);
                        data = getDataFromGprsCmd(gprsCmd);

                        requestMBServiceCorp.post(data, true, function(data) {
                        var response = data;
                        if (response.respCode == RESP.get('COM_SUCCESS') 
                                && response.responseType == CONSTANTS.get('CMD_CO_CREDIT_DEBT_INFO')) {
                //          mainContentScroll.refresh(); 
                            if(response.respJsonObj.rows.length == 0){
                                document.getElementById("tblContent").innerHTML = CONST_STR.get('CORP_MSG_COM_NO_DATA_FOUND');
                                document.getElementById('cre_debt_type').value = e.selectedValue1;
                                document.getElementById('cre_debt_type_value').value = e.selectedValue2;
                            }else{
                                updateAccountListInfo();
                                navController.pushToView('credit/debt/cre_overdraft', true, 'html');
                            }
                        }
                        else {
                            if(gprsResp.respCode == '1019'){
                                showAlertText(gprsResp.respContent);
                            }else{
                                showAlertText(CONST_STR.get('ERR_COM_TRANS_FAILED'));
                            }
                            var tmpPageName = navController.getDefaultPage();
                            var tmpPageType = navController.getDefaultPageType();
                            navController.initWithRootView(tmpPageName, true, tmpPageType);
                        }
                    });
                        
                    }
                }
            }
        }

        function handleInputTypeDebtClose() {
            if (currentPage == "credit/debt/cre_search_info") {
                document.removeEventListener("evtSelectionDialogClose", handleInputTypeDebtClose, false);
                document.removeEventListener("evtSelectionDialog", handleInputTypeDebt, false);
            }
        }

        /*** End Liên quan item chọn loại vay***/

        /*** Start Liên quan item chọn thời hạn***/
        $scope.showTypeDeadline = function () {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_TYPE_DEADLINE_EN : CONST_TYPE_DEADLINE_VN;
            var tmpArray2 = CONST_TYPE_DEADLINE_VALUE;
            document.addEventListener("evtSelectionDialog", handleInputTypeDeadline, false);
            document.addEventListener("evtSelectionDialogClose", handleInputTypeDeadlineClose, false);
            showDialogList(CONST_STR.get('CRE_TYPE_DEADLINE_POPUP_TITLE'), tmpArray1, tmpArray2, false);
        }

        function handleInputTypeDeadline(e) {
            if (currentPage == "credit/debt/cre_search_info") {
                document.removeEventListener("evtSelectionDialog", handleInputTypeDeadline, false);

                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                        document.getElementById('cre_type_deadline').value = e.selectedValue1;
                        document.getElementById('cre_type_deadline_value').value = e.selectedValue2;
                    }else{
                        document.getElementById('cre_type_deadlinemb').value = e.selectedValue1;
                        document.getElementById('cre_type_deadline_valuemb').value = e.selectedValue2;
                    }
                }
            }
        }

        function handleInputTypeDeadlineClose() {
            if (currentPage == "credit/debt/cre_search_info") {
                document.removeEventListener("evtSelectionDialogClose", handleInputTypeDeadlineClose, false);
                document.removeEventListener("evtSelectionDialog", handleInputTypeDeadline, false);
            }
        }

        /*** End Liên quan item chọn thời hạn***/


         //get data from database
        $scope.creDebtSearchInfo = function () {
            var overDraft = document.getElementById('cre_debt_type_value').value;
            if (overDraft != 0) {
                // chuyển đến màn hình thấu chi
                var argsArray = [];
                argsArray.push("4");
                argsArray.push(JSON.stringify({
                    idtxn: "C00"
                }));
                
                var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_CREDIT_DEBT_INFO"), "", "", gUserInfo.lang, gUserInfo.sessionID, argsArray);
                data = getDataFromGprsCmd(gprsCmd);

                requestMBServiceCorp.post(data, true, function(data) {
                var response = data;
                if (response.respCode == RESP.get('COM_SUCCESS') 
                        && response.responseType == CONSTANTS.get('CMD_CO_CREDIT_DEBT_INFO')) {
        //          mainContentScroll.refresh(); 
                    if(response.respJsonObj.rows.length == 0){
                        document.getElementById("tblContent").innerHTML = CONST_STR.get('CORP_MSG_COM_NO_DATA_FOUND');
                        document.getElementById('cre_debt_type').value = CONST_STR.get('COM_LOAN_OVERDRAFT');
                        document.getElementById('cre_debt_type_value').value = 1;
                        return;
                    }else{
                        updateAccountListInfo();
                        navController.pushToView('credit/debt/cre_overdraft', true, 'html');
                    }
                }
                else {
                    if(gprsResp.respCode == '1019'){
                        showAlertText(gprsResp.respContent);
                    }else{
                        showAlertText(CONST_STR.get('ERR_COM_TRANS_FAILED'));
                    }
                    var tmpPageName = navController.getDefaultPage();
                    var tmpPageType = navController.getDefaultPageType();
                    navController.initWithRootView(tmpPageName, true, tmpPageType);
                }
            });
            }else{
                var msgValidate = new Array();

                if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                    // Ngay nhan no[tu ngay]
                    if (!debtCheckFormatDate(document.getElementById("trans.debtStartdate").value)) {
                        msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
                    }

                    // Ngay nhan no[den ngay]
                    if (!debtCheckFormatDate(document.getElementById("trans.debtEnddate").value)) {
                        msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
                    }

                    var fromDate = document.getElementById("trans.debtStartdate").value;
                    var endDate = document.getElementById("trans.debtEnddate").value;
                    var diffDays = getDiffDaysBetween(fromDate, endDate, "dd/MM/yyyy");
                    if (diffDays < 0) {
                        msgValidate.push(CONST_STR.get("ACC_HIS_INVALID_QUERY_DATE"));
                    }

                    // Ngay dao han[tu ngay]
                    if (!debtCheckFormatDate(document.getElementById("trans.expireStartdate").value)) {
                        msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
                    }

                    // Ngay dao han[den ngay]
                    if (!debtCheckFormatDate(document.getElementById("trans.expireEnddate").value)) {
                        msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
                    }

                    fromDate = document.getElementById("trans.expireStartdate").value;
                    endDate = document.getElementById("trans.expireEnddate").value;
                    diffDays = getDiffDaysBetween(fromDate, endDate, "dd/MM/yyyy");
                    if (diffDays < 0) {
                        msgValidate.push(CONST_STR.get("ACC_HIS_INVALID_QUERY_DATE"));
                    }
                }else{
                    // Ngay nhan no[tu ngay]
                    if (!debtCheckFormatDate(document.getElementById("trans.debtStartdatemb").value)) {
                        msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
                    }

                    // Ngay nhan no[den ngay]
                    if (!debtCheckFormatDate(document.getElementById("trans.debtEnddatemb").value)) {
                        msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
                    }

                    var fromDate = document.getElementById("trans.debtStartdatemb").value;
                    var endDate = document.getElementById("trans.debtEnddatemb").value;
                    var diffDays = getDiffDaysBetween(fromDate, endDate, "dd/MM/yyyy");
                    if (diffDays < 0) {
                        msgValidate.push(CONST_STR.get("ACC_HIS_INVALID_QUERY_DATE"));
                    }

                    // Ngay dao han[tu ngay]
                    if (!debtCheckFormatDate(document.getElementById("trans.expireStartdatemb").value)) {
                        msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
                    }

                    // Ngay dao han[den ngay]
                    if (!debtCheckFormatDate(document.getElementById("trans.expireEnddatemb").value)) {
                        msgValidate.push(CONST_STR.get('CORP_MSG_ACC_TIME_SEARCH_NOT_VALID'));
                    }

                    fromDate = document.getElementById("trans.expireStartdatemb").value;
                    endDate = document.getElementById("trans.expireEnddatemb").value;
                    diffDays = getDiffDaysBetween(fromDate, endDate, "dd/MM/yyyy");
                    if (diffDays < 0) {
                        msgValidate.push(CONST_STR.get("ACC_HIS_INVALID_QUERY_DATE"));
                    }
                }

                if (msgValidate.length > 0) {
                    showAlertText(msgValidate[0]);
                } else {
                    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                        // Set dữ liệu trước khi gọi service
                        var argsArray = [];
                        argsArray.push("2");
                        argsArray.push(JSON.stringify({
                            idtxn: "C00",
                            typeDebt: document.getElementById("cre_debt_type_value").value,
                            debtStartdate: (document.getElementById("trans.debtStartdate").value == 'dd/mm/yyyy') ? '' : document.getElementById("trans.debtStartdate").value,
                            debtEnddate: (document.getElementById("trans.debtEnddate").value == 'dd/mm/yyyy') ? '' : document.getElementById("trans.debtEnddate").value,
                            expireStartdate: (document.getElementById("trans.expireStartdate").value == 'dd/mm/yyyy') ? '' : document.getElementById("trans.expireStartdate").value,
                            expireEnddate: (document.getElementById("trans.expireEnddate").value == 'dd/mm/yyyy') ? '' : document.getElementById("trans.expireEnddate").value,
                            typeMoney: document.getElementById("cre_type_money_value").value,
                            typeDeadline: document.getElementById("cre_type_deadline_value").value
                        }));
                    }else{
                        // Set dữ liệu trước khi gọi service
                        var argsArray = [];
                        argsArray.push("2");
                        argsArray.push(JSON.stringify({
                            idtxn: "C00",
                            typeDebt: document.getElementById("cre_debt_type_valuemb").value,
                            debtStartdate: (document.getElementById("trans.debtStartdatemb").value == 'dd/mm/yyyy') ? '' : document.getElementById("trans.debtStartdatemb").value,
                            debtEnddate: (document.getElementById("trans.debtEnddatemb").value == 'dd/mm/yyyy') ? '' : document.getElementById("trans.debtEnddatemb").value,
                            expireStartdate: (document.getElementById("trans.expireStartdatemb").value == 'dd/mm/yyyy') ? '' : document.getElementById("trans.expireStartdatemb").value,
                            expireEnddate: (document.getElementById("trans.expireEnddatemb").value == 'dd/mm/yyyy') ? '' : document.getElementById("trans.expireEnddatemb").value,
                            typeMoney: document.getElementById("cre_type_money_valuemb").value,
                            typeDeadline: document.getElementById("cre_type_deadline_valuemb").value
                        }));
                    }

                    var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_CREDIT_DEBT_INFO"), "", "", gUserInfo.lang, gUserInfo.sessionID, argsArray);
                    data = getDataFromGprsCmd(gprsCmd);

                    // gọi service và xử lí logic
                    requestMBServiceCorp.post(data, true,
                        function (data) {
                            var response = data;
                            creCallServiceSuccess(response);
                        });
                }
            }
            
        }

        // Xử lí dữ liệu khi gọi service thành công
        function creCallServiceSuccess(response) {
            if (response.respCode == RESP.get('COM_SUCCESS')
                && response.responseType == CONSTANTS.get('CMD_CO_CREDIT_DEBT_INFO')) {

                //    	mainContentScroll.refresh();
                gCredit.curPage = 1;
                gCredit.results = response.respJsonObj.rows;
                if (gCredit.results.length == 0) {
                    document.getElementById("tblContent").innerHTML = CONST_STR.get('CORP_MSG_COM_NO_DATA_FOUND');
                } else {
                    var listPending = new Array();
                    gCredit.totalPages = getTotalPages(gCredit.results.length);
                    if (gCredit.results.length > gCredit.rowsPerPage) {
                        for (var i = 0; i < gCredit.rowsPerPage; i++) {
                            listPending.push(gCredit.results[i]);
                        }
                    } else {
                        for (var i = 0; i < gCredit.results.length; i++) {
                            listPending.push(gCredit.results[i]);
                        }
                    }
                    document.getElementById("tblContent").innerHTML = genHtmlDoc(listPending);
                    genPagging(gCredit.totalPages, 1);
                }
            } else {
                if (gprsResp.respCode == '1019') {
                    showAlertText(gprsResp.respContent);
                } else {
                    showAlertText(CONST_STR.get('ERR_COM_TRANS_FAILED'));
                }
                var tmpPageName = navController.getDefaultPage();
                var tmpPageType = navController.getDefaultPageType();
                navController.pushToView(tmpPageName, true, tmpPageType);
            }
        }
        $scope.creDebtSearchInfo();
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}

function genHtmlDoc(inArrAcc) {
    var length = inArrAcc.length;
    var contentItem = '';

    var i = (gCredit.curPage - 1) * gCredit.rowsPerPage;
    var j = i + gCredit.rowsPerPage;
    for (i; i < j; i++) {
        var inAccObj = inArrAcc[i];

        if (typeof inAccObj !== "undefined") {  
            var indentureNo = "'" + inAccObj.INDENTURE_NO + "'";
            var debtName = "'" + inAccObj.DEBT_NAME + "'";
            var disbursementMoney = "'" + inAccObj.DISBURSEMENT_MONEY + "'";
            var interest = "'" + inAccObj.INTEREST + "'";
            var debtDate = "'" + inAccObj.DEBT_DATE + "'";
            var expireDate = "'" + inAccObj.EXPIRE_DATE + "'";
            var expireNearDate = "'" + inAccObj.EXPIRE_NEAR_DATE + "'";
            var rootMoney = "'" + inAccObj.ROOT_MONEY + "'";
            var interestMoney = "'" + inAccObj.INTEREST_MONEY + "'";
            // title
            var contentHTML = '';
                contentHTML += "<table width='96%' align='center' class='recycler-table-ebank desktopview'>";
                contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
                contentHTML += "<td width='6%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_NO') + "</span></td>";
                contentHTML += "<td width='12%' class='recycler-row-align-midle'><span>" + CONST_STR.get('CRE_DEBT_ITEM_DEBT_NAME') + "</span></</td>";
                contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('CRE_DEBT_ITEM_DISBURSEMENT_MONEY') + "</span></td>";
                contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('CRE_DEBT_DATE') + "</span></td>";
                contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_EXPIRE_DATE') + "</span></td>";
                contentHTML += "<td width='8%' class='recycler-row-align-midle'><span>" + CONST_STR.get('CRE_DEBT_ITEM_INTEREST') + "</span></td>";
                contentHTML += "<td width='18%' class='recycler-row-align-midle'><span>" + CONST_STR.get('CRE_DEBT_ITEM_INDENTURE_NO') + "</span></td>";
                contentHTML += "</tr>";

                contentItem += '<tr class="recycler-row-title recycler-list">';
                contentItem += '<td class="recycler-row-align-midle"><span>' + (i + 1) + '</span></td>';
                contentItem += '<td class="recycler-row-align-midle"><span>' + inAccObj.DEBT_NAME + '</span></td>';
                contentItem += '<td class="recycler-row-align-midle"><span>' + (formatNumberToCurrency(inAccObj.DISBURSEMENT_MONEY) + ' VND') + '</span></td>';
                contentItem += '<td class="recycler-row-align-midle"><span>' + inAccObj.DEBT_DATE + '</span></td>';
                contentItem += '<td class="recycler-row-align-midle"><span>' + inAccObj.EXPIRE_DATE + '</span></td>';
                contentItem += '<td class="recycler-row-align-midle"><span>' + inAccObj.INTEREST + '</span></td>';
                contentItem += '<td class="recycler-row-align-midle" style="word-break: break-all;"><span><a style="cursor:pointer; white-space:pre-wrap;" onclick="detailDebt('
                + indentureNo + ',' + debtName + ',' + disbursementMoney + ',' + interest + ','
                + debtDate + ',' + expireDate + ',' + expireNearDate + ',' + rootMoney + ',' + interestMoney +')"'
                + 'href="javascript:void(0)">' + inAccObj.INDENTURE_NO + '</a></span></td></tr>';
        }
    }

    var contentItemmb = '';
    var contentHTMLmb = '';
    contentHTMLmb += "<div align='center' class='recycler-table-ebank  mobileview'>";
    var k = (gCredit.curPage - 1) * gCredit.rowsPerPage;
    for (k; k < j; k++) {
        var inAccObj = inArrAcc[k];
        if (inAccObj != undefined) {
            contentItemmb += "<table style='margin-bottom:10px;' width='96%'  class='recycler-list'>";
            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_NO') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (k + 1) + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_CREATED_DATE') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.DEBT_NAME + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_TYPE_TRANSACTION') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (formatNumberToCurrency(inAccObj.DISBURSEMENT_MONEY) + ' VND') + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_STATUS') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.DEBT_DATE + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_AMOUNT') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.EXPIRE_DATE + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_CHEKER') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.EXPIRE_DATE + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_TRANS_CODE') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right" style="word-break: break-all;"><div class="content-detail"><span><a style="cursor:pointer; white-space:pre-wrap;" onclick="detailDebt('
                        + indentureNo + ',' + debtName + ',' + disbursementMoney + ',' + interest + ','
                        + debtDate + ',' + expireDate + ',' + expireNearDate + ',' + rootMoney + ',' + interestMoney +')"'
                        + 'href="javascript:void(0)">' + inAccObj.INDENTURE_NO + '</a></span></td></tr></table>';
        }
    }

    contentHTML += contentItem + "</tbody></table>";
    contentHTMLmb += contentItemmb + '</div>';
    return contentHTML += contentHTMLmb +'<div align="right" style="float: right; width:100%">'
    + '<div id="pageIndicatorNums" style="text-align: right; display: inline-block;" /></div></div>';

}

// Thực hiện chuyển sang màn hình detail
function detailDebt(indenture_no, debt_name, disbursement_money, interest,
                    debt_date, expire_date, expire_near_date, root_money, interest_money) {
    // Chuyen du lieu vao bien toan cuc
    gCredit.indentureNo = indenture_no;
    gCredit.debtName = debt_name;
    gCredit.disbursementMoney = disbursement_money;
    gCredit.interest = interest;
    gCredit.debtDate = debt_date;
    gCredit.expireDate = expire_date;
    gCredit.expireNearDate = expire_near_date;
    gCredit.rootMoney = root_money;
    gCredit.interestMoney = interest_money;

    // goto screen
    updateAccountListInfo();
    navController.pushToView('credit/debt/cre_search_info_dtl', true, 'html');
}

function getTotalPages(totalRows) {
    return totalRows % gCredit.rowsPerPage == 0 ? Math.floor(totalRows / gCredit.rowsPerPage) : Math.floor(totalRows / gCredit.rowsPerPage) + 1;
}

function pageIndicatorSelected(selectedIdx, selectedPage) {
    gCredit.curPage = selectedIdx;

    var tmpNode = document.getElementById('tblContent');
    tmpNode.innerHTML = genHtmlDoc(gCredit.results);
    genPagging(gCredit.totalPages, gCredit.curPage);

}

function genPagging(totalPages, pageIdx) {
    var nodepage = document.getElementById('pageIndicatorNums');
    var tmpStr = genPageIndicatorHtml(totalPages, pageIdx);
    nodepage.innerHTML = tmpStr;
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