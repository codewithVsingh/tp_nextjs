"use client";

import React, { useState } from 'react';
import { BookOpen, Atom, Calculator, Languages, Award, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const SmartSubjectExplorer = () => {
  const [activeCategory, setActiveCategory] = useState('popular');

  const categories = {
    popular: [
      { name: "Mathematics", icon: <Calculator className="w-5 h-5" />, slug: "maths" },
      { name: "Physics", icon: <Atom className="w-5 h-5" />, slug: "physics" },
      { name: "English", icon: <Languages className="w-5 h-5" />, slug: "english" },
      { name: "CBSE Board", icon: <Award className="w-5 h-5" />, slug: "cbse" }
    ],
    competitive: [
      { name: "NEET Prep", icon: <Award className="w-5 h-5" />, slug: "neet" },
      { name: "JEE Mains", icon: <Award className="w-5 h-5" />, slug: "jee" },
      { name: "CUET", icon: <Award className="w-5 h-5" />, slug: "cuet" }
    ]
  };

  return (
    <section className="py-12 bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button 
              onClick={() => setActiveCategory('popular')}
              className={`px-6 py-2 text-sm font-bold rounded-xl transition-all ${activeCategory === 'popular' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Popular Subjects
            </button>
            <button 
              onClick={() => setActiveCategory('competitive')}
              className={`px-6 py-2 text-sm font-bold rounded-xl transition-all ${activeCategory === 'competitive' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Competitive Exams
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {categories[activeCategory as keyof typeof categories].map((item) => (
            <Link 
              key={item.slug}
              href={`/tutors/${item.slug}-delhi`}
              className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all group"
            >
              <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                {item.icon}
              </div>
              <span className="font-bold text-slate-700 group-hover:text-blue-600">{item.name}</span>
              <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
