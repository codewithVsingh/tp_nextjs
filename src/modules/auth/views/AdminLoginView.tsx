"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  BarChart3, 
  Database, 
  Settings 
} from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "@/domains/identity/services/authService";
import { TPButton } from "@/design-system/components/TPButton";
import { TPInput } from "@/design-system/components/TPInput";
import AuthLayout from "@/layouts/AuthLayout";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Safety Valve: Clear any zombie/stale sessions on land
  useEffect(() => {
    authService.signOut().catch(() => {
      // Ignore errors if already signed out
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await authService.loginWithPassword(email, password);
      toast.success("Welcome back to Admin Dashboard!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      role="admin"
      title="Control Tower"
      subtitle="Sign in to manage the Tutor Parliament network."
    >
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          <TPInput
            role="admin"
            label="Email Address"
            type="email"
            placeholder="admin@tutorsparliament.com"
            icon={<Mail className="w-5 h-5" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TPInput
            role="admin"
            label="Security Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <TPButton 
          role="admin" 
          type="submit" 
          className="w-full h-12 text-lg" 
          disabled={loading}
        >
          {loading ? "Authenticating Intelligence..." : "Enter Control Tower"}
        </TPButton>
      </form>

      <div className="pt-4 text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Secure Access Protocol • JWT Encrypted
        </p>
      </div>
    </AuthLayout>
  );
};

export default AdminLogin;

