gTrans.idtxn = "S15";

gSetUp.limitInfo;

gCorp.isBack = false;

function viewDidLoadSuccess() {
    initData();

}

function viewBackFromOther() {
    gCorp.isBack = true;
}
/*** INIT DATA ***/
function initData() {
	angular.module('EbankApp').controller('set-limit', function ($scope, requestMBServiceCorp) {
		
		 // if (!gCorp.isBack) {
				// var jsonData = new Object();
				// jsonData.sequence_id = "1";
				// jsonData.idtxn = gTrans.idtxn;
				// var	args = new Array();
				// args.push(null);
				// args.push(jsonData);
				// var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_SETUP_CHANGE_TRANS_LIMIT"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
				// var data = getDataFromGprsCmd(gprsCmd);	
				// requestMBServiceCorp.post(data,handleSuccessCallBackGet);

            var jsonData = {};
            jsonData.sequence_id = "1";
            jsonData.idtxn = gTrans.idtxn;

            var args = new Array();
            args.push(null);
            args.push(jsonData);
            var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_SETUP_CHANGE_TRANS_LIMIT"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
            var data = getDataFromGprsCmd(gprsCmd);

            requestMBServiceCorp.post(data,true,handleSuccessCallBackGet);	
		// }
				
        function handleSuccessCallBackGet (response) {
            if (response.respCode === '0'){
                //var result = document.getElementById('id.searchResult');
				gTrans.currentUserLimit=response.respJsonObj;
                if (response.respJsonObj == null){
                    $scope.currentUserLimit = [];
               //     result.style.display = 'none';
                }else {
                    $scope.currentUserLimit = response.respJsonObj;
					
                 //   result.style.display = 'block';
                }

            }else {
                showAlertText(response.respContent);
            }

        }
		
        $scope.textlimit=function(e) {
            return monthsTypeOfLanguage = CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_" + e);
        }
		
		$scope.btnNextClick=function(){
			var currentUserLimit = gTrans.currentUserLimit;
			var request = {};
			request.new_limit = {
				GACCO_time : keepOnlyNumber(document.getElementById('GACCO-time-new').value),
				GACCO_day : keepOnlyNumber(document.getElementById('GACCO-day-new').value),
				GTRAN_time : keepOnlyNumber(document.getElementById('GTRAN-time-new').value),
				GTRAN_day : keepOnlyNumber(document.getElementById('GTRAN-day-new').value),
				GPAYS_time : keepOnlyNumber(document.getElementById('GPAYS-time-new').value),
				GPAYS_day : keepOnlyNumber(document.getElementById('GPAYS-day-new').value),
				GPAYI_time : keepOnlyNumber(document.getElementById('GPAYI-time-new').value),
				GPAYI_day : keepOnlyNumber(document.getElementById('GPAYI-day-new').value)
			};
			var isValid = validateLimit(request.new_limit.GACCO_time, request.new_limit.GACCO_day,
				 request.new_limit.GTRAN_time, request.new_limit.GTRAN_day, request.new_limit.GPAYS_time,
				 request.new_limit.GPAYS_day, request.new_limit.GPAYI_time, request.new_limit.GPAYI_day);
			if (!isValid)
				return;
			
			request.old_limit = {
				GACCO_time : currentUserLimit[0].HAN_MUC_LAN,
				GACCO_day : currentUserLimit[0].HAN_MUC_NGAY,
				GTRAN_time : currentUserLimit[1].HAN_MUC_LAN,
				GTRAN_day : currentUserLimit[1].HAN_MUC_NGAY,
				GPAYS_time : currentUserLimit[2].HAN_MUC_LAN,
				GPAYS_day : currentUserLimit[2].HAN_MUC_NGAY,
				GPAYI_time : currentUserLimit[3].HAN_MUC_LAN,
				GPAYI_day : currentUserLimit[3].HAN_MUC_NGAY
			};
			gTrans.common={};
			gTrans.common.limitTbl=[
				{
					TENDV : CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_" + currentUserLimit[0].MA_DV),
					HAN_MUC_LAN_MAX : currentUserLimit[0].HAN_MUC_LAN_MAX,
					HAN_MUC_NGAY_MAX : currentUserLimit[0].HAN_MUC_NGAY_MAX,
					HAN_MUC_LAN : request.new_limit.GACCO_time,
					HAN_MUC_NGAY : request.new_limit.GACCO_day,	
				},
				{
					TENDV :	CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_" + currentUserLimit[1].MA_DV),
					HAN_MUC_LAN_MAX : currentUserLimit[1].HAN_MUC_LAN_MAX,
					HAN_MUC_NGAY_MAX : currentUserLimit[1].HAN_MUC_NGAY_MAX,
					HAN_MUC_LAN : request.new_limit.GPAYI_time,
					HAN_MUC_NGAY : request.new_limit.GPAYI_day,
				},
				{		
					TENDV : CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_" + currentUserLimit[2].MA_DV),
					HAN_MUC_LAN_MAX : currentUserLimit[2].HAN_MUC_LAN_MAX,
					HAN_MUC_NGAY_MAX : currentUserLimit[2].HAN_MUC_NGAY_MAX,
					HAN_MUC_LAN : request.new_limit.GPAYS_time,
					HAN_MUC_NGAY : request.new_limit.GPAYS_day,
				},
				{
					TENDV : CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_" + currentUserLimit[3].MA_DV),
					HAN_MUC_LAN_MAX : currentUserLimit[3].HAN_MUC_LAN_MAX,
					HAN_MUC_NGAY_MAX : currentUserLimit[3].HAN_MUC_NGAY_MAX,
					HAN_MUC_LAN : request.new_limit.GTRAN_time,
					HAN_MUC_NGAY : request.new_limit.GTRAN_day,
				},
			];
			
				gTrans.transInfo = new Object();
				gTrans.transInfo.sequence_id = "2";
				gTrans.transInfo.idtxn = gTrans.idtxn;
				gTrans.transInfo.userId = gCustomerNo;
				gTrans.transInfo.request = request;
				var args = [];
				args.push(null);
				args.push(gTrans.transInfo);
				
				var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_SETUP_CHANGE_TRANS_LIMIT"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
				var data = getDataFromGprsCmd(gprsCmd);
				requestMBServiceCorp.post(data, true, requestMBServiceSuccess, function(){});
		}

		function requestMBServiceSuccess(e) {
			var resp = e;
			if (resp.respCode == 55) {
				showAlertText(CONST_STR.get("CORP_MSG_SAME_TYPE_TRANS_EXIST"));
				return;
			}
			if (resp.respCode == '0') {
				var requestData = {
					sequence_id : "3",
					idtxn : gTrans.idtxn,
					transId : resp.respJsonObj[0].MA_GD
				};
				gTrans.cmdType = CONSTANTS.get('CMD_CO_SETUP_CHANGE_TRANS_LIMIT');
				gTrans.requestData = requestData;
                gTrans.src = "pages/setup/common-review/set_limit_review.html";
				gTrans.ortherSrc="setup/create/tranfer/limit/set-limit";
                navCachedPages["common/common-review/transfer-review-scr"] = null;
				navController.pushToView("common/common-review/transfer-review-scr", true, "html");

			} else {
				showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST'));
			}
		}
		
	});	
	angular.bootstrap(document.getElementById("mainViewContent"), ["EbankApp"]);	
}	
// Lay thong tin han muc toi da
/*function getUserLimitInfo() {
	var jsonData = new Object();
	jsonData.sequence_id = "1";
	jsonData.idtxn = gTrans.idtxn;
	var	args = new Array();
	args.push(null);
	args.push(jsonData);
	var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_SETUP_CHANGE_TRANS_LIMIT"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
	var data = getDataFromGprsCmd(gprsCmd);
	requestMBServiceCorp(data, false, 0, getUserLimitSuccess, function(){
		// Co loi Hien thong bao va quay ve trang chu
		showAlertText(CONST_STR.get("CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA"));
		// gotoHomePage();
	});
}

function getUserLimitSuccess(data) {
	var resp = JSON.parse(data);
	if (resp.respCode == '0') {
		gSetUp.currentUserLimit = resp.respJsonObj;
		if (!checkScreenisMobilePX()) {
			genTableOfResults(resp.respJsonObj);
		}else{
			genTableOfResultsMobile(resp.respJsonObj);
		}	
	// } else {
		// Co loi Hien thong bao va quay ve trang chu
		// showAlertText(CONST_STR.get("CORP_MSG_INTERNAL_TRANS_ERROR_GET_DATA"));
		// gotoHomePage();
	}
}*/

function genTableOfResults(data) {

	// var isInput = "false";

	// if(gUserInfo.userRole.indexOf('CorpInput') != -1){
		// isInput = "true";
	// }

	gSetUp.limitInfo = {};

	var contentItem = '';
	for (var i in data) {
		var service = data[i];

		gSetUp.limitInfo[service.MA_DV] = {
			HAN_MUC_LAN_MAX : service.HAN_MUC_LAN_MAX,
			HAN_MUC_NGAY_MAX : service.HAN_MUC_NGAY_MAX,
			HAN_MUC_LAN : service.HAN_MUC_LAN,
			HAN_MUC_NGAY : service.HAN_MUC_NGAY
		};
		
		var id=service.MA_DV;
		var contentHTML = '';
		contentHTML += "<table class='recycler-table-ebank desktopview' align='center' style='table-layout: fixed;'>";
		contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
		contentHTML += "<td class='recycler-row-align-midle' rowspan='2' style='color: #424242;'><span>" + CONST_STR.get('CONST_TRANS_LIMIT_TIT_SERVICE') + "</span></td>";
		contentHTML += "<td class='recycler-row-align-midle' colspan='2' style='color: #424242;'><span>" + CONST_STR.get('CONST_TRANS_LIMIT_TIT_MAX_LIMIT') + "</span></td>";
		contentHTML += "<td class='recycler-row-align-midle' style='color: #424242;' colspan='2'><span>" + CONST_STR.get('CONST_TRANS_LIMIT_TIT_SELECTED_LIMIT') + "</span></td>";
		contentHTML += "</tr>";
		
		contentHTML += "<tr class='recycler-row-title-header recycler-list'>";
		contentHTML += "<td class='recycler-row-align-midle' style='color: #424242;'><span>" + CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME') + "</span></td>";
		contentHTML += "<td class='recycler-row-align-midle' style='color: #424242;'><span>" + CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY') + "</span></td>";
		contentHTML += "<td class='recycler-row-align-midle' style='color: #424242;'><span>" + CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME') + "</span></td>";
		contentHTML += "<td class='recycler-row-align-midle' style='color: #424242;'><span>" + CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY') + "</span></td>";
		contentHTML += "</tr>";

		contentItem += '<tr class="recycler-row-title recycler-list recycler-row-align-midle" align="center">';
		contentItem += '<td class=" tdselct td-head-color"><div class="content-detail"><span>' + (CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_" + service.MA_DV)) + '</span></div></td>';
		
		contentItem += '<td id="'+id+'-time-old"><div class="content-detail"><span>' + formatCurrency2(parseInt(service.HAN_MUC_LAN_MAX)) + '</span></div></td>';
		contentItem += '<td id="'+id+'-time-old"><div class="content-detail"><span>' + formatCurrency2(parseInt(service.HAN_MUC_NGAY_MAX)) + '</span></div></td>';
		contentItem += '<td class="recycler-row-align-midle"><input id="'+id+'-time-new" type="text" class="form-control form-control-righttext" placeholder="'+CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME')+'"onkeyup="handleInputAmount(event, this);" onchange="keepOnlyNumber(this.value)" value="'+formatCurrency2(parseInt(service.HAN_MUC_LAN))+'"/></td>';
		contentItem += '<td class="recycler-row-align-midle"><input id="'+id+'-day-new" type="text" class="form-control form-control-righttext" placeholder="'+CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY')+'" onkeyup="handleInputAmount(event, this);" onchange="keepOnlyNumber(this.value)" value="'+formatCurrency2(parseInt(service.HAN_MUC_NGAY))+'"/></td>';
		contentItem += '</tr>';
	}
	
	contentHTML += contentItem + "</tbody></table>";

	var element = document.getElementById("resultsTable");
	element.innerHTML = contentHTML;
}

function genTableOfResultsMobile(data) {

	// var isInput = "false";

	// if(gUserInfo.userRole.indexOf('CorpInput') != -1){
		// isInput = "true";
	// }

	gSetUp.limitInfo = {};

	var contentItem = '';
	for (var i in data) {
		var service = data[i];

		gSetUp.limitInfo[service.MA_DV] = {
			HAN_MUC_LAN_MAX : service.HAN_MUC_LAN_MAX,
			HAN_MUC_NGAY_MAX : service.HAN_MUC_NGAY_MAX,
			HAN_MUC_LAN : service.HAN_MUC_LAN,
			HAN_MUC_NGAY : service.HAN_MUC_NGAY
		};
		
		var id=service.MA_DV;
		var contentHTML = '';
		contentHTML += ""
		contentItem += "<div class='recycler_table_ebank-mobile mobileview'><div id='recycler_list' class='recycler-list margin-bottom'><table id='recycler_table_ebank-mobile' class='recycler-table-ebank'>";
		contentItem += "<tr class='recycler-row-parity'>"
		contentItem += "<td class='recycler-row-align-midle-left-opacity'><span>"+ CONST_STR.get('CONST_TRANS_LIMIT_TIT_SERVICE')+"</span></td>"
		contentItem += "<td class='recycler-row-align-midle-right-opacity'><span>"+ (CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_" + service.MA_DV))+"</span></td>"
		contentItem += "</tr>";
		contentItem += "<tr class='recycler-row-parity'>"
		contentItem += "<td class='recycler-row-align-midle-left-opacity'><span>"+ CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME_MAX')+"</span></td>"
		contentItem += "<td id='"+id+"-time-old' class='recycler-row-align-midle-right-opacity'><span>"+ formatCurrency2(parseInt(service.HAN_MUC_LAN_MAX))+"</span></td>"
		contentItem += "</tr>";	
		contentItem += "<tr class='recycler-row-parity'>"
		contentItem += "<td class='recycler-row-align-midle-left-opacity'><span>"+ CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY_MAX')+"</span></td>"
		contentItem += "<td id='"+id+"-time-old' class='recycler-row-align-midle-right-opacity'><span>"+ formatCurrency2(parseInt(service.HAN_MUC_NGAY_MAX))+"</span></td>"
		contentItem += "</tr></tbody></table></div></div>";	
		contentItem += "<table width='100%' align='center'><tbody><tr>"
		contentItem += '<td colspan="2" align="right" valign="middle"><div class="input-group widefull"><input id="'+id+'-time-new" type="text" class="form-control form-control-righttext input-none-border" placeholder="'+CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME')+'" onkeyup="handleInputAmount(event, this);" onchange="keepOnlyNumber(this.value)" value="'+formatCurrency2(parseInt(service.HAN_MUC_LAN))+'"/></div></td>';
		contentItem += "</tr>"
		contentItem += "<tr>"
		contentItem += '<td colspan="2" align="right" valign="middle"><div class="input-group widefull"><input id="'+id+'-day-new" type="text" class="form-control form-control-righttext input-none-border" placeholder="'+CONST_STR.get('CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY')+'" onkeyup="handleInputAmount(event, this);" onchange="keepOnlyNumber(this.value)" value="'+formatCurrency2(parseInt(service.HAN_MUC_NGAY))+'"/></div></td>';
		contentItem += "</tr></tbody></table>";		
	}
	
	contentHTML += contentItem + "";

	var element = document.getElementById("resultsTable");
	element.innerHTML = contentHTML;
}

function handleInputAmount (e, des) {
	var tmpVale = des.value;
	formatCurrency(e, des);
	var numStr = convertNum2WordWithLang(keepOnlyNumber(tmpVale), gUserInfo.lang); 
}

function validateLimit(GACCOtime, GACCOday, GTRANtime, GTRANday,
		 GPAYStime, GPAYSday, GPAYItime, GPAYIday) {

	if (GACCOtime.trim() == "" || GACCOtime == 0) {
		showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), ['"' + CONST_STR.get("COM_ACCOUNT") + '" - ' + CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME")]));
		return false;
	};
	if (GACCOday.trim() == "" || GACCOday == 0) {
		showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), ['"' + CONST_STR.get("COM_ACCOUNT") + '" - ' + CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY")]));
		return false;
	};
	if (GTRANtime.trim() == "" || GTRANtime == 0) {
		showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), ['"' + CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_GTRAN") + '" - ' + CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME")]));
		return false;
	};
	if (GTRANday.trim() == "" || GTRANday == 0) {
		showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), ['"' + CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_GTRAN") + '" - ' + CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY")]));
		return false;
	};
	if (GPAYStime.trim() == "" || GPAYStime == 0) {
		showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), ['"' + CONST_STR.get("MENU_PAYMENT") + '" - ' + CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME")]));
		return false;
	};
	if (GPAYSday.trim() == "" || GPAYSday == 0) {
		showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), ['"' + CONST_STR.get("MENU_PAYMENT") + '" - ' + CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY")]));
		return false;
	};
	if (GPAYItime.trim() == "" || GPAYItime == 0) {
		showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), ['"' + CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_GPAYI") + '" - ' + CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_TIME")]));
		return false;
	};
	if (GPAYIday.trim() == "" || GPAYIday == 0) {
		showAlertText(formatString(CONST_STR.get("CORP_MSG_COM_NO_INPUT"), ['"' + CONST_STR.get("CONST_TRANS_LIMIT_TIT_SERVICE_GPAYI") + '" - ' + CONST_STR.get("CONST_TRANS_LIMIT_TIT_LIMIT_CURRENT_DAY")]));
		return false;
	};

	var GACCOService;
	var GTRANService;
	var GPAYSService;
	var GPAYIService;
	for (var i in gTrans.currentUserLimit) {
		var service = gTrans.currentUserLimit[i];
		if (service.MA_DV == "GACCO") {
			GACCOService = service;
		}
		if (service.MA_DV == "GTRAN") {
			GTRANService = service;
		}
		if (service.MA_DV == "GPAYS") {
			GPAYSService = service;
		}
		if (service.MA_DV == "GPAYI") {
			GPAYIService = service;
		}
	}

	if (parseInt(GACCOtime) > parseInt(GACCOday)) {
		showAlertText(CONST_STR.get("SET_LIMIT_TIME_GREATER_DAY"));
		return false;
	}
	if (parseInt(GTRANtime) > parseInt(GTRANday)) {
		showAlertText(CONST_STR.get("SET_LIMIT_TIME_GREATER_DAY"));
		return false;
	}
	if (parseInt(GPAYStime) > parseInt(GPAYSday)) {
		showAlertText(CONST_STR.get("SET_LIMIT_TIME_GREATER_DAY"));
		return false;
	}
	if (parseInt(GPAYItime) > parseInt(GPAYIday)) {
		showAlertText(CONST_STR.get("SET_LIMIT_TIME_GREATER_DAY"));
		return false;
	}


	if (parseInt(GACCOtime) > parseInt(GACCOService.HAN_MUC_LAN_MAX)) {
		showAlertText(CONST_STR.get("SET_OVER_TIME_LIMIT"));
		return false;
	}
	if (parseInt(GACCOday) > parseInt(GACCOService.HAN_MUC_NGAY_MAX)) {
		showAlertText(CONST_STR.get("SET_OVER_DAY_LIMIT"));
		return false;
	}
	if (parseInt(GTRANtime) > parseInt(GTRANService.HAN_MUC_LAN_MAX)) {
		showAlertText(CONST_STR.get("SET_OVER_TIME_LIMIT"));
		return false;
	}
	if (parseInt(GTRANday) > parseInt(GTRANService.HAN_MUC_NGAY_MAX)) {
		showAlertText(CONST_STR.get("SET_OVER_DAY_LIMIT"));
		return false;
	}
	if (parseInt(GPAYStime) > parseInt(GPAYSService.HAN_MUC_LAN_MAX)) {
		showAlertText(CONST_STR.get("SET_OVER_TIME_LIMIT"));
		return false;
	}
	if (parseInt(GPAYSday) > parseInt(GPAYSService.HAN_MUC_NGAY_MAX)) {
		showAlertText(CONST_STR.get("SET_OVER_DAY_LIMIT"));
		return false;
	}
	if (parseInt(GPAYItime) > parseInt(GPAYIService.HAN_MUC_LAN_MAX)) {
		showAlertText(CONST_STR.get("SET_OVER_TIME_LIMIT"));
		return false;
	}
	if (parseInt(GPAYIday) > parseInt(GPAYIService.HAN_MUC_NGAY_MAX)) {
		showAlertText(CONST_STR.get("SET_OVER_DAY_LIMIT"));
		return false;
	}

	return true;
}

// function btnNextClick() {
	// var currentUserLimit = gSetUp.currentUserLimit;

	// var request = {};
	// request.new_limit = {
		// GACCO_time : keepOnlyNumber(document.getElementById('GACCO-time-new').value),
		// GACCO_day : keepOnlyNumber(document.getElementById('GACCO-day-new').value),
		// GTRAN_time : keepOnlyNumber(document.getElementById('GTRAN-time-new').value),
		// GTRAN_day : keepOnlyNumber(document.getElementById('GTRAN-day-new').value),
		// GPAYS_time : keepOnlyNumber(document.getElementById('GPAYS-time-new').value),
		// GPAYS_day : keepOnlyNumber(document.getElementById('GPAYS-day-new').value),
		// GPAYI_time : keepOnlyNumber(document.getElementById('GPAYI-time-new').value),
		// GPAYI_day : keepOnlyNumber(document.getElementById('GPAYI-day-new').value)
	// };
	// alert(keepOnlyNumber(document.getElementById('GACCO-time-new').value));
	// var isValid = validateLimit(request.new_limit.GACCO_time, request.new_limit.GACCO_day,
		 // request.new_limit.GTRAN_time, request.new_limit.GTRAN_day, request.new_limit.GPAYS_time,
		 // request.new_limit.GPAYS_day, request.new_limit.GPAYI_time, request.new_limit.GPAYI_day);
	// if (!isValid)
		// return;
	
	// request.old_limit = {
		// GACCO_time : currentUserLimit[0].HAN_MUC_LAN,
		// GACCO_day : currentUserLimit[0].HAN_MUC_NGAY,
		// GTRAN_time : currentUserLimit[1].HAN_MUC_LAN,
		// GTRAN_day : currentUserLimit[1].HAN_MUC_NGAY,
		// GPAYS_time : currentUserLimit[2].HAN_MUC_LAN,
		// GPAYS_day : currentUserLimit[2].HAN_MUC_NGAY,
		// GPAYI_time : currentUserLimit[3].HAN_MUC_LAN,
		// GPAYI_day : currentUserLimit[3].HAN_MUC_NGAY
	// };

	// var jsonData = new Object();
	// jsonData.sequence_id = "2";
	// jsonData.idtxn = gSetUp.idtxn;
	// jsonData.userId = gCustomerNo;
	// jsonData.request = request;
	
	// gSetUp.reviewData = request;
	
	// var	args = new Array();
	// args.push(null);
	// args.push(jsonData);
	// var gprsCmd = new GprsCmdObj(CONSTANTS.get("CMD_CO_SETUP_CHANGE_TRANS_LIMIT"), "", "", gUserInfo.lang, gUserInfo.sessionID, args);
	// var data = getDataFromGprsCmd(gprsCmd);
	// requestMBServiceCorp(data, true, 0, requestMBServiceSuccess, function(){
		// showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST'));
	// });
// }

// function requestMBServiceSuccess(e) {
	// var resp = JSON.parse(e);
	// if (resp.respCode == 55) {
		// showAlertText(CONST_STR.get("CORP_MSG_SAME_TYPE_TRANS_EXIST"));
		// return;
	// }
	// if (resp.respCode == '1012') {

		// var xmlDoc = genReviewScreen();
		// var req = {
			// sequence_id : "3",
			// idtxn : gSetUp.idtxn,
		//	transId : resp.respJsonObj[0].MA_GD
		// };
		// gCorp.cmdType = CONSTANTS.get('CMD_CO_SETUP_CHANGE_TRANS_LIMIT');
	    // gCorp.requests = [req, null];
	    // setReviewXmlStore(xmlDoc);
	    // navCachedPages["common/common-review/transfer-review-scr"] = null;

	    // gTrans.isBack = false;
	    // gCorp.rootView = currentPage;
	    // navController.pushToView("common/common-review/transfer-review-scr", true, 'html');

	// } else {
		// showAlertText(CONST_STR.get('INTERNAL_TRANS_AUTH_ERROR_GET_INTERNAL_TRANS_LIST'));
	// }
// } 

function formatCurrency2(num) {
	num = num.toString().replace(/\$|\,/g,'');
	if(isNaN(num))
	num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num*100+0.50000000001);
	num = Math.floor(num/100).toString();
	for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
	num = num.substring(0,num.length-(4*i+3))+','+
	num.substring(num.length-(4*i+3));
	return (((sign)?'':'-') + num);
}

