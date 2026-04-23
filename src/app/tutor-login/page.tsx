import { 
  Phone, 
  Clock,
  ArrowRight
} from "lucide-react";
import { TPButton } from "@/components/system/TPButton";
import { TPInput } from "@/components/system/TPInput";
import AuthLayout from "@/layouts/AuthLayout";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TutorLoginPage() {
  return (
    <AuthLayout
      role="tutor"
      title="Tutor Login"
      subtitle="Sign in to manage your profile and requests."
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <TPInput
            role="tutor"
            label="Mobile Number"
            placeholder="e.g. 9876543210"
            icon={<Phone className="w-5 h-5" />}
            disabled
            className="opacity-60 grayscale cursor-not-allowed"
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <TPButton 
                  role="tutor"
                  disabled
                  className="w-full h-12 text-lg opacity-80"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Launching Soon
                </TPButton>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 text-white border-slate-800 p-3 rounded-lg shadow-xl">
              <p className="text-xs">Tutor Dashboard is launching soon! <br /> We'll notify you via SMS once it's live.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">System Initialization in progress</p>
        </div>

        <div className="text-center">
          <p className="text-slate-500 text-sm font-medium">
            New tutor?{" "}
            <a href="/become-a-tutor" className="text-tp-tutor font-bold hover:underline">
              Register to get notified
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
