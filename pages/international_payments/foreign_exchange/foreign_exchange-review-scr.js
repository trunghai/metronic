/**
 * Created by HaiDT1 on 11/28/2016.
 */
function viewDidLoadSuccess() {
    actionbar.showStepSequence('transfer/common-auth/transfer-auth-scr');
    init();
}

function init() {
    angular.module('EbankApp').controller('transfer-review', function ($scope) {
        //navController.getBottomBar().hide();
        //Có xóa cache khi quay lại màn hình trc hay ko
        clearCache = false;
        $scope.infoTrans = gTrans.transInfo;
        $scope.src = gTrans.src;
        $scope.detailCommon = gTrans.common;

        setTimeout(function () {
            changeLanguageInView();
        }, 200);
        $scope.sendJSONRequest = function () {
            navCachedPages['common/common-auth/transfer-auth-scr'] = null;
            navController.pushToView('common/common-auth/transfer-auth-scr', true, 'html');
        }

        $scope.goBackClick = function () {
			if (gTrans.transInfo.idtxn ="S15"){
				navCachedPages["setup/create/tranfer/limit/set-limit"] = null;
			}
            navController.popView(true);
        }

        $scope.initBottomBar = function (){
            var arrBottom = new Array();
            arrBottom.push(new MenuBottom("AUTO_BILLING_TAB_LIST", "icon-scheduled-transfers-list"));
            navController.initBottomBarWithCallBack("international_payments/foreign_exchange/foreign_exchange", arrBottom, "foreign_exchange", function (index) {
                switchAction(index);
            });
        }

        function switchAction(index){
            switch(index)
            {                
                case "0":
                    updateAccountListInfo();
                    navCachedPages['common/com_list_user_approve'] = null;
                    navController.pushToView("common/com_list_user_approve", true, 'html');
                break;
            }
        }

        $scope.btnCancelClick = function(){
            if(gTrans.transInfo.idtxn == 'T12' || gTrans.transInfo.idtxn == 'T11'){
                clearCachedPageToPopView("transfer/internal/transfer-local-create-scr", true,'html');
            }else if(gTrans.transInfo.idtxn == 'T14'){
                clearCachedPageToPopView("transfer/periodic/transfer-periodic-create-scr", true,'html');
            }else if(gTrans.transInfo.idtxn == 'T15'){
                clearCachedPageToPopView("transfer/batch/make/batch-transfer-create", true,'html');
            }else if(gTrans.transInfo.idtxn == 'T16'){
                clearCachedPageToPopView("transfer/card/transfer-card-create-scr", true,'html');
            }else if(gTrans.idtxn == 'T13'){
                clearCachedPageToPopView("transfer/domestic/transfer-inter-create-scr", true,'html');
            }else if(gTrans.transInfo.idtxn == 'B13'){
                navCachedPages['international_payments/foreign_exchange/foreign_exchange'] = null;
                navController.popToViewInit('international_payments/foreign_exchange/foreign_exchange', true, 'html');
            }else if(gTrans.idtxn == 'S15'){
				for(var i=0; i<navArrayScr.length;i++){
					if(navArrayScr[i] == gTrans.ortherSrc){
						clearCachedPageToView(navArrayScr[i], true,'html');
						navArrayScr = navArrayScr.slice(0,i+1);
						return;
					}
				}
            }else{
                navController.popViewInit();
            }

        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}