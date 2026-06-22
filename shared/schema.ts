import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// Roles: "owner" | "vet" | "care_provider"
// ─────────────────────────────────────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),                        // UUID
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull(),                       // "owner" | "vet" | "care_provider"
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  // Vet-specific
  licenseNumber: text("license_number"),
  practice: text("practice"),
  // Care provider-specific
  credentialType: text("credential_type"),            // "Farrier" | "Chiropractor" | "Dentist" | "Trainer" | "Other"
  // Timestamps
  createdAt: text("created_at").notNull(),
  lastLogin: text("last_login"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, lastLogin: true });
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMALS
// ─────────────────────────────────────────────────────────────────────────────
export const animals = sqliteTable("animals", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  species: text("species").notNull().default("equine"),
  breed: text("breed").notNull(),
  sex: text("sex").notNull(),
  dob: text("dob").notNull(),
  color: text("color").notNull().default(""),
  microchip: text("microchip"),
  ownerId: text("owner_id").notNull(),               // FK → users.id
  openingSummary: text("opening_summary").notNull().default(""),
  patientStatus: text("patient_status").notNull().default("stable"),
  activeConditions: text("active_conditions").notNull().default("[]"),   // JSON []
  activeMedications: text("active_medications").notNull().default("[]"), // JSON []
  nextScheduledCare: text("next_scheduled_care").notNull().default("[]"),// JSON []
  primaryVet: text("primary_vet").notNull().default(""),
  barn: text("barn").notNull().default(""),
  discipline: text("discipline"),
  createdAt: text("created_at").notNull(),
});

export const insertAnimalSchema = createInsertSchema(animals).omit({ id: true, createdAt: true });
export type Animal = typeof animals.$inferSelect;
export type InsertAnimal = z.infer<typeof insertAnimalSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// CARE TEAM (current providers per animal)
// ─────────────────────────────────────────────────────────────────────────────
export const careTeam = sqliteTable("care_team", {
  id: text("id").primaryKey(),
  animalId: text("animal_id").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  practice: text("practice"),
  phone: text("phone"),
  email: text("email"),
  lastContact: text("last_contact"),
  accessLevel: text("access_level").notNull().default("READ"), // "READ" | "READ+APPEND" | "READ+WRITE"
  userId: text("user_id"),                           // FK → users.id (null if not yet on platform)
});

export type CareTeamMember = typeof careTeam.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// TIMELINE RECORDS
// ─────────────────────────────────────────────────────────────────────────────
export const records = sqliteTable("records", {
  id: text("id").primaryKey(),
  animalId: text("animal_id").notNull(),
  authorId: text("author_id"),                       // FK → users.id
  date: text("date").notNull(),
  season: text("season").notNull(),
  type: text("type").notNull(),                      // "lab" | "imaging" | "vet_note" | "routine" | "document"
  title: text("title").notNull(),
  provider: text("provider").notNull(),
  practice: text("practice"),
  isSignificant: integer("is_significant", { mode: "boolean" }).notNull().default(false),
  isSorted: integer("is_sorted", { mode: "boolean" }).notNull().default(true),
  summary: text("summary").notNull(),
  content: text("content").notNull().default("{}"),  // JSON
  // S3 file attachment (stub — wired by engineering team)
  fileKey: text("file_key"),                         // S3 object key
  fileName: text("file_name"),
  fileType: text("file_type"),                       // MIME type
  createdAt: text("created_at").notNull(),
});

export const insertRecordSchema = createInsertSchema(records).omit({ id: true, createdAt: true });
export type Record = typeof records.$inferSelect;
export type InsertRecord = z.infer<typeof insertRecordSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// INVITATIONS
// Owner creates → shares token → vet/provider claims → access granted
// ─────────────────────────────────────────────────────────────────────────────
export const invitations = sqliteTable("invitations", {
  id: text("id").primaryKey(),                       // UUID
  token: text("token").notNull().unique(),           // URL-safe random token
  animalId: text("animal_id").notNull(),             // which horse
  ownerId: text("owner_id").notNull(),               // FK → users.id (who created)
  invitedEmail: text("invited_email"),               // optional — pre-fill signup
  intendedRole: text("intended_role").notNull(),     // "vet" | "care_provider"
  accessLevel: text("access_level").notNull().default("READ+WRITE"),
  status: text("status").notNull().default("pending"), // "pending" | "claimed" | "expired"
  claimedByUserId: text("claimed_by_user_id"),       // FK → users.id
  createdAt: text("created_at").notNull(),
  expiresAt: text("expires_at").notNull(),           // 30 days
  claimedAt: text("claimed_at"),
});

export type Invitation = typeof invitations.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// ACCESS GRANTS
// Explicit record of which user can access which animal, and at what level
// Created when an invitation is claimed
// ─────────────────────────────────────────────────────────────────────────────
export const accessGrants = sqliteTable("access_grants", {
  id: text("id").primaryKey(),
  animalId: text("animal_id").notNull(),
  userId: text("user_id").notNull(),                 // FK → users.id (grantee)
  grantedByUserId: text("granted_by_user_id").notNull(), // FK → users.id (owner)
  accessLevel: text("access_level").notNull(),       // "READ" | "READ+APPEND" | "READ+WRITE"
  role: text("role").notNull(),                      // "vet" | "care_provider"
  createdAt: text("created_at").notNull(),
  revokedAt: text("revoked_at"),                     // null = active
});

export type AccessGrant = typeof accessGrants.$inferSelect;

// ───────────────────────────────────────────────────────────────────────────────
// EMERGENCY ACCESS TOKENS
// Public, no-login read-only record access for time-critical vet situations.
// Owner generates a token for a specific horse. Any vet with the link can view
// the full read-only record immediately, with a soft prompt to create an account.
// Token auto-expires; owner can revoke at any time.
// ───────────────────────────────────────────────────────────────────────────────
export const emergencyAccess = sqliteTable("emergency_access", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),           // URL-safe random token
  animalId: text("animal_id").notNull(),             // which horse
  ownerId: text("owner_id").notNull(),               // FK → users.id
  label: text("label").notNull().default(""),        // owner note: "WEF Show", "Transit to OH", "Emergency"
  context: text("context").notNull().default("emergency"), // "emergency" | "show" | "transit" | "pre-authorized"
  durationDays: integer("duration_days").notNull().default(60),
  status: text("status").notNull().default("active"), // "active" | "revoked" | "expired"
  accessCount: integer("access_count").notNull().default(0), // how many times the link was opened
  lastAccessedAt: text("last_accessed_at"),
  createdAt: text("created_at").notNull(),
  expiresAt: text("expires_at").notNull(),
  revokedAt: text("revoked_at"),
});

export type EmergencyAccess = typeof emergencyAccess.$inferSelect;
