// ====== DATA TRACKING DO (AWAL + 10 DATA) ======
export const trackingDO = [
  // 1) ORIGINAL — TIDAK DIUBAH
  {
    nomorDO: "DO2025-001",
    nim: "2023001234",
    nama: "Rina Wulandari",
    ekspedisi: "JNE Regular",
    paketKode: "0JKT01",
    paketNama: "Paket Jakarta 01",
    tanggalKirim: "2025-08-25",
    total: 180000,
    status: "Dalam Perjalanan",
    perjalanan: [
      { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGERANG SELATAN" },
      { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: TANGERANG SELATAN" }
    ]
  },

  // 2) ORIGINAL — DIPERBAIKI nomorDO
  {
    nomorDO: "DO2025-002",
    nim: "2023005678",
    nama: "Agus Pranoto",
    ekspedisi: "Pos Indonesia",
    paketKode: "0UPBJJBDG",
    paketNama: "Paket Bandung",
    tanggalKirim: "2025-08-25",
    total: 220000,
    status: "Dikirim",
    perjalanan: [
      { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka" },
      { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: TANGERANG SELATAN" },
      { waktu: "2025-08-25 16:30:10", keterangan: "Diteruskan ke Kantor Kota Bandung" },
      { waktu: "2025-08-26 12:15:33", keterangan: "Tiba di Hub: Kota BANDUNG" },
      { waktu: "2025-08-26 15:06:12", keterangan: "Proses antar ke Cimahi" },
      { waktu: "2025-08-26 20:00:00", keterangan: "Selesai Antar. Penerima: Agus Pranoto" }
    ]
  },

  // 3–10 DUMMY BARU
  ...Array.from({ length: 8 }, (_, i) => {
    const idx = i + 3; // mulai dari 3
    const nomor = `DO2025-${String(idx).padStart(3, "0")}`;
    const nim = `202300000${idx}`;
    const nama = `User Dummy ${idx}`;
    const ekspedisi = idx % 2 === 0 ? "JNE Regular" : "Pos Indonesia";
    const paketKode = `PKT-${idx}`;
    const paketNama = `Paket Dummy ${idx}`;
    const total = 100000 + idx * 10000;

    // tanggal mundur per dummy
    const dateObj = new Date("2025-08-25");
    dateObj.setDate(dateObj.getDate() - (10 - idx));
    const tgl = dateObj.toISOString().split("T")[0];

    return {
      nomorDO: nomor,
      nim,
      nama,
      ekspedisi,
      paketKode,
      paketNama,
      tanggalKirim: tgl,
      total,
      status: idx % 3 === 0 ? "Selesai" : idx % 2 === 0 ? "Dalam Perjalanan" : "Dikirim",
      perjalanan: [
        { waktu: `${tgl} 08:00:00`, keterangan: "Penerimaan barang di gudang utama" },
        { waktu: `${tgl} 12:30:00`, keterangan: "Diproses di pusat sortir" },
        ...(idx % 3 === 0
          ? [{ waktu: `${tgl} 18:00:00`, keterangan: "Barang telah diterima oleh pelanggan" }]
          : []
        )
      ]
    };
  })
];

// ====== UNTUK PENCARIAN NIM ======
export const dataTracking = {
  "2023001234": {
    nomorDO: "DO2025-001",
    nama: "Rina Wulandari",
    status: "Dalam Perjalanan",
    ekspedisi: "JNE",
    tanggalKirim: "2025-08-25",
    paket: "0JKT01",
    total: "Rp 180.000",
    perjalanan: [
      { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka" },
      { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: TANGERANG SELATAN" },
      { waktu: "2025-08-25 16:40:00", keterangan: "Diteruskan ke Kantor Jakarta Selatan" }
    ]
  },

  "2023005678": {
    nomorDO: "DO2025-002",
    nama: "Agus Pranoto",
    status: "Dikirim",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2025-08-25",
    paket: "0UPBJJBDG",
    total: "Rp 220.000",
    perjalanan: [
      { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka" },
      { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: TANGERANG SELATAN" },
      { waktu: "2025-08-25 16:30:10", keterangan: "Diteruskan ke Kantor Kota Bandung" },
      { waktu: "2025-08-26 12:15:33", keterangan: "Tiba di Hub: Kota BANDUNG" },
      { waktu: "2025-08-26 15:06:12", keterangan: "Proses antar ke Cimahi" },
      { waktu: "2025-08-26 20:00:00", keterangan: "Selesai Antar. Penerima: Agus Pranoto" }
    ]
  }
};
