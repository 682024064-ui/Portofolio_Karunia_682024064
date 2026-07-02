document.addEventListener('DOMContentLoaded', () => {
    initializeExperience();
});

const tableBody = document.getElementById('experienceTable');

const modal = document.getElementById('experienceModal');
const modalTitle = document.getElementById('modalTitle');

const form = document.getElementById('experienceForm');

const btnTambah = document.getElementById('btnTambahExperience');
const btnBatal = document.getElementById('btnBatal');
const btnClose = document.getElementById('closeModal');

const experienceId = document.getElementById('experienceId');
const posisi = document.getElementById('posisi');
const perusahaan = document.getElementById('perusahaan');
const durasi = document.getElementById('durasi');
const deskripsi = document.getElementById('deskripsi');

function initializeExperience() {

    loadExperiences();

    btnTambah.addEventListener('click', openTambahModal);

    btnBatal.addEventListener('click', closeModal);

    btnClose.addEventListener('click', closeModal);

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    form.addEventListener('submit', saveExperience);

}

/* =====================================
   LOAD DATA
===================================== */

async function loadExperiences() {

    tableBody.innerHTML =
        `<tr><td colspan="5" class="text-center">Memuat data...</td></tr>`;

    try {

        const response = await apiFetch('/experiences');

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        renderTable(result.data);

    } catch (err) {

        console.error(err);

        tableBody.innerHTML =
            `<tr><td colspan="5" class="text-center">Gagal memuat data.</td></tr>`;

    }

}

/* =====================================
   RENDER TABLE
===================================== */

function renderTable(data) {

    if (!data.length) {

        tableBody.innerHTML =
            `<tr><td colspan="5" class="text-center">Belum ada data.</td></tr>`;

        return;

    }

    tableBody.innerHTML = '';

    data.forEach(item => {

        tableBody.innerHTML += `

        <tr>

            <td>${item.id}</td>

            <td>${escapeHtml(item.posisi)}</td>

            <td>${escapeHtml(item.perusahaan)}</td>

            <td>${escapeHtml(item.durasi)}</td>

            <td>

                <button
                    class="btn btn-warning"
                    onclick="editExperience(${item.id})">

                    <i class="fas fa-pen"></i>

                </button>

                <button
                    class="btn btn-danger"
                    onclick="deleteExperience(${item.id})">

                    <i class="fas fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

/* =====================================
   MODAL
===================================== */

function openTambahModal() {

    modalTitle.textContent = 'Tambah Pengalaman';

    form.reset();

    experienceId.value = '';

    modal.classList.add('show');

}

function closeModal() {

    modal.classList.remove('show');

}

/* =====================================
   EDIT
===================================== */

async function editExperience(id) {

    try {

        const response = await apiFetch(`/experiences/${id}`);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        const data = result.data;

        experienceId.value = data.id;
        posisi.value = data.posisi;
        perusahaan.value = data.perusahaan;
        durasi.value = data.durasi;
        deskripsi.value = data.deskripsi;

        modalTitle.textContent = 'Edit Pengalaman';

        modal.classList.add('show');

    } catch (err) {

        console.error(err);

        alert(err.message);

    }

}

/* =====================================
   SAVE
===================================== */

async function saveExperience(e) {

    e.preventDefault();

    const payload = {

        posisi: posisi.value,

        perusahaan: perusahaan.value,

        durasi: durasi.value,

        deskripsi: deskripsi.value

    };

    try {

        let response;

        if (experienceId.value === '') {

            response = await apiFetch('/experiences', {

                method: 'POST',

                body: JSON.stringify(payload)

            });

        } else {

            response = await apiFetch(`/experiences/${experienceId.value}`, {

                method: 'PUT',

                body: JSON.stringify(payload)

            });

        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        alert(result.message);

        closeModal();

        loadExperiences();

    } catch (err) {

        console.error(err);

        alert(err.message);

    }

}

/* =====================================
   DELETE
===================================== */

async function deleteExperience(id) {

    if (!confirm('Yakin ingin menghapus pengalaman ini?')) {
        return;
    }

    try {

        const response = await apiFetch(`/experiences/${id}`, {

            method: 'DELETE'

        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        alert(result.message);

        loadExperiences();

    } catch (err) {

        console.error(err);

        alert(err.message);

    }

}

/* =====================================
   HELPER
===================================== */

function escapeHtml(text) {

    if (text === null || text === undefined) return '';

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return String(text).replace(/[&<>"']/g, function (m) {
        return map[m];
    });

}