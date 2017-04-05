var objJSON = {};
var bankArray;
var NationResultArray = null;

bottomBar.hide();
getNationList();
resizeMainViewContent(currentPage);
function getNationList() {
    var nodeHistory = document.getElementById('divListGroup');
    nodeHistory.innerHTML = '';
    var tmpInputValue;
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        tmpInputValue = document.getElementById('input.id.inputvalue');
        
    }else{
        tmpInputValue = document.getElementById('input.id.inputvaluemb');
    }
    tmpInputValue.value = '';
    genNationListView();
    searchNationName();
    // bottomBar.hide();
}

function goBack() {
    navController.popView(true);
}

function searchNationName() {
    var arrBank = new Array();
    if (lstbankArr.length > 0) {
        for (var i = 0; i < lstbankArr.length; i++) {
            var strX = lstbankArr[i].bank_code + "#" + lstbankArr[i].bank_name;
            arrBank.push(strX);
        }
    }
    var tmpNodeInputValue;
    if (CONST_DESKTOP_MODE && !checkScreenisMobilePX()) {
        searchWhenInputAtIDWithArrayString('input.id.inputvalue', arrBank);
        tmpNodeInputValue = document.getElementById('input.id.inputvalue');
    }else{
        searchWhenInputAtIDWithArrayString('input.id.inputvaluemb', arrBank);
        tmpNodeInputValue = document.getElementById('input.id.inputvaluemb');
    }
    tmpNodeInputValue.addEventListener('evtSearchResultDone', handleSearchResultWhenInput, false);

    function handleSearchResultWhenInput(e) {
        logInfo(e.searchResult);
//        gInternational.list_Nation = e.searchResult;
        NationResultArray = e.searchResult;
        NationResultArray = arrtoJson(NationResultArray);
        genNationListView();
    }

}


function genNationListView() {
    logInfo("-> genNationListView \n");
    var screenWidth = window.innerWidth || document.body.clientWidth;
    var textLength = Math.round(screenWidth * 0.8);

    var nodeHistory = document.getElementById('divListGroup');
    if ((NationResultArray != null) || (NationResultArray != undefined)) {
         objJSON = NationResultArray;
    }else{
        objJSON = lstbankArr;
    }
    htmlReviewInfo = "";

    var htmlReviewInfo = htmlReviewInfo +
        "<tr><table width='100%' align='center' class='background-blacktrans' style='width: 97%'>";

    if ((objJSON == null) || (objJSON == undefined)) {
        htmlReviewInfo = htmlReviewInfo + "<tr class='trow-default'>" +
            "<td colspan='2' class='td-textnobg'>" +
            CONST_STR.get('ERR_GET_INPUT_HISTORY_NO_DATA') +
            "</td></tr>";
    } else {
        for (var i = 0; i < objJSON.length; i++) {
                htmlReviewInfo = htmlReviewInfo + "<tr class='trow-default' onClick='getNationAtIndex(" + i + ")'>" +
                    // "<td style='padding-left: 15px' class='td-left-single'>" + 
                    // "<span>" + objJSON[i].bank_name + "</span>" +
                    // "</td></tr>";
                    "<td style='width:10%;text-align: center;'>" +
                    "<div>" +
                    "<span class='icon-homepage'></span>" +
                    "</div>" +
                    "</td>" +
                    "<td style='width:90%' class='td-left-detail'>" +
                    "<div><span style='margin-left: 10px'>" +
                    objJSON[i].bank_name +
                    "</span></div></td></tr>";
        }
    }

    htmlReviewInfo = htmlReviewInfo + "</table></tr>";

    htmlReviewInfo = htmlReviewInfo + "</table></tr>";

    nodeHistory.innerHTML = htmlReviewInfo;
}

var evtSelectedNation = document.createEvent('Event');
evtSelectedNation.initEvent('evtSelectedNation', true, true);

function getNationAtIndex(inIdx) {
    logInfo("-> getNationAtIndex \n");
    logInfo('Selected bank at index: ' + inIdx);
    gBankInfoSelected = objJSON[inIdx].bank_code + "#" + objJSON[inIdx].bank_name;//save bank info raw data
    evtSelectedNation.bank_code = objJSON[inIdx].bank_code;
    evtSelectedNation.bank_name = objJSON[inIdx].bank_name;
    evtSelectedNation.viewBack = true;
    navController.popToView(gTrans.redirect, true);
    document.dispatchEvent(evtSelectedNation);
}


function arrtoJson(arr) {

    var pluginArrayArg = new Array();
    for (var i = 0; i < arr.length; i++) {
        var tmpStr = arr[i];
        var tmpArr = tmpStr.split('#');
        var jsonArg = new Object();
        jsonArg.bank_code = tmpArr[0];
        jsonArg.bank_name = tmpArr[1];
        pluginArrayArg.push(jsonArg);
    }

    var jsonArray = JSON.parse(JSON.stringify(pluginArrayArg));
    return (jsonArray);
}