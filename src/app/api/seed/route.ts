import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  try {
    const records = await db.insert(advocates).values(advocateData).returning();
    console.log("Successfully seeded:", records.length, "advocates");
    return Response.json({ success: true, advocates: records });
  } catch (error: any) {
    console.error("Seeding failed:", {
      message: error.message,
      detail: error.detail,
      hint: error.hint,
      code: error.code,
    });
    return Response.json(
      {
        success: false,
        error: {
          message: error.message,
          detail: error.detail,
          code: error.code,
        },
      },
      { status: 500 }
    );
  }
}
