/***
* Edit by HaiNM
* Date: 12/22; 12/27/2016
* Time: 11:45 AM; 3:17 PM
***/

var sequenceId;

/*** VIEW BACK FROM OTHER ***/
function viewBackFromOther() {
	logInfo('Back change pasword');
}

/*** VIEW BACK FROM OTHER ***/
function viewBackFromOther() {
	logInfo('Back change pasword');
}


/*** VIEW LOAD SUCCESS ***/
function viewDidLoadSuccess() {
	logInfo('change pasword load success');
	initData();
//	genSequenceForm();
//  document.getElementById("footerDesktop").innerHTML = gUserInfo.accountInfo.companyName;
//  document.getElementById("footerMobile").innerHTML = gUserInfo.accountInfo.companyName;
}

function initData(){
	angular.module('EbankApp').controller('set-change-pass', function ($scope, requestMBServiceCorp) {
		
		// $scope.setupChangePasswordCallBack = function(){	
		// 	navCachedPages["setup/create/system/set_system"] = null;
		// 	navController.initWithRootView('setup/create/system/set_system', true, 'html');
		// }
		
		$scope.setupChangePasswordExe = function(){	
			var oldPassword = document.getElementById("passwordCurrent").value;
			var newPassword = document.getElementById("newPassword").value;
			var reNewPassword = document.getElementById("reNewPassword").value;
			var msgValidate = new Array();
			
			// Check muc [Mat khau hien tai]
			if (oldPassword == '' || oldPassword == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
				msgValidate.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), [CONST_STR.get('SET_PAS_ITEM_PASSWORD_NOW')]));
			}

			// Check muc [Mat khau moi]
			if (newPassword == '' || newPassword == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
				msgValidate.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), [CONST_STR.get('SET_PAS_ITEM_PASSWORD_NEW')]));
			}

			// Check muc [nhap lai]
			if (reNewPassword == '' || reNewPassword == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
				msgValidate.push(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), [CONST_STR.get('SET_PAS_ITEM_PASSWORD_RENEW')]));
			}
			
			// Check muc [Mat khau moi] va [nhap lai] //Update line 54~56
			if (newPassword != reNewPassword) {
				msgValidate.push(CONST_STR.get("CORP_MSG_SETUP_CHANGE_PASS_NOT_MATCH"));
			}
			
			if (oldPassword == newPassword) {
				msgValidate.push(CONST_STR.get("CHECK_PASSWORD_OLD_AND_NEW"));
			}
			
			if (msgValidate.length > 0) {
				showAlertText(msgValidate[0]);
			} else {

				gTrans.transInfo = new Object();
				gTrans.transInfo.idtxn = "S12";
				gTrans.transInfo.sequenceId = "1";
				gTrans.transInfo.oldPassword = oldPassword;
				gTrans.transInfo.newPassword = newPassword;
			//	gTrans.transInfo.byPassReview = true;
			//	gTrans.transInfo.hideBackButton = true;
				gTrans.transInfo.rootView = currentPage;
				
				var args = [];
				args.push("1");
				args.push(gTrans.transInfo);
				
				var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_SETUP_CHANGE_PASSWORD"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
				var data = getDataFromGprsCmd(gprsCmd);
				requestMBServiceCorp.post(data, true, validateSuccess, function(){});
				
			}
		}
		
		function validateSuccess(data) {
			//var resp = JSON.parse(data);
			var resp = data;
			if (resp.respCode == "55" || resp.respCode == "99") {
				showAlertText(resp.respContent);
			} else {
				var requestData = {
                    idtxn: gTrans.transInfo.idtxn,
					sequenceId : 2,
					oldPassword: gTrans.transInfo.oldPassword,
					newPassword: gTrans.transInfo.newPassword
                }
				gTrans.cmdType = CONSTANTS.get("CMD_CO_SETUP_CHANGE_PASSWORD");
                gTrans.requestData = requestData;
                //gTrans.src = "pages/setup/common-review/set_change_pass_review.html";
               // navController.pushToView("common/common-review/transfer-review-scr", true, "html");
			    navCachedPages['common/common-auth/transfer-auth-scr'] = null;
				navController.pushToView('common/common-auth/transfer-auth-scr', true, 'html');
			}
		}
			
	});
	angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}

/*** VIEW WILL UNLOAD ***/
function viewWillUnload() {
  logInfo('Send info user approve will unload');
}

//gen sequence form
function genSequenceForm() {
  //get sequence form xsl
  var tmpXslDoc = getCachePageXsl("sequenceform");
  //create xml
  var tmpStepNo = 301;
  setSequenceFormIdx(tmpStepNo);
  var docXml = createXMLDoc();
  var tmpXmlRootNode = createXMLNode('seqFrom', '', docXml);
  var tmpXmlNodeInfo = createXMLNode('stepNo', tmpStepNo, docXml, tmpXmlRootNode);
  //gen html string
  genHTMLStringWithXML(docXml, tmpXslDoc, function(oStr) {
    var tmpNode = document.getElementById('seqFormLocal');
    if (tmpNode != null) {
      tmpNode.innerHTML = oStr;
    }
  });
}