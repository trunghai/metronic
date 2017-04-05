/**
 * Created by JetBrains WebStorm.
 * User: LamPT
 * Date: 12/9/15
 * Time: 9:15 AM
 * To change this template use File | Settings | File Templates.
 */
// Check if a new cache is available on page load.
window.applicationCache.addEventListener('updateready', function (e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
        // Browser downloaded a new app cache.
        window.location.reload();
    } else {
        console.log('Manifest didn\'t changed. Nothing new to server.');
    }
}, false);

window.applicationCache.addEventListener('downloading', function(e){
    addCacheUpdateMask();
    setTimeout(function(){
        removeCacheUpdateMask();
    },90000)
}, false);

window.applicationCache.addEventListener('progress', function(e){
    var processBarLabel= document.getElementById('processBarLabel');
    var processBarPercent= document.getElementById('processBarPercent');
    if(processBarLabel && processBarPercent){
        var percent = (e.loaded/e.total)*100;
        processBarLabel.innerHTML = 'L&nbsp;&nbsp;O&nbsp;&nbsp;A&nbsp;&nbsp;D&nbsp;&nbsp;I&nbsp;&nbsp;N&nbsp;&nbsp;G&nbsp;&nbsp;&nbsp;' + Math.round(percent) + "%";
        processBarPercent.style.width = Math.round(percent) + "%";
    }
    if(e.loaded == e.total){
        removeCacheUpdateMask();
    }
}, false);

window.applicationCache.addEventListener('error', function(e){
    removeCacheUpdateMask();
}, false);

function addCacheUpdateMask(){
    var loadCachePanel = document.createElement('div');
    loadCachePanel.id = 'loadCachePanel';
    loadCachePanel.setAttribute("style","width:100%; height:100%; background-color: rgb(95, 47, 133); position: absolute; z-index: 999999; top:0; left:0");
    loadCachePanel.innerHTML = "<div id='user-background-image' class='gradient-background-layer-0'></div><div class='gradient-background-layer-1'></div><div id='progressBar' style='position: absolute;border-radius:10px;width: 80%;top:50%;left:10%;height: 5px;background-color: rgba(255,255,255,0.3);'><div style='width:100%;position: absolute;top: -100px;' align='center'><img src='./assets/images/logo-transparent.png' height='56px'></div><div id='processBarPercent' style='position: absolute;border-radius: 10px;width: 0%;height: 100%;background-color: rgb(246, 144, 19);'></div><div id='processBarLabel' style='position: absolute;width: 100%;text-align: center;color: rgba(255, 255, 255,0.6);padding: 16px;font-family: TPBNeoSans !important;font-size: 10px;font-weight: bold;'>0%</div></div></div>";
        
    document.body.appendChild(loadCachePanel);
}

function removeCacheUpdateMask(){
    var loadCachePanel = document.getElementById('loadCachePanel');
    if(loadCachePanel){
        document.body.removeChild(loadCachePanel);
    }
}