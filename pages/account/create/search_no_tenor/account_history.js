/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 12/13/16
 * Time: 10:33 AM
 * To change this template use File | Settings | File Templates.
 */
var gprsResp = new GprsRespObj("", "", "", "");
var selectedFlowType = 'ALL';
var selectedTransType = 'ALL';
var totalPage = 0;
var itemsPerPage = 10;
var pageIndex = 1;
var advSearchStatus = true;
var idAccount;
var sequenceId;
var listTransactionInfo = new Array();
var ccy = '';
var searchInfo = {
    transType:"",
    maker:"",
    status:"",
    fromDate:"",
    endDate:""
};


function loadInitXML() {
    return '';
}


function viewBackFromOther() {
}

function viewDidLoadSuccess() {
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        itemsPerPage = 10;
    } else {
        itemsPerPage = 5;
    }
    loadData();
    sequenceId = "2";
    initData();
}

function initData() {
    angular.module("EbankApp").controller("account-history", function ($scope, requestMBServiceCorp) {
        init();
        function init() {
            var objectValueClient = new Object();
            objectValueClient.idtxn = "A11";
            objectValueClient.sequenceId = "2";
            objectValueClient.idAccount = gAccount.accountId;

            var gprsCmd = new GprsCmdObj(1302, "", "",
                gUserInfo.lang, gUserInfo.sessionID, getArrayClient(objectValueClient));
            data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, requestMBServiceSuccesss, requestMBServiceFail);
            /*$("#idTransaction").css("color","#8b828b");
            $("#idMonneyFlow").css("color","#8b828b");*/
        }

        $scope.showAccountSelection = function () {
            var tmpArray1 = [];
            var tmpArray2 = [];
            var ArrListAccount = gAccount.accList;
            for (var i = 0; i < ArrListAccount.length; i++) {
                var tmpAcc = ArrListAccount[i];
                tmpArray1.push(tmpAcc.SO_TK);
                tmpArray2.push(formatNumberToCurrency(tmpAcc.SO_DU_KHA_DUNG) + ' ' + tmpAcc.DON_VI);
            }
            document.addEventListener("evtSelectionDialog", handleSelectionAccountList, false);
            document.addEventListener("evtSelectionDialogClose", handleSelectionAccountListClose, false);

            showDialogList(CONST_STR.get('TRANS_LOCAL_DIALOG_TITLE_ACC'), tmpArray1, tmpArray2, true);
        }

        //event: selection dialog list
        function handleSelectionAccountList(e) {            
            navController.getBottomBar().hide();
            resetValueHideSearch();
            handleSelectionAccountListClose();
            var ArrListAccount = gAccount.accList;
            for (var i = 0; i < ArrListAccount.length; i++) {
                if (ArrListAccount[i].SO_TK == e.selectedValue1) {
                    setSelectedAccIdx(i);
                    setSelectedAccInfoObj(ArrListAccount[i]);
                    idAccount = e.selectedValue1;
                    sendRequestData(idAccount);
                }
            }
            if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                var tagAccNo;
                if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                    tagAccNo = document.getElementById("acchis_accountno");
                } else {
                    tagAccNo = document.getElementById("acchis_accountnomb");
                }
                if (tagAccNo.nodeName == "INPUT") {
                    tagAccNo.value = e.selectedValue1;
                } else {
                    tagAccNo.innerHTML = e.selectedValue1;
                }
            }
            document.getElementById('tblContent').style.display='none';
            document.getElementById('idHistoryInfo').style.display='none';
            document.getElementById('id.search').style.display='none';
            document.getElementById('tblSummary').style.display='none';
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                document.getElementById("id.begindate").value = gAccount.accInfo.DATE_PREVIOUS;
                document.getElementById("id.enddate").value = gAccount.accInfo.DATE_NOW;
            } else {
                document.getElementById("id.begindate").value = gAccount.accInfo.DATE_PREVIOUS;
                document.getElementById("id.enddate").value = gAccount.accInfo.DATE_NOW;
            }

        }

        function resetValueHideSearch(){
//            debugger;
            $("#idAccountSendReceive").val('');
            $("#idNameAccountSendReceive").val('');
            $("#idFromMoney").val('');
            $("#idNumTransaction").val('');
            $("#idToMoney").val('');
            $("#idDescription").val('');
            /*$("#idTransaction").css("color","#8b828b");
            $("#idMonneyFlow").css("color","#8b828b");*/
            $("#idTransaction").val(CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER'));
            $("#idMonneyFlow").val(CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER'));
        }


        function handleSelectionAccountListClose(e) {
            document.removeEventListener("evtSelectionDialogClose", handleSelectionAccountListClose, false);
            document.removeEventListener("evtSelectionDialog", handleSelectionAccountList, false);
        }

        function sendRequestData(idAccount) {
            var objectValueClient = new Object();
            sequenceId = "2";
            objectValueClient.idtxn = "A11";
            objectValueClient.sequenceId = sequenceId;
            objectValueClient.idAccount = idAccount;

            var gprsCmd = new GprsCmdObj(1302, "", "",
                gUserInfo.lang, gUserInfo.sessionID, getArrayClient(objectValueClient));
            data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, requestMBServiceSuccess, requestMBServiceFail);
        }

        function requestMBServiceSuccess(e) {
//            gprsResp = JSON.parse(e);
            if (e.respCode == '0') {
                if (sequenceId == "2") {
                    gAccount.accInfo = e.respJsonObj[0];
                    $scope.infoAcc = gAccount.accInfo;
                    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                        document.getElementById("id.accInfo").style.display = "none";
                        document.getElementById("accDetail").style.display = "block";
                    } else {
                        document.getElementById("mAcc").style.display = "none";
                        document.getElementById("mAccDetail").style.display = "block";
                    }

                } else if (sequenceId == "3") {
                    //search ket qua giao dich
                    gAccount.listObject = gprsResp.respJsonObj;
                    if (gAccount.listObject.length == 0) {
                        document.getElementById("idHistoryInfo").style.display = "";
                        document.getElementById("tblSummary").style.display = "none";
                        document.getElementById("tblContent").style.display = "none";
                        document.getElementById("idSearchFun").style.display = "none";
                        setTimeout(function () {
                            // mainContentScroll.scrollToElement(document.getElementById("idHistoryInfo"));
                        }, 100);

                    } else {
                        document.getElementById("idHistoryInfo").style.display = "none";
                        document.getElementById("tblSummary").style.display = "";
                        document.getElementById("tblContent").style.display = "";
                        document.getElementById("idSearchFun").style.display = "";
                        var credit = 0,
                            debit = 0,
                            balance = 0;
                        var sumCredit = 0;
                        var sumDebit = 0;
                        var openBalance = 0;
                        var endBalance = 0;


                        for (var i = 0; i < gAccount.listObject.length; i++) {
                            var tmp = gAccount.listObject[i];
                            if (tmp == null || tmp == undefined) {
                                break;
                            }
                            if (tmp.CREDIT != null) {
                                credit = parseFloat(removeSpecialChar(tmp.CREDIT));
                                sumCredit += credit;
                                debit = 0;
                            }
                            if (tmp.DEBIT != null) {
                                debit = parseFloat(removeSpecialChar(tmp.DEBIT));
                                sumDebit += debit;
                                credit = 0;
                            }

                            //tinh so du dau ki
                            if (i == 0 || i == gAccount.listObject.length - 1) {
                                if (tmp.RUNNING_BAL != null) {
                                    balance = parseFloat(removeSpecialChar(tmp.RUNNING_BAL));
                                }
                                if (i == 0) {
                                    endBalance = balance;
                                }
                                if (i == gAccount.listObject.length - 1) {
                                    openBalance = balance + debit - credit;
                                    ;
                                }
                            }
                        }
                        totalPage = calTotalPage(gAccount.listObject);
                        pageIndex = 1;
                        showTableSummary(sumCredit, sumDebit, openBalance, endBalance);
                    }

                }
            } else {
                //search liet ke giao dich khong thanh cong
                showAlertText(gprsResp.respContent);
            }
        }

        $scope.sendJSONRequest = function () {
            if (!advSearchStatus) {
                //tim kiem nang cao
                var strFromMoney = document.getElementById("idFromMoney").value;
                var strToMoney = document.getElementById("idToMoney").value;


                if (parseInt(removeSpecialChar(strFromMoney)) > parseInt(removeSpecialChar(strToMoney))) {
                    showAlertText(CONST_STR.get("AMOUT_QUERY_CHECK_MONEY"));
                    return;
                }
                //advSearchStatus = false;
            }
            var arrayClientInfo = new Array();
            arrayClientInfo.push("3");
            if (getValueClientInfo("4") != null) {
                arrayClientInfo.push(getValueClientInfo("3"));
                var gprsCmd = new GprsCmdObj(1302, "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);
                data = getDataFromGprsCmd(gprsCmd);
                requestMBServiceCorp.post(data, true, requestMBServiceSuccesss, requestMBServiceFail);

            }
        }

        function requestMBServiceSuccesss(e) {
            gprsResp = e;
            if (gprsResp.respCode == '0') {
                if (sequenceId == "2") {
                    var listObj = gprsResp.respJsonObj;
                    gAccount.accInfo = gprsResp.respJsonObj[0];
                    $scope.infoAcc = listObj;
                    console.log($scope.infoAcc);
                    document.getElementById("id.accInfo").style.display = "block";
//                    document.getElementById("searchBtn").disabled = "";
                    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                        document.getElementById("id.begindate").value = gAccount.accInfo.DATE_PREVIOUS;
                        document.getElementById("id.enddate").value = gAccount.accInfo.DATE_NOW;
                    } else {
                        document.getElementById("id.begindate").value = gAccount.accInfo.DATE_PREVIOUS;
                        document.getElementById("id.enddate").value = gAccount.accInfo.DATE_NOW;
                    }
                } else if (sequenceId == "3") {
                    //search ket qua giao dich
                    gAccount.listObject = gprsResp.respJsonObj;
                    $scope.arrinfoAcc = gprsResp.respJsonObj;
                    if (gAccount.listObject.length == 0) {
                        document.getElementById("idHistoryInfo").style.display = "";
                        if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                            document.getElementById("idHistoryInfo").style.color = "#000";
                        } else {
                            document.getElementById("idHistoryInfo").style.color = "#FFF";
                        }
                        document.getElementById("tblSummary").style.display = "none";
                        document.getElementById("tblContent").style.display = "none";
                        document.getElementById("idSearchFun").style.display = "none";
                        setTimeout(function () {
                            // mainContentScroll.scrollToElement(document.getElementById("idHistoryInfo"));
                        }, 100);

                    } else {
                        document.getElementById("idHistoryInfo").style.display = "none";
                        document.getElementById("tblSummary").style.display = "";
                        document.getElementById("tblContent").style.display = "";
                        document.getElementById("idSearchFun").style.display = "";
                        var credit = 0,
                            debit = 0,
                            balance = 0;
                        var sumCredit = 0;
                        var sumDebit = 0;
                        var openBalance = 0;
                        var endBalance = 0;


                        for (var i = 0; i < gAccount.listObject.length; i++) {
                            var tmp = gAccount.listObject[i];
                            if (tmp == null || tmp == undefined) {
                                break;
                            }
                            if (tmp.CREDIT != null) {
                                credit = parseFloat(removeSpecialChar(tmp.CREDIT));
                                sumCredit += credit;
                                debit = 0;
                            }
                            if (tmp.DEBIT != null) {
                                debit = parseFloat(removeSpecialChar(tmp.DEBIT));
                                sumDebit += debit;
                                credit = 0;
                            }

                            //tinh so du dau ki
                            if (i == 0 || i == gAccount.listObject.length - 1) {
                                if (tmp.RUNNING_BAL != null) {
                                    balance = parseFloat(removeSpecialChar(tmp.RUNNING_BAL));
                                }
                                if (i == 0) {
                                    endBalance = balance;
                                }
                                if (i == gAccount.listObject.length - 1) {
                                    openBalance = balance + debit - credit;
                                    ;
                                }
                            }
                        }
                        totalPage = calTotalPage(gAccount.listObject);
                        pageIndex = 1;
                        var listItemPage = new Array();
                        if (gAccount.listObject.length > itemsPerPage) {
                            for (var i = 0; i < itemsPerPage; i++) {
                                listItemPage.push(gAccount.listObject[i]);
                            }
                        } else {
                            for (var i = 0; i < gAccount.listObject.length; i++) {
                                listItemPage.push(gAccount.listObject[i]);
                            }
                        }
                        document.getElementById("tblContent").innerHTML = genHtmlDoc(listItemPage);
                        genPagging(totalPage, 1);
                        showTableSummary(sumCredit, sumDebit, openBalance, endBalance);
                    }

                }
            } else {
                //search liet ke giao dich khong thanh cong
                showAlertText(gprsResp.respContent);
            }
        }

        $scope.formatNumberToCurrency = function (amount) {
            var tmpAmount = amount;
            if (typeof(amount) == 'string') {
                //var tmpAmountStr = amount.replace(/\,/g,'');
                var tmpAmountStr = removeSpecialChar(tmpAmount);
                tmpAmount = parseInt(tmpAmountStr);
            }
            places = 0; //phan thap phan
            symbol = "";//" VND";
            thousand = ",";
            decimal = ".";
            var number = this,
                negative = tmpAmount < 0 ? "-" : "",
                i = parseInt(tmpAmount = Math.abs(+tmpAmount || 0).toFixed(places), 10) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
            return negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(tmpAmount - i).toFixed(places).slice(2) : "" + symbol);
            //return (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(tmpAmount - i).toFixed(places).slice(2) : "" + symbol);
        }
    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}


function viewWillUnload() {
}


function goBack() {

    navController.popView();
}

function loadData() {
    listTransactionInfo = new Array();
    var listAccountUser = getSelectedAccInfoObj();
    var sourceAccount;
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        sourceAccount = document.getElementById("acchis_accountno");
    } else {
        sourceAccount = document.getElementById("acchis_accountnomb");
    }
    sourceAccount.value = listAccountUser.SO_TK;
}
function showMoneyFlowSelection() {
    var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_HIS_MONEYFLOW_TYPE_EN : CONST_HIS_MONEYFLOW_TYPE_VN;
    var tmpArray2 = CONST_HIS_MONEYFLOW_TYPE_ID;

    document.addEventListener("evtSelectionDialog", handleSelectionMoneyFlowList, false);
    document.addEventListener("evtSelectionDialogClose", handleSelectionMoneyFlowListClose, false);
    showDialogList(CONST_STR.get('ACC_HIS_MONEY_FLOW_TITLE'), tmpArray1, tmpArray2, false);
}

function handleSelectionMoneyFlowList(e) {
    /*$("#idMonneyFlow").css("color","initial");*/
    handleSelectionMoneyFlowListClose();
    if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
        var tagAccNo = document.getElementById("idMonneyFlow");
        if (tagAccNo.nodeName == "INPUT") {
            tagAccNo.value = e.selectedValue1;
        } else {
            tagAccNo.innerHTML = e.selectedValue1;
        }
    }
    if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
        selectedFlowType = e.selectedValue2;
        gAccount.flowMoney = e.selectedValue2;
    }
}

function handleSelectionMoneyFlowListClose(e) {
    document.removeEventListener("evtSelectionDialogClose", handleSelectionMoneyFlowListClose, false);
    document.removeEventListener("evtSelectionDialog", handleSelectionMoneyFlowList, false);
}

function showTransTypeSelection() {
    var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_HIS_TRANS_TYPE_EN : CONST_HIS_TRANS_TYPE_VN;
    var tmpArray2 = CONST_HIS_TRANS_TYPE_ID;

    document.addEventListener("evtSelectionDialog", handleSelectionTransTypeList, false);
    document.addEventListener("evtSelectionDialogClose", handleSelectionTransTypeListClose, false);
    showDialogList(CONST_STR.get('ACC_HIS_TRANS_TYPE_TITLE'), tmpArray1, tmpArray2, false);
}

function handleSelectionTransTypeList(e) {
    /*$("#idTransaction").css("color","initial");*/
    handleSelectionTransTypeListClose();
    if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
        var tagAccNo = document.getElementById("idTransaction");
        if (tagAccNo.nodeName == "INPUT") {
            tagAccNo.value = e.selectedValue1;
        } else {
            tagAccNo.innerHTML = e.selectedValue1;
        }
    }
    if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
        selectedTransType = e.selectedValue2;
        gAccount.transaction = e.selectedValue2;
    }
}

function handleSelectionTransTypeListClose(e) {
    document.removeEventListener("evtSelectionDialogClose", handleSelectionTransTypeListClose, false);
    document.removeEventListener("evtSelectionDialog", handleSelectionTransTypeList, false);
}

/*** SHOW ADVAND SEARCH ***/
function showAdvandSearch() {
    var tmpTransTypeOther = document.getElementById('adv-search-controls');
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        var tmpBtnAdvSearch = document.getElementById('acchis.btnAdvSearchDesktop');
    } else {
        var tmpBtnAdvSearch = document.getElementById('acchis.btnAdvSearch');
    }
    if (advSearchStatus) {
        tmpTransTypeOther.style.display = 'table';
        advSearchStatus = false;
        tmpBtnAdvSearch.innerHTML = CONST_STR.get('ACC_HIS_ADV_NOR_SEARCH_BTN');
    }
    else {
        tmpTransTypeOther.style.display = 'none';
        advSearchStatus = true;
        tmpBtnAdvSearch.innerHTML = CONST_STR.get('ACC_HIS_ADV_SEARCH_BTN');
    }

    selectedFlowType = 'ALL';
    selectedTransType = 'ALL';
    var tmpInputArr = tmpTransTypeOther.getElementsByTagName('input');
    for (var idx = 0; idx < tmpInputArr.length; idx++) {
        var tmpInputNode = tmpInputArr[idx];
        tmpInputNode.value = '';
    }
    document.getElementById('idMonneyFlow').value = CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER');
    document.getElementById('idTransaction').value = CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER');
}

//ham day gia tri cua client len server, truyen vao gia tri sequence Id
function getValueClientInfo(seqId) {
    //thuc hien ket qua search
    var idAccountSendReceive = document.getElementById("idAccountSendReceive").value;
    var idNameAccountSendReceive = document.getElementById("idNameAccountSendReceive").value;
    var fromDate = document.getElementById('id.begindate').value;
    var toDate = document.getElementById("id.enddate").value;
    var idFromMoney = document.getElementById("idFromMoney").value;
    var idToMoney = document.getElementById("idToMoney").value;
    var idNumTransaction = document.getElementById("idNumTransaction").value;
    var idDescription = document.getElementById("idDescription").value;
    var idMoneyFlow = document.getElementById("idMonneyFlow").value;
    var idTransaction = document.getElementById("idTransaction").value;
    var idAccount;
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        idAccount = document.getElementById("acchis_accountno").value;
    } else {
        idAccount = document.getElementById("acchis_accountnomb").value;
    }


    var months = calculateDifferentMonth(fromDate, toDate);
    if (months == null) {
        showAlertText(CONST_STR.get("CORP_MSG_ACC_TIME_SEARCH_NOT_VALID"));
        return null;
    }
    if (months > 3) {
        showAlertText(CONST_STR.get("CORP_MSG_ACC_INPUT_TWO_DATE_TRANS"));
        return null;
    }

    var today = getStringFromDate();
    if (getDiffDaysBetween(fromDate, today, "dd/MM/yyyy") > 365) {
        showAlertText(CONST_STR.get("ACC_HIS_DATE_OVER_1YEAR"));
        return null;
    }

    if (getDiffDaysBetween(today, toDate, "dd/MM/yyyy") > 0) {
        showAlertText(CONST_STR.get("CORP_MSG_ACC_TIME_SEARCH_NOT_VALID"));
        return null;
    }

    if (gAccount.flowMoney == null) {
        gAccount.flowMoney = "ALL";
    }
    if (gAccount.transaction == null) {
        gAccount.transaction = "ALL";
    }

    var arrTransType = (gUserInfo.lang == 'EN') ? CONST_HIS_TRANS_TYPE_EN : CONST_HIS_TRANS_TYPE_VN;
    var arrMoneyFlow = (gUserInfo.lang == 'EN') ? CONST_HIS_MONEYFLOW_TYPE_EN : CONST_HIS_MONEYFLOW_TYPE_VN;

    if (idMoneyFlow == CONST_STR.get("TAX_TABLE_TITLE_SELECT")) {
        idMoneyFlow = "";
    }
    if (idTransaction == CONST_STR.get("TAX_TABLE_TITLE_SELECT")) {
        idTransaction = "";
    }

    for (var i = 0; i < arrMoneyFlow.length; i++) {
        if (idMoneyFlow == arrMoneyFlow[i]) {
            idMonenyFlow = CONST_HIS_MONEYFLOW_TYPE_ID[i];
            break;
        }
    }

    for (var i = 0; i < arrTransType.length; i++) {
        if (idTransaction == arrTransType[i]) {
            idTransaction = CONST_HIS_TRANS_TYPE_ID[i];
            break;
        }
    }

    if (advSearchStatus) {
        gAccount.flowMoney = "ALL";
        gAccount.transaction = "ALL";
        idAccountSendReceive = "";
        idNameAccountSendReceive = "";
        idFromMoney = "";
        idToMoney = "";
        idDescription = "";
        idNumTransaction = "";

    }

    var objectValueClient = new Object();
    sequenceId = seqId;
    objectValueClient.idtxn = "A11";
    objectValueClient.sequenceId = sequenceId;
    objectValueClient.idAccount = idAccount;
    objectValueClient.pageNo = "1";
    objectValueClient.fromDate = fromDate;
    objectValueClient.toDate = toDate;
    objectValueClient.idMoneyFlow = gAccount.flowMoney;
    objectValueClient.idTransaction = gAccount.transaction;
    objectValueClient.idAccountSendReceive = idAccountSendReceive;
    objectValueClient.idNameAccountSendReceive = idNameAccountSendReceive;
    objectValueClient.idFromMoney = keepOnlyNumber(idFromMoney);
    objectValueClient.idToMoney = keepOnlyNumber(idToMoney);
    objectValueClient.idDescription = idDescription;
    objectValueClient.numTransaction = idNumTransaction;

    return objectValueClient;
}

//send du lieu len de xuat file excel
function sendRequestExportExcel() {
    var arrayClientInfo = new Array();
    arrayClientInfo.push("6");
    arrayClientInfo.push(getValueClientInfo("6"));
    var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_EXPORT_EXCEL_REPORT"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);
    data = getDataFromGprsCmd(gprsCmd);

    corpExportExcel(data);
}

function showTableSummary(sumCredit, sumDebit, openBalance, endBalance) {
    document.getElementById("tblSummary").style.display = "";
    document.getElementById("idCredit").innerHTML = ": " + formatNumberToCurrency(sumCredit) + ' ' + ccy;
    document.getElementById("idDebit").innerHTML = ": " + formatNumberToCurrency(sumDebit) + ' ' + ccy;

    //neu tim kiem thuong moi hien
    if (advSearchStatus) {
        document.getElementById("idBeginBalance").innerHTML = ": " + formatNumberToCurrency(openBalance) + ' ' + ccy;
        document.getElementById("idEndBalance").innerHTML = ": " + formatNumberToCurrency(endBalance) + ' ' + ccy;
        document.getElementById("trBeginBalance").style.display = "";
        document.getElementById("trEndBalance").style.display = "";
    } else {
        document.getElementById("trBeginBalance").style.display = "none";
        document.getElementById("trEndBalance").style.display = "none";
    }
    document.getElementById("idHistoryInfo").style.display = 'none';
}
function requestMBServiceFail(e) {

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


function resetViewWhenChangeAcc() {
    advSearchStatus = false;
    showAdvandSearch();
    advSearchStatus = true; //advande search ready
}


function checkServiceSuccess(gprsResp, codeService) {
    return (gprsResp.respCode == '0' && parseInt(gprsResp.responseType) == codeService);
}

function successPaggingCallback(strHtml) {
    var div = document.getElementById("id.search");
    div.innerHTML = strHtml;

    var tmpArr = new Array();
    genPagging(periodicResult, pageIndex);
}

function failPaggingCallback() {

}
function printAccHistory() {
    // Backup ngay trong dk search
    var fromDate = document.getElementById("id.begindate").value;
    var toDate = document.getElementById("id.enddate").value;

    var tmpNodeMain = document.getElementById("mainViewContent");
    var printNode = tmpNodeMain.getElementsByTagName("div")[0];
    var beforePrint = function () {
        document.getElementById("id.begindate").value = fromDate;
        document.getElementById("id.enddate").value = toDate;
    };
    var afterPrint = function () {
        document.getElementById("id.begindate").value = fromDate;
        document.getElementById("id.enddate").value = toDate;
        // createDatePicker("id.begindate", "span.begindate");
        //createDatePicker("id.enddate", "span.enddate");
    }
    printNodeWithAll(printNode, beforePrint, afterPrint);

}

function displayIdHtml(name, value) {
    document.getElementById(name).style.display = name;
}

function handleInputAcc(event) {
    if ((event.charCode >= 48 && event.charCode <= 57) || // 0-9
        (event.charCode >= 65 && event.charCode <= 90) || // A-Z
        (event.charCode >= 97 && event.charCode <= 122)) {
        return true;
    }
    return false;
}
function onChangeAccountNumber(event, element) {
    if (event == undefined) {
        event = window.event || event;
    }
    var keyUnicode = event.charCode || event.keyCode;
    if (event !== undefined) {
        switch (keyUnicode) {

            case 16:
                break; // Shift
            case 17:
                break; // Ctrl
            case 18:
                break; // Alt
            case 27:
                this.value = '';
                break; // Esc: clear entry
            case 35:
                break; // End
            case 36:
                break; // Home
            case 37:
                break; // cursor left
            case 38:
                break; // cursor up
            case 39:
                break; // cursor right
            case 40:
                break; // cursor down
            case 78:
                break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
            case 110:
                break; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
            case 190:
                break; // .
            default:
            {
                var ctrlDown = event.ctrlKey || event.metaKey // Mac support
                if (ctrlDown && keyUnicode == 65) return false; // a
                else if (ctrlDown && keyUnicode == 67) return false; // c
                else if (ctrlDown && keyUnicode == 86) return false; // v
                else if (ctrlDown && keyUnicode == 88) return false; // x
                element.value = element.value.replace(/[^a-zA-Z0-9]/g, '');
            }
        }
    }
}

function handleInputAmount(e, des) {
    var tmpVale = des.value;
    formatCurrency(e, des);
}

function calculateDifferentMonth(valFromDate, valToDate) {
    var from = valFromDate.split("/");
    var to = valToDate.split("/");
    var fromDate = new Date(parseInt(from[2], 10), parseInt(from[1], 10) - 1, parseInt(from[0], 10));
    var toDate = new Date(parseInt(to[2], 10), parseInt(to[1], 10) - 1, parseInt(to[0], 10));

    if (fromDate > toDate) {

        return null;
    }

    var months = 0;
    months = (toDate.getFullYear() - fromDate.getFullYear()) * 12;
    months -= fromDate.getMonth();
    months += toDate.getMonth();
    if (toDate.getDate() < fromDate.getDate()) {
        months--;
    }
    return months;
}

// thuatnt fixed
function genHtmlDoc(inArrAcc) {
    var length = inArrAcc.length;
    var contentItem = '';
    for (var i = 0; i < length; i++) {
        var inAccObj = inArrAcc[i];
        var transCode = "'" + inAccObj.TXTREFERENCENO + "'";
        var debit = "''";
        if (inAccObj.DEBIT != null)
            debit = "'" + formatNumberToCurrency(inAccObj.DEBIT) + "'";
        var date = "'" + inAccObj.DATBOOKDATE + "'";
        var entrySrNo = "'" + inAccObj.AC_ENTRY_SR_NO + "'";
        // title
        var contentHTML = '';
        contentHTML += "<table width='96%' align='center' class='recycler-table-ebank desktopview'>";
        contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
        contentHTML += "<td width='13%' class='recycler-row-align-midle'><span>" + CONST_STR.get('ACC_QUERY_TIME') + "</span></td>";
        contentHTML += "<td width='30%' class='recycler-row-align-midle'><span>" + CONST_STR.get('ACC_QUERY_EXPLAIN') + "</span></</td>";
        contentHTML += "<td width='12%' class='recycler-row-align-midle'><span>" + CONST_STR.get('ACC_QUERY_DEBIT') + "</span></td>";
        contentHTML += "<td width='12%' class='recycler-row-align-midle'><span>" + CONST_STR.get('ACC_QUERY_CREDIT') + "</span></td>";
        contentHTML += "<td width='13%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_SURPLUS') + "</span></td>";
        contentHTML += "<td width='21%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_TRANS_CODE') + "</span></td>";
        contentHTML += "</tr>";

        contentItem += '<tr class="recycler-row-title recycler-list">';
        contentItem += '<td class="recycler-row-align-midle-left"><span>' + inAccObj.DATBOOKDATE + '</span></td>';
        contentItem += '<td class="recycler-row-align-midle"><span>' + inAccObj.TXTTXNDESC + '</span></div></td>';
        if(inAccObj.DEBIT == null || inAccObj.DEBIT == undefined){
            contentItem += '<td class="recycler-row-align-midle"><span>' + ""  + '</span></td>';
        }else{
            contentItem += '<td class="recycler-row-align-midle"><span>' + formatNumberToCurrency(inAccObj.DEBIT)  + '</span></td>';
        }
        if(inAccObj.CREDIT == null || inAccObj.CREDIT == undefined){
            contentItem += '<td class="recycler-row-align-midle"><span>' + " "+ '</span></td>';
        }else{
            contentItem += '<td class="recycler-row-align-midle"><span>' + formatNumberToCurrency(inAccObj.CREDIT) + '</span></td>';
        }
        contentItem += '<td class="recycler-row-align-midle"><span>' + formatNumberToCurrency(inAccObj.RUNNING_BAL) + '</span></td>';
        contentItem += '<td class="recycler-row-align-midle-right" style="word-break: break-all;"><div class="content-detail"><span><a style="cursor:pointer; white-space:pre-wrap;" onclick="sendRequestReportDebit('
            + transCode + ',' + debit + ',' + date + ',' + entrySrNo + ')"'
            + 'href="javascript:void(0)">' + inAccObj.TXTREFERENCENO + '</a></span></div></td></tr>';
    }
    

    var contentItemmb = '';
    var contentHTMLmb = '';
    contentHTMLmb += "<div align='center' class='recycler-table-ebank  mobileview'>";
    for (var j = 0; j < length; j++) {
        var inAccObj = inArrAcc[j];
        
        if(inAccObj != undefined){
            contentItemmb += "<table style='margin-bottom:10px;' width='96%'  class='recycler-list'>";

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('ACC_QUERY_TIME') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.DATBOOKDATE + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('ACC_QUERY_EXPLAIN') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.TXTTXNDESC + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('ACC_QUERY_DEBIT') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  formatNumberToCurrency(inAccObj.DEBIT ? inAccObj.DEBIT : "") + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('ACC_QUERY_CREDIT') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  formatNumberToCurrency(inAccObj.CREDIT ? inAccObj.CREDIT : "") + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_SURPLUS') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  formatNumberToCurrency(inAccObj.RUNNING_BAL) + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_TRANS_CODE') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right" style="word-break: break-all;"><span><a style="cursor:pointer; white-space:pre-wrap;" onclick="sendRequestReportDebit('
                        + transCode + ',' + debit + ',' + date + ',' + entrySrNo + ')"'
                        + 'href="javascript:void(0)">' + inAccObj.TXTREFERENCENO + '</a></span></td></tr></table>';
        }
        }

    contentHTML += contentItem + "</tbody></table>";
    contentHTMLmb += contentItemmb + '</div>';
    return contentHTML += contentHTMLmb;
}

// xuat bao cao ghi no ghi co
function sendRequestReportDebit(pRefNo, pDrCr, pTime, pEntry_no) {
    var arr = new Array();
    var drcr = 'D';
    var idAccount;
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        idAccount = document.getElementById("acchis_accountno").value;
    } else {
        idAccount = document.getElementById("acchis_accountnomb").value;
    }
    arr.push(15);

    /* tao doi tuong client*/
    if (pDrCr == '')
        drcr = 'C';

    var objectValueClient = new Object();
    sequenceId = 15;
    objectValueClient.idtxn = "A11";
    objectValueClient.sequenceId = 15;
    objectValueClient.idAccount = idAccount;
    objectValueClient.trnRefNo = pRefNo;
    objectValueClient.drcr = drcr;
    objectValueClient.time = pTime;
    objectValueClient.entry_sr_no = pEntry_no;

    arr.push(objectValueClient);

    var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_EXPORT_EXCEL_REPORT"), "", "", gUserInfo.lang, gUserInfo.sessionID, arr);
    var data = getDataFromGprsCmd(gprsCmd);

    corpExportExcel(data);
}

function genPagging(totalPages, pageIdx) {
    var nodepage = document.getElementById('id.search');
    var tmpStr = genPageIndicatorHtml(totalPages, pageIdx); //Tong so trang - trang hien tai
    nodepage.innerHTML = tmpStr;
}
function pageIndicatorSelected(selectedIdx, selectedPage) {
    document.getElementById('tblContent').innerHTML = "";
    document.getElementById('id.search').innerHTML = "";

    var startIdx = (selectedIdx - 1) * itemsPerPage;
    var endIdx = startIdx + itemsPerPage;
    var listItemPage = new Array();

    for (var i = startIdx; i < endIdx; i++) {
        if (gAccount.listObject[i] != undefined) {
            listItemPage.push(gAccount.listObject[i]);
        }
    }
    document.getElementById('tblContent').innerHTML = genHtmlDoc(listItemPage);
    genPagging(totalPage, selectedIdx);
}
// end thuatnt