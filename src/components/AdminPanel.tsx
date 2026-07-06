import React, { useState, useEffect } from 'react';
import { 
  Plus, Save, Edit3, Trash2, X, Settings, Image as ImageIcon, 
  Upload, HelpCircle, RefreshCw, Key, Check, Phone, FileText, LayoutList, Link,
  MessageSquare, Mail, Archive, CheckCircle
} from 'lucide-react';
import { Product, StoreSettings, ContactMessage } from '../types';
import { 
  addProduct, updateProduct, deleteProduct, updateStoreSettings,
  getContactMessages, updateContactMessageStatus, deleteContactMessage
} from '../lib/storeService';
import ConfirmModal from './ConfirmModal';

interface AdminPanelProps {
  products: Product[];
  settings: StoreSettings;
  onRefresh: () => void;
  onClose: () => void;
  onUpdateSettings: (newSettings: StoreSettings) => void;
}

export default function AdminPanel({
  products,
  settings,
  onRefresh,
  onClose,
  onUpdateSettings
}: AdminPanelProps) {
  // Tabs: 'products' | 'settings' | 'inquiries'
  const [activeTab, setActiveTab] = useState<'products' | 'settings' | 'inquiries'>('products');
  
  // Contact Messages State
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  // Product Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Outerwear');
  const [formCustomCategory, setFormCustomCategory] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formOrderLink, setFormOrderLink] = useState('');
  const [formStatus, setFormStatus] = useState<'available' | 'out_of_stock'>('available');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Global Settings Form State
  const [setPasscode, setSetPasscode] = useState(settings.adminPasscode);
  const [setWhatsappNum, setSetWhatsappNum] = useState(settings.whatsappNumber);
  const [setWhatsappTemp, setSetWhatsappTemp] = useState(settings.whatsappTemplate);
  const [setInsta, setSetInsta] = useState(settings.instagramUrl || '');
  const [setTiktok, setSetTiktok] = useState(settings.tiktokUrl || '');
  const [isSettingsSaving, setIsSettingsSaving] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Custom Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);

  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const fetched = await getContactMessages();
      setMessages(fetched);
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateMessageStatus = async (id: string, status: 'unread' | 'read' | 'archived') => {
    try {
      await updateContactMessageStatus(id, status);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update message status");
    }
  };

  const handleDeleteMessage = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Inquiry Ticket",
      message: "Are you sure you want to permanently delete this customer inquiry ticket? This operation cannot be undone.",
      onConfirm: async () => {
        try {
          await deleteContactMessage(id);
          setMessages(prev => prev.filter(m => m.id !== id));
        } catch (err) {
          console.error("Error deleting message:", err);
          alert("Failed to delete message");
        }
      }
    });
  };

  const handleCopySocialLink = (productId: string) => {
    try {
      let origin = window.location.origin;
      if (origin.includes('ais-dev-')) {
        origin = origin.replace('ais-dev-', 'ais-pre-');
      } else if (origin.includes('-dev-')) {
        origin = origin.replace('-dev-', '-pre-');
      }
      const productUrl = `${origin}/?product=${productId}`;
      navigator.clipboard.writeText(productUrl).then(() => {
        setCopiedId(productId);
        setTimeout(() => setCopiedId(null), 2000);
      });
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  // Categories list
  const standardCategories = ['Outerwear', 'Tops', 'Bottoms', 'Accessories'];

  // Load product to edit
  const handleLoadEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setFormDescription(product.description);
    setFormImageUrl(product.imageUrl);
    setFormOrderLink(product.orderLink || '');
    setFormStatus(product.status);
    
    if (standardCategories.includes(product.category)) {
      setFormCategory(product.category);
      setFormCustomCategory('');
    } else {
      setFormCategory('Custom');
      setFormCustomCategory(product.category);
    }
    setImagePreview(product.imageUrl);
  };

  // Reset Product Form
  const resetProductForm = () => {
    setEditingProduct(null);
    setFormName('');
    setFormPrice('');
    setFormDescription('');
    setFormImageUrl('');
    setFormOrderLink('');
    setFormStatus('available');
    setFormCategory('Outerwear');
    setFormCustomCategory('');
    setImagePreview(null);
  };

  // Handle Optimized Client-Side Image Compression
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas and scale
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress beautifully into high-quality compressed JPEG (0.75 quality)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
          setFormImageUrl(dataUrl);
          setImagePreview(dataUrl);
        }
        setIsCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle Product Form Submit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice || !formImageUrl) {
      alert("Please supply Name, Price, and an Image.");
      return;
    }

    setIsSubmitting(true);
    const finalCategory = formCategory === 'Custom' ? formCustomCategory.trim() : formCategory;
    
    const productPayload = {
      name: formName.trim(),
      price: parseFloat(formPrice) || 0,
      description: formDescription.trim(),
      imageUrl: formImageUrl,
      category: finalCategory || 'General',
      orderLink: formOrderLink.trim() || undefined,
      status: formStatus,
      createdAt: editingProduct ? editingProduct.createdAt : Date.now()
    };

    try {
      if (editingProduct) {
        // Update
        await updateProduct(editingProduct.id, productPayload);
      } else {
        // Add
        await addProduct(productPayload);
      }
      onRefresh();
      resetProductForm();
      alert(editingProduct ? "Product updated successfully!" : "New product added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save product. Please check your network or Firebase rules.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Product Delete
  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Confirm Product Deletion",
      message: "Are you absolutely sure you want to delete this product? This action cannot be undone and will permanently remove it from the catalog.",
      onConfirm: async () => {
        try {
          await deleteProduct(id);
          onRefresh();
          if (editingProduct?.id === id) {
            resetProductForm();
          }
          alert("Product deleted!");
        } catch (err) {
          console.error(err);
          alert("Delete failed.");
        }
      }
    });
  };

  // Handle Settings Submit
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setWhatsappNum.trim()) {
      alert("Please supply a WhatsApp contact number.");
      return;
    }

    setIsSettingsSaving(true);
    const settingsPayload: StoreSettings = {
      adminPasscode: setPasscode.trim() || settings.adminPasscode,
      whatsappNumber: setWhatsappNum.trim(),
      whatsappTemplate: setWhatsappTemp.trim(),
      instagramUrl: setInsta.trim() || undefined,
      tiktokUrl: setTiktok.trim() || undefined
    };

    try {
      await updateStoreSettings(settingsPayload);
      onUpdateSettings(settingsPayload);
      alert("Store configuration updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update store settings.");
    } finally {
      setIsSettingsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-xs cursor-pointer" 
      />

      {/* Slide-over Content Container */}
      <div 
        className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl z-10 border-l border-neutral-200"
      >
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-950 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <Settings className="h-5 w-5 text-neutral-400" />
            <div>
              <h2 className="font-display text-base font-bold tracking-tight uppercase">
                Collection Command Center
              </h2>
              <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                Real-time Catalog & Checkout Configuration
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center border border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'products'
                ? 'border-black text-black font-semibold'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <LayoutList className="h-4 w-4" />
            Products ({products.length})
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'settings'
                ? 'border-black text-black font-semibold'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <Settings className="h-4 w-4" />
            Global Settings
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'inquiries'
                ? 'border-black text-black font-semibold'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Inquiries
            {messages.filter(m => m.status === 'unread').length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[9px] font-mono font-bold bg-rose-500 text-white leading-none">
                {messages.filter(m => m.status === 'unread').length}
              </span>
            )}
          </button>
        </div>

        {/* Core Scrollable Panel Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {activeTab === 'products' && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              
              {/* Product Editor / Form Area */}
              <div className="lg:col-span-12 space-y-6">
                <div className="border border-neutral-200 p-5 bg-neutral-50/50">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
                    <h3 className="font-display text-xs font-bold tracking-wider uppercase text-neutral-800">
                      {editingProduct ? 'Modify Collection Item' : 'Enroll New Product'}
                    </h3>
                    {editingProduct && (
                      <button 
                        onClick={resetProductForm}
                        className="font-mono text-[9px] uppercase tracking-wider text-rose-600 hover:underline"
                      >
                        [Cancel Edit / Reset]
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    {/* Item Name */}
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Code West Cyber hoodie"
                        className="w-full rounded-none border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-900 outline-none focus:border-black"
                      />
                    </div>

                    {/* Price & Category row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                          Price ($ USD) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          placeholder="e.g. 79.99"
                          className="w-full rounded-none border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-900 outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                          Category
                        </label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full rounded-none border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-900 outline-none focus:border-black"
                        >
                          {standardCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          <option value="Custom">Custom...</option>
                        </select>
                      </div>
                    </div>

                    {/* Custom category (conditional) */}
                    {formCategory === 'Custom' && (
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                          Provide Custom Category Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formCustomCategory}
                          onChange={(e) => setFormCustomCategory(e.target.value)}
                          placeholder="e.g. Limited Drops"
                          className="w-full rounded-none border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-900 outline-none focus:border-black"
                        />
                      </div>
                    )}

                    {/* Image Selector / Compression System */}
                    <div className="border border-neutral-200 bg-white p-4">
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-600 mb-2">
                        Product Visual Image Tag *
                      </label>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        {/* Preview */}
                        <div className="sm:col-span-4 aspect-square border border-neutral-100 bg-neutral-50 flex items-center justify-center overflow-hidden relative">
                          {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-neutral-300" />
                          )}
                          {isCompressing && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                              <RefreshCw className="h-4 w-4 animate-spin text-black" />
                            </div>
                          )}
                        </div>

                        {/* File Upload Selector */}
                        <div className="sm:col-span-8 space-y-3">
                          <div className="relative border border-dashed border-neutral-300 bg-neutral-50/50 p-4 text-center cursor-pointer hover:bg-neutral-50 hover:border-black transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="h-5 w-5 text-neutral-400 mx-auto mb-1" />
                            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-600">Select & Compress File</p>
                            <p className="text-[9px] text-neutral-400 mt-0.5">Optimized local encoding preserves limits</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] text-neutral-400 uppercase">Or Paste Link:</span>
                            <input
                              type="text"
                              value={formImageUrl}
                              onChange={(e) => {
                                setFormImageUrl(e.target.value);
                                setImagePreview(e.target.value);
                              }}
                              placeholder="https://images.unsplash.com/photo-..."
                              className="flex-1 rounded-none border border-neutral-200 py-1 px-2 text-[10px] outline-none focus:border-black"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Short description */}
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                        Detailed Description
                      </label>
                      <textarea
                        rows={3}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Highlight details, materials, fabric density, size guides..."
                        className="w-full rounded-none border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-900 outline-none focus:border-black"
                      />
                    </div>

                    {/* Stock status & Custom Order link */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                          Inventory Status
                        </label>
                        <select
                          value={formStatus}
                          onChange={(e) => setFormStatus(e.target.value as 'available' | 'out_of_stock')}
                          className="w-full rounded-none border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-900 outline-none focus:border-black"
                        >
                          <option value="available">In Stock (Available)</option>
                          <option value="out_of_stock">Sold Out</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1">
                          Specific Checkout URL
                          <span title="Optional. Overrides default WhatsApp link for this specific product." className="text-neutral-400 cursor-help">
                            <HelpCircle className="h-3 w-3" />
                          </span>
                        </label>
                        <input
                          type="text"
                          value={formOrderLink}
                          onChange={(e) => setFormOrderLink(e.target.value)}
                          placeholder="e.g. stripe.com checkout..."
                          className="w-full rounded-none border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-900 outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isCompressing}
                      className="w-full bg-black border border-black text-white py-2.5 font-mono text-xs uppercase tracking-widest hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Processing Db Write...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          {editingProduct ? 'Commit Updates' : 'Publish Product to Catalog'}
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Catalog List / Inventory Management */}
                <div className="space-y-3">
                  <h4 className="font-display text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Active Catalog Inventory ({products.length})
                  </h4>

                  <div className="divide-y divide-neutral-100 border border-neutral-200 bg-white">
                    {products.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3.5 hover:bg-neutral-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <img 
                            src={p.imageUrl} 
                            alt={p.name} 
                            className="h-10 w-10 object-cover bg-neutral-100 border border-neutral-200" 
                          />
                          <div>
                            <p className="font-display text-xs font-bold text-neutral-950 uppercase">{p.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 font-mono text-[9px] text-neutral-500">
                              <span>${p.price.toFixed(2)}</span>
                              <span>•</span>
                              <span>{p.category}</span>
                              <span>•</span>
                              <span className={p.status === 'available' ? 'text-green-600' : 'text-rose-500'}>
                                {p.status === 'available' ? 'IN_STOCK' : 'SOLD_OUT'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopySocialLink(p.id)}
                            title="Copy Link for Pinterest/Socials"
                            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-400 text-neutral-600 hover:text-black transition-colors rounded-none font-mono text-[9px] uppercase tracking-wider cursor-pointer"
                          >
                            {copiedId === p.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-600 animate-bounce" />
                                <span className="text-emerald-700 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Link className="h-3 w-3 text-neutral-400" />
                                <span>Copy Social Link</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleLoadEdit(p)}
                            title="Edit"
                            className="p-1.5 border border-neutral-200 hover:bg-white hover:text-black hover:border-black text-neutral-500 transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            title="Delete"
                            className="p-1.5 border border-neutral-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 text-neutral-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              {/* Security Credentials */}
              <div className="border border-neutral-200 p-5 bg-neutral-50/50 space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2.5">
                  <Key className="h-4 w-4 text-neutral-600" />
                  <h4 className="font-display text-xs font-bold uppercase text-neutral-800">
                    Security Credentials
                  </h4>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                    Admin Passcode
                  </label>
                  <div className="relative">
                    <input
                      type={showPasscode ? "text" : "password"}
                      required
                      value={setPasscode}
                      onChange={(e) => setSetPasscode(e.target.value)}
                      placeholder="Enter Admin Passcode"
                      className="w-full rounded-none border border-neutral-200 bg-white py-2 pl-3 pr-20 text-xs font-medium text-neutral-900 outline-none focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="absolute right-2 top-1.5 font-mono text-[9px] uppercase tracking-wider text-neutral-400 hover:text-neutral-950 underline"
                    >
                      {showPasscode ? 'Hide' : 'Reveal'}
                    </button>
                  </div>
                  <p className="text-[9px] text-neutral-400 font-mono mt-1">
                    Passcode required to open this Command Center in the future. Keep this credential highly secure.
                  </p>
                </div>
              </div>

              {/* Order Loop Settings */}
              <div className="border border-neutral-200 p-5 bg-neutral-50/50 space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2.5">
                  <Phone className="h-4 w-4 text-neutral-600" />
                  <h4 className="font-display text-xs font-bold uppercase text-neutral-800">
                    WhatsApp Redirect Loop
                  </h4>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                    WhatsApp Number (with Country Code)
                  </label>
                  <input
                    type="text"
                    required
                    value={setWhatsappNum}
                    onChange={(e) => setSetWhatsappNum(e.target.value)}
                    placeholder="e.g. +2348031234567 or +15550199"
                    className="w-full rounded-none border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-900 outline-none focus:border-black"
                  />
                  <p className="text-[9px] text-neutral-400 font-mono mt-1">
                    Must start with + and country code. This is where orders will land.
                  </p>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                    WhatsApp Order Message Template
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={setWhatsappTemp}
                    onChange={(e) => setSetWhatsappTemp(e.target.value)}
                    placeholder="Provide template"
                    className="w-full rounded-none border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-900 outline-none focus:border-black"
                  />
                  <div className="bg-white border border-neutral-200 p-2.5 font-mono text-[9px] text-neutral-500 space-y-1.5">
                    <span className="font-semibold uppercase tracking-wider block text-neutral-700">Supported Variables:</span>
                    <p>• <code className="text-black font-bold">{'{product_name}'}</code> : Inserts product name</p>
                    <p>• <code className="text-black font-bold">{'{price}'}</code> : Inserts item price ($ USD)</p>
                    <p>• <code className="text-black font-bold">{'{id}'}</code> : Inserts product database identifier</p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="border border-neutral-200 p-5 bg-neutral-50/50 space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2.5">
                  <FileText className="h-4 w-4 text-neutral-600" />
                  <h4 className="font-display text-xs font-bold uppercase text-neutral-800">
                    Social Channels Links
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                      Instagram Link
                    </label>
                    <input
                      type="text"
                      value={setInsta}
                      onChange={(e) => setSetInsta(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full rounded-none border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-900 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                      TikTok Link
                    </label>
                    <input
                      type="text"
                      value={setTiktok}
                      onChange={(e) => setSetTiktok(e.target.value)}
                      placeholder="https://tiktok.com/@..."
                      className="w-full rounded-none border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-900 outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <button
                type="submit"
                disabled={isSettingsSaving}
                className="w-full bg-black border border-black text-white py-3 font-mono text-xs uppercase tracking-widest hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSettingsSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Updating Config...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Save Settings & Sync
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div>
                  <h3 className="font-display text-xs font-bold tracking-wider uppercase text-neutral-800">
                    Customer Inquiry Tickets
                  </h3>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">
                    View and attend to secure contact form inquiries
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchMessages}
                  disabled={isLoadingMessages}
                  className="flex items-center gap-1 px-2.5 py-1.5 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-black transition-colors font-mono text-[9px] uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {isLoadingMessages && messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                  <RefreshCw className="h-6 w-6 animate-spin text-neutral-400" />
                  <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    Polling Firestore...
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <div className="border border-neutral-200 bg-neutral-50/50 p-12 text-center space-y-3">
                  <Mail className="h-8 w-8 text-neutral-300 mx-auto" />
                  <div className="space-y-1">
                    <p className="font-display text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      Inbox Empty
                    </p>
                    <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto leading-relaxed">
                      No customer inquiries have been registered yet. Once submitted via the Contact form, tickets populate here in real-time.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  {messages.map((msg) => {
                    const mailtoUrl = `mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject} - Code West Collections`)}&body=${encodeURIComponent(`Hi ${msg.name},\n\nThank you for reaching out to Code West Collections regarding "${msg.subject}".\n\n[Your Reply Here]\n\nWarm regards,\nCode West Team\n${settings.whatsappNumber}`)}`;
                    
                    return (
                      <div 
                        key={msg.id} 
                        className={`border transition-all duration-300 p-5 bg-white ${
                          msg.status === 'unread' 
                            ? 'border-brand-accent shadow-sm animate-pulse-subtle' 
                            : msg.status === 'archived'
                            ? 'border-neutral-200 opacity-60'
                            : 'border-neutral-200'
                        }`}
                      >
                        {/* Ticket Header */}
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 pb-3 mb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-display text-xs font-bold text-neutral-900 uppercase">
                                {msg.subject}
                              </span>
                              <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                                msg.status === 'unread' 
                                  ? 'bg-brand-accent text-white' 
                                  : msg.status === 'archived'
                                  ? 'bg-neutral-200 text-neutral-600'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}>
                                {msg.status}
                              </span>
                            </div>
                            <div className="font-mono text-[10px] text-neutral-500">
                              From: <span className="text-neutral-800 font-medium">{msg.name}</span> (<a href={`mailto:${msg.email}`} className="underline hover:text-brand-accent">{msg.email}</a>)
                            </div>
                          </div>
                          
                          <div className="font-mono text-[9px] text-neutral-400 text-right">
                            {new Date(msg.createdAt).toLocaleString(undefined, { 
                              month: 'short', 
                              day: 'numeric', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>

                        {/* Ticket Message Body */}
                        <div className="text-xs text-neutral-700 font-light leading-relaxed whitespace-pre-wrap bg-neutral-50 p-3.5 border border-neutral-100 mb-4 font-mono select-text">
                          {msg.message}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3">
                          <div className="flex items-center gap-2">
                            {msg.status === 'unread' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateMessageStatus(msg.id!, 'read')}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-mono text-[9px] uppercase tracking-wider cursor-pointer"
                              >
                                <CheckCircle className="h-3 w-3" />
                                <span>Mark as Attended</span>
                              </button>
                            )}
                            
                            {msg.status === 'read' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateMessageStatus(msg.id!, 'unread')}
                                  className="flex items-center gap-1 px-2.5 py-1.5 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-black transition-colors font-mono text-[9px] uppercase tracking-wider cursor-pointer"
                                >
                                  <span>Mark Unread</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateMessageStatus(msg.id!, 'archived')}
                                  className="flex items-center gap-1 px-2.5 py-1.5 border border-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black transition-colors font-mono text-[9px] uppercase tracking-wider cursor-pointer"
                                >
                                  <Archive className="h-3 w-3 text-neutral-400" />
                                  <span>Archive</span>
                                </button>
                              </>
                            )}

                            {msg.status === 'archived' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateMessageStatus(msg.id!, 'read')}
                                className="flex items-center gap-1 px-2.5 py-1.5 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-black transition-colors font-mono text-[9px] uppercase tracking-wider cursor-pointer"
                              >
                                <span>Restore Ticket</span>
                              </button>
                            )}

                            <a
                              href={mailtoUrl}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-brand-accent text-white hover:bg-black transition-colors font-mono text-[9px] uppercase tracking-widest font-bold cursor-pointer"
                            >
                              <Mail className="h-3 w-3" />
                              <span>Reply via Email</span>
                            </a>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id!)}
                            className="p-1.5 border border-neutral-200 text-neutral-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete inquiry permanently"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {confirmModal && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText="Yes, Delete Permanently"
          cancelText="Cancel"
          isDestructive={true}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

    </div>
  );
}
