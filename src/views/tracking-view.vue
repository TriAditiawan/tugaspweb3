<template>
  <div>
    <ba-navbar />

    <!-- Form Buat DO (sama seperti sebelumnya) -->
    <div class="card p-4 mb-4">
      <h5>Buat DO Baru</h5>
      <div class="row g-3">
        <div class="col-md-3">
          <label class="form-label">Nomor DO</label>
          <input v-model="form.nomorDO" class="form-control" placeholder="DO2025-00X" />
          <div class="small-muted mt-1">Terbentuk otomatis: DO{{ yearNow }}-xxx (opsional)</div>
        </div>

        <div class="col-md-2">
          <label class="form-label">NIM</label>
          <input v-model="form.nim" class="form-control" placeholder="NIM" />
        </div>

        <div class="col-md-3">
          <label class="form-label">Nama</label>
          <input v-model="form.nama" class="form-control" placeholder="Nama" />
        </div>

        <div class="col-md-2">
          <label class="form-label">Ekspedisi</label>
          <select v-model="form.ekspedisi" class="form-select">
            <option value="">— pilih —</option>
            <option>JNE Regular</option>
            <option>Pos Indonesia</option>
            <option>J&T</option>
            <option>SiCepat</option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label">Tanggal Kirim</label>
          <input type="date" v-model="form.tanggalKirim" class="form-control" />
        </div>

        <div class="col-md-3">
          <label class="form-label">Paket Bahan Ajar</label>
          <input v-model="form.paketNama" class="form-control" placeholder="Kode / Nama Paket" />
        </div>

        <div class="col-md-2">
          <label class="form-label">Total</label>
          <input v-model.number="form.total" class="form-control" placeholder="Nominal" />
        </div>

        <div class="col-12">
          <button class="btn btn-success me-2" @click="createDO">Buat DO</button>
          <button class="btn btn-outline-secondary" @click="resetForm">Reset</button>
        </div>
      </div>
    </div>

    <!-- Pencarian -->
    <div class="card p-3 mb-3">
      <div class="row g-2 align-items-center">
        <div class="col-md-8">
          <input v-model="q" @keyup.enter="search" class="form-control" placeholder="Masukkan Nomor DO atau NIM, tekan Enter untuk cari" />
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-primary me-2" @click="search">Cari</button>
          <button class="btn btn-outline-primary" @click="clearSearch">Reset</button>
        </div>
      </div>
    </div>

    <!-- Search result / detail -->
    <div v-if="searchError" class="alert alert-warning">{{ searchError }}</div>

    <div v-if="selectedDetail" class="card p-3 mb-3">
      <h6>Detail DO — {{ selectedDetail.nomorDO ?? '-' }} &mdash; {{ selectedDetail.nama ?? '-' }}</h6>
      <div class="row">
        <div class="col-md-3"><strong>NIM</strong><div>{{ selectedDetail.nim ?? '-' }}</div></div>
        <div class="col-md-3"><strong>Status</strong><div><span class="badge" :class="statusClass(selectedDetail)">{{ selectedDetail.status ?? '-' }}</span></div></div>
        <div class="col-md-3"><strong>Ekspedisi</strong><div>{{ selectedDetail.ekspedisi ?? '-' }}</div></div>
        <div class="col-md-3"><strong>Tanggal</strong><div>{{ selectedDetail.tanggalKirim ?? '-' }}</div></div>
      </div>

      <hr />
      <h6>Perjalanan</h6>
      <ul class="list-group">
        <li v-for="(p,i) in (selectedDetail.perjalanan || [])" :key="i" class="list-group-item bg-transparent text-light">
          <div class="small-muted">{{ p.waktu ?? '-' }}</div>
          <div>{{ p.keterangan ?? '-' }}</div>
        </li>
      </ul>
    </div>

    <!-- hint when nothing selected -->
    <div v-if="!selectedDetail && !searchError" class="mb-3">
      <div class="card p-3">
        <p class="small-muted">Tidak ada hasil. Coba masukkan NIM atau Nomor DO yang valid, atau pilih dari daftar DO terbaru di bawah.</p>
      </div>
    </div>

    <!-- Daftar Tracking DO (tabel) with single v-for and inline detail row -->
    <div class="card p-3 mb-4">
      <h5>Daftar Tracking DO</h5>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>Nomor DO</th>
              <th>NIM</th>
              <th>Nama</th>
              <th>Status</th>
              <th>Ekspedisi</th>
              <th>Tanggal Kirim</th>
              <th>Paket</th>
              <th>Total</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <!-- IMPORTANT: key must be on the template tag (fixed) -->
            <template v-for="(item, idx) in pagedList" :key="item?.nomorDO ?? idx">
              <tr>
                <td>{{ item?.nomorDO ?? '-' }}</td>
                <td>{{ item?.nim ?? '-' }}</td>
                <td>{{ item?.nama ?? '-' }}</td>
                <td><span class="badge" :class="statusClass(item)">{{ item?.status ?? '-' }}</span></td>
                <td>{{ item?.ekspedisi ?? '-' }}</td>
                <td>{{ item?.tanggalKirim ?? '-' }}</td>
                <td>{{ item?.paketNama ?? item?.paketKode ?? '-' }}</td>
                <td>{{ formatCurrency(item?.total) }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-1" @click="showDetail(item)">Lihat</button>
                  <button class="btn btn-sm btn-outline-secondary" @click="toggleRow(item?.nomorDO)">{{ isRowOpen(item?.nomorDO) ? 'Sembunyikan' : 'Rincian' }}</button>
                </td>
              </tr>

              <!-- inline expandable detail -->
              <tr v-if="isRowOpen(item?.nomorDO)">
                <td colspan="9" class="bg-transparent">
                  <div class="card card-body bg-dark border-0">
                    <h6 class="mb-2">{{ item?.nomorDO ?? '-' }} — {{ item?.nama ?? '-' }}</h6>
                    <ul class="list-unstyled mb-0">
                      <li v-for="(p, idx2) in (item?.perjalanan || [])" :key="idx2" class="mb-2">
                        <div class="small-muted">{{ p?.waktu ?? '-' }}</div>
                        <div>{{ p?.keterangan ?? '-' }}</div>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- pagination -->
      <nav aria-label="DO pagination" class="mt-3">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goPage(currentPage-1)" :disabled="currentPage===1">Prev</button>
          </li>
          <li class="page-item" v-for="p in pageNumbers" :key="p" :class="{ active: p === currentPage }">
            <button class="page-link" @click="goPage(p)">{{ p }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="goPage(currentPage+1)" :disabled="currentPage===totalPages">Next</button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Collapsible: all details -->
    <div class="card p-3 mb-5">
      <a class="d-block mb-2" data-bs-toggle="collapse" href="#allDetails" role="button" aria-expanded="false" aria-controls="allDetails">
        ▾ Lihat Rincian Perjalanan (semua DO)
      </a>
      <div class="collapse" id="allDetails">
        <div class="row">
          <div class="col-12" v-for="d in sortedAll" :key="d?.nomorDO ?? d?.nim ?? d?.nama">
            <div class="card mb-3 bg-dark border-0">
              <div class="card-body">
                <h6 class="mb-1">{{ d?.nomorDO ?? '-' }} — {{ d?.nama ?? '-' }}</h6>
                <div class="small-muted mb-2">{{ d?.ekspedisi ?? '-' }} • {{ d?.tanggalKirim ?? '-' }} • {{ formatCurrency(d?.total) }}</div>
                <ul class="list-unstyled">
                  <li v-for="(p, idx) in (d?.perjalanan || [])" :key="idx" class="mb-2">
                    <div class="small-muted">{{ p?.waktu ?? '-' }}</div>
                    <div>{{ p?.keterangan ?? '-' }}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useDataStore } from '../stores/data-store'
import BaNavbar from '../components/ba-navbar.vue'

export default {
  name: 'tracking-view',
  components: { 'ba-navbar': BaNavbar },
  setup(){
    const store = useDataStore()

    const yearNow = new Date().getFullYear().toString().slice(0,4)
    const q = ref('')
    const searchError = ref(null)
    const selectedDetail = ref(null)

    // pagination
    const currentPage = ref(1)
    const itemsPerPage = 5

    const sortedAll = computed(() => {
      const arr = Array.isArray(store.tracking) ? store.tracking.slice() : []
      return arr.sort((a,b) => {
        const da = new Date(a?.tanggalKirim || 0).getTime()
        const db = new Date(b?.tanggalKirim || 0).getTime()
        return db - da
      })
    })

    const totalPages = computed(() => Math.max(1, Math.ceil(sortedAll.value.length / itemsPerPage)))
    const pageNumbers = computed(() => {
      const arr = []
      for (let i = 1; i <= totalPages.value; i++) arr.push(i)
      return arr
    })
    const pagedList = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const list = sortedAll.value.slice(start, start + itemsPerPage)
      return list.filter(i => i && typeof i === 'object')
    })

    // UI state for expanded rows
    const openRows = ref({})

    function goPage(p){ if (p < 1 || p > totalPages.value) return; currentPage.value = p; clearSelection() }
    function isRowOpen(nomor){ return !!openRows.value[nomor] }
    function toggleRow(nomor){ if (!nomor) return; openRows.value[nomor] = !openRows.value[nomor] }

    function formatCurrency(v){
      if (v == null) return '-'
      if (typeof v === 'string') return v
      return 'Rp ' + Number(v).toLocaleString('id-ID')
    }

    function statusClass(item){
      if (!item || !item.status) return 'badge-aman'
      const s = String(item.status).toLowerCase()
      if (s.includes('kosong') || s.includes('gagal')) return 'badge-kosong'
      if (s.includes('menipis')) return 'badge-menipis'
      if (s.includes('selesai')) return 'badge-aman'
      if (s.includes('dikirim')) return 'badge-menipis'
      return 'badge-aman'
    }

    function showDetail(item){
      selectedDetail.value = item || null
      searchError.value = null
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function clearSelection(){
      selectedDetail.value = null
      searchError.value = null
      q.value = ''
    }

    function search(){
      searchError.value = null
      selectedDetail.value = null
      const key = q.value.trim()
      if (!key) { searchError.value = 'Masukkan NIM atau Nomor DO terlebih dulu'; return }

      // try by nomorDO
      const byNomor = store.tracking && store.tracking.find(d => d && (d.nomorDO === key || d.nomorDO === (key.trim())))
      if (byNomor) { selectedDetail.value = byNomor; return }

      // try by NIM in trackingMap
      const byNIM = store.trackingMap && store.trackingMap[key]
      if (byNIM) { selectedDetail.value = byNIM; return }

      searchError.value = 'Data tidak ditemukan'
    }

    // create / reset form
    const form = ref({
      nomorDO: `DO${yearNow}-` + String(Math.floor(Math.random()*900)+100),
      nim: '',
      nama: '',
      ekspedisi: '',
      tanggalKirim: new Date().toISOString().slice(0,10),
      paketNama: '',
      total: 0,
      status: 'Baru',
      perjalanan: []
    })

    function createDO(){
      if (!form.value.nomorDO || !form.value.nim || !form.value.nama) { alert('Isi Nomor DO, NIM, Nama'); return }
      const newDO = { ...form.value }
      store.addTrackingDO(newDO)
      form.value.nomorDO = `DO${yearNow}-` + String(Math.floor(Math.random()*900)+100)
      alert('DO dibuat: ' + newDO.nomorDO)
      currentPage.value = 1
    }

    function resetForm(){
      form.value = {
        nomorDO: `DO${yearNow}-` + String(Math.floor(Math.random()*900)+100),
        nim: '',
        nama: '',
        ekspedisi: '',
        tanggalKirim: new Date().toISOString().slice(0,10),
        paketNama: '',
        total: 0,
        status: 'Baru',
        perjalanan: []
      }
    }

    return {
      yearNow, q, searchError, selectedDetail,
      sortedAll, pagedList, currentPage, totalPages, pageNumbers, goPage,
      showDetail, search, clearSearch: clearSelection,
      formatCurrency, statusClass, isRowOpen, toggleRow,
      // form
      form, createDO, resetForm
    }
  }
}
</script>

<style scoped>
.small-muted { color: rgba(255,255,255,0.6); }
.badge-aman { background:#198754; color:white; }
.badge-menipis { background:#ff8c1a; color:white; }
.badge-kosong { background:#dc3545; color:white; }
.pagination .page-item.active .page-link {
  background: rgba(109,69,218,0.95);
  border-color: rgba(109,69,218,0.95);
}
</style>
