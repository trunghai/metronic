/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 1/12/17
 * Time: 5:30 PM
 * To change this template use File | Settings | File Templates.
 */
gTrans.idtxn = "D11";
var pCardNoSelected = '';
var pCardTypeSelected = '';
var pCardHoldName;
function viewDidLoadSuccess(){
    function MenuContent(title, src) {
        this.title = title;
        this.src = src;
        this.keyLang = title;
    }
    var arrBottom = new Array();
    arrBottom.push(new MenuContent('CARD_LOCK_SCR_TITLE', 'cardservice/create/visa/card-lock'));
    arrBottom.push(new MenuContent('OPEN_CARD_LOCK_TITLE', 'cardservice/create/visa/card-unlock'));

    navController.initBottomBarOnlyText(arrBottom[1].src ,arrBottom, "card-lock-unlock");
    initUnLock();
    document.getElementById("open-card-lock-no").disabled = 'disable';
}
function initUnLock(){
    angular.module('EbankApp').controller('card-unlock', function ($scope, requestMBServiceCorp){
        $scope.initData = function(){
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
                            gTrans.carUnLockArr = new Array();
                            gTrans.cardArr = data.respJsonObj.list_card.myArrayList;
                            xref = data.respJsonObj.xref;
                            for(var i in gTrans.cardArr){
                                if(gTrans.cardArr[i].myHashMap.STAT_COD != '0'){
                                    gTrans.carUnLockArr.push(gTrans.cardArr[i].myHashMap);
                                }
                            }
                        }
                    }
                },
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                }
            );
        }
        $scope.initData();

        // show loai the
        $scope.ChoiceCardType = function(){
            var tmpArr1 = new Array();
            var tmpArr2 = new Array();
            for( var i=0; i< gTrans.carUnLockArr.length; i++){
                if(tmpArr2.indexOf(gTrans.carUnLockArr[i].LOAI_THE) == -1){
                    tmpArr2.push(gTrans.carUnLockArr[i].LOAI_THE);
                    var name='';
                    for(var j = 0;j<4;j++){
                        if (CONST_CARD_LOCK_TYPE_ID[j] == gTrans.carUnLockArr[i].LOAI_THE){
                            name = (gUserInfo.lang == 'EN')? CONST_CARD_LOCK_TYPE_EN[j]: CONST_CARD_LOCK_TYPE_VN[j];
                            break;
                        }
                    }
                    tmpArr1.push(name);
                }
            }
            document.addEventListener("evtSelectionDialog", handleChoiceCardType, false);
            document.addEventListener("evtSelectionDialogClose", handleChoiceCardTypeClose, false);
            showDialogList(CONST_STR.get('CARD_LOCK_TYPE_SELECTION_TITLE'), tmpArr1, tmpArr2, false);
        }

        //event: selection dialog list
        function handleChoiceCardType(e) {
            if (currentPage == "cardservice/create/visa/card-unlock") {
                handleChoiceCardTypeClose();
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    var tagAccNo = document.getElementById("open-card-lock-type");
                    if (tagAccNo.nodeName == "INPUT") {
                        tagAccNo.value = e.selectedValue1;
                    }
                    else {
                        tagAccNo.innerHTML = e.selectedValue1;
                    }
                }
                if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                    if(pCardTypeSelected != e.selectedValue2) {
                        document.getElementById("open-card-lock-no").value = CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER');
                    }
                    pCardTypeSelected = e.selectedValue2;

                    //disable if do not card
                    document.getElementById("open-card-lock-no").disabled = 'disable';
                    for(var i=0; i< gTrans.carUnLockArr.length; i++) {
                        var tmpCard = gTrans.carUnLockArr[i];
                        if(tmpCard.LOAI_THE == pCardTypeSelected) {
                            document.getElementById("open-card-lock-no").disabled = '';
                            break;
                        }
                    }
                }
            }
        }

        function handleChoiceCardTypeClose() {
            if (currentPage == "cardservice/create/visa/card-unlock") {
                document.removeEventListener("evtSelectionDialogClose", handleChoiceCardTypeClose, false);
                document.removeEventListener("evtSelectionDialog", handleChoiceCardType, false);
            }
        }

        // show so the
      $scope.ChoiceCardNo = function(){
          var tmpArray1 = new Array();
          if(gTrans.carUnLockArr && pCardTypeSelected != undefined && pCardTypeSelected != '') {
              for(var i=0; i<gTrans.carUnLockArr.length; i++) {
                  var tmpCard = gTrans.carUnLockArr[i];
                  if(tmpCard.LOAI_THE == pCardTypeSelected ){
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

          document.addEventListener("evtSelectionDialog", handleChoiceCardNo, false);
          document.addEventListener("evtSelectionDialogClose", handleChoiceCardNoClose, false);
          showDialogList(CONST_STR.get('OPEN_CARD_LOCK_RESULT_NUMBER_TITLE'), tmpArray1, '', false);
      }
        //event: selection dialog list
        function handleChoiceCardNo(e) {
            if (currentPage == "cardservice/create/visa/card-unlock") {
                handleChoiceCardNoClose();
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    pCardNoSelected = e.selectedValue1;
                    var tagAccNo = document.getElementById("open-card-lock-no");
                    if (tagAccNo.nodeName == "INPUT") {
                        tagAccNo.value = e.selectedValue1;
                    }
                    else {
                        tagAccNo.innerHTML = e.selectedValue1;
                    }
                }
            }
        }

        function handleChoiceCardNoClose(e) {
            if (currentPage == "cardservice/create/visa/card-unlock") {
                document.removeEventListener("evtSelectionDialogClose", handleChoiceCardNoClose, false);
                document.removeEventListener("evtSelectionDialog", handleChoiceCardNo, false);
            }
        }

        // thuc hien mo khoa the
        $scope.requestConfirmOpenCardLock = function(){
            if(pCardTypeSelected == undefined || pCardTypeSelected == '') {
                showAlertText(CONST_STR.get('CARD_LOCK_NO_CARD_NUMBER'));
                return;
            }else if(pCardNoSelected == ''){
                showAlertText(CONST_STR.get('CARD_LOCK_NO_CARD_SELECTION'));
                return;
            }
            for(var i=0; i<gTrans.carUnLockArr.length; i++) {
                if(pCardNoSelected == gTrans.carUnLockArr[i].CARD_NUMBER){
                    pStatus = gTrans.carUnLockArr[i].STAT_COD;
                }
            }
            if(pStatus == 0){
                showAlertText(CONST_STR.get('CARD_UNLOCK_MSG'));
                return;
            }else{
                $scope.sendRequestCardUnLock();
            }

        }

        $scope.sendRequestCardUnLock = function() {
            var data = {};
             var arrayArgs = new Array();
             ;
             if(pCardTypeSelected == undefined || pCardTypeSelected == '') {
             showAlertText(CONST_STR.get('CARD_LOCK_NO_CARD_NUMBER'));
             return;
             }else if(pCardNoSelected == ''){
             showAlertText(CONST_STR.get('CARD_LOCK_NO_CARD_SELECTION'));
             return;
             }
             for(var i=0; i<gTrans.carUnLockArr.length; i++) {
             if(pCardNoSelected == gTrans.carUnLockArr[i].CARD_NUMBER){
             pCardID= gTrans.carUnLockArr[i].CARD_ID;
                 pCardHoldName = gTrans.carUnLockArr[i].CARD_HOLD_NAME;
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
             gTrans.transInfo.typeTrans= 2;

             var jsonData = new Object();
             jsonData.sequenceId = "2";
             jsonData.idtxn = gTrans.idtxn;
             jsonData.transInfo = gTrans.transInfo;
             arrayArgs.push("2");
             arrayArgs.push(jsonData);

             var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_LOCK_AND_UNLOCK_CREDIT_CARD"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);

             data = getDataFromGprsCmd(gprsCmd);

             requestMBServiceCorp.post(data, true,function(response){
             if(response.respCode == '0'){
             gTrans.transInfo.idfcatref = response.respJsonObj.idfcatref;
             gTrans.transInfo.status = response.respJsonObj.status;
             navCachedPages['cardservice/create/visa/card-unlock-view']=null;
             navController.pushToView("cardservice/create/visa/card-unlock-view", true, "html");
             }else{
             showAlertText(response.respContent);
             gotoHomePage();
             }
             });
        }


    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}