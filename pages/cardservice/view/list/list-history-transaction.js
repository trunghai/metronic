/**
 * Created by ThanhHC on 01/14/2017.
 */
 // Liệt kê giao dịch
 var selectedTxnType = CONST_HIS_CREDIT_TRANS_TYPE_ID[0]
 function viewDidLoadSuccess(){
 	initCardDetail();
 	function MenuContent(title, src) {
        this.title = title;
        this.src = src;
        this.keyLang = title;
    }
 	var arrBottom = new Array();
    arrBottom.push(new MenuContent('CREDIT_CARD_HISTORY_TRANSACTION', 'cardservice/view/list/list-history-transaction'));
    arrBottom.push(new MenuContent('CREDIT_CARD_RECEIVE_STATEMENT', 'cardservice/view/list/credit-receive-statement'));
    navController.initBottomBarOnlyText(arrBottom[0].src ,arrBottom, "history-transaction");
    setUpCalendar();
 }

 function viewWillUnload() {
 }
 function initCardDetail(){
 	angular.module('EbankApp').controller("list-history-transactions", function($scope, requestMBServiceCorp){
 		$scope.priCard = CONST_STR.get('CREDIT_PRI_OWNER_TYPE_TITLE');
        $scope.slvCard = CONST_STR.get('CREDIT_SLV_OWNER_TYPE_TITLE');
        $scope.activeCard = CONST_STR.get('CREDIT_ACTIVE_STATUS');
        $scope.deActiveCard = CONST_STR.get('CREDIT_DEACTIVE_STATUS');
 		$scope.infoCardDetail = cardPicked;
 		if($scope.infoCardDetail.myHashMap.BC_FLAG == '1'){
 			document.getElementById('pricard').style.display = "block";
 			document.getElementById('subcard').style.display = "none";
 		}else{
 			document.getElementById('pricard').style.display = "none";
 			document.getElementById('subcard').style.display = "block";
 		}

        
 		$scope.sendJSONRequest =  function(){
 			var start_date = document.getElementById('id.begindate').value;
            var end_date = document.getElementById('id.enddate').value;
            var sd = changeStringToArrayDate(start_date);
            var ed = changeStringToArrayDate(end_date);
            var now = new Date();
            var maxTime = (now.getTime() - sd[0].getTime())/86400000;
            var numOfDays = (ed[0].getTime() - sd[0].getTime())/86400000;            
            if(numOfDays > 90){
                showAlertText(CONST_STR.get('ACC_HIS_DATE_OVER_90DAYS'));
                return;
            }else if(maxTime > 365){
                showAlertText(CONST_STR.get('ERR_INPUT_NEGATIVE_TIME'));
                return;
            }else{
                var jsonData = new Object();
    			jsonData.sequence_id = "2";
                jsonData.idtxn = "D03";
    			jsonData.txn_type = selectedTxnType;
                // test the chinh
                // jsonData.card_id = "1030694";
    			jsonData.card_id = $scope.infoCardDetail.myHashMap.CARD_ID;			
                jsonData.start_date = start_date;
                jsonData.end_date = end_date;

                var from_amount = document.getElementById("idFromAmount").value;
    			var to_amount = document.getElementById("idToAmount").value;
                from_amount = removeSpecialChar(from_amount);
                to_amount = removeSpecialChar(to_amount);
                if(from_amount == ""){
                    jsonData.from_amount = "ALL";
                }else{
                    jsonData.from_amount = from_amount;
                }
                if (to_amount == "") {
                    jsonData.to_amount = "ALL";
                }else{
                    jsonData.to_amount = to_amount;
                }

    			var args = new Array();
    			args.push(null);
    			args.push(jsonData);
    			var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CREDIT_LIST'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
    			var data = getDataFromGprsCmd(gprsCmd);
    			requestMBServiceCorp.post(data, true,
    				function(data) {

                        var hisTransaction = data.respJsonObj.list_his_transaction.myArrayList;
                        for (var i = hisTransaction.length - 1; i >= 0; i--) {
                            hisTransaction[i].myHashMap.HOAN_THANH = formatNumberToCurrency(hisTransaction[i].myHashMap.HOAN_THANH) + " VND";
                        }
                        
    					$scope.hisTransaction = hisTransaction;
                        if($scope.hisTransaction.length > 0){
                            document.getElementById('tblContent').style.display = "block";
                            document.getElementById('idHistoryInfo').style.display = "none";
                        }else{                            
                            document.getElementById('tblContent').style.display = "none";
                            document.getElementById('idHistoryInfo').style.display = "block";
                        }
    				},
                    function(){
                        showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                        gotoHomePage();
                    }
                );
            }

 		}        
 	});
 	angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
 }
 function showAdvandSearch() {
    var innerText = document.getElementById('acchis.btnAdvSearch').innerText;
    if(innerText == CONST_STR.get('CREDIT_ADV_SEARCH_BTN')){
        document.getElementById('adv-search-controls').style.display = "block";
        document.getElementById('acchis.btnAdvSearch').innerText = CONST_STR.get('CREDIT_ADV_NOR_SEARCH_BTN');
        document.getElementById('acchis.btnAdvSearchDesktop').innerText = CONST_STR.get('CREDIT_ADV_NOR_SEARCH_BTN');
        ;
    }else{       
        document.getElementById('adv-search-controls').style.display = "none";
        document.getElementById('acchis.btnAdvSearch').innerText = CONST_STR.get('CREDIT_ADV_SEARCH_BTN');
        document.getElementById('acchis.btnAdvSearchDesktop').innerText = CONST_STR.get('CREDIT_ADV_SEARCH_BTN');
    }
    document.getElementById('idTxnType').value = (gUserInfo.lang == 'EN')? CONST_HIS_CREDIT_TRANS_TYPE_EN[0]: CONST_HIS_CREDIT_TRANS_TYPE_VN[0];
    selectedTxnType = CONST_HIS_CREDIT_TRANS_TYPE_ID[0];
    document.getElementById('idFromAmount').value = "";
    document.getElementById('idToAmount').value = ""
}
function handleInputAmountFrom(e, des){
    var limitActivate1 = document.getElementById('idFromAmount');
    formatCurrency(e, limitActivate1);
    var tmpVale = des.value;
    var numStr = convertNum2WordWithLang(removeSpecialChar(tmpVale), gUserInfo.lang);    
}
function handleInputAmountTo(e, des){
    var limitActivate1 = document.getElementById('idToAmount');
    formatCurrency(e, limitActivate1);
    var tmpVale = des.value;
    var numStr = convertNum2WordWithLang(removeSpecialChar(tmpVale), gUserInfo.lang);    
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
function selectTxnType(){
            var tmpArray1 = (gUserInfo.lang == 'EN')? CONST_HIS_CREDIT_TRANS_TYPE_EN: CONST_HIS_CREDIT_TRANS_TYPE_VN;
            var tmpArray2 = CONST_HIS_CREDIT_TRANS_TYPE_ID;
            document.addEventListener("evtSelectionDialog", handleSelectionTxnTypeList, false);
            document.addEventListener("evtSelectionDialogClose", handleSelectionTxnTypeListClose, false);
            showDialogList(CONST_STR.get('CREDIT_HIS_TRANS_TYPE_SELECTION_TITLE'), tmpArray1, tmpArray2, false);
        }
        function handleSelectionTxnTypeList(e) {
    if (currentPage == "cardservice/view/list/list-history-transaction") {
        handleSelectionTxnTypeListClose();
        if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
            var tagAccNo = document.getElementById("idTxnType");
            if (tagAccNo.nodeName == "INPUT") {
                tagAccNo.value = e.selectedValue1;
            }
            else {
                tagAccNo.innerHTML = e.selectedValue1;
            }
        }
        if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
            selectedTxnType = e.selectedValue2;
        }
    }
}
function handleSelectionTxnTypeListClose(e) {
    if (currentPage == "cardservice/view/list/list-history-transaction") {
        document.removeEventListener("evtSelectionDialogClose", handleSelectionTxnTypeListClose, false);
        document.removeEventListener("evtSelectionDialog", handleSelectionTxnTypeList, false);
    }
}