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
  try{ const saved=await load(); if(saved && saved.v===2){ if(!saved.h2h) saved.h2h={}; if(saved.januaryDone===undefined) saved.januaryDone=false; if(!saved.records) saved.records={bestWin:null}; if(saved.cupTrophies===undefined) saved.cupTrophies=0; if(!saved.cup) saved.cup=makeCup(Math.max(4, saved.round+2)); saved.squad.forEach(p=>{ if(!p.a||Object.keys(p.a).length<6) p.a=attrsFor(p.ovr,p.pos,p.rid) }); }
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
  render();
}
if(window.claude && window.claude.hot && window.claude.hot.snapshot){ try{ window.claude.hot.snapshot(()=>({S,view})) }catch(e){} }
window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});
