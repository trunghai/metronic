/**
 * Created by HaiDT1 on 11/28/2016.
 */
function viewDidLoadSuccess() {
    actionbar.showStepSequence('account/common-auth/account-auth-scr');
    init();
}

function init() {
    angular.module('EbankApp').controller('com-review-account', function ($scope) {



        navController.getBottomBar().hide();
        $scope.infoTrans = gTrans.transInfo;
        $scope.src = gTrans.src;
        setTimeout(function () {
            changeLanguageInView();
        }, 200);
        $scope.sendJSONRequest = function () {
            navCachedPages['account/common-auth/account-auth-scr'] = null;
            navController.pushToView('account/common-auth/account-auth-scr', true, 'html');
        }
        
        $scope.clickHomeOrBack = function () {

        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}