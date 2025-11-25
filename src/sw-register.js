import { Workbox } from 'workbox-window';

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');

  wb.addEventListener('installed', (event) => {
    if (event.isUpdate) {
      if (confirm('Nova versão disponível. Deseja atualizar agora?')) {
        window.location.reload();
      }
    }
  });

  wb.register()
    .then(() => console.log('Service Worker registrado via Workbox'))
    .catch((err) => console.error('Erro ao registrar SW:', err));
}
