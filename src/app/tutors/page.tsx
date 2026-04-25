import React from 'react';
import { TutorsHubHero } from '@/components/TutorsHub/HeroEngine';
import { IntelligenceStrip } from '@/components/TutorsHub/IntelligenceStrip';
import { SmartSubjectExplorer } from '@/components/TutorsHub/SmartSubjectExplorer';
import { CityDistributionEngine } from '@/components/TutorsHub/CityDistributionEngine';
import { Star, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: "Find Verified Home Tutors Near You | Tutors Parliament",
  description: "Search 5,300+ local tutoring pages. Our AI-powered intelligence engine matches you with verified top-tier home tutors in Delhi NCR and beyond.",
};

export default function TutorsHubPage() {
  return (
    <main className="bg-white">
      {/* LAYER 1: ACQUISITION (Intent Capture) */}
      <TutorsHubHero />

      {/* INTENT MULTIPLIER (Step 4) */}
      <SmartSubjectExplorer />

      {/* LAYER 2: CONVERSION (Social Proof + Urgency) */}
      <section className="py-12 bg-white relative -mt-10 z-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 p-10 bg-white border border-slate-100 rounded-[40px] shadow-2xl shadow-blue-900/5 items-center">
            <div className="text-center md:border-r border-slate-100">
              <div className="text-3xl font-bold text-slate-900 font-heading">4.8/5</div>
              <div className="text-sm text-slate-500 font-medium mt-1">Parent Rating</div>
            </div>
            <div className="text-center md:border-r border-slate-100">
              <div className="text-3xl font-bold text-slate-900 font-heading">5,300+</div>
              <div className="text-sm text-slate-500 font-medium mt-1">Expert Tutors</div>
            </div>
            <div className="text-center md:border-r border-slate-100">
              <div className="text-3xl font-bold text-slate-900 font-heading">47</div>
              <div className="text-sm text-slate-500 font-medium mt-1">Urban Centers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 font-heading">100%</div>
              <div className="text-sm text-slate-500 font-medium mt-1">Verified Network</div>
            </div>
          </div>
        </div>
      </section>

      {/* LAYER 3: QUALITY ASSURANCE */}
      <IntelligenceStrip />

      {/* TRAFFIC DISTRIBUTOR: FEATURED CITIES (Client Component) */}
      <CityDistributionEngine />

      {/* RE-CONVERSION LAYER (Middle Capture) */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[140px]" />
        </div>
        
        <div className="container relative z-10 px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 font-heading">
            Can't find your specific area?
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-12">
            Leave your requirements with our expert team and we'll manually source the best matches for you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/demo-booking"
              className="px-10 py-5 bg-white text-slate-900 font-extrabold rounded-2xl shadow-xl hover:scale-105 transition-transform"
            >
              Post Your Requirement
            </Link>
            <Link 
              href="/contact"
              className="px-10 py-5 border-2 border-white/20 text-white font-bold rounded-2xl hover:bg-white/5 transition-colors"
            >
              Talk to Expert
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL BRAND INTELLIGENCE FOOTER */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4 mx-auto max-w-4xl text-center">
          <div className="flex justify-center gap-6 mb-12">
            <Star className="w-8 h-8 text-slate-200" />
            <Star className="w-8 h-8 text-slate-200" />
            <Star className="w-8 h-8 text-slate-200" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">The Tutors Parliament Difference</h2>
          <p className="text-slate-500 leading-relaxed mb-8">
            Tutors Parliament is not just a listing platform. Every tutor in our network undergoes a 3-step verification process, background check, and academic scoring before being matched to a student.
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-bold text-slate-700">Fraud Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-bold text-slate-700">Tutor Scoring</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-bold text-slate-700">Verified Network</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
