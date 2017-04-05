/**
 * Created by NguyenTDK
 * User:
 * Date: 19/10/15
 * Time: 5:00 PM
 */

var flagLoadImExport = true;
var noTK = '';
gTrans.transInfo = {};
var templistPending;
/*** INIT VIEW ***/
function loadInitXML() {
}

/*** VIEW BACK FROM OTHER ***/

function viewBackFromOther() {
    flagLoadImExport = false;
}


/*** VIEW WILL UNLOAD ***/
function viewWillUnload() {

}

function viewDidLoadSuccess() {
    init();
    actionbar.showStepSequence("com-authentication-scr");
}


function init() {
    angular.module('EbankApp').controller('pay_tax_create_imexport_dtl', function ($scope, requestMBServiceCorp) {
        //navController.getBottomBar().hide();
        $scope.initData = function () {
            if (flagLoadImExport) {
                actionbar.showStepSequence("com-authentication-scr");

                document.getElementById("id.notifyTo").value = CONST_STR.get('COM_NOTIFY_' + gTax.methodSend);

                var dataGen;
                if (gTax.imExportData.ThongDiep.Body.ThongtinToKhai.length > 0) {
                    dataGen = gTax.imExportData.ThongDiep.Body.ThongtinToKhai[gTax.stt];
                } else if (gTax.imExportData.ThongDiep.Body.ThongtinToKhai.Ma_DV !== undefined && gTax.imExportData.ThongDiep.Body.ThongtinToKhai.Ma_DV != null) {
                    dataGen = gTax.imExportData.ThongDiep.Body.ThongtinToKhai;
                } else {
                    dataGen = gTax.imExportData.ThongDiep.Body.ThongtinToKhai;
                }
                // Thông tin người nộp thuế
                document.getElementById('imEx.TaxNumber').innerHTML = dataGen.Ma_DV;
                document.getElementById('imEx.TaxCustPayTax').innerHTML = dataGen.Ten_DV;
                document.getElementById('imEx.TaxAddress').innerHTML = "";

                // Thông tin nộp thuế
                document.getElementById('imEx.TaxType').innerHTML = '04 - ' + CONST_STR.get("CONST_TAX_02");
                document.getElementById('imEx.TreasuryName').innerHTML = dataGen.Ma_KB + ' - ' + dataGen.Ten_KB;
                var treasuryAccNumValue = dataGen.TKKB + ' - ';
                if (dataGen.TKKB == '7111') {
                    treasuryAccNumValue = treasuryAccNumValue + CONST_STR.get('TAX_TREASURY_ACC_NOP_NSNN');
                } else if (dataGen.TKKB == '3511') {
                    treasuryAccNumValue = treasuryAccNumValue + CONST_STR.get('TAX_TREASURY_ACC_TAM_THU');
                } else {
                    treasuryAccNumValue = treasuryAccNumValue + CONST_STR.get('TAX_TREASURY_ACC_THU_QUY');
                }
                document.getElementById('imEx.TreasuryAccNum').innerHTML = treasuryAccNumValue;
                document.getElementById('imEx.TreasuryMng').innerHTML = dataGen.Ma_HQ + ' - ' + dataGen.Ten_HQ;
                document.getElementById('imEx.Declar').innerHTML = dataGen.So_TK;
                document.getElementById('imEx.MoneyType').innerHTML = dataGen.Ma_LT + " - " + CONST_STR.get('K_TAX_HQ_' + dataGen.Ma_LT);
                var declarDate = dataGen.Ngay_DK;
                var yDeclarDate = declarDate.substring(0, 4);
                var mDeclarDate = declarDate.substring(5, 7);
                var dDeclarDate = declarDate.substring(8);
                document.getElementById('imEx.DeclarDateCreate').innerHTML = dDeclarDate + '/' + mDeclarDate + '/' + yDeclarDate;
                document.getElementById('imEx.DeclarDateCreate').innerHTML = declarDate;
                document.getElementById('imEx.Num').innerHTML = dataGen.Ma_LH + ' - ' + dataGen.Ten_LH;

                // Thông tin giao dịch
                var maChuong = dataGen.Ma_Chuong;

                if (dataGen.CT_NO != undefined) {
                    for (var i = 0; i < dataGen.CT_NO.length; i++) {
                        dataGen.CT_NO[i].Khoan = maChuong;
                        dataGen.CT_NO[i].DuNoView = formatNumberToCurrency(dataGen.CT_NO[i].DuNo) + ' VND';
                    }

                } else {
                    noTK = '0';
                }

                //document.getElementById("tblContent").innerHTML = "";
                if (dataGen.CT_NO !== undefined && dataGen.CT_NO !== null) {
                    $scope.listPending = dataGen.CT_NO;
                    templistPending = dataGen.CT_NO;
                    // getDataTblToDiv(dataGen.CT_NO, "corp/payment_service/tax/pay_tax_create_imexport_dtl_tbl", "tblContent");
                }
            }
            else
            {
                $scope.listPending = templistPending;
            }
        }
        $scope.initData();

        // Thực hiện insert vào db dữ liệu
        $scope.taxImExportExe = function () {
            var msgCheck = new Array();

            // Lấy thông tin chung
            var declarInfoTemp;
            if (gTax.imExportData.ThongDiep.Body.ThongtinToKhai.length > 0) {
                declarInfoTemp = gTax.imExportData.ThongDiep.Body.ThongtinToKhai[gTax.stt];
            } else if (gTax.imExportData.ThongDiep.Body.ThongtinToKhai.Ma_DV !== undefined && gTax.imExportData.ThongDiep.Body.ThongtinToKhai.Ma_DV != null) {
                declarInfoTemp = gTax.imExportData.ThongDiep.Body.ThongtinToKhai;
            } else {
                declarInfoTemp = gTax.imExportData.ThongDiep.Body.ThongtinToKhai[gTax.stt];
            }

            var checkboxes = document.getElementsByName('userRefId');
            var listSelectedTrans = [];

            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked == true) {                    
                    if (i < checkboxes.length/2)
                    {
                        if (declarInfoTemp.CT_NO.constructor === Array) {
                            listSelectedTrans.push(declarInfoTemp.CT_NO[i]);
                        } else {
                            listSelectedTrans.push(declarInfoTemp.CT_NO);
                        }
                    }
                    else
                    {
                        if (declarInfoTemp.CT_NO.constructor === Array) {
                            listSelectedTrans.push(declarInfoTemp.CT_NO[i - checkboxes.length/2]);
                        } else {
                            listSelectedTrans.push(declarInfoTemp.CT_NO);
                        }
                    }
                }
            }

            // Check khong co mon thue nao
            if (noTK == '0') {
                msgCheck.push(CONST_STR.get('CORP_MSG_TAX_CHOOSE_NO_ITEM'));
            }

            //Check việc chọn item trong phần thông tin giao dịch
            if (listSelectedTrans == '') {
                msgCheck.push(CONST_STR.get('CORP_MSG_TAX_CHOOSE_ITEM'));
            }

            if (msgCheck.length > 0) {
                showAlertText(msgCheck[0]);
            } else {
                var argsArray = [];
                // delete declarInfoTemp.DuNo;
                argsArray.push("4");
                argsArray.push({
                    idtxn: "B11",
                    accountNo: gTax.accountNo,
                    taxCode: document.getElementById('imEx.TaxNumber').innerHTML,
                    taxType: '02',
                    allInfo: declarInfoTemp,
                    chooseData: listSelectedTrans,
                    isSave: document.getElementById("id.saveTaxQueryValue").value
                });

                console.log("argsArray", argsArray);
                var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_PAY_TAX_PROCESSOR"), "", "", gUserInfo.lang, gUserInfo.sessionID, argsArray);
                data = getDataFromGprsCmd(gprsCmd);

                // gọi service và xử lí logic
                requestMBServiceCorp.post(data, true, function (data) {
                    var response = data;
                    if (response.respCode == RESP.get('COM_SUCCESS') && response.responseType == CONSTANTS.get('CMD_CO_PAY_TAX_PROCESSOR')) {
                        var requestData = {
                            transId: response.respJsonObj.transaction_id,
                            sequence_id: 5,
                            userID: gTax.accountNo,
                            idtxn: response.respJsonObj.idtxn
                        }

                        gTrans.requestData = requestData;
                        gTrans.cmdType = CONSTANTS.get('CMD_CO_PAY_TAX_PROCESSOR');
                        gTrans.src = "pages/payment_service/create/tax/view/pay_tax_create_imexport_view.html";
                        gTrans.transInfo.accountNo = gTax.accountNo;
                        gTrans.transInfo.soDuKhaDungView = gTax.soDuKhaDung + ' VND';
                        gTrans.transInfo.taxType = "04 - " + CONST_STR.get('CONST_TAX_02');

                        var dataGen;
                        if (gTax.imExportData.ThongDiep.Body.ThongtinToKhai.length > 0) {
                            dataGen = gTax.imExportData.ThongDiep.Body.ThongtinToKhai[gTax.stt];
                        } else if (gTax.imExportData.ThongDiep.Body.ThongtinToKhai.Ma_DV !== undefined && gTax.imExportData.ThongDiep.Body.ThongtinToKhai.Ma_DV != null) {
                            dataGen = gTax.imExportData.ThongDiep.Body.ThongtinToKhai;
                        } else {
                            dataGen = gTax.imExportData.ThongDiep.Body.ThongtinToKhai[gTax.stt];
                        }

                        gTrans.transInfo.MaSoThue = dataGen.Ma_DV;
                        gTrans.transInfo.TenNNT = dataGen.Ten_DV;
                        gTrans.transInfo.TenKB = dataGen.Ma_KB + " - " + dataGen.Ten_KB;

                        var treasuryAccNumValue = dataGen.TKKB + ' - ';
                        if (dataGen.TKKB == '7111') {
                            treasuryAccNumValue = treasuryAccNumValue + CONST_STR.get('TAX_TREASURY_ACC_NOP_NSNN');
                        } else if (dataGen.TKKB == '3511') {
                            treasuryAccNumValue = treasuryAccNumValue + CONST_STR.get('TAX_TREASURY_ACC_TAM_THU');
                        } else {
                            treasuryAccNumValue = treasuryAccNumValue + CONST_STR.get('TAX_TREASURY_ACC_THU_QUY');
                        }
                        gTrans.transInfo.treasuryAccNumValueView = treasuryAccNumValue;

                        gTrans.transInfo.Ten_HQ_View = dataGen.Ma_HQ + " - " + dataGen.Ten_HQ;
                        gTrans.transInfo.So_TK = dataGen.So_TK;
                        gTrans.transInfo.Ma_LT_View = dataGen.Ma_LT + " - " + CONST_STR.get('K_TAX_HQ_' + dataGen.Ma_LT);
                        gTrans.transInfo.Ngay_DK = dataGen.Ngay_DK;
                        gTrans.transInfo.Ten_LH_View = dataGen.Ma_LH + " - " + dataGen.Ten_LH;

                        var dataCheckBox = document.getElementsByName('userRefId');
                        gTrans.transInfo.listPending = new Array();
                        if (dataGen.CT_NO === undefined || dataGen.CT_NO.length === undefined) {
                            if (dataCheckBox[0].checked == true || dataCheckBox.checked == true) {
                                var amount = String(dataGen.CT_NO.DuNo).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                dataGen.CT_NO.DuNoView = amount + ' VND';
                                gTrans.transInfo.listPending.push(dataGen);
                            }
                        } else {
                            for (var i = 0; i < dataCheckBox.length; i++) {
                                if (dataCheckBox[i].checked == true) {
                                    if (i < dataCheckBox.length/2)
                                    {
                                        var amount = String(dataGen.CT_NO[i].DuNo).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        dataGen.CT_NO[i].DuNoView = amount + ' VND';
                                        gTrans.transInfo.listPending.push(dataGen.CT_NO[i]);
                                    }
                                    else
                                    {
                                        var amount = String(dataGen.CT_NO[i - dataCheckBox.length/2].DuNo).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        dataGen.CT_NO[i - dataCheckBox.length/2].DuNoView = amount + ' VND';
                                        gTrans.transInfo.listPending.push(dataGen.CT_NO[i - dataCheckBox.length/2]);
                                    }
                                }
                            }
                        }

                        var dataTotalAmount = String(response.respJsonObj.totalAmount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        gTrans.transInfo.dataTotalAmountView = dataTotalAmount + ' VND';

                        var dataFee = String(response.respJsonObj.fee).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        gTrans.transInfo.dataFeeView = dataFee + ' VND';

                        var dataSoDu = parseFloat(gTax.soDuKhaDung.replace(new RegExp(',', 'g'), '')) - parseFloat(response.respJsonObj.totalAmount) - parseFloat(response.respJsonObj.fee);
                        dataSoDu = String(dataSoDu).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        gTrans.transInfo.dataSoDuView = dataSoDu + ' VND';

                        gTrans.transInfo.decreption = response.respJsonObj.decreption;
                        gTrans.transInfo.saveTaxQuery = document.getElementById('id.saveTaxQuery').value
                        gTrans.transInfo.sendMSGApprover = document.getElementById('id.notifyTo').value;
                        gTrans.transInfo.transId = response.respJsonObj.transaction_id;
                        //gTrans.transInfo.accountBalance = formatNumberToCurrency(gTrans.listSourceAccounts[0].balance);;
                        navController.pushToView("common/common-review/transfer-review-scr", true, "html");
                        //genReviewScreen(response.respJsonObj);
                    } else if (response.respCode == RESP.get('COM_VALIDATE_FAIL') && response.responseType == CONSTANTS.get('CMD_CO_PAY_TAX_PROCESSOR')) {
                        showAlertText(response.respContent);
                    } else if (response.respCode == 38) {
                        showAlertText(CONST_STR.get('COM_TAX_AMOUNT_HIGH_THAN_BALANCE'));
                    } else {
                        if (response.respCode == '1019') {
                            showAlertText(response.respContent);
                        } else {
                            showAlertText(CONST_STR.get('ERR_COM_TRANS_FAILED'));
                        }
                        // var tmpPageName = navController.getDefaultPage();
                        // var tmpPageType = navController.getDefaultPageType();
                        // navController.initWithRootView(tmpPageName, true, tmpPageType);
                    }
                });
            }
        }
        function genReviewScreen(data) {
            var dataGen;
            if (gTax.imExportData.ThongDiep.Body.ThongtinToKhai.length > 0) {
                dataGen = gTax.imExportData.ThongDiep.Body.ThongtinToKhai[gTax.stt];
            } else if (gTax.imExportData.ThongDiep.Body.ThongtinToKhai.Ma_DV !== undefined && gTax.imExportData.ThongDiep.Body.ThongtinToKhai.Ma_DV != null) {
                dataGen = gTax.imExportData.ThongDiep.Body.ThongtinToKhai;
            } else {
                dataGen = gTax.imExportData.ThongDiep.Body.ThongtinToKhai[gTax.stt];
            }

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
            createXMLNode("value", dataGen.Ma_DV, xmlDoc, rowNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_CUST_PAY_TAX'), xmlDoc, rowNode);
            createXMLNode("value", dataGen.Ten_DV, xmlDoc, rowNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_CUST_PAY_TAX_ADDRESS'), xmlDoc, rowNode);
            createXMLNode("value", "", xmlDoc, rowNode);

            // Thông tin nộp thuế
            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            createXMLNode("title", CONST_STR.get('TAX_INFO'), xmlDoc, sectionNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('COM_TAX_TYPE'), xmlDoc, rowNode);
            createXMLNode("value", "04 - " + CONST_STR.get('CONST_TAX_02'), xmlDoc, rowNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_TREASURY_NAME'), xmlDoc, rowNode);
            createXMLNode("value", dataGen.Ma_KB + " - " + dataGen.Ten_KB, xmlDoc, rowNode);

            var treasuryAccNumValue = dataGen.TKKB + ' - ';
            if (dataGen.TKKB == '7111') {
                treasuryAccNumValue = treasuryAccNumValue + CONST_STR.get('TAX_TREASURY_ACC_NOP_NSNN');
            } else if (dataGen.TKKB == '3511') {
                treasuryAccNumValue = treasuryAccNumValue + CONST_STR.get('TAX_TREASURY_ACC_TAM_THU');
            } else {
                treasuryAccNumValue = treasuryAccNumValue + CONST_STR.get('TAX_TREASURY_ACC_THU_QUY');
            }

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_TREASURY_ACC'), xmlDoc, rowNode);
            createXMLNode("value", treasuryAccNumValue, xmlDoc, rowNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_TREASURY_MNG'), xmlDoc, rowNode);
            createXMLNode("value", dataGen.Ma_HQ + " - " + dataGen.Ten_HQ, xmlDoc, rowNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('COM_DECLAR'), xmlDoc, rowNode);
            createXMLNode("value", dataGen.So_TK, xmlDoc, rowNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_MONEY_TYPE'), xmlDoc, rowNode);
            createXMLNode("value", dataGen.Ma_LT + " - " + CONST_STR.get('K_TAX_HQ_' + dataGen.Ma_LT), xmlDoc, rowNode);

            var declarDate = dataGen.Ngay_DK;
            /* var yDeclarDate = declarDate.substring(6, 9);
             var mDeclarDate = declarDate.substring(3, 4);
             var dDeclarDate = declarDate.substring(0,1);*/

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_DECLAR_DATE'), xmlDoc, rowNode);
            // createXMLNode("value", dDeclarDate + '/' + mDeclarDate + '/' + yDeclarDate, xmlDoc, rowNode);
            createXMLNode("value", declarDate, xmlDoc, rowNode);

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_IE_CODE_TYPE'), xmlDoc, rowNode);
            createXMLNode("value", dataGen.Ma_LH + " - " + dataGen.Ten_LH, xmlDoc, rowNode);

            // Thông tin giao dịch
            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            createXMLNode("title", CONST_STR.get('COM_TRASACTION_INFO'), xmlDoc, sectionNode);

            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            var tableNode = createXMLNode("table", "", xmlDoc, sectionNode);
            var theadNode = createXMLNode("thead", "", xmlDoc, tableNode);

            var trNode = createXMLNode("tr", '', xmlDoc, theadNode);
            createXMLNode("class", 'trow-title', xmlDoc, trNode);
            var tdNode = createXMLNode("td", CONST_STR.get("COM_NO"), xmlDoc, trNode);
            createXMLNode("class", "text-center", xmlDoc, tdNode);

            tdNode = createXMLNode("td", CONST_STR.get("TAX_CHAPTER"), xmlDoc, trNode);
            createXMLNode("class", "text-center", xmlDoc, tdNode);

            tdNode = createXMLNode("td", CONST_STR.get("TAX_CONTENT"), xmlDoc, trNode);
            createXMLNode("class", "text-center", xmlDoc, tdNode);

            tdNode = createXMLNode("td", CONST_STR.get("COM_AMOUNT"), xmlDoc, trNode);
            createXMLNode("class", "text-center", xmlDoc, tdNode);

            var tbodyNode = createXMLNode("tbody", "", xmlDoc, tableNode);

            var dataCheckBox = document.getElementsByName('userRefId');
            var sttNo = 0;
            if (dataGen.CT_NO === undefined || dataGen.CT_NO.length === undefined) {
                if (dataCheckBox[0].checked == true || dataCheckBox.checked == true) {
                    trNode = createXMLNode("tr", "", xmlDoc, tbodyNode);
                    var tdNode = createXMLNode("td", "1", xmlDoc, trNode);
                    createXMLNode("title", CONST_STR.get("COM_NO"), xmlDoc, tdNode);

                    tdNode = createXMLNode("td", dataGen.CT_NO.Khoan, xmlDoc, trNode);
                    createXMLNode("title", CONST_STR.get("TAX_CHAPTER"), xmlDoc, tdNode);

                    tdNode = createXMLNode("td", dataGen.CT_NO.TenTieuMuc, xmlDoc, trNode);
                    createXMLNode("title", CONST_STR.get("TAX_CONTENT"), xmlDoc, tdNode);

                    var amount = String(dataGen.CT_NO.DuNo).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    tdNode = createXMLNode("td", amount + ' VND', xmlDoc, trNode);
                    createXMLNode("class", "td-right", xmlDoc, tdNode);
                    createXMLNode("title", CONST_STR.get("COM_AMOUNT"), xmlDoc, tdNode)

                    /*tdNode = createXMLNode("td", dataGen.DuNo.Chuong, xmlDoc, trNode);
                     createXMLNode("title", CONST_STR.get("TAX_CHAPTER"), xmlDoc, tdNode);

                     tdNode = createXMLNode("td", dataGen.DuNo.TieuMuc, xmlDoc, trNode);
                     createXMLNode("title", CONST_STR.get("TAX_CONTENT"), xmlDoc, tdNode);

                     var amount = String(dataGen.DuNo.Amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                     tdNode = createXMLNode("td", amount + ' VND', xmlDoc, trNode);
                     createXMLNode("class", "td-right", xmlDoc, tdNode);
                     createXMLNode("title", CONST_STR.get("COM_AMOUNT"), xmlDoc, tdNode);*/
                }
            } else {
                for (var i = 0; i < dataCheckBox.length; i++) {
                    if (dataCheckBox[i].checked == true) {
                        sttNo = sttNo + 1;
                        trNode = createXMLNode("tr", "", xmlDoc, tbodyNode);
                        var tdNode = createXMLNode("td", sttNo, xmlDoc, trNode);
                        createXMLNode("title", CONST_STR.get("COM_NO"), xmlDoc, tdNode);

                        tdNode = createXMLNode("td", dataGen.CT_NO[i].Khoan, xmlDoc, trNode);
                        createXMLNode("title", CONST_STR.get("TAX_CHAPTER"), xmlDoc, tdNode);

                        tdNode = createXMLNode("td", dataGen.CT_NO[i].TenTieuMuc, xmlDoc, trNode);
                        createXMLNode("title", CONST_STR.get("TAX_CONTENT"), xmlDoc, tdNode);

                        var amount = String(dataGen.CT_NO[i].DuNo).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        tdNode = createXMLNode("td", amount + ' VND', xmlDoc, trNode);
                        createXMLNode("class", "td-right", xmlDoc, tdNode);
                        createXMLNode("title", CONST_STR.get("COM_AMOUNT"), xmlDoc, tdNode);
                    }
                }
            }

            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('COM_AMOUNT'), xmlDoc, rowNode);
            var dataTotalAmount = String(data.totalAmount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            createXMLNode("value", dataTotalAmount + ' VND', xmlDoc, rowNode);

            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_FEE'), xmlDoc, rowNode);
            var dataFee = String(data.fee).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            createXMLNode("value", dataFee + ' VND', xmlDoc, rowNode);

            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_LOCAL_BALANCE_CONT'), xmlDoc, rowNode);
            var dataSoDu = parseFloat(gTax.soDuKhaDung.replace(new RegExp(',', 'g'), '')) - parseFloat(data.totalAmount) - parseFloat(data.fee);
            dataSoDu = String(dataSoDu).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            createXMLNode("value", dataSoDu + ' VND', xmlDoc, rowNode);

            sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_DESCRIPTION'), xmlDoc, rowNode);
            createXMLNode("value", data.decreption, xmlDoc, rowNode);

            /* sectionNode = createXMLNode("section", "", xmlDoc, rootNode);
             rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
             createXMLNode("label", CONST_STR.get('TAX_LOCAL_DATE_TRANS'), xmlDoc, rowNode);
             createXMLNode("value", data.dateValue, xmlDoc, rowNode);*/

            rowNode = createXMLNode("row", "", xmlDoc, sectionNode);
            createXMLNode("label", CONST_STR.get('TAX_SAVE_TAX_QUERY'), xmlDoc, rowNode);
            createXMLNode("value", document.getElementById('id.saveTaxQuery').value, xmlDoc, rowNode);

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

        // Khi click vao luu thong tin truy van
        $scope.saveQueryInfo = function () {
            var saveTaxOptionsValue = (gUserInfo.lang == 'EN') ? CONST_TAX_INFO_QUERY_DOMESTIC_VALUE_EN : CONST_TAX_INFO_QUERY_DOMESTIC_VALUE_VN;
            var saveTaxOptionKey = CONST_TAX_INFO_QUERY_DOMESTIC_KEY;

            document.addEventListener("evtSelectionDialog", handleSaveQueryInfo, false);
            document.addEventListener("evtSelectionDialogClose", handleSaveQueryInfoClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC'), saveTaxOptionsValue, saveTaxOptionKey, false);
        }

        function handleSaveQueryInfo(e) {
            if (currentPage == "payment_service/create/tax/pay_tax_create_imexport_dtl") {
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
            if (currentPage == "payment_service/create/tax/pay_tax_create_imexport_dtl") {
                document.removeEventListener("evtSelectionDialogClose", handleSaveQueryInfoClose, false);
                document.removeEventListener("evtSelectionDialog", handleSaveQueryInfo, false);
            }
        }

        $scope.taxImExportCallBack = function () {
            navController.popView(true);
        }

        $scope.taxImExportCancel = function () {
            navController.initWithRootView('payment_service/create/tax/pay_tax_create', true, 'html');
        }

        $scope.initBottomBar = function (){
            var arrBottom = new Array();
            arrBottom.push(new MenuBottom("AUTO_BILLING_TAB_LIST", "icon-scheduled-transfers-list"));
            periodParam = new PeriodParam(CONSTANTS.get("CMD_TRANSFER_PERIODIC_MNG_TRANS"),CONST_VAL_PERIODIC_LOCAL[0]);


            navController.initBottomBarWithCallBack("payment_service/create/tax/pay_tax_create_imexport_dtl", arrBottom, "pay_tax_create_imexport_dtl", function (index) {
                //switchAction(index);
                updateAccountListInfo();
                navController.pushToView("common/com_list_user_approve", true, 'html');
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
