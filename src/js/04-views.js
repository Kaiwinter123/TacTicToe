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
    </div>
  </div>
  <nav class="tabs" aria-label="Sections"><div class="wrap">
    ${[["club","Club"],["packs","Packs"],["squad","Squad"],["table","Table"],["calendar","Calendar"],["history","History"],["updates","Updates"]].concat(isAdmin?[["admin","Admin"]]:[]).map(([k,l])=>`<button class="tab ${k==="admin"?"owner":k==="updates"?"fresh":""}" data-view="${k}" ${view===k?'aria-current="page"':""}>${l}${k==="updates"?'<span class="newdot">NEW</span>':""}</button>`).join("")}
  </div></nav></header>
  <main class="wrap">${(({club:vClub,packs:vPacks,squad:vSquad,table:vTable,calendar:vCalendar,history:vHistory,updates:vUpdates,admin:vAdmin})[view]||vClub)(tbl,pos)}
  <p class="muted" style="margin:28px 0 0;text-align:center;font-size:13px">Official sponsor \u2014 <a href="https://upnorthplumbing.com/" target="_blank" rel="noopener sponsored" style="color:var(--c-blue);font-weight:700;text-decoration:underline;text-underline-offset:3px">UpNorthPlumbing</a></p>
  <div style="margin-top:14px;text-align:center"><a class="btn coffee" href="https://buymeacoffee.com/tictactoekai" target="_blank" rel="noopener">\u2615 Enjoying TacTicToe? Buy me a coffee</a></div>
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
  return `${howTo(newish)}${sponsorBanner()}${janSoon?`<div class="janbanner"><b>\ud83d\udcb0 January transfer window opens next month.</b> The board will hand you \u00a330m to spend \u2014 start planning your signings.</div>`:""}<div class="grid2">
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
function leagueTableHTML(tbl){
  return `<div class="tablewrap"><table><thead><tr><th>#</th><th class="team">Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead><tbody>
  ${tbl.map((r,i)=>{const t=teamInfo(r.id);return `<tr class="${r.id==="you"?"me":""} ${i<4?"ucl":""} ${i>=tbl.length-3?"rel":""}"><td>${i+1}</td><td class="team"><span class="tn">${crest(t.c1,t.c2,t.short,18)}<span>${esc(t.name)}</span></span></td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf-r.ga>0?"+":""}${r.gf-r.ga}</td><td><b>${r.pts}</b></td></tr>`}).join("")}
  </tbody></table></div>`;
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
        <li><b>Open packs</b> — go to <b>Packs</b>. You start with <b>£75m</b>. <b>Bronze, Silver, Gold</b> and <b>Elite</b> packs give real players (all rated 80+); every pack also has a rare chance of a <b>Future Prospect</b> — a teal wonderkid rated 82 that gains +1 every season. Keep opening until you have at least 11.</li>
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
    <div class="row" style="justify-content:space-between"><h2 style="font-size:36px">Pack store</h2><span class="muted">Squad ${S.squad.length}/${MAX_SQUAD}</span></div>
    <div class="packs">${PACKS.map(p=>`
      <article class="pack">
        <div class="foil ${p.foil}"><span>${p.name}</span></div>
        <div class="row" style="justify-content:space-between"><h3>${p.name} pack</h3><span class="price">${money(p.price)}</span></div>
        <ul>${p.desc.map(d=>`<li>${d}</li>`).join("")}</ul>
        <button class="btn primary" data-act="buy" data-pack="${p.id}" ${S.budget<p.price||S.squad.length+p.count>MAX_SQUAD?"disabled":""}>${S.budget<p.price?"Need "+money(p.price-S.budget)+" more":S.squad.length+p.count>MAX_SQUAD?"Squad full":"Open pack"}</button>
      </article>`).join("")}</div>
    ${S.squad.length>=MAX_SQUAD?`<div class="panel row" style="justify-content:space-between"><span>Your squad is full (${MAX_SQUAD} players). Win matches to earn more, but you have a full roster to pick from.</span><button class="btn" data-view="squad">Go to squad</button></div>`:`<div class="prospecttip"><b>\u2b50 Future Prospect cards</b> \u2014 every pack has a rare chance to pull a purple Future Prospect (Kroupi, Rayan, Ant\u00f3nio Silva, Archie Gray, Diomande, Dowman, Ngumoha, JJ Gabriel). They start rated 82 and gain +1 overall every season you play \u2014 raw talent that grows with you.</div><div class="ucltip"><b>\u2b50 Europe\u2019s Finest cards</b> \u2014 the rarest pull of all. Only <b>Elite</b> packs can contain a blue Europe\u2019s Finest superstar \u2014 roughly one in every ten Elite packs \u2014 with continental icons like Mbapp\u00e9, Yamal, Kane, Demb\u00e9l\u00e9, Bellingham and Lautaro.</div><p class="muted" style="margin:0">Players you pack are yours to keep — build the deepest squad you can across the season.</p>`}
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
  {tag:"NEW", accent:"var(--loss)", date:"Latest", title:"Injuries & the Treatment Room",
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
   items:["Start rated 82 and gain +1 overall every single season you play.","Recoloured from teal to deep purple so they’re clearly different from Europe’s Finest.","Any pack has a small chance to contain one."]},
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
    <p class="muted" style="margin:6px 0 0;font-size:13px">Got an idea or found a bug? These updates come from player feedback — keep it coming.</p>
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
  ${leagueTableHTML(tbl)}<p class="muted" style="margin:0;font-size:13px">Green: top four. Red: bottom three.</p></section>`;
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
    cells+=`<div class="cday match ${e.comp}${e.isNext?" next":""}${e.k?" r"+e.k:""}${past?" past":""}" title="${esc(t.name)} (${e.comp==="cup"?"League Cup":"Premier League"})">
      <span class="ctop"><span class="cdn">${dn}</span><span class="ctag ${e.comp}">${e.comp==="cup"?"CUP":"LGE"}</span></span>
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
    const isCup=ne.type==="cup", t=isCup?ne.tie:null;
    const home=isCup?(t.name==="Final"?true:t.home):(myFixture(S.round).m[0]==="you");
    const oppId=isCup?t.opp:(home?myFixture(S.round).m[1]:myFixture(S.round).m[0]);
    const opp=teamInfo(oppId), d=isCup?new Date(cupDate(t.week)):mDateObj(S.round);
    const comp=isCup?("League Cup \u00b7 "+t.name):("Matchday "+(S.round+1));
    const filled=S.xi.filter(Boolean).length;
    head=`<div class="calhead ${isCup?"cuphead":""}"><div style="min-width:0"><span class="eyebrow">Next up \u00b7 ${CAL_WD[d.getUTCDay()]} ${d.getUTCDate()} ${CAL_MO[d.getUTCMonth()]} \u00b7 <b style="color:${isCup?"var(--elite)":"var(--flood)"}">${esc(comp)}</b></span>
      <div class="cal-next">${crest(opp.c1,opp.c2,opp.short,26)}<span>${esc(opp.name)}</span><span class="muted" style="font-weight:400">${isCup&&t.name==="Final"?"Neutral":home?"Home":"Away"}</span></div>
      ${filled<11?`<span class="muted" style="font-size:13px">${11-filled} empty slot${filled===10?"":"s"} \u2014 a youth player fills in.</span>`:""}</div>
      <button class="btn primary" data-act="play">Advance \u25b6</button></div>`;
  }
  const ev=calEvents();
  const nowMs = ne ? (ne.type==="cup"? cupDate(ne.tie.week) : mDateObj(S.round).getTime()) : (seasonStart()+(S.fixtures.length)*7*864e5);
  const nd=new Date(nowMs), nowDay=Date.UTC(nd.getUTCFullYear(),nd.getUTCMonth(),nd.getUTCDate());
  const startD=new Date(seasonStart()), lastD=new Date(seasonStart()+(S.fixtures.length-1)*7*864e5);
  let grids="";
  for(let d=new Date(Date.UTC(startD.getUTCFullYear(),startD.getUTCMonth(),1)); d<=lastD; d=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,1)))
    grids+=monthGrid(d.getUTCFullYear(),d.getUTCMonth(),ev,nowDay);
  const cup=S.cup, cupLine = cup? (cup.won?"\ud83c\udfc6 League Cup WINNERS":cup.out?"League Cup \u00b7 knocked out ("+cup.rounds[cup.idx].name+")":"League Cup \u00b7 "+cup.rounds[cup.idx].name) : "";
  return `<section class="stack">
    <div class="row" style="justify-content:space-between"><h2 style="font-size:36px">Calendar</h2><span class="muted">Season ${S.season} \u00b7 ${2025+S.season}/${String(26+S.season).padStart(2,"0")}</span></div>
    ${head}
    <div class="callegend"><span><i class="lg league"></i>League</span><span><i class="lg cup"></i>League Cup</span><span>${esc(cupLine)}</span></div>
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

