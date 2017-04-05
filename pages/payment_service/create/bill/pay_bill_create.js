/**
 * Created by HaiDT1 on 6/17/2016.
 */

gPayment.redirect = 'payment_service/create/bill/pay_bill_create';
gCorp.isBack = false; // Khoi tao
var type;
var accountSelected = {};
var serviceSelected = {};
var providerSelected = {};
gTrans.TXN_TYPE = 0;
gTrans.idtxn ="B12";
function viewBackFromOther() {
    gCorp.isBack = true;
}

function viewDidLoadSuccess() {
    setTitleBar(CONST_STR.get('MENU_PAY_BILL'));
    
    init();
 
    //Tooltip when hover book
    
}

function viewWillUnload() {
    //flag = false;
    logInfo('transfer will unload');
    document.removeEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
}

function init() {
    angular.module('EbankApp').controller('payment_bill', function ($scope, requestMBServiceCorp) {
        navCachedPages["payment_service/create/manager_bill/payment_bill_mng"] = null;
        initBottomBar();
        //=================SHOW DIALOG Acc====================================//
        $scope.showAccountSelection =function () {
            var tmpArray1 = [];
            var tmpArray2 = [];
            for (var i in gPayment.listAccount){
                tmpArray1.push(gPayment.listAccount[i].CUST_AC_NO);
                tmpArray2.push(gPayment.listAccount[i].BALANCE);
            }
            document.addEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, true);
        }

        function showAccountSelectionOpen(e) {
            if (currentPage == "payment_service/create/bill/pay_bill_create") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    for (var i in gPayment.listAccount){
                        if (e.selectedValue1 == gPayment.listAccount[i].CUST_AC_NO){
                            gPayment.listAcc = gPayment.listAccount[i];
                            $scope.initComboTextAccount(i);
                            $scope.balance = gPayment.listAcc.BALANCE;
                        }
                    }

                    showAccountSelectionClose();
                }
            }
        }

        function showAccountSelectionClose() {
            if (currentPage == "payment_service/create/bill/pay_bill_create") {
                document.removeEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            }
        }
//        end show acc
        var comboEl;
       // gTrans.idtxn = 'B12';
        $scope.initComboTextAccount = function (index){
            var accountName =  "";
            var accountNumber = "";
            var accountBalance = "";

            try{
                document.getElementById("holder-account-info").innerHTML = "";
                accountName = gUserInfo.accountName;
                accountNumber = gPayment.listAccount[index].CUST_AC_NO;
                accountBalance = formatNumberToCurrency(gPayment.listAccount[index].BALANCE);
            }catch(e){
                logInfo("khong load duoc thong tin tai khoan");
            }

            comboEl = new Combo({
                containerId : "cb-container", //holder of combo
                accountName : accountName, //account name
                accountNumber : accountNumber, //account number
                accountBalance : accountBalance, //account balance
                borderColor : "yellow", // border color
                containerPadding : "0px", // set padding to holder of combo
                containerMargin : "0px",
                showBorderTop : false,
                fontSize : "12px",
                showBorderBottom : false,//set margin to holder of combo
                clickIt : function (){ //handle function click
                    console.log("already click");
                }
            });
            comboEl.show("holder-account-info");

        }


        var _this = this;
        $scope.lang = gUserInfo.lang;
        $scope.infoFields = new Array();
        $scope.dsThuHuong = CONST_STR.get('TRANSFER_DS_THUHUONG');
        $scope.mauThuHuong = CONST_STR.get('TRANSFER_MAU_THUHUONG');
        $scope.service_ID;
        $scope.balance;
        

        if ($scope.lang === 'VN') {
            document.getElementById("mng.payee").value = CONST_INTERNAL_PAYMENT_SAVE_SAMPLE_STATUS_VN[1];
        } else {
            document.getElementById("mng.payee").value = CONST_INTERNAL_PAYMENT_SAVE_SAMPLE_STATUS_EN[1];
        }

        gPayment.payType = 'B12';

        if (!gCorp.isBack) {
            gPayment.paymentInfo = {};

            var jsonData = new Object();
            jsonData.sequence_id = '1';
            jsonData.idtxn = gPayment.payType;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_PAYMENT_BILL'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

             _this.handleSuccessCallBack = function (response) {
                 try{
                     var jsonObject = JSON.parse(JSON.stringify(response)); // verify that json is valid
                     var respJsonObj = jsonObject.respJsonObj;
                     gPayment.listAccount = respJsonObj.listSourceAccounts;
                     gPayment.listService = respJsonObj.lst_service;
                     gPayment.listProviderCommon = respJsonObj.lst_provider;
                     gPayment.listInfoField = respJsonObj.lst_infor_service;
                     gPayment.listComboValue = respJsonObj.lst_combo_service;
                     gPayment.listBeneName = respJsonObj.lst_bene;


                     //loại dịch vụ được chọn mặc định
                     serviceSelected = gPayment.listService[0];
                     if ($scope.lang === 'VN') {
                         document.getElementById('billing.input.service').value = gPayment.listService[0].SRV_NAME;
                         document.getElementById('id.billing.srvId').value = gPayment.listService[0].SRV_ID;
                     } else {
                         document.getElementById('billing.input.service').value = gPayment.listService[0].SRV_NAME_EN;
                         document.getElementById('id.billing.srvId').value = gPayment.listService[0].SRV_ID;
                     }

                     //tài khoản được chọn mặc định
                     gPayment.listAcc = gPayment.listAccount[0];
                     $scope.initComboTextAccount(0);
                     $scope.balance = gPayment.listAcc.BALANCE;
//                     accountSelected = gPayment.listAccount[0];
//                     $scope.balance = accountSelected.BALANCE;
//                     document.getElementById("id.accountno").value = accountSelected.CUST_AC_NO;
//                     document.getElementById("billing.sourceaccoutbalance").innerHTML = '<span class="availblstyle">' + CONST_STR.get("COM_TXT_ACC_BALANCE_TITLE") + ": " + CurrencyFormatted(accountSelected.BALANCE) + ' VND' + '</span>';

                     //danh sách nhà cung cấp
                     serviceSelected.list_provider = [];
                     for (var i in gPayment.listProviderCommon) {
                         if (serviceSelected.SRV_ID === gPayment.listProviderCommon[i].SRV_ID) {
                             serviceSelected.list_provider.push(gPayment.listProviderCommon[i]);
                         }
                     }

                     providerSelected = serviceSelected.list_provider[0];
                     if (gUserInfo.lang == 'VN') {
                         document.getElementById("billing.input.provider").value = serviceSelected.list_provider[0].PR_DESC; 
                         document.getElementById("id.billing.srvCode").value = serviceSelected.list_provider[0].SRV_CODE
                         document.getElementById("id.billing.prId").value = serviceSelected.list_provider[0].PR_ID
                         $scope.provider = {'key' : CONST_STR.get('PAYMENT_ISSUEDBY') , 'value' : serviceSelected.list_provider[0].PR_DESC}
                     } else {
                         document.getElementById("billing.input.provider").value = serviceSelected.list_provider[0].PR_DESC_EN;
                         document.getElementById("id.billing.srvCode").value = serviceSelected.list_provider[0].SRV_CODE
                         document.getElementById("id.billing.prId").value = serviceSelected.list_provider[0].PR_ID
                     }

                     $scope.infoFields = new Array();
                     for (var i in gPayment.listInfoField) {
                         if (providerSelected.SRV_CODE === gPayment.listInfoField[i].SRV_CODE) {
                             $scope.infoFields.push(gPayment.listInfoField[i]);
                         }
                     }

                     //lọc danh sách thụ hưởng theo loại dịch vụ
                     svId = document.getElementById('id.billing.srvId').value;
                     gPayment.svId = svId;
                     $scope.listbene = [];
                     gPayment.listBeneForSrv = [];
					 var count = 0;
		
                     for (var  i in gPayment.listBeneName){
                         var objData = gPayment.listBeneName[i];
//                         var obj = {};
						 
						 
                         if (objData.SRV_ID === svId){
//                             obj.value1 = objData.BENE_ACCTNO;
//                             obj.value2 = objData.BENE_NAME;
//							 count += 1;
//							 obj.index = count - 1;
							
							 
                             $scope.listbene.push(objData);
                             gPayment.listBeneForSrv.push(objData);
                         }
                     }


                 }catch (err) {
                     gotoHomePage();
                 }

                 
            };

            requestMBServiceCorp.post(data, true,_this.handleSuccessCallBack, function () {
                showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                gotoHomePage();

            });

        } else {
			
			 serviceSelected.list_provider = [];
                     for (var i in gPayment.listProviderCommon) {
                         if (gPayment.paymentInfo.srvId === gPayment.listProviderCommon[i].SRV_ID) {
                             serviceSelected.list_provider.push(gPayment.listProviderCommon[i]);
                         }
                     }
			$scope.infoFields = new Array();
                     for (var i in gPayment.listInfoField) {
                         if (gPayment.paymentInfo.srvCode === gPayment.listInfoField[i].SRV_CODE) {
                             $scope.infoFields.push(gPayment.listInfoField[i]);
                         }
                     }
			$scope.service_ID = gPayment.paymentInfo.srvId;
			 for (var i in gPayment.listAccount) {
                         if (gPayment.paymentInfo.sourceAcc === gPayment.listAccount[i].CUST_AC_NO) {
                             $scope.balance = formatNumberToCurrency(gPayment.listAccount[i].BALANCE);
                         }
                     }
			$scope.listbene = [];
					 var count = 0;
		
                     for (var  i in gPayment.listBeneName){
                         var objData = gPayment.listBeneName[i];
                         var obj = {};
						 
						 
                         if (objData.SRV_ID === svId){
                             obj.value1 = objData.BENE_ACCTNO;
                             obj.value2 = objData.BENE_NAME;
							 count += 1;
							 obj.index = count - 1;
							
							 
                             $scope.listbene.push(obj);
                         }
                     }

        }

        $scope.showServiceSeletion = function () {
            type = '1';
            var list = gPayment.listService;
            var cbxService = [];
            var cbxServiceCode = [];
            for (var i in list) {
                var service = list[i];
                if (gUserInfo.lang == 'VN') {
                    cbxService.push(service.SRV_NAME);
                    cbxServiceCode.push(service.SRV_ID);
                } else {
                    cbxService.push(service.SRV_NAME_EN);
                    cbxServiceCode.push(service.SRV_ID);
                }
                
            }
            if (cbxService.length != 0) {
                addEventListenerToCombobox(handleSelectionAccountList, handleSelectionAccountListClose);
                showDialogList(CONST_STR.get('PAYMENT_TYPE_SERVICES'), cbxService, cbxServiceCode, false);
            } else {
                showAlertText(CONST_STR.get("TRANS_INTERNAL_LIST_SRCACC_EMPTY"));
            }
        }



        $scope.showProviderSelecction = function () {
            type = '3';
            var list = serviceSelected.list_provider;
			
            var cbxProviderName = [];
            var cbxProviderCode = [];
            for (var i in list) {
                var provider = list[i];
                if (gUserInfo.lang == 'VN') {
                    cbxProviderName.push(provider.PR_DESC);
                    cbxProviderCode.push(provider.SRV_CODE + ',' + provider.PR_ID);
                } else {
                    cbxProviderName.push(provider.PR_DESC_EN);
                    cbxProviderCode.push(provider.SRV_CODE + ',' + provider.PR_ID);
                }
            }

            if (cbxProviderName.length != 0) {
                addEventListenerToCombobox(handleSelectionAccountList, handleSelectionAccountListClose);
                showDialogList(CONST_STR.get('PAYMENT_ISSUEDBY'), cbxProviderName, cbxProviderCode, false);
            } else {
                showAlertText(CONST_STR.get("PAYMENT_ACC_PROVIENDER_NOT_FOUND"));
            }
        }

        //Action when click select template control
        $scope.showInputMNG = function () {
            type = "4";
            var cbxText = (gUserInfo.lang == 'EN') ? CONST_INTERNAL_PAYMENT_SAVE_SAMPLE_STATUS_EN : CONST_INTERNAL_PAYMENT_SAVE_SAMPLE_STATUS_VN;
            var cbxValue = CONST_INTERNAL_PAYMENT_SAVE_SAMPLE_STATUS_KEY;
            addEventListenerToCombobox(handleSelectionAccountList, handleSelectionAccountListClose);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), cbxText, cbxValue, false);
        }

        $scope.showComboValues = function () {
            type = '5';
            var cbxName = [];
            var cbxValue = [];
            for (var i in $scope.infoFields) {
                var info = $scope.infoFields[i];
                if (info.INPUT_TYPE === 'COMBO') {
                    for (var j in info.comboValues) {
                        if($scope.lang === 'VN'){
                            cbxName.push(info.comboValues[j].FIELD_DESC);
                            cbxValue.push(info.comboValues[j].ID);
                        } else {
                            cbxName.push(info.comboValues[j].FIELD_DESC_EN);
                            cbxValue.push(info.comboValues[j].ID);
                        }
                        
                    }
                }
            }

            addEventListenerToCombobox(handleSelectionAccountList, handleSelectionAccountListClose);
            showDialogList(CONST_STR.get('PAYMENT_BILLING'), cbxName, cbxValue, false);
        }

        //Action when select a source account
        var handleSelectionAccountList = function (e) {
            removeEventListenerToCombobox(handleSelectionAccountList, handleSelectionAccountListClose);

            if (type == "1") {
                serviceSelected.srv_Code = e.selectedValue2;
                serviceSelected.srv_Name - e.selectedValue1;
                $scope.service_ID = serviceSelected.srv_Code;
                serviceSelected.list_provider = [];

                document.getElementById("billing.input.service").value = e.selectedValue1;
                document.getElementById('id.billing.srvId').value = e.selectedValue2;
                    if (e.selectedValue2 == "306" || e.selectedValue2 == "305") {
                        document.getElementById('notestyle').style.display = 'none';
						$scope.onoff=1;
                    }else{
                        document.getElementById('notestyle').style.display = '';
						$scope.onoff=0;
                    }

                //lọc lấy danh sách nhà cung cấp theo loại dịch vụ
                for (var i in gPayment.listProviderCommon) {
                    if (serviceSelected.srv_Code === gPayment.listProviderCommon[i].SRV_ID) {
                        serviceSelected.list_provider.push(gPayment.listProviderCommon[i]);
                    }
                }

                //lọc danh sách thụ hưởng theo loại dịch vụ
                svId = document.getElementById('id.billing.srvId').value;
                $scope.listbene = [];
                gPayment.listBeneForSrv = [];
                var count = 0;

                for (var  i in gPayment.listBeneName){
                    var objData = gPayment.listBeneName[i];
//                         var obj = {};


                    if (objData.SRV_ID === svId){
                        $scope.listbene.push(objData);
                        gPayment.listBeneForSrv.push(objData);
                    }
                }

                if (gUserInfo.lang == 'VN') {
                    if (serviceSelected.list_provider.length > 0) {
                        document.getElementById("billing.input.provider").value = serviceSelected.list_provider[0].PR_DESC
                        document.getElementById("id.billing.srvCode").value = serviceSelected.list_provider[0].SRV_CODE;
						document.getElementById("id.billing.prId").value = serviceSelected.list_provider[0].PR_ID;
						$scope.provider = {'key' : CONST_STR.get('PAYMENT_ISSUEDBY') , 'value' : serviceSelected.list_provider[0].PR_DESC};
                    } else {
                        document.getElementById("billing.input.provider").value = ''
                        document.getElementById("id.billing.srvCode").value = '';
						document.getElementById("id.billing.prId").value = '';
						$scope.provider = {'key' : CONST_STR.get('PAYMENT_ISSUEDBY') , 'value' : ''};
                    }

                    
                } else {
                    if (serviceSelected.list_provider.length > 0) {
                        document.getElementById("billing.input.provider").value = serviceSelected.list_provider[0].PR_DESC_EN;
                        document.getElementById("id.billing.srvCode").value = serviceSelected.list_provider[0].SRV_CODE;
						document.getElementById("id.billing.prId").value = serviceSelected.list_provider[0].PR_ID;
						$scope.provider = {'key' : CONST_STR.get('PAYMENT_ISSUEDBY') , 'value' : serviceSelected.list_provider[0].PR_DESC_EN};
                    } else {
                        document.getElementById("billing.input.provider").value = ''
                        document.getElementById("id.billing.srvCode").value = '';
						document.getElementById("id.billing.prId").value = '';
						$scope.provider = {'key' : CONST_STR.get('PAYMENT_ISSUEDBY') , 'value' : ''};
                    }                  
                }

                //Lấy thông tin các trường
                $scope.infoFields = new Array();
                
                for (var i in gPayment.listInfoField) {   
                    var infoField = {};
                    infoField = gPayment.listInfoField[i];
                    if (serviceSelected.list_provider[0].SRV_CODE === infoField.SRV_CODE) {
                        
                        if (infoField.INPUT_TYPE === 'COMBO') {
                            var comboValues = [];
                            for (var j in gPayment.listComboValue) {
                                if (infoField.ID === gPayment.listComboValue[j].MAP_ID) {
                                    comboValues.push(gPayment.listComboValue[j]);
                                }
                            }
                            infoField.comboValues = comboValues;
                            
                        }
                        $scope.infoFields.push(gPayment.listInfoField[i]);
                    }
                }

                for (var i in $scope.infoFields) {
                    var info = $scope.infoFields[i];
                    if (info.INPUT_TYPE === 'COMBO') {                      
                       $scope.cbxValue = $scope.infoFields[i].comboValues[0];
                    }
                }

                $scope.$apply();

            } else if (type == '3') {
                providerSelected = {};
                providerSelected.SRV_CODE = e.selectedValue2;
                providerSelected.PR_DESC = e.selectedValue1;

                var str = e.selectedValue2;
                var arr = str.split(',');
                document.getElementById("billing.input.provider").value = e.selectedValue1;
                document.getElementById('id.billing.srvCode').value = arr[0];
                document.getElementById('id.billing.prId').value = arr[1];
                $scope.provider = {'key' : CONST_STR.get('PAYMENT_ISSUEDBY') , 'value' : e.selectedValue1}

            } else if (type == '4') {
                document.getElementById("mng.payee").value = e.selectedValue1;
                document.getElementById("mng.payee.val").value = e.selectedValue2;
            } else if (type == '5') {
                $scope.cbxValue = e.selectedValue2;
                document.getElementById("billing.input.comboValue").value = e.selectedValue1;
            }
        }
     
        //Action when close list source account combobox
        var handleSelectionAccountListClose = function (e) {
            removeEventListenerToCombobox(handleSelectionAccountList, handleSelectionAccountListClose);
        }

        //Add event when click selection combobox
        var addEventListenerToCombobox = function (selectHandle, closeHandle) {
            document.addEventListener("evtSelectionDialog", selectHandle, true);
            document.addEventListener("evtSelectionDialogClose", closeHandle, true);
        }

        //Remove event then close selection combobox
        var removeEventListenerToCombobox = function (selectHandle, closeHandle) {
            document.removeEventListener("evtSelectionDialog", selectHandle, true);
            document.removeEventListener("evtSelectionDialogClose", closeHandle, true);
        }

        $scope.sendJSONRequest = function () {
            gPayment.paymentInfo.idtxn = gPayment.payType;
            gPayment.paymentInfo.sourceAcc = gPayment.listAcc.CUST_AC_NO;
            gPayment.paymentInfo.srvId = document.getElementById('id.billing.srvId').value;
            gPayment.paymentInfo.srvCode = document.getElementById('id.billing.srvCode').value;
            gPayment.paymentInfo.prId = document.getElementById('id.billing.prId').value;

            var txt = 'txt' + document.getElementById('billing.input.text.id.key').value;
            gPayment.paymentInfo[txt] = document.getElementById('billing.input.text').value;
			if (gPayment.paymentInfo.srvId === '205')
			{
				if (gPayment.paymentInfo.srvCode === '205-VTVCAB')
				{
					var txt = 'txt4';
            		gPayment.paymentInfo[txt] = document.getElementById('billing.input.text').value;
				}
				
			}

            if (document.getElementById('billing.input.comboValue.id.key') != undefined && document.getElementById('billing.input.comboValue.id.key') != null) {
                txt = 'txt' + document.getElementById('billing.input.comboValue.id.key').value;
                gPayment.paymentInfo[txt] = document.getElementById('billing.input.comboValue.id').value;
            }

            if ($scope.service_ID === 305 || $scope.service_ID === 306) {
                gPayment.paymentInfo.beneName = '';
                gPayment.paymentInfo.issavepayee = "N";
            } else {
                gPayment.paymentInfo.beneName = document.getElementById('billing.payeeName').value;
                gPayment.paymentInfo.issavepayee = document.getElementById('mng.payee.val').value;
            }
            

            //Validate
            if (!validate()) return;

            var jsonData = new Object();
            jsonData.sequence_id = "2";
            jsonData.idtxn = gPayment.payType;
            jsonData.paymentInfo = gPayment.paymentInfo;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_PAYMENT_BILL"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true, function (response) {

                var dataResponse = JSON.parse(JSON.stringify(response)); // verify that json is valid
                if (dataResponse.respCode == '0'){
                    gPayment.review = {};
                    
                    var accountInfo = [];
                    accountInfo.push({'key' : CONST_STR.get('PAYMENT_TRANSFER_TYPE'), 'value' : document.getElementById('billing.input.service').value });
                    accountInfo.push({'key' : CONST_STR.get('PAYMENT_ACCOUNT'), 'value' : gPayment.paymentInfo.sourceAcc});
                    accountInfo.push({'key' : CONST_STR.get('CRE_DEBT_SURPLUS_AVAILABEL'), 'value' : formatNumberToCurrency($scope.balance) + ' VND'});
                    
                    gPayment.review.accInfo = accountInfo;

                    var transInfo = [];
                    transInfo.push($scope.provider);

                    for (var i in dataResponse.respJsonObj){
                        info = dataResponse.respJsonObj[i];
                        if(info.FORMAT === 'CCY'){
                            info.FIELD_VALUE = formatNumberToCurrency(info.FIELD_VALUE) + ' VND' ;
                        }

                        if (gUserInfo.lang === 'VN'){
                            transInfo.push({'key' : info.MSG_FIELD_DESC, 'value' : info.FIELD_VALUE});
                        }else {
                            transInfo.push({'key' : info.MSG_FIELD_DESC_EN, 'value' : info.FIELD_VALUE});
                        }
                    }
					

                    gPayment.review.transInfo = transInfo;
                    gPayment.review.issavepayee = document.getElementById('mng.payee.val').value;
                    gPayment.review.beneName = document.getElementById('billing.payeeName').value;
                    gPayment.transactionId = dataResponse.respJsonObj[0].IDFCATREF;

                    navCachedPages["payment_service/create/bill/pay_bill_review"] = null;
                    navController.pushToView("payment_service/create/bill/pay_bill_review",
                        true);


                }
                else
                {
                    switch(dataResponse.respCode){
                        case 1 :
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_1"));
                            break;
                        case 8:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_8"));
                            break;
                        case 13:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_8"));
                            break;
                        case 20:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_20"));
                            break;
                        case 21:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_21"));
                            break;
                        case 30:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_30"));
                            break;
                        case 31:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_31"));
                            break;
                        case 32:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_32"));
                            break;
                        case 33:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_33"));
                            break;
                        case 34:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_34"));
                            break;
                        case 35:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_35"));
                            break;
                        case 36:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_36"));
                            break;
                        case 40:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_40"));
                            break;
                        case 66:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_66"));
                            break;
                        case 67:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_67"));
                            break;
                        case 68:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_68"));
                            break;
                        case 69:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_69"));
                            break;
                        case 70:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_70"));
                            break;
                        case 72:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_72"));
                            break;
                        case 78:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_78"));
                            break;
                        case 95:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_95"));
                            break;
                        case 98:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_98"));
                            break;
                        case 99:
                            showAlertText(CONST_STR.get("PAYMENT_BILLING_ERR_99"));
                            break;
                        default :
                            showAlertText(dataResponse.respContent);
                    }
                }

            }, function () {

                showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                gotoHomePage();

            });
        }
        
        function validate() {
            var txt = 'txt' + document.getElementById('billing.input.text.id.key').value; 
            if (gPayment.paymentInfo[txt].trim() == "") {
                showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
                        [document.getElementById('msg.field.name').innerHTML]));
                return false;
            }

            //validate quản lý người thụ hưởng
			//neu khac thanh toan ve may bay thi moi check

			if (gPayment.paymentInfo.srvId != '305' && gPayment.paymentInfo.srvId != '306')
			{
				if (gPayment.paymentInfo.issavepayee == "TH")
				{
					if (gPayment.paymentInfo.beneName.trim() == "") {
						showAlertText(formatString(CONST_STR.get('CORP_MSG_COM_NO_INPUT'),
								[CONST_STR.get('PAYMENT_BENEFICIARY_NAME_WITH_NOTE')]));
						return false;
					}
				}
			}
			

            return true;
        }

        //show mẫu thụ hưởng
        //Action when click destination account (T12)
        $scope.showPayeePage = function () {
            gTrans.showDialogCorp = true;
            document.addEventListener("evtSelectionDialogInput", handleInputPayeeAccOpen, false);
            document.addEventListener("evtSelectionDialogCloseInput", handleInputPayeeAccClose, false);
            document.addEventListener("tabChange", tabChanged, false);
            document.addEventListener("onInputSelected", okSelected, false);

            gTrans.dialog = new DialogListInput(CONST_STR.get('TRANS_LOCAL_DIALOG_TITLE_ACC'), 'TH', CONST_PAYEE_LOCAL_TRANSFER);
            // gTrans.dialog.USERID = gCustomerNo;
            // gTrans.dialog.PAYNENAME = "3";
            // gTrans.dialog.TYPETEMPLATE = "0";

            gTrans.dialog.showDialog(callbackShowDialogSuccessed, $scope.listbene);


        }

        //Call when show dialog complete
        function callbackShowDialogSuccessed(node){
            gTrans.dialog.hiddenTab2();
            // gTrans.dialog.addListData(function () {
            //
            // }, $scope.listbene, 'tab1');
        }

        //Action when selected a value in tabbox dialog
        function handleInputPayeeAccOpen(e) {
            handleInputPayeeAccClose();

            if (e.tabSelected == 'tab1') {
                var obj = e.dataObject;
                document.getElementById('billing.input.text').value = obj.transValue;
                document.getElementById('billing.payeeName').value = obj.peopleName;

            }
            
        }

        //Action when close tabbox dialog
        function handleInputPayeeAccClose(e){
            document.removeEventListener("evtSelectionDialogClose", handleInputPayeeAccClose, false);
            document.removeEventListener("evtSelectionDialog", handleInputPayeeAccOpen, false);
            document.removeEventListener("tabChange", tabChanged, false);
            document.removeEventListener("onInputSelected", okSelected, false);
        }

        //Action when change tab in tabbox dialog
        function tabChanged(e){
            // var node = e.selectedValueTab;
            // gTrans.showDialogCorp = true;
            // if (node.id == 'tab1') {
            //
            // }
            // if (node.id == 'tab2'){
            //     gTrans.dialog.activeDataOnTab('tab2');
            //     gTrans.dialog.USERID = gCustomerNo;
            //     gTrans.dialog.PAYNENAME = "3";
            //     gTrans.dialog.TYPETEMPLATE = "1";
            //     gTrans.dialog.requestData(node.id);
            // }
        }

        //Action when finish input value in tabbox dialog
        function okSelected(e){
            handleInputPayeeAccClose();
            if ((e.selectedValue != undefined) &&(e.selectedValue != null) && (e.selectedValue.length>0)){
                document.getElementById("billing.input.text").value = e.selectedValue;
                //loadInfoFromIdAccount();
            }
        }

        //Chuyển sang tab quản lý giao dịch
        $scope.changeTab = function () {
            setTitleBar(CONST_STR.get('BILLING_REPAYMENT_SCREEN_TITLE'));
            navController.pushToView('payment_service/create/manager_bill/payment_bill_mng', true,
                'html');
        }

    });

    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}

function controlInputText(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccentinfo(field.value);
        field.value = field.value.replace(/[!"@#$%&'\+:;<=>?\\`^~{|}]/g, '');
    }
}

function removeChar(e, des, maxlen) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(des, maxlen);
    }

    var tmpVale = des.value;
    var numStr = keepOnlyNumber(tmpVale);
    des.value = numStr;
}

//Mãu thụ hưởng
function initBottomBar (){
    var arrBottom = new Array();
    arrBottom.push(new MenuBottom("BOTTOM_BAR_CONTACT", "icon-beneficiaries"));
    contactParam = new ContactParam(CONSTANTS.get("CMD_TYPE_LOOKUP_PAYEE"),CONST_PAYEE_LOCAL_TRANSFER,'TH',true);

    navController.initBottomBarWithCallBack("payment_service/create/bill/pay_bill_create", arrBottom, "pay_bill_create", function (index) {

        switchAction(index);
    });
    // dung de phan biet mau chuyen tien, khi sua mau chuyen tien
    gEdit = 1;
    //
    gHisTypeTranfer = 17;
}

function switchAction(index){
    switch(index)
    {
        case "0":
            // template danh ba            
            gPayment.svId = document.getElementById('id.billing.srvId').value;
            document.addEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
            document.addEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
            initDialog(CONST_STR.get('BOTTOM_BAR_CONTACT'),"","payment_service/create/bill/template-contact-doc",
                function callbackDialogClose(){
                    callbackCloseDialogSchedulerTransfer();
                    document.removeEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
                    document.removeEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
                },
                function callbackDialogLoadSuccess(){
                    modalDialog.showDialogFull();
                    actionbar.hideActionbar();
                    bottomBar.hide();
                    firstLetterArray = [];
                    bgrColorArray = [];
                },true,callbackContactTranfer);
            break;

    }
}

//================= PROCESS DIALOG CONTACT TRANSFER ==================================//
function reInitContactTransfer() {
    initDialog(CONST_STR.get('BOTTOM_BAR_CONTACT'),"","payment_service/create/bill/template-contact-doc",
        function callbackDialogClose(){
            callbackCloseDialogSchedulerTransfer();
        },
        function callbackDialogLoadSuccess(){
            modalDialog.showDialogFull();
            actionbar.hideActionbar();
            bottomBar.hide();
            firstLetterArray = [];
            bgrColorArray = [];
        },true,callbackContactTranfer);
}

function callbackCloseDialogSchedulerTransfer(param,clickfromtop){
    console.log(param + " " + clickfromtop);
    bottomBar.resumeView('payment_service/create/bill/pay_bill_create','pay_bill_create');
    actionbar.showActionBar();
    document.removeEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
}


function genListParentPage(idDivList, respArr, parserService, fieldsRow, fieldsHidden, button, doubleClickItem){
    if(gModeScreenView == CONST_MODE_SCR_SMALL){
        // listAccount();
        genScreen(idDivList,respArr, parserService,
            fieldsRow,
            fieldsHidden,
            button,
            doubleClickItem
        );
        // funcUpdateStyleAccount();
    }else{
        // listAccountDesktop();
        genScreenDesktop(respArr);
    }
}


function genScreenDesktop(respArr){
    tempRespArr = respArr;
    for(var i = respArr.length; i > 0 ; i--){
        for(var j = 0; j < i - 1; j++){
            var tempValue;
            if(respArr[j].peopleName.toUpperCase().charCodeAt(0) > respArr[j + 1].peopleName.toUpperCase().charCodeAt(0)){
                tempValue = respArr[j];
                respArr[j] = respArr[j + 1];
                respArr[j + 1] = tempValue;
            }
        }
    }
    var div = document.getElementById("divListContact");
    div.innerHTML = "";
    var firstLetter;
    for(var i = 0; i < respArr.length; i++){
        if(i == 0 ||respArr[i].peopleName.toUpperCase().charCodeAt(0) > firstLetter.charCodeAt(0)){
            firstLetter = respArr[i].peopleName.charAt(0);
            var localTitle = document.createElement('div');
            localTitle.innerHTML = firstLetter;
            localTitle.style.textAlign = "left";
            localTitle.style.padding = "10px";
            localTitle.style.color = "#5f2f85";
            localTitle.style.fontWeight = "bold";
            div.appendChild(localTitle);
        }
        var tempView = document.createElement('div');
        tempView.setAttribute('class','my-acc-view');
        tempView.setAttribute('id','localAcc_' + i);
        tempView.setAttribute('onclick',"viewLocalAcc(this," + i + ")");
        tempView.innerHTML = respArr[i].peopleName;
        div.appendChild(tempView);
    }
    if (respArr.length > 0){
        viewLocalAcc(document.getElementById('localAcc_0'), 0);
    }
}

function viewLocalAcc(e,index){
    document.getElementById("tenThuHuong").style.display ="";
    document.getElementById("maHopDong").style.display ="";
    document.getElementById('iTenThuHuong').innerHTML =  tempRespArr[index].BENE_NAME;
    document.getElementById('iMaHopDong').innerHTML =  tempRespArr[index].BENE_ACCTNO;
    /*document.getElementById("tp").style.display ="none";
    document.getElementById("accNo").style.display ="none";*/
    document.getElementById('deleteSelection').style.display = '';
    resetActive();
    e.style.backgroundColor = '#FF8C29';
    e.style.color = '#fff';
    tempIndex = index;
}

function resetActive(){
    for( var i = 0; i < gUserInfo.accountList.length; i++){
        if(i%2 == 0){
            document.getElementById('myAcc_' + i).style.backgroundColor = '#F7E9FA';
        }else{
            document.getElementById('myAcc_' + i).style.backgroundColor = '#FDF1FF';
        }
        document.getElementById('myAcc_' + i).style.color = '#000';
    }
    if(tempRespArr != undefined){
        for(var i = 0; i< tempRespArr.length; i++){
            if(document.getElementById('localAcc_' + i)){
                if(i%2 == 0){
                    document.getElementById('localAcc_' + i).style.backgroundColor = '#F7E9FA';
                }else{
                    document.getElementById('localAcc_' + i).style.backgroundColor = '#FDF1FF';
                }
                document.getElementById('localAcc_' + i).style.color = '#000';
            }
        }
    }
}
function transLocalBank(){
    callbackContactTranfer(tempRespArr[tempIndex]);
}
function callbackContactTranfer(obj) {
    console.log(obj);
    // double click template tranfer contact doc
    modalDialog.hideDialogFull();
    callbackCloseDialogSchedulerTransfer();

    if (currentPage == "payment_service/create/bill/pay_bill_create") {
        if (obj != null && obj != undefined) {
            if (obj.BENE_ACCTNO != undefined){
                document.getElementById("billing.input.text").value = obj.BENE_ACCTNO;
                document.getElementById("billing.payeeName").value = obj.BENE_NAME;
            }
            else
            {
                document.getElementById("billing.input.text").value = obj.transValue;
                document.getElementById("billing.payeeName").value = obj.peopleName;
            }
        }
    }

}

