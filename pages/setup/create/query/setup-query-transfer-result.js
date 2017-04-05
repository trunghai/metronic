/**
 * Created by HaiNM *
 **/
 
function viewDidLoadSuccess() {

    initData();

}

function initData() {
    angular.module("EbankApp").controller('setup-query-transfer-result', function ($scope) {
		$scope.result = gTrans.result;	
		$scope.message = gTrans.message
        $scope.onMakeOtherTransClick = function () {
            navCachedPages['credit/manager_guarantee/manager-cre-request-create'] = null;
            navController.popToView("credit/manager_guarantee/manager-cre-request-create", true,'html');
        }
		$scope.onBackClick = function () {
		
		}

    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}