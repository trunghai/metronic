/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 1/9/17
 * Time: 4:12 PM
 * To change this template use File | Settings | File Templates.
 */
function viewDidLoadSuccess() {
    initData();

}
function initData() {
    angular.module('EbankApp').controller('query-transfer-result',function ($scope, requestMBServiceCorp) {
        $scope.result = gTrans.result;
        $scope.getDatetime = new Date();

        $scope.statusVN = {"ABH" : "Hoàn thành giao dịch", "INT": "Chờ duyệt", "REJ": "Từ chối", "CAN": "Hủy giao dịch", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công", "CAC": "Hủy giao dịch", "STH" : "Đang xử lý",
            "HBH" : "Hồ sơ đã được tiếp nhận", "REH" : "Hoàn chứng từ", "IBS" : "Chờ duyệt bổ sung chứng từ", "APS" : "Duyệt một phần BS chứng từ",
            "RES" : "Từ chối BS chứng từ", "RBS" : "Duyệt BS CTừ  không thành công", "SBS" : "Đang xử lý BS chứng từ", "RJS" : "TPBank từ chối BS chứng từ","RSA":"TPBank từ chối"};

        $scope.onBackClick = function () {
            navCachedPages['transfer/query/query-transfer'] = null;
            navController.popView(true);
        }

    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}
function onMakeOtherTransClick() {
//    clearCachedPageToView("transfer/query/query-transfer", true,'html');
    for(var i=0; i<navArrayScr.length;i++){
        if(navArrayScr[i] == "transfer/query/query-transfer"){
            navCachedPages[navArrayScr[i]] = null;
            navController.popToViewInit(navArrayScr[i], true, 'html');
            navArrayScr = navArrayScr.slice(0,i+1);
            return;
        }
    }
}
// thuatnt thêm button INT
function printComHistory() {
    var tmpNodeMain = document.getElementById("mainViewContent");
    var printNode = tmpNodeMain.getElementsByTagName("div")[0];

    printNodeWithAll(printNode);
}