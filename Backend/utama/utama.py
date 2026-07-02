import resend
from flask import Blueprint, request, jsonify
from model import Database
from config import Config

utama_bp = Blueprint('utama', __name__)

# Inisialisasi Resend dari Config
resend.api_key = Config.RESEND_API_KEY

# Alamat pengirim default Resend (dipakai karena belum ada domain terverifikasi sendiri)
RESEND_FROM_EMAIL = 'onboarding@resend.dev'


@utama_bp.route('/main-profile', methods=['GET'])
def get_main_profile():
    """Mengambil seluruh data publik (profil, skills, experiences, projects) untuk halaman utama"""
    try:
        db = Database()

        # Ambil profil admin
        query_profile = """
            SELECT p.* FROM profiles p
            JOIN users u ON p.user_id = u.id
            WHERE u.role = 'admin'
            LIMIT 1
        """
        profile_result = db.execute_query(query_profile, fetch=True)

        if not profile_result:
            return jsonify({'success': True, 'data': {}}), 200

        profile = profile_result[0]

        # Ambil skills milik admin
        query_skills = """
            SELECT s.* FROM skills s
            JOIN users u ON s.user_id = u.id
            WHERE u.role = 'admin'
            ORDER BY s.id DESC
        """
        skills = db.execute_query(query_skills, fetch=True)

        # Ambil experiences milik admin
        query_experiences = """
            SELECT e.* FROM experiences e
            JOIN users u ON e.user_id = u.id
            WHERE u.role = 'admin'
            ORDER BY e.created_at DESC
        """
        experiences = db.execute_query(query_experiences, fetch=True)

        # Ambil projects milik admin
        query_projects = """
            SELECT pr.* FROM projects pr
            JOIN users u ON pr.user_id = u.id
            WHERE u.role = 'admin'
            ORDER BY pr.created_at DESC
        """
        projects = db.execute_query(query_projects, fetch=True)

        # Gabungkan semua data jadi satu object profile
        profile['skills'] = skills if skills else []
        profile['experiences'] = experiences if experiences else []
        profile['projects'] = projects if projects else []

        return jsonify({
            'success': True,
            'data': profile
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@utama_bp.route('/contact', methods=['POST'])
def send_contact():
    """Menerima pesan dari form kontak pengunjung, lalu kirim ke email admin via Resend"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body harus JSON'}), 400

        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} wajib diisi'}), 400

        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        db = Database()

        # Email tujuan diambil dari data profil admin (dinamis dari database)
        query = """
            SELECT p.email FROM profiles p
            JOIN users u ON p.user_id = u.id
            WHERE u.role = 'admin'
            LIMIT 1
        """
        result = db.execute_query(query, fetch=True)

        if not result or not result[0].get('email'):
            return jsonify({'error': 'Email admin belum diatur di profil'}), 500

        admin_email = result[0]['email']

        params = {
            "from": RESEND_FROM_EMAIL,
            "to": [admin_email],
            "subject": f"Pesan baru dari {name} (Form Kontak Portofolio)",
            "html": f"""
                <p><strong>Nama:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Pesan:</strong></p>
                <p>{message}</p>
            """
        }

        resend.Emails.send(params)

        return jsonify({
            'success': True,
            'message': 'Pesan berhasil dikirim, terima kasih!'
        }), 200

    except Exception as e:
        return jsonify({'error': f'Gagal mengirim pesan: {str(e)}'}), 500