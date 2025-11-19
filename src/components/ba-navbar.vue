<template>
  <nav class="navbar navbar-expand-lg navbar-dark shadow-sm">
    <div class="container">

      <!-- BRAND + LOGO -->
      <a class="navbar-brand d-flex align-items-center" href="#">
        <img 
          src="/images/logout.png" 
          alt="UT Logo" 
          class="me-2"
          style="height: 32px; width: auto;"
        />
        <span class="fw-bold">SITTA</span>
      </a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><router-link class="nav-link" to="/">Dashboard</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/stok">Informasi Bahan Ajar</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/tracking">Lacak Bahan Ajar</router-link></li>
        </ul>
      </div>

    </div>
  </nav>
</template>
