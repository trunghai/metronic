/**
 * Created by NguyenTDK
 * User:
 * Date: 05/10/15
 * Time: 8:00 PM
 */

var sequenceId;
gTrans.transInfo = {};
flagAccFinalize = true;
gTrans.isBack = false;

/*** INIT VIEW ***/
function loadInitXML() {
    logInfo('send info user approve init');
}

/*** VIEW BACK FROM OTHER ***/

function viewBackFromOther() {
    logInfo('Back send info user approve');
    flagCreSearch = false;
	gTrans.isBack = true;
    flagAccFinalize = false;
}


/*** VIEW LOAD SUCCESS ***/
function viewDidLoadSuccess() {
    init();
    logInfo('Send info user approve load success');
    if(flagAccFinalize){
        document.getElementById('id.accountno').value = CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER');
    }
    // get data from database
    sequenceId = '1';
    var l_obj = new Object();
    l_obj.idtxn = "A14";
    // l_obj.sequenceId = '1';

    sendRequest(l_obj);
    document.addEventListener('evtChangeWidthDesktop',gentable,false);
    document.addEventListener('evtChangeWidthMobile',gentable,false);

    // gen sequence form
    // genSequenceForm();

}

/*** VIEW WILL UNLOAD ***/
function viewWillUnload() {
    logInfo('Send info user approve will unload');
    document.removeEventListener('evtChangeWidthDesktop',gentable,false);
    document.removeEventListener('evtChangeWidthMobile',gentable,false);
}
function init() {
    angular.module('EbankApp').controller('acc_finalize', function ($scope, requestMBServiceCorp) {
        // Hiển thị ra drop down list của phần [Tài khoản nhận tiền]
        // navController.getBottomBar().hide();
        $scope.showAccountSelection = function () {
            var tmpArray1 = [];
            var tmpArray2 = [];
            if(gprsResp.respCode == RESP.get('COM_VALIDATE_FAIL')&& gprsResp.responseType == CONSTANTS.get('CMD_CO_ACC_FINALIZE')){
                gUserInfo.accountList = gUserInfo.accountList;
            }
                else{
                    gUserInfo.accountList = gprsResp.respJsonObj.listSourceAccounts;
                }
            for (var i = 0; i < gUserInfo.accountList.length; i++) {
                var tmpAcc = gUserInfo.accountList[i];
                if (tmpAcc.ghiCo == 'N') {
                    tmpArray1.push(tmpAcc.account);
                    tmpArray2.push(formatNumberToCurrency(tmpAcc.balance) + ' VND');
                }
            }

            document.addEventListener("evtSelectionDialog", handleSelectionAccountList, false);
            document.addEventListener("evtSelectionDialogClose", handleSelectionAccountListClose, false);

            showDialogList(CONST_STR.get('TRANS_LOCAL_DIALOG_TITLE_ACC'), tmpArray1, tmpArray2, true);
        }

//event: selection dialog list
        function handleSelectionAccountList(e) {
            if (currentPage == "account/create/finalize/acc_finalize") {
                handleSelectionAccountListClose();

                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById("id.accountno").value = e.selectedValue1;
                }
            }
        }

        function handleSelectionAccountListClose(e) {
            if (currentPage == "account/create/finalize/acc_finalize") {
                document.removeEventListener("evtSelectionDialogClose", handleSelectionAccountListClose, false);
                document.removeEventListener("evtSelectionDialog", handleSelectionAccountList, false);
            }
        }

// Quay lai man hinh [Tien gui co ki han]
        $scope.backToScreenDtl = function () {
            navController.popView(true);
        }
        $scope.exeTrans = function () {
            var idDestAccount = document.getElementById("id.accountno").value;
            var amoutPhongToa = gAccount.accSoPhongToa.replace(/\,/g, '');
            var strEmptyReason = gAccount.accLyDoPhongToa.substring((gAccount.accLyDoPhongToa.length - 3), gAccount.accLyDoPhongToa.length);
            if (strEmptyReason == ' , ') {
                strEmptyReason = gAccount.accLyDoPhongToa.substring(0, (gAccount.accLyDoPhongToa.length - 3));
            } else {
                strEmptyReason = gAccount.accLyDoPhongToa;
            }
            if (idDestAccount == ''
                || idDestAccount == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
                showAlertText(CONST_STR.get('CORP_MSG_COM_INVALID_ACCOUNT_NUMBER'));
            } else if (amoutPhongToa > 0) {
                showAlertText(CONST_STR.get('CORP_MSG_FINALIZE_BLOG_ACC'));
            } else {
                gTrans.src = "pages/account/create/list_info/acc_list_account_info_view.html";
                gTrans.cmdType = CONSTANTS.get("CMD_CO_ACC_FINALIZE"); //port

                gTrans.transInfo.accCloseSavingAcc = CONST_STR.get('ACC_CLOSE_SAVING_ACCOUNT');
                gTrans.transInfo.accPeriodOnline = CONST_STR.get('ACCOUNT_PERIOD_ONLINE');
                gTrans.transInfo.accountNum = gAccount.accNumber;
                gTrans.transInfo.accAmount = gAccount.accAmount.replace(".00", "") + ' VND';

                gTrans.transInfo.strTenor = gAccount.strTenor;
                gTrans.transInfo.idAccNo = document.getElementById("id.accountno").value;
                gTrans.transInfo.idTransLocal = document.getElementById("id-trans-local").value;
                var strTenor;
                if(gAccount.accTenorDays != '0'){
                    gTrans.transInfo.strTenor = gAccount.accTenorDays + ' ' + CONST_STR.get('ACCOUNT_PERIOD_DAY');
                }else if(gAccount.accTenorMonths != '0'){
                    gTrans.transInfo.strTenor = gAccount.accTenorMonths + ' ' + CONST_STR.get('ACCOUNT_PERIOD_MONTH');
                }else if(gAccount.accTenorYears != '0'){
                    gTrans.transInfo.strTenor = gAccount.accTenorYears + ' ' + CONST_STR.get('ACCOUNT_PERIOD_YEAR');
                }   
                sequenceId = '2';

                var l_obj = new Object();
                l_obj.idtxn = "A14";
                l_obj.idSourceAccount = gAccount.accNumber;
                l_obj.idDestAccount = idDestAccount;
                l_obj.amount = gAccount.accAmount;
                l_obj.typeMoney = gAccount.accTypeMoney;

                sendRequest(l_obj);
            }
        }
		$scope.initBottomBar = function (){
			var arrBottom = new Array();
			// arrBottom.push(new MenuBottom("BOTTOM_BAR_RECENTLY", "icon-recents"));
			// arrBottom.push(new MenuBottom("BOTTOM_BAR_TEMPLATE_TRANSFER", "icon-template"));
			// arrBottom.push(new MenuBottom("BOTTOM_BAR_CONTACT", "icon-beneficiaries"));
			arrBottom.push(new MenuBottom("AUTO_BILLING_TAB_LIST", "icon-scheduled-transfers-list"));
			/*holderParam = new ParamHolder(CONSTANTS.get("CMD_TRANSFER_TEMPLATE_TEMPLATE"),'','0',
			 CONSTANTS.get("CMD_TYPE_LOOKUP_PAYEE"),CONST_PAYEE_LOCAL_TRANSFER,'TH',true,
			 CONSTANTS.get('CMD_TRANSFER_PERIODIC_MNG_TRANS'),CONST_VAL_PERIODIC_LOCAL[0],true);*/
			// latestParam = new LatestParam(CONSTANTS.get("CMD_TRANSFER_GET_HIS_TRANSACTION"),gCustomerNo,CONST_PAYEE_LOCAL_TRANSFER);
			// transferParam = new TransferParam(CONSTANTS.get("CMD_TRANSFER_TEMPLATE_TEMPLATE"),'',0);
			// contactParam = new ContactParam(CONSTANTS.get("CMD_TYPE_LOOKUP_PAYEE"),CONST_PAYEE_LOCAL_TRANSFER,'TH',true);
			periodParam = new PeriodParam(CONSTANTS.get("CMD_TRANSFER_PERIODIC_MNG_TRANS"),CONST_VAL_PERIODIC_LOCAL[0]);


			navController.initBottomBarWithCallBack("account/create/finalize/acc_finalize", arrBottom, "acc_finalize", function (index) {
				// updateAccountListInfo();
				navCachedPages['common/com_list_user_approve'] = null;
				navController.pushToView("common/com_list_user_approve", true, 'html');
				// navCachedPages['account/create/finalize/acc_finalize'] = null;
			});
			// dung de phan biet mau chuyen tien, khi sua mau chuyen tien
			gEdit = 1;
			//
			gHisTypeTranfer = 17;
		}
		
        if(!gTrans.isBack){
            $scope.initBottomBar();
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}


//Set data to page
function setDataToScreen() {
    // Set data to page
    if (gAccount.accType == 'Y') {
            titleAccType = CONST_STR.get('ACCOUNT_PERIOD_ONLINE');
    } else {
            titleAccType = CONST_STR.get('ACCOUNT_PERIOD_COUNTER');
    }
    getTenor(gAccount);
    var gArraccinfo = [];

    row1  = [CONST_STR.get('ACCOUNT_PERIOD_TYPE'), titleAccType];
    row2  = [CONST_STR.get('COM_ACCOUNT_NUMBER'), gAccount.accNumber];
    row3  = [CONST_STR.get('COM_AMOUNT'), gAccount.accAmount + 'VND'];
    row4  = [CONST_STR.get('COM_PERIOD'), tenor];
    row5  = [CONST_STR.get('ACC_INTEREST_YEAR'), gAccount.accInterestRate];

    if (gAccount.accProfitsInterim.trim() == '-') {
       getAccProfitsInterim =  gAccount.accProfitsInterim;
    } else {
       getAccProfitsInterim =  gAccount.accProfitsInterim + ' ' + gAccount.accTypeMoney;
        
    }
    row6  = [CONST_STR.get('ACC_PROFITS_INTERIM'), getAccProfitsInterim];

    row7  = [CONST_STR.get('ACCOUNT_PERIOD_DATESTART'), gAccount.accDateStart];
    row8  = [CONST_STR.get('ACCOUNT_AMOUNT_BLOCK'), gAccount.accSoPhongToa + ' VND'];
    row9  = [CONST_STR.get('ACCOUNT_PERIOD_DATEEND'), gAccount.accDateEnd];

    var strEmptyReason = gAccount.accLyDoPhongToa.substring((gAccount.accLyDoPhongToa.length - 3), gAccount.accLyDoPhongToa.length);
    if (strEmptyReason == ' , ') {
        strEmptyReason = gAccount.accLyDoPhongToa.substring(0, (gAccount.accLyDoPhongToa.length - 3));
    } else {
        strEmptyReason = gAccount.accLyDoPhongToa;
    }
    // getStrEmptyReason =  strEmptyReason;
    row10 = [CONST_STR.get('ACCOUNT_REASON_BLOCK'), strEmptyReason];

    gArraccinfo = [row1, row2, row3,  row4,  row5,  row6,  row7,  row8,  row9,  row10];
    gentable();
    
}
function gentable(){
    if(CONST_DESKTOP_MODE && !checkScreenisMobilePX()){
        var recycler = new RecyclerView({
            type: "DESKTOP_GRID",
            typeTextAlign: "MIDLE",
            title: "Detail tài khoản",
            titleAlign:"LEFT",
            opacity:true
        });

        recycler.setData(gArraccinfo);
        var contentHTML = recycler.init();
        var content = document.getElementById('div-datainfo');
        content.innerHTML = contentHTML;
    }else{
        var recycler = new RecyclerView({
            type: "NORMAL",
            typeTextAlign: "MIDLE",
            title: "Detail tài khoản",
            titleAlign:"LEFT",
            opacity:true
        });

        recycler.setData(gArraccinfo);
        var contentHTML = recycler.init();
        var content = document.getElementById('div-datainfo');
        content.innerHTML = contentHTML;
    }
}
function getTenor(){
    var tenorday = parseInt(gAccount.accTenorDays);
    var tenormonth = parseInt(gAccount.accTenorMonths);
    var tenoryear = parseInt(gAccount.accTenorYears);
    var counttenor = tenorday + 30*tenormonth +365*tenoryear;
    if(counttenor>0){
        if(tenorday <1){
            if(tenormonth >0){
                if(tenoryear >0){
                    tenor= gAccount.accTenorYears+ ' ' + CONST_STR.get('TRANS_PERIODIC_YEAR')+' '+gAccount.accTenorMonths + ' ' + CONST_STR.get('TRANS_PERIODIC_MONTH');
                }
                else {
                    tenor= gAccount.accTenorMonths + ' ' + CONST_STR.get('TRANS_PERIODIC_MONTH');
                }
            }
            else if(tenormonth <1){
                tenor= gAccount.accTenorYears+ ' ' + CONST_STR.get('TRANS_PERIODIC_YEAR');
            }
        }
        else if(tenorday >0){
            if(tenormonth >0){
                if(tenoryear >0){
                    tenor=  gAccount.accTenorYears+ ' ' + CONST_STR.get('TRANS_PERIODIC_YEAR')+' '+ gAccount.accTenorMonths + ' ' + CONST_STR.get('TRANS_PERIODIC_MONTH')+' '+gArraySav.tenor_day + ' '+ CONST_STR.get('TRANS_PERIODIC_DATE1');

                }
                else {
                    tenor=  gAccount.accTenorMonths + ' ' + CONST_STR.get('TRANS_PERIODIC_MONTH')+' '+gArraySav.tenor_day + ' '+ CONST_STR.get('TRANS_PERIODIC_DATE1');
                }
            }
            else if(tenormonth <1){
                if(tenoryear >0){
                    tenor=  gArraySav.tenor_year+ ' ' + CONST_STR.get('TRANS_PERIODIC_YEAR')+' '+gAccount.accTenorDays + ' '+ CONST_STR.get('TRANS_PERIODIC_DATE1');
                }
                else{
                    tenor= gAccount.accTenorDays + ' '+ CONST_STR.get('TRANS_PERIODIC_DATE1');
                }
            }

        }
    }
}

//Thực hiện việc gọi lên server
function sendRequest(l_obj) {
    var l_data = {};
    var l_arrayArgs = new Array();

    var l_json = JSON.stringify(l_obj);

    l_arrayArgs.push(sequenceId);
    l_arrayArgs.push(l_json);
    l_arrayArgs.push("");
    l_arrayArgs.push("");
    l_arrayArgs.push("");
    l_arrayArgs.push("");
    l_arrayArgs.push("");
    l_arrayArgs.push("");
    l_arrayArgs.push("");
    l_arrayArgs.push("");

    var l_gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_ACC_FINALIZE"), "", "", gUserInfo.lang, gUserInfo.sessionID, l_arrayArgs);
    l_gprsCmd.raw = '';
    l_data = getDataFromGprsCmd(l_gprsCmd);

    requestMBServiceCorp(l_data, true, 0, requestAccListAccountSuccess, requestAccListAccountFail);
}

//Lấy dữ liệu được trả về từ service đẩy lên trang
function requestAccListAccountSuccess(e) {
    gprsResp = JSON.parse(e);

    if (gprsResp.respCode == RESP.get('COM_SUCCESS')
        && gprsResp.responseType == CONSTANTS.get('CMD_CO_ACC_FINALIZE')) {

        if (sequenceId == '1') {
            // mainContentScroll.refresh();
            document.getElementById("id-trans-local").value = CONST_STR.get('COM_NOTIFY_' + gprsResp.respJsonObj.method);
            if (gprsResp.respJsonObj.method == 0) {
                document.getElementById('listUserApprove').style.display = "none";
            }
            setDataToScreen();
        } else if (sequenceId == '2') {
            setRespObjStore(gprsResp);
            genReviewScreen(gprsResp.respJsonObj);
        }
    } else if (gprsResp.respCode == RESP.get('COM_VALIDATE_FAIL')
        && gprsResp.responseType == CONSTANTS.get('CMD_CO_ACC_FINALIZE')) {
        showAlertText(gprsResp.respContent);
    } else {
        if (gprsResp.respCode == '1019') {
            showAlertText(gprsResp.respContent);
        } else {
            showAlertText(CONST_STR.get('ERR_COM_TRANS_FAILED'));
        }
        var tmpPageName = navController.getDefaultPage();
        var tmpPageType = navController.getDefaultPageType();
        navController.pushToView(tmpPageName, true, tmpPageType);
    }
}

function requestAccListAccountFail(e) {

}

/*** GENARATE REVIEW SCREEN ***/
function genReviewScreen(data) {
    //req gui len
    var req = new Object();{
        req.sequence_id = data.sequence_id,
        req.transaction_id = data.transaction_id,
        req.idtxn = data.idtxn
    };
    gTrans.requestData = req;

    updateAccountListInfo();
    navCachedPages["common/common-review/transfer-review-scr"] = null;
    navController.pushToView("common/common-review/transfer-review-scr", true, 'html');
}

