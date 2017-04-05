/**
 * Created by HaiDT1 on 1/24/2017.
 */
function viewDidLoadSuccess() {
    init();
}

function viewBackFromOther() {

}

function init() {
    angular.module('EbankApp').controller('request-release-lc-result', function ($scope, requestMBServiceCorp) {

        $scope.requestlc = gTrans.requestlc;
        $scope.listProfile = gTrans.listProfile;
        $scope.result = gTrans.result;

        $scope.onClickOtherTrans = function () {
            navCachedPages['international_payments/request_release_LC/request-release-LC'] = null;
            navController.popToView('international_payments/request_release_LC/request-release-LC', true, 'html');
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}