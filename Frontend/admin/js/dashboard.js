document.addEventListener('DOMContentLoaded', async () => {
    await loadStats();
    await loadRecentActivity();
});

async function loadStats() {
    try {
        const response = await apiFetch('/dashboard/stats');
        const result = await response.json();

        if (!response.ok) throw new Error(result.error);

        document.getElementById('statSkills').textContent = result.data.skills_count;
        document.getElementById('statExperiences').textContent = result.data.experiences_count;
        document.getElementById('statProjects').textContent = result.data.projects_count;

    } catch (err) {
        console.error('Gagal memuat statistik:', err);
    }
}

async function loadRecentActivity() {
    const container = document.getElementById('recentActivity');

    try {
        const response = await apiFetch('/dashboard/recent');
        const result = await response.json();

        if (!response.ok) throw new Error(result.error);

        const activities = result.data;

        if (!activities.length) {
            container.innerHTML = '<p class="empty-state">Belum ada aktivitas.</p>';
            return;
        }

        container.innerHTML = activities.map(a => {
            const isExperience = a.type === 'experience';
            const icon = isExperience ? 'fa-briefcase' : 'fa-diagram-project';
            const title = isExperience ? a.posisi : a.judul;
            const subtitle = isExperience ? a.perusahaan : (a.deskripsi || '').substring(0, 60);

            return `
                <div class="activity-item">
                    <div class="activity-icon"><i class="fas ${icon}"></i></div>
                    <div class="activity-text">
                        <h4>${escapeHtml(title)}</h4>
                        <p>${escapeHtml(subtitle)}</p>
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        container.innerHTML = '<p class="empty-state">Gagal memuat aktivitas.</p>';
    }
}

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}
