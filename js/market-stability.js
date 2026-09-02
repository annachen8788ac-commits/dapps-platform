(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const tracked=['[data-price]','[data-high]','[data-low]','[data-volume]','[data-vwap]','[data-spread]','[data-best-bid]','[data-best-ask]','[data-bid-depth]','[data-ask-depth]'];
const last=new WeakMap();
function pulse(el){
 if(!el)return;
 const txt=el.textContent.trim(),prev=last.get(el);
 if(prev===txt)return;
 last.set(el,txt);
 el.classList.remove('market-data-tick');
 requestAnimationFrame(()=>el.classList.add('market-data-tick'));
 if(el.matches('[data-price]')&&prev&&prev!=='—'){
  const a=parseFloat(prev.replace(/[$,]/g,'')),b=parseFloat(txt.replace(/[$,]/g,''));
  el.classList.remove('market-data-up','market-data-down');
  if(isFinite(a)&&isFinite(b)&&a!==b){
   el.classList.add(b>a?'market-data-up':'market-data-down');
   clearTimeout(el._colorTimer);
   el._colorTimer=setTimeout(()=>el.classList.remove('market-data-up','market-data-down'),160);
  }
 }
}
function observeOne(el){
 if(!el)return;
 last.set(el,el.textContent.trim());
 new MutationObserver(()=>pulse(el)).observe(el,{childList:true,subtree:true,characterData:true});
}
tracked.forEach(s=>observeOne($(s)));
})();