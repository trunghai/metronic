/**
 * Created by JetBrains WebStorm.
 * User: DangLN.FSOFT
 * Date: 7/20/16
 * Time: 8:47 AM
 * To change this template use File | Settings | File Templates.
 */
/*
cach khai bao va hien thi cua single pie chart
var sPc = new SinglePieChart({
    data : [{percent: 30, color: 'red'},{percent: 30, color: 'green'}, {percent: 40, color: 'blue'}]
});
sPc.showChart("manage-finance");
*/


function SinglePieChart(opt) {
    this.data = opt.data || [{ percent: 0, color: 'white' }, { percent: 0, color: 'white' }, { percent: 0, color: 'white' }, { percent: 0, color: 'white' }];
    this.colorText = opt.colorText || "#fff";
    this.colorLine = opt.colorLine || "#fff";
    this.withCanvas = opt.withCanvas || 100;
    this.heightCanvas = opt.heightCanvas || 100;
    this.radiusCanvas = opt.radiusCanvas || this.heightCanvas;
    this.widthStroke = opt.widthStroke || 2;
    this.counterClockwise = opt.counterClockwise || false;
    this.colorDefault = "#fff";
    this.sizeText = opt.sizeText || "10";

}


var PIXEL_CANVAS = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

SinglePieChart.prototype.createCanvas = function (w, h, ratio) {
    if (!ratio) { ratio = PIXEL_CANVAS; }
    var can = document.createElement("canvas");
    can.id = "pie-chart-";
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

SinglePieChart.prototype.showChart = function (idParrent) {
    if (idParrent) {
        var parent = document.getElementById(idParrent);
        parent.innerHTML = "";
        parent.style.width = this.withCanvas;
        parent.style.height = this.heightCanvas;
        var canvas = this.createCanvas(this.withCanvas, this.heightCanvas, 5);

        var total = 0;


        for (var e = 0; e < this.data.length; e++) {
            if (typeof this.data[e].percent != 'undefined') {
                total += this.data[e].percent;
            }
        }
        // if (total == 100)
        // {
        this.drawChart(canvas, total);
        // }

        parent.appendChild(canvas);
    }
}
SinglePieChart.prototype.drawChart = function (canvas, total) {
    var x = this.withCanvas / 2;
    var y = this.heightCanvas / 2;
    var r = this.radiusCanvas / 2 - 2;
    var colorText = this.colorText;
    var colorLine = this.colorLine;
    var widthStroke = this.widthStroke;
    var counterClockwise = this.counterClockwise;
    var lastEnd = 0;

    var ctx = canvas.getContext("2d");
    if (total > 0) {
        var tempOffsetY = 0;
        for (var i = 0; i < this.data.length; i++) {

            var angleStart = lastEnd;
            var angleEnd = lastEnd + (Math.PI * 2 * (this.data[i].percent / total));

            // draw arc
            ctx.beginPath();

            ctx.arc(x, y, r, angleStart, angleEnd, counterClockwise);
            ctx.lineWidth = widthStroke;

            ctx.strokeStyle = !(typeof this.data[i].color == 'undefined') ? this.data[i].color : this.colorDefault;

            ctx.stroke();

            var lineEndX = x + r * Math.cos(angleEnd);
            var lineEndY = y + r * Math.sin(angleEnd);

            ctx.beginPath();
            ctx.moveTo(x, y);

            ctx.strokeStyle = colorLine;
            ctx.lineWidth = 1;
            ctx.lineTo(lineEndX, lineEndY);
            ctx.stroke();

            var lineStartX = x + r * Math.cos(angleStart);
            var lineStartY = y + r * Math.sin(angleStart);
            ctx.moveTo(x, y);
            ctx.lineTo(lineStartX, lineStartY);
            ctx.stroke();

            var midAngle = angleStart + (angleEnd - angleStart) / 2;
            var labelRadius = r * 1.1;
            // draw text
            var offsetX = x + (labelRadius) * Math.cos(midAngle) / 2;
            var offsetY = y + (labelRadius) * Math.sin(midAngle) / 2 + i;
            ctx.fillStyle = colorText;
            // ctx.fillStyle = this.data[i].color;
            ctx.font = " " + this.sizeText + "px Arial";

            widthText = ctx.measureText(this.data[i].percent + "%").width;
            if (this.data[i].percent > 0) {
                if (tempOffsetY == 0) {
                    ctx.fillText(this.data[i].percent + "%", offsetX - widthText / 2, offsetY - this.sizeText / 2);
                }
                else if (offsetY - tempOffsetY < 5 && offsetY - tempOffsetY > -5) {
                    ctx.fillText(this.data[i].percent + "%", offsetX - widthText / 2, offsetY - this.sizeText / 2+18);
                }
                else {
                    ctx.fillText(this.data[i].percent + "%", offsetX - widthText / 2, offsetY - this.sizeText / 2-2);
                }
                tempOffsetY = offsetY;
                
            }

            //console.log("widthText : " + widthText);
            //console.log("this.data[i].percent : " + this.data[i].percent);
            //console.log("offsetX - widthText / 2 : " + (offsetX - widthText / 2) + "offsetX:" + offsetX);
            //console.log("offsetY - this.sizeText / 2 : " + (offsetY - this.sizeText / 2) + "offsetY:" + offsetY);

            ctx.closePath();
            ctx.restore();

            lastEnd += Math.PI * 2 * (this.data[i].percent / total);
        }
    } else {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.strokeStyle = colorLine;
        ctx.stroke();
    }




}