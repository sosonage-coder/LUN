import { sql, relations } from "drizzle-orm";
import { index, jsonb, pgTable, timestamp, varchar, boolean, serial, integer } from "drizzle-orm/pg-core";

// User roles enum values
export const USER_ROLES = ["ADMIN", "CONTROLLER", "REVIEWER", "PREPARER"] as const;
export type UserRole = typeof USER_ROLES[number];

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  defaultRole: varchar("default_role", { length: 20 }).default("PREPARER"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Entities (companies/organizations) table
export const entities = pgTable("entities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  description: varchar("description", { length: 500 }),
  currency: varchar("currency", { length: 3 }).default("USD"),
  fiscalYearEnd: varchar("fiscal_year_end", { length: 5 }).default("12-31"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User-Entity role assignments (many-to-many with role per entity)
export const userEntityRoles = pgTable("user_entity_roles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  entityId: integer("entity_id").notNull().references(() => entities.id),
  role: varchar("role", { length: 20 }).notNull().default("PREPARER"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit log table for tracking all changes
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  entityId: integer("entity_id").references(() => entities.id),
  action: varchar("action", { length: 50 }).notNull(),
  tableName: varchar("table_name", { length: 100 }),
  recordId: varchar("record_id", { length: 100 }),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: varchar("user_agent", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  entityRoles: many(userEntityRoles),
}));

export const entitiesRelations = relations(entities, ({ many }) => ({
  userRoles: many(userEntityRoles),
  auditLogs: many(auditLogs),
}));

export const userEntityRolesRelations = relations(userEntityRoles, ({ one }) => ({
  user: one(users, { fields: [userEntityRoles.userId], references: [users.id] }),
  entity: one(entities, { fields: [userEntityRoles.entityId], references: [entities.id] }),
}));

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Entity = typeof entities.$inferSelect;
export type InsertEntity = typeof entities.$inferInsert;
export type UserEntityRole = typeof userEntityRoles.$inferSelect;
export type InsertUserEntityRole = typeof userEntityRoles.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
