import { useState } from "react";
import TPHeader from "@/design-system/components/TPHeader";
import TPSidebar, { NavSection } from "@/design-system/components/TPSidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface IntelligenceLayoutProps {
  children: React.ReactNode;
  role?: "admin" | "institute" | "tutor" | "global";
  userName?: string;
  navSections?: NavSection[];
  onLogout?: () => void;
  hideHeader?: boolean;
  hideActions?: boolean;
  className?: string;
}

const IntelligenceLayout: React.FC<IntelligenceLayoutProps> = ({ 
  children, 
  role = "global", 
  userName,
  navSections,
  onLogout,
  hideHeader = false,
  hideActions = false,
  className
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={cn("h-screen bg-slate-50 flex flex-col font-body overflow-hidden", className)}>
      {!hideHeader && (
        <TPHeader 
          role={role} 
          userName={userName} 
          hideActions={hideActions} 
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onLogout={onLogout}
        />
      )}
      
      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72 border-none">
          <div className="h-full bg-white flex flex-col">
            <SheetHeader className="h-16 flex flex-row items-center px-6 border-b border-slate-50 text-left space-y-0">
              <SheetTitle className="font-heading font-black text-lg text-slate-900">
                Intelligence Hub
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
              {role !== "global" && (
                <TPSidebar 
                  role={role as any} 
                  sections={navSections} 
                  className="w-full border-none bg-transparent shadow-none"
                  onLogout={() => {
                    setIsMobileMenuOpen(false);
                    onLogout?.();
                  }}
                />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default IntelligenceLayout;

