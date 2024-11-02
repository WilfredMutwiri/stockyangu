import { Request } from "express";
import { PaginationMeta } from "../types/api";
function getPaginationMeta({
  total,
  returnedCount,
  req,
}: {
  req: Request;
  total: number;
  returnedCount: number;
}): PaginationMeta {
  const { limit, offset, page } = req.pagination;
  const originalUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

  const pagesCount = limit > 0 ? Math.ceil(total / limit) : 1;
  const hasNext = offset + limit < total;
  const hasPrev = offset > 0;

  console.log(originalUrl, " in pagination meta function");
  const url = new URL(originalUrl);

  let nextUrl: string | null = null;
  let prevUrl: string | null = null;

  // Generate next URL with pagination parameters
  if (hasNext) {
    const next = new URL(url.toString());
    next.searchParams.set("page", String(page + 1));
    nextUrl = next.toString();
  }

  // Generate previous URL with pagination parameters
  if (hasPrev) {
    const prev = new URL(url.toString());
    prev.searchParams.set("page", String(page - 1));
    prevUrl = prev.toString();
  }

  const currentUrl = new URL(url.toString());
  currentUrl.searchParams.set("page", String(page));
  currentUrl.searchParams.set("limit", String(limit));

  return {
    current_page: page,
    has_next: hasNext,
    has_prev: hasPrev,
    available_count: total,
    returned_count: returnedCount,
    pages_count: pagesCount,
    links: {
      next: nextUrl,
      prev: prevUrl,
      self: currentUrl.toString(), // Keeps original pagination parameters intact
    },
  };
}

export { getPaginationMeta };
