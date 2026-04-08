// cloud-server.js
import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

// Endpoint 1: Menerima Data Abstraction (Tugas diproses di lokal, Cloud hanya menyimpan log)
app.post('/log-abstraksi', async (c) => {
    const body = await c.req.json();
    console.log("☁️ [Cloud] Menerima log ringkasan dari Edge Device:", body.status_teks);

    // Di sini sistem biasanya menyimpan data ke database (seperti MongoDB/PostgreSQL)
    return c.json({
        status: 'success',
        message: 'Log abstraksi berhasil dicatat di cloud.'
    });
});

// Endpoint 2: Menerima Tugas Berat (Edge mendelegasikan analisis gambar ke Cloud)
app.post('/analisis-gambar', async (c) => {
    const body = await c.req.json();
    console.log("☁️ [Cloud] Menerima gambar asli beresolusi tinggi dari Edge Device. Memulai analisis...");

    // Simulasi Cloud menggunakan resource besar untuk menjalankan model AI (misal: analisis hama)
    // const hasilAI = await JalankanModelDeepLearning(body.gambar_daun);

    const hasilAnalisis = {
        penyakit: "Kutu Daun (Aphids) terdeteksi",
        tingkat_kepercayaan: 0.96,
        rekomendasi: "Semprotkan pestisida organik (neem oil) pada sore hari."
    };

    console.log("☁️ [Cloud] Analisis selesai, mengirim kembali ke Edge Device.");

    return c.json({
        status: 'success',
        data: hasilAnalisis
    });
});

// Menjalankan server Hono di lingkungan Node.js
const port = 3000;
console.log(`🚀 Server Cloud Hono berjalan di http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port: port
});
