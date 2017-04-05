/**
 * Created by ThanhHC on 01/10/2017.
 */
 // Tra cứu thẻ tín dụng
 var flagViewBack = false;
 function viewBackFromOther() {
    logInfo('Back from other view');
    flagViewBack = true;
    navCachedPages[currentPage] = null;
}
function viewDidLoadSuccess() {
	initCreditList();
}

function viewWillUnload() {

}

function initCreditList(){
	angular.module('EbankApp').controller("credit-list-scr",function($scope, requestMBServiceCorp){
		$scope.loadInitData = function(){
			var jsonData = new Object();
			jsonData.sequence_id = "1";
			jsonData.idtxn = "D03";
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
					document.getElementById("mainViewContent").style.display = "block";
					listCard = data.respJsonObj.list_card.myArrayList;
		            $scope.infoCardArray = data.respJsonObj.list_card.myArrayList;
		            $scope.priCard = CONST_STR.get('CREDIT_PRI_OWNER_TYPE_TITLE');
		            $scope.slvCard = CONST_STR.get('CREDIT_SLV_OWNER_TYPE_TITLE');
		            $scope.activeCard = CONST_STR.get('CREDIT_ACTIVE_STATUS');
		            $scope.deActiveCard = CONST_STR.get('CREDIT_DEACTIVE_STATUS');
				},
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                    gotoHomePage();
                }
            );

		}		
		$scope.pickCard = function(soThe){
			for(var i = 0; i < listCard.length; i++){
				if(listCard[i].myHashMap.CARD_NUMBER == soThe){
					index = i;
					break;
				}
			}
			cardPicked = listCard[i];
			navCachedPages['cardservice/view/list/list-history-transaction'] = null;
			navController.pushToView('cardservice/view/list/list-history-transaction', true, 'html');
		}
		if(!flagViewBack){
			$scope.loadInitData();
			document.getElementById("mainViewContent").style.display = "none";
		}else{
			document.getElementById("mainViewContent").style.display = "block";
            $scope.infoCardArray = listCard;
            $scope.priCard = CONST_STR.get('CREDIT_PRI_OWNER_TYPE_TITLE');
            $scope.slvCard = CONST_STR.get('CREDIT_SLV_OWNER_TYPE_TITLE');
            $scope.activeCard = CONST_STR.get('CREDIT_ACTIVE_STATUS');
            $scope.deActiveCard = CONST_STR.get('CREDIT_DEACTIVE_STATUS');
		}
	});
	angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}