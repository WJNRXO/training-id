const API_URL = 'https://script.google.com/macros/s/AKfycbyw6XChl7hHQEDGIBC0BwoN7OQLX7FVDMJsS1Nej0CLon_kyad-jVx5qFuApp3wkrDI/exec';

const params = new URLSearchParams(window.location.search);
const employeeId = params.get('id');

async function loadData() {
  if (!employeeId) { showError(); return; }
  try {
    const res = await fetch(API_URL + '?id=' + employeeId, { method: 'GET', redirect: 'follow' });
    const data = await res.json();
    if (data.error) { showError(); return; }
    renderProfile(data);
  } catch (err) {
    console.log('Error:', err);
    showError();
  }
}

function renderProfile(data) {
  const k = data.karyawan;
  const inisial = k.nama.split(' ').slice(0,2).map(function(n){ return n[0]; }).join('');
  document.getElementById('avatar').textContent = inisial;
  document.getElementById('nama').textContent = k.nama;
  document.getElementById('divisi-jabatan').textContent = k.divisi + ' · ' + k.jabatan;
  document.getElementById('employee-id').textContent = k.employee_id;

  const selesai = data.trainings.filter(function(t){ return t.status === 'Selesai'; });
  const belum = data.trainings.filter(function(t){ return t.status === 'Belum'; });

  document.getElementById('count-selesai').textContent = selesai.length;
  document.getElementById('count-belum').textContent = belum.length;

  renderList('list-selesai', selesai, true);
  renderList('list-belum', belum, false);

  document.getElementById('loading').style.display = 'none';
  document.getElementById('profile-card').style.display = 'block';
}

function renderList(containerId, items, isDone) {
  var container = document.getElementById(containerId);
  if (items.length === 0) {
    container.innerHTML = '<p style="font-size:13px;color:#bbb;padding:8px 0">Tidak ada data</p>';
    return;
  }
  var html = '';
  for (var i = 0; i < items.length; i++) {
    var t = items[i];
    var cls = isDone ? 'done' : 'pending';
    var label = isDone ? 'Selesai' : 'Belum';
    html += '<div class="training-item">';
    html += '<div class="dot ' + cls + '"></div>';
    html += '<div class="training-name">' + t.nama_training + '</div>';
    html += '<div class="training-date">' + t.tanggal + '</div>';
    html += '<span class="pill ' + cls + '">' + label + '</span>';
    html += '</div>';
  }
  container.innerHTML = html;
}

function showError() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('error').style.display = 'block';
}

loadData();
