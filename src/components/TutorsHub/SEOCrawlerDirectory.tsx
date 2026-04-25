"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Map, ChevronRight, Globe, Search, ArrowRight } from 'lucide-react';

// Sample structure for Tier 1 - In production, this would be fetched or generated from your master dataset
const topStates = [
  { name: "Delhi-NCR", slug: "delhi-ncr", cities: ["Delhi", "Noida", "Gurgaon", "Ghaziabad", "Faridabad"] },
  { name: "Maharashtra", slug: "maharashtra", cities: ["Mumbai", "Pune", "Navi Mumbai", "Thane", "Nagpur"] },
  { name: "Karnataka", slug: "karnataka", cities: ["Bengaluru", "Mysuru"] },
  { name: "Gujarat", slug: "gujarat", cities: ["Ahmedabad", "Surat", "Gandhinagar"] },
  { name: "Uttar Pradesh", slug: "uttar-pradesh", cities: ["Lucknow", "Varanasi", "Gwalior"] }
];

export const SEOCrawlerDirectory = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="seo-directory" className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-100 pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold tracking-widest text-slate-500 uppercase rounded-full bg-slate-100">
              <Globe className="w-3 h-3" /> Search Engine Index
            </div>
            <h2 className="text-3xl font-bold text-slate-900 font-heading">
              Browse Tutors by <span className="text-blue-600">Location</span>
            </h2>
            <p className="mt-4 text-slate-500">
              Access 5,300+ local tutoring pages across India. Our network covers every major block and sector in 47 urban centers.
            </p>
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-6 py-3 font-bold text-blue-600 transition-all border-2 border-blue-100 rounded-2xl hover:bg-blue-50"
          >
            {isExpanded ? 'Collapse Directory' : 'Explore All Locations'}
            <ArrowRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Directory Grid */}
        <div className={`grid gap-12 transition-all duration-700 overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-[400px] opacity-80'}`}>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {topStates.map((state) => (
              <div key={state.slug} className="group">
                <h3 className="flex items-center gap-2 mb-6 text-xl font-bold text-slate-800">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  {state.name}
                </h3>
                <ul className="space-y-4">
                  {state.cities.map((city) => (
                    <li key={city}>
                      <Link 
                        href={`/tutors/${city.toLowerCase().replace(/ /g, '-')}`}
                        className="flex items-center justify-between text-slate-500 hover:text-blue-600 transition-colors group/link"
                      >
                        <span className="font-medium">{city}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link 
                      href={`/tutors/${state.slug}`}
                      className="inline-block text-sm font-bold text-blue-600 hover:underline"
                    >
                      View all in {state.name}
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </div>

          {!isExpanded && (
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* Dynamic Activity Loop (Simulated) */}
        <div className="mt-16 p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
              ))}
            </div>
            <p className="text-blue-900 font-medium">
              <span className="font-bold">127 parents</span> searched for tutors in the last 24 hours.
            </p>
          </div>
          <Link 
            href="/demo-booking"
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-transform"
          >
            Get Free Recommendations
          </Link>
        </div>
      </div>
    </section>
  );
};
