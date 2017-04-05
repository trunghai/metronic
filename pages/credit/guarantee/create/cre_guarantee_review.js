/**
 * Created by HaiDT1 on 7/27/2016.
 */




function viewDidLoadSuccess() {
    init();
}

function init() {
    angular.module('EbankApp').controller('cre_guarantee_review', function ($scope, requestMBServiceCorp) {
        $scope.infoTrans = gTrans.infoGuarantee;
        $scope.onBackClick = function () {
            navCachedPages["credit/guarantee/create/cre_guarantee_checklist"] = null;
            navController.popView(true);
            return;
        }

        $scope.onCancelClick = function () {
            navCachedPages["credit/guarantee/create/cre_guarantee_create"] = null;
            navController.initWithRootView("credit/guarantee/create/cre_guarantee_create",true, 'html');
        }

        $scope.sendJSONRequest = function () {
            navCachedPages["credit/guarantee/create/cre_guarantee_auth"] = null;
            navController.pushToView("credit/guarantee/create/cre_guarantee_auth", true);
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
function modal() {
    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the button that opens the modal
    var btn = document.getElementById("btnView");

    // // Get the <span> element that closes the modal
    //     var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // // When the user clicks on <span> (x), close the modal
    //     span.onclick = function() {
    //         modal.style.display = "none";
    //     }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}