import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, blockConfigs, BlockConfig, InsertBlockConfig } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Block configuration queries
export async function createBlockConfig(config: InsertBlockConfig): Promise<BlockConfig | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create block config: database not available");
    return null;
  }

  try {
    const result = await db.insert(blockConfigs).values(config);
    const id = (result as any).insertId;
    
    if (id) {
      const created = await db.select().from(blockConfigs).where(eq(blockConfigs.id, id)).limit(1);
      return created.length > 0 ? created[0] : null;
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create block config:", error);
    throw error;
  }
}

export async function updateBlockConfig(id: number, config: Partial<InsertBlockConfig>): Promise<BlockConfig | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update block config: database not available");
    return null;
  }

  try {
    await db.update(blockConfigs).set(config).where(eq(blockConfigs.id, id));
    
    const updated = await db.select().from(blockConfigs).where(eq(blockConfigs.id, id)).limit(1);
    return updated.length > 0 ? updated[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update block config:", error);
    throw error;
  }
}

export async function getBlockConfigById(id: number): Promise<BlockConfig | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get block config: database not available");
    return null;
  }

  try {
    const result = await db.select().from(blockConfigs).where(eq(blockConfigs.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get block config:", error);
    throw error;
  }
}

export async function getUserBlockConfigs(userId: number): Promise<BlockConfig[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user block configs: database not available");
    return [];
  }

  try {
    const result = await db.select().from(blockConfigs).where(eq(blockConfigs.userId, userId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get user block configs:", error);
    throw error;
  }
}

export async function deleteBlockConfig(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete block config: database not available");
    return false;
  }

  try {
    await db.delete(blockConfigs).where(eq(blockConfigs.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete block config:", error);
    throw error;
  }
}
