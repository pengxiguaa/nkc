!function r(a,s,c){function u(e,t){if(!s[e]){if(!a[e]){var o="function"==typeof require&&require;if(!t&&o)return o(e,!0);if(d)return d(e,!0);var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}var i=s[e]={exports:{}};a[e][0].call(i.exports,function(t){return u(a[e][1][t]||t)},i,i.exports,r,a,s,c)}return s[e].exports}for(var d="function"==typeof require&&require,t=0;t<c.length;t++)u(c[t]);return u}({1:[function(t,e,o){"use strict";var n;NKC.modules.downloadResource=function(){return function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t);var r=this;r.dom=$("#moduleDownloadResource"),r.app=new Vue({el:"#moduleDownloadResourceApp",data:{uid:NKC.configs.uid,rid:"",fileName:"未知",type:"",size:0,costs:[],hold:[],status:"loading",fileCountLimitInfo:"",errorInfo:"",settingNoNeed:!1},computed:{costMessage:function(){return this.costs.map(function(t){return t.name+t.number}).join("、")},holdMessage:function(){return this.hold.map(function(t){return t.name+t.number}).join("、")}},methods:{fromNow:NKC.methods.fromNow,initDom:function(){r.dom.css({height:"37rem"}),r.dom.draggable({scroll:!1,handle:".module-sd-title",drag:function(t,e){e.position.top<0&&(e.position.top=0);var o=$(window).height();e.position.top>o-30&&(e.position.top=o-30);var n=r.dom.width();e.position.left<100-n&&(e.position.left=100-n);var i=$(window).width();e.position.left>i-100&&(e.position.left=i-100)}});var t=$(window).width();t<700?r.dom.css({width:.8*t,top:0,right:0}):r.dom.css("left",.5*(t-r.dom.width())-20),r.dom.show()},getResourceInfo:function(t){var s=this;s.status="loading",s.errorInfo="",nkcAPI("/r/".concat(t,"/detail"),"GET").then(function(t){var e=t.detail,o=e.free,n=e.paid,i=e.resource,r=e.costScores,a=e.fileCountLimitInfo;s.fileCountLimitInfo=a,i.isFileExist?(s.status=o||n?"noNeedScore":"needScore",s.free=o,s.paid=n,s.fileName=i.oname,s.rid=i.rid,s.type=i.ext,s.size=NKC.methods.getSize(i.size),r&&(s.costs=r.map(function(t){return{name:t.name,number:t.addNumber/100*-1}}),s.hold=r.map(function(t){return{name:t.name,number:t.number/100}}))):s.status="fileNotExist"}).catch(function(t){s.fileCountLimitInfo=t.fileCountLimitInfo,s.status="error",s.errorInfo=t.error||t.message||t})},download:function(){var t=this,e=this.rid,o=this.fileName;nkcAPI("/r/".concat(e,"/pay"),"POST").then(function(){var t=document.createElement("a");t.setAttribute("download",o),t.href="/r/".concat(e),t.click()}).catch(sweetError).then(function(){return t.getResourceInfo(t.rid)})},fetchResource:function(){var t=this.rid,e=this.fileName,o=document.createElement("a");o.setAttribute("download",e),o.href="/r/".concat(t),o.click()},open:function(t){this.status="loading",this.initDom(),this.getResourceInfo(t)},close:function(){r.dom.hide()}}}),r.open=r.app.open,r.close=r.app.close}}(),n=new NKC.modules.downloadResource,NKC.methods.openFilePanel=function(t){n.open(t)},$("#wrap, .post").on("click",function(t){if("clickAttachmentTitle"===$(t.target).attr("data-type")){t.preventDefault(),t.stopPropagation();var e=$(t.target).attr("data-id");return n.open(e),!1}})},{}]},{},[1]);