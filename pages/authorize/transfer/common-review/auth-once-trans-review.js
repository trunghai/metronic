/**
 * Created by HaiDT1 on 12/19/2016.
 */
gTrans.isBack = true;
function viewBackFromOther(){
    gTrans.isBack = false;
}
function viewDidLoadSuccess() {
    init();
    bottomBar.hide();
    if(!gTrans.isBack){
        document.getElementById('trans.reason').value = gTrans.reason;
    }
}

function init() {
    angular.module("EbankApp").controller("auth-once-trans-review", function ($scope, requestMBServiceCorp) {
        if (gTrans.idtxn == 'T61'){
            gTrans.transInfo.sendNotify = CONST_STR.get('COM_NOTIFY_' + gTrans.transInfo.SENDMETHOD);
            gTrans.transInfo.LOAI_GIAO_DICH = CONST_STR.get('TRANS_INTERNAL_TYPE_' + gTrans.transInfo.LOAI_GD);
            gTrans.transInfo.thuhuong = getTransTempInfo(gTrans.transInfo.TYPE_TEMPLATE);
            if (gTrans.transInfo.TYPE_TEMPLATE == null){
                gTrans.transInfo.LUU_MAU = CONST_STR.get('TRANS_INTERNAL_SAVE_TEMPLATE_N');
            }
            gTrans.transInfo.SO_DU_SAU_CHUYEN = parseInt(gTrans.transInfo.SO_DU_KHA_DUNG) - parseInt(gTrans.transInfo.SO_TIEN);
            gTrans.transInfo.sdkd = formatNumberToCurrency(gTrans.transInfo.SO_DU_KHA_DUNG);
        }else if (gTrans.idtxn == 'B62'){
            gTrans.transInfo.TRANGTHAI = CONST_STR.get('COM_TRANS_STATUS_' + gTrans.transInfo.TRANG_THAI);
        } else if(gTrans.idtxn == 'D60'){
            gTrans.transInfo.SO_DU_SAU_CHUYEN = parseInt(gTrans.transInfo.SO_DU_TK_CHUYEN) - parseInt(gTrans.transInfo.SO_TIEN);
        }else if(gTrans.idtxn == 'B66') {
            $scope.listProfile = gTrans.transInfo.profile;
            var titleBar = '';
            if (gTrans.transInfo.TYPE_LC == 'P'){
                gTrans.transInfo.typelc = (gUserInfo.lang == 'VN') ? 'Đề nghị phát hành LC' : '';
                titleBar = CONST_STR.get('AUTHORIZE_TRANS_TITLE_BAR_LC_RQ');
            }else {
                gTrans.transInfo.typelc = (gUserInfo.lang == 'VN') ? 'Tu chỉnh LC' : '';
                titleBar = CONST_STR.get('AUTHORIZE_TRANS_TITLE_BAR_LC_ED');
            }
            setTitleBar(titleBar);

        }else if(gTrans.idtxn == 'T71'){
            if(gTrans.transInfo.LOAI_GD == 'T21'){
                gTrans.transInfo.LOAI_GD = CONST_STR.get("AUTHORIZE_TRANS_TIT_T21");
            }
        }
		$scope.status=function(e) {
            return e = CONST_STR.get('COM_TRANS_STATUS_'+e+'');
		}
        $scope.statusVN = {
            "ABH": "Đã duyệt",
            "INT": "Chờ duyệt",
            "REJ": "Từ chối",
            "APT": "Duyệt một phần",
            "RBH": "Duyệt không thành công",
            "CAC": "Hủy giao dịch",
            "STH": "Đang xử lý",
            "HBH": "Hồ sơ đã được tiếp nhận",
            "REH": "Hoàn chứng từ",
            "IBS": "Chờ duyệt bổ sung chứng từ",
            "APS": "Duyệt một phần BS chứng từ",
            "RES": "Từ chối BS chứng từ",
            "RBS": "Duyệt BS CTừ  không thành công",
            "SBS": "Đang xử lý BS chứng từ",
            "RJS": "TPBank từ chối BS chứng từ"
        };
        $scope.scr = gTrans.scr;
        $scope.infoTrans = gTrans.transInfo;
        $scope.guarantee = gTrans.guarantee;
        $scope.val = gTrans.valquery;
        setTimeout(function () {
            if(document.getElementById('id.reason')){
                document.getElementById('id.reason').style.display = 'none';
            }
            changeLanguageInView();
        }, 100);

        $scope.onViewPDF = function (e) {
            var jsonData = new Object();
            jsonData.sequence_id = "6";
            jsonData.idtxn = "C60";
            jsonData.idFile = e;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_GUARANTEE_AUTH_SUGGEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {

                if (Environment.isMobile()){
                    openLinkInWindows(response.respJsonObj.url);
                }else {
                    var widthScreen = (window.innerWidth-800)/2;
                    var heightScreen = (window.innerHeight-800)/2;

                    var string = "width=800,height=800,top=" + heightScreen + ",left=" + widthScreen;
                    window.open(response.respJsonObj.url, "", string);
                }

            });
        }
        $scope.goToAuthorScreen = function () {
            var reason = document.getElementById("trans.reason").value;
            if (reason){
                showAlertText(CONST_STR.get("COM_CHECK_REJECT_BUTTON"));
                return;
            }
            gTrans.authen = true;
            gTrans.sequenceId = 4;
            gTrans.reason = '';
            if(gTrans.idtxn == 'B61'){
                if (parseInt(gTrans.transInfo.listPending[0].SO_TIEN) > parseInt(gCorp.limit.limitTime)) {
                    showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_LIMIT_EXCEEDED_TIME"), [formatNumberToCurrency(limit.limitTime)]));
                    return;
                }

                if ((parseInt(gTrans.transInfo.listPending[0].SO_TIEN) + parseInt(gCorp.limit.totalDay)) > parseInt(gCorp.limit.limitDay)) {
                    showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_LIMIT_EXCEEDED_DAY"), [formatNumberToCurrency(limit.limitDay)]));
                    return;
                }
                
                gTrans.requset = gTrans.listRequset[0];
            }else if(gTrans.idtxn == 'T66'){
                gTrans.transId = gTrans.listRequset[0].transId;
                gTrans.requset = gTrans.listRequset[0];
                if ((parseInt(gTrans.limit.totalDay) + parseInt(gTrans.transInfo.TONG_SO_TIEN.replace(/\,/g,''))) > parseInt(gTrans.limit.limitDay)) {
                    showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_DAY'), [formatNumberToCurrency(gTrans.limit.limitDay)]));
                    return false;
                }

                if (parseInt(gTrans.transInfo.TONG_SO_TIEN.replace(/\,/g,'')) > parseInt(gTrans.limit.limitTime)) {
                    showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_TIME'), [formatNumberToCurrency(gTrans.limit.limitTime)]));
                    return false;
                }
            }else if(gTrans.idtxn == 'C60'){
                gTrans.sequenceId = 4;
                gTrans.transIds = gTrans.transInfoRequest.transId;
                gTrans.requset = gTrans.listRequset;

            }else if(gTrans.idtxn == 'T61'){
                if (parseInt(gTrans.transInfo.SO_TIEN) > parseInt(gTrans.limit.limitTime)) {
                    showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_TIME'), [formatNumberToCurrency(gTrans.limit.limitTime)]));
                    return false;
                }
                if ((parseInt(gTrans.limit.totalDay) + parseInt(gTrans.transInfo.SO_TIEN)) > parseInt(gTrans.limit.limitDay)) {
                    showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_DAY'), [formatNumberToCurrency(gTrans.limit.limitDay)]));
                    return false;
                }
            } else if(gTrans.idtxn == 'T70'){
                gTrans.sequenceId = 5;
            }else if(gTrans.idtxn == 'A63'){
                if ((parseInt(gTrans.limit.totalDay) + parseInt(gTrans.transInfo.NUMAMOUNT)) > parseInt(gTrans.limit.limitDay)) {
                    showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_DAY'), [formatNumberToCurrency(gTrans.limit.limitDay)]));
                    return false;
                }
                gTrans.sequenceId = 5;

            } else if(gTrans.idtxn == 'T64'){
                if ((parseInt(gTrans.limit.totalDay) + parseInt(gTrans.transInfo.NUMAMOUNT)) > parseInt(gTrans.limit.limitDay)) {
                    showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_DAY'), [formatNumberToCurrency(gTrans.limit.limitDay)]));
                    return false;
                }
                if ( parseInt(gTrans.transInfo.NUMAMOUNT) > parseInt(gTrans.limit.limitTime)) {
                    showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_TIME'), [formatNumberToCurrency(gTrans.limit.limitTime)]));
                    return false;
                }
            } else if(gTrans.idtxn == 'T69'){
                if ((parseInt(gTrans.limit.totalDay) + parseInt(gTrans.transInfo.SO_TIEN)) > parseInt(gTrans.limit.limitDay)) {
                    showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_DAY'), [formatNumberToCurrency(gTrans.limit.limitDay)]));
                    return false;
                }
                if ( parseInt(gTrans.transInfo.SO_TIEN) > parseInt(gTrans.limit.limitTime)) {
                    showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_LIMIT_EXCEEDED_TIME'), [formatNumberToCurrency(gTrans.limit.limitTime)]));
                    return false;
                }
            } else if(gTrans.idtxn == 'D60'){
                // Kiem tra so du kha dung
                for (var i in gTrans.listSourceAccounts){
                    var totalAmount = 0;
                    for (var j in gTrans.listSelectedTrans){
                        if (gTrans.listSelectedTrans[j].TK_CHUYEN == gTrans.listSourceAccounts[i].account){
                            totalAmount = totalAmount + parseInt(gTrans.listSelectedTrans[j].SO_TIEN);
                        }
                    }

                    if(totalAmount > parseInt(removeSpecialChar(gTrans.listSourceAccounts[i].balance))){
                        showAlertText(CONST_STR.get("CORP_MSG_TRANS_BATCH_BALANCE_NOT_ENOUGH"));
                        return false;
                    }
                }
            }
            
            navCachedPages["authorize/transfer/common-auth/auth-once-trans-authorization"] = null;
            navController.pushToView('authorize/transfer/common-auth/auth-once-trans-authorization', true, 'html');
        }

        $scope.goToRejectScreen = function () {
            var reason = document.getElementById("trans.reason").value;
            if (!reason){
                showAlertText(CONST_STR.get("COM_CHECK_EMPTY_REJECT_REASON"));
                return;
            }
            gTrans.reason = reason;
            gTrans.authen = false;
            gTrans.sequenceId = 3;

            if (gTrans.idtxn == 'B62'){
                gTrans.transInfoRequest.sequence_id = 3;
                gTrans.transInfoRequest.rejectReason = gTrans.reason;
            }
            else if(gTrans.idtxn == 'B61'){
                gTrans.sequenceId = 5;
                gTrans.requset = gTrans.listRequset[0];
            }else if(gTrans.idtxn == 'T66'){
                gTrans.sequenceId = 5;
                gTrans.transId = gTrans.listRequset[1].transId;
                gTrans.requset = gTrans.listRequset[1];
            }else if(gTrans.idtxn == 'C60'){
                gTrans.sequenceId = 3;
                gTrans.transIds = gTrans.transInfoRequest.transId;
//                gTrans.requset = gTrans.listRequset[0];
            }  else if(gTrans.idtxn == 'T64'){
                gTrans.sequenceId = 3;
                gTrans.rejectReason = gTrans.reason;
            }else if(gTrans.idtxn == 'B66'){
                gTrans.sequence_id = 3;
                gTrans.rejectReason = gTrans.reason;
            }else if(gTrans.idtxn == 'T61'){
                gTrans.sequenceId = 3;
                gTrans.rejectReason = gTrans.reason;
            }else if(gTrans.idtxn == 'T63'){
                gTrans.transInfoRequest.sequenceId = 4;
                gTrans.transInfoRequest.rejectReason = gTrans.reason;
            } else if(gTrans.idtxn == 'T70'){
                gTrans.sequenceId = 4;
                gTrans.rejectReason = gTrans.reason;
            } else if (gTrans.idtxn == 'A63') {
                gTrans.reason = reason;
                gTrans.sequenceId = 3;            
            }else if(gTrans.idtxn == 'T69'){
                gTrans.sequenceId = 3;
                gTrans.rejectReason = gTrans.reason;
            }

            navCachedPages["authorize/transfer/common-auth/auth-once-trans-authorization"] = null;
            navController.pushToView('authorize/transfer/common-auth/auth-once-trans-authorization', true, 'html');
        }

        $scope.goToBack = function () {

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
        $scope.onClickViewPDF = function (idfile, file_name) {
            var jsonData = new Object();
            jsonData.sequence_id = "6";
            jsonData.idtxn = 'B66';
            jsonData.idFile = idfile;
            jsonData.nameFile = file_name;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(gTrans.cmdType, "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0'){
                    if (Environment.isMobile()){
                        window.open(response.respJsonObj.url, "", "fullscreen=yes");

                        // DocumentHandler.handleDocumentWithURL(
                        //     function() {console.log('success');},
                        //     function(error) {
                        //         console.log('failure');
                        //         if(error == 53) {
                        //             console.log('No app that handles this file type.');
                        //         }
                        //     },
                        //     CONST_WEB_URL_LINK +response.respJsonObj.url
                        // );
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
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}
function controlInputText(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccent(field.value);
        field.value = field.value.replace(/[\[\]\,!"#$%&*'\+\-:;<=>?\\`^~{|}]/g, '');
    }
}


