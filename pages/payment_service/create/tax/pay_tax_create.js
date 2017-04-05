// JavaScript Document
gTax.isBack = false;
gTax.accountNumbers = [];
gTax.accountBalances = [];
var taxType;
var arrTax = [];
var gTaxBene = {};
var comboEl;
gTrans.ortherSrc = "payment_service/create/tax/pay_tax_create";
/// Thuc hien khi ma load trang web thanh cong
function viewDidLoadSuccess() {
    init();
    actionbar.showStepSequence("com-authentication-scr");
    navController.getActionBar().setTitleBarOnly(CONST_STR.get("MENU_CHILD_PAY_TAX"));
}

function viewWillUnload() {
    // document.removeEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
    // document.removeEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
}

function viewBackFromOther() {
    gTax.isBack = true;
}
function init() {
    angular.module('EbankApp').controller('pay_tax_create', function ($scope, requestMBServiceCorp) {
        (gUserInfo.lang == 'VN') ? document.getElementById('id.taxType').value = CONST_TRANS_PAY_TAX_TYPE_VALUE_VN[0] : document.getElementById('id.taxType').value = CONST_TRANS_PAY_TAX_TYPE_VALUE_EN[0];
        document.getElementById('id.taxTypeValue').value = CONST_TRANS_PAY_TAX_TYPE_KEY[0];

					if ((document.getElementById('id.taxTypeValue').value != undefined) && (document.getElementById('id.taxTypeValue').value != null)) {
                        if (document.getElementById('id.taxTypeValue').value == '02' || document.getElementById('id.taxTypeValue').value == '03' || document.getElementById('id.taxTypeValue').value == '05') {
                            document.getElementById('tr.externalTax').style.display = "";
                            document.getElementById('tr.taxNumDeclar').style.display = "";
                            document.getElementById('tr.taxYearDeclar').style.display = "";
                            document.getElementById('tr.trans-other-acc').style.display = "";

                            document.getElementById('trans.taxNum').value = "";
                            document.getElementById('id.taxNumDeclar').value = "";
                            document.getElementById('id.taxYearDeclar').value = "";
                            document.getElementById('trans.taxNum').value = "";

                            document.getElementById('tr.taxInfoOrg').style.display = "none";
                            document.getElementById('tr.taxNumberBrief').style.display = "none";
                            document.getElementById('tr.taxSingnal').style.display = "none";
                            document.getElementById('tr.taxNumFiles').style.display = "none";
                            document.getElementById('tr.taxOrgCode').style.display = "none";
                            document.getElementById('tr.taxOrgYear').style.display = "none";

                            document.getElementById('id.taxNumberBrief').value = "";
                            document.getElementById('id.taxSingnal').value = "";
                            document.getElementById('id.taxNumFiles').value = "";
                            document.getElementById('id.taxOrgCode').value = "";
                            document.getElementById('id.taxOrgYear').value = "";
                        } else if (document.getElementById('id.taxTypeValue').value == '06') {
                            document.getElementById('tr.taxInfoOrg').style.display = "";
                            document.getElementById('tr.taxNumberBrief').style.display = "";
                            document.getElementById('tr.taxSingnal').style.display = "";
                            document.getElementById('tr.taxNumFiles').style.display = "";
                            document.getElementById('tr.taxOrgCode').style.display = "";
                            document.getElementById('tr.taxOrgYear').style.display = "";

                            document.getElementById('id.taxNumberBrief').value = "";
                            document.getElementById('id.taxSingnal').value = "";
                            document.getElementById('id.taxNumFiles').value = "";
                            document.getElementById('id.taxOrgCode').value = "";
                            document.getElementById('id.taxOrgYear').value = "";

                            document.getElementById('tr.trans-other-acc').style.display = "none";
                            document.getElementById('trans.taxNum').value = "";
                            document.getElementById('tr.externalTax').style.display = "none";
                            document.getElementById('id.taxNumDeclar').value = "";
                            document.getElementById('tr.taxNumDeclar').style.display = "none";
                            document.getElementById('id.taxYearDeclar').value = "";
                            document.getElementById('tr.taxYearDeclar').style.display = "none";
                        }
                        else {
                            document.getElementById('tr.externalTax').style.display = "none";
                            document.getElementById('tr.taxNumDeclar').style.display = "none";
                            document.getElementById('tr.taxYearDeclar').style.display = "none";
                            document.getElementById('tr.trans-other-acc').style.display = "";

                            if(!gTax.isBack){
                                document.getElementById('trans.taxNum').value = "";
                            }

                            document.getElementById('id.taxNumDeclar').value = "";
                            document.getElementById('id.taxYearDeclar').value = "";


                            document.getElementById('tr.taxInfoOrg').style.display = "none";
                            document.getElementById('tr.taxNumberBrief').style.display = "none";
                            document.getElementById('tr.taxSingnal').style.display = "none";
                            document.getElementById('tr.taxNumFiles').style.display = "none";
                            document.getElementById('tr.taxOrgCode').style.display = "none";
                            document.getElementById('tr.taxOrgYear').style.display = "none";

                            document.getElementById('id.taxNumberBrief').value = "";
                            document.getElementById('id.taxSingnal').value = "";
                            document.getElementById('id.taxNumFiles').value = "";
                            document.getElementById('id.taxOrgCode').value = "";
                            document.getElementById('id.taxOrgYear').value = "";
                        }
                    }

		
		// Cho su kien chon [tai khoan chuyen]
        $scope.showAccountSelection = function () {
            if (gTax.accountNumbers.length == 0) {
                showAlertText(CONST_STR.get('CORP_MSG_COM_NO_DATA_FOUND'));
            } else {
                var handleSelectionAccountList = function (e) {
                    if (currentPage == "payment_service/create/tax/pay_tax_create") {
                        document.removeEventListener("evtSelectionDialog", handleSelectionAccountList, false);

                        if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                            var tagAccNo = document.getElementById("id.accountno");
                            if (tagAccNo.nodeName == "INPUT") {
                                tagAccNo.value = e.selectedValue1;
                                gTax.accountNo = e.selectedValue1;
                            }
							for (var i in gTrans.listSourceAccounts){
								if (e.selectedValue1 == gTrans.listSourceAccounts[i].account){
									gTrans.sourceAcc = gTrans.listSourceAccounts[i];
									$scope.initComboTextAccount(i);
								}
							}
                        }

                        if (e.selectedValue1 != undefined) {
                            // document.getElementById("trans.sourceaccoutbalance").innerHTML =
                                // "<div class='availblstyle widefull'>" + CONST_STR.get('COM_TXT_ACC_BALANCE_TITLE') + ": " + e.selectedValue2 + " VND" + "</div>";
                            gTax.soDuKhaDung = e.selectedValue2;
                        }
                    }
                }

                var handleSelectionAccountListClose = function (e) {
                    if (currentPage == "payment_service/create/tax/pay_tax_create") {
                        document.removeEventListener("evtSelectionDialogClose", handleSelectionAccountListClose, false);
                        document.removeEventListener("evtSelectionDialog", handleSelectionAccountList, false);
                    }
                };

                document.addEventListener("evtSelectionDialog", handleSelectionAccountList, false);
                document.addEventListener("evtSelectionDialogClose", handleSelectionAccountListClose, false);
                showDialogList(CONST_STR.get('COM_DIALOG_TITLE_ACCNO_CHOISE'), gTax.accountNumbers, gTax.accountBalances, true);
            }
        }
        $scope.initComboTextAccount = function (index){
            var accountName =  "Invalid";
            var accountNumber = "Invalid";
            var accountBalance = "Invalid";

            try{
                document.getElementById("holder-account-info").innerHTML = "";
                accountName = gUserInfo.accountName;
                accountNumber = gTrans.listSourceAccounts[index].account;
                accountBalance = formatNumberToCurrency(gTrans.listSourceAccounts[index].balance);
                document.getElementById('id.accountno').value = gTrans.listSourceAccounts[index].account;
				gTax.accountNo = gTrans.listSourceAccounts[index].account;
				gTax.soDuKhaDung = formatNumberToCurrency(gTrans.listSourceAccounts[index].balance);
            }catch(e){
                logInfo("khong load duoc thong tin tai khoan");
            }

            comboEl = new Combo({
                containerId : "cb-container", //holder of combo
                accountName : accountName, //account name
                accountNumber : accountNumber, //account number
                accountBalance : accountBalance, //account balance
                borderColor : "yellow", // border color
                containerPadding : "0px", // set padding to holder of combo
                containerMargin : "0px",
                showBorderTop : false,
                fontSize : "12px",
                showBorderBottom : false,//set margin to holder of combo
                clickIt : function (){ //handle function click
                    console.log("already click");
                }
            });
            comboEl.show("holder-account-info");

        }

        // Thuc hien su kien khi click vao ma so thue
        $scope.getTemplateTax = function () {
            var chooseTax = document.getElementById('id.taxTypeValue').value;
            var argsArray = [];
            argsArray.push("1");
            argsArray.push(JSON.stringify({
                idtxn: "B11",
                taxType: chooseTax
            }));

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_PAY_TAX_PROCESSOR"), "", "", gUserInfo.lang, gUserInfo.sessionID, argsArray);
            data = getDataFromGprsCmd(gprsCmd);

            // gọi service và xử lí logic
            requestMBServiceCorp.post(data, true, function (data) {
                var response = data;
                if (response.respCode == RESP.get('COM_SUCCESS')
                    && response.responseType == CONSTANTS.get('CMD_CO_PAY_TAX_PROCESSOR')) {
                    setRespObjStore(response);
                    var obj = response.respJsonObj;

                    if (response.respJsonObj.length == 0) {
                        showAlertText(CONST_STR.get('CORP_MSG_COM_NO_DATA_FOUND'));
                    } else {
                        document.addEventListener("evtSelectionDialog", handleSelectTempTax, false);
                        document.addEventListener("evtSelectionDialogClose", handleTempTaxClose, false);

                        var taxNum = [];
                        var taxType = [];
                        var declar = [];
                        var yearDeclar = [];
                        var record = [];
                        var agency = [];
                        arrTax = [];
                        for (var i in obj) {
                            taxNum.push(obj[i].TAX_CODE);
                            taxType.push(obj[i].TAX_TYPE);
                            declar.push(obj[i].DECLARATION);
                            yearDeclar.push(obj[i].DECLARATION_YEAR);
                            record.push(obj[i].RECORD);
                            agency.push(obj[i].AGENCY_CODE);

                            gTaxBene = new Object();
                            gTaxBene.TAX_CODE = obj[i].TAX_CODE;
                            gTaxBene.TAX_TYPE = obj[i].TAX_TYPE;
                            gTaxBene.DECLARATION = obj[i].DECLARATION;
                            gTaxBene.DECLARATION_YEAR = obj[i].DECLARATION_YEAR;
                            gTaxBene.RECORD = obj[i].RECORD;
                            gTaxBene.NUMBER_CT = obj[i].NUMBER_CT;
                            gTaxBene.SYMBOL_VOUCHERS = obj[i].SYMBOL_VOUCHERS;
                            gTaxBene.YEAR_CT = obj[i].YEAR_CT;
                            gTaxBene.AGENCY_CODE = obj[i].AGENCY_CODE;

                            arrTax.push(gTaxBene);

                        }

                        if (chooseTax == "02") {
                            showTemplateEITax(CONST_STR.get('CHOOSE_TEMPLATE_QUERY'), taxNum, taxType, declar, yearDeclar, true);
                        } else if (chooseTax == "01") {
                            showTemplateDomesticTax(CONST_STR.get('CHOOSE_TEMPLATE_QUERY'), taxNum, taxType, false);
                        } else if (chooseTax == "05") {
                            showTemplateEITax(CONST_STR.get('CHOOSE_TEMPLATE_QUERY'), taxNum, taxType, declar, yearDeclar, true);
                            //showTemplateDomesticTax(CONST_STR.get('CHOOSE_TEMPLATE_QUERY'), declar, declar, false);
                        } else if (chooseTax == "06") {
                            showTemplateEITax(CONST_STR.get('CHOOSE_TEMPLATE_QUERY'), record, record, agency, agency, true);
                            //showTemplateDomesticTax(CONST_STR.get('CHOOSE_TEMPLATE_QUERY'), record, record, false);
                        }
                    }
                } else {
                    showAlertText(CONST_STR.get('CORP_MSG_COM_NO_DATA_FOUND'));
                }
            });
        }

        $scope.dataFilter = function () {
            var dataFilter = document.getElementById("id.inputAcc").value;
            var dataDisplay = document.getElementsByName("dataDisplay");
            var checkDataFound = false;

            for (var i = 0; i < dataDisplay.length; i++) {
                if (dataDisplay[i].childNodes[0].nodeValue.indexOf(dataFilter) == -1) {
                    dataDisplay[i].style.display = "none";
                } else {
                    dataDisplay[i].style.display = "block";
                    checkDataFound = true;
                }
            }

            if (checkDataFound == true) {
                document.getElementById("noDataFound").style.display = "none";
            } else {
                document.getElementById("noDataFound").style.display = "block";
            }
        }

        function handleSelectTempTax(e) {
            handleTempTaxClose();
            //document.getElementById('trans.taxNum').value = e.selectedValue1;
            var taxchoice = document.getElementById("id.taxTypeValue").value;
            /*if (taxchoice == "02") {
             var dataChoose = e.selectedValue1.split("/");
             document.getElementById('id.taxNumDeclar').value = dataChoose[0];
             document.getElementById('id.taxYearDeclar').value = dataChoose[1];
             }else */
            if (taxchoice == "02" || taxchoice == "05") {
                var dataChoose = e.selectedValue1.split("/");
                var dataChoose2 = e.selectedValue2.split("/");
                var declar = dataChoose2[0];
                var taxNum = dataChoose[0];

                for (var i = 0; i < arrTax.length; i++) {
                    var obj = arrTax[i];
                    if (taxNum == obj.TAX_CODE && declar == obj.DECLARATION) {
                        document.getElementById('trans.taxNum').value = obj.TAX_CODE;
                        document.getElementById('id.taxNumDeclar').value = obj.DECLARATION;
                        document.getElementById('id.taxYearDeclar').value = obj.DECLARATION_YEAR;
                    }
                }
            }
            else if (taxchoice == "01") {
                var dataChoose = e.selectedValue1.split("/");
                var dataChoose2 = e.selectedValue2.split("/");
                var declar = dataChoose2[0];
                var taxNum = dataChoose[0];

                for (var i = 0; i < arrTax.length; i++) {
                    var obj = arrTax[i];
                    if (taxNum == obj.TAX_CODE && declar == obj.TAX_TYPE) {
                        document.getElementById('trans.taxNum').value = obj.TAX_CODE;
                    }
                }
            }
            else if (taxchoice == "06") {
                var dataChoose = e.selectedValue1.split("/");
                var dataChoose2 = e.selectedValue1.split("/");
                var record = dataChoose[0];
                var agency = dataChoose2[0];

                for (var i = 0; i < arrTax.length; i++) {
                    var obj = arrTax[i];
                    if (record == obj.RECORD) {
                        document.getElementById('id.taxNumberBrief').value = obj.RECORD;
                        document.getElementById('id.taxSingnal').value = obj.SYMBOL_VOUCHERS;
                        document.getElementById('id.taxNumFiles').value = obj.NUMBER_CT;
                        document.getElementById('id.taxOrgCode').value = obj.AGENCY_CODE;
                        document.getElementById('id.taxOrgYear').value = obj.YEAR_CT;
                    }
                }

            }
        }

        function handleTempTaxClose() {
            document.removeEventListener("evtSelectionDialogClose", handleTempTaxClose, false);
            document.removeEventListener("evtSelectionDialog", handleSelectTempTax, false);
        }

        //Show loai thue
        $scope.ShowTaxType = function () {
            var taxValue = (gUserInfo.lang == 'EN') ? CONST_TRANS_PAY_TAX_TYPE_VALUE_EN
                : CONST_TRANS_PAY_TAX_TYPE_VALUE_VN;
            taxType = CONST_TRANS_PAY_TAX_TYPE_KEY;

            var handleShowTaxType = function (e) {
                if (currentPage == "payment_service/create/tax/pay_tax_create") {
                    document.removeEventListener("evtSelectionDialog", handleShowTaxType, false);
                    if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                        document.getElementById('id.taxType').value = e.selectedValue1;
                    }
                    if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                        document.getElementById('id.taxTypeValue').value = e.selectedValue2;
                        taxType = e.selectedValue2;
                        gTax.taxType = taxType;

                        if (e.selectedValue2 == '02' || e.selectedValue2 == '03' || e.selectedValue2 == '05') {
                            document.getElementById('tr.externalTax').style.display = "";
                            document.getElementById('tr.taxNumDeclar').style.display = "";
                            document.getElementById('tr.taxYearDeclar').style.display = "";
                            document.getElementById('tr.trans-other-acc').style.display = "";

                            document.getElementById('trans.taxNum').value = "";
                            document.getElementById('id.taxNumDeclar').value = "";
                            document.getElementById('id.taxYearDeclar').value = "";
                            document.getElementById('trans.taxNum').value = "";

                            document.getElementById('tr.taxInfoOrg').style.display = "none";
                            document.getElementById('tr.taxNumberBrief').style.display = "none";
                            document.getElementById('tr.taxSingnal').style.display = "none";
                            document.getElementById('tr.taxNumFiles').style.display = "none";
                            document.getElementById('tr.taxOrgCode').style.display = "none";
                            document.getElementById('tr.taxOrgYear').style.display = "none";

                            document.getElementById('id.taxNumberBrief').value = "";
                            document.getElementById('id.taxSingnal').value = "";
                            document.getElementById('id.taxNumFiles').value = "";
                            document.getElementById('id.taxOrgCode').value = "";
                            document.getElementById('id.taxOrgYear').value = "";
                        } else if (e.selectedValue2 == '06') {
                            document.getElementById('tr.taxInfoOrg').style.display = "";
                            document.getElementById('tr.taxNumberBrief').style.display = "";
                            document.getElementById('tr.taxSingnal').style.display = "";
                            document.getElementById('tr.taxNumFiles').style.display = "";
                            document.getElementById('tr.taxOrgCode').style.display = "";
                            document.getElementById('tr.taxOrgYear').style.display = "";

                            document.getElementById('id.taxNumberBrief').value = "";
                            document.getElementById('id.taxSingnal').value = "";
                            document.getElementById('id.taxNumFiles').value = "";
                            document.getElementById('id.taxOrgCode').value = "";
                            document.getElementById('id.taxOrgYear').value = "";

                            document.getElementById('tr.trans-other-acc').style.display = "none";
                            document.getElementById('trans.taxNum').value = "";
                            document.getElementById('tr.externalTax').style.display = "none";
                            document.getElementById('id.taxNumDeclar').value = "";
                            document.getElementById('tr.taxNumDeclar').style.display = "none";
                            document.getElementById('id.taxYearDeclar').value = "";
                            document.getElementById('tr.taxYearDeclar').style.display = "none";
                        }
                        else {
                            document.getElementById('tr.externalTax').style.display = "none";
                            document.getElementById('tr.taxNumDeclar').style.display = "none";
                            document.getElementById('tr.taxYearDeclar').style.display = "none";
                            document.getElementById('tr.trans-other-acc').style.display = "";

//                            document.getElementById('trans.taxNum').value = "";
                            document.getElementById('id.taxNumDeclar').value = "";
                            document.getElementById('id.taxYearDeclar').value = "";
//                            document.getElementById('trans.taxNum').value = "";

                            document.getElementById('tr.taxInfoOrg').style.display = "none";
                            document.getElementById('tr.taxNumberBrief').style.display = "none";
                            document.getElementById('tr.taxSingnal').style.display = "none";
                            document.getElementById('tr.taxNumFiles').style.display = "none";
                            document.getElementById('tr.taxOrgCode').style.display = "none";
                            document.getElementById('tr.taxOrgYear').style.display = "none";

                            document.getElementById('id.taxNumberBrief').value = "";
                            document.getElementById('id.taxSingnal').value = "";
                            document.getElementById('id.taxNumFiles').value = "";
                            document.getElementById('id.taxOrgCode').value = "";
                            document.getElementById('id.taxOrgYear').value = "";
                        }
                    }
                }
            }

            var handleShowTaxTypeClose = function () {
                if (currentPage == "payment_service/create/tax/pay_tax_create") {
                    document.removeEventListener("evtSelectionDialogClose", handleShowTaxTypeClose, false);
                    document.removeEventListener("evtSelectionDialog", handleShowTaxType, false);
                }
            }

            document.addEventListener("evtSelectionDialog", handleShowTaxType, false);
            document.addEventListener("evtSelectionDialogClose", handleShowTaxTypeClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC'), taxValue, taxType, false);
        }

        function requestResultServiceSuccess(e) {
            var gprsResp = e;
            if (gprsResp.respCode == RESP.get('COM_SUCCESS')
                && (gprsResp.responseType == CONSTANTS.get('CMD_CO_PAY_TAX_PROCESSOR') || gprsResp.responseType == CONSTANTS.get('CMD_CO_PAY_TAX_ORGANIZATION'))) {
                if (document.getElementById('id.taxTypeValue').value == "02") {
                    gTax.imExportData = JSON.parse(gprsResp.respJsonObj.respCus);
                    gTax.treasuryData = gprsResp.respJsonObj.respTreasuryInfo;
                    gTax.methodSend = gprsResp.respJsonObj.methodSend;
                   // var economyName = gprsResp.respJsonObj.economyName;
                    var declarations = gTax.imExportData.ThongDiep.Body.ThongtinToKhai;
                    /*for (var i = 0; i < declarations.length; i++) {

                        declarations[i].CT_NO.TenTieuMuc = economyName;
                    }*/
                    // Gọi đên màn hình hiển cho phần thuế xuất nhập khẩu
					navCachedPages["payment_service/create/tax/pay_tax_create_imexport"] = null;
                    navController.pushToView("payment_service/create/tax/pay_tax_create_imexport", true, 'html');
                } else if (document.getElementById('id.taxTypeValue').value == "06") {
                    gTax.organizationData = JSON.parse(gprsResp.respJsonObj.respCus);
                    gTax.treasuryData = gprsResp.respJsonObj.respTreasuryInfo;
                    gTax.methodSend = gprsResp.respJsonObj.methodSend;

                    navCachedPages["payment_service/create/tax/pay_tax_create_organization"] = null;
                    navController.pushToView("payment_service/create/tax/pay_tax_create_organization", true, 'html');
                    //genReviewScreenOrganization(gTax.organizationData, gTax.treasuryData);
                } else if (document.getElementById('id.taxTypeValue').value == "05") {
                    gTax.imExportData = JSON.parse(gprsResp.respJsonObj.respCus);
                    gTax.treasuryData = gprsResp.respJsonObj.respTreasuryInfo;
                    gTax.methodSend = gprsResp.respJsonObj.methodSend;
                    gTax.economyName = gprsResp.respJsonObj.economyName
                    var declarations = gTax.imExportData.ThongDiep.Body.ThongtinToKhai;
                    /*for (var i = 0; i < declarations.length; i++) {
                        declarations[i].TenTieuMuc = gTax.economyName;
                    }*/
                    // Gọi đên màn hình hiển cho phần thuế xuất nhập khẩu
                    navCachedPages["payment_service/create/tax/pay_tax_charge_imexport"] = null;
                    navController.pushToView("payment_service/create/tax/pay_tax_charge_imexport", true, 'html');
                }
                else {
                    gTax.domesticData = JSON.parse(gprsResp.respJsonObj.respCus);
                    gTax.treasuryData = gprsResp.respJsonObj.respTreasuryInfo;
                    gTax.taxType = document.getElementById('id.taxTypeValue').value;
                    gTax.methodSend = gprsResp.respJsonObj.methodSend;
                    gTax.taxTypeView = gTax.taxType + ' - ' + document.getElementById('id.taxType').value
                    gTax.idtxn ='B11';
                    navCachedPages["payment_service/create/tax/pay_tax_create_domestic"] = null;
                    navController.pushToView("payment_service/create/tax/pay_tax_create_domestic", true, 'html');
                    //genReviewScreen(gTax.domesticData, gTax.treasuryData);
                }
            } else if (gprsResp.respCode == RESP.get('COM_VALIDATE_FAIL')
                && gprsResp.responseType == CONSTANTS.get('CMD_CO_SETUP_CHANGE_PASSWORD')) {
                showAlertText(gprsResp.respContent);
            } else {
                showAlertText(gprsResp.respContent);
                // var tmpPageName = navController.getDefaultPage();
                // var tmpPageType = navController.getDefaultPageType();
                // navController.initWithRootView(tmpPageName, true, tmpPageType);
            }
        }

        function requestResultServiceFail(e) {
            // var tmpPageName = navController.getDefaultPage();
            // var tmpPageType = navController.getDefaultPageType();
            // navController.initWithRootView(tmpPageName, true, tmpPageType);
        }

        // Show loai thue end
        $scope.ShowDefaultTaxType = function () {
            document.getElementById('tr.taxInfoOrg').style.display = "none";
            document.getElementById('tr.taxNumberBrief').style.display = "none";
            document.getElementById('tr.taxSingnal').style.display = "none";
            document.getElementById('tr.taxNumFiles').style.display = "none";
            document.getElementById('tr.taxOrgCode').style.display = "none";
            document.getElementById('tr.taxOrgYear').style.display = "none";

            document.getElementById('id.taxNumberBrief').value = "";
            document.getElementById('id.taxSingnal').value = "";
            document.getElementById('id.taxNumFiles').value = "";
            document.getElementById('id.taxOrgCode').value = "";
            document.getElementById('id.taxOrgYear').value = "";
        }

        //Gui thong tin truy van toi Hai Quan

            $scope.sendRequestToCustomer = function () {
                //gui thong tin truy van den phi, le phi cua cac bo nganh
                var taxType = document.getElementById('id.taxTypeValue').value;
                if (taxType == '06') {
                    sendRequestCheckTaxOri();
                } else if (taxType == '05') {
                    var msgValidate = new Array();

                    // Check so du kha dung
                    if (gTax.soDuKhaDung <= 0) {
                        msgValidate.push(CONST_STR.get('CORP_MSG_TRANS_BATCH_BALANCE_NOT_ENOUGH'));
                    }

                    // Check tai khoan chuyen
                    if (document.getElementById('id.accountno').value == ''
                        || document.getElementById('id.accountno').value == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
                        msgValidate.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                            [CONST_STR.get('TRANS_PERIODIC_SOURCE_ACC_NO')]));
                    }

                    // Check loai thue
                    if (document.getElementById('id.taxType').value == ''
                        || document.getElementById('id.taxType').value == CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC')) {
                        msgValidate.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                            [CONST_STR.get('COM_TAX_TYPE')]));
                    }

                    // Check ma so thue
                    if (document.getElementById('trans.taxNum').value == ''
                        || document.getElementById('trans.taxNum').value == CONST_STR.get('COM_TXT_INPUT_PLACEHOLDER')) {
                        msgValidate.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                            [CONST_STR.get('COM_TAX_NUMBER')]));
                    }

                    if (msgValidate.length > 0) {
                        showAlertText(msgValidate[0]);
                    } else {
                        var argsArray = [];
                        argsArray.push("2");
                        argsArray.push(JSON.stringify({
                            idtxn: "B11",
                            taxCode: document.getElementById('trans.taxNum').value,
                            taxType: document.getElementById('id.taxTypeValue').value,
                            declar: document.getElementById('id.taxNumDeclar').value,
                            yearDeclar: document.getElementById('id.taxYearDeclar').value
                        }));

                        var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_PAY_TAX_ORGANIZATION"), "", "", gUserInfo.lang, gUserInfo.sessionID, argsArray);
                        data = getDataFromGprsCmd(gprsCmd);
                        requestMBServiceCorp.post(data, true, requestResultServiceSuccess, requestResultServiceFail);
                    }
                }
                else {

                    var msgValidate = new Array();

                    // Check so du kha dung
                    if (gTax.soDuKhaDung <= 0) {
                        msgValidate.push(CONST_STR.get('CORP_MSG_TRANS_BATCH_BALANCE_NOT_ENOUGH'));
                    }

                    // Check tai khoan chuyen
                    if (document.getElementById('id.accountno').value == ''
                        || document.getElementById('id.accountno').value == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
                        msgValidate.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                            [CONST_STR.get('TRANS_PERIODIC_SOURCE_ACC_NO')]));
                    }

                    // Check loai thue
                    if (document.getElementById('id.taxType').value == ''
                        || document.getElementById('id.taxType').value == CONST_STR.get('TRANS_PERIODIC_BTN_SELECT_FUNC')) {
                        msgValidate.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                            [CONST_STR.get('COM_TAX_TYPE')]));
                    }

                    // Check ma so thue
                    if (document.getElementById('trans.taxNum').value == ''
                        || document.getElementById('trans.taxNum').value == CONST_STR.get('COM_TXT_INPUT_PLACEHOLDER')) {
                        msgValidate.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                            [CONST_STR.get('COM_TAX_NUMBER')]));
                    }

                    if (msgValidate.length > 0) {
                        showAlertText(msgValidate[0]);
                    } else {
                        var argsArray = [];
                        argsArray.push("2");
                        argsArray.push(JSON.stringify({
                            idtxn: "B11",
                            taxCode: document.getElementById('trans.taxNum').value,
                            taxType: document.getElementById('id.taxTypeValue').value,
                            declar: document.getElementById('id.taxNumDeclar').value,
                            yearDeclar: document.getElementById('id.taxYearDeclar').value
                        }));

                        var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_PAY_TAX_PROCESSOR"), "", "", gUserInfo.lang, gUserInfo.sessionID, argsArray);
                        data = getDataFromGprsCmd(gprsCmd);
                        requestMBServiceCorp.post(data, true, requestResultServiceSuccess, requestResultServiceFail);
                    }
                }
            }


        function sendRequestCheckTaxOri() {
            var msgValidate = new Array();

            // Check so du kha dung
            if (gTax.soDuKhaDung <= 0) {
                msgValidate.push(CONST_STR.get('CORP_MSG_TRANS_BATCH_BALANCE_NOT_ENOUGH'));
            }

            // Check tai khoan chuyen
            if (document.getElementById('id.accountno').value == ''
                || document.getElementById('id.accountno').value == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
                msgValidate.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('TRANS_PERIODIC_SOURCE_ACC_NO')]));
            }

            // check so ho so
            if (document.getElementById('id.taxNumberBrief').value == ''
                || document.getElementById('id.taxNumberBrief').value == CONST_STR.get('COM_TXT_INPUT_PLACEHOLDER')) {
                msgValidate.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('K_TAX_TAX_NUMBER')]));
            }

            // check ky hieu chung tu
            if (document.getElementById('id.taxSingnal').value == ''
                || document.getElementById('id.taxSingnal').value == CONST_STR.get('COM_TXT_INPUT_PLACEHOLDER')) {
                msgValidate.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('K_TAX_SIGNAL_FILE')]));
            }

            // check so chung tu
            if (document.getElementById('id.taxNumFiles').value == ''
                || document.getElementById('id.taxNumFiles').value == CONST_STR.get('COM_TXT_INPUT_PLACEHOLDER')) {
                msgValidate.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('K_TAX_NUMBER_FILE')]));
            }

            // check ma don vi quan ly
            //if (document.getElementById('id.taxOrgCode').value == ''
            //    || document.getElementById('id.taxOrgCode').value == CONST_STR.get('TRANS_TAX_INPUT_OR_EMPTY')) {
            //    msgValidate.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
            //            [CONST_STR.get('K_TAX_ORGANIZATION_CODE')]));
            // }

            ////check nam chung tu
            //if (document.getElementById('id.taxOrgYear').value == ''
            //    || document.getElementById('id.taxOrgYear').value == CONST_STR.get('TRANS_TAX_INPUT_OR_EMPTY')) {
            //    msgValidate.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
            //            [CONST_STR.get('K_TAX_ORGANIZATION_YEAR')]));
            // }

            if (msgValidate.length > 0) {
                showAlertText(msgValidate[0]);
            } else {
                var argsArray = [];
                argsArray.push("2");
                argsArray.push(JSON.stringify({
                    idtxn: "B11",
                    taxCode: document.getElementById('trans.taxNum').value,
                    taxType: document.getElementById('id.taxTypeValue').value,
                    declar: document.getElementById('id.taxNumDeclar').value,
                    yearDeclar: document.getElementById('id.taxYearDeclar').value,
                    taxNumberBrief: document.getElementById('id.taxNumberBrief').value,
                    taxSingnal: document.getElementById('id.taxSingnal').value,
                    taxNumFiles: document.getElementById('id.taxNumFiles').value,
                    taxOrgCode: document.getElementById('id.taxOrgCode').value,
                    taxOrgYear: document.getElementById('id.taxOrgYear').value
                }));

                var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_PAY_TAX_ORGANIZATION"), "", "", gUserInfo.lang, gUserInfo.sessionID, argsArray);
                data = getDataFromGprsCmd(gprsCmd);
                requestMBServiceCorp.post(data, true, requestResultServiceSuccess, requestResultServiceFail);
            }
        }


//        if (!gTax.isBack) {
            var args = ["6", {
                idtxn: "B11"
            }];
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_PAY_TAX_PROCESSOR"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (responseText) {
                var response = responseText;
                if (response.respCode == RESP.get("COM_SUCCESS")) {
                    for (var i = 0; i < response.respJsonObj.listAccount.length; i++) {
                        var tmpObj = response.respJsonObj.listAccount[i];
                        gTax.accountNumbers.push(tmpObj.account);
                        gTax.accountBalances.push(tmpObj.balance);
                        gTrans.listSourceAccounts =response.respJsonObj.listAccount;
						gTrans.sourceAcc = gTrans.listSourceAccounts[0];
                        $scope.initComboTextAccount(0);
                    }
                }
            });
        //Mãu thụ hưởng
        $scope.initBottomBar = function (){
            var arrBottom = new Array();
            arrBottom.push(new MenuBottom("BOTTOM_BAR_TEMPLATE_PAY_TAX", "icon-template"));
            transferParam = new TransferParam(CONSTANTS.get("CMD_TRANSFER_TEMPLATE_TEMPLATE"),'',0);
            navController.initBottomBarWithCallBack("payment_service/create/tax/pay_tax_create", arrBottom, "pay_tax_create", function () {
                // template mau chuyen tien
                    document.addEventListener('evtChangeWidthMobile',temptranferlocalbank,false);
                    document.addEventListener('evtChangeWidthDesktop',temptranferlocalbank,false);
                    // initDialog(CONST_STR.get('BOTTOM_BAR_TEMPLATE_TRANSFER'),"","transfer/template-transfer/template-transfer-doc",
                    gTax.chooseTax = document.getElementById('id.taxTypeValue').value;
                    initDialog(CONST_STR.get('BOTTOM_BAR_TEMPLATE_TRANSFER'),"","payment_service/create/tax/pay_tax_create_teamplate",
                        function callbackDialogClose(){
                            callbackCloseDialogSchedulerTransfer();
                            document.addEventListener('evtChangeWidthMobile',temptranferlocalbank,false);
                            document.addEventListener('evtChangeWidthDesktop',temptranferlocalbank,false);
                        },
                        function callbackDialogLoadSuccess(){

                            modalDialog.showDialogFull();
                            actionbar.hideActionbar();
                            bottomBar.hide();
                        },true,callbackDocTranfer);
                // $scope.getTemplateTax();
            });
            //
            gHisTypeTranfer = 17;
        }
        
    $scope.initBottomBar();
    $scope.ShowDefaultTaxType();
//        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}


function taxYearDeclarNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}
function btnFinClick () {
    document.getElementById('trans.taxNum').value = document.getElementById("id.inputAcc").value;
    document.getElementById("selection-dialog").style.display = "none";
}
function dataFilter () {
    var dataFilter = document.getElementById("id.inputAcc").value;
    var dataDisplay = document.getElementsByName("dataDisplay");
    var checkDataFound = false;

    for (var i = 0; i < dataDisplay.length; i++) {
        if (dataDisplay[i].childNodes[0].nodeValue.indexOf(dataFilter) == -1) {
            dataDisplay[i].style.display = "none";
        } else {
            dataDisplay[i].style.display = "block";
            checkDataFound = true;
        }
    }

    if (checkDataFound == true) {
        document.getElementById("noDataFound").style.display = "none";
    } else {
        document.getElementById("noDataFound").style.display = "block";
    }
}
function genListParentPage(idDivList, respArr, parserService, fieldsRow, fieldsHidden, button, doubleClickItem){
    if(gModeScreenView == CONST_MODE_SCR_SMALL){
        // listAccount();
        genScreen(idDivList,respArr, parserService,
            fieldsRow,
            fieldsHidden,
            button,
            doubleClickItem
        );
        // funcUpdateStyleAccount();
    }else{
        // listAccountDesktop();
        genScreenDesktop(respArr);
    }
}
function temptranferlocalbank(){
    var objtemp = {};
    objtemp['ten_nguoi_dung']= document.getElementById('nameuser').innerHTML;
    objtemp['ma_so_thue'] = document.getElementById('masothue').innerHTML;
    objtemp['so_to_khai'] = document.getElementById('sotokhai').innerHTML;
    objtemp['nam_dang_ky'] = document.getElementById('namdangky').innerHTML;
    objtemp['so_ho_so'] = document.getElementById('sohoso').innerHTML;
    objtemp['ky_hieu_chung_tu'] = document.getElementById('kyhieuchungtu').innerHTML;
    objtemp['so_chung_tu'] = document.getElementById('sochungtu').innerHTML;
    objtemp['ma_don_vi_quan_ly'] = document.getElementById('madonviql').innerHTML;
    objtemp['nam_chung_tu'] = document.getElementById('namchungtu').innerHTML;
    callbackDocTranfer(objtemp);
}
function callbackDocTranfer(obj) {
    console.log(obj);
    modalDialog.hideDialogFull();

    callbackCloseDialogSchedulerTransfer();
    // double click template tranfer doc

    excuteSampleSelected(obj);
}
function callbackCloseDialogSchedulerTransfer(param,clickfromtop){
    console.log(param + " " + clickfromtop);
    bottomBar.resumeView('payment_service/create/tax/pay_tax_create','pay_tax_create');
    actionbar.showActionBar();
    bottomBar.show();
    document.removeEventListener('evtChangeWidthMobile',temptranferlocalbank,false);
    document.removeEventListener('evtChangeWidthDesktop',temptranferlocalbank,false);
}
function excuteSampleSelected(obj){
    if (currentPage == 'payment_service/create/tax/pay_tax_create'){
        var newBalance = 0;
        if(obj != null && obj != undefined){
            for (var i in gTrans.listSourceAccounts){
                if (obj.tai_khoan_nguon == gTrans.listSourceAccounts[i].account){
                    newBalance = gTrans.listSourceAccounts[i].balance;
                    break;
                }
            }
            comboEl.refresh({
//        accountName : obj.name,
                accountNumber :obj.ten_nguoi_dung,
                accountBalance :  formatNumberToCurrency(newBalance)
            });

            if(gTax.chooseTax == '01'){
                document.getElementById("trans.taxNum").value = obj.ma_so_thue;
            }else if(gTax.chooseTax == '02'){
                document.getElementById("trans.taxNum").value = obj.ma_so_thue;
                document.getElementById("id.taxNumDeclar").value = obj.so_to_khai;
                document.getElementById("id.taxYearDeclar").value = obj.nam_dang_ky;
            }else if(gTax.chooseTax == '05'){
                document.getElementById("trans.taxNum").value = obj.ma_so_thue;
                document.getElementById("id.taxNumDeclar").value = obj.so_to_khai;
                document.getElementById("id.taxYearDeclar").value = obj.nam_dang_ky;
            }else if(gTax.chooseTax == '06'){
                document.getElementById("id.taxNumberBrief").value = obj.so_ho_so;
                document.getElementById("id.taxSingnal").value = obj.ky_hieu_chung_tu;
                document.getElementById("id.taxNumFiles").value = obj.so_chung_tu;
                document.getElementById("id.taxOrgCode").value = obj.ma_don_vi_quan_ly;
                document.getElementById("id.taxOrgYear").value = obj.nam_chung_tu;
            }
        }
    }
}