/* ---------- boot ---------- */
async function connect(){
  if(!window.claude || !window.claude.use){ store.kind="local"; return }
  try{
    const [db,user]=await Promise.all([window.claude.use("db"),window.claude.use("user")]);
    const id = user ? await user.id() : null;
    if(db && id){ const me=await user.me(); store={kind:"db",db,uid:id,me}; isAdmin=!!(me&&me.isOwner) }
    else store.kind="local";
  }catch(e){ store.kind="local" }
}
function start(data){
  if(data && data.S){ S=data.S; view=data.view||"club" }
  render();
  const guard=setTimeout(()=>{ if(store.kind==="memory"){store.kind="local"; finishLoad()} },10000);
  connect().then(()=>{clearTimeout(guard); finishLoad()});
}
let loaded=false;
async function finishLoad(){
  if(loaded) return; loaded=true;
  try{ const saved=await load(); if(saved && saved.v===2){ if(!saved.h2h) saved.h2h={}; if(saved.januaryDone===undefined) saved.januaryDone=false; if(!saved.records) saved.records={bestWin:null}; if(saved.cupTrophies===undefined) saved.cupTrophies=0; if(!saved.cup) saved.cup=makeCup(Math.max(4, saved.round+2)); if(!saved.collected){ saved.collected=[...new Set(saved.squad.map(p=>p.rid).filter(Boolean))]; } if(saved.repPts===undefined){ saved.repPts=(saved.trophies||0)*45+(saved.cupTrophies||0)*20+(saved.history?saved.history.length*5:0); } if(saved.euro===undefined) saved.euro=null; if(saved.euroTrophies===undefined) saved.euroTrophies=0; if(!saved.proBump){ saved.squad.forEach(p=>{ if(p.prospect){ p.ovr=Math.min(PROSPECT_CAP,p.ovr+3); p.a=attrsFor(p.ovr,p.pos,p.rid); } }); saved.proBump=true; } if(!saved.academy){ saved.academy=(saved.squad||[]).filter(p=>!p.rid&&!p.prospect&&!p.ucl).map(p=>{ p.academy=true; return {id:p.id,n:p.n,pos:p.pos,ovr:p.ovr,season:saved.season,when:"Came through earlier"}; }); } if(!saved.academyProspects){ saved.academyProspects=Array.from({length:4},()=>makeProspect(15)); saved.squad.forEach(p=>{ if(!p.rid&&!p.prospect&&!p.ucl&&p.potential===undefined) p.potential=ri(82,90); }); } saved.squad.forEach(p=>{ if(!p.a||Object.keys(p.a).length<6) p.a=attrsFor(p.ovr,p.pos,p.rid) }); }
    if(saved && saved.v===2){ if(!saved.club.stadium) saved.club.stadium=saved.club.name+" Stadium"; }
    if(saved && saved.v===2 && (!S || (saved.round+saved.season*100)>=(S.round+S.season*100))) S=saved; }
  catch(e){ toast("Couldn't load your saved club. Try reloading the page.") }
  // one-time only: upgrade a pre-mixed-schedule save (then never touch fixtures again, so refreshing can't change your opponent)
  if(S && S.fixtures && !S.schedFixed){
    let played=false;
    for(let r=0;r<S.round;r++){ if(!myFixture(r).m.includes("bye")){ played=true; break } }
    if(!played){ S.round=0; S.results=[]; S.fixtures=makeFixtures(["you"].concat(S.teams.map(t=>t.id))); advanceByes(); }
    S.schedFixed=true; save();
  }
  // 26/27 database: Ipswich removed (old club 18), Hull moves 19 -> 18
  if(S && S.v===2 && !S.db2627){
    const rm=id=>id==="c18"?"bye":id==="c19"?"c18":id;
    const alive=new Set();
    S.squad=(S.squad||[]).filter(p=>!(p.rid&&p.rid.startsWith("18:")));
    S.squad.forEach(p=>{ if(p.rid&&p.rid.startsWith("19:")){ p.rid="18:"+p.rid.slice(3); p.club=18; } alive.add(p.id); });
    S.xi=(S.xi||[]).map(id=>alive.has(id)?id:null);
    S.collected=(S.collected||[]).filter(r=>!r.startsWith("18:")).map(r=>r.startsWith("19:")?"18:"+r.slice(3):r);
    if(S.teams){ S.teams=S.teams.filter(t=>t.id!=="c18").map(t=>{ const id=rm(t.id), c=CLUBS[+id.slice(1)]; return c?{id,name:c[0],short:c[1],c1:c[2],c2:c[3],str:t.str}:t; }); }
    if(S.fixtures){ S.fixtures=S.fixtures.map(rd=>rd.map(([h,a])=>[rm(h),rm(a)]));
      S.results=(S.results||[]).map((res,r)=>res&&res.map((sc,i)=>S.fixtures[r][i].includes("bye")?null:sc)); }
    if(S.h2h){ const h={}; Object.keys(S.h2h).forEach(k=>{ if(k!=="c18") h[rm(k)]=S.h2h[k]; }); S.h2h=h; }
    if(S.cup&&S.cup.rounds){ const used=new Set(S.cup.rounds.map(t=>rm(t.opp)));
      S.cup.rounds.forEach(t=>{ if(t.opp==="c18"){ let o; do{ o="c"+ri(0,CLUBS.length-1); }while(used.has(o)); used.add(o); t.opp=o; } else t.opp=rm(t.opp); }); }
    S.db2627=true; if(S.fixtures) advanceByes(); autoPick(); save();
  }
  render();
}
if(window.claude && window.claude.hot && window.claude.hot.snapshot){ try{ window.claude.hot.snapshot(()=>({S,view})) }catch(e){} }
window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});
