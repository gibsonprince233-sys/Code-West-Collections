import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem, StoreSettings } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  settings: StoreSettings;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  settings
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // Filter items that have an orderLink
    const itemsWithLinks = cartItems.filter(item => item.product.orderLink && item.product.orderLink.trim() !== '');

    if (itemsWithLinks.length > 0) {
      if (itemsWithLinks.length === 1) {
        const link = itemsWithLinks[0].product.orderLink!;
        const url = link.startsWith('http://') || link.startsWith('https://') ? link : `https://${link}`;
        const win = window.open(url, '_blank');
        if (!win) {
          alert("Your browser blocked the popup. Please enable popups or click the 'Buy Direct' link next to the product in your bag.");
        }
      } else {
        // Multiple items: attempt to open all
        let blocked = false;
        itemsWithLinks.forEach((item) => {
          const link = item.product.orderLink!;
          const url = link.startsWith('http://') || link.startsWith('https://') ? link : `https://${link}`;
          const win = window.open(url, '_blank');
          if (!win) {
            blocked = true;
          }
        });
        if (blocked) {
          alert("Some popups were blocked by your browser. Please enable popups or click the 'Buy Direct' link next to the products in your bag.");
        }
      }
    } else {
      // Fallback if no specific links are configured
      alert("No direct order or affiliate links are configured for the items in your bag. Please add products that have an order link configured in the admin panel.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div
          className="w-screen max-w-md bg-white flex flex-col shadow-2xl h-full border-l border-neutral-100"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="h-5 w-5 text-neutral-900" />
              <h2 className="font-serif text-lg font-semibold text-neutral-900">Your Shopping Bag</h2>
              <span className="font-mono text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full font-medium">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 -mr-1.5 text-neutral-400 hover:text-neutral-950 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="h-16 w-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="h-7 w-7 text-neutral-300" />
                </div>
                <h3 className="font-serif text-base font-semibold text-neutral-900">Your bag is empty</h3>
                <p className="text-neutral-400 text-xs font-light mt-1 max-w-xs">Items added to your shopping bag will appear here.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                  <div className="h-20 w-16 overflow-hidden bg-neutral-50 border border-neutral-100 shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif text-sm font-medium text-neutral-900 line-clamp-1">{item.product.name}</h4>
                        <span className="font-sans text-sm font-semibold text-neutral-900 whitespace-nowrap">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">{item.product.category}</p>
                      {item.product.orderLink && (
                        <div className="mt-1">
                          <a
                            href={item.product.orderLink.startsWith('http') ? item.product.orderLink : `https://${item.product.orderLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[9px] text-neutral-900 hover:text-black underline uppercase tracking-wider font-semibold bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded-sm"
                          >
                            Buy Direct ↗
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-neutral-200">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-neutral-50 text-neutral-500 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2.5 font-mono text-xs font-medium text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-neutral-50 text-neutral-500 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-neutral-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-6 space-y-4">
              <div className="flex items-center justify-between text-neutral-900">
                <span className="font-serif text-sm font-medium text-neutral-600">Subtotal</span>
                <span className="font-mono text-base font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-neutral-400 leading-relaxed font-light">
                Clicking checkout will redirect you directly to the secure product page or affiliate store link configured for each item in your bag.
              </p>
              
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-black hover:bg-neutral-950 text-white font-mono text-xs uppercase tracking-widest py-3.5 transition-all cursor-pointer"
              >
                Go to Affiliate / Store Link
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
