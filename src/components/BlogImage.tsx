import { useState } from "react";
import Image from "next/image";
import { FALLBACK_BLOG_IMAGE } from "@/data/blogPosts";

interface BlogImageProps {
  src: string;
  alt: string;
  /** When true, hint the browser to load eagerly (use for above-the-fold images). */
  eager?: boolean;
  className?: string;
}

/**
 * Image with Next.js optimization and graceful fallback.
 */
const BlogImage = ({ src, alt, eager = false, className }: BlogImageProps) => {
  const [errored, setErrored] = useState(false);

  return (
    <Image
      src={errored ? FALLBACK_BLOG_IMAGE : src}
      alt={alt}
      fill
      priority={eager}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => {
        if (!errored) setErrored(true);
      }}
      className={className}
      style={{ objectFit: "cover" }}
    />
  );
};

export default BlogImage;


