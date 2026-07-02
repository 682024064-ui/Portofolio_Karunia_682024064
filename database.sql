CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_username_uk UNIQUE (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nama_lengkap VARCHAR(100),
    nama_panggilan VARCHAR(50),
    tempat_lahir VARCHAR(50),
    tanggal_lahir DATE,
    email VARCHAR(100),
    telepon VARCHAR(20),
    universitas VARCHAR(100),
    fakultas VARCHAR(100),
    prodi VARCHAR(100),
    semester VARCHAR(20),
    alamat VARCHAR(4000),
    foto_url VARCHAR(255),
    CONSTRAINT profiles_users_fk FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nama_skill VARCHAR(50),
    icon_class VARCHAR(50),
    CONSTRAINT skills_users_fk FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    posisi VARCHAR(100),
    perusahaan VARCHAR(100),
    durasi VARCHAR(50),
    deskripsi VARCHAR(4000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT experiences_users_fk FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    judul VARCHAR(100),
    deskripsi VARCHAR(4000),
    gambar_url VARCHAR(255),
    link_project VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT projects_users_fk FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================
-- DUMMY USER
-- Username : admin
-- Password : admin123
-- =====================================

INSERT INTO users (username, password_hash, role)
VALUES (
    'admin',
    'scrypt:32768:8:1$BGpzw3B3Mz97sBsR$f6a1cb9e5cf3d1a1701e590547dee7f52afd131892bcf8635508284df434e6d9217c1c18e0c2388bb57bec875cd5c66666fe585a9c29f289f1b1c676f63d3fda',
    'admin'
);

-- =====================================
-- DUMMY PROFILE
-- =====================================

INSERT INTO profiles (
    user_id,
    nama_lengkap,
    nama_panggilan,
    tempat_lahir,
    tanggal_lahir,
    email,
    telepon,
    universitas,
    fakultas,
    prodi,
    semester,
    alamat,
    foto_url
)
VALUES (
    1,
    'Nama Lengkap',
    'Nama',
    'Kota',
    '2000-01-01',
    'email@example.com',
    '08xxxxxxxxxx',
    'Nama Universitas',
    'Nama Fakultas',
    'Nama Program Studi',
    'Semester',
    'Alamat Lengkap',
    'https://example.com/foto.jpg'
);

-- =====================================
-- DUMMY SKILLS
-- =====================================

INSERT INTO skills (user_id, nama_skill, icon_class)
VALUES
(1, 'Skill 1', 'fa-solid fa-code'),
(1, 'Skill 2', 'fa-solid fa-database'),
(1, 'Skill 3', 'fa-solid fa-laptop'),
(1, 'Skill 4', 'fa-solid fa-gear');

-- =====================================
-- DUMMY EXPERIENCES
-- =====================================

INSERT INTO experiences (
    user_id,
    posisi,
    perusahaan,
    durasi,
    deskripsi
)
VALUES
(
    1,
    'Nama Posisi',
    'Nama Instansi',
    'Periode',
    'Deskripsi pengalaman atau kegiatan.'
),
(
    1,
    'Nama Posisi',
    'Nama Organisasi',
    'Periode',
    'Deskripsi pengalaman atau kegiatan.'
);

-- =====================================
-- DUMMY PROJECTS
-- =====================================

INSERT INTO projects (
    user_id,
    judul,
    deskripsi,
    gambar_url,
    link_project
)
VALUES
(
    1,
    'Judul Project',
    'Deskripsi singkat project.',
    'https://example.com/gambar-project.jpg',
    'https://github.com/username/project'
),
(
    1,
    'Judul Project',
    'Deskripsi singkat project.',
    'https://example.com/gambar-project.jpg',
    'https://github.com/username/project'
);