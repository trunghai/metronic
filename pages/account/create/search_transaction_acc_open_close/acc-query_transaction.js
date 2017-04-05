var docXml;
var currentPageIndex;
var currentID;
var listPayeeTran = new Array();
var objJSON;
var typeTransaction;
var typeStatus;
var listObj;
var sequenceId = "1";
var transaction = "ALL";
var stt = 0;

var gAccount = {};
gAccount.transactionId = "";

gCorp.isBack = false;

var searchInfo = {
    transType:"",
    maker:"",
    status:"",
    fromDate:"",
    endDate:""
};


function viewDidLoadSuccess() {
    navController.getBottomBar().hide();
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        itemsPerPage = 10;
    } else {
        itemsPerPage = 5;
    }
    if (!gCorp.isBack){
        resetView();
    }
    init();
    setUpCalendar();
    actionbar.addListSequence("account/create/search_transaction_acc_open_close/acc-query_transaction");
    //createDatePicker('id.begindate', 'span.begindate');
    //createDatePicker('id.enddate', 'span.enddate');
}

function viewBackFromOther() {
    gCorp.isBack = true;
}

function init() {
    angular.module('EbankApp').controller('acc_query_transaction', function ($scope, requestMBServiceCorp) {
        //show loai giao dich
        $scope.showTypeTransaction = function() {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_ACCOUNT_QUERY_TYPE_TRANSACTION_EN :
                CONST_ACCOUNT_QUERY_TYPE_TRANSACTION_VN;
            var tmpArray2 = CONST_ACCOUNT_QUERY_TYPE_TRANSACTION_VAL;

            var handleInputTypeTransaction = function (e) {
                document.removeEventListener("evtSelectionDialog", handleInputTypeTransaction, false);
                var acctype;
                if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                    acctype = document.getElementById('idTypeTransaction');
                }else{
                    acctype = document.getElementById('idTypeTransactionmb');
                }
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    if (acctype.nodeName == "INPUT") {
                        acctype.value = e.selectedValue1;
                        transaction = getValueTransaction(e);
                    }

                } else {
                    acctype.innerHTML = e.selectedValue1;
                    transaction = getValueTransaction(e);
                }

                if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                    typeTransaction = e.selectedValue2;
                }
            }

            var handleInputTypeTransactionClose = function () {
                document.removeEventListener("evtSelectionDialogClose", handleInputTypeTransactionClose, false);
                document.removeEventListener("evtSelectionDialog", handleInputTypeTransaction, false);
            }

            document.addEventListener("evtSelectionDialog", handleInputTypeTransaction, false);
            document.addEventListener("evtSelectionDialogClose", handleInputTypeTransactionClose, false);
            showDialogList(CONST_STR.get("COM_CHOOSEN_TYPE_TRANS"), tmpArray1, tmpArray2, false);
        }
        // Get nguoi tao giao dich
        $scope.getUserWhoCreatedTransaction = function() {
            //Collect và gửi data lên
            var dataObj = new Object();
            sequenceId = "1";
            dataObj.sequenceId = "1";
            dataObj.idtxn = "A15";

            var arrArgs = new Array();
            arrArgs.push("1");
            arrArgs.push(dataObj);
            var gprsCmd = new GprsCmdObj(1305, "", "", gUserInfo.lang, gUserInfo.sessionID, arrArgs);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, requestResultServiceSuccess, requestResultServiceFail);
        }
        $scope.showStatus = function() {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_ACCOUNT_QUERY_TYPE_STATUS_EN : CONST_ACCOUNT_QUERY_TYPE_STATUS_VN;
            var tmpArray2 = CONST_ACCOUNT_QUERY_TYPE_STATUS_VALUE;

            var handleshowSTT = function (e) {
                document.removeEventListener("evtSelectionDialog", handleshowSTT, false);
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    var sttcont;
                    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                        sttcont = document.getElementById("idStatus");
                    }else{
                        sttcont = document.getElementById("idStatusmb");
                    }
                    if (sttcont.nodeName == "INPUT") {
                        sttcont.value = e.selectedValue1;
                    } else {
                        sttcont.innerHTML = e.selectedValue1;
                    }
                }
                if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                    typeStatus = e.selectedValue2;
                }
            }

            var handleshowSTTClose = function () {
                document.removeEventListener("evtSelectionDialogClose", handleshowSTTClose, false);
                document.removeEventListener("evtSelectionDialog", handleshowSTT, false);
            }

            document.addEventListener("evtSelectionDialog", handleshowSTT, false);
            document.addEventListener("evtSelectionDialogClose", handleshowSTTClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC'), tmpArray1, tmpArray2, false);
        }

        $scope.sendJSONRequest = function () {
            var data = {};
            var arrayArgs = new Array();
            var userId;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                searchInfo.fromDate = document.getElementById("id.begindate").value;
                searchInfo.toDate = document.getElementById("id.enddate").value;
                userId = document.getElementById("id.accountno").value;
            }else{
                searchInfo.fromDate = document.getElementById("id.begindatemb").value;
                searchInfo.toDate = document.getElementById("id.enddatemb").value;
                userId = document.getElementById("id.accountnomb").value;
            }

            if (searchInfo.fromDate == "dd/mm/yyyy") {
                searchInfo.fromDate = "";
            }
            if (searchInfo.toDate == "dd/mm/yyyy") {
                searchInfo.toDate = "";
            }

            if (calculateDifferentMonth(searchInfo.fromDate, searchInfo.toDate)) {
                showAlertText(CONST_STR.get("CORP_MSG_ACC_TIME_SEARCH_NOT_VALID"));
                return;
            }

            var objectValueClient = new Object();
            var idtxn = "A15";
            sequenceId = "2";
            objectValueClient.idtxn = idtxn;
            objectValueClient.sequenceId = sequenceId;
            objectValueClient.typeTransaction = typeTransaction;
            objectValueClient.status = typeStatus;
            objectValueClient.fromDate = searchInfo.fromDate;
            objectValueClient.toDate = searchInfo.toDate;
            objectValueClient.creator = gAccount.creator;


            var arrayClientInfo = new Array();
            arrayClientInfo.push("2");
            arrayClientInfo.push(objectValueClient);

            //1305
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_ACCOUNT_QUERY_TRANSACTION"), "", "", gUserInfo.lang, gUserInfo.sessionID,
                arrayClientInfo);

            data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, requestResultServiceSuccess, requestResultServiceFail);
        }

        $scope.sendJSONRequest();

    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}
function getValueTransaction(e) {
    var result;
    for (var i = 0; i < CONST_ACCOUNT_QUERY_TYPE_TRANSACTION_VN.length; i++) {
        if (e.selectedValue1 == CONST_ACCOUNT_QUERY_TYPE_TRANSACTION_VN[i]) {
            result = CONST_ACCOUNT_QUERY_TYPE_VALUE[i];
            break;
        }
    }
    return result;
}

//nhap lai
function resetView () {
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        document.getElementById("idTypeTransaction").value = CONST_STR.get("COM_ALL");
        document.getElementById("id.accountno").value = CONST_STR.get("COM_ALL");
        document.getElementById("idStatus").value = CONST_STR.get("COM_ALL");
        document.getElementById("id.begindate").value = CONST_STR.get("COM_TXT_SELECTION_PLACEHOLDER_DATE");
        document.getElementById("id.enddate").value = CONST_STR.get("COM_TXT_SELECTION_PLACEHOLDER_DATE");
    }else{
        document.getElementById("id.begindatemb").value = CONST_STR.get("COM_TXT_SELECTION_PLACEHOLDER_DATE");
        document.getElementById("id.enddatemb").value = CONST_STR.get("COM_TXT_SELECTION_PLACEHOLDER_DATE");
        document.getElementById("idTypeTransactionmb").value = CONST_STR.get("COM_ALL");
        document.getElementById("id.accountnomb").value = CONST_STR.get("COM_ALL");
        document.getElementById("idStatusmb").value = CONST_STR.get("COM_ALL");
    }

    document.getElementById("id.search").innerHTML = "";
    document.getElementById("tblContent").innerHTML = "";

    searchInfo = {
        transType:"",
        maker:"",
        status:"",
        fromDate:"",
        endDate:""
    };
    typeTransaction = "";
    typeStatus = "";
    gAccount.creator = "";
}


function handleSelectUser(e) {
    handleCloseUserClose();
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        document.getElementById('id.accountno').value = e.selectedValue1;
    }else{
        document.getElementById('id.accountnomb').value = e.selectedValue1;
    }
    gAccount.creator = e.selectedValue2;
}

function handleCloseUserClose() {
    document.removeEventListener("evtSelectionDialogClose", handleCloseUserClose, false);
    document.removeEventListener("evtSelectionDialog", handleSelectUser, false);
}

function requestResultServiceSuccess(e) {
    var gprsResp = e; //JSON.parse(JSON.stringify(e));
    setRespObjStore(gprsResp); //store response
    var obj = gprsResp.respJsonObj;

    //show account nguoi duyet
    if (sequenceId == "1") {
        var listUser = [CONST_STR.get("COM_ALL")];
        var listValues = [""];

        for (var i = 0; i < obj.length; i++) {
            listUser.push(obj[i].IDUSER);
            listValues.push(obj[i].IDUSER);
        }
        document.addEventListener("evtSelectionDialog", handleSelectUser, false);
        document.addEventListener("evtSelectionDialogClose", handleCloseUserClose, false);
        showDialogList(CONST_STR.get('COM_DIALOG_TITLE_ACCNO_CHOISE'), listUser, listValues, false);
    } else if (sequenceId == "2") {
        if (obj.length == 0) {
            document.getElementById("tblContent").innerHTML = CONST_STR.get("CORP_MSG_COM_NO_DATA_FOUND");
            var paginationElement = document.getElementById("id.search");
            if (paginationElement != null)
                paginationElement.style.display = "none";
        } else {
            //show bang search giao dich
            listObj = obj;
            totalPage = calTotalPage(obj);
            pageIndex = 1;
            var arrMedial = new Array();
            if (listObj.length > itemsPerPage) {
                for (var i = 0; i < itemsPerPage; i++) {
                    arrMedial.push(listObj[i]);
                }
            } else {
                for (var i = 0; i < listObj.length; i++) {
                    arrMedial.push(listObj[i]);
                }
            }

            document.getElementById("tblContent").innerHTML = genHtmlDoc(arrMedial,pageIndex);
            genPagging(totalPage, pageIndex);
        }

        setTimeout(function () {
            // mainContentScroll.scrollToElement(document.getElementById("tblContent"));
        }, 100);
    } else if (sequenceId == "3") {
        genReviewScreen(obj);
    }
}
function requestResultServiceSuccessInfo(e) {
    var gprsResp = JSON.parse(e); //JSON.parse(JSON.stringify(e));
    setRespObjStore(gprsResp); //store response
    var obj = gprsResp.respJsonObj;
    var length = gprsResp.respJsonObj.length;
    for (var i = 0; i < obj.length; i++) {
        obj = gprsResp.respJsonObj[i];
    }

    //show account nguoi duyet
    if (sequenceId == "1") {
        var listUser = [CONST_STR.get("COM_ALL")];
        var listValues = [""];

        for (var i = 0; i < obj.length; i++) {
            listUser.push(obj[i].IDUSER);
            listValues.push(obj[i].IDUSER);
        }
        document.addEventListener("evtSelectionDialog", handleSelectUser, false);
        document.addEventListener("evtSelectionDialogClose", handleCloseUserClose, false);
        showDialogList(CONST_STR.get('COM_DIALOG_TITLE_ACCNO_CHOISE'), listUser, listValues, false);
    } else if (sequenceId == "2") {
        if (obj.length == 0) {
            document.getElementById("tblContent").innerHTML = CONST_STR.get("CORP_MSG_COM_NO_DATA_FOUND");
            var paginationElement = document.getElementById("id.search");
            if (paginationElement != null)
                paginationElement.style.display = "none";
        } else {
            //show bang search giao dich
            listObj = obj;
            totalPage = calTotalPage(obj);
            pageIndex = 1;
            var arrMedial = new Array();
//            arrMedial = getItemsPerPage(obj, pageIndex);
            if (listObj.length > totalPage) {
                for (var i = 0; i < totalPage; i++) {
                    arrMedial.push(listObj[i]);
                }
            } else {
                for (var i = 0; i < listObj.length; i++) {
                    arrMedial.push(listObj[i]);
                }
            }

            document.getElementById("tblContent").innerHTML = genHtmlDoc(arrMedial);
            genPagging(totalPage, pageIndex);
        }

        setTimeout(function () {
            // mainContentScroll.scrollToElement(document.getElementById("tblContent"));
        }, 100);
    } else if (sequenceId == "3") {
        genReviewScreen(obj);
    }
}


function requestResultServiceFail(e) {
    var tmpPageName = navController.getDefaultPage();
    var tmpPageType = navController.getDefaultPageType();
    navController.pushToView(tmpPageName, true, tmpPageType);
}

function failPaggingCallback() {

}

function pageIndicatorSelected(selectedIdx, selectedPage) {
    document.getElementById('tblContent').innerHTML = "";
    document.getElementById('id.search').innerHTML = "";

    var startIdx = (selectedIdx - 1) * itemsPerPage;
    var endIdx = startIdx + itemsPerPage;
    var arrMedial = new Array();

    for (var i = startIdx; i < endIdx; i++) {
        if (listObj[i] != undefined) {
            arrMedial.push(listObj[i]);
        }
    }
    document.getElementById('tblContent').innerHTML = genHtmlDoc(arrMedial,selectedIdx);
    genPagging(totalPage, selectedIdx);

}

function genXmlDataPagging(arr) {

}

function genPagging(arr, pageIndex) {
    var totalPage = calTotalPage(listObj);
    var nodepage = document.getElementById('id.search');
    var tmpStr = genPageIndicatorHtml(totalPage, Number(pageIndex));
    nodepage.innerHTML = tmpStr;
}

function calTotalPage(arrObj) {
    if (arrObj != null && arrObj.length > 0) {
        return Math.ceil(arrObj.length / itemsPerPage);
    }
    return 0;
}

function getItemsPerPage(arrObj, pageIndex) {
    var arrTmp = new Array();
    var from = 0;
    var to = 0;
    for (var i = 0; i < arrObj.length; i++) {
        from = (pageIndex - 1) * itemsPerPage;
        to = from + itemsPerPage;
        if (i >= from && i < to) {
            arrTmp.push(arrObj[i]);
        }

    }
    return arrTmp;
}


function genReviewScreen(obj) {
    var valueidtxn = "";
    gAccount.objTransaction = obj;
    if (obj == null || obj == undefined) {
        showAlertText(CONST_STR.get('CORP_MSG_COM_NO_DATA_FOUND'));
        return;
    }
    if (obj.IDTXN == "A13") {
        valueidtxn = CONST_STR.get("ACC_SEND_MONEY");
        var rate, valueRate = "";
        var tmpArrRate = (gUserInfo.lang == 'EN') ? CONST_ACCOUNT_QUERY_RATE_MONTH_EN :
            CONST_ACCOUNT_QUERY_RATE_MONTH_VN;
        for (var i = 0; i < tmpArrRate.length; i++) {
            if (obj.DURNAME == tmpArrRate[i]) {
                rate = tmpArrRate[i];
                break;
            }
        }
        if (rate == undefined) {
        } else {
            valueRate = rate + "/năm";
        }

        alueidtxn = CONST_STR.get("ACC_SEND_MONEY");

        var dueType = obj.DUETYPE; //lua chon 1, 2 ha 3
        var destAccount = obj.TXTDESTACCT;
        var announce;
        if (dueType == 1) {
            //chuyen goc va lai sang ki han moi
            announce = CONST_STR.get("COM_INTEREST_MOVING_INTO_NEW_TERM");
        } else if (dueType == 2) {
            //chuyen goc sang ki han moi, lai chuyen v
            announce = CONST_STR.get("ACC_MOVING_TERM_ROOT") + " " + destAccount;
        } else if (dueType == 3) {
            announce = CONST_STR.get("ACC_FINALIZE_OF_PRINCIPAL") + " " + destAccount;
        }

        var obj = obj;
        id_FCATREF = obj.IDFCATREF;//ma giao dich
        date_make = obj.DATMAKE;// ngay lap
        date_check = (obj.DATCHECK ? obj.DATCHECK : "" );// ngay duyet
        cod_status = CONST_STR.get("TRANS_STATUS_" + obj.CODSTATUS);// trang thai
        // var txtReason = obj.TXTREASON;
        //     if (typeof txtReason != "undefined" && txtReason != null && txtReason.trim().length > 0) {
        //         listValueScreenCommon.push([CONST_STR.get("ACC_QUERY_REASON_CANCEL"), txtReason]); //li do tu choi
        //     }
        trans_type = valueidtxn;// loai giao dich
        id_srcacct = obj.IDSRCACCT;// tai khoan trich tien

        num_amount = formatNumberToCurrencyWithSymbol(obj.NUMAMOUNT);// so tien gui
        dur_name = obj.DURNAME;// ky han gui
        date_send = obj.DATE_SEND;// ngay gui
        date_end = obj.DATE_END;// ngay dao han
        Rate = obj.RATE + "%/năm";// lai suat tien gui
        pro_rate = formatNumberToCurrencyWithSymbol(obj.PROVISIONAL_RATES, " " + obj.CODTRNCURR);// lai tam tinh
        announceN = announce;// chi thi khi dao han
        sned_method = CONST_STR.get("COM_NOTIFY_" + obj.SENDMETHOD);// gui thong bao

    } else if (obj.IDTXN == "A14") {
        valueidtxn = CONST_STR.get("ACCOUNT_PERIOD_BTN_FINAL");
        var obj = obj;
        id_FCATREF = obj.IDFCATREF;//ma giao dich
        date_make = obj.DATMAKE;// ngay lap
        date_check = (obj.DATCHECK ? obj.DATCHECK : "" );// ngay duyet
        cod_status = CONST_STR.get("TRANS_STATUS_" + obj.CODSTATUS);// trang thai
        // var txtReason = obj.TXTREASON; li do tu choi
        // if (typeof txtReason != "undefined" && txtReason != null && txtReason.trim().length > 0) {
        //     document.getElementById('reason').innerHTML = txtReason; //li do tu choi
        // }

        // totalAmount = parseInt(keepOnlyNumber(obj.DEPOSIT_AMT)) + parseInt(keepOnlyNumber(obj.AMOUNTACC));
        var duration = parseInt(obj.TENOR_MONTHS) + parseInt(obj.TENOR_YEARS) * 12;
        transType = CONST_STR.get("ACC_CLOSE_SAVING_ACCOUNT");// loai giao dich
        accFinal = CONST_STR.get("ACC_DIGITAL_SAVING");// loai tiet kiem
        accCurrency = obj.CODTRNCURR;// loai tien
        accNumb = obj.IDSRCACCT;// so tai khoan
        accFinalRoot = formatNumberToCurrencyWithSymbol(obj.DEPOSIT_AMT,
            " " + obj.CODTRNCURR);// so tien rut goc
        comPeriod = duration + " " + CONST_STR.get("ACCOUNT_PERIOD_MONTH");// ky han gui
        transPer = obj.TXTDESTACCT;// so tai khoan nhan tien
    }
    // setReviewXmlStore(docXml);
    // goto screen
    updateAccountListInfo();
    navController.pushToView('account/create/search_transaction_acc_open_close/acc_query_transfer_detail', true, 'html');
}


function onClickPageAccClose() {
    updateAccountListInfo();
    navController.pushToView('account/create/list_info/acc_list_account_info', true, 'html');
}
function onClickPageTransaction() {
    updateAccountListInfo();
    navController.pushToView('account/create/search_transaction_acc_open_close/acc-query_transaction', true, 'html');
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
    var data = {};
    var arrayArgs = new Array();
    var userId;
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        searchInfo.fromDate = document.getElementById("id.begindate").value;
        searchInfo.toDate = document.getElementById("id.enddate").value;
        userId = document.getElementById("id.accountno").value;
    }else{
        searchInfo.fromDate = document.getElementById("id.begindatemb").value;
        searchInfo.toDate = document.getElementById("id.enddatemb").value;
        userId = document.getElementById("id.accountnomb").value;
    }

    if (searchInfo.fromDate == "dd/mm/yyyy") {
        searchInfo.fromDate = "";
    }
    if (searchInfo.toDate == "dd/mm/yyyy") {
        searchInfo.toDate = "";
    }

    if (calculateDifferentMonth(searchInfo.fromDate, searchInfo.toDate)) {
        showAlertText(CONST_STR.get("CORP_MSG_ACC_TIME_SEARCH_NOT_VALID"));
        return;
    }

    var objectValueClient = new Object();
    var idtxn = "A15";
    sequenceId = 14;
    objectValueClient.idtxn = idtxn;
    objectValueClient.sequenceId = sequenceId;
    objectValueClient.typeTransaction = typeTransaction;
    objectValueClient.status = typeStatus;
    objectValueClient.fromDate = searchInfo.fromDate;
    objectValueClient.toDate = searchInfo.toDate;
    objectValueClient.creator = gAccount.creator;

    var args = ["", objectValueClient];

    //1305
    var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_EXPORT_EXCEL_REPORT"), "", "", gUserInfo.lang, gUserInfo.sessionID,
        args);

    data = getDataFromGprsCmd(gprsCmd);
    corpExportExcel(data);
}
function corpExportExcel(request) {
    var form = document.createElement("form");
    form.target = "_blank";
    form.setAttribute("method", "POST");
    form.setAttribute("action", gMBServiceUrl + "/report");

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "request");
    hiddenField.setAttribute("value", JSON.stringify(request));
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}


function genHtmlDoc(inArrAcc,selectedIdx) {
    var length = inArrAcc.length;
    var contentItem = '';
    var inAccObj = inArrAcc;
    var valueidtxn = "";
    bottomBar.hide();
    for (var j = 0; j < length; j++) {
        var inAccObj = inArrAcc[j];
        valueidtxn;
        var idFCATREF = "'" + inAccObj.IDFCATREF + "'";
        var datMake = "'" + inAccObj.DATMAKE + "'";
        var valueIdtxn = "'" + inAccObj.IDTXN + "'";
        var status = "'" + CONST_STR.get("TRANS_STATUS_" + inAccObj.CODSTATUS) + "'";
        var so_tien = "'" + inAccObj.NUMAMOUNT + ' ' + inAccObj.CODTRNCURR + "'";
        var approve_by = "'" + (inAccObj.APPROVE_BY ? inAccObj.APPROVE_BY : "") + "'";

        // title
        var contentHTML = '';
        contentHTML += "<table width='98%' align='center' class='recycler-table-ebank desktopview'>";
        contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
        contentHTML += "<td width='6%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_NO') + "</span></td>";
        contentHTML += "<td width='12%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_CREATED_DATE') + "</span></</td>";
        contentHTML += "<td width='16%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_TYPE_TRANSACTION') + "</span></td>";
        contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_STATUS') + "</span></td>";
        contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_AMOUNT') + "</span></td>";
        contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_CHEKER') + "</span></td>";
        contentHTML += "<td width='20%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_TRANS_CODE') + "</span></td>";
        contentHTML += "</tr>";

        contentItem += '<tr class="recycler-row-title recycler-list">';
        contentItem += '<td class="recycler-row-align-midle"><span>' + (((selectedIdx - 1)*itemsPerPage) +(j + 1)) + '</span></td>';
        contentItem += '<td class="recycler-row-align-midle"><span>' + inAccObj.DATMAKE + '</span></td>';
        if(inAccObj.IDTXN == 'A13'){
            contentItem += '<td class="recycler-row-align-midle"><span>' + CONST_STR.get("ACC_SEND_MONEY") +'</span></td>';
        }else if(inAccObj.IDTXN == 'A14'){
            contentItem += '<td class="recycler-row-align-midle"><span>' + CONST_STR.get("ACCOUNT_PERIOD_BTN_FINAL") +'</span></td>';
        }
        contentItem += '<td class="recycler-row-align-midle"><span>' +  CONST_STR.get("TRANS_STATUS_" + inAccObj.CODSTATUS) + '</span></td>';
        contentItem += '<td class="recycler-row-align-midle"><span>' + formatNumberToCurrency(inAccObj.NUMAMOUNT) + ' ' + inAccObj.CODTRNCURR + '</span></td>';
        contentItem += '<td class="recycler-row-align-midle"><span>' + (inAccObj.APPROVE_BY ? inAccObj.APPROVE_BY : "") + '</span></div></td>';
        contentItem += '<td class="recycler-row-align-midle" style="word-break: break-all;"><span><a style="cursor:pointer; white-space:pre-wrap;" onclick="showQueryTransactionHistory('+inAccObj.IDFCATREF+')"'
            + 'href="javascript:void(0)">' + inAccObj.IDFCATREF + '</a></span></td></tr>';

    }

    var contentItemmb = '';
    var contentHTMLmb = '';
    contentHTMLmb += "<div align='center' class='recycler-table-ebank  mobileview'>";
    for (var k = 0; k < 5; k++) {
        var inAccObj = inArrAcc[k];

        if (inAccObj != undefined) {
            contentItemmb += "<table width='98%'  class='recycler-table-ebank mobileview recycler-list margin-bottom'>";
            // contentItemmb += '<tr class="recycler-row-normal">';
            // contentItemmb += '<td class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_NO') + '</span></td>';
            // contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (((selectedIdx - 1)*itemsPerPage) +(k + 1))+ '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_CREATED_DATE') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.DATMAKE + '</span></td></tr>';

            if(inAccObj.IDTXN == 'A13'){
                contentItemmb += '<tr class="recycler-row-normal">';
                contentItemmb += '<td class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_TYPE_TRANSACTION') + '</span></td>';
                contentItemmb += '<td class="recycler-row-align-midle-right"><span>' + CONST_STR.get("ACC_SEND_MONEY") + '</span></td></tr>';
            }else if(inAccObj.IDTXN == 'A14'){
                contentItemmb += '<tr class="recycler-row-normal">';
                contentItemmb += '<td class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_TYPE_TRANSACTION') + '</span></td>';
                contentItemmb += '<td class="recycler-row-align-midle-right"><span>' + CONST_STR.get("ACCOUNT_PERIOD_BTN_FINAL") + '</span></td></tr>';
            }

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_STATUS') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  CONST_STR.get("TRANS_STATUS_" + inAccObj.CODSTATUS) + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_AMOUNT') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  formatNumberToCurrency(inAccObj.NUMAMOUNT) + ' ' + inAccObj.CODTRNCURR + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_CHEKER') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (inAccObj.APPROVE_BY ? inAccObj.APPROVE_BY : "") + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_TRANS_CODE') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right" style="word-break: break-all;"><div class="content-detail"><span><a style="cursor:pointer; white-space:pre-wrap;" onclick="showQueryTransactionHistory('
                +inAccObj.IDFCATREF+')"'
                + 'href="javascript:void(0)">' + inAccObj.IDFCATREF + '</a></span></div></td></tr></table>';
        }
    }

    contentHTML += contentItem + "</tbody></table>";
    contentHTMLmb += contentItemmb + '</div>';
    return contentHTML += contentHTMLmb + '</table><table width="100%"><tr><td><div style="margin: 5px; text-align: right" class="export-print">'
        + '<a href="javascript:void(0)" id="export-excel" onclick="sendRequestExportExcel()">'
        + '<img style="margin-right:5px;" src="css/img/exportfile.png" /></a></div></td></tr></table>'
        + '<div id="id.search" style="text-align: right; padding-bottom: 45px;">';
}
// Click ma IDFCATREF
function showQueryTransactionHistory(id) {
    gAccount.transId = id;
    var objectValueClient = new Object();
    sequenceId = "3";

    var idtxn = "";
    for (var i = 0; i < listObj.length; i++) {
        if (listObj[i].IDFCATREF == id) {
            idtxn = listObj[i].IDTXN;
        }
    }

    objectValueClient.idtxn = "A15";
    objectValueClient.tranIdTxn = idtxn;
    objectValueClient.sequenceId = sequenceId;
    objectValueClient.accountId = "";
    objectValueClient.transactionId = id;
    objectValueClient.creator = gAccount.creator;

    var arrayClientInfo = new Array();
    arrayClientInfo.push("3");
    arrayClientInfo.push(objectValueClient);

    //1305
    var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_ACCOUNT_QUERY_TRANSACTION"), "", "", gUserInfo.lang, gUserInfo.sessionID,
        arrayClientInfo);

    var data = getDataFromGprsCmd(gprsCmd);
    requestMBServiceCorp(data, true, 0, requestResultServiceSuccessInfo, requestResultServiceFail);
}
function setUpCalendar(){
    //set up calendar
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    var prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    if(dd<10) {
        dd='0'+dd;
    }

    if(mm<10) {
        mm='0'+mm;
    }

    today = yyyy+'-'+mm+'-'+dd;

    var fromDate;
    var toDate;

    if (gUserInfo.lang == 'VN') {
        fromDate = new DatePicker(
            {
                show : function(data) {},
                hide : function(data) {},
                seek : function(data) {},
                select : function(data, fn) {
                    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                        document.getElementById('id.begindate').value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
                    } else {
                        document.getElementById('id.begindatemb').value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
                    }

                    fromDate.hide();
                }
            },
            {
                tmpl_field   : 'd/m/Y',
                range_min    : '01-01-2005',
                range_max    : '01-01-2051',
                //range_min    : '01/05/2008',
                //range_max    : '31/12/2050',

                //dom_id       : 'trans.begindate',
                dom_field    : document.getElementById('span-id.begindate'), //node make action
                async_selection : true,

                dictionaries : {
                    'custom' : {
                        common : {
                            bwd  : 'Trước',
                            fwd  : 'Sau',
                            hide : 'Đóng'
                        },
                        weekdays : {
                            motu : 'T2;T3;T4;T5;T6;T7;CN'
                        },
                        monthes : {
                            full : 'Tháng 1;Tháng 2;Tháng 3;Tháng 4;Tháng 5;Tháng 6;Tháng 7;Tháng 8;Tháng 9;Tháng 10;Tháng 11;Tháng 12'
                        }
                    }
                }
            }
        );

        toDate = new DatePicker(
            {
                show : function(data) {},
                hide : function(data) {},
                seek : function(data) {},
                select : function(data, fn) {
                    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                        document.getElementById('id.enddate').value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
                    } else {
                        document.getElementById('id.enddatemb').value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
                    }
                    toDate.hide();
                }
            },
            {
                tmpl_field   : 'd/m/Y',
                range_min    : '01-01-2005',
                range_max    : '01-01-2051',
                //range_min    : '01/05/2008',
                //range_max    : '31/12/2050',

                //dom_id       : 'trans.begindate',
                dom_field    : document.getElementById('span-id.enddate'), //node make action
                async_selection : true,

                dictionaries : {
                    'custom' : {
                        common : {
                            bwd  : 'Trước',
                            fwd  : 'Sau',
                            hide : 'Đóng'
                        },
                        weekdays : {
                            motu : 'T2;T3;T4;T5;T6;T7;CN'
                        },
                        monthes : {
                            full : 'Tháng 1;Tháng 2;Tháng 3;Tháng 4;Tháng 5;Tháng 6;Tháng 7;Tháng 8;Tháng 9;Tháng 10;Tháng 11;Tháng 12'
                        }
                    }
                }
            }
        );

    }
    else {
        fromDate = new DatePicker(
            {
                show : function(data) {},
                hide : function(data) {},
                seek : function(data) {},
                select : function(data, fn) {
                    document.getElementById('id.begindate').value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
                    fromDate.hide();
                }
            },
            {
                tmpl_field   : 'd/m/Y',
                range_min    : '01-01-2005',
                range_max    : '01-01-2051',
                //range_min    : '01/05/2008',
                //range_max    : '31/12/2050',

                //dom_id       : 'trans.begindate',
                dom_field    : document.getElementById('span-id.begindate'), //node make action
                async_selection : true,

                dictionaries : {
                    'custom' : {
                        common : {
                            bwd  : 'Previous',
                            fwd  : 'Next',
                            hide : 'Close'
                        },
                        weekdays : {
                            motu : 'Mo;Tu;We;Th;Fr;Sa;Su'
                        },
                        monthes : {
                            full : 'January;Feburary;March;April;May;June;July;August;September;October;November;December'
                        },
                    }
                }
            }
        );
        toDate = new DatePicker(
            {
                show : function(data) {},
                hide : function(data) {},
                seek : function(data) {},
                select : function(data, fn) {
                    document.getElementById('id.enddate').value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
                    toDate.hide();
                }
            },
            {
                tmpl_field   : 'd/m/Y',
                range_min    : '01-01-2005',
                range_max    : '01-01-2051',
                //range_min    : '01/05/2008',
                //range_max    : '31/12/2050',

                //dom_id       : 'trans.begindate',
                dom_field    : document.getElementById('span-id.enddate'), //node make action
                async_selection : true,

                dictionaries : {
                    'custom' : {
                        common : {
                            bwd  : 'Previous',
                            fwd  : 'Next',
                            hide : 'Close'
                        },
                        weekdays : {
                            motu : 'Mo;Tu;We;Th;Fr;Sa;Su'
                        },
                        monthes : {
                            full : 'January;Feburary;March;April;May;June;July;August;September;October;November;December'
                        }
                    }
                }
            }
        );
    }

    fromDate.select(prevMonth);
    toDate.select(today);
}