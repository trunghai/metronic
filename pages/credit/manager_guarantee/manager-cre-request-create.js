/**								
* Created by HAINM on 2/13/2017 *
**/

gCorp.isBack = false;
gTrans.idtxn = 'C03';
gTrans.pageSize = 10;
gTrans.pageIdx = 1;
gTrans.detail = {};
gTrans.totalPage;
gTrans.searchInfo = {
    status: "",
    transId: "",
    fromDate: "",
    endDate: "",
    fromDatemb: "",
    endDatemb: ""
};

function viewDidLoadSuccess() {
    if (!gCorp.isBack) {
        var result = document.getElementById('id.searchResult');
        result.style.display = 'none';
        gTrans.pageIdx = 1;
        gTrans.tmpSearchInfo = {};
        gTrans.searchInfo = {
            status: "",
            transId: "",
            fromDate: "",
            endDate: "",
            fromDatemb: "",
            endDatemb: ""
        };

        // xoa vi lien quan toi cache va angular
        // if(gUserInfo.userRole.indexOf('CorpInput') == -1 || CONST_BROWSER_MODE == false) {
        // var paging = document.getElementById("paging");
        // var tbodyDetail = document.getElementById("tbodyDetail");

        // removeChild(paging,pagingItem());
        // removeChild(tbodyDetail,detailItem());

        // }
    }
    else
    {
        setValueAfterBack();
    }
    init();
    setUpCalendar();

}
function  setValueAfterBack (){
    var tmpSearchInfo = gTrans.tmpSearchInfo;
    document.getElementById("fromDate").value = tmpSearchInfo.fromDate;
    document.getElementById("toDate").value = tmpSearchInfo.endDate;
    document.getElementById("id.status").value = status(tmpSearchInfo.status);
    gTrans.searchInfo = tmpSearchInfo;
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


function init(){
    angular.module('EbankApp').controller('manager-cre-request-create', function ($scope, requestMBServiceCorp){
        if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()){
            document.getElementById("export-print").style.display = 'block';
        }else{
            document.getElementById("export-print").style.display = 'none';
        }
        $scope.showElement = true;
        if(gUserInfo.userRole.indexOf('CorpInput') == -1 ||CONST_DESKTOP_MODE && checkScreenisMobilePX()){
            $scope.showElement =false;
        }
		
		$scope.months=function(e){
            return monthsTypeOfLanguage = e +' '+ CONST_STR.get('TRANS_PERIODIC_MONTH');
		}
        $scope.status=function(statusType) {
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
		
        $scope.getIndexArr=function(guaranteeType,arr){

            for(var i =0;i<arr.length;i++)
            {
                if(arr[i]==guaranteeType)
                {
                    return i;
                }
            }
            return 0;
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

        //--4. Gửi thông tin tìm kiếm
        function sendJSONRequest(searchInfo){

            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;

            jsonData.status = searchInfo.status;
            jsonData.fromDate = searchInfo.fromDate;
            jsonData.endDate = searchInfo.endDate;
			jsonData.pageId = gTrans.pageIdx;
            jsonData.pageSize = gTrans.pageSize;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_CRE_REQUEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
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
                    document.getElementById('id.searchResult').style.display = 'block';
                    document.getElementById('acc-pagination').style.display = 'block';
                    document.getElementById('id.message').style.display = 'none';
                    if (gTrans.totalPage <= 1) {
                        document.getElementById('acc-pagination').style.display = 'none';
                    }
                    setTimeout(function () {
                        if (gTrans.pageIdx === 1) {
                            displayPageCurent(1);
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
        
        $scope.showDetailTransaction = function (transId, status) {
            gTrans.detail.transId = transId;
            gTrans.detail.status = status;
            gTrans.tmpSearchInfo = JSON.parse(JSON.stringify(gTrans.searchInfo)); //Clone object
            var jsonData = {};
            jsonData.transIds = gTrans.detail.transId;
            jsonData.sequence_id = '2';
            jsonData.idtxn = gTrans.idtxn;

            var args = new Array();
            args.push(null);
            args.push(jsonData);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_CRE_REQUEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == '0'){
                    gTrans.detail = response.respJsonObj.info_trans[0];
                    gTrans.idFF = response.respJsonObj.info_excel;
					gTrans.detail.checklistProfile = response.respJsonObj.lst_valquery;
                    if(gTrans.idFF.length > 0){
                        gTrans.idFile = response.respJsonObj.info_excel[0].IDFILE;
                    }else{
                        gTrans.idFile = "";
                    }

						var infoCommon = {};
						gTrans.common = infoCommon;
						if (gTrans.detail.FORM ==0){
							infoCommon.form=CONST_STR.get('CRE_REQUEST_FORM_1'); //Cấp hạn mức tín dụng thường xuyên 
						}else if(gTrans.detail.FORM==1){
							infoCommon.form=CONST_STR.get('CRE_REQUEST_FORM_2');//Cấp tín dụng theo món
						}
						infoCommon.requestAmount = gTrans.detail.REQUEST_AMOUNT; //hạn mức đề nghị
						infoCommon.limitLoan = gTrans.detail.LIMIT_LOAN; //Cho vay
						infoCommon.limitGuarantee = gTrans.detail.LIMIT_GUARANTEE; //Bảo lãnh
						infoCommon.limitLCopen = gTrans.detail.LIMIT_LCOPEN; //Mở LC
						infoCommon.limitEstimate = gTrans.detail.LIMIT_ESTIMATE +' '+ CONST_STR.get('TRANS_PERIODIC_MONTH'); //tháng
						infoCommon.collateral = gTrans.detail.COLLATERAL //tài sản
						infoCommon.fileDescription = gTrans.detail.FILE_DESCRIPTION;
						
                    navCachedPages['credit/manager_guarantee/manager-cre-request-create-detail'] = null;
                    navController.pushToView("credit/manager_guarantee/manager-cre-request-create-detail", true,'html');
                }else {
                    showAlertText(response.respContent)
                }
            }, function (response) {

            });
        }

        $scope.changeTab = function () {
            navCachedPages['credit/guarantee/create/cre_request_create'] = null;
            navController.popView(true);
        }

        $scope.changePage = function (idx) {

            //document.getElementById('page_'+gTrans.pageId).className = '';

            gTrans.searchInfo.fromDate = document.getElementById("fromDate").value;
            gTrans.searchInfo.endDate = document.getElementById("toDate").value;
            gTrans.pageIdx = idx;
            sendJSONRequest(gTrans.searchInfo);

            displayPageCurent(idx);
        }
       

        // function initData() {
            // var jsonData = {};
            // jsonData.sequence_id = "1";
            // jsonData.idtxn = gTrans.idtxn;

            // var args = new Array();
            // args.push(null);
            // args.push(jsonData);
            // var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MANAGER_GUARANTEE"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            // var data = getDataFromGprsCmd(gprsCmd);

            // requestMBServiceCorp.post(data, true, function (response) {
                // if (response.respCode == '0'){
                    // gTrans.listMakers = response.respJsonObj.listMakers;
                // }
            // });
        // }
        
        //--1. Xử lý chọn trạng thái
        $scope.showTransStatusSelection = function () {
            var cbxValues = (gUserInfo.lang == 'EN')? CONST_GUARANTEE_QUERY_TYPE_STATUS_EN: CONST_GUARANTEE_QUERY_TYPE_STATUS_VN;
            addEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
            showDialogList(CONST_STR.get('COM_CHOOSE_STATUS'), cbxValues, CONST_GUARANTEE_QUERY_TYPE_STATUS_VALUE, false);
        }

        function handleSelectdTransStatusInter(e) {
            removeEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
            gTrans.searchInfo.status = e.selectedValue2;
            document.getElementById("id.status").value = e.selectedValue1;

        }

        function handleCloseTransStatusCbxInter(e) {
            removeEventListenerToCombobox(handleSelectdTransStatusInter, handleCloseTransStatusCbxInter);
        }
        //--END 1

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
		
		$scope.sendRequestExportExcel= function () {
			
            gTrans.searchInfo.fromDate = document.getElementById("fromDate").value;
            gTrans.searchInfo.endDate = document.getElementById("toDate").value;

			if (gTrans.searchInfo.fromDate == "dd/mm/yyyy") {
				gTrans.searchInfo.fromDate = "";
			}
			if (gTrans.searchInfo.endDate == "dd/mm/yyyy") {
				gTrans.searchInfo.endDate = "";
			}

			if (!this.calculateDifferentMonth(gTrans.searchInfo.fromDate, gTrans.searchInfo.endDate)) {
				showAlertText(CONST_STR.get("CORP_MSG_ACC_TIME_SEARCH_NOT_VALID"));
				return;
			}

			var objectValueClient = new Object();
			objectValueClient.idtxn = gTrans.idtxn;
			objectValueClient.sequenceId = 25;
			objectValueClient.status = gTrans.searchInfo.status;
			objectValueClient.fromDate = gTrans.searchInfo.fromDate;
			objectValueClient.toDate = gTrans.searchInfo.endDate;

			var args = ["", objectValueClient];

			//1305
			var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_EXPORT_EXCEL_REPORT"), "", "", gUserInfo.lang, gUserInfo.sessionID,
				args);

			data = getDataFromGprsCmd(gprsCmd);
			corpExportExcel(data);
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
