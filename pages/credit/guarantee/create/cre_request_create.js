
var handleEventChoose;
var viewBack = false;
var pPurpose;
function viewBackFromOther() {
    viewBack = true;
}

function viewDidLoadSuccess() {
    if(!viewBack || (viewBack && (!checkScreenisMobilePX()))){
        if(gUserInfo.userRole.indexOf('CorpInput') == -1 || (CONST_BROWSER_MODE && checkScreenisMobilePX())) {
            navCachedPages['credit/manager_guarantee/manager-cre-request-create'] = null;
            navController.pushToView('credit/manager_guarantee/manager-cre-request-create', true, 'html');
        }else{
            initData();
        }
    }else{
        if(gUserInfo.userRole.indexOf('CorpInput') == -1 || (CONST_BROWSER_MODE && checkScreenisMobilePX())) {
            navCachedPages['menuxsl/dynamic-menu-scr'] = null;
            navController.popView('menuxsl/dynamic-menu-scr', true, 'html');
        }
    }
}

function initData(){
	angular.module("EbankApp").controller('cre-request-create', function ($scope, requestMBServiceCorp) {

		$scope.changeTab = function() {
            navCachedPages['credit/manager_guarantee/manager-cre-request-create'] = null;
            navController.pushToView('credit/manager_guarantee/manager-cre-request-create', true, 'html');
        }
		if(viewBack == true){
            for(var i=0;i<6;i++){
                if(CONST_SETUP_CRE_REQUEST_CREATE_KEY[i] == pPurpose ){
                  var purpose = (gUserInfo.lang == 'EN')? CONST_SETUP_CRE_REQUEST_CREATE_EN[i]: CONST_SETUP_CRE_REQUEST_CREATE_VN[i];
                    break;
                }
            }
            document.getElementById("id-mucdich").value= purpose;

        }else{
        	handleEventChoose = "0";
        	document.getElementById("id-mucdich").value = (gUserInfo.lang == 'EN')? CONST_SETUP_CRE_REQUEST_CREATE_EN[0]: CONST_SETUP_CRE_REQUEST_CREATE_VN[0];
        	pPurpose = "0";
        }
		$scope.setupSendMethodExe = function (){
			var radioChoose = '';
			var checkboxChoose = [];
			var radiog_lite = document.getElementsByName('radiog_lite');
			for (var i = 0; i < radiog_lite.length; i++) {
				if (radiog_lite[i].checked == true) {
					radioChoose = radiog_lite[i].value;
					break;
				}
			}
			var checkbox_lite = document.getElementsByName('checkbox_lite');
			for (var i = 0; i < checkbox_lite.length; i++) {
				if (checkbox_lite[i].checked == true) {
					checkboxChoose.push(checkbox_lite[i].value);
				}
			}
			
			if (radioChoose < 0 || radioChoose > 1 ){
				showAlertText("Hình thức cấp tín dụng lỗi");
				return
			}
			//console.log(checkboxChoose.length);

			// if (checkboxChoose.length <=0 || checkboxChoose.length >3){
				// alert("Xin hãy chọn loại hạn mức");
				// return		
			// }
			// console.log(checkboxChoose);

			/*for (i=0; i<checkboxChoose.length; i++){
				if (checkboxChoose[i] <= 0 || isNaN(checkboxChoose[i])){
					showAlertText("Đã xảy ra lỗi, xin vui lòng đăng nhập lại");
					return		
				}
			}*/
			
			var CreAmount = keepOnlyNumber(document.getElementById("cre-amount").value);
			var CreAmountCV = keepOnlyNumber(document.getElementById("cre-amount-cv").value);
			var CreAmountBL = keepOnlyNumber(document.getElementById("cre-amount-bl").value);
			var CreAmountLC = keepOnlyNumber(document.getElementById("cre-amount-lc").value);
			var BoxAmountCV = document.getElementById("checkbox1").checked;
			var BoxAmountBL = document.getElementById("checkbox2").checked;
			var BoxAmountLC = document.getElementById("checkbox3").checked;


			if (CreAmount == "" || CreAmount == undefined || CreAmount <=0 ) {
				showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), [CONST_STR.get("CRE_AMOUNT_LIMIT_REQUEST")]))
				return
			};

            if(BoxAmountCV != true && CreAmountCV == "" && BoxAmountBL != true && CreAmountBL == "" && BoxAmountLC !=true && CreAmountLC == "" ){
             showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),[CONST_STR.get("TYPE_LIMITS")]))
             return
             };
			if (BoxAmountCV == true){
				if (CreAmountCV == "" || CreAmountCV == undefined || CreAmountCV <=0 ) {
					showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), [CONST_STR.get("CRE_AMOUNT_LIMIT_LOAN")]))
					return
				};
			};
			
			if (CreAmountCV >0 && BoxAmountCV == false){
				showAlertText(CONST_STR.get('SELECT_LOAN'))
				return
			};			

			
			if (BoxAmountBL == true){
				if (CreAmountBL == "" || CreAmountBL == undefined || CreAmountBL <=0 ) {
					showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), [CONST_STR.get("CRE_AMOUNT_LIMIT_GUARANTEE")]))
					return
				};
			};
			
			if (CreAmountBL >0 && BoxAmountBL == false){
				showAlertText(CONST_STR.get('SELECT_GUARANTEE'))
				return
			};	
			
			if (BoxAmountLC == true){
				if (CreAmountLC == "" || CreAmountLC == undefined || CreAmountLC <=0 ) {
					showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), [CONST_STR.get("CRE_AMOUNT_LIMIT_LCOPEN")]))
					return
				};
			};
			
			if (CreAmountLC >0 && BoxAmountLC == false){
				showAlertText(CONST_STR.get('SELECT_LC'))
				return
			};	
			
			if (CreAmount.length > 12 || CreAmountCV.length > 12 || CreAmountBL.length > 12 || CreAmountLC.length > 12){
				showAlertText("Số tiền nhập chỉ cho phép tối đa 12 chữ số")
				return
			};
			//console.log(CreAmount);
			//console.log(CreAmountCV);
			if (Number(CreAmountCV) > Number(CreAmount) || Number(CreAmountBL) > Number(CreAmount) || Number(CreAmountLC) > Number(CreAmount)){
				showAlertText("Giá trị hạn mức tín dụng đề nghị phải là giá trị lớn nhất")
				return	
			};
			
			if (handleEventChoose ==""){
				showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), [CONST_STR.get("LOAN_REGISTER_FOCUS")]))
				return
			};
			
			var CreMonth = document.getElementById("cre-month").value;
			var CreText = document.getElementById("cre-text").value;
			
			if (CreMonth == "" || CreMonth == undefined || CreMonth <=0 ) {
				showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), [CONST_STR.get("CRE_LIMIT_ESTIMATE")]))
				return
			};
			
			if (CreText == "" || CreText == undefined) {
				showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'), [CONST_STR.get("CRE_REQUEST_COLLATERAL")]))
				return
			};


			gTrans.transInfo = {};

			gTrans.transInfo.form = radioChoose;
			gTrans.transInfo.limitRequest = CreAmount;
			
			if (BoxAmountCV == false){ 
				CreAmountCV = 0;
			};			
			gTrans.transInfo.limitLoan = CreAmountCV;
			
			if (BoxAmountBL == false){ 
				CreAmountBL = 0;
			};
			gTrans.transInfo.limitGuarantee = CreAmountBL;
			
			if (BoxAmountLC == false){ 
				CreAmountLC = 0;
			};
			gTrans.transInfo.limitLCOpen = CreAmountLC;
			
			gTrans.transInfo.purpose = handleEventChoose;
			gTrans.transInfo.limitEstimate = CreMonth;
			gTrans.transInfo.collateral = CreText;

            var jsonData = new Object();
            jsonData.sequence_id = "2";
            jsonData.idtxn = "C11";
            jsonData.transInfo = gTrans.transInfo;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CRE_REQUEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {

                    if (response.respCode == '0'){
						gTrans.transInfo.transId=response.respJsonObj.idfcatref;
						gTrans.transInfo.docInfo=response.respJsonObj.doc_info;
						gTrans.transInfo.fulllimitEstimate = CreMonth +' '+ CONST_STR.get('TRANS_PERIODIC_MONTH'); //tháng			
						navCachedPages['credit/guarantee/create/cre_request_create_checklist']=null;
						navController.pushToView('credit/guarantee/create/cre_request_create_checklist', true, 'html');
					}
                },
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_INIT_TRANS'));
                }
            );
		}
	
		$scope.showCreSelection = function() {
			var cbxValues = (gUserInfo.lang == 'EN')? CONST_SETUP_CRE_REQUEST_CREATE_EN: CONST_SETUP_CRE_REQUEST_CREATE_VN;
			addEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
			showDialogList(CONST_STR.get('SELECT_LOAN_PURPOSE'), cbxValues, CONST_SETUP_CRE_REQUEST_CREATE_KEY, false);
		}
		
	});
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}

/*** VIEW WILL UNLOAD ***/
function viewWillUnload() {
}

function handleInputAmount (e, des) {
    var trowConvert = document.getElementById('row_convert');
    formatCurrency(e, des);
    var numStr = convertNum2WordWithLang(removeSpecialChar(des.value), gUserInfo.lang);
    if(numStr){
		document.getElementById("trans.amounttotext").innerHTML = numStr;
        trowConvert.style.display = "";
    }else{
        trowConvert.style.display = 'none';
    }
}

function handleInputAmountNoText (e, des) {
    formatCurrency(e, des);
}

function controlInputText(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
   if (enableUnicode == undefined || !enableUnicode) {
       field.value = removeAccent(field.value);
       field.value = field.value.replace(/[!"#$%&*'\+:;<=>?\\`^~{|}]/g, '');
   }
}

function addEventListenerToCombobox(selectHandle, closeHandle) {
	document.addEventListener("evtSelectionDialog", selectHandle, false);
	document.addEventListener("evtSelectionDialogClose", closeHandle, false);
}

function removeEventListenerToCombobox(selectHandle, closeHandle) {
	document.removeEventListener("evtSelectionDialog", selectHandle, false);
	document.removeEventListener("evtSelectionDialogClose", closeHandle, false);
}

function handleCloseTransTypeCbx() {
	removeEventListenerToCombobox(handleSelectTransType, handleCloseTransTypeCbx);
}

function handleCloseTransTypeDetailCbx() {
	removeEventListenerToCombobox(handleSelectTransTypeDetail, handleCloseTransTypeDetailCbx);
}

function handleSelectdTransStatus(e) {
	removeEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
	handleEventChoose = e.selectedValue2;
	document.getElementById("id-mucdich").value = e.selectedValue1;
    pPurpose = handleEventChoose;
}

function handleCloseTransStatusCbx(e) {
	removeEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
}

function handleCloseMakerCbx(){
	removeEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
}