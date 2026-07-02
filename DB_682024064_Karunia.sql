INSERT INTO users (username, password_hash, role) VALUES
('admin', 'scrypt:32768:8:1$BGpzw3B3Mz97sBsR$f6a1cb9e5cf3d1a1701e590547dee7f52afd131892bcf8635508284df434e6d9217c1c18e0c2388bb57bec875cd5c66666fe585a9c29f289f1b1c676f63d3fda', 'admin');

INSERT INTO profiles (
    user_id, nama_lengkap, nama_panggilan, tempat_lahir, tanggal_lahir,
    email, telepon, universitas, fakultas, prodi, semester, alamat, foto_url
)
VALUES
(
    1, 'Karunia Sintje Pepah', 'Nia', 'Manado', '2006-05-17',
    '682024064@student.uksw.edu', '0895627003336',
    'Universitas Kristen Satya Wacana', 'Fakultas Teknologi Informasi',
    'Program Studi Sistem Informasi', '4',
    'Jl. Imam Bonjol, Salatiga, Jawa Tengah', 'https://res.cloudinary.com/dagkcz8tl/image/upload/v1782987709/portfolio/projects/tsipllsh3aswtwooshg5.jpg'
);

INSERT INTO skills (user_id, nama_skill, icon_class) VALUES
(1, 'SQL', 'fas fa-code'),
(1, 'Bizagi Modeler', 'fas fa-project-diagram'),
(1, 'Microsoft Office', 'fas fa-file-word');

INSERT INTO experiences (user_id, posisi, perusahaan, durasi, deskripsi) VALUES
(1, 'Mahasiswa Sistem Informasi', 'Universitas Kristen Satya Wacana', '2024 - Sekarang',
 'Mempelajari analisis sistem, basis data, pemrograman web, manajemen proyek TI, serta pengembangan aplikasi sebagai bagian dari proses perkuliahan.'),
(1, 'Pengembangan Project Akademik', 'Perkuliahan', '2024 - Sekarang',
 'Mengembangkan berbagai tugas dan project akademik menggunakan HTML, CSS, JavaScript, Python Flask, PHP, dan MySQL baik secara individu maupun kelompok.'),
(1, 'Belajar Mandiri Web Development', 'Self Learning', '2024 - Sekarang',
 'Mempelajari pengembangan website melalui dokumentasi resmi, video pembelajaran, dan praktik mandiri untuk meningkatkan kemampuan.');

INSERT INTO projects (user_id, judul, deskripsi, gambar_url, link_project) VALUES
(1, 'Sistem Informasi Toko Komputer',
 'Membangun sistem informasi penjualan toko komputer berbasis web sebagai project mata kuliah menggunakan PHP, MySQL, HTML, CSS, dan JavaScript.',
 'https://res.cloudinary.com/dagkcz8tl/image/upload/v1782661857/portfolio/projects/dydy2eqwf3aw926ijohe.jpg', ''),
(1, 'Website Portofolio',
 'Mengembangkan website portofolio pribadi menggunakan Flask, MySQL, Cloudinary, dan Resend API sebagai media menampilkan profil, pengalaman, serta project.',
 'https://res.cloudinary.com/dagkcz8tl/image/upload/v1782662138/portfolio/projects/ghodr1rdcvjpcnt183qs.png', ''),
(1, 'Aplikasi Manajemen Wisata',
 'Mengembangkan prototype aplikasi pencarian destinasi wisata sebagai project perkuliahan KWU dengan fokus pada analisis kebutuhan sistem, perancangan antarmuka, dan pengelolaan data.',
 'https://res.cloudinary.com/dagkcz8tl/image/upload/v1782985618/portfolio/projects/jgqnfurksyqaejm2gpgq.png', '');