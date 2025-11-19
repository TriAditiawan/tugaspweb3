<template>
  <div class="modal fade" tabindex="-1" ref="el">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header"><h5>Catatan</h5><button class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body" v-html="html"></div>
      </div>
    </div>
  </div>
</template>

<script>
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
export default {
  name: 'ba-note-modal',
  props: { html: { type: String, default: '' } },
  mounted(){ this.bs = new bootstrap.Modal(this.$refs.el) },
  methods:{ show(){ this.bs.show() }, hide(){ this.bs.hide() } },
  watch:{ html(){ /* content changes ok */ } }
}
</script>
