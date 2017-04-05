/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 1/6/17
 * Time: 10:15 AM
 * To change this template use File | Settings | File Templates.
 */
function viewDidLoadSuccess() {
    resizeMainViewContent(currentPage);
    initData();

}

function initData(){
    angular.module('EbankApp').controller('transfer-detail', function ($scope, requestMBServiceCorp) {
        navController.getBottomBar().hide();
        navCachedPages["transfer/query/query-transfer"] = null;
        $scope.statusVN = {"ABH" : "Đã duyệt", "INT": "Chờ duyệt", "REJ": "Từ chối", "CAN": "Hủy giao dịch", "APT": "Duyệt một phần", "RBH": "Duyệt không thành công", "CAC": "Hủy giao dịch", "STH" : "Đang xử lý",
            "HBH" : "Hồ sơ đã được tiếp nhận", "REH" : "Hoàn chứng từ", "IBS" : "Chờ duyệt bổ sung chứng từ", "APS" : "Duyệt một phần BS chứng từ",
            "RES" : "Từ chối BS chứng từ", "RBS" : "Duyệt BS CTừ  không thành công", "SBS" : "Đang xử lý BS chứng từ", "RJS" : "TPBank từ chối BS chứng từ","RSA":"TPBank từ chối"};
        $scope.infoTrans = gTrans.infoDetail;
        var arrMedial = new Array();
        arrMedial = gTrans.detailInfo;
        document.getElementById("infoAcc").innerHTML = genAccInfo(arrMedial);

        var arrTrans = new Array();
        arrTrans= gTrans.detailInfo;
        document.getElementById("infoTrans1").innerHTML = genInfoTrans(arrTrans);
        
        $scope.onBackClick = function () {
            navCachedPages['transfer/query/query-transfer'] = null;
            navController.popView(true);
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}
// huy giao dich
function onCancelClick(){
    navCachedPages['transfer/query/query-transfer-authen'] = null;
    navController.pushToView("transfer/query/query-transfer-authen", true,'html');
}
// thong tin tai khoan
function genAccInfo(inArrTrans){
    var transInfo = gTrans.detailInfo[0]
    var contentHTML = '';
    for (var i=0; i< inArrTrans.length; i++ ){
        var inAccObj = inArrTrans[i];
        contentHTML += "<table width='100%' align='center' class='recycler-table-ebank'>";
        contentHTML += "<tr class='recycler-row-normal'>";
        contentHTML += "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('COM_TYPE_TRANSACTION')+"</span></td>";
        if(transInfo.IDTXN == "T11"){
            contentHTML += "<td width='50%' class='recycler-row-align-midle-right'><span>"+CONST_STR.get('TRANS_BATCH_TYPE_TPB')+"</span></td>";
        }
        if(transInfo.IDTXN == "T12"){
            contentHTML += "<td width='50%' class='recycler-row-align-midle-right'><span>"+CONST_STR.get('TRANS_BATCH_TYPE_TPB')+"</span></td>";
        }
        if(transInfo.IDTXN == "T13"){
            contentHTML += "<td width='50%' class='recycler-row-align-midle-right'><span>"+CONST_STR.get('TRANS_BATCH_TYPE_OTHER')+"</span></td>";
        }
        if(transInfo.IDTXN == "T19"){
            contentHTML += "<td width='50%' class='recycler-row-align-midle-right'><span>"+CONST_STR.get('AUTHORIZE_TRANS_TIT_T19')+"</span></td>";
        }
        if(transInfo.IDTXN == "T20"){
            contentHTML += "<td width='50%' class='recycler-row-align-midle-right'><span>"+CONST_STR.get('AUTHORIZE_TRANS_TIT_T20')+"</span></td>";
        }
        if(transInfo.IDTXN == "T21"){
            contentHTML += "<td width='50%' class='recycler-row-align-midle-right'><span>"+CONST_STR.get('AUTHORIZE_TRANS_TIT_T21')+"</span></td>";
        }
        contentHTML += "</tr>";
        contentHTML += "<tr class='recycler-row-normal'>"+
            "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('TRANS_BATCH_ACC_LABEL')+"</span></td>"+
            "<td width='50%' class='recycler-row-align-midle-right'><span>"+ inAccObj.IDSRCACCT+"</span></td>"+
            "</tr>";
        contentHTML += "<tr class='recycler-row-normal'>"+
            "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('ACC_AVAI_BALANCE_TITLE')+"</span></td>"+
            "<td width='50%' class='recycler-row-align-midle-right'><span>"+ formatNumberToCurrency(inAccObj.BALANCE_BEFOR)  + ' ' + inAccObj .CODTRNCURR+"</span></td>"+
            "</tr>";

    }
    contentHTML +=  "</table>";
    return contentHTML;
}
// thong tin giao dich
function genInfoTrans(inArrTransInfo){
    var destAcc = gTrans.detailInfo[0];
    var contentHTML = '';
    for (var i=0; i< inArrTransInfo.length; i++ ){
        var inTrans = inArrTransInfo[i];
        contentHTML += "<table width='100%' align='center' class='recycler-table-ebank'>";
        if(destAcc.IDTXN == "T20"){
            // so cmtnd, ho chieu
            contentHTML += "<tr class='recycler-row-normal'>"+
                "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('IDENTIFICATION_NUMBER')+"</span></td>"+
                "<td width='50%' class='recycler-row-align-midle-right'><span>"+ inTrans.PASSPORT +"</span></td>"+
                "</tr>";
            // ngay cap
            contentHTML += "<tr class='recycler-row-normal'>"+
                "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('IDENTIFICATION_TIME')+"</span></td>"+
                "<td width='50%' class='recycler-row-align-midle-right'><span>"+ inTrans.DATISSUE +"</span></td>"+
                "</tr>";
            // noi cap
            contentHTML += "<tr class='recycler-row-normal'>"+
                "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('IDENTIFICATION_PLACE')+"</span></td>"+
                "<td width='50%' class='recycler-row-align-midle-right'><span>"+ inTrans.PLACEISSUE +"</span></td>"+
                "</tr>";
            // so dien thoai
            contentHTML += "<tr class='recycler-row-normal'>"+
                "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('IDENTIFICATION_PHONE_NUMBER_2')+"</span></td>"+
                "<td width='50%' class='recycler-row-align-midle-right'><span>"+ inTrans.TXTPAYMTDETAILS4 +"</span></td>"+
                "</tr>";
        }else{
            // tai khoan nhan
            contentHTML += "<tr class='recycler-row-normal'>";
            if(destAcc.IDTXN == "T19"){
                contentHTML += "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('TRANS_CARD_CARD_NUMBER')+"</span></td>";
            }else{
                contentHTML += "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('TRANS_LOCAL_ACC_DESTINATION')+"</span></td>";
            }
            contentHTML += "<td width='50%' class='recycler-row-align-midle-right'><span>"+ inTrans.TXTDESTACCT +"</span></td>"+
                "</tr>";
        }
        // chu tai khoan nhan
        contentHTML += "<tr class='recycler-row-normal'>";
        if(destAcc.IDTXN == "T21"){
            contentHTML += "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('IDENTIFICATION_RECEIVER_NAME')+"</span></td>";
        }else{
            contentHTML += "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('TRANS_DEST_ACCOUNT_NAME_TITLE')+"</span></td>";
        }
        contentHTML += "<td width='50%' class='recycler-row-align-midle-right'><span>"+ inTrans.TXTBENNAME +"</span></td>"+
            "</tr>";
        /*// ngan hang nhan
        if(destAcc.IDTXN == 'T13' || destAcc.IDTXN != 'T19' || destAcc.IDTXN == 'T20' || destAcc.IDTXN == 'T21'){
            contentHTML += "<tr class='recycler-row-normal'>"+
                "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('TRANS_BANK_TITLE')+"</span></td>"+
                "<td class='recycler-row-align-midle-right'><span>"+ inTrans.DESTBRANCH +"</span></td>"+
                "</tr>";
        }
        // ngan hang nhan
        if(destAcc.IDTXN == 'T19'){
            contentHTML += "<tr class='recycler-row-normal'>"+
                "<td class='recycler-row-align-midle-left'><span>"+CONST_STR.get('TRANS_BANK_TITLE')+"</span></td>"+
                "<td class='recycler-row-align-midle-right'><span>"+ inTrans.BANK_NAME1 +"</span></td>"+
                "</tr>";
        }*/

        // so tien
        contentHTML += "<tr class='recycler-row-normal'>"+
            "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('TRANS_PERIODIC_AMOUNT')+"</span></td>"+
            "<td width='50%' class='recycler-row-align-midle-right'><span>"+ formatNumberToCurrency(inTrans.NUMAMOUNT) + " " + inTrans.CODTRNCURR+"</span></td>"+
            "</tr>";
        // phi dich vu
        contentHTML += "<tr class='recycler-row-normal'>"+
            "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('CREDIT_CARD_PAYMENT_FEE')+"</span></td>"+
            "<td width='50%' class='recycler-row-align-midle-right'><span>"+ formatNumberToCurrency(inTrans.CHARGEFORDOM) + " " + inTrans.CODTRNCURR +"</span></td>"+
            "</tr>";
        // nguoi chiu phi
        contentHTML += "<tr class='recycler-row-normal'>"+
            "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('COM_SENDER_CHARGE')+"</span></td>";
        if(destAcc.CHARGEINCL =='N'){
            contentHTML += "<td width='50%' class='recycler-row-align-midle-right'><span>"+ CONST_STR.get('IDENTIFICATION_FEE_SENDER') +"</span></td>";
        }else{
            contentHTML += "<td width='50%' class='recycler-row-align-midle-right'><span>"+ CONST_STR.get('IDENTIFICATION_FEE_RECEIVER_PAY') +"</span></td>";
        }
        contentHTML += "</tr>";
        // noi dung
        contentHTML += "<tr class='recycler-row-normal'>"+
            "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('TRANS_PERIODIC_CONTENT')+"</span></td>"+
            "<td width='50%' class='recycler-row-align-midle-right'><span>"+ inTrans.TXTPAYMTDETAILS1+"</span></td>"+
            "</tr>";
        // quan ly nguoi thu huong
        if(destAcc.IDTXN != 'T11'){
            contentHTML += "<tr class='recycler-row-normal'>"+
                "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('COM_SAVE_BENE')+"</span></td>"+
                "<td width='50%' class='recycler-row-align-midle-right'><span>"+getTransTempInfo(inTrans.TYPE_TEMPLATE)+"</span></td>"+
                "</tr>";
        }
        // gui thong bao
        contentHTML += "<tr class='recycler-row-normal'>"+
            "<td width='50%' class='recycler-row-align-midle-left'><span>"+CONST_STR.get('COM_SEND_MSG_APPROVER')+"</span></td>"+
            "<td width='50%' class='recycler-row-align-midle-right'><span>"+getSendMethod(inTrans.SEND_METHOD)+"</span></td>"+
            "</tr>";
    }
    contentHTML +=  "</table>";
    return contentHTML;
}
/*function getTransTempInfo(templateType) {
    if (templateType == 404) {
        return CONST_STR.get("TAX_NO_SAVE_CODE");
    } else if (templateType == 0) {
        return CONST_STR.get("COM_SAVE_BENEFICIARY");
    } else if (templateType == 1) {
        return CONST_STR.get("COM_SAVE_TEMPLATE_TRANS");
    }
}
function getSendMethodText(sendMethod) {
    if (sendMethod == 0) {
        return CONST_STR.get("COM_NOTIFY_0");
    } else if (sendMethod == 1) {
        return CONST_STR.get("COM_NOTIFY_1");
    } else if (sendMethod == 2) {
        return CONST_STR.get("COM_NOTIFY_2");
    } else if (sendMethod == 3) {
        return CONST_STR.get("COM_NOTIFY_3");
    }
}*/
function printComHistory() {
    var tmpNodeMain = document.getElementById("mainViewContent");
    var printNode = tmpNodeMain.getElementsByTagName("div")[0];

    printNodeWithAll(printNode);
}