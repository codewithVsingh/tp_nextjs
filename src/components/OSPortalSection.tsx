"use client";

import { motion } from "framer-motion";
import { ShieldCheck, GraduationCap, Building2, ChevronRight, Zap, Network, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PORTALS = [
  {
    title: "Agency Intelligence",
    description: "Access the Trust Intelligence Network. Report fraud, verify credibility, and secure your operations.",
    icon: Network,
    link: "/institute-login",
    color: "from-indigo-600 to-blue-600",
    badge: "Institute OS",
    tagline: "SURVEILLANCE-READY"
  },
  {
    title: "Tutor Ecosystem",
    description: "Join the elite network of educators. Manage your profile, leads, and professional reputation.",
    icon: GraduationCap,
    link: "/become-a-tutor",
    color: "from-emerald-600 to-teal-600",
    badge: "Tutor Portal",
    tagline: "REPUTATION-FIRST"
  },
  {
    title: "Command Center",
    description: "Internal operations for Tutor Parliament administrators. Full-stack oversight and control tower.",
    icon: LayoutDashboard,
    link: "/admin/login",
    color: "from-slate-700 to-slate-900",
    badge: "Admin OS",
    tagline: "INTERNAL ONLY"
  },
];

export default function OSPortalSection() {
  return (
    <section className="section-padding section-alt relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          >
            <Zap className="w-3.5 h-3.5" /> Unified Ecosystem
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground mb-4"
          >
            The Tutor Parliament <span className="text-primary">OS</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed"
          >
            A high-performance operating system designed for the future of education. 
            Choose your entrance to the network.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PORTALS.map((portal, i) => (
            <motion.div
              key={portal.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.3 }}
            >
              <Link href={portal.link} className="group block h-full">
                <div className="relative h-full bg-background card-shadow rounded-3xl p-8 transition-all duration-500 hover:card-shadow-hover overflow-hidden group-hover:-translate-y-2 border border-border/50">
                  <div className="flex justify-between items-start mb-8">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${portal.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <portal.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">
                        {portal.tagline}
                      </span>
                      <span className="px-2 py-1 rounded bg-accent text-[10px] font-bold text-foreground uppercase tracking-tight">
                        {portal.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{portal.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                    {portal.description}
                  </p>

                  <div className="mt-auto flex items-center text-primary font-bold text-sm tracking-tight uppercase group-hover:gap-2 transition-all">
                    Access Portal <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

