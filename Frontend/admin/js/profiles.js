document.addEventListener('DOMContentLoaded', () => {
    initializeProfile();
});

const form = document.getElementById('profileForm');
const uploadButton = document.getElementById('btnUpload');
const photoInput = document.getElementById('photoInput');
const previewImage = document.getElementById('previewImage');
const fotoUrlInput = document.getElementById('foto_url');

/**
 * Load data profile
 */
async function initializeProfile() {
    await loadProfile();

    uploadButton.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', uploadImage);

    form.addEventListener('submit', saveProfile);
}

/**
 * GET /api/profiles
 */
async function loadProfile() {

    try {

        const response = await apiFetch('/profiles');

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        if (!result.data) return;

        fillForm(result.data);

    } catch (err) {

        console.error(err);

        alert('Gagal mengambil data profil.');

    }

}


/**
 * Mengisi form
 */
function fillForm(profile) {

    document.getElementById('nama_lengkap').value = profile.nama_lengkap || '';
    document.getElementById('nama_panggilan').value = profile.nama_panggilan || '';
    document.getElementById('tempat_lahir').value = profile.tempat_lahir || '';
    document.getElementById('tanggal_lahir').value = profile.tanggal_lahir || '';
    document.getElementById('email').value = profile.email || '';
    document.getElementById('telepon').value = profile.telepon || '';
    document.getElementById('universitas').value = profile.universitas || '';
    document.getElementById('fakultas').value = profile.fakultas || '';
    document.getElementById('prodi').value = profile.prodi || '';
    document.getElementById('semester').value = profile.semester || '';
    document.getElementById('alamat').value = profile.alamat || '';

    if (profile.foto_url) {

        fotoUrlInput.value = profile.foto_url;
        previewImage.src = profile.foto_url;

    }

}


/**
 * Upload ke Cloudinary
 */
async function uploadImage(event) {

    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append('image', file);

    uploadButton.disabled = true;
    uploadButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Upload...';

    try {

        const response = await apiFetch('/upload/image', {

            method: 'POST',
            body: formData

        });

        const result = await response.json();

        if (!response.ok) {

            throw new Error(result.error);

        }

        fotoUrlInput.value = result.url;

        previewImage.src = result.url;

        alert('Upload berhasil.');

    }

    catch (err) {

        console.error(err);

        alert('Upload gagal.');

    }

    finally {

        uploadButton.disabled = false;

        uploadButton.innerHTML =
            '<i class="fas fa-upload"></i> Upload Foto';

    }

}


/**
 * PUT /api/profiles
 */
async function saveProfile(event) {

    event.preventDefault();

    const payload = {

        nama_lengkap: document.getElementById('nama_lengkap').value,
        nama_panggilan: document.getElementById('nama_panggilan').value,
        tempat_lahir: document.getElementById('tempat_lahir').value,
        tanggal_lahir: document.getElementById('tanggal_lahir').value,
        email: document.getElementById('email').value,
        telepon: document.getElementById('telepon').value,
        universitas: document.getElementById('universitas').value,
        fakultas: document.getElementById('fakultas').value,
        prodi: document.getElementById('prodi').value,
        semester: document.getElementById('semester').value,
        alamat: document.getElementById('alamat').value,
        foto_url: fotoUrlInput.value

    };

    try {

        const response = await apiFetch('/profiles', {

            method: 'PUT',

            body: JSON.stringify(payload)

        });

        const result = await response.json();

        if (!response.ok) {

            throw new Error(result.error);

        }

        alert(result.message);

        await loadProfile();

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}