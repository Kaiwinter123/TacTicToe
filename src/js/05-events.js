/* ---------- events ---------- */
function bind(){
  document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>{view=b.dataset.view;ui.slot=null;render();window.scrollTo(0,0);if(view==="admin"&&rosterCache!=="na")loadRoster()}));
  document.querySelectorAll("[data-act]").forEach(el=>{
    const act=el.dataset.act;
    if(act==="formation"){el.addEventListener("change",()=>{S.formation=el.value;autoPick();save();render()});return}
    el.addEventListener("click",()=>handle(act,el));
  });
}
function handle(act,el){
  switch(act){
    case "play": advance(); break;
    case "buy": openPack(PACKS.find(p=>p.id===el.dataset.pack)); break;
    case "auto": autoPick(); ui.slot=null; save(); render(); toast("Best XI selected"); break;
    case "slot": {
      const i=+el.dataset.i;
      if(ui.slot===null) ui.slot=i;
      else if(ui.slot===i) ui.slot=null;
      else { const t=S.xi[ui.slot]; S.xi[ui.slot]=S.xi[i]; S.xi[i]=t; ui.slot=null; save(); toast("Positions swapped"); }
      render(); break;
    }
    case "cancelslot": ui.slot=null; render(); break;
    case "pcard": {
      const id=el.dataset.id;
      if(ui.slot!==null){
        const prev=S.xi.indexOf(id);
        if(prev>=0) S.xi[prev]=S.xi[ui.slot];
        S.xi[ui.slot]=id; ui.slot=null; ui.sel=null; save();
        const np=byId(id); toast(`${surname(np.n)} on`);
      } else ui.sel = ui.sel===id?null:id;
      render(); break;
    }
    case "subin": {
      const p=byId(el.dataset.id); if(!p) return;
      if(isInjured(p)){ toast(`${surname(p.n)} is injured and can't be selected.`); return; }
      const sls=slots();
      let idx = sls.findIndex(([pos],i)=>!S.xi[i] && pos===p.pos);
      if(idx<0) idx = sls.findIndex((x,i)=>!S.xi[i]);
      if(idx<0){
        let li=-1,lo=1e9;
        sls.forEach(([pos],i)=>{ if(pos===p.pos){const cur=byId(S.xi[i]); const e=cur?effective(cur,pos):0; if(e<lo){lo=e;li=i;}} });
        if(li>=0 && effective(p,sls[li][0])>lo) idx=li;
        if(idx<0){ li=-1;lo=1e9; sls.forEach(([pos],i)=>{const cur=byId(S.xi[i]); const e=cur?effective(cur,pos):0; if(e<lo){lo=e;li=i;}}); if(li>=0 && effective(p,sls[li][0])>lo) idx=li; }
      }
      if(idx<0){ toast("No clear upgrade — tap a pitch position to place them."); return; }
      S.xi[idx]=p.id; ui.sel=null; save(); render(); toast(`${surname(p.n)} into the XI`); break;
    }
    case "desel": ui.sel=null; render(); break;
    case "sell": {
      const pl=byId(el.dataset.id); if(!pl||S.squad.length<=11) return;
      const fee=value(pl.ovr); S.budget+=fee; S.squad=S.squad.filter(x=>x.id!==pl.id); S.xi=S.xi.map(x=>x===pl.id?null:x); ui.sel=null; save(); render();
      toast(`Sold ${surname(pl.n)} for ${money(fee)} \u2014 straight into the bank.`); break;
    }
    case "filter": ui.filter=el.dataset.f; render(); break;
    case "collfilter": ui.collFilter=el.dataset.f; render(); window.scrollTo(0,0); break;
    case "reset": ui.confirmReset=true; render(); break;
    case "reset-no": ui.confirmReset=false; render(); break;
    case "reset-yes": ui.confirmReset=false; resetClub(); break;
    case "next-season": nextSeason(); break;
    case "admin-refresh": rosterCache=null; render(); loadRoster(); break;
  }
}
async function resetClub(){
  try{
    if(store.kind==="db"){
      await store.db.doc("data/users/"+store.uid+"/club/save").delete();
      try{ await store.db.doc("roster/"+store.uid).delete(); }catch(e){}
    }
    try{ localStorage.removeItem("floodlight-save"); }catch(e){}
  }catch(e){}
  S=null; view="club"; rosterCache=null;
  ui={slot:null, filter:"ALL", sel:null, confirmReset:false};
  draft={manager:"",name:"",short:"",stadium:"",c1:"#e63946",c2:"#111111"};
  render(); toast("Everything reset — create your new club.");
}
function recordWin(mine,theirs,oppId,comp){
  if(mine<=theirs) return;
  // reputation: a win, worth more against a stronger team and by a bigger margin
  const oppStr=(ratingsFor(oppId).ovr)||75;
  addRep(1.4 + Math.max(0,oppStr-76)*0.8 + Math.max(0,(mine-theirs)-1)*0.35 + (comp==="League Cup"?0.6:0));
  if(!S.records) S.records={bestWin:null};
  const margin=mine-theirs, bw=S.records.bestWin;
  if(!bw || margin>bw.margin || (margin===bw.margin && mine>bw.me))
    S.records.bestWin={opp:teamInfo(oppId).name, oppShort:teamInfo(oppId).short, me:mine, them:theirs, margin, comp, season:S.season};
}
function nextSeason(){
  const tbl=table(), pos=tbl.findIndex(r=>r.id==="you")+1, prize=prizeFor(pos);
  const cup=S.cup, cupRes = cup? (cup.won?"Cup winners":cup.out?"Cup: out in "+cup.rounds[cup.idx].name:"Cup: reached "+cup.rounds[cup.idx].name) : "";
  S.history.push({season:S.season,pos,pts:tbl[pos-1].pts,cup:cupRes,title:pos===1});
  // reputation: how you finished the season is the biggest driver of stature
  addRep(pos===1?50 : pos<=4?24 : pos<=Math.ceil(tbl.length/2)?10 : 3);
  if(pos===1) S.trophies++;
  const summer=50; S.budget+=prize+summer; S.season++; S.round=0; S.results=[]; S.last=null; S.januaryDone=false; S.lastStar=null;
  S.squad.forEach(p=>{ if(p.inj) delete p.inj; if(p.prospect && p.ovr<PROSPECT_CAP){ p.ovr=Math.min(PROSPECT_CAP,p.ovr+1); p.a=attrsFor(p.ovr,p.pos,p.rid); } });
  graduateYouth(2, "Season "+S.season+" intake");
  S.teams=newSeasonTeams(S.teams);
  S.fixtures=makeFixtures(["you"].concat(S.teams.map(t=>t.id)));
  S.cup=makeCup(4); S.schedFixed=true;
  // European qualification for the new season, from the finish just achieved
  const euroComp = pos<=5?"ucl":pos===6?"uel":pos===7?"uecl":null;
  S.euro = euroComp ? makeEuro(euroComp) : null;
  const wasChampion = pos===1;
  if(wasChampion) S.budget += TROPHY_BONUS.title;
  advanceByes(); save(); render();
  toast(`${money(prize)} prize money + ${money(summer)} summer budget added. Season ${S.season} begins.`);
  const chain=[];
  if(wasChampion) chain.push(done=>showTrophy({name:"Premier League Champions",eyebrow:"Champions of England",sub:`${S.club.name} win the title! Season ${S.season-1} belongs to you.`,color:"#f4c84b",reward:TROPHY_BONUS.title}, done));
  if(euroComp) chain.push(done=>showEuroCongrats(euroComp, done));
  if(chain.length) runChain(chain);
}

/* ---------- pack opening ---------- */
function openPack(pk){
  if(S.budget<pk.price||S.squad.length+pk.count>MAX_SQUAD) return;
  S.budget-=pk.price; S.packs++;
  const got=[];
  const add=(t,min,hi,pos)=>{ const p=drawRealPack(t,pk.lo,hi||pk.hi,min,pos); if(!p) return; got.push(p); S.squad.push(p) };
  // the headline pull first, so the guarantee holds even as the pool thins; steer it to a needed position
  if(pk.guar) add(ri(pk.guar,pk.hi),pk.guar,null,gapPos());
  while(got.length<pk.count) add(rollOvr(pk.lo,pk.hi),null,null,gapPos());
  const PCH={bronze:.06,silver:.11,gold:.17,elite:.26};
  if(Math.random()<(PCH[pk.id]||0)){ const pr=drawProspect();
    if(pr){ const idx=pk.guar?ri(1,got.length-1):ri(0,got.length-1); const si=S.squad.indexOf(got[idx]); if(si>=0) S.squad.splice(si,1); got[idx]=pr; S.squad.push(pr); } }
  const UCH={bronze:0,silver:0,gold:0,elite:.2};
  if(Math.random()<(UCH[pk.id]||0)){ const uc=drawUCL();
    if(uc){ const idx=pk.guar?ri(1,got.length-1):ri(0,got.length-1); const si=S.squad.indexOf(got[idx]); if(si>=0) S.squad.splice(si,1); got[idx]=uc; S.squad.push(uc); } }
  got.sort((a,b)=>a.ovr-b.ovr);
  if(!S.collected) S.collected=[];
  got.forEach(p=>{ if(p.rid && !S.collected.includes(p.rid)) S.collected.push(p.rid); addRep(Math.max(0,(p.ovr-80))*0.6); });
  const topPull=got[got.length-1]; if(topPull && topPull.ovr>=86) S.lastStar=topPull.n;
  save();

  const ov=document.createElement("div"); ov.className="overlay"; ov.setAttribute("role","dialog"); ov.setAttribute("aria-label",pk.name+" pack");
  const top=got[got.length-1];
  ov.style.setProperty("--glow", got.some(x=>x.ucl)?"rgba(58,160,255,.42)":top.ovr>=84?"rgba(198,60,92,.35)":top.ovr>=75?"rgba(233,196,92,.28)":"rgba(185,195,208,.18)");
  ov.innerHTML=`<span class="eyebrow">${pk.name} pack</span><button class="sealed ${pk.foil}" id="seal" aria-label="Tear open the pack"><span>${pk.name}<br><small style="font-size:18px">Tap to open</small></span></button>`;
  document.body.appendChild(ov);
  const seal=ov.querySelector("#seal"); seal.focus();
  let opened=false;
  seal.addEventListener("click",()=>{
    if(opened) return; opened=true;
    seal.classList.add("shake");
    setTimeout(()=>{
      ov.innerHTML=`<span class="eyebrow">${pk.name} pack · ${got.length} players</span>
        <div class="reveal">${got.map((p,i)=>`<div class="flip" data-i="${i}"><div class="in"><div class="back ${pk.foil}"><span>?</span></div><div class="front">${card(p)}</div></div></div>`).join("")}</div>
        <div class="row" id="pkact" hidden><button class="btn primary" id="done">Add to squad</button></div>
        <p class="muted" id="pkmsg" style="margin:0"></p>`;
      const flips=[...ov.querySelectorAll(".flip")];
      const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
      flips.forEach((f,i)=>setTimeout(()=>f.classList.add("open"), reduce?0:350+i*(i===flips.length-1?700:520)));
      setTimeout(()=>{
        ov.querySelector("#pkact").hidden=false;
        const b=top, ucp=got.find(x=>x.ucl), prp=got.find(x=>x.prospect); ov.querySelector("#pkmsg").textContent = ucp?`\u2b50 EUROPE\u2019S FINEST card! ${ucp.n} (${ucp.ovr} ${ucp.pos}) \u2014 a European superstar joins you!`:prp?`\u2b50 Future prospect signed: ${prp.n} \u2014 starts ${prp.ovr}, rises +1 every season!`:b.ovr>=86?`Elite signing: ${b.n}, rated ${b.ovr}.`:`Best pull: ${b.n} (${b.ovr} ${b.pos}).`;
        ov.querySelector("#done").focus();
      }, reduce?50:350+flips.length*520+600);
      ov.querySelector("#done").addEventListener("click",()=>{ov.remove();autoPickIfBetter();render()});
    }, matchMedia("(prefers-reduced-motion: reduce)").matches?0:480);
  });
}
function autoPickIfBetter(){
  const before=teamRatings().ovr, keep=S.xi.slice(); autoPick();
  if(teamRatings().ovr<=before+0.01) S.xi=keep; else toast("New signings moved into your best XI");
  save();
}

