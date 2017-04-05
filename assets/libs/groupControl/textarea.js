/**
 * Created by JetBrains WebStorm.
 * User: LanTB.FSOFT
 * Date: 7/19/16
 * Time: 5:33 PM
 * To change this template use File | Settings | File Templates.
 */

/*
cách dùng textarea
var textAreaEl = new TextArea({
    containerMargin : "10px",
    idTextArea : "input-temp2",
    placeholder : "hello word",
    iconClass : "icon-homepage",
    textColor : "red",
    borderColor : "white",
    showBorderBottom : true,
    showBorderTop : true,
    fontSizeIcon : "10px",
    validateInput : function(){
        console.log("validate function");
    }
});*/
function renderIcon(className,fontSize){
    var html ='<div style="display:table;width: 100%;height:100%">' +
        '<span style="display:table-cell;vertical-align: middle;text-align: center;font-size:'+fontSize+'" class="'+className+'">' +
        '</span></div>';
    return html;
}
function renderTextArea(id,placeholder,lengthmax){
    var str = "";
    if(lengthmax != undefined){
        str = 'maxlength="'+ lengthmax + '"';
    }
    var html = ' <div class="area dummy"></div><textarea class="area" id="'+id+'" placeholder="'+placeholder+'"'+ str +'></textarea>';
    return html;
}

function TextArea(opt){
    this.containerMargin = opt.containerMargin;
    this.idTextArea = opt.idTextArea;
    this.placeholder = opt.placeholder;
    this.textAreaMargin = opt.textAreaMargin || "15px 15px 10px 15px";
    //this.textColor = opt.textColor;
    this.borderColor = opt.borderColor;
    this.showBorderBottom = opt.showBorderBottom || true;
    this.showBorderTop = opt.showBorderTop || true;
    this.iconClass  = opt.iconClass;
    this.fontSizeIcon = opt.fontSizeIcon || "15px";
    this.heigth =  opt.height || "70px";
    this.option = opt;
    this.lengthmax = opt.lengthmax;
    this.breakLine = false;
}

TextArea.prototype.show = function(parentId){
    var txtArea = this;
    var parent = document.getElementById(parentId);

    var container = document.createElement("div");
    container.className="bg-text-area";
   // container.style.display = "block";
    //container.style.margin = this.containerMargin;
    //container.style.borderLeft = "transparent";
    //container.style.borderRight = "transparent";
    //container.style.borderColor = this.borderColor;
    //container.style.borderTop = this.showBorderTop ? "1px solid " + this.borderColor : "transparent";
    //container.style.borderBottom = this.showBorderTop ? "1px solid " + this.borderColor : "transparent";
   // container.style.height = this.heigth;

    var holderIcon = document.createElement("div");
    holderIcon.className="holderIcon";
    /*holderIcon.style.float = "left";
    holderIcon.style.width = "20%";
    holderIcon.style.borderRight = "1px solid";
    holderIcon.style.borderColor = this.borderColor;
    holderIcon.style.height = this.heigth;*/
    holderIcon.innerHTML = renderIcon(this.iconClass,this.fontSizeIcon);

    var holderArea = document.createElement("div");
    //holderArea.style.float = "right";
    //holderArea.style.width =  "80%";
    holderArea.className = "holder-txtarea";
    //holderArea.style.height = this.heigth;
    holderArea.innerHTML = renderTextArea(this.idTextArea,this.placeholder,this.lengthmax);

    container.appendChild(holderIcon);
    container.appendChild(holderArea);

    parent.appendChild(container);

    var area = document.getElementById(this.idTextArea);
    var wrap = document.getElementById(txtArea.option.idTextArea).parentNode;
    console.log(wrap.className);
    var dummy = wrap.querySelector(".dummy");
    console.log(dummy.className);
    var html = formatDummyText(this.placeholder);
    dummy.innerHTML = html;
    positionTextarea(wrap,dummy,area);  

}
//phuctd1 bo sung phan noi dung cho chuyen tien lien ngan hang
function TextAreaLNH(opt){
    this.containerMargin = opt.containerMargin;
    this.idTextArea = opt.idTextArea;
    this.placeholder = opt.placeholder;
    this.textAreaMargin = opt.textAreaMargin || "15px 15px 10px 15px";
    //this.textColor = opt.textColor;
    this.borderColor = opt.borderColor;
    this.showBorderBottom = opt.showBorderBottom || true;
    this.showBorderTop = opt.showBorderTop || true;
    this.iconClass  = opt.iconClass;
    this.fontSizeIcon = opt.fontSizeIcon || "15px";
    this.heigth =  opt.height || "70px";
    this.option = opt;
    this.lengthmax = opt.lengthmax;
}

TextAreaLNH.prototype.show = function(parentId){
    var txtArea = this;
    var parent = document.getElementById(parentId);

    var container = document.createElement("div");
    container.className="bg-text-area";
   // container.style.display = "block";
    //container.style.margin = this.containerMargin;
    //container.style.borderLeft = "transparent";
    //container.style.borderRight = "transparent";
    //container.style.borderColor = this.borderColor;
    //container.style.borderTop = this.showBorderTop ? "1px solid " + this.borderColor : "transparent";
    //container.style.borderBottom = this.showBorderTop ? "1px solid " + this.borderColor : "transparent";
   // container.style.height = this.heigth;

    var holderIcon = document.createElement("div");
    holderIcon.className="holderIcon";
    /*holderIcon.style.float = "left";
    holderIcon.style.width = "20%";
    holderIcon.style.borderRight = "1px solid";
    holderIcon.style.borderColor = this.borderColor;
    holderIcon.style.height = this.heigth;*/
    holderIcon.innerHTML = renderIcon(this.iconClass,this.fontSizeIcon);

    var holderArea = document.createElement("div");
    //holderArea.style.float = "right";
    //holderArea.style.width =  "80%";
    holderArea.className = "holder-txtarea";
    //holderArea.style.height = this.heigth;
    holderArea.innerHTML = renderTextArea(this.idTextArea,this.placeholder,this.lengthmax);

    container.appendChild(holderIcon);
    container.appendChild(holderArea);

    parent.appendChild(container);

    var area = document.getElementById(this.idTextArea);
    var wrap = document.getElementById(txtArea.option.idTextArea).parentNode;
    console.log(wrap.className);
    var dummy = wrap.querySelector(".dummy");
    console.log(dummy.className);
    var html = formatDummyText(this.placeholder);
    dummy.innerHTML = html;
    positionTextarea(wrap,dummy,area);

    area.addEventListener("input",function(){
        var positionSelect = area.selectionStart;
        var content = area.value;
        var rContent = content.replace(/(\r\n|\n|\r)/gm,"").length;

        if(rContent > 100 ){
            var content100 =  area.value;
            content100 = content100.replace(/(\r\n|\n|\r)/gm,"");
            area.value = content100.slice(0,100) +'\n' +  content100.slice(100);
            if(typeof device !== 'undefined' && device.platform =='Android'){

            }else{
                if(positionSelect>100){
                    if(charsCheck >= rContent ){
                        area.selectionEnd = positionSelect;
                    }else{
                        area.selectionEnd = positionSelect+1;
                    }

                }else{
                    area.selectionEnd = positionSelect;
                }
            }
        }else{
            var contentsub =  area.value;
            contentsub = contentsub.replace(/(\r\n|\n|\r)/gm,"");
            area.value = contentsub;
            if(typeof device !== 'undefined' && device.platform =='Android'){

            }else{

                area.selectionEnd = positionSelect;
            }

        }
        charsCheck =  area.value.length;


        console.log("charsCheck " + " " + parseInt(rContent/100) + " " + positionSelect );
    });

}

function positionTextarea(wrap,dummy,textarea) {
    console.log("set position");
    var h = wrap.clientHeight;
    var dummyH = dummy.clientHeight;
    var top = Math.max( 0, ( h - dummyH ) * 0.5 );
   // textarea.style.top = (top) + "px";
   // textarea.style.height = (h-top -5) + "px";
}
function formatDummyText( text ) {
    if ( !text ) {
        return '&nbsp;';
    }
    return text.replace( /\n$/, '<br>&nbsp;' )
        .replace( /\n/g, '<br>' );
}