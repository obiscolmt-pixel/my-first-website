importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyCXFSe0Q8O3LY1YCSykWOboi9QIV44Gxuo",
  authDomain: "obisco-store-1c18e.firebaseapp.com",
  projectId: "obisco-store-1c18e",
  storageBucket: "obisco-store-1c18e.firebasestorage.app",
  messagingSenderId: "367538340277",
  appId: "1:367538340277:web:6511223f78ff9b921699fc"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload)

  const title = payload.notification?.title || payload.data?.title || 'Obisco Store'
  const body = payload.notification?.body || payload.data?.body || 'You have a new notification'
  const icon = payload.notification?.icon || '/icons/icon-192.png'

  self.registration.showNotification(title, {
    body,
    icon,
    badge: '/icons/icon-72.png',
    vibrate: [200, 100, 200],
    data: { url: 'https://www.obisco.store' }
  })
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('https://www.obisco.store')
  )
})