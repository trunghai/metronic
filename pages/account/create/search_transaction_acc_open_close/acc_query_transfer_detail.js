var reloadPageFlag;
gTrans.transInfo = {};

var strXml = "";
/*** HEADER ***/
var gprsResp = new GprsRespObj("", "", "", "");

function viewDidLoadSuccess() {
    navController.getBottomBar().hide();
    logInfo('debt detail load success');

    var obj = gAccount.objTransaction;
    // hide table gui tien
    if (obj.IDTXN == "A13") {
        document.getElementById('tableTatToan').style.display = 'none';

        // // set data to screen
        document.getElementById("trans_code").innerHTML = id_FCATREF;
        document.getElementById("create_date").innerHTML = date_make;
        document.getElementById("check_date").innerHTML = date_check;
        document.getElementById("status").innerHTML = cod_status;

        document.getElementById("trans_type").innerHTML = trans_type;
        document.getElementById("account_deduct_money").innerHTML = id_srcacct;
        document.getElementById("num_money_saving").innerHTML = num_amount;
        document.getElementById("period").innerHTML = dur_name;
        document.getElementById("account_period_datestart").innerHTML = date_send;
        document.getElementById("expire_date").innerHTML = date_end;
        document.getElementById("interest").innerHTML = Rate;
        document.getElementById("profits_interim").innerHTML = pro_rate;
        document.getElementById("announce_deadline").innerHTML = announceN;
        document.getElementById("send_approver").innerHTML = sned_method;

        if (obj.APPROVAL_AUTHORITY == "N" && obj.CODSTATUS == "INT")
        {
            document.getElementById('inputCancelTransaction').style.display = '';
        }
        else
        {
            document.getElementById('inputCancelTransaction').style.display = 'none';
        }
    }
    // hide table tat toan
    else if (obj.IDTXN == "A14") {
        document.getElementById('tableGuitien').style.display = 'none';
        document.getElementById('comTrasInfo').style.display = 'none';
        document.getElementById('incomTrasInfo').style.display = 'none';
        // // set data to screen
        document.getElementById("trans_code").innerHTML = id_FCATREF;
        document.getElementById("create_date").innerHTML = date_make;
        document.getElementById("check_date").innerHTML = date_check;
        document.getElementById("status").innerHTML = cod_status;

        document.getElementById("accHisTransType").innerHTML = transType;
        document.getElementById("accFinalize").innerHTML = accFinal;
        document.getElementById("accCurrencyTitle").innerHTML = accCurrency;
        document.getElementById("accNumber").innerHTML = accNumb;
        document.getElementById("accFinalizeRoot").innerHTML = accFinalRoot;
        document.getElementById("comPeriod").innerHTML = comPeriod;
        document.getElementById("transPerAccNo").innerHTML = transPer;
    }
    init();
    if(gUserInfo.userRole.indexOf('CorpAuth') != -1){
        document.getElementById('divCancelTransaction').style.display = 'none';
    }else{
        document.getElementById('divCancelTransaction').style.display = '';
    }

}
/*** INIT VIEW ***/
function loadInitXML() {
    var tmpXml = getReviewXmlStore();
    if (strXml == '' || strXml == undefined) {
        strXml = XMLToString(tmpXml);
    }

    return tmpXml;
}

function init() {
    angular.module('EbankApp').controller('acc_query_transfer_detail', function ($scope, requestMBServiceCorp) {
        // Thực hiện việc gọi lại màn hình cũ
        $scope.goBack = function () {
            navController.getBottomBar().hide();
            navController.popView(true);
            navCachedPages["account/create/search_transaction_acc_open_close/acc_query_transfer_detail"] = null;
        }
        $scope.cancelTransaction = function () {
            var obj = gAccount.objTransaction;

            //mo so tiet kiemn
            var idtxn = obj.IDTXN;
            if (idtxn == "A13") {
                var rate, valueRate = "";
                var tmpArrRate = (gUserInfo.lang == 'EN') ? CONST_ACCOUNT_QUERY_RATE_MONTH_EN : CONST_ACCOUNT_QUERY_RATE_MONTH_VN;
                for (var i = 0; i < tmpArrRate.length; i++) {
                    if (obj.DURNAME == tmpArrRate[i]) {
                        rate = tmpArrRate[i];
                        break;
                    }
                }
                if (rate == undefined) {
                }
                else {
                    valueRate = rate + "/năm";
                }

                var dueType = obj.DUETYPE; //lua chon 1, 2 ha 3
                var destAccount = obj.TXTDESTACCT;
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

            }

            var objectValueClient = new Object();
            sequenceId = "4";
            objectValueClient.idtxn = "A15";
            objectValueClient.sequenceId = "4";
            objectValueClient.transactionId = gAccount.transId;

            gTrans.requestData = objectValueClient;
            gTrans.cmdType = CONSTANTS.get("CMD_ACCOUNT_QUERY_TRANSACTION");
            gTrans.ortherSrc = "account/create/search_transaction_acc_open_close/acc-query_transaction";
            var valueidtxn = "";

            var idtxn = obj.IDTXN;
            if (idtxn == 'A13') {
                gTrans.src = "pages/account/create/search_transaction_acc_open_close/acc_query_transfer_view_send_money.html";
                valueidtxn = CONST_STR.get("ACC_SEND_MONEY");
                var dueType = obj.DUETYPE; //lua chon 1, 2 ha 3
                var destAccount = obj.TXTDESTACCT;
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
                gTrans.transInfo.transId = obj.IDFCATREF;
                gTrans.transInfo.valueidtxn = valueidtxn;// //loai giao dich
                gTrans.transInfo.id_srcacct = obj.IDSRCACCT;//tai khoan trich tien
                gTrans.transInfo.num_balance = formatNumberToCurrencyWithSymbol(obj.NUM_BALANCE, " " + obj.CODTRNCURR);// so du kha dung
                gTrans.transInfo.num_balSubAmo = formatNumberToCurrencyWithSymbol(
                    removeSpecialChar(obj.NUM_BALANCE) - removeSpecialChar(obj.NUMAMOUNT), " " + obj.CODTRNCURR);//so du sau khi trich tien
                gTrans.transInfo.num_amount = formatNumberToCurrencyWithSymbol(obj.NUMAMOUNT);// số tiền gửi
                gTrans.transInfo.dur_name = obj.DURNAME;//kỳ hạn gửi
                gTrans.transInfo.date_send = obj.DATE_SEND;// ngày gửi
                gTrans.transInfo.date_end = obj.DATE_END;// ngày đáo hạn
                gTrans.transInfo.rate = obj.RATE + "%/năm"; // lãi suất tiền gửi
                gTrans.transInfo.pro_rate = formatNumberToCurrencyWithSymbol(obj.PROVISIONAL_RATES, " " + obj.CODTRNCURR);// lãi tạm tính
                gTrans.transInfo.announceN = announce;// chỉ thị khi đáo hạn
                gTrans.transInfo.sned_method = CONST_STR.get("COM_NOTIFY_" + obj.SENDMETHOD);// gửi thông báo cho người duyệt

            } else if (idtxn == 'A14') {
                gTrans.src = "pages/account/create/search_transaction_acc_open_close/acc_query_transfer_view_finalize.html";
                valueidtxn = CONST_STR.get("ACCOUNT_PERIOD_BTN_FINAL");
                var duration = parseInt(obj.TENOR_MONTHS) + parseInt(obj.TENOR_YEARS) * 12;

                gTrans.transInfo.transId = obj.IDFCATREF;
                gTrans.transInfo.dateMake = obj.DATMAKE;

                gTrans.transInfo.transType = CONST_STR.get("ACC_CLOSE_SAVING_ACCOUNT");
                gTrans.transInfo.accFinal = CONST_STR.get("ACC_DIGITAL_SAVING");
                gTrans.transInfo.accCurrency = obj.CODTRNCURR;
                gTrans.transInfo.accNumb = obj.IDSRCACCT;
                gTrans.transInfo.accFinalRoot = formatNumberToCurrencyWithSymbol(obj.DEPOSIT_AMT,
                    " " + obj.CODTRNCURR);
                gTrans.transInfo.comPeriod = duration + " " + CONST_STR.get("ACCOUNT_PERIOD_MONTH");
                gTrans.transInfo.transPer = obj.TXTDESTACCT;

            }


            updateAccountListInfo();
            navController.pushToView("common/common-review/transfer-review-scr", true, "html");

        }

    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}