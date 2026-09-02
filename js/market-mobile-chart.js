(()=>{
'use strict';
const chart=document.querySelector('[data-pro-chart]');if(!chart)return;
let canvas=null,startDistance=0,lastCenter=null,dragging=false,startPoint=null,gesture=null,detailTimer=null;
const point=t=>({x:t.clientX,y:t.clientY});
const distance=(a,b)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
const center=(a,b)=>({x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2});
const findCanvas=()=>{canvas=chart.querySelector('.pro-native-canvas');if(canvas)canvas.style.touchAction='pan-y';chart.style.touchAction='pan-y';return canvas};
function wheelAt(x,y,deltaY){if(!canvas)return;canvas.dispatchEvent(new WheelEvent('wheel',{bubbles:true,cancelable:true,clientX:x,clientY:y,deltaY,deltaMode:0}))}
function mouse(type,x,y,buttons=1){if(!canvas)return;canvas.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,clientX:x,clientY:y,buttons:type==='mouseup'?0:buttons}))}
function hideBox(){if(detailTimer){clearTimeout(detailTimer);detailTimer=null}chart.classList.remove('mobile-inspect');const tip=chart.querySelector('.pro-chart-tooltip');if(tip)tip.classList.remove('show')}
function clearCrosshair(){hideBox();if(!canvas)return;canvas.dispatchEvent(new MouseEvent('mouseleave',{bubbles:false,cancelable:false,clientX:0,clientY:0,buttons:0}))}
function showDetail(p){hideBox();chart.classList.add('mobile-inspect');mouse('mousemove',p.x,p.y,0);detailTimer=setTimeout(hideBox,2000)}
findCanvas();
chart.addEventListener('touchstart',e=>{findCanvas();if(!canvas)return;if(e.touches.length===2){hideBox();gesture='pinch';startDistance=distance(e.touches[0],e.touches[1]);lastCenter=center(e.touches[0],e.touches[1]);dragging=false}else if(e.touches.length===1){const p=point(e.touches[0]);startPoint=p;lastCenter=p;dragging=false;gesture=null}},{passive:true});
chart.addEventListener('touchmove',e=>{if(!canvas)return;if(e.touches.length===2){hideBox();gesture='pinch';const d=distance(e.touches[0],e.touches[1]),c=center(e.touches[0],e.touches[1]);if(startDistance>0&&Math.abs(d-startDistance)>3){wheelAt(c.x,c.y,d>startDistance?-90:90);startDistance=d}lastCenter=c;return}if(e.touches.length!==1||!startPoint)return;const p=point(e.touches[0]),dx=p.x-startPoint.x,dy=p.y-startPoint.y,ax=Math.abs(dx),ay=Math.abs(dy);if(!gesture&&Math.max(ax,ay)>10){gesture=ax>ay*1.25?'horizontal':'vertical';hideBox()}if(gesture==='vertical')return;if(gesture==='horizontal'){if(!dragging){dragging=true;mouse('mousedown',startPoint.x,startPoint.y)}mouse('mousemove',p.x,p.y);lastCenter=p}},{passive:true});
chart.addEventListener('touchend',e=>{const tapPoint=lastCenter||startPoint;const wasTap=!gesture&&!dragging&&e.touches.length===0;if(dragging&&lastCenter)mouse('mouseup',lastCenter.x,lastCenter.y);if(e.touches.length<2)startDistance=0;if(e.touches.length===0){dragging=false;lastCenter=null;startPoint=null;gesture=null;if(wasTap&&tapPoint)showDetail(tapPoint)}},{passive:true});
chart.addEventListener('touchcancel',()=>{if(canvas&&dragging&&lastCenter)mouse('mouseup',lastCenter.x,lastCenter.y);dragging=false;startDistance=0;lastCenter=null;startPoint=null;gesture=null},{passive:true});
})();