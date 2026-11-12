/* ---------- match ---------- */
// --- post-match social reactions (X-style) ---
const SOCIAL_USERS=[
  {n:"Terrace Talk",h:"@terracetalk",v:false},{n:"The Touchline",h:"@touchline90",v:true},
  {n:"Footy Banter HQ",h:"@footybanterhq",v:false},{n:"xG Merchant",h:"@xg_merchant",v:false},
  {n:"Gaffer's Corner",h:"@gafferscorner",v:true},{n:"Prem Pundit",h:"@prempundit",v:true},
  {n:"Ultra Dan",h:"@dan_ultra",v:false},{n:"The Boot Room",h:"@thebootroom",v:false},
  {n:"Half-Time Takes",h:"@halftimetakes",v:false},{n:"Megan ⚽",h:"@meg_matchday",v:false},
  {n:"The 12th Man",h:"@twelfthman_",v:false},{n:"Sunday League Scout",h:"@parkfootyscout",v:false},
  {n:"Rory",h:"@rory_httid",v:false},{n:"Matchday Minutes",h:"@mdminutes",v:true}
];
const AVCOL=["#1d9bf0","#e0245e","#17bf63","#f45d22","#794bc4","#f4c84b","#00b4d8","#ff7b00"];
const T_WIN=[
  "GET IN!! {club} were brilliant today. {manager} has them flying. {score} 🔥",
  "{scorer} take a bow 👏 absolutely unplayable this afternoon. We are SO back.",
  "Say what you want about {manager} but {club} look the real deal right now. Big one over {opp}.",
  "{score} and it could've been more. Defence solid, {scorer} clinical. Perfect day 🙌",
  "{manager} out-thought {opp} from minute one. Love this team man ❤️",
  "Book the parade 😂 {club} looking unstoppable. {scorer} is HIM.",
  "Three points, clean sheet energy, momentum building. {manager} knows exactly what he's doing."
];
const T_DRAW=[
  "A point vs {opp}. {club} huffed and puffed but no cutting edge. {manager} needs a plan B.",
  "{score}. Led it, gave it back. Same old {club} 🤦 frustrating watch.",
  "Not a disaster, not a triumph. {manager} will call it a point gained. I call it two dropped.",
  "Honestly that was... fine? Need way more from the forwards if we're being real.",
  "Decent point against {opp} to be fair. {manager} steadying the ship 👏",
  "{club} fans split down the middle after that one. Me? I'm just numb 😅"
];
const T_LOSS=[
  "Shambolic. {club} had no fight, no ideas. {manager} OUT. {score} flatters us 😡",
  "How is {player} STILL starting?? Costing us every week. {manager} must see it surely.",
  "{opp} bullied us all over the park. Worrying times at {club} #CrisisClub",
  "Lost to {opp}... {score}. The defending was criminal. {manager} has serious questions.",
  "Woeful. Spineless. Not good enough for this badge. Reaction needed and FAST.",
  "{manager} is taking us NOWHERE. Same mistakes, same result. Fuming 🤬",
  "{player} had a shocker but it's a team game — {manager} got the setup all wrong."
];
const T_PUNDIT=[
  "TACTICAL NOTE: {manager}'s {club} were second best in midfield vs {opp}. Fixable, but a worry.",
  "Neutral's view: {club} {verb} today. {score} vs {opp}. {manager} has a project on his hands.",
  "The numbers don't lie — {club} {verb} against {opp}. One for the data heads 📊"
];
function socialAvatar(u){
  let h=0; for(const c of u.h) h=(h*31+c.charCodeAt(0))>>>0;
  const col=AVCOL[h%AVCOL.length];
  const init=u.n.replace(/[^A-Za-z ]/g,"").trim().split(/\s+/).slice(0,2).map(w=>w[0]||"").join("").toUpperCase()||"?";
  return `<span class="xav" style="background:${col}">${esc(init)}</span>`;
}
function fmtK(n){ return n>=1000 ? (n/1000).toFixed(1).replace(/\.0$/,"")+"K" : ""+n; }
function themeClass(t){ return ({cup:"cuptheme",ucl:"ucltheme",uel:"ueltheme",uecl:"uecltheme"})[t]||""; }
function showEuroCongrats(comp, onDone){
  const m=EURO_META[comp];
  const ov=document.createElement("div"); ov.className="overlay "+themeClass(comp); ov.setAttribute("role","dialog"); ov.setAttribute("aria-label","European qualification");
  ov.innerHTML=`<div class="jancard eurocard">
    <div class="janicon">🌟</div>
    <span class="eyebrow">Qualification confirmed</span>
    <h2>${esc(S.club.name)} are into the<br>${esc(m.name)}!</h2>
    <p>Congratulations — your league finish has earned <b>${esc(S.club.name)}</b> a place in next season’s <b>${esc(m.name)}</b>. European nights are coming to ${esc(S.club.stadium)}. Check the <b>Competitions</b> tab for your draw.</p>
    <div class="row" style="justify-content:center"><button class="btn primary" id="eok">Bring on Europe →</button></div>
  </div>`;
  document.body.appendChild(ov);
  ov.querySelector("#eok").addEventListener("click",()=>{ ov.remove(); onDone&&onDone(); });
  ov.querySelector("#eok").focus();
}
function showSocial(ctx, onDone){
  const club=S.club.name, cshort=S.club.short, manager=S.manager;
  const scorer = ctx.scorers.length ? surname(pick(ctx.scorers)) : null;
  const xiP = S.xi.map(byId).filter(Boolean);
  const scape = xiP.length ? surname(pick(xiP).n) : "the defence";
  const verb = ctx.win>0?"deserved every bit of that":ctx.win<0?"were well below it":"just about earned their point";
  const tone = ctx.win>0?T_WIN:ctx.win<0?T_LOSS:T_DRAW;
  // wider context: league position, streak, title / relegation, signings, windfalls
  const tbl=table(), meRow=tbl.find(x=>x.id==="you")||{form:[],p:0}, pos=tbl.findIndex(x=>x.id==="you")+1, N=tbl.length;
  const form=meRow.form||[]; let sv=form.length?form[form.length-1]:null, streak=0; for(let i=form.length-1;i>=0&&form[i]===sv;i--) streak++;
  const star = S.lastStar ? surname(S.lastStar) : null;
  const ctxLines=[];
  if(ctx.injury) ctxLines.unshift("😬 Injury blow — {injured} limps off for {club}. {manager} has a reshuffle on his hands.");
  (ctx.recovered||[]).slice(0,1).forEach(n=> ctxLines.push("➕ "+esc(surname(n))+" is back from injury for {club} — a lift for {manager}."));
  if(ctx.motm) ctxLines.push("⭐ {motm} was the standout today — give that man the headlines. {manager} will be buzzing.");
  if(S.lastStar) ctxLines.push("BREAKING 📝 {club} have signed {star}! Proper statement of intent from {manager}.");
  if(ctx.january) ctxLines.push("💰 {club} hand {manager} a £30m January top-up. Spend it well, gaffer!");
  if(ctx.cup){ ctxLines.unshift(ctx.cup.won ? (ctx.cup.final?"WE'VE WON THE CUP \ud83c\udfc6\ud83c\udfc6 {manager} is a LEGEND. Get it in the cabinet!!":"Into the next round of the Cup \ud83c\udfc6 {club} march on. {manager} rotating like a pro.") : "OUT of the Cup to {opp} \ud83d\ude29 {manager} says we focus on the league now."); }
  if(ctx.euro){ const en=ctx.euro.name; ctxLines.unshift(ctx.euro.won ? (ctx.euro.final?`CHAMPIONS OF EUROPE \ud83c\udfc6\u2b50 {club} have WON THE ${en.toUpperCase()}!! {manager} writes his name into history.`:`{club} are through in the ${en} \ud83c\udfc6 European nights at {club}, {manager} loving it.`) : `Europe\u2019s dream is over \u2014 {club} knocked out of the ${en} by {opp}. \ud83d\ude14`); }
  if(meRow.p>5 && pos<=4) ctxLines.push(pos===1?"TOP OF THE LEAGUE 🏆 pinch me. {manager} is building something special at {club}.":"{club} in the TOP FOUR 🌟 {manager} has us dreaming of Europe.");
  else if(meRow.p>5 && pos>=N-2) ctxLines.push("{club} in the drop zone 😬 {manager}, it's squeaky-bum time.");
  if(streak>=3 && sv==="W") ctxLines.push(streak+" wins on the spin!! {club} are UNREAL right now 🔥 {manager} magic.");
  if(streak>=3 && sv==="L") ctxLines.push(streak+" defeats in a row... is {manager} losing the dressing room? 😤");
  const fill = t => t.replace(/{club}/g,esc(club)).replace(/{opp}/g,esc(ctx.opp)).replace(/{manager}/g,esc(manager))
    .replace(/{score}/g,esc(ctx.score)).replace(/{scorer}/g,esc(scorer||"the lads")).replace(/{player}/g,esc(scape)).replace(/{verb}/g,esc(verb)).replace(/{star}/g,esc(star||"a new face")).replace(/{motm}/g,esc(ctx.motm?surname(ctx.motm):"the skipper")).replace(/{injured}/g,esc(ctx.injury?surname(ctx.injury):"a key man"));
  S.lastStar=null; // consumed
  let lines = ctxLines.slice(0,2).concat(tone.slice().sort(()=>Math.random()-.5).slice(0,3));
  lines.splice(ri(1,Math.max(1,lines.length)),0, pick(T_PUNDIT));
  lines = lines.slice(0,6);
  const users = SOCIAL_USERS.slice().sort(()=>Math.random()-.5);
  const posts = lines.map((t,i)=>{ const u=users[i%users.length]; const base=u.v?ri(400,5200):ri(8,900);
    return {u, txt:fill(t), time:(i*4+1+ri(0,5))+"m", likes:base, rt:Math.floor(base/ (3+ri(0,4))), rep:ri(2,120)}; });
  const sov=document.createElement("div"); sov.className="overlay socov"+(ctx.theme?" "+themeClass(ctx.theme):ctx.cup?" cuptheme":""); sov.setAttribute("role","dialog"); sov.setAttribute("aria-label","Fan reaction");
  sov.innerHTML=`<span class="eyebrow">Full time · the fans react</span>
    <div class="phone">
      <div class="phnotch"></div>
      <div class="phhead"><span class="phback">‹</span><div style="min-width:0"><b>Match Chatter</b><span class="phsub">${esc(cshort)} ${esc(ctx.score)} ${esc(ctx.oppShort)} · trending now</span></div><span class="phlogo">𝕏</span></div>
      <div class="phfeed">${posts.map(p=>`<article class="xp">${socialAvatar(p.u)}<div style="min-width:0">
        <div class="xhead"><b>${esc(p.u.n)}</b>${p.u.v?'<span class="xver">✓</span>':''}<span class="xhandle">${esc(p.u.h)}</span><span class="xtime">· ${p.time}</span></div>
        <div class="xtext">${p.txt}</div>
        <div class="xacts"><span>🗨 ${p.rep}</span><span>🔁 ${fmtK(p.rt)}</span><span>♥ ${fmtK(p.likes)}</span><span>↗</span></div>
      </div></article>`).join("")}</div>
    </div>
    <div class="row"><button class="btn primary" id="scont">Continue ▶</button></div>`;
  document.body.appendChild(sov);
  sov.querySelector("#scont").addEventListener("click",()=>{ sov.remove(); onDone(); });
  sov.querySelector("#scont").focus();
}
function roundDayOffset(round){ // 0=Sat,1=Sun,-1=Fri,2=Mon,4=Wed(midweek)
  let h=(round*2654435761 + (2025+S.season)*40503)>>>0; h=((h^(h>>>13))*1274126177)>>>0; const x=h%100;
  if(x<42) return 0; if(x<70) return 1; if(x<83) return -1; if(x<93) return 2; return 4;
}
function mDateObj(round){ return new Date(seasonStart()+(round*7+roundDayOffset(round))*864e5); }
// Tick through the calendar days leading up to a match, then kick off.
function runDays(r,h,a,done){
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const home=h==="you", opp=teamInfo(home?a:h), toD=mDateObj(r);
  let pp=-1; for(let q=r-1;q>=0;q--){ if(!myFixture(q).m.includes("bye")){ pp=q; break; } }
  const fromD = pp>=0 ? new Date(mDateObj(pp).getTime()+864e5) : new Date(toD.getTime()-5*864e5);
  let days=[]; for(let t=fromD.getTime(); t<toD.getTime(); t+=864e5) days.push(new Date(t));
  if(days.length>6) days=days.slice(-6);
  days.push(new Date(toD));
  if(reduce){ done(); return; }
  const flavor=["Training session","Recovery & gym","Rest day","Tactics meeting","Light session","Set-piece drills","Travel & scouting"];
  const ov=document.createElement("div"); ov.className="overlay dayov"; ov.setAttribute("role","dialog"); ov.setAttribute("aria-label","Countdown to the match");
  ov.innerHTML=`<span class="eyebrow">Matchday ${r+1} · ${home?"Home at "+esc(S.club.stadium):"Away at "+esc(stadiumFor(opp.short)||opp.name)}</span>
    <div class="daycard" id="dc"><div class="dayweek" id="dw"></div><div class="daybig" id="db"></div><div class="daymon" id="dm"></div></div>
    <div class="daylabel" id="dl"></div>
    <div class="daydots" id="dd"></div>
    <div class="row"><button class="btn" id="dskip">Skip to kick off ▶</button></div>`;
  document.body.appendChild(ov);
  const dw=ov.querySelector("#dw"),db=ov.querySelector("#db"),dm=ov.querySelector("#dm"),dl=ov.querySelector("#dl"),dc=ov.querySelector("#dc"),dd=ov.querySelector("#dd");
  dd.innerHTML=days.map(()=>'<span class="dot2"></span>').join(""); const dots=[...dd.children];
  let idx=0, timer=null, over=false;
  const finishUp=()=>{ if(over) return; over=true; if(timer) clearInterval(timer); ov.remove(); done(); };
  const show=()=>{
    const d=days[idx], last=idx===days.length-1;
    dw.textContent=CAL_WD[d.getUTCDay()]; db.textContent=d.getUTCDate(); dm.textContent=CAL_MO[d.getUTCMonth()]+" "+d.getUTCFullYear();
    dl.innerHTML = last ? `<b class="md">MATCHDAY</b> · ${home?"vs "+esc(opp.name)+" at "+esc(S.club.stadium):"away at "+esc(stadiumFor(opp.short)||opp.name)}` : esc(flavor[idx%flavor.length]);
    dc.classList.toggle("match",last); dots.forEach((x,k)=>x.classList.toggle("on",k<=idx));
    dc.classList.remove("flip"); void dc.offsetWidth; dc.classList.add("flip");
  };
  ov.querySelector("#dskip").addEventListener("click",finishUp);
  show();
  if(days.length===1){ setTimeout(finishUp,1000); return; }
  timer=setInterval(()=>{ idx++; show(); if(idx>=days.length-1){ clearInterval(timer); timer=null; setTimeout(finishUp,1050); } },240);
}
function scorer(team){
  if(team==="you"){
    const w=[];slots().forEach(([pos],i)=>{const p=byId(S.xi[i]);if(p)w.push([p,pos==="FWD"?6:pos==="MID"?3:pos==="DEF"?1:0])});
    const tot=w.reduce((a,b)=>a+b[1],0); let r=Math.random()*tot;
    for(const [p,x] of w){r-=x;if(r<=0)return p.n} return "Own goal";
  }
  const ci=+String(team).slice(1), c=POOL.filter(p=>p.club===ci&&p.pos!=="GK"&&!S.squad.some(q=>q.rid===p.rid));
  const w=c.map(p=>[p,p.pos==="FWD"?6:p.pos==="MID"?3:1]), tot=w.reduce((a,b)=>a+b[1],0); let x=Math.random()*tot;
  for(const [p,k] of w){x-=k;if(x<=0)return p.n}
  return "Own goal";
}
function previewInfo(o){
  const R=teamRatings(), O=ratingsFor(o.oppId), opp=teamInfo(o.oppId);
  const tbl=table(), meRow=tbl.find(x=>x.id==="you")||{form:[],pts:0}, oppRow=tbl.find(x=>x.id===o.oppId)||{form:[],pts:0};
  const mePos=tbl.findIndex(x=>x.id==="you")+1, oppPos=tbl.findIndex(x=>x.id===o.oppId)+1;
  const venue=o.finalNeutral?"Wembley Stadium":(o.home?S.club.stadium:(stadiumFor(opp.short)||opp.name));
  const dl=CAL_WD[o.date.getUTCDay()]+" "+o.date.getUTCDate()+" "+CAL_MO[o.date.getUTCMonth()]+" "+o.date.getUTCFullYear();
  return {comp:o.comp, roundLabel:o.roundLabel, dateLabel:dl, home:o.home, finalNeutral:o.finalNeutral, venue, opp, R, O, meForm:meRow.form||[], oppForm:oppRow.form||[], mePos, oppPos, rec:(S.h2h&&S.h2h[o.oppId]), theme:o.theme};
}
function showMatchPreview(info, onKick){
  const bar=v=>clamp((v-40)/55*100,2,100);
  const fm=f=>`<span class="form">${f.slice(-5).map(x=>`<span class="${x}">${x}</span>`).join("")||'<span class="muted" style="width:auto;font-weight:400">no games yet</span>'}</span>`;
  const row=(lbl,you,them)=>`<div class="pvstat"><span class="pl">${Math.round(you)}</span><div class="pvbars"><span class="pvl">${esc(lbl)}</span><div class="pvb"><i style="width:${bar(you)}%"></i></div><div class="pvb them"><i style="width:${bar(them)}%"></i></div></div><span class="pr">${Math.round(them)}</span></div>`;
  const rec=info.rec;
  const h2h = rec&&rec.log.length ? `<div class="pvh2h"><span class="eyebrow">Head to head</span> &nbsp; <b class="hw">${rec.w}W</b> <b class="hd">${rec.d}D</b> <b class="hl">${rec.l}L</b></div>` : `<div class="pvh2h muted">First ever meeting with ${esc(info.opp.name)}</div>`;
  const vtag = info.finalNeutral?`<span class="vtag cup">FINAL</span> Wembley Stadium`:info.home?`<span class="vtag home">HOME</span> At ${esc(S.club.stadium)}`:`<span class="vtag away">AWAY</span> At ${esc(info.venue)}`;
  const ov=document.createElement("div"); ov.className="overlay"+(info.theme?" "+themeClass(info.theme):""); ov.setAttribute("role","dialog"); ov.setAttribute("aria-label","Match preview");
  ov.innerHTML=`<div class="preview-card">
    <span class="eyebrow" style="text-align:center">${esc(info.comp)} \u00b7 ${esc(info.roundLabel)} \u00b7 ${esc(info.dateLabel)}</span>
    <div class="pvteams">
      <div class="pvteam">${crest(S.club.c1,S.club.c2,S.club.short,54)}<b>${esc(S.club.name)}</b><span class="ovr num">${Math.round(info.R.ovr)}</span>${fm(info.meForm)}</div>
      <div class="pvv">V</div>
      <div class="pvteam">${crest(info.opp.c1,info.opp.c2,info.opp.short,54)}<b>${esc(info.opp.name)}</b><span class="ovr num">${Math.round(info.O.ovr)}</span>${fm(info.oppForm)}</div>
    </div>
    <div class="venue" style="justify-content:center">${vtag}</div>
    <div class="pvstats">${row("Attack",info.R.att,info.O.att)}${row("Defence",info.R.def,info.O.def)}${row("Overall",info.R.ovr,info.O.ovr)}</div>
    ${h2h}
    <div class="mentsel">
      <span class="eyebrow" style="text-align:center;display:block;margin-bottom:6px">Your approach</span>
      <div class="mentbtns">
        <button type="button" class="ment" data-ment="defend">\ud83d\udee1\ufe0f Defensive</button>
        <button type="button" class="ment on" data-ment="balanced">\u2696\ufe0f Balanced</button>
        <button type="button" class="ment" data-ment="attack">\u2694\ufe0f Attacking</button>
      </div>
      <span class="menthint" id="menthint">Balanced \u2014 a measured game plan.</span>
    </div>
    <div class="row" style="justify-content:center"><button class="btn primary" id="pvkick">Kick off \u26bd</button><button class="btn" id="pvback">Back</button></div>
  </div>`;
  document.body.appendChild(ov);
  const MHINT={defend:"Defensive \u2014 soak up pressure, fewer goals, tighter at the back.",balanced:"Balanced \u2014 a measured game plan.",attack:"Attacking \u2014 chase the win, but you'll leave gaps."};
  let ment="balanced";
  const hint=ov.querySelector("#menthint");
  ov.querySelectorAll(".ment").forEach(btn=>btn.addEventListener("click",()=>{
    ment=btn.dataset.ment; ov.querySelectorAll(".ment").forEach(b=>b.classList.toggle("on",b===btn)); hint.textContent=MHINT[ment];
  }));
  ov.querySelector("#pvkick").addEventListener("click",()=>{ ov.remove(); onKick(ment); });
  ov.querySelector("#pvback").addEventListener("click",()=>{ ov.remove(); });
  ov.querySelector("#pvkick").focus();
}
function showJanuaryNotice(onDone){
  const ov=document.createElement("div"); ov.className="overlay jannote"; ov.setAttribute("role","dialog"); ov.setAttribute("aria-label","January transfer window");
  ov.innerHTML=`<div class="jancard">
    <div class="janicon">\ud83d\udcb0</div>
    <span class="eyebrow">Transfer window open</span>
    <h2>January Board\u00a0Investment</h2>
    <p>The board has backed you with a <b>\u00a330m</b> January top-up. Open packs now to strengthen for the title run-in.</p>
    <div class="row" style="justify-content:center"><button class="btn primary" id="jok">Open packs \u2192</button><button class="btn" id="jlater">Maybe later</button></div>
  </div>`;
  document.body.appendChild(ov);
  ov.querySelector("#jok").addEventListener("click",()=>{ ov.remove(); view="packs"; onDone(); });
  ov.querySelector("#jlater").addEventListener("click",()=>{ ov.remove(); onDone(); });
  ov.querySelector("#jok").focus();
}
// ---- shared match engine ----
const GOAL_TYPE=["slots it into the corner","rises highest to head home","curls one into the top corner","taps in from close range","drills it low past the keeper","lashes it in off the underside of the bar","finishes off a flowing move","volleys home first time"];
const PEN_TYPE=["sends the keeper the wrong way from the spot","buries the penalty into the roof of the net"];
const SAVE_TXT=["forces a brilliant save","is denied by a fingertip stop","sees a header tipped over the bar","draws a sharp stop at the near post"];
const MISS_TXT=["fires just wide","drags it past the far post","blazes over from distance","scuffs it straight at the keeper","heads over from a good position"];
const WOOD_TXT=["rattles the crossbar","clips the outside of the post","smashes it against the upright"];
const CORNER_TXT=["wins a corner","forces a corner after a goalmouth scramble","swings in a dangerous corner"];
const CARD_TXT=["is booked for a late challenge","goes into the book for dissent","picks up a yellow for a cynical foul"];
// injury severity tiers (games = matches the player will miss)
const INJ_TIERS=[
  {label:"Knock",         sev:"minor",    min:1, max:1,  weight:34},
  {label:"Minor strain",  sev:"minor",    min:2, max:3,  weight:30},
  {label:"Pulled muscle", sev:"moderate", min:4, max:6,  weight:22},
  {label:"Serious injury",sev:"serious",  min:8, max:12, weight:14}
];
function pickInjTier(){ const tot=INJ_TIERS.reduce((a,t)=>a+t.weight,0); let r=Math.random()*tot; for(const t of INJ_TIERS){ r-=t.weight; if(r<=0) return t; } return INJ_TIERS[0]; }
const INJ_TXT=["pulls up and can't continue","goes down holding their hamstring","lands awkwardly and signals to the bench","limps off after a heavy challenge"];
function teamScorers(team){
  if(team==="you") return S.xi.map(byId).filter(Boolean);
  if(typeof team==="string" && team.slice(0,2)==="e:"){ const e=euroTeam(team.slice(2)); return e?e.players:[]; }
  const ci=+String(team).slice(1);
  return POOL.filter(p=>p.club===ci && !S.squad.some(q=>q.rid===p.rid));
}
function weightedOutfield(list){
  const w=list.filter(p=>p.pos!=="GK").map(p=>[p,(p.pos==="FWD"?6:p.pos==="MID"?3:1)]);
  if(!w.length) return null;
  const tot=w.reduce((x,y)=>x+y[1],0); let r=Math.random()*tot;
  for(const [p,x] of w){ r-=x; if(r<=0) return p; } return w[0][0];
}
function pickMOTM(h,a,gh,ga,events){
  const xi=S.xi.map(byId).filter(Boolean); if(!xi.length) return null;
  const youHome=h==="you", mine=youHome?gh:ga, theirs=youHome?ga:gh;
  const myGoals=events.filter(e=>e.type==="goal"&&e.team==="you").map(e=>e.who);
  const cnt={}; myGoals.forEach(n=>cnt[n]=(cnt[n]||0)+1);
  let best=null,bs=-1;
  xi.forEach(p=>{ let s=(effective(p,p.pos)||p.ovr)+(cnt[p.n]||0)*30;
    if(mine>theirs && theirs===0 && (p.pos==="GK"||p.pos==="DEF")) s+=10;
    s+=Math.random()*6; if(s>bs){bs=s;best=p;} });
  if(!best) return null;
  const g=cnt[best.n]||0;
  const rating=clamp(6.6+g*1.1+(mine>theirs?0.7:mine<theirs?-0.3:0.1)+Math.random()*0.7,6,10).toFixed(1);
  return {n:best.n,pos:best.pos,goals:g,rating};
}
// ment: "attack" | "balanced" | "defend" (your side's approach)
function simMatch(h,a,ment){
  let [lh,la]=lambdas(h,a);
  const youHome=h==="you";
  if(ment==="attack"){ if(youHome){lh*=1.2;la*=1.12;} else {la*=1.2;lh*=1.12;} }
  else if(ment==="defend"){ if(youHome){lh*=0.8;la*=0.86;} else {la*=0.8;lh*=0.86;} }
  const gh=poisson(lh), ga=poisson(la), events=[];
  const addGoals=(team,n)=>{ const list=teamScorers(team);
    for(let k=0;k<n;k++){ const pen=Math.random()<0.1, sc=weightedOutfield(list)||{n:"an own goal",pos:"FWD"};
      let assist=null; if(!pen && Math.random()<0.62){ const a2=weightedOutfield(list.filter(p=>p!==sc)); if(a2) assist=a2.n; }
      events.push({min:ri(1,90),team,type:"goal",who:sc.n,assist,pen,desc:pen?pick(PEN_TYPE):pick(GOAL_TYPE)}); } };
  addGoals(h,gh); addGoals(a,ga);
  const extra=ri(7,12);
  for(let k=0;k<extra;k++){ const team=Math.random()<lh/(lh+la)?h:a, list=teamScorers(team), pl=weightedOutfield(list), who=pl?pl.n:null, roll=Math.random();
    const kind = roll<0.30?"save":roll<0.56?"miss":roll<0.73?"corner":roll<0.87?"wood":"card";
    let txt;
    if(kind==="save") txt=(who?surname(who)+" ":"")+pick(SAVE_TXT);
    else if(kind==="miss") txt=(who?surname(who)+" ":"")+pick(MISS_TXT);
    else if(kind==="corner") txt=teamInfo(team).short+" "+pick(CORNER_TXT);
    else if(kind==="wood") txt=(who?surname(who)+" ":"")+pick(WOOD_TXT);
    else txt=(who?surname(who)+" ":"A "+teamInfo(team).short+" player ")+pick(CARD_TXT);
    events.push({min:ri(1,90),team,type:kind,who,txt}); }
  // random injury to one of your players on the pitch (~1 in 6 matches)
  let injury=null;
  if(Math.random()<1/6){
    const xi=S.xi.map(byId).filter(p=>p&&!isInjured(p));
    if(xi.length){ const v=pick(xi), t=pickInjTier(), games=ri(t.min,t.max);
      injury={pid:v.id, who:v.n, pos:v.pos, label:t.label, sev:t.sev, games};
      events.push({min:ri(12,86),team:"you",type:"injury",who:v.n,label:t.label,sev:t.sev,games,txt:surname(v.n)+" "+pick(INJ_TXT)}); }
  }
  events.sort((x,y)=>x.min-y.min);
  const possH=clamp(Math.round(50+(lh-la)*9+(Math.random()*8-4)),30,70);
  const motm=pickMOTM(h,a,gh,ga,events);
  return {lh,la,gh,ga,events,poss:[possH,100-possH],motm,ment,injury};
}
// shots/on-target/corners derived from the timeline so live totals match the summary
function matchStats(events,h,a,poss){
  const sh={}, st={}, co={}; sh[h]=sh[a]=st[h]=st[a]=co[h]=co[a]=0;
  events.forEach(e=>{ if(e.type==="goal"){sh[e.team]++;st[e.team]++;}
    else if(e.type==="save"){sh[e.team]++;st[e.team]++;}
    else if(e.type==="miss"||e.type==="wood"){sh[e.team]++;}
    else if(e.type==="corner"){co[e.team]++;} });
  return {poss, shots:[sh[h],sh[a]], sot:[st[h],st[a]], corners:[co[h],co[a]]};
}
// Tick existing injuries down a match, then apply this match's new injury (if any).
function processInjuries(sim){
  const recovered=[];
  S.squad.forEach(p=>{ if(p.inj && p.inj.games>0){ p.inj.games--; if(p.inj.games<=0){ recovered.push(p.n); delete p.inj; } } });
  let injured=null;
  if(sim.injury){ const v=byId(sim.injury.pid);
    if(v && !isInjured(v)){
      v.inj={label:sim.injury.label, sev:sim.injury.sev, games:sim.injury.games};
      const slot=S.xi.indexOf(v.id); let repName=null;
      if(slot>=0){ const pos=slots()[slot][0], rep=bestFitFor(pos); S.xi[slot]=rep?rep.id:null; repName=rep?rep.n:null; }
      injured={who:v.n, label:sim.injury.label, sev:sim.injury.sev, games:sim.injury.games, replacedBy:repName};
    }
  }
  return {recovered, injured};
}
function injuryToast(res){
  if(res.injured){ const i=res.injured;
    toast(`✚ ${surname(i.who)} — ${i.label.toLowerCase()}, out ${i.games} game${i.games>1?"s":""}.`+(i.replacedBy?` ${surname(i.replacedBy)} fills in.`:" Re-pick your XI in Squad."));
  } else if(res.recovered.length){ toast(`➕ ${surname(res.recovered[0])} is back from injury.`); }
}
function showMatchOverlay(o, onDone){
  const H=teamInfo(o.h), A=teamInfo(o.a), events=o.events, gh=o.gh, ga=o.ga;
  const ov=document.createElement("div"); ov.className="overlay"+(o.theme?" "+themeClass(o.theme):""); ov.setAttribute("role","dialog"); ov.setAttribute("aria-label","Match");
  const stats=matchStats(events,o.h,o.a,o.poss||[50,50]);
  ov.innerHTML=`<span class="eyebrow">${esc(o.title)}</span>
    <div class="board"><div class="tm">${crest(H.c1,H.c2,H.short,48)}${esc(H.name)}</div><div><div class="sc" id="sc">0\u20130</div><div class="clk" id="clk">0'</div></div><div class="tm">${crest(A.c1,A.c2,A.short,48)}${esc(A.name)}</div></div>
    <div class="momrow"><span class="marr" id="marrL">\u25c0</span><div class="mbar"><span class="mcenter"></span><i id="mom"></i></div><span class="marr" id="marrR">\u25b6</span></div>
    <div class="momcap"><span>${esc(H.short)}</span><span id="momtxt">Momentum</span><span>${esc(A.short)}</span></div>
    <div class="pbar"><i id="pb"></i></div>
    <div class="mstats" aria-hidden="true"><div class="mscol"><b id="poH">50%</b><b id="shH">0</b><b id="stH">0</b><b id="coH">0</b></div><div class="mslab"><span>Possession</span><span>Shots</span><span>On target</span><span>Corners</span></div><div class="mscol r"><b id="poA">50%</b><b id="shA">0</b><b id="stA">0</b><b id="coA">0</b></div></div>
    <div class="led"><div class="ledtrack">${(()=>{const seg='<span>UpNorthPlumbing</span><span class="d">\u2022</span><span>Official Sponsor</span><span class="d">\u2022</span>';const half=seg.repeat(3);return half+half;})()}</div></div>
    <div class="feed" id="feed" aria-live="polite"></div>
    <div class="row"><button class="btn" id="skip">Skip to full time</button></div>`;
  document.body.appendChild(ov);
  const feed=ov.querySelector("#feed"), sc=ov.querySelector("#sc"), clk=ov.querySelector("#clk"), pb=ov.querySelector("#pb"), board=ov.querySelector(".board");
  const momEl=ov.querySelector("#mom"), marrL=ov.querySelector("#marrL"), marrR=ov.querySelector("#marrR"), momtxt=ov.querySelector("#momtxt");
  const el={shH:ov.querySelector("#shH"),stH:ov.querySelector("#stH"),coH:ov.querySelector("#coH"),poH:ov.querySelector("#poH"),shA:ov.querySelector("#shA"),stA:ov.querySelector("#stA"),coA:ov.querySelector("#coA"),poA:ov.querySelector("#poA")};
  const live={sh:[0,0],st:[0,0],co:[0,0]};
  let minute=0, s=[0,0], ei=0, timer, mom=0;
  const base=(o.lh-o.la)*0.05;
  const paintStats=()=>{ const t=minute/90, pH=Math.round(50+(stats.poss[0]-50)*t), pA=100-pH;
    el.poH.textContent=pH+"%"; el.poA.textContent=pA+"%";
    el.shH.textContent=live.sh[0]; el.shA.textContent=live.sh[1];
    el.stH.textContent=live.st[0]; el.stA.textContent=live.st[1];
    el.coH.textContent=live.co[0]; el.coA.textContent=live.co[1]; };
  paintStats();
  const drawMom=()=>{
    const pct=50-clamp(mom,-1,1)*46;
    momEl.style.left=pct+"%";
    momEl.style.background = mom>0?esc(H.c1):mom<0?esc(A.c1):"var(--chalk)";
    const strong=Math.abs(mom)>0.12;
    marrL.style.opacity=(mom>0.12)?1:0.2; marrR.style.opacity=(mom<-0.12)?1:0.2;
    marrL.className="marr"+(mom>0.35?" big":""); marrR.className="marr"+(mom<-0.35?" big":"");
    momtxt.textContent = !strong ? "Even" : (mom>0?esc(H.short):esc(A.short))+" on top";
  };
  drawMom();
  const step=()=>{
    minute++;
    mom = clamp(mom*0.9 + base*0.1 + (Math.random()-0.5)*0.05, -1, 1);
    while(ei<events.length && events[ei].min<=minute){
      const e=events[ei++], tn=teamInfo(e.team), us=e.team==="you", si=e.team===o.h?0:1;
      if(e.type==="goal"){ s[si]++; sc.textContent=s[0]+"\u2013"+s[1]; mom=clamp(mom+(si===0?0.6:-0.6),-1,1);
        live.sh[si]++; live.st[si]++;
        board.classList.remove("flash","flashT"); void board.offsetWidth; board.classList.add(us?"flash":"flashT"); }
      else if(e.type==="save"){ live.sh[si]++; live.st[si]++; mom=clamp(mom+(si===0?0.24:-0.24),-1,1); }
      else if(e.type==="miss"||e.type==="wood"){ live.sh[si]++; mom=clamp(mom+(si===0?0.2:-0.2),-1,1); }
      else if(e.type==="corner"){ live.co[si]++; mom=clamp(mom+(si===0?0.12:-0.12),-1,1); }
      else if(e.type==="injury"){ mom=clamp(mom+(si===0?-0.1:0.1),-1,1); }
      const late=e.type==="goal"&&e.min>=85;
      const d=document.createElement("div"); d.className="ev ev-"+e.type+(e.type==="goal"&&!us?" ev-them":"")+(late?" ev-late":"");
      let body;
      if(e.type==="goal"){ body=`<b>${e.pen?"PENALTY \u2014 GOAL!":"GOAL!"}</b> ${esc(surname(e.who))} ${esc(e.desc)} for ${esc(tn.name)}.${e.assist?` <span class="assist">Assist: ${esc(surname(e.assist))}</span>`:""}${late?` <span class="latetag">LATE DRAMA</span>`:""}`; }
      else if(e.type==="card"){ body=`<span class="yc">\u25ac</span> ${esc(e.txt)}.`; }
      else if(e.type==="injury"){ body=`<span class="injico">\u271a</span> <b>Injury \u2014</b> ${esc(e.txt)}. <span class="injtag ${esc(e.sev)}">${esc(e.label)} \u00b7 out ${e.games} game${e.games>1?"s":""}</span>`; }
      else { body=`${esc(e.txt)}.`; }
      d.innerHTML=`<span class="m">${e.min}'</span><span>${body}</span>`;
      feed.prepend(d);
    }
    drawMom(); paintStats();
    clk.textContent=minute+"'"; pb.style.width=(minute/90*100)+"%";
    if(minute===45){const d=document.createElement("div");d.className="ev";d.innerHTML=`<span class="m">HT</span><span>Half time: ${s[0]}\u2013${s[1]}</span>`;feed.prepend(d)}
    if(minute>=90) finish();
  };
  const finish=()=>{
    clearInterval(timer);
    while(ei<events.length){minute=90;step()}
    minute=90; paintStats();
    sc.textContent=gh+"\u2013"+ga; clk.textContent="FT";
    if(o.motm){ const mo=document.createElement("div"); mo.className="motm";
      mo.innerHTML=`<span class="motmlab">\u2b50 Player of the match</span><b class="motmn">${esc(o.motm.n)}</b><span class="motmr">${o.motm.rating}</span>${o.motm.goals?`<span class="motmg">\u26bd ${o.motm.goals}</span>`:""}`;
      ov.insertBefore(mo, ov.querySelector(".row")); }
    const row=ov.querySelector(".row");
    row.innerHTML=`<span style="font-family:var(--display);font-size:26px;text-transform:uppercase;color:${o.color}">${esc(o.word)}</span><span class="muted">${esc(o.note)}</span><button class="btn primary" id="cont">${o.social?"See the reaction \ud83d\udcac":"Continue \u25b6"}</button>`;
    ov.querySelector("#cont").addEventListener("click",()=>{
      if(o.social) showSocial(o.social, ()=>{ ov.remove(); onDone(); });
      else { ov.remove(); onDone(); }
    });
    ov.querySelector("#cont").focus();
  };
  ov.querySelector("#skip").addEventListener("click",()=>{minute=89;step()});
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce){minute=89;step()} else timer=setInterval(step,150);
}

function playMatch(){
  const r=S.round, {i,m}=myFixture(r), [h,a]=m;
  const home=h==="you", oppId=home?a:h;
  const info=previewInfo({comp:"Premier League", roundLabel:"Matchday "+(r+1), date:mDateObj(r), home, oppId, theme:"league", finalNeutral:false});
  const kick=(ment)=>{
    const sim=simMatch(h,a,ment);
    const {gh,ga,events,lh,la,poss,motm}=sim;
    const res=simRound(r,i); res[i]=[gh,ga];
    const mine=home?gh:ga, theirs=home?ga:gh;
    let earn=(mine>theirs?4:mine===theirs?2:1)+mine*.5; if(mine>theirs) earn=earn*0.7;
    S.results[r]=res; S.round++; S.budget+=earn; S.last={h,a,sc:[gh,ga],earn};
    if(!S.h2h) S.h2h={};
    const rec=S.h2h[oppId]||(S.h2h[oppId]={w:0,d:0,l:0,log:[]});
    if(mine>theirs) rec.w++; else if(mine<theirs) rec.l++; else rec.d++;
    rec.log.push({s:S.season,md:r+1,home,m:mine,t:theirs}); if(rec.log.length>12) rec.log=rec.log.slice(-12);
    recordWin(mine,theirs,oppId,"League");
    const injRes=processInjuries(sim);
    let januaryBoost=false;
    if(!S.januaryDone && mDateObj(r).getUTCMonth()===0){ S.budget+=30; S.januaryDone=true; januaryBoost=true; }
    const byes=advanceByes(); save();
    const venue=home?"Home \u00b7 "+S.club.stadium:"Away \u00b7 "+(stadiumFor(teamInfo(oppId).short)||teamInfo(oppId).name);
    const title="Premier League \u00b7 Matchday "+(r+1)+" \u00b7 "+venue;
    const word=mine>theirs?"Win":mine<theirs?"Defeat":"Draw";
    const color=mine>theirs?"var(--win)":mine<theirs?"var(--loss)":"var(--draw)";
    const social={win:mine>theirs?1:mine<theirs?-1:0, score:gh+"\u2013"+ga, scorers:events.filter(e=>e.type==="goal"&&e.team==="you").map(e=>e.who), opp:teamInfo(oppId).name, oppShort:teamInfo(oppId).short, january:januaryBoost, motm:motm&&(mine>=theirs)?motm.n:null, injury:injRes.injured?injRes.injured.who:null, recovered:injRes.recovered};
    showMatchOverlay({h,a,lh,la,events,gh,ga,poss,motm,title,word,color,note:"+"+money(earn),social}, ()=>{
      const fin=()=>{ render(); if(byes) toast("Your club had no fixture on that matchday. Those results are in the table."); else injuryToast(injRes); };
      if(januaryBoost) showJanuaryNotice(fin); else fin();
    });
  };
  runDays(r,h,a, ()=> showMatchPreview(info, kick));
}

function makeCup(base){
  const names=["Second Round","Third Round","Fourth Round","Semi-final","Final"], offs=[0,4,9,15,25];
  const used=new Set(["you"]);
  const rounds=names.map((n,i)=>{ let opp; do{ opp="c"+ri(0,CLUBS.length-1); }while(used.has(opp)); used.add(opp);
    return {name:n, week:base+offs[i], opp, home:(n==="Final")?true:Math.random()<0.5, played:false, score:null, won:null, pens:null}; });
  return {rounds, idx:0, out:false, won:false};
}
function cupTie(){ const c=S.cup; if(!c||c.out||c.won||c.idx>=c.rounds.length) return null; const t=c.rounds[c.idx]; return t.played?null:t; }
function cupDate(week){ return seasonStart()+(week*7+3)*864e5; }
function playCup(){
  const c=S.cup, tie=c.rounds[c.idx], isFinal=tie.name==="Final";
  const h=tie.home?"you":tie.opp, a=tie.home?tie.opp:"you", home=tie.home, oppId=tie.opp;
  const info=previewInfo({comp:"League Cup", roundLabel:tie.name, date:new Date(cupDate(tie.week)), home, oppId, theme:"cup", finalNeutral:isFinal});
  const kick=(ment)=>{
    const sim=simMatch(h,a,ment);
    const {gh,ga,events,lh,la,poss,motm}=sim;
    const mine=home?gh:ga, theirs=home?ga:gh;
    let won=mine>theirs, pens=null;
    if(mine===theirs){ const Rm=teamRatings().ovr, Ro=ratingsFor(oppId).ovr; won=Math.random()<Rm/(Rm+Ro); pens=won?[ri(4,5),ri(2,4)]:[ri(2,4),ri(4,5)]; if(pens[0]===pens[1]) pens[won?0:1]++; }
    const earn=3+(c.idx+1)*2+(won?(c.idx+1)*3:0);
    tie.played=true; tie.score=[gh,ga]; tie.won=won; tie.pens=pens; tie.pshome=home;
    S.budget+=earn;
    if(won){ if(isFinal){ c.won=true; S.cupTrophies=(S.cupTrophies||0)+1; S.budget+=30; addRep(20); } else c.idx++; } else c.out=true;
    recordWin(mine,theirs,oppId,"League Cup");
    const injRes=processInjuries(sim);
    save();
    const venue=isFinal?"Wembley Stadium (neutral)":(home?"Home \u00b7 "+S.club.stadium:"Away \u00b7 "+(stadiumFor(teamInfo(oppId).short)||teamInfo(oppId).name));
    const title="League Cup \u00b7 "+tie.name+" \u00b7 "+venue;
    const word=won?(isFinal?"CUP WINNERS \ud83c\udfc6":"Through \u2714"):"Knocked out";
    const color=won?"var(--win)":"var(--loss)";
    const pensTxt=pens?(won?"Won "+pens[0]+"\u2013"+pens[1]+" on pens \u00b7 ":"Lost "+pens[1]+"\u2013"+pens[0]+" on pens \u00b7 "):"";
    const social={win:won?1:-1, score:gh+"\u2013"+ga, scorers:events.filter(e=>e.type==="goal"&&e.team==="you").map(e=>e.who), opp:teamInfo(oppId).name, oppShort:teamInfo(oppId).short, cup:{won, final:isFinal, round:tie.name}, motm:motm&&won?motm.n:null, injury:injRes.injured?injRes.injured.who:null, recovered:injRes.recovered};
    showMatchOverlay({h,a,lh,la,events,gh,ga,poss,motm,title,word,color,note:pensTxt+"+"+money(earn),social,theme:"cup"}, ()=>{ render(); injuryToast(injRes); });
  };
  showMatchPreview(info, kick);
}
// ---- European competitions ----
const EURO_META={
  ucl:{name:"Champions League", short:"UCL", theme:"ucl", prize:[6,10,16,32]},
  uel:{name:"Europa League",    short:"UEL", theme:"uel", prize:[4,7,11,22]},
  uecl:{name:"Conference League",short:"UECL",theme:"uecl",prize:[3,5,8,15]}
};
const EURO_ROUNDS=["Round of 16","Quarter-final","Semi-final","Final"];
const EURO_WEEKS=[7,12,21,30];
function makeEuro(comp){
  const pool=EURO_POOL[comp].slice(), used=new Set();
  const rounds=EURO_ROUNDS.map((n,i)=>{ let sh; do{ sh=pick(pool); }while(used.has(sh)&&used.size<pool.length); used.add(sh);
    return {name:n, week:EURO_WEEKS[i], opp:"e:"+sh, home:(n==="Final")?true:Math.random()<0.5, played:false, score:null, won:null, pens:null}; });
  return {comp, name:EURO_META[comp].name, theme:EURO_META[comp].theme, rounds, idx:0, out:false, won:false};
}
function euroTie(){ const e=S.euro; if(!e||e.out||e.won||e.idx>=e.rounds.length) return null; const t=e.rounds[e.idx]; return t.played?null:t; }
function euroDate(week){ return seasonStart()+(week*7+3)*864e5; }
function playEuro(){
  const e=S.euro, tie=e.rounds[e.idx], isFinal=tie.name==="Final";
  const h=tie.home?"you":tie.opp, a=tie.home?tie.opp:"you", home=tie.home, oppId=tie.opp;
  const info=previewInfo({comp:e.name, roundLabel:tie.name, date:new Date(euroDate(tie.week)), home, oppId, theme:e.theme, finalNeutral:isFinal});
  const kick=(ment)=>{
    const sim=simMatch(h,a,ment);
    const {gh,ga,events,lh,la,poss,motm}=sim;
    const mine=home?gh:ga, theirs=home?ga:gh;
    let won=mine>theirs, pens=null;
    if(mine===theirs){ const Rm=teamRatings().ovr, Ro=ratingsFor(oppId).ovr; won=Math.random()<Rm/(Rm+Ro); pens=won?[ri(4,5),ri(2,4)]:[ri(2,4),ri(4,5)]; if(pens[0]===pens[1]) pens[won?0:1]++; }
    const prize=EURO_META[e.comp].prize[e.idx], earn=prize+(won?prize:0);
    tie.played=true; tie.score=[gh,ga]; tie.won=won; tie.pens=pens;
    S.budget+=earn;
    if(won){ if(isFinal){ e.won=true; S.euroTrophies=(S.euroTrophies||0)+1; S.budget+=prize*1.5; addRep(e.comp==="ucl"?30:e.comp==="uel"?18:12); } else e.idx++; } else e.out=true;
    recordWin(mine,theirs,oppId,e.name);
    const injRes=processInjuries(sim);
    save();
    const venue=isFinal?"the Final (neutral)":(home?"Home · "+S.club.stadium:"Away · "+teamInfo(oppId).name);
    const title=e.name+" · "+tie.name+" · "+venue;
    const word=won?(isFinal?"EUROPEAN CHAMPIONS 🏆":"Through ✔"):"Knocked out";
    const color=won?"var(--win)":"var(--loss)";
    const pensTxt=pens?(won?"Won "+pens[0]+"–"+pens[1]+" on pens · ":"Lost "+pens[1]+"–"+pens[0]+" on pens · "):"";
    const social={win:won?1:-1, score:gh+"–"+ga, scorers:events.filter(x=>x.type==="goal"&&x.team==="you").map(x=>x.who), opp:teamInfo(oppId).name, oppShort:teamInfo(oppId).short, euro:{won,final:isFinal,round:tie.name,name:e.name}, theme:e.theme, motm:motm&&won?motm.n:null, injury:injRes.injured?injRes.injured.who:null, recovered:injRes.recovered};
    showMatchOverlay({h,a,lh,la,events,gh,ga,poss,motm,title,word,color,note:pensTxt+"+"+money(earn),social,theme:e.theme}, ()=>{ render(); injuryToast(injRes); });
  };
  showMatchPreview(info, kick);
}
function nextEvent(){
  const leagueOver = S.round>=S.fixtures.length;
  const tie=cupTie(), et=euroTie();
  const leagueDate = leagueOver?Infinity:mDateObj(S.round).getTime();
  const cupD = tie?cupDate(tie.week):Infinity;
  const euroD = et?euroDate(et.week):Infinity;
  const m=Math.min(leagueDate,cupD,euroD);
  if(m===Infinity) return null;
  if(euroD===m && et) return {type:"euro", tie:et};
  if(cupD===m && tie) return {type:"cup", tie};
  return {type:"league"};
}
function advance(){ const ev=nextEvent(); if(!ev) return; if(ev.type==="euro") playEuro(); else if(ev.type==="cup") playCup(); else playMatch(); }

/* ---------- the 5-minute check-in (the thumbs-down runs away) ---------- */
let enjoyArmed=false;
function armEnjoy(){
  if(enjoyArmed) return;
  try{ if(localStorage.getItem("tt-enjoy-done")){ enjoyArmed=true; return } }catch(e){}
  enjoyArmed=true;
  setTimeout(showEnjoy, 5*60*1000);
}
function showEnjoy(){
  if(document.querySelector(".enjoy")) return;
  const ov=document.createElement("div"); ov.className="enjoy"; ov.setAttribute("role","dialog"); ov.setAttribute("aria-label","Are you enjoying the game?");
  ov.innerHTML=`<div class="enjoy-card"><h2>Are you enjoying<br>TacTicToe?</h2>
    <div class="enjoy-btns"><button class="enjoy-yes" type="button" aria-label="Yes, loving it">👍</button></div>
    <p class="muted" style="margin:14px 0 0;font-size:12px">There is no wrong answer. Honest.</p></div>
    <button class="enjoy-no" type="button" aria-label="No" tabindex="-1">👎</button>`;
  document.body.appendChild(ov);
  const yes=ov.querySelector(".enjoy-yes"), no=ov.querySelector(".enjoy-no");
  const place=(x,y)=>{ const m=14,bw=no.offsetWidth||64,bh=no.offsetHeight||64;
    no.style.left=clamp(x,m,innerWidth-bw-m)+"px"; no.style.top=clamp(y,m,innerHeight-bh-m)+"px"; };
  requestAnimationFrame(()=>{ const r=yes.getBoundingClientRect(); place(r.right+18, r.top); });
  let n=0;
  const flee=()=>{ n++; const bw=no.offsetWidth||64,bh=no.offsetHeight||64;
    place(14+Math.random()*(innerWidth-bw-28), 14+Math.random()*(innerHeight-bh-28));
    if(n===4) no.textContent="😅"; if(n===8) no.textContent="🙈"; };
  no.addEventListener("pointerenter",flee);
  no.addEventListener("pointerdown",e=>{e.preventDefault();flee()});
  no.addEventListener("touchstart",e=>{e.preventDefault();flee()},{passive:false});
  no.addEventListener("click",e=>{e.preventDefault();flee()});
  ov.addEventListener("pointermove",e=>{ const r=no.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    if(Math.hypot(e.clientX-cx,e.clientY-cy)<95) flee(); });
  window.addEventListener("resize",()=>{ const r=no.getBoundingClientRect(); place(r.left,r.top) });
  yes.addEventListener("click",()=>{
    try{ localStorage.setItem("tt-enjoy-done","1") }catch(e){}
    ov.classList.add("bye"); toast("Brilliant — enjoy the season! ⚽"); setTimeout(()=>ov.remove(),300);
  });
  yes.focus();
}

