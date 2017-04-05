/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 2/6/17
 * Time: 3:37 PM
 * To change this template use File | Settings | File Templates.
 */
function viewDidLoadSuccess(){
    resizeMainViewContent(currentPage);
    initDetail();
}
function initDetail(){
    angular.module("EbankApp").controller('manager-guarantee-suggest-detail', function ($scope, requestMBServiceCorp) {
        clearCache = true;
        navController.getBottomBar().hide();
        $scope.infoTrans = gTrans.detail;
        $scope.detailCheckList = gTrans.detail.checklistProfile;
        $scope.statusVN = {"ABH" : "Đã duyệt", "INT": "Chờ duyệt", "REJ": "Từ chối", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công", "CAC": "Hủy giao dịch", "STH" : "Đang xử lý",
            "HBH" : "Hồ sơ đã được tiếp nhận", "REH" : "Hoàn chứng từ", "IBS" : "Chờ duyệt bổ sung chứng từ", "APS" : "Duyệt một phần BS chứng từ", "APS" : "Duyệt một phần BS chứng từ",
            "RES" : "Từ chối BS chứng từ", "RBS" : "Duyệt BS CTừ  không thành công", "SBS" : "Đang xử lý BS chứng từ", "RJS" : "TPBank từ chối BS chứng từ"};

        navCachedPages["credit/manager_guarantee/manager-guarantee-suggest"] = null;
        $scope.showTransCancel = true;
        if(gTrans.detail.CODSTATUS != 'INT')
        {
            $scope.showTransCancel = false;
        }
        $scope.viewFilePDF = function(e){
            var jsonData = new Object();
            jsonData.sequence_id = "5";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.idFile = e;

            var args = new Array();
            args.push("5");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_GUARANTEE_MANAGER_SUGGEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
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
        $scope.onCancelClick = function(){
            navCachedPages['credit/manager_guarantee/manager_guarantee_detail_authen'] = null;
            navController.pushToView("credit/manager_guarantee/manager_guarantee_detail_authen", true,'html');
        }

        //send du lieu len de xuat file excel
        $scope.sendRequestExportExcel = function(){
            var request = {
                idtxn : gTrans.idtxn,
                sequence_id: 6,
                idFile : gTrans.detail.idfile,
                idfcatref : gTrans.detail.IDFCATREF,

                customerNo: gTrans.sourceAcc.account.substring(0, 8),
                disbursementType: gTrans.detail.FORM
            };

            var args = ["", request];
            //1805
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_GUARANTEE_MANAGER_SUGGEST'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

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

