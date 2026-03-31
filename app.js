/* ===== RESET & BASE ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:       #0a0c10;
  --surface:  #111418;
  --surface2: #181c22;
  --border:   #222830;
  --accent:   #e8ff00;
  --accent2:  #ff6b35;
  --text:     #f0f2f5;
  --muted:    #666d7a;
  --green:    #22c55e;
  --red:      #ef4444;
  --blue:     #3b82f6;
  --sidebar-w: 220px;
  --radius:   14px;
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  display: flex;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: var(--sidebar-w);
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 28px 0;
  position: fixed;
  top: 0; left: 0;
  height: 100vh;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 22px 30px;
  border-bottom: 1px solid var(--border);
}
.logo-icon {
  font-size: 1.6rem;
  color: var(--accent);
  line-height: 1;
}
.logo-text {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.55rem;
  letter-spacing: 3px;
  color: var(--text);
}
.logo-text strong { color: var(--accent); }

.nav { display: flex; flex-direction: column; gap: 4px; padding: 20px 12px; flex: 1; }

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 10px;
  color: var(--muted);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 0.2s;
  letter-spacing: 0.3px;
}
.nav-item:hover { color: var(--text); background: var(--surface2); }
.nav-item.active { background: var(--accent); color: #000; font-weight: 700; }
.nav-icon { font-size: 1rem; }

.sidebar-footer {
  padding: 16px 22px 0;
  border-top: 1px solid var(--border);
}
.admin-badge {
  display: flex; align-items: center; gap: 10px;
  color: var(--muted); font-size: 0.85rem;
}
.admin-avatar {
  width: 32px; height: 32px;
  background: var(--accent);
  color: #000;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; font-weight: 800;
}

/* ===== MAIN ===== */
.main {
  margin-left: var(--sidebar-w);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 32px 40px;
}

/* ===== TOPBAR ===== */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 0 24px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 30px;
}
.page-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  letter-spacing: 2px;
  color: var(--text);
}
.date-label {
  font-size: 0.8rem;
  color: var(--muted);
  display: block;
  margin-top: 2px;
}
.btn-add {
  background: var(--accent);
  color: #000;
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: opacity 0.2s, transform 0.15s;
}
.btn-add:hover { opacity: 0.88; transform: translateY(-1px); }

/* ===== SECTIONS ===== */
.section { display: none; }
.section.active { display: block; animation: fadeUp 0.3s ease; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ===== STAT CARDS ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
}
.stat-card:hover { transform: translateY(-2px); border-color: var(--accent); }

.stat-icon { font-size: 2rem; }
.stat-label { font-size: 0.76rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; display: block; }
.stat-value { font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; letter-spacing: 1px; display: block; line-height: 1; margin-top: 2px; }

.stat-total .stat-value  { color: var(--accent); }
.stat-rented .stat-value { color: var(--accent2); }
.stat-available .stat-value { color: var(--green); }
.stat-revenue .stat-value { color: var(--blue); }

.stat-bar {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), transparent);
}
.stat-rented .stat-bar   { background: linear-gradient(90deg, var(--accent2), transparent); }
.stat-available .stat-bar{ background: linear-gradient(90deg, var(--green), transparent); }
.stat-revenue .stat-bar  { background: linear-gradient(90deg, var(--blue), transparent); }

/* ===== DASHBOARD ROW ===== */
.dashboard-row {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
}

.dash-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px;
}

.panel-title {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--muted);
  margin-bottom: 18px;
}

/* ===== RENTAL LIST (dashboard) ===== */
.rental-list { display: flex; flex-direction: column; gap: 10px; }
.rental-item {
  display: flex; align-items: center; gap: 14px;
  background: var(--surface2); border-radius: 10px; padding: 12px 14px;
}
.ri-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--accent); color: #000;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 0.75rem; flex-shrink: 0;
}
.ri-info { flex: 1; }
.ri-name { font-size: 0.88rem; font-weight: 600; }
.ri-car  { font-size: 0.76rem; color: var(--muted); }
.ri-amount { font-size: 0.88rem; font-weight: 700; color: var(--green); }

/* ===== DONUT CHART ===== */
.donut-wrapper { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.donut-legend { display: flex; flex-direction: column; gap: 8px; width: 100%; }
.legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.legend-label { color: var(--muted); flex: 1; }
.legend-count { font-weight: 700; }

/* ===== SEARCH BAR ===== */
.search-bar {
  display: flex; gap: 12px; margin-bottom: 22px;
}
.search-input {
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 16px;
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: var(--accent); }
.filter-select {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  outline: none;
  cursor: pointer;
}

/* ===== CAR CARDS GRID ===== */
.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
}

.car-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  display: flex; flex-direction: column; gap: 12px;
  transition: border-color 0.2s, transform 0.2s;
  position: relative; overflow: hidden;
}
.car-card:hover { transform: translateY(-3px); border-color: var(--accent); }

.car-emoji { font-size: 2.5rem; }
.car-name { font-size: 1rem; font-weight: 700; }
.car-brand { font-size: 0.8rem; color: var(--muted); }

.car-badges { display: flex; gap: 6px; flex-wrap: wrap; }
.badge {
  padding: 3px 10px; border-radius: 20px;
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
}
.badge-available  { background: #16361e; color: var(--green); }
.badge-rented     { background: #3d1a0a; color: var(--accent2); }
.badge-maintenance{ background: #1e1a0a; color: #f59e0b; }
.badge-type       { background: var(--surface2); color: var(--muted); }
.badge-fuel       { background: var(--surface2); color: var(--muted); }

.car-rate { font-size: 0.88rem; color: var(--accent); font-weight: 700; }
.car-meta { display: flex; gap: 10px; font-size: 0.76rem; color: var(--muted); }

.btn-rent {
  background: var(--accent);
  color: #000;
  border: none;
  border-radius: 7px;
  padding: 9px 14px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  transition: opacity 0.2s;
  width: 100%;
}
.btn-rent:hover { opacity: 0.85; }
.btn-rent:disabled {
  background: var(--surface2);
  color: var(--muted);
  cursor: not-allowed;
}

/* ===== RENTALS TABLE ===== */
.rentals-header { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.tag-count {
  background: var(--accent);
  color: #000;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
}

.table-wrapper { overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--border); }
.rentals-table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
.rentals-table th {
  background: var(--surface);
  padding: 13px 16px;
  text-align: left;
  color: var(--muted);
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid var(--border);
}
.rentals-table td {
  padding: 13px 16px;
  background: var(--surface2);
  border-bottom: 1px solid var(--border);
}
.rentals-table tr:last-child td { border-bottom: none; }
.rentals-table tr:hover td { background: #1e232c; }

.status-pill {
  padding: 3px 10px; border-radius: 20px;
  font-size: 0.72rem; font-weight: 700;
}
.pill-rented { background: #3d1a0a; color: var(--accent2); }
.pill-returned { background: #16361e; color: var(--green); }

.btn-return {
  background: var(--surface);
  color: var(--accent2);
  border: 1px solid var(--accent2);
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-return:hover { background: #3d1a0a; }

/* ===== DETAIL LIST ===== */
.detail-list { display: flex; flex-direction: column; gap: 14px; }
.detail-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 24px;
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr 1fr auto;
  align-items: center;
  gap: 16px;
  transition: border-color 0.2s;
}
.detail-card:hover { border-color: var(--accent); }
.detail-emoji { font-size: 2.2rem; }
.detail-field label { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 3px; }
.detail-field span { font-size: 0.9rem; font-weight: 600; }

/* ===== MODAL ===== */
.modal-overlay {
  display: none;
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75);
  z-index: 200;
  align-items: center; justify-content: center;
}
.modal-overlay.open { display: flex; animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 520px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.25s ease;
}
.small-modal { width: 380px; }
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 22px 24px;
  border-bottom: 1px solid var(--border);
}
.modal-header h2 { font-size: 1.1rem; font-weight: 700; }
.modal-close {
  background: none; border: none; color: var(--muted);
  font-size: 1.1rem; cursor: pointer; padding: 4px;
  transition: color 0.2s;
}
.modal-close:hover { color: var(--text); }

.modal-body { padding: 24px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.span2 { grid-column: span 2; }
.form-group label { font-size: 0.76rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; }
.form-group input,
.form-group select {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus,
.form-group select:focus { border-color: var(--accent); }
.form-group select option { background: var(--surface2); }

.btn-submit {
  width: 100%;
  background: var(--accent);
  color: #000;
  border: none;
  border-radius: 9px;
  padding: 13px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: opacity 0.2s, transform 0.15s;
}
.btn-submit:hover { opacity: 0.88; transform: translateY(-1px); }

.rent-car-name {
  font-size: 1rem; font-weight: 700; color: var(--accent);
  margin-bottom: 16px;
  padding: 10px 14px;
  background: var(--surface2); border-radius: 8px;
}
.return-confirm-text { color: var(--muted); font-size: 0.9rem; margin-bottom: 18px; }

/* ===== EMPTY STATE ===== */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 50px 20px; color: var(--muted); gap: 10px;
}
.empty-state .empty-icon { font-size: 2.5rem; }
.empty-state p { font-size: 0.9rem; }

/* ===== SCROLLBAR ===== */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* ===== RESPONSIVE ===== */
@media (max-width: 1100px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .dashboard-row { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  :root { --sidebar-w: 0px; }
  .sidebar { display: none; }
  .main { margin-left: 0; padding: 0 16px 30px; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .detail-card { grid-template-columns: 50px 1fr 1fr; }
}
