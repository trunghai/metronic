/**
 * Created by HaiDT1 on 7/27/2016.
 */
function viewDidLoadSuccess() {
    init();
}

function init() {
    angular.module('EbankApp').controller('cre-request-create-review', function ($scope, requestMBServiceCorp) {
        $scope.infoTrans = gTrans.transInfo;
        $scope.onBackClick = function () {
            navCachedPages["credit/guarantee/create/cre_request_create_checklist"] = null;
            navController.popView(true);
            return;
        }

        $scope.onCancelClick = function () {
            navCachedPages["credit/guarantee/create/cre_request_create"] = null;
            navController.initWithRootView("credit/guarantee/create/cre_request_create",true, 'html');
        }

        $scope.sendJSONRequest = function () {
            navCachedPages["credit/guarantee/create/cre_request_create_auth"] = null;
            navController.pushToView("credit/guarantee/create/cre_request_create_auth", true);
        }

        $scope.onViewPDF = function (e) {			
            var jsonData = new Object();
            jsonData.sequence_id = "4";
            jsonData.idtxn = "C11";
            jsonData.iduserreference = e;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CRE_REQUEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
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
		
		

    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}