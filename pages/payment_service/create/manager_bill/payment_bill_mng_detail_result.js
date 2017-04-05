/**
 * Created by JetBrains WebStorm.
 * User: GiangBM.FSOFT
 * Date: 3/13/17
 * To change this template use File | Settings | File Templates.
 */
function viewDidLoadSuccess() {
    initData();

}
function initData() {
    angular.module('EbankApp').controller('payment-bill-result',function ($scope, requestMBServiceCorp) {
        navController.getBottomBar().hide();
        $scope.result = gTrans.result;
        $scope.detail = gTrans.detail;
        $scope.getDatetime = new Date();

        $scope.statusVN = {"ABH" : "Hoàn thành giao dịch", "INT": "Chờ duyệt", "REJ": "Từ chối", "CAN": "Hủy giao dịch", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công", "CAC": "Hủy giao dịch", "STH" : "Đang xử lý",
            "HBH" : "Hồ sơ đã được tiếp nhận", "REH" : "Hoàn chứng từ", "IBS" : "Chờ duyệt bổ sung chứng từ", "APS" : "Duyệt một phần BS chứng từ",
            "RES" : "Từ chối BS chứng từ", "RBS" : "Duyệt BS CTừ  không thành công", "SBS" : "Đang xử lý BS chứng từ", "RJS" : "TPBank từ chối BS chứng từ","RSA":"TPBank từ chối"};

        $scope.onBackClick = function () {
            navCachedPages['payment_service/create/manager_bill/payment_bill_mng'] = null;
            navController.popView(true);            
        }

        $scope.onMakeOtherTransClick = function () {
            clearCachedPageToView("payment_service/create/manager_bill/payment_bill_mng", true,'html');
        }
        $scope.onMakeOtherTransClick1 = function () {
            navCachedPages['payment_service/create/manager_bill/payment_bill_mng'] = null;
            navController.popToView("payment_service/create/manager_bill/payment_bill_mng", true,'html');
        }

    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}
// thuatnt thêm button INT
function printComHistory() {
    var tmpNodeMain = document.getElementById("mainViewContent");
    var printNode = tmpNodeMain.getElementsByTagName("div")[0];

    printNodeWithAll(printNode);
}