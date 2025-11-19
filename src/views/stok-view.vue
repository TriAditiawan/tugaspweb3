<template>
  <div>
    <ba-navbar />

    <div class="container my-4">
      <div class="card p-3 mb-4">
        <h5>Tambah / Upload Bahan Ajar</h5>
        <div class="row g-2 align-items-end">
          <div class="col-md-2">
            <label class="form-label">Kode</label>
            <input v-model="form.kode" class="form-control" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Judul</label>
            <input v-model="form.judul" class="form-control" />
          </div>
          <div class="col-md-2">
            <label class="form-label">Kategori</label>
            <select v-model="form.kategori" class="form-select">
              <option v-for="k in kategoriList" :key="k">{{k}}</option>
            </select>
          </div>
          <div class="col-md-1">
            <label class="form-label">Qty</label>
            <input v-model.number="form.qty" type="number" class="form-control" />
          </div>
          <div class="col-md-1">
            <label class="form-label">Safety</label>
            <input v-model.number="form.safety" type="number" class="form-control" />
          </div>
          <div class="col-md-2">
            <label class="form-label">Harga</label>
            <input v-model.number="form.harga" type="number" class="form-control" />
          </div>

          <!-- upload: pilihan 1 = upload server, pilihan 2 = dataURL local (no server) -->
          <div class="col-md-6">
            <label class="form-label">Pilih Gambar (opsional)</label>
            <input type="file" accept="image/*" @change="onFileChange" class="form-control" />
            <small class="form-text text-muted">Jika punya upload server: file akan disimpan di /images/ . Jika tidak, gambar disimpan sementara sebagai dataURL (local).</small>
          </div>

          <div class="col-md-6 text-end">
            <button class="btn btn-success" @click="addStock">Tambah Stok</button>
            <button class="btn btn-outline-secondary ms-2" @click="resetForm">Reset</button>
          </div>

          <div class="col-12 mt-2" v-if="previewUrl">
            <strong>Preview:</strong>
            <div><img :src="previewUrl" style="max-width:160px; height:110px; object-fit:cover;border-radius:6px" /></div>
          </div>
        </div>
      </div>

      <div class="card p-3">
        <h5>Daftar Stok</h5>
        <div class="table-responsive">
          <table class="table table-striped align-middle">
            <thead>
              <tr>
                <th>Gambar</th><th>Kode</th><th>Judul</th><th>Kategori</th><th>UPBJJ</th><th>Lokasi</th><th>Harga</th><th>Qty</th><th>Safety</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in stok" :key="item.kode">
                <td style="width:110px">
                  <img :src="imageUrl(item)" alt="cover" style="width:100px;height:70px;object-fit:cover;border-radius:6px" />
                </td>
                <td>{{item.kode}}</td>
                <td>{{item.judul}}</td>
                <td>{{item.kategori}}</td>
                <td>{{item.upbjj || '-'}}</td>
                <td>{{item.lokasiRak || '-'}}</td>
                <td>{{formatCurrency(item.harga)}}</td>
                <td>{{item.qty}}</td>
                <td>{{item.safety}}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-1" @click="openEdit(item)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" @click="hapus(item.kode)">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- simple edit modal -->
      <div v-if="editing" class="modal-backdrop" @click.self="closeEdit">
        <div class="card p-3" style="width:720px;max-width:95%">
          <h6>Edit: {{editing.kode}}</h6>
          <div class="row g-2">
            <div class="col-md-6"><input v-model="editing.judul" class="form-control" /></div>
            <div class="col-md-2"><input v-model.number="editing.qty" type="number" class="form-control" /></div>
            <div class="col-md-2"><input v-model.number="editing.harga" type="number" class="form-control" /></div>
            <div class="col-md-2"><input type="file" accept="image/*" @change="onEditFile" class="form-control" /></div>
            <div class="col-12 text-end mt-2">
              <button class="btn btn-primary" @click="saveEdit">Simpan</button>
              <button class="btn btn-outline-secondary ms-2" @click="closeEdit">Batal</button>
            </div>
            <div class="col-12 mt-2" v-if="editing.image">
              <img :src="editingImagePreview" style="max-width:160px;height:110px;object-fit:cover" />
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
import baNavbar from '../components/ba-navbar.vue'

export default {
  components: { baNavbar },
  setup(){
    const store = useDataStore()
    const stok = computed(()=> store.stok)
    const kategoriList = store.kategoriList || []

    // form
    const form = ref({
      kode:'', judul:'', kategori: kategoriList[0] || '', upbjj: store.upbjjList?.[0] || '',
      lokasiRak:'', harga:0, qty:0, safety:0, image:'' // image = filename OR dataURL
    })
    const previewUrl = ref('')
    // temporary file for upload
    let tempFile = null

    // editing
    const editing = ref(null)
    const editingImagePreview = ref('')

    // helper currency
    const formatCurrency = (v)=> v==null? '-' : (typeof v==='string'? v : 'Rp '+Number(v).toLocaleString('id-ID'))

    // FILE HANDLING STRATEGIES:
    // OPTION A (recommended for real): upload file to backend server which saves to /public/images and returns '/images/<file>'
    // OPTION B (simple/no-server): convert file to dataURL and store that in store (persist in localStorage) — works offline but large storage usage.

    // We'll support both: if UPLOAD_SERVER set and reachable, you can change code to use fetch/axios upload.
    const UPLOAD_SERVER = null // set to 'http://localhost:5174' if you run the simple upload server

    function onFileChange(e){
      const f = e.target.files && e.target.files[0]
      if (!f) { previewUrl.value=''; tempFile=null; form.value.image=''; return }
      tempFile = f

      // preview local
      const reader = new FileReader()
      reader.onload = ev => previewUrl.value = ev.target.result
      reader.readAsDataURL(f)
    }

    async function addStock(){
      if (!form.value.kode || !form.value.judul){ alert('Isi kode & judul'); return }
      // if using upload server:
      if (UPLOAD_SERVER && tempFile){
        // upload via fetch
        try {
          const fd = new FormData()
          fd.append('image', tempFile)
          const res = await fetch(`${UPLOAD_SERVER}/upload-image`, { method:'POST', body: fd })
          const data = await res.json()
          if (data.ok && data.url){
            form.value.image = data.url.startsWith('/images/') ? data.url.replace(/^\/images\//,'') : data.url
          } else {
            alert('Upload gagal, menyimpan tanpa gambar')
          }
        } catch(e){
          console.error(e); alert('Upload error, menyimpan tanpa gambar')
        }
      } else if (tempFile){
        // fallback: convert to dataURL and store as image (dataURL)
        const reader = new FileReader()
        reader.onload = () => {
          form.value.image = reader.result // dataURL
          // persist via store
          store.addStock({
            kode: form.value.kode,
            judul: form.value.judul,
            kategori: form.value.kategori,
            upbjj: form.value.upbjj,
            lokasiRak: form.value.lokasiRak,
            harga: form.value.harga,
            qty: form.value.qty,
            safety: form.value.safety,
            image: form.value.image
          })
          resetForm()
        }
        reader.readAsDataURL(tempFile)
        return
      }

      // no file chosen - add with whatever image field (maybe empty)
      const imageToStore = form.value.image || ''
      store.addStock({
        kode: form.value.kode,
        judul: form.value.judul,
        kategori: form.value.kategori,
        upbjj: form.value.upbjj,
        lokasiRak: form.value.lokasiRak,
        harga: form.value.harga,
        qty: form.value.qty,
        safety: form.value.safety,
        image: imageToStore
      })
      resetForm()
    }

    function resetForm(){
      form.value = { kode:'', judul:'', kategori:kategoriList[0]||'', upbjj: store.upbjjList?.[0]||'', lokasiRak:'', harga:0, qty:0, safety:0, image:''}
      previewUrl.value = ''
      tempFile = null
    }

    function imageUrl(item){
      if (!item) return '/images/default.png'
      const img = item.image || item.gambar || ''
      if (!img) return '/images/default.png'
      // if img looks like full dataURL
      if (img.startsWith('data:')) return img
      if (img.startsWith('http') || img.startsWith('/')) return img.startsWith('/images/')? img : (img.startsWith('/')? img : `/images/${img}`)
      return `/images/${img}`
    }

    // edit flow
    function openEdit(item){ editing.value = {...item}; editingImagePreview.value = imageUrl(item) }
    function closeEdit(){ editing.value = null; editingImagePreview.value = '' }
    function onEditFile(e){
      const f = e.target.files && e.target.files[0]; if(!f) return
      const r = new FileReader()
      r.onload = ()=> { editing.value.image = r.result; editingImagePreview.value = r.result }
      r.readAsDataURL(f)
    }
    function saveEdit(){
      if (!editing.value) return
      store.updateStock(editing.value.kode, { ...editing.value })
      closeEdit()
    }

    function hapus(kode){
      if (!confirm('Hapus item '+kode+' ?')) return
      store.deleteStock(kode)
    }

    return { stok, kategoriList, form, previewUrl, onFileChange, addStock, resetForm, imageUrl, formatCurrency, openEdit, closeEdit, onEditFile, saveEdit, editing, editingImagePreview, hapus }
  }
}
</script>

<style scoped>
.container { max-width: 1100px; }
.modal-backdrop { position: fixed; inset:0; background: rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:1050;}
.card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.03); color: #e9e7ff; }
</style>
