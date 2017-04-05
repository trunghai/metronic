/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 1/23/17
 * Time: 3:30 PM
 * To change this template use File | Settings | File Templates.
 */
function viewDidLoadSuccess(){
    resizeMainViewContent(currentPage);
    navController.getBottomBar().hide();
    init();
}
function init(){
    angular.module('EbankApp').controller('card-result', function ($scope, requestMBServiceCorp){
        $scope.infoTrans = gTrans.comfirm;
        $scope.transInfo = gTrans.transInfo;
        $scope.onMakeOrderTrans = function(){
            navCachedPages[navArrayScr[2]] = null;
            navController.popToViewInit(navArrayScr[2], true);
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}