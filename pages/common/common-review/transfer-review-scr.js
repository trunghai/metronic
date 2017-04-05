/**
 * Created by HaiDT1 on 11/28/2016.
 */
 function viewBackFromOther() {
    //Flag check
    gTrans.ViewBottomBar = true;
}
function viewDidLoadSuccess() {
    actionbar.showStepSequence('transfer/common-auth/transfer-auth-scr');
    init();
}

function init() {
    angular.module('EbankApp').controller('transfer-review', function ($scope) {

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

        $scope.btnCancelClick = function(){
            if(gTrans.transInfo.idtxn == 'T12' || gTrans.transInfo.idtxn == 'T11'){
                clearCachedPageToPopView("transfer/internal/transfer-local-create-scr", true,'html');
            }else if(gTrans.transInfo.idtxn == 'T14'){
                // thuatnt cmt
                if(gUserInfo.userRole.indexOf('CorpInput') != -1){
                    if (gTrans.ortherSrc == "transfer/periodic/transfer-periodic-mng-scr") {
                        clearCachedPageToPopView("transfer/periodic/transfer-periodic-mng-scr", true,'html');
                    }else{
                        clearCachedPageToPopView("transfer/periodic/transfer-periodic-create-scr", true,'html');
                        gTransPeriodic = true;
                    }
                }else{
                    clearCachedPageToPopView("transfer/periodic/transfer-periodic-mng-scr", true,'html');
                }
            }else if(gTrans.transInfo.idtxn == 'T15'){
                clearCachedPageToPopView("transfer/periodic/transfer-periodic-mng-scr", true,'html');
            }else if(gTrans.transInfo.idtxn == 'T16'){
                clearCachedPageToPopView("transfer/card/transfer-card-create-scr", true,'html');
            }else if(gTrans.idtxn == 'T13'){
                clearCachedPageToPopView("transfer/domestic/transfer-inter-create-scr", true,'html');
            }else if(gTrans.transInfo.idtxn == 'B13'){
                navCachedPages['international_payments/foreign_exchange/foreign_exchange'] = null;
                navController.popToViewInit('international_payments/foreign_exchange/foreign_exchange', true, 'html');
			}else if(gTrans.transInfo.idtxn == 'T15'){
                navCachedPages['transfer/periodic/transfer-periodic-create-scr'] = null;
                navController.popToViewInit('transfer/periodic/transfer-periodic-create-scr', true, 'html');	
            }else{
//                navController.popViewInit();
                //AnhNTT chỉnh sửa hủy
                for(var i=0; i<navArrayScr.length;i++){
                    if(navArrayScr[i] == gTrans.ortherSrc){
                        navCachedPages[navArrayScr[i]] = null;
                        navController.popToViewInit(navArrayScr[i], true, 'html');
                        navArrayScr = navArrayScr.slice(0,i+1);
                        return;
                    }
                }
            }

        }
        //Mãu thụ hưởng
        $scope.initBottomBar = function (){
            var arrBottom = new Array();
            arrBottom.push(new MenuBottom("AUTO_BILLING_TAB_LIST", "icon-scheduled-transfers-list"));
            periodParam = new PeriodParam(CONSTANTS.get("CMD_TRANSFER_PERIODIC_MNG_TRANS"),CONST_VAL_PERIODIC_LOCAL[0]);


            navController.initBottomBarWithCallBack("common/common-review/transfer-review", arrBottom, "transfer-review", function (index) {
                updateAccountListInfo();
                navCachedPages['common/com_list_user_approve'] = null;
                navController.pushToView("common/com_list_user_approve", true, 'html');
            });
            // dung de phan biet mau chuyen tien, khi sua mau chuyen tien
            gEdit = 3;
            //
            gHisTypeTranfer = 17;
        }
    if (gTrans.ViewBottomBar) {
            navController.getBottomBar().show();
            $scope.initBottomBar();
        }else{
            navController.getBottomBar().hide();
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}