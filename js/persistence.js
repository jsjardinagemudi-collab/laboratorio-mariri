/* Versioned save adapter. A migration reads V11 once and never modifies it. */
const MaririSave = (()=>{
 const legacy='mariri-lab-v12-2026-11', older='mariri-lab-v10-2026-11';
 function valid(s){if(!s||!Array.isArray(s.units)||s.units.length!==16||!Array.isArray(s.selected)||!Array.isArray(s.teams)||!Array.isArray(s.schools)||s.schools.length!==4||!Array.isArray(s.enemies))throw Error('Estrutura de jogo incompatível');for(const k of ['luz','mariri','chacrona','stone','iron','crystal','clock','institute'])if(!Number.isFinite(s[k])||s[k]<0)throw Error('Valor inválido: '+k);for(const t of s.teams)if(!Number.isInteger(t.guide)||t.guide<0||t.guide>=16||!Array.isArray(t.apprentices)||t.apprentices.length!==4||t.apprentices.some(n=>!Number.isInteger(n)||n<0)||!Number.isInteger(t.x)||t.x<0||t.x>=18||!Number.isInteger(t.y)||t.y<0||t.y>=12)throw Error('Companhia inválida');return s}
 function load(key){const raw=localStorage.getItem(key);if(raw)return valid(JSON.parse(raw));const old=localStorage.getItem(legacy)||localStorage.getItem(older);if(old){const state=valid(JSON.parse(old));state.migratedFrom=localStorage.getItem(legacy)?'V12':'V11';state.saveVersion=13;save(key,state);return state}return null}
 let warned=false;
 function save(key,s){try{localStorage.setItem(key,JSON.stringify({...s,saveVersion:13}));}catch(e){if(!warned){warned=true;alert('Não foi possível salvar neste navegador. Exporte um backup antes de fechar.')}}}
 function download(s){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify({format:'mariri-save',version:13,state:s},null,2)],{type:'application/json'}));a.href=url;a.download='mariri-v13-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 return {load,save,export:download,import:async f=>{if(f.size>5e6)throw Error('Arquivo muito grande');const json=JSON.parse(await f.text());return valid(json.state||json)}};
})();
