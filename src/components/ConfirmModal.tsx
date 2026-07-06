import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md border border-neutral-200 bg-white p-6 shadow-xl animate-fade-in text-left">
        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute right-4 top-4 text-neutral-400 hover:text-black transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3 mt-1">
          {isDestructive && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-rose-50 border border-rose-100">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
            </div>
          )}
          
          <div className="space-y-1">
            <h3 className="font-display text-xs font-bold tracking-wider uppercase text-neutral-900">
              {title}
            </h3>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 font-mono text-[10px] uppercase tracking-wider">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 border border-neutral-200 bg-white text-neutral-600 hover:text-black hover:border-black transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={async () => {
              await onConfirm();
              onCancel();
            }}
            className={`px-3.5 py-2 text-white transition-colors cursor-pointer ${
              isDestructive 
                ? 'bg-rose-600 hover:bg-rose-700' 
                : 'bg-black hover:bg-neutral-900'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
