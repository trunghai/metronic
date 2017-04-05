var liabilityAmount;
var billAmount;
function viewDidLoadSuccess() {
	init();
}
function init(){
	angular.module('EbankApp').controller("lc-statement-detail",function($scope, requestMBServiceCorp){
		var length = gTrans.listLC.length;
		for(var i = 0; i < length; i++){
			if(gTrans.refNo == gTrans.listLC[i].myHashMap.CONTRACT_REF_NO){
				var productCode = gTrans.listLC[i].myHashMap.PRODUCT_CODE;
				if(gTrans.typeIE == "IMPORT"){
					document.getElementById("detailImport").style.display = '';
					document.getElementById("detailExport").style.display = 'none';
				}else if (gTrans.typeIE == "EXPORT") {
					document.getElementById("detailImport").style.display = 'none';
					document.getElementById("detailExport").style.display = '';
				}
				$scope.detailRef = gTrans.listLC[i].myHashMap;
				liabilityAmount = gTrans.listLC[i].myHashMap.LIABILITY_AMOUNT;
				billAmount = gTrans.listLC[i].myHashMap.BILL_AMOUNT;
				if(liabilityAmount == ""){
					liabilityAmount = "0";
					gTrans.listLC[i].myHashMap.LIABILITY_AMOUNT = "0";
				}
				if(billAmount == ""){
					billAmount = "0";
					gTrans.listLC[i].myHashMap.BILL_AMOUNT = "0";
				}

				$scope.REMAIN_VALUE = parseFloat(liabilityAmount.replace(/,/g,'')) - parseFloat(billAmount.replace(/,/g,''));
			}
		}
	});
	angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}
function printPage() {
	var printContents = document.getElementById("printPage").innerHTML;
	var originalContents = document.body.innerHTML;

	document.body.innerHTML = printContents;

	window.print();

	document.body.innerHTML = originalContents;
}