import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScheduleMasterSchema, insertScheduleEventSchema, insertPrepaidScheduleSchema, insertFixedAssetSchema, insertAccrualScheduleSchema, insertRevenueScheduleSchema, insertInvestmentIncomeScheduleSchema, insertDebtScheduleSchema, insertCloseTemplateSchema, insertCloseTemplateTaskSchema, updateCloseTemplateSchema, updateCloseTemplateTaskSchema, insertWorkingPaperSchema, autoPopulateWorkingPapersSchema, insertArtifactSchema, updateArtifactSchema, type PrepaidSubcategory, type AssetClass, type AccrualCategory, type RevenueCategory, type InvestmentCategory, type DebtCategory, type ArtifactPurpose, type ArtifactStatus } from "@shared/schema";
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

  // ======================
  // Fixed Assets Dashboard Routes
  // ======================

  // Get fixed assets dashboard KPIs
  app.get("/api/fixed-assets/kpis", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const period = req.query.period as string | undefined;
      const kpis = await storage.getFixedAssetDashboardKPIs(entityId, period);
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching fixed asset KPIs:", error);
      res.status(500).json({ error: "Failed to fetch fixed asset KPIs" });
    }
  });

  // Get asset class breakdown
  app.get("/api/fixed-assets/breakdown", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const breakdown = await storage.getAssetClassBreakdown(entityId);
      res.json(breakdown);
    } catch (error) {
      console.error("Error fetching asset class breakdown:", error);
      res.status(500).json({ error: "Failed to fetch asset class breakdown" });
    }
  });

  // Get depreciation trend
  app.get("/api/fixed-assets/trend", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const periods = req.query.periods ? parseInt(req.query.periods as string) : 6;
      const trend = await storage.getDepreciationTrend(entityId, periods);
      res.json(trend);
    } catch (error) {
      console.error("Error fetching depreciation trend:", error);
      res.status(500).json({ error: "Failed to fetch depreciation trend" });
    }
  });

  // Get useful life distribution
  app.get("/api/fixed-assets/lifecycle", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const distribution = await storage.getUsefulLifeDistribution(entityId);
      res.json(distribution);
    } catch (error) {
      console.error("Error fetching useful life distribution:", error);
      res.status(500).json({ error: "Failed to fetch useful life distribution" });
    }
  });

  // Get control flags
  app.get("/api/fixed-assets/flags", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const flags = await storage.getControlFlags(entityId);
      res.json(flags);
    } catch (error) {
      console.error("Error fetching control flags:", error);
      res.status(500).json({ error: "Failed to fetch control flags" });
    }
  });

  // Get all fixed assets
  app.get("/api/fixed-assets", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const assetClass = req.query.assetClass as AssetClass | undefined;
      const assets = await storage.getFixedAssets(entityId, assetClass);
      res.json(assets);
    } catch (error) {
      console.error("Error fetching fixed assets:", error);
      res.status(500).json({ error: "Failed to fetch fixed assets" });
    }
  });

  // Get single fixed asset
  app.get("/api/fixed-assets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const asset = await storage.getFixedAsset(id);
      
      if (!asset) {
        return res.status(404).json({ error: "Fixed asset not found" });
      }

      res.json(asset);
    } catch (error) {
      console.error("Error fetching fixed asset:", error);
      res.status(500).json({ error: "Failed to fetch fixed asset" });
    }
  });

  // Create new fixed asset
  app.post("/api/fixed-assets", async (req, res) => {
    try {
      const validatedData = insertFixedAssetSchema.parse(req.body);
      const asset = await storage.createFixedAsset(validatedData);
      res.status(201).json(asset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Error creating fixed asset:", error);
      res.status(500).json({ error: "Failed to create fixed asset" });
    }
  });

  // ======================
  // Accruals Dashboard Routes
  // ======================

  // Get accruals dashboard KPIs
  app.get("/api/accruals/kpis", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const period = req.query.period as string | undefined;
      const kpis = await storage.getAccrualDashboardKPIs(entityId, period);
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching accrual KPIs:", error);
      res.status(500).json({ error: "Failed to fetch accrual KPIs" });
    }
  });

  // Get category summaries
  app.get("/api/accruals/categories", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const summaries = await storage.getAccrualCategorySummaries(entityId);
      res.json(summaries);
    } catch (error) {
      console.error("Error fetching category summaries:", error);
      res.status(500).json({ error: "Failed to fetch category summaries" });
    }
  });

  // Get accrual trend
  app.get("/api/accruals/trend", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const periods = req.query.periods ? parseInt(req.query.periods as string) : 6;
      const trend = await storage.getAccrualTrend(entityId, periods);
      res.json(trend);
    } catch (error) {
      console.error("Error fetching accrual trend:", error);
      res.status(500).json({ error: "Failed to fetch accrual trend" });
    }
  });

  // Get risk panels
  app.get("/api/accruals/risks", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const panels = await storage.getAccrualRiskPanels(entityId);
      res.json(panels);
    } catch (error) {
      console.error("Error fetching risk panels:", error);
      res.status(500).json({ error: "Failed to fetch risk panels" });
    }
  });

  // Get accrual mix breakdown
  app.get("/api/accruals/mix", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const mix = await storage.getAccrualMixBreakdown(entityId);
      res.json(mix);
    } catch (error) {
      console.error("Error fetching accrual mix:", error);
      res.status(500).json({ error: "Failed to fetch accrual mix" });
    }
  });

  // Get all accruals (for drilldown)
  app.get("/api/accruals", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const category = req.query.category as AccrualCategory | undefined;
      const accruals = await storage.getAccrualSchedules(entityId, category);
      res.json(accruals);
    } catch (error) {
      console.error("Error fetching accruals:", error);
      res.status(500).json({ error: "Failed to fetch accruals" });
    }
  });

  // Get single accrual
  app.get("/api/accruals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const accrual = await storage.getAccrualSchedule(id);
      
      if (!accrual) {
        return res.status(404).json({ error: "Accrual not found" });
      }

      res.json(accrual);
    } catch (error) {
      console.error("Error fetching accrual:", error);
      res.status(500).json({ error: "Failed to fetch accrual" });
    }
  });

  // Create new accrual
  app.post("/api/accruals", async (req, res) => {
    try {
      const validatedData = insertAccrualScheduleSchema.parse(req.body);
      const accrual = await storage.createAccrualSchedule(validatedData);
      res.status(201).json(accrual);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Error creating accrual:", error);
      res.status(500).json({ error: "Failed to create accrual" });
    }
  });

  // ======================
  // Revenue & Contracts Dashboard Routes
  // ======================

  // Get revenue dashboard KPIs
  app.get("/api/revenue/kpis", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const period = req.query.period as string | undefined;
      const kpis = await storage.getRevenueDashboardKPIs(entityId, period);
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching revenue KPIs:", error);
      res.status(500).json({ error: "Failed to fetch revenue KPIs" });
    }
  });

  // Get category summaries
  app.get("/api/revenue/categories", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const summaries = await storage.getRevenueCategorySummaries(entityId);
      res.json(summaries);
    } catch (error) {
      console.error("Error fetching revenue category summaries:", error);
      res.status(500).json({ error: "Failed to fetch revenue category summaries" });
    }
  });

  // Get revenue trend
  app.get("/api/revenue/trend", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const periods = req.query.periods ? parseInt(req.query.periods as string) : 6;
      const trend = await storage.getRevenueTrend(entityId, periods);
      res.json(trend);
    } catch (error) {
      console.error("Error fetching revenue trend:", error);
      res.status(500).json({ error: "Failed to fetch revenue trend" });
    }
  });

  // Get deferred revenue rollforward
  app.get("/api/revenue/rollforward", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const periods = req.query.periods ? parseInt(req.query.periods as string) : 6;
      const rollforward = await storage.getDeferredRevenueRollforward(entityId, periods);
      res.json(rollforward);
    } catch (error) {
      console.error("Error fetching deferred revenue rollforward:", error);
      res.status(500).json({ error: "Failed to fetch deferred revenue rollforward" });
    }
  });

  // Get revenue mix breakdown
  app.get("/api/revenue/mix", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const mix = await storage.getRevenueMixBreakdown(entityId);
      res.json(mix);
    } catch (error) {
      console.error("Error fetching revenue mix:", error);
      res.status(500).json({ error: "Failed to fetch revenue mix" });
    }
  });

  // Get risk panels
  app.get("/api/revenue/risks", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const panels = await storage.getRevenueRiskPanels(entityId);
      res.json(panels);
    } catch (error) {
      console.error("Error fetching revenue risk panels:", error);
      res.status(500).json({ error: "Failed to fetch revenue risk panels" });
    }
  });

  // Get all revenue schedules (for drilldown)
  app.get("/api/revenue", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const category = req.query.category as RevenueCategory | undefined;
      const revenues = await storage.getRevenueSchedules(entityId, category);
      res.json(revenues);
    } catch (error) {
      console.error("Error fetching revenue schedules:", error);
      res.status(500).json({ error: "Failed to fetch revenue schedules" });
    }
  });

  // Get single revenue schedule
  app.get("/api/revenue/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const revenue = await storage.getRevenueSchedule(id);
      
      if (!revenue) {
        return res.status(404).json({ error: "Revenue schedule not found" });
      }

      res.json(revenue);
    } catch (error) {
      console.error("Error fetching revenue schedule:", error);
      res.status(500).json({ error: "Failed to fetch revenue schedule" });
    }
  });

  // Create new revenue schedule
  app.post("/api/revenue", async (req, res) => {
    try {
      const validatedData = insertRevenueScheduleSchema.parse(req.body);
      const revenue = await storage.createRevenueSchedule(validatedData);
      res.status(201).json(revenue);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Error creating revenue schedule:", error);
      res.status(500).json({ error: "Failed to create revenue schedule" });
    }
  });

  // ======================
  // Investment Income Earned Dashboard Routes
  // ======================

  // Get investment income dashboard KPIs
  app.get("/api/investment-income/kpis", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const period = req.query.period as string | undefined;
      const kpis = await storage.getInvestmentIncomeDashboardKPIs(entityId, period);
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching investment income KPIs:", error);
      res.status(500).json({ error: "Failed to fetch investment income KPIs" });
    }
  });

  // Get investment income category summaries
  app.get("/api/investment-income/categories", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const summaries = await storage.getInvestmentIncomeCategorySummaries(entityId);
      res.json(summaries);
    } catch (error) {
      console.error("Error fetching investment income category summaries:", error);
      res.status(500).json({ error: "Failed to fetch investment income category summaries" });
    }
  });

  // Get investment income trend
  app.get("/api/investment-income/trend", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const periods = req.query.periods ? parseInt(req.query.periods as string) : 6;
      const trend = await storage.getInvestmentIncomeTrend(entityId, periods);
      res.json(trend);
    } catch (error) {
      console.error("Error fetching investment income trend:", error);
      res.status(500).json({ error: "Failed to fetch investment income trend" });
    }
  });

  // Get yield mix breakdown
  app.get("/api/investment-income/mix", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const mix = await storage.getYieldMixBreakdown(entityId);
      res.json(mix);
    } catch (error) {
      console.error("Error fetching yield mix:", error);
      res.status(500).json({ error: "Failed to fetch yield mix" });
    }
  });

  // Get accrued vs received
  app.get("/api/investment-income/accrued-received", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const periods = req.query.periods ? parseInt(req.query.periods as string) : 6;
      const data = await storage.getAccruedVsReceived(entityId, periods);
      res.json(data);
    } catch (error) {
      console.error("Error fetching accrued vs received:", error);
      res.status(500).json({ error: "Failed to fetch accrued vs received" });
    }
  });

  // Get risk panels
  app.get("/api/investment-income/risks", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const panels = await storage.getInvestmentIncomeRiskPanels(entityId);
      res.json(panels);
    } catch (error) {
      console.error("Error fetching investment income risk panels:", error);
      res.status(500).json({ error: "Failed to fetch investment income risk panels" });
    }
  });

  // Get all investment income schedules (for drilldown)
  app.get("/api/investment-income", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const category = req.query.category as InvestmentCategory | undefined;
      const investments = await storage.getInvestmentIncomeSchedules(entityId, category);
      res.json(investments);
    } catch (error) {
      console.error("Error fetching investment income schedules:", error);
      res.status(500).json({ error: "Failed to fetch investment income schedules" });
    }
  });

  // Get single investment income schedule
  app.get("/api/investment-income/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const investment = await storage.getInvestmentIncomeSchedule(id);
      
      if (!investment) {
        return res.status(404).json({ error: "Investment income schedule not found" });
      }

      res.json(investment);
    } catch (error) {
      console.error("Error fetching investment income schedule:", error);
      res.status(500).json({ error: "Failed to fetch investment income schedule" });
    }
  });

  // Create new investment income schedule
  app.post("/api/investment-income", async (req, res) => {
    try {
      const validatedData = insertInvestmentIncomeScheduleSchema.parse(req.body);
      const investment = await storage.createInvestmentIncomeSchedule(validatedData);
      res.status(201).json(investment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Error creating investment income schedule:", error);
      res.status(500).json({ error: "Failed to create investment income schedule" });
    }
  });

  // ======================
  // Loan & Debt Amortization Dashboard Routes
  // ======================

  // Get debt dashboard KPIs
  app.get("/api/debt/kpis", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const period = req.query.period as string | undefined;
      const kpis = await storage.getDebtDashboardKPIs(entityId, period);
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching debt KPIs:", error);
      res.status(500).json({ error: "Failed to fetch debt KPIs" });
    }
  });

  // Get category summaries
  app.get("/api/debt/categories", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const summaries = await storage.getDebtCategorySummaries(entityId);
      res.json(summaries);
    } catch (error) {
      console.error("Error fetching debt category summaries:", error);
      res.status(500).json({ error: "Failed to fetch debt category summaries" });
    }
  });

  // Get outstanding principal trend
  app.get("/api/debt/trend", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const periods = req.query.periods ? parseInt(req.query.periods as string) : 6;
      const trend = await storage.getDebtTrend(entityId, periods);
      res.json(trend);
    } catch (error) {
      console.error("Error fetching debt trend:", error);
      res.status(500).json({ error: "Failed to fetch debt trend" });
    }
  });

  // Get principal vs interest split
  app.get("/api/debt/split", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const periods = req.query.periods ? parseInt(req.query.periods as string) : 6;
      const split = await storage.getPrincipalInterestSplit(entityId, periods);
      res.json(split);
    } catch (error) {
      console.error("Error fetching principal/interest split:", error);
      res.status(500).json({ error: "Failed to fetch principal/interest split" });
    }
  });

  // Get debt mix breakdown
  app.get("/api/debt/mix", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const mix = await storage.getDebtMixBreakdown(entityId);
      res.json(mix);
    } catch (error) {
      console.error("Error fetching debt mix:", error);
      res.status(500).json({ error: "Failed to fetch debt mix" });
    }
  });

  // Get risk panels
  app.get("/api/debt/risks", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const panels = await storage.getDebtRiskPanels(entityId);
      res.json(panels);
    } catch (error) {
      console.error("Error fetching debt risk panels:", error);
      res.status(500).json({ error: "Failed to fetch debt risk panels" });
    }
  });

  // Get all debt schedules (for drilldown)
  app.get("/api/debt", async (req, res) => {
    try {
      const entityId = req.query.entityId as string | undefined;
      const category = req.query.category as DebtCategory | undefined;
      const debts = await storage.getDebtSchedules(entityId, category);
      res.json(debts);
    } catch (error) {
      console.error("Error fetching debt schedules:", error);
      res.status(500).json({ error: "Failed to fetch debt schedules" });
    }
  });

  // Get single debt schedule
  app.get("/api/debt/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const debt = await storage.getDebtSchedule(id);
      
      if (!debt) {
        return res.status(404).json({ error: "Debt schedule not found" });
      }

      res.json(debt);
    } catch (error) {
      console.error("Error fetching debt schedule:", error);
      res.status(500).json({ error: "Failed to fetch debt schedule" });
    }
  });

  // Create new debt schedule
  app.post("/api/debt", async (req, res) => {
    try {
      const validatedData = insertDebtScheduleSchema.parse(req.body);
      const debt = await storage.createDebtSchedule(validatedData);
      res.status(201).json(debt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Error creating debt schedule:", error);
      res.status(500).json({ error: "Failed to create debt schedule" });
    }
  });

  // ===== CASH SCHEDULE ROUTES =====

  // Cash KPIs (Level 0)
  app.get("/api/cash/kpis", async (req, res) => {
    try {
      const kpis = {
        openingCashBank: 12500000,
        closingCashBank: 14750000,
        netCashMovement: 2250000,
        fxImpact: -125000,
        unclassifiedCashPercent: 2.3,
        status: "NEEDS_REVIEW" as "COMPLETE" | "NEEDS_REVIEW" | "LOCKED" | "NO_TRANSACTIONS",
      };
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching cash KPIs:", error);
      res.status(500).json({ error: "Failed to fetch cash KPIs" });
    }
  });

  // Cash categories summary (Level 0)
  app.get("/api/cash/categories", async (req, res) => {
    try {
      const categories = [
        { category: "CUSTOMER_RECEIPTS" as const, inflows: 8500000, outflows: 0, netMovement: 8500000, status: "OK" as const },
        { category: "PAYROLL" as const, inflows: 0, outflows: 3200000, netMovement: -3200000, status: "OK" as const },
        { category: "VENDOR_PAYMENTS" as const, inflows: 0, outflows: 1850000, netMovement: -1850000, status: "NEEDS_REVIEW" as const },
        { category: "RENT" as const, inflows: 0, outflows: 450000, netMovement: -450000, status: "OK" as const },
        { category: "TAXES" as const, inflows: 0, outflows: 625000, netMovement: -625000, status: "LOCKED" as const },
        { category: "DEBT_SERVICE" as const, inflows: 0, outflows: 375000, netMovement: -375000, status: "OK" as const },
        { category: "INTERCOMPANY" as const, inflows: 500000, outflows: 250000, netMovement: 250000, status: "NEEDS_REVIEW" as const },
        { category: "OTHER" as const, inflows: 125000, outflows: 125000, netMovement: 0, status: "NEEDS_REVIEW" as const },
      ];
      res.json(categories);
    } catch (error) {
      console.error("Error fetching cash categories:", error);
      res.status(500).json({ error: "Failed to fetch cash categories" });
    }
  });

  // Cash mix breakdown (Level 0)
  app.get("/api/cash/mix", async (req, res) => {
    try {
      const totalMovement = 8500000 + 3200000 + 1850000 + 450000 + 625000 + 375000 + 500000 + 250000 + 250000;
      const mix = [
        { category: "CUSTOMER_RECEIPTS" as const, amount: 8500000, percentage: (8500000 / totalMovement) * 100 },
        { category: "PAYROLL" as const, amount: -3200000, percentage: (3200000 / totalMovement) * 100 },
        { category: "VENDOR_PAYMENTS" as const, amount: -1850000, percentage: (1850000 / totalMovement) * 100 },
        { category: "TAXES" as const, amount: -625000, percentage: (625000 / totalMovement) * 100 },
        { category: "RENT" as const, amount: -450000, percentage: (450000 / totalMovement) * 100 },
        { category: "DEBT_SERVICE" as const, amount: -375000, percentage: (375000 / totalMovement) * 100 },
        { category: "INTERCOMPANY" as const, amount: 250000, percentage: (500000 / totalMovement) * 100 },
      ];
      res.json(mix);
    } catch (error) {
      console.error("Error fetching cash mix:", error);
      res.status(500).json({ error: "Failed to fetch cash mix" });
    }
  });

  // Cash movement summaries (Level 1) - One row = one movement category × period
  app.get("/api/cash/movements", async (req, res) => {
    try {
      const { category } = req.query;
      // Level 1 shows aggregated category summaries per period (not individual movements)
      let movements = [
        { id: "CM-RECEIPTS-2026-01", movementCategory: "CUSTOMER_RECEIPTS" as const, cashFlowType: "OPERATING" as const, nature: "RECURRING" as const, inflows: 8500000, outflows: 0, netMovement: 8500000, fxImpact: -73000, status: "OK" as const, period: "2026-01", entityId: "ALL" },
        { id: "CM-PAYROLL-2026-01", movementCategory: "PAYROLL" as const, cashFlowType: "OPERATING" as const, nature: "RECURRING" as const, inflows: 0, outflows: 3200000, netMovement: -3200000, fxImpact: -12000, status: "OK" as const, period: "2026-01", entityId: "ALL" },
        { id: "CM-VENDOR-2026-01", movementCategory: "VENDOR_PAYMENTS" as const, cashFlowType: "OPERATING" as const, nature: "VARIABLE" as const, inflows: 0, outflows: 1850000, netMovement: -1850000, fxImpact: -18000, status: "NEEDS_REVIEW" as const, period: "2026-01", entityId: "ALL" },
        { id: "CM-RENT-2026-01", movementCategory: "RENT" as const, cashFlowType: "OPERATING" as const, nature: "RECURRING" as const, inflows: 0, outflows: 450000, netMovement: -450000, fxImpact: 0, status: "OK" as const, period: "2026-01", entityId: "ALL" },
        { id: "CM-TAXES-2026-01", movementCategory: "TAXES" as const, cashFlowType: "OPERATING" as const, nature: "RECURRING" as const, inflows: 0, outflows: 625000, netMovement: -625000, fxImpact: 0, status: "LOCKED" as const, period: "2026-01", entityId: "ALL" },
        { id: "CM-DEBT-2026-01", movementCategory: "DEBT_SERVICE" as const, cashFlowType: "FINANCING" as const, nature: "RECURRING" as const, inflows: 0, outflows: 375000, netMovement: -375000, fxImpact: 0, status: "OK" as const, period: "2026-01", entityId: "ALL" },
        { id: "CM-INTERCO-2026-01", movementCategory: "INTERCOMPANY" as const, cashFlowType: "FINANCING" as const, nature: "ONE_OFF" as const, inflows: 500000, outflows: 250000, netMovement: 250000, fxImpact: -22000, status: "NEEDS_REVIEW" as const, period: "2026-01", entityId: "ALL" },
      ];
      
      if (category) {
        const categoryFilter = (category as string).toUpperCase().replace(/-/g, "_");
        movements = movements.filter(m => m.movementCategory === categoryFilter);
      }
      
      res.json(movements);
    } catch (error) {
      console.error("Error fetching cash movements:", error);
      res.status(500).json({ error: "Failed to fetch cash movements" });
    }
  });

  // Cash movement details (Level 2) - Patterns for a specific movement ID
  app.get("/api/cash/movements/:id/details", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Map movement IDs to their patterns
      const detailsByMovementId: Record<string, any[]> = {
        "CM-RECEIPTS-2026-01": [
          { id: "CD-001", patternName: "Monthly Subscription Revenue", counterparty: "Enterprise Customers", direction: "INFLOW" as const, expected: true, amount: 5200000, varianceVsExpected: 125000, source: "BANK" as const, notes: null, movementCategory: "CUSTOMER_RECEIPTS" as const, period: "2026-01" },
          { id: "CD-002", patternName: "Usage-Based Collections", counterparty: "SMB Customers", direction: "INFLOW" as const, expected: true, amount: 2400000, varianceVsExpected: -50000, source: "BANK" as const, notes: "Slightly below forecast", movementCategory: "CUSTOMER_RECEIPTS" as const, period: "2026-01" },
          { id: "CD-003", patternName: "One-time License Fees", counterparty: null, direction: "INFLOW" as const, expected: false, amount: 900000, varianceVsExpected: 900000, source: "BANK" as const, notes: "Unplanned enterprise deal", movementCategory: "CUSTOMER_RECEIPTS" as const, period: "2026-01" },
        ],
        "CM-PAYROLL-2026-01": [
          { id: "CD-004", patternName: "Monthly Payroll - US", counterparty: "ADP Payroll", direction: "OUTFLOW" as const, expected: true, amount: 2200000, varianceVsExpected: 50000, source: "BANK" as const, notes: null, movementCategory: "PAYROLL" as const, period: "2026-01" },
          { id: "CD-005", patternName: "Monthly Payroll - EU", counterparty: "Paylocity EU", direction: "OUTFLOW" as const, expected: true, amount: 400000, varianceVsExpected: 0, source: "BANK" as const, notes: null, movementCategory: "PAYROLL" as const, period: "2026-01" },
          { id: "CD-006", patternName: "Bonus Payments Q4", counterparty: null, direction: "OUTFLOW" as const, expected: true, amount: 600000, varianceVsExpected: 100000, source: "BANK" as const, notes: "Higher than budgeted due to performance", movementCategory: "PAYROLL" as const, period: "2026-01" },
        ],
        "CM-VENDOR-2026-01": [
          { id: "CD-007", patternName: "Cloud Infrastructure", counterparty: "AWS", direction: "OUTFLOW" as const, expected: true, amount: 850000, varianceVsExpected: 75000, source: "BANK" as const, notes: "Usage spike in December", movementCategory: "VENDOR_PAYMENTS" as const, period: "2026-01" },
          { id: "CD-008", patternName: "Professional Services", counterparty: "Various Consultants", direction: "OUTFLOW" as const, expected: true, amount: 650000, varianceVsExpected: -25000, source: "BANK" as const, notes: null, movementCategory: "VENDOR_PAYMENTS" as const, period: "2026-01" },
          { id: "CD-009", patternName: "Office Supplies", counterparty: "Staples", direction: "OUTFLOW" as const, expected: false, amount: 350000, varianceVsExpected: 200000, source: "BANK" as const, notes: "Unplanned office renovation", movementCategory: "VENDOR_PAYMENTS" as const, period: "2026-01" },
        ],
        "CM-RENT-2026-01": [
          { id: "CD-010", patternName: "HQ Office Rent", counterparty: "Building Management LLC", direction: "OUTFLOW" as const, expected: true, amount: 350000, varianceVsExpected: 0, source: "BANK" as const, notes: null, movementCategory: "RENT" as const, period: "2026-01" },
          { id: "CD-011", patternName: "Regional Office Rent", counterparty: "Various Landlords", direction: "OUTFLOW" as const, expected: true, amount: 100000, varianceVsExpected: 0, source: "BANK" as const, notes: null, movementCategory: "RENT" as const, period: "2026-01" },
        ],
        "CM-TAXES-2026-01": [
          { id: "CD-012", patternName: "Federal Tax Payment", counterparty: "IRS", direction: "OUTFLOW" as const, expected: true, amount: 500000, varianceVsExpected: 0, source: "BANK" as const, notes: null, movementCategory: "TAXES" as const, period: "2026-01" },
          { id: "CD-013", patternName: "State Tax Payments", counterparty: "Various States", direction: "OUTFLOW" as const, expected: true, amount: 125000, varianceVsExpected: 0, source: "BANK" as const, notes: null, movementCategory: "TAXES" as const, period: "2026-01" },
        ],
        "CM-DEBT-2026-01": [
          { id: "CD-014", patternName: "Term Loan Principal", counterparty: "First National Bank", direction: "OUTFLOW" as const, expected: true, amount: 250000, varianceVsExpected: 0, source: "BANK" as const, notes: null, movementCategory: "DEBT_SERVICE" as const, period: "2026-01" },
          { id: "CD-015", patternName: "Term Loan Interest", counterparty: "First National Bank", direction: "OUTFLOW" as const, expected: true, amount: 125000, varianceVsExpected: 0, source: "BANK" as const, notes: null, movementCategory: "DEBT_SERVICE" as const, period: "2026-01" },
        ],
        "CM-INTERCO-2026-01": [
          { id: "CD-016", patternName: "Dividend from EU Sub", counterparty: "SUB-EU", direction: "INFLOW" as const, expected: false, amount: 500000, varianceVsExpected: 500000, source: "BANK" as const, notes: "Unplanned repatriation", movementCategory: "INTERCOMPANY" as const, period: "2026-01" },
          { id: "CD-017", patternName: "Capital Injection to JP", counterparty: "SUB-JP", direction: "OUTFLOW" as const, expected: true, amount: 250000, varianceVsExpected: 0, source: "BANK" as const, notes: null, movementCategory: "INTERCOMPANY" as const, period: "2026-01" },
        ],
        "CM-UTILITIES-2026-01": [
          { id: "CD-018", patternName: "Electric Bill", counterparty: "City Power Co", direction: "OUTFLOW" as const, expected: true, amount: 45000, varianceVsExpected: 5000, source: "BANK" as const, notes: null, movementCategory: "UTILITIES" as const, period: "2026-01" },
          { id: "CD-019", patternName: "Water & Sewage", counterparty: "Municipal Water", direction: "OUTFLOW" as const, expected: true, amount: 25000, varianceVsExpected: 0, source: "BANK" as const, notes: null, movementCategory: "UTILITIES" as const, period: "2026-01" },
          { id: "CD-020", patternName: "Internet & Telecom", counterparty: "Business ISP", direction: "OUTFLOW" as const, expected: true, amount: 15000, varianceVsExpected: 0, source: "BANK" as const, notes: null, movementCategory: "UTILITIES" as const, period: "2026-01" },
        ],
        "CM-INSURANCE-2026-01": [
          { id: "CD-021", patternName: "General Liability", counterparty: "National Insurance Co", direction: "OUTFLOW" as const, expected: true, amount: 75000, varianceVsExpected: 0, source: "BANK" as const, notes: null, movementCategory: "INSURANCE" as const, period: "2026-01" },
          { id: "CD-022", patternName: "Property Insurance", counterparty: "National Insurance Co", direction: "OUTFLOW" as const, expected: true, amount: 45000, varianceVsExpected: 0, source: "BANK" as const, notes: null, movementCategory: "INSURANCE" as const, period: "2026-01" },
        ],
      };
      
      const details = detailsByMovementId[id] || [];
      res.json(details);
    } catch (error) {
      console.error("Error fetching cash movement details:", error);
      res.status(500).json({ error: "Failed to fetch cash movement details" });
    }
  });

  // Cash Ops Expenses (aggregated subcategories)
  app.get("/api/cash/ops-expenses", async (req, res) => {
    try {
      const opsExpenses = [
        { id: "CM-PAYROLL-2026-01", movementCategory: "PAYROLL" as const, cashFlowType: "OPERATING" as const, nature: "RECURRING" as const, inflows: 0, outflows: 3200000, netMovement: -3200000, fxImpact: -12000, status: "OK" as const, period: "2026-01", entityId: "ALL" },
        { id: "CM-RENT-2026-01", movementCategory: "RENT" as const, cashFlowType: "OPERATING" as const, nature: "RECURRING" as const, inflows: 0, outflows: 450000, netMovement: -450000, fxImpact: 0, status: "OK" as const, period: "2026-01", entityId: "ALL" },
        { id: "CM-TAXES-2026-01", movementCategory: "TAXES" as const, cashFlowType: "OPERATING" as const, nature: "RECURRING" as const, inflows: 0, outflows: 625000, netMovement: -625000, fxImpact: 0, status: "LOCKED" as const, period: "2026-01", entityId: "ALL" },
        { id: "CM-UTILITIES-2026-01", movementCategory: "UTILITIES" as const, cashFlowType: "OPERATING" as const, nature: "RECURRING" as const, inflows: 0, outflows: 85000, netMovement: -85000, fxImpact: 0, status: "OK" as const, period: "2026-01", entityId: "ALL" },
        { id: "CM-INSURANCE-2026-01", movementCategory: "INSURANCE" as const, cashFlowType: "OPERATING" as const, nature: "RECURRING" as const, inflows: 0, outflows: 120000, netMovement: -120000, fxImpact: 0, status: "OK" as const, period: "2026-01", entityId: "ALL" },
      ];
      res.json(opsExpenses);
    } catch (error) {
      console.error("Error fetching ops expenses:", error);
      res.status(500).json({ error: "Failed to fetch ops expenses" });
    }
  });

  // Cash untagged transactions (for manual tagging)
  app.get("/api/cash/untagged", async (req, res) => {
    try {
      const untagged = [
        { id: "UTX-001", date: "2026-01-15", description: "Wire Transfer - ACME Corp", amount: 45000, direction: "INFLOW" as const, bankReference: "WRF-2026-1542", suggestedCategory: "CUSTOMER_RECEIPTS" },
        { id: "UTX-002", date: "2026-01-16", description: "ACH Debit - Utility Company", amount: 2350, direction: "OUTFLOW" as const, bankReference: "ACH-2026-8821", suggestedCategory: "UTILITIES" },
        { id: "UTX-003", date: "2026-01-17", description: "Check Payment #4521", amount: 8500, direction: "OUTFLOW" as const, bankReference: "CHK-4521", suggestedCategory: null },
        { id: "UTX-004", date: "2026-01-18", description: "International Wire - Unknown", amount: 125000, direction: "INFLOW" as const, bankReference: "INT-2026-0033", suggestedCategory: null },
        { id: "UTX-005", date: "2026-01-19", description: "Recurring - Cloud Services", amount: 4200, direction: "OUTFLOW" as const, bankReference: "REC-2026-0451", suggestedCategory: "VENDOR_PAYMENTS" },
        { id: "UTX-006", date: "2026-01-20", description: "Payment Received - Invoice 2341", amount: 67500, direction: "INFLOW" as const, bankReference: "PMT-2026-2341", suggestedCategory: "CUSTOMER_RECEIPTS" },
        { id: "UTX-007", date: "2026-01-21", description: "Manual Adjustment", amount: 1500, direction: "OUTFLOW" as const, bankReference: "ADJ-2026-0012", suggestedCategory: null },
      ];
      res.json(untagged);
    } catch (error) {
      console.error("Error fetching untagged transactions:", error);
      res.status(500).json({ error: "Failed to fetch untagged transactions" });
    }
  });

  // Cash bank context (Level 3)
  app.get("/api/cash/bank-context", async (req, res) => {
    try {
      const bankContext = [
        { bankAccount: "****4521", currency: "USD", openingBalance: 8500000, closingBalance: 10200000, netMovement: 1700000, fxTranslationImpact: 0 },
        { bankAccount: "****7832", currency: "EUR", openingBalance: 2200000, closingBalance: 2450000, netMovement: 250000, fxTranslationImpact: -85000 },
        { bankAccount: "****1156", currency: "GBP", openingBalance: 1800000, closingBalance: 2100000, netMovement: 300000, fxTranslationImpact: -40000 },
      ];
      res.json(bankContext);
    } catch (error) {
      console.error("Error fetching bank context:", error);
      res.status(500).json({ error: "Failed to fetch bank context" });
    }
  });

  // Cash trend data
  app.get("/api/cash/trend", async (req, res) => {
    try {
      const trend = [
        { period: "2025-08", openingBalance: 10500000, closingBalance: 11200000, netMovement: 700000 },
        { period: "2025-09", openingBalance: 11200000, closingBalance: 11800000, netMovement: 600000 },
        { period: "2025-10", openingBalance: 11800000, closingBalance: 12100000, netMovement: 300000 },
        { period: "2025-11", openingBalance: 12100000, closingBalance: 12500000, netMovement: 400000 },
        { period: "2025-12", openingBalance: 12500000, closingBalance: 12500000, netMovement: 0 },
        { period: "2026-01", openingBalance: 12500000, closingBalance: 14750000, netMovement: 2250000 },
      ];
      res.json(trend);
    } catch (error) {
      console.error("Error fetching cash trend:", error);
      res.status(500).json({ error: "Failed to fetch cash trend" });
    }
  });

  // ===== CLOSE CONTROL SYSTEM API =====

  // Close Control KPIs
  app.get("/api/close-control/kpis", async (req, res) => {
    try {
      const kpis = {
        totalSchedules: 3,
        activeSchedules: 2,
        atRiskSchedules: 1,
        completedSchedules: 0,
        totalTasks: 42,
        completedTasks: 28,
        approvedTasks: 22,
        overdueTasks: 3,
        tasksNeedingReview: 6,
        evidencePending: 8,
      };
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching close control KPIs:", error);
      res.status(500).json({ error: "Failed to fetch close control KPIs" });
    }
  });

  // Close Schedules list
  app.get("/api/close-control/schedules", async (_req, res) => {
    try {
      const schedules = [
        { period: "2026-01", scheduleId: "CS-2026-01", scheduleName: "January 2026 Month-End Close", status: "ACTIVE" as const, progressPercent: 65, daysRemaining: 3, tasksTotal: 24, tasksCompleted: 16, tasksApproved: 12, tasksOverdue: 2, riskLevel: "MEDIUM" as const },
        { period: "2025-12", scheduleId: "CS-2025-12", scheduleName: "December 2025 Month-End Close", status: "AT_RISK" as const, progressPercent: 45, daysRemaining: -2, tasksTotal: 28, tasksCompleted: 12, tasksApproved: 10, tasksOverdue: 5, riskLevel: "HIGH" as const },
        { period: "2025-Q4", scheduleId: "CS-2025-Q4", scheduleName: "Q4 2025 Quarter-End Close", status: "PLANNED" as const, progressPercent: 0, daysRemaining: 10, tasksTotal: 42, tasksCompleted: 0, tasksApproved: 0, tasksOverdue: 0, riskLevel: "NONE" as const },
      ];
      res.json(schedules);
    } catch (error) {
      console.error("Error fetching close schedules:", error);
      res.status(500).json({ error: "Failed to fetch close schedules" });
    }
  });

  // Create Close Schedule
  app.post("/api/close-control/schedules", async (req, res) => {
    try {
      const { period, scheduleName, templateId, description } = req.body;
      
      if (!period || !scheduleName) {
        return res.status(400).json({ error: "Period and schedule name are required" });
      }

      const scheduleId = `CS-${period.replace("-", "")}`;
      const newSchedule = {
        scheduleId,
        period,
        scheduleName,
        templateId: templateId || null,
        description: description || null,
        status: "PLANNED" as const,
        progressPercent: 0,
        daysRemaining: 30,
        tasksTotal: 0,
        tasksCompleted: 0,
        tasksApproved: 0,
        tasksOverdue: 0,
        riskLevel: "NONE" as const,
        createdAt: new Date().toISOString(),
      };

      res.status(201).json(newSchedule);
    } catch (error) {
      console.error("Error creating close schedule:", error);
      res.status(500).json({ error: "Failed to create close schedule" });
    }
  });

  // Single Close Schedule
  app.get("/api/close-control/schedules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const schedule = {
        id,
        name: id === "CS-2026-01" ? "January 2026 Month-End Close" : "December 2025 Month-End Close",
        period: id === "CS-2026-01" ? "2026-01" : "2025-12",
        periodType: "MONTHLY" as const,
        templateId: "TPL-MONTH-END-LEAN",
        status: id === "CS-2026-01" ? "ACTIVE" as const : "AT_RISK" as const,
        startDate: id === "CS-2026-01" ? "2026-01-28" : "2025-12-28",
        endDate: id === "CS-2026-01" ? "2026-02-05" : "2026-01-05",
        totalTasklists: 6,
        completedTasklists: 3,
        lockedTasklists: 2,
        totalTasks: 24,
        completedTasks: 16,
        approvedTasks: 12,
        riskLevel: id === "CS-2026-01" ? "MEDIUM" as const : "HIGH" as const,
        overdueTasks: id === "CS-2026-01" ? 2 : 5,
        ownerId: "U001",
        ownerName: "Jane Controller",
        lockedAt: null,
        lockedBy: null,
        createdAt: "2026-01-01T00:00:00Z",
      };
      res.json(schedule);
    } catch (error) {
      console.error("Error fetching close schedule:", error);
      res.status(500).json({ error: "Failed to fetch close schedule" });
    }
  });

  // Tasklists for a schedule
  app.get("/api/close-control/schedules/:id/tasklists", async (req, res) => {
    try {
      const tasklists = [
        { id: "TL-001", name: "Cash Close", status: "COMPLETED" as const, ownerName: "John Preparer", totalTasks: 5, completedTasks: 5, approvedTasks: 5, progressPercent: 100, dueDate: "2026-01-30", isOverdue: false, riskLevel: "NONE" as const },
        { id: "TL-002", name: "Revenue Close", status: "IN_PROGRESS" as const, ownerName: "Sarah Analyst", totalTasks: 6, completedTasks: 4, approvedTasks: 3, progressPercent: 50, dueDate: "2026-02-01", isOverdue: false, riskLevel: "LOW" as const },
        { id: "TL-003", name: "Accruals Close", status: "IN_PROGRESS" as const, ownerName: "Mike Accountant", totalTasks: 4, completedTasks: 2, approvedTasks: 1, progressPercent: 25, dueDate: "2026-02-02", isOverdue: false, riskLevel: "MEDIUM" as const },
        { id: "TL-004", name: "Fixed Assets Close", status: "LOCKED" as const, ownerName: "Jane Controller", totalTasks: 3, completedTasks: 3, approvedTasks: 3, progressPercent: 100, dueDate: "2026-01-29", isOverdue: false, riskLevel: "NONE" as const },
        { id: "TL-005", name: "Variance Analysis", status: "NOT_STARTED" as const, ownerName: null, totalTasks: 4, completedTasks: 0, approvedTasks: 0, progressPercent: 0, dueDate: "2026-02-03", isOverdue: false, riskLevel: "NONE" as const },
        { id: "TL-006", name: "Final Review", status: "NOT_STARTED" as const, ownerName: "Jane Controller", totalTasks: 2, completedTasks: 0, approvedTasks: 0, progressPercent: 0, dueDate: "2026-02-05", isOverdue: false, riskLevel: "NONE" as const },
      ];
      res.json(tasklists);
    } catch (error) {
      console.error("Error fetching tasklists:", error);
      res.status(500).json({ error: "Failed to fetch tasklists" });
    }
  });

  // Single Tasklist
  app.get("/api/close-control/tasklists/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const tasklist = {
        id,
        closeScheduleId: "CS-2026-01",
        name: id === "TL-001" ? "Cash Close" : id === "TL-002" ? "Revenue Close" : "Accruals Close",
        description: "Month-end close activities for cash and bank reconciliations",
        templateId: "TPL-CASH-CLOSE",
        status: id === "TL-001" ? "COMPLETED" as const : "IN_PROGRESS" as const,
        ownerId: "U002",
        ownerName: "John Preparer",
        totalTasks: 5,
        completedTasks: id === "TL-001" ? 5 : 3,
        approvedTasks: id === "TL-001" ? 5 : 2,
        dueDate: "2026-01-30",
        completedAt: id === "TL-001" ? "2026-01-29T18:30:00Z" : null,
        lockedAt: id === "TL-001" ? "2026-01-30T09:00:00Z" : null,
        lockedBy: id === "TL-001" ? "Jane Controller" : null,
        period: "2026-01",
        order: 1,
        createdAt: "2026-01-01T00:00:00Z",
      };
      res.json(tasklist);
    } catch (error) {
      console.error("Error fetching tasklist:", error);
      res.status(500).json({ error: "Failed to fetch tasklist" });
    }
  });

  // Tasks for a tasklist
  app.get("/api/close-control/tasklists/:id/tasks", async (req, res) => {
    try {
      const { id } = req.params;
      const tasks = await storage.getCloseTasklistTasks(id);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Create a new task in a tasklist
  app.post("/api/close-control/tasklists/:id/tasks", async (req, res) => {
    try {
      const { id } = req.params;
      const taskData = { ...req.body, tasklistId: id };
      const task = await storage.createCloseTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  // Update a close task
  app.patch("/api/close-control/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const task = await storage.getCloseTask(id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      const updated = await storage.updateCloseTask(id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  // All tasklists across all schedules
  app.get("/api/close-control/tasklists", async (_req, res) => {
    try {
      const tasklists = [
        { id: "TL-001", closeScheduleId: "CS-2026-01", name: "Cash Close", description: "Month-end close activities for cash and bank reconciliations", status: "COMPLETED" as const, totalTasks: 5, completedTasks: 5, dueDate: "2026-01-30", period: "2026-01" },
        { id: "TL-002", closeScheduleId: "CS-2026-01", name: "Prepaids Close", description: "Prepaid expense review and amortization", status: "IN_PROGRESS" as const, totalTasks: 6, completedTasks: 3, dueDate: "2026-01-30", period: "2026-01" },
        { id: "TL-003", closeScheduleId: "CS-2026-01", name: "Accruals Close", description: "Month-end accrual review and adjustments", status: "IN_PROGRESS" as const, totalTasks: 6, completedTasks: 3, dueDate: "2026-01-30", period: "2026-01" },
      ];
      res.json(tasklists);
    } catch (error) {
      console.error("Error fetching tasklists:", error);
      res.status(500).json({ error: "Failed to fetch tasklists" });
    }
  });

  // My Tasks - all tasks assigned to current user (for demo, return all tasks)
  app.get("/api/close-control/my-tasks", async (req, res) => {
    try {
      const tasks = await storage.getAllCloseTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching my tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Close Control Templates - List all templates
  app.get("/api/close-control/templates", async (req, res) => {
    try {
      const templateType = req.query.type as "TASKLIST" | "SCHEDULE" | undefined;
      const templates = await storage.getCloseTemplates(templateType);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  // Get single template with tasks
  app.get("/api/close-control/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getCloseTemplate(id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      const tasks = await storage.getCloseTemplateTasks(id);
      res.json({ ...template, tasks });
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // Create new template
  app.post("/api/close-control/templates", async (req, res) => {
    try {
      const validatedData = insertCloseTemplateSchema.parse(req.body);
      const template = await storage.createCloseTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating template:", error);
      res.status(500).json({ error: "Failed to create template" });
    }
  });

  // Update template
  app.patch("/api/close-control/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateCloseTemplateSchema.parse(req.body);
      const template = await storage.updateCloseTemplate(id, validatedData);
      res.json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      if (error instanceof Error && error.message === "Template not found") {
        return res.status(404).json({ error: "Template not found" });
      }
      if (error instanceof Error && error.message === "Cannot modify system templates") {
        return res.status(403).json({ error: "Cannot modify system templates" });
      }
      console.error("Error updating template:", error);
      res.status(500).json({ error: "Failed to update template" });
    }
  });

  // Delete template
  app.delete("/api/close-control/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCloseTemplate(id);
      if (!deleted) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === "Cannot delete system templates") {
        return res.status(403).json({ error: "Cannot delete system templates" });
      }
      console.error("Error deleting template:", error);
      res.status(500).json({ error: "Failed to delete template" });
    }
  });

  // Clone template
  app.post("/api/close-control/templates/:id/clone", async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Name is required for cloning" });
      }
      const cloned = await storage.cloneCloseTemplate(id, name);
      res.status(201).json(cloned);
    } catch (error) {
      if (error instanceof Error && error.message === "Template not found") {
        return res.status(404).json({ error: "Template not found" });
      }
      console.error("Error cloning template:", error);
      res.status(500).json({ error: "Failed to clone template" });
    }
  });

  // Get template tasks
  app.get("/api/close-control/templates/:id/tasks", async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getCloseTemplate(id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      const tasks = await storage.getCloseTemplateTasks(id);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching template tasks:", error);
      res.status(500).json({ error: "Failed to fetch template tasks" });
    }
  });

  // Create template task
  app.post("/api/close-control/templates/:id/tasks", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertCloseTemplateTaskSchema.parse({ ...req.body, templateId: id });
      const task = await storage.createCloseTemplateTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      if (error instanceof Error && error.message === "Template not found") {
        return res.status(404).json({ error: "Template not found" });
      }
      if (error instanceof Error && error.message === "Cannot modify system templates") {
        return res.status(403).json({ error: "Cannot modify system templates" });
      }
      console.error("Error creating template task:", error);
      res.status(500).json({ error: "Failed to create template task" });
    }
  });

  // Update template task
  app.patch("/api/close-control/template-tasks/:taskId", async (req, res) => {
    try {
      const { taskId } = req.params;
      const validatedData = updateCloseTemplateTaskSchema.parse(req.body);
      const task = await storage.updateCloseTemplateTask(taskId, validatedData);
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      if (error instanceof Error && error.message === "Task not found") {
        return res.status(404).json({ error: "Task not found" });
      }
      if (error instanceof Error && error.message === "Cannot modify tasks in system templates") {
        return res.status(403).json({ error: "Cannot modify tasks in system templates" });
      }
      console.error("Error updating template task:", error);
      res.status(500).json({ error: "Failed to update template task" });
    }
  });

  // Delete template task
  app.delete("/api/close-control/template-tasks/:taskId", async (req, res) => {
    try {
      const { taskId } = req.params;
      const deleted = await storage.deleteCloseTemplateTask(taskId);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === "Cannot modify tasks in system templates") {
        return res.status(403).json({ error: "Cannot modify tasks in system templates" });
      }
      console.error("Error deleting template task:", error);
      res.status(500).json({ error: "Failed to delete template task" });
    }
  });

  // Reorder template tasks
  app.post("/api/close-control/templates/:id/tasks/reorder", async (req, res) => {
    try {
      const { id } = req.params;
      const { taskIds } = req.body;
      if (!Array.isArray(taskIds)) {
        return res.status(400).json({ error: "taskIds must be an array" });
      }
      const tasks = await storage.reorderCloseTemplateTasks(id, taskIds);
      res.json(tasks);
    } catch (error) {
      if (error instanceof Error && error.message === "Template not found") {
        return res.status(404).json({ error: "Template not found" });
      }
      if (error instanceof Error && error.message === "Cannot modify system templates") {
        return res.status(403).json({ error: "Cannot modify system templates" });
      }
      console.error("Error reordering template tasks:", error);
      res.status(500).json({ error: "Failed to reorder template tasks" });
    }
  });

  // ===== CERTIFICATION & SOD ENDPOINTS =====

  // Get SoD configuration
  app.get("/api/close-control/sod/config", async (_req, res) => {
    try {
      const config = {
        isEnabled: true,
        enforcementLevel: "WARN" as const,
        allowOverrides: true,
        requireOverrideApproval: true,
        rules: [
          {
            id: "SOD-001",
            name: "Preparer Cannot Approve",
            description: "The same person who prepares a task cannot approve it",
            conflictingRoles: ["PREPARER", "APPROVER"] as [string, string],
            severity: "CRITICAL" as const,
            isActive: true,
            allowOverride: true,
            createdAt: "2026-01-01T00:00:00Z",
            createdBy: "SYSTEM",
          },
          {
            id: "SOD-002",
            name: "Reviewer Cannot Be Preparer",
            description: "The same person who reviews a task should not have prepared it",
            conflictingRoles: ["PREPARER", "REVIEWER"] as [string, string],
            severity: "HIGH" as const,
            isActive: true,
            allowOverride: true,
            createdAt: "2026-01-01T00:00:00Z",
            createdBy: "SYSTEM",
          },
        ],
      };
      res.json(config);
    } catch (error) {
      console.error("Error fetching SoD config:", error);
      res.status(500).json({ error: "Failed to fetch SoD configuration" });
    }
  });

  // Get SoD policy rules
  app.get("/api/close-control/sod/rules", async (_req, res) => {
    try {
      const rules = [
        {
          id: "SOD-001",
          name: "Preparer Cannot Approve",
          description: "The same person who prepares a task cannot approve it",
          conflictingRoles: ["PREPARER", "APPROVER"] as [string, string],
          severity: "CRITICAL" as const,
          isActive: true,
          allowOverride: true,
          createdAt: "2026-01-01T00:00:00Z",
          createdBy: "SYSTEM",
        },
        {
          id: "SOD-002",
          name: "Reviewer Cannot Be Preparer",
          description: "The same person who reviews a task should not have prepared it",
          conflictingRoles: ["PREPARER", "REVIEWER"] as [string, string],
          severity: "HIGH" as const,
          isActive: true,
          allowOverride: true,
          createdAt: "2026-01-01T00:00:00Z",
          createdBy: "SYSTEM",
        },
        {
          id: "SOD-003",
          name: "Reviewer Cannot Approve",
          description: "The same person who reviews a task should not approve it",
          conflictingRoles: ["REVIEWER", "APPROVER"] as [string, string],
          severity: "MEDIUM" as const,
          isActive: false,
          allowOverride: true,
          createdAt: "2026-01-01T00:00:00Z",
          createdBy: "SYSTEM",
        },
      ];
      res.json(rules);
    } catch (error) {
      console.error("Error fetching SoD rules:", error);
      res.status(500).json({ error: "Failed to fetch SoD rules" });
    }
  });

  // Get SoD violations
  app.get("/api/close-control/sod/violations", async (req, res) => {
    try {
      const { scheduleId, status } = req.query;
      let violations = [
        {
          id: "VIO-001",
          policyRuleId: "SOD-001",
          policyRuleName: "Preparer Cannot Approve",
          taskId: "T-003",
          taskName: "Reconcile Cash Accounts",
          tasklistId: "TL-001",
          scheduleId: "CS-2026-01",
          userId: "U001",
          userName: "Jane Controller",
          conflictingRole1: "PREPARER" as const,
          conflictingRole2: "APPROVER" as const,
          severity: "CRITICAL" as const,
          status: "ACTIVE" as const,
          overrideReason: null,
          overriddenBy: null,
          overriddenAt: null,
          detectedAt: "2026-01-28T10:00:00Z",
        },
        {
          id: "VIO-002",
          policyRuleId: "SOD-002",
          policyRuleName: "Reviewer Cannot Be Preparer",
          taskId: "T-008",
          taskName: "Review Revenue Recognition",
          tasklistId: "TL-002",
          scheduleId: "CS-2026-01",
          userId: "U002",
          userName: "Sarah Analyst",
          conflictingRole1: "PREPARER" as const,
          conflictingRole2: "REVIEWER" as const,
          severity: "HIGH" as const,
          status: "OVERRIDDEN" as const,
          overrideReason: "Staffing constraints - only qualified person available",
          overriddenBy: "Jane Controller",
          overriddenAt: "2026-01-29T14:00:00Z",
          detectedAt: "2026-01-28T11:00:00Z",
        },
      ];

      if (scheduleId) {
        violations = violations.filter(v => v.scheduleId === scheduleId);
      }
      if (status) {
        violations = violations.filter(v => v.status === status);
      }

      res.json(violations);
    } catch (error) {
      console.error("Error fetching SoD violations:", error);
      res.status(500).json({ error: "Failed to fetch SoD violations" });
    }
  });

  // Override SoD violation
  app.post("/api/close-control/sod/violations/:id/override", async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      if (!reason || reason.length < 10) {
        return res.status(400).json({ error: "Override reason must be at least 10 characters" });
      }

      const overriddenViolation = {
        id,
        status: "OVERRIDDEN" as const,
        overrideReason: reason,
        overriddenBy: "Current User",
        overriddenAt: new Date().toISOString(),
      };

      res.json(overriddenViolation);
    } catch (error) {
      console.error("Error overriding SoD violation:", error);
      res.status(500).json({ error: "Failed to override SoD violation" });
    }
  });

  // Get certifications
  app.get("/api/close-control/certifications", async (req, res) => {
    try {
      const { scheduleId, objectType } = req.query;
      let certifications = [
        {
          id: "CERT-001",
          objectType: "TASKLIST" as const,
          objectId: "TL-001",
          objectName: "Cash Close",
          period: "2026-01",
          status: "CERTIFIED" as const,
          certifiedBy: "U001",
          certifiedByName: "Jane Controller",
          certifiedAt: "2026-01-30T16:00:00Z",
          certificationStatement: "I certify that all tasks in this tasklist have been completed accurately and in accordance with company policies.",
          decertifiedBy: null,
          decertifiedByName: null,
          decertifiedAt: null,
          decertificationReason: null,
          expiresAt: "2026-02-28T23:59:59Z",
          createdAt: "2026-01-30T16:00:00Z",
        },
        {
          id: "CERT-002",
          objectType: "TASKLIST" as const,
          objectId: "TL-002",
          objectName: "Revenue Close",
          period: "2026-01",
          status: "PENDING" as const,
          certifiedBy: null,
          certifiedByName: null,
          certifiedAt: null,
          certificationStatement: null,
          decertifiedBy: null,
          decertifiedByName: null,
          decertifiedAt: null,
          decertificationReason: null,
          expiresAt: null,
          createdAt: "2026-01-28T00:00:00Z",
        },
        {
          id: "CERT-003",
          objectType: "TASKLIST" as const,
          objectId: "TL-004",
          objectName: "Fixed Assets Close",
          period: "2026-01",
          status: "CERTIFIED" as const,
          certifiedBy: "U001",
          certifiedByName: "Jane Controller",
          certifiedAt: "2026-01-29T14:00:00Z",
          certificationStatement: "I certify that all fixed asset depreciation calculations are correct and properly recorded.",
          decertifiedBy: null,
          decertifiedByName: null,
          decertifiedAt: null,
          decertificationReason: null,
          expiresAt: "2026-02-28T23:59:59Z",
          createdAt: "2026-01-29T14:00:00Z",
        },
        {
          id: "CERT-004",
          objectType: "SCHEDULE" as const,
          objectId: "CS-2025-12",
          objectName: "December 2025 Month-End Close",
          period: "2025-12",
          status: "CERTIFIED" as const,
          certifiedBy: "U001",
          certifiedByName: "Jane Controller",
          certifiedAt: "2026-01-05T18:00:00Z",
          certificationStatement: "I certify that all close activities for December 2025 have been completed and reviewed in accordance with established procedures.",
          decertifiedBy: null,
          decertifiedByName: null,
          decertifiedAt: null,
          decertificationReason: null,
          expiresAt: null,
          createdAt: "2026-01-05T18:00:00Z",
        },
      ];

      if (scheduleId) {
        certifications = certifications.filter(c => 
          c.objectId === scheduleId || 
          (c.objectType === "TASKLIST" && scheduleId === "CS-2026-01" && ["TL-001", "TL-002", "TL-004"].includes(c.objectId))
        );
      }
      if (objectType) {
        certifications = certifications.filter(c => c.objectType === objectType);
      }

      res.json(certifications);
    } catch (error) {
      console.error("Error fetching certifications:", error);
      res.status(500).json({ error: "Failed to fetch certifications" });
    }
  });

  // Create certification (sign-off)
  app.post("/api/close-control/certifications", async (req, res) => {
    try {
      const { objectType, objectId, statement } = req.body;

      if (!objectType || !objectId || !statement) {
        return res.status(400).json({ error: "objectType, objectId, and statement are required" });
      }

      const certification = {
        id: `CERT-${Date.now()}`,
        objectType,
        objectId,
        objectName: objectType === "TASKLIST" ? "Tasklist" : "Schedule",
        period: "2026-01",
        status: "CERTIFIED" as const,
        certifiedBy: "U001",
        certifiedByName: "Current User",
        certifiedAt: new Date().toISOString(),
        certificationStatement: statement,
        decertifiedBy: null,
        decertifiedByName: null,
        decertifiedAt: null,
        decertificationReason: null,
        expiresAt: null,
        createdAt: new Date().toISOString(),
      };

      res.status(201).json(certification);
    } catch (error) {
      console.error("Error creating certification:", error);
      res.status(500).json({ error: "Failed to create certification" });
    }
  });

  // Decertify
  app.post("/api/close-control/certifications/:id/decertify", async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({ error: "Decertification reason is required" });
      }

      const decertification = {
        id,
        status: "DECERTIFIED" as const,
        decertifiedBy: "U001",
        decertifiedByName: "Current User",
        decertifiedAt: new Date().toISOString(),
        decertificationReason: reason,
      };

      res.json(decertification);
    } catch (error) {
      console.error("Error decertifying:", error);
      res.status(500).json({ error: "Failed to decertify" });
    }
  });

  // Certification KPIs
  app.get("/api/close-control/certifications/kpis", async (_req, res) => {
    try {
      const kpis = {
        totalTasklists: 6,
        certifiedTasklists: 2,
        pendingCertification: 3,
        expiringSoon: 1,
        sodViolationsActive: 1,
        sodViolationsOverridden: 1,
      };
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching certification KPIs:", error);
      res.status(500).json({ error: "Failed to fetch certification KPIs" });
    }
  });

  // Get close control users (for assignment)
  app.get("/api/close-control/users", async (_req, res) => {
    try {
      const users = [
        { id: "U001", name: "Jane Controller", email: "jane@company.com", department: "Finance", roles: ["PREPARER", "REVIEWER", "APPROVER"] as string[], isActive: true, createdAt: "2025-01-01T00:00:00Z" },
        { id: "U002", name: "Sarah Analyst", email: "sarah@company.com", department: "Finance", roles: ["PREPARER", "REVIEWER"] as string[], isActive: true, createdAt: "2025-01-01T00:00:00Z" },
        { id: "U003", name: "Mike Accountant", email: "mike@company.com", department: "Accounting", roles: ["PREPARER"] as string[], isActive: true, createdAt: "2025-01-01T00:00:00Z" },
        { id: "U004", name: "John Preparer", email: "john@company.com", department: "Accounting", roles: ["PREPARER"] as string[], isActive: true, createdAt: "2025-01-01T00:00:00Z" },
        { id: "U005", name: "Lisa CFO", email: "lisa@company.com", department: "Executive", roles: ["APPROVER"] as string[], isActive: true, createdAt: "2025-01-01T00:00:00Z" },
      ];
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Check SoD for task assignment
  app.post("/api/close-control/sod/check", async (req, res) => {
    try {
      const { taskId, userId, role } = req.body;

      // Simulate SoD check - in real app would check against actual assignments
      const mockViolation = userId === "U001" && role === "APPROVER" ? {
        hasViolation: true,
        violation: {
          policyRuleId: "SOD-001",
          policyRuleName: "Preparer Cannot Approve",
          conflictingRole1: "PREPARER",
          conflictingRole2: "APPROVER",
          severity: "CRITICAL",
          message: "This user is already assigned as Preparer for this task",
        },
      } : {
        hasViolation: false,
        violation: null,
      };

      res.json(mockViolation);
    } catch (error) {
      console.error("Error checking SoD:", error);
      res.status(500).json({ error: "Failed to check SoD" });
    }
  });

  // ============================================
  // RECONCILIATION API ROUTES
  // ============================================

  // Get reconciliation KPIs
  app.get("/api/reconciliations/kpis", async (req, res) => {
    try {
      const { entityId, period } = req.query;
      const kpis = await storage.getReconciliationKPIs(
        entityId as string | undefined,
        period as string | undefined
      );
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching reconciliation KPIs:", error);
      res.status(500).json({ error: "Failed to fetch KPIs" });
    }
  });

  // Get all reconciliation templates
  app.get("/api/reconciliations/templates", async (req, res) => {
    try {
      const templates = await storage.getReconciliationTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching reconciliation templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  // Get single template
  app.get("/api/reconciliations/templates/:id", async (req, res) => {
    try {
      const template = await storage.getReconciliationTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // Get all reconciliation accounts
  app.get("/api/reconciliations/accounts", async (req, res) => {
    try {
      const { entityId, accountType } = req.query;
      const accounts = await storage.getReconciliationAccounts(
        entityId as string | undefined,
        accountType as any
      );
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching reconciliation accounts:", error);
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  });

  // Get single account
  app.get("/api/reconciliations/accounts/:id", async (req, res) => {
    try {
      const account = await storage.getReconciliationAccount(req.params.id);
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
      res.json(account);
    } catch (error) {
      console.error("Error fetching account:", error);
      res.status(500).json({ error: "Failed to fetch account" });
    }
  });

  // Get all reconciliations
  app.get("/api/reconciliations", async (req, res) => {
    try {
      const { accountId, period, status } = req.query;
      const reconciliations = await storage.getReconciliations(
        accountId as string | undefined,
        period as string | undefined,
        status as any
      );
      res.json(reconciliations);
    } catch (error) {
      console.error("Error fetching reconciliations:", error);
      res.status(500).json({ error: "Failed to fetch reconciliations" });
    }
  });

  // Get single reconciliation
  app.get("/api/reconciliations/:id", async (req, res) => {
    try {
      const reconciliation = await storage.getReconciliation(req.params.id);
      if (!reconciliation) {
        return res.status(404).json({ error: "Reconciliation not found" });
      }
      
      // Also fetch account and template for full context
      const account = await storage.getReconciliationAccount(reconciliation.accountId);
      const template = await storage.getReconciliationTemplate(reconciliation.templateId);
      
      res.json({
        reconciliation,
        account,
        template,
      });
    } catch (error) {
      console.error("Error fetching reconciliation:", error);
      res.status(500).json({ error: "Failed to fetch reconciliation" });
    }
  });

  // Create reconciliation
  app.post("/api/reconciliations", async (req, res) => {
    try {
      const reconciliation = await storage.createReconciliation(req.body);
      res.status(201).json(reconciliation);
    } catch (error) {
      console.error("Error creating reconciliation:", error);
      res.status(500).json({ error: "Failed to create reconciliation" });
    }
  });

  // Update reconciliation status
  app.patch("/api/reconciliations/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const userId = "Current User"; // In real app, get from auth
      const reconciliation = await storage.updateReconciliationStatus(
        req.params.id,
        status,
        userId
      );
      res.json(reconciliation);
    } catch (error) {
      console.error("Error updating reconciliation status:", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  // Add line item to reconciliation section
  app.post("/api/reconciliations/:id/sections/:sectionId/items", async (req, res) => {
    try {
      const { id, sectionId } = req.params;
      const reconciliation = await storage.addReconciliationLineItem(
        id,
        sectionId,
        req.body
      );
      res.status(201).json(reconciliation);
    } catch (error) {
      console.error("Error adding line item:", error);
      res.status(500).json({ error: "Failed to add line item" });
    }
  });

  // Change reconciliation template
  app.patch("/api/reconciliations/:id/template", async (req, res) => {
    try {
      const schema = z.object({
        templateId: z.string().min(1, "templateId is required"),
      });
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }
      const { templateId } = result.data;
      const reconciliation = await storage.updateReconciliationTemplate(
        req.params.id,
        templateId
      );
      res.json(reconciliation);
    } catch (error) {
      console.error("Error updating reconciliation template:", error);
      res.status(500).json({ error: "Failed to update template" });
    }
  });

  // Generate accounting policy with AI
  app.post("/api/generate-policy", async (req, res) => {
    try {
      const schema = z.object({
        prompt: z.string().min(1, "Prompt is required"),
      });
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }
      
      const { prompt } = result.data;
      
      // Use OpenAI to generate policy text
      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI();
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert financial reporting specialist who drafts accounting policies for financial statement disclosures. 
            
When given a description, generate a professional accounting policy following these guidelines:
- Use formal financial reporting language
- Reference relevant accounting standards (ASC topics for US GAAP, IFRS for international)
- Include measurement bases, recognition criteria, and disclosure requirements
- Structure with clear paragraphs and bullet points where appropriate
- Be comprehensive but concise

Respond with a JSON object containing:
- policyName: A formal name for the policy
- category: One of: General, Assets, Liabilities, Revenue, Taxes, Financial Instruments, Leases, Compensation, Standards
- policyText: The full policy text (use markdown formatting for headers and bullets)`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });
      
      const content = completion.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ error: "No response from AI" });
      }
      
      // Parse and validate AI response with Zod
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (parseError) {
        console.error("Failed to parse AI response:", content);
        return res.status(500).json({ error: "Invalid AI response format" });
      }
      
      const responseSchema = z.object({
        policyName: z.string().default(""),
        category: z.string().default("General"),
        policyText: z.string().default(""),
      });
      
      const validatedResponse = responseSchema.safeParse(parsed);
      if (!validatedResponse.success) {
        console.error("AI response validation failed:", validatedResponse.error);
        return res.status(500).json({ error: "AI response does not match expected format" });
      }
      
      res.json(validatedResponse.data);
    } catch (error) {
      console.error("Error generating policy:", error);
      res.status(500).json({ error: "Failed to generate policy" });
    }
  });

  // ==================== ENTITY MANAGEMENT ====================
  
  // Get all database entities
  app.get("/api/db/entities", async (req, res) => {
    try {
      const { entities } = await import("@shared/models/auth");
      const { db } = await import("./db");
      const allEntities = await db.select().from(entities);
      res.json(allEntities);
    } catch (error) {
      console.error("Error fetching entities:", error);
      res.status(500).json({ error: "Failed to fetch entities" });
    }
  });

  // Create new entity
  app.post("/api/db/entities", async (req, res) => {
    try {
      const { entities, InsertEntity } = await import("@shared/models/auth");
      const { db } = await import("./db");
      
      const entityData = {
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        currency: req.body.currency || "USD",
        fiscalYearEnd: req.body.fiscalYearEnd || "12-31",
        isActive: req.body.isActive !== false,
      };
      
      const [newEntity] = await db.insert(entities).values(entityData).returning();
      res.status(201).json(newEntity);
    } catch (error) {
      console.error("Error creating entity:", error);
      res.status(500).json({ error: "Failed to create entity" });
    }
  });

  // Get audit logs
  app.get("/api/audit-logs", async (req, res) => {
    try {
      const { auditLogs } = await import("@shared/models/auth");
      const { db } = await import("./db");
      const { desc } = await import("drizzle-orm");
      
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  // ==================== IMPORT/EXPORT ROUTES ====================
  
  // Trial Balance Import
  app.post("/api/import/trial-balance", async (req, res) => {
    try {
      const multer = (await import("multer")).default;
      const XLSX = await import("xlsx");
      
      // Parse the uploaded data (assuming JSON format for simplicity)
      const { data, entityId, periodId } = req.body;
      
      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: "Invalid data format. Expected array of trial balance entries." });
      }

      // Validate TB entries
      const validEntries = data.filter((entry: any) => 
        entry.accountCode && 
        entry.accountName && 
        (entry.debit !== undefined || entry.credit !== undefined)
      );

      if (validEntries.length === 0) {
        return res.status(400).json({ error: "No valid trial balance entries found" });
      }

      // Log the import
      const { auditLogs } = await import("@shared/models/auth");
      const { db } = await import("./db");
      const user = req.user as any;
      
      await db.insert(auditLogs).values({
        userId: user?.id || null,
        entityId: entityId || null,
        action: "IMPORT",
        tableName: "trial_balance",
        recordId: `import-${Date.now()}`,
        newValues: { count: validEntries.length, entityId, periodId },
      });

      res.json({ 
        success: true, 
        message: `Imported ${validEntries.length} trial balance entries`,
        count: validEntries.length 
      });
    } catch (error) {
      console.error("Error importing trial balance:", error);
      res.status(500).json({ error: "Failed to import trial balance" });
    }
  });

  // Parse uploaded Excel/CSV file for trial balance
  app.post("/api/import/parse-file", async (req, res) => {
    try {
      const XLSX = await import("xlsx");
      const { fileContent, fileName } = req.body;
      
      if (!fileContent) {
        return res.status(400).json({ error: "No file content provided" });
      }

      // Parse base64 file content
      const buffer = Buffer.from(fileContent, "base64");
      const workbook = XLSX.read(buffer, { type: "buffer" });
      
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      res.json({ 
        success: true, 
        data,
        rowCount: data.length,
        columns: data.length > 0 ? Object.keys(data[0] as object) : []
      });
    } catch (error) {
      console.error("Error parsing file:", error);
      res.status(500).json({ error: "Failed to parse file" });
    }
  });

  // Export financial statements to PDF
  app.get("/api/export/pdf/:type", async (req, res) => {
    try {
      const PDFDocument = (await import("pdfkit")).default;
      const { type } = req.params;
      const { entityId, periodId } = req.query;

      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const result = Buffer.concat(chunks);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${type}-${periodId || "current"}.pdf"`);
        res.send(result);
      });

      // Add content based on type
      doc.fontSize(20).text(`Financial Statement: ${type.toUpperCase()}`, { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Entity: ${entityId || "All Entities"}`);
      doc.text(`Period: ${periodId || "Current Period"}`);
      doc.text(`Generated: ${new Date().toISOString()}`);
      doc.moveDown();

      // Add placeholder content based on statement type
      switch (type) {
        case "balance-sheet":
          doc.fontSize(14).text("Balance Sheet", { underline: true });
          doc.moveDown();
          doc.fontSize(10).text("Assets");
          doc.text("  Current Assets: $xxx,xxx");
          doc.text("  Non-Current Assets: $xxx,xxx");
          doc.moveDown();
          doc.text("Liabilities");
          doc.text("  Current Liabilities: $xxx,xxx");
          doc.text("  Non-Current Liabilities: $xxx,xxx");
          doc.moveDown();
          doc.text("Equity: $xxx,xxx");
          break;
        case "income-statement":
          doc.fontSize(14).text("Income Statement", { underline: true });
          doc.moveDown();
          doc.fontSize(10).text("Revenue: $xxx,xxx");
          doc.text("Cost of Goods Sold: $xxx,xxx");
          doc.text("Gross Profit: $xxx,xxx");
          doc.text("Operating Expenses: $xxx,xxx");
          doc.text("Net Income: $xxx,xxx");
          break;
        case "cash-flow":
          doc.fontSize(14).text("Statement of Cash Flows", { underline: true });
          doc.moveDown();
          doc.fontSize(10).text("Operating Activities: $xxx,xxx");
          doc.text("Investing Activities: $xxx,xxx");
          doc.text("Financing Activities: $xxx,xxx");
          doc.text("Net Change in Cash: $xxx,xxx");
          break;
        default:
          doc.text(`Report type: ${type}`);
      }

      // Log the export
      const { auditLogs } = await import("@shared/models/auth");
      const { db } = await import("./db");
      const user = req.user as any;
      
      await db.insert(auditLogs).values({
        userId: user?.id || null,
        entityId: entityId ? parseInt(entityId as string) : null,
        action: "EXPORT_PDF",
        tableName: type,
        recordId: `export-${Date.now()}`,
        newValues: { type, entityId, periodId },
      });

      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  // Export financial data to Excel
  app.get("/api/export/excel/:type", async (req, res) => {
    try {
      const XLSX = await import("xlsx");
      const { type } = req.params;
      const { entityId, periodId } = req.query;

      let data: any[] = [];
      let sheetName = type;

      // Get data based on type
      switch (type) {
        case "trial-balance":
          sheetName = "Trial Balance";
          data = [
            { "Account Code": "1000", "Account Name": "Cash", "Debit": 100000, "Credit": 0 },
            { "Account Code": "1100", "Account Name": "Accounts Receivable", "Debit": 50000, "Credit": 0 },
            { "Account Code": "2000", "Account Name": "Accounts Payable", "Debit": 0, "Credit": 30000 },
            { "Account Code": "3000", "Account Name": "Common Stock", "Debit": 0, "Credit": 100000 },
            { "Account Code": "4000", "Account Name": "Revenue", "Debit": 0, "Credit": 200000 },
            { "Account Code": "5000", "Account Name": "Expenses", "Debit": 180000, "Credit": 0 },
          ];
          break;
        case "schedules":
          sheetName = "Schedules";
          const schedules = await storage.getSchedules();
          data = schedules.map(s => ({
            "Schedule ID": s.scheduleId,
            "Type": s.scheduleType,
            "Entity": s.entityId,
            "Description": s.description,
            "Start Date": s.startDate,
            "End Date": s.endDate,
            "Amount (Local)": s.totalAmountLocalInitial,
            "Amount (Reporting)": s.totalAmountReportingInitial,
            "Currency": s.localCurrency,
          }));
          break;
        case "prepaids":
          sheetName = "Prepaid Schedules";
          const prepaids = await storage.getPrepaidSchedules();
          data = prepaids.map(p => ({
            "Name": p.name,
            "Category": p.subcategory,
            "Entity": p.entityId,
            "Original Amount": p.originalAmount,
            "Remaining Balance": p.remainingBalance,
            "Monthly Expense": p.monthlyExpense,
            "Start Date": p.startDate,
            "End Date": p.endDate,
            "Status": p.status,
          }));
          break;
        default:
          data = [{ Message: "No data available for this export type" }];
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      
      const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${type}-${periodId || "export"}.xlsx"`);
      
      // Log the export
      const { auditLogs } = await import("@shared/models/auth");
      const { db } = await import("./db");
      const user = req.user as any;
      
      await db.insert(auditLogs).values({
        userId: user?.id || null,
        entityId: entityId ? parseInt(entityId as string) : null,
        action: "EXPORT_EXCEL",
        tableName: type,
        recordId: `export-${Date.now()}`,
        newValues: { type, entityId, periodId, rowCount: data.length },
      });

      res.send(buffer);
    } catch (error) {
      console.error("Error generating Excel:", error);
      res.status(500).json({ error: "Failed to generate Excel" });
    }
  });

  // ===== GL MASTER MAPPING ROUTES =====
  
  // Get all GL Master Mappings
  app.get("/api/gl-mappings", async (req, res) => {
    try {
      const mappings = await storage.getGLMasterMappings();
      res.json(mappings);
    } catch (error) {
      console.error("Error fetching GL mappings:", error);
      res.status(500).json({ error: "Failed to fetch GL mappings" });
    }
  });

  // Get unique WP names from mappings
  app.get("/api/gl-mappings/wp-names", async (req, res) => {
    try {
      const wpNames = await storage.getUniqueWPNames();
      res.json(wpNames);
    } catch (error) {
      console.error("Error fetching WP names:", error);
      res.status(500).json({ error: "Failed to fetch WP names" });
    }
  });

  // Get single GL Master Mapping
  app.get("/api/gl-mappings/:id", async (req, res) => {
    try {
      const mapping = await storage.getGLMasterMapping(req.params.id);
      if (!mapping) {
        return res.status(404).json({ error: "Mapping not found" });
      }
      res.json(mapping);
    } catch (error) {
      console.error("Error fetching GL mapping:", error);
      res.status(500).json({ error: "Failed to fetch GL mapping" });
    }
  });

  // Create GL Master Mapping
  app.post("/api/gl-mappings", async (req, res) => {
    try {
      const { glAccountNumber, glDescriptionCategory, footnoteDescription } = req.body;
      
      // Server-side validation
      if (!glAccountNumber || !glDescriptionCategory || !footnoteDescription) {
        return res.status(400).json({ 
          error: "Missing required fields: glAccountNumber, glDescriptionCategory, footnoteDescription" 
        });
      }
      
      const mapping = await storage.createGLMasterMapping(req.body);
      res.status(201).json(mapping);
    } catch (error: any) {
      console.error("Error creating GL mapping:", error);
      // Handle duplicate GL number error
      if (error.message?.includes("already exists")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to create GL mapping" });
    }
  });

  // Update GL Master Mapping
  app.patch("/api/gl-mappings/:id", async (req, res) => {
    try {
      const mapping = await storage.updateGLMasterMapping(req.params.id, req.body);
      res.json(mapping);
    } catch (error) {
      console.error("Error updating GL mapping:", error);
      res.status(500).json({ error: "Failed to update GL mapping" });
    }
  });

  // Delete GL Master Mapping
  app.delete("/api/gl-mappings/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteGLMasterMapping(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Mapping not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting GL mapping:", error);
      res.status(500).json({ error: "Failed to delete GL mapping" });
    }
  });

  // ===== TRIAL BALANCE IMPORT ROUTES =====
  
  // Get all TB Import Batches
  app.get("/api/tb-imports", async (req, res) => {
    try {
      const { entityId, periodId } = req.query;
      const batches = await storage.getTBImportBatches(
        entityId as string | undefined,
        periodId as string | undefined
      );
      res.json(batches);
    } catch (error) {
      console.error("Error fetching TB imports:", error);
      res.status(500).json({ error: "Failed to fetch TB imports" });
    }
  });

  // Get single TB Import Batch
  app.get("/api/tb-imports/:batchId", async (req, res) => {
    try {
      const batch = await storage.getTBImportBatch(req.params.batchId);
      if (!batch) {
        return res.status(404).json({ error: "Import batch not found" });
      }
      res.json(batch);
    } catch (error) {
      console.error("Error fetching TB import:", error);
      res.status(500).json({ error: "Failed to fetch TB import" });
    }
  });

  // Create TB Import Batch (from parsed data)
  app.post("/api/tb-imports", async (req, res) => {
    try {
      const { periodId, entityId, fileName, entries, importedBy } = req.body;
      
      if (!periodId || !entityId || !entries || !Array.isArray(entries)) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const processedEntries = entries.map((entry: any, index: number) => ({
        id: `TBE-${Date.now()}-${index}`,
        accountCode: entry.accountCode || "",
        accountName: entry.accountName || "",
        openingBalance: parseFloat(entry.openingBalance) || 0,
        closingBalance: parseFloat(entry.closingBalance) || 0,
        debitAmount: parseFloat(entry.debitAmount) || 0,
        creditAmount: parseFloat(entry.creditAmount) || 0,
        fsCategory: entry.fsCategory || null,
        normalBalance: entry.normalBalance || "DEBIT",
        importedAt: new Date().toISOString(),
        periodId,
      }));

      const batch = await storage.createTBImportBatch({
        periodId,
        entityId,
        fileName: fileName || "manual-entry",
        importedBy: importedBy || "Current User",
        recordCount: processedEntries.length,
        entries: processedEntries,
      });

      res.status(201).json(batch);
    } catch (error) {
      console.error("Error creating TB import:", error);
      res.status(500).json({ error: "Failed to create TB import" });
    }
  });

  // Delete TB Import Batch
  app.delete("/api/tb-imports/:batchId", async (req, res) => {
    try {
      const deleted = await storage.deleteTBImportBatch(req.params.batchId);
      if (!deleted) {
        return res.status(404).json({ error: "Import batch not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting TB import:", error);
      res.status(500).json({ error: "Failed to delete TB import" });
    }
  });

  // ===== WORKING PAPERS ROUTES =====
  
  // Get all Working Papers
  app.get("/api/working-papers", async (req, res) => {
    try {
      const { entityId, periodId } = req.query;
      const papers = await storage.getWorkingPapers(
        entityId as string | undefined,
        periodId as string | undefined
      );
      res.json(papers);
    } catch (error) {
      console.error("Error fetching working papers:", error);
      res.status(500).json({ error: "Failed to fetch working papers" });
    }
  });

  // Get single Working Paper
  app.get("/api/working-papers/:id", async (req, res) => {
    try {
      const paper = await storage.getWorkingPaper(req.params.id);
      if (!paper) {
        return res.status(404).json({ error: "Working paper not found" });
      }
      res.json(paper);
    } catch (error) {
      console.error("Error fetching working paper:", error);
      res.status(500).json({ error: "Failed to fetch working paper" });
    }
  });

  // Create Working Paper - with Zod validation
  app.post("/api/working-papers", async (req, res) => {
    try {
      const parseResult = insertWorkingPaperSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: parseResult.error.flatten() 
        });
      }
      const paper = await storage.createWorkingPaper(parseResult.data as any);
      res.status(201).json(paper);
    } catch (error) {
      console.error("Error creating working paper:", error);
      res.status(500).json({ error: "Failed to create working paper" });
    }
  });

  // Update Working Paper - with partial validation
  app.patch("/api/working-papers/:id", async (req, res) => {
    try {
      const parseResult = insertWorkingPaperSchema.partial().safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: parseResult.error.flatten() 
        });
      }
      const paper = await storage.updateWorkingPaper(req.params.id, parseResult.data as any);
      res.json(paper);
    } catch (error) {
      console.error("Error updating working paper:", error);
      res.status(500).json({ error: "Failed to update working paper" });
    }
  });

  // Delete Working Paper
  app.delete("/api/working-papers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteWorkingPaper(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Working paper not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting working paper:", error);
      res.status(500).json({ error: "Failed to delete working paper" });
    }
  });

  // Auto-populate Working Papers from TB data using GL Master Mapping - with Zod validation
  app.post("/api/working-papers/auto-populate", async (req, res) => {
    try {
      const parseResult = autoPopulateWorkingPapersSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: parseResult.error.flatten() 
        });
      }
      
      const { entityId, periodId } = parseResult.data;
      const result = await storage.autoPopulateWorkingPapers(entityId, periodId);
      res.json({
        success: true,
        message: `Created/updated ${result.wpCount} working papers with ${result.rowsPopulated} rows`,
        ...result,
      });
    } catch (error) {
      console.error("Error auto-populating working papers:", error);
      res.status(500).json({ error: "Failed to auto-populate working papers" });
    }
  });

  // Get user role for current entity
  app.get("/api/user/role", async (req, res) => {
    try {
      const user = req.user as any;
      if (!user) {
        return res.json({ role: "PREPARER", isAuthenticated: false });
      }

      const { users, userEntityRoles } = await import("@shared/models/auth");
      const { db } = await import("./db");
      const { eq, and } = await import("drizzle-orm");
      
      const entityId = parseInt(req.headers["x-entity-id"] as string);
      
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
          return res.json({ 
            role: roleAssignment[0].role, 
            entityId,
            isAuthenticated: true 
          });
        }
      }

      // Return default role
      const userRecord = await db
        .select({ defaultRole: users.defaultRole })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      res.json({ 
        role: userRecord[0]?.defaultRole || "PREPARER",
        isAuthenticated: true 
      });
    } catch (error) {
      console.error("Error fetching user role:", error);
      res.status(500).json({ error: "Failed to fetch user role" });
    }
  });

  // =============================================
  // Financial Artifacts (Document Registry)
  // =============================================

  // Get artifacts with filters
  app.get("/api/artifacts", async (req, res) => {
    try {
      const { entityId, period, purpose, status, isRequired, isAuditRelevant, linkedScheduleId, linkedAccountCode, virtualFolderPath } = req.query;
      
      const artifacts = await storage.getArtifacts({
        entityId: entityId as string | undefined,
        period: period as string | undefined,
        purpose: purpose as ArtifactPurpose | undefined,
        status: status as ArtifactStatus | undefined,
        isRequired: isRequired === "true" ? true : isRequired === "false" ? false : undefined,
        isAuditRelevant: isAuditRelevant === "true" ? true : isAuditRelevant === "false" ? false : undefined,
        linkedScheduleId: linkedScheduleId as string | undefined,
        linkedAccountCode: linkedAccountCode as string | undefined,
        virtualFolderPath: virtualFolderPath as string | undefined,
      });
      res.json(artifacts);
    } catch (error) {
      console.error("Error fetching artifacts:", error);
      res.status(500).json({ error: "Failed to fetch artifacts" });
    }
  });

  // Get single artifact
  app.get("/api/artifacts/:id", async (req, res) => {
    try {
      const artifact = await storage.getArtifact(req.params.id);
      if (!artifact) {
        return res.status(404).json({ error: "Artifact not found" });
      }
      res.json(artifact);
    } catch (error) {
      console.error("Error fetching artifact:", error);
      res.status(500).json({ error: "Failed to fetch artifact" });
    }
  });

  // Create artifact
  app.post("/api/artifacts", async (req, res) => {
    try {
      const validation = insertArtifactSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }
      const artifact = await storage.createArtifact(validation.data);
      res.status(201).json(artifact);
    } catch (error) {
      console.error("Error creating artifact:", error);
      res.status(500).json({ error: "Failed to create artifact" });
    }
  });

  // Update artifact
  app.patch("/api/artifacts/:id", async (req, res) => {
    try {
      const validation = updateArtifactSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }
      const artifact = await storage.updateArtifact(req.params.id, validation.data);
      res.json(artifact);
    } catch (error) {
      console.error("Error updating artifact:", error);
      res.status(500).json({ error: "Failed to update artifact" });
    }
  });

  // Delete artifact
  app.delete("/api/artifacts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteArtifact(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Artifact not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting artifact:", error);
      res.status(500).json({ error: "Failed to delete artifact" });
    }
  });

  // Get artifact health metrics (Management Dashboard)
  app.get("/api/artifacts/health", async (req, res) => {
    try {
      const { entityId, period } = req.query;
      const metrics = await storage.getArtifactHealthMetrics(
        entityId as string | undefined,
        period as string | undefined
      );
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching artifact health metrics:", error);
      res.status(500).json({ error: "Failed to fetch health metrics" });
    }
  });

  // Get period coverage summary
  app.get("/api/artifacts/coverage/periods/:entityId", async (req, res) => {
    try {
      const summary = await storage.getPeriodCoverageSummary(req.params.entityId);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching period coverage:", error);
      res.status(500).json({ error: "Failed to fetch period coverage" });
    }
  });

  // Get entity coverage summary
  app.get("/api/artifacts/coverage/entities", async (req, res) => {
    try {
      const summary = await storage.getEntityCoverageSummary();
      res.json(summary);
    } catch (error) {
      console.error("Error fetching entity coverage:", error);
      res.status(500).json({ error: "Failed to fetch entity coverage" });
    }
  });

  // Get virtual folder paths for navigation
  app.get("/api/artifacts/folders", async (req, res) => {
    try {
      const { entityId, period } = req.query;
      const paths = await storage.getVirtualFolderPaths(
        entityId as string | undefined,
        period as string | undefined
      );
      res.json(paths);
    } catch (error) {
      console.error("Error fetching folder paths:", error);
      res.status(500).json({ error: "Failed to fetch folder paths" });
    }
  });

  return httpServer;
}
