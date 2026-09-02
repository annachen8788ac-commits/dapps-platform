(()=>{
'use strict';
const chart=document.querySelector('[data-pro-chart]');if(!chart)return;
let canvas=null,startDistance=0,startCenter=null,lastCenter=null,dragging=false,longPressTimer=null,longPress=false,startPoint=null;
const findCanvas=()=>canvas=chart.querySelector('.pro-native-canvas');
const point=t=>({x:t.clientX,y:t.clientY});
const distance=(a,b)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
const center=(a,b)=>({x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2});
const moved=(a,b)=>a&&b&&Math.hypot(a.x-b.x,a.y-b.y)>8;
function wheelAt(x,y,deltaY){if(!canvas)return;canvas.dispatchEvent(new WheelEvent('wheel',{bubbles:true,cancelable:true,clientX:x,clientY:y,deltaY,deltaMode:0}))}
function mouse(type,x,y,buttons=1){if(!canvas)return;canvas.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,clientX:x,clientY:y,buttons:type==='mouseup'?0:buttons}))}
function showDetail(p){longPress=true;chart.classList.add('mobile-inspect');mouse('mousemove',p.x,p.y,0)}
function hideDetail(){longPress=false;chart.classList.remove('mobile-inspect');const tip=chart.querySelector('.pro-chart-tooltip');if(tip)tip.classList.remove('show')}
function cancelLongPress(){if(longPressTimer){clearTimeout(longPressTimer);longPressTimer=null}}
chart.addEventListener('touchstart',e=>{findCanvas();if(!canvas)return;if(e.touches.length===2){e.preventDefault();cancelLongPress();hideDetail();startDistance=distance(e.touches[0],e.touches[1]);startCenter=center(e.touches[0],e.touches[1]);lastCenter=startCenter;dragging=false}else if(e.touches.length===1){e.preventDefault();const p=point(e.touches[0]);startPoint=p;lastCenter=p;dragging=false;cancelLongPress();longPressTimer=setTimeout(()=>showDetail(p),420)}},{passive:false});
chart.addEventListener('touchmove',e=>{if(!canvas)return;if(e.touches.length===2){e.preventDefault();cancelLongPress();hideDetail();const d=distance(e.touches[0],e.touches[1]),c=center(e.touches[0],e.touches[1]);if(startDistance>0&&Math.abs(d-startDistance)>4){wheelAt(c.x,c.y,d>startDistance?-80:80);startDistance=d}lastCenter=c}else if(e.touches.length===1){e.preventDefault();const p=point(e.touches[0]);if(longPress){mouse('mousemove',p.x,p.y,0);lastCenter=p;return}if(moved(startPoint,p)){cancelLongPress();if(!dragging){dragging=true;mouse('mousedown',startPoint.x,startPoint.y)}mouse('mousemove',p.x,p.y);lastCenter=p}}},{passive:false});
chart.addEventListener('touchend',e=>{cancelLongPress();if(dragging&&lastCenter)mouse('mouseup',lastCenter.x,lastCenter.y);hideDetail();if(e.touches.length<2)startDistance=0;if(e.touches.length===0){dragging=false;lastCenter=null;startPoint=null}},{passive:false});
chart.addEventListener('touchcancel',()=>{cancelLongPress();if(canvas&&dragging&&lastCenter)mouse('mouseup',lastCenter.x,lastCenter.y);hideDetail();dragging=false;startDistance=0;lastCenter=null;startPoint=null},{passive:false});
})();