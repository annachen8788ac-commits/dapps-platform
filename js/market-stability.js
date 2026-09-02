(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const BTC_CADENCE=2000,ALT_CADENCE=5000,SWITCH_SETTLE=3000;
const tracked=['[data-high]','[data-low]','[data-volume]'];
const last=new WeakMap();
function pulse(el){if(!el)return;const txt=el.textContent.trim(),prev=last.get(el);if(prev===txt)return;last.set(el,txt);el.classList.remove('market-data-tick');requestAnimationFrame(()=>el.classList.add('market-data-tick'))}
function observeOne(el){if(!el)return;last.set(el,el.textContent.trim());new MutationObserver(()=>pulse(el)).observe(el,{childList:true,subtree:true,characterData:true})}
tracked.forEach(s=>observeOne($(s)));
const microDefs=[['[data-best-bid]','market-micro-bid'],['[data-best-ask]','market-micro-ask'],['[data-bid-depth]','market-micro-bid'],['[data-ask-depth]','market-micro-ask'],['[data-vwap]','market-micro-neutral'],['[data-feed-health]','market-micro-health'],['[data-micro-updated]','market-micro-time']];
const micro=[];let lastTick=0;
function isBTC(){return (($('[data-selected-symbol]')?.textContent)||'').trim().toUpperCase().startsWith('BTC/')}
function cadence(){return isBTC()?BTC_CADENCE:ALT_CADENCE}
function numberOf(v){const m=String(v||'').replace(/[$,%]/g,'').replace(/,/g,'').match(/-?\d+(?:\.\d+)?/);return m?+m[0]:null}
function mountMicro(sel,kind){const source=$(sel);if(!source)return;const view=document.createElement(source.tagName.toLowerCase());view.className=(source.className||'')+' market-micro-view '+kind;view.textContent='—';source.classList.add('market-micro-source');source.setAttribute('aria-hidden','true');source.after(view);micro.push({source,view,kind,lastText:'',lastNumber:null,acceptAfter:Date.now()+SWITCH_SETTLE})}
microDefs.forEach(x=>mountMicro(x[0],x[1]));
function updateMicro(st){const txt=st.source.textContent.trim()||'—';if(txt===st.lastText)return;const next=numberOf(txt),prev=st.lastNumber;st.view.textContent=txt;st.view.classList.remove('market-data-up','market-data-down','market-data-tick');if(prev!==null&&next!==null&&next!==prev&&st.kind!=='market-micro-time'){st.view.classList.add(next>prev?'market-data-up':'market-data-down');clearTimeout(st._dirTimer);st._dirTimer=setTimeout(()=>st.view.classList.remove('market-data-up','market-data-down'),1200)}requestAnimationFrame(()=>st.view.classList.add('market-data-tick'));st.lastText=txt;st.lastNumber=next}
function resetMicro(){const until=Date.now()+(isBTC()?800:SWITCH_SETTLE);lastTick=0;micro.forEach(st=>{st.acceptAfter=until;st.lastText='';st.lastNumber=null;st.view.textContent='—';st.view.classList.remove('market-data-up','market-data-down','market-data-tick')})}
const symbol=$('[data-selected-symbol]');if(symbol)new MutationObserver(resetMicro).observe(symbol,{childList:true,subtree:true,characterData:true});
setInterval(()=>{const now=Date.now();if(now-lastTick<cadence())return;lastTick=now;micro.forEach(st=>{if(now>=st.acceptAfter)updateMicro(st)})},250);
})();