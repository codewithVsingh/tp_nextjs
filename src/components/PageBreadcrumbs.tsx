import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
}

interface PageBreadcrumbsProps {
  items: BreadcrumbCrumb[];
  /** Apply light text colors when used over a dark hero background. */
  variant?: "default" | "onDark";
  className?: string;
}

/**
 * Visible breadcrumb UI. Pair with `buildBreadcrumbSchema` for SEO.
 * Renders nothing if fewer than 2 items are provided.
 */
const PageBreadcrumbs = ({ items, variant = "default", className = "" }: PageBreadcrumbsProps) => {
  if (!items || items.length < 2) return null;

  const isDark = variant === "onDark";
  const linkClass = isDark
    ? "text-primary-foreground/60 hover:text-primary-foreground"
    : "text-muted-foreground hover:text-foreground";
  const pageClass = isDark
    ? "text-primary-foreground/80 truncate max-w-[240px]"
    : "text-foreground truncate max-w-[240px]";
  const sepClass = isDark ? "text-primary-foreground/40" : undefined;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <React.Fragment key={`${item.label}-${i}`}>
              {i > 0 && <BreadcrumbSeparator className={sepClass} />}
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className={pageClass}>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageBreadcrumbs;
