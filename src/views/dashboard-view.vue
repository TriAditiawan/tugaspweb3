<template>
  <div>
    <ba-navbar />
    <div class="card p-4 m-5">
      <h1 class="display-5">Selamat Datang di SITTA</h1>
      <h3 class="lead">Aplikasi Pemesanan Bahan Ajar Universitas Terbuka</h3>
      <h3 class="lead">Tugas Praktek — Pemrograman Website 3</h3>
      <div class="mt-3">
        <router-link class="btn btn-primary me-2" to="/stok"><i class="bi bi-box-seam"></i> Informasi Bahan Ajar</router-link>
        <router-link class="btn btn-outline-primary" to="/tracking"><i class="bi bi-truck"></i> Lacak Pengiriman</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import BaNavbar from '../components/ba-navbar.vue'
export default { name: 'dashboard-view', components: { 'ba-navbar': BaNavbar } }
</script>
