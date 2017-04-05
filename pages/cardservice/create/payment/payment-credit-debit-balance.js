/**
 * Created by JetBrains WebStorm.
 * User: AnhNTT.FSOFT
 * Date: 1/11/17
 * Time: 1:55 PM
 * To change this template use File | Settings | File Templates.
 */


var cardArr ;
var xref; // so xref
gTrans.idtxn = 'D12';
var cardId;// card id
var cardNumber // so the
var cardName // ten chu the
var typeMethod // loai phuong thuc thanh toan
gTrans.isBack = false;

function viewDidLoadSuccess (){
    console.log('payment credit will loaddddddd !');
    //phuong thuc thanh toan: toan bo du no trong sao ke
    document.getElementById("repaymentoption").value = gUserInfo.lang == "VN" ? CONST_KEY_REPAYMENT_OPTIONS_VN[2] : CONST_KEY_REPAYMENT_OPTIONS_EN[2];
    document.getElementById("repaymentoption.value").value = 3;

    //disable input amount
    document.getElementById("id-money").disabled = true;
    document.getElementById("id-money").placeholder = "";
    init();
}

function viewBackFromOther() {
    gTrans.isBack = true;
    document.getElementById("repaymentoption.value").value = gTrans.transInfo.typeMethod;
}

function viewWillUnload() {
    //flag = false;
    logInfo('payment credit will unload');
}
function init(){
    angular.module('EbankApp').controller('payment-credit-debit-balance', function ($scope, requestMBServiceCorp) {
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
        if(gTrans.isBack){
            $scope.amount = gTrans.transInfo.amountView;
            document.getElementById("repaymentoption").value = gTrans.transInfo.type;
            document.getElementById("repaymentoption.value").value = gTrans.transInfo.typeMethod;
        }
        $scope.formatNumberToCurrency = function () {
            $scope.amount = formatNumberToCurrency($scope.amount);
        }
        //***********show danh sach tai khoan************//
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
            if (currentPage == "cardservice/create/payment/payment-credit-debit-balance") {
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
            if (currentPage == "cardservice/create/payment/payment-credit-debit-balance") {
                document.removeEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            }
        }
        //*********Show so the*************//
         $scope.showPaymentCreditSelection = function (){
             var tmpArray1 = [];
             var tmpArray2 = [];
             for (var i = 0; i < cardArr.length; i++){
                 tmpArray1.push(cardArr[i].myHashMap.CARD_NUMBER);
             }
             var tmpArray2 = tmpArray1;
             document.addEventListener("evtSelectionDialog", showPaymentCreditSelectionOpen, false);
             document.addEventListener("evtSelectionDialogClose", showPaymentCreditSelectionClose, false);
             showDialogList(CONST_STR.get('CARD_LOCK_CARD_NO_TITLE'), tmpArray1, tmpArray2, false);
         }
        function showPaymentCreditSelectionOpen(e){
            if (currentPage == "cardservice/create/payment/payment-credit-debit-balance") {
                showPaymentCreditSelectionClose();
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)){
                   var cardNum = document.getElementById("id-cardNo");
                    cardNum.value = e.selectedValue1;
                    cardNumber = e.selectedValue1;
                    for (var i = 0; i < cardArr.length; i++) {
                        if (cardArr[i].myHashMap.CARD_NUMBER == e.selectedValue1) {
                            cardId = cardArr[i].myHashMap.CARD_ID;
                            cardName = cardArr[i].myHashMap.CARD_HOLD_NAME;
                            //Hạn mức được cấp
                            var node = document.getElementById("grantedCardLimit");
                            node.innerHTML = formatNumberToCurrency(cardArr[i].myHashMap.CREDIT_LIMIT) + " VND";
                            //Dư nợ hiện tại
                            node = document.getElementById("currentCardDebt");
                            node.innerHTML = formatNumberToCurrency(cardArr[i].myHashMap.CURR_BAL) + " VND";
                            //Dư nợ hiện tại trong kỳ sao kê
                            node = document.getElementById("onStmtCardDebt");
                            node.innerHTML = formatNumberToCurrency(cardArr[i].myHashMap.TT_DU_NO_CONLAI) + " VND";
                            //Hạn mức còn lại
                            node = document.getElementById("availCreditLimit");
                            node.innerHTML = formatNumberToCurrency(cardArr[i].myHashMap.CURR_LIMIT) + " VND";
                            //Số tiền đã chi tiêu<br>(chờ quyết toán)
                            node = document.getElementById("spentAmount");
//                            node.innerHTML = formatNumberToCurrency(cardArr[i].myHashMap.CUR_AUTHO) + " VND";
                            node.innerHTML = formatNumberToCurrency(cardArr[i].myHashMap.CHO_TQT) + " VND";

                            var repaymentOpt = document.getElementById("repaymentoption.value").value;

                            //thanh toan toi thieu
                            if (repaymentOpt == 1) {
                                var cardNo =document.getElementById("id-cardNo").value;

                                for (var i = 0; i < cardArr.length; i++) {
                                    if (cardArr[i].myHashMap.CARD_NUMBER == cardNo) {
                                        var amount = document.getElementById("id-money");
                                        amount.value = formatNumberToCurrency(cardArr[i].myHashMap.TT_DU_NO_TOI_THIEU);
                                        //disable input amount
                                        document.getElementById("id-money").disabled = true;
                                        document.getElementById("id-money").placeholder = "";
                                        document.getElementById("amountVal").value = cardArr[i].myHashMap.TT_DU_NO_TOI_THIEU;

                                        var numStr = convertNum2WordWithLang(cardArr[i].myHashMap.TT_DU_NO_TOI_THIEU, gUserInfo.lang);
                                        var nodeNumTxt = document.getElementById("ccrepayment.amounttotext");
                                        nodeNumTxt.innerHTML = "<div class='txtmoneystyle'><span>" +numStr +"</span></div>";
                                        break;
                                    }
                                }
                                //toan bo du no toi thoi diem hien tai
                            } else if (repaymentOpt == 2) {
                                var cardNo = document.getElementById("id-cardNo").value;

                                for (var i = 0; i < cardArr.length; i++) {
                                    if (cardArr[i].myHashMap.CARD_NUMBER == cardNo) {
                                        var amount = document.getElementById("id-money");
                                        amount.value = formatNumberToCurrency(cardArr[i].myHashMap.CURR_BAL);
                                        //disable input amount
                                        document.getElementById("id-money").disabled = true;
                                        document.getElementById("id-money").placeholder = "";
                                        document.getElementById("amountVal").value = cardArr[i].myHashMap.CURR_BAL;

                                        var numStr = convertNum2WordWithLang(cardArr[i].myHashMap.CURR_BAL, gUserInfo.lang);
                                        var nodeNumTxt = document.getElementById("ccrepayment.amounttotext");
                                        nodeNumTxt.innerHTML ="<div class='txtmoneystyle'><span>" +numStr + "</span></div>";
                                        break;
                                    }
                                }

                                //toan bo du no trong sao ke
                            } else if (repaymentOpt == 3) {
                                var cardNo = document.getElementById("id-cardNo").value;

                                for (var i = 0; i < cardArr.length; i++) {
                                    if (cardArr[i].myHashMap.CARD_NUMBER == cardNo) {
                                        var amount = document.getElementById("id-money");
                                        amount.value = formatNumberToCurrency(cardArr[i].myHashMap.TT_DU_NO_CONLAI);
                                        //disable input amount
                                        document.getElementById("id-money").disabled = true;
                                        document.getElementById("id-money").placeholder = "";
                                        document.getElementById("amountVal").value = cardArr[i].myHashMap.TT_DU_NO_CONLAI;

                                        var numStr = convertNum2WordWithLang(cardArr[i].myHashMap.TT_DU_NO_CONLAI, gUserInfo.lang);
                                        var nodeNumTxt = document.getElementById("ccrepayment.amounttotext");
                                        nodeNumTxt.innerHTML = "<div class='txtmoneystyle'><span>" +numStr + "</span></div>";
                                        break;
                                    }
                                }
                                //thanh toan toi thieu / thanh toan tuy chon
                            } else {
                                document.getElementById("id-money").value = "";
                                //enable input amount
                                document.getElementById("id-money").disabled = false;
                                document.getElementById("id-money").placeholder = CONST_STR.get('COM_TXT_INPUT_PLACEHOLDER');

                                document.getElementById("amountVal").value = "";

                                document.getElementById("ccrepayment.amounttotext").innerHTML = //"<h6 class='blstyle2'><span style='font-style:italic;'>"
                                    "<div class='txtmoneystyle'><span> " +
                                        //CONST_STR.get('CREDIT_CARD_REPAYMENT_NUM_TO_WORD') +
                                        //"</span></h6>"
                                        "</span></div>";
                            }

                        }
                    }
                    document.getElementById('ccDetalsTable').style.display = '';
                }
            }
        }
        function showPaymentCreditSelectionClose(){
            if (currentPage == "cardservice/create/payment/payment-credit-debit-balance") {
                document.removeEventListener("evtSelectionDialog", showPaymentCreditSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showPaymentCreditSelectionClose, false);
            }
        }
        //***********hình thức thanh toán************//
        $scope.showRepaymentOptions= function(){
            var tmpArray1 = [];
            var tmpArray2 = [];
            if (gUserInfo.lang == "VN") {
                for (var i=0; i< CONST_KEY_REPAYMENT_OPTIONS_VN.length; i++) {
                    var tmpAcc = CONST_KEY_REPAYMENT_OPTIONS_VN[i];
                    tmpArray1.push(CONST_KEY_REPAYMENT_OPTIONS_VN[i]);
                    tmpArray2.push(i + 1);
                }
            } else {
                for (var i=0; i< CONST_KEY_REPAYMENT_OPTIONS_EN.length; i++) {
                    var tmpAcc = CONST_KEY_REPAYMENT_OPTIONS_EN[i];
                    tmpArray1.push(CONST_KEY_REPAYMENT_OPTIONS_EN[i]);
                    tmpArray2.push(i + 1);
                }
            }
            document.addEventListener("evtSelectionDialog", handleRepaymentOptionsOpen, false);
            document.addEventListener("evtSelectionDialogClose", handleRepaymentOptionsClose, false);
            showDialogList(CONST_STR.get('CREDIT_CARD_REPAYMENT_OPTION'), tmpArray1, tmpArray2, false);
        }

        function handleRepaymentOptionsOpen(e){
            if (currentPage == "cardservice/create/payment/payment-credit-debit-balance") {
                handleRepaymentOptionsClose();
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    var repayOption = document.getElementById("repaymentoption");
                    repayOption.value = e.selectedValue1;
                    document.getElementById('repaymentoption.value').value = e.selectedValue2;
                    //thanh toan toi thieu
                    if (e.selectedValue2 == 1) {
                        hideTxtmoneystyle();
                        var cardNo = document.getElementById("id-cardNo").value;

                        for (var i = 0; i < cardArr.length; i++) {
                            if (cardArr[i].myHashMap.CARD_NUMBER == cardNo) {
                                var amount = document.getElementById("id-money");
                                amount.value = formatNumberToCurrency(cardArr[i].myHashMap.TT_DU_NO_TOI_THIEU);
                                //disable input amount
                                document.getElementById("id-money").disabled = true;
                                document.getElementById("id-money").placeholder = "";
                                document.getElementById("amountVal").value = "";
                                document.getElementById("amountVal").value = cardArr[i].myHashMap.TT_DU_NO_TOI_THIEU;

                                var numStr = convertNum2WordWithLang(cardArr[i].myHashMap.TT_DU_NO_TOI_THIEU, gUserInfo.lang);
                                var nodeNumTxt = document.getElementById("ccrepayment.amounttotext");
                                nodeNumTxt.innerHTML = //"<h6 class='blstyle2'><span style='font-style:italic;'>"
                                    "<div class='txtmoneystyle'><span>" +
                                        /*CONST_STR.get('CREDIT_CARD_REPAYMENT_NUM_TO_WORD') +
                                         ": " + */
                                        numStr + //"</b></span></h6>"
                                        "</span></div>";

                                break;
                            }
                        }
                        //toan bo du no toi thoi diem hien tai
                    } else if (e.selectedValue2 == 2) {
                        hideTxtmoneystyle();
                        var cardNo = document.getElementById("id-cardNo").value;

                        for (var i = 0; i < cardArr.length; i++) {
                            if (cardArr[i].myHashMap.CARD_NUMBER == cardNo) {
                                var amount = document.getElementById("id-money");
                                amount.value = formatNumberToCurrency(cardArr[i].myHashMap.CURR_BAL);
                                //disable input amount
                                document.getElementById("id-money").disabled = true;
                                document.getElementById("id-money").placeholder = "";
                                document.getElementById("amountVal").value = "";
                                document.getElementById("amountVal").value = cardArr[i].myHashMap.CURR_BAL;

                                var numStr = convertNum2WordWithLang(cardArr[i].myHashMap.CURR_BAL, gUserInfo.lang);
                                var nodeNumTxt = document.getElementById("ccrepayment.amounttotext");
                                nodeNumTxt.innerHTML = //"<h6 class='blstyle2'><span style='font-style:italic;'>"
                                    "<div class='txtmoneystyle'><span>" +
                                        /*CONST_STR.get('CREDIT_CARD_REPAYMENT_NUM_TO_WORD') +
                                         ": " + */
                                        numStr + //"</b></span></h6>"
                                        "</span></div>";

                                break;
                            }
                        }

                        //toan bo du no trong sao ke
                    } else if (e.selectedValue2 == 3) {
                        hideTxtmoneystyle();
                        var cardNo = document.getElementById("id-cardNo").value;

                        for (var i = 0; i < cardArr.length; i++) {
                            if (cardArr[i].myHashMap.CARD_NUMBER == cardNo) {
                                var amount = document.getElementById("id-money");
                                amount.value = formatNumberToCurrency(cardArr[i].myHashMap.TT_DU_NO_CONLAI);
                                //disable input amount
                                document.getElementById("id-money").disabled = true;
                                document.getElementById("id-money").placeholder = "";
                                document.getElementById("amountVal").value = "";
                                document.getElementById("amountVal").value = cardArr[i].myHashMap.TT_DU_NO_CONLAI;

                                var numStr = convertNum2WordWithLang(cardArr[i].myHashMap.TT_DU_NO_CONLAI, gUserInfo.lang);
                                var nodeNumTxt = document.getElementById("ccrepayment.amounttotext");
                                nodeNumTxt.innerHTML = //"<h6 class='blstyle2'><span style='font-style:italic;'>"
                                    "<div class='txtmoneystyle'><span>" +
                                        /*CONST_STR.get('CREDIT_CARD_REPAYMENT_NUM_TO_WORD') +
                                         ": " +*/
                                        numStr + //"</b></span></h6>"
                                        "</span></div>";

                                break;
                            }
                        }
                        //thanh toan toi thieu / thanh toan tuy chon
                    }else {
                        document.getElementById("id-money").value = "";
                        //enable input amount
                        document.getElementById("id-money").disabled = false;
                        document.getElementById("id-money").placeholder = CONST_STR.get('COM_TXT_INPUT_PLACEHOLDER');

                        document.getElementById("amountVal").value = "";

                        document.getElementById("ccrepayment.amounttotext").innerHTML = //"<h6 class='blstyle2'><span style='font-style:italic;'>"
                            "<div class='txtmoneystyle'><span> " +
                                //CONST_STR.get('CREDIT_CARD_REPAYMENT_NUM_TO_WORD') +
                                //"</span></h6>"
                                "</span></div>";
                    }
                }
            }

        }
        function hideTxtmoneystyle(){
            document.getElementById("id-money").value = "";
            //enable input amount
            document.getElementById("id-money").disabled = true;
            document.getElementById("id-money").placeholder = "";
        }
        function handleRepaymentOptionsClose(){
            if (currentPage == "cardservice/create/payment/payment-credit-debit-balance") {
                document.removeEventListener("evtSelectionDialogClose", handleRepaymentOptionsClose, false);
                document.removeEventListener("evtSelectionDialog", handleRepaymentOptionsOpen, false);
            }
        }

        $scope.formatNumberToCurrency = function () {
            $scope.amount = formatNumberToCurrency($scope.amount);
        }

        $scope.sendJSONRequest = function (){
            var amount = document.getElementById("id-money").value;
            var valueAmount = removeSpecialChar(amount);
            if(valueAmount < 0 || valueAmount == 0){
                showAlertText(CONST_STR.get('COM_TAX_AMOUNT_MUST_BE_INT'));
                return;
            }
            if(parseInt(valueAmount) > parseInt(removeSpecialChar(gTrans.sourceAcc.balance))){
                showAlertText(CONST_STR.get('CARD_ISSUANCE_BALANCE_LESS'));
                return;
            }
            var today = getStringFromDate();
            gTrans.transInfo = {};
            gTrans.transInfo.xref =  xref;
            gTrans.transInfo.cardNumber = cardNumber;
            gTrans.transInfo.cardName = cardName
            gTrans.transInfo.typeMethod =  document.getElementById('repaymentoption.value').value;
            gTrans.transInfo.type =  document.getElementById('repaymentoption').value;
            gTrans.transInfo.cardId =  cardId;
            gTrans.transInfo.date =  today;
            gTrans.transInfo.debitAcc =  gTrans.sourceAcc.account;// so tai khoan ghi no,
            gTrans.transInfo.balanceAfter =  gTrans.sourceAcc.balance;// so du truoc khi thanh toan,
            gTrans.transInfo.amount = valueAmount ;// so tien ghi no,
            var amountBefore =  removeSpecialChar(gTrans.sourceAcc.balance) - gTrans.transInfo.amount;
            var formatNumber = formatNumberToCurrency(amountBefore);
            gTrans.transInfo.amountView = amount;
            gTrans.transInfo.balanceBefore = formatNumber ;
            gTrans.transInfo.idtxn = 'D12';
            var jsonData = new Object();
            jsonData.sequence_id = "2";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.transInfo = gTrans.transInfo;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var data = {};
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CREDIT_PAYMENT"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true,function(response){
                if(response.respCode == '0'){
                    console.log(response);
                    gTrans.magiaodich = {};
                    gTrans.magiaodich.IDFCATREF = response.respJsonObj.O_IDFCATREF;
                    gTrans.transId = response.respJsonObj.O_IDFCATREF;
                    var requestData = {
                        transId: response.respJsonObj.O_IDFCATREF,
                        sequence_id: 3,
                        idtxn: gTrans.transInfo.idtxn
                    }
                    gTrans.cmdType = CONSTANTS.get("CMD_CREDIT_PAYMENT");

                    gTrans.requestData = requestData;
                    gTrans.src = "pages/cardservice/common-review/cardservice-review-src.html";
                    gTrans.ortherSrc = "cardservice/create/payment/payment-credit-debit-balance";
//                    navController.pushToView("cardservice/common-review/cardservice-review-src", true, "html");
                    navController.pushToView("common/common-review/transfer-review-scr", true, "html");
                }else{
                    showAlertText(CONST_STR.get('COM_TRANS_STATUS_RBH'));
                    return;
                }
            });
        }
        $scope.loadInitData = function () {
            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CREDIT_PAYMENT"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true,
                function(data) {
                    var resp = data;
                    console.log(resp);
                    if (resp.respCode == 0) {
                        if(resp.respJsonObj.list_card.myArrayList.length == 0 || resp.respJsonObj.list_card.myArrayList == undefined || resp.respJsonObj.list_card.myArrayList == null){
                            navController.popToView("menuxsl/dynamic-menu-scr");
                            showAlertText(CONST_STR.get('CREDIT_CARD_REQ_CARD_FAIL_MSG'));
                        }else{
                            gTrans.listSourceAccounts = resp.respJsonObj.listSourceAccounts;
                            gTrans.sourceAcc = gTrans.listSourceAccounts[0];
                            cardArr = resp.respJsonObj.list_card.myArrayList;
                            xref = resp.respJsonObj.xref;
                            $scope.initComboTextAccount(0);
                        }
                    }
                },
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                    gotoHomePage();
                }
            );
        }
        $scope.loadInitData();
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}
function handleInputAmount (e, des) {
    var trowConvert = document.getElementById('row_convert');
    var tmpVale = des.value;
    formatCurrency(e, des);
    //des.value = formatNumberToCurrency(des.value);
    var numStr = convertNum2WordWithLang(keepOnlyNumber(tmpVale), gUserInfo.lang);

    if(numStr){
        var nodeNumTxt = document.getElementById("ccrepayment.amounttotext");
        nodeNumTxt.innerHTML = "<div class='txtmoneystyle'>" + numStr + "</div>";
        trowConvert.style.display = "";
    }else{
        trowConvert.style.display = 'none';
    }
}

