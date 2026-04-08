// edge-device.js
// Memerlukan Node.js versi 18+ (karena menggunakan native fetch)
const fs = require('fs');
const crypto = require('crypto');

// ==============================================================
// 1. RUNTIME ADAPTATION ENGINE (RAE)
// ==============================================================
function evaluasiRAE(baterai, latensiJaringan) {
    if (baterai < 20 || latensiJaringan > 200) {
        return "LOKAL";
    }
    return "CLOUD";
}

// ==============================================================
// 2. PRIVACY-PROTECTION ENGINE
// ==============================================================

// A. Hierarchical Data Sandboxing (Isolasi Data Sensitif)
// Menyimpan data sangat rahasia hanya di lokal, tidak pernah dikirim ke Cloud
function simpanKeSandboxLokal(dataSensitif) {
    const logData = `${new Date().toISOString()} - Data Sensitif: ${JSON.stringify(dataSensitif)}\n`;
    fs.appendFileSync('sandbox-lokal-rahasia.log', logData);
    console.log("🔒 [Privacy Engine] Data sensitif diamankan di Sandbox Lokal.");
}

// B. Data Obfuscation (Pengaburan/Enkripsi)
// Menyamarkan data sebelum dikirim ke luar jaringan
function obfuscateData(teksRahasia) {
    const secretKey = 'kunci-rahasia-kebun-pakcoy';
    return crypto.createHmac('sha256', secretKey).update(teksRahasia).digest('hex');
}

// ==============================================================
// FUNGSI JARINGAN & MAIN LOOP
// ==============================================================

// Fungsi bantuan untuk mengirim data ke Cloud
async function kirimKeCloud(endpoint, data) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log(`☁️ [Respon Cloud dari ${endpoint}]:`, result);
    } catch (error) {
        console.error("❌ Gagal menghubungi Cloud:", error.message);
    }
}

// Simulasi siklus utama (Main Loop)
async function jalankanSistemPemantauan() {
    // local
    // const bateraiPerangkat = 15;    // Persentase sisa baterai
    // const latensiJaringan = 50;     // Latensi dalam milidetik (ms)

    // cloud
    const bateraiPerangkat = 50;    // Persentase sisa baterai
    const latensiJaringan = 150;     // Latensi dalam milidetik (ms)

    // Simulasi data mentah dari sensor di kebun (termasuk data sensitif)
    const dataSensor = {
        suhu: 32.5,
        kelembapan: 45.0,
        gambar_daun: "base64_string_gambar_daun_pakcoy_resolusi_tinggi...",
        lokasi_presisi: "Lat: -8.777, Long: 115.172", // Data yang perlu disamarkan
        rfid_pemilik: "ID-123456-KHALID"              // Data yang dilarang keluar jaringan
    };

    console.log("\n--- Memulai Proses Pemantauan ---");

    // -----------------------------------------------------------------
    // EKSEKUSI PRIVACY-PROTECTION ENGINE SEBELUM DATA DIPROSES LEBIH LANJUT
    // -----------------------------------------------------------------

    // 1. Sandboxing: Amankan data RFID dan HAPUS dari objek utama
    if (dataSensor.rfid_pemilik) {
        simpanKeSandboxLokal({ rfid: dataSensor.rfid_pemilik });
        delete dataSensor.rfid_pemilik; // Memastikan data ini terhapus dari payload
    }

    // 2. Obfuscation: Samarkan lokasi presisi menjadi kode hash
    if (dataSensor.lokasi_presisi) {
        dataSensor.lokasi_samaran = obfuscateData(dataSensor.lokasi_presisi);
        console.log("data sebelum di encrypt");
        console.log(dataSensor.lokasi_presisi);
        console.log("data setelah di encrypt");
        console.log(dataSensor.lokasi_samaran);

        delete dataSensor.lokasi_presisi; // Menghapus lokasi asli
        console.log("🛡️ [Privacy Engine] Data lokasi berhasil disamarkan (Obfuscated).");
    }

    // -----------------------------------------------------------------

    const keputusanEksekusi = evaluasiRAE(bateraiPerangkat, latensiJaringan);

    if (keputusanEksekusi === "LOKAL") {
        console.log("⚙️ [RAE] Baterai lemah/Jaringan lambat. Mengeksekusi analisis secara LOKAL...");

        const hasilAnalisisLokal = "Bercak kuning terdeteksi pada daun (Kekurangan Nitrogen)";

        // 3. Data Abstraction (Perlindungan Privasi Lapis Tiga & Hemat Bandwidth)
        // Cloud hanya menerima kesimpulan teks dan data sekunder yang sudah disamarkan
        const dataAbstraksi = {
            suhu: dataSensor.suhu,
            kelembapan: dataSensor.kelembapan,
            lokasi_samaran: dataSensor.lokasi_samaran, // Ikut dikirim tapi sudah aman
            status_teks: hasilAnalisisLokal
        };

        await kirimKeCloud("http://localhost:3000/log-abstraksi", dataAbstraksi);

    } else {
        console.log("🚀 [RAE] Kondisi optimal. Mengirim data ke CLOUD untuk analisis mendalam...");

        // Objek dataSensor di sini sudah bersih dari data sensitif (RFID sudah dihapus, lokasi sudah disamarkan)
        await kirimKeCloud("http://localhost:3000/analisis-gambar", dataSensor);
    }
}

// Jalankan sistem
jalankanSistemPemantauan();
