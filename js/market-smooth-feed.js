(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const CADENCE=1000;
const SWITCH_SETTLE=1600;
const feeds=[
 {selector:'[data-asks]',type:'book',loading:'SYNCING LIVE ASKS…'},
 {selector:'[data-bids]',type:'book',loading:'SYNCING LIVE BIDS…'},
 {selector:'[data-trades]',type:'trade',loading:'SYNCING LIVE TRADES…'}
];
const states=[];
let assetGeneration=0;
function validHTML(source,type){const row=type==='book'?'.book-row':'.trade-row';return source.querySelector(row)?source.innerHTML:''}
function buildMirror(cfg){
 const source=$(cfg.selector);if(!source)return;
 const mirror=document.createElement('div');mirror.className=source.className+' market-smooth-view';mirror.innerHTML=`<div class="book-loading market-syncing">${cfg.loading}</div>`;
 source.classList.add('market-smooth-source');source.setAttribute('aria-hidden','true');source.after(mirror);
 const st={...cfg,source,mirror,latest:'',rendered:'',generation:assetGeneration,acceptAfter:Date.now()+SWITCH_SETTLE,lastCapturedAt:0};
 const capture=()=>{const now=Date.now();if(now<st.acceptAfter)return;const html=validHTML(source,cfg.type);if(html){st.latest=html;st.lastCapturedAt=now;st.generation=assetGeneration}};
 new MutationObserver(capture).observe(source,{childList:true,subtree:true,characterData:true,attributes:true});
 states.push(st);
}
function buildPriceMirror(){
 const price=$('[data-price]'),change=$('[data-change]');if(!price||!change)return;
 const priceView=document.createElement('div');priceView.className='market-price market-smooth-price';price.after(priceView);
 const changeView=document.createElement('div');changeView.className='market-change market-smooth-change';change.after(changeView);
 price.classList.add('market-smooth-price-source');change.classList.add('market-smooth-price-source');
 const st={type:'price',price,change,priceView,changeView,latestPrice:'—',latestChange:'—',latestClass:'market-change',renderedPrice:'',renderedChange:'',generation:assetGeneration,acceptAfter:Date.now()+SWITCH_SETTLE};
 const capture=()=>{if(Date.now()<st.acceptAfter)return;st.latestPrice=price.textContent;st.latestChange=change.textContent;st.latestClass=change.className;st.generation=assetGeneration};
 new MutationObserver(capture).observe(price,{childList:true,subtree:true,characterData:true});new MutationObserver(capture).observe(change,{childList:true,subtree:true,characterData:true,attributes:true});states.push(st);
}
function resetForAsset(){
 assetGeneration++;const now=Date.now();
 for(const st of states){st.generation=assetGeneration;st.acceptAfter=now+SWITCH_SETTLE;
  if(st.type==='price'){st.latestPrice='—';st.latestChange='—';st.renderedPrice='';st.renderedChange='';st.priceView.textContent='—';st.changeView.textContent='—';st.changeView.className='market-change market-smooth-change'}
  else{st.latest='';st.rendered='';st.lastCapturedAt=0;st.mirror.innerHTML=`<div class="book-loading market-syncing">${st.loading}</div>`;st.mirror.classList.remove('market-smooth-step')}
 }
}
function tick(){
 const now=Date.now();
 for(const st of states){if(now<st.acceptAfter||st.generation!==assetGeneration)continue;
  if(st.type==='price'){
   if(st.latestPrice==='—'){st.latestPrice=st.price.textContent;st.latestChange=st.change.textContent;st.latestClass=st.change.className}
   if(st.latestPrice===st.renderedPrice&&st.latestChange===st.renderedChange)continue;
   st.priceView.textContent=st.latestPrice;st.changeView.textContent=st.latestChange;st.changeView.className=(st.latestClass||'market-change').replace('market-smooth-price-source','').trim()+' market-smooth-change';st.renderedPrice=st.latestPrice;st.renderedChange=st.latestChange;
   continue;
  }
  if(!st.latest){const html=validHTML(st.source,st.type);if(html){st.latest=html;st.lastCapturedAt=now}}
  if(!st.latest||st.latest===st.rendered)continue;
  st.mirror.innerHTML=st.latest;st.rendered=st.latest;
 }
}
function boot(){buildPriceMirror();feeds.forEach(buildMirror);const symbol=$('[data-selected-symbol]');if(symbol)new MutationObserver(resetForAsset).observe(symbol,{childList:true,subtree:true,characterData:true});setInterval(tick,CADENCE)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();