/***
* Edit by HaiNM
* Date: 2/25/2017
***/

gTrans.redirect = 'transfer/domestic/transfer-inter-create-scr';
var arrBank = new Array();
var viewBack = false;
var gDisabledLuuMau = false;
var lastClickSwitch;
//gTrans.transInfo.schedule  = false;
gTrans.TXN_TYPE = 1;
var comboEl;
gTrans.idtxn='';
flagInter = true;
gTrans.isBack= false;
gTrans.newlistContact='';
var tempIndex;
gTrans.flagEditTemplate =  0;
function viewBackFromOther() {
    flagInter = false;
    viewBack = true;
    gTrans.isBack = true;
	document.getElementById('navBottomBar').style.display = 'block';
	
    var trans_amount = document.getElementById('trans.amount');
    var value = trans_amount.value;
    if(trans_amount.value != undefined){
        gTrans.transInfo.amountTrans = value;
    }
}
function viewWillUnload() {
    //flag = false;
    logInfo('transfer will unload');
    document.removeEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
}

function viewDidLoadSuccess() {

    if(!gTrans.isBack){
        gTrans.transInfo = {};
    }
    init();
    if ((gTrans.viewBackDTI == undefined || !gTrans.viewBackDTI) && (gTrans.showBankSelection == undefined || !gTrans.showBankSelection)) {
        // khoi tao ac gia tri mac dinh cho cac control
        var tmp = {};
        if (gTrans.dti) {
            tmp = JSON.parse(JSON.stringify(gTrans.dti));
        }

        gTrans.dti = {
            idtxn: "T13"
        };

        gTrans.dti.citadCode = tmp.citadCode;
        gTrans.dti.feeId ='N';
    }
    //Tooltip when hover book

    gTrans.viewBackDTI = false;
    gTrans.showBankSelection = false;
    setInputOnlyASCIILNH('trans.content', CONST_STR.get("ERR_INPUT_ONLY_ASCII_CHAR"));

}

function init(){
    angular.module('EbankApp').controller('transfer-inter-create', function ($scope, requestMBServiceCorp) {
        document.getElementById('save-receiver').getElementsByTagName('input')[0].checked = true;
        initBottomBar();

        //=================SHOW DIALOG Acc====================================//
        $scope.showAccountSelection =function () {
            var tmpArray1 = [];
            var tmpArray2 = [];
            for (var i in gTrans.listSourceAccounts){
                tmpArray1.push(gTrans.listSourceAccounts[i].CUST_AC_NO);
                tmpArray2.push(formatNumberToCurrency(gTrans.listSourceAccounts[i].BALANCE));
            }
            document.addEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, true);
        }

        function showAccountSelectionOpen(e) {
            if (currentPage == "transfer/domestic/transfer-inter-create-scr") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    for (var i in gTrans.listSourceAccounts){
                        if (e.selectedValue1 == gTrans.listSourceAccounts[i].CUST_AC_NO){
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
            if (currentPage == "transfer/domestic/transfer-inter-create-scr") {
                document.removeEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            }
        }
//        end show acc
        gTrans.idtxn = 'T13';
        viewBack = goBack;
        $scope.initComboTextAccount = function (index){
            var accountName =  "Invalid";
            var accountNumber = "Invalid";
            var accountBalance = "Invalid";

            try{
                document.getElementById("holder-account-info").innerHTML = "";
                accountName = gUserInfo.accountName;
                accountNumber = gTrans.listSourceAccounts[index].CUST_AC_NO;
                accountBalance = formatNumberToCurrency(gTrans.listSourceAccounts[index].BALANCE);
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

        //Mãu thụ hưởng
        function initBottomBar (){
            var arrBottom = new Array();
            arrBottom.push(new MenuBottom("BOTTOM_BAR_TEMPLATE_TRANSFER", "icon-template"));
            arrBottom.push(new MenuBottom("BOTTOM_BAR_CONTACT", "icon-beneficiaries"));
            arrBottom.push(new MenuBottom("AUTO_BILLING_TAB_LIST", "icon-scheduled-transfers-list"));
            transferParam = new TransferParam(CONSTANTS.get("CMD_TRANSFER_TEMPLATE_TEMPLATE"),'',0);
            contactParam = new ContactParam(CONSTANTS.get("CMD_TYPE_LOOKUP_PAYEE"),CONST_PAYEE_LOCAL_TRANSFER,'TH',true);
            periodParam = new PeriodParam(CONSTANTS.get("CMD_TRANSFER_PERIODIC_MNG_TRANS"),CONST_VAL_PERIODIC_LOCAL[0]);

            navController.initBottomBarWithCallBack("transfer/domestic/transfer-inter-create-scr", arrBottom, "transfer-inter", function (index) {

                switchAction(index);
            });
            // dung de phan biet mau chuyen tien, khi sua mau chuyen tien
            gEdit = 2;
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

        $scope.loadInitData = function () {
            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.templateId = gTrans.templateId;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_DTI_INTERNAL_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true,
                function(data) {
                    var resp = data;
                    if (resp.respCode == 0) {
                        gTrans.listSourceAccounts = resp.respJsonObj.initData;
						gTrans.sendMethod=resp.respJsonObj.initData[0].SENDMETHOD
                        gTrans.limit = resp.respJsonObj.limit;
                        gTrans.sourceAcc = gTrans.listSourceAccounts[0];
                        $scope.initComboTextAccount(0);
						
						var MutiId = ["id.approver", "id.approver1"];
						for (i = 0; i < MutiId.length; i++) {
							var sendMethod = document.getElementById(MutiId[i]);
								if (gTrans.sendMethod == 0) {
									sendMethod.innerHTML  = CONST_STR.get("COM_NOTIFY_0");
								} else if (gTrans.sendMethod == 1) {
									sendMethod.innerHTML  = CONST_STR.get("COM_NOTIFY_1");
								} else if (gTrans.sendMethod == 2) {
									sendMethod.innerHTML  = CONST_STR.get("COM_NOTIFY_2");
								} else if (gTrans.sendMethod == 3) {
									sendMethod.innerHTML  = CONST_STR.get("COM_NOTIFY_3");
								}
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

        if(gTrans.isBack){
            $scope.amount = gTrans.transInfo.amountTrans;
        }
        $scope.formatNumberToCurrency = function () {
            $scope.amount = formatNumberToCurrency($scope.amount);
        }
		
//         Text area
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
//         end Text area


        // $scope.initTextAreaMessage();


// switch ON/OFF
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
//             end switch ON/OFF

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
            if (currentPage == "transfer/domestic/transfer-inter-create-scr") {
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
            if (currentPage == "transfer/domestic/transfer-inter-create-scr") {
                document.removeEventListener("evtSelectionDialogClose", handleShowInputClose, false);
                document.removeEventListener("evtSelectionDialog", handleShowInput, false);
            }
        }
		//end phi dich vu

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
		//end chon ngan hang


		//hyperlink
        $scope.clickLinkTax = function(){
            navController.pushToView("payment_service/create/tax/pay_tax_create", true, 'html');
        }


//  send json request
        $scope.sendJSONRequest = function(){
            var data = {};
            gTrans.transInfo.sourceAcc = gTrans.sourceAcc.CUST_AC_NO;
            gTrans.transInfo.balance = gTrans.sourceAcc.BALANCE;
            gTrans.transInfo.destinationAcc = document.getElementById("trans.destaccountnointer").value;
            gTrans.transInfo.destaccountname = document.getElementById("trans.destaccountname").value;
            gTrans.transInfo.amountTrans = document.getElementById("trans.amount").value;
            gTrans.transInfo.contentTrans= document.getElementById("trans.content").value;
            var sampleName = document.getElementById("id.sample.name").value;
            var branchName = document.getElementById('trans.branchName').value;
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

            // luu vet gia tri gui di
//            gTrans.sourceAccDTI = sourceAccVal;
//            gTrans.sourceAccBal = document.getElementById("trans.sourceaccoutbalance").innerHTML;
            // validate data
//            if (sourceAccVal.length != 11) {
//                showAlertText(CONST_STR.get('ERR_INPUT_NO_ACC'));
//                return;
//            }

            if ((gTrans.transInfo.destinationAcc.length < 1) || (gTrans.transInfo.destinationAcc == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER'))) {
                showAlertText(CONST_STR.get('ERR_INPUT_NO_ACC_NUMBER'));
                return;
            }
            if (!checkAvailableChar(gTrans.transInfo.destinationAcc)) {
                showAlertText(CONST_STR.get('ERR_INCORRECT_DESTINATION_ACC'));
                return;
            }

            if (gTrans.transInfo.destaccountname.length < 1) {
                showAlertText(CONST_STR.get('ERR_INPUT_NO_DESTACC_NAME'));
                return;
            }

             if ((gTrans.dti.citadCode == undefined) || (gTrans.dti.citadCode == null)) {
                   showAlertText(CONST_STR.get('ERR_INPUT_NO_BANKCODE'));
                   return;
               }
               // thuatnt cmt
            // if (gTrans.transInfo.amountTrans < 22000) {
            //     showAlertText(CONST_STR.get('ERR_INPUT_TRANS_AMOUNT_WRONG_SMALLER'));
            //     return;
            // }

            gTrans.transInfo.amountTrans = removeSpecialChar(gTrans.transInfo.amountTrans);
            if ((parseInt(gTrans.transInfo.amountTrans) <= 0) || (gTrans.transInfo.amountTrans.length < 1)) {
                showAlertText(CONST_STR.get('ERR_INPUT_NO_AMOUNT'));
                return;
            }

            if (gTrans.transInfo.contentTrans.length < 1) {
                showAlertText(CONST_STR.get('ERR_INPUT_NO_CONTENT'));
                return;
            }

            if (gTrans.transInfo.destaccountname.length > 71) {
                showAlertText(CONST_STR.get('TRANS_ERR_ACC_NAME_BENE'));
                return;
            }

            if(gTrans.transInfo.destaccountname.indexOf('&') >= 0)
            {
                showAlertText(CONST_STR.get('TRANS_ERR_SYMBOL_SPECIAL'));
                return;
            }

            if (gTrans.transInfo.contentTrans.length > 160) {
                showAlertText(CONST_STR.get('TRANS_ERR_INPUT_CONTENT_TRANS'));
                return;
            }

            if(gTrans.dti.manage == 'TP' && sampleName == '')
            {
                showAlertText(CONST_STR.get('TRANS_ERR_NAME_TEMP_TRANS'));
                return;
            }
			
            var request = {};
            request.srcAccount = gTrans.transInfo.sourceAcc;
            request.desAccount = gTrans.transInfo.destinationAcc;
            request.desAccName = gTrans.transInfo.destaccountname.replace(/[!"#$@%&*'\+:;<=>?\\`^~{|}]/g, '');
            request.desBranchCode = gTrans.dti.citadCode;
            request.idDesBank = gTrans.dti.bankCode;
            request.chargeincl = gTrans.dti.feeId;
            request.amount = gTrans.transInfo.amountTrans;
            request.contentTrans = gTrans.transInfo.contentTrans.replace(/[!"#$@%&*'\+:;<=>?\\`^~{|}]/g, '');
			// request.isSavePayee = mng;

            //request.templateName = sampleName;
            request.sequence_id = "2";
            request.idtxn = "T13";
            request.codTrncurr = "VND";

            gTrans.dti.templateName = sampleName;
			gTrans.issavepayee = mng;
			var arrayArgs = [];
           // var jsonRequest = JSON.stringify(request);
            arrayArgs.push("1");
            arrayArgs.push(request);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_DTI_INTERNAL_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
            data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, requestNextSuccess, requstNextFail);
        }

			function requestNextSuccess(response) {

				if (response.respCode === '0'){

					var requestData = {
						idtxn: "T13",
						sequence_id: "3",
						idfcatref: response.respJsonObj[0].IDFCATREF,
						isSaveTemp: gTrans.issavepayee,
						templateName: gTrans.dti.templateName
                    }
                    gTrans.requestData = requestData;
                    gTrans.cmdType =  CONSTANTS.get('CMD_CO_DTI_INTERNAL_TRANSFER');
                    gTrans.transInfo.nameTrans = CONST_STR.get('TRANS_INTER_SCREEN_TITLE');
                    gTrans.transInfo.transferbank = response.respJsonObj[0].DESTBRANCH;
                    gTrans.transInfo.chargeforDom = response.respJsonObj[0].CHARGEFORDOM;
                    gTrans.transInfo.soDuKhaDung = formatNumberToCurrency(response.respJsonObj[0].BALANCE_BEFOR);
                    gTrans.transInfo.sodu = response.respJsonObj[0].BALANCE_END;
                    gTrans.transInfo.transId = response.respJsonObj[0].IDFCATREF;
					gTrans.transInfo.date=response.respJsonObj[0].APPLY_DATE;
					gTrans.transInfo.sendMethod = document.getElementById("id.approver").innerHTML;
                    gTrans.src = "pages/transfer/domestic/transfer-inter-view.html";
                    gTrans.transInfo.accountBalance = formatNumberToCurrency(gTrans.listSourceAccounts[0].BALANCE_BEFOR);
                    gTrans.ortherSrc = "transfer/domestic/transfer-inter-create-scr";
                    navController.pushToView("common/common-review/transfer-review-scr", true, "html");
					
				} else if (response.respCode == '38') {
					showAlertText(CONST_STR.get("CORP_MSG_TRANS_BATCH_BALANCE_NOT_ENOUGH"));
				} else if (response.respCode == '37') {
					showAlertText(CONST_STR.get("CORP_MSG_FEE_GREATER_AMOUNT"));
				} else {
					showAlertText(response.respContent);
				}
			}


			function requstNextFail(){
				showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_INIT_TRANS'));
			}
			
//        zzzzz
        if(flagInter){
            $scope.loadInitData();
            gTrans.dti ={};
        }

        goBack = false;
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])

}

//so tien bang chu
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

// event: change tab
function tabChanged(e) {
    if (currentPage == "transfer/domestic/transfer-inter-create-scr") {
        var node = e.selectedValueTab;
        if (node.id == 'tab1') {
            if (dialog != null && dialog != undefined) {
                gTrans.showDialogCorp = true;
                dialog.activeDataOnTab('tab1');
                dialog.USERID = gCustomerNo;
                dialog.PAYNENAME = "1";
                dialog.TYPETEMPLATE = "0";
                dialog.requestData(node.id);
            }
        } else {
            if (dialog != null && dialog != undefined) {
                gTrans.showDialogCorp = true;
                dialog.activeDataOnTab('tab2');
                dialog.USERID = gCustomerNo;
                dialog.PAYNENAME = "1";
                dialog.TYPETEMPLATE = "1";
                dialog.requestData(node.id);
            }
        }

    }
    gTrans.showDialogCorp = null;
}

// event: click ok button
function okSelected(e) {
    tmpDestinationAcc = "";
    tmpDestinationAccName = "";
    if (currentPage == "transfer/domestic/transfer-inter-create-scr") {
        handleInputPayeeAccClose();
        var destinationAcc = document.getElementById("trans.destaccountnointer");
        if ((e.selectedValue != undefined) && (e.selectedValue != null) && (e.selectedValue.length > 0)) {
            destinationAcc.value = e.selectedValue;
        }
    }
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

function formatAccountText(value) {
    document.getElementById("trans.destaccountnointer").value = keepOnlyNumber(value);
}

function getTransTempInfo(templateType) {
    if (templateType == 'N') {
        return CONST_STR.get("TAX_NO_SAVE_CODE");
    } else if (templateType == 'TH') {
        return CONST_STR.get("COM_SAVE_BENEFICIARY");
    } else if (templateType == 'TP') {
        return CONST_STR.get("COM_SAVE_TEMPLATE_TRANS");
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

function validateBank(){
    for(var i=0;i<arrBank.length;i++){
        if(arrBank[i] == gTrans.dti.bankCode){
            return true;
        }
    }
    return false;
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
	var objtemp=gTrans.newlistTemplate[gTrans.selectedview];
    callbackDocTranfer(objtemp);
}

function callbackDocTranfer(obj) {
    console.log(obj);
    modalDialog.hideDialogFull();

    callbackCloseDialogSchedulerTransfer();
    // double click template tranfer doc

    excuteSampleSelected(obj);
}

function excuteSampleSelected(obj){
    if (currentPage == 'transfer/domestic/transfer-inter-create-scr'){
        var newBalance = 0;
        if(obj != null && obj != undefined){
            for (var i in gTrans.listSourceAccounts){
                if (obj.SOURCE_ACC == gTrans.listSourceAccounts[i].CUST_AC_NO){
                    newBalance = gTrans.listSourceAccounts[i].BALANCE;
                    break;
                }
            }
            comboEl.refresh({
                accountNumber :obj.SOURCE_ACC,
                accountBalance :  formatNumberToCurrency(newBalance)
            });
            gTrans.transInfo.sourceAcc = obj.SOURCE_ACC;
            gTrans.dti.bankCode=obj.BRANCH_CODE;
            gTrans.dti.citadCode=obj.SORTCODE;
            document.getElementById("trans.destaccountnointer").value = obj.BENE_ACCTNO;
            document.getElementById("trans.destaccountname").value = obj.BENE_NAME;
            document.getElementById("trans.branchName").value = obj.BRANCH_NAME;
            document.getElementById("trans.amount").value = formatNumberToCurrency(obj.NUMAMOUNT);
            document.getElementById("trans.content").value = obj.MSG;
            var numamoutVal = obj.NUMAMOUNT;
            var numStr = convertNum2WordWithLang(numamoutVal, gUserInfo.lang);
            var nodeNumTxt = document.getElementById("trans.amounttotext");
            var trowConvert = document.getElementById('row_convert');
            if(numamoutVal>0){
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
    bottomBar.resumeView('transfer/domestic/transfer-inter-create-scr','transfer-inter');
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
    document.getElementById('deleteByBenId').setAttribute("beneid",tempRespArr[index].beneId);
    document.getElementById('tp').style.display = '';
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
    var TaiKhoanNhan = document.getElementById("trans.destaccountnointer");
    var ChuTaiKhoan = document.getElementById("trans.destaccountname");
    var NganHang = document.getElementById("trans.branchName");
	
    TaiKhoanNhan.value = gTrans.newlistContact[tempIndex].BENE_ACCTNO;
    ChuTaiKhoan.value = gTrans.newlistContact[tempIndex].BENE_NAME;
    NganHang.value = gTrans.newlistContact[tempIndex].BRANCH_NAME;
    gTrans.dti.citadCode = gTrans.newlistContact[tempIndex].SORTCODE
    gTrans.dti.bankCode = gTrans.newlistContact[tempIndex].BANK_CODE
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