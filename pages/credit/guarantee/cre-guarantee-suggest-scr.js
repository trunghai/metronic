/**
 * Created by GiangBM.FSOFT
 * Date: 1/13/2017
 */


var freq;
var gg;
gTrans.isBack = false;
gTrans.transInfo = {};
function viewBackFromOther() {
    gTrans.isBack = true;
}
function viewDidLoadSuccess(){
    if(!gTrans.isBack || (gTrans.isBack && (!checkScreenisMobilePX()))){
        if(gUserInfo.userRole.indexOf('CorpInput') == -1 || (CONST_BROWSER_MODE && checkScreenisMobilePX())) {
            navCachedPages['credit/manager_guarantee/manager-guarantee-suggest'] = null;
            navController.pushToView('credit/manager_guarantee/manager-guarantee-suggest', true, 'html');
        }else{
            init();
        }
    }else{
        if(gUserInfo.userRole.indexOf('CorpInput') == -1 || (CONST_BROWSER_MODE && checkScreenisMobilePX())) {
            navCachedPages['menuxsl/dynamic-menu-scr'] = null;
            navController.popView('menuxsl/dynamic-menu-scr', true, 'html');
        }
    }
}

function init(){
    angular.module("EbankApp").controller("cre-guarantee-suggest-scr", function ($scope, requestMBServiceCorp) {
        $scope.changeTab = function() {
            navCachedPages['credit/manager_guarantee/manager-guarantee-suggest'] = null;
            navController.pushToView('credit/manager_guarantee/manager-guarantee-suggest', true, 'html');
        }

        $scope.loadInitData = function () {
            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn ="C10";
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_GUARANTEE_SUGGEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true,
                function(data) {
                    var resp = data;
                    if (resp.respCode == 0) {
                        gTrans.sendMethod = resp.respJsonObj.sendMethod;
                        gTrans.listSourceAccounts = resp.respJsonObj.listSourceAccounts;
                        gTrans.limit = resp.respJsonObj.limit;
                        gTrans.sourceAcc = resp.respJsonObj.listSourceAccounts[0];
                        document.getElementById('id.accountno').value = gTrans.sourceAcc.account;

                        $scope.initComboTextAccount(0);

                    }
                },
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                    gotoHomePage();
                }
            );
        }
        if(!gTrans.isBack){
            $scope.loadInitData();
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
                idTextArea : "guarantee.content",
                placeholder : CONST_STR.get("COLLATERAL"),
                iconClass : "icon-content-note",
                lengthmax : "250",
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
//        $scope.initTextAreaMessage();
        //=================SHOW DIALOG Acc====================================//
        $scope.showAccountSelection =function () {
            var tmpArray1 = [];
            var tmpArray2 = [];
            for (var i in gTrans.listSourceAccounts){
                tmpArray1.push(gTrans.listSourceAccounts[i].account);
                tmpArray2.push(gTrans.listSourceAccounts[i].balance +'  '+ gTrans.listSourceAccounts[i].loaiTien);
            }
            document.addEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, true);
        }

        function showAccountSelectionOpen(e) {
            if (currentPage == "credit/guarantee/cre-guarantee-suggest-scr") {
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
            if (currentPage == "credit/guarantee/cre-guarantee-suggest-scr") {
                document.removeEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            }
        }
//        end show acc
        var comboEl;
        gTrans.idtxn = 'C10';

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

            comboEl = new ComboSetCurrency({
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
                currency :   gTrans.listSourceAccounts[index].loaiTien,
                clickIt : function (){ //handle function click
                    console.log("already click");
                }
            });
            comboEl.show("holder-account-info");

        }
        if(gTrans.isBack){
            $scope.amount = formatNumberToCurrency(gTrans.loanamount);
        }

        $scope.formatNumberToCurrency = function () {
            $scope.amount = formatNumberToCurrency($scope.amount);
        }
//        show type amount
            $scope.showTypeAmount = function(){
                var listSelection = [];
                var listValue = [];
                var dialogTitle;
                var fshowAccout = false;
                listSelection = CONST_KEY_TYPE_AMOUNT;
                listValue = CONST_KEY_TYPE_AMOUNT_KEY;
                dialogTitle = CONST_STR.get('GUARANTEE_CHOOSE_TYPE_AMOUNT');

                document.addEventListener("evtSelectionDialog", handleShowInput, false);
                document.addEventListener("evtSelectionDialogClose", handleShowInputClose, false);
                showDialogList(dialogTitle, listSelection, listValue, fshowAccout);
            }
        function handleShowInput(e) {
            if (currentPage == "credit/guarantee/cre-guarantee-suggest-scr") {
                document.removeEventListener("evtSelectionDialog", handleShowInput, false);
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    var inputObj;
                        inputObj = document.getElementById("id.typeAmount");
                        gg = e.selectedValue1;

                    inputObj.value = e.selectedValue1;
                }
                if (e.selectedValue2 != undefined && (e.selectedValue2 != null)) {
                            gg = e.selectedValue2;

                }
            }
        }

        function handleShowInputClose(e) {
            if (currentPage == "credit/guarantee/cre-guarantee-suggest-scr") {
                document.removeEventListener("evtSelectionDialogClose", handleShowInputClose, false);
                document.removeEventListener("evtSelectionDialog", handleShowInput, false);
            }
        }
//        END
            $scope.showLoanPurPose = function(){

                var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_KEY_LOAN_PURPOSE_TYPE_EN : CONST_KEY_LOAN_PURPOSE_TYPE_VN;
                var tmpArray2 = CONST_KEY_LOAN_PURPOSE_TYPE_ID;

                var handleInputPurpose = function(e) {
                    if (currentPage == "credit/guarantee/cre-guarantee-suggest-scr") {
                        handleInputPurposeClose();
                        var purpose = document.getElementById('loan.purpose');
                        if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                            if (purpose.nodeName == "INPUT") {
                                purpose.value = e.selectedValue1;
                            } else {
                                purpose.innerHTML = e.selectedValue1;
                            }
                        }
                        if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                            freq = e.selectedValue2;
                        }
                    }
                }

                var handleInputPurposeClose = function() {
                    if (currentPage == "credit/guarantee/cre-guarantee-suggest-scr") {
                        document.removeEventListener("evtSelectionDialogClose", handleInputPurposeClose, false);
                        document.removeEventListener("evtSelectionDialog", handleInputPurpose, false);
                    }
                }

                document.addEventListener("evtSelectionDialog", handleInputPurpose, false);
                document.addEventListener("evtSelectionDialogClose", handleInputPurposeClose, false);
                showDialogList(CONST_STR.get('SELECT_LOAN_PURPOSE'), tmpArray1, tmpArray2, false);
            }

//    SendJsonRequest
        $scope.sendJSONRequest = function(){
            var x = document.getElementsByName("token");
            var y = x.length;
            for(var i = 0; i< y; i++){
                if(x[i].checked){
                    var selected = x[i].value;
                }
            }

            var data = {};
            gTrans.transInfo.disbursementType = selected;
            gTrans.transInfo.requestAmount = document.getElementById("id.loanamount").value.replace(/,/g, '');
            gTrans.transInfo.typeMoney = document.getElementById('id.typeAmount').value;
            gTrans.transInfo.loanTime = document.getElementById("id.dateloan").value;
            gTrans.transInfo.purpose = freq;
            gTrans.transInfo.purposeDate= document.getElementById("propose.date").value;
            gTrans.transInfo.callateral= document.getElementById("guarantee.content").value;
            gTrans.transInfo.debitAcc= gTrans.sourceAcc.account;

            if ((gTrans.transInfo.requestAmount.length < 1) || (gTrans.transInfo.requestAmount == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER'))) {
                showAlertText(CONST_STR.get('ERR_INPUT_GUARANTEE_AMOUNT'));
                return;
            }
            if ((gTrans.transInfo.loanTime.length < 1) || (gTrans.transInfo.loanTime == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER'))) {
                showAlertText(CONST_STR.get('ERR_INPUT_GUARANTEE_TIME'));
                return;
            }
            if ((document.getElementById("loan.purpose").value==CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER'))) {
                showAlertText(CONST_STR.get('ERR_INPUT_GUARANTEE_PURPOSE'));
                return;
            }
            if (gTrans.transInfo.callateral== '') {
                showAlertText(CONST_STR.get('ERR_INPUT_GUARANTEE_CALLATERAL'));
                return;
            }
            if (gTrans.transInfo.purposeDate== '') {
                showAlertText(CONST_STR.get('ERR_INPUT_GUARANTEE_PURPOSE_DATE'));
                return;
            }


            var request = {};
            request.transInfo = gTrans.transInfo;
            request.sequence_id = "2";
            request.idtxn = "C10";

            var arrayArgs = [];
            var jsonRequest = JSON.stringify(request);
            arrayArgs.push(null);
            arrayArgs.push(jsonRequest);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_GUARANTEE_SUGGEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
            data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true,function(response){

                if(response.respCode == '0'){
                    var requestData = {
                    }

                    gTrans.document = response.respJsonObj.doc_info;
                    gTrans.idcafcatref = response.respJsonObj.idfcatref;
                    gTrans.disbursementType = gTrans.transInfo.disbursementType;
                    gTrans.customerNo = gTrans.transInfo.debitAcc;
                    if(selected == 1){
                        gTrans.typeLoan = CONST_STR.get('IN_LIMIT');
                    }else{
                        gTrans.typeLoan = CONST_STR.get('GUARANTEE_BY_COURSE');
                    }
                    gTrans.loanamount =  formatNumberToCurrency(gTrans.transInfo.requestAmount);

                    gTrans.dateloan =  gTrans.transInfo.loanTime;
                    gTrans.purpose = document.getElementById('loan.purpose').value;
                    gTrans.content =   gTrans.transInfo.callateral;
                    gTrans.accno =    gTrans.transInfo.debitAcc;
                    navCachedPages["credit/guarantee/cre-guarantee-suggest-scr-view"] = null;
                    navController.pushToView("credit/guarantee/cre-guarantee-suggest-scr-view", true, "html");

                }

            });
        }



    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}
