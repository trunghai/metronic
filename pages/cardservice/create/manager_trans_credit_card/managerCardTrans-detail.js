/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 2/9/17
 * Time: 10:33 AM
 * To change this template use File | Settings | File Templates.
 */
function viewDidLoadSuccess(){
    loadDetail();
}
function loadDetail(){
    angular.module("EbankApp").controller('managerCardTrans-detail', function ($scope, requestMBServiceCorp) {
        navCachedPages["cardservice/create/manager_trans_credit_card/managerCardTrans"] = null;
        $scope.infoTrans = gTrans.detail;

        $scope.statusVN = {"ABH" : "Đã duyệt", "INT": "Chờ duyệt", "REJ": "Từ chối", "CAN": "Hủy giao dịch", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công", "CAC": "Hủy giao dịch", "STH" : "Đang xử lý",
            "HBH" : "Hồ sơ đã được tiếp nhận", "REH" : "Hoàn chứng từ", "IBS" : "Chờ duyệt bổ sung chứng từ", "APS" : "Duyệt một phần BS chứng từ",
            "RES" : "Từ chối BS chứng từ", "RBS" : "Duyệt BS CTừ  không thành công", "SBS" : "Đang xử lý BS chứng từ", "RJS" : "TPBank từ chối BS chứng từ","RSA":"TPBank từ chối"};

        $scope.typeTrans = {"D11" : "Khóa/Mở khóa thẻ", "D12" : "Thanh toán dư nợ thẻ"};

        $scope.onCancelClick = function(){
            navCachedPages['cardservice/create/manager_trans_credit_card/managerCardTrans-authen'] = null;
            navController.pushToView("cardservice/create/manager_trans_credit_card/managerCardTrans-authen", true,'html');
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}