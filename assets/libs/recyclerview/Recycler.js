var RecyclerView = function (params) {
    var recycler = this;
    var TYPE_ACTION = "ACTION";
    var TYPE_NORMAL = "NORMAL";
    var TYPE_TITLE = "TITLE";

    var TEXT_TYPE_ALIGN_LEFT = "LEFT";
    var TEXT_TYPE_ALIGN_MIDLE = "MIDLE";
    var TEXT_TYPE_ALIGN_RIGHT = "RIGHT";
    var TEXT_TYPE_ALIGN_CENTER = "CENTER";
    
    var DESKTOP_TYPE_NORMAL = "DESKTOP_NORMAL";
    var DESKTOP_TYPE_GRID = "DESKTOP_GRID";
    var DESKTOP_TYPE_LIST = "DESKTOP_LIST";

    var defaults = {
        type: TYPE_NORMAL,
        typeTextAlign: TEXT_TYPE_ALIGN_MIDLE,
        title: "",
        titleAlign: TEXT_TYPE_ALIGN_LEFT,
        opacity: true

    }
     var defaultsDesktop = {
        type: DESKTOP_TYPE_NORMAL,
        typeTextAlign: TEXT_TYPE_ALIGN_MIDLE,
        title: "",
        titleAlign: TEXT_TYPE_ALIGN_LEFT,
        opacity: false,
        titleArg: new Array()

    }
    var colspanTitle = 1;
    var params = params || defaultsDesktop || defaults;
    var arrContent = new Array();
    var isHeaderHightlight = false;
    var isHaveFooter = false;
    var contentFooterHtml="";
    recycler.setData = function (param) {
      var length = param.length;
        // var content;
        // for (var i = 0; i < length; i++) {
        //     content = param[i];
        //     arrContent.push(content);
        // }
//        document.getElementById('narrowright').style.display='none';
//        document.getElementById("recycler_table_ebank").style.width = '100%';
        arrContent = param;
		var contentDisplay;//ngocdt3 bo sung chinh sua
        var content;
		var scrinfo;
        if(params.type == TYPE_TITLE){
             var count = 1;
              for (var i = 0; i < length; i++) {
                  content = param[i];//ngocdt3 comment
				 /* contentDisplay=param[i];
				  var tmp =contentDisplay.split('#');
				  content = tmp[0];
				  scrinfo = tmp[1];*/
                  if(Object.prototype.toString.call(content) === '[object Array]'){
                      var lengthItem = content.length;
                      if(lengthItem > count){
                          count = lengthItem;
                          // document.getElementById('narrowright').style.display='none';
                          // document.getElementById("recycler_table_ebank").style.width = '100%';
                      }
                      
                  }
              }
              colspanTitle = count;
        }
         
        if(CONST_DESKTOP_MODE && params.type == DESKTOP_TYPE_LIST){
            if(length>0){
                  params.titleArg = arrContent[0];
                  arrContent.splice(0, 1);
            }
          
        }
        var grContent = new Array();
        if(CONST_DESKTOP_MODE && params.type == DESKTOP_TYPE_GRID){
            if(length>0){
                if((length%2) != 0){
                    arrContent.push(["",""]);
                    length += 1;
                }
                  for(var i=0;i<length;i++){
                      
                      if((i%2)==0){
                          var arrItem = new Array();
                          
                         var contentItem = arrContent[i];
                          if(Object.prototype.toString.call(contentItem) === '[object Array]'){
                              for(var j=0;j<contentItem.length;j++){
                                  var contentArr = contentItem[j];
                                   arrItem.push(contentArr);
                              }
                          }
                          
                          
                          if((i+1)<length){
                             
                               var contentSub = arrContent[i+1];
                             
                                if(Object.prototype.toString.call(contentSub) === '[object Array]'){
                                    for(var k=0;k<contentSub.length;k++){
                                        var contentArr = contentSub[k];
                                        arrItem.push(contentArr);
                                    }
                                }
                          }
                          grContent.push(arrItem);
                      }
                  }
                  arrContent = grContent;
            }
          
        }
       

    }
   
    
    recycler.init = function () {
        var content = "";
        if (arrContent != undefined && arrContent.length > 0) {
            if(CONST_DESKTOP_MODE){
                if(params.type==DESKTOP_TYPE_GRID){
                    content = "<div  id ='recycler_list' class='recycler-list'><table style='width: 97%' id='recycler_table_ebank' class='recycler-table-ebank'>";
                }else{
               content = "<div id ='recycler_list' class='recycler-list'><table id='recycler_table_ebank' class='recycler-table-ebank'>";
                }
                var length = arrContent.length;
                var cursor = params.cursor || "pointer";
                var recyclerHover = params.hover || " recycler-hover";
                var id = params.id || 0;
                var item, itemLength;
                var contentRow="";
                var title;
                //if(title?)

                var classAlignText = "";
            
                var classAlignTextMidleLeft = "recycler-row-align-midle-left";
                var classAlignTextMidleRight = "recycler-row-align-midle-right";
                var classAlignTextMidleLeftOpacity = "recycler-row-align-midle-left-opacity";
                var classAlignTextMidleRightOpacity = "recycler-row-align-midle-right-opacity";
                if (params.typeTextAlign == TEXT_TYPE_ALIGN_LEFT) {
                    classAlignText = "recycler-row-align-left";
                } else if (params.typeTextAlign == TEXT_TYPE_ALIGN_MIDLE) {
                    classAlignText = "recycler-row-align-midle";
                } else if (params.typeTextAlign == TEXT_TYPE_ALIGN_RIGHT) {
                    classAlignText = "recycler-row-align-right";
                } else if (params.typeTextAlign == TEXT_TYPE_ALIGN_CENTER) {
                    classAlignText = "recycler-row-align-center";
                }
                var classAlignTitleText = "";
                if(params.titleAlign == TEXT_TYPE_ALIGN_LEFT){
                    classAlignTitleText = "recycler-title-align-left";
                }else if(params.titleAlign == TEXT_TYPE_ALIGN_RIGHT){
                    classAlignTitleText = "recycler-title-align-right";
                }else if(params.titleAlign ==TEXT_TYPE_ALIGN_CENTER){
                    classAlignTitleText = "recycler-title-align-center";
                }

                if (params.type == DESKTOP_TYPE_LIST) {
                
                    var contentRowTitle ="";
                     if (Object.prototype.toString.call(params.titleArg) === '[object Array]') {
                        itemLength = params.titleArg.length;
                        colspanTitle = itemLength;
                        for (var j = 0; j < itemLength; j++) {
                             var contentItemTitle = params.titleArg[j];
                             contentRowTitle = contentRowTitle + "<td class='" + classAlignText + "'>" + contentItemTitle + "</td>";
                            }
                        
                        contentRowTitle = contentRowTitle + "</tr>";

                    } 
                    content = content + "<tr class='recycler-row-title-header'>" + contentRowTitle+ "</td></tr>";
                }
                for (var i = 0; i < length; i++) {
                    if (params.opacity) {
                        if (params.type == DESKTOP_TYPE_LIST) {
                            if (((i + 1) % 2) > 0) {
                                contentRow = contentRow + "<tr class='recycler-row-as'>";

                            } else {
                                contentRow = contentRow + "<tr class='recycler-row-parity'>";
                            }
                        } else {
                            // if (((i) % 2) > 0) {
                                contentRow = contentRow + "<tr class='recycler-row-parity'>";

                            // } else {
                                // contentRow = contentRow + "<tr class='recycler-row-parity'>";
                            // }
                        }
                    } else {
                        if (params.type == DESKTOP_TYPE_LIST) {
                            contentRow = contentRow + "<tr class='recycler-row-title'>";
                        } else if(params.type == DESKTOP_TYPE_GRID) {
                            if(isHeaderHightlight && i==0){
                                 contentRow = contentRow + "<tr class='recycler-row-normal recycler-header-hightlight'>";
                            }else if(i != 0){
                                 contentRow = contentRow + "<tr class='recycler-row-normal'>";
                            }else{
                                contentRow = contentRow + "<tr class='recycler-row-normal'>";
                            }
                        } else {
                            if(isHeaderHightlight && i==0){
                                 contentRow = contentRow + "<tr class='recycler-row-normal recycler-header-hightlight'>";
                            }else if(params.type == DESKTOP_TYPE_NORMAL && i != 0){
                                 contentRow = contentRow + "<tr class='recycler-row-normal"+ recyclerHover +"'onclick='selectedItemOnRow(this,"+ i + "," + id + ")' style='cursor:" + cursor + "'>";
                            }else{
                                contentRow = contentRow + "<tr class='recycler-row-normal'>";
                            }

                        }


                    }

                    item = arrContent[i];
                    if (Object.prototype.toString.call(item) === '[object Array]') {
                        itemLength = item.length;
                        for (var j = 0; j < itemLength; j++) {
                            var contentItem = item[j];
                           
                            if(params.type == DESKTOP_TYPE_GRID){
                                 var width = 100/itemLength;
                                 if((j%2)==0){
                                      contentRow = contentRow + "<td class='" + classAlignTextMidleLeft + "' style='width:"+width + "%;'>" + contentItem + "</td>";
                                 }else{
                                      contentRow = contentRow + "<td class='" + classAlignTextMidleRight + "' style='width:"+width + "%;font-weight:bold;'>" + contentItem + "</td>";
                                 }
                                
                            }else{
                                if(params.typeTextAlign == TEXT_TYPE_ALIGN_MIDLE){
                                if(params.opacity){
                                        if(j==0){
                                            contentRow = contentRow + "<td class='" + classAlignTextMidleLeftOpacity + "'>" + contentItem + "</td>";
                                        }else if(j==(itemLength-1)){
                                            contentRow = contentRow + "<td class='" + classAlignTextMidleRightOpacity + "'>" + contentItem + "</td>";
                                        }else{
                                            contentRow = contentRow + "<td class='" + classAlignText + "'>" + contentItem + "</td>";
                                        }
                                }else{
                                        if(j==0){
                                            contentRow = contentRow + "<td class='" + classAlignText + "'>" + contentItem + "</td>";
                                        }else if(j==(itemLength-1)){
                                            contentRow = contentRow + "<td class='" + classAlignText + "'>" + contentItem + "</td>";
                                        }else{
                                            contentRow = contentRow + "<td class='" + classAlignText + "'>" + contentItem + "</td>";
                                        }
                                }
                                
                                
                            }else{
                                contentRow = contentRow + "<td class='" + classAlignText + "'>" + contentItem + "</td>";
                            }
                            }
                        
                        }

                    } else {
                        contentRow = contentRow + "<td class='" + classAlignText + "'>" + contentItem + "</td>";
                    }
                    contentRow = contentRow + "</tr>";
                }
                if(isHaveFooter){
                    contentRow = contentRow + "<tr class='recycler-row-footer'>" +contentFooterHtml +"</tr>"
                }

                content = content + contentRow + "</table></div>";
                
            }else{
                
                if (params.type == TYPE_ACTION) {
                    content = "<div id ='recycler_list' class='recycler-list-action'><div class='recycler-action'><span class='recycler-action-icon icon-movenext'></span></div><table id='recycler_table_ebank' class='recycler-table-ebank-action'>";
                } else {
                    content = "<div id ='recycler_list' class='recycler-list'><table id='recycler_table_ebank' class='recycler-table-ebank'>";
                }

                var length = arrContent.length;
            
                var item, itemLength;
                var contentRow="";
                var title;
                //if(title?)

                var classAlignText = "";
            
                var classAlignTextMidleLeft = "recycler-row-align-midle-left";
                var classAlignTextMidleRight = "recycler-row-align-midle-right";
                var classAlignTextMidleLeftOpacity = "recycler-row-align-midle-left-opacity";
                var classAlignTextMidleRightOpacity = "recycler-row-align-midle-right-opacity";
                if (params.typeTextAlign == TEXT_TYPE_ALIGN_LEFT) {
                    classAlignText = "recycler-row-align-left";
                } else if (params.typeTextAlign == TEXT_TYPE_ALIGN_MIDLE) {
                    classAlignText = "recycler-row-align-midle";
                } else if (params.typeTextAlign == TEXT_TYPE_ALIGN_RIGHT) {
                    classAlignText = "recycler-row-align-right";
                } else if (params.typeTextAlign == TEXT_TYPE_ALIGN_CENTER) {
                    classAlignText = "recycler-row-align-center";
                }
                var classAlignTitleText = "";
                if(params.titleAlign == TEXT_TYPE_ALIGN_LEFT){
                    classAlignTitleText = "recycler-title-align-left";
                }else if(params.titleAlign == TEXT_TYPE_ALIGN_RIGHT){
                    classAlignTitleText = "recycler-title-align-right";
                }else if(params.titleAlign ==TEXT_TYPE_ALIGN_CENTER){
                    classAlignTitleText = "recycler-title-align-center";
                }

                if (params.type == TYPE_TITLE) {
                
                    content = content + "<tr class='recycler-row-title-header'><td colspan ='"+ colspanTitle +"' class='" + classAlignTitleText + "'>" + params.title + "</td></tr>";
                }else{
                    content = content;
                }
                for (var i = 0; i < length; i++) {
                    if (params.opacity) {
                        if (params.type == TYPE_TITLE) {
                            if (((i + 1) % 2) > 0) {
                                contentRow = contentRow + "<tr class='recycler-row-as'>";

                            } else {
                                contentRow = contentRow + "<tr class='recycler-row-parity'>";
                            }
                        } else {
                            if (((i) % 2) > 0) {
                                contentRow = contentRow + "<tr class='recycler-row-as'>";

                            } else {
                                contentRow = contentRow + "<tr class='recycler-row-parity'>";
                            }
                        }
                    } else {
                        if (params.type == TYPE_TITLE) {
                            contentRow = contentRow + "<tr class='recycler-row-title'>";
                        } else {
                            contentRow = contentRow + "<tr class='recycler-row-normal'>";
                        }
                    
                    
                    }

                    item = arrContent[i];
                    if (Object.prototype.toString.call(item) === '[object Array]') {
                        itemLength = item.length;
                        for (var j = 0; j < itemLength; j++) {
                            var contentItem = item[j];
                            if(params.typeTextAlign == TEXT_TYPE_ALIGN_MIDLE){
                                if(params.opacity){
                                        if(j==0){
                                            contentRow = contentRow + "<td class='" + classAlignTextMidleLeftOpacity + "'>" + contentItem + "</td>";
                                        }else if(j==(itemLength-1)){
                                            contentRow = contentRow + "<td class='" + classAlignTextMidleRightOpacity + "'>" + contentItem + "</td>";
                                        }else{
                                            contentRow = contentRow + "<td class='" + classAlignText + "'>" + contentItem + "</td>";
                                        }
                                }else{
                                        if(j==0){
                                            contentRow = contentRow + "<td class='" + classAlignTextMidleLeft + "'>" + contentItem + "</td>";
                                        }else if(j==(itemLength-1)){
                                            contentRow = contentRow + "<td class='" + classAlignTextMidleRight + "'>" + contentItem + "</td>";
                                        }else{
                                            contentRow = contentRow + "<td class='" + classAlignText + "'>" + contentItem + "</td>";
                                        }
                                }
                                
                                
                            }else{
                                contentRow = contentRow + "<td class='" + classAlignText + "'>" + contentItem + "</td>";
                            }
                        
                        }

                    } else {
                        contentRow = contentRow + "<td class='" + classAlignText + "'>" + contentItem + "</td>";
                    }
                    contentRow = contentRow + "</tr>";
                }
                if(isHaveFooter){
                    contentRow = contentRow + "<tr class='recycler-row-footer'>" +contentFooterHtml +"</tr>"
                }
                content = content + contentRow + "</table></div>";
            }  
        } else {
            console.log("RecyclerView ---- no data");
        }
        console.log("content recycler " + content);
        return content;
    }
	recycler.initSaving = function () {
        var content = "";
        if (arrContent != undefined && arrContent.length > 0) {

            if (params.type == TYPE_ACTION) {
                content = "<div id ='recycler_list' class='recycler-list-action'><div class='recycler-action'><span class='recycler-action-icon icon-movenext'></span></div><table id='recycler_table_ebank' class='recycler-table-ebank-action'>";
            } else {
                content = "<div id ='recycler_list' class='recycler-list'><table id='recycler_table_ebank' class='recycler-table-ebank'>";
            }

            var length = arrContent.length;
           
            var item, itemLength;
            var contentRow="";
            var title;
            //if(title?)

            var classAlignText = "";
           
            var classAlignTextMidleLeft = "recycler-row-align-midle-left";
            var classAlignTextMidleRight = "recycler-row-align-midle-right";
             var classAlignTextMidleLeftOpacity = "recycler-row-align-midle-left-opacity";
            var classAlignTextMidleRightOpacity = "recycler-row-align-midle-right-opacity";
            if (params.typeTextAlign == TEXT_TYPE_ALIGN_LEFT) {
                classAlignText = "recycler-row-align-left";
            } else if (params.typeTextAlign == TEXT_TYPE_ALIGN_MIDLE) {
                classAlignText = "recycler-row-align-midle";
            } else if (params.typeTextAlign == TEXT_TYPE_ALIGN_RIGHT) {
                classAlignText = "recycler-row-align-right";
            } else if (params.typeTextAlign == TEXT_TYPE_ALIGN_CENTER) {
                classAlignText = "recycler-row-align-center";
            }
             var classAlignTitleText = "";
            if(params.titleAlign == TEXT_TYPE_ALIGN_LEFT){
                classAlignTitleText = "recycler-title-align-left";
            }else if(params.titleAlign == TEXT_TYPE_ALIGN_RIGHT){
                classAlignTitleText = "recycler-title-align-right";
            }else if(params.titleAlign ==TEXT_TYPE_ALIGN_CENTER){
                classAlignTitleText = "recycler-title-align-center";
            }

            if (params.type == TYPE_TITLE) {
               
                content = content + "<tr class='recycler-row-title-header'><td colspan ='"+ colspanTitle +"' class='" + classAlignTitleText + "'>" + params.title + "</td></tr>";
            }else{
                content = content;
            }
            for (var i = 0; i < length; i++) {
				var tmp = arrContent[i];
                if (params.opacity) {
                    if (params.type == TYPE_TITLE) {
                        /*if (((i + 1) % 2) > 0) {
                            contentRow = contentRow + "<tr class='recycler-row-as'>";

                        } else {
                            contentRow = contentRow + "<tr class='recycler-row-parity'>";
                        }*/
						if(tmp[2]=='review'){
							contentRow = contentRow + "<tr class='recycler-row-as' scrinfo ='review'>";
						}
						else {
							contentRow = contentRow + "<tr class='recycler-row-as'>";
						}
                    } else {
                        /*if (((i) % 2) > 0) {
                            contentRow = contentRow + "<tr class='recycler-row-as'>";

                        } else {
                            contentRow = contentRow + "<tr class='recycler-row-parity'>";
                        }*/
						if(tmp[2]=='review'){
							contentRow = contentRow + "<tr class='recycler-row-as' scrinfo ='review'>";
						}
						else {
							contentRow = contentRow + "<tr class='recycler-row-as'>";
						}
                    }
                } else {
                   /* if (params.type == TYPE_TITLE) {
                        contentRow = contentRow + "<tr class='recycler-row-title'>";
                    } else {
                         contentRow = contentRow + "<tr class='recycler-row-normal'>";
                    }*/
                  if (params.type == TYPE_TITLE && tmp[2]=='review') {
                        contentRow = contentRow + "<tr class='recycler-row-title' scrinfo ='review'>";
                    }
					else if (params.type == TYPE_TITLE && tmp[2]!='review'){
						 contentRow = contentRow + "<tr class='recycler-row-title'>";
					}
					 else if (params.type != TYPE_TITLE && tmp[2]=='review'){
                         contentRow = contentRow + "<tr class='recycler-row-normal' scrinfo ='review'>";
                    }
					else{
						contentRow = contentRow + "<tr class='recycler-row-normal'>";
					}
                   
                }

                item = arrContent[i];
                if (Object.prototype.toString.call(item) === '[object Array]') {
                    itemLength = item.length -1;
                    for (var j = 0; j < itemLength; j++) {
                        var contentItem = item[j];
                        if(params.typeTextAlign == TEXT_TYPE_ALIGN_MIDLE){
                            if(params.opacity){
                                    if(j==0){
                                        contentRow = contentRow + "<td class='" + classAlignTextMidleLeftOpacity + "'>" + contentItem + "</td>";
                                    }else if(j==(itemLength-1)){
                                        contentRow = contentRow + "<td class='" + classAlignTextMidleRightOpacity + "'>" + contentItem + "</td>";
                                    }else{
                                        contentRow = contentRow + "<td class='" + classAlignText + "'>" + contentItem + "</td>";
                                    }
                            }else{
                                    if(j==0){
                                        contentRow = contentRow + "<td class='" + classAlignTextMidleLeft + "'>" + contentItem + "</td>";
                                    }else if(j==(itemLength-1)){
                                        contentRow = contentRow + "<td class='" + classAlignTextMidleRight + "'>" + contentItem + "</td>";
                                    }else{
                                        contentRow = contentRow + "<td class='" + classAlignText + "'>" + contentItem + "</td>";
                                    }
                            }
                            
                            
                        }else{
                             contentRow = contentRow + "<td class='" + classAlignText + "'>" + contentItem + "</td>";
                        }
                       
                    }

                } else {
                    contentRow = contentRow + "<td class='" + classAlignText + "'>" + contentItem + "</td>";
                }
                contentRow = contentRow + "</tr>";
            }
             if(isHaveFooter){
                    contentRow = contentRow + "<tr class='recycler-row-footer'>" +contentFooterHtml +"</tr>"
             }
            content = content + contentRow + "</table></div>";

        } else {
            console.log("RecyclerView ---- no data");
        }
        console.log("content recycler " + content);
        return content;
    }
    
    
    recycler.setHeaderHightlight = function (params) {
        isHeaderHightlight = params;
    }
    recycler.setFooterHtml = function (params) {
        isHaveFooter = true;
        contentFooterHtml = params;
    }
    recycler.refreshView = function (params,isSaving) {
        var noteParent = document.getElementById(params);
        if(noteParent !=undefined){
            noteParent.innerHTML ="";
            var contentHTML="";
            if(isSaving){
                contentHTML = initSaving();
               
            }else{
                contentHTML = init();
            }
            noteParent.innerHTML = contentHTML;
        }
    }
}
var evtSelectionOnTable = document.createEvent('Event');
evtSelectionOnTable.initEvent('evtSelectionOnTable', true, true);
var evtSelectionOnTableClose = document.createEvent('Event');
evtSelectionOnTableClose.initEvent('evtSelectionOnTableClose', true, true);
function selectedItemOnRow(inNode,index,id){
    evtSelectionOnTable.selectedNode = inNode;
    evtSelectionOnTable.selectedIndex = index;
    evtSelectionOnTable.id = id;
    document.dispatchEvent(evtSelectionOnTable);
}
