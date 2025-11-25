# Biblioteca Pessoal - PWA (PDM2)

## Como rodar localmente
1. Instale Node.js (v18+ recomendado) e npm.
2. `npm install`
3. `npm run dev`
4. Abra `http://localhost:5173` (Vite mostrará a porta exata).

## Build e deploy
- `npm run build` para gerar `dist/`.
- Deploy no Vercel: conectar repositório GitHub, Vercel detecta Vite. Build command: `npm run build`, Output dir: `dist`.

## Observações
- IndexedDB via `idb` (armazenamento local).
- Câmera via `navigator.mediaDevices.getUserMedia`.
- Service Worker com Workbox (CDN) e offline fallback.
