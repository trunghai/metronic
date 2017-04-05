var strXml = "";
/*** HEADER ***/
var gprsResp = new GprsRespObj("", "", "", "");
var XmlLocal;
var storedObj;
var data;
var storeXML;
gTrans.transInfo = {};
/*** INIT VIEW ***/
function loadInitXML() {
  var tmpXml = getReviewXmlStore();
  XmlLocal = tmpXml;
  if (strXml == '' || strXml == undefined) {
    strXml = XMLToString(tmpXml);
  }

  logInfo(docXml);

  return tmpXml;
}

function viewDidLoadSuccess() {
  resizeMainViewContent();
  init();
  logInfo('review load success');

  // storedObj = getRespObjStore();
  // data = storedObj[0];
  // storeXML = getReviewXmlStore();
  // var btnCancel = document.getElementById("btnCancel");

  // // console.log("data.IDROLE", data.IDROLE);
  // // console.log("data.IDROLE", data.CODSTATUS);
  
  // if (gUserInfo.userRole.indexOf('CorpInput') != -1) {
  //   if (data.CODSTATUS == "INT" || data.CODSTATUS == "ABH" || data.CODSTATUS == "PFC") {
  //     btnCancel.style.display = "inline";
  //   }
  // }

  // // set data to screen
    document.getElementById("trans_code").innerHTML = id_FCATREF;
    document.getElementById("batch_salary").innerHTML = date_make;
    document.getElementById("check_date").innerHTML = date_check;
    document.getElementById("status").innerHTML = status;

    document.getElementById("trans_type").innerHTML = trans_type;
    document.getElementById("com_tax_pay").innerHTML = id_srcacct;
    document.getElementById("acc_avail_balance").innerHTML = balance_befor;

    document.getElementById("com_amount").innerHTML = num_amount;
    document.getElementById("trans_per_acc_no").innerHTML = txt_dest;
    document.getElementById("trans_dest").innerHTML = cus_name;
    document.getElementById("trans_bank_title").innerHTML = bank;
    document.getElementById("trans_fee_title").innerHTML = service_charge;
    document.getElementById("trans_per_content").innerHTML = txt_pay;
    document.getElementById("trans_per_bgin_date").innerHTML = date_start;
    document.getElementById("trans_per_end_date").innerHTML = date_end;
    document.getElementById("trans_per_frequency").innerHTML = type_fre;
    document.getElementById("trans_per_mgn_pay").innerHTML = type_temp;
    document.getElementById("com_send_msg").innerHTML = send_method;
    if (gTrans.currentSTT != 'PFC') {
      document.getElementById('INT_CANCE').style.display = 'none';
    }else{
      document.getElementById('INT_CANCE').style.display = '';
    }
}

function init(){
  angular.module('EbankApp').controller('transfer_periodic_detail_scr', function ($scope, requestMBServiceCorp) {
    // quay lại màn hình trước
    $scope.goBack = function() {
      navController.popView(true);
    }
    // hủy
    $scope.btnCancelClick = function() {
       var obj = gAccount.objTransaction;
      for(var i = 0; i< obj.length; i++){
        var req = { 
          sequence_id: "4",
          idtxn: "T00",
          currentSTT: obj[i].CODSTATUS,
          idUserReference: gTrans.idUserReference,
          idFcatref: obj[i].IDFCATREF
        }
        gTrans.cmdType = CONSTANTS.get('CMD_CO_USER_CREATED_TRANSACTION'); //su lai
        gTrans.requestData = req;
        gTrans.src = "pages/transfer/periodic/transfer-periodic-detail-view-scr.html";
        gTrans.ortherSrc = "transfer/periodic/transfer-periodic-mng-scr";

        // setReviewXmlStore(xmlDoc);
        // navCachedPages["common/common-review/transfer-review-scr"] = null;
        // navController.pushToView("common/common-review/transfer-review-scr", true, 'html');
        // console.log("req ", req);
        gTrans.transInfo.transId  = obj[i].IDFCATREF;// ma giao dich
        gTrans.transInfo.date_make   = obj[i].DATMAKE;// ngay thuc hien

        gTrans.transInfo.trans_type  = CONST_STR.get('TRANS_TRANSFER_PERIODIC_TITLE');// loai giao dich
        gTrans.transInfo.id_srcacct  = obj[i].IDSRCACCT;// tai khoan chuyen
        gTrans.transInfo.balance_befor  = formatNumberToCurrency(obj[i].BALANCE_BEFOR) + ' VND';// so du kha dung

        gTrans.transInfo.num_amount  = formatNumberToCurrency(obj[i].NUMAMOUNT) + ' VND';// so tien
        gTrans.transInfo.txt_dest  = obj[i].TXTDESTACCT;// so tai khoan nhan tien
        gTrans.transInfo.cus_name  = obj[i].CUSTOMER_NAME1;// chu tai khoan nhan
        gTrans.transInfo.bank  = 'TPBank';// ngan hang
        gTrans.transInfo.service_charge  = '0 VND';// phi dich vu
        gTrans.transInfo.txt_pay  = obj[i].TXTPAYMTDETAILS1;// noi dung chuyen tien
        gTrans.transInfo.date_start  = obj[i].DATSTART;// ngay bat dau
        gTrans.transInfo.date_end  = obj[i].DATEND;// ngay ket thuc
        gTrans.transInfo.type_fre  = CONST_STR.get('CONST_TRANS_FREQUENCY_' + obj[i].TYPEFREQUENCY);// tan suat
        gTrans.transInfo.type_temp  = getTransTempInfo(obj[i].TYPE_TEMPLATE);// quan ly nguoi thu huong
        gTrans.transInfo.send_method  = CONST_STR.get("COM_NOTIFY_" + obj[i].SEND_METHOD);// gui thong bao cho nguoi duyet
        gTrans.transInfo.idtxn  = obj[i].IDTXN;// idtxn
        updateAccountListInfo();
        navController.pushToView("common/common-review/transfer-review-scr", true, "html");
      }
    }
  });
  angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])
}
