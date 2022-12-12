(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{185:function(t,e,n){"use strict";var r={name:"ErrorLayout",layout:"empty",props:{error:{type:Object,default:null}},data:function(){return{statusMessages:{401:{title:"Unauthorized",message:"จำเป็นต้องลงชื่อเพื่อเข้าใช้งานก่อน หากมีข้อสงสัยติดต่อผู้ดูแลระบบ"},403:{title:"Access Denied",message:"คุณไม่สามารถเข้าถึงทรัพยากรได้ หากมีข้อสงสัยติดต่อผู้ดูแลระบบ"},404:{title:"404 Not Found",message:"ขอโทษด้วยนะ เราไม่พบหน้าที่คุณต้องการ"},415:{title:"Unsupported Media Type",message:"ไม่รองรับการทำงานบนอุปกรณ์หรือเว็บเบราว์เซอร์"},500:{title:"An error occurred",message:"เรากำลังปรับปรุงเพื่อสิ่งที่ดีกว่า และเราจะกลับมาในไม่ช้า"},503:{title:"An error occurred",message:"เรากำลังปรับปรุงเพื่อสิ่งที่ดีกว่า และเราจะกลับมาในไม่ช้า"}}}},head:function(){return{title:this.title}},computed:{status:function(){return this.error.statusCode in this.statusMessages?this.error.statusCode:500},message:function(){return this.statusMessages[this.status].message},title:function(){return this.statusMessages[this.status].title}},mounted:function(){window.onbeforeunload=null}},o=n(138),c=n(160),l=n.n(c),f=n(735),v=n(727),component=Object(o.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-container",{attrs:{"fill-height":""}},[n("v-row",{attrs:{align:"center",justify:"center","fill-height":""}},[n("div",{staticClass:"d-inline"},[n("div",{staticClass:"text-h1 font-weight-bold text-center grey--text text--lighten-2"},[t._v("\n        "+t._s(t.status)+"\n      ")]),t._v(" "),n("div",{staticClass:"text-center pt-3 font-weight-light"},[t._v("\n        "+t._s(t.message)+"\n      ")])])])],1)}),[],!1,null,null,null);e.a=component.exports;l()(component,{VContainer:f.a,VRow:v.a})},393:function(t,e,n){"use strict";n(38),n(25),n(699),n(65),n(94),n(263);var r=n(12),o=n(517),c=n.n(o),l=n(388),f=n.n(l),v=n(518),m=n.n(v);f.a.extend(m.a),r.default.filter("epochTime",(function(t){if(Number.isNaN(Number(t)))return"-:-";var e=f.a.duration(t);return("00"+e.minutes()).slice(-2)+":"+("00"+e.seconds()).slice(-2)+"."+("000"+e.milliseconds()).slice(-3)})),r.default.filter("decimal",(function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return Number.isNaN(Number(t))?"0.0":c()(t).format("0,0."+"0".repeat(e))}))},394:function(t,e,n){"use strict";var r=n(12),o=n(519),c=n.n(o);r.default.use(c.a)},395:function(t,e,n){"use strict";n(25),n(162);var r=n(91),o=n(81),c=n(60),l=n(62),f=n(61),v=n(245);function m(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Object(c.a)(t);if(e){var l=Object(c.a)(this).constructor;n=Reflect.construct(r,arguments,l)}else n=r.apply(this,arguments);return Object(o.a)(this,n)}}var d=Object(l.a)((function t(e){return Object(f.a)(this,t),v.regularizers.l1l2(e)}));d.className="L2",v.serialization.registerClass(d);var h=function(t){Object(r.a)(n,t);var e=m(n);function n(){return Object(f.a)(this,n),e.call(this,{})}return Object(l.a)(n,null,[{key:"className",get:function(){return"Lambda"}}]),n}(v.layers.Layer);v.serialization.registerClass(h),e.a=function(t,e){t.app;e("tfjs",v)}},397:function(t,e,n){"use strict";var r=n(12),o=n(541);r.default.use(o.a)},544:function(t,e,n){"use strict";var r={name:"DefaultLayout",data:function(){return{clipped:!1,drawer:!1,fixed:!1,items:[{icon:"mdi-apps",title:"Welcome",to:"/"},{icon:"mdi-chart-bubble",title:"Inspire",to:"/inspire"}],miniVariant:!1,right:!0,rightDrawer:!1,title:"Vuetify.js"}}},o=n(138),c=n(160),l=n.n(c),f=n(728),v=n(734),m=n(729),d=n(547),h=n(735),_=n(730),w=n(381),x=n(382),y=n(266),V=n(383),j=n(190),N=n(731),k=n(732),O=n(733),C=n(465),component=Object(o.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",{attrs:{dark:""}},[n("v-navigation-drawer",{attrs:{"mini-variant":t.miniVariant,clipped:t.clipped,fixed:"",app:""},model:{value:t.drawer,callback:function(e){t.drawer=e},expression:"drawer"}},[n("v-list",t._l(t.items,(function(e,i){return n("v-list-item",{key:i,attrs:{to:e.to,router:"",exact:""}},[n("v-list-item-action",[n("v-icon",[t._v(t._s(e.icon))])],1),t._v(" "),n("v-list-item-content",[n("v-list-item-title",{domProps:{textContent:t._s(e.title)}})],1)],1)})),1)],1),t._v(" "),n("v-app-bar",{attrs:{"clipped-left":t.clipped,fixed:"",app:""}},[n("v-app-bar-nav-icon",{on:{click:function(e){e.stopPropagation(),t.drawer=!t.drawer}}}),t._v(" "),n("v-btn",{attrs:{icon:""},on:{click:function(e){e.stopPropagation(),t.miniVariant=!t.miniVariant}}},[n("v-icon",[t._v("mdi-"+t._s("chevron-"+(t.miniVariant?"right":"left")))])],1),t._v(" "),n("v-btn",{attrs:{icon:""},on:{click:function(e){e.stopPropagation(),t.clipped=!t.clipped}}},[n("v-icon",[t._v("mdi-application")])],1),t._v(" "),n("v-btn",{attrs:{icon:""},on:{click:function(e){e.stopPropagation(),t.fixed=!t.fixed}}},[n("v-icon",[t._v("mdi-minus")])],1),t._v(" "),n("v-toolbar-title",{domProps:{textContent:t._s(t.title)}}),t._v(" "),n("v-spacer"),t._v(" "),n("v-btn",{attrs:{icon:""},on:{click:function(e){e.stopPropagation(),t.rightDrawer=!t.rightDrawer}}},[n("v-icon",[t._v("mdi-menu")])],1)],1),t._v(" "),n("v-main",[n("v-container",[n("Nuxt")],1)],1),t._v(" "),n("v-navigation-drawer",{attrs:{right:t.right,temporary:"",fixed:""},model:{value:t.rightDrawer,callback:function(e){t.rightDrawer=e},expression:"rightDrawer"}},[n("v-list",[n("v-list-item",{nativeOn:{click:function(e){t.right=!t.right}}},[n("v-list-item-action",[n("v-icon",{attrs:{light:""}},[t._v(" mdi-repeat ")])],1),t._v(" "),n("v-list-item-title",[t._v("Switch drawer (click me)")])],1)],1)],1),t._v(" "),n("v-footer",{attrs:{absolute:!t.fixed,app:""}},[n("span",[t._v("© "+t._s((new Date).getFullYear()))])])],1)}),[],!1,null,null,null);e.a=component.exports;l()(component,{VApp:f.a,VAppBar:v.a,VAppBarNavIcon:m.a,VBtn:d.a,VContainer:h.a,VFooter:_.a,VIcon:w.a,VList:x.a,VListItem:y.a,VListItemAction:V.a,VListItemContent:j.a,VListItemTitle:j.b,VMain:N.a,VNavigationDrawer:k.a,VSpacer:O.a,VToolbarTitle:C.a})},545:function(t,e,n){"use strict";var r={name:"EmptyLayout"},o=n(138),c=n(160),l=n.n(c),f=n(728),v=n(731),component=Object(o.a)(r,(function(){var t=this.$createElement,e=this._self._c||t;return e("v-app",{attrs:{light:""}},[e("v-main",[e("Nuxt")],1)],1)}),[],!1,null,null,null);e.a=component.exports;l()(component,{VApp:f.a,VMain:v.a})},546:function(t,e,n){"use strict";var r={name:"EmptyLayout"},o=n(138),c=n(160),l=n.n(c),f=n(728),v=n(731),component=Object(o.a)(r,(function(){var t=this.$createElement,e=this._self._c||t;return e("v-app",{attrs:{light:""}},[e("v-main",{staticClass:"grey lighten-4"},[e("Nuxt")],1)],1)}),[],!1,null,null,null);e.a=component.exports;l()(component,{VApp:f.a,VMain:v.a})},579:function(t,e,n){n(580),t.exports=n(581)},631:function(t,e,n){var content=n(632);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(56).default)("a07579c2",content,!0,{sourceMap:!1})},632:function(t,e,n){var r=n(55)(!1);r.push([t.i,"@import url(https://fonts.googleapis.com/css2?family=Kanit:wght@100;300;400;500;600;700&display=swap);"]),r.push([t.i,".custom-app-bar.custom-app-bar--white.v-toolbar,.custom-app-bar.v-toolbar{box-shadow:none!important;border-bottom:thin solid rgba(0,0,0,.12)!important}.custom-app-bar.custom-app-bar--white.v-toolbar>.v-toolbar__content,.custom-app-bar.v-toolbar>.v-toolbar__content{border:none!important}.custom-app-bar.custom-app-bar--white.v-toolbar{background-color:#fff!important}",""]),t.exports=r},703:function(t,e){},704:function(t,e){},712:function(t,e){},713:function(t,e){},714:function(t,e){},715:function(t,e){}},[[579,17,4,18]]]);