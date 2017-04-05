/**
 * Created by HaiDT1 on 12/21/2016.
 */

function viewDidLoadSuccess() {
    init();
}

function init() {
    angular.module("EbankApp").controller("auth-trans-review", function ($scope, requestMBServiceCorp) {
        clearCache = true;
        $scope.listPending = gTrans.listSelectedTrans;
        $scope.srcAuthenDesktop = gTrans.srcAuthenDesktop;
        $scope.srcAuthenMobile = gTrans.srcAuthenMobile;
		$scope.reason = gTrans.reason;
        setTimeout(function () {
            // document.getElementById('id.reason').style.display = 'none';
            changeLanguageInView();
            reGenContent();
        }, 200);
        function reGenContent() {
            if (!checkScreenisMobilePX()){
                (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "block" : '';
                (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "none" : '';
            }else{
                (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "none" : '';
                (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "block" : '';

            }

            setTimeout(function () {
                changeLanguageInView();
            }, 100);
        }
        if (gTrans.authen){
            document.getElementById('trans.reason').style.display = 'none';
        }else {
            document.getElementById('trans.reason').style.display = 'block';
            // document.getElementById('id.reason').value = gTrans.reason;
        }

        $scope.goToAuthorizationScreen = function () {
            // gTrans.authen = true;
            navCachedPages["authorize/transfer/common-auth/auth-trans-authorization"] = null;
            navController.pushToView('authorize/transfer/common-auth/auth-trans-authorization', true, 'html');
        }


        //Không tự ý sửa hàm
        $scope.goToBack = function () {
            navCachedPages[gTrans.srcViewListPending] = null;
            navController.popToView(gTrans.srcViewListPending, 'html');
        }


    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}
function controlInputText(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccent(field.value);
        field.value = field.value.replace(/[\[\]\,!"#$%&*'\+\-:;<=>?\\`^~{|}]/g, '');
    }
}