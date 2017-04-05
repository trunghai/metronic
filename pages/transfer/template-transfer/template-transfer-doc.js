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
//    { name : 'func', icon : 'icon-detail', action: function(id){
//        console.log('func' + id);
//        var parent = document.getElementById(id);
//        // lay vi tri cua li de show detail
//        pBottomOffsetDocTranfer = parent.getBoundingClientRect().bottom;
//
//        //lay data
//        var objectVal = getObjectValue(parent);
//
//        showDetailTranferDoc(parent.event, objectVal);
//
//    }, type: 'func'},

    { name : 'edit', icon : 'icon-edit', action: function(id){
        modalDialog.hideDialogFull();
//        var parent = document.getElementById(id);
        gTrans.selectedview = id.slice(7);
//        var obj = getObjectValue(parent);
        logInfo(temptranfer[gTrans.selectedview]);

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
        navCachedPages['transfer/template-transfer/template-transfer-doc-edit'] = null;
        navController.pushToView('transfer/template-transfer/template-transfer-doc-edit', true, 'html');



    }, type: 'func'},

    { name : 'delete', icon : 'icon-delete', action: function(id){
//        var node = document.getElementById(id);
//
//        var pValue = node.getElementsByClassName("p-value")[0];
//        var idNo = pValue.childNodes[0].innerHTML;
        var benId = id.slice(7);
        showPopUpTranferDocDelete(temptranfer[benId].BENEID)
    }, type: 'delete', idPopup :  'btnAlertConfirmOk'}
];


var dbclickShowTranfer = function(node){
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
    angular.module('EbankApp').controller('template-transfer-doc', function ($scope, requestMBServiceCorp) {
        document.getElementById('txtSearch').placeholder = CONST_STR.get('INTRODUCE_SREACH_TITLE');

        $scope.initData = function () {
            var jsonData = new Object();
            jsonData.sequenceId = "11";
//            jsonData.sequenceId = "5";
            jsonData.idtxn = 'M01';
            jsonData.txnType = gTrans.TXN_TYPE;
            jsonData.templateTrans = '1';
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_MANAGE_TEMPLATE"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode == 0) {
                    gTrans.listTemplate = response.respJsonObj;
                    var historyArray = gTrans.listTemplate;
                    if(historyArray === null || historyArray == "" || historyArray === undefined) {
                        resultListNull("divListContact");
                        return;
                    }

                    //anhntt chinh sua mau chuyen tien cho truong hop trong tpbank
                    if(gTrans.idtxn == "T11"||gTrans.idtxn == "T12"){
                        var historyArray1 =[];
                        var historyArray2 =[];

                        for(var i = 0; i< historyArray.length; i++){
                            for(var j = 0 ; j<gTrans.listSourceAccounts.length; j++){
                                var flag = false;
                                if(historyArray[i].BENE_ACCTNO == gTrans.listSourceAccounts[j].account){
                                    historyArray2.push(historyArray[i]);
                                    flag = true;
                                    break;
                                }
                            }
                            if(flag == false){
                                historyArray1.push(historyArray[i]);
                            }
                        }
                        if(gTrans.idtxn == "T11"){
                            historyArray = historyArray2;
                        }else{
                            historyArray = historyArray1;
                        }
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
							
						if (gTrans.idtxn=='T13' || gTrans.idtxn =='T19' || gTrans.idtxn =='T21') {
							objtemp.name = payeeArrTemp.BENE_DESC;
                            objtemp.tai_khoan_nguon = payeeArrTemp.SOURCE_ACC;
                            objtemp.ten_tai_khoan_dich = payeeArrTemp.BENE_NAME;
                            objtemp.tai_khoan_dich = payeeArrTemp.BENE_ACCTNO;
                            objtemp.so_tien = payeeArrTemp.NUMAMOUNT;
                            objtemp.ngay_chuyen = payeeArrTemp.DATMAKE;
                            objtemp.noi_dung = payeeArrTemp.MSG;
                            objtemp.ngan_hang_nhan = payeeArrTemp.BANK_NAME;
                            objtemp.BENEID = payeeArrTemp.BENEID;
							if (gTrans.idtxn =='T13'){
								objtemp.SOURCE_ACC = payeeArrTemp.SOURCE_ACC;
								objtemp.BRANCH_CODE = payeeArrTemp.BRANCH_CODE;
								objtemp.SORTCODE = payeeArrTemp.SORTCODE;
								objtemp.BENE_ACCTNO = payeeArrTemp.BENE_ACCTNO;
								objtemp.BENE_NAME = payeeArrTemp.BENE_NAME;
								objtemp.BRANCH_NAME = payeeArrTemp.BRANCH_NAME;
								objtemp.NUMAMOUNT = payeeArrTemp.NUMAMOUNT;
								objtemp.MSG =payeeArrTemp.MSG;								
							}else if(gTrans.idtxn =='T21'){
								objtemp.SOURCE_ACC = payeeArrTemp.SOURCE_ACC;
								objtemp.BENE_ACCTNO = payeeArrTemp.BENE_ACCTNO;
								objtemp.BANK_CODE = payeeArrTemp.BANK_CODE;
								objtemp.NUMAMOUNT = payeeArrTemp.NUMAMOUNT;
								objtemp.MSG = payeeArrTemp.MSG;
							}		

						}else if(gTrans.idtxn=='T20'){
                            objtemp.BANK_CODE = payeeArrTemp.BANK_CODE;
                            objtemp.ngan_hang_nhan = payeeArrTemp.BRANCH_NAME;
                            objtemp.BENEID = payeeArrTemp.BENEID;
                            objtemp.BENE_ACCTNO = payeeArrTemp.BENE_ACCTNO;
                            objtemp.BENE_DESC = payeeArrTemp.BENE_DESC;
                            objtemp.name = payeeArrTemp.BENE_NAME;
                            objtemp.BRANCH_CODE = payeeArrTemp.BRANCH_CODE;
                            objtemp.BANK_NAME = payeeArrTemp.BANK_NAME;
                            objtemp.CIF = payeeArrTemp.CIF;
                            objtemp.ngay_cap_cmnd = payeeArrTemp.DATISSUE;
                            objtemp.FANCY_NAME = payeeArrTemp.FANCY_NAME;
                            objtemp.IDTXN = payeeArrTemp.IDTXN;
                            objtemp.IDUSER = payeeArrTemp.IDUSER;
                            objtemp.noi_dung = payeeArrTemp.MSG;
                            objtemp.NAM_CCY_SHORT = payeeArrTemp.NAM_CCY_SHORT;
                            objtemp.so_tien = payeeArrTemp.NUMAMOUNT;
                            objtemp.so_cmnd = payeeArrTemp.PASSPORT;
                            objtemp.so_dien_thoai = payeeArrTemp.PHONENUMBER;
                            objtemp.noi_cap_cmnd = payeeArrTemp.PLACEISSUE;
                            objtemp.SORTCODE = payeeArrTemp.SORTCODE;
                            objtemp.tai_khoan_nguon = payeeArrTemp.SOURCE_ACC;
                            objtemp.TXN_TYPE = payeeArrTemp.TXN_TYPE;
                            objtemp.TYPE_TEMPLATE = payeeArrTemp.TYPE_TEMPLATE;
                        } else {
							objtemp.name = payeeArrTemp.BENE_DESC;
							objtemp.BENEID = payeeArrTemp.BENEID;
                            objtemp.tai_khoan_nguon = payeeArrTemp.SOURCE_ACC;
                            objtemp.ten_tai_khoan_dich = payeeArrTemp.BENE_NAME;
                            objtemp.tai_khoan_dich = payeeArrTemp.BENE_ACCTNO;
                            objtemp.so_tien = payeeArrTemp.NUMAMOUNT;
                            objtemp.ngay_chuyen = payeeArrTemp.DATMAKE;
                            objtemp.noi_dung = payeeArrTemp.MSG;
                            objtemp.ngan_hang_nhan = payeeArrTemp.BANK_NAME;
                            objtemp.ma_citad = "";
                            objtemp.loai_chuyen_tien = "";
                            objtemp.bincode = "";
						}
                            lstTemplate.push(objtemp);

                            var obj = new Object();
                            obj.value1 = objtemp.tai_khoan_dich;
                            obj.value2 = objtemp.name;
                            obj.index = i;
                            args.push(obj);
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

        $scope.initData();
    });
    angular.bootstrap(document.getElementById('mainViewContentDialog'),['EbankApp']);
}

function viewtransfer(e,index){
	gTrans.selectedview=index;
    editobj['name'] = temptranfer[index].name;
    editobj['ngan_hang_nhan'] = temptranfer[index].ngan_hang_nhan;
    editobj['noi_dung'] = temptranfer[index].noi_dung;
    editobj['so_tien'] = temptranfer[index].so_tien;
    editobj['ngay_chuyen'] = temptranfer[index].ngay_chuyen;
    editobj['ten_tai_khoan_dich'] = temptranfer[index].ten_tai_khoan_dich;
    editobj['tai_khoan_dich'] = temptranfer[index].tai_khoan_dich;
    // editobj['ngay_chuyen'] = temptranfer[index].ngay_chuyen;
    editobj['tai_khoan_nguon'] = temptranfer[index].tai_khoan_nguon;
    editobj['so_cmnd']=temptranfer[index].so_cmnd;
    editobj['ngay_cap_cmnd']=temptranfer[index].ngay_cap_cmnd;
    editobj['noi_cap_cmnd']=temptranfer[index].noi_cap_cmnd;

    username = temptranfer[index].tai_khoan_nguon;
    document.getElementById('nameuser').innerHTML = temptranfer[index].name;
    if (gEdit == 1 || gEdit == 2){
        //trong tpbank va lien ngan hang
        document.getElementById('accSource').innerHTML = temptranfer[index].tai_khoan_nguon;
        document.getElementById('nametranfer').innerHTML = temptranfer[index].ten_tai_khoan_dich;
        document.getElementById('accNumbertransfer').innerHTML = temptranfer[index].tai_khoan_dich;
        document.getElementById('ngan-hang-nhan').innerHTML = temptranfer[index].ngan_hang_nhan;
        document.getElementById('noi-dung').innerHTML = temptranfer[index].noi_dung;
        document.getElementById('so-tien').innerHTML = formatNumberToCurrency(temptranfer[index].so_tien);
        document.getElementById('ngay-chuyen').innerHTML = temptranfer[index].ngay_chuyen;
        // document.getElementById('ngay_chuyen').innerHTML = temptranfer[index].ngay_chuyen;
    } else if (gEdit == 3){
        //qua the
        document.getElementById('nametranfer').innerHTML = temptranfer[index].ten_tai_khoan_dich;
        document.getElementById('accNumbertransfer').innerHTML = temptranfer[index].tai_khoan_dich;
        if(temptranfer[index].ngan_hang_nhan != ""){
            document.getElementById('ngan-hang-nhan').innerHTML = temptranfer[index].ngan_hang_nhan;
        }
        document.getElementById('noi-dung').innerHTML = temptranfer[index].noi_dung;
        document.getElementById('so-tien').innerHTML = formatNumberToCurrency(temptranfer[index].so_tien);
        // document.getElementById('ngay_chuyen').innerHTML = temptranfer[index].ngay_chuyen;
    } else if (gEdit == 4){
        //tk chung khoan
        document.getElementById('tr-shareholder').style.display="";
        document.getElementById('tr-bank').style.display="none";
        document.getElementById('nametranfer').innerHTML = temptranfer[index].ten_tai_khoan_dich;
        document.getElementById('accNumbertransfer').innerHTML = temptranfer[index].tai_khoan_dich;
        document.getElementById('shareholder').innerHTML = "Chứng khoán FPTS tại Hà Nội";
        document.getElementById('noi-dung').innerHTML = temptranfer[index].noi_dung;
        document.getElementById('so-tien').innerHTML = formatNumberToCurrency(temptranfer[index].so_tien);
        // document.getElementById('ngay_chuyen').innerHTML = temptranfer[index].ngay_chuyen;
    } else if (gEdit == 5){
        //qua CMTND
        document.getElementById('tr-cmnd').style.display="";
        document.getElementById('tr-ngaycap').style.display="";
        document.getElementById('tr-noicap').style.display="";
        document.getElementById('tr-phone').style.display="";
        document.getElementById('tr-accnotitle').style.display="none";
        document.getElementById('tr-ngayChuyen').style.display = "none";
        document.getElementById('tr-taiKhoanNhan').style.display = "none";
        document.getElementById('nametranfer').innerHTML = temptranfer[index].ten_tai_khoan_dich;
        document.getElementById('identity-card').innerHTML = temptranfer[index].so_cmnd;
        document.getElementById('card-date').innerHTML = temptranfer[index].ngay_cap_cmnd;
        document.getElementById('card-place').innerHTML = temptranfer[index].noi_cap_cmnd;
        document.getElementById('card-phone').innerHTML = temptranfer[index].so_dien_thoai;
        document.getElementById('ngan-hang-nhan').innerHTML = temptranfer[index].ngan_hang_nhan;
        document.getElementById('noi-dung').innerHTML = temptranfer[index].noi_dung;
        document.getElementById('so-tien').innerHTML = formatNumberToCurrency(temptranfer[index].so_tien);
    }else if(gEdit == 6){
        document.getElementById('accSource').innerHTML = temptranfer[index].tai_khoan_nguon;
        document.getElementById('nametranfer').innerHTML = temptranfer[index].ten_tai_khoan_dich;
        document.getElementById('accNumbertransfer').innerHTML = temptranfer[index].tai_khoan_dich;
        document.getElementById('ngan-hang-nhan').innerHTML = temptranfer[index].ngan_hang_nhan;
        document.getElementById('noi-dung').innerHTML = temptranfer[index].noi_dung;
        document.getElementById('so-tien').innerHTML = formatNumberToCurrency(temptranfer[index].so_tien);
        document.getElementById('ngay-chuyen').innerHTML = temptranfer[index].ngay_chuyen;
    }
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

function tempeditselection(){
    modalDialog.hideDialogFull();
    navCachedPages['transfer/template-transfer/template-transfer-doc-edit'] = null;
    navController.pushToView('transfer/template-transfer/template-transfer-doc-edit', true, 'html');
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