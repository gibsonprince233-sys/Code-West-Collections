import React from 'react';
import { ShieldCheck, Lock, Database, EyeOff, FileLock2, ShieldAlert } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="animate-fade-in py-6 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Header section with editorial style typography */}
      <div className="text-center space-y-4 mb-16">
        <span className="font-mono text-[10px] tracking-[0.35em] text-neutral-400 uppercase font-bold block">
          COMPLIANCE & TRUST
        </span>
        <h2 className="font-serif text-4xl sm:text-6xl font-light tracking-tight text-neutral-900 leading-none">
          PRIVACY & <span className="font-semibold italic">DATA PRINCIPLES</span>
        </h2>
        <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mt-2">
          Effective Date: July 5, 2026 | Compliant & Secure
        </p>
        <div className="h-px w-24 bg-black mx-auto mt-6" />
      </div>

      {/* Hero Icon Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        <div className="border border-neutral-200 bg-white p-5 flex flex-col items-center text-center space-y-2">
          <EyeOff className="h-6 w-6 text-neutral-500" />
          <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-neutral-900">Zero Tracking</h4>
          <p className="text-[11px] text-neutral-500 font-light">No unsolicited session analytics, marketing cookies, or third-party advertising scripts are ever loaded.</p>
        </div>
        <div className="border border-neutral-200 bg-white p-5 flex flex-col items-center text-center space-y-2">
          <Database className="h-6 w-6 text-neutral-500" />
          <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-neutral-900">Local Isolation</h4>
          <p className="text-[11px] text-neutral-500 font-light">Your shopping bag, cart contents, and filters are kept localized inside your browser's private state.</p>
        </div>
        <div className="border border-neutral-200 bg-white p-5 flex flex-col items-center text-center space-y-2">
          <FileLock2 className="h-6 w-6 text-neutral-500" />
          <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-neutral-900">Secure Direct Routing</h4>
          <p className="text-[11px] text-neutral-500 font-light">Purchasing and pricing verification is conducted over secure direct messaging channels on WhatsApp.</p>
        </div>
      </div>

      {/* Main Documentation Sections */}
      <div className="border border-neutral-200 bg-white p-8 sm:p-12 space-y-10 text-xs text-neutral-600 font-light leading-relaxed font-mono">
        
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
            <ShieldAlert className="h-4 w-4 text-neutral-900" />
            <h3 className="font-bold text-neutral-900 uppercase text-[11px] tracking-wider">
              1. Information We Collect
            </h3>
          </div>
          <p>
            We value your absolute privacy. Code West Collections does not automatically collect, store, buy, or sell any personal identifying information (PII). The only information processed is the content you explicitly type and transmit when using our contact ticket form or when initiating an order redirect.
          </p>
          <p>
            Your email address, subject line, message body, and order specifications are stored strictly inside our encrypted Google Firebase Firestore instance to enable customer support communication.
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
            <Lock className="h-4 w-4 text-neutral-900" />
            <h3 className="font-bold text-neutral-900 uppercase text-[11px] tracking-wider">
              2. Transaction Processing and WhatsApp
            </h3>
          </div>
          <p>
            When you proceed to checkout, you are redirected securely to WhatsApp or external checkout channels designated by our administrator. All subsequent conversation, payment verification, sizing confirmation, and transaction agreements are conducted directly between you and the Code West administrator.
          </p>
          <p>
            No payment credentials, credit card numbers, or bank routing keys are handled, processed, or saved by our web application container.
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
            <Database className="h-4 w-4 text-neutral-900" />
            <h3 className="font-bold text-neutral-900 uppercase text-[11px] tracking-wider">
              3. Local Storage & Session State
            </h3>
          </div>
          <p>
            To provide a premium customer shopping bag experience, we utilize standard browser local storage keys to save your active items list (`cw_shopping_bag`). This database stays strictly client-side on your local operating machine and is never transmitted to remote tracking servers.
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
            <ShieldCheck className="h-4 w-4 text-neutral-900" />
            <h3 className="font-bold text-neutral-900 uppercase text-[11px] tracking-wider">
              4. Data Deletion Rights
            </h3>
          </div>
          <p>
            If you have submitted a contact ticket form or order information and wish to have all corresponding information permanently deleted from our database collections, please contact us directly via WhatsApp or by submitting a ticket with subject "Technical Website Feedback". We will instantly purge all records.
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
            <FileLock2 className="h-4 w-4 text-neutral-900" />
            <h3 className="font-bold text-neutral-900 uppercase text-[11px] tracking-wider">
              5. Policy Modifications
            </h3>
          </div>
          <p>
            We reserve the right to modify this privacy policy statement at any time. Any changes will become immediately effective upon publishing the updated codebase drops to our production server.
          </p>
        </section>

        <div className="border-t border-neutral-100 pt-6 text-[10px] text-neutral-400 text-center uppercase tracking-widest font-bold">
          CODE WEST COLLECTIONS | COMPLIANCE COMPLETE
        </div>
      </div>

    </div>
  );
}
