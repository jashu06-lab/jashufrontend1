// ===== APP.JS =====

const API_BASE_URL = (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL)
  ? window.APP_CONFIG.API_BASE_URL
  : 'http://localhost:5000/api';

const CAR_EMOJIS = {
  Sedan: 'SED', SUV: 'SUV', Hatchback: 'HB', Luxury: 'LUX', Electric: 'EV', MUV: 'MUV'
};

let cars = [];
let rentals = [];

// ---- NAV ----
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const pageTitle = document.getElementById('pageTitle');
const dateLabel = document.getElementById('dateLabel');

const TITLES = {
  dashboard: 'Dashboard',
  fleet: 'Fleet',
  rentals: 'Rentals',
  available: 'Available Cars',
  cardetails: 'Car Details',
};

dateLabel.textContent = new Date().toLocaleDateString('en-IN', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

navItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    const sec = item.dataset.section;
    pageTitle.textContent = TITLES[sec];
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById('section-' + sec).classList.add('active');
    renderSection(sec);
  });
});

function renderSection(sec) {
  if (sec === 'dashboard') renderDashboard();
  if (sec === 'fleet') renderFleet();
  if (sec === 'rentals') renderRentals();
  if (sec === 'available') renderAvailable();
  if (sec === 'cardetails') renderDetails();
}

// ---- API ----
async function api(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const body = await response.json();
      message = body.error || message;
    } catch (_err) {
      // ignore json parsing errors
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function loadData() {
  const [carsData, rentalsData] = await Promise.all([
    api('/cars'),
    api('/rentals?today=true')
  ]);
  cars = carsData;
  rentals = rentalsData;
}

function today() {
  return new Date().toISOString().split('T')[0];
}

// ---- STATS ----
function getStats() {
  const total = cars.length;
  const rented = cars.filter(c => c.status === 'rented').length;
  const available = cars.filter(c => c.status === 'available').length;
  const todayRentals = rentals.filter(r => r.from === today() && r.status === 'rented');
  const revenue = todayRentals.reduce((s, r) => s + r.amount, 0);
  return { total, rented, available, revenue };
}

function updateStatCards() {
  const { total, rented, available, revenue } = getStats();
  document.getElementById('totalCars').textContent = total;
  document.getElementById('rentedToday').textContent = rented;
  document.getElementById('availableCars').textContent = available;
  document.getElementById('todayRevenue').textContent = 'INR ' + revenue.toLocaleString('en-IN');
}

// ---- DASHBOARD ----
function renderDashboard() {
  updateStatCards();

  const container = document.getElementById('dashRentalList');
  const todayRentals = rentals.filter(r => r.from === today());
  if (todayRentals.length === 0) {
    container.innerHTML = emptyState('No rentals today yet');
  } else {
    container.innerHTML = todayRentals.map(r => {
      const car = cars.find(c => c.id === r.carId);
      const initials = r.renter.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      return `<div class="rental-item">
        <div class="ri-avatar">${initials}</div>
        <div class="ri-info">
          <div class="ri-name">${r.renter}</div>
          <div class="ri-car">${car ? car.name : ''} | ${r.from} to ${r.to}</div>
        </div>
        <div class="ri-amount">INR ${r.amount.toLocaleString('en-IN')}</div>
      </div>`;
    }).join('');
  }

  drawDonut();
}

function drawDonut() {
  const canvas = document.getElementById('fleetChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const { total, rented, available } = getStats();
  const maintenance = cars.filter(c => c.status === 'maintenance').length;

  const data = [
    { label: 'Available', count: available, color: '#22c55e' },
    { label: 'Rented', count: rented, color: '#ff6b35' },
    { label: 'Maintenance', count: maintenance, color: '#f59e0b' },
  ].filter(d => d.count > 0);

  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const R = 78;
  const r = 48;
  ctx.clearRect(0, 0, W, H);

  if (total > 0) {
    let angle = -Math.PI / 2;
    data.forEach(d => {
      const slice = (d.count / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, angle, angle + slice);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      angle += slice;
    });
  }

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.fillStyle = '#111418';
  ctx.fill();

  ctx.fillStyle = '#f0f2f5';
  ctx.font = 'bold 28px Bebas Neue';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(total, cx, cy - 6);
  ctx.font = '11px DM Sans';
  ctx.fillStyle = '#666d7a';
  ctx.fillText('CARS', cx, cy + 14);

  const legend = document.getElementById('donutLegend');
  legend.innerHTML = data.map(d => `
    <div class="legend-item">
      <span class="legend-dot" style="background:${d.color}"></span>
      <span class="legend-label">${d.label}</span>
      <span class="legend-count">${d.count}</span>
    </div>
  `).join('');
}

// ---- FLEET ----
function renderFleet(search = '', filter = 'all') {
  const grid = document.getElementById('fleetGrid');
  let list = cars;
  if (filter !== 'all') list = list.filter(c => c.status === filter);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.brand.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q)
    );
  }
  grid.innerHTML = list.length === 0
    ? emptyState('No cars found')
    : list.map(carCard).join('');
  attachRentButtons();
}

function carCard(c) {
  const emoji = CAR_EMOJIS[c.type] || 'CAR';
  const statusBadge = `<span class="badge badge-${c.status}">${c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span>`;
  const canRent = c.status === 'available';
  return `<div class="car-card">
    <div class="car-emoji">${emoji}</div>
    <div>
      <div class="car-name">${c.name}</div>
      <div class="car-brand">${c.brand} | ${c.year}</div>
    </div>
    <div class="car-badges">
      ${statusBadge}
      <span class="badge badge-type">${c.type}</span>
      <span class="badge badge-fuel">${c.fuel}</span>
    </div>
    <div class="car-rate">INR ${c.rate.toLocaleString('en-IN')} / day</div>
    <div class="car-meta"><span>Seats ${c.seats}</span><span>Color ${c.color}</span></div>
    <button class="btn-rent" data-id="${c.id}" ${canRent ? '' : 'disabled'}>
      ${canRent ? 'Rent Now' : c.status === 'rented' ? 'On Rent' : 'In Maintenance'}
    </button>
  </div>`;
}

function attachRentButtons() {
  document.querySelectorAll('.btn-rent:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => openRentModal(parseInt(btn.dataset.id, 10)));
  });
}

document.getElementById('fleetSearch').addEventListener('input', function () {
  renderFleet(this.value, document.getElementById('fleetFilter').value);
});
document.getElementById('fleetFilter').addEventListener('change', function () {
  renderFleet(document.getElementById('fleetSearch').value, this.value);
});

// ---- RENTALS TABLE ----
function renderRentals() {
  const tbody = document.getElementById('rentalsBody');
  const count = document.getElementById('rentalCount');
  const todayRentals = rentals.filter(r => r.from === today());
  count.textContent = todayRentals.length + ' rental' + (todayRentals.length !== 1 ? 's' : '');

  if (todayRentals.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:30px;color:var(--muted)">No rentals today</td></tr>`;
    return;
  }

  tbody.innerHTML = todayRentals.map((r, i) => {
    const car = cars.find(c => c.id === r.carId);
    const emoji = car ? CAR_EMOJIS[car.type] || 'CAR' : 'CAR';
    return `<tr>
      <td>${i + 1}</td>
      <td>${emoji} ${car ? car.name : '-'}</td>
      <td>${r.renter}</td>
      <td>${r.phone}</td>
      <td>${r.from}</td>
      <td>${r.to}</td>
      <td>INR ${r.amount.toLocaleString('en-IN')}</td>
      <td><span class="status-pill ${r.status === 'rented' ? 'pill-rented' : 'pill-returned'}">${r.status}</span></td>
      <td>${r.status === 'rented' ? `<button class="btn-return" data-rid="${r.id}" data-cid="${r.carId}">Return</button>` : '-'}</td>
    </tr>`;
  }).join('');

  document.querySelectorAll('.btn-return').forEach(btn => {
    btn.addEventListener('click', () => openReturnModal(parseInt(btn.dataset.rid, 10), parseInt(btn.dataset.cid, 10)));
  });
}

// ---- AVAILABLE ----
function renderAvailable() {
  const grid = document.getElementById('availableGrid');
  const avail = cars.filter(c => c.status === 'available');
  grid.innerHTML = avail.length === 0
    ? emptyState('No cars currently available')
    : avail.map(carCard).join('');
  attachRentButtons();
}

// ---- CAR DETAILS ----
function renderDetails(search = '') {
  const list = document.getElementById('detailList');
  let filtered = cars;
  if (search) {
    const q = search.toLowerCase();
    filtered = cars.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.brand.toLowerCase().includes(q) ||
      c.reg.toLowerCase().includes(q)
    );
  }
  if (filtered.length === 0) {
    list.innerHTML = emptyState('No cars found');
    return;
  }
  list.innerHTML = filtered.map(c => {
    const emoji = CAR_EMOJIS[c.type] || 'CAR';
    const statusColor = c.status === 'available' ? 'var(--green)' : c.status === 'rented' ? 'var(--accent2)' : '#f59e0b';
    return `<div class="detail-card">
      <div class="detail-emoji">${emoji}</div>
      <div class="detail-field"><label>Car</label><span>${c.name}</span></div>
      <div class="detail-field"><label>Brand / Year</label><span>${c.brand}, ${c.year}</span></div>
      <div class="detail-field"><label>Reg. No.</label><span>${c.reg}</span></div>
      <div class="detail-field"><label>Rate / Day</label><span style="color:var(--accent)">INR ${c.rate.toLocaleString('en-IN')}</span></div>
      <div class="detail-field"><label>Status</label><span style="color:${statusColor};font-weight:700">${c.status.toUpperCase()}</span></div>
    </div>`;
  }).join('');
}

document.getElementById('detailSearch').addEventListener('input', function () {
  renderDetails(this.value);
});

// ---- ADD CAR MODAL ----
const modalOverlay = document.getElementById('modalOverlay');
document.getElementById('btnAddCar').addEventListener('click', () => modalOverlay.classList.add('open'));
document.getElementById('modalClose').addEventListener('click', () => modalOverlay.classList.remove('open'));
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) modalOverlay.classList.remove('open'); });

document.getElementById('btnSubmitCar').addEventListener('click', async () => {
  const name = document.getElementById('fName').value.trim();
  const brand = document.getElementById('fBrand').value.trim();
  const type = document.getElementById('fType').value;
  const year = parseInt(document.getElementById('fYear').value, 10);
  const reg = document.getElementById('fReg').value.trim();
  const rate = parseInt(document.getElementById('fRate').value, 10);
  const fuel = document.getElementById('fFuel').value;
  const seats = parseInt(document.getElementById('fSeats').value, 10);
  const color = document.getElementById('fColor').value.trim();

  if (!name || !brand || !reg || !rate || !year || !seats || !color) {
    alert('Please fill all fields.');
    return;
  }

  try {
    await api('/cars', {
      method: 'POST',
      body: JSON.stringify({ name, brand, type, year, reg, rate, fuel, seats, color }),
    });

    modalOverlay.classList.remove('open');
    clearForm(['fName', 'fBrand', 'fYear', 'fReg', 'fRate', 'fSeats', 'fColor']);
    await refreshAndRender();
    alert('Car added successfully!');
  } catch (error) {
    alert(`Failed to add car: ${error.message}`);
  }
});

// ---- RENT MODAL ----
const rentOverlay = document.getElementById('rentModalOverlay');
let rentTargetId = null;

function openRentModal(carId) {
  rentTargetId = carId;
  const car = cars.find(c => c.id === carId);
  document.getElementById('rentCarName').textContent = `${CAR_EMOJIS[car.type] || 'CAR'} ${car.name} - INR ${car.rate.toLocaleString('en-IN')}/day`;
  document.getElementById('rFrom').value = today();
  document.getElementById('rTo').value = '';
  rentOverlay.classList.add('open');
}
document.getElementById('rentModalClose').addEventListener('click', () => rentOverlay.classList.remove('open'));
rentOverlay.addEventListener('click', e => { if (e.target === rentOverlay) rentOverlay.classList.remove('open'); });

document.getElementById('btnSubmitRent').addEventListener('click', async () => {
  const renter = document.getElementById('rName').value.trim();
  const phone = document.getElementById('rPhone').value.trim();
  const from = document.getElementById('rFrom').value;
  const to = document.getElementById('rTo').value;

  if (!renter || !phone || !from || !to) {
    alert('Please fill all fields.');
    return;
  }
  if (to < from) {
    alert('Return date must be after pickup date.');
    return;
  }

  try {
    const rental = await api('/rentals', {
      method: 'POST',
      body: JSON.stringify({ carId: rentTargetId, renter, phone, from, to }),
    });

    rentOverlay.classList.remove('open');
    clearForm(['rName', 'rPhone', 'rTo']);
    await refreshAndRender();
    alert(`Rental confirmed!\nTotal: INR ${rental.amount.toLocaleString('en-IN')}`);
  } catch (error) {
    alert(`Failed to rent car: ${error.message}`);
  }
});

// ---- RETURN MODAL ----
const returnOverlay = document.getElementById('returnModalOverlay');
let returnRentId = null;
let returnCarId = null;

function openReturnModal(rentId, carId) {
  returnRentId = rentId;
  returnCarId = carId;
  const car = cars.find(c => c.id === carId);
  const rental = rentals.find(r => r.id === rentId);
  document.getElementById('returnCarInfo').textContent =
    `${CAR_EMOJIS[car.type] || 'CAR'} ${car.name} - Rented by ${rental.renter}`;
  returnOverlay.classList.add('open');
}
document.getElementById('returnModalClose').addEventListener('click', () => returnOverlay.classList.remove('open'));
returnOverlay.addEventListener('click', e => { if (e.target === returnOverlay) returnOverlay.classList.remove('open'); });

document.getElementById('btnConfirmReturn').addEventListener('click', async () => {
  try {
    await api(`/rentals/${returnRentId}/return`, { method: 'PATCH' });
    returnOverlay.classList.remove('open');
    await refreshAndRender();
    alert('Car marked as returned.');
  } catch (error) {
    alert(`Failed to return car: ${error.message}`);
  }
});

// ---- UTILS ----
function emptyState(msg) {
  return `<div class="empty-state"><span class="empty-icon">CAR</span><p>${msg}</p></div>`;
}

function clearForm(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

async function refreshAndRender() {
  await loadData();
  const active = document.querySelector('.nav-item.active');
  if (active) {
    renderSection(active.dataset.section);
  } else {
    renderDashboard();
  }
}

// ---- INIT ----
(async function init() {
  try {
    await loadData();
    renderDashboard();
  } catch (error) {
    alert(`Unable to load backend data.\n${error.message}\n\nSet API URL in js/config.js and make sure backend is running.`);
  }
})();
