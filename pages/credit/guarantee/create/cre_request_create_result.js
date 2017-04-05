/**
 * Created by HaiDT1 on 8/1/2016.
 */

function viewDidLoadSuccess() {
    init();
}

function init() {
    angular.module('EbankApp').controller('cre-request-create-result', function ($scope) {
        $scope.infoTrans = gTrans.transInfo;
        setTimeout(function () {
            changeLanguageInView();
        }, 200);
		
        $scope.onMakeOrderTrans = function () {
            for(var i=0; i<navArrayScr.length;i++){
                if(navArrayScr[i] == 'credit/guarantee/create/cre_request_create'){
                    clearCachedPageToView(navArrayScr[i], true,'html');
                    navArrayScr = navArrayScr.slice(0,i+1);
                    return;
                }
            }
        }

        $scope.goHomePage = function(){
            for(var i=0; i<=navArrayScr.length;i++){
                if(navArrayScr[i] == 'homepage/homepage-dynamic-scr'){
                    navCachedPages[navArrayScr[i]] = null;
                    navController.popToViewInit(navArrayScr[i], true, 'html');
                    navArrayScr = navArrayScr.slice(0,i+1);
                    return;
                }
            }
        }


    });

    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}