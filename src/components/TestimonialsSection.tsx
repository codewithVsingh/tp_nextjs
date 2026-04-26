import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await supabase
          .from("testimonials")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(20);
        
        if (data) setTestimonials(data);
      } catch (e) {
        console.error("Failed to fetch testimonials", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <section id="testimonials" className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">
            What Our <span className="text-primary">Students & Parents Say</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Real reviews from students and families across Delhi NCR</p>
        </motion.div>

        <div className="relative group">
          <button
            onClick={scrollPrev}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background card-shadow flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background card-shadow flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-6">
              {testimonials.map((t, i) => (
                <div key={i} className="min-w-0 shrink-0 grow-0 pl-6 basis-full md:basis-1/2 transition-all duration-500">
                  <div className={`bg-background rounded-2xl p-6 md:p-8 card-shadow hover:card-shadow-hover transition-all duration-300 relative ${selectedIndex === i ? "scale-[1.02] shadow-lg" : "scale-100"}`}>
                    <Quote className="w-8 h-8 text-accent absolute top-6 right-6 opacity-40" />
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shrink-0 border-2 border-background shadow-sm ${
                        t.type === "parent" ? "bg-secondary" : 
                        t.type === "tutor" ? "bg-emerald-500" :
                        t.type === "learner" ? "bg-slate-700" : "bg-primary"
                      }`}>
                        {t.avatar_url ? (
                          <img src={t.avatar_url} alt={t.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-primary-foreground font-bold text-sm">{t.initials}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-semibold text-foreground">{t.name}</h4>
                          {t.created_at && (new Date().getTime() - new Date(t.created_at).getTime() < 7 * 24 * 60 * 60 * 1000) && (
                            <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest animate-pulse">New</span>
                          )}
                        </div>
                        <p className="text-secondary text-sm font-medium">{t.result}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm">{t.text}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
                        ))}
                      </div>
                      {t.verified && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verified Google Review
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === selectedIndex ? "bg-primary w-6" : "bg-muted-foreground/30"}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

