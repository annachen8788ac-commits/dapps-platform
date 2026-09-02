(()=>{
'use strict';
const chart=document.querySelector('[data-pro-chart]');if(!chart)return;
let canvas=null,startDistance=0,startCenter=null,lastCenter=null,dragging=false;
const findCanvas=()=>canvas=chart.querySelector('.pro-native-canvas');
const point=t=>({x:t.clientX,y:t.clientY});
const distance=(a,b)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
const center=(a,b)=>({x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2});
function wheelAt(x,y,deltaY){if(!canvas)return;canvas.dispatchEvent(new WheelEvent('wheel',{bubbles:true,cancelable:true,clientX:x,clientY:y,deltaY,deltaMode:0}))}
function mouse(type,x,y){if(!canvas)return;canvas.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,clientX:x,clientY:y,buttons:type==='mouseup'?0:1}))}
chart.addEventListener('touchstart',e=>{findCanvas();if(!canvas)return;if(e.touches.length===2){e.preventDefault();startDistance=distance(e.touches[0],e.touches[1]);startCenter=center(e.touches[0],e.touches[1]);lastCenter=startCenter;dragging=false}else if(e.touches.length===1){e.preventDefault();const p=point(e.touches[0]);lastCenter=p;dragging=true;mouse('mousedown',p.x,p.y)}},{passive:false});
chart.addEventListener('touchmove',e=>{if(!canvas)return;if(e.touches.length===2){e.preventDefault();const d=distance(e.touches[0],e.touches[1]),c=center(e.touches[0],e.touches[1]);if(startDistance>0&&Math.abs(d-startDistance)>4){wheelAt(c.x,c.y,d>startDistance?-80:80);startDistance=d}lastCenter=c}else if(e.touches.length===1&&dragging){e.preventDefault();const p=point(e.touches[0]);mouse('mousemove',p.x,p.y);lastCenter=p}},{passive:false});
chart.addEventListener('touchend',e=>{if(!canvas)return;if(dragging&&lastCenter)mouse('mouseup',lastCenter.x,lastCenter.y);if(e.touches.length<2)startDistance=0;if(e.touches.length===0){dragging=false;lastCenter=null}},{passive:false});
chart.addEventListener('touchcancel',()=>{if(canvas&&lastCenter)mouse('mouseup',lastCenter.x,lastCenter.y);dragging=false;startDistance=0;lastCenter=null},{passive:false});
})();