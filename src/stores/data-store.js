// src/stores/data-store.js
import { defineStore } from 'pinia'
import raw from '../data/data-bahan-ajar.json'
import { trackingDO, dataTracking } from '../data/tracking-data'

// localStorage helpers
function loadSavedStok() {
  try {
    const s = localStorage.getItem('sitta_stok_v1')
    return s ? JSON.parse(s) : null
  } catch (e) { return null }
}
function saveStokToStorage(stok) {
  try { localStorage.setItem('sitta_stok_v1', JSON.stringify(stok)) } catch(e){}
}

export const useDataStore = defineStore('data-store', {
  state: () => {
    // generate tracking sample up to 10 if needed (same logic as before)
    const generated = trackingDO.slice()
    if (generated.length < 10) {
      for (let i = generated.length + 1; i <= 10; i++) {
        const nomorDO = `DO2025-${String(i).padStart(3,'0')}`
        const nim = String(2023000000 + i)
        const tanggal = new Date(); tanggal.setDate(tanggal.getDate() - (10 - i))
        const tanggalKirim = tanggal.toISOString().slice(0,10)
        generated.push({
          nomorDO, nim, nama:`Dummy ${i}`, ekspedisi: i%2===0?'JNE':'Pos Indonesia',
          paketKode:`PKT-${String(i).padStart(2,'0')}`, paketNama:`Paket Dummy ${i}`,
          tanggalKirim, total:100000 + i*5000, status: i%3===0?'Selesai':(i%2===0?'Dalam Perjalanan':'Dikirim'),
          perjalanan:[{waktu:`${tanggalKirim} 08:00:00`, keterangan:'Penerimaan di Loket'}]
        })
      }
    }

    // stok: prefer saved from localStorage
    const saved = loadSavedStok()
    let stokSeed = (raw.stok || []).map(s => ({ ...s })) // shallow clone

    if (saved && Array.isArray(saved) && saved.length) {
      stokSeed = saved
    } else {
      // ensure image fields exist (and are filenames) — if raw has full path you can leave
      stokSeed = stokSeed.map(it => {
        return { 
          ...it,
          // normalize: if image present and starts with '/images/', strip leading '/images/' to store filename
          image: it.image ? (it.image.startsWith('/images/') ? it.image.replace(/^\/images\//,'') : it.image) : ''
        }
      })
      // persist initial seed so edits survive reload
      saveStokToStorage(stokSeed)
    }

    return {
      upbjjList: raw.upbjjList || [],
      kategoriList: raw.kategoriList || [],
      pengirimanList: raw.pengirimanList || [],
      paket: raw.paket || [],
      stok: stokSeed,
      tracking: generated,
      trackingMap: { ...dataTracking }
    }
  },

  getters: {
    stokByKode: (state) => (kode) => state.stok.find(s => s.kode === kode),
    findDOByNomor: (state) => (nomor) => state.tracking.find(d => d.nomorDO === nomor),
    findByNIM: (state) => (nim) => state.trackingMap[nim] || null,
    sortedTrackingDesc: (state) => state.tracking.slice().sort((a,b)=> new Date(b.tanggalKirim||0) - new Date(a.tanggalKirim||0))
  },

  actions: {
    addStock(item) {
      if (!item.kode || !item.judul) throw new Error('Kode & Judul required')
      // store image as filename (strip leading /images/ if present)
      const img = item.image ? (item.image.startsWith('/images/')? item.image.replace(/^\/images\//,'') : item.image) : ''
      const newItem = { ...item, image: img }
      this.stok.push(newItem)
      saveStokToStorage(this.stok)
    },
    updateStock(kode, payload) {
      const i = this.stok.findIndex(s=>s.kode===kode)
      if (i!==-1) {
        // ensure image stored as filename
        if (payload.image && payload.image.startsWith('/images/')) payload.image = payload.image.replace(/^\/images\//,'')
        this.stok.splice(i,1,{ ...this.stok[i], ...payload })
        saveStokToStorage(this.stok)
      }
    },
    deleteStock(kode) {
      this.stok = this.stok.filter(s=>s.kode!==kode)
      saveStokToStorage(this.stok)
    },
    addTrackingDO(doObj) {
      this.tracking.push({...doObj})
      if (doObj.nim) {
        this.trackingMap[doObj.nim] = {
          nomorDO: doObj.nomorDO,
          nama: doObj.nama,
          status: doObj.status,
          ekspedisi: doObj.ekspedisi,
          tanggalKirim: doObj.tanggalKirim,
          paket: doObj.paketKode || doObj.paket,
          total: 'Rp ' + Number(doObj.total || 0).toLocaleString('id-ID'),
          perjalanan: doObj.perjalanan || []
        }
      }
    },
    addTrackingMapEntry(nim, entry) { this.trackingMap[nim] = entry }
  }
})
