import { sqliteTable, integer, text, primaryKey, foreignKey } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("User", {
  id: integer("id").primaryKey(
    {autoIncrement : true}
  ).notNull(),
  minecraftUUID: text("minecraftUUID"),
  name: text("name"),
});

export const projectTable = sqliteTable("Project", {
  id: integer("id").primaryKey(
    {autoIncrement : true}
  ).notNull(),
  name: text("name"),
  description: text("description"),
  preview: text("preview"),
  ownerId: integer("ownerID").references(() => userTable.id), // Foreign key to User
});

export const projectMemberTable = sqliteTable("ProjectMembers", {
  projectId: integer("projectId").references(() => projectTable.id).notNull(),
  userId: integer("userId").references(() => userTable.id).notNull(),
}, (table) => ({
  pk: primaryKey(table.projectId, table.userId), // Composite primary key for many-to-many relation
}));

export const branchTable = sqliteTable("Branch", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(), // Ensure it's non-null if needed
  schematic: text("schematic").notNull(), // Ensure it's non-null if needed
  projectId: integer("projectId").references(() => projectTable.id).notNull(),
});
export const commitTable = sqliteTable("Commit", {
  id: integer("id").primaryKey({autoIncrement : true}).notNull(),
  schematic: text("schematic").notNull(),
  userId: integer("userId").references(() => userTable.id).notNull(), // Foreign key to User
  timestamp: integer("timestamp").notNull(),
  message: text("message").notNull(),
});

export const commitBranchTable = sqliteTable("CommitBranches", {
  commitId: integer("commitId").references(() => commitTable.id).notNull(),
  branchId: integer("branchId").references(() => commitTable.id).notNull(),
}, (table) => ({
  pk: primaryKey(table.commitId, table.branchId), // Composite primary key for many-to-many relation
}));
