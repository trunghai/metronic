/**
 * Created by JetBrains WebStorm.
 * User: LamPT
 * Date: 6/28/16
 * Time: 10:51 AM
 * To change this template use File | Settings | File Templates.
 */

/*** LOAD PAGE ***/
//Global variable
var currentDisplayMenu;
var currentTotalSubmenuHeight;
var orgTotalSubmenuHeight;
var content;
var clientHeight;
var clientWidth;
var pageJS;
var hasPageJS = false;
var currentPage = ''; //important variable! dont change
var prePage = '';
var menuSection;
var hasMenuScrollEvent = false;
var isNotNeedReloadPageStyleSheet = false;

function applyDynamicCommonStyleSheet() {
    //if(CONST_DESKTOP_MODE) return;
    var currentClientHeight = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    var currentClientWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    if (currentClientWidth != clientWidth || currentClientHeight != clientHeight) {
        clientWidth = currentClientWidth;
        clientHeight = currentClientHeight;
    }

    var tmpPageHeader = document.getElementById('pageHeader');
    if (tmpPageHeader.style.display != 'none' && (gModeScreenView != CONST_MODE_SCR_SMALL || !isModelMobile)) {
        //clientHeight -=195-40;
        clientHeight -= tmpPageHeader.clientHeight; // + 40: footer
    }

    // 23 --> la kich thuoc font cua icon
    //40 --> la chieu cao header
    var submenus = document.getElementsByClassName('menu-layout-contents-sub');
    var itemHeight = 38;
    var padding = (itemHeight - 14) / 2;
    var submenuHeight = (clientHeight - 80 ) - submenus.length * itemHeight;
    var styles =
//            '.menu-layout-contents li:target > .menu-layout-contents-sub{height: ' + submenuHeight + 'px;}' +
        /*'.menu-layout-contents li > div span { top: ' + (padding - 2) + 'px;}' +
         '.menu-layout-contents li > div { height: ' + itemHeight + 'px; padding: ' + padding + 'px 0 ' + padding + 'px 50px;}' +
         '.menu-layout-contents em { top: ' + ((itemHeight - 23) / 2 + 0.5) + 'px;}' +
         '.menu-layout-contents-sub em { top: ' + ((itemHeight - 12) / 2 + 0.5) + 'px;}' +
         '.menu-layout-contents-sub li > div .no-child { top: ' + ((itemHeight - 20) / 2 + 0.5) + 'px;}' +*/
        '.loading .circle { margin: ' + (clientHeight / 2 - 50) + 'px auto;}' +
            '.loading .circle1 { top: -' + (clientHeight / 2 - 10) + 'px;}';

    var style = document.createElement('style');
    style.setAttribute('id', 'menuSlideDynamic');

    var tmpNodeStyle = document.getElementById('menuSlideDynamic');
    if ((tmpNodeStyle == undefined) || (tmpNodeStyle == null)) {
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    else {
        tmpNodeStyle.parentNode.removeChild(tmpNodeStyle);
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    if (style.styleSheet) { // IE
        style.styleSheet.cssText = styles;
    } else {
        var cssText = document.createTextNode(styles);
        style.appendChild(cssText);
    }

    menuSection = document.getElementById('menu-section');
    if (menuSection.style.display == 'none') {
        document.getElementById('wrapper-menu').style.height = clientHeight - 65 + 'px';
    }
    else {
        document.getElementById('wrapper-menu').style.height = clientHeight - 50 * 2 + 'px';
    }
    var tmpNodeMenu = document.getElementsByClassName('menu-layout-contents')[0];
    //currentTotalSubmenuHeight = tmpNodeMenu.clientHeight;
    currentTotalSubmenuHeight = tmpNodeMenu.childElementCount * itemHeight;
    orgTotalSubmenuHeight = tmpNodeMenu.childElementCount * itemHeight;

    //Neu la trang faq thi show box lien he
    //20140911: hien box lien he - begin
    if (currentPage == "faq-scr-vie" || currentPage == "faq-scr-eng") {

        var tmpNodeMain = document.getElementById('mainview');
        tmpNodeMain.style.cssFloat = 'right';
        tmpNodeMain.style.width = '100%';
//        document.getElementById('box_lienhe').style.display = 'block';
    }
    else {
//        document.getElementById('box_lienhe').style.display = 'none';
    }
    //20140911: hien box lien he - end

    //logInfo('applyDynamicCommonStyleSheet finished!');
}

function applyDynamicPromotionWithNumOfItems(inNumItems) {
//    //if(CONST_DESKTOP_MODE) return;
//    var currentClientHeight = window.innerHeight
//        || document.documentElement.clientHeight
//        || document.body.clientHeight;
//    var currentClientWidth = window.innerWidth
//        || document.documentElement.clientWidth
//        || document.body.clientWidth;
//
//    var tmpPageHeader = document.getElementById('pageHeader');
//    if (gModeScreenView != CONST_MODE_SCR_SMALL) {
//        //clientHeight -=195-40;
//        currentClientHeight -= 40; //40: footer //tmpPageHeader.clientHeight
//    }
//
//    var tmpPromotionHeight = inNumItems * 64; //height = 64px
//    var styles =
//        '.promotion-layout-contents { height: ' + tmpPromotionHeight + 'px; }';
//    document.getElementById('wrapper-promtion').style.height = currentClientHeight - 40 + 'px';
}

/** TUANNM5 UPDATE FOR JUMBO**/
function checkJumboAccExist(liItem) {
    var data = {};
    var arrayArgs = new Array();
    if (gJumboAccExistedStat != null) {
        if (gJumboAccExistedStat == false) {
            displaySubMenuForJumboAcc(false);
        } else {
            displaySubMenuForJumboAcc(true);
        }
        applyScrollForMe(liItem);

        var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
        data = getDataFromGprsCmd(gprsCmd);
        requestBacgroundMBService('CMD_CHECK_EXIST_JUMBO_ACC', arrayArgs, function (e) {
            gprsResp = parserJSON(e);
            if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
                if (gprsResp.arguments[0] == 'N') {
                    gJumboAccExistedStat = false;
                    gliItemJumbo = liItem;
                    gJumboAccInfo = gprsResp.arguments;
                } else {
                    gJumboAccExistedStat = true;
                }
            }
        }, function () {
            console.log('Get data from Jumbo fail!');
        });
    } else {
        var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
        data = getDataFromGprsCmd(gprsCmd);
        requestMBService(data, true, 0, function (e) {
            gprsResp = parserJSON(e);
            if (gprsResp.respCode != '0' && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
                console.log('Get data from Jumbo fail!');
                var tmpPageName = navController.getDefaultPage();
                var tmpPageType = navController.getDefaultPageType();
                navController.initWithRootView(tmpPageName, true, tmpPageType);
            }
            if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
                //genReviewScreen();
                if (gprsResp.arguments[0] == 'N') {
                    gJumboAccExistedStat = false;
                    displaySubMenuForJumboAcc(false);
                    gliItemJumbo = liItem;
                    gJumboAccInfo = gprsResp.arguments;
                } else {
                    gJumboAccExistedStat = true;
                    displaySubMenuForJumboAcc(true);
                }
                applyScrollForMe(liItem);

            }
        }, function () {
            console.log('Get data from Jumbo fail!');
        });
    }
}

function checkJumboAccExist_New(liItem) {
    var data = {};
    var arrayArgs = new Array();
    if (gJumboAccExistedStat != null) {
        if (gJumboAccExistedStat == false) {
            displaySubMenuForJumboAcc(false);
        } else {
            displaySubMenuForJumboAcc(true);
        }
        //applyScrollForMe(liItem);
        navController.initWithRootView('jumbo/jumbo_check_auto_saving', true, 'xsl')

        var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
        data = getDataFromGprsCmd(gprsCmd);
        requestBacgroundMBService('CMD_CHECK_EXIST_JUMBO_ACC', arrayArgs, function (e) {
            gprsResp = parserJSON(e);
            if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
                if (gprsResp.arguments[0] == 'N') {
                    gJumboAccExistedStat = false;
                    gliItemJumbo = liItem;
                    gJumboAccInfo = gprsResp.arguments;
                } else {
                    gJumboAccExistedStat = true;
                }
            }
        }, function () {
            console.log('Get data from Jumbo fail!');
        });
    } else {
        var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
        data = getDataFromGprsCmd(gprsCmd);
        requestMBService(data, true, 0, function (e) {
            gprsResp = parserJSON(e);
            if (gprsResp.respCode != '0' && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
                console.log('Get data from Jumbo fail!');
                var tmpPageName = navController.getDefaultPage();
                var tmpPageType = navController.getDefaultPageType();
                navController.initWithRootView(tmpPageName, true, tmpPageType);
            }
            if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
                //genReviewScreen();
                if (gprsResp.arguments[0] == 'N') {
                    gJumboAccExistedStat = false;
                    displaySubMenuForJumboAcc(false);
                    gliItemJumbo = liItem;
                    gJumboAccInfo = gprsResp.arguments;
                } else {
                    gJumboAccExistedStat = true;
                    displaySubMenuForJumboAcc(true);
                }
                //applyScrollForMe(liItem);
                navController.initWithRootView('jumbo/jumbo_check_auto_saving', true, 'xsl')

            }
        }, function () {
            console.log('Get data from Jumbo fail!');
        });
    }
}

function displaySubMenuForJumboAcc(isExisted) {
    var wrapper = document.getElementById('wrapper_jumboAcc');
    if (wrapper != null) {
        wrapper.innerHTML = gJumboMenuElements;
    }

    changeLanguageInNodeWithClass('langNoStyle');

    if (wrapper == null) {
        return;
    }
    var parentDiv = document.getElementById('wrapper_jumboAcc').getElementsByTagName('div')[0];
    if (isExisted == false) {
        //gMenuRawData
        var subMenuAccInfo = document.getElementById('liJumboAccInfo');
        var subMenuRemoveEasy = document.getElementById('liJumboAccUnreg');
        //ngocdt3 bo sug theo ver7
        var subMenuLoan = document.getElementById('liJumboSavingApplyLimit');
        var subMenuAutoSaving = document.getElementById('liJumboCreateAutoSaving');
        var subMenuCardAdvance = document.getElementById('liJumboCreditApplyLimit');
        //ngocdt3 end
        if (subMenuAccInfo != null) {
            parentDiv.removeChild(subMenuAccInfo);
        }
        if (subMenuRemoveEasy != null) {
            parentDiv.removeChild(subMenuRemoveEasy);
        }
        if (subMenuLoan != null) {
            parentDiv.removeChild(subMenuLoan);
        }
        if (subMenuAutoSaving != null) {
            parentDiv.removeChild(subMenuAutoSaving);
        }
        if (subMenuCardAdvance != null) {
            parentDiv.removeChild(subMenuCardAdvance);
        }
    } else {
        var subMenuCreateAcc = document.getElementById('liJumboCreateAcc');
        if (subMenuCreateAcc != null) {
            parentDiv.removeChild(subMenuCreateAcc);
        }
    }

}
//ngocdt3 bo sung cho v7
function checkJumboAccExistV7(liItem) {
    var data = {};
    var arrayArgs = new Array();
    if (gJumboAccExistedStat != null) {
        if (gJumboAccExistedStat == false) {
            displaySubMenuForJumboAccV7(false);
        } else {
            displaySubMenuForJumboAccV7(true);
        }
        interlockStatus = false;
        applyScrollForMe(liItem);

        var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
        data = getDataFromGprsCmd(gprsCmd);
        requestBacgroundMBService('CMD_CHECK_EXIST_JUMBO_ACC', arrayArgs, function (e) {
            gprsResp = parserJSON(e);
            if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
                if (gprsResp.arguments[0] == 'N') {
                    gJumboAccExistedStat = false;
                    gliItemJumboNew = liItem;
                    gJumboAccInfo = gprsResp.arguments;
                } else {
                    gJumboAccExistedStat = true;
                }
            }
        }, function () {
            console.log('Get data from Jumbo fail!');
        });
    } else {
        var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
        data = getDataFromGprsCmd(gprsCmd);
        requestMBService(data, true, 0, function (e) {
            gprsResp = parserJSON(e);
            if (gprsResp.respCode != '0' && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
                console.log('Get data from Jumbo fail!');
                var tmpPageName = navController.getDefaultPage();
                var tmpPageType = navController.getDefaultPageType();
                navController.initWithRootView(tmpPageName, true, tmpPageType);
            }
            if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
                //genReviewScreen();
                if (gprsResp.arguments[0] == 'N') {
                    gJumboAccExistedStat = false;
                    displaySubMenuForJumboAccV7(false);
                    gliItemJumboNew = liItem;
                    gJumboAccInfo = gprsResp.arguments;
                } else {
                    gJumboAccExistedStat = true;
                    displaySubMenuForJumboAccV7(true);
                }
                interlockStatus = false;
                applyScrollForMe(liItem);

            }
        }, function () {
            console.log('Get data from Jumbo fail!');
        });
    }
}
function displaySubMenuForJumboAccV7(isExisted) {
   // document.getElementById('wrapper_mAccInfo').innerHTML = gAccInfoMenuElements;
    // changeLanguageInNodeWithClass('langNoStyle');
    // var parentAccDiv = document.getElementById('wrapper_mAccInfo').getElementsByTagName('div')[0];
    // if (isExisted == false) {
    //     var subJumboAccInfoNew = document.getElementById('liJumboAccInfoNew');//ngocdt3 bo sung
    //     //parentAccDiv.removeChild(subJumboAccInfoNew);
    //     if (subJumboAccInfoNew != null) {
    //         parentAccDiv.removeChild(subJumboAccInfoNew);
    //     }
    // } else {
    //     var subMenuCreateAccNew = document.getElementById('liJumboCreateAccNew');//ngocdt3 bo sung
    //     //parentAccDiv.removeChild(subMenuCreateAccNew);
    //     if (subMenuCreateAccNew != null) {
    //         parentAccDiv.removeChild(subMenuCreateAccNew);
    //     }
    // }
   // navController.initWithRootView('accountxsl/account-scr', true, 'xsl');
    initMenuDetailBackground('jumboAcc');
}
function checkJumboAccExistSetting(liItem) {
    var data = {};
    var arrayArgs = new Array();
    if (gJumboAccExistedStat != null) {
        applyScrollForMe(liItem);

        var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
        data = getDataFromGprsCmd(gprsCmd);
        requestBacgroundMBService('CMD_CHECK_EXIST_JUMBO_ACC', arrayArgs, function (e) {
            gprsResp = parserJSON(e);
            if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
                if (gprsResp.arguments[0] == 'N') {
                    gJumboAccExistedStat = false;
                } else {
                    gJumboAccExistedStat = true;
                }
            }
        }, function () {
            console.log('Get data from Jumbo fail!');
        });
    } else {
        var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC"), "", "", gUserInfo.lang, gUserInfo.sessionID, arrayArgs);
        data = getDataFromGprsCmd(gprsCmd);
        requestMBService(data, true, 0, function (e) {
            gprsResp = parserJSON(e);
            if (gprsResp.respCode != '0' && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
                console.log('Get data from Jumbo fail!');
                var tmpPageName = navController.getDefaultPage();
                var tmpPageType = navController.getDefaultPageType();
                navController.initWithRootView(tmpPageName, true, tmpPageType);
            }
            if (checkResponseCodeSuccess(gprsResp.respCode) && (parseInt(gprsResp.responseType) == parseInt(CONSTANTS.get("CMD_CHECK_EXIST_JUMBO_ACC")))) {
                //genReviewScreen();
                if (gprsResp.arguments[0] == 'N') {
                    gJumboAccExistedStat = false;
                } else {
                    gJumboAccExistedStat = true;
                }
                applyScrollForMe(liItem);

            }
        }, function () {
            console.log('Get data from Jumbo fail!');
        });
    }
}
/**TUANNM5 END UPDATE**/

function applyScrollForMe(liItem) {

    if (hasMenuScrollEvent) {
        hasMenuScrollEvent = false;
        return;
    }
    if (interlockStatus) {
        return;
    }
    setInterlockEnable();
    showMaskSlideMenu(content.isOpen);
    var rowHeight = 38; //row menu height
    if (currentDisplayMenu != undefined && currentDisplayMenu != null && currentDisplayMenu != liItem) {
        var currentSubMenuContent = currentDisplayMenu.getElementsByClassName('menu-layout-contents-sub')[0];
        if (currentSubMenuContent) {
            currentTotalSubmenuHeight -= currentSubMenuContent.clientHeight;
            currentSubMenuContent.style.height = '0px';
            //currentSubMenuContent.style.opacity = 0;
        }
    }

    if (currentTotalSubmenuHeight < orgTotalSubmenuHeight) {
        currentTotalSubmenuHeight = orgTotalSubmenuHeight;
    }

    var submenus = liItem.getElementsByClassName('menu-layout-contents-sub')[0];
    var subMenuHight = submenus.getElementsByTagName('li').length * rowHeight;
    if (submenus.style.height == '0px' || submenus.style.height == '') {
        submenus.style.height = subMenuHight + 'px';
        currentTotalSubmenuHeight += subMenuHight;
        submenus.style.opacity = 1;
    }
    else {
        submenus.style.height = '0px';
        //submenus.style.opacity = 0;
        currentTotalSubmenuHeight -= subMenuHight;
    }

    document.getElementById('scroller-menu').style.height = currentTotalSubmenuHeight + 'px';
    currentDisplayMenu = liItem;
}

var evtLoadPageSuccess = document.createEvent('Event'); //Event transaction success
evtLoadPageSuccess.initEvent("evtLoadPageSuccess", true, true);

var evtStartUnloadPage = document.createEvent('Event'); //Event transaction success
evtStartUnloadPage.initEvent("evtStartUnloadPage", true, true);

//var CONST_LOAD_PAGE_FAIL_STATUS = [404, 403, 500, 503];
function isLoadPageFailStatus(inStatus) {
    if (!inStatus) return;
    var tmpSt = inStatus;
    if (typeof(inStatus) == 'string') {
        tmpSt = parseInt(inStatus);
    }
    for (var i = 0; i < CONST_LOAD_PAGE_FAIL_STATUS.length; i++) {
        if (tmpSt == CONST_LOAD_PAGE_FAIL_STATUS[i]) {
            return true;
        }
    }
    return false;
}
var gLoadPageID = getCurrentTime();
var CONST_TIME_OUT_LOAD_PAGE = 45; //seconds
var CONST_TIME_OUT_LOAD_PAGE_MSG = 3; //seconds
var timeToShowLoadingMsg;
var timeOutLoadTabHost;

function loadPage(page, haveJs, successCallback, failCallback) {
    //fix bug on iPad
    var isIPad = navigator.userAgent.match(/iPad/i);
    //if(isIPad) windowScrollToTop();
    windowScrollToTop();
    showMaskSlideMenu(false);

    //show loading page indicator
    var tabHostMsgNode = document.getElementById('tabHostFailMsg');
    var tabHostIndicatorNode = document.getElementById('tabHostIndicator');
    var tabHostLoadingMsgNode = document.getElementById('tabHostLoadingMsg');
    var tabHostPageNode = document.getElementById('tabHost');
    //load page indicator
    tabHostMsgNode.style.display = 'none';
    tabHostIndicatorNode.style.display = '';
    tabHostLoadingMsgNode.style.display = 'none';
    if (timeToShowLoadingMsg) clearTimeout(timeToShowLoadingMsg);
    if (timeOutLoadTabHost) clearTimeout(timeOutLoadTabHost);
    timeToShowLoadingMsg = setTimeout(function () {
        clearTimeout(timeToShowLoadingMsg);
        tabHostLoadingMsgNode.style.display = 'block';
        tabHostLoadingMsgNode.innerHTML = CONST_STR.get('ERR_LOADING_PAGE_MSG');
    }, CONST_TIME_OUT_LOAD_PAGE_MSG * 1000);
    timeOutLoadTabHost = setTimeout(function () {
        clearTimeout(timeOutLoadTabHost);
        if (tabHostIndicatorNode.style.display != 'none') {
            tabHostMsgNode.innerHTML = CONST_STR.get('ERR_LOAD_PAGE_FAIL_CONTENT');
            tabHostMsgNode.style.display = '';
            tabHostPageNode.innerHTML = '';
        }
        tabHostIndicatorNode.style.display = 'none';
    }, CONST_TIME_OUT_LOAD_PAGE * 1000);

    tabHostPageNode.style.display = 'none';
    if (gModeScreenView == CONST_MODE_SCR_SMALL) closeAllSlideMenu();
    //if(currentPage != 'login-scr') closeAllSlideMenu();
    var tmpStatusNoCachePage = navCheckPageNoCache(page);

    //if ((currentPage != page) || (currentPage == navController.getDefaultPage()) || tmpStatusNoCachePage) {
    cachePageHTML(currentPage);

    //event start unload page
    if (typeof(window['viewWillUnload']) == 'function') {
        window['viewWillUnload']();
        setTimeout(function () {
            window['viewWillUnload'] = null;
        }, 10);

    }
    //event start unload page
    document.dispatchEvent(evtStartUnloadPage);

    if (((navCachedPages[page] == undefined) || (navCachedPages[page] == null)) || (currentPage == navController.getDefaultPage()) || tmpStatusNoCachePage) {
        tabHostPageNode.innerHTML = '';

        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var pathFullOfFile;
        if (CONST_BROWSER_MODE) {
            pathFullOfFile = (gDeviceWWWFolder.length == 0) ? ('./pages/' + page + '.html' /*+ '?id=' + gLoadPageID*/) : (gDeviceWWWFolder + 'pages/' + page + '.html'/* + '?id=' + gLoadPageID*/);
        }
        else {
            pathFullOfFile = (gDeviceWWWFolder.length == 0) ? ('./pages/' + page + '.html') : (gDeviceWWWFolder + 'pages/' + page + '.html');
        }
        //var pathFullOfFile = (gDeviceWWWFolder.length == 0) ? ('./pages/' + page + '.html') : (gDeviceWWWFolder + 'pages/' + page + '.html');
        xhr.open("GET", pathFullOfFile); //assuming kgr.bss is plaintext

        xhr.onreadystatechange = function () {
            if ((xhr.readyState == 4) && ((xhr.status == 200) || (xhr.status == 0))) {
                //for testing
                logInfo("pape: " + page + " is ready!");

                fadeInMainContentScreen();
                tabHostPageNode.style.display = '';
                tabHostPageNode.innerHTML = xhr.responseText;

                //Add change language
                changeLanguageInView();
                //save js status
                hasPageJS = haveJs;
                currentPage = page;
                loadJSfile(page, haveJs, function () {
                    //hide page indicator
                    tabHostIndicatorNode.style.display = 'none';
                    clearTimeout(timeOutLoadTabHost);

                    var timePageEvent = setTimeout(function () {
                        clearTimeout(timePageEvent);
                        applyDynamicCommonStyleSheet();
                        applyDynamicPageStyleSheet(true);
                        if (successCallback && (typeof(successCallback) == 'function')) {
                            successCallback();
                        }
                        if (typeof(window['viewDidLoadSuccess']) == 'function') {
                            window['viewDidLoadSuccess']();
                            setTimeout(function () {
                                window['viewDidLoadSuccess'] = null;
                                resizeMainViewContent(page);
                            }, 10)
                        }
                        document.dispatchEvent(evtLoadPageSuccess);

                        handleKeyboardShowAndHidden();
                    }, 10);

                }, function () {
                    logInfo("Page: " + page + " not found!!!");
                    tabHostIndicatorNode.style.display = 'none';
                    clearTimeout(timeOutLoadTabHost);
                    tabHostMsgNode.innerHTML = CONST_STR.get('ERR_LOAD_PAGE_FAIL_CONTENT');
                    tabHostMsgNode.style.display = '';
                });
            }
            else if (isLoadPageFailStatus(xhr.status)) {
                logInfo("Page: " + page + " not found!!!");
                tabHostIndicatorNode.style.display = 'none';
                clearTimeout(timeOutLoadTabHost);
                tabHostMsgNode.innerHTML = CONST_STR.get('ERR_LOAD_PAGE_FAIL_CONTENT');
                tabHostMsgNode.style.display = '';
            }
            else {
                //for testing
                //logInfo("XHR status: " + xhr.status + "readyState: " + xhr.readyState + " pape: " + page + " not ready!");
            }
        };

        //no-cache
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }
    else {
        fadeInMainContentScreen();
        tabHostPageNode.style.display = '';
        tabHostPageNode.innerHTML = navCachedPages[page];

        //fix cache check box
        var nodeTxts = document.getElementsByTagName("input");
        for (var nx = 0; nx < nodeTxts.length; nx++) {
            var tmpNodeTxt = nodeTxts[nx];
            if (tmpNodeTxt.type == "checkbox") {
                tmpNodeTxt.checked = (tmpNodeTxt.value == 'true') ? true : false;
            }
        }

        //Add change language
        changeLanguageInView();

        //save js status
        hasPageJS = haveJs;
        currentPage = page;
        loadJSfile(page, haveJs, function () {

            tabHostIndicatorNode.style.display = 'none';
            clearTimeout(timeOutLoadTabHost);

            var timePageEvent = setTimeout(function (e) { //fix on windows phone
                clearTimeout(timePageEvent);
                applyDynamicCommonStyleSheet();
                applyDynamicPageStyleSheet(true);
                if (successCallback && (typeof(successCallback) == 'function')) {
                    successCallback();
                }
                if (typeof(window['viewDidLoadSuccess']) == 'function') {
                    window['viewDidLoadSuccess']();
                    setTimeout(function () {
                        window['viewDidLoadSuccess'] = null;
                        resizeMainViewContent(page);
                    }, 10)
                }
                document.dispatchEvent(evtLoadPageSuccess);

                handleKeyboardShowAndHidden();
            }, 10);
        }, function () {
            logInfo("Page: " + page + " not found!!!");
            tabHostIndicatorNode.style.display = 'none';
            clearTimeout(timeOutLoadTabHost);
            tabHostMsgNode.innerHTML = CONST_STR.get('ERR_LOAD_PAGE_FAIL_CONTENT');
            tabHostMsgNode.style.display = '';
        });
    }
    //}
}
function loadJSfile(page, haveJsFile, successCallback, failCallback) {
    if (haveJsFile == undefined) haveJsFile = true;
    if (haveJsFile) {
        //METHOD 1: Load script by file path
        if (CONST_DEBUG_MODE) {
            head = document.getElementsByTagName('head')[0];
            // next line removes the previously addid External JavaScript
            /*if ((pageJS != undefined) && (pageJS != null)) {
             head.removeChild(pageJS);
             }*/
            pageJS = document.createElement('script');
            pageJS.setAttribute("id", "pageJS");
            pageJS.type = 'text/javascript';
            if (CONST_BROWSER_MODE) {
                pageJS.src = (gDeviceWWWFolder.length == 0) ? ('./pages/' + page + '.js'/* + '?id=' + gLoadPageID*/) : (gDeviceWWWFolder + 'pages/' + page + '.js'/* + '?id=' + gLoadPageID*/);
            }
            else {
                pageJS.src = (gDeviceWWWFolder.length == 0) ? ('./pages/' + page + '.js') : (gDeviceWWWFolder + 'pages/' + page + '.js');
            }
            //pageJS.src = (gDeviceWWWFolder.length == 0) ? ('./pages/' + page + '.js') : (gDeviceWWWFolder + 'pages/' + page + '.js');
            //head.appendChild(pageJS);
            var tmpPageJS = document.getElementById('pageJS');
            if ((tmpPageJS != undefined) && (tmpPageJS != null)) {
                tmpPageJS.parentNode.replaceChild(pageJS, tmpPageJS);
            }
            else {
                head.appendChild(pageJS);
            }
            var timeoutLoadJS = setTimeout(function () {
                clearTimeout(timeoutLoadJS);
                if (successCallback && (typeof(successCallback) == 'function')) {
                    successCallback();
                }
            }, 300);
        }
        else {
            //METHOD 2: Load content script in file
            var nodePageJS = document.getElementById("pageJS");
            while (nodePageJS.firstChild) {
                nodePageJS.removeChild(nodePageJS.firstChild);
            }
            var xhr;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            var pathFullOfFile;
            if (CONST_BROWSER_MODE) {
                pathFullOfFile = (gDeviceWWWFolder.length == 0) ? ('./pages/' + page + '.js'/* + '?id=' + gLoadPageID*/) : (gDeviceWWWFolder + 'pages/' + page + '.js'/* + '?id=' + gLoadPageID*/);
            }
            else {
                pathFullOfFile = (gDeviceWWWFolder.length == 0) ? ('./pages/' + page + '.js') : (gDeviceWWWFolder + 'pages/' + page + '.js');
            }
            //var pathFullOfFile = (gDeviceWWWFolder.length == 0) ? ('./pages/' + page + '.js') : (gDeviceWWWFolder + 'pages/' + page + '.js');
            xhr.open("GET", pathFullOfFile); //assuming kgr.bss is plaintext
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && ((xhr.status == 200) || (xhr.status == 0))) {
                    var script = document.createElement("script");
                    script.type = 'text/javascript';
                    script.innerHTML = xhr.responseText;
                    nodePageJS.appendChild(script);
                    if (successCallback && (typeof(successCallback) == 'function')) {
                        successCallback();
                    }
                }
                else if (isLoadPageFailStatus(xhr.status)) {
                    logInfo("Page Javascript not found");
                    if (failCallback && (typeof(failCallback) == 'function')) {
                        failCallback();
                    }
                }
                else {
                    //for testing
                    logInfo("XHR status: " + xhr.status + "readyState: " + xhr.readyState + " pape javascript: " + page + " not ready!");
                }
            };
            // no-cache
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.send();
        }
    }
}

function loadPageXsl(page, haveJs, isInit, successCallback, failCallback) {
    //alert(page);
    //fix bug on iPad
    //var isIPad = navigator.userAgent.match(/iPad/i);
    //if(isIPad) windowScrollToTop();
    windowScrollToTop();
    showMaskSlideMenu(false);

    //show loading page indicator
    var tabHostMsgNode = document.getElementById('tabHostFailMsg');
    var tabHostIndicatorNode = document.getElementById('tabHostIndicator');
    var tabHostLoadingMsgNode = document.getElementById('tabHostLoadingMsg');
    var tabHostPageNode = document.getElementById('tabHost');

    //load page indicator
    tabHostMsgNode.style.display = 'none';
    tabHostIndicatorNode.style.display = '';
    tabHostLoadingMsgNode.style.display = 'none';
    if (timeToShowLoadingMsg) clearTimeout(timeToShowLoadingMsg);
    if (timeOutLoadTabHost) clearTimeout(timeOutLoadTabHost);
    timeToShowLoadingMsg = setTimeout(function () {
        clearTimeout(timeToShowLoadingMsg);
        tabHostLoadingMsgNode.style.display = 'block';
        tabHostLoadingMsgNode.innerHTML = CONST_STR.get('ERR_LOADING_PAGE_MSG');
    }, CONST_TIME_OUT_LOAD_PAGE_MSG * 1000);
    timeOutLoadTabHost = setTimeout(function () {
        clearTimeout(timeOutLoadTabHost);
        if (tabHostIndicatorNode.style.display != 'none') {
            tabHostMsgNode.innerHTML = CONST_STR.get('ERR_LOAD_PAGE_FAIL_CONTENT');
            tabHostMsgNode.style.display = '';
            tabHostPageNode.innerHTML = '';
        }
        tabHostIndicatorNode.style.display = 'none';
    }, CONST_TIME_OUT_LOAD_PAGE * 1000);
    tabHostPageNode.style.display = 'none';

    if (gModeScreenView == CONST_MODE_SCR_SMALL) closeAllSlideMenu();
    //if(currentPage != 'login-scr') closeAllSlideMenu();
    var tmpStatusNoCachePage = navCheckPageNoCache(page);

    //if ((currentPage != page) || (currentPage == navController.getDefaultPage()) || tmpStatusNoCachePage) {
    cachePageHTML(currentPage);

    //event start unload page
    if (typeof(window['viewWillUnload']) == 'function') {
        window['viewWillUnload']();
        setTimeout(function () {
            window['viewWillUnload'] = null;
        }, 10);
    }
    //event start unload page
    document.dispatchEvent(evtStartUnloadPage);

    if (isInit || (navCachedPages[page] == undefined) || (navCachedPages[page] == null) || !navCachedXsl[page] || (currentPage == navController.getDefaultPage()) || tmpStatusNoCachePage) {
        tabHostPageNode.innerHTML = '';

        var xhr;
        if (window.ActiveXObject) {
            xhr = new ActiveXObject("Msxml2.XMLHTTP"); //("Microsoft.XMLHTTP");//
        }
        else if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        }
        var pathFullOfFile;
        if (CONST_BROWSER_MODE) {
            pathFullOfFile = (gDeviceWWWFolder.length == 0) ? ('./pages/' + page + '.xsl'/* + '?id=' + gLoadPageID*/) : (gDeviceWWWFolder + 'pages/' + page + '.xsl'/* + '?id=' + gLoadPageID*/);
        }
        else {
            pathFullOfFile = (gDeviceWWWFolder.length == 0) ? ('./pages/' + page + '.xsl') : (gDeviceWWWFolder + 'pages/' + page + '.xsl');
        }
        //var pathFullOfFile = (gDeviceWWWFolder.length == 0) ? ('./pages/' + page + '.xsl') : (gDeviceWWWFolder + 'pages/' + page + '.xsl');
        var tmpString = getCurrentTime();
        xhr.open("GET", pathFullOfFile); //assuming kgr.bss is plaintext

        xhr.onreadystatechange = function () {
            if ((xhr.readyState == 4) && ((xhr.status == 200) || (xhr.status == 0))) {
                logInfo("pape Xsl: " + page + " is ready!");

                if (xhr.responseXML == undefined || xhr.responseXML == null) {
                    logInfo('XSL is incorrect format or not exist');
                    if (typeof(failCallback) == 'function') {
                        failCallback();
                    }
                    return;
                }
                //save js status
                hasPageJS = haveJs;

                setCachePageXsl(page, xhr.responseXML);
                loadJSfile(page, haveJs, function () {
                    //hide page indicator
                    tabHostIndicatorNode.style.display = 'none';
                    clearTimeout(timeOutLoadTabHost);

                    var tmpXmlData = "";
                    var timeInitXml = setTimeout(function () {
                        clearTimeout(timeInitXml);
                        if (typeof(window['loadInitXML']) == 'function') {
                            tmpXmlData = window['loadInitXML']();
                            setTimeout(function () {
                                window['loadInitXML'] = null;
                            }, 10);
                        }
                        fadeInMainContentScreen();
                        tabHostPageNode.style.display = '';
                        navInitPageFromXmlAndXsl(page, tmpXmlData, xhr.responseXML, true, isInit, function () {
                            if (successCallback && (typeof(successCallback) == 'function')) {
                                successCallback();
                            }
                        }); //stringtoXML(tmpXmlData)
                    }, 50);
                }, function () {
                    logInfo("Page: " + page + " not found!!!");
                    tabHostIndicatorNode.style.display = 'none';
                    clearTimeout(timeOutLoadTabHost);
                    tabHostMsgNode.innerHTML = CONST_STR.get('ERR_LOAD_PAGE_FAIL_CONTENT');
                    tabHostMsgNode.style.display = '';
                });
            }
            else if (isLoadPageFailStatus(xhr.status)) {
                logInfo("Page Xsl: " + page + " not found!!!");
                tabHostIndicatorNode.style.display = 'none';
                clearTimeout(timeOutLoadTabHost);
                tabHostMsgNode.innerHTML = CONST_STR.get('ERR_LOAD_PAGE_FAIL_CONTENT');
                tabHostMsgNode.style.display = '';
            }
            else {
                //for testing
                //logInfo("XHR status: " + xhr.status + "readyState: " + xhr.readyState + " pape: " + page + " not ready!");
            }
        };

        //no-cache
        xhr.setRequestHeader("Cache-Control", "no-cache,max-age=0");
        xhr.setRequestHeader("Pragma", "no-cache");
        xhr.send("");
    }
    else {
        //fix cache check box
        var nodeTxts = document.getElementsByTagName("input");
        for (var nx = 0; nx < nodeTxts.length; nx++) {
            var tmpNodeTxt = nodeTxts[nx];
            if (tmpNodeTxt.type == "checkbox") {
                tmpNodeTxt.checked = (tmpNodeTxt.value == 'true') ? true : false;
            }
        }

        //Add change language
        //changeLanguageInView();

        //save js status
        hasPageJS = haveJs;
        //currentPage = page;

        fadeInMainContentScreen();
        tabHostPageNode.style.display = '';
        loadJSfile(page, haveJs, function () {

            var tmpXmlData = "";
            var tmpXslData = getCachePageXsl(page);
            setTimeout(function () {
                if (typeof(window['loadInitXML']) == 'function') {
                    tmpXmlData = window['loadInitXML']();
                    setTimeout(function () {
                        window['loadInitXML'] = null;
                    }, 10);
                }
                navInitPageFromXmlAndXsl(page, tmpXmlData, tmpXslData, true, isInit, function () {
                    //hide page indicator
                    tabHostIndicatorNode.style.display = 'none';
                    clearTimeout(timeOutLoadTabHost);

                    if (successCallback && (typeof(successCallback) == 'function')) {
                        successCallback();
                    }
                }, function () {
                    tabHostIndicatorNode.style.display = 'none';
                    clearTimeout(timeOutLoadTabHost);
                    tabHostMsgNode.innerHTML = CONST_STR.get('ERR_LOAD_PAGE_FAIL_CONTENT');
                    tabHostMsgNode.style.display = '';
                }); //stringtoXML(tmpXmlData)
            }, 10);
        }, function () {
            logInfo("Page: " + page + " not found!!!");
            tabHostIndicatorNode.style.display = 'none';
            clearTimeout(timeOutLoadTabHost);
            tabHostMsgNode.innerHTML = CONST_STR.get('ERR_LOAD_PAGE_FAIL_CONTENT');
            tabHostMsgNode.style.display = '';
        });
    }
    //}
}

function navInitPageFromXmlAndXsl(page, iXml, inXsl, statusCache, isInit, successCallback, failCallback) {
    var inXml = iXml;
    if (!validateXml(inXml)) {
        if (failCallback && typeof(failCallback) == 'function') {
            failCallback();
        }
        return "";
    }
    if ((inXml == undefined) || (inXml == "")) {
        inXml = createXMLDoc();
        if (!window.ActiveXObject) createXMLNode('root', '', inXml);
        //inXml = createXMLNode('root', '', tmpDoc);
        //inXml = document.implementation.createDocument(null, "root", null);
    }
    //window.scrollTo(0,0);
    if (gModeScreenView == CONST_MODE_SCR_SMALL) closeAllSlideMenu();
    //if(currentPage != 'login-scr') closeAllSlideMenu();
    var tmpStatusNoCachePage = navCheckPageNoCache(page);

    //if ((currentPage != page) || (currentPage == navController.getDefaultPage()) || tmpStatusNoCachePage) {
    if (isInit || ((navCachedPages[page] == undefined) || (navCachedPages[page] == null)) || (currentPage == navController.getDefaultPage()) || tmpStatusNoCachePage) {
        currentPage = page;

        if (window.ActiveXObject || "ActiveXObject" in window) {// || xhttpIE.responseType == "msxml-document") {
            // Load XML
            var xml = new ActiveXObject("Microsoft.XMLDOM");
            xml.async = false;
            xml.load(inXml);

            // Load the XSL
            var xsl = new ActiveXObject("Microsoft.XMLDOM");
            xsl.async = false;
            xsl.load(inXsl);
            var ex = xml.transformNode(xsl)
            //var ex = inXml.transformNode(inXsl);
            if ((ex == undefined) || (ex == null)) {
                if (failCallback && typeof(failCallback) == 'function') {
                    failCallback();
                }
                return "";
            }
            var timePageLoad = setTimeout(function () {
                clearTimeout(timePageLoad);
                document.getElementById("tabHost").innerHTML = ex;
                //document.getElementById('tabHost').style.opacity = 1;
                cachePageHTML(page);
                changeLanguageInView();
                setTimeout(function () {
                    applyDynamicCommonStyleSheet();
                    applyDynamicPageStyleSheet(true);
                }, 300);

                var timePageEvent = setTimeout(function () {
                    clearTimeout(timePageEvent);
                    if (successCallback && (typeof(successCallback) == 'function')) {
                        successCallback();
                    }
                    if (typeof(window['viewDidLoadSuccess']) == 'function') {
                        window['viewDidLoadSuccess']();
                        setTimeout(function () {
                            window['viewDidLoadSuccess'] = null;
                            resizeMainViewContent(page);
                        }, 10)
                    }
                    //using with page load has delegate
                    document.dispatchEvent(evtLoadPageSuccess);

                    handleKeyboardShowAndHidden();
                }, 50);
            }, 300);
        }
        // code for Chrome, Firefox, Opera, etc.
        else if (document.implementation && document.implementation.createDocument) {
            var xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(inXsl);
            var resultDocument = xsltProcessor.transformToFragment(inXml, document);
            if ((resultDocument == undefined) || (resultDocument == null)) {
                if (failCallback && typeof(failCallback) == 'function') {
                    failCallback();
                }
                return "";
            }
            var xmlAsString = new XMLSerializer().serializeToString(resultDocument);
            document.getElementById("tabHost").innerHTML = xmlAsString;
            //document.getElementById('tabHost').style.opacity = 1;
            cachePageHTML(page);
            changeLanguageInView();
            setTimeout(function () {
                applyDynamicCommonStyleSheet();
                applyDynamicPageStyleSheet(true);
            }, 300);

            var timePageEvent = setTimeout(function () {
                clearTimeout(timePageEvent);
                if (successCallback && (typeof(successCallback) == 'function')) {
                    successCallback();
                }
                if (typeof(window['viewDidLoadSuccess']) == 'function') {
                    window['viewDidLoadSuccess']();
                    setTimeout(function () {
                        window['viewDidLoadSuccess'] = null;
                        resizeMainViewContent(page);
                    }, 10)
                }
                //using with page load has delegate
                document.dispatchEvent(evtLoadPageSuccess);

                handleKeyboardShowAndHidden();
            }, 50);
        }
        else {
            logInfo('Browser not support init ' + page + 'from XML and XSL');
            document.getElementById('tabHost').style.opacity = 1;
            if (failCallback && typeof(failCallback) == 'function') {
                failCallback();
            }
            return "";
        }
    }
    else {
        currentPage = page;

        document.getElementById('tabHost').innerHTML = navCachedPages[page];
        //document.getElementById('tabHost').style.opacity = 1;

        //fix cache check box
        var nodeTxts = document.getElementsByTagName("input");
        for (var nx = 0; nx < nodeTxts.length; nx++) {
            var tmpNodeTxt = nodeTxts[nx];
            if (tmpNodeTxt.type == "checkbox") {
                tmpNodeTxt.checked = (tmpNodeTxt.value == 'true') ? true : false;
            }
            if (isInit) {
                if (tmpNodeTxt.type == "number" || tmpNodeTxt.type == "password" || tmpNodeTxt.type == "tel" || tmpNodeTxt.type == "text") {
                    tmpNodeTxt.value = '';
                }
            }
        }

        //remove all cache text
        if (isInit) {
            var textareaList = document.getElementsByTagName("textarea");
            for (var i = 0; i < textareaList.length; i++) {
                var textArea = textareaList[i];
                textArea.value = '';
            }
        }

        //Add change language
        changeLanguageInView();
        //save js status
        //hasPageJS = haveJs;
        currentPage = page;

        var timePageEvent = setTimeout(function (e) { //fix on windows phone
            clearTimeout(timePageEvent);
            setTimeout(function () {
                applyDynamicCommonStyleSheet();
                applyDynamicPageStyleSheet(true);
            }, 300);

            if (successCallback && (typeof(successCallback) == 'function')) {
                successCallback();
            }
            if (typeof(window['viewDidLoadSuccess']) == 'function') {
                window['viewDidLoadSuccess']();
                setTimeout(function () {
                    window['viewDidLoadSuccess'] = null;
                    resizeMainViewContent(page);
                }, 10);
            }
            //using with page load has delegate
            document.dispatchEvent(evtLoadPageSuccess);

            handleKeyboardShowAndHidden();
        }, 50);
    }
    //}
}

function fadeOutMainContentScreen() {
    document.getElementById('tabHost').style.opacity = 0;
}

function fadeInMainContentScreen() {
    if (prePage != 'login-scr' && prePage != '') {
        /*console.log("khanhduy.le : init subview");
        document.getElementById('tabHost').style.opacity = 1;
        var eMain = document.getElementById('tabHost');
        if (mainview) {
            var slideEffect;
            if (slideEffect) {
                clearTimeout(slideEffect);
                slideEffect = null;
            }

            eMain.classList.remove('page-on-center');
            eMain.classList.remove('page-on-right');
            eMain.classList.remove('page-on-left');
            eMain.classList.add("page-from-right-to-center");

            slideEffect = setTimeout(function () {
                eMain.classList.remove('page-from-right-to-center');
                eMain.classList.add("page-on-center");
            }, 300);
        }*/
        var timeFadeInEffect;
        if (timeFadeInEffect) {
            clearTimeout(timeFadeInEffect);
            timeFadeInEffect = null;
        }
        document.getElementById('tabHost').style.opacity = 0;
        timeFadeInEffect = setTimeout(function () {
            document.getElementById('tabHost').style.opacity = 1;
        }, 400);
    } else {
        var timeFadeInEffect;
        if (timeFadeInEffect) {
            clearTimeout(timeFadeInEffect);
            timeFadeInEffect = null;
        }
        document.getElementById('tabHost').style.opacity = 0;
        timeFadeInEffect = setTimeout(function () {
            document.getElementById('tabHost').style.opacity = 1;
        }, 400);
    }
}
//ngocdt3 bo sung them scroll to
function genHTMLStringWithXMLScrollto(inXml, inXsl, successCallback, failCallback, notUpdateScroll, el) {
    if ((inXml == undefined) || (inXml == "")) {
        inXml = createXMLDoc();
        if (!window.ActiveXObject) createXMLNode('root', '', inXml);
    }
    if (window.ActiveXObject || "ActiveXObject" in window) { // || xhttp.responseType == "msxml-document") {
        // Load XML
        var xml = new ActiveXObject("Microsoft.XMLDOM");
        xml.async = false;
        xml.load(inXml);

        // Load the XSL
        var xsl = new ActiveXObject("Microsoft.XMLDOM");
        xsl.async = false;
        xsl.load(inXsl);
        var ex = xml.transformNode(xsl)
        //var ex = inXml.transformNode(inXsl);
        if ((ex == undefined) || (ex == null)) {
            if (failCallback && typeof(failCallback) == 'function') {
                failCallback();
            }
            return "";
        }
        else {
            var timePageLoad = setTimeout(function () {
                clearTimeout(timePageLoad);
                if (successCallback && typeof(successCallback) == 'function') {
                    successCallback(ex);
                }
                changeLanguageInView();
            }, 10);
        }
    }
    // code for Chrome, Firefox, Opera, etc.
    else if (document.implementation && document.implementation.createDocument) {
        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(inXsl);
        var resultDocument = xsltProcessor.transformToFragment(inXml, document);
        if ((resultDocument == undefined) || (resultDocument == null)) {
            if (failCallback && typeof(failCallback) == 'function') {
                failCallback();
            }
            return "";
        }
        else {
            var timePageLoad = setTimeout(function () {
                clearTimeout(timePageLoad);
                if (successCallback && typeof(successCallback) == 'function') {
                    var xmlAsString = new XMLSerializer().serializeToString(resultDocument);
                    //logInfo(xmlAsString);
                    successCallback(xmlAsString);
                }
                changeLanguageInView();
            }, 10);
        }
    }
    else {
        logInfo('Browser not support init page from XML and XSL');
        if (failCallback && typeof(failCallback) == 'function') {
            failCallback();
        }
        return "";
    }
}
//ngocdt3 end
function genHTMLStringWithXML(inXml, inXsl, successCallback, failCallback, notUpdateScroll) {
    if ((inXml == undefined) || (inXml == "")) {
        inXml = createXMLDoc();
        if (!window.ActiveXObject) createXMLNode('root', '', inXml);
    }
    if (window.ActiveXObject || "ActiveXObject" in window) { // || xhttp.responseType == "msxml-document") {
        // Load XML
        var xml = new ActiveXObject("Microsoft.XMLDOM");
        xml.async = false;
        xml.load(inXml);

        // Load the XSL
        var xsl = new ActiveXObject("Microsoft.XMLDOM");
        xsl.async = false;
        xsl.load(inXsl);
        var ex = xml.transformNode(xsl)
        //var ex = inXml.transformNode(inXsl);
        if ((ex == undefined) || (ex == null)) {
            if (failCallback && typeof(failCallback) == 'function') {
                failCallback();
            }
            return "";
        }
        else {
            var timePageLoad = setTimeout(function () {
                clearTimeout(timePageLoad);
                if (successCallback && typeof(successCallback) == 'function') {
                    successCallback(ex);
                }
                changeLanguageInView();
                if ((notUpdateScroll == undefined) || notUpdateScroll) {
                    applyDynamicCommonStyleSheet();
                    applyDynamicPageStyleSheet(true);
                }
            }, 10);
        }
    }
    // code for Chrome, Firefox, Opera, etc.
    else if (document.implementation && document.implementation.createDocument) {
        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(inXsl);
        var resultDocument = xsltProcessor.transformToFragment(inXml, document);
        if ((resultDocument == undefined) || (resultDocument == null)) {
            if (failCallback && typeof(failCallback) == 'function') {
                failCallback();
            }
            return "";
        }
        else {
            var timePageLoad = setTimeout(function () {
                clearTimeout(timePageLoad);
                if (successCallback && typeof(successCallback) == 'function') {
                    var xmlAsString = new XMLSerializer().serializeToString(resultDocument);
                    //logInfo(xmlAsString);
                    successCallback(xmlAsString);
                }
                changeLanguageInView();
                if ((notUpdateScroll == undefined) || notUpdateScroll) {
                    applyDynamicCommonStyleSheet();
                    applyDynamicPageStyleSheet(true);
                }
            }, 10);
        }
    }
    else {
        logInfo('Browser not support init page from XML and XSL');
        if (failCallback && typeof(failCallback) == 'function') {
            failCallback();
        }
        return "";
    }
}

function genXslPageWithXML(inXml, inXsl, successCallback, failCallback) {
    if ((inXml == undefined) || (inXml == "")) {
        inXml = createXMLDoc();
        if (!window.ActiveXObject) createXMLNode('root', '', inXml);
    }
    if (window.ActiveXObject || "ActiveXObject" in window) { // || xhttp.responseType == "msxml-document") {
        // Load XML
        var xml = new ActiveXObject("Microsoft.XMLDOM");
        xml.async = false;
        xml.load(inXml);

        // Load the XSL
        var xsl = new ActiveXObject("Microsoft.XMLDOM");
        xsl.async = false;
        xsl.load(inXsl);
        var ex = xml.transformNode(xsl)
        //var ex = inXml.transformNode(inXsl);
        if ((ex == undefined) || (ex == null)) {
            if (failCallback && typeof(failCallback) == 'function') {
                failCallback();
            }
            return "";
        }
        else {
            var timePageLoad = setTimeout(function () {
                clearTimeout(timePageLoad);
                if (successCallback && typeof(successCallback) == 'function') {
                    successCallback(ex, 'ms');
                }
                changeLanguageInView();
                applyDynamicCommonStyleSheet();
                applyDynamicPageStyleSheet(true);
            }, 10);
        }
    }
    // code for Chrome, Firefox, Opera, etc.
    else if (document.implementation && document.implementation.createDocument) {
        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(inXsl);
        var resultDocument = xsltProcessor.transformToFragment(inXml, document);
        if ((resultDocument == undefined) || (resultDocument == null)) {
            if (failCallback && typeof(failCallback) == 'function') {
                failCallback();
            }
            return "";
        }
        else {
            var timePageLoad = setTimeout(function () {
                clearTimeout(timePageLoad);
                if (successCallback && typeof(successCallback) == 'function') {
                    successCallback(resultDocument, 'webkit');
                }
                changeLanguageInView();
                applyDynamicCommonStyleSheet();
                applyDynamicPageStyleSheet(true);
            }, 10);
        }
    }
    else {
        logInfo('Browser not support init page from XML and XSL');
        if (failCallback && typeof(failCallback) == 'function') {
            failCallback();
        }
        return "";
    }
}

var xhttpIE;
function loadXMLDoc(filename) {
    if (window.ActiveXObject || "ActiveXObject" in window) {
        xhttpIE = new ActiveXObject("Msxml2.XMLHTTP"); //("Microsoft.XMLHTTP");//
        //xhttpIE = new ActiveXObject("Microsoft.XMLDOM");
    }
    else {
        xhttpIE = new XMLHttpRequest();
    }
    var tmpString = getCurrentTime();
    //xhttpIE.open("GET", filename + '?id=' + tmpString, false);
    xhttpIE.open("GET", filename, false);

    //try {xhttpIE.responseType = "msxml-document"} catch(err) {} // Helping IE11
    xhttpIE.send("");
    if (xhttpIE.responseXML) {
        return xhttpIE.responseXML;
    }
    else {
        var tmpStrXml = xhttpIE.responseText;
        var tmpXmlDoc = stringtoXML(tmpStrXml);
        return tmpXmlDoc;
    }
}
function stringtoXML(xmlStr) {
    var parseXml;
    if ((typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) || "ActiveXObject" in window) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    }
    else if (window.DOMParser) {
        return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
    } else {
        return "";
    }
}

function XMLToString(oXML) {
    //code for IE
    if (window.ActiveXObject || 'ActiveXObject' in window) {
        var oString = oXML.xml;
        return oString;
    }
    // code for Chrome, Safari, Firefox, Opera, etc.
    else {
        return (new XMLSerializer()).serializeToString(oXML);
    }
}
//loadXMLDoc('/pages/sample.xml');

/*** CREATE XML DOCUMENT ***/

function createXMLDoc() {
    if (window.ActiveXObject || "ActiveXObject" in window) {
        return new window.ActiveXObject("Microsoft.XMLDOM");
    }
    else if (document.implementation && document.implementation.createDocument) {

        return document.implementation.createDocument(null, "", null);
    }
    else {
        logInfo('browser not support create XML');
    }
}

function setNodeText(inNode, inStr) {
    if (inNode.textContent || inNode.textContent != null) {
        inNode.textContent = inStr;
    }
    else {
        inNode.text = inStr;
    }
}

function createXMLNode(nodeKey, nodeValue, inDocXml, nodeParent) {

    if (typeof(nodeKey) != 'string') return;
    var returnNode;
    if (nodeParent == undefined || nodeParent == null) {
        returnNode = inDocXml.createElement(nodeKey);
        inDocXml.appendChild(returnNode);
    }
    else {
        returnNode = inDocXml.createElement(nodeKey);
        nodeParent.appendChild(returnNode);
    }
    if (nodeValue != undefined && nodeValue != null) {
        setNodeText(returnNode, nodeValue);
    }
    return returnNode;
}

/*** CREATE XML DOCUMENT END ***/

function validateXml(inXml) {
    /*var oParser;
     var oDOM;
     if (window.DOMParser)
     {
     oParser = new DOMParser();
     oDOM = oParser.parseFromString(inXml,"text/xml");
     }
     else // code for IE
     {
     oDOM = new ActiveXObject("Microsoft.XMLDOM");
     oDOM.async=false;
     oDOM.loadXML(inXml);
     }
     //var oParser = new DOMParser();
     //var oDOM = oParser.parseFromString(inXml, "application/xml");
     // print the name of the root element or error message
     var tmpStr = oDOM.documentElement.firstChild.nodeName;
     if(tmpStr=='parsererror') {
     logInfo('Validate XML error: ' + oDOM.documentElement.innerHTML);
     return false;
     }
     else */
    return true;
}

function cachePageHTML(page) {
    var nodeTabHost = document.getElementById("tabHost");
    if (page == "login-scr") {
        navCachedPages = null; //clear
        navCachedPages = {}; //create
    }
    else {
        var nodeTxts = document.getElementById("tabHost").getElementsByTagName("input");
        for (var nx = 0; nx < nodeTxts.length; nx++) {
            var tmpNodeTxt = nodeTxts[nx];
            if ((tmpNodeTxt.type == "text") || (tmpNodeTxt.type == "tel") || (tmpNodeTxt.type == "button")) {
                tmpNodeTxt.setAttribute("value", tmpNodeTxt.value);
            }
            else if (tmpNodeTxt.type == "checkbox") { //fix bug cache for check box
                tmpNodeTxt.setAttribute("value", tmpNodeTxt.checked);
            }
        }
        nodeTxts = document.getElementById("tabHost").getElementsByTagName("textarea");
        for (var nx = 0; nx < nodeTxts.length; nx++) {
            var tmpNodeTxt = nodeTxts[nx];
            tmpNodeTxt.innerHTML = tmpNodeTxt.value;
        }
        var tmpStatusNoCachePage = navCheckPageNoCache(page);
        if (!tmpStatusNoCachePage) {
            navCachedPages[page] = nodeTabHost.innerHTML;
        }
    }
}

/*** Cache XSL file ***/
function setCachePageXsl(page, inXsl) {
    if (page == "login-scr") {
        navCachedXsl = null; // clear
        navCachedXsl = {}; //create
    }
    else {
        navCachedXsl[page] = inXsl;
    }
}
function getCachePageXsl(page) {
    if ((navCachedXsl[page] == undefined) || (navCachedXsl[page] == null)) {
        //return "";
        //var pathFullOfFile = (gDeviceWWWFolder.length == 0) ? ('./pages/' + page + '.xsl') : (gDeviceWWWFolder + 'pages/' + page + '.xsl');
        var pathFullOfFile;
        if (CONST_BROWSER_MODE) {
            pathFullOfFile = (gDeviceWWWFolder.length == 0) ? ('./pages/' + page + '.xsl'/* + '?id=' + gLoadPageID*/) : (gDeviceWWWFolder + 'pages/' + page + '.xsl'/* + '?id=' + gLoadPageID*/);
        }
        else {
            pathFullOfFile = (gDeviceWWWFolder.length == 0) ? ('./pages/' + page + '.xsl') : (gDeviceWWWFolder + 'pages/' + page + '.xsl');
        }
        var tmpXMLDoc = loadXMLDoc(pathFullOfFile);
        if (tmpXMLDoc != undefined) navCachedXsl[page] = tmpXMLDoc;
        return tmpXMLDoc;
    }
    else {
        return navCachedXsl[page];
    }
}
function checkCachePageXsl(page) {
    for (var tmpPage in navCachedXsl) {
        if (tmpPage == page) return true;
    }
    return false;
}
/*** Cache XSL file end ***/

function showSlideMenu() {
    if (gIsLogin&&gModeScreenView == CONST_MODE_SCR_SMALL) {
        if (!interlockStatus && !contentPromotion.isOpen) { //content.toggle();
            if (content.container) {
                content.toggle();
            }
        }
        displayMenuSection(content.isOpen)
        setInterlockEnable();
    }
}

/*** LOAD PAGE END ***/

/*** NAVIGATION CONTROLLER ***/

var navArrayScr = new Array();
var navData = {};
var navCachedPages = {};
var navArrayOldScr = new Array();
var navExceptionPages = ['com-input-account', 'bankinfo/bank-info-tpb-atm-map', 'com-input-payee-account'];
var navPageBottomId = {};
var navPageNoCache = ['credit/guarantee/create/cre_request_create_checklist','credit/guarantee/cre-guarantee-suggest-scr-view'];

var navCachedXsl = {};
var navPageMode = 'html';
var navDefaultPage = 'login-scr';
var navDefaultPageType = '';

var navController = {
    setDefaultPage:function (inPage, inType) {
        navDefaultPage = inPage;
        (inType == undefined) ? navDefaultPageType = '' : navDefaultPageType = inType;
    },
    getDefaultPage:function () {
        return navDefaultPage;
    },
    getDefaultPageType:function () {
        return navDefaultPageType;
    },
    initWithRootView: function (pageView, jsStatus, inType, successCallback, failCallback) {
        prePage = pageView;
        if (hasMenuScrollEvent) {
            hasMenuScrollEvent = false;
            return;
        }
        navArrayOldScr = navArrayScr.slice(0);
        //clear cache --> disable cache all
        navRemoveAll();

        if (inType == undefined) {
            navInitWithRootView(pageView, jsStatus, successCallback, failCallback);

            return;
        }
        switch (inType) {
            case navPageMode[1]:
            {
                navInitWithRootViewXsl(pageView, jsStatus, successCallback, failCallback);
                break;
            }
            default:
            {
                navInitWithRootView(pageView, jsStatus, successCallback, failCallback);
                break;
            }
        }
        actionbar.initActionBarAddPopAll(pageView);
        //haidt1 sửa lại
        if (pageView != 'homepage/homepage-dynamic-scr'){
            bottomBar.initBottomBar(pageView);
        }
    },
    pushToView: function (pageView, jsStatus, inType, successCallback) {
        prePage = pageView;
        if (inType == undefined || inType == null || inType == '') {
            navPushToView(pageView, jsStatus);
            actionbar.initActionBarAddBackStack(pageView);
            bottomBar.initBottomBar(pageView);
            return;
        }
        switch (inType) {
            case navPageMode[1]:
            {
                navPushToViewXsl(pageView, jsStatus, true, successCallback);
                break;
            }
            default:
            {
                navPushToView(pageView, jsStatus);
                break;
            }
        }
        actionbar.initActionBarAddBackStack(pageView);
        bottomBar.initBottomBar(pageView);
    },
    pushToViewAndRemoveOtherPage: function (pageView, otherPage, inID, jsStatus, inType, successCallback) {
        //remove page
        var index = -1;
        for (var j = 0; j < otherPage.length; j++) {
            for (var i = 0; i < navArrayScr.length ; i++) {
                if (navArrayScr[i] == otherPage[j].src) {
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                navRemovePageAtIndex(index);
            }
        }

        //push view
        prePage = pageView;
        if (inType == undefined || inType == null || inType == '') {
            navPushToView(pageView, jsStatus);
            return;
        }
        switch (inType) {
            case navPageMode[1]:
                {
                    navPushToViewXsl(pageView, jsStatus, true ,successCallback);
                    break;
                }
            default:
                {
                    navPushToView(pageView, jsStatus);
                    break;
                }
        }
        actionbar.initActionBarAddBackStack(pageView);
        bottomBar.initBottomBarOnlyText(pageView, otherPage, inID);
    },
    pushToViewAndRemoveAllOtherPageAndInitBottomBar: function (pageView, otherPage, inID, arrBottom, jsStatus, inType, successCallback) {
        //remove page
        var index = -1;
        for (var i = 0; i < navArrayScr.length ; i++) {
            if (navArrayScr[i] == otherPage) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            while (navArrayScr.length > index){
                navRemovePageAtIndex(navArrayScr.length-1);
            }
        }
        //push view
        prePage = pageView;
        if (inType == undefined || inType == null || inType == '') {
            navPushToView(pageView, jsStatus);
            return;
        }
        switch (inType) {
            case navPageMode[1]:
                {
                    navPushToViewXsl(pageView, jsStatus, true ,successCallback);
                    break;
                }
            default:
                {
                    navPushToView(pageView, jsStatus);
                    break;
                }
        }
        actionbar.initActionBarAddBackStack(pageView);
        navPageBottomId[pageView] = inID;
        bottomBar.initBottomBarWithButton(pageView, arrBottom, inID);
    },
    popView:function (jsStatus) {
        hiddenKeyBoard();
        navPopView(jsStatus);
    },
    popViewInit: function (jsStatus) {
        hiddenKeyBoard();
        navPopViewInit(jsStatus);
    },
    popToRootView:function (jsStatus) {
        navPopToRootView(jsStatus);
    },
    popToView:function (pageView, jsStatus) {
        navPopToView(pageView, jsStatus);
    },
    popToViewInit:function (pageView, jsStatus) {
        navPopToViewInit(pageView, jsStatus);
    },
    removePageAtIndex:function (indx) {
        navRemovePageAtIndex(indx);
    },
    resetAll:function () {
        navRemoveAll();
    },
    resetBranchView:function (jsStatus) {
        navResetBranchView(jsStatus);
    },
    resetCacheBranch:function () {
        if (navArrayOldScr != undefined && navArrayOldScr != null) {
            for (var i = 0; i < navArrayOldScr.length; i++) {
                delete navCachedPages[navArrayOldScr[i]];// = null;
            }
            delete navData[navArrayOldScr[0]];// = null;
        }
        else {
            if (navArrayOldScr != undefined && navArrayOldScr != null && navArrayOldScr[0] != undefined) {
                delete navData[navArrayOldScr[0]];// = null;
            }
        }
        //navArrayScr = new Array();
    },
    initWithRootViewNoCache:function (pageView, jsStatus, inType) {
        if (navArrayOldScr != undefined && navArrayOldScr != null) {
            for (var i = 0; i < navArrayOldScr.length; i++) {
                delete navCachedPages[navArrayOldScr[i]];// = null;
            }
            delete navData[navArrayOldScr[0]];// = null;
        }
        else {
            if (navArrayOldScr != undefined && navArrayOldScr != null && navArrayOldScr[0] != undefined) {
                delete navData[navArrayOldScr[0]];// = null;
            }
        }
        navArrayScr = new Array();

        if (inType == undefined) {
            navInitWithRootView(pageView, jsStatus);
            return;
        }
        switch (inType) {
            case navPageMode[1]:
            {
                navInitWithRootViewXsl(pageView, jsStatus);
                break;
            }
            default:
            {
                navInitWithRootView(pageView, jsStatus);
                break;
            }
        }
    },
    initBottomBarWithCallBack:function(pageView, arrBottom, inID, callBack,allowActive){
        navPageBottomId[pageView] = inID;
        this.getBottomBar().initBottomBarWithButtonCallBack(pageView, arrBottom, inID, callBack,allowActive);
    },
    initBottomBarOnlyText: function (page,arrBottom, inID) {
        for (var i = 0; i < arrBottom.length ; i++) {
            navPageBottomId[arrBottom[i].src] = inID;
        }
        this.getBottomBar().initBottomBarOnlyText(page, arrBottom, inID);
    },
    getBottomBar : function (){
        return bottomBar;
    },
    getActionBar : function(){
        return actionbar;
    },
    getCurrentPage : function(){
        return navArrayScr[navArrayScr.length - 1];

    },
    resizeMainViewContent : function(page){
        resizeMainViewContent(page);
    },
    countCurrentView: getCountCurrentView,
    removePageInCache: function (removePages) {
        if (removePages.constructor === Array) {
            for (var iii = 0; iii < removePages.length ; iii++) {
                var index = -1;
                for (var i = 0; i < navArrayScr.length ; i++) {
                    if (navArrayScr[i] == removePages[iii]) {
                        index = i;
                        break;
                    }
                }
                if (index != -1) {
                    navRemovePageAtIndex(index);
                }
            }
        } else {
            var index = -1;
            for (var i = 0; i < navArrayScr.length ; i++) {
                if (navArrayScr[i] == removePages) {
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                navRemovePageAtIndex(index);
            }
        }
    }
}

function getCountCurrentView() {
    if (navArrayScr) {
        return navArrayScr.length;
    } else {
        return 0;
    }
}

function getNumOfObjs(inObj) {
    return Object.keys(inObj).length;
}

function navInitWithRootView(pageView, jsStatus, successCallback, failCallback) {

    //var tmpArr = navData[pageView];
    //if ((tmpArr == undefined) || (tmpArr == null)) {
    tmpArr = new Array();
    tmpArr[0] = pageView;
    navData[pageView] = tmpArr;
    navArrayScr = new Array();
    navArrayScr = tmpArr;
    loadPage(navArrayScr[0], jsStatus, successCallback, failCallback);
    /*}
     else {
     //remove cached exception page
     var tmpStatus = false;
     for (var i = (tmpArr.length - 1); i > 0; i--) {
     for (var j = 0; j < navExceptionPages.length; j++) {
     if (tmpArr[i] == navExceptionPages[j]) {
     tmpArr.pop();
     tmpStatus = true;
     }
     }
     if (tmpStatus) {
     tmpStatus = false;
     }
     else {
     navData[pageView] = tmpArr;
     break;
     }
     }
     var tmpStatusNoCachePage = navCheckPageNoCache(navArrayScr[0]);

     //call last page of branch
     navArrayScr = new Array();
     navArrayScr = tmpArr;
     if(tmpStatusNoCachePage) {
     loadPage(navArrayScr[0], jsStatus);
     }
     else {
     loadPage(navArrayScr[navArrayScr.length - 1], jsStatus);
     }
     }*/
}

function navInitWithRootViewXsl(pageView, jsStatus, successCallback, failCallback) {

    //var tmpArr = navData[pageView];
    //var tmpXslStatus = checkCachePageXsl(navArrayScr[navArrayScr.length - 1]);
    //if ((tmpArr == undefined) || (tmpArr == null)) {
    tmpArr = new Array();
    tmpArr[0] = pageView;
    navData[pageView] = tmpArr;
    navArrayScr = new Array();
    navArrayScr = tmpArr;
    loadPageXsl(navArrayScr[0], jsStatus,true, successCallback, failCallback);
    /*}
     else {
     //remove cached exception page
     var tmpStatus = false;
     for (var i = (tmpArr.length - 1); i > 0; i--) {
     for (var j = 0; j < navExceptionPages.length; j++) {
     if (tmpArr[i] == navExceptionPages[j]) {
     tmpArr.pop();
     tmpStatus = true;
     }
     }
     if (tmpStatus) {
     tmpStatus = false;
     }
     else {
     navData[pageView] = tmpArr;
     break;
     }
     }

     var tmpStatusNoCachePage = navCheckPageNoCache(navArrayScr[0]);

     //call last page of branch
     navArrayScr = new Array();
     navArrayScr = tmpArr;

     if(tmpStatusNoCachePage) {
     loadPageXsl(navArrayScr[0], jsStatus);
     }
     else {
     loadPageXsl(navArrayScr[navArrayScr.length - 1], jsStatus);
     }
     }*/
}

function navPushToView(pageView, jsStatus) {
    if (pageView != navArrayScr[navArrayScr.length - 1]) {
        navArrayScr.push(pageView);
        navData[navArrayScr[0]] = navArrayScr;
        loadPage(pageView, jsStatus);
    }
}

function navPushToViewXsl(pageView, jsStatus, isInit , successCallback) {
    if (pageView != navArrayScr[navArrayScr.length - 1]) {
        navArrayScr.push(pageView);
        navData[navArrayScr[0]] = navArrayScr;
        var tmpXslStatus = checkCachePageXsl([navArrayScr.length - 1]);
        loadPageXsl(pageView, jsStatus, isInit, successCallback);
    }
}

function navPopView(jsStatus) {
    if (navArrayScr.length < 2) {
        var tmpXslStatus = checkCachePageXsl(navArrayScr[0]);
        if (tmpXslStatus) {
            loadPageXsl(navArrayScr[0], jsStatus, false);
        }
        else {
            loadPage(navArrayScr[0], jsStatus);
        }
    }
    else {
         var btnHome = document.getElementById('nav.btn.homeright');
         if(btnHome!=undefined&&gModeScreenView==CONST_MODE_SCR_SMALL){
              btnHome.style.display ='none';
         }

        navArrayScr.pop(); //ngocdt3 comment
        navData[navArrayScr[0]] = navArrayScr;
        var tmpXslStatus = checkCachePageXsl(navArrayScr[navArrayScr.length - 1]);
        if (tmpXslStatus) {
            loadPageXsl(navArrayScr[navArrayScr.length - 1], jsStatus, false, function () {
                if (typeof (window['viewBackFromOther']) == 'function') {
                    window['viewBackFromOther']();
                    setTimeout(function () {
                        window['viewBackFromOther'] = null;
                    }, 10)
                }
            });
            actionbar.resumeView(navArrayScr[navArrayScr.length - 1]);
            bottomBar.resumeView(navArrayScr[navArrayScr.length - 1], navPageBottomId[navArrayScr[navArrayScr.length - 1]]);
        }
        else {
            loadPage(navArrayScr[navArrayScr.length - 1], jsStatus, function () {
                if (typeof (window['viewBackFromOther']) == 'function') {
                    window['viewBackFromOther']();
                    setTimeout(function () {
                        window['viewBackFromOther'] = null;
                    }, 10)
                    resizeMainViewContent(navArrayScr[navArrayScr.length - 1]);
                }
            });
            actionbar.resumeView(navArrayScr[navArrayScr.length - 1]);
            bottomBar.resumeView(navArrayScr[navArrayScr.length - 1], navPageBottomId[navArrayScr[navArrayScr.length - 1]]);
        }
    }
}

function navPopViewInit(jsStatus) {
    if (navArrayScr.length < 2) {
        var tmpXslStatus = checkCachePageXsl(navArrayScr[0]);
        if (tmpXslStatus) {
            loadPageXsl(navArrayScr[0], jsStatus,false);
        }
        else {
            loadPage(navArrayScr[0], jsStatus);
        }
    }
    else {
        navArrayScr.pop();
        navData[navArrayScr[0]] = navArrayScr;
        var tmpXslStatus = checkCachePageXsl(navArrayScr[navArrayScr.length - 1]);
        if (tmpXslStatus) {
            loadPageXsl(navArrayScr[navArrayScr.length - 1], jsStatus,true, function () {
                if (typeof (window['viewDidLoadSuccess']) == 'function') {
                    window['viewDidLoadSuccess']();
                    setTimeout(function () {
                        window['viewDidLoadSuccess'] = null;
                    }, 10)
                }
            });
            bottomBar.resumeView(navArrayScr[navArrayScr.length - 1], navPageBottomId[navArrayScr[navArrayScr.length - 1]]);
            actionbar.resumeView(navArrayScr[navArrayScr.length - 1]);
        }
        else {
            loadPage(navArrayScr[navArrayScr.length - 1], jsStatus, function () {
                if (typeof (window['viewDidLoadSuccess']) == 'function') {
                    window['viewDidLoadSuccess']();
                    setTimeout(function () {
                        window['viewDidLoadSuccess'] = null;
                    }, 10)
                }
            });
            actionbar.resumeView(navArrayScr[navArrayScr.length - 1]);
            bottomBar.resumeView(navArrayScr[navArrayScr.length - 1], navPageBottomId[navArrayScr[navArrayScr.length - 1]]);
        }
    }
}

function navPopToView(pageView, jsStatus) {
    var tmpIs = navArrayScr.length - 1;
    while ((tmpIs > 0) && navArrayScr[tmpIs] != pageView) {
        navArrayScr.pop();
        tmpIs--;
    }
    navData[navArrayScr[0]] = navArrayScr;
    var tmpXslStatus = checkCachePageXsl([navArrayScr.length - 1]);
    if (tmpXslStatus) {
        loadPageXsl(navArrayScr[navArrayScr.length - 1], jsStatus,false);
    }
    else {
        loadPage(navArrayScr[navArrayScr.length - 1], jsStatus, function () {
            if(typeof(window['viewBackFromOther']) == 'function') {
                window['viewBackFromOther']();
                setTimeout(function(){
                    window['viewBackFromOther'] = null;
                },10)
            }
        });

    }

}
function navPopToViewInit(pageView, jsStatus) {
    var tmpIs = navArrayScr.length - 1;
    while ((tmpIs > 0) && navArrayScr[tmpIs] != pageView) {
        navArrayScr.pop();
        tmpIs--;
    }
    navData[navArrayScr[0]] = navArrayScr;
    var tmpXslStatus = checkCachePageXsl([navArrayScr.length - 1]);
    if (tmpXslStatus) {
        loadPageXsl(navArrayScr[navArrayScr.length - 1], jsStatus,false);
    }
    else {
        loadPage(navArrayScr[navArrayScr.length - 1], jsStatus, function () {
        });

    }

}
function navPopToRootView(jsStatus) {
    var rootView = navArrayScr[0];
    navArrayScr = new Array();
    navArrayScr[0] = rootView;
    delete navData[rootView];
    navData[rootView] = navArrayScr;
    var tmpXslStatus = checkCachePageXsl(navArrayScr[0]);
    if (tmpXslStatus) {
        loadPageXsl(navArrayScr[0], jsStatus,false);
    }
    else {
        loadPage(navArrayScr[0], jsStatus);
    }
}
function navRemovePageAtIndex(indx) {
    if ((indx < navArrayScr.length) && (indx > 0)) {
        var rootView = navArrayScr[0];
        navArrayScr.splice(indx, 1);
        if (navArrayScr.length > 0) {
            navData[navArrayScr[0]] = navArrayScr;
        }
        else {
            navData[rootView] = null;
            //delete navData[rootView];
        }
        return true;
    }
    else {
        return false;
    }
}
function navRemoveAll() {
    navArrayScr = new Array();
    navData = {};
    navCachedPages = {};
}
function navResetBranchView(jsStatus) {
    var rootView = navArrayScr[0];
    for (var i = 0; i < navArrayScr.length; i++) {
        navCachedPages[navArrayScr[i]] = null;
        //delete navCachedPages[navArrayScr[i]];
    }
    navArrayScr = new Array();
    navArrayScr[0] = rootView;
    delete navData[rootView];
    navData[rootView] = navArrayScr;
    var tmpXslStatus = checkCachePageXsl(navArrayScr[0]);
    if (tmpXslStatus) {
        loadPageXsl(navArrayScr[0], jsStatus,false);
    }
    else {
        loadPage(navArrayScr[0], jsStatus);
    }
    navController.initWithRootView("homepage/homepage-dynamic-scr", true, 'html');
    if(CONST_DESKTOP_MODE && !checkScreenisMobilePX()){
        navController.getActionBar().setTitleBarOnly(CONST_STR.get("MENU_HOME_PAGE"));
    }
}

function navCheckPageNoCache(inPage) {
    var tmpCheckPage = false;
    for (var i = 0; i < navPageNoCache.length; i++) {
        if (inPage == navPageNoCache[i]) {
            tmpCheckPage = true;
            break;
        }
    }
    return tmpCheckPage;
}

function navCheckPageCachedStatus(page) {
    if ((navCachedPages[page] == undefined) || (navCachedPages[page] == null) || (navCachedPages[page].length < 10)) {
        return false;
    }
    else {
        return true;
    }
}

/*** NAVIGATION CONTROLLER END ***/

/*** APPLY DYNAMIC STYLE ***/
//apply dynamic style
var gContentScrollPosition = 0;
var gModeScreenView = CONST_MODE_SCR_MEDIUM;

function applyDynamicPageStyleSheet(forced) {
    if (isNotNeedReloadPageStyleSheet) {
        isNotNeedReloadPageStyleSheet = false;
        return;
    }
    //if(CONST_DESKTOP_MODE) return;
    var currentClientHeight = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    var currentClientWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    if (currentClientWidth != clientWidth || currentClientHeight != clientHeight || forced) {
        clientWidth = currentClientWidth;
        clientHeight = currentClientHeight;
    }

    var tmpPageHeader = document.getElementById('pageHeader');
    if (tmpPageHeader.style.display != 'none' && (gModeScreenView != CONST_MODE_SCR_SMALL || !isModelMobile)) {
        //clientHeight -=195-40;
        clientHeight -= tmpPageHeader.clientHeight; // + 40: footer
    }
    //hidden footer on mobile
    //if(!gIsLogin){
    if (gIsLogin) {
        document.getElementById('mainlayoutfooter').style.display = 'none';
    }
    var tmpGapSub;
    var tmpGapFooter;
    if (!gIsLogin) {
        tmpGapSub = (gModeScreenView == CONST_MODE_SCR_MEDIUM) ? 66 : 83;
        tmpGapFooter = (gModeScreenView == CONST_MODE_SCR_MEDIUM) ? 0 : 0;
    }
    else {
        tmpGapSub = (gModeScreenView == CONST_MODE_SCR_MEDIUM) ? 66 : 83;
        tmpGapFooter = (gModeScreenView == CONST_MODE_SCR_MEDIUM) ? 0 : 41;
    }

    var numOfAccs = gUserInfo.accountList.length;

    if (CONST_BROWSER_MODE && navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && !navigator.userAgent.match(/CriOS/i)) { //fix bug footer on Safari iOS7
//        document.getElementById('pageFooter').style.bottom = '20px';   anhntt cmt

    }

        if (!gIsLogin) {
        //logInfo('Show footer height 41px');
        var styles =
            '.main-layout .main-layout-contents { height: ' + (clientHeight - 180) + 'px; }' +
                '.main-layout .main-layout-subview { height: ' + (clientHeight - tmpGapSub) + 'px; }' +
                '.account-select-content{width: ' + (clientWidth - 10) + 'px;}' +
                '.account-select-content .scroller li {width: ' + (clientWidth - 10) + 'px;}' +
                '.account-select-content .scroller{width: ' + ((clientWidth - 10) * numOfAccs ) + 'px;}';
    }
    else {
        //logInfo('Hide footer height 41px');
        var styles =
            '.main-layout .main-layout-contents { height: ' + (clientHeight - 180 + tmpGapFooter) + 'px; }' +
                '.main-layout .main-layout-subview { height: ' + (clientHeight - tmpGapSub + tmpGapFooter) + 'px; }' +
                '.account-select-content{width: ' + (clientWidth - 10) + 'px;}' +
                '.account-select-content .scroller li {width: ' + (clientWidth - 10) + 'px;}' +
                '.account-select-content .scroller{width: ' + ((clientWidth - 10) * numOfAccs ) + 'px;}';
    }




    var style = document.createElement('style');
    style.setAttribute('id', 'pageSlideDynamic');

    var tmpNodeStyle = document.getElementById('pageSlideDynamic');
    if ((tmpNodeStyle == undefined) || (tmpNodeStyle == null)) {
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    else {
        tmpNodeStyle.parentNode.removeChild(tmpNodeStyle);
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    if (style.styleSheet) { // IE
        style.styleSheet.cssText = styles;
    } else {
        var cssText = document.createTextNode(styles);
        style.appendChild(cssText);
    }


    //UPDATE TITLE - LAMPT
    var screenTitle = document.getElementsByClassName('screen-title')[0];
    if (screenTitle != null && screenTitle != undefined) {
        var screenTitleSpan = screenTitle.getElementsByTagName('span')[0];
        if (screenTitleSpan != undefined) {
            screenTitleSpan.innerHTML = screenTitleSpan.innerHTML.toUpperCase();
//            document.getElementById('lblChangLanguage').innerHTML = screenTitleSpan.innerHTML;
        }
    }

    var menuSelected = document.getElementById(currentPage);
    if (menuSelected) {
        var arrayOld = document.getElementsByClassName('langNoStyleSelected');
        while (arrayOld.length > 0) {
            arrayOld[0].className = 'langNoStyle';
            arrayOld = document.getElementsByClassName('langNoStyleSelected');
        }
        menuSelected.getElementsByTagName('div')[0].className = 'langNoStyle langNoStyleSelected';

        //-->div.li.div.div.ul.li
        var checkNode = menuSelected.parentNode.parentNode.parentNode.parentNode;
        if (checkNode) {
            if (checkNode.tagName.toUpperCase() == "UL" && checkNode.className == "menu-layout-contents-sub") {
                if (checkNode.style.height == '0px' || checkNode.style.height == '') {
                    applyScrollForMe(checkNode.parentNode);
                }
                checkNode.parentNode.getElementsByTagName('div')[0].getElementsByTagName('div')[0].className = 'langNoStyle langNoStyleSelected';
            }
        }
    }
}

function applyVerticalScrollPage(forced, inGapsize) {
    //if(CONST_DESKTOP_MODE) return;
    var currentClientHeight = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    var currentClientWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    var styles =
        '.main-layout .main-layout-vertical-slideview { height: ' + (clientHeight - 170 - inGapsize) + 'px; }';
    var style = document.createElement('style');
    style.setAttribute('id', 'pageVerticalSlideDynamic');
    //hidden footer on mobile
    //if(!gIsLogin){
    if (gIsLogin) {
        document.getElementById('mainlayoutfooter').style.display = 'none';
    }
    var tmpNodeStyle = document.getElementById('pageVerticalSlideDynamic');
    if ((tmpNodeStyle == undefined) || (tmpNodeStyle == null)) {
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    else {
        tmpNodeStyle.parentNode.removeChild(tmpNodeStyle);
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    if (style.styleSheet) { // IE
        style.styleSheet.cssText = styles;
    } else {
        var cssText = document.createTextNode(styles);
        style.appendChild(cssText);
    }
}

//apply slide view style
function applyHorisonalStyleSheet(inNodeID, inNum) {
    if ((inNodeID == undefined) || (inNodeID == null) || (inNum == undefined) || (inNum == null)) {
        logInfo('horisonal slide is null');
        return;
    }
    if (parseInt(inNum) <= 0) {
        logInfo('horisonal slide num is zero');
        return;
    }
    var currentClientHeight = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    var currentClientWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    var styles = '.account-select-content{width: ' + (clientWidth - 10) + 'px;}' +
        '.account-select-content .scroller li {width: ' + (clientWidth - 10) + 'px;}' +
        '.account-select-content .scroller{width: ' + ((clientWidth - 10) * inNum ) + 'px;}';
    var style = document.createElement('style');
    style.setAttribute('id', 'horizonSlideDynamic');

    var tmpNodeStyle = document.getElementById('horizonSlideDynamic');
    if ((tmpNodeStyle == undefined) || (tmpNodeStyle == null)) {
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    else {
        tmpNodeStyle.parentNode.removeChild(tmpNodeStyle);
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    if (style.styleSheet) { // IE
        style.styleSheet.cssText = styles;
    } else {
        var cssText = document.createTextNode(styles);
        style.appendChild(cssText);
    }
}

//apply slide view style

function applyHorisonalSlideView(inNodeID) {
    if ((inNodeID == undefined) || (inNodeID == null)) {
        logInfo('horisonal slide nodeID is null');
        return;
    }
    var tmpNode = document.getElementById(inNodeID);
    var tmpUlNode = tmpNode.children[0].children[0];
    var tmpLiArray = tmpUlNode.getElementsByTagName('li');
    var inNum = tmpLiArray.length;

    if (parseInt(inNum) <= 0) {
        logInfo('horisonal slide num is zero');
        return;
    }
    var currentClientHeight = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    var currentClientWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    var styles = '.slide-view-select-content{width: ' + (clientWidth - 20) + 'px;}' +
        '.slide-view-select-content{height: ' + (currentClientHeight - 120) + 'px;}' +
        '.slide-view-select-content .scroller li {width: ' + (clientWidth - 20) + 'px;}' +
        '.slide-view-select-content .scroller li {height: ' + (currentClientHeight - 120) + 'px;}' +
        '.slide-view-select-content .scroller{width: ' + ((clientWidth - 20) * inNum ) + 'px;}' +
        '.slide-view-select-content .scroller{height: ' + (currentClientHeight - 120) + 'px;}';
    var style = document.createElement('style');
    style.setAttribute('id', 'slideScrollDynamic');

    var tmpNodeStyle = document.getElementById('slideScrollDynamic');
    if ((tmpNodeStyle == undefined) || (tmpNodeStyle == null)) {
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    else {
        tmpNodeStyle.parentNode.removeChild(tmpNodeStyle);
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    if (style.styleSheet) { // IE
        style.styleSheet.cssText = styles;
    } else {
        var cssText = document.createTextNode(styles);
        style.appendChild(cssText);
    }
}

function resizeMainViewContent(page) {
    var mainViewContent = document.getElementById('mainViewContent');
    var mainViewVerticalSlide = document.getElementById('mainViewVerticalSlide');
    var navBottomBar = document.getElementById('navBottomBar');
    var mainview = document.getElementById('mainview');
    console.log("Anhntt :" + mainview.offsetHeight);
    var height = (window.innerHeight || document.documentElement.clientHeight);
    if (page == 'login-scr') {
        //ducnt chỉnh sửa cho login
        if (gModeScreenView == CONST_MODE_SCR_SMALL) {
        if (mainViewContent) {
            mainViewContent.style.height = 'auto';
            mainViewContent.style.top = '40px';
            mainViewContent.style.bottom =  '0px';
        }
        if (navBottomBar) {
            navBottomBar.style.display = 'none';
        }
    }
    else{
        if (mainViewContent) {
            mainViewContent.style.top = '0px';
            mainViewContent.style.bottom = '0px';
            mainViewContent.style.width='100%';
            mainViewContent.style.height =  (innerHeight-160) +'px';
            mainViewContent.style.background='inherit';
        }
    }
    } else {
        if (mainViewContent) {
            //anhntt chinh sua cho desktop
            if(gModeScreenView == CONST_MODE_SCR_SMALL) {
                mainViewContent.style.height = height - bottomBar.getHeightBottomBar() - actionbar.getHeight() + 'px';
                mainViewContent.style.top = actionbar.getHeight() + 6 + 'px';
                mainViewContent.style.bottom = bottomBar.getHeightBottomBar() + 'px';
                actionbar.cacheTitle(page);
            }else{
               mainViewContent.style.height =  mainview.offsetHeight - 60 - actionbar.getHeight() + 'px';
               mainViewContent.style.top = actionbar.getHeight()+ 'px';
                mainViewContent.style.bottom = bottomBar.getHeightBottomBar() + 'px';
                actionbar.cacheTitle(page);
            }
        }else if(mainViewVerticalSlide){
            if(gModeScreenView == CONST_MODE_SCR_SMALL){
                mainViewVerticalSlide.style.height = height - bottomBar.getHeightBottomBar() - actionbar.getHeight() + 'px';
                mainViewVerticalSlide.style.top = actionbar.getHeight() + 6 + 'px';
                mainViewVerticalSlide.style.bottom = bottomBar.getHeightBottomBar() + 'px';
                actionbar.cacheTitle(page);
            } else{
                mainViewVerticalSlide.style.height = mainview.offsetHeight - 70 - actionbar.getHeight() + 'px';
                mainViewVerticalSlide.style.top = actionbar.getHeight()+'px';
                mainViewVerticalSlide.style.bottom = bottomBar.getHeightBottomBar() + 'px';
                actionbar.cacheTitle(page);
            }
        }
    }
}
//======================================================================
/*** APPLY DYNAMIC STYLE END ***/