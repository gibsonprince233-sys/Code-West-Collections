import React, { useState } from 'react';
import { Lock, Unlock, Instagram, Layers, Search, RefreshCw, Smartphone, Truck } from 'lucide-react';

interface NavbarProps {
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  instagramUrl?: string;
  tiktokUrl?: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  onTrackOrderClick: () => void;
}

export default function Navbar({
  isAdmin,
  onAdminClick,
  onLogout,
  searchQuery,
  setSearchQuery,
  instagramUrl,
  tiktokUrl,
  onRefresh,
  isRefreshing,
  onTrackOrderClick
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Branding */}
        <div className="flex flex-col items-start select-none">
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-neutral-900 leading-none">
            CODE WEST
          </span>
          <span className="text-[9px] tracking-[0.35em] text-neutral-400 uppercase font-semibold block mt-1.5">
            COLLECTIONS
          </span>
        </div>

        {/* Center: Search (Visible on md+) */}
        <div className="relative hidden max-w-xs flex-1 sm:block md:max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-none border border-neutral-200 bg-neutral-50 py-1.5 pl-9 pr-4 text-xs font-medium text-neutral-900 placeholder-neutral-400 outline-none transition-all duration-200 focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Right: Controls & Social */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Track Order Button */}
          <button
            onClick={onTrackOrderClick}
            title="Track Order Status"
            className="flex h-9 px-3 items-center justify-center gap-1.5 border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-black font-mono text-[10px] uppercase tracking-wider font-semibold"
          >
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Track Order</span>
          </button>

          <button
            onClick={onRefresh}
            title="Refresh Catalog"
            className="group flex h-9 w-9 items-center justify-center border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-black"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-45 transition-transform duration-300'}`} />
          </button>

          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-black"
              title="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
          )}


          {tiktokUrl && (
            <a
              href={tiktokUrl}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-black"
              title="TikTok"
            >
              {/* Simple phone icon for TikTok style */}
              <Smartphone className="h-4 w-4" />
            </a>
          )}

          <div className="h-4 w-px bg-neutral-200 hidden sm:block"></div>

          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <span className="hidden font-mono text-[10px] uppercase tracking-wider text-green-600 sm:inline-block">
                ● Admin Mode
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white transition-all hover:bg-neutral-800"
              >
                <Unlock className="h-3 w-3" />
                Exit Admin
              </button>
            </div>
          ) : (
            <button
              onClick={onAdminClick}
              className="flex items-center gap-1.5 border border-black bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-black transition-all hover:bg-black hover:text-white"
            >
              <Lock className="h-3 w-3" />
              Admin Portal
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="border-t border-neutral-100 bg-white p-3 sm:hidden">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-none border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-4 text-xs font-medium text-neutral-900 outline-none focus:border-black focus:bg-white"
          />
        </div>
      </div>
    </header>
  );
}
