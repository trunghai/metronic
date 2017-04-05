/**
 * Created by HaiDT1 on 11/23/2016.
 */
/**
 * Created by HuyNT2.
 * User:
 * Date: 06/20/15
 * Time: 5:35 PM
 */

/*** HEADER ***/

/*** INIT VIEW ***/
function loadInitXML() {
    return '';
}

function viewBackFromOther() {
    logInfo('Back from other view');
}

/*** INIT VIEW END ***/

/*** VIEW LOAD SUCCESS ***/

function viewDidLoadSuccess() {
    bottomBar.hide();
    logInfo('account load success');
    //Sangnt1 add test
    //loadDynamicMenu();
    //End SangNT1 add new
    //hide actionbar
    navController.getActionBar().hideNavHeaderBar();
    navController.getActionBar().setHavingBackground(false);

    //SangNT1 bo comment de bo  test
    document.getElementById('dynamic-menu').innerHTML = gDynamicMenu;
    loadDynamicMenu();
    //thuatnt delelte slide
    if (gUserInfo.userRole.indexOf('CorpAuth') != -1) {
        document.getElementById('menuslide_divider').style.display = 'none';
    }else{
        document.getElementById('menuslide_divider').style.display = '';
    }
}

/*** VIEW LOAD SUCCESS END viewWillUnload ***/

/*** VIEW WILL UNLOAD ***/

function viewWillUnload() {
    logInfo('account will unload');
}

function loadDynamicMenu(){

    var mySwiper1 = myApp.swiper('.swiper-menu-header', {
        pagination:'.swiper-pagination_header',
        spaceBetween: 0,
        slidesPerView: 1
    });


    var mySwiper2 = myApp.swiper('.swiper-menu-footer', {
        pagination:'.swiper-pagination_footer',
        spaceBetween: 0,
        slidesPerView: 1
    });
}
function gotoItemAction(param){

    console.log("action " +param);
    navController.pushToView(param, true, 'html');

}
/*** VIEW WILL UNLOAD END ***/
