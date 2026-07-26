import { useState, useEffect, useCallback } from "react";

// ── COLOURS ───────────────────────────────────────────────────────────────────
const C = {
  bg0:"#03060f", bg1:"#060e1c", bg2:"#0b1a2e", bg3:"#071221",
  border:"#0f2d4a", borderHi:"#1a4060",
  textPrimary:"#e8f4ff", textSec:"#5b8db8", textDim:"#2a4f6e",
  push:"#ff6b35", pull:"#39d353", legs:"#f5c518", run:"#c084fc",
  flex:"#f472b6", rest:"#94a3b8", surf:"#00c2e0",
  accent:"#00c2e0", weight:"#f472b6",
};

// ── LOCAL STORAGE ─────────────────────────────────────────────────────────────
const LS = {
  get:(k,d)=>{ try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;} },
  set:(k,v)=>{ try{localStorage.setItem(k,JSON.stringify(v));}catch{} },
};

// ── DATE HELPERS ──────────────────────────────────────────────────────────────
const todayStr  = ()=>new Date().toISOString().split("T")[0];
const fmt       = d=>new Date(d+"T12:00:00").toLocaleDateString("en-ZA",{day:"numeric",month:"short"});
const weekKey   = (d=new Date())=>{ const t=new Date(d); t.setDate(t.getDate()-((t.getDay()+6)%7)); return t.toISOString().split("T")[0]; };
const weekLabel = k=>{ const s=new Date(k+"T12:00:00"),e=new Date(s);e.setDate(s.getDate()+6); return `${fmt(s.toISOString().split("T")[0])}–${fmt(e.toISOString().split("T")[0])}`; };

// ── GYM DATA ─────────────────────────────────────────────────────────────────
const GYM_PLANS = {
  "Push Day": {
    color:"#ff6b35", muscles:"Chest · Shoulders · Triceps",
    exercises:[
      {name:"Incline Barbell Bench Press", sets:"1 warm-up + 4×10", weight:"Start ~45kg", note:"Control the eccentric (3s down)"},
      {name:"Flat Dumbbell Bench Press",   sets:"3×10",             weight:"20kg/hand",   note:"Full ROM, pause at bottom"},
      {name:"Seated DB Shoulder Press",    sets:"3×10",             weight:"10–12kg",     note:"Don't flare elbows too wide"},
      {name:"Lateral Raises",              sets:"4×15",             weight:"6–8kg",       note:"Slow and controlled"},
      {name:"Cable Tricep Pushdown (rope)",sets:"3×12",             weight:"24–28kg",     note:"Flare hands at bottom"},
      {name:"Overhead DB Tricep Extension",sets:"3×12",             weight:"12–16kg",     note:"Great for tricep long head"},
    ]
  },
  "Push Day B": {
    color:"#ff6b35", muscles:"Chest · Shoulders · Triceps",
    exercises:[
      {name:"Smith Machine Bench Press",   sets:"4×10",   weight:"~50kg",      note:"Use smith if bench is taken"},
      {name:"Incline Dumbbell Press",      sets:"3×12",   weight:"18–20kg/h",  note:"30° incline"},
      {name:"Arnold Press",                sets:"3×10",   weight:"10–12kg",    note:"Full shoulder activation"},
      {name:"Cable Lateral Raises",        sets:"3×15",   weight:"6–8kg",      note:"Constant tension"},
      {name:"Tricep Pushdown (bar)",       sets:"3×12",   weight:"26–30kg",    note:""},
      {name:"Dips",                        sets:"3×max",  weight:"Bodyweight",  note:"Lean forward for chest focus"},
    ]
  },
  "Pull Day": {
    color:"#39d353", muscles:"Back · Biceps · Rear Delts",
    exercises:[
      {name:"Lat Pulldown",                sets:"1 warm-up + 4×10", weight:"60→65kg",    note:"Drive elbows down"},
      {name:"Bent Over Barbell Row",       sets:"4×10",             weight:"40–50kg",    note:"Hinge at hips, neutral spine"},
      {name:"Seated Cable Row",            sets:"3×12",             weight:"40–50kg",    note:"Mid-back thickness"},
      {name:"Face Pull (cable)",           sets:"3×15",             weight:"20–24kg",    note:"External rotate at peak"},
      {name:"Weighted Back Extension",     sets:"3×12",             weight:"10–15kg",    note:"Don't hyperextend"},
      {name:"Dumbbell Hammer Curls",       sets:"3×12",             weight:"10–12kg",    note:""},
      {name:"EZ Bar / Barbell Curl",       sets:"3×10",             weight:"20–25kg",    note:"Preacher replacement"},
    ]
  },
  "Pull Day B": {
    color:"#39d353", muscles:"Back · Biceps · Rear Delts",
    exercises:[
      {name:"Wide Grip Lat Pulldown",      sets:"4×10",   weight:"55–65kg",    note:"Stretch lats at top"},
      {name:"Single Arm DB Row",           sets:"3×10 ea",weight:"20–24kg",    note:"Full ROM, drive elbow back"},
      {name:"Cable Straight Arm Pulldown", sets:"3×15",   weight:"light",      note:"Lat isolation"},
      {name:"Face Pull",                   sets:"3×15",   weight:"22–26kg",    note:""},
      {name:"Incline Dumbbell Curl",       sets:"3×12",   weight:"10–12kg",    note:"Stretches bicep long head"},
      {name:"Hammer Curls",               sets:"3×12",   weight:"10–14kg",    note:""},
      {name:"Back Extension",              sets:"3×12",   weight:"10kg",       note:""},
    ]
  },
  "Legs Day": {
    color:"#f5c518", muscles:"Quads · Hamstrings · Glutes · Calves",
    exercises:[
      {name:"Smith Machine Squat",         sets:"1 warm-up + 4×10", weight:"40–50kg",   note:"Feet fwd, depth to parallel"},
      {name:"Goblet Squat / Leg Press",    sets:"3×12",             weight:"16–20kg DB",note:"Build form first"},
      {name:"Leg Extension Machine",       sets:"3×15",             weight:"Light–mod",  note:"Pause at peak"},
      {name:"Standing Leg Curl Machine",   sets:"3×12 ea",          weight:"Light–mod",  note:"Control eccentric"},
      {name:"Romanian Deadlift (DB)",      sets:"3×10",             weight:"20–24kg/h", note:"Hinge, stretch hammies"},
      {name:"Standing Calf Raise",         sets:"4×15",             weight:"BW or loaded",note:"Full ROM, pause top + bottom"},
    ]
  },
};

// ── MOBILITY DATA ─────────────────────────────────────────────────────────────
const MOBILITY = {
  ankle: {
    color:"#00c2e0", icon:"🦶",
    exercises:[
      {name:"Ankle Circles",         reps:"20 each direction, each foot",  note:"Seated or lying. Slow, full ROM."},
      {name:"Alphabet Tracing",      reps:"A–Z once per foot",             note:"Draw the alphabet with your big toe in the air."},
      {name:"Calf Raises (slow)",    reps:"3×15 slow + hold at top",       note:"Use a step for extra ROM. Pause 2s at top."},
      {name:"Single-Leg Balance",    reps:"3×30s each foot",               note:"Progress: eyes closed → on a folded towel."},
      {name:"Banded Ankle Eversion", reps:"3×15 each",                     note:"Loop band around forefoot, resist outward. Builds peroneal strength."},
      {name:"Heel-Toe Walk",         reps:"10m on heels, 10m on toes",     note:"Activates tibialis anterior and calves."},
    ]
  },
  hip: {
    color:"#f472b6", icon:"🦴",
    exercises:[
      {name:"90/90 Hip Stretch",     reps:"60s each side",                 note:"Sit on floor, both knees at 90°. Lean into front hip."},
      {name:"Hip Flexor Lunge Stretch",reps:"60s each side",               note:"Low lunge, push hips fwd. Tuck pelvis under."},
      {name:"Pigeon Pose",           reps:"60–90s each side",              note:"On floor or modified with hand support."},
      {name:"Hip Circles (standing)",reps:"10 each direction",             note:"Hands on hips, big slow circles. Wakes up hip joint."},
      {name:"Lateral Band Walk",     reps:"2×15 each direction",           note:"Glute med activation — critical for surf stability."},
      {name:"Glute Bridge",          reps:"3×15",                          note:"Squeeze at top, 2s hold. Progress to single-leg."},
    ]
  },
  spine: {
    color:"#f5c518", icon:"🦴",
    exercises:[
      {name:"Cat-Cow",               reps:"10 slow cycles",                note:"On all fours. Breathe in on cow (arch), out on cat (round)."},
      {name:"Thoracic Extension (foam roller)", reps:"10 reps, hold 5s", note:"Sit against foam roller at mid-back, arms crossed, extend over it."},
      {name:"Thread the Needle",     reps:"10 each side",                  note:"All fours — thread one arm under body, rotating thoracic spine."},
      {name:"Seated Thoracic Rotation",reps:"10 each direction",           note:"Sit cross-legged, rotate upper body. Keep hips planted."},
      {name:"Doorway Chest Stretch", reps:"2×30s each arm",                note:"Opens anterior chain — crucial for posture after surfing/paddling."},
      {name:"Child's Pose",          reps:"60s",                           note:"Arms extended, breathe into lower back. End every session with this."},
    ]
  },
};

// ── LIFT TARGETS ──────────────────────────────────────────────────────────────
const LIFT_TARGETS = {
  "Incline Barbell Bench Press": [{ph:"Ph1",kg:45},{ph:"Ph2",kg:50},{ph:"Ph3",kg:60},{ph:"Ph4",kg:70}],
  "Flat Dumbbell Bench Press":   [{ph:"Ph1",kg:18},{ph:"Ph2",kg:20},{ph:"Ph3",kg:24},{ph:"Ph4",kg:28}],
  "Seated DB Shoulder Press":    [{ph:"Ph1",kg:8}, {ph:"Ph2",kg:10},{ph:"Ph3",kg:14},{ph:"Ph4",kg:18}],
  "Lateral Raises":              [{ph:"Ph1",kg:6}, {ph:"Ph2",kg:8}, {ph:"Ph3",kg:10},{ph:"Ph4",kg:12}],
  "Cable Tricep Pushdown (rope)":[{ph:"Ph1",kg:22},{ph:"Ph2",kg:26},{ph:"Ph3",kg:30},{ph:"Ph4",kg:34}],
  "Overhead DB Tricep Extension":[{ph:"Ph1",kg:12},{ph:"Ph2",kg:14},{ph:"Ph3",kg:18},{ph:"Ph4",kg:22}],
  "Smith Machine Bench Press":   [{ph:"Ph1",kg:45},{ph:"Ph2",kg:50},{ph:"Ph3",kg:60},{ph:"Ph4",kg:70}],
  "Incline Dumbbell Press":      [{ph:"Ph1",kg:16},{ph:"Ph2",kg:20},{ph:"Ph3",kg:24},{ph:"Ph4",kg:28}],
  "Arnold Press":                [{ph:"Ph1",kg:8}, {ph:"Ph2",kg:10},{ph:"Ph3",kg:14},{ph:"Ph4",kg:18}],
  "Cable Lateral Raises":        [{ph:"Ph1",kg:6}, {ph:"Ph2",kg:8}, {ph:"Ph3",kg:10},{ph:"Ph4",kg:12}],
  "Tricep Pushdown (bar)":       [{ph:"Ph1",kg:24},{ph:"Ph2",kg:28},{ph:"Ph3",kg:32},{ph:"Ph4",kg:36}],
  "Lat Pulldown":                [{ph:"Ph1",kg:55},{ph:"Ph2",kg:60},{ph:"Ph3",kg:72},{ph:"Ph4",kg:82}],
  "Bent Over Barbell Row":       [{ph:"Ph1",kg:35},{ph:"Ph2",kg:45},{ph:"Ph3",kg:55},{ph:"Ph4",kg:65}],
  "Seated Cable Row":            [{ph:"Ph1",kg:35},{ph:"Ph2",kg:45},{ph:"Ph3",kg:55},{ph:"Ph4",kg:65}],
  "Face Pull (cable)":           [{ph:"Ph1",kg:18},{ph:"Ph2",kg:22},{ph:"Ph3",kg:26},{ph:"Ph4",kg:30}],
  "Weighted Back Extension":     [{ph:"Ph1",kg:8}, {ph:"Ph2",kg:12},{ph:"Ph3",kg:16},{ph:"Ph4",kg:20}],
  "Dumbbell Hammer Curls":       [{ph:"Ph1",kg:10},{ph:"Ph2",kg:12},{ph:"Ph3",kg:14},{ph:"Ph4",kg:16}],
  "EZ Bar / Barbell Curl":       [{ph:"Ph1",kg:18},{ph:"Ph2",kg:22},{ph:"Ph3",kg:27},{ph:"Ph4",kg:32}],
  "Wide Grip Lat Pulldown":      [{ph:"Ph1",kg:50},{ph:"Ph2",kg:58},{ph:"Ph3",kg:68},{ph:"Ph4",kg:78}],
  "Single Arm DB Row":           [{ph:"Ph1",kg:18},{ph:"Ph2",kg:22},{ph:"Ph3",kg:26},{ph:"Ph4",kg:30}],
  "Face Pull":                   [{ph:"Ph1",kg:18},{ph:"Ph2",kg:22},{ph:"Ph3",kg:26},{ph:"Ph4",kg:30}],
  "Incline Dumbbell Curl":       [{ph:"Ph1",kg:8}, {ph:"Ph2",kg:10},{ph:"Ph3",kg:12},{ph:"Ph4",kg:14}],
  "Hammer Curls":                [{ph:"Ph1",kg:10},{ph:"Ph2",kg:12},{ph:"Ph3",kg:14},{ph:"Ph4",kg:16}],
  "Back Extension":              [{ph:"Ph1",kg:0}, {ph:"Ph2",kg:8}, {ph:"Ph3",kg:12},{ph:"Ph4",kg:16}],
  "Smith Machine Squat":         [{ph:"Ph1",kg:40},{ph:"Ph2",kg:55},{ph:"Ph3",kg:70},{ph:"Ph4",kg:85}],
  "Goblet Squat / Leg Press":    [{ph:"Ph1",kg:16},{ph:"Ph2",kg:20},{ph:"Ph3",kg:26},{ph:"Ph4",kg:32}],
  "Leg Extension Machine":       [{ph:"Ph1",kg:20},{ph:"Ph2",kg:30},{ph:"Ph3",kg:40},{ph:"Ph4",kg:50}],
  "Standing Leg Curl Machine":   [{ph:"Ph1",kg:15},{ph:"Ph2",kg:22},{ph:"Ph3",kg:30},{ph:"Ph4",kg:38}],
  "Romanian Deadlift (DB)":      [{ph:"Ph1",kg:18},{ph:"Ph2",kg:22},{ph:"Ph3",kg:28},{ph:"Ph4",kg:34}],
  "Standing Calf Raise":         [{ph:"Ph1",kg:0}, {ph:"Ph2",kg:20},{ph:"Ph3",kg:40},{ph:"Ph4",kg:60}],
  "Dips":                        [{ph:"Ph1",kg:0}, {ph:"Ph2",kg:0}, {ph:"Ph3",kg:5}, {ph:"Ph4",kg:10}],
  "Cable Straight Arm Pulldown": [{ph:"Ph1",kg:18},{ph:"Ph2",kg:24},{ph:"Ph3",kg:30},{ph:"Ph4",kg:36}],
};

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
const Card = ({children,style={}})=>(
  <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 15px",...style}}>{children}</div>
);
const SecLabel = ({children,style={}})=>(
  <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.14em",color:C.textDim,marginBottom:9,fontWeight:600,...style}}>{children}</div>
);
const Tag = ({label,color})=>(
  <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,fontWeight:700,letterSpacing:"0.05em",background:color+"22",color}}>{label}</span>
);
const Pill = ({children,active,color,onClick})=>(
  <button onClick={onClick} style={{background:active?C.bg2:"transparent",border:`1px solid ${active?color+"66":C.border}`,
    borderRadius:8,padding:"6px 12px",cursor:"pointer",color:active?color:C.textSec,fontSize:12,fontWeight:500}}>{children}</button>
);

// ── SPARKLINE ─────────────────────────────────────────────────────────────────
function Sparkline({data,color,target,targetColor,height=70}){
  if(!data||data.length<2)return null;
  const W=300,H=height;
  const vals=data.map(d=>d.y);
  const allV=target!=null?[...vals,target]:vals;
  const mn=Math.min(...allV)-1, mx=Math.max(...allV)+1;
  const px=(i)=>(i/(data.length-1))*W;
  const py=(v)=>H-((v-mn)/(mx-mn))*H;
  const pts=data.map((d,i)=>`${px(i)},${py(d.y)}`).join(" ");
  const id="g"+Math.random().toString(36).slice(2);
  return(
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
        <stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      <polygon points={`0,${py(data[0].y)} ${pts} ${W},${py(data[data.length-1].y)} ${W},${H} 0,${H}`} fill={`url(#${id})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {target!=null&&<line x1="0" y1={py(target)} x2={W} y2={py(target)} stroke={targetColor||"#39d353"} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6"/>}
      {data.map((d,i)=><circle key={i} cx={px(i)} cy={py(d.y)} r="4" fill={color} stroke={C.bg0} strokeWidth="2"/>)}
    </svg>
  );
}

// ── BAR CHART ─────────────────────────────────────────────────────────────────
function BarChart({data,color,maxVal}){
  if(!data||!data.length)return null;
  const W=300,H=80,barW=Math.max(8,W/data.length-4);
  const mx=maxVal||Math.max(...data.map(d=>d.y),1);
  return(
    <svg width="100%" viewBox={`0 0 ${W} ${H+20}`} style={{overflow:"visible"}}>
      {data.map((d,i)=>{
        const bh=Math.max(2,(d.y/mx)*H);
        const x=(i/data.length)*W+(W/data.length-barW)/2;
        return(
          <g key={i}>
            <rect x={x} y={H-bh} width={barW} height={bh} rx="3" fill={color} opacity="0.8"/>
            <text x={x+barW/2} y={H+14} textAnchor="middle" fontSize="8" fill={C.textDim}>{d.label}</text>
            {d.y>0&&<text x={x+barW/2} y={H-bh-4} textAnchor="middle" fontSize="9" fill={color}>{d.y}</text>}
          </g>
        );
      })}
    </svg>
  );
}

// ── SCHEDULE TAB ──────────────────────────────────────────────────────────────
const DEFAULT_CLASSES = [
  {id:1,day:"Monday",   start:"10:00",end:"13:00",label:"Classes"},
  {id:2,day:"Tuesday",  start:"09:30",end:"15:00",label:"Classes"},
  {id:3,day:"Wednesday",start:"08:00",end:"09:00",label:"Classes"},
];
const DEFAULT_SLEEP = {
  "Monday":   {wake:"08:00",bed:"00:00"},
  "Tuesday":  {wake:"08:00",bed:"00:00"},
  "Wednesday":{wake:"08:00",bed:"00:00"},
  "Thursday": {wake:"08:00",bed:"00:00"},
  "Friday":   {wake:"08:00",bed:"00:00"},
  "Saturday": {wake:"08:30",bed:"00:00"},
  "Sunday":   {wake:"08:30",bed:"00:00"},
};
const DAY_SESSIONS = {
  Monday:   [{icon:"🦵",label:"Morning Mobility",time:"After wake"},{icon:"🏋️",label:"Push Day (Gym)",time:"Before class"},{icon:"🏃",label:"Run — Garmin Coach",time:"After class"}],
  Tuesday:  [{icon:"🦵",label:"Morning Mobility",time:"After wake"},{icon:"🏋️",label:"Pull Day (Gym)",time:"Before campus"}],
  Wednesday:[{icon:"🦵",label:"Morning Mobility",time:"After wake"},{icon:"🏋️",label:"Legs Day (Gym)",time:"After class"},{icon:"🏃",label:"Run — Garmin Coach",time:"Evening"}],
  Thursday: [{icon:"🦵",label:"Morning Mobility",time:"After wake"},{icon:"🏃",label:"Run — Garmin Coach",time:"Morning"}],
  Friday:   [{icon:"🦵",label:"Morning Mobility",time:"After wake"},{icon:"🏋️",label:"Push Day B",time:"Morning"},{icon:"🌊",label:"Surf (if conditions good)",time:"Any time"}],
  Saturday: [{icon:"🦵",label:"Morning Mobility",time:"After wake"},{icon:"🏋️",label:"Pull Day B",time:"Morning"},{icon:"🌊",label:"Surf (if conditions good)",time:"Any time"}],
  Sunday:   [{icon:"🦵",label:"Morning Mobility",time:"After wake"},{icon:"🚶",label:"Rest / Easy Walk",time:"Any time"},{icon:"🌊",label:"Surf (if conditions good)",time:"Any time"}],
};
const DAYS_ORDER=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

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

  const tick=(key)=>{
    const updated={...ticked,[key]:!ticked[key]};
    setTicked(updated); LS.set("ticked_sessions",updated);
  };

  const saveClass=()=>{
    if(editingClass){
      const upd=classes.map(c=>c.id===editingClass.id?editingClass:c);
      setClasses(upd); LS.set("classes",upd); setEditingClass(null);
    } else {
      const upd=[...classes,{...newClass,id:Date.now()}];
      setClasses(upd); LS.set("classes",upd); setShowClassForm(false);
      setNewClass({day:"Monday",start:"",end:"",label:"Classes"});
    }
  };
  const delClass=(id)=>{ const upd=classes.filter(c=>c.id!==id); setClasses(upd); LS.set("classes",upd); };
  const updateSleep=(day,field,val)=>{
    const upd={...sleep,[day]:{...sleep[day],[field]:val}};
    setSleep(upd); LS.set("sleep_times",upd);
  };

  return(
    <div>
      {/* Day pills */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {DAYS_ORDER.map(d=>(
          <Pill key={d} active={activeDay===d} color={C.accent} onClick={()=>setActiveDay(d)}>{d.slice(0,3)}</Pill>
        ))}
      </div>

      {/* Sleep card */}
      <Card style={{marginBottom:12,background:C.bg2}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:16,fontWeight:700,color:C.textPrimary}}>{activeDay}</div>
          <button onClick={()=>setEditingSleep(!editingSleep)} style={{fontSize:11,background:"none",border:`1px solid ${C.border}`,
            borderRadius:6,padding:"4px 10px",color:C.textSec,cursor:"pointer"}}>
            {editingSleep?"Done":"Edit Sleep"}
          </button>
        </div>
        {editingSleep?(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {["wake","bed"].map(f=>(
              <div key={f}>
                <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>{f==="wake"?"☀️ Wake":"🌙 Bed"}</div>
                <input type="time" value={sleep[activeDay]?.[f]||""} onChange={e=>updateSleep(activeDay,f,e.target.value)}
                  style={{width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,
                    color:C.textPrimary,padding:"7px 10px",fontSize:13,boxSizing:"border-box"}}/>
              </div>
            ))}
          </div>
        ):(
          <div style={{display:"flex",gap:20}}>
            <span style={{fontSize:13,color:C.textSec}}>☀️ Wake <b style={{color:C.textPrimary}}>{sl.wake}</b></span>
            <span style={{fontSize:13,color:C.textSec}}>🌙 Bed <b style={{color:C.textPrimary}}>{sl.bed}</b></span>
          </div>
        )}
      </Card>

      {/* Sessions */}
      <SecLabel>Sessions</SecLabel>
      <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:14}}>
        {daySessions.map((s,i)=>{
          const key=`${activeDay}_sess_${i}`;
          const done=ticked[key];
          return(
            <Card key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",
              opacity:done?0.55:1,borderColor:done?C.pull+"55":C.border}}>
              <span style={{fontSize:18}}>{s.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:C.textDim}}>{s.time}</div>
                <div style={{fontSize:13,fontWeight:500,color:done?C.textSec:C.textPrimary,
                  textDecoration:done?"line-through":"none"}}>{s.label}</div>
              </div>
              <button onClick={()=>tick(key)} style={{width:26,height:26,borderRadius:6,cursor:"pointer",
                background:done?C.pull+"33":"transparent",border:`2px solid ${done?C.pull:C.border}`,
                color:done?C.pull:C.textDim,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {done?"✓":""}
              </button>
            </Card>
          );
        })}
      </div>

      {/* Classes */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <SecLabel style={{margin:0}}>Classes</SecLabel>
        <button onClick={()=>setShowClassForm(!showClassForm)} style={{fontSize:11,background:"none",
          border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",color:C.accent,cursor:"pointer"}}>
          + Add Class
        </button>
      </div>

      {(showClassForm||editingClass)&&(
        <Card style={{marginBottom:12}}>
          <SecLabel>{editingClass?"Edit Class":"New Class"}</SecLabel>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div>
              <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Day</div>
              <select value={editingClass?editingClass.day:newClass.day}
                onChange={e=>editingClass?setEditingClass({...editingClass,day:e.target.value}):setNewClass({...newClass,day:e.target.value})}
                style={{width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,
                  color:C.textPrimary,padding:"7px 8px",fontSize:12}}>
                {DAYS_ORDER.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Label</div>
              <input value={editingClass?editingClass.label:newClass.label}
                onChange={e=>editingClass?setEditingClass({...editingClass,label:e.target.value}):setNewClass({...newClass,label:e.target.value})}
                style={{width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,
                  color:C.textPrimary,padding:"7px 8px",fontSize:12,boxSizing:"border-box"}}/>
            </div>
            <div>
              <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Start</div>
              <input type="time" value={editingClass?editingClass.start:newClass.start}
                onChange={e=>editingClass?setEditingClass({...editingClass,start:e.target.value}):setNewClass({...newClass,start:e.target.value})}
                style={{width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,
                  color:C.textPrimary,padding:"7px 8px",fontSize:12,boxSizing:"border-box"}}/>
            </div>
            <div>
              <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>End</div>
              <input type="time" value={editingClass?editingClass.end:newClass.end}
                onChange={e=>editingClass?setEditingClass({...editingClass,end:e.target.value}):setNewClass({...newClass,end:e.target.value})}
                style={{width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,
                  color:C.textPrimary,padding:"7px 8px",fontSize:12,boxSizing:"border-box"}}/>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={saveClass} style={{flex:1,padding:"9px",borderRadius:7,border:"none",
              background:C.accent,color:C.bg0,fontSize:13,fontWeight:700,cursor:"pointer"}}>Save</button>
            <button onClick={()=>{setEditingClass(null);setShowClassForm(false);}} style={{padding:"9px 16px",
              borderRadius:7,border:`1px solid ${C.border}`,background:"none",color:C.textSec,cursor:"pointer"}}>Cancel</button>
          </div>
        </Card>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:14}}>
        {dayClasses.length===0&&<div style={{fontSize:13,color:C.textDim,padding:"10px 0"}}>No classes on {activeDay}.</div>}
        {dayClasses.map(c=>{
          const key=`class_${c.id}`;
          const done=ticked[key];
          return(
            <Card key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
              opacity:done?0.55:1,borderColor:done?C.pull+"55":C.border}}>
              <span style={{fontSize:18}}>🎓</span>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:C.textDim}}>{c.start}–{c.end}</div>
                <div style={{fontSize:13,fontWeight:500,color:done?C.textSec:C.textPrimary,
                  textDecoration:done?"line-through":"none"}}>{c.label}</div>
              </div>
              <button onClick={()=>setEditingClass(c)} style={{background:"none",border:"none",color:C.textDim,fontSize:12,cursor:"pointer"}}>✎</button>
              <button onClick={()=>delClass(c.id)} style={{background:"none",border:"none",color:C.textDim,fontSize:16,cursor:"pointer"}}>×</button>
              <button onClick={()=>tick(key)} style={{width:26,height:26,borderRadius:6,cursor:"pointer",
                background:done?C.pull+"33":"transparent",border:`2px solid ${done?C.pull:C.border}`,
                color:done?C.pull:C.textDim,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {done?"✓":""}
              </button>
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
  const tick=(key)=>{
    const upd={...ticked,[key]:!ticked[key]};
    setTicked(upd); LS.set("mobility_ticked",upd);
  };
  const resetDay=()=>{
    const upd={...ticked};
    area.exercises.forEach((_,i)=>delete upd[`${active}_${i}`]);
    setTicked(upd); LS.set("mobility_ticked",upd);
  };
  const done=area.exercises.filter((_,i)=>ticked[`${active}_${i}`]).length;
  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[
          {key:"ankle",label:"🦶 Ankle",color:C.accent},
          {key:"hip",  label:"🍑 Hip",  color:C.flex},
          {key:"spine",label:"🦴 Spine",color:C.legs},
        ].map(a=>(
          <Pill key={a.key} active={active===a.key} color={a.color} onClick={()=>setActive(a.key)}>{a.label}</Pill>
        ))}
      </div>
      <Card style={{marginBottom:14,background:C.bg2,borderLeft:`3px solid ${area.color}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:C.textPrimary}}>{area.icon} {active.charAt(0).toUpperCase()+active.slice(1)} Mobility</div>
            <div style={{fontSize:12,color:C.textSec,marginTop:2}}>{done}/{area.exercises.length} done today</div>
          </div>
          <button onClick={resetDay} style={{fontSize:11,background:"none",border:`1px solid ${C.border}`,
            borderRadius:6,padding:"4px 10px",color:C.textDim,cursor:"pointer"}}>Reset</button>
        </div>
        <div style={{background:C.border,borderRadius:99,height:4,marginTop:10,overflow:"hidden"}}>
          <div style={{width:`${(done/area.exercises.length)*100}%`,height:"100%",background:area.color,borderRadius:99,transition:"width 0.3s"}}/>
        </div>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {area.exercises.map((ex,i)=>{
          const key=`${active}_${i}`;
          const isDone=ticked[key];
          return(
            <Card key={i} style={{opacity:isDone?0.5:1,borderColor:isDone?area.color+"44":C.border}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <button onClick={()=>tick(key)} style={{width:28,height:28,borderRadius:7,cursor:"pointer",flexShrink:0,
                  background:isDone?area.color+"33":"transparent",border:`2px solid ${isDone?area.color:C.border}`,
                  color:isDone?area.color:C.textDim,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
                  {isDone?"✓":""}
                </button>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:4}}>
                    <div style={{fontSize:13,fontWeight:600,color:isDone?C.textSec:C.textPrimary,
                      textDecoration:isDone?"line-through":"none"}}>{ex.name}</div>
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

// ── GYM PLANS TAB ─────────────────────────────────────────────────────────────
function GymTab(){
  const [active,setActive]=useState("Push Day");
  const [liftLogs,setLiftLogs]=useState(()=>LS.get("lift_logs",{}));
  const [logEx,setLogEx]=useState(null);
  const [form,setForm]=useState({date:todayStr(),weight:"",sets:"",reps:""});
  const plan=GYM_PLANS[active];

  const saveLog=()=>{
    if(!form.weight||!logEx)return;
    const entry={date:form.date,weight:parseFloat(form.weight),sets:form.sets,reps:form.reps,id:Date.now()};
    const upd={...liftLogs,[logEx]:[...(liftLogs[logEx]||[]),entry]};
    setLiftLogs(upd); LS.set("lift_logs",upd);
    setLogEx(null); setForm({date:todayStr(),weight:"",sets:"",reps:""});
  };

  const getLatest=(name)=>{
    const entries=liftLogs[name]||[];
    if(!entries.length)return null;
    return [...entries].sort((a,b)=>b.date.localeCompare(a.date))[0];
  };

  return(
    <div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {Object.keys(GYM_PLANS).map(p=>(
          <Pill key={p} active={active===p} color={plan.color} onClick={()=>{setActive(p);setLogEx(null);}}>{p}</Pill>
        ))}
      </div>
      <Card style={{marginBottom:14,background:C.bg2,borderLeft:`3px solid ${plan.color}`}}>
        <div style={{fontSize:16,fontWeight:700,color:C.textPrimary}}>{active}</div>
        <div style={{fontSize:12,color:C.textSec,marginTop:2}}>{plan.muscles}</div>
      </Card>

      {logEx&&(
        <Card style={{marginBottom:14,border:`1px solid ${plan.color}44`}}>
          <SecLabel>Log — {logEx}</SecLabel>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:10}}>
            {[{l:"Date",f:"date",t:"date",p:""},{l:"kg",f:"weight",t:"number",p:"e.g. 50"},{l:"Sets",f:"sets",t:"number",p:"3"},{l:"Reps",f:"reps",t:"number",p:"10"}].map(x=>(
              <div key={x.f}>
                <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>{x.l}</div>
                <input type={x.t} value={form[x.f]} placeholder={x.p} onChange={e=>setForm({...form,[x.f]:e.target.value})}
                  style={{width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,
                    color:C.textPrimary,padding:"7px 8px",fontSize:12,boxSizing:"border-box"}}/>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={saveLog} style={{flex:1,padding:"9px",borderRadius:7,border:"none",
              background:plan.color,color:C.bg0,fontSize:13,fontWeight:700,cursor:"pointer"}}>Save</button>
            <button onClick={()=>setLogEx(null)} style={{padding:"9px 14px",borderRadius:7,
              border:`1px solid ${C.border}`,background:"none",color:C.textSec,cursor:"pointer"}}>Cancel</button>
          </div>
        </Card>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {plan.exercises.map((ex,i)=>{
          const latest=getLatest(ex.name);
          const targets=LIFT_TARGETS[ex.name]||[];
          const next=targets.find(t=>!latest||t.kg>latest.weight);
          return(
            <Card key={i}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:6}}>
                <div style={{fontSize:13,fontWeight:600,color:C.textPrimary}}>
                  <span style={{color:plan.color,fontSize:11,marginRight:7,fontWeight:700}}>{String(i+1).padStart(2,"0")}</span>{ex.name}
                </div>
                <Tag label={ex.sets} color={plan.color}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
                <div>
                  <div style={{fontSize:11,color:C.textDim}}>Target weight</div>
                  <div style={{fontSize:12,color:C.textSec}}>{ex.weight}</div>
                </div>
                {latest&&(
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:11,color:C.textDim}}>Last logged</div>
                    <div style={{fontSize:13,fontWeight:700,color:plan.color}}>{latest.weight}kg <span style={{fontSize:10,color:C.textDim,fontWeight:400}}>{latest.sets||"?"}×{latest.reps||"?"}</span></div>
                  </div>
                )}
                {next&&(
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11,color:C.textDim}}>Next target</div>
                    <div style={{fontSize:13,fontWeight:700,color:C.legs}}>{next.kg}kg <Tag label={next.ph} color={C.legs}/></div>
                  </div>
                )}
              </div>
              {ex.note&&<div style={{fontSize:11,color:C.textDim,marginTop:6,fontStyle:"italic"}}>💡 {ex.note}</div>}
              <button onClick={()=>{setLogEx(ex.name);setForm({date:todayStr(),weight:latest?String(latest.weight):"",sets:latest?String(latest.sets):"",reps:latest?String(latest.reps):"",});}}
                style={{marginTop:10,width:"100%",padding:"8px",borderRadius:7,cursor:"pointer",
                  background:plan.color+"18",border:`1px solid ${plan.color}44`,color:plan.color,fontSize:12,fontWeight:600}}>
                {latest?"+ Log New Set":"+ Log First Set"}
              </button>
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

  const save=()=>{
    if(!form.date)return;
    const upd=[{...form,id:Date.now()},...sessions];
    setSessions(upd); LS.set("tracker_sessions",upd);
    setShowForm(false); setForm({date:todayStr(),type:"gym",subtype:"Push Day",notes:"",surfHours:""});
  };
  const del=(id)=>{const upd=sessions.filter(s=>s.id!==id);setSessions(upd);LS.set("tracker_sessions",upd);};

  const typeColor={gym:C.push,run:C.run,surf:C.surf};
  const typeIcon={gym:"🏋️",run:"🏃",surf:"🌊"};

  return(
    <div>
      {/* This week pills */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
        {[
          {label:"Gym",val:gymC,target:4,color:C.push},
          {label:"Runs",val:runC,target:3,color:C.run},
          {label:"Surfs",val:surfC,target:"–",color:C.surf,sub:surfH>0?`${surfH}h in water`:null},
        ].map((s,i)=>(
          <div key={i} style={{background:C.bg2,border:`1px solid ${s.color}33`,borderRadius:12,padding:"13px 10px",textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:700,color:s.color}}>{s.val}</div>
            <div style={{fontSize:11,color:C.textSec,marginTop:1}}>{s.label}</div>
            {s.target!=="–"&&<div style={{fontSize:10,color:gymC>=4&&s.label==="Gym"?C.pull:runC>=3&&s.label==="Runs"?C.pull:C.textDim,marginTop:2}}>of {s.target}</div>}
            {s.sub&&<div style={{fontSize:10,color:C.surf,marginTop:2}}>{s.sub}</div>}
          </div>
        ))}
      </div>

      <button onClick={()=>setShowForm(!showForm)} style={{width:"100%",padding:"12px",borderRadius:10,
        border:`1px solid ${C.accent}44`,background:showForm?C.bg2:C.accent+"18",
        color:C.accent,fontSize:14,fontWeight:600,cursor:"pointer",marginBottom:14}}>
        {showForm?"Cancel":"+ Log a Session"}
      </button>

      {showForm&&(
        <Card style={{marginBottom:14}}>
          <SecLabel>New Session</SecLabel>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div>
              <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Date</div>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}
                style={{width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,
                  color:C.textPrimary,padding:"7px 8px",fontSize:12,boxSizing:"border-box"}}/>
            </div>
            <div>
              <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Type</div>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value,subtype:e.target.value==="gym"?"Push Day":""})}
                style={{width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,
                  color:C.textPrimary,padding:"7px 8px",fontSize:12}}>
                <option value="gym">Gym</option>
                <option value="run">Run</option>
                <option value="surf">Surf</option>
              </select>
            </div>
          </div>
          {form.type==="gym"&&(
            <div style={{marginBottom:8}}>
              <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Session</div>
              <select value={form.subtype} onChange={e=>setForm({...form,subtype:e.target.value})}
                style={{width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,
                  color:C.textPrimary,padding:"7px 8px",fontSize:12}}>
                {["Push Day","Pull Day","Legs Day","Push Day B","Pull Day B"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          )}
          {form.type==="surf"&&(
            <div style={{marginBottom:8}}>
              <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Hours in water</div>
              <input type="number" step="0.5" min="0.5" max="8" value={form.surfHours} placeholder="e.g. 2"
                onChange={e=>setForm({...form,surfHours:e.target.value})}
                style={{width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,
                  color:C.textPrimary,padding:"7px 8px",fontSize:12,boxSizing:"border-box"}}/>
            </div>
          )}
          <div style={{marginBottom:10}}>
            <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Notes (optional)</div>
            <input value={form.notes} placeholder="How did it go? Any PRs?" onChange={e=>setForm({...form,notes:e.target.value})}
              style={{width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,
                color:C.textPrimary,padding:"7px 8px",fontSize:12,boxSizing:"border-box"}}/>
          </div>
          <button onClick={save} style={{width:"100%",padding:"10px",borderRadius:7,border:"none",
            background:C.accent,color:C.bg0,fontSize:13,fontWeight:700,cursor:"pointer"}}>Save</button>
        </Card>
      )}

      <SecLabel>This Week's Log</SecLabel>
      {thisWeek.length===0&&<div style={{fontSize:13,color:C.textDim,padding:"16px 0",textAlign:"center"}}>Nothing logged this week yet.</div>}
      <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:20}}>
        {sessions.slice(0,40).map(s=>(
          <div key={s.id} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:9,
            padding:"10px 13px",display:"flex",alignItems:"center",gap:10}}>
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
  const [val,setVal]=useState("");
  const [date,setDate]=useState(todayStr());
  const sorted=[...entries].sort((a,b)=>a.date.localeCompare(b.date));
  const latest=sorted.length?sorted[sorted.length-1].weight:null;
  const start=80,target=74;
  const lost=latest?(start-latest).toFixed(1):0;
  const toGo=latest?Math.max(0,latest-target).toFixed(1):(start-target);
  const pct=latest?Math.min(100,Math.round(((start-latest)/(start-target))*100)):0;
  const add=()=>{
    if(!val||isNaN(parseFloat(val)))return;
    const upd=[...entries,{date,weight:parseFloat(val),id:Date.now()}].sort((a,b)=>a.date.localeCompare(b.date));
    setEntries(upd); LS.set("weight_entries",upd); setVal("");
  };
  const del=(id)=>{const upd=entries.filter(e=>e.id!==id);setEntries(upd);LS.set("weight_entries",upd);};
  const chartData=sorted.map(e=>({y:e.weight,label:fmt(e.date)}));
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
        {[{l:"Current",v:latest?`${latest}kg`:"—",c:C.weight},{l:"Lost",v:lost>0?`-${lost}kg`:"—",c:C.pull},{l:"To go",v:`${toGo}kg`,c:C.legs}].map((s,i)=>(
          <div key={i} style={{background:C.bg2,border:`1px solid ${s.c}33`,borderRadius:12,padding:"13px 10px",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:700,color:s.c}}>{s.v}</div>
            <div style={{fontSize:11,color:C.textSec,marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>
      <Card style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
          <span style={{fontSize:12,color:C.textSec}}>80kg → 74kg</span>
          <span style={{fontSize:12,fontWeight:700,color:C.pull}}>{pct}%</span>
        </div>
        <div style={{background:C.bg0,borderRadius:99,height:7,overflow:"hidden"}}>
          <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${C.weight},${C.pull})`,borderRadius:99,transition:"width 0.5s"}}/>
        </div>
      </Card>
      {sorted.length>=2&&(
        <Card style={{marginBottom:14}}>
          <SecLabel>Weight Trend</SecLabel>
          <Sparkline data={chartData} color={C.weight} target={target} targetColor={C.pull}/>
          <div style={{display:"flex",gap:14,marginTop:8}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:14,height:2,background:C.weight,borderRadius:2}}/><span style={{fontSize:10,color:C.textSec}}>Weight</span></div>
            <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:14,height:2,background:C.pull,borderRadius:2,opacity:.6}}/><span style={{fontSize:10,color:C.textSec}}>74kg target</span></div>
          </div>
        </Card>
      )}
      <Card style={{marginBottom:14}}>
        <SecLabel>Log Weight</SecLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,alignItems:"end"}}>
          <div>
            <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Date</div>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)}
              style={{width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,
                color:C.textPrimary,padding:"7px 8px",fontSize:12,boxSizing:"border-box"}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>Weight (kg)</div>
            <input type="number" step="0.1" value={val} placeholder="78.5"
              onChange={e=>setVal(e.target.value)}
              style={{width:"100%",background:C.bg0,border:`1px solid ${C.border}`,borderRadius:7,
                color:C.textPrimary,padding:"7px 8px",fontSize:12,boxSizing:"border-box"}}/>
          </div>
          <button onClick={add} style={{background:C.weight,color:C.bg0,border:"none",borderRadius:7,
            padding:"9px 14px",fontSize:14,fontWeight:700,cursor:"pointer"}}>+</button>
        </div>
      </Card>
      <SecLabel>History</SecLabel>
      {sorted.length===0&&<div style={{fontSize:13,color:C.textDim,padding:"16px 0",textAlign:"center"}}>No entries yet.</div>}
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {[...sorted].reverse().slice(0,20).map(e=>(
          <div key={e.id} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:8,
            padding:"9px 13px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:12,color:C.textSec}}>{fmt(e.date)}</span>
            <span style={{fontSize:15,fontWeight:700,color:C.weight}}>{e.weight} kg</span>
            <button onClick={()=>del(e.id)} style={{background:"none",border:"none",color:C.textDim,fontSize:16,cursor:"pointer"}}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── HISTORY TAB ───────────────────────────────────────────────────────────────
function HistoryTab(){
  const sessions=LS.get("tracker_sessions",[]);

  // Group by week
  const byWeek={};
  sessions.forEach(s=>{
    const k=weekKey(new Date(s.date+"T12:00:00"));
    if(!byWeek[k])byWeek[k]={gym:0,run:0,surf:0,surfH:0};
    if(s.type==="gym")byWeek[k].gym++;
    else if(s.type==="run")byWeek[k].run++;
    else if(s.type==="surf"){byWeek[k].surf++;byWeek[k].surfH+=parseFloat(s.surfHours)||0;}
  });
  const weeks=Object.keys(byWeek).sort();

  if(weeks.length===0)return(
    <div style={{textAlign:"center",color:C.textDim,fontSize:13,padding:"40px 0"}}>
      Log some sessions first and your weekly history will appear here.
    </div>
  );

  const last8=weeks.slice(-8);
  const labels=last8.map(w=>{const d=new Date(w+"T12:00:00");return`${d.getDate()}/${d.getMonth()+1}`;});
  const gymData=last8.map((w,i)=>({y:byWeek[w].gym,label:labels[i]}));
  const runData=last8.map((w,i)=>({y:byWeek[w].run,label:labels[i]}));
  const surfData=last8.map((w,i)=>({y:byWeek[w].surf,label:labels[i]}));
  const surfHData=last8.map((w,i)=>({y:parseFloat(byWeek[w].surfH.toFixed(1)),label:labels[i]}));

  return(
    <div>
      <div style={{fontSize:13,color:C.textSec,marginBottom:16,lineHeight:1.6}}>
        Weekly tallies reset automatically. This tab stores your history so you can track consistency over time.
      </div>

      {[
        {label:"Gym Sessions / Week",data:gymData,color:C.push,target:4},
        {label:"Runs / Week",        data:runData,color:C.run, target:3},
        {label:"Surf Sessions / Week",data:surfData,color:C.surf},
        {label:"Surf Hours / Week",   data:surfHData,color:C.accent},
      ].map((chart,i)=>(
        <Card key={i} style={{marginBottom:14}}>
          <SecLabel>{chart.label}</SecLabel>
          <BarChart data={chart.data} color={chart.color} maxVal={chart.target?Math.max(chart.target,...chart.data.map(d=>d.y)):undefined}/>
          {chart.target&&(
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
              <div style={{width:16,height:2,borderTop:`2px dashed ${C.pull}`,opacity:.6}}/>
              <span style={{fontSize:10,color:C.textDim}}>Target: {chart.target}/week</span>
            </div>
          )}
        </Card>
      ))}

      {/* Weekly breakdown table */}
      <SecLabel style={{marginTop:8}}>Week-by-Week Breakdown</SecLabel>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[...weeks].reverse().map(w=>{
          const wk=byWeek[w];
          return(
            <Card key={w} style={{padding:"11px 14px"}}>
              <div style={{fontSize:12,fontWeight:700,color:C.textPrimary,marginBottom:7}}>{weekLabel(w)}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
                {[
                  {l:"Gym",v:wk.gym,c:C.push},
                  {l:"Runs",v:wk.run,c:C.run},
                  {l:"Surfs",v:wk.surf,c:C.surf},
                  {l:"Surf hrs",v:wk.surfH.toFixed(1),c:C.accent},
                ].map((s,i)=>(
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
  {key:"schedule",label:"Schedule", icon:"📅"},
  {key:"mobility",label:"Mobility", icon:"🦵"},
  {key:"gym",     label:"Gym",      icon:"🏋️"},
  {key:"log",     label:"Log",      icon:"✅"},
  {key:"weight",  label:"Weight",   icon:"⚖️"},
  {key:"history", label:"History",  icon:"📊"},
];

export default function App(){
  const [tab,setTab]=useState("schedule");
  return(
    <div style={{minHeight:"100vh",background:C.bg0,color:C.textPrimary,
      fontFamily:"'DM Sans','Helvetica Neue',sans-serif",paddingBottom:80}}>
      <div style={{background:"linear-gradient(135deg,#04111f 0%,#020a16 100%)",
        borderBottom:`1px solid ${C.border}`,padding:"22px 18px 16px"}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <div style={{fontSize:10,letterSpacing:"0.2em",color:C.textDim,textTransform:"uppercase",marginBottom:4}}>Training Program</div>
          <h1 style={{margin:0,fontSize:22,fontWeight:700,letterSpacing:"-0.02em",color:C.textPrimary}}>Estian's Dashboard</h1>
          <p style={{margin:"4px 0 0",fontSize:12,color:C.textSec}}>Strength · Aesthetics · Running · Surfing</p>
        </div>
      </div>
      <div style={{background:"#050d1a",borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:10}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",overflowX:"auto"}}>
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)} style={{background:"none",border:"none",
              cursor:"pointer",flexShrink:0,padding:"11px 13px",fontSize:12,fontWeight:500,
              color:tab===t.key?C.textPrimary:C.textSec,
              borderBottom:tab===t.key?`2px solid ${C.accent}`:"2px solid transparent"}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{maxWidth:720,margin:"0 auto",padding:"18px 13px"}}>
        {tab==="schedule"&&<ScheduleTab/>}
        {tab==="mobility"&&<MobilityTab/>}
        {tab==="gym"&&<GymTab/>}
        {tab==="log"&&<LogTab/>}
        {tab==="weight"&&<WeightTab/>}
        {tab==="history"&&<HistoryTab/>}
      </div>
    </div>
  );
}
