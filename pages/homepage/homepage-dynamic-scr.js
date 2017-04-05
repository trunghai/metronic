/**
 * Created by HuyNT2.
 * User: 
 * Date: 06/20/15
 * Time: 5:35 PM
 */

/*** HEADER ***/
var mMenuList = new Array();


/*** INIT VIEW ***/
function loadInitXML() {
	return '';
}

/*** INIT VIEW END ***/

/*** VIEW LOAD SUCCESS ***/

function creatfloatingbutton(){
    var floatingbtton = document.getElementById("floatingButton");
    if(floatingbtton == undefined || floatingbtton == null){
        testUserControls();
        console.log("Anhntt floatingButton");
    } else{
        console.log("Anhntt floatingButton fail ");
    }
}

function viewDidLoadSuccess() {
	if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
    	navController.getActionBar().setTitleBarOnly(CONST_STR.get('MENU_HOME_PAGE'));
	}
    navController.getBottomBar().hide();
    // creatfloatingbutton();
    document.getElementById('mainview').style.borderBottomLeftRadius='';
    document.getElementById('mainview').style.borderTopLeftRadius='';
    document.getElementById('bottom_page').style.display='none';
//    if(currentPage=='homepagexsl/homepage-dynamic-scr' &&gModeScreenView == CONST_MODE_SCR_MEDIUM){
//        document.getElementById('navActionbar').style.display='none';
//    }
    //actionbar.setDateTime("");
	logInfo('homepage-vn load success');
    refrClock();
    //document.getElementById("account_name").innerHTML = gCustomerNanme;
    actionbar.setCustomerName(gCustomerNanme);
	//document.getElementsByClassName('customer-name')[0].innerHTML=gCustomerNanme;
	if(mMenuList.length>0)
		mMenuList=[];
	for (var i=0; i<gMenuUserOrder.length; i++) {
		for (var j=0; j<gMenuList.length; j++) {
			var tmpMenuObj = gMenuList[j];
			//alert(gMenuList[j].menuID);
			if(gMenuUserOrder[i].length > 0 && gMenuUserOrder[i] == tmpMenuObj.menuID && tmpMenuObj.menuID != '30') {
				// if(tmpMenuObj.menuID=="mAccInfo"){
				// 	gMenuList[j].path = 'accountxsl/account-scr';
				// 	mMenuList.push(gMenuList[j]);
				// }else{
					gMenuList[j].hiddenStatus = 'N';
					mMenuList.push(gMenuList[j]);
				// }
			
				
				break;
			}
		}
	}
	var tmpBodyHome = document.createElement('tbody');
	var tmpRowIcon;
	var tmpRowLabel;
    console.log('mMenuList');
    console.log(mMenuList);
	for (var i=0; i<mMenuList.length; i++) {
		var tmpMenuObj = mMenuList[i];
		if(i%3 == 0) {
			tmpRowIcon = document.createElement('tr');
			tmpRowLabel = document.createElement('tr');
			tmpBodyHome.appendChild(tmpRowIcon);
			tmpBodyHome.appendChild(tmpRowLabel);
		}
		if(tmpMenuObj.path == 'account/create/search_no_tenor/account_tenor_deposit') {
			var tmpCellIcon = document.createElement('td');
			var att = document.createAttribute("align");       // Create a "class" attribute
			att.value = "center"; 
			tmpCellIcon.setAttributeNode(att);
			
			tmpCellIcon.style.width = '33%';
			tmpCellIcon.innerHTML = "<div class='icon_div_main ripple-add-on' onclick=\"" + tmpMenuObj.onClick + ";\" id='" + "'> <em class='" + tmpMenuObj.iconCode + " icon_font_v8' style='color:" + tmpMenuObj.color + "'></em> </div>";
			tmpRowIcon.appendChild(tmpCellIcon);
			
			var tmpCellLabel = document.createElement('td');
			var attlb = document.createAttribute("align");       // Create a "class" attribute
			attlb.value = "center"; 
			tmpCellLabel.setAttributeNode(attlb);
			tmpCellLabel.style.verticalAlign = 'middle';
			tmpCellLabel.innerHTML = "<a style='text-decoration:none; color:#FFF; cursor:pointer' onclick=\"" + tmpMenuObj.onClick + "\">" +
				  "<div class='icon_div_title'> <span class='icon_title'>" + CONST_STR.get(tmpMenuObj.keyLang) + "</span> </div>" +
				  "</a>";
			tmpRowLabel.appendChild(tmpCellLabel);
		}
		else {
			var onclkStr;
			var tmpCellIcon = document.createElement('td');
			var att = document.createAttribute("align");       // Create a "class" attribute
			att.value = "center";   
			tmpCellIcon.setAttributeNode(att); 
			tmpCellIcon.style.width = '33%';
            if(tmpMenuObj.menuID==30){
                 onclkStr = "updateAccountListInfo(); gotoHomePage();MenuHome('30','textMenu_0')";
            }if(tmpMenuObj.menuID==6){
                 onclkStr = "updateAccountListInfo();clearCachedPagePushToView('authorize/auth-transfer');settingViewFromAuth();;setTitleBar('Duyệt giao dịch');";
            }
            else{
				if (gUserInfo.userRole == 'CorpAuth'){
					onclkStr = tmpMenuObj.onClick + "setTitleBar('" + CONST_STR.get(tmpMenuObj.keyLang) + "');";
				}else {
					onclkStr = "handleOnClickToBlockDoubleClick('initMenuDetail(\\'" + tmpMenuObj.menuID + "\\');setTitleBar(\\'" + CONST_STR.get(tmpMenuObj.keyLang) + "\\');');";
				}
			}

           tmpCellIcon.innerHTML = "<div class='icon_div_main ripple-add-on' onclick=\""+ onclkStr +"\"   id='" + "'> <em class='" + tmpMenuObj.iconCode + " icon_font_v8' style='color:" + tmpMenuObj.color + "'></em> </div>";
			tmpRowIcon.appendChild(tmpCellIcon);

			var tmpCellLabel = document.createElement('td');
			var attlb = document.createAttribute("align");       // Create a "class" attribute
			attlb.value = "center";
			tmpCellLabel.setAttributeNode(attlb);
			tmpCellLabel.style.verticalAlign = 'middle';
			tmpCellLabel.innerHTML = "<a style='text-decoration:none; color:#FFF; ' onclick=\"" + tmpMenuObj.onClick + "\">" +
				  "<div class='icon_div_title' > <span class='icon_title'>" + CONST_STR.get(tmpMenuObj.keyLang) + "</span> </div>" +
				  "</a>";
			tmpRowLabel.appendChild(tmpCellLabel);
		}
		
	}
	var home_dynamic = document.getElementById('home-dynamic');
	if (home_dynamic) {
	    home_dynamic.innerHTML = tmpBodyHome.innerHTML;
	}
    if(gModeScreenView == CONST_MODE_SCR_MEDIUM){
        navController.getActionBar().hideNavHeaderBar();
//        document.getElementById('tabHost').style.top='7px';
        document.getElementById('mainview').style.background = 'rgba(255,255,255,0.85)';
//        document.getElementById('mainViewContent').style.minHeight = (document.getElementById('mainview').clientHeight  + 10 - 70 - 20) + "px";
    }
    MenuHome('30','textMenu_0');
	// checkJumbo(function () {
	// 	isJumbo = true;
	// },function () {
	// 	isJumbo = false;
	// });
}


function refrClock() {

    var d=new Date();

    var s=d.getSeconds();

    var m=d.getMinutes();

    var h=d.getHours();

    var day=d.getDay();

    var date=d.getDate();
	if(date < 10)
		date="0"+date;

    var month=d.getMonth();

    var year=d.getFullYear();

    var days=((gUserInfo.lang == 'EN') ? CONST_KEY_CALENDAR_DAYNAME_EN : CONST_KEY_CALENDAR_DAYNAMEFULL_VN);

    var months=((gUserInfo.lang == 'EN') ? CONST_KEY_CALENDAR_MONTHNAME_EN : CONST_KEY_CALENDAR_MONTHNAMEFULL_VN);
    if(gUserInfo.lang == 'EN')
    {
        actionbar.setDateTime(days[day] + ", " + date + ", " + months[month] + ", " + year);
    }
    else
    {
        actionbar.setDateTime(days[day] + ", ngày " + date + " " +months[month] + " năm " + year);
    }
}
function viewBackFromOther() {
	var navBottomBar = document.getElementById('navBottomBar');
    if(gModeScreenView == CONST_MODE_SCR_SMALL){
        navBottomBar.style.height = '60px';
    }else{
        navBottomBar.style.height = '35px';
    }
    refrClock();
    navController.getActionBar().setCustomerName(gCustomerNanme);
    navController.getActionBar().showNavHeaderBar();
    navController.getActionBar().setHavingBackground(true);
	
}

/*** VIEW LOAD SUCCESS END viewWillUnload ***/

/*** VIEW WILL UNLOAD ***/

function viewWillUnload() {
	logInfo('homepage-vn will unload');
}

/*** VIEW WILL UNLOAD END ***/

/*** FUNCTION ***/

/*** HANDLE ONCLICK ROW ***/

function gotoMenuList(inID) {
	logInfo('Selected ID: ' + inID);
    var tmpMenuObj;
	for(var i=0; i<mMenuList.length; i++) {
		tmpMenuObj = mMenuList[i];
		if(tmpMenuObj.menuID == inID) {
			gDynamicMenu = "<div style='margin-top:0px; color:#333;'>" + 
                "<h5 class='screen-title'><span>" + CONST_STR.get(tmpMenuObj.keyLang) + "</span></h5>" +
              "</div>";
		}
	}
	gDynamicMenu += "<div class='line-separate' style='margin-top: 2px; display: block;'></div>";
    if(tmpMenuObj) {

		for (var i=0; i<gMenuList.length; i++) {
			if(gMenuList[i].parentMenuID == inID && gMenuList[i].hiddenStatus == 'N') {
				if(gMenuList[i].keyLang == 'CUSTOMIZE_MENU_TITLE'){
					gDynamicMenu += "<div id='home_" + gMenuList[i].path + "' class='sub-menu' onClick=\"" + gMenuList[i].onClick + "\">" +
						"<h5 class='Header'><a style='text-decoration:none; color:#FFF; cursor:pointer'><span>" + CONST_STR.get(gMenuList[i].keyLang) + "</span></a></h5>" +
						"</div>";
				} else {
					gDynamicMenu += "<div id='home_" + gMenuList[i].path + "' class='sub-menu' onClick=\"" + gMenuList[i].onClick + "\">" +
						"<h5 class='Header'><a style='text-decoration:none; color:#FFF; cursor:pointer' onClick=\"" + gMenuList[i].onClick + "\"><span>" + CONST_STR.get(gMenuList[i].keyLang) + "</span></a></h5>" +
						"</div>";
				}
			}
		}
	}
	gDynamicMenu += "<div class='line-separate-sub-menu' style='background-color:#000'/>";
	navController.pushToView('menuxsl/dynamic-menu-scr', true, 'xsl');
}

var gprsResp = new GprsRespObj("","","","");


function initMenuDetailBackground(inID) {
	closeAllDialogOfModalLibrary();
	function MenuContent() {
		this.title = "";
		this.icon = "";
		this.src = "";
		this.color = "";
		this.keyLang = "";
	}
    var arrHeader = new Array();
    var arrFooter = new Array();
	var arrBottom = new Array();
	var contentItem;
	var item;

	console.log("inID " + inID);
	if (inID == "mAccInfo" || inID == "jumboAcc" || inID =="esaving") {
		checkJumbo(function () {
			for (var i = 0; i < gMenuList.length; i++) {
				item = gMenuList[i];
				console.log("item.menuID " +item.menuID);
				if (item.parentMenuID == inID && item.hiddenStatus == 'N') {
					contentItem = new MenuContent();
					contentItem.title = CONST_STR.get(item.keyLang);
					contentItem.keyLang = item.keyLang;
					contentItem.icon = item.iconCode;
					contentItem.src = item.onClick + ";setTitleBar('" + CONST_STR.get(item.keyLang) + "');";
					contentItem.color = item.color;
					if (inID == "mAccInfo") {
						if (item.menuID != "liJumboCreateAccNew") {
							if (item.ismainmenu == "C") {
								arrHeader.push(contentItem);
							} else {
								arrFooter.push(contentItem);
							}
							if (item.isbottombar == "Y") {
								arrBottom.push(contentItem);
							}
						}

					} else if (inID == "jumboAcc") {
						if (item.menuID != "liJumboCreateAcc") {
							if (item.ismainmenu == "C") {
								arrHeader.push(contentItem);
							} else {
								arrFooter.push(contentItem);
							}
							if (item.isbottombar == "Y") {
								arrBottom.push(contentItem);
							} 
						}
					}else if(inID == "esaving"){
							if (item.ismainmenu == "C") {
								arrHeader.push(contentItem);
							}else{
								arrFooter.push(contentItem);
							}
							if (item.isbottombar == "Y") {
								arrBottom.push(contentItem);
							} 
					}

					

				}
			}
			genSlidePushtoViewBackground(inID, arrHeader, arrFooter, arrBottom);
		}, function () {
			for (var i = 0; i < gMenuList.length; i++) {
				item = gMenuList[i];
				console.log("item.menuID " +item.menuID);
				if (item.parentMenuID == inID && item.hiddenStatus == 'N') {
					contentItem = new MenuContent();
					contentItem.title = CONST_STR.get(item.keyLang);
					contentItem.icon = item.iconCode;
					contentItem.keyLang = item.keyLang;
					contentItem.src = item.onClick + ";setTitleBar('" + CONST_STR.get(item.keyLang) + "');";
					contentItem.color = item.color;
					
					if (inID == "mAccInfo") {
						if (item.menuID != "liJumboAccInfoNew") {
							if (item.ismainmenu == "C") {
								arrHeader.push(contentItem);
							} else {
								arrFooter.push(contentItem);
							}
							if (item.isbottombar == "Y") {
								arrBottom.push(contentItem);
							} 
						}

					} else if (inID == "jumboAcc") {
						console.log("item.menuID " +item.menuID);
						if (item.menuID != "liJumboAccUnreg" && item.menuID != "liJumboCreateAutoSaving" && item.menuID != "liJumboAccInfo" && item.menuID != "liJumboCreditApplyLimit" && item.menuID != "liJumboSavingApplyLimit") {
							console.log("item.menuID 2" +item.menuID);
							if (item.ismainmenu == "C") {
								arrHeader.push(contentItem);
							} else {
								arrFooter.push(contentItem);
							}
							if (item.isbottombar == "Y") {
								arrBottom.push(contentItem);
							} 
						}
					}else if(inID == "esaving"){
						if (item.menuID != "liAutoSaving") {
							if (item.ismainmenu == "C") {
								arrHeader.push(contentItem);
							} else {
								arrFooter.push(contentItem);
							}
							if (item.isbottombar == "Y") {
								arrBottom.push(contentItem);
							} 
						}
					}

					
				}
			}
			genSlidePushtoViewBackground(inID, arrHeader, arrFooter, arrBottom);
		});
		


	}
	else {
		for (var i = 0; i < gMenuList.length; i++) {
			item = gMenuList[i];

			if (item.parentMenuID == inID && item.hiddenStatus == 'N') {
				contentItem = new MenuContent();
				contentItem.title = CONST_STR.get(item.keyLang);
				contentItem.icon = item.iconCode;
				contentItem.src = item.onClick + ";setTitleBar('" + CONST_STR.get(item.keyLang) + "');";
				contentItem.color = item.color;
				contentItem.keyLang = item.keyLang;
				console.log("item.onClick "+item.onClick);
				if (item.ismainmenu == "C") {
					arrHeader.push(contentItem);
				} else if (item.ismainmenu == "P") {
					arrFooter.push(contentItem);
				}
				if (item.isbottombar == "Y") {
						arrBottom.push(contentItem);
				} else {

				}

			}
		}
		genSlidePushtoViewBackground(inID, arrHeader, arrFooter, arrBottom);
	}


	
}


function genSlidePushtoViewBackground(inID,arrHeader, arrFooter,arrBottom) {
	var menuslide = new MenuSlide({
        numberIteminLine: 3,
        maxLinePageSlide: 2,
        classItemSlide: "swiper-slide",
        classWrapContent: "swiper-wrapper",
        classSwiperPageinationHeader: "swiper-pagination_header",
        classSwiperPageinationFooter: "swiper-pagination_footer",
        classHeader: "swiper-menu-header",
        classFooter: "swiper-menu-footer",
        classTableRow: "swiper-menu-tablerow",
        classTableItem: "icon-div-menuslide-item",
		classTableItemIcon: "swiper-menu-item-icon ripple-add-on",
        classTableItemText: "swiper-menu-item-text",
		itemClick: "gotoItemAction"
    });
	menuslide.addHeaderContent(arrHeader);
	menuslide.addFooterContent(arrFooter);

	gDynamicMenu ="<div id='homedynamic_contentslide'>"+ menuslide.contentHTML()+"</div>";
}