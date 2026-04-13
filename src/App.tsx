import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const AboutUs = lazy(() => import("./pages/AboutUs.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const Courses = lazy(() => import("./pages/Courses.tsx"));
const StudentCounselling = lazy(() => import("./pages/StudentCounselling.tsx"));
const ParentCounselling = lazy(() => import("./pages/ParentCounselling.tsx"));
const PersonalCounselling = lazy(() => import("./pages/PersonalCounselling.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const TutorSeoPage = lazy(() => import("./pages/TutorSeoPage.tsx"));
const DemoBooking = lazy(() => import("./pages/DemoBooking.tsx"));
const BecomeATutor = lazy(() => import("./pages/BecomeATutor.tsx"));
const TutorRegistry = lazy(() => import("./pages/TutorRegistry.tsx"));
const ReportTutor = lazy(() => import("./pages/ReportTutor.tsx"));
const DecisionPage = lazy(() => import("./pages/DecisionPage.tsx"));
const ExamPage = lazy(() => import("./pages/ExamPage.tsx"));

const queryClient = new QueryClient();

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/counselling/student" element={<StudentCounselling />} />
              <Route path="/counselling/parent" element={<ParentCounselling />} />
              <Route path="/counselling/personal" element={<PersonalCounselling />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/tutors/:slug" element={<TutorSeoPage />} />
              <Route path="/demo-booking" element={<DemoBooking />} />
              <Route path="/become-a-tutor" element={<BecomeATutor />} />
              <Route path="/tutor-registry" element={<TutorRegistry />} />
              <Route path="/report-tutor" element={<ReportTutor />} />
              <Route path="/home-tuition-vs-coaching-delhi" element={<DecisionPage />} />
              <Route path="/home-tuition-vs-online-classes-delhi" element={<DecisionPage />} />
              <Route path="/is-home-tuition-worth-it-delhi" element={<DecisionPage />} />
              <Route path="/best-home-tuition-or-coaching-for-class-10-delhi" element={<DecisionPage />} />
              <Route path="/:slug" element={<TutorSeoPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
