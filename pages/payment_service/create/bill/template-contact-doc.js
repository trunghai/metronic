/**
 * Created by HaiDT1 on 12/26/2016.
 */

var resultContactRowArray = new Array();
var fieldRowContact;
var fieldHiddenContact;

var pBottomOffsetContactTranfer = null;

var buttonContact = [
    { name : 'delete', icon : 'icon-delete', action: function(id){
        var benId = id.slice(7);
        debugger;
        showPopUpTranferContactDelete(temptranfer[benId].BENEID);
    }, type: 'delete', idPopup :  'btnAlertConfirmOk'}
];


var dbclickShowContactTranfer = function(node){
    try{
        var objectVal = getObjectValue(node);
        console.log("click here "  + objectVal);
        //callbackContactTranfer(objectVal);
        try{
            console.log('set fire back');
            modalDialog.fireCallBack(objectVal);
        }catch(e){}
    }catch(e){
        console.log("loi id node");
        console.log(node);
        console.log(e);
    }

};

function showPopUpTranferContactDelete(objVal){

    var str = CONST_STR.get('QUESTION_DELETE_CONTACT');
    deleteContact = objVal;
    document.addEventListener("alertConfirmOK", alertConfirmContactOK, false);
    document.addEventListener("alertConfirmCancel", alertConfirmContactCancel, false);
    document.getElementById('btnAlertConfirmCancel').value = CONST_STR.get('BENEFIC_LIST_NO');
    document.getElementById('btnAlertConfirmOk').value = CONST_STR.get('BENEFIC_LIST_YES');
    showAlertConfirmText(str, alertConfirmContactOK, alertConfirmContactCancel);
}

function alertConfirmContactOK() {
    //check currentPage
    console.log("adbsahdjskashdkashd");
    alertConfirmDocCancel();
    debugger;
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
            debugger;
            if (response.respCode == 0){                
                debugger;
                document.getElementById('localAcc_' + tempindextranfer).style.display = 'none';
                viewLocalAcc(document.getElementById('cardAcc_0'),0);
            }else {

            }
        });

    }
}

function alertConfirmContactCancel() {
    document.removeEventListener("alertConfirmCancel", alertConfirmContactCancel, false);
    document.removeEventListener("alertConfirmOK", alertConfirmContactOK, false);
}

function viewDialogLoadSuccess() {    
    fieldRowContact = ['peopleName', 'transValue', 'partnerName'];
    fieldHiddenContact = ['customerNo', 'payeeType', 'transType', 'transValue', 'peopleName', 'transactionId'];
    // end thuatnt
    init();

}

function SearchContactRow(objKeyword){
    if(gModeScreenView == CONST_MODE_SCR_SMALL){
        if(typeof genListSearchParentPage === "function")
        {
            genListSearchParentPage("divListContact", resultContactRowArray, objKeyword,false,
                fieldRowContact,
                fieldHiddenContact,
                buttonContact,
                dbclickShowContactTranfer);
        }
    }else{
        if(typeof searchListDesktop === "function")
        {
            searchListDesktop(objKeyword,resultContactRowArray);
        }
    }
}

function searchListDesktop(keyword,arr){
    var strKeyword = keyword.value;
    var arrSearchTmp = new Array();
    for(var i in arr) {
        if(arr[i]['peopleName'] !== undefined && arr[i]['customerNo'] !== undefined){
            if(arr[i]['peopleName'].toLowerCase().indexOf(strKeyword.toLowerCase()) != -1 || arr[i]['customerNo'].toLowerCase().indexOf(strKeyword.toLowerCase()) != -1){
                arrSearchTmp.push(arr[i]);
            }
        }
    }
    logInfo(arrSearchTmp);
    genScreenDesktop(arrSearchTmp);
}
function init() {
    angular.module('EbankApp').controller('template-contact-doc', function ($scope, requestMBServiceCorp) {
        document.getElementById('txtSearch').placeholder = CONST_STR.get('INTRODUCE_SREACH_TITLE');

        $scope.initData = function () {            
            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn = gPayment.payType;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_PAYMENT_BILL"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                
                if (response.respCode == 0) {                    
                    var jsonObject = JSON.parse(JSON.stringify(response)); // verify that json is valid
                     var respJsonObj = jsonObject.respJsonObj;
                     gPayment.listBeneName = respJsonObj.lst_bene;

                     //debugger;
                     //lọc danh sách thụ hưởng theo loại dịch vụ
                     svId = gPayment.svId;
                     gPayment.listBeneForSrv = [];

                     for (var  i in gPayment.listBeneName){
                         var objData = gPayment.listBeneName[i];

                         if (objData.SRV_ID === svId){
                             gPayment.listBeneForSrv.push(objData);
                         }
                     }
                    
                     var historyArray = gPayment.listBeneForSrv;
                    
                    var length = historyArray.length;
                    if (length > 0){
                        var payeeArrTemp;
                        var payeeObjTemp;
                        var gPayeeList = new Array();
                        var args = new Array();

                        for(var i=0;i<length ; i++){
                            payeeArrTemp = historyArray[i];
                            payeeObjTemp = new PayeeObj();
                            payeeObjTemp.customerNo = payeeArrTemp.IDUSER;
                            // payeeObjTemp.payeeType = payeeArrTemp.TYPE_TEMPLATE;
                            payeeObjTemp.transType = payeeArrTemp.IDTXN;
                            payeeObjTemp.transValue = payeeArrTemp.BENE_ACCTNO;
                            $scope.beneId = payeeArrTemp.BENEID;
                            payeeObjTemp.peopleName = payeeArrTemp.BENE_NAME;
                            // payeeObjTemp.partnerCode = "";
                            payeeObjTemp.provinceCode = "";
                            payeeObjTemp.citadCode = "";
                            payeeObjTemp.partnerName = payeeArrTemp.BANK_NAME;
                            payeeObjTemp.partnerCode = payeeArrTemp.BANK_CODE;//thuatnt CHINH SUA
                            payeeObjTemp.branchCode = payeeArrTemp.SORTCODE;//thuatnt CHINH SUA
                            payeeObjTemp.fancyName = "";
                            payeeObjTemp.shortname = "";//NGOCDT3 CHINH SUA
                            payeeObjTemp.bincode = "";//NGOCDT3 CHINH SUA
                            payeeObjTemp.transactionId = payeeArrTemp.BENEID;//NGOCDT3 CHINH SUA
                            payeeObjTemp.datissue = payeeArrTemp.DATISSUE;//thuatnt CHINH SUA
                            payeeObjTemp.placeissue = payeeArrTemp.PLACEISSUE;//thuatnt CHINH SUA

                            payeeObjTemp.BENE_ACCTNO = payeeArrTemp.BENE_ACCTNO;
                            payeeObjTemp.BENE_NAME = payeeArrTemp.BENE_NAME;
                             
							
                            gPayeeList.push(payeeObjTemp);

                            var obj = new Object();
                            obj.value1 = payeeObjTemp.transValue;
                            obj.value2 = payeeObjTemp.BENE_NAME;
                            obj.index = i;
                            args.push(obj);
                        }
                        resultContactRowArray = gPayeeList;
                        if(typeof genListParentPage === "function")
                        {
                            genListParentPage("divListContact",gPayeeList, false,
                                fieldRowContact,
                                fieldHiddenContact,
                                buttonContact,
                                dbclickShowContactTranfer);
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

        $scope.getListBeneForSrv = function (){    
            var jsonData = new Object();
            jsonData.sequence_id = '1';
            jsonData.idtxn = gPayment.payType;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            //debugger;
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_PAYMENT_BILL'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true, function (response) {
                    if (response.respCode == '0'){
                        var jsonObject = JSON.parse(JSON.stringify(response)); // verify that json is valid
                         var respJsonObj = jsonObject.respJsonObj;
                         gPayment.listBeneName = respJsonObj.lst_bene;

                         //debugger;
                         //lọc danh sách thụ hưởng theo loại dịch vụ
                         svId = gPayment.svId;
                         gPayment.listBeneForSrv = [];

                         for (var  i in gPayment.listBeneName){
                             var objData = gPayment.listBeneName[i];

                             if (objData.SRV_ID === svId){
                                 gPayment.listBeneForSrv.push(objData);
                             }
                         }
                    }
                },
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                }
            );
        }

        $scope.deleteBeneficiary = function (bene_id) {
            showAlertConfirmText(CONST_STR.get("CONST_CONFIRM_DELETE_BENEFICIARY"));
            document.addEventListener("alertConfirmOK", function foobar(e) {
                debugger;
                document.removeEventListener("alertConfirmOK", foobar);
                var jsonData = new Object();
                jsonData.sequenceId = "4";
                jsonData.idtxn = 'M00';
                jsonData.beneId = bene_id;
                var args = new Array();
                args.push(null);
                args.push(jsonData);
                var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_MANAGE_BENEFIC"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
                var data = getDataFromGprsCmd(gprsCmd);
                 
                requestMBServiceCorp.post(data, true, function (response) {
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
                },function(){                    
                });

            init();
            });    
        }       
                        
        $scope.initData();
    });
    angular.bootstrap(document.getElementById('mainViewContentDialog'),['EbankApp']);
}

