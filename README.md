# edge-computing

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run
```

This project was created using `bun init` in bun v1.3.9. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Run app

Contoh: Baterai lemah dan latensi tinggi (Memaksa komputasi LOKAL)

```bash
  curl -X POST http://localhost:4000/trigger \
    -H "Content-Type: application/json" \
    -d '{"baterai": 15, "latensi": 250}'
```

Contoh: Kondisi optimal (Memaksa pengiriman ke CLOUD)

````bash
  curl -X POST http://localhost:4000/trigger \
    -H "Content-Type: application/json" \
    -d '{"baterai": 80, "latensi": 50}'

 Contoh Simulasi Kondisi Optimal (Memicu Cloud Processing + Privasi)

 ```bash
   curl -X POST http://localhost:4001/trigger \
     -H "Content-Type: application/json" \
     -d '{"baterai": 80, "latensi": 50}'
````

```

```
