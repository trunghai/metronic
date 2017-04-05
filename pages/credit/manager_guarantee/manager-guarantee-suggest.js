/**
 * Created by GiangBM.FSOFT
 * Date: 1/17/2017
 */
gCorp.isBack = false;
gTrans.request={};
gTrans.detail = {};
gTrans.pageId = 1;
gTrans.pageSize= 10;
gTrans.idtxn = "C02";
function viewBackFromOther() {
    gCorp.isBack = true;
}
function viewDidLoadSuccess(){
    resizeMainViewContent(currentPage);
    var result = document.getElementById('gua.searchResult');
    result.style.display = 'none';
    if(!gCorp.isBack){
        gTrans.pageIdx = 1;
        gTrans.tmpSearchInfo = {};
        gTrans.request = {
            userId: gCustomerNo,
            transStatus: "",
            transId: "",
            dateBegin: "",
            dateEnd: "",
            pageId: 1,
            pageSize: 5
        }
        if(gUserInfo.userRole.indexOf('CorpInput') == -1 || CONST_BROWSER_MODE == false) {
            document.getElementById("periodic-table").style.display="none";
        }
    }else{
        setValueAfterBack();
    }
    setUpCalendar();
    init();
}
function  setValueAfterBack (){
    var tmpSearchInfo = gTrans.tmpSearchInfo;
    document.getElementById("fromDate").value = tmpSearchInfo.fromDate;
    document.getElementById("toDate").value = tmpSearchInfo.endDate;
    document.getElementById("id.status").value = status(tmpSearchInfo.transStatus);
    gTrans.request = tmpSearchInfo;
}
function status(statusType) {
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

function init(){
    angular.module("EbankApp").controller("manager-guarantee-suggest", function ($scope, requestMBServiceCorp) {
        $scope.showElement = true;
        if(gUserInfo.userRole.indexOf('CorpInput') == -1 ||CONST_DESKTOP_MODE && checkScreenisMobilePX()){
            $scope.showElement =false;
        }
        $scope.changeTab = function() {
            navCachedPages['credit/guarantee/cre-guarantee-suggest-scr'] = null;
            navController.pushToView('credit/guarantee/cre-guarantee-suggest-scr', true, 'html');
        }
        function addEventListenerToCombobox(selectHandle, closeHandle) {
            document.addEventListener("evtSelectionDialog", selectHandle, false);
            document.addEventListener("evtSelectionDialogClose", closeHandle, false);
        }

        function removeEventListenerToCombobox(selectHandle, closeHandle) {
            document.removeEventListener("evtSelectionDialog", selectHandle, false);
            document.removeEventListener("evtSelectionDialogClose", closeHandle, false);
        }
        // chon trang thai
        $scope.showTransStatusSelection = function(){
            var cbxValues = (gUserInfo.lang == 'EN') ? CONST_TRANS_LIST_STATUS_EN : CONST_TRANS_LIST_STATUS_VN;
            addEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
            showDialogList(CONST_STR.get('TRANS_STATUS'), cbxValues, CONST_TRANS_LIST_STATUS, false);
        }
        function handleSelectdTransStatusInter(e) {
            removeEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
            if(e.selectedValue2 == 'ALL'){
                gTrans.request.transStatus = '';
            }else{
            gTrans.request.transStatus = e.selectedValue2;
            }
            document.getElementById("id.status").value = e.selectedValue1;
        }

        function handleCloseTransStatusCbxInter(e) {
            removeEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
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

        // tim kiem
        $scope.searchTransaction = function(){
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                gTrans.request.dateBegin = document.getElementById("fromDate").value;
                gTrans.request.dateEnd = document.getElementById("toDate").value;
            }else{
                gTrans.request.dateBegin = document.getElementById("fromDate").value;
                gTrans.request.dateEnd = document.getElementById("toDate").value;
            }
            var currentDate = new Date();
            var strCurrentDate = ('0' + (currentDate.getDate())) + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
            var sd = changeStringToArrayDate(gTrans.request.dateBegin);
            var ed = changeStringToArrayDate(gTrans.request.dateEnd);

            if(gTrans.request.dateBegin === 'dd/mm/yyyy'){
                gTrans.request.dateBegin = '';
            }
            if(gTrans.request.dateEnd === 'dd/mm/yyyy'){
                gTrans.request.dateEnd = '';
            }

            if(!this.calculateDifferentMonth(gTrans.request.dateBegin,strCurrentDate)){
                showAlertText(formatString(CONST_STR.get("GUA_NOT_GREATER_TODAY"), [CONST_STR.get("COM_FROM")]));
                return false;
            }
            if (!this.calculateDifferentMonth(gTrans.request.dateEnd, strCurrentDate)) {
                showAlertText(formatString(CONST_STR.get("GUA_NOT_GREATER_TODAY"), [CONST_STR.get("COM_TO_DATE")]));
                return false;
            }
            if (!this.calculateDifferentMonth(gTrans.request.dateBegin,gTrans.request.dateEnd)) {
                showAlertText(CONST_STR.get("GUA_PERIODIC_END_DATE_LESS_TO_DATE"));
                return;
            }
            gTrans.pageIdx = 1;
            gTrans.tmpSearchInfo = JSON.parse(JSON.stringify(gTrans.request)); //Clone object
            sendJSONRequest(gTrans.request);
        }

        // gui thong tin tim kiem
        function sendJSONRequest(request){
            var jsonData = new Object();
            jsonData.sequence_id="2";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.userId = gCustomerNo;
            jsonData.status = request.transStatus;
            jsonData.fromDate = request.dateBegin;
            jsonData.endDate = request.dateEnd;
            jsonData.pageId = gTrans.pageId;
            jsonData.pageSize = gTrans.pageSize;

            var args = new Array();
            args.push("2");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_GUARANTEE_MANAGER_SUGGEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data,true, requestMBServiceSuccess, function() {
                showAlertText(CONST_STR.get("CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA"));
            });
        }
        function requestMBServiceSuccess(response){
            if(response.respCode == '0'){
                gTrans.listTrans = [];
                if(response.respJsonObj.length > 0){
                    gTrans.listTrans = response.respJsonObj;
                    $scope.listTrans = gTrans.listTrans;
                    gTrans.totalPage = gTrans.listTrans[0].TOTAL_PAGE;
                    for(var i = 0; i< gTrans.listTrans.length; i++){
                        gTrans.nameApproved = gTrans.listTrans[i].NGUOI_DUYET;
                        gTrans.dateApproved = gTrans.listTrans[i].DATE_NOW;
                    }
                    $scope.arrPage = [];
                    for (var i = 1; i <= gTrans.totalPage; i++) {
                        $scope.arrPage.push(i);
                    }
                    setTimeout(function(){
                        displayPageCurent(gTrans.pageId);
                    },100)
                    if (gTrans.listTrans.length > 0) {
                        var result = document.getElementById('gua.searchResult');
                        result.style.display = 'block';
                    }
                    document.getElementById('gua.searchResult').style.display = 'block';
                    document.getElementById('acc-pagination').style.display = 'block';
                    document.getElementById('id.message').style.display = 'none';
                    if (gTrans.totalPage <= 1) {
                        document.getElementById('acc-pagination').style.display = 'none';
                    }
                }else{
                    document.getElementById('gua.searchResult').style.display = 'none';
                    document.getElementById('acc-pagination').style.display = 'none';
                    document.getElementById('id.message').style.display = 'block';
                    document.getElementById('id.message.value').innerHTML = CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST");
                }
            }else{
                showAlertText(response.respContent);
            }
        }


        $scope.statusVN = {"ABH" : "Đã duyệt", "INT": "Chờ duyệt", "REJ": "Từ chối", "CAN": "Hủy giao dịch", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công", "CAC": "Hủy giao dịch", "STH" : "Đang xử lý",
            "HBH" : "Hồ sơ đã được tiếp nhận", "REH" : "Hoàn chứng từ", "IBS" : "Chờ duyệt bổ sung chứng từ", "APS" : "Duyệt một phần BS chứng từ",
            "RES" : "Từ chối BS chứng từ", "RBS" : "Duyệt BS CTừ  không thành công", "SBS" : "Đang xử lý BS chứng từ", "RJS" : "TPBank từ chối BS chứng từ","RSA":"TPBank từ chối"};

        $scope.changePage = function (idx) {
            document.getElementById('page_'+gTrans.pageId).className = '';
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                gTrans.request.dateBegin = document.getElementById("fromDate").value;
                gTrans.request.dateEnd = document.getElementById("toDate").value;
            }else{
                gTrans.request.dateBegin = document.getElementById("fromDate").value;
                gTrans.request.dateEnd = document.getElementById("toDate").value;
            }
            gTrans.pageId = idx;
            gTrans.tmpSearchInfo = JSON.parse(JSON.stringify(gTrans.request)); //Clone object
            sendJSONRequest(gTrans.request);
            displayPageCurent(idx);
        }

        // chi tiet giao dich
        $scope.showDetailTransaction = function(transId, status){
            gTrans.detail.transId = transId;
            gTrans.detail.status = status;

            var json = {};
            json.transIds = gTrans.detail.transId;
            json.sequence_id = '3';
            json.idtxn = 'C02';

            var args = new Array();
            args.push("3");
            args.push(json);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_GUARANTEE_MANAGER_SUGGEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0'){
                    gTrans.detail = response.respJsonObj.info_trans[0];
                    gTrans.detail.sendNoteToUser =CONST_STR.get("COM_NOTIFY_"+gTrans.detail.SENDMETHOD);
                    gTrans.detail.AMOUNT =  formatNumberToCurrency(gTrans.detail.AMOUNT) + ' VND';
                    gTrans.detail.checklistProfile = response.respJsonObj.lst_valquery;
                    gTrans.detail.nameInput = gCustomerNanme;
                    gTrans.detail.nguoiduyet = gTrans.detail.NGUOI_DUYET;
                    gTrans.detail.thoigianduyet = gTrans.detail.NGAY_DUYET;
                    if(response.respJsonObj.info_excel.length > 0){
                        gTrans.detail.idfile = response.respJsonObj.info_excel[0].IDFILE;
                    }else{
                        gTrans.detail.idfile = '';
                    }
//                    gTrans.detail.idfile = response.respJsonObj.info_excel[0].IDFILE;
                    for(var i=0 ;i<=6;i++){
                        if(CONST_GUARANTEE_SUGGEST_TYPE_PURPOSE_ID[i] == gTrans.detail.PURPOSE ){
                            gTrans.detail.propose = (gUserInfo.lang == 'EN')? CONST_GUARANTEE_SUGGEST_TYPE_PURPOSE_EN[i]: CONST_GUARANTEE_SUGGEST_TYPE_PURPOSE_VN[i];
                            break;
                        }
                    }

                    for(var j=0;j<=2;j++){
                        if(CONSR_GUARANTEE_SUGGEST_TYPE_ID[j] == gTrans.detail.FORM){
                            gTrans.detail.form = (gUserInfo.lang == 'EN')? CONST_GUARANTEE_SUGGEST_TYPE_EN[j]: CONST_GUARANTEE_SUGGEST_TYPE_VN[j];
                            break;
                        }
                    }

                    navCachedPages['credit/manager_guarantee/manager-guarantee-suggest-detail'] = null;
                    navController.pushToView("credit/manager_guarantee/manager-guarantee-suggest-detail", true,'html');
                }else {
                    showAlertText(response.respContent);
                }
            }, function (response) {

            });
        }
        $scope.searchTransaction();
    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
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