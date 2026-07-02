document.addEventListener('DOMContentLoaded', () => {
    initializeSkills();
});

const tableBody = document.getElementById('skillsTable');

const modal = document.getElementById('skillModal');
const modalTitle = document.getElementById('modalTitle');

const form = document.getElementById('skillForm');

const btnTambah = document.getElementById('btnTambahSkill');
const btnBatal = document.getElementById('btnBatal');
const btnClose = document.getElementById('closeModal');

const skillId = document.getElementById('skillId');
const namaSkill = document.getElementById('nama_skill');
const iconClass = document.getElementById('icon_class');

function initializeSkills() {

    loadSkills();

    btnTambah.addEventListener('click', openTambahModal);

    btnBatal.addEventListener('click', closeModal);

    btnClose.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {

        if (e.target === modal) {

            closeModal();

        }

    });

    form.addEventListener('submit', saveSkill);

}

/* =====================================
   LOAD DATA
===================================== */

async function loadSkills() {

    tableBody.innerHTML =
        `<tr><td colspan="4" class="text-center">Memuat data...</td></tr>`;

    try {

        const response = await apiFetch('/skills');

        const result = await response.json();

        if (!response.ok) {

            throw new Error(result.error);

        }

        renderTable(result.data);

    }

    catch (err) {

        console.error(err);

        tableBody.innerHTML =
            `<tr><td colspan="4" class="text-center">Gagal memuat data.</td></tr>`;

    }

}

/* =====================================
   TABLE
===================================== */

function renderTable(skills) {

    if (!skills.length) {

        tableBody.innerHTML =
            `<tr><td colspan="4" class="text-center">Belum ada data.</td></tr>`;

        return;

    }

    tableBody.innerHTML = '';

    skills.forEach(skill => {

        tableBody.innerHTML += `

            <tr>

                <td>${skill.id}</td>

                <td>${escapeHtml(skill.nama_skill)}</td>

                <td>

                    <i class="${skill.icon_class} skill-icon"></i>

                </td>

                <td>

                    <button
                        class="btn btn-warning"
                        onclick="editSkill(${skill.id})">

                        <i class="fas fa-pen"></i>

                    </button>

                    <button
                        class="btn btn-danger"
                        onclick="deleteSkill(${skill.id})">

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

    modalTitle.textContent = 'Tambah Skill';

    form.reset();

    skillId.value = '';

    modal.classList.add('show');

}

function closeModal() {

    modal.classList.remove('show');

}

/* =====================================
   EDIT
===================================== */

async function editSkill(id) {

    try {

        const response = await apiFetch(`/skills/${id}`);

        const result = await response.json();

        if (!response.ok) {

            throw new Error(result.error);

        }

        const data = result.data;

        skillId.value = data.id;

        namaSkill.value = data.nama_skill;

        iconClass.value = data.icon_class;

        modalTitle.textContent = 'Edit Skill';

        modal.classList.add('show');

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

/* =====================================
   SAVE
===================================== */

async function saveSkill(e) {

    e.preventDefault();

    const payload = {

        nama_skill: namaSkill.value,

        icon_class: iconClass.value

    };

    try {

        let response;

        if (skillId.value === '') {

            response = await apiFetch('/skills', {

                method: 'POST',

                body: JSON.stringify(payload)

            });

        }

        else {

            response = await apiFetch(`/skills/${skillId.value}`, {

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

        loadSkills();

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

/* =====================================
   DELETE
===================================== */

async function deleteSkill(id) {

    const confirmDelete =
        confirm('Yakin ingin menghapus skill ini?');

    if (!confirmDelete) return;

    try {

        const response = await apiFetch(`/skills/${id}`, {

            method: 'DELETE'

        });

        const result = await response.json();

        if (!response.ok) {

            throw new Error(result.error);

        }

        alert(result.message);

        loadSkills();

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

    if (text === null || text === undefined) return '';

    const map = {

        '&': '&amp;',

        '<': '&lt;',

        '>': '&gt;',

        '"': '&quot;',

        "'": '&#039;'

    };

    return String(text).replace(/[&<>"']/g, m => map[m]);

}