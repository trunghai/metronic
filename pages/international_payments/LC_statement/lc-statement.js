var viewBack = false;
function viewBackFromOther(){
	viewBack = true;
}
function viewDidLoadSuccess(){
	init();
	console.log('loaded');
    setUpCalendar();
}
function init(){
	angular.module('EbankApp').controller("lc-statement",function($scope, requestMBServiceCorp){
		$scope.srcmobile = 'pages/international_payments/LC_statement/lc-statement-mobile-list.html';
        $scope.src = 'pages/international_payments/LC_statement/lc-statement-desktop-list.html';
        if (gTrans.listLC != undefined & viewBack == true) {
        	$scope.listLC = gTrans.listLC;
        	setTimeout(function () {
                changeLanguageInView();
                document.getElementById("hasData").style.display = "";
            }, 60);
        }else{
        	setTimeout(function () {
        		document.getElementById("hasData").style.display = "none";
        	}, 50);
        }
			//=================SHOW DIALOG TRANSTYPE====================================//
        $scope.showLcTypeSelection =function () {
            var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_TYPE_LC_STATEMENT_EN : CONST_TYPE_LC_STATEMENT_VN;
            var tmpArray2 = CONST_TYPE_LC_STATEMENT_KEY;
            document.addEventListener("evtSelectionDialog", showLcTypeSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showLcTypeSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, false);
        }

        function showLcTypeSelectionOpen(e) {
            if (currentPage == "international_payments/LC_statement/lc-statement") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('lcType').value = e.selectedValue1;
                    document.getElementById('lcTypeVal').value = e.selectedValue2;
                    showLcTypeSelectionClose();
                }
            }
        }

        function showLcTypeSelectionClose() {
            if (currentPage == "international_payments/LC_statement/lc-statement") {
                document.removeEventListener("evtSelectionDialog", showLcTypeSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showLcTypeSelectionClose, false);
            }
        }

        $scope.onSearchLC =  function() {
        	$scope.listLC = null;
            var jsonData = new Object();
            jsonData.sequenceId = "1";
            jsonData.idtxn = 'B03';

            jsonData.lcType = document.getElementById("lcTypeVal").value;
            jsonData.fromDate = document.getElementById("id.begindate").value;
            jsonData.toDate = document.getElementById("id.enddate").value;

            gTrans.lcTypeEx = document.getElementById("lcType").value;
            gTrans.fromDateEx = document.getElementById("id.begindate").value;
            gTrans.toDateEx = document.getElementById("id.enddate").value;

            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_LC_STATEMENT'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true, function (response) {
                if(response.respCode == '0'){
                	gTrans.listLC = response.respJsonObj.list_lc.myArrayList;
                    if (isEmpty(gTrans.listLC)) {
                        document.getElementById("emptyData").style.display = "";
                        document.getElementById("hasData").style.display = "none";
                    }else{
                        $scope.listLC = response.respJsonObj.list_lc.myArrayList;
                        for (var i = $scope.listLC.length - 1; i >= 0; i--) {
                            $scope.listLC[i].myHashMap.LIABILITY_AMOUNT = formatFloatNumberToCurrency($scope.listLC[i].myHashMap.LIABILITY_AMOUNT);
                        }
                        document.getElementById("emptyData").style.display = "none";
                        document.getElementById("hasData").style.display = "";
                    }
                    setTimeout(function () {
                        changeLanguageInView();
                    }, 10);                    
                }else{
                    showAlertText(response.respContent);
                    return;
                }
            }, function () {
                
            });
        }
	});
	angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}
function referenceDetail(e){
    gTrans.refNo = e.innerText;
	gTrans.typeIE = checkTypeIE(gTrans.refNo);
	navCachedPages['international_payments/LC_statement/detail/lc-statement-detail'] = null;
	navController.pushToView('international_payments/LC_statement/detail/lc-statement-detail', true, 'html');
}
function goToViewScreen(e){
    gTrans.refNo = e.getElementsByTagName('input')[0].name;
    gTrans.typeIE = checkTypeIE(gTrans.refNo);
	navCachedPages['international_payments/LC_statement/view/lc-statement-view'] = null;
	navController.pushToView('international_payments/LC_statement/view/lc-statement-view', true, 'html');
}
function checkTypeIE(refNo){
    var length = gTrans.listLC.length;
    for(var i = 0; i < length; i++){
        if(refNo == gTrans.listLC[i].myHashMap.CONTRACT_REF_NO){
            var productCode = gTrans.listLC[i].myHashMap.PRODUCT_CODE;
            if(productCode == "ILC0" || productCode == "ILC1" || productCode == "ILC5" || productCode == "LCUT"){
                return "IMPORT";
            }else if (productCode == "ELC1") {
                return "EXPORT";
            }else{
                return "UNDEFINED";
            }
        }
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