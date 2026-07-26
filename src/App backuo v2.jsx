import { useState, useEffect } from "react";

// ── DATA ─────────────────────────────────────────────────────────────────────

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const schedule = {
  Monday:    { wake:"06:00", bed:"22:00", type:"Push Day",         tag:"PUSH", tagColor:"#ff6b35", sessions:[{time:"06:15–06:50",label:"Mobility: Ankle · Hip · Thoracic Spine + Single-Leg Balance Drills",icon:"🦵"},{time:"07:00–08:15",label:"Push Day (Gym)",icon:"🏋️"},{time:"Classes",label:"14:00–16:00 → Commute home ~16:30",icon:"🎓"},{time:"18:30–19:15",label:"Run — Garmin Coach",icon:"🏃"}], meals:[{time:"06:00",label:"Pre-workout snack",detail:"Banana + black coffee or oats"},{time:"08:30",label:"Post-workout breakfast",detail:"Eggs + toast + fruit"},{time:"12:30",label:"Lunch",detail:"Protein + complex carbs + veg"},{time:"16:45",label:"Post-class snack",detail:"Greek yoghurt + nuts or rice cakes + PB"},{time:"19:30",label:"Dinner",detail:"Lean protein + veg + light carbs"}], note:"Gym before class. Run after class once home. Avoid heavy carbs before afternoon class. Surf = Zone 2 — skip run on surf days." },
  Tuesday:   { wake:"06:00", bed:"22:00", type:"Pull Day",         tag:"PULL", tagColor:"#39d353", sessions:[{time:"06:15–06:50",label:"Mobility: Ankle · Hip · Thoracic Spine + Single-Leg Balance Drills",icon:"🦵"},{time:"07:00–08:15",label:"Pull Day (Gym)",icon:"🏋️"},{time:"Classes",label:"10:00–15:00 → Commute home ~15:30",icon:"🎓"},{time:"16:00–16:45",label:"Rest or Walk (ankle recovery)",icon:"🚶"}], meals:[{time:"06:00",label:"Pre-workout snack",detail:"Banana or oats"},{time:"08:30",label:"Post-workout breakfast",detail:"Eggs + toast + fruit"},{time:"10:00",label:"Light snack before classes",detail:"Fruit or handful of nuts"},{time:"12:30",label:"Lunch",detail:"Protein + complex carbs + veg"},{time:"16:00",label:"Post-class snack",detail:"Greek yoghurt + fruit"},{time:"19:00",label:"Dinner",detail:"Lean protein + veg + light carbs"}], note:"Long class day — gym first thing. Eat a proper lunch mid-morning. No evening run; recovery walk is enough." },
  Wednesday: { wake:"06:30", bed:"22:00", type:"Legs Day",         tag:"LEGS", tagColor:"#f5c518", sessions:[{time:"06:45–07:20",label:"Mobility: Ankle · Hip · Thoracic Spine + Single-Leg Balance Drills",icon:"🦵"},{time:"Classes",label:"09:00–10:00, then 12:00–13:00",icon:"🎓"},{time:"10:15–11:30",label:"Leg Day (Gym)",icon:"🏋️"},{time:"18:30–19:15",label:"Run — Garmin Coach",icon:"🏃"}], meals:[{time:"06:30",label:"Light breakfast",detail:"Oats + banana"},{time:"11:45",label:"Post-gym lunch",detail:"Protein + carbs + veg — eat before 12:00 class"},{time:"14:00",label:"Afternoon snack",detail:"Nuts + fruit or rice cakes + PB"},{time:"19:30",label:"Dinner",detail:"Lean protein + veg + carbs to replenish leg day"}], note:"Gym in gap between classes. Leave campus at 10:00, gym 10:15–11:30, eat, return for 12:00 class." },
  Thursday:  { wake:"06:30", bed:"22:00", type:"Rest / Run",       tag:"RUN",  tagColor:"#c084fc", sessions:[{time:"06:45–07:20",label:"Mobility: Ankle · Hip · Thoracic Spine + Single-Leg Balance Drills",icon:"🦵"},{time:"07:30–08:15",label:"Run — Garmin Coach",icon:"🏃"},{time:"Classes",label:"12:00–14:00 → Commute home ~14:30",icon:"🎓"},{time:"15:00–15:30",label:"Light walk / active recovery",icon:"🚶"}], meals:[{time:"06:30",label:"Pre-run snack",detail:"Banana or small bowl of oats"},{time:"08:30",label:"Breakfast",detail:"Eggs + toast + fruit"},{time:"11:30",label:"Pre-class lunch",detail:"Eat before class to avoid crash mid-lecture"},{time:"15:00",label:"Post-class snack",detail:"Protein shake or yoghurt + nuts"},{time:"19:00",label:"Dinner",detail:"Lean protein + veg + moderate carbs"}], note:"No gym — run + recovery day. Surf counts as Zone 2 on good swell days." },
  Friday:    { wake:"07:00", bed:"23:00", type:"Push Day B / Surf", tag:"FLEX", tagColor:"#f472b6", sessions:[{time:"07:15–07:50",label:"Mobility: Ankle · Hip · Thoracic Spine + Single-Leg Balance Drills",icon:"🦵"},{time:"08:00–09:15",label:"Push Day B (Gym)",icon:"🏋️"},{time:"OR",label:"Surf if conditions are good 🏄 — skip gym",icon:"🌊"},{time:"19:00–19:45",label:"Run — Garmin Coach (if no surf)",icon:"🏃"}], meals:[{time:"07:00",label:"Pre-workout snack",detail:"Banana + coffee"},{time:"09:30",label:"Breakfast",detail:"Eggs + toast or smoothie bowl"},{time:"13:00",label:"Lunch",detail:"Protein + carbs + veg"},{time:"17:00",label:"Snack",detail:"Fruit + nuts"},{time:"19:30",label:"Dinner",detail:"Protein + veg + carbs"}], note:"Surf takes priority. If you surf, skip gym and run — that's a full session." },
  Saturday:  { wake:"07:00", bed:"23:00", type:"Pull Day B / Surf", tag:"FLEX", tagColor:"#f472b6", sessions:[{time:"07:15–07:50",label:"Mobility: Ankle · Hip · Thoracic Spine + Single-Leg Balance Drills",icon:"🦵"},{time:"08:00–09:15",label:"Pull Day B (Gym)",icon:"🏋️"},{time:"OR",label:"Surf if conditions are good 🏄 — skip gym",icon:"🌊"},{time:"17:00–17:45",label:"Run — Garmin Coach (if energy allows)",icon:"🏃"}], meals:[{time:"07:00",label:"Pre-workout snack",detail:"Banana + coffee"},{time:"09:30",label:"Breakfast",detail:"Eggs + toast + fruit"},{time:"13:00",label:"Lunch",detail:"Protein + carbs + veg"},{time:"17:00",label:"Snack",detail:"Protein shake or yoghurt"},{time:"19:30",label:"Dinner",detail:"Hearty protein + veg + carbs"}], note:"Same surf logic as Friday. If surf: rest from gym. Run only if legs feel good." },
  Sunday:    { wake:"07:30", bed:"22:00", type:"Rest / Recovery",  tag:"REST", tagColor:"#94a3b8", sessions:[{time:"07:45–08:20",label:"Mobility: Ankle · Hip · Thoracic Spine + Single-Leg Balance Drills",icon:"🦵"},{time:"08:30–09:00",label:"Light walk or easy jog (optional)",icon:"🚶"},{time:"OR",label:"Surf if conditions are good 🏄",icon:"🌊"}], meals:[{time:"08:00",label:"Relaxed breakfast",detail:"Whatever you enjoy — fuel well for the week ahead"},{time:"13:00",label:"Lunch",detail:"Balanced meal — protein + carbs + veg"},{time:"18:00",label:"Early dinner",detail:"Light and nutritious — early bedtime tonight"}], note:"True rest day. Full mobility + balance work, easy movement only. Early bed to reset sleep cycle." },
};

const gymPlans = {
  "Push Day":   { color:"#ff6b35", muscles:"Chest · Shoulders · Triceps", exercises:[{name:"Incline Barbell Bench Press",sets:"1 warm-up + 4×10",weight:"Start ~45kg, progress weekly",note:"Control the eccentric (3s down)"},{name:"Flat Dumbbell Bench Press",sets:"3×10",weight:"20kg/hand → aim for 22.5kg",note:"Full range of motion, pause at bottom"},{name:"Seated Dumbbell Shoulder Press",sets:"3×10",weight:"10kg → 12kg",note:"Don't flare elbows too wide"},{name:"Lateral Raises",sets:"4×15",weight:"6–8kg",note:"Slow and controlled, slight lean forward"},{name:"Cable Tricep Pushdown (rope)",sets:"3×12",weight:"~24–28kg",note:"Flare hands at bottom of rep"},{name:"Overhead DB Tricep Extension",sets:"3×12",weight:"12–16kg",note:"New addition — great for long head"}] },
  "Push Day B": { color:"#ff6b35", muscles:"Chest · Shoulders · Triceps", exercises:[{name:"Smith Machine Bench Press",sets:"4×10",weight:"~50kg",note:"Use smith if free bench is taken"},{name:"Incline Dumbbell Press",sets:"3×12",weight:"18–20kg/hand",note:"Slight incline (30°)"},{name:"Arnold Press",sets:"3×10",weight:"10–12kg",note:"Great for full shoulder head activation"},{name:"Cable Lateral Raises",sets:"3×15",weight:"6–8kg",note:"Keep constant tension"},{name:"Tricep Pushdown (bar)",sets:"3×12",weight:"26–30kg",note:""},{name:"Dips (bodyweight or assisted)",sets:"3×max",weight:"BW",note:"Lean slightly forward for chest focus"}] },
  "Pull Day":   { color:"#39d353", muscles:"Back · Biceps · Rear Delts", exercises:[{name:"Lat Pulldown",sets:"1 warm-up + 4×10",weight:"60kg → progress to 65kg",note:"Drive elbows down, not back"},{name:"Bent Over Barbell Row",sets:"4×10",weight:"40–50kg",note:"Hinge at hips, neutral spine"},{name:"Seated Cable Row",sets:"3×12",weight:"40–50kg",note:"Great for mid-back thickness"},{name:"Face Pull (cable)",sets:"3×15",weight:"20–24kg",note:"External rotate at peak"},{name:"Weighted Back Extension",sets:"3×12",weight:"10–15kg plate",note:"Slow controlled, don't hyperextend"},{name:"Dumbbell Hammer Curls",sets:"3×12",weight:"10–12kg",note:""},{name:"EZ Bar / Barbell Curl",sets:"3×10",weight:"20–25kg",note:"Preacher machine replacement"}] },
  "Pull Day B": { color:"#39d353", muscles:"Back · Biceps · Rear Delts", exercises:[{name:"Wide Grip Lat Pulldown",sets:"4×10",weight:"55–65kg",note:"Focus on lat stretch at top"},{name:"Single Arm Dumbbell Row",sets:"3×10 each",weight:"20–24kg",note:"Full ROM, drive elbow back"},{name:"Cable Straight Arm Pulldown",sets:"3×15",weight:"light",note:"Great lat isolation"},{name:"Face Pull",sets:"3×15",weight:"22–26kg",note:""},{name:"Incline Dumbbell Curl",sets:"3×12",weight:"10–12kg",note:"Stretches bicep long head"},{name:"Hammer Curls",sets:"3×12",weight:"10–14kg",note:""},{name:"Back Extension",sets:"3×12",weight:"10kg",note:""}] },
  "Legs Day":   { color:"#f5c518", muscles:"Quads · Hamstrings · Glutes · Calves", exercises:[{name:"Smith Machine Squat",sets:"1 warm-up + 4×10",weight:"Start ~40–50kg",note:"Feet slightly forward, depth to parallel"},{name:"Goblet Squat / Leg Press",sets:"3×12",weight:"16–20kg DB",note:"Goblet squat great for form"},{name:"Leg Extension Machine",sets:"3×15",weight:"Light–moderate",note:"Pause at peak contraction"},{name:"Standing Leg Curl Machine",sets:"3×12 each",weight:"Light–moderate",note:"Control the eccentric"},{name:"Romanian Deadlift (DB)",sets:"3×10",weight:"20–24kg/hand",note:"Hinge at hips, stretch hamstrings"},{name:"Standing Calf Raise",sets:"4×15",weight:"BW or loaded",note:"Full ROM, pause top and bottom"}] },
};

const weekOverview = [
  {day:"Mon",gym:"Push A",run:"Garmin Coach",surf:false},
  {day:"Tue",gym:"Pull A",run:"Rest",surf:false},
  {day:"Wed",gym:"Legs",run:"Garmin Coach",surf:false},
  {day:"Thu",gym:"Rest",run:"Garmin Coach",surf:false},
  {day:"Fri",gym:"Push B / Surf",run:"Optional",surf:true},
  {day:"Sat",gym:"Pull B / Surf",run:"Optional",surf:true},
  {day:"Sun",gym:"Rest",run:"Optional",surf:true},
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

const LS = {
  get: (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

const today = () => new Date().toISOString().split("T")[0];
const fmt   = (d) => new Date(d).toLocaleDateString("en-ZA", {day:"numeric",month:"short"});

// ── COLOURS ───────────────────────────────────────────────────────────────────

const C = {
  bg0:"#03060f", bg1:"#060e1c", bg2:"#0b1a2e", bg3:"#071221",
  border:"#0f2d4a", borderHi:"#1a4060",
  textPrimary:"#e8f4ff", textSec:"#5b8db8", textDim:"#2a4f6e",
  push:"#ff6b35", pull:"#39d353", legs:"#f5c518", run:"#c084fc",
  flex:"#f472b6", rest:"#94a3b8", surf:"#00c2e0",
  accent:"#00c2e0", weight:"#f472b6",
};

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function Tag({ label, color }) {
  return (
    <span style={{ fontSize:10, padding:"2px 7px", borderRadius:4, fontWeight:700, letterSpacing:"0.06em",
      background: color + "22", color }}>
      {label}
    </span>
  );
}

function Card({ children, style={} }) {
  return <div style={{ background:C.bg3, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", ...style }}>{children}</div>;
}

function SectionLabel({ children }) {
  return <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.15em", color:C.textDim, marginBottom:10, fontWeight:600 }}>{children}</div>;
}

// ── TRACKER TAB ───────────────────────────────────────────────────────────────

function TrackerTab() {
  const [sessions, setSessions] = useState(() => LS.get("tracker_sessions", []));
  const [form, setForm]         = useState({ date: today(), type:"gym", subtype:"Push Day", notes:"", surfHours:"" });
  const [showForm, setShowForm] = useState(false);

  const save = () => {
    if (!form.date) return;
    const updated = [{ ...form, id: Date.now() }, ...sessions];
    setSessions(updated);
    LS.set("tracker_sessions", updated);
    setShowForm(false);
    setForm({ date: today(), type:"gym", subtype:"Push Day", notes:"", surfHours:"" });
  };

  const del = (id) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    LS.set("tracker_sessions", updated);
  };

  // weekly counts
  const thisWeekSessions = sessions.filter(s => {
    const d = new Date(s.date), now = new Date();
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    return d >= startOfWeek;
  });
  const gymCount  = thisWeekSessions.filter(s => s.type === "gym").length;
  const runCount  = thisWeekSessions.filter(s => s.type === "run").length;
  const surfCount = thisWeekSessions.filter(s => s.type === "surf").length;

  const typeColor = { gym:C.push, run:C.run, surf:C.surf };
  const typeIcon  = { gym:"🏋️", run:"🏃", surf:"🌊" };

  return (
    <div>
      {/* Weekly summary pills */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
        {[
          { label:"Gym", val:gymCount, target:4, color:C.push },
          { label:"Runs", val:runCount, target:3, color:C.run },
          { label:"Surfs", val:surfCount, target:"–", color:C.surf },
        ].map((s,i) => (
          <div key={i} style={{ background:C.bg2, border:`1px solid ${s.color}33`, borderRadius:12, padding:"14px 12px", textAlign:"center" }}>
            <div style={{ fontSize:26, fontWeight:700, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:11, color:C.textSec, marginTop:2 }}>{s.label}</div>
            {s.target !== "–" && <div style={{ fontSize:10, color:C.textDim, marginTop:2 }}>of {s.target} target</div>}
          </div>
        ))}
      </div>

      {/* Log button */}
      <button onClick={() => setShowForm(!showForm)} style={{
        width:"100%", padding:"13px", borderRadius:10, border:`1px solid ${C.accent}44`,
        background: showForm ? C.bg2 : C.accent + "18", color:C.accent,
        fontSize:14, fontWeight:600, cursor:"pointer", marginBottom:16,
      }}>
        {showForm ? "Cancel" : "+ Log a Session"}
      </button>

      {/* Form */}
      {showForm && (
        <Card style={{ marginBottom:16 }}>
          <SectionLabel>New Session</SectionLabel>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <div>
              <div style={{ fontSize:11, color:C.textDim, marginBottom:4 }}>Date</div>
              <input type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})}
                style={{ width:"100%", background:C.bg0, border:`1px solid ${C.border}`, borderRadius:8,
                  color:C.textPrimary, padding:"8px 10px", fontSize:13, boxSizing:"border-box" }} />
            </div>
            <div>
              <div style={{ fontSize:11, color:C.textDim, marginBottom:4 }}>Type</div>
              <select value={form.type} onChange={e => setForm({...form, type:e.target.value, subtype:e.target.value==="gym"?"Push Day":e.target.value==="run"?"Easy":"Strand"})}
                style={{ width:"100%", background:C.bg0, border:`1px solid ${C.border}`, borderRadius:8,
                  color:C.textPrimary, padding:"8px 10px", fontSize:13 }}>
                <option value="gym">Gym</option>
                <option value="run">Run</option>
                <option value="surf">Surf</option>
              </select>
            </div>
          </div>
          {form.type === "gym" && (
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:11, color:C.textDim, marginBottom:4 }}>Session</div>
              <select value={form.subtype} onChange={e => setForm({...form, subtype:e.target.value})}
                style={{ width:"100%", background:C.bg0, border:`1px solid ${C.border}`, borderRadius:8,
                  color:C.textPrimary, padding:"8px 10px", fontSize:13 }}>
                {["Push Day","Pull Day","Legs Day","Push Day B","Pull Day B"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          )}
          {form.type === "surf" && (
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:11, color:C.textDim, marginBottom:4 }}>Hours in water</div>
              <input type="number" step="0.5" min="0.5" max="8" value={form.surfHours}
                onChange={e => setForm({...form, surfHours:e.target.value})}
                placeholder="e.g. 2"
                style={{ width:"100%", background:C.bg0, border:`1px solid ${C.border}`, borderRadius:8,
                  color:C.textPrimary, padding:"8px 10px", fontSize:13, boxSizing:"border-box" }} />
            </div>
          )}
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:C.textDim, marginBottom:4 }}>Notes (optional)</div>
            <input type="text" value={form.notes} onChange={e => setForm({...form, notes:e.target.value})}
              placeholder="How did it go? Any PRs?"
              style={{ width:"100%", background:C.bg0, border:`1px solid ${C.border}`, borderRadius:8,
                color:C.textPrimary, padding:"8px 10px", fontSize:13, boxSizing:"border-box" }} />
          </div>
          <button onClick={save} style={{
            width:"100%", padding:"11px", borderRadius:8, border:"none",
            background:C.accent, color:"#03060f", fontSize:14, fontWeight:700, cursor:"pointer",
          }}>Save Session</button>
        </Card>
      )}

      {/* Session log */}
      <SectionLabel>Session Log</SectionLabel>
      {sessions.length === 0 && (
        <div style={{ textAlign:"center", color:C.textDim, fontSize:13, padding:"32px 0" }}>
          No sessions logged yet. Hit the button above to start.
        </div>
      )}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {sessions.slice(0,30).map(s => (
          <div key={s.id} style={{
            background:C.bg2, border:`1px solid ${C.border}`, borderRadius:10,
            padding:"11px 14px", display:"flex", alignItems:"center", gap:12,
          }}>
            <span style={{ fontSize:20 }}>{typeIcon[s.type]}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:13, fontWeight:600, color:C.textPrimary }}>{s.subtype || s.type}</span>
                <Tag label={s.type.toUpperCase()} color={typeColor[s.type]} />
                {s.surfHours && <Tag label={`${s.surfHours}h`} color={C.surf} />}
              </div>
              <div style={{ fontSize:11, color:C.textSec, marginTop:2 }}>{fmt(s.date)}{s.notes ? ` · ${s.notes}` : ""}</div>
            </div>
            <button onClick={() => del(s.id)} style={{
              background:"none", border:"none", color:C.textDim, fontSize:18, cursor:"pointer", padding:"0 4px",
            }}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── WEIGHT TAB ────────────────────────────────────────────────────────────────

function WeightTab() {
  const [entries, setEntries] = useState(() => LS.get("weight_entries", []));
  const [val, setVal]         = useState("");
  const [date, setDate]       = useState(today());

  const add = () => {
    if (!val || isNaN(parseFloat(val))) return;
    const updated = [...entries, { date, weight: parseFloat(val), id: Date.now() }]
      .sort((a,b) => a.date.localeCompare(b.date));
    setEntries(updated);
    LS.set("weight_entries", updated);
    setVal("");
  };

  const del = (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    LS.set("weight_entries", updated);
  };

  const start  = 80;
  const target = 74;
  const latest = entries.length ? entries[entries.length-1].weight : null;
  const lost   = latest ? (start - latest).toFixed(1) : 0;
  const toGo   = latest ? Math.max(0, latest - target).toFixed(1) : (start - target);
  const pct    = latest ? Math.min(100, Math.round(((start - latest) / (start - target)) * 100)) : 0;

  // simple SVG sparkline
  const sparkline = () => {
    if (entries.length < 2) return null;
    const ws   = entries.map(e => e.weight);
    const minW = Math.min(...ws) - 1;
    const maxW = Math.max(...ws) + 1;
    const W = 280, H = 80;
    const pts = entries.map((e,i) => {
      const x = (i / (entries.length - 1)) * W;
      const y = H - ((e.weight - minW) / (maxW - minW)) * H;
      return `${x},${y}`;
    }).join(" ");
    const areaBot = `${(entries.length-1)/(entries.length-1)*W},${H} 0,${H}`;
    return (
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
        <defs>
          <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.weight} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={C.weight} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polygon points={`0,${H - ((entries[0].weight - minW)/(maxW - minW))*H} ${pts} ${areaBot}`} fill="url(#wGrad)" />
        <polyline points={pts} fill="none" stroke={C.weight} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* target line */}
        <line x1="0" y1={H - ((target - minW)/(maxW - minW))*H} x2={W} y2={H - ((target - minW)/(maxW - minW))*H}
          stroke={C.pull} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6"/>
        {/* dots */}
        {entries.map((e,i) => {
          const x = (i/(entries.length-1))*W;
          const y = H - ((e.weight - minW)/(maxW - minW))*H;
          return <circle key={i} cx={x} cy={y} r="4" fill={C.weight} stroke={C.bg0} strokeWidth="2"/>;
        })}
      </svg>
    );
  };

  return (
    <div>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
        {[
          { label:"Current", val: latest ? `${latest}kg` : "—", color:C.weight },
          { label:"Lost", val: lost > 0 ? `-${lost}kg` : "—", color:C.pull },
          { label:"To go", val: `${toGo}kg`, color:C.legs },
        ].map((s,i) => (
          <div key={i} style={{ background:C.bg2, border:`1px solid ${s.color}33`, borderRadius:12, padding:"14px 12px", textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:11, color:C.textSec, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:12, color:C.textSec }}>Journey to 74kg</span>
          <span style={{ fontSize:12, fontWeight:700, color:C.pull }}>{pct}%</span>
        </div>
        <div style={{ background:C.bg0, borderRadius:99, height:8, overflow:"hidden" }}>
          <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg, ${C.weight}, ${C.pull})`, borderRadius:99, transition:"width 0.5s" }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
          <span style={{ fontSize:10, color:C.textDim }}>80kg start</span>
          <span style={{ fontSize:10, color:C.textDim }}>74kg target</span>
        </div>
      </Card>

      {/* Chart */}
      {entries.length >= 2 && (
        <Card style={{ marginBottom:16 }}>
          <SectionLabel>Weight Trend</SectionLabel>
          {sparkline()}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:16, height:2, background:C.weight, borderRadius:2 }}/>
              <span style={{ fontSize:10, color:C.textSec }}>Weight</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:16, height:2, background:C.pull, borderRadius:2, opacity:.6 }}/>
              <span style={{ fontSize:10, color:C.textSec }}>74kg target</span>
            </div>
          </div>
        </Card>
      )}

      {/* Log entry */}
      <Card style={{ marginBottom:16 }}>
        <SectionLabel>Log Weight</SectionLabel>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:8, alignItems:"end" }}>
          <div>
            <div style={{ fontSize:11, color:C.textDim, marginBottom:4 }}>Date</div>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              style={{ width:"100%", background:C.bg0, border:`1px solid ${C.border}`, borderRadius:8,
                color:C.textPrimary, padding:"8px 10px", fontSize:13, boxSizing:"border-box" }} />
          </div>
          <div>
            <div style={{ fontSize:11, color:C.textDim, marginBottom:4 }}>Weight (kg)</div>
            <input type="number" step="0.1" value={val} onChange={e => setVal(e.target.value)}
              placeholder="e.g. 78.5"
              style={{ width:"100%", background:C.bg0, border:`1px solid ${C.border}`, borderRadius:8,
                color:C.textPrimary, padding:"8px 10px", fontSize:13, boxSizing:"border-box" }} />
          </div>
          <button onClick={add} style={{
            background:C.weight, color:"#03060f", border:"none", borderRadius:8,
            padding:"9px 14px", fontSize:14, fontWeight:700, cursor:"pointer",
          }}>+</button>
        </div>
      </Card>

      {/* History */}
      <SectionLabel>History</SectionLabel>
      {entries.length === 0 && <div style={{ textAlign:"center", color:C.textDim, fontSize:13, padding:"24px 0" }}>No entries yet.</div>}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {[...entries].reverse().slice(0,20).map(e => (
          <div key={e.id} style={{
            background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8,
            padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center",
          }}>
            <span style={{ fontSize:13, color:C.textSec }}>{fmt(e.date)}</span>
            <span style={{ fontSize:15, fontWeight:700, color:C.weight }}>{e.weight} kg</span>
            <button onClick={() => del(e.id)} style={{ background:"none", border:"none", color:C.textDim, fontSize:16, cursor:"pointer" }}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LIFTS TAB ─────────────────────────────────────────────────────────────────

const LIFTS = ["Incline Bench Press","Lat Pulldown","Bent Over Row","Smith Squat","DB Shoulder Press","DB Bench Press","Hammer Curls","Face Pull"];
const LIFT_TARGETS = {
  "Incline Bench Press": [{ph:"Ph1","kg":45},{ph:"Ph2","kg":50},{ph:"Ph3","kg":60},{ph:"Ph4","kg":70}],
  "Lat Pulldown":        [{ph:"Ph1","kg":55},{ph:"Ph2","kg":60},{ph:"Ph3","kg":72},{ph:"Ph4","kg":82}],
  "Bent Over Row":       [{ph:"Ph1","kg":35},{ph:"Ph2","kg":45},{ph:"Ph3","kg":55},{ph:"Ph4","kg":65}],
  "Smith Squat":         [{ph:"Ph1","kg":40},{ph:"Ph2","kg":55},{ph:"Ph3","kg":70},{ph:"Ph4","kg":85}],
  "DB Shoulder Press":   [{ph:"Ph1","kg":8},{ph:"Ph2","kg":10},{ph:"Ph3","kg":14},{ph:"Ph4","kg":18}],
  "DB Bench Press":      [{ph:"Ph1","kg":18},{ph:"Ph2","kg":20},{ph:"Ph3","kg":24},{ph:"Ph4","kg":28}],
  "Hammer Curls":        [{ph:"Ph1","kg":10},{ph:"Ph2","kg":12},{ph:"Ph3","kg":14},{ph:"Ph4","kg":16}],
  "Face Pull":           [{ph:"Ph1","kg":18},{ph:"Ph2","kg":22},{ph:"Ph3","kg":26},{ph:"Ph4","kg":30}],
};

function LiftChart({ lift, entries }) {
  if (entries.length < 2) return null;
  const targets = LIFT_TARGETS[lift] || [];
  const ws   = entries.map(e => e.weight);
  const allW = [...ws, ...targets.map(t => t.kg)];
  const minW = Math.min(...allW) - 5;
  const maxW = Math.max(...allW) + 5;
  const W = 280, H = 70;
  const pts = entries.map((e,i) => {
    const x = (i/(entries.length-1))*W;
    const y = H - ((e.weight-minW)/(maxW-minW))*H;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible", marginTop:8 }}>
      <defs>
        <linearGradient id={`lGrad${lift.replace(/\s/g,"")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.push} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={C.push} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill={`url(#lGrad${lift.replace(/\s/g,"")})`}/>
      <polyline points={pts} fill="none" stroke={C.push} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {entries.map((e,i) => {
        const x=(i/(entries.length-1))*W, y=H-((e.weight-minW)/(maxW-minW))*H;
        return <circle key={i} cx={x} cy={y} r="4" fill={C.push} stroke={C.bg0} strokeWidth="2"/>;
      })}
      {/* ph target dashes */}
      {targets.map((t,i) => {
        const col = [C.accent,C.pull,C.legs,C.flex][i];
        const y   = H - ((t.kg - minW)/(maxW-minW))*H;
        return <line key={i} x1="0" y1={y} x2={W} y2={y} stroke={col} strokeWidth="1" strokeDasharray="5 4" opacity="0.5"/>;
      })}
    </svg>
  );
}

function LiftsTab() {
  const [logs, setLogs]           = useState(() => LS.get("lift_logs", {}));
  const [activeLift, setActive]   = useState(LIFTS[0]);
  const [form, setForm]           = useState({ date: today(), weight:"", reps:"", sets:"" });
  const [showForm, setShowForm]   = useState(false);

  const liftEntries = (logs[activeLift] || []).sort((a,b) => a.date.localeCompare(b.date));
  const latest = liftEntries.length ? liftEntries[liftEntries.length-1] : null;
  const targets = LIFT_TARGETS[activeLift] || [];
  const nextTarget = targets.find(t => !latest || t.kg > latest.weight);

  const add = () => {
    if (!form.weight) return;
    const entry = { date:form.date, weight:parseFloat(form.weight), reps:form.reps, sets:form.sets, id:Date.now() };
    const updated = { ...logs, [activeLift]: [...(logs[activeLift]||[]), entry] };
    setLogs(updated);
    LS.set("lift_logs", updated);
    setForm({ date:today(), weight:"", reps:"", sets:"" });
    setShowForm(false);
  };

  const del = (id) => {
    const updated = { ...logs, [activeLift]: (logs[activeLift]||[]).filter(e => e.id !== id) };
    setLogs(updated);
    LS.set("lift_logs", updated);
  };

  return (
    <div>
      {/* Lift selector */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:18 }}>
        {LIFTS.map(l => (
          <button key={l} onClick={() => { setActive(l); setShowForm(false); }} style={{
            background: activeLift===l ? C.bg2 : "transparent",
            border: `1px solid ${activeLift===l ? C.push+"66" : C.border}`,
            borderRadius:8, padding:"7px 12px", cursor:"pointer",
            color: activeLift===l ? C.push : C.textSec,
            fontSize:12, fontWeight:500,
          }}>{l}</button>
        ))}
      </div>

      {/* Current + next target */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        <div style={{ background:C.bg2, border:`1px solid ${C.push}33`, borderRadius:12, padding:"14px 12px", textAlign:"center" }}>
          <div style={{ fontSize:24, fontWeight:700, color:C.push }}>{latest ? `${latest.weight}kg` : "—"}</div>
          <div style={{ fontSize:11, color:C.textSec, marginTop:2 }}>Best logged</div>
          {latest && <div style={{ fontSize:10, color:C.textDim, marginTop:2 }}>{latest.sets||"?"}×{latest.reps||"?"} · {fmt(latest.date)}</div>}
        </div>
        <div style={{ background:C.bg2, border:`1px solid ${C.legs}33`, borderRadius:12, padding:"14px 12px", textAlign:"center" }}>
          <div style={{ fontSize:24, fontWeight:700, color:C.legs }}>{nextTarget ? `${nextTarget.kg}kg` : "✓"}</div>
          <div style={{ fontSize:11, color:C.textSec, marginTop:2 }}>{nextTarget ? `${nextTarget.ph} target` : "All targets hit!"}</div>
        </div>
      </div>

      {/* Chart */}
      {liftEntries.length >= 2 && (
        <Card style={{ marginBottom:14 }}>
          <SectionLabel>Progress — {activeLift}</SectionLabel>
          <LiftChart lift={activeLift} entries={liftEntries}/>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:8 }}>
            {targets.map((t,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:14, height:2, background:[C.accent,C.pull,C.legs,C.flex][i], borderRadius:2, opacity:.6 }}/>
                <span style={{ fontSize:10, color:C.textSec }}>{t.ph}: {t.kg}kg</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Log button */}
      <button onClick={() => setShowForm(!showForm)} style={{
        width:"100%", padding:"12px", borderRadius:10, border:`1px solid ${C.push}44`,
        background: showForm ? C.bg2 : C.push+"18", color:C.push,
        fontSize:14, fontWeight:600, cursor:"pointer", marginBottom:14,
      }}>
        {showForm ? "Cancel" : `+ Log ${activeLift}`}
      </button>

      {/* Form */}
      {showForm && (
        <Card style={{ marginBottom:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, marginBottom:10 }}>
            {[
              { label:"Date", field:"date", type:"date", placeholder:"" },
              { label:"Weight (kg)", field:"weight", type:"number", placeholder:"e.g. 52.5" },
              { label:"Sets", field:"sets", type:"number", placeholder:"3" },
              { label:"Reps", field:"reps", type:"number", placeholder:"10" },
            ].map(f => (
              <div key={f.field}>
                <div style={{ fontSize:10, color:C.textDim, marginBottom:4 }}>{f.label}</div>
                <input type={f.type} value={form[f.field]} placeholder={f.placeholder}
                  onChange={e => setForm({...form, [f.field]:e.target.value})}
                  style={{ width:"100%", background:C.bg0, border:`1px solid ${C.border}`, borderRadius:7,
                    color:C.textPrimary, padding:"7px 8px", fontSize:12, boxSizing:"border-box" }} />
              </div>
            ))}
          </div>
          <button onClick={add} style={{
            width:"100%", padding:"10px", borderRadius:8, border:"none",
            background:C.push, color:"#03060f", fontSize:13, fontWeight:700, cursor:"pointer",
          }}>Save</button>
        </Card>
      )}

      {/* History */}
      <SectionLabel>Log History</SectionLabel>
      {liftEntries.length === 0 && <div style={{ textAlign:"center", color:C.textDim, fontSize:13, padding:"20px 0" }}>No entries yet for {activeLift}.</div>}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {[...liftEntries].reverse().slice(0,15).map(e => (
          <div key={e.id} style={{
            background:C.bg2, border:`1px solid ${C.border}`, borderRadius:8,
            padding:"9px 14px", display:"grid", gridTemplateColumns:"1fr auto auto auto", alignItems:"center", gap:10,
          }}>
            <span style={{ fontSize:12, color:C.textSec }}>{fmt(e.date)}</span>
            <span style={{ fontSize:14, fontWeight:700, color:C.push }}>{e.weight}kg</span>
            <span style={{ fontSize:12, color:C.textDim }}>{e.sets||"?"}×{e.reps||"?"}</span>
            <button onClick={() => del(e.id)} style={{ background:"none", border:"none", color:C.textDim, fontSize:16, cursor:"pointer" }}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SCHEDULE TAB ──────────────────────────────────────────────────────────────

function ScheduleTab() {
  const [activeDay, setActiveDay] = useState("Monday");
  const d = schedule[activeDay];
  return (
    <>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
        {days.map(day => (
          <button key={day} onClick={() => setActiveDay(day)} style={{
            background: activeDay===day ? C.bg2 : "transparent",
            border: activeDay===day ? `1px solid ${C.borderHi}` : `1px solid ${C.border}`,
            borderRadius:8, padding:"7px 12px", cursor:"pointer",
            color: activeDay===day ? C.textPrimary : C.textSec,
            fontSize:13, fontWeight:500,
          }}>
            {day.slice(0,3)}
            <span style={{ marginLeft:6, fontSize:10, padding:"2px 6px", borderRadius:4,
              background:schedule[day].tagColor+"22", color:schedule[day].tagColor, fontWeight:700 }}>
              {schedule[day].tag}
            </span>
          </button>
        ))}
      </div>
      <Card style={{ marginBottom:14, borderLeft:`3px solid ${d.tagColor}`, background:C.bg2 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:20, fontWeight:700, color:C.textPrimary }}>{activeDay}</div>
            <div style={{ fontSize:13, color:C.textSec, marginTop:2 }}>{d.type}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:12, color:C.textSec }}>🌙 Bed <span style={{ color:C.textPrimary, fontWeight:600 }}>{d.bed}</span></div>
            <div style={{ fontSize:12, color:C.textSec, marginTop:2 }}>☀️ Wake <span style={{ color:C.textPrimary, fontWeight:600 }}>{d.wake}</span></div>
          </div>
        </div>
      </Card>
      <SectionLabel>Sessions</SectionLabel>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
        {d.sessions.map((s,i) => (
          <Card key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px" }}>
            <span style={{ fontSize:20 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize:11, color:C.textSec }}>{s.time}</div>
              <div style={{ fontSize:14, fontWeight:500, color:C.textPrimary }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>
      <SectionLabel>Meal Timing</SectionLabel>
      <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:16 }}>
        {d.meals.map((m,i) => (
          <Card key={i} style={{ display:"grid", gridTemplateColumns:"56px 1fr", gap:10, padding:"10px 14px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.run }}>{m.time}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:500, color:C.textPrimary }}>{m.label}</div>
              <div style={{ fontSize:12, color:C.textSec, marginTop:1 }}>{m.detail}</div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ background:C.bg2, borderLeft:`3px solid ${C.push}`, borderRadius:"0 10px 10px 0", padding:"13px 15px" }}>
        <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.15em", color:C.push, marginBottom:4 }}>Day Notes</div>
        <div style={{ fontSize:13, color:C.textSec, lineHeight:1.6 }}>{d.note}</div>
      </div>
    </>
  );
}

// ── GYM PLANS TAB ─────────────────────────────────────────────────────────────

function GymTab() {
  const [activeGym, setActive] = useState("Push Day");
  const g = gymPlans[activeGym];
  return (
    <>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:18 }}>
        {Object.keys(gymPlans).map(plan => (
          <button key={plan} onClick={() => setActive(plan)} style={{
            background: activeGym===plan ? C.bg2 : "transparent",
            border: `1px solid ${activeGym===plan ? gymPlans[plan].color+"66" : C.border}`,
            borderRadius:8, padding:"7px 12px", cursor:"pointer",
            color: activeGym===plan ? gymPlans[plan].color : C.textSec,
            fontSize:12, fontWeight:500,
          }}>{plan}</button>
        ))}
      </div>
      <Card style={{ marginBottom:14, borderLeft:`3px solid ${g.color}`, background:C.bg2 }}>
        <div style={{ fontSize:17, fontWeight:700, color:C.textPrimary }}>{activeGym}</div>
        <div style={{ fontSize:12, color:C.textSec, marginTop:2 }}>{g.muscles}</div>
      </Card>
      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
        {g.exercises.map((ex,i) => (
          <Card key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
              <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>
                <span style={{ color:g.color, fontSize:11, marginRight:7, fontWeight:700 }}>{String(i+1).padStart(2,"0")}</span>{ex.name}
              </div>
              <Tag label={ex.sets} color={g.color}/>
            </div>
            <div style={{ fontSize:12, color:C.textSec, marginTop:5 }}>⚖️ {ex.weight}</div>
            {ex.note && <div style={{ fontSize:11, color:C.textDim, marginTop:3, fontStyle:"italic" }}>💡 {ex.note}</div>}
          </Card>
        ))}
      </div>
    </>
  );
}

// ── OVERVIEW TAB ──────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <>
      <SectionLabel>Weekly Split</SectionLabel>
      <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:20 }}>
        {weekOverview.map((w,i) => (
          <Card key={i} style={{ display:"grid", gridTemplateColumns:"42px 1fr 1fr", alignItems:"center", gap:10 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.push }}>{w.day}</div>
            <div>
              <div style={{ fontSize:10, color:C.textDim }}>Gym</div>
              <div style={{ fontSize:13, color:C.textPrimary, fontWeight:500 }}>{w.gym} {w.surf?"🌊":""}</div>
            </div>
            <div>
              <div style={{ fontSize:10, color:C.textDim }}>Run</div>
              <div style={{ fontSize:13, color:w.run==="Rest" ? C.textDim : C.run, fontWeight:500 }}>{w.run}</div>
            </div>
          </Card>
        ))}
      </div>
      <Card style={{ marginBottom:14 }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.textPrimary, marginBottom:12 }}>Sleep Guidelines</div>
        {[
          {label:"Mon–Thu", wake:"06:00–06:30", bed:"22:00", hours:"~8h"},
          {label:"Fri–Sat", wake:"07:00",       bed:"23:00", hours:"~8h"},
          {label:"Sunday",  wake:"07:30",       bed:"22:00", hours:"~8.5h"},
        ].map((s,i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0",
            borderBottom: i<2 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontSize:13, fontWeight:600, color:C.textPrimary }}>{s.label}</span>
            <span style={{ fontSize:12, color:C.textSec }}>Wake {s.wake} · Bed {s.bed}</span>
            <span style={{ fontSize:12, fontWeight:700, color:C.legs }}>{s.hours}</span>
          </div>
        ))}
      </Card>
      <Card>
        <div style={{ fontSize:14, fontWeight:700, color:C.textPrimary, marginBottom:12 }}>Key Principles</div>
        {[
          "🌊 Surf always wins — never force gym or run on a good swell day",
          "🏋️ 4 gym sessions/week max (Push A, Pull A, Legs, + one B session)",
          "🏃 Runs via Garmin Coach — trust the plan, don't race every session",
          "🦵 Mobility every morning — ankle, hip, thoracic spine. Non-negotiable",
          "🧍 Single-leg balance drills daily — critical for ankle proprioception",
          "😴 Protect sleep windows — gains happen during recovery",
          "🥩 Protein: aim for 130–160g/day",
          "❤️ Zone 2: surfing counts — 20hrs/month paddling covers most of your 150min/week target",
          "⚡ Zone 4/5: Garmin Coach introduces this naturally from ~week 9",
          "📈 Log every lift and weigh-in — visible progress is the best motivation",
        ].map((p,i) => (
          <div key={i} style={{ fontSize:13, color:C.textSec, marginBottom:8, lineHeight:1.5 }}>{p}</div>
        ))}
      </Card>
    </>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────

const TABS = [
  { key:"schedule", label:"Schedule" },
  { key:"gym",      label:"Gym" },
  { key:"tracker",  label:"Log" },
  { key:"weight",   label:"Weight" },
  { key:"lifts",    label:"Lifts" },
  { key:"overview", label:"Overview" },
];

export default function App() {
  const [tab, setTab] = useState("schedule");

  return (
    <div style={{ minHeight:"100vh", background:C.bg0, color:C.textPrimary,
      fontFamily:"'DM Sans','Helvetica Neue',sans-serif", paddingBottom:80 }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg, #04111f 0%, #020a16 100%)",
        borderBottom:`1px solid ${C.border}`, padding:"24px 20px 18px" }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <div style={{ fontSize:10, letterSpacing:"0.2em", color:C.textDim, textTransform:"uppercase", marginBottom:5 }}>Training Program</div>
          <h1 style={{ margin:0, fontSize:24, fontWeight:700, letterSpacing:"-0.02em", color:C.textPrimary }}>Training Dashboard</h1>
          <p style={{ margin:"5px 0 0", fontSize:12, color:C.textSec }}>Strength · Aesthetics · Running · Surfing</p>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background:"#050d1a", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:10 }}>
        <div style={{ maxWidth:720, margin:"0 auto", display:"flex", overflowX:"auto" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background:"none", border:"none", cursor:"pointer", flexShrink:0,
              padding:"12px 14px", fontSize:12, fontWeight:500,
              color: tab===t.key ? C.textPrimary : C.textSec,
              borderBottom: tab===t.key ? `2px solid ${C.accent}` : "2px solid transparent",
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:720, margin:"0 auto", padding:"20px 14px" }}>
        {tab === "schedule" && <ScheduleTab/>}
        {tab === "gym"      && <GymTab/>}
        {tab === "tracker"  && <TrackerTab/>}
        {tab === "weight"   && <WeightTab/>}
        {tab === "lifts"    && <LiftsTab/>}
        {tab === "overview" && <OverviewTab/>}
      </div>
    </div>
  );
}
