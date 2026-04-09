# Simulasi Edge Computing & Privacy Protection

Proyek ini mendemonstrasikan konsep **Edge Computing** menggunakan Node.js (via Bun) dengan arsitektur **Runtime Adaptation Engine (RAE)**. Sistem dapat secara dinamis mengambil keputusan untuk memproses data sensor/gambar secara mandiri di perangkat fisik (Edge) atau mengirimkannya ke peladen pusat (Cloud) berdasarkan kondisi baterai perangkat dan latensi jaringan.

## Persiapan & Instalasi

Pastikan Anda menggunakan [Bun](https://bun.sh/) atau Node.js versi 18+.
Untuk menginstal *dependencies* proyek:

```bash
bun install
```

## Menjalankan Sistem

Proyek ini memiliki 3 komponen utama:
1. **Cloud Server**: Menerima data dari perangkat Edge. (Berjalan di Port 3000)
2. **Edge Device**: Mengambil keputusan dan memproses AI ringan. (Berjalan di Port 4000)
3. **Edge Privacy**: Versi Edge dengan keamanan berlapis (Sandboxing & Obfuscation). (Berjalan di Port 4001)

Jalankan masing-masing komponen (ideal di terminal/tab yang terpisah):

```bash
# Terminal 1: Menjalankan peladen Cloud
bun run cloud

# Terminal 2: Menjalankan peladen Edge Device utama
bun run edge-device.js

# Terminal 3: Menjalankan peladen Edge Privacy
bun run edge-privacy.js
```

---

## 🧪 Demo dan Simulasi (menggunakan `curl`)

Anda bisa mengirimkan `HTTP POST` ke perangkat Edge untuk mensimulasikan perubahan kondisi lingkungan baterai dan jaringan di lapangan. Sistem akan mengambil keputusan cerdas secara *real-time*.

### Skenario 1: Jaringan Buruk / Terputus ➡️ Dieksekusi di LOKAL
Jika jaringan sedang lambat (latensi > 200ms), Edge Device *wajib* memproses analisis secara mandiri (Lokal) karena gagal/terlalu lama terhubung ke Cloud.

```bash
curl -X POST http://localhost:4000/trigger \
  -H "Content-Type: application/json" \
  -d '{"baterai": 80, "latensi": 300}'
```

### Skenario 2: Baterai Lemah (Network Normal) ➡️ Dilempar ke CLOUD
Ketika baterai perangkat kritis (< 20%), maka Edge Device akan menghindari mengeksekusi proses AI lokal yang menguras daya (CPU) dan akan **melempar (offload)** tugas berat ke Cloud.

```bash
curl -X POST http://localhost:4000/trigger \
  -H "Content-Type: application/json" \
  -d '{"baterai": 10, "latensi": 50}'
```

### Skenario 3: Kondisi Optimal ➡️ Dieksekusi di LOKAL (Edge-First)
Pada kondisi baterai aman dan jaringan lancar, pendekatan **Edge-First** diterapkan. Edge Device memproses analisis secara lokal untuk mempraktikkan *Data Abstraction*, di mana perangkat hanya mengirim kesimpulan log ringan ke Cloud, sehingga sangat menghemat biaya dan alokasi *bandwidth*.

```bash
curl -X POST http://localhost:4000/trigger \
  -H "Content-Type: application/json" \
  -d '{"baterai": 90, "latensi": 45}'
```

---

### Skenario Khusus: Menguji Edge-Privacy Engine
Untuk menguji simulasi perlindungan privasi (Data Sandboxing & Obfuscation) sebelum dikirim ke Cloud atau Log, kirimkan *request* ke port `4001`. Anda akan melihat data rahasia seperti RFID dihapus dari peredaran jaringan dan disembunyikan di fail `.log` lokal.

```bash
# Contoh dengan baterai kritis sehingga perlu dikirim ke Cloud
curl -X POST http://localhost:4001/trigger \
  -H "Content-Type: application/json" \
  -d '{"baterai": 15, "latensi": 30}'
```
