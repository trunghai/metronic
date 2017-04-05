/**
 * Created by HuyNT2.
 * User:
 * Date: 12/17/13
 * Time: 5:35 PM
 */
/*
 var usercheck;
 document.addEventListener("deviceready", passBtnList, false);
 var passBtnList = document.getElementsByClassName('pass_button');
 if (gIsAddedEvent == false) {
 gIsAddedEvent = true;
 for (index = 0; index < passBtnList.length; index++) {
 passBtnList[index].addEventListener('click', function (e) {
 e.preventDefault();
 actionPass(this);
 });
 }
 }

 */
var loginbg1=document.getElementById('login-1').offsetHeight;
var loginbg2=document.getElementById('login-2').offsetHeight;
var x =25;//chi so tang them div login khi nhap capcha
var y =30;//chi so giam div login khi da nho tai khoan dang nhap

var usercheck;
var intLogin = 0;
var intLoginResposne = 0;
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//

function onDeviceReady() {

	var passBtnList = document.getElementsByClassName('pass_button');
	if (gIsAddedEvent == false) {
		gIsAddedEvent = true;
		for (index = 0; index < passBtnList.length; index++) {
			passBtnList[index].addEventListener('touchstart', function (e) {

				e.preventDefault();
				actionPass(this);
			});
		}
	}
	if(gCustomerNo != undefined)
		sendJSONCheckFingerprintPINRequest();
}


setInputOnlyASCII('login.txt.password', CONST_STR.get("ERR_INPUT_ONLY_ASCII_CHAR"));
setInputOnlyASCII('login.txt.captcha', CONST_STR.get("ERR_INPUT_ONLY_ASCII_CHAR"));
//setInputOnlyNumber('login.txt.username', CONST_STR.get("ERR_INPUT_ONLY_NUMBER"));

var statusAccMode = false;
var touchIDTokenKey = '';
var isPinEX='';
var isflaglock='';
/*document.addEventListener("evtTouchID", function(){
 showAlertText("H3");
 }, true);*/


initLoginScr();
function initLoginScr() {
	statusAccMode = getUserInfoToLocal(); //get local data
	getUserAvatarFromLocal(); //anhpv1 avatar
	getLayoutConfig();
	getChangeBackGr();
	if(getURLParam('cif') && getURLParam('cif').length == 10) {
		statusAccMode = false;
		document.getElementById('login.txt.username').value = getURLParam('cif');
	}
	if(!statusAccMode) {
		getCaptcha();
		return;
	}
	updateViewWithUserInfo(statusAccMode);

	getCaptcha();
}

function viewDidLoadSuccess() {
	if (gModeScreenView == CONST_MODE_SCR_SMALL) {
		loginforMobile();
	}
	else{
		loginfoDesktop();
	}
	if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
		document.getElementById('login-3').style.display='none';
		document.getElementById('navigation.logo').style.display='none';
		document.getElementById('iconForgotPassword').style.right='5%';
		document.getElementById('login.border').style.borderBottom='1px solid rgba(255, 255, 255, 0.3)';
		document.getElementById('PrintandPin').style.display='none';
		document.getElementById('login.accountnamerow').style.display = 'none';
		document.getElementById('bottom_page').style.display='block';
	}
	document.addEventListener('evtChangeWidthDesktop',loginfoDesktop,false);
	document.addEventListener('evtChangeWidthMobile',loginforMobile,false);
	document.getElementById('footerSlide').style.display = 'block';
	document.getElementById('mainlayoutfooter').style.display = 'block';
//    document.getElementById('floatingButton').style.display = 'block';
	document.getElementById('navActionbar').style.display = 'none';
	document.getElementById('nav.btn.homeright').style.display = 'block';
	document.getElementById('mainview').style.background = 'none';


	//CHANGE BANNER
	var capchar = document.getElementById('trow_capcha');
	if(capchar!= undefined){
		capchar.style.display='none';
	}

	logInfo('load login view success');
	document.getElementById("login.txt.username").onblur = function() {
		var loginUser = document.getElementById("login.txt.username");
		var tmpStr = loginUser.value;
		if(parseInt(tmpStr) >0){
			if (tmpStr && tmpStr > 0 && tmpStr.length < 8) {
				loginUser.value = '00000000'.substring(0, 8 - tmpStr.length) + tmpStr;
				tmpStr = loginUser.value;
			}
		}
	};

	if(gUserInfo.lang == 'EN') {
		document.getElementById('login.BannerBottom').innerHTML = '<a href="' + bannersTPBank.bottomBanner[0].bannerLinkEN + '"><img style="height:85px;" src="' + bannersTPBank.bottomBanner[0].bannerImageEN + '"></a>';
	}
	else {
		document.getElementById('login.BannerBottom').innerHTML = '<a href="' + bannersTPBank.bottomBanner[0].bannerLinkVN + '"><img style="height:85px;" src="' + bannersTPBank.bottomBanner[0].bannerImageVN + '"></a>';
	}


	//TUANNM5 PINCODE VIEW INIT

	//PINCODE VIEW INIT END
	//sendJSONCheckFingerprintPINRequest();
	//Sangnt1 l?y l?i count notification chua d?c
	setTimeout(function(){
		gDeviceTokenPush = localStorage.gDeviceTokenPush;
		getCountDataNotificationUnread();

	},1000);
}


function viewWillUnload() {
	//flag = false;
	logInfo('view login will unload');
	document.removeEventListener('evtChangeWidthMobile',loginforMobile,false);
	document.removeEventListener('evtChangeWidthDesktop',loginfoDesktop,false);
	// document.getElementById('mainview').style.background = 'rgba(255,255,255,0.8)';
	document.getElementById('bottom_page').style.display='none';
	document.getElementById('mainlayoutfooter').style.display='none';
}

function changeLoginMode() {
	if((gPincode == '' && gUsingFingerprint != '1' )|| (document.getElementById('login.txt.username').style.display != 'none' && document.getElementById('login.txt.username').value == ''))
	{
		//alert('chua dang ki ');
		createDialog();
		modalDialog.showDialog();
		//showAlertNOT_ALLOW_USE_FINGERSPRINT(CONST_STR.get('FINGER_PRINT_NOT_ALLOW'));
		//showAlertKHCN_KHDN_FAQ('ban can phai dng nhap lai do chua duoc dong bo voi tai khoan tren server, click vào day di');
		return;
	}
	if(isflagloginsuccess == 'N')
		showAlertText(CONST_STR.get('PIN_LAST_LOGINSUCCESS_ALERT'));
	var touchIDTimer = setInterval(function(){
		//if (touchIDTokenKey != null && touchIDTokenKey.length > 0) {
		clearInterval(touchIDTimer);
		var devicePlatform = device.platform;
		var versionSDK = device.version;
		if(devicePlatform == 'Android' && versionSDK != 'undefined' && parseInt(versionSDK) >= 6){
			cordova.exec(function(e){
				console.log('Thanh cong login qua van tay roi' + e );
				loginWithTouchID();
			}, function(e){
				console.log('Loi login qua van tay roi' + e );
				if( isPinEX=='Y' ){
					showAlertText(CONST_STR.get('PIN_EX_DATE_ALERT'));
				}else{
					if (gPincode != '-1') {
						//KH da dang ky su dung PIN code tren thiet bi nay
						gUsingPinpadMode = 'login';
						paramObj = {
							typeAction: gUsingPinpadMode,
							pass:gPincode

						}
						document.getElementById('div-pinpad').style.display = '';
						document.getElementById('pageFooter').style.zIndex = -1;
					} else {
						document.getElementById('div-login-normal').style.display = '';
					}
				}
			}, 'FingerPrint', 'checkMyFingerPrint', ['checkMyFingerPrint']);
		}
		else{
			THEBTouchID.showFingerprintWithPIN('abc', 'def', 'Huynt2', function(){
				loginWithTouchID();
			}, function(e) {
				if (e == '3') {
					//showAlertText(CONST_STR.get("TOUCHID_3_TIMES_FAIL_ALERT"));
				}
				//alert('Dang nhap bang PIN code');
				if( isPinEX=='Y' ){
					showAlertText(CONST_STR.get('PIN_EX_DATE_ALERT'));
				}else{
					if (gPincode != '-1') {
						//KH da dang ky su dung PIN code tren thiet bi nay
						gUsingPinpadMode = 'login';
						paramObj = {
							typeAction: gUsingPinpadMode,
							pass:gPincode

						}
						document.getElementById('div-pinpad').style.display = '';
						document.getElementById('pageFooter').style.zIndex = -1;
					} else {
						document.getElementById('div-login-normal').style.display = '';
					}
				}
			});
		}
		// }
	}, 200);
	setTimeout(function(){
		if(touchIDTimer) {
			clearInterval(touchIDTimer);
		}
	}, 45000);
}

/*
 function openQRCodeScanner() {
 //alert('happend');
 var touchIDTimer = setInterval(function(){
 //if (touchIDTokenKey != null && touchIDTokenKey.length > 0) {
 clearInterval(touchIDTimer);
 //alert('1');
 THEBTouchID.loadQRCodeScanner('abc', function() {

 }, function() {

 });
 //}
 }, 200);
 setTimeout(function(){
 if(touchIDTimer) {
 clearInterval(touchIDTimer);
 }
 }, 45000);
 }
 */

function openEBankSiteOK() {
	openEBankSiteCancel();
	window.open(encodeURI(CONST_WEB_URL_LINK + '?cif=' + tmpStr), '_system');
}

function openEBankSiteCancel() {
	document.removeEventListener('alertAppConfirmOK', openEBankSiteOK, false);
	document.removeEventListener('alertAppConfirmCancel', openEBankSiteCancel, false);
}


function openEBankSiteOK() {
	openEBankSiteCancel();
	window.open(encodeURI(CONST_WEB_URL_LINK + '?cif=' + tmpStr), '_system');
}

function openEBankSiteCancel() {
	document.removeEventListener('alertAppConfirmOK', openEBankSiteOK, false);
	document.removeEventListener('alertAppConfirmCancel', openEBankSiteCancel, false);
}

//METHOD GET CAPCHAR FROM CORE
// function getCaptcha(){
// 	var data = {};
// 	var arrayArgs = new Array();
// 	gHashCode=randomString();
// 	//alert(hashCode);
// 	arrayArgs.push(gHashCode);
// 	var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_TYPE_GET_CAPCHA"), "", "", "", "", arrayArgs);
//
// 	data = getDataFromGprsCmd(gprsCmd);
//
// 	requestBacgroundMBService('CMD_TYPE_GET_CAPCHA', arrayArgs, requestMBServiceCapchaSuccess, requestMBServiceCapchaFail);
// }
function getCaptcha() {
	var data = {};
	var arrayArgs = new Array();
	var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_TYPE_GET_CAPCHA"), "", "", "", "", arrayArgs);

	data = getDataFromGprsCmd(gprsCmd);

	requestBacgroundMBService('CMD_TYPE_GET_CAPCHA', arrayArgs, requestMBServiceCapchaSuccess,
		requestMBServiceCapchaFail);
}

//event listener: http request success
function requestMBServiceCapchaSuccess(e){
	gprsResp = parserJSON(e, false);
	var notiCaptcha = document.getElementById("login.txt.captcha");
	var image_captcha = gprsResp.respRaw;

	if ((gprsResp.respCode == '0')
		&& (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_TYPE_GET_CAPCHA"))))
	{

		current_md5_capcha = gprsResp.arguments[0];
		 /*notiCaptcha.placeholder = gprsResp.arguments[1];*/
		var tmpCaptcha = document.getElementById('captcha_gen');

		if(tmpCaptcha != undefined && tmpCaptcha != null) {
			tmpCaptcha.setAttribute('src', image_captcha);
		}
	}
	else if ((gprsResp.respCode != '0') &&
		((parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_TYPE_GET_CAPCHA"))
		|| (gprsResp.responseType == '-1')))) {
		var tmpCaptcha = document.getElementById('captcha_gen');
		if(tmpCaptcha != undefined && tmpCaptcha != null) {
			tmpCaptcha.setAttribute('src', "./assets/images/re-captcha.png");
		}
	}
};

//event listener: http request fail
function requestMBServiceCapchaFail(e){
	var tmpCaptcha = document.getElementById('captcha_gen');
	if(tmpCaptcha != undefined && tmpCaptcha != null) {
		tmpCaptcha.setAttribute('src', "./assets/images/re-captcha.png");
	}
	logInfo('FAILED');
};


function loginfoDesktop(){
	var mainViewContent=document.getElementById('mainViewContent');
	var bottom_page= document.getElementById('page_Bannerbottom');
	var mainview=document.getElementById('mainview');
	if (currentPage == 'login-scr') {
		if (mainview) {
			mainview.style.height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) +'px';
			mainview.style.height=(innerHeight-160) +'px';
			mainview.style.transform='translate(0px, 0px) translateZ(0px);'
		}
		if (mainViewContent) {
			mainViewContent.style.top = '0px';
			mainViewContent.style.bottom = '0px';
			mainViewContent.style.height='425px';
			mainViewContent.style.background='inherit';
			mainViewContent.style.paddingTop='0';
		}
		if (navBottomBar) {
			navBottomBar.style.display = 'none';
		}
		var infoMationAvatar=document.getElementById('infoMationAvatar');
		infoMationAvatar.style.textAlign='left';
		infoMationAvatar.style.paddingLeft='30%';
		infoMationAvatar.style.paddingTop='0%';
		infoMationAvatar.style.width='54%';
		document.getElementById('login.accountnamerow').style.display='none';
		document.getElementById('div-login-normal').style.top='0';
		var reName="";
		if (gCustomerNanme !== undefined && gCustomerNanme.length > 19){
			reName="" +gCustomerNanme.substring(0, 18)+"...";
		}else{
			reName=gCustomerNanme;
		}
		document.getElementById('name.userlogin').innerHTML = reName;
		document.getElementById('login-3').style.display='none';
		document.getElementById('UserAvatar').style.paddingTop='0%';
		document.getElementById('UserAvatar').style.paddingRight='30%';
		document.getElementById('navigation.logo').style.display='none';
		document.getElementById('login.border').style.borderBottom='1px solid rgba(255, 255, 255, 0.3)';
		document.getElementById('iconForgotPassword').style.right='5%';
		document.getElementById('iconForgotPassword').style.top='inherit';
		document.getElementById('iconForgotPassword').style.paddingTop='4px';
		document.getElementById('menu-section').style.display='none';
		document.getElementById('headermb').style.display='none';
		document.getElementById('nav.btn.homeright').style.display='none';
		document.getElementById('id.qrcode.btn').style.display='none';
		document.getElementById('id.call.btn').style.display='none';
		document.getElementById('bottom_page').style.display='block';
		document.getElementById('mainlayoutfooter').style.display='block';
//        document.getElementById('floatingButton').style.display='none';
		document.getElementById('trow_capcha_bottom').style.borderBottom='1px solid rgba(255, 255, 255, 0.3)';
		var LoginAccountnumberrow=document.getElementById('login.txt.username');
		statusAccMode=getUserInfoToLocal();
		if (statusAccMode=='') {
			document.getElementById('loginAccountnumberrow').style.borderBottom='1px solid rgba(255, 255, 255, 0.3)';
		}
		else{
			document.getElementById('loginAccountnumberrow').style.borderBottom='none';
		}
	}
}
function loginforMobile(){
	if (currentPage == 'login-scr') {
		if (mainViewContent) {
			mainViewContent.style.height = 'auto';
			mainViewContent.style.top = '40px';
			mainViewContent.style.bottom =  '0px';
			mainViewContent.style.width='100%';
			mainViewContent.style.left='0';
			mainViewContent.style.paddingTop='10%';
		}
		if (navBottomBar) {
			navBottomBar.style.display = 'none';
		}
		document.getElementById('UserAvatar').style.paddingTop='0';
		document.getElementById('UserAvatar').style.paddingRight='4%';
		var infoMationAvatar=document.getElementById('infoMationAvatar');
		infoMationAvatar.style.textAlign='left';
		infoMationAvatar.style.paddingLeft='7%';
		infoMationAvatar.style.paddingTop='0';
		infoMationAvatar.style.width='70%';
		document.getElementById('div-login-normal').style.top='16px';
		var reName="";
		if (gCustomerNanme !== undefined && gCustomerNanme.length > 19){
			reName="" +gCustomerNanme.substring(0, 18)+"...";
		}else{
			reName=gCustomerNanme;
		}
		document.getElementById('name.userlogin').innerHTML = reName;
		document.getElementById('login-3').style.display='block';
		document.getElementById('login.border').style.borderBottom='none';
		document.getElementById('iconForgotPassword').style.top='5%';
		document.getElementById('iconForgotPassword').style.right='-35%';
		document.getElementById('iconForgotPassword').style.paddingTop='0';
		document.getElementById('loginAccountnumberrow').style.borderBottom='none';
		document.getElementById('headermb').style.display='block';
		document.getElementById('PrintandPin').style.display='block';
		document.getElementById('login-1').style.height='168px;'
		document.getElementById('bottom_page').style.display='none';
		document.getElementById('mainlayoutfooter').style.display='block';
//        document.getElementById('floatingButton').style.display='block';
		document.getElementById('trow_capcha_bottom').style.borderBottom='none';

	}
}
function updateViewWithUserInfo(inStatus) {

	if (inStatus && gCustomerNanme && gCustomerNanme.length > 0){// && (getURLParam('payment') != 'order')) {
		document.getElementById('login.txt.username').style.display = 'none';
		document.getElementById('login.txt.username').value = gCustomerNo;

		document.getElementById('login.ico.username').style.display = 'none';
		document.getElementById('login.accountname').style.display = 'inherit';
		document.getElementById('iconForgotPassword').style.top='5%';
		//anhntt thay doi div khi da co ten tai khoan
		document.getElementsByClassName('icon-pin-fingerprints')[0].setAttribute('style','margin-top:22px');
		var heightbg1=loginbg1-x;
		var heightbg2=loginbg2-y;
		document.getElementById('login-1').setAttribute('style','height:'+heightbg1+'px');
		document.getElementById('login-2').setAttribute('style','height:'+heightbg2+'px');
		document.getElementById('login-3').style.height='84px';
		document.getElementById('login-4').style.height='74px';
		if(gModeScreenView == CONST_MODE_SCR_SMALL){
			if(!Environment.isMobile()){
				var tmpNodeAccName = document.getElementById('login.accountname');
				tmpNodeAccName.innerHTML = gCustomerNanme;
				document.getElementById('navigation.logo').style.display='none';
			}else{

				document.getElementById('updateinfo.secondtime').style.display='block';
				document.getElementById('navigation.logo').style.display='none';
				document.getElementById('name.userlogin').innerHTML = gCustomerNanme;
				document.getElementById('user.avatar').style.display = 'none';
				var tmpUserAvatar = document.getElementById('user.avatar');
				if(gUserAvatar !="undefined")
				{
					tmpUserAvatar.src= gUserAvatar;
					tmpUserAvatar.style.display = '';
				}
			}
			if(Environment.isMobile()){
				var tmpNodeAccName = document.getElementById('login.accountname');
				tmpNodeAccName.innerHTML = gCustomerNanme;
				document.getElementById('navigation.logo').style.display='none';
			}else{

				document.getElementById('updateinfo.secondtime').style.display='block';
				document.getElementById('navigation.logo').style.display='none';
				document.getElementById('name.userlogin').innerHTML = gCustomerNanme;
				document.getElementById('user.avatar').style.display = 'none';
				var tmpUserAvatar = document.getElementById('user.avatar');
				if(gUserAvatar !="undefined")
				{
					tmpUserAvatar.src= gUserAvatar;
					tmpUserAvatar.style.display = '';
				}
			}
		}
		else{
			if(Environment.isWindows()){
				var tmpNodeAccName = document.getElementById('login.accountname');
				tmpNodeAccName.innerHTML = gCustomerNanme;
			}else{
				document.getElementById('updateinfo.secondtime').style.display='block';
				document.getElementById('navigation.logo').style.display='none';
				document.getElementById('name.userlogin').innerHTML = gCustomerNanme;
				document.getElementById('user.avatar').style.display = 'none';
				var tmpUserAvatar = document.getElementById('user.avatar');
				if(gUserAvatar !="undefined")
				{
					tmpUserAvatar.src= gUserAvatar;
					tmpUserAvatar.style.display = '';
				}
			}
			document.getElementById('login-3').style.display='none';
			document.getElementById('login.border').style.borderBottom='1px solid rgba(255, 255, 255, 0.3)';
			document.getElementById('PrintandPin').style.display='none';
		}
		//anhntt.fsoft set layout accno
		if(gModeScreenView == CONST_MODE_SCR_SMALL){
			if(gKeylayout==1){
				changecsstopath('cssmb');
			}else if(gKeylayout==2){
				changecsstopath('cssmb-light');
			}else{
				changecsstopath('cssmb');
			}
		}
		for(var i=1;i<=24;i++) {
			if(changeBackGround==i){
				ChangeImg(i);
			}
		}

	}

	else {
		if(gModeScreenView == CONST_MODE_SCR_SMALL){
			document.getElementById('login.txt.username').style.display = 'block';
			document.getElementById('login.txt.username').value = '';
			document.getElementById('login.ico.username').style.display = 'block';
			document.getElementById('login.accountname').style.display = 'none';
			document.getElementById('updateinfo.secondtime').style.display='none';
			document.getElementById('navigation.logo').style.display='block';
			document.getElementById('iconForgotPassword').style.top='none';
		}
		else{
			document.getElementById('login.txt.username').style.display = 'block';
			document.getElementById('login.txt.username').value = '';
			document.getElementById('login.ico.username').style.display = 'block';
			document.getElementById('login.accountname').style.display = 'none';
			document.getElementById('updateinfo.secondtime').style.display='none';
			document.getElementById('navigation.logo').style.display='none';
			document.getElementById('iconForgotPassword').style.top='none';
			document.getElementById('loginAccountnumberrow').style.borderBottom='1px solid rgba(255, 255, 255, 0.3)';
		}
	}
}

function changeModeInputAccNo() {
	//anhntt login voi truong hop binh thuong
	document.getElementsByClassName('icon-pin-fingerprints')[0].setAttribute('style','margin-top:0px');
	document.getElementById('login-1').setAttribute('style','height:'+loginbg1+'px');
	document.getElementById('login-2').setAttribute('style','height:'+loginbg2+'px');
	document.getElementById('login-3').style.height='90px';
	document.getElementById('login-4').style.height='80px';

	document.getElementById('navigation.logo').style.display='none';
	var tmpStatus = getUserInfoToLocal();
	getUserAvatarFromLocal(); //anhpv1
	if(!tmpStatus) {

		return;
	}
	statusAccMode = !statusAccMode;
	updateViewWithUserInfo(statusAccMode);
}

//handle input
var tmpNodeUser = document.getElementById('login.txt.username');
tmpNodeUser.addEventListener('evtSpecialKeyPressed', handleSpecialKeyPressd, false);
var tmpNodePass = document.getElementById('login.txt.password');
tmpNodePass.addEventListener('evtSpecialKeyPressed', handleSpecialKeyPressd, false);
var tmpNodeCaptcha = document.getElementById('login.txt.captcha');
tmpNodeCaptcha.addEventListener('evtSpecialKeyPressed', handleSpecialKeyPressd, false);

function handleSpecialKeyPressd(e)
{
	var ew = e.keyPress;
	if (ew == 13) { //Enter pressed
		requestLogin();
	}
	else {
		return;
	}
}


document.getElementById('login.txt.username').onchange = function(e) {
	var tmpStr = document.getElementById('login.txt.username').value;
	if (!CONST_BROWSER_MODE && tmpStr.length == 10) {
		window.open(encodeURI(CONST_WEB_URL_LINK + '?cif=' + tmpStr), '_system');
		/*showAlertAppText(CONST_STR.get('OPEN_CORP_SITE_ALERT_CONTENT'), CONST_STR.get('BANNER_ALERT_MOBILE_BTN_OK'), CONST_STR.get('BANNER_ALERT_MOBILE_BTN_CANCEL'));
		 document.addEventListener('alertAppConfirmOK', openEBankSiteOK, false);
		 document.addEventListener('alertAppConfirmCancel', openEBankSiteCancel, false);	*/
	}
}

function requestLogin() {
	if ((!statusAccMode) && (document.getElementById("login.txt.username").value.length == 0)){
		showAlertText(CONST_STR.get("ERR_EMPTY_ACC_INPUT"));
		return;
	}

	//passing
	sendJSONRequest();

}

function goToBankInfoMainScr() {
	navController.pushToView('bankinfo/bank-info-main-scr', true);
}

var gprsResp = new GprsRespObj("","","","");
var info_common = {};
var info_menu = {};
var info_acc = {};

function sendJSONRequest() {

	// collect the form data while iterating over the inputs
	var data = {};
	var arrayArgs = new Array();
	var loginUser = document.getElementById("login.txt.username");
	var loginPass = document.getElementById("login.txt.password");
	var loginCaptcha = document.getElementById("login.txt.captcha");
	var isMobile;
	var checkCaptcha = "N";
	if (Environment.isMobile()){
		isMobile = 1;
	}else {
		isMobile = 0;
	}

	// var tmpStr = statusAccMode? gCustomerNo : loginUser.value;
	// if(statusAccMode) loginUser.value = gCustomerNo;
	var tmpStr = statusAccMode? localStorage.getItem('TPBankUserNumber') : loginUser.value;
	if(statusAccMode) loginUser.value = localStorage.getItem('TPBankUserNumber');
	usercheck =tmpStr;
	if(parseInt(tmpStr)> 0){
		if (tmpStr.length < 8) {
			loginUser.value = '00000000'.substring(0, 8 - tmpStr.length) + tmpStr;
			tmpStr = loginUser.value;
		}
		if (loginUser.value.length != 8 && loginUser.value.length != 10) {
			showAlertText(CONST_STR.get('ERR_INPUT_FORMAT_ACC'));
			return;
		}
	}


	tmpStr = loginPass.value;
	if (tmpStr.length < 1) {
		showAlertText(CONST_STR.get('ERR_EMPTY_PASSWORD'));
		return;
	}

	if (!checkAvailableChar(tmpStr)) {
		showAlertText(CONST_STR.get('ERR_MSG_WRONG_PASSWORD_FORMAT'));
		return;
	}

    tmpStr = loginCaptcha.value;
    if (intLogin > 1){
        checkCaptcha = 'Y';
        if (tmpStr.length < 1) {
            showAlertText(CONST_STR.get('ERR_EMPTY_CAPTCHA'));
            return;
        }
    }


	/*if(loginUser.value.length == 10 && CONST_BROWSER_MODE) {
	 document.getElementsByName('fldLoginUserId')[0].value = loginUser.value;
	 document.getElementsByName('fldPassword')[0].value = loginPass.value;
	 document.getElementsByName('fldCaptchar')[0].value = loginCaptcha.value;
	 document.getElementsByName('fldCaptcharChecksum')[0].value = encodeURIComponent(current_md5_capcha);
	 document.getElementById('fldLoginIBForm').setAttribute('action', CONST_WEB_CORP_URL_LINK);
	 document.getElementById('fldGoToIBank').click();
	 return;
	 }*/



	var request = {
		user : loginUser.value,
		pass : loginPass.value,
		captcha : loginCaptcha.value,
		hashcode : encodeURIComponent(current_md5_capcha),
		userAgent : navigator.userAgent,
        isMobile : isMobile,
		isCheckCapt : checkCaptcha

	}

    arrayArgs.push("");
    arrayArgs.push(request);

	var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_TYPE_LOGIN"), "", "", gUserInfo.lang, "", arrayArgs);

	data = getDataFromGprsCmd(gprsCmd);

	requestMBService(data, true, 0, requestMBServiceSuccess, requestMBServiceFail);

}

function requestMBServiceSuccess(e) {
    gprsResp = parserJSON(e);
    hideLoadingMask();
    if (gprsResp.responseType == CONSTANTS.get("CMD_TYPE_LOGIN") && gprsResp.respCode == 1) {
        intLoginResposne = gprsResp.respJsonObj.count_login_fail;

        if(intLoginResposne >= 3){
            intLogin = intLoginResposne;
        }else {
            intLogin = intLogin + 1;
        }


        if(intLogin > 1){
            var inputCaptcha = document.getElementById("trow_capcha");
            inputCaptcha.style.display = '';

            var Heightlg1=loginbg1+x;
			var Heightlg2=loginbg2+x;
			document.getElementById('login-1').setAttribute('style','height:'+Heightlg1+'px');
			document.getElementById('login-2').setAttribute('style','height:'+Heightlg2+'px');
			document.getElementById('login-3').style.height='112px';
			document.getElementById('login-4').style.height='102px';
        }


        getCaptcha();
        var captChar = document.getElementById('login.txt.captcha');
        if (captChar != null) {
            captChar.value = "";
        }
        return;
    }



    if(contentPromotion.isOpen){
        return;
    }

    info_common = gprsResp.respJsonObj.info.myHashMap;
    info_acc = gprsResp.respJsonObj.list_acc;
    info_menu = gprsResp.respJsonObj.menu;

    // if(parseInt(gprsResp.respCode) =='2009'){
    //     var capchar = document.getElementById('trow_capcha');
    //     if(capchar!= undefined){
    //         capchar.style.display='';
    //         //anhntt thay doi height cho div login
    //         var Heightlg1=loginbg1+x;
    //         var Heightlg2=loginbg2+x;
    //         document.getElementById('login-1').setAttribute('style','height:'+Heightlg1+'px');
    //         document.getElementById('login-2').setAttribute('style','height:'+Heightlg2+'px');
    //         document.getElementById('login-3').style.height='112px';
    //         document.getElementById('login-4').style.height='102px';
    //     }
    //
    //     showAlertText(gprsResp.respContent);
    //     return;
    // }
    if ((parseInt(gprsResp.respCode) == parseInt(RESP.get('COM_SUCCESS')))||(parseInt(gprsResp.respCode) == parseInt(RESP.get('COM_PASSWORD_EXPIRE')))
        && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_TYPE_LOGIN")))) {

        /***** DAMNV: LUU TOCKENKEY KHI LOGIN THANH CONG VE DIVICE********/
        var index1=0;
        for (var i=0; i<gprsResp.arguments.length; i++) {
            if(gprsResp.arguments[i] == 'FINGER_TOKEN_END') {
                index1 =i-1;
                break;
            }
        }
        var tokenKey1 = gprsResp.arguments[index1];
        if (typeof(Storage) !== "undefined" && tokenKey1 != 'NO-CHANGE') {
            try {
                localStorage.setItem('TouchIDTokenKey', tokenKey1);
                logInfo('Set local storage complete');
            }
            catch(err) {
                logInfo('Browser not support local store');
            }
        }
        else {
            logInfo('Browser not support local store');
        }
        gCustomerNo = info_common.user;
        gCompanyName = info_common.datahomepage.myHashMap.companyName;
        gLastLogin = info_common.datahomepage.myHashMap.lastLogin;
        parserLoginInfo();
        try{
            gSysData = JSON.parse(gprsResp.respJson);
        }catch(e)
        {
        }
        //setUserInfoToLocal(loginUser.value, gUserInfo.accountName);
        gUserInfo.lang = getLanguageConfig();
        gIsLogin = true;

        //config view
        setViewOnDesktopWhenLogin();
		if(gUserInfo.userRole.indexOf('CorpInput') == -1){
			document.getElementById('avatarGD').style.display = 'block';
            document.getElementById('avatarKT').style.display = 'none';
		}else {
            document.getElementById('avatarGD').style.display = 'none';
            document.getElementById('avatarKT').style.display = 'block';
		}
        document.getElementById('tabHost').innerHTML = "";

        //using to redirect online payment
        if(getURLParam('payment') == 'order') {
            setTimeout(function(e){
                navController.initWithRootView('paymentxsl/payment-online-shopping-create', true, 'xsl');
                navController.setDefaultPage('accountxsl/account-scr', 'xsl');
            }, 1000);
        }
        else if(getURLParam('payment') == 'ecounter') {
            setTimeout(function(e){
                navController.initWithRootView('paymentxsl/payment-ecounter', true, 'xsl');
                navController.setDefaultPage('accountxsl/account-scr', 'xsl');
            }, 1000);
        }
        else if(getURLParam('payment') == 'pocket') {
            setTimeout(function(e){
                navController.pushToView('paymentxsl/payment-topup-create-scr', true, 'xsl');
                setTitleBar(CONST_STR.get('TOPUP_REPAYMENT_SCREEN_TITLE'));
                // navController.initWithRootView('paymentxsl/payment-topup-create-scr', true, 'xsl');
                // navController.setDefaultPage('accountxsl/account-scr', 'xsl');
            }, 1000);
        }
        else {
            gotoHomePage();
        }

        var btnChangeLangIB = document.getElementById("btnChangLanguageIB");
        btnChangeLangIB.style.visibility = "hidden";
        btnChangeLangIB.style.webkitBackfaceVisibility = "hidden";
        btnChangeLangIB.style.backfaceVisibility = "hidden";

        var btnChangeLang = document.getElementById("btnChangLanguage");
        btnChangeLang.style.display = "none";

        var mobilefooter = document.getElementById("mainlayoutfooter");
        mobilefooter.style.display = "none";
        var homeBtn = document.getElementById('id.home.btn');
        if(homeBtn!=null){
            homeBtn.style.display = 'block';
        }
        logInfo('hide lang button - end');

        //Sangnt1
        setTimeout(function(){
            getCountDataNotificationUnread();
        },4000);
    }
    // else if (((parseInt(gprsResp.respCode) == 2001) || (parseInt(gprsResp.respCode) == 1)) &&
    //     (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_TYPE_LOGIN")))){
    //     //B1 clear
    //     getCaptcha();
    //     var captChar = document.getElementById('login.txt.captcha');
    //     if(captChar !=null){
    //         captChar.value = "";
    //     }
    // }
    // //ngocdt3 bo sung
    // else if(parseInt(gprsResp.respCode) == 20||parseInt(gprsResp.respCode) == 21){
    //     if(parseInt(usercheck) >0 && usercheck.length ==10){
    //         showAlertAppText(CONST_STR.get('CHANGE_USER_NAME_DN'), CONST_STR.get('BENEFIC_LIST_YES'), CONST_STR.get('BENEFIC_LIST_NO'));
    //     }
    //     document.addEventListener('alertAppConfirmOK', showChoiceConfirmPre, false);
    //     document.addEventListener('alertAppConfirmCancel', showChoiceConfirmPreClose, false);
    // }
    //nogcdt3 end

};

function loginWithTouchID() {
	var data = {};
	var arrayArgs = new Array();
	var tokenKey = '';

	//localStorage.setItem('TouchIDTokenKey', '');
	tokenKey = localStorage.getItem('TouchIDTokenKey');

	arrayArgs.push(device.uuid);
	//arrayArgs.push('123456');
	//arrayArgs.push(touchIDTokenKey);
	arrayArgs.push(tokenKey);

	var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_TOUCHID_LOGIN"), "", "", gUserInfo.lang, "", arrayArgs);

	data = getDataFromGprsCmd(gprsCmd);

	requestMBService(data, true, 0, requestMBServiceSuccess, requestMBServiceFail);
}

function sendJSONCheckFingerprintPINRequest() {
	// collect the form data while iterating over the inputs
	var data = {};
	var arrayArgs = new Array();
	var deviceID ='';//= device.uuid;
	try {
		deviceID = device.uuid;
		arrayArgs.push(deviceID);
		if(gDeviceRestartFlag){
			arrayArgs.push('Y');
		}else{
			arrayArgs.push('');
		}
//		arrayArgs.push('718207E7-6784-4F4B-B374-651A88B27450');

		var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_FINGERPRINT_PINCODE_CHECK_STATUS"), "", "", gUserInfo.lang, gUserInfo.sessionID , arrayArgs);

		data = getDataFromGprsCmd(gprsCmd);
		showLoadingMask(this);
		requestMBService(data, false , 0, requestMBServiceSuccess, requestMBServiceFail);
		// requestBacgroundMBService('CMD_FINGERPRINT_PINCODE_CHECK_STATUS',arrayArgs, requestMBServiceSuccess, requestMBServiceFail);
	}
	catch(err) {

		/*
		 deviceID = '';
		 document.getElementById('td-touchid-login').style.display = 'none';
		 */
		/*
		 arrayArgs.push('123456');

		 var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_FINGERPRINT_PINCODE_CHECK_STATUS"), "", "", gUserInfo.lang, "", arrayArgs);

		 data = getDataFromGprsCmd(gprsCmd);

		 requestMBService(data, true, 0, requestMBServiceSuccess, requestMBServiceFail);
		 */
	}
}



//ngocdt3 bo sung
function showChoiceConfirmPre(e) {
	if (currentPage == "login-scr") {
		showChoiceConfirmPreClose();
		openLinkInWindows('https://ebank.tpb.vn/biz');
	}
}

function showChoiceConfirmPreClose() {
	if (currentPage == "login-scr") {
		document.removeEventListener("alertAppConfirmCancel", showChoiceConfirmPreClose, false);
		document.removeEventListener("alertAppConfirmOK", showChoiceConfirmPre, false);
	}
}
//ngocdt3 end

//event listener: http request success
function requestMBServiceFail() {


};

function parserLoginInfo() {

	var indx = 0;
	var numAccount = 0;
	var tmpIndx = 0;
	var tmpStr = "";
	var tmpArr = [];


	gUserInfo.sessionID = info_common.session;
	gUserInfo.accountInfo = info_common.datahomepage.myHashMap;
	gUserInfo.accountName = info_common.datahomepage.myHashMap.customerName;

	//set user name
	document.getElementById('menu-profile-name').innerHTML = gUserInfo.accountName;

	gUserInfo.valicationType = info_common.authtype;

	// gUserInfo.mobileNumber = gprsResp.arguments[indx++];
	// gUserInfo.email = gprsResp.arguments[indx++];
	// gUserInfo.userRole = gprsResp.arguments[indx++];
	// numAccount = parseInt(gprsResp.arguments[indx++]);
	// gUserInfo.flag_check = gprsResp.arguments[indx++];
	// gUserInfo.username = gprsResp.arguments[indx++];
	// //gCustomerNo =gprsResp.arguments[indx++];
	// var currentCustomerNo = gprsResp.arguments[indx++];

	gUserInfo.mobileNumber = info_common.phone;
	gUserInfo.email = info_common.email;
	gUserInfo.userRole = info_common.userrole;
	// gUserInfo.flag_check = gprsResp.arguments[indx++];
	numAccount = parseInt(info_menu.length);
	var currentCustomerNo = gCustomerNo;
    //
    //
	// // DUYLK GET IDENTIFIER  + DAMNV set cmnd cho client
	// var identifier = gprsResp.arguments[indx++];
    //
	// gUserInfo.identifier = identifier;
	// gAutoSaving = gprsResp.arguments[indx++];
	// //TUANNM5 update fỏ fingerprint, ca nhan hoa user
	// try {
	// 	var tokenKey = localStorage.getItem('TouchIDTokenKey');
    //
	// 	if (tokenKey.length > 0 && tokenKey != '-1') {
	// 		if (gCustomerNo != currentCustomerNo) {
	// 			gTokenKey = '-1';
	// 			gUsingFingerprint = '0';
	// 			gPincode = '-1';
	// 		}
	// 	}
	// } catch (err) {
	// 	gTokenKey = '-1';
	// 	gUsingFingerprint = '0';
	// 	gPincode = '-1';
	// }
    //
	// gCustomerNo = currentCustomerNo;
	setUserInfoToLocal(currentCustomerNo, gUserInfo.accountName);


		for (var i = 0; i < info_menu.length; i++) {
			var tmpMenuObj = new MenuObj();
			tmpMenuObj.keyLang = info_menu[i].DATAKEY;
			tmpMenuObj.menuID = info_menu[i].MENUID;
			tmpMenuObj.parentMenuID = info_menu[i].PARENTID;
			tmpMenuObj.iconCode = info_menu[i].CSSCLASS;
			tmpMenuObj.path = info_menu[i];
			tmpMenuObj.onClick = info_menu[i].ONCLICK;
			tmpMenuObj.imgHighlight = "";
			tmpMenuObj.requireStatus = "Y";
			tmpMenuObj.priority = info_menu[i].ISVISIBLE;
			tmpMenuObj.ismainmenu = info_menu[i].ISMAINMENU;
			tmpMenuObj.isbottombar = info_menu[i].ISBOTTOMBAR;
			tmpMenuObj.color =  info_menu[i].COLOR;
			gMenuList.push(tmpMenuObj);

			// try {
			// 	var deviceID = device.uuid;
			// 	gMenuList.push(tmpMenuObj);
			// } catch (err) {
			// 	if (tmpMenuArr[1] != 'liFingerprintPIN') {
			// 		gMenuList.push(tmpMenuObj);
			// 	}
			// }


		}
		logInfo('Menu list length: ' + gMenuList.length);
		var tmpMenuOrder = new Array();
		var tmpSubMenuOrder = new Array();
		var menuType = '';

		//reorder menu
		if (tmpMenuOrder && tmpMenuOrder.length > 1) {
			gMenuUserOrder = tmpMenuOrder;
			for (var i = 0; i < gMenuList.length; i++) {
				var tmpMenuObj = gMenuList[i];
				if (tmpMenuObj.requireStatus == 'Y' && tmpMenuObj.menuID.length > 0 && tmpMenuObj.parentMenuID.length == 0) {
					var tmpStatus = false;
					for (var j = 0; j < tmpMenuOrder.length; j++) {
						if (tmpMenuObj.menuID == tmpMenuOrder[j]) {
							tmpStatus = true;
							break;
						}
					}
					if (!tmpStatus) {
						gMenuUserOrder.push(tmpMenuObj.menuID);
					}
				}
			}
		}
		else {
			for (var i = 0; i < gMenuList.length; i++) {
				var tmpMenuObj = gMenuList[i];
				if (tmpMenuObj.menuID.length > 0 && tmpMenuObj.parentMenuID == "0") {
					gMenuUserOrder.push(tmpMenuObj.menuID);
				}
			}
		}

		//reorder submenu
		if (tmpSubMenuOrder && tmpSubMenuOrder.length > 1) {
			gSubMenuUserOrder = tmpSubMenuOrder;
			for (var i = 0; i < gMenuList.length; i++) {
				var tmpMenuObj = gMenuList[i];
				if (tmpMenuObj.parentMenuID.length > 0) {
					//if(tmpMenuObj.menuID.length == 0 && tmpMenuObj.parentMenuID.length > 0) {
					var tmpStatus = false;
					for (var j = 0; j < tmpSubMenuOrder.length; j++) {
						var subMenuIDKeyLang = tmpMenuObj.parentMenuID + '_' + tmpMenuObj.keyLang;
						if (subMenuIDKeyLang == tmpSubMenuOrder[j]) {
							tmpStatus = true;
							break;
						}
					}
					if (tmpStatus) {
						gSubMenuUserOrder.push(subMenuIDKeyLang);
						gMenuList[i].hiddenStatus = 'N';
					} else {
						gMenuList[i].hiddenStatus = 'Y';
					}
				}

			}
		}
		else {
			for (var i = 0; i < gMenuList.length; i++) {
				var tmpMenuObj = gMenuList[i];
				//if(tmpMenuObj.menuID.length == 0 && tmpMenuObj.parentMenuID.length > 0) {
				if (tmpMenuObj.parentMenuID != "0") {
					gSubMenuUserOrder.push(tmpMenuObj.parentMenuID + '_' + tmpMenuObj.keyLang);
					gMenuList[i].hiddenStatus = 'N';
				} else {
					//gMenuList[i].hiddenStatus = 'Y';
				}
			}
		}

		genMenuSection();

		if (menuType == 'simple') {
			quickChangeMenuStyleSimple(false);
		} else if (menuType == 'default') {
			quickChangeMenuStyleDefault(false);
		} else if (menuType == 'custom') {
			document.getElementById('quick_default_menu_btn').style.display = 'none';
			document.getElementById('quick_simple_menu_btn').style.display = 'none';
			document.getElementById('quick_custom_menu_btn').style.display = '';
		}
		//request menu
		/*var arrayArgs = new Array();
		 requestBacgroundMBService("CMD_GET_CUSTOMIZE_MENU", arrayArgs, function(e) {
		 //success

		 }, function(e){
		 //fail

		 });*/

		return true;

	// 	var indxPayment = numAccount + 6;
	// 	var numGroupPaymentService = parseInt(gprsResp.arguments[indxPayment + 1]);
	// 	for (var i = 0; i < numGroupPaymentService; i++) {
	// 		tmpStr = gprsResp.arguments[indxPayment + 2 + i];
    //
	// 		if (tmpStr != undefined) {
	// 			tmpArr = tmpStr.split("#");
    //
	// 			if (tmpArr.length == 7) {
	// 				var paymentGrp = {
	// 					groupId: tmpArr[0],
	// 					srvGroup: tmpArr[1],
	// 					name: tmpArr[2],
	// 					description: tmpArr[3],
	// 					nameEn: tmpArr[4],
	// 					descriptionEn: tmpArr[5],
	// 					icon: tmpArr[6]
	// 				};
	// 				gUserInfo.paymentGroupList.push(paymentGrp);
	// 			}
	// 		}
	// 	}
    //
	// 	var numPaymentService = parseInt(gprsResp.arguments[indxPayment + numGroupPaymentService + 2]);
	// 	for (var i = 0; i < numPaymentService; i++) {
	// 		tmpStr = gprsResp.arguments[numGroupPaymentService + indxPayment + 3 + i];
    //
	// 		if (tmpStr != undefined) {
	// 			tmpArr = tmpStr.split("#");
    //
	// 			if (tmpArr.length == 7) {
	// 				var paymentService = {
	// 					srvId: tmpArr[0],
	// 					srvGroup: tmpArr[1],
	// 					srvName: tmpArr[2],
	// 					srvDesc: tmpArr[3],
	// 					srvNameEn: tmpArr[4],
	// 					srvDescEn: tmpArr[5],
	// 					icon: tmpArr[6]
	// 				};
	// 				gUserInfo.paymentServiceList.push(paymentService);
	// 			}
	// 		}
	// 	}
    //
	// 	var numProvider = parseInt(gprsResp.arguments[numPaymentService + numGroupPaymentService + indxPayment + 3]);
	// 	for (var i = 0; i < numProvider; i++) {
	// 		tmpStr = gprsResp.arguments[numGroupPaymentService + numPaymentService + indxPayment + 4 + i];
    //
	// 		if (tmpStr != undefined) {
	// 			tmpArr = tmpStr.split("#");
    //
	// 			if (tmpArr.length == 6) {
	// 				var paymentProvider = {
	// 					srvId: tmpArr[0],
	// 					srvGroup: tmpArr[1],
	// 					prName: tmpArr[2],
	// 					srvCode: tmpArr[3],
	// 					prDesc: tmpArr[4],
	// 					prId: tmpArr[5]
	// 				};
	// 				gUserInfo.paymentProviderList.push(paymentProvider);
	// 			}
	// 		}
	// 	}
    //
	// 	var numFieldForm = parseInt(gprsResp.arguments[numProvider + numPaymentService + numGroupPaymentService + indxPayment + 4]);
	// 	for (var i = 0; i < numFieldForm; i++) {
	// 		tmpStr = gprsResp.arguments[numProvider + numPaymentService + numGroupPaymentService + indxPayment + 5 + i];
    //
	// 		if (tmpStr != undefined) {
	// 			tmpArr = tmpStr.split("#");
    //
	// 			if (tmpArr.length == 14) {
	// 				var paymentReqField = {
	// 					srvCode: tmpArr[0],
	// 					msgType: tmpArr[1],
	// 					msgFieldId: tmpArr[2],
	// 					fieldDesc: tmpArr[3],
	// 					fieldType: tmpArr[4],
	// 					fieldLength: tmpArr[5],
	// 					inputType: tmpArr[6],
	// 					madatory: tmpArr[7],
	// 					sortIndex: tmpArr[8],
	// 					id: tmpArr[9],
	// 					isAmount: tmpArr[10],
	// 					fieldDescEn: tmpArr[11],
	// 					dfltVal: tmpArr[12],
	// 					id1: tmpArr[13]
	// 				};
	// 				gUserInfo.paymentRequestFieldList.push(paymentReqField);
	// 			}
	// 		}
	// 	}
    //
	// 	var numFieldFormCbo = parseInt(gprsResp.arguments[numFieldForm + numProvider + numPaymentService + numGroupPaymentService + indxPayment + 5]);
	// 	for (var i = 0; i < numFieldFormCbo; i++) {
	// 		gUserInfo.paymentRequestFieldCboList.push(gprsResp.arguments[numFieldForm + numProvider + numPaymentService + numGroupPaymentService + indxPayment + 6 + i]);
	// 		tmpStr = gprsResp.arguments[numFieldForm + numProvider + numPaymentService + numGroupPaymentService + indxPayment + 6 + i];
    //
	// 		if (tmpStr != undefined) {
	// 			tmpArr = tmpStr.split("#");
    //
	// 			if (tmpArr.length == 4) {
	// 				var paymentReqFieldCbo = {
	// 					id: tmpArr[0],
	// 					mapId: tmpArr[1],
	// 					fieldVal: tmpArr[2],
	// 					fieldDesc: tmpArr[3]
	// 				};
	// 				gUserInfo.paymentRequestFieldCboList.push(paymentReqFieldCbo);
	// 			}
	// 		}
	// 	}
    //
	// 	var numFieldFormHistory = parseInt(gprsResp.arguments[numFieldFormCbo + numFieldForm + numProvider + numPaymentService + numGroupPaymentService + indxPayment + 6]);
	// 	for (var i = 0; i < numFieldFormHistory; i++) {
	// 		gUserInfo.paymentFieldHistoryList.push(gprsResp.arguments[numFieldFormCbo + numFieldForm + numProvider + numPaymentService + numGroupPaymentService + indxPayment + 6 + i]);
	// 	}
    //
	// 	return true;
	// }
}


function parserLoginInfoCorp() {

	var indx = 0;
	var numAccount = 0;
	var tmpIndx = 0;
	var tmpStr = "";
	var tmpArr = [];

	gUserInfo.sessionID = gprsResp.arguments[indx++];
	gUserInfo.accountInfo = eval("(" + gprsResp.arguments[indx++] + ")");
	gUserInfo.accountName = gUserInfo.accountInfo.customerName;

	//set user name
	document.getElementById('menu-profile-name').innerHTML = gUserInfo.accountName;

	gUserInfo.valicationType = gprsResp.arguments[indx++];
	if (gprsResp.arguments[indx++] == "GOLD_TERM_COMFIRMED") {
		gUserInfo.goldTermConfirmed = true;
	} else {
		gUserInfo.goldTermConfirmed = false;
	}
	gUserInfo.mobileNumber = gprsResp.arguments[indx++];
	gUserInfo.email = gprsResp.arguments[indx++];
	gUserInfo.userRole = gprsResp.arguments[indx++];
	numAccount = parseInt(gprsResp.arguments[indx++]);
	var tmpArrayNotJumbo = new Array();
	var tmpArrayJumbo = new Array();
	var tmpJumboStatus = false;
	for (var i = indx; i < numAccount + indx; i++) {
		var tmpAccObj = new AccountObj();
		var rawAccInfo = gprsResp.arguments[i];
		if (!rawAccInfo || rawAccInfo.length < 2) {
			continue;
		}
		var arrayAccInfo = rawAccInfo.split("#");
		tmpAccObj.accountNumber = arrayAccInfo[0];
		tmpAccObj.description = arrayAccInfo[1];
		tmpAccObj.balance = arrayAccInfo[2];
		tmpAccObj.balanceAvailable = arrayAccInfo[3];
		tmpAccObj.currency = arrayAccInfo[4];
		tmpAccObj.descByUser = arrayAccInfo[5];
		tmpAccObj.overdraftLimit = arrayAccInfo[6];
		tmpAccObj.accClass = arrayAccInfo[7];
		tmpAccObj.udfFieldVal = arrayAccInfo[8];

		//ngocdt3 bo sung check nodebit
		tmpAccObj.nodebit = arrayAccInfo[10];
		tmpAccObj.noReceive = arrayAccInfo[11];

		if (tmpAccObj.udfFieldVal == "6") {
			tmpArrayJumbo.push(tmpAccObj);
			tmpJumboStatus = true;
		} else {
			//ngocdt3 comment cho hien thi tai khoan
			//<!--if (((parseInt(tmpAccObj.overdraftLimit) > 0) && arrayAccInfo[9] == 1) || (tmpAccObj.accClass == 'T6A001' || tmpAccObj.accClass == 'D7A000') || (tmpAccObj.currency != 'VND')) {-->
			if (((parseInt(tmpAccObj.overdraftLimit) > 0) && arrayAccInfo[9] == 1) || (tmpAccObj.accClass ==
				'D7A000') || (tmpAccObj.currency != 'VND')) {
				tmpArrayNotJumbo.push(tmpAccObj);
			} else {
				tmpArrayJumbo.push(tmpAccObj);
			}
		}
		//gUserInfo.accountList.push(tmpAccObj);
		//ngocdt3 comment cho hien thi tai khoan tiet kiem tu dong
		//<!--if(tmpAccObj.currency == 'VND' && tmpAccObj.accClass != 'T6A001' && tmpAccObj.accClass != 'D7A000')--> {
		if (tmpAccObj.currency == 'VND' && tmpAccObj.accClass != 'D7A000') {
			gUserInfo.accountList.push(tmpAccObj);
			gUserInfo.accountListLocalTrans.push(tmpAccObj);
		} else {
			gUserInfo.accountListOther.push(tmpAccObj);
			//bo sung tai khoan D7A000 vao tai khoan nhan tien
			if (tmpAccObj.accClass == 'D7A000') {
				gUserInfo.accountListLocalTrans.push(tmpAccObj);
			}
		}
	}
	if (tmpJumboStatus) {
		gUserInfo.accountList = tmpArrayJumbo;
		gUserInfo.accountListOther = tmpArrayNotJumbo;
	}
	indx = numAccount + indx;
	//avatar
	gUserInfo.userAvatar = gprsResp.arguments[indx];
	if (gUserInfo.userAvatar && gUserInfo.userAvatar.length > 1 && document.getElementById(
			'menu-profile-avatar')) {
		document.getElementById('menu-profile-avatar').innerHTML =
			'<img width="25" height="25" style="margin-top:1px; margin-left:4px" src="' + gUserInfo
				.userAvatar + '" />';
		document.getElementById('menu-profile-avatar').style.backgroundColor = "transparent";
	}
	//avatar end
	indx++;
	if (gprsResp.arguments[indx] && gprsResp.arguments[indx] == 'MENU') {
		indx++;
		for (var i = indx; i < gprsResp.arguments.length; i++) {
			if (gprsResp.arguments.length > 1) {
				if (gprsResp.arguments[indx] == 'MENU_END') {
					indx++;
					break;
				} else {
					var tmpMenuArr = gprsResp.arguments[i].split('#');

					var tmpMenuObj = new MenuObj();
					tmpMenuObj.keyLang = tmpMenuArr[0];
					tmpMenuObj.menuID = tmpMenuArr[1];
					tmpMenuObj.parentMenuID = tmpMenuArr[2];
					tmpMenuObj.iconCode = tmpMenuArr[3];
					tmpMenuObj.path = tmpMenuArr[4];
					if (tmpMenuArr[1] == "ID12" && CONST_BROWSER_MODE == false) {
						tmpMenuObj.onClick = "highlightSelectedMenu(this);navController.initWithRootView('corp/transfer/batch/mng/batch-transfer-mng-scr', true, 'xsl');"
					} else {
						tmpMenuObj.onClick = "highlightSelectedMenu(this);" + tmpMenuArr[5];
					}
					tmpMenuObj.imgHighlight = tmpMenuArr[6];
					tmpMenuObj.requireStatus = tmpMenuArr[7];
					gMenuList.push(tmpMenuObj);

					indx++;
				}
			}
		}
	}
	logInfo('Menu list length: ' + gMenuList.length);
	var tmpMenuOrder = new Array();
	if (gprsResp.arguments[indx]) {
		for (var i = indx; i < gprsResp.arguments.length; i++) {
			if (gprsResp.arguments[i] == 'MENU_USER_END') {
				indx++;
				break;
			} else {
				tmpMenuOrder = gprsResp.arguments[i].split('#');
				indx++;
			}
		}
	}
	//reorder menu
	if (tmpMenuOrder && tmpMenuOrder.length > 1) {
		gMenuUserOrder = tmpMenuOrder;
		for (var i = 0; i < gMenuList.length; i++) {
			var tmpMenuObj = gMenuList[i];
			if (tmpMenuObj.requireStatus == 'Y' && tmpMenuObj.menuID.length > 0 && tmpMenuObj.parentMenuID
					.length == 0) {
				var tmpStatus = false;
				for (var j = 0; j < tmpMenuOrder.length; j++) {
					if (tmpMenuObj.menuID == tmpMenuOrder[j]) {
						tmpStatus = true;
						break;
					}
				}
				if (!tmpStatus) {
					gMenuUserOrder.push(tmpMenuObj.menuID);
				}
			}
		}
	} else {
		for (var i = 0; i < gMenuList.length; i++) {
			var tmpMenuObj = gMenuList[i];
			if (tmpMenuObj.menuID.length > 0 && tmpMenuObj.parentMenuID.length == 0) {
				gMenuUserOrder.push(tmpMenuObj.menuID);
			}
		}
	}

	genMenuSection();
	//request menu
	/*var arrayArgs = new Array();
	 requestBacgroundMBService("CMD_GET_CUSTOMIZE_MENU", arrayArgs, function(e) {
	 //success

	 }, function(e){
	 //fail

	 });*/

	return true;

	var indxPayment = numAccount + 6;
	var numGroupPaymentService = parseInt(gprsResp.arguments[indxPayment + 1]);
	for (var i = 0; i < numGroupPaymentService; i++) {
		tmpStr = gprsResp.arguments[indxPayment + 2 + i];

		if (tmpStr != undefined) {
			tmpArr = tmpStr.split("#");

			if (tmpArr.length == 7) {
				var paymentGrp = {
					groupId: tmpArr[0],
					srvGroup: tmpArr[1],
					name: tmpArr[2],
					description: tmpArr[3],
					nameEn: tmpArr[4],
					descriptionEn: tmpArr[5],
					icon: tmpArr[6]
				};
				gUserInfo.paymentGroupList.push(paymentGrp);
			}
		}
	}

	var numPaymentService = parseInt(gprsResp.arguments[indxPayment + numGroupPaymentService + 2]);
	for (var i = 0; i < numPaymentService; i++) {
		tmpStr = gprsResp.arguments[numGroupPaymentService + indxPayment + 3 + i];

		if (tmpStr != undefined) {
			tmpArr = tmpStr.split("#");

			if (tmpArr.length == 7) {
				var paymentService = {
					srvId: tmpArr[0],
					srvGroup: tmpArr[1],
					srvName: tmpArr[2],
					srvDesc: tmpArr[3],
					srvNameEn: tmpArr[4],
					srvDescEn: tmpArr[5],
					icon: tmpArr[6]
				};
				gUserInfo.paymentServiceList.push(paymentService);
			}
		}
	}

	var numProvider = parseInt(gprsResp.arguments[numPaymentService + numGroupPaymentService +
	indxPayment + 3]);
	for (var i = 0; i < numProvider; i++) {
		tmpStr = gprsResp.arguments[numGroupPaymentService + numPaymentService + indxPayment + 4 +
		i];

		if (tmpStr != undefined) {
			tmpArr = tmpStr.split("#");

			if (tmpArr.length == 6) {
				var paymentProvider = {
					srvId: tmpArr[0],
					srvGroup: tmpArr[1],
					prName: tmpArr[2],
					srvCode: tmpArr[3],
					prDesc: tmpArr[4],
					prId: tmpArr[5]
				};
				gUserInfo.paymentProviderList.push(paymentProvider);
			}
		}
	}

	var numFieldForm = parseInt(gprsResp.arguments[numProvider + numPaymentService +
	numGroupPaymentService + indxPayment + 4]);
	for (var i = 0; i < numFieldForm; i++) {
		tmpStr = gprsResp.arguments[numProvider + numPaymentService + numGroupPaymentService +
		indxPayment + 5 + i];

		if (tmpStr != undefined) {
			tmpArr = tmpStr.split("#");

			if (tmpArr.length == 14) {
				var paymentReqField = {
					srvCode: tmpArr[0],
					msgType: tmpArr[1],
					msgFieldId: tmpArr[2],
					fieldDesc: tmpArr[3],
					fieldType: tmpArr[4],
					fieldLength: tmpArr[5],
					inputType: tmpArr[6],
					madatory: tmpArr[7],
					sortIndex: tmpArr[8],
					id: tmpArr[9],
					isAmount: tmpArr[10],
					fieldDescEn: tmpArr[11],
					dfltVal: tmpArr[12],
					id1: tmpArr[13]
				};
				gUserInfo.paymentRequestFieldList.push(paymentReqField);
			}
		}
	}

	var numFieldFormCbo = parseInt(gprsResp.arguments[numFieldForm + numProvider +
	numPaymentService + numGroupPaymentService + indxPayment + 5]);
	for (var i = 0; i < numFieldFormCbo; i++) {
		gUserInfo.paymentRequestFieldCboList.push(gprsResp.arguments[numFieldForm + numProvider +
		numPaymentService + numGroupPaymentService + indxPayment + 6 + i]);
		tmpStr = gprsResp.arguments[numFieldForm + numProvider + numPaymentService +
		numGroupPaymentService + indxPayment + 6 + i];

		if (tmpStr != undefined) {
			tmpArr = tmpStr.split("#");

			if (tmpArr.length == 4) {
				var paymentReqFieldCbo = {
					id: tmpArr[0],
					mapId: tmpArr[1],
					fieldVal: tmpArr[2],
					fieldDesc: tmpArr[3]
				};
				gUserInfo.paymentRequestFieldCboList.push(paymentReqFieldCbo);
			}
		}
	}

	var numFieldFormHistory = parseInt(gprsResp.arguments[numFieldFormCbo + numFieldForm +
	numProvider + numPaymentService + numGroupPaymentService + indxPayment + 6]);
	for (var i = 0; i < numFieldFormHistory; i++) {
		gUserInfo.paymentFieldHistoryList.push(gprsResp.arguments[numFieldFormCbo + numFieldForm +
		numProvider + numPaymentService + numGroupPaymentService + indxPayment + 6 + i]);
	}

	return true;
}