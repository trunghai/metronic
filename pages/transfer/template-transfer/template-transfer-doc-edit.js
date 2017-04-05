/**
 * Created by JetBrains WebStorm.
 * User: AnhNTT.FSOFT
 * Date: 3/22/17
 * Time: 11:01 AM
 * To change this template use File | Settings | File Templates.
 */
function viewDidLoadSuccess() {

    init();
    logInfo(temptranfer[gTrans.selectedview]);
    document.getElementById("id.tenmau").value = temptranfer[gTrans.selectedview].name;
    if(gEdit == 1){
        document.getElementById("trongtpb").style.display= 'block';
        var newBalance = 0;
        if(temptranfer[gTrans.selectedview] != null && temptranfer[gTrans.selectedview] != undefined){
            for (var i in gTrans.listSourceAccounts){
                if (temptranfer[gTrans.selectedview].tai_khoan_nguon == gTrans.listSourceAccounts[i].account){
                    newBalance = gTrans.listSourceAccounts[i].balance;
                    break;
                }
            }
            comboEl.refresh({
                accountNumber :temptranfer[gTrans.selectedview].tai_khoan_nguon,
                accountBalance :  formatNumberToCurrency(newBalance)
            });
            gTrans.editTemp.sourceAcc = temptranfer[gTrans.selectedview].tai_khoan_nguon;
            document.getElementById("trans.targetaccount").value = temptranfer[gTrans.selectedview].tai_khoan_dich;
            document.getElementById("trans.accountName").value = temptranfer[gTrans.selectedview].ten_tai_khoan_dich;
            document.getElementById("trans.amount").value = formatNumberToCurrency(temptranfer[gTrans.selectedview].so_tien);
            document.getElementById("trans.content").value = temptranfer[gTrans.selectedview].noi_dung;
        }
    }else if(gEdit == 2 && gTrans.flagEditTemplate == 0){
        document.getElementById("liennganhang").style.display= 'block';
        var newBalance = 0;
        if(temptranfer[gTrans.selectedview] != null && temptranfer[gTrans.selectedview] != undefined){
            for (var i in gTrans.listSourceAccounts){
                if (temptranfer[gTrans.selectedview].SOURCE_ACC == gTrans.listSourceAccounts[i].CUST_AC_NO){
                    newBalance = gTrans.listSourceAccounts[i].BALANCE;
                    break;
                }
            }
            comboEl.refresh({
                accountNumber :temptranfer[gTrans.selectedview].SOURCE_ACC,
                accountBalance :  formatNumberToCurrency(newBalance)
            });
            gTrans.editTemp.sourceAcc = temptranfer[gTrans.selectedview].SOURCE_ACC;
            if(temptranfer[gTrans.selectedview].NUMAMOUNT != ""){
                document.getElementById("trans.amount").value = formatNumberToCurrency(temptranfer[gTrans.selectedview].NUMAMOUNT);
            }else{
                document.getElementById("trans.amount").value = "";
            }

            if(temptranfer[gTrans.selectedview].BRANCH_NAME != ""){
                document.getElementById("spanbankname").innerHTML = temptranfer[gTrans.selectedview].BRANCH_NAME;
            }else{
                document.getElementById("spanbankname").innerHTML = "";
            }

            if(temptranfer[gTrans.selectedview].BRANCH_NAME != ""){
                document.getElementById("lnh.targetaccount").value = temptranfer[gTrans.selectedview].tai_khoan_dich;
            }else{
                document.getElementById("lnh.targetaccount").value = "";
            }

            if(temptranfer[gTrans.selectedview].ten_tai_khoan_dich != ""){
                document.getElementById("lnh.accountName").value = temptranfer[gTrans.selectedview].ten_tai_khoan_dich;
            }else{
                document.getElementById("lnh.accountName").value = "";
            }

            if(temptranfer[gTrans.selectedview].noi_dung != ""){
                document.getElementById("trans.content").value = temptranfer[gTrans.selectedview].noi_dung;
            }else{
                document.getElementById("trans.content").value = "";
            }

//            document.getElementById("spanbankname").innerHTML = temptranfer[gTrans.selectedview].BRANCH_NAME;
//            document.getElementById("lnh.targetaccount").value = temptranfer[gTrans.selectedview].tai_khoan_dich;
//            document.getElementById("lnh.accountName").value = temptranfer[gTrans.selectedview].ten_tai_khoan_dich;
//            document.getElementById("trans.content").value = temptranfer[gTrans.selectedview].noi_dung;
        }

    }else if(gEdit == 3){
        document.getElementById("quathe").style.display= 'block';
        var newBalance = 0;
        if(temptranfer[gTrans.selectedview] != null && temptranfer[gTrans.selectedview] != undefined){
            for (var i in gTrans.listSourceAccounts){
                if (temptranfer[gTrans.selectedview].tai_khoan_nguon == gTrans.listSourceAccounts[i].account){
                    newBalance = gTrans.listSourceAccounts[i].balance;
                    break;
                }
            }
            comboEl.refresh({
                accountNumber :temptranfer[gTrans.selectedview].tai_khoan_nguon,
                accountBalance :  formatNumberToCurrency(newBalance)
            });
            gTrans.editTemp.sourceAcc = temptranfer[gTrans.selectedview].tai_khoan_nguon;
//            gTrans.sourceAcc.account = obj.tai_khoan_nguon;
//            gTrans.sourceAcc.balance = newBalance;
            document.getElementById("quathe.accountcard").value = temptranfer[gTrans.selectedview].tai_khoan_dich;
            document.getElementById("trans.amount").value = temptranfer[gTrans.selectedview].so_tien;
            document.getElementById("trans.content").value = temptranfer[gTrans.selectedview].noi_dung;
            var numStr = convertNum2WordWithLang(removeSpecialChar(temptranfer[gTrans.selectedview].so_tien), gUserInfo.lang);//Lay ra chuoi doc so tien
            if(numStr){
                var nodeNumTxt = document.getElementById("trans.amounttotext");
                nodeNumTxt.innerHTML = "<div class='txtmoneystyle'>" + CONST_STR.get('TRANS_LOCAL_NUM_TO_WORD') + ": " + numStr + "</div>";
            }
        }

    }else if(gEdit == 5 && gTrans.flagEditTemplate == 0){
        document.getElementById("quacmnd").style.display= 'block';

        var newBalance = 0;
        if (temptranfer[gTrans.selectedview] != null && temptranfer[gTrans.selectedview] != undefined) {
            for (var i in gTrans.listSourceAccounts) {
                if (temptranfer[gTrans.selectedview].tai_khoan_nguon == gTrans.listSourceAccounts[i].account) {
                    newBalance = gTrans.listSourceAccounts[i].balance;
                    break;
                }
            }
            comboEl.refresh({
                accountNumber:temptranfer[gTrans.selectedview].tai_khoan_nguon,
                accountBalance:formatNumberToCurrency(newBalance)
            });
            gTrans.editTemp.sourceAcc = temptranfer[gTrans.selectedview].tai_khoan_nguon;
            document.getElementById("trans.amount").value = formatNumberToCurrency(temptranfer[gTrans.selectedview].so_tien);
            document.getElementById("cmt.id").value = temptranfer[gTrans.selectedview].so_cmnd;
            document.getElementById("cmt.begindate").value = temptranfer[gTrans.selectedview].ngay_cap_cmnd;
            document.getElementById("cmt.place").value = temptranfer[gTrans.selectedview].noi_cap_cmnd;
            document.getElementById("cmt.nameReceive").value = temptranfer[gTrans.selectedview].name;
            document.getElementById("cmt.numReceive").value = temptranfer[gTrans.selectedview].so_dien_thoai;
            document.getElementById('cmt.span.bankname').innerHTML  = temptranfer[gTrans.selectedview].ngan_hang_nhan;
            document.getElementById("trans.content").value = temptranfer[gTrans.selectedview].noi_dung;
            gTrans.dti.citadCode = temptranfer[gTrans.selectedview].SORTCODE;
            gTrans.editTemp.sortCode = temptranfer[gTrans.selectedview].SORTCODE;
            gTrans.dti.bankCode = temptranfer[gTrans.selectedview].BANK_CODE;
            gTrans.editTemp.bankCode = temptranfer[gTrans.selectedview].BANK_CODE;
        }

    }else if(gEdit == 6 && gTrans.flagEditTemplate == 0){
        document.getElementById("quaSoTaiKhoan").style.display= 'block';


        var newBalance = 0;
        if (temptranfer[gTrans.selectedview] != null && temptranfer[gTrans.selectedview] != undefined) {
            for (var i in gTrans.listSourceAccounts) {
                if (temptranfer[gTrans.selectedview].tai_khoan_nguon == gTrans.listSourceAccounts[i].account) {
                    newBalance = gTrans.listSourceAccounts[i].balance;
                    break;
                }
            }
            comboEl.refresh({
                accountNumber:temptranfer[gTrans.selectedview].tai_khoan_nguon,
                accountBalance:formatNumberToCurrency(newBalance)
            });
            gTrans.editTemp.sourceAcc = temptranfer[gTrans.selectedview].tai_khoan_nguon;
            document.getElementById("trans.amount").value = formatNumberToCurrency(temptranfer[gTrans.selectedview].so_tien);
            document.getElementById("cmt.nameReceive").value = temptranfer[gTrans.selectedview].name;
            document.getElementById("trans.content").value = temptranfer[gTrans.selectedview].noi_dung;
            document.getElementById("ctTKBankName").innerHTML = temptranfer[gTrans.selectedview].ngan_hang_nhan;
            document.getElementById("ctqsotk.targetaccount").value = temptranfer[gTrans.selectedview].BENE_ACCTNO;
//            gTrans.dti.citadCode = temptranfer[gTrans.selectedview].SORTCODE;
            gTrans.dti.bankCode = temptranfer[gTrans.selectedview].BANK_CODE;
            gTrans.editTemp.bankCode = temptranfer[gTrans.selectedview].BANK_CODE;
        }
    }
}

function init() {
    angular.module('EbankApp').controller('template-transfer-doc-edit', function ($scope, requestMBServiceCorp) {
        $scope.initComboTextAccount = function (index){
            var accountName =  "Invalid";
            var accountNumber = "Invalid";
            var accountBalance = "Invalid";
            try{
                document.getElementById("holder-account-info").innerHTML = "";
                if(gTrans.idtxn == "T13"){
                    accountName = gUserInfo.accountName;
                    accountNumber = gTrans.listSourceAccounts[index].CUST_AC_NO;
                    accountBalance = formatNumberToCurrency(gTrans.listSourceAccounts[index].BALANCE);
                }else{
                    accountName = gUserInfo.accountName;
                    accountNumber = gTrans.listSourceAccounts[index].account;
                    accountBalance = formatNumberToCurrency(gTrans.listSourceAccounts[index].balance);
                }
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
                fontSize : "15px",
                showBorderBottom : false,//set margin to holder of combo
                clickIt : function (){ //handle function click
                    console.log("already click");
                }
            });
            comboEl.show("holder-account-info");
        }

        //=================SHOW DIALOG Acc====================================//
        $scope.showAccountSelection =function () {
            var tmpArray1 = [];
            var tmpArray2 = [];
            for (var i in gTrans.listSourceAccounts){
                tmpArray1.push(gTrans.listSourceAccounts[i].account);
                tmpArray2.push(gTrans.listSourceAccounts[i].balance);
            }
            document.addEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
            document.addEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            showDialogList(CONST_STR.get('TRANS_PERIODIC_MGN_PAYEE_SELCT'), tmpArray1, tmpArray2, true);
        }

        function showAccountSelectionOpen(e) {
            if (currentPage == "transfer/template-transfer/template-transfer-doc-edit") {
                if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
                    for (var i in gTrans.listSourceAccounts){
                        if (e.selectedValue1 == gTrans.listSourceAccounts[i].account){
                            gTrans.editTemp.sourceAcc = gTrans.listSourceAccounts[i];
                            $scope.initComboTextAccount(i);
                        }
                    }

                    showAccountSelectionClose();
                }
            }
        }

        function showAccountSelectionClose() {
            resizeMainViewContent(currentPage);
            if (currentPage == "transfer/template-transfer/template-transfer-doc-edit") {
                document.removeEventListener("evtSelectionDialog", showAccountSelectionOpen, false);
                document.removeEventListener("evtSelectionDialogClose", showAccountSelectionClose, false);
            }
        }

        //chon ngan hang
        $scope.showBankSelection =function(){
            gTrans.showBankSelection = true;
            gTrans.redirect ="transfer/template-transfer/template-transfer-doc-edit";
            navController.pushToView("transfer/domestic/trans-dti-list-bank", true,'html');
            document.addEventListener("evtSelectedBranch", handleInputBankBranch, false);
        }

        function handleInputBankBranch(e) {
            document.removeEventListener("evtSelectedBranch", handleInputBankBranch, false);
            gTrans.editTemp.bankCode = e.bankCode;
            gTrans.editTemp.sortCode = e.branchCode;
            gTrans.dti.bankCode = e.bankCode;
            gTrans.dti.citadCode = e.branchCode;
            var branch = document.getElementById('spanbankname');
            branch.innerHTML  = e.bankName + "-" + e.branchName;
            if(gTrans.idtxn == "T20"){
                var branch = document.getElementById('cmt.span.bankname');
                branch.innerHTML  = e.bankName + "-" + e.branchName;
            }
            gTrans.dti.branchName = e.branchName;
            gTrans.dti.bankCityCode = e.bankCityCode;
            goBack = e.viewBack;
            gTrans.flagEditTemplate = 1;// luu bien de k load lai khi chon ngan hang
        }
//     end chon ngan hang

        $scope.initComboTextAccount(0);


        $scope.LuuMauChuyenTien = function(){

           var targetaccount = document.getElementById("trans.targetaccount").value;

           var numamount = document.getElementById("trans.amount").value;
           var content = document.getElementById("trans.content").value;
           var accountName = document.getElementById("trans.accountName").value;
            var beneName_ = "";
            if(gTrans.idtxn == "T20"){
                gTrans.editTemp.passport  = document.getElementById("cmt.id").value;
                gTrans.editTemp.issuedPlace = document.getElementById("cmt.place").value;
                gTrans.editTemp.phone = document.getElementById("cmt.numReceive").value;
                gTrans.editTemp.issuedTime = document.getElementById("cmt.begindate").value;
                accountName = document.getElementById("cmt.nameReceive").value;
                targetaccount = document.getElementById("cmt.id").value;
                gTrans.editTemp.sortCode = gTrans.dti.citadCode;
                gTrans.editTemp.bankCode = gTrans.dti.bankCode;
            }else{
                gTrans.editTemp.passport  = "";
                gTrans.editTemp.issuedPlace = "";
                gTrans.editTemp.phone = "";
                gTrans.editTemp.issuedTime = "";
            }
            if(gTrans.idtxn == "T21"){
                targetaccount = document.getElementById("ctqsotk.targetaccount").value;
            }
            if(gTrans.idtxn == "T13"){
                var targetaccount = document.getElementById("lnh.targetaccount").value;
                var accountName = document.getElementById("lnh.accountName").value;
            }
            if(gTrans.idtxn != "T21" && gTrans.idtxn != "T19"){
                beneName_ = accountName;
            }
            if(gTrans.idtxn == "T19"){
                targetaccount = document.getElementById("quathe.accountcard").value;
            }
            if(gTrans.editTemp.bankCode == undefined){
                gTrans.editTemp.bankCode = "";
            }
            if(gTrans.editTemp.sortCode == undefined){
                gTrans.editTemp.sortCode = null;
            }
            var request = {
                idtxn: "M01",
                sequenceId: 3, // 3 la them sua
                srcAccount: gTrans.editTemp.sourceAcc,
                desAccount: targetaccount,
                beneName: beneName_,
                numamount: removeSpecialChar(numamount),
                content: content,
                bankCode: gTrans.editTemp.bankCode,
                sortCode: gTrans.editTemp.sortCode,
                beneId: temptranfer[gTrans.selectedview].BENEID,
                phone: gTrans.editTemp.phone,
                issuedTime: gTrans.editTemp.issuedTime,
                issuedPlace: gTrans.editTemp.issuedPlace,
                passport: gTrans.editTemp.passport,
                transType: gTrans.idtxn
            };

            var arrayArgs = new Array();
            arrayArgs.push("3");
            arrayArgs.push(request);

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_MANAGE_TEMPLATE"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);

            data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == 0){
                    showAlertText(CONST_STR.get('SAVES_TEMPLATE_DONE'));
                    return;
                    gTrans.flagEditTemplate = 0;
                }

            }, function(){
                showAlertText(CONST_STR.get('TOPUP_SERVICE_ERROR_MSG'));
                return;
            });

        }

    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])

}