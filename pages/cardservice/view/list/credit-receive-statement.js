/**
 * Created by ThanhHC on 01/14/2017.
 */
 // Liệt kê giao dịch
function viewDidLoadSuccess(){
	initCardDetail();
    document.getElementById("statementView").style.display='none';	
}

function viewWillUnload() {
    navCachedPages["cardservice/view/list/credit-receive-statement"] = null;
}
function initCardDetail(){
	angular.module('EbankApp').controller("list-history-transactions", function($scope, requestMBServiceCorp){
		$scope.priCard = CONST_STR.get('CREDIT_PRI_OWNER_TYPE_TITLE');
    $scope.slvCard = CONST_STR.get('CREDIT_SLV_OWNER_TYPE_TITLE');
    $scope.activeCard = CONST_STR.get('CREDIT_ACTIVE_STATUS');
    $scope.deActiveCard = CONST_STR.get('CREDIT_DEACTIVE_STATUS');
		$scope.infoCardDetail = cardPicked;
		if($scope.infoCardDetail.myHashMap.BC_FLAG == '1'){
			document.getElementById('pricard').style.display = "block";
			document.getElementById('subcard').style.display = "none";
		}else{
			document.getElementById('pricard').style.display = "none";
			document.getElementById('subcard').style.display = "block";
		}

		$scope.sendJSONRequest =  function(){
            var jsonData = new Object();
            jsonData.sequence_id = "3";
            jsonData.idtxn = "D03";
            var _year = "";
            _year = document.getElementById('idYearSelect').value;
            var _month = "";
            _month = document.getElementById('idMonthSelect').value;
            var month_tranfer = _year + _month;
            if(_month == 'Select' || _month == "Chọn"){
                showAlertText(CONST_STR.get('TRANS_ALERT_SHOW_MONTH'));
                return;
            }else if(_year == 'Select' || _year == "Chọn"){
                showAlertText(CONST_STR.get('TRANS_ALERT_SHOW_YEAR'));
                return;
            }
            // jsonData.card_id = "1040662"; //Id test
            jsonData.card_id = $scope.infoCardDetail.myHashMap.CARD_ID;
            jsonData.time = document.getElementById('idYearSelect').value + document.getElementById('idMonthSelect').value;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CREDIT_LIST'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true,
                function(data) {
                    if(parseInt(data.respCode) != parseInt(RESP.get('COM_SUCCESS'))){
                        showAlertText(data.respContent);
                        return;
                    }
                    document.getElementById("statementView").style.display='block';
                    $scope.hisTransaction = data.respJsonObj.credit_statement.myArrayList;
                    $scope.hisTransactionItem = data.respJsonObj.credit_statement.myArrayList[0].myHashMap.ITEM.myArrayList;
                    if($scope.hisTransactionItem.length == 0){
                        document.getElementById("debitCredit").style.display = "none";
                    }else{
                        document.getElementById("debitCredit").style.display = "block";
                    }
                    $scope.getTotalDR = function(){
                        var total = 0;
                        for(var i = 0; i < $scope.hisTransactionItem.length; i++){
                            var dr = $scope.hisTransactionItem[i];
                            total += parseInt(dr.myHashMap.DR);
                        }
                        return total;
                    }
                    $scope.getTotalCR = function(){
                        var total = 0;
                        for(var i = 0; i < $scope.hisTransactionItem.length; i++){
                            var cr = $scope.hisTransactionItem[i];
                            total += parseInt(cr.myHashMap.CR);
                        }
                        return total;
                    }
                },
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                    gotoHomePage();
                }
            );
		}        
	});
	angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}
function showMonth(){
    var tmpArray = CONST_KEY_MONTH_ID;
    document.addEventListener("evtSelectionDialog", showInputMonthOpen, false);
    document.addEventListener("evtSelectionDialogClose", showInputMonthClose, false);
    showDialogList(CONST_STR.get('CREDIT_INPUT_CHOICE'), tmpArray, false);    
}
function showInputMonthOpen(e) {
    if (currentPage == "cardservice/view/list/credit-receive-statement") { 
        if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
            showInputMonthClose();
            document.getElementById('idMonthSelect').value = e.selectedValue1;        
        }       
    }
}
function showInputMonthClose() {
    if (currentPage == "cardservice/view/list/credit-receive-statement") {     
        document.removeEventListener("evtSelectionDialog", showInputMonthOpen, false);
        document.removeEventListener("evtSelectionDialogClose", showInputMonthClose, false);
    }
}
function showYear(){
    var tmpArray = CONST_KEY_YEAR_ID;
    document.addEventListener("evtSelectionDialog", showInputYearOpen, false);
    document.addEventListener("evtSelectionDialogClose", showInputYearClose, false);
    showDialogList(CONST_STR.get('CREDIT_INPUT_CHOICE'), tmpArray, false);    
}



function showInputYearOpen(e) {
    if (currentPage == "cardservice/view/list/credit-receive-statement") { 
        if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
            showInputYearClose();
            document.getElementById('idYearSelect').value = e.selectedValue1;        
        }       
    }
}
function showInputYearClose() {
    if (currentPage == "cardservice/view/list/credit-receive-statement") {     
        document.removeEventListener("evtSelectionDialog", showInputYearOpen, false);
        document.removeEventListener("evtSelectionDialogClose", showInputYearClose, false);
    }
}
