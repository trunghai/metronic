/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 1/4/17
 * Time: 5:50 PM
 * To change this template use File | Settings | File Templates.
 */

gTrans.idtxn = 'T02';
gTrans.query;
gTrans.detail;
gTrans.pageId = 1;
gTrans.totalPage;
gTrans.idfcatref= "";
backView = false;

function viewDidLoadSuccess(){
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        gTrans.pageSize = 10;
    }else{
        gTrans.pageSize = 5;
    }
    navController.getBottomBar().hide();
    resizeMainViewContent(currentPage);
    var result = document.getElementById('tblContent');
    result.style.display = 'none';
    if(!gCorp.isBack){

        gTrans.pageIdx = 1;
        gTrans.tmpSearchInfo = {};
        gTrans.query = {
            request: {
                userId: gCustomerNo,
                transTypeId: "T12",
                transStatus: "ALL",
                transId: "",
                maker: "ALL",
                dateBegin: "",
                dateEnd: "",
                pageId: 1,
                pageSize: 5
            }
        };
    }
    setUpCalendar();
    initQuery();
}
function transType(transType) {
    var transTypeOfLanguage=[];
    var keyTypes = CONST_TRANS_TYPE_CONDITION_ID;
    if (gUserInfo.lang === 'VN') {
        transTypeOfLanguage = CONST_TRANS_TYPE_CONDITION_VN;
    } else {
        transTypeOfLanguage = CONST_TRANS_TYPE_CONDITION_EN;
    }
    var index =this.getIndexArr(transType,keyTypes);
    return transTypeOfLanguage[index];
}
function status(statusType) {
    var transTypeOfLanguage=[];
    var keyTypes = CONST_TRANS_LIST_STATUS;
    if (gUserInfo.lang === 'VN') {
        transTypeOfLanguage = CONST_TRANS_LIST_STATUS_VN;
    } else {
        transTypeOfLanguage = CONST_TRANS_LIST_STATUS_EN;
    }
    var index =this.getIndexArr(statusType,keyTypes);
    return transTypeOfLanguage[index];
}
function getIndexArr(transType,arr){

    for(var i =0;i<arr.length;i++)
    {
        if(arr[i]==transType)
        {
            return i;
        }
    }
    return 0;
}
function viewBackFromOther() {
    gCorp.isBack = true;
    backView = true;

}
function initQuery(){
    angular.module('EbankApp').controller('query-transfer', function ($scope, requestMBServiceCorp){
        $scope.page = 'page_';
        $scope.statusVN = {"ABH" : "Đã duyệt", "INT": "Chờ duyệt", "REJ": "Từ chối", "CAN": "Hủy giao dịch", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công", "CAC": "Hủy giao dịch", "STH" : "Đang xử lý",
            "HBH" : "Hồ sơ đã được tiếp nhận", "REH" : "Hoàn chứng từ", "IBS" : "Chờ duyệt bổ sung chứng từ", "APS" : "Duyệt một phần BS chứng từ",
            "RES" : "Từ chối BS chứng từ", "RBS" : "Duyệt BS CTừ  không thành công", "SBS" : "Đang xử lý BS chứng từ", "RJS" : "TPBank từ chối BS chứng từ","RSA":"TPBank từ chối"};

        function addEventListenerToCombobox(selectHandle, closeHandle) {
            document.addEventListener("evtSelectionDialog", selectHandle, false);
            document.addEventListener("evtSelectionDialogClose", closeHandle, false);
        }

        function removeEventListenerToCombobox(selectHandle, closeHandle) {
            document.removeEventListener("evtSelectionDialog", selectHandle, false);
            document.removeEventListener("evtSelectionDialogClose", closeHandle, false);
        }

        // gui thong tin tim kiem
        function sendJSONRequest(request){
            var jsonData = new Object();
            jsonData.sequenceId = "1";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.userId = gCustomerNo;

            jsonData.transTypeId = request.transTypeId;
            gTrans.transTypeId = request.transTypeId;

            jsonData.transStatus = request.transStatus;
            gTrans.transStatus = request.transStatus;

            jsonData.maker = request.maker;
            gTrans.transMaker = request.maker;

            jsonData.dateBegin = request.dateBegin;
            gTrans.transDateBegin = request.dateBegin;


            jsonData.dateEnd = request.dateEnd;
            gTrans.transDateEnd = request.dateEnd;

            jsonData.transDetailCode = gTrans.idfcatref;
            jsonData.pageId = gTrans.pageId;
            jsonData.pageSize = gTrans.pageSize;

            var args = new Array();
            args.push("1");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_QUERY_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data,true, requestMBServiceSuccess, function() {
                showAlertText(CONST_STR.get("CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA"));
            });
        }

        function requestMBServiceSuccess(response) {
            if (response.respCode == '0'){
                gTrans.listTrans = [];
                if (response.respJsonObj.length > 0) {
                    gTrans.listTrans = response.respJsonObj;
                    $scope.listTrans = gTrans.listTrans;
                    gTrans.totalPage = Math.ceil((gTrans.listTrans[0].TOTAL_ROW)/gTrans.pageSize);
                    $scope.arrPage = [];
                    for (var i = 1; i <= gTrans.totalPage; i++) {
                        $scope.arrPage.push(i);
                    }

                    setTimeout(function(){
                        displayPageCurent(gTrans.pageId);
                    },100)


                    if (gTrans.listTrans.length > 0) {
                        var result = document.getElementById('tblContent');
                        result.style.display = 'block';
                    }


                    document.getElementById('tblContent').style.display = 'block';
                    document.getElementById('pagination').style.display = 'block';
                    document.getElementById('trans.message').style.display = 'none';
                    if (gTrans.totalPage <= 1) {
                        document.getElementById('pagination').style.display = 'none';
                    }
                } else {
                    document.getElementById('tblContent').style.display = 'none';
                    document.getElementById('pagination').style.display = 'none';
                    document.getElementById('trans.message').style.display = 'block';
                    document.getElementById('span.message').innerHTML = CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST");
                }
            }else {
                showAlertText(response.respContent);
            }

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

        // chon loai giao dich
        $scope.showTransTypeSelection = function ()
        {
            var cbxValues = (gUserInfo.lang == 'EN') ? CONST_TRANS_TYPE_CONDITION_EN : CONST_TRANS_TYPE_CONDITION_VN;
            var cbxKeys = CONST_TRANS_TYPE_CONDITION_ID;


            addEventListenerToCombobox(handleSelectTransTypeInter, handleCloseTransTypeCbxInter);
            showDialogList(CONST_STR.get('COM_TYPE_TRANSACTION'), cbxValues, cbxKeys, false);
        }

        function handleSelectTransTypeInter(e) {
            removeEventListenerToCombobox(handleSelectTransTypeInter, handleCloseTransTypeCbxInter);
            gTrans.query.request.transTypeId = e.selectedValue2;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                document.getElementById('trans.type').value = e.selectedValue1;
            }else{
                document.getElementById('trans.typemb').value = e.selectedValue1;
            }
            bottomBar.hide();
        }

        function handleCloseTransTypeCbxInter() {
            removeEventListenerToCombobox(handleSelectTransTypeInter, handleCloseTransTypeCbxInter);
            bottomBar.hide();
        }

        // chon trang thai
        $scope.showTransStatusSelection = function () {
            var cbxValues = (gUserInfo.lang == 'EN') ? CONST_TRANS_LIST_STATUS_EN : CONST_TRANS_LIST_STATUS_VN;
            addEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
            showDialogList(CONST_STR.get('TRANS_STATUS'), cbxValues, CONST_TRANS_LIST_STATUS, false);
        }

        function handleSelectdTransStatusInter(e) {
            removeEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
            gTrans.query.request.transStatus = e.selectedValue2;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                document.getElementById("trans.status").value = e.selectedValue1;
            }else{
                document.getElementById("trans.statusmb").value = e.selectedValue1;
            }
        }

        function handleCloseTransStatusCbxInter(e) {
            removeEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
        }

        // chon nguoi lap
        $scope.initData = function() {
            var jsonData = {};
            jsonData.sequenceId = "4";
            jsonData.idtxn = gTrans.idtxn;

            var args = new Array();
            args.push("1");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_QUERY_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data,true, function (response) {
                gTrans.listMakers = response.respJsonObj;
            });
        }
        $scope.initData(); 
        
        $scope.getListMaker = function (){
            var cbxText = [];
            var cbxValues = [];
            cbxText.push(CONST_STR.get("COM_ALL"));
            cbxValues.push("");
            for (var i in gTrans.listMakers) {
                var userId = gTrans.listMakers[i].IDUSER;
                cbxText.push(userId);
                cbxValues.push(userId);
            }
            addEventListenerToCombobox(handleSelectMakerInter, handleCloseMakerCbxInter);
            showDialogList(CONST_STR.get('COM_MAKE_TRANS'), cbxText, cbxValues, false);
        }

        function handleSelectMakerInter(e){
            removeEventListenerToCombobox(handleSelectMakerInter, handleCloseMakerCbxInter);
            gTrans.query.request.maker = e.selectedValue2;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                document.getElementById('trans.maker').value = e.selectedValue1;
            }else{
                document.getElementById('trans.makermb').value = e.selectedValue1;
            }
        }
        function handleCloseMakerCbxInter(){
            removeEventListenerToCombobox(handleSelectMakerInter, handleCloseMakerCbxInter);
        }

        // tim kiem
        $scope.searchTransfer = function(){
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                gTrans.query.request.dateBegin = document.getElementById("trans.begindate").value;
                gTrans.query.request.dateEnd = document.getElementById("trans.enddate").value;
            }else{
                gTrans.query.request.dateBegin = document.getElementById("trans.begindatemb").value;
                gTrans.query.request.dateEnd = document.getElementById("trans.enddatemb").value;
            }

            var currentDate = new Date();
            var strCurrentDate = ('0' + (currentDate.getDate())) + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
            var sd = changeStringToArrayDate(gTrans.query.request.dateBegin);
            var ed = changeStringToArrayDate(gTrans.query.request.dateEnd);
            var numOfDays = (ed[0].getTime() - sd[0].getTime())/86400000;

            if(gTrans.query.request.dateBegin === 'dd/mm/yyyy'){
                gTrans.query.request.dateBegin = '';
            }
            if(gTrans.query.request.dateEnd === 'dd/mm/yyyy'){
                gTrans.query.request.dateEnd = '';
            }
            if(!this.calculateDifferentMonth(gTrans.query.request.dateBegin,strCurrentDate)){
                showAlertText(formatString(CONST_STR.get("GUA_NOT_GREATER_TODAY"), [CONST_STR.get("COM_FROM")]));
                return false;
            }
            if (!this.calculateDifferentMonth(gTrans.query.request.dateEnd, strCurrentDate)) {
                showAlertText(formatString(CONST_STR.get("GUA_NOT_GREATER_TODAY"), [CONST_STR.get("COM_TO_DATE")]));
                return false;
            }
            if (!this.calculateDifferentMonth(gTrans.query.request.dateBegin,gTrans.query.request.dateEnd)) {
                showAlertText(CONST_STR.get("GUA_PERIODIC_END_DATE_LESS_TO_DATE"));
                return;
            }
            if (numOfDays>90) {
                showAlertText(CONST_STR.get("COM_QUERY_MUST_NOT_MORE_THAN_90"));
                return;
            }
            gTrans.pageIdx = 1;
            gTrans.tmpSearchInfo = JSON.parse(JSON.stringify(gTrans.query.request)); //Clone object
            sendJSONRequest(gTrans.query.request);
        }

        $scope.cacheValueSearch = function()
        {
            // gTrans.query.request.transTypeId = document.getElementById("trans.type").value;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                gTrans.query.request.transTypeId = document.getElementById("trans.type").value;
                gTrans.query.request.dateBegin = document.getElementById("trans.begindate").value;
                gTrans.query.request.dateEnd = document.getElementById("trans.enddate").value;
            }else{
                gTrans.query.request.transTypeId = document.getElementById("trans.typemb").value;
                gTrans.query.request.dateBegin = document.getElementById("trans.begindatemb").value;
                gTrans.query.request.dateEnd = document.getElementById("trans.enddatemb").value;
            }
        }

        // chi tiet giao dich
        $scope.showDetailTransaction = function (e) {
            gTrans.infoDetail =[];
            for(var i in gTrans.listTrans){
                if(e == gTrans.listTrans[i].IDFCATREF){
                    gTrans.infoDetail.push(gTrans.listTrans[i]);
                    break;
                }
            }
            var jsonData = {};
            jsonData.transId = gTrans.infoDetail.transId;
            jsonData.sequenceId = '2';
            jsonData.idtxn = 'T02';
            jsonData.userId = gCustomerNo;
            jsonData.transDetailCode= gTrans.listTrans[i].IDUSERREFERENCE;


            var args = new Array();
            args.push("2");
            args.push(jsonData);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_QUERY_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0'){
                    gTrans.infoDetail = response.respJsonObj[0];
                    $scope.infoTrans=gTrans.infoDetail;

                    gTrans.detailInfo = response.respJsonObj;
                    navCachedPages['transfer/query/transfer-detail'] = null;
                    navController.pushToView('transfer/query/transfer-detail',true,'html');
                }
            }, function (response) {

            });
        }

        $scope.changePage = function (idx) {
            document.getElementById('page_'+gTrans.pageId).className = '';
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                gTrans.query.request.dateBegin = document.getElementById("trans.begindate").value;
                gTrans.query.request.dateEnd = document.getElementById("trans.enddate").value;
            }else{
                gTrans.query.request.dateBegin = document.getElementById("trans.begindatemb").value;
                gTrans.query.request.dateEnd = document.getElementById("trans.enddatemb").value;
            }
            gTrans.pageId = idx;
            gTrans.tmpSearchInfo = JSON.parse(JSON.stringify(gTrans.query.request)); //Clone object
            sendJSONRequest(gTrans.query.request);
            displayPageCurent(idx);
        }
        if (backView) {
            $scope.searchTransfer();
            if (gTrans.query.request.transTypeId == 'T20') {
                if (gUserInfo.lang === 'VN') {
                    document.getElementById('trans.type').value = CONST_TRANS_TYPE_CONDITION_VN[4];
                } else {
                    document.getElementById('trans.type').value = CONST_TRANS_TYPE_CONDITION_EN[4];
                }
                 
            }else if(gTrans.query.request.transTypeId == 'T13'){
                if (gUserInfo.lang === 'VN') {
                    document.getElementById('trans.type').value = CONST_TRANS_TYPE_CONDITION_VN[1];
                } else {
                    document.getElementById('trans.type').value = CONST_TRANS_TYPE_CONDITION_EN[1];
                }
            }else if(gTrans.query.request.transTypeId == 'T19'){
                if (gUserInfo.lang === 'VN') {
                    document.getElementById('trans.type').value = CONST_TRANS_TYPE_CONDITION_VN[2];
                } else {
                    document.getElementById('trans.type').value = CONST_TRANS_TYPE_CONDITION_EN[2];
                }
            }
            else if(gTrans.query.request.transTypeId == 'T21'){
                if (gUserInfo.lang === 'VN') {
                    document.getElementById('trans.type').value = CONST_TRANS_TYPE_CONDITION_VN[3];
                } else {
                    document.getElementById('trans.type').value = CONST_TRANS_TYPE_CONDITION_EN[3];
                }
            }
        }
        $scope.searchTransfer();
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}
function  displayPageCurent(page) {
    var paging = document.getElementById("pagingTrans");
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
function  pagingItem(){
    return '<li ng-repeat="i in arrPage" ng-click="changePage(i)" id="{{page$index + 1}}"><span ng-bind="i"></span></li>';
}

function detailItem(){
    var str = '<tr class="recycler-row-title" ng-repeat="query in listTrans track by $index">'+
        '<td class="recycler-row-align-midle-left"><div ng-bind="query.RNUM"></div> </td>'+
        '<td class="recycler-row-align-midle"><div ng-bind="query.NGAY_LAP"></div></td>'+
        '<td class="recycler-row-align-midle"><div ng-bind="query.NUMAMOUNT"></div></td>'+
        '<td class="recycler-row-align-midle"><div ng-bind="query.NGUOI_NHAN"></div></td>'+
        '<td class="recycler-row-align-midle"><div ng-bind="query.TRANG_THAI"></div></td>'+
        '<td class="recycler-row-align-midle"><div ng-bind="query.NGUOI_DUYET"></div></td>'+
        '<td class="recycler-row-align-midle-right"><div>' +
        '<a ng-click="showDetailTransaction(query.IDFCATREF)" style="cursor:pointer;">'+
        '<span class="no-check" ng-bind="query.IDFCATREF"></span>'+
        '           </a>' +
        '</div></td>'+
        '</tr>';
    return str;
}
function  removeChild(object, appendObj) {
    while (object.firstChild) {
        object.removeChild(object.firstChild);
    }
    object.innerHTML =  object.innerHTML+appendObj;
}

//send du lieu len de xuat file excel
function sendRequestExportExcel() {
    var arrayClientInfo = new Array();
    arrayClientInfo.push(null);
    arrayClientInfo.push({
        sequenceId : "1",
        transType : gTrans.transTypeId,
        transStatus : gTrans.transStatus,
        transMaker : gTrans.transMaker,
        transDateBegin : gTrans.transDateBegin,
        transDateEnd : gTrans.transDateEnd,
    });

    var gprsCmd = new GprsCmdObj(CONSTANTS.get('COM_TRANSFER_EXPORT_EXCEL_REPORT'), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

    data = getDataFromGprsCmd(gprsCmd);

    corpExportExcel(data);
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