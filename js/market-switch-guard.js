(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const terminal=$('.market-terminal');
const symbol=$('[data-selected-symbol]');
if(!terminal||!symbol)return;
let timer=0,token=0;
const HOLD=2200;
function begin(){
 const id=++token;
 terminal.classList.add('market-asset-switching');
 terminal.dataset.switchSymbol=symbol.textContent.trim()||'MARKET';
 clearTimeout(timer);
 timer=setTimeout(()=>{if(id!==token)return;terminal.classList.remove('market-asset-switching')},HOLD);
}
new MutationObserver(begin).observe(symbol,{childList:true,subtree:true,characterData:true});
})();