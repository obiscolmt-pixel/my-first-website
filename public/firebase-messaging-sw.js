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
  const { title, body, icon } = payload.notification
  self.registration.showNotification(title, {
    body,
    icon: icon || '/icons/icon-192.png'
  })
})