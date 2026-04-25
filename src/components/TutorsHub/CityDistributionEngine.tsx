"use client";

import React, { useState } from 'react';
import { MapPin, ArrowRight, Zap } from 'lucide-react';
import { ComingSoonCapture } from './ComingSoonCapture';

const FeaturedCityCard = ({ 
  name, 
  locations, 
  color, 
  onClick 
}: { 
  name: string, 
  locations: string, 
  color: string, 
  onClick: () => void 
}) => (
  <button 
    onClick={onClick}
    className="text-left group relative overflow-hidden p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 w-full"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700 ${color}`} />
    
    <div className="relative z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold tracking-widest text-blue-600 uppercase rounded-full bg-blue-50">
        <MapPin className="w-3 h-3" /> Tier 1 Metro
      </div>
      <h3 className="text-3xl font-bold text-slate-900 mb-2 font-heading">{name}</h3>
      <p className="text-slate-500 font-medium">{locations} Verified Locations</p>
      
      <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all">
        Check Availability <ArrowRight className="w-5 h-5" />
      </div>
    </div>
  </button>
);

export const CityDistributionEngine = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <section id="featured-cities" className="py-24 bg-white overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold tracking-widest text-blue-600 uppercase rounded-full bg-blue-50">
              <Zap className="w-3 h-3" /> Distribution Engine
            </div>
            <h2 className="text-4xl font-bold text-slate-900 font-heading">
              Top <span className="text-blue-600">Metropolitan</span> Hubs
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Our tutors are currently dominating the most competitive academic markets in India.
            </p>
          </div>
          <button 
            onClick={() => {
              const el = document.getElementById('seo-directory');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 font-bold text-blue-600 group hover:gap-3 transition-all"
          >
            Explore All 47 Cities <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeaturedCityCard 
            name="Delhi NCR" 
            locations="1,240+" 
            color="bg-blue-600" 
            onClick={() => setSelectedCity("Delhi NCR")}
          />
          <FeaturedCityCard 
            name="Mumbai" 
            locations="890+" 
            color="bg-indigo-600" 
            onClick={() => setSelectedCity("Mumbai")}
          />
          <FeaturedCityCard 
            name="Bengaluru" 
            locations="760+" 
            color="bg-emerald-600" 
            onClick={() => setSelectedCity("Bengaluru")}
          />
          <FeaturedCityCard 
            name="Pune" 
            locations="640+" 
            color="bg-amber-600" 
            onClick={() => setSelectedCity("Pune")}
          />
          <FeaturedCityCard 
            name="Hyderabad" 
            locations="520+" 
            color="bg-rose-600" 
            onClick={() => setSelectedCity("Hyderabad")}
          />
          <FeaturedCityCard 
            name="Chennai" 
            locations="480+" 
            color="bg-purple-600" 
            onClick={() => setSelectedCity("Chennai")}
          />
        </div>
      </div>

      <ComingSoonCapture 
        isOpen={!!selectedCity} 
        onClose={() => setSelectedCity(null)} 
        locationName={selectedCity || ''} 
      />
    </section>
  );
};
