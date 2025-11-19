// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/dashboard-view.vue'
import TrackingView from '../views/tracking-view.vue'
import StokView from '../views/stok-view.vue'        // <-- tambah ini
import AboutView from '../views/about-view.vue'     // (opsional)

const routes = [
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/tracking', name: 'tracking', component: TrackingView },
  { path: '/stok', name: 'stok', component: StokView },     // <-- tambahkan route ini
  { path: '/about', name: 'about', component: AboutView }
]

const router = createRouter({
  history: createWebHistory(), // atau createWebHashHistory() kalau pakai hash mode
  routes
})

export default router
