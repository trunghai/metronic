/**
 * Created by HaiNM *
 **/
 
gCorp.isBack = false;


function viewDidLoadSuccess() {
    initData();

}

function viewBackFromOther() {
    gCorp.isBack = true;
}

function initData() {
    angular.module("EbankApp").controller('auth-cre-request-detail', function ($scope, requestMBServiceCorp) {
        navCachedPages["authorize/credit/cre_request_create/auth-cre-request"] = null;
        if(gCorp.isBack == true){
            document.getElementById("id.reason-rej").value = gTrans.common.reason;
        }
        $scope.detailCommon = gTrans.common;
        $scope.detailCheckList = gTrans.checklistProfile;
        $scope.detailCommon.sendMethod ='';
        if (typeof gTrans.common.SENDMETHOD != "undefined" && gTrans.common.SENDMETHOD != null) {
            $scope.detailCommon.sendMethod = CONST_STR.get("COM_NOTIFY_" + gTrans.common.SENDMETHOD);
        }
        $scope.onBackClick = function () {
            navCachedPages[gTrans.srcViewListPending] = null;
            for(var i=0; i<navArrayScr.length;i++){
                if(navArrayScr[i] == gTrans.srcViewListPending){
                    if(gModeScreenView == CONST_MODE_SCR_SMALL){
                        document.getElementById('nav.btn.home').style.display = 'block';
                    }
                    navCachedPages[navArrayScr[i]] = null;
                    navController.popToView(navArrayScr[i], true, 'html');
                    navArrayScr = navArrayScr.slice(0,i+1);
                    return;
                }
            }
        }
        
        $scope.onRejectClick = function () {
            var reason = document.getElementById("id.reason-rej").value;
            if (!reason) {
                showAlertText(CONST_STR.get("COM_CHECK_EMPTY_REJECT_REASON"));
                return;
            }

            gTrans.common.reason = reason;
            gTrans.common.authen = false;
            navCachedPages["authorize/credit/cre_request_create/auth-cre-request-detail-authen"] = null;
            navController.pushToView("authorize/credit/cre_request_create/auth-cre-request-detail-authen", true);
        }
        
        $scope.onContinuteClick = function () {
            gTrans.common.authen = true;
            navCachedPages["authorize/credit/cre_request_create/auth-cre-request-detail-authen"] = null;
            navController.pushToView("authorize/credit/cre_request_create/auth-cre-request-detail-authen", true);
        }
		
        $scope.onViewPDF = function (e) {
            var jsonData = new Object();
            jsonData.sequence_id = "6";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.idFile = e;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_AUTHORIZE_CRE_REQUEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
				if (response.respCode == '0'){
					if (Environment.isMobile()){
						openLinkInWindows(response.respJsonObj.url);
					}else {
						var widthScreen = (window.innerWidth-800)/2;
						var heightScreen = (window.innerHeight-800)/2;

						var string = "width=800,height=800,top=" + heightScreen + ",left=" + widthScreen;
						window.open(response.respJsonObj.url, "", string);
					}
                }else {
                    showAlertText(response.respContent);
                }	
            });
        }

    });
    angular.bootstrap(document.getElementById('mainViewContent'), ["EbankApp"]);
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