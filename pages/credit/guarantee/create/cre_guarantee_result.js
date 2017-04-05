/**
 * Created by HaiDT1 on 8/1/2016.
 */

function viewDidLoadSuccess() {
    init();
}

function init() {
    angular.module('EbankApp').controller('cre_guarantee_result', function ($scope, requestMBServiceCorp) {
        $scope.infoTrans = gTrans.infoGuarantee;
        $scope.result = gTrans.result;

        $scope.onMakeOrderTrans = function () {
            navCachedPages["credit/guarantee/create/cre_guarantee_create"] = null;
            navController.popToView("credit/guarantee/create/cre_guarantee_create",true, 'html');
        }

        $scope.onViewPDF = function (e) {
            var jsonData = new Object();
            jsonData.sequence_id = "4";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.iduserreference = e;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_GUARANTEE"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                // var html = '<embed width="100%" height="640"'
                    // + ' type="application/pdf"'
                    // + ' src="'
                    // + response.respJsonObj.url
                    // + '"></embed>';

                // document.getElementById('contentView').innerHTML = html;
                // var modal = document.getElementById('myModal');
                // modal.style.display = "block";
                // window.onclick = function(event) {
                    // if (event.target == modal) {
                        // modal.style.display = "none";
                    // }
                // }
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
    });

    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}