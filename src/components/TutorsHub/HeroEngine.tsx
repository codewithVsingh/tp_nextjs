"use client";

import React, { useState } from 'react';
import { Search, MapPin, BookOpen, GraduationCap, ArrowRight, CheckCircle, Star, Users, ShieldCheck } from 'lucide-react';
import { LocationSearchBar } from '@/components/LocationSearchBar';
import { ComingSoonCapture } from './ComingSoonCapture';

export const TutorsHubHero = () => {
  const [formData, setFormData] = useState({
    class: '',
    subject: '',
    location: null as any
  });
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleSearch = () => {
    if (!formData.location) {
      // Handle empty location if needed
      return;
    }

    const stateName = formData.location.cities?.states?.name || '';
    const cityName = formData.location.cities?.name || '';
    
    // Check if location is Delhi NCR
    const isDelhiNCR = 
      stateName.toLowerCase().includes('delhi') || 
      cityName.toLowerCase().includes('noida') || 
      cityName.toLowerCase().includes('gurgaon') || 
      cityName.toLowerCase().includes('ghaziabad') || 
      cityName.toLowerCase().includes('faridabad');

    if (!isDelhiNCR) {
      setShowComingSoon(true);
    } else {
      // Normal search behavior for Delhi NCR
      console.log("Searching in Delhi NCR...", formData);
    }
  };

  return (
    <section className="relative pt-24 pb-20 overflow-hidden bg-[#0F172A]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-indigo-600 blur-[100px]" />
      </div>

      <div className="container relative z-10 px-4 mx-auto text-center">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-white/90">4.8/5 Parent Rating</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white/90">Verified Profiles Only</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-white/90">5,300+ Expert Tutors</span>
          </div>
        </div>

        <h1 className="max-w-4xl mx-auto mb-6 text-5xl font-bold leading-tight text-white md:text-6xl font-heading">
          Find Your Perfect Tutor <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Instantly</span>
        </h1>
        <p className="max-w-2xl mx-auto mb-12 text-lg text-slate-400">
          Skip the scrolling. Our intelligence engine matches you with the top 1% of verified home tutors in your specific area.
        </p>

        <div className="max-w-5xl mx-auto p-2 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl shadow-2xl">
          <div className="grid items-center grid-cols-1 md:grid-cols-12 bg-white rounded-[28px] overflow-hidden">
            
            {/* Step 1: Class Selection (Maximum Options) */}
            <div className="relative col-span-3 border-r border-slate-100 group">
              <div className="flex flex-col items-start px-6 py-4 text-left transition-colors hover:bg-slate-50 cursor-pointer">
                <span className="flex items-center gap-2 mb-1 text-xs font-bold tracking-wider text-blue-600 uppercase">
                  <GraduationCap className="w-3 h-3" /> Step 1
                </span>
                <select 
                  className="w-full text-lg font-semibold bg-transparent outline-none appearance-none text-slate-800 cursor-pointer"
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                >
                  <option value="">Select Class</option>
                  <optgroup label="School">
                    <option value="nursery">Nursery - KG</option>
                    <option value="primary">Class 1 - 5</option>
                    <option value="middle">Class 6 - 8</option>
                    <option value="class-9">Class 9</option>
                    <option value="class-10">Class 10</option>
                    <option value="class-11">Class 11</option>
                    <option value="class-12">Class 12</option>
                  </optgroup>
                  <optgroup label="Competitive">
                    <option value="jee">JEE Mains / Adv</option>
                    <option value="neet">NEET / Medical</option>
                    <option value="cuet">CUET</option>
                    <option value="olympiad">Olympiads</option>
                  </optgroup>
                  <optgroup label="Higher Ed">
                    <option value="graduation">Graduation</option>
                    <option value="post-graduation">Post Graduation</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Step 2: Subject (Maximum Options) */}
            <div className="relative col-span-3 border-r border-slate-100 group">
              <div className="flex flex-col items-start px-6 py-4 text-left transition-colors hover:bg-slate-50 cursor-pointer">
                <span className="flex items-center gap-2 mb-1 text-xs font-bold tracking-wider text-blue-600 uppercase">
                  <BookOpen className="w-3 h-3" /> Step 2
                </span>
                <select 
                  className="w-full text-lg font-semibold bg-transparent outline-none appearance-none text-slate-800 cursor-pointer"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  <option value="">Subject</option>
                  <optgroup label="Core Subjects">
                    <option value="math">Mathematics</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="biology">Biology</option>
                    <option value="science">Science (All)</option>
                  </optgroup>
                  <optgroup label="Commerce & Arts">
                    <option value="accountancy">Accountancy</option>
                    <option value="economics">Economics</option>
                    <option value="history">History</option>
                    <option value="geography">Geography</option>
                    <option value="political-science">Pol Science</option>
                  </optgroup>
                  <optgroup label="Languages">
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                  </optgroup>
                  <optgroup label="Skills">
                    <option value="coding">Coding / CS</option>
                    <option value="music">Music / Instruments</option>
                    <option value="arts">Fine Arts</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Step 3: Location Search Bar */}
            <div className="col-span-4 px-2">
              <LocationSearchBar 
                onLocationSelect={(loc) => setFormData({...formData, location: loc})}
                placeholder="Enter area or pincode..." 
                className="!max-w-full !shadow-none !border-0 focus-within:!border-0"
              />
            </div>

            {/* CTA: FIND TUTOR */}
            <div className="col-span-2 p-2">
              <button 
                onClick={handleSearch}
                className="flex items-center justify-center w-full h-full gap-2 py-4 font-bold text-white transition-transform bg-blue-600 rounded-2xl hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-600/20"
              >
                Search <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        <div className="flex items-center justify-center gap-8 mt-12 text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">Verified Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">Safe at Home</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">Expert Background</span>
          </div>
        </div>
      </div>

      <ComingSoonCapture 
        isOpen={showComingSoon} 
        onClose={() => setShowComingSoon(false)} 
        locationName={formData.location?.name || 'Your Area'} 
      />
    </section>
  );
};
