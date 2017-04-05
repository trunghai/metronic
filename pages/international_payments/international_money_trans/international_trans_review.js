/**
 * Created by HaiDT1 on 8/27/2016.
 */
function viewDidLoadSuccess() {
    init();
}

function init() {
    angular.module('EbankApp').controller('international_trans_review', function ($scope, requestMBServiceCorp) {
        navController.getBottomBar().hide();
        gInternational.info.depositDate = getDate(('today'));
        $scope.infoTrans = gInternational.info;
        $scope.profileNote = gTrans.instructionFile;
        ($scope.infoTrans.feeMethod.value == 'BEN') ? $scope.dos = 2 : $scope.dos = 0;
        ($scope.infoTrans.swifCode.length == 0) ? $scope.swifCode = false : $scope.swifCode = true;
        ($scope.infoTrans.addressBen.length == 0) ? $scope.addressBen = false : $scope.addressBen = true;
        
        if(gInternational.info.transMethod.value == 'CS01'){
            ($scope.infoTrans.swifCode.length == 0) ? $scope.swifCode = false : $scope.swifCode = true;
            $scope.addressBen = false;
            
        }else if(gInternational.info.transMethod.value == 'CS02'){
            $scope.swifCode = false;
            
            ($scope.infoTrans.addressBen.length == 0) ? $scope.addressBen = false : $scope.addressBen = true;
        }
        
        if(gInternational.info.interMediaryBank.value == 'IBN'){
            $scope.swiftCodeNHTG = false;
            $scope.NHTG = false;
            $scope.addressNHTG = false;
            $scope.nationBankNHTG = false;

        }else if(gInternational.info.interMediaryBank.value == 'IBY'){
            $scope.nationBankNHTG = true;
            $scope.NHTG = true;
            if(gInternational.info.transMethodNHTG.value == 'CSTG01'){
                ($scope.infoTrans.swiftCodeNHTG.length == 0) ? $scope.swiftCodeNHTG = false : $scope.swiftCodeNHTG = true;
                $scope.addressNHTG = false;
            }else if(gInternational.info.transMethodNHTG.value == 'CSTG02'){
                $scope.swiftCodeNHTG = false;
                ($scope.infoTrans.addressNHTG.length == 0) ? $scope.addressNHTG = false : $scope.addressNHTG = true;
            }
        }
		
		/*HaiNM*/
		if (gInternational.info.managerBenInputName != "") {
            document.getElementById('notestyle').style.display = '';
        }else{
            document.getElementById('notestyle').style.display = 'none';
        }
		/*End*/
		
        $scope.onCancelClick = function () {
            navCachedPages['international_payments/international_money_trans/international_trans_create'] = null;
            navController.initWithRootView('international_payments/international_money_trans/international_trans_create', true, 'html');
        }

        //Chuyển sang tab quản lý giao dịch
        $scope.changeTab = function () {
            navCachedPages['international_payments/international_money_trans/manager_international_trans/manager_international_trans'] = null;
            navController.initWithRootView('international_payments/international_money_trans/manager_international_trans/manager_international_trans', true, 'html');
        }

        $scope.onViewPDF = function (e) {
           /* var arrayString = e.split("/");
            var stringUrl = "";
            for (var i in arrayString){
                if(i >= 5){
                    stringUrl = stringUrl + "/" + arrayString[i];
                }
            }*/

            if (Environment.isMobile()){
                openLinkInWindows(response.respJsonObj.url_return);
            }else {
                var widthScreen = (window.innerWidth-800)/2;
                var heightScreen = (window.innerHeight-800)/2;

                var string = "width=800,height=800,top=" + heightScreen + ",left=" + widthScreen;
                window.open(e, "", string);
            }
        }
        
        // $scope.onViewPDF = function (e) {
        //     var jsonData = new Object();
        //     jsonData.sequence_id = "4";
        //     jsonData.idtxn = gInternational.idtxn;
        //     jsonData.iduserreference = e;
        //     var args = new Array();
        //     args.push(null);
        //     args.push(jsonData);
        //     var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_PAYMENT_INTERNATIONAL"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
        //     var data = getDataFromGprsCmd(gprsCmd);
        //     requestMBServiceCorp.post(data, true, function (response) {
        //         // var html = '<embed width="100%" height="640"'
        //         //     + ' type="application/pdf"'
        //         //     + ' src="'
        //         //     + response.respJsonObj.url
        //         //     + '"></embed>';
        //         //
        //         // document.getElementById('contentView').innerHTML = html;
        //         // var modal = document.getElementById('myModal');
        //         // modal.style.display = "block";
        //         // window.onclick = function(event) {
        //         //     if (event.target == modal) {
        //         //         modal.style.display = "none";
        //         //     }
        //         // }
        //         if (Environment.isMobile()){
        //             openLinkInWindows(response.respJsonObj.url);
        //         }else {
        //             var widthScreen = (window.innerWidth-800)/2;
        //             var heightScreen = (window.innerHeight-800)/2;
        //
        //             var string = "width=800,height=800,top=" + heightScreen + ",left=" + widthScreen;
        //             window.open(response.respJsonObj.url, "", string);
        //         }
        //
        //     });
        // }

        $scope.onBackClick = function () {
            navCachedPages['international_payments/international_money_trans/international_trans_checklist'] = null;
            navController.popView(true);
        }

        $scope.onContinuteClick = function () {
            navCachedPages['international_payments/international_money_trans/international_trans_auth'] = null;
            navController.pushToView('international_payments/international_money_trans/international_trans_auth', true, 'html');
        }
    });
    
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}