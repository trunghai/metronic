/**
 * Created by HaiDT1 on 6/28/2016.
 */
 
 gCorp.isBack = true;
 function viewBackFromOther() {
    gCorp.isBack = true;
}
 
function viewDidLoadSuccess() {
    initData();
}

function initData() {
    angular.module('EbankApp').controller('auth_payment_bill_view', function ($scope, requestMBServiceCorp) {
        $scope.currentTrans = gTrans.listSelectedTrans;

        $scope.reason = gTrans.reason;
        $scope.authen = gTrans.authen;
        $scope.authenOTP = function () {
			var totalAmount = 0;
			
			for (var l in gTrans.listSelectedTrans)
			{
				totalAmount = parseInt(totalAmount) + parseInt(gTrans.listSelectedTrans[l].SO_LUONG);
			}
			if (parseInt(totalAmount) > parseInt(gTrans.limit.limitTime))
			{
				showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_TIME_AUTH'),
								[formatNumberToCurrency(gTrans.limit.limitTime)]));
				return;
			}
			else if (parseInt(totalAmount) > parseInt(gTrans.limit.limitDay))
			{
				showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_DAY_AUTH'),
								[formatNumberToCurrency(gTrans.limit.limitDay)]));
				return;
			}
			else if (parseInt(gTrans.limit.totalDay) > parseInt(gTrans.limit.limitDay))
			{
				showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_DAY_AUTH'),
								[formatNumberToCurrency(gTrans.limit.limitDay)]));
				return;
			}
			else if ((parseInt(gTrans.limit.totalDay) + parseInt(totalAmount)) > parseInt(gTrans.limit.limitDay))
			{
				showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_DAY_AUTH'),
								[formatNumberToCurrency(gTrans.limit.limitDay)]));
				return;
			}
			else
			{
				navCachedPages["authorize/payment_service/bill/auth-payment-bill-authen"] = null;
            	navController.pushToView("authorize/payment_service/bill/auth-payment-bill-authen", true, 'html');
			}
			
			
        }
		if (gTrans.authen){
            document.getElementById('trans.reason').style.display = 'none';
        }else {
            document.getElementById('trans.reason').style.display = 'block';
        }
		$scope.onBackClick = function () {
            navCachedPages["authorize/payment_service/bill/auth-payment-bill"] = null;
            navController.popToView("authorize/payment_service/bill/auth-payment-bill", true);
			
			//navController.popView(true);
            //return;
        }
    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}