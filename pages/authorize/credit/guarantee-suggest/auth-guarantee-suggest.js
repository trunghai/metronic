gTrans.transInfo = {};
gTrans.idtxn = "C60"
var viewBack = false;

function viewBackFromOther() {
    viewBack = true;
}

function viewDidLoadSuccess() {
    if (!viewBack) {
//        document.getElementById('transType').value = (gUserInfo.lang == 'VN') ? CONST_TRANS_TYPE_APPROVE_VN[0] : CONST_TRANS_TYPE_APPROVE_EN[0];
//        document.getElementById('transTypeVal').value = CONST_TRANS_TYPE_APPROVE_ID[0];
        document.getElementById('maker').value = (gUserInfo.lang == 'VN') ? "Tất cả" : "All";
        document.getElementById('makerVal').value = "";
        document.getElementById('status').value = (gUserInfo.lang == 'VN') ? CONST_GUARANTEE_STATUS_VN[0] : CONST_GUARANTEE_STATUS_EN[0];
        document.getElementById('statusVal').value = CONST_GUARANTEE_STATUS[0];
//        setUpCalendar();
    }
    // searchData = {
    //     disbursementType: '1',
    //     status: '',
    //     idFcatref: gTrans.listIdCaf,
    //     startDate: '',
    //     startDate: '',
    //     endDate: '',
    //     endDate: '',
    //     idtxn: 'B00',
    //     pageSize: 10000000
    // };

    init();
}


function viewBackFromOther() {
    viewBack = true;
}

function init() {
    angular.module('EbankApp').controller('auth-guarantee-suggest', function ($scope, requestMBServiceCorp) {
           clearCache = true;
            // $scope.srcmobile = 'pages/authorize/credit/guarantee-suggest/views/auth-guarantee-suggest-mobile.html';
            // $scope.src = 'pages/authorize/credit/guarantee-suggest/views/auth-guarantee-suggest-desktop.html';

            $scope.initData = function () {
                    var jsonData = new Object();
                    jsonData.sequence_id = "1";
                    jsonData.idtxn = gTrans.idtxn;

                    var args = new Array();
                    args.push("1");
                    args.push(jsonData);
                    var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_GUARANTEE_AUTH_SUGGEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
                    var data = getDataFromGprsCmd(gprsCmd);
                    requestMBServiceCorp.post(data, true, function (response) {
                        if (response.respCode == '0') {
                            var result = document.getElementById('id.searchResult');
                            if (response.respJsonObj.list_pending.length > 0) {
                                result.style.display = '';
                                gTrans.makers = response.respJsonObj.makers;
                                $scope.listPending = response.respJsonObj.list_pending;
                                gTrans.listPending = response.respJsonObj.list_pending;
                                gTrans.listMaker = [];
                                gTrans.listMakerValue = [];
                                gTrans.listMaker.push(CONST_STR.get("COM_ALL"));
                                gTrans.listMakerValue.push("");
                                for (var i in gTrans.makers) {
                                    gTrans.listMaker.push(gTrans.makers[i].IDUSER);
                                    gTrans.listMakerValue.push(gTrans.makers[i].IDUSER);
                                }
                                document.getElementById("fromDate").value = gTrans.listPending[0].DATE_PREVIOUS;
                                document.getElementById("toDate").value = gTrans.listPending[0].DATE_NOW;

                                gTrans.listIdCaf = [];
                                for (var i = 0; i < gTrans.listPending.length; i++) {
                                    gTrans.listIdCaf.push(gTrans.listPending[i].MA_GD);
                                }
                                setTimeout(function () {
                                    changeLanguageInView();
                                }, 10);
                            } else {
                                result.style.display = 'none';
                                document.getElementById('id.message').style.display = 'block';
                                document.getElementById('id.message.value').innerHTML = CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST");
                            }

                        } else {
                            showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                            gotoHomePage();
                        }
                    }, function () {
                        showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                        gotoHomePage();
                    });
            }





            //=================SHOW DIALOG MAKER====================================//
            $scope.showMakerSelection = function () {
                var tmpArray1 = gTrans.listMaker;
                var tmpArray2 = gTrans.listMakerValue;


                document.addEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
                document.addEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
                showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
            }

            function showMakerSelectionOpen(e) {
                if (currentPage == "authorize/credit/guarantee-suggest/auth-guarantee-suggest") {
                    if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                        gTrans.searchInfo.maker = e.selectedValue2;
                        document.getElementById('maker').value = e.selectedValue1;
                        document.getElementById('makerVal').value = e.selectedValue2;
                        showMakerSelectionClose();
                    }
                }
            }

            function showMakerSelectionClose() {
                if (currentPage == "authorize/credit/guarantee-suggest/auth-guarantee-suggest") {
                    document.removeEventListener("evtSelectionDialog", showMakerSelectionOpen, false);
                    document.removeEventListener("evtSelectionDialogClose", showMakerSelectionClose, false);
                }
            }

            //=================SHOW DIALOG STATUS====================================//
            $scope.showStatusSelection = function () {
                var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_GUARANTEE_STATUS_EN : CONST_GUARANTEE_STATUS_VN;
                var tmpArray2 = CONST_GUARANTEE_STATUS;
                document.addEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
                document.addEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
                showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
            }

            function showStatusSelectionOpen(e) {
                if (currentPage == "authorize/credit/guarantee-suggest/auth-guarantee-suggest") {
                    if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                        gTrans.searchInfo.status = e.selectedValue2;
                        document.getElementById('status').value = e.selectedValue1;
                        document.getElementById('statusVal').value = e.selectedValue2;
                        showStatusSelectionClose();
                    }
                }
            }

            function showStatusSelectionClose() {
                if (currentPage == "authorize/credit/guarantee-suggest/auth-guarantee-suggest") {
                    document.removeEventListener("evtSelectionDialog", showStatusSelectionOpen, false);
                    document.removeEventListener("evtSelectionDialogClose", showStatusSelectionClose, false);
                }
            }


            //--4. Gửi thông tin tìm kiếm
            $scope.onSearchPending = function () {

                if (!this.checkDateValue())
                    return;

//                gTrans.searchInfo.fromDate = document.getElementById("fromDate").value;
//                gTrans.searchInfo.endDate = document.getElementById("toDate").value;
//                gTrans.searchInfo.status = document.getElementById('statusVal').value;
//                gTrans.searchInfo.maker = document.getElementById('makerVal').value;
//                if (gTrans.searchInfo.status == CONST_STR.get('COM_ALL')) {
//                    gTrans.searchInfo.status = "";
//                }
//                if (gTrans.searchInfo.maker == CONST_STR.get('COM_ALL')) {
//                    gTrans.searchInfo.maker = "";
//                }
                var jsonData = new Object();
                jsonData.sequence_id = "2";
                jsonData.idtxn = gTrans.idtxn;

                jsonData.transType = gTrans.searchInfo.transType;
                jsonData.status = gTrans.searchInfo.status;
                jsonData.maker = gTrans.searchInfo.maker;
                jsonData.fromDate = gTrans.searchInfo.fromDate;
                jsonData.endDate = gTrans.searchInfo.endDate;
                var args = new Array();
                args.push(null);
                args.push(jsonData);
                var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_GUARANTEE_AUTH_SUGGEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
                var data = getDataFromGprsCmd(gprsCmd);
                requestMBServiceCorp.post(data, true, function (response) {

                    if (response.respCode === '0') {
                        var result = document.getElementById('id.searchResult');
                        if (response.respJsonObj == null) {
                            result.style.display = 'none';
                            $scope.listPending = [];
                        } else {
                            $scope.listPending = response.respJsonObj;
                            if ($scope.listPending.length > 0) {
                                result.style.display = 'block';
                                document.getElementById('id.message').style.display = 'none';
                            }
                            else {
                                result.style.display = 'none';
                                document.getElementById('id.message').style.display = 'block';
                                document.getElementById('id.message.value').innerHTML = CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST");
                            }

                        }
                        gTrans.searchInfo.fromDate = document.getElementById("fromDate").value;
                        gTrans.searchInfo.endDate  = document.getElementById("toDate").value;

                    } else {
                        this.message = response.respContent;
                    }
                }, function (response) {

                });
            }

            $scope.checkDateValue = function () {
                var startDate = document.getElementById("fromDate").value;
                var endDate = document.getElementById("toDate").value;
                var startDateValueInt = parseInt(startDate);
                var currentDate = new Date();

                var strCurrentDate = ('0' + (currentDate.getDate())) + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();

                if (!this.calculateDifferentMonth(startDate, strCurrentDate)) {
                    showAlertText(formatString(CONST_STR.get("GUA_NOT_GREATER_TODAY"), [CONST_STR.get("COM_START_DATE")]));
                    return false;
                }

                if (!this.calculateDifferentMonth(endDate, strCurrentDate)) {
                    showAlertText(formatString(CONST_STR.get("GUA_NOT_GREATER_TODAY"), [CONST_STR.get("COM_TO_DATE")]));
                    return false;
                }

                if (!this.calculateDifferentMonth(startDate, endDate)) {
                    showAlertText(CONST_STR.get("GUA_PERIODIC_END_DATE_LESS_TO_DATE"));
                    return false;
                }

                return true;
            }

            $scope.calculateDifferentMonth = function (valFromDate, valToDate) {
                if (valFromDate == '' || valFromDate == undefined) {
                    return true;
                }
                ;
                var from = valFromDate.split("/");
                var to = valToDate.split("/");
                var fromDate = new Date(parseInt(from[2], 10), parseInt(from[1], 10) - 1, parseInt(from[0], 10));
                var toDate = new Date(parseInt(to[2], 10), parseInt(to[1], 10) - 1, parseInt(to[0], 10));
                if (fromDate > toDate) {
                    return false;
                }
                return true;
            }

//  end tim kiem
            //Duyệt một giao dịch
            $scope.goToViewScreen = function (e) {
                gTrans.listSelectedTrans = [];
                for (var i in gTrans.listPending) {
                    if (e == gTrans.listPending[i].MA_GD) {
                        gTrans.transInfo = gTrans.listPending[i];
                        gTrans.listSelectedTrans.push(gTrans.transInfo);
                        break;
                    }
                }
                requestInfoDetailTrans(e);
            }

            function validate() {
                // Kiem tra so du kha dung
                for (var i in gTrans.listSourceAccounts) {
                    var totalAmount = 0;
                    for (var j in gTrans.listSelectedTrans) {
                        if (gTrans.listSelectedTrans[j].IDSRCACCT == gTrans.listSourceAccounts[i].account) {
                            totalAmount = totalAmount + parseInt(gTrans.listSelectedTrans[j].NUMAMOUNT);
                        }
                    }

                    if (totalAmount > parseInt(removeSpecialChar(gTrans.listSourceAccounts[i].balance))) {
                        showAlertText(CONST_STR.get("CORP_MSG_TRANS_BATCH_BALANCE_NOT_ENOUGH"));
                        return false;
                    }
                }


                return true;
            }

            function requestInfoDetailTrans(e) {
                var jsonData = new Object();
                jsonData.sequence_id = "5";
                jsonData.idtxn = gTrans.idtxn;
                jsonData.transIds = e;

                var args = new Array();
                args.push(null);
                args.push(jsonData);
                var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_GUARANTEE_AUTH_SUGGEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
                var data = getDataFromGprsCmd(gprsCmd);
                requestMBServiceCorp.post(data, true, function (response) {
                        if (response.respCode == '0') {
                            gTrans.transInfo = response.respJsonObj[0];

                            if (!validate()) return;
                            gTrans.valquery = [];
                            gTrans.guarantee = response.respJsonObj.info_trans[0];
                            if (gUserInfo.lang === 'VN') {
                                if (gTrans.guarantee.FORM == 1) {
                                    gTrans.guarantee.FORM_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_VN[0];
                                } else if (gTrans.guarantee.FORM == 2) {
                                    gTrans.guarantee.FORM_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_VN[1];
                                }

                                if (gTrans.guarantee.PURPOSE == 0) {
                                    gTrans.guarantee.PURPOSE_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_PURPOSE_VN[0];
                                } else if (gTrans.guarantee.PURPOSE == 1) {
                                    gTrans.guarantee.PURPOSE_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_PURPOSE_VN[1];
                                } else if (gTrans.guarantee.PURPOSE == 2) {
                                    gTrans.guarantee.PURPOSE_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_PURPOSE_VN[2];
                                } else if (gTrans.guarantee.PURPOSE == 3) {
                                    gTrans.guarantee.PURPOSE_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_PURPOSE_VN[3];
                                } else if (gTrans.guarantee.PURPOSE == 4) {
                                    gTrans.guarantee.PURPOSE_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_PURPOSE_VN[4];
                                } else {
                                    gTrans.guarantee.PURPOSE_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_PURPOSE_VN[5];
                                }
                            } else {
                                if (gTrans.guarantee.FORM == 1) {
                                    gTrans.guarantee.FORM_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_EN[0];
                                } else if (gTrans.guarantee.FORM == 2) {
                                    gTrans.guarantee.FORM_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_EN[1];
                                }

                                if (gTrans.guarantee.PURPOSE == 0) {
                                    gTrans.guarantee.PURPOSE_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_PURPOSE_EN[0];
                                } else if (gTrans.guarantee.PURPOSE == 1) {
                                    gTrans.guarantee.PURPOSE_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_PURPOSE_EN[1];
                                } else if (gTrans.guarantee.PURPOSE == 2) {
                                    gTrans.guarantee.PURPOSE_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_PURPOSE_EN[2];
                                } else if (gTrans.guarantee.PURPOSE == 3) {
                                    gTrans.guarantee.PURPOSE_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_PURPOSE_EN[3];
                                } else if (gTrans.guarantee.PURPOSE == 4) {
                                    gTrans.guarantee.PURPOSE_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_PURPOSE_EN[4];
                                } else {
                                    gTrans.guarantee.PURPOSE_VIEW = CONST_GUARANTEE_SUGGEST_TYPE_PURPOSE_EN[5];
                                }
                            }


                            for (var i = 0; i < response.respJsonObj.lst_valquery.length; i++) {
                                gTrans.gg = response.respJsonObj.lst_valquery[i];
                                gTrans.valquery.push(gTrans.gg);

                            }


                            gTrans.listRequset = [];
                            gTrans.transInfoRequest = {};
                            gTrans.transInfoRequest.transId = gTrans.guarantee.IDFCATREF;
                            gTrans.transInfoRequest.idtxn = "C60";
                            gTrans.transInfoRequest.userIdRef = gTrans.guarantee.IDUSERREFERENCE;
                            gTrans.transInfoRequest.disbursementType = gTrans.guarantee.FORM;
                            gTrans.listRequset.push(gTrans.transInfoRequest);
                            gTrans.idtxn = 'C60';
                            gTrans.cmdType = CONSTANTS.get('CMD_CO_GUARANTEE_AUTH_SUGGEST');
                            gTrans.scr = 'pages/authorize/credit/guarantee-suggest/views/auth-once-guarantee-suggest-view.html';
                            gTrans.srcViewListPending = 'authorize/credit/guarantee-suggest/auth-guarantee-suggest';
                            navCachedPages['authorize/transfer/common-review/auth-once-trans-review'] = null;
                            navController.pushToView('authorize/transfer/common-review/auth-once-trans-review', true, 'html');
                        }
                    }
                )
                ;
            }

            //Duyệt nhiều giao dịch
            $scope.authorizeTransaction = function () {
                gTrans.listSelectedTrans = [];
                gTrans.listInf = [];
                gTrans.obj = {};
                var checkBoxAll = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
                for (var i = 0; i < checkBoxAll.length; i++) {
                    if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                        for (var j in $scope.listPending) {
                            if (checkBoxAll[i].name == $scope.listPending[j].MA_GD) {

//                            gTrans.listSelectedTrans.push($scope.listPending[j]);
//                            if(gTrans.obj.transIds == null || gTrans.obj.transIds == undefined){
//                                gTrans.obj.transIds = $scope.listPending[j].MA_GD;
//                                gTrans.obj.userIdRef = $scope.listPending[j].USER_ID_REF;
//                            }else {gTrans.obj.transIds = $scope.listPending[j].MA_GD;
//                                gTrans.obj.userIdRef = $scope.listPending[j].USER_ID_REF;
//
//                            }
                                for (var j in $scope.listPending) {
                                    if (checkBoxAll[i].name == $scope.listPending[j].MA_GD) {
                                        gTrans.listSelectedTrans.push($scope.listPending[j]);
                                        gTrans.obj = {};
                                        gTrans.obj.transId = $scope.listPending[j].MA_GD;
                                        gTrans.obj.userIdRef = $scope.listPending[j].USER_ID_REF;
                                        gTrans.obj.disbursementType = $scope.listPending[j].FORM;
                                        gTrans.listInf.push(gTrans.obj);
                                        gTrans.listRequset = {
                                            sequence_id: '4',
                                            idtxn: 'C60',
                                            transInfo: gTrans.listInf
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
//            gTrans.listRequset = {
//                sequence_id : '4',
//                idtxn : 'C60',
//                transInfo : {
//                    transId : gTrans.obj.transIds,
//                    userIdRef :  gTrans.obj.userIdRef
//                }
//
//            }

                if (gTrans.listSelectedTrans.length == 0) {
                    showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                    return;
                }

                if (!validate()) return;
                gTrans.reason = "";
                gTrans.authen = true;
                gTrans.sequence_id = 4;
                gTrans.idtxn = 'C60';
                gTrans.cmdType = CONSTANTS.get('CMD_CO_GUARANTEE_AUTH_SUGGEST');
                gTrans.srcViewListPending = 'authorize/credit/guarantee-suggest/auth-guarantee-suggest';
                gTrans.srcAuthenDesktop = 'pages/authorize/credit/guarantee-suggest/views/auth-guarantee-suggest-review-desktop.html';
                gTrans.srcAuthenMobile = 'pages/authorize/credit/guarantee-suggest/views/auth-guarantee-suggest-review-mobile.html';
                navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
                navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');
            }
            $scope.exportExcelDebtHistory = function () {
                var transIds = "";
                for (var i in  $scope.listPending) {
                    transIds += $scope.listPending[i].MA_GD + ",";
                }
                var arrayClientInfo = new Array();
                arrayClientInfo.push(null);
                arrayClientInfo.push({
                    sequenceId: "24",
                    transType: "C11",
                    transIds: transIds
                });

                var gprsCmd = new GprsCmdObj(CONSTANTS.get('COM_EXPORT_EXCEL_REPORT'), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

                data = getDataFromGprsCmd(gprsCmd);

                corpExportExcel(data);
            }

            //Hủy giao dịch
            $scope.rejectTransaction = function () {
                gTrans.listSelectedTrans = [];
                gTrans.listRequset = [];
                var reason = document.getElementById("trans.reason").value;
                if (!reason) {
                    showAlertText(CONST_STR.get("COM_CHECK_EMPTY_REJECT_REASON"));
                    return;
                }

                var checkBoxAll = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
                gTrans.obj = {};
                for (var i = 0; i < checkBoxAll.length; i++) {
                    if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                        for (var j in $scope.listPending) {
                            if (checkBoxAll[i].name == $scope.listPending[j].MA_GD) {
                                gTrans.listSelectedTrans.push($scope.listPending[j]);
                                if (gTrans.obj.transIds == null || gTrans.obj.transIds == undefined) {
                                    gTrans.obj.transIds = $scope.listPending[j].MA_GD;
                                } else {
                                    gTrans.obj.transIds = gTrans.obj.transIds + ',' + $scope.listPending[j].MA_GD;
                                    gTrans.obj.rejectReason = document.getElementById("trans.reason").value;

                                }
                            }
                        }
                    }
                }
//            gTrans.obj.sequence_id = 3;
//            gTrans.obj.idtxn = 'C60';
//            gTrans.listRequset.push(gTrans.obj);
                gTrans.listRequset = {
                    sequence_id: 3,
                    idtxn: 'C60',
                    transIds: gTrans.obj.transIds,
                    rejectReason: gTrans.obj.rejectReason
                }

                if (gTrans.listSelectedTrans.length == 0) {
                    showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                    return;
                }


                gTrans.reason = reason;
                gTrans.authen = false;
                gTrans.sequence_id = 3;
                gTrans.idtxn = 'C60';

                gTrans.cmdType = CONSTANTS.get('CMD_CO_GUARANTEE_AUTH_SUGGEST');
                gTrans.srcViewListPending = 'authorize/credit/guarantee-suggest/auth-guarantee-suggest';
                gTrans.srcAuthenDesktop = 'pages/authorize/credit/guarantee-suggest/views/auth-guarantee-suggest-review-desktop.html';
                gTrans.srcAuthenMobile = 'pages/authorize/credit/guarantee-suggest/views/auth-guarantee-suggest-review-mobile.html';
                navCachedPages['authorize/transfer/common-review/auth-trans-review'] = null;
                navController.pushToView('authorize/transfer/common-review/auth-trans-review', true, 'html');

            }


            if (!viewBack){
                gTrans.searchInfo = {
                    transType: "C60",
                    maker: "",
                    status: "",
                    fromDate: "",
                    endDate: ""
                };
                $scope.initData();
            }else {
                if (gTrans.searchInfo.status == "") {
                    document.getElementById("status").value = "Tất cả";
                }else if(gTrans.searchInfo.status == 'APT'){
                    gTrans.searchInfo.status = 'APT';
                    document.getElementById("status").value = "Duyệt một phần";
                }else if(gTrans.searchInfo.status == 'INT'){
                    gTrans.searchInfo.status = 'INT';
                    document.getElementById("status").value = "Chờ duyệt";
                }
                if (gTrans.searchInfo.maker == "") {
                    document.getElementById("maker").value = "Tất cả";
                }
                else {
                    document.getElementById("maker").value = gTrans.searchInfo.maker;
                }

                document.getElementById("fromDate").value = gTrans.searchInfo.fromDate;
                document.getElementById("toDate").value = gTrans.searchInfo.endDate;

                $scope.onSearchPending();

            }

        }
    )
    ;
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}
function controlInputText(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccent(field.value);
        field.value = field.value.replace(/[!"#$%&*'\+:;<=>?\\`^~{|}]/g, '');
    }
}
