/* ---------- render ---------- */
function render(){
  const app=$("#app");
  if(!S){ app.innerHTML = gate(); bindGate(); return }
  armEnjoy();
  const tbl=table(), pos=tbl.findIndex(r=>r.id==="you")+1;
  app.innerHTML = `
  <header class="bar"><div class="wrap">
    <div class="brand"><div class="brandname">Tac<span>Tic</span>Toe</div><a class="btn coffee tiny" href="https://buymeacoffee.com/tictactoekai" target="_blank" rel="noopener">\u2615 Buy me a coffee</a></div>
    <div class="club-id">${crest(S.club.c1,S.club.c2,S.club.short,34)}<div style="min-width:0"><div class="nm">${esc(S.club.name)}</div><div class="sub">Manager ${esc(S.manager)} · Season ${S.season}</div></div></div>
    <div class="stats">
      <div class="stat"><div class="eyebrow">Budget</div><div class="v money">${money(S.budget)}</div></div>
      <div class="stat"><div class="eyebrow">Position</div><div class="v pos">${S.round?ordinal(pos):"–"}</div></div>
      <div class="stat"><div class="eyebrow">Matchday</div><div class="v md">${Math.min(S.round+1,S.fixtures.length)}/${S.fixtures.length}</div></div>
      <div class="stat"><div class="eyebrow">Reputation</div><div class="v rep">${Math.round(clubRep().pct)}</div></div>
    </div>
  </div>
  <nav class="tabs" aria-label="Sections"><div class="wrap">
    ${[["club","Club"],["squad","Squad"],["calendar","Calendar"],["packs","Packs"],["table","Table"],["news","News"],["euro","Europe"],["academy","Academy"],["cards","Cards"],["history","History"],["updates","Updates"]].concat(isAdmin?[["admin","Admin"]]:[]).map(([k,l])=>`<button class="tab ${k==="admin"?"owner":k==="updates"?"fresh":""}" data-view="${k}" ${view===k?'aria-current="page"':""}>${l}${k==="updates"?'<span class="newdot">NEW</span>':""}</button>`).join("")}
  </div></nav></header>
  <main class="wrap">${(({club:vClub,packs:vPacks,cards:vCollection,academy:vAcademy,squad:vSquad,table:vTable,calendar:vCalendar,euro:vCompetitions,news:vNews,history:vHistory,updates:vUpdates,admin:vAdmin})[view]||vClub)(tbl,pos)}
  <div style="margin-top:28px;text-align:center"><a class="btn coffee" href="https://buymeacoffee.com/tictactoekai" target="_blank" rel="noopener">\u2615 Enjoying TacTicToe? Buy me a coffee</a></div>
  <p class="muted" style="margin:16px 0 0;font-size:12px">© 2026 Kai Winterbottom. All rights reserved. Unofficial fan game, not affiliated with the Premier League or its clubs. Player ratings are this game's own estimates.</p></main>`;
  bind();
}
function ordinal(n){const s=["th","st","nd","rd"],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0])}

function vClub(tbl,pos){
  const R=teamRatings();
  const ne=nextEvent();
  if(!ne) return seasonEnd(tbl,pos);
  const isCup = ne.type==="cup", cupRound = isCup?ne.tie.name:"";
  let home, oppId, compLabel, roundLabel;
  if(isCup){ const t=ne.tie; oppId=t.opp; home=(t.name==="Final")?true:t.home; compLabel="League Cup"; roundLabel=t.name; }
  else { const mm=myFixture(S.round).m; home=mm[0]==="you"; oppId=home?mm[1]:mm[0]; compLabel="Premier League"; roundLabel="Matchday "+(S.round+1); }
  const opp=teamInfo(oppId), O=ratingsFor(oppId);
  const me=tbl.find(r=>r.id==="you"), filled=S.xi.filter(Boolean).length;
  const last=S.last;
  const newish = S.round<=1 && S.packs<2;
  const janSoon = !S.januaryDone && S.round<S.fixtures.length && mDateObj(S.round).getUTCMonth()===11;
  return `${howTo(newish)}${janSoon?`<div class="janbanner"><b>\ud83d\udcb0 January transfer window opens next month.</b> The board will hand you \u00a330m to spend \u2014 start planning your signings.</div>`:""}<div class="grid2">
    <section class="panel stack" aria-labelledby="nm">
      <div class="row" style="justify-content:space-between"><span class="eyebrow" id="nm">Next up · <b style="color:${isCup?"var(--elite)":"var(--flood)"}">${esc(compLabel)}</b> · ${esc(roundLabel)}</span><span class="eyebrow">${isCup&&cupRound==="Final"?"Neutral":home?"Home":"Away"}</span></div>
      <div class="fixture">
        <div class="side">${crest(home?S.club.c1:opp.c1,home?S.club.c2:opp.c2,home?S.club.short:opp.short,64)}<b>${esc(home?S.club.name:opp.name)}</b></div>
        <div class="vs">V</div>
        <div class="side">${crest(home?opp.c1:S.club.c1,home?opp.c2:S.club.c2,home?opp.short:S.club.short,64)}<b>${esc(home?opp.name:S.club.name)}</b></div>
      </div>
      <div class="venue">${isCup&&cupRound==="Final"?`<span class="vtag cup">CUP FINAL</span> At Wembley Stadium`:home?`<span class="vtag home">HOME</span> At ${esc(S.club.stadium)}`:`<span class="vtag away">AWAY</span> At ${esc(stadiumFor(opp.short)||opp.name)}`}</div>
      <div class="strength">
        <span class="muted">You</span><div class="meter"><i style="width:${clamp((R.ovr-40)/55*100,2,100)}%"></i></div><b class="num">${R.ovr.toFixed(0)}</b>
        <span class="muted">${esc(opp.short)}</span><div class="meter"><i style="width:${clamp((O.ovr-40)/55*100,2,100)}%;background:var(--muted)"></i></div><b class="num">${O.ovr}</b>
      </div>
      ${filled<11?`<p class="muted" style="margin:0">Your starting XI has ${11-filled} empty slot${filled===10?"":"s"}. Fill them on the Squad tab.</p>`:""}
      <div class="row"><button class="btn primary" data-act="play">Kick off</button><button class="btn" data-view="squad">Pick team</button></div>
      ${h2hBlock(oppId)}
      <hr class="rule">
      <div class="split">
        <div class="stack" style="gap:8px"><span class="eyebrow">Coming up</span>${upcoming()}</div>
        <div class="stack" style="gap:8px"><span class="eyebrow">Around you in the table</span>${miniTable(tbl)}</div>
      </div>
    </section>
    <section class="stack">
      <div class="panel stack">
        <span class="eyebrow">Season so far</span>
        <div class="row" style="gap:22px">
          <div class="stat"><div class="eyebrow">Pts</div><div class="v" style="color:var(--flood)">${me.pts}</div></div>
          <div class="stat"><div class="eyebrow">W-D-L</div><div class="v" style="color:var(--c-money)">${me.w}-${me.d}-${me.l}</div></div>
          <div class="stat"><div class="eyebrow">GD</div><div class="v" style="color:var(--c-blue)">${me.gf-me.ga>0?"+":""}${me.gf-me.ga}</div></div>
        </div>
        <div class="form">${me.form.slice(-6).map(f=>`<span class="${f}">${f}</span>`).join("")||'<span class="muted" style="width:auto;font-family:var(--body);font-weight:400">No matches yet</span>'}</div>
      </div>
      ${(()=>{const r=clubRep();return `<div class="panel stack repbox"><div class="row" style="justify-content:space-between"><span class="eyebrow">Club reputation</span><b class="reptier">${esc(r.tier.name)}</b></div><div class="repbar"><i style="width:${r.pct.toFixed(1)}%"></i><span class="reppct">${Math.round(r.pct)}</span></div><p class="muted" style="margin:0;font-size:12px">${esc(r.tier.note)} Grows with marquee signings, wins over strong teams, league finishes and trophies.</p></div>`;})()}
      ${last?`<div class="panel stack"><span class="eyebrow">Last result</span><div class="row" style="justify-content:space-between"><b>${esc(teamInfo(last.h).short)} <span class="num" style="font-size:22px;color:var(--flood)">${last.sc[0]}–${last.sc[1]}</span> ${esc(teamInfo(last.a).short)}</b><span class="muted">+${money(last.earn)}</span></div></div>`:""}
      <div class="panel stack">
        <span class="eyebrow">Earnings</span>
        <p class="muted" style="margin:0">Win ~£2.8m · Draw £2m · Loss £1m · £0.5m per goal (win bonus trimmed). Cup runs and season-end prize money for every place, plus £25m for the title.</p>
        <button class="btn" data-view="packs">Spend ${money(S.budget)} on packs</button>
      </div>
      <div class="panel stack">
        <span class="eyebrow">Club</span>
        <p class="muted" style="margin:0">${S.packs} packs opened · ${S.trophies} title${S.trophies===1?"":"s"} · ${S.history.length} season${S.history.length===1?"":"s"} completed</p>
        ${ui.confirmReset?`<div class="confirm"><span>Full reset: delete this club and all progress, and go back to the create-a-club screen? This can't be undone.</span><button class="btn small danger" data-act="reset-yes">Reset everything</button><button class="btn small" data-act="reset-no">Cancel</button></div>`:`<div><button class="btn small danger" data-act="reset">↺ Full reset — new club</button></div>`}
      </div>
    </section>
  </div>
  <section class="panel stack" style="margin-top:18px"><div class="row" style="justify-content:space-between"><span class="eyebrow">League table</span><span class="muted" style="font-size:12px">after matchday ${S.round}</span></div>${leagueTableHTML(tbl)}</section>`;
}
function qualZone(i,n){ return i<5?"ucl":i===5?"uel":i===6?"uecl":i>=n-3?"rel":""; }
function leagueTableHTML(tbl){
  const n=tbl.length;
  return `<div class="tablewrap"><table><thead><tr><th>#</th><th class="team">Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead><tbody>
  ${tbl.map((r,i)=>{const t=teamInfo(r.id);return `<tr class="${r.id==="you"?"me":""} ${qualZone(i,n)}"><td>${i+1}</td><td class="team"><span class="tn">${crest(t.c1,t.c2,t.short,18)}<span>${esc(t.name)}</span></span></td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf-r.ga>0?"+":""}${r.gf-r.ga}</td><td><b>${r.pts}</b></td></tr>`}).join("")}
  </tbody></table></div>
  <div class="tbl-legend"><span><i class="qz ucl"></i>Champions League (1–5)</span><span><i class="qz uel"></i>Europa League (6)</span><span><i class="qz uecl"></i>Conference League (7)</span><span><i class="qz rel"></i>Relegation</span></div>`;
}
function h2hBlock(oppId){
  const rec = S.h2h && S.h2h[oppId], opp = teamInfo(oppId);
  if(!rec || !rec.log.length) return `<div class="h2h"><span class="eyebrow">Head to head</span><p class="muted" style="margin:0;font-size:13px">You have not played ${esc(opp.name)} before.</p></div>`;
  const recent = rec.log.slice(-5).reverse();
  return `<div class="h2h">
    <div class="row" style="justify-content:space-between"><span class="eyebrow">Head to head vs ${esc(opp.short)}</span>
      <span class="h2hrec"><b class="hw">${rec.w}W</b> <b class="hd">${rec.d}D</b> <b class="hl">${rec.l}L</b></span></div>
    <div class="h2hlist">${recent.map(g=>{const k=g.m>g.t?"W":g.m<g.t?"L":"D";return `<div class="h2hrow"><span class="num muted">S${g.s} · MD${g.md}</span><span class="muted">${g.home?"Home":"Away"}</span><span class="num res2"><b>${g.m}–${g.t}</b></span><span class="rp ${k}">${k}</span></div>`}).join("")}</div>
  </div>`;
}
function upcoming(){
  const out=[];
  for(let r=S.round+1;r<S.fixtures.length&&out.length<4;r++){
    const {m}=myFixture(r); if(m.includes("bye")) continue;
    const home=m[0]==="you", o=teamInfo(home?m[1]:m[0]);
    out.push(`<div class="mini"><span class="num muted">MD${r+1}</span>${crest(o.c1,o.c2,o.short,16)}<span class="grow">${esc(o.name)}</span><span class="muted">${home?"H":"A"}</span></div>`);
  }
  return out.join("")||'<p class="muted" style="margin:0">Last match of the season.</p>';
}
function miniTable(tbl){
  const i=tbl.findIndex(r=>r.id==="you"), a=clamp(i-2,0,tbl.length-5);
  return tbl.slice(a,a+5).map((r,k)=>{const t=teamInfo(r.id);return `<div class="mini ${r.id==="you"?"me":""}"><span class="num muted">${a+k+1}</span>${crest(t.c1,t.c2,t.short,16)}<span class="grow">${esc(t.name)}</span><b class="num">${r.pts}</b></div>`}).join("");
}
function sponsorBanner(){
  return `<div class="sponsor">
    <div class="unp" aria-label="UpNorthPlumbing"><span class="unp1">UPNORTH</span><span class="unp2">PLUMBING</span></div>
    <div class="sp-text"><span class="sp-label">Official club sponsor</span>
      <p class="sp-about">UpNorthPlumbing \u2014 professional plumbing services, and the proud official sponsor of TacTicToe.</p>
      <a class="btn small" href="https://upnorthplumbing.com/" target="_blank" rel="noopener sponsored" style="margin-top:2px">Visit upnorthplumbing.com \u2192</a>
    </div>
  </div>`;
}
function howTo(open){
  return `<details class="howto" ${open?"open":""}>
    <summary><b>How to play TacTicToe</b><span class="muted">${open?"":"tap to open"}</span></summary>
    <div class="howbody">
      <p style="margin:0 0 10px">Build a football club from nothing: open packs of real Premier League players, pick your team, and manage them through a full home-and-away league season plus a midweek League Cup. Climb the table, win prize money and cups, and build a title-winning side over several seasons.</p>
      <ol class="steps">
        <li><b>Open packs</b> — go to <b>Packs</b>. You start with <b>£75m</b>. pricier packs give higher-quality real players — <b>Elite</b> tops out with three 79–84, one 85 and one 86+, while <b>Bronze</b> is cheap low-rated pot luck. Every pack also has a rare chance of a <b>Future Prospect</b> — a purple wonderkid rated 85 that gains +1 every season. Keep opening until you have at least 11.</li>
        <li><b>Pick your team</b> — go to <b>Squad</b>. Choose a formation, then tap a player on the pitch and tap a substitute to swap them. Green means the right position, red means out of position. You can also sell players for cash.</li>
        <li><b>Play matches</b> — go to <b>Calendar</b> and hit <b>Advance</b> (or <b>Kick off</b> here). Get a match preview, then watch it play out with momentum arrows. League games are blue; green League Cup ties come midweek.</li>
        <li><b>Earn & improve</b> — win matches and finish high for prize money. The board tops you up with <b>£30m</b> in the January window and a <b>£50m</b> summer budget at the end of every season — spend it on better packs and climb the <b>Table</b>.</li>
      </ol>
      <p class="muted" style="margin:10px 0 0;font-size:12px">Your progress saves automatically. A title usually takes a few seasons to build — finish higher each year, bank the prize money and strengthen. Neglect the squad and you'll scrap near the bottom.</p>
    </div>
  </details>`;
}
function seasonEnd(tbl,pos){
  const me=tbl[pos-1], prize=prizeFor(pos), champ=teamInfo(tbl[0].id), N=tbl.length;
  let bw=null;
  for(let r=0;r<S.fixtures.length;r++){ const fx=S.fixtures[r]; const i=fx.findIndex(x=>x.includes("you")); if(i<0) continue; const [h,a]=fx[i]; if(h==="bye"||a==="bye") continue; const sc=S.results[r]&&S.results[r][i]; if(!sc) continue; const home=h==="you", mine=home?sc[0]:sc[1], th=home?sc[1]:sc[0]; if(mine>th){ const mg=mine-th; if(!bw||mg>bw.margin||(mg===bw.margin&&mine>bw.me)) bw={short:teamInfo(home?a:h).short, me:mine, them:th, margin:mg}; } }
  const cup=S.cup, cupRes=cup?(cup.won?"League Cup WINNERS \ud83c\udfc6":cup.out?"Out in the "+cup.rounds[cup.idx].name:"Reached the "+cup.rounds[cup.idx].name):"\u2014";
  const verdict = pos===1?"Champions of England!":pos<=4?"Top four \u2014 European nights await.":pos<=7?"A strong finish in the top half.":pos<=14?"A steady mid-table campaign.":pos<=N-4?"Survival secured \u2014 just.":"A finish in the drop zone \u2014 time to rebuild.";
  const zc = pos===1?"var(--flood)":pos<=4?"var(--win)":pos>=N-2?"var(--loss)":"var(--chalk)";
  return `<section class="stack" style="max-width:700px;margin:0 auto">
    <div class="panel stack" style="text-align:center;align-items:center;gap:8px">
      <span class="eyebrow">Season ${S.season} review \u00b7 Premier League ${2025+S.season}/${String(26+S.season).padStart(2,"0")}</span>
      <h1 style="font-size:clamp(44px,11vw,76px);color:${zc};line-height:.88">${pos===1?"CHAMPIONS":ordinal(pos)}</h1>
      <p style="margin:0;font-size:17px">${verdict}</p>
      <div class="svstats">
        <div><b class="num">${me.pts}</b><span>Points</span></div>
        <div><b class="num">${me.w}-${me.d}-${me.l}</b><span>W-D-L</span></div>
        <div><b class="num">${me.gf}</b><span>Scored</span></div>
        <div><b class="num">${me.ga}</b><span>Conceded</span></div>
        <div><b class="num">${me.gf-me.ga>0?"+":""}${me.gf-me.ga}</b><span>GD</span></div>
      </div>
    </div>
    <div class="split">
      <div class="panel stack"><span class="eyebrow">Prize money \u00b7 ${ordinal(pos)} place</span><b class="num" style="font-size:32px;color:var(--flood);line-height:1">${money(prize)}</b><span class="muted" style="font-size:12px">Every position pays out \u2014 the higher you finish, the more you bank, plus a £50m summer transfer budget. Added when you start next season.</span></div>
      <div class="panel stack"><span class="eyebrow">League Cup</span><b style="font-family:var(--display);font-size:20px;text-transform:uppercase">${esc(cupRes)}</b>${bw?`<span class="eyebrow" style="margin-top:8px">Biggest win</span><b class="num" style="font-size:18px">${bw.me}\u2013${bw.them} vs ${esc(bw.short)}</b>`:""}</div>
    </div>
    <div class="panel stack"><span class="eyebrow">Champions this season</span><div class="row" style="justify-content:space-between"><span class="tn">${crest(champ.c1,champ.c2,champ.short,22)}<b>${esc(champ.name)}</b></span><span class="muted num">${tbl[0].pts} pts</span></div></div>
    <div class="row" style="justify-content:center"><button class="btn primary" data-act="next-season">Start season ${S.season+1} \u25b6</button></div>
    <div style="text-align:center"><a class="coffee-link" href="https://buymeacoffee.com/tictactoekai" target="_blank" rel="noopener">\u2615 Having fun? Buy the dev a coffee</a></div>
  </section>`;
}
const prizeFor = pos => (22-pos)*2 + (pos===1?25:0);

function vPacks(){
  return `<div class="stack">
    <aside class="futurebanner" aria-hidden="true"><span>⭐ Future starts now in packs</span></aside>
    <aside class="finestbanner" aria-hidden="true"><span>⭐ Europe’s Finest now in packs</span></aside>
    <div class="row" style="justify-content:space-between"><h2 style="font-size:36px">Pack store</h2><span class="muted">Squad ${S.squad.length}/${MAX_SQUAD}</span></div>
    <div class="packs">${PACKS.map(p=>`
      <article class="pack">
        <div class="foil ${p.foil}"><span>${p.name}</span></div>
        <div class="row" style="justify-content:space-between"><h3>${p.name} pack</h3><span class="price">${money(p.price)}</span></div>
        <ul>${p.desc.map(d=>`<li>${d}</li>`).join("")}</ul>
        <button class="btn primary" data-act="buy" data-pack="${p.id}" ${S.budget<p.price||S.squad.length+p.count>MAX_SQUAD?"disabled":""}>${S.budget<p.price?"Need "+money(p.price-S.budget)+" more":S.squad.length+p.count>MAX_SQUAD?"Squad full":"Open pack"}</button>
      </article>`).join("")}</div>
    ${S.squad.length>=MAX_SQUAD?`<div class="panel row" style="justify-content:space-between"><span>Your squad is full (${MAX_SQUAD} players). Win matches to earn more, but you have a full roster to pick from.</span><button class="btn" data-view="squad">Go to squad</button></div>`:`<div class="prospecttip"><b>\u2b50 Future Prospect cards</b> \u2014 every pack has a rare chance to pull a purple Future Prospect (Kroupi, Rayan, Ant\u00f3nio Silva, Archie Gray, Diomande, Dowman, Ngumoha, JJ Gabriel). They start rated 85 and gain +1 overall every season you play \u2014 raw talent that grows with you.</div><div class="ucltip"><b>\u2b50 Europe\u2019s Finest cards</b> \u2014 the rarest pull of all. Only <b>Elite</b> packs can contain a blue Europe\u2019s Finest superstar \u2014 roughly one in every five Elite packs \u2014 with continental icons like Mbapp\u00e9, Yamal, Kane, Demb\u00e9l\u00e9, Bellingham and Lautaro.</div><p class="muted" style="margin:0">Players you pack are yours to keep — build the deepest squad you can across the season.</p>`}
  </div>`;
}

function vSquad(){
  const R=teamRatings(), sl=slots(), inXI=new Set(S.xi.filter(Boolean));
  const subMode = ui.slot!==null;
  const outP = subMode ? byId(S.xi[ui.slot]) : null;
  const bench = S.squad.filter(p=>!inXI.has(p.id));
  const injured = bench.filter(isInjured);
  const benchFit = bench.filter(p=>!isInjured(p));
  const list = benchFit.filter(p=>ui.filter==="ALL"||p.pos===ui.filter).sort((a,b)=>POS.indexOf(a.pos)-POS.indexOf(b.pos)||b.ovr-a.ovr);
  const sel = ui.sel && byId(ui.sel);
  return `<div class="grid2">
    <section class="panel stack pitchpanel">
      <div class="row" style="justify-content:space-between">
        <div class="row"><label for="formation" style="flex-direction:row;align-items:center">Formation</label><select id="formation" data-act="formation" style="background:var(--night);color:var(--chalk);border:1px solid var(--line);border-radius:6px;padding:6px">${Object.keys(FORMATIONS).map(f=>`<option ${f===S.formation?"selected":""}>${f}</option>`).join("")}</select></div>
        <button class="btn small" data-act="auto">Auto-pick best XI</button>
      </div>
      <div class="pitch ${subMode?"picking":""}"><div class="pbox t"></div><div class="pbox b"></div>
        ${sl.map(([pos,x,y],i)=>{const p=byId(S.xi[i]);const e=effective(p,pos);const isSel=ui.slot===i;return `<button class="slot ${isSel?"sel":""}" style="left:${x}%;top:${y}%" data-act="slot" data-i="${i}" aria-label="${pos} slot${p?": "+esc(p.n):", empty"}${isSel?" (selected to swap)":""}">
          ${p?`<span class="disc" style="background:${esc(S.club.c1)};color:${readable(S.club.c1)}">${e}</span>`:`<span class="disc empty">${pos}</span>`}
          ${isSel?`<span class="outmark">${p?"OUT":"EMPTY"}</span>`:""}
          ${p?`<span class="ptag ${p.pos!==pos?"off":"on"}" title="${p.pos!==pos?`Natural ${p.pos}, playing ${pos}`:`Natural ${pos}`}">${p.pos}${p.pos!==pos?` → ${pos}`:""}</span>`:`<span class="ptag role">${pos}</span>`}
          ${p?`<span class="lbl">${esc(p.n.includes(" ")?p.n.split(" ").slice(1).join(" "):p.n)}</span>`:""}</button>`}).join("")}
      </div>
      <div class="strength">
        <span class="muted">Attack</span><div class="meter"><i style="width:${clamp((R.att-40)/55*100,2,100)}%"></i></div><b class="num">${R.att.toFixed(0)}</b>
        <span class="muted">Defence</span><div class="meter"><i style="width:${clamp((R.def-40)/55*100,2,100)}%"></i></div><b class="num">${R.def.toFixed(0)}</b>
      </div>
      ${subMode
        ? `<div class="subbar"><span><b>${outP?esc(surname(outP.n))+" ("+sl[ui.slot][0]+")":"Empty "+sl[ui.slot][0]+" slot"}</b> selected. Tap a substitute below to bring on, or tap another position to swap.</span><button class="btn small" data-act="cancelslot">Cancel</button></div>`
        : `<p class="muted" style="margin:0;font-size:13px">Tap a player on the pitch to take them off, then tap a sub below. Tap two pitch positions to swap them.</p>`}
    </section>
    <section class="stack">
      <div class="panel stack treatroom">
        <div class="row" style="justify-content:space-between"><span class="eyebrow">⚕ Treatment room</span><span class="muted">${injured.length?injured.length+" injured":"fully fit"}</span></div>
        ${injured.length?`<div class="injlist">${injured.sort((a,b)=>b.inj.games-a.inj.games).map(p=>`
          <div class="injrow ${esc(p.inj.sev)}"><span class="injdot"></span>
            <div style="min-width:0"><b>${esc(p.n)}</b><span class="injmeta">${p.pos} · ${esc(p.inj.label)}</span></div>
            <span class="injout">${p.inj.games}<small>game${p.inj.games>1?"s":""}</small></span></div>`).join("")}</div>
          <p class="muted" style="margin:0;font-size:12px">Injured players can’t be selected until they recover. Each match played brings them a game closer to fitness.</p>`
        :`<p class="muted" style="margin:0">No injuries — your whole squad is available. 💪</p>`}
      </div>
      ${sel?`<div class="panel row" style="align-items:flex-start;gap:16px">${card(sel)}<div class="stack" style="flex:1;min-width:160px">
        <h3 style="font-size:26px">${esc(sel.n)}</h3><span class="muted">${sel.pos} · rated ${sel.ovr} · on the bench</span>
        <span>Sale value <b class="num" style="color:var(--flood)">${money(value(sel.ovr))}</b></span>
        <div class="row"><button class="btn small primary" data-act="subin" data-id="${sel.id}" style="font-size:14px;padding:8px 14px">Bring into XI</button><button class="btn small danger" data-act="sell" data-id="${sel.id}" ${S.squad.length<=11?"disabled":""}>Sell for ${money(value(sel.ovr))}</button><button class="btn small" data-act="desel">Close</button></div></div></div>`:""}
      <div class="panel stack">
        <div class="row" style="justify-content:space-between"><span class="eyebrow">${subMode?"Tap a substitute":"Substitutes"} · ${benchFit.length} available</span>
        <div class="filters">${["ALL"].concat(POS).map(f=>`<button class="chip" data-act="filter" data-f="${f}" aria-pressed="${ui.filter===f}">${f==="ALL"?"All":f}</button>`).join("")}</div></div>
        <div class="squadgrid">${list.map(p=>card(p,{sm:true,act:"pcard",sel:ui.sel===p.id,subin:subMode})).join("")||`<p class="muted">${bench.length?"No subs in this position.":"Everyone is in your starting XI. Open packs to add depth."}</p>`}</div>
        <p class="muted" style="margin:0;font-size:12px">${S.squad.length}/${MAX_SQUAD} players signed · 11 in your XI, ${benchFit.length} on the bench${injured.length?` · ${injured.length} injured`:""}</p>
      </div>
    </section>
  </div>`;
}
function readable(hex){const h=hex.replace("#","");const n=parseInt(h.length===3?h.split("").map(c=>c+c).join(""):h,16);const r=n>>16,g=n>>8&255,b=n&255;return (r*299+g*587+b*114)/1000>150?"#0c1320":"#ffffff"}

function ago(t){ if(!t) return "—"; const m=(Date.now()-t)/6e4; if(m<1) return "just now"; if(m<60) return Math.floor(m)+"m ago"; const h=m/60; if(h<24) return Math.floor(h)+"h ago"; return Math.floor(h/24)+"d ago"; }
function vAdmin(){
  const list=rosterCache;
  let body;
  if(list==="na") body='<p class="muted">The owner-only roster needs a signed-in account with the shared database. It is empty in this local preview.</p>';
  else if(!Array.isArray(list)) body = list==="err"?'<p class="muted">Couldn\'t load the roster. Reopen this tab to try again.</p>':'<p class="muted">Loading players…</p>';
  else if(!list.length) body='<p class="muted">No one has founded a club yet. As people sign in and play, they appear here.</p>';
  else body=`<div class="tablewrap"><table><thead><tr><th class="team">Manager</th><th class="team">Club</th><th>Season</th><th>MD</th><th>Pos</th><th>Best</th><th>Packs</th><th class="team">Email</th><th class="team">Last seen</th></tr></thead><tbody>
    ${list.map(e=>`<tr><td class="team">${esc(e.name||"Unnamed manager")}</td>
      <td class="team"><span class="tn">${crest(e.c1||"#888",e.c2||"#444",e.short||"",18)}<span>${esc(e.club||"—")}</span></span></td>
      <td>${e.season||1}</td><td>${e.round||0}</td><td>${ordinal(e.pos||0).replace("0th","—")}</td><td>${e.best&&e.best<99?ordinal(e.best):"—"}${e.trophies?` · ${e.trophies}🏆`:""}</td><td>${e.packs||0}</td>
      <td class="team" style="font-family:var(--num)">${e.email?esc(e.email):'<span class="muted">—</span>'}</td>
      <td class="team muted">${ago(e.updated)}</td></tr>`).join("")}
  </tbody></table></div>`;
  return `<section class="panel stack">
    <div class="row" style="justify-content:space-between"><h2 style="font-size:36px">Who's playing</h2>${Array.isArray(list)?`<span class="muted">${list.length} manager${list.length===1?"":"s"}</span>`:""}</div>
    <p class="muted" style="margin:0;font-size:13px">Private to you as the owner of this game. Only you see this tab, and the database rules stop anyone else from reading this list. Email shows only when a player's account makes it available to you.</p>
    <div class="row"><button class="btn small" data-act="admin-refresh">Refresh</button></div>
    ${body}
  </section>`;
}
function ordinalPos(n){ return n>0?ordinal(n):"\u2014"; }
const CHANGELOG = [
  {tag:"CHANGED", accent:"var(--flood)", date:"Latest", title:"Fresh look & tidier tabs",
   body:"A cleaner floodlit-stadium theme and a more logical tab order.",
   items:["New charcoal-and-gold broadcast look — a pitch-lit background and solid accents in place of the old glow.","Nav tabs reordered so your everyday screens (Club, Squad, Calendar, Packs) sit on the left, with reference screens to the right."]},
  {tag:"CHANGED", accent:"var(--c-orange)", date:"Recent", title:"Slower progression — reworked packs",
   body:"Packs now give lower-rated players on average, so building an elite squad takes longer.",
   items:["Elite packs are now three 79–84, one 85 and one 86+.","Bronze, Silver and Gold all pull lower than before.","Top-end quality still comes through — just rarer — making titles a genuine long-term goal."]},
  {tag:"NEW", accent:"var(--c-money)", date:"Recent", title:"Youth Academy & scouting profiles",
   body:"A proper youth pipeline with scouting reports on the next crop coming through.",
   items:["Four youngsters come through every season, signing for the first team at 16; each has a scouting profile with their age, background and potential.","Around 1 in 5 can become a 90+ world-beater — ceilings are shown on their profiles, and academy players grow towards them season by season.","A graduate log tracks everyone who’s come through, and academy players can no longer be found in packs."]},
  {tag:"NEW", accent:"var(--gold)", date:"Recent", title:"Trophy celebrations",
   body:"Win any trophy and the whole screen erupts.",
   items:["A big animated celebration — confetti, a glowing trophy and your club’s name in lights — for the league title, the League Cup and all three European cups.","Each comes with a chunky winners’ bonus on top of the usual prize money, up to £60m for the title.","Themed to the trophy you’ve just lifted."]},
  {tag:"NEW", accent:"#4f7cff", date:"Recent", title:"European competitions",
   body:"Finish high in the league and your club now qualifies for Europe the next season.",
   items:["Top five reach the Champions League, 6th the Europa League, 7th the Conference League — with a celebration the moment you qualify.","A new Europe tab with your knockout run to the final against real continental clubs — Real Madrid, Bayern, Inter, PSG and more.","Each competition has its own on-brand theme: blue Champions League, orange Europa League, green Conference League.","Prize money and reputation for going deep, and a trophy for lifting it."]},
  {tag:"NEW", accent:"var(--c-purple)", date:"Recent", title:"Club reputation",
   body:"A reputation bar that charts your club’s rise from nobody to continental giant.",
   items:["Starts near zero and climbs through six tiers — Unknown, Up-and-coming, Established, Big club, Elite, Continental giant.","Grows from marquee signings, wins (worth far more against strong teams), high league finishes and — above all — titles.","Shown as a bar on the Club screen and a live figure in the header; it takes seasons of success to reach the top."]},
  {tag:"NEW", accent:"var(--c-money)", date:"Recent", title:"Card collection",
   body:"A collector’s page that tracks every card in the game.",
   items:["All 374 cards — every Premier League player, all 8 Future Prospects and all 45 Europe’s Finest.","A ✓ marks each card you’ve packed; once collected it stays ticked even if you sell the player.","Filter by Collected or Missing and watch your completion percentage climb."]},
  {tag:"NEW", accent:"var(--c-blue)", date:"Recent", title:"News tab",
   body:"A matchday news hub that brings the rest of the football world into your season.",
   items:["Every other Premier League result from the latest matchday, plus a live top-of-the-table story.","League talking points — the title race, the relegation scrap and the division’s top scorers.","Around Europe: continental headlines starring the names you can pull as Europe’s Finest cards."]},
  {tag:"NEW", accent:"var(--loss)", date:"Recent", title:"Injuries & the Treatment Room",
   body:"Your players can now pick up injuries during matches — about one every six games.",
   items:["Four severities, from a one-game Knock to a serious injury that sidelines a player for 8–12 matches.","Injuries show live in the match feed; injured players can’t be picked until they recover — one game closer each match.","A new Treatment Room on the Squad screen lists everyone currently injured and their return time.","A fit sub is pulled into your XI automatically when someone goes down, and season’s end clears the lot."]},
  {tag:"NEW", accent:"var(--c-orange)", date:"Recent", title:"Matchday overhaul",
   body:"The live match is richer and more interactive than ever before.",
   items:["Choose your approach before kick-off — Defensive, Balanced or Attacking — and it changes how the match actually plays out.","Live commentary with named players, assists, penalties, saves, woodwork, bookings and late-drama goals.","Live match stats: possession, shots, shots on target and corners.","A Player of the Match at full time, carried into the fan reactions."]},
  {tag:"NEW", accent:"var(--c-blue)", date:"Recent", title:"Europe’s Finest cards",
   body:"A brand-new blue card type: 45 of the biggest names from Europe’s other top leagues — Mbappé, Vinícius and Bellingham (Real Madrid), Yamal, Pedri and Lewandowski (Barcelona), Kane and Musiala (Bayern), Dembélé and Kvaratskhelia (PSG), Lautaro, De Bruyne, Yıldız and more.",
   items:["Rated 83–92 — genuine world-class signings.","The rarest pull in the game: only Elite packs can contain one, roughly 1 in every 10.","Each shows its real club crest, kit colours and name."]},
  {tag:"NEW", accent:"#9b5cff", date:"Latest", title:"Future Prospect cards (now purple)",
   body:"Eight real-life wonderkids that grow with your club: Eli Junior Kroupi, Rayan and António Silva (Bournemouth), Archie Gray (Spurs), Ousmane Diomande (Forest), Max Dowman (Arsenal), Rio Ngumoha (Liverpool) and JJ Gabriel (Man Utd).",
   items:["Start rated 85 and gain +1 overall every single season you play.","Recoloured from teal to deep purple so they’re clearly different from Europe’s Finest.","Any pack has a small chance to contain one."]},
  {tag:"ADDED", accent:"var(--c-teal)", date:"Latest", title:"100+ more Premier League players",
   body:"Every club’s squad has been deepened with real 2025/26 players, so you stop seeing the same faces every time you open a pack.",
   items:["The player pool grew from ~205 to 321.","More variety across every rating band and position."]},
  {tag:"CHANGED", accent:"var(--c-money)", date:"Recent", title:"Transfer budgets rebalanced",
   body:"The money flow was retuned so building a title-winning side takes real planning across seasons.",
   items:["Start each save with £75m.","£30m board investment when the January window opens.","£50m summer budget at the end of every season, on top of prize money."]},
  {tag:"ADDED", accent:"var(--c-orange)", date:"Recent", title:"League Cup, calendar & match day",
   body:"A fuller season experience around the league campaign.",
   items:["Midweek League Cup knockout run to Wembley, with a green cup theme.","Month-by-month calendar grid with real-looking dates and rest days.","Match preview before kick-off, momentum arrows, and an X-style fan reaction feed after every game."]},
  {tag:"ADDED", accent:"var(--c-pink)", date:"Recent", title:"Seasons, prizes & selling",
   body:"Long-term progression and squad management.",
   items:["Prize money for every finishing position, plus an end-of-season review.","Multi-season title race — it takes a few years to build a winner.","Sell players you don’t need for an instant cash boost."]}
];
const ROADMAP = [
  {title:"Keeping squads accurate", body:"Rosters are hand-checked against the current season. Spot a player who’s moved or retired? Flag them and they’ll be swapped out."},
  {title:"More depth & card ideas", body:"Exploring further squad depth, extra card types and more ways to earn and spend across a save."},
  {title:"Balancing", body:"Ongoing tuning of pack odds, ratings and match difficulty based on how games actually play out."},
  {title:"Accounts & login", body:"A proper sign-in wall so progress can follow you between devices is being looked at for a future update."}
];
function vUpdates(){
  return `<section class="stack">
    <div class="uphead">
      <span class="eyebrow">What’s new in TacTicToe</span>
      <h2 style="font-size:40px;line-height:.95;margin:0">Recent updates</h2>
      <p class="muted" style="margin:0;max-width:60ch">Everything that’s just landed in the game, plus a look at what’s being worked on next. The game updates live — refresh to get the latest.</p>
    </div>
    <div class="feedbackbox">
      <span class="fbico">✉️</span>
      <div><b>Got an idea, a tweak or spotted a bug?</b>
      <p>Any suggestions on additions, tweaks or bugs — drop an email to <a href="mailto:Kaiwinter123@yahoo.com">Kaiwinter123@yahoo.com</a>. All queries considered and answered.</p></div>
    </div>
    <div class="uplist">
      ${CHANGELOG.map(c=>`<article class="upcard" style="--acc:${c.accent}">
        <div class="uptop"><span class="uptag">${esc(c.tag)}</span><span class="upwhen">${esc(c.date)}</span></div>
        <h3 class="uptitle">${esc(c.title)}</h3>
        <p class="upbody">${esc(c.body)}</p>
        <ul class="upitems">${c.items.map(i=>`<li>${esc(i)}</li>`).join("")}</ul>
      </article>`).join("")}
    </div>
    <div class="uphead" style="margin-top:8px">
      <span class="eyebrow">On the way</span>
      <h2 style="font-size:32px;margin:0">What’s being worked on</h2>
    </div>
    <div class="roadgrid">
      ${ROADMAP.map(rm=>`<div class="roadcard"><b>${esc(rm.title)}</b><span>${esc(rm.body)}</span></div>`).join("")}
    </div>
    <p class="muted" style="margin:6px 0 0;font-size:13px">These updates come from player feedback — email <a href="mailto:Kaiwinter123@yahoo.com" style="color:var(--c-blue)">Kaiwinter123@yahoo.com</a> with anything you'd like to see.</p>
  </section>`;
}
const NEWS_OUTLETS_PL=["The Matchday Wire","Prem Report","Touchline Times","Back Page","The Byline","Ninety Minutes"];
const NEWS_OUTLETS_EU=["Continental Football","European Scout","Matchday Europe","World Football Wire","The Continental","Golden Ball Daily"];
const EU_LEAGUE={RMA:"La Liga",BAR:"La Liga",ATM:"La Liga",BAY:"Bundesliga",DOR:"Bundesliga",PSG:"Ligue 1",INT:"Serie A",NAP:"Serie A",MIL:"Serie A",JUV:"Serie A"};
function vNews(tbl){
  const rng=seeded("news_"+S.season+"_"+S.round);
  const rp=a=>a[Math.floor(rng()*a.length)];
  const rr=(a,b)=>a+Math.floor(rng()*(b-a+1));
  const sc=()=>rr(1,4)+"–"+rr(0,2);
  const T=tbl||table(), N=T.length, mePos=T.findIndex(r=>r.id==="you")+1;
  const leader=T[0], second=T[1]||leader, lInfo=teamInfo(leader.id);
  const gap=leader.pts-second.pts;
  // ---- hero: biggest league story ----
  const heroSub = gap<=0 ? `${esc(teamInfo(second.id).name)} are level on points at the top — the title race is wide open.`
    : `${esc(lInfo.name)} are ${gap} point${gap>1?"s":""} clear at the summit after ${leader.p} game${leader.p>1?"s":""}.`;
  const hero=`<div class="newshero">${crest(lInfo.c1,lInfo.c2,lInfo.short,46)}
    <div style="min-width:0"><span class="eyebrow">Premier League · top story</span>
    <h2 class="nherohead">${esc(lInfo.name)} ${gap<=0?"cling to top spot":"set the pace"}</h2>
    <p class="nherosub">${heroSub}</p></div></div>`;
  // ---- other PL results this matchday ----
  const last=S.round-1; let resHTML="";
  if(last>=0 && S.results[last]){
    const fx=S.fixtures[last], res=S.results[last];
    resHTML = fx.map((pair,i)=>{ if(!pair||pair.includes("bye")) return ""; const s=res[i]; if(!s) return "";
      const [h,a]=pair, H=teamInfo(h), A=teamInfo(a), mine=h==="you"||a==="you";
      return `<div class="plrow${mine?" me":""}">${crest(H.c1,H.c2,H.short,16)}<span class="pn">${esc(H.short)}</span><b class="sc">${s[0]}–${s[1]}</b><span class="pn r">${esc(A.short)}</span>${crest(A.c1,A.c2,A.short,16)}</div>`;
    }).join("");
  }
  // ---- league talking points ----
  const pts=[];
  const topN = mePos<=4 ? "in the hunt for Europe" : mePos>=N-2 ? "in a relegation scrap" : "in mid-table";
  pts.push({src:rp(NEWS_OUTLETS_PL),acc:"var(--flood)",head:`Your club sit ${ordinal(mePos)}`,body:`${esc(S.club.name)} are ${topN} after ${leader.p} rounds. ${mePos===1?"Dare to dream of the title.":mePos<=4?"Keep this up and it’s continental football next year.":mePos>=N-2?"Points are needed, and fast.":"Steady progress — push on."}`});
  const relg=T.slice(-3).map(r=>teamInfo(r.id).name);
  pts.push({src:rp(NEWS_OUTLETS_PL),acc:"var(--loss)",head:"Trouble at the bottom",body:`${esc(relg.join(", "))} make up the current bottom three and face a battle to beat the drop.`});
  const topScorerClub=[...T].sort((a,b)=>b.gf-a.gf)[0];
  pts.push({src:rp(NEWS_OUTLETS_PL),acc:"var(--c-orange)",head:"Goal machines",body:`${esc(teamInfo(topScorerClub.id).name)} have scored the most in the division (${topScorerClub.gf}) — free-scoring and fearless.`});
  // ---- continental / Europe's Finest news ----
  const shorts=Object.keys(EURO_CLUBS);
  const playerOf=s=>{const l=UCL.filter(u=>u.csh===s); return l.length?rp(l).n:"their talisman";};
  const two=()=>{ const a=rp(shorts); let b; do{ b=rp(shorts);}while(b===a); return [a,b]; };
  const eu=[];
  { const[a,b]=two(), pa=playerOf(a); eu.push({a,head:`${pa} fires ${EURO_CLUBS[a][2]} past ${EURO_CLUBS[b][2]}`,body:`A ${sc()} win in ${EU_LEAGUE[a]||"Europe"} as ${EURO_CLUBS[a][2]} keep up the pressure at the top. ${pa} was once again the difference.`}); }
  { const[a,b]=two(), pa=playerOf(a); eu.push({a:b,head:`${EURO_CLUBS[b][2]} eyeing ${pa}`,body:`Reports across ${EU_LEAGUE[b]||"the continent"} claim ${EURO_CLUBS[b][2]} are lining up a blockbuster move for ${EURO_CLUBS[a][2]}’s ${pa} in the next window.`}); }
  { const[a,b]=two(), pa=playerOf(a), pb=playerOf(b); eu.push({a,head:`Champions League classic: ${EURO_CLUBS[a][2]} ${sc()} ${EURO_CLUBS[b][2]}`,body:`A breathless European night under the lights, with ${pa} and ${pb} both on the scoresheet.`}); }
  { const a=rp(shorts), pa=playerOf(a); eu.push({a,head:`Ballon d’Or watch: ${pa} stakes his claim`,body:`Another standout display for ${EURO_CLUBS[a][2]} has pundits talking up ${pa} as a genuine contender for the game’s top prize.`}); }
  { const a=rp(shorts); eu.push({a,head:`${EURO_CLUBS[a][2]} on an unbeaten run`,body:`${rr(6,14)} games without defeat in ${EU_LEAGUE[a]||"their league"} — ${EURO_CLUBS[a][2]} are the team nobody in Europe wants to face right now.`}); }
  const euShuf=eu.map(x=>[rng(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
  const euCards=euShuf.map(n=>{const c=EURO_CLUBS[n.a];return `<article class="newscard" style="--acc:var(--c-blue)"><div class="nctop">${crest(c[0],c[1],n.a,20)}<span class="nsrc">${esc(rp(NEWS_OUTLETS_EU))}</span><span class="newstag eu">Europe</span></div><h3 class="nhead">${esc(n.head)}</h3><p class="nbody">${esc(n.body)}</p></article>`;}).join("");
  return `<section class="stack newswrap">
    <div class="row" style="justify-content:space-between"><h2 style="font-size:40px">News</h2><span class="muted">Season ${S.season} · Matchday ${Math.min(S.round+1,S.fixtures.length)}</span></div>
    ${hero}
    <div class="newscols">
      <div class="stack">
        <div class="panel stack"><span class="eyebrow">Premier League · latest results</span>
          <div class="plres">${resHTML||`<p class="muted" style="margin:0">Play your first match to see results come in across the league.</p>`}</div>
          <button class="btn small" data-view="table" style="align-self:flex-start">Full table →</button></div>
        <span class="eyebrow">Talking points</span>
        <div class="newsgrid">${pts.map(p=>`<article class="newscard" style="--acc:${p.acc}"><div class="nctop"><span class="nsrc">${esc(p.src)}</span><span class="newstag pl">Prem</span></div><h3 class="nhead">${esc(p.head)}</h3><p class="nbody">${p.body}</p></article>`).join("")}</div>
      </div>
      <div class="stack">
        <span class="eyebrow">⭐ Around Europe</span>
        <div class="newsgrid">${euCards}</div>
        <p class="muted" style="margin:0;font-size:12px">Continental coverage featuring the stars you can pull as Europe’s Finest cards.</p>
      </div>
    </div>
  </section>`;
}
function collectItems(){
  const items=[];
  POOL.forEach(p=>items.push({rid:p.rid,n:p.n,pos:p.pos,ovr:p.ovr,type:"pl",club:p.club}));
  PROSPECTS.forEach(p=>items.push({rid:p.rid,n:p.n,pos:p.pos,ovr:PROSPECT_BASE,type:"prospect",club:p.club}));
  UCL.forEach(u=>items.push({rid:u.rid,n:u.n,pos:u.pos,ovr:u.ovr,type:"finest",csh:u.csh}));
  return items;
}
function vCollection(){
  const owned=new Set([...(S.collected||[]), ...S.squad.map(p=>p.rid).filter(Boolean)]);
  const filt=ui.collFilter||"all";
  const keep=it=>filt==="all"||(filt==="have"?owned.has(it.rid):!owned.has(it.rid));
  const chip=it=>{ const got=owned.has(it.rid);
    const acc=it.type==="finest"?"var(--c-blue)":it.type==="prospect"?"#9b5cff":(CLUBS[it.club]?CLUBS[it.club][2]:"var(--flood)");
    return `<div class="collitem ${got?"got":""}" style="--acc:${esc(acc)}" title="${esc(it.n)} · ${it.pos} · ${it.ovr}${got?" · collected":" · not collected"}">
      <span class="covr">${it.ovr}</span><span class="cnm">${esc(surname(it.n))}</span><span class="cpos">${it.pos}</span>
      ${got?'<span class="ctick">✓</span>':'<span class="clock">○</span>'}</div>`; };
  const all=collectItems();
  const ownedCount=all.filter(it=>owned.has(it.rid)).length, pct=Math.round(ownedCount/all.length*100);
  const section=(label,accent,list)=>{ const l=list.filter(keep); if(!l.length&&filt!=="all") return "";
    const c=list.filter(it=>owned.has(it.rid)).length;
    return `<div class="collsec"><div class="collhead"><span class="eyebrow" style="color:${accent}">${label}</span><span class="collcount">${c}/${list.length}</span></div><div class="collgrid">${l.map(chip).join("")||'<p class="muted" style="margin:0;grid-column:1/-1">None to show here.</p>'}</div></div>`; };
  const finest=all.filter(it=>it.type==="finest"), prospects=all.filter(it=>it.type==="prospect"), pl=all.filter(it=>it.type==="pl");
  let plHTML="";
  CLUBS.forEach((c,ci)=>{ const list=pl.filter(it=>it.club===ci); if(!list.length) return;
    const l=list.filter(keep); if(!l.length&&filt!=="all") return;
    const got=list.filter(it=>owned.has(it.rid)).length;
    plHTML+=`<div class="collclub"><div class="collhead">${crest(c[2],c[3],c[1],20)}<span class="clubnm">${esc(c[0])}</span><span class="collcount">${got}/${list.length}</span></div><div class="collgrid">${l.map(chip).join("")}</div></div>`;
  });
  return `<section class="stack">
    <div class="row" style="justify-content:space-between"><h2 style="font-size:40px">Card collection</h2><span class="muted">${ownedCount}/${all.length} cards</span></div>
    <div class="collprog"><div class="collbar"><i style="width:${pct}%"></i></div><b>${pct}% complete</b></div>
    <p class="muted" style="margin:0;font-size:13px">Every real card in the game. A ✓ means it’s in your collection — pack a player once and it’s ticked for good, even if you later sell them.</p>
    <div class="filters">${[["all","All"],["have","Collected"],["need","Missing"]].map(([f,l])=>`<button class="chip" data-act="collfilter" data-f="${f}" aria-pressed="${filt===f}">${l}</button>`).join("")}</div>
    ${section("⭐ Europe’s Finest","var(--c-blue)",finest)}
    ${section("⭐ Future Prospects","#b78cff",prospects)}
    <div class="collsec"><div class="collhead"><span class="eyebrow">Premier League</span><span class="collcount">${pl.filter(it=>owned.has(it.rid)).length}/${pl.length}</span></div>
      <div class="stack" style="gap:14px">${plHTML||'<p class="muted" style="margin:0">None to show here.</p>'}</div></div>
  </section>`;
}
function shortRound(n){ return ({"Round of 16":"R16","Quarter-final":"QF","Semi-final":"SF","Final":"Final","Second Round":"R2","Third Round":"R3","Fourth Round":"R4"})[n]||n; }
function bracketGraph(c, accent){
  if(!c) return "";
  const nodes=c.rounds.map((t,i)=>{
    const played=t.played, isNext=(i===c.idx && !c.out && !c.won && !played), opp=teamInfo(t.opp);
    const st=played?(t.won?"won":"lost"):isNext?"next":"up";
    const ha=t.name==="Final"?"N":t.home?"H":"A";
    const res=played?`${t.score[0]}–${t.score[1]}${t.pens?" p":""}`:isNext?"NEXT":"–";
    return `<div class="brd ${st}" title="${esc(t.name)} vs ${esc(opp.name)}"><span class="brround">${esc(shortRound(t.name))} · ${ha}</span><div class="brnode">${crest(opp.c1,opp.c2,opp.short,18)}<span class="bropp">${esc(opp.short)}</span></div><span class="brres">${res}</span></div>`;
  }).join('<span class="brline"></span>');
  const trophy=`<span class="brline"></span><div class="brd trophy ${c.won?"won":c.out?"out":""}"><span class="brtroph">${c.won?"🏆":"🌟"}</span><span class="brround">${c.won?"Winners":c.out?"Out":"Trophy"}</span></div>`;
  return `<div class="bracket" style="--brc:${accent||"var(--flood)"}">${nodes}${trophy}</div>`;
}
function vCompetitions(tbl){
  const T=tbl||table(), pos=T.findIndex(r=>r.id==="you")+1;
  const onCourseComp = pos<=5?"ucl":pos===6?"uel":pos===7?"uecl":null;
  const e=S.euro, cup=S.cup, ne=nextEvent();
  const EUROCOL={ucl:"#4f7cff",uel:"#ff8a2a",uecl:"#36d97a"};
  const zone=`<div class="panel stack"><span class="eyebrow">How you qualify for Europe</span>
    <div class="qzones">
      <div class="qzone ucl"><b>Champions League</b><span>Finish 1st – 5th</span></div>
      <div class="qzone uel"><b>Europa League</b><span>Finish 6th</span></div>
      <div class="qzone uecl"><b>Conference League</b><span>Finish 7th</span></div>
    </div>
    <p class="muted" style="margin:0;font-size:13px">${S.round>0?`You’re currently <b>${ordinal(pos)}</b> — ${onCourseComp?`on course for the <b>${EURO_META[onCourseComp].name}</b> next season.`:"outside the European places for now."}`:"Finish high enough in the league and you’ll qualify for Europe next season."}</p></div>`;
  const header = e
    ? (()=>{ const m=EURO_META[e.comp]; const st=e.won?`${m.name} winners! 🏆`:e.out?`Knocked out in the ${e.rounds[e.idx].name}.`:`Still in it — ${e.rounds[e.idx].name}.`;
        return `<div class="ehead ${e.theme}"><span class="ebadge">🏆</span><div><h2 style="margin:0;font-size:34px">${esc(m.name)}</h2><span class="estatus">${esc(st)}</span></div><span class="etag ${e.theme}">${m.short}</span></div>`; })()
    : `<div class="ehead none"><span class="ebadge">🌍</span><div><h2 style="margin:0;font-size:34px">Competitions</h2><span class="muted">${S.round>0&&onCourseComp?`On course for the ${EURO_META[onCourseComp].name} next season.`:"Track your knockout runs — League Cup and Europe."}</span></div></div>`;
  const cupNext=ne&&ne.type==="cup", euroNext=ne&&ne.type==="euro";
  const cupStatus=cup?(cup.won?"Winners 🏆":cup.out?"Knocked out":"In the "+cup.rounds[cup.idx].name):"";
  const cupSection=`<div class="panel stack"><div class="row" style="justify-content:space-between;align-items:center"><span class="eyebrow">League Cup · ${esc(cupStatus)}</span>${cupNext?`<button class="btn small primary" data-act="play">Play ${esc(cup.rounds[cup.idx].name)} ▶</button>`:""}</div>${bracketGraph(cup,"var(--win)")}</div>`;
  const euroSection = e?`<div class="panel stack"><div class="row" style="justify-content:space-between;align-items:center"><span class="eyebrow">${esc(EURO_META[e.comp].name)} · your run to the final</span>${euroNext?`<button class="btn small primary" data-act="play">Play ${esc(e.rounds[e.idx].name)} ▶</button>`:""}</div>${bracketGraph(e,EUROCOL[e.comp])}</div>`:"";
  const honours = (S.cupTrophies||S.euroTrophies)?`<div class="panel"><span class="eyebrow">Honours</span><p style="margin:6px 0 0">${S.cupTrophies?`🏆 ${S.cupTrophies} League Cup${S.cupTrophies===1?"":"s"}. `:""}${S.euroTrophies?`⭐ ${S.euroTrophies} European troph${S.euroTrophies===1?"y":"ies"} won.`:""}</p></div>`:"";
  return `<section class="stack">
    ${header}
    ${cupSection}
    ${euroSection}
    ${zone}
    ${honours}
  </section>`;
}
function academyProfile(pr){
  const band=potBand(pr.potential);
  return `<article class="ppcard ${band}">
    <div class="pp-head"><span class="pp-ovr num">${pr.ovr}</span><div style="min-width:0"><b>${esc(pr.n)}</b><span class="pp-meta">${pr.pos} · Age ${pr.age} · signs at 16</span></div></div>
    <div class="pp-pot ${band}">${esc(potLabel(pr.potential))}</div>
    <p class="pp-bg">${esc(pr.bg)}</p>
  </article>`;
}
function vAcademy(){
  const pipeline=S.academyProspects||[];
  const log=(S.academy||[]).slice().reverse();
  const inSquad=new Set(S.squad.map(p=>p.id));
  const current=S.squad.filter(p=>isAcademy(p));
  const gen=pipeline.filter(pr=>pr.potential>=90).length;
  return `<section class="stack">
    <div class="ehead none"><span class="ebadge">🎓</span><div><h2 style="margin:0;font-size:34px">Youth Academy</h2><span class="muted">Home-grown talent — not available in packs.</span></div></div>
    <div class="panel stack"><span class="eyebrow">How the academy works</span>
      <p class="muted" style="margin:0;font-size:13px"><b>Four youngsters</b> come through your academy every season. They develop in the youth setup and <b>sign for the first team when they turn 16</b>. Around <b>1 in 5</b> has the potential to become a 90+ world-beater — each prospect’s ceiling is shown on their profile, and they grow towards it season by season once they’re at the club. You can’t pack them; they’re yours alone.</p>
      <div class="row" style="gap:22px">
        <div class="stat"><div class="eyebrow">Coming through</div><div class="v" style="color:var(--c-blue)">${pipeline.length}</div></div>
        <div class="stat"><div class="eyebrow">Graduates</div><div class="v" style="color:var(--c-money)">${log.length}</div></div>
        <div class="stat"><div class="eyebrow">In squad</div><div class="v" style="color:var(--flood)">${current.length}</div></div>
      </div>
    </div>
    <div class="panel stack"><div class="row" style="justify-content:space-between"><span class="eyebrow">⏳ Coming through next season</span>${gen?`<span class="ppgenflag">⭐ ${gen} potential 90+</span>`:""}</div>
      <div class="ppgrid">${pipeline.length?pipeline.map(academyProfile).join(""):'<p class="muted" style="margin:0;grid-column:1/-1">No prospects in the pipeline right now.</p>'}</div>
    </div>
    <div class="panel stack"><span class="eyebrow">Graduate log — newest first</span>
      ${log.length?`<div class="acadlist">${log.map(r=>{const still=inSquad.has(r.id); return `<div class="acadrow ${still?"":"gone"}">
        <span class="acovr num">${r.ovr}</span>
        <div style="min-width:0"><b>${esc(surname(r.n))}</b><span class="acmeta">${r.pos} · ${esc(r.when)}${r.potential?` · ceiling ${r.potential}`:""}</span></div>
        <span class="acstatus ${still?"in":"out"}">${still?"✓ In squad":"Departed"}</span></div>`;}).join("")}</div>`
      :`<p class="muted" style="margin:0">No graduates yet — your first intake arrives when you start.</p>`}
    </div>
  </section>`;
}
function vHistory(tbl,pos){
  const titles=S.trophies||0, cups=S.cupTrophies||0, seasons=(S.history||[]).length;
  const best = (S.history||[]).reduce((b,h)=>Math.min(b, h.pos), pos||99);
  const bw=S.records&&S.records.bestWin;
  const ach=[
    ["League titles", titles, "\ud83c\udfc6"],
    ["League Cups", cups, "\ud83c\udfc5"],
    ["Seasons", seasons, "\ud83d\udcc5"],
    ["Best finish", best<99?ordinal(best):"\u2014", "\u2b50"]
  ];
  const rows=(S.history||[]).slice().reverse().map(h=>`<tr class="${h.title?"me":""}"><td>S${h.season}</td><td>${2025+h.season}/${String(26+h.season).padStart(2,"0")}</td><td>${ordinal(h.pos)}${h.title?' \ud83c\udfc6':''}</td><td>${h.pts}</td><td class="team">${esc(h.cup||"\u2014")}</td></tr>`).join("");
  return `<section class="stack">
    <h2 style="font-size:36px">Club history</h2>
    <div class="achgrid">${ach.map(a=>`<div class="achcard"><div class="achico">${a[2]}</div><div class="achv num">${a[1]}</div><div class="achl">${esc(a[0])}</div></div>`).join("")}</div>
    ${bw?`<div class="panel stack"><span class="eyebrow">Biggest win</span><div class="row" style="justify-content:space-between"><b style="font-family:var(--display);font-size:24px;text-transform:uppercase">${bw.me}\u2013${bw.them} vs ${esc(bw.oppShort)}</b><span class="muted">${esc(bw.comp)} \u00b7 Season ${bw.season}</span></div><span class="muted" style="font-size:13px">Against ${esc(bw.opp)}</span></div>`:`<div class="panel"><p class="muted" style="margin:0">Win a match to set your record. Your biggest victory will show here.</p></div>`}
    <div class="panel stack"><span class="eyebrow">Season by season</span>
      ${rows?`<div class="tablewrap"><table><thead><tr><th class="team">Season</th><th class="team">Year</th><th class="team">Finish</th><th>Pts</th><th class="team">Cup</th></tr></thead><tbody>${rows}</tbody></table></div>`:`<p class="muted" style="margin:0">Your story starts here \u2014 you are in Season ${S.season}, currently ${pos?ordinal(pos):"unranked"}. Finish the season to add it to your history.</p>`}
    </div>
  </section>`;
}
function vTable(tbl){
  return `<section class="panel stack"><div class="row" style="justify-content:space-between"><h2 style="font-size:36px">League table</h2><span class="muted">Premier League ${2025+S.season}/${String(26+S.season).padStart(2,"0")} · after matchday ${S.round}</span></div>
  ${leagueTableHTML(tbl)}</section>`;
}
const CAL_WD=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], CAL_MO=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function seasonStart(){ const y=2025+S.season; let d=Date.UTC(y,7,15); while(new Date(d).getUTCDay()!==6) d+=864e5; return d; } // first Saturday on/after 15 Aug
function mDate(round){ const d=mDateObj(round); return {wd:CAL_WD[d.getUTCDay()],day:d.getUTCDate(),mo:CAL_MO[d.getUTCMonth()],yr:d.getUTCFullYear()}; }
function dkey(d){ return d.getUTCFullYear()+"-"+d.getUTCMonth()+"-"+d.getUTCDate(); }
function calEvents(){
  const ev={}, ne=nextEvent();
  for(let r=0;r<S.fixtures.length;r++){ const {m}=myFixture(r); if(m.includes("bye")) continue;
    const d=mDateObj(r), home=m[0]==="you", oppId=home?m[1]:m[0];
    const i=S.fixtures[r].findIndex(x=>x.includes("you")), sc=S.results[r]&&S.results[r][i];
    let result=null,k=null; if(sc){ const mine=home?sc[0]:sc[1],th=home?sc[1]:sc[0]; result=[sc[0],sc[1]]; k=mine>th?"W":mine<th?"L":"D"; }
    ev[dkey(d)]={comp:"league",oppId,home,result,k,isNext:(ne&&ne.type==="league"&&r===S.round)};
  }
  if(S.cup){ S.cup.rounds.forEach((t,idx)=>{
    const show = t.played || (idx===S.cup.idx && !S.cup.out && !S.cup.won);
    if(!show) return;
    let result=null,k=null; if(t.played){ result=t.score; k=t.won?"W":"L"; }
    ev[dkey(new Date(cupDate(t.week)))]={comp:"cup",oppId:t.opp,home:(t.name==="Final"?null:t.home),result,k,round:t.name,isNext:(ne&&ne.type==="cup"&&idx===S.cup.idx)};
  }); }
  if(S.euro){ S.euro.rounds.forEach((t,idx)=>{
    const show = t.played || (idx===S.euro.idx && !S.euro.out && !S.euro.won);
    if(!show) return;
    let result=null,k=null; if(t.played){ result=t.score; k=t.won?"W":"L"; }
    ev[dkey(new Date(euroDate(t.week)))]={comp:"euro",theme:S.euro.theme,tag:EURO_META[S.euro.comp].short,compName:S.euro.name,oppId:t.opp,home:(t.name==="Final"?null:t.home),result,k,round:t.name,isNext:(ne&&ne.type==="euro"&&idx===S.euro.idx)};
  }); }
  return ev;
}
function monthGrid(y,mo,ev,nowDay){
  const MN=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const WD=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const lead=(new Date(Date.UTC(y,mo,1)).getUTCDay()+6)%7, days=new Date(Date.UTC(y,mo+1,0)).getUTCDate();
  let cells="";
  for(let i=0;i<lead;i++) cells+=`<div class="cday empty"></div>`;
  for(let dn=1;dn<=days;dn++){ const e=ev[y+"-"+mo+"-"+dn];
    const past = Date.UTC(y,mo,dn) < nowDay;
    if(!e){ cells+=`<div class="cday${past?" past":""}"><span class="cdn">${dn}</span></div>`; continue; }
    const t=teamInfo(e.oppId), ha=e.home==null?"N":e.home?"H":"A";
    const compClass=e.comp==="euro"?"euro "+e.theme:e.comp;
    const compTitle=e.comp==="cup"?"League Cup":e.comp==="euro"?e.compName:"Premier League";
    const tagClass=e.comp==="euro"?e.theme:e.comp, tagTxt=e.comp==="cup"?"CUP":e.comp==="euro"?e.tag:"LGE";
    cells+=`<div class="cday match ${compClass}${e.isNext?" next":""}${e.k?" r"+e.k:""}${past?" past":""}" title="${esc(t.name)} (${esc(compTitle)})">
      <span class="ctop"><span class="cdn">${dn}</span><span class="ctag ${tagClass}">${tagTxt}</span></span>
      <span class="cmx">${crest(t.c1,t.c2,t.short,15)}<span class="cop">${esc(t.short)}</span><span class="cha">${ha}</span></span>
      <span class="cres">${e.result?e.result[0]+"\u2013"+e.result[1]:(e.isNext?"NEXT":ha)}</span>
    </div>`;
  }
  return `<div class="cmonth"><div class="cmhead">${MN[mo]} ${y}</div><div class="cgh">${WD.map(w=>`<span>${w}</span>`).join("")}</div><div class="cgrid">${cells}</div></div>`;
}
function vCalendar(tbl){
  const ne=nextEvent();
  let head;
  if(!ne){ const pos=tbl.findIndex(r=>r.id==="you")+1;
    head=`<div class="calhead done"><div><span class="eyebrow">Season ${S.season} finished</span><div class="cal-next">${pos===1?"Champions of England":ordinal(pos)+" in the league"}</div></div><button class="btn primary" data-act="next-season">Start season ${S.season+1}</button></div>`;
  } else {
    const isCup=ne.type==="cup", isEuro=ne.type==="euro", t=(isCup||isEuro)?ne.tie:null;
    const home=t?(t.name==="Final"?true:t.home):(myFixture(S.round).m[0]==="you");
    const oppId=t?t.opp:(home?myFixture(S.round).m[1]:myFixture(S.round).m[0]);
    const opp=teamInfo(oppId), d=isEuro?new Date(euroDate(t.week)):isCup?new Date(cupDate(t.week)):mDateObj(S.round);
    const comp=isEuro?(S.euro.name+" \u00b7 "+t.name):isCup?("League Cup \u00b7 "+t.name):("Matchday "+(S.round+1));
    const accent=isEuro?({ucl:"#4f7cff",uel:"#ff8a2a",uecl:"#36d97a"})[S.euro.theme]:isCup?"var(--elite)":"var(--flood)";
    const filled=S.xi.filter(Boolean).length;
    head=`<div class="calhead ${isEuro?S.euro.theme+"head":isCup?"cuphead":""}"><div style="min-width:0"><span class="eyebrow">Next up \u00b7 ${CAL_WD[d.getUTCDay()]} ${d.getUTCDate()} ${CAL_MO[d.getUTCMonth()]} \u00b7 <b style="color:${accent}">${esc(comp)}</b></span>
      <div class="cal-next">${crest(opp.c1,opp.c2,opp.short,26)}<span>${esc(opp.name)}</span><span class="muted" style="font-weight:400">${t&&t.name==="Final"?"Neutral":home?"Home":"Away"}</span></div>
      ${filled<11?`<span class="muted" style="font-size:13px">${11-filled} empty slot${filled===10?"":"s"} \u2014 a youth player fills in.</span>`:""}</div>
      <button class="btn primary" data-act="play">Advance \u25b6</button></div>`;
  }
  const ev=calEvents();
  const nowMs = ne ? (ne.type==="euro"? euroDate(ne.tie.week) : ne.type==="cup"? cupDate(ne.tie.week) : mDateObj(S.round).getTime()) : (seasonStart()+(S.fixtures.length)*7*864e5);
  const nd=new Date(nowMs), nowDay=Date.UTC(nd.getUTCFullYear(),nd.getUTCMonth(),nd.getUTCDate());
  const startD=new Date(seasonStart()), lastD=new Date(seasonStart()+(S.fixtures.length-1)*7*864e5);
  let grids="";
  for(let d=new Date(Date.UTC(startD.getUTCFullYear(),startD.getUTCMonth(),1)); d<=lastD; d=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,1)))
    grids+=monthGrid(d.getUTCFullYear(),d.getUTCMonth(),ev,nowDay);
  const cup=S.cup, cupLine = cup? (cup.won?"\ud83c\udfc6 League Cup WINNERS":cup.out?"League Cup \u00b7 knocked out ("+cup.rounds[cup.idx].name+")":"League Cup \u00b7 "+cup.rounds[cup.idx].name) : "";
  const eu=S.euro, euLine = eu? (eu.won?"\ud83c\udfc6 "+eu.name+" WINNERS":eu.out?eu.name+" \u00b7 knocked out ("+eu.rounds[eu.idx].name+")":eu.name+" \u00b7 "+eu.rounds[eu.idx].name) : "";
  return `<section class="stack">
    <div class="row" style="justify-content:space-between"><h2 style="font-size:36px">Calendar</h2><span class="muted">Season ${S.season} \u00b7 ${2025+S.season}/${String(26+S.season).padStart(2,"0")}</span></div>
    ${head}
    <div class="callegend"><span><i class="lg league"></i>League</span><span><i class="lg cup"></i>League Cup</span>${eu?`<span><i class="lg euro ${eu.theme}"></i>${esc(EURO_META[eu.comp].name)}</span>`:""}<span>${esc(cupLine)}</span>${eu?`<span>${esc(euLine)}</span>`:""}</div>
    <div class="calmonths">${grids}</div>
  </section>`;
}
function vFixtures(){
  return `<section class="stack"><h2 style="font-size:36px">Your fixtures</h2><div class="fxlist">
  ${S.fixtures.map((rd,r)=>{const i=rd.findIndex(m=>m.includes("you")),[h,a]=rd[i];if(h==="bye"||a==="bye")return "";const home=h==="you",opp=teamInfo(home?a:h),sc=S.results[r]&&S.results[r][i];
    let res="";if(sc){const mine=home?sc[0]:sc[1],th=home?sc[1]:sc[0];const k=mine>th?"W":mine<th?"L":"D";res=`<span class="res ${k}">${sc[0]}–${sc[1]}</span>`}
    return `<div class="fx ${r===S.round?"next":""}"><span class="num muted">MD${r+1}</span><span class="row" style="gap:8px;flex-wrap:nowrap;min-width:0"><span class="dot" style="background:${esc(opp.c1)}"></span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(opp.name)}</span><span class="muted">${home?"(H)":"(A)"}</span></span>${res||(r===S.round?'<span class="eyebrow" style="color:var(--flood);text-align:center">Next</span>':"")}</div>`}).join("")}
  </div></section>`;
}

/* ---------- gate (sign in + create club) ---------- */
let draft = {manager:"",name:"",short:"",stadium:"",c1:"#e63946",c2:"#111111"};
function gate(){
  const who = store.me;
  const hero=["Erling Haaland","Bukayo Saka","Cole Palmer"].map(n=>POOL.find(p=>p.n===n)).filter(Boolean).map(p=>{const q=makePlayer(p.ovr,p.pos);q.n=p.n;q.club=p.club;q.a=attrsFor(p.ovr,p.pos,p.rid);return q});
  return `<div class="wrap gate"><div class="gatecols"><div class="fan" aria-hidden="true">${hero.map(card).join("")}</div><div class="box">
    <div><span class="eyebrow">Premier League 2026/27 · pack-and-season game</span><h1>Tac<em>Tic</em>Toe</h1></div>
    ${store.kind==="db"&&who?`<div class="who"><img src="${esc(who.avatarUrl)}" alt=""><span>Signed in${who.name?" as <b>"+esc(who.name)+"</b>":""}. Your club saves to your account.</span></div>`
      :`<p class="muted" style="margin:0">${store.kind==="local"?"You're not signed in to claude.ai, so your club saves in this browser only.":"Connecting to your account…"}</p>`}
    <div class="intro">
      <p style="margin:0 0 10px">TacTicToe is a football manager where you build a club from nothing and chase glory over many seasons. Here's how it works:</p>
      <ul class="introlist">
        <li><b>Found your club</b> \u2014 name it, pick your colours, badge animal and stadium.</li>
        <li><b>Open packs</b> to sign <b>real Premier League players</b>. You start with ${money(START_BUDGET)} for a modest squad.</li>
        <li><b>Pick your team</b> \u2014 choose a formation, set your XI, make subs and sell players you don't need.</li>
        <li><b>Play the season</b> \u2014 every other club home and away, watched live with momentum and fan reactions.</li>
        <li><b>Win the League Cup</b> too \u2014 midweek knockout ties on the way to Wembley.</li>
        <li><b>Earn & grow</b> \u2014 prize money for every finish, plus a <b>\u00a330m January top-up</b>, plus a £50m summer budget each season.</li>
        <li><b>Build a legacy</b> \u2014 it takes a few seasons to challenge for the title. Track your trophies and records in History.</li>
      </ul>
    </div>
    <form id="create" class="stack" novalidate>
      <label for="mgr">Your name (manager)<input type="text" id="mgr" maxlength="24" value="${esc(draft.manager||(who&&who.name)||"")}" required></label>
      <div class="formrow">
        <label for="cname">Club name<input type="text" id="cname" maxlength="26" placeholder="e.g. Harbour Lane FC" value="${esc(draft.name)}" required></label>
        <label for="cshort">Short name (3 letters)<input type="text" id="cshort" maxlength="3" placeholder="HLF" value="${esc(draft.short)}"></label>
      </div>
      <label for="cstad">Stadium name<input type="text" id="cstad" maxlength="34" placeholder="e.g. Harbour Park" value="${esc(draft.stadium)}"></label>
      <div class="formrow">
        <div class="stack" style="gap:6px"><span class="eyebrow">Home colour</span><div class="swatches">${SWATCHES.map(c=>`<button type="button" class="sw" style="background:${c}" data-c="c1" data-v="${c}" aria-label="Home colour ${c}" aria-pressed="${draft.c1===c}"></button>`).join("")}</div></div>
        <div class="stack" style="gap:6px"><span class="eyebrow">Second colour</span><div class="swatches">${SWATCHES.map(c=>`<button type="button" class="sw" style="background:${c}" data-c="c2" data-v="${c}" aria-label="Second colour ${c}" aria-pressed="${draft.c2===c}"></button>`).join("")}</div></div>
      </div>
      <div class="preview" id="pv"></div>
      <p id="err" class="muted" style="margin:0;color:var(--loss)" hidden></p>
      <div><button class="btn primary" type="submit">Found the club</button></div>
    </form>
  </div></div></div>`;
}
function shortFrom(n){const w=n.trim().split(/\s+/).filter(Boolean);return (w.length>1?w.map(x=>x[0]).join(""):n.replace(/\s/g,"")).slice(0,3).toUpperCase()}
function paintPreview(){
  const n=draft.name.trim()||"Your Club", s=(draft.short||shortFrom(n)).toUpperCase();
  $("#pv").innerHTML = `${crest(draft.c1,draft.c2,s,52)}<div><b>${esc(n)}</b><div class="muted">${esc(s)} · Season 1</div></div>`;
}
function bindGate(){
  const f=$("#create"); if(!f) return;
  paintPreview();
  f.addEventListener("input",()=>{draft.manager=$("#mgr").value;draft.name=$("#cname").value;draft.short=$("#cshort").value.toUpperCase();draft.stadium=$("#cstad").value;paintPreview()});
  f.querySelectorAll(".sw").forEach(b=>b.addEventListener("click",()=>{draft[b.dataset.c]=b.dataset.v;f.querySelectorAll(`.sw[data-c="${b.dataset.c}"]`).forEach(x=>x.setAttribute("aria-pressed",x===b));paintPreview()}));
  f.addEventListener("submit",e=>{
    e.preventDefault();
    const m=$("#mgr").value.trim(), n=$("#cname").value.trim(), err=$("#err");
    if(!m||!n){err.textContent="Enter your name and a club name to continue.";err.hidden=false;return}
    if(draft.c1===draft.c2){err.textContent="Pick two different colours so your kit stands out.";err.hidden=false;return}
    newGame({manager:m,name:n,short:($("#cshort").value.trim()||shortFrom(n)).toUpperCase(),stadium:($("#cstad").value.trim()||n+" Stadium"),c1:draft.c1,c2:draft.c2});
    view="club"; render(); toast("Welcome to "+n+". Head to Packs to strengthen the squad.");
  });
}

