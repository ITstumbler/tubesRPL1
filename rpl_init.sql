CREATE DATABASE IF NOT EXISTS smpru;
USE smpru;

CREATE USER 'smpru_staff'@'localhost' IDENTIFIED BY 'smpru_password647';
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'smpru_staff'@'localhost' WITH GRANT OPTION;

DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
	`id_menu` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `nama_menu` varchar(64) NOT NULL,
    `harga` int NOT NULL,
    `status_ketersediaan` varchar(20)
);

DROP TABLE IF EXISTS `pelayan`;
CREATE TABLE `pelayan` (
	`id_pelayan` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `nama_pelayan` varchar(64) NOT NULL,
    `tanggal_diterima` date NOT NULL,
    `status` varchar(11)
);

DROP TABLE IF EXISTS `koki`;
CREATE TABLE `koki` (
	`id_koki` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `nama_koki` varchar(64) NOT NULL,
    `tanggal_diterima` date NOT NULL,
    `status` varchar(11)
);

DROP TABLE IF EXISTS `kasir`;
CREATE TABLE `kasir` (
	`id_kasir` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `nama_kasir` varchar(64) NOT NULL,
    `tanggal_diterima` date NOT NULL,
    `status` varchar(11)
);

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
	`id_user` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `id_pelayan` int UNIQUE REFERENCES pelayan(id_pelayan),
    `id_koki` int UNIQUE REFERENCES koki(id_koki),
    `id_kasir` int UNIQUE REFERENCES kasir(id_kasir),
    `email` varchar(64) UNIQUE NOT NULL,
    `password` varchar(32) NOT NULL,
    `status` varchar(13)
);

DROP TABLE IF EXISTS `pesanan`;
CREATE TABLE `pesanan` (
	`id_pesanan` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `id_pelayan` int REFERENCES pelayan(id_pelayan),
    `id_koki` int REFERENCES koki(id_koki),
    `id_kasir` int REFERENCES kasir(id_kasir),
    `nomor_meja` int NOT NULL,
    `tanggal_dipesan` date NOT NULL,
    `nama_pelanggan` varchar(64),
    `status_pembayaran` varchar(18)
);

DROP TABLE IF EXISTS `item_pesanan`;
CREATE TABLE `item_pesanan` (
    `id_pesanan` int NOT NULL REFERENCES pesanan(id_pesanan),
    `id_menu` int NOT NULL REFERENCES menu(id_menu),
    `jumlah` int NOT NULL,
    `subtotal` int NOT NULL,
    `siap_disajikan` varchar(24)
);

INSERT INTO `user` (email, password, status)
VALUES ("admin@smpru.com", "0192023a7bbd73250516f069df18b500", "ADMINISTRATOR");

INSERT INTO `menu` (nama_menu, harga, status_ketersediaan)
VALUES ("Nasi Goreng", 15000, "Tersedia");

INSERT INTO `menu` (nama_menu, harga, status_ketersediaan)
VALUES ("Nasi Kuning", 14000, "Tersedia");

INSERT INTO `menu` (nama_menu, harga, status_ketersediaan)
VALUES ("Nasi Uduk", 14000, "Tersedia");

INSERT INTO `menu` (nama_menu, harga, status_ketersediaan)
VALUES ("Nasi Liwet", 16000, "Tersedia");

INSERT INTO `menu` (nama_menu, harga, status_ketersediaan)
VALUES ("Jus Jeruk", 8000, "Tersedia");

INSERT INTO `pelayan` (nama_pelayan, tanggal_diterima, status)
VALUES ("Budi Layanbudi", "2024-3-1", "Aktif");

INSERT INTO `koki` (nama_koki, tanggal_diterima, status)
VALUES ("Budi Kokibudi", "2024-3-2", "Aktif");

INSERT INTO `kasir` (nama_kasir, tanggal_diterima, status)
VALUES ("Super Kasirbudi", "2024-3-3", "Aktif");

-- Query-query menguji

-- SELECT * FROM `menu`;
-- SELECT * FROM `menu` ORDER BY status_ketersediaan DESC LIMIT 200;
-- UPDATE menu SET status_ketersediaan = "HABIS" WHERE id_menu = 3;
-- SELECT * FROM `user`;
-- SELECT user.id_user, user.id_pelayan, user.id_koki, user.id_kasir, user.email, user.password, user.status, pelayan.nama_pelayan, koki.nama_koki, kasir.nama_kasir FROM `user` LEFT JOIN pelayan ON user.id_pelayan = pelayan.id_pelayan LEFT JOIN koki ON user.id_koki = koki.id_koki LEFT JOIN kasir ON user.id_kasir = kasir.id_kasir;
-- SELECT * FROM `pelayan`;
-- SELECT * FROM `koki`;
-- SELECT * FROM `kasir`;
-- SELECT * FROM `pelanggan`;
-- SELECT * FROM `pesanan`;
-- SELECT * FROM `item_pesanan`;

-- SELECT item_pesanan.id_pesanan, item_pesanan.id_menu, pesanan.nomor_meja, menu.nama_menu, item_pesanan.jumlah, item_pesanan.siap_disajikan FROM item_pesanan
-- INNER JOIN pesanan
-- ON pesanan.id_pesanan = item_pesanan.id_pesanan
-- INNER JOIN menu
-- ON menu.id_menu = item_pesanan.id_menu
-- ORDER BY siap_disajikan ASC LIMIT 200;

-- SELECT item_pesanan.id_pesanan, item_pesanan.id_menu, pesanan.nomor_meja, menu.nama_menu, item_pesanan.jumlah, item_pesanan.siap_disajikan FROM item_pesanan INNER JOIN pesanan ON pesanan.id_pesanan = item_pesanan.id_pesanan INNER JOIN menu ON menu.id_menu = item_pesanan.id_menu WHERE item_pesanan.siap_disajikan != "Siap Disajikan" ORDER BY siap_disajikan DESC LIMIT 200;

-- SELECT item_pesanan.id_pesanan, item_pesanan.id_menu, pesanan.nomor_meja, menu.nama_menu, menu.harga, item_pesanan.jumlah,
-- menu.harga * jumlah AS subtotal
-- FROM item_pesanan
-- INNER JOIN pesanan ON pesanan.id_pesanan = item_pesanan.id_pesanan
-- INNER JOIN menu ON menu.id_menu = item_pesanan.id_menu
-- WHERE item_pesanan.id_pesanan = 3;

-- SELECT item_pesanan.id_pesanan, pesanan.nomor_meja, pesanan.tanggal_dipesan, pesanan.status_pembayaran, pesanan.nama_pelanggan, SUM(menu.harga * item_pesanan.jumlah) AS total_harga FROM item_pesanan INNER JOIN menu ON menu.id_menu = item_pesanan.id_menu INNER Join pesanan ON item_pesanan.id_pesanan = pesanan.id_pesanan WHERE tanggal_dipesan < "2024-08-07" AND tanggal_dipesan > "2024-08-05" AND status_pembayaran = 'Sudah Dibayar' GROUP BY id_pesanan;


-- SELECT pesanan.tanggal_dipesan, pesanan.nomor_meja, pesanan.nama_pelanggan, pesanan.status_pembayaran, SUM(item_pesanan.jumlah * menu.harga) AS total_harga
-- FROM pesanan
-- INNER JOIN item_pesanan
-- ON item_pesanan.id_pesanan = pesanan.id_pesanan
-- INNER JOIN menu
-- ON item_pesanan.id_menu = menu.id_menu
-- WHERE pesanan.id_pesanan = 3;


-- UPDATE item_pesanan SET siap_disajikan = "Siap Disajikan" WHERE id_pesanan = 1 AND id_menu = 5;

-- SELECT id_koki AS id_karyawan, nama_koki AS nama_karyawan FROM koki ORDER BY nama_koki ASC LIMIT 200;
-- SELECT id_user AS id_karyawan, status AS nama_karyawan FROM user WHERE status = "ADMINISTRATOR" LIMIT 10;

-- SELECT password, id_pelayan, id_koki, id_kasir, status FROM user WHERE email = 'kokibudi@smpru.com';

-- SELECT item_pesanan.id_pesanan, pesanan.nomor_meja, pesanan.tanggal_dipesan, pesanan.status_pembayaran, SUM(menu.harga * item_pesanan.jumlah) AS total_harga FROM item_pesanan
-- INNER JOIN menu
-- ON menu.id_menu = item_pesanan.id_menu
-- INNER Join pesanan
-- ON item_pesanan.id_pesanan = pesanan.id_pesanan
-- GROUP BY id_pesanan;

-- User-user tes

-- INSERT INTO `user` (email, password, status, id_koki)
-- VALUES ("kokibudsi@smpru.com", "482c811da5d5b4bc6d497ffa98491e38", "Aktif", 1);