/**
 * Created by HaiDT1 on 9/21/2016.
 */
function viewDidLoadSuccess() {
    
    initData();

}

function initData() {
    angular.module("EbankApp").controller('manager-cre-request-detail', function ($scope, requestMBServiceCorp) {
        clearCache = true;
        navController.getBottomBar().hide();
		$scope.detailCommon = gTrans.common;
        $scope.infoTrans = gTrans.detail;
        $scope.detailCheckList = gTrans.detail.checklistProfile;
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
		
        $scope.onCancelClick = function () {
            navCachedPages['credit/manager_guarantee/manager-cre-request-detail-authen'] = null;
            navController.pushToView("credit/manager_guarantee/manager-cre-request-detail-authen", true,'html'); 
        }

        $scope.showElement = true;
        $scope.showTransCancel = true;
        if(gTrans.detail.CODSTATUS != 'INT')
        {
            $scope.showTransCancel = false;
        }
        if(gUserInfo.userRole.indexOf('CorpInput') == -1 || CONST_BROWSER_MODE == false) {
            $scope.showElement =false;
            $scope.showTransCancel = false;
        }
		
        $scope.onBackClick = function(){
            navCachedPages['credit/manager_guarantee/manager-cre-request-create'] = null;
            navController.popView(true);
        }


        $scope.onViewPDF = function (e) {
            var jsonData = new Object();
            jsonData.sequence_id = "4";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.idFile = e;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_CRE_REQUEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data,true, function (response) {
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

        //send du lieu len de xuat file excel
        $scope.sendRequestExportExcel= function() {
            var data = {};
            var objectValueClient = new Object();
            var idtxn = "C03";
            var sequenceId = 5;
            objectValueClient.idtxn = idtxn;
            objectValueClient.sequence_id = sequenceId;
            objectValueClient.idFile = gTrans.idFile;
            objectValueClient.idfcatref = $scope.infoTrans.IDFCATREF;
            objectValueClient.customerNo = gCustomerNo.substr(0,8);
            objectValueClient.guaranteeType = $scope.infoTrans. GUARANTEE_TYPE;
            var args = ["", objectValueClient];

         //  1808
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_CRE_REQUEST"), "", "", gUserInfo.lang, gUserInfo.sessionID,
                args);

            data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data,true, function (response) {
                if (Environment.isMobile()){
                    openLinkInWindows(response.respJsonObj.url);
                }else {
                    openLinkInWindows(response.respJsonObj.url);
                }
            });
        }

    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}