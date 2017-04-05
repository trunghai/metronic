/**
 * Created by HaiDT1 on 9/7/2016.
 */

gCorp.isBack = false;
gInternational.idtxn = 'B03';
gInternational.searchInfo;
gInternational.pageSize = 10;
gInternational.pageIdx = 1;
gInternational.detail = {};
gInternational.totalPage;

function viewDidLoadSuccess() {
    if (!gCorp.isBack) {

        var result = document.getElementById('id.searchResult');
        result.style.display = 'none';
        gInternational.pageIdx = 1;
        gInternational.tmpSearchInfo = {};
        gInternational.searchInfo = {
            transType: "",
            transTypeName : "Tất cả",
            maker: "",
            status: "",
            transId: "",
            fromDate: "",
            endDate: ""
        };
    }
    initData();
    setUpCalendar();

}
function viewBackFromOther(){
    gCorp.isBack = true;
}
function initData() {
    angular.module('EbankApp').controller('manager_international_trans',  function ($scope, requestMBServiceCorp) {
        // createDatePicker('fromDate', 'span.begindate');
        // createDatePicker('toDate', 'span.enddate');
        navController.getBottomBar().hide();
        if(gCorp.isBack == true){
            document.getElementById('id.searchResult').style.display='';
            setValueAfterBack();
        }

        $scope.showElement = true;
        if(gUserInfo.userRole.indexOf('CorpInput') == -1 ||CONST_DESKTOP_MODE && checkScreenisMobilePX()){
            $scope.showElement =false;
        }

        $scope.statusVN = {"ABH" : "Hoàn thành giao dịch", "INT": "Chờ duyệt", "REJ": "Từ chối", "CAN": "Hủy giao dịch", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công", "CAC": "Hủy giao dịch", "STH" : "Đang xử lý",
            "HBH" : "Hồ sơ đã được tiếp nhận", "REH" : "Hoàn chứng từ", "IBS" : "Chờ duyệt bổ sung chứng từ", "APS" : "Duyệt một phần BS chứng từ",
            "RES" : "Từ chối BS chứng từ", "RBS" : "Duyệt BS CTừ  không thành công", "SBS" : "Đang xử lý BS chứng từ", "RJS" : "TPBank từ chối BS chứng từ","RSA":"TPBank từ chối"};

        if (!gCorp.isBack){
            init();
        }else {
            $scope.currentListTrans = gInternational.currentListTrans;
            gInternational.totalPage = gInternational.currentListTrans[0].TOTAL_PAGE;
            setValueAfterBack ();
        }

        function init() {
            var jsonData = {};
            jsonData.sequence_id = "1";
            jsonData.idtxn = gInternational.idtxn;

            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_PAYMNET_INTERNATIONAL"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true,function (response) {
                gInternational.listMakers = response.respJsonObj.listMakers;

            });
        }

        function  setValueAfterBack (){
            var tmpSearchInfo =  gInternational.searchInfo;
           // document.getElementById("id.trans-type").value = transferType(tmpSearchInfo.transType);
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                document.getElementById("id.trans-type").value = tmpSearchInfo.transTypeName;
                document.getElementById("id.status").value = status(tmpSearchInfo.status);
                document.getElementById("id.trans.code").value = tmpSearchInfo.transCode;
                document.getElementById("fromDate").value = tmpSearchInfo.fromDate;
                document.getElementById("toDate").value = tmpSearchInfo.endDate;
            }else{
                document.getElementById("id.trans-typemb").value = tmpSearchInfo.transTypeName;
                document.getElementById("id.statusmb").value = status(tmpSearchInfo.status);
                document.getElementById("id.trans.codemb").value = tmpSearchInfo.transCode;
                document.getElementById("fromDatemb").value = tmpSearchInfo.fromDate;
                document.getElementById("toDatemb").value = tmpSearchInfo.endDate;    
            }
            
            if(tmpSearchInfo.maker !="")
                if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                    document.getElementById("id.maker").value = tmpSearchInfo.maker;
                }else{
                    document.getElementById("id.makermb").value = tmpSearchInfo.maker;
                }
                
        }
        function transferType(type) {
            var guaranteeTypeOfLanguage=[];
            var keyTypes = CONST_MNG_PAYMENT_INTERNATIONAL_TYPE_KEY;
            if (gUserInfo.lang === 'VN') {
                guaranteeTypeOfLanguage = CONST_MNG_PAYMENT_INTERNATIONAL_TYPE_VALUE_VN;
            } else {
                guaranteeTypeOfLanguage = CONST_MNG_PAYMENT_INTERNATIONAL_TYPE_VALUE_EN;
            }
            var index = getIndexArr(type,keyTypes);
            return guaranteeTypeOfLanguage[index];
        }
        function getIndexArr(guaranteeType,arr){

            for(var i =0;i<arr.length;i++)
            {
                if(arr[i]==guaranteeType)
                {
                    return i;
                }
            }
            return 0;
        }
        function status(statusType) {
            var guaranteeTypeOfLanguage=[];
            var keyTypes =TRANS_MONEY_INTERNATIONAL_STATUSES_KEY;
            if (gUserInfo.lang === 'VN') {
                guaranteeTypeOfLanguage = TRANS_MONEY_INTERNATIONAL_STATUSES_VN;
            } else {
                guaranteeTypeOfLanguage = TRANS_MONEY_INTERNATIONAL_STATUSES_EN;
            }
            var index =getIndexArr(statusType,keyTypes);
            return guaranteeTypeOfLanguage[index];
        }

        $scope.showDetailTransaction = function (transId, status) {
            gInternational.detail.transId = transId;
            gInternational.detail.status = status;
           this.cacheValueSearch();
            var jsonData = {};
            jsonData.transIds = gInternational.detail.transId;
            jsonData.sequence_id = '7';
            jsonData.idtxn = 'B03';

            var args = new Array();
            args.push(null);
            args.push(jsonData);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_PAYMNET_INTERNATIONAL"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0'){
                    gInternational.detail = response.respJsonObj.info_trans[0];
                    gInternational.detail.status = status;
                    gInternational.detail.checklistProfile = response.respJsonObj.lst_valquery;
                    gInternational.detail.sendMethod = response.respJsonObj.sendMethod;

                    navCachedPages['international_payments/international_money_trans/manager_international_trans/manager_international_trans_detail'] = null;
                    clearCachedPageToView("international_payments/international_money_trans/manager_international_trans/manager_international_trans_detail", true,'html');
                }else {
                    showAlertText(response.respContent)
                }
            }, function (response) {

            });
        }
        $scope.cacheValueSearch = function()
        {
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                gInternational.searchInfo.transType = document.getElementById("id.trans-type").value;
                gInternational.searchInfo.fromDate = document.getElementById("fromDate").value;
                gInternational.searchInfo.endDate = document.getElementById("toDate").value;
                gInternational.searchInfo.transCode = document.getElementById("id.trans.code").value;
            }else{
                gInternational.searchInfo.transType = document.getElementById("id.trans-typemb").value;
                gInternational.searchInfo.fromDate = document.getElementById("fromDatemb").value;
                gInternational.searchInfo.endDate = document.getElementById("toDatemb").value;
                gInternational.searchInfo.transCode = document.getElementById("id.trans.codemb").value;
            }
        }
        
        $scope.additionalDocuments = function (trans) {
            gInternational.detail.transId = trans.MA_GD;
            gInternational.detail.status = status;

            var jsonData = {};
            jsonData.transIds = gInternational.detail.transId;
            jsonData.sequence_id = '3';
            jsonData.idtxn = 'B03';
            jsonData.transType = trans.TRANSACTIONTYPE;
            jsonData.purpose = trans.PURPOSE;
            jsonData.initTransId = trans.INITIAIDFCATREF;

            var args = new Array();
            args.push(null);
            args.push(jsonData);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_PAYMNET_INTERNATIONAL"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0'){
                    // gInternational.detail = response.respJsonObj.info_trans[0];
                    gInternational.detail = trans;
                    gInternational.detail.checklistProfile = response.respJsonObj.lst_valquery;
                    gInternational.detail.documentInfo = response.respJsonObj.doc_info;
                    gInternational.detail.idcafcatref = response.respJsonObj.idcafcatref;
                    gInternational.detail.preidcafcatref = gInternational.detail.transId;
                    gInternational.detail.info_common = response.respJsonObj.info_common;
                    gInternational.detail.info_trans = response.respJsonObj.info_trans[0];
                    gInternational.detail.sum_total_capacity = response.respJsonObj.sum_total_capacity;

                    navCachedPages['international_payments/international_money_trans/manager_international_trans/manager_additional_documents'] = null;
                    navController.pushToView("international_payments/international_money_trans/manager_international_trans/manager_additional_documents", true,'html');
                }else {
                    showAlertText(response.respContent)
                }
            }, function (response) {

            });
        }
        
        $scope.cancelAdditionalProfile = function (trans) {
            var jsonData = {};
            jsonData.transIds = trans.MA_GD;
            jsonData.sequence_id = '10';
            jsonData.idtxn = 'B03';
            

            var args = new Array();
            args.push(null);
            args.push(jsonData);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_PAYMNET_INTERNATIONAL"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0'){
                    // gInternational.detail = response.respJsonObj.info_trans[0];
                    gInternational.detail = response.respJsonObj.info_trans[0];
                    gInternational.detail.checklistProfile = response.respJsonObj.lst_valquery;
                    

                    navCachedPages['international_payments/international_money_trans/manager_international_trans/manager_cancel_additional'] = null;
                    navController.pushToView("international_payments/international_money_trans/manager_international_trans/manager_cancel_additional", true,'html');
                }else {
                    showAlertText(response.respContent)
                }
            }, function (response) {

            });
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
        //--END 0

        //--1. Xử lý chọn loại giao dịch
        $scope.showTransTypeSelection = function ()
        {
            var cbxValues = (gUserInfo.lang == 'EN')? CONST_MNG_PAYMENT_INTERNATIONAL_TYPE_VALUE_EN : CONST_MNG_PAYMENT_INTERNATIONAL_TYPE_VALUE_VN;
            var cbxKeys = CONST_MNG_PAYMENT_INTERNATIONAL_TYPE_KEY;


            addEventListenerToCombobox(handleSelectTransTypeInter, handleCloseTransTypeCbxInter);
            showDialogList(CONST_STR.get('COM_CHOOSEN_TYPE_TRANS'), cbxValues, cbxKeys, false);
        }

        function handleSelectTransTypeInter(e) {
            removeEventListenerToCombobox(handleSelectTransTypeInter, handleCloseTransTypeCbxInter);
            gInternational.searchInfo.transType = e.selectedValue2;
            gInternational.searchInfo.transTypeName = e.selectedValue1;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                document.getElementById('id.trans-type').value = e.selectedValue1;
            }else{
                document.getElementById('id.trans-typemb').value = e.selectedValue1;
            }
        }

        function handleCloseTransTypeCbxInter() {
            removeEventListenerToCombobox(handleSelectTransTypeInter, handleCloseTransTypeCbxInter);
        }
        //--END 1

        //--2. Xử lý chọn trạng thái
        $scope.showTransStatusSelection = function () {
            var cbxValues = (gUserInfo.lang == 'EN')? TRANS_MONEY_INTERNATIONAL_STATUSES_EN: TRANS_MONEY_INTERNATIONAL_STATUSES_VN;
            addEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
            showDialogList(CONST_STR.get('COM_CHOOSE_STATUS'), cbxValues, TRANS_MONEY_INTERNATIONAL_STATUSES_KEY, false);
        }

        function handleSelectdTransStatusInter(e) {
            removeEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
            gInternational.searchInfo.status = e.selectedValue2;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                document.getElementById("id.status").value = e.selectedValue1;
            }else{
                document.getElementById("id.statusmb").value = e.selectedValue1;
            }
        }

        function handleCloseTransStatusCbxInter(e) {
            removeEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
        }
        //--END 2

        //--3. Xử lý chọn người lập
        $scope.showMakers = function (){
            var cbxText = [];
            var cbxValues = [];
            cbxText.push(CONST_STR.get("COM_ALL"));
            cbxValues.push("");
            for (var i in gInternational.listMakers) {
                var userId = gInternational.listMakers[i].IDUSER;
                cbxText.push(userId);
                cbxValues.push(userId);
            }
            addEventListenerToCombobox(handleSelectMakerInter, handleCloseMakerCbxInter);
            showDialogList(CONST_STR.get('COM_CHOOSE_MAKER'), cbxText, cbxValues, false);
        }

        function handleSelectMakerInter(e){
            removeEventListenerToCombobox(handleSelectMakerInter, handleCloseMakerCbxInter);
            gInternational.searchInfo.maker = e.selectedValue2;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                document.getElementById('id.maker').value = e.selectedValue1;
            }else{
                document.getElementById('id.makermb').value = e.selectedValue1;
            }
        }
        function handleCloseMakerCbxInter(){
            removeEventListenerToCombobox(handleSelectMakerInter, handleCloseMakerCbxInter);
        }
        //--END 3

        // Thuc hien khi an nut tim kiem
        $scope.searchTransaction = function () {
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                gInternational.searchInfo.fromDate = document.getElementById("fromDate").value;
                gInternational.searchInfo.endDate = document.getElementById("toDate").value;
                gInternational.searchInfo.transCode = document.getElementById("id.trans.code").value;
            }else{
                gInternational.searchInfo.fromDate = document.getElementById("fromDatemb").value;
                gInternational.searchInfo.endDate = document.getElementById("toDatemb").value;
                gInternational.searchInfo.transCode = document.getElementById("id.trans.codemb").value;
            }

            var currentDate = new Date();
            var strCurrentDate = ('0' + (currentDate.getDate())) + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();

            if (gInternational.searchInfo.fromDate === 'dd/mm/yyyy'){
                gInternational.searchInfo.fromDate = '';
            }

            if (gInternational.searchInfo.endDate === 'dd/mm/yyyy'){
                gInternational.searchInfo.endDate = '';
            }

            if (!this.calculateDifferentMonth( gInternational.searchInfo.fromDate,strCurrentDate)) {
                showAlertText(formatString(CONST_STR.get("GUA_NOT_GREATER_TODAY"), [CONST_STR.get("COM_FROM")]));
                return false;
            }

            if (!this.calculateDifferentMonth(gInternational.searchInfo.endDate, strCurrentDate)) {
                showAlertText(formatString(CONST_STR.get("GUA_NOT_GREATER_TODAY"), [CONST_STR.get("COM_TO_DATE")]));
                return false;
            }

            if (!this.calculateDifferentMonth( gInternational.searchInfo.fromDate ,gInternational.searchInfo.endDate )) {
                showAlertText(CONST_STR.get("GUA_PERIODIC_END_DATE_LESS_TO_DATE"));
                return;
            }
            gInternational.pageIdx = 1;

            gInternational.tmpSearchInfo = JSON.parse(JSON.stringify(gInternational.searchInfo)); //Clone object
            sendJSONRequest(gInternational.searchInfo);
        }
        $scope.calculateDifferentMonth =function (valFromDate, valToDate) {
            if (valFromDate == '' || valFromDate == undefined) {
                return true;
            };
            var from = valFromDate.split("/");
            var to = valToDate.split("/");
            var fromDate = new Date(parseInt(from[2], 10), parseInt(from[1], 10) - 1, parseInt(from[0], 10));
            var toDate = new Date(parseInt(to[2], 10), parseInt(to[1], 10) - 1, parseInt(to[0], 10));
            if (fromDate > toDate) {
                return false;
            }
            return true;
        }

        //--4. Gửi thông tin tìm kiếm
        function sendJSONRequest(searchInfo){
            var jsonData = new Object();
            jsonData.sequence_id = "2";
            jsonData.idtxn = gInternational.idtxn;

            jsonData.transType = searchInfo.transType;
            jsonData.status = searchInfo.status;
            jsonData.transCode = searchInfo.transCode;
            jsonData.maker = searchInfo.maker;
            jsonData.fromDate = searchInfo.fromDate;
            jsonData.endDate = searchInfo.endDate;

            jsonData.pageSize = gInternational.pageSize;
            jsonData.pageId = gInternational.pageIdx;

            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_MANAGER_PAYMNET_INTERNATIONAL'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true, requestMBServiceSuccess, function() {
                showAlertText(CONST_STR.get("CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA"));
            });


        }
		
        function requestMBServiceSuccess(response) {
            if (response.respCode == '0'){
                gInternational.currentListTrans = [];
                if (response.respJsonObj.list_trans.length > 0) {
                    gInternational.currentListTrans = response.respJsonObj.list_trans;
                    $scope.currentListTrans = gInternational.currentListTrans;
                    gInternational.totalPage = gInternational.currentListTrans[0].TOTAL_PAGE;
                    $scope.arrPage = [];
                    for (var i = 1; i <= gInternational.totalPage; i++) {
                        $scope.arrPage.push(i);
                    }

                    if (gInternational.currentListTrans.length > 0) {
                        var result = document.getElementById('id.searchResult');
                        result.style.display = 'block';
                    }
                    document.getElementById('id.searchResult').style.display = 'block';
                    document.getElementById('acc-pagination').style.display = 'block';
                    document.getElementById('id.message').style.display = 'none';
                    if (gInternational.totalPage <= 1) {
                        document.getElementById('acc-pagination').style.display = 'none';
                    }
                    setTimeout(function () {
                        if (gInternational.pageIdx === 1) {
                            displayPageCurent(1);
                            document.getElementById(gInternational.pageIdx).className = 'active';
                            $scope.$apply();
                        }
                    }, 100);
                } else {
                    document.getElementById('id.searchResult').style.display = 'none';
                    document.getElementById('acc-pagination').style.display = 'none';
                    document.getElementById('id.message').style.display = 'block';
                    document.getElementById('id.message.value').innerHTML = CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST");
                }
            }else {
                showAlertText(response.respContent);
            }

        }
        $scope.changePage = function (idx) {
			document.getElementById('page_'+gInternational.pageIdx).className = '';

            // if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                // gInternational.searchInfo.fromDate = document.getElementById("fromDate").value;
                // gInternational.searchInfo.endDate = document.getElementById("toDate").value;
            // }else{
                // gInternational.searchInfo.fromDate = document.getElementById("fromDatemb").value;
                // gInternational.searchInfo.endDate = document.getElementById("toDatemb").value;
            // }
            gInternational.pageIdx = idx;
            gInternational.tmpSearchInfo = JSON.parse(JSON.stringify(gInternational.searchInfo)); //Clone object
            sendJSONRequest(gInternational.searchInfo);
            displayPageCurent(idx);
        }
		
		$scope.changeTab = function () {
			setTitleBar(CONST_STR.get('MENU_INTERNATIONAL_MONEY_TRANS'));
			navCachedPages['international_payments/international_money_trans/international_trans_create'] = null;
			navController.pushToView('international_payments/international_money_trans/international_trans_create', true, 'html');
		}
		$scope.onGoBack = function () {
			if(gUserInfo.userRole.indexOf('CorpInput') == -1 || CONST_BROWSER_MODE == false) {
				clickHomeOrBack();
			}else{
				navCachedPages['international_payments/international_money_trans/international_trans_create'] = null;
				navController.popToView('international_payments/international_money_trans/international_trans_create', true, 'html');
			}	
		}
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}

function  displayPageCurent(page) {
    var paging = document.getElementById("paging");
    if(paging.childElementCount >0)
    {
        for(var i = 0;i<paging.childElementCount;i++)
        {
            var child = paging.children[i];
            child.className ="";
        }
		document.getElementById('page_'+page).className = 'active';

    }

}

function exportExcelDebtHistory () {
    var arrayClientInfo = new Array();
    arrayClientInfo.push(null);
    arrayClientInfo.push({
        sequenceId: "3",
        transType: gInternational.searchInfo.transType
        // indentureNo: gCredit.indentureNo,
        // dataExport: gCredit.results
    });

    var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_EXPORT_EXCEL_REPORT"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

    data = getDataFromGprsCmd(gprsCmd);

    requestMBServiceCorp(data, true, 0,
        function (data) {
        var resp = data;
        if (resp.respCode == "0") {
            var fileName = resp.respContent;
            window.open("./download/" + fileName);
        }
    });
}
function setUpCalendar(){
    //set up calendar
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    var prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    if(dd<10) {
        dd='0'+dd;
    }

    if(mm<10) {
        mm='0'+mm;
    }

    today = yyyy+'-'+mm+'-'+dd;

    var fromDate;
    var toDate;

    if (gUserInfo.lang == 'VN') {
        fromDate = new DatePicker(
            {
                show : function(data) {},
                hide : function(data) {},
                seek : function(data) {},
                select : function(data, fn) {
                    document.getElementById('fromDate').value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
                    fromDate.hide();
                }
            },
            {
                tmpl_field   : 'd/m/Y',
                range_min    : '01-01-2005',
                range_max    : '01-01-2051',
                //range_min    : '01/05/2008',
                //range_max    : '31/12/2050',

                //dom_id       : 'trans.begindate',
                dom_field    : document.getElementById('span-id.begindate'), //node make action
                async_selection : true,

                dictionaries : {
                    'custom' : {
                        common : {
                            bwd  : 'Trước',
                            fwd  : 'Sau',
                            hide : 'Đóng'
                        },
                        weekdays : {
                            motu : 'T2;T3;T4;T5;T6;T7;CN'
                        },
                        monthes : {
                            full : 'Tháng 1;Tháng 2;Tháng 3;Tháng 4;Tháng 5;Tháng 6;Tháng 7;Tháng 8;Tháng 9;Tháng 10;Tháng 11;Tháng 12'
                        }
                    }
                }
            }
        );

        toDate = new DatePicker(
            {
                show : function(data) {},
                hide : function(data) {},
                seek : function(data) {},
                select : function(data, fn) {
                    document.getElementById('toDate').value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
                    toDate.hide();
                }
            },
            {
                tmpl_field   : 'd/m/Y',
                range_min    : '01-01-2005',
                range_max    : '01-01-2051',
                //range_min    : '01/05/2008',
                //range_max    : '31/12/2050',

                //dom_id       : 'trans.begindate',
                dom_field    : document.getElementById('span-id.enddate'), //node make action
                async_selection : true,

                dictionaries : {
                    'custom' : {
                        common : {
                            bwd  : 'Trước',
                            fwd  : 'Sau',
                            hide : 'Đóng'
                        },
                        weekdays : {
                            motu : 'T2;T3;T4;T5;T6;T7;CN'
                        },
                        monthes : {
                            full : 'Tháng 1;Tháng 2;Tháng 3;Tháng 4;Tháng 5;Tháng 6;Tháng 7;Tháng 8;Tháng 9;Tháng 10;Tháng 11;Tháng 12'
                        }
                    }
                }
            }
        );

    }
    else {
        fromDate = new DatePicker(
            {
                show : function(data) {},
                hide : function(data) {},
                seek : function(data) {},
                select : function(data, fn) {
                    document.getElementById('trans.begindate').value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
                    fromDate.hide();
                }
            },
            {
                tmpl_field   : 'd/m/Y',
                range_min    : '01-01-2005',
                range_max    : '01-01-2051',
                //range_min    : '01/05/2008',
                //range_max    : '31/12/2050',

                //dom_id       : 'trans.begindate',
                dom_field    : document.getElementById('span-id.begindate'), //node make action
                async_selection : true,

                dictionaries : {
                    'custom' : {
                        common : {
                            bwd  : 'Previous',
                            fwd  : 'Next',
                            hide : 'Close'
                        },
                        weekdays : {
                            motu : 'Mo;Tu;We;Th;Fr;Sa;Su'
                        },
                        monthes : {
                            full : 'January;Feburary;March;April;May;June;July;August;September;October;November;December'
                        },
                    }
                }
            }
        );
        toDate = new DatePicker(
            {
                show : function(data) {},
                hide : function(data) {},
                seek : function(data) {},
                select : function(data, fn) {
                    document.getElementById('trans.enddate').value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
                    toDate.hide();
                }
            },
            {
                tmpl_field   : 'd/m/Y',
                range_min    : '01-01-2005',
                range_max    : '01-01-2051',
                //range_min    : '01/05/2008',
                //range_max    : '31/12/2050',

                //dom_id       : 'trans.begindate',
                dom_field    : document.getElementById('span-id.enddate'), //node make action
                async_selection : true,

                dictionaries : {
                    'custom' : {
                        common : {
                            bwd  : 'Previous',
                            fwd  : 'Next',
                            hide : 'Close'
                        },
                        weekdays : {
                            motu : 'Mo;Tu;We;Th;Fr;Sa;Su'
                        },
                        monthes : {
                            full : 'January;Feburary;March;April;May;June;July;August;September;October;November;December'
                        }
                    }
                }
            }
        );
    }

    fromDate.select(prevMonth);
    toDate.select(today);
}