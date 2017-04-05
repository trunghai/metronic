/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 2/13/17
 * Time: 9:06 AM
 * To change this template use File | Settings | File Templates.
 */
function viewDidLoadSuccess(){
    detailLC();
}
function detailLC(){
    angular.module("EbankApp").controller("request-release-LC-detail", function ($scope, requestMBServiceCorp) {
        navCachedPages["international_payments/request_release_LC/manager_LC/request-release-LC-mng"] = null;

        $scope.showElement = true;
        if(gUserInfo.userRole.indexOf('CorpInput') == -1 || CONST_BROWSER_MODE == false) {
            $scope.showElement =false;
        }

        $scope.infoTrans = gTrans.detail;
        $scope.infoFile = gTrans.fileInfo;

        $scope.statusVN = {"ABH" : "Hoàn thành", "INT": "Chờ duyệt", "REJ": "Từ chối", "CAN": "Hủy giao dịch", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công", "CAC": "Hủy giao dịch", "STH" : "Đang xử lý",
            "HBH" : "Hồ sơ đã được tiếp nhận", "REH" : "Hoàn chứng từ", "IBS" : "Chờ duyệt bổ sung chứng từ", "APS" : "Duyệt một phần BS chứng từ",
            "RES" : "Từ chối BS chứng từ", "RBS" : "Duyệt BS CTừ  không thành công", "SBS" : "Đang xử lý BS chứng từ", "RJS" : "TPBank từ chối BS chứng từ","RSA":"TPBank từ chối"};

        $scope.typeTrans = {"P" : "Đề nghị phát hành LC", "T" : "Đề nghị tu chỉnh LC"};
        $scope.feeMethod = {"N" : "Chúng tôi chịu", "Y" : "Người hưởng chịu"};

        $scope.onCancelClick = function(){
            navCachedPages['international_payments/request_release_LC/manager_LC/request-release-LC-authen'] = null;
            navController.pushToView("international_payments/request_release_LC/manager_LC/request-release-LC-authen", true,'html');
        }

        $scope.viewFilePDF = function(e){
            var jsonData = new Object();
            jsonData.sequence_id = "5";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.idFile = e;

            var args = new Array();
            args.push("5");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_LC"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
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

        $scope.viewSwift = function(){
             var json = new Object();
            json.sequence_id = "6";
            json.idtxn = gTrans.idtxn;
            json.folderId= gTrans.detail.FOLDER_ID;

            var args = new Array();
            args.push("6");
            args.push(json);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_LC"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
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

        // in de nghi phat hanh LC
        $scope.inPHLC = function(){
            var json = new Object();
            json.sequence_id = "7";
            json.idtxn = gTrans.idtxn;
            json.transIds= gTrans.detail.MA_GD;

            var args = new Array();
            args.push("7");
            args.push(json);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_LC"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
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
    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}