/**
 * Created by HaiDT1 on 7/5/2016.
 */
/**
 * Created by HaiDT1 on 6/28/2016.
 */
function viewDidLoadSuccess() {
    initData();
}

function initData() {
    angular.module('EbankApp').controller('auth-pay-bill-detail-result', function ($scope, requestMBServiceCorp) {
        $scope.detail = gTrans.detail;
        $scope.result = gPayment.result;
        $scope.reason = gTrans.detail.rejectReason;
        if (gTrans.detail.isflag === 'Y')
        {
            document.getElementById('id.reason').style.display = 'none';
        }
        else if (gTrans.detail.isflag === 'N')
        {
            document.getElementById('id.reason').style.display = 'bock';
        }

        $scope.makeOtherTrans = function () {
            navCachedPages["authorize/payment_service/bill/auth-payment-bill"] = null;
            navController.pushToView("authorize/payment_service/bill/auth-payment-bill", true, 'html');
        }
    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}