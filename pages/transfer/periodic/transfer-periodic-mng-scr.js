// JavaScript Document
var dataObj;
var sttID;
var gFreqMNG;
var docXml;
var gMNGAcc;
var objJSON;
gTrans.totalPage;
var xmlRequest;
gTrans.curPage;
gTrans.results;
var respData;
var rowsPerPage = 10;
var totalPages = 0;
var searchData = {
   sequence_id : "2",
   idtxn : "T00",
   typeacct : '',
   frequency : '',
   datstart : '',
   datend : '',
   codstatus : '',
   accdeb : '',
   pageSize : 100000000,
   pageId : 1
}

function viewDidLoadSuccess() {
  if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        gTrans.rowsPerPage = 10;
    }else{
        gTrans.rowsPerPage = 5;
    }
  bottomBar.hide();
  // resizeMainViewContent();
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
      document.getElementById('toDate').innerHTML = "";
      document.getElementById('toDate').value = "";
        gTrans.pageS = 10;
    }else{
      document.getElementById('toDatemb').innerHTML = "";
      document.getElementById('toDatemb').value = "";
        gTrans.pageS = 5;
    }
  
  
  logInfo('transfer load success');
  // if (flgmng == undefined || flgmng == false) {
    document.getElementById('tblContent').innerHTML = '';
    // document.getElementById('id.button.cancel').style.display = 'none';

    if (gUserInfo.lang == 'EN') {
      if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        document.getElementById('id.acctype').value = CONST_MNG_KEY_PERIODIC_LOCAL_EN[0];
        document.getElementById('id.accountno').value = CONST_MNG_KEY_ACC_LIST_EN[0];
        document.getElementById('id.stt').value = CONST_VALUE_TRANS_PERIODIC_BN_STT_EN[0];
        document.getElementById('id.freq').value = CONST_MNG_KEY_PERIODIC_FREQUENCY_EN[0];
      }else{
        document.getElementById('id.acctypemb').value = CONST_MNG_KEY_PERIODIC_LOCAL_EN[0];
        document.getElementById('id.accountnomb').value = CONST_MNG_KEY_ACC_LIST_EN[0];
        document.getElementById('id.sttmb').value = CONST_VALUE_TRANS_PERIODIC_BN_STT_EN[0];
        document.getElementById('id.freqmb').value = CONST_MNG_KEY_PERIODIC_FREQUENCY_EN[0];
      }

    } else {
      if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        document.getElementById('id.acctype').value = CONST_MNG_KEY_PERIODIC_LOCAL_VN[0];
        document.getElementById('id.accountno').value = CONST_MNG_KEY_ACC_LIST_VN[0];
        document.getElementById('id.stt').value = CONST_VALUE_TRANS_PERIODIC_BN_STT_VN[0];
        document.getElementById('id.freq').value = CONST_MNG_KEY_PERIODIC_FREQUENCY_VN[0];
      }else{
        document.getElementById('id.acctypemb').value = CONST_MNG_KEY_PERIODIC_LOCAL_VN[0];
        document.getElementById('id.accountnomb').value = CONST_MNG_KEY_ACC_LIST_VN[0];
        document.getElementById('id.sttmb').value = CONST_VALUE_TRANS_PERIODIC_BN_STT_VN[0];
        document.getElementById('id.freqmb').value = CONST_MNG_KEY_PERIODIC_FREQUENCY_VN[0];
      }

    }

    gMNGAcc = CONST_MNG_KEY_ACC_LIST[0];
    sttID = CONST_KEY_TRANS_PERIODIC_BN_STT[0];
    gFreqMNG = CONST_MNG_VAL_PERIODIC_FREQUENCY[0];
    // flgmng = true;
    gacctype = CONST_KEY_PERIODIC_LOCAL_BN_SEARCH_VN[0];
    searchData.accdeb = ''; 
  // }
      init();
  console.log("gUserInfo.userRole", gUserInfo.userRole.indexOf('CorpInput'));





  //Check quyen de hien thi man quan ly giao dich
  if(gUserInfo.userRole.indexOf('CorpInput') == -1 &&  document.getElementById("page.input") != null){
  var elem11 = document.getElementById("page.input");
    elem11.parentNode.removeChild(elem11);
  }
}

function init(){
    angular.module('EbankApp').controller('transfer_periodic_mng_scr', function ($scope, requestMBServiceCorp) {
        //show loai giao dich
    $scope.showInputAccountTypeMNG = function() {
      var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_MNG_KEY_PERIODIC_LOCAL_EN : CONST_VAL_PERIODIC_LOCAL_BN_SEARCH_VN;
      var tmpArray2 = CONST_KEY_PERIODIC_LOCAL_BN_SEARCH_VN;

      var handleInputAccountTypeMNG = function(e) {
        if (currentPage == "transfer/periodic/transfer-periodic-mng-scr") {
          document.removeEventListener("evtSelectionDialog", handleInputAccountTypeMNG, false);
          var acctype;
          if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
            acctype = document.getElementById('id.acctype');
          }else{
            acctype = document.getElementById('id.acctypemb');
          }
          if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
            if (acctype.nodeName == "INPUT") {
              acctype.value = e.selectedValue1;
            } else {
              acctype.innerHTML = e.selectedValue1;
            }
          }

          if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
            gacctype = e.selectedValue2;
          }
        }
      }

      var handleInputAccountTypeMNGClose = function() {
        if (currentPage == "transfer/periodic/transfer-periodic-mng-scr") {
          document.removeEventListener("evtSelectionDialogClose", handleInputAccountTypeMNGClose, false);
          document.removeEventListener("evtSelectionDialog", handleInputAccountTypeMNG, false);
        }
      }

      document.addEventListener("evtSelectionDialog", handleInputAccountTypeMNG, false);
      document.addEventListener("evtSelectionDialogClose", handleInputAccountTypeMNGClose, false);
      showDialogList(CONST_STR.get('COM_CHOOSEN_TYPE_TRANS'), tmpArray1, tmpArray2, false);
    }

    //sHOW TRANG THAI
    $scope.showSTT = function() {
      var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_VALUE_TRANS_PERIODIC_BN_STT_EN : CONST_VALUE_TRANS_PERIODIC_BN_STT_VN;
      var tmpArray2 = CONST_KEY_TRANS_PERIODIC_BN_STT;

      var handleshowSTT = function(e) {
        if (currentPage == "transfer/periodic/transfer-periodic-mng-scr") {
          document.removeEventListener("evtSelectionDialog", handleshowSTT, false);
          if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
            var sttcont;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
              sttcont = document.getElementById('id.stt');
            }else{
              sttcont = document.getElementById('id.sttmb');
            }
            if (sttcont.nodeName == "INPUT") {
              sttcont.value = e.selectedValue1;
            } else {
              sttcont.innerHTML = e.selectedValue1;
            }
          }
          if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
            sttID = e.selectedValue2;
          }
        }
      }

      var handleshowSTTClose = function() {
        if (currentPage == "transfer/periodic/transfer-periodic-mng-scr") {
          document.removeEventListener("evtSelectionDialogClose", handleshowSTTClose, false);
          document.removeEventListener("evtSelectionDialog", handleshowSTT, false);
        }
      }

      document.addEventListener("evtSelectionDialog", handleshowSTT, false);
      document.addEventListener("evtSelectionDialogClose", handleshowSTTClose, false);
      showDialogList(CONST_STR.get('COM_CHOOSE_STATUS'), tmpArray1, tmpArray2, false);
    }

    //Show tan suat
    $scope.showInputFrequencyMNG = function() {
      var tmpArray1 = (gUserInfo.lang == 'EN') ? CONST_VAL_PERIODIC_BN_FREQUENCY_SEARCH_EN : CONST_VAL_PERIODIC_BN_FREQUENCY_SEARCH_VN;
      var tmpArray2 = CONST_KEY_PERIODIC_BN_FREQUENCY_SEARCH;

      var handleInputFrequencyMNG = function(e) {
        if (currentPage == "transfer/periodic/transfer-periodic-mng-scr") {
          document.removeEventListener("evtSelectionDialog", handleInputFrequencyMNG, false);
          var frequency;
          if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
            frequency = document.getElementById('id.freq');
          }else{
            frequency = document.getElementById('id.freqmb');
          }
          if ((e.selectedValue1 != undefined) && (e.selectedValue1 != null)) {
            if (frequency.nodeName == "INPUT") {
              frequency.value = e.selectedValue1;
            } else {
              frequency.innerHTML = e.selectedValue1;
            }
          }

          if ((e.selectedValue2 != undefined) && (e.selectedValue2 != null)) {
            gFreqMNG = e.selectedValue2;
          }
        }
      }

      var handleInputFrequencyMNGClose = function() {
        if (currentPage == "transfer/periodic/transfer-periodic-mng-scr") {
          document.removeEventListener("evtSelectionDialogClose", handleInputFrequencyMNGClose, false);
          document.removeEventListener("evtSelectionDialog", handleInputFrequencyMNG, false);
        }
      }

      document.addEventListener("evtSelectionDialog", handleInputFrequencyMNG, false);
      document.addEventListener("evtSelectionDialogClose", handleInputFrequencyMNGClose, false);
      showDialogList(CONST_STR.get('TRANS_PERIODIC_DIALOG_TITLE_FREQUENCY'), tmpArray1, tmpArray2, false);
    }

    // Get nguoi tao giao dich
    $scope.getUserWhoCreatedTransaction = function() {
      //Collect và gửi data lên 
      dataObj = new Object();
      dataObj.sequence_id = "1";
      dataObj.idtxn = "T00";

      var arrArgs = new Array();
      arrArgs.push("1");
      arrArgs.push(dataObj);
      var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_USER_CREATED_TRANSACTION"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrArgs);
      var data = getDataFromGprsCmd(gprsCmd);
      requestMBServiceCorp.post(data, true, requestUserServiceSuccess, requestUserServiceFail);
    }
    // click tim kiem
    $scope.searchPeriodicTrans = function() {
      var data = {};
      var arrayArgs = new Array();
      var sdateTrans;
      var edateTrans;
      var acctype;
      var accdeb;
      var stt;
      var freq;
      if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        acctype = document.getElementById('id.acctype'); //loai giao dich
        accdeb = document.getElementById('id.accountno'); //userid
        stt = document.getElementById('id.stt'); //stt
        freq = document.getElementById('id.freq'); //tan suat
        sdateTrans = document.getElementById('fromDate');
        edateTrans = document.getElementById('toDate');
      }else{
        acctype = document.getElementById('id.acctypemb'); //loai giao dich
        accdeb = document.getElementById('id.accountnomb'); //userid
        stt = document.getElementById('id.sttmb'); //stt
        freq = document.getElementById('id.freqmb'); //tan suat
        sdateTrans = document.getElementById('fromDatemb');
        edateTrans = document.getElementById('toDatemb');
      }

      var currentDate = new Date();
      var strCurrentDate = ('0' + (currentDate.getDate() + 1)) + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();

      var tmpsdate = sdateTrans.value;
      var tmpedate = edateTrans.value;

      if (tmpsdate == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
        showAlertText(CONST_STR.get('ERR_INPUT_START_DATE'));
        return;
      }
      if (tmpedate == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
        showAlertText(CONST_STR.get('ERR_INPUT_END_DATE'));
        return;
      }



      if (!debtCheckFormatDate(tmpsdate)) {
        showAlertText(CONST_STR.get("CORP_MSG_ACC_TIME_SEARCH_NOT_VALID"));
      };

      if (!debtCheckFormatDate(tmpedate)) {
        showAlertText(CONST_STR.get("CORP_MSG_ACC_TIME_SEARCH_NOT_VALID"));
      };


      if (calculateDifferentMonth(sdateTrans.value, edateTrans.value)) {
        // showAlertText(CONST_STR.get("TRANS_PERIODIC_END_DATE_LESS_TO_DATE"));
        showAlertText(CONST_STR.get("CORP_MSG_ACC_TIME_SEARCH_NOT_VALID"));
        return;
      }



      searchData.pageId = 1;
      gTrans.sequence_id = "2";
      gTrans.idtxn = "T00";
      gTrans.typeacct = gacctype;
      gTrans.frequency = gFreqMNG;
      gTrans.datstart = sdateTrans.value;
      gTrans.datend = edateTrans.value;
      gTrans.codstatus = sttID;
      gTrans.accdeb = searchData.accdeb;
      gTrans.pageSize = searchData.pageSize;
      gTrans.pageId = searchData.pageId;

      console.log("gTrans", gTrans);
      var args = new Array();
      args.push("2");
      args.push(gTrans);
      var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_USER_CREATED_TRANSACTION'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
      var data = getDataFromGprsCmd(gprsCmd);
      requestMBServiceCorp.post(data, true, requestResultServiceSuccess, requestResultServiceFail);
    }

        $scope.changePage = function (idx) {
            document.getElementById('page_'+gTrans.pageId).className = '';
            var data = {};
            var arrayArgs = new Array();
            var sdateTrans;
            var edateTrans;
            var acctype;
            var accdeb;
            var stt;
            var freq;
            if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
                acctype = document.getElementById('id.acctype'); //loai giao dich
                accdeb = document.getElementById('id.accountno'); //userid
                stt = document.getElementById('id.stt'); //stt
                freq = document.getElementById('id.freq'); //tan suat
                sdateTrans = document.getElementById('fromDate');
                edateTrans = document.getElementById('toDate');
            }else{
                acctype = document.getElementById('id.acctypemb'); //loai giao dich
                accdeb = document.getElementById('id.accountnomb'); //userid
                stt = document.getElementById('id.sttmb'); //stt
                freq = document.getElementById('id.freqmb'); //tan suat
                sdateTrans = document.getElementById('fromDatemb');
                edateTrans = document.getElementById('toDatemb');
            }

            var currentDate = new Date();
            var strCurrentDate = ('0' + (currentDate.getDate() + 1)) + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();

            var tmpsdate = sdateTrans.value;
            var tmpedate = edateTrans.value;

            if (tmpsdate == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
                showAlertText(CONST_STR.get('ERR_INPUT_START_DATE'));
                return;
            }
            if (tmpedate == CONST_STR.get('COM_TXT_SELECTION_PLACEHOLDER')) {
                showAlertText(CONST_STR.get('ERR_INPUT_END_DATE'));
                return;
            }



            if (!debtCheckFormatDate(tmpsdate)) {
                showAlertText(CONST_STR.get("CORP_MSG_ACC_TIME_SEARCH_NOT_VALID"));
            };

            if (!debtCheckFormatDate(tmpedate)) {
                showAlertText(CONST_STR.get("CORP_MSG_ACC_TIME_SEARCH_NOT_VALID"));
            };


            if (calculateDifferentMonth(sdateTrans.value, edateTrans.value)) {
                // showAlertText(CONST_STR.get("TRANS_PERIODIC_END_DATE_LESS_TO_DATE"));
                showAlertText(CONST_STR.get("CORP_MSG_ACC_TIME_SEARCH_NOT_VALID"));
                return;
            }

            gTrans.sequence_id = "2";
            gTrans.idtxn = "T00";
            gTrans.typeacct = gacctype;
            gTrans.frequency = gFreqMNG;
            gTrans.datstart = sdateTrans.value;
            gTrans.datend = edateTrans.value;
            gTrans.codstatus = sttID;
            gTrans.accdeb = searchData.accdeb;
            gTrans.pageSize = 10;
            gTrans.pageId = idx;
            var args = new Array();
            args.push("2");
            args.push(gTrans);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_USER_CREATED_TRANSACTION'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, requestResultServiceSuccess, requestResultServiceFail);
            displayPageCurent(idx);
        }
        function  pagingItem(){
            return '<li ng-repeat="i in arrPage" ng-click="changePage(i)" id="{{page$index + 1}}"><span ng-bind="i"></span></li>';
        }
        function  displayPageCurent(page) {
            var paging = document.getElementById("pagingTrans");
            if(paging.childElementCount >0)
            {
                for(var i = 0;i<paging.childElementCount;i++)
                {
                    var child = paging.children[i];
                    child.className ="";
                }
                document.getElementById('page_'+page).className = 'active';
            }
        }

    function requestResultServiceSuccess(e){
            var gprsResp = e;// JSON.parse(e)
            setRespObjStore(gprsResp); //store response
            if (gprsResp.respCode == 0) {
                //them phan trang
                // gTrans.listTrans = [];
                gTrans.curPage = 1;
                gTrans.results = gprsResp.respJsonObj;
              if (gTrans.results.length == 0) {
                    document.getElementById("tblContent").innerHTML = CONST_STR.get('CORP_MSG_COM_NO_DATA_FOUND');
                } else {
                    var listPending = new Array();
                    gTrans.totalPages = getTotalPages(gTrans.results.length);
                    if (gTrans.results.length > gTrans.rowsPerPage) {
                        for (var i = 0; i < gTrans.rowsPerPage; i++) {
                            listPending.push(gTrans.results[i]);
                        }
                    } else {
                        for (var i = 0; i < gTrans.results.length; i++) {
                            listPending.push(gTrans.results[i]);
                        }
                    }
                    document.getElementById("tblContent").innerHTML = genHtmlDoc(listPending);
                    genPagging(gTrans.totalPages, 1);
                }      

            }
        }
        $scope.searchPeriodicTrans();
    });
    angular.bootstrap(document.getElementById('mainViewContent'), ['EbankApp'])
}

function requestUserServiceSuccess(e) {
  var gprsResp = e; //JSON.parse(e);
  setRespObjStore(gprsResp); // !!!!!!!!!!!! DON'T MISS IT
  var obj = gprsResp.respJsonObj;
  console.log("obj", obj);

  var listUser = [];
  listUser.push(CONST_STR.get("COM_ALL"));

  var keyListUser = [];
  keyListUser.push("");

  for (var i in obj) {
    listUser.push(obj[i].IDUSER);
    keyListUser.push(obj[i].IDUSER);
  }

  document.addEventListener("evtSelectionDialog", handleSelectUser, false);
  document.addEventListener("evtSelectionDialogClose", handleCloseUserClose, false);
  showDialogList(CONST_STR.get('COM_CHOOSE_MAKER_TRADE'), listUser, keyListUser, false);
}

function requestUserServiceFail() {

}

function handleSelectUser(e) {
  handleCloseUserClose();
  var maker;
  searchData.accdeb = e.selectedValue2;
  if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
    maker = document.getElementById('id.accountno');
  }else{
    maker = document.getElementById('id.accountnomb');
  }
  
  maker.value = e.selectedValue1;
}

function handleCloseUserClose() {
  document.removeEventListener("evtSelectionDialogClose", handleCloseUserClose, false);
  document.removeEventListener("evtSelectionDialog", handleSelectUser, false);
}


function getItemsPerPage(arrObj, pageIndex) {
    var arrTmp = new Array();
    var from = 0;
    var to = 0;
    for (var i = 0; i < arrObj.length; i++) {
        from = (pageIndex - 1) * rowsPerPage;
        to = from + rowsPerPage;
        if (i >= from && i < to) {
            arrTmp.push(arrObj[i]);
        }

    }
    return arrTmp;
}

function requestResultServiceFail(e) {
  //navController.initWithRootView('account/account-scr', true);
  var tmpPageName = navController.getDefaultPage();
  var tmpPageType = navController.getDefaultPageType();
  navController.initWithRootView(tmpPageName, true, tmpPageType);
};

function genXMLListTrans(pJson) {
  var docXml = createXMLDoc();
  var rootNode = createXMLNode('transTable', '', docXml);
  var childNode;
  var rowNode;
  var transList = pJson;

  var tmp = (searchData.pageId - 1) * rowsPerPage;

  for (var i = tmp; i < tmp + rowsPerPage; i++) {

    if (typeof transList[i] != "undefined") {
      var signnedBy = transList[i].SIGNEDBY;
      var status = transList[i].CODSTATUS;

      rowNode = createXMLNode('rows', '', docXml, rootNode);
      childNode = createXMLNode('stt', i + 1, docXml, rowNode);
      childNode = createXMLNode('dateMaker', transList[i].DATMAKE, docXml, rowNode);
      childNode = createXMLNode('amount', formatNumberToCurrency(transList[i].NUMAMOUNT), docXml, rowNode);
      childNode = createXMLNode('name', transList[i].CUSTOMER_NAME1, docXml, rowNode);
      childNode = createXMLNode('status', CONST_STR.get('TRANS_STATUS_' + transList[i].CODSTATUS), docXml, rowNode);
      childNode = createXMLNode('approver', transList[i].SIGNEDBY, docXml, rowNode);
      childNode = createXMLNode('endDate', transList[i].DATEND, docXml, rowNode);
      // childNode = createXMLNode('transId', transList[i].IDFCATREF, docXml, rowNode);
      childNode = createXMLNode('transId', transList[i].IDFCATREF_VIEW, docXml, rowNode);
      childNode = createXMLNode('idx', i, docXml, rowNode);
    };
  }
  return docXml;
}


// Click ma IDFCATREF
function showTransferDetail(idx) {
  var data = {};
  var arrayArgs = new Array();
  var obj = new Object();

  gTrans.sequence_id = "3";
  gTrans.idtxn = "T00";
  for(var i = 0; i < gTrans.results.length; i++){
      if(gTrans.results[i].IDFCATREF == idx){
          gTrans.idFcatref = gTrans.results[i].IDFCATREF;
          gTrans.idUserReference = gTrans.results[i].IDUSERREFERENCE;
          gTrans.currentSTT = gTrans.results[i].CODSTATUS;
      }
  }

  var args = new Array();
  args.push("3");
  args.push(gTrans);
  var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_USER_CREATED_TRANSACTION'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
  var data = getDataFromGprsCmd(gprsCmd);
  requestMBServiceCorp(data, true, 0, resquestTransferDetailSuccess, resquestTransferDetailFail);
}

function resquestTransferDetailSuccess(e) {
  var gprsResp = JSON.parse(e);
  setRespObjStore(gprsResp);
  console.log("gprsResp.respJsonObj ", gprsResp.respJsonObj.Details);
  console.log("gprsResp.respJsonObj ", gprsResp.respJsonObj.Data);
  if (gprsResp.respCode == 0) {
    var obj = gprsResp.respJsonObj.Details;


    genReviewScreen(obj);
  } else {
    showAlertText((CONST_STR.get("INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST")));
  };
}

function resquestTransferDetailFail(e) {

}

function genReviewScreen(obj) {
  gAccount.objTransaction = obj;
  var obj = obj;
  for(var i = 0; i < obj.length; i++){
    id_FCATREF  = obj[i].IDFCATREF;// ma giao dich
    date_make   = obj[i].DATMAKE;// ngay thuc hien
    date_check  = obj[i].DATCHECK;// ngay duyet
    status  = CONST_STR.get('TRANS_STATUS_' + obj[i].CODSTATUS);// trang thai

    trans_type  = CONST_STR.get('TRANS_TRANSFER_PERIODIC_TITLE');// loai giao dich
    id_srcacct  = obj[i].IDSRCACCT;// tai khoan chuyen
    balance_befor  = formatNumberToCurrency(obj[i].BALANCE_BEFOR) + ' VND';// so du kha dung

    num_amount  = formatNumberToCurrency(obj[i].NUMAMOUNT) + ' VND';// so tien
    txt_dest  = obj[i].TXTDESTACCT;// so tai khoan nhan tien
    cus_name  = obj[i].CUSTOMER_NAME1;// chu tai khoan nhan
    bank  = 'TPBank';// ngan hang
    service_charge  = '0 VND';// phi dich vu
    txt_pay  = obj[i].TXTPAYMTDETAILS1;// noi dung chuyen tien
    date_start  = obj[i].DATSTART;// ngay bat dau
    date_end  = obj[i].DATEND;// ngay ket thuc
    type_fre  = CONST_STR.get('CONST_TRANS_FREQUENCY_' + obj[i].TYPEFREQUENCY);// tan suat
    type_temp  = getTransTempInfo(obj[i].TYPE_TEMPLATE);// quan ly nguoi thu huong
    send_method  = CONST_STR.get("COM_NOTIFY_" + obj[i].SEND_METHOD);// gui thong bao cho nguoi duyet
  }
  
  updateAccountListInfo();
  navController.pushToView("transfer/periodic/transfer-periodic-detail-scr", true, 'html');
}

function showinputpage() {
  setTitleBar(CONST_STR.get('MENU_PERIODIC_TRANS'));
  navController.pushToView('transfer/periodic/transfer-periodic-create-scr', true, 'html');
}


function getTotalPages(totalRows) {
    return totalRows % gTrans.rowsPerPage == 0 ? Math.floor(totalRows / gTrans.rowsPerPage) : Math.floor(totalRows / gTrans.rowsPerPage) + 1;
}

function pageIndicatorSelected(selectedIdx, selectedPage) {
    gTrans.curPage = selectedIdx;

    var tmpNode = document.getElementById('tblContent');
    tmpNode.innerHTML = genHtmlDoc(gTrans.results);
    genPagging(totalPages, gTrans.curPage);

}

function genPagging(totalPages, pageIdx) {
    var nodepage = document.getElementById('pageIndicatorNums');
    var tmpStr = genPageIndicatorHtml(totalPages, pageIdx);
    nodepage.innerHTML = tmpStr;
}


function calculateDifferentMonth(valFromDate, valToDate) {
  var from = valFromDate.split("/");
  var to = valToDate.split("/");
  var fromDate = new Date(parseInt(from[2], 10), parseInt(from[1], 10) - 1, parseInt(from[0], 10));
  var toDate = new Date(parseInt(to[2], 10), parseInt(to[1], 10) - 1, parseInt(to[0], 10));

  if (fromDate > toDate) {
    return true;
  }
  return false;
}

function getTransTempInfo(templateType) {
    if (templateType == 404) {
        return CONST_STR.get("TAX_NO_SAVE_CODE");
    } else if (templateType == 0) {
        return CONST_STR.get("COM_SAVE_BENEFICIARY");
    } else if (templateType == 1) {
        return CONST_STR.get("COM_SAVE_TEMPLATE_TRANS");
    }
}

// check format tai cac truong nhap thoi gian
function debtCheckFormatDate(dataCheck){
  var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if(dataCheck == '' || dataCheck == 'dd/mm/yyyy'){
    return true;
  }else{
    if(!dataCheck.match(re)){
      return false;
    }else{
      return true;
    }
  }
}

function sendRequestExportExcel() {
  var sdateTrans;
  var edateTrans;
  var acctype;
  var accdeb;
  var stt;
  var freq;
  if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
    acctype = document.getElementById('id.acctype'); //loai giao dich
    accdeb = document.getElementById('id.accountno'); //userid
    stt = document.getElementById('id.stt'); //stt
    freq = document.getElementById('id.freq'); //tan suat
    sdateTrans = document.getElementById('fromDate');
    edateTrans = document.getElementById('toDate');
  }else{
    acctype = document.getElementById('id.acctypemb'); //loai giao dich
    accdeb = document.getElementById('id.accountnomb'); //userid
    stt = document.getElementById('id.sttmb'); //stt
    freq = document.getElementById('id.freqmb'); //tan suat
    sdateTrans = document.getElementById('fromDatemb');
    edateTrans = document.getElementById('toDatemb');
  }
  
  gTrans.sequenceId = "12";
  gTrans.idtxn = "T00";
  gTrans.typeacct = gacctype;
  gTrans.frequency = gFreqMNG;
  gTrans.datstart = sdateTrans.value;
  gTrans.datend = edateTrans.value;
  gTrans.codstatus = sttID;
  gTrans.accdeb = searchData.accdeb;
  gTrans.pageSize = searchData.pageSize;
  gTrans.pageId = searchData.pageId;

  var arrayClientInfo = new Array();
  arrayClientInfo.push(2);
  arrayClientInfo.push(gTrans);

  var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_EXPORT_EXCEL_REPORT"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayClientInfo);
  data = getDataFromGprsCmd(gprsCmd);
  corpExportExcel(data);
}


function genHtmlDoc(inArrAcc) {
    var length = inArrAcc.length;
    var contentItem = '';
    var inAccObj = inArrAcc;

    var i = (gTrans.curPage - 1) * gTrans.rowsPerPage;
    var j = i + gTrans.rowsPerPage;
    for (i; i < j; i++) {
        var inAccObj = inArrAcc[i];
        // title
        if (typeof inAccObj !== "undefined") {  
          var contentHTML = '';
          contentHTML += "<table width='100%' align='center' class='recycler-table-ebank desktopview'>";
          contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
          contentHTML += "<td width='7%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_NO') + "</span></td>";
          contentHTML += "<td width='13%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_CREATED_DATE') + "</span></</td>";
          contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_AMOUNT') + "</span></td>";
          contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_BEN_NAME') + "</span></td>";
          contentHTML += "<td width='12%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_STATUS') + "</span></td>";
          contentHTML += "<td width='14%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_CHEKER') + "</span></td>";
          contentHTML += "<td width='13%' class='recycler-row-align-midle'><span>" + CONST_STR.get('TRANS_PERIODIC_ENDING_DATE') + "</span></td>";
          contentHTML += "<td width='11%' class='recycler-row-align-midle'><span>" + CONST_STR.get('COM_TRANS_CODE') + "</span></td>";
          contentHTML += "</tr>";

          contentItem += '<tr class="recycler-row-title recycler-list">';
          contentItem += '<td class="recycler-row-align-midle"><span>' + (i + 1) + '</span</td>';
          contentItem += '<td class="recycler-row-align-midle"><span>' + inAccObj.DATMAKE + '</span></td>';
          contentItem += '<td class="recycler-row-align-midle"><span>' + formatNumberToCurrency(inAccObj.NUMAMOUNT) + ' VND ' + '</span></td>';
          contentItem += '<td class="recycler-row-align-midle"><span>' +  inAccObj.CUSTOMER_NAME1 + '</span></td>';
          contentItem += '<td class="recycler-row-align-midle"><span>' + CONST_STR.get("TRANS_STATUS_" + inAccObj.CODSTATUS) + '</span></td>';
          contentItem += '<td class="recycler-row-align-midle"><span>' + (inAccObj.SIGNEDBY ? inAccObj.SIGNEDBY : "") + '</span></td>';
          contentItem += '<td class="recycler-row-align-midle"><span>' + inAccObj.DATEND + '</span></td>';
          contentItem += '<td class="recycler-row-align-midle" style="word-break: break-all;"><span><a style="cursor:pointer; white-space:pre-wrap;" onclick="showTransferDetail('+inAccObj.IDFCATREF+')"'
          + 'href="javascript:void(0)">' + inAccObj.IDFCATREF + '</a></span></td></tr>';
        }

    }

    var contentItemmb = '';
    var contentHTMLmb = '';
    contentHTMLmb += "<div align='center' class='recycler-table-ebank  mobileview'>";
    var k = (gTrans.curPage - 1) * gTrans.rowsPerPage;
    for (k; k < j; k++) {
        var inAccObj = inArrAcc[k];

        if(inAccObj != undefined){
            contentItemmb += "<table style='margin-bottom:10px;' width='96%'  class='recycler-list'>";
            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_NO') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (k + 1) + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_CREATED_DATE') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.DATMAKE + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_AMOUNT') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  formatNumberToCurrency(inAccObj.NUMAMOUNT) + ' VND ' + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_BEN_NAME') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.CUSTOMER_NAME1 + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_STATUS') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  CONST_STR.get("TRANS_STATUS_" + inAccObj.CODSTATUS) + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_CHEKER') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  (inAccObj.SIGNEDBY ? inAccObj.SIGNEDBY : "") + '</span></td></tr>';

            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('TRANS_PERIODIC_ENDING_DATE') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right"><span>' +  inAccObj.DATEND + '</span></td></tr>';


            contentItemmb += '<tr class="recycler-row-normal">';
            contentItemmb += '<td colspan="1" class="recycler-row-align-midle-left"><span>' +  CONST_STR.get('COM_TRANS_CODE') + '</span></td>';
            contentItemmb += '<td class="recycler-row-align-midle-right" style="word-break: break-all;"><div class="content-detail"><span><a style="cursor:pointer; white-space:pre-wrap;" onclick="showTransferDetail('
                +inAccObj.IDFCATREF+')"'
                + 'href="javascript:void(0)">' + inAccObj.IDFCATREF + '</a></span></div></td></tr></table>';
        }
        }
    contentHTML += contentItem + "</tbody></table>";
    contentHTMLmb += contentItemmb + '</div>';
    return contentHTML += contentHTMLmb + '<table align="right"><tr><td><div class="export-print" style="margin-top: -5px"><a href="javascript:void(0)"'
    + 'id="export-excel" onclick="sendRequestExportExcel()"><img style="margin:6px;" src="css/img/exportfile.png"></a></div>'
    + '</td></tr></table>'
    + '<div align="right" style="float: right; width:100%"><div id="pageIndicatorNums" style="text-align: right; display: inline-block;" /></div></div>';
}