document.addEventListener('DOMContentLoaded', () => {
    // Kalau token masih ada (sudah login sebelumnya), langsung lempar ke dashboard
    if (getToken()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const form = document.getElementById('loginForm');
    form.addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
    e.preventDefault();

    const errorBox = document.getElementById('loginError');
    const btn = document.getElementById('loginBtn');
    const originalText = btn.textContent;

    errorBox.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Memproses...';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        const response = await apiFetch('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Login gagal');
        }

        setToken(result.token);
        setUsername(result.user.username);

        window.location.href = 'dashboard.html';

    } catch (err) {
        errorBox.textContent = err.message;
        errorBox.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}
