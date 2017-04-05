/**
 * Created by JetBrains WebStorm.
 * User: LanTB.FSOFT
 * Date: 7/28/16
 * Time: 9:33 AM
 * To change this template use File | Settings | File Templates.
 */



function initDialog(title,contentMessage,urlSource,callbackClose,callbackLoadSuccess,loadjs,firecallback){
    //modalDialog = null;
    modalDialog = new ModalDialog({
        type:1,
        title: title || "",
        contentMessage: contentMessage || "",
        isCloseShow: true,
        cancel: "Hủy",
        agree: "Đồng ý",
        parentNote:""
    });
    if(CONST_DESKTOP_MODE && !checkScreenisMobilePX()){
        modalDialog.setParentShow("mainview");
    }else{
        modalDialog.setParentShow("mainview");
    }
    modalDialog.setUrlSourceHTML(urlSource,loadjs);
    if(typeof callbackClose == "function") {
        modalDialog.setCallback(callbackClose);
    }
    if(typeof firecallback == "function"){
        modalDialog.setFireCallback(firecallback);
    }
    if(typeof callbackLoadSuccess == "function"){
        modalDialog.onloadPageXslSuccess(callbackLoadSuccess);
    }
    modalDialog.onCreateDialog();

}

