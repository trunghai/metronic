/**
 ***author: DuyLK***
 ***Date create:11/07/2016***
 - screenWidth: screenWidth of device
 - screenHeight: screenHeight of device
 - height: height of bottombar (default 49)
 - width: width of bottombar (default screenwidth)
 - totalItem:  total item of tabbar
 - iconNormal:  array icon image of normal state
 - iconSelected: array icon image of selected state
 - textContent: array text of bottom menu
 - textColorNomal: text color menu of normal state
 - textColorSelected: text color menu of selected state
 - backgroundColor: background color of menu

 Cách dùng
 Ví dụ: Bottombar có icon

 var bottomBar = new BottomBar({
 screenWidth: screenW,
 screenHeight: screenH,
 backgroundColor: '#825896',
 lineHeightNormal: 1,
 lineColorNormal: '#a177a9',
 totalItem: 4,
 iconNormal: ["home.png", "write.png", "wallet.png", "stopwatch.png"],
 iconSelected: ["home_active.png", "write_active.png", "wallet_active.png", "stopwatch_active.png"],
 textContent: ["Gần đây", "Mẫu chuyển tiền", "Danh bạ", "Lệnh chuyển tiền định kỳ"],
 textColorNomal: '#ffffff',
 textColorSelected: '#fb9600',
 selectIndex: function (indexTabar) {
 console.log('khanhduy.le : ' + indexTabar);
 }
 });
 bottomBar.showBottomBar('mainview');  //truyen vào roodid của div chưa main content
 bottomBar.setSelectedtAtIndex(1);

 Bottombar không có icon
 var bottomBar = new BottomBar({
 screenWidth: screenW,
 screenHeight: screenH,
 height: 40,
 backgroundColor: '#825896',
 backgroundColorSelected: '#6F4182',
 totalItem: 2,
 textContent: ["Gần đây", "Mẫu chuyển tiền", "Danh bạ", "Lệnh chuyển tiền định kỳ"],
 textColorNomal: '#ffffff',
 textColorSelected: '#ff8e01',
 lineHeightNormal: 1,
 lineHeightSelected: 4,
 lineColorNormal: '#a177a9',
 lineColorSelected: '#ff8e01',
 selectIndex: function (indexTabar) {
 console.log('khanhduy.le : ' + indexTabar);
 }
 });

 bottomBar.showBottomBar('mainview'); //truyen vào roodid của div chưa main content
 bottomBar.setSelectedtAtIndex(1);
 */


var bottomBar = {
    initBottomBar: function (curPage) {
        if (homePage.indexOf(curPage) != -1) {
            initBottomBarByPage(curPage);
            showHideMenu('navBottomBar', true);
            for (var key in bottomBarArray) {
                if (key == 'bottomBarHome') {
                    showHideMenu(key, true);
                } else {
                    showHideMenu(key, false);
                }
            }
        } /*else if (bottomBarText.indexOf(curPage) != -1) {
         initBottomBarTextByPage(curPage, true);
         showHideMenu('navBottomBar', true);
         for (var key in bottomBarArray) {
         if (key == 'bottomBarText') {
         showHideMenu(key, true);
         } else {
         showHideMenu(key, false);
         }
         }
         }*/
    },
    hide: function (){
        showHideMenu('navBottomBar', false);
        for (var key in bottomBarArray) {
            if (bottomBarArrayStatus[key] != 'none') {
                showHideMenu(key, false);
                currentBottombar = key;
            }
        }
        timeHideBottomBar = setTimeout(function () {
            clearTimeout(timeHideBottomBar);
            document.getElementById('navBottomBar').style.display = 'none';
        }, 400);
    },
    show: function () {
        if (currentBottombar != null && currentBottombar != '') {
            showHideMenu('navBottomBar', true);
            showHideMenu(currentBottombar, true);
            currentBottombar = '';
        }
    },
    initBottomBarOnlyText: function (page,arrBottom, inID) {
        initBottomBarTextByPage(page,arrBottom, inID, true);
        showHideMenu('navBottomBar', true);
        for (var key in bottomBarArray) {
            if (key == 'bottomBarText' + inID) {
                showHideMenu(key, true);
            } else {
                showHideMenu(key, false);
            }
        }
    },
    initBottomBarWithButton: function (pageView, arrBottom, inID) {
        if(pageView != "menuxsl/dynamic-menu-scr" && gModeScreenView == CONST_MODE_SCR_MEDIUM ){
           initBottomBarShortCut(pageView, arrBottom, inID,false,null);
        }else if(gModeScreenView == CONST_MODE_SCR_SMALL){
            initBottomBarShortCut(pageView, arrBottom, inID,false,null);
        }
        showHideMenu('navBottomBar', true);
        for (var key in bottomBarArray) {
            if (key == 'bottomBarShortCut' + inID) {
                if(pageView != "menuxsl/dynamic-menu-scr" && gModeScreenView == CONST_MODE_SCR_MEDIUM){
                    showHideMenu(key, true);
                }else if(gModeScreenView == CONST_MODE_SCR_SMALL){
                    // showHideMenu(key, true);
                }
            } else {
                showHideMenu(key, false);
            }
        }
    },
    //anhntt refresh bottombarHome theo width
    reviewHome:function(width,height){
        ref(width,height);
        for(var key in bottomBarArray){
            var bottomBar=bottomBarArray[key];
            var staKey=key.substr(0,17);
            var staKeys=key.substr(0,13);
            var lastKeys=key.substr(13,key.length);
            var lastKey=key.substr(17,key.length);
            if(staKey=="bottomBarShortCut"){
                bottomBar.refBottomBarShotCut(width,height,lastKey);
            }
            if(staKeys=="bottomBarText"){
                bottomBar.refBottomBarTex(width,height,lastKeys);
            }
        }
    }
    ,initBottomBarWithButtonCallBack: function (pageView, arrBottom, inID, callBack,allowActive) {
        initBottomBarShortCut(pageView, arrBottom, inID, true, callBack,allowActive);
        showHideMenu('navBottomBar', true);
        for (var key in bottomBarArray) {
            if (key == 'bottomBarShortCut' + inID) {
                showHideMenu(key, true);
            } else {
                showHideMenu(key, false);
            }
        }
    },
    resumeView: function (curPage,idBottomBar) {
        if (homePage.indexOf(curPage) != -1) {
            initBottomBarByPage(curPage);
            showHideMenu('navBottomBar', true);
            for (var key in bottomBarArray) {
                if (key == 'bottomBarHome') {
                    showHideMenu(key, true);
                } else {
                    showHideMenu(key, false);
                }
            }
        } else if (bottomBarText.indexOf(curPage) != -1) {
            initBottomBarTextByPage(curPage, false);
            showHideMenu('navBottomBar', true);
            for (var key in bottomBarArray) {
                if (key == 'bottomBarText') {
                    showHideMenu(key, true);
                } else {
                    showHideMenu(key, false);
                }
            }
        } else if (idBottomBar != null) {
            showHideMenu('navBottomBar', true);
            for (var key in bottomBarArray) {
                if ((key == 'bottomBarShortCut' + idBottomBar) || (key == 'bottomBarText' + idBottomBar)) {
                    showHideMenu(key, true);
                } else {
                    showHideMenu(key, false);
                }
            }
        }
        else {
            showHideMenu('navBottomBar', false);
            for (var key in bottomBarArray) {
                showHideMenu(key, false);
            }

            var hideMenu = setTimeout(function () {
                document.getElementById('navBottomBar').style.display = 'none';
            }, 400);
        }
        //var navBottomBar = document.getElementById('navBottomBar');
        //var bottomBar = bottomBarArray[eMenu];
        //navBottomBar.style.height = '40px';
        //navBottomBar.style.top = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 40 + 'px';

    },
    getHeightBottomBar: function () {
        var height = 0;
        for (var key in bottomBarArray) {
            var temp = document.getElementById(key);
            if (temp) {
                if (bottomBarArrayStatus[key] != 'none') {
                    height = bottomBarArray[key].height;
                    break;
                }
            }
        }
        return height;
    },
    setSelectedtAtIndexWithID: function (index, idBottombar) {
        setSelectedtAtIndexWithID(index,idBottombar);
    }
}

var previousSelected;
var homePage = ['homepage/homepage-dynamic-scr', 'homepage/home-page-recent', 'homepage/cus-prop-info-scr', 'homepage/home-page-manage-finance'];
var bottomBarText = ['visa/card-lock','visa/card-unlock'];
var bottomBarArray = {};
var bottomBarArrayStatus = {};
var currentBottombar;

var htmlPages = ['cardservice/view/list/list-history-transaction','cardservice/view/list/credit-receive-statement', 'transfer/internal/transfer-local-create-scr'
];
//anhntt refresh width cho bottombar
function ref(width,height){
    var bottomBar = new BottomBar({
        id: "bottomBarHome",
        screenWidth: width,
        screenHeight: height,
        height: 60,
        backgroundColor: '#9c65a5',
        backgroundColorSelected: '#ff8f00',
        lineHeightNormal: 1,
        lineColorNormal: '#a177a9',
        totalItem: 4,
        iconNormal: ["icon-homepage", "icon-recents", "icon-financial-overview", "icon-financial-management"],
        textContent: ['TOUCHID_GOTOHOMEPAGE_TITLE', 'RECENT_ACTIVITIES','FINANCE_OVERVIEW', 'FINANCE_MANAGE'],
        widthItems : [17.7,29.8,27.2,25.3],
        textColorNomal: '#e1bee7',
        textColorSelected: '#ffffff',
        selectIndex: function (indexTabar) {
            if (indexTabar == 0) {
                gotoHomePage();
            }
            else if (indexTabar == 1) {
                navController.initWithRootView('homepage/home-page-recent', true, 'xsl');
            }
            else if (indexTabar == 2) {
                getCusFinInfo();
            }
            else if (indexTabar == 3) {
                navController.initWithRootView('homepage/home-page-manage-finance', true, 'xsl');
            }
            console.log('khanhduy.le : ' + indexTabar);
        }
    });
    bottomBarArray["bottomBarHome"]=bottomBar;
    bottomBarArrayStatus["bottomBarHome"] = 'display';
    bottomBar.refresh(width,height);
}
function initBottomBarByPage(page) {
    var navBottomBar = document.getElementById('navBottomBar');
    if(gModeScreenView == CONST_MODE_SCR_SMALL){
        navBottomBar.style.height = '60px';
    }else{

    }
    if(gModeScreenView == CONST_MODE_SCR_SMALL){
        navBottomBar.style.top = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 60 + 'px';
    }
    else{
////        if(navArrayScr[navArrayScr.length - 1] == 'homepage/homepage-dynamic-scr') {
////            navBottomBar.style.top = (document.getElementById('mainview').clientHeight + 10 - 70) + "px";
////        }else{
            navBottomBar.style.top = (document.getElementById('mainview').clientHeight + 10 - 40 - actionbar.getHeight()) + "px";
////        }
    }
    var tabbarHome = document.getElementById('bottomBarHome');
        if (!tabbarHome) {
        tabbarHome = document.createElement("div");
        tabbarHome.setAttribute("class", "bottomBarHome");
        tabbarHome.setAttribute("id", "bottomBarHome");

//        anhntt comment
        if(gModeScreenView == CONST_MODE_SCR_SMALL){
            tabbarHome.style.bottom = '-60px';
        }
//        tabbarHome.style.bottom = '-60px';
        navBottomBar.appendChild(tabbarHome);
        var bottomBar = new BottomBar({
            id: "bottomBarHome",
            screenWidth: (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth),
            screenHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight),
            height: 60,
            backgroundColor: '#9c65a5',
            backgroundColorSelected: '#ff8f00',
            lineHeightNormal: 1,
            lineColorNormal: '#a177a9',
            totalItem: 4,
            iconNormal: ["icon-homepage", "icon-recents", "icon-financial-overview", "icon-financial-management"],
            textContent: ['TOUCHID_GOTOHOMEPAGE_TITLE', 'RECENT_ACTIVITIES','FINANCE_OVERVIEW', 'FINANCE_MANAGE'],
            widthItems : [17.7,29.8,27.2,25.3],
            textColorNomal: '#e1bee7',
            textColorSelected: '#ffffff',
            selectIndex: function (indexTabar) {
                if (indexTabar == 0) {
                    gotoHomePage();
                    if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
                        document.getElementById('navActionbar').style.display='none';
                    }
                }
                else if (indexTabar == 1) {
                    navController.initWithRootView('homepage/home-page-recent', true, 'xsl');
                }
                else if (indexTabar == 2) {
                    getCusFinInfo();
                }
                else if (indexTabar == 3) {
                    navController.initWithRootView('homepage/home-page-manage-finance', true, 'xsl');
                }
                console.log('khanhduy.le : ' + indexTabar);
            }
        });
        bottomBar.showBottomBarWithElement(tabbarHome);
        setSelectedTabbarItemHome(0, bottomBar);
        bottomBarArray["bottomBarHome"] = bottomBar;
        bottomBarArrayStatus["bottomBarHome"] = 'display';
    } else {
        if (homePage.indexOf(page) != -1) {
            setSelectedTabbarItemHome(homePage.indexOf(page), bottomBarArray["bottomBarHome"]);
            bottomBarArray["bottomBarHome"].previousHomeSelected = homePage.indexOf(page);
        }
    }
}

function initBottomBarTextByPage(page,arrBottom, inID, isInit) {
    var navBottomBar = document.getElementById('navBottomBar');
    navBottomBar.style.height = '40px';

    if(gModeScreenView == CONST_MODE_SCR_SMALL){
        navBottomBar.style.top = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 40 + 'px';
    }else{
        navBottomBar.style.top = (document.getElementById('mainview').clientHeight + 10 - 70 - 15) + "px";
    }

    var tabbarHome = document.getElementById('bottomBarText' + inID);

    if (!tabbarHome) {
        tabbarHome = document.createElement("div");
        tabbarHome.setAttribute("class", "bottomBarText");
        tabbarHome.setAttribute("id", "bottomBarText" + inID);
        //anhntt comment
        if(gModeScreenView == CONST_MODE_SCR_SMALL){
            tabbarHome.style.bottom =   '-40px';
        }
//        tabbarHome.style.bottom =   '-40px';
        navBottomBar.appendChild(tabbarHome);
        var bottomBar = new BottomBar({
            id: "bottomBarText" + inID,
            screenWidth: (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth),
            screenHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight),
            height: 40,
            backgroundColor: '#825896',
            backgroundColorSelected: '#6F4182',
            totalItem: arrBottom.length,
            itemBottoms: arrBottom,
            textColorNomal: '#ffffff',
            textColorSelected: '#ff8e01',
            lineHeightNormal: 1,
            lineHeightSelected: 4,
            lineColorNormal: '#a177a9',
            lineColorSelected: '#ff8e01',
            selectIndex: function (indexTabar) {
                var pageSelect = bottomBar.itemBottoms[indexTabar].src;
                if (htmlPages.indexOf(pageSelect) != -1) {
                    navController.pushToViewAndRemoveOtherPage(bottomBar.itemBottoms[indexTabar].src, bottomBar.itemBottoms, inID, true, 'html');
                } else {
                    navController.pushToViewAndRemoveOtherPage(bottomBar.itemBottoms[indexTabar].src, bottomBar.itemBottoms, inID, true, 'xsl');
                }
            }
        });
        bottomBar.showBottomBarTextWithElement(tabbarHome, inID);
        var lengthArrBottom = arrBottom.length;
        var indexTab = 0;
        for(var i=0;i<lengthArrBottom;i++){
            if(arrBottom[i].src == page ){
                indexTab =i;
            }
        }
        setSelectedTabbarTextItem(indexTab, bottomBar);
        bottomBarArray["bottomBarText" + inID] = bottomBar;
        bottomBarArrayStatus["bottomBarText" + inID] = 'display';
    } else {
        if (isInit) {
            var index = -1;
            for (var i = 0; i < arrBottom.length ; i++) {
                if (arrBottom[i].src == page) {
                    index = i;
                    break;
                }
            }

            setSelectedTabbarTextItem(index, bottomBarArray["bottomBarText" + inID]);
            bottomBarArray["bottomBarText" + inID].previousTabbarTextSelected = index;
        } else {

        }
    }
}

function initBottomBarShortCut(pageView, arrBottom, inID, isCallBack,callBack,allowActive) {
    var navBottomBar = document.getElementById('navBottomBar');

    if(gModeScreenView == CONST_MODE_SCR_SMALL){
        navBottomBar.style.height = '47px';
        navBottomBar.style.top = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 47 + 'px';
    }else{
        navBottomBar.style.height = '35px';
        navBottomBar.style.top = (document.getElementById('mainview').clientHeight + 10 - 65 - 15) + "px";
    }


    tabbarHome = document.getElementById('bottomBarShortCut' + inID);
    if (!tabbarHome) {
        tabbarHome = document.createElement("div");
        tabbarHome.setAttribute("class", "bottomBarShortCut");
        tabbarHome.setAttribute("id", "bottomBarShortCut" + inID);
        //anhntt comment
        if(gModeScreenView == CONST_MODE_SCR_SMALL){
            tabbarHome.style.bottom =   '-47px';
        }
        navBottomBar.appendChild(tabbarHome);

        var bottomBar = new BottomBar({
            id: 'bottomBarShortCut' + inID,
            screenWidth: (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth),
            screenHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight),
            height: 47,
            backgroundColor: '#825896',
            lineHeightNormal: 1,
            lineColorNormal: '#a177a9',
            totalItem: arrBottom.length,
            itemBottoms : arrBottom,
            textColorNomal: '#ffffff',
            textColorSelected: '#fb9600',
            selectIndex: function (indexTabar) {
                console.log('khanhduy.le : ' + indexTabar);
            }
        });
//        if(pageView != "menuxsl/dynamic-menu-scr"){
            bottomBar.showBottomBarShortCut(tabbarHome, inID,isCallBack,callBack,allowActive);
//        }
        bottomBarArray["bottomBarShortCut" + inID] = bottomBar;
        bottomBarArrayStatus["bottomBarShortCut" + inID] = 'display';
    }
}

function showHideMenu(eMenu, isDisplay) {

    var bottomBar = bottomBarArray[eMenu];
    //anhntt refresh bottombar
    var staKey=eMenu.substr(0,17);
    var lastKey=eMenu.substr(17,eMenu.length);
    var staKeys=eMenu.substr(0,13);
    var lastKeys=eMenu.substr(13,eMenu.length);
    if(staKey=="bottomBarShortCut"){
        bottomBar.refreshLangBottombarShortCut(lastKey);
    }else if(staKeys=="bottomBarText"){
        bottomBar.refreshLangBottombarText(lastKeys);
    }else if(eMenu=="bottomBarHome"){
        bottomBar.refreshLangBottombarHome();
    }

    var menu = document.getElementById(eMenu);
    if (menu) {
        if (isDisplay) {
            bottomBarArrayStatus[eMenu] = 'display';
            if (eMenu != 'navBottomBar') {
                if(gModeScreenView == CONST_MODE_SCR_SMALL){
                    var transitionProperty = prefix.js + 'TransitionProperty';
                    menu.style[transitionProperty] = prefix.css + 'transform';
                    var transitionDuration = prefix.js + 'TransitionDuration';
                    if (prefix.lowercase == 'ms') {
                        menu.style[transitionDuration] = '350ms';
                    }
                    else {
                        menu.style[transitionDuration] = '400ms';
                    }
                    menu.style.opacity = 1;
                    var transformJS = prefix.js + 'Transform';
                    menu.style.bottom = -bottomBar.height + 'px';
                    menu.style[transformJS] = 'translate(0,' + -bottomBar.height + 'px)' + translateZ;
                }else{
                    var transitionProperty = prefix.js + 'TransitionProperty';
                    menu.style[transitionProperty]='none';
                    menu.style[transformJS] = 'none';
                }
                menu.style.display = 'block';
            } else {
                menu.style.display = 'block';
            }
        } else {
            //
            bottomBarArrayStatus[eMenu] = 'none';
            if (eMenu != 'navBottomBar') {
                if(gModeScreenView == CONST_MODE_SCR_SMALL){
                var transitionProperty = prefix.js + 'TransitionProperty';
                menu.style[transitionProperty] = prefix.css + 'transform';
                var transitionDuration = prefix.js + 'TransitionDuration';
                if (prefix.lowercase == 'ms') {
                    menu.style[transitionDuration] = '350ms';
                }
                else {
                    menu.style[transitionDuration] = '400ms';
                }
                menu.style.opacity = 1;
                var transformJS = prefix.js + 'Transform';
                menu.style[transformJS] = 'translate(0,' + bottomBar.height + 'px)' + translateZ;
                }else{
                    var transitionProperty = prefix.js + 'TransitionProperty';
                    menu.style[transitionProperty]='none';
                    menu.style[transformJS] = 'none';
                }

                //delay
                var timeSlideInEffect;
                if (timeSlideInEffect) {
                    clearTimeout(timeSlideInEffect);
                    timeSlideInEffect = null;
                }
                timeSlideInEffect = setTimeout(function () {
                    clearTimeout(timeSlideInEffect);
                    menu.style.display = 'none';
                }, 400);
            }
        }

        menu.style.display = isDisplay ? 'block' : 'none';
    }
}

function BottomBar(opt_opts) {
    this.id = opt_opts.id;
    this.screenWidth = opt_opts.screenWidth || (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
    this.screenHeight = opt_opts.screenHeight || (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
    this.height = opt_opts.height || 49;
    this.width = opt_opts.width || this.screenWidth || 0;
    this.totalItem = opt_opts.totalItem;
    this.iconNormal = opt_opts.iconNormal;
    this.iconSelected = opt_opts.iconSelected;
    this.textContent = opt_opts.textContent;
    this.textColorNomal = opt_opts.textColorNomal || '#ffffff';
    this.textColorSelected = opt_opts.textColorSelected || '#fb9600';
    this.backgroundColor = opt_opts.backgroundColor || '#f7f7f7';
    this.backgroundColorSelected = opt_opts.backgroundColorSelected || this.backgroundColor;
    this.lineHeightNormal = opt_opts.lineHeightNormal;
    this.lineHeightSelected = opt_opts.lineHeightSelected || opt_opts.lineHeightNormal;
    this.lineColorNormal = opt_opts.lineColorNormal || '#a177a9';
    this.lineColorSelected = opt_opts.lineColorSelected || this.lineColorNormal;
    this.blockItems = null; //using for save item tabbar
    this.blockIcons = null; //using for save item icon
    this.blockText = null;  //using for save item text
    this.blockLine = null;  //using for save line 
    this.itemBottoms = opt_opts.itemBottoms;
    this.typeBottomBar = null;
    this.widthItems = opt_opts.widthItems;
    this.options = opt_opts;
    this.previousSelected = -1;
    this.previousHomeSelected = -1;
    this.previousTabbarTextSelected = -1;
}

BottomBar.prototype.showBottomBarWithElement = function (parent) {
    this.blockItems = new Array();
    this.blockText = new Array();
    this.blockIcons = new Array();

    var hText = 28;
    var hIcon = 22;
    var wItem = this.screenWidth / this.totalItem;
    //add block div for item
    for (i = 0; i < this.totalItem; i++) {
        var div = document.createElement("div");
        div.setAttribute("id", "tabbarHomeItem" + (i));
        div.setAttribute("class", "tabbarItem ripple-add-on");
        var mainview = document.getElementById('mainview').offsetWidth;
        if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
            div.style.width = ((mainview-28) * this.widthItems[i])/100 + "px";
        }else{
            div.style.width = (this.screenWidth * this.widthItems[i])/100 + "px";
        }

        //div.style.top = '9px';
        div.style.background = this.backgroundColor;
        div.style.height = 60 + "px";
        parent.appendChild(div);
        this.blockItems.push(div);
    }

    //add block icon
    for (i = 0; i < this.totalItem; i++) {
        var divChild = this.blockItems[i];
        var div = document.createElement("div");
        div.setAttribute("id", "tabbarHomeIcon" + (i));
        div.setAttribute("class", this.iconNormal[i]);
        if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
            div.style.width = ((mainview-28) * this.widthItems[i])/100 + "px";
            div.style.position="absolute";
//            div.style.marginLeft="-29px";
            div.style.marginLeft="-27%";
            div.style.top="-6%";
        }else{
            div.style.width = (this.screenWidth * this.widthItems[i]) / 100 + "px";
        }

        div.style.fontSize = '22px';
        div.style.paddingTop = '10px';
        divChild.appendChild(div);
        this.blockIcons.push(div);
    }

    //add text 
    for (i = 0; i < this.totalItem; i++) {
        var tabbarText = document.createElement("p");
        tabbarText.setAttribute("id", "tabbarHomeText" + (i));
        tabbarText.innerHTML = CONST_STR.get(this.textContent[i]);
        tabbarText.setAttribute("class", "tabBarText");
        if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
            tabbarText.style.width = ((mainview-28) * this.widthItems[i])/100 + "px";

            tabbarText.style.lineHeight = 39 + "px";
            tabbarText.style.marginLeft="5%";
        }else{
            tabbarText.style.width = (this.screenWidth * this.widthItems[i]) / 100 + "px";
            tabbarText.style.lineHeight = hText + "px";
            tabbarText.style.margin = '0px';
        }
//        tabbarText.style.width = (this.screenWidth * this.widthItems[i]) / 100 + "px";
        tabbarText.style.height = hText + "px";
        tabbarText.style.left = "0px";


        tabbarText.style.color = this.textColorNomal;
        var divChild = this.blockItems[i];
        divChild.appendChild(tabbarText);
        this.blockText.push(tabbarText);
    }

    var target = this;
    for (i = 0; i < this.totalItem; i++) {
        var item = this.blockItems[i];
        item.addEventListener('click', function (e) {
            clickItemTabbarHome(e, target);
        }, false);
    }
}

//anhntt refresh Lang bottombar
BottomBar.prototype.refreshLangBottombarText= function(inID){
    this.blockText = new Array();
    this.blockItems = new Array();
    this.blockIcons = new Array();

    for (i = 0; i < this.totalItem; i++) {
        var div=document.getElementById("tabbarTextItem" + inID + (i));
        this.blockItems.push(div);
    }

    for (i = 0; i < this.totalItem; i++) {
        var divLine = document.getElementById("tabbarLine" + inID + (i));
        this.blockLine.push(divLine);
    }

    //refresh text
    for (i = 0; i < this.totalItem; i++) {
        var tabbarText=document.getElementById("tabbarText" + inID + (i));
        tabbarText.innerHTML = CONST_STR.get(this.itemBottoms[i].keyLang);
        this.blockText.push(tabbarText);
    }
}
BottomBar.prototype.refreshLangBottombarShortCut=function(inID){
    this.blockText = new Array();
    this.blockItems = new Array();
    this.blockIcons = new Array();

    //add block div for item
    for (i = 0; i < this.totalItem; i++) {
        var div = document.getElementById("tabbarShortCutItem" + inID + (i));
        this.blockItems.push(div);
    }

    //add block icon
    for (i = 0; i < this.totalItem; i++) {
        var div = document.getElementById("tabbarShortCutIcon" + inID + (i));
        this.blockIcons.push(div);
    }
    //refresh text
    for (i = 0; i < this.totalItem; i++) {
        var tabbarText = document.getElementById("tabbarShortCutText" + inID + (i));
        tabbarText.innerHTML = CONST_STR.get(this.itemBottoms[i].keyLang);
        this.blockText.push(tabbarText);
    }
}
BottomBar.prototype.refreshLangBottombarHome=function(){
    this.blockText = new Array();
    this.blockItems = new Array();
    this.blockIcons = new Array();

    for (i = 0; i < this.totalItem; i++) {
        var div =document.getElementById("tabbarHomeItem"+(i));
        if(div){
            this.blockItems.push(div);
        }
    }

    //add block icon
    for (i = 0; i < this.totalItem; i++) {
        var blockicon=document.getElementById("tabbarHomeIcon"+(i));
        if(blockicon){
            this.blockIcons.push(blockicon);
        }
    }
    //refresh text
    for (i = 0; i < this.totalItem; i++) {
        var tabbarText=document.getElementById("tabbarHomeText"+(i));
        if(tabbarText){
            tabbarText.innerHTML = CONST_STR.get(this.textContent[i]);
            this.blockText.push(tabbarText);
        }
    }
}
// **************Anhntt End**************
//anhntt refresh bottombar home khi thay doi responsive
BottomBar.prototype.refresh=function(width,height){
    this.screenWidth = width;
    this.screenHeight = height;
    this.blockItems = new Array();
    this.blockText = new Array();
    this.blockIcons = new Array();
    if(gModeScreenView == CONST_MODE_SCR_SMALL){
        //add block div for item
        for (i = 0; i < this.totalItem; i++) {
            var div =document.getElementById("tabbarHomeItem"+(i));
            if(div){
                div.style.width = (width * this.widthItems[i])/100 + "px";
            }
            this.blockItems.push(div);
        }
        //add block icon
        for (i = 0; i < this.totalItem; i++) {
            var blockicon=document.getElementById("tabbarHomeIcon"+(i));
            if(blockicon){
                var div=document.getElementById("tabbarHomeIcon"+(i));
                div.style.width = (width * this.widthItems[i]) / 100 + "px";
                div.style.position="static";
                div.style.marginLeft="0";
                div.style.top="0";
            }
            this.blockIcons.push(div);

        }

        //add text
        for (i = 0; i < this.totalItem; i++) {
            var tabbarText=document.getElementById("tabbarHomeText"+(i));
            if(tabbarText){
                tabbarText.innerHTML = CONST_STR.get(this.textContent[i]);
                tabbarText.style.width = (width * this.widthItems[i]) / 100 + "px";
                tabbarText.style.marginLeft="0";
                tabbarText.style.lineHeight="28px";
            }
            this.blockText.push(tabbarText);
        }
    }else{
        //add block div for item
        for (i = 0; i < this.totalItem; i++) {
            var div =document.getElementById("tabbarHomeItem"+(i));
            if(div){
//                div.style.width = ((width-300) * this.widthItems[i])/100 + "px";
                div.style.width = ((width-24) * this.widthItems[i])/100+ "px";
            }
            this.blockItems.push(div);
        }

        //add block icon
        for (i = 0; i < this.totalItem; i++) {
            var blockicon=document.getElementById("tabbarHomeIcon"+(i));
            if(blockicon){
                var div=document.getElementById("tabbarHomeIcon"+(i));
                //div.style.width = ((width-300) * this.widthItems[i]) / 100 + "px";
                div.style.width = ((width-24) * this.widthItems[i])/100 + "px";
                div.style.position="absolute";
                div.style.marginLeft="-27%";
                div.style.top="-6%";
            }
            this.blockIcons.push(div);

        }
        //add text
        for (i = 0; i < this.totalItem; i++) {
            var tabbarText=document.getElementById("tabbarHomeText"+(i));
            if(tabbarText){
                tabbarText.innerHTML = CONST_STR.get(this.textContent[i]);
                //tabbarText.style.width = ((width-300)* this.widthItems[i]) / 100 + "px";
                tabbarText.style.width = ((width-24) * this.widthItems[i])/100 + "px";
                tabbarText.style.marginLeft="5%";
                tabbarText.style.lineHeight="39px";
            }
            this.blockText.push(tabbarText);
        }
    }

}
//anhntt refresh bottombar Text
BottomBar.prototype.refBottomBarTex=function(inWidth,inHeight,inID){
    this.blockItems = new Array();
    this.blockText = new Array();
    this.blockIcons = new Array();
    var wItem = inWidth / this.totalItem;
    //add block div for item
    for (i = 0; i < this.totalItem; i++) {
        var div = document.getElementById("tabbarTextItem" + inID + (i));
        if(div){
            if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
                div.style.width = (inWidth-24)/this.totalItem + "px";
            }else{
                div.style.width = wItem + "px";
            }
        }
        this.blockItems.push(div);
    }
    for (i = 0; i < this.totalItem; i++) {
        var divLine = document.getElementById("tabbarLine" + inID + (i));
        if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
            divLine.style.width = (inWidth-24)/this.totalItem + "px";
        }else{
            divLine.style.width = wItem + "px";
        }
        this.blockLine.push(divLine);
    }
    //add text
    for (i = 0; i < this.totalItem; i++) {
        var tabbarText = document.getElementById("tabbarText" + inID + (i));
        if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
           tabbarText.style.width = (inWidth-24)/this.totalItem + "px";
        }else{
            tabbarText.style.width = wItem + "px";
        }
        //tabbarText.style.width = wItem + "px";
        this.blockText.push(tabbarText);
    }

}
BottomBar.prototype.showBottomBarTextWithElement = function (parent, inID) {
    this.blockItems = new Array();
    this.blockText = new Array();
    this.blockLine = new Array();

    var wItem = this.screenWidth / this.totalItem;
    var maiview = document.getElementById('mainview').offsetWidth;
    //add block div for item
    for (i = 0; i < this.totalItem; i++) {
        var div = document.createElement("div");
        div.setAttribute("id", "tabbarTextItem" + inID + (i));
        div.setAttribute("class", "tabbarTextItem");
        if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
            div.style.width = (maiview - 24)/this.totalItem + "px";
        }else{
            div.style.width = wItem + "px";
        }
        div.style.height = (this.height) + "px";
        div.style.backgroundColor = this.backgroundColor;
        parent.appendChild(div);
        this.blockItems.push(div);

    }

    for (i = 0; i < this.totalItem; i++) {
        var divLine = document.createElement("div");
        divLine.setAttribute("id", "tabbarLine" + inID + (i));
        divLine.setAttribute("class", "tabbarLine");
        if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
            divLine.style.width = (maiview - 24)/this.totalItem + "px";
        }else{
            divLine.style.width = wItem + "px";
        }
        divLine.style.top = '0px';
        divLine.style.height = this.lineHeightNormal + "px";
        divLine.style.position = 'absolute';
        divLine.style.background = this.lineColorNormal;
        var divChild = this.blockItems[i];
        divChild.appendChild(divLine);
        this.blockLine.push(divLine);
    }

    //add text 
    for (i = 0; i < this.totalItem; i++) {
        var tabbarText = document.createElement("p");
        tabbarText.setAttribute("id", "tabbarText" + inID + (i));
        tabbarText.innerHTML = CONST_STR.get(this.itemBottoms[i].keyLang);
        tabbarText.setAttribute("class", "tabBarText");
        if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
           tabbarText.style.width = (maiview - 24)/this.totalItem + "px";
        }else{
            tabbarText.style.width = wItem + "px";
        }
        tabbarText.style.height = (this.height) + "px";
        tabbarText.style.left = "0px";
        tabbarText.style.margin = '0px';
        tabbarText.style.lineHeight = (this.height) + "px";
        tabbarText.style.color = this.textColorNomal;
        var divChild = this.blockItems[i];
        divChild.appendChild(tabbarText);
        this.blockText.push(tabbarText);
    }

    var target = this;
    for (i = 0; i < this.totalItem; i++) {
        var item = this.blockItems[i];
        item.addEventListener('click', function (e) {
            clickItemTabbarText(e, target);
        }, false);
    }
}
//anhntt refresh bottombar shortcut
BottomBar.prototype.refBottomBarShotCut = function(inWidth,inHeight,inID){
    this.blockItems = new Array();
    this.blockText = new Array();
    this.blockIcons = new Array();
    var hText = 15;
    var hIcon = 22;
    var wItem = inWidth / this.totalItem;
    var mainview = document.getElementById('mainview').offsetWidth;
    //add block div for item
    for (i = 0; i < this.totalItem; i++) {
        var div = document.getElementById("tabbarShortCutItem" + inID + (i));
        if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
            div.style.width = ((inWidth-24) / this.totalItem ) + "px";
        }else{
            div.style.width = wItem + "px";
        }
        //div.style.width = wItem + "px";
        this.blockItems.push(div);
    }
    //add block icon
    for (i = 0; i < this.totalItem; i++) {
        var div = document.createElement("div");
        var div = document.getElementById("tabbarShortCutIcon" + inID + (i));
        if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
            div.style.width = ((inWidth-24) / this.totalItem) + "px";
            div.style.position= 'absolute';
            if(this.totalItem == 4){
                div.style.marginLeft= '-27%';
            }else if(this.totalItem == 3){
                div.style.marginLeft= '-21%';
            }else if(this.totalItem == 2){
                div.style.marginLeft= '-14%';
            }else if(this.totalItem == 1){
                div.style.marginLeft= '-7%';
            }
        }else{
            div.style.width = wItem + "px";
            div.style.position='relative';
            div.style.marginLeft= '0';
        }
        this.blockIcons.push(div);
    }
    //add text
    for (i = 0; i < this.totalItem; i++) {
        var tabbarText = document.createElement("p");
        var tabbarText = document.getElementById("tabbarShortCutText" + inID + (i));
        if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
            tabbarText.style.width = ((inWidth-24) / this.totalItem ) + "px";
            tabbarText.style.lineHeight = "33px";
            tabbarText.style.height = "auto";
            tabbarText.style.marginLeft = "7px";
        }else{
            tabbarText.style.width = (wItem + 20) + "px";
            tabbarText.style.height = hText + "px";
            tabbarText.style.lineHeight = (hText -3) + "px";
            tabbarText.style.marginLeft = 0;
        }
        this.blockText.push(tabbarText);
    }
}
BottomBar.prototype.showBottomBarShortCut = function (parent, inID,isCallBack,callBack,allowActive) {
    this.blockItems = new Array();
    this.blockText = new Array();
    this.blockIcons = new Array();

    var hText = 15;
    var hIcon = 22;
    var wItem = this.screenWidth / this.totalItem;
    var mainview = document.getElementById('mainview').offsetWidth;
    //add block div for item
    for (i = 0; i < this.totalItem; i++) {
        var div = document.createElement("div");
        div.setAttribute("id", "tabbarShortCutItem" + inID + (i));
        div.setAttribute("class", "tabbarItem ripple-add-on");

        if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
            div.style.width = ((mainview-28) / this.totalItem )+ "px";
        }else{
            div.style.width = wItem + "px";
        }
        div.style.background = this.backgroundColor;
        div.style.height = 47 + "px";
        parent.appendChild(div);
        this.blockItems.push(div);
    }

    //add block icon
    for (i = 0; i < this.totalItem; i++) {
        var divChild = this.blockItems[i];
        var div = document.createElement("div");
        div.setAttribute("id", "tabbarShortCutIcon" + inID + (i));
        div.setAttribute("class", this.itemBottoms[i].icon);
        if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
            div.style.width = ((mainview-80) / this.totalItem) + "px";
            div.style.position= 'absolute';
            if(this.totalItem == 4){
                div.style.marginLeft= '-27%';
            }else if(this.totalItem == 3){
                div.style.marginLeft= '-21%';
            }else if(this.totalItem == 2){
                div.style.marginLeft= '-14%';
            }else if(this.totalItem == 1){
                div.style.marginLeft= '-7%';
            }
//
        }else{
            div.style.width = wItem + "px";
        }

        div.style.fontSize = '22px';
        div.style.paddingTop = '5px';
        divChild.appendChild(div);
        this.blockIcons.push(div);
    }

    //add text 
    for (i = 0; i < this.totalItem; i++) {
        var tabbarText = document.createElement("p");
        tabbarText.setAttribute("id", "tabbarShortCutText" + inID + (i));
        tabbarText.innerHTML = CONST_STR.get(this.itemBottoms[i].keyLang);
//        alert(CONST_STR.get(this.itemBottoms[i].keyLang));
        tabbarText.setAttribute("class", "tabBarText");

        if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
           tabbarText.style.width = ((mainview-28) / this.totalItem ) + "px";
            tabbarText.style.lineHeight=  '33px';
            tabbarText.style.marginLeft = "10px";
        }else{
            tabbarText.style.width = wItem + "px";
            tabbarText.style.margin = '0px';
            tabbarText.style.lineHeight = (hText -3) + "px";
            tabbarText.style.height = hText + "px";
        }
        tabbarText.style.color = '#e1bee7'
        tabbarText.style.left = "0px";

        var divChild = this.blockItems[i];
        divChild.appendChild(tabbarText);
        this.blockText.push(tabbarText);
    }
    if(allowActive)
    {
        var parentContainer = document.getElementById("tabbarShortCutText" + inID + "0").parentNode.parentNode;
        var arrayChild = parentContainer.querySelectorAll('.tabbarItem');
        var myElement=arrayChild[0];
        var oldClass=myElement.className;
        myElement.className=oldClass+" selectedShorcut";
    }
    var target = this;
    for (i = 0; i < this.totalItem; i++) {
        var item = this.blockItems[i];
        item.addEventListener('click', function (e) {
            clickItemTabbarShortCut(e, target,isCallBack,callBack,allowActive);
        }, false);

    }
}

function clickItemTabbarHome(e, target) {
    var idTarget = e.target.id || e.currentTarget.id;;
    var index = idTarget.substring(idTarget.length - 1, idTarget.length);
    if (target.previousHomeSelected != index) {
        setSelectedTabbarItemHome(index,target);
        target.previousHomeSelected = index;
        target.options.selectIndex(index);
    }
}

function clickItemTabbarText(e, target) {
    var idTarget = e.target.id || e.currentTarget.id;;
    var index = idTarget.substring(idTarget.length - 1, idTarget.length);
    if (target.previousTabbarTextSelected != index) {
        setSelectedTabbarTextItem(index, target);
        target.previousTabbarTextSelected = index;
        target.options.selectIndex(index);
    }
}

function clickItemTabbarShortCut(e, target,isCallBack,callBack,allowActive) {
    var idTarget = e.target.id || e.currentTarget.id;
    var index = idTarget.substring(idTarget.length - 1, idTarget.length);
    if (isCallBack) {
        if(allowActive){
            addClassSelectedTabbarShorcut(idTarget,index);

        }


        callBack(index);
    } else {
        eval(target.itemBottoms[index].src);
    }
}

function addClassSelectedTabbarShorcut(idTarget,index){
    //alert(idTarget);
    var parentContainer;
    parentContainer  = document.getElementById(idTarget).parentNode.parentNode;
    var arrayChild = parentContainer.querySelectorAll('.tabbarItem');
    for (var i = 0; i < arrayChild.length; i++) {
        var element = arrayChild[i];
        var classDefault = element.className;
        var str=classDefault.toString();
        if(i==index&&str.includes("selectedShorcut"))
            return;
        else
            element.className = classDefault.replace("selectedShorcut", "");
    }
    var itemoldclass=arrayChild[index].className;
    arrayChild[index].className=itemoldclass+" selectedShorcut";



}

function setSelectedTabbarItemHome(index, target) {
    for (i = 0; i < target.blockItems.length; i++) {
        target.blockItems[i].style.background = target.options.backgroundColor;
        target.blockText[i].style.color = target.options.textColorNomal;
        target.blockIcons[i].style.color = target.options.textColorNomal;
    }

    target.blockItems[index].style.background = target.options.backgroundColorSelected;
    target.blockText[index].style.color = target.options.textColorSelected;
    target.blockIcons[index].style.color = target.options.textColorSelected;
}

function setSelectedTabbarTextItem(index, target) {
    for (i = 0; i < target.blockItems.length; i++) {
        target.blockItems[i].style.background = target.options.backgroundColor;
        target.blockText[i].style.color = target.options.textColorNomal;
        target.blockLine[i].style.height = target.options.lineHeightNormal + "px";
        target.blockLine[i].style.background = target.options.lineColorNormal;
    }

    target.blockItems[index].style.background = target.options.backgroundColorSelected;
    target.blockText[index].style.color = target.options.textColorSelected;
    target.blockLine[index].style.height = target.options.lineHeightSelected + "px";
    target.blockLine[index].style.background = target.options.lineColorSelected;
}

BottomBar.prototype.showBottomBar = function (idParrent) {
    if (idParrent) {
        var parent = document.getElementById(idParrent);
        if (parent) {
            //check tabbar really init
            var tabbar = document.getElementById(this.id);
            if (tabbar) {
                tabbar.remove();
            }

            tabbar = document.createElement("div");
            tabbar.setAttribute("class", "tabbarNav");
            tabbar.setAttribute("id", "tabbar");
            tabbar.style.height = this.height + 'px';
            tabbar.style.width = this.width + 'px';
            tabbar.style.background = this.backgroundColor;

            parent.appendChild(tabbar);

            var hText = this.height * 15 / 49;
            var hIcon = this.height - 1 - hText;
            var wItem = this.screenWidth / this.totalItem;
            if (this.totalItem > 0 && this.iconNormal && this.iconSelected && this.totalItem == this.iconNormal.length && this.totalItem == this.iconSelected.length && this.totalItem == this.textContent.length) {
                this.blockItems = new Array();
                this.blockIcons = new Array();
                this.blockText = new Array();
                this.blockLine = new Array();

                //add block div for item
                for (i = 0; i < this.totalItem; i++) {
                    var div = document.createElement("div");
                    div.setAttribute("id", "tabbarItem" + (i));
                    div.setAttribute("class", "tabbarItem ripple-add-on");
                    div.style.width = wItem + "px";
                    div.style.top = '0px';
                    div.style.height = (this.height) + "px";
                    tabbar.appendChild(div);
                    this.blockItems.push(div);
                }

                //add block icon
                for (i = 0; i < this.totalItem; i++) {
                    var divChild = this.blockItems[i];
                    var tabbarIcon = document.createElement("img");
                    tabbarIcon.setAttribute("id", "tabbarIcon" + (i));
                    tabbarIcon.setAttribute('src', './assets/imagestest/' + this.iconNormal[i]);
                    tabbarIcon.setAttribute('alt', 'na');
                    tabbarIcon.setAttribute('height', hIcon + 'px');
                    tabbarIcon.setAttribute('width', hIcon + 'px');
                    divChild.appendChild(tabbarIcon);
                    this.blockIcons.push(tabbarIcon);
                }

                //add text 
                for (i = 0; i < this.totalItem; i++) {
                    var tabbarText = document.createElement("p");
                    tabbarText.setAttribute("id", "tabbarText" + (i));
                    tabbarText.innerHTML = this.textContent[i];
                    tabbarText.setAttribute("class", "tabBarText");
                    tabbarText.style.top = hIcon + "px";
                    tabbarText.style.width = wItem + "px";
                    tabbarText.style.height = hText + "px";
                    tabbarText.style.left = "0px";
                    tabbarText.style.margin = '0px';
                    tabbarText.style.color = this.textColorNomal;
                    var divChild = this.blockItems[i];
                    divChild.appendChild(tabbarText);
                    this.blockText.push(tabbarText);
                }

                //add line color 
                for (i = 0; i < this.totalItem; i++) {
                    var divLine = document.createElement("div");
                    divLine.setAttribute("id", "tabbarLine" + (i));
                    divLine.setAttribute("class", "tabbarLine");
                    divLine.style.width = wItem + "px";
                    divLine.style.top = '0px';
                    divLine.style.height = this.lineHeightNormal + "px";
                    divLine.style.position = 'absolute';
                    divLine.style.background = this.lineColorNormal;
                    var divChild = this.blockItems[i];
                    divChild.appendChild(divLine);
                    this.blockLine.push(divLine);
                }

                //add style border top
                tabbar.style.borderTop = this.borderTop;
            } else {
                this.blockItems = new Array();
                this.blockText = new Array();
                this.blockLine = new Array();

                //add block div for item
                for (i = 0; i < this.totalItem; i++) {
                    var div = document.createElement("div");
                    div.setAttribute("id", "tabbarItem" + (i));
                    div.setAttribute("class", "tabbarItem ripple-add-on");
                    div.style.width = wItem + "px";
                    //div.style.top = '1px';
                    div.style.height = (this.height) + "px";
                    //div.style.borderTop = this.borderTop;
                    tabbar.appendChild(div);
                    this.blockItems.push(div);

                }

                for (i = 0; i < this.totalItem; i++) {
                    var divLine = document.createElement("div");
                    divLine.setAttribute("id", "tabbarLine" + (i));
                    divLine.setAttribute("class", "tabbarLine");
                    divLine.style.width = wItem + "px";
                    divLine.style.top = '0px';
                    divLine.style.height = this.lineHeightNormal + "px";
                    divLine.style.position = 'absolute';
                    divLine.style.background = this.lineColorNormal;
                    var divChild = this.blockItems[i];
                    divChild.appendChild(divLine);
                    this.blockLine.push(divLine);
                }

                //add text 
                for (i = 0; i < this.totalItem; i++) {
                    var tabbarText = document.createElement("p");
                    tabbarText.setAttribute("id", "tabbarText" + (i));
                    tabbarText.innerHTML = this.textContent[i];
                    tabbarText.setAttribute("class", "tabBarText");
                    tabbarText.style.width = wItem + "px";
                    tabbarText.style.height = (this.height) + "px";
                    tabbarText.style.left = "0px";
                    tabbarText.style.margin = '0px';
                    tabbarText.style.lineHeight = (this.height) + "px";
                    tabbarText.style.color = this.textColorNomal;
                    var divChild = this.blockItems[i];
                    divChild.appendChild(tabbarText);
                    this.blockText.push(tabbarText);
                }
            }
            this.addListener();

        } else {
            alert('not found parrent id to add bottom menu');
        }
    }
};

BottomBar.prototype.setSelectedtAtIndex = function (index) {
    if (index > this.totalItem - 1)
        alert('over flow number items');
    //change text
    var tabbarText = this.blockText[index];

    for (i = 0; i < this.blockText.length; i++) {
        var tabbarItems = this.blockText[i];
        if (tabbarItems.style) {
            tabbarItems.style.color = this.textColorNomal;
        }
    }

    if (tabbarText) {
        tabbarText.style.color = this.textColorSelected;
        console.log(index);
    }

    //change icon
    if (this.blockIcons) {
        var tabbarIcon = this.blockIcons[index];

        for (i = 0; i < this.blockIcons.length; i++) {
            var tIcon = this.blockIcons[i];
            tIcon.src = './assets/imagestest/' + this.iconNormal[i];
        }

        if (tabbarIcon) {
            tabbarIcon.src = './assets/imagestest/' + this.iconSelected[index];
        }
    }

    //change block line
    if (this.blockLine) {
        var divLine = this.blockLine[index];

        for (i = 0; i < this.blockLine.length; i++) {
            var tLine = this.blockLine[i];
            tLine.style.height = this.lineHeightNormal + "px";
            tLine.style.background = this.lineColorNormal;
        }
        if (divLine) {
            divLine.style.height = this.lineHeightSelected + "px";
            divLine.style.background = this.lineColorSelected;
        }
    }

    if (this.blockItems) {
        var divItem = this.blockItems[index];

        for (i = 0; i < this.blockItems.length; i++) {
            var tItems = this.blockItems[i];
            tItems.style.background = this.backgroundColor;
        }
        if (divItem) {
            divItem.style.background = this.backgroundColorSelected;
        }
    }
    this.options.selectIndex(index);
    //change background
    previousSelected = index;
};

function setSelectedtAtIndexWithID(index, idBottombar) {
    var bottomBar = bottomBarArray["bottomBarText" + idBottombar];
    if (bottomBar) {
        setSelectedTabbarTextItem(index, bottomBarArray["bottomBarText" + idBottombar]);
        var pageSelect = bottomBar.itemBottoms[index].src;
        if (htmlPages.indexOf(pageSelect) != -1) {
            navController.pushToViewAndRemoveOtherPage(bottomBar.itemBottoms[index].src, bottomBar.itemBottoms, idBottombar, true, 'html');
        } else {
            navController.pushToViewAndRemoveOtherPage(bottomBar.itemBottoms[index].src, bottomBar.itemBottoms, idBottombar, true, 'xsl');
        }
    } else {
        alert('khong ton tai bottom bar voi id ' + idBottombar);
    }
}

BottomBar.prototype.removeSelected = function () {
    if (this.blockText) {
        for (i = 0; i < this.blockText.length; i++) {
            var tabbarItems = this.blockText[i];
            if (tabbarItems.style) {
                tabbarItems.style.color = this.textColorNomal;
            }
        }
    }

    if (this.blockIcons) {
        for (i = 0; i < this.blockIcons.length; i++) {
            var tIcon = this.blockIcons[i];
            tIcon.src = './assets/imagestest/' + this.iconNormal[i];
        }
    }

    if (this.blockLine) {
        for (i = 0; i < this.blockLine.length; i++) {
            var tLine = this.blockLine[i];
            tLine.style.height = this.lineHeightNormal + "px";
            tLine.style.background = this.lineColorNormal;
        }
    }

    if (this.blockItems) {
        for (i = 0; i < this.blockItems.length; i++) {
            var tItems = this.blockItems[i];
            tItems.style.background = this.backgroundColor;
        }
    }
    previousSelected = -1;
};

BottomBar.prototype.addListener = function () {
    var blockItems = this.blockItems;
    var blockLines = this.blockLine;
    var blockIcons = this.blockIcons;
    var blockText = this.blockText;

    var option = this.options;

    for (i = 0; i < this.totalItem; i++) {
        var item = this.blockItems[i];
        item.addEventListener('click', function (e) {
            clickItemTabbar(e, blockItems, blockLines, blockIcons,blockText, option);
        }, false);
    }
};

// Helper function to get an element's exact position
function getPosition(el) {
    var xPos = 0;
    var yPos = 0;

    while (el) {
        if (el.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            var yScroll = el.scrollTop || document.documentElement.scrollTop;

            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
            // for all other non-BODY elements
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
    }
    return {
        x: xPos,
        y: yPos
    };
}

function clickItemTabbar(e, blockItems, blockLines, blockIcons, blockText, option) {
    var idTarget = e.target.id || e.currentTarget.id; ;
    var index = idTarget.substring(idTarget.length - 1, idTarget.length);
    var tabbarText = document.getElementById("tabbarText" + index);
    var tabbarIcon = document.getElementById("tabbarIcon" + index);

    if (index != previousSelected) {
        option.selectIndex(index);

        for (i = 0; i < blockText.length; i++) {
            var tabbarItems = blockText[i];
            if (tabbarItems.style) {
                tabbarItems.style.color = option.textColorNomal;
            }
        }

        if (tabbarText) {
            tabbarText.style.color = option.textColorSelected;
        }

        if (blockIcons) {
            for (i = 0; i < blockIcons.length; i++) {
                var tIcon = blockIcons[i];
                tIcon.src = './assets/imagestest/' + option.iconNormal[i];
            }

            if (tabbarIcon) {
                tabbarIcon.src = './assets/imagestest/' + option.iconSelected[index];
            }
        }

        //change block line
        if (blockLines) {
            var divLine = blockLines[index];

            for (i = 0; i < blockLines.length; i++) {
                var tLine = blockLines[i];
                tLine.style.height = option.lineHeightNormal + "px";
                tLine.style.background = option.lineColorNormal;
            }
            if (divLine) {
                divLine.style.height = option.lineHeightSelected + "px";
                divLine.style.background = option.lineColorSelected;
            }
        }

        if (blockItems) {
            var divItem = blockItems[index];

            for (i = 0; i < blockItems.length; i++) {
                var tItems = blockItems[i];
                tItems.style.background = option.backgroundColor;
            }
            if (divItem) {
                divItem.style.background = option.backgroundColorSelected;
            }
        }

        previousSelected = index;
    }

    if (e) {
        //remove span
        var spans = e.currentTarget.getElementsByTagName("span");
        var len = spans.length;
        for (var i = 0; i < len; i++) {
            if (spans[i].className.toLowerCase() == "ripple rippleeffect") {
                spans[i].parentNode.removeChild(spans[i]);
            }
        }


        var buttonWidth = e.currentTarget.clientWidth;
        var buttonHeight = e.currentTarget.clientHeight;

        var newNode = document.createElement('span');
        newNode.className = 'ripple';

        e.currentTarget.appendChild(newNode);
        // Make it round!
        if (buttonWidth >= buttonHeight) {
            buttonHeight = buttonWidth;
        } else {
            buttonWidth = buttonHeight;
        }

        var offset = getPosition(e.currentTarget);
        var x = e.clientX - offset.x - buttonWidth / 2;
        var y = e.clientY - offset.y - buttonHeight / 2;

        newNode.className += " " + "rippleEffect";
        newNode.style.width = buttonWidth + "px";
        newNode.style.height = buttonHeight + "px";
        newNode.style.top = y + "px";
        newNode.style.left = x + "px";
    }
}
