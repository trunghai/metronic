/***
* Edit by HaiNM
* Date: 12/24/2016
* Time: 12:00 AM
***/


/*** VIEW BACK FROM OTHER ***/
function viewBackFromOther() {
}


/*** VIEW LOAD SUCCESS ***/
function viewDidLoadSuccess() {
	initData();
}

/*** VIEW WILL UNLOAD ***/
function viewWillUnload() {
	logInfo('Send info user approve will unload');
}

/*** INIT DATA ***/
function initData() {
    angular.module('EbankApp').controller('set-tranfer', function ($scope, requestMBServiceCorp) {
		
		var tmpArray1 = [CONST_STR.get('COM_TRAN_LIMIT')];
		var tmpArray2 = ["1"];
		if (gUserInfo.userRole.indexOf("CorpInput") > -1) {
			tmpArray1.unshift(CONST_STR.get('SET_TRANFER_POPUP_ITEM_SEND_INFO'));
			tmpArray2.unshift("0");
		}
		document.addEventListener("evtSelectionDialog", handleChooseTrans, false);
		document.addEventListener("evtSelectionDialogClose", handleChooseTransClose, false);
		showDialogList(CONST_STR.get('COM_SYSTEM_POPUP_TITLE'), tmpArray1, tmpArray2, false);
			
		function handleChooseTrans(e) {
			if (currentPage == "setup/create/tranfer/set_tranfer") {
				document.removeEventListener("evtSelectionDialog", handleChooseTrans, false);
				
				if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
					if(e.selectedValue2 == '0'){
						updateAccountListInfo();
						navController.pushToView('setup/create/tranfer/sendMethod/set_send_info_user_approve', true, 'html');
					}else if(e.selectedValue2 == '1'){
						navCachedPages['setup/create/tranfer/limit/set-limit'] = null;
						//gCorp.rootView = "setup/create/tranfer/limit/set-limit";
						navController.pushToView('setup/create/tranfer/limit/set-limit', true, 'html');
					}else if(e.selectedValue2 == '2'){
						updateAccountListInfo();
						navController.pushToView('setup/create/tranfer/tokentype/set_token_type', true, 'html');
					}
				}
			}
		}

		function handleChooseTransClose() {
			if (currentPage == "setup/create/tranfer/set_tranfer") {
				document.removeEventListener("evtSelectionDialogClose", handleChooseTransClose, false);
				document.removeEventListener("evtSelectionDialog", handleChooseTrans, false);
			}
		}

	});
	angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}
