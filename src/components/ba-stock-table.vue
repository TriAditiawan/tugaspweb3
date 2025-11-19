<template>
  <div class="card p-3">
    <h5>Daftar Stok</h5>
    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Kode</th><th>Judul</th><th>Kategori</th><th>UPBJJ</th><th>Lokasi Rak</th><th>Harga</th><th>Qty</th><th>Safety</th><th>Status</th><th>Catatan</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <ba-stock-row
            v-for="it in list"
            :key="it.kode"
            :item="it"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
            @preview-note="$emit('preview-note', $event)"
          />
          <tr v-if="list.length === 0">
            <td colspan="11" class="text-center small-muted">Tidak ada data sesuai filter</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import BaStockRow from './ba-stock-row.vue'

export default {
  name: 'ba-stock-table',
  components: { 'ba-stock-row': BaStockRow },
  props: { list: Array }
}
</script>
