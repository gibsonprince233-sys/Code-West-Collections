import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  doc,
  getDocFromServer
} from 'firebase/firestore';

const config = {
  apiKey: "AIzaSyAL1tScfEro8IncqhuwJo6nSOtVos5RMe4",
  authDomain: "gen-lang-client-0528123819.firebaseapp.com",
  projectId: "gen-lang-client-0528123819",
  storageBucket: "gen-lang-client-0528123819.firebasestorage.app",
  messagingSenderId: "764736267965",
  appId: "1:764736267965:web:766717b1b597b4649679d4"
};

const app = initializeApp(config);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
}, "ai-studio-b56069c1-736c-431c-8c2c-c98594d2b54b");

// Validate connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. Currently operating in offline cache mode.");
    }
  }
}
testConnection();

export { app, db };
export default db;
