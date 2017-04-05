/***
* Edit by HaiNM
* Date: 12/21/2016
* Time: 9:23 AM
***/

/*** VIEW LOAD SUCCESS ***/
function viewDidLoadSuccess() {
	initData();
}
/*** INIT DATA ***/
function initData() {
    angular.module('EbankApp').controller('set-change-language', function ($scope, requestMBServiceCorp) {
		
		if(gUserInfo.lang == 'EN'){
			document.getElementById('id.lang').value = CONST_SETUP_LANG[1];
		}else{
			document.getElementById('id.lang').value = CONST_SETUP_LANG[0];
		}
		
		
		$scope.setShowPopupChangeLang = function(){
			document.addEventListener("evtSelectionDialog", handleInputLang, false);
			document.addEventListener("evtSelectionDialogClose", handleInputLangClose, false);
			showDialogList(CONST_STR.get('SET_LANG_POPUP_TITLE'), CONST_SETUP_LANG, CONST_SETUP_LANG_VALUE, false);
		}
		
		function handleInputLang(e) {
			if (currentPage == "setup/create/system/changeLanguage/set_change_language") {
				document.removeEventListener("evtSelectionDialog", handleInputLang, false);
				if(e.selectedValue2 != gUserInfo.lang){
					if(e.selectedValue2 == "VN"){
						gUserInfo.lang == "EN";
					}else{
						gUserInfo.lang == "VN";
					}
					changeLanguageOnIB();
				}
			}
		}

		function handleInputLangClose() {
			if (currentPage == "setup/create/system/changeLanguage/set_change_language") {
				document.removeEventListener("evtSelectionDialogClose", handleInputLangClose, false);
				document.removeEventListener("evtSelectionDialog", handleInputLang, false);
			}
		}
		
	});
	angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}


