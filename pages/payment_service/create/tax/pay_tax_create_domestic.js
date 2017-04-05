var flagLoadDomestic = true;
gTrans.transInfo = {};

/*** VIEW BACK FROM OTHER ***/
function viewBackFromOther() {
    flagLoadDomestic = true;
}

/*** INIT VIEW ***/
function loadInitXML() {
    return getReviewXmlStore();
}

/*** VIEW WILL UNLOAD ***/
function viewWillUnload() {
}

/*** VIEW LOAD SUCCESS ***/
// Thực hiện sau khi load trang thành công
/*function viewDidLoadSuccess() {
 // gen sequence form
 genSequenceForm();

 }*/
function viewDidLoadSuccess() {
    init();
    actionbar.showStepSequence("com-authentication-scr");

}
function init() {
    angular.module('EbankApp').controller('pay_tax_create_domestic', function ($scope, requestMBServiceCorp) {
        initBottomBar();
        // navController.getBottomBar().hide();
        $scope.initData = function () {
            if (flagLoadDomestic) {
                var objHeader = gTax.domesticData.ThongDiep.Header;
                var objError = gTax.domesticData.ThongDiep.ErrorCode;
                var objBody = gTax.domesticData.ThongDiep.Body;
                gTax.respCustObj = objBody;
                // MST
                $scope.MaSoThue = objBody.ThongTinThuNop.ThongTinDKT.MaSoThue;
                // Nguoi nop thue
                $scope.TenNNT = objBody.ThongTinThuNop.ThongTinDKT.TenNNT;
                //Dia chi nguoi nop thue
                $scope.Diachi = objBody.ThongTinThuNop.ThongTinDKT.Diachi;

                //Loai thue
                $scope.LoaiThue = gTax.taxTypeView;

                //Tai khoan thu NSNN
                //Lay gia tri TKNS trong obj

                var tkNSNN = [];
                var tmpObj = {};
                var finalTKNSNN = [];
                if (objBody.ThongTinThuePhaiNop.ThuePhaiNop.constructor === Array) {
                    for (var i = 0; i < objBody.ThongTinThuePhaiNop.ThuePhaiNop.length; i++) {
                        tkNSNN.push(objBody.ThongTinThuePhaiNop.ThuePhaiNop[i].TKNS);
                    }

                    //For de loai bot gia tri lap di
                    for (var i = 0; i < tkNSNN.length; i++) {
                        tmpObj[tkNSNN[i]] = "";
                    }

                    //for lan cuoi cung de dua ra mang;
                    for (var k in tmpObj) {
                        finalTKNSNN.push(k);
                    }

                    gTax.arrTKNSNN = finalTKNSNN;
                } else {
                    finalTKNSNN.push(objBody.ThongTinThuePhaiNop.ThuePhaiNop.TKNS);
                    gTax.arrTKNSNN = finalTKNSNN;
                }

                //CQ quan ly thu

                var maCQT = gTax.domesticData.ThongDiep.Body.ThongTinThuePhaiNop.ThuePhaiNop;
                if (maCQT.constructor === Array) {
                    $scope.TEN_CQ_THU = gTax.domesticData.ThongDiep.Body.ThongTinThuePhaiNop.ThuePhaiNop[0].MaCQT + " - " + gTax.treasuryData[0].TEN_CQ_THU;
                } else {
                    $scope.TEN_CQ_THU = gTax.domesticData.ThongDiep.Body.ThongTinThuePhaiNop.ThuePhaiNop.MaCQT + " - " + gTax.treasuryData[0].TEN_CQ_THU;
                }
                document.getElementById("id.valueTKNSNN").value = gTax.arrTKNSNN[0];
                document.getElementById("id.notifyTo").value = CONST_STR.get('COM_NOTIFY_' + gTax.methodSend);
                showTableByTKT();
            }

        }

        $scope.additionalDocuments = function () {
            var handleSelectTKNSNN = function (e) {
                if (currentPage == "payment_service/create/tax/pay_tax_create_domestic") {
                    document.removeEventListener("evtSelectionDialog", handleSelectTKNSNN, false);
                    if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                        document.getElementById('id.valueTKNSNN').value = e.selectedValue1;
                        showTableByTKT();
                    }
                    if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                        sttID = e.selectedValue2;
                    }
                }
            }

            var handleSelectTKNSNNClose = function () {
                if (currentPage == "payment_service/create/tax/pay_tax_create_domestic") {
                    document.removeEventListener("evtSelectionDialogClose", handleSelectTKNSNNClose, false);
                    document.removeEventListener("evtSelectionDialog", handleSelectTKNSNN, false);
                }
            }

            document.addEventListener("evtSelectionDialog", handleSelectTKNSNN, false);
            document.addEventListener("evtSelectionDialogClose", handleSelectTKNSNNClose, false);

            showDialogList(CONST_STR.get('TRANS_PERIODIC_DIALOG_TITLE_ACCTYPE'), gTax.arrTKNSNN, '', false);
        }


        $scope.getTreasuryNumber = function () {
            var valueArr = [];
            var keyArr = [];

            for (var i = 0; i < gTax.treasuryData.length; i++) {
                valueArr.push(gTax.treasuryData[i].TEN_KHO_BAC);
                keyArr.push(gTax.treasuryData[i].SO_HIEU_KHO_BAC);
            }

            var handleSelectTreasury = function (e) {
                if (currentPage == "payment_service/create/tax/pay_tax_create_domestic") {
                    document.removeEventListener("evtSelectionDialog", handleSelectTreasury, false);
                    if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                        document.getElementById('id.treasuryName').value = e.selectedValue1;
                    }
                    if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                        document.getElementById('id.treasuryNum').value = e.selectedValue2;
                    }
                }
            }

            var handleSelectTreasuryClose = function () {
                if (currentPage == "payment_service/create/tax/pay_tax_create_domestic") {
                    document.removeEventListener("evtSelectionDialogClose", handleSelectTreasuryClose, false);
                    document.removeEventListener("evtSelectionDialog", handleSelectTreasury, false);
                }
            }

            document.addEventListener("evtSelectionDialog", handleSelectTreasury, false);
            document.addEventListener("evtSelectionDialogClose", handleSelectTreasuryClose, false);
            showDialogList(CONST_STR.get('TAX_TREASURY_MNG_POP_TITLE'), valueArr, keyArr, false);
        }


        $scope.saveQueryInfo = function () {
            var saveTaxOptionsValue;
            var saveTaxOptionKey;
            saveTaxOptionsValue = (gUserInfo.lang == 'EN') ? CONST_TAX_INFO_QUERY_DOMESTIC_VALUE_EN : CONST_TAX_INFO_QUERY_DOMESTIC_VALUE_VN;
            saveTaxOptionKey = CONST_TAX_INFO_QUERY_DOMESTIC_KEY;

            document.addEventListener("evtSelectionDialog", handleSaveQueryInfo, false);
            document.addEventListener("evtSelectionDialogClose", handleSaveQueryInfoClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC'), saveTaxOptionsValue, saveTaxOptionKey, false);
        }

        function handleSaveQueryInfo(e) {
            if (currentPage == "payment_service/create/tax/pay_tax_create_domestic") {
                document.removeEventListener("evtSelectionDialog", handleSaveQueryInfo, false);
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('id.saveTaxQuery').value = e.selectedValue1;
                }
                if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                    document.getElementById('id.saveTaxQueryValue').value = e.selectedValue2;
                }
            }
        }

        function handleSaveQueryInfoClose() {
            if (currentPage == "payment_service/create/tax/pay_tax_create_domestic") {
                document.removeEventListener("evtSelectionDialogClose", handleSaveQueryInfoClose, false);
                document.removeEventListener("evtSelectionDialog", handleSaveQueryInfo, false);
            }
        }


        function showTableByTKT() {
            var tkt = document.getElementById("id.valueTKNSNN");
            var tmpArr = [];
            var respCustObj = gTax.domesticData.ThongDiep.Body;

            if (respCustObj.ThongTinThuePhaiNop.ThuePhaiNop.constructor === Array) {
                for (var i = 0; i < respCustObj.ThongTinThuePhaiNop.ThuePhaiNop.length; i++) {
                    if (respCustObj.ThongTinThuePhaiNop.ThuePhaiNop[i].TKNS == tkt.value) {
                        tmpArr.push(respCustObj.ThongTinThuePhaiNop.ThuePhaiNop[i]);
                    }
                }
            } else {
                tmpArr.push(respCustObj.ThongTinThuePhaiNop.ThuePhaiNop);
            }

            gTax.thongTinGiaoDich = tmpArr;
            //document.getElementById('divTable').innerHTML = '';
            for (var i = 0; i < gTax.thongTinGiaoDich.length; i++) {
//                gTax.thongTinGiaoDich[i].SoPhaiNop = formatNumberToCurrency(gTax.thongTinGiaoDich[i].SoPhaiNop) + ' VND';
                gTax.thongTinGiaoDich[i].SoPhaiNopView = formatNumberToCurrency(gTax.thongTinGiaoDich[i].SoPhaiNop) + ' VND';
            }
            $scope.listPending = gTax.thongTinGiaoDich;
            //genTableResults(tmpArr);
        }

        /*function genTableResults(displayRows) {
         var docXml = createXMLDoc();
         var tmpXmlRootNode = createXMLNode('review', '', docXml);

         var tableNodes = createXMLNode('transtables', '', docXml, tmpXmlRootNode);
         var table = createXMLNode('table', '', docXml, tableNodes);
         var titles = createXMLNode('titles', '', docXml, table);
         createXMLNode('table-title', CONST_STR.get('COM_NO'), docXml, titles);
         createXMLNode('table-title', CONST_STR.get('TAX_CHAPTER'), docXml, titles);              // Chương
         createXMLNode('table-title', CONST_STR.get('TAX_CONTENT'), docXml, titles);              // ND kinhtế
         createXMLNode('table-title', CONST_STR.get('TRANS_LOCAL_AMOUNT_TITLE'), docXml, titles); // Số tiền

         var rows = createXMLNode('rows', '', docXml, table);
         for (var i = 0; i < displayRows.length; i++) {
         var row = createXMLNode('row', '', docXml, rows);
         createXMLNode('idx', parseInt(i) + 1, docXml, row);
         var cotent = createXMLNode('cotent', '', docXml, row);
         createXMLNode('class', "td-head-color", docXml, cotent);

         createXMLNode('table-content-title', CONST_STR.get('COM_NO'), docXml, cotent);
         createXMLNode('table-content', parseInt(i) + 1, docXml, cotent);

         cotent = createXMLNode('cotent', '', docXml, row);
         createXMLNode('table-content-title', CONST_STR.get('TAX_CHAPTER'), docXml, cotent);
         createXMLNode('table-content', displayRows[i].MaChuong, docXml, cotent);

         cotent = createXMLNode('cotent', '', docXml, row);
         createXMLNode('table-content-title', CONST_STR.get('TAX_CONTENT'), docXml, cotent);
         createXMLNode('table-content', displayRows[i].MaTieuMuc, docXml, cotent);

         cotent = createXMLNode('cotent', '', docXml, row);
         createXMLNode('table-content-title', CONST_STR.get('TRANS_LOCAL_AMOUNT_TITLE'), docXml, cotent);
         createXMLNode('table-content', formatNumberToCurrency(displayRows[i].SoPhaiNop) + ' VND', docXml, cotent);
         createXMLNode('class', 'td-right', docXml, cotent);
         }

         var docXsl = getCachePageXsl("payment_service/create/tax/pay_tax_create_domestic_tbl");

         genHTMLStringWithXML(docXml, docXsl, function (html) {
         var tmpNode = document.getElementById('divTable');
         tmpNode.innerHTML = html;
         });
         }*/

        $scope.sendJsonRequest = function () {
            var msgCheck = new Array();
            // Lay ra thong tin chung
            var allInfo = {};
            allInfo = gTax.domesticData.ThongDiep.Body.ThongTinThuNop.ThongTinDKT;

            var dataTreasuryNum = document.getElementById('id.treasuryNum').value;
            for (var i = 0; i < gTax.treasuryData.length; i++) {
                if (gTax.treasuryData[i].SO_HIEU_KHO_BAC == dataTreasuryNum) {
                    allInfo.treasury = gTax.treasuryData[i].SO_HIEU_KHO_BAC;
                    allInfo.treasuryAccount = document.getElementById("id.valueTKNSNN").value;
                    allInfo.treasuryName = gTax.treasuryData[i].TEN_KHO_BAC;
                    allInfo.coQuanThu = gTax.treasuryData[i].TEN_CQ_THU;
                    break;
                }
            }

            // Lay thong tin giao dich
            var dataCheckBox = document.getElementsByName('userRefId');
            var dataCheck = '';
            if (dataCheckBox.length === undefined) {
                if (dataCheckBox.checked == true) {
                    dataCheck = "0";
                }
            } else {
                for (var i = 0; i < dataCheckBox.length; i++) {
                    if (i < dataCheckBox.length/2){
                        if (dataCheckBox[i].checked == true && dataCheck == '') {
                            dataCheck = "" + i;
                        } else if (dataCheckBox[i].checked == true && dataCheck != "") {
                            dataCheck = dataCheck + ":" + i;
                        }
                    }
                    else
                    {
                        if (dataCheckBox[i].checked == true && dataCheck == '') {
                            dataCheck = "" + (i - dataCheckBox.length/2);
                        } else if (dataCheckBox[i].checked == true && dataCheck != "") {
                            dataCheck = dataCheck + ":" + (i - dataCheckBox.length/2);
                        }
                    }
                }
            }

            // Check việc chọn item trong phần thông tin giao dịch
            if (dataCheck == '') {
                msgCheck.push(CONST_STR.get('CORP_MSG_TAX_CHOOSE_ITEM'));
            }

            // Check item [Số hiệu kho bạc]
            if (allInfo.treasury === undefined || allInfo.treasury == '') {
                msgCheck.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('TAX_TREASURY_CODE_1')]));
            }

            if (msgCheck.length > 0) {
                showAlertText(msgCheck[0]);
            } else {
                var argsArray = [];
                argsArray.push("4");
                argsArray.push(JSON.stringify({
                    idtxn: "B11",
                    taxType: gTax.taxType,
                    accountNo: gTax.accountNo,
                    allInfo: allInfo,
                    tranfDtl: gTax.thongTinGiaoDich,
                    chooseData: dataCheck,
                    isSave: document.getElementById('id.saveTaxQueryValue').value
                }));

                var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_PAY_TAX_PROCESSOR"), "", "", gUserInfo.lang, gUserInfo.sessionID, argsArray);
                data = getDataFromGprsCmd(gprsCmd);

                // gọi service và xử lí logic
                requestMBServiceCorp.post(data, true, function (response) {
                    var resp = response;
                    if (resp.respCode == RESP.get('COM_SUCCESS')
                        && resp.responseType == CONSTANTS.get('CMD_CO_PAY_TAX_PROCESSOR')) {
                        var requestData = {
                            transId: response.respJsonObj.transaction_id,
                            sequence_id: 5,
                            userID: gTax.accountNo,
                            idtxn: response.respJsonObj.idtxn
                        }

                        gTrans.requestData = requestData;
                        gTrans.cmdType = CONSTANTS.get('CMD_CO_PAY_TAX_PROCESSOR');
                        gTrans.src = "pages/payment_service/create/tax/view/pay_tax_create_domestic_view.html";
                        gTrans.transInfo.accountNo = gTax.accountNo;
                        gTrans.transInfo.soDuKhaDungView = gTax.soDuKhaDung + ' VND';
                        gTrans.transInfo.MaSoThue = gTax.domesticData.ThongDiep.Body.ThongTinThuNop.ThongTinDKT.MaSoThue;
                        gTrans.transInfo.TenNNT = gTax.domesticData.ThongDiep.Body.ThongTinThuNop.ThongTinDKT.TenNNT;
                        gTrans.transInfo.Diachi = gTax.domesticData.ThongDiep.Body.ThongTinThuNop.ThongTinDKT.Diachi;
                        gTrans.transInfo.taxTypeView = (gUserInfo.lang == 'EN') ? gTax.taxType + " - " + CONST_TRANS_PAY_TAX_TYPE_VALUE_EN[parseInt(gTax.taxType) - 1] : gTax.taxType + " - " + CONST_TRANS_PAY_TAX_TYPE_VALUE_VN[parseInt(gTax.taxType) - 1];
                        gTrans.transInfo.treasuryNumView = document.getElementById("id.treasuryNum").value + " - " + document.getElementById("id.treasuryName").value;
                        gTrans.transInfo.transId = gTrans.requestData.transId;

                        var valueTKNSNN = document.getElementById("id.valueTKNSNN").value;
                        if (valueTKNSNN == '7111') {
                            valueTKNSNN = valueTKNSNN + " - " + CONST_STR.get('TAX_TREASURY_ACC_NOP_NSNN');
                        } else if (valueTKNSNN == '3511') {
                            valueTKNSNN = valueTKNSNN + " - " + CONST_STR.get('TAX_TREASURY_ACC_TAM_THU');
                        } else {
                            valueTKNSNN = valueTKNSNN + " - " + CONST_STR.get('TAX_TREASURY_ACC_THU_QUY');
                        }
                        gTrans.transInfo.valueTKNSNNView = valueTKNSNN;
                        gTrans.transInfo.TEN_CQ_THU_View = gTax.domesticData.ThongDiep.Body.ThongTinThuNop.ThongTinDKT.MaCQThueQL + " - " + gTax.treasuryData[0].TEN_CQ_THU;

                        gTrans.transInfo.listPending = new Array();
                        var dataCheckBox = document.getElementsByName('userRefId');
                        for (var i = 0; i < dataCheckBox.length; i++) {
                            if (dataCheckBox.checked == true) {
                                var formatSoPhaiNop = String(gTax.thongTinGiaoDich[0].SoPhaiNop).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                gTax.thongTinGiaoDich[0].SoPhaiNopView = formatSoPhaiNop + ' VND';
                                gTrans.transInfo.listPending[0] = gTax.thongTinGiaoDich[0];

                            } else if (dataCheckBox[i].checked == true) {
                                if (i < dataCheckBox.length/2){                                    
                                    var formatSoPhaiNop = String(gTax.thongTinGiaoDich[i].SoPhaiNop).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    gTax.thongTinGiaoDich[i].SoPhaiNopView = formatSoPhaiNop + ' VND';
                                    gTrans.transInfo.listPending.push(gTax.thongTinGiaoDich[i]);
                                }
                                else{                                    
                                    var formatSoPhaiNop = String(gTax.thongTinGiaoDich[i - dataCheckBox.length/2].SoPhaiNop).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    gTax.thongTinGiaoDich[i - dataCheckBox.length/2].SoPhaiNopView = formatSoPhaiNop + ' VND';
                                    gTrans.transInfo.listPending.push(gTax.thongTinGiaoDich[i - dataCheckBox.length/2]);
                                }
                            }
                        }
                        if (gTax.taxType == '01') {
                            gTrans.transInfo.treasuryName = document.getElementById('id.treasuryName').value;
                        }
                        var dataTotalAmount = String(resp.respJsonObj.totalAmount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        gTrans.transInfo.dataTotalAmountView = dataTotalAmount + ' VND';

                        var dataFee = String(resp.respJsonObj.fee).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        gTrans.transInfo.dataFeeView = dataFee + ' VND';

                        var dataSoDu = parseFloat(gTax.soDuKhaDung.replace(new RegExp(',', 'g'), ''))
                            - parseFloat(resp.respJsonObj.totalAmount)
                            - parseFloat(resp.respJsonObj.fee);
                        dataSoDu = String(dataSoDu).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        gTrans.transInfo.dataSoDuView = dataSoDu + ' VND';

                        gTrans.transInfo.decreption = resp.respJsonObj.decreption;

                        if (document.getElementById('id.saveTaxQuery').value == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
                            gTrans.transInfo.saveTaxQuery = (gUserInfo.lang == 'EN') ? CONST_TAX_INFO_QUERY_DOMESTIC_VALUE_EN[0] : CONST_TAX_INFO_QUERY_DOMESTIC_VALUE_VN[0];
                        } else {
                            gTrans.transInfo.saveTaxQuery = document.getElementById('id.saveTaxQuery').value;
                        }

                        gTrans.transInfo.sendMSGApprover = document.getElementById('id.notifyTo').value;
                        gTrans.transInfo.transId = response.respJsonObj.transaction_id;
                        //gTrans.transInfo.accountBalance = formatNumberToCurrency(gTrans.listSourceAccounts[0].balance);;
                        navController.pushToView("common/common-review/transfer-review-scr", true, "html");
                        navCachedPages["payment_service/create/tax/pay_tax_create_domestic"] = null;
                        //genReviewScreen(resp.respJsonObj);
                    } else if (resp.respCode == RESP.get('COM_VALIDATE_FAIL')
                        && resp.responseType == CONSTANTS.get('CMD_CO_PAY_TAX_PROCESSOR')) {
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
            }
        }

        function genReviewScreen(data) {
            var xmlDoc = createXMLDoc();
            var rootNode = createXMLNode('review', '', xmlDoc);

            // Thông tin tài khoản
            var sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            createXMLNode("title", CONST_STR.get('COM_TXT_ACC_INFO_TITLE'), xmlDoc, sectionNode);

            var rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TRANS_BATCH_ACC_LABEL'), xmlDoc, rowNode);
            createXMLNode("value", gTax.accountNo, xmlDoc, rowNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('CRE_DEBT_SURPLUS_AVAILABEL'), xmlDoc, rowNode);
            createXMLNode("value", gTax.soDuKhaDung + ' VND', xmlDoc, rowNode);

            // Thông tin người nộp thuế
            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            createXMLNode("title", CONST_STR.get('TAX_PAY_TAX_CUST_INFO'), xmlDoc, sectionNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('COM_TAX_NUMBER'), xmlDoc, rowNode);
            createXMLNode("value", gTax.domesticData.ThongDiep.Body.ThongTinThuNop.ThongTinDKT.MaSoThue, xmlDoc, rowNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_CUST_PAY_TAX'), xmlDoc, rowNode);
            createXMLNode("value", gTax.domesticData.ThongDiep.Body.ThongTinThuNop.ThongTinDKT.TenNNT, xmlDoc, rowNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_CUST_PAY_TAX_ADDRESS'), xmlDoc, rowNode);
            createXMLNode("value", gTax.domesticData.ThongDiep.Body.ThongTinThuNop.ThongTinDKT.Diachi, xmlDoc, rowNode);

            // Thông tin nộp thuế
            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            createXMLNode("title", CONST_STR.get('TAX_INFO'), xmlDoc, sectionNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('COM_TAX_TYPE'), xmlDoc, rowNode);
            createXMLNode("value",
                (gUserInfo.lang == 'EN') ? gTax.taxType + " - " + CONST_TRANS_PAY_TAX_TYPE_VALUE_EN[parseInt(gTax.taxType) - 1] : gTax.taxType + " - " + CONST_TRANS_PAY_TAX_TYPE_VALUE_VN[parseInt(gTax.taxType) - 1],
                xmlDoc, rowNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_TREASURY_CODE'), xmlDoc, rowNode);
            createXMLNode("value", document.getElementById("id.treasuryNum").value + " - " + document.getElementById("id.treasuryName").value, xmlDoc, rowNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_TREASURY_ACC'), xmlDoc, rowNode);
            var valueTKNSNN = document.getElementById("id.valueTKNSNN").value;
            if (valueTKNSNN == '7111') {
                valueTKNSNN = valueTKNSNN + " - " + CONST_STR.get('TAX_TREASURY_ACC_NOP_NSNN');
            } else if (valueTKNSNN == '3511') {
                valueTKNSNN = valueTKNSNN + " - " + CONST_STR.get('TAX_TREASURY_ACC_TAM_THU');
            } else {
                valueTKNSNN = valueTKNSNN + " - " + CONST_STR.get('TAX_TREASURY_ACC_THU_QUY');
            }
            createXMLNode("value", valueTKNSNN, xmlDoc, rowNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_TREASURY_MNG'), xmlDoc, rowNode);
            createXMLNode("value", gTax.domesticData.ThongDiep.Body.ThongTinThuNop.ThongTinDKT.MaCQThueQL + " - " + gTax.treasuryData[0].TEN_CQ_THU, xmlDoc, rowNode);

            // Thông tin giao dịch
            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            createXMLNode("title", CONST_STR.get('COM_TRASACTION_INFO'), xmlDoc, sectionNode);


            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            var tableNode = createXMLNode("table", "", xmlDoc, sectionNode);
            var theadNode = createXMLNode("thead", "", xmlDoc, tableNode);

            var trNode = createXMLNode("tr", '', xmlDoc, theadNode);
            createXMLNode("class", 'trow-title', xmlDoc, trNode);
            createXMLNode("class", 'trow-title', xmlDoc, trNode);
            createXMLNode("th", CONST_STR.get("COM_NO"), xmlDoc, trNode);
            createXMLNode("th", CONST_STR.get("TAX_CHAPTER"), xmlDoc, trNode);
            createXMLNode("th", CONST_STR.get("TAX_CONTENT"), xmlDoc, trNode);
            createXMLNode("th", CONST_STR.get("COM_AMOUNT"), xmlDoc, trNode);

            var tbodyNode = createXMLNode("tbody", "", xmlDoc, tableNode);

            var dataCheckBox = document.getElementsByName('userRefId');
            var sttNo = 0;
            for (var i = 0; i < dataCheckBox.length; i++) {
                if (dataCheckBox.checked == true) {
                    trNode = createXMLNode("tr", "", xmlDoc, tbodyNode);
                    var tdNode = createXMLNode("td", "1", xmlDoc, trNode);
                    tdNode = createXMLNode("td", gTax.thongTinGiaoDich[0].MaChuong, xmlDoc, trNode);
                    tdNode = createXMLNode("td", gTax.thongTinGiaoDich[0].MaTieuMuc, xmlDoc, trNode);
                    var formatSoPhaiNop = String(gTax.thongTinGiaoDich[0].SoPhaiNop).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    tdNode = createXMLNode("td", formatSoPhaiNop + ' VND', xmlDoc, trNode);
                    createXMLNode("class", 'td-right', xmlDoc, tdNode);

                } else if (dataCheckBox[i].checked == true) {
                    trNode = createXMLNode("tr", "", xmlDoc, tbodyNode);
                    sttNo = sttNo + 1;
                    var tdNode = createXMLNode("td", sttNo, xmlDoc, trNode);
                    tdNode = createXMLNode("title", CONST_STR.get("COM_NO"), xmlDoc, tdNode);
                    tdNode = createXMLNode("td", gTax.thongTinGiaoDich[i].MaChuong, xmlDoc, trNode);
                    tdNode = createXMLNode("title", CONST_STR.get("TAX_CHAPTER"), xmlDoc, tdNode);
                    tdNode = createXMLNode("td", gTax.thongTinGiaoDich[i].MaTieuMuc, xmlDoc, trNode);
                    tdNode = createXMLNode("title", CONST_STR.get("TAX_CONTENT"), xmlDoc, tdNode);
                    var formatSoPhaiNop = String(gTax.thongTinGiaoDich[i].SoPhaiNop).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    tdNode = createXMLNode("td", formatSoPhaiNop + ' VND', xmlDoc, trNode);
                    createXMLNode("class", 'td-right', xmlDoc, tdNode);
                    tdNode = createXMLNode("title", CONST_STR.get("COM_AMOUNT"), xmlDoc, tdNode);
                }
            }
            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);

            if (gTax.taxType == '01') {
                rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
                createXMLNode("label", CONST_STR.get('TAX_TREASURY_CODE_1'), xmlDoc, rowNode);
                createXMLNode("value", document.getElementById('id.treasuryName').value, xmlDoc, rowNode);
            }

            var dataTotalAmount = String(data.totalAmount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('COM_AMOUNT'), xmlDoc, rowNode);
            createXMLNode("value", dataTotalAmount + ' VND', xmlDoc, rowNode);

            var dataFee = String(data.fee).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_FEE'), xmlDoc, rowNode);
            createXMLNode("value", dataFee + ' VND', xmlDoc, rowNode);

            var dataSoDu = parseFloat(gTax.soDuKhaDung.replace(new RegExp(',', 'g'), ''))
                - parseFloat(data.totalAmount)
                - parseFloat(data.fee);
            dataSoDu = String(dataSoDu).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_LOCAL_BALANCE_CONT'), xmlDoc, rowNode);
            createXMLNode("value", dataSoDu + ' VND', xmlDoc, rowNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_DESCRIPTION'), xmlDoc, rowNode);
            createXMLNode("value", data.decreption, xmlDoc, rowNode);

            /*
             rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
             createXMLNode("label", CONST_STR.get('TAX_LOCAL_DATE_TRANS'), xmlDoc, rowNode);
             createXMLNode("value", data.dateValue, xmlDoc, rowNode); */

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_SAVE_TAX_QUERY'), xmlDoc, rowNode);
            if (document.getElementById('id.saveTaxQuery').value == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
                createXMLNode("value", (gUserInfo.lang == 'EN') ? CONST_TAX_INFO_QUERY_DOMESTIC_VALUE_EN[0] : CONST_TAX_INFO_QUERY_DOMESTIC_VALUE_VN[0], xmlDoc, rowNode);
            } else {
                createXMLNode("value", document.getElementById('id.saveTaxQuery').value, xmlDoc, rowNode);
            }

            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('COM_SEND_MSG_APPROVER'), xmlDoc, rowNode);
            createXMLNode("value", document.getElementById('id.notifyTo').value, xmlDoc, rowNode);

            var buttonNode = createXMLNode("button", "", xmlDoc, rootNode);
            createXMLNode("type", "cancel", xmlDoc, buttonNode);
            createXMLNode("label", CONST_STR.get("REVIEW_BTN_CANCEL"), xmlDoc, buttonNode);

            buttonNode = createXMLNode("button", "", xmlDoc, rootNode);
            createXMLNode("type", "back", xmlDoc, buttonNode);
            createXMLNode("label", CONST_STR.get("REVIEW_BTN_BACK"), xmlDoc, buttonNode);

            buttonNode = createXMLNode("button", "", xmlDoc, rootNode);
            createXMLNode("type", "authorize", xmlDoc, buttonNode);
            createXMLNode("label", CONST_STR.get("REVIEW_BTN_NEXT"), xmlDoc, buttonNode);

            //req gui len
            var req = {
                sequence_id: data.sequence_id,
                transId: data.transaction_id,
                userID: data.userID,
                idtxn: data.idtxn
            };
            gCorp.cmdType = CONSTANTS.get("CMD_CO_PAY_TAX_PROCESSOR"); //port
            gCorp.requests = [req, null];

            setReviewXmlStore(xmlDoc);
            navCachedPages["common/review/com-review"] = null;
            navController.pushToView("common/review/com-review", true, 'html');
        }

        //Gọi đến màn hình "Danh sach người nhận thông báo"
        $scope.showReceiverList = function () {
            updateAccountListInfo();
            navController.pushToView("common/com_list_user_approve", true, 'html');
        }

        $scope.domesticCallBack = function () {
//            navController.pushToView('payment_service/create/tax/pay_tax_create',true, 'html');
            navController.popView(true);
        }

        $scope.domesticCancel = function () {
            navController.pushToView('payment_service/create/tax/pay_tax_create', true, 'html');
        }

        $scope.getValueTKNSNN = function () {
            var handleSelectTKNSNN = function (e) {
                if (currentPage == "payment_service/create/tax/pay_tax_create_domestic") {
                    document.removeEventListener("evtSelectionDialog", handleSelectTKNSNN, false);
                    if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                        document.getElementById('id.valueTKNSNN').value = e.selectedValue1;
                        showTableByTKT();
                    }
                    if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                        sttID = e.selectedValue2;
                    }
                }
            }

            var handleSelectTKNSNNClose = function () {
                if (currentPage == "payment_service/create/tax/pay_tax_create_domestic") {
                    document.removeEventListener("evtSelectionDialogClose", handleSelectTKNSNNClose, false);
                    document.removeEventListener("evtSelectionDialog", handleSelectTKNSNN, false);
                }
            }

            document.addEventListener("evtSelectionDialog", handleSelectTKNSNN, false);
            document.addEventListener("evtSelectionDialogClose", handleSelectTKNSNNClose, false);

            showDialogList(CONST_STR.get('TRANS_PERIODIC_DIALOG_TITLE_ACCTYPE'), gTax.arrTKNSNN, '', false);
        }
        $scope.initData();
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}

//Mãu thụ hưởng
function initBottomBar (){
    var arrBottom = new Array();
    arrBottom.push(new MenuBottom("AUTO_BILLING_TAB_LIST", "icon-scheduled-transfers-list"));
    periodParam = new PeriodParam(CONSTANTS.get("CMD_TRANSFER_PERIODIC_MNG_TRANS"),CONST_VAL_PERIODIC_LOCAL[0]);

    navController.initBottomBarWithCallBack("payment_service/create/tax/pay_tax_create_domestic", arrBottom, "pay_tax_create_domestic", function () {

        updateAccountListInfo();
        navCachedPages['common/com_list_user_approve'] = null;
        navController.pushToView("common/com_list_user_approve", true, 'html');
        navCachedPages["payment_service/create/tax/pay_tax_create_domestic"] = null;
    });

    gEdit = 1;
    //
    gHisTypeTranfer = 17;
}


