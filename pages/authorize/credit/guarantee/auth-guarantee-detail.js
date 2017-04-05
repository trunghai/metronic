/**
 * Created by HaiDT1 on 8/2/2016.
 */
gCorp.isBack = false;


function viewDidLoadSuccess() {
    initData();
    setInputOnlyASCIILNH('id.reason-rej', CONST_STR.get("ERR_INPUT_ONLY_ASCII_CHAR"));
}

function viewBackFromOther() {
    gCorp.isBack = true;
    document.getElementById("id.reason-rej").value=  gTrans.common.reason;
}

function initData() {
    angular.module("EbankApp").controller('auth-guarantee-detail', function ($scope, requestMBServiceCorp) {
        $scope.detailCommon = gTrans.common;
        $scope.detailCheckList = gTrans.checklistProfile;
        $scope.detailCommon.sendMethod ='';
        if (typeof gTrans.common.SENDMETHOD != "undefined" && gTrans.common.SENDMETHOD != null) {
            $scope.detailCommon.sendMethod = CONST_STR.get("COM_NOTIFY_" + gTrans.common.SENDMETHOD);
        }

        $scope.onBackClick = function () {
            navCachedPages["authorize/credit/guarantee/auth-guarantee"] = null;
            navController.popToView('authorize/credit/guarantee/auth-guarantee', true, 'html');
        }
        
        $scope.onRejectClick = function () {
            var reason = document.getElementById("id.reason-rej").value;
            if (!reason) {
                showAlertText(CONST_STR.get("COM_CHECK_EMPTY_REJECT_REASON"));
                return;
            }
            
            gTrans.common.reason = reason;
            gTrans.common.authen = false;
            navCachedPages["authorize/credit/guarantee/auth-guarantee-detail-authen"] = null;
            navController.pushToView("authorize/credit/guarantee/auth-guarantee-detail-authen", true);
        }
        
        $scope.onContinuteClick = function () {
            var reasontpb = document.getElementById('id.reason-rej').value;
            if(reasontpb){
                showAlertText(CONST_STR.get("COM_CHECK_REJECT_BUTTON"));
                return false;
            }
            gTrans.common.authen = true;
            navCachedPages["authorize/credit/guarantee/auth-guarantee-detail-authen"] = null;
            navController.pushToView("authorize/credit/guarantee/auth-guarantee-detail-authen", true);
        }

        $scope.onViewPDF = function (e) {
            var jsonData = new Object();
            jsonData.sequence_id = "6";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.idFile = e;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_AUTHORIZE_GUARANTEE"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data,true, function (response) {
//                var html = '<embed width="100%" height="450"'
//                    + ' type="application/pdf"'
//                    + ' src="'
//                    + response.respJsonObj.url
//                    + '"></embed>';
//
//                document.getElementById('contentView').innerHTML = html;
//                var modal = document.getElementById('myModal');
//                modal.style.display = "block";
//                window.onclick = function(event) {
//                    if (event.target == modal) {
//                        modal.style.display = "none";
//                    }
//                }
                if(response.respCode == 0){
                    if (Environment.isMobile()){
                        openLinkInWindows(response.respJsonObj.url);
                    }else {
                        var widthScreen = (window.innerWidth-800)/2;
                        var heightScreen = (window.innerHeight-800)/2;

                        var string = "width=800,height=800,top=" + heightScreen + ",left=" + widthScreen;
                        window.open(response.respJsonObj.url, "", string);
                    }
                }else{
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