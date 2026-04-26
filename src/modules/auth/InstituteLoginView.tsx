"use client";

import { useState, useEffect } from "react";
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
  Zap,
  Lock,
  ShieldCheck,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import { useTrustAuth } from "@/components/trust/TrustAuthContext";
import { instituteService } from "@/domains/network/services/instituteService";
import { cn } from "@/lib/utils";

const InstituteLoginView = () => {
  const [mobile, setMobile] = useState("");
  const [step, setStep] = useState<"login" | "onboarding">("login");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useTrustAuth();

  const [instituteName, setInstituteName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
  }, []);

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
        toast.success("Intelligence Clearance Verified");
        router.push("/trust/dashboard");
      } else {
        setStep("onboarding");
        toast.info("Registering New Node in Intelligence Network");
      }
    } catch (err: any) {
      toast.error("Network communication failure.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await instituteService.register({ 
        mobile, 
        institute_name: instituteName, 
        owner_name: ownerName, 
        city 
      });

      await login(mobile);
      toast.success("Node Registered Successfully");
      router.push("/trust/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-tp-institute/30">
      {/* Background FX */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-tp-institute/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 0px rgba(10, 182, 171, 0)", "0 0 40px rgba(10, 182, 171, 0.2)", "0 0 0px rgba(10, 182, 171, 0)"] 
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 bg-slate-900 border-2 border-tp-institute/30 rounded-3xl mb-6 relative overflow-hidden"
          >
            <ShieldCheck className="w-10 h-10 text-tp-institute" />
            <div className="absolute inset-0 bg-gradient-to-t from-tp-institute/10 to-transparent" />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-4">
            Sentinel <span className="text-tp-institute">Access</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Tutor Intelligence Network</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-tp-institute/50 to-transparent" />
          
          <AnimatePresence mode="wait">
            {step === "login" ? (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleInitialCheck} 
                className="space-y-8"
              >
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Identity Clearance (Mobile)</label>
                  <div className="relative group/input">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-tp-institute transition-colors" />
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border-2 border-white/5 rounded-3xl py-5 pl-16 pr-6 text-white font-bold text-lg focus:outline-none focus:border-tp-institute/40 transition-all placeholder:text-slate-700"
                      placeholder="9876XXXXXX"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      required
                    />
                  </div>
                </div>

                <Button 
                  disabled={loading}
                  className="w-full h-16 bg-tp-institute hover:bg-tp-institute/90 text-white font-black uppercase text-xs tracking-[0.2em] rounded-3xl shadow-xl shadow-tp-institute/20 transition-all active:scale-[0.98]"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <span className="flex items-center gap-2">Verify Clearance <ArrowRight className="w-4 h-4" /></span>
                  )}
                </Button>
                
                <div className="flex items-center gap-4 text-center">
                   <div className="h-[1px] flex-1 bg-white/5" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Check</span>
                   <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => setStep("onboarding")}
                    className="text-[10px] font-black text-slate-500 hover:text-tp-institute uppercase tracking-widest transition-colors"
                  >
                    Request New Node Registration
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="onboarding"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleOnboarding} 
                className="space-y-6"
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Organization Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        className="w-full bg-slate-950 border-2 border-white/5 rounded-3xl py-4 pl-16 pr-6 text-white font-bold focus:outline-none focus:border-tp-institute/40 transition-all"
                        placeholder="Institute / Bureau Name"
                        value={instituteName}
                        onChange={(e) => setInstituteName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Primary Contact</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        className="w-full bg-slate-950 border-2 border-white/5 rounded-3xl py-4 pl-16 pr-6 text-white font-bold focus:outline-none focus:border-tp-institute/40 transition-all"
                        placeholder="Full Name"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Deployment City</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        className="w-full bg-slate-950 border-2 border-white/5 rounded-3xl py-4 pl-16 pr-6 text-white font-bold focus:outline-none focus:border-tp-institute/40 transition-all"
                        placeholder="e.g. New Delhi"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full h-16 bg-tp-institute hover:bg-tp-institute/90 text-white font-black uppercase text-xs tracking-[0.2em] rounded-3xl mt-4">
                   {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Initiate Protocol"}
                </Button>

                <button 
                  type="button"
                  onClick={() => setStep("login")}
                  className="w-full text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  Return to Clearance Check
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Metrics */}
        <div className="mt-12 flex justify-center gap-12">
          <div className="text-center">
            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Network Capacity</div>
            <div className="text-white font-black text-xl">99.9%</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Encrypted Node</div>
            <div className="text-tp-institute font-black text-xl">ACTIVE</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Internal Button to avoid shadcn dependency issues in this rewrite
const Button = ({ children, className, ...props }: any) => (
  <button 
    className={cn(
      "flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default InstituteLoginView;
