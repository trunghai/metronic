/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 2/9/17
 * Time: 1:41 PM
 * To change this template use File | Settings | File Templates.
 */
function viewDidLoadSuccess() {

    initData();

}

function initData() {
    angular.module("EbankApp").controller('manager_guarante_detail_result', function ($scope, requestMBServiceCorp) {
        $scope.infoTrans = gTrans.manaCard;
        $scope.result = gTrans.result;


        $scope.statusVN = {"ABH" : "Đã duyệt", "INT": "Chờ duyệt", "REJ": "Từ chối", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công", "CAC": "Đã huỷ", "STH" : "Đang xử lý",
            "HBH" : "Hồ sơ đã được tiếp nhận", "REH" : "Hoàn chứng từ", "IBS" : "Chờ duyệt bổ sung chứng từ", "APS" : "Duyệt một phần BS chứng từ", "APS" : "Duyệt một phần BS chứng từ",
            "RES" : "Từ chối BS chứng từ", "RBS" : "Duyệt BS CTừ  không thành công", "SBS" : "Đang xử lý BS chứng từ", "RJS" : "TPBank từ chối BS chứng từ"};


        $scope.onMakeOtherTransClick = function () {
            navCachedPages['cardservice/create/manager_trans_credit_card/managerCardTrans'] = null;
            navController.popToView('cardservice/create/manager_trans_credit_card/managerCardTrans', true, 'html');
        }

        $scope.onBackClick = function(){
            clearCachedPageToView("homepage/homepage-dynamic-scr", true,'html');
        }

    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}