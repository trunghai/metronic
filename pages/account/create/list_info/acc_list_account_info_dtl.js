/**
 * Created by JetBrains WebStorm.
 * User: VanPTT.FSOFT
 * Date: 12/14/16
 * Time: 10:15 AM
 * To change this template use File | Settings | File Templates.
 */
function loadInitXML() {
    logInfo('list amf list account init');
}

function viewWillUnload(){
    document.removeEventListener('evtChangeWidthDesktop',gentable,false);
    document.removeEventListener('evtChangeWidthMobile',gentable,false);

}
/***
 VIEW LOAD SUCCESS
 Thực hiện việc gọi lên service để lấy dữ liệu
 ***/
function viewDidLoadSuccess() {
    init();
    logInfo('list amf list account load success');
    getTenor();
    gentable();
    document.addEventListener('evtChangeWidthDesktop',gentable,false);
    document.addEventListener('evtChangeWidthMobile',gentable,false);
    
}
function init(){
    angular.module('EbankApp').controller('acc_list_account_dtl', function ($scope, requestMBServiceCorp) {

// Chuyển đến màn hình tất toán
$scope.acc_list_acount_info_dtl_btnFinal = function(){
    // goto screen
    navController.pushToView('account/create/finalize/acc_finalize', true, 'html');
}
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp'])

}
function gentable(){
    if (gUserInfo.userRole.indexOf('CorpAuth') != -1) {
        document.getElementById("exeTrans").style.display = "none";
    }else{
        if(gAccount.accType == 'Y'){
            document.getElementById("exeTrans").style.display = "";
        }else{
            document.getElementById("exeTrans").style.display = "none";
        }
    }
    
    if(CONST_DESKTOP_MODE && !checkScreenisMobilePX()){
        var recycler = new RecyclerView({
            type: "DESKTOP_GRID",
            typeTextAlign: "MIDLE",
            title: "Detail tài khoản",
            titleAlign:"LEFT",
            opacity:true
        });

        recycler.setData(gArraccinfo);
        var contentHTML = recycler.init();
        var content = document.getElementById('div-datainfo');
        content.innerHTML = contentHTML;
    }else{
        var recycler = new RecyclerView({
            type: "NORMAL",
            typeTextAlign: "MIDLE",
            title: "Detail tài khoản",
            titleAlign:"LEFT",
            opacity:true
        });

        recycler.setData(gArraccinfo);
        var contentHTML = recycler.init();
        var content = document.getElementById('div-datainfo');
        content.innerHTML = contentHTML;
    }
}
function getTenor(){
    var tenorday = parseInt(gAccount.accTenorDays);
    var tenormonth = parseInt(gAccount.accTenorMonths);
    var tenoryear = parseInt(gAccount.accTenorYears);
    var counttenor = tenorday + 30*tenormonth +365*tenoryear;
    if(counttenor>0){
        if(tenorday <1){
            if(tenormonth >0){
                if(tenoryear >0){
                    tenor= gAccount.accTenorYears+ ' ' + CONST_STR.get('TRANS_PERIODIC_YEAR')+' '+gAccount.accTenorMonths + ' ' + CONST_STR.get('TRANS_PERIODIC_MONTH');
                }
                else {
                    tenor= gAccount.accTenorMonths + ' ' + CONST_STR.get('TRANS_PERIODIC_MONTH');
                }
            }
            else if(tenormonth <1){
                tenor= gAccount.accTenorYears+ ' ' + CONST_STR.get('TRANS_PERIODIC_YEAR');
            }
        }
        else if(tenorday >0){
            if(tenormonth >0){
                if(tenoryear >0){
                    tenor=  gAccount.accTenorYears+ ' ' + CONST_STR.get('TRANS_PERIODIC_YEAR')+' '+ gAccount.accTenorMonths + ' ' + CONST_STR.get('TRANS_PERIODIC_MONTH')+' '+gArraySav.tenor_day + ' '+ CONST_STR.get('TRANS_PERIODIC_DATE1');

                }
                else {
                    tenor=  gAccount.accTenorMonths + ' ' + CONST_STR.get('TRANS_PERIODIC_MONTH')+' '+gArraySav.tenor_day + ' '+ CONST_STR.get('TRANS_PERIODIC_DATE1');
                }
            }
            else if(tenormonth <1){
                if(tenoryear >0){
                    tenor=  gArraySav.tenor_year+ ' ' + CONST_STR.get('TRANS_PERIODIC_YEAR')+' '+gAccount.accTenorDays + ' '+ CONST_STR.get('TRANS_PERIODIC_DATE1');
                }
                else{
                    tenor= gAccount.accTenorDays + ' '+ CONST_STR.get('TRANS_PERIODIC_DATE1');
                }
            }

        }
    }
}
