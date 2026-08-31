# JastiPhone — website order + payment

## Yang sudah dibuat
- Tampilan mobile-first mengikuti dua screenshot referensi.
- Katalog produk, stok, harga, diskon, rating.
- Form nama, WhatsApp, alamat, email.
- Tombol checkout.
- Backend Node.js + Express.
- Integrasi Midtrans Snap untuk membuat transaksi.
- Struktur endpoint notifikasi Midtrans.

## Agar pembayaran benar-benar aktif
1. Buat/siapkan akun merchant pada payment gateway yang memenuhi syarat.
2. Ambil **Server Key** dan **Client Key** dari dashboard.
3. Salin `.env.example` menjadi `.env`.
4. Isi `MIDTRANS_SERVER_KEY`.
5. Ganti `GANTI_CLIENT_KEY` di `public/index.html` dengan Client Key.
6. Untuk uji coba gunakan `MIDTRANS_IS_PRODUCTION=false`.
7. Setelah semua lolos pengujian, ubah ke production dan gunakan kredensial production.

**Penting:** Server Key hanya boleh berada di backend/.env, jangan pernah ditaruh di JavaScript frontend atau dibagikan.

## Jalankan di komputer
```bash
npm install
npm start
```
Buka `http://localhost:3000`.

## Tentang uang masuk rekening
Website tidak boleh langsung "mengirim" uang ke rekening hanya dari HTML. Payment gateway yang menerima pembayaran, lalu dana dicairkan ke rekening bank yang terdaftar pada akun merchant sesuai aturan gateway. Pada Midtrans, status `settlement` menandakan transaksi berhasil dan dana dapat diproses untuk withdrawal sesuai ketentuan mereka.

## Sebelum dipakai jualan sungguhan
Tambahkan database untuk orders, validasi webhook/signature, pengurangan stok yang aman, halaman admin, HTTPS/domain, rate limiting, dan kebijakan privasi/terms. Jangan menerima atau menyimpan PIN/OTP pelanggan.
