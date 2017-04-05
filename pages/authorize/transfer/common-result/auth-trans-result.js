/**
 * Created by HaiDT1 on 12/20/2016.
 */
/**
 * Created by HaiDT1 on 12/14/2016.
 */

function viewDidLoadSuccess() {
    if(gModeScreenView == CONST_MODE_SCR_SMALL ){
        document.getElementById("nav.btn.home").style.display = "none";
    }
    init();
    actionbar.showStepSequence("com-authentication-scr");
}

function init() {
    angular.module('EbankApp').controller('auth-trans-result', function ($scope, requestMBServiceCorp) {
        document.addEventListener('evtChangeWidthDesktop', reGenContent, false);
        document.addEventListener('evtChangeWidthMobile', reGenContent, false);

        navController.getBottomBar().hide();
        $scope.listResult = gTrans.result.info;
        $scope.DATCHECK = gTrans.result.DATCHECK;
        $scope.guarantee = gTrans.guarantee;
        $scope.val = gTrans.valquery;
        $scope.final = gTrans.final;
        $scope.reasonreject = gTrans.reason;
        $scope.reason = gTrans.reason;
        $scope.reasonshow = "false";
        if (!gTrans.authen || gTrans.idtxn != 'B66'){
            $scope.reasonshow = "true";
        }

        $scope.statusVN = {
            "ABH": "Đã duyệt",
            "INT": "Chờ duyệt",
            "REJ": "Từ chối",
            "APT": "Duyệt một phần",
            "RBH": "Duyệt không thành công",
            "CAC": "Hủy giao dịch",
            "STH": "Đang xử lý",
            "HBH": "Hồ sơ đã được tiếp nhận",
            "REH": "Hoàn chứng từ",
            "IBS": "Chờ duyệt bổ sung chứng từ",
            "APS": "Duyệt một phần BS chứng từ",
            "APS": "Duyệt một phần BS chứng từ",
            "RES": "Từ chối BS chứng từ",
            "RBS": "Duyệt BS CTừ  không thành công",
            "SBS": "Đang xử lý BS chứng từ",
            "RJS": "TPBank từ chối BS chứng từ"
        };

        if (gTrans.idtxn == 'B62' || gTrans.idtxn == 'T63') {
            for (var i in $scope.listResult) {
                $scope.listResult[i].STATUS = CONST_STR.get('COM_TRANS_STATUS_' + $scope.listResult[i].STATUS);
            }
            $scope.srcmobile = 'pages/authorize/transfer/views/internal/auth-result-trans-local-mobile.html';
            $scope.src = 'pages/authorize/transfer/views/internal/auth-result-trans-local-desktop.html';
        } else if (gTrans.idtxn == 'D61') {
            for (var i in $scope.listResult) {
                $scope.listResult[i].STATUS = CONST_STR.get('COM_TRANS_STATUS_' + $scope.listResult[i].STATUS);
            }
            $scope.srcmobile = 'pages/authorize/cardservice/unlockcard/result/auth-result-unlockcard-mobile.html';
            $scope.src = 'pages/authorize/cardservice/unlockcard/result/auth-result-unlockcard-desktop.html';
        } else if (gTrans.idtxn == 'C60') {
            $scope.listRej = gTrans.reject;
            $scope.srcmobile = 'pages/authorize/credit/guarantee-suggest/views/auth-result-guarantee-suggest-local-mobile.html';
            $scope.src = 'pages/authorize/credit/guarantee-suggest/views/auth-result-guarantee-suggest-local-desktop.html';
        } else if (gTrans.idtxn == 'D60') {
            for (var i in $scope.listResult) {
                $scope.listResult[i].STATUS = CONST_STR.get('COM_TRANS_STATUS_' + $scope.listResult[i].STATUS);
            }
            $scope.srcmobile = 'pages/authorize/cardservice/payment-credit-debit-blance/auth-result/auth-result-payment-cedit-mobi.html';
            $scope.src = 'pages/authorize/cardservice/payment-credit-debit-blance/auth-result/auth-result-payment-cedit-desktop.html';
        }else if (gTrans.idtxn == 'B61') {
            for (var i in $scope.listResult) {
                $scope.listResult[i].STATUS = CONST_STR.get('COM_TRANS_STATUS_' + $scope.listResult[i].STATUS);
            }
            $scope.srcmobile = 'pages/authorize/payment_service/tax/auth-result-payment-tax-mobile.html';
            $scope.src = 'pages/authorize/payment_service/tax/auth-result-payment-tax-desktop.html';
        }else if (gTrans.idtxn == 'T66') {
            for (var i in $scope.listResult) {
                $scope.listResult[i].STATUS = CONST_STR.get('COM_TRANS_STATUS_' + $scope.listResult[i].STATUS);
            }
            $scope.srcmobile = 'pages/authorize/transfer/views/batch/auth-result-trans-batch-mobile.html';
            $scope.src = 'pages/authorize/transfer/views/batch/auth-result-trans-batch-desktop.html';
        }else if(gTrans.idtxn == 'T69'){
            for (var i in $scope.listResult) {
                $scope.listResult[i].STATUS = CONST_STR.get('COM_TRANS_STATUS_' + $scope.listResult[i].STATUS);
            }
            $scope.srcmobile = 'pages/authorize/transfer/views/card/auth-result-trans-card-mobile.html';
            $scope.src = 'pages/authorize/transfer/views/card/auth-result-trans-card-desktop.html';
        }else if (gTrans.idtxn == 'T64') {
            for (var i in $scope.listResult) {
                $scope.listResult[i].STATUS = CONST_STR.get('COM_TRANS_STATUS_' + $scope.listResult[i].STATUS);
//                gTrans.rejectReason = gTrans.reason;
            }
            $scope.srcmobile = 'pages/authorize/transfer/views/periodic/auth-result-trans-periodic-mobile.html';
            $scope.src = 'pages/authorize/transfer/views/periodic/auth-result-trans-periodic-desktop.html';
        }else if (gTrans.idtxn == 'B66') {
            for (var i in $scope.listResult) {
                $scope.listResult[i].STATUS = $scope.statusVN[$scope.listResult[i].STATUS];
//                gTrans.rejectReason = gTrans.reason;
            }
            $scope.srcmobile = 'pages/authorize/request-release-LC/views/auth-result-LC-mobile.html';
            $scope.src = 'pages/authorize/request-release-LC/views/auth-result-LC-desktop.html';
        }else if (gTrans.idtxn == 'T61') {
            for (var i in $scope.listResult) {
                $scope.listResult[i].STATUS = CONST_STR.get('COM_TRANS_STATUS_' + $scope.listResult[i].STATUS);
//                gTrans.rejectReason = gTrans.reason;
            }
            $scope.srcmobile = 'pages/authorize/transfer/views/internal/auth-result-trans-local-mobile.html';
            $scope.src = 'pages/authorize/transfer/views/internal/auth-result-trans-local-desktop.html';
        }else if (gTrans.idtxn == 'T70') {
            for (var i in $scope.listResult) {
                $scope.listResult[i].STATUS = CONST_STR.get('COM_TRANS_STATUS_' + $scope.listResult[i].STATUS);
//                gTrans.rejectReason = gTrans.reason;
            }
            $scope.srcmobile = 'pages/authorize/transfer/views/identification/auth-result-identification-trans-mobile.html';
            $scope.src = 'pages/authorize/transfer/views/identification/auth-result-identification-trans-desktop.html';
        }else if(gTrans.idtxn == 'T71'){
            for (var i in $scope.listResult) {
                $scope.listResult[i].STATUS = CONST_STR.get('COM_TRANS_STATUS_' + $scope.listResult[i].STATUS);
            }
            gTrans.list = $scope.listResult.length;
            $scope.srcmobile = 'pages/authorize/transfer/views/account/auth-result-trans-acount-mobile.html';
            $scope.src = 'pages/authorize/transfer/views/account/auth-result-trans-acount-desktop.html';
        }else if(gTrans.idtxn == 'A63'){
            for (var i in $scope.listResult) {
                $scope.listResult[i].STATUS = CONST_STR.get('COM_TRANS_STATUS_' + $scope.listResult[i].STATUS);
            }
            $scope.srcmobile = 'pages/authorize/account/acc-result-mobile.html';
            $scope.src = 'pages/authorize/account/acc-result-desktop.html';
        }



        $scope.result = gTrans.result;
        setTimeout(function () {
            changeLanguageInView();
            reGenContent();
        }, 100);
        if (gTrans.authen){
            document.getElementById('trans.reason').style.display = 'none';
        }else {
            if (gTrans.idtxn != 'B66'){
                document.getElementById('trans.reason').style.display = 'block';
            }else {
                document.getElementById('trans.reason').style.display = 'none';
            }
        }

        function reGenContent() {
            if (!checkScreenisMobilePX()) {
                (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "block" : '';
                (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "none" : '';
            } else {
                (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "none" : '';
                (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "block" : '';

            }

            setTimeout(function () {
                changeLanguageInView();
            }, 100);
        }

        $scope.onClickOtherTrans = function () {
//            navCachedPages[gTrans.srcViewListPending] = null;
//            navController.pushToView(gTrans.srcViewListPending, 'html');
            //AnhNTT chỉnh sửa giao dịch khác
            for(var i=0; i<navArrayScr.length;i++){
                if(navArrayScr[i] == gTrans.srcViewListPending){
                    if(gModeScreenView == CONST_MODE_SCR_SMALL){
                        document.getElementById('nav.btn.home').style.display = 'block';
                    }
                    navCachedPages[navArrayScr[i]] = null;
                    navController.popToViewInit(navArrayScr[i], true, 'html');
                    navArrayScr = navArrayScr.slice(0,i+1);
                    return;
                }
            }
        }

    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}

