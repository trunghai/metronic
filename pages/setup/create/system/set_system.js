/***
* Edit by HaiNM
* Date: 12/20/2016
* Time: 5:00 PM
***/

/*** VIEW LOAD SUCCESS ***/
function viewDidLoadSuccess() {
	initData();
}
/*** INIT DATA ***/
function initData() {
    angular.module('EbankApp').controller('set-system', function ($scope, requestMBServiceCorp) {
		//Open Tab
		gSetUp.menuSystem = (gUserInfo.lang == 'EN') ? CONST_SETUP_PAGE_MENU_DROPLIST_EN : CONST_SETUP_PAGE_MENU_DROPLIST_VN;
		document.addEventListener("evtSelectionDialog", handleSelectMenuSystem, false);
		document.addEventListener("evtSelectionDialogClose", handleSelectMenuSystemClose, false);
		showDialogList(CONST_STR.get("COM_SYSTEM_POPUP_TITLE"), gSetUp.menuSystem, '', true);

		function handleSelectMenuSystem(e) {
			handleSelectMenuSystemClose();
			if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
				var tmp = e.selectedValue1;
				for (var i = 0; i < gSetUp.menuSystem.length; i++) {

					if (gSetUp.menuSystem[i] == tmp) {
						if(i == 0){
							//Thay đổi ngôn ngữ
							navController.pushToView("setup/create/system/changeLanguage/set_change_language", true, 'html');
						}else if (i == 1) { 
							//Thông tin cá nhân
							navController.pushToView("setup/create/system/changeUserInfo/set_user_info", true, 'html');
						} else if (i == 2) { 
							//Thay đổi mật khẩu
							navController.pushToView("setup/create/system/changePassword/set_change_password", true, 'html');
						}
					}
				}
			}
		}
		//Close Tab
		function handleSelectMenuSystemClose() {
			document.removeEventListener("evtSelectionDialogClose", handleSelectMenuSystemClose, false);
			document.removeEventListener("evtSelectionDialog", handleSelectMenuSystem, false);
		}
	});
	angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}



