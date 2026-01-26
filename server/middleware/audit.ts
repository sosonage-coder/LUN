import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { auditLogs, InsertAuditLog } from "@shared/models/auth";

export async function logAudit(
  req: Request,
  action: string,
  tableName: string,
  recordId: string | number,
  oldValues?: any,
  newValues?: any
) {
  const user = req.user as any;
  const entityIdHeader = req.headers["x-entity-id"] as string;
  const entityId = entityIdHeader ? parseInt(entityIdHeader) : (req.entityId || null);
  
  try {
    await db.insert(auditLogs).values({
      userId: user?.id || null,
      entityId: entityId,
      action,
      tableName,
      recordId: String(recordId),
      oldValues: oldValues || null,
      newValues: newValues || null,
      ipAddress: req.ip || (req.headers["x-forwarded-for"] as string) || null,
      userAgent: req.headers["user-agent"] || null,
    } as InsertAuditLog);
  } catch (error) {
    console.error("Failed to log audit:", error);
  }
}

export function auditMiddleware(tableName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);
    
    res.json = function(data: any) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const action = getActionFromMethod(req.method);
        if (action && data?.id) {
          logAudit(req, action, tableName, data.id, req.body?.oldValues, data);
        }
      }
      return originalJson(data);
    };
    
    next();
  };
}

function getActionFromMethod(method: string): string | null {
  switch (method.toUpperCase()) {
    case "POST": return "CREATE";
    case "PUT": return "UPDATE";
    case "PATCH": return "UPDATE";
    case "DELETE": return "DELETE";
    default: return null;
  }
}

export async function getAuditLogs(
  entityId?: number,
  tableName?: string,
  recordId?: string,
  limit: number = 100
) {
  let query = db.select().from(auditLogs);
  
  const logs = await query.limit(limit);
  return logs;
}
