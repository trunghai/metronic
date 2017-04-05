gCorp.isBack = false; // Khoi tao
function viewDidLoadSuccess() {
    if (!gCorp.isBack)
        gTrans.batch = {};
    initAngularApp();
}

function viewBackFromOther() {
    gCorp.isBack = true;
}

function initAngularApp() {
    var app = angular.module("batch-transfer-create", []);
    (gUserInfo.lang == 'VN') ? document.getElementById('id-trans-batch').value = CONST_TRANS_BATCH_TYPE_VN[0] : document.getElementById('id-trans-batch').value = CONST_TRANS_BATCH_TYPE_EN[0];
    document.getElementById('id-trans-batch-value').value = CONST_TRANS_BATCH_TYPE[0];
    var idtxn = "T17";

    app.controller("Main", ["$scope", function ($scope) {
        initBottomBar();
        //Mãu thụ hưởng
        function initBottomBar (){
            var arrBottom = new Array();
            arrBottom.push(new MenuBottom("AUTO_BILLING_TAB_LIST", "icon-scheduled-transfers-list"));
            periodParam = new PeriodParam(CONSTANTS.get("CMD_TRANSFER_PERIODIC_MNG_TRANS"),CONST_VAL_PERIODIC_LOCAL[0]);

            navController.initBottomBarWithCallBack("transfer/domestic/transfer-inter-create-scr", arrBottom, "transfer-inter", function (index) {

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
                    updateAccountListInfo();
                    navCachedPages['common/com_list_user_approve'] = null;
                    navController.pushToView("common/com_list_user_approve", true, 'html');
                    break;

            }
        }

        var _this = this;

        /* Khoi tao */
        // Get phuong thuc thong bao neu load lan dau
        if (!gCorp.isBack) {
            gTrans.batch.transType = (gUserInfo.lang == 'VN') ? document.getElementById('id-trans-batch').value = CONST_TRANS_BATCH_TYPE_VN[0] : document.getElementById('id-trans-batch').value = CONST_TRANS_BATCH_TYPE_EN[0];
            var argsArray = [];
            argsArray.push(""); // Bo trong element dau
            argsArray.push({
                sequenceId: 1,
                idtxn: idtxn
            });
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_BATCH_TRANSFER_SALARY"),
                "", "", gUserInfo.lang, gUserInfo.sessionID, argsArray);
            data = getDataFromGprsCmd(gprsCmd);

            _this.selectedFile = CONST_STR.get("TRANS_BATCH_ACC_LIST_SEND_TO_TPB");
            _this.fileExtension = "";

            requestMBServiceCorp(data, false, 0, function (data) {
                var response = JSON.parse(data);
                if (response.respCode == "0") {
                    _this.sendNotiMethod = {
                        key: response.respJsonObj.method,
                        value: CONST_STR.get("COM_NOTIFY_" + response.respJsonObj
                            .method)
                    };
                    gTrans.sendNotiMethod = _this.sendNotiMethod;
                    gTrans.listSourceAccounts = response.respJsonObj.listAccount;
                    gTrans.limit = response.respJsonObj.limit;
                    gTrans.sourceAcc = gTrans.listSourceAccounts[0];
                    /*gTrans.batch.transType.value = response.respJsonObj;
                     gTrans.batch.transType.key = response.respJsonObj;*/
                    gTrans.batch.accountNumbers = gTrans.sourceAcc.account;
                    gTrans.batch.accountBalances = gTrans.sourceAcc.balance;
                    initComboTextAccount(0);
                    $scope.$apply();
                    /*_this.accountNumbers = [];
                     _this.accountBalances = [];
                     for (var i = 0; i < response.respJsonObj.listAccount.length; i++) {
                     var account = response.respJsonObj.listAccount[i];
                     _this.accountNumbers.push(account.account);
                     _this.accountBalances.push(account.balance + " VND");
                     }

                     // Luu vao bien toan cuc
                     gTrans.sendNotiMethod = _this.sendNotiMethod;
                     gTrans.batch.account = response.respJsonObj.listAccount[0];
                     gTrans.batch.accountNumbers = _this.accountNumbers[0];
                     gTrans.batch.accountBalances = _this.accountBalances[0];
                     $scope.$apply();*/
                }

                _this.transType = {
                    value: gTrans.batch.transType,
                    key: CONST_TRANS_BATCH_TYPE[0]
                };
                _this.selectedAcc = {
                    number: gTrans.batch.accountNumbers,
                    balance: gTrans.batch.accountBalances
                };
                gTrans.batch.transType = _this.transType;
                gTrans.batch.account = _this.selectedAcc;
            });
        } else {
            _this.sendNotiMethod = gTrans.sendNotiMethod;
            _this.selectedAcc = gTrans.batch.account;
            _this.accountNumbers = gTrans.batch.accountNumbers;
            _this.accountBalances = gTrans.batch.accountBalances;
            _this.transType = gTrans.batch.transType;
            _this.selectedFile = gTrans.batch.selectedFilename;
            _this.fileExtension = gTrans.batch.fileExtension;
            _this.selectedFile = CONST_STR.get("TRANS_BATCH_ACC_LIST_SEND_TO_TPB");
            // initComboTextAccount(0);
        }

        _this.dialogType = 1; // 1: Loai giao dich, 2: Tai khoan
        _this.transDate = getStringFromDate();

        function initComboTextAccount(index) {
            var accountName = "Invalid";
            var accountNumber = "Invalid";
            var accountBalance = "Invalid";

            try {
                document.getElementById("holder-account-info").innerHTML = "";
                accountName = gUserInfo.accountName;
                accountNumber = gTrans.listSourceAccounts[index].account;
                accountBalance = formatNumberToCurrency(gTrans.listSourceAccounts[index].balance);
            } catch (e) {
                logInfo("khong load duoc thong tin tai khoan");
            }

            comboEl = new Combo({
                containerId: "cb-container", //holder of combo
                accountName: accountName, //account name
                accountNumber: accountNumber, //account number
                accountBalance: accountBalance, //account balance
                borderColor: "yellow", // border color
                containerPadding: "0px", // set padding to holder of combo
                containerMargin: "0px",
                showBorderTop: false,
                fontSize: "15px",
                showBorderBottom: false,//set margin to holder of combo
                clickIt: function () { //handle function click
                    console.log("already click");
                }
            });
            comboEl.show("holder-account-info");
        }

        /* Khi NSD click chon loai giao dich */
        _this.chooseTransactionType = function () {
            /*_this.dialogType = 1;
             var typeValue = gUserInfo.lang === "EN" ? CONST_TRANS_BATCH_TYPE_EN.slice() :
             CONST_TRANS_BATCH_TYPE_VN.slice();
             var typeKey = CONST_TRANS_BATCH_TYPE.slice();

             // Check xem user co quyen tra luong khong
             if (gUserInfo.userRole.indexOf("CorpSal") == -1) {
             typeValue.shift();
             typeKey.shift();
             }

             document.addEventListener("evtSelectionDialog", _this.dialogSelect,
             false);
             document.addEventListener("evtSelectionDialogClose", _this.dialogClose,
             false);
             showDialogList(CONST_STR.get("COM_CHOOSEN_TYPE_TRANS"), typeValue,
             typeKey, false);*/

            var tmpArray1 = (gUserInfo.lang == 'VN') ? CONST_TRANS_BATCH_TYPE_VN : CONST_TRANS_BATCH_TYPE_EN;
            var tmpArray2 = CONST_TRANS_BATCH_TYPE;
            document.addEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            showDialogList(CONST_STR.get('COM_CHOOSEN_TYPE_TRANS'), tmpArray1, tmpArray2, false);
        }

        function showTransTypeSelectionOpen(e) {
            if (currentPage == "transfer/batch/make/batch-transfer-create") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    document.getElementById('id-trans-batch').value = e.selectedValue1;
                    document.getElementById('id-trans-batch-value').value = e.selectedValue2;
                    _this.transType = {
                        value: e.selectedValue1,
                        key: e.selectedValue2
                    }
                    gTrans.batch.transType = _this.transType;
                    showTransTypeSelectionClose();
                }
            }
        }

        function showTransTypeSelectionClose() {
            if (currentPage == "transfer/batch/make/batch-transfer-create") {
                document.removeEventListener("evtSelectionDialog", showTransTypeSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showTransTypeSelectionClose, false);
            }
        }

        /* Khi NSD click chon account */
        _this.chooseAccount = function () {
            /*_this.dialogType = 2;
             document.addEventListener("evtSelectionDialog", _this.dialogSelect,
             false);
             document.addEventListener("evtSelectionDialogClose", _this.dialogClose,
             false);
             showDialogList(CONST_STR.get("TRANS_LOCAL_DIALOG_TITLE_ACC"), _this
             .accountNumbers, _this.accountBalances, true);*/

            var tmpArray1 = [];
            var tmpArray2 = [];
            for (var i in gTrans.listSourceAccounts) {
                tmpArray1.push(gTrans.listSourceAccounts[i].account);
                tmpArray2.push(gTrans.listSourceAccounts[i].balance);
            }
            document.addEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_LOCAL_DIALOG_TITLE_ACC'), tmpArray1, tmpArray2, true);
        }

        function showAccountSelectionOpen(e) {
            if (currentPage == "transfer/batch/make/batch-transfer-create") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    for (var i in gTrans.listSourceAccounts) {
                        if (e.selectedValue1 == gTrans.listSourceAccounts[i].account) {
                            gTrans.sourceAcc = gTrans.listSourceAccounts[i];
                            _this.selectedAcc = {
                                number: gTrans.sourceAcc.account,
                                balance: gTrans.sourceAcc.balance
                            }
                            gTrans.batch.account = _this.selectedAcc;
                            initComboTextAccount(i);
                        }
                    }

                    showAccountSelectionClose();
                }
            }
        }

        function showAccountSelectionClose() {
            resizeMainViewContent(currentPage);
            if (currentPage == "transfer/batch/make/batch-transfer-create") {
                document.removeEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            }
        }

        /* Khi NSD click chon file */
        _this.chooseFile = function () {
            document.getElementById("list-file-input").click();
        };

        /* Khi NSD chon 1 file */
        $scope.fileChange = function () {
            showLoadingMask();
            var inputElement = document.getElementById("list-file-input");
            _this.selectedFile = inputElement.value
                .replace(/.*[\/\\]/, '');
            gTrans.batch.selectedFilename = _this.selectedFile;
            if (bowser.name !== "IE")
                $scope.$apply();

            var fileUpload = inputElement.files[0];
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                gTrans.batch.base64 = e.target.result;
                hideLoadingMask();
            }
            fileReader.readAsDataURL(fileUpload);
        };

        /* Xem va tai template chuyen khoan */
        _this.viewTemplate = function () {
            if (_this.transType.key == "") {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get(
                    "COM_TYPE_TRANSACTION")]));
                return;
            }
            if (_this.transType.key == "T16") {
                _this.templateUrl = "./download/transfer-batch/Payroll_Luong.xls";
            } else {
                _this.templateUrl = "./download/transfer-batch/Interbank_LNH.xls";
            }
        }

        /* Xem danh sach nguoi nhan thong bao */
        _this.viewChecker = function () {
            navController.pushToView('common/com_list_user_approve', true,
                'xsl');
        };

        /* Khi NSD click Tiep tuc */
        _this.submit = function () {
            if (_this.transType.key === "") {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get(
                    "COM_TYPE_TRANSACTION")]));
                return;
            }
            if (_this.selectedAcc.balance === "") {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get(
                    "TRANS_BATCH_ACC_LABEL")]));
                return;
            }
            if (_this.selectedFile === CONST_STR.get("TRANS_BATCH_ACC_LIST_SEND_TO_TPB")) {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get(
                    "TRANS_BATCH_ACC_LIST")]));
                return;
            }

            // Kiem tra kieu file
            var extStartIdx = _this.selectedFile.indexOf(".", _this.selectedFile
                .length - 5);
            if (_this.selectedFile.length < 5 || extStartIdx === -1) {
                showAlertText(CONST_STR.get("CORP_MSG_BATCH_FILE_INVALID_FORMAT"));
                return;
            }
            _this.fileExtension = _this.selectedFile.substring(extStartIdx + 1);
            gTrans.batch.fileExtension = _this.fileExtension;
            if (_this.fileExtension !== "xls" && _this.fileExtension !== "xlsx") {
                showAlertText(CONST_STR.get("CORP_MSG_BATCH_FILE_INVALID_FORMAT"));
                return;
            }

            _this.sendRequest();
        }

        /* Gui du lieu len service */
        _this.sendRequest = function () {
            var idtxn = "T17"; // Lien ngan hang
            if (_this.transType.key === "T16") // Trong TPB
                idtxn = "T16";
            var resquest = {
                sequenceId: 2,
                idtxn: idtxn,
                transType: _this.transType,
                account: _this.selectedAcc.number,
                fileExtension: _this.fileExtension,
                codTrncurr: "VND"
            }

            var responseSuccess = function (data) {
                var response = JSON.parse(data);
                _this.resetFile();
                if (response.respCode == "0") {
                    gTrans.batch.respObj = response;
                    gTrans.batch.respObj.respJson = response.respJsonObj;
                    if (response.respJsonObj.balanceError == 1) {
                        showAlertText(CONST_STR.get("CORP_MSG_TRANS_BATCH_BALANCE_NOT_ENOUGH"));
                        return ;
                    }else{
                        navCachedPages["transfer/batch/make/batch-transfer-review"] = null;
                        navController.pushToView("transfer/batch/make/batch-transfer-review",true);
                    }

                }else
                    showAlertText(response.respContent);
            };
            var responseFailure = function (data) {
                showAlertText(CONST_STR.get("CORP_MSG_BATCH_FILE_INVALID_FORMAT"));
                _this.resetFile();
            }

            var argsArray = [];
            argsArray.push("2"); // Bo trong element dau
            argsArray.push(resquest);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_BATCH_TRANSFER_SALARY"), "", "",
                gUserInfo.lang, gUserInfo.sessionID, argsArray,
                gTrans.batch.base64);
            data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp(data, true, 0, responseSuccess,
                responseFailure);
        }

        /* Khi user click chon 1 item trong dialog */
        _this.dialogSelect = function (e) {
            if (currentPage == "transfer/batch/make/batch-transfer-create") {
                if (_this.dialogType === 1) { // Chon loai giao dich
                    _this.transType.value = e.selectedValue1;
                    _this.transType.key = e.selectedValue2;
                    gTrans.batch.transType = _this.transType;
                } else if (_this.dialogType === 2) { // Chon account
                    _this.selectedAcc.number = e.selectedValue1;
                    _this.selectedAcc.balance = e.selectedValue2;
                    gTrans.batch.account = _this.selectedAcc;
                }

                $scope.$apply(); // Can apply do thay doi ngoai scope
                _this.dialogClose();
            }
        }

        /* Khi dialog close */
        _this.dialogClose = function () {
            if (currentPage ===
                "transfer/batch/make/batch-transfer-create") {
                document.removeEventListener("evtSelectionDialog", _this.dialogSelect, false);
                document.removeEventListener("evtSelectionDialogClose", _this.dialogClose, false);
            }
        };

        // Khi NSD click chuyen tab
        _this.changeTab = function () {
            navController.pushToView('transfer/batch/mng/batch-transfer-mng-scr', true,
                'html');
        };

        // Reset thong tin ve file
        _this.resetFile = function () {
            _this.selectedFile = CONST_STR.get("TRANS_BATCH_ACC_LIST_SEND_TO_TPB");
            gTrans.batch.base64 = "";
            var fileForm = document.getElementById("file-form");
            if (fileForm != null)
                fileForm.reset();
            _this.fileExtension = "";
            $scope.$apply();
        };

    }]);

    // Start app
    angular.bootstrap(document.getElementById("mainViewContent"), ["batch-transfer-create"]);

}
//================= PROCESS DIALOG CONTACT TRANSFER ==================================//
function reInitContactTransfer() {
    initDialog(CONST_STR.get('BOTTOM_BAR_CONTACT'),"","transfer/template-transfer/template-contact-doc",
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
    bottomBar.resumeView('transfer/batch/make/batch-transfer-create','batch-transfer-create');
    actionbar.showActionBar();
    document.removeEventListener('evtChangeWidthMobile',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthDesktop',reInitContactTransfer,false);
    document.removeEventListener('evtChangeWidthMobile',temptranferlocalbank,false);
    document.removeEventListener('evtChangeWidthDesktop',temptranferlocalbank,false);
}
function callbackContactTranfer(obj) {
    console.log(obj);
    // double click template tranfer contact doc
    modalDialog.hideDialogFull();
    callbackCloseDialogSchedulerTransfer();
    var destinationAcc = document.getElementById("trans.targetaccount");
    var nodeDesAcc = document.getElementById("trans.targetaccountname");

    if (obj.transValue != ""){
        destinationAcc.value = obj.transValue;
        tmpDestinationAccName = obj.peopleName;
        var transferAccount = document.getElementById("trans.accountName");
        transferAccount.value = tmpDestinationAccName;
    }
    //nodeDesAcc.innerHTML = "<h6 class='h6style'>" + CONST_STR.get('TRANS_LOCAL_ACC_DESTINATION_TITLE') + ": <b>" + obj.peopleName + "</b></h6>";

}
