<template>
  <tr>
    <td>{{ item.kode }}</td>
    <td>{{ item.judul }}</td>
    <td>{{ item.kategori }}</td>
    <td>{{ item.upbjj }}</td>
    <td>{{ item.lokasiRak }}</td>
    <td>{{ formatCurrency(item.harga) }}</td>
    <td>{{ item.qty }} buah</td>
    <td>{{ item.safety }}</td>
    <td>
      <span class="badge" :class="badgeClass">{{ statusText }}</span>
    </td>
    <td>
      <button class="btn btn-sm btn-outline-info" @click="$emit('preview-note', item)"><i class="bi bi-eye"></i></button>
    </td>
    <td>
      <button class="btn btn-sm btn-outline-primary me-1" @click="$emit('edit', item)"><i class="bi bi-pencil"></i></button>
      <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', item)"><i class="bi bi-trash"></i></button>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'ba-stock-row',
  props: { item: Object },
  computed: {
    statusText(){
      if (this.item.qty === 0) return 'Kosong'
      if (this.item.qty < this.item.safety) return 'Menipis'
      return 'Aman'
    },
    badgeClass(){
      if (this.item.qty === 0) return 'badge-kosong'
      if (this.item.qty < this.item.safety) return 'badge-menipis'
      return 'badge-aman'
    }
  },
  methods:{
    formatCurrency(v){
      if (v == null) return '-'
      return 'Rp ' + Number(v).toLocaleString('id-ID')
    }
  }
}
</script>
