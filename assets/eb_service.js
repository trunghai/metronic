/**
 * Created by HaiDT1 on 11/22/2016.
 */
var EbankApp = angular.module("EbankApp",[
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "angularFileUpload",
]);

EbankApp.service('requestMBServiceCorp', function ($http) {
    this.get = function (data, loadMask,successCallBack, errorCallBack) {
        hiddenKeyBoardWhenRequest();
        if(loadMask)showLoadingMask();
        var tmpReqReal = JSON.stringify(data);
        var request = {
            method: 'GET',
            url: CONST_WEB_SERVICE_LINK,
            header: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: tmpReqReal
        }
        $http(request).then(function (response) {
            hideLoadingMask();
            var res = JSON.parse(JSON.stringify(response.data));
            if (res.respCode == RESP.get("COM_INVALID_SESSION")) {
                document.addEventListener('closeAlertView', logoutNoRequest, false);
                showAlertText(CONST_STR.get("CORP_MSG_SESSION_EXPIRED"));
                return;
            }

            if(successCallBack && (typeof successCallBack == "function")) {

                successCallBack(res);
                if (typeof(mainContentScroll) != "undefined" && mainContentScroll != null)
                    mainContentScroll.refresh();
            }
        }, function (response) {
            hideLoadingMask();
            if(errorCallBack && (typeof errorCallBack == "function")) {
                errorCallBack(response.data);
            }
        });
    }

    this.post = function (data, loadMask,successCallBack, errorCallBack) {
        hiddenKeyBoardWhenRequest();

        if(loadMask)showLoadingMask();

        var tmpReqReal = JSON.stringify(data);
        console.log("JSON DATA: " + tmpReqReal);
        var request = {
            method: 'POST',
            url: CONST_WEB_SERVICE_LINK,
            header: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: tmpReqReal,
            responseType: 'text'
        }
        $http(request).then(function (response) {
            hideLoadingMask();
            var res = JSON.parse(JSON.stringify(response.data));
            if (res.respCode == RESP.get("COM_INVALID_SESSION")) {
                document.addEventListener('closeAlertView', logoutNoRequest, false);
                showAlertText(CONST_STR.get("CORP_MSG_SESSION_EXPIRED"));
                return;
            }
            // if(parseInt(res.respCode) != parseInt(RESP.get('COM_SUCCESS'))){
            //     showAlertText(res.respContent);
            //     return;
            // }
            if(successCallBack && (typeof successCallBack == "function")) {
                successCallBack(res);
            }
        }, function (response) {
            hideLoadingMask();
            if(errorCallBack && (typeof errorCallBack == "function")) {
                errorCallBack(response.data);
            }
        });

    }
});

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
EbankApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
EbankApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/* Setup App Main Controller */
EbankApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });
}]);