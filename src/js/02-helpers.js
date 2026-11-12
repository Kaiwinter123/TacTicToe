/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const rnd = (a,b) => a + Math.random()*(b-a);
const ri = (a,b) => Math.floor(rnd(a,b+1));
const pick = a => a[Math.floor(Math.random()*a.length)];
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid = () => Math.random().toString(36).slice(2,10);
const money = m => "£" + (m>=10? m.toFixed(0) : m.toFixed(1)) + "m";
const value = ovr => Math.max(0.2, 0.15*Math.pow(1.12, ovr-50));
const rarity = o => o>=86?"elite":o>=81?"gold":o>=75?"silver":"bronze";
function poisson(l){let L=Math.exp(-l),k=0,p=1;do{k++;p*=Math.random()}while(p>L);return k-1}

const PROFILE = {
  GK:{DIV:2,HAN:0,KIC:-12,REF:3,SPD:-24,POS:1},
  DEF:{PAC:-6,SHO:-28,PAS:-10,DRI:-12,DEF:4,PHY:2},
  MID:{PAC:-6,SHO:-8,PAS:3,DRI:1,DEF:-14,PHY:-6},
  FWD:{PAC:2,SHO:3,PAS:-9,DRI:0,DEF:-42,PHY:-8}
};
function seeded(str){ let h=2166136261; for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)} return ()=>{h=Math.imul(h^(h>>>15),2246822507);h=Math.imul(h^(h>>>13),3266489909);h^=h>>>16;return (h>>>0)/4294967296} }
function attrsFor(ovr,pos,seed){
  const R = seed ? seeded(seed) : Math.random, a={};
  for(const [k,off] of Object.entries(PROFILE[pos])) a[k]=clamp(Math.round(ovr+off+(R()*10-5)),20,99);
  return a;
}
function makePlayer(ovr,pos){
  pos = pos || pick(["GK","DEF","DEF","DEF","MID","MID","MID","FWD","FWD"]);
  return {id:uid(),n:pick(FIRST)[0]+". "+pick(LAST),pos,ovr,a:attrsFor(ovr,pos)};
}
// Draw a real player near the target rating that the club doesn't already own.
function drawReal(target,lo,hi,minOvr,pos){
  const owned=new Set(S.squad.map(p=>p.rid).filter(Boolean));
  let free=POOL.filter(p=>!owned.has(p.rid)&&p.ovr>=Math.max(lo,minOvr||0)&&p.ovr<=hi);
  if(pos){ const fp=free.filter(p=>p.pos===pos); if(fp.length) free=fp; }
  if(!free.length) return null;
  let best=null;
  for(let w=0;w<=20&&!best;w++){ const c=free.filter(p=>Math.abs(p.ovr-target)<=w); if(c.length) best=pick(c) }
  const p=makePlayer(best.ovr,best.pos);
  p.n=best.n; p.rid=best.rid; p.club=best.club; p.a=attrsFor(best.ovr,best.pos,best.rid);
  return p;
}
// Third kit colour (by short code) for clubs that have one.
const CLUB_C3 = {ARS:"#0A2A5E", AVL:"#F6E500", CRY:"#FFFFFF", LEE:"#FFCD00", MCI:"#FFFFFF", MUN:"#000000", FUL:"#CC0000", BOU:"#FFFFFF", SUN:"#111111"};
// The club's emblem animal (or crest symbol), shown inside the shield badge.
const CLUB_ANIMAL = {ARS:"\uD83D\uDCA3",AVL:"\uD83E\uDD81",BOU:"\uD83C\uDF52",BRE:"\uD83D\uDC1D",BHA:"\uD83D\uDD4A\uFE0F",CHE:"\uD83E\uDD81",CRY:"\uD83E\uDD85",EVE:"\uD83C\uDF6C",FUL:"\uD83C\uDFE0",LEE:"\uD83E\uDD9A",LIV:"\uD83D\uDC26",MCI:"\u26F5",MUN:"\uD83D\uDE08",NEW:"\uD83D\uDC26\u200D\u2B1B",NFO:"\uD83C\uDF33",SUN:"\uD83D\uDC08\u200D\u2B1B",TOT:"\uD83D\uDC13",COV:"\uD83D\uDC18",IPS:"\uD83D\uDC0E",HUL:"\uD83D\uDC2F"};
function c3of(sh){ return CLUB_C3[sh]||"" }
function animalOf(sh){ return CLUB_ANIMAL[sh]||"" }
// Each club's home ground, by short code.
const STADIUM = {ARS:"Emirates Stadium",AVL:"Villa Park",BOU:"Vitality Stadium",BRE:"Gtech Community Stadium",BHA:"Amex Stadium",CHE:"Stamford Bridge",CRY:"Selhurst Park",EVE:"Hill Dickinson Stadium",FUL:"Craven Cottage",LEE:"Elland Road",LIV:"Anfield",MCI:"Etihad Stadium",MUN:"Old Trafford",NEW:"St James' Park",NFO:"The City Ground",SUN:"Stadium of Light",TOT:"Tottenham Hotspur Stadium",COV:"Coventry Building Society Arena",IPS:"Portman Road",HUL:"MKM Stadium"};
function stadiumFor(sh){ return STADIUM[sh]||"" }
// What position a new pull should prefer so a full XI is covered within a few packs.
function gapPos(){
  const need={GK:1,DEF:4,MID:4,FWD:3}, have={GK:0,DEF:0,MID:0,FWD:0};
  S.squad.forEach(p=>{ if(have[p.pos]!=null) have[p.pos]++ });
  if(have.GK<need.GK) return "GK";
  const under=["DEF","MID","FWD"].filter(k=>have[k]<need[k]);
  return under.length ? pick(under) : null;
}
function clubOf(p){ return p.club!=null ? CLUBS[p.club] : null }
function drawProspect(){
  const owned=new Set(S.squad.map(p=>p.rid).filter(Boolean));
  const free=PROSPECTS.filter(x=>x.club>=0 && !owned.has(x.rid));
  if(!free.length) return null;
  const b=pick(free), q=makePlayer(PROSPECT_BASE,b.pos);
  q.n=b.n; q.rid=b.rid; q.club=b.club; q.prospect=true; q.baseSeason=S.season;
  q.a=attrsFor(PROSPECT_BASE,b.pos,b.rid);
  return q;
}
function drawUCL(){
  const owned=new Set(S.squad.map(p=>p.rid).filter(Boolean));
  const free=UCL.filter(x=>!owned.has(x.rid));
  if(!free.length) return null;
  const b=pick(free), q=makePlayer(b.ovr,b.pos);
  q.n=b.n; q.rid=b.rid; q.ucl=true; q.k1=b.k1; q.k2=b.k2; q.csh=b.csh; q.cname=b.cname; q.club=null;
  q.a=attrsFor(b.ovr,b.pos,b.rid);
  return q;
}
function rollOvr(lo,hi){ // skewed toward the low end
  const t = Math.pow(Math.random(),4.6);
  return Math.round(lo + t*(hi-lo));
}

/* ---------- state ---------- */
let S = null;          // the save
let view = "club";
let ui = {slot:null, filter:"ALL", sel:null, confirmReset:false};
let store = {kind:"memory", db:null, uid:null, me:null};
let isAdmin=false, rosterCache=null;

function newSeasonTeams(prev){
  return CLUBS.map((c,i)=>{
    const old = prev && prev.find(t=>t.id==="c"+i);
    const str = old ? clamp(old.str + ri(-2,2),64,88) : c[4];
    return {id:"c"+i,name:c[0],short:c[1],c1:c[2],c2:c[3],str};
  });
}
function makeFixtures(ids){
  const a = [ids[0]].concat(ids.slice(1).sort(()=>Math.random()-.5)); if(a.length%2) a.push("bye");
  const n=a.length, rounds=[];
  for(let r=0;r<n-1;r++){
    const m=[];
    for(let i=0;i<n/2;i++){
      let h=a[i], w=a[n-1-i];
      if((i===0 && r%2) || (i>0 && i%2===r%2)) [h,w]=[w,h];
      m.push([h,w]);
    }
    rounds.push(m);
    a.splice(1,0,a.pop());
  }
  const fx = rounds.concat(rounds.map(m=>m.map(([h,w])=>[w,h])));
  realisticVenues(fx);
  return fx;
}
// Shape the player's home/away like a real schedule: never more than two
// in a row, with some natural back-to-back home or away runs. Each opponent
// is still met once home and once away.
function realisticVenues(fx){
  const games=[];
  fx.forEach((rd,rr)=>{ const i=rd.findIndex(mm=>mm.includes("you")); if(i<0) return; const [h,w]=rd[i]; if(h==="bye"||w==="bye") return; games.push({r:rr,i,opp:(h==="you"?w:h)}); });
  const firstV={}, seen={}; let last=null, run=0;
  for(const g of games){
    let v;
    if(seen[g.opp]){ v = firstV[g.opp]==="H"?"A":"H"; }
    else {
      if(run>=2) v = last==="H"?"A":"H";
      else if(last===null) v = Math.random()<0.5?"H":"A";
      else v = Math.random()<0.4 ? last : (last==="H"?"A":"H");
      firstV[g.opp]=v; seen[g.opp]=true;
    }
    g.v=v; if(v===last) run++; else { run=1; last=v; }
  }
  // repair any run of three by flipping an opponent's two meetings
  for(let pass=0; pass<80; pass++){
    let bad=-1;
    for(let k=2;k<games.length;k++){ if(games[k].v===games[k-1].v && games[k].v===games[k-2].v){ bad=k; break; } }
    if(bad<0) break;
    firstV[games[bad].opp]=firstV[games[bad].opp]==="H"?"A":"H";
    const sn={}; for(const g of games){ if(sn[g.opp]){ g.v=firstV[g.opp]==="H"?"A":"H"; } else { g.v=firstV[g.opp]; sn[g.opp]=true; } }
  }
  for(const g of games){ fx[g.r][g.i] = g.v==="H" ? ["you",g.opp] : [g.opp,"you"]; }
}
function newGame(form){
  const squad=[];
  S = {v:2, manager:form.manager, club:{name:form.name,short:form.short,stadium:form.stadium,c1:form.c1,c2:form.c2}, h2h:{}, januaryDone:false, lastStar:null, records:{bestWin:null}, cupTrophies:0, schedFixed:true,
    budget:START_BUDGET, season:1, round:0, squad, formation:"4-3-3", xi:[], collected:[],
    teams:newSeasonTeams(), fixtures:null, results:[], history:[], packs:0, trophies:0, last:null, ended:false};
  S.fixtures = makeFixtures(["you"].concat(S.teams.map(t=>t.id)));
  S.cup = makeCup(4);
  autoPick();
  advanceByes();
  save();
}

/* ---------- persistence ---------- */
let saving=false, pending=false;
async function save(){
  if(!S) return;
  if(saving){pending=true;return}
  saving=true;
  try{
    const json = JSON.stringify(S);
    if(store.kind==="db"){
      await store.db.doc("data/users/"+store.uid+"/club/save").set({json, at:Date.now()});
    }else{
      try{localStorage.setItem("floodlight-save",json)}catch(e){}
    }
  }catch(e){ toast("Couldn't save just now. Your next action will try again.") }
  saving=false;
  if(store.kind==="db") writeRoster();
  if(pending){pending=false;save()}
}
async function writeRoster(){
  if(store.kind!=="db"||!S) return;
  try{
    const tbl=table(), pos=tbl.findIndex(r=>r.id==="you")+1, me=tbl[pos-1];
    const best=Math.min(pos, S.bestFinish||99, ...(S.history||[]).map(h=>h.pos));
    S.bestFinish=best;
    await store.db.doc("roster/"+store.uid).set({
      name:(store.me&&store.me.name)||"", email:(store.me&&store.me.email)||"",
      club:S.club.name, short:S.club.short, c1:S.club.c1, c2:S.club.c2,
      season:S.season, round:S.round, pts:me?me.pts:0, pos, best,
      packs:S.packs, trophies:S.trophies, updated:Date.now()
    });
  }catch(e){}
}
async function loadRoster(){
  if(store.kind!=="db"||!isAdmin){ rosterCache="na"; return }
  rosterCache=null;
  try{ const q=await store.db.collection("roster").orderBy("updated","desc").get();
    rosterCache=q.docs.map(d=>({id:d.id,...d.data()})); }
  catch(e){ rosterCache="err" }
  if(view==="admin") render();
}
async function load(){
  if(store.kind==="db"){
    const snap = await store.db.doc("data/users/"+store.uid+"/club/save").get();
    if(snap.exists){ const d=snap.data(); if(d && d.json) return JSON.parse(d.json) }
    return null;
  }
  try{const j=localStorage.getItem("floodlight-save"); return j?JSON.parse(j):null}catch(e){return null}
}

