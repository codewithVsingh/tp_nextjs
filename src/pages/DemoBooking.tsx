import { useState, useEffect } from "react";
import { openWhatsApp, getWhatsAppUrl } from "@/lib/whatsapp";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowLeft, ArrowRight, MessageCircle, Users, GraduationCap, BookOpen, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";

const PHONE = "+91-9873101564";

const classOptions = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6",
  "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12",
  "JEE", "NEET", "CUET",
];

const boardOptions = ["CBSE", "ICSE", "IGCSE", "IB", "State Board"];

const subjectOptions = [
  "Mathematics", "Science", "Physics", "Chemistry", "Biology",
  "English", "Hindi", "Social Studies", "Accounts", "Economics",
  "Computer Science", "French", "German", "Spanish",
];

const goalOptions = [
  { label: "Improve Marks", icon: "📈" },
  { label: "Exam Preparation", icon: "🎯" },
  { label: "Concept Clarity", icon: "💡" },
  { label: "Homework Help", icon: "📝" },
];

const timeSlots = [
  "Morning (8 AM – 12 PM)",
  "Afternoon (12 PM – 4 PM)",
  "Evening (4 PM – 8 PM)",
  "Flexible",
];

const modeOptions = [
  { label: "Online", icon: "💻" },
  { label: "Home Tutor", icon: "🏠" },
  { label: "Both", icon: "🔄" },
];

interface FormState {
  phone: string;
  name: string;
  userType: string;
  studentClass: string;
  board: string;
  subjects: string[];
  goal: string;
  timeSlot: string;
  mode: string;
}

const DemoBooking = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState<FormState>({
    phone: "",
    name: "",
    userType: "",
    studentClass: "",
    board: "",
    subjects: [],
    goal: "",
    timeSlot: "",
    mode: "",
  });

  useEffect(() => {
    const phone = searchParams.get("phone") || "";
    const name = searchParams.get("name") || "";
    if (phone || name) {
      setFormData((prev) => ({ ...prev, phone, name }));
    }
  }, [searchParams]);

  const progress = (step / totalSteps) * 100;

  const toggleSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.userType;
      case 2: return !!formData.studentClass && !!formData.board;
      case 3: return formData.subjects.length > 0 && !!formData.goal;
      case 4: return !!formData.timeSlot && !!formData.mode;
      default: return false;
    }
  };

  const buildWhatsAppMessage = () => {
    const lines = [
      `Hi, I'd like to book a free demo class.`,
      formData.name ? `Name: ${formData.name}` : "",
      `Phone: ${formData.phone}`,
      `I'm a: ${formData.userType}`,
      `Class: ${formData.studentClass}`,
      `Board: ${formData.board}`,
      `Subjects: ${formData.subjects.join(", ")}`,
      `Goal: ${formData.goal}`,
      `Preferred Time: ${formData.timeSlot}`,
      `Mode: ${formData.mode}`,
    ].filter(Boolean).join("\n");
    return lines;
  };

  const stepIcons = [Users, GraduationCap, BookOpen, Calendar];

  const OptionButton = ({ selected, onClick, children, className = "" }: {
    selected: boolean; onClick: () => void; children: React.ReactNode; className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
        selected
          ? "border-primary bg-accent text-accent-foreground shadow-sm"
          : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent/30"
      } ${className}`}
    >
      {children}
    </button>
  );

  return (
    <>
      <SEOHead
        title="Book Free Demo | Tutors Parliament"
        description="Book your free demo class with Tutors Parliament. Get matched with expert tutors in Delhi for personalized learning."
        keywords="book demo tutor Delhi, free tuition demo class, home tutor demo"
      />
      <Navbar />
      <main className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {stepIcons.map((Icon, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    i + 1 <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Step {step} of {totalSteps}
            </p>
          </div>

          {/* Steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <div>
                  <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
                    Who is this for?
                  </h1>
                  <p className="text-muted-foreground mb-6">Select your role to personalize your experience</p>
                  <div className="grid grid-cols-2 gap-4">
                    <OptionButton
                      selected={formData.userType === "Parent"}
                      onClick={() => setFormData({ ...formData, userType: "Parent" })}
                      className="text-center py-8"
                    >
                      <div className="text-4xl mb-2">👨‍👩‍👧</div>
                      <div className="font-semibold">I'm a Parent</div>
                    </OptionButton>
                    <OptionButton
                      selected={formData.userType === "Student"}
                      onClick={() => setFormData({ ...formData, userType: "Student" })}
                      className="text-center py-8"
                    >
                      <div className="text-4xl mb-2">🎓</div>
                      <div className="font-semibold">I'm a Student</div>
                    </OptionButton>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
                    Student Details
                  </h2>
                  <p className="text-muted-foreground mb-6">Help us find the right tutor</p>
                  <div className="space-y-6">
                    <div>
                      <label className="block font-medium text-foreground mb-3 text-sm">Class</label>
                      <div className="grid grid-cols-3 gap-2">
                        {classOptions.map((cls) => (
                          <OptionButton
                            key={cls}
                            selected={formData.studentClass === cls}
                            onClick={() => setFormData({ ...formData, studentClass: cls })}
                            className="text-center py-3 text-sm"
                          >
                            {cls}
                          </OptionButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium text-foreground mb-3 text-sm">Board</label>
                      <div className="grid grid-cols-3 gap-2">
                        {boardOptions.map((board) => (
                          <OptionButton
                            key={board}
                            selected={formData.board === board}
                            onClick={() => setFormData({ ...formData, board })}
                            className="text-center py-3 text-sm"
                          >
                            {board}
                          </OptionButton>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
                    Learning Needs
                  </h2>
                  <p className="text-muted-foreground mb-6">Select subjects and your goal</p>
                  <div className="space-y-6">
                    <div>
                      <label className="block font-medium text-foreground mb-3 text-sm">Subjects (select multiple)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {subjectOptions.map((subject) => (
                          <OptionButton
                            key={subject}
                            selected={formData.subjects.includes(subject)}
                            onClick={() => toggleSubject(subject)}
                            className="text-center py-3 text-sm"
                          >
                            {subject}
                          </OptionButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium text-foreground mb-3 text-sm">Goal</label>
                      <div className="grid grid-cols-2 gap-2">
                        {goalOptions.map((goal) => (
                          <OptionButton
                            key={goal.label}
                            selected={formData.goal === goal.label}
                            onClick={() => setFormData({ ...formData, goal: goal.label })}
                            className="text-center py-3 text-sm"
                          >
                            <span className="mr-1">{goal.icon}</span> {goal.label}
                          </OptionButton>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
                    Schedule Your Demo
                  </h2>
                  <p className="text-muted-foreground mb-6">Almost done! Pick your preferences</p>
                  <div className="space-y-6">
                    <div>
                      <label className="block font-medium text-foreground mb-3 text-sm">Preferred Time</label>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot) => (
                          <OptionButton
                            key={slot}
                            selected={formData.timeSlot === slot}
                            onClick={() => setFormData({ ...formData, timeSlot: slot })}
                            className="text-center py-3 text-sm"
                          >
                            {slot}
                          </OptionButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium text-foreground mb-3 text-sm">Mode of Learning</label>
                      <div className="grid grid-cols-3 gap-2">
                        {modeOptions.map((mode) => (
                          <OptionButton
                            key={mode.label}
                            selected={formData.mode === mode.label}
                            onClick={() => setFormData({ ...formData, mode: mode.label })}
                            className="text-center py-4 text-sm"
                          >
                            <div className="text-2xl mb-1">{mode.icon}</div>
                            {mode.label}
                          </OptionButton>
                        ))}
                      </div>
                    </div>

                    {/* Contact info recap */}
                    {(formData.phone || formData.name) && (
                      <div className="p-4 rounded-xl bg-muted/50 border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Your details</p>
                        {formData.name && <p className="text-sm font-medium text-foreground">{formData.name}</p>}
                        {formData.phone && <p className="text-sm text-muted-foreground">{formData.phone}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            {step < totalSteps ? (
              <Button
                variant="cta"
                size="lg"
                className="flex-1"
                disabled={!canProceed()}
                onClick={() => setStep(step + 1)}
              >
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                variant="cta"
                size="lg"
                className="flex-1 bg-[#25D366] hover:bg-[#20bd5a]"
                disabled={!canProceed()}
                onClick={() => openWhatsApp(buildWhatsAppMessage())}
              >
                <MessageCircle className="w-5 h-5 mr-2" /> Continue on WhatsApp
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            🔒 Your information is secure and never shared
          </p>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default DemoBooking;
