var flagLoadOrganization = true;
gTrans.transInfo = {};

/*** VIEW BACK FROM OTHER ***/
function viewBackFromOther() {
    flagLoadOrganization = true;
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
 //genSequenceForm();

 if (flagLoadOrganization) {
 //document.getElementById("id.valueTKNSNN").value = gTax.arrTKNSNN[0];
 document.getElementById("id.notifyTo").value = CONST_STR.get('COM_NOTIFY_' + gTax.methodSend);
 showTableByTKT();
 }
 }*/

function viewDidLoadSuccess() {
    init();
    actionbar.showStepSequence("com-authentication-scr");

}
function init() {
    angular.module('EbankApp').controller('pay_tax_create_organization', function ($scope, requestMBServiceCorp) {
        $scope.initData = function () {
            actionbar.showStepSequence("com-authentication-scr");
            if (flagLoadOrganization) {
                var objHeader = gTax.organizationData.ThongDiep.Header;
                var objError = gTax.organizationData.ThongDiep.ErrorCode;
                var objBody = gTax.organizationData.ThongDiep.Body;
                gTax.respCustObj = objBody;

                // Ma so thue
                $scope.Ma_ST = objBody.NguoiNopTien.Ma_ST;

                // Nguoi nop thue
                $scope.Ten_NNT = objBody.NguoiNopTien.Ten_NNT;

                //Dia chi nguoi nop thue
                $scope.DiaChi = objBody.NguoiNopTien.DiaChi;

                //Ten co quan thu
                $scope.Ten_DVQL = objBody.Ten_DVQL;

                //Ma ngan hang thu huong
                $scope.Ma_NH_TH = objBody.TaiKhoan_NopTien.Ma_NH_TH;

                //Ten ngan hang thu huong
                $scope.Ten_NH_TH = objBody.TaiKhoan_NopTien.Ten_NH_TH;

                //Tai khoan thu huong
                $scope.TaiKhoan_TH = objBody.TaiKhoan_NopTien.TaiKhoan_TH;

                //Ten tai khoan thu huong
                $scope.Ten_TaiKhoan_TH = objBody.TaiKhoan_NopTien.Ten_TaiKhoan_TH;

                //Ma nguyen te
                $scope.Ma_NT = objBody.ThongTin_NopTien.Ma_NT;

                //ty gia quy doi
                $scope.TyGiaView = formatNumberToCurrency(objBody.ThongTin_NopTien.TyGia) + ' VND';

                //tong tien nguyen te
                $scope.TongTien_NT_View = formatNumberToCurrency(objBody.ThongTin_NopTien.TongTien_NT) + '  ' + objBody.ThongTin_NopTien.Ma_NT;

                //tong tien VND
                $scope.TongTien_VND_View = formatNumberToCurrency(objBody.ThongTin_NopTien.TongTien_VND) + ' VND';

                ////Tai khoan thu NSNN
                ////Lay gia tri TKNS trong obj

                var tkNSNN = [];
                var tmpObj = {};
                var finalTKNSNN = [];
                if (objBody.CTNTDtl.constructor === Array) {
                    for (var i = 0; i < objBody.CTNTDtl.length; i++) {
                        tkNSNN.push(objBody.CTNTDtl[i].NDKT);
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
                    finalTKNSNN.push(objBody.CTNTDtl.NDKT);
                    gTax.arrTKNSNN = finalTKNSNN;
                }

                //document.getElementById("id.valueTKNSNN").value = gTax.arrTKNSNN[0];
                document.getElementById("id.notifyTo").value = CONST_STR.get('COM_NOTIFY_' + gTax.methodSend);
                showTableByTKT();
            }
        }
        $scope.initData();

        $scope.getValueTKNSNN = function () {
            var handleSelectTKNSNN = function (e) {
                if (currentPage == "payment_service/crreate/tax/pay_tax_create_domestic") {
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
            if (currentPage == "payment_service/create/tax/pay_tax_create_organization") {
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
            if (currentPage == "payment_service/create/tax/pay_tax_create_organization") {
                document.removeEventListener("evtSelectionDialogClose", handleSaveQueryInfoClose, false);
                document.removeEventListener("evtSelectionDialog", handleSaveQueryInfo, false);
            }
        }


        function showTableByTKT() {
            var tkt = document.getElementById("id.valueTKNSNN");
            var tmpArr = [];
            var respCustObj = gTax.organizationData.ThongDiep.Body;

            if (respCustObj.CTNTDtl.constructor === Array) {
                for (var i = 0; i < respCustObj.CTNTDtl.length; i++) {
                    tmpArr.push(respCustObj.CTNTDtl[i]);
                }
            } else {
                tmpArr.push(respCustObj.CTNTDtl);
            }

            gTax.thongTinGiaoDich = tmpArr;
            for (var i = 0; i < gTax.thongTinGiaoDich.length; i++) {
                gTax.thongTinGiaoDich[i].SoTien_NT_View = formatNumberToCurrency(gTax.thongTinGiaoDich[i].SoTien_NT) + '  ' + gTax.organizationData.ThongDiep.Body.ThongTin_NopTien.Ma_NT;
                gTax.thongTinGiaoDich[i].SoTien_VND_View = formatNumberToCurrency(gTax.thongTinGiaoDich[i].SoTien_VND) + ' VND';
            }
            $scope.listPending = gTax.thongTinGiaoDich;
            //document.getElementById('divTable').innerHTML = '';
            //genTableResults(tmpArr, gTax.organizationData.ThongDiep.Body.ThongTin_NopTien.Ma_NT);
        }

        /*function genTableResults(displayRows, maNT) {
         var xmlDoc = createXMLDoc();
         var tmpXmlRootNode = createXMLNode('review', '', xmlDoc);

         var tableNodes = createXMLNode('transtables', '', xmlDoc, tmpXmlRootNode);
         var table = createXMLNode('table', '', xmlDoc, tableNodes);
         var titles = createXMLNode('titles', '', xmlDoc, table);
         createXMLNode('table-title', CONST_STR.get('COM_NO'), xmlDoc, titles);
         createXMLNode('table-title', CONST_STR.get('TAX_CONTENT'), xmlDoc, titles); // ND kinhtế
         createXMLNode('table-title', CONST_STR.get('TAX_CONTENT_TITLE'), xmlDoc, titles); //Tên ND kinhtế
         createXMLNode('table-title', CONST_STR.get('TAX_CURRENCY_MONEY'), xmlDoc, titles); // Số tiền nguyên tệ
         createXMLNode('table-title', CONST_STR.get('TAX_CURRENCY_MONEY_LOCAL'), xmlDoc, titles); // Số tiền VND
         createXMLNode('table-title', CONST_STR.get('TAX_CURRENCY_NOTE'), xmlDoc, titles); // ghi chu

         var rows = createXMLNode('rows', '', xmlDoc, table);
         for (var i = 0; i < displayRows.length; i++) {
         var row = createXMLNode('row', '', xmlDoc, rows);
         createXMLNode('idx', parseInt(i) + 1, xmlDoc, row);
         var cotent = createXMLNode('cotent', '', xmlDoc, row);
         createXMLNode('class', "td-head-color", xmlDoc, cotent);

         //so thu thu
         createXMLNode('table-content-title', CONST_STR.get('COM_NO'), xmlDoc, cotent);
         createXMLNode('table-content', parseInt(i) + 1, xmlDoc, cotent);

         //noi dung kinh te
         cotent = createXMLNode('cotent', '', xmlDoc, row);
         createXMLNode('table-content-title', CONST_STR.get('TAX_CONTENT'), xmlDoc, cotent);
         createXMLNode('table-content', displayRows[i].NDKT, xmlDoc, cotent);

         //ten noi dung kinh te
         cotent = createXMLNode('cotent', '', xmlDoc, row);
         createXMLNode('table-content-title', CONST_STR.get('TAX_CONTENT_TITLE'), xmlDoc, cotent);
         createXMLNode('table-content', displayRows[i].Ten_NDKT, xmlDoc, cotent);

         //so tien nguyen te
         cotent = createXMLNode('cotent', '', xmlDoc, row);
         createXMLNode('table-content-title', CONST_STR.get('TAX_CURRENCY_MONEY'), xmlDoc, cotent);
         createXMLNode('table-content', formatNumberToCurrency(displayRows[i].SoTien_NT) + '  ' + maNT, xmlDoc, cotent);
         createXMLNode('class', 'td-right', xmlDoc, cotent);

         //so tien vnd
         cotent = createXMLNode('cotent', '', xmlDoc, row);
         createXMLNode('table-content-title', CONST_STR.get('TAX_CURRENCY_MONEY_LOCAL'), xmlDoc, cotent);
         createXMLNode('table-content', formatNumberToCurrency(displayRows[i].SoTien_VND) + ' VND', xmlDoc, cotent);
         createXMLNode('class', 'td-right', xmlDoc, cotent);

         //ghi chu
         cotent = createXMLNode('cotent', '', xmlDoc, row);
         createXMLNode('table-content-title', CONST_STR.get('TAX_CURRENCY_NOTE'), xmlDoc, cotent);
         createXMLNode('table-content', displayRows[i].GhiChu, xmlDoc, cotent);
         }

         var docXsl = getCachePageXsl("corp/payment_service/tax/pay_tax_create_organization_tbl");

         genHTMLStringWithXML(xmlDoc, docXsl, function (html) {
         var tmpNode = document.getElementById('divTable');
         tmpNode.innerHTML = html;
         });
         }*/

        $scope.sendJsonRequest = function () {
            var msgCheck = new Array();
            // Lay ra thong tin chung
            var allInfo = {};
            allInfo.nguoinopthue
            allInfo = gTax.organizationData.ThongDiep.Body.ThongTin_NopTien;
            allInfo.Ten_DVQL = gTax.organizationData.ThongDiep.Body.Ten_DVQL;
            //tai khoan nop tien
            allInfo.Ma_NH_TH = gTax.organizationData.ThongDiep.Body.TaiKhoan_NopTien.Ma_NH_TH;
            allInfo.TaiKhoan_TH = gTax.organizationData.ThongDiep.Body.TaiKhoan_NopTien.TaiKhoan_TH;
            allInfo.Ten_NH_TH = gTax.organizationData.ThongDiep.Body.TaiKhoan_NopTien.Ten_NH_TH;
            allInfo.Ten_TaiKhoan_TH = gTax.organizationData.ThongDiep.Body.TaiKhoan_NopTien.Ten_TaiKhoan_TH;
            //nguoi nop tien
            allInfo.DiaChi = gTax.organizationData.ThongDiep.Body.NguoiNopTien.DiaChi;
            allInfo.Ma_ST = String(gTax.organizationData.ThongDiep.Body.NguoiNopTien.Ma_ST);
            allInfo.TT_Khac = gTax.organizationData.ThongDiep.Body.NguoiNopTien.TT_Khac;
            allInfo.Ten_NNT = gTax.organizationData.ThongDiep.Body.NguoiNopTien.Ten_NNT;

            allInfo.So_CT = String(gTax.organizationData.ThongDiep.Body.So_CT);
            allInfo.Nam_CT = String(gTax.organizationData.ThongDiep.Body.Nam_CT);
            allInfo.Ma_DVQL = String(gTax.organizationData.ThongDiep.Body.Ma_DVQL);
            allInfo.KyHieu_CT = String(gTax.organizationData.ThongDiep.Body.KyHieu_CT);
            allInfo.So_HS = String(gTax.organizationData.ThongDiep.Body.So_HS);

            var argsArray = [];
            argsArray.push("4");
            argsArray.push(JSON.stringify({
                idtxn: "B11",
                taxType: gTax.taxType,
                accountNo: gTax.accountNo,
                allInfo: allInfo,
                tranfDtl: gTax.thongTinGiaoDich,
                isSave: document.getElementById('id.saveTaxQueryValue').value
            }));

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_PAY_TAX_ORGANIZATION"), "", "", gUserInfo.lang, gUserInfo.sessionID, argsArray);
            data = getDataFromGprsCmd(gprsCmd);

            // gọi service và xử lí logic
            requestMBServiceCorp.post(data, true, function (data) {
                var response = data;
                if (response.respCode == RESP.get('COM_SUCCESS')
                    && response.responseType == CONSTANTS.get('CMD_CO_PAY_TAX_ORGANIZATION')) {
                    var requestData = {
                        transId: response.respJsonObj.transaction_id,
                        sequence_id: 5,
                        userID: gTax.accountNo,
                        idtxn: response.respJsonObj.idtxn
                    }

                    gTrans.requestData = requestData;
                    gTrans.cmdType = CONSTANTS.get('CMD_CO_PAY_TAX_PROCESSOR');
                    gTrans.src = "pages/payment_service/create/tax/view/pay_tax_create_organization_view.html";
                    gTrans.transInfo.accountNo = gTax.accountNo;
                    gTrans.transInfo.soDuKhaDungView = gTax.soDuKhaDung + ' VND';
                    gTrans.transInfo.MaSoThue = gTax.organizationData.ThongDiep.Body.NguoiNopTien.Ma_ST;
                    gTrans.transInfo.TenNNT = gTax.organizationData.ThongDiep.Body.NguoiNopTien.Ten_NNT;
                    gTrans.transInfo.Diachi = gTax.organizationData.ThongDiep.Body.NguoiNopTien.DiaChi;
                    gTrans.transInfo.Ten_DVQL = gTax.organizationData.ThongDiep.Body.Ten_DVQL;
                    gTrans.transInfo.Ma_NH_TH = gTax.organizationData.ThongDiep.Body.TaiKhoan_NopTien.Ma_NH_TH;
                    gTrans.transInfo.Ten_NH_TH = gTax.organizationData.ThongDiep.Body.TaiKhoan_NopTien.Ten_NH_TH;
                    gTrans.transInfo.TaiKhoan_TH = gTax.organizationData.ThongDiep.Body.TaiKhoan_NopTien.TaiKhoan_TH;
                    gTrans.transInfo.Ten_TaiKhoan_TH = gTax.organizationData.ThongDiep.Body.TaiKhoan_NopTien.Ten_TaiKhoan_TH;
                    gTrans.transInfo.Ma_NT = gTax.organizationData.ThongDiep.Body.ThongTin_NopTien.Ma_NT;
                    gTrans.transInfo.TyGiaView = formatNumberToCurrency(gTax.organizationData.ThongDiep.Body.ThongTin_NopTien.TyGia) + ' VND';
                    gTrans.transInfo.TongTien_NT_View = formatNumberToCurrency(gTax.organizationData.ThongDiep.Body.ThongTin_NopTien.TongTien_NT) + '  ' + gTax.organizationData.ThongDiep.Body.ThongTin_NopTien.Ma_NT;

                    gTrans.transInfo.listPending = new Array();

                    for (var i = 0; i < gTax.thongTinGiaoDich.length; i++) {
                        gTax.thongTinGiaoDich[i].SoTien_NT_View = formatNumberToCurrency(gTax.thongTinGiaoDich[i].SoTien_NT) + ' ' + gTax.organizationData.ThongDiep.Body.ThongTin_NopTien.Ma_NT;
                        gTax.thongTinGiaoDich[i].SoTien_VND_View = formatNumberToCurrency(gTax.thongTinGiaoDich[i].SoTien_VND) + ' VND';
                        gTrans.transInfo.listPending.push(gTax.thongTinGiaoDich[i]);
                    }

                    var dataTotalAmount = String(response.respJsonObj.totalAmount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    gTrans.transInfo.dataTotalAmountView = dataTotalAmount + ' VND';

                    var dataFee = String(response.respJsonObj.fee).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    gTrans.transInfo.dataFeeView = dataFee + ' VND';

                    var dataSoDu = parseFloat(gTax.soDuKhaDung.replace(new RegExp(',', 'g'), ''))
                        - parseFloat(response.respJsonObj.totalAmount)
                        - parseFloat(response.respJsonObj.fee);
                    dataSoDu = String(dataSoDu).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    gTrans.transInfo.dataSoDuView = dataSoDu + ' VND';

                    gTrans.transInfo.decreption = response.respJsonObj.decreption;
                    gTrans.transInfo.dateValue = response.respJsonObj.dateValue;

                    if (document.getElementById('id.saveTaxQuery').value == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
                        gTrans.transInfo.saveTaxQuery = (gUserInfo.lang == 'EN') ? CONST_TAX_INFO_QUERY_DOMESTIC_VALUE_EN[0] : CONST_TAX_INFO_QUERY_DOMESTIC_VALUE_VN[0];
                    } else {
                        gTrans.transInfo.saveTaxQuery = document.getElementById('id.saveTaxQuery').value;
                    }
                    gTrans.transInfo.sendMSGApprover = document.getElementById('id.notifyTo').value;
                    gTrans.transInfo.transId = response.respJsonObj.transaction_id;
                    //gTrans.transInfo.accountBalance = formatNumberToCurrency(gTrans.listSourceAccounts[0].balance);;
                    navController.pushToView("common/common-review/transfer-review-scr", true, "html");
                    navCachedPages["payment_service/create/tax/pay_tax_create_organization"] = null;
                    //genReviewScreen(response.respJsonObj);
                } else if (response.respCode == RESP.get('COM_VALIDATE_FAIL')
                    && response.responseType == CONSTANTS.get('CMD_CO_PAY_TAX_ORGANIZATION')) {
                    showAlertText(response.respContent);
                } else if (response.respCode == 38) {
                    showAlertText(CONST_STR.get('COM_TAX_AMOUNT_HIGH_THAN_BALANCE'));
                } else {
                    if (response.respCode == '1019') {
                        showAlertText(response.respContent);
                    } else {
                        showAlertText(CONST_STR.get('ERR_COM_TRANS_FAILED'));
                    }
                    var tmpPageName = navController.getDefaultPage();
                    var tmpPageType = navController.getDefaultPageType();
                    navController.initWithRootView(tmpPageName, true, tmpPageType);
                }
            });

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

            //// Thông tin người nộp thuế
            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            createXMLNode("title", CONST_STR.get('TAX_PAY_TAX_CUST_INFO'), xmlDoc, sectionNode);
            // Ma so thue
            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('COM_TAX_NUMBER'), xmlDoc, rowNode);
            createXMLNode("value", gTax.organizationData.ThongDiep.Body.NguoiNopTien.Ma_ST, xmlDoc, rowNode);
            // Nguoi nop thue
            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_CUST_PAY_TAX'), xmlDoc, rowNode);
            createXMLNode("value", gTax.organizationData.ThongDiep.Body.NguoiNopTien.Ten_NNT, xmlDoc, rowNode);
            //Dia chi nguoi nop thue
            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_CUST_PAY_TAX_ADDRESS'), xmlDoc, rowNode);
            createXMLNode("value", gTax.organizationData.ThongDiep.Body.NguoiNopTien.DiaChi, xmlDoc, rowNode);
            //Ten co quan thu
            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_ORI_REVENUE_NAME'), xmlDoc, rowNode);
            createXMLNode("value", gTax.organizationData.ThongDiep.Body.Ten_DVQL, xmlDoc, rowNode);

            //thong tin thu nop
            //thong tin thu nop
            tmpXmlNodeInfo = createXMLNode('section', '', xmlDoc, rootNode);
            tmpXmlNodeTransTitle = createXMLNode('title', CONST_STR.get('TAX_INFO_REVENUE'), xmlDoc, tmpXmlNodeInfo);
            //Ma ngan hang thu huong
            rowNode = createXMLNode('row', '', xmlDoc, tmpXmlNodeInfo);
            createXMLNode('label', CONST_STR.get('TAX_BANK_BENEFICIARY_CODE'), xmlDoc, rowNode);
            createXMLNode('value', gTax.organizationData.ThongDiep.Body.TaiKhoan_NopTien.Ma_NH_TH, xmlDoc, rowNode);
            //Ten ngan hang thu huong
            rowNode = createXMLNode('row', '', xmlDoc, tmpXmlNodeInfo);
            createXMLNode('label', CONST_STR.get('TAX_BANK_BENEFICIARY_NAME'), xmlDoc, rowNode);
            createXMLNode('value', gTax.organizationData.ThongDiep.Body.TaiKhoan_NopTien.Ten_NH_TH, xmlDoc, rowNode);
            //Tai khoan thu huong
            rowNode = createXMLNode('row', '', xmlDoc, tmpXmlNodeInfo);
            createXMLNode('label', CONST_STR.get('TAX_ACCOUNT_BENEFICIARY'), xmlDoc, rowNode);
            createXMLNode('value', gTax.organizationData.ThongDiep.Body.TaiKhoan_NopTien.TaiKhoan_TH, xmlDoc, rowNode);
            //Ten tai khoan thu huong
            rowNode = createXMLNode('row', '', xmlDoc, tmpXmlNodeInfo);
            createXMLNode('label', CONST_STR.get('TAX_ACCOUNT_BENEFICIARY_NAME'), xmlDoc, rowNode);
            createXMLNode('value', gTax.organizationData.ThongDiep.Body.TaiKhoan_NopTien.Ten_TaiKhoan_TH, xmlDoc, rowNode);
            //Ma nguyen te
            rowNode = createXMLNode('row', '', xmlDoc, tmpXmlNodeInfo);
            createXMLNode('label', CONST_STR.get('TAX_EXCHANGERATES_CODE'), xmlDoc, rowNode);
            createXMLNode('value', gTax.organizationData.ThongDiep.Body.ThongTin_NopTien.Ma_NT, xmlDoc, rowNode);
            //ty gia quy doi
            rowNode = createXMLNode('row', '', xmlDoc, tmpXmlNodeInfo);
            createXMLNode('label', CONST_STR.get('TAX_EXCHANGERATES_VALUE'), xmlDoc, rowNode);
            createXMLNode('value', formatNumberToCurrency(gTax.organizationData.ThongDiep.Body.ThongTin_NopTien.TyGia) + ' VND', xmlDoc, rowNode);
            //tong tien nguyen te
            rowNode = createXMLNode('row', '', xmlDoc, tmpXmlNodeInfo);
            createXMLNode('label', CONST_STR.get('TAX_EXCHANGE_SUM'), xmlDoc, rowNode);
            createXMLNode('value', formatNumberToCurrency(gTax.organizationData.ThongDiep.Body.ThongTin_NopTien.TongTien_NT) + '  ' + gTax.organizationData.ThongDiep.Body.ThongTin_NopTien.Ma_NT, xmlDoc, rowNode);

            // Thông tin giao dịch
            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            createXMLNode("title", CONST_STR.get('TAX_INFO_DETAIL'), xmlDoc, sectionNode);

            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            var tableNode = createXMLNode("table", "", xmlDoc, sectionNode);
            var theadNode = createXMLNode("thead", "", xmlDoc, tableNode);

            var trNode = createXMLNode("tr", '', xmlDoc, theadNode);
            createXMLNode("class", 'trow-title', xmlDoc, trNode);
            createXMLNode("th", CONST_STR.get("COM_NO"), xmlDoc, trNode);
            createXMLNode("th", CONST_STR.get("TAX_CONTENT"), xmlDoc, trNode);
            createXMLNode("th", CONST_STR.get("TAX_CONTENT_TITLE"), xmlDoc, trNode);
            createXMLNode("th", CONST_STR.get("TAX_CURRENCY_MONEY"), xmlDoc, trNode);
            createXMLNode("th", CONST_STR.get("TAX_CURRENCY_MONEY_LOCAL"), xmlDoc, trNode);
            createXMLNode("th", CONST_STR.get("TAX_CURRENCY_NOTE"), xmlDoc, trNode);

            var tbodyNode = createXMLNode("tbody", "", xmlDoc, tableNode);
            var sttNo = 0;
            for (var i = 0; i < gTax.thongTinGiaoDich.length; i++) {
                trNode = createXMLNode("tr", "", xmlDoc, tbodyNode);
                sttNo = sttNo + 1;
                var tdNode = createXMLNode("td", sttNo, xmlDoc, trNode);
                tdNode = createXMLNode("title", CONST_STR.get("COM_NO"), xmlDoc, tdNode);

                tdNode = createXMLNode("td", gTax.thongTinGiaoDich[i].NDKT, xmlDoc, trNode);
                tdNode = createXMLNode("title", CONST_STR.get("TAX_CONTENT"), xmlDoc, tdNode);

                tdNode = createXMLNode("td", gTax.thongTinGiaoDich[i].Ten_NDKT, xmlDoc, trNode);
                tdNode = createXMLNode("title", CONST_STR.get("TAX_CONTENT_TITLE"), xmlDoc, tdNode);

                tdNode = createXMLNode("td", formatNumberToCurrency(gTax.thongTinGiaoDich[i].SoTien_NT) + ' ' + gTax.organizationData.ThongDiep.Body.ThongTin_NopTien.Ma_NT, xmlDoc, trNode);
                createXMLNode("class", 'td-right', xmlDoc, tdNode);
                tdNode = createXMLNode("title", CONST_STR.get("TAX_CURRENCY_MONEY"), xmlDoc, tdNode);

                tdNode = createXMLNode("td", formatNumberToCurrency(gTax.thongTinGiaoDich[i].SoTien_VND) + ' VND', xmlDoc, trNode);
                createXMLNode("class", 'td-right', xmlDoc, tdNode);
                tdNode = createXMLNode("title", CONST_STR.get("TAX_CURRENCY_MONEY_LOCAL"), xmlDoc, tdNode);

                tdNode = createXMLNode("td", gTax.thongTinGiaoDich[i].GhiChu, xmlDoc, trNode);
                tdNode = createXMLNode("title", CONST_STR.get("TAX_CURRENCY_NOTE"), xmlDoc, tdNode);
            }

            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            var dataTotalAmount = String(data.totalAmount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TOTAL_MONEY_REVENUE'), xmlDoc, rowNode);
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

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_LOCAL_DATE_TRANS'), xmlDoc, rowNode);
            createXMLNode("value", data.dateValue, xmlDoc, rowNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_SAVE_TAX_QUERY'), xmlDoc, rowNode);
            if (document.getElementById('id.saveTaxQuery').value == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
                createXMLNode("value", (gUserInfo.lang == 'EN') ? CONST_TAX_INFO_QUERY_DOMESTIC_VALUE_EN[0] : CONST_TAX_INFO_QUERY_DOMESTIC_VALUE_VN[0], xmlDoc, rowNode);
            } else {
                createXMLNode("value", document.getElementById('id.saveTaxQuery').value, xmlDoc, rowNode);
            }

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

            ////req gui len
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
            navController.popView(true);
        }

        $scope.domesticCancel = function () {
            navController.initWithRootView('payment_service/create/tax/pay_tax_create', true, 'html');
        }
    //Mãu thụ hưởng
    $scope.initBottomBar = function (){
        var arrBottom = new Array();
        arrBottom.push(new MenuBottom("AUTO_BILLING_TAB_LIST", "icon-scheduled-transfers-list"));
        periodParam = new PeriodParam(CONSTANTS.get("CMD_TRANSFER_PERIODIC_MNG_TRANS"),CONST_VAL_PERIODIC_LOCAL[0]);

        navController.initBottomBarWithCallBack("payment_service/create/tax/pay_tax_create_organization", arrBottom, "pay_tax_create_organization", function () {
            updateAccountListInfo();
            navCachedPages['common/com_list_user_approve'] = null;
            navController.pushToView("common/com_list_user_approve", true, 'html');
            navCachedPages["payment_service/create/tax/pay_tax_create_organization"] = null;
        });
        // dung de phan biet mau chuyen tien, khi sua mau chuyen tien
        gEdit = 1;
        //
        gHisTypeTranfer = 17;
    }

    $scope.initBottomBar();
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}
//gen sequence form
/*function genSequenceForm() {
 //get sequence form xsl
 var tmpXslDoc = getCachePageXsl("sequenceform");
 //create xml
 var tmpStepNo = 301;
 setSequenceFormIdx(tmpStepNo);
 var xmlDoc = createXMLDoc();
 var tmpXmlRootNode = createXMLNode('seqFrom', '', xmlDoc);
 var tmpXmlNodeInfo = createXMLNode('stepNo', tmpStepNo, xmlDoc, tmpXmlRootNode);
 //gen html string
 genHTMLStringWithXML(xmlDoc, tmpXslDoc, function (oStr) {
 var tmpNode = document.getElementById('seqFormLocal');
 if (tmpNode != null) {
 tmpNode.innerHTML = oStr;
 }
 });
 }*/
