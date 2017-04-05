/**
 * Framework7 1.4.0
 * Full Featured Mobile HTML Framework For Building iOS & Android Apps
 *
 * http://www.idangero.us/framework7
 *
 * Copyright 2015, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under MIT
 *
 * Released on: December 7, 2015
 */
(function () {

    'use strict';
    /*===========================
     Framework 7
     ===========================*/
    window.Framework7 = function (params) {
        // App
        var app = this;

        // Version
        app.version = '1.4.0';

        // Default Parameters
        app.params = {
            cache:true,
            cacheIgnore:[],
            cacheIgnoreGetParameters:false,
            cacheDuration:1000 * 60 * 10, // Ten minutes
            preloadPreviousPage:true,
            uniqueHistory:false,
            uniqueHistoryIgnoreGetParameters:false,
            dynamicPageUrl:'content-{{index}}',
            allowDuplicateUrls:false,
            router:true,
            // Push State
            pushState:false,
            pushStateRoot:undefined,
            pushStateNoAnimation:false,
            pushStateSeparator:'#!/',
            pushStatePreventOnLoad:true,
            // Fast clicks
            fastClicks:true,
            fastClicksDistanceThreshold:10,
            fastClicksDelayBetweenClicks:50,
            // Tap Hold
            tapHold:false,
            tapHoldDelay:750,
            tapHoldPreventClicks:true,
            // Active State
            activeState:true,
            activeStateElements:'a, button, label, span',
            // Animate Nav Back Icon
            animateNavBackIcon:false,
            // Swipe Back
            swipeBackPage:true,
            swipeBackPageThreshold:0,
            swipeBackPageActiveArea:30,
            swipeBackPageAnimateShadow:true,
            swipeBackPageAnimateOpacity:true,
            // Ajax
            ajaxLinks:undefined, // or CSS selector
            // External Links
            externalLinks:'.external', // CSS selector
            // Sortable
            sortable:true,
            // Scroll toolbars
            hideNavbarOnPageScroll:false,
            hideToolbarOnPageScroll:false,
            hideTabbarOnPageScroll:false,
            showBarsOnPageScrollEnd:true,
            showBarsOnPageScrollTop:true,
            // Swipeout
            swipeout:true,
            swipeoutActionsNoFold:false,
            swipeoutNoFollow:false,
            // Smart Select Back link template
            smartSelectOpenIn:'page', // or 'popup' or 'picker'
            smartSelectBackText:'Back',
            smartSelectPopupCloseText:'Close',
            smartSelectPickerCloseText:'Done',
            smartSelectSearchbar:false,
            smartSelectBackOnSelect:false,
            // Tap Navbar or Statusbar to scroll to top
            scrollTopOnNavbarClick:false,
            scrollTopOnStatusbarClick:false,
            // Panels
            swipePanel:false, // or 'left' or 'right'
            swipePanelActiveArea:0,
            swipePanelCloseOpposite:true,
            swipePanelOnlyClose:false,
            swipePanelNoFollow:false,
            swipePanelThreshold:0,
            panelsCloseByOutside:true,
            // Modals
            modalButtonOk:'OK',
            modalButtonCancel:'Cancel',
            modalUsernamePlaceholder:'Username',
            modalPasswordPlaceholder:'Password',
            modalTitle:'Framework7',
            modalCloseByOutside:false,
            actionsCloseByOutside:true,
            popupCloseByOutside:true,
            modalPreloaderTitle:'Loading... ',
            modalStack:true,
            // Lazy Load
            imagesLazyLoadThreshold:0,
            imagesLazyLoadSequential:true,
            // Name space
            viewClass:'view',
            viewMainClass:'view-main',
            viewsClass:'views',
            // Notifications defaults
            notificationCloseOnClick:false,
            notificationCloseIcon:true,
            notificationCloseButtonText:'Close',
            // Animate Pages
            animatePages:true,
            // Template7
            templates:{},
            template7Data:{},
            template7Pages:false,
            precompileTemplates:false,
            // Material
            material:false,
            materialPageLoadDelay:0,
            materialPreloaderSvg:'<svg xmlns="http://www.w3.org/2000/svg" height="75" width="75" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" stroke-width="8"/></svg>',
            materialPreloaderHtml:'<span class="preloader-inner">' +
                '<span class="preloader-inner-gap"></span>' +
                '<span class="preloader-inner-left">' +
                '<span class="preloader-inner-half-circle"></span>' +
                '</span>' +
                '<span class="preloader-inner-right">' +
                '<span class="preloader-inner-half-circle"></span>' +
                '</span>' +
                '</span>',
            materialRipple:true,
            materialRippleElements:'.ripple, a.link, a.item-link, .button, .modal-button, .tab-link, .label-radio, .label-checkbox, .actions-modal-button, a.searchbar-clear, a.floating-button, .floating-button > a, .speed-dial-buttons a',
            // Auto init
            init:true,
        };

        // Extend defaults with parameters
        for (var param in params) {
            app.params[param] = params[param];
        }

        // DOM lib
        var F7$ = Dom7;

        app._compiledTemplates = {};

        // Touch events
        app.touchEvents = {
            start:app.support.touch ? 'touchstart' : 'mousedown',
            move:app.support.touch ? 'touchmove' : 'mousemove',
            end:app.support.touch ? 'touchend' : 'mouseup'
        };

        // Link to local storage
        app.ls = window.localStorage;

        // RTL
        app.rtl = F7$('body').css('direction') === 'rtl';
        if (app.rtl) F7$('html').attr('dir', 'rtl');

        // Overwrite statusbar overlay
        if (typeof app.params.statusbarOverlay !== 'undefined') {
            if (app.params.statusbarOverlay) F7$('html').addClass('with-statusbar-overlay');
            else F7$('html').removeClass('with-statusbar-overlay');
        }

     /*===========================
        Framework7 Swiper Additions
        ===========================*/


        /*======================================================
         ************   Modals   ************
         ======================================================*/
        var _modalTemplateTempDiv = document.createElement('div');
        app.modalStack = [];
        app.modalStackClearQueue = function () {
            if (app.modalStack.length) {
                (app.modalStack.shift())();
            }
        };
        app.modal = function (params) {
            params = params || {};
            var modalHTML = '';
            if (app.params.modalTemplate) {
                if (!app._compiledTemplates.modal) app._compiledTemplates.modal = t7.compile(app.params.modalTemplate);
                modalHTML = app._compiledTemplates.modal(params);
            }
            else {
                var buttonsHTML = '';
                if (params.buttons && params.buttons.length > 0) {
                    for (var i = 0; i < params.buttons.length; i++) {
                        buttonsHTML += '<span class="modal-button' + (params.buttons[i].bold ? ' modal-button-bold' : '') + '">' + params.buttons[i].text + '</span>';
                    }
                }
                var titleHTML = params.title ? '<div class="modal-title">' + params.title + '</div>' : '';
                var textHTML = params.text ? '<div class="modal-text">' + params.text + '</div>' : '';
                var afterTextHTML = params.afterText ? params.afterText : '';
                var noButtons = !params.buttons || params.buttons.length === 0 ? 'modal-no-buttons' : '';
                var verticalButtons = params.verticalButtons ? 'modal-buttons-vertical' : '';
                var modalButtonsHTML = params.buttons && params.buttons.length > 0 ? '<div class="modal-buttons modal-buttons-' + params.buttons.length + ' ' + verticalButtons + '">' + buttonsHTML + '</div>' : '';
                modalHTML = '<div class="modal ' + noButtons + ' ' + (params.cssClass || '') + '"><div class="modal-inner">' + (titleHTML + textHTML + afterTextHTML) + '</div>' + modalButtonsHTML + '</div>';
            }

            _modalTemplateTempDiv.innerHTML = modalHTML;

            var modal = F7$(_modalTemplateTempDiv).children();

            F7$('body').append(modal[0]);

            // Add events on buttons
            modal.find('.modal-button').each(function (index, el) {
                console.log('click');
                F7$(el).on('click', function (e) {
                    if (params.buttons[index].close !== false) app.closeModal(modal);
                    if (params.buttons[index].onClick) params.buttons[index].onClick(modal, e);
                    if (params.onClick) params.onClick(modal, index);
                });
            });
            app.openModal(modal);
            return modal[0];
        };
        app.alert = function (text, title, callbackOk) {
            if (typeof title === 'function') {
                callbackOk = arguments[1];
                title = undefined;
            }
            return app.modal({
                text:text || '',
                title:typeof title === 'undefined' ? app.params.modalTitle : title,
                buttons:[
                    {text:app.params.modalButtonOk, bold:true, onClick:callbackOk}
                ]
            });
        };
        app.confirm = function (text, title, callbackOk, callbackCancel) {
            if (typeof title === 'function') {
                callbackCancel = arguments[2];
                callbackOk = arguments[1];
                title = undefined;
            }
            return app.modal({
                text:text || '',
                title:typeof title === 'undefined' ? app.params.modalTitle : title,
                buttons:[
                    {text:app.params.modalButtonCancel, onClick:callbackCancel},
                    {text:app.params.modalButtonOk, bold:true, onClick:callbackOk}
                ]
            });
        };
        app.prompt = function (text, title, callbackOk, callbackCancel) {
            if (typeof title === 'function') {
                callbackCancel = arguments[2];
                callbackOk = arguments[1];
                title = undefined;
            }
            return app.modal({
                text:text || '',
                title:typeof title === 'undefined' ? app.params.modalTitle : title,
                afterText:'<div class="input-field"><input type="text" class="modal-text-input"></div>',
                buttons:[
                    {
                        text:app.params.modalButtonCancel
                    },
                    {
                        text:app.params.modalButtonOk,
                        bold:true
                    }
                ],
                onClick:function (modal, index) {
                    if (index === 0 && callbackCancel) callbackCancel(F7$(modal).find('.modal-text-input').val());
                    if (index === 1 && callbackOk) callbackOk(F7$(modal).find('.modal-text-input').val());
                }
            });
        };
        app.modalLogin = function (text, title, callbackOk, callbackCancel) {
            if (typeof title === 'function') {
                callbackCancel = arguments[2];
                callbackOk = arguments[1];
                title = undefined;
            }
            return app.modal({
                text:text || '',
                title:typeof title === 'undefined' ? app.params.modalTitle : title,
                afterText:'<div class="input-field modal-input-double"><input type="text" name="modal-username" placeholder="' + app.params.modalUsernamePlaceholder + '" class="modal-text-input"></div><div class="input-field modal-input-double"><input type="password" name="modal-password" placeholder="' + app.params.modalPasswordPlaceholder + '" class="modal-text-input"></div>',
                buttons:[
                    {
                        text:app.params.modalButtonCancel
                    },
                    {
                        text:app.params.modalButtonOk,
                        bold:true
                    }
                ],
                onClick:function (modal, index) {
                    var username = F7$(modal).find('.modal-text-input[name="modal-username"]').val();
                    var password = F7$(modal).find('.modal-text-input[name="modal-password"]').val();
                    if (index === 0 && callbackCancel) callbackCancel(username, password);
                    if (index === 1 && callbackOk) callbackOk(username, password);
                }
            });
        };
        app.modalPassword = function (text, title, callbackOk, callbackCancel) {
            if (typeof title === 'function') {
                callbackCancel = arguments[2];
                callbackOk = arguments[1];
                title = undefined;
            }
            return app.modal({
                text:text || '',
                title:typeof title === 'undefined' ? app.params.modalTitle : title,
                afterText:'<div class="input-field"><input type="password" name="modal-password" placeholder="' + app.params.modalPasswordPlaceholder + '" class="modal-text-input"></div>',
                buttons:[
                    {
                        text:app.params.modalButtonCancel
                    },
                    {
                        text:app.params.modalButtonOk,
                        bold:true
                    }
                ],
                onClick:function (modal, index) {
                    var password = F7$(modal).find('.modal-text-input[name="modal-password"]').val();
                    if (index === 0 && callbackCancel) callbackCancel(password);
                    if (index === 1 && callbackOk) callbackOk(password);
                }
            });
        };
        app.showPreloader = function (title) {
            return app.modal({
                title:title || app.params.modalPreloaderTitle,
                text:'<div class="preloader">' + (app.params.material ? app.params.materialPreloaderHtml : '') + '</div>',
                cssClass:'modal-preloader'
            });
        };
        app.hidePreloader = function () {
            app.closeModal('.modal.modal-in');
        };
        app.showIndicator = function () {
            F7$('body').append('<div class="preloader-indicator-overlay"></div><div class="preloader-indicator-modal"><span class="preloader preloader-white">' + (app.params.material ? app.params.materialPreloaderHtml : '') + '</span></div>');
        };
        app.hideIndicator = function () {
            F7$('.preloader-indicator-overlay, .preloader-indicator-modal').remove();
        };
        // Action Sheet
        app.actions = function (target, params) {
            var toPopover = false, modal, groupSelector, buttonSelector;
            if (arguments.length === 1) {
                // Actions
                params = target;
            }
            else {
                // Popover
                if (app.device.ios) {
                    if (app.device.ipad) toPopover = true;
                }
                else {
                    if (F7$(window).width() >= 768) toPopover = true;
                }
            }
            params = params || [];

            if (params.length > 0 && !F7$.isArray(params[0])) {
                params = [params];
            }
            var modalHTML;
            if (toPopover) {
                var actionsToPopoverTemplate = app.params.modalActionsToPopoverTemplate ||
                    '<div class="popover actions-popover">' +
                        '<div class="popover-inner">' +
                        '{{#each this}}' +
                        '<div class="list-block">' +
                        '<ul>' +
                        '{{#each this}}' +
                        '{{#if label}}' +
                        '<li class="actions-popover-label {{#if color}}color-{{color}}{{/if}} {{#if bold}}actions-popover-bold{{/if}}">{{text}}</li>' +
                        '{{else}}' +
                        '<li><a href="#" class="item-link list-button {{#if color}}color-{{color}}{{/if}} {{#if bg}}bg-{{bg}}{{/if}} {{#if bold}}actions-popover-bold{{/if}} {{#if disabled}}disabled{{/if}}">{{text}}</a></li>' +
                        '{{/if}}' +
                        '{{/each}}' +
                        '</ul>' +
                        '</div>' +
                        '{{/each}}' +
                        '</div>' +
                        '</div>';
                if (!app._compiledTemplates.actionsToPopover) {
                    app._compiledTemplates.actionsToPopover = t7.compile(actionsToPopoverTemplate);
                }
                var popoverHTML = app._compiledTemplates.actionsToPopover(params);
                modal = F7$(app.popover(popoverHTML, target, true));
                groupSelector = '.list-block ul';
                buttonSelector = '.list-button';
            }
            else {
                if (app.params.modalActionsTemplate) {
                    if (!app._compiledTemplates.actions) app._compiledTemplates.actions = t7.compile(app.params.modalActionsTemplate);
                    modalHTML = app._compiledTemplates.actions(params);
                }
                else {
                    var buttonsHTML = '';
                    for (var i = 0; i < params.length; i++) {
                        for (var j = 0; j < params[i].length; j++) {
                            if (j === 0) buttonsHTML += '<div class="actions-modal-group">';
                            var button = params[i][j];
                            var buttonClass = button.label ? 'actions-modal-label' : 'actions-modal-button';
                            if (button.bold) buttonClass += ' actions-modal-button-bold';
                            if (button.color) buttonClass += ' color-' + button.color;
                            if (button.bg) buttonClass += ' bg-' + button.bg;
                            if (button.disabled) buttonClass += ' disabled';
                            buttonsHTML += '<div class="' + buttonClass + '">' + button.text + '</div>';
                            if (j === params[i].length - 1) buttonsHTML += '</div>';
                        }
                    }
                    modalHTML = '<div class="actions-modal">' + buttonsHTML + '</div>';
                }
                _modalTemplateTempDiv.innerHTML = modalHTML;
                modal = F7$(_modalTemplateTempDiv).children();
                F7$('body').append(modal[0]);
                groupSelector = '.actions-modal-group';
                buttonSelector = '.actions-modal-button';
            }

            var groups = modal.find(groupSelector);
            groups.each(function (index, el) {
                var groupIndex = index;
                F7$(el).children().each(function (index, el) {
                    var buttonIndex = index;
                    var buttonParams = params[groupIndex][buttonIndex];
                    var clickTarget;
                    if (!toPopover && F7$(el).is(buttonSelector)) clickTarget = F7$(el);
                    if (toPopover && F7$(el).find(buttonSelector).length > 0) clickTarget = F7$(el).find(buttonSelector);

                    if (clickTarget) {
                        clickTarget.on('click', function (e) {
                            if (buttonParams.close !== false) app.closeModal(modal);
                            if (buttonParams.onClick) buttonParams.onClick(modal, e);
                        });
                    }
                });
            });
            if (!toPopover) app.openModal(modal);
            return modal[0];
        };
        app.popover = function (modal, target, removeOnClose) {
            if (typeof removeOnClose === 'undefined') removeOnClose = true;
            if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
                var _modal = document.createElement('div');
                _modal.innerHTML = modal.trim();
                if (_modal.childNodes.length > 0) {
                    modal = _modal.childNodes[0];
                    if (removeOnClose) modal.classList.add('remove-on-close');
                    F7$('body').append(modal);
                }
                else return false; //nothing found
            }
            modal = F7$(modal);
            target = F7$(target);
            if (modal.length === 0 || target.length === 0) return false;
            if (modal.find('.popover-angle').length === 0 && !app.params.material) {
                modal.append('<div class="popover-angle"></div>');
            }
            modal.show();

            var material = app.params.material;

            function sizePopover() {
                modal.css({left:'', top:''});
                var modalWidth = modal.width();
                var modalHeight = modal.height(); // 13 - height of angle
                var modalAngle, modalAngleSize = 0, modalAngleLeft, modalAngleTop;
                if (!material) {
                    modalAngle = modal.find('.popover-angle');
                    modalAngleSize = modalAngle.width() / 2;
                    modalAngle.removeClass('on-left on-right on-top on-bottom').css({left:'', top:''});
                }
                else {
                    modal.removeClass('popover-on-left popover-on-right popover-on-top popover-on-bottom').css({left:'', top:''});
                }

                var targetWidth = target.outerWidth();
                var targetHeight = target.outerHeight();
                var targetOffset = target.offset();
                var targetParentPage = target.parents('.page');
                if (targetParentPage.length > 0) {
                    targetOffset.top = targetOffset.top - targetParentPage[0].scrollTop;
                }

                var windowHeight = F7$(window).height();
                var windowWidth = F7$(window).width();

                var modalTop = 0;
                var modalLeft = 0;
                var diff = 0;
                // Top Position
                var modalPosition = material ? 'bottom' : 'top';
                if (material) {
                    if (modalHeight < windowHeight - targetOffset.top - targetHeight) {
                        // On bottom
                        modalPosition = 'bottom';
                        modalTop = targetOffset.top;
                    }
                    else if (modalHeight < targetOffset.top) {
                        // On top
                        modalTop = targetOffset.top - modalHeight + targetHeight;
                        modalPosition = 'top';
                    }
                    else {
                        // On middle
                        modalPosition = 'bottom';
                        modalTop = targetOffset.top;
                    }

                    if (modalTop <= 0) {
                        modalTop = 8;
                    }
                    else if (modalTop + modalHeight >= windowHeight) {
                        modalTop = windowHeight - modalHeight - 8;
                    }

                    // Horizontal Position
                    modalLeft = targetOffset.left;
                    if (modalLeft + modalWidth >= windowWidth - 8) {
                        modalLeft = targetOffset.left + targetWidth - modalWidth - 8;
                    }
                    if (modalLeft < 8) {
                        modalLeft = 8;
                    }
                    if (modalPosition === 'top') {
                        modal.addClass('popover-on-top');
                    }
                    if (modalPosition === 'bottom') {
                        modal.addClass('popover-on-bottom');
                    }
                    if (target.hasClass('floating-button-to-popover') && !modal.hasClass('modal-in')) {
                        modal.addClass('popover-floating-button');
                        var diffX = (modalLeft + modalWidth / 2) - (targetOffset.left + targetWidth / 2),
                            diffY = (modalTop + modalHeight / 2) - (targetOffset.top + targetHeight / 2);
                        target
                            .addClass('floating-button-to-popover-in')
                            .transform('translate3d(' + diffX + 'px, ' + diffY + 'px,0)')
                            .transitionEnd(function (e) {
                                if (!target.hasClass('floating-button-to-popover-in')) return;
                                target
                                    .addClass('floating-button-to-popover-scale')
                                    .transform('translate3d(' + diffX + 'px, ' + diffY + 'px,0) scale(' + (modalWidth / targetWidth) + ', ' + (modalHeight / targetHeight) + ')');
                            });

                        modal.once('close', function () {
                            target
                                .removeClass('floating-button-to-popover-in floating-button-to-popover-scale')
                                .addClass('floating-button-to-popover-out')
                                .transform('')
                                .transitionEnd(function (e) {
                                    target.removeClass('floating-button-to-popover-out');
                                });
                        });
                        modal.once('closed', function () {
                            modal.removeClass('popover-floating-button');
                        });
                    }

                }
                else {
                    if ((modalHeight + modalAngleSize) < targetOffset.top) {
                        // On top
                        modalTop = targetOffset.top - modalHeight - modalAngleSize;
                    }
                    else if ((modalHeight + modalAngleSize) < windowHeight - targetOffset.top - targetHeight) {
                        // On bottom
                        modalPosition = 'bottom';
                        modalTop = targetOffset.top + targetHeight + modalAngleSize;
                    }
                    else {
                        // On middle
                        modalPosition = 'middle';
                        modalTop = targetHeight / 2 + targetOffset.top - modalHeight / 2;
                        diff = modalTop;
                        if (modalTop <= 0) {
                            modalTop = 5;
                        }
                        else if (modalTop + modalHeight >= windowHeight) {
                            modalTop = windowHeight - modalHeight - 5;
                        }
                        diff = diff - modalTop;
                    }

                    // Horizontal Position
                    if (modalPosition === 'top' || modalPosition === 'bottom') {
                        modalLeft = targetWidth / 2 + targetOffset.left - modalWidth / 2;
                        diff = modalLeft;
                        if (modalLeft < 5) modalLeft = 5;
                        if (modalLeft + modalWidth > windowWidth) modalLeft = windowWidth - modalWidth - 5;
                        if (modalPosition === 'top') {
                            modalAngle.addClass('on-bottom');
                        }
                        if (modalPosition === 'bottom') {
                            modalAngle.addClass('on-top');
                        }
                        diff = diff - modalLeft;
                        modalAngleLeft = (modalWidth / 2 - modalAngleSize + diff);
                        modalAngleLeft = Math.max(Math.min(modalAngleLeft, modalWidth - modalAngleSize * 2 - 13), 13);
                        modalAngle.css({left:modalAngleLeft + 'px'});

                    }
                    else if (modalPosition === 'middle') {
                        modalLeft = targetOffset.left - modalWidth - modalAngleSize;
                        modalAngle.addClass('on-right');
                        if (modalLeft < 5 || (modalLeft + modalWidth > windowWidth)) {
                            if (modalLeft < 5) modalLeft = targetOffset.left + targetWidth + modalAngleSize;
                            if (modalLeft + modalWidth > windowWidth) modalLeft = windowWidth - modalWidth - 5;
                            modalAngle.removeClass('on-right').addClass('on-left');
                        }
                        modalAngleTop = (modalHeight / 2 - modalAngleSize + diff);
                        modalAngleTop = Math.max(Math.min(modalAngleTop, modalHeight - modalAngleSize * 2 - 13), 13);
                        modalAngle.css({top:modalAngleTop + 'px'});
                    }
                }


                // Apply Styles
                modal.css({top:modalTop + 'px', left:modalLeft + 'px'});
            }

            sizePopover();

            F7$(window).on('resize', sizePopover);

            modal.on('close', function () {
                F7$(window).off('resize', sizePopover);
            });

            app.openModal(modal);
            return modal[0];
        };
        app.popup = function (modal, removeOnClose) {
            if (typeof removeOnClose === 'undefined') removeOnClose = true;
            if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
                var _modal = document.createElement('div');
                _modal.innerHTML = modal.trim();
                if (_modal.childNodes.length > 0) {
                    modal = _modal.childNodes[0];
                    if (removeOnClose) modal.classList.add('remove-on-close');
                    F7$('body').append(modal);
                }
                else return false; //nothing found
            }
            modal = F7$(modal);
            if (modal.length === 0) return false;
            modal.show();

            app.openModal(modal);
            return modal[0];
        };
        app.pickerModal = function (modal, removeOnClose) {
            if (typeof removeOnClose === 'undefined') removeOnClose = true;
            if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
                modal = F7$(modal);
                if (modal.length > 0) {
                    if (removeOnClose) modal.addClass('remove-on-close');
                    F7$('body').append(modal[0]);
                }
                else return false; //nothing found
            }
            modal = F7$(modal);
            if (modal.length === 0) return false;
            if (F7$('.picker-modal.modal-in:not(.modal-out)').length > 0 && !modal.hasClass('modal-in')) {
                app.closeModal('.picker-modal.modal-in:not(.modal-out)');
            }
            modal.show();
            app.openModal(modal);
            return modal[0];
        };
        app.loginScreen = function (modal) {
            if (!modal) modal = '.login-screen';
            modal = F7$(modal);
            if (modal.length === 0) return false;
            if (F7$('.login-screen.modal-in:not(.modal-out)').length > 0 && !modal.hasClass('modal-in')) {
                app.closeModal('.login-screen.modal-in:not(.modal-out)');
            }
            modal.show();

            app.openModal(modal);
            return modal[0];
        };
        app.openModal = function (modal) {
            modal = F7$(modal);
            var isModal = modal.hasClass('modal');
            if (F7$('.modal.modal-in:not(.modal-out)').length && app.params.modalStack && isModal) {
                app.modalStack.push(function () {
                    app.openModal(modal);
                });
                return;
            }
            // do nothing if this modal already shown
            if (true === modal.data('f7-modal-shown')) {
                return;
            }
            modal.data('f7-modal-shown', true);
            modal.once('close', function () {
                modal.removeData('f7-modal-shown');
            });
            var isPopover = modal.hasClass('popover');
            var isPopup = modal.hasClass('popup');
            var isLoginScreen = modal.hasClass('login-screen');
            var isPickerModal = modal.hasClass('picker-modal');
            if (isModal) {
                modal.show();
                modal.css({
                    marginTop:-Math.round(modal.outerHeight() / 2) + 'px'
                });
            }

            var overlay;
            if (!isLoginScreen && !isPickerModal) {
                if (F7$('.modal-overlay').length === 0 && !isPopup) {
                    F7$('body').append('<div class="modal-overlay"></div>');
                }
                if (F7$('.popup-overlay').length === 0 && isPopup) {
                    F7$('body').append('<div class="popup-overlay"></div>');
                }
                overlay = isPopup ? F7$('.popup-overlay') : F7$('.modal-overlay');
            }
            if (app.params.material && isPickerModal) {
                if (modal.hasClass('picker-calendar')) {
                    if (F7$('.picker-modal-overlay').length === 0 && !isPopup) {
                        F7$('body').append('<div class="picker-modal-overlay"></div>');
                    }
                    overlay = F7$('.picker-modal-overlay');
                }
            }

            //Make sure that styles are applied, trigger relayout;
            var clientLeft = modal[0].clientLeft;

            // Trugger open event
            modal.trigger('open');

            // Picker modal body class
            if (isPickerModal) {
                F7$('body').addClass('with-picker-modal');
            }

            // Init Pages and Navbars in modal
            if (modal.find('.' + app.params.viewClass).length > 0) {
                modal.find('.page').each(function () {
                    app.initPageWithCallback(this);
                });
                modal.find('.navbar').each(function () {
                    app.initNavbarWithCallback(this);
                });
            }

            // Classes for transition in
            if (!isLoginScreen && !isPickerModal) overlay.addClass('modal-overlay-visible');
            if (app.params.material && isPickerModal && overlay) overlay.addClass('modal-overlay-visible');
            modal.removeClass('modal-out').addClass('modal-in').transitionEnd(function (e) {
                if (modal.hasClass('modal-out')) modal.trigger('closed');
                else modal.trigger('opened');
            });
            return true;
        };
        app.closeModal = function (modal) {
            
            console.log("closeModal");
            modal = F7$(modal || '.modal-in');
            if (typeof modal !== 'undefined' && modal.length === 0) {
                return;
            }
            var isModal = modal.hasClass('modal');
            var isPopover = modal.hasClass('popover');
            var isPopup = modal.hasClass('popup');
            var isLoginScreen = modal.hasClass('login-screen');
            var isPickerModal = modal.hasClass('picker-modal');

            var removeOnClose = modal.hasClass('remove-on-close');

            var overlay;

            if (isPopup) overlay = F7$('.popup-overlay');
            else {
                if (isPickerModal && app.params.material) overlay = F7$('.picker-modal-overlay');
                else if (!isPickerModal) overlay = F7$('.modal-overlay');
            }

            if (isPopup) {
                if (modal.length === F7$('.popup.modal-in').length) {
                    overlay.removeClass('modal-overlay-visible');
                }
            }
            else if (overlay && overlay.length > 0) {
                overlay.removeClass('modal-overlay-visible');
            }

            modal.trigger('close');

            // Picker modal body class
            if (isPickerModal) {
                F7$('body').removeClass('with-picker-modal');
                F7$('body').addClass('picker-modal-closing');
            }

            if (!(isPopover && !app.params.material)) {
                modal.removeClass('modal-in').addClass('modal-out').transitionEnd(function (e) {
                    if (modal.hasClass('modal-out')) modal.trigger('closed');
                    else {
                        modal.trigger('opened');
                        if (isPopover) return;
                    }

                    if (isPickerModal) {
                        F7$('body').removeClass('picker-modal-closing');
                    }
                    if (isPopup || isLoginScreen || isPickerModal || isPopover) {
                        modal.removeClass('modal-out').hide();
                        if (removeOnClose && modal.length > 0) {
                            modal.remove();
                        }
                    }
                    else {
                        modal.remove();
                    }
                });
                if (isModal && app.params.modalStack) {
                    app.modalStackClearQueue();
                }
            }
            else {
                modal.removeClass('modal-in modal-out').trigger('closed').hide();
                if (removeOnClose) {
                    modal.remove();
                }
            }
            return true;
        };


        /*======================================================
         ************   Calendar   ************
         ======================================================*/
        var Calendar = function (params) {
            var p = this;
            var defaults = {
                monthNames:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'],
                monthNamesShort:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                dayNames:['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                dayNamesShort:['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                firstDay:1, // First day of the week, Monday
                weekendDays:[0, 6], // Sunday and Saturday
                multiple:false,
                rangePicker:false,
                dateFormat:'yyyy-mm-dd',
                direction:'horizontal', // or 'vertical'
                minDate:null,
                maxDate:null,
                disabled:null, // dates range of disabled days
                events:null, // dates range of days with events
                rangesClasses:null, //array with custom classes date ranges
                touchMove:true,
                animate:true,
                closeOnSelect:false,
                monthPicker:true,
                monthPickerTemplate:'<div class="picker-calendar-month-picker">' +
                    '<a href="#" class="link icon-only picker-calendar-prev-month"><i class="icon icon-prev"></i></a>' +
                    '<span class="current-month-value"></span>' +
                    '<a href="#" class="link icon-only picker-calendar-next-month"><i class="icon icon-next"></i></a>' +
                    '</div>',
                yearPicker:true,
                yearPickerTemplate:'<div class="picker-calendar-year-picker">' +
                    '<a href="#" class="link icon-only picker-calendar-prev-year"><i class="icon icon-prev"></i></a>' +
                    '<span class="current-year-value"></span>' +
                    '<a href="#" class="link icon-only picker-calendar-next-year"><i class="icon icon-next"></i></a>' +
                    '</div>',
                weekHeader:true,
                // Common settings
                closeByOutsideClick:true,
                scrollToInput:true,
                inputReadOnly:true,
                convertToPopover:true,
                onlyInPopover:false,
                toolbar:true,
                toolbarCloseText:'Done',
                headerPlaceholder:'Select date',
                header:app.params.material,
                footer:app.params.material,
                toolbarTemplate:'<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '{{monthPicker}}' +
                    '{{yearPicker}}' +
                    '</div>' +
                    '</div>',
                headerTemplate:'<div class="picker-header">' +
                    '<div class="picker-calendar-selected-date">{{placeholder}}</div>' +
                    '</div>',
                footerTemplate:'<div class="picker-footer">' +
                    '<a  onclick="calendarDefault.close();" class="button close-picker">{{closeText}}</a>' +
                    '</div>',

                /* Callbacks
                 onMonthAdd
                 onChange
                 onOpen
                 onClose
                 onDayClick
                 onMonthYearChangeStart
                 onMonthYearChangeEnd
                 */
            };
            params = params || {};
            for (var def in defaults) {
                if (typeof params[def] === 'undefined') {
                    params[def] = defaults[def];
                }
            }
            p.params = params;
            p.initialized = false;

            // Inline flag
            p.inline = p.params.container ? true : false;

            // Is horizontal
            p.isH = p.params.direction === 'horizontal';

            // RTL inverter
            var inverter = p.isH ? (app.rtl ? -1 : 1) : 1;

            // Animating flag
            p.animating = false;

            // Should be converted to popover
            function isPopover() {
                var toPopover = false;
                if (!p.params.convertToPopover && !p.params.onlyInPopover) return toPopover;
                if (!p.inline && p.params.input) {
                    if (p.params.onlyInPopover) toPopover = true;
                    else {
                        if (app.device.ios) {
                            toPopover = app.device.ipad ? true : false;
                        }
                        else {
//                            if (F7$(window).width() >= 768) toPopover = true;
                            if ((window.innerWidth || document.body.clientWidth) >= 768) toPopover = true;

                        }
                    }
                }
                return toPopover;
            }

            function inPopover() {
                if (p.opened && p.container && p.container.length > 0 && p.container.parents('.popover').length > 0) return true;
                else return false;
            }

            // Format date
            function formatDate(date) {
                date = new Date(date);
                var year = date.getFullYear();
                var month = date.getMonth();
                var month1 = month + 1;
                var day = date.getDate();
                var weekDay = date.getDay();

                return p.params.dateFormat
                    .replace(/yyyy/g, year)
                    .replace(/yy/g, (year + '').substring(2))
                    .replace(/mm/g, month1 < 10 ? '0' + month1 : month1)
                    .replace(/m(\W+)/g, month1 + '$1')
                    .replace(/MM/g, p.params.monthNames[month])
                    .replace(/M(\W+)/g, p.params.monthNamesShort[month] + '$1')
                    .replace(/dd/g, day < 10 ? '0' + day : day)
                    .replace(/d(\W+)/g, day + '$1')
                    .replace(/DD/g, p.params.dayNames[weekDay])
                    .replace(/D(\W+)/g, p.params.dayNamesShort[weekDay] + '$1');
            }


            // Value
            p.addValue = function (value) {
                if (p.params.multiple) {
                    if (!p.value) p.value = [];
                    var inValuesIndex;
                    for (var i = 0; i < p.value.length; i++) {
                        if (new Date(value).getTime() === new Date(p.value[i]).getTime()) {
                            inValuesIndex = i;
                        }
                    }
                    if (typeof inValuesIndex === 'undefined') {
                        p.value.push(value);
                    }
                    else {
                        p.value.splice(inValuesIndex, 1);
                    }
                    p.updateValue();
                }
                else if (p.params.rangePicker) {
                    if (!p.value) p.value = [];
                    if (p.value.length === 2 || p.value.length === 0) {
                        p.value = [];
                    }
                    if (p.value[0] !== value) p.value.push(value);
                    else p.value = [];
                    p.value.sort(function (a, b) {
                        return a - b;
                    });
                    p.updateValue();
                }
                else {
                    p.value = [value];
                    p.updateValue();
                }
            };
            p.setValue = function (arrValues) {
                p.value = arrValues;
                p.updateValue();
            };
            p.updateValue = function (onlyHeader) {
                var i, inputValue;
                if (p.container && p.container.length > 0) {
                    p.wrapper.find('.picker-calendar-day-selected').removeClass('picker-calendar-day-selected');
                    var valueDate;
                    if (p.params.rangePicker && p.value.length === 2) {
                        for (i = p.value[0]; i <= p.value[1]; i += 24 * 60 * 60 * 1000) {
                            valueDate = new Date(i);
                            p.wrapper.find('.picker-calendar-day[data-date="' + valueDate.getFullYear() + '-' + valueDate.getMonth() + '-' + valueDate.getDate() + '"]').addClass('picker-calendar-day-selected');
                        }
                    }
                    else {
                        for (i = 0; i < p.value.length; i++) {
                            valueDate = new Date(p.value[i]);
                            p.wrapper.find('.picker-calendar-day[data-date="' + valueDate.getFullYear() + '-' + valueDate.getMonth() + '-' + valueDate.getDate() + '"]').addClass('picker-calendar-day-selected');
                        }
                    }
                }

                if (p.params.onChange) {
                    p.params.onChange(p, p.value);
                }
                if ((p.input && p.input.length > 0) || (app.params.material && p.params.header)) {
                    if (p.params.formatValue) inputValue = p.params.formatValue(p, p.value);
                    else {
                        inputValue = [];
                        for (i = 0; i < p.value.length; i++) {
                            inputValue.push(formatDate(p.value[i]));
                        }
                        inputValue = inputValue.join(p.params.rangePicker ? ' - ' : ', ');
                    }
                    if (app.params.material && p.params.header && p.container && p.container.length > 0) {
                        p.container.find('.picker-calendar-selected-date').text(inputValue);
                    }
                    if (p.input && p.input.length > 0 && !onlyHeader) {
                        F7$(p.input).val(inputValue);
                        F7$(p.input).trigger('change');
                    }

                }
            };

            // Columns Handlers
            p.initCalendarEvents = function () {
                var col;
                var allowItemClick = true;
                var isTouched, isMoved, touchStartX, touchStartY, touchCurrentX, touchCurrentY, touchStartTime, touchEndTime, startTranslate, currentTranslate, wrapperWidth, wrapperHeight, percentage, touchesDiff, isScrolling;

                function handleTouchStart(e) {
                    if (isMoved || isTouched) return;
                    // e.preventDefault();
                    isTouched = true;
                    touchStartX = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
                    touchStartY = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                    touchStartTime = (new Date()).getTime();
                    percentage = 0;
                    allowItemClick = true;
                    isScrolling = undefined;
                    startTranslate = currentTranslate = p.monthsTranslate;
                }

                function handleTouchMove(e) {
                    if (!isTouched) return;

                    touchCurrentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                    touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                    if (typeof isScrolling === 'undefined') {
                        isScrolling = !!(isScrolling || Math.abs(touchCurrentY - touchStartY) > Math.abs(touchCurrentX - touchStartX));
                    }
                    if (p.isH && isScrolling) {
                        isTouched = false;
                        return;
                    }
                    e.preventDefault();
                    if (p.animating) {
                        isTouched = false;
                        return;
                    }
                    allowItemClick = false;
                    if (!isMoved) {
                        // First move
                        isMoved = true;
                        wrapperWidth = p.wrapper[0].offsetWidth;
                        wrapperHeight = p.wrapper[0].offsetHeight;
                        p.wrapper.transition(0);
                    }
                    e.preventDefault();

                    touchesDiff = p.isH ? touchCurrentX - touchStartX : touchCurrentY - touchStartY;
                    percentage = touchesDiff / (p.isH ? wrapperWidth : wrapperHeight);
                    currentTranslate = (p.monthsTranslate * inverter + percentage) * 100;

                    // Transform wrapper
                    p.wrapper.transform('translate3d(' + (p.isH ? currentTranslate : 0) + '%, ' + (p.isH ? 0 : currentTranslate) + '%, 0)');

                }

                function handleTouchEnd(e) {
                    if (!isTouched || !isMoved) {
                        isTouched = isMoved = false;
                        return;
                    }
                    isTouched = isMoved = false;

                    touchEndTime = new Date().getTime();
                    if (touchEndTime - touchStartTime < 300) {
                        if (Math.abs(touchesDiff) < 10) {
                            p.resetMonth();
                        }
                        else if (touchesDiff >= 10) {
                            if (app.rtl) p.nextMonth();
                            else p.prevMonth();
                        }
                        else {
                            if (app.rtl) p.prevMonth();
                            else p.nextMonth();
                        }
                    }
                    else {
                        if (percentage <= -0.5) {
                            if (app.rtl) p.prevMonth();
                            else p.nextMonth();
                        }
                        else if (percentage >= 0.5) {
                            if (app.rtl) p.nextMonth();
                            else p.prevMonth();
                        }
                        else {
                            p.resetMonth();
                        }
                    }

                    // Allow click
                    setTimeout(function () {
                        allowItemClick = true;
                    }, 100);
                }

                function handleDayClick(e) {
                    if (!allowItemClick) return;
                    var day = F7$(e.target).parents('.picker-calendar-day');
                    if (day.length === 0 && F7$(e.target).hasClass('picker-calendar-day')) {
                        day = F7$(e.target);
                    }
                    if (day.length === 0) return;
                    if (day.hasClass('picker-calendar-day-selected') && !(p.params.multiple || p.params.rangePicker)) return;
                    if (day.hasClass('picker-calendar-day-disabled')) return;
                    if (!p.params.rangePicker) {
                        if (day.hasClass('picker-calendar-day-next')) p.nextMonth();
                        if (day.hasClass('picker-calendar-day-prev')) p.prevMonth();
                    }
                    var dateYear = day.attr('data-year');
                    var dateMonth = day.attr('data-month');
                    var dateDay = day.attr('data-day');
                    if (p.params.onDayClick) {
                        p.params.onDayClick(p, day[0], dateYear, dateMonth, dateDay);
                    }
                    p.addValue(new Date(dateYear, dateMonth, dateDay).getTime());
                    if (p.params.closeOnSelect) {
                        if (p.params.rangePicker && p.value.length === 2 || !p.params.rangePicker) p.close();
                    }
                }

                p.container.find('.picker-calendar-prev-month').on('click', p.prevMonth);
                p.container.find('.picker-calendar-next-month').on('click', p.nextMonth);
                p.container.find('.picker-calendar-prev-year').on('click', p.prevYear);
                p.container.find('.picker-calendar-next-year').on('click', p.nextYear);
                p.wrapper.on('click', handleDayClick);
                if (p.params.touchMove) {
                    p.wrapper.on(app.touchEvents.start, handleTouchStart);
                    p.wrapper.on(app.touchEvents.move, handleTouchMove);
                    p.wrapper.on(app.touchEvents.end, handleTouchEnd);
                }

                p.container[0].f7DestroyCalendarEvents = function () {
                    p.container.find('.picker-calendar-prev-month').off('click', p.prevMonth);
                    p.container.find('.picker-calendar-next-month').off('click', p.nextMonth);
                    p.container.find('.picker-calendar-prev-year').off('click', p.prevYear);
                    p.container.find('.picker-calendar-next-year').off('click', p.nextYear);
                    p.wrapper.off('click', handleDayClick);
                    if (p.params.touchMove) {
                        p.wrapper.off(app.touchEvents.start, handleTouchStart);
                        p.wrapper.off(app.touchEvents.move, handleTouchMove);
                        p.wrapper.off(app.touchEvents.end, handleTouchEnd);
                    }
                };


            };
            p.destroyCalendarEvents = function (colContainer) {
                if ('f7DestroyCalendarEvents' in p.container[0]) p.container[0].f7DestroyCalendarEvents();
            };

            // Scan Dates Range
            p.dateInRange = function (dayDate, range) {
                var match = false;
                var i;
                if (!range) return false;
                if (F7$.isArray(range)) {
                    for (i = 0; i < range.length; i++) {
                        if (range[i].from || range[i].to) {
                            if (range[i].from && range[i].to) {
                                if ((dayDate <= new Date(range[i].to).getTime()) && (dayDate >= new Date(range[i].from).getTime())) {
                                    match = true;
                                }
                            }
                            else if (range[i].from) {
                                if (dayDate >= new Date(range[i].from).getTime()) {
                                    match = true;
                                }
                            }
                            else if (range[i].to) {
                                if (dayDate <= new Date(range[i].to).getTime()) {
                                    match = true;
                                }
                            }
                        } else if (dayDate === new Date(range[i]).getTime()) {
                            match = true;
                        }
                    }
                }
                else if (range.from || range.to) {
                    if (range.from && range.to) {
                        if ((dayDate <= new Date(range.to).getTime()) && (dayDate >= new Date(range.from).getTime())) {
                            match = true;
                        }
                    }
                    else if (range.from) {
                        if (dayDate >= new Date(range.from).getTime()) {
                            match = true;
                        }
                    }
                    else if (range.to) {
                        if (dayDate <= new Date(range.to).getTime()) {
                            match = true;
                        }
                    }
                }
                else if (typeof range === 'function') {
                    match = range(new Date(dayDate));
                }
                return match;
            };
            // Calendar Methods
            p.daysInMonth = function (date) {
                var d = new Date(date);
                return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
            };
            p.monthHTML = function (date, offset) {
                date = new Date(date);
                var year = date.getFullYear(),
                    month = date.getMonth(),
                    day = date.getDate();
                if (offset === 'next') {
                    if (month === 11) date = new Date(year + 1, 0);
                    else date = new Date(year, month + 1, 1);
                }
                if (offset === 'prev') {
                    if (month === 0) date = new Date(year - 1, 11);
                    else date = new Date(year, month - 1, 1);
                }
                if (offset === 'next' || offset === 'prev') {
                    month = date.getMonth();
                    year = date.getFullYear();
                }
                var daysInPrevMonth = p.daysInMonth(new Date(date.getFullYear(), date.getMonth()).getTime() - 10 * 24 * 60 * 60 * 1000),
                    daysInMonth = p.daysInMonth(date),
                    firstDayOfMonthIndex = new Date(date.getFullYear(), date.getMonth()).getDay();
                if (firstDayOfMonthIndex === 0) firstDayOfMonthIndex = 7;

                var dayDate, currentValues = [], i, j, k,
                    rows = 6, cols = 7,
                    monthHTML = '',
                    dayIndex = 0 + (p.params.firstDay - 1),
                    today = new Date().setHours(0, 0, 0, 0),
                    minDate = p.params.minDate ? new Date(p.params.minDate).getTime() : null,
                    maxDate = p.params.maxDate ? new Date(p.params.maxDate).getTime() : null,
                    disabled,
                    hasEvent;

                if (p.value && p.value.length) {
                    for (i = 0; i < p.value.length; i++) {
                        currentValues.push(new Date(p.value[i]).setHours(0, 0, 0, 0));
                    }
                }

                for (i = 1; i <= rows; i++) {
                    var rowHTML = '';
                    var row = i;
                    for (j = 1; j <= cols; j++) {
                        var col = j;
                        dayIndex++;
                        var dayNumber = dayIndex - firstDayOfMonthIndex;
                        var weekDayIndex = (col - 1 + p.params.firstDay > 6) ? (col - 1 - 7 + p.params.firstDay) : (col - 1 + p.params.firstDay);
                        var addClass = '';
                        if (dayNumber < 0) {
                            dayNumber = daysInPrevMonth + dayNumber + 1;
                            addClass += ' picker-calendar-day-prev';
                            dayDate = new Date(month - 1 < 0 ? year - 1 : year, month - 1 < 0 ? 11 : month - 1, dayNumber).getTime();
                        }
                        else {
                            dayNumber = dayNumber + 1;
                            if (dayNumber > daysInMonth) {
                                dayNumber = dayNumber - daysInMonth;
                                addClass += ' picker-calendar-day-next';
                                dayDate = new Date(month + 1 > 11 ? year + 1 : year, month + 1 > 11 ? 0 : month + 1, dayNumber).getTime();
                            }
                            else {
                                dayDate = new Date(year, month, dayNumber).getTime();
                            }
                        }
                        // Today
                        if (dayDate === today) addClass += ' picker-calendar-day-today';
                        // Selected
                        if (p.params.rangePicker && currentValues.length === 2) {
                            if (dayDate >= currentValues[0] && dayDate <= currentValues[1]) addClass += ' picker-calendar-day-selected';
                        }
                        else {
                            if (currentValues.indexOf(dayDate) >= 0) addClass += ' picker-calendar-day-selected';
                        }
                        // Weekend
                        if (p.params.weekendDays.indexOf(weekDayIndex) >= 0) {
                            addClass += ' picker-calendar-day-weekend';
                        }
                        // Has Events
                        hasEvent = false;
                        if (p.params.events) {
                            if (p.dateInRange(dayDate, p.params.events)) {
                                hasEvent = true;
                            }
                        }
                        if (hasEvent) {
                            addClass += ' picker-calendar-day-has-events';
                        }
                        // Custom Ranges
                        if (p.params.rangesClasses) {
                            for (k = 0; k < p.params.rangesClasses.length; k++) {
                                if (p.dateInRange(dayDate, p.params.rangesClasses[k].range)) {
                                    addClass += ' ' + p.params.rangesClasses[k].cssClass;
                                }
                            }
                        }
                        // Disabled
                        disabled = false;
                        if ((minDate && dayDate < minDate) || (maxDate && dayDate > maxDate)) {
                            disabled = true;
                        }
                        if (p.params.disabled) {
                            if (p.dateInRange(dayDate, p.params.disabled)) {
                                disabled = true;
                            }
                        }
                        if (disabled) {
                            addClass += ' picker-calendar-day-disabled';
                        }


                        dayDate = new Date(dayDate);
                        var dayYear = dayDate.getFullYear();
                        var dayMonth = dayDate.getMonth();
                        rowHTML += '<div data-year="' + dayYear + '" data-month="' + dayMonth + '" data-day="' + dayNumber + '" class="picker-calendar-day' + (addClass) + '" data-date="' + (dayYear + '-' + dayMonth + '-' + dayNumber) + '"><span>' + dayNumber + '</span></div>';
                    }
                    monthHTML += '<div class="picker-calendar-row">' + rowHTML + '</div>';
                }
                monthHTML = '<div class="picker-calendar-month" data-year="' + year + '" data-month="' + month + '">' + monthHTML + '</div>';
                return monthHTML;
            };
            p.animating = false;
            p.updateCurrentMonthYear = function (dir) {
                if (typeof dir === 'undefined') {
                    p.currentMonth = parseInt(p.months.eq(1).attr('data-month'), 10);
                    p.currentYear = parseInt(p.months.eq(1).attr('data-year'), 10);
                }
                else {
                    p.currentMonth = parseInt(p.months.eq(dir === 'next' ? (p.months.length - 1) : 0).attr('data-month'), 10);
                    p.currentYear = parseInt(p.months.eq(dir === 'next' ? (p.months.length - 1) : 0).attr('data-year'), 10);
                }
                p.container.find('.current-month-value').text(p.params.monthNames[p.currentMonth]);
                p.container.find('.current-year-value').text(p.currentYear);

            };
            p.onMonthChangeStart = function (dir) {
                p.updateCurrentMonthYear(dir);
                p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
                var currentIndex = dir === 'next' ? p.months.length - 1 : 0;

                p.months.eq(currentIndex).addClass('picker-calendar-month-current');
                p.months.eq(dir === 'next' ? currentIndex - 1 : currentIndex + 1).addClass(dir === 'next' ? 'picker-calendar-month-prev' : 'picker-calendar-month-next');

                if (p.params.onMonthYearChangeStart) {
                    p.params.onMonthYearChangeStart(p, p.currentYear, p.currentMonth);
                }
            };
            p.onMonthChangeEnd = function (dir, rebuildBoth) {
                p.animating = false;
                var nextMonthHTML, prevMonthHTML, newMonthHTML;
                p.wrapper.find('.picker-calendar-month:not(.picker-calendar-month-prev):not(.picker-calendar-month-current):not(.picker-calendar-month-next)').remove();

                if (typeof dir === 'undefined') {
                    dir = 'next';
                    rebuildBoth = true;
                }
                if (!rebuildBoth) {
                    newMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), dir);
                }
                else {
                    p.wrapper.find('.picker-calendar-month-next, .picker-calendar-month-prev').remove();
                    prevMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'prev');
                    nextMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'next');
                }
                if (dir === 'next' || rebuildBoth) {
                    p.wrapper.append(newMonthHTML || nextMonthHTML);
                }
                if (dir === 'prev' || rebuildBoth) {
                    p.wrapper.prepend(newMonthHTML || prevMonthHTML);
                }
                p.months = p.wrapper.find('.picker-calendar-month');
                p.setMonthsTranslate(p.monthsTranslate);
                if (p.params.onMonthAdd) {
                    p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
                }
                if (p.params.onMonthYearChangeEnd) {
                    p.params.onMonthYearChangeEnd(p, p.currentYear, p.currentMonth);
                }
            };
            p.setMonthsTranslate = function (translate) {
                translate = translate || p.monthsTranslate || 0;
                if (typeof p.monthsTranslate === 'undefined') p.monthsTranslate = translate;
                p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
                var prevMonthTranslate = -(translate + 1) * 100 * inverter;
                var currentMonthTranslate = -translate * 100 * inverter;
                var nextMonthTranslate = -(translate - 1) * 100 * inverter;
                p.months.eq(0).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
                p.months.eq(1).transform('translate3d(' + (p.isH ? currentMonthTranslate : 0) + '%, ' + (p.isH ? 0 : currentMonthTranslate) + '%, 0)').addClass('picker-calendar-month-current');
                p.months.eq(2).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
            };
            p.nextMonth = function (transition) {
                if (typeof transition === 'undefined' || typeof transition === 'object') {
                    transition = '';
                    if (!p.params.animate) transition = 0;
                }
                var nextMonth = parseInt(p.months.eq(p.months.length - 1).attr('data-month'), 10);
                var nextYear = parseInt(p.months.eq(p.months.length - 1).attr('data-year'), 10);
                var nextDate = new Date(nextYear, nextMonth);
                var nextDateTime = nextDate.getTime();
                var transitionEndCallback = p.animating ? false : true;
                if (p.params.maxDate) {
                    if (nextDateTime > new Date(p.params.maxDate).getTime()) {
                        return p.resetMonth();
                    }
                }
                p.monthsTranslate--;
                if (nextMonth === p.currentMonth) {
                    var nextMonthTranslate = -(p.monthsTranslate) * 100 * inverter;
                    var nextMonthHTML = F7$(p.monthHTML(nextDateTime, 'next')).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
                    p.wrapper.append(nextMonthHTML[0]);
                    p.months = p.wrapper.find('.picker-calendar-month');
                    if (p.params.onMonthAdd) {
                        p.params.onMonthAdd(p, p.months.eq(p.months.length - 1)[0]);
                    }
                }
                p.animating = true;
                p.onMonthChangeStart('next');
                var translate = (p.monthsTranslate * 100) * inverter;

                p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
                if (transitionEndCallback) {
                    p.wrapper.transitionEnd(function () {
                        p.onMonthChangeEnd('next');
                    });
                }
                if (!p.params.animate) {
                    p.onMonthChangeEnd('next');
                }
            };
            p.prevMonth = function (transition) {
                if (typeof transition === 'undefined' || typeof transition === 'object') {
                    transition = '';
                    if (!p.params.animate) transition = 0;
                }
                var prevMonth = parseInt(p.months.eq(0).attr('data-month'), 10);
                var prevYear = parseInt(p.months.eq(0).attr('data-year'), 10);
                var prevDate = new Date(prevYear, prevMonth + 1, -1);
                var prevDateTime = prevDate.getTime();
                var transitionEndCallback = p.animating ? false : true;
                if (p.params.minDate) {
                    if (prevDateTime < new Date(p.params.minDate).getTime()) {
                        return p.resetMonth();
                    }
                }
                p.monthsTranslate++;
                if (prevMonth === p.currentMonth) {
                    var prevMonthTranslate = -(p.monthsTranslate) * 100 * inverter;
                    var prevMonthHTML = F7$(p.monthHTML(prevDateTime, 'prev')).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
                    p.wrapper.prepend(prevMonthHTML[0]);
                    p.months = p.wrapper.find('.picker-calendar-month');
                    if (p.params.onMonthAdd) {
                        p.params.onMonthAdd(p, p.months.eq(0)[0]);
                    }
                }
                p.animating = true;
                p.onMonthChangeStart('prev');
                var translate = (p.monthsTranslate * 100) * inverter;
                p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
                if (transitionEndCallback) {
                    p.wrapper.transitionEnd(function () {
                        p.onMonthChangeEnd('prev');
                    });
                }
                if (!p.params.animate) {
                    p.onMonthChangeEnd('prev');
                }
            };
            p.resetMonth = function (transition) {
                if (typeof transition === 'undefined') transition = '';
                var translate = (p.monthsTranslate * 100) * inverter;
                p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
            };
            p.setYearMonth = function (year, month, transition) {
                if (typeof year === 'undefined') year = p.currentYear;
                if (typeof month === 'undefined') month = p.currentMonth;
                if (typeof transition === 'undefined' || typeof transition === 'object') {
                    transition = '';
                    if (!p.params.animate) transition = 0;
                }
                var targetDate;
                if (year < p.currentYear) {
                    targetDate = new Date(year, month + 1, -1).getTime();
                }
                else {
                    targetDate = new Date(year, month).getTime();
                }
                if (p.params.maxDate && targetDate > new Date(p.params.maxDate).getTime()) {
                    return false;
                }
                if (p.params.minDate && targetDate < new Date(p.params.minDate).getTime()) {
                    return false;
                }
                var currentDate = new Date(p.currentYear, p.currentMonth).getTime();
                var dir = targetDate > currentDate ? 'next' : 'prev';
                var newMonthHTML = p.monthHTML(new Date(year, month));
                p.monthsTranslate = p.monthsTranslate || 0;
                var prevTranslate = p.monthsTranslate;
                var monthTranslate, wrapperTranslate;
                var transitionEndCallback = p.animating ? false : true;
                if (targetDate > currentDate) {
                    // To next
                    p.monthsTranslate--;
                    if (!p.animating) p.months.eq(p.months.length - 1).remove();
                    p.wrapper.append(newMonthHTML);
                    p.months = p.wrapper.find('.picker-calendar-month');
                    monthTranslate = -(prevTranslate - 1) * 100 * inverter;
                    p.months.eq(p.months.length - 1).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
                }
                else {
                    // To prev
                    p.monthsTranslate++;
                    if (!p.animating) p.months.eq(0).remove();
                    p.wrapper.prepend(newMonthHTML);
                    p.months = p.wrapper.find('.picker-calendar-month');
                    monthTranslate = -(prevTranslate + 1) * 100 * inverter;
                    p.months.eq(0).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
                }
                if (p.params.onMonthAdd) {
                    p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
                }
                p.animating = true;
                p.onMonthChangeStart(dir);
                wrapperTranslate = (p.monthsTranslate * 100) * inverter;
                p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? wrapperTranslate : 0) + '%, ' + (p.isH ? 0 : wrapperTranslate) + '%, 0)');
                if (transitionEndCallback) {
                    p.wrapper.transitionEnd(function () {
                        p.onMonthChangeEnd(dir, true);
                    });
                }
                if (!p.params.animate) {
                    p.onMonthChangeEnd(dir);
                }
            };
            p.nextYear = function () {
                p.setYearMonth(p.currentYear + 1);
            };
            p.prevYear = function () {
                p.setYearMonth(p.currentYear - 1);
            };


            // HTML Layout
            p.layout = function () {
                var pickerHTML = '';
                var pickerClass = '';
                var i;

                var layoutDate = p.value && p.value.length ? p.value[0] : new Date().setHours(0, 0, 0, 0);
                var prevMonthHTML = p.monthHTML(layoutDate, 'prev');
                var currentMonthHTML = p.monthHTML(layoutDate);
                var nextMonthHTML = p.monthHTML(layoutDate, 'next');
                var monthsHTML = '<div class="picker-calendar-months"><div class="picker-calendar-months-wrapper">' + (prevMonthHTML + currentMonthHTML + nextMonthHTML) + '</div></div>';
                // Week days header
                var weekHeaderHTML = '';
                if (p.params.weekHeader) {
                    for (i = 0; i < 7; i++) {
                        var weekDayIndex = (i + p.params.firstDay > 6) ? (i - 7 + p.params.firstDay) : (i + p.params.firstDay);
                        var dayName = p.params.dayNamesShort[weekDayIndex];
                        weekHeaderHTML += '<div class="picker-calendar-week-day ' + ((p.params.weekendDays.indexOf(weekDayIndex) >= 0) ? 'picker-calendar-week-day-weekend' : '') + '"> ' + dayName + '</div>';

                    }
                    weekHeaderHTML = '<div class="picker-calendar-week-days">' + weekHeaderHTML + '</div>';
                }
                pickerClass = 'picker-modal picker-calendar' +
                    (p.params.rangePicker ? ' picker-calendar-range' : '') +
                    (p.params.cssClass ? ' ' + p.params.cssClass : '');
                var toolbarHTML = p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '';
                if (p.params.toolbar) {
                    toolbarHTML = p.params.toolbarTemplate
                        .replace(/{{closeText}}/g, p.params.toolbarCloseText)
                        .replace(/{{monthPicker}}/g, (p.params.monthPicker ? p.params.monthPickerTemplate : ''))
                        .replace(/{{yearPicker}}/g, (p.params.yearPicker ? p.params.yearPickerTemplate : ''));
                }
                var headerHTML = p.params.header ? p.params.headerTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText).replace(/{{placeholder}}/g, p.params.headerPlaceholder) : '';
                var footerHTML = p.params.footer ? p.params.footerTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '';

                pickerHTML =
                    '<div class="' + (pickerClass) + '">' +
                        headerHTML +
                        footerHTML +
                        toolbarHTML +
                        '<div class="picker-modal-inner">' +
                        weekHeaderHTML +
                        monthsHTML +
                        '</div>' +
                        '</div>';


                p.pickerHTML = pickerHTML;
            };

            // Input Events
            function openOnInput(e) {
                e.preventDefault();
                if (p.opened) return;
                p.open();
                if (p.params.scrollToInput && !isPopover() && !app.params.material) {
                    var pageContent = p.input.parents('.page-content');
                    if (pageContent.length === 0) return;

                    var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                        paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                        pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                        pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                        newPaddingBottom;

                    var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
                    if (inputTop > pageHeight) {
                        var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                        if (scrollTop + pageHeight > pageScrollHeight) {
                            newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                            if (pageHeight === pageScrollHeight) {
                                newPaddingBottom = p.container.height();
                            }
                            pageContent.css({'padding-bottom':(newPaddingBottom) + 'px'});
                        }
                        pageContent.scrollTop(scrollTop, 300);
                    }
                }
            }

            function closeOnHTMLClick(e) {
                
                console.log("closeOnHTMLClick");
                if (inPopover()) return;
                if (p.input && p.input.length > 0) {
                    console.log(F7$(e.target).parents('.picker-modal').length +" " + F7$(e.target).parents('.picker-modal'));
                    if (e.target !== p.input[0] && F7$(e.target).parents('.picker-modal').length === 0){
                        p.close();
                        
                    } 
                    console.log("closeOnHTMLClick 1");
                }
                else {
                    if (F7$(e.target).parents('.picker-modal').length === 0) p.close();
                    console.log("closeOnHTMLClick 2");
                }
            }

            if (p.params.input) {
                p.input = F7$(p.params.input);
                if (p.input.length > 0) {
                    if (p.params.inputReadOnly) p.input.prop('readOnly', true);
                    if (!p.inline) {
                        p.input.on('click', openOnInput);
                    }
                    if (p.params.inputReadOnly) {
                        p.input.on('focus mousedown', function (e) {
                            e.preventDefault();
                        });
                    }
                }

            }

            if (!p.inline && p.params.closeByOutsideClick) F7$('html').on('click', closeOnHTMLClick);

            // Open
            function onPickerClose() {
                console.log("onPickerClose");
                p.opened = false;
                if (p.input && p.input.length > 0) {
                    p.input.parents('.page-content').css({'padding-bottom':''});
                    if (app.params.material) p.input.trigger('blur');
                }
                if (p.params.onClose) p.params.onClose(p);

                // Destroy events
                p.destroyCalendarEvents();
            }

            p.opened = false;
            p.open = function () {
                var toPopover = isPopover();
                var updateValue = false;
                if (!p.opened) {
                    // Set date value
                    if (!p.value) {
                        if (p.params.value) {
                            p.value = p.params.value;
                            updateValue = true;
                        }
                    }

                    // Layout
                    p.layout();

                    // Append
                    if (toPopover) {
                        p.pickerHTML = '<div class="popover popover-picker-calendar"><div class="popover-inner">' + p.pickerHTML + '</div></div>';
                        p.popover = app.popover(p.pickerHTML, p.params.input, true);
                        p.container = F7$(p.popover).find('.picker-modal');
                        F7$(p.popover).on('close', function () {
                            onPickerClose();
                        });
                    }
                    else if (p.inline) {
                        p.container = F7$(p.pickerHTML);
                        p.container.addClass('picker-modal-inline');
                        F7$(p.params.container).append(p.container);
                    }
                    else {
                        p.container = F7$(p.pickerHTML);
//                        p.container.addClass('picker-modal-inline');
                        p.container = F7$(app.pickerModal(p.pickerHTML));
                        F7$(p.container)
                            .on('close', function () {
                                onPickerClose();
                            });

//                        document.getElementById('lampt').innerHTML = p.container[0].innerHTML;

                    }

                    // Store calendar instance
                    p.container[0].f7Calendar = p;
                    p.wrapper = p.container.find('.picker-calendar-months-wrapper');

                    // Months
                    p.months = p.wrapper.find('.picker-calendar-month');

                    // Update current month and year
                    p.updateCurrentMonthYear();

                    // Set initial translate
                    p.monthsTranslate = 0;
                    p.setMonthsTranslate();

                    // Init events
                    p.initCalendarEvents();

                    // Update input value
                    if (updateValue) p.updateValue();
                    else if (app.params.material && p.value) p.updateValue(true);

                    // Material Focus
                    if (p.input && p.input.length > 0 && app.params.material) {
                        p.input.trigger('focus');
                    }

                }

                // Set flag
                p.opened = true;
                p.initialized = true;
                if (p.params.onMonthAdd) {
                    p.months.each(function () {
                        p.params.onMonthAdd(p, this);
                    });
                }
                if (p.params.onOpen) p.params.onOpen(p);
            };

            // Close
            p.close = function () {
                console.log("close");
                if (!p.opened || p.inline) return;
                if (inPopover()) {
                    app.closeModal(p.popover);
                    return;
                }
                else {
                    app.closeModal(p.container);
                    return;
                }
            };

            // Destroy
            p.destroy = function () {
                p.close();
                if (p.params.input && p.input.length > 0) {
                    p.input.off('click focus', openOnInput);
                }
                F7$('html').off('click', closeOnHTMLClick);
            };

            if (p.inline) {
                p.open();
            }
            else {
                if (!p.initialized && p.params.value) p.setValue(p.params.value);
            }

            return p;
        };
        app.calendar = function (params) {
            return new Calendar(params);
        };


        /*=======================================
         ************   Plugins API   ************
         =======================================*/
        var _plugins = [];
        app.initPlugins = function () {
            // Initialize plugins
            for (var plugin in app.plugins) {
                var p = app.plugins[plugin](app, app.params[plugin]);
                if (p) _plugins.push(p);
            }
        };
        // Plugin Hooks
        app.pluginHook = function (hook) {
            for (var i = 0; i < _plugins.length; i++) {
                if (_plugins[i].hooks && hook in _plugins[i].hooks) {
                    _plugins[i].hooks[hook](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                }
            }
        };
        // Prevented by plugin
        app.pluginPrevent = function (action) {
            var prevent = false;
            for (var i = 0; i < _plugins.length; i++) {
                if (_plugins[i].prevents && action in _plugins[i].prevents) {
                    if (_plugins[i].prevents[action](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])) prevent = true;
                }
            }
            return prevent;
        };
        // Preprocess content by plugin
        app.pluginProcess = function (process, data) {
            var processed = data;
            for (var i = 0; i < _plugins.length; i++) {
                if (_plugins[i].preprocess && process in _plugins[i].preprocess) {
                    processed = _plugins[i].preprocess[process](data, arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                }
            }
            return processed;
        };
        //Swiper
        app.swiper = function (container, params) {
            return new Swiper(container, params);
        };
        app.initPageSwiper = function (pageContainer) {
            pageContainer = $(pageContainer);
            var swipers = pageContainer.find('.swiper-init, .tabs-swipeable-wrap');
            if (swipers.length === 0) return;
            function destroySwiperOnRemove(slider) {
                function destroySwiper() {
                    slider.destroy();
                    pageContainer.off('pageBeforeRemove', destroySwiper);
                }
                pageContainer.on('pageBeforeRemove', destroySwiper);
            }
            swipers.each(function () {
                var swiper = $(this);
                if (swiper.hasClass('tabs-swipeable-wrap')) {
                    swiper.addClass('swiper-container').children('.tabs').addClass('swiper-wrapper').children('.tab').addClass('swiper-slide');
                }
                var params;
                if (swiper.data('swiper')) {
                    params = JSON.parse(swiper.data('swiper'));
                }
                else {
                    params = swiper.dataset();
                }
                if (swiper.hasClass('tabs-swipeable-wrap')) {
                    params.onSlideChangeStart = function (s) {
                        app.showTab(s.slides.eq(s.activeIndex));
                    };
                }
                var _slider = app.swiper(swiper[0], params);
                destroySwiperOnRemove(_slider);
            });
        };
        app.reinitPageSwiper = function (pageContainer) {
            pageContainer = $(pageContainer);
            var sliders = pageContainer.find('.swiper-init, .tabs-swipeable-wrap');
            if (sliders.length === 0) return;
            for (var i = 0; i < sliders.length; i++) {
                var sliderInstance = sliders[0].swiper;
                if (sliderInstance) {
                    sliderInstance.update(true);
                }
            }
        };
        //end //Swiper
                

        /*======================================================
         ************   App Init   ************
         ======================================================*/
        app.init = function () {
            // Compile Template7 templates on app load
            if (app.initTemplate7Templates) app.initTemplate7Templates();

            // Init Plugins
            if (app.initPlugins) app.initPlugins();

            // Init Device
            if (app.getDeviceInfo) app.getDeviceInfo();

            // Init Click events
            if (app.initFastClicks && app.params.fastClicks) app.initFastClicks();
            if (app.initClickEvents) app.initClickEvents();

            // Init each page callbacks
            F7$('.page:not(.cached)').each(function () {
                app.initPageWithCallback(this);
            });

            // Init each navbar callbacks
            F7$('.navbar:not(.cached)').each(function () {
                app.initNavbarWithCallback(this);
            });

            // Init resize events
            if (app.initResize) app.initResize();

            // Init push state
            if (app.initPushState && app.params.pushState) app.initPushState();

            // Init Live Swipeouts events
            if (app.initSwipeout && app.params.swipeout) app.initSwipeout();

            // Init Live Sortable events
            if (app.initSortable && app.params.sortable) app.initSortable();

            // Init Live Swipe Panels
            if (app.initSwipePanels && (app.params.swipePanel || app.params.swipePanelOnlyClose)) app.initSwipePanels();

            // Init Material Inputs
            if (app.params.material && app.initMaterialWatchInputs) app.initMaterialWatchInputs();

            // App Init callback
            if (app.params.onAppInit) app.params.onAppInit();

            // Plugin app init hook
            app.pluginHook('appInit');
        };
        if (app.params.init) app.init();


        //Return instance
        return app;
    };


    /*===========================
     Dom7 Library
     ===========================*/
    var Dom7 = (function () {
        var Dom7 = function (arr) {
            var _this = this, i = 0;
            // Create array-like object
            for (i = 0; i < arr.length; i++) {
                _this[i] = arr[i];
            }
            _this.length = arr.length;
            // Return collection with methods
            return this;
        };
        var $ = function (selector, context) {
            var arr = [], i = 0;
            if (selector && !context) {
                if (selector instanceof Dom7) {
                    return selector;
                }
            }
            if (selector) {
                // String
                if (typeof selector === 'string') {
                    var els, tempParent, html = selector.trim();
                    if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
                        var toCreate = 'div';
                        if (html.indexOf('<li') === 0) toCreate = 'ul';
                        if (html.indexOf('<tr') === 0) toCreate = 'tbody';
                        if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
                        if (html.indexOf('<tbody') === 0) toCreate = 'table';
                        if (html.indexOf('<option') === 0) toCreate = 'select';
                        tempParent = document.createElement(toCreate);
                        tempParent.innerHTML = selector;
                        for (i = 0; i < tempParent.childNodes.length; i++) {
                            arr.push(tempParent.childNodes[i]);
                        }
                    }
                    else {
                        if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
                            // Pure ID selector
                            els = [document.getElementById(selector.split('#')[1])];
                        }
                        else {
                            // Other selectors
                            els = (context || document).querySelectorAll(selector);
                        }
                        for (i = 0; i < els.length; i++) {
                            if (els[i]) arr.push(els[i]);
                        }
                    }
                }
                // Node/element
                else if (selector.nodeType || selector === window || selector === document) {
                    arr.push(selector);
                }
                //Array of elements or instance of Dom
                else if (selector.length > 0 && selector[0].nodeType) {
                    for (i = 0; i < selector.length; i++) {
                        arr.push(selector[i]);
                    }
                }
            }
            return new Dom7(arr);
        };

        Dom7.prototype = {
            // Classes and attriutes
            addClass:function (className) {
                if (typeof className === 'undefined') {
                    return this;
                }
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        if (typeof this[j].classList !== 'undefined') this[j].classList.add(classes[i]);
                    }
                }
                return this;
            },
            removeClass:function (className) {
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        if (typeof this[j].classList !== 'undefined') this[j].classList.remove(classes[i]);
                    }
                }
                return this;
            },
            hasClass:function (className) {
                if (!this[0]) return false;
                else return this[0].classList.contains(className);
            },
            toggleClass:function (className) {
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        if (typeof this[j].classList !== 'undefined') this[j].classList.toggle(classes[i]);
                    }
                }
                return this;
            },
            attr:function (attrs, value) {
                if (arguments.length === 1 && typeof attrs === 'string') {
                    // Get attr
                    if (this[0]) return this[0].getAttribute(attrs);
                    else return undefined;
                }
                else {
                    // Set attrs
                    for (var i = 0; i < this.length; i++) {
                        if (arguments.length === 2) {
                            // String
                            this[i].setAttribute(attrs, value);
                        }
                        else {
                            // Object
                            for (var attrName in attrs) {
                                this[i][attrName] = attrs[attrName];
                                this[i].setAttribute(attrName, attrs[attrName]);
                            }
                        }
                    }
                    return this;
                }
            },
            removeAttr:function (attr) {
                for (var i = 0; i < this.length; i++) {
                    this[i].removeAttribute(attr);
                }
                return this;
            },
            prop:function (props, value) {
                if (arguments.length === 1 && typeof props === 'string') {
                    // Get prop
                    if (this[0]) return this[0][props];
                    else return undefined;
                }
                else {
                    // Set props
                    for (var i = 0; i < this.length; i++) {
                        if (arguments.length === 2) {
                            // String
                            this[i][props] = value;
                        }
                        else {
                            // Object
                            for (var propName in props) {
                                this[i][propName] = props[propName];
                            }
                        }
                    }
                    return this;
                }
            },
            data:function (key, value) {
                if (typeof value === 'undefined') {
                    // Get value
                    if (this[0]) {
                        if (this[0].dom7ElementDataStorage && (key in this[0].dom7ElementDataStorage)) {
                            return this[0].dom7ElementDataStorage[key];
                        }
                        else {
                            var dataKey = this[0].getAttribute('data-' + key);
                            if (dataKey) {
                                return dataKey;
                            }
                            else return undefined;
                        }
                    }
                    else return undefined;
                }
                else {
                    // Set value
                    for (var i = 0; i < this.length; i++) {
                        var el = this[i];
                        if (!el.dom7ElementDataStorage) el.dom7ElementDataStorage = {};
                        el.dom7ElementDataStorage[key] = value;
                    }
                    return this;
                }
            },
            removeData:function (key) {
                for (var i = 0; i < this.length; i++) {
                    var el = this[i];
                    if (el.dom7ElementDataStorage && el.dom7ElementDataStorage[key]) {
                        el.dom7ElementDataStorage[key] = null;
                        delete el.dom7ElementDataStorage[key];
                    }
                }
            },
            dataset:function () {
                var el = this[0];
                if (el) {
                    var dataset = {};
                    if (el.dataset) {
                        for (var dataKey in el.dataset) {
                            dataset[dataKey] = el.dataset[dataKey];
                        }
                    }
                    else {
                        for (var i = 0; i < el.attributes.length; i++) {
                            var attr = el.attributes[i];
                            if (attr.name.indexOf('data-') >= 0) {
                                dataset[$.toCamelCase(attr.name.split('data-')[1])] = attr.value;
                            }
                        }
                    }
                    for (var key in dataset) {
                        if (dataset[key] === 'false') dataset[key] = false;
                        else if (dataset[key] === 'true') dataset[key] = true;
                        else if (parseFloat(dataset[key]) === dataset[key] * 1) dataset[key] = dataset[key] * 1;
                    }
                    return dataset;
                }
                else return undefined;
            },
            val:function (value) {
                if (typeof value === 'undefined') {
                    if (this[0]) return this[0].value;
                    else return undefined;
                }
                else {
                    for (var i = 0; i < this.length; i++) {
                        this[i].value = value;
                    }
                    return this;
                }
            },
            // Transforms
            transform:function (transform) {
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
                }
                return this;
            },
            transition:function (duration) {
                if (typeof duration !== 'string') {
                    duration = duration + 'ms';
                }
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
                }
                return this;
            },
            //Events
            on:function (eventName, targetSelector, listener, capture) {
                function handleLiveEvent(e) {
                    var target = e.target;
                    if ($(target).is(targetSelector)) listener.call(target, e);
                    else {
                        var parents = $(target).parents();
                        for (var k = 0; k < parents.length; k++) {
                            if ($(parents[k]).is(targetSelector)) listener.call(parents[k], e);
                        }
                    }
                }

                var events = eventName.split(' ');
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (typeof targetSelector === 'function' || targetSelector === false) {
                        // Usual events
                        if (typeof targetSelector === 'function') {
                            listener = arguments[1];
                            capture = arguments[2] || false;
                        }
                        for (j = 0; j < events.length; j++) {
                            this[i].addEventListener(events[j], listener, capture);
                        }
                    }
                    else {
                        //Live events
                        for (j = 0; j < events.length; j++) {
                            if (!this[i].dom7LiveListeners) this[i].dom7LiveListeners = [];
                            this[i].dom7LiveListeners.push({listener:listener, liveListener:handleLiveEvent});
                            this[i].addEventListener(events[j], handleLiveEvent, capture);
                        }
                    }
                }

                return this;
            },
            off:function (eventName, targetSelector, listener, capture) {
                var events = eventName.split(' ');
                for (var i = 0; i < events.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        if (typeof targetSelector === 'function' || targetSelector === false) {
                            // Usual events
                            if (typeof targetSelector === 'function') {
                                listener = arguments[1];
                                capture = arguments[2] || false;
                            }
                            this[j].removeEventListener(events[i], listener, capture);
                        }
                        else {
                            // Live event
                            if (this[j].dom7LiveListeners) {
                                for (var k = 0; k < this[j].dom7LiveListeners.length; k++) {
                                    if (this[j].dom7LiveListeners[k].listener === listener) {
                                        this[j].removeEventListener(events[i], this[j].dom7LiveListeners[k].liveListener, capture);
                                    }
                                }
                            }
                        }
                    }
                }
                return this;
            },
            once:function (eventName, targetSelector, listener, capture) {
                var dom = this;
                if (typeof targetSelector === 'function') {
                    listener = arguments[1];
                    capture = arguments[2];
                    targetSelector = false;
                }
                function proxy(e) {
                    listener.call(e.target, e);
                    dom.off(eventName, targetSelector, proxy, capture);
                }

                return dom.on(eventName, targetSelector, proxy, capture);
            },
            trigger:function (eventName, eventData) {
                var events = eventName.split(' ');
                for (var i = 0; i < events.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        var evt;
                        try {
                            evt = new CustomEvent(events[i], {detail:eventData, bubbles:true, cancelable:true});
                        }
                        catch (e) {
                            evt = document.createEvent('Event');
                            evt.initEvent(events[i], true, true);
                            evt.detail = eventData;
                        }
                        this[j].dispatchEvent(evt);
                    }
                }
                return this;
            },
            transitionEnd:function (callback) {
                var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
                    i, j, dom = this;

                function fireCallBack(e) {
                    /*jshint validthis:true */
                    if (e.target !== this) return;
                    callback.call(this, e);
                    for (i = 0; i < events.length; i++) {
                        dom.off(events[i], fireCallBack);
                    }
                }

                if (callback) {
                    for (i = 0; i < events.length; i++) {
                        dom.on(events[i], fireCallBack);
                    }
                }
                return this;
            },
            animationEnd:function (callback) {
                var events = ['webkitAnimationEnd', 'OAnimationEnd', 'MSAnimationEnd', 'animationend'],
                    i, j, dom = this;

                function fireCallBack(e) {
                    callback(e);
                    for (i = 0; i < events.length; i++) {
                        dom.off(events[i], fireCallBack);
                    }
                }

                if (callback) {
                    for (i = 0; i < events.length; i++) {
                        dom.on(events[i], fireCallBack);
                    }
                }
                return this;
            },
            // Sizing/Styles
            width:function () {
                if (this[0] === window) {
                    return window.innerWidth;
                }
                else {
                    if (this.length > 0) {
                        return parseFloat(this.css('width'));
                    }
                    else {
                        return null;
                    }
                }
            },
            outerWidth:function (includeMargins) {
                if (this.length > 0) {
                    if (includeMargins) {
                        var styles = this.styles();
                        return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
                    }
                    else
                        return this[0].offsetWidth;
                }
                else return null;
            },
            height:function () {
                if (this[0] === window) {
                    return window.innerHeight;
                }
                else {
                    if (this.length > 0) {
                        return parseFloat(this.css('height'));
                    }
                    else {
                        return null;
                    }
                }
            },
            outerHeight:function (includeMargins) {
                if (this.length > 0) {
                    if (includeMargins) {
                        var styles = this.styles();
                        return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
                    }
                    else
                        return this[0].offsetHeight;
                }
                else return null;
            },
            offset:function () {
                if (this.length > 0) {
                    var el = this[0];
                    var box = el.getBoundingClientRect();
                    var body = document.body;
                    var clientTop = el.clientTop || body.clientTop || 0;
                    var clientLeft = el.clientLeft || body.clientLeft || 0;
                    var scrollTop = window.pageYOffset || el.scrollTop;
                    var scrollLeft = window.pageXOffset || el.scrollLeft;
                    return {
                        top:box.top + scrollTop - clientTop,
                        left:box.left + scrollLeft - clientLeft
                    };
                }
                else {
                    return null;
                }
            },
            hide:function () {
                for (var i = 0; i < this.length; i++) {
                    this[i].style.display = 'none';
                }
                return this;
            },
            show:function () {
                for (var i = 0; i < this.length; i++) {
                    this[i].style.display = 'block';
                }
                return this;
            },
            styles:function () {
                var i, styles;
                if (this[0]) return window.getComputedStyle(this[0], null);
                else return undefined;
            },
            css:function (props, value) {
                var i;
                if (arguments.length === 1) {
                    if (typeof props === 'string') {
                        if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
                    }
                    else {
                        for (i = 0; i < this.length; i++) {
                            for (var prop in props) {
                                this[i].style[prop] = props[prop];
                            }
                        }
                        return this;
                    }
                }
                if (arguments.length === 2 && typeof props === 'string') {
                    for (i = 0; i < this.length; i++) {
                        this[i].style[props] = value;
                    }
                    return this;
                }
                return this;
            },

            //Dom manipulation
            each:function (callback) {
                for (var i = 0; i < this.length; i++) {
                    callback.call(this[i], i, this[i]);
                }
                return this;
            },
            filter:function (callback) {
                var matchedItems = [];
                var dom = this;
                for (var i = 0; i < dom.length; i++) {
                    if (callback.call(dom[i], i, dom[i])) matchedItems.push(dom[i]);
                }
                return new Dom7(matchedItems);
            },
            html:function (html) {
                if (typeof html === 'undefined') {
                    return this[0] ? this[0].innerHTML : undefined;
                }
                else {
                    for (var i = 0; i < this.length; i++) {
                        this[i].innerHTML = html;
                    }
                    return this;
                }
            },
            text:function (text) {
                if (typeof text === 'undefined') {
                    if (this[0]) {
                        return this[0].textContent.trim();
                    }
                    else return null;
                }
                else {
                    for (var i = 0; i < this.length; i++) {
                        this[i].textContent = text;
                    }
                }
            },
            is:function (selector) {
                if (!this[0] || typeof selector === 'undefined') return false;
                var compareWith, i;
                if (typeof selector === 'string') {
                    var el = this[0];
                    if (el === document) return selector === document;
                    if (el === window) return selector === window;

                    if (el.matches) return el.matches(selector);
                    else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
                    else if (el.mozMatchesSelector) return el.mozMatchesSelector(selector);
                    else if (el.msMatchesSelector) return el.msMatchesSelector(selector);
                    else {
                        compareWith = $(selector);
                        for (i = 0; i < compareWith.length; i++) {
                            if (compareWith[i] === this[0]) return true;
                        }
                        return false;
                    }
                }
                else if (selector === document) return this[0] === document;
                else if (selector === window) return this[0] === window;
                else {
                    if (selector.nodeType || selector instanceof Dom7) {
                        compareWith = selector.nodeType ? [selector] : selector;
                        for (i = 0; i < compareWith.length; i++) {
                            if (compareWith[i] === this[0]) return true;
                        }
                        return false;
                    }
                    return false;
                }

            },
            indexOf:function (el) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] === el) return i;
                }
            },
            index:function () {
                if (this[0]) {
                    var child = this[0];
                    var i = 0;
                    while ((child = child.previousSibling) !== null) {
                        if (child.nodeType === 1) i++;
                    }
                    return i;
                }
                else return undefined;
            },
            eq:function (index) {
                if (typeof index === 'undefined') return this;
                var length = this.length;
                var returnIndex;
                if (index > length - 1) {
                    return new Dom7([]);
                }
                if (index < 0) {
                    returnIndex = length + index;
                    if (returnIndex < 0) return new Dom7([]);
                    else return new Dom7([this[returnIndex]]);
                }
                return new Dom7([this[index]]);
            },
            append:function (newChild) {
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (typeof newChild === 'string') {
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = newChild;
                        while (tempDiv.firstChild) {
                            this[i].appendChild(tempDiv.firstChild);
                        }
                    }
                    else if (newChild instanceof Dom7) {
                        for (j = 0; j < newChild.length; j++) {
                            this[i].appendChild(newChild[j]);
                        }
                    }
                    else {
                        this[i].appendChild(newChild);
                    }
                }
                return this;
            },
            appendTo:function (parent) {
                $(parent).append(this);
                return this;
            },
            prepend:function (newChild) {
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (typeof newChild === 'string') {
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = newChild;
                        for (j = tempDiv.childNodes.length - 1; j >= 0; j--) {
                            this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
                        }
                        // this[i].insertAdjacentHTML('afterbegin', newChild);
                    }
                    else if (newChild instanceof Dom7) {
                        for (j = 0; j < newChild.length; j++) {
                            this[i].insertBefore(newChild[j], this[i].childNodes[0]);
                        }
                    }
                    else {
                        this[i].insertBefore(newChild, this[i].childNodes[0]);
                    }
                }
                return this;
            },
            prependTo:function (parent) {
                $(parent).prepend(this);
                return this;
            },
            insertBefore:function (selector) {
                var before = $(selector);
                for (var i = 0; i < this.length; i++) {
                    if (before.length === 1) {
                        before[0].parentNode.insertBefore(this[i], before[0]);
                    }
                    else if (before.length > 1) {
                        for (var j = 0; j < before.length; j++) {
                            before[j].parentNode.insertBefore(this[i].cloneNode(true), before[j]);
                        }
                    }
                }
            },
            insertAfter:function (selector) {
                var after = $(selector);
                for (var i = 0; i < this.length; i++) {
                    if (after.length === 1) {
                        after[0].parentNode.insertBefore(this[i], after[0].nextSibling);
                    }
                    else if (after.length > 1) {
                        for (var j = 0; j < after.length; j++) {
                            after[j].parentNode.insertBefore(this[i].cloneNode(true), after[j].nextSibling);
                        }
                    }
                }
            },
            next:function (selector) {
                if (this.length > 0) {
                    if (selector) {
                        if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) return new Dom7([this[0].nextElementSibling]);
                        else return new Dom7([]);
                    }
                    else {
                        if (this[0].nextElementSibling) return new Dom7([this[0].nextElementSibling]);
                        else return new Dom7([]);
                    }
                }
                else return new Dom7([]);
            },
            nextAll:function (selector) {
                var nextEls = [];
                var el = this[0];
                if (!el) return new Dom7([]);
                while (el.nextElementSibling) {
                    var next = el.nextElementSibling;
                    if (selector) {
                        if ($(next).is(selector)) nextEls.push(next);
                    }
                    else nextEls.push(next);
                    el = next;
                }
                return new Dom7(nextEls);
            },
            prev:function (selector) {
                if (this.length > 0) {
                    if (selector) {
                        if (this[0].previousElementSibling && $(this[0].previousElementSibling).is(selector)) return new Dom7([this[0].previousElementSibling]);
                        else return new Dom7([]);
                    }
                    else {
                        if (this[0].previousElementSibling) return new Dom7([this[0].previousElementSibling]);
                        else return new Dom7([]);
                    }
                }
                else return new Dom7([]);
            },
            prevAll:function (selector) {
                var prevEls = [];
                var el = this[0];
                if (!el) return new Dom7([]);
                while (el.previousElementSibling) {
                    var prev = el.previousElementSibling;
                    if (selector) {
                        if ($(prev).is(selector)) prevEls.push(prev);
                    }
                    else prevEls.push(prev);
                    el = prev;
                }
                return new Dom7(prevEls);
            },
            parent:function (selector) {
                var parents = [];
                for (var i = 0; i < this.length; i++) {
                    if (this[i].parentNode !== null) {
                        if (selector) {
                            if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
                        }
                        else {
                            parents.push(this[i].parentNode);
                        }
                    }
                }
                return $($.unique(parents));
            },
            parents:function (selector) {
                var parents = [];
                for (var i = 0; i < this.length; i++) {
                    var parent = this[i].parentNode;
                    while (parent) {
                        if (selector) {
                            if ($(parent).is(selector)) parents.push(parent);
                        }
                        else {
                            parents.push(parent);
                        }
                        parent = parent.parentNode;
                    }
                }
                return $($.unique(parents));
            },
            find:function (selector) {
                var foundElements = [];
                for (var i = 0; i < this.length; i++) {
                    var found = this[i].querySelectorAll(selector);
                    for (var j = 0; j < found.length; j++) {
                        foundElements.push(found[j]);
                    }
                }
                return new Dom7(foundElements);
            },
            children:function (selector) {
                var children = [];
                for (var i = 0; i < this.length; i++) {
                    var childNodes = this[i].childNodes;

                    for (var j = 0; j < childNodes.length; j++) {
                        if (!selector) {
                            if (childNodes[j].nodeType === 1) children.push(childNodes[j]);
                        }
                        else {
                            if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) children.push(childNodes[j]);
                        }
                    }
                }
                return new Dom7($.unique(children));
            },
            remove:function () {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
                }
                return this;
            },
            detach:function () {
                return this.remove();
            },
            add:function () {
                var dom = this;
                var i, j;
                for (i = 0; i < arguments.length; i++) {
                    var toAdd = $(arguments[i]);
                    for (j = 0; j < toAdd.length; j++) {
                        dom[dom.length] = toAdd[j];
                        dom.length++;
                    }
                }
                return dom;
            }
        };

        // Shortcuts
        (function () {
            var shortcuts = ('click blur focus focusin focusout keyup keydown keypress submit change mousedown mousemove mouseup mouseenter mouseleave mouseout mouseover touchstart touchend touchmove resize scroll').split(' ');
            var notTrigger = ('resize scroll').split(' ');

            function createMethod(name) {
                Dom7.prototype[name] = function (targetSelector, listener, capture) {
                    var i;
                    if (typeof targetSelector === 'undefined') {
                        for (i = 0; i < this.length; i++) {
                            if (notTrigger.indexOf(name) < 0) {
                                if (name in this[i]) this[i][name]();
                                else {
                                    $(this[i]).trigger(name);
                                }
                            }
                        }
                        return this;
                    }
                    else {
                        return this.on(name, targetSelector, listener, capture);
                    }
                };
            }

            for (var i = 0; i < shortcuts.length; i++) {
                createMethod(shortcuts[i]);
            }
        })();


        // Global Ajax Setup
        //var globalAjaxOptions = {};
        // $.ajaxSetup = function (options) {
        //     if (options.type) options.method = options.type;
        //     $.each(options, function (optionName, optionValue) {
        //         globalAjaxOptions[optionName] = optionValue;
        //     });
        // };

        // // Ajax
        // var _jsonpRequests = 0;
        // $.ajax = function (options) {
        //     var defaults = {
        //         method:'GET',
        //         data:false,
        //         async:true,
        //         cache:true,
        //         user:'',
        //         password:'',
        //         headers:{},
        //         xhrFields:{},
        //         statusCode:{},
        //         processData:true,
        //         dataType:'text',
        //         contentType:'application/x-www-form-urlencoded',
        //         timeout:0
        //     };
        //     var callbacks = ['beforeSend', 'error', 'complete', 'success', 'statusCode'];


        //     //For jQuery guys
        //     if (options.type) options.method = options.type;

        //     // Merge global and defaults
        //     $.each(globalAjaxOptions, function (globalOptionName, globalOptionValue) {
        //         if (callbacks.indexOf(globalOptionName) < 0) defaults[globalOptionName] = globalOptionValue;
        //     });

        //     // Function to run XHR callbacks and events
        //     function fireAjaxCallback(eventName, eventData, callbackName) {
        //         var a = arguments;
        //         if (eventName) $(document).trigger(eventName, eventData);
        //         if (callbackName) {
        //             // Global callback
        //             if (callbackName in globalAjaxOptions) globalAjaxOptions[callbackName](a[3], a[4], a[5], a[6]);
        //             // Options callback
        //             if (options[callbackName]) options[callbackName](a[3], a[4], a[5], a[6]);
        //         }
        //     }

        //     // Merge options and defaults
        //     $.each(defaults, function (prop, defaultValue) {
        //         if (!(prop in options)) options[prop] = defaultValue;
        //     });

        //     // Default URL
        //     if (!options.url) {
        //         options.url = window.location.toString();
        //     }
        //     // Parameters Prefix
        //     var paramsPrefix = options.url.indexOf('?') >= 0 ? '&' : '?';

        //     // UC method
        //     var _method = options.method.toUpperCase();
        //     // Data to modify GET URL
        //     if ((_method === 'GET' || _method === 'HEAD' || _method === 'OPTIONS' || _method === 'DELETE') && options.data) {
        //         var stringData;
        //         if (typeof options.data === 'string') {
        //             // Should be key=value string
        //             if (options.data.indexOf('?') >= 0) stringData = options.data.split('?')[1];
        //             else stringData = options.data;
        //         }
        //         else {
        //             // Should be key=value object
        //             stringData = $.serializeObject(options.data);
        //         }
        //         if (stringData.length) {
        //             options.url += paramsPrefix + stringData;
        //             if (paramsPrefix === '?') paramsPrefix = '&';
        //         }
        //     }
        //     // JSONP
        //     if (options.dataType === 'json' && options.url.indexOf('callback=') >= 0) {

        //         var callbackName = 'f7jsonp_' + Date.now() + (_jsonpRequests++);
        //         var abortTimeout;
        //         var callbackSplit = options.url.split('callback=');
        //         var requestUrl = callbackSplit[0] + 'callback=' + callbackName;
        //         if (callbackSplit[1].indexOf('&') >= 0) {
        //             var addVars = callbackSplit[1].split('&').filter(
        //                 function (el) {
        //                     return el.indexOf('=') > 0;
        //                 }).join('&');
        //             if (addVars.length > 0) requestUrl += '&' + addVars;
        //         }

        //         // Create script
        //         var script = document.createElement('script');
        //         script.type = 'text/javascript';
        //         script.onerror = function () {
        //             clearTimeout(abortTimeout);
        //             fireAjaxCallback(undefined, undefined, 'error', null, 'scripterror');
        //         };
        //         script.src = requestUrl;

        //         // Handler
        //         window[callbackName] = function (data) {
        //             clearTimeout(abortTimeout);
        //             fireAjaxCallback(undefined, undefined, 'success', data);
        //             script.parentNode.removeChild(script);
        //             script = null;
        //             delete window[callbackName];
        //         };
        //         document.querySelector('head').appendChild(script);

        //         if (options.timeout > 0) {
        //             abortTimeout = setTimeout(function () {
        //                 script.parentNode.removeChild(script);
        //                 script = null;
        //                 fireAjaxCallback(undefined, undefined, 'error', null, 'timeout');
        //             }, options.timeout);
        //         }

        //         return;
        //     }

        //     // Cache for GET/HEAD requests
        //     if (_method === 'GET' || _method === 'HEAD' || _method === 'OPTIONS' || _method === 'DELETE') {
        //         if (options.cache === false) {
        //             options.url += (paramsPrefix + '_nocache=' + Date.now());
        //         }
        //     }

        //     // Create XHR
        //     var xhr = new XMLHttpRequest();

        //     // Save Request URL
        //     xhr.requestUrl = options.url;
        //     xhr.requestParameters = options;

        //     // Open XHR
        //     xhr.open(_method, options.url, options.async, options.user, options.password);

        //     // Create POST Data
        //     var postData = null;

        //     if ((_method === 'POST' || _method === 'PUT' || _method === 'PATCH') && options.data) {
        //         if (options.processData) {
        //             var postDataInstances = [ArrayBuffer, Blob, Document, FormData];
        //             // Post Data
        //             if (postDataInstances.indexOf(options.data.constructor) >= 0) {
        //                 postData = options.data;
        //             }
        //             else {
        //                 // POST Headers
        //                 var boundary = '---------------------------' + Date.now().toString(16);

        //                 if (options.contentType === 'multipart\/form-data') {
        //                     xhr.setRequestHeader('Content-Type', 'multipart\/form-data; boundary=' + boundary);
        //                 }
        //                 else {
        //                     xhr.setRequestHeader('Content-Type', options.contentType);
        //                 }
        //                 postData = '';
        //                 var _data = $.serializeObject(options.data);
        //                 if (options.contentType === 'multipart\/form-data') {
        //                     boundary = '---------------------------' + Date.now().toString(16);
        //                     _data = _data.split('&');
        //                     var _newData = [];
        //                     for (var i = 0; i < _data.length; i++) {
        //                         _newData.push('Content-Disposition: form-data; name="' + _data[i].split('=')[0] + '"\r\n\r\n' + _data[i].split('=')[1] + '\r\n');
        //                     }
        //                     postData = '--' + boundary + '\r\n' + _newData.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n';
        //                 }
        //                 else {
        //                     postData = options.contentType === 'application/x-www-form-urlencoded' ? _data : _data.replace(/&/g, '\r\n');
        //                 }
        //             }
        //         }
        //         else {
        //             postData = options.data;
        //         }

        //     }

        //     // Additional headers
        //     if (options.headers) {
        //         $.each(options.headers, function (headerName, headerCallback) {
        //             xhr.setRequestHeader(headerName, headerCallback);
        //         });
        //     }

        //     // Check for crossDomain
        //     if (typeof options.crossDomain === 'undefined') {
        //         options.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(options.url) && RegExp.$2 !== window.location.host;
        //     }

        //     if (!options.crossDomain) {
        //         xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        //     }

        //     if (options.xhrFields) {
        //         $.each(options.xhrFields, function (fieldName, fieldValue) {
        //             xhr[fieldName] = fieldValue;
        //         });
        //     }

        //     var xhrTimeout;
        //     // Handle XHR
        //     xhr.onload = function (e) {
        //         if (xhrTimeout) clearTimeout(xhrTimeout);
        //         if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
        //             var responseData;
        //             if (options.dataType === 'json') {
        //                 try {
        //                     responseData = JSON.parse(xhr.responseText);
        //                     fireAjaxCallback('ajaxSuccess', {xhr:xhr}, 'success', responseData, xhr.status, xhr);
        //                 }
        //                 catch (err) {
        //                     fireAjaxCallback('ajaxError', {xhr:xhr, parseerror:true}, 'error', xhr, 'parseerror');
        //                 }
        //             }
        //             else {
        //                 responseData = xhr.responseType === 'text' || xhr.responseType === '' ? xhr.responseText : xhr.response;
        //                 fireAjaxCallback('ajaxSuccess', {xhr:xhr}, 'success', responseData, xhr.status, xhr);
        //             }
        //         }
        //         else {
        //             fireAjaxCallback('ajaxError', {xhr:xhr}, 'error', xhr, xhr.status);
        //         }
        //         if (options.statusCode) {
        //             if (globalAjaxOptions.statusCode && globalAjaxOptions.statusCode[xhr.status]) globalAjaxOptions.statusCode[xhr.status](xhr);
        //             if (options.statusCode[xhr.status]) options.statusCode[xhr.status](xhr);
        //         }
        //         fireAjaxCallback('ajaxComplete', {xhr:xhr}, 'complete', xhr, xhr.status);
        //     };

        //     xhr.onerror = function (e) {
        //         if (xhrTimeout) clearTimeout(xhrTimeout);
        //         fireAjaxCallback('ajaxError', {xhr:xhr}, 'error', xhr, xhr.status);
        //     };

        //     // Ajax start callback
        //     fireAjaxCallback('ajaxStart', {xhr:xhr}, 'start', xhr);
        //     fireAjaxCallback(undefined, undefined, 'beforeSend', xhr);


        //     // Send XHR
        //     xhr.send(postData);

        //     // Timeout
        //     if (options.timeout > 0) {
        //         xhr.onabort = function () {
        //             if (xhrTimeout) clearTimeout(xhrTimeout);
        //         };
        //         xhrTimeout = setTimeout(function () {
        //             xhr.abort();
        //             fireAjaxCallback('ajaxError', {xhr:xhr, timeout:true}, 'error', xhr, 'timeout');
        //             fireAjaxCallback('ajaxComplete', {xhr:xhr, timeout:true}, 'complete', xhr, 'timeout');
        //         }, options.timeout);
        //     }

        //     // Return XHR object
        //     return xhr;
        // };
        // Shrotcuts
        // (function () {
        //     var methods = ('get post getJSON').split(' ');

        //     function createMethod(method) {
        //         $[method] = function (url, data, success) {
        //             return $.ajax({
        //                 url:url,
        //                 method:method === 'post' ? 'POST' : 'GET',
        //                 data:typeof data === 'function' ? undefined : data,
        //                 success:typeof data === 'function' ? data : success,
        //                 dataType:method === 'getJSON' ? 'json' : undefined
        //             });
        //         };
        //     }

        //     for (var i = 0; i < methods.length; i++) {
        //         createMethod(methods[i]);
        //     }
        // })();


        // DOM Library Utilites
        $.parseUrlQuery = function (url) {
            var query = {}, i, params, param;
            if (url.indexOf('?') >= 0) url = url.split('?')[1];
            else return query;
            params = url.split('&');
            for (i = 0; i < params.length; i++) {
                param = params[i].split('=');
                query[param[0]] = param[1];
            }
            return query;
        };
        $.isArray = function (arr) {
            if (Object.prototype.toString.apply(arr) === '[object Array]') return true;
            else return false;
        };
        $.each = function (obj, callback) {
            if (typeof obj !== 'object') return;
            if (!callback) return;
            var i, prop;
            if ($.isArray(obj) || obj instanceof Dom7) {
                // Array
                for (i = 0; i < obj.length; i++) {
                    callback(i, obj[i]);
                }
            }
            else {
                // Object
                for (prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        callback(prop, obj[prop]);
                    }
                }
            }
        };
        $.unique = function (arr) {
            var unique = [];
            for (var i = 0; i < arr.length; i++) {
                if (unique.indexOf(arr[i]) === -1) unique.push(arr[i]);
            }
            return unique;
        };
        $.serializeObject = $.param = function (obj, parents) {
            if (typeof obj === 'string') return obj;
            var resultArray = [];
            var separator = '&';
            parents = parents || [];
            var newParents;

            function var_name(name) {
                if (parents.length > 0) {
                    var _parents = '';
                    for (var j = 0; j < parents.length; j++) {
                        if (j === 0) _parents += parents[j];
                        else _parents += '[' + encodeURIComponent(parents[j]) + ']';
                    }
                    return _parents + '[' + encodeURIComponent(name) + ']';
                }
                else {
                    return encodeURIComponent(name);
                }
            }

            function var_value(value) {
                return encodeURIComponent(value);
            }

            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    var toPush;
                    if ($.isArray(obj[prop])) {
                        toPush = [];
                        for (var i = 0; i < obj[prop].length; i++) {
                            if (!$.isArray(obj[prop][i]) && typeof obj[prop][i] === 'object') {
                                newParents = parents.slice();
                                newParents.push(prop);
                                newParents.push(i + '');
                                toPush.push($.serializeObject(obj[prop][i], newParents));
                            }
                            else {
                                toPush.push(var_name(prop) + '[]=' + var_value(obj[prop][i]));
                            }

                        }
                        if (toPush.length > 0) resultArray.push(toPush.join(separator));
                    }
                    else if (typeof obj[prop] === 'object') {
                        // Object, convert to named array
                        newParents = parents.slice();
                        newParents.push(prop);
                        toPush = $.serializeObject(obj[prop], newParents);
                        if (toPush !== '') resultArray.push(toPush);
                    }
                    else if (typeof obj[prop] !== 'undefined' && obj[prop] !== '') {
                        // Should be string or plain value
                        resultArray.push(var_name(prop) + '=' + var_value(obj[prop]));
                    }
                }
            }
            return resultArray.join(separator);
        };
        $.toCamelCase = function (string) {
            return string.toLowerCase().replace(/-(.)/g, function (match, group1) {
                return group1.toUpperCase();
            });
        };
        $.dataset = function (el) {
            return $(el).dataset();
        };
        $.getTranslate = function (el, axis) {
            var matrix, curTransform, curStyle, transformMatrix;

            // automatic axis detection
            if (typeof axis === 'undefined') {
                axis = 'x';
            }

            curStyle = window.getComputedStyle(el, null);
            if (window.WebKitCSSMatrix) {
                curTransform = curStyle.transform || curStyle.webkitTransform;
                if (curTransform.split(',').length > 6) {
                    curTransform = curTransform.split(', ').map(
                        function (a) {
                            return a.replace(',', '.');
                        }).join(', ');
                }
                // Some old versions of Webkit choke when 'none' is passed; pass
                // empty string instead in this case
                transformMatrix = new WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
            }
            else {
                transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
                matrix = transformMatrix.toString().split(',');
            }

            if (axis === 'x') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m41;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[12]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[4]);
            }
            if (axis === 'y') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m42;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[13]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[5]);
            }

            return curTransform || 0;
        };

        $.requestAnimationFrame = function (callback) {
            if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
            else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
            else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
            else {
                return window.setTimeout(callback, 1000 / 60);
            }
        };
        $.cancelAnimationFrame = function (id) {
            if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
            else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
            else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
            else {
                return window.clearTimeout(id);
            }
        };
        $.supportTouch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);

        // Link to prototype
        $.fn = Dom7.prototype;

        // Plugins
        $.fn.scrollTo = function (left, top, duration, easing, callback) {
            if (arguments.length === 4 && typeof easing === 'function') {
                callback = easing;
                easing = undefined;
            }
            return this.each(function () {
                var el = this;
                var currentTop, currentLeft, maxTop, maxLeft, newTop, newLeft, scrollTop, scrollLeft;
                var animateTop = top > 0 || top === 0;
                var animateLeft = left > 0 || left === 0;
                if (typeof easing === 'undefined') {
                    easing = 'swing';
                }
                if (animateTop) {
                    currentTop = el.scrollTop;
                    if (!duration) {
                        el.scrollTop = top;
                    }
                }
                if (animateLeft) {
                    currentLeft = el.scrollLeft;
                    if (!duration) {
                        el.scrollLeft = left;
                    }
                }
                if (!duration) return;
                if (animateTop) {
                    maxTop = el.scrollHeight - el.offsetHeight;
                    newTop = Math.max(Math.min(top, maxTop), 0);
                }
                if (animateLeft) {
                    maxLeft = el.scrollWidth - el.offsetWidth;
                    newLeft = Math.max(Math.min(left, maxLeft), 0);
                }
                var startTime = null;
                if (animateTop && newTop === currentTop) animateTop = false;
                if (animateLeft && newLeft === currentLeft) animateLeft = false;
                function render(time) {
                    if (time === undefined) {
                        time = new Date().getTime();
                    }
                    if (startTime === null) {
                        startTime = time;
                    }
                    var doneLeft, doneTop, done;
                    var progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
                    var easeProgress = easing === 'linear' ? progress : (0.5 - Math.cos(progress * Math.PI) / 2);
                    if (animateTop) scrollTop = currentTop + (easeProgress * (newTop - currentTop));
                    if (animateLeft) scrollLeft = currentLeft + (easeProgress * (newLeft - currentLeft));
                    if (animateTop && newTop > currentTop && scrollTop >= newTop) {
                        el.scrollTop = newTop;
                        done = true;
                    }
                    if (animateTop && newTop < currentTop && scrollTop <= newTop) {
                        el.scrollTop = newTop;
                        done = true;
                    }

                    if (animateLeft && newLeft > currentLeft && scrollLeft >= newLeft) {
                        el.scrollLeft = newLeft;
                        done = true;
                    }
                    if (animateLeft && newLeft < currentLeft && scrollLeft <= newLeft) {
                        el.scrollLeft = newLeft;
                        done = true;
                    }

                    if (done) {
                        if (callback) callback();
                        return;
                    }
                    if (animateTop) el.scrollTop = scrollTop;
                    if (animateLeft) el.scrollLeft = scrollLeft;
                    $.requestAnimationFrame(render);
                }

                $.requestAnimationFrame(render);
            });
        };
        $.fn.scrollTop = function (top, duration, easing, callback) {
            if (arguments.length === 3 && typeof easing === 'function') {
                callback = easing;
                easing = undefined;
            }
            var dom = this;
            if (typeof top === 'undefined') {
                if (dom.length > 0) return dom[0].scrollTop;
                else return null;
            }
            return dom.scrollTo(undefined, top, duration, easing, callback);
        };
        $.fn.scrollLeft = function (left, duration, easing, callback) {
            if (arguments.length === 3 && typeof easing === 'function') {
                callback = easing;
                easing = undefined;
            }
            var dom = this;
            if (typeof left === 'undefined') {
                if (dom.length > 0) return dom[0].scrollLeft;
                else return null;
            }
            return dom.scrollTo(left, undefined, duration, easing, callback);
        };

        return $;
    })();

    // Export Dom7 to Framework7
    Framework7.$ = Dom7;

    // Export to local scope
    var $ = Dom7;

    // Export to Window
    window.Dom7 = Dom7;


    /*===========================
     Features Support Detection
     ===========================*/
    Framework7.prototype.support = (function () {
        var support = {
            touch:!!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)
        };

        // Export object
        return support;
    })();


    /*===========================
     Device/OS Detection
     ===========================*/
    Framework7.prototype.device = (function () {
        var device = {};
        var ua = navigator.userAgent;
        var $ = Dom7;

        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

        device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;

        // Android
        if (android) {
            device.os = 'android';
            device.osVersion = android[2];
            device.android = true;
            device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
        }
        if (ipad || iphone || ipod) {
            device.os = 'ios';
            device.ios = true;
        }
        // iOS
        if (iphone && !ipod) {
            device.osVersion = iphone[2].replace(/_/g, '.');
            device.iphone = true;
        }
        if (ipad) {
            device.osVersion = ipad[2].replace(/_/g, '.');
            device.ipad = true;
        }
        if (ipod) {
            device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
            device.iphone = true;
        }
        // iOS 8+ changed UA
        if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
            if (device.osVersion.split('.')[0] === '10') {
                device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
            }
        }

        // Webview
        device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

        // Minimal UI
        if (device.os && device.os === 'ios') {
            var osVersionArr = device.osVersion.split('.');
            device.minimalUi = !device.webView &&
                (ipod || iphone) &&
                (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
                $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
        }

        // Check for status bar and fullscreen app mode
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        device.statusBar = false;
        if (device.webView && (windowWidth * windowHeight === screen.width * screen.height)) {
            device.statusBar = true;
        }
        else {
            device.statusBar = false;
        }

        // Classes
        var classNames = [];

        // Pixel Ratio
        device.pixelRatio = window.devicePixelRatio || 1;
        classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
        if (device.pixelRatio >= 2) {
            classNames.push('retina');
        }

        // OS classes
        if (device.os) {
            classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
            if (device.os === 'ios') {
                var major = parseInt(device.osVersion.split('.')[0], 10);
                for (var i = major - 1; i >= 6; i--) {
                    classNames.push('ios-gt-' + i);
                }
            }

        }
        // Status bar classes
        if (device.statusBar) {
            classNames.push('with-statusbar-overlay');
        }
        else {
            $('html').removeClass('with-statusbar-overlay');
        }

        // Add html classes
        if (classNames.length > 0) $('html').addClass(classNames.join(' '));

        // Export object

        return device;
    })();


window.Swiper = function (container, params) {
    if (!(this instanceof Swiper)) return new Swiper(container, params);
    var defaults = {
        direction: 'horizontal',
        touchEventsTarget: 'container',
        initialSlide: 0,
        speed: 300,
        // autoplay
        autoplay: false,
        autoplayDisableOnInteraction: true,
        autoplayStopOnLast: false,
        // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
        iOSEdgeSwipeDetection: false,
        iOSEdgeSwipeThreshold: 20,
        // Free mode
        freeMode: false,
        freeModeMomentum: true,
        freeModeMomentumRatio: 1,
        freeModeMomentumBounce: true,
        freeModeMomentumBounceRatio: 1,
        freeModeSticky: false,
        freeModeMinimumVelocity: 0.02,
        // Autoheight
        autoHeight: false,
        // Set wrapper width
        setWrapperSize: false,
        // Virtual Translate
        virtualTranslate: false,
        // Effects
        effect: 'slide', // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
        coverflow: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows : true
        },
        flip: {
            slideShadows : true,
            limitRotation: true
        },
        cube: {
            slideShadows: true,
            shadow: true,
            shadowOffset: 20,
            shadowScale: 0.94
        },
        fade: {
            crossFade: false
        },
        // Parallax
        parallax: false,
        // Scrollbar
        scrollbar: null,
        scrollbarHide: true,
        scrollbarDraggable: false,
        scrollbarSnapOnRelease: false,
        // Keyboard Mousewheel
        keyboardControl: false,
        mousewheelControl: false,
        mousewheelReleaseOnEdges: false,
        mousewheelInvert: false,
        mousewheelForceToAxis: false,
        mousewheelSensitivity: 1,
        // Hash Navigation
        hashnav: false,
        // Breakpoints
        breakpoints: undefined,
        // Slides grid
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerColumnFill: 'column',
        slidesPerGroup: 1,
        centeredSlides: false,
        slidesOffsetBefore: 0, // in px
        slidesOffsetAfter: 0, // in px
        // Round length
        roundLengths: false,
        // Touches
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: 0.5,
        longSwipesMs: 300,
        followFinger: true,
        onlyExternal: false,
        threshold: 0,
        touchMoveStopPropagation: true,
        // Unique Navigation Elements
        uniqueNavElements: true,
        // Pagination
        pagination: null,
        paginationElement: 'span',
        paginationClickable: false,
        paginationHide: false,
        paginationBulletRender: null,
        paginationProgressRender: null,
        paginationFractionRender: null,
        paginationCustomRender: null,
        paginationType: 'bullets', // 'bullets' or 'progress' or 'fraction' or 'custom'
        // Resistance
        resistance: true,
        resistanceRatio: 0.85,
        // Next/prev buttons
        nextButton: null,
        prevButton: null,
        // Progress
        watchSlidesProgress: false,
        watchSlidesVisibility: false,
        // Cursor
        grabCursor: false,
        // Clicks
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        // Lazy Loading
        lazyLoading: false,
        lazyLoadingInPrevNext: false,
        lazyLoadingInPrevNextAmount: 1,
        lazyLoadingOnTransitionStart: false,
        // Images
        preloadImages: true,
        updateOnImagesReady: true,
        // loop
        loop: false,
        loopAdditionalSlides: 0,
        loopedSlides: null,
        // Control
        control: undefined,
        controlInverse: false,
        controlBy: 'slide', //or 'container'
        // Swiping/no swiping
        allowSwipeToPrev: true,
        allowSwipeToNext: true,
        swipeHandler: null, //'.swipe-handler',
        noSwiping: true,
        noSwipingClass: 'swiper-no-swiping',
        // NS
        slideClass: 'swiper-slide',
        slideActiveClass: 'swiper-slide-active',
        slideVisibleClass: 'swiper-slide-visible',
        slideDuplicateClass: 'swiper-slide-duplicate',
        slideNextClass: 'swiper-slide-next',
        slidePrevClass: 'swiper-slide-prev',
        wrapperClass: 'swiper-wrapper',
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active',
        buttonDisabledClass: 'swiper-button-disabled',
        paginationCurrentClass: 'swiper-pagination-current',
        paginationTotalClass: 'swiper-pagination-total',
        paginationHiddenClass: 'swiper-pagination-hidden',
        paginationProgressbarClass: 'swiper-pagination-progressbar',
        // Observer
        observer: false,
        observeParents: false,
        // Accessibility
        a11y: false,
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
        firstSlideMessage: 'This is the first slide',
        lastSlideMessage: 'This is the last slide',
        paginationBulletMessage: 'Go to slide {{index}}',
        // Callbacks
        runCallbacksOnInit: true
        /*
        Callbacks:
        onInit: function (swiper)
        onDestroy: function (swiper)
        onClick: function (swiper, e)
        onTap: function (swiper, e)
        onDoubleTap: function (swiper, e)
        onSliderMove: function (swiper, e)
        onSlideChangeStart: function (swiper)
        onSlideChangeEnd: function (swiper)
        onTransitionStart: function (swiper)
        onTransitionEnd: function (swiper)
        onImagesReady: function (swiper)
        onProgress: function (swiper, progress)
        onTouchStart: function (swiper, e)
        onTouchMove: function (swiper, e)
        onTouchMoveOpposite: function (swiper, e)
        onTouchEnd: function (swiper, e)
        onReachBeginning: function (swiper)
        onReachEnd: function (swiper)
        onSetTransition: function (swiper, duration)
        onSetTranslate: function (swiper, translate)
        onAutoplayStart: function (swiper)
        onAutoplayStop: function (swiper),
        onLazyImageLoad: function (swiper, slide, image)
        onLazyImageReady: function (swiper, slide, image)
        */
    
    };
    var initialVirtualTranslate = params && params.virtualTranslate;
    
    params = params || {};
    var originalParams = {};
    for (var param in params) {
        if (typeof params[param] === 'object' && params[param] !== null && !(params[param].nodeType || params[param] === window || params[param] === document || (typeof Dom7 !== 'undefined' && params[param] instanceof Dom7) || (typeof jQuery !== 'undefined' && params[param] instanceof jQuery))) {
            originalParams[param] = {};
            for (var deepParam in params[param]) {
                originalParams[param][deepParam] = params[param][deepParam];
            }
        }
        else {
            originalParams[param] = params[param];
        }
    }
    for (var def in defaults) {
        if (typeof params[def] === 'undefined') {
            params[def] = defaults[def];
        }
        else if (typeof params[def] === 'object') {
            for (var deepDef in defaults[def]) {
                if (typeof params[def][deepDef] === 'undefined') {
                    params[def][deepDef] = defaults[def][deepDef];
                }
            }
        }
    }
    
    // Swiper
    var s = this;
    
    // Params
    s.params = params;
    s.originalParams = originalParams;
    
    // Classname
    s.classNames = [];
    /*=========================
      Dom Library and plugins
      ===========================*/
    if (typeof $ !== 'undefined' && typeof Dom7 !== 'undefined'){
        $ = Dom7;
    }
    if (typeof $ === 'undefined') {
        if (typeof Dom7 === 'undefined') {
            $ = window.Dom7 || window.Zepto || window.jQuery;
        }
        else {
            $ = Dom7;
        }
        if (!$) return;
    }
    // Export it to Swiper instance
    s.$ = $;
    
    /*=========================
      Breakpoints
      ===========================*/
    s.currentBreakpoint = undefined;
    s.getActiveBreakpoint = function () {
        //Get breakpoint for window width
        if (!s.params.breakpoints) return false;
        var breakpoint = false;
        var points = [], point;
        for ( point in s.params.breakpoints ) {
            if (s.params.breakpoints.hasOwnProperty(point)) {
                points.push(point);
            }
        }
        points.sort(function (a, b) {
            return parseInt(a, 10) > parseInt(b, 10);
        });
        for (var i = 0; i < points.length; i++) {
            point = points[i];
            if (point >= window.innerWidth && !breakpoint) {
                breakpoint = point;
            }
        }
        return breakpoint || 'max';
    };
    s.setBreakpoint = function () {
        //Set breakpoint for window width and update parameters
        var breakpoint = s.getActiveBreakpoint();
        if (breakpoint && s.currentBreakpoint !== breakpoint) {
            var breakPointsParams = breakpoint in s.params.breakpoints ? s.params.breakpoints[breakpoint] : s.originalParams;
            var needsReLoop = s.params.loop && (breakPointsParams.slidesPerView !== s.params.slidesPerView);
            for ( var param in breakPointsParams ) {
                s.params[param] = breakPointsParams[param];
            }
            s.currentBreakpoint = breakpoint;
            if(needsReLoop && s.destroyLoop) {
                s.reLoop(true);
            }
        }
    };
    // Set breakpoint on load
    if (s.params.breakpoints) {
        s.setBreakpoint();
    }
    
    /*=========================
      Preparation - Define Container, Wrapper and Pagination
      ===========================*/
    s.container = $(container);
    if (s.container.length === 0) return;
    if (s.container.length > 1) {
        var swipers = [];
        s.container.each(function () {
            var container = this;
            swipers.push(new Swiper(this, params));
        });
        return swipers;
    }
    
    // Save instance in container HTML Element and in data
    s.container[0].swiper = s;
    s.container.data('swiper', s);
    
    s.classNames.push('swiper-container-' + s.params.direction);
    
    if (s.params.freeMode) {
        s.classNames.push('swiper-container-free-mode');
    }
    if (!s.support.flexbox) {
        s.classNames.push('swiper-container-no-flexbox');
        s.params.slidesPerColumn = 1;
    }
    if (s.params.autoHeight) {
        s.classNames.push('swiper-container-autoheight');
    }
    // Enable slides progress when required
    if (s.params.parallax || s.params.watchSlidesVisibility) {
        s.params.watchSlidesProgress = true;
    }
    // Coverflow / 3D
    if (['cube', 'coverflow', 'flip'].indexOf(s.params.effect) >= 0) {
        if (s.support.transforms3d) {
            s.params.watchSlidesProgress = true;
            s.classNames.push('swiper-container-3d');
        }
        else {
            s.params.effect = 'slide';
        }
    }
    if (s.params.effect !== 'slide') {
        s.classNames.push('swiper-container-' + s.params.effect);
    }
    if (s.params.effect === 'cube') {
        s.params.resistanceRatio = 0;
        s.params.slidesPerView = 1;
        s.params.slidesPerColumn = 1;
        s.params.slidesPerGroup = 1;
        s.params.centeredSlides = false;
        s.params.spaceBetween = 0;
        s.params.virtualTranslate = true;
        s.params.setWrapperSize = false;
    }
    if (s.params.effect === 'fade' || s.params.effect === 'flip') {
        s.params.slidesPerView = 1;
        s.params.slidesPerColumn = 1;
        s.params.slidesPerGroup = 1;
        s.params.watchSlidesProgress = true;
        s.params.spaceBetween = 0;
        s.params.setWrapperSize = false;
        if (typeof initialVirtualTranslate === 'undefined') {
            s.params.virtualTranslate = true;
        }
    }
    
    // Grab Cursor
    if (s.params.grabCursor && s.support.touch) {
        s.params.grabCursor = false;
    }
    
    // Wrapper
    s.wrapper = s.container.children('.' + s.params.wrapperClass);
    
    // Pagination
    if (s.params.pagination) {
        s.paginationContainer = $(s.params.pagination);
        if (s.params.uniqueNavElements && typeof s.params.pagination === 'string' && s.paginationContainer.length > 1 && s.container.find(s.params.pagination).length === 1) {
            s.paginationContainer = s.container.find(s.params.pagination);
        }
    
        if (s.params.paginationType === 'bullets' && s.params.paginationClickable) {
            s.paginationContainer.addClass('swiper-pagination-clickable');
        }
        else {
            s.params.paginationClickable = false;
        }
        s.paginationContainer.addClass('swiper-pagination-' + s.params.paginationType);
    }
    // Next/Prev Buttons
    if (s.params.nextButton || s.params.prevButton) {
        if (s.params.nextButton) {
            s.nextButton = $(s.params.nextButton);
            if (s.params.uniqueNavElements && typeof s.params.nextButton === 'string' && s.nextButton.length > 1 && s.container.find(s.params.nextButton).length === 1) {
                s.nextButton = s.container.find(s.params.nextButton);
            }
        }
        if (s.params.prevButton) {
            s.prevButton = $(s.params.prevButton);
            if (s.params.uniqueNavElements && typeof s.params.prevButton === 'string' && s.prevButton.length > 1 && s.container.find(s.params.prevButton).length === 1) {
                s.prevButton = s.container.find(s.params.prevButton);
            }
        }
    }
    
    // Is Horizontal
    s.isHorizontal = function () {
        return s.params.direction === 'horizontal';
    };
    // s.isH = isH;
    
    // RTL
    s.rtl = s.isHorizontal() && (s.container[0].dir.toLowerCase() === 'rtl' || s.container.css('direction') === 'rtl');
    if (s.rtl) {
        s.classNames.push('swiper-container-rtl');
    }
    
    // Wrong RTL support
    if (s.rtl) {
        s.wrongRTL = s.wrapper.css('display') === '-webkit-box';
    }
    
    // Columns
    if (s.params.slidesPerColumn > 1) {
        s.classNames.push('swiper-container-multirow');
    }
    
    // Check for Android
    if (s.device.android) {
        s.classNames.push('swiper-container-android');
    }
    
    // Add classes
    s.container.addClass(s.classNames.join(' '));
    
    // Translate
    s.translate = 0;
    
    // Progress
    s.progress = 0;
    
    // Velocity
    s.velocity = 0;
    
    /*=========================
      Locks, unlocks
      ===========================*/
    s.lockSwipeToNext = function () {
        s.params.allowSwipeToNext = false;
    };
    s.lockSwipeToPrev = function () {
        s.params.allowSwipeToPrev = false;
    };
    s.lockSwipes = function () {
        s.params.allowSwipeToNext = s.params.allowSwipeToPrev = false;
    };
    s.unlockSwipeToNext = function () {
        s.params.allowSwipeToNext = true;
    };
    s.unlockSwipeToPrev = function () {
        s.params.allowSwipeToPrev = true;
    };
    s.unlockSwipes = function () {
        s.params.allowSwipeToNext = s.params.allowSwipeToPrev = true;
    };
    
    /*=========================
      Round helper
      ===========================*/
    function round(a) {
        return Math.floor(a);
    }
    /*=========================
      Set grab cursor
      ===========================*/
    if (s.params.grabCursor) {
        s.container[0].style.cursor = 'move';
        s.container[0].style.cursor = '-webkit-grab';
        s.container[0].style.cursor = '-moz-grab';
        s.container[0].style.cursor = 'grab';
    }
    /*=========================
      Update on Images Ready
      ===========================*/
    s.imagesToLoad = [];
    s.imagesLoaded = 0;
    
    s.loadImage = function (imgElement, src, srcset, checkForComplete, callback) {
        var image;
        function onReady () {
            if (callback) callback();
        }
        if (!imgElement.complete || !checkForComplete) {
            if (src) {
                image = new window.Image();
                image.onload = onReady;
                image.onerror = onReady;
                if (srcset) {
                    image.srcset = srcset;
                }
                if (src) {
                    image.src = src;
                }
            } else {
                onReady();
            }
    
        } else {//image already loaded...
            onReady();
        }
    };
    s.preloadImages = function () {
        s.imagesToLoad = s.container.find('img');
        function _onReady() {
            if (typeof s === 'undefined' || s === null) return;
            if (s.imagesLoaded !== undefined) s.imagesLoaded++;
            if (s.imagesLoaded === s.imagesToLoad.length) {
                if (s.params.updateOnImagesReady) s.update();
                s.emit('onImagesReady', s);
            }
        }
        for (var i = 0; i < s.imagesToLoad.length; i++) {
            s.loadImage(s.imagesToLoad[i], (s.imagesToLoad[i].currentSrc || s.imagesToLoad[i].getAttribute('src')), (s.imagesToLoad[i].srcset || s.imagesToLoad[i].getAttribute('srcset')), true, _onReady);
        }
    };
    
    /*=========================
      Autoplay
      ===========================*/
    s.autoplayTimeoutId = undefined;
    s.autoplaying = false;
    s.autoplayPaused = false;
    function autoplay() {
        s.autoplayTimeoutId = setTimeout(function () {
            if (s.params.loop) {
                s.fixLoop();
                s._slideNext();
                s.emit('onAutoplay', s);
            }
            else {
                if (!s.isEnd) {
                    s._slideNext();
                    s.emit('onAutoplay', s);
                }
                else {
                    if (!params.autoplayStopOnLast) {
                        s._slideTo(0);
                        s.emit('onAutoplay', s);
                    }
                    else {
                        s.stopAutoplay();
                    }
                }
            }
        }, s.params.autoplay);
    }
    s.startAutoplay = function () {
        if (typeof s.autoplayTimeoutId !== 'undefined') return false;
        if (!s.params.autoplay) return false;
        if (s.autoplaying) return false;
        s.autoplaying = true;
        s.emit('onAutoplayStart', s);
        autoplay();
    };
    s.stopAutoplay = function (internal) {
        if (!s.autoplayTimeoutId) return;
        if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
        s.autoplaying = false;
        s.autoplayTimeoutId = undefined;
        s.emit('onAutoplayStop', s);
    };
    s.pauseAutoplay = function (speed) {
        if (s.autoplayPaused) return;
        if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
        s.autoplayPaused = true;
        if (speed === 0) {
            s.autoplayPaused = false;
            autoplay();
        }
        else {
            s.wrapper.transitionEnd(function () {
                if (!s) return;
                s.autoplayPaused = false;
                if (!s.autoplaying) {
                    s.stopAutoplay();
                }
                else {
                    autoplay();
                }
            });
        }
    };
    /*=========================
      Min/Max Translate
      ===========================*/
    s.minTranslate = function () {
        return (-s.snapGrid[0]);
    };
    s.maxTranslate = function () {
        return (-s.snapGrid[s.snapGrid.length - 1]);
    };
    /*=========================
      Slider/slides sizes
      ===========================*/
    s.updateAutoHeight = function () {
        // Update Height
        var slide = s.slides.eq(s.activeIndex)[0];
        if (typeof slide !== 'undefined') {
            var newHeight = slide.offsetHeight;
            if (newHeight) s.wrapper.css('height', newHeight + 'px');
        }
    };
    s.updateContainerSize = function () {
        var width, height;
        if (typeof s.params.width !== 'undefined') {
            width = s.params.width;
        }
        else {
            width = s.container[0].clientWidth;
        }
        if (typeof s.params.height !== 'undefined') {
            height = s.params.height;
        }
        else {
            height = s.container[0].clientHeight;
        }
        if (width === 0 && s.isHorizontal() || height === 0 && !s.isHorizontal()) {
            return;
        }
    
        //Subtract paddings
        width = width - parseInt(s.container.css('padding-left'), 10) - parseInt(s.container.css('padding-right'), 10);
        height = height - parseInt(s.container.css('padding-top'), 10) - parseInt(s.container.css('padding-bottom'), 10);
    
        // Store values
        s.width = width;
        s.height = height;
        s.size = s.isHorizontal() ? s.width : s.height;
    };
    
    s.updateSlidesSize = function () {
        s.slides = s.wrapper.children('.' + s.params.slideClass);
        s.snapGrid = [];
        s.slidesGrid = [];
        s.slidesSizesGrid = [];
    
        var spaceBetween = s.params.spaceBetween,
            slidePosition = -s.params.slidesOffsetBefore,
            i,
            prevSlideSize = 0,
            index = 0;
        if (typeof s.size === 'undefined') return;
        if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
            spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * s.size;
        }
    
        s.virtualSize = -spaceBetween;
        // reset margins
        if (s.rtl) s.slides.css({marginLeft: '', marginTop: ''});
        else s.slides.css({marginRight: '', marginBottom: ''});
    
        var slidesNumberEvenToRows;
        if (s.params.slidesPerColumn > 1) {
            if (Math.floor(s.slides.length / s.params.slidesPerColumn) === s.slides.length / s.params.slidesPerColumn) {
                slidesNumberEvenToRows = s.slides.length;
            }
            else {
                slidesNumberEvenToRows = Math.ceil(s.slides.length / s.params.slidesPerColumn) * s.params.slidesPerColumn;
            }
            if (s.params.slidesPerView !== 'auto' && s.params.slidesPerColumnFill === 'row') {
                slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, s.params.slidesPerView * s.params.slidesPerColumn);
            }
        }
    
        // Calc slides
        var slideSize;
        var slidesPerColumn = s.params.slidesPerColumn;
        var slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
        var numFullColumns = slidesPerRow - (s.params.slidesPerColumn * slidesPerRow - s.slides.length);
        for (i = 0; i < s.slides.length; i++) {
            slideSize = 0;
            var slide = s.slides.eq(i);
            if (s.params.slidesPerColumn > 1) {
                // Set slides order
                var newSlideOrderIndex;
                var column, row;
                if (s.params.slidesPerColumnFill === 'column') {
                    column = Math.floor(i / slidesPerColumn);
                    row = i - column * slidesPerColumn;
                    if (column > numFullColumns || (column === numFullColumns && row === slidesPerColumn-1)) {
                        if (++row >= slidesPerColumn) {
                            row = 0;
                            column++;
                        }
                    }
                    newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
                    slide
                        .css({
                            '-webkit-box-ordinal-group': newSlideOrderIndex,
                            '-moz-box-ordinal-group': newSlideOrderIndex,
                            '-ms-flex-order': newSlideOrderIndex,
                            '-webkit-order': newSlideOrderIndex,
                            'order': newSlideOrderIndex
                        });
                }
                else {
                    row = Math.floor(i / slidesPerRow);
                    column = i - row * slidesPerRow;
                }
                slide
                    .css({
                        'margin-top': (row !== 0 && s.params.spaceBetween) && (s.params.spaceBetween + 'px')
                    })
                    .attr('data-swiper-column', column)
                    .attr('data-swiper-row', row);
    
            }
            if (slide.css('display') === 'none') continue;
            if (s.params.slidesPerView === 'auto') {
                slideSize = s.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
                if (s.params.roundLengths) slideSize = round(slideSize);
            }
            else {
                slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView;
                if (s.params.roundLengths) slideSize = round(slideSize);
    
                if (s.isHorizontal()) {
                    s.slides[i].style.width = slideSize + 'px';
                }
                else {
                    s.slides[i].style.height = slideSize + 'px';
                }
            }
            s.slides[i].swiperSlideSize = slideSize;
            s.slidesSizesGrid.push(slideSize);
    
    
            if (s.params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (i === 0) slidePosition = slidePosition - s.size / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
                if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                s.slidesGrid.push(slidePosition);
            }
            else {
                if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                s.slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
    
            s.virtualSize += slideSize + spaceBetween;
    
            prevSlideSize = slideSize;
    
            index ++;
        }
        s.virtualSize = Math.max(s.virtualSize, s.size) + s.params.slidesOffsetAfter;
        var newSlidesGrid;
    
        if (
            s.rtl && s.wrongRTL && (s.params.effect === 'slide' || s.params.effect === 'coverflow')) {
            s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
        }
        if (!s.support.flexbox || s.params.setWrapperSize) {
            if (s.isHorizontal()) s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
            else s.wrapper.css({height: s.virtualSize + s.params.spaceBetween + 'px'});
        }
    
        if (s.params.slidesPerColumn > 1) {
            s.virtualSize = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows;
            s.virtualSize = Math.ceil(s.virtualSize / s.params.slidesPerColumn) - s.params.spaceBetween;
            s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
            if (s.params.centeredSlides) {
                newSlidesGrid = [];
                for (i = 0; i < s.snapGrid.length; i++) {
                    if (s.snapGrid[i] < s.virtualSize + s.snapGrid[0]) newSlidesGrid.push(s.snapGrid[i]);
                }
                s.snapGrid = newSlidesGrid;
            }
        }
    
        // Remove last grid elements depending on width
        if (!s.params.centeredSlides) {
            newSlidesGrid = [];
            for (i = 0; i < s.snapGrid.length; i++) {
                if (s.snapGrid[i] <= s.virtualSize - s.size) {
                    newSlidesGrid.push(s.snapGrid[i]);
                }
            }
            s.snapGrid = newSlidesGrid;
            if (Math.floor(s.virtualSize - s.size) - Math.floor(s.snapGrid[s.snapGrid.length - 1]) > 1) {
                s.snapGrid.push(s.virtualSize - s.size);
            }
        }
        if (s.snapGrid.length === 0) s.snapGrid = [0];
    
        if (s.params.spaceBetween !== 0) {
            if (s.isHorizontal()) {
                if (s.rtl) s.slides.css({marginLeft: spaceBetween + 'px'});
                else s.slides.css({marginRight: spaceBetween + 'px'});
            }
            else s.slides.css({marginBottom: spaceBetween + 'px'});
        }
        if (s.params.watchSlidesProgress) {
            s.updateSlidesOffset();
        }
    };
    s.updateSlidesOffset = function () {
        for (var i = 0; i < s.slides.length; i++) {
            s.slides[i].swiperSlideOffset = s.isHorizontal() ? s.slides[i].offsetLeft : s.slides[i].offsetTop;
        }
    };
    
    /*=========================
      Slider/slides progress
      ===========================*/
    s.updateSlidesProgress = function (translate) {
        if (typeof translate === 'undefined') {
            translate = s.translate || 0;
        }
        if (s.slides.length === 0) return;
        if (typeof s.slides[0].swiperSlideOffset === 'undefined') s.updateSlidesOffset();
    
        var offsetCenter = -translate;
        if (s.rtl) offsetCenter = translate;
    
        // Visible Slides
        s.slides.removeClass(s.params.slideVisibleClass);
        for (var i = 0; i < s.slides.length; i++) {
            var slide = s.slides[i];
            var slideProgress = (offsetCenter - slide.swiperSlideOffset) / (slide.swiperSlideSize + s.params.spaceBetween);
            if (s.params.watchSlidesVisibility) {
                var slideBefore = -(offsetCenter - slide.swiperSlideOffset);
                var slideAfter = slideBefore + s.slidesSizesGrid[i];
                var isVisible =
                    (slideBefore >= 0 && slideBefore < s.size) ||
                    (slideAfter > 0 && slideAfter <= s.size) ||
                    (slideBefore <= 0 && slideAfter >= s.size);
                if (isVisible) {
                    s.slides.eq(i).addClass(s.params.slideVisibleClass);
                }
            }
            slide.progress = s.rtl ? -slideProgress : slideProgress;
        }
    };
    s.updateProgress = function (translate) {
        if (typeof translate === 'undefined') {
            translate = s.translate || 0;
        }
        var translatesDiff = s.maxTranslate() - s.minTranslate();
        var wasBeginning = s.isBeginning;
        var wasEnd = s.isEnd;
        if (translatesDiff === 0) {
            s.progress = 0;
            s.isBeginning = s.isEnd = true;
        }
        else {
            s.progress = (translate - s.minTranslate()) / (translatesDiff);
            s.isBeginning = s.progress <= 0;
            s.isEnd = s.progress >= 1;
        }
        if (s.isBeginning && !wasBeginning) s.emit('onReachBeginning', s);
        if (s.isEnd && !wasEnd) s.emit('onReachEnd', s);
    
        if (s.params.watchSlidesProgress) s.updateSlidesProgress(translate);
        s.emit('onProgress', s, s.progress);
    };
    s.updateActiveIndex = function () {
        var translate = s.rtl ? s.translate : -s.translate;
        var newActiveIndex, i, snapIndex;
        for (i = 0; i < s.slidesGrid.length; i ++) {
            if (typeof s.slidesGrid[i + 1] !== 'undefined') {
                if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] - (s.slidesGrid[i + 1] - s.slidesGrid[i]) / 2) {
                    newActiveIndex = i;
                }
                else if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1]) {
                    newActiveIndex = i + 1;
                }
            }
            else {
                if (translate >= s.slidesGrid[i]) {
                    newActiveIndex = i;
                }
            }
        }
        // Normalize slideIndex
        if (newActiveIndex < 0 || typeof newActiveIndex === 'undefined') newActiveIndex = 0;
        // for (i = 0; i < s.slidesGrid.length; i++) {
            // if (- translate >= s.slidesGrid[i]) {
                // newActiveIndex = i;
            // }
        // }
        snapIndex = Math.floor(newActiveIndex / s.params.slidesPerGroup);
        if (snapIndex >= s.snapGrid.length) snapIndex = s.snapGrid.length - 1;
    
        if (newActiveIndex === s.activeIndex) {
            return;
        }
        s.snapIndex = snapIndex;
        s.previousIndex = s.activeIndex;
        s.activeIndex = newActiveIndex;
        s.updateClasses();
    };
    
    /*=========================
      Classes
      ===========================*/
    s.updateClasses = function () {
        s.slides.removeClass(s.params.slideActiveClass + ' ' + s.params.slideNextClass + ' ' + s.params.slidePrevClass);
        var activeSlide = s.slides.eq(s.activeIndex);
        // Active classes
        activeSlide.addClass(s.params.slideActiveClass);
        // Next Slide
        var nextSlide = activeSlide.next('.' + s.params.slideClass).addClass(s.params.slideNextClass);
        if (s.params.loop && nextSlide.length === 0) {
            s.slides.eq(0).addClass(s.params.slideNextClass);
        }
        // Prev Slide
        var prevSlide = activeSlide.prev('.' + s.params.slideClass).addClass(s.params.slidePrevClass);
        if (s.params.loop && prevSlide.length === 0) {
            s.slides.eq(-1).addClass(s.params.slidePrevClass);
        }
    
        // Pagination
        if (s.paginationContainer && s.paginationContainer.length > 0) {
            // Current/Total
            var current,
                total = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
            if (s.params.loop) {
                current = Math.ceil((s.activeIndex - s.loopedSlides)/s.params.slidesPerGroup);
                if (current > s.slides.length - 1 - s.loopedSlides * 2) {
                    current = current - (s.slides.length - s.loopedSlides * 2);
                }
                if (current > total - 1) current = current - total;
                if (current < 0 && s.params.paginationType !== 'bullets') current = total + current;
            }
            else {
                if (typeof s.snapIndex !== 'undefined') {
                    current = s.snapIndex;
                }
                else {
                    current = s.activeIndex || 0;
                }
            }
            // Types
            if (s.params.paginationType === 'bullets' && s.bullets && s.bullets.length > 0) {
                s.bullets.removeClass(s.params.bulletActiveClass);
                if (s.paginationContainer.length > 1) {
                    s.bullets.each(function () {
                        if ($(this).index() === current) $(this).addClass(s.params.bulletActiveClass);
                    });
                }
                else {
                    s.bullets.eq(current).addClass(s.params.bulletActiveClass);
                }
            }
            if (s.params.paginationType === 'fraction') {
                s.paginationContainer.find('.' + s.params.paginationCurrentClass).text(current + 1);
                s.paginationContainer.find('.' + s.params.paginationTotalClass).text(total);
            }
            if (s.params.paginationType === 'progress') {
                var scale = (current + 1) / total,
                    scaleX = scale,
                    scaleY = 1;
                if (!s.isHorizontal()) {
                    scaleY = scale;
                    scaleX = 1;
                }
                s.paginationContainer.find('.' + s.params.paginationProgressbarClass).transform('translate3d(0,0,0) scaleX(' + scaleX + ') scaleY(' + scaleY + ')').transition(s.params.speed);
            }
            if (s.params.paginationType === 'custom' && s.params.paginationCustomRender) {
                s.paginationContainer.html(s.params.paginationCustomRender(s, current + 1, total));
                s.emit('onPaginationRendered', s, s.paginationContainer[0]);
            }
        }
    
        // Next/active buttons
        if (!s.params.loop) {
            if (s.params.prevButton && s.prevButton && s.prevButton.length > 0) {
                if (s.isBeginning) {
                    s.prevButton.addClass(s.params.buttonDisabledClass);
                    if (s.params.a11y && s.a11y) s.a11y.disable(s.prevButton);
                }
                else {
                    s.prevButton.removeClass(s.params.buttonDisabledClass);
                    if (s.params.a11y && s.a11y) s.a11y.enable(s.prevButton);
                }
            }
            if (s.params.nextButton && s.nextButton && s.nextButton.length > 0) {
                if (s.isEnd) {
                    s.nextButton.addClass(s.params.buttonDisabledClass);
                    if (s.params.a11y && s.a11y) s.a11y.disable(s.nextButton);
                }
                else {
                    s.nextButton.removeClass(s.params.buttonDisabledClass);
                    if (s.params.a11y && s.a11y) s.a11y.enable(s.nextButton);
                }
            }
        }
    };
    
    /*=========================
      Pagination
      ===========================*/
    s.updatePagination = function () {
        if (!s.params.pagination) return;
        if (s.paginationContainer && s.paginationContainer.length > 0) {
            var paginationHTML = '';
            if (s.params.paginationType === 'bullets') {
                var numberOfBullets = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
                for (var i = 0; i < numberOfBullets; i++) {
                    if (s.params.paginationBulletRender) {
                        paginationHTML += s.params.paginationBulletRender(i, s.params.bulletClass);
                    }
                    else {
                        paginationHTML += '<' + s.params.paginationElement+' class="' + s.params.bulletClass + '"></' + s.params.paginationElement + '>';
                    }
                }
                s.paginationContainer.html(paginationHTML);
                s.bullets = s.paginationContainer.find('.' + s.params.bulletClass);
                if (s.params.paginationClickable && s.params.a11y && s.a11y) {
                    s.a11y.initPagination();
                }
            }
            if (s.params.paginationType === 'fraction') {
                if (s.params.paginationFractionRender) {
                    paginationHTML = s.params.paginationFractionRender(s, s.params.paginationCurrentClass, s.params.paginationTotalClass);
                }
                else {
                    paginationHTML =
                        '<span class="' + s.params.paginationCurrentClass + '"></span>' +
                        ' / ' +
                        '<span class="' + s.params.paginationTotalClass+'"></span>';
                }
                s.paginationContainer.html(paginationHTML);
            }
            if (s.params.paginationType === 'progress') {
                if (s.params.paginationProgressRender) {
                    paginationHTML = s.params.paginationProgressRender(s, s.params.paginationProgressbarClass);
                }
                else {
                    paginationHTML = '<span class="' + s.params.paginationProgressbarClass + '"></span>';
                }
                s.paginationContainer.html(paginationHTML);
            }
            if (s.params.paginationType !== 'custom') {
                s.emit('onPaginationRendered', s, s.paginationContainer[0]);
            }
        }
    };
    /*=========================
      Common update method
      ===========================*/
    s.update = function (updateTranslate) {
        s.updateContainerSize();
        s.updateSlidesSize();
        s.updateProgress();
        s.updatePagination();
        s.updateClasses();
        if (s.params.scrollbar && s.scrollbar) {
            s.scrollbar.set();
        }
        function forceSetTranslate() {
            newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
            s.setWrapperTranslate(newTranslate);
            s.updateActiveIndex();
            s.updateClasses();
        }
        if (updateTranslate) {
            var translated, newTranslate;
            if (s.controller && s.controller.spline) {
                s.controller.spline = undefined;
            }
            if (s.params.freeMode) {
                forceSetTranslate();
                if (s.params.autoHeight) {
                    s.updateAutoHeight();
                }
            }
            else {
                if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
                    translated = s.slideTo(s.slides.length - 1, 0, false, true);
                }
                else {
                    translated = s.slideTo(s.activeIndex, 0, false, true);
                }
                if (!translated) {
                    forceSetTranslate();
                }
            }
        }
        else if (s.params.autoHeight) {
            s.updateAutoHeight();
        }
    };
    
    /*=========================
      Resize Handler
      ===========================*/
    s.onResize = function (forceUpdatePagination) {
        //Breakpoints
        if (s.params.breakpoints) {
            s.setBreakpoint();
        }
    
        // Disable locks on resize
        var allowSwipeToPrev = s.params.allowSwipeToPrev;
        var allowSwipeToNext = s.params.allowSwipeToNext;
        s.params.allowSwipeToPrev = s.params.allowSwipeToNext = true;
    
        s.updateContainerSize();
        s.updateSlidesSize();
        if (s.params.slidesPerView === 'auto' || s.params.freeMode || forceUpdatePagination) s.updatePagination();
        if (s.params.scrollbar && s.scrollbar) {
            s.scrollbar.set();
        }
        if (s.controller && s.controller.spline) {
            s.controller.spline = undefined;
        }
        var slideChangedBySlideTo = false;
        if (s.params.freeMode) {
            var newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
            s.setWrapperTranslate(newTranslate);
            s.updateActiveIndex();
            s.updateClasses();
    
            if (s.params.autoHeight) {
                s.updateAutoHeight();
            }
        }
        else {
            s.updateClasses();
            if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
                slideChangedBySlideTo = s.slideTo(s.slides.length - 1, 0, false, true);
            }
            else {
                slideChangedBySlideTo = s.slideTo(s.activeIndex, 0, false, true);
            }
        }
        if (s.params.lazyLoading && !slideChangedBySlideTo && s.lazy) {
            s.lazy.load();
        }
        // Return locks after resize
        s.params.allowSwipeToPrev = allowSwipeToPrev;
        s.params.allowSwipeToNext = allowSwipeToNext;
    };
    
    /*=========================
      Events
      ===========================*/
    
    //Define Touch Events
    var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
    if (window.navigator.pointerEnabled) desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
    else if (window.navigator.msPointerEnabled) desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
    s.touchEvents = {
        start : s.support.touch || !s.params.simulateTouch  ? 'touchstart' : desktopEvents[0],
        move : s.support.touch || !s.params.simulateTouch ? 'touchmove' : desktopEvents[1],
        end : s.support.touch || !s.params.simulateTouch ? 'touchend' : desktopEvents[2]
    };
    
    
    // WP8 Touch Events Fix
    if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) {
        (s.params.touchEventsTarget === 'container' ? s.container : s.wrapper).addClass('swiper-wp8-' + s.params.direction);
    }
    
    // Attach/detach events
    s.initEvents = function (detach) {
        var actionDom = detach ? 'off' : 'on';
        var action = detach ? 'removeEventListener' : 'addEventListener';
        var touchEventsTarget = s.params.touchEventsTarget === 'container' ? s.container[0] : s.wrapper[0];
        var target = s.support.touch ? touchEventsTarget : document;
    
        var moveCapture = s.params.nested ? true : false;
    
        //Touch Events
        if (s.browser.ie) {
            touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
            target[action](s.touchEvents.move, s.onTouchMove, moveCapture);
            target[action](s.touchEvents.end, s.onTouchEnd, false);
        }
        else {
            if (s.support.touch) {
                touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
                touchEventsTarget[action](s.touchEvents.move, s.onTouchMove, moveCapture);
                touchEventsTarget[action](s.touchEvents.end, s.onTouchEnd, false);
            }
            if (params.simulateTouch && !s.device.ios && !s.device.android) {
                touchEventsTarget[action]('mousedown', s.onTouchStart, false);
                document[action]('mousemove', s.onTouchMove, moveCapture);
                document[action]('mouseup', s.onTouchEnd, false);
            }
        }
        window[action]('resize', s.onResize);
    
        // Next, Prev, Index
        if (s.params.nextButton && s.nextButton && s.nextButton.length > 0) {
            s.nextButton[actionDom]('click', s.onClickNext);
            if (s.params.a11y && s.a11y) s.nextButton[actionDom]('keydown', s.a11y.onEnterKey);
        }
        if (s.params.prevButton && s.prevButton && s.prevButton.length > 0) {
            s.prevButton[actionDom]('click', s.onClickPrev);
            if (s.params.a11y && s.a11y) s.prevButton[actionDom]('keydown', s.a11y.onEnterKey);
        }
        if (s.params.pagination && s.params.paginationClickable) {
            s.paginationContainer[actionDom]('click', '.' + s.params.bulletClass, s.onClickIndex);
            if (s.params.a11y && s.a11y) s.paginationContainer[actionDom]('keydown', '.' + s.params.bulletClass, s.a11y.onEnterKey);
        }
    
        // Prevent Links Clicks
        if (s.params.preventClicks || s.params.preventClicksPropagation) touchEventsTarget[action]('click', s.preventClicks, true);
    };
    s.attachEvents = function () {
        s.initEvents();
    };
    s.detachEvents = function () {
        s.initEvents(true);
    };
    
    /*=========================
      Handle Clicks
      ===========================*/
    // Prevent Clicks
    s.allowClick = true;
    s.preventClicks = function (e) {
        if (!s.allowClick) {
            if (s.params.preventClicks) e.preventDefault();
            if (s.params.preventClicksPropagation && s.animating) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    };
    // Clicks
    s.onClickNext = function (e) {
        e.preventDefault();
        if (s.isEnd && !s.params.loop) return;
        s.slideNext();
    };
    s.onClickPrev = function (e) {
        e.preventDefault();
        if (s.isBeginning && !s.params.loop) return;
        s.slidePrev();
    };
    s.onClickIndex = function (e) {
        e.preventDefault();
        var index = $(this).index() * s.params.slidesPerGroup;
        if (s.params.loop) index = index + s.loopedSlides;
        s.slideTo(index);
    };
    
    /*=========================
      Handle Touches
      ===========================*/
    function findElementInEvent(e, selector) {
        var el = $(e.target);
        if (!el.is(selector)) {
            if (typeof selector === 'string') {
                el = el.parents(selector);
            }
            else if (selector.nodeType) {
                var found;
                el.parents().each(function (index, _el) {
                    if (_el === selector) found = selector;
                });
                if (!found) return undefined;
                else return selector;
            }
        }
        if (el.length === 0) {
            return undefined;
        }
        return el[0];
    }
    s.updateClickedSlide = function (e) {
        var slide = findElementInEvent(e, '.' + s.params.slideClass);
        var slideFound = false;
        if (slide) {
            for (var i = 0; i < s.slides.length; i++) {
                if (s.slides[i] === slide) slideFound = true;
            }
        }
    
        if (slide && slideFound) {
            s.clickedSlide = slide;
            s.clickedIndex = $(slide).index();
        }
        else {
            s.clickedSlide = undefined;
            s.clickedIndex = undefined;
            return;
        }
        if (s.params.slideToClickedSlide && s.clickedIndex !== undefined && s.clickedIndex !== s.activeIndex) {
            var slideToIndex = s.clickedIndex,
                realIndex,
                duplicatedSlides;
            if (s.params.loop) {
                if (s.animating) return;
                realIndex = $(s.clickedSlide).attr('data-swiper-slide-index');
                if (s.params.centeredSlides) {
                    if ((slideToIndex < s.loopedSlides - s.params.slidesPerView/2) || (slideToIndex > s.slides.length - s.loopedSlides + s.params.slidesPerView/2)) {
                        s.fixLoop();
                        slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.swiper-slide-duplicate)').eq(0).index();
                        setTimeout(function () {
                            s.slideTo(slideToIndex);
                        }, 0);
                    }
                    else {
                        s.slideTo(slideToIndex);
                    }
                }
                else {
                    if (slideToIndex > s.slides.length - s.params.slidesPerView) {
                        s.fixLoop();
                        slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.swiper-slide-duplicate)').eq(0).index();
                        setTimeout(function () {
                            s.slideTo(slideToIndex);
                        }, 0);
                    }
                    else {
                        s.slideTo(slideToIndex);
                    }
                }
            }
            else {
                s.slideTo(slideToIndex);
            }
        }
    };
    
    var isTouched,
        isMoved,
        allowTouchCallbacks,
        touchStartTime,
        isScrolling,
        currentTranslate,
        startTranslate,
        allowThresholdMove,
        // Form elements to match
        formElements = 'input, select, textarea, button',
        // Last click time
        lastClickTime = Date.now(), clickTimeout,
        //Velocities
        velocities = [],
        allowMomentumBounce;
    
    // Animating Flag
    s.animating = false;
    
    // Touches information
    s.touches = {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
    };
    
    // Touch handlers
    var isTouchEvent, startMoving;
    s.onTouchStart = function (e) {
        if (e.originalEvent) e = e.originalEvent;
        isTouchEvent = e.type === 'touchstart';
        if (!isTouchEvent && 'which' in e && e.which === 3) return;
        if (s.params.noSwiping && findElementInEvent(e, '.' + s.params.noSwipingClass)) {
            s.allowClick = true;
            return;
        }
        if (s.params.swipeHandler) {
            if (!findElementInEvent(e, s.params.swipeHandler)) return;
        }
    
        var startX = s.touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
        var startY = s.touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
    
        // Do NOT start if iOS edge swipe is detected. Otherwise iOS app (UIWebView) cannot swipe-to-go-back anymore
        if(s.device.ios && s.params.iOSEdgeSwipeDetection && startX <= s.params.iOSEdgeSwipeThreshold) {
            return;
        }
    
        isTouched = true;
        isMoved = false;
        allowTouchCallbacks = true;
        isScrolling = undefined;
        startMoving = undefined;
        s.touches.startX = startX;
        s.touches.startY = startY;
        touchStartTime = Date.now();
        s.allowClick = true;
        s.updateContainerSize();
        s.swipeDirection = undefined;
        if (s.params.threshold > 0) allowThresholdMove = false;
        if (e.type !== 'touchstart') {
            var preventDefault = true;
            if ($(e.target).is(formElements)) preventDefault = false;
            if (document.activeElement && $(document.activeElement).is(formElements)) {
                document.activeElement.blur();
            }
            if (preventDefault) {
                e.preventDefault();
            }
        }
        s.emit('onTouchStart', s, e);
    };
    
    s.onTouchMove = function (e) {
        if (e.originalEvent) e = e.originalEvent;
        if (isTouchEvent && e.type === 'mousemove') return;
        if (e.preventedByNestedSwiper) {
            s.touches.startX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            s.touches.startY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            return;
        }
        if (s.params.onlyExternal) {
            // isMoved = true;
            s.allowClick = false;
            if (isTouched) {
                s.touches.startX = s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                s.touches.startY = s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                touchStartTime = Date.now();
            }
            return;
        }
        if (isTouchEvent && document.activeElement) {
            if (e.target === document.activeElement && $(e.target).is(formElements)) {
                isMoved = true;
                s.allowClick = false;
                return;
            }
        }
        if (allowTouchCallbacks) {
            s.emit('onTouchMove', s, e);
        }
        if (e.targetTouches && e.targetTouches.length > 1) return;
    
        s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
        s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
    
        if (typeof isScrolling === 'undefined') {
            var touchAngle = Math.atan2(Math.abs(s.touches.currentY - s.touches.startY), Math.abs(s.touches.currentX - s.touches.startX)) * 180 / Math.PI;
            isScrolling = s.isHorizontal() ? touchAngle > s.params.touchAngle : (90 - touchAngle > s.params.touchAngle);
        }
        if (isScrolling) {
            s.emit('onTouchMoveOpposite', s, e);
        }
        if (typeof startMoving === 'undefined' && s.browser.ieTouch) {
            if (s.touches.currentX !== s.touches.startX || s.touches.currentY !== s.touches.startY) {
                startMoving = true;
            }
        }
        if (!isTouched) return;
        if (isScrolling)  {
            isTouched = false;
            return;
        }
        if (!startMoving && s.browser.ieTouch) {
            return;
        }
        s.allowClick = false;
        s.emit('onSliderMove', s, e);
        e.preventDefault();
        if (s.params.touchMoveStopPropagation && !s.params.nested) {
            e.stopPropagation();
        }
    
        if (!isMoved) {
            if (params.loop) {
                s.fixLoop();
            }
            startTranslate = s.getWrapperTranslate();
            s.setWrapperTransition(0);
            if (s.animating) {
                s.wrapper.trigger('webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd');
            }
            if (s.params.autoplay && s.autoplaying) {
                if (s.params.autoplayDisableOnInteraction) {
                    s.stopAutoplay();
                }
                else {
                    s.pauseAutoplay();
                }
            }
            allowMomentumBounce = false;
            //Grab Cursor
            if (s.params.grabCursor) {
                s.container[0].style.cursor = 'move';
                s.container[0].style.cursor = '-webkit-grabbing';
                s.container[0].style.cursor = '-moz-grabbin';
                s.container[0].style.cursor = 'grabbing';
            }
        }
        isMoved = true;
    
        var diff = s.touches.diff = s.isHorizontal() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;
    
        diff = diff * s.params.touchRatio;
        if (s.rtl) diff = -diff;
    
        s.swipeDirection = diff > 0 ? 'prev' : 'next';
        currentTranslate = diff + startTranslate;
    
        var disableParentSwiper = true;
        if ((diff > 0 && currentTranslate > s.minTranslate())) {
            disableParentSwiper = false;
            if (s.params.resistance) currentTranslate = s.minTranslate() - 1 + Math.pow(-s.minTranslate() + startTranslate + diff, s.params.resistanceRatio);
        }
        else if (diff < 0 && currentTranslate < s.maxTranslate()) {
            disableParentSwiper = false;
            if (s.params.resistance) currentTranslate = s.maxTranslate() + 1 - Math.pow(s.maxTranslate() - startTranslate - diff, s.params.resistanceRatio);
        }
    
        if (disableParentSwiper) {
            e.preventedByNestedSwiper = true;
        }
    
        // Directions locks
        if (!s.params.allowSwipeToNext && s.swipeDirection === 'next' && currentTranslate < startTranslate) {
            currentTranslate = startTranslate;
        }
        if (!s.params.allowSwipeToPrev && s.swipeDirection === 'prev' && currentTranslate > startTranslate) {
            currentTranslate = startTranslate;
        }
    
        if (!s.params.followFinger) return;
    
        // Threshold
        if (s.params.threshold > 0) {
            if (Math.abs(diff) > s.params.threshold || allowThresholdMove) {
                if (!allowThresholdMove) {
                    allowThresholdMove = true;
                    s.touches.startX = s.touches.currentX;
                    s.touches.startY = s.touches.currentY;
                    currentTranslate = startTranslate;
                    s.touches.diff = s.isHorizontal() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;
                    return;
                }
            }
            else {
                currentTranslate = startTranslate;
                return;
            }
        }
        // Update active index in free mode
        if (s.params.freeMode || s.params.watchSlidesProgress) {
            s.updateActiveIndex();
        }
        if (s.params.freeMode) {
            //Velocity
            if (velocities.length === 0) {
                velocities.push({
                    position: s.touches[s.isHorizontal() ? 'startX' : 'startY'],
                    time: touchStartTime
                });
            }
            velocities.push({
                position: s.touches[s.isHorizontal() ? 'currentX' : 'currentY'],
                time: (new window.Date()).getTime()
            });
        }
        // Update progress
        s.updateProgress(currentTranslate);
        // Update translate
        s.setWrapperTranslate(currentTranslate);
    };
    s.onTouchEnd = function (e) {
        if (e.originalEvent) e = e.originalEvent;
        if (allowTouchCallbacks) {
            s.emit('onTouchEnd', s, e);
        }
        allowTouchCallbacks = false;
        if (!isTouched) return;
        //Return Grab Cursor
        if (s.params.grabCursor && isMoved && isTouched) {
            s.container[0].style.cursor = 'move';
            s.container[0].style.cursor = '-webkit-grab';
            s.container[0].style.cursor = '-moz-grab';
            s.container[0].style.cursor = 'grab';
        }
    
        // Time diff
        var touchEndTime = Date.now();
        var timeDiff = touchEndTime - touchStartTime;
    
        // Tap, doubleTap, Click
        if (s.allowClick) {
            s.updateClickedSlide(e);
            s.emit('onTap', s, e);
            if (timeDiff < 300 && (touchEndTime - lastClickTime) > 300) {
                if (clickTimeout) clearTimeout(clickTimeout);
                clickTimeout = setTimeout(function () {
                    if (!s) return;
                    if (s.params.paginationHide && s.paginationContainer.length > 0 && !$(e.target).hasClass(s.params.bulletClass)) {
                        s.paginationContainer.toggleClass(s.params.paginationHiddenClass);
                    }
                    s.emit('onClick', s, e);
                }, 300);
    
            }
            if (timeDiff < 300 && (touchEndTime - lastClickTime) < 300) {
                if (clickTimeout) clearTimeout(clickTimeout);
                s.emit('onDoubleTap', s, e);
            }
        }
    
        lastClickTime = Date.now();
        setTimeout(function () {
            if (s) s.allowClick = true;
        }, 0);
    
        if (!isTouched || !isMoved || !s.swipeDirection || s.touches.diff === 0 || currentTranslate === startTranslate) {
            isTouched = isMoved = false;
            return;
        }
        isTouched = isMoved = false;
    
        var currentPos;
        if (s.params.followFinger) {
            currentPos = s.rtl ? s.translate : -s.translate;
        }
        else {
            currentPos = -currentTranslate;
        }
        if (s.params.freeMode) {
            if (currentPos < -s.minTranslate()) {
                s.slideTo(s.activeIndex);
                return;
            }
            else if (currentPos > -s.maxTranslate()) {
                if (s.slides.length < s.snapGrid.length) {
                    s.slideTo(s.snapGrid.length - 1);
                }
                else {
                    s.slideTo(s.slides.length - 1);
                }
                return;
            }
    
            if (s.params.freeModeMomentum) {
                if (velocities.length > 1) {
                    var lastMoveEvent = velocities.pop(), velocityEvent = velocities.pop();
    
                    var distance = lastMoveEvent.position - velocityEvent.position;
                    var time = lastMoveEvent.time - velocityEvent.time;
                    s.velocity = distance / time;
                    s.velocity = s.velocity / 2;
                    if (Math.abs(s.velocity) < s.params.freeModeMinimumVelocity) {
                        s.velocity = 0;
                    }
                    // this implies that the user stopped moving a finger then released.
                    // There would be no events with distance zero, so the last event is stale.
                    if (time > 150 || (new window.Date().getTime() - lastMoveEvent.time) > 300) {
                        s.velocity = 0;
                    }
                } else {
                    s.velocity = 0;
                }
    
                velocities.length = 0;
                var momentumDuration = 1000 * s.params.freeModeMomentumRatio;
                var momentumDistance = s.velocity * momentumDuration;
    
                var newPosition = s.translate + momentumDistance;
                if (s.rtl) newPosition = - newPosition;
                var doBounce = false;
                var afterBouncePosition;
                var bounceAmount = Math.abs(s.velocity) * 20 * s.params.freeModeMomentumBounceRatio;
                if (newPosition < s.maxTranslate()) {
                    if (s.params.freeModeMomentumBounce) {
                        if (newPosition + s.maxTranslate() < -bounceAmount) {
                            newPosition = s.maxTranslate() - bounceAmount;
                        }
                        afterBouncePosition = s.maxTranslate();
                        doBounce = true;
                        allowMomentumBounce = true;
                    }
                    else {
                        newPosition = s.maxTranslate();
                    }
                }
                else if (newPosition > s.minTranslate()) {
                    if (s.params.freeModeMomentumBounce) {
                        if (newPosition - s.minTranslate() > bounceAmount) {
                            newPosition = s.minTranslate() + bounceAmount;
                        }
                        afterBouncePosition = s.minTranslate();
                        doBounce = true;
                        allowMomentumBounce = true;
                    }
                    else {
                        newPosition = s.minTranslate();
                    }
                }
                else if (s.params.freeModeSticky) {
                    var j = 0,
                        nextSlide;
                    for (j = 0; j < s.snapGrid.length; j += 1) {
                        if (s.snapGrid[j] > -newPosition) {
                            nextSlide = j;
                            break;
                        }
    
                    }
                    if (Math.abs(s.snapGrid[nextSlide] - newPosition) < Math.abs(s.snapGrid[nextSlide - 1] - newPosition) || s.swipeDirection === 'next') {
                        newPosition = s.snapGrid[nextSlide];
                    } else {
                        newPosition = s.snapGrid[nextSlide - 1];
                    }
                    if (!s.rtl) newPosition = - newPosition;
                }
                //Fix duration
                if (s.velocity !== 0) {
                    if (s.rtl) {
                        momentumDuration = Math.abs((-newPosition - s.translate) / s.velocity);
                    }
                    else {
                        momentumDuration = Math.abs((newPosition - s.translate) / s.velocity);
                    }
                }
                else if (s.params.freeModeSticky) {
                    s.slideReset();
                    return;
                }
    
                if (s.params.freeModeMomentumBounce && doBounce) {
                    s.updateProgress(afterBouncePosition);
                    s.setWrapperTransition(momentumDuration);
                    s.setWrapperTranslate(newPosition);
                    s.onTransitionStart();
                    s.animating = true;
                    s.wrapper.transitionEnd(function () {
                        if (!s || !allowMomentumBounce) return;
                        s.emit('onMomentumBounce', s);
    
                        s.setWrapperTransition(s.params.speed);
                        s.setWrapperTranslate(afterBouncePosition);
                        s.wrapper.transitionEnd(function () {
                            if (!s) return;
                            s.onTransitionEnd();
                        });
                    });
                } else if (s.velocity) {
                    s.updateProgress(newPosition);
                    s.setWrapperTransition(momentumDuration);
                    s.setWrapperTranslate(newPosition);
                    s.onTransitionStart();
                    if (!s.animating) {
                        s.animating = true;
                        s.wrapper.transitionEnd(function () {
                            if (!s) return;
                            s.onTransitionEnd();
                        });
                    }
    
                } else {
                    s.updateProgress(newPosition);
                }
    
                s.updateActiveIndex();
            }
            if (!s.params.freeModeMomentum || timeDiff >= s.params.longSwipesMs) {
                s.updateProgress();
                s.updateActiveIndex();
            }
            return;
        }
    
        // Find current slide
        var i, stopIndex = 0, groupSize = s.slidesSizesGrid[0];
        for (i = 0; i < s.slidesGrid.length; i += s.params.slidesPerGroup) {
            if (typeof s.slidesGrid[i + s.params.slidesPerGroup] !== 'undefined') {
                if (currentPos >= s.slidesGrid[i] && currentPos < s.slidesGrid[i + s.params.slidesPerGroup]) {
                    stopIndex = i;
                    groupSize = s.slidesGrid[i + s.params.slidesPerGroup] - s.slidesGrid[i];
                }
            }
            else {
                if (currentPos >= s.slidesGrid[i]) {
                    stopIndex = i;
                    groupSize = s.slidesGrid[s.slidesGrid.length - 1] - s.slidesGrid[s.slidesGrid.length - 2];
                }
            }
        }
    
        // Find current slide size
        var ratio = (currentPos - s.slidesGrid[stopIndex]) / groupSize;
    
        if (timeDiff > s.params.longSwipesMs) {
            // Long touches
            if (!s.params.longSwipes) {
                s.slideTo(s.activeIndex);
                return;
            }
            if (s.swipeDirection === 'next') {
                if (ratio >= s.params.longSwipesRatio) s.slideTo(stopIndex + s.params.slidesPerGroup);
                else s.slideTo(stopIndex);
    
            }
            if (s.swipeDirection === 'prev') {
                if (ratio > (1 - s.params.longSwipesRatio)) s.slideTo(stopIndex + s.params.slidesPerGroup);
                else s.slideTo(stopIndex);
            }
        }
        else {
            // Short swipes
            if (!s.params.shortSwipes) {
                s.slideTo(s.activeIndex);
                return;
            }
            if (s.swipeDirection === 'next') {
                s.slideTo(stopIndex + s.params.slidesPerGroup);
    
            }
            if (s.swipeDirection === 'prev') {
                s.slideTo(stopIndex);
            }
        }
    };
    /*=========================
      Transitions
      ===========================*/
    s._slideTo = function (slideIndex, speed) {
        return s.slideTo(slideIndex, speed, true, true);
    };
    s.slideTo = function (slideIndex, speed, runCallbacks, internal) {
        if (typeof runCallbacks === 'undefined') runCallbacks = true;
        if (typeof slideIndex === 'undefined') slideIndex = 0;
        if (slideIndex < 0) slideIndex = 0;
        s.snapIndex = Math.floor(slideIndex / s.params.slidesPerGroup);
        if (s.snapIndex >= s.snapGrid.length) s.snapIndex = s.snapGrid.length - 1;
    
        var translate = - s.snapGrid[s.snapIndex];
        // Stop autoplay
        if (s.params.autoplay && s.autoplaying) {
            if (internal || !s.params.autoplayDisableOnInteraction) {
                s.pauseAutoplay(speed);
            }
            else {
                s.stopAutoplay();
            }
        }
        // Update progress
        s.updateProgress(translate);
    
        // Normalize slideIndex
        for (var i = 0; i < s.slidesGrid.length; i++) {
            if (- Math.floor(translate * 100) >= Math.floor(s.slidesGrid[i] * 100)) {
                slideIndex = i;
            }
        }
    
        // Directions locks
        if (!s.params.allowSwipeToNext && translate < s.translate && translate < s.minTranslate()) {
            return false;
        }
        if (!s.params.allowSwipeToPrev && translate > s.translate && translate > s.maxTranslate()) {
            if ((s.activeIndex || 0) !== slideIndex ) return false;
        }
    
        // Update Index
        if (typeof speed === 'undefined') speed = s.params.speed;
        s.previousIndex = s.activeIndex || 0;
        s.activeIndex = slideIndex;
    
        if ((s.rtl && -translate === s.translate) || (!s.rtl && translate === s.translate)) {
            // Update Height
            if (s.params.autoHeight) {
                s.updateAutoHeight();
            }
            s.updateClasses();
            if (s.params.effect !== 'slide') {
                s.setWrapperTranslate(translate);
            }
            return false;
        }
        s.updateClasses();
        s.onTransitionStart(runCallbacks);
    
        if (speed === 0) {
            s.setWrapperTranslate(translate);
            s.setWrapperTransition(0);
            s.onTransitionEnd(runCallbacks);
        }
        else {
            s.setWrapperTranslate(translate);
            s.setWrapperTransition(speed);
            if (!s.animating) {
                s.animating = true;
                s.wrapper.transitionEnd(function () {
                    if (!s) return;
                    s.onTransitionEnd(runCallbacks);
                });
            }
    
        }
    
        return true;
    };
    
    s.onTransitionStart = function (runCallbacks) {
        if (typeof runCallbacks === 'undefined') runCallbacks = true;
        if (s.params.autoHeight) {
            s.updateAutoHeight();
        }
        if (s.lazy) s.lazy.onTransitionStart();
        if (runCallbacks) {
            s.emit('onTransitionStart', s);
            if (s.activeIndex !== s.previousIndex) {
                s.emit('onSlideChangeStart', s);
                if (s.activeIndex > s.previousIndex) {
                    s.emit('onSlideNextStart', s);
                }
                else {
                    s.emit('onSlidePrevStart', s);
                }
            }
    
        }
    };
    s.onTransitionEnd = function (runCallbacks) {
        s.animating = false;
        s.setWrapperTransition(0);
        if (typeof runCallbacks === 'undefined') runCallbacks = true;
        if (s.lazy) s.lazy.onTransitionEnd();
        if (runCallbacks) {
            s.emit('onTransitionEnd', s);
            if (s.activeIndex !== s.previousIndex) {
                s.emit('onSlideChangeEnd', s);
                if (s.activeIndex > s.previousIndex) {
                    s.emit('onSlideNextEnd', s);
                }
                else {
                    s.emit('onSlidePrevEnd', s);
                }
            }
        }
        if (s.params.hashnav && s.hashnav) {
            s.hashnav.setHash();
        }
    
    };
    s.slideNext = function (runCallbacks, speed, internal) {
        if (s.params.loop) {
            if (s.animating) return false;
            s.fixLoop();
            var clientLeft = s.container[0].clientLeft;
            return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
        }
        else return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
    };
    s._slideNext = function (speed) {
        return s.slideNext(true, speed, true);
    };
    s.slidePrev = function (runCallbacks, speed, internal) {
        if (s.params.loop) {
            if (s.animating) return false;
            s.fixLoop();
            var clientLeft = s.container[0].clientLeft;
            return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
        }
        else return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
    };
    s._slidePrev = function (speed) {
        return s.slidePrev(true, speed, true);
    };
    s.slideReset = function (runCallbacks, speed, internal) {
        return s.slideTo(s.activeIndex, speed, runCallbacks);
    };
    
    /*=========================
      Translate/transition helpers
      ===========================*/
    s.setWrapperTransition = function (duration, byController) {
        s.wrapper.transition(duration);
        if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
            s.effects[s.params.effect].setTransition(duration);
        }
        if (s.params.parallax && s.parallax) {
            s.parallax.setTransition(duration);
        }
        if (s.params.scrollbar && s.scrollbar) {
            s.scrollbar.setTransition(duration);
        }
        if (s.params.control && s.controller) {
            s.controller.setTransition(duration, byController);
        }
        s.emit('onSetTransition', s, duration);
    };
    s.setWrapperTranslate = function (translate, updateActiveIndex, byController) {
        var x = 0, y = 0, z = 0;
        if (s.isHorizontal()) {
            x = s.rtl ? -translate : translate;
        }
        else {
            y = translate;
        }
    
        if (s.params.roundLengths) {
            x = round(x);
            y = round(y);
        }
    
        if (!s.params.virtualTranslate) {
            if (s.support.transforms3d) s.wrapper.transform('translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
            else s.wrapper.transform('translate(' + x + 'px, ' + y + 'px)');
        }
    
        s.translate = s.isHorizontal() ? x : y;
    
        // Check if we need to update progress
        var progress;
        var translatesDiff = s.maxTranslate() - s.minTranslate();
        if (translatesDiff === 0) {
            progress = 0;
        }
        else {
            progress = (translate - s.minTranslate()) / (translatesDiff);
        }
        if (progress !== s.progress) {
            s.updateProgress(translate);
        }
    
        if (updateActiveIndex) s.updateActiveIndex();
        if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
            s.effects[s.params.effect].setTranslate(s.translate);
        }
        if (s.params.parallax && s.parallax) {
            s.parallax.setTranslate(s.translate);
        }
        if (s.params.scrollbar && s.scrollbar) {
            s.scrollbar.setTranslate(s.translate);
        }
        if (s.params.control && s.controller) {
            s.controller.setTranslate(s.translate, byController);
        }
        s.emit('onSetTranslate', s, s.translate);
    };
    
    s.getTranslate = function (el, axis) {
        var matrix, curTransform, curStyle, transformMatrix;
    
        // automatic axis detection
        if (typeof axis === 'undefined') {
            axis = 'x';
        }
    
        if (s.params.virtualTranslate) {
            return s.rtl ? -s.translate : s.translate;
        }
    
        curStyle = window.getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(',').length > 6) {
                curTransform = curTransform.split(', ').map(function(a){
                    return a.replace(',','.');
                }).join(', ');
            }
            // Some old versions of Webkit choke when 'none' is passed; pass
            // empty string instead in this case
            transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
        }
        else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
            matrix = transformMatrix.toString().split(',');
        }
    
        if (axis === 'x') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m41;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[12]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[4]);
        }
        if (axis === 'y') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m42;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[13]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[5]);
        }
        if (s.rtl && curTransform) curTransform = -curTransform;
        return curTransform || 0;
    };
    s.getWrapperTranslate = function (axis) {
        if (typeof axis === 'undefined') {
            axis = s.isHorizontal() ? 'x' : 'y';
        }
        return s.getTranslate(s.wrapper[0], axis);
    };
    
    /*=========================
      Observer
      ===========================*/
    s.observers = [];
    function initObserver(target, options) {
        options = options || {};
        // create an observer instance
        var ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
        var observer = new ObserverFunc(function (mutations) {
            mutations.forEach(function (mutation) {
                s.onResize(true);
                s.emit('onObserverUpdate', s, mutation);
            });
        });
    
        observer.observe(target, {
            attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
            childList: typeof options.childList === 'undefined' ? true : options.childList,
            characterData: typeof options.characterData === 'undefined' ? true : options.characterData
        });
    
        s.observers.push(observer);
    }
    s.initObservers = function () {
        if (s.params.observeParents) {
            var containerParents = s.container.parents();
            for (var i = 0; i < containerParents.length; i++) {
                initObserver(containerParents[i]);
            }
        }
    
        // Observe container
        initObserver(s.container[0], {childList: false});
    
        // Observe wrapper
        initObserver(s.wrapper[0], {attributes: false});
    };
    s.disconnectObservers = function () {
        for (var i = 0; i < s.observers.length; i++) {
            s.observers[i].disconnect();
        }
        s.observers = [];
    };
    /*=========================
      Loop
      ===========================*/
    // Create looped slides
    s.createLoop = function () {
        // Remove duplicated slides
        s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();
    
        var slides = s.wrapper.children('.' + s.params.slideClass);
    
        if(s.params.slidesPerView === 'auto' && !s.params.loopedSlides) s.params.loopedSlides = slides.length;
    
        s.loopedSlides = parseInt(s.params.loopedSlides || s.params.slidesPerView, 10);
        s.loopedSlides = s.loopedSlides + s.params.loopAdditionalSlides;
        if (s.loopedSlides > slides.length) {
            s.loopedSlides = slides.length;
        }
    
        var prependSlides = [], appendSlides = [], i;
        slides.each(function (index, el) {
            var slide = $(this);
            if (index < s.loopedSlides) appendSlides.push(el);
            if (index < slides.length && index >= slides.length - s.loopedSlides) prependSlides.push(el);
            slide.attr('data-swiper-slide-index', index);
        });
        for (i = 0; i < appendSlides.length; i++) {
            s.wrapper.append($(appendSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));
        }
        for (i = prependSlides.length - 1; i >= 0; i--) {
            s.wrapper.prepend($(prependSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));
        }
    };
    s.destroyLoop = function () {
        s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();
        s.slides.removeAttr('data-swiper-slide-index');
    };
    s.reLoop = function (updatePosition) {
        var oldIndex = s.activeIndex - s.loopedSlides;
        s.destroyLoop();
        s.createLoop();
        s.updateSlidesSize();
        if (updatePosition) {
            s.slideTo(oldIndex + s.loopedSlides, 0, false);
        }
    
    };
    s.fixLoop = function () {
        var newIndex;
        //Fix For Negative Oversliding
        if (s.activeIndex < s.loopedSlides) {
            newIndex = s.slides.length - s.loopedSlides * 3 + s.activeIndex;
            newIndex = newIndex + s.loopedSlides;
            s.slideTo(newIndex, 0, false, true);
        }
        //Fix For Positive Oversliding
        else if ((s.params.slidesPerView === 'auto' && s.activeIndex >= s.loopedSlides * 2) || (s.activeIndex > s.slides.length - s.params.slidesPerView * 2)) {
            newIndex = -s.slides.length + s.activeIndex + s.loopedSlides;
            newIndex = newIndex + s.loopedSlides;
            s.slideTo(newIndex, 0, false, true);
        }
    };
    /*=========================
      Append/Prepend/Remove Slides
      ===========================*/
    s.appendSlide = function (slides) {
        if (s.params.loop) {
            s.destroyLoop();
        }
        if (typeof slides === 'object' && slides.length) {
            for (var i = 0; i < slides.length; i++) {
                if (slides[i]) s.wrapper.append(slides[i]);
            }
        }
        else {
            s.wrapper.append(slides);
        }
        if (s.params.loop) {
            s.createLoop();
        }
        if (!(s.params.observer && s.support.observer)) {
            s.update(true);
        }
    };
    s.prependSlide = function (slides) {
        if (s.params.loop) {
            s.destroyLoop();
        }
        var newActiveIndex = s.activeIndex + 1;
        if (typeof slides === 'object' && slides.length) {
            for (var i = 0; i < slides.length; i++) {
                if (slides[i]) s.wrapper.prepend(slides[i]);
            }
            newActiveIndex = s.activeIndex + slides.length;
        }
        else {
            s.wrapper.prepend(slides);
        }
        if (s.params.loop) {
            s.createLoop();
        }
        if (!(s.params.observer && s.support.observer)) {
            s.update(true);
        }
        s.slideTo(newActiveIndex, 0, false);
    };
    s.removeSlide = function (slidesIndexes) {
        if (s.params.loop) {
            s.destroyLoop();
            s.slides = s.wrapper.children('.' + s.params.slideClass);
        }
        var newActiveIndex = s.activeIndex,
            indexToRemove;
        if (typeof slidesIndexes === 'object' && slidesIndexes.length) {
            for (var i = 0; i < slidesIndexes.length; i++) {
                indexToRemove = slidesIndexes[i];
                if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
                if (indexToRemove < newActiveIndex) newActiveIndex--;
            }
            newActiveIndex = Math.max(newActiveIndex, 0);
        }
        else {
            indexToRemove = slidesIndexes;
            if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
            if (indexToRemove < newActiveIndex) newActiveIndex--;
            newActiveIndex = Math.max(newActiveIndex, 0);
        }
    
        if (s.params.loop) {
            s.createLoop();
        }
    
        if (!(s.params.observer && s.support.observer)) {
            s.update(true);
        }
        if (s.params.loop) {
            s.slideTo(newActiveIndex + s.loopedSlides, 0, false);
        }
        else {
            s.slideTo(newActiveIndex, 0, false);
        }
    
    };
    s.removeAllSlides = function () {
        var slidesIndexes = [];
        for (var i = 0; i < s.slides.length; i++) {
            slidesIndexes.push(i);
        }
        s.removeSlide(slidesIndexes);
    };
    

    /*=========================
      Effects
      ===========================*/
    s.effects = {
        fade: {
            setTranslate: function () {
                for (var i = 0; i < s.slides.length; i++) {
                    var slide = s.slides.eq(i);
                    var offset = slide[0].swiperSlideOffset;
                    var tx = -offset;
                    if (!s.params.virtualTranslate) tx = tx - s.translate;
                    var ty = 0;
                    if (!s.isHorizontal()) {
                        ty = tx;
                        tx = 0;
                    }
                    var slideOpacity = s.params.fade.crossFade ?
                            Math.max(1 - Math.abs(slide[0].progress), 0) :
                            1 + Math.min(Math.max(slide[0].progress, -1), 0);
                    slide
                        .css({
                            opacity: slideOpacity
                        })
                        .transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px)');
    
                }
    
            },
            setTransition: function (duration) {
                s.slides.transition(duration);
                if (s.params.virtualTranslate && duration !== 0) {
                    var eventTriggered = false;
                    s.slides.transitionEnd(function () {
                        if (eventTriggered) return;
                        if (!s) return;
                        eventTriggered = true;
                        s.animating = false;
                        var triggerEvents = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
                        for (var i = 0; i < triggerEvents.length; i++) {
                            s.wrapper.trigger(triggerEvents[i]);
                        }
                    });
                }
            }
        },
        flip: {
            setTranslate: function () {
                for (var i = 0; i < s.slides.length; i++) {
                    var slide = s.slides.eq(i);
                    var progress = slide[0].progress;
                    if (s.params.flip.limitRotation) {
                        progress = Math.max(Math.min(slide[0].progress, 1), -1);
                    }
                    var offset = slide[0].swiperSlideOffset;
                    var rotate = -180 * progress,
                        rotateY = rotate,
                        rotateX = 0,
                        tx = -offset,
                        ty = 0;
                    if (!s.isHorizontal()) {
                        ty = tx;
                        tx = 0;
                        rotateX = -rotateY;
                        rotateY = 0;
                    }
                    else if (s.rtl) {
                        rotateY = -rotateY;
                    }
    
                    slide[0].style.zIndex = -Math.abs(Math.round(progress)) + s.slides.length;
    
                    if (s.params.flip.slideShadows) {
                        //Set shadows
                        var shadowBefore = s.isHorizontal() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                        var shadowAfter = s.isHorizontal() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                        if (shadowBefore.length === 0) {
                            shadowBefore = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'left' : 'top') + '"></div>');
                            slide.append(shadowBefore);
                        }
                        if (shadowAfter.length === 0) {
                            shadowAfter = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'right' : 'bottom') + '"></div>');
                            slide.append(shadowAfter);
                        }
                        if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
                        if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
                    }
    
                    slide
                        .transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)');
                }
            },
            setTransition: function (duration) {
                s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                if (s.params.virtualTranslate && duration !== 0) {
                    var eventTriggered = false;
                    s.slides.eq(s.activeIndex).transitionEnd(function () {
                        if (eventTriggered) return;
                        if (!s) return;
                        if (!$(this).hasClass(s.params.slideActiveClass)) return;
                        eventTriggered = true;
                        s.animating = false;
                        var triggerEvents = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
                        for (var i = 0; i < triggerEvents.length; i++) {
                            s.wrapper.trigger(triggerEvents[i]);
                        }
                    });
                }
            }
        },
        cube: {
            setTranslate: function () {
                var wrapperRotate = 0, cubeShadow;
                if (s.params.cube.shadow) {
                    if (s.isHorizontal()) {
                        cubeShadow = s.wrapper.find('.swiper-cube-shadow');
                        if (cubeShadow.length === 0) {
                            cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                            s.wrapper.append(cubeShadow);
                        }
                        cubeShadow.css({height: s.width + 'px'});
                    }
                    else {
                        cubeShadow = s.container.find('.swiper-cube-shadow');
                        if (cubeShadow.length === 0) {
                            cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                            s.container.append(cubeShadow);
                        }
                    }
                }
                for (var i = 0; i < s.slides.length; i++) {
                    var slide = s.slides.eq(i);
                    var slideAngle = i * 90;
                    var round = Math.floor(slideAngle / 360);
                    if (s.rtl) {
                        slideAngle = -slideAngle;
                        round = Math.floor(-slideAngle / 360);
                    }
                    var progress = Math.max(Math.min(slide[0].progress, 1), -1);
                    var tx = 0, ty = 0, tz = 0;
                    if (i % 4 === 0) {
                        tx = - round * 4 * s.size;
                        tz = 0;
                    }
                    else if ((i - 1) % 4 === 0) {
                        tx = 0;
                        tz = - round * 4 * s.size;
                    }
                    else if ((i - 2) % 4 === 0) {
                        tx = s.size + round * 4 * s.size;
                        tz = s.size;
                    }
                    else if ((i - 3) % 4 === 0) {
                        tx = - s.size;
                        tz = 3 * s.size + s.size * 4 * round;
                    }
                    if (s.rtl) {
                        tx = -tx;
                    }
    
                    if (!s.isHorizontal()) {
                        ty = tx;
                        tx = 0;
                    }
    
                    var transform = 'rotateX(' + (s.isHorizontal() ? 0 : -slideAngle) + 'deg) rotateY(' + (s.isHorizontal() ? slideAngle : 0) + 'deg) translate3d(' + tx + 'px, ' + ty + 'px, ' + tz + 'px)';
                    if (progress <= 1 && progress > -1) {
                        wrapperRotate = i * 90 + progress * 90;
                        if (s.rtl) wrapperRotate = -i * 90 - progress * 90;
                    }
                    slide.transform(transform);
                    if (s.params.cube.slideShadows) {
                        //Set shadows
                        var shadowBefore = s.isHorizontal() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                        var shadowAfter = s.isHorizontal() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                        if (shadowBefore.length === 0) {
                            shadowBefore = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'left' : 'top') + '"></div>');
                            slide.append(shadowBefore);
                        }
                        if (shadowAfter.length === 0) {
                            shadowAfter = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'right' : 'bottom') + '"></div>');
                            slide.append(shadowAfter);
                        }
                        if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
                        if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
                    }
                }
                s.wrapper.css({
                    '-webkit-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                    '-moz-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                    '-ms-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                    'transform-origin': '50% 50% -' + (s.size / 2) + 'px'
                });
    
                if (s.params.cube.shadow) {
                    if (s.isHorizontal()) {
                        cubeShadow.transform('translate3d(0px, ' + (s.width / 2 + s.params.cube.shadowOffset) + 'px, ' + (-s.width / 2) + 'px) rotateX(90deg) rotateZ(0deg) scale(' + (s.params.cube.shadowScale) + ')');
                    }
                    else {
                        var shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
                        var multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
                        var scale1 = s.params.cube.shadowScale,
                            scale2 = s.params.cube.shadowScale / multiplier,
                            offset = s.params.cube.shadowOffset;
                        cubeShadow.transform('scale3d(' + scale1 + ', 1, ' + scale2 + ') translate3d(0px, ' + (s.height / 2 + offset) + 'px, ' + (-s.height / 2 / scale2) + 'px) rotateX(-90deg)');
                    }
                }
                var zFactor = (s.isSafari || s.isUiWebView) ? (-s.size / 2) : 0;
                s.wrapper.transform('translate3d(0px,0,' + zFactor + 'px) rotateX(' + (s.isHorizontal() ? 0 : wrapperRotate) + 'deg) rotateY(' + (s.isHorizontal() ? -wrapperRotate : 0) + 'deg)');
            },
            setTransition: function (duration) {
                s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                if (s.params.cube.shadow && !s.isHorizontal()) {
                    s.container.find('.swiper-cube-shadow').transition(duration);
                }
            }
        },
        coverflow: {
            setTranslate: function () {
                var transform = s.translate;
                var center = s.isHorizontal() ? -transform + s.width / 2 : -transform + s.height / 2;
                var rotate = s.isHorizontal() ? s.params.coverflow.rotate: -s.params.coverflow.rotate;
                var translate = s.params.coverflow.depth;
                //Each slide offset from center
                for (var i = 0, length = s.slides.length; i < length; i++) {
                    var slide = s.slides.eq(i);
                    var slideSize = s.slidesSizesGrid[i];
                    var slideOffset = slide[0].swiperSlideOffset;
                    var offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * s.params.coverflow.modifier;
    
                    var rotateY = s.isHorizontal() ? rotate * offsetMultiplier : 0;
                    var rotateX = s.isHorizontal() ? 0 : rotate * offsetMultiplier;
                    // var rotateZ = 0
                    var translateZ = -translate * Math.abs(offsetMultiplier);
    
                    var translateY = s.isHorizontal() ? 0 : s.params.coverflow.stretch * (offsetMultiplier);
                    var translateX = s.isHorizontal() ? s.params.coverflow.stretch * (offsetMultiplier) : 0;
    
                    //Fix for ultra small values
                    if (Math.abs(translateX) < 0.001) translateX = 0;
                    if (Math.abs(translateY) < 0.001) translateY = 0;
                    if (Math.abs(translateZ) < 0.001) translateZ = 0;
                    if (Math.abs(rotateY) < 0.001) rotateY = 0;
                    if (Math.abs(rotateX) < 0.001) rotateX = 0;
    
                    var slideTransform = 'translate3d(' + translateX + 'px,' + translateY + 'px,' + translateZ + 'px)  rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    
                    slide.transform(slideTransform);
                    slide[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
                    if (s.params.coverflow.slideShadows) {
                        //Set shadows
                        var shadowBefore = s.isHorizontal() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                        var shadowAfter = s.isHorizontal() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                        if (shadowBefore.length === 0) {
                            shadowBefore = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'left' : 'top') + '"></div>');
                            slide.append(shadowBefore);
                        }
                        if (shadowAfter.length === 0) {
                            shadowAfter = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'right' : 'bottom') + '"></div>');
                            slide.append(shadowAfter);
                        }
                        if (shadowBefore.length) shadowBefore[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
                        if (shadowAfter.length) shadowAfter[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
                    }
                }
    
                //Set correct perspective for IE10
                if (s.browser.ie) {
                    var ws = s.wrapper[0].style;
                    ws.perspectiveOrigin = center + 'px 50%';
                }
            },
            setTransition: function (duration) {
                s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
            }
        }
    };

    /*=========================
      Images Lazy Loading
      ===========================*/
    s.lazy = {
        initialImageLoaded: false,
        loadImageInSlide: function (index, loadInDuplicate) {
            if (typeof index === 'undefined') return;
            if (typeof loadInDuplicate === 'undefined') loadInDuplicate = true;
            if (s.slides.length === 0) return;
    
            var slide = s.slides.eq(index);
            var img = slide.find('.swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)');
            if (slide.hasClass('swiper-lazy') && !slide.hasClass('swiper-lazy-loaded') && !slide.hasClass('swiper-lazy-loading')) {
                img = img.add(slide[0]);
            }
            if (img.length === 0) return;
    
            img.each(function () {
                var _img = $(this);
                _img.addClass('swiper-lazy-loading');
                var background = _img.attr('data-background');
                var src = _img.attr('data-src'),
                    srcset = _img.attr('data-srcset');
                s.loadImage(_img[0], (src || background), srcset, false, function () {
                    if (background) {
                        _img.css('background-image', 'url("' + background + '")');
                        _img.removeAttr('data-background');
                    }
                    else {
                        if (srcset) {
                            _img.attr('srcset', srcset);
                            _img.removeAttr('data-srcset');
                        }
                        if (src) {
                            _img.attr('src', src);
                            _img.removeAttr('data-src');
                        }
    
                    }
    
                    _img.addClass('swiper-lazy-loaded').removeClass('swiper-lazy-loading');
                    slide.find('.swiper-lazy-preloader, .preloader').remove();
                    if (s.params.loop && loadInDuplicate) {
                        var slideOriginalIndex = slide.attr('data-swiper-slide-index');
                        if (slide.hasClass(s.params.slideDuplicateClass)) {
                            var originalSlide = s.wrapper.children('[data-swiper-slide-index="' + slideOriginalIndex + '"]:not(.' + s.params.slideDuplicateClass + ')');
                            s.lazy.loadImageInSlide(originalSlide.index(), false);
                        }
                        else {
                            var duplicatedSlide = s.wrapper.children('.' + s.params.slideDuplicateClass + '[data-swiper-slide-index="' + slideOriginalIndex + '"]');
                            s.lazy.loadImageInSlide(duplicatedSlide.index(), false);
                        }
                    }
                    s.emit('onLazyImageReady', s, slide[0], _img[0]);
                });
    
                s.emit('onLazyImageLoad', s, slide[0], _img[0]);
            });
    
        },
        load: function () {
            var i;
            if (s.params.watchSlidesVisibility) {
                s.wrapper.children('.' + s.params.slideVisibleClass).each(function () {
                    s.lazy.loadImageInSlide($(this).index());
                });
            }
            else {
                if (s.params.slidesPerView > 1) {
                    for (i = s.activeIndex; i < s.activeIndex + s.params.slidesPerView ; i++) {
                        if (s.slides[i]) s.lazy.loadImageInSlide(i);
                    }
                }
                else {
                    s.lazy.loadImageInSlide(s.activeIndex);
                }
            }
            if (s.params.lazyLoadingInPrevNext) {
                if (s.params.slidesPerView > 1 || (s.params.lazyLoadingInPrevNextAmount && s.params.lazyLoadingInPrevNextAmount > 1)) {
                    var amount = s.params.lazyLoadingInPrevNextAmount;
                    var spv = s.params.slidesPerView;
                    var maxIndex = Math.min(s.activeIndex + spv + Math.max(amount, spv), s.slides.length);
                    var minIndex = Math.max(s.activeIndex - Math.max(spv, amount), 0);
                    // Next Slides
                    for (i = s.activeIndex + s.params.slidesPerView; i < maxIndex; i++) {
                        if (s.slides[i]) s.lazy.loadImageInSlide(i);
                    }
                    // Prev Slides
                    for (i = minIndex; i < s.activeIndex ; i++) {
                        if (s.slides[i]) s.lazy.loadImageInSlide(i);
                    }
                }
                else {
                    var nextSlide = s.wrapper.children('.' + s.params.slideNextClass);
                    if (nextSlide.length > 0) s.lazy.loadImageInSlide(nextSlide.index());
    
                    var prevSlide = s.wrapper.children('.' + s.params.slidePrevClass);
                    if (prevSlide.length > 0) s.lazy.loadImageInSlide(prevSlide.index());
                }
            }
        },
        onTransitionStart: function () {
            if (s.params.lazyLoading) {
                if (s.params.lazyLoadingOnTransitionStart || (!s.params.lazyLoadingOnTransitionStart && !s.lazy.initialImageLoaded)) {
                    s.lazy.load();
                }
            }
        },
        onTransitionEnd: function () {
            if (s.params.lazyLoading && !s.params.lazyLoadingOnTransitionStart) {
                s.lazy.load();
            }
        }
    };
    

    /*=========================
      Scrollbar
      ===========================*/
    s.scrollbar = {
        isTouched: false,
        setDragPosition: function (e) {
            var sb = s.scrollbar;
            var x = 0, y = 0;
            var translate;
            var pointerPosition = s.isHorizontal() ?
                ((e.type === 'touchstart' || e.type === 'touchmove') ? e.targetTouches[0].pageX : e.pageX || e.clientX) :
                ((e.type === 'touchstart' || e.type === 'touchmove') ? e.targetTouches[0].pageY : e.pageY || e.clientY) ;
            var position = (pointerPosition) - sb.track.offset()[s.isHorizontal() ? 'left' : 'top'] - sb.dragSize / 2;
            var positionMin = -s.minTranslate() * sb.moveDivider;
            var positionMax = -s.maxTranslate() * sb.moveDivider;
            if (position < positionMin) {
                position = positionMin;
            }
            else if (position > positionMax) {
                position = positionMax;
            }
            position = -position / sb.moveDivider;
            s.updateProgress(position);
            s.setWrapperTranslate(position, true);
        },
        dragStart: function (e) {
            var sb = s.scrollbar;
            sb.isTouched = true;
            e.preventDefault();
            e.stopPropagation();
    
            sb.setDragPosition(e);
            clearTimeout(sb.dragTimeout);
    
            sb.track.transition(0);
            if (s.params.scrollbarHide) {
                sb.track.css('opacity', 1);
            }
            s.wrapper.transition(100);
            sb.drag.transition(100);
            s.emit('onScrollbarDragStart', s);
        },
        dragMove: function (e) {
            var sb = s.scrollbar;
            if (!sb.isTouched) return;
            if (e.preventDefault) e.preventDefault();
            else e.returnValue = false;
            sb.setDragPosition(e);
            s.wrapper.transition(0);
            sb.track.transition(0);
            sb.drag.transition(0);
            s.emit('onScrollbarDragMove', s);
        },
        dragEnd: function (e) {
            var sb = s.scrollbar;
            if (!sb.isTouched) return;
            sb.isTouched = false;
            if (s.params.scrollbarHide) {
                clearTimeout(sb.dragTimeout);
                sb.dragTimeout = setTimeout(function () {
                    sb.track.css('opacity', 0);
                    sb.track.transition(400);
                }, 1000);
    
            }
            s.emit('onScrollbarDragEnd', s);
            if (s.params.scrollbarSnapOnRelease) {
                s.slideReset();
            }
        },
        enableDraggable: function () {
            var sb = s.scrollbar;
            var target = s.support.touch ? sb.track : document;
            $(sb.track).on(s.touchEvents.start, sb.dragStart);
            $(target).on(s.touchEvents.move, sb.dragMove);
            $(target).on(s.touchEvents.end, sb.dragEnd);
        },
        disableDraggable: function () {
            var sb = s.scrollbar;
            var target = s.support.touch ? sb.track : document;
            $(sb.track).off(s.touchEvents.start, sb.dragStart);
            $(target).off(s.touchEvents.move, sb.dragMove);
            $(target).off(s.touchEvents.end, sb.dragEnd);
        },
        set: function () {
            if (!s.params.scrollbar) return;
            var sb = s.scrollbar;
            sb.track = $(s.params.scrollbar);
            if (s.params.uniqueNavElements && typeof s.params.scrollbar === 'string' && sb.track.length > 1 && s.container.find(s.params.scrollbar).length === 1) {
                sb.track = s.container.find(s.params.scrollbar);
            }
            sb.drag = sb.track.find('.swiper-scrollbar-drag');
            if (sb.drag.length === 0) {
                sb.drag = $('<div class="swiper-scrollbar-drag"></div>');
                sb.track.append(sb.drag);
            }
            sb.drag[0].style.width = '';
            sb.drag[0].style.height = '';
            sb.trackSize = s.isHorizontal() ? sb.track[0].offsetWidth : sb.track[0].offsetHeight;
    
            sb.divider = s.size / s.virtualSize;
            sb.moveDivider = sb.divider * (sb.trackSize / s.size);
            sb.dragSize = sb.trackSize * sb.divider;
    
            if (s.isHorizontal()) {
                sb.drag[0].style.width = sb.dragSize + 'px';
            }
            else {
                sb.drag[0].style.height = sb.dragSize + 'px';
            }
    
            if (sb.divider >= 1) {
                sb.track[0].style.display = 'none';
            }
            else {
                sb.track[0].style.display = '';
            }
            if (s.params.scrollbarHide) {
                sb.track[0].style.opacity = 0;
            }
        },
        setTranslate: function () {
            if (!s.params.scrollbar) return;
            var diff;
            var sb = s.scrollbar;
            var translate = s.translate || 0;
            var newPos;
    
            var newSize = sb.dragSize;
            newPos = (sb.trackSize - sb.dragSize) * s.progress;
            if (s.rtl && s.isHorizontal()) {
                newPos = -newPos;
                if (newPos > 0) {
                    newSize = sb.dragSize - newPos;
                    newPos = 0;
                }
                else if (-newPos + sb.dragSize > sb.trackSize) {
                    newSize = sb.trackSize + newPos;
                }
            }
            else {
                if (newPos < 0) {
                    newSize = sb.dragSize + newPos;
                    newPos = 0;
                }
                else if (newPos + sb.dragSize > sb.trackSize) {
                    newSize = sb.trackSize - newPos;
                }
            }
            if (s.isHorizontal()) {
                if (s.support.transforms3d) {
                    sb.drag.transform('translate3d(' + (newPos) + 'px, 0, 0)');
                }
                else {
                    sb.drag.transform('translateX(' + (newPos) + 'px)');
                }
                sb.drag[0].style.width = newSize + 'px';
            }
            else {
                if (s.support.transforms3d) {
                    sb.drag.transform('translate3d(0px, ' + (newPos) + 'px, 0)');
                }
                else {
                    sb.drag.transform('translateY(' + (newPos) + 'px)');
                }
                sb.drag[0].style.height = newSize + 'px';
            }
            if (s.params.scrollbarHide) {
                clearTimeout(sb.timeout);
                sb.track[0].style.opacity = 1;
                sb.timeout = setTimeout(function () {
                    sb.track[0].style.opacity = 0;
                    sb.track.transition(400);
                }, 1000);
            }
        },
        setTransition: function (duration) {
            if (!s.params.scrollbar) return;
            s.scrollbar.drag.transition(duration);
        }
    };

    /*=========================
      Controller
      ===========================*/
    s.controller = {
        LinearSpline: function (x, y) {
            this.x = x;
            this.y = y;
            this.lastIndex = x.length - 1;
            // Given an x value (x2), return the expected y2 value:
            // (x1,y1) is the known point before given value,
            // (x3,y3) is the known point after given value.
            var i1, i3;
            var l = this.x.length;
    
            this.interpolate = function (x2) {
                if (!x2) return 0;
    
                // Get the indexes of x1 and x3 (the array indexes before and after given x2):
                i3 = binarySearch(this.x, x2);
                i1 = i3 - 1;
    
                // We have our indexes i1 & i3, so we can calculate already:
                // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1
                return ((x2 - this.x[i1]) * (this.y[i3] - this.y[i1])) / (this.x[i3] - this.x[i1]) + this.y[i1];
            };
    
            var binarySearch = (function() {
                var maxIndex, minIndex, guess;
                return function(array, val) {
                    minIndex = -1;
                    maxIndex = array.length;
                    while (maxIndex - minIndex > 1)
                        if (array[guess = maxIndex + minIndex >> 1] <= val) {
                            minIndex = guess;
                        } else {
                            maxIndex = guess;
                        }
                    return maxIndex;
                };
            })();
        },
        //xxx: for now i will just save one spline function to to
        getInterpolateFunction: function(c){
            if(!s.controller.spline) s.controller.spline = s.params.loop ?
                new s.controller.LinearSpline(s.slidesGrid, c.slidesGrid) :
                new s.controller.LinearSpline(s.snapGrid, c.snapGrid);
        },
        setTranslate: function (translate, byController) {
           var controlled = s.params.control;
           var multiplier, controlledTranslate;
           function setControlledTranslate(c) {
                // this will create an Interpolate function based on the snapGrids
                // x is the Grid of the scrolled scroller and y will be the controlled scroller
                // it makes sense to create this only once and recall it for the interpolation
                // the function does a lot of value caching for performance
                translate = c.rtl && c.params.direction === 'horizontal' ? -s.translate : s.translate;
                if (s.params.controlBy === 'slide') {
                    s.controller.getInterpolateFunction(c);
                    // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
                    // but it did not work out
                    controlledTranslate = -s.controller.spline.interpolate(-translate);
                }
    
                if(!controlledTranslate || s.params.controlBy === 'container'){
                    multiplier = (c.maxTranslate() - c.minTranslate()) / (s.maxTranslate() - s.minTranslate());
                    controlledTranslate = (translate - s.minTranslate()) * multiplier + c.minTranslate();
                }
    
                if (s.params.controlInverse) {
                    controlledTranslate = c.maxTranslate() - controlledTranslate;
                }
                c.updateProgress(controlledTranslate);
                c.setWrapperTranslate(controlledTranslate, false, s);
                c.updateActiveIndex();
           }
           if (s.isArray(controlled)) {
               for (var i = 0; i < controlled.length; i++) {
                   if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                       setControlledTranslate(controlled[i]);
                   }
               }
           }
           else if (controlled instanceof Swiper && byController !== controlled) {
    
               setControlledTranslate(controlled);
           }
        },
        setTransition: function (duration, byController) {
            var controlled = s.params.control;
            var i;
            function setControlledTransition(c) {
                c.setWrapperTransition(duration, s);
                if (duration !== 0) {
                    c.onTransitionStart();
                    c.wrapper.transitionEnd(function(){
                        if (!controlled) return;
                        if (c.params.loop && s.params.controlBy === 'slide') {
                            c.fixLoop();
                        }
                        c.onTransitionEnd();
    
                    });
                }
            }
            if (s.isArray(controlled)) {
                for (i = 0; i < controlled.length; i++) {
                    if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                        setControlledTransition(controlled[i]);
                    }
                }
            }
            else if (controlled instanceof Swiper && byController !== controlled) {
                setControlledTransition(controlled);
            }
        }
    };

    /*=========================
      Parallax
      ===========================*/
    function setParallaxTransform(el, progress) {
        el = $(el);
        var p, pX, pY;
        var rtlFactor = s.rtl ? -1 : 1;
    
        p = el.attr('data-swiper-parallax') || '0';
        pX = el.attr('data-swiper-parallax-x');
        pY = el.attr('data-swiper-parallax-y');
        if (pX || pY) {
            pX = pX || '0';
            pY = pY || '0';
        }
        else {
            if (s.isHorizontal()) {
                pX = p;
                pY = '0';
            }
            else {
                pY = p;
                pX = '0';
            }
        }
    
        if ((pX).indexOf('%') >= 0) {
            pX = parseInt(pX, 10) * progress * rtlFactor + '%';
        }
        else {
            pX = pX * progress * rtlFactor + 'px' ;
        }
        if ((pY).indexOf('%') >= 0) {
            pY = parseInt(pY, 10) * progress + '%';
        }
        else {
            pY = pY * progress + 'px' ;
        }
    
        el.transform('translate3d(' + pX + ', ' + pY + ',0px)');
    }
    s.parallax = {
        setTranslate: function () {
            s.container.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){
                setParallaxTransform(this, s.progress);
    
            });
            s.slides.each(function () {
                var slide = $(this);
                slide.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function () {
                    var progress = Math.min(Math.max(slide[0].progress, -1), 1);
                    setParallaxTransform(this, progress);
                });
            });
        },
        setTransition: function (duration) {
            if (typeof duration === 'undefined') duration = s.params.speed;
            s.container.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){
                var el = $(this);
                var parallaxDuration = parseInt(el.attr('data-swiper-parallax-duration'), 10) || duration;
                if (duration === 0) parallaxDuration = 0;
                el.transition(parallaxDuration);
            });
        }
    };
    

    /*=========================
      Plugins API. Collect all and init all plugins
      ===========================*/
    s._plugins = [];
    for (var plugin in s.plugins) {
        var p = s.plugins[plugin](s, s.params[plugin]);
        if (p) s._plugins.push(p);
    }
    // Method to call all plugins event/method
    s.callPlugins = function (eventName) {
        for (var i = 0; i < s._plugins.length; i++) {
            if (eventName in s._plugins[i]) {
                s._plugins[i][eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            }
        }
    };

    /*=========================
      Events/Callbacks/Plugins Emitter
      ===========================*/
    function normalizeEventName (eventName) {
        if (eventName.indexOf('on') !== 0) {
            if (eventName[0] !== eventName[0].toUpperCase()) {
                eventName = 'on' + eventName[0].toUpperCase() + eventName.substring(1);
            }
            else {
                eventName = 'on' + eventName;
            }
        }
        return eventName;
    }
    s.emitterEventListeners = {
    
    };
    s.emit = function (eventName) {
        // Trigger callbacks
        if (s.params[eventName]) {
            s.params[eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }
        var i;
        // Trigger events
        if (s.emitterEventListeners[eventName]) {
            for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
                s.emitterEventListeners[eventName][i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            }
        }
        // Trigger plugins
        if (s.callPlugins) s.callPlugins(eventName, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    };
    s.on = function (eventName, handler) {
        eventName = normalizeEventName(eventName);
        if (!s.emitterEventListeners[eventName]) s.emitterEventListeners[eventName] = [];
        s.emitterEventListeners[eventName].push(handler);
        return s;
    };
    s.off = function (eventName, handler) {
        var i;
        eventName = normalizeEventName(eventName);
        if (typeof handler === 'undefined') {
            // Remove all handlers for such event
            s.emitterEventListeners[eventName] = [];
            return s;
        }
        if (!s.emitterEventListeners[eventName] || s.emitterEventListeners[eventName].length === 0) return;
        for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
            if(s.emitterEventListeners[eventName][i] === handler) s.emitterEventListeners[eventName].splice(i, 1);
        }
        return s;
    };
    s.once = function (eventName, handler) {
        eventName = normalizeEventName(eventName);
        var _handler = function () {
            handler(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
            s.off(eventName, _handler);
        };
        s.on(eventName, _handler);
        return s;
    };

    // Accessibility tools
    s.a11y = {
        makeFocusable: function ($el) {
            $el.attr('tabIndex', '0');
            return $el;
        },
        addRole: function ($el, role) {
            $el.attr('role', role);
            return $el;
        },
    
        addLabel: function ($el, label) {
            $el.attr('aria-label', label);
            return $el;
        },
    
        disable: function ($el) {
            $el.attr('aria-disabled', true);
            return $el;
        },
    
        enable: function ($el) {
            $el.attr('aria-disabled', false);
            return $el;
        },
    
        onEnterKey: function (event) {
            if (event.keyCode !== 13) return;
            if ($(event.target).is(s.params.nextButton)) {
                s.onClickNext(event);
                if (s.isEnd) {
                    s.a11y.notify(s.params.lastSlideMessage);
                }
                else {
                    s.a11y.notify(s.params.nextSlideMessage);
                }
            }
            else if ($(event.target).is(s.params.prevButton)) {
                s.onClickPrev(event);
                if (s.isBeginning) {
                    s.a11y.notify(s.params.firstSlideMessage);
                }
                else {
                    s.a11y.notify(s.params.prevSlideMessage);
                }
            }
            if ($(event.target).is('.' + s.params.bulletClass)) {
                $(event.target)[0].click();
            }
        },
    
        liveRegion: $('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),
    
        notify: function (message) {
            var notification = s.a11y.liveRegion;
            if (notification.length === 0) return;
            notification.html('');
            notification.html(message);
        },
        init: function () {
            // Setup accessibility
            if (s.params.nextButton && s.nextButton && s.nextButton.length > 0) {
                s.a11y.makeFocusable(s.nextButton);
                s.a11y.addRole(s.nextButton, 'button');
                s.a11y.addLabel(s.nextButton, s.params.nextSlideMessage);
            }
            if (s.params.prevButton && s.prevButton && s.prevButton.length > 0) {
                s.a11y.makeFocusable(s.prevButton);
                s.a11y.addRole(s.prevButton, 'button');
                s.a11y.addLabel(s.prevButton, s.params.prevSlideMessage);
            }
    
            $(s.container).append(s.a11y.liveRegion);
        },
        initPagination: function () {
            if (s.params.pagination && s.params.paginationClickable && s.bullets && s.bullets.length) {
                s.bullets.each(function () {
                    var bullet = $(this);
                    s.a11y.makeFocusable(bullet);
                    s.a11y.addRole(bullet, 'button');
                    s.a11y.addLabel(bullet, s.params.paginationBulletMessage.replace(/{{index}}/, bullet.index() + 1));
                });
            }
        },
        destroy: function () {
            if (s.a11y.liveRegion && s.a11y.liveRegion.length > 0) s.a11y.liveRegion.remove();
        }
    };
    

    /*=========================
      Init/Destroy
      ===========================*/
    s.init = function () {
        if (s.params.loop) s.createLoop();
        s.updateContainerSize();
        s.updateSlidesSize();
        s.updatePagination();
        if (s.params.scrollbar && s.scrollbar) {
            s.scrollbar.set();
            if (s.params.scrollbarDraggable) {
                s.scrollbar.enableDraggable();
            }
        }
        if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
            if (!s.params.loop) s.updateProgress();
            s.effects[s.params.effect].setTranslate();
        }
        if (s.params.loop) {
            s.slideTo(s.params.initialSlide + s.loopedSlides, 0, s.params.runCallbacksOnInit);
        }
        else {
            s.slideTo(s.params.initialSlide, 0, s.params.runCallbacksOnInit);
            if (s.params.initialSlide === 0) {
                if (s.parallax && s.params.parallax) s.parallax.setTranslate();
                if (s.lazy && s.params.lazyLoading) {
                    s.lazy.load();
                    s.lazy.initialImageLoaded = true;
                }
            }
        }
        s.attachEvents();
        if (s.params.observer && s.support.observer) {
            s.initObservers();
        }
        if (s.params.preloadImages && !s.params.lazyLoading) {
            s.preloadImages();
        }
        if (s.params.autoplay) {
            s.startAutoplay();
        }
        if (s.params.keyboardControl) {
            if (s.enableKeyboardControl) s.enableKeyboardControl();
        }
        if (s.params.mousewheelControl) {
            if (s.enableMousewheelControl) s.enableMousewheelControl();
        }
        if (s.params.hashnav) {
            if (s.hashnav) s.hashnav.init();
        }
        if (s.params.a11y && s.a11y) s.a11y.init();
        s.emit('onInit', s);
    };
    
    // Cleanup dynamic styles
    s.cleanupStyles = function () {
        // Container
        s.container.removeClass(s.classNames.join(' ')).removeAttr('style');
    
        // Wrapper
        s.wrapper.removeAttr('style');
    
        // Slides
        if (s.slides && s.slides.length) {
            s.slides
                .removeClass([
                  s.params.slideVisibleClass,
                  s.params.slideActiveClass,
                  s.params.slideNextClass,
                  s.params.slidePrevClass
                ].join(' '))
                .removeAttr('style')
                .removeAttr('data-swiper-column')
                .removeAttr('data-swiper-row');
        }
    
        // Pagination/Bullets
        if (s.paginationContainer && s.paginationContainer.length) {
            s.paginationContainer.removeClass(s.params.paginationHiddenClass);
        }
        if (s.bullets && s.bullets.length) {
            s.bullets.removeClass(s.params.bulletActiveClass);
        }
    
        // Buttons
        if (s.params.prevButton) $(s.params.prevButton).removeClass(s.params.buttonDisabledClass);
        if (s.params.nextButton) $(s.params.nextButton).removeClass(s.params.buttonDisabledClass);
    
        // Scrollbar
        if (s.params.scrollbar && s.scrollbar) {
            if (s.scrollbar.track && s.scrollbar.track.length) s.scrollbar.track.removeAttr('style');
            if (s.scrollbar.drag && s.scrollbar.drag.length) s.scrollbar.drag.removeAttr('style');
        }
    };
    
    // Destroy
    s.destroy = function (deleteInstance, cleanupStyles) {
        // Detach evebts
        s.detachEvents();
        // Stop autoplay
        s.stopAutoplay();
        // Disable draggable
        if (s.params.scrollbar && s.scrollbar) {
            if (s.params.scrollbarDraggable) {
                s.scrollbar.disableDraggable();
            }
        }
        // Destroy loop
        if (s.params.loop) {
            s.destroyLoop();
        }
        // Cleanup styles
        if (cleanupStyles) {
            s.cleanupStyles();
        }
        // Disconnect observer
        s.disconnectObservers();
        // Disable keyboard/mousewheel
        if (s.params.keyboardControl) {
            if (s.disableKeyboardControl) s.disableKeyboardControl();
        }
        if (s.params.mousewheelControl) {
            if (s.disableMousewheelControl) s.disableMousewheelControl();
        }
        // Disable a11y
        if (s.params.a11y && s.a11y) s.a11y.destroy();
        // Destroy callback
        s.emit('onDestroy');
        // Delete instance
        if (deleteInstance !== false) s = null;
    };
    
    s.init();
    


    // Return swiper instance
    return s;
};

/*==================================================
    Prototype
====================================================*/
Swiper.prototype = {
    isSafari: (function () {
        var ua = navigator.userAgent.toLowerCase();
        return (ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0);
    })(),
    isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
    isArray: function (arr) {
        return Object.prototype.toString.apply(arr) === '[object Array]';
    },
    /*==================================================
    Browser
    ====================================================*/
    browser: {
        ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
        ieTouch: (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1) || (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1)
    },
    /*==================================================
    Devices
    ====================================================*/
    device: (function () {
        var ua = navigator.userAgent;
        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
        return {
            ios: ipad || iphone || ipod,
            android: android
        };
    })(),
    /*==================================================
    Feature Detection
    ====================================================*/
    support: {
        touch : (window.Modernizr && Modernizr.touch === true) || (function () {
            return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
        })(),

        transforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
            var div = document.createElement('div').style;
            return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
        })(),

        flexbox: (function () {
            var div = document.createElement('div').style;
            var styles = ('alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient').split(' ');
            for (var i = 0; i < styles.length; i++) {
                if (styles[i] in div) return true;
            }
        })(),

        observer: (function () {
            return ('MutationObserver' in window || 'WebkitMutationObserver' in window);
        })()
    },
    /*==================================================
    Plugins
    ====================================================*/
    plugins: {}
};






})();

//# sourceMappingURL=framework7.js.map
