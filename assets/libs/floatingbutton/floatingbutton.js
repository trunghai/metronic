/**
* Customized Floating button control
*
* @author   DUYLK
* @version  1.0
*/
var idAnimation;
var arrayItems = new Array(); //menuItem
var arrayItemsDiv = new Array();
var arrayItemsDivText = new Array();

var arrayColor = ['#F44336', '#ffeb3b', '#4CAF50', '#2196F3', '#3f48cc'];
var arrayIconColor = ['#98c1a2', '#98c1a2', '#98c1a2', '#f0b5b5', '#3f48cc'];  //anhntt cmt mau icon
var langArray = ['MENU_ACCOUNT', 'MENU_LOCAL_TRANS', 'TOPUP_REPAYMENT_SCREEN_TITLE', 'UTILITIES_CALCULATOR_SAV_INPUT_E-SAVE', '#3f48cc'];  //anhntt cmt mau icon
//var arrayColor = ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.6)', '#3f48cc'];
//var imgArray = ["home.png", "write.png", "wallet.png", "stopwatch.png", "plus.png"];
var imgArray = ["icon-accounts", "icon-logo", "icon-topup", "icon-esavings", "plus.png"]; //anhntt cmt class icon
var urlArray = ["initMenuDetail(\'mAccInfo\');setTitleBar('"+CONST_STR.get('MENU_ACCOUNT')+"');OnclickhideMenu();", "updateAccountListInfo();actionbar.hideNavHeaderBar();actionbar.setHavingBackground(false);setTitleBar('"+CONST_STR.get('MENU_LOCAL_TRANS')+"');removePageAfter(); navController.pushToView(\'transfer/transfer-local-create-scr\', true, \'xsl\');OnclickhideMenu();", "updateAccountListInfo();actionbar.hideNavHeaderBar();actionbar.setHavingBackground(false);removePageAfter(); navController.pushToView(\'paymentxsl/payment-topup-create-scr\', true, \'xsl\');;setTitleBar('"+CONST_STR.get('TOPUP_REPAYMENT_SCREEN_TITLE')+"');OnclickhideMenu();", "removePageAfter();navController.pushToView(\'esaving/esaving-open-scr\', true, \'xsl\');actionbar.hideNavHeaderBar();actionbar.setHavingBackground(false);setTitleBar('"+CONST_STR.get('UTILITIES_CALCULATOR_SAV_INPUT_E-SAVE')+"');OnclickhideMenu();", "plus.png"]; //anhntt cmt Url
var arrayTexts = ["Tài khoản", "Chuyển tiền trong TPbank", "Nạp tiền", "Gởi tiết kiệm điện tử"];
var file='xsl';
var isShowMenu = false;
var hasJustHideMenu = false;

function removePageAfter(){
    if(navArrayScr[navArrayScr.length - 1] != "homepage/homepage-dynamic-scr"){
        navRemovePageAtIndex(navArrayScr.length - 1);
    }
}
function handlerFloatingButton(e) {
    
    //create for floating button
    var divfloatingButton = document.createElement("div");
    divfloatingButton.setAttribute("class", "floatingButton");
    divfloatingButton.setAttribute("id", "floatingButton");
    divfloatingButton.className += " " + "break-slide";
    document.getElementById(e).appendChild(divfloatingButton);
    //create for mask bg
    var divfloatingButtonMask = document.createElement("div");
    divfloatingButtonMask.setAttribute("class", "maskFloatingButton");
    divfloatingButtonMask.setAttribute("id", "maskFloatingButton");
    document.getElementById(e).appendChild(divfloatingButtonMask);


    var box2 = document.getElementById('floatingButton');
    var boxleft; // left position of moving box
    var boxTop; // top position of moving box
    var startx; // starting x coordinate of touch point
    var starty; // starting y coordinate of touch point
    var screenWidth = window.innerWidth || document.body.clientWidth;
    var screenHeight = window.innerHeight || document.body.clientHeight;
    var elementWidth = box2.getBoundingClientRect().width;
    var elementHeight = box2.getBoundingClientRect().height;
    //add icon to button

    var plusicon = document.createElement("img");
    plusicon.setAttribute("id", "plusicon");
    plusicon.setAttribute('src', './assets/imagestest/' + 'plus.png');
    plusicon.setAttribute('alt', 'na');
    plusicon.setAttribute("class", "iconnormal");
    plusicon.className += " " + "break-slide";
    plusicon.setAttribute('height', elementHeight + 'px');
    plusicon.setAttribute('width', elementWidth + 'px');
    box2.appendChild(plusicon);


    //move to bottom right
    box2.style.left = (screenWidth - elementWidth) + 'px';
    box2.style.top = (screenHeight - elementHeight - 42) + 'px';

    // console.log(screenWidth + ":" + screenWidth);
    var distX = 0; // distanceX traveled by touch point
    var distY = 0; // distanceX traveled by touch point

    var touchobj = null; // Touch object holder
    if (box2) {

    }
    box2.addEventListener('touchstart', function (e) {
        // alert("tim thay");
        touchobj = e.changedTouches[0]; // reference first touch point
        var curPos = getPosition(box2);
        boxleft = curPos.x; // parseInt(box2.style.left); // get left position of box
        boxTop = curPos.y;
        startx = parseInt(touchobj.clientX); // get x coord of touch point
        starty = parseInt(touchobj.clientY);
        if (idAnimation) {
            clearInterval(idAnimation);
        }
        if (isShowMenu) {
            plusicon.classList.remove('iconrotated');
            hideMenu();
            hasJustHideMenu = true;
        }
        e.preventDefault(); // prevent default click behavior
    }, false)

    box2.addEventListener('touchmove', function (e) {
        touchobj = e.changedTouches[0]; // reference first touch point for this event
        var distX = parseInt(touchobj.clientX) - startx; // calculate dist traveled by touch point
        var distY = parseInt(touchobj.clientY) - starty;
        // move box according to starting pos plus dist
        // with lower limit 0 and upper limit 380 so it doesn't move outside track:
        if (boxleft + distX >= 0 && boxleft + distX <= (screenWidth - elementWidth)) {
            if (Math.abs(distX) > 2)
                box2.style.left = (boxleft + distX) + 'px';
        } else if (boxleft + distX < screenWidth / 2) {
            box2.style.left = 0 + 'px';
        } else if (boxleft + distX > screenWidth / 2) {
            box2.style.left = (screenWidth - elementWidth) + 'px';
        }

        if (boxTop + distY >= 0 && boxTop + distY <= (screenHeight - elementHeight)) {
            if (Math.abs(distY) > 2)
                box2.style.top = (boxTop + distY) + 'px';
        } else if (boxTop + distY < screenHeight / 2) {
            box2.style.top = 0 + 'px';
        } else if (boxTop + distY > screenHeight / 2) {
            box2.style.top = (screenHeight - elementHeight) + 'px';
        }
        e.preventDefault();
    }, false)

    box2.addEventListener('touchend', function (e) {
        touchobj = e.changedTouches[0];
        var curPos = getPosition(box2);
        if (Math.abs(parseInt(touchobj.clientX) - startx) >= 5 || Math.abs(parseInt(touchobj.clientY) - starty) >= 5) {
            if (curPos.x >= screenWidth / 2) {
                if (parseInt(touchobj.clientY) - starty <= 0) {
                    moveRight(box2, makeEaseOut(bounce), 500, screenWidth, true);
                } else {
                    moveRight(box2, makeEaseOut(bounce), 500, screenWidth, false);
                }
            } else {
                //gia toc chay len
                if (parseInt(touchobj.clientY) - starty <= 0) {
                    moveLeft(box2, makeEaseOut(bounce), 500, screenWidth, true);
                } else {
                    moveLeft(box2, makeEaseOut(bounce), 500, screenWidth, false);
                }
            }
        } else {
            if (!isShowMenu) {
                if (!hasJustHideMenu) {
                    //rotate icon
                    plusicon.classList.add('iconrotated');
                    if (curPos.x >= screenWidth / 2) {
                        showMenuRight(box2, screenWidth, screenHeight, 4, 120, 40);//anhntt cmt
                    } else {
                        showMenuLeft(box2, screenWidth, screenHeight, 4, 120, 40);
                    }
                } else {
                    hasJustHideMenu = false;
                }
            } else {
                plusicon.classList.remove('iconrotated');
                hideMenu();
            }
        }

        e.preventDefault();
    }, false)


    var maskBg = document.getElementById('maskFloatingButton');
    if (maskBg) {
        maskBg.addEventListener('touchend', function (e) {
            if (isShowMenu) {
                plusicon.classList.remove('iconrotated');
                hideMenu();
                hasJustHideMenu = false;
            }
            e.preventDefault();
        }, false)
    }
}

function itemMenu() {
    this.centerPosX = 0; //vi tri tuong doi so voi menu chinh
    this.centerPosY = 0; //vi tri tuong doi so voi menu chinh
    this.centerPosXDes = 0;
    this.centerPosYDes = 0;
    this.centerPosXSrc = 0;
    this.centerPosYSrc = 0;

    this.widthMenu = 0;
    this.heightMenu = 0;
    this.top = 0;
    this.left = 0;
}

function hideMenu() {
    isShowMenu = false;
    hasJustHideMenu = false;
    if (arrayItems && arrayItems.length > 0 && arrayItemsDiv && arrayItemsDiv.length > 0) {
        // console.log('hideMenu');
        animate({
            delay: 10,
            duration: 100, // 1 sec by default
            delta: circ,
            step: function (delta) {
                //console.log(delta);    
                if (arrayItems && arrayItems.length > 0) {
                    for (var i = 0; i < arrayItems.length; i++) {
                        var imenu = arrayItems[i];
                        var diffX = (imenu.centerPosXSrc - imenu.centerPosXDes) * delta;
                        var diffY = (imenu.centerPosYSrc - imenu.centerPosYDes) * delta;
                        //console.log(diffY);  
                        var divMenu = arrayItemsDiv[i];
                        divMenu.style.left = (imenu.centerPosXDes - imenu.widthMenu / 2 + delta * imenu.widthMenu / 2) + 'px';
                        divMenu.style.top = (imenu.centerPosYDes - imenu.heightMenu / 2 + delta * imenu.heightMenu / 2) + 'px';
                        divMenu.style.width = (1 - delta) * imenu.widthMenu + 'px';
                        divMenu.style.height = (1 - delta) * imenu.heightMenu + 'px';
                        divMenu.style.opacity = (1 - delta);

                        //get icon
                        var floatIcon = document.getElementById("floatingButtonIcon" + i);
                        if (floatIcon) {
                            floatIcon.style.width = (1 - delta) * imenu.widthMenu / 2 + 'px';
                            floatIcon.style.height = (1 - delta) * imenu.heightMenu / 2 + 'px';
                        }
                    }
                }
                if (delta == 1) {
                    isShowMenu = false;
                    for (var i = 0; i < arrayItemsDiv.length; i++) {
                        var divMenu = arrayItemsDiv[i];
                        divMenu.remove();
                        var divText = arrayItemsDivText[i];
                        if (divText)
                            divText.remove();
                    }
                    arrayItemsDiv = new Array();
                    arrayItems = new Array();
                    arrayItemsDivText = new Array();
                    if (delta > 0.9) {
                        showHideElement('maskFloatingButton', false);
                    }
                }
            }
        })
    }
}
function OnclickhideMenu(){
     var plusicon = document.getElementById("plusicon");
    if(plusicon){
        plusicon.classList.remove('iconrotated');
        hideMenu();
    }
}

function showMenuLeft(menu, screenWidth, screenHeight, totalItems, radius, menusize) {
    var menuPos = getPosition(menu);
    var menuWidth = menu.getBoundingClientRect().width;
    var menuHeight = menu.getBoundingClientRect().height;
    var centerMenu = getCenterItem(menu);
    var mainView = document.getElementById('fullPage');
    //bottom-right

    if (screenHeight - centerMenu.y < radius) {
        var rasTemp = (Math.PI / 2) / (totalItems - 1);
        for (var i = 0; i < totalItems; i++) {
            var rasItem = (Math.PI / 2) - (i * rasTemp);
            var iMenu = new itemMenu();
            iMenu.centerPosY = Math.sin(rasItem) * radius;
            iMenu.centerPosX = Math.cos(rasItem) * radius;

            iMenu.heightMenu = menusize;
            iMenu.widthMenu = menusize;

            iMenu.centerPosXDes = centerMenu.x + iMenu.centerPosX;
            iMenu.centerPosYDes = centerMenu.y - iMenu.centerPosY;
            iMenu.centerPosXSrc = centerMenu.x;
            iMenu.centerPosYSrc = centerMenu.y;

            arrayItems.push(iMenu);


            //append text for icon
            var floatingText = document.createElement("p");
            floatingText.setAttribute("id", "floatingButtonText" + (i));
            floatingText.innerHTML = arrayTexts[i];
            floatingText.setAttribute("class", "floatingButtonText");
            var textWidth = (screenWidth - (iMenu.centerPosXDes + iMenu.widthMenu / 2) - 20) > getTextWidth(arrayTexts[i], "bold 12pt tahoma") ? getTextWidth(arrayTexts[i], "bold 12pt tahoma") :
                (screenWidth - (iMenu.centerPosXDes + iMenu.widthMenu / 2) - 20);
            floatingText.style.width = textWidth + "px";
            floatingText.style.height = 16 + "px";

            // floatingText.style.top = (iMenu.centerPosYDes - 8) + "px";
            if (totalItems > 3 && i == 0) {
                floatingText.style.top = (iMenu.centerPosYDes - iMenu.widthMenu / 2 - 8) + "px";
                floatingText.style.left = (iMenu.centerPosXDes + iMenu.widthMenu / 2) + "px";
            } else {
                floatingText.style.top = (iMenu.centerPosYDes - 8) + "px";
                floatingText.style.left = (iMenu.centerPosXDes + iMenu.widthMenu / 2 + 8) + "px";
            }

            floatingText.style.margin = '0px';
            floatingText.style.display = 'none';
            floatingText.style.textAlign = 'left';
            mainView.appendChild(floatingText);
            arrayItemsDivText.push(floatingText);

        }
    } else if (centerMenu.y <= radius) {
        var rasTemp = (Math.PI / 2) / (totalItems - 1);
        for (var i = 0; i < totalItems; i++) {
            var rasItem = i * rasTemp;
            var iMenu = new itemMenu();
            iMenu.centerPosY = Math.sin(rasItem) * radius;
            iMenu.centerPosX = Math.cos(rasItem) * radius;

            iMenu.heightMenu = menusize;
            iMenu.widthMenu = menusize;

            iMenu.centerPosXDes = centerMenu.x + iMenu.centerPosX;
            iMenu.centerPosYDes = centerMenu.y + iMenu.centerPosY;
            iMenu.centerPosXSrc = centerMenu.x;
            iMenu.centerPosYSrc = centerMenu.y;

            arrayItems.push(iMenu);

            var floatingText = document.createElement("p");
            floatingText.setAttribute("id", "floatingButtonText" + (i));
            floatingText.innerHTML = arrayTexts[i];
            floatingText.setAttribute("class", "floatingButtonText");
            var textWidth = (screenWidth - (iMenu.centerPosXDes + iMenu.widthMenu / 2) - 20) > getTextWidth(arrayTexts[i], "bold 12pt tahoma") ? getTextWidth(arrayTexts[i], "bold 12pt tahoma") :
                (screenWidth - (iMenu.centerPosXDes + iMenu.widthMenu / 2) - 20);
            floatingText.style.width = textWidth + "px";
            floatingText.style.height = 16 + "px";

            // floatingText.style.top = (iMenu.centerPosYDes - 8) + "px";
            if (totalItems > 3 && i == totalItems - 1) {
                floatingText.style.top = (iMenu.centerPosYDes + iMenu.widthMenu / 2 - 8) + "px";
                floatingText.style.left = (iMenu.centerPosXDes + iMenu.widthMenu / 2) + "px";
            } else {
                floatingText.style.top = (iMenu.centerPosYDes - 8) + "px";
                floatingText.style.left = (iMenu.centerPosXDes + iMenu.widthMenu / 2 + 8) + "px";
            }

            floatingText.style.margin = '0px';
            floatingText.style.display = 'none';
            floatingText.style.textAlign = 'left';
            mainView.appendChild(floatingText);
            arrayItemsDivText.push(floatingText);
        }
    } else {
        var rasTemp = (Math.PI / 2) / (totalItems - 1);
        for (var i = 0; i < totalItems; i++) {
            var rasItem = i * rasTemp;
            var iMenu = new itemMenu();
            if (Math.PI / 4 + rasItem < Math.PI / 2) {
                iMenu.centerPosY = Math.cos(rasItem + Math.PI / 4) * radius;
                iMenu.centerPosX = Math.sin(rasItem + Math.PI / 4) * radius;

                iMenu.heightMenu = menusize;
                iMenu.widthMenu = menusize;

                iMenu.centerPosXDes = centerMenu.x + iMenu.centerPosX;
                iMenu.centerPosYDes = centerMenu.y - iMenu.centerPosY;

                iMenu.centerPosXSrc = centerMenu.x;
                iMenu.centerPosYSrc = centerMenu.y;

                arrayItems.push(iMenu);
            } else if (Math.PI / 4 + rasItem == Math.PI / 2) {
                iMenu.centerPosY = 0;
                iMenu.centerPosX = radius;

                iMenu.heightMenu = menusize;
                iMenu.widthMenu = menusize;

                iMenu.centerPosXDes = centerMenu.x + iMenu.centerPosX;
                iMenu.centerPosYDes = centerMenu.y - iMenu.centerPosY;

                iMenu.centerPosXSrc = centerMenu.x;
                iMenu.centerPosYSrc = centerMenu.y;

                arrayItems.push(iMenu);
            } else {
                iMenu.centerPosY = Math.sin(rasItem + Math.PI / 4 - Math.PI / 2) * radius;
                iMenu.centerPosX = Math.cos(rasItem + Math.PI / 4 - Math.PI / 2) * radius;

                iMenu.heightMenu = menusize;
                iMenu.widthMenu = menusize;

                iMenu.centerPosXDes = centerMenu.x + iMenu.centerPosX;
                iMenu.centerPosYDes = centerMenu.y + iMenu.centerPosY;

                iMenu.centerPosXSrc = centerMenu.x;
                iMenu.centerPosYSrc = centerMenu.y;

                arrayItems.push(iMenu);
            }

            //append text for icon
            var floatingText = document.createElement("p");
            floatingText.setAttribute("id", "floatingButtonText" + (i));
            floatingText.innerHTML = arrayTexts[i];
            floatingText.setAttribute("class", "floatingButtonText");
            var textWidth = (screenWidth - (iMenu.centerPosXDes + iMenu.widthMenu / 2) - 20) > getTextWidth(arrayTexts[i], "bold 12pt tahoma") ? getTextWidth(arrayTexts[i], "bold 12pt tahoma") :
                (screenWidth - (iMenu.centerPosXDes + iMenu.widthMenu / 2) - 20);
            floatingText.style.width = textWidth + "px";
            floatingText.style.height = 16 + "px";
            floatingText.style.left = (iMenu.centerPosXDes + iMenu.widthMenu / 2 + 8) + "px";
            floatingText.style.top = (iMenu.centerPosYDes - 8) + "px";
            floatingText.style.margin = '0px';
            floatingText.style.display = 'none';
            floatingText.style.textAlign = 'left';
            mainView.appendChild(floatingText);
            arrayItemsDivText.push(floatingText);
        }
    }

    for (var i = 0; i < arrayItems.length; i++) {
        var imenu = arrayItems[i];
        var div = document.createElement("div");
        div.setAttribute("class", "floatingButtonItem");
        div.style.width = imenu.widthMenu + "px";
        div.style.height = imenu.heightMenu + "px";
        div.style.left = (imenu.centerPosXSrc - imenu.widthMenu / 2) + 'px';
        div.style.top = (imenu.centerPosYSrc - imenu.heightMenu / 2) + 'px';
        div.style.background = arrayColor[i];
        div.style.paddingTop = '2px'; //anhntt cmt
        mainView.appendChild(div);
        arrayItemsDiv.push(div);

        //append icon for floatItem
        var icon = document.createElement("span");
        icon.setAttribute("id", "floatingButtonIcon" + i);
        icon.setAttribute('class', imgArray[i]);
        icon.setAttribute('style', 'color:'+ arrayIconColor[i]);
        icon.setAttribute('onclick',urlArray[i]);
        icon.setAttribute('height', imenu.heightMenu / 2 + 'px');
        icon.setAttribute('width', imenu.widthMenu / 2 + 'px');
        div.appendChild(icon);
        //append text for floatItem
    }

    showMenuItem(arrayItemsDiv, earsyOut, 250);
}

function showMenuRight(menu, screenWidth, screenHeight, totalItems, radius, menusize) {
    var menuPos = getPosition(menu);
    var menuWidth = menu.getBoundingClientRect().width;
    var menuHeight = menu.getBoundingClientRect().height;
    var centerMenu = getCenterItem(menu);
    var mainView = document.getElementById('fullPage');
    //bottom-right

    if (screenHeight - centerMenu.y < radius) {
        var rasTemp = (Math.PI / 2) / (totalItems - 1);
        for (var i = 0; i < totalItems; i++) {
            var rasItem = (Math.PI / 2) - (i * rasTemp);
            var iMenu = new itemMenu();
            iMenu.centerPosY = Math.sin(rasItem) * radius;
            iMenu.centerPosX = Math.cos(rasItem) * radius;

            iMenu.heightMenu = menusize;
            iMenu.widthMenu = menusize;

            iMenu.centerPosXDes = centerMenu.x - iMenu.centerPosX;
            iMenu.centerPosYDes = centerMenu.y - iMenu.centerPosY;
            iMenu.centerPosXSrc = centerMenu.x;
            iMenu.centerPosYSrc = centerMenu.y;

            arrayItems.push(iMenu);

            //append text for icon
            var floatingText = document.createElement("p");
            floatingText.setAttribute("id", "floatingButtonText" + (i));
            floatingText.innerHTML = arrayTexts[i];
            floatingText.setAttribute("class", "floatingButtonText");
            var textWidth = ((iMenu.centerPosXDes - iMenu.widthMenu / 2) - 8) > getTextWidth(arrayTexts[i], "bold 12pt tahoma") ? getTextWidth(arrayTexts[i], "bold 12pt tahoma") :
                ((iMenu.centerPosXDes - iMenu.widthMenu / 2) - 8);
            floatingText.style.width = textWidth + "px";
            floatingText.style.height = 16 + "px";

            if (totalItems > 3 && i == 0) {
                floatingText.style.top = (iMenu.centerPosYDes - iMenu.widthMenu / 2 - 8) + "px";
                floatingText.style.left = (iMenu.centerPosXDes - iMenu.widthMenu / 2 - textWidth) + "px";
            } else {
                floatingText.style.top = (iMenu.centerPosYDes - 8) + "px";
                floatingText.style.left = (iMenu.centerPosXDes - iMenu.widthMenu / 2 - textWidth - 8) + "px";
            }
            floatingText.style.margin = '0px';
            floatingText.style.textAlign = 'right';
            floatingText.style.display = 'none';
            mainView.appendChild(floatingText);
            arrayItemsDivText.push(floatingText);
        }
    } else if (centerMenu.y <= radius) {
        var rasTemp = (Math.PI / 2) / (totalItems - 1);
        for (var i = 0; i < totalItems; i++) {
            var rasItem = i * rasTemp;
            var iMenu = new itemMenu();
            iMenu.centerPosY = Math.sin(rasItem) * radius;
            iMenu.centerPosX = Math.cos(rasItem) * radius;

            iMenu.heightMenu = menusize;
            iMenu.widthMenu = menusize;

            iMenu.centerPosXDes = centerMenu.x - iMenu.centerPosX;
            iMenu.centerPosYDes = centerMenu.y + iMenu.centerPosY;
            iMenu.centerPosXSrc = centerMenu.x;
            iMenu.centerPosYSrc = centerMenu.y;

            arrayItems.push(iMenu);

            //append text for icon
            var floatingText = document.createElement("p");
            floatingText.setAttribute("id", "floatingButtonText" + (i));
            floatingText.innerHTML = arrayTexts[i];
            floatingText.setAttribute("class", "floatingButtonText");
            var textWidth = ((iMenu.centerPosXDes - iMenu.widthMenu / 2) - 8) > getTextWidth(arrayTexts[i], "bold 12pt tahoma") ? getTextWidth(arrayTexts[i], "bold 12pt tahoma") :
                ((iMenu.centerPosXDes - iMenu.widthMenu / 2) - 8);
            floatingText.style.width = textWidth + "px";
            floatingText.style.height = 16 + "px";


            if (totalItems > 3 && i == totalItems - 1) {
                floatingText.style.top = (iMenu.centerPosYDes + iMenu.widthMenu / 2 - 8) + "px";
                floatingText.style.left = (iMenu.centerPosXDes - iMenu.widthMenu / 2 - textWidth) + "px";
            } else {
                floatingText.style.top = (iMenu.centerPosYDes - 8) + "px";
                floatingText.style.left = (iMenu.centerPosXDes - iMenu.widthMenu / 2 - textWidth - 8) + "px";
            }
            floatingText.style.margin = '0px';
            floatingText.style.textAlign = 'right';
            floatingText.style.display = 'none';
            mainView.appendChild(floatingText);
            arrayItemsDivText.push(floatingText);

        }
    } else {
        var rasTemp = (Math.PI / 2) / (totalItems - 1);
        for (var i = 0; i < totalItems; i++) {
            var rasItem = i * rasTemp;
            var iMenu = new itemMenu();
            if (Math.PI / 4 + rasItem < Math.PI / 2) {
                iMenu.centerPosY = Math.cos(rasItem + Math.PI / 4) * radius;
                iMenu.centerPosX = Math.sin(rasItem + Math.PI / 4) * radius;

                iMenu.heightMenu = menusize;
                iMenu.widthMenu = menusize;

                iMenu.centerPosXDes = centerMenu.x - iMenu.centerPosX;
                iMenu.centerPosYDes = centerMenu.y - iMenu.centerPosY;

                iMenu.centerPosXSrc = centerMenu.x;
                iMenu.centerPosYSrc = centerMenu.y;

                arrayItems.push(iMenu);
            } else if (Math.PI / 4 + rasItem == Math.PI / 2) {
                iMenu.centerPosY = 0;
                iMenu.centerPosX = radius;

                iMenu.heightMenu = menusize;
                iMenu.widthMenu = menusize;

                iMenu.centerPosXDes = centerMenu.x - iMenu.centerPosX;
                iMenu.centerPosYDes = centerMenu.y - iMenu.centerPosY;

                iMenu.centerPosXSrc = centerMenu.x;
                iMenu.centerPosYSrc = centerMenu.y;

                arrayItems.push(iMenu);
            } else {
                iMenu.centerPosY = Math.sin(rasItem + Math.PI / 4 - Math.PI / 2) * radius;
                iMenu.centerPosX = Math.cos(rasItem + Math.PI / 4 - Math.PI / 2) * radius;

                iMenu.heightMenu = menusize;
                iMenu.widthMenu = menusize;

                iMenu.centerPosXDes = centerMenu.x - iMenu.centerPosX;
                iMenu.centerPosYDes = centerMenu.y + iMenu.centerPosY;

                iMenu.centerPosXSrc = centerMenu.x;
                iMenu.centerPosYSrc = centerMenu.y;

                arrayItems.push(iMenu);
            }

            //append text for icon
            var floatingText = document.createElement("p");
            floatingText.setAttribute("id", "floatingButtonText" + (i));
            floatingText.innerHTML = arrayTexts[i];
            floatingText.setAttribute("class", "floatingButtonText");
            var textWidth = ((iMenu.centerPosXDes - iMenu.widthMenu / 2) - 8) > getTextWidth(arrayTexts[i], "bold 12pt tahoma") ? getTextWidth(arrayTexts[i], "bold 12pt tahoma") :
                ((iMenu.centerPosXDes - iMenu.widthMenu / 2) - 8);
            floatingText.style.width = textWidth + "px";
            floatingText.style.height = 16 + "px";
            floatingText.style.left = (iMenu.centerPosXDes - iMenu.widthMenu / 2 - textWidth - 8) + "px";
            floatingText.style.top = (iMenu.centerPosYDes - 8) + "px";
            floatingText.style.margin = '0px';
            floatingText.style.textAlign = 'right';
            floatingText.style.display = 'none';
            mainView.appendChild(floatingText);
            arrayItemsDivText.push(floatingText);
        }
    }

    for (var i = 0; i < arrayItems.length; i++) {
        var imenu = arrayItems[i];
        var div = document.createElement("div");
        div.setAttribute("class", "floatingButtonItem");
        div.style.width = imenu.widthMenu + "px";
        div.style.height = imenu.heightMenu + "px";
        div.style.left = (imenu.centerPosXSrc - imenu.widthMenu / 2) + 'px';
        div.style.top = (imenu.centerPosYSrc - imenu.heightMenu / 2) + 'px';
        div.style.background = arrayColor[i];
        div.style.paddingTop = '2px'; //anhntt cmt
        mainView.appendChild(div);
        arrayItemsDiv.push(div);

        var icon = document.createElement("span");
        icon.setAttribute("id", "floatingButtonIcon" + i);
        icon.setAttribute('class', imgArray[i]);
        icon.setAttribute('style', 'color:'+ arrayIconColor[i]);
        icon.setAttribute('onclick',urlArray[i]);
        icon.setAttribute('alt', 'na');
        icon.setAttribute('height', imenu.heightMenu / 2 + 'px');
        icon.setAttribute('width', imenu.widthMenu / 2 + 'px');
        div.appendChild(icon);
    }

    showMenuItem(arrayItemsDiv, earsyOut, 250);
}

function showMenuItem(item, delta, timeDuration) {
    isShowMenu = true;
    animate({
        delay: 10,
        duration: timeDuration, // 1 sec by default
        delta: delta,
        step: function (delta) {
            console.log(delta);
            if (arrayItems && arrayItems.length > 0) {
                for (var i = 0; i < arrayItems.length; i++) {
                    var imenu = arrayItems[i];
                    var diffX = (imenu.centerPosXSrc - imenu.centerPosXDes) * delta;
                    var diffY = (imenu.centerPosYSrc - imenu.centerPosYDes) * delta;
                    //console.log(diffY);  
                    var divMenu = item[i];
                    divMenu.style.left = (imenu.centerPosXSrc - diffX - imenu.widthMenu / 2) + 'px';
                    divMenu.style.top = (imenu.centerPosYSrc - diffY - imenu.heightMenu / 2) + 'px';
                    if (delta < 0.5)
                        divMenu.style.opacity = 0;
                    else
                        divMenu.style.opacity = 1;
                    //phong to
                    divMenu.style.width = delta * imenu.widthMenu + 'px';
                    divMenu.style.height = delta * imenu.heightMenu + 'px';
                    divMenu.style.left = (imenu.centerPosXSrc - diffX - imenu.widthMenu / 2 + (1 - delta) * imenu.widthMenu / 2) + 'px';
                    divMenu.style.top = (imenu.centerPosYSrc - diffY - imenu.heightMenu / 2 + (1 - delta) * imenu.heightMenu / 2) + 'px';
                    if (delta > 0.8) {
                        showHideElement('maskFloatingButton', true);
                    }

                    var floatIcon = document.getElementById("floatingButtonIcon" + i);
                    if (floatIcon) {
                        floatIcon.style.width = (delta) * imenu.widthMenu / 2 + 'px';
                        floatIcon.style.height = (delta) * imenu.heightMenu / 2 + 'px';
                    }
                    //show text
                    if (delta >= 1) {
                        var floatText = document.getElementById("floatingButtonText" + i);
                        if (floatText) {
                            floatText.style.display = "block";
                        }
                    }
                }
            }
        }
    })
}

function showHideElement(objId, isDisplay) {
    var rowObj = document.getElementById(objId);
    if (isDisplay) {
        rowObj.style.display = "block";
    } else {
        rowObj.style.display = "none";
    }
}

function earsyOut(x) {
    return (x -= 1) * x * (2.70158 * x + 1.70158) + 1;
}


function quad(progress) {
    return Math.pow(progress, 2)
}

function circ(progress) {
    return 1 - Math.sin(Math.acos(progress))
}

function getCenterItem(e) {
    if (e) {
        var ePos = getPosition(e);
        var eWidth = e.getBoundingClientRect().width;
        var eHeight = e.getBoundingClientRect().height;
        return {
            x: ePos.x + eWidth / 2,
            y: ePos.y + eHeight / 2
        };
    } else {
        return {
            x: 0,
            y: 0
        };
    }
}

/*animation tu tu*/
function bounceMenu(progress) {
    for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
        if (progress >= (7 - 4 * a) / 8) {
            return -Math.pow((8 - 6 * a - 8 * progress) / 4, 2) + Math.pow(b, 2);
        }
    }
}

function bounce(progress) {
    for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
        if (progress >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2)
        }
    }
}

function makeEaseOut(delta) {
    return function (progress) {
        return 1 - delta(1 - progress)
    }
}

function moveLeft(element, delta, duration, screenWidth, direction) {
    var elementWidth = element.getBoundingClientRect().width;
    var screenHeight = window.innerHeight || document.body.clientHeight;
    var curPos = getPosition(element);
    var curLeft = curPos.x;
    var curTop = curPos.y;
    var to = curLeft;
    var durationTemp = duration * to / screenWidth;
    animate({
        delay: 10,
        duration: durationTemp < duration ? duration : duration, // 1 sec by default
        delta: delta,
        step: function (delta) {
            element.style.left = (curLeft - to * delta) + "px"
        }
    })

    var width = 100

    animate({
        delay: 20,
        duration: durationTemp < duration ? duration : duration,
        delta: makeEaseOut(quad),
        step: function (delta) {
            if (direction) {
                if (curTop - width * delta <= 0) {
                    element.style.top = 0 + "px";
                } else {
                    element.style.top = (curTop - width * delta) + "px";
                }
            } else {
                if (curTop + width * delta + elementWidth <= screenHeight) {
                    element.style.top = (curTop + width * delta) + "px";
                } else {
                    element.style.top = (screenHeight - elementWidth) + "px";
                }
            }
        }
    })
}

function moveRight(element, delta, duration, screenWidth, direction) {
    var elementWidth = element.getBoundingClientRect().width;
    var screenHeight = window.innerHeight || document.body.clientHeight;
    var curPos = getPosition(element);
    var curLeft = curPos.x;
    var curTop = curPos.y;

    var to = (screenWidth - elementWidth) - curLeft;
    var durationTemp = duration * to / screenWidth;
    animate({
        delay: 10,
        duration: durationTemp < duration ? duration : duration, // 1 sec by default
        delta: delta,
        step: function (delta) {
            //console.log(delta);
            element.style.left = (curLeft + to * delta) + "px";
        }
    })
    var width = 100

    animate({
        delay: 20,
        duration: durationTemp < duration ? duration : duration,
        delta: makeEaseOut(quad),
        step: function (delta) {
            if (direction) {
                if (curTop - width * delta <= 0) {
                    element.style.top = 0 + "px";
                } else {
                    element.style.top = (curTop - width * delta) + "px";
                }
            } else {
                if (curTop + width * delta + elementWidth <= screenHeight) {
                    element.style.top = (curTop + width * delta) + "px";
                } else {
                    element.style.top = (screenHeight - elementWidth) + "px";
                }
            }
        }
    })
}

function animate(opts) {

    var start = new Date
    var idAnimation = setInterval(function () {
        var timePassed = new Date - start
        var progress = timePassed / opts.duration

        if (progress > 1) progress = 1

        var delta = opts.delta(progress)
        opts.step(delta)

        if (progress == 1) {
            clearInterval(idAnimation)
        }
    }, opts.delay || 10)
}

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

/**
purpose: function get width of text with font 
use : getTextWidth("hello there!", "bold 12pt tahoma")
*/
function getTextWidth(text, font) {
    // if given, use cached canvas for better performance
    // else, create new canvas
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}