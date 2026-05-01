import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { authApi, patientApi, recordsApi, doctorApi, vitalsApi, allergiesApi, specialApi, remindersApi, consentsApi, auditApi, adminApi } from './api';

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
  .sidebar-brand h1 { font-family:var(--font-display); font-size:24px; font-weight:700; line-height:1.2; color:#ffffff; letter-spacing:0.5px; }
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
  .topbar h2 { font-family:var(--font-display); font-weight:700; font-size:28px; color:var(--ink); letter-spacing:-0.01em; }
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
  .otp-boxes { display:flex; gap:12px; justify-content:center; }
  .otp-box { flex:1; max-width:56px; height:64px; border:2px solid var(--border); border-radius:12px; text-align:center; font-size:26px; font-family:var(--font-mono); font-weight:600; background:var(--surface); color:var(--ink); outline:none; transition:all 0.25s cubic-bezier(0.4,0,0.2,1); box-shadow:0 2px 6px rgba(0,0,0,0.02); }
  .otp-box:hover { border-color:var(--teal-mid); transform:translateY(-1px); background:var(--card); }
  .otp-box:focus { border-color:var(--teal); background:var(--card); box-shadow:0 0 0 4px var(--teal-lt), 0 6px 16px rgba(11,124,110,0.1); transform:translateY(-2px); }


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
  { id: 1, name: "Priya Sharma", abha: "91-1234-5678-0001", age: 34, gender: "F", phone: "+91 98765 43210", blood: "B+", status: "active", bmi: 27.4, glucose: 112, bp: "128/82", weight: 72 },
  { id: 2, name: "Rajan Mehta", abha: "91-2345-6789-0002", age: 52, gender: "M", phone: "+91 87654 32109", blood: "O+", status: "active", bmi: 31.2, glucose: 148, bp: "142/90", weight: 94 },
  { id: 3, name: "Ananya Iyer", abha: "91-3456-7890-0003", age: 28, gender: "F", phone: "+91 76543 21098", blood: "A-", status: "active", bmi: 21.1, glucose: 88, bp: "110/70", weight: 56 },
  { id: 4, name: "Suresh Kumar", abha: "91-4567-8901-0004", age: 61, gender: "M", phone: "+91 65432 10987", blood: "AB+", status: "inactive", bmi: 29.8, glucose: 136, bp: "138/86", weight: 88 },
];
const MOCK_RECORDS = [
  { date: "12 Mar 2025", type: "Discharge Summary", title: "General Checkup", provider: "Dr. A. Nair — City Hospital", tx: "0xA3f9…C12" },
  { date: "28 Jan 2025", type: "Lab Report", title: "CBC + Lipid Profile", provider: "LifeLabs Diagnostics", tx: "0xB7d2…E45" },
  { date: "14 Jan 2025", type: "Prescription", title: "Metformin 500mg", provider: "Dr. A. Nair — City Hospital", tx: "0xC1a0…F78" },
  { date: "05 Nov 2024", type: "Imaging / Scan", title: "Chest X-Ray", provider: "Apollo Radiology", tx: "0xD5b3…A23" },
];
const MOCK_CONSENTS = [
  { id: 1, grantee: "Dr. Anjali Nair", facility: "City Hospital", scope: "Full Records", expires: "31 Dec 2025", status: "active" },
  { id: 2, grantee: "LifeLabs Diag.", facility: "Diagnostics Centre", scope: "Lab Results", expires: "15 Jun 2025", status: "active" },
  { id: 3, grantee: "Apollo Radiology", facility: "Apollo Hospitals", scope: "Imaging Only", expires: "10 Feb 2025", status: "revoked" },
  { id: 4, grantee: "Dr. Pradeep Rao", facility: "Heart Care", scope: "Cardiology", expires: "Requested 30 days", status: "pending" },
];
const MOCK_PROVIDERS = [
  { id: 1, name: "Dr. Anjali Nair", specialty: "Internal Medicine", facility: "City Hospital", hfr: "HFR-MH-00123", status: "verified", patients: 142 },
  { id: 2, name: "LifeLabs Diagnostics", specialty: "Pathology Lab", facility: "Diagnostic Centre", hfr: "HFR-MH-00456", status: "verified", patients: 0 },
  { id: 3, name: "Dr. Pradeep Rao", specialty: "Cardiology", facility: "Heart Care", hfr: "HFR-MH-00789", status: "pending", patients: 87 },
  { id: 4, name: "Apollo Radiology", specialty: "Radiology", facility: "Apollo Hospitals", hfr: "HFR-MH-01012", status: "verified", patients: 0 },
];
const MOCK_AUDIT = [
  { ts: "2025-03-12 09:14", actor: "Dr. A. Nair", action: "Record Accessed", resource: "Visit Notes", tx: "0xA3f9…C12" },
  { ts: "2025-03-12 09:10", actor: "Priya Sharma", action: "Consent Granted", resource: "Dr. A. Nair", tx: "0xA3f8…B09" },
  { ts: "2025-01-28 11:32", actor: "LifeLabs", action: "Report Uploaded", resource: "CBC Report", tx: "0xB7d2…E45" },
  { ts: "2025-01-14 14:05", actor: "Dr. A. Nair", action: "Prescription Added", resource: "Metformin 500", tx: "0xC1a0…F78" },
  { ts: "2024-11-05 10:20", actor: "Apollo Radiology", action: "Image Uploaded", resource: "Chest X-Ray", tx: "0xD5b3…A23" },
];
const VITALS_HISTORY = {
  labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  glucose: [98, 104, 108, 102, 109, 112],
  systolic: [118, 122, 125, 120, 124, 128],
  weight: [68, 69, 70, 71, 71.5, 72],
  heartRate: [72, 74, 71, 73, 70, 72],
};
const MOCK_REMINDERS = [
  { id: 1, type: "Medication", text: "Metformin 500mg — after breakfast", time: "08:00 AM", color: "var(--teal-lt)" },
  { id: 2, type: "Medication", text: "Aspirin 75mg — after dinner", time: "08:00 PM", color: "var(--teal-lt)" },
  { id: 3, type: "Appointment", text: "Follow-up with Dr. Anjali Nair", time: "15 Apr · 10:30 AM", color: "var(--indigo-lt)" },
  { id: 4, type: "Lab Test", text: "HbA1c — due for next check", time: "20 Apr", color: "var(--amber-lt)" },
];

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accentClass, delay = "" }) {
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
  const m = {
    "Visit": "badge-teal",
    "Lab": "badge-indigo",
    "Prescription": "badge-amber",
    "Imaging": "badge-rose",
    "Lab Report": "badge-indigo",
    "Blood Test": "badge-rose",
    "Imaging / Scan": "badge-purple",
    "Discharge Summary": "badge-amber",
    "Vital Signs": "badge-teal",
    "Vaccination Record": "badge-green",
    "Allergy Record": "badge-rose",
    "Surgery Report": "badge-indigo"
  };
  const t = type || "Medical Record";
  return <span className={`badge ${m[t] || "badge-gray"}`}>{t}</span>;
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div className="tab-bar">
      {tabs.map(([k, l]) => <button key={k} className={`tab-btn ${active === k ? "active" : ""}`} onClick={() => onChange(k)}>{l}</button>)}
    </div>
  );
}

// ─── SVG MINI CHART ──────────────────────────────────────────────────────────
function MiniChart({ data, labels, color, unit, title }) {
  const W = 320, H = 100, pad = 28;
  const mn = Math.min(...data) - 4, mx = Math.max(...data) + 4;
  const pts = data.map((v, i) => ({
    x: pad + (data.length > 1 ? (i / (data.length - 1)) * (W - pad * 2) : (W - pad * 2) / 2),
    y: mx === mn ? H / 2 : H - pad - ((v - mn) / (mx - mn)) * (H - pad * 2)
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = d + ` L ${pts[pts.length - 1].x} ${H - pad} L ${pts[0].x} ${H - pad} Z`;
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <span style={{ fontWeight: 600, fontSize: 13 }}>{title}</span>
        <span className="badge badge-gray">{unit}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", overflow: "visible" }}>
        {[0, 1, 2].map(i => { const y = H - pad - i * ((H - pad * 2) / 2); const v = Math.round(mn + i * ((mx - mn) / 2)); return <g key={i}><line x1={pad} x2={W - pad} y1={y} y2={y} stroke="var(--border)" strokeWidth="1" /><text x={pad - 4} y={y + 4} textAnchor="end" fontSize="9" fill="var(--ink-faint)" fontFamily="var(--font-mono)">{v}</text></g>; })}
        {labels.map((l, i) => <text key={i} x={pts[i]?.x} y={H - 2} textAnchor="middle" fontSize="9" fill="var(--ink-faint)" fontFamily="var(--font-mono)">{l}</text>)}
        <path d={area} fill={color} opacity=".12" />
        <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2" />)}
      </svg>
    </div>
  );
}

// ─── QR CODE (SVG) ───────────────────────────────────────────────────────────
function QRDisplay({ value, hideText }) {
  const seed = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const sz = 21, cs = 6;
  const cells = [];
  for (let r = 0; r < sz; r++) for (let c = 0; c < sz; c++) {
    const finder = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);
    const timing = (r === 6 || c === 6) && !finder;
    let on = finder || ((seed * r * c + r * 7 + c * 13) % 3 === 0);
    if (timing) on = (r + c) % 2 === 0;
    cells.push({ r, c, on });
  }
  return (
    <div className="qr-box" style={hideText ? { padding: 6, gap: 0 } : {}}>
      <svg width={sz * cs + 8} height={sz * cs + 8} style={{ display: "block" }}>
        <rect width={sz * cs + 8} height={sz * cs + 8} fill="white" />
        {cells.map(({ r, c, on }) => on ? <rect key={`${r}${c}`} x={4 + c * cs} y={4 + r * cs} width={cs - 1} height={cs - 1} rx="1" fill="#0f1117" /> : null)}
      </svg>
      {!hideText && <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--ink-faint)", textAlign: "center", maxWidth: 130, wordBreak: "break-all", marginTop: 8 }}>{value}</div>}
    </div>
  );
}

// ─── AI SUMMARY PANEL ────────────────────────────────────────────────────────
function AISummaryPanel({ patient }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  async function generate() {
    setLoading(true);
    try {
      const pId = patient?.id;
      const data = await specialApi.getAIInsights(pId ? { patient_id: pId } : {});
      setSummary(data.summary);
    } catch (e) {
      console.error(e);
      setSummary("API Error: " + e.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="card fade-up">
      <div className="flex justify-between items-center mb-16">
        <div className="section-title mb-0">🤖 AI Health Summary</div>
        <button className="btn btn-purple btn-sm" onClick={generate} disabled={loading}>{loading ? <><span className="spin">⟳</span> Analysing…</> : "✦ Generate Summary"}</button>
      </div>
      {!summary && !loading && <div style={{ textAlign: "center", padding: "24px 0", color: "var(--ink-faint)" }}><div style={{ fontSize: 34, marginBottom: 8 }}>🧠</div><div style={{ fontWeight: 600, marginBottom: 4 }}>AI-Powered Health Insights</div><div className="text-sm">Click Generate to analyse all patient records and produce a clinical overview.</div></div>}
      {loading && <div style={{ textAlign: "center", padding: "24px 0", color: "var(--indigo)" }}><div className="spin" style={{ fontSize: 32, display: "block", marginBottom: 8 }}>⟳</div><div style={{ fontWeight: 600 }}>Analysing health records…</div><div className="text-sm" style={{ marginTop: 4 }}>Reading 14 records across visits, labs and prescriptions</div></div>}
      {summary && (
        <div className="ai-bubble">
          <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--purple)", marginBottom: 10, letterSpacing: ".06em", textTransform: "uppercase" }}>✦ AI Clinical Summary · Generated just now</div>
          {summary.split("\n").map((line, i) => <p key={i} style={{ fontSize: 14, lineHeight: 1.75, color: "var(--ink-soft)", marginBottom: line.startsWith("•") ? 4 : 8 }}>{line}</p>)}
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, fontSize: 12, background: "rgba(217,119,6,.08)", border: "1px solid #fde68a", color: "var(--amber)" }}>⚠️ AI-generated for clinical support only. Not a medical diagnosis.</div>
        </div>
      )}
    </div>
  );
}

// ─── RISK PREDICTION ─────────────────────────────────────────────────────────
function RiskPrediction({ patient }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  async function predict() {
    setLoading(true);
    try {
      const pId = patient?.id;
      const data = await specialApi.getAIInsights(pId ? { patient_id: pId } : {});
      setResults(data.risks);
    } catch (e) {
      alert("Risk Prediction Error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function level(r) { return r < 30 ? { label: "Low", cls: "risk-low", c: "var(--green)" } : r < 60 ? { label: "Moderate", cls: "risk-medium", c: "var(--amber)" } : { label: "High", cls: "risk-high", c: "var(--rose)" }; }

  return (
    <div className="card fade-up fade-up-1">
      <div className="flex justify-between items-center mb-16">
        <div className="section-title mb-0">🔬 Disease Risk Prediction</div>
        <button className="btn btn-outline btn-sm" onClick={predict} disabled={loading}>{loading ? <span className="spin">⟳</span> : "Run ML Model"}</button>
      </div>
      {!results && !loading && <div style={{ textAlign: "center", padding: "18px 0", color: "var(--ink-faint)" }}><div style={{ fontSize: 30, marginBottom: 8 }}>📊</div><div className="text-sm">Uses BMI, glucose, blood pressure and age via a Random Forest model to predict disease risk.</div></div>}
      {loading && <div style={{ textAlign: "center", padding: "18px 0" }}><div className="spin" style={{ fontSize: 26, display: "block", marginBottom: 8, color: "var(--teal)" }}>⟳</div><div className="text-sm text-faint">Running prediction model…</div></div>}
      {results && results.map((r, i) => {
        const lv = level(r.risk); return (
          <div key={i} className={`risk-card ${lv.cls}`}>
            <div className="flex justify-between items-center">
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
              <span className="badge" style={{ background: "white", color: lv.c, border: `1px solid ${lv.c}55` }}>{lv.label} · {r.risk}%</span>
            </div>
            <div className="risk-bar"><div className="risk-fill" style={{ width: `${r.risk}%`, background: r.color }} /></div>
          </div>
        );
      })}
      {results && <div style={{ marginTop: 10, padding: "9px 14px", borderRadius: 8, fontSize: 12, background: "rgba(217,119,6,.08)", border: "1px solid #fde68a", color: "var(--amber)" }}>⚠️ Probabilistic estimates only. Not a clinical diagnosis.</div>}
    </div>
  );
}

// ─── HEALTH CHARTS ───────────────────────────────────────────────────────────
function HealthCharts({ patientData }) {
  const [realVitals, setRealVitals] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const pId = patientData?.id;
        const data = await vitalsApi.getAll(pId ? { patient: pId } : {});
        if (Array.isArray(data) && data.length > 0) setRealVitals(data);
      } catch (e) { console.error("Vitals load error", e); }
    }
    load();
  }, [patientData]);

  // Process data for charts
  const sorted = Array.isArray(realVitals) ? [...realVitals].sort((a, b) => new Date(a.date) - new Date(b.date)) : [];
  const labels = sorted.map(v => new Date(v.date).toLocaleDateString('en-US', { month: 'short' }));
  const glucose = sorted.map(v => v.glucose).filter(x => x);
  const systolic = sorted.map(v => v.systolic).filter(x => x);
  const weight = sorted.map(v => v.weight).filter(x => x);
  const hr = sorted.map(v => v.heart_rate).filter(x => x);

  const isReal = labels.length > 0;
  const displayLabels = isReal ? labels : VITALS_HISTORY.labels;
  const displayGlucose = isReal ? (glucose.length > 0 ? glucose : [0]) : VITALS_HISTORY.glucose;
  const displaySystolic = isReal ? (systolic.length > 0 ? systolic : [0]) : VITALS_HISTORY.systolic;
  const displayWeight = isReal ? (weight.length > 0 ? weight : [0]) : VITALS_HISTORY.weight;
  const displayHr = isReal ? (hr.length > 0 ? hr : [0]) : [72, 74, 70, 73, 69, 72];

  return (
    <div className="card fade-up">
      <div className="section-title mb-20">📈 Health Trends — {labels.length > 0 ? "Real Data Log" : "Last 6 Months (Demo Data)"}</div>
      <div className="grid-2" style={{ gap: 28 }}>
        <MiniChart data={displayGlucose} labels={displayLabels} color="var(--amber)" unit="mg/dL" title="Blood Glucose" />
        <MiniChart data={displaySystolic} labels={displayLabels} color="var(--rose)" unit="mmHg" title="Systolic BP" />
        <MiniChart data={displayWeight} labels={displayLabels} color="var(--indigo)" unit="kg" title="Body Weight" />
        <MiniChart data={displayHr} labels={displayLabels} color="var(--teal)" unit="bpm" title="Heart Rate" />
      </div>
    </div>
  );
}

// ─── REMINDERS PANEL ─────────────────────────────────────────────────────────
function RemindersPanel({ patientData }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newR, setNewR] = useState({ text: "", time: new Date().toISOString().slice(0, 16), reminder_type: "Medication" });
  const icons = { "Medication": "💊", "Appointment": "🩺", "Lab Test": "🧪", "Other": "🔔" };
  const colors = { "Medication": "var(--teal-lt)", "Appointment": "var(--indigo-lt)", "Lab Test": "var(--amber-lt)", "Other": "var(--surface)" };

  useEffect(() => { loadReminders(); }, [patientData]);

  async function loadReminders() {
    setLoading(true);
    try {
      const pId = patientData?.id;
      const data = await remindersApi.getAll(pId ? { patient: pId } : {});
      setReminders(Array.isArray(data) ? data : []);
    } catch (e) { console.error("Failed to load reminders", e); }
    finally { setLoading(false); }
  }

  async function add() {
    if (!newR.text) { alert("Please enter a description for the reminder."); return; }
    if (!newR.time) { alert("Please select a date and time."); return; }
    setLoading(true);
    try {
      const data = { ...newR };
      if (patientData?.id) data.patient_id = patientData.id;
      await remindersApi.create(data);
      setNewR({ text: "", time: new Date().toISOString().slice(0, 16), reminder_type: "Medication" });
      setAdding(false);
      loadReminders();
    } catch (e) { alert("Error: " + e.message); }
    finally { setLoading(false); }
  }

  async function remove(id) {
    try {
      await remindersApi.delete(id);
      loadReminders();
    } catch (e) { alert("Error: " + e.message); }
  }

  return (
    <div className="card fade-up">
      <div className="flex justify-between items-center mb-16">
        <div className="section-title mb-0">⏰ Reminders & Alerts</div>
        <button className="btn btn-outline btn-sm" onClick={() => {
          if (!adding) setNewR(r => ({ ...r, time: new Date().toISOString().slice(0, 16) }));
          setAdding(a => !a);
        }}>{adding ? "Cancel" : "+ Add"}</button>
      </div>
      {adding && (
        <div style={{ background: "var(--surface)", borderRadius: "var(--radius)", padding: 14, marginBottom: 16, border: "1px solid var(--border)" }}>
          <div className="form-row" style={{ marginBottom: 10 }}>
            <div><label className="form-label">Type</label><select className="form-select" value={newR.reminder_type} onChange={e => setNewR(r => ({ ...r, reminder_type: e.target.value }))}>{Object.keys(icons).map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="form-label">Date & Time</label><input className="form-input" type="datetime-local" value={newR.time} onChange={e => setNewR(r => ({ ...r, time: e.target.value }))} /></div>
          </div>
          <div style={{ marginBottom: 10 }}><label className="form-label">Reminder Description</label><input className="form-input" placeholder="e.g. Take Metformin after breakfast" value={newR.text} onChange={e => setNewR(r => ({ ...r, text: e.target.value }))} /></div>
          <button className="btn btn-primary btn-sm" onClick={add} disabled={loading}>{loading ? "Saving..." : "Save Reminder"}</button>
        </div>
      )}
      {loading && reminders.length === 0 ? (
        <div style={{ textAlign: "center", padding: 20, color: "var(--ink-faint)" }}>Loading reminders...</div>
      ) : reminders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--ink-faint)" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>⏰</div>
          <p>No active reminders. Click + Add to create one.</p>
        </div>
      ) : (
        reminders.map(r => (
          <div className="reminder-item" key={r.id}>
            <div className="reminder-icon" style={{ background: colors[r.reminder_type] || "var(--surface)" }}>{icons[r.reminder_type] || "🔔"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{r.text}</div>
              <div style={{ fontSize: 12, color: "var(--ink-faint)", fontFamily: "var(--font-mono)" }}>{new Date(r.time).toLocaleString()}</div>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => remove(r.id)}>✕</button>
          </div>
        ))
      )}
    </div>
  );
}
// ─── UPLOAD REPORT PANEL ─────────────────────────────────────────────────────
function UploadReportPanel({ patientData, onSuccess }) {
  const [formData, setFormData] = useState({
    record_type: "Lab Report",
    date: new Date().toISOString().split('T')[0],
    provider: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!formData.provider) return alert("Please enter Provider / Facility.");
    if (!file) return alert("Please select a file to upload.");

    setLoading(true);
    try {
      const fd = new FormData();
      if (patientData?.id) fd.append("patient", patientData.id);
      fd.append("record_type", formData.record_type);
      fd.append("date", formData.date);
      fd.append("provider", formData.provider);
      fd.append("title", formData.record_type); // Just the type as title to avoid redundancy with provider field
      fd.append("file", file);

      await recordsApi.create(fd);
      alert("Report uploaded successfully! ✅");
      setFormData({ ...formData, provider: "" });
      setFile(null);
      if (onSuccess) onSuccess();
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade-up" style={{ maxWidth: 540 }}>
      <div className="section-title mb-20">📤 Upload Health Report</div>
      <div className="form-row mb-12">
        <div className="form-group mb-0">
          <label className="form-label">Report Type</label>
          <select className="form-select" value={formData.record_type} onChange={e => setFormData({ ...formData, record_type: e.target.value })}>
            <option>Lab Report</option>
            <option>Blood Test</option>
            <option>Imaging / Scan</option>
            <option>Prescription</option>
            <option>Discharge Summary</option>
            <option>Vital Signs</option>
            <option>Vaccination Record</option>
            <option>Allergy Record</option>
            <option>Surgery Report</option>

          </select>
        </div>
        <div className="form-group mb-0">
          <label className="form-label">Date</label>
          <input className="form-input" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Provider / Facility</label>
        <input className="form-input" placeholder="e.g. LifeLabs Diagnostics" value={formData.provider} onChange={e => setFormData({ ...formData, provider: e.target.value })} />
      </div>
      <div className="form-group">
        <label className="form-label">File</label>
        <label style={{ border: "2px dashed var(--border)", borderRadius: "var(--radius)", padding: "26px", textAlign: "center", background: "var(--surface)", cursor: "pointer", display: "block" }}>
          <input type="file" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
          <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
          <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>
            {file ? <span style={{ color: "var(--teal)", fontWeight: 500 }}>{file.name}</span> : <span>Drag & drop or <span style={{ color: "var(--teal)" }}>browse</span></span>}
          </div>
          <div className="text-xs text-faint" style={{ marginTop: 4 }}>PDF, PNG, JPG — max 10MB</div>
        </label>
      </div>
      <div className="alert alert-success">✅ File will be AES-256 encrypted and hashed on the blockchain.</div>
      <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Report"}
      </button>
    </div>
  );
}

function HealthLogPanel({ patientData }) {
  const [vitals, setVitals] = useState({ glucose: "", systolic: "", weight: "", heart_rate: "" });
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [newAllergy, setNewAllergy] = useState({ substance: "", severity: "Medium", reaction: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const pId = patientData?.id;
      const [v, a] = await Promise.all([
        vitalsApi.getAll(pId ? { patient: pId } : {}),
        allergiesApi.getAll(pId ? { patient: pId } : {})
      ]);
      const vData = Array.isArray(v) ? v : (v?.results || []);
      const aData = Array.isArray(a) ? a : (a?.results || []);
      setVitalsHistory(vData.sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id));
      setAllergies(aData.sort((a, b) => b.id - a.id));
    } catch (e) {
      console.error("Health log sync failed:", e);
      // Don't alert here to avoid annoying popups on every tab switch
    } finally {
      setLoading(false);
    }
  }

  async function saveVitals() {
    const cleaned = {};
    Object.keys(vitals).forEach(k => {
      if (vitals[k] !== "" && vitals[k] !== null) cleaned[k] = vitals[k];
    });
    // Add patient_id if we are logged in as admin/doctor viewing a patient
    if (patientData?.id) cleaned.patient_id = patientData.id;
    if (Object.keys(cleaned).length === (patientData?.id ? 1 : 0)) return;
    setLoading(true);
    try {
      await vitalsApi.create(cleaned);
      alert("Vitals logged successfully!");
      setVitals({ glucose: "", systolic: "", weight: "", heart_rate: "" });
      loadAll();
    } catch (e) { alert("Error: " + e.message); }
    finally { setLoading(false); }
  }

  async function addAllergy() {
    if (!newAllergy.substance) return;
    const data = { ...newAllergy };
    if (patientData?.id) data.patient_id = patientData.id;
    try {
      await allergiesApi.create(data);
      setNewAllergy({ substance: "", severity: "Medium", reaction: "" });
      loadAll();
    } catch (e) { alert("Error: " + e.message); }
  }

  async function deleteAllergy(id) {
    try {
      await allergiesApi.delete(id);
      loadAll();
    } catch (e) { alert("Error: " + e.message); }
  }

  return (
    <div className="grid-2 gap-20">
      <div className="card fade-up">
        <div className="section-title">📝 Monthly Health Log</div>
        <p className="text-sm text-faint mb-16">Update your vitals manually for accurate trend tracking.</p>
        <div className="form-group"><label className="form-label">Blood Glucose (mg/dL)</label><input className="form-input" type="number" placeholder="e.g. 110" value={vitals.glucose} onChange={e => setVitals({ ...vitals, glucose: e.target.value })} /></div>
        <div className="form-group"><label className="form-label">Systolic BP (mmHg)</label><input className="form-input" type="number" placeholder="e.g. 120" value={vitals.systolic} onChange={e => setVitals({ ...vitals, systolic: e.target.value })} /></div>
        <div className="form-group"><label className="form-label">Weight (kg)</label><input className="form-input" type="number" step="0.1" placeholder="e.g. 70.5" value={vitals.weight} onChange={e => setVitals({ ...vitals, weight: e.target.value })} /></div>
        <div className="form-group"><label className="form-label">Heart Rate (bpm)</label><input className="form-input" type="number" placeholder="e.g. 72" value={vitals.heart_rate} onChange={e => setVitals({ ...vitals, heart_rate: e.target.value })} /></div>
        <button className="btn btn-primary w-full" style={{ marginTop: 10 }} onClick={saveVitals} disabled={loading}>{loading ? "Saving..." : "Save Health Log →"}</button>

        {loading && <div style={{ textAlign: "center", padding: 20 }}><span className="spin" style={{ display: "inline-block" }}>⟳</span> Syncing...</div>}

        {Array.isArray(vitalsHistory) && vitalsHistory.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>Recent Logs</div>
            <div className="table-wrap">
              <table className="text-xs">
                <thead><tr><th>Date</th><th>Gluc.</th><th>BP</th><th>Wt.</th><th>HR</th></tr></thead>
                <tbody>
                  {vitalsHistory.slice(0, 3).map(vh => (
                    <tr key={vh.id}>
                      <td className="text-faint">{new Date(vh.date).toLocaleDateString()}</td>
                      <td>{vh.glucose || "—"}</td>
                      <td>{vh.systolic || "—"}</td>
                      <td>{vh.weight || "—"}</td>
                      <td>{vh.heart_rate || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="card fade-up fade-up-1">
        <div className="section-title">⚠️ Allergies</div>
        <p className="text-sm text-faint mb-16">Maintain a verified list of allergies for safer prescriptions.</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input className="form-input" placeholder="Substance (e.g. Penicillin)" value={newAllergy.substance} onChange={e => setNewAllergy({ ...newAllergy, substance: e.target.value })} />
          <select className="form-select" style={{ width: 130 }} value={newAllergy.severity} onChange={e => setNewAllergy({ ...newAllergy, severity: e.target.value })}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
          <button className="btn btn-primary" onClick={addAllergy}>Add</button>
        </div>
        <div className="table-wrap">
          <table className="text-sm">
            <thead><tr><th>Substance</th><th>Severity</th><th style={{ textAlign: "right" }}>Action</th></tr></thead>
            <tbody>
              {!Array.isArray(allergies) || allergies.length === 0 ? <tr><td colSpan="3" style={{ textAlign: "center", padding: 20, color: "var(--ink-faint)" }}>No allergies reported</td></tr> :
                allergies.map(a => (
                  <tr key={a.id}>
                    <td className="font-600">{a.substance}</td>
                    <td><span className={`badge ${a.severity === "High" ? "badge-rose" : a.severity === "Medium" ? "badge-amber" : "badge-teal"}`}>{a.severity}</span></td>
                    <td style={{ textAlign: "right" }}><button className="btn btn-outline btn-sm" style={{ color: "var(--rose)", borderColor: "rgba(225,29,72,0.1)" }} onClick={() => deleteAllergy(a.id)}>✕</button></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── PATIENT DASHBOARD ───────────────────────────────────────────────────────
function PatientDashboard({ tab, setTab }) {
  const [consents, setConsents] = useState([]);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordSearch, setRecordSearch] = useState("");

  const loadAll = async () => {
    try {
      const pt = await patientApi.getMe();
      if (pt) setPatientData(pt);

      const recs = await recordsApi.getAll();
      setRecords(Array.isArray(recs) ? recs : (recs?.results || []));

      const cons = await consentsApi.getAll();
      setConsents(Array.isArray(cons) ? cons : (cons?.results || []));
    } catch (e) {
      console.error("Failed to load real data, falling back to mock", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [tab]);

  async function revoke(id) { 
    try { await consentsApi.updateStatus(id, 'revoked'); loadAll(); } catch(e) { alert("Failed to revoke consent."); }
  }
  async function accept(id) {
    try { 
      const nextYear = new Date(); nextYear.setFullYear(nextYear.getFullYear() + 1);
      await consentsApi.updateStatus(id, 'active', nextYear.toISOString()); 
      loadAll(); 
    } catch(e) { alert("Failed to accept consent."); }
  }
  async function deny(id) {
    try { await consentsApi.updateStatus(id, 'denied'); loadAll(); } catch(e) { alert("Failed to deny consent."); }
  }
  const TABS = [["overview", "Overview"], ["records", "Records"], ["log", "📝 Health Log"], ["ai", "🤖 AI Insights"], ["charts", "📈 Charts"], ["consents", "Consents"], ["reminders", "Reminders"], ["upload", "Upload"], ["qr", "My QR"]];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const allRecords = [...records, ...MOCK_RECORDS].sort((a, b) => new Date(b.date || b.ts) - new Date(a.date || a.ts));

  return (
    <>
      <div className="topbar">
        <div className="topbar-left"><div style={{ fontSize: 18 }}>👤</div><h2>Patient Portal</h2></div>
        <div className="topbar-right">
          <div className="topbar-user">
            <strong>{patientData?.name || "Priya Sharma"}</strong>
            <span>ABHA: {patientData?.abha || "91-1234-5678-0001"}</span>
          </div>
          <div className="avatar">{patientData?.name ? patientData.name.split(' ').map(n => n[0]).join('') : "PS"}</div>
        </div>
      </div>
      <div className="page">
        <div className="page-header">
          <h3>{greeting}, {patientData?.name ? patientData.name.split(' ')[0] : 'Priya'} 👋</h3>
          <p>Your health records are up to date · <span style={{ color: "var(--amber)" }}>⚠ Glucose trending up — check AI Insights</span></p>
        </div>
        <TabBar tabs={TABS} active={tab} onChange={setTab} />

        {tab === "overview" && (<>
          <div className="grid-2 mb-20">
            <div className="abha-card fade-up">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="abha-label">Digital Health Card · ABHA</div>
                  <div className="abha-id">{patientData?.abha || "91-1234-5678-0001"}</div>
                  <div className="abha-name">{patientData?.name || "Priya Sharma"}</div>
                  <div className="abha-dob">DOB: {patientData?.dob || "14 Aug 1991"} · Blood: {patientData?.blood_group || "B+"} · {patientData?.gender || "Female"}</div>
                  <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span className="badge" style={{ background: "rgba(255,255,255,.15)", color: "#fff", fontSize: 11 }}>✓ Aadhaar Linked</span>
                    <span className="badge" style={{ background: "rgba(255,255,255,.15)", color: "#fff", fontSize: 11 }}>✓ ABDM Registered</span>
                  </div>
                </div>
                <div style={{ flexShrink: 0, background: "white", padding: "6px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                  <QRDisplay value="ABHA:91-1234-5678-0001" hideText />
                </div>
              </div>
            </div>
            <div className="card fade-up fade-up-1">
              <div className="section-title">📊 Latest Vitals <span className="text-xs text-faint font-mono">(12 Mar 2025)</span></div>
              {[["Blood Pressure", "128/82", "mmHg"], ["Heart Rate", "72", "bpm"], ["Blood Glucose", "112", "mg/dL"], ["BMI", "27.4", "kg/m²"], ["SpO₂", "98", "%"], ["Weight", "72", "kg"]].map(([l, v, u]) => (
                <div className="vital-row" key={l}><span className="vital-label">{l}</span><span><span className="vital-value">{v}</span> <span className="vital-unit">{u}</span></span></div>
              ))}
            </div>
          </div>
          <div className="grid-3 mb-20">
            <StatCard icon="📋" label="Total Records" value={allRecords.length} sub={`${records.length} uploaded, ${MOCK_RECORDS.length} sample`} accentClass="accent-teal" delay="fade-up-1" />
            <StatCard icon="🤝" label="Active Consents" value={consents.filter(c => c.status === "active").length} sub="Authorized providers" accentClass="accent-amber" delay="fade-up-2" />
            <StatCard icon="⛓️" label="Blockchain Logs" value={allRecords.length} sub="All records verified on-chain" accentClass="accent-indigo" delay="fade-up-3" />
          </div>
          <div className="card fade-up fade-up-4">
            <div className="section-title mb-20">🕒 Recent Activity</div>
            <div className="timeline">
              {allRecords.map((r, i) => (
                <div className="timeline-item" key={r.id || i}><div className="timeline-dot" /><div className="timeline-date">{r.date && !isNaN(new Date(r.date)) ? new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : (r.date || "Unknown Date")}</div>
                  <div className="flex items-center gap-8 mb-4">
                    <RecordTypeBadge type={r.record_type || r.type || "Report"} />
                    <span className="timeline-title">{r.title || r.record_type || "Medical Record"}</span>
                  </div>
                  <div className="timeline-sub">{r.doctor_name || r.provider}</div>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {tab === "records" && (
          <div className="card fade-up">
            <div className="flex justify-between items-center mb-20">
              <div className="section-title mb-0">All Health Records</div>
              <div className="search-bar" style={{ width: 220 }}><span className="search-icon">🔍</span><input className="form-input" placeholder="Search…" value={recordSearch} onChange={e => setRecordSearch(e.target.value)} /></div>
            </div>
            <div className="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Record</th><th>Provider</th><th>TX Hash</th><th>Document</th><th></th></tr></thead>
              <tbody>{allRecords.filter(r =>
                r.title?.toLowerCase().includes(recordSearch.toLowerCase()) ||
                (r.doctor_name || r.provider)?.toLowerCase().includes(recordSearch.toLowerCase()) ||
                (r.record_type || r.type)?.toLowerCase().includes(recordSearch.toLowerCase())
              ).map((r, i) => <tr key={r.id || i}><td className="font-mono text-sm text-faint">{r.date && !isNaN(new Date(r.date)) ? new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : (r.date || "Unknown Date")}</td><td><RecordTypeBadge type={r.record_type || r.type || "Report"} /></td><td className="font-600">{r.title || r.record_type || "Medical Record"}</td><td className="text-sm text-faint">{r.doctor_name || r.provider}</td><td>{(r.tx_hash || r.tx) && <span className="tx-hash">{r.tx_hash || r.tx}</span>}</td><td>{r.file ? <a href={r.file} target="_blank" rel="noreferrer" className="btn btn-primary btn-xs">📄 File</a> : <span className="text-faint text-xs">—</span>}</td><td><button className="btn btn-outline btn-sm" onClick={() => setViewingRecord(r)}>View</button></td></tr>)}</tbody></table></div>
          </div>
        )}

        {tab === "ai" && <div style={{ display: "flex", flexDirection: "column", gap: 20 }}><AISummaryPanel patient={patientData || MOCK_PATIENTS[0]} /><RiskPrediction patient={patientData || MOCK_PATIENTS[0]} /></div>}
        {tab === "log" && <HealthLogPanel patientData={patientData} />}
        {tab === "charts" && <HealthCharts patientData={patientData} />}

        {tab === "consents" && (
          <div className="fade-up">
            <div className="alert alert-info mb-20">🔐 All consent events are recorded on the blockchain. Revoking access takes effect immediately.</div>
            {consents.filter(c => c.status === "pending").length > 0 && (
              <>
                <div className="section-title mb-16">Pending Requests</div>
                {consents.filter(c => c.status === "pending").map(c => (
                  <div className="consent-item" key={c.id} style={{ borderLeft: "3px solid var(--amber)", background: "var(--amber-lt)", borderColor: "var(--amber-lt)" }}>
                    <div><div className="consent-name">{c.doctor_name || "Unknown Doctor"}</div><div className="consent-meta">{c.doctor_facility || "Clinic"} · {c.scope || "Full Records"}</div></div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => accept(c.id)}>Accept</button>
                      <button className="btn btn-outline btn-sm" onClick={() => deny(c.id)}>Deny</button>
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="section-title mb-16 mt-20">Active Consents</div>
            {consents.filter(c => c.status === "active").map(c => (
              <div className="consent-item" key={c.id}>
                <div><div className="consent-name">{c.doctor_name || "Unknown Doctor"}</div><div className="consent-meta">{c.doctor_facility || "Clinic"} · {c.scope || "Full Records"} · Expires: {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "Unlimited"}</div></div>
                <button className="btn btn-danger btn-sm" onClick={() => revoke(c.id)}>Revoke</button>
              </div>
            ))}
            <div className="section-title mb-16 mt-20">Expired / Revoked</div>
            {consents.filter(c => c.status === "revoked" || c.status === "denied").map(c => <div className="consent-item" key={c.id} style={{ opacity: .5 }}><div><div className="consent-name" style={{color:"var(--ink-faint)"}}>{c.doctor_name || "Unknown Doctor"}</div><div className="consent-meta">{c.doctor_facility || "Clinic"} · {c.scope || "Full Records"}</div></div><span className="badge" style={{background: "var(--border)", color: "var(--ink-soft)"}}>{c.status === "denied" ? "Denied" : "Revoked"}</span></div>)}
          </div>
        )}

        {tab === "reminders" && <RemindersPanel patientData={patientData} />}

        {tab === "upload" && <UploadReportPanel patientData={patientData} onSuccess={() => { setTab('records'); loadAll(); }} />}

        {tab === "qr" && (
          <div className="fade-up"><div className="grid-2" style={{ maxWidth: 680 }}>
            <div className="card" style={{ textAlign: "center" }}>
              <div className="section-title" style={{ justifyContent: "center" }}>📱 Your Patient QR Code</div>
              <p className="text-sm text-faint mb-20">Doctors can scan this QR to instantly look up your ABHA and request access.</p>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><QRDisplay value={`http://127.0.0.1:8000/patient/${patientData?.id || 1}/`} /></div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-faint)", marginBottom: 16 }}>ID: {patientData?.id || 1} · ABHA: {patientData?.abha || "91-1234-5678-0001"}</div>
              <button className="btn btn-primary btn-sm">⬇ Download QR</button>
            </div>
            <div className="card">
              <div className="section-title">ℹ️ How QR works</div>
              {[["1", "Doctor scans your QR code at the clinic."], ["2", "System looks up your ABHA ID and sends you a consent request."], ["3", "You approve or deny access from this app."], ["4", "Doctor gets time-limited access to approved records only."], ["5", "Every access is logged on the blockchain."]].map(([n, t]) => (
                <div key={n} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--teal-lt)", color: "var(--teal)", fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
                  <span className="text-sm" style={{ color: "var(--ink-soft)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div></div>
        )}

        {viewingRecord && (
          <div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setViewingRecord(null)}>
            <div className="card fade-up" style={{ width: "100%", maxWidth: 500, margin: "0 20px", textAlign: "center", padding: 40 }} onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-20" style={{ marginTop: -20 }}>
                <div className="section-title mb-0" style={{ fontSize: 24 }}>Record Details</div>
                <button className="btn btn-outline btn-sm" style={{ borderRadius: '50%', width: 36, height: 36, padding: 0 }} onClick={() => setViewingRecord(null)}>✕</button>
              </div>

              <div style={{ marginBottom: 16, fontSize: 18 }}>
                <strong>Type:</strong> <RecordTypeBadge type={viewingRecord.record_type || viewingRecord.type || "Report"} />
              </div>
              <div style={{ marginBottom: 16, fontSize: 22 }}>
                <strong>Title:</strong> {viewingRecord.title || viewingRecord.record_type || "Medical Record"}
              </div>
              <div style={{ marginBottom: 16, fontSize: 18 }}>
                <strong>Date:</strong> <span style={{ color: 'var(--ink-faint)' }}>{viewingRecord.date}</span>
              </div>
              <div style={{ marginBottom: 16, fontSize: 18 }}>
                <strong>Provider:</strong> {viewingRecord.doctor_name || viewingRecord.provider}
              </div>
              {(viewingRecord.tx_hash || viewingRecord.tx) && (
                <div style={{ marginBottom: 24, fontSize: 18 }}>
                  <strong>Blockchain TX:</strong> <span className="tx-hash" style={{ display: 'inline-block', verticalAlign: 'middle' }}>{viewingRecord.tx_hash || viewingRecord.tx}</span>
                </div>
              )}


              {viewingRecord.file && (
                <div style={{ background: 'var(--surface-lt)', padding: 20, borderRadius: 12, marginBottom: 10 }}>
                  <div className="flex justify-between items-center mb-10">
                    <span className="font-600">📄 Attached File</span>
                    <a href={viewingRecord.file} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">Open File</a>
                  </div>
                  {viewingRecord.file.match(/\.(jpg|jpeg|png|gif)$/i) && (
                    <img src={viewingRecord.file} alt="Preview" style={{ width: '100%', borderRadius: 8, marginTop: 10 }} />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </>
  );
}

// ─── DOCTOR DASHBOARD ────────────────────────────────────────────────────────
function QRScanner({ onScan, onClose }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
    
    const onScanSuccess = (decodedText) => {
      scanner.clear().then(() => {
        onScan(decodedText);
      }).catch(err => console.error(err));
    };

    scanner.render(onScanSuccess, (error) => {
      // console.warn(error);
    });

    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err));
    };
  }, []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "white", padding: "24px", borderRadius: "16px", maxWidth: "450px", width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 22 }}>Scan Patient QR</h3>
          <button onClick={onClose} style={{ border: "none", background: "var(--surface)", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <div id="reader" style={{ borderRadius: "12px", overflow: "hidden", border: "none" }}></div>
        <p style={{ marginTop: "16px", fontSize: "13px", color: "var(--ink-faint)", textAlign: "center" }}>Position the QR code within the frame to scan.</p>
      </div>
    </div>
  );
}

function DoctorDashboard({ tab, setTab, role = "doctor" }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [ptab, setPtab] = useState("records");
  const [doctorData, setDoctorData] = useState(null);
  const [patientsList, setPatientsList] = useState([]);
  const [recordForm, setRecordForm] = useState({ abha: "", type: "Consultation", date: new Date().toISOString().split('T')[0], complaint: "", notes: "", rx: "" });
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [registerForm, setRegisterForm] = useState({ phone: "", name: "" });

  useEffect(() => {
    async function loadData() {
      try {
        const doc = await doctorApi.getMe();
        if (doc) setDoctorData(doc);
        const pts = await doctorApi.getPatients();
        if (pts) setPatientsList(pts);
      } catch (e) {
        console.error("Failed to load doctor data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function fetchPatientRecords() {
      if (selected && ptab === "records") {
        try {
          const recs = await recordsApi.getAll({ patient: selected.id });
          setSelectedRecords(Array.isArray(recs) ? recs : (recs?.results || []));
        } catch (e) {
          console.error("Failed to fetch patient records", e);
          setSelectedRecords([]);
        }
      }
    }
    fetchPatientRecords();
  }, [selected, ptab]);

  const handleSaveRecord = async () => {
    try {
      if (!recordForm.abha) return alert("Patient ABHA ID is required");
      const dataStr = JSON.stringify({ notes: recordForm.notes, rx: recordForm.rx });
      await recordsApi.create({
        patient_abha: recordForm.abha,
        record_type: recordForm.type,
        date: recordForm.date,
        title: recordForm.complaint || recordForm.type,
        data: dataStr
      });
      alert("Record successfully saved and hashed on chain!");
      setRecordForm({ abha: "", type: "Consultation", date: new Date().toISOString().split('T')[0], complaint: "", notes: "", rx: "" });
    } catch (e) {
      if (e.message.includes("403") || e.message.toLowerCase().includes("permission") || e.message.toLowerCase().includes("consent")) {
        alert("Action Denied: You do not have active consent from this patient. Please scan their QR and 'Request Consent' first.");
      } else {
        alert("Error saving record: " + e.message);
      }
    }
  };

  const filtered = patientsList.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.abha?.includes(search));

  const handleQRScan = async (decodedText) => {
    setShowScanner(false);
    try {
      const res = await specialApi.lookupByQR(decodedText);
      setSelected(res);
      // If we find a match, maybe even switch to patient tab?
    } catch (e) {
      alert("Patient not found for this QR code.");
    }
  };

  const handleRegisterPatient = async () => {
    if (!registerForm.phone || !registerForm.name) {
      return alert("Phone number and Name are required.");
    }
    if (registerForm.phone.length < 10) {
      return alert("Please enter a valid phone number.");
    }
    try {
      setLoading(true);
      await doctorApi.registerPatient({ phone_number: registerForm.phone, name: registerForm.name });
      alert("Patient registered successfully and consent granted.");
      setRegisterForm({ phone: "", name: "" });
      const pts = await doctorApi.getPatients();
      setPatientsList(pts);
      setTab("patients");
    } catch (e) {
      alert("Error registering patient: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showScanner && <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />}
      <div className="topbar">
        <div className="topbar-left"><div style={{ fontSize: 18 }}>{role === "lab" ? "🔬" : role === "pharma" ? "💊" : role === "clinic" ? "🏥" : "🩺"}</div><h2>{role === "pharma" ? "Pharmacy" : role === "clinic" ? "Clinic" : role === "lab" ? "Lab" : "Doctor"} Dashboard</h2></div>
        <div className="topbar-right">
          <div className="topbar-user">
            <strong>{doctorData ? doctorData.name : "Dr. Anjali Nair"}</strong>
            <span>{doctorData ? doctorData.facility : "City Hospital"} · {doctorData ? doctorData.specialty : "Internal Medicine"}</span>
          </div>
          <div className="avatar" style={{ background: "var(--amber-lt)", color: "var(--amber)" }}>
            {doctorData ? doctorData.name.split(' ').map(n => n[0]).join('') : "AN"}
          </div>
        </div>
      </div>
      <div className="page">
        <div className="page-header"><h3>{role === "pharma" ? "Pharmacy" : role === "clinic" ? "Clinic" : role === "lab" ? "Lab" : "Doctor"} Dashboard</h3><p>Manage patients, add records, run AI summaries and disease risk predictions</p></div>
        <div className="grid-4 mb-24">
          <StatCard icon="👥" label="My Patients" value={patientsList.length} sub="Authorised access" accentClass="accent-teal" delay="fade-up-1" />
          <StatCard icon="📋" label="Records Today" value="8" sub="Viewed or uploaded" accentClass="accent-amber" delay="fade-up-2" />
          <StatCard icon="⏳" label="Pending Consents" value="3" sub="Awaiting patient reply" accentClass="accent-rose" delay="fade-up-3" />
          <StatCard icon="🔬" label="High Risk Patients" value={patientsList.filter(p => (p.bmi > 30 || p.glucose > 130)).length} sub="Flagged by AI model" accentClass="accent-purple" delay="fade-up-4" />
        </div>
        <TabBar tabs={[["patients", "Patients"], ["register", "Register Patient"], ["add", "Add Record"], ["qrscan", "Scan QR"], ["aitools", "AI Tools"]]} active={tab} onChange={setTab} />

        {tab === "register" && (
          <div className="card fade-up" style={{ maxWidth: 540 }}>
            <div className="section-title mb-20">📝 Register New Patient</div>
            <p className="text-sm text-faint mb-20">Register a patient on their behalf. This will automatically set up their profile and grant you consent to access their records.</p>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" placeholder="e.g. 9876543210" value={registerForm.phone} onChange={e => setRegisterForm({...registerForm, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="e.g. Priya Sharma" value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} />
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleRegisterPatient} disabled={loading}>
              {loading ? <span className="spin">⟳</span> : "Register & Request Consent"}
            </button>
          </div>
        )}

        {tab === "patients" && (
          <div className="grid-auto gap-20">
            <div>
              <div className="card fade-up">
                <div className="section-title mb-16">🔍 Patient Search</div>
                <div className="search-bar mb-16"><span className="search-icon">🔍</span><input className="form-input" placeholder="Name or ABHA ID…" value={search} onChange={e => setSearch(e.target.value)} /></div>
                <div className="table-wrap"><table><thead><tr><th>Patient</th><th>ABHA</th><th>Age</th><th>BMI</th><th>Risk</th><th></th></tr></thead>
                  <tbody>{filtered.map(p => {
                    const risk = p.bmi > 30 || p.glucose > 130 ? "High" : p.bmi > 25 || p.glucose > 100 ? "Medium" : "Low"; return (
                      <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => { setSelected(p); setPtab("records"); }}>
                        <td><div className="flex items-center gap-8"><div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{p.name[0]}{p.name.split(" ")[1][0]}</div><span className="font-600">{p.name}</span></div></td>
                        <td className="font-mono text-xs text-faint">{p.abha}</td>
                        <td className="text-sm">{p.age}{p.gender}</td>
                        <td className="font-mono text-sm">{p.bmi}</td>
                        <td><span className={`badge ${risk === "High" ? "badge-rose" : risk === "Medium" ? "badge-amber" : "badge-teal"}`}>{risk}</span></td>
                        <td><button className="btn btn-outline btn-sm">View →</button></td>
                      </tr>
                    );
                  })}</tbody></table></div>
              </div>
            </div>
            <div>
              {selected ? (
                <div className="card fade-up">
                  <div className="flex items-center gap-12 mb-16"><div className="avatar" style={{ width: 44, height: 44, fontSize: 16 }}>{selected.name[0]}{selected.name.split(" ")[1][0]}</div><div><div className="font-600" style={{ fontSize: 16 }}>{selected.name}</div><div className="text-xs text-faint font-mono">{selected.abha}</div></div><span className="badge badge-teal" style={{ marginLeft: "auto" }}>✓ Access</span></div>
                  <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
                    {[["records", "Records"], ["vitals", "Vitals"], ["rx", "Rx"], ["ai", "AI"]].map(([k, l]) => <button key={k} className={`tab-btn ${ptab === k ? "active" : ""}`} style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setPtab(k)}>{l}</button>)}
                  </div>
                  {ptab === "records" && (
                    <div className="timeline">
                      {[...selectedRecords, ...MOCK_RECORDS].map((r, i) => (
                        <div className="timeline-item" key={i}>
                          <div className="timeline-dot" />
                          <div className="timeline-date">{r.date}</div>
                          <div className="flex items-center gap-8 mb-4">
                            <RecordTypeBadge type={r.record_type || r.type} />
                            <span className="timeline-title">{r.title}</span>
                          </div>
                          <div className="text-sm text-faint">{r.doctor_name || r.provider}</div>
                          <div style={{ marginTop: 8 }}><span className="tx-hash">{r.tx_hash || r.tx}</span></div>
                        </div>
                      ))}
                      {selectedRecords.length === 0 && <div className="text-sm text-faint" style={{ padding: "10px 0" }}>No matching records found in system. Showing history.</div>}
                    </div>
                  )}
                  {ptab === "vitals" && [["Blood Pressure", selected.bp, "mmHg"], ["BMI", selected.bmi, "kg/m²"], ["Blood Glucose", selected.glucose, "mg/dL"], ["Weight", selected.weight, "kg"]].map(([l, v, u]) => <div className="vital-row" key={l}><span className="vital-label">{l}</span><span><span className="vital-value">{v}</span> <span className="vital-unit">{u}</span></span></div>)}
                  {ptab === "rx" && [{ drug: "Metformin 500mg", freq: "Twice daily", d: "90 days", date: "14 Jan 2025" }, { drug: "Aspirin 75mg", freq: "Once daily", d: "30 days", date: "12 Mar 2025" }].map((rx, i) => <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}><div className="font-600 mb-4">{rx.drug}</div><div className="text-sm text-faint">{rx.freq} · {rx.d}</div><div className="text-xs text-faint font-mono" style={{ marginTop: 4 }}>{rx.date}</div></div>)}
                  {ptab === "ai" && <div style={{ display: "flex", flexDirection: "column", gap: 14 }}><AISummaryPanel patient={selected} /><RiskPrediction patient={selected} /></div>}
                </div>
              ) : (
                <div className="card fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 260, textAlign: "center", color: "var(--ink-faint)" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Select a Patient</div>
                  <div className="text-sm">Click a patient row to view their authorised records and AI insights.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "add" && (
          <div className="card fade-up" style={{ maxWidth: 540 }}>
            <div className="section-title mb-20">➕ Add Visit / Record</div>
            <div className="form-group"><label className="form-label">Patient ABHA ID</label><input className="form-input" placeholder="91-xxxx-xxxx-xxxx" style={{ fontFamily: "var(--font-mono)", letterSpacing: 2 }} value={recordForm.abha} onChange={e => setRecordForm({...recordForm, abha: e.target.value})} /></div>
            <div className="form-row"><div className="form-group"><label className="form-label">Visit Type</label><select className="form-select" value={recordForm.type} onChange={e => setRecordForm({...recordForm, type: e.target.value})}><option>Consultation</option><option>Follow-up</option><option>Emergency</option></select></div><div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={recordForm.date} onChange={e => setRecordForm({...recordForm, date: e.target.value})} /></div></div>
            <div className="form-group"><label className="form-label">Chief Complaint</label><input className="form-input" placeholder="e.g. Persistent cough, fatigue" value={recordForm.complaint} onChange={e => setRecordForm({...recordForm, complaint: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Clinical Notes</label><textarea className="form-input" rows={3} style={{ resize: "vertical" }} placeholder="Examination findings, diagnosis, plan…" value={recordForm.notes} onChange={e => setRecordForm({...recordForm, notes: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Prescription</label><textarea className="form-input" rows={2} placeholder="Drug name, dosage, frequency…" value={recordForm.rx} onChange={e => setRecordForm({...recordForm, rx: e.target.value})} /></div>
            <div className="alert alert-success">✅ Record will be hashed and stored on-chain. Patient will be notified.</div>
            <button className="btn btn-primary" onClick={handleSaveRecord}>Save & Record on Chain</button>
          </div>
        )}

        {tab === "qrscan" && (
          <div className="card fade-up" style={{ maxWidth: 500 }}>
            <div className="section-title mb-16">📸 Scan Patient QR Code</div>
            <p className="text-sm text-faint mb-20">Scan the patient's secure ABHA QR code to automatically retrieve demographics and request record access.</p>
            <div style={{ border: "2px dashed var(--border)", borderRadius: "var(--radius)", padding: "36px", textAlign: "center", background: "var(--surface)", marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Live QR Scanner</div>
              <div className="text-sm text-faint mb-20">Click the button below to activate your device's camera.</div>
              <button className="btn btn-primary" onClick={() => setShowScanner(true)}>Open Camera Scanner</button>
            </div>
            <div className="section-title mb-12" style={{ fontSize: 13 }}>Or enter manually</div>
            <div className="flex gap-8">
              <input className="form-input" id="qr-lookup-input" placeholder="Patient ID or ABHA ID" style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={async () => {
                const val = document.getElementById('qr-lookup-input').value;
                if (!val) return;
                try {
                  const res = await specialApi.lookupByQR(val);
                  setSelected(res);
                } catch (e) { alert("Patient not found in system."); }
              }}>Look Up</button>
            </div>
            {selected && <div style={{ marginTop: 14, padding: 14, background: "var(--teal-lt)", borderRadius: "var(--radius)", border: "1px solid var(--teal-mid)" }}><div className="font-600" style={{ color: "var(--teal)" }}>{selected.name}</div><div className="text-xs font-mono text-faint">{selected.abha}</div><div className="text-sm" style={{ marginTop: 4 }}>Age {selected.age} · {selected.gender === "F" ? "Female" : "Male"}</div><button className="btn btn-primary btn-sm" style={{ marginTop: 10 }} onClick={async () => {
              try {
                await consentsApi.create(selected.id, "Full Records");
                alert("Consent request sent to patient.");
              } catch(e) { alert("Error requesting consent: " + e.message); }
            }}>Request Consent →</button></div>}
          </div>
        )}

        {tab === "aitools" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="alert alert-info">🤖 Select a patient from the Patients tab to run AI analysis. Below shows aggregate stats for your patient list.</div>
            <div className="grid-3">
              <div className="card fade-up"><div className="card-title">High Risk Patients</div><div className="card-value" style={{ color: "var(--rose)" }}>5</div><div className="card-sub">BMI &gt;30 or Glucose &gt;130</div></div>
              <div className="card fade-up fade-up-1"><div className="card-title">Avg Patient BMI</div><div className="card-value" style={{ color: "var(--amber)" }}>27.3</div><div className="card-sub">Overweight range (normal: 18.5–24.9)</div></div>
              <div className="card fade-up fade-up-2"><div className="card-title">Avg Glucose</div><div className="card-value" style={{ color: "var(--indigo)" }}>110</div><div className="card-sub">mg/dL · Pre-diabetic threshold: 100</div></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
function AdminDashboard({ tab, setTab }) {
  const [providers, setProviders] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [stats, setStats] = useState({ total_patients: 0, total_providers: 0, total_records: 0, total_audits: 0 });
  const [viewingPatient, setViewingPatient] = useState(null);
  const [viewingProvider, setViewingProvider] = useState(null);
  const [registeringProvider, setRegisteringProvider] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [docs, pts, audits, st] = await Promise.all([
          doctorApi.getAll().catch(() => []),
          patientApi.getAll().catch(() => []),
          auditApi.getAll().catch(() => []),
          adminApi.getStats().catch(() => ({ total_patients: 0, total_providers: 0, total_records: 0, total_audits: 0 }))
        ]);
        if (docs && docs.length > 0) setProviders(docs);
        if (pts && pts.length > 0) setPatientsList(pts);
        if (audits && audits.length > 0) setAuditLogs(audits);
        if (st) setStats(st);
      } catch (e) {
        console.error("Failed to load admin data", e);
      }
    }
    loadData();
  }, []);

  function approve(id) { setProviders(ps => ps.map(p => p.id === id ? { ...p, status: "verified" } : p)); }
  const adminIdentifier = localStorage.getItem('user_phone') || "Admin";
  return (
    <>
      <div className="topbar">
        <div className="topbar-left"><div style={{ fontSize: 18 }}>⚙️</div><h2>Admin Panel</h2></div>
        <div className="topbar-right"><div className="topbar-user"><strong>{adminIdentifier}</strong><span>ABDM Portal</span></div><div className="avatar" style={{ background: "var(--indigo-lt)", color: "var(--indigo)" }}>{adminIdentifier.substring(0, 2).toUpperCase()}</div></div>
      </div>
      <div className="page">
        <div className="page-header"><h3>System Administration</h3><p>Manage providers, patients, audit logs and analytics</p></div>
        <div className="grid-4 mb-24">
          <StatCard icon="👥" label="Total Patients" value={stats.total_patients || patientsList.length || "0"} sub="Registered profiles" accentClass="accent-teal" delay="fade-up-1" />
          <StatCard icon="🏥" label="Providers" value={stats.total_providers || providers.length || "0"} sub="Registered facilities" accentClass="accent-amber" delay="fade-up-2" />
          <StatCard icon="📋" label="EHR Records" value={stats.total_records || "0"} sub="Total clinical notes" accentClass="accent-indigo" delay="fade-up-3" />
          <StatCard icon="⛓️" label="Blockchain TXs" value={stats.total_audits || auditLogs.length || "0"} sub="100% verified" accentClass="accent-rose" delay="fade-up-4" />
        </div>
        <TabBar tabs={[["providers", "Providers"], ["patients", "Patients"], ["audit", "Audit Log"], ["analytics", "Analytics"]]} active={tab} onChange={setTab} />

        {tab === "providers" && (
          <div className="card fade-up">
            <div className="flex justify-between items-center mb-20"><div className="section-title mb-0">Registered Providers</div><button className="btn btn-primary btn-sm" onClick={() => setRegisteringProvider(true)}>+ Register Provider</button></div>
            <div className="table-wrap"><table><thead><tr><th>Provider</th><th>Specialty</th><th>HFR ID</th><th>Patients</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>{(providers.length > 0 ? providers : MOCK_PROVIDERS).map(p => <tr key={p.id}><td><div className="font-600">{p.name}</div><div className="text-xs text-faint">{p.facility}</div></td><td className="text-sm">{p.specialty}</td><td className="font-mono text-xs text-faint">{p.hfr_id || p.hfr}</td><td className="text-sm">{p.patients > 0 ? p.patients : "—"}</td><td><span className={`badge ${p.status === "verified" ? "badge-teal" : p.status === "pending" ? "badge-amber" : "badge-gray"}`}>{p.status}</span></td><td>{p.status === "pending" ? <button className="btn btn-primary btn-sm" onClick={() => approve(p.id)}>Approve</button> : <button className="btn btn-outline btn-sm" onClick={() => setViewingProvider(p)}>View</button>}</td></tr>)}</tbody></table></div>
          </div>
        )}

        {tab === "patients" && (
          <div className="card fade-up">
            <div className="flex justify-between items-center mb-20"><div className="section-title mb-0">Patient Registry</div><div className="search-bar" style={{ width: 220 }}><span className="search-icon">🔍</span><input className="form-input" placeholder="Search patients…" value={patientSearch} onChange={e => setPatientSearch(e.target.value)} /></div></div>
            <div className="table-wrap"><table><thead><tr><th>Patient</th><th>ABHA ID</th><th>Age/Sex</th><th>Blood</th><th>BMI</th><th>Status</th><th></th></tr></thead>
              <tbody>{(patientsList.length > 0 ? patientsList : MOCK_PATIENTS).filter(p => (p.name || "").toLowerCase().includes(patientSearch.toLowerCase()) || (p.abha || "").includes(patientSearch)).map(p => <tr key={p.id}><td><div className="flex items-center gap-8"><div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{(p.name || "?")[0]}{(p.name || " ").split(" ")[1]?.[0] || ''}</div><span className="font-600">{p.name || "Unnamed"}</span></div></td><td className="font-mono text-xs text-faint">{p.abha || "—"}</td><td className="text-sm">{p.age || "—"}/{p.gender || "—"}</td><td><span className="badge badge-rose">{p.blood_group || p.blood || "—"}</span></td><td className="font-mono text-sm">{p.bmi || "—"}</td><td><span className={`badge ${p.status === "active" ? "badge-teal" : "badge-gray"}`}>{p.status || "active"}</span></td><td><button className="btn btn-outline btn-sm" onClick={() => setViewingPatient(p)}>View</button></td></tr>)}</tbody></table></div>
          </div>
        )}

        {tab === "audit" && (
          <div className="card fade-up">
            <div className="flex justify-between items-center mb-16"><div className="section-title mb-0">⛓️ Blockchain Audit Log</div><button className="btn btn-outline btn-sm">Export CSV</button></div>
            <div className="alert alert-success mb-16">✅ All transactions verified. Last check: just now.</div>
            <div className="table-wrap"><table><thead><tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Resource</th><th>TX Hash</th><th>Verified</th></tr></thead>
              <tbody>{(auditLogs.length > 0 ? auditLogs : MOCK_AUDIT).map((a, i) => <tr key={a.id || i}><td className="font-mono text-xs text-faint">{new Date(a.timestamp || a.ts).toLocaleString()}</td><td className="font-600 text-sm">{a.actor_name || a.actor}</td><td className="text-sm">{a.action}</td><td className="text-sm text-faint">{a.resource || "System"}</td><td><span className="tx-hash">{a.tx_hash || a.tx}</span></td><td><span className="badge badge-teal">✓</span></td></tr>)}</tbody></table></div>
          </div>
        )}

        {tab === "analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="grid-2">
              <div className="card fade-up">
                <div className="section-title mb-16">📊 BMI Distribution</div>
                {[["Underweight <18.5", "2%", "var(--indigo)"], ["Normal 18.5–24.9", "38%", "var(--green)"], ["Overweight 25–29.9", "41%", "var(--amber)"], ["Obese >30", "19%", "var(--rose)"]].map(([l, pct, c]) => (
                  <div key={l} style={{ marginBottom: 12 }}><div className="flex justify-between text-sm mb-4"><span>{l}</span><strong>{pct}</strong></div><div className="risk-bar"><div className="risk-fill" style={{ width: pct, background: c }} /></div></div>
                ))}
              </div>
              <div className="card fade-up fade-up-1">
                <div className="section-title mb-16">🧪 Common Diagnoses</div>
                {[["Hypertension", "34%", "var(--rose)"], ["Pre-Diabetes", "28%", "var(--amber)"], ["Obesity", "22%", "var(--purple)"], ["Anaemia", "11%", "var(--indigo)"], ["Thyroid", "5%", "var(--teal)"]].map(([l, pct, c]) => (
                  <div key={l} style={{ marginBottom: 12 }}><div className="flex justify-between text-sm mb-4"><span>{l}</span><strong>{pct}</strong></div><div className="risk-bar"><div className="risk-fill" style={{ width: pct, background: c }} /></div></div>
                ))}
              </div>
            </div>
            <div className="card fade-up fade-up-2">
              <div className="section-title mb-20">📈 System EHR Records Created (6 months)</div>
              <MiniChart data={[410, 538, 621, 714, 802, 921]} labels={["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]} color="var(--teal)" unit="records" title="" />
            </div>
          </div>
        )}

        {viewingPatient && (
          <div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div className="card fade-up" style={{ width: "100%", maxWidth: 500, margin: "0 20px" }}>
              <div className="flex justify-between items-center mb-16"><div className="section-title mb-0">Patient Profile</div><button className="btn btn-outline btn-sm" onClick={() => setViewingPatient(null)}>✕</button></div>
              <div style={{ marginBottom: 12 }}><strong>Name:</strong> <span style={{ fontSize: 16 }}>{viewingPatient.name}</span></div>
              <div style={{ marginBottom: 12 }}><strong>ABHA ID:</strong> <span className="font-mono text-sm text-faint">{viewingPatient.abha}</span></div>
              <div style={{ marginBottom: 12 }}><strong>Age/Sex:</strong> {viewingPatient.age} / {viewingPatient.gender}</div>
              <div style={{ marginBottom: 12 }}><strong>Blood Group:</strong> <span className="badge badge-rose">{viewingPatient.blood}</span></div>
              <div style={{ marginBottom: 12 }}><strong>BMI:</strong> {viewingPatient.bmi}</div>
              <div style={{ marginBottom: 12 }}><strong>Status:</strong> <span className={`badge ${viewingPatient.status === "active" ? "badge-teal" : "badge-gray"}`}>{viewingPatient.status}</span></div>
            </div>
          </div>
        )}

        {viewingProvider && (
          <div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div className="card fade-up" style={{ width: "100%", maxWidth: 500, margin: "0 20px" }}>
              <div className="flex justify-between items-center mb-16"><div className="section-title mb-0">Provider Details</div><button className="btn btn-outline btn-sm" onClick={() => setViewingProvider(null)}>✕</button></div>
              <div style={{ marginBottom: 12 }}><strong>Name:</strong> <span style={{ fontSize: 16 }}>{viewingProvider.name}</span></div>
              <div style={{ marginBottom: 12 }}><strong>Specialty:</strong> {viewingProvider.specialty || 'N/A'}</div>
              <div style={{ marginBottom: 12 }}><strong>Facility:</strong> {viewingProvider.facility}</div>
              <div style={{ marginBottom: 12 }}><strong>HFR ID:</strong> <span className="font-mono text-sm text-faint">{viewingProvider.hfr}</span></div>
              <div style={{ marginBottom: 12 }}><strong>Patients:</strong> {viewingProvider.patients || '0'}</div>
              <div style={{ marginBottom: 12 }}><strong>Status:</strong> <span className={`badge ${viewingProvider.status === "verified" ? "badge-teal" : viewingProvider.status === "pending" ? "badge-amber" : "badge-gray"}`}>{viewingProvider.status}</span></div>
            </div>
          </div>
        )}

        {registeringProvider && (
          <div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px", overflowY: "auto" }}>
            <div className="card fade-up" style={{ width: "100%", maxWidth: 600, padding: 40, margin: "auto" }}>
              <ProviderRegister onDone={() => { setRegisteringProvider(false); setTab("providers"); }} onBack={() => setRegisteringProvider(false)} />
            </div>
          </div>
        )}

      </div>
    </>
  );
}

// ─── REGISTRATION ────────────────────────────────────────────────────────────
function OtpStep({ phone, onVerify, onBack, label = "Verify Mobile Number" }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  function h(i, val) { if (!/^\d?$/.test(val)) return; const n = [...otp]; n[i] = val; setOtp(n); if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus(); if (!val && i > 0) document.getElementById(`otp-${i - 1}`)?.focus(); }
  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 22 }}><div style={{ fontSize: 36, marginBottom: 8 }}>📱</div><h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, marginBottom: 4, color: "var(--ink)" }}>{label}</h2><p style={{ color: "var(--ink-faint)", fontSize: 14 }}>Code sent to <strong>{phone || "+91 ••••••0001"}</strong></p><p style={{fontSize: 10, color: "var(--amber)", marginTop: 4}}>Demo Mode: Use 123456</p></div>
      <div className="form-group"><label className="form-label">Enter OTP</label><div className="otp-boxes">{otp.map((v, i) => <input key={i} id={`otp-${i}`} className="otp-box" maxLength={1} value={v} onChange={e => h(i, e.target.value)} />)}</div></div>
      <button className="btn btn-primary w-full" style={{ marginTop: 8 }} onClick={() => {
        const code = otp.join('');
        if (code.length !== 6) { alert("Please enter the full 6-digit code."); return; }
        onVerify(code);
      }}>Verify & Continue →</button>
      <button className="btn btn-outline w-full" style={{ marginTop: 10 }} onClick={onBack}>← Back</button>
    </>
  );
}

function StepIndicator({ steps, current }) {
  return (
    <div className="step-row">
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: i < current ? "var(--teal)" : i === current ? "var(--ink)" : "var(--border)", color: i <= current ? "#fff" : "var(--ink-faint)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, fontFamily: "var(--font-mono)", flexShrink: 0 }}>{i < current ? "✓" : i + 1}</div>
            <span style={{ fontSize: 9, whiteSpace: "nowrap", color: i === current ? "var(--ink)" : "var(--ink-faint)", fontWeight: i === current ? 600 : 400, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".04em" }}>{s}</span>
          </div>
          {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: i < current ? "var(--teal)" : "var(--border)", margin: "0 6px", marginBottom: 18 }} />}
        </div>
      ))}
    </div>
  );
}

function PatientRegister({ onDone, onBack }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ phone: "", email: "", firstName: "", lastName: "", dob: "", gender: "", blood: "", state: "", city: "", eName: "", eRel: "", ePhone: "", abhaChoice: "new", aadhaarLast4: "" });
  const s = (k, v) => setF(x => ({ ...x, [k]: v }));

  async function handleSendOtp() {
    if (f.phone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.sendOtp(f.phone);
      alert("Demo OTP: " + (res.otp_demo || "123456"));
      setStep(1);
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(otp) {
    setLoading(true);
    try {
      await authApi.verifyOtp(f.phone, otp, "patient", "register");
      setStep(2);
    } catch (e) {
      alert("Invalid OTP. Try 123456");
    } finally {
      setLoading(false);
    }
  }

  async function handleFinish() {
    setLoading(true);
    try {
      await patientApi.updateProfile({
        first_name: f.firstName,
        last_name: f.lastName,
        dob: f.dob,
        gender: f.gender,
        blood_group: f.blood,
        state: f.state,
        city: f.city,
        emergency_name: f.eName,
        emergency_relation: f.eRel,
        emergency_phone: f.ePhone
      });
      setStep(5);
    } catch (e) {
      alert("Error saving profile: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (<>
    <StepIndicator steps={["Mobile", "Verify", "Profile", "ABHA", "eKYC", "Done"]} current={step} />
    {step === 0 && (<><h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, marginBottom: 4 }}>Create Patient Account</h2><p style={{ color: "var(--ink-faint)", fontSize: 14, marginBottom: 20 }}>Register to get your Digital Health Card</p>
      <div className="form-group"><label className="form-label">Mobile Number</label><div style={{ display: "flex", gap: 8 }}><select className="form-select" style={{ width: 76, flexShrink: 0 }}><option>+91</option></select><input className="form-input" placeholder="98765 43210" maxLength={10} value={f.phone} onChange={e => s("phone", e.target.value.replace(/\D/g, ""))} /></div></div>
      <div className="form-group"><label className="form-label">Email <span className="text-faint">(optional)</span></label><input className="form-input" type="email" value={f.email} onChange={e => s("email", e.target.value)} /></div>
      <button className="btn btn-primary w-full" disabled={loading} onClick={handleSendOtp}>{loading ? "Sending..." : "Send OTP →"}</button>
      <button className="btn btn-outline w-full" style={{ marginTop: 10 }} onClick={onBack}>← Back</button>
    </>)}
    {step === 1 && <OtpStep phone={f.phone} onVerify={handleVerifyOtp} onBack={() => setStep(0)} />}
    {step === 2 && (<><h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, marginBottom: 4 }}>Personal Information</h2><p style={{ color: "var(--ink-faint)", fontSize: 14, marginBottom: 18 }}>Creates your health profile.</p>
      <div className="form-row"><div className="form-group"><label className="form-label">First Name</label><input className="form-input" placeholder="Priya" value={f.firstName} onChange={e => s("firstName", e.target.value)} /></div><div className="form-group"><label className="form-label">Last Name</label><input className="form-input" placeholder="Sharma" value={f.lastName} onChange={e => s("lastName", e.target.value)} /></div></div>
      <div className="form-row"><div className="form-group"><label className="form-label">Date of Birth</label><input className="form-input" type="date" value={f.dob} onChange={e => s("dob", e.target.value)} /></div><div className="form-group"><label className="form-label">Gender</label><select className="form-select" value={f.gender} onChange={e => s("gender", e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div></div>
      <div className="form-row"><div className="form-group"><label className="form-label">Blood Group</label><select className="form-select" value={f.blood} onChange={e => s("blood", e.target.value)}><option value="">Select</option>{["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(b => <option key={b}>{b}</option>)}</select></div><div className="form-group"><label className="form-label">State</label><select className="form-select" value={f.state} onChange={e => s("state", e.target.value)}><option value="">Select</option>{["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"].map(st => <option key={st}>{st}</option>)}</select></div></div>
      <div className="form-group"><label className="form-label">City</label><input className="form-input" placeholder="Pune" value={f.city} onChange={e => s("city", e.target.value)} /></div>
      <div className="divider" />
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>🆘 Emergency Contact</div>
      <div className="form-row"><div className="form-group"><label className="form-label">Name</label><input className="form-input" placeholder="Rahul Sharma" value={f.eName} onChange={e => s("eName", e.target.value)} /></div><div className="form-group"><label className="form-label">Relation</label><select className="form-select" value={f.eRel} onChange={e => s("eRel", e.target.value)}><option value="">Select</option><option>Spouse</option><option>Parent</option><option>Sibling</option><option>Friend</option></select></div></div>
      <div className="form-group"><label className="form-label">Emergency Phone</label><input className="form-input" placeholder="+91 98765 00000" value={f.ePhone} onChange={e => s("ePhone", e.target.value)} /></div>
      <button className="btn btn-primary w-full" onClick={() => setStep(3)}>Continue →</button>
      <button className="btn btn-outline w-full" style={{ marginTop: 10 }} onClick={() => setStep(1)}>← Back</button>
    </>)}
    {step === 3 && (<><h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, marginBottom: 4 }}>ABHA Setup</h2><p style={{ color: "var(--ink-faint)", fontSize: 14, marginBottom: 18 }}>Your national health ID linking all records.</p>
      {[{ k: "new", icon: "✨", title: "Create new ABHA ID", desc: "Generate a fresh ABHA linked to your mobile" }, { k: "existing", icon: "🔗", title: "Link existing ABHA", desc: "Enter your ABHA number if you have one" }, { k: "skip", icon: "⏭️", title: "Skip for now", desc: "Link ABHA later from profile" }].map(opt => (
        <div key={opt.k} onClick={() => s("abhaChoice", opt.k)} style={{ padding: "12px 14px", borderRadius: "var(--radius)", border: `1.5px solid ${f.abhaChoice === opt.k ? "var(--teal)" : "var(--border)"}`, background: f.abhaChoice === opt.k ? "var(--teal-lt)" : "var(--card)", cursor: "pointer", display: "flex", gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 18 }}>{opt.icon}</span><div><div style={{ fontWeight: 600, fontSize: 14, color: f.abhaChoice === opt.k ? "var(--teal)" : "var(--ink)" }}>{opt.title}</div><div style={{ fontSize: 12, color: "var(--ink-faint)" }}>{opt.desc}</div></div>
        </div>
      ))}
      <button className="btn btn-primary w-full" style={{ marginTop: 8 }} onClick={() => f.abhaChoice === "skip" ? handleFinish() : setStep(4)} disabled={loading}>{f.abhaChoice === "skip" ? "Finish →" : "Continue to eKYC →"}</button>
      <button className="btn btn-outline w-full" style={{ marginTop: 10 }} onClick={() => setStep(2)}>← Back</button>
    </>)}
    {step === 4 && (<><h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, marginBottom: 4 }}>Aadhaar eKYC</h2><p style={{ color: "var(--ink-faint)", fontSize: 14, marginBottom: 16 }}>Your Aadhaar number is never stored — only a pseudonymous token is retained.</p>
      <div className="alert alert-warn mb-16">⚠️ Demo mode — simulated UIDAI sandbox. No real Aadhaar data used.</div>
      <div className="form-group"><label className="form-label">Aadhaar (last 4 digits for demo)</label><input className="form-input" placeholder="• • • •" maxLength={4} style={{ fontFamily: "var(--font-mono)", fontSize: 20, letterSpacing: 8, textAlign: "center" }} value={f.aadhaarLast4} onChange={e => s("aadhaarLast4", e.target.value.replace(/\D/, ""))} /></div>
      <button className="btn btn-primary w-full" onClick={handleFinish} disabled={loading}>{loading ? "Finalizing..." : "Verify with Aadhaar OTP →"}</button>
      <button className="btn btn-outline w-full" style={{ marginTop: 10 }} onClick={() => setStep(3)}>← Back</button>
    </>)}
    {step === 5 && <div style={{ textAlign: "center", padding: "12px 0" }}><div style={{ fontSize: 56, marginBottom: 14 }}>🎉</div><h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400, marginBottom: 8 }}>Registration Complete!</h2><p style={{ color: "var(--ink-faint)", fontSize: 14, marginBottom: 22 }}>Your Digital Health Card is ready.</p>
      <div className="abha-card" style={{ marginBottom: 20, textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="abha-label">Digital Health Card · ABHA</div>
            <div className="abha-id">91-{Math.floor(1000 + Math.random() * 9000)}-{Math.floor(1000 + Math.random() * 9000)}-{Math.floor(1000 + Math.random() * 9000)}</div>
            <div className="abha-name">{f.firstName || "New"} {f.lastName || "Patient"}</div>
            <div className="abha-dob">{f.dob || "—"} · {f.blood || "—"} · {f.gender || "—"}</div>
          </div>
          <div style={{ flexShrink: 0, background: "white", padding: "6px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            <QRDisplay value={`ABHA:91-${Math.floor(1000 + Math.random() * 9000)}`} hideText />
          </div>
        </div>
      </div>
      <button className="btn btn-primary w-full" onClick={onDone}>Go to My Dashboard →</button>
    </div>}
  </>);
}

function ProviderRegister({ initialRole = "doctor", onDone, onBack }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ type: initialRole === "lab" ? "lab" : "doctor", name: "", phone: "", email: "", password: "", regNumber: "", specialty: "", facility: "", hfrId: "" });
  const s = (k, v) => setF(x => ({ ...x, [k]: v }));

  async function handleFinish() {
    setLoading(true);
    try {
      await doctorApi.updateProfile({
        name: f.name,
        specialty: f.specialty,
        facility: f.facility,
        reg_number: f.regNumber,
        hfr_id: f.hfrId
      });
      onDone();
    } catch (e) {
      alert("Error updating profile: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (<>
    <StepIndicator steps={["Details", "Verify", "Credentials", "Facility", "Review"]} current={step} />
    {step === 0 && (<><h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, marginBottom: 4 }}>Provider Registration</h2><p style={{ color: "var(--ink-faint)", fontSize: 14, marginBottom: 18 }}>Register as a verified healthcare provider.</p>
      <div className="form-group"><label className="form-label">Type</label><div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>{[{ k: "doctor", icon: "🩺", l: "Doctor" }, { k: "lab", icon: "🔬", l: "Lab" }, { k: "pharma", icon: "💊", l: "Pharmacy" }, { k: "clinic", icon: "🏥", l: "Clinic" }].map(t => <div key={t.k} onClick={() => s("type", t.k)} className={`role-btn ${f.type === t.k ? "active" : ""}`}><span className="role-icon">{t.icon}</span>{t.l}</div>)}</div></div>
      <div className="form-group"><label className="form-label">{f.type === "doctor" ? "Full Name (MCI)" : "Organisation Name"}</label><input className="form-input" value={f.name} onChange={e => s("name", e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Work Email</label><input className="form-input" type="email" value={f.email} onChange={e => s("email", e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Mobile</label><input className="form-input" placeholder="98765 43210" maxLength={10} value={f.phone} onChange={e => s("phone", e.target.value.replace(/\D/g, ""))} /></div>
      <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={f.password} onChange={e => s("password", e.target.value)} /></div>
      <button className="btn btn-primary w-full" onClick={async () => {
        if (f.phone.length !== 10) { alert("Please enter a valid 10-digit mobile number."); return; }
        try {
          const res = await authApi.sendOtp(f.phone);
          alert("Demo OTP: " + (res.otp_demo || "123456"));
          setStep(1);
        } catch (e) {
          alert("Error: " + e.message);
        }
      }}>Send OTP →</button>
      <button className="btn btn-outline w-full" style={{ marginTop: 10 }} onClick={onBack}>← Back</button>
    </>)}
    {step === 1 && <OtpStep phone={f.phone} onVerify={async (otp) => {
      try {
        await authApi.verifyOtp(f.phone, otp, f.type, "register");
        setStep(2);
      } catch (e) {
        alert("Verification failed: " + e.message);
      }
    }} onBack={() => setStep(0)} label="Verify Work Mobile" />}
    {step === 2 && (<><h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, marginBottom: 4 }}>Credentials</h2><p style={{ color: "var(--ink-faint)", fontSize: 14, marginBottom: 18 }}>Verified by admin before activation.</p>
      <div className="form-group"><label className="form-label">MCI / NABL Registration No.</label><input className="form-input" placeholder="MH-2019-12345" style={{ fontFamily: "var(--font-mono)" }} value={f.regNumber} onChange={e => s("regNumber", e.target.value)} /></div>
      {f.type === "doctor" && <div className="form-group"><label className="form-label">Specialisation</label><select className="form-select" value={f.specialty} onChange={e => s("specialty", e.target.value)}><option value="">Select</option>{["General Medicine", "Cardiology", "Paediatrics", "Dermatology", "Neurology", "Orthopaedics", "Gynaecology"].map(sp => <option key={sp}>{sp}</option>)}</select></div>}
      <button className="btn btn-primary w-full" onClick={() => setStep(3)}>Continue →</button>
      <button className="btn btn-outline w-full" style={{ marginTop: 10 }} onClick={() => setStep(1)}>← Back</button>
    </>)}
    {step === 3 && (<><h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, marginBottom: 4 }}>Facility</h2>
      <div className="form-group"><label className="form-label">Facility Name</label><input className="form-input" placeholder="City Hospital, Pune" value={f.facility} onChange={e => s("facility", e.target.value)} /></div>
      <div className="form-group"><label className="form-label">HFR ID <span className="text-faint">(optional)</span></label><input className="form-input" placeholder="HFR-MH-00123" style={{ fontFamily: "var(--font-mono)" }} value={f.hfrId} onChange={e => s("hfrId", e.target.value)} /></div>
      <button className="btn btn-primary w-full" onClick={() => setStep(4)}>Review →</button>
      <button className="btn btn-outline w-full" style={{ marginTop: 10 }} onClick={() => setStep(2)}>← Back</button>
    </>)}
    {step === 4 && (<><h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, marginBottom: 14 }}>Review & Submit</h2>
      {[["Name", f.name || "—"], ["Type", f.type], ["Email", f.email || "—"], ["Reg. No.", f.regNumber || "—"], ["Specialty", f.specialty || "—"], ["Facility", f.facility || "—"], ["HFR ID", f.hfrId || "Pending"]].map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border)" }}><span className="text-sm text-faint">{k}</span><span className="text-sm font-600">{v}</span></div>)}
      <div className="alert alert-warn" style={{ marginTop: 14 }}>⏳ Reviewed within 24–48 hrs. SMS confirmation on approval.</div>
      <button className="btn btn-primary w-full" style={{ marginTop: 8 }} onClick={handleFinish} disabled={loading}>{loading ? "Updating..." : "Submit for Verification →"}</button>
      <button className="btn btn-outline w-full" style={{ marginTop: 10 }} onClick={() => setStep(3)}>← Edit</button>
    </>)}
  </>);
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginView({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("patient");
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [showMoreRoles, setShowMoreRoles] = useState(false);
  const LEFT = {
    login: { title: "Smart\nHealth\nRecords", sub: "A unified EHR with ABHA identity and blockchain audit trail.", features: [["🔐", "ABHA Digital Health Card"], ["⛓️", "Blockchain consent audit trail"], ["📋", "FHIR-compatible records"], ["🔏", "Patient-controlled sharing"]] },
    "rp": { title: "Join\nHealthChain", sub: "Create your Digital Health Card in minutes.", features: [["✨", "Instant ABHA ID"], ["🔒", "Private by default"], ["📱", "Mobile-linked"], ["🆓", "Free for patients"]] },
    "rv": { title: "Provider\nAccess\nPortal", sub: "Register as a verified doctor, lab or clinic.", features: [["✅", "MCI / NABL verification"], ["🏥", "HFR facility linking"], ["📊", "Consented patient history"], ["⛓️", "Every access logged"]] },
  };
  const c = LEFT[mode] || LEFT.login;
  const primaryRoles = [{ key: "patient", label: "Patient", icon: "👤" }, { key: "doctor", label: "Doctor", icon: "🩺" }, { key: "admin", label: "Admin", icon: "⚙️" }];
  const moreRoles = [{ key: "lab", label: "Lab", icon: "🔬" }, { key: "pharma", label: "Pharmacy", icon: "💊" }, { key: "clinic", label: "Clinic", icon: "🏥" }];
  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-logo">🏥</div>
        <h1>{c.title}</h1><p>{c.sub}</p>
        <div className="login-features">{c.features.map(([i, t]) => <div className="login-feature" key={t}><span>{i}</span><span>{t}</span></div>)}</div>
      </div>
      <div className="login-right">
        <div className="login-form-box">
          {mode === "login" && (<>
            {step === 1 ? (<>
              <h2>Welcome back</h2><p>Sign in to your health portal</p>
              <div className="mb-16">
                <div className="form-label" style={{ marginBottom: 8 }}>Sign in as</div>
                <div className="role-picker">
                  {primaryRoles.map(r => <div key={r.key} className={`role-btn ${role === r.key ? "active" : ""}`} onClick={() => { setRole(r.key); setShowMoreRoles(false); }}><span className="role-icon">{r.icon}</span>{r.label}</div>)}
                  <div className={`role-btn ${showMoreRoles || moreRoles.some(r => r.key === role) ? "active" : ""}`} onClick={() => setShowMoreRoles(!showMoreRoles)}><span className="role-icon">⋯</span>More</div>
                </div>
                {showMoreRoles && (
                  <div className="role-picker" style={{ marginTop: 8 }}>
                    {moreRoles.map(r => <div key={r.key} className={`role-btn ${role === r.key ? "active" : ""}`} onClick={() => setRole(r.key)}><span className="role-icon">{r.icon}</span>{r.label}</div>)}
                  </div>
                )}
              </div>
              <div className="form-group"><label className="form-label">{role === "patient" ? "Mobile / ABHA ID" : role === "admin" ? "Email" : "Mobile / Email"}</label><input className="form-input" placeholder={role === "admin" ? "admin@abdm.gov.in" : "98765 43210"} maxLength={role === "admin" ? 50 : 10} value={phone} onChange={e => setPhone(role === "admin" ? e.target.value : e.target.value.replace(/\D/g, ""))} /></div>
              {role === "admin" && <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>}
              <button className="btn btn-primary w-full" style={{ marginTop: 8 }} onClick={async () => {
                if (role === "admin") { onLogin(role); return; }
                if (phone.length !== 10) { alert("Please enter a valid 10-digit mobile number."); return; }
                try {
                  const res = await authApi.sendOtp(phone);
                  alert("Demo OTP: " + (res.otp_demo || "123456"));
                  setStep(2);
                } catch (e) {
                  alert("Error sending OTP: " + e.message);
                }
              }}>{role === "admin" ? "Sign In →" : "Send OTP →"}</button>
              {role !== "admin" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}><div style={{ flex: 1, height: 1, background: "var(--border)" }} /><span className="text-xs text-faint">or</span><div style={{ flex: 1, height: 1, background: "var(--border)" }} /></div>
                  <button className="btn btn-outline w-full" onClick={() => setMode(role === "patient" ? "rp" : "rv")}>{role === "patient" ? "Create Patient Account" : "Register as Provider"} →</button>
                </>
              )}
            </>) : (
              <OtpStep phone={phone} label="Verify Your Identity" onVerify={async (otpValue) => {
                try {
                  const res = await authApi.verifyOtp(phone, otpValue, role, "login");
                  onLogin(res.role || role);
                } catch (e) {
                  alert("Error verifying OTP: " + e.message);
                }
              }} onBack={() => setStep(1)} />
            )}
          </>)}
          {mode === "rp" && <PatientRegister onDone={() => onLogin("patient")} onBack={() => { setMode("login"); setStep(1); }} />}
          {mode === "rv" && <ProviderRegister initialRole={role} onDone={() => onLogin(role)} onBack={() => { setMode("login"); setStep(1); }} />}
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState("patient");
  const [activeTab, setActiveTab] = useState("overview");

  function login(r) {
    setRole(r);
    setAuthed(true);
    setActiveTab(r === "patient" ? "overview" : r === "admin" ? "providers" : "patients");
  }

  function logout() {
    setAuthed(false);
    setRole("patient");
    setActiveTab("overview");
  }

  const NAV = {
    patient: [["👤", "Overview", "overview"], ["📋", "Records", "records"], ["📝", "Health Log", "log"], ["🤖", "AI Insights", "ai"], ["📈", "Charts", "charts"], ["🤝", "Consents", "consents"], ["⏰", "Reminders", "reminders"], ["📤", "Upload", "upload"], ["📱", "My QR", "qr"]],
    doctor: [["🏠", "Patients", "patients"], ["📝", "Register", "register"], ["➕", "Add Record", "add"], ["📸", "Scan QR", "qrscan"], ["🤖", "AI Tools", "aitools"]],
    lab: [["🏠", "Patients", "patients"], ["📝", "Register", "register"], ["➕", "Add Record", "add"], ["📸", "Scan QR", "qrscan"]],
    pharma: [["🏠", "Patients", "patients"], ["📝", "Register", "register"], ["➕", "Add Record", "add"], ["📸", "Scan QR", "qrscan"]],
    clinic: [["🏠", "Patients", "patients"], ["📝", "Register", "register"], ["➕", "Add Record", "add"], ["📸", "Scan QR", "qrscan"], ["🤖", "AI Tools", "aitools"]],
    admin: [["⚙️", "Providers", "providers"], ["👥", "Patients", "patients"], ["⛓️", "Audit Log", "audit"], ["📊", "Analytics", "analytics"]],
  };

  return (
    <>
      {/* ✅ CSS applied directly */}
      <style>{CSS}</style>

      {!authed ? <LoginView onLogin={login} /> : (
        <div className="app-shell">

          <aside className="sidebar">
            <div className="sidebar-brand">
              <div className="logo-mark">🏥</div>
              <h1>HealthChain</h1>
              <p>ABDM · EHR System</p>
            </div>

            <nav className="sidebar-nav">
              <div className="nav-label">
                {role === "patient" ? "Patient" : role === "admin" ? "Administration" : "Provider"}
              </div>

              {(NAV[role] || NAV.patient).map(([icon, label, tabKey]) => (
                <button
                  key={label}
                  className={`nav-item ${activeTab === tabKey ? "active" : ""}`}
                  onClick={() => setActiveTab(tabKey)}
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
            {role === "patient" && <PatientDashboard tab={activeTab} setTab={setActiveTab} />}
            {['doctor', 'lab', 'pharma', 'clinic'].includes(role) && <DoctorDashboard tab={activeTab} setTab={setActiveTab} role={role} />}
            {role === "admin" && <AdminDashboard tab={activeTab} setTab={setActiveTab} />}
          </main>
        </div>
      )}
    </>
  );
}
