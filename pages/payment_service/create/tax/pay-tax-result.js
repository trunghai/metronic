/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 3/14/17
 * Time: 6:27 PM
 * To change this template use File | Settings | File Templates.
 */
function viewDidLoadSuccess() {

    initData();

}
function initData() {
    angular.module("EbankApp").controller('pay-tax-result', function ($scope, requestMBServiceCorp) {
        $scope.result = gTrans.result;
        $scope.resultInfo = gTrans.result.respJsonObj;
        $scope.statusVN = {"ABH" : "Đã duyệt", "INT": "Chờ duyệt", "REJ": "Từ chối", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công", "CAC": "Đã huỷ", "STH" : "Đang xử lý",
            "HBH" : "Hồ sơ đã được tiếp nhận", "REH" : "Hoàn chứng từ", "IBS" : "Chờ duyệt bổ sung chứng từ", "APS" : "Duyệt một phần BS chứng từ", "APS" : "Duyệt một phần BS chứng từ",
            "RES" : "Từ chối BS chứng từ", "RBS" : "Duyệt BS CTừ  không thành công", "SBS" : "Đang xử lý BS chứng từ", "RJS" : "TPBank từ chối BS chứng từ"};

        $scope.onMakeOtherTransClick = function(){
            for(var i=0; i<navArrayScr.length;i++){
                if(navArrayScr[i] == 'payment_service/create/tax/pay_tax_manager'){
                    clearCachedPageToView(navArrayScr[i], true,'html');
                    navArrayScr = navArrayScr.slice(0,i+1);
                    return;
                }
            }
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}