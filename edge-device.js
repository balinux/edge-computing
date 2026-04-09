// edge-device.js
// Memerlukan Node.js versi 18+ (karena menggunakan native fetch)
import { serve } from '@hono/node-server';
import { Hono } from 'hono';

// 1. Runtime Adaptation Engine (RAE)
// Mengambil keputusan di mana komputasi harus dijalankan
function evaluasiRAE(baterai, latensiJaringan) {
  console.log("Baterai:", baterai, "%, Latensi:", latensiJaringan, "ms");
  
  // 1. Prioritas Utama: Jika jaringan buruk/putus, WAJIB eksekusi di lokal.
  if (latensiJaringan > 200) {
    return "LOKAL";
  }
  
  // 2. Jika jaringan bagus, tapi baterai sangat kritis (< 20%).
  // Offload (lempar) tugas berat ke Cloud untuk menghemat pemakaian CPU lokal (menghemat sisa baterai).
  if (baterai < 20) {
    return "CLOUD";
  }

  // 3. Default (Kondisi Optimal): Proses di LOKAL untuk menghemat bandwidth
  // dan mempraktikkan Edge-first architecture (kecuali butuh model sangat besar di Cloud).
  return "LOKAL";
}

// Fungsi bantuan untuk mengirim data ke Cloud
async function kirimKeCloud(endpoint, data) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(`[Respon Cloud dari ${endpoint}]:`, result);
  } catch (error) {
    console.error("Gagal menghubungi Cloud:", error.message);
  }
}

// Simulasi siklus utama (Main Loop)
async function jalankanSistemPemantauan(bateraiPerangkat = 50, latensiJaringan = 50) {
  // Simulasi pembacaan sensor dan kondisi mini-PC / Edge device

  // Simulasi data mentah dari sensor di kebun
  const dataSensor = {
    suhu: 32.5,
    kelembapan: 45.0,
    gambar_daun: "base64_string_gambar_daun_pakcoy_resolusi_tinggi...",
  };

  const keputusanEksekusi = evaluasiRAE(bateraiPerangkat, latensiJaringan);
  console.log("HASIL KEPUTUSAN:", keputusanEksekusi);

  if (keputusanEksekusi === "LOKAL") {
    console.log(
      "[RAE] Mengeksekusi analisis secara LOKAL (Kondisi jaringan buruk atau default hemat bandwidth)...",
    );

    // Simulasi proses analisis lokal menggunakan model TensorFlow.js yang ringan
    const hasilAnalisisLokal =
      "Bercak kuning terdeteksi pada daun (Kekurangan Nitrogen)";

    // 2. Data Abstraction (Perlindungan Privasi & Hemat Bandwidth)
    // Kita HANYA mengirimkan kesimpulan teks, tanpa mengirim gambar resolusi tinggi
    const dataAbstraksi = {
      suhu: dataSensor.suhu,
      kelembapan: dataSensor.kelembapan,
      status_teks: hasilAnalisisLokal,
    };

    await kirimKeCloud("http://localhost:3000/log-abstraksi", dataAbstraksi);
  } else {
    console.log(
      "[RAE] Mengirim tugas berat ke CLOUD (Baterai lemah untuk CPU lokal, atau butuh resource besar)...",
    );

    // Mengirim data sensor beserta gambar lengkap untuk diproses oleh Cloud
    await kirimKeCloud("http://localhost:3000/analisis-gambar", dataSensor);
  }
}

const app = new Hono();

// Endpoint untuk menerima data kondisi dari HTTP request
app.post('/trigger', async (c) => {
  try {
    const body = await c.req.json();
    const baterai = body.baterai !== undefined ? body.baterai : 50;
    const latensi = body.latensi !== undefined ? body.latensi : 50;

    console.log(`\n[API] Menerima request trigger: Baterai ${baterai}%, Latensi ${latensi}ms`);
    
    // Menjalankan sistem pemantauan dengan data dari HTTP request
    await jalankanSistemPemantauan(baterai, latensi);
    
    return c.json({
      status: 'success',
      message: 'Sistem pemantauan telah dijalankan berdasarkan input request',
      data: { baterai, latensi }
    });
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 400);
  }
});

const port = 4000;
console.log(`🚀 Server Edge Device berjalan di http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port: port
});
