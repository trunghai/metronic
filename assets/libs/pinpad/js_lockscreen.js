// JavaScript Document


var pass_value = "";
var pass_temp="";
var paramObj = {
	typeAction: "change_pass"
	
}

var PASS_ONE = 0,PASS_TWO = 1,PASS_THREE = 2,PASS_FOUR = 3,COUNT_PASS= 4;

var ACTION_CHANGEPASS = "change_pass";
var ACTION_LOGIN = "login";
var ACTION_CREATEPASS = "create_pass";
var start_create_pass = 0;
var start_change_pass = 0;
var isCheckOldPass = false;



function checkValue(i){
	
	if(paramObj.typeAction == ACTION_LOGIN){
		if(pass_value==("1234"))
			alert("Mật khẩu đúng rồi");
		else if(pass_value.length > PASS_FOUR ){
			
			animationError();
			actionClear();
		}
	}else if(paramObj.typeAction == ACTION_CHANGEPASS){
		// Kiểm tra check với mã pin cũ chưa - Chưa check
		if(isCheckOldPass == false){
			//Nêu mật khẩu trùng nhau:
			if(pass_value ==("1234")){
			if(start_change_pass == 0){
				document.getElementById("title_lock").innerHTML = "Nhập mã pin mới";
				actionClear();
				start_change_pass = 1;
				isCheckOldPass = true;
			}
			
			
		}else{
			document.getElementById("error_message").innerHTML="Mã pin không khớp vui lòng nhập lại.";
			actionClear();
		}
			
		}else{
			if(start_change_pass == 1 ){
				//Kiểm tra mật khẩu mới 
				if(pass_value ==("1234")){
					actionClear();
					start_change_pass = 1;
					document.getElementById("title_lock").innerHTML = "Nhập mã pin mới";
					document.getElementById("error_message").innerHTML="Mật khẩu mới trùng với mật khẩu hiện tại";
				}
				else{
					pass_temp = pass_value;
					actionClear();
					start_change_pass = 2;
					document.getElementById("title_lock").innerHTML = "Nhập lại mã pin mới";
				}
			}else if(start_change_pass==2){
				if(pass_temp == pass_value){
					alert("Thay đổi mật khẩu thành công");
				
				}else{
					start_change_pass = 1;
					document.getElementById("error_message").innerHTML="Mã pin không khớp vui lòng nhập lại.";
					document.getElementById("title_lock").innerHTML = "Nhập mã pin mới";
					actionClear();
					isCheckOldPass = true;
					
				}
			}
		}
		
		
		
	}else if(paramObj.typeAction == ACTION_CREATEPASS){
		// Người dùng nhập mã pin
		if(start_create_pass == 0){
			pass_temp = pass_value;
			actionClear();
			document.getElementById("title_lock").innerHTML = "Nhập lại mã pin";
			start_create_pass = 1;
			// Chờ người dùng nhập lại mã pin
		}else{
			// Kiểm tra 2 mã pin có trùng không
			if(pass_temp == pass_value){
				alert("Mật khẩu đúng rồi");
				
			}else{
				document.getElementById("error_message").innerHTML="Mã pin không khớp vui lòng nhập lại.";
				document.getElementById("title_lock").innerHTML = "Nhập mã pin";
				actionClear();
				
			}
			start_create_pass = 0;
		}
	}
	
	
}

function actionPass(value){
	var length = pass_value.length;
	document.getElementById("error_message").innerHTML="&nbsp;";

	if(length < COUNT_PASS){
		fillCirclePass(length);
		pass_value += value;
		if(pass_value.length == 4)
			checkValue();
		
	}else if(length >= COUNT_PASS){
		checkValue();
	}
	console.log(pass_value);
}

function fillCirclePass(length){
	if(length == PASS_ONE){
			var att = document.getElementById("pass_one");
			if(att != null)
				att.setAttribute("fill", "#fff");
			
		}else if(length == PASS_TWO){
			var att = document.getElementById("pass_two");
			if(att != null)
				att.setAttribute("fill", "#fff");
		}else if(length == PASS_THREE){
			var att = document.getElementById("pass_three");
			if(att != null)
				att.setAttribute("fill", "#fff");
		}else if(length == PASS_FOUR){
			var att = document.getElementById("pass_four");
			if(att != null)
				att.setAttribute("fill", "#fff");
		}
}

function actionClear(){
	
	pass_value="";
	var att = document.getElementById("pass_one");
			if(att != null)
				att.setAttribute("fill", "none");
	var att2 = document.getElementById("pass_two");
			if(att2 != null)
				att2.setAttribute("fill", "none");
	var att3 = document.getElementById("pass_three");
			if(att3 != null)
				att3.setAttribute("fill", "none");
	var att4 = document.getElementById("pass_four");
			if(att4 != null)
				att4.setAttribute("fill", "none");
			
}

function actionClearStepbyStep(){
	
	
	if(pass_value.length==COUNT_PASS){
		var att4 = document.getElementById("pass_four");
			if(att4 != null){
				att4.setAttribute("fill", "none");
				pass_value= pass_value.substring(0,3);
			}
	}
	else if(pass_value.length==PASS_FOUR){
		var att3 = document.getElementById("pass_three");
			if(att3 != null){
				att3.setAttribute("fill", "none");
				pass_value= pass_value.substring(0,2);
			}
	}
	else if(pass_value.length==PASS_THREE){
	var att2 = document.getElementById("pass_two");
			if(att2 != null){
				att2.setAttribute("fill", "none");
				pass_value= pass_value.substring(0,1);
			}
	}else if(pass_value.length==PASS_TWO){
	var att = document.getElementById("pass_one");
			if(att != null){
				att.setAttribute("fill", "none");
				pass_value="";
			}
	}
	
		
}

function animationError(){
//	$("#enter_code").shake({speed:"1000",distance :"10"});
	
	$("#enter_code").effect("shake", {times:2,distance:'10',direction:'top',}, 500 );
	$("#error_message").text("Mã PIN không khớp. Quý khách vui lòng nhập lại.");
	
		//var att = document.getElementById("enter_code");
//        att.animate({left: '15px'});
   

}