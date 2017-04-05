var start = {
    x: 0,
    y: 0
};
var move = {
    x: 0,
    y: 0
};
var firstLetterArray = new Array();
var bgrColorArray = new Array();
var globalLength = 0;
var maxWith = 150;

var clickDoubleFlag = null;

var flagTouchStart = false;
var flagTouchMove = false;
var flagTouchEnd = false;
var flagClickDot = false;

var pageIndex = 1;
var tempListViewGlobal = {};

var tempPrevNode = null;
var tempIdPrevNode = null;

var tempDotNote = null;
// Cach dung

// HTML khai bao trong HTML
// <div id="list-view">
//</div>
// Js
///*** INIT VIEW ***/

//function viewDidLoadSuccess() {
//
//var list = new ListView({
//    data :  tmpArr,
//    parserService : false,
//    fieldsRow : ["accname","acctno","category"],
//    fieldsHidden : ["acctno","payee","transid"],
//    avatar : {status: true},
//    option : "group",
//    fieldGroup : "category",
//    maxWidthButton : 50,
//    button : [
//        // { name : 'func', icon : 'icon-help', action: function(id){ console.log('func' + id); }, type: 'func'},
//        // { name : 'link', icon : 'icon-help', action: 'google.com', type: 'link'},
//        { name : 'delete', icon : 'icon-help', action: function(id){
//            var pValue = document.getElementById(id).getElementsByClassName("p-value");
//            console.log(pValue);
//            var accNo = pValue.childNodes[0].innerHTML;
//            var typeList = pValue.childNodes[1].innerHTML;
//            var transId = pValue.childNodes[2].innerHTML;
//
//            showConfirmDelete(accNo, typeList, transId);
//            console.log('delete' + id);
//        }
//            , type: 'delete'}
//    ]
//});
//
//var html = list.showList("list-view-search");
//
//html.style.marginTop = "50px"; //fix code
//div.appendChild(html);
//
//list.showList("list-view");
//}



function ListView(opt){
    if(opt !== null && opt !==undefined)
    {
        this.type = opt.type;
        this.idParent = opt.idParent || null;

        // Type: using type
        this.data = opt.data; //data
        this.parserService = opt.parserService; // true la parser severcie false no parser
        this.fieldsRow = typeof opt.fieldsRow === 'object' ? opt.fieldsRow : [] ; // [1,2,3,4,12,13,14,15] || ['category','pyee']; // so luong truong cua 1 dong
        this.fieldsHidden = opt.fieldsHidden || []; //["acctno","payee","transid"] || [1,2,3,4,12,13,14,15]
        this.fieldImage = opt.fieldImage || null; //
        this.specLiList =opt.specLiList || "";


        //Screen
        this.screen = opt.screen || 810;

        // config avatar
        this.avatar = opt.avatar.status || false;
        this.avatarField = opt.avatar.avatarField || false;
        this.hexaColor = opt.avatar.hexaColor || ['#ffff00', '#ff0000', '#00ff00', '#0000ff', '#ffffff']; //color

        // config paging
        // co the la group hoac paging
        this.option = opt.option || "default"; // or "group" or "default"
        this.paging = this.option  == "paging" ? true : false;

        this.fieldGroup = this.option  == "group" ? opt.fieldGroup || "category" : this.fieldGroup = null;
        this.showGroup = opt.showGroup || false;
        this.fieldsFomatCurrency = opt.fieldsFomatCurrency || []; //['amount']
        this.numberRecords = opt.numberRecords ||  5;
        this.showDotDiv =  opt.showDotDiv == false ? false : true;

        this.totalPages = 0;
        this.totalRecods = 0;
        this.vIndexLast = null;
        this.paserGroup = false;

        this.doubleClickItem = opt.doubleClickItem || null; //double click function

        // Type 1. func:  function
        // Type 2. link: link
        // Type 3. delete: Delete row and function
        // button delete do not working using opt.parserService is true
        this.button = opt.button||[];
        // sample
        //{{ name : 'func', icon : 'icon-help', action: function(id){ console.log('func' + id); }, type: 'func'},
        //{ name : 'link', icon : 'icon-help', action: 'google.com', type: 'link'},
        //{ name : 'delete', icon : 'icon-help', action: function(id){ console.log('delete' + id); }, type: 'delete',
        //    idPopup :  'btnAlertConfirmOk'
        //}]

        maxWith = opt.maxWidthButton || 150;

        //temp data
        tempListViewGlobal[this.idParent] = this;
    }

}
ListView.prototype.parserData =  function (dataInput) {
    // parse data
    var arrData = dataInput;
    var fieldData = [];
    try{
        var lengthData = arrData.length;
    }catch(ex){
        logInfo('Loi parser data swipeaction')
        logInfo(dataInput)
        return fieldData;
    }



    for(var i = 0; i < lengthData; i++)
    {
        //convert one
        var items = arrData[i].split("#");
        var tempFields = {};
        if (items !== undefined)
        {
            // get data by order
            if(this.fieldsRow.length > 0)
            {
                var x,y;
                var z =0;
                for (x in this.fieldsRow){
                    var val = this.fieldsRow[x];
                    if (typeof val == 'number') {
                        tempFields['field-' +z]= items[val];
                        z += 1;
                    }
                }
                z =0;
                for (y in this.fieldsHidden){
                    var val = this.fieldsHidden[y];
                    if (typeof val == 'number') {
                        tempFields['field-hidden-' +z]= items[val];
                        z += 1;
                    }
                }
            }
            else{

                for(var j = 0; j < items.length; j++)
                {
                    tempFields['field-' + j]= items[j];
                }
            }
            fieldData[i] = tempFields;

            // check break
            // khi so record duoc xac dinh o truong hop default
            if (this.numberRecords > 5 &&
                this.numberRecords == (i+1) &&
                this.option =="default"
                ){
                break;
            }
        }
    }
    return fieldData;
}


ListView.prototype.parserDataGroup =  function (dataInput, dataTempRefresh, vGroup) {
    // parse data
    var arrData = dataInput;
    var lengthData = arrData.length;
    var tempTypeGroup = [];
    var resultDataGroup = {};
    if(dataTempRefresh !== undefined && dataTempRefresh !== null && dataTempRefresh !== ""){
        resultDataGroup = dataTempRefresh;
    }

    for(var i = 0; i < lengthData; i++)
    {

        var fGroup = this.fieldGroup;
        if(this.fieldGroup == undefined)
            fGroup = vGroup;
        //convert one
        var group = arrData[i][fGroup];
        if(!this.checkDataField(tempTypeGroup, group)){
            tempTypeGroup.push(group);
            resultDataGroup[group] = [arrData[i]];
        }else{
            resultDataGroup[group].push(arrData[i]);
        }
    }

    return resultDataGroup;
}
ListView.prototype.checkNameGroup =  function (value) {

    var categoryLast = document.querySelectorAll(".p-category .p-name-category");
    if(categoryLast != undefined && categoryLast !=null && categoryLast.length > 0){
        //var index  = categoryLast.length-1;
        for(var index = 0; index < categoryLast.length;index++)
        {
            if(categoryLast[index].innerHTML == value){
                return [false, index];
            }
        }

    }
    return [true, -1];
}

ListView.prototype.lengthGroup =  function (data) {
    var lenGroup = 0
    var count =0;
    for(var prop in data ){
        lenGroup += data[prop].length;
        count++;
    }

    return [count, lenGroup];
}

ListView.prototype.refreshDataGroup =  function (idParent,dataInput) {
    // refesh data
    var z = this.lengthGroup(tempListViewGlobal[idParent].data)[0];
    tempListViewGlobal[idParent].data = this.parserDataGroup(dataInput,tempListViewGlobal[idParent].data,tempListViewGlobal[idParent].fieldGroup);

    var parent =  document.getElementById(idParent);

    var dataAppend = this.parserDataGroup(dataInput,null,tempListViewGlobal[idParent].fieldGroup);

    for (var prop in dataAppend) {
        if(prop.trim() !=""){
            console.log(prop);
            // Check group
            var resultCheckName = this.checkNameGroup(prop);
            if(resultCheckName[0] == true){
                var divTitle = document.createElement("div");
                divTitle.innerHTML = "<span class='p-name-category'>"+ prop + "</span><span class='icon-movenext'></span>";
                divTitle.className = "p-category";
                divTitle.id = "p-category-" + z ;
                divTitle.addEventListener('click',function(){
                    var idList = this.id.split("-")[2];
                    var ulList = document.getElementById("p-ul-" + idList);
                    if(ulList.style.opacity == 0){
                        ulList.style.opacity = 1;
                        ulList.style.height = "auto";
                        ulList.style.visibility = "";
                        ulList.style.margin = "-5px 5px 5px 5px";
                        this.style.borderRadius = "10px 10px 0px 0px";
                        this.getElementsByTagName("span")[0].style.transform = "rotate(-90deg)";
                    }else{
                        ulList.style.opacity = 0;
                        ulList.style.visibility = "hidden";
                        ulList.style.height = "0px";
                        this.getElementsByTagName("span")[0].style.transform  = "rotate(90deg)";
                        this.style.borderRadius = "10px 10px 10px 10px";
                    }

                });
                parent.appendChild(divTitle);

                var ulListViewNew = document.createElement("ul");
                for(var i = 0; i < dataAppend[prop].length; i++)
                {
                    var item = tempListViewGlobal[idParent].createItem(i,dataAppend[prop][i],z);
                    ulListViewNew.appendChild(item);
                }
                ulListViewNew.id = "p-ul-" + z;
                ulListViewNew.style.opacity = 0;
                ulListViewNew.style.visibility = "hidden";
                ulListViewNew.style.height = "0px";
                ulListViewNew.style.transition = "ease 0.8s";
                ulListViewNew.style.margin = "-2px 5px 5px 5px";

                parent.className = "list-view";
                parent.appendChild(ulListViewNew);
                z++;
            }else{
                //var lastUl = parent.querySelector("ul:last-child");

                var lastUl = parent.querySelector("ul#p-ul-"+ resultCheckName[1]);

                var indUl = lastUl.id.split("-")[2];
                for(var i = 0; i < dataAppend[prop].length; i++)
                {
                    var item = tempListViewGlobal[idParent].createItem(i,dataAppend[prop][i],indUl);
                    lastUl.appendChild(item);
                }

            }

        }
    }
    //this.showList()
}


ListView.prototype.checkDataField = function (arrData,value)
{
    // Returns true if the passed value is found in the
    // array. Returns false if it is not.
    var i;
    for (i=0; i < arrData.length; i++)
    {
        if (arrData[i] == value)
        {
            return true;
        }
    }
    return false;
}
ListView.prototype.createField =  function (keyDiv, dataDiv, value) {
    var divField = document.createElement("div");

    if(value == null && this.checkDataField(this.fieldsFomatCurrency,keyDiv)){
        divField.innerHTML = formatNumberToCurrency(dataDiv);
        console.log('formatNumberToCurrency');
    }
    else{
        divField.innerHTML = dataDiv;
    }

    divField.className =  value == null ? "p-list-" + keyDiv : "p-value-" + value;
    divField.className += " "+ "break-slide";

    return divField;

}


ListView.prototype.createButton =  function (id, dictButton) {

    var divButton = document.createElement("a");
    var styleButton ="";

    if(dictButton.background != undefined)
    {
        styleButton = "style='background-color:" + dictButton.background  +"!important;'"

    }

    divButton.innerHTML = "<div class='p-btn-"+dictButton.type+"' " +
        styleButton
        +"><span class='"+ dictButton.icon +"'></span></div>";
    divButton.className = "btn-action-a break-slide";


    var handle =  function(){
        if(flagClickDot == true){
            flagClickDot = false;
            return;
        }

        if (dictButton.type=='func')
        {
            dictButton.action(id);
        }
        else if (dictButton.type =='delete'){
            dictButton.action(id);

            //child.style.width = "0px";
            if (dictButton.idPopup != null){
                var clickPopup = function(){
                    console.log('click to button');
                    var child = document.getElementById(id);
                    if(child != null)
                    {
                        child.style.width = "0px";
                        setTimeout(function(){
                            try{
                                child.parentNode.removeChild(child);
                                var idListParent = child.parentNode.parentNode.id;
                                var numberId = id.split("-")[3];

                                // remove object data
                                try{
                                    if(tempListViewGlobal[idListParent].parserService == false){
                                        if(tempListViewGlobal[idListParent].option == "group"){
                                            var groupId = id.split("-")[1];
                                            tempListViewGlobal[idListParent].data[Object.keys(tempListViewGlobal[idListParent].data)[groupId]].splice(numberId, 1);

                                            // xoa category.
                                            if (tempListViewGlobal[idListParent].data[Object.keys(tempListViewGlobal[idListParent].data)[groupId]].length ==0){
                                                delete tempListViewGlobal[idListParent].data[Object.keys(tempListViewGlobal[idListParent].data)[groupId]]
                                            }
                                            tempListViewGlobal[idListParent].paserGroup = true;
                                            var nodeParent = document.getElementById(tempListViewGlobal[idListParent].idParent).parentNode;
                                            tempListViewGlobal[idListParent].showList(nodeParent, tempListViewGlobal[idListParent].idParent);

                                        }else{
                                            tempListViewGlobal[idListParent].data.splice(numberId, 1);
                                            var nodeParent = document.getElementById(tempListViewGlobal[idListParent].idParent).parentNode;
                                            tempListViewGlobal[idListParent].showList(nodeParent,tempListViewGlobal[idListParent].idParent);
                                        }
                                    }else{
                                        tempListViewGlobal[idListParent].data.splice(numberId, 1);
                                        tempListViewGlobal[idListParent].parserService = false;
                                        var nodeParent = document.getElementById(tempListViewGlobal[idListParent].idParent).parentNode;
                                        tempListViewGlobal[idListParent].showList(nodeParent,tempListViewGlobal[idListParent].idParent);

                                    }

                                }catch(e)
                                {
                                    console.log("del List error" + numberId);
                                    console.log(e);
                                }

                            }catch(e)
                            {
                                console.log(e);
                            }

                        }, 1);
                    }

                    document.getElementById(dictButton.idPopup).removeEventListener("click",clickPopup, false)
                }
                document.getElementById(dictButton.idPopup).addEventListener("click", clickPopup, false)
            }else{
                console.log('action dell');
            }


        }else if (dictButton.type =='save'){
            dictButton.action(id);
//            document.getElementById(dictButton.idPopup).addEventListener("click",false)

        }else if (dictButton.type =='link'){
            window.open(dictButton.link);
        }

        document.getElementById(id).removeEventListener('click', handle ,false)
    };

    divButton.addEventListener('click',handle, false);
    return divButton;

}
ListView.prototype.showList = function (elementParent) {
    var idParent = this.idParent;
    if (idParent) {
        //reset node
        var checkResetNode = document.getElementById(idParent);
        if (checkResetNode !== null){
            // recreateNode(checkResetNode);
            if(checkResetNode.parentNode !== null)
            {
                checkResetNode.parentNode.removeChild(checkResetNode);
            }
        }

        var parent = document.createElement("div");
        parent.id = idParent;

        this.data = this.parserService == true ? this.parserData(this.data) :  this.data;

        if(this.option == "group")
        {
            this.data = this.paserGroup == false ? this.parserDataGroup(this.data,null): this.data;
            var z = 0;
            for (var prop in this.data) {
                if(prop.trim() !=""){
                    var divTitle = document.createElement("div");
                    divTitle.innerHTML = "<span class='p-name-category'>" + prop + "</span><span class='icon-movenext'></span>";
                    divTitle.className = "p-category";
                    divTitle.id = "p-category-" + z ;
                    divTitle.addEventListener('click',function(){
                        var idList = this.id.split("-")[2];
                        var ulList = document.getElementById("p-ul-" + idList);
                        if(ulList.style.opacity == 0){
                            ulList.style.opacity = 1;
                            ulList.style.height = "auto";
                            ulList.style.visibility = "";
                            ulList.style.margin = "-5px 5px 5px 5px";
                            this.style.borderRadius = "10px 10px 0px 0px";
                            this.getElementsByTagName("span")[1].style.transform = this.showGroup == true ? "rotate(0deg)" : "rotate(90deg)";
                        }else{
                            ulList.style.opacity = 0;
                            ulList.style.visibility = "hidden";
                            ulList.style.height = "0px";
                            this.getElementsByTagName("span")[1].style.transform  = this.showGroup == true ? "rotate(90deg)" : "rotate(0deg)";
                            this.style.borderRadius =  "10px 10px 10px 10px";

                        }

                    });
                    parent.appendChild(divTitle);

                    var ulListView = document.createElement("ul");
                    for(var i = 0; i < this.data[prop].length; i++)
                    {
                        var item = this.createItem(i,this.data[prop][i],z);
                        ulListView.appendChild(item);
                    }


                    ulListView.id = "p-ul-" + z;
                    if(this.showGroup != true)
                    {

                        ulListView.style.opacity = 0;
                        ulListView.style.visibility = "hidden";
                        ulListView.style.height = "0px";
                        ulListView.style.transition = "ease 0.8s";
                        ulListView.style.margin = "-2px 5px 5px 5px";
                    }else{
                        divTitle.style.borderRadius = "10px 10px 0px 0px";
                        ulListView.style.opacity = 1;
                        ulListView.style.visibility = "inherit";
                        ulListView.style.height = "auto";
                        ulListView.style.transition = "ease 0.8s";
                        ulListView.style.margin = "-5px 5px 5px 5px";
                        //ulListView.style.borderRadius = "10px 10px 0px 0px";
                    }
                    parent.className = "list-view";
                    parent.appendChild(ulListView);
                    z++;
                }
            }

        }else{
            //using paging or default

            this.totalPages = calTotalPage(this.data, this.numberRecords);
            this.totalRecods = this.data.length;

            // check boder cua row cuoi cung
            if(this.totalRecods % this.numberRecords == 1)
            {
                this.vIndexLast = this.totalRecods - 1;
            }
            var ulListView = document.createElement("ul");
            ulListView.className = "ul-list-" + this.option;
            for(var i = 0; i < this.data.length; i++)
            {
                // thuatnt cmt
                for(var p = 0; p < this.data.length; p++){
                    var payPartEN = this.data[p].partnerName;
                    var payPartVN = this.data[p].ngan_hang_nhan;
                    var payTaxType = this.data[p].TAX_TYPE;
                    if(payPartEN == null || payPartEN == undefined){
                        this.data[p].partnerName = "";
                    }
                    if(payPartVN == null || payPartVN == undefined){
                        this.data[p].ngan_hang_nhan = "";
                    }
                    if (payTaxType == null || payPartVN == undefined) {
                        this.data[p].TAX_TYPE = "";
                    }
                }
                // end thuatnt
                var item = this.createItem(i,this.data[i],0);
                if(i == 0 && this.data.length != 1)item.style.borderRadius = '10px 10px 0px 0px';
                ulListView.appendChild(item);
            }

            parent.className = "list-view";
            parent.appendChild(ulListView);

            var divAction = parent.querySelectorAll(".p-list-action");
            for(var i = 0; i < divAction.length; i++)
            {
                divAction[i].style.width = maxWith + 'px';
                divAction[i].style.right = -maxWith + 'px';

            }

            if(this.paging){
                var htmlPaging = genPaging(this.totalPages, pageIndex,this.numberRecords);

                var divPaging = document.createElement("div");
                divPaging.innerHTML = htmlPaging;
                parent.appendChild(divPaging);
                parent = showHiddenDiv(parent,0,this.numberRecords);

            }
        }

        elementParent.appendChild(parent);
        return parent;
    }
    return ;
}

//ListView.prototype.addEventTouch = function(el){
//    var listli = el.querySelectorAll("li");
//    for(var i =0; i <  listli.length; i++ )
//    {
//        var el = listli[i];
//        try{
//            el.addEventListener("touchstart", touchStart, true);
//        }catch(e){
//            console.log('error init listener' + e);
//        }
//        console.log("init touch done");
//    }
//}

ListView.prototype.createItem = function (i,data,idUl) {

    var li = document.createElement("li");
    var id = "p-"+ idUl +"-li-" + i + this.specLiList;
    // create avatar
    if (this.avatar == true){
        var divName = document.createElement("div");
        var bgrColor;   //ThanhHC.FSOFT first-letter background
        var firstLetter;
        if(data.peopleName)firstLetter = data.peopleName.slice(0,1).toUpperCase();
        if(firstLetterArray.length){
            for (var j = 0; j < firstLetterArray.length; j++){
                if(firstLetter === firstLetterArray[j]){
                    bgrColor = bgrColorArray[j];
                    break;
                }else{
                    var tempColor = parseInt(CONST_KEY_BGR_COLOR_FIRST_LETTER.length * Math.random());
                    bgrColor = CONST_KEY_BGR_COLOR_FIRST_LETTER[tempColor];
                }
            }
        }else{
            var tempColor = parseInt(CONST_KEY_BGR_COLOR_FIRST_LETTER.length * Math.random());
            bgrColor = CONST_KEY_BGR_COLOR_FIRST_LETTER[tempColor];

        }
        if(firstLetter){
            firstLetterArray.push(firstLetter);
            bgrColorArray.push(bgrColor);
        }
        if(this.fieldImage != null){
            divName.innerHTML = "<div></div>";
        }else if(firstLetter){
            divName.innerHTML = "<div><div id='first-letter' style='background:" + bgrColor +"'><div style='padding-bottom: 5px;'>" + firstLetter + "</div></div></div>";
        }else{
            divName.innerHTML = "<div></a><span class='icon-accounts'></span></div>";
            divName.style.color = this.hexaColor[i % this.hexaColor.length];
        }

        divName.className = "p-list-avatar break-slide";
        li.appendChild(divName);
    }

    if(this.parserService == true){

        //create Fields value hidden
        var divHidden = document.createElement("div");
        divHidden.style.display ='none';
        divHidden.className ='p-value';

        var tempfieldsHidden =[];
        var tempfieldsRow =[];

        for (var prop in data) {
            if (data[prop] != undefined)
            {
                var checkProp = prop.split("-");
                if (checkProp[1] != "hidden"){
                    var divFields = this.createField(prop, data[prop],null);
                    tempfieldsRow.push(prop);
                    li.appendChild(divFields)
                }
                else{
                    var divHiddenField = this.createField(prop, data[prop],null);
                    divHidden.appendChild(divHiddenField)
                    tempfieldsHidden.push(prop);
                }
            }

        }

        this.fieldsRow = tempfieldsRow;
        this.fieldsHidden = tempfieldsHidden;
        //add div hidden
        li.appendChild(divHidden)

    }else{

        for (var j = 0; j < this.fieldsRow.length; j++){

            if (data[this.fieldsRow[j]] != undefined)
            {
                var divFields = this.createField(this.fieldsRow[j], data[this.fieldsRow[j]],null);
                li.appendChild(divFields)
            }

        }

        //create Fields value hidden
        var divHidden = document.createElement("div");
        divHidden.style.display ='none';

        divHidden.className ='p-value';
        for (var j = 0; j < this.fieldsHidden.length; j++){
            if (data[this.fieldsHidden[j]] != undefined)
            {
                var divFields = this.createField(this.fieldsHidden[j], data[this.fieldsHidden[j]],this.fieldsHidden[j]);
                divHidden.appendChild(divFields);
            }
        }
        li.appendChild(divHidden)
    }


    // create button action
    if(this.showDotDiv == true){
        console.log("showDotDiv");
        var divDot  = document.createElement("div");
        divDot.innerHTML = "<div class='i-dot'></div><div class='i-dot'></div><div class='i-dot'></div>";
        divDot.className = "btn-dot-a";

        li.appendChild(divDot);
    }

    var divAction  = document.createElement("div");
    divAction.style.right = -maxWith + "px";
    divAction.style.width = maxWith + "px";

    for(var it = 0; it < this.button.length; it++)
    {
        var divButtons = this.createButton(id, this.button[it]);
        divAction.appendChild(divButtons);
    }

    divAction.className = "p-list-action";
    li.appendChild(divAction);


    if (this.paging == true){
        li.style.display = 'none';

        if(this.vIndexLast == i){
            li.style.borderRadius = '10px 10px 10px 10px';
        }
        else if(i % this.numberRecords == 0  ){
            li.style.borderRadius = '10px 10px 0px 0px';
        }
        else if((i+1) % this.numberRecords == 0  ){
            li.style.borderRadius = '0px 0px 10px 10px';
        }
    }

    if (this.option !="group"){

        if(this.data.length == 1){
            li.style.borderRadius = '10px 10px 10px 10px';
        }

    }
    li.id = id;
    li.className ="ripple-add-on break-slide";
    li.addEventListener("touchstart", touchStart, true);
    return li;
}

function genPaging(inTotalPages, inCurIdx, limitRow, inMaxBtn, inArrDisable ) {

    if (inTotalPages < 2) {
        return '';
    }

    var pageIndicator = '<ul class="pagination">';
    var pageTotal = inTotalPages;//8;
    var pageCurrentIdx = inCurIdx ? inCurIdx : 1; //min is 1
    var maxShowNum = (inMaxBtn && (inMaxBtn != 0)) ? inMaxBtn : 6; //default: 6
    var arrDisable = inArrDisable; //[2];//inArrDisable;
    var limitRow = limitRow ? limitRow : 5;

    if (pageTotal < maxShowNum + 1) {
        for (var i = 0; i < pageTotal; i++) {
            if (pageCurrentIdx == i + 1) {
                pageIndicator += '<li class="active"><span>' + (i + 1) + '</span></li>';
            }
            else {
                var tmpStt = false;
                if (arrDisable && arrDisable.length > 0) {
                    for (var j = 0; j < arrDisable.length; j++) {
                        if ((i + 1) == arrDisable[j]) {
                            tmpStt = true;
                            break;
                        }
                    }
                }
                if (tmpStt) {
                    pageIndicator += '<li class="disabled"><span>' + (i + 1) + '</span></li>';
                }
                else {
                    pageIndicator += '<li onClick="swipetSelectPageAtIndex(' + (i + 1) + ', this, ' + pageTotal + ', ' + limitRow + ',' + maxShowNum + ', ' + arrDisable + ');"><span>' + (i + 1) + '</span></li>';
                }
            }
        }
    }
    else {
        if (pageCurrentIdx < 3) {
            for (var i = 0; i < maxShowNum; i++) {
                switch (i) {
                    case (maxShowNum - 1):
                    {
                        var tmpStt = false;
                        if (arrDisable && arrDisable.length > 0) {
                            for (var j = 0; j < arrDisable.length; j++) {
                                if ((pageTotal) == arrDisable[j]) {
                                    tmpStt = true;
                                    break;
                                }
                            }
                        }
                        if (tmpStt) {
                            pageIndicator += '<li class="disabled"><span>' + (pageTotal) + '</span></li>';
                        }
                        else {
                            pageIndicator += '<li onClick="swipetSelectPageAtIndex(' + (pageTotal) + ', this, ' + pageTotal + ', '  + limitRow + ',' + maxShowNum + ', ' + arrDisable + ');"><span>' + pageTotal + '</span></li>';
                        }
                        break;
                    }
                    case (maxShowNum - 2):
                    {
                        var tmpStt = false;
                        if (arrDisable && arrDisable.length > 0) {
                            for (var j = 0; j < arrDisable.length; j++) {
                                if ((pageTotal - 1) == arrDisable[j]) {
                                    tmpStt = true;
                                    break;
                                }
                            }
                        }
                        if (tmpStt) {
                            pageIndicator += '<li class="disabled"><span>' + (pageTotal - 1) + '</span></li>';
                        }
                        else {
                            pageIndicator += '<li onClick="swipetSelectPageAtIndex(' + (pageTotal - 1) + ', this, ' + pageTotal + ', '  + limitRow + ',' + maxShowNum + ', ' + arrDisable + ');"><span>' + (pageTotal - 1) + '</span></li>';
                        }
                        break;
                    }
                    case (maxShowNum - 3):
                    {
                        pageIndicator += '<li><span>...</span></li>';
                        break;
                    }
                    default:
                    {
                        if (pageCurrentIdx == i + 1) {
                            pageIndicator += '<li class="active"><span>' + (i + 1) + '</span></li>';
                        }
                        else {
                            var tmpStt = false;
                            if (arrDisable && arrDisable.length > 0) {
                                for (var j = 0; j < arrDisable.length; j++) {
                                    if ((i + 1) == arrDisable[j]) {
                                        tmpStt = true;
                                        break;
                                    }
                                }
                            }
                            if (tmpStt) {
                                pageIndicator += '<li class="disabled"><span>' + (i + 1) + '</span></li>';
                            }
                            else {
                                pageIndicator += '<li onClick="swipetSelectPageAtIndex(' + (i + 1) + ', this, ' + pageTotal + ', '  + limitRow + ',' + maxShowNum + ', ' + arrDisable + ');"><span>' + (i + 1) + '</span></li>';
                            }
                        }
                        break;
                    }
                }
            }
        }
        else if (pageCurrentIdx > pageTotal - 2) {
            for (var i = 0; i < maxShowNum; i++) {
                switch (i) {
                    case 0:
                    case 1:
                    {
                        var tmpStt = false;
                        if (arrDisable && arrDisable.length > 0) {
                            for (var j = 0; j < arrDisable.length; j++) {
                                if ((i + 1) == arrDisable[j]) {
                                    tmpStt = true;
                                    break;
                                }
                            }
                        }
                        if (tmpStt) {
                            pageIndicator += '<li class="disabled"><span>' + (i + 1) + '</span></li>';
                        }
                        else {
                            pageIndicator += '<li onClick="swipetSelectPageAtIndex(' + (i + 1) + ', this, ' + pageTotal + ', '  + limitRow + ',' + maxShowNum + ', ' + arrDisable + ');"><span>' + (i + 1) + '</span></li>';
                        }
                        break;
                    }
                    case 2:
                    {
                        pageIndicator += '<li><span>...</span></li>';
                        break;
                    }
                    default:
                    {
                        if (pageCurrentIdx == (pageTotal - maxShowNum + i + 1)) {
                            pageIndicator += '<li class="active"><span>' + (pageTotal - maxShowNum + i + 1) + '</span></li>';
                        }
                        else {
                            var tmpStt = false;
                            if (arrDisable && arrDisable.length > 0) {
                                for (var j = 0; j < arrDisable.length; j++) {
                                    if ((pageTotal - maxShowNum + i + 1) == arrDisable[j]) {
                                        tmpStt = true;
                                        break;
                                    }
                                }
                            }
                            if (tmpStt) {
                                pageIndicator += '<li class="disabled"><span>' + (pageTotal - maxShowNum + i + 1) + '</span></li>';
                            }
                            else {
                                pageIndicator += '<li onClick="swipetSelectPageAtIndex(' + (pageTotal - maxShowNum + i + 1) + ', this, ' + pageTotal + ', ' + limitRow + ',' + maxShowNum + ', ' + arrDisable + ');"><span>' + (pageTotal - maxShowNum + i + 1) + '</span></li>';
                            }
                        }
                        break;
                    }
                }
            }
        }
        else {
            var mid = parseInt(maxShowNum / 2);
            for (var i = 0; i < maxShowNum + 1; i++) { //1: is second three-dots
                switch (i) {
                    case 0:
                    {
                        var tmpStt = false;
                        if (arrDisable && arrDisable.length > 0) {
                            for (var j = 0; j < arrDisable.length; j++) {
                                if ((i + 1) == arrDisable[j]) {
                                    tmpStt = true;
                                    break;
                                }
                            }
                        }
                        if (tmpStt) {
                            pageIndicator += '<li class="disabled"><span>' + (i + 1) + '</span></li>';
                        }
                        else {
                            pageIndicator += '<li onClick="swipetSelectPageAtIndex(' + (i + 1) + ', this, ' + pageTotal + ', '  + limitRow + ',' + maxShowNum + ', ' + arrDisable + ');"><span>' + (i + 1) + '</span></li>';
                        }
                        break;
                    }
                    case 1:
                    {
                        if (pageCurrentIdx != 3) {
                            pageIndicator += '<li><span>...</span></li>';
                        }
                        break;
                    }
                    case (maxShowNum):
                    {
                        var tmpStt = false;
                        if (arrDisable && arrDisable.length > 0) {
                            for (var j = 0; j < arrDisable.length; j++) {
                                if ((pageTotal) == arrDisable[j]) {
                                    tmpStt = true;
                                    break;
                                }
                            }
                        }
                        if (tmpStt) {
                            pageIndicator += '<li class="disabled"><span>' + (pageTotal) + '</span></li>';
                        }
                        else {
                            pageIndicator += '<li onClick="swipetSelectPageAtIndex(' + (pageTotal) + ', this, ' + pageTotal + ', '  + limitRow + ',' + maxShowNum + ', ' + arrDisable + ');"><span>' + pageTotal + '</span></li>';
                        }
                        break;
                    }
                    case (maxShowNum - 1):
                    {
                        if (pageCurrentIdx != pageTotal - 2) {
                            pageIndicator += '<li><span>...</span></li>';
                        }
                        break;
                    }
                    default:
                    {
                        if (pageCurrentIdx == (pageCurrentIdx + i - mid)) {
                            pageIndicator += '<li class="active"><span>' + (pageCurrentIdx + i - mid) + '</span></li>';
                        }
                        else {
                            var tmpStt = false;
                            if (arrDisable && arrDisable.length > 0) {
                                for (var j = 0; j < arrDisable.length; j++) {
                                    if ((pageCurrentIdx + i - mid) == arrDisable[j]) {
                                        tmpStt = true;
                                        break;
                                    }
                                }
                            }
                            if (tmpStt) {
                                pageIndicator += '<li class="disabled"><span>' + (pageCurrentIdx + i - mid) + '</span></li>';
                            }
                            else {
                                pageIndicator += '<li onClick="swipetSelectPageAtIndex(' + (pageCurrentIdx + i - mid) + ', this, ' + pageTotal + ', '  + limitRow + ',' + maxShowNum + ', ' + arrDisable + ');"><span>' + (pageCurrentIdx + i - mid) + '</span></li>';
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    pageIndicator += '</ul>';
    return pageIndicator;
}

function showHiddenDiv (obj, fristRow, lastRow){
    //change attribute node
    if(obj.childNodes[0].nodeName == "UL"){
        var node = obj.childNodes[0].childNodes;
        for(var i = 0; i < node.length; i++)
        {
            if( i >= fristRow && i < lastRow)
            {
                node[i].style.display = 'block';
            }else{
                node[i].style.display = 'none';
            }

        }
    }
    return obj;
}



function touchMove(event) {
    if(flagClickDot==true){
        return;
    }
    flagTouchMove = true;
    move = {
        x : event.targetTouches[0].pageX,
        y : event.targetTouches[0].pageY
    }

    var el = event.srcElement;

    if (event.srcElement.nodeName != 'LI'){
        el = event.srcElement.parent;
        if  (typeof event.srcElement.parent == 'undefined')
        {
            el = event.srcElement.parentElement;
        }
    }

    var node = el.querySelector('.p-list-action');
    var clientRect = el.getBoundingClientRect();

    // p.x p.y
    // r.x1  r.x2  r.y1   r.y2
    //left, top, right, bottom, x, y, width, height
    var r = {
        x1: clientRect.left,
        x2:  clientRect.right ,
        y1:  clientRect.top,
        y2:  clientRect.bottom

    };

   //  {
    if(pointRectangleIntersection(move, r) == false){
        if  (typeof node !== 'undefined' && node !== null)
        {
            node.style.right = -maxWith+ 'px';
        }
        return;
    }

    if  (typeof node !== 'undefined' && node !== null)
    {

        globalLength = (move.x - start.x);
        if (move.x < start.x )
        {
            try{
                event.preventDefault();
            }catch(e){
                console.log('preventDefault');
            }
            if(Math.abs(globalLength) > Math.abs(maxWith)/2)
            {
                try{
                    var rightNode = node.style.right;
                    var tmpRight = rightNode.substring(0,rightNode.length - 2)
                    if (tmpRight  < 0)
                    {
                        var resize = tmpRight - globalLength;
                        if (resize < maxWith)
                        {

                            resize = resize > 0 ? 0 : resize;
                            node.style.display = 'block';
                            node.style.right = resize + 'px';
                            // node.style.visibility = "inherit";
                        }
                        else{
                            // node.style.visibility = "inherit";
                            node.style.right = 0 + 'px';
                        }

                    } else{
                        // node.style.visibility = "inherit";
                        node.style.right = 0 + 'px';
                    }


                }catch(e){
                    console.log(e);
                    console.log("node error style");
                }

            }

        }
        else{
            try{
                node.style.width = maxWith+'px';
                node.style.right =  -maxWith+'px';
                node.style.display = 'block';
            }catch(e){
                console.log(e);
                console.log("node error style");
            }


        }

        if(tempPrevNode !=null && tempPrevNode.parentNode.id != el.id){
            tempPrevNode.style.right = -maxWith+ 'px';
        }
        if(tempDotNote!=null){
            tempDotNote.style.width = maxWith+'px';
            tempDotNote.style.right =  -maxWith+'px';
            tempDotNote.style.display = 'block;';
        }

    }

}

function touchStart(event) {
    flagTouchStart = true;
    start = {
        x : event.targetTouches[0].pageX,
        y : event.targetTouches[0].pageY
    }
    var el = event.srcElement;

    if(el != undefined && el != "null")
    {
        // hien thi khi nhan vao  btn-dot-a
        if(el.className == "btn-dot-a")
        {
            var node = el.parentNode.querySelector('.p-list-action');
            console.log("node---->");
            console.log(node);
            flagClickDot = true;
            if(tempDotNote!=null){
                tempDotNote.style.width = maxWith+'px';
                tempDotNote.style.right =  -maxWith+'px';
                tempDotNote.style.display = 'block;';
            }
            if(tempPrevNode !=null && tempPrevNode.parentNode.id != el.id){
                tempPrevNode.style.right = -maxWith+ 'px';
            }

            if(node != undefined && el != "null"){
                console.log("evnet->");
                node.style.right =  '0px';
                node.style.display = 'block;';
            }
            tempDotNote = node
            return;
        }
    }

    if (event.srcElement.nodeName === 'LI'){
        el.addEventListener("touchmove", touchMove, true);
        el.addEventListener("touchend", touchEnd, true);
        tempIdPrevNode = el.id;
    }else{
        el = event.srcElement.parentElement;
        el.addEventListener("touchmove", touchMove, true);
        el.addEventListener("touchend", touchEnd, true);
        tempIdPrevNode = event.srcElement.parentElement.id;
    }
    /* event.srcElement.addEventListener("touchmove", touchMove, true);*/

}
function touchEnd(event) {
    if(flagClickDot==true){
        return;
    }
    var endTouch = {
        x : event.changedTouches[0].clientX,
        y : event.changedTouches[0].clientY
    }


    var el = event.srcElement;
    flagTouchEnd = true;

    if (event.srcElement.nodeName != 'LI'){

        el = event.srcElement.parent;
        if  (typeof event.srcElement.parent == 'undefined')
        {
            el = event.srcElement.parentElement;
        }
    }

    var node = el.querySelector('.p-list-action');

    if  (typeof node !== 'undefined' && node !== null)
    {
        try{
            var tmpRight = node.style.right.replace("px", "");
        }catch(e){
            console.log(node);
            console.log(e);
            console.log("node error style");
        }


        if (move.x < start.x)
        {
            if (tmpRight < 0 || (flagTouchStart == true
                && flagTouchMove == false
                && flagTouchEnd == true
                ))
            {
                node.style.width = maxWith+'px';
                node.style.right =  -maxWith+'px';
                node.style.display = 'block;';

            }
            if(tempPrevNode !=null && tempPrevNode.parentNode.id != el.id){
                tempPrevNode.style.right = -maxWith+ 'px';
            }
            if(tempDotNote!=null){
                tempDotNote.style.width = maxWith+'px';
                tempDotNote.style.right =  -maxWith+'px';
                tempDotNote.style.display = 'block;';
            }

        }

        //using double click li
        if(Math.abs(start.x - endTouch.x) < 3 && Math.abs(start.y - endTouch.y) < 3){
            if (tmpRight < 0){
                clickDoubleFlag += 1;
                setTimeout(function(){ clickDoubleFlag=0; }, 300);
                if(clickDoubleFlag == 1){
                    clickDoubleFlag =0;
                    var parentId = el.parentNode.parentNode.id;

                    if(tempListViewGlobal[parentId].doubleClickItem != null &&
                        typeof tempListViewGlobal[parentId].doubleClickItem === 'function')
                    {
                        tempListViewGlobal[parentId].doubleClickItem(el);
                    }

                }
            }
        }
        tempPrevNode = node;
        event.preventDefault();
    }

    //reset
    flagTouchStart = false;
    flagTouchMove = false;
    flagTouchEnd = false;
    logInfo(event);
}
function touchCancel(event) {

}


function pointRectangleIntersection(p, r) {
    // p.x p.y
    // r.x1  r.x2  r.y1   r.y2
    return p.x > r.x1 && p.x < r.x2 && p.y > r.y1 && p.y < r.y2;
}

function calTotalPage(arrObj,numberRecords) {
    if(arrObj != null && arrObj.length > 0){
        return Math.ceil(arrObj.length/numberRecords);
    }
    return 0;
}


function swipetSelectPageAtIndex(idx, inNode, inTotalPage, limitRow ,inMaxNum, inArrDisable) {

    var nodePaging = inNode.parentNode.parentNode
    var nodeListView = nodePaging.parentNode;
    var lastRow = (idx*limitRow);
    var firstRow = lastRow - limitRow;
    showHiddenDiv(nodeListView,firstRow,lastRow);

    var htmlPaging = genPaging(inTotalPage, idx, limitRow);
    nodePaging.innerHTML= "";
    nodePaging.innerHTML= htmlPaging;

}

function recreateNode(el) {
    var newEl = el.cloneNode(false);
    while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
    el.parentNode.replaceChild(newEl, el);
}

