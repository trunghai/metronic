/**
 * Created by HaiDT1 on 1/24/2017.
 */
function viewDidLoadSuccess() {
    init();
}

function viewBackFromOther() {

}

function init() {
    angular.module('EbankApp').controller('request-release-lc-view', function ($scope, requestMBServiceCorp) {
        clearCache = true;
        initComboTextAccount(0);
        initComboTextAccountFee(0);


        if (gTrans.requestlc.respCode == 55) {
            $scope.requestlc = new Object();
            document.getElementById('btnNext').disabled = true;
            $scope.errorContent = gTrans.requestlc.errorFileUpload
        } else {
            $scope.requestlc = gTrans.requestlc;
            document.getElementById('error').style.display = "none";
        }

        function initComboTextAccount(index) {
            var accountName = "Invalid";
            var accountNumber = "Invalid";
            var accountBalance = "Invalid";

            try {
                document.getElementById("holder-account-info").innerHTML = "";
                accountName = gUserInfo.accountName;
                accountNumber = gTrans.requestlc.MARGIN_ACCOUNT;
                if (gTrans.requestlc.AVAIL_MARGIN_ACCOUNT != null || gTrans.requestlc.AVAIL_MARGIN_ACCOUNT != undefined){
                    accountBalance = (gTrans.requestlc.CCY == 'VND' || gTrans.requestlc.CCY == 'JPY') ? formatNumberToCurrency(gTrans.requestlc.AVAIL_MARGIN_ACCOUNT) : formatCurrentWithSysbol(gTrans.requestlc.AVAIL_MARGIN_ACCOUNT);
                }else {
                    accountBalance = '';
                }


            } catch (e) {
                logInfo("khong load duoc thong tin tai khoan");
            }

            comboEl = new ComboSetCurrency({
                containerId: "cb-container", //holder of combo
                accountName: accountName, //account name
                accountNumber: accountNumber, //account number
                accountBalance: accountBalance, //account balance
                borderColor: "yellow", // border color
                containerPadding: "0px", // set padding to holder of combo
                containerMargin: "0px",
                showBorderTop: false,
                fontSize: "15px",
                hiddenArrow: true,
                showBorderBottom: false,//set margin to holder of combo
                currency: gTrans.requestlc.CCY_MARGIN,
                clickIt: function () { //handle function click
                    console.log("already click");
                }
            });
            comboEl.show("holder-account-info");
        }

        function initComboTextAccountFee(index) {
            var accountName = "Invalid";
            var accountNumber = "Invalid";
            var accountBalance = "Invalid";

            try {
                document.getElementById("holder-account-info-fee").innerHTML = "";
                accountName = gUserInfo.accountName;
                accountNumber = gTrans.requestlc.FREE_ACCOUNT;
                if (gTrans.requestlc.AVAIL_FREE_ACCOUNT != null || gTrans.requestlc.AVAIL_FREE_ACCOUNT != undefined){
                    accountBalance = (gTrans.requestlc.CCY_FEE == 'VND' || gTrans.requestlc.CCY_FEE == 'JPY') ? formatNumberToCurrency(gTrans.requestlc.AVAIL_FREE_ACCOUNT) : formatCurrentWithSysbol(gTrans.requestlc.AVAIL_FREE_ACCOUNT);
                }else {
                    accountBalance = '';
                }


            } catch (e) {
                logInfo("khong load duoc thong tin tai khoan");
            }

            comboEl = new ComboSetCurrency({
                containerId: "cb-container-fee", //holder of combo
                accountName: accountName, //account name
                accountNumber: accountNumber, //account number
                accountBalance: accountBalance, //account balance
                borderColor: "yellow", // border color
                containerPadding: "0px", // set padding to holder of combo
                containerMargin: "0px",
                showBorderTop: false,
                fontSize: "15px",
                hiddenArrow: true,
                showBorderBottom: false,//set margin to holder of combo
                currency: gTrans.requestlc.CCY_FEE,
                clickIt: function () { //handle function click
                    console.log("already click");
                }
            });
            comboEl.show("holder-account-info-fee");
        }

        function formatCurrentWithSysbol(n) {

            var k;
            k = Math.abs(n).toFixed(2).replace(/./g, function (c, i, a) {
                return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
            });
            if (k.substr(k.length - 2, k.length) === '00') {
                k = k.substr(0, k.length - 3);
            }
            return k;
        }

        $scope.onContinuteClick = function () {

            gTrans.requestlc.src = 'pages/international_payments/request_release_LC/release-LC-view-info.html';
            navCachedPages['international_payments/request_release_LC/request-release-LC-profile'] = null;
            navController.pushToView('international_payments/request_release_LC/request-release-LC-profile', true, 'html');
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}