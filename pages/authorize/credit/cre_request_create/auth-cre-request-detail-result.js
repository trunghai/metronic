/**
 * Created by HaiNM *
 **/
 
function viewDidLoadSuccess() {
    if(gModeScreenView == CONST_MODE_SCR_SMALL){
        document.getElementById('nav.btn.home').style.display = 'none';
    }
    initData();

}

function initData() {
    angular.module("EbankApp").controller('auth-guarantee-detail-result', function ($scope) {

        $scope.detailCommon = gTrans.common;
        $scope.detailCheckList = gTrans.checklistProfile;
        $scope.authen = gTrans.common.authen;
        $scope.result = gTrans.result;
		$scope.comcheker = gUserInfo.accountName;

        $scope.detailCommon.sendMethod ='';
        if (typeof gTrans.common.SENDMETHOD != "undefined" && gTrans.common.SENDMETHOD != null) {
            $scope.detailCommon.sendMethod = CONST_STR.get("COM_NOTIFY_" + gTrans.common.SENDMETHOD);
        }


        //noinspection JSAnnotator
        $scope.onMakeOrderTrans = function () {
            for(var i=0; i<navArrayScr.length;i++){
                if(navArrayScr[i] == 'authorize/credit/cre_request_create/auth-cre-request'){
                    clearCachedPageToView(navArrayScr[i], true,'html');
                    navArrayScr = navArrayScr.slice(0,i+1);
                    return;
                }
            }
        }
        $scope.months=function(e) {
            return monthsTypeOfLanguage = e +' '+ CONST_STR.get('TRANS_PERIODIC_MONTH');
        }
        $scope.status=function(statusType) {
            var guaranteeTypeOfLanguage=[];
            var keyTypes =CONST_GUARANTEE_QUERY_TYPE_STATUS_VALUE;
            if (gUserInfo.lang === 'VN') {
                guaranteeTypeOfLanguage = CONST_GUARANTEE_QUERY_TYPE_STATUS_VN;
            } else {
                guaranteeTypeOfLanguage = CONST_GUARANTEE_QUERY_TYPE_STATUS_EN;
            }
            var index =this.getIndexArr(statusType,keyTypes);
            return guaranteeTypeOfLanguage[index];
        }
        $scope.getIndexArr=function(guaranteeType,arr){

            for(var i =0;i<arr.length;i++)
            {
                if(arr[i]==guaranteeType)
                {
                    return i;
                }
            }
            return 0;
        }

    });
    angular.bootstrap(document.getElementById('mainViewContent'), ["EbankApp"]);
}