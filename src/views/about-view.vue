<template>
  <div class="container my-5">
    <h1>About / AV</h1>
    <p>Halaman AV (About View) — tempat deskripsi aplikasi SITTA, versi, dan kontak.</p>

    <div class="card p-3 mt-3">
      <h5>SITTA — Aplikasi Pemesanan Bahan Ajar</h5>
      <p>Demo untuk tugas praktikum. Theme purple & design Bootstrap + Vue.</p>
      <ul>
        <li>Versi: 1.0</li>
        <li>Pengembang: Nama Kamu</li>
        <li>Catatan: Tidak ada login, hanya demo</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'about-view'
}
</script>

<style scoped>
h1 { color: #f8f5ff; }
.card { background: rgba(255,255,255,0.03); border-radius: 10px; }
</style>
