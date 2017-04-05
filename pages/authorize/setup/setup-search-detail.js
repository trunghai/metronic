/**
 * Created by HaiNM *
 **/
 
gCorp.isBack = false;


function viewDidLoadSuccess() {
    initData();

}

function viewBackFromOther() {
    gCorp.isBack = true;
}

function initData() {
    angular.module("EbankApp").controller('auth-cre-request-detail', function ($scope, requestMBServiceCorp) {
        $scope.detailCommon = gTrans.common;
        $scope.detailCheckList = gTrans.checklistProfile;

        $scope.onBackClick = function () {
            navCachedPages["authorize/credit/cre_request_create/auth-cre-request"] = null;
            navController.popView(true);
        }
		
		$scope.tranTypeTxt= function (e) {
			return CONST_STR.get('COM_IDTXN_' + e);
		}
		
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
		
        $scope.onRejectClick = function () {
            var reason = document.getElementById("id.reason-rej").value;
            if (!reason) {
                showAlertText(CONST_STR.get("COM_CHECK_EMPTY_REJECT_REASON"));
                return;
            }

            gTrans.common.reason = reason;
            gTrans.common.authen = false;
            navCachedPages["authorize/setup/setup-search-detail-authen"] = null;
            navController.pushToView("authorize/setup/setup-search-detail-authen", true);
        }
        
        $scope.onContinuteClick = function () {
            var reason = document.getElementById("id.reason-rej").value;
            if(reason){
                showAlertText(CONST_STR.get("COM_CHECK_REJECT_BUTTON"));
                return;
            }
            gTrans.common.authen = true;
            navCachedPages["authorize/setup/setup-search-detail-authen"] = null;
            navController.pushToView("authorize/setup/setup-search-detail-authen", true);
        }

    });
    angular.bootstrap(document.getElementById('mainViewContent'), ["EbankApp"]);
}

function controlInputText(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccent(field.value);
        field.value = field.value.replace(/[!"#$%&*'\+:;<=>?\\`^~{|}]/g, '');
    }
}