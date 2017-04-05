/**
 * Created by JetBrains WebStorm.
 * User: AnhNTT.FSOFT
 * Date: 12/16/16
 * Time: 11:52 AM
 * To change this template use File | Settings | File Templates.
 */

gTrans.isBack = false;
function viewBackFromOther() {
    gTrans.isBack = true;
    // if (Environment.isMobile()){
    //     document.getElementById("rateUSD").value = gTrans.rateCurrency.rateUSD;
    //     document.getElementById("rateJPY").value = gTrans.rateCurrency.rateJPY;
    //     document.getElementById("rateEUR").value = gTrans.rateCurrency.rateEUR;
    //
    // }
}

function viewDidLoadSuccess(){
        
    initData();
    setInputOnlyASCIILNH('trans.content', CONST_STR.get("ERR_INPUT_ONLY_ASCII_CHAR"));
    if(gTrans.isBack){
        $("#amount").inputmask("setvalue", gTrans.transInfo.sellNumber);
    }

    document.getElementById("trans.content").onkeyup = function() {
            var tempcontrol=document.getElementById("trans.content");

            textLimit(tempcontrol, 100);

            tempcontrol.value = removeAccentinfo(tempcontrol.value);
            tempcontrol.value = tempcontrol.value.replace(/[!"#@$%&'\+:;<=>?\\`^~{|}]/g, '');
        }
}

function initData(){
    angular.module('EbankApp').controller('foreign-exchange', function ($scope, requestMBServiceCorp){
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
        
        $scope.initBottomBar = function (){
            var arrBottom = new Array();
            arrBottom.push(new MenuBottom("AUTO_BILLING_TAB_LIST", "icon-scheduled-transfers-list"));
            navController.initBottomBarWithCallBack("international_payments/foreign_exchange/foreign_exchange", arrBottom, "foreign_exchange", function (index) {
                switchAction(index);
            });
        }

        function switchAction(index){
            switch(index)
            {                
                case "0":
                    updateAccountListInfo();
                    navCachedPages['common/com_list_user_approve'] = null;
                    navController.pushToView("common/com_list_user_approve", true, 'html');
                break;
            }
        }

        $scope.init = function () {
            var requestData = new Object();
            requestData.idtxn = "B13";
            requestData.sequenceId = "1";

            var args = [];
            args.push("1");
            args.push(requestData);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_INT_PAYMENT_EXCHANGE_CREATE'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                var resp = response;
                // Lay rate chuyen doi
                var rateExchange = resp.respJsonObj.listRate;
                gPay.rateExchange = resp.respJsonObj.listRate.listRate;
                gTrans.transInfo = {};
                gTrans.limit = resp.respJsonObj.limit;

                document.getElementById("rateUSD").value = formatCurrentWithSysbol(rateExchange.listRate[0].TRANSFER_BUY_RATE,"");
                document.getElementById("rateJPY").value = formatCurrentWithSysbol(rateExchange.listRate[1].TRANSFER_BUY_RATE,"");
                document.getElementById("rateEUR").value = formatCurrentWithSysbol(rateExchange.listRate[2].TRANSFER_BUY_RATE,"");

                gTrans.rateCurrency = {}
                gTrans.rateCurrency.rateUSD = formatCurrentWithSysbol(rateExchange.listRate[0].TRANSFER_BUY_RATE,"");
                gTrans.rateCurrency.rateJPY = formatCurrentWithSysbol(rateExchange.listRate[1].TRANSFER_BUY_RATE,"");
                gTrans.rateCurrency.rateEUR = formatCurrentWithSysbol(rateExchange.listRate[2].TRANSFER_BUY_RATE,"");

                // Lay tai khoan ngoai te
                gPay.listAccoutForeign = resp.respJsonObj.listAccountUSD.listAccountUSD;

                // Lay tai khoan thanh toan
                gPay.listAccoutVND = resp.respJsonObj.listAccountVND.listAccountVND;

                // Lay danh sach ban ngoai te
                gPay.TransaDay = resp.respJsonObj.transday.TransaDay;

                // tinh tong so tien doi ngoai te
                gPay.maxTrans = calMaxTrans();
                // console.log('maxtrans', formatCurrentWithSysbol(gPay.maxTrans,""));

                // Lay send method
                if (resp.respJsonObj.sendMethod == 0) {
                    document.getElementById("trNotify").style.display = "none";
                }
                document.getElementById("id.notifyTo").value = CONST_STR.get("COM_NOTIFY_" + resp.respJsonObj.sendMethod);
            });
        }

        // chuyển tab quản lý giao dịch
        $scope.showMngPage = function(){
            navCachedPages["international_payments/foreign_exchange/foreign_exchange_mng"] = null;
            navController.pushToView('international_payments/foreign_exchange/foreign_exchange_mng', true, 'html');
        }

        /*
         *  Tính tổng tiền nhận được sau khi quy đổi.
         */
        $scope.calTotalAmount = function () {
            var total = 0
            var amount = $('#amount').val();
            if(amount != ""){
                var rate = document.getElementById("trans.foregin_rate").value;
                total = parseFloat(removeSpecialChar(amount) * parseFloat(removeSpecialChar(rate)));

                console.log("amount", amount);
                console.log("removeSpecialChar(rate)", removeSpecialChar(rate));
                if(amount > 0){
                    document.getElementById("amount").value = amount;
                }
                document.getElementById("trans.foregin_total_reveiver_amount").value = formatCurrentWithSysbol(total, 'VND');
            }else {
                document.getElementById("trans.foregin_total_reveiver_amount").value = "0 VND";
            }
        }

        $scope.sendJSONRequest = function () {
            var totalAmout = document.getElementById("trans.foregin_total_reveiver_amount").value;
            var Content = document.getElementById("trans.content").value;

            //Check noi dung
            if (Content.trim()=='')
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("COM_ERROR_DESC")]));
                return;
            }

            //Check so tien vuot qua han muc cho phep
            if (removeSpecialChar(totalAmout) > 100000000) {
                showAlertText(CONST_STR.get("FOREGIN_ERR_MONEY_OVER"));
                return;
            }

            if(parseInt(gPay.maxTrans) + parseInt(totalAmout.replace(/,/g,'')) > 1000000000){
                showAlertText(CONST_STR.get("FOREGIN_ERR_MONEY_OVER_LIMIT"));
                return;
            }

            // Check so tien vuot qua SDKD
            var tmpAccUSD = [];
            var a = gPay.accountForeign;
            // Check null
            var foreignAcc = document.getElementById("trans.foregin_account").value;
            if (foreignAcc == '' || foreignAcc == undefined || foreignAcc == CONST_STR.get("COM_TXT_INPUT_PLACEHOLDER")) {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("FOREGIN_ACCOUNT")]));
                return;
            };

            tmpAccUSD = gPay.accountForeign.split(" ");
            var sdkd = tmpAccUSD[0];
            var sellNumber = document.getElementById("amount").value;
            console.log(sdkd);
            console.log(sellNumber);
            if ((parseInt(sdkd.replace(/,/g,'')) - parseInt(sellNumber.replace(/,/g,''))) < 0) {
                showAlertText(CONST_STR.get("FOREGIN_ERR_MONEY_NOT_ENOUGHT"));
                return;
            }

            // Check null
            // var foreignAcc = document.getElementById("foreginAccount").value;
            // if (foreignAcc == '' || foreignAcc == undefined || foreignAcc == CONST_STR.get("COM_TXT_INPUT_PLACEHOLDER")) {
            //   showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("FOREGIN_ACCOUNT")]));
            //   return;
            // };

            var foreignAccVND = document.getElementById("trans.foregin_account_payment").value;
            if (foreignAccVND == '' || foreignAccVND == undefined || foreignAccVND == CONST_STR.get("COM_TXT_INPUT_PLACEHOLDER")) {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("FOREGIN_ACCOUNT_PAYMENT")]));
                return;
            };


            if (sellNumber == '' || sellNumber == undefined || sellNumber == CONST_STR.get("COM_TXT_INPUT_PLACEHOLDER")) {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("FOREGIN_SELL_NUMBER")]));
                return;
            };

            //validate han muc
            if (parseInt(removeSpecialChar(totalAmout)) > parseInt(gTrans.limit.limitTime)) {
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_TIME'), [formatNumberToCurrency(gTrans.limit.limitTime)]));
                return false;
            }
            if ((parseInt(gTrans.limit.totalDay) + parseInt(removeSpecialChar(totalAmout))) > parseInt(gTrans.limit.limitDay)) {
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_DAY'), [formatNumberToCurrency(gTrans.limit.limitDay)]));
                return false;
            }

            var exchangeRate = document.getElementById("trans.foregin_rate").value;
            var description = document.getElementById("trans.content").value;

            gTrans.transInfo = new Object();
            gTrans.transInfo.idtxn = "B13";
            gTrans.transInfo.sequenceId = '2';
            gTrans.transInfo.foreignAcc = foreignAcc;
            gTrans.transInfo.foreignAccVND = foreignAccVND;
            gTrans.transInfo.sellNumber = removeSpecialChar(sellNumber);
            gTrans.transInfo.exchangeRate = removeSpecialChar(exchangeRate);
            gTrans.transInfo.totalAmout = removeSpecialChar(totalAmout);
            gTrans.transInfo.description = description;
            gTrans.transInfo.exchangeUnit = gPay.accountForeign.slice(-3);

            var args = [];
            args.push("1");
            args.push(gTrans.transInfo);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_INT_PAYMENT_EXCHANGE_CREATE'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                var resp = response;
                if (resp.respCode == '0') {
                    gTrans.transInfo.transId = resp.respJsonObj.idFcatref;
                    var requestData = {
                        sequenceId: "3",
                        idFcatref: resp.respJsonObj.idFcatref,
                        idUserRef: resp.respJsonObj.idUserRef,
                        idtxn: "B13"
                    };

                    gTrans.transInfo.transTypeName = CONST_STR.get('MENU_CHILD_EXCHANGE_MONEY');
                    gTrans.transInfo.foreignAccBalanceAfter = formatCurrentWithSysbol(parseFloat(removeSpecialChar(document.getElementById('balance.foregin').innerHTML)) - parseFloat(gTrans.transInfo.sellNumber), gTrans.transInfo.exchangeUnit);
                    gTrans.transInfo.foreignAccVNDBalanceAfter = formatCurrentWithSysbol(parseFloat(removeSpecialChar(document.getElementById('balance.payment').innerHTML)) + parseFloat(gTrans.transInfo.totalAmout), "VND");
                    gTrans.transInfo.expireDate = getDate("today");
                    gTrans.transInfo.approve = document.getElementById("id.notifyTo").value;

                    gTrans.cmdType = CONSTANTS.get("CMD_CO_INT_PAYMENT_EXCHANGE_CREATE");
                    gTrans.requestData = requestData;
                    gTrans.src = "pages/international_payments/foreign_exchange/foregin-exchange-view.html";
                    gTrans.ortherSrc = "international_payments/foreign_exchange/foreign_exchange";
                    // gTrans.transInfo.transType = transTypeName(gTrans.idtxn);
                    /*navCachedPages['common/common-review/transfer-review-scr'] = null;
                    navController.pushToView("common/common-review/transfer-review-scr", true, "html");*/
                    navCachedPages['international_payments/foreign_exchange/foreign_exchange-review-scr'] = null;
                    navController.pushToView("international_payments/foreign_exchange/foreign_exchange-review-scr", true, "html");

                } else {
                    showAlertText(CONST_STR.get('CORP_MSG_PERIODIC_ERROR_INSERT_DATA'));
                }
            });
        }

        //=================SHOW DIALOG AccountForeign==================================//
        $scope.showListAccountForeign = function () {
            var tmpArray1 = [];
            var tmpArray2 = [];
            for (var i in gPay.listAccoutForeign){
                tmpArray1.push(gPay.listAccoutForeign[i].IDACCOUNT);
                tmpArray2.push(formatCurrentWithSysbol(gPay.listAccoutForeign[i].NUMAVAILABLE,gPay.listAccoutForeign[i].CODACCTCURR));
            }


            document.addEventListener("evtSelectionDialog", showAccountForeignSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showAccountForeignSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, true);
        }

        function showAccountForeignSelectionOpen(e) {
            if (currentPage == "international_payments/foreign_exchange/foreign_exchange") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('trans.foregin_account').value = e.selectedValue1;
                    document.getElementById('balance.foregin').innerHTML = ": " + e.selectedValue2;
                    gPay.accountForeign = e.selectedValue2;
                    showAccountForeignSelectionClose();

                    for (var i in gPay.listAccoutForeign){
                        if (e.selectedValue1 == gPay.listAccoutForeign[i].IDACCOUNT){
                            var account = gPay.listAccoutForeign[i];
                            for (var j in gPay.rateExchange){
                                if (account.CODACCTCURR == gPay.rateExchange[j].CCY){
                                    document.getElementById('trans.foregin_rate').value = formatCurrentWithSysbol(gPay.rateExchange[j].TRANSFER_BUY_RATE,"");
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    $scope.calTotalAmount();
                }
            }
        }

        function showAccountForeignSelectionClose() {
            if (currentPage == "international_payments/foreign_exchange/foreign_exchange") {
                document.removeEventListener("evtSelectionDialog", showAccountForeignSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showAccountForeignSelectionClose, false);
            }
        }

        //=================SHOW DIALOG ListAccountVND==================================//

        $scope.showListAccountVND = function () {
            var tmpArray1 = [];
            var tmpArray2 = [];
            for (var i in gPay.listAccoutVND){
                tmpArray1.push(gPay.listAccoutVND[i].IDACCOUNT);
                tmpArray2.push(formatCurrentWithSysbol(gPay.listAccoutVND[i].NUMAVAILABLE,gPay.listAccoutVND[i].CODACCTCURR));
            }


            document.addEventListener("evtSelectionDialog", showAccountVNDSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showAccountVNDSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, true);
        }

        function showAccountVNDSelectionOpen(e) {
            if (currentPage == "international_payments/foreign_exchange/foreign_exchange") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('trans.foregin_account_payment').value = e.selectedValue1;
                    document.getElementById('balance.payment').innerHTML = ": " + e.selectedValue2;
                    showAccountVNDSelectionClose();

                    // for (var i in gPay.listAccoutForeign){
                    //     if (e.selectedValue1 == gPay.listAccoutForeign[i].IDACCOUNT){
                    //         var account = gPay.listAccoutForeign[i];
                    //         for (var j in gPay.rateExchange){
                    //             if (account.CODACCTCURR == gPay.rateExchange[j].CCY){
                    //                 document.getElementById('trans.foregin_rate').value = formatCurrentWithSysbol(gPay.rateExchange[j].TRANSFER_BUY_RATE,"");
                    //                 break;
                    //             }
                    //         }
                    //         break;
                    //     }
                    // }
                }
            }
        }

        function showAccountVNDSelectionClose() {
            if (currentPage == "international_payments/foreign_exchange/foreign_exchange") {
                document.removeEventListener("evtSelectionDialog", showAccountVNDSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showAccountVNDSelectionClose, false);
            }
        }



        function calMaxTrans(){
            var maxTrans=0;
            for(var i=0;i<gPay.TransaDay.length;i++){
                if(gPay.TransaDay[i].CODTRNCURR == "USD"){
                    maxTrans += parseInt(removeSpecialChar(gPay.TransaDay[i].NUMAMOUNT)) * parseInt(removeSpecialChar(document.getElementById("rateUSD").value))
                }
                if(gPay.TransaDay[i].CODTRNCURR == "JPY"){
                    maxTrans += parseInt(removeSpecialChar(gPay.TransaDay[i].NUMAMOUNT)) * parseInt(removeSpecialChar(document.getElementById("rateJPY").value))
                }
                if(gPay.TransaDay[i].CODTRNCURR == "EUR"){
                    maxTrans += parseInt(removeSpecialChar(gPay.TransaDay[i].NUMAMOUNT)) * parseInt(removeSpecialChar(document.getElementById("rateEUR").value))
                }
            }
            return maxTrans;
            /*total = parseInt(removeSpecialChar(amount)) * parseInt(removeSpecialChar(rate));
             document.getElementById("rateUSD").value = formatNumberToCurrency(rateExchange.listRate[0].TRANSFER_BUY_RATE);
             document.getElementById("rateJPY").value = formatNumberToCurrency(rateExchange.listRate[1].TRANSFER_BUY_RATE);
             document.getElementById("rateEUR").value = formatNumberToCurrency(rateExchange.listRate[2].TRANSFER_BUY_RATE);*/
        }

        function formatCurrentWithSysbol(n, currency) {

            var k;
            k = Math.abs(n).toFixed(2).replace(/./g, function(c, i, a) {
                    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                });
            if(k.substr(k.length - 2, k.length)==='00')
            {
                k = k.substr(0,k.length - 3);
            }
            
            return k + " " + currency;
        }

        if(!gTrans.isBack){
            $scope.initBottomBar();
            $scope.initTextAreaMessage();
            $scope.init();
            document.getElementById('trans.content').innerHTML = "";
            document.getElementById('trans.foregin_account').value = "";
            document.getElementById('trans.foregin_account_payment').value = "";
            document.getElementById('amount').value = "";
            document.getElementById('trans.foregin_total_reveiver_amount').value = "";
            document.getElementById('trans.foregin_rate').value = "";


        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])

}

function removeCharAnd_New(field) {
    field.value = field.value.replace(/\band\b/gi,"");
    field.value = field.value.replace(/\bAND\b/gi,"");
    field.value = field.value.replace(/\bAnd\b/gi,"");
    field.value = field.value.replace(/\bANd\b/gi,"");
    field.value = field.value.replace(/\baND\b/gi,"");
    field.value = field.value.replace(/\bAnD\b/gi,"");
    field.value = field.value.replace(/\baNd\b/gi,"");
    field.value = field.value.replace(/\banD\b/gi,"");
    field.value = removeAccentinfo(field.value);
    field.value = field.value.replace(/[!"#@$%&'\+:;<=>?\\`^~{|}]/g, '');
}

function onlyInputNumber(field) {
    field.value = field.value.replace(/[^0-9-.]/g, '');
}

$(document).ready(function () {
    $('#amount').inputmask('numeric',{
        radixPoint: ".",
        groupSeparator: ",",
        digits: 2,
        autoGroup: true,
        prefix: '', //No Space, this will truncate the first character
        rightAlign: false,
        oncleared: function () {}
    });
});