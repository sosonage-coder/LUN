import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScheduleMasterSchema, insertScheduleEventSchema, insertPrepaidScheduleSchema, type PrepaidSubcategory } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get all schedules
  app.get("/api/schedules", async (req, res) => {
    try {
      const schedules = await storage.getSchedules();
      res.json(schedules);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      res.status(500).json({ error: "Failed to fetch schedules" });
    }
  });

  // Get schedule summary
  app.get("/api/schedules/summary", async (req, res) => {
    try {
      const summary = await storage.getScheduleSummary();
      res.json(summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
      res.status(500).json({ error: "Failed to fetch summary" });
    }
  });

  // Get single schedule with events and periods
  app.get("/api/schedules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const schedule = await storage.getSchedule(id);
      
      if (!schedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }

      const events = await storage.getScheduleEvents(id);
      const periods = await storage.getSchedulePeriods(id);

      res.json({
        schedule,
        events,
        periods,
      });
    } catch (error) {
      console.error("Error fetching schedule:", error);
      res.status(500).json({ error: "Failed to fetch schedule" });
    }
  });

  // Create new schedule
  app.post("/api/schedules", async (req, res) => {
    try {
      const validatedData = insertScheduleMasterSchema.parse(req.body);
      const schedule = await storage.createSchedule(validatedData);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Error creating schedule:", error);
      res.status(500).json({ error: "Failed to create schedule" });
    }
  });

  // Add event to schedule
  app.post("/api/schedules/:id/events", async (req, res) => {
    try {
      const { id } = req.params;
      const schedule = await storage.getSchedule(id);
      
      if (!schedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }

      const validatedData = insertScheduleEventSchema.parse({
        ...req.body,
        scheduleId: id,
      });

      const event = await storage.createScheduleEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  // Rebuild schedule
  app.post("/api/schedules/:id/rebuild", async (req, res) => {
    try {
      const { id } = req.params;
      const schedule = await storage.getSchedule(id);
      
      if (!schedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }

      const periods = await storage.rebuildSchedule(id);
      res.json({ periods });
    } catch (error) {
      console.error("Error rebuilding schedule:", error);
      res.status(500).json({ error: "Failed to rebuild schedule" });
    }
  });

  // Get entities
  app.get("/api/entities", async (req, res) => {
    try {
      const entities = await storage.getEntities();
      res.json(entities);
    } catch (error) {
      console.error("Error fetching entities:", error);
      res.status(500).json({ error: "Failed to fetch entities" });
    }
  });

  // Get period statuses for an entity
  app.get("/api/entities/:entityId/periods", async (req, res) => {
    try {
      const { entityId } = req.params;
      const statuses = await storage.getPeriodStatuses(entityId);
      res.json(statuses);
    } catch (error) {
      console.error("Error fetching period statuses:", error);
      res.status(500).json({ error: "Failed to fetch period statuses" });
    }
  });

  // Close a period
  app.post("/api/entities/:entityId/periods/:period/close", async (req, res) => {
    try {
      const { entityId, period } = req.params;
      
      // Validate period format
      if (!/^\d{4}-\d{2}$/.test(period)) {
        return res.status(400).json({ error: "Invalid period format. Use YYYY-MM" });
      }

      const status = await storage.closePeriod(entityId, period);
      res.json(status);
    } catch (error) {
      console.error("Error closing period:", error);
      res.status(500).json({ error: "Failed to close period" });
    }
  });

  // ======================
  // Prepaid Dashboard Routes
  // ======================

  // Get prepaid dashboard KPIs
  app.get("/api/prepaids/kpis", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const period = req.query.period as string | undefined;
      const kpis = await storage.getPrepaidDashboardKPIs(entityId, period);
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching prepaid KPIs:", error);
      res.status(500).json({ error: "Failed to fetch prepaid KPIs" });
    }
  });

  // Get prepaid category breakdown
  app.get("/api/prepaids/breakdown", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const breakdown = await storage.getPrepaidCategoryBreakdown(entityId);
      res.json(breakdown);
    } catch (error) {
      console.error("Error fetching prepaid breakdown:", error);
      res.status(500).json({ error: "Failed to fetch prepaid breakdown" });
    }
  });

  // Get amortization trend
  app.get("/api/prepaids/trend", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const periods = req.query.periods ? parseInt(req.query.periods as string) : 6;
      const trend = await storage.getAmortizationTrend(entityId, periods);
      res.json(trend);
    } catch (error) {
      console.error("Error fetching amortization trend:", error);
      res.status(500).json({ error: "Failed to fetch amortization trend" });
    }
  });

  // Get all prepaid schedules
  app.get("/api/prepaids", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const subcategory = req.query.subcategory as PrepaidSubcategory | undefined;
      const schedules = await storage.getPrepaidSchedules(entityId, subcategory);
      res.json(schedules);
    } catch (error) {
      console.error("Error fetching prepaid schedules:", error);
      res.status(500).json({ error: "Failed to fetch prepaid schedules" });
    }
  });

  // Get single prepaid schedule
  app.get("/api/prepaids/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const schedule = await storage.getPrepaidSchedule(id);
      
      if (!schedule) {
        return res.status(404).json({ error: "Prepaid schedule not found" });
      }

      res.json(schedule);
    } catch (error) {
      console.error("Error fetching prepaid schedule:", error);
      res.status(500).json({ error: "Failed to fetch prepaid schedule" });
    }
  });

  // Create new prepaid schedule
  app.post("/api/prepaids", async (req, res) => {
    try {
      const validatedData = insertPrepaidScheduleSchema.parse(req.body);
      const schedule = await storage.createPrepaidSchedule(validatedData);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Error creating prepaid schedule:", error);
      res.status(500).json({ error: "Failed to create prepaid schedule" });
    }
  });

  return httpServer;
}
