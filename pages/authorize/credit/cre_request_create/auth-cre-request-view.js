/**
 * Created by HaiNM *
 **/
 
 gCorp.isBack = true;
 function viewBackFromOther() {
    gCorp.isBack = true;
}
 
function viewDidLoadSuccess() {
    initData();
}

function initData() {
    angular.module('EbankApp').controller('auth-cre-request-view', function ($scope) {
		
        $scope.months=function(e) {
            return monthsTypeOfLanguage = e +' '+ CONST_STR.get('TRANS_PERIODIC_MONTH');
        }
		
        $scope.currentTrans = gTrans.listSelectedTrans;

        $scope.reason = gTrans.reason;
        $scope.authen = gTrans.authen;
        $scope.authenOTP = function () {
            navCachedPages["authorize/credit/cre_request_create/auth-cre-request-authen"] = null;
            navController.pushToView("authorize/credit/cre_request_create/auth-cre-request-authen", true, 'html');
        }
		
		$scope.onBackClick = function () {
            navCachedPages["authorize/credit/cre_request_create/auth-cre-request"] = null;
            navController.popToView("authorize/credit/cre_request_create/auth-cre-request", true);
        }
    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}