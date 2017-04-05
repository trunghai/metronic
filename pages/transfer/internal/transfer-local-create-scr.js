/***
* Edit by HaiNM
* Date: 2/25/2017
***/

var gDisabledLuuMau = false;
var lastClickSwitch;
//gTrans.transInfo.schedule  = false;
gTrans.TXN_TYPE = 0;
var comboEl;
gTrans.isBack = false;
var sourceAcc;
//gTrans.sequenceIdTemplate = '11';
function viewBackFromOther() {
    gTrans.isBack = true;
    document.getElementById('navBottomBar').style.display = 'block';
   // document.getElementById('trans.amount').value = gTrans.transInfo.tmpAmountTrans;

	var trans_amount = document.getElementById('trans.amount');
    if(trans_amount){
        gTrans.transInfo.amountTrans = trans_amount.value;
    }
//    var value = trans_amount.value;
//    if(trans_amount.value != undefined){
//        gTrans.transInfo.amountTrans = value;
//    }
}

function viewDidLoadSuccess() {
    if(!gTrans.isBack){
        gTrans.transInfo = {};
    }
    init();
    // setInputOnlyASCIILNH('trans.content', CONST_STR.get("ERR_INPUT_ONLY_ASCII_CHAR"));
    setInputOnlyASCIILNH('id.sample.name', CONST_STR.get("ERR_INPUT_ONLY_ASCII_CHAR"));
    // actionbar.showStepSequence("com-authentication-scr");
    // setInputOnlyNumber('trans.targetaccount',CONST_STR.get("ERR_INPUT_ONLY_NUMBER"));
    setInputOnlyASCIILNH('trans.content', CONST_STR.get("ERR_INPUT_ONLY_ASCII_CHAR"));
}

function viewWillUnload() {
    //flag = false;
    logInfo('transfer will unload');
    document.removeEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
}

function init(){
    angular.module('EbankApp').controller('transfer-local-create', function ($scope, requestMBServiceCorp) {
        // (gUserInfo.lang == 'VN') ? document.getElementById('trans.payee').value = CONST_INTERNAL_TRANS_SAVE_SAMPLE_STATUS_VN[0] : CONST_INTERNAL_TRANS_SAVE_SAMPLE_STATUS_EN[0];
        // document.getElementById('trans.sample.value').value = CONST_INTERNAL_TRANS_SAVE_SAMPLE_STATUS_KEY[0];
        (gUserInfo.lang == 'VN') ? document.getElementById('id-trans-local').value = CONST_INTERNAL_TRANS_TYPE_VN[0] : document.getElementById('id-trans-local').value = CONST_INTERNAL_TRANS_TYPE_EN[0];
        document.getElementById('id-trans-local-value').value = CONST_INTERNAL_TRANS_TYPE_KEY[0];
        document.getElementById('save-receiver').getElementsByTagName('input')[0].checked = true;
        gTrans.idtxn = 'T12';
        $scope.initAmount = gTrans.transInfo.initAmountTrans ||'';
        $scope.initComboTextAccount = function (index){
            var accountName =  "Invalid";
            var accountNumber = "Invalid";
            var accountBalance = "Invalid";

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
                fontSize : "15px",
                showBorderBottom : false,//set margin to holder of combo
                clickIt : function (){ //handle function click
                    console.log("already click");
                }
            });
            comboEl.show("holder-account-info");
        }

        // $scope.initTextAreaMessage = function (){
        //     try{
        //         var txtArea = document.getElementById('trans.content');
        //         if(txtArea!==null){
        //             return false;
        //         }
        //         document.getElementById("holder-transfer-message").innerHTML = "";
        //     }catch(e){}


        //     var textAreaEl = new TextArea({
        //         containerMargin : "0px",
        //         idTextArea : "trans.content",
        //         placeholder : CONST_STR.get("PLACEHOLDER_TRANSFER_CONTENT"),
        //         iconClass : "icon-content-note",
        //         lengthmax : "100",

        //         //borderColor : "rgba(255, 255, 255, 0.2)",
        //         //showBorderBottom : false,
        //         // showBorderTop : false,
        //         fontSizeIcon : "24px!important",
        //         validateInput : function(){
        //             console.log("validate function");
        //         }
        //     });
        //     textAreaEl.show("holder-transfer-message");
        // }

        $scope.loadInitData = function () {
            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.templateId = gTrans.templateId;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_IIT_FUNDS_LOCAL_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true,
                function(data) {
                    var resp = data;
                    if (resp.respCode == 0) {
                        gTrans.sendMethod = resp.respJsonObj.sendMethod;
                        gTrans.listSourceAccounts = resp.respJsonObj.listSourceAccounts;
                        gTrans.limit = resp.respJsonObj.limit;
                        gTrans.sourceAcc = gTrans.listSourceAccounts[0];
                        $scope.initComboTextAccount(0);

                        var MutiId = ["id.notifyTo", "id.notifyTo1"];
                        for (i = 0; i < MutiId.length; i++) {
                            var sendMethod = document.getElementById(MutiId[i]);
                            sendMethod.innerHTML = CONST_STR.get("COM_NOTIFY_"+gTrans.sendMethod+"");
							//gTrans.transInfo.sendMethod = sendMethod.placeholder;
						}
                    }
                },
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                    gotoHomePage();
                }
            );
        }

        $scope.initBottomBar = function (){
            var arrBottom = new Array();
            arrBottom.push(new MenuBottom("BOTTOM_BAR_TEMPLATE_TRANSFER", "icon-template"));
            arrBottom.push(new MenuBottom("BOTTOM_BAR_CONTACT", "icon-beneficiaries"));
            arrBottom.push(new MenuBottom("AUTO_BILLING_TAB_LIST", "icon-scheduled-transfers-list"));
			
			          transferParam = new TransferParam(CONSTANTS.get("CMD_TRANSFER_TEMPLATE_TEMPLATE"),'',0);
            contactParam = new ContactParam(CONSTANTS.get("CMD_TYPE_LOOKUP_PAYEE"),CONST_PAYEE_LOCAL_TRANSFER,'TH',true);
            periodParam = new PeriodParam(CONSTANTS.get("CMD_TRANSFER_PERIODIC_MNG_TRANS"),CONST_VAL_PERIODIC_LOCAL[0]);


            navController.initBottomBarWithCallBack("transfer/internal/transfer-local-create-scr", arrBottom, "transfer-local", function (index) {
                switchAction(index);
            });
            // dung de phan biet mau chuyen tien, khi sua mau chuyen tien
            gEdit = 1;
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

        $scope.callbackContactTranfer = function () {

        }

        
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

        //=================SHOW DIALOG TransType==================================//
        $scope.showTransTypeSelection =function () {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_INTERNAL_TRANS_TYPE_EN : CONST_INTERNAL_TRANS_TYPE_VN;
            var tmpArray2 = CONST_INTERNAL_TRANS_TYPE_KEY;
            var handleInputTransferTypeAccount = function (e) {
                if (currentPage == "transfer/internal/transfer-local-create-scr") {
                    document.removeEventListener("evtSelectionDialog", handleInputTransferTypeAccount, false);
                    handleInputTransferTypeAccountClose();
                    if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                        var desAcc = document.getElementById('id-trans-local');
                        if (desAcc.nodeName == "INPUT") {
                            desAcc.value = e.selectedValue1;
                        } else {
                            desAcc.innerHTML = e.selectedValue1;
                        }

                    }
                    if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                        var desAccNoVal = document.getElementById('id-trans-local-value');
//                        gTrans.idtxn = "";
                        transType = e.selectedValue2;
                        gTrans.idtxn = e.selectedValue2;

                        if (transType == 'T12') {
//                            document.getElementById('trans.accountName').value = "";
                            var tmpAccNo = document.getElementById('trans.targetaccount');
                            tmpAccNo.parentNode.setAttribute('onClick', '');
                            tmpAccNo.setAttribute('class', 'form-control');
                            tmpAccNo.setAttribute('type', 'tel');
                            tmpAccNo.value = '';

                            document.getElementById('span.trans.target').style.display = '';
                            document.getElementById('id.next.icon').style.display = 'none';

                        } else {
                            document.getElementById('span.trans.target').style.display = 'none';
                            document.getElementById('id.next.icon').style.display = '';
                            var tmpAccNo = document.getElementById('trans.targetaccount');
                            tmpAccNo.setAttribute('class', 'form-control form-control-righttext');
                            tmpAccNo.parentNode.setAttribute('onClick', 'showAccOfCustomer();');
                            tmpAccNo.setAttribute('type', 'button');
                            var desAccNo = document.getElementById("trans.targetaccount");
                            var sourceAccNo = document.getElementById('id.accountno');
                            desAccNo.value = CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER');
                            document.getElementById('trans.targetaccountname').style.display = 'none';
                            document.getElementById('check').style.borderBottomStyle = 'none';
                        }

                        if (desAccNoVal.nodeName == "INPUT") {
                            transType = e.selectedValue2;
                        } else {
                            desAccNoVal.innerHTML = e.selectedValue2;
                        }
                    }
                }
            }
			
            var handleInputTransferTypeAccountClose = function () {
                if (currentPage == "transfer/internal/transfer-local-create-scr") {
                    document.removeEventListener("evtSelectionDialog", handleInputTransferTypeAccount, false);
                    document.removeEventListener("evtSelectionDialogClose", handleInputTransferTypeAccountClose, false);
                }
            }

            document.addEventListener("evtSelectionDialog", handleInputTransferTypeAccount, false);
            document.addEventListener("evtSelectionDialogClose", handleInputTransferTypeAccountClose, false);
            showDialogList(CONST_STR.get('TRANSFER_REMITTANCE_SELECT_TYPE'), tmpArray1, tmpArray2, false);
        }

        //=================SHOW DIALOG Acc====================================//
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
            if (currentPage == "transfer/internal/transfer-local-create-scr") {
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
            if (currentPage == "transfer/internal/transfer-local-create-scr") {
                document.removeEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            }
        }
        //=================SHOW DIALOG FOR SAMPLE=============================//
        // $scope.showInputMNG = function (){
            // var tmpArray1 = (gUserInfo.lang == 'VN')? CONST_INTERNAL_TRANS_SAVE_SAMPLE_STATUS_VN :CONST_INTERNAL_TRANS_SAVE_SAMPLE_STATUS_EN;
            // var tmpArray2 = CONST_INTERNAL_TRANS_SAVE_SAMPLE_STATUS_KEY;
            // document.addEventListener("evtSelectionDialog", showInputMNGSelectionOpen, false);
            // document.addEventListener("evtSelectionDialogClose", showInputMNGSelectionClose, false);
            // showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        // }

        // function showInputMNGSelectionOpen(e) {
            // if (currentPage == "transfer/internal/transfer-local-create-scr") {
                // if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    // document.getElementById('trans.payee').value = e.selectedValue1;
                    // document.getElementById('trans.sample.value').value = e.selectedValue2;
                    // showInputMNGSelectionClose();
                // }
            // }
        // }

        // function showInputMNGSelectionClose() {
            // if (currentPage == "transfer/internal/transfer-local-create-scr") {
                // document.removeEventListener("evtSelectionDialog", showInputMNGSelectionOpen, false);
                // document.removeEventListener("evtSelectionDialogClose", showInputMNGSelectionClose, false);
            // }
        // }

        $scope.showDialogScheduler = function () {
            navCachedPages['transfer/internal/transfer-schedule'] = null;
            navController.pushToView('transfer/internal/transfer-schedule', true, 'html');
            document.addEventListener("evtStandingPeriod", handleInputSchedule, false);
        }

        function handleInputSchedule(e) {
            document.removeEventListener("evtStandingPeriod", handleInputSchedule, false);
            document.getElementById('schedule.information.value').innerHTML = formatString(CONST_STR.get('TRANS_PERIODIC_SET_SCHEDULE'),[e.period.name, e.startdate, e.enddate]);
            document.getElementById('trans.schedule.information').style.display = 'block';

            gTrans.transInfo.frequence = e.period.value;
            gTrans.transInfo.datstart  = e.startdate;
            gTrans.transInfo.datend    = e.enddate;
            gTrans.transInfo.schedule  = true;
        }

        $scope.initTodayDate = function (){
            var txt = getDate("today");
            document.getElementById("trans.today").innerHTML = CONST_STR.get('TODAY_TITLE') + ', ' +  txt;
        }
        if(gTrans.isBack){
            $scope.amount = gTrans.transInfo.amountTrans;
			$scope.loadInitData();
        }
        $scope.formatNumberToCurrency = function () {
            $scope.amount = formatNumberToCurrency($scope.amount);
        }

        var gConditions = {	"amount":
        {
            "allow":"[,.0-9]",
            "notallow":"",
            "minlength":"0",
            "maxlength":"18",
            "func":""
        },
            "account":
            {
                "allow":"[0-9]",
                "notallow":"",
                "minlength":"11",
                "maxlength":"11",
                "func":""
            },
            "content":
            {
                "allow":"[a-zA-Z0-9]",
                "notallow":"",
                "minlength":"0",
                "maxlength":"200",
                "func":""
            },
            "sample":
            {
                "allow":"[a-zA-Z0-9]",
                "notallow":"",
                "minlength":"0",
                "maxlength":"50",
                "func":""
            }

        }

        function validateFunc(inValue, inConditions){
            if(inConditions == undefined || inConditions == null) return;
            if(typeof(inValue) == 'number') inStr = inValue.toString();
            else var inStr = inValue;
            var tmpValidateObj = inConditions;//inConditions[tmpObj]
            for(var tmpObjProperty in tmpValidateObj) {
                //alert(tmpObjProperty);
                var tmpValue = tmpValidateObj[tmpObjProperty];
                if((tmpValue == undefined) || (tmpValue.length == 0)) continue;
                switch(tmpObjProperty) {
                    case "allow": {
                        var rex = new RegExp(tmpValue, "gi");
                        var tmprex = inStr.match(rex);
                        if((tmprex == undefined) || (tmprex.length < 1)) {
                            console.log('allow');
                            return false;
                        }
                        break;
                    }
                    case "notallow": {
                        var rex = new RegExp(tmpValue, "gi");
                        var tmprex = inStr.match(rex);
                        if((tmprex == undefined) || (tmprex.length > 0)) {
                            console.log('not allow');
                            return false;
                        }
                        break;
                    }
                    case "minlength": {
                        if(!(inStr.length > (parseInt(tmpValue) - 1))) {
                            console.log('min length fail');
                            return false;
                        }
                        break;
                    }
                    case "maxlength": {
                        if(!(inStr.length < (parseInt(tmpValue) + 1))) {
                            console.log('max length fail');
                            return false;
                        }
                        break;
                    }
                    case "func": {
                        if(tmpValue != undefined) {
                            console.log('call function');
                            if(typeof(tmpValue) == 'function') {
                                if(!tmpValue()) {
                                    console.log('condition extent fail');
                                    return false;
                                }
                            }
                            else if(typeof(tmpValue) == 'string' && (typeof(window[tmpValue]) == 'function')) {
                                if(!window[tmpValue]()) {
                                    console.log('condition extent fail');
                                    return false;
                                }
                            }
                            else {
                                console.log('not exist function');
                            }
                        }
                        break;
                    }
                    default: {
                        console.log('do not match property.');
                        return false;
                        break;
                    }
                }
            }
            return true;
        }

        //Validate
        function validate() {
            var conditions = gConditions;

            //tai khoan chuyen rong
            if (!validateFunc(gTrans.transInfo.sourceAcc, conditions["account"])) {
                showAlertText(CONST_STR.get('ERR_INPUT_FORMAT_DES_ACC'));
                return false;
            }

            //tai khoan nhan rong
            if (gTrans.transInfo.destinationAcc.trim() == "" || gTrans.transInfo.destinationAcc.trim() == CONST_STR.get('INPUT_ACC_BTN_SELECT')) {
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('COM_ACCOUNT_DEST')]));
                return false;
            }
			
            //tai khoan nhan hop le hay khong
            if (gTrans.idtxn == "T12") {
                if(gTrans.transInfo.beneName == '') {
                    showAlertText(CONST_STR.get('ERR_INPUT_FORMAT_DES_ACC'));
                    return false;
                }
            }

            //tai khoan nhan va chuyen trung nhau
            if (gTrans.idtxn == "T12" || gTrans.idtxn == "T11") {
                // if (gTrans.transInfo.sourceAcc.substring(0, 8).indexOf(gTrans.transInfo.destinationAcc.substring(0, 8)) != -1) {
                if (gTrans.transInfo.sourceAcc == gTrans.transInfo.destinationAcc) {
                    showAlertText(CONST_STR.get('TRANSFER_ERROR_EQUAL_MSG'));
                    return;
                }
            }
			
            //so tien rong
            if (!validateFunc(gTrans.transInfo.amountTrans, conditions["amount"])) {
                showAlertText(CONST_STR.get('ERR_INPUT_NO_AMOUNT'));
                return false;
            }

            //so tien khong vuot qua so du
            var balance = parseInt(removeSpecialChar(gTrans.sourceAcc.balance));
            if (balance - parseInt(gTrans.transInfo.amountTrans) < 0) {
                showAlertText(CONST_STR.get('TOPUP_EXCEED_AVAIL_BALANCE'));
                return false;
            }

            //noi dung rong
            if (!validateFunc(gTrans.transInfo.contentTrans, conditions["content"])) {
                showAlertText(CONST_STR.get('ERR_INPUT_NO_CONTENT'));
                return false;
            }

            //ten mau chuyen tien rong
            if (!gTrans.transInfo.issavepayee || gTrans.transInfo.issavepayee == null || gTrans.transInfo.issavepayee == "") {
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('TRANSFER_REMITTANCE_NAME')]));
                return false;
            }
            if (gTrans.saveSampleStatus == "TP") {
                if (!validateFunc(gTrans.transInfo.sampleName, conditions["sample"])) {
                    showAlertText(CONST_STR.get('ERR_INPUT_NO_SAMPLE'));
                    return false;
                }
            }

            if (gTrans.idtxn == "T12") {
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


        $scope.sendJSONRequest = function () {
            gTrans.transInfo.sourceAcc = gTrans.sourceAcc.account;
            gTrans.transInfo.balance = gTrans.sourceAcc.balance;
            gTrans.transInfo.transTypeName = document.getElementById('id-trans-local').value;
            gTrans.transInfo.idtxn = gTrans.idtxn;
            gTrans.transInfo.destinationAcc = document.getElementById("trans.targetaccount").value;
            // if(gTrans.idtxn == 'T12'){
                // gTrans.transInfo.beneName = document.getElementById("trans.accountName").value;
            // }else {
                gTrans.transInfo.beneName = gCustomerNanme;
            // }
            gTrans.transInfo.initAmountTrans = document.getElementById("trans.amount").value;
            gTrans.transInfo.amountTrans = removeSpecialChar(document.getElementById("trans.amount").value);
            gTrans.transInfo.contentTrans = document.getElementById("trans.content").value.replace(/[!"#$@%&*'\+:;<=>?\\`^~{|}]/g, '');
			/*HaiNM*/
			var infoCommon = {};
            infoCommon.balanceAfterTransfer = (removeSpecialChar(gTrans.transInfo.balance)) - gTrans.transInfo.amountTrans;
			gTrans.common = infoCommon;
			/*End*/
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
            var sampleName = document.getElementById("id.sample.name");
            if(checkLuuMauChuyenTien.checked&&sampleName.value==""){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('TRANSFER_REMITTANCE_NAME')]));
                return;
            }

            gTrans.transInfo.issavepayee = mng;
            gTrans.transInfo.sampleName = document.getElementById("id.sample.name").value;

            if (!validate()) return;

            var jsonData = new Object();
            jsonData.sequence_id = "4";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.transInfo = gTrans.transInfo;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_IIT_FUNDS_LOCAL_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                    if (response.respCode == '0'){
                        var requestData = {
                            transId: response.respJsonObj[0].MA_GD,
                            sequence_id: 5,
                            idtxn: gTrans.transInfo.idtxn,
                            issavepayee: gTrans.transInfo.issavepayee,
                            sampleName: gTrans.transInfo.sampleName
                        }
                        gTrans.transInfo.FEE = response.respJsonObj[0].FEE;
                        gTrans.requestData = requestData;
                        gTrans.cmdType =  CONSTANTS.get('CMD_CO_IIT_FUNDS_LOCAL_TRANSFER');
                        gTrans.transInfo.sendMethod = document.getElementById("id.notifyTo").innerHTML;
                        gTrans.transInfo.date = currenDate();
                        gTrans.src = "pages/transfer/internal/transfer-local-view.html";
                        gTrans.ortherSrc = "transfer/internal/transfer-local-create-scr";
                        gTrans.transInfo.transId = response.respJsonObj[0].MA_GD;
                        gTrans.transInfo.accountBalance = formatNumberToCurrency(gTrans.listSourceAccounts[0].balance);;
                        navController.pushToView("common/common-review/transfer-review-scr", true, "html");
                    }
                },
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_INIT_TRANS'));
                }
            );
        }

        $scope.initBottomBar();
        if (!gTrans.isBack) {
            $scope.loadInitData();
        }
        // $scope.initTextAreaMessage();
        $scope.initTodayDate();
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}

//================= PROCESS DIALOG TEMPLATE TRANSFER ==================================//
function reInitTemplateTransfer () {
    initDialog(CONST_STR.get('BOTTOM_BAR_TEMPLATE_TRANSFER'),"","transfer/template-transfer/template-transfer-doc",
        function callbackDialogClose(){
            callbackCloseDialogSchedulerTransfer();
        },
        function callbackDialogLoadSuccess(){

            modalDialog.showDialogFull();
            actionbar.hideActionbar();
            bottomBar.hide();
        },true, callbackDocTranfer);
}

function temptranferlocalbank(){
    var objtemp = {};
    objtemp['tai_khoan_nguon']= document.getElementById('accSource').innerHTML;
    objtemp['ngan_hang_nhan'] = document.getElementById('ngan-hang-nhan').innerHTML;
    objtemp['noi_dung'] = document.getElementById('noi-dung').innerHTML;
    objtemp['so_tien'] = document.getElementById('so-tien').innerHTML ;
    objtemp['ngay_chuyen'] = document.getElementById('ngay-chuyen').innerHTML ;
    objtemp['ten_tai_khoan_dich'] = document.getElementById('nametranfer').innerHTML ;
    objtemp['tai_khoan_dich'] = document.getElementById('accNumbertransfer').innerHTML ;
    objtemp['so_cmnd'] = document.getElementById('identity-card').innerHTML ;
    objtemp['ngay_cap_cmnd'] = document.getElementById('card-date').innerHTML ;
    objtemp['noi_cap_cmnd'] = document.getElementById('card-place').innerHTML ;
    objtemp['so_dien_thoai'] = document.getElementById('card-phone').innerHTML
//        objtemp['ngay_chuyen'] = document.getElementById('ngay_chuyen').innerHTML ;
    callbackDocTranfer(objtemp);
}

function callbackDocTranfer(obj) {
    console.log(obj);
    modalDialog.hideDialogFull();

    callbackCloseDialogSchedulerTransfer();
    // double click template tranfer doc

    excuteSampleSelected(obj);
}

//document.addEventListener("evtDispatherSample", excuteEventSelected, false);
function excuteSampleSelected(obj){
    if (currentPage == 'transfer/internal/transfer-local-create-scr'){
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
                accountNumber :obj.tai_khoan_nguon,
                accountBalance :  formatNumberToCurrency(newBalance)
            });

//            gTrans.sourceAcc.account = obj.tai_khoan_nguon;
//            gTrans.sourceAcc.balance = newBalance;
            document.getElementById("trans.targetaccount").value = obj.tai_khoan_dich;
            document.getElementById("trans.accountName").value = obj.ten_tai_khoan_dich;
            document.getElementById("trans.amount").value = obj.so_tien;
            document.getElementById("trans.content").value = obj.noi_dung;

			var trowConvert = document.getElementById('row_convert');
			var numStr = convertNum2WordWithLang(removeSpecialChar(obj.so_tien), gUserInfo.lang);//Lay ra chuoi doc so tien
			if(numStr){
				var nodeNumTxt = document.getElementById("trans.amounttotext");
				nodeNumTxt.innerHTML = "<div class='txtmoneystyle'>" + CONST_STR.get('TRANS_LOCAL_NUM_TO_WORD') + ": " + numStr + "</div>";
				trowConvert.style.display = "";
			}else{
				trowConvert.style.display = 'none';
			}
        }
    }
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
    bottomBar.resumeView('transfer/internal/transfer-local-create-scr','transfer-local');
    actionbar.showActionBar();
    document.removeEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthMobile',temptranferlocalbank,false);
    document.removeEventListener('evtChangeWidthDesktop',temptranferlocalbank,false);
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
    var destinationAcc = document.getElementById("trans.targetaccount");
    // var nodeDesAcc = document.getElementById("trans.targetaccountname");

    destinationAcc.value = obj.transValue;
    tmpDestinationAccName = obj.peopleName;
    //nodeDesAcc.innerHTML = "<h6 class='h6style'>" + CONST_STR.get('TRANS_LOCAL_ACC_DESTINATION_TITLE') + ": <b>" + obj.peopleName + "</b></h6>";
    var transferAccount = document.getElementById("trans.accountName");
    transferAccount.value = tmpDestinationAccName;
    document.getElementById("trans.amount").value = "";
    document.getElementById("trans.content").value = "";
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

function handleInputAmount (e, des) {
    var trowConvert = document.getElementById('row_convert');
    var tmpVale = des.value;
    formatCurrency(e, des);
    //des.value = formatNumberToCurrency(des.value);
    var numStr = convertNum2WordWithLang(keepOnlyNumber(tmpVale), gUserInfo.lang);

    if(numStr){
        var nodeNumTxt = document.getElementById("trans.amounttotext");
        nodeNumTxt.innerHTML = "<div class='txtmoneystyle'>" + CONST_STR.get('TRANS_LOCAL_NUM_TO_WORD') + ": " + numStr + "</div>";
        trowConvert.style.display = "";
    }else{
        trowConvert.style.display = 'none';
    }
}

function controlInputText(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccent(field.value);
        field.value = field.value.replace(/[!"#$%&*'\+:;<=>?\\`^~{|}]/g, '');
    }
}

function showAccOfCustomer() {
    if (gTrans.listSourceAccounts.length == 0) {
        showAlertText(CONST_STR.get('ERR_INPUT_NOT_ENOUGH_ACC'));
        return;
    }

    var accOfCus = [];
    var blcOfCus = [];
    for (var i = 0; i < gTrans.listSourceAccounts.length; i++) {
        var tmpListAcc = gTrans.listSourceAccounts[i].account;
        var tmpBlc = gTrans.listSourceAccounts[i].balance;
        if (tmpListAcc != sourceAcc && gTrans.listSourceAccounts[i].ghiCo == 'N') {
            accOfCus.push(tmpListAcc);
            blcOfCus.push(tmpBlc);
        }
        ;
    }

    var handleSelectionAccountOfCustomer = function (e) {
        document.removeEventListener("evtSelectionDialog", handleSelectionAccountOfCustomer, false);
        if (currentPage == "transfer/internal/transfer-local-create-scr") {
            if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                var desAccountNo = document.getElementById("trans.targetaccount");
                if (desAccountNo.nodeName == "INPUT") {
                    desAccountNo.value = e.selectedValue1;
                    loadInfoFromIdAccount();
                } else {
                    desAccountNo.innerHTML = e.selectedValue1;
                }
            }
        }
    }

    var handleSelectionAccountOfCustomerClose = function (e) {
        if (currentPage == "transfer/internal/transfer-local-create-scr") {
            document.removeEventListener("evtSelectionDialog", handleSelectionAccountOfCustomer, false);
            document.removeEventListener("evtSelectionDialogClose", handleSelectionAccountOfCustomerClose, false);
        }
    }

    document.addEventListener("evtSelectionDialog", handleSelectionAccountOfCustomer, false);
    document.addEventListener("evtSelectionDialogClose", handleSelectionAccountOfCustomerClose, false);
    showDialogList(CONST_STR.get('COM_DIALOG_TITLE_ACCNO_CHOISE'), accOfCus, blcOfCus, true);
}

//Get Account Name from User ID
function loadInfoFromIdAccount() {
	var userId = "";
    if (gTrans.idtxn == "T11") {
        if (gTrans.accName != "") {
            document.getElementById("trans.targetaccountname").innerHTML = gTrans.accName;
            return;
        }
        userId = document.getElementById("trans.desaccountno").value;
    }
    if (gTrans.idtxn == "T12") {
        userId = document.getElementById("trans.targetaccount").value;
    }

    var jsonData = new Object();
    jsonData.sequence_id = "3";
    jsonData.idtxn = gTrans.idtxn;
    jsonData.accountId = userId;
    var args = new Array();
    args.push(null);
    args.push(jsonData);
    var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_IIT_FUNDS_LOCAL_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
    var data = getDataFromGprsCmd(gprsCmd);
    requestMBServiceCorp(data, false, 0,
        function (response) {
            var resp = JSON.parse(response);
            if (resp.respCode == 0 && resp.respJsonObj.length > 0 && resp.respJsonObj[0].GHI_CO == "N") {
                document.getElementById("trans.accountName").value = resp.respJsonObj[0].TEN_TK;
                if (gTrans.idtxn == "T11") {
                    gTrans.accName = resp.respJsonObj[0].TEN_TK;
                }
            } else
                document.getElementById("trans.accountName").value = "";
        },
        function () {
            document.getElementById("trans.accountName").value = "";
        }
    );
}
function currenDate() {
    var d = new Date().getDate();
    var m = new  Date().getMonth() + 1;
    var y = new Date().getFullYear();

    return d + '/' + m + '/' + y;
}
