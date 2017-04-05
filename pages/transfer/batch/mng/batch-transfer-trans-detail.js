gTrans.idtxn = "T01";

var storedObj;
var gprsCmd;
var storedXML;
var transInfo;

gTrans.results2;
gTrans.rowsPerPage = 10;
gTrans.totalPages;
gTrans.currentPage;
gTrans.transInfo = {};

function returnInputPage() {
    navController.initWithRootView('transfer/batch/make/batch-transfer-create', true);
}

function viewBackFromOther() {
    //Flag check
    gTrans.isBack = true;
}

function loadInitXML() {
    storedXML = getReviewXmlStore();
    return storedXML;
}

function viewDidLoadSuccess() {
    init();
    gTrans.isBack = false;
    if (transInfo.TRANG_THAI != 'INT') {
        document.getElementById('btnNext').style.display = 'none';
    }else{
        document.getElementById('btnNext').style.display = '';
    }
}

function init() {
    angular.module('EbankApp').controller('batch-tranfer-trans-detail', function ($scope, requestMBServiceCorp) {
        // if (gUserInfo.userRole.indexOf('CorpInput') == -1) {
        //     document.getElementById("tr.tab").innerHTML = "";
        // }
        $scope.listObjTransDetail = transInfo;
        if (!gTrans.isBack) {
            storedObj = getRespObjStore();
            transInfo = storedObj.transInfo;

            gTrans.results2 = storedObj.respJsonObj;
            $scope.listObjTransDetail = transInfo;
            // $scope.MA_GD = transInfo.MA_GD;
            // $scope.NGAY_LAP = transInfo.NGAY_LAP;
            // $scope.NGAY_DUYET = transInfo.NGAY_DUYET;
            // $scope.TRANG_THAI_VIEW = transInfo.TRANG_THAI_VIEW;
            // $scope.LY_DO_TU_CHOI = transInfo.LY_DO_TU_CHOI;
            // $scope.numbOfReceiver = transInfo.numbOfReceiver;
            // $scope.numbOfSuccess = transInfo.numbOfSuccess;
            // $scope.TK_CHUYEN = transInfo.TK_CHUYEN;
            // $scope.totalTransView = transInfo.totalTransView;
            // $scope.TotalFeeView = transInfo.TotalFeeView;

            gTrans.totalPages = getTotalPages(gTrans.results2.length);
            genTableReview(1);

            if (transInfo.TRANG_THAI == 'INT' && gUserInfo.userRole.indexOf('CorpInput') != -1) {
                document.getElementById('btnNext').style.display = "";
            }
        }

        $scope.btnBackClick = function () {
            navController.popView(true);
        }

        $scope.btnNextClick = function () {
            //var xmlDoc = genXMLReviewSrc();
            var req = {
                sequence_id: "3",
                idtxn: gTrans.idtxn,
                transId: transInfo.MA_GD,
                transType: transInfo.IDTXN
            };
            gCorp.cmdType = CONSTANTS.get('CMD_BATCH_SALARY_MANAGER');
            gCorp.requests = [null, req];

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_BATCH_SALARY_MANAGER"), "", "", gUserInfo.lang, gUserInfo.sessionID, gCorp.requests);
            data = getDataFromGprsCmd(gprsCmd);

            // gọi service và xử lí logic
            requestMBServiceCorp.post(data, true, function (response) {
                var resp = response;
                if (resp.respCode == RESP.get('COM_SUCCESS')) {
                    var requestData = {
                        sequence_id: "3",
                        idtxn: gTrans.idtxn,
                        transId: transInfo.MA_GD,
                        transType: transInfo.IDTXN
                    }

                    gTrans.requestData = requestData;
                    gTrans.cmdType = CONSTANTS.get('CMD_BATCH_SALARY_MANAGER');
                    gTrans.src = "pages/transfer/batch/mng/batch-tranfer-trans-detail-view.html";
                    gTrans.ortherSrc = "transfer/batch/mng/batch-transfer-mng-scr";
                    gTrans.transInfo.transId = transInfo.MA_GD;
                    gTrans.transInfo.NGAY_LAP = transInfo.NGAY_LAP;

                    var tmpArr = (gUserInfo.lang == 'EN') ? BATCH_SALARY_MNG_TRANS_TYPE_EN : BATCH_SALARY_MNG_TRANS_TYPE_VN;
                    var transType = tmpArr[BATCH_SALARY_MNG_TRANS_TYPE_KEY.indexOf(transInfo.IDTXN)];
                    gTrans.transInfo.transType = transType;
                    gTrans.transInfo.TK_CHUYEN = transInfo.TK_CHUYEN;

                    var totalMoney = 0;
                    var totalFee = 0;
                    for (var i in storedObj.respJsonObj) {
                        totalMoney += parseInt(storedObj.respJsonObj[i].SO_TIEN);
                        totalFee += parseInt(storedObj.respJsonObj[i].PHI);
                    }

                    gTrans.transInfo.totalMoneyView = formatNumberToCurrency(totalMoney) + " VND";
                    gTrans.transInfo.totalFeeView = formatNumberToCurrency(totalFee) + " VND";
                    gTrans.transInfo.IDTXN = transInfo.IDTXN;
                    var listTran = storedObj.respJsonObj;
                    gTrans.transInfo.listPending = new Array();
                    if (transInfo.IDTXN == 'T16') {
                        for (var i in listTran) {
                            var tran = listTran[i];
                            tran.SO_TIEN_View = formatNumberToCurrency(tran.SO_TIEN) + " VND";
                            gTrans.transInfo.listPending.push(tran)
                        }
                    }
                    if (transInfo.IDTXN == 'T17') {
                        for (var i in listTran) {
                            var tran = listTran[i];
                            tran.SO_TIEN_View = formatNumberToCurrency(tran.SO_TIEN) + " VND";
                            gTrans.transInfo.listPending.push(tran)
                        }
                    }

                    navController.pushToView("common/common-review/transfer-review-scr", true, "html");
                    //genReviewScreen(resp.respJsonObj);
                } else if (resp.respCode == RESP.get('COM_VALIDATE_FAIL')
                    && resp.responseType == CONSTANTS.get('CMD_BATCH_SALARY_MANAGER')) {
                    showAlertText(response.respContent);
                } else if (resp.respCode == 38) {
                    showAlertText(CONST_STR.get('COM_TAX_AMOUNT_HIGH_THAN_BALANCE'));
                } else {
                    if (resp.respCode == '1019') {
                        showAlertText(resp.respContent);
                    } else {
                        showAlertText(CONST_STR.get('ERR_COM_TRANS_FAILED'));
                    }
                    var tmpPageName = navController.getDefaultPage();
                    var tmpPageType = navController.getDefaultPageType();
                    navController.initWithRootView(tmpPageName, true, tmpPageType);
                }
            });
            /*setReviewXmlStore(xmlDoc);
             navCachedPages["common/review/com-review"] = null;
             navController.pushToView("common/review/com-review", true, 'xsl');*/
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}


function genXMLReviewSrc() {
    var xmlDoc = createXMLDoc();

    var rootNode = createXMLNode("review", "", xmlDoc);
    var sectionNode = createXMLNode("section", "", xmlDoc, rootNode);

    var rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
    createXMLNode("label", CONST_STR.get('COM_TRANS_CODE'), xmlDoc, rowNode);
    createXMLNode("value", transInfo.MA_GD, xmlDoc, rowNode);

    rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
    createXMLNode("label", CONST_STR.get('BATCH_SALARY_PROCESSED_DATE'), xmlDoc, rowNode);
    createXMLNode("value", transInfo.NGAY_LAP, xmlDoc, rowNode);

    sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
    createXMLNode("title", CONST_STR.get('TRANS_ACCOUNT_INFO_BLOCK_TITLE'), xmlDoc, sectionNode);

    var tmpArr = (gUserInfo.lang == 'EN') ? BATCH_SALARY_MNG_TRANS_TYPE_EN : BATCH_SALARY_MNG_TRANS_TYPE_VN;
    var transType = tmpArr[BATCH_SALARY_MNG_TRANS_TYPE_KEY.indexOf(transInfo.IDTXN)];
    rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
    createXMLNode("label", CONST_STR.get('TOPUP_TRANS_TYPE_TITLE'), xmlDoc, rowNode);
    createXMLNode("value", transType, xmlDoc, rowNode);

    rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
    createXMLNode("label", CONST_STR.get('VIEW_TRANS_DETAIL_ACC'), xmlDoc, rowNode);
    createXMLNode("value", transInfo.TK_CHUYEN, xmlDoc, rowNode);

    var totalMoney = 0;
    var totalFee = 0;
    for (var i in storedObj.respJsonObj) {
        totalMoney += parseInt(storedObj.respJsonObj[i].SO_TIEN);
        totalFee += parseInt(storedObj.respJsonObj[i].PHI);
    }

    rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
    createXMLNode("label", CONST_STR.get('TRANSFER_LIST_TOTAL_AMOUNT'), xmlDoc, rowNode);
    createXMLNode("value", formatNumberToCurrency(totalMoney) + " VND", xmlDoc, rowNode);

    rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
    createXMLNode("label", CONST_STR.get('TRANSFER_LIST_TOTAL_FEE'), xmlDoc, rowNode);
    createXMLNode("value", formatNumberToCurrency(totalFee) + " VND", xmlDoc, rowNode);

    sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
    createXMLNode("paging", "", xmlDoc, sectionNode);
    createXMLNode("title", CONST_STR.get('CRP_SUM_DETAIL_TRANS'), xmlDoc, sectionNode);

    if (transInfo.IDTXN == 'T16') {
        var tableNode = createXMLNode("table", "", xmlDoc, sectionNode);
        var theadNode = createXMLNode("thead", "", xmlDoc, tableNode);
        createXMLNode("th", CONST_STR.get('COM_NO'), xmlDoc, theadNode);
        createXMLNode("th", CONST_STR.get('COM_RECEIVE_NAME'), xmlDoc, theadNode);
        createXMLNode("th", CONST_STR.get('COM_DESCRIPTION'), xmlDoc, theadNode);
        createXMLNode("th", CONST_STR.get('COM_AMOUNT'), xmlDoc, theadNode);
        createXMLNode("th", CONST_STR.get('COM_ACCOUNT_DEST'), xmlDoc, theadNode);

        var tbodyNode = createXMLNode("tbody", "", xmlDoc, tableNode);

        var listTran = storedObj.respJsonObj;
        for (var i in listTran) {
            var tran = listTran[i];
            var trNode = createXMLNode("tr", "", xmlDoc, tbodyNode);
            var tdNode = createXMLNode("td", parseInt(i) + 1, xmlDoc, trNode);
            createXMLNode("title", CONST_STR.get('COM_NO'), xmlDoc, tdNode);
            tdNode = createXMLNode("td", tran.NGUOI_NHAN, xmlDoc, trNode);
            createXMLNode("title", CONST_STR.get('COM_RECEIVE_NAME'), xmlDoc, tdNode);
            tdNode = createXMLNode("td", tran.MO_TA, xmlDoc, trNode);
            createXMLNode("title", CONST_STR.get('COM_DESCRIPTION'), xmlDoc, tdNode);
            tdNode = createXMLNode("td", formatNumberToCurrency(tran.SO_TIEN) + " VND", xmlDoc, trNode);
            createXMLNode("title", CONST_STR.get('COM_AMOUNT'), xmlDoc, tdNode);
            tdNode = createXMLNode("td", tran.TK_NHAN, xmlDoc, trNode);
            createXMLNode("title", CONST_STR.get('COM_ACCOUNT_DEST'), xmlDoc, tdNode);
        }
    }

    if (transInfo.IDTXN == 'T17') {
        var tableNode = createXMLNode("table", "", xmlDoc, sectionNode);
        var theadNode = createXMLNode("thead", "", xmlDoc, tableNode);
        createXMLNode("th", CONST_STR.get('COM_NO'), xmlDoc, theadNode);
        createXMLNode("th", CONST_STR.get('COM_RECEIVE_NAME'), xmlDoc, theadNode);
        createXMLNode("th", CONST_STR.get('COM_DESCRIPTION'), xmlDoc, theadNode);
        createXMLNode("th", CONST_STR.get('COM_AMOUNT'), xmlDoc, theadNode);
        createXMLNode("th", CONST_STR.get('COM_ACCOUNT_DEST'), xmlDoc, theadNode);
        createXMLNode("th", CONST_STR.get('COM_RECEIVER_BANK_NAME'), xmlDoc, theadNode);
        createXMLNode("th", CONST_STR.get('BATCH_SALARY_MNG_TIT_BRANCH_NAME'), xmlDoc, theadNode);
        createXMLNode("th", CONST_STR.get('COM_BANK_CODE'), xmlDoc, theadNode);

        var tbodyNode = createXMLNode("tbody", "", xmlDoc, tableNode);

        var listTran = storedObj.respJsonObj;
        for (var i in listTran) {
            var tran = listTran[i];
            var trNode = createXMLNode("tr", "", xmlDoc, tbodyNode);
            var tdNode = createXMLNode("td", parseInt(i) + 1, xmlDoc, trNode);
            createXMLNode("title", CONST_STR.get('COM_NO'), xmlDoc, tdNode);
            tdNode = createXMLNode("td", tran.NGUOI_NHAN, xmlDoc, trNode);
            createXMLNode("title", CONST_STR.get('COM_RECEIVE_NAME'), xmlDoc, tdNode);
            tdNode = createXMLNode("td", tran.MO_TA, xmlDoc, trNode);
            createXMLNode("title", CONST_STR.get('COM_DESCRIPTION'), xmlDoc, tdNode);
            tdNode = createXMLNode("td", formatNumberToCurrency(tran.SO_TIEN) + " VND", xmlDoc, trNode);
            createXMLNode("title", CONST_STR.get('COM_AMOUNT'), xmlDoc, tdNode);
            tdNode = createXMLNode("td", tran.TK_NHAN, xmlDoc, trNode);
            createXMLNode("title", CONST_STR.get('COM_ACCOUNT_DEST'), xmlDoc, tdNode);
            tdNode = createXMLNode("td", tran.TEN_NGAN_HANG, xmlDoc, trNode);
            createXMLNode("title", CONST_STR.get('COM_RECEIVER_BANK_NAME'), xmlDoc, tdNode);
            tdNode = createXMLNode("td", tran.TEN_CHI_NHANH, xmlDoc, trNode);
            createXMLNode("title", CONST_STR.get('BATCH_SALARY_MNG_TIT_BRANCH_NAME'), xmlDoc, tdNode);
            tdNode = createXMLNode("td", tran.MA_NGAN_HANG, xmlDoc, trNode);
            createXMLNode("title", CONST_STR.get('COM_BANK_CODE'), xmlDoc, tdNode);
        }

    }

    var buttonNode = createXMLNode("button", "", xmlDoc, rootNode);
    createXMLNode("type", "cancel", xmlDoc, buttonNode);
    createXMLNode("label", CONST_STR.get("COM_CANCEL"), xmlDoc, buttonNode);

    buttonNode = createXMLNode("button", "", xmlDoc, rootNode);
    createXMLNode("type", "back", xmlDoc, buttonNode);
    createXMLNode("label", CONST_STR.get("COM_BACK"), xmlDoc, buttonNode);

    buttonNode = createXMLNode("button", "", xmlDoc, rootNode);
    createXMLNode("type", "reject", xmlDoc, buttonNode);
    createXMLNode("label", CONST_STR.get("COM_TERMINATE_TRANS"), xmlDoc, buttonNode);

    return xmlDoc;
}

function getTotalPages(totalRows) {
    return totalRows % gTrans.rowsPerPage == 0 ? Math.floor(totalRows / gTrans.rowsPerPage) : Math.floor(totalRows / gTrans.rowsPerPage) + 1;
}

function genPagging(totalPages, pageIdx) {
    var nodepage = document.getElementById('pageIndicatorNums');
    var tmpStr = genPageIndicatorHtml(totalPages, pageIdx); //Tong so trang - trang hien tai
    nodepage.innerHTML = tmpStr;
}

function genTableReview(curPage) {
    document.getElementById("table-detail").innerHTML = "";
    document.getElementById("pageIndicatorNums").innerHTML = "";
    gTrans.currentPage = curPage;

    document.getElementById("table-detail").innerHTML = genHtmlTblDoc(curPage);
    genPagging(gTrans.totalPages, gTrans.currentPage);
    /*var docXml;
     if (transInfo.IDTXN == "T16") {
     docXml = genT16Table(gTrans.currentPage);
     }
     if (transInfo.IDTXN == "T17") {
     docXml = genT17Table(gTrans.currentPage);
     }

     var docXsl = getCachePageXsl("transfer/batch/mng/batch-transfer-trans-detail-tbl");

     genHTMLStringWithXML(docXml, docXsl, function (html) {
     document.getElementById("table-detail").innerHTML = html;
     genPagging(gTrans.totalPages, gTrans.currentPage);
     });*/
}

function genHtmlTblDoc(curPage) {
    var idx = (curPage - 1) * gTrans.rowsPerPage;
    var length = idx + gTrans.rowsPerPage;
    var contentItem = '';

    if (transInfo.IDTXN == "T16") {
        for (var i = idx; i < length; i++) {
            var tran = gTrans.results2[i];
            if (tran != undefined) {
                var contentHTML = '';
                contentHTML += "<table class='recycler-table-ebank' align='center' width='98%'>";
                contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
                contentHTML += "<td class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_NO') + "</span></td>";
                contentHTML += "<td class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_RECEIVE_NAME') + "</span></td>";
                contentHTML += "<td class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_DESCRIPTION') + "</span></td>";
                contentHTML += "<td class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_AMOUNT') + "</span></td>";
                contentHTML += "<td class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_ACCOUNT_DEST') + "</span></td>";
                contentHTML += "<td class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_STATUS') + "</span></td>";
                contentHTML += "<td class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_TRANS_CODE') + "</span></td>";
                contentHTML += "</tr>";
                // value
                contentItem += '<tr class="recycler-row-title recycler-list">';
                contentItem += '<td class="recycler-row-align-midle"><span">' + (i + 1) + '</span></td>';
                contentItem += '<td class="recycler-row-align-midle"><span">' + tran.NGUOI_NHAN + '</span></td>';
                contentItem += '<td class="recycler-row-align-midle"><span">' + tran.MO_TA + '</span></td>';
                contentItem += '<td class="recycler-row-align-midle"><span">' + formatNumberToCurrency(tran.SO_TIEN) + " VND" + '</span></td>';
                contentItem += '<td class="recycler-row-align-midle"><span">' + tran.TK_NHAN + '</span></td>';
                contentItem += '<td class="recycler-row-align-midle"><span">' + CONST_STR.get('TRANS_STATUS_' + tran.TRANG_THAI) + '</span></td>';
                contentItem += '<td class="recycler-row-align-midle"><span>' + tran.MA_GD + '</span></td></tr>';
            }

        }
        contentHTML += contentItem + "</tbody></table>";
        return contentHTML;
    }
    if (transInfo.IDTXN == "T17") {
        for (var i = idx; i < length; i++) {
            var tran = gTrans.results2[i];
            if (tran != undefined) {
                var contentHTML = '';
                contentHTML += "<table width='96%' align='center' class='table-account recycler-table-ebank'>";
                contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
                contentHTML += "<td width='5%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_NO') + "</span></td>";
                contentHTML += "<td width='10%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_RECEIVE_NAME') + "</span></td>";
                contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_DESCRIPTION') + "</span></td>";
                contentHTML += "<td width='10%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_AMOUNT') + "</span></td>";
                contentHTML += "<td width='10%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_ACCOUNT_DEST') + "</span></td>";
                contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_RECEIVER_BANK_NAME') + "</span></td>";
                contentHTML += "<td width='10%' class='recycler-row-align-midle'><span>" + CONST_STR.get('BATCH_SALARY_MNG_TIT_BRANCH_NAME') + "</span></td>";
                contentHTML += "<td width='10%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_STATUS') + "</span></td>";
                contentHTML += "<td width='12%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_BANK_CODE') + "</span></td>";
                contentHTML += "</tr>";
                // value
                contentItem += '<tr class="recycler-row-title recycler-list">';
                contentItem += '<td width="5%" class="recycler-row-align-midle"><div class="mobile-mode"><span>'+ CONST_STR.get('COM_NO') +'</span></div><div class="content-detail"><span>' + (i + 1) + '</span></div></td>';
                contentItem += '<td width="10%" class="recycler-row-align-midle"><div class="mobile-mode"><span>'+ CONST_STR.get('COM_RECEIVE_NAME') +'</span></div><div class="content-detail"><span>' + tran.NGUOI_NHAN + '</span></div></td>';
                contentItem += '<td width="14%" class="recycler-row-align-midle"><div class="mobile-mode"><span>'+ CONST_STR.get('COM_DESCRIPTION') +'</span></div><div class="content-detail"><span>' + tran.MO_TA + '</span></div></td>';
                contentItem += '<td width="10%" class="recycler-row-align-midle"><div class="mobile-mode"><span>'+ CONST_STR.get('COM_AMOUNT') +'</span></div><div class="content-detail"><span>' + formatNumberToCurrency(tran.SO_TIEN) + " VND" + '</span></div></td>';
                contentItem += '<td width="10%" class="recycler-row-align-midle"><div class="mobile-mode"><span>'+ CONST_STR.get('COM_ACCOUNT_DEST') +'</span></div><div class="content-detail"><span>' + tran.TK_NHAN + '</span></div></td>';
                contentItem += '<td width="12%" class="recycler-row-align-midle"><div class="mobile-mode"><span>'+ CONST_STR.get('COM_RECEIVER_BANK_NAME') +'</span></div><div class="content-detail"><span>' + tran.TEN_NGAN_HANG + '</span></div></td>';
                contentItem += '<td width="10%" class="recycler-row-align-midle"><div class="mobile-mode"><span>'+ CONST_STR.get('BATCH_SALARY_MNG_TIT_BRANCH_NAME') +'</span></div><div class="content-detail"><span>' + tran.MA_NGAN_HANG + '</span></div></td>';
                contentItem += '<td width="10%" class="recycler-row-align-midle"><div class="mobile-mode"><span>'+ CONST_STR.get('COM_STATUS') +'</span></div><div class="content-detail"><span>' + CONST_STR.get('TRANS_STATUS_' + tran.TRANG_THAI) + '</span></div></td>';
                contentItem += '<td width="12%" class="recycler-row-align-midle"><div class="mobile-mode"><span>'+ CONST_STR.get('COM_BANK_CODE') +'</span></div><div class="content-detail" style="word-break: break-all;"><span>' + tran.MA_GD + '</span></div></td>';





                // contentItem += '<td class="recycler-row-align-midle"><span">' + tran.NGUOI_NHAN + '</span></td>';
                // contentItem += '<td class="recycler-row-align-midle"><span">' + tran.MO_TA + '</span></td>';
                // contentItem += '<td class="recycler-row-align-midle"><span">' + formatNumberToCurrency(tran.SO_TIEN) + " VND" + '</span></td>';
                // contentItem += '<td class="recycler-row-align-midle"><span">' + tran.TK_NHAN + '</span></td>';
                // contentItem += '<td class="recycler-row-align-midle"><span">' + tran.TEN_NGAN_HANG + '</span></td>';
                // contentItem += '<td class="recycler-row-align-midle"><span">' + tran.MA_NGAN_HANG + '</span></td>';
                // contentItem += '<td class="recycler-row-align-midle"><span">' + CONST_STR.get('TRANS_STATUS_' + tran.TRANG_THAI) + '</span></td>';
                // contentItem += '<td class="recycler-row-align-midle"><span>' + tran.MA_GD + '</span></td></tr>';
            }

        }
        contentHTML += contentItem + "</tbody></table>";
        return contentHTML;
    }
}

function genT16Table(curPage) {
    var docXml = createXMLDoc();
    var tmpXmlRootNode = createXMLNode('review', '', docXml);

    var titles = createXMLNode('titles', '', docXml, tmpXmlRootNode);
    createXMLNode('table-title', CONST_STR.get('COM_NO'), docXml, titles);
    createXMLNode('table-title', CONST_STR.get('COM_RECEIVE_NAME'), docXml, titles);
    createXMLNode('table-title', CONST_STR.get('COM_DESCRIPTION'), docXml, titles);
    createXMLNode('table-title', CONST_STR.get('COM_AMOUNT'), docXml, titles);
    createXMLNode('table-title', CONST_STR.get('COM_ACCOUNT_DEST'), docXml, titles);
    createXMLNode('table-title', CONST_STR.get('COM_STATUS'), docXml, titles);
    createXMLNode('table-title', CONST_STR.get('COM_TRANS_CODE'), docXml, titles);

    var rows = createXMLNode('rows', '', docXml, tmpXmlRootNode);

    var idx = (curPage - 1) * gTrans.rowsPerPage;
    for (var i = idx; i < idx + gTrans.rowsPerPage; i++) {
        var tran = gTrans.results2[i];
        if (tran) {
            var row = createXMLNode('row', '', docXml, rows);
            var tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_NO'), docXml, tableContent);
            createXMLNode('content', parseInt(i) + 1, docXml, tableContent);

            tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_RECEIVE_NAME'), docXml, tableContent);
            createXMLNode('content', tran.NGUOI_NHAN, docXml, tableContent);

            tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_DESCRIPTION'), docXml, tableContent);
            createXMLNode('content', tran.MO_TA, docXml, tableContent);

            tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_AMOUNT'), docXml, tableContent);
            createXMLNode('content', formatNumberToCurrency(tran.SO_TIEN) + " VND", docXml, tableContent);

            tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_ACCOUNT_DEST'), docXml, tableContent);
            createXMLNode('content', tran.TK_NHAN, docXml, tableContent);

            tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_STATUS'), docXml, tableContent);
            createXMLNode('content', CONST_STR.get('TRANS_STATUS_' + tran.TRANG_THAI), docXml, tableContent);

            tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_TRANS_CODE'), docXml, tableContent);
            createXMLNode('content', tran.MA_GD, docXml, tableContent);
        }
    }

    return docXml;
}

function genT17Table(curPage) {
    var docXml = createXMLDoc();
    var tmpXmlRootNode = createXMLNode('review', '', docXml);

    var titles = createXMLNode('titles', '', docXml, tmpXmlRootNode);
    createXMLNode('table-title', CONST_STR.get('COM_NO'), docXml, titles);
    createXMLNode('table-title', CONST_STR.get('COM_RECEIVE_NAME'), docXml, titles);
    createXMLNode('table-title', CONST_STR.get('COM_DESCRIPTION'), docXml, titles);
    createXMLNode('table-title', CONST_STR.get('COM_AMOUNT'), docXml, titles);
    createXMLNode('table-title', CONST_STR.get('COM_ACCOUNT_DEST'), docXml, titles);
    createXMLNode('table-title', CONST_STR.get('COM_RECEIVER_BANK_NAME'), docXml, titles);
    createXMLNode('table-title', CONST_STR.get('BATCH_SALARY_MNG_TIT_BRANCH_NAME'), docXml, titles);
    createXMLNode('table-title', CONST_STR.get('COM_BANK_CODE'), docXml, titles);
    createXMLNode('table-title', CONST_STR.get('COM_STATUS'), docXml, titles);
    createXMLNode('table-title', CONST_STR.get('COM_TRANS_CODE'), docXml, titles);

    var rows = createXMLNode('rows', '', docXml, tmpXmlRootNode);

    var idx = (curPage - 1) * gTrans.rowsPerPage;
    for (var i = idx; i < idx + gTrans.rowsPerPage; i++) {
        var tran = gTrans.results2[i];
        if (tran) {
            var row = createXMLNode('row', '', docXml, rows);
            var tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_NO'), docXml, tableContent);
            createXMLNode('content', parseInt(i) + 1, docXml, tableContent);

            tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_RECEIVE_NAME'), docXml, tableContent);
            createXMLNode('content', tran.NGUOI_NHAN, docXml, tableContent);

            tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_DESCRIPTION'), docXml, tableContent);
            createXMLNode('content', tran.MO_TA, docXml, tableContent);

            tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_AMOUNT'), docXml, tableContent);
            createXMLNode('content', formatNumberToCurrency(tran.SO_TIEN) + " VND", docXml, tableContent);

            tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_ACCOUNT_DEST'), docXml, tableContent);
            createXMLNode('content', tran.TK_NHAN, docXml, tableContent);

            tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_RECEIVER_BANK_NAME'), docXml, tableContent);
            createXMLNode('content', tran.TEN_NGAN_HANG, docXml, tableContent);

            tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('BATCH_SALARY_MNG_TIT_BRANCH_NAME'), docXml, tableContent);
            createXMLNode('content', tran.TEN_CHI_NHANH, docXml, tableContent);

            tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_BANK_CODE'), docXml, tableContent);
            createXMLNode('content', tran.MA_NGAN_HANG, docXml, tableContent);

            tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_STATUS'), docXml, tableContent);
            createXMLNode('content', CONST_STR.get('TRANS_STATUS_' + tran.TRANG_THAI), docXml, tableContent);

            tableContent = createXMLNode('table-content', '', docXml, row);
            createXMLNode('title', CONST_STR.get('COM_TRANS_CODE'), docXml, tableContent);
            createXMLNode('content', tran.MA_GD, docXml, tableContent);
        }
    }

    return docXml;
}

function pageIndicatorSelected(selectedIdx, selectedPage) {
    genTableReview(selectedIdx);
}