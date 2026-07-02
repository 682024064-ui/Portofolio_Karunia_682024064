/**
 * Helper terpusat untuk komunikasi dengan REST API backend (/api/*).
 * Dipakai oleh seluruh halaman Frontend/admin.
 */

const API_BASE_URL = '/api';

function getToken() {
    return localStorage.getItem('admin_token');
}

function setToken(token) {
    localStorage.setItem('admin_token', token);
}

function getUsername() {
    return localStorage.getItem('admin_username') || 'Admin';
}

function setUsername(username) {
    localStorage.setItem('admin_username', username);
}

function clearToken() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
}

/**
 * Wrapper fetch() yang otomatis menambahkan Authorization header
 * dan menangani redirect ke login kalau token kadaluarsa/invalid.
 */
async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    const headers = { ...(options.headers || {}) };

    // Jangan set Content-Type kalau body berupa FormData (upload gambar)
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    // Kalau token invalid/expired, paksa balik ke login (kecuali sedang di halaman login)
    if (response.status === 401 && !window.location.pathname.endsWith('login.html')) {
        clearToken();
        window.location.href = 'login.html';
    }

    return response;
}
