/**
 * Created by HaiDT1 on 1/11/2017.
 */

/**
 * Created by HaiDT1 on 8/26/2016.
 */


var data;
var totalSizeFile = 0;
gTrans.isBack = false;

function viewDidLoadSuccess() {
    init();
}

function viewBackFromOther() {
    gTrans.isBack = true;
}

function init() {
    angular.module("EbankApp").controller('request-release-lc-profile', function ($scope, FileUploader, requestMBServiceCorp) {

        initTextAreaMessage();
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

        if (!gTrans.isBack){
            gTrans.listProfile = [];
            gTrans.listProfile.push(fileData);
        }else {
            document.getElementById("note").style.display = "block";
            document.getElementById('trans.content').value = gTrans.requestlc.noteProfile;

            for (var i = 1; i < gTrans.listProfile.length; i++){
                uploader.addToQueue(gTrans.listProfile[i]);
                uploader.queue[i-1].isUploaded = true;
                uploader.queue[i-1].progress = 100;
            }

            for (var i in uploader.queue){
                totalSizeFile = totalSizeFile + uploader.queue[i].file.size;
            }
        }


        initData();
        function initData() {
            var jsonData = new Object();
            jsonData.sequence_id = "4";
            jsonData.idtxn = "B16";
            jsonData.typelc = gTrans.requestlc.type_lc;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_PAYMENT_LC"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true,function (response) {
                if (response.respCode === '0'){
                    $scope.docReq = response.respJsonObj;
                }else {
                    showAlertText(response.respContent);
                    navController.popView(true);
                }
            });
        }


        function deleteFileTrans() {
            var jsonData = new Object();
            jsonData.sequence_id = "5";
            jsonData.idtxn = gInternational.idtxn;
            jsonData.transId = gInternational.info.idfcatref;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_PAYMENT_LC"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, function (response) {
                if (response.respCode === '0'){

                }else {
                    showAlertText(response.respContent);
                    navController.popView(true);
                }
            });
        }

        function initTextAreaMessage (){
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
                placeholder : CONST_STR.get("PLACEHOLDER_TRANSFER_CONTENT_LC"),
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



        $scope.removeFile = function (item, index) {
            totalSizeFile = totalSizeFile - item.file.size;
            item.remove();

            if(item.isUploaded){
                for (var i in gTrans.listProfile){
                    if (item.file.name == gTrans.listProfile[i].name){
                        gTrans.listProfile.splice(i,1);
                    }
                }
            }

            if (uploader.queue.length == 0){
                document.getElementById("titleUploadFile").innerHTML = CONST_STR.get('UPLOAD_FILE_BUTTON');
                document.getElementById("note").style.display = "none";
            }
        }

        function requestData(item) {
            var jsonData = new Object();
            jsonData.sequence_id = '3';
            jsonData.idtxn = 'B16';
            // jsonData.idfcatref = gInternational.info.idfcatref;
            jsonData.preidfcatref = "";
            jsonData.file_size = item.file.size;
            jsonData.file_name = item.file.name;
            jsonData.note = document.getElementById('trans.content').value;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_PAYMENT_LC'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            data = getDataFromGprsCmd(gprsCmd);
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
            if (uploader.queue.length > 0){
                document.getElementById("titleUploadFile").innerHTML = CONST_STR.get('UPLOAD_FILE_BUTTON_PLUS');
                document.getElementById("note").style.display = "block";
            }

            totalSizeFile = totalSizeFile + fileItem.file.size;
            if (totalSizeFile/1024/1024 > 15){
                showAlertText(CONST_STR.get('REQUEST_RELEASE_ERROR_SIZE_LC'));
                $scope.removeFile(fileItem);
            }

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
                fileItem.file.uploadECM = true;
                fileItem.file.url_return = response.respJsonObj.url_return;
                gTrans.listProfile.push(fileItem.file);
            }else {
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
            gTrans.requestlc.noteProfile = document.getElementById('trans.content').value;
            navCachedPages['international_payments/request_release_LC/request-release-LC-review'] = null;
            navController.pushToView('international_payments/request_release_LC/request-release-LC-review', true, 'html');

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
            // navCachedPages['international_payments/request_release_LC/request-release-LC-view'] = null;
            // navController.pushToView('international_payments/request_release_LC/request-release-LC-view', true, 'html');
            if(uploader.queue.length == 0 )
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("GUA_SEND_TRANSFER_FILE")]));
                return;
            } else {
                for (var i in uploader.queue){
                    if(!uploader.queue[i].isUploaded){
                        break;
                    }else  if (uploader.queue[i].isUploaded  && i == uploader.queue.length - 1){
                        navCachedPages['international_payments/request_release_LC/request-release-LC-review'] = null;
                        navController.pushToView('international_payments/request_release_LC/request-release-LC-review', true, 'html');
                    }
                }
            }

            if (totalSizeFile/1024/1024 > 10){
                showAlertText(CONST_STR.get('REQUEST_RELEASE_ERROR_SIZE'));
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

        $scope.onCancelClick = function () {
            navCachedPages['international_payments/request_release_LC/request-release-LC'] = null;
            navController.popToViewInit('international_payments/request_release_LC/request-release-LC', true, 'html');
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