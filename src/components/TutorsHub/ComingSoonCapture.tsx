"use client";

import React, { useState, useEffect } from 'react';
import { X, Bell, Zap, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

export const ComingSoonCapture = ({ 
  isOpen, 
  onClose, 
  locationName 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  locationName: string 
}) => {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) setSubmitted(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {!submitted ? (
          <div className="p-10 md:p-14 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold tracking-widest text-blue-600 uppercase rounded-full bg-blue-50">
              <Zap className="w-3 h-3" /> Coming Soon to {locationName}
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-heading leading-tight">
              Expanding Our <span className="text-blue-600">Elite Network</span> to Your Area
            </h2>
            
            <p className="text-lg text-slate-500 mb-10">
              We are currently vetting top-tier tutors in <span className="font-bold text-slate-900">{locationName}</span>. Join our priority waitlist to get early-bird access to the top 1% of matches.
            </p>

            <form 
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="space-y-4"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  required
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-colors"
                />
                <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                  Notify Me <Bell className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Your data is safe with our Intelligence Tower
              </p>
            </form>

            <div className="mt-12 grid grid-cols-2 gap-6 pt-10 border-t border-slate-50">
              <div className="text-left">
                <div className="text-2xl font-bold text-slate-900">48h</div>
                <div className="text-xs text-slate-500 font-medium">Priority Matching</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-slate-900">10%</div>
                <div className="text-xs text-slate-500 font-medium">Early-Bird Discount</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-14 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4 font-heading">You're on the List!</h2>
            <p className="text-lg text-slate-500 mb-8">
              We've logged your interest for <span className="font-bold">{locationName}</span>. Our team will contact you as soon as the first batch of verified tutors is ready.
            </p>
            <button 
              onClick={onClose}
              className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:scale-105 transition-transform"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
