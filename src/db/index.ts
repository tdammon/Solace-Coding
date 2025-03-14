import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const setup = () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return {
      select: () => ({
        from: () => [],
      }),
    };
  }

  try {
    const queryClient = postgres(process.env.DATABASE_URL, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
      ssl: true,
    });
    const db = drizzle(queryClient);
    return db;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

export default setup();
