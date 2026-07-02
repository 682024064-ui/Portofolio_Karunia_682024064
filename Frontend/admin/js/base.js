/**
 * Base layout loader untuk semua halaman Admin.
 * Setiap halaman admin (kecuali login.html) wajib:
 * - punya <div id="layout-placeholder"></div> di awal <body>
 * - set <body data-page="..." data-title="...">
 * - load script ini SETELAH api.js
 */

document.addEventListener('DOMContentLoaded', async () => {
    const isLoginPage = window.location.pathname.endsWith('login.html');

    // Guard: kalau gak ada token dan bukan di halaman login, paksa balik ke login
    if (!getToken() && !isLoginPage) {
        window.location.href = 'login.html';
        return;
    }

    // Halaman login gak pakai sidebar/topbar, jadi base.js gak perlu load layout
    if (isLoginPage) return;

    await loadLayout();
});

async function loadLayout() {
    const placeholder = document.getElementById('layout-placeholder');
    if (!placeholder) return;

    try {
        const res = await fetch('base.html');
        const html = await res.text();
        placeholder.innerHTML = html;

        setupSidebar();
        setupTopbar();
    } catch (err) {
        console.error('Gagal memuat layout admin:', err);
    }
}

function setupSidebar() {
    const currentPage = document.body.dataset.page;

    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        }
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('adminSidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

function setupTopbar() {
    const titleEl = document.getElementById('topbarTitle');
    if (titleEl) {
        titleEl.textContent = document.body.dataset.title || 'Admin';
    }

    const usernameEl = document.getElementById('topbarUsername');
    if (usernameEl) {
        usernameEl.textContent = getUsername();
    }
}

async function handleLogout() {
    try {
        await apiFetch('/logout', { method: 'POST' });
    } catch (err) {
        // Tetap lanjut logout walau request gagal (misal koneksi putus)
    } finally {
        clearToken();
        window.location.href = 'login.html';
    }
}
