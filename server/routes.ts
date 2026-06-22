import type { Express, Request, Response } from "express";
import { createServer } from "node:http";
import type { Server } from "node:http";
import passport from "passport";
import { randomUUID } from "crypto";
import {
  getUserByEmail, createUser, getAnimalsByOwner, getAnimalById,
  createAnimal, getAccessibleAnimals, hasAccess, getRecordsByAnimal,
  createRecord, createInvitation, getInvitationByToken, claimInvitation,
  getInvitationsByOwner,
  createEmergencyToken, getEmergencyToken, getEmergencyTokensByOwner,
  incrementEmergencyAccessCount, revokeEmergencyToken,
} from "./storage";
import { hashPassword, requireAuth, requireRole } from "./auth";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {

  // ── Auth ────────────────────────────────────────────────────────────────────

  // POST /api/auth/signup
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const { email, password, role, firstName, lastName, phone,
              licenseNumber, practice, credentialType } = req.body;

      if (!email || !password || !role || !firstName || !lastName) {
        return res.status(400).json({ error: "Required fields missing." });
      }
      if (!["owner", "vet", "care_provider"].includes(role)) {
        return res.status(400).json({ error: "Invalid role." });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters." });
      }

      const existing = await getUserByEmail(email);
      if (existing) return res.status(409).json({ error: "An account with that email already exists." });

      const passwordHash = await hashPassword(password);
      const user = await createUser({
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim() || null,
        licenseNumber: licenseNumber?.trim() || null,
        practice: practice?.trim() || null,
        credentialType: credentialType?.trim() || null,
      });

      // Auto sign-in after signup
      req.login(user as any, (err) => {
        if (err) return res.status(500).json({ error: "Signup succeeded but login failed." });
        return res.json({
          id: user.id, email: user.email, role: user.role,
          firstName: user.firstName, lastName: user.lastName,
        });
      });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ error: "Server error during signup." });
    }
  });

  // POST /api/auth/login
  app.post("/api/auth/login", (req: Request, res: Response, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ error: info?.message ?? "Login failed." });
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.json({
          id: user.id, email: user.email, role: user.role,
          firstName: user.firstName, lastName: user.lastName,
        });
      });
    })(req, res, next);
  });

  // POST /api/auth/logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout(() => res.json({ success: true }));
  });

  // GET /api/auth/me — returns current session user
  app.get("/api/auth/me", (req: Request, res: Response) => {
    if (!req.isAuthenticated() || !req.user) return res.status(401).json({ error: "Not authenticated" });
    const u = req.user as any;
    res.json({ id: u.id, email: u.email, role: u.role, firstName: u.firstName, lastName: u.lastName });
  });

  // ── Animals ─────────────────────────────────────────────────────────────────

  // GET /api/animals — owner sees their horses; vet/provider see their caseload
  app.get("/api/animals", requireAuth, async (req: Request, res: Response) => {
    const user = req.user as any;
    try {
      if (user.role === "owner") {
        const list = await getAnimalsByOwner(user.id);
        return res.json(list);
      }
      const list = await getAccessibleAnimals(user.id);
      return res.json(list);
    } catch (err) {
      res.status(500).json({ error: "Failed to load animals." });
    }
  });

  // GET /api/animals/:id
  app.get("/api/animals/:id", requireAuth, async (req: Request, res: Response) => {
    const user = req.user as any;
    try {
      const ok = await hasAccess(user.id, req.params.id);
      if (!ok) return res.status(403).json({ error: "Access denied." });
      const animal = await getAnimalById(req.params.id);
      if (!animal) return res.status(404).json({ error: "Animal not found." });
      res.json(animal);
    } catch (err) {
      res.status(500).json({ error: "Failed to load animal." });
    }
  });

  // POST /api/animals — owner creates a horse
  app.post("/api/animals", requireRole("owner"), async (req: Request, res: Response) => {
    const user = req.user as any;
    try {
      const { name, breed, sex, dob, microchip, color, barn, discipline } = req.body;
      if (!name || !breed || !sex || !dob) {
        return res.status(400).json({ error: "Name, breed, sex, and date of birth are required." });
      }
      const animal = await createAnimal({
        name: name.trim(),
        species: "equine",
        breed: breed.trim(),
        sex,
        dob,
        color: color?.trim() || "",
        microchip: microchip?.trim() || null,
        ownerId: user.id,
        openingSummary: "",
        patientStatus: "stable",
        activeConditions: "[]",
        activeMedications: "[]",
        nextScheduledCare: "[]",
        primaryVet: "",
        barn: barn?.trim() || "",
        discipline: discipline?.trim() || null,
      });
      res.status(201).json(animal);
    } catch (err) {
      res.status(500).json({ error: "Failed to create animal." });
    }
  });

  // ── Records ─────────────────────────────────────────────────────────────────

  // GET /api/animals/:id/records
  app.get("/api/animals/:id/records", requireAuth, async (req: Request, res: Response) => {
    const user = req.user as any;
    try {
      const ok = await hasAccess(user.id, req.params.id);
      if (!ok) return res.status(403).json({ error: "Access denied." });
      const recs = await getRecordsByAnimal(req.params.id);
      res.json(recs);
    } catch (err) {
      res.status(500).json({ error: "Failed to load records." });
    }
  });

  // POST /api/animals/:id/records — both owner and vet can create
  app.post("/api/animals/:id/records", requireAuth, async (req: Request, res: Response) => {
    const user = req.user as any;
    try {
      const ok = await hasAccess(user.id, req.params.id);
      if (!ok) return res.status(403).json({ error: "Access denied." });
      const { date, season, type, title, provider, practice, summary, content, isSignificant, fileKey, fileName, fileType } = req.body;
      if (!date || !type || !title || !provider || !summary) {
        return res.status(400).json({ error: "Required record fields missing." });
      }
      const record = await createRecord({
        animalId: req.params.id,
        authorId: user.id,
        date,
        season: season ?? "",
        type,
        title,
        provider,
        practice: practice ?? null,
        summary,
        content: typeof content === "string" ? content : JSON.stringify(content ?? {}),
        isSignificant: isSignificant ?? false,
        isSorted: true,
        fileKey: fileKey ?? null,
        fileName: fileName ?? null,
        fileType: fileType ?? null,
      });
      res.status(201).json(record);
    } catch (err) {
      res.status(500).json({ error: "Failed to create record." });
    }
  });

  // ── Invitations ─────────────────────────────────────────────────────────────

  // POST /api/invitations — owner creates an invite
  app.post("/api/invitations", requireRole("owner"), async (req: Request, res: Response) => {
    const user = req.user as any;
    try {
      const { animalId, invitedEmail, intendedRole, accessLevel } = req.body;
      if (!animalId || !intendedRole) {
        return res.status(400).json({ error: "animalId and intendedRole are required." });
      }
      const ok = await hasAccess(user.id, animalId);
      if (!ok) return res.status(403).json({ error: "You do not own that animal." });

      const inv = await createInvitation({
        animalId,
        ownerId: user.id,
        invitedEmail: invitedEmail?.trim() || undefined,
        intendedRole,
        accessLevel: accessLevel ?? "READ+WRITE",
      });

      // Build the invite URL — front-end hash routing handles /invite/:token
      const baseUrl = req.headers.origin ?? `${req.protocol}://${req.headers.host}`;
      const inviteUrl = `${baseUrl}/#/invite/${inv.token}`;
      res.status(201).json({ invitation: inv, inviteUrl });
    } catch (err) {
      res.status(500).json({ error: "Failed to create invitation." });
    }
  });

  // GET /api/invitations/mine — owner sees their sent invites
  app.get("/api/invitations/mine", requireRole("owner"), async (req: Request, res: Response) => {
    const user = req.user as any;
    try {
      const invs = await getInvitationsByOwner(user.id);
      res.json(invs);
    } catch (err) {
      res.status(500).json({ error: "Failed to load invitations." });
    }
  });

  // GET /api/invitations/:token — look up an invite (public, no auth required)
  app.get("/api/invitations/:token", async (req: Request, res: Response) => {
    try {
      const inv = await getInvitationByToken(req.params.token);
      if (!inv) return res.status(404).json({ error: "Invitation not found." });
      if (inv.status !== "pending") return res.status(410).json({ error: "This invitation has already been used." });
      if (new Date(inv.expiresAt) < new Date()) return res.status(410).json({ error: "This invitation has expired." });
      // Return safe subset — don't expose internal IDs
      res.json({
        token: inv.token,
        intendedRole: inv.intendedRole,
        invitedEmail: inv.invitedEmail,
        accessLevel: inv.accessLevel,
        expiresAt: inv.expiresAt,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to look up invitation." });
    }
  });

  // POST /api/invitations/:token/claim — authenticated user claims the invite
  app.post("/api/invitations/:token/claim", requireAuth, async (req: Request, res: Response) => {
    const user = req.user as any;
    try {
      const result = await claimInvitation(req.params.token, user.id);
      if (!result.success) return res.status(400).json({ error: result.message });
      res.json({ success: true, animal: result.animal });
    } catch (err) {
      res.status(500).json({ error: "Failed to claim invitation." });
    }
  });

  // ── S3 Upload stub ──────────────────────────────────────────────────────────
  // Engineering team: replace this stub with a presigned URL generator
  // using AWS SDK v3: @aws-sdk/client-s3 + @aws-sdk/s3-request-presigner
  //
  // POST /api/upload/presign — returns a presigned PUT URL for direct S3 upload
  app.post("/api/upload/presign", requireAuth, async (req: Request, res: Response) => {
    const { fileName, fileType, animalId } = req.body;
    if (!fileName || !fileType || !animalId) {
      return res.status(400).json({ error: "fileName, fileType, and animalId required." });
    }
    // STUB — engineering team replaces this block with:
    //   const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
    //   const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
    //   const key = `animals/${animalId}/${Date.now()}-${fileName}`;
    //   const url = await getSignedUrl(s3Client, new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, ContentType: fileType }), { expiresIn: 300 });
    //   res.json({ uploadUrl: url, fileKey: key });
    const stubKey = `animals/${animalId}/${Date.now()}-${fileName}`;
    res.json({
      uploadUrl: null,          // null signals UI to show "S3 not yet connected"
      fileKey: stubKey,
      note: "S3 not yet connected. Engineering team: see server/routes.ts /api/upload/presign stub.",
    });
  });

  // ── Emergency Access ──────────────────────────────────────────────────────────────

  // POST /api/emergency-access — owner creates a public read-only token for a horse
  app.post("/api/emergency-access", requireRole("owner"), async (req: Request, res: Response) => {
    try {
      const ownerId = (req.user as any).id;
      const { animalId, label, context, durationDays } = req.body;
      if (!animalId) return res.status(400).json({ error: "animalId required." });

      // Verify owner owns this animal
      const animal = await getAnimalById(animalId);
      if (!animal || animal.ownerId !== ownerId) {
        return res.status(403).json({ error: "Animal not found or not owned by you." });
      }

      const ea = await createEmergencyToken(
        ownerId,
        animalId,
        label ?? "",
        context ?? "emergency",
        Math.min(Math.max(Number(durationDays) || 60, 1), 60), // clamp 1–60 days
      );

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const accessUrl = `${baseUrl}/#/ea/${ea.token}`;
      res.status(201).json({ emergencyAccess: ea, accessUrl });
    } catch (err) {
      console.error("[emergency-access] create error:", err);
      res.status(500).json({ error: "Failed to create emergency access token." });
    }
  });

  // GET /api/emergency-access/mine — owner sees all their tokens
  app.get("/api/emergency-access/mine", requireRole("owner"), async (req: Request, res: Response) => {
    try {
      const ownerId = (req.user as any).id;
      const tokens = await getEmergencyTokensByOwner(ownerId);
      res.json(tokens);
    } catch (err) {
      res.status(500).json({ error: "Failed to load emergency tokens." });
    }
  });

  // GET /api/ea/:token — PUBLIC — no auth required
  // Returns animal + records for emergency vet view; increments access count
  app.get("/api/ea/:token", async (req: Request, res: Response) => {
    try {
      const ea = await getEmergencyToken(req.params.token);
      if (!ea) return res.status(404).json({ error: "Access link not found." });

      // Check status and expiry
      if (ea.status === "revoked") {
        return res.status(410).json({ error: "This access link has been revoked by the owner.", code: "REVOKED" });
      }
      if (ea.status === "expired" || new Date(ea.expiresAt) < new Date()) {
        return res.status(410).json({ error: "This access link has expired.", code: "EXPIRED" });
      }

      const animal = await getAnimalById(ea.animalId);
      if (!animal) return res.status(404).json({ error: "Animal record not found." });

      const records = await getRecordsByAnimal(ea.animalId);

      // Increment access count (fire-and-forget, don’t fail the response)
      incrementEmergencyAccessCount(ea.token).catch(() => {});

      res.json({
        animal,
        records,
        emergencyAccess: {
          label: ea.label,
          context: ea.context,
          expiresAt: ea.expiresAt,
          durationDays: ea.durationDays,
          issuedBy: "Horse Owner",   // intentionally minimal PII
        },
      });
    } catch (err) {
      console.error("[emergency-access] read error:", err);
      res.status(500).json({ error: "Failed to load emergency record." });
    }
  });

  // DELETE /api/emergency-access/:id — owner revokes a specific token
  app.delete("/api/emergency-access/:id", requireRole("owner"), async (req: Request, res: Response) => {
    try {
      const ownerId = (req.user as any).id;
      const revoked = await revokeEmergencyToken(req.params.id, ownerId);
      if (!revoked) return res.status(404).json({ error: "Token not found or not owned by you." });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to revoke token." });
    }
  });

  return httpServer;
}
