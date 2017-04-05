/**
 * Created by HaiDT1 on 9/23/2016.
 */
function viewDidLoadSuccess() {

    initData();

}

function initData() {
    angular.module("EbankApp").controller('manager-cre-request-detail-result', function ($scope) {
		$scope.detailCommon=gTrans.common;
        $scope.result = gTrans.result;
        $scope.results = gTrans.result.respJsonObj;
		
        $scope.onMakeOtherTransClick = function () {
            navCachedPages['international_payments/foreign_exchange/foreign_exchange_mng'] = null;
            navController.popToView("international_payments/foreign_exchange/foreign_exchange_mng", true,'html');
        }


    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}