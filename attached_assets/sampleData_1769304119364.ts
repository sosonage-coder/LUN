// Sample data generator for Entity Compliance Calendar dashboard
// This creates realistic demo data for the dashboard

export interface Entity {
  id: string;
  name: string;
  jurisdiction: string;
  country: string;
  entityType: string;
  complianceScore: number;
  upcomingObligations: number;
  atRiskItems: number;
  lastFilingDate: string;
  riskRating: 'high' | 'medium' | 'low';
  primaryOwner: string;
  status: 'compliant' | 'at-risk' | 'overdue';
}

export interface Obligation {
  id: string;
  entityId: string;
  title: string;
  dueDate: string;
  type: string;
  riskLevel: 'high' | 'medium' | 'low';
  status: 'completed' | 'in-progress' | 'upcoming' | 'overdue';
  owner: string;
  evidence: number; // count of evidence documents
  dependencies: string[];
}

export interface MetricData {
  complianceHealthScore: number;
  atRiskObligations: number;
  overdueItems: number;
  estimatedAnnualSavings: number;
  auditReadinessPercentage: number;
  totalEntities: number;
  compliantEntities: number;
  atRiskEntities: number;
  overdueEntities: number;
}

export interface RiskHeatmapData {
  jurisdiction: string;
  country: string;
  riskScore: number; // 0-100
  entityCount: number;
  complianceScore: number;
}

export interface TimelineItem {
  id: string;
  title: string;
  dueDate: string;
  entity: string;
  riskLevel: 'high' | 'medium' | 'low';
  type: string;
  status: 'completed' | 'upcoming' | 'overdue';
}

export interface OwnershipData {
  owner: string;
  role: string;
  obligationCount: number;
  completedCount: number;
  atRiskCount: number;
  teamSize: number;
}

export interface AuditReadinessData {
  entityName: string;
  completionPercentage: number;
  documentsCount: number;
  lastUpdated: string;
  status: 'ready' | 'in-progress' | 'incomplete';
}

export interface AIInsight {
  id: string;
  type: 'risk-pattern' | 'missing-obligation' | 'delay-prediction' | 'summary';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  affectedEntities: string[];
  recommendation: string;
}

// Generate sample entities
export function generateSampleEntities(): Entity[] {
  const jurisdictions = [
    { name: 'Delaware', country: 'USA' },
    { name: 'New York', country: 'USA' },
    { name: 'California', country: 'USA' },
    { name: 'London', country: 'UK' },
    { name: 'Frankfurt', country: 'Germany' },
    { name: 'Paris', country: 'France' },
    { name: 'Amsterdam', country: 'Netherlands' },
    { name: 'Singapore', country: 'Singapore' },
    { name: 'Hong Kong', country: 'Hong Kong' },
    { name: 'Toronto', country: 'Canada' },
  ];

  const entities: Entity[] = [];
  const owners = ['John Smith', 'Sarah Johnson', 'Michael Chen', 'Emma Davis', 'Robert Wilson'];
  const entityTypes = ['Subsidiary', 'Branch', 'Joint Venture', 'Operating Company', 'Holding Company'];

  for (let i = 0; i < 28; i++) {
    const jurisdiction = jurisdictions[i % jurisdictions.length];
    const riskRating = Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low';
    const complianceScore = riskRating === 'high' ? Math.floor(Math.random() * 40) + 50 : 
                           riskRating === 'medium' ? Math.floor(Math.random() * 30) + 70 : 
                           Math.floor(Math.random() * 15) + 85;

    entities.push({
      id: `entity-${i + 1}`,
      name: `${jurisdiction.name} ${entityTypes[i % entityTypes.length]} ${i + 1}`,
      jurisdiction: jurisdiction.name,
      country: jurisdiction.country,
      entityType: entityTypes[i % entityTypes.length],
      complianceScore,
      upcomingObligations: Math.floor(Math.random() * 12) + 3,
      atRiskItems: Math.floor(Math.random() * 5),
      lastFilingDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      riskRating,
      primaryOwner: owners[i % owners.length],
      status: riskRating === 'high' ? 'overdue' : riskRating === 'medium' ? 'at-risk' : 'compliant',
    });
  }

  return entities;
}

// Generate sample obligations
export function generateSampleObligations(entities: Entity[]): Obligation[] {
  const obligationTypes = [
    'Annual Tax Filing',
    'Financial Statement Audit',
    'Transfer Pricing Documentation',
    'Board Resolution',
    'Regulatory Submission',
    'Intercompany Agreement Review',
    'Compliance Certification',
    'Annual Report',
    'Statutory Filing',
    'Audit Sign-off',
  ];

  const obligations: Obligation[] = [];
  let id = 1;

  for (const entity of entities) {
    const obligationCount = Math.floor(Math.random() * 8) + 4;
    for (let i = 0; i < obligationCount; i++) {
      const daysUntilDue = Math.floor(Math.random() * 180) - 30;
      const dueDate = new Date(Date.now() + daysUntilDue * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      let status: 'completed' | 'in-progress' | 'upcoming' | 'overdue';
      if (daysUntilDue < -7) status = 'overdue';
      else if (daysUntilDue < 0) status = 'in-progress';
      else if (daysUntilDue < 30) status = 'upcoming';
      else status = 'completed';

      const riskLevel = status === 'overdue' ? 'high' : status === 'in-progress' ? 'medium' : 'low';

      obligations.push({
        id: `obligation-${id}`,
        entityId: entity.id,
        title: obligationTypes[Math.floor(Math.random() * obligationTypes.length)],
        dueDate,
        type: obligationTypes[Math.floor(Math.random() * obligationTypes.length)],
        riskLevel,
        status,
        owner: entity.primaryOwner,
        evidence: Math.floor(Math.random() * 8) + 1,
        dependencies: Math.random() > 0.7 ? [`obligation-${Math.max(1, id - Math.floor(Math.random() * 5))}`] : [],
      });
      id++;
    }
  }

  return obligations;
}

// Generate metrics
export function generateMetrics(entities: Entity[]): MetricData {
  const compliantCount = entities.filter(e => e.status === 'compliant').length;
  const atRiskCount = entities.filter(e => e.status === 'at-risk').length;
  const overdueCount = entities.filter(e => e.status === 'overdue').length;
  const avgScore = Math.round(entities.reduce((sum, e) => sum + e.complianceScore, 0) / entities.length);

  return {
    complianceHealthScore: avgScore,
    atRiskObligations: entities.reduce((sum, e) => sum + e.atRiskItems, 0),
    overdueItems: overdueCount * 2,
    estimatedAnnualSavings: 250000 + Math.floor(Math.random() * 150000),
    auditReadinessPercentage: 88 + Math.floor(Math.random() * 10),
    totalEntities: entities.length,
    compliantEntities: compliantCount,
    atRiskEntities: atRiskCount,
    overdueEntities: overdueCount,
  };
}

// Generate risk heatmap data
export function generateRiskHeatmapData(entities: Entity[]): RiskHeatmapData[] {
  const jurisdictionMap = new Map<string, { country: string; entities: Entity[] }>();

  for (const entity of entities) {
    if (!jurisdictionMap.has(entity.jurisdiction)) {
      jurisdictionMap.set(entity.jurisdiction, { country: entity.country, entities: [] });
    }
    jurisdictionMap.get(entity.jurisdiction)!.entities.push(entity);
  }

  const heatmapData: RiskHeatmapData[] = [];
  jurisdictionMap.forEach((data, jurisdiction) => {
    const avgCompliance = Math.round(
      data.entities.reduce((sum, e) => sum + e.complianceScore, 0) / data.entities.length
    );
    const riskScore = 100 - avgCompliance;

    heatmapData.push({
      jurisdiction,
      country: data.country,
      riskScore,
      entityCount: data.entities.length,
      complianceScore: avgCompliance,
    });
  });

  return heatmapData;
}

// Generate timeline items
export function generateTimelineItems(obligations: Obligation[], entities: Entity[]): TimelineItem[] {
  const entityMap = new Map(entities.map(e => [e.id, e]));
  
  return obligations
    .filter(o => ['upcoming', 'overdue', 'in-progress'].includes(o.status))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 20)
    .map((o, idx) => ({
      id: o.id,
      title: o.title,
      dueDate: o.dueDate,
      entity: entityMap.get(o.entityId)?.name || 'Unknown',
      riskLevel: o.riskLevel,
      type: o.type,
      status: o.status as any,
    }));
}

// Generate ownership data
export function generateOwnershipData(obligations: Obligation[]): OwnershipData[] {
  const ownerMap = new Map<string, { role: string; obligations: Obligation[] }>();

  for (const obligation of obligations) {
    if (!ownerMap.has(obligation.owner)) {
      const roles = ['Finance Manager', 'Tax Manager', 'Compliance Officer', 'Controller', 'CFO'];
      ownerMap.set(obligation.owner, { 
        role: roles[Math.floor(Math.random() * roles.length)],
        obligations: [] 
      });
    }
    ownerMap.get(obligation.owner)!.obligations.push(obligation);
  }

  const ownershipData: OwnershipData[] = [];
  ownerMap.forEach((data, owner) => {
    const completed = data.obligations.filter(o => o.status === 'completed').length;
    const atRisk = data.obligations.filter(o => o.riskLevel === 'high').length;

    ownershipData.push({
      owner,
      role: data.role,
      obligationCount: data.obligations.length,
      completedCount: completed,
      atRiskCount: atRisk,
      teamSize: Math.floor(Math.random() * 4) + 1,
    });
  });

  return ownershipData.sort((a, b) => b.obligationCount - a.obligationCount);
}

// Generate audit readiness data
export function generateAuditReadinessData(entities: Entity[]): AuditReadinessData[] {
  return entities.map(entity => {
    const completionPercentage = entity.complianceScore + Math.floor(Math.random() * 15) - 7;
    const status = completionPercentage >= 90 ? 'ready' : completionPercentage >= 70 ? 'in-progress' : 'incomplete';

    return {
      entityName: entity.name,
      completionPercentage: Math.min(100, Math.max(0, completionPercentage)),
      documentsCount: Math.floor(Math.random() * 40) + 10,
      lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status,
    };
  });
}

// Generate AI insights
export function generateAIInsights(entities: Entity[], obligations: Obligation[]): AIInsight[] {
  const highRiskEntities = entities.filter(e => e.riskRating === 'high').map(e => e.name);
  const overdueObligations = obligations.filter(o => o.status === 'overdue');

  const insights: AIInsight[] = [];

  if (highRiskEntities.length > 0) {
    insights.push({
      id: 'insight-1',
      type: 'risk-pattern',
      title: 'Recurring Late Filings Detected',
      description: `${highRiskEntities.slice(0, 2).join(', ')} have missed deadlines in the past 2 quarters. Pattern suggests resource constraints or process gaps.`,
      severity: 'high',
      affectedEntities: highRiskEntities,
      recommendation: 'Review resource allocation and consider implementing automated reminders 60 days before deadline.',
    });
  }

  if (overdueObligations.length > 0) {
    insights.push({
      id: 'insight-2',
      type: 'delay-prediction',
      title: 'Dependency Chain Delay Risk',
      description: `${overdueObligations.length} obligations are blocked by incomplete dependencies. This may cascade to Q2 filings.`,
      severity: 'high',
      affectedEntities: overdueObligations.map(o => o.entityId),
      recommendation: 'Prioritize completion of blocking obligations. Consider parallel processing where possible.',
    });
  }

  insights.push({
    id: 'insight-3',
    type: 'missing-obligation',
    title: 'Potential Missing Obligations',
    description: 'Based on entity jurisdiction analysis, 3 entities may be missing transfer pricing documentation requirements.',
    severity: 'medium',
    affectedEntities: entities.slice(0, 3).map(e => e.name),
    recommendation: 'Review transfer pricing policies for entities in high-tax jurisdictions. Consult with tax team.',
  });

  insights.push({
    id: 'insight-4',
    type: 'summary',
    title: 'Executive Summary - Compliance Status',
    description: `Overall compliance health is ${entities.reduce((sum, e) => sum + e.complianceScore, 0) / entities.length}%. Key focus areas: ${highRiskEntities.slice(0, 2).join(', ')}.`,
    severity: 'medium',
    affectedEntities: [],
    recommendation: 'Schedule governance review meeting to discuss resource allocation and process improvements.',
  });

  return insights;
}

// Master data generator
export function generateAllData() {
  const entities = generateSampleEntities();
  const obligations = generateSampleObligations(entities);
  const metrics = generateMetrics(entities);
  const heatmapData = generateRiskHeatmapData(entities);
  const timeline = generateTimelineItems(obligations, entities);
  const ownership = generateOwnershipData(obligations);
  const auditReadiness = generateAuditReadinessData(entities);
  const aiInsights = generateAIInsights(entities, obligations);

  return {
    entities,
    obligations,
    metrics,
    heatmapData,
    timeline,
    ownership,
    auditReadiness,
    aiInsights,
  };
}
