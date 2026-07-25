import { useState } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const schedule = {
  Monday: {
    wake: "06:00",
    bed: "22:00",
    type: "Push Day",
    tag: "PUSH",
    tagColor: "#ff6b35",
    sessions: [
      { time: "06:15–06:50", label: "Mobility: Ankle · Hip · Thoracic Spine + Single-Leg Balance Drills", icon: "🦵" },
      { time: "07:00–08:15", label: "Push Day (Gym)", icon: "🏋️" },
      { time: "Classes", label: "14:00–16:00 → Commute home ~16:30", icon: "🎓" },
      { time: "18:30–19:15", label: "Run — Garmin Coach", icon: "🏃" },
    ],
    meals: [
      { time: "06:00", label: "Pre-workout snack", detail: "Banana + black coffee or oats" },
      { time: "08:30", label: "Post-workout breakfast", detail: "Eggs + toast + fruit" },
      { time: "12:30", label: "Lunch", detail: "Protein + complex carbs + veg" },
      { time: "16:45", label: "Post-class snack", detail: "Greek yoghurt + nuts or rice cakes + PB" },
      { time: "19:30", label: "Dinner", detail: "Lean protein + veg + light carbs" },
    ],
    note: "Gym before class. Run after class once home. Avoid heavy carbs before afternoon class to prevent energy crash. Surf = Zone 2 — skip run on surf days.",
  },
  Tuesday: {
    wake: "06:00",
    bed: "22:00",
    type: "Pull Day",
    tag: "PULL",
    tagColor: "#39d353",
    sessions: [
      { time: "06:15–06:50", label: "Mobility: Ankle · Hip · Thoracic Spine + Single-Leg Balance Drills", icon: "🦵" },
      { time: "07:00–08:15", label: "Pull Day (Gym)", icon: "🏋️" },
      { time: "Classes", label: "10:00–15:00 → Commute home ~15:30", icon: "🎓" },
      { time: "16:00–16:45", label: "Rest or Walk (ankle recovery)", icon: "🚶" },
    ],
    meals: [
      { time: "06:00", label: "Pre-workout snack", detail: "Banana or oats" },
      { time: "08:30", label: "Post-workout breakfast", detail: "Eggs + toast + fruit" },
      { time: "10:00", label: "Light snack before classes", detail: "Fruit or handful of nuts" },
      { time: "12:30", label: "Lunch (between classes if possible)", detail: "Protein + complex carbs + veg" },
      { time: "16:00", label: "Post-class snack", detail: "Greek yoghurt + fruit" },
      { time: "19:00", label: "Dinner", detail: "Lean protein + veg + light carbs" },
    ],
    note: "Long class day — gym first thing. Long gap 10–15:00 means eat a proper lunch mid-morning. No evening run; recovery walk is enough.",
  },
  Wednesday: {
    wake: "06:30",
    bed: "22:00",
    type: "Legs Day",
    tag: "LEGS",
    tagColor: "#f5c518",
    sessions: [
      { time: "06:45–07:20", label: "Mobility: Ankle · Hip · Thoracic Spine + Single-Leg Balance Drills", icon: "🦵" },
      { time: "Classes", label: "09:00–10:00, then 12:00–13:00", icon: "🎓" },
      { time: "10:15–11:30", label: "Leg Day (Gym)", icon: "🏋️" },
      { time: "18:30–19:15", label: "Run — Garmin Coach", icon: "🏃" },
    ],
    meals: [
      { time: "06:30", label: "Light breakfast", detail: "Oats + banana (pre-gym fuel)" },
      { time: "11:45", label: "Post-gym lunch", detail: "Protein + carbs + veg — eat before 12:00 class" },
      { time: "14:00", label: "Afternoon snack", detail: "Nuts + fruit or rice cakes + PB" },
      { time: "19:30", label: "Dinner", detail: "Lean protein + veg + carbs to replenish leg day" },
    ],
    note: "Gym fits in the gap between your two classes. Leave campus at 10:00, gym 10:15–11:30, eat, return for 12:00 class.",
  },
  Thursday: {
    wake: "06:30",
    bed: "22:00",
    type: "Rest / Run",
    tag: "RUN",
    tagColor: "#c084fc",
    sessions: [
      { time: "06:45–07:20", label: "Mobility: Ankle · Hip · Thoracic Spine + Single-Leg Balance Drills", icon: "🦵" },
      { time: "Classes", label: "12:00–14:00 → Commute home ~14:30", icon: "🎓" },
      { time: "07:30–08:15", label: "Run — Garmin Coach", icon: "🏃" },
      { time: "15:00–15:30", label: "Light walk / active recovery", icon: "🚶" },
    ],
    meals: [
      { time: "06:30", label: "Pre-run snack", detail: "Banana or small bowl of oats" },
      { time: "08:30", label: "Breakfast", detail: "Eggs + toast + fruit" },
      { time: "11:30", label: "Pre-class lunch", detail: "Eat before class to avoid crash mid-lecture" },
      { time: "15:00", label: "Post-class snack", detail: "Protein shake or yoghurt + nuts" },
      { time: "19:00", label: "Dinner", detail: "Lean protein + veg + moderate carbs" },
    ],
    note: "No gym today — run + recovery day. Run in the morning before class. Surf counts as Zone 2 cardio on good swell days.",
  },
  Friday: {
    wake: "07:00",
    bed: "23:00",
    type: "Push Day B / Surf",
    tag: "FLEX",
    tagColor: "#f472b6",
    sessions: [
      { time: "07:15–07:50", label: "Mobility: Ankle · Hip · Thoracic Spine + Single-Leg Balance Drills", icon: "🦵" },
      { time: "08:00–09:15", label: "Push Day B (Gym)", icon: "🏋️" },
      { time: "OR", label: "Surf if conditions are good 🏄 — skip gym", icon: "🌊" },
      { time: "19:00–19:45", label: "Run — Garmin Coach (if no surf)", icon: "🏃" },
    ],
    meals: [
      { time: "07:00", label: "Pre-workout snack", detail: "Banana + coffee" },
      { time: "09:30", label: "Breakfast", detail: "Eggs + toast or smoothie bowl" },
      { time: "13:00", label: "Lunch", detail: "Protein + carbs + veg" },
      { time: "17:00", label: "Snack", detail: "Fruit + nuts" },
      { time: "19:30", label: "Dinner", detail: "Protein + veg + carbs" },
    ],
    note: "Surf takes priority. If you surf, skip gym and evening run — that's a full session. If no surf, gym in the morning and optional evening run.",
  },
  Saturday: {
    wake: "07:00",
    bed: "23:00",
    type: "Pull Day B / Surf",
    tag: "FLEX",
    tagColor: "#f472b6",
    sessions: [
      { time: "07:15–07:50", label: "Mobility: Ankle · Hip · Thoracic Spine + Single-Leg Balance Drills", icon: "🦵" },
      { time: "08:00–09:15", label: "Pull Day B (Gym)", icon: "🏋️" },
      { time: "OR", label: "Surf if conditions are good 🏄 — skip gym", icon: "🌊" },
      { time: "17:00–17:45", label: "Run — Garmin Coach (if energy allows)", icon: "🏃" },
    ],
    meals: [
      { time: "07:00", label: "Pre-workout snack", detail: "Banana + coffee" },
      { time: "09:30", label: "Breakfast", detail: "Eggs + toast + fruit" },
      { time: "13:00", label: "Lunch", detail: "Protein + carbs + veg" },
      { time: "17:00", label: "Snack", detail: "Protein shake or yoghurt" },
      { time: "19:30", label: "Dinner", detail: "Hearty protein + veg + carbs" },
    ],
    note: "Same surf logic as Friday. If surf: rest day from gym. If gym: full pull session. Run only if legs feel good after everything.",
  },
  Sunday: {
    wake: "07:30",
    bed: "22:00",
    type: "Rest / Recovery",
    tag: "REST",
    tagColor: "#94a3b8",
    sessions: [
      { time: "07:45–08:20", label: "Mobility: Ankle · Hip · Thoracic Spine + Single-Leg Balance Drills", icon: "🦵" },
      { time: "08:30–09:00", label: "Light walk or easy jog (optional)", icon: "🚶" },
      { time: "OR", label: "Surf if conditions are good 🏄", icon: "🌊" },
    ],
    meals: [
      { time: "08:00", label: "Relaxed breakfast", detail: "Whatever you enjoy — fuel well for the week ahead" },
      { time: "13:00", label: "Lunch", detail: "Balanced meal — protein + carbs + veg" },
      { time: "18:00", label: "Early dinner", detail: "Light and nutritious — early bedtime tonight" },
    ],
    note: "True rest day. Sleep in slightly, full mobility + balance work, easy movement only. Surf counts as Zone 2. Early bed to reset sleep cycle for Monday.",
  },
};

const gymPlans = {
  "Push Day": {
    color: "#ff6b35",
    exercises: [
      { name: "Incline Barbell Bench Press", sets: "1 warm-up + 4×10", weight: "Start ~45kg, progress weekly", note: "Control the eccentric (3s down)" },
      { name: "Flat Dumbbell Bench Press", sets: "3×10", weight: "20kg/hand → aim for 22.5kg", note: "Full range of motion, pause at bottom" },
      { name: "Seated Dumbbell Shoulder Press", sets: "3×10", weight: "10kg → 12kg", note: "Don't flare elbows too wide" },
      { name: "Lateral Raises", sets: "4×15", weight: "6–8kg", note: "Slow and controlled, slight lean forward" },
      { name: "Cable Tricep Pushdown (rope)", sets: "3×12", weight: "~24–28kg", note: "Flare hands at bottom of rep" },
      { name: "Overhead Dumbbell Tricep Extension", sets: "3×12", weight: "12–16kg", note: "New addition — great for long head" },
    ],
  },
  "Push Day B": {
    color: "#ff6b35",
    exercises: [
      { name: "Smith Machine Bench Press", sets: "4×10", weight: "~50kg", note: "Use smith if free bench is taken" },
      { name: "Incline Dumbbell Press", sets: "3×12", weight: "18–20kg/hand", note: "Slight incline (30°)" },
      { name: "Arnold Press", sets: "3×10", weight: "10–12kg", note: "Great for full shoulder head activation" },
      { name: "Cable Lateral Raises", sets: "3×15", weight: "6–8kg", note: "Keep constant tension" },
      { name: "Tricep Pushdown (bar)", sets: "3×12", weight: "26–30kg", note: "" },
      { name: "Dips (bodyweight or assisted)", sets: "3×max", weight: "BW", note: "Lean slightly forward for chest focus" },
    ],
  },
  "Pull Day": {
    color: "#39d353",
    exercises: [
      { name: "Lat Pulldown", sets: "1 warm-up + 4×10", weight: "60kg → progress to 65kg", note: "Drive elbows down, not back" },
      { name: "Bent Over Barbell Row", sets: "4×10", weight: "40–50kg", note: "Hinge at hips, neutral spine" },
      { name: "Seated Cable Row", sets: "3×12", weight: "40–50kg", note: "New — great for mid-back thickness" },
      { name: "Face Pull (cable)", sets: "3×15", weight: "20–24kg", note: "External rotate at peak, great for rear delts" },
      { name: "Weighted Back Extension", sets: "3×12", weight: "10–15kg plate", note: "Slow controlled extension, don't hyperextend" },
      { name: "Dumbbell Hammer Curls", sets: "3×12", weight: "10–12kg", note: "" },
      { name: "EZ Bar / Barbell Curl", sets: "3×10", weight: "20–25kg", note: "Preacher machine replacement" },
    ],
  },
  "Pull Day B": {
    color: "#39d353",
    exercises: [
      { name: "Wide Grip Lat Pulldown", sets: "4×10", weight: "55–65kg", note: "Focus on lat stretch at top" },
      { name: "Single Arm Dumbbell Row", sets: "3×10 each", weight: "20–24kg", note: "Full ROM, drive elbow back" },
      { name: "Cable Straight Arm Pulldown", sets: "3×15", weight: "light", note: "Great lat isolation" },
      { name: "Face Pull", sets: "3×15", weight: "22–26kg", note: "" },
      { name: "Incline Dumbbell Curl", sets: "3×12", weight: "10–12kg", note: "Stretches bicep long head" },
      { name: "Hammer Curls", sets: "3×12", weight: "10–14kg", note: "" },
      { name: "Back Extension", sets: "3×12", weight: "10kg", note: "" },
    ],
  },
  "Legs Day": {
    color: "#f5c518",
    exercises: [
      { name: "Smith Machine Squat", sets: "1 warm-up + 4×10", weight: "Start light ~40–50kg, build form first", note: "Feet slightly forward on smith, depth to parallel" },
      { name: "Leg Press (if available) / Goblet Squat", sets: "3×12", weight: "Moderate", note: "Goblet squat: 16–20kg DB, great for beginners" },
      { name: "Leg Extension Machine", sets: "3×15", weight: "Light–moderate", note: "Pause at peak contraction" },
      { name: "Standing Leg Curl Machine", sets: "3×12 each leg", weight: "Light–moderate", note: "Control the eccentric" },
      { name: "Romanian Deadlift (DB)", sets: "3×10", weight: "20–24kg/hand", note: "Hinge at hips, stretch hamstrings, not a squat" },
      { name: "Standing Calf Raise (Smith or step)", sets: "4×15", weight: "Bodyweight or loaded", note: "Full ROM, pause at top and bottom" },
    ],
  },
};

const runningPlan = [
  {
    week: "Weeks 1–2", label: "Re-entry", sessions: "3×/week", color: "#c084fc",
    goal: "Ankle adaptation — no pace targets yet",
    runs: [
      { day: "Mon", type: "Easy jog/walk", detail: "20 min. Walk 2 min / jog 3 min intervals. Just get the legs moving." },
      { day: "Wed", type: "Easy continuous", detail: "15–20 min very easy jog. Stop if ankle feels off." },
      { day: "Thu", type: "Easy jog/walk", detail: "20 min intervals again. Focus on landing softly." },
    ],
    note: "Zero ego. These runs are ankle tests, not training. Swell = skip without guilt.",
  },
  {
    week: "Weeks 3–4", label: "Building Base", sessions: "3×/week", color: "#c084fc",
    goal: "Run 5km continuously — pace doesn't matter yet",
    runs: [
      { day: "Mon", type: "Easy 5km", detail: "Run the full 5km at whatever pace feels comfortable. Note your time — this is your baseline." },
      { day: "Wed", type: "Easy 3km", detail: "Short easy effort. Should feel like a walk in the park." },
      { day: "Thu", type: "Easy 5km", detail: "Second 5km effort of the week. Same easy pace. Log the time." },
    ],
    note: "Most people starting back clock 32–38 min for 5km here. That's your baseline. Don't be discouraged.",
  },
  {
    week: "Weeks 5–6", label: "Phase 1: Sub-30", sessions: "3×/week", color: "#f5c518",
    goal: "Get comfortable running 5km under 30 min",
    runs: [
      { day: "Mon", type: "Tempo intervals", detail: "5 min easy warm-up → 3×5 min at 'comfortably hard' pace (you could say a few words but not chat) → 5 min easy cool-down." },
      { day: "Wed", type: "Easy 5km", detail: "Full 5km at easy conversational pace. Recovery run." },
      { day: "Thu", type: "5km time trial", detail: "Run 5km and push for a new PB. Go out controlled — don't sprint the first km." },
    ],
    note: "The tempo intervals are the engine here. Don't skip them for easy runs — they're what drops your time.",
  },
  {
    week: "Weeks 7–9", label: "Phase 2: Sub-27:30", sessions: "3×/week", color: "#f5c518",
    goal: "Bridge from sub-30 to 25:00 target",
    runs: [
      { day: "Mon", type: "Interval training", detail: "6×400m at hard effort (roughly your target 5km pace or faster) with 90s rest between. Focus on consistent splits." },
      { day: "Wed", type: "Easy 5km", detail: "True easy pace — this is pure recovery. Don't race it." },
      { day: "Thu", type: "Tempo 20 min", detail: "5 min easy → 20 min at 75–80% effort (5:00–5:30/km target zone) → 5 min easy." },
    ],
    note: "Target pace for 25:00 is 5:00/km. At this phase you're aiming to hold 5:15–5:30/km for intervals.",
  },
  {
    week: "Weeks 10–12", label: "Phase 3: Sub-25:00 🎯", sessions: "3×/week", color: "#ff6b35",
    goal: "Run 5km in 25:00 (5:00/km pace)",
    runs: [
      { day: "Mon", type: "800m repeats", detail: "5×800m at 4:45–4:55/km pace with 2 min rest. This is your race pace work." },
      { day: "Wed", type: "Easy 5km", detail: "Slow and easy. Let legs recover." },
      { day: "Thu", type: "5km time trial", detail: "Go for the 25:00. Start at 5:00/km, hold it. If you fade after 3km you went out too fast." },
    ],
    note: "Hitting 25:00 here is a real achievement. If the ankle or body needs more time, extend this phase — there is no rush.",
  },
  {
    week: "Beyond 25:00", label: "Phase 4: Sub-22:30 🏆", sessions: "3×/week", color: "#f472b6",
    goal: "Run 5km in 22:30 (4:30/km pace)",
    runs: [
      { day: "Mon", type: "1km repeats", detail: "4×1km at 4:20–4:30/km with 2–3 min rest. Hard but controlled." },
      { day: "Wed", type: "Tempo 25 min", detail: "5 min easy → 25 min at 4:35–4:45/km → 5 min easy." },
      { day: "Thu", type: "5km time trial", detail: "Race it. Target 4:30/km from the gun. This level takes real fitness." },
    ],
    note: "22:30 is a strong recreational time — requires proper aerobic base and consistency. Realistically 3–5 months after hitting 25:00.",
  },
];

const weekOverview = [
  { day: "Mon", gym: "Push A", run: "Easy 20–25 min", surf: false },
  { day: "Tue", gym: "Pull A", run: "Rest", surf: false },
  { day: "Wed", gym: "Legs", run: "Easy 20–25 min", surf: false },
  { day: "Thu", gym: "Rest", run: "Moderate 30 min", surf: false },
  { day: "Fri", gym: "Push B / Surf", run: "Optional", surf: true },
  { day: "Sat", gym: "Pull B / Surf", run: "Optional", surf: true },
  { day: "Sun", gym: "Rest", run: "Optional easy", surf: true },
];

export default function App() {
  const [activeDay, setActiveDay] = useState("Monday");
  const [activeGym, setActiveGym] = useState("Push Day");
  const [tab, setTab] = useState("schedule");
  const [openPhase, setOpenPhase] = useState(null);

  const d = schedule[activeDay];
  const g = gymPlans[activeGym];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#03060f",
      color: "#d6eeff",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      padding: "0 0 60px",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #04111f 0%, #020a16 100%)",
        borderBottom: "1px solid #2a2d3a",
        padding: "28px 24px 20px",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#3d6e96", textTransform: "uppercase", marginBottom: 6 }}>Training Program</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", color: "#e8f4ff" }}>Gargame's Plan</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#3d6e96" }}>Strength · Aesthetics · Running · Recovery</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid #1e2130", background: "#050d1a" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 0 }}>
          {[
            { key: "schedule", label: "Weekly Schedule" },
            { key: "gym", label: "Gym Plans" },
            { key: "running", label: "Running Plan" },
            { key: "overview", label: "Week Overview" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 18px", fontSize: 13, fontWeight: 500,
              color: tab === t.key ? "#e8f4ff" : "#2a4f6e",
              borderBottom: tab === t.key ? "2px solid #ff6b35" : "2px solid transparent",
              transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>

        {/* SCHEDULE TAB */}
        {tab === "schedule" && (
          <>
            {/* Day selector */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {days.map(day => (
                <button key={day} onClick={() => setActiveDay(day)} style={{
                  background: activeDay === day ? "#0e2040" : "transparent",
                  border: activeDay === day ? "1px solid #3a3d4e" : "1px solid #2a2d3a",
                  borderRadius: 8, padding: "8px 14px", cursor: "pointer",
                  color: activeDay === day ? "#e8f4ff" : "#3d6e96",
                  fontSize: 13, fontWeight: 500, transition: "all 0.15s",
                }}>
                  {day.slice(0, 3)}
                  <span style={{
                    marginLeft: 6, fontSize: 10, padding: "2px 6px", borderRadius: 4,
                    background: schedule[day].tagColor + "22",
                    color: schedule[day].tagColor, fontWeight: 700, letterSpacing: "0.05em",
                  }}>{schedule[day].tag}</span>
                </button>
              ))}
            </div>

            {/* Day header */}
            <div style={{ background: "#0b1a2e", borderRadius: 12, padding: "20px 22px", marginBottom: 16, border: "1px solid #2a2d3a" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#e8f4ff" }}>{activeDay}</div>
                  <div style={{ fontSize: 13, color: "#3d6e96", marginTop: 2 }}>{d.type}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "#3d6e96" }}>🌙 Bed <span style={{ color: "#e8f4ff", fontWeight: 600 }}>{d.bed}</span></div>
                  <div style={{ fontSize: 12, color: "#3d6e96", marginTop: 2 }}>☀️ Wake <span style={{ color: "#e8f4ff", fontWeight: 600 }}>{d.wake}</span></div>
                </div>
              </div>
            </div>

            {/* Sessions */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "#2a4f6e", marginBottom: 10 }}>Sessions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {d.sessions.map((s, i) => (
                  <div key={i} style={{
                    background: "#071221", border: "1px solid #2a2d3a", borderRadius: 10,
                    padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <span style={{ fontSize: 20 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, color: "#3d6e96" }}>{s.time}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#d6eeff" }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meals */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "#2a4f6e", marginBottom: 10 }}>Meal Timing</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {d.meals.map((m, i) => (
                  <div key={i} style={{
                    background: "#071221", border: "1px solid #2a2d3a", borderRadius: 10,
                    padding: "12px 16px", display: "grid", gridTemplateColumns: "56px 1fr",
                    alignItems: "start", gap: 12,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#c084fc", paddingTop: 1 }}>{m.time}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#d6eeff" }}>{m.label}</div>
                      <div style={{ fontSize: 12, color: "#3d6e96", marginTop: 2 }}>{m.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div style={{
              background: "#0b1a2e", borderLeft: "3px solid #ff6b35",
              borderRadius: "0 10px 10px 0", padding: "14px 16px",
            }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "#ff6b35", marginBottom: 4 }}>Day Notes</div>
              <div style={{ fontSize: 13, color: "#a0a8b8", lineHeight: 1.6 }}>{d.note}</div>
            </div>
          </>
        )}

        {/* GYM TAB */}
        {tab === "gym" && (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {Object.keys(gymPlans).map(plan => (
                <button key={plan} onClick={() => setActiveGym(plan)} style={{
                  background: activeGym === plan ? "#0e2040" : "transparent",
                  border: `1px solid ${activeGym === plan ? gymPlans[plan].color + "66" : "#0f2d4a"}`,
                  borderRadius: 8, padding: "8px 14px", cursor: "pointer",
                  color: activeGym === plan ? gymPlans[plan].color : "#3d6e96",
                  fontSize: 13, fontWeight: 500, transition: "all 0.15s",
                }}>{plan}</button>
              ))}
            </div>

            <div style={{
              background: "#0b1a2e", borderRadius: 12, padding: "18px 20px",
              marginBottom: 16, borderLeft: `3px solid ${g.color}`,
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#e8f4ff" }}>{activeGym}</div>
              <div style={{ fontSize: 12, color: "#3d6e96", marginTop: 2 }}>
                {activeGym.includes("Push") ? "Chest · Shoulders · Triceps" :
                 activeGym.includes("Pull") ? "Back · Biceps · Rear Delts" :
                 "Quads · Hamstrings · Glutes · Calves"}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {g.exercises.map((ex, i) => (
                <div key={i} style={{
                  background: "#071221", border: "1px solid #2a2d3a", borderRadius: 12,
                  padding: "14px 18px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#d6eeff" }}>
                      <span style={{ color: g.color, fontSize: 12, marginRight: 8, fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</span>
                      {ex.name}
                    </div>
                    <div style={{
                      fontSize: 12, fontWeight: 700, color: g.color,
                      background: g.color + "18", padding: "4px 10px", borderRadius: 6, whiteSpace: "nowrap",
                    }}>{ex.sets}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#5b8db8", marginTop: 6 }}>⚖️ {ex.weight}</div>
                  {ex.note && <div style={{ fontSize: 12, color: "#2a4f6e", marginTop: 4, fontStyle: "italic" }}>💡 {ex.note}</div>}
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 20, background: "#0b1a2e", borderRadius: 12,
              padding: "16px 18px", border: "1px solid #2a2d3a",
            }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "#2a4f6e", marginBottom: 10 }}>General Training Tips</div>
              {[
                "Rest 60–90s between isolation sets, 2–3 min between compound sets",
                "Progressive overload: aim to add 2.5–5kg or 1–2 reps every 1–2 weeks",
                "Log your weights — even just in your phone notes",
                "Warm up with 50% of working weight for 15 reps before compound lifts",
                "Protein target: ~1.6–2g per kg bodyweight per day",
              ].map((tip, i) => (
                <div key={i} style={{ fontSize: 13, color: "#5b8db8", marginBottom: 8, paddingLeft: 14, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: "#ff6b35" }}>›</span>{tip}
                </div>
              ))}
            </div>
          </>
        )}

        {/* RUNNING TAB */}
        {tab === "running" && (
          <>
            {/* Goal banner */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Phase 1 Goal", time: "Sub 25:00", pace: "5:00/km", color: "#ff6b35" },
                { label: "Phase 2 Goal", time: "Sub 22:30", pace: "4:30/km", color: "#f472b6" },
              ].map((g, i) => (
                <div key={i} style={{
                  flex: 1, background: "#071221", border: `1px solid ${g.color}44`,
                  borderRadius: 12, padding: "14px 16px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: g.color, marginBottom: 4 }}>{g.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#e8f4ff", letterSpacing: "-0.02em" }}>{g.time}</div>
                  <div style={{ fontSize: 11, color: "#3d6e96", marginTop: 2 }}>{g.pace}</div>
                </div>
              ))}
            </div>

            <div style={{
              background: "#0b1a2e", borderRadius: 12, padding: "14px 18px",
              marginBottom: 20, borderLeft: "3px solid #c084fc",
            }}>
              <div style={{ fontSize: 13, color: "#5b8db8", lineHeight: 1.7 }}>
                🦶 <strong style={{ color: "#e8f4ff" }}>Ankle first.</strong> Weeks 1–2 are tests not training. Every phase beyond that builds pace through intervals and tempo work — not just logging km. All 3 runs/week are purposeful.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
              {runningPlan.map((r, i) => {
                const open = openPhase === i;
                return (
                  <div key={i} style={{
                    background: "#071221", border: `1px solid ${open ? r.color + "44" : "#0f2d4a"}`,
                    borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s",
                  }}>
                    <div onClick={() => setOpenPhase(open ? null : i)} style={{
                      padding: "14px 18px", cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#e8f4ff" }}>{r.week}</span>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 5,
                            background: r.color + "22", color: r.color, letterSpacing: "0.05em",
                          }}>{r.label}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#3d6e96" }}>{r.goal}</div>
                      </div>
                      <span style={{ color: "#2a4f6e", fontSize: 18 }}>{open ? "−" : "+"}</span>
                    </div>
                    {open && (
                      <div style={{ padding: "0 18px 16px", borderTop: "1px solid #2a2d3a" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                          {r.runs.map((run, j) => (
                            <div key={j} style={{
                              background: "#0b1a2e", borderRadius: 8, padding: "10px 14px",
                              display: "grid", gridTemplateColumns: "36px 110px 1fr", gap: 8, alignItems: "start",
                            }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: r.color }}>{run.day}</div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#d6eeff" }}>{run.type}</div>
                              <div style={{ fontSize: 12, color: "#3d6e96", lineHeight: 1.5 }}>{run.detail}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ fontSize: 12, color: "#2a4f6e", marginTop: 10, fontStyle: "italic", paddingLeft: 4 }}>
                          💡 {r.note}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ background: "#0b1a2e", borderRadius: 12, padding: "16px 18px", border: "1px solid #2a2d3a" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "#2a4f6e", marginBottom: 10 }}>Running Rules</div>
              {[
                "Surf counts as cardio — skip the run on swell days, no guilt",
                "Always do ankle mobility BEFORE running — don't skip this",
                "Easy runs must be easy — resist the urge to race every session",
                "The intervals and tempo runs are what actually drop your time",
                "Log every 5km time trial — you need to see the progress",
                "Swelling or sharp ankle pain after a run = drop to walking for 2 days",
                "Strand beach flat sand runs are great for ankle rehab when you're ready",
              ].map((tip, i) => (
                <div key={i} style={{ fontSize: 13, color: "#5b8db8", marginBottom: 8, paddingLeft: 14, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: "#c084fc" }}>›</span>{tip}
                </div>
              ))}
            </div>
          </>
        )}

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "#2a4f6e", marginBottom: 12 }}>Weekly Split at a Glance</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {weekOverview.map((w, i) => (
                  <div key={i} style={{
                    background: "#071221", border: "1px solid #2a2d3a", borderRadius: 10,
                    padding: "12px 16px", display: "grid", gridTemplateColumns: "40px 1fr 1fr",
                    alignItems: "center", gap: 12,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#ff6b35" }}>{w.day}</div>
                    <div>
                      <div style={{ fontSize: 11, color: "#2a4f6e" }}>Gym</div>
                      <div style={{ fontSize: 13, color: "#d6eeff", fontWeight: 500 }}>{w.gym} {w.surf ? "🌊" : ""}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#2a4f6e" }}>Run</div>
                      <div style={{ fontSize: 13, color: w.run === "Rest" ? "#2a4f6e" : "#7ddcf0", fontWeight: 500 }}>{w.run}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#0b1a2e", borderRadius: 12, padding: "18px 20px", marginBottom: 16, border: "1px solid #2a2d3a" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e8f4ff", marginBottom: 12 }}>Sleep Guidelines</div>
              {[
                { label: "Mon–Thu", wake: "06:00–06:30", bed: "22:00", hours: "~7.5–8h" },
                { label: "Fri–Sat", wake: "07:00", bed: "23:00", hours: "~8h" },
                { label: "Sunday", wake: "07:30", bed: "22:00", hours: "~8.5h (reset)" },
              ].map((s, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "10px 0", borderBottom: i < 2 ? "1px solid #2a2d3a" : "none",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#d6eeff" }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: "#5b8db8" }}>Wake {s.wake} · Bed {s.bed}</div>
                  <div style={{ fontSize: 12, color: "#f5c518", fontWeight: 600 }}>{s.hours}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#0b1a2e", borderRadius: 12, padding: "18px 20px", border: "1px solid #2a2d3a" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e8f4ff", marginBottom: 12 }}>Key Principles</div>
              {[
                "🌊 Surf always wins — never force gym or run on a good swell day",
                "🏋️ 4 gym sessions/week max (Push A, Pull A, Legs, + one B session)",
                "🏃 3 runs/week, all easy in weeks 1–2 while ankle adapts",
                "🦵 Mobility every morning — this is non-negotiable for ankle rehab",
                "😴 Protect sleep windows — it's where the gains actually happen",
                "🥩 Get your protein in — aim for 130–160g/day depending on bodyweight",
                "📈 Track your lifts — progress is invisible without a log",
                "🧍 Balance drills daily — single-leg stands, ankle circles, eyes-closed balance (especially critical post ankle sprain)",
                "❤️ Zone 2 note: surfing counts — 20hrs/month of paddling already covers most of your 150 min/week Zone 2 target",
                "⚡ Zone 4/5: Garmin Coach will introduce this naturally — Norwegian 4×4 protocol from ~week 9",
                "🦴 Hip + thoracic spine mobility added to every morning — not optional",
              ].map((p, i) => (
                <div key={i} style={{ fontSize: 13, color: "#5b8db8", marginBottom: 8, lineHeight: 1.5 }}>{p}</div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
