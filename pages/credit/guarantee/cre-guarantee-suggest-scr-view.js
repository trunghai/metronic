/**
 * Created by GiangBM on 1/19/2017.
 */

gTrans.isBack = false;
var data;
var urlfile = "";
var totalSizeFile = 0;
var fileInfo=[];
function viewDidLoadSuccess() {
    init();
}
function viewBackFromOther() {
    gTrans.isBack = true;
}

function init() {
    angular.module('EbankApp').controller('cre-guarantee-suggest-scr-view', function ($scope,FileUploader, requestMBServiceCorp) {
        $scope.infoSuggest = gTrans.document;
        $scope.infoTrans = gTrans.transInfo;
        $scope.onCancelClick = function(){
            for(var i=0; i<navArrayScr.length;i++){
                if(navArrayScr[i] == 'credit/guarantee/cre-guarantee-suggest-scr'){
                    clearCachedPageToView(navArrayScr[i], true,'html');
                    navArrayScr = navArrayScr.slice(0,i+1);
                    return;
                }
            }
        }
		
		/*HaiNM*/
        $scope.initTextAreaMessage = function (){
            try{
                var txtArea = document.getElementById('id.instruction.file');
                if(txtArea!==null){
                    return false;
                }
                document.getElementById("holder-transfer-message").innerHTML = "";
            }catch(e){}


            var textAreaEl = new TextArea({
                containerMargin : "0px",
                idTextArea : "id.instruction.file",
                placeholder : CONST_STR.get("PLACEHOLDER_TRANSFER_CONTENT_LC"),
                iconClass : "icon-content-note",
                lengthmax : "250",
                fontSizeIcon : "24px!important",
                validateInput : function(){
                    console.log("validate function");
                }
            });
            textAreaEl.show("holder-transfer-message");
        }
		
        $scope.initTextAreaMessage();
		/*End*/
		
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
            gTrans.transInfo.listFile = [];
        }else {
            for (var i in gTrans.transInfo.listFile){
                uploader.addToQueue(gTrans.transInfo.listFile[i].file);
                uploader.queue[i].isUploaded = true;
                uploader.queue[i].progress = 100;
            }

            for (var i in uploader.queue){
                totalSizeFile = totalSizeFile + uploader.queue[i].file.size;
            }
            document.getElementById("note").style.display = "block";
            document.getElementById('id.instruction.file').value = gTrans.transInfo.instructionFile;
        }

        function deleteFileTrans() {
            var jsonData = new Object();
            jsonData.sequence_id = "5";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.transId = gTrans.idfcatref;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_GUARANTEE_SUGGEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, function (response) {
                if (response.respCode === '0'){

                }else {
                    showAlertText(response.respContent);
                    navController.popView(true);
                }
            });
        }

        var fileTMP;
        $scope.removeFile = function (item, index) {
            fileTMP = item;
            showAlertConfirmText(CONST_STR.get('ARLERT_REMOVE_FILE'))  ;
            document.addEventListener('alertConfirmOK',XoaFile,false);
            document.addEventListener('alertConfirmCancel',KhongXoa,false);

        }
        function XoaFile(){
            totalSizeFile = totalSizeFile - fileTMP.file.size;
            var index = uploader.getIndexOfItem(fileTMP);
            gTrans.transInfo.listFile.splice(index,1);
            fileTMP.remove();
            $scope.$apply();
            if (uploader.queue.length == 0){
                document.getElementById("titleUploadFile").innerHTML = CONST_STR.get('UPLOAD_FILE_BUTTON');
                document.getElementById("note").style.display = "none";
            }
            document.removeEventListener('alertConfirmOK',XoaFile,false);
            document.removeEventListener('alertConfirmCancel',KhongXoa,false);
        }
        function KhongXoa(){
            document.removeEventListener('alertConfirmOK',XoaFile,false);
            document.removeEventListener('alertConfirmCancel',KhongXoa,false);
        }

        function requestData(item, note) {
            var jsonData = new Object();
            jsonData.sequence_id = '3';
            jsonData.idtxn = gTrans.idtxn;
            jsonData.idfcatref = gTrans.transInfo.transId;
            jsonData.file_size = item.file.size;
            jsonData.file_name = item.file.name;
            jsonData.noteProfile = note;
            gTrans.transInfo.file=new Array();
            gTrans.transInfo.file.push([item.file.size,item.file.name]);
            gTrans.transInfo.item = item;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CO_GUARANTEE_SUGGEST'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            data = getDataFromGprsCmd(gprsCmd);

        }



        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            showAlertText(CONST_STR.get('INTERNATIONAL_ERROR_PDF'));
        };
        uploader.onAfterAddingFile = function(fileItem) {
            totalSizeFile = totalSizeFile + fileItem.file.size;
            if (totalSizeFile/1024/1024 > 15){
                showAlertText(CONST_STR.get('REQUEST_RELEASE_ERROR_SIZE'));
                $scope.removeNow(fileItem);
            }
//            fileInfo.file_name = fileItem.file.name;
//            fileInfo.file_size = fileItem.file.size/1024/1024;
//             fileInfo.push(fileItem.file);
            if (uploader.queue.length > 0){
                document.getElementById("titleUploadFile").innerHTML = CONST_STR.get('UPLOAD_FILE_BUTTON_PLUS');
                document.getElementById("note").style.display = "block";
            }
        };
        $scope.removeNow = function (item) {
            totalSizeFile = totalSizeFile - item.file.size;
            item.remove();
        }
        // uploader.onAfterAddingAll = function(addedFileItems) {
        //     console.info('onAfterAddingAll', addedFileItems);
        // };
        uploader.onBeforeUploadItem = function(item) {
            var note = document.getElementById('id.instruction.file').value;
            // $scope.listSelectedTrans = [];
            requestData(item,note);
            item.formData.push({transInfo: JSON.stringify(data)});
            showLoadingMask();

            // console.info('onBeforeUploadItem', item);
        };



        uploader.onSuccessItem = function(fileItem, response, status, headers) {

            if (response.respCode === '0'){
                fileItem.file.authentic = CONST_STR.get('INTERNATIONAL_FILE_VALID_AUTHENTIC');
                fileItem.file.url_key = response.respJsonObj.url;
                gTrans.transInfo.url = response.respJsonObj.url;
                gTrans.transInfo.listFile.push(fileItem);
                fileInfo.push(fileItem.file);
            }else {
                fileItem.file.authentic = CONST_STR.get('INTERNATIONAL_FILE_INVALID_AUTHENTIC');
                fileItem.file.reson =response.respContent;
                checkUploadFlie = false;
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
            gTrans.transInfo.instructionFile =  document.getElementById('id.instruction.file').value;
            gTrans.cmdType =  CONSTANTS.get("CMD_CO_GUARANTEE_SUGGEST");
            navCachedPages["credit/guarantee/cre-guarantee-suggest-scr-auth"] = null;
            navController.pushToView("credit/guarantee/cre-guarantee-suggest-scr-auth", true, "html");
        };



        $scope.uploadFile = function () {
            if(uploader.queue.length == 0 )
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("GUA_SEND_TRANSFER_FILE")]));
                return;
			}
//            }else if(uploader.queue.length > 1){
//                showAlertText(CONST_STR.get("REQUEST_RELEASE_SELECT_ONE_FILE_UPLOAD"));
//                return;
//            }
            else
            {
                for (var i in uploader.queue){
                    if(!uploader.queue[i].isUploaded){
                        break;
                    }else  if (uploader.queue[i].isUploaded  && i == uploader.queue.length - 1){
                        for (var i in gTrans.transInfo.listFile){
                            fileInfo.push(gTrans.transInfo.listFile[i].file);
                        }
                        checkUploadFlie = true;
						navCachedPages["credit/guarantee/cre-guarantee-suggest-scr-auth"] = null;
						navController.pushToView("credit/guarantee/cre-guarantee-suggest-scr-auth", true, "html");
                        return;
                    }
                }
            }

            if (totalSizeFile/1024/1024 > 15){
                showAlertText(CONST_STR.get('REQUEST_RELEASE_ERROR_SIZE'));
                return;
            }
            else
            {
                // gInternational.info.listFile = [];
                uploader.uploadAll();
            }

        }

        $scope.downloadPDF = function () {
            var data = {};
            var objectValueClient = new Object();
            var idtxn = "C10";
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

        $scope.sendJSONRequest = function (item) {


        }


    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}
function clickHomeOrBack(){
    navController.popView(true);
}
