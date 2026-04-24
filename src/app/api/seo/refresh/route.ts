import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * PHASE 4: Automated Content Refreshing Hook
 * This API endpoint allows programmatic revalidation of SEO pages.
 * It can be called by a cron job or an external trigger to ensure 
 * content remains fresh in the Next.js cache.
 */

export async function POST(req: NextRequest) {
  try {
    const { paths, secret, revalidateAll } = await req.json();

    // Security check: Ensure secret matches environment variable
    if (secret !== process.env.SEO_REFRESH_SECRET) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (revalidateAll) {
      // Revalidate the entire dynamic segment for tutors
      revalidatePath("/tutors/[slug]", "page");
      return NextResponse.json({
        message: "Global refresh triggered for all SEO pages",
        timestamp: new Date().toISOString()
      });
    }

    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json({ message: "Invalid paths array" }, { status: 400 });
    }

    // Revalidate each provided path
    const results = paths.map((path) => {
      try {
        revalidatePath(path);
        return { path, status: "revalidated" };
      } catch (err) {
        return { path, status: "failed", error: (err as Error).message };
      }
    });

    return NextResponse.json({
      message: "Refresh cycle completed",
      timestamp: new Date().toISOString(),
      results
    });
  } catch (error) {
    return NextResponse.json({ 
      message: "Internal Server Error", 
      error: (error as Error).message 
    }, { status: 500 });
  }
}

// GET method to check health of refresh system
export async function GET() {
  return NextResponse.json({
    status: "active",
    hook_type: "ISR_REVALIDATION",
    version: "1.0.0",
    docs: "Send POST with { paths: string[], secret: string } to revalidate SEO content"
  });
}

