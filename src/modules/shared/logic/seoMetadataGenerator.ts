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

export interface ArticleSchemaInput {
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  url: string;
}

export const buildArticleSchema = ({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName = "Tutors Parliament",
  url,
}: ArticleSchemaInput) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline,
  description,
  image: image ? [image] : undefined,
  datePublished,
  dateModified: dateModified || datePublished,
  author: { "@type": "Organization", name: authorName },
  publisher: {
    "@type": "Organization",
    name: "Tutors Parliament",
    logo: { "@type": "ImageObject", url: `${SITE_URL}/placeholder.svg` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": url },
});

export const buildLocalBusinessSchema = ({
  name,
  area,
  description,
  url,
  image
}: {
  name: string;
  area: string;
  description: string;
  url: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name,
  image: image || `${SITE_URL}/placeholder.svg`,
  "@id": url,
  url: url,
  telephone: "+91-1234567890", // Placeholder or dynamic if available
  address: {
    "@type": "PostalAddress",
    streetAddress: area,
    addressLocality: "New Delhi",
    addressRegion: "Delhi",
    postalCode: "110001", // Should be dynamic from area data
    addressCountry: "IN"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.6139,
    longitude: 77.2090
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ],
    opens: "08:00",
    closes: "21:00"
  },
  description
});

