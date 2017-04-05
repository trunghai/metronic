/**
 * Created by HaiDT1 on 2/8/2017.
 */
/**
 * Created by HaiDT1 on 8/31/2016.
 */
//ng-include="'pages/authorize/request-release-LC/views/auth-request-release-LC-desktop.html'"
//ng-include="'pages/authorize/request-release-LC/views/auth-request-release-LC-mobile.html'"

gTrans.idtxn = 'B66';
gCorp.isBack = false;
gTrans.pageSize = 10;
gTrans.pageIdx = 1;

function viewBackFromOther() {
    gCorp.isBack = true;
}


function viewDidLoadSuccess() {
    setTitleBar(CONST_STR.get('AUTHORIZE_TRANS_TITLE_BAR_LC_RQ'));
    initData();
}

function initData() {
    angular.module('EbankApp').controller('auth-request-release-lc', function ($scope, requestMBServiceCorp) {
        clearCache = true;
        document.addEventListener('evtChangeWidthDesktop',reGenContent,false);
        document.addEventListener('evtChangeWidthMobile',reGenContent,false);


        // createDatePicker('id.begindate', 'span.begindate');
        // createDatePicker('id.enddate', 'span.enddate');
        reGenContent();

        init();
        function init() {
            if (!gCorp.isBack){
                gTrans.pageIdx = 1;
                gTrans.searchInfo = {
                    transType : CONST_INTERNATIONAL_MONEY_TRANS_TYPE_KEY[0],
                    maker : "",
                    status : "",
                    fromDate : "",
                    endDate : ""
                };
            }
            else
            {
                setValueAfterBack();
            }

        }

        function reGenContent() {
            if (!checkScreenisMobilePX()){
                (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "block" : '';
                (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "none" : '';
            }else{
                (document.getElementById('screenDesk') != null || document.getElementById('screenDesk') != undefined) ? document.getElementById('screenDesk').style.display = "none" : '';
                (document.getElementById('screenMobile') != null || document.getElementById('screenMobile') != undefined) ? document.getElementById('screenMobile').style.display = "block" : '';

            }

            setTimeout(function () {
                changeLanguageInView();
            }, 0);
        }

        function  setValueAfterBack (){
            var tmpSearchInfo =  gTrans.searchInfo;
            document.getElementById("id.status").value = status(tmpSearchInfo.status);
            document.getElementById("fromDate").value = tmpSearchInfo.fromDate;
            document.getElementById("toDate").value = tmpSearchInfo.endDate;
            if(tmpSearchInfo.maker !="")
                document.getElementById("id.maker").value = tmpSearchInfo.maker;
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

            if(gTrans.searchInfo.transType =="01"){
                var cbxValues = (gUserInfo.lang == 'VN')? CONST_INTERNATIONAL_TRANS_TYPE_01_STATUS_VN: CONST_INTERNATIONAL_TRANS_TYPE_01_STATUS_EN;
                addEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
                showDialogList(CONST_STR.get('COM_CHOOSE_STATUS'), cbxValues, CONST_INTERNATIONAL_TRANS_TYPE_01_STATUS_KEY, false);
            }
            else
            {
                var cbxValues = (gUserInfo.lang == 'VN')? CONST_INTERNATIONAL_TRANS_TYPE_02_STATUS_VN: CONST_INTERNATIONAL_TRANS_TYPE_02_STATUS_EN;
                addEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
                showDialogList(CONST_STR.get('COM_CHOOSE_STATUS'), cbxValues, CONST_INTERNATIONAL_TRANS_TYPE_02_STATUS_KEY, false);
            }
        }

        function handleSelectdTransStatus(e) {
            removeEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
            gTrans.searchInfo.status = e.selectedValue2;
            document.getElementById("id.status").value = e.selectedValue1;
        }

        function handleCloseTransStatusCbx(e) {
            removeEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
        }
        //--END 2

        //--3. chonj loai giao dich
        $scope.showTransType = function (){
            var cbxValues = (gUserInfo.lang == 'VN')? CONST_INTERNATIONAL_MONEY_TRANS_TYPE_VN: CONST_INTERNATIONAL_MONEY_TRANS_TYPE_EN;
            showDialogList(CONST_STR.get('COM_CHOOSEN_TYPE_TRANS'), cbxValues, CONST_INTERNATIONAL_MONEY_TRANS_TYPE_KEY, false);
            addEventListenerToCombobox(handleSelectdTransTypes, handleCloseTransTypes);
        }

        function handleSelectdTransTypes(e) {

            removeEventListenerToCombobox(handleSelectdTransTypes, handleCloseTransTypes);
            gTrans.searchInfo.transType = e.selectedValue2;
            document.getElementById("id.trans-type").value = e.selectedValue1;
        }

        function handleCloseTransTypes(e) {
            removeEventListenerToCombobox(handleSelectdTransStatus, handleCloseTransStatusCbx);
        }
        $scope.TransTypeChange = function () {
            alert("ok");
        }


        //--3. Xử lý chọn người lập
        $scope.showMakers = function (){
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

        function handleSelectMaker(e){
            removeEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
            gTrans.searchInfo.maker = e.selectedValue2;
            document.getElementById('id.maker').value = e.selectedValue1;
            document.getElementById('id.makerValue').value = e.selectedValue2;
        }
        function handleCloseMakerCbx(){
            removeEventListenerToCombobox(handleSelectMaker, handleCloseMakerCbx);
        }
//--END 3
        $scope.changePage = function (idx) {
            document.getElementById(gTrans.pageIdx).className = '';
            gTrans.searchInfo.fromDate = document.getElementById("fromDate").value;
            gTrans.searchInfo.endDate = document.getElementById("toDate").value;
            gTrans.pageIdx = idx;
            document.getElementById(gTrans.pageIdx).className = 'active';

            gTrans.tmpSearchInfo = JSON.parse(JSON.stringify(gTrans.searchInfo)); //Clone object
            sendJSONRequestSearch(gTrans.searchInfo);
        }
        // Thuc hien khi an nut tim kiem
        $scope.searchTransaction = function () {

            gTrans.searchInfo.fromDate = document.getElementById("fromDate").value;
            gTrans.searchInfo.endDate = document.getElementById("toDate").value;
            var currentDate = new Date();
            var strCurrentDate = ('0' + (currentDate.getDate())) + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();

            if (gTrans.searchInfo.fromDate === 'dd/mm/yyyy'){
                gTrans.searchInfo.fromDate = '';
            }

            if (gTrans.searchInfo.endDate === 'dd/mm/yyyy'){
                gTrans.searchInfo.endDate = '';
            }


            if (!this.calculateDifferentMonth( gTrans.searchInfo.fromDate,strCurrentDate)) {
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
            gTrans.tmpSearchInfo = JSON.parse(JSON.stringify(gTrans.searchInfo)); //Clone object
            sendJSONRequestSearch(gTrans.searchInfo);
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
        function sendJSONRequestSearch (searchInfo){
            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.status = searchInfo.status;
            jsonData.maker = searchInfo.maker;
            jsonData.fromDate = searchInfo.fromDate;
            jsonData.endDate = searchInfo.endDate;
            jsonData.pageSize = gTrans.pageSize;
            jsonData.pageId = gTrans.pageIdx;

            var	args = new Array();
            args.push("2");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_PAYMENT_LC_AUTHORIZE'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, requestMBServiceSuccess, function() {
                showAlertText(CONST_STR.get("CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA"));
            });
        }

        function requestMBServiceSuccess(response) {
            if (response.respCode == '0'){
                gTrans.makers = response.respJsonObj.makers;
                gTrans.listPending = response.respJsonObj.list_pending;
                if (gTrans.listPending.length > 0) {
                    $scope.listPending = gTrans.listPending;
                    gTrans.totalPage = gTrans.listPending[0].TOTAL_PAGE;

                    $scope.arrPage = [];
                    for (var i = 1; i <= gTrans.totalPage; i++) {
                        $scope.arrPage.push(i);
                    }

                    if (gTrans.listPending.length > 0) {
                        document.getElementById('id.message').style.display = 'none';
                        var result = document.getElementById('id.searchResult');
                        result.style.display = 'block';
                    }

                    if (gTrans.totalPage <= 1) {
                        document.getElementById('acc-pagination').style.display = 'none';
                    }

                    setTimeout(function () {
                        if (gTrans.pageIdx === 1) {
                            document.getElementById(gTrans.pageIdx).className = 'active';
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

        $scope.rejectTransaction = function () {
            var reason = document.getElementById("id.reason-rej").value;
            if (!reason) {
                showAlertText(CONST_STR.get("COM_CHECK_EMPTY_REJECT_REASON"));
                return;
            }

            var checkboxes = document.getElementsByClassName("trans.checkbox");
            var i;
            for (i = 0; i < checkboxes.length; i++){
                if (checkboxes[i].checked == true){
                    $scope.listSelectedTrans.push($scope.listPending[i]);
                }
            }

            if ($scope.listSelectedTrans.length == 0) {
                showAlertText(CONST_STR.get("COM_MUST_CHOOSE_TRANS"));
                return;
            }

            gTrans.authen = false;
            gTrans.reason = reason;
            gTrans.listSelectedTrans = $scope.listSelectedTrans;
            navCachedPages["authorize/international/auth_international_trans_view"] = null;
            navController.pushToView("authorize/international/auth_international_trans_view", true, 'html');

        }

        function requestDocument(id) {
            var jsonData = new Object();
            jsonData.sequence_id = "5";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.trans_id = id;

            var	args = new Array();
            args.push("");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_PAYMENT_LC_AUTHORIZE'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0'){
                    gTrans.transInfo.profile = response.respJsonObj.O_LIST;

                    navCachedPages['authorize/transfer/common-review/auth-once-trans-review'] = null;
                    navController.pushToView('authorize/transfer/common-review/auth-once-trans-review', true, 'html');
                }
            }, function() {
                showAlertText(CONST_STR.get("CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA"));
            });
        }

        $scope.showDetailTransaction = function (e) {

            gTrans.transInfo = e;

            if(gTrans.transInfo.TYPE_LC == 'T'){
                gTrans.scr = 'pages/authorize/request-release-LC/views/auth-request-edit-LC-review.html';
                gTrans.transInfo.methodFee = (gTrans.transInfo.CHARGEINCL == 'N') ? CONST_STR.get('REQUEST_RELEASE_LC_METHOD_FEE_N') : CONST_STR.get('REQUEST_RELEASE_LC_METHOD_FEE_Y');
            }else {
                gTrans.scr = 'pages/authorize/request-release-LC/views/auth-request-release-LC-review.html';
                gTrans.transInfo.methodFee = CONST_STR.get('REQUEST_RELEASE_LC_METHOD_FEE_N');
            }

            if(gTrans.transInfo.POSITIVE != null && gTrans.transInfo.NEGATIVE != null){
                gTrans.transInfo.POSITIVE_NEGATIVE = "POSITIVE/NEGATIVE: " + "+" + gTrans.transInfo.POSITIVE + "%" + "/-" + gTrans.transInfo.NEGATIVE + "%"
                gTrans.transInfo.POSITIVE_NEGATIVE_OLD = "POSITIVE/NEGATIVE: " + "+" + gTrans.transInfo.POSITIVE_OLD + "%" + "/-" + gTrans.transInfo.NEGATIVE_OLD + "%";
            }else {
                gTrans.transInfo.POSITIVE_NEGATIVE = "POSITIVE/NEGATIVE: " + "+" + "0%" + "/-" + "0%"
                gTrans.transInfo.POSITIVE_NEGATIVE_OLD = "POSITIVE/NEGATIVE: " + "+" + "0%" + "/-" + "0%";
            }



            gTrans.idtxn = 'B66';
            gTrans.sequence_id = '4';
            gTrans.cmdType = CONSTANTS.get('CMD_PAYMENT_LC_AUTHORIZE');

            gTrans.srcViewListPending = 'authorize/request-release-LC/auth-request-release-LC';



            requestDocument(gTrans.transInfo.MA_GD);

        }
    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}
function exportExcelDebtHistory() {
  var transIds = "";
  for (var i in listObj) {
    transIds += listObj[i].IDFCATREF + ",";
  }
  var arrayClientInfo = new Array();
  arrayClientInfo.push(null);
  arrayClientInfo.push({
    sequenceId: "1",
    transType: "A13",
    transIds: transIds
  });

  var gprsCmd = new GprsCmdObj(CONSTANTS.get('COM_EXPORT_EXCEL_REPORT'), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

  data = getDataFromGprsCmd(gprsCmd);

  corpExportExcel(data);
}