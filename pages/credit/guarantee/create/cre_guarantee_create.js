/**
 * Created by HaiDT1 on 7/20/2016.
 */

gTrans.isBack = false;
gTrans.idtxn = 'B14';
gTrans.infoGuarantee = {};
flag = 0;

function viewDidLoadSuccess() {
    if(gTrans.infoOfferor != undefined){
        if(gTrans.infoOfferor.CUSTOMER_NAME1 != undefined || gTrans.infoOfferor.ADDRESS != undefined || gTrans.sendMethod != undefined){
            document.getElementById('id.gua.sendMethod.value').value = gTrans.sendMethod;
            document.getElementById("id.gua.sendMethod").value = CONST_STR.get("COM_NOTIFY_" + gTrans.sendMethod);
            document.getElementById('id.gua.named.offeror').value = gTrans.infoOfferor.CUSTOMER_NAME1;
            document.getElementById('id.gua.named.offeror.address').value = gTrans.infoOfferor.ADDRESS;
        }
    }
    init();
    setInputOnlyASCIILNH('trans.content', CONST_STR.get("ERR_INPUT_ONLY_ASCII_CHAR"));
    navController.getBottomBar().show();
//    document.getElementById('id.gua.named.offeror').value = gTrans.infoOfferor.CUSTOMER_NAME1;
//    document.getElementById('id.gua.named.offeror.address').value = gTrans.infoOfferor.ADDRESS;
}

function init() {
    angular.module("EbankApp").controller('cre_guarantee_create', function ($scope, requestMBServiceCorp) {
        (gUserInfo.lang == 'VN') ? document.getElementById('id.gua.release.forms').value = CONST_RELEASE_FORMS_OF_GUARANTEE_VN[0] : document.getElementById('id.gua.release.forms').value = CONST_RELEASE_FORMS_OF_GUARANTEE_EN[0];
        document.getElementById('id.gua.release.forms.value').value = CONST_RELEASE_FORMS_OF_GUARANTEE_KEY[0];

        (gUserInfo.lang == 'VN') ? document.getElementById('id.gua.transtype').value = CONST_GUARANTEE_TRANS_TYPE_VN[0] : document.getElementById('id.gua.transtype').value = CONST_GUARANTEE_TRANS_TYPE_EN[0];
        document.getElementById('id.gua.transtype.value').value = CONST_GUARANTEE_TRANS_TYPE_KEY[0];

        // createDatePicker('fromDate', 'fromDate');
        // createDatePicker('toDate', 'toDate');

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
        var handleSelectionDialogListClose = function (e) {
            removeEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
        };

        var handleSelectionDialogtList = function (e) {
            removeEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
            switch (flag) {
                case 0:
                    document.getElementById('id.gua.transtype').value = e.selectedValue1;
                    document.getElementById('id.gua.transtype.value').value = e.selectedValue2;
                    break;
                case 1:
                    for (var i in gTrans.listSourceAccounts) {
                        if (e.selectedValue1 === gTrans.listSourceAccounts[i].CUST_AC_NO) {
                            gTrans.accountSelected = gTrans.listSourceAccounts[i];
                        }
                    }
                    document.getElementById('id.gua.sourceAccount').value = e.selectedValue1;
                    document.getElementById('id.gua.sourceAccount.balance').innerHTML = e.selectedValue2;
					if (e.selectedValue1>0){
						document.getElementById('trans.sourceaccoutbalance').style.display = "";
					}
                    break;
                case 2:
                    document.getElementById('id.gua.release.forms').value = e.selectedValue1;
                    document.getElementById('id.gua.release.forms.value').value = e.selectedValue2;
                    break;
                case 3:
                    for (var i in gTrans.marginAccount) {
                        if (e.selectedValue1 === gTrans.marginAccount[i].CUST_AC_NO) {
                            gTrans.marginAccountSelected = gTrans.marginAccount[i];
                        }
                    }
                    document.getElementById('id.gua.margin.account').value = e.selectedValue1;
                    document.getElementById('id.gua.margin.account.balance').innerHTML = e.selectedValue2;
					if (e.selectedValue1>0){
						document.getElementById('trans.marginAccount').style.display = "";
					}
                    break;

            }
        };

        // initBottomBar();
        if (!gTrans.isBack) {
            iniData();
        }


        function initBottomBar (){
            var arrBottom = new Array();
            arrBottom.push(new MenuBottom("TRANS_PERIODIC_TRADE_TITLE", "icon-recents"));
            arrBottom.push(new MenuBottom("TRANS_PERIODIC_MNG_TITLE", "icon-template"));
            // arrBottom.push(new MenuBottom("BOTTOM_BAR_TEMPLATE_TRANSFER", "icon-beneficiaries"));
            // arrBottom.push(new MenuBottom("BOTTOM_BAR_SCHEDULE_TRANSFER", "icon-scheduled-transfers-list"));
            /*holderParam = new ParamHolder(CONSTANTS.get("CMD_TRANSFER_TEMPLATE_TEMPLATE"),'','0',
             CONSTANTS.get("CMD_TYPE_LOOKUP_PAYEE"),CONST_PAYEE_LOCAL_TRANSFER,'TH',true,
             CONSTANTS.get('CMD_TRANSFER_PERIODIC_MNG_TRANS'),CONST_VAL_PERIODIC_LOCAL[0],true);*/
            latestParam = new LatestParam(CONSTANTS.get("CMD_TRANSFER_GET_HIS_TRANSACTION"),gCustomerNo,CONST_PAYEE_LOCAL_TRANSFER);
            transferParam = new TransferParam(CONSTANTS.get("CMD_TRANSFER_TEMPLATE_TEMPLATE"),'',0);
            // contactParam = new ContactParam(CONSTANTS.get("CMD_TYPE_LOOKUP_PAYEE"),CONST_PAYEE_LOCAL_TRANSFER,'TH',true);
            // periodParam = new PeriodParam(CONSTANTS.get("CMD_TRANSFER_PERIODIC_MNG_TRANS"),CONST_VAL_PERIODIC_LOCAL[0]);


            navController.initBottomBarWithCallBack("credit/guarantee/create/cre_guarantee_create", arrBottom, "guarantee-create", function (index) {
                //alert(index);
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
                    break;

                case "1":
                    changeTab();
                    break;
            }
        }


        function iniData() {
            var jsonData = new Object();
            jsonData.sequence_id = '1';
            jsonData.idtxn = gTrans.idtxn;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_GUARANTEE'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, handleGetSuccessData);
        }

        function handleGetSuccessData(response) {
            if (response.respCode === '0') {
                gTrans.listSourceAccounts = response.respJsonObj.listSourceAccounts;
                gTrans.infoOfferor = response.respJsonObj.lst_inf_company[0];
                gTrans.marginAccount = response.respJsonObj.lst_deposit_account;
                gTrans.sendMethod = response.respJsonObj.sendMethod;

                if (typeof gTrans.sendMethod != "undefined" && gTrans.sendMethod != null) {
                    document.getElementById("id.gua.sendMethod").value = CONST_STR.get("COM_NOTIFY_" + gTrans.sendMethod);
                    if (gTrans.sendMethod == 0) {
                        document.getElementById("tr.list-receiver").style.display = "none";
                    }
                }
                document.getElementById('id.gua.sendMethod.value').value = gTrans.sendMethod;
                document.getElementById('id.gua.named.offeror').value = gTrans.infoOfferor.CUSTOMER_NAME1;
                document.getElementById('id.gua.named.offeror.address').value = gTrans.infoOfferor.ADDRESS;
            } else {
                gotoHomePage();
                showAlertText(response.respContent);
            }
        }

        $scope.changeTab = function() {
            navCachedPages['credit/manager_guarantee/manager_guarantee'] = null;
            navController.pushToView('credit/manager_guarantee/manager_guarantee', true, 'html');
        }

        $scope.onContinuteClick = function () {
            sendJSONRequest();
        }

        $scope.showTypeGuarantee = function () {
            flag = 0;
            var cbxGuarantee = [];
            var cbxGuaranteeKey = [];
            if (gUserInfo.lang === 'VN') {
                cbxGuarantee = CONST_GUARANTEE_TRANS_TYPE_VN;
                cbxGuaranteeKey = CONST_GUARANTEE_TRANS_TYPE_KEY;
            } else {
                cbxGuarantee = CONST_GUARANTEE_TRANS_TYPE_EN;
                cbxGuaranteeKey = CONST_GUARANTEE_TRANS_TYPE_KEY;
            }
            addEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
            showDialogList(CONST_STR.get('GUA_GUARANTEE_TRANSFER_TYPE'), cbxGuarantee, cbxGuaranteeKey, false);
        }

        $scope.showSourceAccount = function () {
            flag = 1;
            var list = gTrans.listSourceAccounts;
            var cbxAccount = [];
            var cbxBalance = [];
            for (var i in list) {
                var account = list[i];
                cbxAccount.push(account.CUST_AC_NO);
                if (account.BALANCE == 0) {
                    cbxBalance.push('0 VND');
                } else {
                    cbxBalance.push(CurrencyFormatted(account.BALANCE) + ' VND');
                }
            }
            if (cbxAccount.length != 0) {
                addEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
                showDialogList(CONST_STR.get('TRANS_BATCH_ACC_LABEL'), cbxAccount, cbxBalance, true);
            } else {
                showAlertText(CONST_STR.get("TRANS_INTERNAL_LIST_SRCACC_EMPTY"));
            }
        }

        $scope.showReleasFormOfGuarantee = function () {
            flag = 2;
            var cbxGuarantee = [];
            var cbxGuaranteeKey = [];
            if (gUserInfo.lang === 'VN') {
                cbxGuarantee = CONST_RELEASE_FORMS_OF_GUARANTEE_VN;
                cbxGuaranteeKey = CONST_RELEASE_FORMS_OF_GUARANTEE_KEY;
            } else {
                cbxGuarantee = CONST_RELEASE_FORMS_OF_GUARANTEE_EN;
                cbxGuaranteeKey = CONST_RELEASE_FORMS_OF_GUARANTEE_KEY;
            }
            addEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
            showDialogList(CONST_STR.get('GUA_GUARANTEE_TRANSFER_TYPE'), cbxGuarantee, cbxGuaranteeKey, false);
        }

        $scope.showMarginAccount = function () {
            flag = 3;
            var list = gTrans.marginAccount;
            if(list.length == 0)
            {
                showAlertText(CONST_STR.get("GUA_ESCROW_NOT_AVAILABLE"));
                return;
            }
            var cbxGuarantee = [];
            var cbxGuaranteeKey = [];
            for (var i in list) {
                var marginAccount = list[i];
                cbxGuarantee.push(marginAccount.CUST_AC_NO);
                if (marginAccount.BALANCE == 0) {
                    cbxGuaranteeKey.push('0 ' + marginAccount.CCY);
                } else {
                    cbxGuaranteeKey.push(CurrencyFormatted(marginAccount.BALANCE) + ' ' + marginAccount.CCY);
                }
            }
            addEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
            showDialogList(CONST_STR.get('GUA_GUARANTEE_TRANSFER_TYPE'), cbxGuarantee, cbxGuaranteeKey, true);
        }

        function sendJSONRequest() {
            if(!$scope.checkValue())
                return;
            if(!$scope.checkDateValue())
                return;
            gTrans.infoGuarantee.idtxn = gTrans.idtxn;
            gTrans.infoGuarantee.sourceAcc = gTrans.accountSelected.CUST_AC_NO;
            gTrans.infoGuarantee.balanceAvailable = gTrans.accountSelected.BALANCE;
            gTrans.infoGuarantee.transTypeGuaName = document.getElementById('id.gua.transtype').value;
            gTrans.infoGuarantee.transTypeGua = document.getElementById('id.gua.transtype.value').value;
            gTrans.infoGuarantee.namedOfferorGua = document.getElementById('id.gua.named.offeror').value;
            gTrans.infoGuarantee.namedOfferorGuaAddress = document.getElementById('id.gua.named.offeror.address').value;
            gTrans.infoGuarantee.nameTheGua = document.getElementById('id.name.the.guarantee').value;
            gTrans.infoGuarantee.nameTheGuaAddress = document.getElementById('id.name.the.guarantee.address').value;
            gTrans.infoGuarantee.amountSecurity = removeSpecialChar(document.getElementById('id.amount.security').value);
            gTrans.infoGuarantee.releaseFormsGuaName = document.getElementById('id.gua.release.forms').value;
            gTrans.infoGuarantee.releaseFormsGua = document.getElementById('id.gua.release.forms.value').value;
            gTrans.infoGuarantee.contentGua = document.getElementById('trans.content').value;
            if(gTrans.marginAccountSelected == undefined)
            {
            	gTrans.infoGuarantee.depositAccount = '';
            }else
            {
            	gTrans.infoGuarantee.depositAccount = gTrans.marginAccountSelected.CUST_AC_NO;
            }            
            gTrans.infoGuarantee.depositRatio = document.getElementById('id.gua.deposit.ratio').value;
            gTrans.infoGuarantee.collateralOther = document.getElementById('id.gua.collateral.other').value;
            gTrans.infoGuarantee.sendNotiMethodName = document.getElementById('id.gua.sendMethod').value;
            gTrans.infoGuarantee.sendNotiMethod = document.getElementById('id.gua.sendMethod.value').value;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                gTrans.infoGuarantee.startDate = document.getElementById("fromDate").value;
                gTrans.infoGuarantee.endDate = document.getElementById("toDate").value;
            }else{
                gTrans.infoGuarantee.startDate = document.getElementById("fromDatemb").value;
                gTrans.infoGuarantee.endDate = document.getElementById("toDatemb").value;
            }
            var jsonData = new Object();
            jsonData.sequence_id = "2";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.transInfo = gTrans.infoGuarantee;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_GUARANTEE"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode === '0') {
                    gTrans.infoGuarantee.idfcatref = response.respJsonObj.idfcatref;
                    gTrans.infoGuarantee.documentInfo = response.respJsonObj.doc_info;
                    navCachedPages['credit/guarantee/create/cre_guarantee_checklist']=null;
                    navController.pushToView('credit/guarantee/create/cre_guarantee_checklist', true, 'html');
                }else {
                    showAlertText(response.respContent);
                    gotoHomePage();
                }
            }, function () {

            });

        }

        $scope.checkValue= function () {
            // loại giao dịch
            var transtype  = document.getElementById('id.gua.transtype').value;
            var sourceAccount = document.getElementById('id.gua.sourceAccount').value;
            var transTypeGuaName = document.getElementById('id.gua.transtype').value;
            var namedOfferorGua = document.getElementById('id.gua.named.offeror').value;
            var namedOfferorGuaAddress = document.getElementById('id.gua.named.offeror.address').value;
            var nameTheGua = document.getElementById('id.name.the.guarantee').value;
            var nameTheGuaAddress = document.getElementById('id.name.the.guarantee.address').value;
            var amountSecurity = removeSpecialChar(document.getElementById('id.amount.security').value);
            var releaseFormsGuaName = document.getElementById('id.gua.release.forms').value;
            var releaseFormsGua = document.getElementById('id.gua.release.forms.value').value;
            var contentGua = document.getElementById('trans.content').value;
            var depositRatio = document.getElementById('id.gua.deposit.ratio').value;
            var collateralOther = document.getElementById('id.gua.collateral.other').value;
            var sendNotiMethodName = document.getElementById('id.gua.sendMethod').value;
            var sendNotiMethod = document.getElementById('id.gua.sendMethod.value').value;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
				var startDate = document.getElementById("fromDate").value;
				var endDate = document.getElementById("toDate").value;
            }else{
                var startDate = document.getElementById("fromDatemb").value;
				var endDate = document.getElementById("toDatemb").value;
            }
            if(this.isNullOrEmptyOrUndefined(transtype))
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("CRE_TYPE_GUARANTEE")]));
                return false;
            }
            // tài khoản
            if(this.isNullOrEmptyOrUndefined(sourceAccount))
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("GUA_ACCOUNT")]));
                return false;
            }
            //Tên bên đề nghị
            if(this.isNullOrEmptyOrUndefined(namedOfferorGua))
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("GUA_NAME_OFFEROR")]));
                return false;
            }
            //địa chỉ
            if(this.isNullOrEmptyOrUndefined(namedOfferorGuaAddress))
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("GUA_ADDRESS")]));
                return false;
            }

            //Tên bên nhận bảo lãnh
            if(this.isNullOrEmptyOrUndefined(nameTheGua))
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("GUA_NAME_THE_GUARANTEE")]));
                return false;
            }
            //địa chỉ Tên bên nhận bảo lãnh
            if(this.isNullOrEmptyOrUndefined(nameTheGuaAddress))
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("GUA_ADDRESS_BEN")]));
                return false;
            }

           // Số tiền bảo lãnh
            if(this.isNullOrEmptyOrUndefined(amountSecurity))
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("GUA_AMOUNT_GUARANTEE")]));
                return false;
            }
            // tư ngày
            if(this.isNullOrEmptyOrUndefined(startDate))
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("COM_FROM")]));
                return false;
            }

            // đến ngày
            if(this.isNullOrEmptyOrUndefined(endDate))
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("COM_TO")]));
                return false;
            }
            // Hình thức phát hành bảo lãnh
            if(this.isNullOrEmptyOrUndefined(releaseFormsGuaName))
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("GUA_RELEASE_FORMS_OF_GUARANTEE")]));
                return false;
            }

            //Nội dung bảo lãnh
            if(this.isNullOrEmptyOrUndefined(contentGua))
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("GUA_CONTENT_GUARANTEE")]));
                return false;
            }
            // Tài khoản ký quỹ
            /*
            if(this.isNullOrEmptyOrUndefined(gTrans.marginAccountSelected))
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("GUA_MARGIN_ACCOUNT")]));
                return false;
            }*/
            //   Tỷ lệ ký quỹ(%)
            if(this.isNullOrEmptyOrUndefined(depositRatio))
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("GUA_DEPOSIT_RATIO")]));
                return false;
            }
            //   Tỷ lệ ký quỹ khong vươt quá 100%
            if(parseFloat(depositRatio.replaceAll(',',''))  > 100)
            {
                showAlertText(CONST_STR.get("GUA_ESCROW_NOT_HIGHER_100"));
                return false;
            }

            //  Tài sản đảm bảo khác
            if(this.isNullOrEmptyOrUndefined(collateralOther))
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("GUA_COLLATERAL_OTHER")]));
                return false;
            }

         return true;
        }

        $scope.checkDateValue = function(){
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
				var startDate = document.getElementById("fromDate").value;
				var endDate = document.getElementById("toDate").value;
            }else{
                var startDate = document.getElementById("fromDatemb").value;
				var endDate = document.getElementById("toDatemb").value;
            }
            var currendate = Date.now();
            var startDateValueInt = parseInt(startDate);
            if (startDate == '' || startDate == undefined) {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("COM_FROM")]));
                return false;
            };
            if (endDate == '' || endDate == undefined) {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("COM_TO")]));
                return false;
            };
            var currentDate = new Date();
            var strCurrentDate = ('0' + (currentDate.getDate())) + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();

            if (!this.calculateDifferentMonth(startDate, strCurrentDate)) {
                showAlertText(CONST_STR.get("GUA_FROM_DATE_BIGGER_CURRENT_DATE"));
                return false;
            }

            if (!this.calculateDifferentMonth(endDate, strCurrentDate)) {
                showAlertText(CONST_STR.get("GUA_TO_DATE_BIGGER_CURRENT_DATE"));
                return false;
            }

            if (!this.calculateDifferentMonth(endDate,startDate)) {
                showAlertText(CONST_STR.get("GUA_PERIODIC_END_DATE_LESS_TO_DATE"));
                return false;
            }

            return true;
        }

        $scope.calculateDifferentMonth =function (valFromDate, valToDate) {
            var from = valFromDate.split("/");
            var to = valToDate.split("/");
            var fromDate = new Date(parseInt(from[2], 10), parseInt(from[1], 10) - 1, parseInt(from[0], 10));
            var toDate = new Date(parseInt(to[2], 10), parseInt(to[1], 10) - 1, parseInt(to[0], 10));
            if (fromDate >= toDate) {
                return true;
            }
            return false;
        }


        $scope.isNullOrEmptyOrUndefined = function (value) {

            try
            {
                if(value.toLowerCase() =="chọn" || value.toLowerCase() == "select")
                    return true;
                return !value;
            }
            catch (e){
                return !value;
            }

        }
    $scope.initBottomBar = function (){
        var arrBottom = new Array();
        // arrBottom.push(new MenuBottom("BOTTOM_BAR_RECENTLY", "icon-recents"));
        // arrBottom.push(new MenuBottom("BOTTOM_BAR_TEMPLATE_TRANSFER", "icon-template"));
        // arrBottom.push(new MenuBottom("BOTTOM_BAR_CONTACT", "icon-beneficiaries"));
        arrBottom.push(new MenuBottom("AUTO_BILLING_TAB_LIST", "icon-scheduled-transfers-list"));
        /*holderParam = new ParamHolder(CONSTANTS.get("CMD_TRANSFER_TEMPLATE_TEMPLATE"),'','0',
         CONSTANTS.get("CMD_TYPE_LOOKUP_PAYEE"),CONST_PAYEE_LOCAL_TRANSFER,'TH',true,
         CONSTANTS.get('CMD_TRANSFER_PERIODIC_MNG_TRANS'),CONST_VAL_PERIODIC_LOCAL[0],true);*/
        // latestParam = new LatestParam(CONSTANTS.get("CMD_TRANSFER_GET_HIS_TRANSACTION"),gCustomerNo,CONST_PAYEE_LOCAL_TRANSFER);
        // transferParam = new TransferParam(CONSTANTS.get("CMD_TRANSFER_TEMPLATE_TEMPLATE"),'',0);
        // contactParam = new ContactParam(CONSTANTS.get("CMD_TYPE_LOOKUP_PAYEE"),CONST_PAYEE_LOCAL_TRANSFER,'TH',true);
        periodParam = new PeriodParam(CONSTANTS.get("CMD_TRANSFER_PERIODIC_MNG_TRANS"),CONST_VAL_PERIODIC_LOCAL[0]);


        navController.initBottomBarWithCallBack("credit/guarantee/create/cre_guarantee_create", arrBottom, "cre_guarantee_create", function (index) {
            // updateAccountListInfo();
            navCachedPages['common/com_list_user_approve'] = null;
            navController.pushToView("common/com_list_user_approve", true, 'html');
        });
        // dung de phan biet mau chuyen tien, khi sua mau chuyen tien
        gEdit = 1;
        //
        gHisTypeTranfer = 17;
    }

    $scope.initBottomBar();
    });

    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}

//Format currency and pronounce to Vietnamese
function handleInputAmount(e, des) {
    // var tmpVale = des.value;
    // formatCurrency(e, des);
    // var numStr = convertNum2WordWithLang(keepOnlyNumber(tmpVale), gUserInfo.lang);
    // document.getElementById("trans.amounttotext").innerHTML = numStr;
	
    var trowConvert = document.getElementById('row_convert');
    formatCurrency(e, des);
    var numStr = convertNum2WordWithLang(removeSpecialChar(des.value), gUserInfo.lang);//Lay ra chuoi doc so tien
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

function removeChar(e, des, maxlen) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(des, maxlen);
    }

    var tmpVale = des.value;
    var numStr = keepOnlyNumber(tmpVale);
    des.value = numStr;
}

function removeCharDeposit(e, des) {
    

    var tmpVale = des.value;
    var numStr = keepOnlyNumber(tmpVale.replaceAll(',',''));

    var temNumFloat = new NumberFormat(numStr).toFormatted();
    temNumFloat = parseFloat(temNumFloat);
    if (temNumFloat > 100){
        des.value = 100;
    }else {
        des.value = temNumFloat;
    }
}

function formatDeposit(e,des)
{
	var tmpVal = des.value;
	if(tmpVal != '' && tmpVal != undefined)
	{	
		if(parseFloat(tmpVal) < 100 && tmpVal.indexOf('.') > 0)
		{		
			tmpVal = tmpVal.replaceAll(',','');	
			tmpVal = parseFloat(tmpVal).toFixed(2);
		}			
	}	
	des.value = tmpVal;
}

function formatNumber(e, number, maxlen)
{
    // number = number.toFixed(2) + '';
    x = number.value.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    number.value = x1 + x2;
}
function validate(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
    }
    var valueCurr = evt.currentTarget.value;
    if(theEvent.keyCode ==46 && valueCurr.indexOf('.') > 0) // key is dot
    {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
    }


}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};