(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{776:function(t,e,l){var content=l(822);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,l(56).default)("f3366966",content,!0,{sourceMap:!1})},785:function(t,e,l){l(22)({target:"Object",stat:!0},{is:l(548)})},821:function(t,e,l){"use strict";l(776)},822:function(t,e,l){var n=l(55)(!1);n.push([t.i,"@import url(https://fonts.googleapis.com/css2?family=Kanit:wght@100;300;400;500;600;700&display=swap);"]),n.push([t.i,".text-predict-field[data-v-cfe2bc86]{position:relative}.text-predict-field>.text-predict-field__predicted[data-v-cfe2bc86]{position:absolute;top:8px;bottom:0;left:12px;right:0;color:rgba(0,0,0,.3)}",""]),t.exports=n},900:function(t,e,l){"use strict";l.r(e);var n={name:"TextPredictFieldComponent",props:{value:{type:String,default:""},predicted:{type:String,default:""}},data:function(){return{localText:"",localPredicted:""}},watch:{value:function(t){this.localText=t},predicted:function(t){this.localPredicted=t}},mounted:function(){this.localText=this.value,this.localPredicted=this.predicted},methods:{onFullText:function(t){this.$emit("input",this.localPredicted)},onChange:function(t){this.$emit("change",t.target.value)}}},o=(l(821),l(138)),c=l(160),d=l.n(c),r=l(1070),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("div",{staticClass:"text-predict-field"},[l("div",{staticClass:"text-predict-field__predicted"},[t._v(t._s(t.predicted))]),t._v(" "),l("v-text-field",{attrs:{value:t.localText,tabindex:"1",dense:"","single-line":"",outlined:"","hide-details":""},on:{keydown:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")&&t._k(e.keyCode,"tab",9,e.key,"Tab")?null:t.onFullText.apply(null,arguments)},keyup:t.onChange}})],1)}),[],!1,null,"cfe2bc86",null);e.default=component.exports;d()(component,{VTextField:r.a})}}]);