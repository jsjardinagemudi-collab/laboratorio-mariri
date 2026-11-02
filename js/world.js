/* V12 canvas scene: reads simulation state; every order is dispatched through
   the preserved V11 DOM handlers. Animation never advances gameplay clocks. */
const V12World=(()=>{
 const canvas=document.getElementById('world'),ctx=canvas.getContext('2d'),wrap=document.getElementById('worldWrap');
 let state,terrain,hover=null,projection,width=800,height=650,clock=0,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,last=0;
 const tracks=new Map(),colors=['#7fba79','#7fc9d5','#e8a064','#c5b4e2'];
 const noise=(x,y)=>{let a=Math.sin(x*127.1+y*311.7)*43758.5453;return a-Math.floor(a)};
 function poly(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.7;ctx.stroke()}}
 function ellipse(x,y,rx,ry,fill){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()}
 function line(x,y,x2,y2,c,w=1){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.strokeStyle=c;ctx.lineWidth=w;ctx.stroke()}
 function text(t,x,y,c='#f0dba1',size=10){ctx.font=`600 ${size}px 'Segoe UI',sans-serif`;ctx.textAlign='center';ctx.fillStyle=c;ctx.shadowColor='#071c16';ctx.shadowBlur=5;ctx.fillText(t,x,y);ctx.shadowBlur=0}
 function project(x,y){let p=projection;return{x:p.ox+(x-y)*p.tw/2,y:p.oy+(x+y)*p.th/2}}
 function tile(x,y,c,edge){const p=project(x,y),a=projection.tw/2,b=projection.th/2;poly([[p.x,p.y-b],[p.x+a,p.y],[p.x,p.y+b],[p.x-a,p.y]],c,edge);return p}
 function tree(x,y,k,scale=1){let h=(24+k*15)*scale;ellipse(x+1,y+2,13*scale,5*scale,'#061b1655');line(x,y,x,y-h*.6,'#725b3b',3*scale);poly([[x-13*scale,y-h*.35],[x,y-h],[x+13*scale,y-h*.35]],'#173d2d');poly([[x-11*scale,y-h*.55],[x,y-h*1.12],[x+10*scale,y-h*.55]],'#2b5a3b');poly([[x-6*scale,y-h*.7],[x,y-h*1.12],[x+2*scale,y-h*.65]],'#66825455')}
 function mountain(x,y,k){ellipse(x,y,18,6,'#061c1755');poly([[x-17,y],[x-3,y-32-k*8],[x+20,y+1]],'#4c665a','#6c7e6880');poly([[x-3,y-32-k*8],[x+20,y+1],[x+2,y-7]],'#344e46');poly([[x-8,y-23-k*7],[x-3,y-32-k*8],[x+3,y-23-k*6],[x-1,y-24]],'#b9c5b4')}
 function building(key,x,y,level=1,ghost=false){const r=Math.max(9,Math.min(23,projection.tw*.39)),h=key==='institute'?r*1.9:r*1.3;
 ctx.save();if(ghost)ctx.globalAlpha=.45;ellipse(x,y+4,r*1.2,r*.4,'#03181166');
 if(key==='mariri'||key==='chacrona'){
  poly([[x-r,y],[x,y-r*.5],[x+r,y],[x,y+r*.5]],'#725f36','#b39c5d');
  for(let i=-1;i<=1;i++){line(x-r*.6+i*r*.26,y+4,x+i*r*.26,y-r*.35,'#ac8c4f',2);for(let j=0;j<3;j++){let xx=x+(i-.3)*r*.45+j*3,yy=y+(j-1)*4;line(xx,yy,xx,yy-16,'#9faa59',1.8);ellipse(xx-3,yy-10,5,2.7,'#75964b');ellipse(xx+3,yy-14,5,2.7,key==='mariri'?'#abc174':'#64b078')}}
  if(key==='mariri'){line(x-r*.65,y-26,x+r*.6,y-26,'#af995e',2);line(x-r*.65,y,x-r*.65,y-28,'#af995e',2);line(x+r*.6,y,x+r*.6,y-28,'#af995e',2)}
 }else if(key==='mineBuilding'){
  mountain(x-4,y,1);poly([[x-8,y+2],[x-8,y-14],[x+6,y-17],[x+11,y+1]],'#102d29','#b7a16a');line(x-7,y-13,x+5,y-16,'#d1b579',3);line(x-8,y,x-8,y-15,'#ae8f5c',3);line(x+9,y,x+6,y-16,'#ae8f5c',3);ellipse(x+15,y+2,5,3,'#83b9c0');
 }else{
  const wall={institute:'#bfad7c',warehouse:'#a48a59',workshop:'#9e805c',hospital:'#b9c8a1',knowledge:'#a8a6b2'}[key]||'#ad9d73';
  poly([[x-r,y-h],[x,y-h+r*.5],[x,y+r*.5],[x-r,y]],wall,'#dfce9c55');poly([[x,y-h+r*.5],[x+r,y-h],[x+r,y],[x,y+r*.5]],'#736f51');
  const roof={institute:'#5b8760',warehouse:'#756444',workshop:'#667d72',hospital:'#4e8d77',knowledge:'#77758c'}[key]||'#587459';
  poly([[x-r-4,y-h],[x,y-h-r*.85],[x+r+4,y-h],[x,y-h+r*.5]],roof,'#c8b679aa');line(x,y-h-r*.85,x,y-h+r*.5,'#a3b88b80',1);
  poly([[x-7,y-1],[x-7,y-14],[x-2,y-12],[x-2,y+2]],'#273f30');poly([[x+4,y-10],[x+10,y-13],[x+10,y-22],[x+4,y-19]],'#f5d98b');
  if(key==='institute'){line(x,y-h-r*.7,x,y-h-r*1.8,'#d4bc71',2);poly([[x+1,y-h-r*1.8],[x+13,y-h-r*1.5],[x+1,y-h-r*1.25]],'#d9bc6c');ellipse(x,y-h-r*.5,4,5,'#e3c573');}
  if(key==='hospital'){line(x-13,y-h*.7,x-5,y-h*.7,'#eff3c6',2);line(x-9,y-h*.7-4,x-9,y-h*.7+4,'#eff3c6',2)}
  if(key==='workshop'){poly([[x+7,y-h],[x+7,y-h-17],[x+13,y-h-17],[x+13,y-h+2]],'#536359');for(let i=0;i<3;i++){let yy=((clock*14+i*9)%35);ellipse(x+10+Math.sin(yy/9)*4,y-h-17-yy,3+yy*.12,3+yy*.09,`rgba(185,200,166,${.3-yy*.007})`)}}
 }
 if(!ghost){text('Nv.'+level,x,y+16,'#f6e0a0',9)}ctx.restore();
 }
 function person(x,y,index,scale=1,bob=0){let c=colors[Math.floor(index/4)%4],skin=['#bd8a64','#976748','#d5ab83','#b17954'][index%4],robe=['#415e3a','#376e74','#915339','#6f6388'][Math.floor(index/4)%4];ctx.save();ctx.translate(x,y+bob);ctx.scale(scale,scale);ellipse(0,2,7,2.8,'#001c1566');line(-2,0,-3,4,'#d0b880',2);line(2,0,3,4,'#d0b880',2);poly([[-4,-12],[4,-12],[6,0],[-6,0]],robe,c);ellipse(0,-16,4,4.5,skin);line(-4,-18,4,-18,index%2?'#cec19b':'#493c2c',2);if(index%4===0)line(4,-20,7,-26,c,2);if(index%4===1)poly([[-7,-18],[0,-23],[7,-18]],'#917959');line(7,2,7,-18,'#bda277',1.5);ellipse(7,-19,2,2,c);ctx.restore()}
 function hp(x,y,pct,w=42,color='#b4ce86'){ctx.fillStyle='#09251f';ctx.fillRect(x-w/2-1,y-1,w+2,5);ctx.fillStyle='#4a4740';ctx.fillRect(x-w/2,y,w,3);ctx.fillStyle=color;ctx.fillRect(x-w/2,y,Math.max(0,Math.min(1,pct))*w,3)}
 function frame(now){requestAnimationFrame(frame);if(!state||document.hidden)return;if(now-last<33)return;let dt=Math.min(100,now-last)/1000;last=now;if(!reduced)clock+=dt;draw(dt)}
 function draw(dt){const rect=wrap.getBoundingClientRect();width=rect.width;height=rect.height;let dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
 const inside=state.view==='institute',cols=inside?12:18,rows=inside?9:12,tw=Math.min((width-35)*2/(cols+rows),(height-120)*4/(cols+rows)),th=tw*.5;
 projection={tw,th,ox:width/2-(cols-rows)*tw/4,oy:height/2-(cols+rows)*th/4+30};
 const bg=ctx.createRadialGradient(width*.5,height*.4,20,width*.5,height*.5,width*.8);bg.addColorStop(0,inside?'#2e5038':'#294c3e');bg.addColorStop(1,'#071f1c');ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);
 const bottom=project(cols-1,rows-1),left=project(0,rows-1),right=project(cols-1,0);poly([[left.x-tw/2,left.y],[bottom.x,bottom.y+th/2],[right.x+tw/2,right.y],[right.x+tw/2,right.y+13],[bottom.x,bottom.y+th/2+13],[left.x-tw/2,left.y+13]],'#243c2b','#60734b');
 // Ground pass: diamond terrain and deterministic paths. No random state mutation.
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  let n=noise(x,y),seen=inside||state.seen[`${x},${y}`],kind=inside?'garden':terrain(x,y),path=inside&&(y===4||x===5),color=!seen?'#102a28':path?'#8a8057':kind==='river'?'#396b70':kind==='mine'?'#57614d':kind==='ruins'?'#4e5858':inside?['#436342','#456846','#3b5c3d'][Math.floor(n*3)]:['#385d42','#31553e','#406346'][Math.floor(n*3)];
  let p=tile(x,y,color,inside&&state.placing?'#e3c47955':'#7b975016');
  if(seen&&kind==='river'){for(let i=0;i<3;i++){let xx=p.x+(i-1)*tw*.17+Math.sin(clock+i+x)*2;line(xx-4,p.y+i*2-3,xx+3,p.y+i*2-3,'#a3d5c273',.8)}}
  if(seen&&inside&&!path&&n>.45){for(let i=0;i<3;i++)ellipse(p.x+(i-1)*4,p.y+1,1.1,1,n>.8?'#dcc58d':'#92ad71')}
 }
 // Objects pass in depth order, with silhouettes hidden by exploration fog.
 const objects=[];
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  let p=project(x,y),n=noise(x,y),seen=inside||state.seen[`${x},${y}`];if(!seen){if(n>.8)objects.push({z:x+y,draw:()=>ellipse(p.x,p.y-4,tw*.55,th*.58,'#15333080')});continue}
  if(inside){let b=state.placements.find(b=>b.x===x&&b.y===y);if(b)objects.push({z:x+y,draw:()=>{building(b.key,p.x,p.y,b.key==='institute'?state.institute:b.level||1);if(['mariri','chacrona','mineBuilding'].includes(b.key)){const phase=(state.clock%10)/10;hp(p.x,p.y+23,phase,30,'#d6c57b');if(!reduced&&Math.sin(clock*2)>0)text('+',p.x+12,p.y-25-(clock%1)*9,'#d5e7a3',12)}}});else if((x===0||y===0||x===11||y===8)&&!(y===4||x===5))objects.push({z:x+y,draw:()=>tree(p.x,p.y,n,tw/48)});
  }else{let k=terrain(x,y);if(k==='forest'&&n>.25)objects.push({z:x+y,draw:()=>tree(p.x+tw*.12,p.y-1,n,tw/52)});if(k==='mine')objects.push({z:x+y,draw:()=>mountain(p.x,p.y,n)});if(k==='ruins')objects.push({z:x+y,draw:()=>{for(let i=-1;i<2;i++)poly([[p.x+i*9-3,p.y],[p.x+i*9-3,p.y-20+i*2],[p.x+i*9+3,p.y-22+i*2],[p.x+i*9+3,p.y-2]],'#9b9a7d','#baba8b');line(p.x-14,p.y-22,p.x+13,p.y-19,'#b8ad83',5)}});if(k==='home'||k==='hospital'||k==='build')objects.push({z:x+y,draw:()=>building(k==='home'?'institute':k==='hospital'?'hospital':'warehouse',p.x,p.y,state.institute)});if(k==='discovery')objects.push({z:x+y,draw:()=>{ellipse(p.x,p.y-3,8,4,'#dacb7a44');text('✧',p.x,p.y-9+Math.sin(clock*2)*3,'#ffe3a0',22)}})}
 }
 if(inside){
  let q=state.buildQueue;if(q){let b=q.placement||state.placements.find(b=>b.key===q.key);if(!b&&BUILDINGS[q.key]){let [,,x,y]=BUILDINGS[q.key];b={key:q.key,x,y}}if(b){let p=project(b.x,b.y);objects.push({z:b.x+b.y+.1,draw:()=>{building(b.key,p.x,p.y,1,true);for(let i=-1;i<2;i++){line(p.x+i*10,p.y+5,p.x+i*10,p.y-42,'#d5b77b',1.5);line(p.x-15,p.y-15+i*11,p.x+15,p.y-15+i*11,'#d5b77b',1.5)}let seconds=Math.max(0,Math.ceil((q.endsAt-Date.now())/1000));hp(p.x,p.y+22,1-seconds/30,45,'#edcc76');text('OBRA · '+seconds+'s',p.x,p.y-50,'#ffe0a0',10);person(p.x+13,p.y+8,9,.8,Math.sin(clock*8)*1.5)}})}}
  // Ambient inhabitants: cosmetic only, never substituted for actual teams.
  [0,4,8,12,2].forEach((id,i)=>{let a=clock*.11+i*.8,b=Math.floor(a)%2,t=a%1,x=b?5:1+t*9,y=b?1+t*6:4,p=project(x,y);objects.push({z:x+y+.2,draw:()=>person(p.x+(i%2?5:-5),p.y,id,Math.max(.65,tw/60),Math.sin(clock*6+i)*1.2)})});
 }else{
  state.enemies.filter(e=>e.active&&state.seen[`${e.x},${e.y}`]).forEach(e=>{let p=project(e.x,e.y),fight=state.teams.filter(t=>t.order==='attack'&&t.target===e.id&&Math.abs(t.x-e.x)+Math.abs(t.y-e.y)<=1);objects.push({z:e.x+e.y+.15,draw:()=>{let bob=Math.sin(clock*2+e.id)*3;ellipse(p.x,p.y,13,5,'#0d1d1990');if(fight.length){ellipse(p.x,p.y,18+Math.sin(clock*5)*3,10,'#e3a45c33');for(let i=0;i<5;i++){let a=clock*3+i*1.26;ellipse(p.x+Math.cos(a)*20,p.y-10+Math.sin(a)*9,1.8,1.8,'#ffe4a3')}}let hue=['#a6c2bc','#dfac72','#7fc7d3','#a0aa7f'][e.type%4];ctx.save();ctx.translate(p.x,p.y-15+bob);ctx.rotate(Math.sin(clock+e.id)*.09);poly([[-12,2],[-10,-8],[-3,-14],[7,-11],[13,-2],[10,8],[0,12],[-10,8]],hue,'#e0d8b5');ellipse(-4,-2,2,2,'#25443a');ellipse(5,-2,2,2,'#25443a');line(-2,6,4,6,'#436050',1);ctx.restore();hp(p.x,p.y-37,e.hp/e.max,34,'#e2ac75');text(fight.length?`${fight.length} equipes · ${Math.ceil(e.hp)}`:FOES[e.type][0],p.x,p.y+13,'#e1cfaa',Math.max(8,tw*.22));if(fight.length){fight.forEach((t,i)=>{let from=project(t.x,t.y),phase=(clock*1.5+i*.3)%1;line(from.x+(p.x-from.x)*phase,from.y-15+(p.y-from.y)*phase,p.x,p.y-15,'#f8d78388',1.5)});text('COOPERAÇÃO',p.x,p.y-45,'#ffe2a1',8)}}})});
  const counts={};state.teams.forEach(t=>{let target={x:t.x,y:t.y},prev=tracks.get(t.id);if(!prev){prev={...target};tracks.set(t.id,prev)}const blend=reduced?1:Math.min(1,dt*6);prev.x+=(target.x-prev.x)*blend;prev.y+=(target.y-prev.y)*blend;let p=project(prev.x,prev.y),key=t.x+','+t.y,slot=counts[key]||0;counts[key]=slot+1;p.x+=((slot%3)-1)*13;p.y+=Math.floor(slot/3)*12;objects.push({z:prev.x+prev.y+.5+slot*.01,draw:()=>{const selected=state.selected.includes(t.id);if(selected){ellipse(p.x,p.y+2,11,5,'#d8c77c33');ctx.beginPath();ctx.ellipse(p.x,p.y+2,11,5,0,0,Math.PI*2);ctx.strokeStyle='#f0d98d';ctx.stroke()}person(p.x,p.y,t.guide,Math.max(.85,tw/42),t.order!=='idle'?Math.sin(clock*9)*1.2:0);text(`${t.id} · ${1+t.apprentices.reduce((a,b)=>a+b,0)}`,p.x,p.y-31,selected?'#ffe29b':'#d0e2cb',10);hp(p.x,p.y-27,state.units[t.guide].hp/100,26);for(let i=0;i<Math.min(3,t.apprentices.reduce((a,b)=>a+b,0));i++)person(p.x-8+i*7,p.y+10,t.guide,.5,Math.sin(clock*8+i))}});
   if(state.selected.includes(t.id)&&t.order!=='idle'&&Number.isFinite(t.tx)){let to=project(t.tx,t.ty);ctx.setLineDash([3,5]);line(p.x,p.y,to.x,to.y,'#d7c08088',1);ctx.setLineDash([]);ellipse(to.x,to.y,4,2,'#e3ce82')}
  });
 }
 objects.sort((a,b)=>a.z-b.z).forEach(o=>o.draw());
 if(hover){let {x,y}=hover;if(x>=0&&x<cols&&y>=0&&y<rows){let p=project(x,y);ctx.globalAlpha=.45;tile(x,y,state.placing?'#dcc976':'#b3cf98','#f7df9a');ctx.globalAlpha=1;if(inside&&state.placing&&!state.placements.some(b=>b.x===x&&b.y===y))building(state.placing,p.x,p.y,1,true)}}
 // Fireflies and water glints belong to the renderer only.
 if(!reduced)for(let i=0;i<16;i++){let x=noise(i,6)*width+Math.sin(clock*.5+i)*8,y=noise(i,7)*height;ellipse(x,y,1,1,`rgba(228,222,155,${.2+Math.sin(clock*1.2+i)*.17})`)}
 }
 function cellAt(ev){if(!projection)return null;let r=canvas.getBoundingClientRect(),px=ev.clientX-r.left-projection.ox,py=ev.clientY-r.top-projection.oy;return{x:Math.floor(py/projection.th+px/projection.tw+.5),y:Math.floor(py/projection.th-px/projection.tw+.5)}}
 canvas.addEventListener('pointermove',ev=>{hover=cellAt(ev);let tip=document.getElementById('worldTip'),p=hover,inside=state?.view==='institute';if(!p||p.x<0||p.y<0||p.x>=(inside?12:18)||p.y>=(inside?9:12)){tip.style.display='none';return}let b=inside&&state.placements.find(b=>b.x===p.x&&b.y===p.y),e=!inside&&state.enemies.find(e=>e.active&&e.x===p.x&&e.y===p.y);tip.style.display='block';tip.textContent=inside?(b?BUILDINGS[b.key][1]:state.placing?'Construir aqui':'Clareira disponível'):(state.seen[`${p.x},${p.y}`]?(e?FOES[e.type][0]:terrain(p.x,p.y)):'Névoa de exploração')+` · ${p.x},${p.y}`;canvas.style.cursor='pointer'});
 canvas.addEventListener('pointerleave',()=>{hover=null;document.getElementById('worldTip').style.display='none'});
 canvas.addEventListener('click',ev=>{const p=cellAt(ev);if(!p||!state)return;const inside=state.view==='institute';if(!inside){const occupants=state.teams.filter(t=>t.x===p.x&&t.y===p.y);if(occupants.length){const id=occupants.find(t=>!state.selected.includes(t.id))?.id||occupants[0].id;document.querySelector(`[data-marker="${id}"]`)?.click();return}}document.querySelector(inside?`[data-plot="${p.x},${p.y}"]`:`.cell[data-x="${p.x}"][data-y="${p.y}"]`)?.click()});
 document.getElementById('gridMode').onclick=()=>{const active=wrap.classList.toggle('grid-mode');document.getElementById('map').setAttribute('aria-hidden',String(!active));document.querySelectorAll('#map .plot,#map .cell').forEach(el=>el.tabIndex=active?0:-1)};
 document.getElementById('locateTeam').onclick=()=>{if(!state)return;let t=state.teams.find(t=>state.selected.includes(t.id));if(!t){document.getElementById('worldTip').style.display='block';document.getElementById('worldTip').textContent='Selecione uma equipe primeiro';return}document.getElementById('worldTip').style.display='block';document.getElementById('worldTip').textContent='⌖ Equipe '+t.id+' · '+t.x+','+t.y;document.getElementById('worldWrap').scrollIntoView({behavior:'smooth',block:'center'})};document.getElementById('motionMode').onclick=()=>{reduced=!reduced;document.getElementById('motionMode').textContent=reduced?'◌ Animações pausadas':'◌ Animações'};
 requestAnimationFrame(frame);
 return {sync:(s,t)=>{state=s;terrain=t;document.getElementById('worldTitle').textContent=s.view==='institute'?'O INSTITUTO':'TERRAS DESCONHECIDAS';document.getElementById('worldSubtitle').textContent=s.view==='institute'?'Cultivar · Construir · Compartilhar':'Explorar · Descobrir · Cooperar'}};
})();
