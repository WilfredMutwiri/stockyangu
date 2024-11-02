import { PaginationMeta } from "../types/api";
function getPaginationMeta({
  originalUrl,
  limit,
  offset,
  page,
  total,
  returnedCount,
}: {
  originalUrl: string;
  limit: number;
  offset: number;
  page: number;
  total: number;
  returnedCount: number;
}): PaginationMeta {
  const pagesCount = limit > 0 ? Math.ceil(total / limit) : 1;
  const hasNext = offset + limit < total;
  const hasPrev = offset > 0;

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
      self: url.toString(), // Keeps original pagination parameters intact
    },
  };
}

export { getPaginationMeta };
