/**
 * Created by HaiDT1 on 12/26/2016.
 */

var editobj = {};
var temptranfer;
var tempindextranfer;
var gprsResp = new GprsRespObj("","","","");
var resultDocRowArray = new Array();
var fieldRowDoc = ['name','tai_khoan_dich','ngan_hang_nhan','so_cmnd'];
var fieldHiddenDoc =  ['SOURCE_ACC','BRANCH_CODE','SORTCODE','BENE_ACCTNO','BENE_NAME','BRANCH_NAME','NUMAMOUNT','MSG','NUMAMOUNT','BANK_CODE',
'name','tai_khoan_nguon','ten_tai_khoan_dich',
    'tai_khoan_dich',
    'noi_dung',
    'so_tien','ngay_chuyen','ngan_hang_nhan','ma_citad','loai_chuyen_tien', 'bincode',
    'so_dien_thoai', 'noi_cap_cmnd', 'ngay_cap_cmnd', 'so_cmnd','bank_code'];
var username;

var pBottomOffsetDocTranfer = null;

var buttonDoc = [

    { name : 'edit', icon : 'icon-edit', action: function(id){
        modalDialog.hideDialogFull();
        gTrans.selectedview = id.slice(7);
        logInfo(temptranfer[gTrans.selectedview]);
        navCachedPages['transfer/template-transfer/template-transfer-doc-edit'] = null;
        navController.pushToView('transfer/template-transfer/template-transfer-doc-edit', true, 'html');



    }, type: 'func'},

    { name : 'delete', icon : 'icon-delete', action: function(id){
        var benId = id.slice(7);
        showPopUpTranferDocDelete(temptranfer[benId].BENEID)
    }, type: 'delete', idPopup :  'btnAlertConfirmOk'}
];


var dbclickShowTranfer = function(node){
    debugger
    console.log("click from transfer doc");
    try{
        var objectVal = getObjectValue(node);
        var middlewareObj = new Object();


        try{
            modalDialog.fireCallBack(objectVal);
        }catch(e){}
    }catch(e){
        console.log("loi id node");
        console.log(node);
        console.log(e);
    }

};

function viewDialogLoadSuccess() {
    init();
}

function init() {
    angular.module('EbankApp').controller('pay_tax_create_teamplate', function ($scope, requestMBServiceCorp) {
        document.getElementById('txtSearch').placeholder = CONST_STR.get('INTRODUCE_SREACH_TITLE');

        $scope.initData = function () {
            var argsArray = [];
            argsArray.push("1");
            argsArray.push(JSON.stringify({
                idtxn: "B11",
                taxType: gTax.chooseTax
            }));

            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_PAY_TAX_PROCESSOR"), "", "", gUserInfo.lang, gUserInfo.sessionID, argsArray);
            data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                debugger
                if (response.respCode == 0) {
                    gTrans.listTemplate = response.respJsonObj;
                    var historyArray = gTrans.listTemplate;
                    if(historyArray === null || historyArray == "" || historyArray === undefined) {
                        resultListNull("divListContact");
                        return;
                    }

                    var length = historyArray.length;
                    if (length > 0){
                        var payeeArrTemp;
                        var objtemp;
                        var lstTemplate = new Array();

                        for(var i=0;i<length ; i++){
                            payeeArrTemp = historyArray[i];
                            objtemp = new Object();
                            
                            objtemp.TAX_CODE = payeeArrTemp.TAX_CODE;
                            objtemp.TAX_TYPE = payeeArrTemp.TAX_TYPE;
                            objtemp.DECLARATION = payeeArrTemp.DECLARATION;
                            objtemp.DECLARATION_YEAR = payeeArrTemp.DECLARATION_YEAR;
                            objtemp.RECORD = payeeArrTemp.RECORD;
                            objtemp.NUMBER_CT = payeeArrTemp.NUMBER_CT;
                            objtemp.SYMBOL_VOUCHERS = payeeArrTemp.SYMBOL_VOUCHERS;
                            objtemp.YEAR_CT = payeeArrTemp.YEAR_CT;
                            objtemp.AGENCY_CODE = payeeArrTemp.AGENCY_CODE;
                            lstTemplate.push(objtemp);

                        }
                        resultDocRowArray = lstTemplate;
                        if(gModeScreenView == CONST_MODE_SCR_SMALL){
                            temptranfer = lstTemplate;
                            genScreen("divListDoc", lstTemplate, false,
                                fieldRowDoc,
                                fieldHiddenDoc,
                                buttonDoc,
                                dbclickShowTranfer,true
                            );
                        }else{
                            gentemptran("divListDoc",lstTemplate);
                        }

                    }else {
                        resultListNull("divListContact");
                        console.log("length == 0");
                    }
                }
            }, function(){
                showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                gotoHomePage();
            });
        }

        //add funciton common
        function gentemptran(idDivList,respArr){
            temptranfer = respArr;
            gTrans.newlistTemplate=temptranfer;
            for(var i = respArr.length; i > 0 ; i--){
                for(var j = 0; j < i - 1; j++){
                    var tempValue;
                    if(respArr[j].TAX_CODE.toUpperCase().charCodeAt(0) > respArr[j + 1].TAX_CODE.toUpperCase().charCodeAt(0)){
                        tempValue = respArr[j];
                        respArr[j] = respArr[j + 1];
                        respArr[j + 1] = tempValue;
                    }
                }
            }
            var div = document.getElementById(idDivList);
            div.innerHTML = "";
            var firstLetter;
            for(var i = 0; i < respArr.length; i++){
                if(i == 0 ||respArr[i].TAX_CODE.toUpperCase().charCodeAt(0) > firstLetter.charCodeAt(0)){
                    firstLetter = respArr[i].TAX_CODE.charAt(0).toUpperCase();
                    var cardTitle = document.createElement('div');
                    cardTitle.innerHTML = firstLetter;
                    cardTitle.style.textAlign = "left";
                    cardTitle.style.padding = "10px";
                    cardTitle.style.color = "#5f2f85";
                    cardTitle.style.fontWeight = "bold";
                    div.appendChild(cardTitle);
                }
                var tempView = document.createElement('div');
                tempView.setAttribute('class','my-acc-view')
                tempView.setAttribute('id','cardAcc_' + i);
                tempView.setAttribute('onclick',"viewtransfer(this," + i + ")");
                tempView.innerHTML = respArr[i].TAX_CODE;
                div.appendChild(tempView);
                viewtransfer(document.getElementById('cardAcc_0'),0);

            }
        }

        $scope.initData();
    });
    angular.bootstrap(document.getElementById('mainViewContentDialog'),['EbankApp']);
}

function viewtransfer(e,index){
    // debugger
    gTrans.selectedview=index;
    editobj['name'] = temptranfer[index].TAX_TYPE;
    editobj['agency_code'] = temptranfer[index].TAX_CODE;
    editobj['declaration'] = temptranfer[index].DECLARATION;
    editobj['declaration_year'] = temptranfer[index].DECLARATION_YEAR;

    username = temptranfer[index].TAX_CODE;
    document.getElementById('nameuser').innerHTML = temptranfer[index].TAX_CODE;
    if(gTax.chooseTax == '01'){
        document.getElementById('masothue').innerHTML = temptranfer[index].TAX_CODE;
        document.getElementById('tr-sotokhai').style.display = 'none';
        document.getElementById('tr-namdangky').style.display = 'none';

    }else if(gTax.chooseTax == '02'){
        document.getElementById('masothue').innerHTML = temptranfer[index].TAX_CODE;
        document.getElementById('sotokhai').innerHTML = temptranfer[index].DECLARATION;
        document.getElementById('namdangky').innerHTML = temptranfer[index].DECLARATION_YEAR;

    }else if(gTax.chooseTax == '05'){
        document.getElementById('masothue').innerHTML = temptranfer[index].TAX_CODE;
        document.getElementById('sotokhai').innerHTML = temptranfer[index].DECLARATION;
        document.getElementById('namdangky').innerHTML = temptranfer[index].DECLARATION_YEAR;

    }else if(gTax.chooseTax == '06'){
        document.getElementById('sohoso').innerHTML = temptranfer[index].RECORD;
        document.getElementById('kyhieuchungtu').innerHTML = temptranfer[index].SYMBOL_VOUCHERS;
        document.getElementById('sochungtu').innerHTML = temptranfer[index].NUMBER_CT;
        document.getElementById('madonviql').innerHTML = temptranfer[index].AGENCY_CODE;
        document.getElementById('namchungtu').innerHTML = temptranfer[index].YEAR_CT;

        document.getElementById('tr-masothue').style.display = 'none';
        document.getElementById('tr-sotokhai').style.display = 'none';
        document.getElementById('tr-namdangky').style.display = 'none';

    }
    if(gTax.chooseTax != '06'){
        document.getElementById('tr-sohoso').style.display = 'none';
        document.getElementById('tr-kyhieuchungtu').style.display = 'none';
        document.getElementById('tr-sochungtu').style.display = 'none';
        document.getElementById('tr-madonviql').style.display = 'none';
        document.getElementById('tr-namchungtu').style.display = 'none';
    }
    document.getElementById('tempdelete').setAttribute("onclick","tempdeleteselection('"+temptranfer[index].TAX_CODE +"')");
    resetActivetemp();
    e.style.backgroundColor = '#FF8C29';
    e.style.color = '#fff';
    tempindextranfer = index;
}

function tempdeleteselection(idNo){
    showPopUpTranferDocDelete(idNo);
}

function showPopUpTranferDocDelete(idNo){

    var str = CONST_STR.get('QUESTION_DELETE_TRANSFER');
    deleteNameContactDoc = idNo;
    document.addEventListener("alertConfirmOK", alertConfirmDocOK, false);
    document.addEventListener("alertConfirmCancel", alertConfirmDocCancel, false);
    document.getElementById('btnAlertConfirmCancel').value = CONST_STR.get('BENEFIC_LIST_NO');
    document.getElementById('btnAlertConfirmOk').value = CONST_STR.get('BENEFIC_LIST_YES');
    showAlertConfirmText(str, alertConfirmDocOK, alertConfirmDocCancel);
}

function alertConfirmDocOK() {
    //check currentPage
    alertConfirmDocCancel();
    console.log(deleteNameContactDoc);
    if(deleteNameContactDoc!==null)
    {
        var request = {
            idtxn: 'M01',
            sequenceId: 4,
            beneId: deleteNameContactDoc
        };
        var data = {};
        var arrayArgs = [];
        var jsonRequest = JSON.stringify(request);
        arrayArgs.push("4");
        arrayArgs.push(jsonRequest);
        var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_MANAGE_TEMPLATE"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
        gprsCmd.raw = '';
        data = getDataFromGprsCmd(gprsCmd);

        requestMBServiceCorp(data, true, 0, function (response) {
            response = JSON.parse(response);
            if (response.respCode == 0){
                document.getElementById('cardAcc_' + tempindextranfer).style.display = 'none';
                viewtransfer(document.getElementById('cardAcc_0'),0);
            }else {

            }
        });

    }
}

function alertConfirmDocCancel() {
    document.removeEventListener("alertConfirmCancel", alertConfirmDocCancel, false);
    document.removeEventListener("alertConfirmOK", alertConfirmDocOK, false);
}

// function tempeditselection(){
//     modalDialog.hideDialogFull();
//     navCachedPages['transfer/template-transfer/template-transfer-doc-edit'] = null;
//     navController.pushToView('transfer/template-transfer/template-transfer-doc-edit', true, 'html');
// }


function resetActivetemp(){

    if(temptranfer != undefined){
        for(var i = 0; i< temptranfer.length; i++){
            if(document.getElementById('cardAcc_' + i)){
                if(i%2 == 0){
                    document.getElementById('cardAcc_' + i).style.backgroundColor = '#F7E9FA';
                }else{
                    document.getElementById('cardAcc_' + i).style.backgroundColor = '#FDF1FF';
                }
                document.getElementById('cardAcc_' + i).style.color = '#000';
            }
        }
    }

}