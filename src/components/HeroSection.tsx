import React from 'react';
import { SlidersHorizontal, ShieldCheck, Globe, Star } from 'lucide-react';

interface HeroSectionProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  productCount: number;
}

export default function HeroSection({
  categories,
  selectedCategory,
  setSelectedCategory,
  productCount
}: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-neutral-950 text-white">
      {/* Editorial campaign background image with soft vignette */}
      <div className="absolute inset-0 opacity-25">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=60&fm=webp" 
          alt="Editorial Fashion Campaign" 
          className="h-full w-full object-cover object-center filter grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/40" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Premium Editorial Context */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 border border-neutral-800 bg-neutral-900/60 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-300">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
              Summer 2026 Editorial Drop
            </div>
            
            <div className="space-y-4">
              <h1 className="hero-title font-serif text-5xl font-extralight tracking-tight sm:text-7xl leading-[1.05]">
                DEFINING<br />
                <span className="font-semibold italic text-neutral-100">
                  MODERN COMFORT
                </span>
              </h1>
              <p className="max-w-md text-sm text-neutral-400 font-light leading-relaxed">
                Premium high-end bespoke garments designed for effortless daily wear. Combining high-quality breathable fabrics with modern structural tailoring.
              </p>
            </div>

            {/* Premium features badge group */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 border border-neutral-800 bg-neutral-900/40 px-4 py-3">
                <ShieldCheck className="h-4 w-4 text-neutral-400" />
                <div>
                  <p className="font-serif text-xs font-semibold leading-none text-neutral-100">Premium Fabrics</p>
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider mt-1">100% Quality Guarantees</p>
                </div>
              </div>
              <div className="flex items-center gap-2 border border-neutral-800 bg-neutral-900/40 px-4 py-3">
                <Globe className="h-4 w-4 text-neutral-400" />
                <div>
                  <p className="font-serif text-xs font-semibold leading-none text-neutral-100">Global Despatch</p>
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider mt-1">Direct-to-Door Delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-2 border border-neutral-800 bg-neutral-900/40 px-4 py-3">
                <Star className="h-4 w-4 text-neutral-400" />
                <div>
                  <p className="font-serif text-xs font-semibold leading-none text-neutral-100">Limited Editions</p>
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider mt-1">Bespoke Production Drops</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High Fashion Editorial Campaign Box */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div 
              className="w-full max-w-sm border border-neutral-800 bg-neutral-900/40 backdrop-blur-md p-4 relative group"
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-800 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=60&fm=webp" 
                  alt="Summer Campaign" 
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex justify-between items-center border-t border-neutral-800 pt-3">
                <span className="font-serif text-xs text-neutral-300 italic">Code West Collections</span>
                <span className="text-[9px] tracking-widest text-neutral-500 uppercase">Season Drop 01</span>
              </div>
            </div>
          </div>

        </div>

        {/* Categories Tab Bar */}
        <div className="mt-16 border-t border-neutral-900 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-400" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-400">Filter Collections:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-semibold'
                    : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

