import React, { useState, useEffect } from "react";
// ─── DESIGN SYSTEM ────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:#0f1117; --ink-soft:#3a3d4a; --ink-faint:#7c8091;
    --surface:#f5f4f0; --card:#ffffff; --border:#e2e0d9;
    --teal:#0b7c6e; --teal-lt:#e6f4f2; --teal-mid:#c2e8e3;
    --amber:#d97706; --amber-lt:#fef3c7;
    --rose:#be123c; --rose-lt:#ffe4e6;
    --indigo:#4338ca; --indigo-lt:#eef2ff;
    --green:#16a34a; --green-lt:#dcfce7;
    --purple:#7c3aed; --purple-lt:#ede9fe;
    --radius:12px; --radius-lg:20px;
    --shadow:0 2px 12px rgba(0,0,0,.07); --shadow-md:0 6px 28px rgba(0,0,0,.11);
    --font-display:'DM Serif Display',serif;
    --font-body:'Outfit',sans-serif;
    --font-mono:'DM Mono',monospace;
  }

  body { background:var(--surface); color:var(--ink); font-family:var(--font-body); min-height:100vh; font-size:15px; line-height:1.6; }
  .app-shell { display:flex; min-height:100vh; }

  .sidebar { width:240px; min-height:100vh; background:var(--ink); color:#fff; display:flex; flex-direction:column; position:sticky; top:0; flex-shrink:0; }
  .sidebar-brand { padding:26px 22px 18px; border-bottom:1px solid rgba(255,255,255,.08); }
  .sidebar-brand .logo-mark { width:38px; height:38px; background:var(--teal); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:19px; margin-bottom:10px; }
  .sidebar-brand h1 { font-family:var(--font-display); font-size:18px; font-weight:400; line-height:1.2; }
  .sidebar-brand p { font-size:10px; color:rgba(255,255,255,.35); font-family:var(--font-mono); margin-top:2px; letter-spacing:.06em; text-transform:uppercase; }
  .sidebar-nav { flex:1; padding:14px 10px; display:flex; flex-direction:column; gap:2px; overflow-y:auto; }
  .nav-label { font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.28); font-family:var(--font-mono); padding:10px 12px 5px; }
  .nav-item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:8px; cursor:pointer; font-size:13.5px; font-weight:500; color:rgba(255,255,255,.55); transition:all .15s; border:none; background:none; width:100%; text-align:left; }
  .nav-item:hover { background:rgba(255,255,255,.07); color:#fff; }
  .nav-item.active { background:var(--teal); color:#fff; }
  .nav-item .icon { font-size:15px; flex-shrink:0; }
  .sidebar-footer { padding:14px 10px; border-top:1px solid rgba(255,255,255,.08); }

  .main-content { flex:1; display:flex; flex-direction:column; overflow-x:hidden; }
  .topbar { background:var(--card); border-bottom:1px solid var(--border); padding:0 32px; height:60px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:10; }
  .topbar-left { display:flex; align-items:center; gap:12px; }
  .topbar h2 { font-family:var(--font-display); font-weight:400; font-size:20px; }
  .topbar-right { display:flex; align-items:center; gap:12px; }
  .avatar { width:34px; height:34px; background:var(--teal-lt); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:var(--teal); flex-shrink:0; }
  .topbar-user { font-size:13px; color:var(--ink-soft); text-align:right; }
  .topbar-user strong { display:block; font-size:14px; color:var(--ink); font-weight:600; }

  .page { padding:28px 32px; }
  .page-header { margin-bottom:24px; }
  .page-header h3 { font-family:var(--font-display); font-size:26px; font-weight:400; color:var(--ink); }
  .page-header p { color:var(--ink-faint); margin-top:4px; font-size:14px; }

  .card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; box-shadow:var(--shadow); }
  .card-title { font-size:11px; font-family:var(--font-mono); text-transform:uppercase; letter-spacing:.08em; color:var(--ink-faint); margin-bottom:8px; }
  .card-value { font-family:var(--font-display); font-size:34px; color:var(--ink); line-height:1; }
  .card-sub { font-size:13px; color:var(--ink-faint); margin-top:6px; }

  .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
  .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .grid-2 { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }
  .grid-auto { display:grid; grid-template-columns:2fr 1fr; gap:20px; }

  .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11.5px; font-weight:500; font-family:var(--font-mono); }
  .badge-teal   { background:var(--teal-lt); color:var(--teal); }
  .badge-amber  { background:var(--amber-lt); color:var(--amber); }
  .badge-rose   { background:var(--rose-lt); color:var(--rose); }
  .badge-indigo { background:var(--indigo-lt); color:var(--indigo); }
  .badge-green  { background:var(--green-lt); color:var(--green); }
  .badge-purple { background:var(--purple-lt); color:var(--purple); }
  .badge-gray   { background:#f1f1f1; color:var(--ink-soft); }

  .btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:9px 18px; border-radius:var(--radius); font-family:var(--font-body); font-size:14px; font-weight:500; cursor:pointer; border:none; transition:all .15s; }
  .btn-primary { background:var(--teal); color:#fff; }
  .btn-primary:hover { background:#096358; }
  .btn-outline { background:transparent; border:1px solid var(--border); color:var(--ink-soft); }
  .btn-outline:hover { border-color:var(--ink-soft); color:var(--ink); }
  .btn-danger { background:var(--rose-lt); color:var(--rose); }
  .btn-purple { background:var(--purple-lt); color:var(--purple); }
  .btn-sm { padding:5px 12px; font-size:12.5px; }

  .table-wrap { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; }
  thead th { text-align:left; font-size:11px; font-family:var(--font-mono); text-transform:uppercase; letter-spacing:.08em; color:var(--ink-faint); padding:10px 16px; border-bottom:1px solid var(--border); background:var(--surface); }
  tbody tr { border-bottom:1px solid var(--border); }
  tbody tr:last-child { border-bottom:none; }
  tbody tr:hover { background:var(--surface); }
  tbody td { padding:13px 16px; font-size:14px; }

  .form-group { margin-bottom:18px; }
  .form-label { display:block; font-size:13px; font-weight:500; color:var(--ink-soft); margin-bottom:5px; }
  .form-input { width:100%; padding:10px 14px; border:1.5px solid var(--border); border-radius:var(--radius); font-family:var(--font-body); font-size:14px; background:var(--card); color:var(--ink); outline:none; transition:border .15s; }
  .form-input:focus { border-color:var(--teal); }
  .form-select { width:100%; padding:10px 14px; border:1.5px solid var(--border); border-radius:var(--radius); font-family:var(--font-body); font-size:14px; background:var(--card); color:var(--ink); outline:none; cursor:pointer; }
  .form-select:focus { border-color:var(--teal); }
  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

  .timeline { position:relative; padding-left:28px; }
  .timeline::before { content:''; position:absolute; left:8px; top:0; bottom:0; width:2px; background:var(--border); }
  .timeline-item { position:relative; margin-bottom:20px; }
  .timeline-dot { position:absolute; left:-24px; top:4px; width:14px; height:14px; border-radius:50%; background:var(--teal); border:2px solid var(--card); box-shadow:0 0 0 2px var(--teal); }
  .timeline-date { font-size:11px; font-family:var(--font-mono); color:var(--ink-faint); margin-bottom:4px; }
  .timeline-title { font-weight:600; font-size:14px; }
  .timeline-sub { font-size:13px; color:var(--ink-soft); margin-top:2px; }

  .consent-item { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border:1px solid var(--border); border-radius:var(--radius); margin-bottom:10px; background:var(--card); }
  .consent-name { font-weight:600; font-size:14px; }
  .consent-meta { font-size:12px; color:var(--ink-faint); font-family:var(--font-mono); }

  .stat-accent { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; margin-bottom:12px; }
  .accent-teal   { background:var(--teal-lt); }
  .accent-amber  { background:var(--amber-lt); }
  .accent-rose   { background:var(--rose-lt); }
  .accent-indigo { background:var(--indigo-lt); }
  .accent-green  { background:var(--green-lt); }
  .accent-purple { background:var(--purple-lt); }

  .tx-hash { font-family:var(--font-mono); font-size:11.5px; color:var(--teal); background:var(--teal-lt); padding:2px 8px; border-radius:6px; }

  .divider { height:1px; background:var(--border); margin:20px 0; }
  .section-title { font-size:14px; font-weight:600; color:var(--ink); margin-bottom:14px; display:flex; align-items:center; gap:8px; }

  .alert { display:flex; align-items:flex-start; gap:10px; padding:12px 16px; border-radius:var(--radius); font-size:14px; margin-bottom:16px; }
  .alert-info    { background:var(--indigo-lt); color:var(--indigo); border:1px solid #c7d2fe; }
  .alert-success { background:var(--teal-lt); color:var(--teal); border:1px solid var(--teal-mid); }
  .alert-warn    { background:var(--amber-lt); color:var(--amber); border:1px solid #fde68a; }
  .alert-danger  { background:var(--rose-lt); color:var(--rose); border:1px solid #fecdd3; }

  .search-bar { position:relative; }
  .search-bar input { padding-left:36px; }
  .search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--ink-faint); font-size:15px; pointer-events:none; }

  .abha-card { background:linear-gradient(135deg,#0b7c6e 0%,#065f52 100%); border-radius:16px; padding:24px; color:white; position:relative; overflow:hidden; }
  .abha-card::before { content:''; position:absolute; width:200px; height:200px; background:rgba(255,255,255,.06); border-radius:50%; right:-60px; top:-60px; }
  .abha-card::after  { content:''; position:absolute; width:120px; height:120px; background:rgba(255,255,255,.04); border-radius:50%; right:40px; bottom:-40px; }
  .abha-label { font-size:10px; letter-spacing:.12em; text-transform:uppercase; opacity:.6; font-family:var(--font-mono); margin-bottom:4px; }
  .abha-id    { font-family:var(--font-mono); font-size:18px; font-weight:500; letter-spacing:.1em; margin-bottom:18px; }
  .abha-name  { font-family:var(--font-display); font-size:20px; font-weight:400; }
  .abha-dob   { font-size:12px; opacity:.6; margin-top:2px; }

  .vital-row { display:flex; align-items:center; justify-content:space-between; padding:9px 0; border-bottom:1px solid var(--border); }
  .vital-row:last-child { border-bottom:none; }
  .vital-label { font-size:13px; color:var(--ink-soft); }
  .vital-value { font-family:var(--font-mono); font-size:15px; font-weight:500; color:var(--ink); }
  .vital-unit  { font-size:11px; color:var(--ink-faint); }

  .qr-box { background:white; border:1px solid var(--border); border-radius:12px; padding:16px; display:inline-flex; flex-direction:column; align-items:center; gap:8px; }

  .ai-bubble { background:linear-gradient(135deg,var(--indigo-lt),var(--purple-lt)); border:1px solid #c4b5fd; border-radius:var(--radius-lg); padding:20px; position:relative; overflow:hidden; }
  .ai-bubble::before { content:'✦'; position:absolute; right:18px; top:12px; font-size:28px; opacity:.15; }

  .risk-card { border-radius:var(--radius); padding:16px; border:1px solid; margin-bottom:10px; }
  .risk-low    { background:#f0fdf4; border-color:#bbf7d0; }
  .risk-medium { background:var(--amber-lt); border-color:#fde68a; }
  .risk-high   { background:var(--rose-lt); border-color:#fecdd3; }
  .risk-bar { height:6px; border-radius:3px; background:var(--border); overflow:hidden; margin-top:8px; }
  .risk-fill { height:100%; border-radius:3px; transition:width .8s ease; }

  .reminder-item { display:flex; align-items:center; gap:12px; padding:12px 14px; border:1px solid var(--border); border-radius:var(--radius); margin-bottom:8px; background:var(--card); }
  .reminder-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:17px; flex-shrink:0; }

  .tab-bar { display:flex; gap:2px; border-bottom:1px solid var(--border); margin-bottom:24px; flex-wrap:wrap; }
  .tab-btn { padding:10px 16px; background:none; border:none; cursor:pointer; font-family:var(--font-body); font-size:13.5px; font-weight:500; color:var(--ink-faint); border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .15s; white-space:nowrap; }
  .tab-btn.active { color:var(--teal); border-bottom-color:var(--teal); }

  .login-page { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; }
  .login-left { background:var(--ink); display:flex; flex-direction:column; justify-content:center; align-items:flex-start; padding:64px; position:relative; overflow:hidden; }
  .login-left::before { content:''; position:absolute; width:400px; height:400px; background:radial-gradient(circle,rgba(11,124,110,.35) 0%,transparent 70%); bottom:-100px; right:-100px; pointer-events:none; }
  .login-logo { width:52px; height:52px; background:var(--teal); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:26px; margin-bottom:28px; }
  .login-left h1 { font-family:var(--font-display); font-size:42px; color:#fff; line-height:1.1; margin-bottom:14px; font-weight:400; white-space:pre-line; }
  .login-left p  { color:rgba(255,255,255,.5); font-size:15px; max-width:340px; line-height:1.7; }
  .login-features { margin-top:32px; display:flex; flex-direction:column; gap:11px; }
  .login-feature  { display:flex; align-items:center; gap:10px; color:rgba(255,255,255,.6); font-size:14px; }
  .login-feature span:first-child { width:28px; height:28px; background:rgba(255,255,255,.08); border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .login-right { display:flex; align-items:flex-start; justify-content:center; padding:48px 64px; background:var(--surface); overflow-y:auto; }
  .login-form-box { width:100%; max-width:400px; margin:auto 0; }
  .login-form-box h2 { font-family:var(--font-display); font-size:28px; font-weight:400; margin-bottom:6px; }
  .login-form-box > p { color:var(--ink-faint); margin-bottom:28px; font-size:14px; }
  .role-picker { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:22px; }
  .role-btn { padding:10px 4px; border-radius:var(--radius); border:1.5px solid var(--border); background:var(--card); cursor:pointer; text-align:center; font-size:12px; font-weight:500; color:var(--ink-soft); transition:all .15s; }
  .role-btn .role-icon { font-size:19px; display:block; margin-bottom:4px; }
  .role-btn.active { border-color:var(--teal); background:var(--teal-lt); color:var(--teal); }
  .otp-boxes { display:flex; gap:10px; }
  .otp-box { flex:1; height:52px; border:1.5px solid var(--border); border-radius:var(--radius); text-align:center; font-size:22px; font-family:var(--font-mono); font-weight:500; background:var(--card); color:var(--ink); outline:none; }
  .otp-box:focus { border-color:var(--teal); }

  .step-row { display:flex; align-items:center; margin-bottom:26px; }

  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }

  .mb-0{margin-bottom:0} .mb-4{margin-bottom:4px} .mb-8{margin-bottom:8px}
  .mb-12{margin-bottom:12px} .mb-16{margin-bottom:16px} .mb-20{margin-bottom:20px} .mb-24{margin-bottom:24px}
  .mt-8{margin-top:8px} .mt-12{margin-top:12px} .mt-16{margin-top:16px} .mt-20{margin-top:20px}
  .flex{display:flex} .items-center{align-items:center} .justify-between{justify-content:space-between}
  .gap-8{gap:8px} .gap-12{gap:12px} .gap-16{gap:16px} .gap-20{gap:20px}
  .w-full{width:100%} .text-sm{font-size:13px} .text-xs{font-size:11.5px}
  .text-faint{color:var(--ink-faint)} .text-teal{color:var(--teal)}
  .font-mono{font-family:var(--font-mono)} .font-600{font-weight:600}

  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  .fade-up   { animation:fadeUp .35s ease both; }
  .fade-up-1 { animation-delay:.05s; }
  .fade-up-2 { animation-delay:.10s; }
  .fade-up-3 { animation-delay:.15s; }
  .fade-up-4 { animation-delay:.20s; }
  @keyframes spin { to{transform:rotate(360deg)} }
  .spin { animation:spin 1s linear infinite; display:inline-block; }
`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_PATIENTS = [
  { id:1, name:"Priya Sharma",  abha:"91-1234-5678-0001", age:34, gender:"F", phone:"+91 98765 43210", blood:"B+",  status:"active",   bmi:27.4, glucose:112, bp:"128/82", weight:72 },
  { id:2, name:"Rajan Mehta",   abha:"91-2345-6789-0002", age:52, gender:"M", phone:"+91 87654 32109", blood:"O+",  status:"active",   bmi:31.2, glucose:148, bp:"142/90", weight:94 },
  { id:3, name:"Ananya Iyer",   abha:"91-3456-7890-0003", age:28, gender:"F", phone:"+91 76543 21098", blood:"A-",  status:"active",   bmi:21.1, glucose:88,  bp:"110/70", weight:56 },
  { id:4, name:"Suresh Kumar",  abha:"91-4567-8901-0004", age:61, gender:"M", phone:"+91 65432 10987", blood:"AB+", status:"inactive", bmi:29.8, glucose:136, bp:"138/86", weight:88 },
];
const MOCK_RECORDS = [
  { date:"12 Mar 2025", type:"Visit",        title:"General Checkup",    provider:"Dr. A. Nair — City Hospital", tx:"0xA3f9…C12" },
  { date:"28 Jan 2025", type:"Lab",          title:"CBC + Lipid Profile", provider:"LifeLabs Diagnostics",        tx:"0xB7d2…E45" },
  { date:"14 Jan 2025", type:"Prescription", title:"Metformin 500mg",     provider:"Dr. A. Nair — City Hospital", tx:"0xC1a0…F78" },
  { date:"05 Nov 2024", type:"Imaging",      title:"Chest X-Ray",         provider:"Apollo Radiology",            tx:"0xD5b3…A23" },
];
const MOCK_CONSENTS = [
  { id:1, grantee:"Dr. Anjali Nair",  facility:"City Hospital",      scope:"Full Records", expires:"31 Dec 2025", active:true  },
  { id:2, grantee:"LifeLabs Diag.",   facility:"Diagnostics Centre", scope:"Lab Results",  expires:"15 Jun 2025", active:true  },
  { id:3, grantee:"Apollo Radiology", facility:"Apollo Hospitals",   scope:"Imaging Only", expires:"10 Feb 2025", active:false },
];
const MOCK_PROVIDERS = [
  { id:1, name:"Dr. Anjali Nair",      specialty:"Internal Medicine", facility:"City Hospital",     hfr:"HFR-MH-00123", status:"verified", patients:142 },
  { id:2, name:"LifeLabs Diagnostics", specialty:"Pathology Lab",     facility:"Diagnostic Centre", hfr:"HFR-MH-00456", status:"verified", patients:0   },
  { id:3, name:"Dr. Pradeep Rao",      specialty:"Cardiology",        facility:"Heart Care",        hfr:"HFR-MH-00789", status:"pending",  patients:87  },
  { id:4, name:"Apollo Radiology",     specialty:"Radiology",         facility:"Apollo Hospitals",  hfr:"HFR-MH-01012", status:"verified", patients:0   },
];
const MOCK_AUDIT = [
  { ts:"2025-03-12 09:14", actor:"Dr. A. Nair",     action:"Record Accessed",    resource:"Visit Notes",   tx:"0xA3f9…C12" },
  { ts:"2025-03-12 09:10", actor:"Priya Sharma",     action:"Consent Granted",    resource:"Dr. A. Nair",   tx:"0xA3f8…B09" },
  { ts:"2025-01-28 11:32", actor:"LifeLabs",         action:"Report Uploaded",    resource:"CBC Report",    tx:"0xB7d2…E45" },
  { ts:"2025-01-14 14:05", actor:"Dr. A. Nair",      action:"Prescription Added", resource:"Metformin 500", tx:"0xC1a0…F78" },
  { ts:"2024-11-05 10:20", actor:"Apollo Radiology", action:"Image Uploaded",     resource:"Chest X-Ray",   tx:"0xD5b3…A23" },
];
const VITALS_HISTORY = {
  labels:   ["Oct","Nov","Dec","Jan","Feb","Mar"],
  glucose:  [98, 104, 108, 102, 109, 112],
  systolic: [118, 122, 125, 120, 124, 128],
  weight:   [68, 69, 70, 71, 71.5, 72],
  heartRate:[72, 74, 71, 73, 70, 72],
};
const MOCK_REMINDERS = [
  { id:1, type:"Medication",   text:"Metformin 500mg — after breakfast", time:"08:00 AM",          color:"var(--teal-lt)" },
  { id:2, type:"Medication",   text:"Aspirin 75mg — after dinner",       time:"08:00 PM",          color:"var(--teal-lt)" },
  { id:3, type:"Appointment",  text:"Follow-up with Dr. Anjali Nair",    time:"15 Apr · 10:30 AM", color:"var(--indigo-lt)" },
  { id:4, type:"Lab Test",     text:"HbA1c — due for next check",        time:"20 Apr",            color:"var(--amber-lt)" },
];

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accentClass, delay="" }) {
  return (
    <div className={`card fade-up ${delay}`}>
      <div className={`stat-accent ${accentClass}`}>{icon}</div>
      <div className="card-title">{label}</div>
      <div className="card-value">{value}</div>
      {sub && <div className="card-sub">{sub}</div>}
    </div>
  );
}

function RecordTypeBadge({ type }) {
  const m = { Visit:"badge-teal", Lab:"badge-indigo", Prescription:"badge-amber", Imaging:"badge-rose" };
  return <span className={`badge ${m[type]||"badge-gray"}`}>{type}</span>;
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div className="tab-bar">
      {tabs.map(([k,l]) => <button key={k} className={`tab-btn ${active===k?"active":""}`} onClick={()=>onChange(k)}>{l}</button>)}
    </div>
  );
}

// ─── SVG MINI CHART ──────────────────────────────────────────────────────────
function MiniChart({ data, labels, color, unit, title }) {
  const W=320, H=100, pad=28;
  const mn=Math.min(...data)-4, mx=Math.max(...data)+4;
  const pts=data.map((v,i)=>({ x:pad+(i/(data.length-1))*(W-pad*2), y:H-pad-((v-mn)/(mx-mn))*(H-pad*2) }));
  const d=pts.map((p,i)=>`${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ");
  const area=d+` L ${pts[pts.length-1].x} ${H-pad} L ${pts[0].x} ${H-pad} Z`;
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <span style={{fontWeight:600,fontSize:13}}>{title}</span>
        <span className="badge badge-gray">{unit}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",overflow:"visible"}}>
        {[0,1,2].map(i=>{ const y=H-pad-i*((H-pad*2)/2); const v=Math.round(mn+i*((mx-mn)/2)); return <g key={i}><line x1={pad} x2={W-pad} y1={y} y2={y} stroke="var(--border)" strokeWidth="1"/><text x={pad-4} y={y+4} textAnchor="end" fontSize="9" fill="var(--ink-faint)" fontFamily="var(--font-mono)">{v}</text></g>; })}
        {labels.map((l,i)=><text key={i} x={pts[i]?.x} y={H-2} textAnchor="middle" fontSize="9" fill="var(--ink-faint)" fontFamily="var(--font-mono)">{l}</text>)}
        <path d={area} fill={color} opacity=".12"/>
        <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2"/>)}
      </svg>
    </div>
  );
}

// ─── QR CODE (SVG) ───────────────────────────────────────────────────────────
function QRDisplay({ value }) {
  const seed=value.split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  const sz=21, cs=6;
  const cells=[];
  for(let r=0;r<sz;r++) for(let c=0;c<sz;c++) {
    const finder=(r<7&&c<7)||(r<7&&c>13)||(r>13&&c<7);
    const timing=(r===6||c===6)&&!finder;
    let on=finder||((seed*r*c+r*7+c*13)%3===0);
    if(timing) on=(r+c)%2===0;
    cells.push({r,c,on});
  }
  return (
    <div className="qr-box">
      <svg width={sz*cs+8} height={sz*cs+8}>
        <rect width={sz*cs+8} height={sz*cs+8} fill="white"/>
        {cells.map(({r,c,on})=>on?<rect key={`${r}${c}`} x={4+c*cs} y={4+r*cs} width={cs-1} height={cs-1} rx="1" fill="#0f1117"/>:null)}
      </svg>
      <div style={{fontSize:9,fontFamily:"var(--font-mono)",color:"var(--ink-faint)",textAlign:"center",maxWidth:130,wordBreak:"break-all"}}>{value}</div>
    </div>
  );
}

// ─── AI SUMMARY PANEL ────────────────────────────────────────────────────────
function AISummaryPanel({ patient }) {
  const [loading,setLoading]=useState(false);
  const [summary,setSummary]=useState(null);
  const p=patient||MOCK_PATIENTS[0];
  const DEMO=`Patient ${p.name} is a ${p.age}-year-old ${p.gender==="F"?"female":"male"} with 14 health records spanning 18 months.\n\n• Blood glucose has trended upward (now ${p.glucose} mg/dL) — borderline pre-diabetic range. Metformin 500mg is being maintained.\n• Blood pressure at ${p.bp} mmHg — mildly elevated. Lifestyle modification recommended.\n• BMI at ${p.bmi} — overweight range. Weight management counselling advised.\n• CBC from Jan 2025 showed mildly elevated LDL (138 mg/dL). Statin therapy under consideration.\n• No hospitalisations on record. Overall trend: stable with early metabolic risk indicators requiring monitoring.`;
  function generate(){ setLoading(true); setSummary(null); setTimeout(()=>{ setLoading(false); setSummary(DEMO); },2000); }
  return (
    <div className="card fade-up">
      <div className="flex justify-between items-center mb-16">
        <div className="section-title mb-0">🤖 AI Health Summary</div>
        <button className="btn btn-purple btn-sm" onClick={generate} disabled={loading}>{loading?<><span className="spin">⟳</span> Analysing…</>:"✦ Generate Summary"}</button>
      </div>
      {!summary&&!loading&&<div style={{textAlign:"center",padding:"24px 0",color:"var(--ink-faint)"}}><div style={{fontSize:34,marginBottom:8}}>🧠</div><div style={{fontWeight:600,marginBottom:4}}>AI-Powered Health Insights</div><div className="text-sm">Click Generate to analyse all patient records and produce a clinical overview.</div></div>}
      {loading&&<div style={{textAlign:"center",padding:"24px 0",color:"var(--indigo)"}}><div className="spin" style={{fontSize:32,display:"block",marginBottom:8}}>⟳</div><div style={{fontWeight:600}}>Analysing health records…</div><div className="text-sm" style={{marginTop:4}}>Reading 14 records across visits, labs and prescriptions</div></div>}
      {summary&&(
        <div className="ai-bubble">
          <div style={{fontSize:11,fontFamily:"var(--font-mono)",color:"var(--purple)",marginBottom:10,letterSpacing:".06em",textTransform:"uppercase"}}>✦ AI Clinical Summary · Generated just now</div>
          {summary.split("\n").map((line,i)=><p key={i} style={{fontSize:14,lineHeight:1.75,color:"var(--ink-soft)",marginBottom:line.startsWith("•")?4:8}}>{line}</p>)}
          <div style={{marginTop:12,padding:"10px 14px",borderRadius:8,fontSize:12,background:"rgba(217,119,6,.08)",border:"1px solid #fde68a",color:"var(--amber)"}}>⚠️ AI-generated for clinical support only. Not a medical diagnosis.</div>
        </div>
      )}
    </div>
  );
}

// ─── RISK PREDICTION ─────────────────────────────────────────────────────────
function RiskPrediction({ patient }) {
  const [loading,setLoading]=useState(false);
  const [results,setResults]=useState(null);
  const p=patient||MOCK_PATIENTS[0];

  function getRisks(pt) {
    const bmi=pt.bmi||27, gl=pt.glucose||110, age=pt.age||34, sys=parseInt((pt.bp||"120/80").split("/")[0]);
    return [
      { name:"Type 2 Diabetes",      risk:Math.min(99,Math.round(((gl-80)/100)*60+((bmi-20)/20)*30+(age>45?15:0))),   color:"#d97706" },
      { name:"Hypertension",          risk:Math.min(99,Math.round(((sys-100)/80)*70+(age>50?20:0)+(bmi>30?15:0))),     color:"#be123c" },
      { name:"Obesity Complications", risk:Math.min(99,Math.max(0,Math.round(((bmi-18.5)/16)*100))),                   color:"#7c3aed" },
      { name:"Cardiovascular Disease",risk:Math.min(99,Math.round(((gl-80)/100)*25+((sys-100)/80)*30+(age>50?20:5))), color:"#4338ca" },
    ];
  }

  function predict(){ setLoading(true); setResults(null); setTimeout(()=>{ setLoading(false); setResults(getRisks(p)); },1800); }

  function level(r){ return r<30?{label:"Low",cls:"risk-low",c:"var(--green)"}:r<60?{label:"Moderate",cls:"risk-medium",c:"var(--amber)"}:{label:"High",cls:"risk-high",c:"var(--rose)"}; }

  return (
    <div className="card fade-up fade-up-1">
      <div className="flex justify-between items-center mb-16">
        <div className="section-title mb-0">🔬 Disease Risk Prediction</div>
        <button className="btn btn-outline btn-sm" onClick={predict} disabled={loading}>{loading?<span className="spin">⟳</span>:"Run ML Model"}</button>
      </div>
      {!results&&!loading&&<div style={{textAlign:"center",padding:"18px 0",color:"var(--ink-faint)"}}><div style={{fontSize:30,marginBottom:8}}>📊</div><div className="text-sm">Uses BMI, glucose, blood pressure and age via a Random Forest model to predict disease risk.</div></div>}
      {loading&&<div style={{textAlign:"center",padding:"18px 0"}}><div className="spin" style={{fontSize:26,display:"block",marginBottom:8,color:"var(--teal)"}}>⟳</div><div className="text-sm text-faint">Running prediction model…</div></div>}
      {results&&results.map((r,i)=>{ const lv=level(r.risk); return (
        <div key={i} className={`risk-card ${lv.cls}`}>
          <div className="flex justify-between items-center">
            <div style={{fontWeight:600,fontSize:14}}>{r.name}</div>
            <span className="badge" style={{background:"white",color:lv.c,border:`1px solid ${lv.c}55`}}>{lv.label} · {r.risk}%</span>
          </div>
          <div className="risk-bar"><div className="risk-fill" style={{width:`${r.risk}%`,background:r.color}}/></div>
        </div>
      ); })}
      {results&&<div style={{marginTop:10,padding:"9px 14px",borderRadius:8,fontSize:12,background:"rgba(217,119,6,.08)",border:"1px solid #fde68a",color:"var(--amber)"}}>⚠️ Probabilistic estimates only. Not a clinical diagnosis.</div>}
    </div>
  );
}

// ─── HEALTH CHARTS ───────────────────────────────────────────────────────────
function HealthCharts() {
  return (
    <div className="card fade-up">
      <div className="section-title mb-20">📈 Health Trends — Last 6 Months</div>
      <div className="grid-2" style={{gap:28}}>
        <MiniChart data={VITALS_HISTORY.glucose}   labels={VITALS_HISTORY.labels} color="var(--amber)"  unit="mg/dL" title="Blood Glucose"/>
        <MiniChart data={VITALS_HISTORY.systolic}  labels={VITALS_HISTORY.labels} color="var(--rose)"   unit="mmHg"  title="Systolic BP"/>
        <MiniChart data={VITALS_HISTORY.weight}    labels={VITALS_HISTORY.labels} color="var(--indigo)" unit="kg"    title="Body Weight"/>
        <MiniChart data={VITALS_HISTORY.heartRate} labels={VITALS_HISTORY.labels} color="var(--teal)"   unit="bpm"   title="Heart Rate"/>
      </div>
    </div>
  );
}

// ─── REMINDERS PANEL ─────────────────────────────────────────────────────────
function RemindersPanel() {
  const [reminders,setReminders]=useState(MOCK_REMINDERS);
  const [adding,setAdding]=useState(false);
  const [newR,setNewR]=useState({text:"",time:"",type:"Medication"});
  const icons={"Medication":"💊","Appointment":"🩺","Lab Test":"🧪","Other":"🔔"};
  const colors={"Medication":"var(--teal-lt)","Appointment":"var(--indigo-lt)","Lab Test":"var(--amber-lt)","Other":"var(--surface)"};
  function add(){ if(!newR.text) return; setReminders(rs=>[...rs,{id:Date.now(),...newR,color:colors[newR.type]}]); setNewR({text:"",time:"",type:"Medication"}); setAdding(false); }
  return (
    <div className="card fade-up">
      <div className="flex justify-between items-center mb-16">
        <div className="section-title mb-0">⏰ Reminders & Alerts</div>
        <button className="btn btn-outline btn-sm" onClick={()=>setAdding(a=>!a)}>{adding?"Cancel":"+ Add"}</button>
      </div>
      {adding&&(
        <div style={{background:"var(--surface)",borderRadius:"var(--radius)",padding:14,marginBottom:16,border:"1px solid var(--border)"}}>
          <div className="form-row" style={{marginBottom:10}}>
            <div><label className="form-label">Type</label><select className="form-select" value={newR.type} onChange={e=>setNewR(r=>({...r,type:e.target.value}))}>{Object.keys(icons).map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label className="form-label">Time / Date</label><input className="form-input" placeholder="08:00 AM" value={newR.time} onChange={e=>setNewR(r=>({...r,time:e.target.value}))}/></div>
          </div>
          <div style={{marginBottom:10}}><label className="form-label">Reminder</label><input className="form-input" placeholder="e.g. Take Metformin after breakfast" value={newR.text} onChange={e=>setNewR(r=>({...r,text:e.target.value}))}/></div>
          <button className="btn btn-primary btn-sm" onClick={add}>Save</button>
        </div>
      )}
      {reminders.map(r=>(
        <div className="reminder-item" key={r.id}>
          <div className="reminder-icon" style={{background:r.color}}>{icons[r.type]||"🔔"}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:500}}>{r.text}</div>
            <div style={{fontSize:12,color:"var(--ink-faint)",fontFamily:"var(--font-mono)"}}>{r.time}</div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={()=>setReminders(rs=>rs.filter(x=>x.id!==r.id))}>✕</button>
        </div>
      ))}
    </div>
  );
}

// ─── PATIENT DASHBOARD ───────────────────────────────────────────────────────
function PatientDashboard() {
  const [tab,setTab]=useState("overview");
  const [consents,setConsents]=useState(MOCK_CONSENTS);
  function revoke(id){ setConsents(cs=>cs.map(c=>c.id===id?{...c,active:false}:c)); }
  const TABS=[["overview","Overview"],["records","Records"],["ai","🤖 AI Insights"],["charts","📈 Charts"],["consents","Consents"],["reminders","Reminders"],["upload","Upload"],["qr","My QR"]];
  return (
    <>
      <div className="topbar">
        <div className="topbar-left"><div style={{fontSize:18}}>👤</div><h2>Patient Portal</h2></div>
        <div className="topbar-right"><div className="topbar-user"><strong>Priya Sharma</strong><span>ABHA: 91-1234-5678-0001</span></div><div className="avatar">PS</div></div>
      </div>
      <div className="page">
        <div className="page-header">
          <h3>Good morning, Priya 👋</h3>
          <p>Your health records are up to date · <span style={{color:"var(--amber)"}}>⚠ Glucose trending up — check AI Insights</span></p>
        </div>
        <TabBar tabs={TABS} active={tab} onChange={setTab}/>

        {tab==="overview"&&(<>
          <div className="grid-2 mb-20">
            <div className="abha-card fade-up">
              <div className="abha-label">Digital Health Card · ABHA</div>
              <div className="abha-id">91-1234-5678-0001</div>
              <div className="abha-name">Priya Sharma</div>
              <div className="abha-dob">DOB: 14 Aug 1991 · Blood: B+ · Female</div>
              <div style={{marginTop:16,display:"flex",gap:8,flexWrap:"wrap"}}>
                <span className="badge" style={{background:"rgba(255,255,255,.15)",color:"#fff",fontSize:11}}>✓ Aadhaar Linked</span>
                <span className="badge" style={{background:"rgba(255,255,255,.15)",color:"#fff",fontSize:11}}>✓ ABDM Registered</span>
              </div>
            </div>
            <div className="card fade-up fade-up-1">
              <div className="section-title">📊 Latest Vitals <span className="text-xs text-faint font-mono">(12 Mar 2025)</span></div>
              {[["Blood Pressure","128/82","mmHg"],["Heart Rate","72","bpm"],["Blood Glucose","112","mg/dL"],["BMI","27.4","kg/m²"],["SpO₂","98","%"],["Weight","72","kg"]].map(([l,v,u])=>(
                <div className="vital-row" key={l}><span className="vital-label">{l}</span><span><span className="vital-value">{v}</span> <span className="vital-unit">{u}</span></span></div>
              ))}
            </div>
          </div>
          <div className="grid-3 mb-20">
            <StatCard icon="📋" label="Total Records"   value="14" sub="4 visits, 6 labs, 4 prescriptions" accentClass="accent-teal"   delay="fade-up-1"/>
            <StatCard icon="🤝" label="Active Consents" value="2"  sub="2 providers have access"           accentClass="accent-amber"  delay="fade-up-2"/>
            <StatCard icon="⛓️" label="Blockchain Logs" value="14" sub="All records verified on-chain"     accentClass="accent-indigo" delay="fade-up-3"/>
          </div>
          <div className="card fade-up fade-up-4">
            <div className="section-title mb-20">🕒 Recent Activity</div>
            <div className="timeline">
              {MOCK_RECORDS.map((r,i)=>(
                <div className="timeline-item" key={i}><div className="timeline-dot"/><div className="timeline-date">{r.date}</div>
                  <div className="flex items-center gap-8 mb-4"><RecordTypeBadge type={r.type}/><span className="timeline-title">{r.title}</span></div>
                  <div className="timeline-sub">{r.provider}</div><div style={{marginTop:8}}><span className="tx-hash">{r.tx}</span></div>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {tab==="records"&&(
          <div className="card fade-up">
            <div className="flex justify-between items-center mb-20">
              <div className="section-title mb-0">All Health Records</div>
              <div className="search-bar" style={{width:220}}><span className="search-icon">🔍</span><input className="form-input" placeholder="Search…"/></div>
            </div>
            <div className="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Record</th><th>Provider</th><th>TX Hash</th><th></th></tr></thead>
            <tbody>{MOCK_RECORDS.map((r,i)=><tr key={i}><td className="font-mono text-sm text-faint">{r.date}</td><td><RecordTypeBadge type={r.type}/></td><td className="font-600">{r.title}</td><td className="text-sm text-faint">{r.provider}</td><td><span className="tx-hash">{r.tx}</span></td><td><button className="btn btn-outline btn-sm">View</button></td></tr>)}</tbody></table></div>
          </div>
        )}

        {tab==="ai"&&<div style={{display:"flex",flexDirection:"column",gap:20}}><AISummaryPanel patient={MOCK_PATIENTS[0]}/><RiskPrediction patient={MOCK_PATIENTS[0]}/></div>}
        {tab==="charts"&&<HealthCharts/>}

        {tab==="consents"&&(
          <div className="fade-up">
            <div className="alert alert-info mb-20">🔐 All consent events are recorded on the blockchain. Revoking access takes effect immediately.</div>
            <div className="section-title mb-16">Active Consents</div>
            {consents.filter(c=>c.active).map(c=>(
              <div className="consent-item" key={c.id}>
                <div><div className="consent-name">{c.grantee}</div><div className="consent-meta">{c.facility} · {c.scope} · Expires: {c.expires}</div></div>
                <button className="btn btn-danger btn-sm" onClick={()=>revoke(c.id)}>Revoke</button>
              </div>
            ))}
            <div className="section-title mb-16 mt-20">Expired / Revoked</div>
            {consents.filter(c=>!c.active).map(c=><div className="consent-item" key={c.id} style={{opacity:.5}}><div><div className="consent-name">{c.grantee}</div><div className="consent-meta">{c.facility} · {c.scope} · {c.expires}</div></div><span className="badge badge-gray">Revoked</span></div>)}
          </div>
        )}

        {tab==="reminders"&&<RemindersPanel/>}

        {tab==="upload"&&(
          <div className="card fade-up" style={{maxWidth:540}}>
            <div className="section-title mb-20">📤 Upload Health Report</div>
            <div className="form-row mb-12"><div className="form-group mb-0"><label className="form-label">Report Type</label><select className="form-select"><option>Lab Report</option><option>Imaging/Scan</option><option>Prescription</option><option>Discharge Summary</option></select></div><div className="form-group mb-0"><label className="form-label">Date</label><input className="form-input" type="date"/></div></div>
            <div className="form-group"><label className="form-label">Provider / Facility</label><input className="form-input" placeholder="e.g. LifeLabs Diagnostics"/></div>
            <div className="form-group"><label className="form-label">File</label><div style={{border:"2px dashed var(--border)",borderRadius:"var(--radius)",padding:"26px",textAlign:"center",background:"var(--surface)",cursor:"pointer"}}><div style={{fontSize:28,marginBottom:8}}>📁</div><div style={{fontSize:14,color:"var(--ink-soft)"}}>Drag & drop or <span style={{color:"var(--teal)"}}>browse</span></div><div className="text-xs text-faint" style={{marginTop:4}}>PDF, PNG, JPG — max 10MB</div></div></div>
            <div className="alert alert-success">✅ File will be AES-256 encrypted and hashed on the blockchain.</div>
            <button className="btn btn-primary">Upload Report</button>
          </div>
        )}

        {tab==="qr"&&(
          <div className="fade-up"><div className="grid-2" style={{maxWidth:680}}>
            <div className="card" style={{textAlign:"center"}}>
              <div className="section-title" style={{justifyContent:"center"}}>📱 Your Patient QR Code</div>
              <p className="text-sm text-faint mb-20">Doctors can scan this QR to instantly look up your ABHA and request access.</p>
              <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><QRDisplay value="http://127.0.0.1:8000/patient/1/"/></div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--ink-faint)",marginBottom:16}}>ID: 1 · ABHA: 91-1234-5678-0001</div>
              <button className="btn btn-primary btn-sm">⬇ Download QR</button>
            </div>
            <div className="card">
              <div className="section-title">ℹ️ How QR works</div>
              {[["1","Doctor scans your QR code at the clinic."],["2","System looks up your ABHA ID and sends you a consent request."],["3","You approve or deny access from this app."],["4","Doctor gets time-limited access to approved records only."],["5","Every access is logged on the blockchain."]].map(([n,t])=>(
                <div key={n} style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:"var(--teal-lt)",color:"var(--teal)",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{n}</div>
                  <span className="text-sm" style={{color:"var(--ink-soft)"}}>{t}</span>
                </div>
              ))}
            </div>
          </div></div>
        )}
      </div>
    </>
  );
}

// ─── DOCTOR DASHBOARD ────────────────────────────────────────────────────────
function DoctorDashboard() {
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);
  const [ptab,setPtab]=useState("records");
  const [mainTab,setMainTab]=useState("patients");
  const filtered=MOCK_PATIENTS.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.abha.includes(search));
  return (
    <>
      <div className="topbar">
        <div className="topbar-left"><div style={{fontSize:18}}>🩺</div><h2>Doctor Dashboard</h2></div>
        <div className="topbar-right"><div className="topbar-user"><strong>Dr. Anjali Nair</strong><span>City Hospital · Internal Medicine</span></div><div className="avatar" style={{background:"var(--amber-lt)",color:"var(--amber)"}}>AN</div></div>
      </div>
      <div className="page">
        <div className="page-header"><h3>Doctor Dashboard</h3><p>Manage patients, add records, run AI summaries and disease risk predictions</p></div>
        <div className="grid-4 mb-24">
          <StatCard icon="👥" label="My Patients"        value="142" sub="Authorised access"     accentClass="accent-teal"   delay="fade-up-1"/>
          <StatCard icon="📋" label="Records Today"      value="8"   sub="Viewed or uploaded"    accentClass="accent-amber"  delay="fade-up-2"/>
          <StatCard icon="⏳" label="Pending Consents"   value="3"   sub="Awaiting patient reply" accentClass="accent-rose"   delay="fade-up-3"/>
          <StatCard icon="🔬" label="High Risk Patients" value="5"   sub="Flagged by AI model"   accentClass="accent-purple" delay="fade-up-4"/>
        </div>
        <TabBar tabs={[["patients","Patients"],["add","Add Record"],["qrscan","Scan QR"],["aitools","AI Tools"]]} active={mainTab} onChange={setMainTab}/>

        {mainTab==="patients"&&(
          <div className="grid-auto gap-20">
            <div>
              <div className="card fade-up">
                <div className="section-title mb-16">🔍 Patient Search</div>
                <div className="search-bar mb-16"><span className="search-icon">🔍</span><input className="form-input" placeholder="Name or ABHA ID…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
                <div className="table-wrap"><table><thead><tr><th>Patient</th><th>ABHA</th><th>Age</th><th>BMI</th><th>Risk</th><th></th></tr></thead>
                <tbody>{filtered.map(p=>{ const risk=p.bmi>30||p.glucose>130?"High":p.bmi>25||p.glucose>100?"Medium":"Low"; return (
                  <tr key={p.id} style={{cursor:"pointer"}} onClick={()=>{setSelected(p);setPtab("records");}}>
                    <td><div className="flex items-center gap-8"><div className="avatar" style={{width:28,height:28,fontSize:11}}>{p.name[0]}{p.name.split(" ")[1][0]}</div><span className="font-600">{p.name}</span></div></td>
                    <td className="font-mono text-xs text-faint">{p.abha}</td>
                    <td className="text-sm">{p.age}{p.gender}</td>
                    <td className="font-mono text-sm">{p.bmi}</td>
                    <td><span className={`badge ${risk==="High"?"badge-rose":risk==="Medium"?"badge-amber":"badge-teal"}`}>{risk}</span></td>
                    <td><button className="btn btn-outline btn-sm">View →</button></td>
                  </tr>
                ); })}</tbody></table></div>
              </div>
            </div>
            <div>
              {selected?(
                <div className="card fade-up">
                  <div className="flex items-center gap-12 mb-16"><div className="avatar" style={{width:44,height:44,fontSize:16}}>{selected.name[0]}{selected.name.split(" ")[1][0]}</div><div><div className="font-600" style={{fontSize:16}}>{selected.name}</div><div className="text-xs text-faint font-mono">{selected.abha}</div></div><span className="badge badge-teal" style={{marginLeft:"auto"}}>✓ Access</span></div>
                  <div style={{display:"flex",gap:4,marginBottom:16,flexWrap:"wrap"}}>
                    {[["records","Records"],["vitals","Vitals"],["rx","Rx"],["ai","AI"]].map(([k,l])=><button key={k} className={`tab-btn ${ptab===k?"active":""}`} style={{padding:"6px 12px",fontSize:12}} onClick={()=>setPtab(k)}>{l}</button>)}
                  </div>
                  {ptab==="records"&&<div className="timeline">{MOCK_RECORDS.map((r,i)=><div className="timeline-item" key={i}><div className="timeline-dot"/><div className="timeline-date">{r.date}</div><div className="flex items-center gap-8 mb-4"><RecordTypeBadge type={r.type}/><span className="timeline-title">{r.title}</span></div><div className="text-sm text-faint">{r.provider}</div><div style={{marginTop:8}}><span className="tx-hash">{r.tx}</span></div></div>)}</div>}
                  {ptab==="vitals"&&[["Blood Pressure",selected.bp,"mmHg"],["BMI",selected.bmi,"kg/m²"],["Blood Glucose",selected.glucose,"mg/dL"],["Weight",selected.weight,"kg"]].map(([l,v,u])=><div className="vital-row" key={l}><span className="vital-label">{l}</span><span><span className="vital-value">{v}</span> <span className="vital-unit">{u}</span></span></div>)}
                  {ptab==="rx"&&[{drug:"Metformin 500mg",freq:"Twice daily",d:"90 days",date:"14 Jan 2025"},{drug:"Aspirin 75mg",freq:"Once daily",d:"30 days",date:"12 Mar 2025"}].map((rx,i)=><div key={i} style={{padding:"12px 0",borderBottom:"1px solid var(--border)"}}><div className="font-600 mb-4">{rx.drug}</div><div className="text-sm text-faint">{rx.freq} · {rx.d}</div><div className="text-xs text-faint font-mono" style={{marginTop:4}}>{rx.date}</div></div>)}
                  {ptab==="ai"&&<div style={{display:"flex",flexDirection:"column",gap:14}}><AISummaryPanel patient={selected}/><RiskPrediction patient={selected}/></div>}
                </div>
              ):(
                <div className="card fade-up" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:260,textAlign:"center",color:"var(--ink-faint)"}}>
                  <div style={{fontSize:36,marginBottom:10}}>🔍</div>
                  <div style={{fontWeight:600,marginBottom:4}}>Select a Patient</div>
                  <div className="text-sm">Click a patient row to view their authorised records and AI insights.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {mainTab==="add"&&(
          <div className="card fade-up" style={{maxWidth:540}}>
            <div className="section-title mb-20">➕ Add Visit / Record</div>
            <div className="form-group"><label className="form-label">Patient ABHA ID</label><input className="form-input" placeholder="91-xxxx-xxxx-xxxx" style={{fontFamily:"var(--font-mono)",letterSpacing:2}}/></div>
            <div className="form-row"><div className="form-group"><label className="form-label">Visit Type</label><select className="form-select"><option>Consultation</option><option>Follow-up</option><option>Emergency</option></select></div><div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date"/></div></div>
            <div className="form-group"><label className="form-label">Chief Complaint</label><input className="form-input" placeholder="e.g. Persistent cough, fatigue"/></div>
            <div className="form-group"><label className="form-label">Clinical Notes</label><textarea className="form-input" rows={3} style={{resize:"vertical"}} placeholder="Examination findings, diagnosis, plan…"/></div>
            <div className="form-group"><label className="form-label">Prescription</label><textarea className="form-input" rows={2} placeholder="Drug name, dosage, frequency…"/></div>
            <div className="alert alert-success">✅ Record will be hashed and stored on-chain. Patient will be notified.</div>
            <button className="btn btn-primary">Save & Record on Chain</button>
          </div>
        )}

        {mainTab==="qrscan"&&(
          <div className="card fade-up" style={{maxWidth:500}}>
            <div className="section-title mb-16">📸 Scan Patient QR Code</div>
            <p className="text-sm text-faint mb-20">In the full app, your device camera scans the patient QR code. Use manual lookup below for demo.</p>
            <div style={{border:"2px dashed var(--border)",borderRadius:"var(--radius)",padding:"36px",textAlign:"center",background:"var(--surface)",marginBottom:20}}>
              <div style={{fontSize:36,marginBottom:8}}>📷</div>
              <div style={{fontWeight:600,marginBottom:4}}>Camera QR Scanner</div>
              <div className="text-sm text-faint">Camera access requested here in the live app (jsQR library)</div>
            </div>
            <div className="section-title mb-12" style={{fontSize:13}}>Or enter manually</div>
            <div className="flex gap-8">
              <input className="form-input" placeholder="Patient ID or ABHA ID" style={{flex:1}}/>
              <button className="btn btn-primary" onClick={()=>setSelected(MOCK_PATIENTS[0])}>Look Up</button>
            </div>
            {selected&&<div style={{marginTop:14,padding:14,background:"var(--teal-lt)",borderRadius:"var(--radius)",border:"1px solid var(--teal-mid)"}}><div className="font-600" style={{color:"var(--teal)"}}>{selected.name}</div><div className="text-xs font-mono text-faint">{selected.abha}</div><div className="text-sm" style={{marginTop:4}}>Age {selected.age} · {selected.blood} · {selected.gender==="F"?"Female":"Male"}</div><button className="btn btn-primary btn-sm" style={{marginTop:10}}>Request Consent →</button></div>}
          </div>
        )}

        {mainTab==="aitools"&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div className="alert alert-info">🤖 Select a patient from the Patients tab to run AI analysis. Below shows aggregate stats for your patient list.</div>
            <div className="grid-3">
              <div className="card fade-up"><div className="card-title">High Risk Patients</div><div className="card-value" style={{color:"var(--rose)"}}>5</div><div className="card-sub">BMI &gt;30 or Glucose &gt;130</div></div>
              <div className="card fade-up fade-up-1"><div className="card-title">Avg Patient BMI</div><div className="card-value" style={{color:"var(--amber)"}}>27.3</div><div className="card-sub">Overweight range (normal: 18.5–24.9)</div></div>
              <div className="card fade-up fade-up-2"><div className="card-title">Avg Glucose</div><div className="card-value" style={{color:"var(--indigo)"}}>110</div><div className="card-sub">mg/dL · Pre-diabetic threshold: 100</div></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
function AdminDashboard() {
  const [tab,setTab]=useState("providers");
  const [providers,setProviders]=useState(MOCK_PROVIDERS);
  function approve(id){ setProviders(ps=>ps.map(p=>p.id===id?{...p,status:"verified"}:p)); }
  return (
    <>
      <div className="topbar">
        <div className="topbar-left"><div style={{fontSize:18}}>⚙️</div><h2>Admin Panel</h2></div>
        <div className="topbar-right"><div className="topbar-user"><strong>System Admin</strong><span>ABDM Portal</span></div><div className="avatar" style={{background:"var(--indigo-lt)",color:"var(--indigo)"}}>SA</div></div>
      </div>
      <div className="page">
        <div className="page-header"><h3>System Administration</h3><p>Manage providers, patients, audit logs and analytics</p></div>
        <div className="grid-4 mb-24">
          <StatCard icon="👥" label="Total Patients"  value="1,284" sub="+12 this week"           accentClass="accent-teal"   delay="fade-up-1"/>
          <StatCard icon="🏥" label="Providers"       value="47"    sub="3 pending verification"  accentClass="accent-amber"  delay="fade-up-2"/>
          <StatCard icon="📋" label="EHR Records"     value="8,921" sub="All hashed on-chain"     accentClass="accent-indigo" delay="fade-up-3"/>
          <StatCard icon="⛓️" label="Blockchain TXs"  value="9,205" sub="100% verified"           accentClass="accent-rose"   delay="fade-up-4"/>
        </div>
        <TabBar tabs={[["providers","Providers"],["patients","Patients"],["audit","Audit Log"],["analytics","Analytics"]]} active={tab} onChange={setTab}/>

        {tab==="providers"&&(
          <div className="card fade-up">
            <div className="flex justify-between items-center mb-20"><div className="section-title mb-0">Registered Providers</div><button className="btn btn-primary btn-sm">+ Register Provider</button></div>
            <div className="table-wrap"><table><thead><tr><th>Provider</th><th>Specialty</th><th>HFR ID</th><th>Patients</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{providers.map(p=><tr key={p.id}><td><div className="font-600">{p.name}</div><div className="text-xs text-faint">{p.facility}</div></td><td className="text-sm">{p.specialty}</td><td className="font-mono text-xs text-faint">{p.hfr}</td><td className="text-sm">{p.patients>0?p.patients:"—"}</td><td><span className={`badge ${p.status==="verified"?"badge-teal":p.status==="pending"?"badge-amber":"badge-gray"}`}>{p.status}</span></td><td>{p.status==="pending"?<button className="btn btn-primary btn-sm" onClick={()=>approve(p.id)}>Approve</button>:<button className="btn btn-outline btn-sm">View</button>}</td></tr>)}</tbody></table></div>
          </div>
        )}

        {tab==="patients"&&(
          <div className="card fade-up">
            <div className="flex justify-between items-center mb-20"><div className="section-title mb-0">Patient Registry</div><div className="search-bar" style={{width:220}}><span className="search-icon">🔍</span><input className="form-input" placeholder="Search patients…"/></div></div>
            <div className="table-wrap"><table><thead><tr><th>Patient</th><th>ABHA ID</th><th>Age/Sex</th><th>Blood</th><th>BMI</th><th>Status</th><th></th></tr></thead>
            <tbody>{MOCK_PATIENTS.map(p=><tr key={p.id}><td><div className="flex items-center gap-8"><div className="avatar" style={{width:28,height:28,fontSize:11}}>{p.name[0]}{p.name.split(" ")[1][0]}</div><span className="font-600">{p.name}</span></div></td><td className="font-mono text-xs text-faint">{p.abha}</td><td className="text-sm">{p.age}/{p.gender}</td><td><span className="badge badge-rose">{p.blood}</span></td><td className="font-mono text-sm">{p.bmi}</td><td><span className={`badge ${p.status==="active"?"badge-teal":"badge-gray"}`}>{p.status}</span></td><td><button className="btn btn-outline btn-sm">View</button></td></tr>)}</tbody></table></div>
          </div>
        )}

        {tab==="audit"&&(
          <div className="card fade-up">
            <div className="flex justify-between items-center mb-16"><div className="section-title mb-0">⛓️ Blockchain Audit Log</div><button className="btn btn-outline btn-sm">Export CSV</button></div>
            <div className="alert alert-success mb-16">✅ All transactions verified. Last check: just now.</div>
            <div className="table-wrap"><table><thead><tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Resource</th><th>TX Hash</th><th>Verified</th></tr></thead>
            <tbody>{MOCK_AUDIT.map((a,i)=><tr key={i}><td className="font-mono text-xs text-faint">{a.ts}</td><td className="font-600 text-sm">{a.actor}</td><td className="text-sm">{a.action}</td><td className="text-sm text-faint">{a.resource}</td><td><span className="tx-hash">{a.tx}</span></td><td><span className="badge badge-teal">✓</span></td></tr>)}</tbody></table></div>
          </div>
        )}

        {tab==="analytics"&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div className="grid-2">
              <div className="card fade-up">
                <div className="section-title mb-16">📊 BMI Distribution</div>
                {[["Underweight <18.5","2%","var(--indigo)"],["Normal 18.5–24.9","38%","var(--green)"],["Overweight 25–29.9","41%","var(--amber)"],["Obese >30","19%","var(--rose)"]].map(([l,pct,c])=>(
                  <div key={l} style={{marginBottom:12}}><div className="flex justify-between text-sm mb-4"><span>{l}</span><strong>{pct}</strong></div><div className="risk-bar"><div className="risk-fill" style={{width:pct,background:c}}/></div></div>
                ))}
              </div>
              <div className="card fade-up fade-up-1">
                <div className="section-title mb-16">🧪 Common Diagnoses</div>
                {[["Hypertension","34%","var(--rose)"],["Pre-Diabetes","28%","var(--amber)"],["Obesity","22%","var(--purple)"],["Anaemia","11%","var(--indigo)"],["Thyroid","5%","var(--teal)"]].map(([l,pct,c])=>(
                  <div key={l} style={{marginBottom:12}}><div className="flex justify-between text-sm mb-4"><span>{l}</span><strong>{pct}</strong></div><div className="risk-bar"><div className="risk-fill" style={{width:pct,background:c}}/></div></div>
                ))}
              </div>
            </div>
            <div className="card fade-up fade-up-2">
              <div className="section-title mb-20">📈 System EHR Records Created (6 months)</div>
              <MiniChart data={[410,538,621,714,802,921]} labels={["Oct","Nov","Dec","Jan","Feb","Mar"]} color="var(--teal)" unit="records" title=""/>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── REGISTRATION ────────────────────────────────────────────────────────────
function OtpStep({ phone, onVerify, onBack, label="Verify Mobile Number" }) {
  const [otp,setOtp]=useState(["","","","","",""]);
  function h(i,val){ if(!/^\d?$/.test(val))return; const n=[...otp];n[i]=val;setOtp(n); if(val&&i<5)document.getElementById(`otp-${i+1}`)?.focus(); if(!val&&i>0)document.getElementById(`otp-${i-1}`)?.focus(); }
  return (
    <>
      <div style={{textAlign:"center",marginBottom:22}}><div style={{fontSize:36,marginBottom:8}}>📱</div><h2 style={{fontFamily:"var(--font-display)",fontSize:24,fontWeight:400,marginBottom:4}}>{label}</h2><p style={{color:"var(--ink-faint)",fontSize:14}}>Code sent to <strong>{phone||"+91 ••••••0001"}</strong></p></div>
      <div className="alert alert-info mb-20">ℹ️ Demo OTP: <strong style={{fontFamily:"var(--font-mono)",letterSpacing:4}}>1 2 3 4 5 6</strong></div>
      <div className="form-group"><label className="form-label">Enter OTP</label><div className="otp-boxes">{otp.map((v,i)=><input key={i} id={`otp-${i}`} className="otp-box" maxLength={1} value={v} onChange={e=>h(i,e.target.value)}/>)}</div></div>
      <button className="btn btn-primary w-full" style={{marginTop:8}} onClick={onVerify}>Verify & Continue →</button>
      <button className="btn btn-outline w-full" style={{marginTop:10}} onClick={onBack}>← Back</button>
    </>
  );
}

function StepIndicator({ steps, current }) {
  return (
    <div className="step-row">
      {steps.map((s,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",flex:i<steps.length-1?1:0}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:i<current?"var(--teal)":i===current?"var(--ink)":"var(--border)",color:i<=current?"#fff":"var(--ink-faint)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,fontFamily:"var(--font-mono)",flexShrink:0}}>{i<current?"✓":i+1}</div>
            <span style={{fontSize:9,whiteSpace:"nowrap",color:i===current?"var(--ink)":"var(--ink-faint)",fontWeight:i===current?600:400,fontFamily:"var(--font-mono)",textTransform:"uppercase",letterSpacing:".04em"}}>{s}</span>
          </div>
          {i<steps.length-1&&<div style={{flex:1,height:1,background:i<current?"var(--teal)":"var(--border)",margin:"0 6px",marginBottom:18}}/>}
        </div>
      ))}
    </div>
  );
}

function PatientRegister({ onDone, onBack }) {
  const [step,setStep]=useState(0);
  const [f,setF]=useState({phone:"",email:"",firstName:"",lastName:"",dob:"",gender:"",blood:"",state:"",city:"",eName:"",eRel:"",ePhone:"",abhaChoice:"new",aadhaarLast4:""});
  const s=(k,v)=>setF(x=>({...x,[k]:v}));
  return (<>
    <StepIndicator steps={["Mobile","Verify","Profile","ABHA","eKYC","Done"]} current={step}/>
    {step===0&&(<><h2 style={{fontFamily:"var(--font-display)",fontSize:24,fontWeight:400,marginBottom:4}}>Create Patient Account</h2><p style={{color:"var(--ink-faint)",fontSize:14,marginBottom:20}}>Register to get your Digital Health Card</p>
      <div className="form-group"><label className="form-label">Mobile Number</label><div style={{display:"flex",gap:8}}><select className="form-select" style={{width:76,flexShrink:0}}><option>+91</option></select><input className="form-input" placeholder="98765 43210" value={f.phone} onChange={e=>s("phone",e.target.value)}/></div></div>
      <div className="form-group"><label className="form-label">Email <span className="text-faint">(optional)</span></label><input className="form-input" type="email" value={f.email} onChange={e=>s("email",e.target.value)}/></div>
      <button className="btn btn-primary w-full" onClick={()=>setStep(1)}>Send OTP →</button>
      <button className="btn btn-outline w-full" style={{marginTop:10}} onClick={onBack}>← Back</button>
    </>)}
    {step===1&&<OtpStep phone={f.phone} onVerify={()=>setStep(2)} onBack={()=>setStep(0)}/>}
    {step===2&&(<><h2 style={{fontFamily:"var(--font-display)",fontSize:24,fontWeight:400,marginBottom:4}}>Personal Information</h2><p style={{color:"var(--ink-faint)",fontSize:14,marginBottom:18}}>Creates your health profile.</p>
      <div className="form-row"><div className="form-group"><label className="form-label">First Name</label><input className="form-input" placeholder="Priya" value={f.firstName} onChange={e=>s("firstName",e.target.value)}/></div><div className="form-group"><label className="form-label">Last Name</label><input className="form-input" placeholder="Sharma" value={f.lastName} onChange={e=>s("lastName",e.target.value)}/></div></div>
      <div className="form-row"><div className="form-group"><label className="form-label">Date of Birth</label><input className="form-input" type="date" value={f.dob} onChange={e=>s("dob",e.target.value)}/></div><div className="form-group"><label className="form-label">Gender</label><select className="form-select" value={f.gender} onChange={e=>s("gender",e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div></div>
      <div className="form-row"><div className="form-group"><label className="form-label">Blood Group</label><select className="form-select" value={f.blood} onChange={e=>s("blood",e.target.value)}><option value="">Select</option>{["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b=><option key={b}>{b}</option>)}</select></div><div className="form-group"><label className="form-label">State</label><select className="form-select" value={f.state} onChange={e=>s("state",e.target.value)}><option value="">Select</option>{["Maharashtra","Karnataka","Tamil Nadu","Delhi","Gujarat"].map(st=><option key={st}>{st}</option>)}</select></div></div>
      <div className="form-group"><label className="form-label">City</label><input className="form-input" placeholder="Pune" value={f.city} onChange={e=>s("city",e.target.value)}/></div>
      <div className="divider"/>
      <div style={{fontWeight:600,fontSize:13,marginBottom:10}}>🆘 Emergency Contact</div>
      <div className="form-row"><div className="form-group"><label className="form-label">Name</label><input className="form-input" placeholder="Rahul Sharma" value={f.eName} onChange={e=>s("eName",e.target.value)}/></div><div className="form-group"><label className="form-label">Relation</label><select className="form-select" value={f.eRel} onChange={e=>s("eRel",e.target.value)}><option value="">Select</option><option>Spouse</option><option>Parent</option><option>Sibling</option><option>Friend</option></select></div></div>
      <div className="form-group"><label className="form-label">Emergency Phone</label><input className="form-input" placeholder="+91 98765 00000" value={f.ePhone} onChange={e=>s("ePhone",e.target.value)}/></div>
      <button className="btn btn-primary w-full" onClick={()=>setStep(3)}>Continue →</button>
      <button className="btn btn-outline w-full" style={{marginTop:10}} onClick={()=>setStep(1)}>← Back</button>
    </>)}
    {step===3&&(<><h2 style={{fontFamily:"var(--font-display)",fontSize:24,fontWeight:400,marginBottom:4}}>ABHA Setup</h2><p style={{color:"var(--ink-faint)",fontSize:14,marginBottom:18}}>Your national health ID linking all records.</p>
      {[{k:"new",icon:"✨",title:"Create new ABHA ID",desc:"Generate a fresh ABHA linked to your mobile"},{k:"existing",icon:"🔗",title:"Link existing ABHA",desc:"Enter your ABHA number if you have one"},{k:"skip",icon:"⏭️",title:"Skip for now",desc:"Link ABHA later from profile"}].map(opt=>(
        <div key={opt.k} onClick={()=>s("abhaChoice",opt.k)} style={{padding:"12px 14px",borderRadius:"var(--radius)",border:`1.5px solid ${f.abhaChoice===opt.k?"var(--teal)":"var(--border)"}`,background:f.abhaChoice===opt.k?"var(--teal-lt)":"var(--card)",cursor:"pointer",display:"flex",gap:12,marginBottom:10}}>
          <span style={{fontSize:18}}>{opt.icon}</span><div><div style={{fontWeight:600,fontSize:14,color:f.abhaChoice===opt.k?"var(--teal)":"var(--ink)"}}>{opt.title}</div><div style={{fontSize:12,color:"var(--ink-faint)"}}>{opt.desc}</div></div>
        </div>
      ))}
      <button className="btn btn-primary w-full" style={{marginTop:8}} onClick={()=>f.abhaChoice==="skip"?setStep(5):setStep(4)}>{f.abhaChoice==="skip"?"Finish →":"Continue to eKYC →"}</button>
      <button className="btn btn-outline w-full" style={{marginTop:10}} onClick={()=>setStep(2)}>← Back</button>
    </>)}
    {step===4&&(<><h2 style={{fontFamily:"var(--font-display)",fontSize:24,fontWeight:400,marginBottom:4}}>Aadhaar eKYC</h2><p style={{color:"var(--ink-faint)",fontSize:14,marginBottom:16}}>Your Aadhaar number is never stored — only a pseudonymous token is retained.</p>
      <div className="alert alert-warn mb-16">⚠️ Demo mode — simulated UIDAI sandbox. No real Aadhaar data used.</div>
      <div className="form-group"><label className="form-label">Aadhaar (last 4 digits for demo)</label><input className="form-input" placeholder="• • • •" maxLength={4} style={{fontFamily:"var(--font-mono)",fontSize:20,letterSpacing:8,textAlign:"center"}} value={f.aadhaarLast4} onChange={e=>s("aadhaarLast4",e.target.value.replace(/\D/,""))}/></div>
      <button className="btn btn-primary w-full" onClick={()=>setStep(5)}>Verify with Aadhaar OTP →</button>
      <button className="btn btn-outline w-full" style={{marginTop:10}} onClick={()=>setStep(3)}>← Back</button>
    </>)}
    {step===5&&<div style={{textAlign:"center",padding:"12px 0"}}><div style={{fontSize:56,marginBottom:14}}>🎉</div><h2 style={{fontFamily:"var(--font-display)",fontSize:26,fontWeight:400,marginBottom:8}}>Registration Complete!</h2><p style={{color:"var(--ink-faint)",fontSize:14,marginBottom:22}}>Your Digital Health Card is ready.</p>
      <div className="abha-card" style={{marginBottom:20,textAlign:"left"}}><div className="abha-label">Digital Health Card · ABHA</div><div className="abha-id">91-{Math.floor(1000+Math.random()*9000)}-{Math.floor(1000+Math.random()*9000)}-{Math.floor(1000+Math.random()*9000)}</div><div className="abha-name">{f.firstName||"New"} {f.lastName||"Patient"}</div><div className="abha-dob">{f.dob||"—"} · {f.blood||"—"} · {f.gender||"—"}</div></div>
      <button className="btn btn-primary w-full" onClick={onDone}>Go to My Dashboard →</button>
    </div>}
  </>);
}

function ProviderRegister({ onDone, onBack }) {
  const [step,setStep]=useState(0);
  const [f,setF]=useState({type:"doctor",name:"",phone:"",email:"",password:"",regNumber:"",specialty:"",facility:"",hfrId:""});
  const s=(k,v)=>setF(x=>({...x,[k]:v}));
  return (<>
    <StepIndicator steps={["Details","Verify","Credentials","Facility","Review"]} current={step}/>
    {step===0&&(<><h2 style={{fontFamily:"var(--font-display)",fontSize:24,fontWeight:400,marginBottom:4}}>Provider Registration</h2><p style={{color:"var(--ink-faint)",fontSize:14,marginBottom:18}}>Register as a verified healthcare provider.</p>
      <div className="form-group"><label className="form-label">Type</label><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>{[{k:"doctor",icon:"🩺",l:"Doctor"},{k:"lab",icon:"🔬",l:"Lab"},{k:"pharma",icon:"💊",l:"Pharmacy"},{k:"clinic",icon:"🏥",l:"Clinic"}].map(t=><div key={t.k} onClick={()=>s("type",t.k)} className={`role-btn ${f.type===t.k?"active":""}`}><span className="role-icon">{t.icon}</span>{t.l}</div>)}</div></div>
      <div className="form-group"><label className="form-label">{f.type==="doctor"?"Full Name (MCI)":"Organisation Name"}</label><input className="form-input" value={f.name} onChange={e=>s("name",e.target.value)}/></div>
      <div className="form-group"><label className="form-label">Work Email</label><input className="form-input" type="email" value={f.email} onChange={e=>s("email",e.target.value)}/></div>
      <div className="form-group"><label className="form-label">Mobile</label><input className="form-input" value={f.phone} onChange={e=>s("phone",e.target.value)}/></div>
      <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={f.password} onChange={e=>s("password",e.target.value)}/></div>
      <button className="btn btn-primary w-full" onClick={()=>setStep(1)}>Send OTP →</button>
      <button className="btn btn-outline w-full" style={{marginTop:10}} onClick={onBack}>← Back</button>
    </>)}
    {step===1&&<OtpStep phone={f.phone} onVerify={()=>setStep(2)} onBack={()=>setStep(0)} label="Verify Work Mobile"/>}
    {step===2&&(<><h2 style={{fontFamily:"var(--font-display)",fontSize:24,fontWeight:400,marginBottom:4}}>Credentials</h2><p style={{color:"var(--ink-faint)",fontSize:14,marginBottom:18}}>Verified by admin before activation.</p>
      <div className="form-group"><label className="form-label">MCI / NABL Registration No.</label><input className="form-input" placeholder="MH-2019-12345" style={{fontFamily:"var(--font-mono)"}} value={f.regNumber} onChange={e=>s("regNumber",e.target.value)}/></div>
      {f.type==="doctor"&&<div className="form-group"><label className="form-label">Specialisation</label><select className="form-select" value={f.specialty} onChange={e=>s("specialty",e.target.value)}><option value="">Select</option>{["General Medicine","Cardiology","Paediatrics","Dermatology","Neurology","Orthopaedics","Gynaecology"].map(sp=><option key={sp}>{sp}</option>)}</select></div>}
      <button className="btn btn-primary w-full" onClick={()=>setStep(3)}>Continue →</button>
      <button className="btn btn-outline w-full" style={{marginTop:10}} onClick={()=>setStep(1)}>← Back</button>
    </>)}
    {step===3&&(<><h2 style={{fontFamily:"var(--font-display)",fontSize:24,fontWeight:400,marginBottom:4}}>Facility</h2>
      <div className="form-group"><label className="form-label">Facility Name</label><input className="form-input" placeholder="City Hospital, Pune" value={f.facility} onChange={e=>s("facility",e.target.value)}/></div>
      <div className="form-group"><label className="form-label">HFR ID <span className="text-faint">(optional)</span></label><input className="form-input" placeholder="HFR-MH-00123" style={{fontFamily:"var(--font-mono)"}} value={f.hfrId} onChange={e=>s("hfrId",e.target.value)}/></div>
      <button className="btn btn-primary w-full" onClick={()=>setStep(4)}>Review →</button>
      <button className="btn btn-outline w-full" style={{marginTop:10}} onClick={()=>setStep(2)}>← Back</button>
    </>)}
    {step===4&&(<><h2 style={{fontFamily:"var(--font-display)",fontSize:24,fontWeight:400,marginBottom:14}}>Review & Submit</h2>
      {[["Name",f.name||"—"],["Type",f.type],["Email",f.email||"—"],["Reg. No.",f.regNumber||"—"],["Specialty",f.specialty||"—"],["Facility",f.facility||"—"],["HFR ID",f.hfrId||"Pending"]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)"}}><span className="text-sm text-faint">{k}</span><span className="text-sm font-600">{v}</span></div>)}
      <div className="alert alert-warn" style={{marginTop:14}}>⏳ Reviewed within 24–48 hrs. SMS confirmation on approval.</div>
      <button className="btn btn-primary w-full" style={{marginTop:8}} onClick={onDone}>Submit for Verification →</button>
      <button className="btn btn-outline w-full" style={{marginTop:10}} onClick={()=>setStep(3)}>← Edit</button>
    </>)}
  </>);
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginView({ onLogin }) {
  const [mode,setMode]=useState("login");
  const [role,setRole]=useState("patient");
  const [step,setStep]=useState(1);
  const [phone,setPhone]=useState("");
  const LEFT={
    login:{ title:"Smart\nHealth\nRecords", sub:"A unified EHR with ABHA identity and blockchain audit trail.", features:[["🔐","ABHA Digital Health Card"],["⛓️","Blockchain consent audit trail"],["📋","FHIR-compatible records"],["🔏","Patient-controlled sharing"]] },
    "rp":{ title:"Join\nHealthChain", sub:"Create your Digital Health Card in minutes.", features:[["✨","Instant ABHA ID"],["🔒","Private by default"],["📱","Mobile-linked"],["🆓","Free for patients"]] },
    "rv":{ title:"Provider\nAccess\nPortal", sub:"Register as a verified doctor, lab or clinic.", features:[["✅","MCI / NABL verification"],["🏥","HFR facility linking"],["📊","Consented patient history"],["⛓️","Every access logged"]] },
  };
  const c=LEFT[mode]||LEFT.login;
  const roles=[{key:"patient",label:"Patient",icon:"👤"},{key:"doctor",label:"Doctor",icon:"🩺"},{key:"lab",label:"Lab",icon:"🔬"},{key:"admin",label:"Admin",icon:"⚙️"}];
  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-logo">🏥</div>
        <h1>{c.title}</h1><p>{c.sub}</p>
        <div className="login-features">{c.features.map(([i,t])=><div className="login-feature" key={t}><span>{i}</span><span>{t}</span></div>)}</div>
      </div>
      <div className="login-right">
        <div className="login-form-box">
          {mode==="login"&&(<>
            {step===1?(<>
              <h2>Welcome back</h2><p>Sign in to your health portal</p>
              <div className="mb-16"><div className="form-label" style={{marginBottom:8}}>Sign in as</div><div className="role-picker">{roles.map(r=><div key={r.key} className={`role-btn ${role===r.key?"active":""}`} onClick={()=>setRole(r.key)}><span className="role-icon">{r.icon}</span>{r.label}</div>)}</div></div>
              <div className="form-group"><label className="form-label">{role==="patient"?"Mobile / ABHA ID":role==="admin"?"Email":"Mobile / Email"}</label><input className="form-input" placeholder={role==="patient"?"91-XXXX-XXXX-XXXX":role==="admin"?"admin@abdm.gov.in":"+91 98765 43210"} value={phone} onChange={e=>setPhone(e.target.value)}/></div>
              {role==="admin"&&<div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••"/></div>}
              <button className="btn btn-primary w-full" style={{marginTop:8}} onClick={()=>role==="admin"?onLogin(role):setStep(2)}>{role==="admin"?"Sign In →":"Send OTP →"}</button>
              <div style={{display:"flex",alignItems:"center",gap:10,margin:"16px 0"}}><div style={{flex:1,height:1,background:"var(--border)"}}/><span className="text-xs text-faint">or</span><div style={{flex:1,height:1,background:"var(--border)"}}/></div>
              <button className="btn btn-outline w-full" onClick={()=>setMode(role==="patient"?"rp":"rv")}>{role==="patient"?"Create Patient Account":"Register as Provider"} →</button>
            </>):(
              <OtpStep phone={phone} label="Verify Your Identity" onVerify={()=>onLogin(role)} onBack={()=>setStep(1)}/>
            )}
          </>)}
          {mode==="rp"&&<PatientRegister onDone={()=>onLogin("patient")} onBack={()=>{setMode("login");setStep(1);}}/>}
          {mode==="rv"&&<ProviderRegister onDone={()=>onLogin(role)} onBack={()=>{setMode("login");setStep(1);}}/>}
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [authed,setAuthed]=useState(false);
  const [role,setRole]=useState("patient");

  function login(r){ 
    setRole(r); 
    setAuthed(true); 
  }

  function logout(){ 
    setAuthed(false); 
    setRole("patient"); 
  }

  const NAV={
    patient:[["👤","Overview"],["📋","Records"],["🤖","AI Insights"],["📈","Charts"],["🤝","Consents"],["⏰","Reminders"],["📤","Upload"],["📱","My QR"]],
    doctor: [["🏠","Patients"],["➕","Add Record"],["📸","Scan QR"],["🤖","AI Tools"]],
    lab:    [["🏠","Patients"],["➕","Add Record"],["📸","Scan QR"]],
    admin:  [["⚙️","Providers"],["👥","Patients"],["⛓️","Audit Log"],["📊","Analytics"]],
  };

  return (
    <>
      {/* ✅ CSS applied directly */}
      <style>{CSS}</style>

      {!authed ? <LoginView onLogin={login}/> : (
        <div className="app-shell">
          
          <aside className="sidebar">
            <div className="sidebar-brand">
              <div className="logo-mark">🏥</div>
              <h1>HealthChain</h1>
              <p>ABDM · EHR System</p>
            </div>

            <nav className="sidebar-nav">
              <div className="nav-label">
                {role==="patient"?"Patient":role==="admin"?"Administration":"Provider"}
              </div>

              {(NAV[role]||NAV.patient).map(([icon,label])=>(
                <button key={label} className="nav-item">
                  <span className="icon">{icon}</span>{label}
                </button>
              ))}

              <div className="nav-label" style={{marginTop:20}}>Demo Portals</div>

              {[ 
                {r:"patient",icon:"👤",label:"Patient View"},
                {r:"doctor",icon:"🩺",label:"Doctor View"},
                {r:"admin",icon:"⚙️",label:"Admin View"}
              ].map(({r,icon,label})=>(
                <button 
                  key={r} 
                  className={`nav-item ${role===r?"active":""}`} 
                  onClick={()=>login(r)}
                >
                  <span className="icon">{icon}</span>{label}
                </button>
              ))}
            </nav>

            <div className="sidebar-footer">
              <button className="nav-item" onClick={logout}>
                <span className="icon">🚪</span>Sign Out
              </button>
            </div>
          </aside>

          <main className="main-content">
            {role==="patient" && <PatientDashboard/>}
            {(role==="doctor" || role==="lab") && <DoctorDashboard/>}
            {role==="admin" && <AdminDashboard/>}
          </main>

        </div>
      )}
    </>
  );
}