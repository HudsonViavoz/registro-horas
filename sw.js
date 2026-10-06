// Service Worker — Controle de Horas Viavoz
// Responsável por receber e exibir notificações push

self.addEventListener('push', function(event) {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body:    data.body    || '',
    icon:    data.icon    || './favicon.ico',
    badge:   data.badge   || './favicon.ico',
    tag:     data.tag     || 'viavoz',
    renotify: true,
    requireInteraction: false,
    data: { url: data.url || '/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Viavoz', options)
  );
});

// Ao clicar na notificação — abre/foca o sistema
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // so foca a janela do proprio sistema: sem o teste de URL,
      // qualquer aba aberta pelo service worker era focada.
      for (const client of clientList) {
        if (client.url && client.url.includes('registro-horas') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});
