/**
 * Created by HaiDT1 on 9/23/2016.
 */
function viewDidLoadSuccess() {

    initData();

}

function initData() {
    angular.module("EbankApp").controller('manager_guarante_detail_result', function ($scope, requestMBServiceCorp) {
        $scope.infoTrans = gTrans.detail;
        $scope.detailCheckList = gTrans.detail.checklistProfile;
        $scope.result = gTrans.result;
        $scope.check = gTrans.idtxn;
        $scope.guaranteeInfo = gTrans.result.respJsonObj;


        $scope.statusVN = {
            "ABH": "Đã duyệt",
            "INT": "Chờ duyệt",
            "REJ": "Từ chối",
            "APT": "Duyệt một phần",
            "RBH": "Duyệt không thành công",
            "CAC": "Đã hủy",
            "STH": "Đang xử lý",
            "HBH": "Hồ sơ đã được tiếp nhận",
            "REH": "Hoàn chứng từ",
            "IBS": "Chờ duyệt bổ sung chứng từ",
            "APS": "Duyệt một phần BS chứng từ",
            "APS": "Duyệt một phần BS chứng từ",
            "RES": "Từ chối BS chứng từ",
            "RBS": "Duyệt BS CTừ  không thành công",
            "SBS": "Đang xử lý BS chứng từ",
            "RJS": "TPBank từ chối BS chứng từ"
        };


        $scope.onMakeOtherTransClick = function () {
            for (var i = 0; i < navArrayScr.length; i++) {
                if (navArrayScr[i] == 'credit/manager_guarantee/manager-guarantee-suggest' && gTrans.idtxn == 'C02') {
                    clearCachedPageToView(navArrayScr[i], true, 'html');
                    navArrayScr = navArrayScr.slice(0, i + 1);
                    return;
                } else if (navArrayScr[i] == 'credit/manager_guarantee/manager_guarantee' && gTrans.idtxn == 'B02') {
                    clearCachedPageToView(navArrayScr[i], true, 'html');
                    navArrayScr = navArrayScr.slice(0, i + 1);
                    return;
                }
            }
        }

        $scope.goHomePage = function () {
            for (var i = 0; i < navArrayScr.length; i++) {
                if (navArrayScr[i] == 'homepage/homepage-dynamic-scr') {
                    navCachedPages[navArrayScr[i]] = null;
                    navController.popToViewInit(navArrayScr[i], true, 'html');
                    navArrayScr = navArrayScr.slice(0, i + 1);
                    return;
                }
            }
        }


    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}