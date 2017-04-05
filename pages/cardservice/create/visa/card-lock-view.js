/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 1/20/17
 * Time: 11:30 AM
 * To change this template use File | Settings | File Templates.
 */
function viewDidLoadSuccess(){
    resizeMainViewContent(currentPage);
    navController.getBottomBar().hide();
    init();
}
function init(){
    angular.module('EbankApp').controller('card-lock-view', function ($scope, requestMBServiceCorp){
        $scope.infoTrans = gTrans.transInfo;
        $scope.btnCancelClick = function(){
            for(var i=0; i<navArrayScr.length;i++){
                if(navArrayScr[i] == 'cardservice/create/visa/card-lock'){
                    clearCachedPageToView(navArrayScr[i], true,'html');
                    navArrayScr = navArrayScr.slice(0,i+1);
                    return;
                }
            }
        }
        $scope.onContinuteClick = function(){
            for(var i=0; i<gTrans.cardArr.length; i++) {
                if(pCardNoSelected == gTrans.cardArr[i].myHashMap.CARD_NUMBER){
                    pCardID= gTrans.cardArr[i].myHashMap.CARD_ID;
                }
            }
            var name='';
            for(var j = 0;j<4;j++){
                if (CONST_CARD_LOCK_TYPE_ID[j] == pCardTypeSelected){
                    name = (gUserInfo.lang == 'EN')? CONST_CARD_LOCK_TYPE_EN[j]: CONST_CARD_LOCK_TYPE_VN[j];
                    break;
                }
            }
            var jsonData = new Object();

            jsonData.sequenceId = "4";
            jsonData.cardId = pCardID;
            jsonData.cardNo = pCardNoSelected;
            jsonData.transId = gTrans.transInfo.idfcatref;
            jsonData.idtxn = gTrans.idtxn;
            jsonData.transInfo = gTrans.transInfo;
            var	args = new Array();
            args.push("4");
            args.push(jsonData);

            var data = {};
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_LOCK_AND_UNLOCK_CREDIT_CARD"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true,function(response){
                if(response.respCode == '0'){
                    gTrans.comfirm = response.respJsonObj;
                    navController.pushToView("cardservice/create/visa/card-result", true, "html");
                }
            });
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}