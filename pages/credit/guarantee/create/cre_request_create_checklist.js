/**
 * Created by HaiNM on 1/20/2017
 **/
gTrans.isBack = false;
gTrans.idtxn = 'C11';
var data;
var totalSizeFile = 0;
var fileInfo=[];
function viewDidLoadSuccess() {
    init();
}

function viewBackFromOther() {
    gTrans.isBack = true;
}

function init() {
    angular.module("EbankApp").controller('cre-request-create-checklist', function ($scope, FileUploader, requestMBServiceCorp) {
		$scope.infoTrans = gTrans.transInfo;
		
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

        function iniData(item, note) {
            var jsonData = new Object();
            jsonData.sequence_id = "3";
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
            var gprsCmd = new GprsCmdObj(CONSTANTS.get('CMD_CRE_REQUEST'), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            data = getDataFromGprsCmd(gprsCmd);
        }

        // CALLBACKS

        var tmpFile;
        $scope.removeFile = function (item) {
            tmpFile = item;
            showAlertConfirmText(CONST_STR.get('ARLERT_REMOVE_FILE'))  ;
            document.addEventListener('alertConfirmOK',removeSuccess,false);
            document.addEventListener('alertConfirmCancel',removeFail,false);
        }

        function removeSuccess(){
            totalSizeFile = totalSizeFile - tmpFile.file.size;
            var index = uploader.getIndexOfItem(tmpFile);
            gTrans.transInfo.listFile.splice(index,1);
            tmpFile.remove();
            $scope.$apply();
            if (uploader.queue.length == 0){
                document.getElementById("titleUploadFile").innerHTML = CONST_STR.get('UPLOAD_FILE_BUTTON');
                document.getElementById("note").style.display = "none";
            }
            document.removeEventListener('alertConfirmOK',removeSuccess,false);
            document.removeEventListener('alertConfirmCancel',removeFail,false);
        }
        function removeFail(){
            document.removeEventListener('alertConfirmOK',removeSuccess,false);
            document.removeEventListener('alertConfirmCancel',removeFail,false);
        }

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            // console.info('onWhenAddingFileFailed', item, filter, options);
            showAlertText(CONST_STR.get('INTERNATIONAL_ERROR_PDF'));
        };
        uploader.onAfterAddingFile = function(fileItem) {	
            totalSizeFile = totalSizeFile + fileItem.file.size;
            if (totalSizeFile/1024/1024 > 15){
                showAlertText(CONST_STR.get('INTERNATIONAL_ERROR_SIZE'));
                $scope.removeNow(fileItem);

                // document.getElementById('sendData').disabled = true;
            }

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
            iniData(item, note);
            item.formData.push({transInfo: JSON.stringify(data)});
            showLoadingMask();

            console.info('onBeforeUploadItem', item);
        };
        // uploader.onProgressItem = function(fileItem, progress) {
            // console.info('onProgressItem', fileItem, progress);
        // };
        // uploader.onProgressAll = function(progress) {
            // console.info('onProgressAll', progress);
        // };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            if (response.respCode === '0'){
                fileItem.file.url_key = response.respJsonObj.url;
				gTrans.transInfo.url = response.respJsonObj.url;
                gTrans.transInfo.listFile.push(fileItem);
				fileInfo.push(fileItem.file);

            }else {
            //    navCachedPages["corp/credit/guarantee/create/cre_guarantee_create"] = null;
                navController.popView(true);
                showAlertText(response.respContent);
            }

        };

        Number.prototype.padLeft = function(base,chr){
            var  len = (String(base || 10).length - String(this).length)+1;
            return len > 0? new Array(len).join(chr || '0')+this : this;
        }
        // uploader.onErrorItem = function(fileItem, response, status, headers) {
            // console.info('onErrorItem', fileItem, response, status, headers);
        // };
        // uploader.onCancelItem = function(fileItem, response, status, headers) {
            // console.info('onCancelItem', fileItem, response, status, headers);
        // };
        // uploader.onCompleteItem = function(fileItem, response, status, headers) {
            // console.info('onCompleteItem', fileItem, response, status, headers);
        // };
        uploader.onCompleteAll = function() {

            hideLoadingMask();
			
            gTrans.transInfo.instructionFile =  document.getElementById('id.instruction.file').value;
            navCachedPages['credit/guarantee/create/cre_request_create_auth'] = null;
            navController.pushToView('credit/guarantee/create/cre_request_create_auth', true, 'html');
        };

        $scope.onBackClick = function () {
            navController.popView(true);
        }

        $scope.onCancelClick = function(){
            for(var i=0; i<navArrayScr.length;i++){
                if(navArrayScr[i] == 'credit/guarantee/create/cre_request_create'){
                    clearCachedPageToView(navArrayScr[i], true,'html');
                    navArrayScr = navArrayScr.slice(0,i+1);
                    return;
                }
            }
        }
        $scope.uploadFile = function () {
            if(uploader.queue.length ==0 )
            {
                showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), [CONST_STR.get("GUA_SEND_TRANSFER_FILE")]));
				return;
            }else {
                for (var i in uploader.queue){
                    if(!uploader.queue[i].isUploaded){
                        break;
                    }else  if (uploader.queue[i].isUploaded  && i == uploader.queue.length - 1){
                        for (var i in gTrans.transInfo.listFile){
                            fileInfo.push(gTrans.transInfo.listFile[i].file);
                        }
                        checkUploadFlie = true;
                        navCachedPages['credit/guarantee/create/cre_request_create_auth'] = null;
                        navController.pushToView('credit/guarantee/create/cre_request_create_auth', true, 'html');
                        return;
                    }
                }
                if (totalSizeFile/1024/1024 > 15){
                    showAlertText(CONST_STR.get('INTERNATIONAL_ERROR_SIZE'));
                    return;
                }
                else
                {
                    // gInternational.info.listFile = [];
                    uploader.uploadAll();
                }
            }
        }

        function deleteFileTrans() {
            var jsonData = new Object();
            jsonData.sequence_id = "5";
            jsonData.idtxn = gTrans.idtxn;
            jsonData.transId = gTrans.transInfo.transId;
            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CRE_REQUEST"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);
            requestMBServiceCorp.post(data, true, function (response) {
                if (response.respCode === '0'){

                }else {
                    showAlertText(response.respContent);
                    navController.popView(true);
                }
            });
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