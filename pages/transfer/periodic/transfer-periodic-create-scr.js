/***
* Edit by HaiNM
* Date: 2/25/2017
***/

var lastClickSwitch;
var transType;
var freq;
var mngPayee;
var moneyBalance;
var sourceAcc;
gTrans.TXN_TYPE = 0;
gTrans.transInfo = {};
flagTransType = false;
var gDisabledLuuMau = false;
var gTransPeriodic;
// var desNum;
var flag = true;
var limit = {};
var comboEl;
var custAccInfo = [];
function viewBackFromOther() {
    viewBack = true;
	document.getElementById('navBottomBar').style.display = 'block';
    flag = false;
    flagTransType = true;
    var trans_amount = document.getElementById('trans.amount');
    if(trans_amount){
        gTrans.transInfo.amount = trans_amount.value;
    }
}
function viewWillUnload() {
    flag = false;
    logInfo('transfer will unload');
    document.removeEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
}

function viewDidLoadSuccess() {
	document.getElementById('save-receiver').getElementsByTagName('input')[0].checked = true;
	if (flag) {
		if (gUserInfo.lang == 'EN') {
		  document.getElementById('trans.type.trans').value = CONST_KEY_PERIODIC_LOCAL_BN_EN[1];
		  document.getElementById('trans.frequency').value = CONST_KEY_PERIODIC_FREQUENCY_EN[0];
		  freq = CONST_KEY_PERIODIC_FREQUENCY_VALUE[0];
		//  mngPayee = CONST_VAL_PAYEE_NOT_TEMPLATE[0];
		  transType = 'T14';
		} else {
		  document.getElementById('trans.type.trans').value = CONST_KEY_PERIODIC_LOCAL_BN_VN[1];
		  document.getElementById('trans.frequency').value = CONST_KEY_PERIODIC_FREQUENCY_VN[0];
		  freq = CONST_KEY_PERIODIC_FREQUENCY_VALUE[0];
		//  mngPayee = CONST_VAL_PAYEE_NOT_TEMPLATE[0];
		  transType = 'T14';
		  console.log("transType", transType);
		}  
    }
	
    if(!flagTransType){
        if (transType == 'T14') {
        var tmpAccNo = document.getElementById('trans.desaccount');
        tmpAccNo.parentNode.setAttribute('onClick', '');
        tmpAccNo.setAttribute('class', 'form-control');
        tmpAccNo.setAttribute('type', 'tel');
        tmpAccNo.value = '';
        document.getElementById('span.trans.target').style.display = '';
        document.getElementById('id.next.icon').style.display = 'none';
        document.getElementById("trans.targetaccountname").innerHTML = "";
        } else {
            // document.getElementById('span.trans.target').style.display = 'none';
            // document.getElementById('id.next.icon').style.display = '';
            // var tmpAccNo = document.getElementById('trans.desaccount');
            // tmpAccNo.setAttribute('class', 'form-control form-control-righttext');
            // tmpAccNo.parentNode.setAttribute('onClick', 'showAccOfCustomer();');
            // tmpAccNo.setAttribute('type', 'button');
            // var desAccNo = document.getElementById("trans.desaccount");
            // var sourceAccNo = document.getElementById('id.accountno');
            // desAccNo.value = CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER');
            // document.getElementById("trans.targetaccountname").innerHTML = "";
        }
    }
	init();
    if (gTrans.transInfo.amount != undefined) {
        document.getElementById('trans.amount').value = gTrans.transInfo.amount;
    }
    setInputOnlyNumber('trans.desaccount',CONST_STR.get("ERR_INPUT_ONLY_NUMBER"));
    setInputOnlyASCIILNH('trans.content', CONST_STR.get("ERR_INPUT_ONLY_ASCII_CHAR"));
};

function init(){
    angular.module("EbankApp").controller('transfer-periodic',  function ($scope, requestMBServiceCorp) {
        initBottomBar();
		
        gTrans.idtxn = transType;
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
            if (currentPage == "transfer/periodic/transfer-periodic-create-scr") {
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
            if (currentPage == "transfer/periodic/transfer-periodic-create-scr") {
                document.removeEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            }
        }
		
        $scope.loadInitData = function () {
            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.templateId = gTrans.templateId;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_ISI_FUNDS_PERIODIC_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true,
                function(data) {
                    var resp = data;
                    if (resp.respCode == 0) {
                        gTrans.sendMethod = resp.respJsonObj.getSendMethod;
                        gTrans.listSourceAccounts = resp.respJsonObj.listAccount;
                        gTrans.limit = resp.respJsonObj.limit;
                        gTrans.sourceAcc = gTrans.listSourceAccounts[0];
                        $scope.initComboTextAccount(0);
						
						var MutiId = ["id.notifyTo", "id.notifyTo1"];
						for (i = 0; i < MutiId.length; i++) {
							var sendMethod = document.getElementById(MutiId[i]);
							sendMethod.innerHTML = CONST_STR.get("COM_NOTIFY_" + gTrans.sendMethod);
						}
                    }
                },
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                    gotoHomePage();
                }
            );
        }

		//Chuyen sang trang quan ly
        $scope.showmngpage = function(){
			setTitleBar(CONST_STR.get('MENU_PERIODIC_TRANS'));
			navController.pushToView('transfer/periodic/transfer-periodic-mng-scr', true, 'html');
		}
		
		// Show tần suất
		//function showInputFrequency() {
		$scope.showInputFrequency = function(){
			var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_KEY_PERIODIC_FREQUENCY_EN : CONST_KEY_PERIODIC_FREQUENCY_VN;
			var tmpArray2 = CONST_KEY_PERIODIC_FREQUENCY_VALUE;

			var handleInputFrequency = function(e) {
				if (currentPage == "transfer/periodic/transfer-periodic-create-scr") {
					handleInputFrequencyClose();
					//document.removeEventListener("evtSelectionDialog", handleInputFrequency, false);
					var frequency = document.getElementById('trans.frequency');
					if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
						if (frequency.nodeName == "INPUT") {
							frequency.value = e.selectedValue1;
						} else {
							frequency.innerHTML = e.selectedValue1;
						}
					}
					if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
						freq = e.selectedValue2;
					}
				}
			}

			var handleInputFrequencyClose = function() {
				if (currentPage == "transfer/periodic/transfer-periodic-create-scr") {
					document.removeEventListener("evtSelectionDialogClose", handleInputFrequencyClose, false);
					document.removeEventListener("evtSelectionDialog", handleInputFrequency, false);
				}
			}

			document.addEventListener("evtSelectionDialog", handleInputFrequency, false);
			document.addEventListener("evtSelectionDialogClose", handleInputFrequencyClose, false);
			showDialogList(CONST_STR.get('TRANS_PERIODIC_DIALOG_TITLE_FREQUENCY'), tmpArray1, tmpArray2, false);
		}
		
        //Action when click continue
        $scope.sendJSONRequest = function(){

            gTrans.transInfo.editTemp = {};
            gTrans.transInfo.sequence_id = "2";
            gTrans.transInfo.idtxn = transType;
            gTrans.transInfo.srcAcc = gTrans.sourceAcc.account;
            gTrans.transInfo.AmountSrcAcc = gTrans.sourceAcc.balance;
            gTrans.transInfo.typeTrans = transType;
            gTrans.transInfo.desAcc = document.getElementById("trans.desaccount").value;
            gTrans.transInfo.amount = removeSpecialChar(document.getElementById("trans.amount").value);
            gTrans.transInfo.content = document.getElementById("trans.content").value.replace(/[!"#$@%&*'\+:;<=>?\\`^~{|}]/g, '');
            gTrans.transInfo.frequency = freq;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                gTrans.transInfo.startDate = document.getElementById("trans.begindate").value;
                gTrans.transInfo.endDate = document.getElementById("trans.enddate").value;
            }else{
                gTrans.transInfo.startDate = document.getElementById("trans.begindatemb").value;
                gTrans.transInfo.endDate = document.getElementById("trans.enddatemb").value;
            }
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
            gTrans.transInfo.payee = mng;
            gTrans.transInfo.beneName = document.getElementById("trans.targetaccountname").innerHTML;
            gTrans.transInfo.sendMethod = document.getElementById("id.notifyTo").innerHTML;

			var sample_Name = document.getElementById("id.sample.name").value;
            if (transType == '' || transType == undefined) {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("TRANSFER_REMITTANCE_SELECT_TYPE")]));
                return;
            };

			// if (sourceAcc == '' || sourceAcc == undefined) {
				// showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("TRANS_BATCH_ACC_LABEL")]));
				// return;
			// };

            var desNum = document.getElementById("trans.desaccount").value;
            if(desNum == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')){
                showAlertText(CONST_STR.get("TRANS_PERIODIC_ERR_INPUT_ACCOUNT"));
                return;
            }
            if (desNum == '' || desNum == undefined) {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("ACCOUNT_FINALIZE_DTL_GOAL_ACC")]));
                return;
            };

            var amount = removeSpecialChar(document.getElementById("trans.amount").value);
            console.log("amount", amount);
            if (amount == '' || amount == undefined) {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("COM_AMOUNT")]));
                return;
            };

            if(parseInt(removeSpecialChar(gTrans.sourceAcc.balance)) < parseInt(amount)){
                showAlertText(CONST_STR.get("CARD_ISSUANCE_BALANCE_LESS"));
                return;
            }
            //check han muc
            if (transType == 'T14') {
                if (parseInt(amount) > parseInt(gTrans.limit.limitTime)) {
                    showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_LIMIT_EXCEEDED_TIME"), [formatNumberToCurrency(gTrans.limit.limitTime)]));
                    return;
                }

                if ((parseInt(amount) + parseInt(gTrans.limit.totalDay)) > parseInt(gTrans.limit.limitDay)) {
                    showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_LIMIT_EXCEEDED_DAY"), [formatNumberToCurrency(gTrans.limit.limitDay)]));
                    return;
                }
            };

            var content = document.getElementById("trans.content").value;
            if (content == '' || content == undefined) {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("COM_ERROR_DESC")]));
                return;
            };

            var startDate;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                startDate = document.getElementById("trans.begindate").value;
            }else{
                startDate = document.getElementById("trans.begindatemb").value;
            }
            if (startDate == '' || startDate == undefined) {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("TRANS_PERIODIC_BEGINNING_DATE")]));
                return;
            };

            var endDate;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                endDate = document.getElementById("trans.enddate").value;
            }else{
                endDate = document.getElementById("trans.enddatemb").value;
            }
            if (endDate == '' || endDate == undefined) {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("TRANS_PERIODIC_ENDING_DATE")]));
                return;
            };

            var srcAcc = document.getElementById("id.accountno").value;
            if (srcAcc == desNum) {
                showAlertText(CONST_STR.get("CORP_MSG_ERROR_SRC_DES_SAME"));
                return;
            };

            if (desNum.length != 11) {
                showAlertText(CONST_STR.get('ERR_INPUT_FORMAT_ACC'));
                return;
            }

            if (document.getElementById("trans.targetaccountname").innerHTML == "") {
                showAlertText(CONST_STR.get('ERR_INPUT_FORMAT_DES_ACC'));
                return;
            };

            // kiem tra tai khoan
            var tempDes = desNum.substr(0, 8);
            var tempSrc = srcAcc.substr(0, 8);

            if (transType == 'T15') {
//                if (tempDes != tempSrc || (desNum == srcAcc)) {
                if (gTrans.sourceAcc.account == gTrans.accOfCustomer) {
                    showAlertText(CONST_STR.get('TRANSFER_ERROR_EQUAL_MSG'));
                    return;
                }
            } else if (transType == 'T14') {
                if (tempDes == tempSrc) {
                    showAlertText(CONST_STR.get('TRANS_PERIODIC_DES_ACC_NOT_VALID'));
                    return;
                }
            }

            var currentDate = new Date();
            var strCurrentDate = ('0' + (currentDate.getDate())) + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();

            if (calculateDifferentMonth(startDate, endDate)) {
                showAlertText(CONST_STR.get("TRANS_PERIODIC_END_DATE_LESS_TO_DATE"));
                return;
            }
            if (!calculateDifferentMonth(endDate, strCurrentDate)) {
                showAlertText(CONST_STR.get("TRANS_PERIODIC_COMPARE_DATE"));
                return;
            }
            if (!calculateDifferentMonth(startDate, strCurrentDate)) {
                showAlertText(CONST_STR.get("TRANS_PERIODIC_COMPARE_DATE"));
                return;
            }

            var request= gTrans.transInfo;

            var args = [];

            args.push("2");
            args.push(request);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_ISI_FUNDS_PERIODIC_TRANSFER'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            //Action when request init trans success
            requestMBServiceCorp.post(data, true,function(response){

                if(response.respCode == '0'){

                    var requestData = {

                        // sequence_id: 3,
                       // idFcatref: response.respJsonObj,
                        // idtxn: 'T15',
                        // payee: 'N'
						sequence_id: "3",
						idFcatref: response.respJsonObj,
						idtxn: transType,
						payee: gTrans.transInfo.payee,
					//	sampleName: sample_Name
                    }
                    gTrans.requestData = requestData;
                    gTrans.cmdType =  CONSTANTS.get('CMD_CO_ISI_FUNDS_PERIODIC_TRANSFER');
                    gTrans.transInfo.accountBalance = formatNumberToCurrency(gTrans.listSourceAccounts[0].balance);
                    gTrans.transInfo.transname = document.getElementById('trans.type.trans').value;
                    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                        gTrans.transInfo.begindate = document.getElementById("trans.begindate").value;
                        gTrans.transInfo.enddate = document.getElementById("trans.enddate").value;
                    }else{
                        gTrans.transInfo.begindate = document.getElementById("trans.begindatemb").value;
                        gTrans.transInfo.enddate = document.getElementById("trans.enddatemb").value;
                    }
                    gTrans.transInfo.frequency = document.getElementById("trans.frequency").value;
                    gTrans.transInfo.msgApprover = gTrans.transInfo.sendMethod;
                    gTrans.transInfo.transId = response.respJsonObj;
                    gTrans.src = "pages/transfer/periodic/transfer-periodic-view.html";
                    gTrans.ortherSrc = "transfer/periodic/transfer-periodic-create-scr";
                    navController.pushToView("common/common-review/transfer-review-scr", true, "html");
                }

			});
		}
		
		function calculateDifferentMonth(valFromDate, valToDate) {
			var from = valFromDate.split("/");
			var to = valToDate.split("/");
			var fromDate = new Date(parseInt(from[2], 10), parseInt(from[1], 10) - 1, parseInt(from[0], 10));
			var toDate = new Date(parseInt(to[2], 10), parseInt(to[1], 10) - 1, parseInt(to[0], 10));

			if (fromDate > toDate) {
				return true;
			}
			return false;
		}

        //switch ON/OFF
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
		
        function initBottomBar(){
            var arrBottom = new Array();
            // arrBottom.push(new MenuBottom("BOTTOM_BAR_TEMPLATE_TRANSFER", "icon-template"));
            arrBottom.push(new MenuBottom("BOTTOM_BAR_CONTACT", "icon-beneficiaries"));
            arrBottom.push(new MenuBottom("AUTO_BILLING_TAB_LIST", "icon-scheduled-transfers-list"));
            transferParam = new TransferParam(CONSTANTS.get("CMD_TRANSFER_TEMPLATE_TEMPLATE"),'',0);
            contactParam = new ContactParam(CONSTANTS.get("CMD_TYPE_LOOKUP_PAYEE"),CONST_PAYEE_LOCAL_TRANSFER,'TH',true);
            periodParam = new PeriodParam(CONSTANTS.get("CMD_TRANSFER_PERIODIC_MNG_TRANS"),CONST_VAL_PERIODIC_LOCAL[0]);

            navController.initBottomBarWithCallBack("transfer/periodic/transfer-periodic-create-scr", arrBottom, "transfer-periodic", function (index) {
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
                //case "0":
                    // template mau chuyen tien
                    // document.addEventListener('evtChangeWidthMobile',temptranferlocalbank,false);
                    // document.addEventListener('evtChangeWidthDesktop',temptranferlocalbank,false);
                    // initDialog(CONST_STR.get('BOTTOM_BAR_TEMPLATE_TRANSFER'),"","transfer/template-transfer/template-transfer-doc",
                        // function callbackDialogClose(){
                            // callbackCloseDialogSchedulerTransfer();
                            // document.addEventListener('evtChangeWidthMobile',temptranferlocalbank,false);
                            // document.addEventListener('evtChangeWidthDesktop',temptranferlocalbank,false);
                        // },
                        // function callbackDialogLoadSuccess(){

                            // modalDialog.showDialogFull();
                            // actionbar.hideActionbar();
                            // bottomBar.hide();
                        // },true,callbackDocTranfer);
                    // break;
                case "0":
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
                case "1":
                    updateAccountListInfo();
                    navCachedPages['common/com_list_user_approve'] = null;
                    navController.pushToView("common/com_list_user_approve", true, 'html');
                    break;
                case "2":
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
//        $scope.initBottomBar();
        if (flag) {
            $scope.loadInitData();
        }
    if (gTransPeriodic) {
        if (gUserInfo.lang == 'EN') {
          document.getElementById('trans.type.trans').value = CONST_KEY_PERIODIC_LOCAL_BN_EN[1];
          document.getElementById('trans.frequency').value = CONST_KEY_PERIODIC_FREQUENCY_EN[0];
          freq = CONST_KEY_PERIODIC_FREQUENCY_VALUE[0];
        //  mngPayee = CONST_VAL_PAYEE_NOT_TEMPLATE[0];
          transType = 'T14';
        } else {
          document.getElementById('trans.type.trans').value = CONST_KEY_PERIODIC_LOCAL_BN_VN[1];
          document.getElementById('trans.frequency').value = CONST_KEY_PERIODIC_FREQUENCY_VN[0];
          freq = CONST_KEY_PERIODIC_FREQUENCY_VALUE[0];
        //  mngPayee = CONST_VAL_PAYEE_NOT_TEMPLATE[0];
          transType = 'T14';
          console.log("transType", transType);
        }  
        $scope.loadInitData();
    }
        // $scope.initTextAreaMessage();
    });
    // Start app
    angular.bootstrap(document.getElementById("mainViewContent"),["EbankApp"]);
}

//Loai tài khoản nhận tiền
function showInputTransferTypeAccount() {
    var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_KEY_PERIODIC_CREATE_EN : CONST_KEY_PERIODIC_CREATE_VN;
    var tmpArray2 = CONST_KEY_PERIODIC_CREATE_KEY;
    var handleInputTransferTypeAccount = function(e) {
        if (currentPage == "transfer/periodic/transfer-periodic-create-scr") {
            document.removeEventListener("evtSelectionDialog", handleInputTransferTypeAccount, false);
            handleInputTransferTypeAccountClose();
            if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                var desAcc = document.getElementById('trans.type.trans');
                if (desAcc.nodeName == "INPUT") {
                    desAcc.value = e.selectedValue1;
                } else {
                    desAcc.innerHTML = e.selectedValue1;
                }

            }
            if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                var desAccNoVal = document.getElementById('id.value.trans.type.trans');
                transType = e.selectedValue2;

                if (transType == 'T14') {
                    var tmpAccNo = document.getElementById('trans.desaccount');
                    tmpAccNo.parentNode.setAttribute('onClick', '');
                    tmpAccNo.setAttribute('class', 'form-control');
                    tmpAccNo.setAttribute('type', 'tel');
                    tmpAccNo.value = '';
                    document.getElementById('span.trans.target').style.display = '';
                    document.getElementById('id.next.icon').style.display = 'none';
                    document.getElementById("trans.targetaccountname").innerHTML = "";

                } else {
                    document.getElementById('span.trans.target').style.display = 'none';
                    document.getElementById('id.next.icon').style.display = '';
                    var tmpAccNo = document.getElementById('trans.desaccount');
                    tmpAccNo.setAttribute('class', 'form-control form-control-righttext');
                    tmpAccNo.parentNode.setAttribute('onClick', 'showAccOfCustomer();');
                    tmpAccNo.setAttribute('type', 'button');
                    var desAccNo = document.getElementById("trans.desaccount");
                    var sourceAccNo = document.getElementById('id.accountno');
                    desAccNo.value = CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER');
                    document.getElementById("trans.targetaccountname").innerHTML = "";
                }

                if (desAccNoVal.nodeName == "INPUT") {
                    transType = e.selectedValue2;
                } else {
                    desAccNoVal.innerHTML = e.selectedValue2;
                }
            }
        }
    }

    var handleInputTransferTypeAccountClose = function() {
        if (currentPage == "transfer/periodic/transfer-periodic-create-scr") {
            document.removeEventListener("evtSelectionDialog", handleInputTransferTypeAccount, false);
            document.removeEventListener("evtSelectionDialogClose", handleInputTransferTypeAccountClose, false);
        }
    }

    document.addEventListener("evtSelectionDialog", handleInputTransferTypeAccount, false);
    document.addEventListener("evtSelectionDialogClose", handleInputTransferTypeAccountClose, false);
    showDialogList(CONST_STR.get('TRANSFER_REMITTANCE_SELECT_TYPE'), tmpArray1, tmpArray2, false);
}

// function viewLocalAcc(e,index){
//     document.getElementById('accNo').style.display = '';
//     document.getElementById('accNumberContact').innerHTML =  tempRespArr[index].transValue;
//     document.getElementById('accNameContact').innerHTML =  tempRespArr[index].peopleName;
//     document.getElementById('accPartnerName').innerHTML = tempRespArr[index].partnerName;
//     document.getElementById('deleteByBenId').setAttribute("beneid",tempRespArr[index].beneId);
//     document.getElementById('deleteSelection').style.display = '';
//     resetActive();
//     e.style.backgroundColor = '#FF8C29';
//     e.style.color = '#fff';
//     tempIndex = index;
// }

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
        if (currentPage == "transfer/periodic/transfer-periodic-create-scr") {
            if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                var desAccountNo = document.getElementById("trans.desaccount");
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
        if (currentPage == "transfer/periodic/transfer-periodic-create-scr") {
            document.removeEventListener("evtSelectionDialog", handleSelectionAccountOfCustomer, false);
            document.removeEventListener("evtSelectionDialogClose", handleSelectionAccountOfCustomerClose, false);
        }
    }

    document.addEventListener("evtSelectionDialog", handleSelectionAccountOfCustomer, false);
    document.addEventListener("evtSelectionDialogClose", handleSelectionAccountOfCustomerClose, false);
    showDialogList(CONST_STR.get('COM_DIALOG_TITLE_ACCNO_CHOISE'), accOfCus, blcOfCus, true);
}

function showPayeePage() {
    var handleInputPayeeAccOpen = function(e) {
        if (currentPage == "transfer/periodic/transfer-periodic-create-scr") {
            handleInputPayeeAccClose();
            if (e.tabSelected == 'tab1') {
                var destinationAcc = document.getElementById("trans.desaccount");
                var nodeDesAcc = document.getElementById("trans.targetaccountname");
                var obj = e.dataObject;
                destinationAcc.value = obj.customerNo;
                nodeDesAcc.innerHTML = obj.peopleName;
                // nodeDesAcc.style.display = 'block';
                statusAccNoSelect = true;
                //Load name of user
                tmpDestinationAcc = obj.customerNo;
            } else {}
        }
    }

    var handleInputPayeeAccClose = function(e) {
        if (currentPage == "transfer/periodic/transfer-periodic-create-scr") {
            document.removeEventListener("evtSelectionDialogClose", handleInputPayeeAccClose, false);
            document.removeEventListener("evtSelectionDialog", handleInputPayeeAccOpen, false);
            document.removeEventListener("onInputSelected", okSelected, false);
        }
    }

    document.addEventListener("evtSelectionDialogInput", handleInputPayeeAccOpen, false);
    document.addEventListener("evtSelectionDialogCloseInput", handleInputPayeeAccClose, false);
    document.addEventListener("onInputSelected", okSelected, false);
    //Tao dialog

    var callbackShowDialogSuccessed = function(node) {
        dialog.hiddenTab2();
    }

    gTrans.showDialogCorp = true;
    dialog = new DialogListInput(CONST_STR.get('TRANS_LOCAL_DIALOG_TITLE_ACC'), 'TH', CONST_PAYEE_LOCAL_TRANSFER);
    dialog.USERID = gCustomerNo;
    dialog.PAYNENAME = "0";
    dialog.TYPETEMPLATE = "0";
    dialog.showDialog(callbackShowDialogSuccessed, '');
}

//Format currency and pronounce to Vietnamese
function handleInputAmount(e, des) {
    var tmpVale = des.value;
    formatCurrency(e, des);
    var numStr = convertNum2WordWithLang(keepOnlyNumber(tmpVale), gUserInfo.lang);
    var nodeNumTxt = document.getElementById("trans.amounttotext");
    nodeNumTxt.innerHTML = "<div class='txtmoneystyle'>"  + numStr + "</div>";
}

//Chon mau thu huong trong popup
function okSelected(e) {
    tmpDestinationAcc = "";
    tmpDestinationAccName = "";
    if (currentPage == "transfer/periodic/transfer-periodic-create-scr") {
        handleInputPayeeAccClose();
        var destinationAcc = document.getElementById("trans.desaccount");
        if ((e.selectedValue != undefined) && (e.selectedValue != null) && (e.selectedValue.length > 0)) {
            destinationAcc.value = e.selectedValue;
            tmpDestinationAcc = e.selectedValue;
            statusAccNoSelect = true;
            quickSearch(tmpDestinationAcc);
        }
    }
}

//Quan ly nguoi thu huong
function showInputMNG() {
    var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_VAL_PAYEE_NOT_TEMPLATE_EN : CONST_VAL_PAYEE_NOT_TEMPLATE_VN;
    var tmpArray2 = CONST_VAL_PAYEE_NOT_TEMPLATE;

    var handleInputMNG = function(e) {
        if (currentPage == "transfer/periodic/transfer-periodic-create-scr") {
            //document.removeEventListener("evtSelectionDialog", handleInputMNG, false);
            handleInputMNGClose();
            if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                var mnglist = document.getElementById('mng.payee');
                if (mnglist.nodeName == "INPUT") {
                    mnglist.value = e.selectedValue1;
                } else {
                    mnglist.innerHTML = e.selectedValue1;
                }

            }

            if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                mngPayee = e.selectedValue2;
            }

        }
    }

    var handleInputMNGClose = function() {
        if (currentPage == "transfer/periodic/transfer-periodic-create-scr") {
            document.removeEventListener("evtSelectionDialogClose", handleInputMNGClose, false);
            document.removeEventListener("evtSelectionDialog", handleInputMNG, false);
        }
    }

    document.addEventListener("evtSelectionDialog", handleInputMNG, false);
    document.addEventListener("evtSelectionDialogClose", handleInputMNGClose, false);
    showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
}

function loadInfoFromIdAccount() {
    var userId = document.getElementById("trans.desaccount").value;
    var jsonData = new Object();
    jsonData.sequence_id = "3";
    jsonData.idtxn = 'T12';
    jsonData.accountId = userId;
    gTrans.accOfCustomer = userId;
    var args = new Array();
    args.push(null);
    args.push(jsonData);
    var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_IIT_FUNDS_LOCAL_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
    var data = getDataFromGprsCmd(gprsCmd);
    requestMBServiceCorp(data, true, 0,
        function(data) {
            var resp = JSON.parse(data);
            if (resp.respCode == 0 && resp.respJsonObj.length > 0) {
                if (resp.respJsonObj[0].GHI_CO == 'N') {
                    document.getElementById("trans.targetaccountname").innerHTML = resp.respJsonObj[0].TEN_TK;
                    if (gTrans.transType == "T14") {
                        gTrans.accName = resp.respJsonObj[0].TEN_TK;

                    }
                };
            } else
                document.getElementById("trans.targetaccountname").innerHTML = "";
        },
        function() {
            document.getElementById("trans.targetaccountname").innerHTML = "";
        }
    );
}

function controlInputText(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccent(field.value);
        field.value = field.value.replace(/[!"#$@%&*'\+:;<=>?\\`^~{|}]/g, '');
    }
}

function handleInputAmount(e, des){
    var hientien = document.getElementById("trans.textamount");
    formatCurrency(e, des);
    var number = convertNum2WordWithLang(removeSpecialChar(des.value), gUserInfo.lang);//Lay ra chuoi doc so tien
    if(number){
        var nodeNumTxt = document.getElementById("trans.amounttotext");
        nodeNumTxt.innerHTML = "<div class='txtmoneystyle'>" + number + "</div>";
        hientien.style.display = "";
    }else{
        hientien.style.display = 'none';
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
    bottomBar.resumeView('transfer/periodic/transfer-periodic-create-scr','transfer-periodic');
    actionbar.showActionBar();
    document.removeEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthMobile',temptranferlocalbank,false);
    document.removeEventListener('evtChangeWidthDesktop',temptranferlocalbank,false);
}


function temptranferlocalbank(){
    var objtemp = {};
    objtemp['tai_khoan_nguon']= document.getElementById('accSource').innerHTML;
    objtemp['ngan_hang_nhan'] = document.getElementById('ngan-hang-nhan').innerHTML;
    objtemp['noi_dung'] = document.getElementById('noi-dung').innerHTML;
    objtemp['so_tien'] = document.getElementById('so-tien').innerHTML ;
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

function excuteSampleSelected(obj){
    if (currentPage == 'transfer/domestic/transfer-periodic-create-scr'){

            gTrans.sourceAcc.account = obj.tai_khoan_nguon;
            gTrans.sourceAcc.balance = newBalance;
            document.getElementById("trans.targetaccount").value = obj.tai_khoan_dich;
            document.getElementById("trans.accountName").value = obj.ten_tai_khoan_dich;
            document.getElementById("trans.amount").value = obj.so_tien;
            document.getElementById("trans.content").value = obj.noi_dung;

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
    var destinationAcc = document.getElementById("trans.desaccount");

    if (obj.transValue != ""){
        destinationAcc.value = obj.transValue;
        var transferAccount = document.getElementById("trans.targetaccountname");
        transferAccount.value = obj.peopleName;
    }
    transferAccount.innerHTML = obj.peopleName;

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