import React, { useState, useEffect } from 'react';
import { 
  getProducts, getStoreSettings, buildOrderUrl 
} from './lib/storeService';
import { Product, StoreSettings, CartItem } from './types';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import AdminPanel from './components/AdminPanel';
import CartDrawer from './components/CartDrawer';
import OrderStatusModal from './components/OrderStatusModal';
import LegalModals from './components/LegalModals';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import PrivacyPage from './components/PrivacyPage';
import { 
  Lock, ArrowRight, X, AlertTriangle, Filter, Eye, ShoppingBag, CheckCircle, Smartphone
} from 'lucide-react';

const INITIAL_SETTINGS: StoreSettings = {
  adminPasscode: "CodeWest1234567$$$",
  whatsappNumber: "+2347046039735",
  whatsappTemplate: "Hello Code West Collections! I am interested in purchasing the *{product_name}* priced at *${price}*. Is this available?",
  instagramUrl: "https://instagram.com/codewest",
  tiktokUrl: "https://tiktok.com/@codewest"
};

export default function App() {
  // DB States
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  
  // Shopping Cart Bag States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Filtering & Sorting
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [linkedProductId, setLinkedProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'shop' | 'about' | 'contact' | 'privacy'>('shop');

  // Admin and Overlay controllers
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // Detail Modal & Loader states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load Data on Mount
  useEffect(() => {
    fetchStoreData();
    // Persist admin session in current browser tab session
    const persistedAdmin = sessionStorage.getItem('cw_admin_authorized');
    if (persistedAdmin === 'true') {
      setIsAdmin(true);
    }
    
    // Load persisted Cart / Bag
    const savedCart = localStorage.getItem('cw_shopping_bag');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to restore shopping bag:", e);
      }
    }
  }, []);

  // Synchronize selected product with the URL query parameters
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (selectedProduct) {
        url.searchParams.set('product', selectedProduct.id);
      } else {
        url.searchParams.delete('product');
        url.searchParams.delete('p');
      }
      window.history.replaceState({}, '', url.toString());
    } catch (err) {
      console.error("Failed to update URL search parameter:", err);
    }
  }, [selectedProduct]);

  // Scroll to deep-linked product once loading is complete
  useEffect(() => {
    if (!isLoading && linkedProductId) {
      const scrollTimer = setTimeout(() => {
        const cardEl = document.getElementById(`product-card-${linkedProductId}`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          const mainCatalog = document.querySelector('main');
          if (mainCatalog) {
            mainCatalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 500);

      return () => clearTimeout(scrollTimer);
    }
  }, [isLoading, linkedProductId]);

  const saveCartToLocalStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cw_shopping_bag', JSON.stringify(newCart));
  };

  const handleAddToBag = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    let newCart: CartItem[] = [];
    if (existingItem) {
      newCart = cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { product, quantity: 1 }];
    }
    saveCartToLocalStorage(newCart);
    setIsCartOpen(true); // Auto-open cart drawer, premium retail style!
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    const newCart = cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity }
        : item
    );
    saveCartToLocalStorage(newCart);
  };

  const handleRemoveFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    saveCartToLocalStorage(newCart);
  };

  const fetchStoreData = async () => {
    setIsLoading(true);
    try {
      const dbSettings = await getStoreSettings();
      setSettings(dbSettings);
      
      const dbProducts = await getProducts();
      setProducts(dbProducts);

      // Deep Linking on initial load
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('product') || urlParams.get('p');
      if (productId) {
        setLinkedProductId(productId);
        setSelectedCategory('All');
        setSearchQuery('');
        const matchedProduct = dbProducts.find(p => p.id === productId);
        if (matchedProduct) {
          setSelectedProduct(matchedProduct);
        }
      }
    } catch (err) {
      console.error("Error loading Code West collections:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const dbProducts = await getProducts();
      setProducts(dbProducts);
      const dbSettings = await getStoreSettings();
      setSettings(dbSettings);
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Admin Access Portal Validation
  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === settings.adminPasscode) {
      setIsAdmin(true);
      sessionStorage.setItem('cw_admin_authorized', 'true');
      setIsPasscodeModalOpen(false);
      setPasscodeInput('');
      setPasscodeError(null);
      setIsAdminPanelOpen(true); // Auto-open admin after successful entry!
    } else {
      setPasscodeError("Invalid security credential. Check passcode and retry.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('cw_admin_authorized');
    setIsAdminPanelOpen(false);
  };

  // Order routing execution (compatible with web iframes)
  const handleOrder = (product: Product) => {
    const orderUrl = buildOrderUrl(product, settings);
    // Create temporary physical <a> tag to bypass popup blockers and work perfectly in sandbox/iframe
    const a = document.createElement('a');
    a.href = orderUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Categories list (dynamically generated from live catalog)
  const availableCategories: string[] = ['All', ...products.map(p => p.category).filter((val, index, self) => self.indexOf(val) === index)];

  // Search & Filter pipeline
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort pipeline
  const sortedProducts = (() => {
    let sorted = [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return b.createdAt - a.createdAt; // newest
    });

    if (linkedProductId) {
      const idx = sorted.findIndex(p => p.id === linkedProductId);
      if (idx > -1) {
        const [linkedItem] = sorted.splice(idx, 1);
        return [linkedItem, ...sorted];
      } else {
        const matchedInMaster = products.find(p => p.id === linkedProductId);
        if (matchedInMaster) {
          return [matchedInMaster, ...sorted];
        }
      }
    }
    return sorted;
  })();

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-black selection:text-white">
      
      {/* Floating Header */}
      <Navbar
        isAdmin={isAdmin}
        onAdminClick={() => {
          if (isAdmin) {
            setIsAdminPanelOpen(true);
          } else {
            setIsPasscodeModalOpen(true);
          }
        }}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={(query) => {
          setSearchQuery(query);
          if (query.trim() !== '') {
            setActiveTab('shop');
          }
        }}
        instagramUrl={settings.instagramUrl}
        tiktokUrl={settings.tiktokUrl}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onTrackOrderClick={() => setIsTrackOrderOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'shop' && (
        <>
          {/* Hero Header & Filters tab */}
          <HeroSection
            categories={availableCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            productCount={products.length}
          />

          {/* Main Catalog View Grid */}
          <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-1">
            
            {/* Sort & Quick Results Statistics bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5 mb-8">
              <div>
                <h2 className="font-display text-lg font-bold text-neutral-900 uppercase">
                  {selectedCategory} Drop
                </h2>
                <p className="font-mono text-[10px] uppercase text-neutral-500 tracking-wider mt-1">
                  Showing {sortedProducts.length} of {products.length} design items
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neutral-400 uppercase">Sort order:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-none border border-neutral-200 bg-white py-1.5 px-3 font-mono text-xs uppercase text-neutral-800 outline-none focus:border-black"
                >
                  <option value="newest">Latest Releases</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Loading Skeletons */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="space-y-4 border border-neutral-200 bg-white p-4 animate-pulse">
                    <div className="aspect-square w-full bg-neutral-200" />
                    <div className="h-4 bg-neutral-200 w-3/4" />
                    <div className="h-3 bg-neutral-200 w-1/2" />
                    <div className="h-8 bg-neutral-200 w-full" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              /* Empty Search or Category Results State */
              <div className="text-center py-24 border border-dashed border-neutral-300 bg-white/50">
                <ShoppingBag className="mx-auto h-12 w-12 text-neutral-300" />
                <h3 className="mt-4 font-display text-sm font-bold uppercase text-neutral-900">
                  No matching drops found
                </h3>
                <p className="mt-2 text-xs text-neutral-500 font-light max-w-sm mx-auto leading-relaxed">
                  We couldn't locate any products in the catalog fitting your search. Try resetting filters or search criteria.
                </p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setLinkedProductId(null); }}
                  className="mt-6 border border-black bg-white px-4 py-2 font-mono text-xs uppercase tracking-wider text-black hover:bg-black hover:text-white transition-all cursor-pointer"
                >
                  Reset Search Parameters
                </button>
              </div>
            ) : (
              /* Product Cards Render Grid */
              <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isAdmin={isAdmin}
                    isLinked={product.id === linkedProductId}
                    onEdit={() => {
                      setIsAdminPanelOpen(true);
                      // Load directly into editing form
                    }}
                    onDelete={async (id) => {
                      if (window.confirm("Are you sure?")) {
                        // Let the service handle deletion directly
                        await fetchStoreData();
                      }
                    }}
                    onAddToBag={handleAddToBag}
                    onViewDetails={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {activeTab === 'about' && (
        <div className="flex-1">
          <AboutPage onBackToShop={() => setActiveTab('shop')} />
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="flex-1">
          <ContactPage settings={settings} onBackToShop={() => setActiveTab('shop')} />
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="flex-1">
          <PrivacyPage />
        </div>
      )}

      {/* Elegant Brutalist Brand Footer */}
      <footer className="bg-black text-white border-t border-neutral-900 mt-24">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-neutral-900 pb-12 mb-8">
            
            {/* Left */}
            <div>
              <span className="font-display text-xl font-black tracking-widest uppercase">
                CODE WEST
              </span>
              <p className="text-xs text-neutral-500 font-light mt-3 max-w-xs leading-relaxed">
                Premium high-end boutique clothing line. Connecting visual aesthetic, engineering mindset, and quality fabric elements.
              </p>
            </div>

            {/* Center: Social loop links & navigation */}
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-4">
                Store Navigation
              </h4>
              <ul className="space-y-2 text-xs font-light text-neutral-400">
                <li>
                  <button 
                    onClick={() => {
                      setActiveTab('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Browse Catalog Drop
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveTab('about');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Our Story [ About Us ]
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveTab('contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Contact Loop [ Support ]
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveTab('privacy');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Privacy & Compliance
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      if (isAdmin) setIsAdminPanelOpen(true);
                      else setIsPasscodeModalOpen(true);
                    }}
                    className="hover:text-white transition-colors text-left cursor-pointer font-semibold"
                  >
                    Inventory Admin Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Right: Contact Template Redirection details */}
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-4">
                Social & Direct Channels
              </h4>
              <ul className="space-y-2 text-xs font-light text-neutral-400 mb-4">
                {settings.instagramUrl && (
                  <li>
                    <a href={settings.instagramUrl} target="_blank" referrerPolicy="no-referrer" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      Instagram DM Loop
                    </a>
                  </li>
                )}
                {settings.tiktokUrl && (
                  <li>
                    <a href={settings.tiktokUrl} target="_blank" referrerPolicy="no-referrer" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      TikTok Feed Drops
                    </a>
                  </li>
                )}
              </ul>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Transactions route instantly to WhatsApp at <span className="text-neutral-300 font-mono text-[11px] font-medium">{settings.whatsappNumber}</span>. All payments and drops are settled securely in conversation with the creators.
              </p>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-neutral-500 uppercase border-t border-neutral-900 pt-6">
            <span>© 2026 Code West Collections. All Rights Reserved.</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setActiveTab('privacy');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-neutral-800">/</span>
              <button
                onClick={() => setActiveLegalModal('terms')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms & Conditions
              </button>
            </div>
            <span>SYSTEM_STATUS // ONLINE_SECURE</span>
          </div>
        </div>
      </footer>

      {/* Overlays / Portals */}
      
      {/* 1. Admin Command Center Drawer */}
      {isAdminPanelOpen && (
        <AdminPanel
          products={products}
          settings={settings}
          onRefresh={fetchStoreData}
          onUpdateSettings={(newSettings) => {
            setSettings(newSettings);
          }}
          onClose={() => setIsAdminPanelOpen(false)}
        />
      )}

      {/* 2. Full Spec Detail Drawer / Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          settings={settings}
          onClose={() => setSelectedProduct(null)}
          onAddToBag={handleAddToBag}
        />
      )}

      {/* Order Tracking Modal */}
      {isTrackOrderOpen && (
        <OrderStatusModal
          isOpen={isTrackOrderOpen}
          onClose={() => setIsTrackOrderOpen(false)}
        />
      )}

      {/* 3. Secure Admin Portal Passcode Gate Modal */}
      {isPasscodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsPasscodeModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs cursor-pointer"
          />

          <div
            className="relative w-full max-w-md border border-neutral-800 bg-white p-6 shadow-2xl z-10"
          >
            <button
              onClick={() => setIsPasscodeModalOpen(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center border border-neutral-200 bg-white text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3 mb-6">
              <Lock className="h-5 w-5 text-neutral-900" />
              <div>
                <h3 className="font-display text-sm font-bold tracking-tight uppercase text-neutral-950">
                  Security Challenge
                </h3>
                <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                  Inventory Administration Authorization
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyPasscode} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5">
                  Security Passcode
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full rounded-none border border-neutral-200 bg-neutral-50 py-2.5 px-3 text-xs font-mono tracking-widest text-neutral-900 outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
                />
                {passcodeError && (
                  <p className="text-[10px] font-mono text-rose-600 mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {passcodeError}
                  </p>
                )}
                <p className="text-[9px] text-neutral-400 font-mono mt-2">
                  Enter your secure administrator credential to unlock configuration management.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-black border border-black text-white py-2.5 font-mono text-xs uppercase tracking-widest hover:bg-neutral-900 transition-all cursor-pointer text-center"
                >
                  Unlock Terminal
                </button>
                <button
                  type="button"
                  onClick={() => setIsPasscodeModalOpen(false)}
                  className="border border-neutral-200 bg-white text-neutral-700 py-2.5 px-4 font-mono text-xs uppercase tracking-wider transition-colors hover:bg-neutral-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Privacy and Terms Compliance Modals */}
      <LegalModals
        isOpen={activeLegalModal !== null}
        type={activeLegalModal || 'privacy'}
        onClose={() => setActiveLegalModal(null)}
      />

    </div>
  );
}
