import { listBoardFromDb } from "@/lib/lead-repository";
import { isMongoConfigured } from "@/lib/mongodb";

export async function GET() {
  if (!isMongoConfigured()) {
    return Response.json({ source: "local" as const });
  }

  try {
    const { leads, activity } = await listBoardFromDb();
    return Response.json({
      source: "mongodb" as const,
      leads,
      activity,
    });
  } catch (err) {
    console.error("[GET /api/leads]", err);
    return Response.json({ source: "local" as const });
  }
}
