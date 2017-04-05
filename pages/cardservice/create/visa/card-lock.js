/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 1/12/17
 * Time: 4:48 PM
 * To change this template use File | Settings | File Templates.
 */
gTrans.idtxn="D11";
var pCardNoSelected = '';
var pCardTypeSelected = '';
var pCardID;
var pCardHoldName;
var pStatus;
gTrans.isBack = false;

function viewBackFromOther(){
    gTrans.isBack = true;
}

function viewDidLoadSuccess(){
    if(gTrans.isBack){
        pCardTypeSelected= gTrans.transInfo.cardTye;
        pCardNoSelected = gTrans.transInfo.cardNo;
        document.getElementById("card-lock-no").disabled = '';
    }else{
        document.getElementById("card-lock-no").disabled = 'disable';
    }
    function MenuContent(title, src) {
        this.title = title;
        this.src = src;
        this.keyLang = title;
    }
    var arrBottom = new Array();
    arrBottom.push(new MenuContent('CARD_LOCK_SCR_TITLE', 'cardservice/create/visa/card-lock'));
    arrBottom.push(new MenuContent('OPEN_CARD_LOCK_TITLE', 'cardservice/create/visa/card-unlock'));

    navController.initBottomBarOnlyText(arrBottom[0].src ,arrBottom, "card-lock-unlock");
    initVisa();

}
function initVisa(){
    angular.module('EbankApp').controller('card-lock', function ($scope, requestMBServiceCorp){
        $scope.loadInitData = function () {
            var jsonData = new Object();
            jsonData.sequenceId = "1";
            jsonData.idtxn = gTrans.idtxn;

            var	args = new Array();
            args.push("1");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_LOCK_AND_UNLOCK_CREDIT_CARD"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true,
                function(data) {
                    console.log(data);
                    if (data.respCode == 0) {
                        if(data.respJsonObj.list_card == null || data.respJsonObj.list_card == undefined){
                            showAlertText(CONST_STR.get('CREDIT_CARD_REQ_CARD_FAIL_MSG'));
                            return;
                        }else{
                        gTrans.cardArr = data.respJsonObj.list_card.myArrayList;
                        xref = data.respJsonObj.xref;
                            if((gTrans.cardArr == undefined )||(gTrans.cardArr == null) || (gTrans.cardArr.length==0) ){
                                navController.getBottomBar().hide();
                                navController.popToView("menuxsl/dynamic-menu-scr");
                                showAlertText(CONST_STR.get('CREDIT_CARD_NO_CARDS_FORLOCK_MSG'));
                            }
                            gTrans.carLockArr = new Array();
                            for(var i in gTrans.cardArr){
                                if(gTrans.cardArr[i].myHashMap.STAT_COD == '0'){
                                    gTrans.carLockArr.push(gTrans.cardArr[i].myHashMap);
                                }
                            }
                                if(gTrans.carLockArr.length == 0){
                                    document.getElementById("showNotice").innerHTML = CONST_STR.get('CREDIT_CARD_NO_CARDS_FORLOCK_MSG');
                                    document.getElementById("showNotice").style.color = '#f76115';
                                    document.getElementById("showNotice").style.fontStyle = 'italic';
                                    document.getElementById("card-lock-type").disabled = 'disable';
                                }
                            }
                        }
                },
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                }
            );

        }
        $scope.loadInitData();
        // show loai the
        $scope.showCardTypeSelection = function(){
            var tmpArr1 = new Array();
            var tmpArr2 = new Array();
            for( var i=0; i< gTrans.carLockArr.length; i++){
                if(tmpArr2.indexOf(gTrans.carLockArr[i].LOAI_THE) == -1){
                    tmpArr2.push(gTrans.carLockArr[i].LOAI_THE);
                    var name='';
                    for(var j = 0;j<4;j++){
                        if (CONST_CARD_LOCK_TYPE_ID[j] == gTrans.carLockArr[i].LOAI_THE){
                            name = (gUserInfo.lang == 'EN')? CONST_CARD_LOCK_TYPE_EN[j]: CONST_CARD_LOCK_TYPE_VN[j];
                            break;
                        }
                    }
                    tmpArr1.push(name);
                }
            }
            document.addEventListener("evtSelectionDialog", handleSelectionCardTypeList, false);
            document.addEventListener("evtSelectionDialogClose", handleSelectionCardTypeListClose, false);
            showDialogList(CONST_STR.get('CARD_LOCK_TYPE_SELECTION_TITLE'), tmpArr1, tmpArr2, false);
        }

        //event: selection dialog list
        function handleSelectionCardTypeList(e) {
            if (currentPage == "cardservice/create/visa/card-lock") {
                handleSelectionCardTypeListClose();
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    var tagAccNo = document.getElementById("card-lock-type");
                    if (tagAccNo.nodeName == "INPUT") {
                        tagAccNo.value = e.selectedValue1;
                    }
                    else {
                        tagAccNo.innerHTML = e.selectedValue1;
                    }
                }
                if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                    if(pCardTypeSelected != e.selectedValue2) {
                        document.getElementById("card-lock-no").value = CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER');
                    }
                    pCardTypeSelected = e.selectedValue2;

                    //disable if do not card
                    document.getElementById("card-lock-no").disabled = 'disable';

                    for(var i=0; i< gTrans.carLockArr.length; i++) {
                        var tmpCard = gTrans.carLockArr[i];
                        if(tmpCard.LOAI_THE == pCardTypeSelected) {
                            document.getElementById("card-lock-no").disabled = '';
                            break;
                        }
                    }
                }
            }
        }

        function handleSelectionCardTypeListClose() {
            if (currentPage == "cardservice/create/visa/card-lock") {
                document.removeEventListener("evtSelectionDialogClose", handleSelectionCardTypeListClose, false);
                document.removeEventListener("evtSelectionDialog", handleSelectionCardTypeList, false);
            }
        }

        // show so the
        $scope.showCardNoSelection= function(){
            var tmpArray1 = new Array();
            if(gTrans.carLockArr && pCardTypeSelected != undefined && pCardTypeSelected != '') {
                for(var i=0; i<gTrans.carLockArr.length; i++) {
                    var tmpCard = gTrans.carLockArr[i];
                    if(tmpCard.LOAI_THE == pCardTypeSelected ) {
                        tmpArray1.push(tmpCard.CARD_NUMBER);
                    }
                }
                if(!tmpArray1 || tmpArray1.length < 1) {
                    return;
                }
            }
            else {
                return;
            }

            document.addEventListener("evtSelectionDialog", handleSelectionCardNoList, false);
            document.addEventListener("evtSelectionDialogClose", handleSelectionCardNoListClose, false);
            showDialogList(CONST_STR.get('OPEN_CARD_LOCK_RESULT_NUMBER_TITLE'), tmpArray1, '', false);
        }

        //event: selection dialog list
        function handleSelectionCardNoList(e) {
            if (currentPage == "cardservice/create/visa/card-lock") {
                handleSelectionCardNoListClose();
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    pCardNoSelected = e.selectedValue1;
                    var tagAccNo = document.getElementById("card-lock-no");
                    if (tagAccNo.nodeName == "INPUT") {
                        tagAccNo.value = e.selectedValue1;
                    }
                    else {
                        tagAccNo.innerHTML = e.selectedValue1;
                    }
                }
            }
        }

        function handleSelectionCardNoListClose(e) {
            if (currentPage == "cardservice/create/visa/card-lock") {
                document.removeEventListener("evtSelectionDialogClose", handleSelectionCardNoListClose, false);
                document.removeEventListener("evtSelectionDialog", handleSelectionCardNoList, false);
            }
        }

        // thuc hien khoa the
        $scope.requestConfirmCardLock = function(){

            if(pCardTypeSelected == undefined || pCardTypeSelected == '') {
                showAlertText(CONST_STR.get('CARD_LOCK_NO_CARD_NUMBER'));
                return;
            }else if(pCardNoSelected == ''){
                showAlertText(CONST_STR.get('CARD_LOCK_NO_CARD_SELECTION'));
                return;
            }
            for(var i=0; i<gTrans.carLockArr.length; i++) {
                if(pCardNoSelected == gTrans.carLockArr[i].CARD_NUMBER){
                    pStatus = gTrans.carLockArr[i].STAT_COD;
                }
            }
                document.addEventListener('alertAppConfirmOK', showChoiceConfirmPre, false);
                document.addEventListener('alertAppConfirmCancel', showChoiceConfirmPreClose, false);
                showAlertAppText1(CONST_STR.get('CARD_LOCK_ALERT_TITLE'),CONST_STR.get('CARD_LOCK_ALERT_CONFIRM'),CONST_STR.get('BENEFIC_LIST_NO'),CONST_STR.get('BENEFIC_LIST_YES'));
        }

        function showChoiceConfirmPre() {
            if (currentPage == "cardservice/create/visa/card-lock") {
                showChoiceConfirmPreClose();
                $scope.sendRequestCardLock();
            }
        }
        function showChoiceConfirmPreClose() {
            if (currentPage == "cardservice/create/visa/card-lock") {
                document.removeEventListener("alertAppConfirmCancel", showChoiceConfirmPreClose, false);
                document.removeEventListener("alertAppConfirmOK", showChoiceConfirmPre, false);
            }
        }
        $scope.sendRequestCardLock = function() {
            for(var i=0; i<gTrans.carLockArr.length; i++) {
                if(pCardNoSelected == gTrans.carLockArr[i].CARD_NUMBER){
                    pCardID= gTrans.carLockArr[i].CARD_ID;
                    pCardHoldName = gTrans.carLockArr[i].CARD_HOLD_NAME;
                }
            }
            gTrans.transInfo = {};
            var name='';
            for(var j = 0;j<4;j++){
                if (CONST_CARD_LOCK_TYPE_ID[j] == pCardTypeSelected){
                    name = (gUserInfo.lang == 'EN')? CONST_CARD_LOCK_TYPE_EN[j]: CONST_CARD_LOCK_TYPE_VN[j];
                    break;
                }
            }
            gTrans.transInfo.cardType = name;
            gTrans.transInfo.Username = gCustomerNanme;
            gTrans.transInfo.xref =  xref;
            gTrans.transInfo.cardNo =  pCardNoSelected;
            gTrans.transInfo.cardId =  pCardID;
            gTrans.transInfo.cardHoldName = pCardHoldName;
            gTrans.transInfo.idtxn = 'D11';
            gTrans.transInfo.typeTrans= 1;
            gTrans.transInfo.cardTye = pCardTypeSelected;

            var jsonData = new Object();
            jsonData.sequenceId = "2";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.transInfo = gTrans.transInfo;
            var	args = new Array();
            args.push("2");
            args.push(jsonData);

            var data = {};
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_LOCK_AND_UNLOCK_CREDIT_CARD"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true,function(response){
                    if(response.respCode == '0'){
                            gTrans.transInfo.idfcatref = response.respJsonObj.idfcatref;
                            navController.pushToView("cardservice/create/visa/card-lock-view", true, "html");
                }else{
                        showAlertText(response.respContent);
                    }
            });

        }

    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}
