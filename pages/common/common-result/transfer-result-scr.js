/**
 * Created by HaiDT1 on 12/7/2016.
 */

function viewDidLoadSuccess() {
    init();
    document.getElementById("nav.btn.home").style.display = "none";
}

function init() {
    angular.module('EbankApp').controller('transfer-result-scr', function ($scope) {
        navController.getBottomBar().hide();
        $scope.infoTrans = gTrans.transInfo;
        $scope.result = gTrans.result;
        $scope.src = gTrans.src;
		/*HaiNM*/
		$scope.detailCommon = gTrans.common;
        $scope.check = function(){
            if (gTrans.idtxn == 'T01'){
                 return true;
            }
            return false;
        };
        $scope.hideMe = function(){
            if (gTrans.cmdType == CONSTANTS.get("CMD_ACCOUNT_QUERY_TRANSACTION")){
                 return true;
            }
            return false;
        };
		/*End*/
        setTimeout(function () {
            changeLanguageInView();
        }, 200);

//         $scope.onClickOtherTrans = function () {
// //            navCachedPages[gTrans.ortherSrc] = null;
// //            navController.pushToView(gTrans.ortherSrc, 'html');
//             //AnhNTT chỉnh sửa hủy
//             for(var i=0; i<navArrayScr.length;i++){
//                 if(navArrayScr[i] == gTrans.ortherSrc){
//                     navCachedPages[navArrayScr[i]] = null;
//                     navController.popToViewInit(navArrayScr[i], true, 'html');
//                     navArrayScr = navArrayScr.slice(0,i+1);
//                     return;
//                 }
//             }
//         }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}
function onClickOtherTrans() {
    for(var i=0; i<navArrayScr.length;i++){
        if(navArrayScr[i] == gTrans.ortherSrc){
            if(gModeScreenView == CONST_MODE_SCR_SMALL){
                document.getElementById('nav.btn.home').style.display = 'block';
            }
            navCachedPages[navArrayScr[i]] = null;
            navController.popToViewInit(navArrayScr[i], true, 'html');
            navArrayScr = navArrayScr.slice(0,i+1);
            return;
        }
    }
}
function printComHistory() {
    var tmpNodeMain = document.getElementById("mainViewContent");
    var printNode = tmpNodeMain.getElementsByTagName("div")[0];

    printNodeWithAll(printNode);
}