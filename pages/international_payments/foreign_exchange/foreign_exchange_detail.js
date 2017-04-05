
hidebuttonCanceTrans = CONST_STR.get('TRANS_STATUS_INT');

function viewDidLoadSuccess() {
    navController.getBottomBar().hide();
    logInfo('debt detail load success');
    init();

}

function init() {
    angular.module('EbankApp').controller('foreign_exchange_detail', function ($scope) {
		$scope.detailCommon=gTrans.common;
        $scope.showElement = true;
        $scope.showTransCancel = true;
        if(gTrans.common.CODSTATUS != 'INT')
        {
            $scope.showTransCancel = false;
        }
        if(gUserInfo.userRole.indexOf('CorpInput') == -1 || CONST_BROWSER_MODE == false) {
            $scope.showElement =false;
            $scope.showTransCancel = false;
        }
        // Thực hiện việc gọi lại màn hình cũ
        $scope.goBack = function () {
            navController.getBottomBar().hide();
            navCachedPages["international_payments/foreign_exchange/foreign_exchange_mng"] = null;
			navController.pushToView("international_payments/foreign_exchange/foreign_exchange_mng", true, 'html');
        }
		
        $scope.cancelTransaction = function () {
            gTrans.src = "pages/international_payments/foreign_exchange/foreign_exchange_view.html";
			navCachedPages["international_payments/foreign_exchange/foreign_exchange_detail_authen"] = null;
            navController.pushToView("international_payments/foreign_exchange/foreign_exchange_detail_authen", true, "html");
        }

    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}