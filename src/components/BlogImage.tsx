import { useState } from "react";
import { FALLBACK_BLOG_IMAGE } from "@/data/blogPosts";

interface BlogImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** When true, hint the browser to load eagerly (use for above-the-fold images). */
  eager?: boolean;
}

/**
 * Image with graceful fallback. Lazy by default; opt into eager via `eager`.
 */
const BlogImage = ({ src, alt, eager = false, className, ...rest }: BlogImageProps) => {
  const [errored, setErrored] = useState(false);
  return (
    <img
      src={errored ? FALLBACK_BLOG_IMAGE : src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => {
        if (!errored) setErrored(true);
      }}
      className={className}
      {...rest}
    />
  );
};

export default BlogImage;
