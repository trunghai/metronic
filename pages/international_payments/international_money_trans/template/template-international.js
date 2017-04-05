/**
 * Created by HaiDT1 on 2/27/2017.
 */
/**
 * Created by HaiDT1 on 12/26/2016.
 */

var editobj = {};
var temptranfer;
var tempindextranfer;
var gprsResp = new GprsRespObj("","","","");
var resultDocRowArray = new Array();
var fieldRowDoc = ['name','tai_khoan_dich','ngan_hang_nhan'];
var fieldHiddenDoc =  ['name','tai_khoan_nguon','ten_tai_khoan_dich',
    'tai_khoan_dich',
    'noi_dung',
    'so_tien','ngay_chuyen','ngan_hang_nhan','ma_citad','loai_chuyen_tien', 'bincode',
    'so_dien_thoai', 'noi_cap_cmnd', 'ngay_cap_cmnd', 'so_cmnd','bank_code'];
var username;

var pBottomOffsetDocTranfer = null;

var buttonDoc = [
    { name : 'func', icon : 'icon-detail', action: function(id){
        console.log('func' + id);
        var parent = document.getElementById(id);
        // lay vi tri cua li de show detail
        pBottomOffsetDocTranfer = parent.getBoundingClientRect().bottom;

        //lay data
        var objectVal = getObjectValue(parent);

        showDetailTranferDoc(parent.event, objectVal);

    }, type: 'func'},

    { name : 'edit', icon : 'icon-edit', action: function(id){
        modalDialog.hideDialogFull();
        var parent = document.getElementById(id);
        var obj = getObjectValue(parent);
        logInfo(obj);

        // var newDoc = createXMLDoc();
        // var tmpXmlRootNode = createXMLNode('info', '', newDoc);
        // var tmpXmlType = createXMLNode('type', '1', newDoc, tmpXmlRootNode);
        // var tmpXmlElement = createXMLNode('element', '', newDoc, tmpXmlRootNode);
        // var tmpXmlElementValue1 = createXMLNode('ten_mau', obj.name, newDoc, tmpXmlElement);
        // var tmpXmlElementValue7 = createXMLNode('taikhoannguon', obj.tai_khoan_nguon, newDoc, tmpXmlElement);
        // var tmpXmlElementValue2 = createXMLNode('sotien', obj.so_tien, newDoc, tmpXmlElement);
        // var tmpXmlElementValue3 = createXMLNode('nganhangnhan', obj.ngan_hang_nhan, newDoc, tmpXmlElement);
        // var tmpXmlElementValue4 = createXMLNode('taikhoandich', obj.tai_khoan_dich, newDoc, tmpXmlElement);
        // var tmpXmlElementValue5 = createXMLNode('tentaikhoandich', obj.ten_tai_khoan_dich, newDoc, tmpXmlElement);
        // var tmpXmlElementValue6 = createXMLNode('noidung', obj.noi_dung, newDoc, tmpXmlElement);
        // var tmpXmlElementValue8 = createXMLNode('bank_code', obj.ma_citad, newDoc, tmpXmlElement);
        // var tmpXmlElementValue9 = createXMLNode('so_dien_thoai', obj.so_dien_thoai, newDoc, tmpXmlElement);
        // var tmpXmlElementValue9 = createXMLNode('noi_cap_cmnd', obj.noi_cap_cmnd, newDoc, tmpXmlElement);
        // var tmpXmlElementValue10 = createXMLNode('so_cmnd', obj.so_cmnd, newDoc, tmpXmlElement);
        // var tmpXmlElementValue11 = createXMLNode('ngay_cap_cmnd', obj.ngay_cap_cmnd, newDoc, tmpXmlElement);
        // var tmpXmlElementValue12 = createXMLNode('ngan_hang_nhan', obj.ngan_hang_nhan, newDoc, tmpXmlElement);
        // var tmpXmlElementValue12 = createXMLNode('bankcode', obj.bank_code, newDoc, tmpXmlElement);
        //
        // logInfo(newDoc);
        // setReviewXmlStore(newDoc);
        navController.pushToView('transfer/template-transfer-doc-edit', true, 'xsl');



    }, type: 'func'},

    { name : 'delete', icon : 'icon-delete', action: function(id){
        var node = document.getElementById(id);
        var pValue = node.getElementsByClassName("p-value")[0];
        var idNo = pValue.childNodes[0].innerHTML;
        showPopUpTranferDocDelete(idNo)
    }, type: 'delete', idPopup :  'btnAlertConfirmOk'}
];


var dbclickShowTranfer = function(node){
    console.log("click from transfer doc");
    try{
        var objectVal = getObjectValue(node);
        // callbackDocTranfer(objectVal);
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
    angular.module('EbankApp').controller('template-transfer-doc', function ($scope, requestMBServiceCorp) {
        document.getElementById('txtSearch').placeholder = CONST_STR.get('INTRODUCE_SREACH_TITLE');

        $scope.initData = function () {
            var jsonData = new Object();
            jsonData.sequence_id = "7";
            jsonData.idtxn = gInternational.idtxn;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_PAYMENT_INTERNATIONAL"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {

                if (response.respCode == 0) {
                    gInternational.listTemplate = response.respJsonObj.list_bene.O_INFO;

                    var historyArray = gInternational.listTemplate;
                    if(historyArray === null || historyArray == "" || historyArray === undefined) {
                        resultListNull("divListContact");
                        return;
                    }
                    var length = historyArray.length;
                    if (length > 0){
                        var payeeArrTemp;
                        var objtemp;
                        var lstTemplate = new Array();
                        var args = new Array();

                        for(var i=0;i<length ; i++){
                            payeeArrTemp = historyArray[i];
                            objtemp = new Object();

                            objtemp.name = payeeArrTemp.BENE_NAME;
                            // objtemp.ten_tai_khoan_dich = payeeArrTemp.BENEFICIARYNAME;
                            // objtemp.tai_khoan_dich = payeeArrTemp.BENEFICIARYACCOUNT;
                            // objtemp.so_tien = payeeArrTemp.NUMAMOUNT;
                            // objtemp.ngay_chuyen = payeeArrTemp.DATMAKE;
                            // objtemp.noi_dung = payeeArrTemp.CONTENT;
                            // objtemp.ngan_hang_nhan = payeeArrTemp.BENEFICIARYBANK;
                            // objtemp.ma_citad = "";
                            // objtemp.loai_chuyen_tien = "";
                            // objtemp.bincode = "";
                            objtemp.BENEID = payeeArrTemp.BENEID;
                            objtemp.TRANSACTIONTYPE = payeeArrTemp.TRANSACTIONTYPE;
                            objtemp.PURPOSE =  payeeArrTemp.PURPOSE;
                            objtemp.CONTENT = payeeArrTemp.CONTENT;

                            objtemp.BENEFICIARYNAME = payeeArrTemp.BENEFICIARYNAME;
                            objtemp.BENEFICIARYADDRESS = payeeArrTemp.BENEFICIARYADDRESS;
                            objtemp.BENEFICIARYCOUNTRIESNAME = payeeArrTemp.BENEFICIARYCOUNTRIESNAME;
                            objtemp.BENEFICIARYCOUNTRIES = payeeArrTemp.BENEFICIARYCOUNTRIES;
                            objtemp.BENEFICIARYACCOUNT = payeeArrTemp.BENEFICIARYACCOUNT;

                            objtemp.BENEFICIARYBANKMETHOD = payeeArrTemp.BENEFICIARYBANKMETHOD;
                            objtemp.BENEFICIARYSWIFTCODE = payeeArrTemp.BENEFICIARYSWIFTCODE;
                            objtemp.BENEFICIARYBANK = payeeArrTemp.BENEFICIARYBANK;
                            objtemp.BENEFICIARYBANKADDRESS = payeeArrTemp.BENEFICIARYBANKADDRESS;
                            objtemp.BENEFICIARYBANKCOUNTRIESNAME = payeeArrTemp.BENEFICIARYBANKCOUNTRIESNAME;
                            objtemp.BENEFICIARYBANKCOUNTRIES = payeeArrTemp.BENEFICIARYBANKCOUNTRIES;

                            objtemp.METHOD =  payeeArrTemp.METHOD;
                            objtemp.BANKMETHOD =  payeeArrTemp.BANKMETHOD;

                            objtemp.BANKSWIFTCODE = payeeArrTemp.BANKSWIFTCODE;
                            objtemp.BANKNAME = payeeArrTemp.BANKNAME;
                            objtemp.BANKADDRESS = payeeArrTemp.BANKADDRESS;
                            objtemp.BANKCOUNTRIESNAME = payeeArrTemp.BANKCOUNTRIESNAME;
                            objtemp.BANKCOUNTRIES = payeeArrTemp.BANKCOUNTRIES;
                            objtemp.CUSTOMER_NAME1 = payeeArrTemp.CUSTOMER_NAME1;
                            objtemp.ADDRESS = payeeArrTemp.ADDRESS;


                            lstTemplate.push(objtemp);

                            var obj = new Object();
                            obj.value1 = objtemp.tai_khoan_dich;
                            obj.value2 = objtemp.name;
                            obj.index = i;
                            args.push(obj);
                        }
                        resultDocRowArray = lstTemplate;
                        if(gModeScreenView == CONST_MODE_SCR_SMALL){
                            genScreen("divListDoc", lstTemplate, false,
                                fieldRowDoc,
                                fieldHiddenDoc,
                                buttonDoc,
                                dbclickShowTranfer,true
                            );
                        }else{
                            $scope.gentemptran("divListDoc",lstTemplate);
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
         $scope.gentemptran = function(idDivList,respArr){

            temptranfer = respArr;
            for(var i = respArr.length; i > 0 ; i--){
                for(var j = 0; j < i - 1; j++){
                    var tempValue;
                    if(respArr[j].name.toUpperCase().charCodeAt(0) > respArr[j + 1].name.toUpperCase().charCodeAt(0)){
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
                if(i == 0 ||respArr[i].name.toUpperCase().charCodeAt(0) > firstLetter.charCodeAt(0)){
                    firstLetter = respArr[i].name.charAt(0).toUpperCase();
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
                tempView.innerHTML = respArr[i].name;
                div.appendChild(tempView);
                viewtransfer(document.getElementById('cardAcc_0'),0);

            }
        }

        $scope.tempeditselection = function () {
            modalDialog.hideDialogFull();
            navCachedPages['international_payments/international_money_trans/template/template-international-edit'] = null;
            navController.pushToView('international_payments/international_money_trans/template/template-international-edit', true, 'html');
        }

        $scope.initData();
    });
    angular.bootstrap(document.getElementById('mainViewContentDialog'),['EbankApp']);
}

function SearchDocRow(objKeyword){
    debugger;
    if(gModeScreenView == CONST_MODE_SCR_SMALL){
        searchListArr("divListDoc", resultDocRowArray, objKeyword,false,
            fieldRowDoc,
            fieldHiddenDoc,
            buttonDoc,
            dbclickShowTranfer, true);
    }else{
        searchListDesktop(objKeyword,resultDocRowArray);
    }
}

function searchListDesktop(keyword,arr){
    debugger;
    var strKeyword = keyword.value;
    var arrSearchTmp = new Array();
    for(var i in arr) {
        if(arr[i]['name'] !== undefined && arr[i]['BENEFICIARYACCOUNT'] !== undefined){
            if(arr[i]['name'].toLowerCase().indexOf(strKeyword.toLowerCase()) != -1 || arr[i]['BENEFICIARYACCOUNT'].toLowerCase().indexOf(strKeyword.toLowerCase()) != -1){
                arrSearchTmp.push(arr[i]);
            }
        }
    }
    logInfo(arrSearchTmp);
    angular.element(document.getElementById('mainViewContentDialog')).scope().gentemptran("divListDoc",arrSearchTmp);

}

function viewtransfer(e,index){
    gInternational.templateBenEdit = temptranfer[index];
    gInternational.templateBen = temptranfer[index];

    username = temptranfer[index].tai_khoan_nguon;
    document.getElementById('nameuser').innerHTML = temptranfer[index].name;
    document.getElementById('nametranfer').innerHTML = temptranfer[index].BENEFICIARYNAME;
    document.getElementById('accNumbertransfer').innerHTML = temptranfer[index].BENEFICIARYACCOUNT;
    document.getElementById('bankName').innerHTML = temptranfer[index].BENEFICIARYBANK;
    document.getElementById('national').innerHTML = temptranfer[index].BENEFICIARYBANKCOUNTRIESNAME;


    document.getElementById('tempdelete').setAttribute("onclick","tempdeleteselection('"+temptranfer[index].BENEID +"')");
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