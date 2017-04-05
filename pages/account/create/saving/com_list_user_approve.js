/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 2/15/17
 * Time: 11:03 AM
 * To change this template use File | Settings | File Templates.
 */
gTrans.idtxn="COM";
function viewDidLoadSuccess(){
    listUserApprove();
}
function listUserApprove(){
    angular.module("EbankApp").controller("com_list_user_approve", function ($scope, requestMBServiceCorp) {
        navCachedPages["account/create/saving/acc_saving_account"] = null;
        $scope.loadData = function(){
            var jsonData = new Object();
            jsonData.sequenceId = "1";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.userId = gCustomerNo;

            var	args = new Array();
            args.push("1");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_GET_LIST_USER_APPROVE"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true,
                function(data){
                    if (data.respCode == 0){
                        gTrans.listApprove = JSON.parse(data.respJsonObj);
                        $scope.approveList = gTrans.listApprove.rows;
                    }
                },
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                }
            );
        }
        $scope.loadData();
    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}