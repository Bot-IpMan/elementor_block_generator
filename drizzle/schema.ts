import { mysqlEnum, int, mysqlTable, text, timestamp, varchar, json, boolean } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).notNull().default("user"),
  createdAt: timestamp("createdAt").notNull().default(sql`now()`),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .default(sql`now()`)
    .onUpdateNow(),
  lastSignedIn: timestamp("lastSignedIn").notNull().default(sql`now()`),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type TemplateType =
  | "pricing_card"
  | "feature_list"
  | "hero_section"
  | "testimonial"
  | "cta_section"
  | "team_member"
  | "service_card"
  | "custom";

export type BlockItem = {
  id: string;
  type: "text" | "stat" | "icon";
  content: string;
  icon?: string;
  children?: BlockItem[];
};

export type BlockButton = {
  text: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  padding?: number;
};

export type BlockConfigData = {
  title: string;
  subtitle?: string;
  description?: string;
  colors: {
    background: string;
    backgroundGradient?: string;
    textPrimary: string;
    textSecondary: string;
    accentColor: string;
    borderColor: string;
  };
  typography: {
    fontFamily: string;
    titleSize: number;
    subtitleSize: number;
    bodySize: number;
    lineHeight: number;
  };
  spacing: {
    padding: number;
    margin: number;
    borderRadius: number;
    gap: number;
  };
  effects: {
    shadow: string;
    opacity: number;
    borderWidth: number;
  };
  content: {
    items: BlockItem[];
    button?: BlockButton;
  };
  responsive?: {
    mobileView: boolean;
    tabletView: boolean;
    desktopView: boolean;
  };
};

export const blockConfigs = mysqlTable("block_configs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  templateType: mysqlEnum("templateType", [
    "pricing_card",
    "feature_list",
    "hero_section",
    "testimonial",
    "cta_section",
    "team_member",
    "service_card",
    "custom",
  ])
    .notNull()
    .default("custom"),
  config: json("config").$type<BlockConfigData>().notNull(),
  generatedHtml: text("generatedHtml"),
  generatedCss: text("generatedCss"),
  isPublic: boolean("isPublic").default(false),
  createdAt: timestamp("createdAt").notNull().default(sql`now()`),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .default(sql`now()`)
    .onUpdateNow(),
});

export type BlockConfig = typeof blockConfigs.$inferSelect;
export type InsertBlockConfig = typeof blockConfigs.$inferInsert;
