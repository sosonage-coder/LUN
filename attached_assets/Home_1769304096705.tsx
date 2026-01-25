import { useState, useMemo } from 'react';
import { generateAllData } from '@/lib/sampleData';
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import StatusBadge from '@/components/StatusBadge';
import RiskHeatmap from '@/components/RiskHeatmap';
import TimelineView from '@/components/TimelineView';
import EntityGrid from '@/components/EntityGrid';
import AIInsightsPanel from '@/components/AIInsightsPanel';
import AuditReadinessCenter from '@/components/AuditReadinessCenter';
import ROIMetrics from '@/components/ROIMetrics';
import { TrendingUp, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const data = useMemo(() => generateAllData(), []);

  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: '📊' },
    { id: 'entities', label: 'Entity Details', icon: '🏢' },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'audit', label: 'Audit Readiness', icon: '✓' },
    { id: 'insights', label: 'AI Insights', icon: '🤖' },
    { id: 'roi', label: 'ROI Metrics', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="container py-8">
        {/* Tab Navigation */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* EXECUTIVE OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <MetricCard
                label="Compliance Health"
                value={`${data.metrics.complianceHealthScore}%`}
                change={12}
                changeLabel="vs last month"
                status="success"
                icon={<CheckCircle2 />}
                subtext="Overall compliance score"
              />
              <MetricCard
                label="At-Risk Items"
                value={data.metrics.atRiskObligations}
                change={-8}
                changeLabel="reduction"
                status="warning"
                icon={<AlertTriangle />}
                subtext="Requiring attention"
              />
              <MetricCard
                label="Overdue"
                value={data.metrics.overdueItems}
                status="danger"
                subtext="Critical items"
              />
              <MetricCard
                label="Audit Ready"
                value={`${data.metrics.auditReadinessPercentage}%`}
                change={25}
                changeLabel="improvement"
                status="success"
                subtext="Evidence completeness"
              />
              <MetricCard
                label="Annual Savings"
                value={`$${(data.metrics.estimatedAnnualSavings / 1000).toFixed(0)}K`}
                status="success"
                icon={<DollarSign />}
                subtext="Cost avoidance"
              />
            </div>

            {/* Compliance Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card-premium p-6">
                <p className="text-sm text-muted-foreground mb-2">Compliant Entities</p>
                <p className="text-3xl font-bold text-green-600">{data.metrics.compliantEntities}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round((data.metrics.compliantEntities / data.metrics.totalEntities) * 100)}% of total
                </p>
              </div>
              <div className="card-premium p-6">
                <p className="text-sm text-muted-foreground mb-2">At-Risk Entities</p>
                <p className="text-3xl font-bold text-amber-600">{data.metrics.atRiskEntities}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round((data.metrics.atRiskEntities / data.metrics.totalEntities) * 100)}% of total
                </p>
              </div>
              <div className="card-premium p-6">
                <p className="text-sm text-muted-foreground mb-2">Overdue Entities</p>
                <p className="text-3xl font-bold text-red-600">{data.metrics.overdueEntities}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round((data.metrics.overdueEntities / data.metrics.totalEntities) * 100)}% of total
                </p>
              </div>
            </div>

            {/* Risk Heatmap */}
            <RiskHeatmap data={data.heatmapData} />

            {/* Timeline */}
            <TimelineView items={data.timeline} />

            {/* AI Insights */}
            <AIInsightsPanel insights={data.aiInsights} />
          </div>
        )}

        {/* ENTITY DETAILS TAB */}
        {activeTab === 'entities' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Entity Compliance Status</h2>
              <p className="text-muted-foreground">
                Detailed view of all {data.entities.length} entities across {new Set(data.entities.map(e => e.country)).size} countries
              </p>
            </div>
            <EntityGrid entities={data.entities} />
          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">90-Day Compliance Timeline</h2>
              <p className="text-muted-foreground">
                Forward-looking view of all upcoming obligations and critical deadlines
              </p>
            </div>
            <TimelineView items={data.timeline} />
          </div>
        )}

        {/* AUDIT READINESS TAB */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Audit Readiness Center</h2>
              <p className="text-muted-foreground">
                Evidence completeness and audit preparation status across all entities
              </p>
            </div>
            <AuditReadinessCenter data={data.auditReadiness} />
          </div>
        )}

        {/* AI INSIGHTS TAB */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">AI-Powered Insights</h2>
              <p className="text-muted-foreground">
                Intelligent recommendations, risk patterns, and predictive alerts
              </p>
            </div>
            <AIInsightsPanel insights={data.aiInsights} />
          </div>
        )}

        {/* ROI METRICS TAB */}
        {activeTab === 'roi' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Business Impact & ROI</h2>
              <p className="text-muted-foreground">
                Quantified value delivered by the Entity Compliance Calendar platform
              </p>
            </div>
            <ROIMetrics
              timeSavings={168}
              costAvoidance={data.metrics.estimatedAnnualSavings}
              auditEfficiency={65}
              teamProductivity={45}
            />
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>Entity Compliance Calendar • Part of the Netflix of Finance Tools Platform</p>
          <p className="mt-2">© 2026 Governance & Compliance Suite. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
