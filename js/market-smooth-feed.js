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
function resetForAsset(){
 const now=Date.now();
 for(const st of states){
  st.latest='';st.rendered='';st.switchedAt=now;
  st.mirror.innerHTML=`<div class="book-loading market-syncing">${st.loading}</div>`;
  st.mirror.classList.remove('market-smooth-step');
 }
}
function tick(){
 const now=Date.now();
 for(const st of states){
  if(!st.latest||st.latest===st.rendered||now-st.switchedAt<650)continue;
  st.mirror.innerHTML=st.latest;
  st.rendered=st.latest;
  st.mirror.classList.remove('market-smooth-step');
  requestAnimationFrame(()=>st.mirror.classList.add('market-smooth-step'));
 }
}
function boot(){
 feeds.forEach(buildMirror);
 const symbol=$('[data-selected-symbol]');
 if(symbol)new MutationObserver(resetForAsset).observe(symbol,{childList:true,subtree:true,characterData:true});
 setInterval(tick,CADENCE);
 setTimeout(tick,CADENCE);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();