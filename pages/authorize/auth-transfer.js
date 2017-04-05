/**
 * Created by HaiDT1 on 12/13/2016.
 */

gCorp.back = false;
function viewBackFromOther() {
    gCorp.back = true;
    navCachedPages['authorize/credit/guarantee/auth-guarantee'] = null;
}

function viewDidLoadSuccess() {
    init();
}

function init() {
    angular.module('EbankApp').controller('auth-transfer', function ($scope, requestMBServiceCorp) {
        navController.getBottomBar().hide();
        $scope.loadInitData = function () {
            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn = "Z06";
            var args = new Array();
            args.push(null);
            args.push(jsonData);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_AUTHORIZE_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0'){

                    gCorp.listPending = response.respJsonObj;
                    $scope.listPending = response.respJsonObj;
                    setTimeout(function () {
                        changeLanguageInView();
                    }, 1);
                }
            });
        }

        $scope.goToAuthorizeScreen = function (idtxn) {
            //Tiền gửi trực tuyến
            if (idtxn == "A13") {
                navCachedPages["authorize/account/authorize_acc"] = null;
                navController.pushToView('authorize/account/authorize_acc', true, 'html');
            }
            //Chuyển khoản trong TPBank
            if (idtxn == "T11" || idtxn == "T12") {
                navCachedPages["authorize/transfer/search-pending/internal/auth-trans-list-pending"] = null;
                navController.pushToView('authorize/transfer/search-pending/internal/auth-trans-list-pending', true, 'html');
                setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_TIT_' + idtxn));
            }
            //Chuyển khoản liên ngân hàng
            if (idtxn == "T13") {
                navCachedPages["authorize/transfer/search-pending/domestic/transfer-domestic"] = null;
                navController.pushToView('authorize/transfer/search-pending/domestic/transfer-domestic', true, 'html');
                setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_TIT_' + idtxn));
            }
            //Chuyển khoản định kỳ
            if (idtxn == "T14") {
                navCachedPages["authorize/transfer/search-pending/periodic/periodic-transfer"] = null;
                navController.pushToView('authorize/transfer/search-pending/periodic/periodic-transfer', true, 'html');
                setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_TIT_' + idtxn));
            }
            //Chuyển khoản theo lô
            if (idtxn == "T16") {
                navCachedPages["authorize/transfer/search-pending/batch/batch-transfer-salary"] = null;
                navController.pushToView('authorize/transfer/search-pending/batch/batch-transfer-salary', true, 'html');
            }
            //Thanh toán dịch vụ
            if (idtxn == "B11") {
                navCachedPages["authorize/tax/authorize_tax"] = null;
                navController.pushToView('authorize/tax/authorize_tax', true, 'html');
            }
            //Thanh toán thiết lập
            if (idtxn == "S11") {
                navCachedPages["authorize/setup/setup-search"] = null;
                navController.pushToView('authorize/setup/setup-search', true, 'html');
            }
            //Mua bán ngoại tệ
            if (idtxn == "B13") {
                // navController.initWithRootView('corp/authorize/exchange/auth-foreign-exchange', true, 'xsl');
                navCachedPages["authorize/exchange/auth-foreign-exchange"] = null;
                navController.pushToView('authorize/exchange/auth-foreign-exchange', true, 'html');
                setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_TIT_' + idtxn));
            }
            //Chuyển khoản nhanh qua thẻ
            if (idtxn == "T19") {
                navCachedPages["authorize/transfer/search-pending/card/card-trans-auth-src"] = null;
                navController.pushToView('authorize/transfer/search-pending/card/card-trans-auth-src', true, 'html');
            }
            //Chuyển khoản qua số CMTND/HC
            if (idtxn == "T20") {
                navCachedPages["authorize/transfer/search-pending/identification/identification-trans-auth-src"] = null;
                navController.pushToView('authorize/transfer/search-pending/identification/identification-trans-auth-src', true, 'html');
            }
            //Chuyển khoản qua số tài khoản
            // if (idtxn == "T21") {
            //    navController.initWithRootView('corp/authorize/transfer/account/account-trans-auth-src', true, 'xsl');
            // }
            //Thanh toán hóa đơn
            if (idtxn == "B12") {
                navCachedPages["authorize/payment_service/bill/auth-payment-bill"] = null;
                navController.pushToView('authorize/payment_service/bill/auth-payment-bill', true, 'html');
                setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_TIT_' + idtxn));
            }
            //Bảo lãnh
            if (idtxn == "B14") {
                navCachedPages["authorize/credit/guarantee/auth-guarantee"] = null;
                navController.pushToView('authorize/credit/guarantee/auth-guarantee', true, 'html');
                setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_TIT_' + idtxn));
            }
            //Duyệt chuyển khoản định kì
            if (idtxn == "T64") {
                navCachedPages["authorize/transfer/search-pending/periodic/periodic-transfer"] = null;
                navController.pushToView('authorize/transfer/search-pending/periodic/periodic-transfer', true, 'html');
                setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_TIT_' + idtxn));
            }
            //Bảo lãnh
            if (idtxn == "C11") {
				navCachedPages["authorize/credit/cre_request_create/auth-cre-request"] = null;
                navController.pushToView('authorize/credit/cre_request_create/auth-cre-request', true, 'html');
                setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_TIT_' + idtxn));
            }
            //Duyệt đề nghị giải ngân
            if (idtxn == 'C10') {
				navCachedPages["authorize/credit/guarantee-suggest/auth-guarantee-suggest"] = null;
                navController.pushToView('authorize/credit/guarantee-suggest/auth-guarantee-suggest', true, 'html');
                setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_TIT_' + idtxn));
            }
            //Thanh toán quốc tế
            if (idtxn == 'B15'){
                navCachedPages['authorize/international/auth_international_trans'] = null;
                navController.pushToView('authorize/international/auth_international_trans', true, 'html');
            }
            if (idtxn == 'D11') {
                navCachedPages['authorize/cardservice/unlockcard/auth-unlock-card'] = null;
                navController.pushToView('authorize/cardservice/unlockcard/auth-unlock-card', true, 'html');
                setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_TIT_' + idtxn));
            }


            if (idtxn == 'D12') {
                navCachedPages['authorize/cardservice/payment-credit-debit-blance/auth-payment-credit-debit-blance'] = null;
                navController.pushToView('authorize/cardservice/payment-credit-debit-blance/auth-payment-credit-debit-blance', true, 'html');
                setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_TIT_' + idtxn));
            }
            //Đề nghị phát hành LC
            if(idtxn == 'B16'){
                navCachedPages['authorize/request-release-LC/auth-request-release-LC'] = null;
                navController.pushToView('authorize/request-release-LC/auth-request-release-LC', true, 'html');
                setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_TITLE_BAR_LC_RQ'));
            }
        }


        $scope.loadInitData();
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}