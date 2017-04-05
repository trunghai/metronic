
/*init actionbar*/
var cacheTitleBar = {};
var cachePagesStepSequence = [];
var currentTitle = '';
var currentPage = ''
var actionbar = {
    initDefaultActionbar: function () {
        console.log(duy);
    },
    resumeView : function (page){
        resumeView();
        if (cacheTitleBar[page] != null) {
            this.setTitleBarOnly(cacheTitleBar[page]);
            cacheTitleBar[page] = null;
            this.setHavingBackground(false);
        } else {
            this.showNavHeaderBar();
            this.setHavingBackground(true);
        }
    },
//anhntt refresh actionbar
      refreshActionBar : function(page){
          if(cacheTitleBar[page]!= null){
              this.setTitleBarOnly(cacheTitleBar[page]);
              this.setHavingBackground(false);
          }else{
              this.showNavHeaderBar();
              this.setHavingBackground(true);
          }
          this.showStepSequence(currentPage);
          if(gModeScreenView == CONST_MODE_SCR_SMALL){
              var iconTa=document.getElementById("iconTa");
              if(iconTa){
                  iconTa.style.display="none";
              }
          }else{
              if(iconTa){
                  iconTa.style.display="block";
              }
          }
    },
    hideActionbar : function(){
        var pageHeader = document.getElementById('navActionbar');
        if (pageHeader) {
            pageHeader.style.display = 'none';
        }
    },
    showActionBar : function(){
        var pageHeader = document.getElementById('navActionbar');
        if (pageHeader) {
            pageHeader.style.display = 'block';
        }
    },
    initActionBarAddBackStack: function (curPage) {
        var temp = navController.countCurrentView();
        console.log(curPage + ":" + curPage);
        initActionbar(curPage);
    },
    initActionBarAddPopAll: function (curPage) {
        initActionbar(curPage);
        this.showNavHeaderBar();
        this.setHavingBackground(true);
        if(curPage == 'homepage/homepage-dynamic-scr' && gModeScreenView == CONST_MODE_SCR_MEDIUM){
            setTitleBar(CONST_STR.get('MENU_HOME_PAGE'));
        }
    },
    setTitleBarHideSubTitleBar: function (title) {

    },
    setTitleBarAndSubTitleBar: function (title,subTitle) {

    },
    setTitleBarOnly: function (title) {
           currentTitle = title;
           var titleBar = document.getElementById('nav.title');
            titleBar.style.opacity = '0';
            var subtitle = document.getElementById('nav.subtitle');
            if (subtitle) {
                subtitle.style.display = 'none';
            }
            var gift = document.getElementById('nav.btn.right2');
            if (gift) {
                gift.style.display = 'none';
            }
            var qrCode = document.getElementById('id.qrcode.btn');
            if (qrCode) {
                qrCode.style.display = 'none';
            }
            var calBtn = document.getElementById('id.call.btn');
            if (calBtn) {
                calBtn.style.display = 'none';
            }
             if(gModeScreenView == CONST_MODE_SCR_SMALL){
                 var barTitle = document.getElementById('nav.titleBar');
                 if(barTitle){
                     barTitle.style.top = '0px';
                     //daitq cmt
                     barTitle.style.left ='55px';
                     barTitle.style.right ='55px';
                 }
             } else{
                 var barTitle = document.getElementById('nav.titleBar');
                 if(barTitle){
                     barTitle.style.top = '0px';
                     //daitq cmt
                     barTitle.style.left ='13px';
                     barTitle.style.right ='55px';
                 }

             }
            if (titleBar) {
                titleBar.style.display = 'inline-block';
                titleBar.style.lineHeight = '44px';

                setTimeout(function(){
                    titleBar.innerHTML = title;
                    titleBar.style.opacity = '1';
                },1000);
            }
    },
    addListSequence: function(page){
        //kiem tra input
        if(typeof page !== 'string')
            return

        var flagCheckSequence = true;

        //kiem tra da co trong cache list page sequence
        if(cachePagesStepSequence.length > 0){
            for(var z=0; z < cachePagesStepSequence.length; z++){
                if(cachePagesStepSequence[z] == page){
                    flagCheckSequence = false;
                }
            }
        }

        if (flagCheckSequence == true && page !== "")
        {
            cachePagesStepSequence.push(page);
        }
    },
    showStepSequence : function(curPage){

        // check cache
        var flagCheck = false;
        var flagCreate =false
        if(cachePagesStepSequence.length > 0)
        {
            for(var j =0 ; j< cachePagesStepSequence.length; j++)
            {
                var tmp = cachePagesStepSequence[j].trim();
                if(tmp === curPage.trim())
                {
                    flagCheck = true;
                    break;
                }
            }
        }
        //show
        if(flagCheck == true){
            var gSequence = getSequenceFormIdx();

            var indexSequence = gSequence == 401? 1 : gSequence == 301? 1: gSequence == 302 ? 2 : gSequence == 402 ? 3
                : gSequence == 303 ? 3  : gSequence == 404 ? 3 : 0;

            var divSteps = null;
            try{
                var navstepSequence = document.querySelector("#nav.stepSequence");
                if(navstepSequence !==null ){
                    navstepSequence.innerHTML =="";
                    divSteps = navstepSequence
                }
                else{
                    var navstepId = document.getElementById('nav.stepSequence');
                    if(navstepId !== null)
                    {

                        navstepId.innerHTML ="";
                        divSteps = navstepId
                    }else{
                        divSteps = document.createElement("div")
                        flagCreate = true;
                    }

                }
            }catch(ex){
                console.log(ex);
                divSteps = document.createElement("div");
                flagCreate =true;
            }

            divSteps.id = 'nav.stepSequence';
            if(gModeScreenView==CONST_MODE_SCR_SMALL){
                divSteps.style.fontSize = '25px';
                divSteps.style.width = '100%';
                divSteps.style.position = 'absolute';
                divSteps.style.bottom = '-10px';
                divSteps.style.textAlign = 'center';
                divSteps.style.transition = 'all 0.3s ease-in-out';
                divSteps.style.opacity = '0';
                divSteps.style.marginLeft = '0';
            }else{
                divSteps.style.fontSize = '38px';
                divSteps.style.width = '100%';
                divSteps.style.position = 'absolute';
                divSteps.style.bottom = '-2px';
                divSteps.style.textAlign = 'right';
                divSteps.style.transition = 'all 0.3s ease-in-out';
                divSteps.style.opacity = '0';
                divSteps.style.marginLeft = '41px';
            }

            for(var i=0; i<3 ; i++){
                var iStep = document.createElement("span");
                iStep.className = '';
                iStep.style.borderRadius = "3px";
                iStep.style.margin = "3px";
                //iStep.style.color = i > (indexSequence-1) ? "#F53": "#FFF";
                iStep.style.color = i == (indexSequence-1) ? "#fb8c00": "#FFF";
//                    iStep.style.color = "rgb(230, 135, 29)";
                iStep.innerHTML = '&bull;';
                divSteps.appendChild(iStep);
            }

            if(flagCreate==true)
            {
                var titleBar = document.getElementById('nav.titleBar');
                titleBar.appendChild(divSteps);
            }
            setTimeout(function(){
                divSteps.style.opacity = '1';
            },300);

        }
        else{
            try{

                var nav = document.getElementById('nav.stepSequence');
                if(nav !==null && nav !== undefined){
                    //nav.parentNode.removeChild(nav);
                    nav.innerHTML ="";
                }
            }catch(ex){
                console.log(ex);
            }

        }



    },
    getCurrrentTitleBar : function(){
        var titleBar = document.getElementById('nav.title');
        if (titleBar && titleBar.style.display != 'none') {
            return currentTitle;
        } else {
            return '';
        }
    },
    setHavingBackground : function(e){
        var actionbar = document.getElementById('navActionbar');
        if (actionbar&&gModeScreenView == CONST_MODE_SCR_SMALL) {
            actionbar.style.background = e ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0)';
            actionbar.style.borderBottom = e ? 'solid 1px rgba(255, 255, 255, 0.2)' : 'none';
        }else if(actionbar){
            actionbar.style.borderBottom="solid 1px rgba(123,31,162,0.3)";
            actionbar.style.background="rgba(255,255,255,0)";
        }
    },
    hideNavHeaderBar : function (){
        var headerbar = document.getElementById('nav.headerbar');
        if (headerbar) {
            headerbar.style.opacity = '0';
            headerbar.style.display = 'none';
            document.getElementById('navActionbar').style.height = '44px';
        }
    },
    showNavHeaderBar : function(){
        var headerbar = document.getElementById('nav.headerbar');
        var titleBar = document.getElementById('nav.title');
        var subtitle = document.getElementById('nav.subtitle');
        if (titleBar && gModeScreenView == CONST_MODE_SCR_SMALL){
            titleBar.style.display = 'none';
            titleBar.style.opacity = '0';
        }else {
            titleBar.style.opacity = '0';
        }
        if (subtitle)
            subtitle.style.display = 'none';
        if (headerbar) {
            //anhntt cmt
            if(gModeScreenView == CONST_MODE_SCR_SMALL){
                headerbar.style.display = 'block';
                document.getElementById('navActionbar').style.height = '161px';
                setTimeout(function(){
                    headerbar.style.opacity = '1';
                },500);
            }
            else{
                headerbar.style.opacity = '1';
            }

        }
        var barTitle = document.getElementById('nav.titleBar');
        if(titleBar){
            if(gModeScreenView == CONST_MODE_SCR_SMALL){
                titleBar.style.textAlign='center';
            }else{
                titleBar.style.textAlign='left';
            }

            titleBar.style.position='relative';
        }
        //anhntt chinh sua gioa dien desktop
       if(gModeScreenView == CONST_MODE_SCR_SMALL){
           var gift = document.getElementById('nav.btn.right2');
           if (gift) {
               gift.style.display = 'block';
               if (gUserInfo.userAvatar) {
                   document.getElementById('nav.btn.right2').innerHTML = '<div id="notifi-number-top" class="icon-number-notifi" style="visibility:hidden; right: 0px;padding: 4px;position: absolute;background: #f2571a;border-radius: 50%;"></div><img width="28px" onerror="this.src=\'./assets/images/acc-info-img.png\'" onclick="onpenNotification();" height="28px" style="border: solid 2px #fff;border-radius: 100%;" src="' + gUserInfo.userAvatar + '" />';
                   document.getElementById('nav.btn.right2').style.backgroundColor = "transparent";
                   document.getElementById('nav.btn.right2').style.marginRight = '6px';
                   document.getElementById('nav.btn.right2').style.marginTop = '8px';
               } else {
                   document.getElementById('nav.btn.right2').innerHTML = '<span onclick="onpenNotification();"  class="icon-logo ripple-add-on" style="font-size:20px;border-radius: 100%;background: #561f45;padding: 5px;"/>';
                   document.getElementById('nav.btn.right2').style.marginRight = '6px';
                   document.getElementById('nav.btn.right2').style.marginTop = '12px';
               }
           }
           var qrCode = document.getElementById('id.qrcode.btn');
           if (qrCode) {
               qrCode.style.display = 'block';
           }

           var calBtn = document.getElementById('id.call.btn');
           if (calBtn) {
               calBtn.style.display = 'block';
           }
       } else{
           //anhntt cmt
           document.getElementById('nav.btn.right2').style.display='none';
           document.getElementById('id.qrcode.btn').style.display='none';
           document.getElementById('id.call.btn').style.display='none';
           document.getElementById('nav.icon.tpbank').style.display='none';
           var barTitle = document.getElementById('nav.titleBar');
           if(barTitle){
               barTitle.style.textAlign = 'left';
           }
           var icon = document.getElementById("iconTa");
           if(icon){
               icon.style.display="block";
           }
       }
        
    },
    getHeight: function () {
        var headerbar = document.getElementById('nav.headerbar');
        if (headerbar && headerbar.style.display != 'none' && document.getElementById('navActionbar').style.display!='none') {
            if(gModeScreenView == CONST_MODE_SCR_SMALL){
                return 155;
            }else{
                return 44;
            }
        } else if (document.getElementById('navActionbar').style.display != 'none') {
            return 44;
        } else {
            return 0;
        }
    },
    setCustomerName: function (e) {
        var customername = document.getElementById('nav.title.customername');
        if (customername) {
            customername.innerHTML = e;
        }
    },
    setDateTime: function (e) {
        var datetime = document.getElementById('nav.title.datetime');
        if (datetime) {
            datetime.innerHTML = e;
        }
    },
    cacheTitle: function (page) {
        if (currentTitle != null || currentTitle != '') {
            cacheTitleBar[page] = currentTitle;
            currentPage = page;
            console.log("khanhduy.le" + page + ":" + currentTitle);

            //hien thi Sequence
            this.showStepSequence(currentPage);
        }
    }
}

function initActionbar(ePage) {
    if (ePage != "login-scr" && ePage != '') {
        var pageHeader = document.getElementById('navActionbar');
        if(!gIsLogin && gModeScreenView == CONST_MODE_SCR_MEDIUM){
            pageHeader.style.position = "absolute";
            pageHeader.style.marginLeft = "147px";
            document.getElementById("nav.title").style.textAlign = "left";
            document.getElementById("nav.title").style.position = "relative";
            document.getElementById("nav.title").style.color = "#000";
            document.getElementById("iconTa").style.display = "block";
//            pageHeader.style.top = (-document.getElementById("tabHost").offsetHeight +25)+"px";
        }else if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
            pageHeader.style.position = "";
            pageHeader.style.marginLeft = "";
        }
        if(ePage == 'homepage/homepage-dynamic-scr' && gModeScreenView == CONST_MODE_SCR_MEDIUM){
            var barTitle = document.getElementById('nav.titleBar');
            if(barTitle){
                barTitle.style.top = '0px';
                //daitq cmt
                barTitle.style.left ='13px';
                barTitle.style.right ='55px';
            }
            setTitleBar(CONST_STR.get('MENU_HOME_PAGE'));
        }
        pageHeader.style.display = 'block';
        //hide header mb
        var pageHeaderOri = document.getElementById('headermb');
        if (pageHeaderOri) {
            pageHeaderOri.style.display = 'none';
        }

        var btnHome = document.getElementById('nav.btn.home');
        var countView = navController.countCurrentView();

        btnHome.removeEventListener("click", clickHomeOrBack);
        btnHome.addEventListener("click", clickHomeOrBack);
            var iconHome = document.getElementById('nav.icon.tpbank');


        if (countView > 1) {
            btnHome.className = 'icon-back handle ripple-add-on';
            if(gModeScreenView == CONST_MODE_SCR_SMALL){
                btnHome.style.display = 'block';
            }
            iconHome.style.display = 'none';
        } else {
            btnHome.className = 'icon-menu handle ripple-add-on';
            btnHome.style.display = 'none';
            if(gModeScreenView == CONST_MODE_SCR_SMALL){
                btnHome.style.display = 'block';
                iconHome.style.display = 'block';
            }
        }

        var btnHomeRight = document.getElementById('nav.btn.homeright');
        btnHomeRight.removeEventListener("click", clickHomeRightBar);
        btnHomeRight.addEventListener("click", clickHomeRightBar);       
    } else {
        var pageHeaderOri = document.getElementById('headermb');
        if (pageHeaderOri) {
            pageHeaderOri.style.display = 'block';
        }
    }
}

function clickHomeRightBar() {
    showSlideMenu();
}

function clickHomeOrBack() {
    navCachedPages["account/create/search_no_tenor/account_tenor_deposit"] = null;
    navCachedPages["cardservice/view/list/credit-list-scr"] = null;

    var countView = navController.countCurrentView();
    if (countView > 1) {
        var page = navController.getCurrentPage();
        if (page == 'com-review-result-scr' || page == 'com-result-scr') {
            navController.popViewInit(true);
        } else {

            if (clearCache){
                var src = navArrayScr[navArrayScr.length - 2];
                navCachedPages[navArrayScr[navArrayScr.length - 2]] = null;
                clearCache = false;
            }
            navController.popView(true);
        }
    } else {
        showSlideMenu();
    }
}

function resumeView() {
    var btnHome = document.getElementById('nav.btn.home');
    var iconHome = document.getElementById('nav.icon.tpbank');
    btnHome.removeEventListener("click", clickHomeOrBack);
    btnHome.addEventListener("click", clickHomeOrBack);
    var countView = navController.countCurrentView();
    if (countView > 1) {
        btnHome.className = 'icon-back handle ripple-add-on';
       if(gModeScreenView == CONST_MODE_SCR_SMALL){
           btnHome.style.display = 'block';
       }else{
           btnHome.style.display = 'none';
       }
        iconHome.style.display = 'none';
    } else {
        if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
            iconHome.style.display = 'none';
            btnHome.style.display = 'none';
        }else
        {
            iconHome.style.display = 'block';
            btnHome.style.display = 'block';
        }
        btnHome.className = 'icon-menu handle ripple-add-on';

    }
}
function onpenNotification(){
    //navController.initWithRootView('notification/list_notification_scr', true, 'xsl');
    navController.pushToView('notification/list_notification_scr', true, 'xsl');
    navController.getBottomBar().hide();
    setTitleBar(CONST_STR.get('LOGIN_NOTIFICATION'));
}