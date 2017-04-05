/**
 * Created by HaiDT1 on 8/22/2016.
 */

flag = 0;
gInternational.USD = {};
gInternational.isBack = false;
function viewDidLoadSuccess() {
    init();
    if (gInternational.isBack) {
        document.getElementById('idInternationalTotalCurrency').value = gInternational.TotalCurrency;
        document.getElementById('idInternationalDebitAmount').value = gInternational.debitAmount;
    }
}

function viewBackFromOther() {
    gInternational.isBack = true;
}


function init() {
    angular.module('EbankApp').controller('international_trans_create_1', function ($scope, requestMBServiceCorp) {
        //navController.getBottomBar().hide();
        if(!gInternational.isBack){
            document.getElementById('id.international.fee.method').value = (gUserInfo.lang === 'VN') ? CONST_INTERNATIONAL_METHOD_FEE_VN[2] : CONST_INTERNATIONAL_METHOD_FEE_EN[2];
            document.getElementById('id.international.fee.method.value').value = CONST_INTERNATIONAL_METHOD_FEE_KEY[2];
            $scope.selectFeeMethod = gInternational.selectFeeMethod = 'OUR';
            $scope.chargeOUR = 0;

            if (gInternational.list_src_Account.length == 0){
                document.getElementById('id.international.account.VND').disabled = true;
            }else {
                document.getElementById('id.international.account.VND').disabled = false;
            }

            if (typeof gInternational.sendMethod != "undefined" && gInternational.sendMethod != null) {
                document.getElementById("id.notifyTo").value = CONST_STR.get("COM_NOTIFY_" + gInternational.sendMethod);
                // if (gInternational.sendMethod == 0) {
                //     document.getElementById("tr.list-receiver").style.display = "none";
                // }
            }

            for (var i in gInternational.list_Promocode){
                if (gInternational.list_Promocode[i].PROMOCODE === 'PROMOCODE'){
                    gInternational.promocode = gInternational.list_Promocode[i];
                    break;
                }
            }

            for (var i in gInternational.list_Rate) {
                var objCurrency = gInternational.list_Rate[i]; //JSON.parse(gInternational.list_Rate[i]);
                if (objCurrency.CCY1 === 'USD'){
                    gInternational.USD = objCurrency;
                    break;
                }
            }



            document.getElementById('id.international.fee.exchange.amount').value = formatCurrentWithSysbol(parseFloat(gInternational.promocode.CHARGE)*1.1, "") + " %";
            document.getElementById('id.international.electricharge.amount').value = formatCurrentWithSysbol(parseFloat(gInternational.promocode.ELECTRICCHARGE)*1.1, "") + ' USD';
            document.getElementById('id.international.fee.our.amount').value = formatCurrentWithSysbol($scope.chargeOUR, "");

        }else {
            $scope.selectFeeMethod = gInternational.selectFeeMethod;
            $scope.promocode = gInternational.info.promocode;
            $scope.totalCurrency = formatCurrentWithSysbol(gInternational.info.totalCurrency, "");
            $scope.debitAmountCurrency = formatCurrentWithSysbol(gInternational.info.debitAmountCurrency, "");
            for (var i in gInternational.list_Rate) {
                var objCurrency = gInternational.list_Rate[i] //JSON.parse(gInternational.list_Rate[i]);
                if (objCurrency.CCY1 === 'USD'){
                    gInternational.USD = objCurrency;
                    break;
                }
            }

            // gInternational.info.promocode = gInternational.promocode.PROMOCODE;
            // gInternational.info.currencyType = {};
            // gInternational.info.currencyType.name = document.getElementById('id.international.currency').value;
            // gInternational.info.currencyType.value = document.getElementById('id.international.currency.value').value;
            // gInternational.info.totalCurrency = removeSpecialChar(document.getElementById('idInternationalTotalCurrency').value);
            // gInternational.info.debitAccountCurrency = document.getElementById('id.international.debit.account.currency.value').value;
            // gInternational.info.debitAmountCurrency = removeSpecialChar(document.getElementById('idInternationalDebitAmount').value);
            // gInternational.info.sourceAccount = document.getElementById('id.international.account.VND.value').value;
            // gInternational.info.foreginExchangeRate = removeSpecialChar(document.getElementById('id.international.foregin.exchange.rate').value);
            // gInternational.info.debitAmountSource = removeSpecialChar(document.getElementById('id.international.debit.amount.VND').value);
            // gInternational.info.feeMethod = {};
            // gInternational.info.feeMethod.name = document.getElementById('id.international.fee.method').value;
            // gInternational.info.feeMethod.value = document.getElementById('id.international.fee.method.value').value;
            // gInternational.info.feeExchangeAmount = removeSpecialChar(document.getElementById('id.international.fee.exchange.amount.value').value);
            // gInternational.info.electrichargesAmount = removeSpecialChar(document.getElementById('id.international.electricharge.amount.value').value);
            // gInternational.info.feeOURAmount = removeSpecialChar(document.getElementById('id.international.fee.our.amount.value').value);
            // gInternational.info.accountCharges = document.getElementById('id.international.account.charges.value').value;
        }

        function hidenNoteFee(selectFeeMethod, ccy) {
            if(ccy != 'USD' && selectFeeMethod == 'OUR'){
                document.getElementById("noteInter").style.display = 'block';
            }else {
                document.getElementById("noteInter").style.display = 'none';
            }
        }

        function formatCurrentWithSysbol(n, currency) {

            var k;
            k = currency + "" + Math.abs(n).toFixed(2).replace(/./g, function(c, i, a) {
                    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                });
            if(k.substr(k.length - 2, k.length)==='00')
            {
                k = k.substr(0,k.length - 3);
            }
            return k;
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
        var handleSelectionDialogListClose = function (e) {
            removeEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
        };

        var handleSelectionDialogtList = function (e){
            switch (flag){
                case 10:
                    if(currentPage == 'international_payments/international_money_trans/international_trans_create_1'){
                        $scope.chargeOUR = parseFloat(e.selectedValue2);
                        document.getElementById('id.international.fee.our.amount').value = formatCurrentWithSysbol($scope.chargeOUR, "") + " " + e.selectedValue1;
                        document.getElementById('id.international.currency').value = e.selectedValue1;
                        document.getElementById('id.international.currency.value').value = e.selectedValue1;
                        document.getElementById('id.international.sourceAccount.balance').innerHTML = "";
                        document.getElementById('id.international.sourceAccount.balance.VND').innerHTML = "";
                        // document.getElementById("trans.amounttotext").innerHTML = "";
                        document.getElementById("idInternationalTotalCurrency").value = "";
                        document.getElementById("idInternationalDebitAmount").value = "0";
                        document.getElementById("id.international.debit.amount.VND").value = "";

                        // caculatorFeeAmount();

                        document.getElementById('id.international.debit.account.currency').value = CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER');
                        document.getElementById('id.international.debit.account.currency.value').value = "";

                        document.getElementById('id.international.account.VND').value = CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER');
                        document.getElementById('id.international.account.VND.value').value = "";

                        // if (gInternational.list_Rate.length != 1){
                        //     var currency = e.selectedValue1;
                        //
                        // }else {
                        //     document.getElementById('id.international.foregin.exchange.rate').value = formatNumberToCurrency(gInternational.list_Rate.SALE_RATE);
                        // }
                        var currency = e.selectedValue1;

                        hidenNoteFee(gInternational.selectFeeMethod, currency);

                        for (var i in gInternational.list_Rate){
                            var objCurrency = gInternational.list_Rate[i];  //JSON.parse(gInternational.list_Rate[i]);
                            if (currency === objCurrency.CCY1 && objCurrency.CCY2 === 'VND'){
                                document.getElementById('id.international.foregin.exchange.rate').value = formatCurrentWithSysbol(objCurrency.SALE_RATE, "");
                                break;
                            }
                        }
                        if(currency == 'USD'){
                            document.getElementById('noteInter').style.display='none';
                        }else{
                            document.getElementById('noteInter').style.display='';
                        }

                        caculatorFeeAmount();

                        if (gInternational.list_Account_Currency.length != 0){
                            for (var i in gInternational.list_Account_Currency){
                                var currency = e.selectedValue1;
                                if (currency != gInternational.list_Account_Currency[i].CCY && i == gInternational.list_Account_Currency.length - 1){
                                    document.getElementById('id.international.debit.account.currency').disabled = true;
                                    document.getElementById('idInternationalDebitAmount').disabled = true;
                                    break;
                                }else if(currency == gInternational.list_Account_Currency[i].CCY) {
                                    document.getElementById('id.international.debit.account.currency').disabled = false;
                                    document.getElementById('idInternationalDebitAmount').disabled = false;
                                    break;
                                }
                            }

                        }else{
                            document.getElementById('id.international.debit.account.currency').disabled = true;
                            document.getElementById('idInternationalDebitAmount').disabled = true;
                        }

                        var date_open ;
                        var date_close;
                        //check hạn mức lần
                        for (var i in gInternational.list_Limit){
                            var objLimit = gInternational.list_Limit[i]; //JSON.parse(gInternational.list_Limit[i]);
                            if (e.selectedValue1 == objLimit.CURRENCY){
                                var limit = objLimit;
                                date_open = limit.OPEN_DATE;
                                date_close = limit.CLOSE_DATE;
                                break;
                            }
                        }

                        var open = date_open.split(":");
                        var openTime = new Date();
                        openTime.setHours(parseFloat(open[0]));
                        openTime.setMinutes(parseFloat(open[1]));
                        openTime.setSeconds(parseFloat(open[2]));

                        var close = date_close.split(":");
                        var now = new Date();

                        var closeTime = new Date();

                        var array_date = [date_open, date_close];
                        if (now.getTime() < openTime.getTime()){
                            showAlertText(formatString(CONST_STR.get('INTERNATIONAL_MESSAGE_LIMIT_TIME'),
                                array_date));
                            document.getElementById('btnContinute').disabled = true;
                        }else if (now.getTime() > closeTime.getTime()){
                            showAlertText(formatString(CONST_STR.get('INTERNATIONAL_MESSAGE_LIMIT_TIME'),
                                array_date));
                            document.getElementById('btnContinute').disabled = true;
                        }else {
                            document.getElementById('btnContinute').disabled = false;
                        }


                        break;
                    }
                case 11:
                    document.getElementById('id.international.debit.account.currency').value = e.selectedValue1;
                    document.getElementById('id.international.debit.account.currency.value').value = e.selectedValue1;
                    document.getElementById('id.international.sourceAccount.balance').innerHTML = e.selectedValue2;

                    break;
                case 12:
                    document.getElementById('id.international.account.VND').value = e.selectedValue1;
                    document.getElementById('id.international.account.VND.value').value = e.selectedValue1;
                    document.getElementById('id.international.sourceAccount.balance.VND').innerHTML = e.selectedValue2;
                    break;
                case 13:
                    document.getElementById('id.international.fee.method').value = e.selectedValue1;
                    document.getElementById('id.international.fee.method.value').value = e.selectedValue2;
                    $scope.selectFeeMethod = e.selectedValue2;
                    gInternational.selectFeeMethod = e.selectedValue2;
                    hidenNoteFee(gInternational.selectFeeMethod, document.getElementById('id.international.currency.value').value);
                    $scope.$apply();

                    caculatorFeeAmount();

                    break;
                case 14:
                    document.getElementById('id.international.account.charges').value = e.selectedValue1;
                    document.getElementById('id.international.account.charges.value').value = e.selectedValue1;
                    document.getElementById('id.international.sourceAccount.balance.charges').innerHTML = e.selectedValue2;
                    break;
            }
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                bottomBar.show();
            }else{
                bottomBar.hide();                
            }
        }
        
        $scope.showInternationalCurrency = function () {
            flag = 10;
            var cbxInternational = [];
            var cbxInternationalKey = [];
            for (var i in gInternational.list_Currency){
                var curency = gInternational.list_Currency[i]; //JSON.parse(gInternational.list_Currency[i]);
                cbxInternational.push(curency.CCY);
                cbxInternationalKey.push(curency.COSTOUR);
            }
            addEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
            showDialogList(CONST_STR.get('ESAVING_CHANGEINFO_INPUT_ACCTMONEY'), cbxInternational, cbxInternationalKey, false);
        }

        //Action when click show ReceiverList
        $scope.showReceiverList = function () {
            gInternational.info.promocode = (gInternational.promocode.PROMOCODE == 'PROMOCODE') ? "" : gInternational.promocode.PROMOCODE;
            gInternational.info.currencyType = {};
            gInternational.info.currencyType.name = document.getElementById('id.international.currency').value;
            gInternational.info.currencyType.value = document.getElementById('id.international.currency.value').value;
            gInternational.info.totalCurrency = removeSpecialChar(document.getElementById('idInternationalTotalCurrency').value);
            gInternational.info.debitAccountCurrency = document.getElementById('id.international.debit.account.currency.value').value;
            gInternational.info.debitAmountCurrency = removeSpecialChar(document.getElementById('idInternationalDebitAmount').value);
            gInternational.info.sourceAccount = document.getElementById('id.international.account.VND.value').value;
            gInternational.info.foreginExchangeRate = removeSpecialChar(document.getElementById('id.international.foregin.exchange.rate').value);
            gInternational.info.debitAmountSource = removeSpecialChar(document.getElementById('id.international.debit.amount.VND').value);
            gInternational.info.feeMethod = {};
            gInternational.info.feeMethod.name = document.getElementById('id.international.fee.method').value;
            gInternational.info.feeMethod.value = document.getElementById('id.international.fee.method.value').value;
            gInternational.info.feeExchangeAmount = removeSpecialChar(document.getElementById('id.international.fee.exchange.amount.value').value);
            gInternational.info.electrichargesAmount = removeSpecialChar(document.getElementById('id.international.electricharge.amount.value').value);
            gInternational.info.feeOURAmount = removeSpecialChar(document.getElementById('id.international.fee.our.amount.value').value);
            gInternational.info.accountCharges = document.getElementById('id.international.account.charges.value').value;
            gInternational.info.approver = document.getElementById('id.notifyTo').value;
            
            updateAccountListInfo();
            navController.pushToView("common/com_list_user_approve", true, 'html');
        }

        $scope.showInternationalAccountCurrency = function () {
            var currency = document.getElementById('id.international.currency.value').value;
            if (currency.length != 0){
                flag = 11;
                var cbxInternational = [];
                var cbxInternationalKey = [];
                for (var i in gInternational.list_Account_Currency){
                    if (currency == gInternational.list_Account_Currency[i].CCY){
                        cbxInternational.push(gInternational.list_Account_Currency[i].CUST_AC_NO);
                        cbxInternationalKey.push(formatCurrentWithSysbol(gInternational.list_Account_Currency[i].BALANCE, "")+ " " + document.getElementById('id.international.currency.value').value);
                    }
                }
                if (cbxInternational.length != 0){
                    addEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
                    showDialogList(CONST_STR.get('FOREGIN_ACCOUNT'), cbxInternational, cbxInternationalKey, true);
                }else {
                    showAlertText(CONST_STR.get('INTERNATIONAL_EMPTY_ACC_CURRENCY'));
                }

            }else {
                showAlertText(CONST_STR.get('INTERNATIONAL_CHOOSE_CURRENCY_TPE'));
            }


        }

        $scope.showInternationalSourceAccount = function () {
            flag = 12;
            var cbxInternational = [];
            var cbxInternationalKey = [];
            for (var i in gInternational.list_src_Account){
                cbxInternational.push(gInternational.list_src_Account[i].CUST_AC_NO);
                cbxInternationalKey.push(formatNumberToCurrency(gInternational.list_src_Account[i].BALANCE)+' VND');
            }
            addEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
            showDialogList(CONST_STR.get('ACCOUNT_VND'), cbxInternational, cbxInternationalKey, true);
        }

        $scope.showPromocode = function () {
            gTrans.dialog = new DiaLogListInputPromocode(CONST_STR.get('INTERNATIONAL_DETAIL_PROMOCODE'));
            gTrans.dialog.showDialog(gInternational.promocode);
        }

        
        function removeCharSpecialCurrency(des, maxlen) {
            if (maxlen != undefined && maxlen != null) {
                textLimit(des, maxlen);
            }

            var tmpVale = des;
            var numStr = keepOnlyNumber(tmpVale);
            des = numStr;
            return des;
        }
        $scope.inputAmountCurrency = function (e) {
            if (document.getElementById('id.international.currency.value').value.length == 0){
                document.getElementById('idInternationalTotalCurrency').value = 0
                showAlertText(CONST_STR.get('INTERNATIONAL_MESSAGE_CURRENCY_PREVIOUS'));
            }else {

                if (document.getElementById('id.international.currency.value').value != 'JPY'){
                    var lengthOf = e.length;
                    var charR = e.slice(parseFloat(lengthOf - 1), lengthOf);
                    var preChar = e.slice(parseFloat(lengthOf - 2), parseFloat(lengthOf - 1))
                    if(charR == '.'){
                        if (preChar == '.'){
                            $scope.totalCurrency = e.replace(".", '');
                        }else {
                            $scope.totalCurrency = e;
                        }
                    }else {

                        // var endlength = e.length;
                        // var startlength = e.indexOf(".");
                        // var strString = e.substring(startlength, endlength);
                        // if (startlength != -1){
                        //     if (strString.length > 3 ){
                        //         $scope.totalCurrency = parseFloat(removeSpecialChar(e)).toFixed(2);
                        //     }else {
                        //         $scope.totalCurrency = parseFloat(removeSpecialChar(e));
                        //     }
                        // }else {
                        //     $scope.totalCurrency = formatNumberToCurrency(removeSpecialChar(e));
                        // }
                        $scope.totalCurrency = $('#idInternationalTotalCurrency').val();
                        var totalCurrency = removeSpecialChar($scope.totalCurrency);
                        totalCurrency = totalCurrency.replace(/[\[\]\/!"#$%&*'’\+\-\_\(\):;<=>?\\`^~{|}]/g, '');

                        var curency_rate = parseFloat(removeSpecialChar(document.getElementById('id.international.foregin.exchange.rate').value));
                        $scope.debitAmountCurrency = 0;
                        if ($scope.debitAmountCurrency != undefined && $scope.debitAmountCurrency != null && $scope.debitAmountCurrency != 0){
                            document.getElementById('id.international.debit.amount.VND').value = formatNumberToCurrency((parseFloat(totalCurrency) - parseFloat(removeSpecialChar($scope.debitAmountCurrency))) * curency_rate);
                        }else {
                            document.getElementById('id.international.debit.amount.VND').value = formatNumberToCurrency(parseFloat(totalCurrency)  * curency_rate);
                        }

                        // if (startlength != -1){
                        //     if (strString.length > 3){
                        //         var str = strString.substring(0, 3);
                        //         $scope.totalCurrency = formatNumberToCurrency($scope.totalCurrency) + str
                        //     }else {
                        //         $scope.totalCurrency = formatNumberToCurrency($scope.totalCurrency) + strString;
                        //     }
                        // }else {
                        //     $scope.totalCurrency = formatNumberToCurrency($scope.totalCurrency)
                        // }
                        caculatorFeeAmount();


                        // var numStr = convertNum2WordWithLang(keepOnlyNumber($scope.totalCurrency), gUserInfo.lang);
                        // if (gUserInfo.lang == 'VN'){
                        //     var unit = document.getElementById('id.international.currency.value').value;
                        //     numStr = numStr.replace("đồng", unit);
                        // }else {
                        //     var unit = document.getElementById('id.international.currency.value').value;
                        //     numStr = numStr.replace("dong", unit);
                        // }
                        // document.getElementById("trans.amounttotext").innerHTML = numStr;
                    }

                }else {
                    $scope.totalCurrency = formatNumberToCurrency(removeSpecialChar(e));
                    var totalCurrency = removeSpecialChar($scope.totalCurrency);
                    totalCurrency = totalCurrency.replace(/[\[\]\/!"#$%&*'’\+\-\_\(\):;<=>?\\`^~{|}]/g, '');
                    var curency_rate = parseFloat(removeSpecialChar(document.getElementById('id.international.foregin.exchange.rate').value));
                    $scope.debitAmountCurrency = 0;
                    if ($scope.debitAmountCurrency != undefined && $scope.debitAmountCurrency != null && $scope.debitAmountCurrency != 0){
                        document.getElementById('id.international.debit.amount.VND').value = formatNumberToCurrency((parseFloat(totalCurrency) - parseFloat(removeSpecialChar($scope.debitAmountCurrency))) * curency_rate);
                    }else {
                        document.getElementById('id.international.debit.amount.VND').value = formatNumberToCurrency(parseFloat(totalCurrency)  * curency_rate);
                    }

                    $scope.totalCurrency = formatNumberToCurrency($scope.totalCurrency);
                    caculatorFeeAmount();


                    // var numStr = convertNum2WordWithLang(keepOnlyNumber(removeSpecialChar($scope.totalCurrency)), gUserInfo.lang);
                    // if (gUserInfo.lang == 'VN'){
                    //     var unit = document.getElementById('id.international.currency.value').value;
                    //     numStr = numStr.replace("đồng", unit);
                    // }else {
                    //     var unit = document.getElementById('id.international.currency.value').value;
                    //     numStr = numStr.replace("dong", unit);
                    // }
                    // document.getElementById("trans.amounttotext").innerHTML = numStr;
                }



            }
        }

        $scope.paserDebitAmount = function () {
            var totalAmount = parseFloat(removeSpecialChar($scope.totalCurrency));
            var debitAmount = parseFloat(removeSpecialChar($scope.debitAmountCurrency));

            if(debitAmount > totalAmount){
                $("#idInternationalDebitAmount").inputmask("setvalue", totalAmount);
            }
        }

        $scope.inputDebitAmountCurrency = function (e) {
            var totalAmount = parseFloat(removeSpecialChar($scope.totalCurrency));
            var debitAmount = 0;
            if (e.length > 0){
                debitAmount = parseFloat(removeSpecialChar($('#idInternationalDebitAmount').val()));
            }
            if (debitAmount > totalAmount ){
                debitAmount = totalAmount;
                $("#idInternationalDebitAmount").inputmask("setvalue", debitAmount);
            }

            var curency_rate = parseInt(removeSpecialChar(document.getElementById('id.international.foregin.exchange.rate').value));
            // $scope.debitAmountCurrency = formatCurrentWithSysbol(removeSpecialChar(e), "");
            if ($scope.totalCurrency != undefined && $scope.totalCurrency != null ){
                if (parseFloat(totalAmount) >= parseFloat(debitAmount)){
                    document.getElementById('id.international.debit.amount.VND').value = formatNumberToCurrency((parseFloat(totalAmount) - parseFloat(debitAmount)) * curency_rate);
                }else if($scope.debitAmountCurrency.length == 0) {
                    document.getElementById('id.international.debit.amount.VND').value = formatNumberToCurrency(parseFloat(totalAmount)  * curency_rate);
                }

            }else {
                document.getElementById('id.international.debit.amount.VND').value = formatNumberToCurrency(0);
            }

            // $scope.debitAmountCurrency = parseFloat(removeSpecialChar(e)).toFixed(2);
        }

        $scope.showInternationalFeeMethod = function () {
            var currency = document.getElementById('id.international.currency.value').value;
            if (currency.length != 0){
                flag = 13;
                var cbxInternational = [];
                var cbxInternationalKey = [];
                if (gUserInfo.lang === 'VN') {
                    cbxInternational = CONST_INTERNATIONAL_METHOD_FEE_VN;
                    cbxInternationalKey = CONST_INTERNATIONAL_METHOD_FEE_KEY;
                } else {
                    cbxInternational = CONST_INTERNATIONAL_METHOD_FEE_EN;
                    cbxInternationalKey = CONST_INTERNATIONAL_METHOD_FEE_KEY;
                }
                addEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
                showDialogList(CONST_STR.get('INTERNATIONAL_FEE_METHOD'), cbxInternational, cbxInternationalKey, false);
            }else {
                showAlertText(CONST_STR.get('INTERNATIONAL_CHOOSE_CURRENCY_TPE'));
            }


        }

        $scope.showInternationalAccountCharges = function () {
            flag = 14;
            var cbxInternational = [];
            var cbxInternationalKey = [];
            for (var i in gInternational.list_src_Account){
                cbxInternational.push(gInternational.list_src_Account[i].CUST_AC_NO);
                cbxInternationalKey.push(formatNumberToCurrency(gInternational.list_src_Account[i].BALANCE)+' VND');
            }
            addEventListenerToCombobox(handleSelectionDialogtList, handleSelectionDialogListClose);
            showDialogList(CONST_STR.get('INTERNATIONAL_ACCOUNT_CHARGES'), cbxInternational, cbxInternationalKey, true);
        }

        function checkPromocode(promocode) {
            var startDate = "";
            var endDate = "";
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!

            var yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd
            }
            if(mm<10){
                mm='0'+mm
            }

            var currentDate = new Date();
            var strCurrentDate = dd+'/'+mm+'/'+yyyy;;
            if (promocode.SCOPES == 'ONE') {
                endDate = promocode.DATEVALUETO;
                startDate = promocode.DATEVALUEFROM;
                var cif = gUserInfo.accountList[0].accountNumber.substring(0, 8);

                if (promocode.CIF != cif) {
                    showAlertText(CONST_STR.get('INTERNATIONAL_PROMOCODE_ONE'));
                    document.getElementById('id.international.promocode').value = "";
                    return false;
                }

                if (promocode.CIF == cif && promocode.ISUSED == 'Y' && promocode.PROMOCODETYPES == '1') {
                    showAlertText(CONST_STR.get("INTERNATIONAL_PROMOCODE_ONE_USED"));
                    document.getElementById('id.international.promocode').value = "";
                    return false;
                }

                if (calculateDifferentMonthLess(strCurrentDate, startDate)) {
                    showAlertText(CONST_STR.get("INTERNATIONAL_PROMOCODE_ONE_FROMDATE"));
                    document.getElementById('id.international.promocode').value = "";
                    return false;
                }

                if (calculateDifferentMonth(strCurrentDate, endDate)) {
                    showAlertText(CONST_STR.get("INTERNATIONAL_PROMOCODE_ONE_TODATE"));
                    document.getElementById('id.international.promocode').value = "";
                    return false;
                }
            } else if (promocode.SCOPES == 'All') {
                startDate = promocode.DATEVALUEFROM;
                endDate = promocode.DATEVALUETO;
                if (promocode.PROMOCODETYPES == '1' && promocode.ISUSED == 'Y') {
                    showAlertText(CONST_STR.get("INTERNATIONAL_PROMOCODE_ONE_USED"));
                    document.getElementById('id.international.promocode').value = "";
                    return false;

                }

                if (calculateDifferentMonthLess(strCurrentDate, startDate)) {
                    showAlertText(CONST_STR.get("INTERNATIONAL_PROMOCODE_ONE_FROMDATE"));
                    document.getElementById('id.international.promocode').value = "";
                    return false;
                }

                if (calculateDifferentMonth(strCurrentDate, endDate)) {
                    showAlertText(CONST_STR.get("INTERNATIONAL_PROMOCODE_ONE_TODATE"));
                    document.getElementById('id.international.promocode').value = "";
                    return false;
                }

            }
            return true;
        }
        
        $scope.onCheckPromocode = function () {
            var strPromocode = document.getElementById('id.international.promocode').value.trim();
            document.getElementById('id.international.promocode').value = strPromocode;
            if (strPromocode.length != 0){
                for (var i in gInternational.list_Promocode){
                    if ($scope.promocode === gInternational.list_Promocode[i].PROMOCODE){
                        if (!checkPromocode(gInternational.list_Promocode[i])) return;

                        gInternational.promocode = gInternational.list_Promocode[i];

                        document.getElementById("id.international.desPromocode").style.display = 'block';

                        document.getElementById('id.international.fee.exchange.amount').value = formatCurrentWithSysbol(parseFloat(gInternational.promocode.CHARGE)*1.1, "") + " %";
                        document.getElementById('id.international.electricharge.amount').value = formatCurrentWithSysbol(parseFloat(gInternational.promocode.ELECTRICCHARGE)*1.1, "") + ' USD';


                        //tính phí
                        caculatorFeeAmount();
                        break;
                    }else if($scope.promocode != gInternational.list_Promocode[i].PROMOCODE && i == gInternational.list_Promocode.length -1) {

                        showAlertText(CONST_STR.get('INTERNATIONA_PROMOCODE_ERROR'));
                        $scope.promocode = '';
                        for (var i in gInternational.list_Promocode){
                            if (gInternational.list_Promocode[i].PROMOCODE === 'PROMOCODE'){
                                gInternational.promocode = gInternational.list_Promocode[i];
                                break;
                            }
                        }

                        document.getElementById('id.international.fee.exchange.amount').value = formatCurrentWithSysbol(parseFloat(gInternational.promocode.CHARGE)*1.1, "") + " %";
                        document.getElementById('id.international.electricharge.amount').value = formatCurrentWithSysbol(parseFloat(gInternational.promocode.ELECTRICCHARGE)*1.1, "") + ' USD';
                        document.getElementById('id.international.fee.our.amount').value = formatCurrentWithSysbol($scope.chargeOUR, "") + " USD";
                        document.getElementById("id.international.desPromocode").style.display = 'none';

                        caculatorFeeAmount();
                    }
                }
            }else{
                document.getElementById('id.international.promocode').value = "";
                for (var i in gInternational.list_Promocode){
                    if (gInternational.list_Promocode[i].PROMOCODE === 'PROMOCODE'){
                        gInternational.promocode = gInternational.list_Promocode[i];
                        break;
                    }
                }
                document.getElementById('id.international.fee.exchange.amount').value = formatCurrentWithSysbol(parseFloat(gInternational.promocode.CHARGE)*1.1, "") + " %";
                document.getElementById('id.international.electricharge.amount').value = formatCurrentWithSysbol(parseFloat(gInternational.promocode.ELECTRICCHARGE)*1.1, "") + ' USD';
                document.getElementById('id.international.fee.our.amount').value = formatCurrentWithSysbol($scope.chargeOUR, "") + " USD";
                document.getElementById("id.international.desPromocode").style.display = 'none';

                caculatorFeeAmount();
            }
        }

        $scope.onBackClick = function () {
            navController.popView(true);
        }
        
        $scope.onContinuteClick = function () {
            // if (gInternational.promocode.PROMOCODE == 'PROMOCODE'){
            //     gInternational.info.promocode = "";
            // }else {
            //     gInternational.info.promocode = gInternational.promocode.PROMOCODE;
            // }
            gInternational.info.promocode = "";
            gInternational.info.currencyType = {};
            gInternational.info.currencyType.name = document.getElementById('id.international.currency').value;
            gInternational.info.currencyType.value = document.getElementById('id.international.currency.value').value;
            gInternational.info.totalCurrency = removeSpecialChar(document.getElementById('idInternationalTotalCurrency').value);
            gInternational.info.debitAccountCurrency = document.getElementById('id.international.debit.account.currency.value').value;
            gInternational.info.debitAmountCurrency = removeSpecialChar(document.getElementById('idInternationalDebitAmount').value);
            gInternational.info.sourceAccount = document.getElementById('id.international.account.VND.value').value;
            gInternational.info.foreginExchangeRate = removeSpecialChar(document.getElementById('id.international.foregin.exchange.rate').value);
            gInternational.info.debitAmountSource = removeSpecialChar(document.getElementById('id.international.debit.amount.VND').value);
            gInternational.info.feeMethod = {};
            gInternational.info.feeMethod.name = document.getElementById('id.international.fee.method').value;
            gInternational.info.feeMethod.value = document.getElementById('id.international.fee.method.value').value;
            gInternational.info.feeExchangeAmount = removeSpecialChar(document.getElementById('id.international.fee.exchange.amount.value').value);
            gInternational.info.electrichargesAmount = removeSpecialChar(document.getElementById('id.international.electricharge.amount.value').value);
            gInternational.info.feeOURAmount = removeSpecialChar(document.getElementById('id.international.fee.our.amount.value').value);
            gInternational.info.accountCharges = document.getElementById('id.international.account.charges.value').value;
            gInternational.info.approver = document.getElementById('id.notifyTo').value;
            
            if (gInternational.info.feeMethod.value == 'BEN'){
                gInternational.info.accountCharges = "";
            }
            
            gInternational.JSONRequest = {};
            gInternational.JSONRequest.transType = gInternational.info.transtype.value;
            gInternational.JSONRequest.transtypeName = gInternational.info.transtype.name;
            gInternational.JSONRequest.purpose = gInternational.info.purpose.value;
            gInternational.JSONRequest.purposeName = gInternational.info.purpose.name;
            gInternational.JSONRequest.nameOfferor = gInternational.info.nameOfferor;
            gInternational.JSONRequest.addressOferor = gInternational.info.addressOferor;
            gInternational.JSONRequest.nameBen = gInternational.info.nameBen;
            gInternational.JSONRequest.addressBen = gInternational.info.addressBen;
            gInternational.JSONRequest.nationBen = gInternational.info.nationBen.value;
            gInternational.JSONRequest.nationBenName = gInternational.info.nationBen.name;
            gInternational.JSONRequest.accountBen = gInternational.info.accountBen;
            gInternational.JSONRequest.content = gInternational.info.content;
            gInternational.JSONRequest.transMethod = gInternational.info.transMethod.value;
            gInternational.JSONRequest.transMethodName = gInternational.info.transMethod.name;
            gInternational.JSONRequest.swifCode = gInternational.info.swifCode;
            gInternational.JSONRequest.interMediaryBank = gInternational.info.interMediaryBank.value;
            (gInternational.JSONRequest.interMediaryBank.length > 0) ? gInternational.JSONRequest.interMediaryBankName = gInternational.info.interMediaryBank.name : gInternational.JSONRequest.interMediaryBankName = null;
            gInternational.JSONRequest.transMethodNHTG = gInternational.info.transMethodNHTG.value;
            gInternational.JSONRequest.transMethodNHTGName = gInternational.info.transMethodNHTG.name;
            gInternational.JSONRequest.swiftCodeNHTG = gInternational.info.swiftCodeNHTG;
            gInternational.JSONRequest.NHTG =  gInternational.info.NHTG.name;
            gInternational.JSONRequest.addressNHTG = gInternational.info.addressNHTG;
                gInternational.JSONRequest.issavepayee = gInternational.info.managerBen.value;
            gInternational.JSONRequest.managerBenName = gInternational.info.managerBen.name;
            gInternational.JSONRequest.promocode = gInternational.info.promocode;
            gInternational.JSONRequest.currencyType = gInternational.info.currencyType.value;
            gInternational.JSONRequest.totalCurrency = gInternational.info.totalCurrency;
            gInternational.JSONRequest.debitAccountCurrency = gInternational.info.debitAccountCurrency;
            gInternational.JSONRequest.debitAmountCurrency = gInternational.info.debitAmountCurrency;
            gInternational.JSONRequest.sourceAccount = gInternational.info.sourceAccount;
            gInternational.JSONRequest.foreginExchangeRate = gInternational.info.foreginExchangeRate;
            gInternational.JSONRequest.debitAmountSource = gInternational.info.debitAmountSource;
            gInternational.JSONRequest.feeMethod = gInternational.info.feeMethod.value;
            gInternational.JSONRequest.feeMethodName = gInternational.info.feeMethod.name;
            gInternational.JSONRequest.feeExchangeAmount = gInternational.info.feeExchangeAmount;
            gInternational.JSONRequest.electrichargesAmount = gInternational.info.electrichargesAmount;
            gInternational.JSONRequest.feeOURAmount =  gInternational.info.feeOURAmount;
            gInternational.JSONRequest.accountCharges = gInternational.info.accountCharges;
            gInternational.JSONRequest.benBankName = gInternational.info.benBankName
            gInternational.JSONRequest.nationBankBen = gInternational.info.nationBankBen.value;
            gInternational.JSONRequest.nationBankBenName = gInternational.info.nationBankBen.name;
            gInternational.JSONRequest.sampleName = gInternational.info.managerBenInputName;
            gInternational.JSONRequest.nationBankNHTG = gInternational.info.nationBankNHTG.value;
            gInternational.JSONRequest.nationBankNHTGName = (gInternational.info.interMediaryBank.value == 'IBN') ? "" : gInternational.info.nationBankNHTG.name;
            gInternational.JSONRequest.benBankAddress = gInternational.info.benBankAddress;
            gInternational.JSONRequest.beneIds = gInternational.info.beneIds;
            
            if (!validate()) return;
                
            var jsonData = new Object();
            jsonData.sequence_id = "2";
            jsonData.idtxn = gInternational.idtxn;
            jsonData.transInfo = gInternational.JSONRequest;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_PAYMENT_INTERNATIONAL"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode === '0'){
                    gInternational.info.idfcatref = response.respJsonObj.idfcatref;
                    gInternational.info.documentInfo = response.respJsonObj.doc_info;
                    navCachedPages['international_payments/international_money_trans/international_trans_checklist'] = null;
                    navController.pushToView('international_payments/international_money_trans/international_trans_checklist', true, 'html');
                    
                }else {
                    showAlertText(response.respContent);
                    // gotoHomePage();
                }
            });
            

        }

        //tính phí
        function caculatorFeeAmount() {
                var totalCurrency = 0;
                if (document.getElementById('idInternationalTotalCurrency').value != ''){
                    totalCurrency = removeSpecialChar(document.getElementById('idInternationalTotalCurrency').value);
                    totalCurrency = parseFloat(totalCurrency);
                }
                var feeRate = removeSpecialChar(document.getElementById('id.international.fee.exchange.amount').value);
                feeRate = parseFloat(feeRate);
                var electricRate = removeSpecialChar(document.getElementById('id.international.electricharge.amount').value);
                electricRate = parseFloat(electricRate);
                var ourRate = removeSpecialChar(document.getElementById('id.international.fee.our.amount').value);
                ourRate = parseFloat(ourRate);
                var rate = removeSpecialChar(document.getElementById('id.international.foregin.exchange.rate').value);
                rate = parseFloat(rate);

                if(document.getElementById('id.international.fee.method.value').value == 'BEN'){
                    if (document.getElementById('id.international.currency.value').value != 'JPY'){
                        if (totalCurrency*feeRate/100 < parseFloat(gInternational.promocode.MIN)/parseFloat(rate)){
                            document.getElementById('id.international.fee.exchange.amount.value').value = formatCurrentWithSysbol(gInternational.promocode.MIN/rate, "") + " " + document.getElementById('id.international.currency.value').value;
                            document.getElementById('id.international.electricharge.amount.value').value = formatCurrentWithSysbol(electricRate*gInternational.USD.SALE_RATE/rate, "") + " "  + document.getElementById('id.international.currency.value').value;
                            document.getElementById('id.international.fee.our.amount.value').value = 0;
                        }else if (totalCurrency*feeRate/100 > parseFloat(gInternational.promocode.MAX)/parseFloat(rate)){
                            document.getElementById('id.international.fee.exchange.amount.value').value = formatCurrentWithSysbol(gInternational.promocode.MAX/rate, "") + " " + document.getElementById('id.international.currency.value').value;
                            document.getElementById('id.international.electricharge.amount.value').value = formatCurrentWithSysbol(electricRate*gInternational.USD.SALE_RATE/rate, "") + " "  + document.getElementById('id.international.currency.value').value;
                            document.getElementById('id.international.fee.our.amount.value').value = 0;
                        }else {
                            document.getElementById('id.international.fee.exchange.amount.value').value = formatCurrentWithSysbol(totalCurrency*feeRate/100, "") + " " + document.getElementById('id.international.currency.value').value;
                            document.getElementById('id.international.electricharge.amount.value').value = formatCurrentWithSysbol(electricRate*gInternational.USD.SALE_RATE/rate, "") + " "  + document.getElementById('id.international.currency.value').value;
                            document.getElementById('id.international.fee.our.amount.value').value = 0;
                        }
                        
                    }else {
                        if (totalCurrency*feeRate/100 < parseFloat(gInternational.promocode.MIN)/parseFloat(rate)){
                            document.getElementById('id.international.fee.exchange.amount.value').value = formatNumberToCurrency(gInternational.promocode.MIN/rate, "") + " " + document.getElementById('id.international.currency.value').value;
                            document.getElementById('id.international.electricharge.amount.value').value = formatNumberToCurrency(electricRate*gInternational.USD.SALE_RATE/rate, "") + " "  + document.getElementById('id.international.currency.value').value;
                            document.getElementById('id.international.fee.our.amount.value').value = 0;
                        }else if (totalCurrency*feeRate/100 > parseFloat(gInternational.promocode.MAX)/parseFloat(rate)){
                            document.getElementById('id.international.fee.exchange.amount.value').value = formatNumberToCurrency(gInternational.promocode.MAX/rate, "") + " " + document.getElementById('id.international.currency.value').value;
                            document.getElementById('id.international.electricharge.amount.value').value = formatNumberToCurrency(electricRate*gInternational.USD.SALE_RATE/rate, "") + " "  + document.getElementById('id.international.currency.value').value;
                            document.getElementById('id.international.fee.our.amount.value').value = 0;
                        }else {
                            document.getElementById('id.international.fee.exchange.amount.value').value = formatNumberToCurrency(totalCurrency*feeRate/100, "") + " " + document.getElementById('id.international.currency.value').value;
                            document.getElementById('id.international.electricharge.amount.value').value = formatNumberToCurrency(electricRate*gInternational.USD.SALE_RATE/rate, "") + " "  + document.getElementById('id.international.currency.value').value;
                            document.getElementById('id.international.fee.our.amount.value').value = 0;
                        }

                    }
                }

                if(document.getElementById('id.international.fee.method.value').value == 'SHA'){
                    if(totalCurrency*feeRate/100*rate < parseFloat(gInternational.promocode.MIN)){
                        document.getElementById('id.international.fee.exchange.amount.value').value = formatNumberToCurrency(gInternational.promocode.MIN) + ' VND';
                        document.getElementById('id.international.electricharge.amount.value').value = formatNumberToCurrency(electricRate*gInternational.USD.SALE_RATE) + 'VND';
                        document.getElementById('id.international.fee.our.amount.value').value = 0;
                    }else if(totalCurrency*feeRate/100*rate > parseFloat(gInternational.promocode.MAX)){
                        document.getElementById('id.international.fee.exchange.amount.value').value = formatNumberToCurrency(gInternational.promocode.MAX) + ' VND';
                        document.getElementById('id.international.electricharge.amount.value').value = formatNumberToCurrency(electricRate*gInternational.USD.SALE_RATE) + 'VND';
                        document.getElementById('id.international.fee.our.amount.value').value = 0;
                    }else {
                        document.getElementById('id.international.fee.exchange.amount.value').value = formatNumberToCurrency(totalCurrency*feeRate/100*rate) + ' VND';
                        document.getElementById('id.international.electricharge.amount.value').value = formatNumberToCurrency(electricRate*gInternational.USD.SALE_RATE) + 'VND';
                        document.getElementById('id.international.fee.our.amount.value').value = 0;
                    }

                }

                if(document.getElementById('id.international.fee.method.value').value == 'OUR'){
                    if (totalCurrency*feeRate/100*rate < parseFloat(gInternational.promocode.MIN)){
                        document.getElementById('id.international.fee.exchange.amount.value').value = formatNumberToCurrency(gInternational.promocode.MIN) + ' VND';
                        document.getElementById('id.international.electricharge.amount.value').value = formatNumberToCurrency(electricRate*gInternational.USD.SALE_RATE) + ' VND';
                        document.getElementById('id.international.fee.our.amount.value').value = formatNumberToCurrency(ourRate*rate) + " VND";
                    }else if(totalCurrency*feeRate/100*rate > parseFloat(gInternational.promocode.MAX)){
                        document.getElementById('id.international.fee.exchange.amount.value').value = formatNumberToCurrency(gInternational.promocode.MAX) + ' VND';
                        document.getElementById('id.international.electricharge.amount.value').value = formatNumberToCurrency(electricRate*gInternational.USD.SALE_RATE) + ' VND';
                        document.getElementById('id.international.fee.our.amount.value').value = formatNumberToCurrency(ourRate*rate) + " VND";
                    }else {
                        document.getElementById('id.international.fee.exchange.amount.value').value = formatNumberToCurrency(totalCurrency*feeRate/100*rate) + ' VND';
                        document.getElementById('id.international.electricharge.amount.value').value = formatNumberToCurrency(electricRate*gInternational.USD.SALE_RATE) + ' VND';
                        document.getElementById('id.international.fee.our.amount.value').value = formatNumberToCurrency(ourRate*rate) + " VND";
                    }
                }
            }
            
        function validate() {


            if (gInternational.info.currencyType.value == ''){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('INTERNATIONAL_CURRENCY')]));
                return false;
            }

            if (gInternational.info.totalCurrency == ""){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),[CONST_STR.get('INTERNATIONAL_TOTAL_CURRENCY')]));
                return false;
            }

            if (gInternational.info.debitAmountCurrency == ''){
                showAlertText(CONST_STR.get('ERR_INPUT_NO_AMOUNT'));
                return false;
            }

            if (parseFloat(gInternational.info.debitAmountCurrency) > 0 && gInternational.info.debitAccountCurrency == ''){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('INTERNATIONAL_NO_ACCOUNT_CURRENCY')]));
                return false;
            }
            
            // if (parseFloat(removeSpecialChar(gInternational.info.debitAmountCurrency)) > 0 &&
            //     parseFloat(removeSpecialChar(gInternational.info.debitAmountCurrency)) < parseFloat(removeSpecialChar(gInternational.info.totalCurrency)) &&
            //     gInternational.info.sourceAccount == '')
            // {
            //     showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
            //         [CONST_STR.get('INTERNATIONAL_NO_ACCOUNT_VND')]));
            //     return false;
            // }

            if(parseFloat(removeSpecialChar(gInternational.info.debitAmountSource)) != 0 && gInternational.info.sourceAccount == ''){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('INTERNATIONAL_NO_ACCOUNT_VND')]));
                return false;
            }

            if (gInternational.info.feeMethod.value != 'BEN' && gInternational.JSONRequest.accountCharges == ""){
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                    [CONST_STR.get('INTERNATIONAL_ACCOUNT_CHARGES')]));
                return false;
            }

            //Check so dư khả dụng ngoai te
            if(parseFloat(gInternational.info.totalCurrency) == parseFloat(gInternational.info.debitAmountCurrency)){
                var sodukhadung = removeSpecialChar(document.getElementById('id.international.sourceAccount.balance').innerHTML);
                if (parseFloat(gInternational.info.debitAmountCurrency) > parseFloat(sodukhadung)){
                    showAlertText(CONST_STR.get('CORP_MSG_BALANCE_NOT_ENOUGH'));
                    return false;
                }
            }else {

                //check so du tk vnd
                if(gInternational.info.sourceAccount == gInternational.info.accountCharges){
                    var sodukhadung = removeSpecialChar(document.getElementById('id.international.sourceAccount.balance.VND').innerHTML);

                    if (gInternational.info.feeMethod.value == 'OUR'){
                        var charge = parseFloat(gInternational.info.debitAmountSource) + parseFloat(gInternational.info.feeExchangeAmount) + parseFloat(gInternational.info.electrichargesAmount) + parseFloat(gInternational.info.feeOURAmount);
                        if (parseFloat(sodukhadung) < charge){
                            showAlertText(CONST_STR.get('CORP_MSG_BALANCE_NOT_ENOUGH'));
                            return false;
                        }
                    }else if(gInternational.info.feeMethod.value == 'SHA'){
                        var charge = parseFloat(gInternational.info.debitAmountSource) + parseFloat(gInternational.info.feeExchangeAmount) + parseFloat(gInternational.info.electrichargesAmount);
                        if (parseFloat(sodukhadung) < charge){
                            showAlertText(CONST_STR.get('CORP_MSG_BALANCE_NOT_ENOUGH'));
                            return false;
                        }
                    }
                }else {
                    var sodukhadung = removeSpecialChar(document.getElementById('id.international.sourceAccount.balance.VND').innerHTML);
                    var sodukhadungthuphi = removeSpecialChar(document.getElementById('id.international.sourceAccount.balance.charges').innerHTML);

                    if (parseFloat(sodukhadung) < parseFloat(gInternational.info.debitAmountSource)){
                        showAlertText(CONST_STR.get('CORP_MSG_BALANCE_NOT_ENOUGH'));
                        return false;
                    }

                    if(gInternational.info.feeMethod.value == 'OUR'){
                        var charge = parseFloat(gInternational.info.feeExchangeAmount) + parseFloat(gInternational.info.electrichargesAmount) + parseFloat(gInternational.info.feeOURAmount);
                        if (parseFloat(sodukhadungthuphi) < charge){
                            showAlertText(CONST_STR.get('INTERNATIONAL_TOPUP_EXCEED_AVAIL_BALANCE'));
                            return false;
                        }
                    }else if (gInternational.info.feeMethod.value == 'SHA'){
                        var charge = parseFloat(gInternational.info.feeExchangeAmount) + parseFloat(gInternational.info.electrichargesAmount);
                        if (parseFloat(sodukhadungthuphi) < charge){
                            showAlertText(CONST_STR.get('INTERNATIONAL_TOPUP_EXCEED_AVAIL_BALANCE'));
                            return false;
                        }
                    }
                }
            }

           //check phí ben lơn hơn tổng ngoại tệ
            if (gInternational.info.feeMethod.value == 'BEN'){
                var charge = parseFloat(gInternational.info.feeExchangeAmount) + parseFloat(gInternational.info.electrichargesAmount);
                var totalCurrency = gInternational.info.totalCurrency;
                if (parseFloat(totalCurrency) < charge){
                    showAlertText(CONST_STR.get('INTERNATIONAL_INVAL_CHANGE_OUR_CURRENCY'));
                    return false;
                }
            }



            //check hạn mức lần
            for (var i in gInternational.list_Limit){
                var objLimits = gInternational.list_Limit[i]; //JSON.parse(gInternational.list_Limit[i]);
                if (gInternational.info.currencyType.value == objLimits.CURRENCY){
                    var limit = objLimits;
                    if (parseFloat(removeSpecialChar(gInternational.info.totalCurrency)) > parseFloat(limit.TIME_LIMITS)){
                        showAlertText(formatString(CONST_STR.get('INTERNATIONA_MSG_COM_LIMIT_EXCEEDED_TIME'), [formatNumberToCurrency(limit.TIME_LIMITS), gInternational.info.currencyType.value]));
                        return false;
                    }else {
                        break;
                    }
                }
            }

            //Check hạn mức ngày
            var total_day = 0;
            for (var i in gInternational.limit_TotalDay){
                if (gInternational.info.currencyType.value == gInternational.limit_TotalDay[i].CCY){
                    total_day = parseFloat(gInternational.limit_TotalDay[i].LIMIT_DAY);
                    break;
                }
            }

            for (var i in gInternational.list_Limit){
                var objLimits = gInternational.list_Limit[i]; //  JSON.parse(gInternational.list_Limit[i]);
                if (gInternational.info.currencyType.value == objLimits.CURRENCY){
                    var limit = objLimits;
                    if (parseFloat(parseFloat(removeSpecialChar(gInternational.info.totalCurrency)) + total_day) > parseFloat(limit.DAY_LIMITS)){
                        showAlertText(formatString(CONST_STR.get('INTERNATIONA_MSG_COM_LIMIT_EXCEEDED_DAY'), [formatNumberToCurrency(limit.DAY_LIMITS), gInternational.info.currencyType.value]));
                        return false;
                    }else {
                        break;
                    }
                }
            }

            // date_open = dateString2Date(date_open);
            // date_close = dateString2Date(date_close);
            // var now = new Date();
            // if (now.getTime() < date_open.getTime() && now.getTime() > date_close.getTime()){
            //     showAlertText("không thực hiện được giao dịch");
            //     return false;
            // }

            
            return true;
        }

        function dateString2Date(dateString) {
            var now = new Date();
            var day = now.getDate();
            var month = now.getMonth() + 1;
            var year = now.getFullYear();

            dateString = day + "-" + month + "-" + year + " " + dateString;
            
            var dt  = dateString.split(/\-|\s/);
            return new Date(dt.slice(0,3).reverse().join('-') + ' ' + dt[3]);
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


        navController.initBottomBarWithCallBack("international_payments/international_money_trans/international_trans_create_1", arrBottom, "international_trans", function (index) {
            // updateAccountListInfo();
            navCachedPages['common/com_list_user_approve'] = null;
            navController.pushToView("common/com_list_user_approve", true, 'html');
        });
        //giu~ nguyen gia tri da nhap cua man hinh truoc
        gInternational.TotalCurrency = document.getElementById('idInternationalTotalCurrency').value;
        gInternational.debitAmount = document.getElementById('idInternationalDebitAmount').value;
        // dung de phan biet mau chuyen tien, khi sua mau chuyen tien
        gEdit = 1;
        //
        gHisTypeTranfer = 17;
    }
      $scope.initBottomBar();  
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}

function removeChar(e, des, maxlen) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(des, maxlen);
    }

    var tmpVale = des.value;
    var numStr = keepOnlyNumber(tmpVale);
    des.value = numStr;
}

function removeCharNegative(field) {
    field.value = field.value.replace(/\-/gi,"");
}

function calculateDifferentMonth (valFromDate, valToDate) {
    var from = valFromDate.split("/");
    var to = valToDate.split("/");
    var fromDate = new Date(parseInt(from[2], 10), parseInt(from[1], 10) - 1, parseInt(from[0], 10));
    var toDate = new Date(parseInt(to[2], 10), parseInt(to[1], 10) - 1, parseInt(to[0], 10));
    if (fromDate > toDate) {
        return true;
    }
    return false;
}

function calculateDifferentMonthLess (valFromDate, valToDate) {
    var from = valFromDate.split("/");
    var to = valToDate.split("/");
    var fromDate = new Date(parseInt(from[2], 10), parseInt(from[1], 10) - 1, parseInt(from[0], 10));
    var toDate = new Date(parseInt(to[2], 10), parseInt(to[1], 10) - 1, parseInt(to[0], 10));
    if (fromDate < toDate) {
        return true;
    }
    return false;
}

function validatePromocode(des) {
    if (des.value != ""){
        var startDate = "";
        var endDate = "";
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }

        var currentDate = new Date();
        var strCurrentDate = dd+'/'+mm+'/'+yyyy;;

        for (var i in gInternational.list_Promocode){

            if (des.value == gInternational.list_Promocode[i].PROMOCODE){
                if (gInternational.list_Promocode[i].SCOPES == 'ONE'){
                    endDate = gInternational.list_Promocode[i].DATEVALUETO;
                    startDate = gInternational.list_Promocode[i].DATEVALUEFROM;
                    var cif = gUserInfo.accountList[0].accountNumber.substring(0, 8);

                    if (gInternational.list_Promocode[i].CIF != cif){
                        showAlertText(CONST_STR.get('INTERNATIONAL_PROMOCODE_ONE'));
                        des.value = "";
                        return;
                    }

                    if(gInternational.list_Promocode[i].CIF == cif && gInternational.list_Promocode[i].ISUSED == 'Y' && gInternational.list_Promocode[i].PROMOCODETYPES == '1'){
                        showAlertText(CONST_STR.get("INTERNATIONAL_PROMOCODE_ONE_USED"));
                        des.value = "";
                        return;
                    }

                    if (calculateDifferentMonthLess(strCurrentDate, startDate)) {
                        showAlertText(CONST_STR.get("INTERNATIONAL_PROMOCODE_ONE_FROMDATE"));
                        des.value = "";
                        return;
                    }

                    if (calculateDifferentMonth(strCurrentDate, endDate)) {
                        showAlertText(CONST_STR.get("INTERNATIONAL_PROMOCODE_ONE_TODATE"));
                        des.value = "";
                        return;
                    }
                }else if (gInternational.list_Promocode[i].SCOPES == 'All'){
                    startDate = gInternational.list_Promocode[i].DATEVALUEFROM;
                    endDate = gInternational.list_Promocode[i].DATEVALUETO;
                    if (gInternational.list_Promocode[i].PROMOCODETYPES == '1' && gInternational.list_Promocode[i].ISUSED == 'Y'){
                        showAlertText(CONST_STR.get("INTERNATIONAL_PROMOCODE_ONE_USED"));
                        des.value = "";
                        return;

                    }

                    if (calculateDifferentMonthLess(strCurrentDate, startDate)) {
                        showAlertText(CONST_STR.get("INTERNATIONAL_PROMOCODE_ONE_FROMDATE"));
                        des.value = "";
                        return;
                    }

                    if (calculateDifferentMonth(strCurrentDate, endDate)) {
                        showAlertText(CONST_STR.get("INTERNATIONAL_PROMOCODE_ONE_TODATE"));
                        des.value = "";
                        return;
                    }

                }

                return;

            }else if (des.value != gInternational.list_Promocode[i].PROMOCODE && i == gInternational.list_Promocode.length - 1){
                showAlertText(CONST_STR.get('INTERNATIONA_PROMOCODE_ERROR'));
                des.value = "";
                return;
            }


        }   
    }
}

$(document).ready(function () {
    $('#idInternationalTotalCurrency').inputmask('numeric',{
        radixPoint: ".",
        groupSeparator: ",",
        digits: 2,
        autoGroup: true,
        prefix: '', //No Space, this will truncate the first character
        rightAlign: false,
        oncleared: function () {}
    });

    $('#idInternationalDebitAmount').inputmask('numeric',{
        radixPoint: ".",
        groupSeparator: ",",
        digits: 2,
        autoGroup: true,
        prefix: '', //No Space, this will truncate the first character
        rightAlign: false,
        oncleared: function () {}
    });
})