import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, and, isNull } from "drizzle-orm";
import { randomUUID } from "crypto";
import {
  users, animals, careTeam, records, invitations, accessGrants, emergencyAccess,
} from "@shared/schema";
import type {
  User, InsertUser,
  Animal, InsertAnimal,
  Record, InsertRecord,
  Invitation, AccessGrant, EmergencyAccess,
} from "@shared/schema";

// ─── Database connection ──────────────────────────────────────────────────────
const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");
export const db = drizzle(sqlite);

// ─── Bootstrap tables (create if not exist) ───────────────────────────────────
export function initDB() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      license_number TEXT,
      practice TEXT,
      credential_type TEXT,
      created_at TEXT NOT NULL,
      last_login TEXT
    );

    CREATE TABLE IF NOT EXISTS animals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      species TEXT NOT NULL DEFAULT 'equine',
      breed TEXT NOT NULL,
      sex TEXT NOT NULL,
      dob TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '',
      microchip TEXT,
      owner_id TEXT NOT NULL,
      opening_summary TEXT NOT NULL DEFAULT '',
      patient_status TEXT NOT NULL DEFAULT 'stable',
      active_conditions TEXT NOT NULL DEFAULT '[]',
      active_medications TEXT NOT NULL DEFAULT '[]',
      next_scheduled_care TEXT NOT NULL DEFAULT '[]',
      primary_vet TEXT NOT NULL DEFAULT '',
      barn TEXT NOT NULL DEFAULT '',
      discipline TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS care_team (
      id TEXT PRIMARY KEY,
      animal_id TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      practice TEXT,
      phone TEXT,
      email TEXT,
      last_contact TEXT,
      access_level TEXT NOT NULL DEFAULT 'READ',
      user_id TEXT
    );

    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY,
      animal_id TEXT NOT NULL,
      author_id TEXT,
      date TEXT NOT NULL,
      season TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      provider TEXT NOT NULL,
      practice TEXT,
      is_significant INTEGER NOT NULL DEFAULT 0,
      is_sorted INTEGER NOT NULL DEFAULT 1,
      summary TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '{}',
      file_key TEXT,
      file_name TEXT,
      file_type TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS invitations (
      id TEXT PRIMARY KEY,
      token TEXT NOT NULL UNIQUE,
      animal_id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      invited_email TEXT,
      intended_role TEXT NOT NULL,
      access_level TEXT NOT NULL DEFAULT 'READ+WRITE',
      status TEXT NOT NULL DEFAULT 'pending',
      claimed_by_user_id TEXT,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      claimed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS access_grants (
      id TEXT PRIMARY KEY,
      animal_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      granted_by_user_id TEXT NOT NULL,
      access_level TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL,
      revoked_at TEXT
    );

    CREATE TABLE IF NOT EXISTS emergency_access (
      id TEXT PRIMARY KEY,
      token TEXT NOT NULL UNIQUE,
      animal_id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      label TEXT NOT NULL DEFAULT '',
      context TEXT NOT NULL DEFAULT 'emergency',
      duration_days INTEGER NOT NULL DEFAULT 60,
      status TEXT NOT NULL DEFAULT 'active',
      access_count INTEGER NOT NULL DEFAULT 0,
      last_accessed_at TEXT,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      revoked_at TEXT
    );
  `);
}

// ─── Emergency Access operations ─────────────────────────────────────────────
export async function createEmergencyToken(
  ownerId: string,
  animalId: string,
  label: string,
  context: string,
  durationDays: number,
): Promise<EmergencyAccess> {
  const now = new Date();
  const expires = new Date(now);
  expires.setDate(expires.getDate() + durationDays);
  const token = randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, "").slice(0, 8);
  const record: EmergencyAccess = {
    id: randomUUID(),
    token,
    animalId,
    ownerId,
    label: label ?? "",
    context,
    durationDays,
    status: "active",
    accessCount: 0,
    lastAccessedAt: null,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    revokedAt: null,
  };
  await db.insert(emergencyAccess).values(record);
  return record;
}

export async function getEmergencyToken(token: string): Promise<EmergencyAccess | undefined> {
  return db.select().from(emergencyAccess).where(eq(emergencyAccess.token, token)).get();
}

export async function getEmergencyTokensByOwner(ownerId: string): Promise<EmergencyAccess[]> {
  return db.select().from(emergencyAccess).where(eq(emergencyAccess.ownerId, ownerId)).all();
}

export async function incrementEmergencyAccessCount(token: string): Promise<void> {
  const ea = await getEmergencyToken(token);
  if (!ea) return;
  await db.update(emergencyAccess)
    .set({ accessCount: ea.accessCount + 1, lastAccessedAt: new Date().toISOString() })
    .where(eq(emergencyAccess.token, token));
}

export async function revokeEmergencyToken(id: string, ownerId: string): Promise<boolean> {
  const result = await db.update(emergencyAccess)
    .set({ status: "revoked", revokedAt: new Date().toISOString() })
    .where(and(eq(emergencyAccess.id, id), eq(emergencyAccess.ownerId, ownerId)))
    .run();
  return result.changes > 0;
}

// ─── User operations ──────────────────────────────────────────────────────────
export async function getUserById(id: string): Promise<User | undefined> {
  return db.select().from(users).where(eq(users.id, id)).get();
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return db.select().from(users).where(eq(users.email, email.toLowerCase())).get();
}

export async function createUser(data: Omit<InsertUser, "id" | "createdAt">): Promise<User> {
  const now = new Date().toISOString();
  const id = randomUUID();
  return db.insert(users).values({ ...data, id, createdAt: now }).returning().get();
}

export async function updateLastLogin(id: string): Promise<void> {
  db.update(users).set({ lastLogin: new Date().toISOString() }).where(eq(users.id, id)).run();
}

// ─── Animal operations ────────────────────────────────────────────────────────
export async function getAnimalsByOwner(ownerId: string): Promise<Animal[]> {
  return db.select().from(animals).where(eq(animals.ownerId, ownerId)).all();
}

export async function getAnimalById(id: string): Promise<Animal | undefined> {
  return db.select().from(animals).where(eq(animals.id, id)).get();
}

export async function createAnimal(data: Omit<InsertAnimal, "id" | "createdAt">): Promise<Animal> {
  const now = new Date().toISOString();
  const id = randomUUID();
  return db.insert(animals).values({ ...data, id, createdAt: now }).returning().get();
}

// ─── Access grants ────────────────────────────────────────────────────────────
export async function getAccessibleAnimals(userId: string): Promise<Animal[]> {
  const grants = db.select().from(accessGrants)
    .where(and(eq(accessGrants.userId, userId), isNull(accessGrants.revokedAt)))
    .all();
  if (!grants.length) return [];
  const animalIds = grants.map(g => g.animalId);
  return db.select().from(animals).all().filter(a => animalIds.includes(a.id));
}

export async function hasAccess(userId: string, animalId: string): Promise<boolean> {
  // Owners always have access to their own animals
  const animal = await getAnimalById(animalId);
  if (animal?.ownerId === userId) return true;
  // Check access grants
  const grant = db.select().from(accessGrants)
    .where(and(
      eq(accessGrants.userId, userId),
      eq(accessGrants.animalId, animalId),
      isNull(accessGrants.revokedAt)
    )).get();
  return !!grant;
}

// ─── Records ──────────────────────────────────────────────────────────────────
export async function getRecordsByAnimal(animalId: string): Promise<Record[]> {
  return db.select().from(records).where(eq(records.animalId, animalId)).all();
}

export async function createRecord(data: Omit<InsertRecord, "id" | "createdAt">): Promise<Record> {
  const now = new Date().toISOString();
  const id = randomUUID();
  return db.insert(records).values({ ...data, id, createdAt: now }).returning().get();
}

// ─── Invitations ──────────────────────────────────────────────────────────────
export async function createInvitation(data: {
  animalId: string;
  ownerId: string;
  invitedEmail?: string;
  intendedRole: string;
  accessLevel: string;
}): Promise<Invitation> {
  const { randomBytes } = await import("crypto");
  const token = randomBytes(24).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const id = randomUUID();
  return db.insert(invitations).values({
    id,
    token,
    animalId: data.animalId,
    ownerId: data.ownerId,
    invitedEmail: data.invitedEmail,
    intendedRole: data.intendedRole,
    accessLevel: data.accessLevel,
    status: "pending",
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  }).returning().get();
}

export async function getInvitationByToken(token: string): Promise<Invitation | undefined> {
  return db.select().from(invitations).where(eq(invitations.token, token)).get();
}

export async function claimInvitation(token: string, userId: string): Promise<{ success: boolean; message: string; animal?: Animal }> {
  const inv = await getInvitationByToken(token);
  if (!inv) return { success: false, message: "Invitation not found." };
  if (inv.status !== "pending") return { success: false, message: "This invitation has already been used." };
  if (new Date(inv.expiresAt) < new Date()) return { success: false, message: "This invitation has expired." };

  const now = new Date().toISOString();
  // Mark invitation claimed
  db.update(invitations).set({ status: "claimed", claimedByUserId: userId, claimedAt: now }).where(eq(invitations.token, token)).run();
  // Create access grant
  const user = await getUserById(userId);
  db.insert(accessGrants).values({
    id: randomUUID(),
    animalId: inv.animalId,
    userId,
    grantedByUserId: inv.ownerId,
    accessLevel: inv.accessLevel,
    role: user?.role ?? inv.intendedRole,
    createdAt: now,
  }).run();

  const animal = await getAnimalById(inv.animalId);
  return { success: true, message: "Access granted.", animal };
}

export async function getInvitationsByOwner(ownerId: string): Promise<Invitation[]> {
  return db.select().from(invitations).where(eq(invitations.ownerId, ownerId)).all();
}
