/**
 * Created by HaiDT1 on 3/17/2017.
 */

/**
 * Created by JetBrains WebStorm.
 * User: LanTB.FSOFT
 * Date: 7/18/16
 * Time: 4:22 PM
 * To change this template use File | Settings | File Templates.
 */


/*
 cách khai báo và dùng combo box

 var comboEl = new Combo({
 containerId : "cb-container", //holder of combo
 accountName : "Nguyen Ngoc Dung VND", //account name
 accountNumber : "090808080080808080", //account number
 accountBalance : "300,000,000 VND", //account balance
 borderColor : "yellow", // border color
 containerPadding : "10px", // set padding to holder of combo
 containerMargin : "10px", //set margin to holder of combo
 clickIt : function (){ //handle function click
 console.log("already click");
 }
 });
 comboEl.show("mainViewContent"); // show combo element in main view content div

 setTimeout(function(){
 comboEl.refresh({ //use refesh function
 accountName : "Nguyen Ngoc Dung - VND",
 accountNumber : "190808080080808080",
 accountBalance : "400,000,000 VND"
 });
 }, 2000);
 comboEl.getByIndex(2);//cach lay gia tri trong combo text theo index : 0,1,2
 */


function ComboSetCurrency(opt){
    this.containerId = opt.containerId;
    this.accountName = opt.accountName || "";
    this.accountNumber = opt.accountNumber || "";
    this.accountBalance = opt.accountBalance || "";
    this.borderColor = opt.borderColor || "white";
    this.textColor = opt.textColor || "white";
    this.fontSize = opt.fontSize || "12px";
    this.containerPadding = opt.containerPadding;
    this.containerMargin = opt.containerMargin;
    this.paddingIcon = opt.paddingIcon || "5% 0 0 0";
    this.showBorderTop = opt.showBorderTop || true;
    this.showBorderBottom = opt.showBorderBottom || true;
    this.options = opt;
    this.hiddenArrow = opt.hiddenArrow;
    this.currency = opt.currency;
}

ComboSetCurrency.prototype.show = function (idParent){
    var combo = this;
    var container = document.createElement("div");
    container.id = this.containerId;
    container.style.display  = "flex";
    container.style.borderBottom = this.borderBottom ?  "1px solid" : "transparent";
    container.style.borderTop = this.borderTop ?  "1px solid" : "transparent";
    container.style.borderColor = this.borderColor;
    container.style.color = this.textColor;
    container.style.fontSize = this.fontSize;
    container.style.padding = this.containerPadding;
    container.style.margin = this.containerMargin;
    container.innerHTML = renderDataCombo1(this.accountName,this.accountNumber,this.accountBalance,this.paddingIcon, this.hiddenArrow, this.currency);
    var parent = document.getElementById(idParent);
    parent.appendChild(container);
    container.addEventListener('click', function (e) {
        combo.options.clickIt();
    }, false);
};
ComboSetCurrency.prototype.refresh = function (opt){
    this.accountName = opt.accountName;
    this.accountNumber = opt.accountNumber;
    this.accountBalance = opt.accountBalance;
    fillData(this.containerId,this.accountName,this.accountNumber,this.accountBalance);
}

ComboSetCurrency.prototype.getByIndex = function(index){
    if(index > 2){return "index out of bound"};
    var holder = document.getElementById(this.containerId).childNodes[0];
    for(var i = 0 ; i < 3; i++){
        if(i === index){
            return holder.childNodes[i].childNodes[0].innerText;
        }
    }

}

function fillData(containerId,accountName, accountNumber,accountBalance){
    var container = document.getElementById(containerId);
    if(typeof accountName !== "undefined"){
        container.querySelector(".accountName").innerHTML = '<span>' + accountName + '</span>';
        //document.getElementById('accountName').childNodes[0].innerHTML = accountName;
    }
    if(typeof accountNumber !== "undefined"){
        container.querySelector(".accountNumber").innerHTML = '<span>' + accountNumber + '</span>';
        //document.getElementById('accountNumber').childNodes[0].innerHTML = accountNumber;
    }
    if(typeof accountBalance !== "undefined"){
        container.querySelector(".accountBalance").innerHTML = '<span>' + accountBalance + '</span><span> VND</span>';
        // document.getElementById('accountBalance').childNodes[0].innerHTML = accountBalance;
    }
}
function renderDataCombo1(accountName, accountNumber,accountBalance,paddingIcon, hiddenArrow, currency){
    var html = '<div style="width:98%">';
    if(typeof accountName !== undefined && accountName.length > 0 && accountName!=""){
        html+='<div><span>'+accountName+'</span></div>';
    }
    if(typeof accountNumber !== undefined && accountNumber.length > 0 && accountNumber!=""){
        html+='<div class="accName"><span>'+CONST_STR.get('ACCOUNT_ACC_NO_TITLE')+'</span></div><div class="accountNumber"><span>'+accountNumber+'</span></div>';
    }
    if(typeof accountBalance !== undefined && accountBalance.length > 0 && accountBalance!=""){
        html+='<div class="accName"><span>'+CONST_STR.get('ACCOUNT_AVAILABLE_BALANCE')+'</span></div><div class="accountBalance"><span>'+accountBalance+'</span><span>' + " " +currency+'</span></div>';
    }
    html+='</div>';
    if (!hiddenArrow){
        html+='<div style="float:right;padding:'+ paddingIcon +'" id="arrow"><span class="icon-movenext input-group-symbol"></span></div>';
    }

    return html;
}