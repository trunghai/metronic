/**
 * Created by HaiDT1 on 2/7/2017.
 */

/**
 * Created by HaiDT1 on 1/24/2017.
 */
function viewDidLoadSuccess() {
    init();
}

function viewBackFromOther() {

}

function init() {
    angular.module('EbankApp').controller('request-release-lc-review', function ($scope, requestMBServiceCorp) {
        navCachedPages["international_payments/request_release_LC/request-release-LC-profile"] = null;
        $scope.listProfile = gTrans.listProfile;
        $scope.requestlc = gTrans.requestlc;
        $scope.src = gTrans.requestlc.src;

        setTimeout(function () {
            // initComboTextAccount(0);
            // initComboTextAccountFee(0);
            changeLanguageInView();

        }, 100);

        function initComboTextAccount (index){
            var accountName =  "Invalid";
            var accountNumber = "Invalid";
            var accountBalance = "Invalid";

            try{
                document.getElementById("holder-account-info").innerHTML = "";
                accountName = gUserInfo.accountName;
                accountNumber = gTrans.requestlc.MARGIN_ACCOUNT;
                accountBalance = formatNumberToCurrency(gTrans.requestlc.AVAIL_MARGIN_ACCOUNT);
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
                hiddenArrow: true,
                showBorderBottom : false,//set margin to holder of combo
                clickIt : function (){ //handle function click
                    console.log("already click");
                }
            });
            comboEl.show("holder-account-info");
        }

        function initComboTextAccountFee (index){
            var accountName =  "Invalid";
            var accountNumber = "Invalid";
            var accountBalance = "Invalid";

            try{
                document.getElementById("holder-account-info-fee").innerHTML = "";
                accountName = gUserInfo.accountName;
                accountNumber = gTrans.requestlc.FREE_ACCOUNT;
                accountBalance = formatNumberToCurrency(gTrans.requestlc.AVAIL_FREE_ACCOUNT);
            }catch(e){
                logInfo("khong load duoc thong tin tai khoan");
            }

            comboEl = new Combo({
                containerId : "cb-container-fee", //holder of combo
                accountName : accountName, //account name
                accountNumber : accountNumber, //account number
                accountBalance : accountBalance, //account balance
                borderColor : "yellow", // border color
                containerPadding : "0px", // set padding to holder of combo
                containerMargin : "0px",
                showBorderTop : false,
                fontSize : "15px",
                hiddenArrow: true,
                showBorderBottom : false,//set margin to holder of combo
                clickIt : function (){ //handle function click
                    console.log("already click");
                }
            });
            comboEl.show("holder-account-info-fee");
        }

        $scope.onClickViewPDF = function (e) {
           /* var arrayString = e.split("/");
            var stringUrl = "";
            for (var i in arrayString){
                if(i >= 5){
                    stringUrl = stringUrl + "/" + arrayString[i];
                }
            }*/

            if (Environment.isMobile()){
                openLinkInWindows(response.respJsonObj.url);
            }else {
                var widthScreen = (window.innerWidth-800)/2;
                var heightScreen = (window.innerHeight-800)/2;

                var string = "width=800,height=800,top=" + heightScreen + ",left=" + widthScreen;
                window.open(e, "", string);
            }
        }

        $scope.onContinuteClick = function () {
            navCachedPages['international_payments/request_release_LC/request-release-LC-authen'] = null;
            navController.pushToView('international_payments/request_release_LC/request-release-LC-authen', true, 'html');
        }

        $scope.onCancelClick = function () {
            navCachedPages['international_payments/request_release_LC/request-release-LC'] = null;
            navController.popToViewInit('international_payments/request_release_LC/request-release-LC', true, 'html');
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}