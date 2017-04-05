/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 12/13/16
 * Time: 10:37 AM
 * To change this template use File | Settings | File Templates.
 */
var statusEditingName = false;
var accDetailFlag = false;
var ListAccount;
gAccount.pageId =1;
function viewDidLoadSuccess(){
       initData();
    navController.getBottomBar().hide();
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        gAccount.rowsPerPage = 10;
    }else{
        gAccount.rowsPerPage = 5;
    }
    gAccount.totalPages = 0;
}
function viewBackFromOther() {
    accDetailFlag = true;
}
function initData(){
    angular.module("EbankApp").controller('account_tenor_deposit', function ($scope, requestMBServiceCorp){
        $scope.formatNumberToCurrency = function(amount) {
            var tmpAmount = amount;
            if (typeof(amount) == 'string') {
                var tmpAmountStr = removeSpecialChar(tmpAmount);
                tmpAmount = parseInt(tmpAmountStr);
            }
            places = 0; //phan thap phan
            symbol = "";//" VND";
            thousand = ",";
            decimal = ".";
            var number = this,
                negative = tmpAmount < 0 ? "-" : "",
                i = parseInt(tmpAmount = Math.abs(+tmpAmount || 0).toFixed(places), 10) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
            return negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(tmpAmount - i).toFixed(places).slice(2) : "" + symbol);

        }
        $scope.initData = function(){
            var args = ["", {
                idtxn: "A11",
                sequenceId: 4
            }];
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_ACCOUNT_TYPE_QUERY_DETAIL"), "", "",gUserInfo.lang, gUserInfo.sessionID, args);
            var requestData = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(requestData, true, function(response){
                if(response.respCode == 0){
                    gAccount.accList = response.respJsonObj;
                    ListAccount =  $scope.infoAcc;
                    gAccount.totalPages= getTotalPages(gAccount.accList.length);
                    $scope.arrPage=[];
                    for(var j = 1; j <= gAccount.totalPages; j++ ){
                        $scope.arrPage.push(j);
                    }

                    setTimeout(function(){
                        displayPageCurent(gAccount.pageId);
                    },100)

                    var inArrAcc = new Array();
                    if(gAccount.accList.length >gAccount.rowsPerPage){
                        for (var i = 0; i < gAccount.rowsPerPage; i++) {
                            inArrAcc.push(gAccount.accList[i]);
                            $scope.infoAcc=inArrAcc;
                        }
                    }else{
                        for (var i = 0; i < gAccount.accList.length; i++) {
                            inArrAcc.push(gAccount.accList[i]);
                            $scope.infoAcc=inArrAcc;
                        }
                    }
                    document.getElementById("acc").style.display = "block";
                    if(gAccount.totalPages <= 1){
                        document.getElementById("pagination").style.display = "none";
                    }
                }
            });
        }
        $scope.initData();

        $scope.kkhSelectedPage = function(idx) {
            $scope.pageIndicatorSelected(idx, "");
        }

        $scope.pageIndicatorSelected = function(selectedIdx, selectedPage) {
            gAccount.pageId = selectedIdx;
            var dataGen = {};
            dataGen = gAccount.accList;

            var startIdx = (selectedIdx - 1) * gAccount.rowsPerPage;
            var endIdx = startIdx + gAccount.rowsPerPage;
            var listPending = new Array();

            for (var i = startIdx; i < endIdx; i++) {
                if (gAccount.accList[i] != undefined) {
                    listPending.push(gAccount.accList[i]);
                }
            }
            $scope.infoAcc=listPending;
            document.getElementById("acc").style.display = "block";
            displayPageCurent(selectedIdx);
        }
        $scope.viewAccDetail = function (idx){
            if(statusEditingName) return;

            logInfo('selected account: ' + idx);
            var ArrListAccount = $scope.infoAcc;
            var length =ArrListAccount.length;
            for (var i = 0; i < length; i++) {
                var tmpAccIdx = ArrListAccount[i];
                if (tmpAccIdx.SO_TK == idx) {
                    tmpAcc = tmpAccIdx;
                    setSelectedAccInfoObj(tmpAccIdx);
                    break;
                }
            }
            gAccount.accountId = idx;
            //$scope.infoAcc.SO_TK = idx;
            navCachedPages["account/create/search_no_tenor/account_history"] = null;
            navController.pushToView('account/create/search_no_tenor/account_history', true, 'html');
        }
        // doi ten  tai khoan
        function showEditButton(inID){
            if (gModeScreenView == CONST_MODE_SCR_SMALL) return;
            var tmpEditBtn = document.getElementById('divEdit' + inID);
            if (tmpEditBtn) {
                tmpEditBtn.style.display = '';
            }
        }
        function hideEditButton(inID){
            statusEditingName = true;

         // hideEditButton(inID);

            var tmpEditPanel = document.getElementById('divEditSave' + inID);
            if (tmpEditPanel) {
                tmpEditPanel.style.display = '';
                document.getElementById('txtNewDes' + inID).value = document.getElementById('displayAccName' + inID).innerHTML;
            }
        }
        $scope.showEditPanel = function(e,inID){
            statusEditingName = true;
            hideEditButton(inID);

            var tmpEditPanel = document.getElementById('divEditSave' + inID);
            if (tmpEditPanel) {
                tmpEditPanel.style.display = '';
                document.getElementById('txtNewDes' + inID).value = document.getElementById('displayAccName' + inID).innerHTML;
            }
        }
        $scope.saveContent = function(inID){
            statusEditingName = true;
            showEditButton(inID);

            var tmpEditPanel = document.getElementById('divEditSave' + inID);
            if (tmpEditPanel) {
                tmpEditPanel.style.display = 'none';
            }
            var tmpInputNode = document.getElementById('txtNewDes' + inID);
            if (tmpInputNode && tmpInputNode.value && tmpInputNode.value.length > 0 && (tmpInputNode.value != document.getElementById('displayAccName' + inID).innerHTML)) {
                editingAccNo = inID;
                document.getElementById('displayAccName' + inID).innerHTML = document.getElementById('txtNewDes' + inID).value;
                for (var i = 0; i < gUserInfo.accountList.length; i++) {
                    var tmpObj = gUserInfo.accountList[i];
                    if (tmpObj.accountNumber == inID && tmpObj.descByUser) {
                        tmpObj.descByUser = document.getElementById('txtNewDes' + inID).value;
                        break;
                    }
                }
                for (var i = 0; i < gUserInfo.accountListOther.length; i++) {
                    var tmpObj = gUserInfo.accountListOther[i];
                    if (tmpObj.accountNumber == inID && tmpObj.descByUser) {
                        tmpObj.descByUser = document.getElementById('txtNewDes' + inID).value;
                        break;
                    }
                }
                for (var i = 0; i < gUserInfo.accountListDetail.length; i++) {
                    var tmpObj = gUserInfo.accountListDetail[i];
                    if (tmpObj.accountNumber == inID && tmpObj.descByUser) {
                        tmpObj.descByUser = document.getElementById('txtNewDes' + inID).value;
                        break;
                    }
                }

                console.log(inID + ", " + tmpInputNode.value);

                var objectValueClient = new Object();
                objectValueClient.idtxn = "A11";
                objectValueClient.sequenceId = "1";
                objectValueClient.idAccount = inID;
                objectValueClient.newNameAcc = tmpInputNode.value;


                var arrayClientInfo = new Array();
                arrayClientInfo.push("1");
                arrayClientInfo.push(objectValueClient);

                var gprsCmd = new GprsCmdObj(1302, "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

                data = getDataFromGprsCmd(gprsCmd);
                requestMBServiceCorp.post(data, false,requestResultServiceSuccess, requestResultServiceFail);

            } else {
                // statusEditingName = false;
                var objectValueClient = new Object();
                objectValueClient.idtxn = "A11";
                objectValueClient.sequenceId = "1";
                objectValueClient.idAccount = inID;
                objectValueClient.newNameAcc = tmpInputNode.value;


                var arrayClientInfo = new Array();
                arrayClientInfo.push("1");
                arrayClientInfo.push(objectValueClient);

                var gprsCmd = new GprsCmdObj(1302, "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);

                data = getDataFromGprsCmd(gprsCmd);
                requestMBServiceCorp.post(data, false,requestResultServiceSuccess, requestResultServiceFail);
            }
        }
        function requestResultServiceSuccess(response){
            statusEditingName = false;
           // gprsResp = JSON.parse(e);
            if(parseInt(response.respCode) == 0){
                var tmpNodeAccName = document.getElementById('displayAccName' + editingAccNo).innerHTML = document.getElementById('txtNewDes' + editingAccNo).value;
            }
        }

        function requestResultServiceFail(){
            statusEditingName = false;
        }

        function getTotalPages(totalRows) {
            return totalRows % gAccount.rowsPerPage == 0 ? Math.floor(totalRows / gAccount.rowsPerPage) : Math.floor(totalRows / gAccount.rowsPerPage) + 1;
        }
    });
  
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp']);
}


function getArrayClient(objectValueClient) {
    var arrayClientInfo = new Array();
    arrayClientInfo.push("2");
    arrayClientInfo.push(objectValueClient);

    return arrayClientInfo;
}
function  displayPageCurent(selectedIdx) {
    var paging = document.getElementById("pagingTrans");
    if(paging.childElementCount >0)
    {
        for(var i = 0;i<paging.childElementCount;i++)
        {
            var child = paging.children[i];
            child.className ="";
        }
        document.getElementById('page_'+selectedIdx).className = 'active';
    }
}