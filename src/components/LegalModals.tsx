import React from 'react';
import { X, ShieldAlert, FileText } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export default function LegalModals({ isOpen, onClose, type }: LegalModalProps) {
  if (!isOpen) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs cursor-pointer animate-fade-in"
      />

      {/* Content Card */}
      <div
        className="relative w-full max-w-2xl border border-neutral-800 bg-white p-6 sm:p-8 shadow-2xl z-10 max-h-[85vh] flex flex-col justify-between"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center border border-neutral-200 bg-white text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-black cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-5 shrink-0">
          {isPrivacy ? (
            <ShieldAlert className="h-5 w-5 text-neutral-900" />
          ) : (
            <FileText className="h-5 w-5 text-neutral-900" />
          )}
          <div>
            <h3 className="font-display text-sm font-bold tracking-tight uppercase text-neutral-950">
              {isPrivacy ? "Privacy Policy" : "Terms & Conditions"}
            </h3>
            <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
              Code West Collections // Legal & Compliance
            </p>
          </div>
        </div>

        {/* Policy Content */}
        <div className="flex-1 overflow-y-auto pr-2 text-xs text-neutral-600 font-light space-y-4 leading-relaxed font-mono">
          {isPrivacy ? (
            <>
              <p className="font-bold text-neutral-900 uppercase text-[10px]">1. Information We Collect</p>
              <p>
                We value your absolute privacy. Code West Collections does not collect, store, or sell any personal identifying information except what you explicitly provide when placing an order. Your transaction details, items of interest, and custom WhatsApp messages are processed purely client-side to compose checkout links.
              </p>

              <p className="font-bold text-neutral-900 uppercase text-[10px]">2. WhatsApp and External Links</p>
              <p>
                When you proceed to checkout, you are redirected securely to WhatsApp or external checkout channels designated by our administrator. All subsequent conversation and transaction agreements are conducted directly between you and the administrator.
              </p>

              <p className="font-bold text-neutral-900 uppercase text-[10px]">3. Local Storage & Session State</p>
              <p>
                To provide a high-end customer cart experience, we utilize standard browser local storage to save your selected shopping bag items (`cw_shopping_bag`). This data remains completely private inside your browser instance and is never transmitted to remote trackers.
              </p>

              <p className="font-bold text-neutral-900 uppercase text-[10px]">4. Changes to This Privacy Policy</p>
              <p>
                We reserve the right to modify this privacy statement at any time to reflect updates in our operations or third-party service alignments.
              </p>
            </>
          ) : (
            <>
              <p className="font-bold text-neutral-900 uppercase text-[10px]">1. Agreement of Terms</p>
              <p>
                By visiting, accessing, or placing orders via Code West Collections, you declare complete compliance with these terms and conditions. If you do not agree with any of these terms, please do not use this boutique platform.
              </p>

              <p className="font-bold text-neutral-900 uppercase text-[10px]">2. Catalog Integrity & Pricing</p>
              <p>
                All drops, fabric descriptions, pricing, and availability listed in the live catalog are subject to change without notice. While we strive for extreme precision, typographical or inventory synchronization errors may occur.
              </p>

              <p className="font-bold text-neutral-900 uppercase text-[10px]">3. Custom Orders and Purchases</p>
              <p>
                Placing an item in your shopping bag does not reserve the item. Orders are only formalized and settled when you finalize communication over WhatsApp or through designated direct checkout buttons. All payments are verified manually by Code West admin before dispatch.
              </p>

              <p className="font-bold text-neutral-900 uppercase text-[10px]">4. Intellectual Property</p>
              <p>
                The designs, custom-tailored graphics, typography pairings, brand assets, and content displayed on this site are the exclusive property of Code West Collections. Unauthorized reproduction is strictly forbidden.
              </p>
            </>
          )}
          <div className="border-t border-neutral-100 pt-3 text-[9px] text-neutral-400 text-right uppercase">
            Effective Date: July 5, 2026
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 border-t border-neutral-100 pt-4 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-black text-white py-2 px-6 font-mono text-xs uppercase tracking-widest hover:bg-neutral-900 transition-all cursor-pointer rounded-none"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
