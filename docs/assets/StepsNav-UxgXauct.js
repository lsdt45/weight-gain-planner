import{Y as F,Z as b,d as C,i as S,e as f,y as x,w as T,o as D}from"./index-X7_34GNW.js";import{_ as N}from"./_plugin-vue_export-helper-DlAUqK2U.js";const E=F("user",()=>{const r=b("user-data",{gender:"male",age:null,height:null,weight:null,activityLevel:"moderate",targetWeight:null,timeframe:8,bmr:null,tdee:null,dailyCalories:null,weeklyGainGoal:null,protein:null,carbs:null,fat:null}),h={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.9};function y(t){r.value={...r.value,...t}}function c(t){r.value={...r.value,...t}}function u(){const{gender:t,age:a,height:i,weight:o}=r.value;if(!a||!i||!o)return 0;let e=0;return t==="male"?e=88.362+13.397*o+4.799*i-5.677*a:e=447.593+9.247*o+3.098*i-4.33*a,Math.round(e)}function p(){const t=u(),a=h[r.value.activityLevel]||1.55;return Math.round(t*a)}function m(){const t=p(),{weight:a,targetWeight:i,activityLevel:o}=r.value;let e=400;if(a&&i&&i>a){const n=i-a;n<=3?e=300+n*33.33:n<=8?e=400+(n-3)*20:e=500+(n-8)*10,e=Math.min(600,e);const l=h[o]||1.55;l>=1.725?e*=1.1:l<=1.375&&(e*=.9)}return Math.round(t+e)}function g(){const{weight:t,targetWeight:a,timeframe:i}=r.value;if(!t||!a||a<=t)return .4;let e=(a-t)/i,n=.5;return t<60?n=.4:t>80&&(n=.6),e=Math.max(.25,Math.min(n,e)),parseFloat(e.toFixed(2))}function v(){const{weight:t,targetWeight:a,timeframe:i,activityLevel:o}=r.value;if(!t)return 0;let e=1.9;const n=h[o]||1.55;if(n>=1.725?e+=.1:n<=1.375&&(e-=.1),!a||a<=t)return Math.round(t*e);const l=(t+a)/2;return i<=6?e=Math.min(2.2,e+.2):i<=12?e=Math.min(2,e):e=Math.min(1.8,e-.1),Math.round(l*e)}function M(){const{weight:t,targetWeight:a,timeframe:i}=r.value,o=m();let e=.25;if(i<=6?e=.28:i<=12?e=.25:e=.22,a&&t&&a>t){const n=a-t;i<=6?e=Math.min(.3,Math.max(.26,e+n*.004)):i<=12?e=Math.min(.26,Math.max(.24,e+n*.002)):e=Math.min(.23,Math.max(.2,e+n*.003))}return Math.round(o*e/9)}function _(){const{weight:t,targetWeight:a,timeframe:i}=r.value,o=m(),e=v()*4,n=M()*9;let l=(o-e-n)/4,s=1;if(i<=6?s=1.03:i<=12?s=1.08:s=1.15,l*=s,a&&t&&a>t){const w=a-t;let d=1;i<=6?d=Math.min(1.15,Math.max(1.05,1+w*.015)):i<=12?d=Math.min(1.1,Math.max(1.03,1+w*.01)):d=Math.min(1.05,Math.max(1.01,1+w*.005)),l*=d}return Math.round(l)}function W(){const t=u(),a=p(),i=m(),o=g(),e=v(),n=M(),l=_();return r.value={...r.value,bmr:t,tdee:a,dailyCalories:i,weeklyGainGoal:o,protein:e,carbs:l,fat:n},{bmr:t,tdee:a,dailyCalories:i,weeklyGainGoal:o,protein:e,carbs:l,fat:n}}function G(){const{weight:t,targetWeight:a}=r.value;if(!t||!a||a<=t)return 0;const i=a-t,o=g();return Math.ceil(i/o)}function k(){const{weight:t,targetWeight:a,timeframe:i}=r.value;if(!t||!a)return[];const o=g(),e=i||G(),n=[];let l=t;for(let s=0;s<=e;s++)n.push({week:s,weight:parseFloat(l.toFixed(1))}),l+=o;return n}return{userData:r,updateUserInfo:y,updateGoalSettings:c,calculateBMR:u,calculateTDEE:p,calculateCaloriesForGain:m,calculateWeeklyGainGoal:g,calculateProtein:v,calculateFat:M,calculateCarbs:_,calculateNutrition:W,calculateTimeToGoal:G,generateWeightProjection:k}}),j={class:"steps-wrapper"},z=C({__name:"StepsNav",props:{current:{type:Number,required:!0},size:{type:String,default:"small"}},setup(r){return(h,y)=>{const c=x("n-step"),u=x("n-steps");return D(),S("div",j,[f(u,{current:r.current,size:r.size},{default:T(()=>[f(c,{title:"基本信息",description:"填写个人基础数据"}),f(c,{title:"设定目标",description:"设置增重目标"}),f(c,{title:"生成计划",description:"计算营养需求"}),f(c,{title:"查看结果",description:"获取详细计划"})]),_:1},8,["current","size"])])}}}),A=N(z,[["__scopeId","data-v-e1cae187"]]);export{A as S,E as u};
