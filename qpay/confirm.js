document.addEventListener('DOMContentLoaded', function () {setTimeout(initStart, 100);}, false);
function initStart(){
	factoryRequestFCC();
}


function factoryRequestFCC()
{

  var messageRequest= {};

     messageRequest["ccy"]=urlParam("vpc_CurrencyCode");
     messageRequest["amount"]=urlParam("vpc_Amount");
     messageRequest["ecode"]=urlParam("vpc_ResponseCode");
     messageRequest["edesc"]=getResponseDescription(urlParam("vpc_ResponseCode"));
     messageRequest["transId"]=urlParam("vpc_MerchTxnRef");
     
     try {
        messageRequest["xref"]=urlParam("vpc_TransactionNo");
     } catch (error){
        messageRequest["xref"]="";
     }

     messageRequest["additionalData"]=urlParam("vpc_AdditionalData");  
        
     try {
        messageRequest["transDate"]=urlParam("vpc_BatchNo");
     } catch (error){
        messageRequest["transDate"]="";
     }

     messageRequest["command"]=urlParam("vpc_Command");
     messageRequest["locale"]=urlParam("vpc_Locale");
     messageRequest["merchant"]=urlParam("vpc_Merchant");
     messageRequest["orderInfo"]=urlParam("vpc_OrderInfo");
     messageRequest["merchant"]=urlParam("vpc_Merchant");
     messageRequest["version"]=urlParam("vpc_Version");

     try {
        messageRequest["cardType"]=urlParam("vpc_CardType");
     } catch (error){
        messageRequest["cardType"]="";
     }



     // messageRequest["transDate"]=urlParam("vpc_BatchNo");

     // messageRequest["cusCode"]="00290092001";
     // messageRequest["initiator"]="00423505001";

     messageRequest["secureHash"]=urlParam("vpc_SecureHash");
     
     
  var args= {};
    args["serviceCode"]=810;
    args["messageRequest"]=messageRequest;

    var url= CONST_WEB_SERVICE_LINK+ "/qpay";

  requestServicesJson(url, 'POST', args, onCallbackJSONRequestFCC, false); 
}

function requestServicesJson(url, method, args, onCallbackRequest, status){  
    $.ajax({
        url : url,
        type : method,
        data: JSON.stringify(args),
        dataType: "json",
        contentType: "application/json",
      // contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    xhrFields:{
           withCredentials:false
    },
    crossdomain:true,
        timeout : 100000000,
        beforeSend: function() {
        },
        uploadProgress : function(){
        },
        success : function(response) {
            onCallbackRequest(response);       
        },     
        complete: function(){

        },  
        error : function(jqXhr, textStatus, errorThrown) { 
        }
    });
}

function onCallbackJSONRequestFCC(response){  
    // var res=JSON.parse(response);
   var res=  JSON.parse(JSON.stringify(response));
    // if(res.eCode=='00') 
   //  {
        window.location=res.urlResp;
   //   }
 }

 /  GET PARAM IN URL /
function urlParam(name){
 	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
return results[1] || 0;
}

function getResponseDescription(vResponseCode){
    var result = "Giao dich không xác định";
    switch (vResponseCode){
                case '0' : result = "Giao dịch thành công"; break;
                case '1' : result = "Ngân hàng từ chối thanh toán: thẻ/tài khoản bị khóa"; break;
                case '3' : result = "Thẻ hết hạn"; break;
                case '4' : result = "Lỗi người mua hàng: Quá số lần cho phép. (Sai OTP, quá hạn mức trong ngày)"; break;
                case '5' : result = "Không có trả lời của Ngân hàng"; break;
                case '6' : result = "Lỗi giao tiếp với Ngân hàng"; break;
                case '7' : result = "Tài khoản không đủ tiền"; break;
                case '8' : result = "Lỗi checksum dữ liệu"; break;
                case '9' : result = "Kiểu giao dịch không được hỗ trợ"; break;
                default  : result = "Không xác định";
            }
    return result;      
}
