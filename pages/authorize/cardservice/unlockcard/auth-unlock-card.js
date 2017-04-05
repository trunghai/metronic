/**
 * Created by HaiDT1 on 12/14/2016.
 */

var gDisabledLuuMau = false;
var lastClickSwitch;
gTrans.transInfo = {};
gTrans.transInfo.schedule  = false;
var viewBack = false;
gTrans.idtxn = "D61";

function viewBackFromOther() {
    viewBack = true;
    document.getElementById('trans.reason').value = gTrans.reason;
}


function viewDidLoadSuccess() {    
    actionbar.showStepSequence("com-authentication-scr");
    init();
    initDefaultCalendar('fromDate', 'toDate');
}

function init(){
    angular.module('EbankApp').controller('auth-trans-list-pending', function ($scope, requestMBServiceCorp) {
        navCachedPages["authorize/auth-transfer"] = null;
        document.getElementById('maker').value = CONST_STR.get("COM_ALL");
        document.getElementById('status').value = (gUserInfo.lang == 'EN') ? INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_EN[0]: INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_VN[0];

        navController.getBottomBar().hide();

        $scope.srcmobile = 'pages/authorize/cardservice/unlockcard/auth-unlock-table-mobile-list.html';
        $scope.src = 'pages/authorize/cardservice/unlockcard/auth-unlock-table-desk-list.html';

        setTimeout(function () {
            changeLanguageInView();
            reGenContent();
        }, 250);
        $scope.initData = function () {
            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_AUTHEN_UNLOCK_CARD'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if(response.respCode == '0' && response.respJsonObj.list_pending.length > 0) {
                    document.addEventListener('evtChangeWidthDesktop',reGenContent,false);
                    document.addEventListener('evtChangeWidthMobile',reGenContent,false);
                    
                    gTrans.makers = response.respJsonObj.makers;
                    gTrans.limit = response.respJsonObj.limit;
                    gTrans.listSourceAccounts = response.respJsonObj.listSourceAccounts;
                    $scope.listPending = response.respJsonObj.list_pending;
                    gTrans.listPending = response.respJsonObj.list_pending;
                    gTrans.listMaker = [];
                    gTrans.listMakerValue = [];
                    gTrans.listMaker.push(CONST_STR.get("COM_ALL"));
                    gTrans.listMakerValue.push("");
                    for (var i in gTrans.makers){
                        gTrans.listMaker.push(gTrans.makers[i].IDUSER);
                        gTrans.listMakerValue.push(gTrans.makers[i].IDUSER);
                    }
                    setTimeout(function () {
                        changeLanguageInView();
                    }, 10);
                    document.getElementById('hasData').style.display ='';
                    document.getElementById('emptyData').style.display ='none';
                }else {
                    document.getElementById('emptyData').innerHTML = CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST');
                    document.getElementById('hasData').style.display ='none';
                    document.getElementById('emptyData').style.display ='';
                }
            }, function () {
                showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                gotoHomePage();
            });

        }
        $scope.onSearchPending =  function() {
            var jsonData = new Object();
            jsonData.sequence_id = "2";
            jsonData.idtxn = gTrans.idtxn;

            jsonData.status = document.getElementById("statusVal").value;
            jsonData.maker = document.getElementById("makerVal").value;
            jsonData.fromDate = document.getElementById("fromDate").value;
            jsonData.endDate = document.getElementById("toDate").value;

            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_AUTHEN_UNLOCK_CARD'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true, function (response) {
                if(response.respCode == '0' && response.respJsonObj.list_pending.length > 0){
                    $scope.listPending = response.respJsonObj.list_pending;
                    gTrans.listPending = response.respJsonObj.list_pending;
                    document.getElementById('hasData').style.display ='';
                    document.getElementById('emptyData').style.display ='none';
                }else{
                    document.getElementById('emptyData').innerHTML = CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST');
                    document.getElementById('hasData').style.display ='none';
                    document.getElementById('emptyData').style.display ='';
                }
            }, function () {
                
            });
        }

        function reGenContent() {
            if (!checkScreenisMobilePX()){
                (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "block" : '';
                (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "none" : '';
            }else{
                (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "none" : '';
                (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "block" : '';

            }

            setTimeout(function () {
                changeLanguageInView();
            }, 250);
        }

        $scope.goToBack = function () {
            navCachedPages['authorize/transfer/auth-transfer'] = null;
            navController.popView(true);
        }

        //=================SHOW DIALOG TRANSTYPE====================================//
        $scope.showTransTypeSelection =function () {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_INTERNAL_TRANS_TYPE_EN : CONST_INTERNAL_TRANS_TYPE_VN;
            var tmpArray2 = CONST_INTERNAL_TRANS_TYPE_KEY;
            document.addEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showTransTypeSelectionOpen(e) {
            if (currentPage == "authorize/transfer/search-pending/internal/auth-trans-list-pending") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('transType').value = e.selectedValue1;
                    document.getElementById('transTypeVal').value = e.selectedValue2;
                    showTransTypeSelectionClose();
                }
            }
        }

        function showTransTypeSelectionClose() {
            if (currentPage == "authorize/transfer/search-pending/internal/auth-trans-list-pending") {
                document.removeEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            }
        }

        //=================SHOW DIALOG MAKER====================================//
        $scope.showMakerSelection =function () {
            if(currentPage == "authorize/cardservice/unlockcard/auth-unlock-card"){
                var tmpArray1 = gTrans.listMaker;
                var tmpArray2 = gTrans.listMakerValue;
                document.addEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
                document.addEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
                showDialogList(CONST_STR.get('COM_CHOOSE_MAKER'), tmpArray1, tmpArray2, false);
            }
        }

        function showMakerSelectionOpen(e) {
            if(currentPage == "authorize/cardservice/unlockcard/auth-unlock-card"){
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('maker').value = e.selectedValue1;
                    document.getElementById('makerVal').value = e.selectedValue2;
                    showMakerSelectionClose();
                }
            }
        }

        function showMakerSelectionClose() {
            if(currentPage == "authorize/cardservice/unlockcard/auth-unlock-card"){
                document.removeEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
            }
        }

        //=================SHOW DIALOG STATUS====================================//
        $scope.showStatusSelection =function () {
            if(currentPage == "authorize/cardservice/unlockcard/auth-unlock-card"){
                var tmpArray1 = (gUserInfo.lang == 'EN') ? UNLOCK_CARD_TRANS_AUTH_STATUS_EN : UNLOCK_CARD_TRANS_AUTH_STATUS_VN;
                var tmpArray2 = UNLOCK_CARD_TRANS_AUTH_STATUS_KEY;
                document.addEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
                document.addEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
                showDialogList(CONST_STR.get('COM_CHOOSE_STATUS'), tmpArray1, tmpArray2, false);
            }
        }

        function showStatusSelectionOpen(e) {
            if (currentPage == "authorize/cardservice/unlockcard/auth-unlock-card") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('status').value = e.selectedValue1;
                    document.getElementById('statusVal').value = e.selectedValue2;
                    showStatusSelectionClose();
                }
            }
        }

        function showStatusSelectionClose() {
            if (currentPage == "authorize/cardservice/unlockcard/auth-unlock-card") {
                document.removeEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
            }
        }

        //Duyệt một giao dịch
        $scope.goToViewScreen = function(e){
            gTrans.listSelectedTrans = [];
            for (var i in gTrans.listPending){
                if (e == gTrans.listPending[i].MA_GD){
                    gTrans.transInfo = gTrans.listPending[i];
                    gTrans.listSelectedTrans.push(gTrans.transInfo);
                    break;
                }
            }

            gTrans.listRequset = [];
            gTrans.transInfoRequest = {};
            gTrans.transInfoRequest.transId = gTrans.transInfo.MA_GD;
            gTrans.transInfoRequest.idTxn = gTrans.transInfo.LOAI_GD;
            gTrans.transInfoRequest.userIdRef = gTrans.transInfo.IDUSERREFERENCE;
            gTrans.listRequset.push(gTrans.transInfoRequest);
            gTrans.idtxn = 'T61';
            gTrans.cmdType = CONSTANTS.get('CMD_CO_AU_INTERNAL');
            gTrans.scr = 'pages/authorize/transfer/views/auth-once-trans-view.html';
            gTrans.srcViewListPending = 'authorize/transfer/search-pending/internal/auth-trans-list-pending';
            navCachedPages['authorize/transfer/common-review/auth-once-trans-review'] = null;
            navController.pushToView('authorize/transfer/common-review/auth-once-trans-review', true, 'html');
        }
        
        $scope.rejectTransaction = function () {
            gTrans.listSelectedTrans = [];
            gTrans.listRequset = [];
            var reason = document.getElementById("trans.reason").value;
            if (!reason) {
                showAlertText(CONST_STR.get("COM_CHECK_EMPTY_REJECT_REASON"));
                return;
            }

            var checkBoxAll = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
            for (var i = 0; i < checkBoxAll.length; i++) {
                if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                    for (var j in $scope.listPending){
                        if (checkBoxAll[i].name == $scope.listPending[j].MA_GD){
                            gTrans.listSelectedTrans.push($scope.listPending[j]);
                            gTrans.obj = {};
                            gTrans.obj.transId = $scope.listPending[j].MA_GD;
                            gTrans.obj.idTxn = $scope.listPending[j].LOAI_GD;
                            gTrans.listRequset.push(gTrans.obj);
                        }
                    }
                }
            }

            if (gTrans.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }


            gTrans.reason = reason;
            gTrans.authen = false;
            gTrans.sequenceId = 3;
            gTrans.idtxn = 'D61';
            gTrans.cmdType = CONSTANTS.get('CMD_AUTHEN_UNLOCK_CARD');
            gTrans.srcViewListPending = 'authorize/cardservice/unlockcard/auth-unlock-card';
            gTrans.srcAuthenDesktop = 'pages/authorize/cardservice/unlockcard/review/auth-review-unlock-desktop.html';
            gTrans.srcAuthenMobile = 'pages/authorize/cardservice/unlockcard/review/auth-review-unlock-mobile.html';
            navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
            navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');

        }

        //Duyệt nhiều giao dịch
        $scope.authorizeTransaction = function () {
            gTrans.listSelectedTrans = [];
            gTrans.listRequset = [];
            var checkBoxAll = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
            for (var i = 0; i < checkBoxAll.length; i++) {
                if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                    for (var j in $scope.listPending){
                        if (checkBoxAll[i].name == $scope.listPending[j].MA_GD){
                            gTrans.listSelectedTrans.push($scope.listPending[j]);
                            gTrans.obj = {};
                            gTrans.obj.transId = $scope.listPending[j].MA_GD;
                            gTrans.obj.idTxn = 'D61';
                            gTrans.obj.userIdRef = $scope.listPending[j].IDUSERREFERENCE;
                            gTrans.obj.cardNumber = $scope.listPending[j].SO_THE;
                            gTrans.obj.cardId = $scope.listPending[j].ID_THE;
                            gTrans.obj.userIdRef = $scope.listPending[j].MA_GD_CHI_TIET;
                            gTrans.listRequset.push(gTrans.obj);
                        }
                    }
                }
            }

            if (gTrans.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }

            gTrans.reason = "";
            gTrans.authen = true;
            gTrans.sequenceId = 4;
            gTrans.idtxn = 'D61';
            gTrans.cmdType = CONSTANTS.get('CMD_AUTHEN_UNLOCK_CARD');
            gTrans.srcViewListPending = 'authorize/cardservice/unlockcard/auth-unlock-card';
            gTrans.srcAuthenDesktop = 'pages/authorize/cardservice/unlockcard/review/auth-review-unlock-desktop.html';
            gTrans.srcAuthenMobile = 'pages/authorize/cardservice/unlockcard/review/auth-review-unlock-mobile.html';
            navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
            navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');
        }
        if (!viewBack){
            $scope.initData();
        }else{
            $scope.listPending = gTrans.listPending;
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}

function handleInputAmount (e, des) {
    var tmpVale = des.value;
    formatCurrency(e, des);
    //des.value = formatNumberToCurrency(des.value);
    var numStr = convertNum2WordWithLang(keepOnlyNumber(tmpVale), gUserInfo.lang);

    var nodeNumTxt = document.getElementById("trans.amounttotext");

    //nodeNumTxt.innerHTML = "<h6 class='h6style'>" + CONST_STR.get('TRANS_LOCAL_NUM_TO_WORD') + ": <b>" + numStr + "</b></h6>";
    //ngocdt3 chinh sua bo bang chu
    //nodeNumTxt.innerHTML = "<div class='txtmoneystyle'>" + CONST_STR.get('TRANS_LOCAL_NUM_TO_WORD') + ": " + numStr + "</div>";
    nodeNumTxt.innerHTML = "<div class='txtmoneystyle'>" + numStr + "</div>";
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
function exportExcelDebtHistory() {
  var transIds = "";
  for (var i in gTrans.listPending) {
    transIds += gTrans.listPending[i].MA_GD + ",";
  }
  var arrayClientInfo = new Array();
  arrayClientInfo.push(null);
  arrayClientInfo.push({
    sequenceId: "27",
    transType: "D61",
    transIds: transIds
  });

  var gprsCmd = new GprsCmdObj(CONSTANTS.get('COM_EXPORT_EXCEL_REPORT'), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

  data = getDataFromGprsCmd(gprsCmd);

  corpExportExcel(data);
}