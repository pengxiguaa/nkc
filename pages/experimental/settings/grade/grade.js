!function a(n,o,i){function c(t,e){if(!o[t]){if(!n[t]){var r="function"==typeof require&&require;if(!e&&r)return r(t,!0);if(s)return s(t,!0);throw(r=new Error("Cannot find module '"+t+"'")).code="MODULE_NOT_FOUND",r}r=o[t]={exports:{}},n[t][0].call(r.exports,function(e){return c(n[t][1][e]||e)},r,r.exports,a,n,o,i)}return o[t].exports}for(var s="function"==typeof require&&require,e=0;e<i.length;e++)c(i[e]);return c}({1:[function(e,t,r){"use strict";var a=NKC.methods.getDataById("data"),i=new Vue({el:"#app",data:{grades:a.grades,gradeSettings:a.gradeSettings},mounted:function(){NKC.methods.initSelectColor()},methods:{checkNumber:NKC.methods.checkData.checkNumber,checkString:NKC.methods.checkData.checkString,save:function(){for(var e=$("input.color"),t=0;t<e.length;t++){var r=e.eq(t),a=r.attr("data-index");i.grades[a].color=r.val()}var n=this.grades,o=this.gradeSettings;nkcAPI("/e/settings/grade","PUT",{grades:n,gradeSettings:o}).then(function(){sweetSuccess("保存成功")}).catch(sweetError)},removeGrade:function(e){this.grades.splice(e,1)},addGrade:function(){this.grades.push({_id:"",displayName:"新建等级",score:0,color:"#aaaaaa",description:""})}}})},{}]},{},[1]);