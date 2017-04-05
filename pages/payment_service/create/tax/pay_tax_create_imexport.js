/**
 * Created by NguyenTDK
 * User:
 * Date: 19/10/15
 * Time: 5:00 PM
 */

/*** INIT VIEW ***/
function loadInitXML() {
}

/*** VIEW BACK FROM OTHER ***/

function viewBackFromOther() {
}


/*** VIEW LOAD SUCCESS ***/
function viewDidLoadSuccess() {
    init();
    actionbar.showStepSequence("com-authentication-scr");
    // gen dữ liệu table
    //getDataTblToDiv(gTax.imExportData.ThongDiep.Body.ThongtinToKhai, "payment_service/create/tax/pay_tax_create_imexport_tbl", "tblContent");
}

/*** VIEW WILL UNLOAD ***/
function viewWillUnload() {

}
function init() {
    angular.module('EbankApp').controller('pay_tax_create_imexport', function ($scope, requestMBServiceCorp) {
        // gen sequence form
        //genSequenceForm();
        navController.getBottomBar().hide();
        $scope.initData = function () {
            $scope.listPending = gTax.imExportData.ThongDiep.Body.ThongtinToKhai;
            // gen dữ liệu ra
            if (gTax.imExportData.ThongDiep.Body.ThongtinToKhai.length > 0) {
                document.getElementById('imEx.TaxNo').innerHTML = gTax.imExportData.ThongDiep.Body.ThongtinToKhai[0].Ma_DV;
                document.getElementById('imEx.TaxName').innerHTML = gTax.imExportData.ThongDiep.Body.ThongtinToKhai[0].Ten_DV;
            } else {
                if (gTax.imExportData.ThongDiep.Body.ThongtinToKhai.Ma_DV !== undefined
                    && gTax.imExportData.ThongDiep.Body.ThongtinToKhai.Ma_DV != null) {
                    document.getElementById('imEx.TaxNo').innerHTML = gTax.imExportData.ThongDiep.Body.ThongtinToKhai.Ma_DV;
                    document.getElementById('imEx.TaxName').innerHTML = gTax.imExportData.ThongDiep.Body.ThongtinToKhai.Ten_DV;
                } else {
                    document.getElementById('imEx.TaxNo').innerHTML = gTax.imExportData.ThongDiep.Body.ThongtinToKhai[0].Ma_DV;
                    document.getElementById('imEx.TaxName').innerHTML = gTax.imExportData.ThongDiep.Body.ThongtinToKhai[0].Ten_DV;
                }
            }
        }
        $scope.initData();
        
        // Gọi đến màn hình chi tiet
        $scope.imExportDetail = function(soTk, namTk, no) {
            gTax.soTk = soTk;
            gTax.namTk = namTk;
            gTax.stt = no - 1;

            // Gọi đên màn hình hiển cho phần thuế xuất nhập khẩu chi tiết
            navController.pushToView("payment_service/create/tax/pay_tax_create_imexport_dtl", true, 'html');
            navCachedPages["payment_service/create/tax/pay_tax_create_imexport"] = null;
            // clearCachedPageToView("payment_service/create/tax/pay_tax_create_imexport_dtl", true, 'html');
        }

        $scope.backToScreenDtl = function() {
            navController.popView(true);
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}
