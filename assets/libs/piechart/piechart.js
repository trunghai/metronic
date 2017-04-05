/**
    ***author: DuyLK***
    ***Date create:12/07/2016***
    Purpose: Thư viện tạo biểu đồ hình tròn 
    *** Cách dùng ***
    var pieChart = new PieChart({
        width: screenW,                 //screen của biểu đồ
        textColor: '#ffffff',           //màu text hiển thị
        weightLine: 2,                  //độ rộng của vành tròn ngoài
        textSizePercent : 32,           //text size hiển thị phần trăm của biểu đồ
        textSizeTitle : 18,             //text size hiển thị tiêu đề của biểu đồ
        paddingTitle : 10,              //khoảng cách từ vòng tròn đến tiêu đề biểu đồ
        totalItems: 7,                  //tổng số items của biểu đồ
        stepTouch : 15,                 //tổng số items của biểu đồ
        titleItems: ["Tổng quan", "Tài khoản", "Tài khoản thẻ", "Thẻ tín dụng", "Test bieu do", "Tổng quan1", "Tài khoản1"],
        percentItemsTitle: ["155,5", "68,9", "150", "170","100,2"],
        percentItems: [40.5, 88.6, 50.8, 80.99, 70.5, 88.6, 50.8],
        strokeColors: ["#FF0000", "#22b14c", "#ff00ff", "#ff7f27", "#0000FF", "#ffee11", "#0095D5"],
        textColor: "#ffffff",
        beginSelectIndex: function (index) {
            console.log('khanhduy.le : begin select ' + index);
        },
        endSelectIndex: function (index) {
            console.log('khanhduy.le : end select ' + index);
        }
    });
    //gọi khi muốn show biểu đồ
    pieChart.showChart("mainview");
    //phải hủy vẽ biểu đồ khi không dùng đến để đảm bảo performance
    pieChart.destroyChart();
*/

var pieIndexSelected;

function PieChart(opt_opts) {
    this.options = opt_opts;
    this.width = opt_opts.width;
    this.height = opt_opts.height;
    this.weightLine = opt_opts.weightLine;
    this.textColor = opt_opts.textColor || '#ffffff';
    this.watercolor =opt_opts.watercolor||'#fff';
    this.colortitle = opt_opts.colortitle ||'#ffffff';
    this.textSizePercent = opt_opts.textSizePercent;
    this.textSizeTitle = opt_opts.textSizeTitle;
    this.paddingTitle = opt_opts.paddingTitle;
    this.stepTouch = opt_opts.stepTouch;
    this.totalItems = opt_opts.totalItems;
    this.titleItems = opt_opts.titleItems;
    this.percentItems = opt_opts.percentItems;
    this.percentItemsTitle = opt_opts.percentItemsTitle;
    this.strokeColors = opt_opts.strokeColors;

    this.circleItems = null; //mang luu cac bieu do
    pieIndexSelected = -1;
    this.centerCircle = -1;
    this.defaultIndex = -1;
    this.canvas = null;
    this.distance = 0;
    this.maxSizeItem = 0;
    this.sizeCenterItem = 0;
    this.isMovingItem = false;
    this.idAnimations = 0;
}


PieChart.prototype.refreshChart = function (opt) {
    this.percentItems = opt.percentItems;
    this.percentItemsTitle = opt.percentItemsTitle;
    for (var iii = 0; iii < this.circleItems.length; iii++) {
        var item = this.circleItems[iii];
        item.percent = this.percentItems[iii];
        item.titlePercent = this.titleItems[iii];
    }
};
/*show chart thì default là thằng ở giữa*/

PieChart.prototype.showChart = function (idParrent) {
    if (idParrent) {
        var parent = document.getElementById(idParrent);
        if (parent) {
            var chart = this;
            this.height = this.width / 3 + this.paddingTitle + this.textSizeTitle + this.textSizeTitle / 3;
            //tang do phan giai cua canvas
            this.canvas = createHiDPICanvas(this.width, this.height, 4);

            this.canvas.style.zIndex = 8;
            //this.canvas.style.position = "absolute";
            //this.canvas.style.border = "1px solid";
            //this.canvas.style.top = '350px';
            var preCanvas = document.getElementById('piechart');
            if (preCanvas)
                preCanvas.remove();
            parent.appendChild(this.canvas);
            
            if (this.totalItems < 3) {
                alert("minimum item is 3");
            } else {
                this.circleItems = new Array();
                this.defaultIndex = parseInt(this.totalItems / 2);
                var sizeItemCenter = this.width / 3;
                this.sizeCenterItem = sizeItemCenter;
                this.distance = sizeItemCenter * 3 / 4 + sizeItemCenter / 3;
                this.maxSizeItem = sizeItemCenter;
                //left of chart
                var itemChart;
                for (var i = 0; i < this.defaultIndex; i++) {
                    itemChart = new ChartItem();
                    itemChart.posX = this.width / 2 - sizeItemCenter * 3 / 4 - sizeItemCenter / 3;
                    itemChart.posY = this.height - sizeItemCenter / 2;

                    itemChart.minX = this.width / 2 - sizeItemCenter * 3 / 4 - sizeItemCenter / 3;
                    itemChart.maxX = this.width / 2 + sizeItemCenter * 3 / 4 + sizeItemCenter / 3;

                    if (i < this.defaultIndex - 1) {
                        itemChart.curAlpha = 0.0;
                        itemChart.srcAlpha = 0.0;
                    } else {
                        itemChart.curAlpha = 0.5;
                        itemChart.srcAlpha = 0.5;
                    }

                    itemChart.srcPosX = itemChart.posX;
                    itemChart.srcPosY = itemChart.posY;

                    itemChart.radius = (sizeItemCenter / 2 - this.weightLine) / 2;
                    itemChart.srcRadius = itemChart.radius;
                    itemChart.minRadius = itemChart.radius;

                    itemChart.curPaddingTitle = this.paddingTitle / 2;
                    itemChart.srcPaddingTitle = itemChart.curPaddingTitle;

                    itemChart.strokeWidth = this.weightLine;
                    itemChart.strokeColor = this.strokeColors[i];

                    itemChart.curTextSizePercent = this.textSizePercent / 2;
                    itemChart.curTextSizeTitle = this.textSizeTitle / 2;
                    itemChart.srcTextSizePercent = itemChart.curTextSizePercent;
                    itemChart.srcTextSizeTitle = itemChart.curTextSizeTitle;

                    itemChart.percent = this.percentItems[i];
                    itemChart.titlePercent = this.percentItemsTitle[i];
                    itemChart.title = this.titleItems[i];
                    itemChart.textColor = this.textColor;
                    itemChart.watercolor =this.watercolor;
                    itemChart.colortitle = this.colortitle;
                    itemChart.size = sizeItemCenter / 2;
                    itemChart.countTick = 0;
                    itemChart.countTickSecond = 0;
                    this.circleItems.push(itemChart);

                    var ctx = this.canvas.getContext("2d");
                    ctx.font = "bold " + itemChart.curTextSizePercent + "px TPBNeoSans";
                    var widthText = ctx.measureText(this.percentItemsTitle[i]).width;
                    if (widthText > itemChart.radius * 2) {
                        itemChart.curTextSizePercent = (itemChart.curTextSizePercent * itemChart.radius * 2 - this.weightLine) / widthText;
                        itemChart.srcTextSizePercent = itemChart.curTextSizePercent * 2;
                    }
                }

                //item center
                itemChart = new ChartItem();
                itemChart.posX = this.width / 2;
                itemChart.posY = this.height - sizeItemCenter / 2;

                itemChart.srcPosX = itemChart.posX;
                itemChart.srcPosY = itemChart.posY;
                this.centerCircle = itemChart.posY;
                itemChart.minX = this.width / 2 - sizeItemCenter * 3 / 4 - sizeItemCenter / 3;
                itemChart.maxX = this.width / 2 + sizeItemCenter * 3 / 4 + sizeItemCenter / 3;

                itemChart.radius = (sizeItemCenter - this.weightLine) / 2;
                itemChart.srcRadius = itemChart.radius;
                itemChart.minRadius = itemChart.radius / 2;

                itemChart.curAlpha = 1;
                itemChart.srcAlpha = 1;

                itemChart.curPaddingTitle = this.paddingTitle;
                itemChart.srcPaddingTitle = itemChart.curPaddingTitle;

                itemChart.strokeWidth = this.weightLine;
                itemChart.strokeColor = this.strokeColors[this.defaultIndex];

                itemChart.curTextSizePercent = this.textSizePercent;
                itemChart.curTextSizeTitle = this.textSizeTitle;
                itemChart.srcTextSizePercent = itemChart.curTextSizePercent;
                itemChart.srcTextSizeTitle = itemChart.curTextSizeTitle;
                itemChart.percent = this.percentItems[this.defaultIndex];
                itemChart.title = this.titleItems[this.defaultIndex];
                itemChart.titlePercent = this.percentItemsTitle[i];
                itemChart.textColor = this.textColor;
                itemChart.watercolor = this.watercolor;
                itemChart.colortitle = this.colortitle;
                itemChart.size = sizeItemCenter;
                itemChart.countTick = 0;
                itemChart.countTickSecond = 0;
                this.circleItems.push(itemChart);

                var ctx = this.canvas.getContext("2d");
                ctx.font = "bold " + itemChart.curTextSizePercent + "px TPBNeoSans";
                var widthText = ctx.measureText(this.percentItemsTitle[i]).width;
                if (widthText > itemChart.radius * 2) {
                    itemChart.curTextSizePercent = (itemChart.curTextSizePercent * itemChart.radius * 2 - this.weightLine )/ widthText;
                    itemChart.srcTextSizePercent = itemChart.curTextSizePercent * 2;
                }

                //create item
                //right of chart
                for (var i = this.defaultIndex + 1; i < this.totalItems; i++) {
                    itemChart = new ChartItem();
                    itemChart.posX = this.width / 2 + sizeItemCenter * 3 / 4 + sizeItemCenter / 3;
                    itemChart.posY = this.height - sizeItemCenter / 2;

                    itemChart.srcPosX = itemChart.posX;
                    itemChart.srcPosY = itemChart.posY;

                    itemChart.minX = this.width / 2 - sizeItemCenter * 3 / 4 - sizeItemCenter / 3;
                    itemChart.maxX = this.width / 2 + sizeItemCenter * 3 / 4 + sizeItemCenter / 3;

                    if (i > this.defaultIndex + 1) {
                        itemChart.curAlpha = 0.0;
                        itemChart.srcAlpha = 0.0;
                    } else {
                        itemChart.curAlpha = 0.5;
                        itemChart.srcAlpha = 0.5;
                    }

                    itemChart.radius = (sizeItemCenter / 2 - this.weightLine) / 2;
                    itemChart.srcRadius = itemChart.radius;
                    itemChart.minRadius = itemChart.radius;

                    itemChart.curPaddingTitle = this.paddingTitle / 2;
                    itemChart.srcPaddingTitle = itemChart.curPaddingTitle;

                    itemChart.strokeWidth = this.weightLine;
                    itemChart.strokeColor = this.strokeColors[i];

                    itemChart.curTextSizePercent = this.textSizePercent / 2;
                    itemChart.curTextSizeTitle = this.textSizeTitle / 2;
                    itemChart.srcTextSizePercent = itemChart.curTextSizePercent;
                    itemChart.srcTextSizeTitle = itemChart.curTextSizeTitle;

                    itemChart.percent = this.percentItems[i];
                    itemChart.title = this.titleItems[i];
                    itemChart.titlePercent = this.percentItemsTitle[i];
                    itemChart.textColor = this.textColor;
                    itemChart.watercolor = this.watercolor;
                    itemChart.colortitle = this.colortitle;
                    itemChart.size = sizeItemCenter / 2;
                    itemChart.countTick = 0;
                    itemChart.countTickSecond = 0;

                    var ctx = this.canvas.getContext("2d");
                    ctx.font = "bold " + itemChart.curTextSizePercent + "px TPBNeoSans";
                    var widthText = ctx.measureText(this.percentItemsTitle[i]).width;
                    if (widthText > itemChart.radius * 2) {
                        itemChart.curTextSizePercent = (itemChart.curTextSizePercent * itemChart.radius * 2 - this.weightLine) / widthText;
                        itemChart.srcTextSizePercent = itemChart.curTextSizePercent * 2;
                    }
                    this.circleItems.push(itemChart);
                }

                this.drawChart();

                var touchobj = null;
                var startx;
                var distX = 0;
                var preX = -1;

                //add event for canvas
                this.canvas.addEventListener('touchstart', function (e) {
                    touchobj = e.changedTouches[0];
                    var realTouch = getTouchPos(chart.canvas, touchobj);
                    startx = parseInt(realTouch.x);
                    preX = parseInt(realTouch.x);
                    e.preventDefault();
                }, false);
                this.canvas.addEventListener('click', function (e) {
                    // touchobj = e.changedTouches[0];
                    // var realTouch = getTouchPos(chart.canvas, touchobj);
                    // startx = parseInt(e.screenX);
                    // preX = parseInt(e.screenY);
                    
                     preX = -1;
                    //check indexoffsetX
                    console.log("A " + e.offsetX +": " + (chart.width * 3 / 4 - 14) +" " + (chart.width * 3 / 4 + 8) + " "+e.offsetY +": " + (chart.centerCircle - 12) + " " + (chart.centerCircle + 8));
                    if(e.offsetX >= (chart.width * 3 / 4 - 14) && e.offsetX <= (chart.width * 3 / 4 + 8)
                        && e.offsetY >= (chart.centerCircle - 12) && e.offsetY <= (chart.centerCircle + 8)
                         && !chart.isMovingItem && chart.defaultIndex > 0) {
                        chart.moveItem(chart, movefast, 500, true);
                        console.log("Vào 1 " + e.offsetY +" " + e.offsetY);
                    } else if (e.offsetX >= (chart.width / 4 - 8) && e.offsetX <= (chart.width / 4 + 8)
                        && e.offsetY >= (chart.centerCircle - 8) && e.offsetY <= (chart.centerCircle + 8)
                         && !chart.isMovingItem && chart.defaultIndex < chart.totalItems-1) {
                        chart.moveItem(chart, movefast, 500, false);
                         console.log("Vào 2");
                    } else {
                        var indexSelect = chart.clickItems(chart, e.offsetX,e.offsetY);
                        if (indexSelect > -1 && !chart.isMovingItem) {
                            if (indexSelect < chart.defaultIndex) {
                                chart.moveItem(chart, movefast, 500, true);
                            } else if (indexSelect > chart.defaultIndex) {
                                chart.moveItem(chart, movefast, 500, false);
                            }
                             console.log("Vào 3 " + indexSelect);
                        }
                    }
                    
                    
                    
                    e.preventDefault();
                }, false);


                this.canvas.addEventListener('touchmove', function (e) {
                    touchobj = e.changedTouches[0];
                    var realTouch = getTouchPos(chart.canvas, touchobj);
                    distX = parseInt(realTouch.x) - startx; // calculate dist traveled by touch point
                    if (preX > 0) {
                        var distanceX = parseInt(realTouch.x) - preX;
                        if (Math.abs(distX) > chart.stepTouch && !chart.isMovingItem) {
                            if (distanceX >= 0) {
                                if (chart.defaultIndex > 0) {
                                    chart.moveItem(chart, movefast, 400, true);
                                }
                            } else {
                                if (chart.defaultIndex < chart.totalItems - 1) {
                                    chart.moveItem(chart, movefast, 400, false);
                                }
                            }
                            distX = 0;
                        }

                        preX = parseInt(realTouch.x);
                    }
                    e.preventDefault();
                }, false);


                this.canvas.addEventListener('touchend', function (e) {
                    touchobj = e.changedTouches[0];
                    var realTouch = getTouchPos(chart.canvas, touchobj);
                    preX = -1;
                    //check index
                    if(realTouch.x >= (chart.width * 3 / 4 - 12) && realTouch.x <= (chart.width * 3 / 4 + 8)
                        && realTouch.y >= (chart.centerCircle - 12) && realTouch.y <= (chart.centerCircle + 8)
                         && !chart.isMovingItem && chart.defaultIndex > 0) {
                        chart.moveItem(chart, movefast, 500, true);
                        console.log("Vào 1 " + realTouch.x +" " + realTouch.y);
                    } else if (realTouch.x >= (chart.width / 4 - 8) && realTouch.x <= (chart.width / 4 + 8)
                        && realTouch.y >= (chart.centerCircle - 8) && realTouch.y <= (chart.centerCircle + 8)
                         && !chart.isMovingItem && chart.defaultIndex < chart.totalItems-1) {
                        chart.moveItem(chart, movefast, 500, false);
                         console.log("Vào 2 "+ realTouch.x +" " + realTouch.y);
                    } else {
                        var indexSelect = chart.touchItems(chart, realTouch);
                        if (indexSelect > -1 && !chart.isMovingItem) {
                            if (indexSelect < chart.defaultIndex) {
                                chart.moveItem(chart, movefast, 500, true);
                            } else if (indexSelect > chart.defaultIndex) {
                                chart.moveItem(chart, movefast, 500, false);
                            }
                             console.log("Vào 3 " + indexSelect);
                        }
                    }
                    e.preventDefault();
                }, false);
            }
            var baseNum = 200;
            //var count = 0;
            var level = 10;
            var start = new Date;

            this.idAnimations = setInterval(function () {
                var timePassed = new Date - start;
                if (timePassed > 25) {
                    start = new Date;
                    var context = chart.canvas.getContext('2d');
                    context.clearRect(0, 0, chart.width, chart.height);

                    //right
                    context.beginPath();
                    context.moveTo(chart.width * 3 / 4 - 8, chart.centerCircle - 8);
                    context.lineTo(chart.width * 3 / 4, chart.centerCircle);
                    context.globalAlpha = 1.0;
                    context.lineTo(chart.width * 3 / 4 -8, chart.centerCircle + 8);
                    context.lineWidth = 2;
                    context.strokeStyle = '#e66a25';
                    context.stroke();

                    //left
                    context.beginPath();
                    context.moveTo(chart.width / 4 + 8, chart.centerCircle - 8);
                    context.lineTo(chart.width / 4, chart.centerCircle);
                    context.globalAlpha = 1.0;
                    context.lineTo(chart.width / 4 + 8, chart.centerCircle + 8);
                    context.lineWidth = 2;
                    context.strokeStyle = '#e66a25';
                    context.stroke();

                    for (var iii = 0; iii < chart.circleItems.length; iii++) {
                        var item = chart.circleItems[iii];
                        var oldX = item.posX - item.radius;
                        var oldY = item.posY - item.radius;
                        var oldXSecond = item.posX - item.radius;
                        var oldYSecond = item.posY - item.radius;

                        context.save();
                        context.beginPath();
                        context.arc(item.posX, item.posY, item.radius - 2, 0, 2 * Math.PI, false);
                        context.clip();

                        context.beginPath();
                        context.fillStyle = item.watercolor;
                        var tempAlpha = 0.5 >= item.curAlpha ? item.curAlpha : 0.5;
                        context.globalAlpha = tempAlpha > 0.2 ? tempAlpha - 0.2 : tempAlpha;
                        context.moveTo(item.posX - item.radius, item.posY + item.radius);
                        context.lineTo(item.posX - item.radius, item.posY);

                        for (var i = 0; i <= baseNum; i++) {
                            var posX = item.posX - item.radius + i * (item.radius * 2 / baseNum);
                            // console.log(posX);
                            item.countTick = item.countTick + 0.001;
                            var rad = Math.sin(i * (Math.PI * 1.5) / 180 - item.countTick);
                            var posY = rad * item.radius / 8 + item.posY + item.radius - (item.radius * 2 - 2) * item.percent / 100;
                            var curvX = oldX + (posX - oldX) / 2;
                            var curvY = oldY + (posY - oldY) / 2;

                            context.quadraticCurveTo(curvX, curvY, posX, posY);

                            oldX = posX;
                            oldY = posY;
                        }

                        context.lineTo(item.posX + item.radius, item.posY + item.radius);
                        context.lineTo(item.posX - item.radius, item.posY + item.radius);

                        context.closePath();
                        context.fill();
                        context.restore();

                        /*
                        context.save();
                        context.beginPath();
                        context.arc(item.posX, item.posY, item.radius - 2, 0, 2 * Math.PI, false);
                        context.clip();

                        context.beginPath();
                        context.fillStyle = '#ffffff';
                        context.globalAlpha = tempAlpha > 0.2 ? tempAlpha - 0.2 : tempAlpha;
                        context.moveTo(item.posX - item.radius, item.posY + item.radius);
                        context.lineTo(item.posX - item.radius, item.posY);

                        for (var i = 0; i <= baseNum; i++) {
                        var posX = item.posX - item.radius + i * (item.radius * 2 / baseNum);
                        // console.log(posX);
                        item.countTickSecond = item.countTickSecond + 0.001;
                        var rad = Math.sin(i * (Math.PI * 2 + Math.PI/4) / 180 - item.countTickSecond);
                        var posY = rad * item.radius / 8 + item.posY + item.radius - (item.radius * 2 - 2) * item.percent / 100;
                        var curvX = oldXSecond + (posX - oldXSecond) / 2;
                        var curvY = oldYSecond + (posY - oldYSecond) / 2;

                        context.quadraticCurveTo(curvX, curvY, posX, posY);

                        oldXSecond = posX;
                        oldYSecond = posY;
                        }

                        context.lineTo(item.posX + item.radius, item.posY + item.radius);
                        context.lineTo(item.posX - item.radius, item.posY + item.radius);

                        context.closePath();
                        context.fill();
                        context.restore();
                        */
                        chart.drawItem(chart.canvas, item);
                    }
                }
            }, 10)
        }
    }
}

PieChart.prototype.destroyChart = function () {
    if (this.idAnimations) {
        var context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.width, this.height);
        clearInterval(this.idAnimations)
    }
}

PieChart.prototype.drawChart = function () {
//    var context = this.canvas.getContext('2d');
//    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
//    for (var i = 0; i < this.circleItems.length ; i++) {
//         this.drawItem(this.canvas, this.circleItems[i]);
//    }
}

PieChart.prototype.drawItem = function (canvas, item) {
    var context = canvas.getContext('2d');

   /* context.save();
    context.beginPath();
    context.arc(item.posX, item.posY, item.radius - 2, 0, 2 * Math.PI, false);
    context.clip();
    context.globalAlpha = 0.5 >= item.curAlpha ? item.curAlpha : 0.5;
    context.fillStyle = '#ffffff';
    context.fillRect(item.posX - item.radius, item.posY + item.radius, item.radius * 2, -(item.radius * 2 - 2) * item.percent/100);
    context.restore(); // reset clipping region*/


    context.lineWidth = item.strokeWidth;
    context.globalAlpha = 0.5 >= item.curAlpha ? item.curAlpha : 0.5;
    context.strokeStyle =item.watercolor;
    context.beginPath();
    context.arc(item.posX, item.posY, item.radius, 1.501 * Math.PI + 2 * Math.PI * item.percent / 100, 1.5 * Math.PI, false);
    context.stroke();

    context.beginPath();
    context.globalAlpha = item.curAlpha;
    //draw percent
    context.strokeStyle = item.strokeColor;
    context.arc(item.posX, item.posY, item.radius, 1.5 * Math.PI, 1.5 * Math.PI + 2 * Math.PI * item.percent / 100, false);
    context.stroke();

    //add text to percent
    context.font = "bold " + item.curTextSizePercent + "px TPBNeoSans";
    context.fillStyle = item.textColor;
    var widthText = context.measureText(item.titlePercent).width;
    context.fillText(item.titlePercent, item.posX - widthText / 2, item.posY + item.curTextSizePercent / 2);

    //add text title
    context.font = "bold " + item.curTextSizeTitle + "px TPBNeoSans";
    context.fillStyle = item.colortitle;
    widthText = context.measureText(item.title).width;
    context.fillText(item.title, item.posX - widthText / 2, item.posY - item.size / 2 - item.curPaddingTitle);
};

PieChart.prototype.moveItem = function (chart, delta, duration, direction) {
    if (chart.defaultIndex >= 0 && chart.defaultIndex < chart.totalItems) {
        //direction: true (left to right) else
        chart.isMovingItem = true;
        var circleItems = chart;
        if (direction && chart.defaultIndex >= 0) {
            if (chart.defaultIndex - 2 >= 0) {
                for (var i = 0; i <= chart.defaultIndex - 2; i++) {
                    var piePreOld = chart.circleItems[i];
                    piePreOld.desPosX = piePreOld.posX;
                    piePreOld.srcPosX = piePreOld.posX - piePreOld.radius;
                    piePreOld.posX = piePreOld.posX - piePreOld.radius;
                    piePreOld.desRadius = piePreOld.radius;
                    piePreOld.radius = piePreOld.radius / 2;
                    piePreOld.srcRadius = piePreOld.radius;
                    piePreOld.desTextSizeTitle = chart.circleItems[chart.defaultIndex - 2].srcTextSizeTitle;
                    piePreOld.desTextSizePercent = chart.circleItems[chart.defaultIndex - 2].srcTextSizePercent;

                    var ctx = chart.canvas.getContext("2d");
                    ctx.font = "bold " + piePreOld.desTextSizePercent + "px TPBNeoSans";
                    var widthText = ctx.measureText(piePreOld.titlePercent).width;
                    if (widthText > piePreOld.desRadius * 2) {
                        piePreOld.desTextSizePercent = (piePreOld.desTextSizePercent * piePreOld.desRadius * 2 - chart.weightLine) / widthText;
                    }

                    piePreOld.desPaddingTitle = chart.circleItems[chart.defaultIndex - 2].srcPaddingTitle;
                    if (i == chart.defaultIndex - 2) {
                        piePreOld.desAlpha = 0.5;
                    } else {
                        piePreOld.desAlpha = 0.0;
                    }
                }
            }

            var piePre = chart.circleItems[chart.defaultIndex - 1];
            piePre.desPosX = chart.circleItems[chart.defaultIndex].posX;
            piePre.desRadius = chart.circleItems[chart.defaultIndex].radius;
            piePre.desTextSizeTitle = chart.circleItems[chart.defaultIndex].srcTextSizeTitle;
            piePre.desTextSizePercent = chart.circleItems[chart.defaultIndex].srcTextSizePercent;

            var ctx = chart.canvas.getContext("2d");
            ctx.font = "bold " + piePre.desTextSizePercent + "px TPBNeoSans";
            var widthText = ctx.measureText(piePre.titlePercent).width;
            if (widthText > piePre.desRadius * 2) {
                piePre.desTextSizePercent = (piePre.desTextSizePercent * piePre.desRadius * 2 - chart.weightLine) / widthText;
            }

            piePre.desPaddingTitle = chart.circleItems[chart.defaultIndex].srcPaddingTitle;
            piePre.desAlpha = 1;

            if (chart.defaultIndex + 1 < chart.totalItems) {
                var pieCenter = chart.circleItems[chart.defaultIndex];
                pieCenter.desPosX = chart.circleItems[chart.defaultIndex + 1].posX;
                pieCenter.desRadius = chart.circleItems[chart.defaultIndex + 1].radius;
                pieCenter.desTextSizeTitle = chart.circleItems[chart.defaultIndex + 1].srcTextSizeTitle;
                pieCenter.desTextSizePercent = chart.circleItems[chart.defaultIndex + 1].srcTextSizePercent;

                var ctx = chart.canvas.getContext("2d");
                ctx.font = "bold " + pieCenter.desTextSizePercent + "px TPBNeoSans";
                var widthText = ctx.measureText(pieCenter.titlePercent).width;
                if (widthText > pieCenter.desRadius * 2) {
                    pieCenter.desTextSizePercent = (pieCenter.desTextSizePercent * pieCenter.desRadius * 2 - chart.weightLine) / widthText;
                }

                pieCenter.desPaddingTitle = chart.circleItems[chart.defaultIndex + 1].srcPaddingTitle;
                pieCenter.desAlpha = 0.5;

                for (var i = chart.defaultIndex + 1; i < chart.totalItems; i++) {
                    var pieNext = chart.circleItems[i];
                    pieNext.desPosX = chart.circleItems[chart.defaultIndex].desPosX + chart.circleItems[chart.defaultIndex].desRadius;
                    pieNext.desRadius = chart.circleItems[chart.defaultIndex].desRadius / 2;
                    pieNext.desTextSizeTitle = chart.circleItems[chart.defaultIndex].desTextSizeTitle;
                    pieNext.desTextSizePercent = chart.circleItems[chart.defaultIndex].desTextSizePercent;

                    var ctx = chart.canvas.getContext("2d");
                    ctx.font = "bold " + pieNext.desTextSizePercent + "px TPBNeoSans";
                    var widthText = ctx.measureText(pieNext.titlePercent).width;
                    if (widthText > pieNext.desRadius * 2) {
                        pieNext.desTextSizePercent = (pieNext.desTextSizePercent * pieNext.desRadius * 2 - chart.weightLine) / widthText;
                    }

                    pieNext.desPaddingTitle = chart.circleItems[chart.defaultIndex].desPaddingTitle;
                    pieNext.desAlpha = 0.0;
                }
            } else {
                var pieCenter = chart.circleItems[chart.defaultIndex];
                pieCenter.desPosX = chart.width / 2 + chart.sizeCenterItem * 3 / 4 + chart.sizeCenterItem / 3; ;
                pieCenter.desRadius = chart.circleItems[chart.defaultIndex].radius / 2;
                pieCenter.desTextSizeTitle = chart.circleItems[chart.defaultIndex].srcTextSizeTitle / 2;
                pieCenter.desTextSizePercent = chart.circleItems[chart.defaultIndex].srcTextSizePercent / 2;

                var ctx = chart.canvas.getContext("2d");
                ctx.font = "bold " + pieCenter.desTextSizePercent + "px TPBNeoSans";
                var widthText = ctx.measureText(pieCenter.titlePercent).width;
                if (widthText > pieCenter.desRadius * 2) {
                    pieCenter.desTextSizePercent = (pieCenter.desTextSizePercent * pieCenter.desRadius * 2 - chart.weightLine) / widthText;
                }
                pieCenter.desPaddingTitle = chart.circleItems[chart.defaultIndex].srcPaddingTitle / 2;
                pieCenter.desAlpha = 0.5;
            }
        }

        if (!direction && chart.defaultIndex < chart.totalItems) {

            if (chart.defaultIndex + 2 < chart.totalItems) {
                for (var i = chart.defaultIndex + 2; i < chart.totalItems; i++) {
                    var piePreOld = chart.circleItems[i];
                    piePreOld.desPosX = piePreOld.posX;
                    piePreOld.srcPosX = piePreOld.posX + piePreOld.radius;
                    piePreOld.posX = piePreOld.posX - piePreOld.radius;
                    piePreOld.desRadius = piePreOld.radius;
                    piePreOld.radius = piePreOld.radius / 2;
                    piePreOld.srcRadius = piePreOld.radius;
                    piePreOld.desTextSizeTitle = chart.circleItems[chart.defaultIndex + 2].srcTextSizeTitle;
                    piePreOld.desTextSizePercent = chart.circleItems[chart.defaultIndex + 2].srcTextSizePercent;

                    var ctx = chart.canvas.getContext("2d");
                    ctx.font = "bold " + piePreOld.desTextSizePercent + "px TPBNeoSans";
                    var widthText = ctx.measureText(piePreOld.titlePercent).width;
                    if (widthText > piePreOld.desRadius * 2) {
                        piePreOld.desTextSizePercent = (piePreOld.desTextSizePercent * piePreOld.desRadius * 2 - chart.weightLine) / widthText;
                    }

                    piePreOld.desPaddingTitle = chart.circleItems[chart.defaultIndex + 2].srcPaddingTitle;
                    if (i == chart.defaultIndex + 2) {
                        piePreOld.desAlpha = 0.5;
                    } else {
                        piePreOld.desAlpha = 0;
                    }
                }
            }

            var piePre = chart.circleItems[chart.defaultIndex + 1];
            piePre.desPosX = chart.circleItems[chart.defaultIndex].posX;
            piePre.desRadius = chart.circleItems[chart.defaultIndex].radius;
            piePre.desTextSizeTitle = chart.circleItems[chart.defaultIndex].srcTextSizeTitle;
            piePre.desTextSizePercent = chart.circleItems[chart.defaultIndex].srcTextSizePercent;

            var ctx = chart.canvas.getContext("2d");
            ctx.font = "bold " + piePre.desTextSizePercent + "px TPBNeoSans";
            var widthText = ctx.measureText(piePre.titlePercent).width;
            if (widthText > piePre.desRadius * 2) {
                piePre.desTextSizePercent = (piePre.desTextSizePercent * piePre.desRadius * 2 - chart.weightLine) / widthText;
            }

            piePre.desPaddingTitle = chart.circleItems[chart.defaultIndex].srcPaddingTitle;
            piePre.desAlpha = 1;

            if (chart.defaultIndex > 0) {
                var pieCenter = chart.circleItems[chart.defaultIndex];
                pieCenter.desPosX = chart.circleItems[chart.defaultIndex - 1].posX;
                pieCenter.desRadius = chart.circleItems[chart.defaultIndex - 1].radius;
                pieCenter.desTextSizeTitle = chart.circleItems[chart.defaultIndex - 1].srcTextSizeTitle;
                pieCenter.desTextSizePercent = chart.circleItems[chart.defaultIndex - 1].srcTextSizePercent;

                var ctx = chart.canvas.getContext("2d");
                ctx.font = "bold " + pieCenter.desTextSizePercent + "px TPBNeoSans";
                var widthText = ctx.measureText(pieCenter.titlePercent).width;
                if (widthText > pieCenter.desRadius * 2) {
                    pieCenter.desTextSizePercent = (pieCenter.desTextSizePercent * pieCenter.desRadius * 2 - chart.weightLine) / widthText;
                }

                pieCenter.desPaddingTitle = chart.circleItems[chart.defaultIndex - 1].srcPaddingTitle;
                pieCenter.desAlpha = 0.5;

                for (i = 0; i <= chart.defaultIndex - 1; i++) {
                    var pieNext = chart.circleItems[i];
                    pieNext.desPosX = chart.circleItems[chart.defaultIndex].desPosX - chart.circleItems[chart.defaultIndex].desRadius;
                    pieNext.desRadius = chart.circleItems[chart.defaultIndex].desRadius / 2;
                    pieNext.desTextSizeTitle = chart.circleItems[chart.defaultIndex].desTextSizeTitle;
                    pieNext.desTextSizePercent = chart.circleItems[chart.defaultIndex].desTextSizePercent;

                    var ctx = chart.canvas.getContext("2d");
                    ctx.font = "bold " + pieNext.desTextSizePercent + "px TPBNeoSans";
                    var widthText = ctx.measureText(pieNext.titlePercent).width;
                    if (widthText > pieNext.desRadius * 2) {
                        pieNext.desTextSizePercent = (pieNext.desTextSizePercent * pieNext.desRadius * 2 - chart.weightLine) / widthText;
                    }

                    pieNext.desPaddingTitle = chart.circleItems[chart.defaultIndex].desPaddingTitle;
                    pieNext.desAlpha = 0.0;
                }
            } else {
                var pieCenter = chart.circleItems[chart.defaultIndex];
                pieCenter.desPosX = chart.width / 2 - chart.sizeCenterItem * 3 / 4 - chart.sizeCenterItem / 3;
                pieCenter.desRadius = chart.circleItems[chart.defaultIndex].radius / 2;
                pieCenter.desTextSizeTitle = chart.circleItems[chart.defaultIndex].srcTextSizeTitle / 2;
                pieCenter.desTextSizePercent = chart.circleItems[chart.defaultIndex].srcTextSizePercent / 2;

                var ctx = chart.canvas.getContext("2d");
                ctx.font = "bold " + pieCenter.desTextSizePercent + "px TPBNeoSans";
                var widthText = ctx.measureText(pieCenter.titlePercent).width;
                if (widthText > pieCenter.desRadius * 2) {
                    pieCenter.desTextSizePercent = (pieCenter.desTextSizePercent * pieCenter.desRadius * 2 - chart.weightLine) / widthText;
                }

                pieCenter.desPaddingTitle = chart.circleItems[chart.defaultIndex].srcPaddingTitle / 2;
                pieCenter.desAlpha = 0.5;
            }
        }

        if (direction) {
            chart.options.beginSelectIndex(chart.defaultIndex - 1);
        } else {
            chart.options.beginSelectIndex(chart.defaultIndex + 1);
        }

        animate({
            delay: 10,
            duration: duration || 500, // 1 sec by default
            delta: delta,
            step: function (delta) {
                for (var i = 0; i < chart.circleItems.length; i++) {
                    var item = chart.circleItems[i];
                    var disX = item.desPosX - item.srcPosX;
                    var disPadding = item.desPaddingTitle - item.srcPaddingTitle;
                    var disTitle = item.desTextSizeTitle - item.srcTextSizeTitle;
                    var disPercent = item.desTextSizePercent - item.srcTextSizePercent;
                    var disRadius = item.desRadius - item.srcRadius;

                    item.posX = item.srcPosX + delta * disX;
                    item.curPaddingTitle = item.srcPaddingTitle + delta * disPadding;
                    item.curTextSizePercent = item.srcTextSizePercent + delta * disPercent;
                    item.curTextSizeTitle = item.srcTextSizeTitle + delta * disTitle;
                    item.radius = item.srcRadius + delta * disRadius;
                    item.size = item.radius * 2;
                    item.curAlpha = item.srcAlpha + delta * (item.desAlpha - item.srcAlpha);
                }
                if (delta == 1) {
                    if (direction) {
                        chart.defaultIndex = chart.defaultIndex - 1;
                    } else {
                        chart.defaultIndex = chart.defaultIndex + 1;
                    }
                    
                    for (var i = 0; i < chart.circleItems.length; i++) {
                        var item = chart.circleItems[i];
                        item.resetInfor();
                    }
                    chart.isMovingItem = false;
                    chart.options.endSelectIndex(chart.defaultIndex);
                }
                chart.drawChart();
            }
        })
    }
};

PieChart.prototype.touchItems = function (chart, pos) {
    for (var i = 0; i < chart.circleItems.length; i++) {
        var item = chart.circleItems[i];
        var r = item.radius * item.radius;
        var diff = Math.abs(pos.x - item.posX) * Math.abs(pos.x - item.posX) + Math.abs(pos.y - item.posY) * Math.abs(pos.y - item.posY);
        if (r > diff) {
            return i;
        }
    }
    return -1;
}
PieChart.prototype.clickItems = function (chart, posX,posY) {
    for (var i = 0; i < chart.circleItems.length; i++) {
        var item = chart.circleItems[i];
        var r = item.radius * item.radius;
        var diff = Math.abs(posX - item.posX) * Math.abs(posX - item.posX) + Math.abs(posY- item.posY) * Math.abs(posY - item.posY);
        if (r > diff) {
            return i;
        }
    }
    return -1;
}

function ChartItem() {
    var size = 0;
    var posX = 0;
    var posY = 0;
    var srcPosX = 0;
    var srcPosY = 0;
    var desPosX = 0;
    var desPosY = 0;
    var countTick = 0;
    var countTickSecond = 0;

    var radius = 0;
    var srcRadius = 0;
    var desRadius = 0;
   
    var strokeWidth = 0;
    var strokeColor = 0;
    var strokeGradient = null;
    var textColor = '';

    var curAlpha = 0;
    var srcAlpha = 0;
    var desAlpha = 0;

    var curPaddingTitle = 0;
    var srcPaddingTitle = 0;
    var desPaddingTitle = 0;

    //for text size
    var curTextSizePercent = 0;
    var curTextSizeTitle = 0;
    var srcTextSizePercent = 0;
    var srcTextSizeTitle = 0;
    var desTextSizePercent = 0;
    var desTextSizeTitle = 0;

    var title = '';
    var percent = '';
    var titlePercent = '';

    var minX;
    var maxX;
    var minRadius;
    

    this.resetInfor = function () {
        this.radius = this.radius < this.minRadius ? this.minRadius : this.radius;
        this.posX = this.posX < this.minX ? this.minX : this.posX;
        this.posX = this.posX > this.maxX ? this.maxX : this.posX;
        this.srcPosX = this.posX;
        this.srcRadius = this.radius;
        this.size = this.radius * 2;
        this.srcAlpha = this.curAlpha;
        this.srcTextSizePercent = this.curTextSizePercent;
        this.srcTextSizeTitle = this.curTextSizeTitle;
        this.srcPaddingTitle = this.curPaddingTitle;
    };
}

function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.clientX - rect.left,
        y: touchEvent.clientY - rect.top
    };
}

var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

createHiDPICanvas = function (w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.setAttribute('id','piechart');
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

function animate(opts) {

    var start = new Date

    var id = setInterval(function () {
        var timePassed = new Date - start
        var progress = timePassed / opts.duration

        if (progress > 1) progress = 1

        var delta = opts.delta(progress)
        opts.step(delta)

        if (progress == 1) {
            clearInterval(id)
        }
    }, opts.delay || 10)

}

function movefast(x) {
    if ((x /= 0.5) < 1) return -0.5 * (Math.sqrt(1 - x * x) - 1);
    return 0.5 * (Math.sqrt(1 - (x -= 2) * x) + 1);
}

