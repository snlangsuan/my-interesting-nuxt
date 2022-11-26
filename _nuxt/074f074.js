(window.webpackJsonp=window.webpackJsonp||[]).push([[13,6],{1059:function(e,t,n){"use strict";n.r(t);n(94),n(12),n(9),n(10),n(17),n(11),n(18);var o=n(3),r=n(27),l=n(51),d=n(44),c=n(31),f=n(37),v=n(36),h=(n(91),n(28),n(223),n(176),n(26),n(80),n(72),n(138),n(6),n(833)),m=n(896),_=n.n(m),x=n(821);function y(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function w(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?y(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):y(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}function C(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=Object(c.a)(e);if(t){var r=Object(c.a)(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return Object(d.a)(this,n)}}var D=Object(f.a)((function e(t){return Object(v.a)(this,e),h.f.l1l2(t)}));D.className="L2",h.i.registerClass(D);var k=function(e){Object(l.a)(n,e);var t=C(n);function n(){return Object(v.a)(this,n),t.call(this,{})}return Object(f.a)(n,null,[{key:"className",get:function(){return"Lambda"}}]),n}(h.c.Layer);h.i.registerClass(k);var O={name:"AdDetectionPage",layout:"ml",data:function(){return{title:"Offline-advertising Detection",loading:{show:!1,message:""},databases:[],uploadDatabaseDialog:!1,createDatabaseValid:!0,createDatabase:{label:"",img:""},initializing:!0,databaseUploading:!1,testUploading:!1,isPreviewUploaded:!1,embeddingModel:null,screenWidth:100,canvasWidth:100,canvasHeight:100,testImg:null,bboxes:[],knn:null,hasProblem:!1,setMinimumConfidenceDialog:!1,tempMinimumConfidence:.7,minimumConfidence:.7,confidenceValid:!0}},head:function(){return{title:this.title}},mounted:function(){this.initialize()},methods:{initialize:function(){var e=this;return Object(r.a)(regeneratorRuntime.mark((function t(){var n,o,r;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,e.initializing=!0,e.loading.message="Getting model version...",e.loading.show=!0,t.next=6,e.getModelVersion();case 6:if(e.loading.message="Loading model...",!localStorage.getItem("detection-offline-ad")){t.next=15;break}return t.next=11,h.d("indexeddb://detection-offline-ad");case 11:n=t.sent,e.embeddingModel=n,t.next=22;break;case 15:return t.next=17,h.d("https://storage.googleapis.com/demo-ml-model/detection-offline-ad/model.json");case 17:return o=t.sent,e.embeddingModel=o,t.next=21,o.save("indexeddb://detection-offline-ad");case 21:localStorage.setItem("detection-offline-ad",!0);case 22:e.loading.message="Loading database...",e.loadDatabaseLocalStorage(),null!==(r=localStorage.getItem("offline-ad-confidence"))&&(e.minimumConfidence=Number(r)),t.next=31;break;case 28:t.prev=28,t.t0=t.catch(0),console.error(t.t0);case 31:return t.prev=31,e.initializing=!1,e.loading.show=!1,t.finish(31);case 35:case"end":return t.stop()}}),t,null,[[0,28,31,35]])})))()},onResize:function(){var e=document.querySelector("#workspace");if(this.screenWidth=window.innerWidth,e){var t=e.offsetWidth-32,n=this.screenWidth>560?.6:1;this.canvasWidth=Math.round(t*n),this.canvasHeight=this.canvasWidth}},resizeCanvas:function(){var e=document.querySelector("#workspace");e&&console.log(e.offsetWidth)},handleAddDatabase:function(){var e=this;if(this.$refs.database_form.validate())try{var t=JSON.parse(JSON.stringify(this.createDatabase));this.uploadDatabaseDialog=!1,this.databaseUploading=!0,this.loading.message="Adding Image to database...",this.loading.show=!0;var image=new Image;image.onload=function(){var n=e.getEmbedded(image),o=Date.now(),r=_()(o).toHex();e.databases.push({id:Date.now(),img:t.img,label:t.label,embedded:n,color:r}),e.trainingModel(e.databases),e.updateDatabaseLocalStorage(e.databases)},image.src=this.createDatabase.img}catch(e){}finally{this.databaseUploading=!1,this.createDatabase.img=null,this.createDatabase.label="",this.loading.show=!1}},handleOnRemoveDatabase:function(e){if(e)try{var t=this.databases.findIndex((function(t){return t.id===e}));t>-1&&(this.databases.splice(t,1),this.trainingModel(this.databases),this.updateDatabaseLocalStorage(this.databases))}catch(e){console.error("remove database error",e)}},handleOnUploadPreview:function(e,t){var n=this;return Object(r.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,n.testUploading=!0,n.loading.message="Finding Offline advertise...",n.loading.show=!0,n.isPreviewUploaded=!0,n.testImg=e,t.next=8,n.getOfflineAd(e.split(",")[1]);case 8:t.next=13;break;case 10:t.prev=10,t.t0=t.catch(0),console.error(t.t0);case 13:return t.prev=13,n.testUploading=!1,n.loading.show=!1,t.finish(13);case 17:case"end":return t.stop()}}),t,null,[[0,10,13,17]])})))()},getOfflineAd:function(image){var e=this;return Object(r.a)(regeneratorRuntime.mark((function t(){var body,n,o,r,i,l,d,c;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return body={image:image},t.next=3,e.$axios.$post("https://ad-detection-service-bxltsvmqda-as.a.run.app/ads/detection",body);case 3:return n=t.sent,t.next=6,e.$refs.image_canvas.getImageData(n.objects);case 6:for(i in o=t.sent,r=[],o)l=o[i],d=e.getEmbedded(l),(c=e.querySimilarity(d))&&r.push(w(w({},n.objects[i]),{},{object:c.label,score:c.score,color:c.color}));e.bboxes=r;case 10:case"end":return t.stop()}}),t)})))()},trainingModel:function(e){var t=e.map((function(e){return e.embedded})),n=e.map((function(e){return e.id}));this.knn={embedded:t,labels:n}},getEmbedded:function(img){var e=h.b.fromPixels(img).resizeNearestNeighbor([224,224]).toFloat().div(h.g(255)).expandDims();return this.embeddingModel.predict(e).arraySync()[0]},querySimilarity:function(e){var t=this.knn.embedded,n=this.knn.labels,o=-1,r=0;for(var i in t){var l=t[i],d=Object(x.cosineSimilarity)(l,e);d>r&&(o=n[i],r=d)}if(-1===o||r<this.minimumConfidence)return null;var c=this.queryDatabase(o);return{id:o,label:null==c?void 0:c.label,score:r,color:null==c?void 0:c.color}},queryDatabase:function(e){return this.databases.find((function(t){return t.id===e}))},handleOnDeletePreview:function(){this.testImg=null,this.bboxes=[],this.isPreviewUploaded=!1},handleOnDeleteDatabase:function(){try{this.databases=[],localStorage.removeItem("offline-ad-databases")}catch(e){console.error("remove database",e)}},handleOnUploadDatabase:function(){var e=this;this.uploadDatabaseDialog=!0,this.$nextTick((function(){e.$refs.database_form.reset(),e.$refs.database_form.resetValidation()}))},chkLabelDuplicate:function(label){return!this.databases.find((function(e){return e.label===label}))||"Label already exists."},handleOnReloadPage:function(){window.location.reload()},getModelVersion:function(){var e=this;return Object(r.a)(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.$axios.$get("https://storage.googleapis.com/demo-ml-model/detection-offline-ad/version.json");case 3:n=t.sent,localStorage.getItem("detection-offline-ad-version")!==n.version&&(localStorage.removeItem("detection-offline-ad"),window.indexedDB.deleteDatabase("detection-offline-ad"),localStorage.setItem("detection-offline-ad-version",n.version)),t.next=11;break;case 8:t.prev=8,t.t0=t.catch(0),e.hasProblem=!0;case 11:case"end":return t.stop()}}),t,null,[[0,8]])})))()},loadDatabaseLocalStorage:function(){try{var e=localStorage.getItem("offline-ad-databases");e&&(this.databases=JSON.parse(e),this.trainingModel(this.databases))}catch(e){console.error("load database error",e)}},updateDatabaseLocalStorage:function(e){try{localStorage.setItem("offline-ad-databases",JSON.stringify(e))}catch(e){console.error("update database error",e)}},handleOnSetMinimumConfidence:function(){this.tempMinimumConfidence=this.minimumConfidence,this.setMinimumConfidenceDialog=!0},handelOnSaveMinimumConfidence:function(){try{this.minimumConfidence=this.tempMinimumConfidence,this.setMinimumConfidenceDialog=!1,localStorage.setItem("offline-ad-confidence",this.minimumConfidence)}catch(e){console.error("update minimum confidence error",e)}},handleOnDecrement:function(){this.tempMinimumConfidence-=.1},handleOnIncrement:function(){this.tempMinimumConfidence+=.1}}},S=(n(997),n(67)),M=n(81),V=n.n(M),j=n(297),I=n(823),R=n(632),P=n(1051),A=n(1053),$=n(1054),z=n(199),U=n(171),L=n(200),B=n(133),F=n(95),W=n(1055),E=n(203),N=n(824),T=n(1056),H=n(464),J=n(1064),K=n(1057),Y=n(1018),X=n.n(Y),G=n(217),component=Object(S.a)(O,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{directives:[{name:"resize",rawName:"v-resize",value:e.onResize,expression:"onResize"}],staticClass:"ad-detection-page fill-height"},[n("div",{staticClass:"ad-detection__container"},[n("v-card",[n("v-card-title",{staticClass:"py-2"},[n("div",[e._v("Artwork")]),e._v(" "),n("v-spacer"),e._v(" "),n("v-menu",{attrs:{bottom:"",left:""},scopedSlots:e._u([{key:"activator",fn:function(t){var o=t.on,r=t.attrs;return[n("v-btn",e._g(e._b({attrs:{icon:""}},"v-btn",r,!1),o),[n("v-icon",[e._v("mdi-dots-vertical")])],1)]}}])},[e._v(" "),n("v-list",[n("v-list-item",{on:{click:e.handleOnSetMinimumConfidence}},[n("v-list-item-title",[e._v("Set Minimum Confidence")])],1),e._v(" "),n("v-list-item",{attrs:{disabled:e.databases.length<1},on:{click:e.handleOnDeleteDatabase}},[n("v-list-item-title",[e._v("Delete Database")])],1)],1)],1)],1),e._v(" "),n("v-divider"),e._v(" "),n("v-card-text",[e.databases.length>0?n("div",[e._v(e._s(e.databases.length)+" Annotation")]):n("div",[e._v("Add Annotation:")]),e._v(" "),n("div",{staticClass:"ad-detection-database"},[n("div",{staticClass:"ad-detection-upload-btn",on:{click:e.handleOnUploadDatabase}},[n("v-icon",{attrs:{size:"18"}},[e._v("mdi-tray-arrow-up")]),e._v(" "),n("div",{staticClass:"ad-detection-upload-btn__text"},[e._v("Upload")])],1),e._v(" "),n("div",{staticClass:"ad-detection-database-list"},[e._l(e.databases,(function(t){return[n("div",{key:t.id,staticClass:"ad-detection-database-item"},[n("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(o){var r=o.on,l=o.attrs;return[n("div",e._g(e._b({},"div",l,!1),r),[n("v-img",{attrs:{src:t.img,width:"100%",contain:""}}),e._v(" "),n("div",{staticClass:"ad-detection-database-item__remove"},[n("v-icon",{attrs:{color:"white"},on:{click:function(n){return e.handleOnRemoveDatabase(t.id)}}},[e._v("mdi-close-circle")])],1)],1)]}}],null,!0)},[e._v(" "),n("span",[e._v(e._s(t.label))])])],1)]}))],2)])])],1),e._v(" "),n("v-card",{staticClass:"mt-4",attrs:{id:"workspace"}},[n("v-card-title",{staticClass:"py-2"},[n("div",[e._v("Preview")]),e._v(" "),n("v-spacer"),e._v(" "),e.databases.length>0?n("v-menu",{attrs:{bottom:"",left:""},scopedSlots:e._u([{key:"activator",fn:function(t){var o=t.on,r=t.attrs;return[n("v-btn",e._g(e._b({attrs:{icon:""}},"v-btn",r,!1),o),[n("v-icon",[e._v("mdi-dots-vertical")])],1)]}}],null,!1,3221905750)},[e._v(" "),n("v-list",[n("v-list-item",{attrs:{disabled:!e.testImg},on:{click:e.handleOnDeletePreview}},[n("v-list-item-title",[e._v("Delete Preview")])],1)],1)],1):e._e()],1),e._v(" "),n("v-divider"),e._v(" "),e.databases.length>0&&!e.isPreviewUploaded?n("v-card-text",[n("upload-image-field",{ref:"upload_test",staticStyle:{width:"100%"},attrs:{"add-text":"Click to upload",accept:"image/jpeg"},on:{change:e.handleOnUploadPreview},model:{value:e.testImg,callback:function(t){e.testImg=t},expression:"testImg"}})],1):e.isPreviewUploaded?n("v-card-text",[n("div",{staticClass:"ad-detection-workspace",style:{display:e.screenWidth>560?"flex":"block"}},[n("div",{staticClass:"ad-detection-workspace__canvas"},[n("bounding-box-canvas",{ref:"image_canvas",attrs:{src:e.testImg,bboxes:e.bboxes,width:e.canvasWidth,height:e.canvasHeight}})],1),e._v(" "),n("div",{staticClass:"ad-detection-workspace__output"},[e.testUploading?e._e():n("div",{class:["ad-detection-results",{"pl-4":e.screenWidth>560}],style:{maxHeight:e.canvasHeight+"px"}},[n("div",{staticClass:"ad-detection-results__title"},[e._v("Predictions")]),e._v(" "),n("div",{staticClass:"ad-detection-results__subtitle",staticStyle:{"margin-bottom":"8px"}},[e._v(e._s(e.bboxes.length)+" objects")]),e._v(" "),e._l(e.bboxes,(function(t,i){return[n("div",{key:"res-"+i,staticClass:"ad-detection-results__item"},[n("div",{staticClass:"ad-detection-results__color-box",style:{backgroundColor:t.color}}),e._v(" "),n("div",{staticClass:"ad-detection-results__label"},[e._v("\n                    "+e._s(t.object)+"\n                  ")]),e._v(" "),n("div",{staticClass:"ad-detection-results__percent"},[n("v-progress-linear",{attrs:{value:100*t.score,height:"18"}},[n("div",{staticStyle:{width:"100%"}},[n("div",{staticClass:"white--text text-right",style:{width:Math.ceil(100*t.score)+"%",paddingRight:"8px"}},[e._v(e._s(Math.ceil(100*t.score))+"%")])])])],1)])]}))],2)])])]):n("v-card-text",[e._v("\n        You must add artwork on top panel before you can preview it here\n      ")])],1)],1),e._v(" "),n("v-dialog",{attrs:{"max-width":"480",persistent:""},model:{value:e.uploadDatabaseDialog,callback:function(t){e.uploadDatabaseDialog=t},expression:"uploadDatabaseDialog"}},[n("v-card",[n("v-card-title",[e._v("Add new artwork")]),e._v(" "),n("v-card-text",{staticClass:"pb-0"},[n("v-form",{ref:"database_form",on:{submit:function(e){e.preventDefault()}},model:{value:e.createDatabaseValid,callback:function(t){e.createDatabaseValid=t},expression:"createDatabaseValid"}},[n("v-text-field",{attrs:{label:"Label",rules:[function(e){return!!e||"Enter label name"},e.chkLabelDuplicate],dense:"",outlined:""},model:{value:e.createDatabase.label,callback:function(t){e.$set(e.createDatabase,"label",t)},expression:"createDatabase.label"}}),e._v(" "),n("upload-image-field",{ref:"upload_database",staticStyle:{width:"100%"},attrs:{rules:[function(e){return!!e||"Enter image"}],"add-text":"Click to upload",accept:"image/jpeg"},model:{value:e.createDatabase.img,callback:function(t){e.$set(e.createDatabase,"img",t)},expression:"createDatabase.img"}})],1)],1),e._v(" "),n("v-card-actions",[n("v-spacer"),e._v(" "),n("v-btn",{attrs:{text:""},on:{click:function(t){e.uploadDatabaseDialog=!1}}},[e._v("cancel")]),e._v(" "),n("v-btn",{attrs:{color:"primary",text:""},on:{click:e.handleAddDatabase}},[e._v("add")])],1)],1)],1),e._v(" "),n("v-overlay",{model:{value:e.loading.show,callback:function(t){e.$set(e.loading,"show",t)},expression:"loading.show"}},[n("div",{staticClass:"ad-detection__overlay-box"},[e._v(e._s(e.loading.message))])]),e._v(" "),n("v-dialog",{attrs:{"max-width":"640",persistent:""},model:{value:e.hasProblem,callback:function(t){e.hasProblem=t},expression:"hasProblem"}},[n("v-card",[n("v-card-text",{staticClass:"py-4 text-center"},[n("div",{staticClass:"py-3"},[n("v-icon",{attrs:{color:"primary",size:"48"}},[e._v("mdi-connection")])],1),e._v(" "),n("div",{staticClass:"text-h6"},[e._v("Something went wrong...")]),e._v(" "),n("div",{staticClass:"text-body-2 pb-6"},[e._v("We are working on fixing the problem Please try again.")]),e._v(" "),n("v-btn",{attrs:{color:"primary",plain:""},on:{click:e.handleOnReloadPage}},[n("v-icon",{attrs:{left:""}},[e._v("mdi-refresh")]),e._v("\n          Refresh Page\n        ")],1)],1)],1)],1),e._v(" "),n("v-dialog",{attrs:{"max-width":"320",persistent:""},model:{value:e.setMinimumConfidenceDialog,callback:function(t){e.setMinimumConfidenceDialog=t},expression:"setMinimumConfidenceDialog"}},[n("v-card",[n("v-card-title",[e._v("Minimum Confidence")]),e._v(" "),n("v-card-text",{staticClass:"pb-0"},[n("div",{staticClass:"text-h4 font-weight-light"},[e._v("\n          "+e._s(e.tempMinimumConfidence)+"\n        ")]),e._v(" "),n("v-slider",{attrs:{max:"1",min:"0",step:"0.1",color:"primary","track-color":"grey","always-dirty":"","hide-details":""},scopedSlots:e._u([{key:"prepend",fn:function(){return[n("v-icon",{attrs:{color:"primary"},on:{click:e.handleOnDecrement}},[e._v("\n              mdi-minus\n            ")])]},proxy:!0},{key:"append",fn:function(){return[n("v-icon",{attrs:{color:"primary"},on:{click:e.handleOnIncrement}},[e._v("\n              mdi-plus\n            ")])]},proxy:!0}]),model:{value:e.tempMinimumConfidence,callback:function(t){e.tempMinimumConfidence=t},expression:"tempMinimumConfidence"}})],1),e._v(" "),n("v-card-actions",[n("v-spacer"),e._v(" "),n("v-btn",{attrs:{text:""},on:{click:function(t){e.setMinimumConfidenceDialog=!1}}},[e._v("cancel")]),e._v(" "),n("v-btn",{attrs:{color:"primary",text:""},on:{click:e.handelOnSaveMinimumConfidence}},[e._v("Save")])],1)],1)],1)],1)}),[],!1,null,"323f7606",null);t.default=component.exports;V()(component,{UploadImageField:n(834).default,BoundingBoxCanvas:n(835).default}),V()(component,{VBtn:j.a,VCard:I.a,VCardActions:R.a,VCardText:R.b,VCardTitle:R.c,VDialog:P.a,VDivider:A.a,VForm:$.a,VIcon:z.a,VImg:U.a,VList:L.a,VListItem:B.a,VListItemTitle:F.b,VMenu:W.a,VOverlay:E.a,VProgressLinear:N.a,VSlider:T.a,VSpacer:H.a,VTextField:J.a,VTooltip:K.a}),X()(component,{Resize:G.a})},591:function(e,t,n){var content=n(704);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(25).default)("6b30970d",content,!0,{sourceMap:!1})},592:function(e,t,n){var content=n(706);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(25).default)("2a1d359e",content,!0,{sourceMap:!1})},703:function(e,t,n){"use strict";n(591)},704:function(e,t,n){var o=n(24)(!1);o.push([e.i,"@import url(https://fonts.googleapis.com/css2?family=Kanit:wght@100;300;400;500;600;700&display=swap);"]),o.push([e.i,".upload-field[data-v-17bc6f95]{position:relative}.upload-field__content[data-v-17bc6f95]{border:thin dashed #1967d2!important;border-radius:4px;padding:8px;display:flex;align-items:center;justify-content:center;position:relative;margin-bottom:4px;width:100%;height:240px;background-color:#e8f0fe;overflow:hidden;z-index:99;color:#1967d2!important}.upload-field__content *[data-v-17bc6f95]{pointer-events:none}.upload-field__content>input[data-v-17bc6f95]{display:none}.upload-field__drop-zone[data-v-17bc6f95]{text-align:center}.upload-field--error[data-v-17bc6f95]{border:2px solid #ff5252!important}.upload-field__disabled[data-v-17bc6f95]{position:absolute;top:0;bottom:0;left:0;right:0}.upload-field__details[data-v-17bc6f95]{margin-bottom:8px;padding:0 12px;display:flex;flex:1 0 auto;max-width:100%;min-height:14px;overflow:hidden}.upload-field__details--hide[data-v-17bc6f95]{display:none!important}.upload-field--readonly[data-v-17bc6f95]{cursor:auto}.upload-field:hover .upload-field__image--remove[data-v-17bc6f95]{display:flex}.upload-field:hover .upload-field__image--remove>*[data-v-17bc6f95]{pointer-events:auto}.upload-field__image[data-v-17bc6f95],.upload-field__image--remove[data-v-17bc6f95]{position:absolute;left:0;right:0;top:0;bottom:0}.upload-field__image--remove[data-v-17bc6f95]{display:none;z-index:1;background-color:rgba(0,0,0,.25);align-items:center;justify-content:center}.upload-field__normal[data-v-17bc6f95]{text-align:center}.upload-field__normal>i[data-v-17bc6f95]{color:#1967d2}.upload-field__normal>div>div[data-v-17bc6f95]{display:inline-block;text-decoration:underline;cursor:pointer;pointer-events:auto}",""]),e.exports=o},705:function(e,t,n){"use strict";n(592)},706:function(e,t,n){var o=n(24)(!1);o.push([e.i,"@import url(https://fonts.googleapis.com/css2?family=Kanit:wght@100;300;400;500;600;700&display=swap);"]),o.push([e.i,".bbox__container[data-v-5aa31d42]{display:flex;align-items:center;justify-content:center;background-color:rgba(0,0,0,.04)}",""]),e.exports=o},718:function(e,t){},719:function(e,t){},727:function(e,t){},767:function(e,t){},768:function(e,t){},769:function(e,t){},821:function(e,t,n){"use strict";n.r(t),n.d(t,"dotp",(function(){return r})),n.d(t,"cosineSimilarity",(function(){return l}));n(6),n(72);var o=n(712),r=function(e,t){return e.map((function(a,i){return e[i]*t[i]})).reduce((function(a,b){return a+b}),0)},l=function(a,b){return o.a.cosine(a,b)}},822:function(e,t,n){var content=n(998);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(25).default)("5a8edcb3",content,!0,{sourceMap:!1})},834:function(e,t,n){"use strict";n.r(t);n(47),n(6),n(33),n(62),n(48),n(26),n(9),n(63),n(66),n(49);var o=n(21),r=n(702),l=n.n(r);function d(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return c(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return c(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var i=0,o=function(){};return{s:o,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,l=!0,d=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return l=e.done,e},e:function(e){d=!0,r=e},f:function(){try{l||null==n.return||n.return()}finally{if(d)throw r}}}}function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,n=new Array(t);i<t;i++)n[i]=e[i];return n}var f={name:"UploadImageField",extends:n(517).a,inject:{form:{default:null}},props:{value:{type:String,default:""},accept:{type:String,default:"image/png,image/jpg"},imageMaxDimension:{type:Array,default:function(){return[640,640]}}},data:function(){return{localVal:"",original:null,fileCompressor:null,isDragging:!1,processing:!1}},watch:{value:function(e){this.localVal=e}},mounted:function(){this.valid=!0,this.localVal=this.value},methods:{validate:function(e,t){if(e){var n=[];t=t||this.localVal,e&&(this.hasInput=this.hasFocused=!0);var r,l=d(this.rules);try{for(l.s();!(r=l.n()).done;){var c=r.value,f="function"==typeof c?c(t):c;"string"==typeof f?n.push(f):"boolean"!=typeof f&&console.error("Rules should return a string or boolean, received '".concat(Object(o.a)(f),"' instead"),this)}}catch(e){l.e(e)}finally{l.f()}return this.errorBucket=n,this.valid=0===n.length,this.valid}},reset:function(){this.valid=!0,this.localVal="",this.original=null,this.errorBucket=[],this.$emit("input",this.localVal)},resetValidation:function(){this.valid=!0,this.errorBucket=[]},getFile:function(){return this.original},handelOnChangeFile:function(){this.onConvertImage()},handelOnDrop:function(e){if(e.preventDefault(),!this.disabled&&!this.localVal){this.isDragging=!1;var t=e.dataTransfer.files;this.$refs.picture_upload.files=t,this.onConvertImage()}},handelOnDragEnter:function(e){e.preventDefault(),this.disabled||this.localVal||(this.isDragging=!0)},handleOnDragLeave:function(e){this.disabled||this.localVal||(this.isDragging=!1)},handleDragOver:function(e){this.disabled||this.localVal||e.preventDefault()},onConvertImage:function(){var e=this,input=this.$refs.picture_upload.files;if(input&&input.length>0){var t=input[0];if("image/jpeg"!==t.type)return this.errorBucket.push("File not support"),void(this.valid=!1);this.processing=!0;this.fileCompressor=new l.a(t,{convertSize:5e6,maxWidth:this.imageMaxDimension[0],maxHeight:this.imageMaxDimension[1],success:function(t){var n=new FileReader;n.onload=e.onRead,n.readAsDataURL(t),e.original=t}})}},onRead:function(e){console.log("read"),this.localVal=e.target.result,this.$emit("input",this.localVal),this.$emit("change",this.localVal,this.original),this.$refs.picture_upload.value=null,this.$refs.picture_upload.type="text",this.$refs.picture_upload.type="file",this.validate(!0,this.localVal),this.processing=!1},handelOnRemove:function(){this.localVal="",this.original=null,this.$emit("input",this.localVal),this.$emit("change",this.localVal,this.original),this.validate(!0,this.localVal)}}},v=(n(703),n(67)),h=n(81),m=n.n(h),_=n(202),x=n(199),y=n(171),w=n(512),component=Object(v.a)(f,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"upload-field",attrs:{id:e.id}},[n("div",{class:["upload-field__content",{"upload-field--error":!e.valid,"upload-field--disabled":e.disabled},{"upload-field-drop":e.isDragging}],attrs:{id:"upload_content"},on:{drop:e.handelOnDrop,dragover:e.handleDragOver,dragenter:e.handelOnDragEnter,dragleave:e.handleOnDragLeave}},[n("input",{ref:"picture_upload",attrs:{type:"file",alt:"",title:"",accept:e.accept},on:{input:e.handelOnChangeFile}}),e._v(" "),e.localVal?n("div",{staticClass:"upload-field__image"},[n("div",{staticClass:"upload-field__image--remove"},[n("v-icon",{attrs:{color:"white"},on:{click:e.handelOnRemove}},[e._v("mdi-delete")])],1),e._v(" "),n("v-img",{staticClass:"grey lighten-4",attrs:{src:e.localVal,width:"100%",height:"100%",contain:""}})],1):e.isDragging?n("div",{staticClass:"upload-field__drop-zone"},[n("v-avatar",{attrs:{color:"#1967d2"}},[n("v-icon",{attrs:{dark:""}},[e._v("mdi-tray-arrow-up")])],1),e._v(" "),n("div",{staticClass:"mt-4 text-subtitle-1 font-weight-light"},[e._v("Drop your image to here")])],1):n("div",{staticClass:"upload-field__normal"},[n("v-icon",{attrs:{size:"32"}},[e._v("mdi-image")]),e._v(" "),n("div",{staticClass:"text-subtitle-1 font-weight-light"},[e._v("Drag and drop or "),n("div",{on:{click:function(t){return e.$refs.picture_upload.click()}}},[e._v("browse")])])],1)]),e._v(" "),n("div",{class:["upload-field__details",{"upload-field__details--hide":e.hideDetails}]},[e.errorBucket.length<1&&e.hint&&(e.persistentHint||e.isFocused)?n("VMessages",{attrs:{value:[e.hint]}}):e._e(),e._v(" "),n("VMessages",{attrs:{value:e.errorBucket,color:"error"}})],1)])}),[],!1,null,"17bc6f95",null);t.default=component.exports;m()(component,{VAvatar:_.a,VIcon:x.a,VImg:y.a,VMessages:w.a})},835:function(e,t,n){"use strict";n.r(t);var o=n(27);n(91),n(28),n(72),n(47),n(6),n(33),n(62),n(48),n(26),n(9),n(63),n(66),n(49);function r(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return l(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return l(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var i=0,o=function(){};return{s:o,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,d=!0,c=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return d=e.done,e},e:function(e){c=!0,r=e},f:function(){try{d||null==n.return||n.return()}finally{if(c)throw r}}}}function l(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,n=new Array(t);i<t;i++)n[i]=e[i];return n}var d={name:"BoundingBoxCanvas",props:{width:{type:Number,default:100},height:{type:Number,default:100},src:{type:String,default:null},bboxes:{type:Array,default:function(){return[]}}},data:function(){return{stageConfig:{width:100,height:100,scaleX:.5,scaleY:.5},imageConfig:{image:null,width:100,height:100,x:0,y:0},shapes:[],imageFactor:1}},watch:{src:function(e){this.loadImage(e)},bboxes:function(e){this.loadBox(e)},width:function(e){this.updateStageSize()}},mounted:function(){this.loadImage(this.src),this.loadBox(this.bboxes)},methods:{loadImage:function(e){var t=this;if(e){var image=new Image;image.onload=function(){t.imageConfig.image=image,t.imageConfig.width=image.width,t.imageConfig.height=image.height,t.updateStageSize()},image.src=e}},loadBox:function(e){if(Array.isArray(e)){var t=e.map((function(e,i){return{rotation:0,x:e.rectangle.x,y:e.rectangle.y,width:e.rectangle.width,height:e.rectangle.height,stroke:e.color,fill:e.color,strokeWidth:5,opacity:.6}}));this.shapes=t}},updateStageSize:function(){var e=Math.min(this.width/this.imageConfig.width,this.height/this.imageConfig.height);this.imageFactor=e;var t=this.calculateAspectRatioFit(this.imageConfig.width,this.imageConfig.height,this.width,this.height);this.stageConfig.width=t.width,this.stageConfig.height=t.height,this.stageConfig.scaleX=1*e,this.stageConfig.scaleY=1*e},calculateAspectRatioFit:function(e,t,n,o){var r=Math.min(n/e,o/t);return{width:e*r,height:t*r}},getImageData:function(e){var t=this;return Object(o.a)(regeneratorRuntime.mark((function n(){var o,l,d,c,f,v,h,m,_,x,y,img;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:o=t.$refs.background.getNode(),l=o.width()/t.stageConfig.width,d=o.height()/t.stageConfig.height,c=[],f=r(e),n.prev=5,f.s();case 7:if((v=f.n()).done){n.next=19;break}return h=v.value,m=parseInt(Math.round(h.rectangle.x/l)),_=parseInt(Math.round(h.rectangle.y/d)),x=parseInt(Math.round(h.rectangle.width/l)),y=parseInt(Math.round(h.rectangle.height/d)),n.next=15,o.toImage({x:m,y:_,width:x,height:y});case 15:img=n.sent,c.push(img);case 17:n.next=7;break;case 19:n.next=24;break;case 21:n.prev=21,n.t0=n.catch(5),f.e(n.t0);case 24:return n.prev=24,f.f(),n.finish(24);case 27:return n.abrupt("return",c);case 28:case"end":return n.stop()}}),n,null,[[5,21,24,27]])})))()},reset:function(){this.imageConfig.image=null,this.shapes=[]}}},c=(n(705),n(67)),component=Object(c.a)(d,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"bbox__container",style:{width:e.width+"px",height:e.height+"px"}},[n("v-stage",{ref:"stage",staticClass:"bbox__stage",attrs:{config:e.stageConfig}},[n("v-layer",{ref:"layer"},[n("v-image",{ref:"background",attrs:{config:e.imageConfig}}),e._v(" "),e._l(e.shapes,(function(e,i){return[n("v-rect",{key:"shape-"+i,attrs:{config:e}})]}))],2)],1)],1)}),[],!1,null,"5aa31d42",null);t.default=component.exports},907:function(e,t){},909:function(e,t){},919:function(e,t){},921:function(e,t){},946:function(e,t){},947:function(e,t){},952:function(e,t){},954:function(e,t){},961:function(e,t){},980:function(e,t){},997:function(e,t,n){"use strict";n(822)},998:function(e,t,n){var o=n(24)(!1);o.push([e.i,"@import url(https://fonts.googleapis.com/css2?family=Kanit:wght@100;300;400;500;600;700&display=swap);"]),o.push([e.i,".ad-detection-page[data-v-323f7606]{padding:8px;display:flex;align-items:center;justify-content:center}.ad-detection-database[data-v-323f7606]{padding-top:8px;display:flex}.ad-detection-database-list[data-v-323f7606]{overflow:hidden;overflow-x:auto;margin-left:8px;display:flex}.ad-detection-database-item[data-v-323f7606]{width:58px;height:58px;position:relative}.ad-detection-database-item:hover .ad-detection-database-item__remove[data-v-323f7606]{display:flex;align-items:center;justify-content:center;cursor:pointer}.ad-detection-database-item__remove[data-v-323f7606]{display:none;position:absolute;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,.2)}.ad-detection-database-list>.ad-detection-database-item+.ad-detection-database-item[data-v-323f7606]{margin-left:4px}.ad-detection-workspace[data-v-323f7606]{display:flex}.ad-detection-workspace__canvas[data-v-323f7606]{flex:0}.ad-detection-workspace__output[data-v-323f7606]{flex:1}.ad-detection__overlay-box[data-v-323f7606]{min-width:320px;text-align:center;background-color:#fff;padding:32px 16px;color:#212121;border-radius:4px}.ad-detection__container[data-v-323f7606]{max-width:800px;width:100%;margin:auto}.ad-detection-upload-btn[data-v-323f7606]{width:72px;height:58px;padding:4px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;background-color:#e8f0fe;border-radius:4px;cursor:pointer;position:relative}.ad-detection-upload-btn>input[data-v-323f7606]{display:none}.ad-detection-upload-btn>.ad-detection-upload-btn__text[data-v-323f7606],.ad-detection-upload-btn>i[data-v-323f7606]{color:#1967d2}.ad-detection-upload-btn>.ad-detection-upload-btn__text[data-v-323f7606]{font-size:.8rem}.ad-detection-upload-btn[data-v-323f7606]:hover{background-color:#d2e3fc}.ad-detection-results[data-v-323f7606]{overflow:hidden;overflow-y:auto}.ad-detection-results__title[data-v-323f7606]{font-size:1.1rem;font-weight:600}.ad-detection-results__item[data-v-323f7606]{display:flex;align-items:center;padding:16px 0}.ad-detection-results__color-box[data-v-323f7606]{width:5px;min-height:100%;margin-right:8px;align-self:stretch}.ad-detection-results__label[data-v-323f7606]{margin-right:8px;max-width:30%;width:30%}.ad-detection-results__percent[data-v-323f7606]{flex:1}",""]),e.exports=o}}]);