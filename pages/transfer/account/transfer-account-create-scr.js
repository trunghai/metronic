/**
 * Created by GiangBM on 12/23/2016.
 */
 
var tempBankArr  = new Array();
var tempBankCodeArr  = new Array();
var lstbankArr = new Array();
var lastClickSwitch;
var gDisabledLuuMau = false;
var conditions = gConditions;
var mng;
var comboEl;
gTrans.flagEditTemplate =  0;

gTrans.redirect = "transfer/account/transfer-account-create-scr";
gTrans.transInfo = {};
gTrans.sourceAcc = {};
gTrans.TXN_TYPE = 4;
gTrans.dti = {};
gTrans.isBack = false;

function viewBackFromOther() {
	gTrans.isBack = true;
}

function viewDidLoadSuccess() {
    resizeMainViewContent();
	
    document.getElementById("trans.fee").value = (gUserInfo.lang == 'EN') ? CONST_KEY_TRANS_FEE_TYPE_EN[0] : CONST_KEY_TRANS_FEE_TYPE_VN[0];
	
	if (!gTrans.isBack) {
		gTrans.idtxn = "T21"; //Default transfer to another
		document.getElementById('save-receiver').getElementsByTagName('input')[0].checked = true;
	}else{
        gTrans.dti.bankCode = gTrans.bankCode;
    }
	gTrans.dti.feeId = "N";
    init();
    actionbar.showStepSequence("com-authentication-scr");
    setInputOnlyASCIILNH('trans.content', CONST_STR.get("ERR_INPUT_ONLY_ASCII_CHAR"));
}

function init(){
    angular.module('EbankApp').controller("transfer-account-create" ,function($scope , requestMBServiceCorp){
        initBottomBar();
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
            if (currentPage == "transfer/account/transfer-account-create-scr") {
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
            if (currentPage == "transfer/account/transfer-account-create-scr") {
                document.removeEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            }
        }

        //end show acc
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
                fontSize : "12px",
                showBorderBottom : false,//set margin to holder of combo
                clickIt : function (){ //handle function click
                    console.log("already click");
                }
            });
            comboEl.show("holder-account-info");
        }

        $scope.loadInitData = function () {
            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;
            var templateId = "";
            if(gTrans.templateId != null && gTrans.templateId != ""){
                templateId = gTrans.templateId
            }
            jsonData.templateId = templateId;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_TRANS_ACCOUNT"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function(response) {
                var resp = response;
                if (response.respCode == 0) {
                    gTrans.sendMethod = resp.respJsonObj.sendMethod;
                    gTrans.listSourceAccounts = resp.respJsonObj.listSourceAccounts;
                    gTrans.limit = resp.respJsonObj.limit;
                    lstbankArr = resp.respJsonObj.lst_bank;
                    genXmlBank();
                    gTrans.sourceAcc = gTrans.listSourceAccounts[0]
                    gTrans.lst_bank = resp.respJsonObj.lst_bank;
                    $scope.initComboTextAccount(0);
					
					var MutiId = ["id.notifyTo", "id.notifyTo1"];
					for (i = 0; i < MutiId.length; i++) {
						var sendMethod = document.getElementById(MutiId[i]);
							sendMethod.innerHTML = CONST_STR.get("COM_NOTIFY_"+gTrans.sendMethod+"");

						// gTrans.transInfo.sendMethod = sendMethod.placeholder;
					}
                }
            }, function(){
                showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                gotoHomePage();
            });
        }

		// showbank
   //      $scope.showBankSelection = function(){
			// document.addEventListener("evtSelectionDialog", handleBankSelection, false);
			// document.addEventListener("evtSelectionDialogClose", handleBankSelectionClose, false);
			// showDialogList(CONST_STR.get('TRANS_BANKS_LIST'), tempBankArr,tempBankCodeArr, false);
   //      }

   //      function handleBankSelection(e){
			// removeEventListenerToCombobox(handleBankSelection, handleBankSelectionClose);
			// if(currentPage == "transfer/account/transfer-account-create-scr"){
			// 	document.removeEventListener("evtSelectionDialog", handleBankSelection, false);
			// 	document.getElementById("trans.branchName").value = e.selectedValue1;
			// 	gTrans.dti.bankName = e.selectedValue1;
			// 	gTrans.dti.bankCode = e.selectedValue2;
			// 	gTrans.transInfo.idDesBank = gTrans.dti.bankCode.replace(",","");
			// }
   //      }

   //      function handleBankSelectionClose(e) {
			// removeEventListenerToCombobox(handleBankSelection, handleBankSelectionClose);
   //      }
        $scope.showBankSelection =function(){
            gTrans.showBank = true;
            navController.pushToView("transfer/account/transfer-account-show-bank", true,'html');
            document.addEventListener("evtSelectionDialog", handleSelectionDialogtList, false);
            document.addEventListener("evtSelectedNation", handleInputNationSelect, false);
            document.addEventListener("evtSelectedNation", handleSelectionDialogListClose, false);
        }

        function handleInputNationSelect(e) {
            gBankCode1 = "";
            gBankName1 = "";
            document.removeEventListener("evtSelectedNation", handleInputNationSelect, false);
            document.getElementById('trans.branchName').value = e.bank_name;
            gTrans.dti.bankName = e.bank_name;
            gBankCode1 = e.bank_code;
            gBankName1 = e.bank_name;
            gTrans.dti.bankCode = e.bank_code;
            gTrans.transInfo.idDesBank = gTrans.dti.bankCode.replace(",","");
        }
        var handleSelectionDialogtList = function (e) {
            document.getElementById('trans.branchName').value = e.bank_name;
            handleSelectionDialogListClose();
        }
        var handleSelectionDialogListClose = function (e) {
            document.removeEventListener("evtSelectionDialog", handleSelectionDialogtList, false);
            document.removeEventListener("evtSelectionDialogClose", handleSelectionDialogListClose, false);
        };
		// end showbank


		// lua chon giao dich
        $scope.showTransTypeSelection =function () {
			var cbxText = (gUserInfo.lang == 'EN')? ['Transfer to card number','Transfer to account number']: ['Chuyển tiền nhanh qua số thẻ','Chuyển tiền nhanh qua số tài khoản'];
			addEventListenerToCombobox(handleSelectTransType, handleCloseTransTypeCbx);
			showDialogList(CONST_STR.get('TRANS_CARD_DIALOG_TITLE_TRANSTYPE'), cbxText, ['T19','T21'], false);
        }

        function handleSelectTransType (e) {
            if (currentPage == "transfer/account/transfer-account-create-scr") {
				removeEventListenerToCombobox(handleSelectTransType, handleCloseTransTypeCbx);
				if(e.selectedValue2 == "T21"){
					gTrans.idtxn = e.selectedValue2;
					document.getElementById("id-trans-local").value = e.selectedValue1;
				}
				if(e.selectedValue2 == "T19"){
                    navArrayScr.pop();
                    clearCachedPageToView('transfer/card/transfer-card-create-scr', true, 'html');
				}	
            }
        }

        function handleCloseTransTypeCbx() {
            if (currentPage == "transfer/account/transfer-account-create-scr") {
				removeEventListenerToCombobox(handleSelectTransType, handleCloseTransTypeCbx);
            }
        }
		
		// phi dich vu
		$scope.showFee= function(){
            listSelection = (gUserInfo.lang == 'EN') ? CONST_KEY_TRANS_FEE_TYPE_EN : CONST_KEY_TRANS_FEE_TYPE_VN;
            listValue = CONST_KEY_TRANS_FEE_TYPE_ID;
            dialogTitle = CONST_STR.get('TRANS_FEE_TYPE_DIALOG_TITLE');
			
            document.addEventListener("evtSelectionDialog", handleShowInput, false);
            document.addEventListener("evtSelectionDialogClose", handleShowInputClose, false);
            showDialogList(dialogTitle, listSelection, listValue, false);
		}

        function handleShowInput(e) {
            if (currentPage == "transfer/account/transfer-account-create-scr") {
                document.removeEventListener("evtSelectionDialog", handleShowInput, false);
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    var inputObj=document.getElementById("trans.fee");
                        gTrans.transInfo.feeType = e.selectedValue1;
						inputObj.value = e.selectedValue1;
                }
                if (e.selectedValue2 != undefined && (e.selectedValue2 != null)) {
                    gTrans.dti.feeId = e.selectedValue2;
                }
            }
        }
		
        function handleShowInputClose(e) {
            if (currentPage == "transfer/account/transfer-account-create-scr") {
                document.removeEventListener("evtSelectionDialogClose", handleShowInputClose, false);
                document.removeEventListener("evtSelectionDialog", handleShowInput, false);
            }
        }
		
		// danh sach ngan hang
        // $scope.showBankName = function(){
        //     var cbxText = [];
        //     var cbxValue = [];
        //     for (var i in gTrans.lst_bank){
        //         cbxText.push(gTrans.lst_bank[i].bank_name);
        //         cbxValue.push(gTrans.lst_bank[i].bank_code);
        //     }

        //     document.addEventListener("evtSelectionDialog", showBankNameOpen, false);
        //     document.addEventListener("evtSelectionDialogClose", showBankNameClose, false);
        //     showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), cbxText, cbxValue, false);
        // }

        // function showBankNameOpen(){
        //     if (currentPage == "transfer/account/transfer-account-create-scr") {
        //         if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
        //             showBankNameClose();
        //         }
        //     }
        // }

        // function showBankNameClose(){
        //     if (currentPage == "transfer/account/transfer-account-create-scr") {
        //         document.removeEventListener("evtSelectionDialog", showBankNameOpen, false);
        //         document.removeEventListener("evtSelectionDialogClose", showBankNameClose, false);
        //     }
        // }
        // SHOW LIST BANK
        function initDialogListBank(){
            initDialog(CONST_STR.get('TRANS_BANKS_LIST'),"","transfer/account/transfer-account-show-bank",callbackCloseListBankTransfer,callbackLoadListBankXlsSuccess,false);
        }

        function callbackCloseListBankTransfer() {
            console.log("click on x in the top");
            bottomBar.resumeView('transfer/account/transfer-account-create-scr','transfer-account');
            actionbar.showActionBar();
        }

        function callbackLoadListBankXlsSuccess() {
            var contentHTML = "";
            contentHTML += '<div class="list-group" style="margin: 15px;">';
            contentHTML += '<table width="100%" align="center" class="background-blacktrans">';


            for(i=0;i<tempBankArr.length;i++) {
                contentHTML += '<tr class="trow-default">';
                contentHTML += '<td style="width:10%">';
                contentHTML += '<div><span class="icon-homepage"></span></div>';
                contentHTML += '</td>';
                contentHTML += '<td style="width:90%" class="td-left-detail">';
                contentHTML += '<div>' +tempBankArr[i]+ '</div>';
                contentHTML += '</td>';
                contentHTML += '</tr>';
            }
            contentHTML += '</table>';
            contentHTML += '</div>';

            var divListView = document.getElementById("divListView");
            divListView.innerHTML = contentHTML;

            modalDialog.showDialogFull();
            document.getElementById('search').style.display = 'none';
        }
        $scope.showBankName = function(){
            actionbar.hideActionbar();
            bottomBar.hide();
            initDialogListBank();

        }

		//noi dung chuyen tien
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
                fontSizeIcon : "24px!important",
                validateInput : function(){
                    console.log("validate function");
                }
            });
            textAreaEl.show("holder-transfer-message");
        }

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

		//tiep tuc
        $scope.sendJSONRequest = function () {
			if (gTrans.transInfo.idDesBank==undefined){
				if (gTrans.dti.bankCode == undefined) {
                    gTrans.dti.bankCode = gBankCode1;
                    gTrans.dti.bankName = gBankName1;
                }
				var branchNamevalue = document.getElementById('trans.branchName').value;
				gTrans.transInfo = {};
				if (gTrans.dti.bankCode=="" || gTrans.dti.bankCode ==undefined || branchNamevalue == "" || branchNamevalue == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')){
					showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), 
							[CONST_STR.get('TRANS_BANK_TITLE_APPLY')]));
					return false;
				}	
				
				gTrans.transInfo.idDesBank = gTrans.dti.bankCode.replace(",","");
			}
			gTrans.transInfo.sourceAcc = gTrans.sourceAcc.account;
			gTrans.transInfo.idtxn = gTrans.idtxn;
			gTrans.transInfo.destinationAcc = document.getElementById("trans.targetaccount").value;		
			gTrans.transInfo.beneName = "";
			gTrans.transInfo.amountTrans = removeSpecialChar(document.getElementById("trans.amount").value);
			gTrans.transInfo.contentTrans = document.getElementById("trans.content").value.replace(/[!"#@$%&'\+:;*\(\)<=>?\\`^~{|}]/g, '');
			
            var checkLuuNguoiNhan  = document.getElementById('save-receiver').getElementsByTagName('input')[0];
            var checkLuuMauChuyenTien = document.getElementById('save-doc-temp-transfer').getElementsByTagName('input')[0];
            if(checkLuuMauChuyenTien.checked && checkLuuNguoiNhan.checked){
                mng = "TC";
            }else if(!checkLuuMauChuyenTien.checked && !checkLuuNguoiNhan.checked){
                mng = CONST_VAL_PAYEE[0];
            }else if(checkLuuMauChuyenTien.checked && !checkLuuNguoiNhan.checked){
                mng = CONST_VAL_PAYEE[2];
            }else if(!checkLuuMauChuyenTien.checked && checkLuuNguoiNhan.checked){
                mng = CONST_VAL_PAYEE[1];
            }
			
            gTrans.transInfo.issavepayee = mng;
            gTrans.transInfo.sampleName = document.getElementById("id.sample.name").value;
			gTrans.transInfo.desBranchCode = "";
			gTrans.transInfo.chargeincl=gTrans.dti.feeId;
			gTrans.transInfo.send_Method = document.getElementById('id.notifyTo').innerHTML;
			//Validate
			if (!validate()) return;

            var jsonData = new Object();
            jsonData.sequence_id = "2";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.transInfo = gTrans.transInfo;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_TRANS_ACCOUNT"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                    if (response.respCode == '0'){

                        var requestData = {
							sequence_id : "3",
							idtxn : gTrans.idtxn,
							transId : response.respJsonObj.returnJson[0].MA_GD,
							issavepayee : response.respJsonObj.issavepayee,
							sampleName : response.respJsonObj.sampleName
                        }

                        gTrans.requestData = requestData;
                        gTrans.cmdType =  CONSTANTS.get('CMD_CO_TRANS_ACCOUNT');
                        gTrans.src = "pages/transfer/account/transfer-account-view.html";
						
                        gTrans.transInfo.beneName = response.respJsonObj.benName;
                        gTrans.transInfo.chargeforDom =  response.respJsonObj.fee;
                        gTrans.transInfo.sodu = gTrans.sourceAcc.balance.replace(/,/gi,"") - gTrans.transInfo.amountTrans - gTrans.transInfo.chargeforDom;
                        gTrans.transInfo.dtcp =  document.getElementById("trans.fee").value;
                        gTrans.transInfo.nganhangnhan = document.getElementById("trans.branchName").value;
                        gTrans.transInfo.accountBalance = formatNumberToCurrency(gTrans.sourceAcc.balance);
                        gTrans.transInfo.transId = response.respJsonObj.returnJson[0].MA_GD;
						gTrans.transInfo.savePayee = CONST_STR.get('TRANS_INTERNAL_SAVE_TEMPLATE_' + gTrans.transInfo.issavepayee);

                        gTrans.ViewBottomBar = true;
						gTrans.ortherSrc = "transfer/account/transfer-account-create-scr";
                        navController.pushToView("common/common-review/transfer-review-scr", true, "html");

					} else if (response.respCode == 39) {
						showAlertText(CONST_STR.get("TRANS_CARD_ERR_INVALID_NUMBER"));
					} else if (response.respCode == 38) {
						showAlertText(CONST_STR.get("CORP_MSG_TRANS_BATCH_BALANCE_NOT_ENOUGH"));
					} else if (response.respCode == 37) {
						showAlertText(CONST_STR.get("CORP_MSG_FEE_GREATER_AMOUNT"));
					} else if (response.respCode == 1) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_01"));
					} else if (response.respCode == 3) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_03"));
					} else if (response.respCode == 5) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_05"));
					} else if (response.respCode == 12) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_12"));
					} else if (response.respCode == 13) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_13"));
					} else if (response.respCode == 14) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_14"));
					} else if (response.respCode == 15) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_15"));
					} else if (response.respCode == 30) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_30"));
					} else if (response.respCode == 32) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_32"));
					} else if (response.respCode == 36) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_36"));
					} else if (response.respCode == 41) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_41"));
					} else if (response.respCode == 51) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_51"));
					} else if (response.respCode == 54) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_54"));
					} else if (response.respCode == 55) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_55"));	
					} else if (response.respCode == 63) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_63"));
					} else if (response.respCode == 67) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_67"));
					} else if (response.respCode == 68) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_68"));
					} else if (response.respCode == 69) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_69"));
					} else if (response.respCode == 90) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_90"));
					} else if (response.respCode == 96) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_96"));
					} else if (response.respCode == 48) {
						showAlertText(CONST_STR.get("TRANFER_ACC_FAST_48"));
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

            navController.initBottomBarWithCallBack("transfer/account/transfer-account-create-scr", arrBottom, "transfer-account", function (index) {

                switchAction(index);
            });
            // dung de phan biet mau chuyen tien, khi sua mau chuyen tien
            gEdit = 6;
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

        $scope.loadInitData();
        $scope.initTextAreaMessage();
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}

function validate(){
	var conditions = gConditions;

	if (gTrans.transInfo.sourceAcc ==undefined){
		showAlertText(CONST_STR.get('ERR_EMPTY_NO_ACC'));
		return false;
	}
	//tai khoan chuyen rong
	if (!validateFunc(gTrans.transInfo.sourceAcc, conditions["account"])) {
		showAlertText(CONST_STR.get('ERR_INPUT_FORMAT_DES_ACC'));
		return false;
	}

	//tai khoan nhan rong
	if (gTrans.transInfo.destinationAcc.trim() == "") {
		showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), 
				[CONST_STR.get('COM_ACCOUNT_DEST')]));
		return false;
	}

	//tai khoan nhan va chuyen trung nhau
	if (gTrans.idtxn == "T21") {
		if (gTrans.transInfo.sourceAcc.substring(0, 8).indexOf(gTrans.transInfo.destinationAcc.substring(0, 8)) != -1) {
			showAlertText(CONST_STR.get('TRANSFER_ERROR_MENU_ACCOUNT_MESSGASE'));
			return;
		}
	}
	
	//so tien rong
	if (!validateFunc(gTrans.transInfo.amountTrans, conditions["amount"])) {
		showAlertText(CONST_STR.get('ERR_INPUT_NO_AMOUNT'));
		return false;
	}

	//so tien khong vuot qua so du
	if (parseInt(removeSpecialChar(document.getElementById('trans.amount').value)) > parseInt(removeSpecialChar(gTrans.sourceAcc.balance))) {
		showAlertText(CONST_STR.get('TOPUP_EXCEED_AVAIL_BALANCE'));
		return false;
	}
	
	// so tien > 50 trieu
	if (parseInt(gTrans.transInfo.amountTrans -  CONST_LIMIT_TRANS_TPBANK_MAX) > 0 ){
		showAlertText(CONST_STR.get('TRANS_CARD_ACC_ERR_EXCEED_50mil'));
		return false;
	}

	//kiểm tra hạn mức lần
	if (parseInt( gTrans.transInfo.amountTrans) > parseInt(gTrans.limit.limitTime)){
		showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_TIME'), [formatNumberToCurrency(gTrans.limit.limitTime)]));
		return false;
	}

	//kiểm tra hạn mức ngày
	if (parseInt(gTrans.limit.totalDay) + parseInt(gTrans.transInfo.amountTrans) > parseInt(gTrans.limit.limitDay)){
		showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_DAY'), [formatNumberToCurrency(gTrans.limit.limitDay)]));
		return false;
	}
	
	//noi dung rong
	if (gTrans.transInfo.contentTrans=="") {
		showAlertText(CONST_STR.get('ERR_INPUT_NO_CONTENT'));
		return false;
	}
		
	//ten mau chuyen tien rong
	if (!gTrans.transInfo.issavepayee || gTrans.transInfo.issavepayee == null || gTrans.transInfo.issavepayee == "") {
		showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), 
				[CONST_STR.get('TRANSFER_REMITTANCE_NAMED')]));
		return false;
	}
	if (gTrans.transInfo.issavepayee == "TP" || gTrans.transInfo.issavepayee == "TC") {
		if (!validateFunc(gTrans.transInfo.sampleName, conditions["sample"])) {
			showAlertText(CONST_STR.get('ERR_INPUT_NO_SAMPLE'));
			return false;
		}
	}

	return true;
}

function validateFunc(inValue, inConditions) {
    if (inConditions == undefined || inConditions == null) return;
    if (typeof(inValue) == 'number') inStr = inValue.toString();
    else var inStr = inValue;
    var tmpValidateObj = inConditions;//inConditions[tmpObj]
    for (var tmpObjProperty in tmpValidateObj) {
        //alert(tmpObjProperty);
        var tmpValue = tmpValidateObj[tmpObjProperty];
        if ((tmpValue == undefined) || (tmpValue.length == 0)) continue;
        switch (tmpObjProperty) {
            case "allow":
            {
                var rex = new RegExp(tmpValue, "gi");
                var tmprex = inStr.match(rex);
                if ((tmprex == undefined) || (tmprex.length < 1)) {
                    console.log('allow');
                    return false;
                }
                break;
            }
            case "notallow":
            {
                var rex = new RegExp(tmpValue, "gi");
                var tmprex = inStr.match(rex);
                if ((tmprex == undefined) || (tmprex.length > 0)) {
                    console.log('not allow');
                    return false;
                }
                break;
            }
            case "minlength":
            {
                if (!(inStr.length > (parseInt(tmpValue) - 1))) {
                    console.log('min length fail');
                    return false;
                }
                break;
            }
            case "maxlength":
            {
                if (!(inStr.length < (parseInt(tmpValue) + 1))) {
                    console.log('max length fail');
                    return false;
                }
                break;
            }
            case "func":
            {
                if (tmpValue != undefined) {
                    console.log('call function');
                    if (typeof(tmpValue) == 'function') {
                        if (!tmpValue()) {
                            console.log('condition extent fail');
                            return false;
                        }
                    }
                    else if (typeof(tmpValue) == 'string' && (typeof(window[tmpValue]) == 'function')) {
                        if (!window[tmpValue]()) {
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
            default:
            {
                console.log('do not match property.');
                return false;
                break;
            }
        }
    }
    return true;
}

/*** VALIDATE FUNCTION END ***/
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
function genXmlBank(){
    var tmpArr;
    for(var i=0;i<lstbankArr.length;i++){
        tempBankArr.push(lstbankArr[i].bank_name);
        tempBankCodeArr.push(lstbankArr[i].bank_code)
    }
}

// function showBankName(){
//     document.addEventListener("evtSelectionDialog", handleBankName, false);
//     showDialogList(CONST_STR.get('TRANS_BANKS_LIST'), tempBankArr, true);
// }

// function handleBankName(){
//     if(currentPage == "transfer/transfer-local-create-scr"){
//         document.removeEventListener("evtSelectionDialog", handleBankName, false);

//     }
// }
// function removeEventListenerToCombobox(selectHandle, closeHandle) {
//     document.removeEventListener("evtSelectionDialog", selectHandle, true);
//     document.removeEventListener("evtSelectionDialogClose", closeHandle, true);
// }

function controlInputText(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccentinfo(field.value);
        field.value = field.value.replace(/[!"#@$%&'\+:;<=>?\\`^~{|}]/g, '');
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
    bottomBar.resumeView('transfer/account/transfer-account-create-scr','transfer-account');
    actionbar.showActionBar();
    document.removeEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthMobile',temptranferlocalbank,false);
    document.removeEventListener('evtChangeWidthDesktop',temptranferlocalbank,false);
}
function callbackContactTranfer(obj) {
    console.log(obj);
    // double click template tranfer contact doc
    modalDialog.hideDialogFull();
    callbackCloseDialogSchedulerTransfer();
    var destinationAcc = document.getElementById("trans.targetaccount");
    var nodeDesAcc = document.getElementById("trans.targetaccountname");

    if (obj.transValue != ""){
        destinationAcc.value = obj.transValue;
        tmpDestinationAccName = obj.peopleName;
        var transferAccount = document.getElementById("trans.accountName");
        transferAccount.value = tmpDestinationAccName;
    }
    //nodeDesAcc.innerHTML = "<h6 class='h6style'>" + CONST_STR.get('TRANS_LOCAL_ACC_DESTINATION_TITLE') + ": <b>" + obj.peopleName + "</b></h6>";

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
    if (currentPage == 'transfer/account/transfer-account-create-scr'){
        var newBalance = 0;
        if(obj != null && obj != undefined){
            for (var i in gTrans.listSourceAccounts){
                if (obj.tai_khoan_nguon == gTrans.listSourceAccounts[i].account){
                    newBalance = gTrans.listSourceAccounts[i].balance;
                    break;
                }
            }
            comboEl.refresh({
                accountNumber :obj.tai_khoan_nguon,
                accountBalance :  formatNumberToCurrency(newBalance)
            });
            //anhntt cmt -- khong can thiet
//            gTrans.OneBank = [];
//            for (var i in gTrans.lst_bank) {
//                if (obj.BANK_CODE == parseInt(gTrans.lst_bank[i].bank_code.replace(",",""))) {
//                    gTrans.OneBank.push(gTrans.lst_bank[i]);
//                    break;
//                }
//            }

//			gTrans.transInfo.idDesBank = gTrans.OneBank[0].bank_code.replace(",","");   //anhntt cmt -- khong can thiet
			gTrans.transInfo.idDesBank = obj.BANK_CODE;
//			gTrans.sourceAcc.account = obj.SOURCE_ACC; //anhntt cmt --> sai luong.
//			document.getElementById('trans.branchName').value = gTrans.OneBank[0].bank_name;  //anhntt cmt -- khong can thiet
			document.getElementById('trans.branchName').value = obj.ngan_hang_nhan;
			document.getElementById("trans.targetaccount").value = obj.BENE_ACCTNO;
			document.getElementById("trans.amount").value = obj.NUMAMOUNT;
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
    bottomBar.resumeView('transfer/account/transfer-account-create-scr','transfer-account');
    actionbar.showActionBar();
    document.removeEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthMobile',temptranferlocalbank,false);
    document.removeEventListener('evtChangeWidthDesktop',temptranferlocalbank,false);
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
    var destinationAcc = document.getElementById("trans.targetaccount");
    var branchName = document.getElementById("trans.branchName");

    if (obj.transValue != ""){
        destinationAcc.value = obj.transValue;
        branchName.value = obj.partnerName;
        gTrans.dti.bankCode = obj.partnerCode;
        gTrans.bankCode = gTrans.dti.bankCode;
        // tmpDestinationAccName = obj.peopleName;
        // var transferAccount = document.getElementById("trans.destaccountname");
        // transferAccount.value = tmpDestinationAccName;
    }
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