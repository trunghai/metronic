/**
 * Created by GiangBM.FSOFT
 * Date: 12/20/2016
 */

var rslt = window.innerWidth;
var type;
var temp_type = "";
gTrans.redirect = 'transfer/identification/identification-trans-src';
var arrBank = new Array();
var mng;
var gDisabledLuuMau = false;
var lastClickSwitch;
gTrans.TXN_TYPE = 3;
gTrans.isBack = false;
gTrans.newlistContact='';
gTrans.flagEditTemplate =  0;
var tempIndex;
var comboEl;
//gTrans.transInfo.schedule  = false;
function loadInitXML() {
    return '';
}

var isMB;
var isStay;

function viewBackFromOther() {
    //Flag check
    gTrans.isBack = true;
    viewBack = true;
    var trans_amount = document.getElementById('trans.amount');
    var value = trans_amount.value;
    if(trans_amount.value != undefined){
        gTrans.transInfo.amountTrans = value;
    }
}

function viewWillUnload() {
}

function viewDidLoadSuccess() {
    if(!gTrans.isBack){
        gTrans.transInfo = {};
    }
    init();
    //genSequenceFormInterBank();
    if ((gTrans.viewBackDTI == undefined || !gTrans.viewBackDTI) && (gTrans.showBankSelection == undefined || !gTrans.showBankSelection)) {
        // khoi tao ac gia tri mac dinh cho cac control
        var tmp = {};
        if (gTrans.dti) {
            tmp = JSON.parse(JSON.stringify(gTrans.dti));
        }

        gTrans.dti = {
            idtxn: "T20"
        };

        gTrans.dti.citadCode = tmp.citadCode;
        gTrans.dti.feeId = "N";
    }
    setInputOnlyNumber('trans.phonenumber',CONST_STR.get("ERR_INPUT_ONLY_NUMBER"));
    setInputOnlyASCIILNH('trans.content', CONST_STR.get("ERR_INPUT_ONLY_ASCII_CHAR"));
	
}

function init(){
    angular.module('EbankApp').controller('identification-trans-src', function ($scope, requestMBServiceCorp) {
        document.getElementById('save-receiver').getElementsByTagName('input')[0].checked = true;
        initBottomBar();
        gTrans.idtxn = 'T20';
        viewBack = goBack;
        $scope.loadInitData = function () {
            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.templateId = "";


            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_TRANS_IDENTIFICATION"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true,
                function(data) {
                    var resp = data;
                    if (resp.respCode == 0) {
                        gTrans.sendMethod = resp.respJsonObj.sendMethod;
                        gTrans.listSourceAccounts = resp.respJsonObj.listSourceAccounts;
                        gTrans.limit = resp.respJsonObj.limit;
                        gTrans.sourceAcc = gTrans.listSourceAccounts[0];
                        if (!gTrans.isBack) {
                            $scope.initComboTextAccount(0);
                        }

						var MutiId = ["id.Method", "id.Method.mb"];
						for (i = 0; i < MutiId.length; i++) {
							var sendMethod = document.getElementById(MutiId[i]);
							sendMethod.innerHTML = CONST_STR.get("COM_NOTIFY_"+gTrans.sendMethod+"");
						}
                    }
                },
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                    gotoHomePage();
                }
            );
        }
        gTrans.idtxn = 'T20';
        $scope.initComboTextAccount = function (index){
            var accountName =  "";
            var accountNumber = "";
            var accountBalance = "";

            try{
                document.getElementById("holder-account-info").innerHTML = "";
                accountName = gUserInfo.accountName;
                accountNumber = gTrans.listSourceAccounts[index].account;
                accountBalance = formatNumberToCurrency(gTrans.listSourceAccounts[index].balance);
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
        $scope.initTextAreaMessage = function (){
            try{
                var txtArea = document.getElementById('trans.content');
                if(txtArea!==null){
                    return false;
                }
                document.getElementById("holder-transfer-message").innerHTML = "";
            }catch(e){}


            var textAreaEl = new TextArea({
                containerMargin : "0px",
                idTextArea : "trans.content",
                placeholder : CONST_STR.get("PLACEHOLDER_TRANSFER_CONTENT"),
                iconClass : "icon-content-note",
                lengthmax : "100",

                //borderColor : "rgba(255, 255, 255, 0.2)",
                //showBorderBottom : false,
                // showBorderTop : false,
                fontSizeIcon : "24px!important",
                validateInput : function(){
                    console.log("validate function");
                }
            });
            textAreaEl.show("holder-transfer-message");
        }

        //=================SHOW DIALOG Acc=======================//
        $scope.showAccountSelection =function () {
            var tmpArray1 = [];
            var tmpArray2 = [];
            for (var i in gTrans.listSourceAccounts){
                tmpArray1.push(gTrans.listSourceAccounts[i].account);
                tmpArray2.push(gTrans.listSourceAccounts[i].balance);
            }
            document.addEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, true);
        }

        function showAccountSelectionOpen(e) {
            if (currentPage == "transfer/identification/identification-trans-src") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    for (var i in gTrans.listSourceAccounts){
                        if (e.selectedValue1 == gTrans.listSourceAccounts[i].account){
                            gTrans.sourceAcc = gTrans.listSourceAccounts[i];
                            $scope.initComboTextAccount(i);
                        }
                    }

                    showAccountSelectionClose();
                }
            }
        }

        function showAccountSelectionClose() {
            resizeMainViewContent(currentPage);
            if (currentPage == "transfer/identification/identification-trans-src") {
                document.removeEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            }
        }

        //end show acc
        if(gTrans.isBack){
            $scope.amount = formatNumberToCurrency(gTrans.transInfo.amountTrans);
        }
        $scope.formatNumberToCurrency = function () {
            $scope.amount = formatNumberToCurrency($scope.amount);
        }
        //chon ngan hang
        $scope.showBankSelection =function(){
            gTrans.showBankSelection = true;
            navController.pushToView("transfer/domestic/trans-dti-list-bank", true,'html');
            document.addEventListener("evtSelectedBranch", handleInputBankBranch, false);
        }

        function handleInputBankBranch(e) {
            document.removeEventListener("evtSelectedBranch", handleInputBankBranch, false);
            gTrans.dti.bankCode = e.bankCode;
            gTrans.dti.citadCode = e.branchCode;
            var branch = document.getElementById('trans.branchName');
            branch.value = e.bankName + "-" + e.branchName;
            gTrans.dti.branchName = e.branchName;
            gTrans.dti.bankCityCode = e.bankCityCode;
            goBack = e.viewBack;
        }
//     end chon ngan hang

//        Phi dich vu
        $scope.showInputSelection = function(type){

            gTrans.dti.inputType = type;
            var listSelection = [];
            var listValue = [];
            var dialogTitle;
            var fshowAccout = false;

            if (type == 1) { // tai khoan chuyen
                var account;
                fshowAccout = true;
                for (var i = 0; i < gTrans.listSrcAccount.accountno.length; i++) {
                    if (gTrans.listSrcAccount.ghiNo[i] == "N") {
                        listSelection.push(gTrans.listSrcAccount.accountno[i]);
                        listValue.push(formatNumberToCurrency(gTrans.listSrcAccount.balance[i]));
                    }
                }
                dialogTitle = CONST_STR.get('TRANS_LOCAL_DIALOG_TITLE_ACC');

            } else if (type == 2) { // nguoi chiu phi
                listSelection = (gUserInfo.lang == 'EN') ? CONST_KEY_TRANS_FEE_TYPE_EN : CONST_KEY_TRANS_FEE_TYPE_VN;
                listValue = CONST_KEY_TRANS_FEE_TYPE_ID;
                dialogTitle = CONST_STR.get('TRANS_FEE_TYPE_DIALOG_TITLE');

            } else if (type == 3) { // luu nguoi thu huong
                listSelection = (gUserInfo.lang == 'EN') ? CONST_TRANS_DTI_PAYEE_EN : CONST_TRANS_DTI_PAYEE_VN;
                listValue = CONST_VAL_PAYEE;
                dialogTitle = CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT');
            }

            document.addEventListener("evtSelectionDialog", handleShowInput, false);
            document.addEventListener("evtSelectionDialogClose", handleShowInputClose, false);
            showDialogList(dialogTitle, listSelection, listValue, fshowAccout);

        }
        function handleShowInput(e) {
            if (currentPage == "transfer/identification/identification-trans-src") {
                document.removeEventListener("evtSelectionDialog", handleShowInput, false);
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    var inputObj;
                    if (gTrans.dti.inputType == 1) {
                        inputObj = document.getElementById("id.accountno");
                        gTrans.sourceAccDTI = e.selectedValue1;
                    } else if (gTrans.dti.inputType == 2) {
                        inputObj = document.getElementById("trans.fee");
                        gTrans.dti.feeType = e.selectedValue1;
                    } else if (gTrans.dti.inputType == 3) {
                        inputObj = document.getElementById("manage.bene");
                        gTrans.dti.beneValue = e.selectedValue1;
                    }
                    inputObj.value = e.selectedValue1;
                }
                if (e.selectedValue2 != undefined && (e.selectedValue2 != null)) {
                    if (gTrans.dti.inputType == 1) {
                        var nodeAccBal = document.getElementById("trans.sourceaccoutbalance");
                        nodeAccBal.innerHTML = "<div class='availblstyle'>" + CONST_STR.get('COM_TXT_ACC_BALANCE_TITLE') + ": " + e.selectedValue2 + " VND</div>";
                        gTrans.sourceAccBal = nodeAccBal.innerHTML;
                    } else {
                        if (gTrans.dti.inputType == 2) {
                            gTrans.dti.feeId = e.selectedValue2;
                        } else if (gTrans.dti.inputType == 3) {
                            gTrans.dti.manage = e.selectedValue2;
                            displayTempNameInput();
                        }
                    }
                }
            }
        }

        function handleShowInputClose(e) {
            if (currentPage == "transfer/identification/identification-trans-scr") {
                document.removeEventListener("evtSelectionDialogClose", handleShowInputClose, false);
                document.removeEventListener("evtSelectionDialog", handleShowInput, false);
            }
        }

//end phi dich vu

//        switch ON/OFF
        $scope.onChangeSwitchSubMenu = function (estr) {
            var e = document.getElementById(estr);
            var clickTime = new Date().getTime();
            if (lastClickSwitch && (clickTime - lastClickSwitch) < 100) {
                return true;
            }
            lastClickSwitch = clickTime;
            var idDiv = e.id;
            if(idDiv =="save-doc-temp-transfer" && gDisabledLuuMau && document.getElementById('save-doc-temp-transfer').className.indexOf('custom-switch-on') ==-1){
                return;
            }


            var inputNode = e.getElementsByTagName('input')[0];

            if(inputNode) {
                inputNode.checked = !inputNode.checked;
            }
            changeSwitchUI(e);

            if(e.id =="save-doc-temp-transfer" && inputNode.checked){
                document.getElementById("id.sample.name").value = "";
                document.getElementById("id.sample").style.display = "";
            }else if(e.id == "save-doc-temp-transfer" && !inputNode.checked){
                document.getElementById("id.sample").style.display = "none";
            }
        }
//       end switch on/off

        $scope.sendJSONRequest = function(){
            gTrans.transInfo.sourceAcc = gTrans.sourceAcc.account;
            gTrans.transInfo.idtxn = "T20";
            gTrans.transInfo.passport = document.getElementById("trans.identification").value;
            gTrans.transInfo.issuedate = document.getElementById("trans.issuedate").value;
            gTrans.transInfo.issueplace = document.getElementById("trans.issueplace").value;
            gTrans.transInfo.receiver = document.getElementById("trans.name").value.replace(/[!"#@$%&'\+:;*\(\)<=>?\\`^~{|}]/g, '');
            gTrans.transInfo.phonenumber = document.getElementById("trans.phonenumber").value;
            gTrans.transInfo.amountTrans = removeSpecialChar(document.getElementById("trans.amount").value);
            gTrans.transInfo.contentTrans = document.getElementById("trans.content").value.replace(/[!"#@$%&'\+:;*\(\)<=>?\\`^~{|}]/g, '');

            var checkLuuNguoiNhan  = document.getElementById('save-receiver').getElementsByTagName('input')[0];
            var checkLuuMauChuyenTien = document.getElementById('save-doc-temp-transfer').getElementsByTagName('input')[0];
            if(checkLuuMauChuyenTien.checked && checkLuuNguoiNhan.checked){
                mng = "TC";
                gTrans.transInfo.savePayee = (gUserInfo.lang == 'VN') ? CONST_KEY_PAYEE_VN[2] : CONST_KEY_PAYEE_EN[2];
            }else if(!checkLuuMauChuyenTien.checked && !checkLuuNguoiNhan.checked){
                mng = CONST_VAL_PAYEE[0];
                gTrans.transInfo.savePayee = (gUserInfo.lang == 'VN') ? CONST_KEY_PAYEE_VN[0] : CONST_KEY_PAYEE_EN[0];
            }else if(checkLuuMauChuyenTien.checked && !checkLuuNguoiNhan.checked){
                mng = CONST_VAL_PAYEE[2];
                gTrans.transInfo.savePayee = (gUserInfo.lang == 'VN') ? CONST_KEY_PAYEE_VN[2] : CONST_KEY_PAYEE_EN[2];
            }else if(!checkLuuMauChuyenTien.checked && checkLuuNguoiNhan.checked){
                mng = CONST_VAL_PAYEE[1];
                gTrans.transInfo.savePayee = (gUserInfo.lang == 'VN') ? CONST_KEY_PAYEE_VN[1] : CONST_KEY_PAYEE_EN[1];
            }
            gTrans.transInfo.issavepayee = mng;
            gTrans.transInfo.sampleName = document.getElementById("id.sample.name").value;

            gTrans.transInfo.dateMade = getDate('today');
            gTrans.transInfo.SENDMETHOD = getSendMethod(gTrans.sendMethod);
            gTrans.transInfo.desBranchCode = gTrans.dti.citadCode;
            gTrans.transInfo.idDesBank = gTrans.dti.bankCode;
            gTrans.transInfo.chargeincl = gTrans.dti.feeId;
            gTrans.transInfo.status = CONST_STR.get("COM_TRANS_STATUS_INT");


            //Validate
            if (!validate()) return;
            if(Number(gTrans.transInfo.amountTrans) > Number(gTrans.sourceAcc.balance.replace(/,/gi,""))){
               showAlertText(CONST_STR.get("IDENTIFICATION_AVAIL_BALANCE"));
                return;
            }
            var request = {};
            request.sequence_id = "3";
            request.idtxn = "T20";
            request.transInfo = gTrans.transInfo;

            var jsonRequest = JSON.stringify(request);

            var arrayArgs = [];
            arrayArgs.push(null);
            arrayArgs.push(request);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_TRANS_IDENTIFICATION"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true,function(response){

                    if (response.respCode == '0') {
                        var requestData = {
                            idtxn: 'T20',
                            sequence_id: 4,
                            transId: response.respJsonObj[0].MA_GD,
                            issavepayee: mng,
                            sampleName: gTrans.transInfo.sampleName
                        }
                        gTrans.requestData = requestData;

                        gTrans.transInfo.transname = CONST_STR.get('AUTHORIZE_TRANS_TIT_T20');
                        gTrans.transInfo.transId = response.respJsonObj[0].MA_GD;
                        gTrans.transInfo.createDate = response.respJsonObj[0].NGAY_LAP;
                        gTrans.transInfo.cmnd = document.getElementById("trans.identification").value;
                        gTrans.transInfo.noicap = document.getElementById("trans.issueplace").value;
                        gTrans.transInfo.ngaycap = document.getElementById("trans.issuedate").value;
                        gTrans.transInfo.tennguoinhan = document.getElementById("trans.name").value;
                        gTrans.transInfo.sdt = document.getElementById("trans.phonenumber").value;
                        gTrans.transInfo.nganhang = document.getElementById("trans.branchName").value;
                        gTrans.transInfo.phidv = response.respJsonObj[0].FEE;
                        gTrans.transInfo.sodu = gTrans.sourceAcc.balance.replace(/,/gi,"") - gTrans.transInfo.phidv - gTrans.transInfo.amountTrans;
                        gTrans.transInfo.phidvshow = formatNumberToCurrency(gTrans.transInfo.phidv);
                        gTrans.transInfo.nguoichiuphi = document.getElementById("trans.fee").value;

                        gTrans.cmdType =  CONSTANTS.get('CMD_CO_TRANS_IDENTIFICATION');
                        gTrans.src = "pages/transfer/identification/identification-trans-view.html";
                        gTrans.ortherSrc = "transfer/identification/identification-trans-src";
                        gTrans.transInfo.balance = gTrans.sourceAcc.balance;
                        navController.pushToView("common/common-review/transfer-review-scr", true, "html");

                    } else if (response.respCode == 38) {
                        showAlertText(CONST_STR.get("CORP_MSG_TRANS_BATCH_BALANCE_NOT_ENOUGH"));
                    } else if (response.respCode == 37) {
                        showAlertText(CONST_STR.get("CORP_MSG_FEE_GREATER_AMOUNT"));
                    } else {
                        showAlertText(response.respContent);
                    }
                },
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_INIT_TRANS'));
                }
            );

        }
        //Mãu thụ hưởng
        function initBottomBar (){
            var arrBottom = new Array();
            arrBottom.push(new MenuBottom("BOTTOM_BAR_TEMPLATE_TRANSFER", "icon-template"));
            arrBottom.push(new MenuBottom("BOTTOM_BAR_CONTACT", "icon-beneficiaries"));
            arrBottom.push(new MenuBottom("AUTO_BILLING_TAB_LIST", "icon-scheduled-transfers-list"));
            transferParam = new TransferParam(CONSTANTS.get("CMD_TRANSFER_TEMPLATE_TEMPLATE"),'',0);
            contactParam = new ContactParam(CONSTANTS.get("CMD_TYPE_LOOKUP_PAYEE"),CONST_PAYEE_LOCAL_TRANSFER,'TH',true);
            periodParam = new PeriodParam(CONSTANTS.get("CMD_TRANSFER_PERIODIC_MNG_TRANS"),CONST_VAL_PERIODIC_LOCAL[0]);

            navController.initBottomBarWithCallBack("transfer/identification/identification-trans-src", arrBottom, "transfer-identification", function (index) {

                switchAction(index);
            });
            // dung de phan biet mau chuyen tien, khi sua mau chuyen tien
            gEdit = 5;
            //
            gHisTypeTranfer = 17;
        }

        function switchAction(index){
            switch(index)
            {
                case "0":
                    // template mau chuyen tien
                    document.addEventListener('evtChangeWidthMobile',temptranferlocalbank,false);
                    document.addEventListener('evtChangeWidthDesktop',temptranferlocalbank,false);
                    initDialog(CONST_STR.get('BOTTOM_BAR_TEMPLATE_TRANSFER'),"","transfer/template-transfer/template-transfer-doc",
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
                    break;
                case "1":
                    // template danh ba
                    document.addEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
                    document.addEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
                    initDialog(CONST_STR.get('BOTTOM_BAR_CONTACT'),"","transfer/template-transfer/template-contact-doc",
                        function callbackDialogClose(){
                            callbackCloseDialogSchedulerTransfer();
                            document.removeEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
                            document.removeEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
                        },
                        function callbackDialogLoadSuccess(){
                            modalDialog.showDialogFull();
                            actionbar.hideActionbar();
                            bottomBar.hide();
                            firstLetterArray = [];
                            bgrColorArray = [];
                        },true,callbackContactTranfer);
                    break;
                case "2":
                    updateAccountListInfo();
                    navCachedPages['common/com_list_user_approve'] = null;
                    navController.pushToView("common/com_list_user_approve", true, 'html');
                    break;
                case "3":
                    // template
                    initDialog(CONST_STR.get('BOTTOM_BAR_SCHEDULE_TRANSFER'),"","transfer/period-trans-command",
                        function callbackDialogClose(){
                            callbackCloseDialogSchedulerTransfer();
                        },
                        function callbackDialogLoadSuccess(){
                            //callbackLoadSuccess
                            modalDialog.showDialogFull();
                            actionbar.hideActionbar();
                            bottomBar.hide();
                        },true);
                    break;
            }
        }

        $scope.initTextAreaMessage();
        if(!viewBack){
            $scope.loadInitData();
        }

        goBack = false;
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])

}

//Add event when click selection combobox
function addEventListenerToCombobox(selectHandle, closeHandle) {
    document.addEventListener("evtSelectionDialog", selectHandle, true);
    document.addEventListener("evtSelectionDialogClose", closeHandle, true);
}

//Remove event then close selection combobox
function removeEventListenerToCombobox(selectHandle, closeHandle) {
    document.removeEventListener("evtSelectionDialog", selectHandle, true);
    document.removeEventListener("evtSelectionDialogClose", closeHandle, true);
}

//Action click to change transaction type
function showTransTypeSelection() {
    var cbxText = (gUserInfo.lang == 'EN')? CONST_INTERNAL_TRANS_TYPE_EN: CONST_INTERNAL_TRANS_TYPE_VN;
    addEventListenerToCombobox(handleSelectTransType, handleCloseTransTypeCbx);
    showDialogList(CONST_STR.get('TRANS_PERIODIC_DIALOG_TITLE_ACCTYPE'), cbxText, CONST_INTERNAL_TRANS_TYPE_KEY, false);
}

//Action when select a transfer type
function handleSelectTransType(e) {

}

//Action when close transfer type combobox
function handleCloseTransTypeCbx() {
    removeEventListenerToCombobox(handleSelectTransType, handleCloseTransTypeCbx);
}

//Update view when transfer type is changed
function updateView() {
    if (gTrans.transType == "T12")
        displayT12Screen();
    else if (gTrans.transType == "T11")
        displayT11Screen();
    else
        gotoHomePage();
}

//Format currency and pronounce to Vietnamese
function handleInputAmount (e, des) {
    var trowConvert = document.getElementById('row_convert');
    formatCurrency(e, des);
    var numStr = convertNum2WordWithLang(removeSpecialChar(des.value), gUserInfo.lang);//Lay ra chuoi doc so tien
    if(numStr){
        var nodeNumTxt = document.getElementById("trans.amounttotext");
        nodeNumTxt.innerHTML = "<div class='txtmoneystyle'>" + numStr + "</div>";
        trowConvert.style.display = "";
    }else{
        trowConvert.style.display = 'none';
    }
}

//Action when click select template control
function showInputMNG() {
    type= "2";
    var cbxText = (gUserInfo.lang == 'EN')? CONST_INTERNAL_TRANS_SAVE_SAMPLE_STATUS_EN : CONST_INTERNAL_TRANS_SAVE_SAMPLE_STATUS_VN;
    var cbxValue = CONST_INTERNAL_TRANS_SAVE_SAMPLE_STATUS_KEY;
    addEventListenerToCombobox(handleInputMNG, handleInputMNGClose);
    showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), cbxText, cbxValue, false);
}

//Action when click selected template control type
function handleInputMNG(e) {
    handleInputMNGClose();
    if(type=="2"){
        document.getElementById('id.payee').value = e.selectedValue1;
        gTrans.saveSampleStatus = e.selectedValue2;

        if (gTrans.saveSampleStatus == "TP") {
            document.getElementById('id.sample').style.display = "";
        } else {
            document.getElementById('id.sample').style.display = "none";
        }
        if (mainContentScroll !== null)
            mainContentScroll.refresh();
    }
}

//Action when close template control combobox
function handleInputMNGClose() {
    removeEventListenerToCombobox(handleInputMNG, handleInputMNGClose);
}

//Validate
function validate() {
    var conditions = gConditions;
    
    //so tien rong
    if (!validateFunc(gTrans.transInfo.amountTrans, conditions["amount"])) {
        showAlertText(CONST_STR.get('ERR_INPUT_NO_AMOUNT'));
        return false;
    }

    // han mức chuyển tiền // so lan chuyen
    var amount = parseInt(removeSpecialChar(document.getElementById("trans.amount").value));
    if (parseInt(amount) > parseInt(gTrans.limit.limitTime)) {
        showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_LIMIT_EXCEEDED_TIME"), [formatNumberToCurrency(gTrans.limit.limitTime)]));
        return;
    }
	//so tien quy dinh trong 1 ngay
    if ((parseInt(amount) + parseInt(gTrans.limit.totalDay)) > parseInt(gTrans.limit.limitDay)) {
        showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_LIMIT_EXCEEDED_DAY"), [formatNumberToCurrency(gTrans.limit.limitDay)]));
        return;
    }

    //tai khoan chuyen rong
    if (!validateFunc(gTrans.transInfo.sourceAcc, conditions["account"])) {
        showAlertText(CONST_STR.get('ERR_INPUT_FORMAT_DES_ACC'));
        return false;
    }

    //passport rong
    if (gTrans.transInfo.passport.trim() == "") {
        showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
            [CONST_STR.get('IDENTIFICATION_NUMBER')]));
        return false;
    }

    //ngay cap rong
    if (gTrans.transInfo.issuedate.trim() == "") {
        showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
            [CONST_STR.get('IDENTIFICATION_TIME')]));
        return false;
    }

    if(!checkIssuedDat(gTrans.transInfo.issuedate.trim())){
        showAlertText(CONST_STR.get('IDENTIFICATION_ERR_ISSUEDDATE2'));
        return false;
    }

    //noi cap rong
    if (gTrans.transInfo.issueplace.trim() == "") {
        showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
            [CONST_STR.get('IDENTIFICATION_PLACE')]));
        return false;
    }

    //ten nguoi nhan rong
    if (gTrans.transInfo.receiver.trim() == "") {
        showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
            [CONST_STR.get('IDENTIFICATION_RECEIVER_NAME')]));
        return false;
    }

	//ngan hang nhan rong
	if (gTrans.transInfo.desBranchCode == "" || gTrans.transInfo.idDesBank == "" || 
		gTrans.transInfo.desBranchCode == undefined || gTrans.transInfo.idDesBank== undefined){
        showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
            [CONST_STR.get('IDENTIFICATION_REVIEW_DEST_BANK')]));
        return false;
    }

    /*if(document.getElementById("trans.targetaccountname").value.indexOf('&') >= 0)
     {
     showAlertText(CONST_STR.get('TRANS_ERR_SYMBOL_SPECIAL'));
     return;
     }*/


    // if (amount > 100000000) {
    //     showAlertText(CONST_STR.get("TRANSACTION_AMOUNT_EXCEEDS_LIMIT"));
    //     return;
    // };



    //so tien khong vuot qua so du
//	var balance = parseInt(removeSpecialChar(document.getElementById('trans.sourceaccoutbalance').innerHTML));
//	if (balance - parseInt(gTrans.transInfo.amountTrans) < 0) {
//		showAlertText(CONST_STR.get('TOPUP_EXCEED_AVAIL_BALANCE'));
//		return false;
//	}

    //noi dung rong
    if (!validateFunc(gTrans.transInfo.contentTrans, conditions["content"])) {
        showAlertText(CONST_STR.get('ERR_INPUT_NO_CONTENT'));
        return false;
    }

    //ten mau chuyen tien rong
//	if (!gTrans.transInfo.issavepayee || gTrans.transInfo.issavepayee == null || gTrans.transInfo.issavepayee == "") {
//		showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
//				[CONST_STR.get('TRANSFER_REMITTANCE_NAMED')]));
//		return false;
//	}
    if (gTrans.saveSampleStatus == "TP") {
        if (!validateFunc(gTrans.transInfo.sampleName, conditions["sample"])) {
            showAlertText(CONST_STR.get('ERR_INPUT_NO_SAMPLE'));
            return false;
        }
    }

    if (gTrans.transType == "T20") {
        //validate han muc
        if (parseInt(gTrans.transInfo.amountTrans) > parseInt(gTrans.limit.limitTime)) {
            showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_TIME'), [formatNumberToCurrency(gTrans.limit.limitTime)]));
            return false;
        }
        if ((parseInt(gTrans.limit.totalDay) + parseInt(gTrans.transInfo.amountTrans)) > parseInt(gTrans.limit.limitDay)) {
            showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_DAY'), [formatNumberToCurrency(gTrans.limit.limitDay)]));
            return false;
        }
    }

    return true;
}

function currenDate() {
    var d = new Date().getDate();
    var m = new  Date().getMonth() + 1;
    var y = new Date().getFullYear();

    return d + '/' + m + '/' + y;
}

function controlInputText(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccentinfo(field.value);
        field.value = field.value.replace(/[!"@#$%&*'\+:;<=>?\\`^~{|}]/g, '');
    }
}

function controlInputTextCMT(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccentinfo(field.value);
        field.value = field.value.replace(" ","");
        field.value = field.value.replace(/[!"@#$%&*'\+:;<=>?\\`^~{|}]/g, '');
    }
    var txtCMT = field.value; 
    var lengthCMT = txtCMT.length;
    field.value = txtCMT.substring(0,1) + txtCMT.substring(1, lengthCMT).replace(/[^0-9]/g,'');
}

function getDateTime () {
    now = new Date();
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
}


function getBalanceByAccNo(accNo) {
    for (var i = 0; i < gUserInfo.accountList.length; i++) {
        var account = gUserInfo.accountList[i];
        if (accNo == account.accountNumber) {
            return gUserInfo.accountList[i].balanceAvailable;
        }
    }
    return '0';
}


function checkIssuedDat(date){
    var cur_date = getDateTime().substring(0,10);
    if(cur_date.substring(6,10) > date.substring(6,10)){
        return true;
    } else if(cur_date.substring(6,10) < date.substring(6,10)){
        return false;
    }else if(cur_date.substring(3,5) > date.substring(3,5)){
        return true;
    }else if(cur_date.substring(3,5) < date.substring(3,5)){
        return false;
    }else if(cur_date.substring(0,2) >= date.substring(0,2)){
        return true;
    }else {
        return false;
    }
}

function removeChar (e, des) {
    var tmpVale = des.value;
    var numStr = keepOnlyNumber(tmpVale);
    des.value = numStr;
}
function issueDateFocus (event) {
    $(event).click();
}

//================= PROCESS DIALOG CONTACT TRANSFER ==================================//
function reInitContactTransfer() {
    initDialog(CONST_STR.get('BOTTOM_BAR_CONTACT'),"","transfer/template-transfer/template-contact-doc",
        function callbackDialogClose(){
            callbackCloseDialogSchedulerTransfer();
        },
        function callbackDialogLoadSuccess(){
            modalDialog.showDialogFull();
            actionbar.hideActionbar();
            bottomBar.hide();
            firstLetterArray = [];
            bgrColorArray = [];
        },true,callbackContactTranfer);
}

function callbackCloseDialogSchedulerTransfer(param,clickfromtop){
    console.log(param + " " + clickfromtop);
    bottomBar.resumeView('transfer/identification/identification-trans-scr','transfer-identification');
    actionbar.showActionBar();
    document.removeEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthMobile',temptranferlocalbank,false);
    document.removeEventListener('evtChangeWidthDesktop',temptranferlocalbank,false);
}

function temptranferlocalbank() {
    callbackDocTranfer(gTrans.newlistTemplate[gTrans.selectedview]);
}

function callbackDocTranfer(obj) {
    console.log(obj);
    modalDialog.hideDialogFull();

    callbackCloseDialogSchedulerTransfer();
    // double click template tranfer doc

    excuteSampleSelected(obj);
}

//document.addEventListener("evtDispatherSample", excuteEventSelected, false);
function excuteSampleSelected(obj) {
    if (currentPage == 'transfer/identification/identification-trans-src') {
        var newBalance = 0;
        if (obj != null && obj != undefined) {
            for (var i in gTrans.listSourceAccounts) {
                if (obj.tai_khoan_nguon == gTrans.listSourceAccounts[i].account) {
                    newBalance = gTrans.listSourceAccounts[i].balance;
                    break;
                }
            }
            comboEl.refresh({
//        accountName : obj.name,
                accountNumber:obj.tai_khoan_nguon,
                accountBalance:formatNumberToCurrency(newBalance)
            });

            gTrans.sourceAcc.account = obj.tai_khoan_nguon;
            gTrans.sourceAcc.balance = newBalance;
            document.getElementById("trans.amount").value = formatNumberToCurrency(obj.so_tien);
            document.getElementById("trans.identification").value = obj.so_cmnd;
            document.getElementById("trans.issuedate").value = obj.ngay_cap_cmnd;
            document.getElementById("trans.issueplace").value = obj.noi_cap_cmnd;
            document.getElementById("trans.name").value = obj.name;
            document.getElementById("trans.phonenumber").value = obj.so_dien_thoai;
            document.getElementById("ngan-hang-nhan").value = obj.ngan_hang_nhan;
            document.getElementById("trans.content").value = obj.noi_dung;
            gTrans.dti.citadCode = obj.SORTCODE;
            gTrans.dti.bankCode = obj.BANK_CODE;

        }
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


function genScreenDesktop(respArr){
    tempRespArr = respArr;
	gTrans.newlistContact=tempRespArr;
	
    for(var i = respArr.length; i > 0 ; i--){
        for(var j = 0; j < i - 1; j++){
            var tempValue;
            if(respArr[j].peopleName.toUpperCase().charCodeAt(0) > respArr[j + 1].peopleName.toUpperCase().charCodeAt(0)){
                tempValue = respArr[j];
                respArr[j] = respArr[j + 1];
                respArr[j + 1] = tempValue;
            }
        }
    }
    var div = document.getElementById("divListContact");
    div.innerHTML = "";
    var firstLetter;
    for(var i = 0; i < respArr.length; i++){
        if(i == 0 ||respArr[i].peopleName.toUpperCase().charCodeAt(0) > firstLetter.charCodeAt(0)){
            firstLetter = respArr[i].peopleName.charAt(0);
            var localTitle = document.createElement('div');
            localTitle.innerHTML = firstLetter;
            localTitle.style.textAlign = "left";
            localTitle.style.padding = "10px";
            localTitle.style.color = "#5f2f85";
            localTitle.style.fontWeight = "bold";
            div.appendChild(localTitle);
        }
        var tempView = document.createElement('div');
        tempView.setAttribute('class','my-acc-view');
        tempView.setAttribute('id','localAcc_' + i);
        tempView.setAttribute('onclick',"viewLocalAcc(this," + i + ")");
        tempView.innerHTML = respArr[i].peopleName;
        div.appendChild(tempView);
    }
    if (respArr.length > 0){
        viewLocalAcc(document.getElementById('localAcc_0'), 0);
    }
}

function viewLocalAcc(e,index){
    document.getElementById('accNo').style.display = '';
    document.getElementById('accNumberContact').innerHTML =  tempRespArr[index].transValue;
    document.getElementById('accNameContact').innerHTML =  tempRespArr[index].peopleName;
    document.getElementById('accPartnerName').innerHTML = tempRespArr[index].partnerName;
    document.getElementById('deleteByBenId').setAttribute("beneid",tempRespArr[index].beneId);
    document.getElementById('deleteSelection').style.display = '';
    resetActive();
    e.style.backgroundColor = '#FF8C29';
    e.style.color = '#fff';
    tempIndex = index;
}

function resetActive(){
    for( var i = 0; i < gUserInfo.accountList.length; i++){
        if(i%2 == 0){
            document.getElementById('myAcc_' + i).style.backgroundColor = '#F7E9FA';
        }else{
            document.getElementById('myAcc_' + i).style.backgroundColor = '#FDF1FF';
        }
        document.getElementById('myAcc_' + i).style.color = '#000';
    }
    if(tempRespArr != undefined){
        for(var i = 0; i< tempRespArr.length; i++){
            if(document.getElementById('localAcc_' + i)){
                if(i%2 == 0){
                    document.getElementById('localAcc_' + i).style.backgroundColor = '#F7E9FA';
                }else{
                    document.getElementById('localAcc_' + i).style.backgroundColor = '#FDF1FF';
                }
                document.getElementById('localAcc_' + i).style.color = '#000';
            }
        }
    }
}

function transLocalBank(){
    var objectVal = {};
    objectVal["transValue"] = document.getElementById('accNumberContact').innerHTML;
    objectVal['peopleName'] = document.getElementById('accNameContact').innerHTML;
    callbackContactTranfer(objectVal);
}

function callbackContactTranfer(obj) {
    console.log(obj);
    // double click template tranfer contact doc
    modalDialog.hideDialogFull();
    callbackCloseDialogSchedulerTransfer();
    var SoCMT_HC = document.getElementById("trans.identification");
    var TenNguoiNhan = document.getElementById("trans.name");
    var NganHang = document.getElementById("trans.branchName");
    // clear
	var NgayCap = document.getElementById("trans.issuedate");
	var NoiCap = document.getElementById("trans.issueplace");
    var SoDienThoai = document.getElementById("trans.phonenumber");
    var Amount = document.getElementById("trans.amount");
	var Content = document.getElementById("trans.content");

    SoCMT_HC.value = gTrans.newlistContact[tempIndex].BENE_ACCTNO;
    NgayCap.value = gTrans.newlistContact[tempIndex].DATISSUE;
	NoiCap.value = gTrans.newlistContact[tempIndex].PLACEISSUE;
	TenNguoiNhan.value = gTrans.newlistContact[tempIndex].BENE_NAME;
	SoDienThoai.value = gTrans.newlistContact[tempIndex].PHONENUMBER;
	NganHang.value = gTrans.newlistContact[tempIndex].BRANCH_NAME;
	gTrans.dti.bankCode=gTrans.newlistContact[tempIndex].BANK_CODE;
	gTrans.dti.citadCode=gTrans.newlistContact[tempIndex].SORTCODE;

    // NgayCap.value = '';
    // NoiCap.value = '';
    // SoDienThoai.value = '';
    Amount.value = '';
    Content.value = '';
}

function genListSearchParentPage(idDivList, arr, keyword, parserService, fieldsRow, fieldsHidden,  button, doubleClickItem){
    if(gModeScreenView == CONST_MODE_SCR_SMALL){
        searchListArr(idDivList,
            arr, keyword,
            parserService, fieldsRow,
            fieldsHidden,  button,
            doubleClickItem);
        // funcUpdateStyleAccount();
    }else{

    }
}
