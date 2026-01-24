import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScheduleMasterSchema, insertScheduleEventSchema, insertPrepaidScheduleSchema, insertFixedAssetSchema, insertAccrualScheduleSchema, insertRevenueScheduleSchema, insertInvestmentIncomeScheduleSchema, insertDebtScheduleSchema, type PrepaidSubcategory, type AssetClass, type AccrualCategory, type RevenueCategory, type InvestmentCategory, type DebtCategory } from "@shared/schema";
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
  app.get("/api/close-control/schedules", async (req, res) => {
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
      const tasks = [
        { id: "TSK-001", tasklistId: "TL-001", closeScheduleId: "CS-2026-01", name: "Bank Reconciliation", description: "Complete bank reconciliations for all accounts", status: "APPROVED" as const, priority: "HIGH" as const, preparerId: "U002", preparerName: "John Preparer", reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-29", completedAt: "2026-01-28T15:30:00Z", approvedAt: "2026-01-29T10:00:00Z", approvedBy: "Jane Controller", evidenceStatus: "ATTACHED" as const, evidenceCount: 3, linkedSchedules: [{ type: "CASH" as const, scheduleId: "CM-2026-01", scheduleName: "Cash Schedule Jan 2026", period: "2026-01" }], dependencies: [], order: 1, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
        { id: "TSK-002", tasklistId: "TL-001", closeScheduleId: "CS-2026-01", name: "Intercompany Cash", description: "Review intercompany cash movements", status: "APPROVED" as const, priority: "MEDIUM" as const, preparerId: "U002", preparerName: "John Preparer", reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-29", completedAt: "2026-01-28T16:00:00Z", approvedAt: "2026-01-29T10:15:00Z", approvedBy: "Jane Controller", evidenceStatus: "ATTACHED" as const, evidenceCount: 2, linkedSchedules: [], dependencies: ["TSK-001"], order: 2, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
        { id: "TSK-003", tasklistId: "TL-001", closeScheduleId: "CS-2026-01", name: "FX Translation", description: "Calculate FX translation impact", status: "SUBMITTED" as const, priority: "HIGH" as const, preparerId: "U003", preparerName: "Sarah Analyst", reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-30", completedAt: null, approvedAt: null, approvedBy: null, evidenceStatus: "PENDING" as const, evidenceCount: 1, linkedSchedules: [], dependencies: ["TSK-001"], order: 3, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
        { id: "TSK-004", tasklistId: "TL-001", closeScheduleId: "CS-2026-01", name: "Cash Variance Analysis", description: "Analyze cash variances vs budget", status: "IN_PROGRESS" as const, priority: "MEDIUM" as const, preparerId: "U002", preparerName: "John Preparer", reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-30", completedAt: null, approvedAt: null, approvedBy: null, evidenceStatus: "MISSING" as const, evidenceCount: 0, linkedSchedules: [{ type: "CASH" as const, scheduleId: "CM-2026-01", scheduleName: "Cash Schedule Jan 2026", period: "2026-01" }], dependencies: ["TSK-001", "TSK-003"], order: 4, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
        { id: "TSK-005", tasklistId: "TL-001", closeScheduleId: "CS-2026-01", name: "Final Cash Sign-off", description: "Final controller review and sign-off", status: "NOT_STARTED" as const, priority: "CRITICAL" as const, preparerId: null, preparerName: null, reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-30", completedAt: null, approvedAt: null, approvedBy: null, evidenceStatus: "MISSING" as const, evidenceCount: 0, linkedSchedules: [], dependencies: ["TSK-004"], order: 5, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
      ];
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Close Control Templates
  app.get("/api/close-control/templates", async (req, res) => {
    try {
      const templates = [
        {
          id: "TPL-MONTH-END-LEAN",
          name: "Lean Month-End Close",
          description: "Streamlined month-end close process with essential tasks only. Best for smaller organizations or interim periods.",
          periodType: "MONTHLY" as const,
          templateType: "SCHEDULE" as const,
          isSystemTemplate: true,
          version: 2,
          taskCount: 24,
          estimatedDays: 5,
          createdAt: "2024-01-15T00:00:00Z",
          createdBy: "System",
        },
        {
          id: "TPL-MONTH-END-FULL",
          name: "Full Month-End Close",
          description: "Comprehensive month-end close with all reconciliations, variance analysis, and management reporting. Suitable for larger organizations.",
          periodType: "MONTHLY" as const,
          templateType: "SCHEDULE" as const,
          isSystemTemplate: true,
          version: 3,
          taskCount: 48,
          estimatedDays: 8,
          createdAt: "2024-01-15T00:00:00Z",
          createdBy: "System",
        },
        {
          id: "TPL-QUARTER-END",
          name: "Quarter-End Close",
          description: "Quarterly close template including additional quarterly adjustments, external reporting preparation, and board reporting packages.",
          periodType: "QUARTERLY" as const,
          templateType: "SCHEDULE" as const,
          isSystemTemplate: true,
          version: 2,
          taskCount: 62,
          estimatedDays: 12,
          createdAt: "2024-01-15T00:00:00Z",
          createdBy: "System",
        },
        {
          id: "TPL-YEAR-END",
          name: "Year-End Close",
          description: "Annual close template with year-end adjustments, audit preparation, annual report compilation, and regulatory filings.",
          periodType: "ANNUAL" as const,
          templateType: "SCHEDULE" as const,
          isSystemTemplate: true,
          version: 1,
          taskCount: 96,
          estimatedDays: 20,
          createdAt: "2024-01-15T00:00:00Z",
          createdBy: "System",
        },
        {
          id: "TPL-CASH-CLOSE",
          name: "Cash Close Tasklist",
          description: "Standard cash close activities: bank reconciliations, intercompany cash, FX translation, and cash variance analysis.",
          periodType: "MONTHLY" as const,
          templateType: "TASKLIST" as const,
          isSystemTemplate: true,
          version: 4,
          taskCount: 5,
          estimatedDays: 2,
          createdAt: "2024-01-15T00:00:00Z",
          createdBy: "System",
        },
        {
          id: "TPL-REVENUE-CLOSE",
          name: "Revenue Close Tasklist",
          description: "Revenue recognition procedures: contract review, deferred revenue adjustments, ASC 606 compliance checks.",
          periodType: "MONTHLY" as const,
          templateType: "TASKLIST" as const,
          isSystemTemplate: true,
          version: 3,
          taskCount: 6,
          estimatedDays: 3,
          createdAt: "2024-01-15T00:00:00Z",
          createdBy: "System",
        },
        {
          id: "TPL-ACCRUALS-CLOSE",
          name: "Accruals Close Tasklist",
          description: "Accrual review and adjustments: expense accruals, payroll accruals, bonus provisions, and aging analysis.",
          periodType: "MONTHLY" as const,
          templateType: "TASKLIST" as const,
          isSystemTemplate: true,
          version: 2,
          taskCount: 4,
          estimatedDays: 2,
          createdAt: "2024-01-15T00:00:00Z",
          createdBy: "System",
        },
        {
          id: "TPL-FIXED-ASSETS-CLOSE",
          name: "Fixed Assets Close Tasklist",
          description: "Fixed asset procedures: depreciation run, asset additions/disposals, impairment review, and subledger reconciliation.",
          periodType: "MONTHLY" as const,
          templateType: "TASKLIST" as const,
          isSystemTemplate: true,
          version: 2,
          taskCount: 3,
          estimatedDays: 1,
          createdAt: "2024-01-15T00:00:00Z",
          createdBy: "System",
        },
        {
          id: "TPL-PREPAIDS-CLOSE",
          name: "Prepaids Close Tasklist",
          description: "Prepaid expense amortization: schedule review, new prepaid setup, balance reconciliation, and aged items cleanup.",
          periodType: "MONTHLY" as const,
          templateType: "TASKLIST" as const,
          isSystemTemplate: true,
          version: 2,
          taskCount: 4,
          estimatedDays: 1,
          createdAt: "2024-01-15T00:00:00Z",
          createdBy: "System",
        },
        {
          id: "TPL-VARIANCE-ANALYSIS",
          name: "Variance Analysis Tasklist",
          description: "Monthly variance analysis: budget vs actual, flux analysis, management commentary, and KPI reporting.",
          periodType: "MONTHLY" as const,
          templateType: "TASKLIST" as const,
          isSystemTemplate: true,
          version: 3,
          taskCount: 4,
          estimatedDays: 2,
          createdAt: "2024-01-15T00:00:00Z",
          createdBy: "System",
        },
        {
          id: "TPL-INTERCOMPANY",
          name: "Intercompany Tasklist",
          description: "Intercompany reconciliation and elimination: IC balance matching, elimination entries, and transfer pricing documentation.",
          periodType: "MONTHLY" as const,
          templateType: "TASKLIST" as const,
          isSystemTemplate: true,
          version: 1,
          taskCount: 5,
          estimatedDays: 2,
          createdAt: "2024-01-15T00:00:00Z",
          createdBy: "System",
        },
        {
          id: "TPL-TAX-PROVISION",
          name: "Tax Provision Tasklist",
          description: "Quarterly tax provision calculation: current/deferred tax, effective tax rate analysis, and tax account reconciliation.",
          periodType: "QUARTERLY" as const,
          templateType: "TASKLIST" as const,
          isSystemTemplate: true,
          version: 2,
          taskCount: 6,
          estimatedDays: 3,
          createdAt: "2024-01-15T00:00:00Z",
          createdBy: "System",
        },
      ];
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  // Single Template
  app.get("/api/close-control/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const templates: Record<string, any> = {
        "TPL-MONTH-END-LEAN": {
          id: "TPL-MONTH-END-LEAN",
          name: "Lean Month-End Close",
          description: "Streamlined month-end close process with essential tasks only. Best for smaller organizations or interim periods.",
          periodType: "MONTHLY",
          templateType: "SCHEDULE",
          isSystemTemplate: true,
          version: 2,
          taskCount: 24,
          estimatedDays: 5,
          createdAt: "2024-01-15T00:00:00Z",
          createdBy: "System",
        },
        "TPL-CASH-CLOSE": {
          id: "TPL-CASH-CLOSE",
          name: "Cash Close Tasklist",
          description: "Standard cash close activities: bank reconciliations, intercompany cash, FX translation, and cash variance analysis.",
          periodType: "MONTHLY",
          templateType: "TASKLIST",
          isSystemTemplate: true,
          version: 4,
          taskCount: 5,
          estimatedDays: 2,
          createdAt: "2024-01-15T00:00:00Z",
          createdBy: "System",
        },
      };
      const template = templates[id];
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  return httpServer;
}
