(function(){"use strict";var t={9678:function(t,e,n){var a=n(7195),i=function(){var t=this,e=t._self._c;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},l=[],s={name:"app"},o=s,r=n(1001),u=(0,r.Z)(o,i,l,!1,null,null,null),c=u.exports,d=n(2241),f=function(){var t=this,e=t._self._c;return e("div",{staticClass:"board-main"},[e("div",{staticClass:"board-body"},[e("div",{staticClass:"find-func"},[e("p",{staticClass:"find-func-text"},[t._v(" 查询方法： ")]),e("el-select",{attrs:{placeholder:"请选择"},model:{value:t.findFunc,callback:function(e){t.findFunc=e},expression:"findFunc"}},t._l(t.options,(function(t){return e("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})})),1)],1),e("div",{staticClass:"find"},[0===t.findFunc?e("div",[e("el-input",{attrs:{placeholder:"请输入用户uid"},model:{value:t.findData,callback:function(e){t.findData=e},expression:"findData"}})],1):t._e(),4===t.findFunc?e("div",[e("el-input",{attrs:{placeholder:"请输入用户名"},model:{value:t.findData,callback:function(e){t.findData=e},expression:"findData"}})],1):t._e(),2===t.findFunc?e("div",{staticClass:"aoe-find"},[e("p",{staticClass:"find-text"},[t._v(" 当前查询范围为播放量从 ")]),e("el-input",{staticClass:"input no-number",attrs:{min:1,max:49901,step:1},model:{value:t.input,callback:function(e){t.input=t._n(e)},expression:"input"}}),e("p",[t._v(" 开始，每组 ")]),e("el-input",{staticClass:"input no-number",attrs:{min:1,max:49901,step:1},model:{value:t.scope,callback:function(e){t.scope=t._n(e)},expression:"scope"}}),e("p",[t._v(" 个 ")])],1):t._e()]),e("div",{staticClass:"btn"},[2===t.findFunc?e("el-button",{attrs:{type:"info",plain:""},on:{click:function(e){t.input-=10}}},[t._v("上一组")]):e("el-button",{attrs:{type:"info",plain:""},on:{click:function(e){return t.toFind(-1)}}},[t._v("上一个")]),2===t.findFunc?e("el-button",{attrs:{type:"primary",plain:""},on:{click:function(e){t.input+=10}}},[t._v("下一组")]):e("el-button",{attrs:{type:"primary",plain:""},on:{click:function(e){return t.toFind(1)}}},[t._v("下一个")])],1),e("div",{staticClass:"body"},[e("div",{ref:"s2Table",staticClass:"table"}),e("div",{staticClass:"chart",attrs:{id:"container"}})]),e("div",{staticClass:"bottom"},[e("p",{staticClass:"ins"},[t._v("数据来源："),e("el-link",{attrs:{href:"https://space.bilibili.com/2654670",type:"primary"}},[t._v("狸子")]),t._v("，技术支持："),e("el-link",{attrs:{href:"https://space.bilibili.com/391117803",type:"primary"}},[t._v("霜序廿")])],1),e("p",{staticClass:"remark"},[t._v("数据截止至23年7月初")])])])])},h=[],p=(n(7658),n(937)),v=n(6341),b=n(1579);let m={},g={},D={};var y={name:"MyBoard",data(){return{input:1,findFunc:4,scope:10,options:[{value:0,label:"uid搜索"},{value:4,label:"用户名搜索"},{value:2,label:"范围搜索"}],sortSelectKey:1,sortKeyOptions:[{value:1,label:"播放量"},{value:2,label:"视频数"},{value:3,label:"粉丝数"}],sortSelectMethod:2,sortMethodOptions:[{value:1,label:"升序"},{value:2,label:"降序"}],allData:[],getData:[],findData:"",cellHeight:30,nowIndex:0}},watch:{input:{handler(t,e){t<1?this.input=1:t+this.scope>5e4&&(this.input=5e4-this.scope),this.getData=this.allData.slice(t,t+this.scope),g.changeData(this.getData)}},scope:{handler(t,e){t<1?this.scope=1:t+this.input>5e4&&(this.scope=5e4-this.input),this.getData=this.allData.slice(t,t+this.scope),g.changeData(this.getData)}},findData:{handler(t,e){this.debounce(this.getFindRes,500)},deep:!0},sortSelectKey:{handler(t,e){this.getNewAllData()}},sortSelectMethod:{handler(t,e){this.getNewAllData()}}},created(){fetch("https://bili-up-show-1300739927.cos.ap-nanjing.myqcloud.com/data50000.json").then((t=>t.json())).then((t=>{this.allData=t,this.getData=this.allData.slice(0,10),this.getAntvChart(),this.getTable()}))},mounted(){},methods:{getAntvChart(){m=new p.kL({container:"container",theme:"classic",autoFit:!0}),g=m.point().data({value:this.getData}).encode("x","播放量").encode("y","视频数").axis("x",{labelAutoHide:!0,labelAutoRotate:!1}).label({text:"name",transform:[{type:"overlapDodgeY"}],style:{stroke:"#fff",textAnchor:"start",textBaseline:"middle",dx:10,position:"left",fontSize:10,lineWidth:2}}),m.render()},getTable(){const t=this.$refs.s2Table,e={fields:{columns:["upid","name","播放量","播放量排名","播放时长","播放时长排名","视频数","粉丝数","粉丝数排名"]},meta:[{field:"upid",name:"用户id"},{field:"name",name:"昵称"}],data:this.allData},n={width:590,height:500,style:{cellCfg:{width:120}}};D=new v.HZt(t,e,n),D.render();const a=(0,b.debounce)(((t,e)=>{D.changeSheetSize(t,e),D.render(!1)}),200),i=new ResizeObserver((([t]=[])=>{const[e]=t.borderBoxSize||[];a(e.inlineSize,e.blockSize)}));i.observe(t),D.on(v.ch4.LAYOUT_RESIZE_ROW_HEIGHT,(t=>{this.cellHeight=t.info.resizedHeight}))},getFindRes(){if(this.getData=[],""===this.findData)this.getData=this.allData.slice(0,this.scope);else if(0===this.findFunc)for(let t=0;t<this.allData.length;t++)-1!==this.allData[t].upid.indexOf(this.findData)&&this.getData.push(this.allData[t]);else if(4===this.findFunc)for(let t=0;t<this.allData.length;t++)-1!==this.allData[t].name.indexOf(this.findData)&&this.getData.push(this.allData[t]);this.nowIndex=0,D.updateScrollOffset({offsetY:{value:this.cellHeight*(this.getData[this.nowIndex]["播放量排名"]-1),animate:!0}}),g.changeData(this.getData)},debounce(t,e){null!==this.timer&&clearTimeout(this.timer),this.timer=setTimeout(t,e)},toFind(t){const e=this.getData.length;this.nowIndex+t<0||this.nowIndex+t>=e||(this.nowIndex+=t,D.updateScrollOffset({offsetY:{value:this.cellHeight*(this.getData[this.nowIndex]["播放量排名"]-1),animate:!0}}))},getNewAllData(){}}},x=y,_=(0,r.Z)(x,f,h,!1,null,"6540f72d",null),w=_.exports;a["default"].use(d.ZP);const O=[{path:"/",redirect:"/myboard"},{path:"/myboard",component:w}],k=new d.ZP({routes:O});var C=k,S=n(408);a["default"].use(S.ZP);var F=new S.ZP.Store({state:{},getters:{},mutations:{},actions:{},modules:{}}),j=n(6694),T=n.n(j),A=n(59),H=n.n(A),I=n(9018),M=n.n(I),P=n(7149),Z=n.n(P),z=n(342),E=n.n(z),R=n(2661),Y=n.n(R),B=n(6151),K=n.n(B);a["default"].use(K()),a["default"].use(Y()),a["default"].use(E()),a["default"].use(Z()),a["default"].use(M()),a["default"].use(H()),a["default"].use(T()),a["default"].config.productionTip=!1,new a["default"]({router:C,store:F,render:t=>t(c)}).$mount("#app")}},e={};function n(a){var i=e[a];if(void 0!==i)return i.exports;var l=e[a]={id:a,loaded:!1,exports:{}};return t[a].call(l.exports,l,l.exports,n),l.loaded=!0,l.exports}n.m=t,function(){var t=[];n.O=function(e,a,i,l){if(!a){var s=1/0;for(c=0;c<t.length;c++){a=t[c][0],i=t[c][1],l=t[c][2];for(var o=!0,r=0;r<a.length;r++)(!1&l||s>=l)&&Object.keys(n.O).every((function(t){return n.O[t](a[r])}))?a.splice(r--,1):(o=!1,l<s&&(s=l));if(o){t.splice(c--,1);var u=i();void 0!==u&&(e=u)}}return e}l=l||0;for(var c=t.length;c>0&&t[c-1][2]>l;c--)t[c]=t[c-1];t[c]=[a,i,l]}}(),function(){n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,{a:e}),e}}(),function(){n.d=function(t,e){for(var a in e)n.o(e,a)&&!n.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:e[a]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){n.hmd=function(t){return t=Object.create(t),t.children||(t.children=[]),Object.defineProperty(t,"exports",{enumerable:!0,set:function(){throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+t.id)}}),t}}(),function(){n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){n.nmd=function(t){return t.paths=[],t.children||(t.children=[]),t}}(),function(){var t={143:0};n.O.j=function(e){return 0===t[e]};var e=function(e,a){var i,l,s=a[0],o=a[1],r=a[2],u=0;if(s.some((function(e){return 0!==t[e]}))){for(i in o)n.o(o,i)&&(n.m[i]=o[i]);if(r)var c=r(n)}for(e&&e(a);u<s.length;u++)l=s[u],n.o(t,l)&&t[l]&&t[l][0](),t[l]=0;return n.O(c)},a=self["webpackChunkbili_up_show"]=self["webpackChunkbili_up_show"]||[];a.forEach(e.bind(null,0)),a.push=e.bind(null,a.push.bind(a))}();var a=n.O(void 0,[998],(function(){return n(9678)}));a=n.O(a)})();
//# sourceMappingURL=app.63ab88ed.js.map