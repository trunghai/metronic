gTrans.manage = {
    request: {
        idtxn: "M00",
        sequenceId: 1,
        searchInput: "",
        pageId: 1,
        pageSize: 10
    },
    pageId: 1,
    pageSize: 10,
    totalPage: 0
}

function loadInitXML() {
    logInfo('common list user approve init');
}

function viewDidLoadSuccess() {
    getListBenneficiaries(gTrans.manage.request);
}

function getListBenneficiaries(request) {
    var data = {};
    var arrayArgs = new Array();

    gTrans.manage.request.searchInput = request.searchInput;

    var strJSON = JSON.stringify(request);

    arrayArgs.push("1");
    arrayArgs.push(strJSON);

    var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_MANAGE_BENEFIC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
    gprsCmd.raw = '';
    data = getDataFromGprsCmd(gprsCmd);

    requestMBServiceCorp(data, false, 0, requestGetSuccess, requestGetFail);
}

function requestGetSuccess(e) {
    var response = JSON.parse(e);

    if ((response.respCode == RESP.get('COM_SUCCESS')) && (parseInt(response.responseType) == parseInt(CONSTANTS.get('CMD_CO_MANAGE_BENEFIC')))) {
        // mainContentScroll.refresh();
        var jsonObj = response.respJsonObj;
        if (jsonObj.length > 0) {
            //	var xml_doc = genXMLListBenes(jsonObj);
            //	var xsl_doc = getCachePageXsl("corp/transfer/manage_template/table-search-result");

            //genHTMLStringWithXML(xml_doc, xsl_doc, function(oStr) {
            document.getElementById("tblContent").innerHTML = genXMLListBenes(jsonObj);
            // });

            // Tinh so trang
            if (jsonObj.length == 0) {
                gTrans.manage.totalPage = 0;
            } else {
                var totalRow = jsonObj[0].TOTAL;
                gTrans.manage.totalPage = Math.ceil(totalRow / gTrans.manage.pageSize);
            }

            // Gen phan trang
            var pagination = document.getElementById("pagination");
            var paginationHTML = genPageIndicatorHtml(gTrans.manage.totalPage, gTrans.manage.request.pageId);
            paginationHTML = paginationHTML.replace(/selectedPageAtIndex/g, "changePage");
            pagination.innerHTML = paginationHTML;
        } else {
            // 20/11/2015 DuyNH fix bug NO. 174 START
            document.getElementById("pagination").innerHTML = '';
            document.getElementById("tblContent").innerHTML = CONST_STR.get('CORP_MSG_COM_NO_DATA_FOUND');
            // 20/11/2015 DuyNH fix bug NO. 174 END
        }
    } else {
        if (response.respCode == '1019') {
            showAlertText(response.respContent);
        } else {
            showAlertText(CONST_STR.get('ERR_COM_TRANS_FAILED'));
        }
    }
}

function requestGetFail() {

}

// Chuyen trang
function changePage(idx, inNode, inTotalPage, inMaxNum, inArrDisable) {
    var changeRequest = gTrans.manage.request;
    changeRequest.pageId = idx;
    gTrans.manage.pageId = idx;
    getListBenneficiaries(changeRequest);
}

// Tim kiem 
function searchBeneficiaries(input, e) {
    if (e.keyCode == 13) {
        var request = gTrans.manage.request;
        request.searchInput = input.value;
        getListBenneficiaries(request);
    }
}
function searchBeneficiariesWithButton() {
    var request = gTrans.manage.request;
    request.searchInput = document.getElementById("input.search.value").value;
    getListBenneficiaries(request);
}

// Gen xml ListBenneficiaries
function genXMLListBenes(listBenes) {
    // var docXml = createXMLDoc();
    // var rootNode = createXMLNode('resptable', '', docXml);
    // var childNode;
    // var infoNode;
    // for (var i = 0; i < listBenes.length; i++) {
    // infoNode = createXMLNode('tabletdetail', '', docXml, rootNode);
    // childNode = createXMLNode('idDestAcc', listBenes[i].BENE_ACCTNO, docXml, infoNode);
    // childNode = createXMLNode('bankName', listBenes[i].BANK_NAME, docXml, infoNode);
    // if (listBenes[i].FANCY_NAME) {
    // childNode = createXMLNode('beneName', listBenes[i].FANCY_NAME, docXml, infoNode);
    // } else {
    // childNode = createXMLNode('beneName', listBenes[i].BENE_NAME, docXml, infoNode);
    // }
    // childNode = createXMLNode('beneId', listBenes[i].BENEID, docXml, infoNode);
    // }


    // return docXml;

    var contentItem = '';
    for (var i = 0; i < listBenes.length; i++) {

        var beneId =listBenes[i].BENEID;

        var contentHTML = '';
        contentHTML += "<div style='margin: 10px 10px' class='recycler-list'>";
        contentHTML += "<table class='recycler-table-ebank ' align='center' width='100%'>";
        contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
        contentHTML += "<td width='20%' align='center'><span>" + CONST_STR.get('TRANS_BENE_ACC__BENEFICIARY') + "</span></td>";
        contentHTML += "<td width='30%' align='center'><span>" + CONST_STR.get('CONST_BANK_BENEFICIARY') + "</span></td>";
        contentHTML += "<td width='20%' align='center'><span>" + CONST_STR.get('TRANS_PERIODIC_PAYEE') + "</span></td>";
        contentHTML += "<td width='20%' align='center'><span>" + CONST_STR.get('BENEFIC_NAME_FAV_TITLE') + "</span></td>";
        contentHTML += "<td width='10%' align='center'><span>" + CONST_STR.get('INPUT_ACC_BTN_SELECT') + "</span></td>";
        contentHTML += "</tr>";

        contentItem += '<tr class="recycler-row-title recycler-list">';
        contentItem += '<td class="content-detail"><span">' + listBenes[i].BENE_ACCTNO + '</span></td>';
        contentItem += '<td class="content-detail"><span">' + listBenes[i].BANK_NAME + '</span></td>';
        contentItem += '<td class="content-detail"><span">' + listBenes[i].BENE_NAME + '</span></td>';
      //  contentItem += '<td class="content-detail"><span">' + listBenes[i].FANCY_NAME +'<a id="" class="ref-link-rename" onclick="prepareEdit('+ beneId + ')" href="javascript:void(0)"><span></span></a>'+ '</span></td>';
        contentItem += '<td class="content-detail"><a id="myModal" class="ref-link" onclick="prepareEdit('+ beneId + ')" href="javascript:void(0)"><span">' + listBenes[i].FANCY_NAME + '</span></a></td>';

//        if (listBenes[i].FANCY_NAME) {
//            contentItem += '<td class="content-detail"><span">' + listBenes[i].FANCY_NAME + '</span></td>';
//        } else {
//            contentItem += '<td class="content-detail"><span">' + listBenes[i].BENE_NAME + '</span></td>';
//        }


        contentHTML += "</tr>";
//        contentItem += '<td width="10%" class="icon-pencil" ><span><a style="padding 1px; cursor : pointer;" onclick="prepareEdit('
//            + beneId + ')"'
//            + 'href="javascript:void(0)">' + CONST_STR.get('CUS_PROFILE_EDIT_BTN') + '</a></span></div></td>';

        contentItem += '<td width="10%" class="icon-cross"><span><a style="padding 1px; cursor : pointer;" onclick="deleteBeneficiary('
            + beneId + ')"'
            + 'href="javascript:void(0)">' + CONST_STR.get('BTN_DELETE_PINPAD') + '</a></span></div></td>';
        contentHTML += "</tr>";
    }

    contentHTML += contentItem + "</tbody></table></div>";
    

    return contentHTML;
}

function prepareEdit(args) {
    var request = {
        idtxn: gTrans.manage.request.idtxn,
        sequenceId: 2,
        beneId: args
    }

    var strJSON = JSON.stringify(request);
    var arrayArgs = new Array();
    arrayArgs.push("2");
    arrayArgs.push(strJSON);

    var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_MANAGE_BENEFIC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
    gprsCmd.raw = '';
    data = getDataFromGprsCmd(gprsCmd);

    requestMBServiceCorp(data, true, 0, requestPrepareSuccess, requestPrepareFail);

}


function requestPrepareSuccess(e) {
    var response = JSON.parse(e);
    if ((response.respCode == RESP.get('COM_SUCCESS')) && (parseInt(response.responseType) == parseInt(CONSTANTS.get('CMD_CO_MANAGE_BENEFIC')))) {
        var jsonObj = response.respJsonObj;
        var xml_doc = genXMLBeneDetail(jsonObj);
        var xsl_doc = getCachePageXsl("transfer/manage_template/edit-bene-detail");
        genHTMLStringWithXML(xml_doc, xsl_doc, function(oStr) {
            document.getElementById("editBeneDetail").innerHTML = oStr;
        }, null, true, document.getElementById("editBeneDetail"));

    } else {
        if (response.respCode == '1019') {
            showAlertText(response.respContent);
        } else {
            showAlertText(CONST_STR.get('ERR_COM_TRANS_FAILED'));
        }
    }
}

function requestPrepareFail() {

}


function genXMLBeneDetail(jsonObj) {
    var beneficiary = jsonObj[0];
    var docXml = createXMLDoc();
    var rootNode = createXMLNode('edit', '', docXml);
    // Số tài khoản
    var sectionNode = createXMLNode('section', '', docXml, rootNode);
    if(beneficiary.TXN_TYPE== "3") {
        var titleNode = createXMLNode('title', CONST_STR.get('IDENTIFICATION_NUMBER'), docXml, sectionNode);
    }else {
        var titleNode = createXMLNode('title', CONST_STR.get('TRANS_BENE_ACC__BENEFICIARY'), docXml, sectionNode);
    }

    var inputIdNode = createXMLNode('inputId', 'id.edit.destaccount', docXml, sectionNode);
    var inputValueNode = createXMLNode('inputValue', beneficiary.BENE_ACCTNO, docXml, sectionNode);
    var disabledStatusNode = createXMLNode('disabled', 'disabled', docXml, sectionNode);

    if(beneficiary.TXN_TYPE== "3") {
        // ngay cap
        sectionNode = createXMLNode('section', '', docXml, rootNode);
        titleNode = createXMLNode('title', CONST_STR.get('IDENTIFICATION_TIME'), docXml, sectionNode);
        inputIdNode = createXMLNode('inputId', 'id.edit.issuedDate', docXml, sectionNode);
        inputValueNode = createXMLNode('inputValue', beneficiary.DATISSUE, docXml, sectionNode);
        disabledStatusNode = createXMLNode('disabled', 'disabled', docXml, sectionNode);
        // noi cap
        sectionNode = createXMLNode('section', '', docXml, rootNode);
        titleNode = createXMLNode('title', CONST_STR.get('IDENTIFICATION_PLACE'), docXml, sectionNode);
        inputIdNode = createXMLNode('inputId', 'id.edit.issuedPlace', docXml, sectionNode);
        inputValueNode = createXMLNode('inputValue', beneficiary.PLACEISSUE, docXml, sectionNode);
        disabledStatusNode = createXMLNode('disabled', 'disabled', docXml, sectionNode);
        // so dien thoai
        sectionNode = createXMLNode('section', '', docXml, rootNode);
        titleNode = createXMLNode('title', CONST_STR.get('IDENTIFICATION_PHONE_NUMBER'), docXml, sectionNode);
        inputIdNode = createXMLNode('inputId', 'id.edit.phone', docXml, sectionNode);
        inputValueNode = createXMLNode('inputValue', beneficiary.PHONENUMBER, docXml, sectionNode);
        disabledStatusNode = createXMLNode('disabled', 'disabled', docXml, sectionNode);
    }

    // Tại ngân hàng
    sectionNode = createXMLNode('section', '', docXml, rootNode);
    titleNode = createXMLNode('title', CONST_STR.get('CONST_BANK_BENEFICIARY'), docXml, sectionNode);
    inputIdNode = createXMLNode('inputId', 'id.edit.bankName', docXml, sectionNode);
    inputValueNode = createXMLNode('inputValue', beneficiary.BANK_NAME, docXml, sectionNode);
    disabledStatusNode = createXMLNode('disabled', 'disabled', docXml, sectionNode);
    // Tên người thụ hưởng
    sectionNode = createXMLNode('section', '', docXml, rootNode);
    titleNode = createXMLNode('title', CONST_STR.get('BENEFIC_NAME_TITLE'), docXml, sectionNode);
    inputIdNode = createXMLNode('inputId', 'id.edit.beneName', docXml, sectionNode);
    inputValueNode = createXMLNode('inputValue', beneficiary.BENE_NAME, docXml, sectionNode);
    disabledStatusNode = createXMLNode('disabled', 'disabled', docXml, sectionNode);
    // Tên ưa thích
    sectionNode = createXMLNode('section', '', docXml, rootNode);
    titleNode = createXMLNode('title', CONST_STR.get('BENEFIC_NAME_FAV_TITLE'), docXml, sectionNode);
    inputIdNode = createXMLNode('inputId', 'id.edit.francyName', docXml, sectionNode);
    inputValueNode = createXMLNode('inputValue', beneficiary.FANCY_NAME, docXml, sectionNode);
    //disabledStatusNode = createXMLNode('disabledStatus', 'false', docXml, sectionNode);

    var buttonNode = createXMLNode('beneId', beneficiary.BENEID, docXml, rootNode);

    return docXml;
}

function deleteBeneficiary(args) {
    showAlertConfirmText(CONST_STR.get("CONST_CONFIRM_DELETE_BENEFICIARY"));
    document.addEventListener("alertConfirmOK", function foobar(e) {
        document.removeEventListener("alertConfirmOK", foobar);
        var request = {
            idtxn : gTrans.manage.request.idtxn,
            sequenceId : 4,
            beneId : args
        };
        sendJSONRequest(request);
    });
}

function saveBeneficiary(args) {
    showAlertConfirmText(CONST_STR.get("CONST_CONFIRM_SAVE_BENEFICIARY"));
    document.addEventListener("alertConfirmOK", function foobar(e) {
        document.removeEventListener("alertConfirmOK", foobar);
        var request = {
            idtxn : gTrans.manage.request.idtxn,
            sequenceId : 3,
            beneId : args,
            beneAcc : document.getElementById("id.edit.destaccount").value,
            bankName : document.getElementById("id.edit.bankName").value,
            beneName : document.getElementById("id.edit.beneName").value,
            francyName : document.getElementById("id.edit.francyName").value
        };
        sendJSONRequest(request);
    });
}

function sendJSONRequest(request) {
    var docXml = createXMLDoc();
    var rootNode = createXMLNode('review', '', docXml);
    setReviewXmlStore(docXml);

    gCorp.requests = [request];
    gCorp.cmdType = CONSTANTS.get("CMD_CO_MANAGE_BENEFIC");
    gCorp.byPassReview = true;
    gCorp.hideBackButton = true;
    navCachedPages["corp/common/review/com-review"] = null;
    navController.pushToView("corp/common/review/com-review", true, 'xsl');
}

function cancelEdit() {
    var e = document.getElementById('editBeneDetail');
    e.innerHTML = "";
    return;
}

function showManageTempPage() {
    navController.initWithRootView('transfer/manage_template/manage_trans_temp', true, 'html');
}

function controlInputText(field, maxlen, enableUnicode) {
    if (maxlen != undefined && maxlen != null) {
        textLimit(field, maxlen);
    }
    if (enableUnicode == undefined || !enableUnicode) {
        field.value = removeAccentinfo(field.value);
    }
}