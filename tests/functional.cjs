/* Run with Playwright installed for development only; production has no deps.
   MARIRI_URL=http://localhost:8000 MARIRI_BROWSER=/path/to/chromium node tests/functional.cjs */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs');
const http=require('node:http'),path=require('node:path');
(async()=>{
const args=['--no-zygote','--no-sandbox','--disable-dev-shm-usage','--disable-gpu'];
const browser=await chromium.launch({headless:true,args, ...(process.env.MARIRI_BROWSER?{executablePath:process.env.MARIRI_BROWSER}:{})});
const page=await browser.newPage({viewport:{width:1536,height:1060}});const errors=[],results=[];
page.on('pageerror',e=>errors.push(e.message));const key='mariri-lab-v12-2026-11',legacy='mariri-lab-v10-2026-11';let server;let url=process.env.MARIRI_URL;if(!url){server=http.createServer((req,res)=>{let file=path.join(__dirname,'..',req.url.split('?')[0]);if(file.endsWith('/'))file+='index.html';try{res.setHeader('content-type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html');res.end(fs.readFileSync(file))}catch(e){res.statusCode=404;res.end()}});await new Promise(r=>server.listen(0,'127.0.0.1',r));url='http://127.0.0.1:'+server.address().port}
const read=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
const click=async sel=>{await page.locator(sel).first().click()};
const record=(name,detail)=>{results.push({name,status:'PASS',detail});console.log('PASS',name)};
async function advance(ms){await page.clock.runFor(ms)}
async function loadFixture(modify){let state=await read();modify(state);await page.evaluate(({key,state})=>localStorage.setItem(key,JSON.stringify(state)),{key,state});await page.reload();await page.locator('#world').waitFor();return state}
try{
await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000));await page.goto(url);await click('#sandbox');await advance(100);
let initial=await read();assert.equal(initial.owned.length,16);assert.equal(initial.view,'institute');record('Inicialização livre','16 Guias disponíveis e dois mapas presentes');
await click('[data-tab="placement"]');await click('[data-place="mariri"]');
// Project the real canvas coordinate of cell (4,4), using the renderer geometry.
let point=await page.locator('#worldWrap').evaluate(el=>{let r=el.getBoundingClientRect(),tw=Math.min((r.width-35)*2/21,(r.height-120)*4/21),th=tw*.5;return{x:r.left+r.width/2-3*tw/4,y:r.top+r.height/2-21*th/4+30+8*th/2}});
await page.mouse.click(point.x,point.y);let queued=await read();assert.equal(queued.buildQueue?.placement.key,'mariri');assert.equal(queued.buildQueue.placement.x,4);assert.equal(queued.buildQueue.placement.y,4);record('Clique pseudoisométrico','Célula 4,4 corresponde ao terreno visual; custo debitado uma única vez');
await advance(31000);let built=await read();assert(built.placements.some(p=>p.key==='mariri'));assert.equal(built.productionSites.mariri.length,1);assert.equal(built.buildQueue,null);assert(built.metrics.buildings>=1);record('Construção','Fila conclui em 30s, ocupa a célula e registra unidade/contador');
let before=built.mariri;await advance(10000);assert((await read()).mariri>=before+8);record('Produção','Mariri é creditado no ritmo da simulação');
// Repeated paused ticks at a multiple of 10 must not produce repeatedly.
let st=await read();await advance(((10-st.clock%10)%10)*1000);await page.evaluate(()=>document.querySelector('[data-plot="5,4"]').click());let paused=await read();await advance(5000);assert.equal((await read()).mariri,paused.mariri);await click('[data-close]');record('Produção com painel aberto','Sem crédito duplicado durante pausa de simulação');
await click('[data-tab="teams"]');await click('#newTeam');await click('#confirmFormation');let formed=await read();assert.equal(formed.teams.length,1);record('Formação','Guia recrutado forma Companhia e é selecionado');
await click('#mapOutside');
// use the preserved grid interaction to issue a movement order into fog.
await page.evaluate(()=>document.querySelector('.cell[data-x="11"][data-y="7"]').click());assert.equal((await read()).teams[0].order,'move');await advance(5000);let moved=await read();assert.equal(moved.teams[0].x,11);assert.equal(moved.teams[0].y,7);assert(moved.seen['11,7']);record('Movimentação e névoa','Equipe chega a 11,7 e revela regiões; ordem não inicia ataque');
// A deterministic battle fixture isolates cooperation, stats and shared resistance.
await loadFixture(s=>{s.institute=5;s.tab='battle';s.view='exploration';s.teams=[{id:1,guide:0,apprentices:[1,0,0,0],x:9,y:6,tx:null,ty:null,order:'idle',target:null,after:'stay'},{id:2,guide:4,apprentices:[0,1,0,0],x:10,y:7,tx:null,ty:null,order:'idle',target:null,after:'stay'}];s.nextTeam=3;s.selected=[1,2];s.units[0].hp=100;s.units[4].hp=100;s.enemies[0].active=true;s.enemies[0].hp=600;s.enemies[0].max=600;s.seen['10,6']=true;});
await page.evaluate(()=>document.querySelector('.cell[data-x="10"][data-y="6"]').click());await click('#attackTo');assert.equal(await page.locator('input[name="orderTeam"]:checked').count(),2);await click('#confirmOrder');await advance(1000);let battle=await read();assert.equal(battle.teams.filter(t=>t.order==='attack').length,2);assert(battle.enemies[0].hp<600);assert(await page.locator('.world-status').count());record('Combate cooperativo','Duas equipes atacam o mesmo alvo, reduzem uma resistência compartilhada e exibem barra real');
await advance(60000);let won=await read();assert.equal(won.enemies[0].active,false);assert(won.wins>moved.wins);assert(won.chests.silver>=1);record('Vitória e recompensas','Alvo transformado, recompensa e progressão persistidas');
await loadFixture(s=>{s.view='exploration';s.tab='teams';s.selected=[1];s.teams[0].x=7;s.teams[0].y=7;s.teams[0].order='idle';s.seen['7,8']=true;s.stone=0;s.iron=0;s.crystal=0;});
// Choose a mine cell through the actual terrain-derived DOM.
let mine=await page.locator('.cell.mine').first().evaluate(el=>({x:+el.dataset.x,y:+el.dataset.y}));await page.evaluate(p=>document.querySelector(`.cell[data-x="${p.x}"][data-y="${p.y}"]`).click(),mine);await click('#mineNow');await advance(30000);let mined=await read();assert(mined.stone+mined.iron+mined.crystal>0);record('Mineração','Depósito conhecido aceita ordem e produz respeitando capacidade');
await loadFixture(s=>{s.view='institute';s.tab='tree';s.stone=100;s.researchJob=null;s.techs=[];});await click('[data-startresearch="foundation"]');await advance(31000);assert((await read()).techs.includes('foundation'));record('Pesquisa','Requisito, custo e cronômetro da árvore tecnológica funcionam');
for(const tab of ['dashboard','placement','tree','teams','schools','battle','hospital','economy','rewards','tech','quests','achievements','guides','talents','progress']){await click(`[data-tab="${tab}"]`);assert((await page.locator('#side').innerText()).length>20)}record('Navegação completa','Todos os 15 painéis renderizam sem erro');
await click('[data-tab="guides"]');assert.equal(await page.locator('.guide-portrait').count(),16);record('Guias','16 fichas com retratos e dados originais');
let save=await read();await page.reload();let restored=await read();assert.equal(restored.institute,save.institute);assert.equal(restored.teams.length,save.teams.length);assert.equal(restored.placements.length,save.placements.length);assert.deepEqual(restored.techs,save.techs);record('Salvamento e recarga','Instituto, equipes, construções e tecnologias preservados');
await page.evaluate(({key,legacy,state})=>{localStorage.removeItem(key);localStorage.setItem(legacy,JSON.stringify(state))},{key,legacy,state:save});await page.reload();assert.equal((await read()).migratedFrom,'V11');assert(await page.evaluate(k=>!!localStorage.getItem(k),legacy));record('Migração V11','Copia a chave histórica sem apagar o save anterior');
const [backup]=await Promise.all([page.waitForEvent('download'),click('#exportSave')]);const stream=await backup.createReadStream();let chunks=[];for await(const chunk of stream)chunks.push(chunk);let exported=JSON.parse(Buffer.concat(chunks).toString());assert.equal(exported.format,'mariri-save');assert.equal(exported.state.units.length,16);record('Backup JSON','Arquivo exportado contém versão e estado completo');
let preImport=await read();await page.locator('#importSave').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"state":{"luz":-1}}')});assert.deepEqual((await read()).teams,preImport.teams);record('Validação de backup','Importação inválida mantém o progresso existente');
page.once('dialog',d=>d.accept());await page.locator('#importSave').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});await page.waitForLoadState('load');assert.equal((await read()).units.length,16);record('Restauração','Backup válido restaura após confirmação');
await click('[data-tab="dashboard"]');await click('#mapInstitute');await advance(150);await page.screenshot({path:process.env.MARIRI_SHOT||'/tmp/mariri-desktop.png',fullPage:true});
await page.setViewportSize({width:390,height:844});await advance(150);await page.screenshot({path:'/tmp/mariri-mobile.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);record('Responsividade','390px sem overflow horizontal; navegação e mapa presentes');assert(await page.locator('#world').evaluate(c=>c.width>300&&c.height>300));
const preview=await browser.newPage({viewport:{width:1280,height:900}});preview.on('pageerror',e=>errors.push(e.message));await preview.goto(url+'/preview.html');await preview.locator('#journey').click();assert.equal(await preview.locator('[data-first]').count(),4);await preview.locator('[data-first="0"]').click();await preview.waitForTimeout(150);let journey=await preview.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);assert.equal(journey.teams[0].guide,0);assert.equal(journey.units[0].level,1);assert.equal(journey.mode,'journey');record('Preview e Jornada','HTML autocontido inicia tutorial, escolha de Guia e Companhia no nível inicial');await preview.close();
assert.deepEqual(errors,[]);record('Runtime','Nenhuma exceção JavaScript');
}catch(e){results.push({name:'Falha',status:'FAIL',detail:e.stack});console.error(e);process.exitCode=1}
finally{fs.writeFileSync(process.env.MARIRI_RESULTS||'/tmp/mariri-results.json',JSON.stringify({results,errors},null,2));await browser.close();server?.close()}
})();
