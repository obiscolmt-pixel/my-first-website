import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyCXFSe0Q8O3LY1YCSykWOboi9QIV44Gxuo",
  authDomain: "obisco-store-1c18e.firebaseapp.com",
  projectId: "obisco-store-1c18e",
  storageBucket: "obisco-store-1c18e.firebasestorage.app",
  messagingSenderId: "367538340277",
  appId: "1:367538340277:web:6511223f78ff9b921699fc",
  measurementId: "G-VC6MBGLSP6"
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export { messaging, getToken, onMessage }