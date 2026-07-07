import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  orderBy,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, StoreSettings, ContactMessage } from '../types';

// Curated high-quality clothing product images from Unsplash (royalty-free, reliable URLs)
const DEFAULT_PRODUCTS: Omit<Product, 'id'>[] = [
  {
    name: "Cyberpunk Tech Hoodie",
    price: 89.99,
    description: "Premium heavy-weight oversized hoodie featuring techwear hardware detailing, cybernetic arm printing, and a water-resistant finish. Perfect for cold nights in the digital city.",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
    category: "Outerwear",
    status: "available",
    createdAt: Date.now() - 5000
  },
  {
    name: "Code West Signature Tee",
    price: 34.99,
    description: "100% organic cotton graphic tee with our signature 'Code West' distressed backprint. Breathable relaxed fit designed for creators and visionaries.",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    category: "Tops",
    status: "available",
    createdAt: Date.now() - 4000
  },
  {
    name: "Tactical Utility Cargoes",
    price: 79.99,
    description: "Multi-pocket durable nylon ripstop cargo pants with adjustable ankles, high-tensile buckles, and an ergonomic tapered fit for ultimate utility and style.",
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    category: "Bottoms",
    status: "available",
    createdAt: Date.now() - 3000
  },
  {
    name: "Matrix Knit Beanie",
    price: 24.99,
    description: "Thick double-layered ribbed knit beanie with an embroidered metal-grommet code logo. Keeps you warm and locked into your creative flow.",
    imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    status: "available",
    createdAt: Date.now() - 2000
  },
  {
    name: "Minimalist Cyber Backpack",
    price: 110.00,
    description: "Sleek, futuristic roll-top backpack with magnetic closures, a padded 16-inch laptop compartment, and fully waterproof technical exterior coating.",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    status: "out_of_stock",
    createdAt: Date.now() - 1000
  }
];

const DEFAULT_SETTINGS: StoreSettings = {
  adminPasscode: "CodeWest1234567$$$",
  whatsappNumber: "+2347046039735", // User's custom WhatsApp consultant number (Nigerian format)
  whatsappTemplate: "Hello Code West Collections! I am interested in purchasing the *{product_name}* priced at *${price}*. Is this available?",
  instagramUrl: "https://instagram.com/codewest",
  tiktokUrl: "https://tiktok.com/@codewest"
};

// Helper to strip any undefined properties from objects before writing to Firestore, preventing "Unsupported field value: undefined" errors
function cleanData<T extends object>(obj: T): T {
  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned as T;
}

// --- SETTINGS OPERATIONS ---
export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const docRef = doc(db, "settings", "global");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      let hasUpdates = false;
      // Auto-migrate if it is using the old default passcode "codewest77" to the user's secure default "CodeWest1234567$$$"
      if (data.adminPasscode === "codewest77") {
        data.adminPasscode = "CodeWest1234567$$$";
        hasUpdates = true;
      }
      // Auto-migrate if it is using the old default mock WhatsApp number "+2348000000000" to the user's secure default "+2347046039735"
      if (data.whatsappNumber === "+2348000000000") {
        data.whatsappNumber = "+2347046039735";
        hasUpdates = true;
      }
      if (hasUpdates) {
        await setDoc(docRef, cleanData({ ...data }), { merge: true });
      }
      return { ...DEFAULT_SETTINGS, ...data } as StoreSettings;
    } else {
      // Initialize with defaults if it doesn't exist
      await setDoc(docRef, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error("Error fetching settings, using defaults:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<void> {
  const docRef = doc(db, "settings", "global");
  await setDoc(docRef, cleanData(settings), { merge: true });
}

export async function incrementVisitCount(): Promise<number> {
  try {
    const docRef = doc(db, "settings", "global");
    await setDoc(docRef, { visitCount: increment(1) }, { merge: true });
    const docSnap = await getDoc(docRef);
    return docSnap.data()?.visitCount || 0;
  } catch (error) {
    console.error("Error incrementing visit count:", error);
    return 0;
  }
}

export async function incrementClickCount(): Promise<number> {
  try {
    const docRef = doc(db, "settings", "global");
    await setDoc(docRef, { clickCount: increment(1) }, { merge: true });
    const docSnap = await getDoc(docRef);
    return docSnap.data()?.clickCount || 0;
  } catch (error) {
    console.error("Error incrementing click count:", error);
    return 0;
  }
}

export async function resetAnalyticsCounters(): Promise<void> {
  try {
    const docRef = doc(db, "settings", "global");
    await setDoc(docRef, { visitCount: 0, clickCount: 0 }, { merge: true });
  } catch (error) {
    console.error("Error resetting analytics counters:", error);
    throw error;
  }
}

// --- PRODUCT OPERATIONS ---
export async function getProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Check if we have already seeded before, preventing re-seeding after deliberate deletion of all items
      const settingsRef = doc(db, "settings", "global");
      const settingsSnap = await getDoc(settingsRef);
      const alreadySeeded = settingsSnap.exists() && settingsSnap.data()?.hasSeeded === true;

      if (alreadySeeded) {
        console.log("Database has already been seeded and was deliberately emptied. Keeping it empty.");
        return [];
      }

      // Seed default products so the boutique has premium content on first load!
      console.log("No products found, seeding default collections...");
      const seeded: Product[] = [];
      for (const p of DEFAULT_PRODUCTS) {
        const docRef = await addDoc(productsRef, p);
        seeded.push({ id: docRef.id, ...p });
      }

      try {
        await setDoc(settingsRef, { hasSeeded: true }, { merge: true });
      } catch (err) {
        console.error("Failed to write seeded status in settings doc:", err);
      }

      return seeded;
    }
    
    const products: Product[] = [];
    const defaultNames = DEFAULT_PRODUCTS.map(dp => dp.name);

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      const name = data.name || '';
      if (defaultNames.includes(name)) {
        // Permanently clean up/delete the default mock product from Firestore database
        const docRef = doc(db, "products", docSnap.id);
        deleteDoc(docRef).catch(err => console.error("Error cleaning up old product:", err));
      } else {
        products.push({
          id: docSnap.id,
          name: name,
          price: Number(data.price) || 0,
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          category: data.category || 'General',
          orderLink: data.orderLink || '',
          status: data.status || 'available',
          createdAt: data.createdAt || Date.now()
        });
      }
    }
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty array on complete failure to keep only the user's custom uploaded product visible
    return [];
  }
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  const productsRef = collection(db, "products");
  const docRef = await addDoc(productsRef, cleanData({
    ...product,
    createdAt: Date.now()
  }));

  try {
    const settingsRef = doc(db, "settings", "global");
    await setDoc(settingsRef, { hasSeeded: true }, { merge: true });
  } catch (err) {
    console.error("Failed to write seeded status in settings doc:", err);
  }

  return docRef.id;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<void> {
  const docRef = doc(db, "products", id);
  await updateDoc(docRef, cleanData({ ...product }));
}

export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
}

/**
 * Builds the WhatsApp redirect URL or custom checkout link for a product.
 * If the product has a custom order link, we use it directly.
 * Otherwise, we generate a WhatsApp link using the store's settings and templating.
 */
export function buildOrderUrl(product: Product, settings: StoreSettings): string {
  if (product.orderLink && product.orderLink.trim().startsWith('http')) {
    return product.orderLink.trim();
  }

  // Generate WhatsApp message
  const template = settings.whatsappTemplate || "Hello, I am interested in {product_name}";
  const cleanNumber = settings.whatsappNumber.replace(/[^\d+]/g, ''); // keep only numbers and +
  
  const message = template
    .replace(/{product_name}/g, product.name)
    .replace(/{price}/g, `$${product.price.toFixed(2)}`)
    .replace(/{id}/g, product.id);

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

// --- CONTACT MESSAGES OPERATIONS ---
export async function submitContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const messagesRef = collection(db, "contact_messages");
  const docRef = await addDoc(messagesRef, cleanData({
    ...msg,
    status: 'unread',
    createdAt: Date.now()
  }));
  return docRef.id;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const messagesRef = collection(db, "contact_messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const messages: ContactMessage[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        name: data.name || '',
        email: data.email || '',
        subject: data.subject || '',
        message: data.message || '',
        createdAt: data.createdAt || Date.now(),
        status: data.status || 'unread'
      });
    });
    return messages;
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return [];
  }
}

export async function updateContactMessageStatus(id: string, status: 'unread' | 'read' | 'archived'): Promise<void> {
  const docRef = doc(db, "contact_messages", id);
  await updateDoc(docRef, cleanData({ status }));
}

export async function deleteContactMessage(id: string): Promise<void> {
  const docRef = doc(db, "contact_messages", id);
  await deleteDoc(docRef);
}
