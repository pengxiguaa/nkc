!function c(o,a,s){function d(e,t){if(!a[e]){if(!o[e]){var i="function"==typeof require&&require;if(!t&&i)return i(e,!0);if(u)return u(e,!0);var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}var r=a[e]={exports:{}};o[e][0].call(r.exports,function(t){return d(o[e][1][t]||t)},r,r.exports,c,o,a,s)}return a[e].exports}for(var u="function"==typeof require&&require,t=0;t<s.length;t++)d(s[t]);return d}({1:[function(t,e,i){"use strict";var n=new function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t);var n=this;n.dom=$("#moduleStickerViewer"),n.dom.modal({show:!1}),n.app=new Vue({el:"#moduleStickerViewerApp",data:{sticker:"",uid:NKC.configs.uid,management:!1,loading:!1},mounted:function(){this.init()},methods:{getUrl:NKC.methods.tools.getUrl,fromNow:NKC.methods.fromNow,collection:function(){nkcAPI("/sticker","POST",{type:"collection",stickersId:[this.sticker._id]}).then(function(){n.app.close(),sweetSuccess("表情已添加")}).catch(sweetError)},moveSticker:function(){var t={type:"move",stickersId:[this.sticker.collected._id]};nkcAPI("/sticker","POST",t).then(function(){n.app.close(),window.location.reload()}).catch(sweetError)},shareSticker:function(){var t={type:"share",stickersId:[this.sticker._id]};nkcAPI("/sticker","POST",t).then(function(){sweetSuccess("操作成功")}).catch(sweetError)},removeSticker:function(){var e=this.sticker;sweetQuestion("确定要删除表情？").then(function(){var t={type:"delete",stickersId:[e.collected._id]};return nkcAPI("/sticker","POST",t)}).then(function(){n.app.close(),window.location.reload()}).catch(sweetError)},init:function(){for(var t=$("[data-sticker-rid]"),e=0;e<t.length;e++){var i=t.eq(e);"true"!==i.attr("data-sticker-init")&&(i.on("click",function(){n.app.open($(this).attr("data-sticker-rid"),!!$(this).attr("data-sticker-management"))}),i.attr("data-sticker-init","true"))}$("span[data-tag='nkcsource'][data-type='sticker']").each(function(){var t=$(this);"true"!==t.attr("data-sticker-init")&&(t.on("click",function(){n.app.open($(this).attr("data-id"),!!$(this).attr("data-sticker-management"))}),t.attr("data-sticker-init","true"))})},open:function(t,e){n.app.management=!!e,n.dom.modal("show"),this.loading=!0,nkcAPI("/sticker/".concat(t,"?t=json"),"GET").then(function(t){n.app.sticker=t.sticker,n.app.loading=!1}).catch(function(t){sweetError(t),n.app.close()})},close:function(){n.dom.modal("hide")}}}),n.initPanel=n.app.init};NKC.methods.initStickerViewer=n.app.init},{}]},{},[1]);