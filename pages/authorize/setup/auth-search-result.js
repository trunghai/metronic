/**
 * Created by HaiNM *
 **/
 
function viewDidLoadSuccess() {
    initData();
}

function initData() {
    angular.module('EbankApp').controller('auth-cre-request-result', function ($scope, requestMBServiceCorp) {
		
        $scope.ListTrans = gTrans.listTrans;
        $scope.reason = gTrans.reason;
        $scope.authen = gTrans.authen;
        $scope.result = gPayment.result;
        $scope.makeOtherTrans = function () {
            for(var i=0; i<navArrayScr.length;i++){
                if(navArrayScr[i] == 'authorize/setup/setup-search'){
                    clearCachedPageToView(navArrayScr[i], true,'html');
                    navArrayScr = navArrayScr.slice(0,i+1);
                    return;
                }
            }
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
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}