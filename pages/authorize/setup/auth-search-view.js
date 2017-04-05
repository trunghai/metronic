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
    angular.module('EbankApp').controller('auth-search-view', function ($scope) {
        $scope.currentTrans = gTrans.listSelectedTrans;
        $scope.reason = gTrans.reason;
        $scope.authen = gTrans.authen;
        $scope.authenOTP = function () {
            navCachedPages["authorize/setup/auth-search-authen"] = null;
            navController.pushToView("authorize/setup/auth-search-authen", true, 'html');
        }
		
		$scope.onBackClick = function () {
            navCachedPages["authorize/setup/setup-search"] = null;
            navController.popToView("authorize/setup/setup-search", true);
        }
    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}