/**
 * Created by HaiDT1 on 9/21/2016.
 */
gCorp.isBack = false;
gTrans.idtxn = 'B02';
gTrans.pageSize = 10;
gTrans.pageIdx = 1;
gTrans.detail = {};
gTrans.totalPage;
gTrans.searchInfo = {
    transType: "",
    maker: "",
    status: "",
    transId: "",
    fromDate: "",
    endDate: "",
    fromDatemb: "",
    endDatemb: ""
};

function viewBackFromOther() {
    gCorp.isBack = true;
}
function viewDidLoadSuccess() {

    if (!gCorp.isBack) {
        var result = document.getElementById('id.searchResult');
        result.style.display = 'none';
        gTrans.pageIdx = 1;
        gTrans.tmpSearchInfo = {};
        gTrans.searchInfo = {
            transType: "",
            transTypeName : "Tất cả",
            maker: "",
            status: "",
            transId: "",
            fromDate: "",
            endDate: ""
        };
        // xoa vi lien quan toi cache va angular
        if(gUserInfo.userRole.indexOf('CorpInput') == -1 || CONST_BROWSER_MODE == false) {
            var paging = document.getElementById("paging");
            var tbodyDetail = document.getElementById("tbodyDetail");

            removeChild(paging,pagingItem());
            removeChild(tbodyDetail,detailItem());

        }

    }
    init();

}

function init(){
    angular.module('EbankApp').controller('manager_guarantee', function ($scope, requestMBServiceCorp){
         // createDatePicker('fromDate', 'span.begindate');
        // createDatePicker('toDate', 'span.enddate');
        // document.getElementById('id.message').style.display = 'none';

        $scope.statusVN = {"ABH" : "Đã duyệt", "INT": "Chờ duyệt", "REJ": "Từ chối", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công", "CAC": "Hủy giao dịch", "STH" : "Đang xử lý",
            "HBH" : "Hồ sơ đã được tiếp nhận", "REH" : "Hoàn chứng từ", "IBS" : "Chờ duyệt bổ sung chứng từ", "APS" : "Duyệt một phần BS chứng từ", "APS" : "Duyệt một phần BS chứng từ",
            "RES" : "Từ chối BS chứng từ", "RBS" : "Duyệt BS CTừ  không thành công", "SBS" : "Đang xử lý BS chứng từ", "RJS" : "TPBank từ chối BS chứng từ"};

        if (!gCorp.isBack){
            initData();
        }else {
            $scope.currentListTrans = gTrans.currentListTrans;
            gTrans.totalPage = gTrans.currentListTrans[0].TOTAL_PAGE;
            setValueAfterBack ();
        }

        function init() {
            var jsonData = {};
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;

            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_PAYMNET_INTERNATIONAL"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true,function (response) {
                gTrans.listMakers = response.respJsonObj.listMakers;

            });
        }
        $scope.showElement = true;
        if(gUserInfo.userRole.indexOf('CorpInput') == -1 || CONST_BROWSER_MODE == false) {
            $scope.showElement =false;
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
        function  setValueAfterBack (){
            var tmpSearchInfo = gTrans.tmpSearchInfo;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                document.getElementById("fromDate").value = tmpSearchInfo.fromDate;
                document.getElementById("toDate").value = tmpSearchInfo.endDate;
                document.getElementById("id.trans-type").value = guaranteeType(tmpSearchInfo.transType);
                document.getElementById("id.status").value = status(tmpSearchInfo.status);
                document.getElementById("id.trans.code").value = tmpSearchInfo.transCode;
            }else{
                document.getElementById("fromDatemb").value = tmpSearchInfo.fromDate;
                document.getElementById("toDatemb").value = tmpSearchInfo.endDate;
                document.getElementById("id.trans-typemb").value = guaranteeType(tmpSearchInfo.transType);
                document.getElementById("id.statusmb").value = status(tmpSearchInfo.status);
                document.getElementById("id.trans.codemb").value = tmpSearchInfo.transCode;
            }
            if(tmpSearchInfo.maker !="")
                if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                    document.getElementById("id.maker").value = tmpSearchInfo.maker;
                }else{
                    document.getElementById("id.makermb").value = tmpSearchInfo.maker;
                }
            gTrans.searchInfo = tmpSearchInfo;
        }

        function guaranteeType(guaranteeType) {
            var guaranteeTypeOfLanguage=[];
            var keyTypes =CONST_MNG_GUARANTEE_TYPE_VALUE_KEY;
            if (gUserInfo.lang === 'VN') {
                guaranteeTypeOfLanguage = CONST_MNG_GUARANTEE_TYPE_VALUE_VN;
            } else {
                guaranteeTypeOfLanguage = CONST_MNG_GUARANTEE_TYPE_VALUE_EN;
            }
            var index =this.getIndexArr(guaranteeType,keyTypes);
            return guaranteeTypeOfLanguage[index];
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

        function viewBackFromOther() {
            gCorp.isBack = true;
        }
        //--4. Gửi thông tin tìm kiếm
        function sendJSONRequest(searchInfo){
            // document.getElementById('id.searchResult').innerHTML = "";
            // document.getElementById('pageIndicatorNums').innerHTML = "";

            var jsonData = new Object();
            jsonData.sequence_id = "2";
            jsonData.idtxn = gTrans.idtxn;

            jsonData.transType = searchInfo.transType;
            jsonData.status = searchInfo.status;
            jsonData.maker = searchInfo.maker;
            jsonData.transCode = searchInfo.transCode;
            jsonData.fromDate = searchInfo.fromDate;
            jsonData.endDate = searchInfo.endDate;

            jsonData.pageSize = gTrans.pageSize;
            jsonData.pageId = gTrans.pageIdx;

            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_MANAGER_GUARANTEE'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true, requestMBServiceSuccess, function() {
                showAlertText(CONST_STR.get("CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA"));
            });


        }

        function requestMBServiceSuccess(response) {
            if (response.respCode == '0'){
                gTrans.currentListTrans = [];
                if (response.respJsonObj.length > 0) {
                    gTrans.currentListTrans = response.respJsonObj;
                    $scope.currentListTrans = gTrans.currentListTrans;
                    gTrans.totalPage = gTrans.currentListTrans[0].TOTAL_PAGE;
                    $scope.arrPage = [];
                    for (var i = 1; i <= gTrans.totalPage; i++) {
                        $scope.arrPage.push(i);
                    }

                    if (gTrans.currentListTrans.length > 0) {
                        var result = document.getElementById('id.searchResult');
                        result.style.display = 'block';
                    }

                    if (gTrans.totalPage <= 1) {
                        document.getElementById('acc-pagination').style.display = 'none';
                    }else{
                        document.getElementById('acc-pagination').style.display = 'block';
                    }
                    document.getElementById('id.searchResult').style.display = 'block';
                    document.getElementById('id.message').style.display = 'none';
                    setTimeout(function () {
                        if (gTrans.pageIdx === 1) {
                            displayPageCurent(1);
                            /* document.getElementById(gTrans.pageIdx).className = 'active';*/
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

        $scope.showDetailTransaction = function (transId, status) {
            gTrans.detail.transId = transId;
            gTrans.detail.status = status;

            var jsonData = {};
            jsonData.transIds = gTrans.detail.transId;
            jsonData.sequence_id = '3';
            jsonData.idtxn = 'B02';

            var args = new Array();
            args.push(null);
            args.push(jsonData);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_GUARANTEE"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0'){
                    gTrans.detail = response.respJsonObj.info_trans[0];
                    gTrans.detail.sendNoteToUser =CONST_STR.get("COM_NOTIFY_"+gTrans.detail.SENDMETHOD);
                    gTrans.detail.AMOUNT =  formatNumberToCurrency(gTrans.detail.AMOUNT) + ' VND';
                    gTrans.detail.checklistProfile = response.respJsonObj.lst_valquery;
                    if(response.respJsonObj.info_excel.length > 0){
                        gTrans.detail.idFile = response.respJsonObj.info_excel[0].IDFILE;
                    }else{
                        gTrans.detail.idFile = '';
                    }


                    navCachedPages['credit/manager_guarantee/manager_guarantee_detail'] = null;
                    navController.pushToView("credit/manager_guarantee/manager_guarantee_detail", true,'html');
                }else {
                    showAlertText(response.respContent)
                }
            }, function (response) {

            });
        }

        $scope.changeTab = function () {
            navCachedPages['credit/create/guarantee/create/cre_guarantee_create'] = null;
            navController.popView(true);
        }

        $scope.changePage = function (idx) {

            document.getElementById(gTrans.pageIdx).className = '';

            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                gTrans.searchInfo.fromDate = document.getElementById("fromDate").value;
                gTrans.searchInfo.endDate = document.getElementById("toDate").value;
            }else{
                gTrans.searchInfo.fromDate = document.getElementById("fromDatemb").value;
                gTrans.searchInfo.endDate = document.getElementById("toDatemb").value;
            }
            gTrans.pageIdx = idx;
            /*document.getElementById(gTrans.pageIdx).className = 'active';*/

            gTrans.tmpSearchInfo = JSON.parse(JSON.stringify(gTrans.searchInfo)); //Clone object
            sendJSONRequest(gTrans.searchInfo);

            displayPageCurent(idx);
        }


        function initData() {
            var jsonData = {};
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;

            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_GUARANTEE"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0'){
                    gTrans.listMakers = response.respJsonObj.listMakers;
                }
            });
        }

         //--1. Xử lý chọn loại giao dịch
        $scope.showTransTypeSelection = function ()
        {
            var cbxValues = (gUserInfo.lang == 'EN')? CONST_MNG_GUARANTEE_TYPE_VALUE_EN : CONST_MNG_GUARANTEE_TYPE_VALUE_VN;
            var cbxKeys = CONST_MNG_GUARANTEE_TYPE_VALUE_KEY;


            addEventListenerToCombobox(handleSelectTransTypeInter, handleCloseTransTypeCbxInter);
            showDialogList(CONST_STR.get('COM_CHOOSEN_TYPE_TRANS'), cbxValues, cbxKeys, false);
        }

        function handleSelectTransTypeInter(e) {
            removeEventListenerToCombobox(handleSelectTransTypeInter, handleCloseTransTypeCbxInter);
            gTrans.searchInfo.transType = e.selectedValue2;
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
            var cbxValues = (gUserInfo.lang == 'EN')? CONST_GUARANTEE_QUERY_TYPE_STATUS_EN: CONST_GUARANTEE_QUERY_TYPE_STATUS_VN;
            addEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
            showDialogList(CONST_STR.get('COM_CHOOSE_STATUS'), cbxValues, CONST_GUARANTEE_QUERY_TYPE_STATUS_VALUE, false);
        }

        function handleSelectdTransStatusInter(e) {
            removeEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
            gTrans.searchInfo.status = e.selectedValue2;
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
            for (var i in gTrans.listMakers) {
                var userId = gTrans.listMakers[i].IDUSER;
                cbxText.push(userId);
                cbxValues.push(userId);
            }
            addEventListenerToCombobox(handleSelectMakerInter, handleCloseMakerCbxInter);
            showDialogList(CONST_STR.get('COM_CHOOSE_MAKER'), cbxText, cbxValues, false);
        }

        function handleSelectMakerInter(e){
            removeEventListenerToCombobox(handleSelectMakerInter, handleCloseMakerCbxInter);
            gTrans.searchInfo.maker = e.selectedValue2;
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
                gTrans.searchInfo.fromDate = document.getElementById("fromDate").value;
                gTrans.searchInfo.endDate = document.getElementById("toDate").value;
                gTrans.searchInfo.transCode = document.getElementById("id.trans.code").value;
            }else{
                gTrans.searchInfo.fromDate = document.getElementById("fromDatemb").value;
                gTrans.searchInfo.endDate = document.getElementById("toDatemb").value;
                gTrans.searchInfo.transCode = document.getElementById("id.trans.codemb").value;
            }

            var currentDate = new Date();
            var strCurrentDate = ('0' + (currentDate.getDate())) + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();

            if (gTrans.searchInfo.fromDate === 'dd/mm/yyyy'){
                gTrans.searchInfo.fromDate = '';
            }

            if (gTrans.searchInfo.endDate === 'dd/mm/yyyy'){
                gTrans.searchInfo.endDate = '';
            }
            if (!this.calculateDifferentMonth(gTrans.searchInfo.fromDate,strCurrentDate)) {
                showAlertText(formatString(CONST_STR.get("GUA_NOT_GREATER_TODAY"), [CONST_STR.get("COM_FROM")]));
                return false;
            }

            if (!this.calculateDifferentMonth(gTrans.searchInfo.endDate, strCurrentDate)) {
                showAlertText(formatString(CONST_STR.get("GUA_NOT_GREATER_TODAY"), [CONST_STR.get("COM_TO_DATE")]));
                return false;
            }

            if (!this.calculateDifferentMonth( gTrans.searchInfo.fromDate ,gTrans.searchInfo.endDate )) {
                showAlertText(CONST_STR.get("GUA_PERIODIC_END_DATE_LESS_TO_DATE"));
                return;
            }


            gTrans.pageIdx = 1;
            gTrans.tmpSearchInfo = gTrans.searchInfo; //Clone object
            sendJSONRequest(gTrans.searchInfo);
        }

        $scope.searchTransaction();
        //  if (!gCorp.isBack){
        //     init();
        // }else {
        //     $scope.currentListTrans = gTrans.currentListTrans;
        //     gTrans.totalPage = gTrans.currentListTrans[0].TOTAL_PAGE;
        // }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])

}


function  removeChild(object, appendObj) {
    while (object.firstChild) {
        object.removeChild(object.firstChild);
    }
    object.innerHTML =  object.innerHTML+appendObj;
}

function  detailItem() {
    var str  =' <tr ng-repeat="trans in currentListTrans track by $index" class="recycler-row-title recycler-list">'+
                    '<td class="recycler-row-align-midle">'+
                        '<div style="word-break: break-all;">{{$index + 1}}</div>'+
                    '</td>'+
                    '<td class="recycler-row-align-midle">'+
                        '<div style="white-space: pre-wrap;" ng-bind="trans.NGAY_LAP"></div>'+
                    '</td>'+
                    '<td class="recycler-row-align-midle">'+
                        '<div>{{trans.SO_LUONG | currency : "" : 0}}{{'+"'" + " '"+'+ trans.LOAI_TIEN}} VND</div>'+
                    '</td>'+
                    '<td class="recycler-row-align-midle-left">'+
                        '<div style="white-space: pre-wrap;" ng-bind="trans.GUARANTEE_NAME"></div>'+
                    '</td>'+
                    '<td class="recycler-row-align-midle">'+
                        '<div>{{statusVN[trans.TRANG_THAI]}}</div>'+
                    '</td>'+
                    '<td class="recycler-row-align-midle-left">'+
                        '<div ng-bind="trans.NGUOI_DUYET"></div>'+
                    '</td>'+
                    '<td class="recycler-row-align-midle-left">'+
                        '<div>'+
                        '<a ng-click="showDetailTransaction(trans.MA_GD, trans.TRANG_THAI);" style="cursor:pointer;">'+
                        '<span class="no-check" ng-bind="trans.MA_GD"></span>'+
                        '</a>'+
                        '</div>'+
                    '</td>'+
                '</tr>';
    return str;
}

function  pagingItem()
{
    return '<li ng-repeat="i in arrPage" ng-click="changePage(i)" id="{{$index + 1}}"><span ng-bind="i"></span></li>';
}

function  detailItem() {
    var str  =' <tr ng-repeat="trans in currentListTrans track by $index" class="recycler-row-title recycler-list">'+
                    '<td class="recycler-row-align-midle">'+
                        '<div style="word-break: break-all;">{{$index + 1}}</div>'+
                    '</td>'+
                    '<td class="recycler-row-align-midle">'+
                        '<div style="white-space: pre-wrap;" ng-bind="trans.NGAY_LAP"></div>'+
                    '</td>'+
                    '<td class="recycler-row-align-midle">'+
                        '<div>{{trans.SO_LUONG | currency : "" : 0}}{{'+"'" + " '"+'+ trans.LOAI_TIEN}} VND</div>'+
                    '</td>'+
                    '<td class="recycler-row-align-midle-left">'+
                        '<div style="white-space: pre-wrap;" ng-bind="trans.GUARANTEE_NAME"></div>'+
                    '</td>'+
                    '<td class="recycler-row-align-midle">'+
                        '<div>{{statusVN[trans.TRANG_THAI]}}</div>'+
                    '</td>'+
                    '<td class="recycler-row-align-midle-left">'+
                        '<div ng-bind="trans.NGUOI_DUYET"></div>'+
                    '</td>'+
                    '<td class="recycler-row-align-midle-left">'+
                        '<div>'+
                        '<a ng-click="showDetailTransaction(trans.MA_GD, trans.TRANG_THAI);" style="cursor:pointer;">'+
                        '<span class="no-check" ng-bind="trans.MA_GD"></span>'+
                        '</a>'+
                        '</div>'+
                    '</td>'+
                '</tr>';
    return str;
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
        document.getElementById('page_guarantee_' + page).className = 'active';
    }

}












