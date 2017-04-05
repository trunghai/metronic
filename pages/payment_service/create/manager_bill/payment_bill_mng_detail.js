/**
 * Created by GiangBM on 3/13/2017.
 */


function viewDidLoadSuccess() {
    //resizeMainViewContent();
    init();
    logInfo('review load success');
}

function init(){
    angular.module('EbankApp').controller('payment_bill_mng_detail', function ($scope, requestMBServiceCorp) {
        clearCache = true;
        navController.getBottomBar().hide();
        $scope.detail = gTrans.detail;
        $scope.statusVN = { "ABH": "Đã duyệt", "INT": "Chờ duyệt", "REJ": "Từ chối", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công" };

        // quay lại màn hình trước
        $scope.goBack = function() {
            navController.popView(true);
        }
        // hủy
        $scope.onCancelClick = function() {
            navCachedPages['payment_service/create/manager_bill/payment_bill_mng_detail_authen'] = null;
            navController.pushToView('payment_service/create/manager_bill/payment_bill_mng_detail_authen', true, 'html');
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}
