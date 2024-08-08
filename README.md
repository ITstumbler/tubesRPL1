# Tubes RPL 1 (Sistem Manajemen Pak Resto UNIKOM)
Situs dapat langsung diakses di:

https://tubes-rpl-1-109-react.onrender.com/

Dapat dijalankan secara lokal dengan cara-cara berikut:
1. Ganti `backendUrl` di file ./src/index.js menjadi `"http://localhost:8082"` (Baris 39)
2. Setel koneksi MySQL di file ./backend/websitenode.js
3. Jalankan file **rpl_init.sql** di client MySQL lokal
4. Setel suatu **.env** dengan properti-properti berikut:

```
MYSQL=jllgshllWEUJHGHYJkjsfjds90
TOKEN_SECRET=jllgshllWEUJHGHYJkjsfjds90
JWT_KEY=secret
```

5. Jalankan perintah `npm install` untuk mengunduh semua package yang diperlukan
6. Jalankan websitenode.js dengan perintah `node websitenode.js` di direktori yang memiliki file tersebut
7. Jalankan react dengan menggunakan `npm start` di _root directory_ projek

# Deskripsi situs
Pengguna akan langsung mengunjungi halaman login saat memulai projek atau mengakses url situs .
Pengguna dapat mengakses halaman pembuatan pesanan untuk pelanggan melalui tombol "BUAT PESANAN" di pojok kanan atas.
Pengguna juga dapat login sebagai admin dengan kredensial berikut ini:

- Login Admin
- Email: admin@smpru.com
- Password: admin123

# Hak admin
Saat pengguna login sebagai admin, ia dapat mengakses empat halaman berbeda:
- Halaman Data Pelayan
- Halaman Data Koki
- Halaman Data Kasir
- Halaman Data User

## Halaman Data Pelayan
Disini admin dapat melihat, menambahkan dan mengedit data pelayan.
Data pelayan terdiri atas nama, tanggal diterima dan status (Aktif/Tidak aktif).

## Halaman Data Koki
Disini admin dapat melihat, menambahkan dan mengedit data koki.
Data koki terdiri atas nama, tanggal diterima dan status (Aktif/Tidak aktif).

## Halaman Data Kasir
Disini admin dapat melihat, menambahkan dan mengedit data pelayan.
Data kasir terdiri atas nama, tanggal diterima dan status (Aktif/Tidak aktif).

## Halaman Data User
Disini admin dapat melihat, menambahkan dan mengedit data user.
Data user terdiri atas id karyawan yang terasosiasi dengan user tersebut, email, password dan status (Aktif/Tidak aktif).
Setiap email hanya dapat dipakai sekali. Pengguna akan mendapatkan error jika ia mencoba untuk menggunakan email yang sama dua kali.
Karena password tidak disimpan sebagai _plaintext_ di database, pengguna admin harus memasukkan ulang password jika ia ingin mengganti data user.
Setiap user harus terasosiasi dengan seorang karyawan, kecuali jika user memiliki peran admin.
Setelah sebuah user dibuat, pengguna dapat langsung login sebagai user tersebut.

# Hak Pelayan
Saat pengguna login sebagai pelayan, ia dapat mengakses dua halaman berbeda:
- Halaman Pemesanan (Pelayan)
- Halaman Kesiapan Pesanan (Pelayan)

## Halaman Pemesanan (Pelayan)
Disini pengguna dapat membuat suatu pesanan atas pelanggan lain yang memilih untuk memesan melalui pelayan.

## Halaman Kesiapan Pesanan (Pelayan)
Disini pengguna dapat melihat kesiapan setiap item pesanan untuk disajikan.
Halaman ini update secara _real time_, pengguna akan langsung mendapatkan informasi baru jika ada suatu item pesanan siap disajikan
Pengguna juga dapat menandakan bahwa suatu item pesanan telah disajikan, tapi hanya jika item pesanan tersebut saat ini memiliki status "Siap Disajikan".

# Hak Koki
Saat pengguna login sebagai koki, ia dapat mengakses dua halaman berbeda:
- Halaman Data Menu
- Halaman Kesiapan Pesanan (Koki)

## Halaman Data Menu
Disini pengguna dapat melihat, menambahkan, menghapus dan mengedit data menu.
Data menu terdiri atas nama, harga dan ketersediaan (Tersedia/HABIS).
Jika suatu menu dihapus, item pesanan yang memiliki menu tersebut tidak akan muncul sama sekali! Hati-hatilah dengan menghapus menu

## Halaman Kesiapan Pesanan (Koki)
Disini pengguna dapat melihat item-item pesanan yang perlu disiapkan untuk penyajian.
Pengguna dapat menandakan bahwa suatu item pesanan siap disajikan, tapi hanya jika item pesanan tersebut saat ini memiliki status "Belum Siap".

# Hak Kasir
Saat pengguna login sebagai kasir, ia dapat mengakses tiga halaman berbeda:
- Halaman Daftar Pesanan
- Halaman Detil Pesanan
- Halaman Buat Laporan

## Halaman Daftar Pesanan
Disini pengguna dapat melihat daftar-daftar pesanan yang telah dibuat dan memilih untuk melihat detil setiap pesanan.

## Halaman Detil Pesanan
Disini pengguna dapat melihat detil pesanan yang dipilih di Halaman Daftar Pesanan, dan menandakan bahwa pesanan tersebut sudah dibayar.
Detil pesanan termasuk: total harga, nomor meja, nama pelanggan, tanggal dipesan, status pembayaran.

## Halaman Buat Laporan
Disini pengguna dapat melihat semua pesanan yang dibuat diantara dua tanggal yang ditentukan pengguna.
Pesanan-pesanan yang akan muncul hanyalah pesanan-pesanan yang sudah dibayar.
Pengguna juga akan mendapatkan jumlah pesanan yang dibuat diantara dua tanggal tersebut dan total pendapatan penjualan pesanan-pesanan tersebut.

# Hak Pelanggan
Pelanggan hanya dapat mengakses satu halaman:
- Halaman Pemesanan (Pelanggan)

## Halaman Pemesanan (Pelanggan)
Di halaman ini pelanggan dapat membuat suatu pesanan dengan menambahkan menu dan menyatakan nomor meja serta nama pelanggan.
Halaman ini juga akan menunjukkan total harga pesanan tersebut.
