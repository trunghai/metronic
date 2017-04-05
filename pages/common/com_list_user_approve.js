/**
* Created by GiangBM.FSOFT
* User:
* Date: 17/02/17
* Time: 07:37 AM
*/
var viewBack;
function viewBackFromOther() {
    viewBack = true;
}
function viewDidLoadSuccess() {
    init();
}
function init(){
    angular.module('EbankApp').controller('com_list_user_approve', function ($scope, requestMBServiceCorp) {
        navController.getBottomBar().hide();
        var l_data = {};
        var l_arrayArgs = new Array();
        var l_obj = new Object();

        l_obj.idtxn = "COM";
        l_obj.userId = gCustomerNo;
        l_obj.sequenceId = "1";

        var l_json = JSON.stringify(l_obj);

        l_arrayArgs.push("1");
        l_arrayArgs.push(l_json);
        l_arrayArgs.push("");
        l_arrayArgs.push("");
        l_arrayArgs.push("");
        l_arrayArgs.push("");
        l_arrayArgs.push("");
        l_arrayArgs.push("");
        l_arrayArgs.push("");
        l_arrayArgs.push("");

        var l_gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_GET_LIST_USER_APPROVE"), "", "", gUserInfo.lang, gUserInfo.sessionID, l_arrayArgs);
        l_gprsCmd.raw = '';
        l_data = getDataFromGprsCmd(l_gprsCmd);

        requestMBServiceCorp.post(l_data, true, function(response){
            gTrans.final=[];
            if(response.respCode == '0'){
                var a = JSON.parse(response.respJsonObj);
                gTrans.listUserProve = a.rows;
                    for( var i =0; i<gTrans.listUserProve.length;i++){
                        gTrans.resultProve = gTrans.listUserProve[i];
                       gTrans.final.push(gTrans.resultProve);
                    }
                $scope.final = gTrans.final;
                }
        });

        $scope.goBackClick = function () {
            navController.popView(true);
        }


    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}