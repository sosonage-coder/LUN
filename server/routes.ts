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

  return httpServer;
}
