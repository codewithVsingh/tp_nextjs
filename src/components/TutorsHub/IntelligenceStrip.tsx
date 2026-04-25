"use client";

import React from 'react';
import { Cpu, Search, CheckCircle2, Zap, ShieldCheck, Target } from 'lucide-react';

export const IntelligenceStrip = () => {
  const steps = [
    {
      icon: <Target className="w-6 h-6 text-blue-500" />,
      title: "Define Requirement",
      desc: "Tell us your class, subject, and goals."
    },
    {
      icon: <Cpu className="w-6 h-6 text-indigo-500" />,
      title: "AI-Powered Scoring",
      desc: "Our engine analyzes thousands of tutor profiles."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: "Top 3 Matches",
      desc: "You get the best fits for a free demo class."
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold tracking-widest text-blue-600 uppercase rounded-full bg-blue-50">
            <Zap className="w-3 h-3" /> Quality Assurance
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-heading">
            How Our System Finds Your <span className="text-blue-600">Perfect Match</span>
          </h2>
          <p className="text-lg text-slate-600">
            We don't just show you a list. We use data-driven scoring to ensure your child learns from the absolute best match in your area.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-200 -translate-y-12 z-0" />
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center p-8 text-center bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-slate-50 shadow-inner">
                {step.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              
              <div className="mt-6">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
