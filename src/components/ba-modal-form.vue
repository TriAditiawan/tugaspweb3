<template>
  <div class="modal fade" tabindex="-1" ref="el">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="save">
          <div class="modal-header">
            <h5 class="modal-title">{{ mode === 'add' ? 'Tambah Bahan Ajar' : 'Edit Bahan Ajar' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-2">
              <label class="form-label">Kode</label>
              <input v-model="form.kode" class="form-control" :readonly="mode==='edit'" required />
            </div>
            <div class="mb-2">
              <label class="form-label">Judul</label>
              <input v-model="form.judul" class="form-control" required />
            </div>
            <div class="mb-2 row">
              <div class="col"><label class="form-label">Kategori</label>
                <select class="form-select" v-model="form.kategori">
                  <option v-for="k in kategoriList" :key="k" :value="k">{{ k }}</option>
                </select>
              </div>
              <div class="col"><label class="form-label">UPBJJ</label>
                <select class="form-select" v-model="form.upbjj">
                  <option v-for="u in upbjjList" :key="u" :value="u">{{ u }}</option>
                </select>
              </div>
            </div>
            <div class="mb-2 row">
              <div class="col"><label class="form-label">Harga</label><input v-model.number="form.harga" type="number" class="form-control" /></div>
              <div class="col"><label class="form-label">Qty</label><input v-model.number="form.qty" type="number" class="form-control" /></div>
              <div class="col"><label class="form-label">Safety</label><input v-model.number="form.safety" type="number" class="form-control" /></div>
            </div>
            <div class="mb-2">
              <label class="form-label">Lokasi Rak</label>
              <input v-model="form.lokasiRak" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Catatan (HTML allowed)</label>
              <textarea v-model="form.catatanHTML" class="form-control"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'

export default {
  name: 'ba-modal-form',
  props: {
    mode: { type: String, default: 'add' },
    initial: { type: Object, default: null },
    kategoriList: Array,
    upbjjList: Array
  },
  data(){ return { form: this.initial ? { ...this.initial } : { kode:'', judul:'', kategori:this.kategoriList?.[0]||'', upbjj:this.upbjjList?.[0]||'', lokasiRak:'', harga:0, qty:0, safety:0, catatanHTML:'' } } },
  mounted(){
    this.bs = new bootstrap.Modal(this.$refs.el)
  },
  methods:{
    show(){ this.bs.show() },
    hide(){ this.bs.hide() },
    save(){
      this.$emit('save', { ...this.form })
    }
  },
  watch:{
    initial(v){ this.form = v ? { ...v } : { kode:'', judul:'', kategori:this.kategoriList?.[0]||'', upbjj:this.upbjjList?.[0]||'', lokasiRak:'', harga:0, qty:0, safety:0, catatanHTML:'' } }
  }
}
</script>
