import React from 'react';
import { Sparkles, Cpu, Compass, ShoppingBag } from 'lucide-react';

interface AboutPageProps {
  onBackToShop: () => void;
}

export default function AboutPage({ onBackToShop }: AboutPageProps) {
  return (
    <div className="animate-fade-in py-6 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header section with editorial style typography */}
      <div className="text-center space-y-4 mb-16">
        <span className="font-mono text-[10px] tracking-[0.35em] text-neutral-400 uppercase font-bold block">
          WHO WE ARE
        </span>
        <h2 className="font-serif text-4xl sm:text-6xl font-light tracking-tight text-neutral-900 leading-none">
          THE ART OF <span className="font-semibold italic">CODE & COTTON</span>
        </h2>
        <div className="h-px w-24 bg-black mx-auto mt-6" />
      </div>


      {/* Two-column Hero Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-20">
        <div className="md:col-span-7 space-y-6">
          <h3 className="font-serif text-2xl font-bold text-neutral-950 uppercase tracking-tight">
            ESTABLISHED AT THE INTERSECTION OF ENGINEERING AND MODERN APPAREL.
          </h3>
          <p className="text-sm text-neutral-600 leading-relaxed font-light">
            Founded in 2026, <strong className="font-semibold text-neutral-900">Code West Collections</strong> was born from a simple but powerful realization: the structural discipline of software engineering and the physical craftsmanship of high-end tailoring share a singular soul—precision.
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed font-light">
            We don’t just sketch patterns; we compile garments. Every fabric choice is a variable carefully considered for comfort, durability, and texture. Every fit, cut, and graphic detail represents a deliberate architectural decision to ensure effortless daily utility.
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed font-light">
            Our limited design drops focus on heavyweight, durable technical fabrics that maintain structure, feel luxury to the skin, and remain locked in with your active, creative flow.
          </p>
        </div>
        
        <div className="md:col-span-5 relative">
          <div className="border border-neutral-200 p-3 bg-white shadow-lg">
            <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
              <img 
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80" 
                alt="High-end tailoring close up" 
                className="w-full h-full object-cover filter grayscale contrast-110 hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="flex justify-between items-center mt-3 font-mono text-[9px] text-neutral-400 uppercase">
              <span>Studio Workspace</span>
              <span>Bespoke 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Philosophies (Grid of Cards) */}
      <div className="border-t border-b border-neutral-200 py-16 mb-20">
        <div className="text-center mb-12">
          <h4 className="font-mono text-xs uppercase tracking-widest font-bold text-neutral-900 mb-2">
            OUR DEPLOYMENT PRINCIPLES
          </h4>
          <p className="text-xs text-neutral-500 font-light">
            The core methodologies embedded in every single garment release.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="space-y-4 p-6 border border-neutral-100 bg-white hover:border-black transition-all duration-300">
            <div className="h-10 w-10 bg-neutral-950 text-white flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
            <h5 className="font-serif text-sm font-bold text-neutral-950 uppercase tracking-wider">
              Technical Geometry
            </h5>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              We focus on clean visual lines and modern oversized structures, engineered to provide complete freedom of movement without losing elegant definition.
            </p>
          </div>

          <div className="space-y-4 p-6 border border-neutral-100 bg-white hover:border-black transition-all duration-300">
            <div className="h-10 w-10 bg-neutral-950 text-white flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <h5 className="font-serif text-sm font-bold text-neutral-950 uppercase tracking-wider">
              Optimal Sourcing
            </h5>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              From organic heavyweight cottons to waterproof tactical nylon blends, our materials are hand-selected from sustainable, luxury weavers globally.
            </p>
          </div>

          <div className="space-y-4 p-6 border border-neutral-100 bg-white hover:border-black transition-all duration-300">
            <div className="h-10 w-10 bg-neutral-950 text-white flex items-center justify-center">
              <Compass className="h-5 w-5" />
            </div>
            <h5 className="font-serif text-sm font-bold text-neutral-950 uppercase tracking-wider">
              Direct Connection
            </h5>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              No middle-men markups. We launch our limited design drops directly to you, securing delivery loops instantly via conversation-focused sales channels.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="bg-black text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-400">
            READY TO LEVEL UP YOUR DAILY APPAREL
          </span>
          <h4 className="font-serif text-2xl sm:text-3xl font-light tracking-tight leading-none text-white">
            EXPLORE THE ACTIVE <span className="font-semibold italic">RELEASE DROPS</span>
          </h4>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Our inventory is curated in extremely restricted volumes. Take a look at our current summer designs before they go out of stock.
          </p>
        </div>
        
        <button
          onClick={onBackToShop}
          className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 border border-white bg-white text-black hover:bg-neutral-900 hover:text-white px-8 py-3.5 font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer"
        >
          <ShoppingBag className="h-4 w-4" />
          Browse Catalogue
        </button>
      </div>

    </div>
  );
}
