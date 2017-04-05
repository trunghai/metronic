/**
 * Created by HaiDT1 on 8/4/2016.
 */
function viewDidLoadSuccess() {
    initData();

}


function initData() {
    angular.module("EbankApp").controller('auth-guarantee-detail-result', function ($scope, requestMBServiceCorp) {

        document.addEventListener('evtChangeWidthDesktop',reGenContent,false);
        document.addEventListener('evtChangeWidthMobile',reGenContent,false);
        navController.getBottomBar().hide();

        setTimeout(function () {
            changeLanguageInView();
            reGenContent();
        }, 250);

        $scope.detailCommon = gTrans.common;
        $scope.detailCheckList = gTrans.checklistProfile;
        $scope.authen = gTrans.common.authen;
        $scope.result = gTrans.result;
        console.log($scope.result);
        $scope.detailCommon.sendMethod ='';
        if (typeof gTrans.common.SENDMETHOD != "undefined" && gTrans.common.SENDMETHOD != null) {
            $scope.detailCommon.sendMethod = CONST_STR.get("COM_NOTIFY_" + gTrans.common.SENDMETHOD);
        }


        //noinspection JSAnnotator
        $scope.onMakeOrderTrans = function () {
            navCachedPages["authorize/credit/guarantee/auth-guarantee"] = null;
            navController.popToView("authorize/credit/guarantee/auth-guarantee", true, 'html');
        }
        $scope.onViewPDF = function (e) {
            var jsonData = new Object();
            jsonData.sequence_id = "6";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.iduserreference = e;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_AUTHORIZE_GUARANTEE"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, function (response) {
                var html = '<embed width="100%" height="640"'
                    + ' type="application/pdf"'
                    + ' src="'
                    + response.respJsonObj.url
                    + '"></embed>';

                document.getElementById('contentView').innerHTML = html;
                var modal = document.getElementById('myModal');
                modal.style.display = "block";
                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
            });
        }
        $scope.status=function(statusType) {
            var guaranteeTypeOfLanguage=[];
            var keyTypes =CONST_GUARANTEE_QUERY_TYPE_STATUS_VALUE;
            if (gUserInfo.lang === 'VN') {
                guaranteeTypeOfLanguage = CONST_GUARANTEE_QUERY_TYPE_STATUS_VN;
            } else {
                guaranteeTypeOfLanguage = CONST_GUARANTEE_QUERY_TYPE_STATUS_EN;
            }
            var index =this.getIndexArr(statusType,keyTypes);
            return guaranteeTypeOfLanguage[index];
        }
        $scope.getIndexArr=function(guaranteeType,arr){

            for(var i =0;i<arr.length;i++)
            {
                if(arr[i]==guaranteeType)
                {
                    return i;
                }
            }
            return 0;
        }

        function reGenContent() {
           /* if (!checkScreenisMobilePX()){
                (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "block" : '';
                (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "none" : '';
            }else{
                (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "none" : '';
                (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "block" : '';

            }

            setTimeout(function () {
                changeLanguageInView();
            }, 250);*/
        }

    });
    angular.bootstrap(document.getElementById('mainViewContent'), ["EbankApp"]);
}