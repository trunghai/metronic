/**
 * Created by HaiNM *
 **/
 
function viewDidLoadSuccess() {
    initData();

}


function initData() {
    angular.module("EbankApp").controller('setup-search-detail-result', function ($scope) {

        $scope.detailCommon = gTrans.common;
        $scope.detailList = gTrans.result.table;
        $scope.authen = gTrans.common.authen;
		$scope.result=gTrans.result;
        // console.log($scope.result);

        //noinspection JSAnnotator
        $scope.onMakeOrderTrans = function () {
            navCachedPages["authorize/setup/setup-search"] = null;
            navController.popToView("authorize/setup/setup-search", true, 'html');
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