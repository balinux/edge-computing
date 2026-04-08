// edge-device.js
// Memerlukan Node.js versi 18+ (karena menggunakan native fetch)

// 1. Runtime Adaptation Engine (RAE)
// Mengambil keputusan di mana komputasi harus dijalankan
function evaluasiRAE(baterai, latensiJaringan) {
  console.log(baterai);
  console.log(latensiJaringan);
  // Jika baterai di bawah 20% atau latensi jaringan lambat (> 200ms)
  if (baterai < 20 || latensiJaringan > 200) {
    return "LOKAL";
  }
  return "CLOUD";
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
async function jalankanSistemPemantauan() {
  // Simulasi pembacaan sensor dan kondisi mini-PC / Edge device
  // 1. Simulasi kirim ke cloud
  const bateraiPerangkat = 50; // Persentase sisa baterai
  const latensiJaringan = 50; // Latensi dalam milidetik (ms)

  // 2. Simulasi tes di lokal
  // const bateraiPerangkat = 15;    // Persentase sisa baterai
  // const latensiJaringan = 250;     // Latensi dalam milidetik (ms)

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
      "[RAE] Baterai lemah/Jaringan lambat. Mengeksekusi analisis secara LOKAL...",
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
      "[RAE] Kondisi optimal. Mengirim data mentah ke CLOUD untuk analisis mendalam...",
    );

    // Mengirim data sensor beserta gambar lengkap untuk diproses oleh Cloud
    await kirimKeCloud("http://localhost:3000/analisis-gambar", dataSensor);
  }
}

// Jalankan sistem
jalankanSistemPemantauan();
