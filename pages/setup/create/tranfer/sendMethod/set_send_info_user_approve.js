/***
* Edit by HaiNM
* Date: 12/26/2016
* Time: 5:00 PM
***/

var sequenceId;
var flagLoad = true;

/*** VIEW BACK FROM OTHER ***/
function viewBackFromOther() {
	logInfo('Back send info user approve');
	flagLoad = false;
}


/*** VIEW LOAD SUCCESS ***/
function viewDidLoadSuccess() {
	logInfo('Send info user approve load success');
	sendRequestGetUserInfo();
	iniData();
}

function iniData() {
	angular.module('EbankApp').controller('send-info-user-app', function ($scope, requestMBServiceCorp) {

		$scope.setupSendMethodExe = function () {
			var dataNewChoose = '';
			var dataChoose = '';
			var oldChoose = document.getElementById("methodSendOld").value;
			var maturityDirective = document.getElementsByName('maturityDirective');
			for (var i = 0; i < maturityDirective.length; i++) {
				if (maturityDirective[i].checked == true) {
					dataChoose = maturityDirective[i].value;
					dataNewChoose = 'send_' + maturityDirective[i].value;
				break;
				}
			}
			
			if (oldChoose == dataChoose){
				showAlertText(CONST_STR.get('CHECK_SEND_INFO_USER_APP'));
				return;
			}

			gTrans.transInfo = {};
			gTrans.transInfo.title = CONST_STR.get('COM_TRASACTION_INFO');
			gTrans.transInfo.label = CONST_STR.get('SET_SEND_TYPE_SEND_TITLE');
			//gTrans.transInfo.rootView = currentPage;
			gTrans.transInfo.value = document.getElementById(dataNewChoose).innerHTML;	
			gTrans.transInfo.sendMethodOld = oldChoose;
			gTrans.transInfo.sendMethodNew = dataChoose;
						
            // var jsonData = new Object();
            // jsonData.sequence_id = "2";
            // jsonData.idtxn = "S13";
            // jsonData.transInfo = gTrans.transInfo;
            // var	args = new Array();
            // args.push(null);
            // args.push(jsonData);
            // var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_SETUP_TYPE_SEND_INFO"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            // var data = getDataFromGprsCmd(gprsCmd);
            // requestMBServiceCorp.post(data, true, function (response) {
                //    if (response.respCode == '0'){

						var requestData = {
                            idtxn: "S13",
							sequenceId: "2",
							sendMethodOld:gTrans.transInfo.sendMethodOld,
							sendMethodNew:gTrans.transInfo.sendMethodNew,
                        }
                        gTrans.requestData = requestData;
						gTrans.src = "pages/setup/common-review/sendMethod_review.html";
						gTrans.cmdType =  CONSTANTS.get('CMD_CO_SETUP_TYPE_SEND_INFO');
						gTrans.ortherSrc = "setup/create/tranfer/sendMethod/set_send_info_user_approve";
						navController.pushToView("common/common-review/transfer-review-scr", true, "html");
                 //   }					

                // },
                // function(){
                    // showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_INIT_TRANS'));
                // }
            // );
		}

	//Thực hiện việc gọi lại màn hình cũ
		// $scope.setupCallBack = function () {
		// 	navCachedPages["setup/create/tranfer/set_tranfer"] = null;
		// 	navController.initWithRootView('setup/create/tranfer/set_tranfer', true, 'html');
		// }
		
	});
	angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}

function sendRequestGetUserInfo() {
	if (!flagLoad) {
		for (var i = 0; i < document.getElementsByName('maturityDirective').length; i++) {
	if (document.getElementsByName('maturityDirective')[i].value == gSetUp.choose) {
		document.getElementsByName('maturityDirective')[i].checked = "checked";
		break;
	}
		}
		return;
	}

	document.getElementById("templateMailTitle").style.display = "none";
	document.getElementById("templateMailContent").style.display = "none";
	document.getElementById("templateSMSTitle").style.display = "none";
	document.getElementById("templateSMSContent").style.display = "none";
	//gen sequence form
//	genSequenceForm();
	
	// Set dữ liệu trước khi gọi service
	var argsArray = [];
	argsArray.push("1");
	argsArray.push(JSON.stringify({
		sequenceId : "1",
		idtxn: "S13"
	}));

	var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_SETUP_TYPE_SEND_INFO"), "", "", gUserInfo.lang, gUserInfo.sessionID, argsArray);
	data = getDataFromGprsCmd(gprsCmd);

		// gọi service và xử lí logic
	requestMBServiceCorp(data, false, 0, function(data) {
	var response = JSON.parse(data);
		if (response.respCode == RESP.get('COM_SUCCESS') && response.responseType == CONSTANTS.get('CMD_CO_SETUP_TYPE_SEND_INFO')) {
			document.getElementById("methodSendOld").value = response.respJsonObj.methodSend;
			document.getElementById("templateMailContent").innerHTML = response.respJsonObj.mail;
			document.getElementById("templateSMSContent").innerHTML = response.respJsonObj.sms;

			// hien thi luc ban dau
			for (var i = 0; i < document.getElementsByName('maturityDirective').length; i++) {
				if (document.getElementsByName('maturityDirective')[i].value == response.respJsonObj.methodSend) {
			document.getElementsByName('maturityDirective')[i].checked = "checked";
			break;
				}
			}

			displayTemplate(response.respJsonObj.methodSend);
		} else {
			showAlertText(gprsResp.respContent);
			var tmpPageName = navController.getDefaultPage();
			var tmpPageType = navController.getDefaultPageType();
			navController.initWithRootView(tmpPageName, true, tmpPageType);
		}
	});
}

function displayTemplate(type) {
	gSetUp.choose = type;
	document.getElementById("templateMailTitle").style.display = "none";
	document.getElementById("templateMailContent").style.display = "none";
	document.getElementById("templateSMSTitle").style.display = "none";
	document.getElementById("templateSMSContent").style.display = "none";

	// Hiển thị ra template tương ứng với kiểu
	if (type == '0') {
		document.getElementById("rdbtnDisplay0").checked = true;
		document.getElementById("send_0").style.fontWeight = "bold";
		document.getElementById("send_1").style.fontWeight = "normal";
		document.getElementById("send_2").style.fontWeight = "normal";
		document.getElementById("send_3").style.fontWeight = "normal";
	} 
	else if (type == '1') {
		document.getElementById("templateMailTitle").style.display = "";
		document.getElementById("templateMailContent").style.display = "";
		document.getElementById("rdbtnDisplay1").checked = true;
		document.getElementById("send_0").style.fontWeight = "normal";
		document.getElementById("send_1").style.fontWeight = "bold";
		document.getElementById("send_2").style.fontWeight = "normal";
		document.getElementById("send_3").style.fontWeight = "normal";
	} 
	else if (type == '2') {
		document.getElementById("templateSMSTitle").style.display = "";
		document.getElementById("templateSMSContent").style.display = "";
		document.getElementById("rdbtnDisplay2").checked = true;
		document.getElementById("send_0").style.fontWeight = "normal";
		document.getElementById("send_1").style.fontWeight = "normal";
		document.getElementById("send_2").style.fontWeight = "bold";
		document.getElementById("send_3").style.fontWeight = "normal";
	} 
	else if (type == '3') {
		document.getElementById("templateMailTitle").style.display = "";
		document.getElementById("templateMailContent").style.display = "";
		document.getElementById("templateSMSTitle").style.display = "";
		document.getElementById("templateSMSContent").style.display = "";
		document.getElementById("rdbtnDisplay3").checked = true;
		document.getElementById("send_0").style.fontWeight = "normal";
		document.getElementById("send_1").style.fontWeight = "normal";
		document.getElementById("send_2").style.fontWeight = "normal";
		document.getElementById("send_3").style.fontWeight = "bold";
	}

	if (type >='4') {
		showAlertText(CONST_STR.get('CORP_MSG_PERIODIC_ERROR_INSERT_DATA'));
		return;		
	}
	/*if (mainContentScroll !== null)
	mainContentScroll.refresh();*/
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