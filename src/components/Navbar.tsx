import React, { useState } from 'react';
import { Lock, Unlock, Instagram, Layers, Search, RefreshCw, Smartphone, Truck, Menu, X } from 'lucide-react';

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
  activeTab: 'shop' | 'about' | 'contact' | 'privacy';
  setActiveTab: (tab: 'shop' | 'about' | 'contact' | 'privacy') => void;
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
  onTrackOrderClick,
  activeTab,
  setActiveTab
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'shop', label: 'Shop' },
    { id: 'about', label: 'Our Story' },
    { id: 'contact', label: 'Contact' },
    { id: 'privacy', label: 'Privacy Policy' }
  ] as const;

  const handleTabClick = (tabId: 'shop' | 'about' | 'contact' | 'privacy') => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Branding & Desktop Nav */}
        <div className="flex items-center gap-8 lg:gap-12">
          <div 
            onClick={() => handleTabClick('shop')}
            className="flex flex-col items-start select-none cursor-pointer group"
          >
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-neutral-900 leading-none group-hover:text-neutral-700 transition-colors">
              CODE WEST
            </span>
            <span className="text-[9px] tracking-[0.35em] text-neutral-400 uppercase font-semibold block mt-1.5">
              COLLECTIONS
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 font-mono text-[11px] uppercase tracking-wider font-bold pt-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`transition-colors duration-200 cursor-pointer pb-1 border-b-2 ${
                  activeTab === item.id 
                    ? 'text-black border-black' 
                    : 'text-neutral-400 border-transparent hover:text-black'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Center/Right-ish: Search (Visible on lg+) */}
        <div className="relative hidden max-w-xs flex-1 lg:block lg:max-w-sm mx-4">
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
          {/* Search bar for md and down (but hidden on mobile because of bottom search) */}
          <div className="relative hidden sm:block lg:hidden max-w-[160px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-neutral-400">
              <Search className="h-3 w-3" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-none border border-neutral-200 bg-neutral-50 py-1.5 pl-7 pr-2.5 text-xs font-medium text-neutral-900 placeholder-neutral-400 outline-none transition-all duration-200 focus:border-black focus:bg-white"
            />
          </div>

          {/* Track Order Button */}
          <button
            onClick={onTrackOrderClick}
            title="Track Order Status"
            className="hidden sm:flex h-9 px-3 items-center justify-center gap-1.5 border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-black font-mono text-[10px] uppercase tracking-wider font-semibold"
          >
            <Truck className="h-4 w-4" />
            <span>Track Order</span>
          </button>

          <button
            onClick={onRefresh}
            title="Refresh Catalog"
            className="hidden sm:flex group h-9 w-9 items-center justify-center border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-black"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-45 transition-transform duration-300'}`} />
          </button>

          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="hidden sm:flex h-9 w-9 items-center justify-center border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-black"
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
              className="hidden sm:flex h-9 w-9 items-center justify-center border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-black"
              title="TikTok"
            >
              <Smartphone className="h-4 w-4" />
            </a>
          )}

          <div className="h-4 w-px bg-neutral-200 hidden sm:block"></div>

          {isAdmin ? (
            <div className="hidden sm:flex items-center gap-1.5">
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
              className="hidden sm:flex items-center gap-1.5 border border-black bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-black transition-all hover:bg-black hover:text-white"
            >
              <Lock className="h-3 w-3" />
              Admin Portal
            </button>
          )}

          {/* Mobile Menu Button (Hamburger) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-black"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-6 space-y-6 animate-fade-in shadow-lg">
          <nav className="flex flex-col gap-4 font-mono text-sm uppercase tracking-wider font-bold">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`text-left py-2 border-b border-neutral-100 transition-colors ${
                  activeTab === item.id ? 'text-black font-extrabold' : 'text-neutral-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-100 font-mono text-[11px] uppercase tracking-wider">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onTrackOrderClick();
              }}
              className="flex items-center justify-center gap-2 border border-neutral-200 py-3 text-neutral-700 hover:bg-neutral-50"
            >
              <Truck className="h-4 w-4" />
              Track Order
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onRefresh();
              }}
              className="flex items-center justify-center gap-2 border border-neutral-200 py-3 text-neutral-700 hover:bg-neutral-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="pt-2">
            {isAdmin ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 py-3 font-mono text-xs uppercase tracking-wider text-white"
              >
                <Unlock className="h-4 w-4" />
                Exit Admin Mode
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onAdminClick();
                }}
                className="w-full flex items-center justify-center gap-2 border border-black py-3 font-mono text-xs uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors"
              >
                <Lock className="h-4 w-4" />
                Admin Portal
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Search Bar (Only shown on shop tab when menu is closed) */}
      {!isMobileMenuOpen && activeTab === 'shop' && (
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
      )}
    </header>
  );
}

