/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 12/13/16
 * Time: 10:48 AM
 * To change this template use File | Settings | File Templates.
 */
var gprsResp = new GprsRespObj("", "", "", "");
var transactionId;
var sequenceId;
var destAccount;
var listDurationInfo;
var tenorPostChoosen;
var provisionalRate, startDate, endDate;
var data = {};
var objJSON;
var rateInterest;
var flag = true;
var dueType;

function loadInitXML() {

    return '';
}


function viewBackFromOther() {
    flag = false;
}

function viewDidLoadSuccess() {
    disableAccountField();
    document.getElementById("id.accountno2").disabled = true;
    if (flag) {
        //edit ctk41
        var isIPad = navigator.userAgent.match(/iPad/i);
        if (isIPad) keyboardEvent();
        document.getElementById('trans.amount').value = "";
        document.getElementById('id.payee').value = CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER');
    } else {
        console.log("dueType");
        if (dueType == 1) {
            document.getElementById("radio1").checked = true;
            disableAccountField();
        } else if (dueType == 2) {
            document.getElementById("radio2").checked = true;
            enableAccountField();
        } else if (dueType == 3) {
            document.getElementById("radio3").checked = true;
            enableAccountField();
        };
    };
    //lay ki han gui, lai suat tien gui
    init();
    actionbar.setTitleBarOnly(CONST_STR.get("ACC_SEND_MONEY_CKH"));
    actionbar.showStepSequence("com-authentication-scr");
    // genSequenceForm();

}

function init() {

    angular.module("EbankApp").controller("acc-saving-account", function ($scope, requestMBServiceCorp) {
        // navCachedPages["account/create/saving/com_list_user_approve"] = null;
        navCachedPages["account/create/saving/acc_saving_account"] = null;
        //=================SHOW DIALOG Acc====================================//
        $scope.showAccountSelection =function () {
            var tmpArray1 = [];
            var tmpArray2 = [];
            for (var i in gAccount.listAccount){
                tmpArray1.push(gAccount.listAccount[i].account);
                tmpArray2.push(gAccount.listAccount[i].balance);
            }
            document.addEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, true);

        }

        function showAccountSelectionOpen(e) {
            if (currentPage == "account/create/saving/acc_saving_account") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    for (var i in gAccount.listAccount){
                        if (e.selectedValue1 == gAccount.listAccount[i].account){
                            gTrans.sourceAcc = gAccount.listAccount[i];
                            $scope.initComboTextAccount(i);
                            document.getElementById("id.accountno").value  =  gAccount.listAccount[i].account;
                        }
                    }

                    showAccountSelectionClose();
                }
            }
        }

        function showAccountSelectionClose() {
            if (currentPage == "account/create/saving/acc_saving_account") {
                document.removeEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            }
        }
//        end show acc
        var comboEl;
        $scope.initComboTextAccount = function (index){
            var accountName =  "";
            var accountNumber = "";
            var accountBalance = "";

            try{
                document.getElementById("holder-account-info").innerHTML = "";
                accountName = gUserInfo.accountName;
                accountNumber = gAccount.listAccount[index].account;
                accountBalance = formatNumberToCurrency(gAccount.listAccount[index].balance);
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
        $scope.sendRequestTenorPost = function() {
            sequenceId = 1;
            var args = ["", {
                sequenceId: sequenceId,
                idtxn: "A13"
            }];
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_MENU_ACCOUNT"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true,
                function(data){
                    var resp = data;
                    if(resp.respCode == 0){
                        gAccount.listAccount = resp.respJsonObj.listAccount;
                        //lay ki han gui
                        var obj = resp.respJsonObj;
                        var limit = obj.limit;
                        var duration = obj.duration;
                        var rate = obj.rate;
                        gAccount.listDurationName = new Array();
                        gAccount.listDurationCode = new Array();

                        gAccount.limitTime = parseInt(limit.limitTime);
                        gAccount.limitDay = parseInt(limit.limitDay);
                        gAccount.totalDay = parseInt(limit.totalDay);
                        gAccount.currency = limit.currency;
                        for (var i = 0; i < duration.length; i++) {
                            gAccount.listDurationName.push(duration[i].DURNAME);
                            gAccount.listDurationCode.push(duration[i].DURCODE);
                        }
                        gAccount.durationVn = [];
                        gAccount.durationEng = [];
                        gAccount.durationRate = [];
                        //lay bang lai suat
                        for (var i = 0; i < rate.length; i++) {
                            gAccount.durationVn.push(rate[i].tenKyHan);
                            gAccount.durationEng.push(rate[i].tenKyHan);
                            gAccount.durationRate.push(rate[i].giaTriKyHan + "%");
                        }
                        $scope.initComboTextAccount(0);

                        document.getElementById("id.accountno").value  =  gAccount.listAccount[0].account;
                        accountBalance = gAccount.listAccount[0].balance;


                        // thiet lap thong tin
//                        document.getElementById("id.notifyTo").value = CONST_STR.get('COM_NOTIFY_' + gprsResp.respJsonObj.method);
                    }
                }

            );
        }
        $scope.sendRequestTenorPost();
        // chon ky han gui
        $scope.showInputMNG = function(){
            var tmpArray1 = gAccount.listDurationName;
            var tmpArray2 = gAccount.listDurationCode;
            var tmpArray3 = gAccount.durationRate;
            document.addEventListener("evtSelectionDialog", handleInputMNG, false);
            document.addEventListener("evtSelectionDialogClose", handleInputMNGClose, false);
            showDialogListWith4Arr(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1,tmpArray2, tmpArray3,'',false, true);
        }
        function handleInputMNG(e) {
            console.log("XXX");
            document.removeEventListener("evtSelectionDialog", handleInputMNG, false);

            if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                var mnglist = document.getElementById('id.payee');
                if (mnglist.nodeName == "INPUT") {
                    mnglist.value = e.selectedValue1;
                    tenorPostChoosen = e.selectedValue1;
                    gAccount.tenorPost = e.selectedValue1;
                } else {
                    mnglist.innerHTML = e.selectedValue1;
                }
            }
            if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
                gAccount.rate = e.selectedValue2;
                var dataChoose = e.selectedValue2.split("/");
                gAccount.durationCode = dataChoose[0];
                document.getElementById("id.interest").innerHTML = dataChoose[1];
                rateInterest = dataChoose[1];
            }
        }
        function handleInputMNGClose() {
            document.removeEventListener("evtSelectionDialogClose", handleInputMNGClose, false);
            document.removeEventListener("evtSelectionDialog", handleInputMNG, false);
            actionbar.showActionBar();
            bottomBar.show();
        }
        // xem bieu mau lai suat tien gui
        $scope.showRate = function(){
            var tmpArray1 = chooseArrayInputDiaglog(gAccount.durationEng, gAccount.durationVn);
            var tmpArray2 = gAccount.durationRate;
            showDialogList(CONST_STR.get('ACC_SEE_DOCUMENT_RATE'), tmpArray1, tmpArray2, true);
        }
        // chi thi khi dao han
        /**
         * Set check cho radio khi click vao text kem boi dam text
         **/
        $scope.checkedRadioAnno1 = function(){
            var radioChecked1 = document.getElementById("radio1");
            radioChecked1.checked = true;
            document.getElementById("lblRadio1").style.fontWeight = "bold";
            document.getElementById("lblRadio2").style.fontWeight = "normal";
            document.getElementById("lblRadio3").style.fontWeight = "normal";
            document.getElementById("id.accountno2").value = CONST_STR.get("ESAVING_BGN_CHOICE");
            disableAccountField();
        }
        $scope.checkedRadioAnno2 = function(){
            var radioChecked2 = document.getElementById("radio2");
            radioChecked2.checked = true;
            document.getElementById("lblRadio1").style.fontWeight = "normal";
            document.getElementById("lblRadio2").style.fontWeight = "bold";
            document.getElementById("lblRadio3").style.fontWeight = "normal";
            enableAccountField();
        }
        $scope.checkedRadioAnno3 = function(){
            var radioChecked3 = document.getElementById("radio3");
            radioChecked3.checked = true;
            document.getElementById("lblRadio1").style.fontWeight = "normal";
            document.getElementById("lblRadio2").style.fontWeight = "normal";
            document.getElementById("lblRadio3").style.fontWeight = "bold";
            enableAccountField();
        }
        $scope.showAccountSelection2 = function(){
            if (document.getElementById("radio1").checked != true) {
                var tmpArray1 = [];
                var tmpArray2 = [];
                for (var i = 0; i < gAccount.listAccount.length; i++) {
                    var tmpAcc = gAccount.listAccount[i];
                    if (tmpAcc.ghiNo == 'N') {
                        tmpArray1.push(tmpAcc.account);
                        tmpArray2.push(formatNumberToCurrency(tmpAcc.balance) + ' VND');
                    }
                }

                document.addEventListener("evtSelectionDialog", handleSelectionAccountList2, false);
                document.addEventListener("evtSelectionDialogClose", handleSelectionAccountListClose2, false);

                showDialogList(CONST_STR.get('TRANS_LOCAL_DIALOG_TITLE_ACC'), tmpArray1, tmpArray2, true);
            }
        }
        // xem danh sach nguoi nhan thong bao
        $scope.showReceiverList = function(){
            if (document.getElementById("radio1").checked) {
                dueType = "1";
            } else if (document.getElementById("radio2").checked) {
                dueType = "2";
            } else if (document.getElementById("radio3").checked) {
                dueType = "3";
            }

            navController.pushToView("account/create/saving/com_list_user_approve", true, 'html');
        }
        $scope.sendJSONRequest = function () {
            var sourceAccount = document.getElementById("id.accountno").value;
            var transAmount = removeSpecialChar(document.getElementById("trans.amount").value);
            var tenorPost = document.getElementById("id.payee").value; //ki han gui
            var destAccountChoosen = document.getElementsByName("maturityDirective");

            for (var i = 0; i < destAccountChoosen.length; i++) {
                if (destAccountChoosen[i].checked) {
                    if (i == 0) {
                        dueType = "1";
                        destAccount = sourceAccount;
                    } else if (i == 1) {
                        if (document.getElementById("id.accountno2").value == CONST_STR.get('ESAVING_BGN_CHOICE')) {
                            showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("ESAVING_LABLE_COMBO_REN")]));
                            return;
                        }
                        destAccount = document.getElementById("id.accountno2").value;
                        dueType = "2";
                    } else if (i == 2) {
                        if (document.getElementById("id.accountno2").value == CONST_STR.get('ESAVING_BGN_CHOICE')) {
                            showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("ESAVING_LABLE_COMBO_REN")]));
                            return;
                        }
                        destAccount = document.getElementById("id.accountno2").value;
                        dueType = "3";
                    }
                }

            }
            /*
            if (sourceAccount == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("COM_ACCOUNT_NUMBER")]));
                return;
            } */
            if (transAmount === null || transAmount == '') {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("COM_NUM_MONEY_SAVING")]));
                return;
            }
            if (gAccount.tenorPost == null || gAccount.tenorPost == undefined || tenorPost == CONST_STR.get('COM_TXT_DEADLINE_SEND_SELECTION_PLACEHOLDER')) {
                showAlertText(CONST_STR.get("E_ACCOUNT_TENOR_POST"));
                return;
            }

            //kiem tra so tien vuot qua so du kha dung
            if (parseInt(transAmount) > parseInt(getBalanceAccount())) {
                showAlertText(CONST_STR.get("COM_ACC_BLC_NOT_ENOUGH"));
                return;
            }

            //kiem tra han muc giao dich
            if (checkLimitTransInit(parseInt(transAmount))) {
                return;
            }

            var idtxn = "A13";
            sequenceId = "2";
            var objectValueClient = new Object();
            objectValueClient.idtxn = "A13";;
            objectValueClient.sequenceId = "2";
            objectValueClient.sourceAccount = sourceAccount;
            objectValueClient.transAmount = transAmount;
            objectValueClient.tenorPosts = gAccount.tenorPost;

            objectValueClient.destAccount = destAccount;
            objectValueClient.dueType = dueType;
            objectValueClient.duration = gAccount.durationCode;
            objectValueClient.rate = keepOnlyNumber(rateInterest);

            var arrayClientInfo = new Array();
            arrayClientInfo.push("2");
            arrayClientInfo.push(objectValueClient);

            var amount = removeSpecialChar(document.getElementById("trans.amount").value);
            if (validateValueClient(amount, tenorPostChoosen)) {

            } else {
                var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_MENU_ACCOUNT'), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);
                data = getDataFromGprsCmd(gprsCmd);
                objJSON = data;
                requestMBServiceCorp.post(data,true, requestMBServiceSuccess, requestMBServiceFail);
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


        navController.initBottomBarWithCallBack("account/create/saving/acc_saving_account", arrBottom, "acc_saving_account", function (index) {
            // updateAccountListInfo();
            navCachedPages['common/com_list_user_approve'] = null;
            navController.pushToView("common/com_list_user_approve", true, 'html');
            // navCachedPages['account/create/saving/acc_saving_account'] = null;
        });
        // dung de phan biet mau chuyen tien, khi sua mau chuyen tien
        gEdit = 1;
        //
        gHisTypeTranfer = 17;
    }
        
        $scope.infoTrans={};
        $scope.initComboTextAccount();
        $scope.initBottomBar();
        
    });
    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}
function handleSelectionAccountList(e) {
    handleSelectionAccountListClose();
    setValueAccount(e, "id.accountno");
    var nodeAccBal = document.getElementById("trans.sourceaccoutbalance");
    if (e.selectedValue2 != undefined) {
        nodeAccBal.innerHTML = "<div class='availblstyle'>" + CONST_STR.get('COM_TXT_ACC_BALANCE_TITLE') + ": " + e.selectedValue2 + "</div>";
    }
}



function requestMBServiceSuccess(e) {
  gprsResp =e;// JSON.parse(e);

  if (gprsResp.respCode == "0") {
    if (sequenceId == "1") {
      var obj = gprsResp.respJsonObj;
      var limit = obj.limit;
      var duration = obj.duration;
      var rate = obj.rate;
      gAccount.listAccount = obj.listAccount;

      gAccount.listDurationName = new Array();
      gAccount.listDurationCode = new Array();

      gAccount.limitTime = parseInt(limit.limitTime);
      gAccount.limitDay = parseInt(limit.limitDay);
      gAccount.totalDay = parseInt(limit.totalDay);
      gAccount.currency = limit.currency;

      for (var i = 0; i < duration.length; i++) {
        gAccount.listDurationName.push(duration[i].DURNAME);
        gAccount.listDurationCode.push(duration[i].DURCODE);
      }


      gAccount.durationVn = [];
      gAccount.durationEng = [];
      gAccount.durationRate = [];

      //lay bang lai suat
      for (var i = 0; i < rate.length; i++) {
        gAccount.durationVn.push(rate[i].tenKyHan);
        gAccount.durationEng.push(rate[i].tenKyHan);
        gAccount.durationRate.push(rate[i].giaTriKyHan + "%");
      }

      // thiet lap thong tin 
      document.getElementById("id.notifyTo").value = CONST_STR.get('COM_NOTIFY_' + gprsResp.respJsonObj.method);
    } else {
      try {
        var arguments = e.arguments[0];
        transactionId = (JSON.parse(arguments)).transactionId;
      } catch (err) {

      }
      setRespObjStore(gprsResp); //store response
      genReviewScreen();
    }
  }
}

//event listener: http request fail
function requestMBServiceFail() {

};


function handleSelectionAccountList2(e) {
    handleSelectionAccountListClose2();
    setValueAccount(e, "id.accountno2");
}

function disableAccountField() {
    var elements = document.getElementsByClassName("accToggleField");
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if(CONST_DESKTOP_MODE && !checkScreenisMobilePX()){
            element.style.backgroundColor = "#eee";
        }else{
            element.style.backgroundColor = "rgba(162, 100, 187, 0.51)";
        }
    }
    document.getElementById("id.accountno2").disabled = true;
}

function enableAccountField() {
    var elements = document.getElementsByClassName("accToggleField");
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        element.style.backgroundColor = "#FAFAFA";
    }
    document.getElementById("id.accountno2").disabled = false;
}
function handleSelectionAccountListClose(e) {
    document.removeEventListener("evtSelectionDialogClose", handleSelectionAccountListClose, false);
    document.removeEventListener("evtSelectionDialog", handleSelectionAccountList, false);
}


function handleSelectionAccountListClose2(e) {
    document.removeEventListener("evtSelectionDialogClose", handleSelectionAccountListClose2, false);
    document.removeEventListener("evtSelectionDialog", handleSelectionAccountList2, false);
}
function compareCurrentTime() {
    var date = new Date();
    return (date.getHours() > 16 || (date.getHours == 16 && date.getMinutes() > 30));
}

//lay du lieu ki han gui db
function sendRequestGetTenorPost() {

}

function viewWillUnload() {}

function handleInputAmount(e, des) {
    var tmpVale = des.value;
    formatCurrency(e, des);
    var numStr = convertNum2WordWithLang(keepOnlyNumber(tmpVale), gUserInfo.lang);

    var nodeNumTxt = document.getElementById("trans.amounttotext");

    nodeNumTxt.innerHTML = "<div class='txtmoneystyle'>" + numStr + "</div>";
}

function validateValueClient(amount, tenorPosts) {
    if (amount < 1000000) {

        showAlertText(CONST_STR.get('E_ACCOUNT_NUMBER_MONEY'));
        return true;
    }
    if (tenorPosts == null || tenorPosts == undefined) {
        showAlertText(CONST_STR.get('E_ACCOUNT_TENOR_POST'));
        return true;
    }
    return false;
}

//event listener: http request fail
function requestMBServiceFail() {

};




function setValueAccount(selectedAccount, name) {
    try {
        if (selectedAccount.selectedValue1 != undefined && selectedAccount.selectedValue1 != null) {
            var account = document.getElementById(name);
            if (account.nodeName == "INPUT") {
                account.value = selectedAccount.selectedValue1;
            } else {
                account.innerHTML = selectedAccount.selectedValue1;
            }
        }

    } catch (err) {
        console.log("function selectedAccount error !!!");
    }
}

function genReviewScreen() {
            var obj = (gprsResp.respJsonObj)[0];

            //get data from client
            var sourceAccount = document.getElementById("id.accountno").value;
            var transAmount = document.getElementById("trans.amount").value;
            var tenorPosts = document.getElementById("id.payee").value; //ki han gui
            var destAccount = document.getElementById("id.accountno2").value;
            var arrDayEnd = (document.getElementById("id.payee").value).split(" ");

            var dueType = obj.DUETYPE; //lua chon 1, 2 ha 3
            var announce;
            if (dueType == 1) {

                //chuyen goc va lai sang ki han moi
                announce = CONST_STR.get("COM_INTEREST_MOVING_INTO_NEW_TERM");
            } else if (dueType == 2) {

                //chuyen goc sang ki han moi, lai chuyen v
                announce = CONST_STR.get("ACC_MOVING_TERM_ROOT") + " " + destAccount;
            } else if (dueType == 3) {
                announce = CONST_STR.get("ACC_FINALIZE_OF_PRINCIPAL") + " " + destAccount;
            }

            //so du kha dung
            var balance = 0;
            for(var i = 0; i < gAccount.listAccount.length; i++ )
            {
                var tmpAcc = gAccount.listAccount[i].account;
                if(tmpAcc == sourceAccount)
                {
                    balance = removeSpecialChar(gAccount.listAccount[i].balance);
                    break;
                }
            }

            /*
            for (var idx = 0; idx < gUserInfo.accountList.length; idx++) {
                var tmpAcc = new AccountObj();
                tmpAcc = gUserInfo.accountList[idx];
                if (tmpAcc.accountNumber == sourceAccount) {
                    balance = tmpAcc.balanceAvailable;
                    break;
                }
            } */

            //lai suat tirn gui
            if (gAccount.rate == null || gAccount.rate == undefined) {
                gAccount.rate = "";
            }

            var docXml = createXMLDoc();
            var rootNode = createXMLNode('review', '', docXml);

            //thong tin chung
            var listValueAccount = [
                [CONST_STR.get("COM_TYPE_TRANSACTION"), CONST_STR.get("ACC_SEND_MONEY_ONLINE")],
                [CONST_STR.get("COM_ACCOUNT_DEDUCT_MONEY"), sourceAccount], //tai khoan trich tien
                [CONST_STR.get("ACCOUNT_AVAILABLE_BALANCE"), formatNumberToCurrencyWithSymbol(balance, " " + "VND")],
                [CONST_STR.get("E_ACCOUNT_BALANCE_DEDUCT_MONEY"), formatNumberToCurrencyWithSymbol((balance - removeSpecialChar(transAmount)), " " + "VND")]
            ];
            var listValueTransaction = [
                [CONST_STR.get("COM_NUM_MONEY_SAVING"), formatNumberToCurrencyWithSymbol(transAmount, " VND")], //so tien gui
                [CONST_STR.get("COM_PERIOD"), tenorPosts], //ki han gui
                [CONST_STR.get("ACCOUNT_PERIOD_DATESTART"), obj.VALUE_DATE], //ngay gui
                [CONST_STR.get("COM_EXPIRE_DATE"), obj.VALUE_END_DATE], //ngay dao han
                [CONST_STR.get("COM_INTEREST"), rateInterest], //
                [CONST_STR.get("ACC_PROFITS_INTERIM"), formatNumberToCurrencyWithSymbol(obj.B, "  VND")], //lai tam tinh
                [CONST_STR.get("COM_ANNOUNCE_DEADLINE"), announce],
                [CONST_STR.get("COM_SEND_MSG_APPROVER"), document.getElementById("id.notifyTo").value]
            ];

            createDateNodeReview(CONST_STR.get("COM_ACCOUNT_INFO"), listValueAccount, docXml, rootNode);
            createDateNodeReview(CONST_STR.get("COM_TRASACTION_INFO"), listValueTransaction, docXml, rootNode);

            createButtonNode("cancel", CONST_STR.get('REVIEW_BTN_CANCEL'), docXml, rootNode);
            createButtonNode("back", CONST_STR.get('REVIEW_BTN_BACK'), docXml, rootNode);
            createButtonNode("authorize", CONST_STR.get('REVIEW_BTN_NEXT'), docXml, rootNode);

            //du lieu gui len man hinh cuoi cung
            var req = {
                sequenceId: "3",
                transactionId: transactionId,
                idtxn: 'A13'
            };
            gCorp.cmdType = CONSTANTS.get("CMD_MENU_ACCOUNT"); //port
            gCorp.requests = [req, null];

            //setReviewXmlStore(docXml);
            // navCachedPages["account/common-review/com-review-account"] = null;
            // navController.pushToView("account/common-review/com-review-account", true, 'html');
             gTrans.transInfo = new Object();
             gTrans.transInfo.transID = CONST_STR.get("ACC_SEND_MONEY_ONLINE");
             gTrans.transInfo.accountDeduct = sourceAccount;
             gTrans.transInfo.availableBalance = formatNumberToCurrencyWithSymbol(balance, " " + "VND");
             gTrans.transInfo.deductMoney = formatNumberToCurrencyWithSymbol((balance - removeSpecialChar(transAmount)), " " + "VND");
             
             gTrans.transInfo.transId = obj.A;
             gTrans.transInfo.moneySaving = formatNumberToCurrencyWithSymbol(transAmount, " VND");
             gTrans.transInfo.comPeriOD = tenorPosts;
             gTrans.transInfo.dateStart = obj.VALUE_DATE;
             gTrans.transInfo.dateEnd = obj.VALUE_END_DATE;
             gTrans.transInfo.interest = rateInterest;
             gTrans.transInfo.cinterIm = formatNumberToCurrencyWithSymbol(obj.B, "  VND");
             gTrans.transInfo.deadLine = announce;
             gTrans.transInfo.approver = document.getElementById("id.notifyTo").value;
             var requestData = {
                            transactionId: transactionId,
                            sequenceId: 3,
                            idtxn: 'A13'
                        
              }

                        gTrans.requestData = requestData;
                        gTrans.cmdType =  CONSTANTS.get('CMD_MENU_ACCOUNT');
                        gTrans.src = "pages/account/common-review/com-review-account-saving.html";
                        gTrans.ortherSrc = "account/create/saving/acc_saving_account";
                        navController.pushToView("common/common-review/transfer-review-scr", true, "html");
            
        }
// function genReviewScreen() {
//     var obj = (gprsResp.respJsonObj)[0];

//     //get data from client
//     var sourceAccount = document.getElementById("id.accountno").value;
//     var transAmount = document.getElementById("trans.amount").value;
//     var tenorPosts = document.getElementById("id.payee").value; //ki han gui
//     var destAccount = document.getElementById("id.accountno2").value;
//     var arrDayEnd = (document.getElementById("id.payee").value).split(" ");

//     var dueType = obj.DUETYPE; //lua chon 1, 2 ha 3
//     var announce;
//     if (dueType == 1) {

//         //chuyen goc va lai sang ki han moi
//         announce = CONST_STR.get("COM_INTEREST_MOVING_INTO_NEW_TERM");
//     } else if (dueType == 2) {

//         //chuyen goc sang ki han moi, lai chuyen v
//         announce = CONST_STR.get("ACC_MOVING_TERM_ROOT") + " " + destAccount;
//     } else if (dueType == 3) {
//         announce = CONST_STR.get("ACC_FINALIZE_OF_PRINCIPAL") + " " + destAccount;
//     }

//     //so du kha dung
//     var balance = 0;
//     for (var idx = 0; idx < gUserInfo.accountList.length; idx++) {
//         var tmpAcc = new AccountObj();
//         tmpAcc = gUserInfo.accountList[idx];
//         if (tmpAcc.accountNumber == sourceAccount) {
//             balance = tmpAcc.balanceAvailable;
//             break;
//         }
//     }

//     //lai suat tirn gui
//     if (gAccount.rate == null || gAccount.rate == undefined) {
//         gAccount.rate = "";
//     }

//     var docXml = createXMLDoc();
//     var rootNode = createXMLNode('review', '', docXml);

//     //thong tin chung
//     var listValueAccount = [
//         [CONST_STR.get("COM_TYPE_TRANSACTION"), CONST_STR.get("ACC_SEND_MONEY_ONLINE")],
//         [CONST_STR.get("COM_ACCOUNT_DEDUCT_MONEY"), sourceAccount], //tai khoan trich tien
//         [CONST_STR.get("ACCOUNT_AVAILABLE_BALANCE"), formatNumberToCurrencyWithSymbol(balance, " " + "VND")],
//         [CONST_STR.get("E_ACCOUNT_BALANCE_DEDUCT_MONEY"), formatNumberToCurrencyWithSymbol((balance - removeSpecialChar(transAmount)), " " + "VND")]
//     ];
//     var listValueTransaction = [
//         [CONST_STR.get("COM_NUM_MONEY_SAVING"), formatNumberToCurrencyWithSymbol(transAmount, " VND")], //so tien gui
//         [CONST_STR.get("COM_PERIOD"), tenorPosts], //ki han gui
//         [CONST_STR.get("ACCOUNT_PERIOD_DATESTART"), obj.VALUE_DATE], //ngay gui
//         [CONST_STR.get("COM_EXPIRE_DATE"), obj.VALUE_END_DATE], //ngay dao han
//         [CONST_STR.get("COM_INTEREST"), rateInterest], //
//         [CONST_STR.get("ACC_PROFITS_INTERIM"), formatNumberToCurrencyWithSymbol(obj.B, "  VND")], //lai tam tinh
//         [CONST_STR.get("COM_ANNOUNCE_DEADLINE"), announce],
//         [CONST_STR.get("COM_SEND_MSG_APPROVER"), document.getElementById("id.notifyTo").value]
//     ];

//     createDateNodeReview(CONST_STR.get("COM_ACCOUNT_INFO"), listValueAccount, docXml, rootNode);
//     createDateNodeReview(CONST_STR.get("COM_TRASACTION_INFO"), listValueTransaction, docXml, rootNode);

//     createButtonNode("cancel", CONST_STR.get('REVIEW_BTN_CANCEL'), docXml, rootNode);
//     createButtonNode("back", CONST_STR.get('REVIEW_BTN_BACK'), docXml, rootNode);
//     createButtonNode("authorize", CONST_STR.get('REVIEW_BTN_NEXT'), docXml, rootNode);

//     //du lieu gui len man hinh cuoi cung
//     var req = {
//         sequenceId: "3",
//         transactionId: transactionId,
//         idtxn: 'A13'
//     };
//     gCorp.cmdType = CONSTANTS.get("CMD_MENU_ACCOUNT"); //port
//     gCorp.requests = [req, null];

//     setReviewXmlStore(docXml);
//     navCachedPages["account/common-review/com-review-account"] = null;
//     navController.pushToView("account/common-review/com-review-account", true, 'html');
    
// }


function createDateNodeReview(title, listValue, docXml, rootNode) {
    var sectionNode = createXMLNode('section', '', docXml, rootNode);
    var titleNode = createXMLNode('title', title, docXml, sectionNode);
    for (var i = 0; i < listValue.length; i++) {
        var obj = listValue[i];
        rowNode = createXMLNode('row', '', docXml, sectionNode);
        labelNode = createXMLNode('label', obj[0], docXml, rowNode);
        valueNode = createXMLNode('value', obj[1], docXml, rowNode);
    }

}

function createButtonNode(type, name, docXml, rootNode) {
    buttonNode = createXMLNode('button', '', docXml, rootNode);
    typeNode = createXMLNode('type', type, docXml, buttonNode);
    btnLabelNode = createXMLNode('label', name, docXml, buttonNode);
}




// function genSequenceForm() {
//     var tmpXslDoc = getCachePageXsl("sequenceform");
//     var tmpStepNo = 301;
//     setSequenceFormIdx(tmpStepNo);
//     var docXml = createXMLDoc();
//     var tmpXmlRootNode = createXMLNode('seqFrom', '', docXml);
//     var tmpXmlNodeInfo = createXMLNode('stepNo', tmpStepNo, docXml, tmpXmlRootNode);
//     //gen html string
//     genHTMLStringWithXML(docXml, tmpXslDoc, function(oStr) {
//         var tmpNode = document.getElementById('seqForm');
//         if (tmpNode != null) {
//             tmpNode.innerHTML = oStr;
//         }
//     });
// }


function showRate() {
    var tmpArray1 = chooseArrayInputDiaglog(gAccount.durationEng, gAccount.durationVn);
    var tmpArray2 = gAccount.durationRate;
    showDialogList(CONST_STR.get('ACC_SEE_DOCUMENT_RATE'), tmpArray1, tmpArray2, true);
}

//tro ve man hinh truoc
function goBackClick() {

    navCachedPages["account/saving/acc_saving_account"] = null;
    navController.initWithRootView('account/list_info/acc_list_account_info', true, 'html');
}

//tro ve man hinh truoc
function cancelClick() {

    navCachedPages["account/saving/acc_saving_account"] = null;
    navController.initWithRootView('account/list_info/acc_list_account_info', true, 'html');
}

//chon loai input dau vao qua ngon ngu
function chooseArrayInputDiaglog(inputArrayEnglish, inputArrayVN) {
    var result = (gUserInfo.lang == 'EN') ? inputArrayEnglish : inputArrayVN;
    return result;
}

//ham lay so du kha dung
function getBalanceAccount() {
    var sourceAccount = document.getElementById("id.accountno").value;
    var balance = 0;
    for (var idx = 0; idx < gAccount.listAccount.length; idx++) {
        var tmpAcc = new AccountObj();
        tmpAcc = gAccount.listAccount[idx];
        if (tmpAcc.account == sourceAccount) {
            balance = tmpAcc.balance;
            balance = balance.replace(/,/g, "");
          
            break;
        }
    }
    return balance;
}

//check han muc giao dich khoi tao
function checkLimitTransInit(numnAmount) {
    if (numnAmount > parseInt(gAccount.limitTime)) {
        showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_LIMIT_EXCEEDED_TIME"), [formatNumberToCurrency(gAccount.limitTime)]));
        return true;
    }
    if (parseInt(gAccount.totalDay) + numnAmount > parseInt(gAccount.limitDay)) {
        showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_LIMIT_EXCEEDED_DAY"), [formatNumberToCurrency(gAccount.limitDay)]));
        return true;
    }
    // if((numnAmount > gAccount.limitTime) ||
    // (gAccount.totalDay + numnAmount > gAccount.limitDay)){
    //     return true;
    // }
    return false;
}


