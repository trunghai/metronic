/**
 * Created by HaiNM *
 **/

gCorp.isBack = false;

var searchInfo;

function viewDidLoadSuccess() {
    if(gModeScreenView == CONST_MODE_SCR_SMALL){
        document.getElementById('nav.btn.home').style.display = 'block';
    }
    initData();
    initDefaultCalendar('id.begindate', 'id.enddate')
}

function viewBackFromOther() {
    gCorp.isBack = true;
}

function initData() {
    angular.module('EbankApp').controller('auth-cre-request', function ($rootScope, $scope, requestMBServiceCorp) {
        clearCache = true;
        gTrans.srcViewListPending = ['authorize/credit/cre_request_create/auth-cre-request'];
        navCachedPages["authorize/auth-transfer"] = null;// anhntt cmt
        $scope.clickBack = function () {
            navCachedPages["authorize/auth-transfer"] = null;
            navController.popView(true);
        }
        $scope.listSelectedTrans = [];
        gTrans.idtxn = 'C61';
        if (!gCorp.isBack) {
            searchInfo = {
                transType: "C61",
                maker: "",
                status: "",
                fromDate: "",
                endDate: ""
            };
            var jsonData = {};
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;

            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_AUTHORIZE_CRE_REQUEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, handleSuccessCallBackGet);
        }
        else {
            document.getElementById("id.status").value = status(searchInfo.status);
            if (searchInfo.maker == "") {
                document.getElementById("id.maker").value = "Tất cả";
            }
            else {
                document.getElementById("id.maker").value = searchInfo.maker;
            }
            document.getElementById("id.begindate").value = searchInfo.fromDate;
            document.getElementById("id.enddate").value = searchInfo.endDate;
        }

        // function reGenContent() {
        // if (!checkScreenisMobilePX()){
        // (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "block" : '';
        // (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "none" : '';
        // }else{
        // (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "none" : '';
        // (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "block" : '';

        // }

        // setTimeout(function () {
        // changeLanguageInView();
        // }, 250);
        // }

        $scope.months = function (e) {
            return monthsTypeOfLanguage = e + ' ' + CONST_STR.get('TRANS_PERIODIC_MONTH');
        }

        function handleSuccessCallBackGet(response) {
            if (response.respCode === '0') {
                var result = document.getElementById('id.searchResult');

                gTrans.makers = response.respJsonObj.makers;
                if (response.respJsonObj.list_pending == null) {
                    $scope.currentListTrans = [];
                    result.style.display = 'none';
                } else {
                    $scope.currentListTrans = response.respJsonObj.list_pending;
                    result.style.display = 'block';
                }
                setTimeout(function () {
                    if (mainContentScroll) {
                        mainContentScroll.refresh();
                    }
                }, 100);

            } else {
                showAlertText(response.respContent);
            }

        }

        $scope.showDetailTransaction = function (e) {
            gTrans.detail = {};
            gTrans.detail.transId = e;

            var jsonData = {};
            jsonData.transIds = gTrans.detail.transId;
            jsonData.sequence_id = '5';
            jsonData.idtxn = gTrans.idtxn;

            var args = new Array();
            args.push(null);
            args.push(jsonData);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_AUTHORIZE_CRE_REQUEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, handleSuccessCallBack, handleErrorCallBack);
        }

        function handleSuccessCallBack(response) {

            if (response.respCode === '0') {

                var checklistProfile = [];
                var infoCommon = {};
                var common = response.respJsonObj.info_trans[0];
                infoCommon.transId = common.IDFCATREF; // mã giao dịch
                infoCommon.createTime = common.CREATE_TIME; //thời gian duyêt
                infoCommon.dateMake = common.DATMAKE; //thời gian tạo
                infoCommon.sourceAcc = common.IDMAKER; //người nhập
                infoCommon.idUserRef = common.IDUSERREFERENCE;
                infoCommon.status = CONST_STR.get("TRANS_STATUS_" + common.CODSTATUS) //trạng thái
                infoCommon.form_value = common.FORM;
                if (common.FORM == 0) {

                    infoCommon.form = CONST_STR.get('CRE_REQUEST_FORM_1'); //Cấp hạn mức tín dụng thường xuyên
                } else if (common.FORM == 1) {
                    infoCommon.form = CONST_STR.get('CRE_REQUEST_FORM_2');//Cấp tín dụng theo món
                }
                infoCommon.requestAmount = common.REQUEST_AMOUNT; //hạn mức đề nghị
                infoCommon.limitLoan = common.LIMIT_LOAN; //Cho vay
                infoCommon.limitGuarantee = common.LIMIT_GUARANTEE; //Bảo lãnh
                infoCommon.limitLCopen = common.LIMIT_LCOPEN; //Mở LC
                infoCommon.ngayduyet = common.DATCHECK; //Mở LC
                infoCommon.nguoiduyet = common.NGUOI_DUYET; //Mở LC
                infoCommon.ngayduyet = common.NGAY_DUYET; //Mở LC

                switch (common.PURPOSE) {
                    case '1':
                        if (gUserInfo.lang === 'VN') {
                            infoCommon.trans_type_name = CONST_SETUP_CRE_REQUEST_CREATE_VN[0];
                        } else {
                            infoCommon.trans_type_name = CONST_SETUP_CRE_REQUEST_CREATE_EN[0];
                        }
                        break;
                    case '2':
                        if (gUserInfo.lang === 'VN') {
                            infoCommon.trans_type_name = CONST_SETUP_CRE_REQUEST_CREATE_VN[1];
                        } else {
                            infoCommon.trans_type_name = CONST_SETUP_CRE_REQUEST_CREATE_EN[1];
                        }
                        break;
                    case '3':
                        if (gUserInfo.lang === 'VN') {
                            infoCommon.trans_type_name = CONST_SETUP_CRE_REQUEST_CREATE_VN[2];
                        } else {
                            infoCommon.trans_type_name = CONST_SETUP_CRE_REQUEST_CREATE_EN[2];
                        }
                        break;
                    case '4':
                        if (gUserInfo.lang === 'VN') {
                            infoCommon.trans_type_name = CONST_SETUP_CRE_REQUEST_CREATE_VN[3];
                        } else {
                            infoCommon.trans_type_name = CONST_SETUP_CRE_REQUEST_CREATE_EN[3];
                        }
                        break;
                    case '5':
                        if (gUserInfo.lang === 'VN') {
                            infoCommon.trans_type_name = CONST_SETUP_CRE_REQUEST_CREATE_VN[4];
                        } else {
                            infoCommon.trans_type_name = CONST_SETUP_CRE_REQUEST_CREATE_EN[4];
                        }
                        break;
                    case '6':
                        if (gUserInfo.lang === 'VN') {
                            infoCommon.trans_type_name = CONST_SETUP_CRE_REQUEST_CREATE_VN[5];
                        } else {
                            infoCommon.trans_type_name = CONST_SETUP_CRE_REQUEST_CREATE_EN[5];
                        }
                        break;
                }
                infoCommon.limitEstimate = common.LIMIT_ESTIMATE + ' ' + CONST_STR.get('TRANS_PERIODIC_MONTH'); //tháng
                infoCommon.collateral = common.COLLATERAL //tài sản
                infoCommon.fileDescription = common.FILE_DESCRIPTION;
                infoCommon.SENDMETHOD = common.SENDMETHOD;
                checklistProfile = response.respJsonObj.lst_valquery;


                gTrans.common = infoCommon;
                gTrans.checklistProfile = checklistProfile;

                navCachedPages["authorize/credit/cre_request_create/auth-cre-request-detail"] = null;
                navController.pushToView("authorize/credit/cre_request_create/auth-cre-request-detail", true);
            } else {
                showAlertText(response.respContent);
            }
        }

        function handleErrorCallBack() {

        }

        $scope.authorizeTransaction = function () {
            var reasontpb = document.getElementById('trans.reason').value;
            if (reasontpb) {
                showAlertText(CONST_STR.get("COM_CHECK_REJECT_BUTTON"));
                return false;
            }
            gTrans = {};
            var reason = document.getElementById("trans.reason").value;

            gTrans.listSelectedTrans = [];
            var checkBoxAll = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
            for (var i = 0; i < checkBoxAll.length; i++) {
                if (checkBoxAll[i].type == 'checkbox' && checkBoxAll[i].checked) {
                    for (var j in $scope.currentListTrans) {
                        if (checkBoxAll[i].name == $scope.currentListTrans[j].MA_GD) {
                            gTrans.listSelectedTrans.push($scope.currentListTrans[j]);
                        }
                    }
                }
            }
            if (gTrans.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }

            gTrans.authen = true;
            gTrans.currentListTrans = $scope.currentListTrans;
            gTrans.reason = reason;
            navCachedPages["authorize/credit/cre_request_create/auth-cre-request-view"] = null;
            navController.pushToView("authorize/credit/cre_request_create/auth-cre-request-view", true);

        }

        $scope.rejectTransaction = function () {
            var reason = document.getElementById("trans.reason").value;
            if (!reason) {
                showAlertText(CONST_STR.get("COM_CHECK_EMPTY_REJECT_REASON"));
                return;
            }
            var checkboxes = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].type == 'checkbox' && checkboxes[i].checked) {
                    for (var j in $scope.currentListTrans) {
                        if (checkboxes[i].name == $scope.currentListTrans[j].MA_GD) {
                            $scope.listSelectedTrans.push($scope.currentListTrans[j]);
                        }
                    }
                }
            }

            if ($scope.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }
            gTrans = {};
            gTrans.authen = false;
            gTrans.reason = reason;
            gTrans.currentListTrans = $scope.currentListTrans;
            gTrans.listSelectedTrans = $scope.listSelectedTrans;
            navCachedPages["authorize/credit/cre_request_create/auth-cre-request-view"] = null;
            navController.pushToView("authorize/credit/cre_request_create/auth-cre-request-view", true);

        }

        //--0. common
        function addEventListenerToCombobox(selectHandle, closeHandle) {
            document.addEventListener("evtSelectionDialog", selectHandle, false);
            document.addEventListener("evtSelectionDialogClose", closeHandle, false);
        }

        function removeEventListenerToCombobox(selectHandle, closeHandle) {
            document.removeEventListener("evtSelectionDialog", selectHandle, false);
            document.removeEventListener("evtSelectionDialogClose", closeHandle, false);
        }


        //--2. Xử lý chọn trạng thái
        $scope.showTransStatusSelection = function () {
            var cbxValues = (gUserInfo.lang == 'EN') ? INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_EN : INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_VN;
            addEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
            showDialogList(CONST_STR.get('COM_CHOOSE_STATUS'), cbxValues, INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_KEY, false);
        }

        function handleSelectdTransStatus(e) {
            removeEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
            searchInfo.status = e.selectedValue2;
            document.getElementById("id.status").value = e.selectedValue1;
        }

        function handleCloseTransStatusCbx(e) {
            removeEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
        }

        //--END 2

        //--3. Xử lý chọn người lập
        $scope.initData = function () {
            var jsonData = {};
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;

            var args = new Array();
            args.push("1");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_AUTHORIZE_CRE_REQUEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true, function (response) {
                gTrans.makers = response.respJsonObj.makers;
                if (gCorp.isBack == true) {
                    document.getElementById("trans.reason").value = gTrans.reason;
                    var checkboxes;
                    checkboxes = document.getElementById('recycler_table_ebank-desktop').getElementsByTagName('input');
                    for (var i = 0; i < checkboxes.length; i++) {
                        if (checkboxes[i].type == 'checkbox') {
                            if (gTrans.listSelectedTrans.length === (checkboxes.length - 1)) {
                                checkboxes[i].checked = "true";
                            } else {
                                for (var j in gTrans.listSelectedTrans) {
                                    if (gTrans.listSelectedTrans[j].MA_GD == checkboxes[i].name) {
                                        checkboxes[i].checked = "true";
                                    }
                                }
                            }
                        }

                    }
                }
            });
        }
//        $scope.initData();
        $scope.showMakers = function () {
            var cbxText = [];
            var cbxValues = [];
            cbxText.push(CONST_STR.get("COM_ALL"));
            cbxValues.push("");
            for (var i in gTrans.makers) {
                var userId = gTrans.makers[i].IDUSER;
                cbxText.push(userId);
                cbxValues.push(userId);
            }
            addEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
            showDialogList(CONST_STR.get('COM_CHOOSE_MAKER'), cbxText, cbxValues, false);
        }

        function handleSelectMaker(e) {
            removeEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
            searchInfo.maker = e.selectedValue2;
            document.getElementById('id.maker').value = e.selectedValue1;
        }

        function handleCloseMakerCbx() {
            removeEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
        }

//--END 3

        //--4. Gửi thông tin tìm kiếm
        $scope.sendJSONRequestSearch = function () {

            if (!this.checkDateValue())
                return;

//            searchInfo.fromDate = document.getElementById("id.begindate").value;
//            searchInfo.endDate = document.getElementById("id.enddate").value;

            var jsonData = new Object();
            jsonData.sequence_id = "2";
            jsonData.idtxn = gTrans.idtxn;

            jsonData.transType = searchInfo.transType;
            jsonData.status = searchInfo.status;
            jsonData.maker = searchInfo.maker;
            jsonData.fromDate = searchInfo.fromDate;
            jsonData.endDate = searchInfo.endDate;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_AUTHORIZE_CRE_REQUEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {

                if (response.respCode === '0') {
                    // gTrans.limit = {
                    //     limitTime: response.respJsonObj.limit.limitTime,
                    //     currency: response.respJsonObj.limit.currency,
                    //     limitDay: response.respJsonObj.limit.limitDay,
                    //     totalDay: response.respJsonObj.limit.totalDay,
                    // }
                    var result = document.getElementById('id.searchResult');
                    if (response.respJsonObj == null) {
                        result.style.display = 'none';
                        $scope.currentListTrans = [];
                    } else {
                        $scope.currentListTrans = response.respJsonObj;
                        if (response.respJsonObj.length > 0) {
                            result.style.display = 'block';
                            document.getElementById('id.message').style.display = 'none';
                            for (var i = 0; i < $scope.currentListTrans.length; i++)
                                $scope.currentListTrans[i].SO_LUONG = formatNumberToCurrency($scope.currentListTrans[i].SO_LUONG) + ' VND';
                        }
                        else {
                            result.style.display = 'none';
                            document.getElementById('id.message').style.display = 'block';
                            document.getElementById('id.message.value').innerHTML = CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST");
                        }

                    }

                } else {
                    this.message = response.respContent;
                }
            }, function (response) {

            });
        }

        $scope.checkDateValue = function () {
            var startDate = document.getElementById("id.begindate").value;
            var endDate = document.getElementById("id.enddate").value;
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

        $scope.guaranteeType = function (guaranteeType) {
            var guaranteeTypeOfLanguage = [];
            var keyTypes = CONST_GUARANTEE_TRANS_TYPE_KEY;
            if (gUserInfo.lang === 'VN') {
                guaranteeTypeOfLanguage = CONST_SETUP_CRE_REQUEST_CREATE_VN;
            } else {
                guaranteeTypeOfLanguage = CONST_SETUP_CRE_REQUEST_CREATE_EN;
            }
            var index = this.getIndexArr(guaranteeType, keyTypes);
            return guaranteeTypeOfLanguage[index];
        }

        $scope.status = function (statusType) {
            var guaranteeTypeOfLanguage = [];
            var keyTypes = CONST_GUARANTEE_QUERY_TYPE_STATUS_VALUE;
            if (gUserInfo.lang === 'VN') {
                guaranteeTypeOfLanguage = CONST_GUARANTEE_QUERY_TYPE_STATUS_VN;
            } else {
                guaranteeTypeOfLanguage = CONST_GUARANTEE_QUERY_TYPE_STATUS_EN;
            }
            var index = this.getIndexArr(statusType, keyTypes);
            return guaranteeTypeOfLanguage[index];
        }

        $scope.getIndexArr = function (guaranteeType, arr) {

            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == guaranteeType) {
                    return i;
                }
            }
            return 0;
        }
        $scope.exportExcelDebtHistory = function () {
            var transIds = "";
            for (var i in  $scope.currentListTrans) {
                transIds += $scope.currentListTrans[i].MA_GD + ",";
            }
            var arrayClientInfo = new Array();
            arrayClientInfo.push(null);
            arrayClientInfo.push({
                sequenceId: "25",
                transType: "C10",
                transIds: transIds
            });

            var gprsCmd = new GprsCmdObj(CONSTANTS.get('COM_EXPORT_EXCEL_REPORT'), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

            data = getDataFromGprsCmd(gprsCmd);

            corpExportExcel(data);
        }
            if(!gCorp.isBack){
                $scope.initData();
            }


    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
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

function status(statusType) {
    var guaranteeTypeOfLanguage = [];
    var keyTypes = CONST_GUARANTEE_QUERY_TYPE_STATUS_VALUE;
    if (gUserInfo.lang === 'VN') {
        guaranteeTypeOfLanguage = CONST_GUARANTEE_QUERY_TYPE_STATUS_VN;
    } else {
        guaranteeTypeOfLanguage = CONST_GUARANTEE_QUERY_TYPE_STATUS_EN;
    }
    var index = this.getIndexArr(statusType, keyTypes);
    return guaranteeTypeOfLanguage[index];
}

function getIndexArr(guaranteeType, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == guaranteeType) {
            return i;
        }
    }
    return 0;
}

