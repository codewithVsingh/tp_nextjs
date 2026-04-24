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
  CheckCircle2, 
  Search, 
  Users
} from "lucide-react";
import { toast } from "sonner";
import { TPButton } from "@/design-system/components/TPButton";
import { TPInput } from "@/design-system/components/TPInput";
import AuthLayout from "@/layouts/AuthLayout";
import { useTrustAuth } from "@/components/trust/TrustAuthContext";
import { instituteService } from "@/domains/network/services/instituteService";

const InstituteLoginView = () => {
  const [mobile, setMobile] = useState("");
  const [step, setStep] = useState<"login" | "onboarding">("login");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useTrustAuth();

  // Safety Valve: Clear stale sessions
  useEffect(() => {
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
  }, []);

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
        toast.info("Register your institute to join the network");
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
      await instituteService.register({ 
        mobile, 
        institute_name: instituteName, 
        owner_name: ownerName, 
        city 
      });

      await login(mobile);
      toast.success("Institute registered successfully!");
      router.push("/trust/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      role="institute"
      title={step === "login" ? "Welcome Back" : "Join the Network"}
      subtitle={step === "login" 
        ? "Sign in to access India's tutor intelligence network." 
        : "Register your organization to join India's shared intelligence platform."}
    >
      <AnimatePresence mode="wait">
        {step === "login" ? (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <form onSubmit={handleInitialCheck} className="space-y-6">
              <TPInput
                role="institute"
                label="Mobile Number"
                placeholder="e.g. 9876543210"
                icon={<Phone className="w-5 h-5" />}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
              />

              <TPButton 
                role="institute" 
                className="w-full h-12 text-lg" 
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Continue to Network
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </TPButton>
            </form>

            <div className="text-center">
              <p className="text-slate-500 text-sm font-medium">
                New institute?{" "}
                <TPButton 
                  variant="link"
                  className="text-tp-institute font-bold p-0 h-auto" 
                  onClick={() => setStep("onboarding")}
                >
                  Continue to get started
                </TPButton>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="onboarding-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <form onSubmit={handleOnboarding} className="space-y-4">
              <TPInput
                role="institute"
                label="Institute Name"
                placeholder="Full Institute Name"
                icon={<Building2 className="w-5 h-5" />}
                value={instituteName}
                onChange={(e) => setInstituteName(e.target.value)}
                required
              />

              <TPInput
                role="institute"
                label="Owner Name"
                placeholder="Owner / Manager Name"
                icon={<User className="w-5 h-5" />}
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
              />

              <TPInput
                role="institute"
                label="City"
                placeholder="e.g. New Delhi"
                icon={<MapPin className="w-5 h-5" />}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />

              <div className="flex flex-col gap-3 pt-4">
                <TPButton role="institute" className="w-full h-12 text-lg" type="submit">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Register & Access"}
                </TPButton>
                <TPButton 
                  type="button" 
                  variant="ghost"
                  className="text-slate-500 hover:text-slate-900 font-bold text-sm h-8"
                  onClick={() => setStep("login")}
                >
                  Back to Login
                </TPButton>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default InstituteLoginView;

