"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Phone, Building2, User, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrustAuth } from "@/components/trust/TrustAuthContext";
import { supabase } from "@/integrations/supabase/client";

const TrustLogin = () => {
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
    const success = await login(mobile);
    
    if (success) {
      toast.success("Welcome back to Trust Platform");
      router.push("/trust/dashboard");
    } else {
      // User not found, proceed to onboarding
      setStep("onboarding");
      toast.info("Register your institute to continue");
    }
    setLoading(false);
  };

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("trust_users")
        .insert([
          { 
            mobile, 
            institute_name: instituteName, 
            owner_name: ownerName, 
            city 
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Log them in immediately after creation
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
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Abstract background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Trust Intelligence</h1>
          <p className="text-slate-400 mt-2">B2B Shared Registry for Institutes & Agencies</p>
        </div>

        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              {step === "login" ? "Access Portal" : "Complete Registration"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {step === "login" 
                ? "Enter your mobile number to continue" 
                : "Tell us about your organization"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {step === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleInitialCheck}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      placeholder="Mobile Number"
                      className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-blue-500 focus:border-blue-500"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      required
                    />
                  </div>
                  <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all group" disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Verify & Continue
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="onboarding"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleOnboarding}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      placeholder="Institute Name"
                      className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-white"
                      value={instituteName}
                      onChange={(e) => setInstituteName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative group">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      placeholder="Owner Name"
                      className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-white"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      placeholder="City"
                      className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-white"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                      onClick={() => setStep("login")}
                    >
                      Back
                    </Button>
                    <Button className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Profile"}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Access restricted to verified educational organizations only.
        </p>
      </motion.div>
    </div>
  );
};

export default TrustLogin;

