/**
 * Created by JetBrains WebStorm.
 * User: LanTB.FSOFT
 * Date: 7/19/16
 * Time: 11:36 AM
 * To change this template use File | Settings | File Templates.
 */

/*
cach su dung input control

var inputEl1 = new InputControl({
    containerMargin : "10px",
    idInput : "input-temp",
    placeholder : "Nhap so tai khoan",
    iconClass : "icon-homepage",
    inputMargin : "10px",
    textColor : "red",
    haveIcon : false,
    borderColor : "white",
    showBorderBottom : false,
    showBorderTop : true,
    fontSizeIcon : "10px",
    validate : "onlyNumber || onlyNumberAndChar || onlyNumberAndCharUpper",
    alertMessage : "hien thi alert khi user nhap sai"

});
inputEl1.show("mainViewContent");*/

function renderInput(id,placeholder,margin,textColor){
   var html ='<input id="'+id+'" placeholder="'+placeholder+'" ' +
       'style="margin:'+margin+';outline:none;border-width:0px;background-color: transparent;width:100%;color:'+textColor+'"/>';
   return html;
}

function renderIconInput(className,fontSize){
    console.log("inner html of");
    var html ='<div style="display:table;width: 100%;height:100%">' +
        '<span style="display:table-cell;vertical-align: middle;text-align: center;' +
        'font-size:'+fontSize+'" class="'+className+'"></span>' +
        '</div>';
    console.log("inner html of icon : " + html);
    return html;
}

function InputControl(opt){
    this.containerMargin = opt.containerMargin || "10px";
    this.idInput = opt.idInput;
    this.placeholder = opt.placeholder;
    this.iconClass  = opt.iconClass;
    this.inputMargin = opt.inputMargin;
    this.textColor = opt.textColor;
    this.haveIcon = opt.haveIcon;
    this.borderColor = opt.borderColor || "#734e89";
    this.fontSizeIcon = opt.fontSizeIcon;
    this.margin = opt.margin;
    this.showBorderBottom = opt.showBorderBottom;
    this.showBorderTop = opt.showBorderTop;
    this.validate = opt.validate || "onlyNumber";
    this.alertMessage = opt.alertMessage || "alert";
    this.options = opt;
}

InputControl.prototype.show = function(parentId){
    var ip = this;
    var parent = document.getElementById(parentId);

    var container = document.createElement("div");
    container.style.display = "block";
    container.style.height = "40px";
    container.style.borderLeft = "transparent";
    container.style.borderRight = "transparent";
    container.style.borderTop = this.showBorderTop ? "1px solid " +this.borderColor : "transparent";
    container.style.borderBottom = this.showBorderTop ? "1px solid " + this.borderColor : "transparent";
    container.style.margin = this.containerMargin;

    var holderIcon = document.createElement("div");
    holderIcon.style.float = "left";
    holderIcon.style.width = "15%";
    holderIcon.style.borderRight = "1px solid";
    holderIcon.style.borderColor = this.borderColor;
    holderIcon.style.height = "39px";
    holderIcon.innerHTML = renderIconInput(this.iconClass,this.fontSizeIcon);

    var holderInput = document.createElement("div");
    holderInput.style.float = "right";
    holderInput.style.width = this.haveIcon ? "85%" : "100%";
    holderInput.style.height = "40px";
    holderInput.innerHTML = renderInput(this.idInput,this.placeholder,this.inputMargin,this.textColor);


    if(this.haveIcon) container.appendChild(holderIcon);
    container.appendChild(holderInput);
    parent.appendChild(container);

    var inputEl = document.getElementById(this.idInput);
    if(this.validate === "onlyNumber"){
        inputEl.addEventListener('keypress', setInputOnlyNumberInfo(this.idInput,this.alertMessage) , false);
    }else if(this.validate === "onlyNumberAndChar"){
        inputEl.addEventListener('keypress', setInputOnlyNumberAndChar(this.idInput,this.alertMessage) , false);
    }else if(this.validate === "onlyNumberAndCharUpper"){
        inputEl.addEventListener('keypress', setInputOnlyNumberAndChar(this.idInput,this.alertMessage) , false);
    }
};