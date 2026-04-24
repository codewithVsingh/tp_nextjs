import PageComponent from '@/views/TutorSeoPage';
import { parseSlug } from '@/data/seoData';
import { getOptimizedMeta } from '@/data/seoContentGenerator';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const pageData = parseSlug(params.slug);
  if (!pageData) return { title: 'Tutors Parliament' };
  
  const { title, description } = getOptimizedMeta(pageData);
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: ['/icon.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/icon.png'],
    },
  };
}

export default function Page() {
  return <PageComponent />;
}

export const revalidate = 86400;

