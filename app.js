// GANTI dengan URL Apps Script kamu
const API_URL = https://script.google.com/macros/s/AKfycbyw6XChl7hHQEDGIBC0BwoN7OQLX7FVDMJsS1Nej0CLon_kyad-jVx5qFuApp3wkrDI/exec;

// Ambil employee_id dari URL: ?id=EMP-001
const params = new AKfycbyw6XChl7hHQEDGIBC0BwoN7OQLX7FVDMJsS1Nej0CLon_kyad-jVx5qFuApp3wkrDI(window.location.search);
const employeeId = params.get('id');

async function loadData() {
  if (!employeeId) {
    showError();
    return;
  }

  try {
    const res = await fetch(`${API_URL}?id=${employeeId}`);
    const data = await res.json();

    if (data.error) {
      showError();
      return;
    }

    renderProfile(data);
  } catch (err) {
    showError();
  }
}

function renderProfile(data) {
  const { karyawan, trainings } = data;

  // Inisial avatar
  const inisial = karyawan.nama.split(' ').slice(0, 2).map(n => n[0]).join('');
  document.getElementById('avatar').textContent = inisial;
  document.getElementById('nama').textContent = karyawan.nama;
  document.getElementById('divisi-jabatan').textContent = `${karyawan.divisi} · ${karyawan.jabatan}`;
  document.getElementById('employee-id').textContent = karyawan.employee_id;

  const selesai = trainings.filter(t => t.status === 'Selesai');
  const belum = trainings.filter(t => t.status === 'Belum');

  document.getElementById('count-selesai').textContent = selesai.length;
  document.getElementById('count-belum').textContent = belum.length;

  renderList('list-selesai', selesai, true);
  renderList('list-belum', belum, false);

  document.getElementById('loading').style.display = 'none';
  document.getElementById('profile-card').style.display = 'block';
}

function renderList(containerId, items, isDone) {
  const container = document.getElementById(containerId);
  if (items.length === 0) {
    container.innerHTML = '<p style="font-size:13px;color:#bbb;padding:8px 0">Tidak ada data</p>';
    return;
  }

  container.innerHTML = items.map(t => `
    <div class="training-item">
      <div class="dot ${isDone ? 'done' : 'pending'}"></div>
      <div class="training-name">${t.nama_training}</div>
      <div class="training-date">${t.tanggal}</div>
      <span class="pill ${isDone ? 'done' : 'pending'}">${isDone ? 'Selesai' : 'Belum'}</span>
    </div>
  `).join('');
}

function showError() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('error').style.display = 'block';
}

loadData();
