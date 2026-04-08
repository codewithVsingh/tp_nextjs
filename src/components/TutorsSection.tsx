import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const tutors = [
  { name: "Dr. Priya Sharma", expertise: "UPSC & Political Science", experience: "15+ Years", initials: "PS" },
  { name: "Rajesh Kumar", expertise: "Mathematics & Banking", experience: "12+ Years", initials: "RK" },
  { name: "Anita Desai", expertise: "English & SSC", experience: "10+ Years", initials: "AD" },
  { name: "Vikram Singh", expertise: "Science & School Board", experience: "8+ Years", initials: "VS" },
  { name: "Meera Joshi", expertise: "Chemistry & JEE", experience: "11+ Years", initials: "MJ" },
  { name: "Sunil Verma", expertise: "Physics & NEET", experience: "14+ Years", initials: "SV" },
];

const TutorsSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })]
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
    <section id="tutors" className="section-padding section-alt">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Tutors</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">
            Learn from the <span className="text-primary">Best Educators</span>
          </h2>
        </motion.div>

        <div className="relative group">
          {/* Arrows */}
          <button
            onClick={scrollPrev}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background card-shadow flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Previous tutors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background card-shadow flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Next tutors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {tutors.map((tutor, i) => (
                <div
                  key={i}
                  className="min-w-0 shrink-0 grow-0 pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 transition-transform duration-500"
                >
                  <div
                    className={`bg-background rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 text-center ${
                      selectedIndex === i ? "scale-[1.03]" : "scale-100"
                    }`}
                  >
                    <div className="w-20 h-20 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-2xl">{tutor.initials}</span>
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground">{tutor.name}</h3>
                    <p className="text-primary text-sm font-medium mt-1">{tutor.expertise}</p>
                    <p className="text-muted-foreground text-sm mt-1">{tutor.experience}</p>
                    <Button variant="outline" className="mt-4 w-full">
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutorsSection;
