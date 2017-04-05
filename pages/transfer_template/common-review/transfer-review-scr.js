/**
 * Created by HaiDT1 on 11/28/2016.
 */
function viewDidLoadSuccess() {
    actionbar.showStepSequence('transfer/common-auth/transfer-auth-scr');
    init();
}

function init() {
    angular.module('EbankApp').controller('transfer-review', function ($scope) {
        $scope.infoTrans = gTrans.transInfo;
        $scope.src = gTrans.src;
        
        $scope.sendJSONRequest = function () {
            navCachedPages['transfer/common-auth/transfer-auth-scr'] = null;
            navController.pushToView('transfer/common-auth/transfer-auth-scr', true, 'html');
        }
        
        $scope.clickHomeOrBack = function () {

        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}