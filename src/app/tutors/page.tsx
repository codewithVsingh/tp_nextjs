import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { subjects, areas } from "@/data/seoData";
import { MapPin, BookOpen, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Browse Home Tutors by Subject and Area | Tutors Parliament",
  description: "Explore our comprehensive directory of home tutors across Delhi NCR. Find the best tutors for all subjects, classes, and boards near you.",
};

export default function TutorsHubPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Find Your Perfect Tutor
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse over 1,700+ specialized tutoring pages across Delhi, Noida, Gurgaon, and more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Subjects Column */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-heading font-bold text-foreground">Browse by Subject</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {subjects.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/tutors/${s.slug}-delhi`}
                    className="p-4 rounded-xl border border-border bg-background hover:border-primary hover:text-primary transition-all group flex items-center justify-between"
                  >
                    <span className="font-medium">{s.name}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Locations Column */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-heading font-bold text-foreground">Browse by Location</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {areas.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/home-tuition-in-${a.slug}`}
                    className="p-4 rounded-xl border border-border bg-background hover:border-primary hover:text-primary transition-all group flex items-center justify-between"
                  >
                    <span className="font-medium">{a.name}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

