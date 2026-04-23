import { MetadataRoute } from 'next';
import { getAllSlugs } from '@/data/seoData';
import { blogPosts } from '@/data/blogPosts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tutorsparliament.com';

  // 1. Core Pages
  const corePages = [
    '',
    '/about',
    '/courses',
    '/blog',
    '/tutors',
    '/faq',
    '/contact',
    '/counselling/student',
    '/counselling/parent',
    '/counselling/personal',
    '/demo-booking',
    '/become-a-tutor',
    '/tutor-registry',
    '/ai-in-education-for-kids-guide',
    '/home-tuition-vs-coaching-delhi',
    '/home-tuition-vs-online-classes-delhi',
    '/is-home-tuition-worth-it-delhi',
    '/best-home-tuition-or-coaching-for-class-10-delhi',
    '/home-tutor-in-delhi',
    '/tuition-in-delhi',
    '/maths-tutor-delhi',
    '/science-tutor-delhi',
    '/cbse-tuition-delhi',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Programmatic SEO Pages (1700+)
  const seoSlugs = getAllSlugs();
  const seoPages = seoSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // 3. Blog Posts
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedDate || post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...corePages, ...seoPages, ...blogPages];
}
