gTrans.idtxn = "T01";

gTrans.rowsPerPage = 10;
gTrans.pageIdx;

gTrans.results;
gTrans.curTrans;

gTrans.tmpSearchInfo;
gTrans.searchInfo;

function viewBackFromOther() {
    //Flag check
    gTrans.isBack = true;
}

/*function returnInputPage() {
 navController.initWithRootView('transfer/batch/make/batch-transfer-create', true);
 }*/

function viewDidLoadSuccess() {
    /*createDatePicker('id.begindate', 'span.begindate');
     createDatePicker('id.enddate', 'span.enddate');*/
    resizeMainViewContent();
    init();
}

function init() {
    angular.module('EbankApp').controller('batch-tranfer-mng-scr', function ($scope, requestMBServiceCorp) {
        if (gUserInfo.userRole.indexOf('CorpInput') == -1 || CONST_BROWSER_MODE == false) {
//            var element = document.getElementById("tr.tab");
//            element.style.display = 'none';
        }
        $scope.statusVN = {
            "ABH": "Đã duyệt",
            "INT": "Chờ duyệt",
            "REJ": "Từ chối",
            "APT": "Duyệt một phần",
            "RBH": "Duyệt không thành công",
            "CAC": "Hủy giao dịch",
            "STH": "Đang xử lý",
            "HBH": "Hồ sơ đã được tiếp nhận",
            "REH": "Hoàn chứng từ",
            "IBS": "Chờ duyệt bổ sung chứng từ",
            "APS": "Duyệt một phần BS chứng từ",
            "RES": "Từ chối BS chứng từ",
            "RBS": "Duyệt BS CTừ  không thành công",
            "SBS": "Đang xử lý BS chứng từ",
            "RJS": "TPBank từ chối BS chứng từ"
        };

        if (!gTrans.isBack) {
            gTrans.pageIdx = 1;
            gTrans.tmpSearchInfo = {};
            gTrans.searchInfo = {
                transType: "",
                maker: "",
                status: "",
                transId: "",
                fromDate: "",
                endDate: ""
            };

            // Lay du lieu khoi tao man hinh
            loadInitData();
        }

        gTrans.isBack = false;

        $scope.returnInputPage = function () {
            navController.initWithRootView('transfer/batch/make/batch-transfer-create', true);
        }

        $scope.showTransTypeSelection = function () {
            //--1. Xử lý chọn loại giao dịch
            var cbxValues = (gUserInfo.lang == 'EN') ? BATCH_SALARY_MNG_TRANS_TYPE_EN : BATCH_SALARY_MNG_TRANS_TYPE_VN;
            var cbxKeys = BATCH_SALARY_MNG_TRANS_TYPE_KEY;

            // Check xem user co quyen tra luong khong
            if (gUserInfo.userRole.indexOf("CorpSal") == -1 && gUserInfo.userRole.indexOf("CorpAuth") == -1) {
                cbxValues.splice(1, 1);
                cbxKeys.splice(1, 1);
            }

            addEventListenerToCombobox(handleSelectTransType, handleCloseTransTypeCbx);
            showDialogList(CONST_STR.get('COM_CHOOSEN_TYPE_TRANS'), cbxValues, cbxKeys, false);
        }
        //--2. Xử lý chọn trạng thái
        $scope.showTransStatusSelection = function () {
            var cbxValues = (gUserInfo.lang == 'EN') ? BATCH_SALARY_MNG_LIST_STATUS_EN : BATCH_SALARY_MNG_LIST_STATUS_VN;
            addEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
            showDialogList(CONST_STR.get('COM_CHOOSE_STATUS'), cbxValues, BATCH_SALARY_MNG_LIST_STATUS_KEY, false);

        }
        //--3. Xử lý chọn người lập
        $scope.showMakers = function () {
            var cbxText = [];
            var cbxValues = [];
            cbxText.push(CONST_STR.get("COM_ALL"));
            cbxValues.push("");
            for (var i in gTrans.listMakers) {
                var userId = gTrans.listMakers[i].IDUSER;
                cbxText.push(userId);
                cbxValues.push(userId);
            }
            addEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
            showDialogList(CONST_STR.get('COM_CHOOSE_MAKER'), cbxText, cbxValues, false);
        }

        // Thuc hien khi an nut tim kiem
        $scope.searchTransaction = function () {
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                gTrans.searchInfo.fromDate = document.getElementById("id.begindate").value;
                gTrans.searchInfo.endDate = document.getElementById("id.enddate").value;
            } else {
                gTrans.searchInfo.fromDate = document.getElementById("id.begindatemb").value;
                gTrans.searchInfo.endDate = document.getElementById("id.enddatemb").value;
            }
            gTrans.pageIdx = 1;

            gTrans.tmpSearchInfo = JSON.parse(JSON.stringify(gTrans.searchInfo)); //Clone object
            sendJSONRequest(gTrans.searchInfo);
        }

        //--4. Gửi thông tin tìm kiếm
        function sendJSONRequest(searchInfo) {
            document.getElementById('id.searchResult').innerHTML = "";
            document.getElementById('pageIndicatorNums').innerHTML = "";

            var jsonData = new Object();
            jsonData.sequence_id = "2";
            jsonData.idtxn = gTrans.idtxn;

            jsonData.transType = searchInfo.transType;
            jsonData.status = searchInfo.status;
            jsonData.maker = searchInfo.maker;
            jsonData.fromDate = searchInfo.fromDate;
            jsonData.endDate = searchInfo.endDate;

            jsonData.pageSize = gTrans.rowsPerPage;
            jsonData.pageIdx = gTrans.pageIdx;

            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_BATCH_SALARY_MANAGER'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true, requestMBServiceSuccess, function () {
                showAlertText(CONST_STR.get("CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA"));
            });
        }

        function requestMBServiceSuccess(e) {
            var resp = e;
            var tmpNode = document.getElementById('id.searchResult');
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                gTrans.rowsPerPage = 10;
            }else{
                gTrans.rowsPerPage = 5;
            }
            gTrans.curPage = 1;
            if (resp.respCode == '0' && resp.respJsonObj.length > 0) {
                gTrans.results = resp.respJsonObj;
                var listPending = new Array();
                gTrans.totalPages = getTotalPages(gTrans.results.length);
                if (gTrans.results.length > gTrans.rowsPerPage) {
                    for (var i = 0; i < gTrans.rowsPerPage; i++) {
                        listPending.push(gTrans.results[i]);
                    }
                } else {
                    for (var i = 0; i < gTrans.results.length; i++) {
                        listPending.push(gTrans.results[i]);
                    }
                }
                document.getElementById("id.searchResult").innerHTML = genHtmlDoc(listPending);
                document.getElementById("export-file").style.display = 'block';
                genPagging(gTrans.totalPages, gTrans.pageIdx);
            } else
                tmpNode.innerHTML = "<h5>" + CONST_STR.get("CORP_MSG_COM_NO_DATA_FOUND") + "</h5>";
        };
        $scope.searchTransaction();
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}
function genHtmlDoc(inArrAcc) {
    var length = inArrAcc.length;
    var contentItem = '';

    var i = (gTrans.curPage - 1) * gTrans.rowsPerPage;
    var j = i + gTrans.rowsPerPage;
    for (i; i < j; i++) {
        var inAccObj = inArrAcc[i];
        if (typeof inAccObj !== "undefined") {  
            inAccObj.NGUOI_DUYET = (inAccObj.NGUOI_DUYET != null) ? inAccObj.NGUOI_DUYET : '';
            inAccObj.TRANG_THAI_GD = (inAccObj.TRANG_THAI_GD != null) ? CONST_STR.get("COM_TRANS_STATUS_" + inAccObj.TRANG_THAI_GD) : '';
            // title
            var contentHTML = '';
            contentHTML += "<table width='96%' align='center' class='recycler-table-ebank desktopview'>";
            contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
            contentHTML += "<td width='6%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_NO') + "</span></td>";
            contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_CREATED_DATE') + "</span></td>";
            contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_TOTAL_NUM_AMOUNT') + "</span></td>";
            contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_APPROVE_STATUS') + "</span></td>";
            contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_CHEKER') + "</span></td>";
            contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_TRANSACTION_STATUS') + "</span></td>";
            contentHTML += "<td width='20%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_TRANS_CODE') + "</span></td>";
            contentHTML += "</tr>";  

            /* thuatnt cmt*/
            contentItem += '<tr class="recycler-row-title recycler-list">';
            contentItem += '<td class="recycler-row-align-midle"><span>' + (i + 1) + '</span></td>';
            contentItem += '<td class="recycler-row-align-midle"><span>'+inAccObj.NGAY_LAP+'</span></td>';
            contentItem += '<td class="recycler-row-align-midle"><span>'+formatNumberToCurrency(inAccObj.SO_TIEN)+'</span></td>';
            contentItem += '<td class="recycler-row-align-midle"><span>'+CONST_STR.get("TRANS_STATUS_" + inAccObj.TRANG_THAI)+'</span></td>';
            contentItem += '<td class="recycler-row-align-midle"><span>'+inAccObj.NGUOI_DUYET+'</span></td>';
            contentItem += '<td class="recycler-row-align-midle"><span>'+inAccObj.TRANG_THAI_GD+'</span></td>';
            contentItem += '<td class="recycler-row-align-midle" style="word-break: break-all;"><span><a style="cursor:pointer; white-space:pre-wrap;" onclick="showDetailTransaction('+i+')"'
            + 'href="javascript:void(0)">' + inAccObj.MA_GD + '</a></span></td></tr>';
        }
    }

    var contentItemmb = '';
    var contentHTMLmb = '';
    contentHTMLmb += "<div align='center' class='recycler-table-ebank  mobileview'>";
    var k = (gTrans.curPage - 1) * gTrans.rowsPerPage;
    for (k; k < j; k++) {
    var inAccObj = inArrAcc[k];
    if (inAccObj != undefined) {
        contentItemmb += "<table style='margin-bottom:10px;' width='96%'  class='recycler-list'>";
        contentItemmb += '<tr class="recycler-row-normal">';
        contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_NO') + '</span></td>';
        contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (k + 1) + '</span></td></tr>';

        contentItemmb += '<tr class="recycler-row-normal">';
        contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_CREATED_DATE') + '</span></td>';
        contentItemmb += '<td class="recycler-row-align-midle-right"><span>'+inAccObj.NGAY_LAP+'</span></td></tr>';

        contentItemmb += '<tr class="recycler-row-normal">';
        contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_TOTAL_NUM_AMOUNT') + '</span></td>';
        contentItemmb += '<td class="recycler-row-align-midle-right"><span>'+ formatNumberToCurrency(inAccObj.SO_TIEN)+'</span></td></tr>';

        contentItemmb += '<tr class="recycler-row-normal">';
        contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_APPROVE_STATUS') + '</span></td>';
        contentItemmb += '<td class="recycler-row-align-midle-right"><span>'+CONST_STR.get("TRANS_STATUS_" + inAccObj.TRANG_THAI)+'</span></td></tr>';

        contentItemmb += '<tr class="recycler-row-normal">';
        contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_APPROVE_STATUS') + '</span></td>';
        contentItemmb += '<td class="recycler-row-align-midle-right"><span>'+inAccObj.NGUOI_DUYET+'</span></td></tr>';

        contentItemmb += '<tr class="recycler-row-normal">';
        contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_APPROVE_STATUS') + '</span></td>';
        contentItemmb += '<td class="recycler-row-align-midle-right"><span>'+inAccObj.TRANG_THAI_GD+'</span></td></tr>';

        contentItemmb += '<tr class="recycler-row-normal">';
        contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_APPROVE_STATUS') + '</span></td>';
        contentItemmb += '<td class="recycler-row-align-midle-right"><span><a style="cursor:pointer; white-space:pre-wrap;" onclick="showDetailTransaction('+i+')"'
            + 'href="javascript:void(0)">' + inAccObj.MA_GD + '</a></span></td></tr></table>';
    }

}

contentHTML += contentItem + "</tbody></table>";
contentHTMLmb += contentItemmb + '</div>';
return contentHTML += contentHTMLmb +'<div align="right" style="float: right; width:100%">'
    + '<div id="pageIndicatorNums" style="text-align: right; display: inline-block;" /></div></div>';
}
function getTotalPages(totalRows) {
    return totalRows % gTrans.rowsPerPage == 0 ? Math.floor(totalRows / gTrans.rowsPerPage) : Math.floor(totalRows / gTrans.rowsPerPage) + 1;
}

function pageIndicatorSelected(selectedIdx, selectedPage) {
    gTrans.curPage = selectedIdx;

    var tmpNode = document.getElementById('id.searchResult');
    tmpNode.innerHTML = genHtmlDoc(gTrans.results);
    genPagging(gTrans.totalPages, gTrans.curPage);

}

function genPagging(totalPages, pageIdx) {
    var nodepage = document.getElementById('pageIndicatorNums');
    var tmpStr = genPageIndicatorHtml(totalPages, pageIdx);
    nodepage.innerHTML = tmpStr;
}

// Lay du lieu khoi tao man hinh
function loadInitData() {
    var jsonData = new Object();
    jsonData.sequence_id = "1";
    jsonData.idtxn = gTrans.idtxn;
    var args = new Array();
    args.push(null);
    args.push(jsonData);
    var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_BATCH_SALARY_MANAGER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
    var data = getDataFromGprsCmd(gprsCmd);
    requestMBServiceCorp(data, false, 0, function (data) {
        var resp = JSON.parse(data);
        if (resp.respCode == 0 && resp.respJsonObj.listMakers.length > 0) {
            //Danh sach nguoi duyet
            gTrans.listMakers = resp.respJsonObj.listMakers;
        } else
            gotoHomePage();
    }, function () {
        gotoHomePage();
    });
}

//--0. common
function addEventListenerToCombobox(selectHandle, closeHandle) {
    document.addEventListener("evtSelectionDialog", selectHandle, false);
    document.addEventListener("evtSelectionDialogClose", closeHandle, false);
}

function removeEventListenerToCombobox(selectHandle, closeHandle) {
    document.removeEventListener("evtSelectionDialog", selectHandle, false);
    document.removeEventListener("evtSelectionDialogClose", closeHandle, false);
}
//--END 0


function handleSelectTransType(e) {
    removeEventListenerToCombobox(handleSelectTransType, handleCloseTransTypeCbx);
    gTrans.searchInfo.transType = e.selectedValue2;
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        document.getElementById('id.trans-type').value = e.selectedValue1;
    } else {
        document.getElementById('id.trans-typemb').value = e.selectedValue1;
    }
}

function handleCloseTransTypeCbx() {
    removeEventListenerToCombobox(handleSelectTransType, handleCloseTransTypeCbx);
}
//--END 1

function handleSelectdTransStatus(e) {
    removeEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
    gTrans.searchInfo.status = e.selectedValue2;
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        document.getElementById("id.status").value = e.selectedValue1;
    } else {
        document.getElementById("id.statusmb").value = e.selectedValue1;
    }
}

function handleCloseTransStatusCbx(e) {
    removeEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
}
//--END 2

function handleSelectMaker(e) {
    removeEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
    gTrans.searchInfo.maker = e.selectedValue2;
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        document.getElementById('id.maker').value = e.selectedValue1;
    } else {
        document.getElementById('id.makermb').value = e.selectedValue1;
    }
}
function handleCloseMakerCbx() {
    removeEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
}
//--END 3

//Quay lại trang nhập
function showinputpage() {
    navController.initWithRootView('transfer/batch/make/batch-transfer-create');
}

//--6. Xử lý khi ấn vào mã giao dịch
function showDetailTransaction(idx) {
    gTrans.curTrans = gTrans.results[idx];

    var jsonData = new Object();
    jsonData.sequence_id = "3";
    jsonData.idtxn = gTrans.idtxn;

    jsonData.transId = gTrans.curTrans.MA_GD;
    jsonData.transType = gTrans.curTrans.IDTXN;
    var args = new Array();
    args.push(null);
    args.push(jsonData);
    var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_BATCH_SALARY_MANAGER'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
    var data = getDataFromGprsCmd(gprsCmd);

    requestMBServiceCorp(data, true, 0, getDetailTransSuccess, function () {
        showAlertText(CONST_STR.get("CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA"));
    });
}

function getDetailTransSuccess(data) {
    var resp = JSON.parse(data);

    if (resp.respCode == 0) {
        /*var docXml = createXMLDoc();
         var tmpXmlRootNode = createXMLNode('review', '', docXml);

         var tmpXmlNodeInfo = createXMLNode('transinfo', '', docXml, tmpXmlRootNode);
         var tmpXmlNodeTransTitle = createXMLNode('transtitle', CONST_STR.get('COM_TRANS_DETAILS'), docXml, tmpXmlNodeInfo);

         var tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
         createXMLNode('key', CONST_STR.get('COM_TRANS_CODE'), docXml, tmpTransContentNode);
         createXMLNode('value', gTrans.curTrans.MA_GD, docXml, tmpTransContentNode);

         tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
         createXMLNode('key', CONST_STR.get('COM_CREATED_DATE'), docXml, tmpTransContentNode);
         createXMLNode('value', gTrans.curTrans.NGAY_LAP, docXml, tmpTransContentNode);

         tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
         createXMLNode('key', CONST_STR.get('COM_CHECK_DATE'), docXml, tmpTransContentNode);
         createXMLNode('value', gTrans.curTrans.NGAY_DUYET, docXml, tmpTransContentNode);

         tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
         createXMLNode('key', CONST_STR.get('COM_APPROVE_STATUS'), docXml, tmpTransContentNode);
         createXMLNode('value', CONST_STR.get('TRANS_STATUS_' + gTrans.curTrans.TRANG_THAI), docXml, tmpTransContentNode);*/
        gTrans.curTrans.TRANG_THAI_VIEW = CONST_STR.get('TRANS_STATUS_' + gTrans.curTrans.TRANG_THAI);

        if (gTrans.curTrans.LY_DO_TU_CHOI && gTrans.curTrans.LY_DO_TU_CHOI != null) {
            /*tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
             createXMLNode('key', CONST_STR.get('AUTHORIZE_UNABLE_TO_CHECK'), docXml, tmpTransContentNode);
             createXMLNode('value', gTrans.curTrans.LY_DO_TU_CHOI, docXml, tmpTransContentNode);*/
            gTrans.curTrans.LY_DO_TU_CHOI;
        }

        /*tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
         createXMLNode('key', CONST_STR.get('BATCH_SALARY_NUMB_OF_RECEIVER'), docXml, tmpTransContentNode);
         createXMLNode('value', resp.respJsonObj.length, docXml, tmpTransContentNode);*/
        gTrans.curTrans.numbOfReceiver = resp.respJsonObj.length;

        var numbOfSuccess = 0;
        var totalTransSuccess = 0;
        var fee = 0;
        for (var i in resp.respJsonObj) {
            var trans = resp.respJsonObj[i];
            if (trans.SO_TIEN != null)
                totalTransSuccess += parseInt(trans.SO_TIEN);
            if (trans.PHI != null)
                fee += parseInt(trans.PHI);
            if (trans.TRANG_THAI == 'ABH') {
                numbOfSuccess++;
            }
        }

        /*tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
         createXMLNode('key', CONST_STR.get('BATCH_SALARY_NUMB_OF_RECEIVER_SUCCESS'), docXml, tmpTransContentNode);
         createXMLNode('value', numbOfSuccess, docXml, tmpTransContentNode);*/
        gTrans.curTrans.numbOfSuccess = numbOfSuccess;

        /*tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
         createXMLNode('key', CONST_STR.get('TRANS_BATCH_ACC_LABEL'), docXml, tmpTransContentNode);
         createXMLNode('value', gTrans.curTrans.TK_CHUYEN, docXml, tmpTransContentNode);

         tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
         createXMLNode('key', CONST_STR.get('TOTAL_AMOUNT_TRANS_SUCCESS'), docXml, tmpTransContentNode);
         createXMLNode('value', formatNumberToCurrency(totalTransSuccess) + " VND", docXml, tmpTransContentNode);*/
        gTrans.curTrans.totalTransView = formatNumberToCurrency(totalTransSuccess) + " VND";
        /*tmpTransContentNode = createXMLNode('transcontent', '', docXml, tmpXmlNodeInfo);
         createXMLNode('key', CONST_STR.get('TRANSFER_LIST_TOTAL_FEE'), docXml, tmpTransContentNode);
         createXMLNode('value', formatNumberToCurrency(fee) + " VND", docXml, tmpTransContentNode);*/
        gTrans.curTrans.TotalFeeView = formatNumberToCurrency(fee) + " VND";
        resp.transInfo = gTrans.curTrans;
        setRespObjStore(resp);

        navCachedPages["transfer/batch/mng/batch-transfer-trans-detail"] = null;
        navController.pushToView("transfer/batch/mng/batch-transfer-trans-detail", true, 'html');
    } else
        showAlertText(CONST_STR.get("CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA"));

}
//--END 6

/**
 * Gui request xuat excel
 * @author TrungVQ.FPT
 * @date   2015-12-29
 * @return void
 */
function sendRequestExportExcel() {
    var request = {
        sequenceId: 10,
        idtxn: gTrans.idtxn,
        transType: gTrans.searchInfo.transType,
        status: gTrans.searchInfo.status,
        maker: gTrans.searchInfo.maker,
        fromDate: gTrans.searchInfo.fromDate,
        endDate: gTrans.searchInfo.endDate
    };

    var args = ["", request];

    var gprsCmd = new GprsCmdObj(CONSTANTS.get('COM_EXPORT_EXCEL_REPORT'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
    var data = getDataFromGprsCmd(gprsCmd);

    corpExportExcel(data);
}