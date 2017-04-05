/**
 * Created by JetBrains WebStorm.
 * User: AnhNTT.FSOFT
 * Date: 2/7/17
 * Time: 9:38 AM
 * To change this template use File | Settings | File Templates.
 */


gCorp.isBack = false;

function viewBackFromOther() {
    gCorp.isBack = true;
}

function viewDidLoadSuccess() {
    initData();

}

function initData() {
    angular.module('EbankApp').controller('auth-payment-credit-debit-blance', function ($scope, requestMBServiceCorp) {
        if (!gCorp.isBack) {
            $scope.detail = gTrans.detail;
        }else {
            $scope.detail = null;
            $scope.detail = gTrans.detail;
            if (gTrans.detail.isflag==='N')
            {
                document.getElementById("idTxtReason").value = gTrans.detail.rejectReason;
            }
        }


        $scope.sendOTP = function () {


        }

        $scope.onCancelClick = function () {
            gTrans.detail.isflag = 'N';
            var txtReason = document.getElementById("idTxtReason").value;
            //var textFlag = checkSpecialChar(txtReason);
            if (txtReason == '') {
                showAlertText(CONST_STR.get("COM_CHECK_EMPTY_REJECT_REASON"));
                return;
            }
            gTrans.detail.rejectReason = txtReason;
            navCachedPages["authorize/payment_service/bill/auth-pay-bill-detail-authen"] = null;
            navController.pushToView("authorize/payment_service/bill/auth-pay-bill-detail-authen", true);
        }

        $scope.onBackClick = function () {
            navController.resetBranchView();
            return;
        }

    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}