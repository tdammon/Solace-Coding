import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import db from "../../../db";
import { advocates } from "../../../db/schema";

const getAdvocates = unstable_cache(
  async () => {
    const advocatesList = await db.select().from(advocates);
    return advocatesList;
  },
  ["advocates"],
  {
    revalidate: 3600,
    tags: ["advocates"],
  }
);

const RATE_LIMIT = 100;
const WINDOW_MS = 60 * 1000;
const ipRequests = new Map<string, number>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = ipRequests.get(ip) || 0;
  ipRequests.set(ip, requests + 1);

  setTimeout(() => ipRequests.delete(ip), WINDOW_MS);
  return requests < RATE_LIMIT;
}

export async function GET() {
  const ip = headers().get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const data = await getAdvocates();
    return Response.json({ data });
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}
