import React, { useState } from 'react';
import { ShoppingBag, Edit3, Trash2, AlertCircle, CheckCircle2, Link, Check, Share2 } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: any;
  product: Product;
  isAdmin: boolean;
  onEdit: (product: Product) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onAddToBag: (product: Product) => void | Promise<void>;
  onViewDetails: (product: Product) => void | Promise<void>;
}

export default function ProductCard({
  product,
  isAdmin,
  onEdit,
  onDelete,
  onAddToBag,
  onViewDetails
}: ProductCardProps) {
  const [copied, setCopied] = useState(false);
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

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(productUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div 
      className="group relative flex flex-col border border-neutral-200 bg-white"
    >
      {/* Category & Status Overlay Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        <span className="bg-black/90 backdrop-blur-xs text-white font-mono text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 font-semibold">
          {product.category}
        </span>
        {isAvailable ? (
          <span className="bg-white/95 backdrop-blur-xs text-neutral-800 border border-neutral-200/60 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 flex items-center gap-1 font-medium">
            <CheckCircle2 className="h-2.5 w-2.5 text-green-600" />
            In Stock
          </span>
        ) : (
          <span className="bg-rose-50/95 backdrop-blur-xs text-rose-800 border border-rose-100/60 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 flex items-center gap-1 font-medium">
            <AlertCircle className="h-2.5 w-2.5 text-rose-500" />
            Sold Out
          </span>
        )}
      </div>

      {/* Quick Share button on top right */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleCopyLink}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 border border-neutral-200/60 shadow-xs text-neutral-600 hover:text-black hover:bg-white transition-all cursor-pointer"
          title={copied ? "Link copied!" : "Copy direct product link to share"}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Link className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Image Area */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-50 cursor-pointer"
      >
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-5">
        {/* Name and Price row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 
            onClick={() => onViewDetails(product)}
            className="font-serif text-sm font-medium text-neutral-900 line-clamp-1 cursor-pointer hover:underline"
          >
            {product.name}
          </h3>
          <span className="font-sans text-sm font-semibold text-neutral-900 whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-[11px] text-neutral-500 font-light leading-relaxed line-clamp-2 mb-4 flex-1">
          {product.description || "No description provided."}
        </p>

        {/* Buttons / Actions */}
        <div className="space-y-3 mt-auto">
          {isAdmin ? (
            <div className="grid grid-cols-2 gap-2 border-t border-neutral-100 pt-3">
              <button
                onClick={() => onEdit(product)}
                className="flex items-center justify-center gap-1 border border-neutral-200 bg-neutral-50 py-1.5 font-mono text-[10px] uppercase tracking-wider text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="flex items-center justify-center gap-1 border border-rose-100 bg-rose-50/50 py-1.5 font-mono text-[10px] uppercase tracking-wider text-rose-700 transition-colors hover:bg-rose-50 hover:text-rose-900"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          ) : product.orderLink && product.orderLink.trim() !== '' ? (
            <a
              href={product.orderLink.startsWith('http') ? product.orderLink : `https://${product.orderLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 border py-2.5 font-sans text-xs uppercase tracking-widest bg-black border-black text-white hover:bg-neutral-950 cursor-pointer font-bold transition-all text-center"
            >
              Buy Now ↗
            </a>
          ) : (
            <button
              onClick={() => onViewDetails(product)}
              className="w-full flex items-center justify-center gap-2 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 py-2.5 font-sans text-xs uppercase tracking-widest transition-all duration-200 font-semibold cursor-pointer"
            >
              View Details
            </button>
          )}

          <button 
            onClick={() => onViewDetails(product)}
            className="w-full text-center font-serif text-[11px] italic text-neutral-400 hover:text-neutral-950 transition-colors pt-1"
          >
            Show full specifications
          </button>
        </div>
      </div>
    </div>
  );
}

