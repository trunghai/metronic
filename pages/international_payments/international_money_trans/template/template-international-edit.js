/**
 * Created by HaiDT1 on 3/10/2017.
 */


gInternational.isBack = false;
gInternational.idtxn = 'B15';
gInternational.infoBene = {};
flag = 0;

function viewBackFromOther() {
    gInternational.isBack = true;
}

function viewDidLoadSuccess() {
    init();
}

function init() {
    angular.module('EbankApp').controller('template-international-edit', function ($scope, requestMBServiceCorp) {

        $scope.transNHTG = false;
        $scope.transAdderssNHTG = false;
        $scope.transSwiftCodeNHTG = false;
        $scope.managerben = true;
        $scope.dsThuHuong = CONST_STR.get('TRANSFER_DS_THUHUONG');
        $scope.mauThuHuong = CONST_STR.get('TRANSFER_MAU_THUHUONG');
        $scope.listbene = [];
        if (!gInternational.isBack){
            init();
        }else {
            if(gInternational.templateBenEdit.BENEFICIARYBANKMETHOD == 'CS01'){
                $scope.transSwiftCode = true;
                $scope.transAdderss = false;
            }else if (gInternational.templateBenEdit.BENEFICIARYBANKMETHOD == 'CS02'){
                $scope.transSwiftCode = false;
                $scope.transAdderss = true;
            }

            if(gInternational.templateBenEdit.METHOD === 'IBY'){
                $scope.transNHTG = true;
                if(gInternational.templateBenEdit.BANKMETHOD === 'CSTG01'){
                    $scope.transSwiftCodeNHTG = true;
                    $scope.transAdderssNHTG = false;
                }else {
                    $scope.transAdderssNHTG = true;
                    $scope.transSwiftCodeNHTG = false;
                }

            }else {
                $scope.transNHTG = false;
            }
        }


        function init() {


            if(gInternational.templateBenEdit.BENEFICIARYBANKMETHOD == 'CS01'){
                $scope.transSwiftCode = true;
                $scope.transAdderss = false;
            }else if (gInternational.templateBenEdit.BENEFICIARYBANKMETHOD == 'CS02'){
                $scope.transSwiftCode = false;
                $scope.transAdderss = true;
            }

            if(gInternational.templateBenEdit.METHOD === 'IBY'){
                $scope.transNHTG = true;
                if(gInternational.templateBenEdit.BANKMETHOD === 'CSTG01'){
                    $scope.transSwiftCodeNHTG = true;
                    $scope.transAdderssNHTG = false;
                }else {
                    $scope.transAdderssNHTG = true;
                    $scope.transSwiftCodeNHTG = false;
                }

            }else {
                $scope.transNHTG = false;
            }


            document.getElementById('id.value.tempName').innerHTML = gInternational.templateBenEdit.name;

            document.getElementById('id.international.transtype').value = CONST_STR.get('INTERNATIONAL_TRANS_TYPE_' + gInternational.templateBenEdit.TRANSACTIONTYPE);
            document.getElementById('id.international.transtype.value').value = gInternational.templateBenEdit.TRANSACTIONTYPE;

            document.getElementById('id.international.purpose').innerHTML = CONST_STR.get('INTERNATIONAL_PURPOSE_TYPE_' + gInternational.templateBenEdit.PURPOSE);
            document.getElementById('id.international.purpose.value').value = gInternational.templateBenEdit.PURPOSE;

            document.getElementById('id.international.content').value = gInternational.templateBenEdit.CONTENT;

            document.getElementById('id.international.name.offeror').value = gInternational.templateBenEdit.CUSTOMER_NAME1;
            document.getElementById('id.international.address.offeror').innerHTML = gInternational.templateBenEdit.ADDRESS;

            document.getElementById('id.international.name.ben').value = gInternational.templateBenEdit.BENEFICIARYNAME;
            document.getElementById('id.international.address.ben').value = gInternational.templateBenEdit.BENEFICIARYADDRESS;
            document.getElementById('id.international.nation.ben').value = gInternational.templateBenEdit.BENEFICIARYCOUNTRIESNAME;
            document.getElementById('id.international.nation.ben.value').value = gInternational.templateBenEdit.BENEFICIARYCOUNTRIES;
            document.getElementById('id.international.account.ben').value = gInternational.templateBenEdit.BENEFICIARYACCOUNT;

            document.getElementById('id.international.trans.method').value = CONST_STR.get('INTERNATIONAL_TRANS_METHOD_' + gInternational.templateBenEdit.BENEFICIARYBANKMETHOD);
            document.getElementById('id.international.trans.method.value').value = gInternational.templateBenEdit.BENEFICIARYBANKMETHOD;
            document.getElementById('id.international.swift.code').value = gInternational.templateBenEdit.BENEFICIARYSWIFTCODE;
            document.getElementById('id.international.ben.bank.name').value = gInternational.templateBenEdit.BENEFICIARYBANK;
            document.getElementById('id.international.ben.bank.address').value = gInternational.templateBenEdit.BENEFICIARYBANKADDRESS;
            document.getElementById('id.international.nation.bank.ben').value = gInternational.templateBenEdit.BENEFICIARYBANKCOUNTRIESNAME;
            document.getElementById('id.international.nation.bank.ben.value').value = gInternational.templateBenEdit.BENEFICIARYBANKCOUNTRIES;

            document.getElementById('id.international.intermediary.bank').value = CONST_STR.get('INTERNATIONAL_INTERMEDIARY_BANK_' + gInternational.templateBenEdit.METHOD);
            document.getElementById('id.international.intermediary.bank.value').value = gInternational.templateBenEdit.METHOD;

            document.getElementById('id.international.trans.method.NHTG').value = CONST_STR.get('INTERNATIONAL_TRANS_METHOD_NHTG_' + gInternational.templateBenEdit.BANKMETHOD);
            document.getElementById('id.international.trans.method.value.NHTG').value = gInternational.templateBenEdit.BANKMETHOD;

            document.getElementById('id.international.swift.code.NHTG').value = gInternational.templateBenEdit.BANKSWIFTCODE;
            document.getElementById('id.international.name.NHTG').value = gInternational.templateBenEdit.BANKNAME;
            document.getElementById('id.international.address.NHTG').value = gInternational.templateBenEdit.BANKADDRESS;
            document.getElementById('id.international.nation.NHTG').value = gInternational.templateBenEdit.BANKCOUNTRIESNAME;
            document.getElementById('id.international.nation.value.NHTG').value = gInternational.templateBenEdit.BANKCOUNTRIES;

        }

        //Add event when click selection combobox
        var addEventListenerToCombobox = function (selectHandle, closeHandle) {
            document.addEventListener("evtSelectionDialog", selectHandle, true);
            document.addEventListener("evtSelectionDialogClose", closeHandle, true);
        };

        //Remove event then close selection combobox
        var removeEventListenerToCombobox = function (selectHandle, closeHandle) {
            document.removeEventListener("evtSelectionDialog", selectHandle, true);
            document.removeEventListener("evtSelectionDialogClose", closeHandle, true);
        };

        //Action when close list source account combobox
        //Action when close list source account combobox
        var handleSelectionDialogListClose = function (e) {
            document.removeEventListener("evtSelectionDialog", handleSelectionDialogtList, false);
            document.removeEventListener("evtSelectionDialogClose", handleSelectionDialogListClose, false);
        };

        var handleSelectionDialogtList = function (e) {
            switch (flag){
                case 0:
                    document.getElementById('id.international.transtype').value = e.selectedValue1;
                    document.getElementById('id.international.transtype.value').value = e.selectedValue2;

                    /*document.getElementById('id.international.purpose').style.height = "30px";*/
                    document.getElementById('id.international.purpose').innerHTML = CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER');
                    document.getElementById('id.international.purpose.value').value = "";
                    break;
                case 1:

                    // if (e.selectedValue1.length > 60){
                    //     document.getElementById('id.international.purpose').style.height = "45px";
                    //     refeshContentScroll();
                    // }
                    //
                    // if (e.selectedValue1.length > 120){
                    //     document.getElementById('id.international.purpose').style.height = "60px";
                    //     refeshContentScroll();
                    // }
                    document.getElementById('id.international.purpose').innerHTML = e.selectedValue1;
                    document.getElementById('id.international.purpose.value').value = e.selectedValue2;

                    break;
                case 2:
                    document.getElementById('id.international.nation.ben').value = e.selectedValue1;
                    document.getElementById('id.international.nation.ben.value').value = e.selectedValue2;
                    break;
                case 3:
                    document.getElementById('id.international.trans.method').value = e.selectedValue1;
                    document.getElementById('id.international.trans.method.value').value = e.selectedValue2;

                    if(e.selectedValue2 === 'CS01'){
                        $scope.transSwiftCode = true;
                        $scope.transAdderss = false;
                    }else if (e.selectedValue2 === 'CS02'){
                        $scope.transSwiftCode = false;
                        $scope.transAdderss = true;
                    }
                    $scope.$apply();
                    break;
                case 4:
                    if(e.selectedValue2 === 'IBY'){
                        $scope.transNHTG = true;
                    }else {
                        $scope.transNHTG = false;
                    }
                    $scope.$apply();
                    document.getElementById('id.international.intermediary.bank').value = e.selectedValue1;
                    document.getElementById('id.international.intermediary.bank.value').value = e.selectedValue2;

                    break;
                case 5:
                    if(e.selectedValue2 === 'CSTG01'){
                        $scope.transSwiftCodeNHTG = true;
                        $scope.transAdderssNHTG = false;
                    }else {
                        $scope.transAdderssNHTG = true;
                        $scope.transSwiftCodeNHTG = false;
                    }
                    $scope.$apply();
                    document.getElementById('id.international.trans.method.NHTG').value = e.selectedValue1;
                    document.getElementById('id.international.trans.method.value.NHTG').value = e.selectedValue2;
                    break;
                case 6:
                    document.getElementById('id.international.manager.ben').value = e.selectedValue1;
                    document.getElementById('id.international.manager.ben.value').value = e.selectedValue2;
                    if (e.selectedValue2 === 'TP'){
                        $scope.managerben = true;
                    }else {
                        $scope.managerben = false;
                    }
                    $scope.$apply();
                    break;
                case 7:
                    document.getElementById('id.international.nation.bank.ben').value = e.selectedValue1;
                    document.getElementById('id.international.nation.bank.ben.value').value = e.selectedValue2;
                    break;
                case 8:
                    document.getElementById('id.international.nation.NHTG').value = e.selectedValue1;
                    document.getElementById('id.international.nation.value.NHTG').value = e.selectedValue2;
                    break;
            }
        }

        $scope.showInternationlTransType = function () {
            flag = 0;
            var cbxInternational = [];
            var cbxInternationalKey = [];
            if (gUserInfo.lang === 'VN') {
                cbxInternational = CONST_INTERNATIONAL_MONEY_TRANS_VN;
                cbxInternationalKey = CONST_INTERNATIONAL_MONEY_TRANS_KEY;
            } else {
                cbxInternational = CONST_INTERNATIONAL_MONEY_TRANS_EN;
                cbxInternationalKey = CONST_INTERNATIONAL_MONEY_TRANS_KEY;
            }
            addEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
            showDialogList(CONST_STR.get('INTERNATIONAL_TRANS_TYPE'), cbxInternational, cbxInternationalKey, false);
        }

        $scope.showInternationalPurpose = function () {
            flag = 1;
            var cbxInternational = [];
            var cbxInternationalKey = [];
            if (document.getElementById('id.international.transtype.value').value === 'IMT01'){
                if (gUserInfo.lang === 'VN') {
                    cbxInternational = CONST_INTERNATIONAL_PURPOSE_IMT01_VN;
                    cbxInternationalKey = CONST_INTERNATIONAL_PURPOSE_IMT01_KEY;
                } else {
                    cbxInternational = CONST_INTERNATIONAL_PURPOSE_IMT01_EN;
                    cbxInternationalKey = CONST_INTERNATIONAL_PURPOSE_IMT01_KEY;
                }
            }else if (document.getElementById('id.international.transtype.value').value === 'IMT02'){
                if (gUserInfo.lang === 'VN') {
                    cbxInternational = CONST_INTERNATIONAL_PURPOSE_IMT02_VN;
                    cbxInternationalKey = CONST_INTERNATIONAL_PURPOSE_IMT02_KEY;
                } else {
                    cbxInternational = CONST_INTERNATIONAL_PURPOSE_IMT02_EN;
                    cbxInternationalKey = CONST_INTERNATIONAL_PURPOSE_IMT02_KEY;
                }
            }
            addEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
            showDialogList(CONST_STR.get('INTERNATIONAL_PURPOSE_TRANS'), cbxInternational, cbxInternationalKey, false);
        }

        $scope.showInternationalNation = function () {
            flag = 2;
            gTrans.showInternationalNation = true;
            navController.pushToView("international_payments/international_money_trans/trans_dti_list_bank_international", true,'html');
            document.addEventListener("evtSelectionDialog", handleSelectionDialogtList, false);
            document.addEventListener("evtSelectedNation", handleInputNationBankBenSelect, false);
            document.addEventListener("evtSelectedNation", handleSelectionDialogListClose, false);
        }

        function handleInputNationBankBenSelect(e) {
            if (currentPage == 'international_payments/international_money_trans/template/template-international-edit'){
                document.removeEventListener("evtSelectedNation", handleInputNationBankBenSelect, false);
                if (flag == 2){
                    document.getElementById('id.international.nation.ben').value = e.COUNTRY_NAME;
                    document.getElementById('id.international.nation.ben.value').value = e.COUNTRY_CODE;
                }else if (flag == 7){
                    document.getElementById('id.international.nation.bank.ben').value = e.COUNTRY_NAME;
                    document.getElementById('id.international.nation.bank.ben.value').value = e.COUNTRY_CODE;
                }else if (flag == 8){
                    document.getElementById('id.international.nation.NHTG').value = e.COUNTRY_NAME;
                    document.getElementById('id.international.nation.value.NHTG').value = e.COUNTRY_CODE;
                }
            }


            // goBack = e.viewBack;
        }



        $scope.showInternationalTransMethod = function () {
            flag = 3;
            var cbxInternational = [];
            var cbxInternationalKey = [];
            if (gUserinfoBene.lang === 'VN') {
                cbxInternational = CONST_INTERNATIONAL_TRANS_METHOD_VN;
                cbxInternationalKey = CONST_INTERNATIONAL_TRANS_METHOD_KEY;
            } else {
                cbxInternational = CONST_INTERNATIONAL_TRANS_METHOD_EN;
                cbxInternationalKey = CONST_INTERNATIONAL_TRANS_METHOD_KEY;
            }
            addEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
            showDialogList(CONST_STR.get('INTERNATIONAL_TRANS_METHOD'), cbxInternational, cbxInternationalKey, false);
        }

        $scope.showInternationalMediaryBank = function(){
            flag = 4;
            var cbxInternational = [];
            var cbxInternationalKey = [];
            if (gUserinfoBene.lang === 'VN') {
                cbxInternational = CONST_INTERNATIONAL_INTERMEDIARY_BANK_VN;
                cbxInternationalKey = CONST_INTERNATIONAL_INTERMEDIARY_BANK_KEY;
            } else {
                cbxInternational = CONST_INTERNATIONAL_INTERMEDIARY_BANK_EN;
                cbxInternationalKey = CONST_INTERNATIONAL_INTERMEDIARY_BANK_KEY;
            }
            addEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
            showDialogList(CONST_STR.get('INTERNATIONAL_TRANS_METHOD'), cbxInternational, cbxInternationalKey, false);
        }

        $scope.showInternationalMediaryBankNHTG = function(){
            flag = 5;
            var cbxInternational = [];
            var cbxInternationalKey = [];
            if (gUserinfoBene.lang === 'VN') {
                cbxInternational = CONST_INTERNATIONAL_TRANS_METHOD_NHTG_VN;
                cbxInternationalKey = CONST_INTERNATIONAL_TRANS_METHOD_NHTG_KEY;
            } else {
                cbxInternational = CONST_INTERNATIONAL_TRANS_METHOD_NHTG_EN;
                cbxInternationalKey = CONST_INTERNATIONAL_TRANS_METHOD_NHTG_KEY;
            }
            addEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
            showDialogList(CONST_STR.get('INTERNATIONAL_TRANS_METHOD'), cbxInternational, cbxInternationalKey, false);
        }


        //Action when click select template control
        $scope.showInternationalInputMNG = function () {
            flag = 6;
            var cbxInternational = (gUserinfoBene.lang == 'EN')? CONST_INTERNATIONAL_TRANS_SAVE_SAMPLE_STATUS_EN : CONST_INTERNATIONAL_TRANS_SAVE_SAMPLE_STATUS_VN;
            var cbxInternationalKey = CONST_INTERNATIONAL_TRANS_SAVE_SAMPLE_STATUS_KEY;
            addEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), cbxInternational, cbxInternationalKey, false);
        }

        $scope.showInternationalNationBankBen = function () {
            flag = 7;
            gTrans.showInternationalNation = true;
            navController.pushToView("international_payments/international_money_trans/trans_dti_list_bank_international", true,'html');
            document.addEventListener("evtSelectionDialog", handleSelectionDialogtList, false);
            document.addEventListener("evtSelectedNation", handleInputNationBankBenSelect, false);
            document.addEventListener("evtSelectedNation", handleSelectionDialogListClose, false);
        }

        $scope.showInternationalNationBankNHTG = function () {
            flag = 8;
            gTrans.showInternationalNation = true;
            navController.pushToView("international_payments/international_money_trans/trans_dti_list_bank_international", true,'html');
            document.addEventListener("evtSelectionDialog", handleSelectionDialogtList, false);
            document.addEventListener("evtSelectedNation", handleInputNationBankBenSelect, false);
            document.addEventListener("evtSelectedNation", handleSelectionDialogListClose, false);
        }

        //Call when show dialog complete
        function callbackShowDialogSuccessed(node){
            gTrans.dialog.hiddenTab2();
            if (flag == 2 || flag == 7 || flag == 8){
                document.getElementById("titleTab1").innerHTML = CONST_STR.get('INTERNATIONAL_LIST_NATION');
            }
            // gTrans.dialog.addListData(function () {
            //
            // }, $scope.listbene, 'tab1');
        }

        //Action when selected a value in tabbox dialog
        function handleInputPayeeAccOpen(e) {
            handleInputPayeeAccClose();

            if (e.tabSelected == 'tab1') {
                var obj = e.dataObject;
                if (flag == 9){
                    for (var i in gInternational.list_bene){
                        if (obj.peopleName == gInternational.templateBenEdit.BENE_NAME){
                            if(gInternational.templateBenEdit.BENEFICIARYBANKMETHOD == 'CS01'){
                                $scope.transSwiftCode = true;
                                $scope.transAdderss = false;
                            }else if (gInternational.templateBenEdit.BENEFICIARYBANKMETHOD == 'CS02'){
                                $scope.transSwiftCode = false;
                                $scope.transAdderss = true;
                            }

                            if(gInternational.templateBenEdit.METHOD === 'IBY'){
                                $scope.transNHTG = true;
                                if(gInternational.templateBenEdit.BANKMETHOD === 'CSTG01'){
                                    $scope.transSwiftCodeNHTG = true;
                                    $scope.transAdderssNHTG = false;
                                }else {
                                    $scope.transAdderssNHTG = true;
                                    $scope.transSwiftCodeNHTG = false;
                                }

                            }else {
                                $scope.transNHTG = false;
                            }

                            document.getElementById('id.international.name.ben').value = gInternational.templateBenEdit.BENEFICIARYNAME;
                            document.getElementById('id.international.address.ben').value = gInternational.templateBenEdit.BENEFICIARYADDRESS;
                            document.getElementById('id.international.nation.ben').value = gInternational.templateBenEdit.BENEFICIARYCOUNTRIESNAME;
                            document.getElementById('id.international.nation.ben.value').value = gInternational.templateBenEdit.BENEFICIARYCOUNTRIES;
                            document.getElementById('id.international.account.ben').value = gInternational.templateBenEdit.BENEFICIARYACCOUNT;

                            document.getElementById('id.international.trans.method').value = CONST_STR.get('INTERNATIONAL_TRANS_METHOD_' + gInternational.templateBenEdit.BENEFICIARYBANKMETHOD);
                            document.getElementById('id.international.trans.method.value').value = gInternational.templateBenEdit.BENEFICIARYBANKMETHOD;
                            document.getElementById('id.international.swift.code').value = gInternational.templateBenEdit.BENEFICIARYSWIFTCODE;
                            document.getElementById('id.international.ben.bank.name').value = gInternational.templateBenEdit.BENEFICIARYBANK;
                            document.getElementById('id.international.ben.bank.address').value = gInternational.templateBenEdit.BENEFICIARYBANKADDRESS;
                            document.getElementById('id.international.nation.bank.ben').value = gInternational.templateBenEdit.BENEFICIARYBANKCOUNTRIESNAME;
                            document.getElementById('id.international.nation.bank.ben.value').value = gInternational.templateBenEdit.BENEFICIARYBANKCOUNTRIES;

                            document.getElementById('id.international.intermediary.bank').value = CONST_STR.get('INTERNATIONAL_INTERMEDIARY_BANK_' + gInternational.templateBenEdit.METHOD);
                            document.getElementById('id.international.intermediary.bank.value').value = gInternational.templateBenEdit.METHOD;

                            document.getElementById('id.international.trans.method.NHTG').value = CONST_STR.get('INTERNATIONAL_TRANS_METHOD_NHTG_' + gInternational.templateBenEdit.BANKMETHOD);
                            document.getElementById('id.international.trans.method.value.NHTG').value = gInternational.templateBenEdit.BANKMETHOD;

                            document.getElementById('id.international.swift.code.NHTG').value = gInternational.templateBenEdit.BANKSWIFTCODE;
                            document.getElementById('id.international.name.NHTG').value = gInternational.templateBenEdit.BANKNAME;
                            document.getElementById('id.international.address.NHTG').value = gInternational.templateBenEdit.BANKADDRESS;
                            document.getElementById('id.international.nation.NHTG').value = gInternational.templateBenEdit.BANKCOUNTRIESNAME;
                            document.getElementById('id.international.nation.value.NHTG').value = gInternational.templateBenEdit.BANKCOUNTRIES;




                            $scope.$apply();
                            refeshContentScroll();
                            break;
                        }
                    }
                }else if(flag == 2){
                    document.getElementById('id.international.nation.ben').value = obj.transValue;
                    document.getElementById('id.international.nation.ben.value').value = obj.peopleName;
                }else if(flag == 7){
                    document.getElementById('id.international.nation.bank.ben').value = obj.transValue;
                    document.getElementById('id.international.nation.bank.ben.value').value = obj.peopleName;
                }else if(flag == 8){
                    document.getElementById('id.international.nation.NHTG').value = obj.transValue;
                    document.getElementById('id.international.nation.value.NHTG').value = obj.peopleName;
                }

            }

        }

        //Action when close tabbox dialog
        function handleInputPayeeAccClose(e){
            document.removeEventListener("evtSelectionDialogClose", handleInputPayeeAccClose, false);
            document.removeEventListener("evtSelectionDialog", handleInputPayeeAccOpen, false);
            document.removeEventListener("tabChange", tabChanged, false);
            document.removeEventListener("onInputSelected", okSelected, false);
        }

        //Action when change tab in tabbox dialog
        function tabChanged(e){
            // var node = e.selectedValueTab;
            // gTrans.showDialogCorp = true;
            // if (node.id == 'tab1') {
            //
            // }
            // if (node.id == 'tab2'){
            //     gTrans.dialog.activeDataOnTab('tab2');
            //     gTrans.dialog.USERID = gCustomerNo;
            //     gTrans.dialog.PAYNENAME = "3";
            //     gTrans.dialog.TYPETEMPLATE = "1";
            //     gTrans.dialog.requestData(node.id);
            // }
        }

        //Action when finish input value in tabbox dialog
        function okSelected(e){
            handleInputPayeeAccClose();
            if ((e.selectedValue != undefined) &&(e.selectedValue != null) && (e.selectedValue.length>0)){
                document.getElementById("billing.input.text").value = e.selectedValue;
                //loadinfoBeneFromIdAccount();
            }
        }

        function validate() {
            if (gInternational.templateBenEdit.TRANSACTIONTYPE.length == '0' ){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('INTERNATIONAL_TRANS_TYPE')]));
                return false;
            }

            if (gInternational.templateBenEdit.PURPOSE.length == '0' ){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('INTERNATIONAL_PURPOSE_TRANS')]));
                return false;
            }



            if (gInternational.infoBene.nameBen.length == '0' ){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('INTERNATIONAL_NAME_BEN')]));
                return false;
            }

            if (gInternational.infoBene.addressBen.length == '0' ){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('INTERNATIONAL_ADDRESS_BEN')]));
                return;
            }

            if (gInternational.infoBene.nationBen.value.length == '0' ){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('INTERNATIONAL_NATION_BEN')]));
                return false;
            }

            if (gInternational.infoBene.accountBen.length == '0' ){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('INTERNATIONAL_ACCOUNT_BEN1')]));
                return false;
            }
            if (gInternational.infoBene.purpose == '' || gInternational.infoBene.purpose == null ){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('TRANS_TYPE')]));
                return false;
            }

            if (gInternational.infoBene.content.length == '0' ){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('INTERNATIONAL_CONTENT')]));
                return false;
            }

            if (gInternational.templateBenEdit.BENEFICIARYBANKMETHOD.length == '0' ){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('INTERNATIONAL_TRANS_METHOD')]));
                return false;
            }

            if (gInternational.templateBenEdit.BENEFICIARYBANKMETHOD == 'CS01'){
                if (gInternational.infoBene.beneficiaryBankSwitch.length == '0' ){
                    showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                        [CONST_STR.get('INTERNATIONAL_SWIFT_CODE_BANK_BEN')]));
                    return false;
                }
            }

            if (gInternational.templateBenEdit.BENEFICIARYBANKMETHOD == 'CS02'){
                if (gInternational.infoBene.beneficiaryBankAddress.length == '0' ){
                    showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                        [CONST_STR.get('INTERNATIONAL_ADRESS_BANK_BEN')]));
                    return false;
                }
            }

            if (gInternational.infoBene.beneficiaryBank.length == '0' ){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('INTERNATIONAL_THE_BEN_BANK_NAME')]));
                return false;
            }

            if (gInternational.infoBene.beneficiaryBankCountries.length == '0' ){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    CONST_STR.get('INTERNATIONAL_NAIION_BANK_BEN')));
                return false;
            }

            if (gInternational.templateBenEdit.METHOD == 'IBY'){
                if (gInternational.infoBene.bankName.length == '0' ){
                    showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                        [CONST_STR.get('INTERNATIONAL_INTERMEDIARY_BANK_NAME1')]));
                    return false;
                }

                if (gInternational.infoBene.bankCountries == ''){
                    showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                        [CONST_STR.get('INTERNATIONAL_NAIION_BANK_NHTG')]));
                    return false;
                }
            }

            if (gInternational.templateBenEdit.BANKMETHOD == 'CSTG01'){
                if (gInternational.infoBene.bankSwiftCode.length == '0'){
                    showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                        [CONST_STR.get('INTERNATIONAL_SWIFT_CODE_NHTG1')]));
                    return false;
                }
            }


            //Check do dai ky tu ten+dia chi
            var lengthOffer = document.getElementById('id.international.name.offeror').value.length + document.getElementById('id.international.address.offeror').innerHTML.length;
            if(parseFloat(lengthOffer) > 139){
                showAlertText(formatString(CONST_STR.get('INTERNATIONAL_LENGTH_ERROR'),
                    [CONST_STR.get('INTERNATIONAL_NAME_OFFEROR'), CONST_STR.get('INTERNATIONAL_ADDRESS_OFFEROR')]));
                return false;
            }


            var lengthBen = document.getElementById('id.international.name.ben').value.length + document.getElementById('id.international.address.ben').value.length;
            if(parseFloat(lengthBen) > 139){
                showAlertText(formatString(CONST_STR.get('INTERNATIONAL_LENGTH_ERROR'),
                    [CONST_STR.get('INTERNATIONAL_NAME_BEN'), CONST_STR.get('INTERNATIONAL_ADDRESS_BEN')]));
                return false;
            }

            if (gInternational.templateBenEdit.BENEFICIARYBANKMETHOD == 'CS02'){
                var lengthBankBen = document.getElementById('id.international.ben.bank.name').value.length + document.getElementById('id.international.ben.bank.address').value.length;
                if(parseFloat(lengthBankBen) > 139){
                    showAlertText(formatString(CONST_STR.get('INTERNATIONAL_LENGTH_ERROR'),
                        [CONST_STR.get('INTERNATIONAL_THE_BEN_BANK_NAME'), CONST_STR.get('INTERNATIONAL_ADRESS_BANK_BEN')]));
                    return false;
                }
            }

            if (gInternational.templateBenEdit.BANKMETHOD == 'CSTG02'){

                if (gInternational.infoBene.bankAddress.length == '0'){
                    showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                        [CONST_STR.get('INTERNATIONAL_INTERMEDIARY_BANK_ADDRESS')]));
                    return false;
                }

                var lengthBankBank = document.getElementById('id.international.name.NHTG').value.length + document.getElementById('id.international.address.NHTG').value.length;
                if(parseFloat(lengthBankBank) > 139){
                    showAlertText(formatString(CONST_STR.get('INTERNATIONAL_LENGTH_ERROR'),
                        [CONST_STR.get('INTERNATIONAL_INTERMEDIARY_BANK_NAME'), CONST_STR.get('INTERNATIONAL_INTERMEDIARY_BANK_ADDRESS')]));
                    return false;
                }
            }



            // if(gInternational.infoBene.managerBen.value == 'TP'){
            //     if (gInternational.infoBene.managerBenInputName.length == '0' ){
            //         showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
            //             [CONST_STR.get('INTERNATIONAL_INPUT_NO_SAMPLE')]));
            //         return false;
            //     }
            // }

            return true;
        }

        $scope.onCancelClick = function () {
            // navController.popView(true);
            // navCachedPages['corp/transfer/manage_template/manage_trans_temp'] = null;
            navController.popView(true);

        }

        $scope.onContinuteClick = function(){

            gInternational.infoBene.beneId = gInternational.templateBenEdit.BENEID;
            gInternational.infoBene.transType = document.getElementById('id.international.transtype.value').value;
            gInternational.infoBene.purpose = document.getElementById('id.international.purpose.value').value;
            gInternational.infoBene.beneficiaryName = document.getElementById('id.international.name.ben').value;
            gInternational.infoBene.beneficiaryAddress = document.getElementById('id.international.address.ben').value;
            gInternational.infoBene.beneficiaryAccount = document.getElementById('id.international.account.ben').value;

            gInternational.infoBene.nameBen = document.getElementById("id.international.name.ben").value;
            gInternational.infoBene.addressBen = document.getElementById("id.international.address.ben").value;
            gInternational.infoBene.nationBen = {};
            gInternational.infoBene.nationBen.name = document.getElementById('id.international.nation.ben').value;
            gInternational.infoBene.nationBen.value = document.getElementById('id.international.nation.ben.value').value;
            gInternational.infoBene.accountBen = document.getElementById('id.international.account.ben').value;
            gInternational.infoBene.content = document.getElementById('id.international.content').value;

            gInternational.infoBene.beneficiaryCountries = document.getElementById('id.international.nation.ben.value').value;
            gInternational.infoBene.beneficiarCountriesName = document.getElementById('id.international.nation.ben').value;
            gInternational.infoBene.beneficiaryBank = document.getElementById('id.international.ben.bank.name').value;
            gInternational.infoBene.beneficiaryBankAddress = document.getElementById('id.international.ben.bank.address').value;
            gInternational.infoBene.beneficiaryBankCountries = document.getElementById('id.international.nation.bank.ben.value').value;
            gInternational.infoBene.beneficiaryBankCountriesName = document.getElementById('id.international.nation.bank.ben').value;
            gInternational.infoBene.beneficiaryBankSwitch = document.getElementById('id.international.swift.code').value;


            gInternational.infoBene.bankSwiftCode = document.getElementById('id.international.swift.code.NHTG').value;

            gInternational.infoBene.bankName = document.getElementById('id.international.name.NHTG').value;
            gInternational.infoBene.bankAddress = document.getElementById('id.international.address.NHTG').value;
            gInternational.infoBene.bankCountries = document.getElementById('id.international.nation.value.NHTG').value;

            if (!$scope.transNHTG) {
                gInternational.infoBene.bankCountriesName = "";
            }else{
                gInternational.infoBene.bankCountriesName = document.getElementById('id.international.nation.NHTG').value;
            }

            if (!validate()) return;

            var data = {};
            var arrayArgs = new Array();
            var request = {
                idtxn: 'M01',
                sequenceId: 8,
                info_trans: gInternational.infoBene,
            };
            var jsonRequest = JSON.stringify(request);
            arrayArgs.push("1");
            arrayArgs.push(jsonRequest);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_MANAGE_TEMPLATE"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
            gprsCmd.raw = '';
            data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true,function (response){
                showAlertText(response.respContent);

            }, function (response) {
                var objResponse = response;
                showAlertText(objResponse.respContent);
            });

        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}

function controlInputText(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccent(field.value);
        for (var i = 0; field.value.length; i++){
            if (field.value.substr(0,1) == "-"){
                field.value = field.value.replace("-",'');
            }else {
                break;
            }
        }
        field.value = field.value.replace(/[\[\]\,!"#$%&*'\+\-:;<=>?\\`^~{|}]/g, '');
        field.value = field.value.toUpperCase();
    }
}

function removeChar(e, des, maxlen) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(des, maxlen);
    }

    var tmpVale = des.value;
    var numStr = keepOnlyNumber(tmpVale);
    des.value = numStr;
}

function removeCharAnd(field) {
    field.value = field.value.replace(/\band\b/gi,"");
    field.value = field.value.replace(/\bAND\b/gi,"");
    field.value = field.value.replace(/\bAnd\b/gi,"");
    field.value = field.value.replace(/\bANd\b/gi,"");
    field.value = field.value.replace(/\baND\b/gi,"");
    field.value = field.value.replace(/\bAnD\b/gi,"");
    field.value = field.value.replace(/\baNd\b/gi,"");
    field.value = field.value.replace(/\banD\b/gi,"");

}

function validateSwiftCode(des, bank) {
    // bank = 1 ngan hang thu huong
    // bank = 2 ngan hang trung gian
    var swiftcode = des.value;
    if (swiftcode.length == 8 || swiftcode.length == 11){

    }else {
        des.value = "";
        showAlertText(CONST_STR.get('INTERNATIONA_SWIFTCODE_ERROR'));
        return;
    }

    swiftcode = swiftcode.substring(4, 6);
    for (var i in gInternational.list_Nation){
        if (swiftcode == gInternational.list_Nation[i].COUNTRY_CODE){
            if(bank == 1){
                document.getElementById('id.international.nation.bank.ben').value = gInternational.list_Nation[i].COUNTRY_NAME;
                document.getElementById('id.international.nation.bank.ben.value').value = gInternational.list_Nation[i].COUNTRY_CODE;
            }else if (bank == 2){
                document.getElementById('id.international.nation.NHTG').value = gInternational.list_Nation[i].COUNTRY_NAME;
                document.getElementById('id.international.nation.value.NHTG').value = gInternational.list_Nation[i].COUNTRY_CODE;
            }
            break;
        }else if (swiftcode != gInternational.list_Nation[i].COUNTRY_CODE && i == gInternational.list_Nation.length - 1){
            des.value = "";
            showAlertText(CONST_STR.get('INTERNATIONA_SWIFTCODE_ERROR'));
            break;
        }
    }
}