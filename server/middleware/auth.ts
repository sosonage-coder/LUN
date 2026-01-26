import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { userEntityRoles, users, USER_ROLES, UserRole } from "@shared/models/auth";
import { eq, and } from "drizzle-orm";

declare global {
  namespace Express {
    interface Request {
      userRole?: UserRole;
      entityId?: number;
    }
  }
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export function requireRole(...allowedRoles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = req.user as any;
    if (!user?.id) {
      return res.status(401).json({ error: "User not found" });
    }

    const entityId = parseInt(req.headers["x-entity-id"] as string) || req.entityId;
    
    if (entityId) {
      const roleAssignment = await db
        .select()
        .from(userEntityRoles)
        .where(and(
          eq(userEntityRoles.userId, user.id),
          eq(userEntityRoles.entityId, entityId)
        ))
        .limit(1);

      if (roleAssignment.length > 0) {
        req.userRole = roleAssignment[0].role as UserRole;
        req.entityId = entityId;
      }
    }

    if (!req.userRole) {
      const userRecord = await db
        .select({ defaultRole: users.defaultRole })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      req.userRole = (userRecord[0]?.defaultRole as UserRole) || "PREPARER";
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ 
        error: "Forbidden", 
        message: `Role ${req.userRole} is not authorized for this action` 
      });
    }

    next();
  };
}

export const ROLE_PERMISSIONS = {
  ADMIN: ["read", "write", "delete", "approve", "manage_users", "manage_entities", "close_period"],
  CONTROLLER: ["read", "write", "delete", "approve", "close_period"],
  REVIEWER: ["read", "approve"],
  PREPARER: ["read", "write"],
} as const;

export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] as readonly string[];
  return permissions.includes(permission);
}

export function requirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = req.user as any;
    if (!user?.id) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!req.userRole) {
      const userRecord = await db
        .select({ defaultRole: users.defaultRole })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);
      
      req.userRole = (userRecord[0]?.defaultRole as UserRole) || "PREPARER";
    }

    if (!hasPermission(req.userRole, permission)) {
      return res.status(403).json({ 
        error: "Forbidden", 
        message: `Permission "${permission}" is required for this action` 
      });
    }

    next();
  };
}
