/**
 * Created by HaiDT1 on 11/28/2016.
 */

var gDisabledLuuMau = false;
var lastClickSwitch;
function viewDidLoadSuccess() {
    init();
    actionbar.showStepSequence("com-authentication-scr");
}

function init(){
    angular.module('EbankApp').controller('transfer-local-create', function ($scope, requestMBServiceCorp) {

        var comboEl;
        gTrans.transType = 'T12';
        $scope.initComboTextAccount = function (){
            var accountName = "Invalid";
            var accountNumber = "Invalid";
            var accountBalance = "Invalid";

            try{
                document.getElementById("holder-account-info").innerHTML = "";
                accountName = gUserInfo.accountName;
                accountNumber = gTrans.listSourceAccounts[0].account;
                accountBalance = formatNumberToCurrency(gTrans.listSourceAccounts[0].balance);
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

        $scope.initTextAreaMessage = function (){
            try{
                var txtArea = document.getElementById('trans.content');
                if(txtArea!==null){
                    return false;
                }
                document.getElementById("holder-transfer-message").innerHTML = "";
            }catch(e){}


            var textAreaEl = new TextArea({
                containerMargin : "0px",
                idTextArea : "trans.content",
                placeholder : CONST_STR.get("PLACEHOLDER_TRANSFER_CONTENT"),
                iconClass : "icon-content-note",
                lengthmax : "100",

                //borderColor : "rgba(255, 255, 255, 0.2)",
                //showBorderBottom : false,
                // showBorderTop : false,
                fontSizeIcon : "24px!important",
                validateInput : function(){
                    console.log("validate function");
                }
            });
            textAreaEl.show("holder-transfer-message");
        }

        $scope.loadInitData = function () {
            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.transType;
            jsonData.templateId = gTrans.templateId;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_IIT_FUNDS_LOCAL_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true,
                function(data) {
                    var resp = data;
                    if (resp.respCode == 0) {
                        gTrans.sendMethod = resp.respJsonObj.sendMethod;
                        gTrans.listSourceAccounts = resp.respJsonObj.listSourceAccounts;
                        gTrans.limit = resp.respJsonObj.limit;
                        $scope.initComboTextAccount();
                        // fillSendMethod();
                        //
                        // if (resp.respJsonObj.templateInfo) {
                        //     gTrans.templateInfo = resp.respJsonObj.templateInfo[0];
                        //     fillTemplateData();
                        // }
                    }
                },
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                    gotoHomePage();
                }
            );
        }

        $scope.onChangeSwitchSubMenu = function (estr) {
            var e = document.getElementById(estr);
            var clickTime = new Date().getTime();
            if (lastClickSwitch && (clickTime - lastClickSwitch) < 100) {
                return true;
            }
            lastClickSwitch = clickTime;
            var idDiv = e.id;
            if(idDiv =="save-doc-temp-transfer" && gDisabledLuuMau && document.getElementById('save-doc-temp-transfer').className.indexOf('custom-switch-on') ==-1){
                return;
            }


            var inputNode = e.getElementsByTagName('input')[0];

            if(inputNode) {
                inputNode.checked = !inputNode.checked;
            }
            changeSwitchUI(e);

            if(e.id =="save-doc-temp-transfer" && inputNode.checked){
                document.getElementById("id.sample.name").value = "";
                document.getElementById("id.sample").style.display = "";
            }else if(e.id == "save-doc-temp-transfer" && !inputNode.checked){
                document.getElementById("id.sample").style.display = "none";
            }
        }

        //Get Account Name from User ID
        $scope.loadInfoFromIdAccount = function () {
            var userId = "";
            if (gTrans.transType == "T11") {
                if (gTrans.accName != "") {
                    document.getElementById("trans.targetaccountname").innerHTML = gTrans.accName;
                    return;
                }
                userId = document.getElementById("trans.desaccountno").value;
            }
            if (gTrans.transType == "T12") {
                userId = document.getElementById("trans.targetaccount").value;
            }

            var jsonData = new Object();
            jsonData.sequence_id = "3";
            jsonData.idtxn = gTrans.transType;
            jsonData.accountId = userId;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_IIT_FUNDS_LOCAL_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true,
                function(data) {
                    var resp = data;
                    if (resp.respCode == 0 && resp.respJsonObj.length > 0 && resp.respJsonObj[0].GHI_CO == "N") {
                        document.getElementById("trans.accountName").value = resp.respJsonObj[0].TEN_TK;
                        if (gTrans.transType == "T11") {
                            gTrans.accName = resp.respJsonObj[0].TEN_TK;
                        }
                    } else
                        document.getElementById("trans.accountName").innerHTML = "";
                },
                function() {
                    document.getElementById("trans.accountName").innerHTML = "";
                }
            );
        }

        $scope.formatNumberToCurrency = function () {
            $scope.amount = formatNumberToCurrency($scope.amount);
        }

        $scope.sendJSONRequest = function () {
            gTrans.transInfo = {};

            gTrans.transInfo.sourceAcc = gTrans.listSourceAccounts[0].account;
            gTrans.transInfo.idtxn = gTrans.transType;
            gTrans.transInfo.destinationAcc = document.getElementById("trans.targetaccount").value;
            gTrans.transInfo.beneName = document.getElementById("trans.accountName").value;
            gTrans.transInfo.amountTrans = removeSpecialChar(document.getElementById("trans.amount").value);
            gTrans.transInfo.contentTrans = document.getElementById("trans.content").value.replace(/[!"#$@%&*'\+:;<=>?\\`^~{|}]/g, '');
            gTrans.transInfo.issavepayee = 'N';
            gTrans.transInfo.sampleName = document.getElementById("id.sample.name").value;

            var jsonData = new Object();
            jsonData.sequence_id = "4";
            jsonData.idtxn = gTrans.transType;
            jsonData.transInfo = gTrans.transInfo;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_IIT_FUNDS_LOCAL_TRANSFER"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                    if (response.respCode == '0'){
                        gTrans.transInfo.transId = response.respJsonObj[0].MA_GD;
                        gTrans.src = "pages/transfer/views/transfer-local-view.html";
                        navController.pushToView("transfer/common-review/transfer-review-scr", true, "html");
                    }
                },
                function(){
                    showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_INIT_TRANS'));
                }
            );
        }

        $scope.loadInitData();
        $scope.initTextAreaMessage();
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}

function handleInputAmount (e, des) {
    var tmpVale = des.value;
    formatCurrency(e, des);
    //des.value = formatNumberToCurrency(des.value);
    var numStr = convertNum2WordWithLang(keepOnlyNumber(tmpVale), gUserInfo.lang);

    var nodeNumTxt = document.getElementById("trans.amounttotext");

    //nodeNumTxt.innerHTML = "<h6 class='h6style'>" + CONST_STR.get('TRANS_LOCAL_NUM_TO_WORD') + ": <b>" + numStr + "</b></h6>";
    //ngocdt3 chinh sua bo bang chu
    //nodeNumTxt.innerHTML = "<div class='txtmoneystyle'>" + CONST_STR.get('TRANS_LOCAL_NUM_TO_WORD') + ": " + numStr + "</div>";
    nodeNumTxt.innerHTML = "<div class='txtmoneystyle'>" + numStr + "</div>";
}