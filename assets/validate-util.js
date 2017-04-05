/**
 * Created by JetBrains WebStorm.
 * User: DangLN.FSOFT
 * Date: 8/18/16
 * Time: 2:29 PM
 * To change this template use File | Settings | File Templates.
 */
var transferParam;
var contactParam;
var periodParam;
var latestParam;
var holderParam;
var modalDialog ;
var notificationdialog ;
var flagInitDialog = false;
function ParamHolder (ts,tp1,tp2,cs,cp1,cp2,showCategory,ps,pp1,localTransfer){
    this.transferServices  = ts,
        this.transferParam1 = tp1;
    this.transferParam2 = tp2;
    this.contactServices = cs;
    this.contactParam1 =  cp1;
    this.contactParam2 =  cp2;
    this.showCategory = showCategory;
    this.periodServices = ps;
    this.periodParam1 = pp1;
    this.isLocalTransfer = localTransfer || false;
}
// mẫu chuyển tiền
function TransferParam(ts,tp1,tp2){
    this.transferServices  = ts,
        this.transferParam1 = tp1;
    this.transferParam2 = tp2;
}
//danh bạ
function ContactParam(cs,cp1,cp2,cp3){
    this.contactServices  = cs,
        this.contactParam1 = cp1;
    this.contactParam2 = cp2;
    this.isLocalTransfer = cp3;
}
//lệnh chuyển tiền định kỳ
function PeriodParam(ps,pp1){
    this.periodServices = ps;
    this.periodParam1 = pp1;
}
//gần đây
function LatestParam(ls,lp1,lp2){
    this.latestServices = ls;
    this.latestParam1= lp1;
    this.latestParam2 = lp2;
}

function checkValueInArray(arr, value){
    // check value
    // return bool, index
    for (var i = 0; i < arr.length; i++)
    {
        if(arr[i] == value){
            return [true, i];
        }
    }
    return [false, null];
}


function validateCompareDate(dateOne, dateTwo){
    var odate = dateOne.split("/");
    var tdate = dateTwo.split("/");

    var o_date = new Date(odate[2], odate[1], odate[0]).getTime();
    var t_date = new Date(tdate[2], tdate[1], tdate[0]).getTime();
    if (o_date > t_date) {
        return false;
    }
    else {
        return true;
    }
}
function validateCheckDateNowJustOne(chkdate){
    var edate = chkdate.split("/");
    var spdate = new Date();
    var sdd = spdate.getDate();
    var smm = spdate.getMonth() + 1;
    var syyyy = spdate.getFullYear();
    var today = new Date(syyyy, smm, sdd).getTime();

    var e_date = new Date(edate[2], edate[1], edate[0]).getTime();
    if (e_date < today) {
        return false;
    }
    else {
        return true;
    }
}
function validateCheckDateNow(chkdate){
    var edate = chkdate.split("/");
    var spdate = new Date();
    var sdd = spdate.getDate();
    var smm = spdate.getMonth() + 1;
    var syyyy = spdate.getFullYear();
    var today = new Date(syyyy, smm, sdd).getTime();

    var e_date = new Date(edate[2], edate[1], edate[0]).getTime();
    if (e_date <= today) {
        return false;
    }
    else {
        return true;
    }
}

function validateDateTimeFormat(value){
    var pattern =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
    if(!pattern.test(value)){
        return false
    }

    try {
        var isValidDate = false;
        var arr1 = value.split('/');
        var year=0;
        var month=0;
        var day=0;
        if(arr1.length == 3)
        {
            year = parseInt(arr1[2],10);
            month = parseInt(arr1[1],10);
            day = parseInt(arr1[0],10);

            var isLeapYear = false;
            if(year % 4 == 0)
                isLeapYear = true;

            if((month==4 || month==6|| month==9|| month==11) && (day>=0 && day <= 30))
                isValidDate=true;
            else if((month!=2) && (day>=0 && day <= 31))
                isValidDate=true;

            if(!isValidDate){
                if(isLeapYear)
                {
                    if(month==2 && (day>=0 && day <= 29))
                        isValidDate=true;
                }
                else
                {
                    if(month==2 && (day>=0 && day <= 28))
                        isValidDate=true;
                }
            }
        }

        return isValidDate;
    }
    catch (err) {
        return false;
    }

}


function checkSchedule(){
    //
    //{data: data}

}

function checkDateTimeScheduleType(data){

    var arrCheck = checkValueInArray(data.arrLang,data.type);
    // kiem tra type
    if(arrCheck[0]){

        switch(arrCheck[1]){
            //'Just once'
            case 0:

                var array = data.dayTransfer.split(",");
                for(var i=0; i < array.length;i++)
                {
                    // kiem tra format time dayTransfer
                    if (!validateDateTimeFormat(array[i])){
                        document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_DAY_TRANSFER_NULL');
                        return false;
                    }
                    // kiem tra thoi gian hien tai
                    if (!validateCheckDateNowJustOne(array[i])){
                        document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_DAY_TRANSFER_BEFORE_TODAY');
                        return false;
                    }
                }
                return true;
                break;

            //'Daily'
            case 1:
                // startDate
                if (!validateDateTimeFormat(data.startDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_START_DATE_TRANSFER_NULL');
                    return false;
                }
                if (!validateCheckDateNow(data.startDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_START_DATE_AFTER_TODAY');
                    return false;
                }
                //  endDate
                if (!validateDateTimeFormat(data.endDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_END_DATE_TRANSFER_NULL');
                    return false;
                }
                if (!validateCheckDateNow(data.endDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_END_DATE_TRANSFER_BEFORE_TODAY');
                    return false;
                }
                // check ngay ket thuc lon hon ngay ban dau
                if (!validateCompareDate(data.startDate, data.endDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_END_DATE_BEFORE_START_DATE');
                    return false;
                }
                return true;
                break;

            //'Weekly'
            case 2:
                /*if (data.dayInWeek == ""){
                 showAlertText("chua chon ngay gui hang tuan");
                 return false;
                 }*/
                // startDate
                if (!validateDateTimeFormat(data.startDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_START_DATE_TRANSFER_NULL');
                    return false;
                }
                if (!validateCheckDateNow(data.startDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_START_DATE_AFTER_TODAY');
                    return false;
                }
                //  endDate
                if (!validateDateTimeFormat(data.endDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_END_DATE_TRANSFER_NULL');
                    return false;
                }
                if (!validateCheckDateNow(data.endDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_END_DATE_TRANSFER_BEFORE_TODAY');
                    return false;
                }
                // check
                if (!validateCompareDate(data.startDate, data.endDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_END_DATE_BEFORE_START_DATE');
                    return false;
                }
                return true;
                break;

            //'Monthly'
            case 3:
                /*  var array = data.dayTransfer.split(",");
                 for(var i=0; i < array.length;i++)
                 {
                 // kiem tra format time dayTransfer
                 if (!validateDateTimeFormat(array[i])){
                 showAlertText("Chưa nhập ngày chuyển");
                 return false;
                 }
                 // kiem tra thoi gian hien tai
                 if (!validateCheckDateNow(array[i])){
                 showAlertText("Thời gian ngày chuyển nhỏ hơn thời gian hiện tại");
                 return false;
                 }
                 }*/
                // startDate
                if (!validateDateTimeFormat(data.startDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_START_DATE_TRANSFER_NULL');
                    return false;
                }
                if (!validateCheckDateNow(data.startDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_START_DATE_AFTER_TODAY');
                    return false;
                }
                //  endDate
                if (!validateDateTimeFormat(data.endDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_END_DATE_TRANSFER_NULL');
                    return false;
                }
                if (!validateCheckDateNow(data.endDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_END_DATE_TRANSFER_BEFORE_TODAY');
                    return false;
                }
                // check
                if (!validateCompareDate(data.startDate, data.endDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_END_DATE_BEFORE_START_DATE');
                    return false;
                }
                return true;
                break;

            //'Yearly'
            case 4:
                /*
                 var array = data.dayTransfer.split(",");
                 for(var i=0; i < array.length;i++)
                 {
                 // kiem tra format time dayTransfer
                 if (!validateDateTimeFormat(array[i])){
                 showAlertText("Chưa nhập ngày chuyển");
                 return false;
                 }
                 // kiem tra thoi gian hien tai
                 if (!validateCheckDateNow(array[i])){
                 showAlertText("Thời gian ngày chuyển nhỏ hơn thời gian hiện tại");
                 return false;
                 }
                 }*/
                // startDate
                if (!validateDateTimeFormat(data.startDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_START_DATE_TRANSFER_NULL');
                    return false;
                }
                if (!validateCheckDateNow(data.startDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_START_DATE_AFTER_TODAY');
                    return false;
                }
                //  endDate
                if (!validateDateTimeFormat(data.endDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_END_DATE_TRANSFER_NULL');
                    return false;
                }
                if (!validateCheckDateNow(data.endDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_END_DATE_TRANSFER_BEFORE_TODAY');
                    return false;
                }
                // check
                if (!validateCompareDate(data.startDate, data.endDate)){
                    document.getElementById("warning-validate").innerHTML = CONST_STR.get('ALERT_END_DATE_BEFORE_START_DATE');
                    return false;
                }
                return true;
                break;
        }
    }
    else{
        console.log("loi type");
    }
}

