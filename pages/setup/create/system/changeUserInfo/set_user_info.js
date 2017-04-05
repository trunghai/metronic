/***
* Edit by HaiNM
* Date: 12/30/2016
* Time: 2:53 PM
***/

var TAG = "set_user_info: "
var sequenceId;
var gprsResp = new GprsRespObj("", "", "", "");
var userInfo;
var flag = true;
var tmpData;

function loadInitXML() {
}

function viewBackFromOther() {
	flag = false;
}

function viewDidLoadSuccess() {

	if (flag) {
		userInfo = {};
		sendRequestGetUserInfo();
	//	genSequenceForm();
	}
	
	initData();
	
}

/*** INIT DATA ***/
function initData() {
	angular.module('EbankApp').controller('set-user-info', function ($scope, requestMBServiceCorp) {
		
		// $scope.goBack = function(){
		// 	if (gCorp.rootView === 'setup/create/system/viewUserInfo/view_user_info') {
		// 		gCorp.rootView = currentPage;
		// 		navCachedPages["setup/create/system/viewUserInfo/view_user_info"] = null;
		// 		navController.initWithRootView('setup/create/system/viewUserInfo/view_user_info', true, 'html');

		// 	} else {
		// 		navCachedPages["setup/create/system/set_system"] = null;
		// 		navController.initWithRootView('setup/create/system/set_system', true, 'html');
		// 		}
		// 	}
		
		$scope.sendRequestUpdate = function(){
				userInfo.newPosition = getValueById("idPosition");
				userInfo.newEmail = getValueById("idEmail");
				userInfo.newPhoneNumber = getValueById("idPhoneNumber");

			//HieutNT Sua theo comment so 39 START
			if (userInfo.newPosition == "" || userInfo.newPosition == undefined) {
				showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), [CONST_STR.get('SET_USER_POSITION')]))
				return
			};

			if (userInfo.newEmail == "" || userInfo.newEmail == undefined) {
				showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), [CONST_STR.get('SET_USER_EMAIL')]))
				return
			};

			if (userInfo.newPhoneNumber == "" || userInfo.newPhoneNumber == undefined) {
				showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), [CONST_STR.get('SET_USER_PHONE_NUMBER')]))
				return
			};
			//END

			//kiem tra xem co nhap dung email hay ko
			if (!validateEmail(userInfo.newEmail)) {
				showAlertText(CONST_STR.get("CORP_MSG_SET_ANN_EMAIL"));
				return;
			}
			
			if (userInfo.newPosition == userInfo.oldPosition){
				if (userInfo.newEmail == userInfo.oldEmail){
					if(userInfo.newPhoneNumber == userInfo.oldPhoneNumber){
						showAlertText(CONST_STR.get("CHECK_SET_USER_INFO"));
						return;
					}
				}	
			}
						
			gTrans.transInfo = {};

			gTrans.transInfo.iduser = userInfo.IDUSER;
			gTrans.transInfo.fullname = userInfo.FULLNAME;
			gTrans.transInfo.shortname = userInfo.SHORTNAME;
			gTrans.transInfo.cardnumber = userInfo.IDENTITYCARDNUMBER;
			gTrans.transInfo.allocatedate = userInfo.ALLOCATEDATE;
			gTrans.transInfo.oldPosition = userInfo.oldPosition;
			gTrans.transInfo.oldEmail = userInfo.oldEmail;
			gTrans.transInfo.oldPhoneNumber = userInfo.oldPhoneNumber;	
	
			//gTrans.transInfo.rootView = currentPage;			
			gTrans.transInfo.newPosition = userInfo.newPosition;
			gTrans.transInfo.newEmail = userInfo.newEmail;
			gTrans.transInfo.newPhoneNumber = userInfo.newPhoneNumber;
			gTrans.transInfo.idtxn ="S11";
			var listUserInfoChange = new Array();
			if (userInfo.newPosition != userInfo.oldPosition) {
				listUserInfoChange.push([CONST_STR.get("SET_USER_POSITION"),userInfo.newPosition]);
			}
			if (userInfo.newEmail != userInfo.oldEmail) {
				listUserInfoChange.push([CONST_STR.get("SET_USER_EMAIL"), userInfo.newEmail]);
			}
			if (userInfo.newPhoneNumber != userInfo.oldPhoneNumber) {
				listUserInfoChange.push([CONST_STR.get("SET_USER_PHONE_NUMBER"), userInfo.newPhoneNumber]);
			}
			gTrans.transInfo.allnew = listUserInfoChange;
						
            // var jsonData = new Object();
            // jsonData.sequenceId = "2";
            // jsonData.idtxn = "S11";
            // jsonData.transInfo = gTrans.transInfo;
            // var	args = new Array();
            // args.push(null);
            // args.push(jsonData);
            // var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_SETUP_CHANGE_PERSON_INFO"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            // var data = getDataFromGprsCmd(gprsCmd);
            // requestMBServiceCorp.post(data, true, function (response) {

                    // if (response.respCode == '0'){
						
						var requestData = {
                            idtxn: gTrans.transInfo.idtxn,
							sequenceId: "2",
							oldPosition:gTrans.transInfo.oldPosition,
							oldEmail:gTrans.transInfo.oldEmail,
							oldPhoneNumber:gTrans.transInfo.oldPhoneNumber,
							newPosition:gTrans.transInfo.newPosition,
							newEmail:gTrans.transInfo.newEmail,
							newPhoneNumber:gTrans.transInfo.newPhoneNumber
                        }

                        gTrans.requestData = requestData;
                        gTrans.src = "pages/setup/common-review/set_user_info_review.html";
						gTrans.ortherSrc = 'setup/create/system/changeUserInfo/set_user_info';
                        gTrans.cmdType =  CONSTANTS.get("CMD_CO_SETUP_CHANGE_PERSON_INFO");
                        navController.pushToView("common/common-review/transfer-review-scr", true, "html");
                    // }
                // },
                // function(){
                    // showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_INIT_TRANS'));
                // }
            // );
		}
		
	});	
	angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}

//lay thong tn nguoi dung hien thi len man hinh
function sendRequestGetUserInfo() {
	var objectValueClient = new Object();
	sequenceId = "1";
	objectValueClient.idtxn = "S11";
	objectValueClient.sequenceId = sequenceId;

	var arrayClientInfo = new Array();

	arrayClientInfo.push("1");
	arrayClientInfo.push(objectValueClient);

	var gprsCmd = new GprsCmdObj(1201, "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

	data = getDataFromGprsCmd(gprsCmd);

	requestMBServiceCorp(data, false, 0, requestServiceSuccess, requestServiceFail);
}

function requestServiceSuccess(e) {
	gprsResp = JSON.parse(e);
	var obj = gprsResp.respJsonObj;
	tmpData = obj;
	if (gprsResp.respCode == '0') {
		if (sequenceId == "1") {
			obj = obj[0];
			setValueId("idUserLogin", obj.IDUSER);
			setValueId("idFullName", obj.FULLNAME);
			setValueId("idShortName", obj.SHORTNAME);
			setValueId("idNumberCMT", obj.IDENTITYCARDNUMBER);
			setValueId("idDateRange", obj.ALLOCATEDATE);
			setValueInput("idPosition", obj.POSITION);
			setValueInput("idEmail", obj.EMAIL);
			setValueInput("idPhoneNumber", obj.PHONENUMBER);

			userInfo.IDUSER = obj.IDUSER;
			userInfo.FULLNAME = obj.FULLNAME;
			userInfo.SHORTNAME = obj.SHORTNAME;
			userInfo.IDENTITYCARDNUMBER = obj.IDENTITYCARDNUMBER;
			userInfo.ALLOCATEDATE = obj.ALLOCATEDATE;
			userInfo.oldPosition = obj.POSITION;
			userInfo.oldEmail = obj.EMAIL;
			userInfo.oldPhoneNumber = obj.PHONENUMBER;
		}
	}
}

function requestServiceFail(e){

}

/*** VIEW WILL UNLOAD ***/
function viewWillUnload() {
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

function setValueId(name, value) {
	if (value) {
		document.getElementById(name).innerHTML = value;
	} else {
		document.getElementById(name).innerHTML = "";
	}
}

function setValueInput(name, value) {
	if (value) {
		document.getElementById(name).value = value;
	} else {
		document.getElementById(name).value = "";
	}
}

function getValueById(name) {
	return document.getElementById(name).value;
}

function cancleClick() {

}

//ham kien tra xem email nhap vao co dung 
function validateEmail(email) {
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return re.test(email);
}

//ham kiem tra so dien thoai nhap vao dung hay ko
function handleInputPhoneNumber(event) {
	var charCode = (event.which) ? event.which : event.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;
}

function saveCurrentData() {
	userInfo.IDUSER = getValueById("idUserLogin");
	userInfo.FULLNAME = getValueById("idFullName");
	userInfo.SHORTNAME = getValueById("idShortName");
	userInfo.IDENTITYCARDNUMBER = getValueById("idNumberCMT");
	userInfo.ALLOCATEDATE = getValueById("idDateRange");
}

function controlInputText(field, maxlen, enableUnicode) {
	if (maxlen != undefined && maxlen != null) {
		textLimit(field, maxlen);
	}
	if (enableUnicode == undefined || !enableUnicode) {
		field.value = removeAccentinfo(field.value);
	}
}