/**
 * Created by HaiDT1 on 1/11/2017.
 */

/**
 * Created by HaiDT1 on 8/26/2016.
 */


var data;
var totalSizeFile = 0;
var urlfile = "";
var fileData;

function viewDidLoadSuccess() {
    if(gUserInfo.userRole.indexOf('CorpInput') == -1 || (CONST_BROWSER_MODE && checkScreenisMobilePX())) {
        navCachedPages['international_payments/request_release_LC/manager_LC/request-release-LC-mng'] = null;
        navController.pushToView('international_payments/request_release_LC/manager_LC/request-release-LC-mng', true, 'html');
    }else{
        init();
    }
}

function viewBackFromOther() {

}

function init() {
    angular.module("EbankApp").controller('request-release-lc', function ($scope, FileUploader, requestMBServiceCorp) {

        var uploader = $scope.uploader = new FileUploader({
            url: CONST_WEB_SERVICE_LINK + '/uploadLC',

        });
        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        uploader.filters.push({ name: 'pdfFilter', fn: function(item) {
            return item.type == 'application/pdf';
        }});




        $scope.removeFile = function (item, index) {
            totalSizeFile = totalSizeFile - item.file.size;
            item.remove();
            document.getElementById('upfileContent').style.display = 'block';
            document.getElementById('textupfile').style.display = 'none';
        }

        function requestData(item) {
            var jsonData = new Object();
            jsonData.sequence_id = '3';
            jsonData.idtxn = 'B16';
            // jsonData.idfcatref = gInternational.info.idfcatref;
            jsonData.preidfcatref = "";
            jsonData.file_size = item.file.size;
            jsonData.file_name = item.file.name;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_PAYMENT_LC'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            data = getDataFromGprsCmd(gprsCmd);
        }

        $scope.changTab = function(){
            navCachedPages['international_payments/request_release_LC/manager_LC/request-release-LC-mng'] = null;
            navController.pushToView('international_payments/request_release_LC/manager_LC/request-release-LC-mng', true, 'html');
        }

        // if(gInternational.isBack){
        //
        // }


// File must not be larger then some size
//         uploader.filters.push({ name: 'sizeFilter', fn: function(item) {
//             for (var i in this.queue){
//                 console.log("file" +this.queue[i]);
//             }
//
//             return item.size < 100000;
//         }});

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            showAlertText(CONST_STR.get('INTERNATIONAL_ERROR_PDF'));
        };
        uploader.onAfterAddingFile = function(fileItem) {
            totalSizeFile = fileItem.file.size;
            if (uploader.queue.length > 1){
                uploader.queue.shift();
            }

            if (totalSizeFile/1024/1024 > 15){
                showAlertText(CONST_STR.get('REQUEST_RELEASE_ERROR_SIZE'));
                return;
            }

            $scope.textprofile = "Tên file: " + fileItem.file.name + ", dung lượng: " + parseFloat(fileItem.file.size/1024/1024).toFixed(2) + " MB";
            document.getElementById('upfileContent').style.display = 'none';
            document.getElementById('textupfile').style.display = 'block';

        };
        // uploader.onAfterAddingAll = function(addedFileItems) {
        //     console.info('onAfterAddingAll', addedFileItems);
        // };
        uploader.onBeforeUploadItem = function(item) {

            // $scope.listSelectedTrans = [];
            requestData(item);
            item.formData.push({transInfo: JSON.stringify(data)});
            showLoadingMask();

            // console.info('onBeforeUploadItem', item);
        };
        // uploader.onProgressItem = function(fileItem, progress) {
        //     console.info('onProgressItem', fileItem, progress);
        // };
        // uploader.onProgressAll = function(progress) {
        //     console.info('onProgressAll', progress);
        // };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {

            if (response.respCode === '0'){
                fileItem.file.authentic = CONST_STR.get('INTERNATIONAL_FILE_VALID_AUTHENTIC');
                fileItem.file.url_key = response.respJsonObj.url;
                fileItem.file.uploadECM = false;
                fileItem.file.url_return = response.respJsonObj.url_return;
                fileData = fileItem.file;
            }else {
                uploader.queue[0].isUploaded = false;
                fileItem.file.authentic = CONST_STR.get('INTERNATIONAL_FILE_INVALID_AUTHENTIC');
                fileItem.file.reson =response.respContent;
                checkUploadFlie = false;
                /*    navCachedPages["corp/international_payments/international_money_trans/international_trans_create_1"] = null;
                 navController.popView(true);
                 showAlertText(response.respContent);*/
            }

        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };

        uploader.onCompleteAll = function() {
            hideLoadingMask();
            // navCachedPages['international_payments/international_money_trans/international_trans_review'] = null;
            // navController.pushToView('international_payments/international_money_trans/international_trans_review', true, 'html');

            var jsonData = new Object();
            jsonData.sequence_id = '2';
            jsonData.idtxn = 'B16';
            // jsonData.idfcatref = gInternational.info.idfcatref;
            jsonData.url = fileData.url_key;
            jsonData.file_name = fileData.name;
            jsonData.file_size = fileData.size;
            jsonData.typelc = gTrans.type_lc;


            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_PAYMENT_LC'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data, true, function (response) {
                if(response.respCode == '0'){
                    try {
                        gTrans.requestlc = {};
                        gTrans.requestlc.respCode = 0;
                        gTrans.requestlc.type_lc = response.respJsonObj.infor_payment[0].TYPE_LC;
                        gTrans.requestlc.transId = response.respJsonObj.infor_payment[0].IDFCATREF;
                        gTrans.requestlc.CCY = response.respJsonObj.infor_payment[0].CCY;
                        gTrans.requestlc.CCY_FEE = response.respJsonObj.infor_payment[0].CCY_FEE;
                        gTrans.requestlc.CCY_MARGIN = response.respJsonObj.infor_payment[0].CCY_MARGIN;
                        gTrans.requestlc.AMOUNT = formatCurrentWithSysbol(response.respJsonObj.infor_payment[0].AMOUNT, gTrans.requestlc.CCY);

                        if (response.respJsonObj.infor_payment[0].VAL_LC_REDUCE == null){
                            gTrans.requestlc.VAL_LC_REDUCE = 0;
                        }else {
                            gTrans.requestlc.VAL_LC_REDUCE = formatCurrentWithSysbol(response.respJsonObj.infor_payment[0].VAL_LC_REDUCE, '') + " " + response.respJsonObj.infor_payment[0].CCY;
                        }

                        if (response.respJsonObj.infor_payment[0].VAL_LC_INCREASE == null){
                            gTrans.requestlc.VAL_LC_INCREASE = 0;
                        }else {
                            gTrans.requestlc.VAL_LC_INCREASE = formatCurrentWithSysbol(response.respJsonObj.infor_payment[0].VAL_LC_INCREASE, '') + " " + response.respJsonObj.infor_payment[0].CCY;
                        }
                        gTrans.requestlc.VAL_LC_MODIFY = formatCurrentWithSysbol(response.respJsonObj.infor_payment[0].VAL_LC_MODIFY, '')+ " " + response.respJsonObj.infor_payment[0].CCY;

                        gTrans.requestlc.NAME_BENE = response.respJsonObj.infor_payment[0].NAME_BENE;
                        gTrans.requestlc.POSITIVE_NEGATIVE = "POSITIVE/NEGATIVE: " + "+" + response.respJsonObj.infor_payment[0].POSITIVE + "%" + "/-" + response.respJsonObj.infor_payment[0].NEGATIVE + "%"
                        gTrans.requestlc.POSITIVE_NEGATIVE_OLD = "POSITIVE/NEGATIVE: " + "+" + response.respJsonObj.infor_payment[0].POSITIVE_OLD + "%" + "/-" + response.respJsonObj.infor_payment[0].NEGATIVE_OLD + "%";
                        gTrans.requestlc.RATE = formatNumberToCurrency(response.respJsonObj.infor_payment[0].RATE) + " VND";
                        gTrans.requestlc.ELECTRIC_FEE = (response.respJsonObj.infor_payment[0].CCY_FEE == 'VND' || response.respJsonObj.infor_payment[0].CCY_FEE == 'JPY') ?  formatNumberToCurrency(response.respJsonObj.infor_payment[0].ELECTRIC_FEE) + " " + response.respJsonObj.infor_payment[0].CCY_FEE : formatCurrentWithSysbol(response.respJsonObj.infor_payment[0].ELECTRIC_FEE,response.respJsonObj.infor_payment[0].CCY_FEE);
                        gTrans.requestlc.ISSUANCE_FEE = (response.respJsonObj.infor_payment[0].CCY_FEE == 'VND' || response.respJsonObj.infor_payment[0].CCY_FEE == 'JPY') ? formatNumberToCurrency(response.respJsonObj.infor_payment[0].ISSUANCE_FEE) + " " + response.respJsonObj.infor_payment[0].CCY_FEE : formatCurrentWithSysbol(response.respJsonObj.infor_payment[0].ISSUANCE_FEE,response.respJsonObj.infor_payment[0].CCY_FEE);
                        gTrans.requestlc.METHOD_FEE = "Chúng tôi chịu";
                        gTrans.requestlc.MARGIN_ACCOUNT = response.respJsonObj.infor_payment[0].MARGIN_ACCOUNT;
                        gTrans.requestlc.FREE_ACCOUNT = response.respJsonObj.infor_payment[0].FREE_ACCOUNT;
                        gTrans.requestlc.AVAIL_FREE_ACCOUNT = response.respJsonObj.infor_payment[0].AVAIL_FEE_ACCOUNT;
                        gTrans.requestlc.AVAIL_MARGIN_ACCOUNT = response.respJsonObj.infor_payment[0].AVAIL_MARGIN_ACCOUNT;
                        gTrans.requestlc.ESCROW = formatNumberToCurrency(response.respJsonObj.infor_payment[0].AMOUNT_VND) + " " + response.respJsonObj.infor_payment[0].CCY_FEE;
                        gTrans.requestlc.TOTAL_FREE = (response.respJsonObj.infor_payment[0].CCY_FEE == 'VND' || response.respJsonObj.infor_payment[0].CCY_FEE == 'JPY') ? formatNumberToCurrency(response.respJsonObj.infor_payment[0].TOTAL_FEE) + " " + response.respJsonObj.infor_payment[0].CCY_FEE : formatCurrentWithSysbol(response.respJsonObj.infor_payment[0].TOTAL_FEE,response.respJsonObj.infor_payment[0].CCY_FEE);;

                        gTrans.requestlc.expiry_date = response.respJsonObj.infor_payment[0].DAT_EXTEND;
                        gTrans.requestlc.shipment_date = response.respJsonObj.infor_payment[0].DAT_DELIVERY;
                        gTrans.requestlc.EXTEND_FEE = (response.respJsonObj.infor_payment[0].CCY_FEE == 'VND' || response.respJsonObj.infor_payment[0].CCY_FEE == 'JPY') ? formatNumberToCurrency(response.respJsonObj.infor_payment[0].EXTEND_FEE) + " " + response.respJsonObj.infor_payment[0].CCY_FEE : formatCurrentWithSysbol(response.respJsonObj.infor_payment[0].EXTEND_FEE,response.respJsonObj.infor_payment[0].CCY_FEE);
                        gTrans.requestlc.MODIFY_FEE = (response.respJsonObj.infor_payment[0].CCY_FEE == 'VND' || response.respJsonObj.infor_payment[0].CCY_FEE == 'JPY') ? formatNumberToCurrency(response.respJsonObj.infor_payment[0].MODIFY_FEE) + " " + response.respJsonObj.infor_payment[0].CCY_FEE : formatCurrentWithSysbol(response.respJsonObj.infor_payment[0].MODIFY_FEE,response.respJsonObj.infor_payment[0].CCY_FEE);
                        gTrans.requestlc.MARGIN_LC_AMOUNT = formatCurrentWithSysbol(response.respJsonObj.infor_payment[0].MARGIN_LC_AMOUNT, response.respJsonObj.infor_payment[0].CCY);// formatNumberToCurrency(response.respJsonObj.infor_payment[0].MARGIN_AMOUNT);
                        gTrans.requestlc.AMOUNT_OLD = formatCurrentWithSysbol(response.respJsonObj.infor_payment[0].AMOUNT_OLD, response.respJsonObj.infor_payment[0].CCY);
                        gTrans.requestlc.MARGIN_LC_INCREASE = (response.respJsonObj.infor_payment[0].CCY == 'VND' || response.respJsonObj.infor_payment[0].CCY == 'JPY') ? formatNumberToCurrency(response.respJsonObj.infor_payment[0].MARGIN_LC_INCREASE) + " " + response.respJsonObj.infor_payment[0].CCY : formatCurrentWithSysbol(response.respJsonObj.infor_payment[0].MARGIN_LC_INCREASE, response.respJsonObj.infor_payment[0].CCY);;
                        gTrans.requestlc.methodFee = (response.respJsonObj.infor_payment[0].CHARGEINCL == 'N') ? CONST_STR.get('REQUEST_RELEASE_LC_METHOD_FEE_N') : CONST_STR.get('REQUEST_RELEASE_LC_METHOD_FEE_Y');



                        if (gTrans.requestlc.type_lc == 'P'){
                            navCachedPages['international_payments/request_release_LC/request-release-LC-view'] = null;
                            navController.pushToView('international_payments/request_release_LC/request-release-LC-view', true, 'html');
                        }else{
                            navCachedPages['international_payments/request_release_LC/request-edit-LC-view'] = null;
                            navController.pushToView('international_payments/request_release_LC/request-edit-LC-view', true, 'html');
                        }
                    }catch (error){
                        showAlertText(error);
                    }
                }else if (response.respCode == '55'){
                    try {
                        gTrans.requestlc = {};
                        var errorContent = response.respContent;
                        gTrans.requestlc.errorFileUpload = errorContent.split(".");
                        gTrans.requestlc.respCode = 55;

                        gTrans.requestlc.type_lc = response.respJsonObj.infor_payment[0].TYPE_LC;
                        gTrans.requestlc.CCY = "";
                        gTrans.requestlc.CCY_FEE = "";
                        if (gTrans.requestlc.type_lc == 'P'){
                            navCachedPages['international_payments/request_release_LC/request-release-LC-view'] = null;
                            navController.pushToView('international_payments/request_release_LC/request-release-LC-view', true, 'html');
                        }else{
                            navCachedPages['international_payments/request_release_LC/request-edit-LC-view'] = null;
                            navController.pushToView('international_payments/request_release_LC/request-edit-LC-view', true, 'html');
                        }
                    }catch (error){
                        showAlertText(error);
                    }
                }else {
                    showAlertText(response.respContent);
                }
            });

        };

        function formatCurrentWithSysbol(n, currency) {

            var k;
            k = Math.abs(n).toFixed(2).replace(/./g, function(c, i, a) {
                    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                });
            if(k.substr(k.length - 2, k.length)==='00')
            {
                k = k.substr(0,k.length - 3);
            }
            return k + " " + currency ;
        }


        // function resetQueue () {
        //   for(var i =0;i<uploader.queue.length;i++)
        //   {
        //       delete uploader.queue[i]._xhr;
        //       uploader.queue[i].isCancel = false;
        //       uploader.queue[i].isError = false;
        //       uploader.queue[i].isReady = false;
        //       uploader.queue[i].isSuccess = false;
        //       uploader.queue[i].isUploaded = false;
        //       uploader.queue[i].isUploading = false;
        //       uploader.queue[i].progress = 0;
        //   }
        // }



        $scope.uploadFile = function () {
            // navCachedPages['international_payments/request_release_LC/request-edit-LC-view'] = null;
            // navController.pushToView('international_payments/request_release_LC/request-edit-LC-view', true, 'html');
            if(uploader.queue.length == 0 )
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("GUA_SEND_TRANSFER_FILE")]));
                return;
            }else if(uploader.queue.length > 1){
                showAlertText(CONST_STR.get("REQUEST_RELEASE_SELECT_ONE_FILE_UPLOAD"));
                return;
            }
            // else {
            //     for (var i in uploader.queue){
            //         if(!uploader.queue[i].isUploaded){
            //             break;
            //         }else  if (uploader.queue[i].isUploaded  && i == uploader.queue.length - 1){
            //             navCachedPages['international_payments/international_money_trans/international_trans_review'] = null;
            //             navController.pushToView('international_payments/international_money_trans/international_trans_review', true, 'html');
            //         }
            //     }
            // }

            if (totalSizeFile/1024/1024 > 15){
                showAlertText(CONST_STR.get('REQUEST_RELEASE_ERROR_SIZE_LC'));
                return;
            }
            else
            {
                // gInternational.info.listFile = [];
                uploader.uploadAll();
            }

        }

        $scope.downloadPDFTemplate = function () {
            gTrans.type_lc = 1;
            var data = {};
            var objectValueClient = new Object();
            var idtxn = "B16";
            objectValueClient.idtxn = idtxn;
            objectValueClient.sequenceId = 1;
            objectValueClient.type_lc = 1;
            var args = ["", objectValueClient];

            //1305
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_EXPORT_PDF_REPORT"), "", "", gUserInfo.lang, gUserInfo.sessionID,
                args);

            data = getDataFromGprsCmd(gprsCmd);
            corpExportPDF(data, "report");
        }

        $scope.downloadPDFTemplateEdit = function () {
            gTrans.type_lc = 2;
            var data = {};
            var objectValueClient = new Object();
            var idtxn = "B16";
            objectValueClient.idtxn = idtxn;
            objectValueClient.sequenceId = 1;
            objectValueClient.type_lc = 2;
            var args = ["", objectValueClient];

            //1305
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("COM_EXPORT_PDF_REPORT"), "", "", gUserInfo.lang, gUserInfo.sessionID,
                args);

            data = getDataFromGprsCmd(gprsCmd);
            corpExportPDF(data, "report");
        }

    });


    angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);
}


function controlInputText(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccent(field.value);
        field.value = field.value.replace(/[!"#$%&*'\+:;<=>?\\`^~{|}]/g, '');
    }
}