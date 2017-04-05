var objJSON = {};
var bankArray;
var NationResultArray = null;

getNationList();

function getNationList() {
    var nodeHistory = document.getElementById('divListGroup');
    nodeHistory.innerHTML = '';
    var tmpInputValue = document.getElementById('input.id.inputvalue');
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
    if (objJSON.length > 0) {
        for (var i = 0; i < objJSON.length; i++) {
            var strX = objJSON[i].COUNTRY_CODE + "#" + objJSON[i].COUNTRY_NAME;
            arrBank.push(strX);
        }
    }
    searchWhenInputAtIDWithArrayString('input.id.inputvalue', arrBank);
    var tmpNodeInputValue = document.getElementById('input.id.inputvalue');
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
        objJSON = gInternational.list_Nation;
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
                    "<td style='padding-left: 15px' class='td-left-single'>" + 
                    "<span>" + objJSON[i].COUNTRY_NAME + "</span>" +
                    "</td></tr>";
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
    gBankInfoSelected = objJSON[inIdx].COUNTRY_CODE + "#" + objJSON[inIdx].COUNTRY_NAME;//save bank info raw data
    evtSelectedNation.COUNTRY_CODE = objJSON[inIdx].COUNTRY_CODE;
    evtSelectedNation.COUNTRY_NAME = objJSON[inIdx].COUNTRY_NAME;
    evtSelectedNation.viewBack = true;
    navController.popView(true);
    document.dispatchEvent(evtSelectedNation);
}


function arrtoJson(arr) {

    var pluginArrayArg = new Array();
    for (var i = 0; i < arr.length; i++) {
        var tmpStr = arr[i];
        var tmpArr = tmpStr.split('#');
        var jsonArg = new Object();
        jsonArg.COUNTRY_CODE = tmpArr[0];
        jsonArg.COUNTRY_NAME = tmpArr[1];
        pluginArrayArg.push(jsonArg);
    }

    var jsonArray = JSON.parse(JSON.stringify(pluginArrayArg));
    return (jsonArray);
}