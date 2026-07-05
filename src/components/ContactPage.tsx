import React, { useState } from 'react';
import { Send, CheckCircle, Mail, MessageSquare, PhoneCall, ArrowRight, Instagram, ShieldCheck } from 'lucide-react';
import { submitContactMessage } from '../lib/storeService';
import { StoreSettings } from '../types';

interface ContactPageProps {
  settings: StoreSettings;
  onBackToShop: () => void;
}

export default function ContactPage({ settings, onBackToShop }: ContactPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await submitContactMessage({
        name,
        email,
        subject,
        message,
      });
      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setSubject('General Inquiry');
      setMessage('');
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred. Please try again or reach out directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppHref = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^\d+]/g, '');
    const text = encodeURIComponent("Hello Code West team! I'm coming from the online contact page and wanted to discuss code/apparel items...");
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };

  return (
    <div className="animate-fade-in py-6 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header section with editorial style typography */}
      <div className="text-center space-y-4 mb-16">
        <span className="font-mono text-[10px] tracking-[0.35em] text-neutral-400 uppercase font-bold block">
          GET IN TOUCH
        </span>
        <h2 className="font-serif text-4xl sm:text-6xl font-light tracking-tight text-neutral-900 leading-none">
          ESTABLISH A <span className="font-semibold italic">COMMUNICATION LOOP</span>
        </h2>
        <div className="h-px w-24 bg-black mx-auto mt-6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Instant WhatsApp Channels & Social Metadata */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
          <div className="border border-neutral-200 bg-white p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-xl font-bold text-neutral-950 uppercase tracking-tight pb-3 border-b border-neutral-100">
              Direct Channels
            </h3>
            
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Skip the forms and start chatting instantly. Our support staff and designers are active on conversational tools to settle orders, sizing inquiries, and customized prints in real-time.
            </p>

            <div className="space-y-4 pt-2">
              {/* WhatsApp Option */}
              <a 
                href={getWhatsAppHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-500 transition-all duration-300"
              >
                <div className="h-10 w-10 shrink-0 rounded-none bg-emerald-600 text-white flex items-center justify-center">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-neutral-900">
                    WhatsApp Hotline
                  </h4>
                  <p className="text-xs text-neutral-600 font-mono mt-0.5 font-medium">
                    {settings.whatsappNumber}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </a>

              {/* Instagram Option */}
              {settings.instagramUrl && (
                <a 
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 hover:border-black transition-all duration-300"
                >
                  <div className="h-10 w-10 shrink-0 rounded-none bg-black text-white flex items-center justify-center">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-neutral-900">
                      Instagram Direct Messages
                    </h4>
                    <p className="text-xs text-neutral-600 font-light mt-0.5">
                      @codewest
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </a>
              )}
            </div>

            {/* Operational notice */}
            <div className="border-t border-neutral-100 pt-4 mt-6">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
                <p className="text-[10px] font-mono uppercase tracking-wide text-neutral-400 leading-normal">
                  OPERATING HOURS: MON-SUN | 08:00 - 22:00 (UTC)<br />
                  RESPONSE EXPECTATION: UNDER 2 HOURS
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Secure Email Form with Firestore sync */}
        <div className="lg:col-span-7">
          <div className="border border-neutral-200 bg-white p-6 sm:p-8">
            {submitSuccess ? (
              <div className="text-center py-12 space-y-6">
                <div className="inline-flex h-16 w-16 items-center justify-center bg-neutral-50 border border-neutral-200 text-black mx-auto">
                  <CheckCircle className="h-8 w-8 text-black" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold uppercase tracking-tight text-neutral-900">
                    Transmission Successful
                  </h3>
                  <p className="font-mono text-[10px] tracking-wider uppercase text-neutral-400">
                    TICKET STATUS: SENT SECURELY
                  </p>
                  <p className="max-w-md mx-auto text-xs text-neutral-500 font-light leading-relaxed pt-2">
                    Thank you. Your message has been saved directly to our encrypted database collection. An administrator will review your technical specifications or support tickets and reach out shortly.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="border border-black bg-white text-black py-2.5 px-6 font-mono text-xs uppercase tracking-wider hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    Send Another message
                  </button>
                  <button
                    onClick={onBackToShop}
                    className="bg-black text-white py-2.5 px-6 font-mono text-xs uppercase tracking-widest hover:bg-neutral-900 transition-colors cursor-pointer"
                  >
                    Return To Shop
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-neutral-100 pb-3 mb-2">
                  <h3 className="font-serif text-lg font-bold text-neutral-900 uppercase">
                    Send An Enquiry Ticket
                  </h3>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                    Write details directly to our back-office database
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 border border-rose-200 bg-rose-50 text-rose-700 text-xs font-mono">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5 font-bold">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex West"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-none border border-neutral-200 bg-neutral-50/50 py-2.5 px-3 text-xs font-sans text-neutral-900 outline-none focus:border-black focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5 font-bold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-none border border-neutral-200 bg-neutral-50/50 py-2.5 px-3 text-xs font-sans text-neutral-900 outline-none focus:border-black focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5 font-bold">
                    Select Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-none border border-neutral-200 bg-neutral-50/50 py-2.5 px-3 text-xs font-mono uppercase text-neutral-800 outline-none focus:border-black focus:bg-white transition-colors"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Status Enquiry">Order Status Enquiry</option>
                    <option value="Custom Sizing / Fitting">Custom Sizing / Fitting</option>
                    <option value="Wholesale & Drops">Wholesale & Drops</option>
                    <option value="Technical Website Feedback">Technical Website Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5 font-bold">
                    Message Detail *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide deep details about your size specs, item names, delivery coordinates or questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-none border border-neutral-200 bg-neutral-50/50 py-2.5 px-3 text-xs font-sans text-neutral-900 outline-none focus:border-black focus:bg-white transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black border border-black text-white py-3.5 px-6 font-mono text-xs uppercase tracking-widest hover:bg-neutral-900 transition-all font-bold cursor-pointer flex items-center justify-center gap-2 disabled:bg-neutral-400 disabled:border-neutral-400"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Enrolling Ticket...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Submit Secure Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
