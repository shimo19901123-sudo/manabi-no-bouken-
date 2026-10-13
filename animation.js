/* v22: separate, visible playback engine. This file must sit beside index.html. */
(()=>{
'use strict';
let token=0, frameId=0;
function stop(){token++;if(frameId)cancelAnimationFrame(frameId);document.querySelectorAll('.v22-animation').forEach(e=>e.remove());}
function play(){
 stop(); const run=token;
 const root=document.getElementById('practiceCells');
 const status=document.getElementById('strokeCount');
 const cells=root?[...root.querySelectorAll('.practice')]:[];
 if(!cells.length){if(status)status.textContent='かくところが みつかりません';return;}
 const speed=Number(document.getElementById('strokeSpeed')?.value)||1000;
 const items=[];
 for(const cell of cells){
  const ch=cell.querySelector('.guide')?.textContent||'あ';
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 130 130');svg.classList.add('v22-animation');
  svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:30;pointer-events:none;background:#fffdf6;';
  const data=(typeof STROKES!=='undefined')?STROKES[ch]:null;
  const paths=[];
  if(data?.paths?.length){
   for(const d of data.paths){const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);path.setAttribute('fill','none');path.setAttribute('stroke','#e96b41');path.setAttribute('stroke-width','7');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');svg.append(path);paths.push(path)}
  }else{
   const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');const clip=document.createElementNS('http://www.w3.org/2000/svg','clipPath');const id='v22-clip-'+run+'-'+items.length;clip.setAttribute('id',id);const rect=document.createElementNS('http://www.w3.org/2000/svg','rect');rect.setAttribute('width','0');rect.setAttribute('height','130');clip.append(rect);defs.append(clip);svg.append(defs);
   const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x','65');t.setAttribute('y','100');t.setAttribute('text-anchor','middle');t.setAttribute('font-size','95');t.setAttribute('fill','#e96b41');t.setAttribute('clip-path',`url(#${id})`);t.textContent=ch;svg.append(t);items.push({type:'reveal',rect,steps:1});
  }
  const previousPosition=getComputedStyle(cell).position;if(previousPosition==='static')cell.style.position='relative';
  cell.append(svg);
  if(paths.length){const lens=paths.map(p=>{let n=1;try{n=Math.max(1,p.getTotalLength())}catch(e){}p.style.strokeDasharray=`${n} ${n}`;p.style.strokeDashoffset=String(n);return n});items.push({type:'paths',paths,lens,steps:paths.length});}
 }
 const total=items.reduce((n,item)=>n+item.steps,0);let start=null;
 if(status)status.textContent='▶ さいせいちゅう';
 function tick(now){if(run!==token)return;if(start===null)start=now;const elapsed=now-start;let offset=0;
  for(const item of items){if(item.type==='paths')item.paths.forEach((p,i)=>{const progress=Math.max(0,Math.min(1,(elapsed-(offset+i)*speed)/speed));p.style.strokeDashoffset=String(item.lens[i]*(1-progress))});else item.rect.setAttribute('width',String(130*Math.max(0,Math.min(1,(elapsed-offset*speed)/speed))));offset+=item.steps;}
  if(elapsed<total*speed){frameId=requestAnimationFrame(tick)}else if(status)status.textContent='できた！ もういちど みられるよ';
 }
 frameId=requestAnimationFrame(tick);
}
function setup(){const playButton=document.getElementById('playStrokes');const stopButton=document.getElementById('stopStrokes');if(!playButton)return;
 playButton.onclick=play;playButton.disabled=false;
 if(stopButton){stopButton.onclick=()=>{stop();const s=document.getElementById('strokeCount');if(s)s.textContent='とめました';};stopButton.disabled=false;}
 const label=document.getElementById('strokeStatus');if(label)label.textContent='v22 再生機能（筆順未検証の文字は表示アニメーション）';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
