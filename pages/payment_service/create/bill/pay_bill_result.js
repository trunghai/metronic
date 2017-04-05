/**
 * Created by HaiDT1 on 6/27/2016.
 */
var statusOtherFunc = false;

function viewDidLoadSuccess() {
    initData();
    bottomBar.hide();
    if(gModeScreenView == CONST_MODE_SCR_SMALL ){
        document.getElementById("nav.btn.home").style.display = "none";
    }
}

function viewWillUnload() {
    logInfo('result will unload');
    if(!statusOtherFunc) {
        navController.resetCacheBranch();
    }
}

function goBack() {
    statusOtherFunc = true;
    navController.resetBranchView();
}

function initData() {
    angular.module('EbankApp').controller('pay_bill_result', function ($scope) {
        navController.getBottomBar().hide();
        $scope.result = gPayment.result;
        $scope.review = gPayment.review;
		var tmp = gPayment.paymentInfo.srvId;
        if(gUserInfo.lang === 'VN'){
            if ($scope.review.issavepayee === 'TH'){
                $scope.thuhuong = CONST_VAL_PAYEE_NOT_TEMPLATE_VN[1];
            }else {
                $scope.thuhuong = CONST_VAL_PAYEE_NOT_TEMPLATE_VN[0];
            }
        }else {
            if ($scope.review.issavepayee === 'TH'){
                $scope.thuhuong = CONST_VAL_PAYEE_NOT_TEMPLATE_EN[1];
            }else {
                $scope.thuhuong = CONST_VAL_PAYEE_NOT_TEMPLATE_EN[0];
            }
        }
		
		if (tmp === '306')
		{
			document.getElementById('thuhuongtmp').style.display = 'none';
		}

        $scope.makeOtherTrans = function () {
            /*statusOtherFunc = false;
            navController.initWithRootView("payment_service/create/bill/pay_bill_create", true, 'html');*/

            for(var i=0; i<navArrayScr.length;i++){
                if(navArrayScr[i] == "payment_service/create/bill/pay_bill_create"){
                    if(gModeScreenView == CONST_MODE_SCR_SMALL){
                        document.getElementById('nav.btn.home').style.display = 'block';
                    }
                    navCachedPages[navArrayScr[i]] = null;
                    navController.popToViewInit(navArrayScr[i], true, 'html');
                    navArrayScr = navArrayScr.slice(0,i+1);
                    return;
                }
            }
            // return;
        }

    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}