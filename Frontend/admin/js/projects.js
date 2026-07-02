document.addEventListener('DOMContentLoaded', () => {
    initializeProjects();
});

const tableBody = document.getElementById('projectTable');

const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');

const form = document.getElementById('projectForm');

const btnTambah = document.getElementById('btnTambahProject');
const btnBatal = document.getElementById('btnBatal');
const btnClose = document.getElementById('closeModal');

const projectId = document.getElementById('projectId');

const judul = document.getElementById('judul');
const deskripsi = document.getElementById('deskripsi');
const gambar = document.getElementById('gambar');
const gambarUrl = document.getElementById('gambar_url');
const previewImage = document.getElementById('previewImage');
const linkProject = document.getElementById('link_project');

function initializeProjects() {

    loadProjects();

    btnTambah.addEventListener('click', openTambahModal);

    btnBatal.addEventListener('click', closeModal);

    btnClose.addEventListener('click', closeModal);

    form.addEventListener('submit', saveProject);

    gambar.addEventListener('change', previewSelectedImage);

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

}

/* =====================================
   LOAD DATA
===================================== */

async function loadProjects() {

    tableBody.innerHTML =
        `<tr><td colspan="5" class="text-center">Memuat data...</td></tr>`;

    try {

        const response = await apiFetch('/projects');

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
            `<tr><td colspan="5" class="text-center">Belum ada project.</td></tr>`;

        return;

    }

    tableBody.innerHTML = '';

    data.forEach(item => {

        tableBody.innerHTML += `

        <tr>

            <td>${item.id}</td>

            <td>

                ${
                    item.gambar_url
                    ? `<img src="${item.gambar_url}" class="project-thumbnail">`
                    : '-'
                }

            </td>

            <td>${escapeHtml(item.judul)}</td>

            <td>

                ${
                    item.link_project
                    ? `<a href="${item.link_project}" target="_blank">Lihat</a>`
                    : '-'
                }

            </td>

            <td>

                <button
                    class="btn btn-warning"
                    onclick="editProject(${item.id})">

                    <i class="fas fa-pen"></i>

                </button>

                <button
                    class="btn btn-danger"
                    onclick="deleteProject(${item.id})">

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

    modalTitle.textContent = 'Tambah Proyek';

    form.reset();

    projectId.value = '';

    gambarUrl.value = '';

    previewImage.src = '';

    previewImage.style.display = 'none';

    modal.classList.add('show');

}

function closeModal() {

    modal.classList.remove('show');

}

/* =====================================
   PREVIEW IMAGE
===================================== */

function previewSelectedImage() {

    if (!gambar.files.length) return;

    const file = gambar.files[0];

    const reader = new FileReader();

    reader.onload = function (e) {

        previewImage.src = e.target.result;

        previewImage.style.display = 'block';

    };

    reader.readAsDataURL(file);

}

/* =====================================
   EDIT DATA
===================================== */

async function editProject(id) {

    try {

        const response = await apiFetch(`/projects/${id}`);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        const data = result.data;

        projectId.value = data.id;

        judul.value = data.judul;

        deskripsi.value = data.deskripsi;

        gambarUrl.value = data.gambar_url || '';

        linkProject.value = data.link_project || '';

        if (data.gambar_url) {

            previewImage.src = data.gambar_url;

            previewImage.style.display = 'block';

        } else {

            previewImage.style.display = 'none';

        }

        modalTitle.textContent = 'Edit Proyek';

        modal.classList.add('show');

    } catch (err) {

        console.error(err);

        alert(err.message);

    }

}
/* =====================================
   SAVE PROJECT
===================================== */

async function saveProject(e) {

    e.preventDefault();

    try {

        let imageUrl = gambarUrl.value;

        // Upload gambar baru jika dipilih
        if (gambar.files.length > 0) {

            imageUrl = await uploadImage();

            if (!imageUrl) {
                return;
            }

        }

        const payload = {

            judul: judul.value.trim(),

            deskripsi: deskripsi.value.trim(),

            gambar_url: imageUrl,

            link_project: linkProject.value.trim()

        };

        let response;

        if (projectId.value === '') {

            response = await apiFetch('/projects', {

                method: 'POST',

                body: JSON.stringify(payload)

            });

        } else {

            response = await apiFetch(`/projects/${projectId.value}`, {

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

        loadProjects();

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

/* =====================================
   UPLOAD CLOUDINARY
===================================== */

async function uploadImage() {

    const file = gambar.files[0];

    if (!file) {

        return gambarUrl.value;

    }

    const formData = new FormData();

    formData.append('file', file);

    try {

        const response = await apiFetch('/upload/image', {

            method: 'POST',

            body: formData

        });

        const result = await response.json();

        if (!response.ok) {

            throw new Error(result.error);

        }

        gambarUrl.value = result.url;

        return result.url;

    }

    catch (err) {

        alert('Upload gambar gagal.');

        console.error(err);

        return null;

    }

}

/* =====================================
   DELETE PROJECT
===================================== */

async function deleteProject(id) {

    const confirmDelete =
        confirm('Yakin ingin menghapus project ini?');

    if (!confirmDelete) {

        return;

    }

    try {

        const response = await apiFetch(`/projects/${id}`, {

            method: 'DELETE'

        });

        const result = await response.json();

        if (!response.ok) {

            throw new Error(result.error);

        }

        alert(result.message);

        loadProjects();

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

/* =====================================
   HELPER
===================================== */

function escapeHtml(text) {

    if (text === null || text === undefined) {

        return '';

    }

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