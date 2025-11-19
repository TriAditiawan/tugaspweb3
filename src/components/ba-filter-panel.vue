<template>
  <div class="card mb-4 p-3">
    <h5>Filter & Sort</h5>
    <div class="row gy-2">
      <div class="col-md-3">
        <label class="form-label">UT-Daerah (UPBJJ)</label>
        <select class="form-select" v-model="filters.upbjj" @change="emitChange">
          <option value="">— semua —</option>
          <option v-for="u in upbjjList" :key="u" :value="u">{{ u }}</option>
        </select>
      </div>

      <div class="col-md-3">
        <label class="form-label">Kategori</label>
        <select class="form-select" v-model="filters.kategori" :disabled="!filters.upbjj" @change="emitChange">
          <option value="">— semua —</option>
          <option v-for="k in kategoriList" :key="k" :value="k">{{ k }}</option>
        </select>
        <div class="small-muted mt-1">Pilih UT-Daerah dulu</div>
      </div>

      <div class="col-md-3 d-flex align-items-center">
        <div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" v-model="filters.onlyBelowSafety" id="belowSafety" @change="emitChange">
            <label class="form-check-label" for="belowSafety">Qty &lt; Safety</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" v-model="filters.onlyZero" id="qtyZero" @change="emitChange">
            <label class="form-check-label" for="qtyZero">Qty = 0</label>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <label class="form-label">Urutkan</label>
        <select class="form-select mb-2" v-model="sort.by" @change="emitChange">
          <option value="judul">Judul</option>
          <option value="qty">Stock</option>
          <option value="harga">Harga</option>
        </select>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="desc" v-model="sort.desc" @change="emitChange">
          <label class="form-check-label" for="desc">Desc</label>
        </div>
      </div>
    </div>

    <div class="mt-3">
      <button class="btn btn-secondary me-2" @click="reset">Reset Filter</button>
      <button class="btn btn-primary" @click="$emit('open-add')">Tambah Bahan Ajar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ba-filter-panel',
  props: {
    upbjjList: Array,
    kategoriList: Array,
    modelFilters: Object,
    modelSort: Object
  },
  data(){ 
    return {
      filters: { ...this.modelFilters },
      sort: { ...this.modelSort }
    }
  },
  methods:{
    emitChange(){ this.$emit('change', { filters: this.filters, sort: this.sort }) },
    reset(){
      this.filters = { upbjj:'', kategori:'', onlyBelowSafety:false, onlyZero:false }
      this.sort = { by:'judul', desc:false }
      this.emitChange()
    }
  },
  watch:{
    modelFilters(v){ this.filters = { ...v } },
    modelSort(v){ this.sort = { ...v } }
  }
}
</script>
