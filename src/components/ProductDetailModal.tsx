import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Link, Check, Share2, ExternalLink } from 'lucide-react';
import { Product, StoreSettings } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  settings: StoreSettings;
  onClose: () => void;
  onAddToBag: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  settings,
  onClose,
  onAddToBag
}: ProductDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const isAvailable = product.status === 'available';

  const getShareableUrl = (id: string) => {
    let origin = window.location.origin;
    if (origin.includes('ais-dev-')) {
      origin = origin.replace('ais-dev-', 'ais-pre-');
    } else if (origin.includes('-dev-')) {
      origin = origin.replace('-dev-', '-pre-');
    }
    return `${origin}/?product=${id}`;
  };

  const productUrl = getShareableUrl(product.id);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(productUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const pinterestShareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&media=${encodeURIComponent(product.imageUrl || '')}&description=${encodeURIComponent(product.name + ' - ' + product.description)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs cursor-pointer"
      />

      {/* Modal Window */}
      <div
        className="relative w-full max-w-4xl border border-neutral-100 bg-white shadow-2xl overflow-hidden z-10"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center border border-neutral-200 bg-white text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-black"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Premium Zoomable Product Image */}
          <div className="relative aspect-[4/5] md:aspect-auto md:h-[520px] bg-neutral-50 border-r border-neutral-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute top-4 left-4">
              <span className="bg-black/95 backdrop-blur-xs text-white font-mono text-[10px] uppercase tracking-[0.15em] px-3.5 py-1.5 font-semibold">
                {product.category}
              </span>
            </div>
          </div> 
          
          {/* Right: Specifications & Info */}
          <div className="p-6 md:p-8 flex flex-col justify-between h-full md:h-[520px] overflow-y-auto">
            <div>
              {/* Top Row: Cancel/Close actions */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-black font-bold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cancel & Go Back
                </button>
                <button
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-black transition-all cursor-pointer"
                  title="Cancel and close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Meta details */}
              <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-4 mb-5">
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-400 font-semibold">
                  STYLE REF: CW-{(product.id || 'new').substring(0, 6).toUpperCase()}
                </span>
                
                {isAvailable ? (
                  <span className="text-green-600 font-sans text-xs uppercase tracking-wider flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    In Stock
                  </span>
                ) : (
                  <span className="text-rose-600 font-sans text-xs uppercase tracking-wider flex items-center gap-1.5 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    Currently Out of Stock
                  </span>
                )}
              </div>

              {/* Name */}
              <h2 className="font-serif text-3xl font-medium text-neutral-900 tracking-tight mb-2 leading-tight">
                {product.name}
              </h2>

              {/* Price tag */}
              <div className="font-sans text-2xl font-semibold text-neutral-900 mb-6">
                ${product.price.toFixed(2)}
              </div>

              {/* Core description */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-400">
                  Product Details
                </h4>
                <p className="text-neutral-600 text-xs font-light leading-relaxed">
                  {product.description || "No product description or technical details have been supplied for this collection item."}
                </p>
              </div>
            </div>

            {/* Action area */}
            <div className="mt-8 pt-6 border-t border-neutral-100 space-y-4">
              {product.orderLink && (
                <div className="bg-neutral-50 p-3 border border-neutral-100 flex items-start gap-2.5">
                  <ArrowRight className="h-4 w-4 text-neutral-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 font-medium">Custom Order Link Configured</p>
                    <p className="text-[10px] text-neutral-500 font-light mt-0.5">This product points directly to: <span className="underline break-all">{product.orderLink}</span></p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                 {product.orderLink && product.orderLink.trim() !== '' ? (
                  <a
                    href={product.orderLink.startsWith('http') ? product.orderLink : `https://${product.orderLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-black border border-black text-white py-3.5 font-sans text-xs uppercase tracking-widest hover:bg-neutral-950 transition-all cursor-pointer font-bold text-center"
                  >
                    Buy From Affiliate Link ↗
                  </a>
                ) : (
                  <div className="w-full border border-dashed border-neutral-300 py-3.5 text-center font-mono text-[10px] uppercase text-neutral-400">
                    Product Purchase Link Pending
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="w-full border border-neutral-200 bg-white text-neutral-700 py-3.5 px-6 font-sans text-xs uppercase tracking-widest transition-colors hover:bg-neutral-50 font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cancel & Go Back
                </button>
              </div>

              {/* Share & Save on Pinterest / Socials Section */}
              <div className="border-t border-neutral-100 pt-4 mt-2">
                <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 font-semibold mb-2 text-center">
                  Direct Product Link
                </p>
                <div className="flex items-center gap-1.5 mb-2 bg-neutral-50 border border-neutral-200 p-1 rounded-sm">
                  <input
                    type="text"
                    readOnly
                    value={productUrl}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    className="flex-1 bg-transparent border-none text-[10px] font-mono text-neutral-600 px-2 outline-none select-all overflow-ellipsis"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-white border border-neutral-200 hover:border-black text-neutral-800 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider transition-all font-bold cursor-pointer shrink-0 rounded-sm"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <a
                    href={productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black hover:bg-neutral-900 text-white px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider transition-all font-bold cursor-pointer shrink-0 rounded-sm text-center flex items-center gap-1 justify-center"
                  >
                    Open
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-[8px] font-mono text-neutral-400 text-center leading-normal mb-3 max-w-[280px] mx-auto uppercase">
                  💡 Note: Share this direct link with customers to direct them straight to this featured item.
                </p>

                <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 font-semibold mb-2.5 text-center">
                  Share & Save Product
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 py-2 px-3 font-mono text-[10px] uppercase tracking-wider transition-all font-semibold cursor-pointer"
                    title="Copy direct product link to clipboard"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600 animate-bounce" /> : <Link className="h-3.5 w-3.5 text-neutral-500" />}
                    {copied ? "Link Copied!" : "Copy Link"}
                  </button>
                  <a
                    href={pinterestShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 py-2 px-3 font-mono text-[10px] uppercase tracking-wider transition-all font-semibold cursor-pointer"
                    title="Save this design directly to Pinterest"
                  >
                    <Share2 className="h-3.5 w-3.5 text-rose-600" />
                    Pin on Pinterest
                  </a>
                </div>
              </div>

              <p className="text-[9px] text-neutral-400 font-sans text-center font-light pt-2">
                Securely complete your purchase directly via the product's custom checkout or affiliate link.
              </p>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

