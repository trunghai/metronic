
gTrans.idtxn = "B04";
gTrans.request={};
gTrans.detail={};
gTrans.pageId = 1;
gTrans.pageSize= 10;
var viewBack = false;
var pFromDate;
var pToDate;
function viewBackFromOther(){
    viewBack = true;
}
function viewDidLoadSuccess(){
    resizeMainViewContent(currentPage);
    if(!gCorp.isBack){
        var result = document.getElementById('manaLC.searchResult');
        result.style.display = 'none';

        gTrans.pageIdx = 1;
        gTrans.tmpSearchInfo = {};
        gTrans.request = {
            userId: gCustomerNo,
            transType:"",
            transStatus: "",
            transId: "",
            dateBegin: "",
            dateEnd: "",
            pageId: 1,
            pageSize: 5
        }
        setUpCalendar();
    }
    initLC();

}
function initLC(){
    angular.module("EbankApp").controller("request-release-LC-mng", function ($scope, requestMBServiceCorp) {
        $scope.showElement = true;
        if(gUserInfo.userRole.indexOf('CorpInput') == -1 ||CONST_DESKTOP_MODE && checkScreenisMobilePX()){
                $scope.showElement =false;
        }
        $scope.changeTab = function () {
            navCachedPages['international_payments/request_release_LC/request-release-LC'] = null;
            navController.popView(true);
        }
        $scope.formatNumberToCurrency = function(amount) {
            var tmpAmount = amount;
            if (typeof(amount) == 'string') {
                //var tmpAmountStr = amount.replace(/\,/g,'');
                var tmpAmountStr = removeSpecialChar(tmpAmount);
                tmpAmount = parseInt(tmpAmountStr);
            }
            places = 0; //phan thap phan
            symbol = "";//" VND";
            thousand = ",";
            decimal = ".";
            var number = this,
                negative = tmpAmount < 0 ? "-" : "",
                i = parseInt(tmpAmount = Math.abs(+tmpAmount || 0).toFixed(places), 10) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
            return negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(tmpAmount - i).toFixed(places).slice(2) : "" + symbol);
            //return (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(tmpAmount - i).toFixed(places).slice(2) : "" + symbol);
        }
        if((gTrans.listTrans != undefined) && (viewBack == true)){
            document.getElementById('manaLC.searchResult').style.display = "";
            $scope.listTrans = gTrans.listTrans;
            document.getElementById('id.pay-type').value = gTrans.pTypeTrans;
            document.getElementById('id.pay-type-dtl').value = gTrans.pStatusTrans;


            document.getElementById("trans.debtStartdate").value = pFromDate;
            document.getElementById("trans.debtEnddate").value = pToDate;
        }else{
            document.getElementById('manaLC.searchResult').style.display = "none";
        }
        function addEventListenerToCombobox(selectHandle, closeHandle) {
            document.addEventListener("evtSelectionDialog", selectHandle, false);
            document.addEventListener("evtSelectionDialogClose", closeHandle, false);
        }

        function removeEventListenerToCombobox(selectHandle, closeHandle) {
            document.removeEventListener("evtSelectionDialog", selectHandle, false);
            document.removeEventListener("evtSelectionDialogClose", closeHandle, false);
        }

        // chon loai giao dich
        $scope.showTransTypeSelection = function(){
            var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_TYPE_SUGGEST_INTERNATIONAL_EN : CONST_TYPE_SUGGEST_INTERNATIONAL_VN;
            var tmpArray2 = CONST_TYPE_SUGGEST_INTERNATIONAL_VALUE;
            addEventListenerToCombobox(handleSelectdTransType, handleCloseTransType);
            showDialogList(CONST_STR.get('COM_CHOOSEN_TYPE_TRANS'), tmpArray1, tmpArray2, false);
        }
        function handleSelectdTransType(e) {
            removeEventListenerToCombobox(handleSelectdTransType, handleCloseTransType);
            if(e.selectedValue2 == 'ALL'){
                gTrans.request.transType = '';
            }else{
                gTrans.request.transType = e.selectedValue2;
            }
            pTypeTrans = gTrans.request.transType;
            document.getElementById("id.pay-type").value = e.selectedValue1;
        }
        function handleCloseTransType() {
            removeEventListenerToCombobox(handleSelectdTransType, handleCloseTransType);
        }

        // chon trang thai
        $scope.showStatusTypeSelection = function(){
            var cbxValues = (gUserInfo.lang == 'EN') ? CONST_TYPE_APPROVAL_INTERNATIONAL_EN : CONST_TYPE_APPROVAL_INTERNATIONAL_VN;
            addEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
            showDialogList(CONST_STR.get('COM_CHOOSE_STATUS'), cbxValues, CONST_TYPE_APPROVAL_INTERNATIONAL_LIST_STATUS, false);
        }
        function handleSelectdTransStatusInter(e) {
            removeEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
            if(e.selectedValue2 == 'ALL'){
                gTrans.request.transStatus = '';
            }else{
                gTrans.request.transStatus = e.selectedValue2;
            }
            pStatusTrans = gTrans.request.transStatus;
            document.getElementById("id.pay-type-dtl").value = e.selectedValue1;
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
        $scope.searchTransactionLC = function(){
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                gTrans.request.dateBegin = document.getElementById("trans.debtStartdate").value;
                gTrans.request.dateEnd = document.getElementById("trans.debtEnddate").value;
            }else{
                gTrans.request.dateBegin = document.getElementById("trans.debtStartdate").value;
                gTrans.request.dateEnd = document.getElementById("trans.debtEnddate").value;
            }
            pFromDate = gTrans.request.dateBegin;
            pToDate = gTrans.request.dateEnd;
            var currentDate = new Date();
            var strCurrentDate = ('0' + (currentDate.getDate())) + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
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
            gTrans.tmpSearchInfo = JSON.parse(JSON.stringify(gTrans.request));
            sendJSONRequest(gTrans.request);
        }

        // gui thong tin tim kiem
        function sendJSONRequest(request){
            gTrans.pTypeTrans = document.getElementById('id.pay-type').value;
            gTrans.pStatusTrans = document.getElementById('id.pay-type-dtl').value;
            var jsonData = new Object();
            jsonData.sequence_id = "2";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.userId = gCustomerNo;
            if(request.transType == 1){
                jsonData.TRAN_TYPE = "P";
            }else if(request.transType == 2){
                jsonData.TRAN_TYPE = "T";
            }else{
                jsonData.TRAN_TYPE = "";
            }
            jsonData.status = request.transStatus;
            jsonData.FROM_DATE = request.dateBegin;
            jsonData.TO_DATE = request.dateEnd;
            jsonData.pageId = gTrans.pageId;
            jsonData.pageSize = gTrans.pageSize;

            var args = new Array();
            args.push("2");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_LC"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
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
                    $scope.lc = formatNumberToCurrency(gTrans.listTrans.SO_TIEN_LC);
                    gTrans.totalPage = gTrans.listTrans[0].TOTAL_PAGE;
                    $scope.arrPage = [];
                    for (var i = 1; i <= gTrans.totalPage; i++) {
                        $scope.arrPage.push(i);
                    }
                    setTimeout(function(){
                        displayPageCurent(gTrans.pageId);
                    },100)
                    if (gTrans.listTrans.length > 0) {
                        var result = document.getElementById('manaLC.searchResult');
                        result.style.display = 'block';
                    }
                    document.getElementById('manaLC.searchResult').style.display = 'block';
                    document.getElementById('lc-pagination').style.display = 'block';
                    document.getElementById('id.message').style.display = 'none';
                    if (gTrans.totalPage <= 1) {
                        document.getElementById('lc-pagination').style.display = 'none';
                    }
                }else{
                    document.getElementById('manaLC.searchResult').style.display = 'none';
                    document.getElementById('lc-pagination').style.display = 'none';
                    document.getElementById('id.message').style.display = 'block';
                    document.getElementById('id.message.value').innerHTML = CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST");
                }
            }else{
                showAlertText(response.respContent);
            }
        }

        $scope.statusVN = {"ABH" : "Hoàn thành", "INT": "Chờ duyệt", "REJ": "Từ chối", "CAN": "Hủy giao dịch", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công", "CAC": "Hủy giao dịch", "STH" : "Đang xử lý",
            "HBH" : "Hồ sơ đã được tiếp nhận", "REH" : "Hoàn chứng từ", "IBS" : "Chờ duyệt bổ sung chứng từ", "APS" : "Duyệt một phần BS chứng từ",
            "RES" : "Từ chối BS chứng từ", "RBS" : "Duyệt BS CTừ  không thành công", "SBS" : "Đang xử lý BS chứng từ", "RJS" : "TPBank từ chối BS chứng từ","RSA":"TPBank từ chối"};
        $scope.typeTrans = {"P" : "Đề nghị phát hành", "T" : "Đề nghị tu chỉnh"};

        $scope.changePage = function (idx) {
            document.getElementById('page_'+gTrans.pageId).className = '';
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                gTrans.request.dateBegin = document.getElementById("trans.debtStartdate").value;
                gTrans.request.dateEnd = document.getElementById("trans.debtEnddate").value;
            }else{
                gTrans.request.dateBegin = document.getElementById("trans.debtStartdate").value;
                gTrans.request.dateEnd = document.getElementById("trans.debtEnddate").value;
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
//            gTrans.pTypeTrans = document.getElementById('id.pay-type').value;
//            gTrans.pStatusTrans = document.getElementById('id.pay-type-dtl').value;
            var json = {};
            json.transIds = gTrans.detail.transId;
            json.sequence_id = '3';
            json.idtxn = 'B04';

            var args = new Array();
            args.push("3");
            args.push(json);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_LC"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0'){
                    gTrans.detail = response.respJsonObj.info_trans[0];
                    gTrans.fileInfo = response.respJsonObj.lst_valquery;
                    gTrans.detail.giaTriLC = formatNumberToCurrency(gTrans.detail.SO_TIEN_LC);
                    gTrans.detail.giaTriLCThayDoi = formatNumberToCurrency(gTrans.detail.GIA_TRI_LC_SAU_SUA_DOI);
                    gTrans.detail.giaTriLCTang = formatNumberToCurrency(gTrans.detail.GIA_TRI_LC_TANG_THEM);
                    gTrans.detail.tyGia = formatNumberToCurrency(gTrans.detail.TY_GIA);
                    gTrans.detail.kiquy =  formatNumberToCurrency(gTrans.detail.SO_TIEN_KY_QUY);
                    gTrans.detail.phi = formatNumberToCurrency(gTrans.detail.SO_TIEN_PHI);

                    navCachedPages['international_payments/request_release_LC/manager_LC/request-release-LC-detail'] = null;
                    navController.pushToView("international_payments/request_release_LC/manager_LC/request-release-LC-detail", true,'html');
                }else{
                    showAlertText(response.respContent);
                }
            });
        }
        $scope.searchTransactionLC();
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
                    document.getElementById('trans.debtStartdate').value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
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
                    document.getElementById('trans.debtEnddate').value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
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
                    document.getElementById('id.begindate').value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
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
                    document.getElementById('id.enddate').value = HumanDate.human(data, 'd/m/Y'); //node nhan gia tri
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