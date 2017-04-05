/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 1/23/17
 * Time: 2:36 PM
 * To change this template use File | Settings | File Templates.
 */
function viewDidLoadSuccess(){
    resizeMainViewContent(currentPage);
    navController.getBottomBar().hide();
    init();
}
function init(){
    angular.module('EbankApp').controller('card-unlock-view', function ($scope, requestMBServiceCorp){
        $scope.infoTrans = gTrans.transInfo;
        $scope.onContinuteClick = function(){
            navCachedPages['cardservice/create/visa/card-authen']=null;
            navController.pushToView("cardservice/create/visa/card-authen", true, "html");
        }
        $scope.btnCancelClick = function(){
            for(var i=0; i<navArrayScr.length;i++){
                if(navArrayScr[i] == 'cardservice/create/visa/card-unlock'){
                    clearCachedPageToView(navArrayScr[i], true,'html');
                    navArrayScr = navArrayScr.slice(0,i+1);
                    navController.getBottomBar().show();
                    return;
                }
            }
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}