import { useState, useEffect, useCallback } from "react";

const CL={orange:"#F26A36",navy:"#13294B",offwhite:"#F7F7F7"};
const ROLES={
  admin:{label:"Admin",color:"#7C3AED",icon:"🛡️"},
  vp:{label:"Vice President",color:"#13294B",icon:"⭐"},
  rsm:{label:"Cooper RSM",color:"#F26A36",icon:"🏢"},
  owner:{label:"Agency Owner",color:"#2563EB",icon:"🏬"},
  staff:{label:"Agency Staff",color:"#059669",icon:"👤"},
};
const USERS=[
  {id:1,email:"admin@cooperlighting.com",password:"COOPER2025",role:"admin",name:"System Admin",agency:"Cooper HQ"},
  {id:2,email:"vp.east@cooperlighting.com",password:"COOPER2025",role:"vp",name:"Michael Torres",agency:"Cooper HQ"},
  {id:3,email:"rsm.pacific@cooperlighting.com",password:"COOPER2025",role:"rsm",name:"David Park",agency:"Cooper HQ"},
  {id:4,email:"rsm.ne@cooperlighting.com",password:"COOPER2025",role:"rsm",name:"Emily Walsh",agency:"Cooper HQ"},
  {id:5,email:"owner@west1.com",password:"COOPER2025",role:"owner",name:"Patrick Sullivan",agency:"Illumination Systems"},
  {id:6,email:"owner@ne1.com",password:"COOPER2025",role:"owner",name:"George Hart",agency:"Chesapeake"},
  {id:7,email:"owner@gulf1.com",password:"COOPER2025",role:"owner",name:"Marcus Bell",agency:"Premier"},
];

// Agency → RSM / VP / Owner directory
const AGENCY_DIRECTORY={
  "HI TECH":              {rsm:"David Park",   vp:"Steve Lennox",     owner:"",                region:"Canada"},
  "Medgar":               {rsm:"David Park",   vp:"Steve Lennox",     owner:"",                region:"Canada"},
  "Illumination Systems": {rsm:"David Park",   vp:"Mark Holter",      owner:"Patrick Sullivan",region:"Pacific"},
  "CAL":                  {rsm:"David Park",   vp:"Mark Holter",      owner:"",                region:"Pacific"},
  "Chesapeake":           {rsm:"Emily Walsh",  vp:"Robert Spilatore", owner:"George Hart",     region:"Northeast"},
  "Reflex Boston":        {rsm:"Emily Walsh",  vp:"Robert Spilatore", owner:"",                region:"Northeast"},
  "Premier":              {rsm:"Emily Walsh",  vp:"Jared Lee",        owner:"Marcus Bell",     region:"Gulf"},
  "2M":                   {rsm:"Emily Walsh",  vp:"Jared Lee",        owner:"",                region:"Gulf"},
  "Ardd + Winter TN":     {rsm:"David Park",   vp:"Austin Childs",    owner:"",                region:"Southeast"},
  "Tampa Bay Lighting":   {rsm:"David Park",   vp:"Austin Childs",    owner:"",                region:"Southeast"},
  "Mlazgar":              {rsm:"Emily Walsh",  vp:"Eric Eshebauhg",   owner:"",                region:"Central"},
  "Clarus":               {rsm:"Emily Walsh",  vp:"Eric Eshebauhg",   owner:"",                region:"Central"},
};
const SEG=[
  {key:"stock",label:"Stock",color:"#2563EB",icon:"📦",criteria:[
    {key:"cr",name:"Customer Relations",levels:["No direct relationships","< 3 relationships","4–7 relationships","7+ relationships"]},
    {key:"lm",name:"Lead Management",levels:["Track territory stock","Engage CLS managers","Track stock/Market Pro","Documented CRM targets"]},
    {key:"mkt",name:"Marketing Presence",levels:["Basic collateral","Training courses","Marketing fund usage","Buying Group proficiency"]},
    {key:"qt",name:"Quoting & Pricing",levels:["Basic price knowledge","Walkaway Pricing adopted","Differentiated approach","Top 10 promo performance"]},
    {key:"tl",name:"Tool Utilization",levels:["PLM in Prism","Basic EDI knowledge","Promotes EDI actively","NPI/MRAM kits deployed"]},
    {key:"org",name:"Org Alignment",levels:["Stock leader defined","Outside sales dedicated","Online presence reviewed","Inside sales assigned"]},
  ]},
  {key:"spec",label:"Specification",color:"#7C3AED",icon:"📐",criteria:[
    {key:"cr",name:"Customer Relations",levels:["No relationships","< 3 relationships","4–7 relationships","7+ relationships"]},
    {key:"lm",name:"Lead Management",levels:["Reactive only","Proactive, no CC","Project tracking + CC","Specific firm goals"]},
    {key:"mkt",name:"Marketing Presence",levels:["No events","Periodic offsite events","Non-standard events","Events at agency office"]},
    {key:"qt",name:"Quoting & Pricing",levels:["Process orders","Expediting orders","Good communication","PM team integral"]},
    {key:"tl",name:"LEX Utilization",levels:["Not using LEX","Aware, not using","LEX proficient","All NPIs carouseled"]},
    {key:"ed",name:"Education",levels:["Can't cross products","Basic product crossing","Full package cross","Full layout utilization"]},
    {key:"org",name:"Org Alignment",levels:["Crossing specs only","Seldom use CLS app","Use CLS app regularly","Internal layout staff"]},
    {key:"sow",name:"Share of Wallet",levels:["< 1 brand proficient","1 brand proficient","2 brands proficient","All APG brands active"]},
  ]},
  {key:"industrial",label:"Industrial",color:"#D97706",icon:"🏭",criteria:[
    {key:"cr",name:"Customer Relations",levels:["No relationships","< 3 relationships","4–7 relationships","7+ relationships"]},
    {key:"lm",name:"Lead Management",levels:["Reactive only","National accounts","Targeted list + Nemalux","Enterprise + collaborative"]},
    {key:"mkt",name:"Marketing Presence",levels:["Basic understanding","Industry events","Dedicated quotes team","Internal design team"]},
    {key:"qt",name:"Quoting & Pricing",levels:["App team usage","Local references","Dedicated quotes","Connected systems"]},
    {key:"tl",name:"Tool Utilization",levels:["Basic CLS tools","Utility rebates","All CLS tools","Lead gen + pipeline mgmt"]},
    {key:"ed",name:"Education",levels:["Product training","Competitive cross","Inverter/emergency","Controls (WLX Lite)"]},
    {key:"org",name:"Org Alignment",levels:["Industrial leader ID'd","In-house CLS design","MWS quote resources","Internal audit resources"]},
  ]},
  {key:"connected",label:"Connected",color:"#059669",icon:"💡",criteria:[
    {key:"cr",name:"Customer Relations",levels:["No relationships","< 3 relationships","4–7 relationships","7+ as SME/advisor"]},
    {key:"lm",name:"Lead Management",levels:["Pipeline developed","Construct Connect","Bi-weekly reviews","Pre-wire meetings"]},
    {key:"mkt",name:"Marketing Presence",levels:["IES associations","Social media active","Demo cases built","Commissioning demos"]},
    {key:"qt",name:"Quoting & Pricing",levels:["App team usage","Quotes < $50K","Quotes > $50K","Full WLX quoting"]},
    {key:"tl",name:"Tool Utilization",levels:["Controls training","SPEC 360 proficient","CAD/Bluebeam tools","SFDC/CRM integrated"]},
    {key:"ed",name:"Education",levels:["No controls team","Competitor knowledge","WLX certified","Benchmark/mentor role"]},
    {key:"org",name:"Org Alignment",levels:["Controls champion","Controls specialist","Full controls team","Industry speaker"]},
  ]},
];
const AGENCIES=["HI TECH","Medgar","Illumination Systems","CAL","Chesapeake","Reflex Boston","Premier","2M","Ardd + Winter TN","Tampa Bay Lighting","Mlazgar","Clarus"];
const MATURITY={1:{label:"Emerging",color:"#EF4444"},2:{label:"Developing",color:"#F59E0B"},3:{label:"Proficient",color:"#22C55E"},4:{label:"Advanced",color:"#059669"}};
const matLvl=p=>p<0.5?1:p<0.71?2:p<0.90?3:4;
const TOTAL_C=SEG.reduce((a,s)=>a+s.criteria.length,0);
const segPct=(sc,ag,sk)=>{const s=SEG.find(x=>x.key===sk);let t=0,mx=0;s.criteria.forEach(c=>{const v=sc[ag]?.[sk+"_"+c.key]??0;if(v>0)t+=v;mx+=4;});return{total:t,max:mx,pct:mx>0?t/mx:0};};
const overallPct=(sc,ag)=>{let t=0,mx=0;SEG.forEach(s=>{const p=segPct(sc,ag,s.key);t+=p.total;mx+=p.max;});return{total:t,max:mx,pct:mx>0?t/mx:0};};
const filledCount=(sc,ag)=>SEG.reduce((a,s)=>a+s.criteria.filter(c=>(sc[ag]?.[s.key+"_"+c.key]??0)>0).length,0);
const nowTs=()=>{const n=new Date();return n.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})+" · "+n.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});};
const seedScores=()=>{const s={};AGENCIES.forEach(a=>{s[a]={};SEG.forEach(seg=>{seg.criteria.forEach(c=>{s[a][seg.key+"_"+c.key]=Math.random()>0.4?Math.ceil(Math.random()*4):0;});});});return s;};

const Badge=({label,color})=>(
  <span style={{background:color+"18",color,border:"1px solid "+color+"40",borderRadius:6,fontSize:11,fontWeight:700,padding:"2px 8px",whiteSpace:"nowrap"}}>{label}</span>
);
const PBar=({pct,color,h=6})=>(
  <div style={{background:"#E7E7E7",borderRadius:h,height:h,overflow:"hidden"}}>
    <div style={{width:Math.round(pct*100)+"%",height:"100%",background:color,borderRadius:h,transition:"width 0.5s"}}/>
  </div>
);
const MatBadge=({pct})=>{const m=MATURITY[matLvl(pct)];return <Badge label={"L"+matLvl(pct)+" "+m.label} color={m.color}/>;};
const Card=({children,style={}})=><div style={{background:"#fff",borderRadius:12,border:"1px solid #E7E7E7",boxShadow:"0 2px 6px rgba(0,0,0,0.04)",...style}}>{children}</div>;
const ST=({children})=><div style={{fontSize:10,fontWeight:800,color:"#9F9F9F",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>{children}</div>;

function RadarChart({data,color}){
  const N=data.length,cx=110,cy=100,R=75;
  const angles=data.map((_,i)=>(i/N)*2*Math.PI-Math.PI/2);
  const toXY=(a,r)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
  const pts=data.map((d,i)=>toXY(angles[i],(d.value/100)*R));
  return(
    <svg viewBox="0 0 220 200" style={{width:"100%",height:180}}>
      {[0.25,0.5,0.75,1].map(l=><polygon key={l} points={angles.map(a=>toXY(a,R*l).join(",")).join(" ")} fill="none" stroke="#E7E7E7" strokeWidth="1"/>)}
      {angles.map((a,i)=>{const [x,y]=toXY(a,R);return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#E7E7E7" strokeWidth="1"/>;} )}
      <polygon points={pts.map(p=>p.join(",")).join(" ")} fill={color} fillOpacity="0.18" stroke={color} strokeWidth="2"/>
      {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3" fill={color}/>)}
      {data.map((d,i)=>{const [x,y]=toXY(angles[i],R+16);return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" fill="#555">{d.label}</text>;})}
    </svg>
  );
}

// ── TEST USERS — no auth required ──────────────────────────
const TEST_USERS=[
  {id:"test-admin",name:"System Admin",email:"admin@cooperlighting.com",role:"admin",agency:"Cooper HQ"},
  {id:"test-vp",name:"Michael Torres",email:"vp@cooperlighting.com",role:"vp",agency:"Cooper HQ"},
  {id:"test-rsm1",name:"David Park",email:"rsm.pacific@cooperlighting.com",role:"rsm",agency:"Cooper HQ"},
  {id:"test-rsm2",name:"Emily Walsh",email:"rsm.ne@cooperlighting.com",role:"rsm",agency:"Cooper HQ"},
  {id:"test-owner1",name:"Patrick Sullivan",email:"owner@west1.com",role:"owner",agency:"Illumination Systems"},
  {id:"test-owner2",name:"George Hart",email:"owner@ne1.com",role:"owner",agency:"Chesapeake"},
  {id:"test-owner3",name:"Marcus Bell",email:"owner@gulf1.com",role:"owner",agency:"Premier"},
  {id:"test-staff",name:"Agency Staff",email:"staff@west1.com",role:"staff",agency:"Illumination Systems"},
];

function LoginPage({onLogin}){
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:CL.navy,fontFamily:"Montserrat,sans-serif"}}>
      <div style={{background:"#fff",borderRadius:20,width:440,overflow:"hidden",boxShadow:"0 24px 64px rgba(0,0,0,0.35)"}}>
        {/* Header */}
        <div style={{background:CL.orange,padding:"26px 32px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:10,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,color:"#fff"}}>CL</div>
            <div>
              <div style={{color:"#fff",fontWeight:900,fontSize:17}}>Agent Excellence</div>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,fontWeight:600}}>Cooper Lighting Solutions</div>
            </div>
          </div>
        </div>
        {/* Body */}
        <div style={{padding:"26px 32px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#F59E0B"}}/>
            <div style={{fontSize:11,fontWeight:800,color:"#D97706",textTransform:"uppercase",letterSpacing:"0.1em"}}>Testing Mode — No Login Required</div>
          </div>
          <div style={{fontSize:13,color:"#888",marginBottom:20}}>Select any role to enter the portal</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {TEST_USERS.map(u=>{
              const r=ROLES[u.role];
              return(
                <button key={u.id} onClick={()=>onLogin(u)} style={{
                  display:"flex",alignItems:"center",gap:12,padding:"12px 16px",
                  border:"2px solid #E7E7E7",borderRadius:10,background:"#fff",
                  cursor:"pointer",textAlign:"left",fontFamily:"Montserrat,sans-serif",
                  transition:"all 0.15s"
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=r.color;e.currentTarget.style.background=r.color+"08";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#E7E7E7";e.currentTarget.style.background="#fff";}}>
                  <div style={{width:36,height:36,borderRadius:9,background:r.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{r.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:800,fontSize:13,color:CL.navy}}>{u.name}</div>
                    <div style={{fontSize:11,color:"#aaa",marginTop:1}}>{u.agency} · {u.email}</div>
                  </div>
                  <Badge label={r.label} color={r.color}/>
                </button>
              );
            })}
          </div>
          <div style={{marginTop:18,padding:"10px 14px",background:"#FFF7ED",borderRadius:8,border:"1px solid #FED7AA",fontSize:11,color:"#92400E",fontWeight:600,textAlign:"center"}}>
            ⚠️ Testing mode — swap in real Supabase Auth before going live
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({scores}){
  const agStats=AGENCIES.map(a=>{
    const segScores=SEG.map(s=>({key:s.key,pct:segPct(scores,a,s.key).pct,color:s.color}));
    return{name:a,pct:overallPct(scores,a).pct,segScores,topOpp:segScores.reduce((lo,s)=>s.pct<lo.pct?s:lo,segScores[0])};
  }).sort((a,b)=>b.pct-a.pct);
  const segAvgs=SEG.map(s=>{const avg=AGENCIES.map(a=>segPct(scores,a,s.key).pct).reduce((t,x)=>t+x,0)/AGENCIES.length;return{...s,avg};});
  const teamAvg=agStats.reduce((t,a)=>t+a.pct,0)/agStats.length;
  const trendMonths=["Oct","Nov","Dec","Jan","Feb","Mar","Apr"];
  const radarData=SEG.map(s=>({label:s.label.substring(0,4),value:Math.round(segAvgs.find(x=>x.key===s.key).avg*100)}));
  return(
    <div style={{padding:24}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,fontWeight:800,color:"#9F9F9F",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>Cooper Lighting Solutions</div>
        <div style={{fontSize:24,fontWeight:900,color:CL.navy}}>Agency Excellence Dashboard</div>
        <div style={{fontSize:13,color:"#888",marginTop:2}}>Network overview · {AGENCIES.length} agencies · Q2 2026</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[{label:"Team Avg Score",value:Math.round(teamAvg*100)+"%",sub:MATURITY[matLvl(teamAvg)].label,color:CL.orange,icon:"📈"},
          {label:"Active Actions",value:"20",sub:"across all windows",color:"#059669",icon:"✅"},
          {label:"In Progress",value:"8",sub:"1 overdue",color:"#D97706",icon:"⏱"},
          {label:"Active Challenges",value:"4",sub:"incentive programs",color:"#7C3AED",icon:"🏆"}].map(s=>(
          <Card key={s.label} style={{padding:"16px 18px",display:"flex",alignItems:"flex-start",gap:12}}>
            <div style={{width:44,height:44,borderRadius:12,background:s.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.icon}</div>
            <div><div style={{fontSize:26,fontWeight:900,color:CL.navy,lineHeight:1}}>{s.value}</div><div style={{fontSize:11,fontWeight:700,color:"#555",marginTop:2}}>{s.label}</div><div style={{fontSize:10,color:"#aaa",marginTop:1}}>{s.sub}</div></div>
          </Card>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
        <Card style={{padding:20}}>
          <ST>Network Score Trend — 7 Months</ST>
          <div style={{position:"relative",height:180}}>
            {[25,50,75].map(v=>(
              <div key={v} style={{position:"absolute",left:0,right:0,top:(100-(v-20)/60*100)+"%",display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontSize:9,color:"#ccc",fontWeight:700,width:20,textAlign:"right",flexShrink:0}}>{v}</span>
                <div style={{flex:1,borderTop:"1px dashed #F0F0F0"}}/>
              </div>
            ))}
            <div style={{position:"absolute",left:28,right:0,top:0,bottom:0}}>
              {[...SEG.map(s=>{const base=segAvgs.find(x=>x.key===s.key).avg;return{key:s.key,color:s.color,pts:trendMonths.map((_,i)=>Math.round((base*0.6+base*0.4*(i/6))*100)),dash:""};
              }),{key:"overall",color:CL.orange,pts:trendMonths.map((_,i)=>Math.round((teamAvg*0.6+teamAvg*0.4*(i/6))*100)),dash:"6,3"}].map(s=>{
                const min=20,max=80;
                const points=s.pts.map((v,i)=>[(i/(s.pts.length-1))*100,(1-(v-min)/(max-min))*100].join(",")).join(" ");
                return(
                  <svg key={s.key} viewBox="0 0 100 100" preserveAspectRatio="none" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
                    <polyline points={points} fill="none" stroke={s.color} strokeWidth={s.key==="overall"?"2.5":"1.8"} strokeDasharray={s.dash} vectorEffect="non-scaling-stroke"/>
                  </svg>
                );
              })}
            </div>
            <div style={{position:"absolute",left:28,bottom:-18,right:0,display:"flex",justifyContent:"space-between"}}>
              {trendMonths.map(m=><span key={m} style={{fontSize:9,color:"#ccc",fontWeight:700}}>{m}</span>)}
            </div>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:24}}>
            {[...SEG.map(s=>({label:s.label,color:s.color})),{label:"Overall",color:CL.orange}].map(s=>(
              <div key={s.label} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:16,height:2.5,background:s.color,borderRadius:2}}/>
                <span style={{fontSize:10,fontWeight:700,color:"#888"}}>{s.label}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{padding:20}}>
          <ST>Segment Capability Radar</ST>
          <RadarChart data={radarData} color={CL.orange}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:4}}>
            {segAvgs.map(s=>(
              <div key={s.key} style={{padding:"8px 10px",borderRadius:8,background:s.color+"08",border:"1px solid "+s.color+"20"}}>
                <div style={{fontSize:9,fontWeight:800,color:s.color,textTransform:"uppercase",marginBottom:2}}>{s.label}</div>
                <div style={{fontSize:16,fontWeight:900,color:CL.navy}}>{Math.round(s.avg*100)}%</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card style={{padding:20}}>
          <ST>Agency Rankings — Overall Score</ST>
          {agStats.slice(0,6).map((a,i)=>(
            <div key={a.name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{width:22,height:22,borderRadius:6,background:i<3?CL.orange+"20":"#F0F0F0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:i<3?CL.orange:"#aaa",flexShrink:0}}>{i+1}</div>
              <span style={{fontSize:12,fontWeight:700,color:CL.navy,width:72,flexShrink:0}}>{a.name}</span>
              <div style={{flex:1}}><PBar pct={a.pct} color={i<3?CL.orange:CL.navy} h={6}/></div>
              <MatBadge pct={a.pct}/>
              <span style={{fontSize:12,fontWeight:900,color:CL.navy,width:38,textAlign:"right"}}>{Math.round(a.pct*100)}%</span>
            </div>
          ))}
        </Card>
        <Card style={{padding:20}}>
          <ST>Top Challenge — Q2 2026</ST>
          <div style={{background:CL.navy,borderRadius:10,padding:"16px 18px",marginBottom:12}}>
            <div style={{color:"rgba(255,255,255,0.6)",fontSize:10,fontWeight:700,textTransform:"uppercase",marginBottom:6}}>🏆 WLX Champion Agency</div>
            <div style={{color:"#fff",fontSize:14,fontWeight:800,marginBottom:4}}>First to 80% Connected Score</div>
            <div style={{color:"rgba(255,255,255,0.55)",fontSize:11,marginBottom:12}}>$5,000 fund + WLX Champion plaque</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:CL.orange+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:CL.orange}}>W</div>
              <span style={{fontSize:13,fontWeight:800,color:"#fff",flex:1}}>Illumination Systems</span>
              <span style={{fontSize:14,fontWeight:900,color:CL.orange}}>80%</span>
            </div>
            <div style={{marginTop:8,height:8,background:"rgba(255,255,255,0.12)",borderRadius:4,overflow:"hidden"}}><div style={{width:"80%",height:"100%",background:CL.orange,borderRadius:4}}/></div>
          </div>
        </Card>
      </div>
      <Card style={{padding:20}}>
        <ST>Opportunity Areas by Agency</ST>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10}}>
          {agStats.map(a=>{const seg=SEG.find(s=>s.key===a.topOpp.key);return(
            <div key={a.name} style={{padding:"10px 12px",borderRadius:10,border:"1px solid "+seg.color+"30",background:seg.color+"08"}}>
              <div style={{fontSize:11,fontWeight:800,color:CL.navy,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div>
              <div style={{fontSize:10,fontWeight:800,color:seg.color}}>↑ {seg.label}</div>
              <div style={{fontSize:10,color:"#aaa",marginTop:2}}>{Math.round(a.topOpp.pct*100)}% now</div>
            </div>
          );})}
        </div>
      </Card>
    </div>
  );
}

const LVL_C=["","#EF4444","#F59E0B","#3B82F6","#059669"];
const LVL_BG=["","#FEF2F2","#FFFBEB","#EFF6FF","#ECFDF5"];
const LVL_L=["","Emerging","Developing","Proficient","Advanced"];
const LVL_R=["","0–39%","40–64%","65–84%","85–100%"];

// ── Unified Scorecard + Evaluation Page ─────────────────────
// mode: "edit" = rate criteria (RSM/Admin/VP), "results" = locked read-only view
// Any user can view results; only RSM/Admin/VP can edit and lock

function ScorecardPage({scores,setScores,segKey,selAgency,setSelAgency,user,locks,setLocks,onLock}){
  const ag=selAgency||AGENCIES[0];
  const canEdit=["admin","rsm","vp"].includes(user?.role);
  const canSwitch=!["owner","staff"].includes(user?.role);
  const isLocked=locks?.[ag]||false;
  const [mode,setMode]=useState("results");
  const [activeSeg,setActiveSeg]=useState(segKey||"stock");
  const [expanded,setExpanded]=useState(null);
  const [savedFlash,setSavedFlash]=useState(false);
  const [confirmUnlock,setConfirmUnlock]=useState(false);

  const seg=SEG.find(s=>s.key===activeSeg)||SEG[0];


  // Switch to results when agency changes
  useEffect(()=>{ setMode("results"); setExpanded(null); setConfirmUnlock(false); },[ag]);
  // Switch seg when prop changes (from nav)
  useEffect(()=>{ if(segKey)setActiveSeg(segKey); },[segKey]);

  const getScore=(sk,ck)=>scores[ag]?.[sk+"_"+ck]??0;
  const setScore=(sk,ck,v)=>{
    if(isLocked||!canEdit)return;
    setScores(prev=>{
      const cur=prev[ag]?.[sk+"_"+ck]??0;
      return{...prev,[ag]:{...(prev[ag]??{}),[sk+"_"+ck]:cur===v?0:v}};
    });
  };

  const segPctLocal=(sk)=>{
    const s=SEG.find(x=>x.key===sk);let t=0,mx=0;
    s.criteria.forEach(c=>{const v=getScore(sk,c.key);if(v>0)t+=v;mx+=4;});
    return{total:t,max:mx,pct:mx>0?t/mx:0};
  };
  const overallLocal=()=>{let t=0,mx=0;SEG.forEach(s=>{const p=segPctLocal(s.key);t+=p.total;mx+=p.max;});return mx>0?t/mx:0;};
  const filledLocal=()=>SEG.reduce((a,s)=>a+s.criteria.filter(c=>getScore(s.key,c.key)>0).length,0);

  const sp=segPctLocal(activeSeg);
  const ovPct=overallLocal();
  const filled=filledLocal();
  const lvl=matLvl(sp.pct);

  const radarData=SEG.map(s=>({label:s.label.substring(0,4),value:Math.round(segPctLocal(s.key).pct*100)}));
  const barData=[...AGENCIES].map(a=>{
    const p=segPct(scores,a,activeSeg).pct;
    return{name:a.replace("Central","Ctr").replace(" ",""),val:Math.round(p*100),isSel:a===ag};
  }).sort((b,a)=>a.val-b.val);
  const barMax=Math.max(...barData.map(d=>d.val),1);

  const lockEval=()=>{
    setSavedFlash(true);
    setLocks(p=>({...p,[ag]:true}));
    setMode("results");
    if(onLock)onLock(ag,scores);
    setTimeout(()=>setSavedFlash(false),2500);
  };
  const unlockEval=()=>{ setLocks(p=>({...p,[ag]:false})); setMode("edit"); setConfirmUnlock(false); };

  const statusBadge=isLocked
    ?{label:"🔒 Locked",bg:"#ECFDF5",color:"#059669",border:"#86EFAC"}
    :mode==="edit"
    ?{label:"✏️ Editing",bg:"#FEF0E9",color:CL.orange,border:CL.orange+"60"}
    :{label:"📋 Draft",bg:"#F0F7FF",color:"#2563EB",border:"#BFDBFE"};

  return(
    <div style={{padding:24,maxWidth:1100,margin:"0 auto"}}>
      {/* ── Header ── */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:10,fontWeight:800,color:"#9F9F9F",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:4}}>Agency Scorecard — {ag}</div>
          <h1 style={{fontSize:24,fontWeight:900,color:CL.navy,margin:"0 0 4px"}}>Capability Evaluation</h1>
          <div style={{fontSize:13,color:"#888"}}>{TOTAL_C} criteria across 4 segments · {filled} scored</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          {/* Status badge */}
          <div style={{padding:"6px 14px",borderRadius:20,background:statusBadge.bg,color:statusBadge.color,border:"1.5px solid "+statusBadge.border,fontSize:12,fontWeight:800}}>{statusBadge.label}</div>
          {/* Edit / Results toggle — only for privileged roles */}
          {canEdit&&!isLocked&&(
            <div style={{display:"flex",borderRadius:9,overflow:"hidden",border:"1.5px solid #DDD"}}>
              {[{k:"results",label:"📊 Results"},{k:"edit",label:"✏️ Edit"}].map(m=>(
                <button key={m.k} onClick={()=>{setMode(m.k);setExpanded(null);}} style={{padding:"8px 16px",border:"none",background:mode===m.k?CL.navy:"#fff",color:mode===m.k?"#fff":"#888",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"Montserrat,sans-serif"}}>{m.label}</button>
              ))}
            </div>
          )}
          {/* Lock / Unlock */}
          {canEdit&&(
            isLocked?(
              confirmUnlock?(
                <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:"#FEF2F2",borderRadius:9,border:"1.5px solid #FECACA"}}>
                  <span style={{fontSize:11,fontWeight:700,color:"#DC2626"}}>Unlock & allow edits?</span>
                  <button onClick={unlockEval} style={{padding:"4px 10px",background:"#DC2626",color:"#fff",border:"none",borderRadius:6,fontWeight:700,fontSize:11,cursor:"pointer"}}>Yes, Unlock</button>
                  <button onClick={()=>setConfirmUnlock(false)} style={{padding:"4px 8px",border:"none",background:"transparent",color:"#aaa",fontWeight:600,fontSize:11,cursor:"pointer"}}>Cancel</button>
                </div>
              ):(
                <button onClick={()=>setConfirmUnlock(true)} style={{padding:"8px 16px",background:"#fff",border:"1.5px solid #DDD",borderRadius:9,color:"#888",fontWeight:700,fontSize:12,cursor:"pointer"}}>🔓 Unlock</button>
              )
            ):(
              mode==="edit"&&(
                <button onClick={lockEval} style={{padding:"8px 20px",background:savedFlash?"#059669":CL.orange,color:"#fff",border:"none",borderRadius:9,fontWeight:800,fontSize:13,cursor:"pointer",transition:"background 0.3s"}}>
                  {savedFlash?"✓ Locked & Saved!":"🔒 Lock & Save"}
                </button>
              )
            )
          )}
        </div>
      </div>

      {/* ── Overall summary bar ── */}
      <div style={{background:CL.navy,borderRadius:14,padding:"16px 24px",marginBottom:20,display:"flex",flexWrap:"wrap",gap:20,alignItems:"center"}}>
        <div style={{textAlign:"center",minWidth:90}}>
          <div style={{color:"rgba(255,255,255,0.55)",fontSize:10,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Overall</div>
          <div style={{fontSize:40,fontWeight:900,color:CL.orange,lineHeight:1}}>{Math.round(ovPct*100)}%</div>
          <div style={{marginTop:5}}><MatBadge pct={ovPct}/></div>
        </div>
        <div style={{flex:1,minWidth:200,display:"flex",flexDirection:"column",gap:7}}>
          {SEG.map(s=>{const p=segPctLocal(s.key);const segFilled=s.criteria.filter(c=>getScore(s.key,c.key)>0).length;return(
            <div key={s.key} onClick={()=>setActiveSeg(s.key)} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"4px 8px",borderRadius:7,background:activeSeg===s.key?"rgba(255,255,255,0.1)":"transparent",transition:"background 0.15s"}}>
              <span style={{fontSize:11,fontWeight:700,color:s.color,width:72,flexShrink:0}}>{s.icon} {s.label.substring(0,4)}</span>
              <div style={{flex:1,height:8,background:"rgba(255,255,255,0.1)",borderRadius:4,overflow:"hidden"}}>
                <div style={{width:Math.round(p.pct*100)+"%",height:"100%",background:s.color,borderRadius:4,transition:"width 0.4s"}}/>
              </div>
              <span style={{fontSize:12,fontWeight:900,color:"#fff",width:38,textAlign:"right"}}>{Math.round(p.pct*100)}%</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.4)",width:40,textAlign:"right"}}>{segFilled}/{s.criteria.length}</span>
            </div>
          )})}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6,minWidth:120}}>
          <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",marginBottom:2}}>Status</div>
          <div style={{padding:"6px 12px",borderRadius:8,background:statusBadge.bg,color:statusBadge.color,fontSize:11,fontWeight:800,textAlign:"center"}}>{statusBadge.label}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:2}}>{filled}/{TOTAL_C} criteria scored</div>
        </div>
      </div>

      {/* ── Segment tabs ── */}
      <div style={{display:"flex",gap:4,marginBottom:20,borderBottom:"2px solid #E7E7E7",flexWrap:"wrap"}}>
        {SEG.map(s=>{const p=segPctLocal(s.key);return(
          <button key={s.key} onClick={()=>{setActiveSeg(s.key);setExpanded(null);}} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 16px",border:"none",background:"transparent",fontWeight:700,fontSize:12,cursor:"pointer",color:activeSeg===s.key?s.color:"#aaa",borderBottom:"3px solid "+(activeSeg===s.key?s.color:"transparent"),marginBottom:-2,fontFamily:"Montserrat,sans-serif",transition:"all 0.15s"}}>
            <span>{s.icon}</span><span>{s.label}</span>
            <span style={{background:activeSeg===s.key?s.color+"18":"#F0F0F0",color:activeSeg===s.key?s.color:"#aaa",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:800}}>{Math.round(p.pct*100)}%</span>
          </button>
        );})}
      </div>

      {/* ── Main content ── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16}}>

        {/* Left: criteria list */}
        <div>
          {/* Edit mode header */}
          {mode==="edit"&&!isLocked&&canEdit&&(
            <div style={{background:CL.orange+"0E",border:"1px solid "+CL.orange+"30",borderRadius:10,padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>✏️</span>
              <div>
                <div style={{fontSize:12,fontWeight:800,color:CL.orange}}>Edit Mode — Click any level to score</div>
                <div style={{fontSize:11,color:"#888"}}>Click the same level again to clear. Lock when done.</div>
              </div>
            </div>
          )}
          {isLocked&&(
            <div style={{background:"#ECFDF5",border:"1px solid #86EFAC",borderRadius:10,padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>🔒</span>
              <div>
                <div style={{fontSize:12,fontWeight:800,color:"#059669"}}>Evaluation Locked — Read-only</div>
                <div style={{fontSize:11,color:"#888"}}>Scores are finalized. RSM/Admin can unlock to make changes.</div>
              </div>
            </div>
          )}

          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {seg.criteria.map(c=>{
              const score=getScore(activeSeg,c.key);
              const isOpen=expanded===c.key;
              if(mode==="edit"&&!isLocked&&canEdit){
                // ── EDIT ROW ──
                return(
                  <Card key={c.key} style={{overflow:"hidden",borderLeft:"3px solid "+(score>0?LVL_C[score]:"#E7E7E7")}}>
                    <div style={{padding:"12px 14px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                        <div style={{width:38,height:38,borderRadius:9,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:score>0?LVL_BG[score]:"#F7F7F7",border:"1.5px solid "+(score>0?LVL_C[score]+"40":"#E7E7E7")}}>
                          <div style={{fontSize:16,fontWeight:900,lineHeight:1,color:score>0?LVL_C[score]:"#CCC"}}>{score||"—"}</div>
                          <div style={{fontSize:8,color:score>0?LVL_C[score]:"#CCC",fontWeight:700}}>/4</div>
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:800,fontSize:13,color:CL.navy}}>{c.name}</div>
                          <div style={{fontSize:11,fontWeight:700,color:score>0?LVL_C[score]:"#CCC",marginTop:2}}>{score>0?LVL_L[score]:"Not scored yet"}</div>
                        </div>
                      </div>
                      {/* Level buttons */}
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                        {[1,2,3,4].map(l=>{const sel=score===l;return(
                          <button key={l} onClick={()=>setScore(activeSeg,c.key,l)} style={{padding:"8px 7px",borderRadius:8,border:"2px solid "+(sel?seg.color:"#DDD"),background:sel?seg.color:"#fff",color:sel?"#fff":"#666",fontSize:10,fontWeight:sel?800:600,cursor:"pointer",textAlign:"left",lineHeight:1.4,fontFamily:"Montserrat,sans-serif",transition:"all 0.15s"}}>
                            <div style={{fontWeight:800,marginBottom:2,color:sel?"#fff":LVL_C[l]}}>L{l} · {LVL_L[l]}</div>
                            {c.levels[l-1]}
                          </button>
                        );})}
                      </div>
                    </div>
                  </Card>
                );
              } else {
                // ── RESULTS ROW ──
                return(
                  <Card key={c.key} style={{overflow:"hidden",borderLeft:"3px solid "+(score>0?LVL_C[score]:"#E7E7E7")}}>
                    <button style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"transparent",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"Montserrat,sans-serif"}} onClick={()=>setExpanded(isOpen?null:c.key)}>
                      <div style={{width:44,height:44,borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0,background:score>0?LVL_BG[score]:"#F7F7F7",border:"1.5px solid "+(score>0?LVL_C[score]+"40":"#E7E7E7")}}>
                        <div style={{fontSize:18,fontWeight:900,lineHeight:1,color:score>0?LVL_C[score]:"#CCC"}}>{score||"—"}</div>
                        <div style={{fontSize:8,fontWeight:700,color:score>0?LVL_C[score]:"#CCC"}}>/4</div>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:800,fontSize:13,color:CL.navy}}>{c.name}</div>
                        <div style={{fontSize:11,fontWeight:700,color:score>0?LVL_C[score]:"#CCC",marginTop:2}}>{score>0?LVL_L[score]:"Not scored"}</div>
                      </div>
                      <div style={{width:90,marginRight:8}}>
                        <div style={{height:6,background:"#F0F0F0",borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:(score>0?(score/4)*100:0)+"%",height:"100%",background:score>0?LVL_C[score]:"#E7E7E7",borderRadius:3}}/>
                        </div>
                      </div>
                      <div style={{color:"#CCC",fontSize:14,transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▼</div>
                    </button>
                    {isOpen&&(
                      <div style={{padding:"0 16px 16px",borderTop:"1px solid #F5F5F5"}}>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginTop:12}}>
                          {[1,2,3,4].map(l=>(
                            <div key={l} style={{padding:"10px 12px",borderRadius:9,border:score===l?"2px solid "+LVL_C[l]:"1px solid "+LVL_C[l]+"30",background:score===l?LVL_BG[l]:"#fff",opacity:score>0&&score!==l?0.55:1}}>
                              <div style={{fontSize:10,fontWeight:900,color:LVL_C[l],marginBottom:4}}>L{l} · {LVL_L[l]}</div>
                              <div style={{fontSize:11,color:"#555",lineHeight:1.5}}>{c.levels[l-1]}</div>
                            </div>
                          ))}
                        </div>
                        {score>0&&score<4&&(
                          <div style={{marginTop:10,padding:"10px 12px",borderRadius:9,background:LVL_C[score+1]+"10",borderLeft:"3px solid "+LVL_C[score+1]}}>
                            <div style={{fontSize:10,fontWeight:800,color:LVL_C[score+1],marginBottom:3}}>Next level requires:</div>
                            <div style={{fontSize:11,color:"#555"}}>{c.levels[score]}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              }
            })}
          </div>
        </div>

        {/* Right: charts + network */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card style={{padding:16}}>
            <div style={{fontSize:10,fontWeight:800,color:"#9F9F9F",textTransform:"uppercase",marginBottom:8}}>All Segments Radar</div>
            <RadarChart data={radarData} color={seg.color}/>
          </Card>
          <Card style={{padding:16}}>
            <div style={{fontSize:10,fontWeight:800,color:"#9F9F9F",textTransform:"uppercase",marginBottom:10}}>Network — {seg.label}</div>
            {barData.map(d=>(
              <div key={d.name} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                <div style={{width:36,fontSize:9,fontWeight:700,color:d.isSel?seg.color:"#AAA",textAlign:"right",flexShrink:0}}>{d.name}</div>
                <div style={{flex:1,height:10,background:"#F0F0F0",borderRadius:4,overflow:"hidden"}}>
                  <div style={{width:(d.val/barMax*100)+"%",height:"100%",background:d.isSel?seg.color:seg.color+"40",borderRadius:4}}/>
                </div>
                <div style={{width:30,fontSize:10,fontWeight:800,color:d.isSel?seg.color:"#AAA"}}>{d.val}%</div>
              </div>
            ))}
          </Card>
          <Card style={{padding:16}}>
            <div style={{fontSize:10,fontWeight:800,color:"#9F9F9F",textTransform:"uppercase",marginBottom:10}}>Maturity Scale</div>
            {[4,3,2,1].map(l=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:LVL_C[l],flexShrink:0}}/>
                <span style={{fontSize:11,fontWeight:700,color:LVL_C[l],flex:1}}>L{l} · {LVL_L[l]}</span>
                <span style={{fontSize:10,color:"#AAA",fontWeight:600}}>{LVL_R[l]}</span>
              </div>
            ))}
          </Card>
          {/* Segment score summary */}
          <Card style={{padding:16}}>
            <div style={{fontSize:10,fontWeight:800,color:"#9F9F9F",textTransform:"uppercase",marginBottom:10}}>Segment Summary</div>
            {SEG.map(s=>{const p=segPctLocal(s.key);const lv=matLvl(p.pct);return(
              <div key={s.key} onClick={()=>setActiveSeg(s.key)} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,cursor:"pointer",padding:"6px 8px",borderRadius:8,background:activeSeg===s.key?s.color+"10":"transparent",border:activeSeg===s.key?"1.5px solid "+s.color+"30":"1.5px solid transparent"}}>
                <span style={{fontSize:14}}>{s.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:700,color:CL.navy,marginBottom:2}}>{s.label}</div>
                  <PBar pct={p.pct} color={s.color} h={4}/>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:13,fontWeight:900,color:s.color}}>{Math.round(p.pct*100)}%</div>
                  <div style={{fontSize:9,color:"#aaa",fontWeight:600}}>L{lv}</div>
                </div>
              </div>
            );})}
          </Card>
        </div>
      </div>
    </div>
  );
}


const KB_TYPES=["Guide","Best Practice","Playbook","Template","Video","Reference","Checklist","Other"];
const KB_TYPE_COLORS={"Guide":"#2563EB","Best Practice":"#059669","Playbook":"#D97706","Template":"#7C3AED","Video":"#DC2626","Reference":"#0891B2","Checklist":"#059669","Other":"#6B7280"};
const KB_SEED=[
  {id:1,seg:"stock",category:"Pricing",title:"Walkaway Pricing — Field Reference Card",type:"Best Practice",author:"Cooper RSM Team",date:"Mar 2025",content:"Never quote from memory — always reference current floor pricing data before the call. Present the business case first, then the number.",tags:["pricing","distributor"],likes:14,pinned:true,url:""},
  {id:2,seg:"stock",category:"Promotions",title:"Top 10 Promo Strategies That Work",type:"Guide",author:"David Park — RSM Pacific",date:"Apr 2025",content:"Pre-commit distributors 6 weeks before the cycle opens. Place MRAM kits at every Tier 1 location. Use inside sales for daily promo tracking.",tags:["promos","MRAM"],likes:22,pinned:true,url:""},
  {id:3,seg:"spec",category:"VE Defense",title:"How to Defend a CLS Spec from Value Engineering",type:"Best Practice",author:"Emily Walsh — RSM NE",date:"Feb 2025",content:"Call the LD/EE immediately, not the contractor. Lead with photometric performance. Bring a layout comparison showing what gets lost.",tags:["VE defense","specification"],likes:31,pinned:true,url:""},
  {id:4,seg:"spec",category:"Tools",title:"LEX ASOW Report — Weekly Interpretation Guide",type:"Guide",author:"Cooper Training Team",date:"Jan 2025",content:"Every Monday: open ASOW, sort by gap to potential. Top 5 gaps = this week's spec outreach targets. Share with RSM weekly.",tags:["LEX","ASOW"],likes:18,pinned:false,url:""},
  {id:5,seg:"industrial",category:"Nemalux",title:"Nemalux Door Opener Playbook",type:"Playbook",author:"Carlos Rivera — RSM Gulf",date:"Mar 2025",content:"Identify food processing, chemical, or aerospace facility. Request facility walk with maintenance director. Bring Nemalux Class I Div 2 sample.",tags:["Nemalux","hazardous"],likes:27,pinned:true,url:""},
  {id:6,seg:"connected",category:"WLX",title:"WLX Demo — 10-Minute Script",type:"Template",author:"Brian Moore — RSM Central",date:"Apr 2025",content:"Minutes 1–2: Ask what frustrates them. Minutes 3–5: Show occupancy sensing live. Minutes 6–8: Demo daylight harvesting. Minutes 9–10: Leave the case on-site.",tags:["WLX","demo"],likes:35,pinned:true,url:""},
];

const BLANK_CARD={title:"",type:"Guide",seg:"stock",category:"",content:"",author:"",tags:"",url:"",pinned:false};

function KnowledgePage({currentUser}){
  const [arts,setArts]=useState(KB_SEED);
  const [dbLoaded,setDbLoaded]=useState(true);

  // stub — in-memory only for test mode
  const saveCardToDb=async()=>null;
  const deleteCardFromDb=async()=>null;
  const likeCardInDb=async()=>null;
  const [segFilter,setSegFilter]=useState("all");
  const [catFilter,setCatFilter]=useState("all");
  const [typeFilter,setTypeFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [expand,setExpand]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [editId,setEditId]=useState(null);
  const [form,setForm]=useState(BLANK_CARD);
  const [customCat,setCustomCat]=useState("");
  const [viewMode,setViewMode]=useState("grouped"); // grouped | flat

  // Derived data
  const allCategories=[...new Set(arts.map(a=>a.category).filter(Boolean))].sort();
  const filtered=arts.filter(a=>{
    if(segFilter!=="all"&&a.seg!==segFilter)return false;
    if(catFilter!=="all"&&a.category!==catFilter)return false;
    if(typeFilter!=="all"&&a.type!==typeFilter)return false;
    if(search&&!a.title.toLowerCase().includes(search.toLowerCase())&&!a.content.toLowerCase().includes(search.toLowerCase())&&!a.tags.join(" ").toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });
  const activeSegs=SEG.filter(s=>segFilter==="all"||s.key===segFilter);

  const openForm=(art=null)=>{
    if(art){setForm({...art,tags:art.tags.join(", ")});setEditId(art.id);}
    else{setForm(BLANK_CARD);setEditId(null);}
    setShowForm(true);
  };
  const closeForm=()=>{setShowForm(false);setEditId(null);setForm(BLANK_CARD);setCustomCat("");};
  const saveCard=async()=>{
    if(!form.title.trim()||!form.content.trim())return;
    const finalCat=form.category==="__new__"?customCat.trim():form.category;
    const parsed={seg:form.seg,category:finalCat,title:form.title,type:form.type,content:form.content,author_name:form.author,tags:form.tags.split(",").map(t=>t.trim()).filter(Boolean),url:form.url||"",pinned:false};
    if(editId){
      await saveCardToDb({...parsed,id:editId},true);
      setArts(prev=>prev.map(a=>a.id===editId?{...a,...parsed}:a));
    }else{
      const saved=await saveCardToDb({...parsed,likes:0});
      setArts(prev=>[...(saved?[{...saved,tags:saved.tags||[]}]:[{...parsed,id:Date.now(),likes:0}]),...prev]);
    }
    closeForm();
  };
  const deleteCard=async(id)=>{
    if(!window.confirm("Delete this card?"))return;
    await deleteCardFromDb(id);
    setArts(prev=>prev.filter(a=>a.id!==id));
  };
  const togglePin=async(id)=>{
    setArts(prev=>prev.map(a=>a.id===id?{...a,pinned:!a.pinned}:a));
  };
  const likeCard=async(id)=>{
    const card=arts.find(a=>a.id===id);
    const newLikes=(card.likes||0)+1;
    await likeCardInDb(id,newLikes);
    setArts(prev=>prev.map(a=>a.id===id?{...a,likes:newLikes}:a));
  };

  // Group by category within segment
  const getCats=(segKey)=>[...new Set(filtered.filter(a=>a.seg===segKey).map(a=>a.category||"General"))].sort((a,b)=>a==="General"?1:b==="General"?-1:a.localeCompare(b));

  const CardItem=({art,segment})=>{
    const tc=KB_TYPE_COLORS[art.type]||"#888";
    const exp=expand===art.id;
    return(
      <Card style={{overflow:"hidden",display:"flex",flexDirection:"column",borderTop:"3px solid "+segment.color,position:"relative"}}>
        {art.pinned&&<div style={{position:"absolute",top:10,right:10,fontSize:13,zIndex:1}}>📌</div>}
        <div style={{padding:"14px 16px",flex:1}}>
          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:8,flexWrap:"wrap",paddingRight:20}}>
            <Badge label={art.type} color={tc}/>
            {art.url&&<span style={{fontSize:10,color:"#2563EB",fontWeight:700}}>🔗 Link</span>}
          </div>
          <div style={{fontWeight:800,fontSize:13,color:CL.navy,marginBottom:6,lineHeight:1.4,cursor:"pointer"}} onClick={()=>setExpand(exp?null:art.id)}>{art.title}</div>
          {exp?(
            <>
              <p style={{fontSize:12,color:"#555",lineHeight:1.75,margin:"0 0 10px"}}>{art.content}</p>
              {art.url&&<a href={art.url} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,color:"#2563EB",fontWeight:700,marginBottom:10,textDecoration:"none",padding:"5px 10px",background:"#EFF6FF",borderRadius:6,border:"1px solid #BFDBFE"}}>🔗 Open Link ↗</a>}
            </>
          ):(
            <p style={{fontSize:11,color:"#888",lineHeight:1.6,margin:"0 0 8px",cursor:"pointer",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}} onClick={()=>setExpand(art.id)}>{art.content}</p>
          )}
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
            {art.tags.map(t=><span key={t} style={{fontSize:10,background:"#F0F0F0",color:"#777",padding:"2px 7px",borderRadius:4,fontWeight:600}}>#{t}</span>)}
          </div>
          <div style={{borderTop:"1px solid #F5F5F5",paddingTop:10,display:"flex",alignItems:"center",justifyContent:"space-between",gap:6,flexWrap:"wrap"}}>
            <span style={{fontSize:10,color:"#aaa",flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{art.author}{art.author&&" · "}{art.date}</span>
            <div style={{display:"flex",gap:4,flexShrink:0}}>
              <button onClick={()=>likeCard(art.id)} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",border:"1px solid #E7E7E7",borderRadius:6,background:"#fff",cursor:"pointer",fontSize:11,fontWeight:700,color:"#888"}}>👍 {art.likes||0}</button>
              <button onClick={()=>togglePin(art.id)} title={art.pinned?"Unpin":"Pin"} style={{padding:"3px 7px",border:"1px solid #E7E7E7",borderRadius:6,background:"#fff",cursor:"pointer",fontSize:12}}>📌</button>
              <button onClick={()=>openForm(art)} style={{padding:"3px 8px",border:"1px solid #E7E7E7",borderRadius:6,background:"#fff",cursor:"pointer",fontSize:10,fontWeight:700,color:"#888"}}>✏️</button>
              <button onClick={()=>deleteCard(art.id)} style={{padding:"3px 7px",border:"1px solid #FFCDD2",borderRadius:6,background:"#fff",cursor:"pointer",fontSize:12,color:"#EF4444"}}>✕</button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const inputStyle={width:"100%",padding:"9px 12px",border:"1.5px solid #DDD",borderRadius:8,fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"Montserrat,sans-serif"};
  const labelStyle={fontSize:10,fontWeight:800,color:"#888",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4,display:"block"};

  return(
    <div style={{padding:24,maxWidth:1060,margin:"0 auto"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:10,fontWeight:800,color:"#9F9F9F",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>Shared Intelligence</div>
          <div style={{fontSize:24,fontWeight:900,color:CL.navy}}>📚 Knowledge Base</div>
          <div style={{fontSize:13,color:"#888",marginTop:2}}>{arts.length} cards · {allCategories.length} categories</div>
        </div>
        <button onClick={()=>openForm()} style={{display:"flex",alignItems:"center",gap:8,padding:"11px 20px",background:CL.orange,color:"#fff",border:"none",borderRadius:10,fontWeight:800,fontSize:13,cursor:"pointer",boxShadow:"0 4px 12px rgba(242,106,54,0.35)"}}>
          <span style={{fontSize:16,lineHeight:1}}>＋</span> Add Knowledge Card
        </button>
      </div>

      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
        {SEG.map(s=>{const cnt=arts.filter(a=>a.seg===s.key).length;return(
          <div key={s.key} onClick={()=>setSegFilter(segFilter===s.key?"all":s.key)} style={{padding:"12px 14px",borderRadius:10,border:"2px solid "+(segFilter===s.key?s.color:"#E7E7E7"),background:segFilter===s.key?s.color+"10":"#fff",cursor:"pointer",transition:"all 0.15s"}}>
            <div style={{fontSize:9,fontWeight:800,textTransform:"uppercase",color:s.color,marginBottom:4,letterSpacing:"0.08em"}}>{s.icon} {s.label}</div>
            <div style={{fontSize:22,fontWeight:900,color:CL.navy,lineHeight:1}}>{cnt}</div>
            <div style={{fontSize:10,color:"#aaa",marginTop:2}}>cards</div>
          </div>
        );})}
      </div>

      {/* Filters bar */}
      <Card style={{padding:"12px 16px",marginBottom:16,display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search title, content, tags…" style={{flex:1,minWidth:180,padding:"7px 12px",border:"1.5px solid #DDD",borderRadius:8,fontSize:12,outline:"none",fontFamily:"Montserrat,sans-serif"}}/>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{padding:"7px 11px",border:"1.5px solid #DDD",borderRadius:8,fontSize:11,fontWeight:700,background:"#fff",outline:"none",cursor:"pointer",fontFamily:"Montserrat,sans-serif",color:CL.navy}}>
          <option value="all">All Categories</option>
          {allCategories.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} style={{padding:"7px 11px",border:"1.5px solid #DDD",borderRadius:8,fontSize:11,fontWeight:700,background:"#fff",outline:"none",cursor:"pointer",fontFamily:"Montserrat,sans-serif",color:CL.navy}}>
          <option value="all">All Types</option>
          {KB_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <div style={{display:"flex",gap:4,borderLeft:"1px solid #E7E7E7",paddingLeft:8}}>
          {[{v:"grouped",icon:"⊞"},{v:"flat",icon:"≡"}].map(m=>(
            <button key={m.v} onClick={()=>setViewMode(m.v)} title={m.v==="grouped"?"Grouped by category":"Flat list"} style={{width:30,height:30,borderRadius:6,border:"1.5px solid "+(viewMode===m.v?CL.navy:"#DDD"),background:viewMode===m.v?CL.navy:"#fff",color:viewMode===m.v?"#fff":"#aaa",fontSize:14,cursor:"pointer",fontWeight:700}}>{m.icon}</button>
          ))}
        </div>
        {(segFilter!=="all"||catFilter!=="all"||typeFilter!=="all"||search)&&(
          <button onClick={()=>{setSegFilter("all");setCatFilter("all");setTypeFilter("all");setSearch("");}} style={{padding:"5px 12px",border:"1.5px solid #DDD",borderRadius:7,background:"#fff",color:"#888",fontSize:11,fontWeight:600,cursor:"pointer"}}>✕ Clear</button>
        )}
        <span style={{marginLeft:"auto",fontSize:11,color:"#aaa",fontWeight:600,whiteSpace:"nowrap"}}>{filtered.length} result{filtered.length!==1?"s":""}</span>
      </Card>

      {/* Pinned section */}
      {filtered.some(a=>a.pinned)&&(
        <div style={{marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <span style={{fontSize:13}}>📌</span>
            <span style={{fontSize:11,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#D97706"}}>Pinned</span>
            <div style={{flex:1,height:1,background:"#E7E7E7"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
            {filtered.filter(a=>a.pinned).map(art=>{const seg=SEG.find(s=>s.key===art.seg)||SEG[0];return <CardItem key={art.id} art={art} segment={seg}/>;} )}
          </div>
        </div>
      )}

      {/* Main content */}
      {viewMode==="grouped"?(
        activeSegs.map(segment=>{
          const cats=getCats(segment.key);
          if(!cats.length)return null;
          return(
            <div key={segment.key} style={{marginBottom:28}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,paddingBottom:8,borderBottom:"2px solid "+segment.color+"30"}}>
                <div style={{width:6,height:24,background:segment.color,borderRadius:3}}/>
                <span style={{fontSize:14,fontWeight:900,color:segment.color}}>{segment.icon} {segment.label}</span>
                <span style={{fontSize:11,color:"#aaa",fontWeight:600}}>{filtered.filter(a=>a.seg===segment.key).length} cards</span>
                <div style={{flex:1}}/>
                <button onClick={()=>{setForm({...BLANK_CARD,seg:segment.key});setShowForm(true);}} style={{padding:"5px 12px",border:"1.5px solid "+segment.color,borderRadius:7,background:"#fff",color:segment.color,fontSize:11,fontWeight:700,cursor:"pointer"}}>+ Add to {segment.label}</button>
              </div>
              {cats.map(cat=>{
                const catArts=filtered.filter(a=>a.seg===segment.key&&(a.category||"General")===cat&&!a.pinned);
                if(!catArts.length)return null;
                return(
                  <div key={cat} style={{marginBottom:18}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <span style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:"#888",background:"#F0F0F0",padding:"3px 10px",borderRadius:20}}>{cat}</span>
                      <span style={{fontSize:10,color:"#CCC"}}>{catArts.length}</span>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
                      {catArts.map(art=><CardItem key={art.id} art={art} segment={segment}/>)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
          {filtered.filter(a=>!a.pinned).map(art=>{const seg=SEG.find(s=>s.key===art.seg)||SEG[0];return <CardItem key={art.id} art={art} segment={seg}/>;} )}
        </div>
      )}

      {filtered.length===0&&(
        <div style={{textAlign:"center",padding:"48px 24px",color:"#aaa"}}>
          <div style={{fontSize:36,marginBottom:12}}>🔍</div>
          <div style={{fontWeight:800,fontSize:15,color:CL.navy,marginBottom:6}}>No cards found</div>
          <div style={{fontSize:13,marginBottom:20}}>Try adjusting your filters or search terms</div>
          <button onClick={()=>openForm()} style={{padding:"10px 24px",background:CL.orange,color:"#fff",border:"none",borderRadius:9,fontWeight:700,fontSize:13,cursor:"pointer"}}>+ Add the first card</button>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showForm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>{if(e.target===e.currentTarget)closeForm();}}>
          <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:560,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.25)"}}>
            {/* Modal header */}
            <div style={{background:CL.navy,padding:"20px 24px",borderRadius:"16px 16px 0 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{color:"rgba(255,255,255,0.6)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{editId?"Edit Card":"New Card"}</div>
                <div style={{color:"#fff",fontWeight:900,fontSize:16}}>{editId?"Update Knowledge Card":"Add to Knowledge Base"}</div>
              </div>
              <button onClick={closeForm} style={{width:32,height:32,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.12)",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>✕</button>
            </div>
            <div style={{padding:"24px"}}>
              {/* Title */}
              <div style={{marginBottom:14}}>
                <label style={labelStyle}>Title *</label>
                <input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Walkaway Pricing Field Reference" style={inputStyle}/>
              </div>
              {/* Row: Segment + Type */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                <div>
                  <label style={labelStyle}>Segment *</label>
                  <select value={form.seg} onChange={e=>setForm(p=>({...p,seg:e.target.value}))} style={{...inputStyle,cursor:"pointer"}}>
                    {SEG.map(s=><option key={s.key} value={s.key}>{s.icon} {s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Content Type *</label>
                  <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={{...inputStyle,cursor:"pointer"}}>
                    {KB_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              {/* Category */}
              <div style={{marginBottom:form.category==="__new__"?8:14}}>
                <label style={labelStyle}>Category</label>
                <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} style={{...inputStyle,cursor:"pointer"}}>
                  <option value="">— Select or create —</option>
                  {allCategories.map(c=><option key={c} value={c}>{c}</option>)}
                  <option value="__new__">＋ Create new category…</option>
                </select>
              </div>
              {form.category==="__new__"&&(
                <div style={{marginBottom:14,display:"flex",gap:8,alignItems:"center"}}>
                  <input value={customCat} onChange={e=>setCustomCat(e.target.value)} placeholder="New category name…" style={{...inputStyle,borderColor:CL.orange}}/>
                  {customCat.trim()&&<div style={{padding:"9px 12px",background:CL.orange+"15",borderRadius:8,fontSize:12,fontWeight:700,color:CL.orange,whiteSpace:"nowrap"}}>"{customCat.trim()}"</div>}
                </div>
              )}
              {/* Content */}
              <div style={{marginBottom:14}}>
                <label style={labelStyle}>Content / Summary *</label>
                <textarea value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} placeholder="Describe the key insight, tactic, or reference…" rows={4} style={{...inputStyle,resize:"vertical"}}/>
              </div>
              {/* Row: Author + URL */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                <div>
                  <label style={labelStyle}>Author / Source</label>
                  <input value={form.author} onChange={e=>setForm(p=>({...p,author:e.target.value}))} placeholder="e.g. David Park — RSM Pacific" style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>Link URL (optional)</label>
                  <input value={form.url} onChange={e=>setForm(p=>({...p,url:e.target.value}))} placeholder="https://…" style={inputStyle}/>
                </div>
              </div>
              {/* Tags */}
              <div style={{marginBottom:16}}>
                <label style={labelStyle}>Tags (comma-separated)</label>
                <input value={form.tags} onChange={e=>setForm(p=>({...p,tags:e.target.value}))} placeholder="pricing, distributor, WLX, CEU…" style={inputStyle}/>
                {form.tags&&(
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>
                    {form.tags.split(",").map(t=>t.trim()).filter(Boolean).map(t=>(
                      <span key={t} style={{fontSize:10,background:"#F0F0F0",color:"#555",padding:"2px 8px",borderRadius:4,fontWeight:600}}>#{t}</span>
                    ))}
                  </div>
                )}
              </div>
              {/* Segment preview */}
              {form.seg&&(()=>{const s=SEG.find(x=>x.key===form.seg);const tc=KB_TYPE_COLORS[form.type]||"#888";return(
                <div style={{background:"#F7F7F7",borderRadius:10,padding:"12px 14px",marginBottom:20,border:"1px solid #E7E7E7"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",marginBottom:8}}>Preview</div>
                  <div style={{borderTop:"3px solid "+s.color,borderRadius:6,background:"#fff",padding:"10px 12px"}}>
                    <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}}>
                      <Badge label={form.type||"Type"} color={tc}/>
                      {(form.category==="__new__"?customCat:form.category)&&<span style={{fontSize:10,background:"#F0F0F0",color:"#777",padding:"2px 8px",borderRadius:4,fontWeight:600}}>{form.category==="__new__"?customCat:form.category}</span>}
                    </div>
                    <div style={{fontWeight:800,fontSize:12,color:CL.navy,lineHeight:1.4}}>{form.title||"Card title will appear here"}</div>
                  </div>
                </div>
              );})()}
              {/* Actions */}
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button onClick={closeForm} style={{padding:"10px 20px",border:"1.5px solid #DDD",borderRadius:9,background:"#fff",color:"#777",fontWeight:700,fontSize:13,cursor:"pointer"}}>Cancel</button>
                <button onClick={saveCard} disabled={!form.title.trim()||!form.content.trim()} style={{padding:"10px 24px",background:form.title.trim()&&form.content.trim()?CL.orange:"#DDD",color:"#fff",border:"none",borderRadius:9,fontWeight:800,fontSize:13,cursor:form.title.trim()&&form.content.trim()?"pointer":"default",transition:"background 0.2s"}}>
                  {editId?"Update Card ✓":"Save Card →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const STEPS={
  stock:[
    {title:"Establish Stock Foundation",desc:"Define your stock segment strategy, identify key distributors, and set up CRM targets for all key stock accounts.",tip:"The first 90 days are about inventory visibility — you can't sell what you can't see.",
     resources:[
       {id:"r1",type:"doc",label:"CRM Setup Guide",url:""},
       {id:"r2",type:"doc",label:"Distributor Tier Classification",url:""},
       {id:"r3",type:"doc",label:"Stock Target Template",url:""},
     ]},
    {title:"Walkaway Pricing Adoption",desc:"Train your team on CLS Walkaway Pricing methodology. Ensure all reps know floor pricing before any customer call.",tip:"Walk-away pricing discipline separates top-performing agencies from average ones.",
     resources:[
       {id:"r4",type:"doc",label:"Walkaway Pricing Guide",url:""},
       {id:"r5",type:"doc",label:"Pricing Floor Reference",url:""},
       {id:"r6",type:"doc",label:"Margin Calculator",url:""},
     ]},
    {title:"Promotions & MRAM Execution",desc:"Deploy MRAM kits at top distributors. Execute Q-cycle promotions with pre-committed stocking plans.",tip:"Commit distributors 6 weeks before the promotion cycle opens.",
     resources:[
       {id:"r7",type:"doc",label:"MRAM Placement Guide",url:""},
       {id:"r8",type:"doc",label:"Q-Cycle Promo Playbook",url:""},
       {id:"r9",type:"doc",label:"Promo Tracking Template",url:""},
     ]},
    {title:"EDI & E-Commerce Activation",desc:"Drive EDI adoption across your distributor base. Review and optimize the online product presence for CLS products.",tip:"Every distributor on EDI means fewer order errors and faster restock cycles.",
     resources:[
       {id:"r10",type:"doc",label:"EDI Setup Guide",url:""},
       {id:"r11",type:"doc",label:"E-Commerce Audit Template",url:""},
       {id:"r12",type:"doc",label:"Online Presence Checklist",url:""},
     ]},
    {title:"Inside Sales Integration",desc:"Assign a dedicated inside sales resource to the stock segment. Define daily and weekly routines for stock activity.",tip:"Inside sales consistency beats field visit frequency every time in the stock segment.",
     resources:[
       {id:"r13",type:"doc",label:"Inside Sales Job Description",url:""},
       {id:"r14",type:"doc",label:"Daily Routine Template",url:""},
       {id:"r15",type:"doc",label:"Stock Call Guide",url:""},
     ]},
    {title:"Buying Group & Marketing Fund Mastery",desc:"Maximize buying group participation and deploy marketing development funds strategically.",tip:"Unused MDF is money left on the table. Build a 12-month MDF plan at the start of the year.",
     resources:[
       {id:"r16",type:"doc",label:"Buying Group Overview",url:""},
       {id:"r17",type:"doc",label:"MDF Request Process",url:""},
       {id:"r18",type:"doc",label:"Marketing Calendar Template",url:""},
     ]},
  ],
  spec:[
    {title:"Specifier Relationship Mapping",desc:"Identify and map your target A&E firms, lighting designers, and engineering consultants. Build a tiered contact list.",tip:"Focus on the specifier who WRITES the spec, not the one who approves it.",
     resources:[{id:"s1",type:"doc",label:"Specifier Tier Matrix",url:""},{id:"s2",type:"doc",label:"A&E Firm Database",url:""},{id:"s3",type:"doc",label:"Relationship Mapping Template",url:""}]},
    {title:"LEX Platform Mastery",desc:"Achieve full proficiency on the LEX platform. Post all NPI carousels, subscribe specifiers, review ASOW weekly.",tip:"Every Monday, open ASOW and find your top 5 opportunity gaps.",
     resources:[{id:"s4",type:"doc",label:"LEX User Guide",url:""},{id:"s5",type:"doc",label:"ASOW Interpretation Guide",url:""},{id:"s6",type:"doc",label:"NPI Carousel Setup",url:""}]},
    {title:"CEU & Event Program",desc:"Launch a structured CEU and specifier event program. Host minimum 2 non-standard events per quarter.",tip:"Host at your office, not theirs. It changes the power dynamic.",
     resources:[{id:"s7",type:"doc",label:"CEU Planning Guide",url:""},{id:"s8",type:"doc",label:"Event ROI Calculator",url:""},{id:"s9",type:"doc",label:"AIA Event Standards",url:""}]},
    {title:"Construct Connect & Pipeline",desc:"Activate Construct Connect subscription. Build a structured pipeline review cadence with your RSM.",tip:"A spec without a project number is a wish. A spec with a project number is a pipeline item.",
     resources:[{id:"s10",type:"doc",label:"Construct Connect Setup",url:""},{id:"s11",type:"doc",label:"Pipeline Review Template",url:""},{id:"s12",type:"doc",label:"Lead Qualification Criteria",url:""}]},
    {title:"APG Brand Proficiency",desc:"Train your full team on all APG brands — Halo, Portfolio, Metalux, and the full brand portfolio.",tip:"Share of wallet grows when your team can spec any APG brand with confidence.",
     resources:[{id:"s13",type:"doc",label:"APG Brand Training",url:""},{id:"s14",type:"doc",label:"Brand Comparison Guide",url:""},{id:"s15",type:"doc",label:"Brand Selection Matrix",url:""}]},
    {title:"VE Defense & Win/Loss Review",desc:"Build a documented VE defense capability. Conduct quarterly win/loss analysis on top projects.",tip:"The spec you lose to VE tells you more about your process than the spec you win.",
     resources:[{id:"s16",type:"doc",label:"VE Defense Playbook",url:""},{id:"s17",type:"doc",label:"Win/Loss Template",url:""},{id:"s18",type:"doc",label:"Photometric Comparison Guide",url:""}]},
    {title:"PM Capability & Communication",desc:"Develop project management capability for complex specifications. Build proactive communication process.",tip:"PM excellence is the difference between a spec that gets built and one that falls to substitution.",
     resources:[{id:"s19",type:"doc",label:"PM Process Guide",url:""},{id:"s20",type:"doc",label:"Specification Tracking Template",url:""},{id:"s21",type:"doc",label:"Communication Cadence Guide",url:""}]},
    {title:"Specification Excellence Review",desc:"Conduct a full spec business review: win/loss analysis, pipeline conversion rates, and team benchmarking.",tip:"Study your losses as carefully as your wins.",
     resources:[{id:"s22",type:"doc",label:"Spec QBR Template",url:""},{id:"s23",type:"doc",label:"Win/Loss Analysis Framework",url:""},{id:"s24",type:"doc",label:"Pipeline Conversion Benchmarks",url:""}]},
  ],
  industrial:[
    {title:"Industrial Market Landscape",desc:"Develop a deep understanding of the industrial lighting market — warehouse, manufacturing, food & beverage, cold storage, aerospace.",tip:"Map the full buying committee: Technical, Financial, and Operational stakeholders.",
     resources:[{id:"i1",type:"doc",label:"Industrial Market Map",url:""},{id:"i2",type:"doc",label:"Vertical Segment Profiles",url:""},{id:"i3",type:"doc",label:"Decision Maker Guide",url:""}]},
    {title:"Nemalux Product Mastery",desc:"Achieve deep product knowledge of the Nemalux portfolio — hazardous location, vapor-tight, high-bay, and explosion-proof fixtures.",tip:"Nemalux hazardous location certifications open doors competitors cannot enter.",
     resources:[{id:"i4",type:"doc",label:"Nemalux Product Catalog",url:""},{id:"i5",type:"doc",label:"Hazardous Location Guide",url:""},{id:"i6",type:"doc",label:"Certification Reference Sheet",url:""}]},
    {title:"Retrofit Audit & Energy Assessment",desc:"Build capability to conduct professional lighting retrofit audits. Learn to project post-retrofit savings.",tip:"Always lead with the payback period and annual kWh savings.",
     resources:[{id:"i7",type:"doc",label:"Retrofit Audit Toolkit",url:""},{id:"i8",type:"doc",label:"Energy Savings Calculator",url:""},{id:"i9",type:"doc",label:"ROI Presentation Template",url:""}]},
    {title:"Utility Rebate Program Execution",desc:"Master the utility rebate landscape. Know which utilities offer rebates, their rates, and application processes.",tip:"In many territories, rebates reduce effective project cost by 15–30%.",
     resources:[{id:"i10",type:"doc",label:"Utility Rebate Database",url:""},{id:"i11",type:"doc",label:"Rebate Application Checklist",url:""},{id:"i12",type:"doc",label:"DSIRE Program Directory",url:""}]},
    {title:"National Account & Enterprise Strategy",desc:"Identify national and enterprise accounts in your territory and develop a coordinated approach.",tip:"Find one champion inside a national account's local facility.",
     resources:[{id:"i13",type:"doc",label:"National Account Program Overview",url:""},{id:"i14",type:"doc",label:"Enterprise Account Strategy Guide",url:""},{id:"i15",type:"doc",label:"Corp vs. Local Decision Matrix",url:""}]},
    {title:"Industrial Application & Photometric Design",desc:"Develop technical capability to specify industrial lighting by application.",tip:"IES RP-2 and RP-7 are the governing standards for industrial lighting design.",
     resources:[{id:"i16",type:"doc",label:"IES Industrial Lighting Guidelines",url:""},{id:"i17",type:"doc",label:"Warehouse Layout Design Guide",url:""},{id:"i18",type:"doc",label:"Emergency Lighting Compliance",url:""}]},
    {title:"Competitive Intelligence & Value Selling",desc:"Build a current competitive matrix for industrial lighting. Train your team to sell value using TCO models.",tip:"Compete on certification depth, warranty terms, local support, and energy performance — not price.",
     resources:[{id:"i19",type:"doc",label:"Industrial Competitive Matrix",url:""},{id:"i20",type:"doc",label:"TCO Calculator",url:""},{id:"i21",type:"doc",label:"Value Selling Guide",url:""}]},
    {title:"MWS Quoting & In-House Layout Capability",desc:"Build internal capability to generate CLS/Nemalux industrial quotes and MWS layouts.",tip:"Speed wins in industrial quoting. 24 hours vs. 72 hours wins 60%+ of the time.",
     resources:[{id:"i22",type:"doc",label:"MWS Quote Guide",url:""},{id:"i23",type:"doc",label:"Product Configuration Rules",url:""},{id:"i24",type:"doc",label:"Quote Turnaround Best Practices",url:""}]},
    {title:"Controls Integration in Industrial",desc:"Understand how industrial controls — occupancy sensors, daylight harvesting, WLX Lite — apply to warehouse and manufacturing.",tip:"Adding controls to an industrial retrofit typically improves energy ROI by 20–35%.",
     resources:[{id:"i25",type:"doc",label:"Industrial Controls Guide",url:""},{id:"i26",type:"doc",label:"WLX Lite for Warehouse",url:""},{id:"i27",type:"doc",label:"Controls ROI Calculator",url:""}]},
    {title:"Industrial Excellence Review",desc:"Review your full industrial pipeline by vertical, project stage, and revenue potential.",tip:"Any opportunity with no activity in 30 days needs a re-engagement plan.",
     resources:[{id:"i28",type:"doc",label:"Industrial Pipeline Review Template",url:""},{id:"i29",type:"doc",label:"Account Scoring Matrix",url:""},{id:"i30",type:"doc",label:"90-Day Action Planner",url:""}]},
  ],
  connected:[
    {title:"Connected Lighting Fundamentals",desc:"Build a foundation in connected lighting systems — wired vs. wireless controls, protocol types (0-10V, DALI, Zigbee, BACnet).",tip:"Practice your 60-second connected lighting explanation until any facility manager can understand it.",
     resources:[{id:"c1",type:"doc",label:"Connected Lighting Primer",url:""},{id:"c2",type:"doc",label:"Protocol Comparison Guide",url:""},{id:"c3",type:"doc",label:"Controls Terminology Glossary",url:""}]},
    {title:"WLX Platform Deep Dive",desc:"Achieve comprehensive knowledge of the full WLX platform family. Understand the product hierarchy and application scenarios.",tip:"Know WLX well enough to demo it on a tablet in 10 minutes without preparation.",
     resources:[{id:"c4",type:"doc",label:"WLX Platform Overview",url:""},{id:"c5",type:"doc",label:"WLX Product Family Comparison",url:""},{id:"c6",type:"doc",label:"WLX Application Guide",url:""}]},
    {title:"ILC & Intelligent Lighting Controls",desc:"Master the ILC portfolio — sensors, drivers, gateways, and software. Understand how ILC integrates with BMS/BAS.",tip:"In any project with a BMS, ILC integration is a specification requirement.",
     resources:[{id:"c7",type:"doc",label:"ILC Product Guide",url:""},{id:"c8",type:"doc",label:"BMS Integration Overview",url:""},{id:"c9",type:"doc",label:"ASHRAE 90.1 Controls Requirements",url:""}]},
    {title:"SPEC 360 Proficiency & Controls Design",desc:"Achieve full proficiency in SPEC 360 for controls system design and lighting control zone layouts.",tip:"A complete controls specification makes substitution nearly impossible.",
     resources:[{id:"c10",type:"doc",label:"SPEC 360 User Guide",url:""},{id:"c11",type:"doc",label:"Controls Zone Design Guide",url:""},{id:"c12",type:"doc",label:"Sensor Placement Standards",url:""}]},
    {title:"Controls Quoting — Small to Enterprise",desc:"Build quoting capability from simple $15K retrofits to $500K+ enterprise WLX deployments.",tip:"Separate your controls quote into three components: hardware, commissioning, and ongoing support/warranty.",
     resources:[{id:"c13",type:"doc",label:"Controls Quoting Playbook",url:""},{id:"c14",type:"doc",label:"Scope Definition Template",url:""},{id:"c15",type:"doc",label:"Enterprise Proposal Framework",url:""}]},
    {title:"WLX Certification Achievement",desc:"Complete WLX Certification — the formal credential that establishes your controls champion.",tip:"Agencies with at least one WLX-certified rep are 3x more likely to be spec'd on connected projects.",
     resources:[{id:"c16",type:"doc",label:"WLX Certification Study Guide",url:""},{id:"c17",type:"doc",label:"Certification Exam Prep",url:""},{id:"c18",type:"doc",label:"Post-Cert Marketing Assets",url:""}]},
    {title:"Demo Case Development",desc:"Build a professional WLX demo case and develop a structured demonstration methodology.",tip:"Always leave a demo case on-site for 48–72 hours. Buyers who live with the technology become advocates.",
     resources:[{id:"c19",type:"doc",label:"Demo Case Setup Guide",url:""},{id:"c20",type:"doc",label:"Demo Script by Audience",url:""},{id:"c21",type:"doc",label:"Demo Best Practices",url:""}]},
    {title:"On-Site Commissioning Excellence",desc:"Develop in-house commissioning capability for WLX and ILC systems.",tip:"Treat every commissioned project as a potential reference site from day one.",
     resources:[{id:"c22",type:"doc",label:"Commissioning Standards Guide",url:""},{id:"c23",type:"doc",label:"WLX Commissioning Checklist",url:""},{id:"c24",type:"doc",label:"Reference Site Development Guide",url:""}]},
    {title:"Attachment Rate Optimization",desc:"Analyze your current controls attachment rate. Set a target of 10% of total agency revenue.",tip:"Controls attachment rate increases when it becomes a standard agenda item on every project review.",
     resources:[{id:"c25",type:"doc",label:"Attachment Rate Calculator",url:""},{id:"c26",type:"doc",label:"Controls Opportunity Identification Guide",url:""},{id:"c27",type:"doc",label:"10% Revenue Target Roadmap",url:""}]},
    {title:"Benchmarking & Industry Leadership",desc:"Identify the top-performing controls agency in the CLS network and request a formal benchmarking session.",tip:"Speak at one industry event per year on a controls topic.",
     resources:[{id:"c28",type:"doc",label:"CLS Agency Benchmarking Program",url:""},{id:"c29",type:"doc",label:"IES Membership Guide",url:""},{id:"c30",type:"doc",label:"Thought Leadership Playbook",url:""}]},
  ],
};
const TEAM_ROLES=[{role:"Customer Service",icon:"🎧",color:"#2563EB"},{role:"Pricing",icon:"💲",color:"#7C3AED"},{role:"Applications",icon:"📐",color:"#D97706"},{role:"Post Sales",icon:"🔧",color:"#059669"},{role:"DSS",icon:"📊",color:"#0891B2"},{role:"Spec RSM",icon:"🏗️",color:"#7C3AED"},{role:"Area VP",icon:"⭐",color:"#13294B"},{role:"Controls Specialist",icon:"💡",color:"#059669"}];

function TeamCard({member,onUpdate}){
  const [editing,setEditing]=useState(false);const [draft,setDraft]=useState(member);
  const initials=(draft.firstName?.[0]??"")+(draft.lastName?.[0]??"");
  const hasData=draft.firstName||draft.lastName||draft.email||draft.phone;
  const save=()=>{onUpdate(draft);setEditing(false);};
  return(
    <Card style={{overflow:"hidden"}}>
      <div style={{background:member.color+"12",padding:"10px 14px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid #E7E7E7"}}>
        <span>{member.icon}</span><span style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:member.color}}>{member.role}</span>
        <button onClick={()=>{setDraft(member);setEditing(e=>!e);}} style={{marginLeft:"auto",padding:"3px 10px",border:"1.5px solid "+member.color+"40",borderRadius:6,background:"transparent",color:member.color,fontSize:10,fontWeight:700,cursor:"pointer"}}>{editing?"Cancel":"Edit"}</button>
      </div>
      {editing?(
        <div style={{padding:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["firstName","First Name"],["lastName","Last Name"],["phone","Phone"],["email","Email"]].map(([k,pl])=>(
              <input key={k} value={draft[k]||""} onChange={e=>setDraft(p=>({...p,[k]:e.target.value}))} placeholder={pl} style={{padding:"7px 10px",border:"1.5px solid #DDD",borderRadius:7,fontSize:11,outline:"none",fontFamily:"Montserrat,sans-serif"}}/>
            ))}
            <input value={draft.areas||""} onChange={e=>setDraft(p=>({...p,areas:e.target.value}))} placeholder="Areas of support" style={{padding:"7px 10px",border:"1.5px solid #DDD",borderRadius:7,fontSize:11,outline:"none",gridColumn:"1/-1",fontFamily:"Montserrat,sans-serif"}}/>
          </div>
          <button onClick={save} style={{marginTop:10,width:"100%",padding:"8px",background:member.color,color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer"}}>Save Contact</button>
        </div>
      ):(
        <div style={{padding:14,display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:member.color+"15",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"2px solid "+member.color+"30",fontSize:hasData?16:20,fontWeight:900,color:member.color}}>{hasData?(initials||"?"):member.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            {hasData?(<><div style={{fontWeight:800,fontSize:14,color:CL.navy,marginBottom:2}}>{draft.firstName} {draft.lastName}</div>{draft.phone&&<div style={{fontSize:12,color:"#666"}}>📞 {draft.phone}</div>}{draft.email&&<div style={{fontSize:12,color:member.color,wordBreak:"break-all"}}>✉️ {draft.email}</div>}{draft.areas&&<div style={{fontSize:11,color:"#aaa",fontWeight:600,marginTop:4}}>📌 {draft.areas}</div>}</>)
            :(<div style={{fontSize:12,color:"#ccc",fontWeight:600,paddingTop:8}}>No contact added yet</div>)}
          </div>
        </div>
      )}
    </Card>
  );
}

function KeyPlayersTracker({stepTitle,segColor}){
  const [players,setPlayers]=useState([]);const [showForm,setShowForm]=useState(false);const [expandId,setExpandId]=useState(null);const [editId,setEditId]=useState(null);
  const blank={name:"",company:"",phone:"",email:"",actionTaken:"",nextSteps:"",status:"active"};
  const [form,setForm]=useState(blank);
  const statusColor={active:"#059669",follow_up:"#D97706",complete:"#2563EB",paused:"#9F9F9F"};
  const statusLabel={active:"Active",follow_up:"Follow Up",complete:"Complete",paused:"Paused"};
  const save=()=>{
    if(!form.name&&!form.company)return;
    const p={...form,id:editId||Date.now(),createdAt:nowTs()};
    setPlayers(prev=>editId?prev.map(x=>x.id===editId?p:x):[...prev,p]);
    setForm(blank);setEditId(null);setShowForm(false);
  };
  return(
    <div style={{border:"1px solid "+segColor+"30",borderRadius:10,overflow:"hidden",marginTop:16}}>
      <div style={{background:segColor+"0E",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid "+segColor+"20"}}>
        <div><div style={{fontSize:11,fontWeight:800,color:segColor,textTransform:"uppercase"}}>📍 Key Players Tracker</div><div style={{fontSize:11,color:"#888",marginTop:2}}>{stepTitle}</div></div>
        <button onClick={()=>setShowForm(p=>!p)} style={{padding:"5px 12px",border:"1.5px solid "+segColor,borderRadius:7,background:showForm?segColor:"#fff",color:showForm?"#fff":segColor,fontWeight:700,fontSize:11,cursor:"pointer"}}>{showForm?"✕ Cancel":"+ Add Player"}</button>
      </div>
      {showForm&&(
        <div style={{padding:"14px 16px",background:"#FAFAFA",borderBottom:"1px solid "+segColor+"20"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            {[["name","Contact Name *"],["company","Company *"],["phone","Phone"],["email","Email"]].map(([k,pl])=>(
              <input key={k} value={form[k]||""} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} placeholder={pl} style={{padding:"7px 10px",border:"1.5px solid #DDD",borderRadius:7,fontSize:11,outline:"none",fontFamily:"Montserrat,sans-serif"}}/>
            ))}
            {[["actionTaken","Action taken…"],["nextSteps","Next steps…"]].map(([k,pl])=>(
              <textarea key={k} value={form[k]||""} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} placeholder={pl} rows={2} style={{padding:"7px 10px",border:"1.5px solid #DDD",borderRadius:7,fontSize:11,outline:"none",resize:"none",fontFamily:"Montserrat,sans-serif"}}/>
            ))}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))} style={{padding:"6px 10px",border:"1.5px solid #DDD",borderRadius:7,fontSize:11,fontFamily:"Montserrat,sans-serif",outline:"none"}}>
              {Object.entries(statusLabel).map(([k,v])=><option key={k} value={k}>{v}</option>)}
            </select>
            <button onClick={save} style={{padding:"7px 18px",background:segColor,color:"#fff",border:"none",borderRadius:7,fontWeight:700,fontSize:11,cursor:"pointer"}}>Save Player</button>
          </div>
        </div>
      )}
      <div style={{padding:players.length===0?"12px 16px":"0"}}>
        {players.length===0?<div style={{textAlign:"center",fontSize:11,color:"#CCC",fontWeight:600,padding:"10px 0"}}>No key players added yet.</div>
        :players.map((p,pi)=>{
          const exp=expandId===p.id;
          return(
            <div key={p.id} style={{borderBottom:pi<players.length-1?"1px solid #F5F5F5":"none"}}>
              <div onClick={()=>setExpandId(exp?null:p.id)} style={{padding:"10px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,background:"#fff"}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:segColor+"15",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:segColor,flexShrink:0}}>{(p.name?.[0]||"?").toUpperCase()}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:2}}>
                    <span style={{fontWeight:800,fontSize:12,color:CL.navy}}>{p.name||"Unnamed"}</span>
                    {p.company&&<span style={{fontSize:12,color:"#888"}}>· {p.company}</span>}
                    <span style={{fontSize:10,fontWeight:700,color:statusColor[p.status],background:statusColor[p.status]+"15",padding:"2px 8px",borderRadius:10}}>{statusLabel[p.status]}</span>
                  </div>
                  {p.nextSteps&&<div style={{fontSize:11,color:segColor,fontWeight:600}}>→ {p.nextSteps}</div>}
                </div>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={e=>{e.stopPropagation();setForm(p);setEditId(p.id);setShowForm(true);}} style={{padding:"3px 8px",border:"1.5px solid #DDD",borderRadius:5,background:"#fff",color:"#888",fontSize:10,fontWeight:700,cursor:"pointer"}}>Edit</button>
                  <button onClick={e=>{e.stopPropagation();setPlayers(prev=>prev.filter(x=>x.id!==p.id));}} style={{padding:"3px 6px",border:"1.5px solid #FFCDD2",borderRadius:5,background:"#fff",color:"#EF4444",fontSize:10,fontWeight:700,cursor:"pointer"}}>✕</button>
                </div>
              </div>
              {exp&&(
                <div style={{padding:"10px 16px 14px",background:"#FAFAFA",borderTop:"1px solid #F5F5F5"}}>
                  {p.phone&&<div style={{fontSize:11,color:"#555",marginBottom:2}}>📞 {p.phone}</div>}
                  {p.email&&<div style={{fontSize:11,color:segColor,marginBottom:6}}>✉️ {p.email}</div>}
                  {p.actionTaken&&<><div style={{fontSize:10,fontWeight:700,color:"#AAA",textTransform:"uppercase",marginBottom:3}}>Action Taken</div><div style={{fontSize:11,color:"#555",marginBottom:8}}>{p.actionTaken}</div></>}
                  {p.nextSteps&&<div style={{background:segColor+"0A",borderRadius:7,padding:"8px 12px",borderLeft:"3px solid "+segColor}}><div style={{fontSize:10,fontWeight:700,color:segColor,marginBottom:3}}>Next Steps</div><div style={{fontSize:12,color:CL.navy,fontWeight:600}}>{p.nextSteps}</div></div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Resource type config ──────────────────────────────────
const RES_TYPES=[
  {key:"doc",    label:"Document",  icon:"📄", color:"#2563EB"},
  {key:"video",  label:"Video",     icon:"▶️",  color:"#DC2626"},
  {key:"podcast",label:"Podcast",   icon:"🎙️", color:"#7C3AED"},
  {key:"link",   label:"Link",      icon:"🔗", color:"#0891B2"},
  {key:"form",   label:"Form/Tool", icon:"🛠️", color:"#D97706"},
];
const resType=k=>RES_TYPES.find(t=>t.key===k)||RES_TYPES[0];

// Extract YouTube video ID from any YT URL format
function ytId(url){
  if(!url)return null;
  const m=url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m?m[1]:null;
}

function ResourceCard({res,segColor,onEdit,onDelete}){
  const [playing,setPlaying]=useState(false);
  const rt=resType(res.type);
  const vid=res.type==="video"?ytId(res.url):null;
  return(
    <div style={{border:"1.5px solid #E7E7E7",borderRadius:10,overflow:"hidden",background:"#fff"}}>
      {/* YouTube embed */}
      {res.type==="video"&&vid&&(
        <div style={{position:"relative",paddingTop:"56.25%",background:"#000",cursor:"pointer"}} onClick={()=>setPlaying(true)}>
          {playing?(
            <iframe src={`https://www.youtube.com/embed/${vid}?autoplay=1`} allow="autoplay;encrypted-media" allowFullScreen
              style={{position:"absolute",inset:0,width:"100%",height:"100%",border:"none"}}/>
          ):(
            <>
              <img src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt={res.label}
                style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.35)"}}>
                <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(220,38,38,0.92)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:0,height:0,borderTop:"12px solid transparent",borderBottom:"12px solid transparent",borderLeft:"20px solid #fff",marginLeft:4}}/>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {/* Podcast player */}
      {res.type==="podcast"&&res.url&&(
        <div style={{background:"#F3F0FF",padding:"10px 14px",borderBottom:"1px solid #E7E7E7",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:9,background:"#7C3AED",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🎙️</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,fontWeight:700,color:"#7C3AED",marginBottom:4}}>Podcast Episode</div>
            <audio controls src={res.url} style={{width:"100%",height:30}}/>
          </div>
        </div>
      )}
      {/* Card body */}
      <div style={{padding:"10px 14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
          <span style={{fontSize:14}}>{rt.icon}</span>
          <span style={{fontSize:10,fontWeight:800,color:rt.color,textTransform:"uppercase",letterSpacing:"0.08em"}}>{rt.label}</span>
          {!res.url&&<span style={{fontSize:9,fontWeight:700,color:"#F59E0B",background:"#FEF3C7",padding:"1px 6px",borderRadius:4,marginLeft:"auto"}}>No URL yet</span>}
        </div>
        <div style={{fontWeight:700,fontSize:12,color:"#13294B",lineHeight:1.4,marginBottom:8}}>{res.label||"Untitled resource"}</div>
        {res.url&&res.type!=="video"&&res.type!=="podcast"&&(
          <a href={res.url} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,color:"#2563EB",fontWeight:700,textDecoration:"none",padding:"4px 10px",background:"#EFF6FF",borderRadius:6,border:"1px solid #BFDBFE",marginBottom:8}}>
            Open ↗
          </a>
        )}
        <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
          <button onClick={()=>onEdit(res)} style={{padding:"3px 9px",border:"1.5px solid #DDD",borderRadius:6,background:"#fff",color:"#888",fontSize:10,fontWeight:700,cursor:"pointer"}}>✏️ Edit</button>
          <button onClick={()=>onDelete(res.id)} style={{padding:"3px 7px",border:"1.5px solid #FFCDD2",borderRadius:6,background:"#fff",color:"#EF4444",fontSize:10,fontWeight:700,cursor:"pointer"}}>✕</button>
        </div>
      </div>
    </div>
  );
}

function ResourceManager({stepId,initialResources,segColor}){
  const [resources,setResources]=useState(initialResources||[]);
  const [showForm,setShowForm]=useState(false);
  const [editRes,setEditRes]=useState(null);
  const [form,setForm]=useState({type:"video",label:"",url:""});

  const openAdd=()=>{setForm({type:"video",label:"",url:""});setEditRes(null);setShowForm(true);};
  const openEdit=(res)=>{setForm({type:res.type,label:res.label,url:res.url||""});setEditRes(res);setShowForm(true);};
  const closeForm=()=>{setShowForm(false);setEditRes(null);};

  const save=()=>{
    if(!form.label.trim())return;
    if(editRes){
      setResources(prev=>prev.map(r=>r.id===editRes.id?{...r,...form}:r));
    }else{
      setResources(prev=>[...prev,{id:"u"+Date.now(),type:form.type,label:form.label,url:form.url}]);
    }
    closeForm();
  };

  const del=(id)=>setResources(prev=>prev.filter(r=>r.id!==id));

  const iStyle={width:"100%",padding:"9px 12px",border:"1.5px solid #DDD",borderRadius:8,fontSize:12,
    outline:"none",boxSizing:"border-box",fontFamily:"Montserrat,sans-serif"};

  // Split: seeded docs vs rich media
  const docs=resources.filter(r=>r.type==="doc");
  const rich=resources.filter(r=>r.type!=="doc");

  return(
    <div style={{marginTop:16}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div style={{fontSize:10,fontWeight:800,color:"#9F9F9F",textTransform:"uppercase",letterSpacing:"0.1em"}}>Resources</div>
        <button onClick={openAdd} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",border:"1.5px solid "+segColor,borderRadius:7,background:"#fff",color:segColor,fontWeight:700,fontSize:11,cursor:"pointer"}}>
          ＋ Add Resource
        </button>
      </div>

      {/* Add/Edit form */}
      {showForm&&(
        <div style={{background:"#F7F7F7",borderRadius:10,padding:"14px 16px",marginBottom:14,border:"1.5px solid "+segColor+"40"}}>
          <div style={{fontSize:12,fontWeight:800,color:"#13294B",marginBottom:12}}>{editRes?"Edit Resource":"Add Resource"}</div>
          {/* Type selector */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
            {RES_TYPES.map(t=>(
              <button key={t.key} onClick={()=>setForm(p=>({...p,type:t.key}))} style={{
                display:"flex",alignItems:"center",gap:4,padding:"5px 12px",
                borderRadius:20,border:"2px solid "+(form.type===t.key?t.color:"#DDD"),
                background:form.type===t.key?t.color+"15":"#fff",
                color:form.type===t.key?t.color:"#888",fontWeight:700,fontSize:11,cursor:"pointer"
              }}>{t.icon} {t.label}</button>
            ))}
          </div>
          {/* Label */}
          <div style={{marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",marginBottom:4}}>Label / Title *</div>
            <input value={form.label} onChange={e=>setForm(p=>({...p,label:e.target.value}))}
              placeholder={form.type==="video"?"e.g. WLX Demo Overview":form.type==="podcast"?"e.g. Lighting Industry Podcast Ep. 12":"e.g. CRM Setup Guide"}
              style={iStyle}/>
          </div>
          {/* URL */}
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",marginBottom:4}}>
              {form.type==="video"?"YouTube URL":form.type==="podcast"?"Podcast Audio URL (mp3/m4a)":"URL"}
            </div>
            <input value={form.url} onChange={e=>setForm(p=>({...p,url:e.target.value}))}
              placeholder={form.type==="video"?"https://youtube.com/watch?v=...":form.type==="podcast"?"https://...podcast.mp3":"https://..."}
              style={{...iStyle,borderColor:form.url&&form.type==="video"&&!ytId(form.url)?"#EF4444":"#DDD"}}/>
            {form.type==="video"&&form.url&&!ytId(form.url)&&(
              <div style={{fontSize:10,color:"#EF4444",marginTop:3,fontWeight:600}}>⚠️ Paste a valid YouTube URL (youtube.com/watch?v=... or youtu.be/...)</div>
            )}
            {form.type==="video"&&ytId(form.url)&&(
              <div style={{fontSize:10,color:"#059669",marginTop:3,fontWeight:600}}>✓ YouTube video detected — ID: {ytId(form.url)}</div>
            )}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={save} disabled={!form.label.trim()} style={{padding:"8px 20px",background:form.label.trim()?segColor:"#DDD",color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:12,cursor:form.label.trim()?"pointer":"default"}}>
              {editRes?"Update":"Add Resource"}
            </button>
            <button onClick={closeForm} style={{padding:"8px 14px",border:"1.5px solid #DDD",borderRadius:8,background:"#fff",color:"#888",fontWeight:600,fontSize:12,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}

      {/* Rich media grid */}
      {rich.length>0&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10,marginBottom:12}}>
          {rich.map(r=><ResourceCard key={r.id} res={r} segColor={segColor} onEdit={openEdit} onDelete={del}/>)}
        </div>
      )}

      {/* Docs list */}
      {docs.length>0&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {docs.map(r=>{
            const rt=resType(r.type);
            return(
              <div key={r.id} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:segColor+"0E",borderRadius:8,border:"1px solid "+segColor+"25"}}>
                {r.url?(
                  <a href={r.url} target="_blank" rel="noreferrer" style={{fontSize:11,fontWeight:700,color:segColor,textDecoration:"none"}}>{rt.icon} {r.label}</a>
                ):(
                  <span style={{fontSize:11,fontWeight:700,color:segColor}}>{rt.icon} {r.label}</span>
                )}
                <button onClick={()=>openEdit(r)} style={{padding:"1px 5px",border:"none",background:"transparent",color:segColor,fontSize:11,cursor:"pointer",opacity:0.6}}>✏️</button>
                <button onClick={()=>del(r.id)} style={{padding:"1px 4px",border:"none",background:"transparent",color:"#EF4444",fontSize:11,cursor:"pointer",opacity:0.6}}>✕</button>
              </div>
            );
          })}
        </div>
      )}

      {resources.length===0&&!showForm&&(
        <div style={{textAlign:"center",padding:"20px",background:"#F7F7F7",borderRadius:10,border:"1.5px dashed #DDD"}}>
          <div style={{fontSize:24,marginBottom:6}}>📎</div>
          <div style={{fontSize:12,color:"#aaa",fontWeight:600}}>No resources yet — add a video, podcast, or document link</div>
        </div>
      )}
    </div>
  );
}

function LearnPage({segKey}){
  const seg=SEG.find(s=>s.key===segKey);const steps=STEPS[segKey];
  const [tab,setTab]=useState("path");const [activeStep,setActiveStep]=useState(0);const [completed,setCompleted]=useState([]);
  const [team,setTeam]=useState(TEAM_ROLES.map((r,i)=>({...r,id:i+1,firstName:"",lastName:"",phone:"",email:"",areas:""})));
  const step=steps[activeStep];const toggleDone=i=>setCompleted(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);
  return(
    <div style={{padding:24,maxWidth:960,margin:"0 auto"}}>
      <div style={{marginBottom:16}}><div style={{fontSize:10,fontWeight:800,color:"#9F9F9F",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>Learning Path</div><div style={{fontSize:24,fontWeight:900,color:CL.navy}}>{seg.icon} {seg.label} Excellence</div><div style={{fontSize:13,color:"#888",marginTop:2}}>{steps.length} steps · Complete in any order</div></div>
      <div style={{background:seg.color,borderRadius:14,padding:"18px 22px",marginBottom:20,display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
        <div><div style={{color:"rgba(255,255,255,0.7)",fontSize:10,fontWeight:800,textTransform:"uppercase",marginBottom:4}}>Progress</div><div style={{color:"#fff",fontSize:36,fontWeight:900,lineHeight:1}}>{completed.length}/{steps.length}</div></div>
        <div style={{flex:1,minWidth:180}}>
          <div style={{height:10,background:"rgba(255,255,255,0.25)",borderRadius:10,overflow:"hidden"}}><div style={{width:Math.round(completed.length/steps.length*100)+"%",height:"100%",background:"#fff",borderRadius:10,transition:"width 0.5s"}}/></div>
          <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,marginTop:4}}>{Math.round(completed.length/steps.length*100)}% complete</div>
        </div>
      </div>
      <div style={{display:"flex",gap:4,marginBottom:20,borderBottom:"2px solid #E7E7E7"}}>
        {[{key:"path",label:"📚 Learning Path"},{key:"team",label:"👥 Meet Your Team"}].map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)} style={{padding:"9px 20px",border:"none",background:"transparent",fontWeight:700,fontSize:13,cursor:"pointer",color:tab===t.key?seg.color:"#aaa",borderBottom:"3px solid "+(tab===t.key?seg.color:"transparent"),marginBottom:-2,fontFamily:"Montserrat,sans-serif"}}>{t.label}</button>
        ))}
      </div>
      {tab==="path"&&(
        <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:20}}>
          <div>
            {steps.map((s,i)=>{const done=completed.includes(i);const active=activeStep===i;return(
              <div key={i} style={{position:"relative",paddingBottom:8}}>
                {i<steps.length-1&&<div style={{position:"absolute",left:14,top:34,bottom:0,width:2,background:done?"#059669":"#E7E7E7"}}/>}
                <button onClick={()=>setActiveStep(i)} style={{width:"100%",display:"flex",alignItems:"flex-start",gap:10,padding:"9px 10px",borderRadius:10,border:"2px solid "+(active?seg.color:"transparent"),background:active?seg.color+"10":"transparent",cursor:"pointer",textAlign:"left"}}>
                  <div style={{width:24,height:24,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:11,background:done?"#059669":active?seg.color:"#E7E7E7",color:done||active?"#fff":"#999"}}>{done?"✓":i+1}</div>
                  <div style={{fontSize:11,fontWeight:700,color:active?seg.color:CL.navy,lineHeight:1.3}}>{s.title}</div>
                </button>
              </div>
            );})}
            <div style={{marginTop:8,padding:"10px 12px",background:"#F0F0F0",borderRadius:9}}>
              <div style={{fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase",marginBottom:5}}>Progress</div>
              <div style={{height:8,background:"#E0E0E0",borderRadius:8,overflow:"hidden"}}><div style={{width:Math.round(completed.length/steps.length*100)+"%",height:"100%",background:seg.color,borderRadius:8}}/></div>
              <div style={{fontSize:11,color:"#888",marginTop:4,fontWeight:600}}>{completed.length}/{steps.length} complete</div>
            </div>
          </div>
          <Card style={{overflow:"hidden"}}>
            <div style={{background:seg.color,padding:"18px 22px"}}>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:10,fontWeight:800,textTransform:"uppercase",marginBottom:4}}>Step {activeStep+1} of {steps.length}</div>
              <div style={{color:"#fff",fontSize:17,fontWeight:900,lineHeight:1.3}}>{step.title}</div>
            </div>
            <div style={{padding:22}}>
              <p style={{fontSize:13,color:"#555",lineHeight:1.8,marginBottom:14}}>{step.desc}</p>
              {step.tip&&(
                <div style={{background:seg.color+"0D",border:"1px solid "+seg.color+"30",borderLeft:"4px solid "+seg.color,borderRadius:"0 8px 8px 0",padding:"10px 14px",marginBottom:16}}>
                  <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",color:seg.color,marginBottom:3}}>💡 Pro Tip</div>
                  <div style={{fontSize:12,color:"#555",lineHeight:1.6}}>{step.tip}</div>
                </div>
              )}
              <ResourceManager
                stepId={segKey+"_"+activeStep}
                initialResources={step.resources||[]}
                segColor={seg.color}
              />
              <KeyPlayersTracker stepTitle={step.title} segColor={seg.color}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid #F0F0F0",paddingTop:16,marginTop:16}}>
                <button onClick={()=>setActiveStep(Math.max(0,activeStep-1))} disabled={activeStep===0} style={{padding:"9px 18px",border:"2px solid #DDD",borderRadius:9,background:"#fff",color:"#777",fontWeight:700,fontSize:12,cursor:"pointer",opacity:activeStep===0?0.4:1}}>← Previous</button>
                <button onClick={()=>{toggleDone(activeStep);if(activeStep<steps.length-1)setActiveStep(activeStep+1);}} style={{padding:"10px 22px",background:completed.includes(activeStep)?"#059669":seg.color,color:"#fff",border:"none",borderRadius:9,fontWeight:800,fontSize:13,cursor:"pointer"}}>
                  {completed.includes(activeStep)?"✓ Completed — Next →":"Mark Complete & Continue →"}
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
      {tab==="team"&&(
        <div>
          <div style={{background:seg.color,borderRadius:12,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:14}}>
            <div style={{fontSize:28}}>👥</div>
            <div><div style={{color:"#fff",fontWeight:900,fontSize:15,marginBottom:2}}>Your {seg.label} Support Team</div><div style={{color:"rgba(255,255,255,0.7)",fontSize:12}}>Click Edit on any card to add contact details.</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
            {team.map(m=><TeamCard key={m.id} member={m} onUpdate={u=>setTeam(p=>p.map(x=>x.id===u.id?u:x))}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

const WIN_META={
  last30:{label:"Last 30 Days",sub:"Mar 25 – Apr 24, 2026",color:"#6B7280"},
  current:{label:"Current",sub:"Apr 24 – May 24, 2026",color:CL.orange},
  next30:{label:"Next 30 Days",sub:"May 24 – Jun 24, 2026",color:CL.navy},
};
const WIN_ACTIONS={
  last30:[
    {id:"L1", agencyId:"Illumination Systems",title:"Q2 Distributor Planning Sessions",        segment:"stock",    owner:"Patrick Sullivan", status:"complete",   priority:"high",   metric:"Sessions completed",          actual:3, target:3, dueDate:"2026-03-25",tags:["distributor","planning"],    desc:"Joint business planning with top 3 stock distributors. Pre-committed Q2 promo inventory and agreed on Walkaway Pricing floors for each account.",comments:[{author:"David Park",role:"rsm",body:"Great execution — all 3 distributors pre-committed Q2 promo. Share the session template with the network.",ts:"Mar 26"}]},
    {id:"L2", agencyId:"Chesapeake",           title:"WLX Level 2 Certification — Full Team",  segment:"connected",owner:"George Hart",      status:"complete",   priority:"high",   metric:"Reps certified",              actual:4, target:4, dueDate:"2026-03-30",tags:["WLX","certification"],    desc:"Complete WLX Level 2 certification for all 4 quota-bearing reps. First agency in the Northeast to achieve full-team certification.",comments:[{author:"Emily Walsh",role:"rsm",body:"Outstanding — first agency in NE to hit full team WLX L2. Nominating for Q2 Controls Champion award.",ts:"Mar 31"}]},
    {id:"L3", agencyId:"Premier",              title:"Nemalux Lunch & Learn — Gulf 3-City",    segment:"industrial",owner:"Marcus Bell",     status:"complete",   priority:"medium", metric:"Events delivered",            actual:3, target:3, dueDate:"2026-04-01",tags:["Nemalux","events"],       desc:"3-city industrial lunch & learn targeting plant managers and maintenance directors across Houston, Baton Rouge, and New Orleans.",comments:[]},
    {id:"L4", agencyId:"Ardd + Winter TN",     title:"Nashville A&E CEU Campaign",             segment:"spec",     owner:"Agency Lead",      status:"overdue",    priority:"high",   metric:"CEU sessions delivered",      actual:2, target:5, dueDate:"2026-04-05",tags:["CEU","A&E"],            desc:"Deliver AIA-registered CEU to 5 target A&E firms in Nashville and Knoxville. 2 completed; 3 firms rescheduled due to project conflicts.",comments:[{author:"David Park",role:"rsm",body:"Move the 3 remaining to May window. Confirm new dates by Apr 15.",ts:"Apr 8"}]},
    {id:"L5", agencyId:"Mlazgar",              title:"MRAM Kit Placement — Tier 1 Accounts",   segment:"stock",    owner:"Agency Lead",      status:"complete",   priority:"medium", metric:"MRAM kits placed",            actual:6, target:6, dueDate:"2026-03-31",tags:["MRAM","stock"],         desc:"Place MRAM new product arrival kits at 6 key distributor locations ahead of Q2 promo launch.",comments:[]},
    {id:"L6", agencyId:"CAL",                  title:"Specifier CRM Data Cleanse",             segment:"spec",     owner:"Agency Lead",      status:"complete",   priority:"low",    metric:"Records updated",             actual:38,target:40,dueDate:"2026-03-28",tags:["CRM","pipeline"],        desc:"Audit and update all open specification opportunities in CRM. Remove stale records; confirm project status on top 15 active specs.",comments:[]},
    {id:"L7", agencyId:"HI TECH",              title:"Walkaway Pricing Rollout — Distributors", segment:"stock",   owner:"Agency Lead",      status:"complete",   priority:"high",   metric:"Distributors onboarded",      actual:4, target:4, dueDate:"2026-04-03",tags:["pricing","distributor"],  desc:"Train all 4 primary distributor reps on CLS Walkaway Pricing methodology. Distribute price floor reference cards.",comments:[]},
    {id:"L8", agencyId:"Reflex Boston",        title:"Construct Connect Q1 Lead Review",       segment:"spec",     owner:"Agency Lead",      status:"complete",   priority:"medium", metric:"Leads reviewed",              actual:18,target:15,dueDate:"2026-04-10",tags:["Construct Connect","pipeline"],desc:"Review all Q1 Construct Connect leads. Qualify top opportunities for Q2 spec outreach. Identified 6 high-priority projects.",comments:[{author:"Emily Walsh",role:"rsm",body:"Strong pipeline. Prioritize the two healthcare projects — strong APG fit.",ts:"Apr 11"}]},
    {id:"L9", agencyId:"Tampa Bay Lighting",   title:"WLX Demo Case Build & Test",             segment:"connected",owner:"Agency Lead",      status:"complete",   priority:"high",   metric:"Demo cases operational",      actual:2, target:2, dueDate:"2026-04-08",tags:["WLX","demo"],           desc:"Assemble and test 2 WLX demo cases with full sensor kit. Validated occupancy, daylight harvesting, and scheduling functions.",comments:[]},
    {id:"L10",agencyId:"2M",                   title:"Industrial Territory Mapping — Kentucky", segment:"industrial",owner:"Agency Lead",    status:"complete",   priority:"high",   metric:"Accounts mapped",             actual:12,target:10,dueDate:"2026-04-12",tags:["industrial","territory"],desc:"Identify and map top industrial retrofit opportunities. Prioritized food & beverage, cold storage, and warehousing verticals.",comments:[]},
    {id:"L11",agencyId:"Clarus",               title:"LEX NPI Carousel — Spring Launch",       segment:"spec",     owner:"Agency Lead",      status:"complete",   priority:"medium", metric:"Specifiers subscribed",       actual:22,target:20,dueDate:"2026-04-15",tags:["LEX","NPI"],            desc:"Post spring NPI carousels for HALO Commercial and Portfolio Linear families. Grow specifier subscriber base to 20+.",comments:[]},
    {id:"L12",agencyId:"Medgar",               title:"Q2 Stock Promo Pre-Commitment",          segment:"stock",    owner:"Agency Lead",      status:"in_progress",priority:"high",   metric:"Distributors pre-committed",  actual:3, target:5, dueDate:"2026-04-20",tags:["promo","Q2"],           desc:"Secure Q2 promotional pre-commitments from top 5 distributors before cycle opens. Currently 3 of 5 confirmed.",comments:[{author:"David Park",role:"rsm",body:"Push hard on WESCO and Rexel this week — cycle opens April 25.",ts:"Apr 18"}]},
    {id:"L13",agencyId:"Illumination Systems", title:"Kaiser Permanente Site Survey",          segment:"connected",owner:"Patrick Sullivan", status:"in_progress",priority:"high",   metric:"Facilities surveyed",         actual:4, target:12,dueDate:"2026-04-24",tags:["national account","WLX"],desc:"Site survey and controls scope for Kaiser Permanente 12-campus connected lighting retrofit. Completed 4 of 12 facilities.",comments:[]},
    {id:"L14",agencyId:"Premier",              title:"Utility Rebate Applications — Industrial",segment:"industrial",owner:"Marcus Bell",   status:"complete",   priority:"medium", metric:"Applications submitted",      actual:4, target:4, dueDate:"2026-04-18",tags:["rebates","industrial"],   desc:"Submit CenterPoint and Entergy utility rebate applications for 4 completed industrial retrofit projects.",comments:[]},
    {id:"L15",agencyId:"Chesapeake",           title:"APG Brand Training — Full Team",         segment:"spec",     owner:"George Hart",      status:"complete",   priority:"medium", metric:"Reps trained",                actual:6, target:6, dueDate:"2026-04-14",tags:["APG","training"],        desc:"Full team APG brand proficiency training covering Halo Commercial, Portfolio, Metalux, and Greengate.",comments:[]},
  ],
  current:[
    {id:"C1", agencyId:"Chesapeake",           title:"WLX Demo Roadshow — Mid-Atlantic",       segment:"connected",owner:"George Hart",      status:"in_progress",priority:"high",   metric:"Demos delivered",             actual:2, target:5, dueDate:"2026-05-10",tags:["WLX","demo"],           desc:"Deliver 5 WLX live demonstrations to owner/operator accounts across Baltimore, DC, and Philadelphia. 2 completed, 3 scheduled.",comments:[{author:"Emily Walsh",role:"rsm",body:"Baltimore demo went great — leave the case with Cushman & Wakefield for the week.",ts:"Apr 26"}]},
    {id:"C2", agencyId:"Ardd + Winter TN",     title:"Industrial Pipeline — Tennessee",        segment:"industrial",owner:"Agency Lead",     status:"in_progress",priority:"high",   metric:"Qualified opportunities",     actual:7, target:12,dueDate:"2026-05-12",tags:["industrial","pipeline"],  desc:"Identify and qualify 12 industrial retrofit opportunities across Nashville, Chattanooga, and Knoxville corridors.",comments:[]},
    {id:"C3", agencyId:"Premier",              title:"Q2 Stock Promo — Full Activation",       segment:"stock",    owner:"Marcus Bell",      status:"in_progress",priority:"high",   metric:"% distributor participation", actual:78,target:95,dueDate:"2026-05-05",tags:["promo","Q2"],           desc:"Activate Q2 stock promotion with all distributor partners in Gulf territory. Drive pre-commitment on HALO and Metalux focus SKUs.",comments:[{author:"Jared Lee",role:"vp",body:"Strong start — push WESCO Houston to get to 95%. They have budget this quarter.",ts:"Apr 28"}]},
    {id:"C4", agencyId:"Illumination Systems", title:"Kaiser Permanente — Spec Packages",     segment:"connected",owner:"Patrick Sullivan", status:"in_progress",priority:"high",   metric:"Facilities spec-complete",    actual:7, target:12,dueDate:"2026-05-08",tags:["national account","WLX"],desc:"Complete WLX specification packages for all 12 Kaiser Permanente campuses in the Pacific Northwest region.",comments:[{author:"David Park",role:"rsm",body:"7 of 12 complete — great pace. Confirm WLX gateway specs with Cooper apps team for the remaining 5.",ts:"May 1"}]},
    {id:"C5", agencyId:"Mlazgar",              title:"Nemalux Petrochemical — Q2 Push",        segment:"industrial",owner:"Agency Lead",     status:"in_progress",priority:"high",   metric:"ROI models presented",        actual:2, target:4, dueDate:"2026-05-15",tags:["Nemalux","petrochemical"],desc:"Develop and present Nemalux ROI models for 4 Class I Div 2 petrochemical accounts in the Central territory.",comments:[]},
    {id:"C6", agencyId:"Tampa Bay Lighting",   title:"New Rep Onboarding — Product Training",  segment:"stock",    owner:"Agency Lead",      status:"in_progress",priority:"high",   metric:"Reps fully trained",          actual:2, target:3, dueDate:"2026-05-05",tags:["onboarding","training"],  desc:"Complete CLS product training for 3 new reps: stock segment, LEX basics, and Walkaway Pricing. 2 of 3 completed.",comments:[]},
    {id:"C7", agencyId:"Reflex Boston",        title:"Harvard Medical School Spec Campaign",   segment:"spec",     owner:"Agency Lead",      status:"complete",   priority:"high",   metric:"Specs submitted",             actual:3, target:3, dueDate:"2026-04-30",tags:["healthcare","spec"],     desc:"Deliver 3 CLS specification presentations to Harvard Medical School facilities team for upcoming lab renovation projects.",comments:[{author:"Emily Walsh",role:"rsm",body:"3 for 3 — exceptional work. All specs confirmed in LEX.",ts:"May 1"}]},
    {id:"C8", agencyId:"CAL",                  title:"SPEC 360 Controls Layout Training",      segment:"connected",owner:"Agency Lead",      status:"in_progress",priority:"medium", metric:"Reps SPEC 360 proficient",    actual:1, target:3, dueDate:"2026-05-20",tags:["SPEC 360","controls"],   desc:"Train 3 spec reps on SPEC 360 for controls zone layout and sensor placement. One rep certified; 2 in progress.",comments:[]},
    {id:"C9", agencyId:"HI TECH",              title:"Distributor Q2 Business Reviews",        segment:"stock",    owner:"Agency Lead",      status:"in_progress",priority:"medium", metric:"QBRs completed",              actual:2, target:4, dueDate:"2026-05-18",tags:["QBR","distributor"],     desc:"Conduct Q2 joint business reviews with top 4 distributors — review Q1 performance, set Q2 targets, confirm promo commitments.",comments:[]},
    {id:"C10",agencyId:"Medgar",               title:"Vancouver Design Week Specifier Event",  segment:"spec",     owner:"Agency Lead",      status:"pending",    priority:"medium", metric:"Attendees registered",        actual:0, target:20,dueDate:"2026-05-22",tags:["events","spec"],         desc:"Host Cooper Lighting specifier evening at Vancouver Design Week. Target 20 attendees from A&E and lighting design community.",comments:[{author:"David Park",role:"rsm",body:"Great opportunity — confirm venue and AIA credit registration by May 5.",ts:"Apr 29"}]},
    {id:"C11",agencyId:"2M",                   title:"Warehouse Retrofit Audit — Louisville",  segment:"industrial",owner:"Agency Lead",    status:"complete",   priority:"high",   metric:"Audits delivered",            actual:3, target:3, dueDate:"2026-04-28",tags:["retrofit","warehouse"],   desc:"Complete full lighting retrofit audits for 3 Louisville-area warehouse accounts. Generated $485K in project pipeline value.",comments:[]},
    {id:"C12",agencyId:"Clarus",               title:"WLX Certification — Controls Champion",  segment:"connected",owner:"Agency Lead",     status:"in_progress",priority:"high",   metric:"Certifications completed",    actual:0, target:1, dueDate:"2026-05-15",tags:["WLX","certification"],   desc:"Controls champion completing WLX Level 2 certification. Exam scheduled for May 10.",comments:[]},
    {id:"C13",agencyId:"Chesapeake",           title:"Q2 Promo — Graybar Pre-Commitment",      segment:"stock",    owner:"George Hart",      status:"complete",   priority:"medium", metric:"Pre-commitment secured",      actual:1, target:1, dueDate:"2026-04-26",tags:["promo","Graybar"],       desc:"Secure Graybar Baltimore Q2 promo pre-commitment. Agreed on $80K stocking order with floor pricing protection.",comments:[]},
    {id:"C14",agencyId:"Premier",              title:"ILC Sensor Placement Training",          segment:"connected",owner:"Marcus Bell",      status:"pending",    priority:"medium", metric:"Reps trained",                actual:0, target:4, dueDate:"2026-05-20",tags:["ILC","training"],        desc:"Train 4 reps on ILC sensor placement standards, gateway commissioning, and ASHRAE 90.1 compliance for controls designs.",comments:[]},
    {id:"C15",agencyId:"Illumination Systems", title:"Pacific NW A&E Engagement — Q2",        segment:"spec",     owner:"Patrick Sullivan", status:"in_progress",priority:"high",   metric:"New A&E relationships",       actual:3, target:6, dueDate:"2026-05-20",tags:["A&E","spec"],            desc:"Build 6 new A&E specifier relationships in Seattle, Portland, and Vancouver WA markets using Construct Connect leads.",comments:[]},
  ],
  next30:[
    {id:"N1", agencyId:"Chesapeake",           title:"Q3 Planning Meeting — Agency Prep",      segment:"stock",    owner:"George Hart",      status:"pending",    priority:"high",   metric:"Planning deck completed",     actual:0, target:1, dueDate:"2026-06-05",tags:["planning","Q3"],        desc:"Prepare full Q3 business plan: segment win/loss analysis, pipeline review, distributor scorecards, and resource requests for Cooper planning meeting.",comments:[]},
    {id:"N2", agencyId:"Illumination Systems", title:"Connected Pipeline — Q3 Expansion",      segment:"connected",owner:"Patrick Sullivan", status:"pending",    priority:"high",   metric:"New opportunities added",     actual:0, target:10,dueDate:"2026-06-10",tags:["connected","pipeline"],  desc:"Identify and qualify 10 new connected lighting opportunities for Q3 pipeline. Focus on commercial office and healthcare verticals.",comments:[]},
    {id:"N3", agencyId:"Premier",              title:"WLX EasySense Advanced Certification",   segment:"connected",owner:"Marcus Bell",      status:"pending",    priority:"medium", metric:"Reps certified",              actual:0, target:3, dueDate:"2026-06-15",tags:["EasySense","WLX"],       desc:"Enroll 3 reps in WLX EasySense advanced certification. Prerequisite for handling enterprise connected projects in H2.",comments:[]},
    {id:"N4", agencyId:"Ardd + Winter TN",     title:"H2 Industrial Target Account List",      segment:"industrial",owner:"Agency Lead",     status:"pending",    priority:"high",   metric:"Accounts prioritized",        actual:0, target:20,dueDate:"2026-06-01",tags:["industrial","H2"],       desc:"Build prioritized H2 industrial target list: 20 accounts ranked by retrofit opportunity, decision-maker contact, and estimated project value.",comments:[]},
    {id:"N5", agencyId:"HI TECH",              title:"Q3 Distributor Stocking Plans",          segment:"stock",    owner:"Agency Lead",      status:"pending",    priority:"high",   metric:"Distributor plans agreed",    actual:0, target:5, dueDate:"2026-06-08",tags:["distributor","Q3"],     desc:"Agree on Q3 stocking plans with top 5 distributors. Include inventory minimums, planogram placement, and inside sales support commitments.",comments:[]},
    {id:"N6", agencyId:"Medgar",               title:"APG Brand Proficiency — Spec Team",      segment:"spec",     owner:"Agency Lead",      status:"pending",    priority:"medium", metric:"Reps proficient all brands",  actual:0, target:4, dueDate:"2026-06-12",tags:["APG","training"],        desc:"Complete full APG brand proficiency training for all 4 spec reps. Target: independently specify Halo, Portfolio, Metalux, and Greengate.",comments:[]},
    {id:"N7", agencyId:"Tampa Bay Lighting",   title:"Nemalux Cold Storage Push — Florida",   segment:"industrial",owner:"Agency Lead",     status:"pending",    priority:"high",   metric:"Audits scheduled",            actual:0, target:4, dueDate:"2026-06-20",tags:["Nemalux","cold storage"],desc:"Schedule and complete 4 Nemalux lighting audits for cold storage and food processing facilities in central and south Florida.",comments:[]},
    {id:"N8", agencyId:"Reflex Boston",        title:"WLX Q3 Pipeline — Healthcare Focus",     segment:"connected",owner:"Agency Lead",      status:"pending",    priority:"high",   metric:"Healthcare opportunities",    actual:0, target:6, dueDate:"2026-06-18",tags:["WLX","healthcare"],      desc:"Build a focused Q3 WLX pipeline in the healthcare vertical. Target hospitals and medical office buildings in the Boston metro area.",comments:[]},
    {id:"N9", agencyId:"CAL",                  title:"ASOW Q2 Closeout — Gap Analysis",        segment:"spec",     owner:"Agency Lead",      status:"pending",    priority:"medium", metric:"Gap closures documented",     actual:0, target:5, dueDate:"2026-06-10",tags:["ASOW","LEX"],            desc:"Complete Q2 ASOW gap analysis closeout. Document 5 spec opportunity gaps closed vs. prior quarter. Share report with RSM.",comments:[]},
    {id:"N10",agencyId:"2M",                   title:"National Account Strategy — Q3",         segment:"industrial",owner:"Agency Lead",    status:"pending",    priority:"high",   metric:"Enterprise accounts engaged", actual:0, target:3, dueDate:"2026-06-15",tags:["national account","industrial"],desc:"Identify and engage 3 national/enterprise industrial accounts for Q3 pipeline development. Include corporate facilities and logistics networks.",comments:[]},
    {id:"N11",agencyId:"Clarus",               title:"Specifier CEU Event — Chicago",          segment:"spec",     owner:"Agency Lead",      status:"pending",    priority:"high",   metric:"Attendees",                   actual:0, target:25,dueDate:"2026-06-11",tags:["CEU","events"],          desc:"Host AIA-registered CEU event at agency office in Chicago. Target 25 A&E specifiers. Feature Cooper Lighting connected and specification portfolio.",comments:[]},
    {id:"N12",agencyId:"Mlazgar",              title:"Q3 Controls Demo Tour — Central",        segment:"connected",owner:"Agency Lead",      status:"pending",    priority:"high",   metric:"Demos completed",             actual:0, target:5, dueDate:"2026-06-20",tags:["WLX","demo"],           desc:"Deliver 5 WLX connected lighting demos to facility managers in the Central territory. Leave demo case on-site at top 2 prospects.",comments:[]},
    {id:"N13",agencyId:"Illumination Systems", title:"Q3 Promo Pre-Launch — Distributor Lock-in",segment:"stock", owner:"Patrick Sullivan", status:"pending",    priority:"medium", metric:"Distributors pre-committed",  actual:0, target:6, dueDate:"2026-06-08",tags:["promo","Q3"],           desc:"Secure Q3 promotional pre-commitments from all 6 key distributor accounts. Align on HALO and Metalux priority SKUs for the cycle.",comments:[]},
    {id:"N14",agencyId:"Premier",              title:"Retrofit ROI Campaign — Louisiana",      segment:"industrial",owner:"Marcus Bell",    status:"pending",    priority:"medium", metric:"ROI presentations delivered", actual:0, target:5, dueDate:"2026-06-22",tags:["retrofit","ROI"],        desc:"Develop and present 5 custom retrofit ROI models to Louisiana-based industrial accounts. Include utility rebate projections.",comments:[]},
    {id:"N15",agencyId:"Chesapeake",           title:"Mid-Atlantic Controls Pipeline Review",  segment:"connected",owner:"George Hart",      status:"pending",    priority:"high",   metric:"Pipeline review completed",   actual:0, target:1, dueDate:"2026-06-05",tags:["controls","pipeline"],   desc:"Formal mid-year pipeline review with RSM: controls attachment rate, top 5 opportunities, and Q3 action plan for connected segment.",comments:[]},
  ],
};
const STATUS_META={complete:{label:"Complete",color:"#059669",bg:"#ECFDF5"},in_progress:{label:"In Progress",color:CL.orange,bg:"#FEF0E9"},pending:{label:"Pending",color:"#9F9F9F",bg:"#F7F7F7"},overdue:{label:"Overdue",color:"#DC2626",bg:"#FEF2F2"}};
const PRIORITY_COLOR={high:"#DC2626",medium:"#D97706",low:"#6B7280"};

function ActionsWindowPage({winKey,currentUser,selAgency}){
  const meta=WIN_META[winKey];
  // Filter actions to the active agency from master selector
  const agencyActions=(WIN_ACTIONS[winKey]||[]).filter(a=>
    !selAgency||selAgency==="all"?true:a.agencyId===selAgency
  );
  const allActions=agencyActions;
  const [filterSeg,setFilterSeg]=useState("all");
  const [filterStatus,setFilterStatus]=useState("all");
  const [expandedId,setExpandedId]=useState(null);
  const filtered=allActions.filter(a=>{
    if(filterSeg!=="all"&&a.segment!==filterSeg)return false;
    if(filterStatus!=="all"&&a.status!==filterStatus)return false;
    return true;
  });
  const allForStats=WIN_ACTIONS[winKey]||[];
  const stats={
    complete:allActions.filter(a=>a.status==="complete").length,
    in_progress:allActions.filter(a=>a.status==="in_progress").length,
    pending:allActions.filter(a=>a.status==="pending").length,
    overdue:allActions.filter(a=>a.status==="overdue").length,
  };
  return(
    <div style={{padding:24,maxWidth:960,margin:"0 auto"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,fontWeight:800,color:"#9F9F9F",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>Action Tracker — {selAgency}</div>
        <h1 style={{fontSize:24,fontWeight:900,color:CL.navy,margin:"0 0 4px",display:"flex",alignItems:"center",gap:8}}>
          <span style={{width:10,height:10,borderRadius:"50%",background:meta.color,display:"inline-block"}}/>{meta.label}
        </h1>
        <div style={{fontSize:13,color:"#888"}}>{meta.sub} · {allActions.length} actions for {selAgency}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:16}}>
        {[{label:"Total",val:allActions.length,color:CL.navy},{label:"Complete",val:stats.complete,color:"#059669"},{label:"In Progress",val:stats.in_progress,color:CL.orange},{label:"Pending",val:stats.pending,color:"#9F9F9F"},{label:"Overdue",val:stats.overdue,color:"#DC2626"}].map(s=>(
          <Card key={s.label} style={{padding:"12px 14px",textAlign:"center",borderTop:"3px solid "+s.color}}><div style={{fontSize:26,fontWeight:900,color:s.color,lineHeight:1}}>{s.val}</div><div style={{fontSize:10,fontWeight:700,color:"#888",marginTop:3}}>{s.label}</div></Card>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <Card style={{padding:16}}>
          <ST>Actions by Segment</ST>
          {SEG.map(s=>{const cnt=allActions.filter(a=>a.segment===s.key).length;const done=allActions.filter(a=>a.segment===s.key&&a.status==="complete").length;if(!cnt)return null;return(
            <div key={s.key} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:700,color:CL.navy}}>{s.icon} {s.label}</span><span style={{fontSize:11,fontWeight:800,color:s.color}}>{done}/{cnt}</span></div><div style={{height:8,background:"#F0F0F0",borderRadius:4,overflow:"hidden"}}><div style={{width:(cnt>0?(done/cnt)*100:0)+"%",height:"100%",background:s.color,borderRadius:4}}/></div></div>
          );})}
          {allActions.length===0&&<div style={{fontSize:12,color:"#aaa",fontWeight:600,padding:"12px 0",textAlign:"center"}}>No actions for {selAgency} in this window</div>}
        </Card>
        <Card style={{padding:16}}>
          <ST>Status Breakdown · {allActions.length>0?Math.round(stats.complete/allActions.length*100):0}% complete</ST>
          {Object.entries(STATUS_META).map(([key,sm])=>{const val=stats[key]||0;return(
            <div key={key} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:sm.color,flexShrink:0}}/>
              <span style={{fontSize:11,fontWeight:600,color:"#555",width:80}}>{sm.label}</span>
              <div style={{flex:1,height:8,background:"#F0F0F0",borderRadius:4,overflow:"hidden"}}><div style={{width:(allActions.length>0?(val/allActions.length)*100:0)+"%",height:"100%",background:sm.color,borderRadius:4}}/></div>
              <span style={{fontSize:12,fontWeight:900,color:sm.color,width:20,textAlign:"right"}}>{val}</span>
            </div>
          );})}
        </Card>
      </div>
      {/* Filter bar — segment + status only; agency is set globally */}
      <Card style={{padding:"10px 16px",marginBottom:12,display:"flex",flexWrap:"wrap",gap:10,alignItems:"center"}}>
        <span style={{fontSize:10,fontWeight:800,color:"#9F9F9F",textTransform:"uppercase"}}>Filter:</span>
        <select value={filterSeg} onChange={e=>setFilterSeg(e.target.value)} style={{padding:"6px 10px",border:"1.5px solid #DDD",borderRadius:7,fontSize:11,fontWeight:600,background:"#fff",outline:"none",cursor:"pointer",fontFamily:"Montserrat,sans-serif"}}>
          <option value="all">All Segments</option>{SEG.map(s=><option key={s.key} value={s.key}>{s.icon} {s.label}</option>)}
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{padding:"6px 10px",border:"1.5px solid #DDD",borderRadius:7,fontSize:11,fontWeight:600,background:"#fff",outline:"none",cursor:"pointer",fontFamily:"Montserrat,sans-serif"}}>
          <option value="all">All Statuses</option>{Object.entries(STATUS_META).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
        {(filterSeg!=="all"||filterStatus!=="all")&&<button onClick={()=>{setFilterSeg("all");setFilterStatus("all");}} style={{padding:"5px 12px",border:"1.5px solid #DDD",borderRadius:7,background:"#fff",color:"#888",fontSize:11,fontWeight:600,cursor:"pointer"}}>✕ Clear</button>}
        <span style={{marginLeft:"auto",fontSize:11,color:"#aaa",fontWeight:600}}>{filtered.length} of {allActions.length} shown</span>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(a=>{
          const sm=STATUS_META[a.status];const seg=SEG.find(s=>s.key===a.segment);const isOpen=expandedId===a.id;const prog=a.target>0?Math.min(100,Math.round(a.actual/a.target*100)):0;
          return(
            <Card key={a.id} style={{overflow:"hidden",borderLeft:"4px solid "+(seg?.color||"#DDD")}}>
              <button style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"transparent",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"Montserrat,sans-serif"}} onClick={()=>setExpandedId(isOpen?null:a.id)}>
                <div style={{width:40,height:40,borderRadius:10,background:sm.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1.5px solid "+sm.color+"40"}}>
                  <div style={{fontSize:14,fontWeight:900,color:sm.color,lineHeight:1}}>{prog}%</div>
                  <div style={{fontSize:8,color:sm.color,fontWeight:700}}>done</div>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{fontWeight:800,fontSize:13,color:CL.navy}}>{a.title}</span>
                    <Badge label={sm.label} color={sm.color}/>
                    {seg&&<Badge label={seg.label} color={seg.color}/>}
                    <Badge label={a.priority} color={PRIORITY_COLOR[a.priority]}/>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{flex:1,height:5,background:"#F0F0F0",borderRadius:5,overflow:"hidden"}}><div style={{width:prog+"%",height:"100%",background:seg?.color||CL.orange,borderRadius:5}}/></div>
                    <span style={{fontSize:10,fontWeight:700,color:"#aaa",whiteSpace:"nowrap"}}>{a.actual}/{a.target} {a.metric}</span>
                    <span style={{fontSize:10,fontWeight:600,color:"#aaa",whiteSpace:"nowrap"}}>{a.agencyId}</span>
                  </div>
                </div>
                <div style={{color:"#CCC",fontSize:12,transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s",marginTop:4}}>▼</div>
              </button>
              {isOpen&&(
                <div style={{padding:"0 16px 16px",borderTop:"1px solid #F5F5F5"}}>
                  <p style={{fontSize:12,color:"#555",lineHeight:1.7,marginBottom:12}}>{a.desc}</p>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
                    {[{l:"Owner",v:a.owner},{l:"Due Date",v:a.dueDate},{l:"Tags",v:a.tags.map(t=>"#"+t).join(" ")}].map(f=>(
                      <div key={f.l}><div style={{fontSize:9,fontWeight:800,color:"#AAA",textTransform:"uppercase",marginBottom:2}}>{f.l}</div><div style={{fontSize:11,fontWeight:700,color:CL.navy}}>{f.v}</div></div>
                    ))}
                  </div>
                  {a.comments.length>0&&(
                    <div style={{background:"#F7F7F7",borderRadius:8,padding:"10px 12px"}}>
                      <div style={{fontSize:9,fontWeight:800,color:"#AAA",textTransform:"uppercase",marginBottom:6}}>Comments</div>
                      {a.comments.map((c,i)=>(
                        <div key={i} style={{borderLeft:"3px solid "+CL.orange,paddingLeft:10,marginBottom:6}}>
                          <div style={{fontSize:10,fontWeight:800,color:CL.navy}}>{c.author} <span style={{color:"#AAA",fontWeight:600}}>· {c.ts}</span></div>
                          <div style={{fontSize:11,color:"#555",marginTop:2}}>{c.body}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

const ANNUAL_ACTIONS=[
  // ─── Q1 · ACTION 1 · STOCK ────────────────────────────────────────────────
  {id:1,quarter:1,segment:"stock",color:"#2563EB",
   title:"CRM & Stock Position Baseline",
   description:"Establish documented stock targets in CRM and launch a weekly cadence with CLS sales managers.",
   kpi:"Weekly CRM update logged + stock position report shared with RSM",
   metric:"% of distributors with active stock targets in CRM",
   owner:"Stock Sales Leader",
   weeks:[
    {week:1, status:"complete", note:"Kicked off with RSM. Pulled distributor list from Prism — 14 active accounts identified."},
    {week:2, status:"complete", note:"Sorted distributors into Tier 1/2/3. Assigned CRM owner for each tier."},
    {week:3, status:"complete", note:"Entered stock targets for all 6 Tier 1 accounts. Baseline recorded."},
    {week:4, status:"complete", note:"First weekly CRM sync with CLS sales manager — 3 gaps flagged."},
    {week:5, status:"complete", note:"Resolved 2 of 3 gaps. MRAM kit locations mapped in CRM."},
    {week:6, status:"complete", note:"Added Tier 2 accounts (5 total) to CRM with stock floor targets."},
    {week:7, status:"complete", note:"Shared stock position report with RSM for the first time. Positive feedback."},
    {week:8, status:"complete", note:"Weekly cadence running consistently. 11/14 accounts now have active CRM targets."},
    {week:9, status:"complete", note:"Reviewed promo pipeline in CRM — identified 2 pre-commit opportunities."},
    {week:10,status:"complete", note:"Updated Q1 promo commitments in CRM. All Tier 1 pre-committed."},
    {week:11,status:"complete", note:"Final 3 Tier 2 accounts entered. 14/14 distributors active in CRM."},
    {week:12,status:"complete", note:"Q1 CRM review with RSM — 100% fill rate. Recommended for Q2 best practice."},
    {week:13,status:"complete", note:"Q1 closed. CRM discipline locked in. Stock position reports running weekly."},
  ]},
  // ─── Q1 · ACTION 2 · SPEC ────────────────────────────────────────────────
  {id:2,quarter:1,segment:"spec",color:"#7C3AED",
   title:"LEX Platform Activation",
   description:"Onboard full spec team on LEX. Post NPI carousels, subscribe active specifiers, begin weekly ASOW reviews.",
   kpi:"ASOW report reviewed weekly; specifier mailing list active",
   metric:"# of specifiers added to LEX mailing list",
   owner:"Spec Team Lead",
   weeks:[
    {week:1, status:"complete", note:"Completed LEX account setup. All 3 spec reps have credentials."},
    {week:2, status:"complete", note:"Completed LEX Level 1 training as a team — 2.5 hours total."},
    {week:3, status:"complete", note:"Posted first NPI carousel — HALO 4\" downlight family. 12 specifiers subscribed."},
    {week:4, status:"complete", note:"First ASOW review — identified 4 opportunity gaps vs. prior quarter."},
    {week:5, status:"complete", note:"Called top 2 ASOW gap firms. One meeting booked for Week 7."},
    {week:6, status:"complete", note:"Added 8 more specifiers to LEX mailing list. Total: 20 subscribed."},
    {week:7, status:"complete", note:"A&E meeting with HGA Architects — presented Halo Commercial line. Strong interest."},
    {week:8, status:"complete", note:"Posted 2nd NPI carousel — Portfolio linear. 6 new specifier subscribers."},
    {week:9, status:"complete", note:"ASOW weekly: 2 gaps closed. 2 new gaps appeared. Net improvement confirmed."},
    {week:10,status:"complete", note:"ASOW shared with RSM as part of weekly check-in. Process solid."},
    {week:11,status:"complete", note:"Specifier list now at 31. Surpassed Q1 goal of 25."},
    {week:12,status:"complete", note:"Submitted LEX usage report to RSM. Top performer in region YTD."},
    {week:13,status:"complete", note:"Q1 closed. LEX fully embedded. ASOW review is now a Monday ritual."},
  ]},
  // ─── Q1 · ACTION 3 · INDUSTRIAL ────────────────────────────────────────────
  {id:3,quarter:1,segment:"industrial",color:"#D97706",
   title:"Industrial Territory Mapping",
   description:"Build a targeted customer list of warehouse, logistics, manufacturing, and aerospace accounts.",
   kpi:"Territory map complete; 10 target accounts identified",
   metric:"# of Nemalux door-opener calls completed",
   owner:"Industrial Sales Leader",
   weeks:[
    {week:1, status:"complete", note:"Pulled SIC code list for warehousing, food & beverage, aerospace in territory."},
    {week:2, status:"complete", note:"Identified 22 potential industrial accounts. Categorized by retrofit opportunity."},
    {week:3, status:"complete", note:"Ranked top 10 accounts by facility sq footage and estimated energy spend."},
    {week:4, status:"complete", note:"Called 4 facilities. 2 gatekeepers, 1 voicemail, 1 live conversation — facility walk booked."},
    {week:5, status:"complete", note:"Nemalux door-opener call #2 — Amazon fulfillment center. Booked audit for Week 8."},
    {week:6, status:"complete", note:"Attended IESNA section meeting. Connected with 2 maintenance directors."},
    {week:7, status:"complete", note:"Completed 5 door-opener calls total. Map updated with contact and status."},
    {week:8, status:"complete", note:"First facility walk — Cold storage plant. 400K sq ft. Nemalux vapor-tight opportunity."},
    {week:9, status:"complete", note:"Completed retrofit scope estimate for cold storage. Sent proposal to RSM for review."},
    {week:10,status:"complete", note:"Second facility walk — aerospace MRO. HazLoc fixtures needed in 3 bays."},
    {week:11,status:"complete", note:"10 door-opener calls completed — Q1 KPI hit. Territory map shared with RSM."},
    {week:12,status:"complete", note:"Pipeline value from Q1 activity: $340K in retrofit opportunities identified."},
    {week:13,status:"complete", note:"Q1 closed. Territory map locked in CRM. 2 active retrofit audits in progress."},
  ]},
  // ─── Q2 · ACTION 4 · CONNECTED ──────────────────────────────────────────────
  {id:4,quarter:2,segment:"connected",color:"#059669",
   title:"Controls Champion & WLX Foundation",
   description:"Formally designate a controls champion. Complete WLX Level 1 training and build first demo case.",
   kpi:"Controls champion named; WLX L1 training complete; demo case built",
   metric:"# of bi-weekly project reviews held",
   owner:"Controls Champion",
   weeks:[
    {week:1, status:"complete", note:"Controls champion officially designated — Sarah Kim, senior spec rep."},
    {week:2, status:"complete", note:"WLX Level 1 training registered. 4-hour online module assigned."},
    {week:3, status:"complete", note:"Sarah completed WLX L1 training. Certificate received and filed."},
    {week:4, status:"complete", note:"Demo case hardware ordered: WLX gateway, 4 sensors, 2 drivers."},
    {week:5, status:"complete", note:"Demo case assembled and tested in office. All components functional."},
    {week:6, status:"complete", note:"First bi-weekly project review held — 3 active controls opportunities reviewed."},
    {week:7, status:"complete", note:"First live WLX demo delivered to facility manager at Parkway Office Center."},
    {week:8, status:"complete", note:"Left demo case on-site at Parkway for 72 hours. Owner loved occupancy sensing."},
    {week:9, status:"complete", note:"Parkway spec locked — full WLX system, 48 sensors, $38K project."},
    {week:10,status:"complete", note:"2nd bi-weekly project review — 5 opportunities now in pipeline."},
    {week:11,status:"in_progress", note:"Building 2nd demo case for industrial applications. Hardware on order."},
    {week:12,status:"in_progress", note:"WLX Level 2 training scheduled for Week 13."},
    {week:13,status:"pending",    note:""},
  ]},
  // ─── Q2 · ACTION 5 · STOCK ───────────────────────────────────────────────
  {id:5,quarter:2,segment:"stock",color:"#2563EB",
   title:"Walkaway Pricing Deployment",
   description:"Adopt and deploy CLS Walkaway Pricing methodology with top 5 stock distributors.",
   kpi:"Walkaway pricing active with 5 distributors",
   metric:"Promo performance rank vs. national leaderboard",
   owner:"Stock Sales Leader",
   weeks:[
    {week:1, status:"complete", note:"Attended Walkaway Pricing webinar with RSM. Methodology understood by team."},
    {week:2, status:"complete", note:"Printed Walkaway Price floor card for all reps. Posted in call room."},
    {week:3, status:"complete", note:"Distributor #1 (Graybar) — walked through WP methodology. Adopted on spot."},
    {week:4, status:"complete", note:"Distributor #2 (Rexel) — initial resistance. Reframed as margin protection. Agreed."},
    {week:5, status:"complete", note:"Distributors #3 and #4 onboarded. Running 4/5 target accounts."},
    {week:6, status:"complete", note:"Distributor #5 (WESCO) — final account onboarded. All 5 active on WP."},
    {week:7, status:"complete", note:"Q2 promo cycle opened. All 5 distributors pre-committed using WP methodology."},
    {week:8, status:"complete", note:"Checked national promo leaderboard — ranked #4 in region. Up from #9 in Q1."},
    {week:9, status:"complete", note:"Mid-cycle check-in: all 5 distributors holding floor pricing. Zero exceptions."},
    {week:10,status:"complete", note:"Rexel increased stocking order by 18% after reviewing WP data together."},
    {week:11,status:"in_progress", note:"Promo cycle closing — tracking final sell-through numbers per distributor."},
    {week:12,status:"in_progress", note:"Compiling Q2 promo results for RSM review meeting next week."},
    {week:13,status:"pending",    note:""},
  ]},
  // ─── Q2 · ACTION 6 · SPEC ───────────────────────────────────────────────
  {id:6,quarter:2,segment:"spec",color:"#7C3AED",
   title:"Construct Connect & Lead Pipeline",
   description:"Activate Construct Connect subscription. Set project tracking goals and review leads weekly.",
   kpi:"Construct Connect active; weekly lead review with RSM",
   metric:"# of projects tracked in pipeline",
   owner:"Spec Team Lead",
   weeks:[
    {week:1, status:"complete", note:"Construct Connect subscription activated. Team trained on search filters."},
    {week:2, status:"complete", note:"Set up territory alerts for commercial, healthcare, education projects >$500K."},
    {week:3, status:"complete", note:"First lead batch: 8 projects in bid planning stage. 3 prioritized for outreach."},
    {week:4, status:"complete", note:"First weekly lead review with RSM — pipeline format agreed. 5 projects active."},
    {week:5, status:"complete", note:"Called lead architect on Riverside Medical Pavilion. Spec meeting booked."},
    {week:6, status:"complete", note:"Spec meeting delivered — Halo Commercial for all exam rooms. Spec locked."},
    {week:7, status:"complete", note:"Pipeline grew to 11 projects. 3 in active spec development."},
    {week:8, status:"complete", note:"Weekly RSM review: 2 specs won this week, 1 under VE threat — called LD immediately."},
    {week:9, status:"complete", note:"VE defended on Harbor Tech campus — held specification with photometric data."},
    {week:10,status:"in_progress", note:"Pipeline at 14 projects. Highest count yet. 4 specs in development."},
    {week:11,status:"in_progress", note:"Working 3 simultaneous A&E relationships from Construct Connect leads."},
    {week:12,status:"in_progress", note:"Scheduled Q2 spec review meeting with RSM for Week 13."},
    {week:13,status:"pending",    note:""},
  ]},
  // ─── Q3 · ACTION 7 · INDUSTRIAL ──────────────────────────────────────────
  {id:7,quarter:3,segment:"industrial",color:"#D97706",
   title:"Nemalux Enterprise Push & Retrofit Audit",
   description:"Launch Nemalux enterprise account strategy. Complete retrofit audits with top 3 industrial accounts.",
   kpi:"3 retrofit audits complete; rebate applications submitted",
   metric:"$ pipeline value from industrial retrofit opportunities",
   owner:"Industrial Sales Leader",
   weeks:[
    {week:1, status:"complete", note:"Identified top 3 accounts for formal retrofit audit: cold storage, aerospace MRO, food plant."},
    {week:2, status:"complete", note:"Cold storage audit complete — 680 vapor-tight fixtures, $210K project scope."},
    {week:3, status:"in_progress", note:"Submitted utility rebate application for cold storage. $28K rebate anticipated."},
    {week:4, status:"in_progress", note:"Aerospace MRO audit scheduled for next week. Preparing Nemalux HazLoc samples."},
    {week:5, status:"pending",    note:""},
    {week:6, status:"pending",    note:""},
    {week:7, status:"pending",    note:""},
    {week:8, status:"pending",    note:""},
    {week:9, status:"pending",    note:""},
    {week:10,status:"pending",    note:""},
    {week:11,status:"pending",    note:""},
    {week:12,status:"pending",    note:""},
    {week:13,status:"pending",    note:""},
  ]},
  // ─── Q3 · ACTION 8 · CONNECTED ──────────────────────────────────────────
  {id:8,quarter:3,segment:"connected",color:"#059669",
   title:"WLX Certification & SPEC 360 Mastery",
   description:"Complete full WLX certification for controls champion. Achieve SPEC 360 proficiency.",
   kpi:"WLX certification achieved; 3 independent controls quotes submitted",
   metric:"Attachment rate of controls on total project quotes",
   owner:"Controls Champion",
   weeks:[
    {week:1, status:"complete", note:"WLX Level 2 training completed. Certification exam scheduled for Week 3."},
    {week:2, status:"complete", note:"SPEC 360 training session with Cooper applications team — 3 hours."},
    {week:3, status:"in_progress", note:"WLX certification exam taken — awaiting results (3-5 business days)."},
    {week:4, status:"pending",    note:""},
    {week:5, status:"pending",    note:""},
    {week:6, status:"pending",    note:""},
    {week:7, status:"pending",    note:""},
    {week:8, status:"pending",    note:""},
    {week:9, status:"pending",    note:""},
    {week:10,status:"pending",    note:""},
    {week:11,status:"pending",    note:""},
    {week:12,status:"pending",    note:""},
    {week:13,status:"pending",    note:""},
  ]},
  // ─── Q3 · ACTION 9 · SPEC ────────────────────────────────────────────────
  {id:9,quarter:3,segment:"spec",color:"#7C3AED",
   title:"CEU & Specifier Event Program",
   description:"Host minimum 2 non-standard specifier events. Grow specifier relationship count to 7+ active contacts.",
   kpi:"2 events hosted; attendee list and follow-up documented",
   metric:"# of new specifier relationships added",
   owner:"Marketing / Agency Principal",
   weeks:[
    {week:1, status:"complete", note:"Event plan drafted — rooftop L&L at agency office, target 15 specifiers."},
    {week:2, status:"in_progress", note:"Invitations sent to 22 specifiers. AIA credit registered for the event."},
    {week:3, status:"pending",    note:""},
    {week:4, status:"pending",    note:""},
    {week:5, status:"pending",    note:""},
    {week:6, status:"pending",    note:""},
    {week:7, status:"pending",    note:""},
    {week:8, status:"pending",    note:""},
    {week:9, status:"pending",    note:""},
    {week:10,status:"pending",    note:""},
    {week:11,status:"pending",    note:""},
    {week:12,status:"pending",    note:""},
    {week:13,status:"pending",    note:""},
  ]},
  // ─── Q4 · ACTION 10 · STOCK ──────────────────────────────────────────────
  {id:10,quarter:4,segment:"stock",color:"#2563EB",
   title:"EDI & E-Commerce Adoption",
   description:"Drive EDI adoption with territory distributors. Review and optimize distributor online product presence.",
   kpi:"3 distributors on EDI; online presence reviewed",
   metric:"# of distributors with active EDI connection",
   owner:"Stock Sales Leader / Inside Sales",
   weeks:Array.from({length:13},(_,i)=>({week:i+1,status:"pending",note:""}))},
  // ─── Q4 · ACTION 11 · INDUSTRIAL ─────────────────────────────────────────
  {id:11,quarter:4,segment:"industrial",color:"#D97706",
   title:"In-House Application & Quote Capability",
   description:"Build or validate in-house CLS optimized application and design capability.",
   kpi:"Internal layout generated and submitted for review",
   metric:"% of industrial quotes generated in-house",
   owner:"Industrial Sales Leader",
   weeks:Array.from({length:13},(_,i)=>({week:i+1,status:"pending",note:""}))},
  // ─── Q4 · ACTION 12 · CONNECTED ──────────────────────────────────────────
  {id:12,quarter:4,segment:"connected",color:"#059669",
   title:"Controls Pipeline to 10% Attach Rate",
   description:"Achieve 10% of total sales in connected/controls. Track attachment rate weekly.",
   kpi:"10% controls attach rate; commissioning demo completed",
   metric:"Controls $ as % of total agency revenue",
   owner:"Controls Champion + Agency Principal",
   weeks:Array.from({length:13},(_,i)=>({week:i+1,status:"pending",note:""}))},
];
const QTR_MONTHS=["Jan–Mar","Apr–Jun","Jul–Sep","Oct–Dec"];
const STS_C={pending:"#9F9F9F",in_progress:"#F26A36",complete:"#059669"};
const STS_L={pending:"Pending",in_progress:"In Progress",complete:"Complete"};

function WeekRow({week,onChange}){
  const cycle=()=>onChange({...week,status:week.status==="pending"?"in_progress":week.status==="in_progress"?"complete":"pending"});
  return(
    <div style={{display:"grid",gridTemplateColumns:"44px 100px 1fr",gap:8,alignItems:"center",padding:"4px 0",borderBottom:"1px solid #F5F5F5"}}>
      <div style={{fontSize:11,fontWeight:700,color:"#aaa",textAlign:"center"}}>W{week.week}</div>
      <button onClick={cycle} style={{padding:"3px 8px",borderRadius:20,border:"1.5px solid "+STS_C[week.status],background:STS_C[week.status]+"15",color:STS_C[week.status],fontSize:10,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>{STS_L[week.status]}</button>
      <input value={week.note} onChange={e=>onChange({...week,note:e.target.value})} placeholder="Weekly note…" style={{padding:"4px 8px",border:"1px solid #E7E7E7",borderRadius:6,fontSize:11,outline:"none",width:"100%",boxSizing:"border-box",fontFamily:"Montserrat,sans-serif"}}/>
    </div>
  );
}

function AnnualActionCard({action,onUpdate}){
  const [open,setOpen]=useState(false);
  const seg=SEG.find(s=>s.key===action.segment);
  const done=action.weeks.filter(w=>w.status==="complete").length;
  const inProg=action.weeks.filter(w=>w.status==="in_progress").length;
  const pct=done/action.weeks.length;
  const oStatus=done===action.weeks.length?"complete":inProg>0||done>0?"in_progress":"pending";
  const updateWeek=(wi,updated)=>{const weeks=[...action.weeks];weeks[wi]=updated;onUpdate({...action,weeks});};
  return(
    <Card style={{overflow:"hidden",borderLeft:"5px solid "+action.color}}>
      <div onClick={()=>setOpen(o=>!o)} style={{padding:"13px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:38,height:38,borderRadius:10,background:action.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:15,color:action.color,flexShrink:0}}>{action.id}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
            <span style={{fontWeight:800,fontSize:13,color:CL.navy}}>{action.title}</span>
            <Badge label={"Q"+action.quarter+" · "+QTR_MONTHS[action.quarter-1]} color={CL.navy}/>
            {seg&&<Badge label={seg.label} color={seg.color}/>}
            <Badge label={STS_L[oStatus]} color={STS_C[oStatus]}/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{flex:1,height:5,background:"#F0F0F0",borderRadius:5,overflow:"hidden"}}><div style={{width:Math.round(pct*100)+"%",height:"100%",background:action.color,borderRadius:5}}/></div>
            <span style={{fontSize:11,fontWeight:700,color:"#aaa",whiteSpace:"nowrap"}}>{done}/{action.weeks.length} weeks</span>
          </div>
        </div>
        <div style={{fontSize:14,color:"#ccc",transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}>▼</div>
      </div>
      {open&&(
        <div style={{borderTop:"1px solid #F0F0F0",padding:"16px 18px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
            <div><div style={{fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",marginBottom:4}}>Objective</div><p style={{fontSize:12,color:"#555",lineHeight:1.7,margin:0}}>{action.description}</p></div>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",marginBottom:3}}>Weekly KPI</div><p style={{fontSize:12,color:"#555",lineHeight:1.6,margin:"0 0 8px"}}>{action.kpi}</p>
              <div style={{fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",marginBottom:3}}>Metric</div><p style={{fontSize:12,color:action.color,fontWeight:700,margin:"0 0 8px"}}>{action.metric}</p>
              <div style={{fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",marginBottom:3}}>Owner</div><p style={{fontSize:12,color:CL.navy,fontWeight:700,margin:0}}>{action.owner}</p>
            </div>
          </div>
          <div style={{background:"#FAFAFA",borderRadius:8,padding:"10px 12px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",marginBottom:8}}>Weekly Check-ins — {done} complete · {inProg} in progress</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 24px"}}>
              {action.weeks.map((w,wi)=><WeekRow key={wi} week={w} onChange={updated=>updateWeek(wi,updated)}/>)}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function ActionsPage({currentUser,selAgency,annualActions,setAnnualActions}){
  const actions=annualActions;
  const updateAction=updated=>setAnnualActions(p=>p.map(a=>a.id===updated.id?updated:a));
  const [qFilter,setQFilter]=useState(0);
  const [segFilter,setSegFilter]=useState("all");
  const [activeTab,setActiveTab]=useState("annual"); // "annual" | "summary"

  const totalDone=actions.reduce((a,x)=>a+x.weeks.filter(w=>w.status==="complete").length,0);
  const totalWeeks=actions.reduce((a,x)=>a+x.weeks.length,0);
  const yearPct=totalDone/totalWeeks;
  const filtered=actions.filter(a=>(qFilter===0||a.quarter===qFilter)&&(segFilter==="all"||a.segment===segFilter));

  // Pull all WIN_ACTIONS for the active agency
  const allWin=[
    ...WIN_ACTIONS.last30.filter(a=>a.agencyId===selAgency),
    ...WIN_ACTIONS.current.filter(a=>a.agencyId===selAgency),
    ...WIN_ACTIONS.next30.filter(a=>a.agencyId===selAgency),
  ];
  const winByStatus={
    complete:allWin.filter(a=>a.status==="complete"),
    in_progress:allWin.filter(a=>a.status==="in_progress"),
    overdue:allWin.filter(a=>a.status==="overdue"),
    pending:allWin.filter(a=>a.status==="pending"),
  };
  const winBySeg=SEG.map(s=>({
    ...s,
    actions:allWin.filter(a=>a.segment===s.key),
    complete:allWin.filter(a=>a.segment===s.key&&a.status==="complete").length,
  })).filter(s=>s.actions.length>0);

  // Map WIN_ACTIONS segments to annual actions for linking
  const annualBySeg=SEG.map(s=>({
    seg:s,
    annual:actions.filter(a=>a.segment===s.key),
    winActions:allWin.filter(a=>a.segment===s.key),
  }));

  return(
    <div style={{padding:24,maxWidth:980,margin:"0 auto"}}>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:10,fontWeight:800,color:"#9F9F9F",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>Actions — {selAgency}</div>
        <div style={{fontSize:24,fontWeight:900,color:CL.navy}}>⚡ Agency Action Plan</div>
        <div style={{fontSize:13,color:"#888",marginTop:2}}>Annual 12-action program · 30-day sprint tracker · unified view</div>
      </div>

      {/* Overall progress bar */}
      <div style={{background:CL.navy,borderRadius:12,padding:"16px 22px",marginBottom:20,display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:200}}>
          <div style={{color:"rgba(255,255,255,0.6)",fontSize:10,fontWeight:700,textTransform:"uppercase",marginBottom:6}}>Year Plan Progress</div>
          <div style={{height:10,background:"rgba(255,255,255,0.12)",borderRadius:10,overflow:"hidden"}}><div style={{width:Math.round(yearPct*100)+"%",height:"100%",background:CL.orange,borderRadius:10}}/></div>
          <div style={{color:"rgba(255,255,255,0.4)",fontSize:10,marginTop:4}}>{totalDone} of {totalWeeks} weekly check-ins complete</div>
        </div>
        <div style={{textAlign:"center",flexShrink:0}}>
          <div style={{color:"#fff",fontWeight:900,fontSize:28,lineHeight:1}}>{Math.round(yearPct*100)}%</div>
          <div style={{color:"rgba(255,255,255,0.45)",fontSize:10,marginTop:2}}>Year complete</div>
        </div>
        <div style={{width:1,height:40,background:"rgba(255,255,255,0.12)"}}/>
        {/* 30-day sprint KPIs */}
        {[
          {label:"Total Sprints",val:allWin.length,color:"#fff"},
          {label:"Complete",val:winByStatus.complete.length,color:"#86EFAC"},
          {label:"In Progress",val:winByStatus.in_progress.length,color:CL.orange},
          {label:"Overdue",val:winByStatus.overdue.length,color:"#FCA5A5"},
        ].map(k=>(
          <div key={k.label} style={{textAlign:"center",flexShrink:0}}>
            <div style={{color:k.color,fontWeight:900,fontSize:22,lineHeight:1}}>{k.val}</div>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:9,marginTop:2,textTransform:"uppercase",letterSpacing:"0.08em"}}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tab switch */}
      <div style={{display:"flex",gap:4,marginBottom:20,borderBottom:"2px solid #E7E7E7"}}>
        {[{key:"annual",label:"📅 12-Action Year Plan"},{key:"summary",label:"📊 30-Day Sprint Summary"}].map(t=>(
          <button key={t.key} onClick={()=>setActiveTab(t.key)} style={{padding:"9px 20px",border:"none",background:"transparent",fontWeight:700,fontSize:13,cursor:"pointer",color:activeTab===t.key?CL.orange:"#aaa",borderBottom:"3px solid "+(activeTab===t.key?CL.orange:"transparent"),marginBottom:-2,fontFamily:"Montserrat,sans-serif"}}>{t.label}</button>
        ))}
      </div>

      {/* ── ANNUAL TAB ── */}
      {activeTab==="annual"&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
            {[1,2,3,4].map(q=>{const qa=actions.filter(a=>a.quarter===q);const qd=qa.reduce((a,x)=>a+x.weeks.filter(w=>w.status==="complete").length,0);const qt=qa.reduce((a,x)=>a+x.weeks.length,0);return(
              <button key={q} onClick={()=>setQFilter(qFilter===q?0:q)} style={{background:qFilter===q?CL.navy:"#fff",borderRadius:10,padding:"12px 14px",border:"2px solid "+(qFilter===q?CL.navy:"#E7E7E7"),cursor:"pointer",textAlign:"left"}}>
                <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",marginBottom:4,color:qFilter===q?"rgba(255,255,255,0.6)":"#aaa"}}>Q{q} · {QTR_MONTHS[q-1]}</div>
                <div style={{fontSize:20,fontWeight:900,color:qFilter===q?"#fff":CL.navy,marginBottom:6}}>{Math.round(qd/qt*100)}%</div>
                <div style={{height:4,background:qFilter===q?"rgba(255,255,255,0.2)":"#F0F0F0",borderRadius:4,overflow:"hidden"}}><div style={{width:Math.round(qd/qt*100)+"%",height:"100%",background:qFilter===q?CL.orange:CL.navy,borderRadius:4}}/></div>
              </button>
            );})}
          </div>
          <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
            {[{key:"all",label:"All Segments",color:CL.navy},...SEG.map(s=>({key:s.key,label:s.label,color:s.color}))].map(f=>(
              <button key={f.key} onClick={()=>setSegFilter(f.key)} style={{padding:"5px 14px",borderRadius:20,border:"2px solid "+(segFilter===f.key?f.color:"#DDD"),background:segFilter===f.key?f.color+"15":"#fff",color:segFilter===f.key?f.color:"#888",fontWeight:700,fontSize:11,cursor:"pointer"}}>{f.label}</button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>{filtered.map(a=><AnnualActionCard key={a.id} action={a} onUpdate={updateAction}/>)}</div>
        </>
      )}

      {/* ── 30-DAY SPRINT SUMMARY TAB ── */}
      {activeTab==="summary"&&(
        <div>
          {/* By window */}
          {[{key:"last30",label:"Last 30 Days",color:WIN_META.last30.color,sub:WIN_META.last30.sub},{key:"current",label:"Current",color:WIN_META.current.color,sub:WIN_META.current.sub},{key:"next30",label:"Next 30 Days",color:WIN_META.next30.color,sub:WIN_META.next30.sub}].map(win=>{
            const wActions=WIN_ACTIONS[win.key].filter(a=>a.agencyId===selAgency);
            const wComplete=wActions.filter(a=>a.status==="complete").length;
            const wProgress=wActions.filter(a=>a.status==="in_progress").length;
            const wOverdue=wActions.filter(a=>a.status==="overdue").length;
            const wPct=wActions.length>0?Math.round(wComplete/wActions.length*100):0;
            return(
              <div key={win.key} style={{marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:win.color,flexShrink:0}}/>
                  <span style={{fontSize:12,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.1em",color:win.color}}>{win.label}</span>
                  <span style={{fontSize:11,color:"#aaa"}}>{win.sub}</span>
                  <div style={{flex:1,height:1,background:"#E7E7E7"}}/>
                  <span style={{fontSize:11,fontWeight:800,color:win.color}}>{wActions.length} actions · {wPct}% complete</span>
                </div>
                {wActions.length===0?(
                  <div style={{padding:"16px",background:"#F7F7F7",borderRadius:10,textAlign:"center",fontSize:12,color:"#aaa",fontWeight:600}}>No actions for {selAgency} in this window</div>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {wActions.map(a=>{
                      const sm=STATUS_META[a.status];
                      const seg=SEG.find(s=>s.key===a.segment);
                      const prog=a.target>0?Math.min(100,Math.round(a.actual/a.target*100)):0;
                      // Find linked annual action by segment
                      const linked=actions.find(aa=>aa.segment===a.segment);
                      return(
                        <Card key={a.id} style={{padding:"12px 16px",borderLeft:"3px solid "+(seg?.color||"#DDD")}}>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                            <span style={{fontWeight:800,fontSize:13,color:CL.navy,flex:1}}>{a.title}</span>
                            <Badge label={sm.label} color={sm.color}/>
                            {seg&&<Badge label={seg.label} color={seg.color}/>}
                            <Badge label={a.priority} color={PRIORITY_COLOR[a.priority]}/>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:linked?6:0}}>
                            <div style={{flex:1,height:5,background:"#F0F0F0",borderRadius:5,overflow:"hidden"}}><div style={{width:prog+"%",height:"100%",background:seg?.color||CL.orange,borderRadius:5}}/></div>
                            <span style={{fontSize:10,fontWeight:700,color:"#aaa",whiteSpace:"nowrap"}}>{a.actual}/{a.target} {a.metric}</span>
                            <span style={{fontSize:10,color:"#aaa",whiteSpace:"nowrap"}}>Due {a.dueDate}</span>
                          </div>
                          {linked&&(
                            <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",background:linked.color+"0D",borderRadius:6,border:"1px solid "+linked.color+"25",marginTop:4}}>
                              <span style={{fontSize:9,fontWeight:700,color:linked.color,textTransform:"uppercase",letterSpacing:"0.08em"}}>📅 Feeds into</span>
                              <span style={{fontSize:11,fontWeight:700,color:CL.navy}}>Action {linked.id} — {linked.title}</span>
                              <span style={{fontSize:10,color:"#aaa",marginLeft:"auto"}}>Q{linked.quarter}</span>
                            </div>
                          )}
                          {a.comments.length>0&&(
                            <div style={{marginTop:8,padding:"8px 10px",background:"#F7F7F7",borderRadius:7}}>
                              {a.comments.map((c,i)=>(
                                <div key={i} style={{borderLeft:"2px solid "+CL.orange,paddingLeft:8}}>
                                  <span style={{fontSize:10,fontWeight:800,color:CL.navy}}>{c.author}</span>
                                  <span style={{fontSize:10,color:"#aaa"}}> · {c.ts}</span>
                                  <div style={{fontSize:11,color:"#555",marginTop:2}}>{c.body}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* By segment summary */}
          <Card style={{padding:"16px 20px",marginTop:4}}>
            <ST>Sprint Summary by Segment</ST>
            {annualBySeg.map(({seg,annual,winActions})=>{
              if(!winActions.length&&!annual.length)return null;
              const done=winActions.filter(a=>a.status==="complete").length;
              const inProg=winActions.filter(a=>a.status==="in_progress").length;
              const overdue=winActions.filter(a=>a.status==="overdue").length;
              const annualDone=annual.reduce((t,a)=>t+a.weeks.filter(w=>w.status==="complete").length,0);
              const annualTotal=annual.reduce((t,a)=>t+a.weeks.length,0);
              return(
                <div key={seg.key} style={{marginBottom:16,paddingBottom:16,borderBottom:"1px solid #F0F0F0"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <span style={{fontSize:14}}>{seg.icon}</span>
                    <span style={{fontWeight:800,fontSize:13,color:CL.navy,flex:1}}>{seg.label}</span>
                    <div style={{display:"flex",gap:6}}>
                      {done>0&&<Badge label={done+" complete"} color="#059669"/>}
                      {inProg>0&&<Badge label={inProg+" in progress"} color={CL.orange}/>}
                      {overdue>0&&<Badge label={overdue+" overdue"} color="#DC2626"/>}
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div style={{padding:"10px 12px",background:seg.color+"08",borderRadius:8,border:"1px solid "+seg.color+"20"}}>
                      <div style={{fontSize:9,fontWeight:800,color:seg.color,textTransform:"uppercase",marginBottom:4}}>30-Day Sprints</div>
                      <div style={{fontSize:18,fontWeight:900,color:CL.navy}}>{winActions.length}</div>
                      <div style={{height:4,background:"#F0F0F0",borderRadius:2,overflow:"hidden",marginTop:4}}>
                        <div style={{width:(winActions.length>0?done/winActions.length*100:0)+"%",height:"100%",background:seg.color,borderRadius:2}}/>
                      </div>
                    </div>
                    <div style={{padding:"10px 12px",background:CL.navy+"06",borderRadius:8,border:"1px solid "+CL.navy+"15"}}>
                      <div style={{fontSize:9,fontWeight:800,color:CL.navy,textTransform:"uppercase",marginBottom:4}}>Year Plan Progress</div>
                      <div style={{fontSize:18,fontWeight:900,color:CL.navy}}>{annualTotal>0?Math.round(annualDone/annualTotal*100):0}%</div>
                      <div style={{height:4,background:"#F0F0F0",borderRadius:2,overflow:"hidden",marginTop:4}}>
                        <div style={{width:(annualTotal>0?annualDone/annualTotal*100:0)+"%",height:"100%",background:CL.navy,borderRadius:2}}/>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}
    </div>
  );
}

const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const CUR_MONTH=new Date().getMonth();
const CUR_YEAR=new Date().getFullYear();

// Build a snapshot of all agency scores right now
const captureSnapshot=(scores)=>{
  const snap={};
  AGENCIES.forEach(a=>{
    snap[a]={};
    SEG.forEach(seg=>{
      seg.criteria.forEach(c=>{
        snap[a][seg.key+"_"+c.key]=scores[a]?.[seg.key+"_"+c.key]??0;
      });
    });
  });
  return snap;
};

// Seed historical fake snapshots for months before current
const seedMonthly=(scores)=>{
  const snaps={};
  MONTHS.forEach((m,mi)=>{
    if(mi>CUR_MONTH)return;
    const factor=0.55+(mi/(CUR_MONTH||1))*0.35;
    snaps[m]={scores:{},locked:false,entries:[]};
    AGENCIES.forEach(a=>{
      snaps[m].scores[a]={};
      SEG.forEach(seg=>{seg.criteria.forEach(c=>{
        const live=scores[a]?.[seg.key+"_"+c.key]??0;
        snaps[m].scores[a][seg.key+"_"+c.key]=live===0?0:Math.max(1,Math.min(4,Math.round(live*(factor+(Math.random()*0.15-0.075)))));
      });});
    });
  });
  return snaps;
};

function DeltaPill({now,prev}){
  if(prev==null)return null;
  const d=now-prev;
  if(d===0)return <span style={{fontSize:10,fontWeight:700,color:"#aaa"}}>—</span>;
  return <span style={{fontSize:10,fontWeight:800,color:d>0?"#059669":"#EF4444",marginLeft:4}}>{d>0?"▲":"▼"}{Math.abs(d)}%</span>;
}

function ProgressPage({scores,selAgency,snapshots,evalHistory}){
  const [monthlySnaps]=useState(()=>seedMonthly(scores));
  const [selMonth,setSelMonth]=useState(MONTHS[CUR_MONTH]);
  const [compareMonth,setCompareMonth]=useState(CUR_MONTH>0?MONTHS[CUR_MONTH-1]:null);
  const [showHistory,setShowHistory]=useState(false);

  const availableMonths=MONTHS.filter((_,i)=>i<=CUR_MONTH);

  // Merge: real locked snapshots override seeded ones for the current month
  const getSnap=(month)=>{
    // If there's a real locked snapshot for this month, use it
    if(snapshots[month])return snapshots[month];
    return monthlySnaps[month]?.scores??{};
  };

  const selSnap=getSnap(selMonth);
  const cmpSnap=compareMonth?getSnap(compareMonth):null;

  const getSegPct=(snap,ag,sk)=>{
    const seg=SEG.find(s=>s.key===sk);let t=0,mx=0;
    seg.criteria.forEach(c=>{const v=snap[ag]?.[sk+"_"+c.key]??0;if(v>0)t+=v;mx+=4;});
    return mx>0?Math.round(t/mx*100):0;
  };
  const getOverall=(snap,ag)=>{
    let t=0,mx=0;
    SEG.forEach(s=>{s.criteria.forEach(c=>{const v=snap[ag]?.[s.key+"_"+c.key]??0;if(v>0)t+=v;mx+=4;});});
    return mx>0?Math.round(t/mx*100):0;
  };

  const kpis=[
    {label:"Team Avg",color:CL.orange,
      val:Math.round(AGENCIES.map(a=>getOverall(selSnap,a)).reduce((a,x)=>a+x,0)/AGENCIES.length),
      prev:cmpSnap?Math.round(AGENCIES.map(a=>getOverall(cmpSnap,a)).reduce((a,x)=>a+x,0)/AGENCIES.length):null},
    ...SEG.map(s=>({label:s.label,color:s.color,
      val:Math.round(AGENCIES.map(a=>getSegPct(selSnap,a,s.key)).reduce((a,x)=>a+x,0)/AGENCIES.length),
      prev:cmpSnap?Math.round(AGENCIES.map(a=>getSegPct(cmpSnap,a,s.key)).reduce((a,x)=>a+x,0)/AGENCIES.length):null})),
  ];

  // Real locked entries for selected month
  const monthEntries=(evalHistory||[]).filter(e=>e.month===selMonth);
  const hasRealData=snapshots[selMonth]!=null;

  return(
    <div style={{padding:24,maxWidth:1060,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:10,fontWeight:800,color:"#9F9F9F",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>Monthly Review</div>
          <div style={{fontSize:24,fontWeight:900,color:CL.navy}}>📊 Progress & Summary</div>
          <div style={{fontSize:13,color:"#888",marginTop:2}}>
            Powered by locked evaluations · {evalHistory?.length||0} evaluations recorded
          </div>
        </div>
        <button onClick={()=>setShowHistory(p=>!p)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",border:"1.5px solid #DDD",borderRadius:9,background:showHistory?"#F7F7F7":"#fff",color:CL.navy,fontWeight:700,fontSize:12,cursor:"pointer"}}>
          🕐 Evaluation History {evalHistory?.length>0&&<span style={{background:CL.orange,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:800,marginLeft:4}}>{evalHistory.length}</span>}
        </button>
      </div>

      {/* Evaluation History Panel */}
      {showHistory&&(
        <Card style={{marginBottom:16,overflow:"hidden"}}>
          <div style={{padding:"12px 18px",borderBottom:"1px solid #F0F0F0",background:"#F7F7F7",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:14}}>🔒</span>
            <span style={{fontWeight:800,fontSize:13,color:CL.navy}}>Locked Evaluation History</span>
            <span style={{fontSize:11,color:"#aaa",marginLeft:4}}>Each lock creates a snapshot used by Progress</span>
          </div>
          {(evalHistory||[]).length===0?(
            <div style={{padding:"24px",textAlign:"center",color:"#aaa",fontSize:13}}>
              No evaluations locked yet. Lock an evaluation from the Agency Scorecard to record a snapshot.
            </div>
          ):(
            <div style={{maxHeight:320,overflowY:"auto"}}>
              {[...(evalHistory||[])].reverse().map((e,i)=>{
                const dir=AGENCY_DIRECTORY[e.agency]||{};
                return(
                  <div key={i} style={{padding:"12px 18px",borderBottom:"1px solid #F5F5F5",display:"flex",alignItems:"flex-start",gap:12,background:e.agency===selAgency?"#FEF7F3":"#fff"}}>
                    <div style={{width:36,height:36,borderRadius:9,background:CL.orange+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🔒</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                        <span style={{fontWeight:800,fontSize:13,color:CL.navy}}>{e.agency}</span>
                        <Badge label={e.month+" "+e.year} color={CL.orange}/>
                        <span style={{fontSize:11,color:"#aaa"}}>by {e.lockedBy}</span>
                        {e.agency===selAgency&&<Badge label="Active Agency" color={CL.navy}/>}
                      </div>
                      <div style={{fontSize:11,color:"#888",marginBottom:6}}>{e.timestamp}</div>
                      {/* Score deltas */}
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        {SEG.map(s=>{
                          const now=e.segScores?.[s.key]??0;
                          const was=e.prevSegScores?.[s.key]??null;
                          return(
                            <div key={s.key} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:8,background:s.color+"10",border:"1px solid "+s.color+"30"}}>
                              <span style={{fontSize:10,fontWeight:700,color:s.color}}>{s.label.substring(0,4)}</span>
                              <span style={{fontSize:12,fontWeight:900,color:CL.navy}}>{now}%</span>
                              {was!==null&&<DeltaPill now={now} prev={was}/>}
                            </div>
                          );
                        })}
                        <div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:8,background:CL.navy+"10",border:"1px solid "+CL.navy+"20"}}>
                          <span style={{fontSize:10,fontWeight:700,color:CL.navy}}>Overall</span>
                          <span style={{fontSize:12,fontWeight:900,color:CL.navy}}>{e.overall}%</span>
                          {e.prevOverall!==null&&<DeltaPill now={e.overall} prev={e.prevOverall}/>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* Month selector */}
      <Card style={{padding:"14px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:12,fontWeight:700,color:CL.navy,whiteSpace:"nowrap"}}>📅 Viewing:</span>
          <select value={selMonth} onChange={e=>setSelMonth(e.target.value)} style={{padding:"7px 12px",border:"2px solid "+CL.orange,borderRadius:8,fontSize:13,fontWeight:700,color:CL.navy,background:"#fff",outline:"none",cursor:"pointer",fontFamily:"Montserrat,sans-serif"}}>
            {availableMonths.map(m=><option key={m}>{m}</option>)}
          </select>
          {hasRealData
            ?<span style={{fontSize:11,fontWeight:700,color:"#059669",background:"#ECFDF5",padding:"3px 10px",borderRadius:20,border:"1px solid #86EFAC"}}>🔒 Real data</span>
            :<span style={{fontSize:11,fontWeight:600,color:"#aaa",background:"#F5F5F5",padding:"3px 10px",borderRadius:20}}>Simulated</span>}
        </div>
        <div style={{width:1,height:28,background:"#E7E7E7"}}/>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:12,fontWeight:700,color:CL.navy,whiteSpace:"nowrap"}}>🔄 Compare to:</span>
          <select value={compareMonth||""} onChange={e=>setCompareMonth(e.target.value||null)} style={{padding:"7px 12px",border:"2px solid #DDD",borderRadius:8,fontSize:13,fontWeight:700,color:"#555",background:"#fff",outline:"none",cursor:"pointer",fontFamily:"Montserrat,sans-serif"}}>
            <option value="">— None —</option>
            {availableMonths.filter(m=>m!==selMonth).map(m=><option key={m}>{m}{snapshots[m]?" 🔒":""}</option>)}
          </select>
        </div>
      </Card>

      {/* Month tabs */}
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {availableMonths.map(m=>{const isReal=snapshots[m]!=null;return(
          <button key={m} onClick={()=>setSelMonth(m)} style={{padding:"4px 12px",borderRadius:20,border:"2px solid "+(selMonth===m?CL.orange:"#DDD"),background:selMonth===m?CL.orange+"15":"#fff",color:selMonth===m?CL.orange:"#888",fontWeight:700,fontSize:11,cursor:"pointer",position:"relative"}}>
            {m.substring(0,3)}{isReal&&<span style={{fontSize:8,color:"#059669",marginLeft:3}}>🔒</span>}
          </button>
        );})}
      </div>

      {/* Real evaluation entries for this month */}
      {monthEntries.length>0&&(
        <div style={{background:"#F0FDF4",border:"1px solid #86EFAC",borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
          <span style={{fontSize:12,fontWeight:800,color:"#059669"}}>🔒 {monthEntries.length} locked evaluation{monthEntries.length!==1?"s":""} recorded for {selMonth}</span>
          {monthEntries.map((e,i)=>(
            <span key={i} style={{fontSize:11,color:"#059669",background:"#DCFCE7",padding:"2px 8px",borderRadius:10,fontWeight:600}}>{e.agency} · {e.timestamp.split("·")[1]?.trim()}</span>
          ))}
        </div>
      )}

      {/* KPI cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:16}}>
        {kpis.map(k=>(
          <Card key={k.label} style={{padding:"13px 15px",borderTop:"4px solid "+k.color}}>
            <div style={{fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",marginBottom:6}}>{k.label}</div>
            <div style={{display:"flex",alignItems:"baseline",gap:4}}>
              <div style={{fontSize:22,fontWeight:900,color:CL.navy}}>{k.val}%</div>
              <DeltaPill now={k.val} prev={k.prev}/>
            </div>
            <div style={{height:4,background:"#F0F0F0",borderRadius:4,overflow:"hidden",marginTop:6}}>
              <div style={{width:k.val+"%",height:"100%",background:k.color,borderRadius:4}}/>
            </div>
          </Card>
        ))}
      </div>

      {/* Matrix */}
      <Card style={{overflow:"hidden",marginBottom:16}}>
        <div style={{padding:"13px 18px",borderBottom:"1px solid #F0F0F0",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <span style={{fontWeight:800,fontSize:14,color:CL.navy}}>Agency Capability Matrix</span>
          <Badge label={selMonth} color={CL.orange}/>
          {hasRealData&&<Badge label="🔒 Locked Data" color="#059669"/>}
          {compareMonth&&<><span style={{fontSize:11,color:"#aaa"}}>vs.</span><Badge label={compareMonth} color="#6F6F6F"/></>}
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:"#F7F7F7"}}>
              <th style={{padding:"9px 14px",textAlign:"left",fontWeight:700,color:"#888",fontSize:10,textTransform:"uppercase"}}>Agency</th>
              {SEG.map(s=><th key={s.key} style={{padding:"9px 10px",textAlign:"center",fontWeight:700,color:s.color,fontSize:10,textTransform:"uppercase",borderLeft:"1px solid #F0F0F0"}}>{s.icon} {s.label}</th>)}
              <th style={{padding:"9px 10px",textAlign:"center",fontWeight:700,color:"#888",fontSize:10,textTransform:"uppercase",borderLeft:"2px solid #E7E7E7"}}>Overall</th>
            </tr></thead>
            <tbody>
              {AGENCIES.map((a,i)=>{
                const ov=getOverall(selSnap,a);
                const ovC=cmpSnap?getOverall(cmpSnap,a):null;
                const isHighlighted=a===selAgency;
                const hasEntry=monthEntries.some(e=>e.agency===a);
                return(
                  <tr key={a} style={{borderTop:"1px solid #F5F5F5",background:isHighlighted?CL.orange+"0A":i%2===0?"#fff":"#FAFAFA",outline:isHighlighted?"2px solid "+CL.orange:"none",outlineOffset:"-1px"}}>
                    <td style={{padding:"9px 14px",fontWeight:800,color:isHighlighted?CL.orange:CL.navy,whiteSpace:"nowrap"}}>
                      {isHighlighted?"▶ ":""}{a}
                      {hasEntry&&<span style={{fontSize:10,marginLeft:6,color:"#059669"}}>🔒</span>}
                    </td>
                    {SEG.map(s=>{
                      const now=getSegPct(selSnap,a,s.key);
                      const was=cmpSnap?getSegPct(cmpSnap,a,s.key):null;
                      return(
                        <td key={s.key} style={{padding:"7px 10px",textAlign:"center",borderLeft:"1px solid #F0F0F0"}}>
                          <div style={{fontSize:13,fontWeight:900,color:s.color}}>{now}%</div>
                          <div style={{width:56,margin:"3px auto 0"}}><div style={{height:3,background:"#F0F0F0",borderRadius:3,overflow:"hidden"}}><div style={{width:now+"%",height:"100%",background:s.color}}/></div></div>
                          {was!=null&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:2,marginTop:2}}><span style={{fontSize:10,color:"#aaa"}}>{was}%</span><DeltaPill now={now} prev={was}/></div>}
                        </td>
                      );
                    })}
                    <td style={{padding:"7px 10px",textAlign:"center",borderLeft:"2px solid #E7E7E7"}}>
                      <MatBadge pct={ov/100}/>
                      {ovC!=null&&<DeltaPill now={ov} prev={ovC}/>}
                    </td>
                  </tr>
                );
              })}
              <tr style={{borderTop:"2px solid #E7E7E7",background:"#F7F7F7"}}>
                <td style={{padding:"9px 14px",fontWeight:900,color:CL.navy,fontSize:11,textTransform:"uppercase"}}>Team Avg</td>
                {SEG.map(s=>{
                  const now=Math.round(AGENCIES.map(a=>getSegPct(selSnap,a,s.key)).reduce((a,x)=>a+x,0)/AGENCIES.length);
                  const was=cmpSnap?Math.round(AGENCIES.map(a=>getSegPct(cmpSnap,a,s.key)).reduce((a,x)=>a+x,0)/AGENCIES.length):null;
                  return(<td key={s.key} style={{padding:"7px 10px",textAlign:"center",borderLeft:"1px solid #E7E7E7"}}><div style={{fontSize:13,fontWeight:900,color:s.color}}>{now}%</div>{was!=null&&<DeltaPill now={now} prev={was}/>}</td>);
                })}
                <td style={{padding:"7px 10px",textAlign:"center",borderLeft:"2px solid #E7E7E7"}}>
                  {(()=>{
                    const now=Math.round(AGENCIES.map(a=>getOverall(selSnap,a)).reduce((a,x)=>a+x,0)/AGENCIES.length);
                    const was=cmpSnap?Math.round(AGENCIES.map(a=>getOverall(cmpSnap,a)).reduce((a,x)=>a+x,0)/AGENCIES.length):null;
                    return(<><div style={{fontSize:13,fontWeight:900,color:CL.navy}}>{now}%</div>{was!=null&&<DeltaPill now={now} prev={was}/>}</>);
                  })()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bar chart timeline */}
      {availableMonths.length>1&&(
        <Card style={{padding:"16px 20px"}}>
          <div style={{fontWeight:800,fontSize:14,color:CL.navy,marginBottom:14}}>📈 Team Average — Month-over-Month</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:8,height:80}}>
            {availableMonths.map(m=>{
              const snap=getSnap(m);
              const avg=Math.round(AGENCIES.map(a=>getOverall(snap,a)).reduce((a,x)=>a+x,0)/AGENCIES.length);
              const active=m===selMonth;
              const isReal=snapshots[m]!=null;
              return(
                <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer"}} onClick={()=>setSelMonth(m)}>
                  <div style={{fontSize:10,fontWeight:800,color:active?CL.orange:CL.navy}}>{avg}%</div>
                  <div style={{width:"100%",background:active?CL.orange:isReal?"#059669":CL.navy,borderRadius:"3px 3px 0 0",opacity:active?1:isReal?0.7:0.2,height:Math.max(8,(avg/100)*60)+"px"}}/>
                  <div style={{fontSize:9,fontWeight:700,color:active?CL.orange:"#aaa"}}>{m.substring(0,3)}{isReal?"🔒":""}</div>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",gap:12,marginTop:10,flexWrap:"wrap"}}>
            {[{color:CL.orange,label:"Selected month"},{color:"#059669",label:"🔒 Locked eval"},{color:CL.navy+"33",label:"Simulated"}].map(l=>(
              <div key={l.label} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:8,background:l.color,borderRadius:2}}/><span style={{fontSize:10,color:"#aaa",fontWeight:600}}>{l.label}</span></div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}


const FORUM_SEGS=[...SEG.map(s=>({key:s.key,label:s.label,color:s.color,icon:s.icon})),{key:"general",label:"General",color:CL.navy,icon:"🌐"}];
const EMAIL_OPTIN_DEFAULT={1:true,2:true,3:true,4:true,5:true,6:true,7:true};
const FORUM_SEED=[
  {id:1,seg:"stock",title:"Best approach to get distributors to adopt Walkaway Pricing?",body:"We've been struggling to get Tier 2 distributors to use the methodology consistently. What has worked for other agencies?",author:"Patrick Sullivan",authorRole:"owner",agency:"Illumination Systems",ts:"Jun 12, 2025 · 09:14 AM",views:47,pinned:true,tags:["pricing","distributor"],sameQuestion:2,sameQuestionUsers:[2],bestAnswer:null,
    replies:[
      {id:101,author:"David Park",authorRole:"rsm",agency:"Cooper HQ",ts:"Jun 12 · 10:32 AM",votes:8,voters:{},replyTo:null,body:"Turn it into a competition. Post a weekly leaderboard of who's closest to floor pricing. Visibility drives behavior faster than policy."},
      {id:102,author:"Emily Walsh",authorRole:"rsm",agency:"Cooper HQ",ts:"Jun 13 · 08:50 AM",votes:5,voters:{},replyTo:null,body:"Make sure your inside sales team is aligned first. Most pricing breaks happen on re-orders handled by inside sales, not field visits."},
    ]},
  {id:2,seg:"spec",title:"How do you get specifiers to attend CEU events consistently?",body:"We've hosted 3 CEUs this quarter but attendance is inconsistent. Any best practices for improving show rates?",author:"George Hart",authorRole:"owner",agency:"Chesapeake",ts:"Jun 15, 2025 · 11:20 AM",views:38,pinned:false,tags:["CEU","specifier"],sameQuestion:3,sameQuestionUsers:[],bestAnswer:201,
    replies:[
      {id:201,author:"Emily Walsh",authorRole:"rsm",agency:"Cooper HQ",ts:"Jun 15 · 01:45 PM",votes:12,voters:{},replyTo:null,body:"Two things that dramatically improved our show rate: (1) Send a calendar hold 3 weeks out, not just an email invite. (2) Call or text the day before. We went from 60% to 88% show rate."},
      {id:202,author:"Michael Torres",authorRole:"vp",agency:"Cooper HQ",ts:"Jun 16 · 09:00 AM",votes:6,voters:{},replyTo:null,body:"Try hosting at your office instead of their conference room — it sets you apart."},
    ]},
  {id:3,seg:"connected",title:"WLX vs. competitor — how do you handle the price objection?",body:"We keep running into: 'WLX is 15-20% more than the competitor system.' How are others handling this?",author:"Marcus Bell",authorRole:"owner",agency:"Premier",ts:"Jun 18, 2025 · 03:30 PM",views:62,pinned:true,tags:["WLX","controls"],sameQuestion:5,sameQuestionUsers:[],bestAnswer:null,
    replies:[{id:301,author:"David Park",authorRole:"rsm",agency:"Cooper HQ",ts:"Jun 18 · 04:55 PM",votes:9,voters:{},replyTo:null,body:"Lead with TCO, not sticker price. Build a 5-year cost model: energy savings + rebate capture + reduced maintenance. In most markets WLX pays back the premium in 18–24 months."}]},
  {id:4,seg:"general",title:"What's the most effective way to prepare for a Cooper planning meeting?",body:"We have our quarterly planning meeting coming up. What should we bring and how do agencies get the most value?",author:"Patrick Sullivan",authorRole:"owner",agency:"Illumination Systems",ts:"Jun 22, 2025 · 09:00 AM",views:54,pinned:false,tags:["planning","quarterly"],sameQuestion:1,sameQuestionUsers:[],bestAnswer:null,
    replies:[{id:401,author:"Michael Torres",authorRole:"vp",agency:"Cooper HQ",ts:"Jun 22 · 10:15 AM",votes:14,voters:{},replyTo:null,body:"Three things: (1) Come with a win/loss analysis from last quarter. (2) Bring your pipeline by segment with realistic close dates. (3) Have a specific ask for each segment."}]},
];

function ForumPage({currentUser}){
  const [posts,setPosts]=useState([]);
  const [view,setView]=useState("list");
  const [activePostId,setActivePostId]=useState(null);
  const [segFilter,setSegFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({title:"",body:"",seg:"general",tags:""});
  const [toastMsg,setToastMsg]=useState("");
  const [newAnswer,setNewAnswer]=useState("");
  const [replyingTo,setReplyingTo]=useState(null);
  const [replyText,setReplyText]=useState("");
  const [votedMap,setVotedMap]=useState({});
  const [loadingPosts,setLoadingPosts]=useState(true);

  const uid=currentUser?.id||null;
  const me=currentUser?.name||"Guest";
  const myRole=currentUser?.role||"staff";
  const myAgency=currentUser?.agency||"";

  const showToast=msg=>{setToastMsg(msg);setTimeout(()=>setToastMsg(""),3500);};

  // Load posts — in-memory for test mode
  const loadPosts=useCallback(async()=>{
    setPosts(FORUM_SEED.map(p=>({...p,replies:p.replies||[]})));
    setLoadingPosts(false);
  },[uid]);

  useEffect(()=>{loadPosts();},[loadPosts]);


  const openPost=async(id)=>{
    setPosts(prev=>prev.map(p=>p.id===id?{...p,views:(p.views||0)+1}:p));
    setActivePostId(id);setView("post");setNewAnswer("");setReplyingTo(null);setReplyText("");
  };
  const goBack=()=>{setView("list");setActivePostId(null);};

  const submitPost=async()=>{
    if(!form.title.trim()||!form.body.trim())return;
    const tags=form.tags.split(",").map(t=>t.trim()).filter(Boolean);
    const p={id:Date.now(),seg:form.seg,title:form.title,body:form.body,
      author_id:uid,author_name:me,author_role:myRole,author_agency:myAgency,
      tags,pinned:false,views:0,best_answer_id:null,
      created_at:new Date().toISOString(),replies:[]};
    setPosts(prev=>[p,...prev]);
    setForm({title:"",body:"",seg:"general",tags:""});setShowForm(false);
    showToast("✓ Question posted!");
  };

  const submitAnswer=async()=>{
    if(!newAnswer.trim())return;
    const r={id:Date.now(),post_id:activePostId,parent_reply_id:null,
      author_id:uid,author_name:me,author_role:myRole,author_agency:myAgency,
      body:newAnswer.trim(),votes:0,created_at:new Date().toISOString()};
    setPosts(prev=>prev.map(p=>p.id===activePostId?{...p,replies:[...p.replies,r]}:p));
    setNewAnswer("");showToast("✓ Answer posted!");
  };

  const submitReply=async(parentId)=>{
    if(!replyText.trim())return;
    const r={id:Date.now(),post_id:activePostId,parent_reply_id:parentId,
      author_id:uid,author_name:me,author_role:myRole,author_agency:myAgency,
      body:replyText.trim(),votes:0,created_at:new Date().toISOString()};
    setPosts(prev=>prev.map(p=>p.id===activePostId?{...p,replies:[...p.replies,r]}:p));
    setReplyText("");setReplyingTo(null);showToast("✓ Reply posted!");
  };

  const castVote=async(replyId)=>{
    const already=votedMap[replyId];
    setVotedMap(prev=>({...prev,[replyId]:!already}));
    setPosts(prev=>prev.map(p=>({...p,replies:p.replies.map(r=>r.id===replyId?{...r,votes:r.votes+(already?-1:1)}:r)})));
  };

  const markBest=async(replyId)=>{
    setPosts(prev=>prev.map(p=>p.id===activePostId?{...p,best_answer_id:p.best_answer_id===replyId?null:replyId}:p));
  };

  const voteSameQuestion=(postId)=>{
    if(!uid)return;
    setPosts(prev=>prev.map(p=>{
      if(p.id!==postId)return p;
      const users=p.sameQuestionUsers||[];
      const already=users.includes(uid);
      return{...p,
        sameQuestionUsers:already?users.filter(u=>u!==uid):[...users,uid],
        sameQuestion:(p.sameQuestion||0)+(already?-1:1),
      };
    }));
  };

  const filtered=[...posts]
    .filter(p=>segFilter==="all"||p.seg===segFilter)
    .filter(p=>!search||p.title.toLowerCase().includes(search.toLowerCase())||p.body.toLowerCase().includes(search.toLowerCase()));

  const activePost=posts.find(p=>p.id===activePostId);

  const iStyle={width:"100%",padding:"9px 12px",border:"1.5px solid #DDD",borderRadius:8,fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"Montserrat,sans-serif"};

  if(view==="post"&&activePost){
    const sm=FORUM_SEGS.find(s=>s.key===activePost.seg)||FORUM_SEGS[FORUM_SEGS.length-1];
    const topLevel=activePost.replies.filter(r=>!r.parent_reply_id).sort((a,b)=>{
      if(activePost.best_answer_id===a.id)return -1;
      if(activePost.best_answer_id===b.id)return 1;
      return b.votes-a.votes;
    });
    const childrenOf=id=>activePost.replies.filter(r=>r.parent_reply_id===id);
    const Avatar=({role,size=28})=>(<div style={{width:size,height:size,borderRadius:"50%",background:ROLES[role]?.color||"#888",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.5,flexShrink:0}}>{ROLES[role]?.icon||"👤"}</div>);

    const ReplyBubble=({r,depth=0})=>{
      const isBest=activePost.best_answer_id===r.id;
      const voted=votedMap[r.id];
      const kids=childrenOf(r.id);
      const isReplying=replyingTo===r.id;
      const rAuthorRole=r.author_role||r.authorRole||"staff";
      return(
        <div style={{marginLeft:depth>0?20:0}}>
          <div style={{background:isBest?"#F0FDF4":"#fff",border:"1.5px solid "+(isBest?"#86EFAC":"#E7E7E7"),borderLeft:"3px solid "+(depth>0?"#E7E7E7":sm.color),borderRadius:10,overflow:"hidden",marginBottom:8}}>
            {isBest&&(<div style={{background:"#059669",padding:"4px 14px",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:11}}>✅</span><span style={{fontSize:10,fontWeight:800,color:"#fff",letterSpacing:"0.06em",textTransform:"uppercase"}}>Best Answer</span></div>)}
            <div style={{padding:"14px 16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                <Avatar role={rAuthorRole} size={28}/>
                <span style={{fontSize:12,fontWeight:800,color:CL.navy}}>{r.author_name||r.author}</span>
                <Badge label={ROLES[rAuthorRole]?.label||"User"} color={ROLES[rAuthorRole]?.color||"#888"}/>
                {(r.author_agency||r.agency)&&<span style={{fontSize:11,color:"#aaa"}}>{r.author_agency||r.agency}</span>}
                <span style={{marginLeft:"auto",fontSize:10,color:"#bbb"}}>{r.created_at?new Date(r.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric"}):r.ts}</span>
              </div>
              <p style={{fontSize:13,color:"#444",lineHeight:1.8,margin:"0 0 12px",whiteSpace:"pre-wrap"}}>{r.body}</p>
              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                <button onClick={()=>castVote(r.id)} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",border:"1.5px solid "+(voted?CL.orange:"#DDD"),borderRadius:20,background:voted?CL.orange+"12":"#fff",color:voted?CL.orange:"#888",fontWeight:700,fontSize:11,cursor:"pointer"}}>▲ {r.votes>0?r.votes:""} Upvote</button>
                <button onClick={()=>{if(replyingTo===r.id){setReplyingTo(null);setReplyText("");}else{setReplyingTo(r.id);setReplyText("");}}} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",border:"1.5px solid #DDD",borderRadius:20,background:isReplying?"#F0F0F0":"#fff",color:"#888",fontWeight:700,fontSize:11,cursor:"pointer"}}>↩ Reply</button>
                {canMarkBest&&!isBest&&(<button onClick={()=>markBest(r.id)} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",border:"1.5px solid #059669",borderRadius:20,background:"#fff",color:"#059669",fontWeight:700,fontSize:11,cursor:"pointer"}}>✓ Mark Best</button>)}
                {canMarkBest&&isBest&&(<button onClick={()=>markBest(r.id)} style={{padding:"4px 10px",border:"1.5px solid #aaa",borderRadius:20,background:"#fff",color:"#aaa",fontWeight:700,fontSize:11,cursor:"pointer"}}>✕ Unmark</button>)}
              </div>
              {isReplying&&(
                <div style={{marginTop:12,background:"#F7F7F7",borderRadius:8,padding:"12px"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase",marginBottom:6}}>Replying to {r.author_name||r.author}</div>
                  <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder={`Reply to ${r.author_name||r.author}…`} rows={3} style={{...iStyle,resize:"none",background:"#fff",marginBottom:8}}/>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>submitReply(r.id)} disabled={!replyText.trim()} style={{padding:"7px 18px",background:replyText.trim()?sm.color:"#DDD",color:"#fff",border:"none",borderRadius:7,fontWeight:700,fontSize:12,cursor:replyText.trim()?"pointer":"default"}}>Post Reply</button>
                    <button onClick={()=>{setReplyingTo(null);setReplyText("");}} style={{padding:"7px 14px",border:"1.5px solid #DDD",borderRadius:7,background:"#fff",color:"#888",fontWeight:600,fontSize:12,cursor:"pointer"}}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {kids.length>0&&(<div style={{borderLeft:"2px solid #F0F0F0",paddingLeft:12,marginBottom:8}}>{kids.map(kid=><ReplyBubble key={kid.id} r={kid} depth={depth+1}/>)}</div>)}
        </div>
      );
    };
    const postAuthorRole=activePost.author_role||activePost.authorRole||"staff";
    return(
      <div style={{padding:24,maxWidth:820,margin:"0 auto"}}>
        {toastMsg&&<div style={{position:"fixed",top:16,right:16,zIndex:9999,padding:"11px 20px",background:"#059669",color:"#fff",borderRadius:10,fontWeight:700,fontSize:13,boxShadow:"0 8px 24px rgba(0,0,0,0.18)"}}>{toastMsg}</div>}
        <button onClick={goBack} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 16px",border:"1.5px solid #DDD",borderRadius:8,background:"#fff",color:CL.navy,fontSize:12,fontWeight:700,cursor:"pointer",marginBottom:20}}>← Back to Forum</button>
        <Card style={{padding:"22px 26px",marginBottom:20,borderTop:"4px solid "+sm.color}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
            <Badge label={sm.icon+" "+sm.label} color={sm.color}/>
            {activePost.pinned&&<Badge label="📌 Pinned" color="#D97706"/>}
            {(activePost.tags||[]).map(t=><span key={t} style={{fontSize:10,background:"#F0F0F0",color:"#777",padding:"2px 8px",borderRadius:4,fontWeight:600}}>#{t}</span>)}
          </div>
          <h2 style={{fontSize:20,fontWeight:900,color:CL.navy,margin:"0 0 14px",lineHeight:1.35}}>{activePost.title}</h2>
          <p style={{fontSize:14,color:"#555",lineHeight:1.85,margin:"0 0 18px",whiteSpace:"pre-wrap"}}>{activePost.body}</p>
          <div style={{borderTop:"1px solid #F0F0F0",paddingTop:14,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:ROLES[postAuthorRole]?.color||"#888",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{ROLES[postAuthorRole]?.icon}</div>
            <span style={{fontSize:13,fontWeight:800,color:CL.navy}}>{activePost.author_name||activePost.author}</span>
            <Badge label={ROLES[postAuthorRole]?.label||"User"} color={ROLES[postAuthorRole]?.color||"#888"}/>
            <span style={{fontSize:11,color:"#aaa"}}>{activePost.author_agency||activePost.agency}</span>
            <span style={{marginLeft:"auto",fontSize:11,color:"#bbb"}}>👁 {activePost.views} · {activePost.created_at?new Date(activePost.created_at).toLocaleDateString():activePost.ts}</span>
          </div>
          {/* Same Question Button */}
          {(()=>{
            const sameVoted=(activePost.sameQuestionUsers||[]).includes(uid);
            const isOwn=(activePost.author_id===uid)||(activePost.authorRole===myRole&&activePost.author_name===me);
            if(isOwn)return null;
            return(
              <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid #F5F5F5",display:"flex",alignItems:"center",gap:10}}>
                <button onClick={()=>voteSameQuestion(activePost.id)} disabled={!uid} style={{
                  display:"flex",alignItems:"center",gap:7,padding:"8px 16px",
                  border:"2px solid "+(sameVoted?CL.orange:"#DDD"),
                  borderRadius:20,
                  background:sameVoted?CL.orange+"10":"#fff",
                  color:sameVoted?CL.orange:"#888",
                  fontWeight:700,fontSize:12,cursor:uid?"pointer":"default",
                  transition:"all 0.15s"
                }}>
                  <span style={{fontSize:14}}>{sameVoted?"✋":"🙋"}</span>
                  {sameVoted?"I have this question too":"I have the same question"}
                  <span style={{
                    background:sameVoted?CL.orange:"#E7E7E7",
                    color:sameVoted?"#fff":"#888",
                    borderRadius:10,padding:"1px 8px",fontSize:11,fontWeight:800,marginLeft:2
                  }}>{activePost.sameQuestion||0}</span>
                </button>
                {sameVoted&&<span style={{fontSize:11,color:CL.orange,fontWeight:600}}>You're following this question</span>}
              </div>
            );
          })()}
        </Card>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontSize:16,fontWeight:900,color:CL.navy}}>{topLevel.length} {topLevel.length===1?"Answer":"Answers"}</div>
          {topLevel.length>1&&<div style={{fontSize:11,color:"#aaa"}}>Best answer pinned · sorted by votes</div>}
        </div>
        {topLevel.length===0&&(<div style={{textAlign:"center",padding:"32px 24px",background:"#FFF7ED",borderRadius:12,border:"1px solid #FED7AA",marginBottom:20}}><div style={{fontSize:36,marginBottom:10}}>🙋</div><div style={{fontSize:15,fontWeight:800,color:"#D97706",marginBottom:6}}>Be the first to answer!</div><div style={{fontSize:12,color:"#aaa"}}>{activePost.author_name||activePost.author} is waiting for a response.</div></div>)}
        <div style={{marginBottom:24}}>{topLevel.map(r=><ReplyBubble key={r.id} r={r} depth={0}/>)}</div>
        <Card style={{padding:"22px 24px",border:"2px solid "+sm.color+"40"}}>
          <div style={{fontSize:15,fontWeight:900,color:CL.navy,marginBottom:4}}>Your Answer</div>
          <div style={{fontSize:12,color:"#aaa",marginBottom:14}}>Posting as <strong style={{color:CL.navy}}>{me}</strong>{!uid&&<span style={{color:"#EF4444",marginLeft:4}}>— sign in to post</span>}</div>
          <textarea value={newAnswer} onChange={e=>setNewAnswer(e.target.value)} placeholder="Share your experience, insight, or recommendation…" rows={5} disabled={!uid} style={{...iStyle,resize:"vertical",marginBottom:12,opacity:!uid?0.5:1}}/>
          <button onClick={submitAnswer} disabled={!newAnswer.trim()||!uid} style={{padding:"11px 28px",background:newAnswer.trim()&&uid?sm.color:"#DDD",color:"#fff",border:"none",borderRadius:9,fontWeight:800,fontSize:13,cursor:newAnswer.trim()&&uid?"pointer":"default"}}>Post Answer →</button>
        </Card>
      </div>
    );
  }

  // ── LIST VIEW ──
  return(
    <div style={{padding:24,maxWidth:960,margin:"0 auto"}}>
      {toastMsg&&<div style={{position:"fixed",top:16,right:16,zIndex:9999,padding:"11px 20px",background:"#059669",color:"#fff",borderRadius:10,fontWeight:700,fontSize:13,boxShadow:"0 8px 24px rgba(0,0,0,0.18)"}}>{toastMsg}</div>}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:20}}>
        <div>
          <div style={{fontSize:10,fontWeight:800,color:"#9F9F9F",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>Community</div>
          <div style={{fontSize:24,fontWeight:900,color:CL.navy}}>💬 Community Q&A Forum</div>
          <div style={{fontSize:13,color:"#888",marginTop:2}}>Ask questions · share answers · build shared knowledge</div>
        </div>
        <button onClick={()=>setShowForm(p=>!p)} style={{padding:"10px 20px",background:showForm?"#888":CL.orange,color:"#fff",border:"none",borderRadius:9,fontWeight:800,fontSize:13,cursor:"pointer"}}>{showForm?"✕ Cancel":"+ Ask a Question"}</button>
      </div>
      {showForm&&(
        <Card style={{padding:"22px 24px",marginBottom:20,border:"2px solid "+CL.orange+"40"}}>
          <div style={{fontSize:15,fontWeight:900,color:CL.navy,marginBottom:16}}>📝 New Question</div>
          <div style={{marginBottom:12}}><div style={{fontSize:10,fontWeight:700,color:"#AAA",textTransform:"uppercase",marginBottom:5}}>Question Title *</div><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="What do you want to know?" style={iStyle}/></div>
          <div style={{marginBottom:12}}><div style={{fontSize:10,fontWeight:700,color:"#AAA",textTransform:"uppercase",marginBottom:5}}>Details *</div><textarea value={form.body} onChange={e=>setForm(p=>({...p,body:e.target.value}))} placeholder="Describe your situation…" rows={4} style={{...iStyle,resize:"vertical"}}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <div><div style={{fontSize:10,fontWeight:700,color:"#AAA",textTransform:"uppercase",marginBottom:5}}>Segment</div><select value={form.seg} onChange={e=>setForm(p=>({...p,seg:e.target.value}))} style={{...iStyle,cursor:"pointer"}}>{FORUM_SEGS.map(s=><option key={s.key} value={s.key}>{s.icon} {s.label}</option>)}</select></div>
            <div><div style={{fontSize:10,fontWeight:700,color:"#AAA",textTransform:"uppercase",marginBottom:5}}>Tags</div><input value={form.tags} onChange={e=>setForm(p=>({...p,tags:e.target.value}))} placeholder="pricing, WLX, distributor…" style={iStyle}/></div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={submitPost} disabled={!form.title.trim()||!form.body.trim()} style={{padding:"10px 24px",background:form.title.trim()&&form.body.trim()?CL.orange:"#DDD",color:"#fff",border:"none",borderRadius:9,fontWeight:800,fontSize:13,cursor:form.title.trim()&&form.body.trim()?"pointer":"default"}}>Post Question →</button>
            <button onClick={()=>setShowForm(false)} style={{padding:"10px 18px",border:"1.5px solid #DDD",borderRadius:9,background:"#fff",color:"#888",fontWeight:700,fontSize:13,cursor:"pointer"}}>Cancel</button>
          </div>
        </Card>
      )}
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search questions…" style={{flex:1,minWidth:160,padding:"8px 12px",border:"1.5px solid #DDD",borderRadius:9,fontSize:12,outline:"none",fontFamily:"Montserrat,sans-serif"}}/>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {[{key:"all",label:"All",color:CL.navy,icon:""},...FORUM_SEGS].map(s=>(
            <button key={s.key} onClick={()=>setSegFilter(s.key)} style={{padding:"5px 12px",borderRadius:20,border:"2px solid "+(segFilter===s.key?(s.color||CL.navy):"#DDD"),background:segFilter===s.key?(s.color||CL.navy)+"15":"#fff",color:segFilter===s.key?(s.color||CL.navy):"#888",fontWeight:700,fontSize:11,cursor:"pointer"}}>{s.icon} {s.label}</button>
          ))}
        </div>
        <span style={{fontSize:11,color:"#aaa",whiteSpace:"nowrap"}}>{filtered.length} question{filtered.length!==1?"s":""}</span>
      </div>
      {loadingPosts&&<div style={{textAlign:"center",padding:40,color:"#aaa",fontSize:13}}>Loading forum…</div>}
      {!loadingPosts&&filtered.length===0&&(
        <div style={{textAlign:"center",padding:"48px 24px",color:"#aaa"}}>
          <div style={{fontSize:36,marginBottom:12}}>🔍</div>
          <div style={{fontWeight:800,fontSize:15,color:CL.navy,marginBottom:6}}>No questions found</div>
          <button onClick={()=>setShowForm(true)} style={{marginTop:8,padding:"10px 22px",background:CL.orange,color:"#fff",border:"none",borderRadius:9,fontWeight:700,fontSize:13,cursor:"pointer"}}>+ Ask the First Question</button>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(post=>{
          const sm=FORUM_SEGS.find(s=>s.key===post.seg)||FORUM_SEGS[FORUM_SEGS.length-1];
          const topAnswers=(post.replies||[]).filter(r=>!r.parent_reply_id);
          const postRole=post.author_role||post.authorRole||"staff";
          return(
            <div key={post.id} onClick={()=>openPost(post.id)} style={{background:"#fff",borderRadius:12,border:"1px solid #E7E7E7",borderLeft:"4px solid "+sm.color,boxShadow:"0 2px 6px rgba(0,0,0,0.04)",cursor:"pointer",overflow:"hidden",transition:"box-shadow 0.15s,transform 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,0.10)";e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 6px rgba(0,0,0,0.04)";e.currentTarget.style.transform="none";}}>
              <div style={{padding:"16px 18px",display:"flex",gap:16,alignItems:"flex-start"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0,minWidth:48,paddingTop:2}}>
                  <div style={{fontSize:22,fontWeight:900,color:topAnswers.length>0?"#059669":"#CCC",lineHeight:1}}>{topAnswers.length}</div>
                  <div style={{fontSize:9,fontWeight:700,color:"#bbb",textTransform:"uppercase",lineHeight:1}}>answers</div>
                  {post.best_answer_id&&<span style={{fontSize:13,marginTop:2}}>✅</span>}
                  {(post.sameQuestion||0)>0&&(
                    <div style={{marginTop:4,display:"flex",flexDirection:"column",alignItems:"center",gap:1,padding:"3px 6px",background:"#FFF7ED",borderRadius:6,border:"1px solid #FED7AA"}}>
                      <span style={{fontSize:12,lineHeight:1}}>🙋</span>
                      <span style={{fontSize:9,fontWeight:800,color:"#D97706"}}>{post.sameQuestion}</span>
                    </div>
                  )}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                    <Badge label={sm.icon+" "+sm.label} color={sm.color}/>
                    {post.pinned&&<Badge label="📌 Pinned" color="#D97706"/>}
                    {(post.tags||[]).map(t=><span key={t} style={{fontSize:10,background:"#F0F0F0",color:"#888",padding:"2px 7px",borderRadius:4,fontWeight:600}}>#{t}</span>)}
                  </div>
                  <div style={{fontWeight:800,fontSize:14,color:CL.navy,marginBottom:5,lineHeight:1.35}}>{post.title}</div>
                  <div style={{fontSize:12,color:"#888",lineHeight:1.65,marginBottom:10}}>{post.body.length>130?post.body.substring(0,130)+"…":post.body}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8,fontSize:11,color:"#bbb",flexWrap:"wrap"}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:ROLES[postRole]?.color||"#888",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>{ROLES[postRole]?.icon}</div>
                    <span style={{fontWeight:700,color:"#666"}}>{post.author_name||post.author}</span>
                    {(post.author_agency||post.agency)&&<><span>·</span><span>{post.author_agency||post.agency}</span></>}
                    <span>·</span><span>👁 {post.views||0}</span>
                    {(post.sameQuestion||0)>0&&(
                      <><span>·</span>
                      <span style={{display:"flex",alignItems:"center",gap:3,color:"#888",fontWeight:600}}>
                        🙋 {post.sameQuestion} {post.sameQuestion===1?"person has":"people have"} this question
                      </span></>
                    )}
                    <span style={{marginLeft:"auto"}}>{post.created_at?new Date(post.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):post.ts}</span>
                  </div>
                  {/* Same question vote — shown on hover area, stop propagation */}
                  {uid&&uid!==post.author_id&&(()=>{
                    const sameVoted=(post.sameQuestionUsers||[]).includes(uid);
                    return(
                      <div style={{marginTop:8}} onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>voteSameQuestion(post.id)} style={{
                          display:"inline-flex",alignItems:"center",gap:6,
                          padding:"5px 13px",
                          border:"1.5px solid "+(sameVoted?CL.orange:"#E7E7E7"),
                          borderRadius:20,
                          background:sameVoted?CL.orange+"0E":"#F9F9F9",
                          color:sameVoted?CL.orange:"#999",
                          fontWeight:700,fontSize:11,cursor:"pointer",
                          transition:"all 0.15s"
                        }}>
                          <span>{sameVoted?"✋":"🙋"}</span>
                          {sameVoted?"I have this question too":"I have the same question"}
                          {(post.sameQuestion||0)>0&&(
                            <span style={{background:sameVoted?CL.orange:"#DDD",color:sameVoted?"#fff":"#888",borderRadius:10,padding:"0 6px",fontSize:10,fontWeight:800}}>{post.sameQuestion}</span>
                          )}
                        </button>
                      </div>
                    );
                  })()}
                </div>
                <div style={{fontSize:18,color:"#DDD",alignSelf:"center",flexShrink:0}}>›</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
// ── Agency Selector Bar ──────────────────────────────────────
// ── Agency Info Strip (read-only — selector lives in sidebar) ──
function AgencyInfoStrip({selAgency,user,onViewProfile}){
  const dir=AGENCY_DIRECTORY[selAgency]||{};
  return(
    <div style={{background:"#fff",borderBottom:"1.5px solid #E7E7E7",padding:"7px 24px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",flexShrink:0,position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
      {/* Active agency label */}
      <div style={{display:"flex",alignItems:"center",gap:8,borderRight:"1px solid #E7E7E7",paddingRight:14,marginRight:2}}>
        <span style={{fontSize:9,fontWeight:800,color:"#9F9F9F",textTransform:"uppercase",letterSpacing:"0.12em",whiteSpace:"nowrap"}}>Active Agency</span>
        <span style={{fontSize:13,fontWeight:900,color:CL.navy,whiteSpace:"nowrap"}}>{selAgency}</span>
      </div>
      {/* Team pills */}
      {dir.rsm&&(
        <div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 10px",background:CL.orange+"10",borderRadius:20,border:"1px solid "+CL.orange+"25"}}>
          <span style={{fontSize:10}}>🏢</span><span style={{fontSize:10,fontWeight:700,color:CL.orange}}>RSM: {dir.rsm}</span>
        </div>
      )}
      {dir.vp&&(
        <div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 10px",background:CL.navy+"08",borderRadius:20,border:"1px solid "+CL.navy+"18"}}>
          <span style={{fontSize:10}}>⭐</span><span style={{fontSize:10,fontWeight:700,color:CL.navy}}>VP: {dir.vp}</span>
        </div>
      )}
      {dir.owner&&(
        <div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 10px",background:"#2563EB0E",borderRadius:20,border:"1px solid #2563EB25"}}>
          <span style={{fontSize:10}}>🏬</span><span style={{fontSize:10,fontWeight:700,color:"#2563EB"}}>Owner: {dir.owner}</span>
        </div>
      )}
      {dir.region&&(
        <div style={{padding:"3px 10px",background:"#F5F5F5",borderRadius:20}}>
          <span style={{fontSize:10,fontWeight:600,color:"#888"}}>📍 {dir.region}</span>
        </div>
      )}
      <button onClick={()=>onViewProfile(selAgency)} style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,padding:"5px 13px",background:CL.navy,color:"#fff",border:"none",borderRadius:7,fontWeight:700,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
        🏬 Agency Profile →
      </button>
    </div>
  );
}

// ── Agency Profile Page ──────────────────────────────────────
function AgencyProfilePage({agency,scores,onBack,user,annualActions}){
  const dir=AGENCY_DIRECTORY[agency]||{};
  const [activeTab,setActiveTab]=useState("scorecard");
  const overall=overallPct(scores,agency);
  const segScores=SEG.map(s=>({...s,pct:segPct(scores,agency,s.key).pct}));
  const radarData=SEG.map(s=>({label:s.label.substring(0,4),value:Math.round(segPct(scores,agency,s.key).pct*100)}));
  const agActions=[...Object.values(WIN_ACTIONS).flat()].filter(a=>a.agencyId===agency);
  const annualAgActions=annualActions||ANNUAL_ACTIONS;
  const tabs=[{key:"scorecard",label:"📊 Scorecard"},{key:"actions",label:"✅ Actions"},{key:"annual",label:"⚡ Year Plan"},{key:"team",label:"👥 Team"}];
  return(
    <div style={{padding:24,maxWidth:1060,margin:"0 auto"}}>
      {/* Back */}
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 16px",border:"1.5px solid #DDD",borderRadius:8,background:"#fff",color:CL.navy,fontSize:12,fontWeight:700,cursor:"pointer",marginBottom:20}}>← Back</button>
      {/* Header card */}
      <div style={{background:CL.navy,borderRadius:16,padding:"24px 28px",marginBottom:20,display:"flex",gap:24,flexWrap:"wrap",alignItems:"flex-start"}}>
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>Agency Profile</div>
          <div style={{fontSize:28,fontWeight:900,color:"#fff",marginBottom:4}}>{agency}</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>
            {dir.region&&<span style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600}}>📍 {dir.region}</span>}
            {dir.rsm&&<span style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600}}>· RSM: {dir.rsm}</span>}
            {dir.vp&&<span style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600}}>· VP: {dir.vp}</span>}
          </div>
        </div>
        {/* Overall score */}
        <div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"16px 20px",textAlign:"center",minWidth:120}}>
          <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",marginBottom:4}}>Overall</div>
          <div style={{fontSize:40,fontWeight:900,color:CL.orange,lineHeight:1}}>{Math.round(overall.pct*100)}%</div>
          <div style={{marginTop:6}}><MatBadge pct={overall.pct}/></div>
        </div>
        {/* Segment mini-bars */}
        <div style={{flex:1,minWidth:200,display:"flex",flexDirection:"column",gap:8,justifyContent:"center"}}>
          {segScores.map(s=>(
            <div key={s.key} style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:10,fontWeight:700,color:s.color,width:60,flexShrink:0}}>{s.label.substring(0,4)}</span>
              <div style={{flex:1,height:6,background:"rgba(255,255,255,0.12)",borderRadius:3,overflow:"hidden"}}>
                <div style={{width:Math.round(s.pct*100)+"%",height:"100%",background:s.color,borderRadius:3}}/>
              </div>
              <span style={{fontSize:11,fontWeight:800,color:"#fff",width:36,textAlign:"right"}}>{Math.round(s.pct*100)}%</span>
            </div>
          ))}
        </div>
      </div>
      {/* Tabs */}
      <div style={{display:"flex",gap:4,marginBottom:20,borderBottom:"2px solid #E7E7E7"}}>
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setActiveTab(t.key)} style={{padding:"9px 18px",border:"none",background:"transparent",fontWeight:700,fontSize:13,cursor:"pointer",color:activeTab===t.key?CL.orange:"#aaa",borderBottom:"3px solid "+(activeTab===t.key?CL.orange:"transparent"),marginBottom:-2,fontFamily:"Montserrat,sans-serif"}}>{t.label}</button>
        ))}
      </div>

      {/* SCORECARD TAB */}
      {activeTab==="scorecard"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:16}}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {SEG.map(seg=>{
              const sp=segPct(scores,agency,seg.key);
              return(
                <Card key={seg.key} style={{padding:"16px 20px",borderLeft:"4px solid "+seg.color}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <span style={{fontSize:16}}>{seg.icon}</span>
                    <span style={{fontWeight:800,fontSize:14,color:CL.navy,flex:1}}>{seg.label}</span>
                    <span style={{fontSize:18,fontWeight:900,color:seg.color}}>{Math.round(sp.pct*100)}%</span>
                    <MatBadge pct={sp.pct}/>
                  </div>
                  <PBar pct={sp.pct} color={seg.color} h={6}/>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:6,marginTop:12}}>
                    {seg.criteria.map(c=>{
                      const sc=scores[agency]?.[seg.key+"_"+c.key]||0;
                      return(
                        <div key={c.key} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",borderRadius:7,background:sc>0?LVL_BG[sc]:"#F7F7F7",border:"1px solid "+(sc>0?LVL_C[sc]+"30":"#E7E7E7")}}>
                          <div style={{width:22,height:22,borderRadius:6,background:sc>0?LVL_C[sc]:"#DDD",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff",flexShrink:0}}>{sc||"—"}</div>
                          <span style={{fontSize:11,fontWeight:600,color:CL.navy,lineHeight:1.3}}>{c.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
          <div><Card style={{padding:16}}><ST>Capability Radar</ST><RadarChart data={radarData} color={CL.orange}/></Card></div>
        </div>
      )}

      {/* ACTIONS TAB */}
      {activeTab==="actions"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {["last30","current","next30"].map(wk=>{
            const wm=WIN_META[wk];
            const wActions=agActions.filter(a=>a.window===wk||(wk==="current"&&!a.window));
            // For seeded data match by window key
            const winActions=(WIN_ACTIONS[wk]||[]).filter(a=>a.agencyId===agency);
            return winActions.length>0?(
              <div key={wk}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:wm.color}}/>
                  <span style={{fontSize:11,fontWeight:800,textTransform:"uppercase",color:wm.color,letterSpacing:"0.1em"}}>{wm.label}</span>
                  <span style={{fontSize:11,color:"#aaa"}}>{wm.sub}</span>
                </div>
                {winActions.map(a=>{
                  const sm=STATUS_META[a.status];const seg=SEG.find(s=>s.key===a.segment);
                  const prog=a.target>0?Math.min(100,Math.round(a.actual/a.target*100)):0;
                  return(
                    <Card key={a.id} style={{marginBottom:8,padding:"12px 16px",borderLeft:"3px solid "+(seg?.color||"#DDD")}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                        <span style={{fontWeight:800,fontSize:13,color:CL.navy,flex:1}}>{a.title}</span>
                        <Badge label={sm.label} color={sm.color}/>
                        {seg&&<Badge label={seg.label} color={seg.color}/>}
                        <Badge label={a.priority} color={PRIORITY_COLOR[a.priority]}/>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{flex:1,height:5,background:"#F0F0F0",borderRadius:5,overflow:"hidden"}}><div style={{width:prog+"%",height:"100%",background:seg?.color||CL.orange,borderRadius:5}}/></div>
                        <span style={{fontSize:10,fontWeight:700,color:"#aaa",whiteSpace:"nowrap"}}>{a.actual}/{a.target} {a.metric}</span>
                        <span style={{fontSize:10,color:"#aaa",whiteSpace:"nowrap"}}>Due {a.dueDate}</span>
                      </div>
                      {a.desc&&<p style={{fontSize:11,color:"#888",margin:"6px 0 0",lineHeight:1.6}}>{a.desc}</p>}
                    </Card>
                  );
                })}
              </div>
            ):null;
          })}
          {agActions.length===0&&(WIN_ACTIONS.last30||[]).filter(a=>a.agencyId===agency).length===0&&(WIN_ACTIONS.current||[]).filter(a=>a.agencyId===agency).length===0&&(WIN_ACTIONS.next30||[]).filter(a=>a.agencyId===agency).length===0&&(
            <div style={{textAlign:"center",padding:"40px",color:"#aaa"}}>
              <div style={{fontSize:32,marginBottom:10}}>📋</div>
              <div style={{fontWeight:700,fontSize:14,color:CL.navy,marginBottom:4}}>No actions yet for {agency}</div>
              <div style={{fontSize:12}}>Actions will appear here once added to the Action Tracker.</div>
            </div>
          )}
        </div>
      )}

      {/* ANNUAL TAB */}
      {activeTab==="annual"&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {(annualActions||ANNUAL_ACTIONS).map(a=>{
            const done=a.weeks.filter(w=>w.status==="complete").length;
            const seg=SEG.find(s=>s.key===a.segment);
            const pct=done/a.weeks.length;
            return(
              <Card key={a.id} style={{padding:"14px 18px",borderLeft:"4px solid "+a.color}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                  <div style={{width:28,height:28,borderRadius:7,background:a.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:a.color,flexShrink:0}}>{a.id}</div>
                  <span style={{fontWeight:800,fontSize:13,color:CL.navy,flex:1}}>{a.title}</span>
                  <Badge label={"Q"+a.quarter} color={CL.navy}/>
                  {seg&&<Badge label={seg.label} color={seg.color}/>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{flex:1,height:6,background:"#F0F0F0",borderRadius:3,overflow:"hidden"}}><div style={{width:Math.round(pct*100)+"%",height:"100%",background:a.color,borderRadius:3}}/></div>
                  <span style={{fontSize:11,fontWeight:700,color:"#aaa"}}>{done}/{a.weeks.length} wks · {Math.round(pct*100)}%</span>
                </div>
                <p style={{fontSize:11,color:"#888",margin:"6px 0 0",lineHeight:1.5}}>{a.description}</p>
              </Card>
            );
          })}
        </div>
      )}

      {/* TEAM TAB */}
      {activeTab==="team"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,marginBottom:20}}>
            {[
              {role:"Agency Owner",name:dir.owner||"—",icon:"🏬",color:"#2563EB"},
              {role:"Cooper RSM",name:dir.rsm||"—",icon:"🏢",color:CL.orange},
              {role:"Vice President",name:dir.vp||"—",icon:"⭐",color:CL.navy},
            ].map(m=>(
              <Card key={m.role} style={{padding:"14px 16px",borderTop:"3px solid "+m.color}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:m.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{m.icon}</div>
                  <div><div style={{fontSize:10,fontWeight:800,color:m.color,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>{m.role}</div><div style={{fontSize:14,fontWeight:800,color:CL.navy}}>{m.name}</div></div>
                </div>
              </Card>
            ))}
          </div>
          <Card style={{padding:"16px 20px"}}>
            <ST>Agency Region & Assignment</ST>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
              {[["Region",dir.region||"—"],["RSM Territory",dir.rsm?dir.rsm+" — Pacific/NE":"—"],["Agency Code",agency]].map(([l,v])=>(
                <div key={l}><div style={{fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",marginBottom:3}}>{l}</div><div style={{fontSize:14,fontWeight:700,color:CL.navy}}>{v}</div></div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

const NAV_GROUPS=[
  {id:"dashboard",label:"Dashboard",icon:"▤",type:"link"},
  {id:"scorecard",label:"Agency Scorecard",icon:"📊",type:"group",children:[
    {id:"sc_stock",label:"Stock"},
    {id:"sc_spec",label:"Specification"},
    {id:"sc_industrial",label:"Industrial"},
    {id:"sc_connected",label:"Connected"},
  ]},
  {id:"actions_grp",label:"Action Tracker",icon:"✅",type:"group",children:[{id:"act_last30",label:"Last 30 Days"},{id:"act_current",label:"Current"},{id:"act_next30",label:"Next 30 Days"}]},
  {id:"training",label:"Training Hub",icon:"📚",type:"group",children:[{id:"learn_stock",label:"Stock Path"},{id:"learn_spec",label:"Spec Path"},{id:"learn_industrial",label:"Industrial Path"},{id:"learn_connected",label:"Connected Path"}]},
  {id:"progress",label:"Progress",icon:"📈",type:"link"},
  {id:"actions_main",label:"Actions",icon:"⚡",type:"link"},
  {id:"knowledge",label:"Knowledge Base",icon:"🗂",type:"link"},
  {id:"forum",label:"Community Q&A",icon:"💬",type:"link"},
];
const SEG_ACCENT={sc_stock:"#2563EB",sc_spec:"#7C3AED",sc_industrial:"#D97706",sc_connected:"#059669",learn_stock:"#2563EB",learn_spec:"#7C3AED",learn_industrial:"#D97706",learn_connected:"#059669",act_last30:"#6B7280",act_current:"#F26A36",act_next30:"#13294B"};

// Pages that show the agency selector bar
const PAGES_WITH_AGENCY_BAR=new Set(["dashboard","sc_stock","sc_spec","sc_industrial","sc_connected","act_last30","act_current","act_next30","learn_stock","learn_spec","learn_industrial","learn_connected","progress","actions_main"]);

export default function App(){
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [scores,setScores]=useState(seedScores);
  const [locks,setLocks]=useState({});
  const [snapshots,setSnapshots]=useState({}); // { "April": { "Illumination Systems": {...scores} } }
  const [evalHistory,setEvalHistory]=useState([]); // [{agency,month,year,timestamp,lockedBy,segScores,overall,prevSegScores,prevOverall}]
  const [annualActions,setAnnualActions]=useState(ANNUAL_ACTIONS);
  const [openGroups,setOpenGroups]=useState({scorecard:true,actions_grp:false,training:false});
  const [selAgency,setSelAgency]=useState(AGENCIES[0]);
  const [profileAgency,setProfileAgency]=useState(null); // null = not viewing profile

  // Auto-set agency for owner/staff roles
  const effectiveAgency=["owner","staff"].includes(user?.role)?user?.agency:selAgency;

  const toggleGroup=id=>setOpenGroups(p=>({...p,[id]:!p[id]}));
  const goTo=id=>{
    if(NAV_GROUPS.find(p=>p.id===id)?.priv&&(!user||!["admin","rsm","vp"].includes(user.role)))return;
    setProfileAgency(null);
    setPage(id);
  };
  const signOut=()=>{setUser(null);setPage("dashboard");};
  const viewProfile=ag=>{setProfileAgency(ag);};

  if(!user)return <LoginPage onLogin={u=>{
    setUser(u);
    setPage("dashboard");
    if(["owner","staff"].includes(u.role))setSelAgency(u.agency);
  }}/>;

  const setScoresWithPersist=setScores;

  // Called when RSM/Admin locks an evaluation — captures snapshot + history entry
  const onLock=(agency,currentScores)=>{
    const now=new Date();
    const month=MONTHS[now.getMonth()];
    const year=now.getFullYear();
    const ts=now.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})+" · "+now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
    // Full snapshot of ALL agencies at lock time
    const agSnap={};
    AGENCIES.forEach(a=>{agSnap[a]={};SEG.forEach(seg=>{seg.criteria.forEach(c=>{agSnap[a][seg.key+"_"+c.key]=currentScores[a]?.[seg.key+"_"+c.key]??0;});});});
    // Compute segment % for history badge
    const calcSeg=(ag,sk)=>{const s=SEG.find(x=>x.key===sk);let t=0,mx=0;s.criteria.forEach(c=>{const v=currentScores[ag]?.[sk+"_"+c.key]??0;if(v>0)t+=v;mx+=4;});return mx>0?Math.round(t/mx*100):0;};
    const calcOv=(ag)=>{let t=0,mx=0;SEG.forEach(s=>{s.criteria.forEach(c=>{const v=currentScores[ag]?.[s.key+"_"+c.key]??0;if(v>0)t+=v;mx+=4;});});return mx>0?Math.round(t/mx*100):0;};
    const segScores={};SEG.forEach(s=>{segScores[s.key]=calcSeg(agency,s.key);});
    const overall=calcOv(agency);
    setSnapshots(prev=>({...prev,[month]:{...(prev[month]||{}),...agSnap}}));
    setEvalHistory(prev=>{
      const prevEntry=[...prev].reverse().find(e=>e.agency===agency);
      return[...prev,{agency,month,year,timestamp:ts,lockedBy:user?.name||"Unknown",segScores,overall,prevSegScores:prevEntry?.segScores??null,prevOverall:prevEntry?.overall??null}];
    });
  };

  const isChildActive=group=>group.children?.some(c=>c.id===page);
  const showAgencyBar=PAGES_WITH_AGENCY_BAR.has(page)&&!profileAgency;

  const renderContent=()=>{
    if(profileAgency) return <AgencyProfilePage agency={profileAgency} scores={scores} onBack={()=>setProfileAgency(null)} user={user} annualActions={annualActions}/>;
    if(page==="dashboard")        return <Dashboard scores={scores} selAgency={effectiveAgency}/>;
    if(page==="sc_stock")         return <ScorecardPage scores={scores} setScores={setScoresWithPersist} segKey="stock" selAgency={effectiveAgency} setSelAgency={setSelAgency} user={user} locks={locks} setLocks={setLocks} onLock={onLock}/>;
    if(page==="sc_spec")          return <ScorecardPage scores={scores} setScores={setScoresWithPersist} segKey="spec" selAgency={effectiveAgency} setSelAgency={setSelAgency} user={user} locks={locks} setLocks={setLocks} onLock={onLock}/>;
    if(page==="sc_industrial")    return <ScorecardPage scores={scores} setScores={setScoresWithPersist} segKey="industrial" selAgency={effectiveAgency} setSelAgency={setSelAgency} user={user} locks={locks} setLocks={setLocks} onLock={onLock}/>;
    if(page==="sc_connected")     return <ScorecardPage scores={scores} setScores={setScoresWithPersist} segKey="connected" selAgency={effectiveAgency} setSelAgency={setSelAgency} user={user} locks={locks} setLocks={setLocks} onLock={onLock}/>;
    if(page==="act_last30")       return <ActionsWindowPage winKey="last30" currentUser={user} selAgency={effectiveAgency}/>;
    if(page==="act_current")      return <ActionsWindowPage winKey="current" currentUser={user} selAgency={effectiveAgency}/>;
    if(page==="act_next30")       return <ActionsWindowPage winKey="next30" currentUser={user} selAgency={effectiveAgency}/>;
    if(page==="learn_stock")      return <LearnPage segKey="stock"/>;
    if(page==="learn_spec")       return <LearnPage segKey="spec"/>;
    if(page==="learn_industrial") return <LearnPage segKey="industrial"/>;
    if(page==="learn_connected")  return <LearnPage segKey="connected"/>;
    if(page==="progress")         return <ProgressPage scores={scores} selAgency={effectiveAgency} snapshots={snapshots} evalHistory={evalHistory}/>;
    if(page==="actions_main")     return <ActionsPage currentUser={user} selAgency={effectiveAgency} annualActions={annualActions} setAnnualActions={setAnnualActions}/>;
    if(page==="knowledge")        return <KnowledgePage currentUser={user}/>;
    if(page==="forum")            return <ForumPage currentUser={user}/>;
    return <Dashboard scores={scores} selAgency={effectiveAgency}/>;
  };

  return(
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"Montserrat,sans-serif",background:"#F7F7F7"}}>
      {/* Sidebar */}
      <div style={{width:220,background:CL.navy,display:"flex",flexDirection:"column",flexShrink:0,position:"sticky",top:0,height:"100vh",overflowY:"auto"}}>
        <div style={{padding:"16px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:9,background:CL.orange,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#fff",flexShrink:0}}>CL</div>
            <div><div style={{color:"#fff",fontWeight:900,fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",lineHeight:1}}>COOPER</div><div style={{color:"rgba(255,255,255,0.45)",fontSize:9,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:2}}>Agent Excellence</div></div>
          </div>
        </div>
        {/* ── Master Agency Selector ── only for admin/rsm/vp */}
        {!["owner","staff"].includes(user.role)&&(
          <div style={{padding:"10px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5}}>Active Agency</div>
            <select value={selAgency} onChange={e=>{setSelAgency(e.target.value);setProfileAgency(null);}}
              style={{width:"100%",padding:"7px 9px",border:"1.5px solid rgba(255,255,255,0.2)",borderRadius:8,background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:12,fontWeight:700,outline:"none",cursor:"pointer",fontFamily:"Montserrat,sans-serif",marginBottom:6}}>
              {AGENCIES.map(a=><option key={a} style={{background:"#13294B",color:"#fff"}}>{a}</option>)}
            </select>
            {/* Mini team info under picker */}
            {(()=>{const dir=AGENCY_DIRECTORY[selAgency]||{};return(
              <div style={{display:"flex",flexDirection:"column",gap:3}}>
                {dir.rsm&&<div style={{fontSize:9,color:"rgba(255,255,255,0.45)",fontWeight:600}}>🏢 {dir.rsm}</div>}
                {dir.vp&&<div style={{fontSize:9,color:"rgba(255,255,255,0.35)",fontWeight:600}}>⭐ {dir.vp}</div>}
                {dir.region&&<div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:600}}>📍 {dir.region}</div>}
              </div>
            );})()}
          </div>
        )}
        <nav style={{flex:1,padding:"8px",display:"flex",flexDirection:"column",gap:1}}>
          {NAV_GROUPS.map(item=>{
            if(item.type==="link"){const active=page===item.id&&!profileAgency;const canSee=!item.priv||["admin","rsm","vp"].includes(user.role);if(!canSee)return null;return(
              <button key={item.id} onClick={()=>goTo(item.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:7,border:"none",background:active?"rgba(242,106,54,0.15)":"transparent",color:active?"#fff":"rgba(255,255,255,0.55)",fontWeight:active?700:600,fontSize:11,cursor:"pointer",textAlign:"left",borderLeft:active?"3px solid "+CL.orange:"3px solid transparent",transition:"all 0.15s",width:"100%",fontFamily:"Montserrat,sans-serif"}}>
                <span style={{fontSize:13,flexShrink:0}}>{item.icon}</span><span style={{flex:1}}>{item.label}</span>
                {item.badge&&<span style={{fontSize:9,background:"rgba(242,106,54,0.2)",color:CL.orange,padding:"2px 5px",borderRadius:4,fontWeight:800}}>{item.badge}</span>}
              </button>
            );}
            const groupActive=isChildActive(item)&&!profileAgency;const isOpen=openGroups[item.id];
            return(
              <div key={item.id}>
                <button onClick={()=>toggleGroup(item.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:7,border:"none",background:groupActive?"rgba(242,106,54,0.1)":"transparent",color:groupActive?"#fff":"rgba(255,255,255,0.55)",fontWeight:groupActive?700:600,fontSize:11,cursor:"pointer",textAlign:"left",borderLeft:groupActive?"3px solid "+CL.orange:"3px solid transparent",transition:"all 0.15s",width:"100%",fontFamily:"Montserrat,sans-serif"}}>
                  <span style={{fontSize:13,flexShrink:0}}>{item.icon}</span><span style={{flex:1}}>{item.label}</span>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.3)",transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s",display:"inline-block"}}>▼</span>
                </button>
                {isOpen&&(
                  <div style={{marginLeft:16,borderLeft:"2px solid rgba(255,255,255,0.08)",paddingLeft:4,marginBottom:2}}>
                    {item.children.map(child=>{const childActive=page===child.id&&!profileAgency;const accent=SEG_ACCENT[child.id];return(
                      <button key={child.id} onClick={()=>goTo(child.id)} style={{display:"flex",alignItems:"center",padding:"6px 10px",borderRadius:6,border:"none",background:childActive&&accent?accent+"25":"transparent",color:childActive?"#fff":"rgba(255,255,255,0.45)",fontWeight:childActive?700:500,fontSize:11,cursor:"pointer",textAlign:"left",borderLeft:childActive&&accent?"2px solid "+accent:"2px solid transparent",transition:"all 0.15s",width:"100%",fontFamily:"Montserrat,sans-serif"}}>
                        {child.label}
                      </button>
                    );})}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div style={{padding:"10px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{padding:"8px 10px",marginBottom:8,background:"rgba(255,255,255,0.05)",borderRadius:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:ROLES[user.role]?.color||CL.orange,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{ROLES[user.role]?.icon}</div>
              <div style={{minWidth:0}}><div style={{fontSize:11,fontWeight:800,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.4)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.agency}</div></div>
            </div>
            <Badge label={ROLES[user.role]?.label||"User"} color={ROLES[user.role]?.color||CL.orange}/>
          </div>
          <button onClick={signOut} style={{width:"100%",padding:"7px",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,background:"transparent",color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"Montserrat,sans-serif"}}>Sign Out</button>
          <div style={{textAlign:"center",fontSize:9,color:"rgba(255,255,255,0.2)",marginTop:10,lineHeight:1.5}}>© 2026 Cooper Lighting Solutions<br/>a Signify business</div>
        </div>
      </div>
      {/* Main content */}
      <div style={{flex:1,overflowY:"auto",maxHeight:"100vh",display:"flex",flexDirection:"column"}}>
        {showAgencyBar&&(
          <AgencyInfoStrip
            selAgency={effectiveAgency}
            user={user}
            onViewProfile={viewProfile}
          />
        )}
        <div style={{flex:1}}>{renderContent()}</div>
      </div>
    </div>
  );
}
