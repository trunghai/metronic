/**
 * Created by HaiDT1 on 9/23/2016.
 */
function viewDidLoadSuccess() {

    initData();

}

function initData() {
    angular.module("EbankApp").controller('manager-cre-request-detail-result', function ($scope, requestMBServiceCorp) {
        $scope.infoTrans = gTrans.detail;
        $scope.detailCheckList = gTrans.detail.checklistProfile;
        $scope.result = gTrans.result;
        $scope.check = gTrans.idtxn;
        $scope.guaranteeInfo = gTrans.result.respJsonObj;

        $scope.status=function(statusType) {
            var guaranteeTypeOfLanguage=[];
            var keyTypes =CONST_KEY_TRANS_CRE_REQUEST_CREATE_STT;
            if (gUserInfo.lang === 'VN') {
                guaranteeTypeOfLanguage = CONST_VALUE_TRANS_CRE_REQUEST_CREATE_VN;
            } else {
                guaranteeTypeOfLanguage = CONST_VALUE_TRANS_CRE_REQUEST_CREATE_EN;
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
		
        $scope.onMakeOtherTransClick = function () {
            navCachedPages['credit/manager_guarantee/manager-cre-request-create'] = null;
            navController.popToView("credit/manager_guarantee/manager-cre-request-create", true,'html');
        }


    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}