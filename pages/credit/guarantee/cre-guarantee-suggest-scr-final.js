/**
 * Created by GiangBM on 2/3/2017.
 */
function viewDidLoadSuccess() {
    init();
}

function init() {
    angular.module('EbankApp').controller('cre-guarantee-suggest-scr-final', function ($scope) {
//        navController.getBottomBar().hide();
        $scope.infoTrans = gTrans.transInfo;
        $scope.message =   gTrans.result;
        $scope.result = gTrans.result.respJsonObj;
        $scope.src = gTrans.src;
        setTimeout(function () {
            changeLanguageInView();
        }, 200);

        $scope.onClickOtherTrans = function () {
            navCachedPages['credit/guarantee/cre-guarantee-suggest-scr'] = null;
            navController.pushToView('credit/guarantee/cre-guarantee-suggest-scr', true, 'html');
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}