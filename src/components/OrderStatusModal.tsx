import React, { useState } from 'react';
import { X, Search, Truck, Package, Clock, CheckCircle2, ShoppingBag } from 'lucide-react';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TrackingStep {
  title: string;
  description: string;
  time: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface MockOrder {
  id: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusText: string;
  date: string;
  items: string[];
  total: number;
  steps: TrackingStep[];
}

export default function OrderStatusModal({ isOpen, onClose }: OrderStatusModalProps) {
  const [orderNumber, setOrderNumber] = useState('');
  const [searchResult, setSearchResult] = useState<MockOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Let's generate a dynamic mock order tracker based on the order number
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const sanitized = orderNumber.trim().toUpperCase();

    if (!sanitized) {
      setErrorMsg('Please enter an order number');
      return;
    }

    // Match or generate a deterministic order based on string content
    const numValue = sanitized.replace(/[^0-9]/g, '');
    const num = numValue ? parseInt(numValue, 10) : 1024;
    
    let status: 'processing' | 'shipped' | 'delivered' = 'processing';
    if (num % 3 === 0) {
      status = 'delivered';
    } else if (num % 3 === 1) {
      status = 'shipped';
    }

    const itemsList = [
      ['Classic Wool Overcoat', 'Cotton Lounge Pants'],
      ['Minimalist Silk Blouse', 'Tailored Pleated Trouser'],
      ['Structured Oversized Blazer', 'Bespoke Knit Cardigan', 'Relaxed Ribbed Dress'],
      ['Cashmere Crewneck Sweater']
    ];

    const itemsSelected = itemsList[num % itemsList.length];
    const totalAmount = itemsSelected.length * 120 + 45;

    // Build timeline steps
    const steps: TrackingStep[] = [
      {
        title: 'Order Confirmed',
        description: 'Your selection was settled and validated with customer service via WhatsApp.',
        time: 'July 01, 2026 - 09:30 AM',
        isCompleted: true,
        isCurrent: status === 'processing'
      },
      {
        title: 'Bespoke Packing & Quality Check',
        description: 'Garments meticulously inspected and packaged in custom biodegradable wrapping.',
        time: 'July 02, 2026 - 11:15 AM',
        isCompleted: status !== 'processing',
        isCurrent: status === 'shipped'
      },
      {
        title: 'Dispatched & Handed to Carrier',
        description: 'In transit via premium global courier. Tracking code: CW-DHL-89028',
        time: 'July 03, 2026 - 03:40 PM',
        isCompleted: status === 'delivered',
        isCurrent: status === 'delivered'
      }
    ];

    const mockOrderResult: MockOrder = {
      id: sanitized.startsWith('CW-') ? sanitized : `CW-${sanitized}`,
      status,
      statusText: status === 'delivered' ? 'Delivered' : status === 'shipped' ? 'In Transit' : 'Processing',
      date: 'July 01, 2026',
      items: itemsSelected,
      total: totalAmount,
      steps
    };

    setSearchResult(mockOrderResult);
    setHasSearched(true);
  };

  const handleReset = () => {
    setSearchResult(null);
    setHasSearched(false);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs cursor-pointer"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg border border-neutral-100 bg-white p-6 shadow-2xl z-10 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center border border-neutral-200 bg-white text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-black"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4 mb-6">
          <Truck className="h-5 w-5 text-neutral-900" />
          <div>
            <h3 className="font-serif text-lg font-semibold text-neutral-900">
              Track Order Status
            </h3>
            <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-semibold">
              Live Shipment & Order Verification
            </p>
          </div>
        </div>

        {/* Form area */}
        {!hasSearched ? (
          <form onSubmit={handleSearch} className="space-y-4">
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Enter the unique reference code provided during checkout (e.g. <span className="font-mono font-medium text-neutral-950">CW-1024</span> or any number) to review your package's current dispatch status.
            </p>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5 font-semibold">
                Order Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. CW-1024"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full rounded-none border border-neutral-200 bg-neutral-50 py-3 pl-3 pr-10 text-xs font-mono uppercase tracking-wider text-neutral-900 outline-none focus:border-black focus:bg-white"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400">
                  <Search className="h-4 w-4" />
                </div>
              </div>
              {errorMsg && (
                <p className="text-[10px] font-sans text-rose-600 mt-1.5">
                  {errorMsg}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-black text-white py-3 font-mono text-xs uppercase tracking-widest hover:bg-neutral-900 transition-colors cursor-pointer font-semibold"
              >
                Query Status
              </button>
              <button
                type="button"
                onClick={onClose}
                className="border border-neutral-200 bg-white text-neutral-700 py-3 px-6 font-sans text-xs uppercase tracking-wider transition-colors hover:bg-neutral-50 font-medium"
              >
                Close
              </button>
            </div>
          </form>
        ) : (
          /* Results Area */
          <div className="space-y-5">
            <div className="bg-neutral-50 p-4 border border-neutral-100 flex items-center justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Reference Number</p>
                <p className="font-mono text-sm font-semibold text-neutral-900 mt-0.5">{searchResult?.id}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Order Status</p>
                <span className={`inline-block font-sans text-[10px] uppercase font-semibold px-2 py-0.5 mt-1 border ${
                  searchResult?.status === 'delivered' 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : searchResult?.status === 'shipped' 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}>
                  {searchResult?.statusText}
                </span>
              </div>
            </div>

            {/* Items details */}
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">Items in Parcel</p>
              <div className="text-xs text-neutral-700 space-y-1 font-light bg-neutral-50/50 p-3 border border-neutral-100">
                {searchResult?.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 bg-neutral-400 rounded-full" />
                    <span>{item}</span>
                  </div>
                ))}
                <div className="border-t border-neutral-100 pt-1.5 mt-1.5 flex justify-between font-mono text-[10px] text-neutral-500 uppercase">
                  <span>Est. Value</span>
                  <span className="font-semibold text-neutral-900">${searchResult?.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-4">Tracking Timeline</p>
              <div className="relative pl-6 space-y-6">
                {/* Visual Line */}
                <div className="absolute top-1 bottom-1 left-2.5 w-px bg-neutral-200" />

                {searchResult?.steps.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle Node */}
                    <span className={`absolute -left-[21px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white border ${
                      step.isCompleted 
                        ? 'border-neutral-900 text-neutral-950 bg-neutral-50' 
                        : 'border-neutral-200 text-neutral-300'
                    }`}>
                      {step.isCompleted ? (
                        <CheckCircle2 className="h-3 w-3 text-black" />
                      ) : (
                        <Clock className="h-3 w-3 text-neutral-400" />
                      )}
                    </span>

                    <div>
                      <h4 className={`text-xs font-semibold leading-none ${step.isCompleted ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        {step.title}
                      </h4>
                      <p className="text-[10px] text-neutral-500 font-light mt-1 leading-relaxed">
                        {step.description}
                      </p>
                      <p className="font-mono text-[8px] text-neutral-400 uppercase mt-0.5 font-semibold">
                        {step.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-black text-white py-3 font-mono text-xs uppercase tracking-widest hover:bg-neutral-900 transition-colors cursor-pointer font-semibold"
              >
                Track Another Order
              </button>
              <button
                type="button"
                onClick={onClose}
                className="border border-neutral-200 bg-white text-neutral-700 py-3 px-6 font-sans text-xs uppercase tracking-wider transition-colors hover:bg-neutral-50 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
