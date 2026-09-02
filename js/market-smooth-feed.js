(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const CADENCE=1000;
const feeds=[
 {selector:'[data-asks]',type:'book',loading:'SYNCING LIVE ASKS…'},
 {selector:'[data-bids]',type:'book',loading:'SYNCING LIVE BIDS…'},
 {selector:'[data-trades]',type:'trade',loading:'SYNCING LIVE TRADES…'}
];
const states=[];
function validHTML(source,type){
 const row=type==='book'?'.book-row':'.trade-row';
 return source.querySelector(row)?source.innerHTML:'';
}
function buildMirror(cfg){
 const source=$(cfg.selector);if(!source)return;
 const mirror=document.createElement('div');
 mirror.className=source.className+' market-smooth-view';
 mirror.innerHTML=`<div class="book-loading market-syncing">${cfg.loading}</div>`;
 source.classList.add('market-smooth-source');
 source.setAttribute('aria-hidden','true');
 source.after(mirror);
 const st={...cfg,source,mirror,latest:'',rendered:'',switchedAt:Date.now()};
 const capture=()=>{const html=validHTML(source,cfg.type);if(html)st.latest=html};
 new MutationObserver(capture).observe(source,{childList:true,subtree:true,characterData:true,attributes:true});
 capture();states.push(st);
}
function buildPriceMirror(){
 const price=$('[data-price]'),change=$('[data-change]');if(!price||!change)return;
 const priceView=document.createElement('div');priceView.className='market-price market-smooth-price';price.after(priceView);
 const changeView=document.createElement('div');changeView.className='market-change market-smooth-change';change.after(changeView);
 price.classList.add('market-smooth-price-source');change.classList.add('market-smooth-price-source');
 const st={type:'price',price,change,priceView,changeView,latestPrice:price.textContent,latestChange:change.textContent,latestClass:change.className,renderedPrice:'',renderedChange:'',switchedAt:Date.now()};
 const capture=()=>{st.latestPrice=price.textContent;st.latestChange=change.textContent;st.latestClass=change.className};
 new MutationObserver(capture).observe(price,{childList:true,subtree:true,characterData:true});
 new MutationObserver(capture).observe(change,{childList:true,subtree:true,characterData:true,attributes:true});
 states.push(st);capture();
}
function resetForAsset(){
 const now=Date.now();
 for(const st of states){
  st.switchedAt=now;
  if(st.type==='price'){
   st.renderedPrice='';st.renderedChange='';st.priceView.textContent='—';st.changeView.textContent='—';st.changeView.className='market-change market-smooth-change';
  }else{
   st.latest='';st.rendered='';st.mirror.innerHTML=`<div class="book-loading market-syncing">${st.loading}</div>`;st.mirror.classList.remove('market-smooth-step');
  }
 }
}
function tick(){
 const now=Date.now();
 for(const st of states){
  if(now-st.switchedAt<650)continue;
  if(st.type==='price'){
   if(st.latestPrice===st.renderedPrice&&st.latestChange===st.renderedChange)continue;
   st.priceView.textContent=st.latestPrice;st.changeView.textContent=st.latestChange;
   st.changeView.className=(st.latestClass||'market-change').replace('market-smooth-price-source','').trim()+' market-smooth-change';
   st.renderedPrice=st.latestPrice;st.renderedChange=st.latestChange;
   st.priceView.classList.remove('market-smooth-step');st.changeView.classList.remove('market-smooth-step');
   requestAnimationFrame(()=>{st.priceView.classList.add('market-smooth-step');st.changeView.classList.add('market-smooth-step')});
   continue;
  }
  if(!st.latest||st.latest===st.rendered)continue;
  st.mirror.innerHTML=st.latest;st.rendered=st.latest;
  st.mirror.classList.remove('market-smooth-step');requestAnimationFrame(()=>st.mirror.classList.add('market-smooth-step'));
 }
}
function boot(){
 buildPriceMirror();feeds.forEach(buildMirror);
 const symbol=$('[data-selected-symbol]');if(symbol)new MutationObserver(resetForAsset).observe(symbol,{childList:true,subtree:true,characterData:true});
 setInterval(tick,CADENCE);setTimeout(tick,120);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();