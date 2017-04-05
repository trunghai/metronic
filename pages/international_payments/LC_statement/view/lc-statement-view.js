function viewDidLoadSuccess() {
    document.getElementById("load-success").style.display = "none";
	document.getElementById("viewPrint").style.display = "none";
    init();
}
function init(){
	angular.module('EbankApp').controller("lc-statement-view",function($scope, requestMBServiceCorp){
		$scope.initView =  function() {
            var jsonData = new Object();
            jsonData.sequenceId = "2";
            jsonData.idtxn = 'B03';
            jsonData.refNo = gTrans.refNo;

            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_LC_STATEMENT'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true, function (response) {
                if(response.respCode == '0'){
                	gTrans.viewLC = response.respJsonObj.view_lc.myArrayList;
                    
                    if (isEmpty(gTrans.viewLC)) {
                        //khong co du lieu
                        document.getElementById("emtydata").style.display = "";
                        document.getElementById("view-lc").style.display = "none";
                        document.getElementById("viewPrint").style.display = "none";

                    }else{
                        $scope.viewLC = gTrans.viewLC;
                        for (var i = $scope.viewLC.length - 1; i >= 0; i--) {
                            $scope.viewLC[i].myHashMap.AMOUNT = formatFloatNumberToCurrency($scope.viewLC[i].myHashMap.AMOUNT);
                        }
                        if(gTrans.typeIE == "IMPORT"){
                            document.getElementById("ie1").innerHTML = "LC_BENEFICIARY";
                            document.getElementById("ie2").innerHTML = "LC_PAY_DATE";
                        } else if (gTrans.typeIE == "EXPORT") {
                            document.getElementById("ie1").innerHTML = "LC_NGUOI_PHAT_HANH";
                            document.getElementById("ie2").innerHTML = "LC_PAY_DATE_BC";
                        }
                        document.getElementById("emtydata").style.display = "none";
                        document.getElementById("view-lc").style.display = "";
                        document.getElementById("viewPrint").style.display = "";
                    }
                    setTimeout(function () {
                        changeLanguageInView();
                        document.getElementById("load-success").style.display = "";
                        document.getElementById("back-viewlc").style.display = "";
                    }, 10);
                    
                }
            }, function () {
                
            });
		}
		$scope.initView();
	});
	angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}
function exportExcel() {
    var arr = new Array();
    arr.push(23)
    var objectValueClient = new Object();
    objectValueClient.sequenceId = 23;
    objectValueClient.refNo = gTrans.refNo;
    objectValueClient.listLC = [];
    objectValueClient.viewLC = [];

    objectValueClient.lcTypeEx = gTrans.lcTypeEx;
    objectValueClient.fromDateEx = gTrans.fromDateEx;
    objectValueClient.toDateEx = gTrans.toDateEx;

    for(var i = 0; i < gTrans.listLC.length; i++){
        gTrans.listLC[i].myHashMap.LC_TYPE_DETAIL = getLCTypeDetail(gTrans.listLC[i].myHashMap.PRODUCT_CODE);
        objectValueClient.listLC.push(gTrans.listLC[i].myHashMap);
    }
    for(var j = 0; j < gTrans.viewLC.length; j++){
        objectValueClient.viewLC.push(gTrans.viewLC[j].myHashMap);
    }
    arr.push(objectValueClient);

    var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_EXPORT_EXCEL_REPORT"), "", "", gUserInfo.lang, gUserInfo.sessionID, arr);
    data = getDataFromGprsCmd(gprsCmd);

    corpExportExcel(data);
}
function getLCTypeDetail(productCode){
    var lang;
    gUserInfo.lang == 'VN' ? lang = '_VN' : lang = '_EN';
    if(productCode == 'ILC0'){
        return CONST_STR.get('ILC0' + lang);
    }else if(productCode == 'ILC1'){
        return CONST_STR.get('ILC1' + lang);
    }else if(productCode == 'ILC5'){
        return CONST_STR.get('ILC5' + lang);
    }else if (productCode == 'LCUT') {
        return CONST_STR.get('LCUT' + lang);
    }else if(productCode == 'ELC1'){
        return CONST_STR.get('ELC1' + lang);
    }    
}