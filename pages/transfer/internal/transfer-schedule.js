/**
 * Created by HaiDT1 on 12/16/2016.
 */
var transSelected = 0;
var statusSelected = 0
var startDate;
var endDate;
var flag;
var viewBack = false;
var evtStandingPeriod = document.createEvent('Event');
evtStandingPeriod.initEvent('evtStandingPeriod', true, true);
function viewDidLoadSuccess() {
    init();
}

function init() {
    angular.module('EbankApp').controller('transfer-schedule', function ($scope, requestMBServiceCorp) {
        navController.getBottomBar().hide();
        document.getElementById("type-schedule-value").innerHTML = (gUserInfo.lang == 'EN') ? CONST_KEY_PERIODIC_FREQUENCY_EN[0] : CONST_KEY_PERIODIC_FREQUENCY_VN[0];
        evtStandingPeriod.period = {'name' : document.getElementById("type-schedule-value").innerHTML, 'value' : CONST_KEY_PERIODIC_FREQUENCY_VALUE[0]};

        $scope.showTransStatusSelection = function (){
            var array = (gUserInfo.lang == 'EN') ? CONST_KEY_PERIODIC_FREQUENCY_EN : CONST_KEY_PERIODIC_FREQUENCY_VN;
            var bd = document.getElementById("statuslist");
            bd.style.borderBottomLeftRadius = "0px";
            bd.style.borderBottomRightRadius = "0px";
            document.getElementById("narrowspinstatus").style.transform = "rotate(90deg)";

            var dialogHeight = 0;
            var divNode = document.getElementById('viewSelectionctStatus');

            if ((divNode != null) && (divNode != undefined)) {
                divNode.innerHTML = "";
            }

            var dialogDivAll = document.createElement('div');
            var dialogDivContainerScroll = document.createElement('div');
            dialogDivContainerScroll.setAttribute('id', 'selection-dialog-scroll');
            dialogDivContainerScroll.setAttribute('class', 'dialog-scroll-content');
            var dialogDivContainer = document.createElement('div');

            for (var x = 1; x < array.length + 1; x++) {
                if (x < 6) {
                    dialogHeight = dialogHeight + 39;
                }
                var aNode = document.createElement("a");

                if (x == 0) {
                    aNode.setAttribute("class", "list-group-item active");
                    aNode.innerHTML = inTitle;
                    divNode.appendChild(aNode);
                }
                else {
                    aNode.setAttribute("class", "list-group-item");
                    if (showValue) {
                        aNode.style.textAlign = "center";
                    }
                    else {
                        aNode.style.textAlign = "center";
                    }
                    aNode.setAttribute("onClick", "statusSelectedValue(this," + x + ");");
                    aNode.innerHTML = array[x - 1];
                    dialogDivContainer.appendChild(aNode);
                }
            }
            dialogDivContainerScroll.appendChild(dialogDivContainer);
            dialogDivAll.appendChild(dialogDivContainerScroll);
            divNode.appendChild(dialogDivAll);
            if(divNode.style.display == 'block'){
                divNode.style.display = 'none';
                document.getElementById("statuslist").style.borderBottomLeftRadius = "8px";
                document.getElementById("statuslist").style.borderBottomRightRadius = "8px";
                document.getElementById("narrowspinstatus").style.transform = "rotate(0)";

            }else{
                divNode.style.display = 'block';
            }
        }

        $scope.setSchedule = function () {
            evtStandingPeriod.startdate = document.getElementById('start-date-value').innerHTML;
            evtStandingPeriod.enddate = document.getElementById('end-date-value').innerHTML;



            navController.popView(true);
            document.dispatchEvent(evtStandingPeriod);
        }

        $scope.onClickBack = function () {
            navController.popView(true);
        }
    });
    angular.bootstrap(document.getElementById('mainViewContent'),['EbankApp']);
}


function transferSelected(inNode,index){
    document.getElementById('viewSelectionct').style.display = 'none';
    var bd = document.getElementById("translist");
    bd.style.borderBottomLeftRadius = "8px";
    bd.style.borderBottomRightRadius = "8px";
    document.getElementById("narrowspin").style.transform = "rotate(0)";
    transSelected = parseInt(index) - 1;
    document.getElementById("type-trans-value").innerHTML = (gUserInfo.lang == 'EN') ? CONST_INTERNAL_TRANS_TYPE_EN[transSelected] : CONST_INTERNAL_TRANS_TYPE_VN[transSelected];
}

function statusSelectedValue(inNode,index){
    document.getElementById('viewSelectionctStatus').style.display = 'none';
    var bd = document.getElementById("statuslist");
    bd.style.borderBottomLeftRadius = "8px";
    bd.style.borderBottomRightRadius = "8px";
    document.getElementById("narrowspinstatus").style.transform = "rotate(0)";
    statusSelected = parseInt(index) - 1;
    document.getElementById("type-schedule-value").innerHTML = (gUserInfo.lang == 'EN') ? CONST_KEY_PERIODIC_FREQUENCY_EN[statusSelected]: CONST_KEY_PERIODIC_FREQUENCY_VN[statusSelected];
    evtStandingPeriod.period = {'name' : document.getElementById("status-value").innerHTML, 'value' : CONST_KEY_PERIODIC_FREQUENCY_VALUE[statusSelected]};
}

function loadCalendarTrans(e){
    e.childNodes[1].style.borderBottomLeftRadius = "0px";
    e.childNodes[1].style.borderBottomRightRadius = "0px";
    e.childNodes[3].style.transform = "rotate(90deg)";
    var type = e.id;
    if(type === "startDate"){
        var startDateHtml = document.getElementById("start-date-value").innerText;
        document.getElementById('holder-calendar-picker').style.display = "block";
        loadCalendarInline("calendar-picker",false,setStartDateScheduleer,changeStringToArrayDate(startDateHtml));
    }else if(type === "endDate"){
        var endDateHtml = document.getElementById("end-date-value").innerText;
        document.getElementById('holder-calendar-pickers').style.display = "block";
        loadCalendarInline("calendar-pickers",false,setEndDateScheduleers,changeStringToArrayDate(endDateHtml));
    }
}