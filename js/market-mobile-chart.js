(()=>{
'use strict';
const chart=document.querySelector('[data-pro-chart]');if(!chart)return;
let canvas=null,startDistance=0,lastCenter=null,dragging=false,longPressTimer=null,longPress=false,startPoint=null,gesture=null,lastTouch=null;
const findCanvas=()=>canvas=chart.querySelector('.pro-native-canvas');
const point=t=>({x:t.clientX,y:t.clientY});
const distance=(a,b)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
const center=(a,b)=>({x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2});
function wheelAt(x,y,deltaY){if(!canvas)return;canvas.dispatchEvent(new WheelEvent('wheel',{bubbles:true,cancelable:true,clientX:x,clientY:y,deltaY,deltaMode:0}))}
function mouse(type,x,y,buttons=1){if(!canvas)return;canvas.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,clientX:x,clientY:y,buttons:type==='mouseup'?0:buttons}))}
function clearHover(){if(!canvas)return;canvas.dispatchEvent(new MouseEvent('mouseleave',{bubbles:false,cancelable:false,clientX:0,clientY:0,buttons:0}))}
function showDetail(p){if(gesture==='vertical'||gesture==='horizontal'||gesture==='pinch')return;longPress=true;gesture='inspect';chart.classList.add('mobile-inspect');mouse('mousemove',p.x,p.y,0)}
function hideDetail(){longPress=false;chart.classList.remove('mobile-inspect');const tip=chart.querySelector('.pro-chart-tooltip');if(tip)tip.classList.remove('show');clearHover()}
function cancelLongPress(){if(longPressTimer){clearTimeout(longPressTimer);longPressTimer=null}}
chart.addEventListener('touchstart',e=>{findCanvas();if(!canvas)return;clearHover();if(e.touches.length===2){cancelLongPress();hideDetail();gesture='pinch';startDistance=distance(e.touches[0],e.touches[1]);lastCenter=center(e.touches[0],e.touches[1]);lastTouch=lastCenter;dragging=false}else if(e.touches.length===1){const p=point(e.touches[0]);startPoint=p;lastCenter=p;lastTouch=p;dragging=false;gesture=null;cancelLongPress();longPressTimer=setTimeout(()=>showDetail(p),500)}},{passive:true});
chart.addEventListener('touchmove',e=>{if(!canvas)return;if(e.touches.length===2){cancelLongPress();hideDetail();gesture='pinch';const d=distance(e.touches[0],e.touches[1]),c=center(e.touches[0],e.touches[1]);if(startDistance>0&&Math.abs(d-startDistance)>3){wheelAt(c.x,c.y,d>startDistance?-90:90);startDistance=d}lastCenter=c;lastTouch=c;e.preventDefault();return}if(e.touches.length!==1||!startPoint)return;const p=point(e.touches[0]),dx=p.x-startPoint.x,dy=p.y-startPoint.y,ax=Math.abs(dx),ay=Math.abs(dy);if(longPress||gesture==='inspect'){e.preventDefault();mouse('mousemove',p.x,p.y,0);lastCenter=p;lastTouch=p;return}if(!gesture&&Math.max(ax,ay)>8){cancelLongPress();gesture=ax>ay*1.2?'horizontal':'vertical'}if(gesture==='vertical'){cancelLongPress();hideDetail();const prev=lastTouch||p;const delta=prev.y-p.y;if(Math.abs(delta)>0){e.preventDefault();window.scrollBy(0,delta)}lastTouch=p;return}if(gesture==='horizontal'){e.preventDefault();if(!dragging){dragging=true;mouse('mousedown',startPoint.x,startPoint.y)}mouse('mousemove',p.x,p.y);lastCenter=p;lastTouch=p}},{passive:false});
chart.addEventListener('touchend',e=>{cancelLongPress();if(dragging&&lastCenter)mouse('mouseup',lastCenter.x,lastCenter.y);hideDetail();if(e.touches.length<2)startDistance=0;if(e.touches.length===0){dragging=false;lastCenter=null;lastTouch=null;startPoint=null;gesture=null}},{passive:true});
chart.addEventListener('touchcancel',()=>{cancelLongPress();if(canvas&&dragging&&lastCenter)mouse('mouseup',lastCenter.x,lastCenter.y);hideDetail();dragging=false;startDistance=0;lastCenter=null;lastTouch=null;startPoint=null;gesture=null},{passive:true});
chart.addEventListener('click',()=>{if(!longPress)hideDetail()});
})();