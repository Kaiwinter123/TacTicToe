/* ---------- squad logic ---------- */
const byId = id => S.squad.find(p=>p.id===id);
const isInjured = p => !!(p && p.inj && p.inj.games>0);
const injuredSquad = () => S.squad.filter(isInjured);
function slots(){ return FORMATIONS[S.formation] }
function effective(p,slotPos){ if(!p) return 0; return p.pos===slotPos? p.ovr : p.ovr - (p.pos==="GK"||slotPos==="GK"?35:12) }
function autoPick(){
  const used=new Set(), sl=slots(), xi=sl.map(()=>null), fit=p=>!used.has(p.id)&&!isInjured(p);
  sl.forEach(([pos],i)=>{
    const best=S.squad.filter(p=>fit(p)&&p.pos===pos).sort((a,b)=>b.ovr-a.ovr)[0];
    if(best){used.add(best.id); xi[i]=best.id}
  });
  sl.forEach(([pos],i)=>{
    if(xi[i]) return;
    const best=S.squad.filter(fit).sort((a,b)=>effective(b,pos)-effective(a,pos))[0];
    if(best){used.add(best.id); xi[i]=best.id}
  });
  S.xi = xi;
}
// Best fit, uninjured bench player for a given slot position (or null).
function bestFitFor(pos){
  const inXI=new Set(S.xi.filter(Boolean));
  return S.squad.filter(p=>!inXI.has(p.id)&&!isInjured(p)).sort((a,b)=>effective(b,pos)-effective(a,pos))[0]||null;
}
function teamRatings(){
  const g={GK:[],DEF:[],MID:[],FWD:[]};
  slots().forEach(([pos],i)=>{ const p=byId(S.xi[i]); g[pos].push(p?Math.max(CARE-4,effective(p,pos)):CARE) });
  const avg = a => a.length? a.reduce((x,y)=>x+y,0)/a.length : CARE;
  const all = [].concat(g.GK,g.DEF,g.MID,g.FWD);
  const fl = v => Math.max(CARE-2, v);
  return {
    att: fl(0.6*avg(g.FWD)+0.4*avg(g.MID)),
    def: fl(0.45*avg(g.DEF)+0.3*avg(g.GK)+0.25*avg(g.MID)),
    ovr: fl(avg(all))
  };
}
function ratingsFor(id){
  if(id==="you") return teamRatings();
  const t=S.teams.find(t=>t.id===id); return {att:t.str+1,def:t.str-1,ovr:t.str};
}
function teamInfo(id){
  if(id==="you") return {name:S.club.name,short:S.club.short,c1:S.club.c1,c2:S.club.c2};
  return S.teams.find(t=>t.id===id);
}
function lambdas(h,a){
  const H=ratingsFor(h), A=ratingsFor(a);
  return [clamp(1.4*Math.exp((H.att-A.def)/19)*1.08,.2,3.3), clamp(1.4*Math.exp((A.att-H.def)/19)*.92,.2,3.3)];
}

/* ---------- table ---------- */
function table(){
  const rows={};
  ["you"].concat(S.teams.map(t=>t.id)).forEach(id=>rows[id]={id,p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0,form:[]});
  S.results.forEach((res,r)=>res.forEach((sc,i)=>{
    if(!sc) return;
    const [h,a]=S.fixtures[r][i], H=rows[h], A=rows[a];
    H.p++;A.p++;H.gf+=sc[0];H.ga+=sc[1];A.gf+=sc[1];A.ga+=sc[0];
    if(sc[0]>sc[1]){H.w++;A.l++;H.pts+=3;H.form.push("W");A.form.push("L")}
    else if(sc[0]<sc[1]){A.w++;H.l++;A.pts+=3;H.form.push("L");A.form.push("W")}
    else{H.d++;A.d++;H.pts++;A.pts++;H.form.push("D");A.form.push("D")}
  }));
  return Object.values(rows).sort((x,y)=>y.pts-x.pts||(y.gf-y.ga)-(x.gf-x.ga)||y.gf-x.gf||teamInfo(x.id).name.localeCompare(teamInfo(y.id).name));
}
function simRound(r,skip){
  return S.fixtures[r].map(([x,y],k)=>{ if(x==="bye"||y==="bye") return null; if(k===skip) return null; const [l1,l2]=lambdas(x,y); return [poisson(l1),poisson(l2)] });
}
// Rounds where your club sits out are played in the background.
function advanceByes(){
  let n=0;
  while(S.round<S.fixtures.length && myFixture(S.round).m.includes("bye")){ S.results[S.round]=simRound(S.round,-1); S.round++; n++ }
  return n;
}
function myFixture(r){ const i=S.fixtures[r].findIndex(m=>m.includes("you")); return {i,m:S.fixtures[r][i]} }

/* ---------- visuals ---------- */
let _cid=0;
function crest(c1,c2,txt,size=40){
  const t=esc((txt||"").slice(0,3));
  const club=CLUBS.find(c=>c[1]===txt && String(c[2]).toLowerCase()===String(c1).toLowerCase());
  const c3=club?c3of(txt):"", animal=club?animalOf(txt):"";
  const id="cr"+(++_cid), shield="M20 1 L38 6 V22 C38 34 30 41 20 45 C10 41 2 34 2 22 V6 Z";
  const bands = c3
    ? `<rect x="0" width="14" height="46" fill="${esc(c1)}"/><rect x="14" width="12" height="46" fill="${esc(c3)}"/><rect x="26" width="14" height="46" fill="${esc(c2)}"/>`
    : `<rect x="0" width="20" height="46" fill="${esc(c1)}"/><rect x="20" width="20" height="46" fill="${esc(c2)}" opacity=".95"/>`;
  const emblem = animal
    ? `<circle cx="20" cy="21" r="12" fill="rgba(5,9,16,.5)"/><text x="20" y="21" text-anchor="middle" dominant-baseline="central" font-size="18">${animal}</text>`
    : `<rect x="5" y="17" width="30" height="11" rx="2" fill="rgba(5,9,16,.8)"/><text x="20" y="25.6" text-anchor="middle" font-family="Barlow Condensed,Arial Narrow,sans-serif" font-weight="700" font-size="9" fill="#fff" letter-spacing=".5">${t}</text>`;
  return `<svg width="${size}" height="${size*1.15}" viewBox="0 0 40 46" aria-hidden="true"><defs><clipPath id="${id}"><path d="${shield}"/></clipPath></defs><g clip-path="url(#${id})">${bands}${emblem}</g><path d="${shield}" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="1.5"/></svg>`;
}
function shirt(c1,c2){
  return `<svg viewBox="0 0 64 56" aria-hidden="true"><path d="M22 3 L10 7 L1 20 L10 26 L14 21 L14 54 L50 54 L50 21 L54 26 L63 20 L54 7 L42 3 C40 8 36 10 32 10 C28 10 24 8 22 3Z" fill="${esc(c1)}" stroke="rgba(0,0,0,.35)" stroke-width="1.2" stroke-linejoin="round"/><path d="M10 7 L1 20 L10 26 L14 21 L14 12Z M54 7 L63 20 L54 26 L50 21 L50 12Z" fill="${esc(c2)}" opacity=".95"/><path d="M22 3 C24 8 28 10 32 10 C36 10 40 8 42 3 L39 2 C37 6 35 7 32 7 C29 7 27 6 25 2Z" fill="${esc(c2)}"/></svg>`;
}
const surname = n => n.includes(" ") ? n.slice(n.indexOf(" ")+1) : n;
function mix(a,b,t){const h=x=>{x=x.replace("#","");if(x.length===3)x=x.split("").map(c=>c+c).join("");return [0,2,4].map(i=>parseInt(x.slice(i,i+2),16))};const A=h(a),B=h(b);return "#"+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,"0")).join("")}
const RLABEL={bronze:"Bronze",silver:"Silver",gold:"Gold",elite:"Elite"};
function card(p,opts={}){
  const r=p.ucl?"ucl":p.prospect?"prospect":rarity(p.ovr), c=clubOf(p);
  const k1 = p.ucl?p.k1:(c?c[2]:S?S.club.c1:"#888"), k2 = p.ucl?p.k2:(c?c[3]:S?S.club.c2:"#444");
  const ink = readable(mix(k1,"#000000",.15)), panel = ink==="#ffffff"?"rgba(0,0,0,.3)":"rgba(255,255,255,.45)";
  const at = Object.entries(p.a||{}), cr = p.ucl?crest(p.k1,p.k2,p.csh,opts.sm?16:22):(c?crest(c[2],c[3],c[1],opts.sm?16:22):S?crest(S.club.c1,S.club.c2,S.club.short,opts.sm?16:22):"");
  return `<button type="button" class="card ${r} ${opts.sm?"sm":""} ${opts.sel?"sel":""} ${opts.subin?"subin":""}" style="--k1:${esc(k1)};--k2:${esc(k2)};--k3:${esc(c?c3of(c[1])||k2:k2)};--ink:${ink};--panel:${panel}" ${opts.act?`data-act="${opts.act}" data-id="${p.id}"`:"tabindex=-1"} aria-label="${esc(p.n)}, ${p.pos}, rated ${p.ovr}${c?", "+esc(c[0]):""}">
    <div class="top"><div class="lhs"><div class="ovr num">${p.ovr}${p.prospect?'<span class="rise">\u25b2</span>':''}</div><div class="pos">${p.pos}</div>${cr}</div><span class="rar">${p.ucl?"FINEST":p.prospect?"PROSPECT":RLABEL[r]}</span></div>
    <div class="face">${shirt(k1,k2)}</div>
    <div class="pname" title="${esc(p.n)}">${esc(surname(p.n))}</div>
    ${(p.prospect||p.ucl)&&!opts.sm?`<div class="pnote">${p.prospect?"\u2605 Future prospect \u00b7 +1 OVR every season":"\u2605 Europe\u2019s Finest \u00b7 continental elite"}</div>`:""}
    <div class="attrs">${at.map(([k,v])=>`<div><b>${v}</b><span>${k}</span></div>`).join("")}</div>
    <div class="foot"><span>${p.ucl?esc(p.cname):c?esc(c[0]):"Academy"}</span></div>
    ${opts.tag?`<span class="tag">${opts.tag}</span>`:""}
  </button>`;
}
let toastT;
function toast(msg){
  let t=$(".toast"); if(!t){t=document.createElement("div");t.className="toast";t.setAttribute("role","status");document.body.appendChild(t)}
  t.textContent=msg; t.hidden=false; clearTimeout(toastT); toastT=setTimeout(()=>t.hidden=true,2600);
}

