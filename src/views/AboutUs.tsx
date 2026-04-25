"use client";

import { motion } from "framer-motion";
import { CheckCircle, Users, Award, BookOpen, Target, Heart, Globe, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { organizationSchema, buildBreadcrumbSchema } from "@/modules/shared/logic/seoMetadataGenerator";
import OSPortalSection from "@/components/OSPortalSection";

const values = [
  {
    icon: Heart,
    title: "Student-First Approach",
    description: "Every decision we make is guided by what's best for our students' growth and success.",
  },
  {
    icon: Target,
    title: "Excellence in Teaching",
    description: "We recruit only the top 3% of educators who demonstrate exceptional subject mastery and teaching skills.",
  },
  {
    icon: Globe,
    title: "Accessible Education",
    description: "Quality education should be available to every student regardless of location or background.",
  },
  {
    icon: Lightbulb,
    title: "Innovation in Learning",
    description: "We continuously adopt the latest pedagogical methods and technology to enhance learning outcomes.",
  },
];

const milestones = [
  { year: "2018", event: "Founded with a vision to democratize quality education across India" },
  { year: "2019", event: "Reached 1,000 students and onboarded 50+ expert tutors" },
  { year: "2020", event: "Launched comprehensive online platform during COVID-19, helping 5,000+ students" },
  { year: "2021", event: "Expanded to cover 30+ competitive exam categories" },
  { year: "2022", event: "Crossed 8,000 students with a 95% satisfaction rate" },
  { year: "2023", event: "Introduced AI-powered personalized learning plans" },
  { year: "2024", event: "10,000+ students trained, 500+ expert tutors, India's fastest-growing tutoring platform" },
  {
    year: "2026",
    event:
      "Expanded to a true Pan-India presence — 15,000+ students impacted and 2,500+ verified tutors across 50+ cities. Launched our AI-driven counselling and learning ecosystem with dedicated career guidance and mental wellness tracks.",
  },
];

const team = [
  { name: "Amit Verma", role: "Founder & CEO", bio: "Former IAS officer with a passion for transforming education through technology.", initials: "AV" },
  { name: "Dr. Meera Iyer", role: "Chief Academic Officer", bio: "PhD in Education with 20+ years of curriculum design experience.", initials: "MI" },
  { name: "Ravi Krishnan", role: "Head of Technology", bio: "Ex-Google engineer building scalable learning platforms.", initials: "RK" },
  { name: "Priyanka Das", role: "Head of Student Success", bio: "Dedicated to ensuring every student achieves their academic goals.", initials: "PD" },
];

const AboutUs = () => {
  return (
    <>
      <SEOHead
        title="About Tutors Parliament — India's Trusted Tutoring Platform"
        description="Tutors Parliament connects students across India with expert tutors and counsellors. Learn about our mission, story, and the team building India's leading learning platform."
        canonical="https://tutorsparliament.com/about"
        keywords="about Tutors Parliament, India tutoring platform, online tuition company, expert tutors India"
        structuredData={[
          organizationSchema,
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
          ]),
        ]}
      />
      
      <main>
        {/* Hero */}
        <section className="pt-24 pb-16 section-padding" style={{ background: "var(--hero-gradient)" }}>
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight mb-6">
                More Than Just Coaching —{" "}
                <span className="text-secondary">We Build Futures.</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed">
                Tutors Parliament is a learning ecosystem designed to help students excel through
                personalized mentorship, structured programs, and measurable outcomes. We connect
                students with India's best educators to unlock their true potential.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative z-10 -mt-8">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-background rounded-2xl card-shadow p-6 md:p-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Users, value: "15,000+", label: "Students Impacted" },
                  { icon: Award, value: "95%", label: "Success Rate" },
                  { icon: BookOpen, value: "2,500+", label: "Expert Tutors" },
                  { icon: Target, value: "50+", label: "Cities Pan-India" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-heading font-extrabold text-3xl text-primary">{stat.value}</p>
                    <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Ecosystem Portals */}
        <OSPortalSection />

        {/* Our Story */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Story</span>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2 mb-6">
                  Born From a Simple Belief:{" "}
                  <span className="text-primary">Every Student Deserves the Best.</span>
                </h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    Tutors Parliament was founded in 2018 with a singular mission — to bridge the gap between 
                    students and quality education. We noticed that access to top-tier coaching was limited to 
                    metro cities, leaving millions of talented students underserved.
                  </p>
                  <p>
                    Our founders, themselves products of India's competitive exam ecosystem, understood the 
                    struggles firsthand. They built Tutors Parliament as a platform where geography is no 
                    barrier to excellence, where every student can learn from the best educators in the country.
                  </p>
                  <p>
                    Today, we've grown from a small team of 5 tutors to a thriving community of 500+ expert 
                    educators and 10,000+ successful students, all united by the belief that the right guidance 
                    at the right time can change lives.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-accent rounded-2xl p-8">
                  <h3 className="font-heading font-bold text-xl text-foreground mb-6">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    To democratize quality education by connecting students with expert tutors through 
                    a technology-driven, personalized learning platform that delivers measurable results.
                  </p>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-4">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To become India's most trusted education platform where every student, regardless 
                    of background, has the tools and mentorship to achieve academic excellence and 
                    build a successful future.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding section-alt">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Values</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">
                What <span className="text-primary">Drives Us</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-background rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow duration-300 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
                    <value.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-padding">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Journey</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">
                Key <span className="text-primary">Milestones</span>
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-6">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex gap-4 items-start"
                >
                  <div className="shrink-0 w-16 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">{m.year}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pt-1">{m.event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding section-alt">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Leadership</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2">
                Meet Our <span className="text-primary">Team</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-background rounded-2xl p-6 card-shadow text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-2xl">{member.initials}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground">{member.name}</h3>
                  <p className="text-secondary text-sm font-medium mt-1">{member.role}</p>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl p-12 md:p-16 text-center"
              style={{ background: "var(--hero-gradient)" }}
            >
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-foreground mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                Join 10,000+ students who trust Tutors Parliament for their academic success.
              </p>
              <Button variant="hero" size="lg" className="text-base px-10 py-6" asChild>
                <a href="/demo-booking">Start Free Demo</a>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      

    </>
  );
};

export default AboutUs;


