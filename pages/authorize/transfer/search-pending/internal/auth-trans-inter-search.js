/**
 * Created by HaiDT1 on 12/14/2016.
 */

var transSelected = 0;
var statusSelected = 0
var startDate;
var endDate;
var flag;
var viewBack = false;
gTrans.idtxn = "T61"
function viewDidLoadSuccess() {
    init();
}

function init() {
    angular.module('EbankApp').controller('auth-trans-inter-search', function ($scope, requestMBServiceCorp) {
        document.getElementById("type-trans-value").innerHTML = (gUserInfo.lang == 'EN') ? CONST_INTERNAL_TRANS_TYPE_EN[0] : CONST_INTERNAL_TRANS_TYPE_VN[0];
        document.getElementById("status-value").innerHTML = (gUserInfo.lang == 'EN') ? INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_EN[0] : INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_VN[0];
        navController.getBottomBar().hide();
        
        $scope.initData = function () {
            var jsonData = new Object();
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;
            var	args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_AU_INTERNAL"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
               if(response.respCode == '0' && response.respJsonObj.makers.length > 0 && response.respJsonObj.limit) {
                   gTrans.makers = response.respJsonObj.makers;
                   gTrans.limit = response.respJsonObj.limit;

                   gTrans.listMaker = [];
                   gTrans.listMakerValue = [];

                   gTrans.listMaker.push(CONST_STR.get("COM_ALL"));
                   gTrans.listMakerValue.push("");
                   for (var i in gTrans.makers){
                       gTrans.listMaker.push(gTrans.makers[i].IDUSER);
                       gTrans.listMakerValue.push(gTrans.makers[i].IDUSER);
                   }

                   document.getElementById("maker-value").innerHTML = gTrans.listMaker[0];
               }else {
                   showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                   gotoHomePage();
               }
            }, function () {
                showAlertText(CONST_STR.get('CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA'));
                gotoHomePage();
            });

        }

        $scope.selectTransType = function (){
            var array = (gUserInfo.lang == 'EN') ? CONST_INTERNAL_TRANS_TYPE_EN : CONST_INTERNAL_TRANS_TYPE_VN;
            var bd = document.getElementById("translist");
            bd.style.borderBottomLeftRadius = "0px";
            bd.style.borderBottomRightRadius = "0px";
            document.getElementById("narrowspin").style.transform = "rotate(90deg)";

            var dialogHeight = 0;
            var divNode = document.getElementById('viewSelectionct');

            if ((divNode != null) && (divNode != undefined)) {
                divNode.innerHTML = "";
            }

            var dialogDivAll = document.createElement('div');
            var dialogDivContainerScroll = document.createElement('div');
            dialogDivContainerScroll.setAttribute('id', 'selection-dialog-scroll');
            dialogDivContainerScroll.setAttribute('class', 'dialog-scroll-content');
            var dialogDivContainer = document.createElement('div');

            for (var x = 1; x < array.length + 1; x++) {
                if (x < 6) {
                    dialogHeight = dialogHeight + 39;
                }
                var aNode = document.createElement("a");

                if (x == 0) {
                    aNode.setAttribute("class", "list-group-item active");
                    aNode.innerHTML = inTitle;
                    divNode.appendChild(aNode);
                }
                else {
                    aNode.setAttribute("class", "list-group-item");
                    if (showValue) {
                        aNode.style.textAlign = "center";
                    }
                    else {
                        aNode.style.textAlign = "center";
                    }
                    aNode.setAttribute("onClick", "transferSelected(this," + x + ");");
                    aNode.innerHTML = array[x - 1];
                    dialogDivContainer.appendChild(aNode);
                }
            }
            dialogDivContainerScroll.appendChild(dialogDivContainer);
            dialogDivAll.appendChild(dialogDivContainerScroll);
            divNode.appendChild(dialogDivAll);
            if(divNode.style.display == 'block'){
                divNode.style.display = 'none';
                document.getElementById("translist").style.borderBottomLeftRadius = "8px";
                document.getElementById("translist").style.borderBottomRightRadius = "8px";
                document.getElementById("narrowspin").style.transform = "rotate(0)";

            }else{
                divNode.style.display = 'block';
            }
        }
        
        $scope.selectMaker = function () {
            var array = gTrans.listMaker;
            var bd = document.getElementById("translist");
            bd.style.borderBottomLeftRadius = "0px";
            bd.style.borderBottomRightRadius = "0px";
            document.getElementById("narrowspinmaker").style.transform = "rotate(90deg)";

            var dialogHeight = 0;
            var divNode = document.getElementById('viewSelectionctMaker');

            if ((divNode != null) && (divNode != undefined)) {
                divNode.innerHTML = "";
            }

            var dialogDivAll = document.createElement('div');
            var dialogDivContainerScroll = document.createElement('div');
            dialogDivContainerScroll.setAttribute('id', 'selection-dialog-scroll');
            dialogDivContainerScroll.setAttribute('class', 'dialog-scroll-content');
            var dialogDivContainer = document.createElement('div');

            for (var x = 1; x < array.length + 1; x++) {
                if (x < 6) {
                    dialogHeight = dialogHeight + 39;
                }
                var aNode = document.createElement("a");

                if (x == 0) {
                    aNode.setAttribute("class", "list-group-item active");
                    aNode.innerHTML = inTitle;
                    divNode.appendChild(aNode);
                }
                else {
                    aNode.setAttribute("class", "list-group-item");
                    if (showValue) {
                        aNode.style.textAlign = "center";
                    }
                    else {
                        aNode.style.textAlign = "center";
                    }
                    aNode.setAttribute("onClick", "makerSelectedValue(this," + x + ");");
                    aNode.innerHTML = array[x - 1];
                    dialogDivContainer.appendChild(aNode);
                }
            }
            dialogDivContainerScroll.appendChild(dialogDivContainer);
            dialogDivAll.appendChild(dialogDivContainerScroll);
            divNode.appendChild(dialogDivAll);
            if(divNode.style.display == 'block'){
                divNode.style.display = 'none';
                document.getElementById("makerlist").style.borderBottomLeftRadius = "8px";
                document.getElementById("makerlist").style.borderBottomRightRadius = "8px";
                document.getElementById("narrowspinmaker").style.transform = "rotate(0)";

            }else{
                divNode.style.display = 'block';
            }
        }

        $scope.showTransStatusSelection = function (){
            var array = (gUserInfo.lang == 'EN') ? INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_EN: INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_VN;
            var bd = document.getElementById("statuslist");
            bd.style.borderBottomLeftRadius = "0px";
            bd.style.borderBottomRightRadius = "0px";
            document.getElementById("narrowspinstatus").style.transform = "rotate(90deg)";

            var dialogHeight = 0;
            var divNode = document.getElementById('viewSelectionctStatus');

            if ((divNode != null) && (divNode != undefined)) {
                divNode.innerHTML = "";
            }

            var dialogDivAll = document.createElement('div');
            var dialogDivContainerScroll = document.createElement('div');
            dialogDivContainerScroll.setAttribute('id', 'selection-dialog-scroll');
            dialogDivContainerScroll.setAttribute('class', 'dialog-scroll-content');
            var dialogDivContainer = document.createElement('div');

            for (var x = 1; x < array.length + 1; x++) {
                if (x < 6) {
                    dialogHeight = dialogHeight + 39;
                }
                var aNode = document.createElement("a");

                if (x == 0) {
                    aNode.setAttribute("class", "list-group-item active");
                    aNode.innerHTML = inTitle;
                    divNode.appendChild(aNode);
                }
                else {
                    aNode.setAttribute("class", "list-group-item");
                    if (showValue) {
                        aNode.style.textAlign = "center";
                    }
                    else {
                        aNode.style.textAlign = "center";
                    }
                    aNode.setAttribute("onClick", "statusSelectedValue(this," + x + ");");
                    aNode.innerHTML = array[x - 1];
                    dialogDivContainer.appendChild(aNode);
                }
            }
            dialogDivContainerScroll.appendChild(dialogDivContainer);
            dialogDivAll.appendChild(dialogDivContainerScroll);
            divNode.appendChild(dialogDivAll);
            if(divNode.style.display == 'block'){
                divNode.style.display = 'none';
                document.getElementById("statuslist").style.borderBottomLeftRadius = "8px";
                document.getElementById("statuslist").style.borderBottomRightRadius = "8px";
                document.getElementById("narrowspinstatus").style.transform = "rotate(0)";

            }else{
                divNode.style.display = 'block';
            }
        }

        $scope.transSearch = function (){
            // document.getElementById('id.searchResult').innerHTML = "";
            //
            // searchInfo.fromDate = document.getElementById("id.begindate").value;
            // searchInfo.endDate = document.getElementById("id.enddate").value;

            var jsonData = new Object();
            jsonData.sequence_id = "2";
            jsonData.idtxn = "T61";

            jsonData.transType = "T12";
            jsonData.status = "";
            jsonData.maker = "";
            jsonData.fromDate = "";
            jsonData.endDate = "";

            var	args = new Array();
            args.push("2");
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_AU_INTERNAL'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true,function (response) {
                if (response.respCode == '0'){
                    navCachedPages['authorize/transfer/search-pending/internal/auth-trans-list-pending'] = null;
                    navController.pushToView('authorize/transfer/search-pending/internal/auth-trans-list-pending', true, 'html');
                }
            }, function () {

            });
        }

        $scope.onClickBack = function () {
            navCachedPages["authorize/auth-transfer"] = null;
            navController.popView(true);
        }


        if (!viewBack){
            $scope.initData();
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}


function transferSelected(inNode,index){
    document.getElementById('viewSelectionct').style.display = 'none';
    var bd = document.getElementById("translist");
    bd.style.borderBottomLeftRadius = "8px";
    bd.style.borderBottomRightRadius = "8px";
    document.getElementById("narrowspin").style.transform = "rotate(0)";
    transSelected = parseInt(index) - 1;
    document.getElementById("type-trans-value").innerHTML = (gUserInfo.lang == 'EN') ? CONST_INTERNAL_TRANS_TYPE_EN[transSelected] : CONST_INTERNAL_TRANS_TYPE_VN[transSelected];
}

function makerSelectedValue(inNode,index) {
    document.getElementById('viewSelectionctMaker').style.display = 'none';
    var bd = document.getElementById("makerlist");
    bd.style.borderBottomLeftRadius = "8px";
    bd.style.borderBottomRightRadius = "8px";
    document.getElementById("narrowspinmaker").style.transform = "rotate(0)";
    makerSelected = parseInt(index) - 1;
    document.getElementById("maker-value").innerHTML = gTrans.listMaker[makerSelected];
}

function statusSelectedValue(inNode,index){
    document.getElementById('viewSelectionctStatus').style.display = 'none';
    var bd = document.getElementById("statuslist");
    bd.style.borderBottomLeftRadius = "8px";
    bd.style.borderBottomRightRadius = "8px";
    document.getElementById("narrowspinstatus").style.transform = "rotate(0)";
    statusSelected = parseInt(index) - 1;
    document.getElementById("status-value").innerHTML = (gUserInfo.lang == 'EN') ? INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_EN[statusSelected]: INTERNAL_TRANS_AUTH_LIST_TRANS_STATUS_VN[statusSelected];
}

function loadCalendarTrans(e){
    e.childNodes[1].style.borderBottomLeftRadius = "0px";
    e.childNodes[1].style.borderBottomRightRadius = "0px";
    e.childNodes[3].style.transform = "rotate(90deg)";
    var type = e.id;
    if(type === "startDate"){
        var startDateHtml = document.getElementById("start-date-value").innerText;
        document.getElementById('holder-calendar-picker').style.display = "block";
        loadCalendarInline("calendar-picker",false,setStartDateScheduleer,changeStringToArrayDate(startDateHtml));
    }else if(type === "endDate"){
        var endDateHtml = document.getElementById("end-date-value").innerText;
        document.getElementById('holder-calendar-pickers').style.display = "block";
        loadCalendarInline("calendar-pickers",false,setEndDateScheduleers,changeStringToArrayDate(endDateHtml));
    }
}