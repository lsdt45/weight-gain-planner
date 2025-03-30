import{d as S,x as c,s as D,c as V,w as e,a,N as E,e as l,g as o,f as L,k as r,l as k,i as x,E as T,m as F,n,H,q as f,F as v,G as d,I as i,J as y,t as _,K as I,B as b,j as P,r as R,b as z,o as m}from"./index-CTUB5UBe.js";import{u as M,S as j}from"./StepsNav-Be-LYjJV.js";import{_ as q}from"./_plugin-vue_export-helper-DlAUqK2U.js";const J={key:0,class:"loading-container"},K={key:1,class:"results-container"},U={style:{color:"white"}},Y=S({__name:"PlanGenerationView",setup(A){const g=z(),w=M(),p=c(!0),N=c(!1),u=c(null),C=()=>{p.value=!0,setTimeout(()=>{u.value=w.calculateNutrition(),p.value=!1,N.value=!0},1500)};D(()=>{C()});const G=()=>{g.push("/goal-setting")},B=()=>{g.push("/results")};return(O,t)=>(m(),V(a(E),{class:"layout"},{default:e(()=>[l(a(L),{class:"header"},{default:e(()=>t[0]||(t[0]=[o("div",{class:"header-content"},[o("h1",{class:"logo"},"增重计划助手")],-1)])),_:1}),l(a(P),{class:"content"},{default:e(()=>[l(a(r),{class:"plan-card"},{default:e(()=>[l(a(k),{vertical:"",size:"large"},{default:e(()=>[l(j,{current:3}),l(a(F),null,{default:e(()=>t[1]||(t[1]=[n("生成增重计划")])),_:1}),p.value?(m(),x("div",J,[l(a(H),{size:"large"}),l(a(f),{style:{"margin-top":"16px"}},{default:e(()=>t[2]||(t[2]=[n("正在计算您的个性化增重计划...")])),_:1})])):N.value?(m(),x("div",K,[l(a(f),null,{default:e(()=>t[3]||(t[3]=[n("基于您的个人数据，我们计算出以下营养需求：")])),_:1}),l(a(v),{cols:24,"x-gap":12,class:"stats-grid"},{default:e(()=>[l(a(d),{span:24,md:8},{default:e(()=>[l(a(r),{class:"stat-card"},{default:e(()=>{var s;return[l(a(i),{label:"基础代谢率 (BMR)",value:(s=u.value)==null?void 0:s.bmr},{suffix:e(()=>t[4]||(t[4]=[o("span",null,"kcal/天",-1)])),_:1},8,["value"])]}),_:1})]),_:1}),l(a(d),{span:24,md:8},{default:e(()=>[l(a(r),{class:"stat-card"},{default:e(()=>{var s;return[l(a(i),{label:"每日总消耗 (TDEE)",value:(s=u.value)==null?void 0:s.tdee},{suffix:e(()=>t[5]||(t[5]=[o("span",null,"kcal/天",-1)])),_:1},8,["value"])]}),_:1})]),_:1}),l(a(d),{span:24,md:8},{default:e(()=>[l(a(r),{class:"stat-card highlight"},{default:e(()=>{var s;return[l(a(i),{label:"增重所需热量",value:(s=u.value)==null?void 0:s.dailyCalories},{suffix:e(()=>t[6]||(t[6]=[o("span",null,"kcal/天",-1)])),_:1},8,["value"])]}),_:1})]),_:1})]),_:1}),l(a(y),null,{default:e(()=>t[7]||(t[7]=[n("每周增重目标")])),_:1}),l(a(r),{class:"weekly-goal-card"},{default:e(()=>[l(a(k),{vertical:""},{default:e(()=>[l(a(f),null,{default:e(()=>{var s;return[n("科学增重速度：每周 "+_((s=u.value)==null?void 0:s.weeklyGainGoal)+" kg",1)]}),_:1}),l(a(I),{type:"line",percentage:100,"indicator-placement":"inside",color:"#18a058",height:24},{default:e(()=>{var s;return[o("span",U,_((s=u.value)==null?void 0:s.weeklyGainGoal)+" kg/周",1)]}),_:1})]),_:1})]),_:1}),l(a(y),null,{default:e(()=>t[8]||(t[8]=[n("三大营养素分配")])),_:1}),l(a(v),{cols:24,"x-gap":12,class:"macros-grid"},{default:e(()=>[l(a(d),{span:24,md:8},{default:e(()=>[l(a(r),{class:"macro-card protein"},{default:e(()=>{var s;return[l(a(i),{label:"蛋白质",value:(s=u.value)==null?void 0:s.protein},{suffix:e(()=>t[9]||(t[9]=[o("span",null,"g/天",-1)])),_:1},8,["value"])]}),_:1})]),_:1}),l(a(d),{span:24,md:8},{default:e(()=>[l(a(r),{class:"macro-card carbs"},{default:e(()=>{var s;return[l(a(i),{label:"碳水化合物",value:(s=u.value)==null?void 0:s.carbs},{suffix:e(()=>t[10]||(t[10]=[o("span",null,"g/天",-1)])),_:1},8,["value"])]}),_:1})]),_:1}),l(a(d),{span:24,md:8},{default:e(()=>[l(a(r),{class:"macro-card fat"},{default:e(()=>{var s;return[l(a(i),{label:"脂肪",value:(s=u.value)==null?void 0:s.fat},{suffix:e(()=>t[11]||(t[11]=[o("span",null,"g/天",-1)])),_:1},8,["value"])]}),_:1})]),_:1})]),_:1}),l(a(v),{cols:24,"x-gap":12},{default:e(()=>[l(a(d),{span:12},{default:e(()=>[l(a(b),{block:"",onClick:G},{default:e(()=>t[12]||(t[12]=[n("返回")])),_:1})]),_:1}),l(a(d),{span:12},{default:e(()=>[l(a(b),{type:"primary",block:"",onClick:B},{default:e(()=>t[13]||(t[13]=[n("查看详细计划")])),_:1})]),_:1})]),_:1})])):T("",!0)]),_:1})]),_:1})]),_:1}),l(a(R),{class:"footer"},{default:e(()=>[l(a(f),null,{default:e(()=>[n("© "+_(new Date().getFullYear())+" 增重计划助手 | 专业健康增重方案",1)]),_:1})]),_:1})]),_:1}))}}),Z=q(Y,[["__scopeId","data-v-1e2bc692"]]);export{Z as default};
