import { useEffect, useState } from "react";
import {
  Activity, BarChart3, CalendarDays, ClipboardList,
  Dumbbell, Scale, TrendingUp
} from "lucide-react";

// ── COLOURS ───────────────────────────────────────────────────────────────────
const DEFAULT_THEME = {
  bg0:"#03060f", bg1:"#060e1c", bg2:"#0b1a2e", bg3:"#071221",
  border:"#0f2d4a", borderHi:"#1a4060",
  textPrimary:"#e8f4ff", textSec:"#5b8db8", textDim:"#2a4f6e",
  push:"#ff6b35", pull:"#39d353", legs:"#f5c518", run:"#c084fc",
  flex:"#f472b6", rest:"#94a3b8", surf:"#00c2e0",
  accent:"#00c2e0", weight:"#f472b6",
};
const THEMES = {
  cyberpunk:{
    bg0:"#08070c",bg1:"#0f0e17",bg2:"#1a1926",bg3:"#141320",
    border:"#2d2a45",borderHi:"#48436c",
    textPrimary:"#f2f1f8",textSec:"#928dab",textDim:"#544f73",
    push:"#ff0055",pull:"#00ff66",legs:"#ffe600",run:"#9d00ff",
    flex:"#ff00aa",rest:"#5d637a",surf:"#00f0ff",
    accent:"#00f0ff",weight:"#ff0055",
  },
  eclipse:{
    bg0:"#0b0d14",bg1:"#121522",bg2:"#1b2230",bg3:"#161b28",
    border:"#2b3145",borderHi:"#3f4968",
    textPrimary:"#f4f7ff",textSec:"#8e98b8",textDim:"#5f6985",
    push:"#ff7b54",pull:"#34d399",legs:"#fbbf24",run:"#8b5cf6",
    flex:"#ec4899",rest:"#64748b",surf:"#22d3ee",
    accent:"#22d3ee",weight:"#ff7b54",
  },
  default:{...DEFAULT_THEME},
  seaGlassObsidian:{
    bg0:"#0e1312",bg1:"#141c1a",bg2:"#1d2926",bg3:"#182220",
    border:"#283a36",borderHi:"#3d5751",
    textPrimary:"#e3ece9",textSec:"#87a39b",textDim:"#4f6e66",
    push:"#e0633b",pull:"#4ea87f",legs:"#d99d38",run:"#8f73be",
    flex:"#d67087",rest:"#697c77",surf:"#3bb2b8",
    accent:"#c3dfc8",weight:"#d67087",
  },
  midnightOchre:{
    bg0:"#121214",bg1:"#191a1e",bg2:"#23252a",bg3:"#1d1e23",
    border:"#32353e",borderHi:"#484d5a",
    textPrimary:"#edeef2",textSec:"#8e93a3",textDim:"#545866",
    push:"#d65a31",pull:"#38a37f",legs:"#d4a373",run:"#9a8c7d",
    flex:"#c05c7e",rest:"#6c7280",surf:"#2a9d8f",
    accent:"#d4a373",weight:"#d65a31",
  },
  deepPacific:{
    bg0:"#091011",bg1:"#101a1c",bg2:"#18272a",bg3:"#132023",
    border:"#21383c",borderHi:"#315258",
    textPrimary:"#e4ecee",textSec:"#7b9a9e",textDim:"#466367",
    push:"#e07a5f",pull:"#52a382",legs:"#f2cc8f",run:"#8d81ac",
    flex:"#e27396",rest:"#5d7377",surf:"#3dccc7",
    accent:"#3dccc7",weight:"#e07a5f",
  },
  coastalMist:{
    bg0:"#f3f5f3",bg1:"#e5eae6",bg2:"#d5dfd7",bg3:"#fafbf9",
    border:"#bdc2bd",borderHi:"#9ba39b",
    textPrimary:"#1b2926",textSec:"#475955",textDim:"#81918d",
    push:"#ca532a",pull:"#2f855a",legs:"#c0832a",run:"#72579b",
    flex:"#be4f69",rest:"#697975",surf:"#1d878c",
    accent:"#2f855a",weight:"#ca532a",
  },
  architecturalParchment:{
    bg0:"#f4f1ea",bg1:"#e8e3d8",bg2:"#dbd4c4",bg3:"#faf8f4",
    border:"#c7beab",borderHi:"#a39883",
    textPrimary:"#22201d",textSec:"#5a544b",textDim:"#948a7b",
    push:"#c84b31",pull:"#3a7d44",legs:"#b87d2b",run:"#70527f",
    flex:"#b55364",rest:"#736b5e",surf:"#2a7b88",
    accent:"#b87d2b",weight:"#c84b31",
  },
  industrialMonolith:{
    bg0:"#eeefee",bg1:"#e0e2e0",bg2:"#d0d4d0",bg3:"#f8f9f8",
    border:"#b8bcb8",borderHi:"#929692",
    textPrimary:"#141614",textSec:"#424642",textDim:"#7e827e",
    push:"#bd4a22",pull:"#2b7d5a",legs:"#b38218",run:"#6b5094",
    flex:"#b04b68",rest:"#656a65",surf:"#1d7d91",
    accent:"#1d7d91",weight:"#bd4a22",
  },
};
const C = {...DEFAULT_THEME};
const THEME_OPTIONS=[
  {key:"cyberpunk",label:"Cyberpunk"},{key:"eclipse",label:"Eclipse"},
  {key:"default",label:"Ocean"},
  {key:"seaGlassObsidian",label:"Sea Glass"},{key:"midnightOchre",label:"Midnight"},
  {key:"deepPacific",label:"Pacific"},{key:"coastalMist",label:"Coastal"},
  {key:"architecturalParchment",label:"Parchment"},{key:"industrialMonolith",label:"Monolith"},
];
const applyTheme=k=>{
  const p=THEMES[k]||THEMES.default; Object.assign(C,p);
  Object.entries(GYM_PLANS).forEach(([n,plan])=>{
    if(n.includes("Push"))plan.color=C.push;
    else if(n.includes("Pull"))plan.color=C.pull;
    else if(n.includes("Legs"))plan.color=C.legs;
  });
  MOBILITY.ankle.color=C.accent; MOBILITY.hip.color=C.flex; MOBILITY.spine.color=C.legs;
};

// ── LOCAL STORAGE ─────────────────────────────────────────────────────────────
const LS={
  get:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
};

// ── DATE HELPERS ──────────────────────────────────────────────────────────────
const todayStr=()=>new Date().toISOString().split("T")[0];
const fmt=d=>new Date(d+"T12:00:00").toLocaleDateString("en-ZA",{day:"numeric",month:"short"});
const weekKey=(d=new Date())=>{const t=new Date(d);t.setDate(t.getDate()-((t.getDay()+6)%7));return t.toISOString().split("T")[0];};
const weekLabel=k=>{const s=new Date(k+"T12:00:00"),e=new Date(s);e.setDate(s.getDate()+6);return`${fmt(s.toISOString().split("T")[0])}–${fmt(e.toISOString().split("T")[0])}`;};

// ── GYM DATA ─────────────────────────────────────────────────────────────────
const GYM_PLANS={
  "Push Day":{color:C.push,muscles:"Chest · Shoulders · Triceps",exercises:[
    {name:"Incline Barbell Bench Press",sets:"1 warm-up + 4×10",weight:"Start ~45kg",note:"Control the eccentric (3s down)"},
    {name:"Flat Dumbbell Bench Press",sets:"3×10",weight:"20kg/hand",note:"Full ROM, pause at bottom"},
    {name:"Seated DB Shoulder Press",sets:"3×10",weight:"10–12kg",note:"Don't flare elbows too wide"},
    {name:"Lateral Raises",sets:"4×15",weight:"6–8kg",note:"Slow and controlled"},
    {name:"Cable Tricep Pushdown (rope)",sets:"3×12",weight:"24–28kg",note:"Flare hands at bottom"},
    {name:"Overhead DB Tricep Extension",sets:"3×12",weight:"12–16kg",note:"Great for tricep long head"},
  ]},
  "Push Day B":{color:C.push,muscles:"Chest · Shoulders · Triceps",exercises:[
    {name:"Smith Machine Bench Press",sets:"4×10",weight:"~50kg",note:"Use smith if bench is taken"},
    {name:"Incline Dumbbell Press",sets:"3×12",weight:"18–20kg/h",note:"30° incline"},
    {name:"Arnold Press",sets:"3×10",weight:"10–12kg",note:"Full shoulder activation"},
    {name:"Cable Lateral Raises",sets:"3×15",weight:"6–8kg",note:"Constant tension"},
    {name:"Tricep Pushdown (bar)",sets:"3×12",weight:"26–30kg",note:""},
    {name:"Dips",sets:"3×max",weight:"Bodyweight",note:"Lean forward for chest focus"},
  ]},
  "Pull Day":{color:C.pull,muscles:"Back · Biceps · Rear Delts",exercises:[
    {name:"Lat Pulldown",sets:"1 warm-up + 4×10",weight:"60→65kg",note:"Drive elbows down"},
    {name:"Bent Over Barbell Row",sets:"4×10",weight:"40–50kg",note:"Hinge at hips, neutral spine"},
    {name:"Seated Cable Row",sets:"3×12",weight:"40–50kg",note:"Mid-back thickness"},
    {name:"Face Pull (cable)",sets:"3×15",weight:"20–24kg",note:"External rotate at peak"},
    {name:"Weighted Back Extension",sets:"3×12",weight:"10–15kg",note:"Don't hyperextend"},
    {name:"Dumbbell Hammer Curls",sets:"3×12",weight:"10–12kg",note:""},
    {name:"EZ Bar / Barbell Curl",sets:"3×10",weight:"20–25kg",note:"Preacher replacement"},
  ]},
  "Pull Day B":{color:C.pull,muscles:"Back · Biceps · Rear Delts",exercises:[
    {name:"Wide Grip Lat Pulldown",sets:"4×10",weight:"55–65kg",note:"Stretch lats at top"},
    {name:"Single Arm DB Row",sets:"3×10 ea",weight:"20–24kg",note:"Full ROM, drive elbow back"},
    {name:"Cable Straight Arm Pulldown",sets:"3×15",weight:"light",note:"Lat isolation"},
    {name:"Face Pull",sets:"3×15",weight:"22–26kg",note:""},
    {name:"Incline Dumbbell Curl",sets:"3×12",weight:"10–12kg",note:"Stretches bicep long head"},
    {name:"Hammer Curls",sets:"3×12",weight:"10–14kg",note:""},
    {name:"Back Extension",sets:"3×12",weight:"10kg",note:""},
  ]},
  "Legs Day":{color:C.legs,muscles:"Quads · Hamstrings · Glutes · Calves",exercises:[
    {name:"Smith Machine Squat",sets:"1 warm-up + 4×10",weight:"40–50kg",note:"Feet fwd, depth to parallel"},
    {name:"Goblet Squat / Leg Press",sets:"3×12",weight:"16–20kg DB",note:"Build form first"},
    {name:"Leg Extension Machine",sets:"3×15",weight:"Light–mod",note:"Pause at peak"},
    {name:"Standing Leg Curl Machine",sets:"3×12 ea",weight:"Light–mod",note:"Control eccentric"},
    {name:"Romanian Deadlift (DB)",sets:"3×10",weight:"20–24kg/h",note:"Hinge, stretch hammies"},
    {name:"Standing Calf Raise",sets:"4×15",weight:"BW or loaded",note:"Full ROM, pause top + bottom"},
  ]},
};

// ── MOBILITY DATA ─────────────────────────────────────────────────────────────
const MOBILITY={
  ankle:{color:C.accent,icon:"🦶",exercises:[
    {name:"Ankle Circles",reps:"20 each direction, each foot",note:"Seated or lying. Slow, full ROM."},
    {name:"Alphabet Tracing",reps:"A–Z once per foot",note:"Draw the alphabet with your big toe in the air."},
    {name:"Calf Raises (slow)",reps:"3×15 + hold at top",note:"Use a step for extra ROM. Pause 2s at top."},
    {name:"Single-Leg Balance",reps:"3×30s each foot",note:"Progress: eyes closed → on a folded towel."},
    {name:"Banded Ankle Eversion",reps:"3×15 each",note:"Loop band around forefoot, resist outward. Builds peroneal strength."},
    {name:"Heel-Toe Walk",reps:"10m on heels, 10m on toes",note:"Activates tibialis anterior and calves."},
  ]},
  hip:{color:C.flex,icon:"🍑",exercises:[
    {name:"90/90 Hip Stretch",reps:"60s each side",note:"Sit on floor, both knees at 90°. Lean into front hip."},
    {name:"Hip Flexor Lunge Stretch",reps:"60s each side",note:"Low lunge, push hips fwd. Tuck pelvis under."},
    {name:"Pigeon Pose",reps:"60–90s each side",note:"On floor or modified with hand support."},
    {name:"Hip Circles (standing)",reps:"10 each direction",note:"Hands on hips, big slow circles."},
    {name:"Lateral Band Walk",reps:"2×15 each way",note:"Glute med activation — critical for surf stability."},
    {name:"Glute Bridge",reps:"3×15",note:"Squeeze at top, 2s hold. Progress to single-leg."},
  ]},
  spine:{color:C.legs,icon:"🦴",exercises:[
    {name:"Cat-Cow",reps:"10 slow cycles",note:"On all fours. Breathe in on cow, out on cat."},
    {name:"Thoracic Extension (foam roller)",reps:"10 reps, hold 5s",note:"Mid-back on roller, arms crossed, extend over it."},
    {name:"Thread the Needle",reps:"10 each side",note:"All fours — thread one arm under body."},
    {name:"Seated Thoracic Rotation",reps:"10 each direction",note:"Sit cross-legged, rotate upper body."},
    {name:"Doorway Chest Stretch",reps:"2×30s each arm",note:"Opens anterior chain — crucial after paddling."},
    {name:"Child's Pose",reps:"60s",note:"Arms extended, breathe into lower back."},
  ]},
};

// ── LIFT TARGETS ──────────────────────────────────────────────────────────────
const LIFT_TARGETS={
  "Incline Barbell Bench Press":[{ph:"Ph1",kg:45},{ph:"Ph2",kg:50},{ph:"Ph3",kg:60},{ph:"Ph4",kg:70}],
  "Flat Dumbbell Bench Press":  [{ph:"Ph1",kg:18},{ph:"Ph2",kg:20},{ph:"Ph3",kg:24},{ph:"Ph4",kg:28}],
  "Seated DB Shoulder Press":   [{ph:"Ph1",kg:8}, {ph:"Ph2",kg:10},{ph:"Ph3",kg:14},{ph:"Ph4",kg:18}],
  "Lateral Raises":             [{ph:"Ph1",kg:6}, {ph:"Ph2",kg:8}, {ph:"Ph3",kg:10},{ph:"Ph4",kg:12}],
  "Cable Tricep Pushdown (rope)":[{ph:"Ph1",kg:22},{ph:"Ph2",kg:26},{ph:"Ph3",kg:30},{ph:"Ph4",kg:34}],
  "Overhead DB Tricep Extension":[{ph:"Ph1",kg:12},{ph:"Ph2",kg:14},{ph:"Ph3",kg:18},{ph:"Ph4",kg:22}],
  "Smith Machine Bench Press":  [{ph:"Ph1",kg:45},{ph:"Ph2",kg:50},{ph:"Ph3",kg:60},{ph:"Ph4",kg:70}],
  "Incline Dumbbell Press":     [{ph:"Ph1",kg:16},{ph:"Ph2",kg:20},{ph:"Ph3",kg:24},{ph:"Ph4",kg:28}],
  "Arnold Press":               [{ph:"Ph1",kg:8}, {ph:"Ph2",kg:10},{ph:"Ph3",kg:14},{ph:"Ph4",kg:18}],
  "Cable Lateral Raises":       [{ph:"Ph1",kg:6}, {ph:"Ph2",kg:8}, {ph:"Ph3",kg:10},{ph:"Ph4",kg:12}],
  "Tricep Pushdown (bar)":      [{ph:"Ph1",kg:24},{ph:"Ph2",kg:28},{ph:"Ph3",kg:32},{ph:"Ph4",kg:36}],
  "Dips":                       [{ph:"Ph1",kg:0}, {ph:"Ph2",kg:0}, {ph:"Ph3",kg:5}, {ph:"Ph4",kg:10}],
  "Lat Pulldown":               [{ph:"Ph1",kg:55},{ph:"Ph2",kg:60},{ph:"Ph3",kg:72},{ph:"Ph4",kg:82}],
  "Bent Over Barbell Row":      [{ph:"Ph1",kg:35},{ph:"Ph2",kg:45},{ph:"Ph3",kg:55},{ph:"Ph4",kg:65}],
  "Seated Cable Row":           [{ph:"Ph1",kg:35},{ph:"Ph2",kg:45},{ph:"Ph3",kg:55},{ph:"Ph4",kg:65}],
  "Face Pull (cable)":          [{ph:"Ph1",kg:18},{ph:"Ph2",kg:22},{ph:"Ph3",kg:26},{ph:"Ph4",kg:30}],
  "Weighted Back Extension":    [{ph:"Ph1",kg:8}, {ph:"Ph2",kg:12},{ph:"Ph3",kg:16},{ph:"Ph4",kg:20}],
  "Dumbbell Hammer Curls":      [{ph:"Ph1",kg:10},{ph:"Ph2",kg:12},{ph:"Ph3",kg:14},{ph:"Ph4",kg:16}],
  "EZ Bar / Barbell Curl":      [{ph:"Ph1",kg:18},{ph:"Ph2",kg:22},{ph:"Ph3",kg:27},{ph:"Ph4",kg:32}],
  "Wide Grip Lat Pulldown":     [{ph:"Ph1",kg:50},{ph:"Ph2",kg:58},{ph:"Ph3",kg:68},{ph:"Ph4",kg:78}],
  "Single Arm DB Row":          [{ph:"Ph1",kg:18},{ph:"Ph2",kg:22},{ph:"Ph3",kg:26},{ph:"Ph4",kg:30}],
  "Face Pull":                  [{ph:"Ph1",kg:18},{ph:"Ph2",kg:22},{ph:"Ph3",kg:26},{ph:"Ph4",kg:30}],
  "Incline Dumbbell Curl":      [{ph:"Ph1",kg:8}, {ph:"Ph2",kg:10},{ph:"Ph3",kg:12},{ph:"Ph4",kg:14}],
  "Hammer Curls":               [{ph:"Ph1",kg:10},{ph:"Ph2",kg:12},{ph:"Ph3",kg:14},{ph:"Ph4",kg:16}],
  "Back Extension":             [{ph:"Ph1",kg:0}, {ph:"Ph2",kg:8}, {ph:"Ph3",kg:12},{ph:"Ph4",kg:16}],
  "Cable Straight Arm Pulldown":[{ph:"Ph1",kg:18},{ph:"Ph2",kg:24},{ph:"Ph3",kg:30},{ph:"Ph4",kg:36}],
  "Smith Machine Squat":        [{ph:"Ph1",kg:40},{ph:"Ph2",kg:55},{ph:"Ph3",kg:70},{ph:"Ph4",kg:85}],
  "Goblet Squat / Leg Press":   [{ph:"Ph1",kg:16},{ph:"Ph2",kg:20},{ph:"Ph3",kg:26},{ph:"Ph4",kg:32}],
  "Leg Extension Machine":      [{ph:"Ph1",kg:20},{ph:"Ph2",kg:30},{ph:"Ph3",kg:40},{ph:"Ph4",kg:50}],
  "Standing Leg Curl Machine":  [{ph:"Ph1",kg:15},{ph:"Ph2",kg:22},{ph:"Ph3",kg:30},{ph:"Ph4",kg:38}],
  "Romanian Deadlift (DB)":     [{ph:"Ph1",kg:18},{ph:"Ph2",kg:22},{ph:"Ph3",kg:28},{ph:"Ph4",kg:34}],
  "Standing Calf Raise":        [{ph:"Ph1",kg:0}, {ph:"Ph2",kg:20},{ph:"Ph3",kg:40},{ph:"Ph4",kg:60}],
};

// Init theme
const initialThemeKey=LS.get("theme","cyberpunk");
applyTheme(initialThemeKey);

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
const Card=({children,style={}})=>(
  <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 15px",transition:"background-color 140ms ease,border-color 140ms ease",...style}}>{children}</div>
);
const SecLabel=({children,style={}})=>(
  <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.14em",color:C.textDim,marginBottom:9,fontWeight:600,...style}}>{children}</div>
);
const Tag=({label,color})=>(
  <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,fontWeight:700,letterSpacing:"0.05em",background:color+"22",color}}>{label}</span>
);
const Pill=({children,active,color,onClick})=>(
  <button onClick={onClick} style={{background:active?C.bg2:"transparent",border:`1px solid ${active?color+"66":C.border}`,borderRadius:8,padding:"6px 12px",cursor:"pointer",color:active?color:C.textSec,fontSize:12,fontWeight:500}}>{children}</button>
);

// ── BAR CHART ─────────────────────────────────────────────────────────────────
function BarChart({data,color,maxVal}){
  if(!data||!data.length)return null;
  const W=300,H=80,barW=Math.max(8,W/data.length-4);
  const mx=maxVal||Math.max(...data.map(d=>d.y),1);
  return(
    <svg width="100%" viewBox={`0 0 ${W} ${H+20}`} style={{overflow:"visible"}}>
      {data.map((d,i)=>{
        const bh=Math.max(2,(d.y/mx)*H),x=(i/data.length)*W+(W/data.length-barW)/2;
        return(<g key={i}>
          <rect x={x} y={H-bh} width={barW} height={bh} rx="3" fill={color} opacity="0.8"/>
          <text x={x+barW/2} y={H+14} textAnchor="middle" fontSize="8" fill={C.textDim}>{d.label}</text>
          {d.y>0&&<text x={x+barW/2} y={H-bh-4} textAnchor="middle" fontSize="9" fill={color}>{d.y}</text>}
        </g>);
      })}
    </svg>
  );
}

// ── WEIGHT CHART ──────────────────────────────────────────────────────────────
function WeightChart({entries,target,startWeight}){
  if(!entries||entries.length<2)return(
    <div style={{textAlign:"center",padding:"20px 0",color:C.textDim,fontSize:12}}>Log at least 2 entries to see your trend chart.</div>
  );
  const W=320,H=110,PAD={t:10,r:18,b:28,l:36};
  const iW=W-PAD.l-PAD.r,iH=H-PAD.t-PAD.b;
  const vals=entries.map(e=>e.weight);
  const allV=[...vals,target,startWeight];
  const minV=Math.min(...allV)-2,maxV=Math.max(...allV)+2;
  const px=i=>PAD.l+(i/(entries.length-1))*iW;
  const py=v=>PAD.t+iH-((v-minV)/(maxV-minV))*iH;
  const pts=entries.map((e,i)=>`${px(i)},${py(e.weight)}`).join(" ");
  const n=entries.length;
  const labelIdxs=n<=5?entries.map((_,i)=>i):[0,Math.round(n/4),Math.round(n/2),Math.round(3*n/4),n-1];
  const uniq=[...new Set(labelIdxs)];
  const uid="wc"+Math.abs(Math.random()*1e6|0);
  return(
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible",display:"block"}}>
      <defs><linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.weight} stopOpacity="0.35"/>
        <stop offset="100%" stopColor={C.weight} stopOpacity="0.02"/>
      </linearGradient></defs>
      {[0,25,50,75,100].map(p=>{const v=minV+(maxV-minV)*p/100;return<line key={p} x1={PAD.l} y1={py(v)} x2={W-PAD.r} y2={py(v)} stroke={C.border} strokeWidth="1" opacity="0.6"/>;})}
      {[minV+1.5,target,maxV-1.5].filter((v,i,a)=>a.indexOf(v)===i).map(v=>(
        <text key={v} x={PAD.l-4} y={py(v)+4} textAnchor="end" fontSize="8" fill={C.textDim}>{Math.round(v*10)/10}</text>
      ))}
      <line x1={PAD.l} y1={py(startWeight)} x2={W-PAD.r} y2={py(startWeight)} stroke={C.textDim} strokeWidth="1" strokeDasharray="4 4" opacity="0.35"/>
      <line x1={PAD.l} y1={py(target)} x2={W-PAD.r} y2={py(target)} stroke={C.pull} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.75"/>
      <text x={W-PAD.r+2} y={py(target)+4} fontSize="8" fill={C.pull} opacity="0.9">Goal</text>
      <polygon points={`${px(0)},${py(entries[0].weight)} ${pts} ${px(n-1)},${H-PAD.b} ${px(0)},${H-PAD.b}`} fill={`url(#${uid})`}/>
      <polyline points={pts} fill="none" stroke={C.weight} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {entries.map((e,i)=>{
        const x=px(i),y=py(e.weight),showL=uniq.includes(i);
        const d=new Date(e.date+"T12:00:00"),lbl=`${d.getDate()}/${d.getMonth()+1}`;
        return(<g key={i}>
          <circle cx={x} cy={y} r={showL?5:3} fill={C.weight} stroke={C.bg0} strokeWidth="2"/>
          {showL&&<><line x1={x} y1={y+6} x2={x} y2={H-PAD.b+2} stroke={C.textDim} strokeWidth="1" opacity="0.25"/>
            <text x={x} y={H-PAD.b+13} textAnchor={i===0?"start":i===n-1?"end":"middle"} fontSize="8" fill={C.textDim}>{lbl}</text></>}
        </g>);
      })}
    </svg>
  );
}

// ── MINI STRENGTH CHART ───────────────────────────────────────────────────────
function MiniStrengthChart({data,targets,color}){
  if(!data||data.length<2)return null;
  const W=260,H=55;
  const vals=data.map(d=>d.weight),tVals=(targets||[]).map(t=>t.kg);
  const allV=[...vals,...tVals],mn=Math.min(...allV)-2,mx=Math.max(...allV)+2;
  const px=i=>(i/(data.length-1))*W,py=v=>H-((v-mn)/(mx-mn))*H;
  const pts=data.map((d,i)=>`${px(i)},${py(d.weight)}`).join(" ");
  const uid="sc"+Math.abs(Math.random()*1e6|0);
  return(
    <svg width="100%" viewBox={`0 0 ${W} ${H+18}`} style={{overflow:"visible",marginTop:8,display:"block"}}>
      <defs><linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
        <stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      {(targets||[]).map((t,i)=>{const tc=[C.accent,C.pull,C.legs,C.flex][i];return<line key={i} x1="0" y1={py(t.kg)} x2={W} y2={py(t.kg)} stroke={tc} strokeWidth="1" strokeDasharray="5 4" opacity="0.45"/>;} )}
      <polygon points={`0,${py(data[0].weight)} ${pts} ${W},${py(data[data.length-1].weight)} ${W},${H} 0,${H}`} fill={`url(#${uid})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((d,i)=>{
        const showL=[0,data.length-1].includes(i),x=px(i),y=py(d.weight);
        const lbl=`${new Date(d.date+"T12:00:00").getDate()}/${new Date(d.date+"T12:00:00").getMonth()+1}`;
        return(<g key={i}>
          <circle cx={x} cy={y} r={showL?4.5:3} fill={color} stroke={C.bg0} strokeWidth="2"/>
          {showL&&<text x={x} y={H+13} textAnchor={i===0?"start":"end"} fontSize="8" fill={C.textDim}>{lbl}</text>}
        </g>);
      })}
      <text x={W} y={py(vals[vals.length-1])-6} textAnchor="end" fontSize="9" fontWeight="700" fill={color}>{vals[vals.length-1]}kg</text>
    </svg>
  );
}

// ── SCHEDULE TAB ──────────────────────────────────────────────────────────────
const DEFAULT_CLASSES=[
  {id:1,day:"Monday",   start:"10:00",end:"13:00",label:"Classes"},
  {id:2,day:"Tuesday",  start:"09:30",end:"15:00",label:"Classes"},
  {id:3,day:"Wednesday",start:"08:00",end:"09:00",label:"Classes"},
];
const DEFAULT_SLEEP={
  Monday:{wake:"08:00",bed:"00:00"},Tuesday:{wake:"08:00",bed:"00:00"},
  Wednesday:{wake:"08:00",bed:"00:00"},Thursday:{wake:"08:00",bed:"00:00"},
  Friday:{wake:"08:00",bed:"00:00"},Saturday:{wake:"08:30",bed:"00:00"},
  Sunday:{wake:"08:30",bed:"00:00"},
};

// ── NEW SCHEDULE: Gym Mon/Wed/Fri · Run Tue/Thu/Sat/Sun ──────────────────────
const DAY_SESSIONS={
  Monday:[
    {icon:"🦵",label:"Morning Mobility",time:"After wake"},
    {icon:"🏋️",label:"Push Day (Gym)",time:"Morning — before class"},
    {icon:"🎓",label:"Classes 10:00–13:00",time:"Campus"},
  ],
  Tuesday:[
    {icon:"🦵",label:"Morning Mobility",time:"After wake"},
    {icon:"🎓",label:"Classes 09:30–15:00",time:"Campus"},
    {icon:"🏃",label:"Run — Garmin Coach",time:"After campus"},
  ],
  Wednesday:[
    {icon:"🦵",label:"Morning Mobility",time:"After wake"},
    {icon:"🎓",label:"Classes 08:00–09:00",time:"Campus"},
    {icon:"🏋️",label:"Pull Day (Gym)",time:"After class"},
    {icon:"🌊",label:"Surf (if conditions good)",time:"Afternoon"},
  ],
  Thursday:[
    {icon:"🦵",label:"Morning Mobility",time:"After wake"},
    {icon:"🏃",label:"Run — Garmin Coach",time:"Morning"},
  ],
  Friday:[
    {icon:"🦵",label:"Morning Mobility",time:"After wake"},
    {icon:"🏋️",label:"Legs Day (Gym)",time:"Morning"},
    {icon:"🌊",label:"Surf (if conditions good)",time:"Any time"},
  ],
  Saturday:[
    {icon:"🦵",label:"Morning Mobility",time:"After wake"},
    {icon:"🏃",label:"Run — Garmin Coach",time:"Morning"},
    {icon:"🌊",label:"Surf (if conditions good)",time:"Any time"},
  ],
  Sunday:[
    {icon:"🦵",label:"Morning Mobility",time:"After wake"},
    {icon:"🏃",label:"Run — Garmin Coach",time:"Morning"},
    {icon:"🌊",label:"Surf (if conditions good)",time:"Any time"},
  ],
};
const DAYS_ORDER=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

// Day summary tags for the pill row
const DAY_META={
  Monday:{tag:"PUSH",color:"#ff6b35"},
  Tuesday:{tag:"RUN",color:"#c084fc"},
  Wednesday:{tag:"PULL",color:"#39d353"},
  Thursday:{tag:"RUN",color:"#c084fc"},
  Friday:{tag:"LEGS",color:"#f5c518"},
  Saturday:{tag:"RUN",color:"#c084fc"},
  Sunday:{tag:"RUN",color:"#c084fc"},
};

function ScheduleTab(){
  const [activeDay,setActiveDay]=useState("Monday");
  const [classes,setClasses]=useState(()=>LS.get("classes",DEFAULT_CLASSES));
  const [sleep,setSleep]=useState(()=>LS.get("sleep_times",DEFAULT_SLEEP));
  const [editingClass,setEditingClass]=useState(null);
  const [newClass,setNewClass]=useState({day:"Monday",start:"",end:"",label:"Classes"});
  const [showClassForm,setShowClassForm]=useState(false);
  const [editingSleep,setEditingSleep]=useState(false);
  const [ticked,setTicked]=useState(()=>LS.get("ticked_sessions",{}));
  const daySessions=DAY_SESSIONS[activeDay]||[];
  const dayClasses=classes.filter(c=>c.day===activeDay);
  const sl=sleep[activeDay]||{wake:"08:00",bed:"00:00"};
  const meta=DAY_META[activeDay];
  const tick=key=>{const u={...ticked,[key]:!ticked[key]};setTicked(u);LS.set("ticked_sessions",u);};
  const saveClass=()=>{
    if(editingClass){const u=classes.map(c=>c.id===editingClass.id?editingClass:c);setClasses(u);LS.set("classes",u);setEditingClass(null);}
    else{const u=[...classes,{...newClass,id:Date.now()}];setClasses(u);LS.set("classes",u);setShowClassForm(false);setNewClass({day:"Monday",start:"",end:"",label:"Classes"});}
  };
  const delClass=id=>{const u=classes.filter(c=>c.id!==id);setClasses(u);LS.set("classes",u);};
  const updSleep=(day,f,v)=>{const u={...sleep,[day]:{...sleep[day],[f]:v}};setSleep(u);LS.set("sleep_times",u);};
  const inp=st=>({width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,color:C.textPrimary,padding:"7px 8px",fontSize:12,boxSizing:"border-box",...st});
  return(
    <div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {DAYS_ORDER.map(d=>{
          const m=DAY_META[d];
          return(
            <button key={d} onClick={()=>setActiveDay(d)} style={{background:activeDay===d?C.bg2:"transparent",border:`1px solid ${activeDay===d?C.borderHi:C.border}`,borderRadius:8,padding:"7px 11px",cursor:"pointer",color:activeDay===d?C.textPrimary:C.textSec,fontSize:12,fontWeight:500}}>
              {d.slice(0,3)} <span style={{fontSize:9,padding:"2px 5px",borderRadius:3,fontWeight:700,background:m.color+"22",color:m.color,marginLeft:3}}>{m.tag}</span>
            </button>
          );
        })}
      </div>
      <Card style={{marginBottom:12,background:C.bg2,borderLeft:`3px solid ${meta.color}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:C.textPrimary}}>{activeDay}</div>
            <div style={{marginTop:2}}><Tag label={meta.tag} color={meta.color}/></div>
          </div>
          <button onClick={()=>setEditingSleep(!editingSleep)} style={{fontSize:11,background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",color:C.textSec,cursor:"pointer"}}>{editingSleep?"Done":"Edit Sleep"}</button>
        </div>
        {editingSleep?(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {["wake","bed"].map(f=>(
              <div key={f}><div style={{fontSize:10,color:C.textDim,marginBottom:3}}>{f==="wake"?"☀️ Wake":"🌙 Bed"}</div>
                <input type="time" value={sleep[activeDay]?.[f]||""} onChange={e=>updSleep(activeDay,f,e.target.value)} style={inp()}/></div>
            ))}
          </div>
        ):(
          <div style={{display:"flex",gap:20}}>
            <span style={{fontSize:13,color:C.textSec}}>☀️ Wake <b style={{color:C.textPrimary}}>{sl.wake}</b></span>
            <span style={{fontSize:13,color:C.textSec}}>🌙 Bed <b style={{color:C.textPrimary}}>{sl.bed}</b></span>
          </div>
        )}
      </Card>
      <SecLabel>Sessions</SecLabel>
      <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:14}}>
        {daySessions.map((s,i)=>{
          const key=`${activeDay}_sess_${i}`,done=ticked[key];
          return(
            <Card key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",opacity:done?0.55:1,borderColor:done?C.pull+"55":C.border}}>
              <span style={{fontSize:18}}>{s.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:C.textDim}}>{s.time}</div>
                <div style={{fontSize:13,fontWeight:500,color:done?C.textSec:C.textPrimary,textDecoration:done?"line-through":"none"}}>{s.label}</div>
              </div>
              <button onClick={()=>tick(key)} style={{width:26,height:26,borderRadius:6,cursor:"pointer",background:done?C.pull+"33":"transparent",border:`2px solid ${done?C.pull:C.border}`,color:done?C.pull:C.textDim,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{done?"✓":""}</button>
            </Card>
          );
        })}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <SecLabel style={{margin:0}}>Classes</SecLabel>
        <button onClick={()=>setShowClassForm(!showClassForm)} style={{fontSize:11,background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",color:C.accent,cursor:"pointer"}}>+ Add Class</button>
      </div>
      {(showClassForm||editingClass)&&(
        <Card style={{marginBottom:12}}>
          <SecLabel>{editingClass?"Edit Class":"New Class"}</SecLabel>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div><div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Day</div>
              <select value={editingClass?editingClass.day:newClass.day} onChange={e=>editingClass?setEditingClass({...editingClass,day:e.target.value}):setNewClass({...newClass,day:e.target.value})} style={inp()}>
                {DAYS_ORDER.map(d=><option key={d}>{d}</option>)}
              </select></div>
            <div><div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Label</div>
              <input value={editingClass?editingClass.label:newClass.label} onChange={e=>editingClass?setEditingClass({...editingClass,label:e.target.value}):setNewClass({...newClass,label:e.target.value})} style={inp()}/></div>
            <div><div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Start</div>
              <input type="time" value={editingClass?editingClass.start:newClass.start} onChange={e=>editingClass?setEditingClass({...editingClass,start:e.target.value}):setNewClass({...newClass,start:e.target.value})} style={inp()}/></div>
            <div><div style={{fontSize:10,color:C.textDim,marginBottom:3}}>End</div>
              <input type="time" value={editingClass?editingClass.end:newClass.end} onChange={e=>editingClass?setEditingClass({...editingClass,end:e.target.value}):setNewClass({...newClass,end:e.target.value})} style={inp()}/></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={saveClass} style={{flex:1,padding:"9px",borderRadius:7,border:"none",background:C.accent,color:C.bg0,fontSize:13,fontWeight:700,cursor:"pointer"}}>Save</button>
            <button onClick={()=>{setEditingClass(null);setShowClassForm(false);}} style={{padding:"9px 16px",borderRadius:7,border:`1px solid ${C.border}`,background:"none",color:C.textSec,cursor:"pointer"}}>Cancel</button>
          </div>
        </Card>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:14}}>
        {dayClasses.length===0&&<div style={{fontSize:13,color:C.textDim,padding:"10px 0"}}>No classes on {activeDay}.</div>}
        {dayClasses.map(c=>{
          const key=`class_${c.id}`,done=ticked[key];
          return(
            <Card key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",opacity:done?0.55:1,borderColor:done?C.pull+"55":C.border}}>
              <span style={{fontSize:18}}>🎓</span>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:C.textDim}}>{c.start}–{c.end}</div>
                <div style={{fontSize:13,fontWeight:500,color:done?C.textSec:C.textPrimary,textDecoration:done?"line-through":"none"}}>{c.label}</div>
              </div>
              <button onClick={()=>setEditingClass(c)} style={{background:"none",border:"none",color:C.textDim,fontSize:12,cursor:"pointer"}}>✎</button>
              <button onClick={()=>delClass(c.id)} style={{background:"none",border:"none",color:C.textDim,fontSize:16,cursor:"pointer"}}>×</button>
              <button onClick={()=>tick(key)} style={{width:26,height:26,borderRadius:6,cursor:"pointer",background:done?C.pull+"33":"transparent",border:`2px solid ${done?C.pull:C.border}`,color:done?C.pull:C.textDim,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{done?"✓":""}</button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── MOBILITY TAB ──────────────────────────────────────────────────────────────
function MobilityTab(){
  const [active,setActive]=useState("ankle");
  const [ticked,setTicked]=useState(()=>LS.get("mobility_ticked",{}));
  const area=MOBILITY[active];
  const tick=key=>{const u={...ticked,[key]:!ticked[key]};setTicked(u);LS.set("mobility_ticked",u);};
  const reset=()=>{const u={...ticked};area.exercises.forEach((_,i)=>delete u[`${active}_${i}`]);setTicked(u);LS.set("mobility_ticked",u);};
  const done=area.exercises.filter((_,i)=>ticked[`${active}_${i}`]).length;
  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[{key:"ankle",label:"🦶 Ankle",color:C.accent},{key:"hip",label:"🍑 Hip",color:C.flex},{key:"spine",label:"🦴 Spine",color:C.legs}].map(a=>(
          <Pill key={a.key} active={active===a.key} color={a.color} onClick={()=>setActive(a.key)}>{a.label}</Pill>
        ))}
      </div>
      <Card style={{marginBottom:14,background:C.bg2,borderLeft:`3px solid ${area.color}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:C.textPrimary}}>{area.icon} {active.charAt(0).toUpperCase()+active.slice(1)} Mobility</div>
            <div style={{fontSize:12,color:C.textSec,marginTop:2}}>{done}/{area.exercises.length} done today</div>
          </div>
          <button onClick={reset} style={{fontSize:11,background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",color:C.textDim,cursor:"pointer"}}>Reset</button>
        </div>
        <div style={{background:C.border,borderRadius:99,height:4,marginTop:10,overflow:"hidden"}}>
          <div style={{width:`${(done/area.exercises.length)*100}%`,height:"100%",background:area.color,borderRadius:99,transition:"width 0.3s"}}/>
        </div>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {area.exercises.map((ex,i)=>{
          const key=`${active}_${i}`,isDone=ticked[key];
          return(
            <Card key={i} style={{opacity:isDone?0.5:1,borderColor:isDone?area.color+"44":C.border}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <button onClick={()=>tick(key)} style={{width:28,height:28,borderRadius:7,cursor:"pointer",flexShrink:0,background:isDone?area.color+"33":"transparent",border:`2px solid ${isDone?area.color:C.border}`,color:isDone?area.color:C.textDim,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>{isDone?"✓":""}</button>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:4}}>
                    <div style={{fontSize:13,fontWeight:600,color:isDone?C.textSec:C.textPrimary,textDecoration:isDone?"line-through":"none"}}>{ex.name}</div>
                    <Tag label={ex.reps} color={area.color}/>
                  </div>
                  <div style={{fontSize:12,color:C.textDim,lineHeight:1.5}}>{ex.note}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── GYM TAB ───────────────────────────────────────────────────────────────────
function GymTab(){
  const [active,setActive]=useState("Push Day");
  const [liftLogs,setLiftLogs]=useState(()=>LS.get("lift_logs",{}));
  const [logEx,setLogEx]=useState(null);
  const [form,setForm]=useState({date:todayStr(),weight:"",sets:"3",reps:"10"});
  const [flash,setFlash]=useState(false);
  const plan=GYM_PLANS[active];
  const getLatest=name=>{const e=liftLogs[name]||[];if(!e.length)return null;return[...e].sort((a,b)=>b.date.localeCompare(a.date))[0];};
  const openLog=name=>{const l=getLatest(name);setLogEx(name);setFlash(false);setForm({date:todayStr(),weight:l?.weight?String(l.weight):"",sets:l?.sets?String(l.sets):"3",reps:l?.reps?String(l.reps):"10"});};
  const save=()=>{
    if(!form.weight||!logEx)return;
    const entry={date:form.date,weight:parseFloat(form.weight),sets:form.sets||"3",reps:form.reps||"10",id:Date.now()};
    const u={...liftLogs,[logEx]:[...(liftLogs[logEx]||[]),entry]};
    setLiftLogs(u);LS.set("lift_logs",u);setFlash(true);setTimeout(()=>setFlash(false),1800);
  };
  const delEntry=(n,id)=>{const u={...liftLogs,[n]:(liftLogs[n]||[]).filter(e=>e.id!==id)};setLiftLogs(u);LS.set("lift_logs",u);};
  const inp=extra=>({width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:9,color:C.textPrimary,textAlign:"center",boxSizing:"border-box",outline:"none",...extra});
  return(
    <div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {Object.keys(GYM_PLANS).map(p=><Pill key={p} active={active===p} color={plan.color} onClick={()=>{setActive(p);setLogEx(null);setFlash(false);}}>{p}</Pill>)}
      </div>
      <Card style={{marginBottom:14,background:C.bg2,borderLeft:`3px solid ${plan.color}`}}>
        <div style={{fontSize:16,fontWeight:700,color:C.textPrimary}}>{active}</div>
        <div style={{fontSize:12,color:C.textSec,marginTop:2}}>{plan.muscles}</div>
      </Card>
      {logEx&&(
        <Card style={{marginBottom:14,border:`1px solid ${plan.color}66`,background:C.bg2}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:13,fontWeight:700,color:plan.color,flex:1,paddingRight:8}}>{logEx}</div>
            <button onClick={()=>{setLogEx(null);setFlash(false);}} style={{fontSize:11,background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",color:C.textSec,cursor:"pointer"}}>Done</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
            {[{l:"Weight (kg)",f:"weight",big:true,p:"e.g. 50"},{l:"Sets",f:"sets",big:false,p:"3"},{l:"Reps",f:"reps",big:false,p:"10"}].map(x=>(
              <div key={x.f}>
                <div style={{fontSize:10,color:C.textDim,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>{x.l}</div>
                <input type="number" value={form[x.f]} placeholder={x.p} onChange={e=>setForm({...form,[x.f]:e.target.value})}
                  style={inp({border:`1px solid ${x.big?plan.color+"66":C.border}`,color:x.big?plan.color:C.textPrimary,padding:x.big?"12px 8px":"10px 8px",fontSize:x.big?22:16,fontWeight:x.big?700:500})}/>
              </div>
            ))}
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,color:C.textDim,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>Date</div>
            <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}
              style={{background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,color:C.textPrimary,padding:"7px 10px",fontSize:12,width:"100%",boxSizing:"border-box"}}/>
          </div>
          <button onClick={save} style={{width:"100%",padding:"13px",borderRadius:9,border:"none",cursor:"pointer",background:flash?C.pull:plan.color,color:C.bg0,fontSize:15,fontWeight:700,transition:"background 0.2s"}}>
            {flash?"✓ Saved!":"Save Set"}
          </button>
          {(liftLogs[logEx]||[]).filter(e=>e.date===form.date).length>0&&(
            <div style={{marginTop:12,borderTop:`1px solid ${C.border}`,paddingTop:10}}>
              <div style={{fontSize:10,color:C.textDim,marginBottom:7,textTransform:"uppercase",letterSpacing:"0.08em"}}>Logged today</div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {(liftLogs[logEx]||[]).filter(e=>e.date===form.date).map(e=>(
                  <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:C.bg3,borderRadius:7,padding:"7px 10px"}}>
                    <span style={{fontSize:13,fontWeight:700,color:plan.color}}>{e.weight}kg</span>
                    <span style={{fontSize:12,color:C.textSec}}>{e.sets||"?"}×{e.reps||"?"} reps</span>
                    <button onClick={()=>delEntry(logEx,e.id)} style={{background:"none",border:"none",color:C.textDim,fontSize:15,cursor:"pointer",padding:"0 4px"}}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {plan.exercises.map((ex,i)=>{
          const latest=getLatest(ex.name),targets=LIFT_TARGETS[ex.name]||[];
          const next=targets.find(t=>!latest||t.kg>latest.weight),isActive=logEx===ex.name;
          return(
            <Card key={i} style={{borderColor:isActive?plan.color+"55":C.border}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:6}}>
                <div style={{fontSize:13,fontWeight:600,color:C.textPrimary}}>
                  <span style={{color:plan.color,fontSize:11,marginRight:7,fontWeight:700}}>{String(i+1).padStart(2,"0")}</span>{ex.name}
                </div>
                <Tag label={ex.sets} color={plan.color}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:6}}>
                <div><div style={{fontSize:10,color:C.textDim}}>Plan target</div><div style={{fontSize:12,color:C.textSec,marginTop:1}}>{ex.weight}</div></div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:C.textDim}}>Last logged</div>
                  {latest?<div style={{fontSize:13,fontWeight:700,color:plan.color,marginTop:1}}>{latest.weight}kg <span style={{fontSize:10,color:C.textDim,fontWeight:400}}>{latest.sets||"?"}×{latest.reps||"?"}</span></div>
                    :<div style={{fontSize:12,color:C.textDim,marginTop:1}}>—</div>}
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:10,color:C.textDim}}>Next target</div>
                  {next?<div style={{fontSize:12,fontWeight:700,color:C.legs,marginTop:1}}>{next.kg}kg <Tag label={next.ph} color={C.legs}/></div>
                    :<div style={{fontSize:12,color:C.pull,marginTop:1}}>🏆 All done</div>}
                </div>
              </div>
              {ex.note&&<div style={{fontSize:11,color:C.textDim,marginBottom:8,fontStyle:"italic"}}>💡 {ex.note}</div>}
              <button onClick={()=>isActive?setLogEx(null):openLog(ex.name)}
                style={{width:"100%",padding:"9px",borderRadius:7,cursor:"pointer",background:isActive?plan.color+"33":plan.color+"18",border:`1px solid ${plan.color}${isActive?"99":"44"}`,color:plan.color,fontSize:12,fontWeight:600}}>
                {isActive?"▲ Close":"+ Log Set"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── STRENGTH TAB ──────────────────────────────────────────────────────────────
const pushNames=[...new Set([...GYM_PLANS["Push Day"].exercises.map(e=>e.name),...GYM_PLANS["Push Day B"].exercises.map(e=>e.name)])];
const pullNames=[...new Set([...GYM_PLANS["Pull Day"].exercises.map(e=>e.name),...GYM_PLANS["Pull Day B"].exercises.map(e=>e.name)])];
const legsNames=[...new Set(GYM_PLANS["Legs Day"].exercises.map(e=>e.name))];
const groupMap={};
pushNames.forEach(n=>groupMap[n]="Push");
pullNames.forEach(n=>groupMap[n]="Pull");
legsNames.forEach(n=>groupMap[n]="Legs");
const groupColor={"Push":C.push,"Pull":C.pull,"Legs":C.legs};

function StrengthTab(){
  const liftLogs=LS.get("lift_logs",{});
  const [filter,setFilter]=useState("All");
  const [activeEx,setActiveEx]=useState(null);
  const getBest=name=>{const byDate={};(liftLogs[name]||[]).forEach(e=>{if(!byDate[e.date]||e.weight>byDate[e.date].weight)byDate[e.date]=e;});return Object.values(byDate).sort((a,b)=>a.date.localeCompare(b.date));};
  const allEx=Object.keys(LIFT_TARGETS);
  const tracked=allEx.filter(n=>(liftLogs[n]||[]).length>=1);
  const visible=tracked.filter(n=>filter==="All"||groupMap[n]===filter);
  const totalSets=Object.values(liftLogs).reduce((a,v)=>a+v.length,0);
  const totalHits=tracked.reduce((a,n)=>{const l=getBest(n).slice(-1)[0]?.weight;return a+(LIFT_TARGETS[n]||[]).filter(t=>l&&l>=t.kg).length;},0);
  if(tracked.length===0)return(
    <div style={{textAlign:"center",padding:"48px 16px"}}>
      <div style={{fontSize:36,marginBottom:12}}>📈</div>
      <div style={{fontSize:14,color:C.textSec,marginBottom:6}}>No lift data yet</div>
      <div style={{fontSize:13,color:C.textDim,lineHeight:1.6}}>Go to the Gym tab and log some sets.<br/>Your strength charts will appear here.</div>
    </div>
  );
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
        {[{l:"Tracked",v:tracked.length,c:C.push},{l:"Total sets",v:totalSets,c:C.pull},{l:"Targets hit",v:totalHits,c:C.legs}].map((s,i)=>(
          <div key={i} style={{background:C.bg2,border:`1px solid ${s.c}33`,borderRadius:12,padding:"13px 10px",textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:700,color:s.c}}>{s.v}</div>
            <div style={{fontSize:10,color:C.textSec,marginTop:2,lineHeight:1.3}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {["All","Push","Pull","Legs"].map(f=>(
          <Pill key={f} active={filter===f} color={f==="All"?C.accent:groupColor[f]||C.accent} onClick={()=>{setFilter(f);setActiveEx(null);}}>{f}</Pill>
        ))}
      </div>
      {activeEx&&(()=>{
        const data=getBest(activeEx),color=groupColor[groupMap[activeEx]]||C.accent,targets=LIFT_TARGETS[activeEx]||[];
        const first=data[0]?.weight,last=data[data.length-1]?.weight,gain=first&&last?(last-first).toFixed(1):null;
        const nextT=targets.find(t=>!last||t.kg>last);
        return(
          <Card style={{marginBottom:14,border:`1px solid ${color}55`,background:C.bg2}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:14,fontWeight:700,color:C.textPrimary}}>{activeEx}</div>
              <button onClick={()=>setActiveEx(null)} style={{fontSize:11,background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 9px",color:C.textSec,cursor:"pointer"}}>Close</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
              {[{l:"First",v:first?`${first}kg`:"—",c:C.textSec},{l:"Best",v:last?`${last}kg`:"—",c:color},{l:"Gain",v:gain&&parseFloat(gain)>0?`+${gain}kg`:gain?`${gain}kg`:"—",c:parseFloat(gain)>0?C.pull:C.textDim}].map((s,i)=>(
                <div key={i} style={{textAlign:"center",background:C.bg3,borderRadius:8,padding:"10px 6px"}}>
                  <div style={{fontSize:14,fontWeight:700,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:9,color:C.textDim,marginTop:2}}>{s.l}</div>
                </div>
              ))}
            </div>
            {data.length>=2&&<MiniStrengthChart data={data} targets={targets} color={color}/>}
            <div style={{marginTop:12}}>
              <div style={{fontSize:10,color:C.textDim,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.1em"}}>Phase Targets</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {targets.map((t,i)=>{const hit=last&&last>=t.kg,tc=[C.accent,C.pull,C.legs,C.flex][i];return(
                  <div key={i} style={{padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:hit?tc+"22":C.bg3,color:hit?tc:C.textDim,border:`1px solid ${hit?tc+"55":C.border}`}}>{hit?"✓ ":""}{t.ph}: {t.kg}kg</div>
                );})}
              </div>
              {nextT&&<div style={{fontSize:12,color:C.textSec,marginTop:8}}>Next: <span style={{color:C.legs,fontWeight:700}}>{nextT.kg}kg ({nextT.ph})</span></div>}
            </div>
            <div style={{marginTop:12,borderTop:`1px solid ${C.border}`,paddingTop:10}}>
              <div style={{fontSize:10,color:C.textDim,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.1em"}}>All Entries</div>
              <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:180,overflowY:"auto"}}>
                {[...(liftLogs[activeEx]||[])].sort((a,b)=>b.date.localeCompare(a.date)).map(e=>(
                  <div key={e.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:8,background:C.bg3,borderRadius:7,padding:"6px 10px",alignItems:"center"}}>
                    <span style={{fontSize:11,color:C.textSec}}>{fmt(e.date)}</span>
                    <span style={{fontSize:13,fontWeight:700,color}}>{e.weight}kg</span>
                    <span style={{fontSize:11,color:C.textDim}}>{e.sets||"?"}×{e.reps||"?"}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );
      })()}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {visible.map(name=>{
          const data=getBest(name),color=groupColor[groupMap[name]]||C.accent;
          const latest=data[data.length-1]?.weight,first=data[0]?.weight;
          const gain=first&&latest?(latest-first).toFixed(1):null;
          const targets=LIFT_TARGETS[name]||[],nextT=targets.find(t=>!latest||t.kg>latest),isActive=activeEx===name;
          return(
            <Card key={name} style={{borderColor:isActive?color+"55":C.border}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div><div style={{fontSize:13,fontWeight:700,color:C.textPrimary,marginBottom:3}}>{name}</div><Tag label={groupMap[name]||"?"} color={color}/></div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:18,fontWeight:700,color}}>{latest?`${latest}kg`:"—"}</div>
                  {gain!==null&&<div style={{fontSize:11,color:parseFloat(gain)>0?C.pull:C.textDim}}>{parseFloat(gain)>0?`+${gain}kg`:gain==="0.0"?"no change":`${gain}kg`}</div>}
                </div>
              </div>
              {data.length>=2?<MiniStrengthChart data={data} targets={targets} color={color}/>
                :<div style={{fontSize:11,color:C.textDim,fontStyle:"italic",marginBottom:4}}>Log more sets to see trend</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                <div style={{fontSize:11,color:C.textSec}}>{nextT?<>Next: <span style={{color:C.legs,fontWeight:700}}>{nextT.kg}kg</span></>:<span style={{color:C.pull}}>🏆 All targets hit</span>}</div>
                <button onClick={()=>setActiveEx(isActive?null:name)} style={{fontSize:11,background:"none",border:`1px solid ${color}44`,borderRadius:6,padding:"4px 10px",color,cursor:"pointer"}}>{isActive?"Close":"Details"}</button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── LOG TAB ───────────────────────────────────────────────────────────────────
function LogTab(){
  const [sessions,setSessions]=useState(()=>LS.get("tracker_sessions",[]));
  const [form,setForm]=useState({date:todayStr(),type:"gym",subtype:"Push Day",notes:"",surfHours:""});
  const [showForm,setShowForm]=useState(false);
  const currentWk=weekKey();
  const thisWeek=sessions.filter(s=>weekKey(new Date(s.date+"T12:00:00"))===currentWk);
  const gymC=thisWeek.filter(s=>s.type==="gym").length;
  const runC=thisWeek.filter(s=>s.type==="run").length;
  const surfC=thisWeek.filter(s=>s.type==="surf").length;
  const surfH=thisWeek.filter(s=>s.type==="surf").reduce((a,s)=>a+(parseFloat(s.surfHours)||0),0);
  const save=()=>{if(!form.date)return;const u=[{...form,id:Date.now()},...sessions];setSessions(u);LS.set("tracker_sessions",u);setShowForm(false);setForm({date:todayStr(),type:"gym",subtype:"Push Day",notes:"",surfHours:"",});};
  const del=id=>{const u=sessions.filter(s=>s.id!==id);setSessions(u);LS.set("tracker_sessions",u);};
  const typeColor={gym:C.push,run:C.run,surf:C.surf},typeIcon={gym:"🏋️",run:"🏃",surf:"🌊"};
  const inp=()=>({width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,color:C.textPrimary,padding:"7px 8px",fontSize:12,boxSizing:"border-box"});
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
        {[
          {label:"Gym",val:gymC,target:3,color:C.push},
          {label:"Runs",val:runC,target:4,color:C.run},
          {label:"Surfs",val:surfC,target:"–",color:C.surf,sub:surfH>0?`${surfH}h`:null},
        ].map((s,i)=>(
          <div key={i} style={{background:C.bg2,border:`1px solid ${s.color}33`,borderRadius:12,padding:"13px 10px",textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:700,color:s.color}}>{s.val}</div>
            <div style={{fontSize:11,color:C.textSec,marginTop:1}}>{s.label}</div>
            {s.target!=="–"&&<div style={{fontSize:10,color:s.val>=s.target?C.pull:C.textDim,marginTop:2}}>of {s.target}</div>}
            {s.sub&&<div style={{fontSize:10,color:C.surf,marginTop:2}}>{s.sub}</div>}
          </div>
        ))}
      </div>
      <button onClick={()=>setShowForm(!showForm)} style={{width:"100%",padding:"12px",borderRadius:10,border:`1px solid ${C.accent}44`,background:showForm?C.bg2:C.accent+"18",color:C.accent,fontSize:14,fontWeight:600,cursor:"pointer",marginBottom:14}}>
        {showForm?"Cancel":"+ Log a Session"}
      </button>
      {showForm&&(
        <Card style={{marginBottom:14}}>
          <SecLabel>New Session</SecLabel>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div><div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Date</div><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inp()}/></div>
            <div><div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Type</div>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value,subtype:e.target.value==="gym"?"Push Day":""})} style={inp()}>
                <option value="gym">Gym</option><option value="run">Run</option><option value="surf">Surf</option>
              </select></div>
          </div>
          {form.type==="gym"&&<div style={{marginBottom:8}}><div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Session</div>
            <select value={form.subtype} onChange={e=>setForm({...form,subtype:e.target.value})} style={inp()}>
              {["Push Day","Pull Day","Legs Day","Push Day B","Pull Day B"].map(s=><option key={s}>{s}</option>)}
            </select></div>}
          {form.type==="surf"&&<div style={{marginBottom:8}}><div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Hours in water</div>
            <input type="number" step="0.5" min="0.5" max="8" value={form.surfHours} placeholder="e.g. 2" onChange={e=>setForm({...form,surfHours:e.target.value})} style={inp()}/></div>}
          <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Notes</div>
            <input value={form.notes} placeholder="How did it go? Any PRs?" onChange={e=>setForm({...form,notes:e.target.value})} style={inp()}/></div>
          <button onClick={save} style={{width:"100%",padding:"10px",borderRadius:7,border:"none",background:C.accent,color:C.bg0,fontSize:13,fontWeight:700,cursor:"pointer"}}>Save</button>
        </Card>
      )}
      <SecLabel>This Week's Log</SecLabel>
      {thisWeek.length===0&&<div style={{fontSize:13,color:C.textDim,padding:"16px 0",textAlign:"center"}}>Nothing logged this week yet.</div>}
      <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:20}}>
        {sessions.slice(0,40).map(s=>(
          <div key={s.id} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 13px",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:18}}>{typeIcon[s.type]}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                <span style={{fontSize:13,fontWeight:600,color:C.textPrimary}}>{s.subtype||s.type}</span>
                <Tag label={s.type.toUpperCase()} color={typeColor[s.type]}/>
                {s.surfHours&&<Tag label={`${s.surfHours}h`} color={C.surf}/>}
              </div>
              <div style={{fontSize:11,color:C.textSec,marginTop:2}}>{fmt(s.date)}{s.notes?` · ${s.notes}`:""}</div>
            </div>
            <button onClick={()=>del(s.id)} style={{background:"none",border:"none",color:C.textDim,fontSize:17,cursor:"pointer"}}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── WEIGHT TAB ────────────────────────────────────────────────────────────────
function WeightTab(){
  const [entries,setEntries]=useState(()=>LS.get("weight_entries",[]));
  const [goals,setGoals]=useState(()=>LS.get("weight_goals",{start:80,target:74}));
  const [val,setVal]=useState("");
  const [date,setDate]=useState(todayStr());
  const [editGoals,setEditGoals]=useState(false);
  const [gForm,setGForm]=useState({start:String(goals.start),target:String(goals.target)});
  const sorted=[...entries].sort((a,b)=>a.date.localeCompare(b.date));
  const latest=sorted.length?sorted[sorted.length-1].weight:null;
  const {start,target}=goals;
  const lost=latest?Math.max(0,start-latest).toFixed(1):0;
  const toGo=latest?Math.max(0,latest-target).toFixed(1):(start-target).toFixed(1);
  const pct=latest&&start!==target?Math.min(100,Math.max(0,Math.round(((start-latest)/(start-target))*100))):0;
  const add=()=>{if(!val||isNaN(parseFloat(val)))return;const u=[...entries,{date:date,weight:parseFloat(val),id:Date.now()}].sort((a,b)=>a.date.localeCompare(b.date));setEntries(u);LS.set("weight_entries",u);setVal("");};
  const del=id=>{const u=entries.filter(e=>e.id!==id);setEntries(u);LS.set("weight_entries",u);};
  const saveGoals=()=>{const g={start:parseFloat(gForm.start)||80,target:parseFloat(gForm.target)||74};setGoals(g);LS.set("weight_goals",g);setEditGoals(false);};
  const inp=()=>({width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,color:C.textPrimary,padding:"7px 8px",fontSize:12,boxSizing:"border-box"});
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
        {[{l:"Current",v:latest?`${latest}kg`:"—",c:C.weight},{l:"Lost",v:lost>0?`-${lost}kg`:"—",c:C.pull},{l:"To go",v:`${toGo}kg`,c:C.legs}].map((s,i)=>(
          <div key={i} style={{background:C.bg2,border:`1px solid ${s.c}33`,borderRadius:12,padding:"13px 10px",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:700,color:s.c}}>{s.v}</div>
            <div style={{fontSize:11,color:C.textSec,marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>
      <Card style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:editGoals?12:8}}>
          <span style={{fontSize:13,fontWeight:600,color:C.textPrimary}}>Weight Goals</span>
          <button onClick={()=>{setEditGoals(!editGoals);setGForm({start:String(goals.start),target:String(goals.target)});}} style={{fontSize:11,background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",color:C.accent,cursor:"pointer"}}>{editGoals?"Cancel":"Edit Goals"}</button>
        </div>
        {editGoals?(
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              {[{l:"Start weight (kg)",f:"start"},{l:"Target weight (kg)",f:"target"}].map(x=>(
                <div key={x.f}><div style={{fontSize:10,color:C.textDim,marginBottom:3}}>{x.l}</div>
                  <input type="number" step="0.5" value={gForm[x.f]} onChange={e=>setGForm({...gForm,[x.f]:e.target.value})}
                    style={{width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,color:C.textPrimary,padding:"8px 10px",fontSize:14,fontWeight:700,boxSizing:"border-box",textAlign:"center"}}/></div>
              ))}
            </div>
            <button onClick={saveGoals} style={{width:"100%",padding:"9px",borderRadius:7,border:"none",background:C.accent,color:C.bg0,fontSize:13,fontWeight:700,cursor:"pointer"}}>Save Goals</button>
          </>
        ):(
          <>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:12,color:C.textSec}}>{start}kg → {target}kg</span>
              <span style={{fontSize:12,fontWeight:700,color:C.pull}}>{pct}% there</span>
            </div>
            <div style={{background:C.bg0,borderRadius:99,height:8,overflow:"hidden"}}>
              <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${C.weight},${C.pull})`,borderRadius:99,transition:"width 0.5s"}}/>
            </div>
          </>
        )}
      </Card>
      <Card style={{marginBottom:14}}>
        <SecLabel>Weight Over Time</SecLabel>
        <WeightChart entries={sorted} target={target} startWeight={start}/>
        {sorted.length>=2&&(
          <div style={{display:"flex",gap:16,marginTop:12,flexWrap:"wrap"}}>
            {[{c:C.weight,l:"Weight"},{c:C.pull,l:`${target}kg target`},{c:C.textDim,l:`${start}kg start`}].map((x,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:14,height:i===2?1:2,background:x.c,borderRadius:2,opacity:i===2?0.5:1}}/>
                <span style={{fontSize:10,color:C.textSec}}>{x.l}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card style={{marginBottom:14}}>
        <SecLabel>Log Weight</SecLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,alignItems:"end"}}>
          <div><div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Date</div><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inp()}/></div>
          <div><div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Weight (kg)</div><input type="number" step="0.1" value={val} placeholder="78.5" onChange={e=>setVal(e.target.value)} style={inp()}/></div>
          <button onClick={add} style={{background:C.weight,color:C.bg0,border:"none",borderRadius:7,padding:"9px 14px",fontSize:14,fontWeight:700,cursor:"pointer"}}>+</button>
        </div>
      </Card>
      <SecLabel>History</SecLabel>
      {sorted.length===0&&<div style={{fontSize:13,color:C.textDim,padding:"16px 0",textAlign:"center"}}>No entries yet.</div>}
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {[...sorted].reverse().slice(0,25).map((e,i,arr)=>{
          const prev=arr[i+1],diff=prev?parseFloat((e.weight-prev.weight).toFixed(1)):null;
          return(
            <div key={e.id} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 13px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,color:C.textSec}}>{fmt(e.date)}</span>
              <span style={{fontSize:15,fontWeight:700,color:C.weight}}>{e.weight} kg</span>
              {diff!==null&&<span style={{fontSize:11,fontWeight:600,color:diff<0?C.pull:diff>0?C.push:C.textDim}}>{diff>0?"+":""}{diff}kg</span>}
              <button onClick={()=>del(e.id)} style={{background:"none",border:"none",color:C.textDim,fontSize:16,cursor:"pointer"}}>×</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── HISTORY TAB ───────────────────────────────────────────────────────────────
function HistoryTab(){
  const sessions=LS.get("tracker_sessions",[]);
  const byWeek={};
  sessions.forEach(s=>{
    const k=weekKey(new Date(s.date+"T12:00:00"));
    if(!byWeek[k])byWeek[k]={gym:0,run:0,surf:0,surfH:0};
    if(s.type==="gym")byWeek[k].gym++;
    else if(s.type==="run")byWeek[k].run++;
    else if(s.type==="surf"){byWeek[k].surf++;byWeek[k].surfH+=parseFloat(s.surfHours)||0;}
  });
  const weeks=Object.keys(byWeek).sort();
  if(weeks.length===0)return<div style={{textAlign:"center",color:C.textDim,fontSize:13,padding:"40px 0"}}>Log some sessions first and your weekly history will appear here.</div>;
  const last8=weeks.slice(-8);
  const labels=last8.map(w=>{const d=new Date(w+"T12:00:00");return`${d.getDate()}/${d.getMonth()+1}`;});
  return(
    <div>
      <div style={{fontSize:13,color:C.textSec,marginBottom:16,lineHeight:1.6}}>Weekly tallies reset automatically. This stores your history so you can track consistency over time.</div>
      {[
        {label:"Gym Sessions / Week",data:last8.map((w,i)=>({y:byWeek[w].gym,label:labels[i]})),color:C.push,target:3},
        {label:"Runs / Week",        data:last8.map((w,i)=>({y:byWeek[w].run,label:labels[i]})),color:C.run, target:4},
        {label:"Surf Sessions / Week",data:last8.map((w,i)=>({y:byWeek[w].surf,label:labels[i]})),color:C.surf},
        {label:"Surf Hours / Week",   data:last8.map((w,i)=>({y:parseFloat(byWeek[w].surfH.toFixed(1)),label:labels[i]})),color:C.accent},
      ].map((chart,i)=>(
        <Card key={i} style={{marginBottom:14}}>
          <SecLabel>{chart.label}</SecLabel>
          <BarChart data={chart.data} color={chart.color} maxVal={chart.target?Math.max(chart.target,...chart.data.map(d=>d.y)):undefined}/>
          {chart.target&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}><div style={{width:16,height:2,borderTop:`2px dashed ${C.pull}`,opacity:.6}}/><span style={{fontSize:10,color:C.textDim}}>Target: {chart.target}/week</span></div>}
        </Card>
      ))}
      <SecLabel style={{marginTop:8}}>Week-by-Week Breakdown</SecLabel>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[...weeks].reverse().map(w=>{
          const wk=byWeek[w];
          return(
            <Card key={w} style={{padding:"11px 14px"}}>
              <div style={{fontSize:12,fontWeight:700,color:C.textPrimary,marginBottom:7}}>{weekLabel(w)}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
                {[{l:"Gym",v:wk.gym,c:C.push},{l:"Runs",v:wk.run,c:C.run},{l:"Surfs",v:wk.surf,c:C.surf},{l:"Surf hrs",v:wk.surfH.toFixed(1),c:C.accent}].map((s,i)=>(
                  <div key={i} style={{textAlign:"center"}}>
                    <div style={{fontSize:18,fontWeight:700,color:s.c}}>{s.v}</div>
                    <div style={{fontSize:10,color:C.textDim}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
const TABS=[
  {key:"schedule",label:"Schedule",Icon:CalendarDays},
  {key:"mobility",label:"Mobility",Icon:Activity},
  {key:"gym",     label:"Gym",     Icon:Dumbbell},
  {key:"strength",label:"Strength",Icon:TrendingUp},
  {key:"log",     label:"Log",     Icon:ClipboardList},
  {key:"weight",  label:"Weight",  Icon:Scale},
  {key:"history", label:"History", Icon:BarChart3},
];

export default function App(){
  const [tab,setTab]=useState("schedule");
  const [themeKey,setThemeKey]=useState(initialThemeKey);
  const [isTransitioning,setIsTransitioning]=useState(false);

  useEffect(()=>{
    setIsTransitioning(true);
    const t=setTimeout(()=>{applyTheme(themeKey);LS.set("theme",themeKey);setIsTransitioning(false);},90);
    return()=>clearTimeout(t);
  },[themeKey]);

  return(
    <div style={{minHeight:"100vh",background:C.bg0,color:C.textPrimary,fontFamily:"'DM Sans','Helvetica Neue',sans-serif",paddingBottom:80,transition:"background-color 140ms ease",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:C.bg0,opacity:isTransitioning?1:0,transition:"opacity 140ms ease",pointerEvents:"none",zIndex:20}}/>
      <div style={{background:`linear-gradient(135deg,${C.bg2} 0%,${C.bg0} 100%)`,borderBottom:`1px solid ${C.border}`,padding:"22px 18px 16px",transition:"background 140ms ease,border-color 140ms ease"}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <div style={{fontSize:10,letterSpacing:"0.2em",color:C.textDim,textTransform:"uppercase",marginBottom:4}}>Training Program</div>
          <h1 style={{margin:0,fontSize:22,fontWeight:700,letterSpacing:"-0.02em",color:C.textPrimary}}>Dashboard</h1>
          <p style={{margin:"4px 0 0",fontSize:12,color:C.textSec}}>Strength · Aesthetics · Running · Surfing</p>
          <div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
            <span style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:C.textDim}}>Theme</span>
            <select value={themeKey} onChange={e=>setThemeKey(e.target.value)} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:999,padding:"7px 10px",color:C.textPrimary,fontSize:11,fontWeight:600,outline:"none",transition:"background-color 140ms ease,border-color 140ms ease"}}>
              {THEME_OPTIONS.map(o=><option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div style={{background:C.bg1,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:10,transition:"background-color 140ms ease,border-color 140ms ease"}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",overflowX:"auto"}}>
          {TABS.map(({key,label,Icon})=>(
            <button key={key} onClick={()=>setTab(key)} style={{background:"none",border:"none",cursor:"pointer",flexShrink:0,padding:"11px 13px",fontSize:12,fontWeight:500,color:tab===key?C.textPrimary:C.textSec,borderBottom:tab===key?`2px solid ${C.accent}`:"2px solid transparent",display:"inline-flex",alignItems:"center",gap:6,transition:"color 140ms ease,border-color 140ms ease"}}>
              <Icon size={14} strokeWidth={2.2}/><span>{label}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{maxWidth:720,margin:"0 auto",padding:"18px 13px"}}>
        {tab==="schedule" &&<ScheduleTab/>}
        {tab==="mobility" &&<MobilityTab/>}
        {tab==="gym"      &&<GymTab/>}
        {tab==="strength" &&<StrengthTab/>}
        {tab==="log"      &&<LogTab/>}
        {tab==="weight"   &&<WeightTab/>}
        {tab==="history"  &&<HistoryTab/>}
      </div>
    </div>
  );
}