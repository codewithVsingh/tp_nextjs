/**
 * Reusable JSON-LD schema builders for SEO.
 * Keep these pure helpers — no React, no side effects.
 */

const SITE_URL = "https://tutorsparliament.com";

export interface FaqItem {
  question: string;
  answer: string;
}

export const buildFaqSchema = (faqs: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
});

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Tutors Parliament",
  url: SITE_URL,
  logo: `${SITE_URL}/placeholder.svg`,
  sameAs: [
    "https://www.facebook.com/",
    "https://www.linkedin.com/",
  ],
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  description:
    "Student, parent, and personal counselling services available online across India and select in-person locations.",
};

export const buildBreadcrumbSchema = (
  items: { name: string; path: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path}`,
  })),
});
