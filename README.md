# Jiyyad Bypass

Struktur:

- `index.html`  halaman website
- `api/bypass.js`  proxy server yang memegang API key

## Deploy di Vercel

1. Upload folder ini ke GitHub (atau jalankan `vercel` dari folder ini).
2. Di Vercel: Project Settings, Environment Variables, tambahkan
   `JEREXD_APIKEY` dengan isi API key kamu.
3. Deploy ulang. Selesai.

API key hanya ada di environment variable, tidak ada di `index.html`
maupun di kode yang dikirim ke browser.

Jangan pernah menulis API key langsung ke file di folder ini.
