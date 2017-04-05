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
    //getDataTblToDiv(gTax.imExportData.ThongDiep.Body.ThongtinToKhai, "corp/payment_service/tax/pay_tax_charge_imexport_tbl", "tblContent");
}



/*** VIEW WILL UNLOAD ***/
function viewWillUnload() {
	
}
function init() {
    angular.module('EbankApp').controller('pay_tax_charge_imexport', function ($scope, requestMBServiceCorp) {

        $scope.initData = function () {
            // $scope.listPending = gTax.imExportData.ThongDiep.Body.ThongtinToKhai;
            //gTax.listPending = gTax.imExportData.ThongDiep.Body.ThongtinToKhai;

            // gen dữ liệu ra
            if(gTax.imExportData.ThongDiep.Body.ThongtinToKhai.length > 0){
                $scope.listPending = gTax.imExportData.ThongDiep.Body.ThongtinToKhai;
                document.getElementById('imEx.TaxNo').innerHTML = gTax.imExportData.ThongDiep.Body.ThongtinToKhai[0].MaDV;
                document.getElementById('imEx.TaxName').innerHTML = gTax.imExportData.ThongDiep.Body.ThongtinToKhai[0].TenDV;
            }else{
                $scope.listPending = gTax.imExportData.ThongDiep.Body;
                if(gTax.imExportData.ThongDiep.Body.ThongtinToKhai.MaDV !== undefined
                    && gTax.imExportData.ThongDiep.Body.ThongtinToKhai.MaDV != null){
                    document.getElementById('imEx.TaxNo').innerHTML = gTax.imExportData.ThongDiep.Body.ThongtinToKhai.MaDV;
                    document.getElementById('imEx.TaxName').innerHTML = gTax.imExportData.ThongDiep.Body.ThongtinToKhai.TenDV;
                }else{
                    document.getElementById('imEx.TaxNo').innerHTML = gTax.imExportData.ThongDiep.Body.ThongtinToKhai[0].MaDV;
                    document.getElementById('imEx.TaxName').innerHTML = gTax.imExportData.ThongDiep.Body.ThongtinToKhai[0].TenDV;
                }
            }
        }
$scope.initBottomBar = function (){
    var arrBottom = new Array();
    arrBottom.push(new MenuBottom("AUTO_BILLING_TAB_LIST", "icon-scheduled-transfers-list"));
    periodParam = new PeriodParam(CONSTANTS.get("CMD_TRANSFER_PERIODIC_MNG_TRANS"),CONST_VAL_PERIODIC_LOCAL[0]);


    navController.initBottomBarWithCallBack("payment_service/create/tax/pay_tax_charge_imexport", arrBottom, "pay_tax_charge_imexport", function (index) {
        // updateAccountListInfo();
        navCachedPages['common/com_list_user_approve'] = null;
        navController.pushToView("common/com_list_user_approve", true, 'html');
        navCachedPages["payment_service/create/tax/pay_tax_charge_imexport"] = null;
    });
    // dung de phan biet mau chuyen tien, khi sua mau chuyen tien
    gEdit = 1;
    //
    gHisTypeTranfer = 17;
}

        // Gọi đến màn hình chi tiet
        $scope.imExportDetail = function(soTk, namTk, no){
            gTax.soTk = soTk;
            gTax.namTk = namTk;
            gTax.stt = no - 1;

            // Gọi đên màn hình hiển cho phần thuế xuất nhập khẩu chi tiết
            navController.pushToView("payment_service/create/tax/pay_tax_charge_imexport_dtl", true, 'html');
            navCachedPages["payment_service/create/tax/pay_tax_charge_imexport"] = null;
        }

        $scope.backToScreenDtl = function(){
            navController.popView(true);
        }
        $scope.initBottomBar();
        $scope.initData();
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}
//gen sequence form
/*function genSequenceForm() {
	//get sequence form xsl
	var tmpXslDoc = getCachePageXsl("sequenceform");
	//create xml
	var tmpStepNo = 301;
	setSequenceFormIdx(tmpStepNo);
	var docXml = createXMLDoc();	
	var tmpXmlRootNode = createXMLNode('seqFrom', '', docXml);
	var tmpXmlNodeInfo = createXMLNode('stepNo', tmpStepNo, docXml, tmpXmlRootNode);
	//gen html string
	genHTMLStringWithXML(docXml, tmpXslDoc, function(oStr){
		var tmpNode = document.getElementById('seqFormLocal');
		if(tmpNode != null){
			tmpNode.innerHTML = oStr;
		}
	});
}*/