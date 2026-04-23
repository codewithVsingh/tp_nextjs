"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Phone, 
  Building2, 
  User, 
  MapPin, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Search, 
  Users, 
  AlertTriangle 
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrustAuth } from "@/components/trust/TrustAuthContext";
import { supabase } from "@/integrations/supabase/client";

const LoginView = () => {
  const [mobile, setMobile] = useState("");
  const [step, setStep] = useState<"login" | "onboarding">("login");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useTrustAuth();

  // Onboarding fields
  const [instituteName, setInstituteName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [city, setCity] = useState("");

  const handleInitialCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const success = await login(mobile);
      
      if (success) {
        toast.success("Welcome back to Trust Platform");
        router.push("/trust/dashboard");
      } else {
        setStep("onboarding");
        toast.info("Register your institute to continue");
      }
    } catch (err: any) {
      toast.error("An error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("trust_users")
        .insert([
          { 
            mobile, 
            institute_name: instituteName, 
            owner_name: ownerName, 
            city 
          }
        ]);

      if (error) throw error;

      await login(mobile);
      toast.success("Account created successfully!");
      router.push("/trust/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden font-outfit">
      {/* Left Panel: Branding & Trust */}
      <div className="w-full md:w-[60%] bg-[#020617] relative p-8 md:p-16 flex flex-col justify-between text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Minimal Header */}
        <div className="relative z-10 flex items-center gap-2 mb-12">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white uppercase">Tutors Parliament</span>
            <span className="block text-[10px] text-blue-400 font-bold tracking-[0.2em] uppercase">Trust Intelligence</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 max-w-xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold leading-tight mb-4"
          >
            India’s Tutor & Lead <br />
            <span className="text-blue-500">Intelligence Network</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg md:text-xl mb-12 font-light leading-relaxed"
          >
            Verify before you hire. Detect fraud before it costs you. Access the first shared intelligence platform for educational organizations.
          </motion.p>

          {/* Key Points */}
          <div className="space-y-6 mb-16">
            {[
              { icon: Search, title: "Identify repeat offender tutors", desc: "Instantly check history across 300+ connected institutes." },
              { icon: Users, title: "Detect commission bypass parents", desc: "Flag leads who bypass agencies to avoid professional fees." },
              { icon: Shield, title: "Shared intelligence across institutes", desc: "A secure, private ledger built by institutes, for institutes." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="flex items-start gap-4"
              >
                <div className="mt-1 p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <item.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 p-6 bg-slate-800/30 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
            {[
              { label: "Reports Analyzed", value: "1000+" },
              { label: "Institutes Connected", value: "300+" },
              { label: "Offenders Flagged", value: "150+" }
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-8">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Private & secure network</span>
          </div>
          <div className="text-slate-600 text-xs tracking-wide uppercase font-bold">
            Join the network. Strengthen the ecosystem.
          </div>
        </div>
      </div>

      {/* Right Panel: Login Panel */}
      <div className="w-full md:w-[40%] bg-white flex items-center justify-center p-8 relative overflow-hidden">
        {/* Subtle background blur for depth */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
        
        <div className="w-full max-w-sm relative z-10">
          <AnimatePresence mode="wait">
            {step === "login" ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                  <p className="text-slate-500">Sign in to access India's tutor intelligence network.</p>
                </div>

                <form onSubmit={handleInitialCheck} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Mobile Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        placeholder="e.g. 9876543210"
                        className="pl-10 h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all rounded-xl"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        required
                      />
                    </div>
                  </div>

                  <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-xl shadow-blue-600/20 transition-all group rounded-xl" disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Continue to Network
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="pt-4 text-center">
                  <p className="text-slate-500 text-sm">
                    New institute? <span className="text-blue-600 font-bold cursor-pointer hover:underline">Continue to get started</span>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="onboarding-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                  <p className="text-slate-500">Register your organization to join the trust network.</p>
                </div>

                <form onSubmit={handleOnboarding} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Institute Name</label>
                    <div className="relative group">
                      <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600" />
                      <Input
                        placeholder="Full Institute Name"
                        className="pl-10 h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-xl"
                        value={instituteName}
                        onChange={(e) => setInstituteName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Owner Name</label>
                    <div className="relative group">
                      <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600" />
                      <Input
                        placeholder="Owner / Manager Name"
                        className="pl-10 h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-xl"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">City</label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600" />
                      <Input
                        placeholder="e.g. New Delhi"
                        className="pl-10 h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-xl"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-600/20">
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Register & Access"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="text-slate-500 hover:text-slate-900 font-semibold"
                      onClick={() => setStep("login")}
                    >
                      Back
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom links */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
