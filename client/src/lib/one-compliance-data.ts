// One Compliance - Entity Governance Platform Sample Data

// ================================
// Type Definitions
// ================================

export type EntityStatus = "ACTIVE" | "DORMANT" | "DISSOLVED" | "PENDING_FORMATION";
export type JurisdictionRisk = "LOW" | "MEDIUM" | "HIGH";
export type ObligationType = "STATUTORY" | "TAX" | "REGULATORY" | "GOVERNANCE" | "PAYROLL";
export type FilingStatus = "FILED" | "PENDING" | "OVERDUE" | "NOT_REQUIRED" | "DRAFT";
export type ApprovalStatus = "APPROVED" | "PENDING_APPROVAL" | "REJECTED" | "NOT_REQUIRED";
export type ResolutionStatus = "DRAFT" | "PENDING" | "APPROVED" | "EXECUTED" | "ARCHIVED";
export type MeetingType = "BOARD" | "SHAREHOLDER" | "COMMITTEE" | "ANNUAL_GENERAL";
export type PolicyStatus = "ACTIVE" | "DRAFT" | "UNDER_REVIEW" | "ARCHIVED";
export type RiskSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type ChangeType = "FORMATION" | "OFFICER_CHANGE" | "ADDRESS_CHANGE" | "NAME_CHANGE" | "MERGER" | "DISSOLUTION" | "REACTIVATION";
export type AdvisorType = "LEGAL_COUNSEL" | "TAX_ADVISOR" | "ACCOUNTANT" | "CORPORATE_SECRETARY" | "REGISTERED_AGENT";
export type ShareClass = "COMMON" | "PREFERRED" | "RESTRICTED" | "OPTIONS";
export type AuthorityType = "BANKING" | "CONTRACT" | "FILING" | "FINANCIAL" | "OPERATIONAL";
export type EquityEventType = "ISSUANCE" | "TRANSFER" | "CANCELLATION" | "CAPITAL_CONTRIBUTION" | "RETURN_OF_CAPITAL" | "CONVERSION" | "STOCK_SPLIT";
export type DividendStatus = "PROPOSED" | "DECLARED" | "APPROVED" | "PAID" | "CANCELLED";
export type DividendType = "CASH" | "STOCK" | "PROPERTY" | "SPECIAL";

// ================================
// Entity & Jurisdiction
// ================================

export interface Jurisdiction {
  code: string;
  name: string;
  country: string;
  region: string;
  riskLevel: JurisdictionRisk;
  filingComplexity: "LOW" | "MEDIUM" | "HIGH";
  hasElectronicFiling: boolean;
}

export interface Entity {
  id: string;
  name: string;
  legalName: string;
  entityType: string;
  jurisdictionCode: string;
  status: EntityStatus;
  incorporationDate: string;
  fiscalYearEnd: string;
  registrationNumber: string;
  taxId: string;
  registeredAddress: string;
  operatingAddress: string;
  parentEntityId: string | null;
  ownershipPercentage: number | null;
  reportingCurrency: string;
  localCurrency: string;
  healthScore: number;
  complianceScore: number;
  lastAuditDate: string | null;
  registeredAgentId: string | null;
}

export interface Officer {
  id: string;
  entityId: string;
  name: string;
  role: string;
  appointmentDate: string;
  resignationDate: string | null;
  email: string;
  isDirector: boolean;
  isShareholder: boolean;
  signatoryLevel: string;
}

export interface Shareholder {
  id: string;
  entityId: string;
  name: string;
  shareholderType: "INDIVIDUAL" | "CORPORATE" | "TRUST";
  shareClass: ShareClass;
  sharesHeld: number;
  ownershipPercentage: number;
  votingRights: number;
  acquisitionDate: string;
}

// ================================
// Equity Tracker - Share Classes
// ================================

export interface ShareClassDefinition {
  id: string;
  entityId: string;
  className: string;
  classCode: ShareClass;
  authorizedShares: number;
  issuedShares: number;
  parValue: number;
  currency: string;
  votingRightsPerShare: number;
  dividendRights: "PARTICIPATING" | "NON_PARTICIPATING" | "PREFERRED";
  dividendRate: number | null;
  liquidationPreference: number | null;
  conversionRatio: number | null;
  isConvertible: boolean;
  restrictions: string[];
  createdDate: string;
  lastModifiedDate: string;
}

// ================================
// Equity Tracker - Equity Events
// ================================

export interface EquityEvent {
  id: string;
  entityId: string;
  eventType: EquityEventType;
  eventDate: string;
  effectiveDate: string;
  shareClassId: string;
  shareClassName: string;
  numberOfShares: number;
  pricePerShare: number | null;
  totalValue: number;
  currency: string;
  fromParty: string | null;
  toParty: string;
  resolutionId: string | null;
  resolutionDate: string | null;
  approvalStatus: ApprovalStatus;
  approvedBy: string | null;
  approvedDate: string | null;
  documents: string[];
  notes: string | null;
}

// ================================
// Equity Tracker - Dividends
// ================================

export interface Dividend {
  id: string;
  entityId: string;
  dividendType: DividendType;
  status: DividendStatus;
  declarationDate: string;
  recordDate: string;
  paymentDate: string;
  amountPerShare: number;
  totalAmount: number;
  currency: string;
  shareClassId: string | null;
  shareClassName: string | null;
  fiscalYear: string;
  fiscalPeriod: string;
  resolutionId: string | null;
  approvedBy: string | null;
  approvedDate: string | null;
  paidDate: string | null;
  paidBy: string | null;
  isIntercompany: boolean;
  recipientEntityId: string | null;
  witholdingTaxRate: number | null;
  witholdingTaxAmount: number | null;
  netAmount: number;
  notes: string | null;
}

// ================================
// Startup Equity - Funding Rounds
// ================================

export type FundingRoundType = "PRE_SEED" | "SEED" | "SERIES_A" | "SERIES_B" | "SERIES_C" | "SERIES_D" | "BRIDGE" | "GROWTH";
export type FundingRoundStatus = "PLANNING" | "OPEN" | "CLOSING" | "CLOSED" | "CANCELLED";
export type ConvertibleType = "SAFE" | "CONVERTIBLE_NOTE";
export type ConvertibleStatus = "ACTIVE" | "CONVERTED" | "REPAID" | "CANCELLED";
export type OptionGrantStatus = "GRANTED" | "VESTING" | "FULLY_VESTED" | "EXERCISED" | "CANCELLED" | "EXPIRED";

export interface FundingRound {
  id: string;
  entityId: string;
  roundType: FundingRoundType;
  roundName: string;
  status: FundingRoundStatus;
  targetAmount: number;
  raisedAmount: number;
  currency: string;
  preMoneyValuation: number;
  postMoneyValuation: number;
  pricePerShare: number;
  shareClass: string;
  openDate: string;
  closeDate: string | null;
  leadInvestor: string | null;
  boardSeatsOffered: number;
  proRataRights: boolean;
  antiDilutionProvision: "NONE" | "BROAD_BASED" | "NARROW_BASED" | "FULL_RATCHET";
  liquidationPreference: number;
  participatingPreferred: boolean;
  notes: string | null;
}

export interface FundingRoundInvestor {
  id: string;
  roundId: string;
  investorName: string;
  investorType: "VC" | "ANGEL" | "CORPORATE" | "FAMILY_OFFICE" | "ACCELERATOR" | "FOUNDER";
  investmentAmount: number;
  sharesIssued: number;
  ownershipPercentage: number;
  boardSeat: boolean;
  proRataRights: boolean;
  investmentDate: string;
  isLead: boolean;
}

export interface ConvertibleInstrument {
  id: string;
  entityId: string;
  instrumentType: ConvertibleType;
  investorName: string;
  principalAmount: number;
  currency: string;
  issueDate: string;
  maturityDate: string | null;
  valuationCap: number | null;
  discountRate: number | null;
  interestRate: number | null;
  status: ConvertibleStatus;
  convertedToRoundId: string | null;
  convertedShares: number | null;
  convertedDate: string | null;
  mfnClause: boolean;
  proRataRights: boolean;
  notes: string | null;
}

export interface OptionPool {
  id: string;
  entityId: string;
  poolName: string;
  authorizedShares: number;
  issuedShares: number;
  reservedShares: number;
  availableShares: number;
  shareClass: string;
  createdDate: string;
  expirationDate: string | null;
  vestingScheduleDefault: string;
  exercisePriceDefault: number | null;
}

export interface OptionGrant {
  id: string;
  entityId: string;
  optionPoolId: string;
  granteeName: string;
  granteeRole: string;
  grantDate: string;
  sharesGranted: number;
  exercisePrice: number;
  vestingStartDate: string;
  vestingSchedule: "4_YEAR_1_CLIFF" | "4_YEAR_NO_CLIFF" | "3_YEAR_1_CLIFF" | "IMMEDIATE" | "CUSTOM";
  cliffMonths: number;
  vestingMonths: number;
  sharesVested: number;
  sharesExercised: number;
  sharesUnvested: number;
  expirationDate: string;
  status: OptionGrantStatus;
  exercisedDate: string | null;
  terminationDate: string | null;
  notes: string | null;
}

// ================================
// Obligations & Filings
// ================================

export interface Obligation {
  id: string;
  entityId: string;
  obligationType: ObligationType;
  name: string;
  description: string;
  authority: string;
  frequency: "ANNUAL" | "QUARTERLY" | "MONTHLY" | "ONE_TIME" | "EVENT_DRIVEN";
  dueDate: string;
  nextDueDate: string;
  filingStatus: FilingStatus;
  approvalStatus: ApprovalStatus;
  requiredForms: string[];
  requiresSignature: boolean;
  requiresApproval: boolean;
  evidenceAttached: boolean;
  assignedTo: string;
  lastFiledDate: string | null;
  lastFiledBy: string | null;
}

export interface Filing {
  id: string;
  obligationId: string;
  entityId: string;
  filingDate: string;
  dueDate: string;
  status: FilingStatus;
  confirmationNumber: string | null;
  filedBy: string;
  approvedBy: string | null;
  approvedAt: string | null;
  documents: string[];
  notes: string | null;
}

// ================================
// Filing Requirements (Regulatory Library)
// ================================

export type FilingIndustry = "Financial Services" | "Healthcare" | "Manufacturing" | "Technology" | "Energy" | "Retail" | "Insurance" | "All";
export type FilingFrequency = "Annual" | "Quarterly" | "Biennial" | "Monthly" | "As Needed" | "Triennial" | "Continuous";
export type PenaltyLevel = "Critical" | "High" | "Medium" | "Low";

export interface FilingRequirement {
  id: string;
  filingName: string;
  jurisdiction: string;
  industry: FilingIndustry;
  regulation: string;
  frequency: FilingFrequency;
  deadline: string;
  leadTimeDays: number | "Immediate" | "Scheduled";
  responsibleDepartment: string;
  penaltyLevel: PenaltyLevel;
  keyContent: string;
}

// ================================
// Authority & Delegation
// ================================

export interface AuthorizedSignatory {
  id: string;
  entityId: string;
  officerId: string;
  officerName: string;
  authorityType: AuthorityType;
  signingLimit: number | null;
  currency: string;
  requiresCoSigner: boolean;
  coSignerRequired: string | null;
  effectiveDate: string;
  expiryDate: string | null;
  isActive: boolean;
  delegatedBy: string | null;
  delegationScope: string | null;
}

// ================================
// Board & Committee Governance
// ================================

export interface Meeting {
  id: string;
  entityId: string;
  meetingType: MeetingType;
  title: string;
  scheduledDate: string;
  location: string;
  quorumRequired: number;
  attendeesCount: number;
  isQuorumMet: boolean;
  minutesApproved: boolean;
  agendaItems: string[];
  actionItems: ActionItem[];
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

export interface ActionItem {
  id: string;
  meetingId: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
  completedAt: string | null;
}

export interface Resolution {
  id: string;
  entityId: string;
  title: string;
  resolutionType: "BOARD" | "SHAREHOLDER" | "WRITTEN_CONSENT";
  status: ResolutionStatus;
  proposedDate: string;
  approvedDate: string | null;
  executedDate: string | null;
  proposedBy: string;
  approvers: string[];
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  documentUrl: string | null;
  relatedMeetingId: string | null;
}

// ================================
// Capital & Equity
// ================================

export interface ShareIssuance {
  id: string;
  entityId: string;
  shareClass: ShareClass;
  sharesIssued: number;
  pricePerShare: number;
  totalValue: number;
  currency: string;
  issuanceDate: string;
  recipientName: string;
  recipientType: "INDIVIDUAL" | "CORPORATE" | "TRUST";
  approvalResolutionId: string | null;
  approvalStatus: ApprovalStatus;
  vestingSchedule: string | null;
}

export interface DividendDeclaration {
  id: string;
  entityId: string;
  declarationDate: string;
  recordDate: string;
  paymentDate: string;
  amountPerShare: number;
  totalAmount: number;
  currency: string;
  shareClass: ShareClass;
  approvalResolutionId: string | null;
  status: "DECLARED" | "APPROVED" | "PAID" | "CANCELLED";
}

// ================================
// Change & Lifecycle
// ================================

export interface EntityChange {
  id: string;
  entityId: string;
  changeType: ChangeType;
  description: string;
  effectiveDate: string;
  requestedBy: string;
  requestedAt: string;
  approvedBy: string | null;
  approvedAt: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  oldValue: string | null;
  newValue: string | null;
  filingRequired: boolean;
  filingCompleted: boolean;
  relatedObligationId: string | null;
  auditTrail: string[];
}

// ================================
// Risk & Issues
// ================================

export interface ComplianceRisk {
  id: string;
  entityId: string | null;
  jurisdictionCode: string | null;
  riskType: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  likelihood: "LIKELY" | "POSSIBLE" | "UNLIKELY";
  impact: "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "MITIGATED" | "ACCEPTED" | "CLOSED";
  mitigationPlan: string | null;
  owner: string;
  dueDate: string | null;
  identifiedDate: string;
  lastReviewDate: string | null;
}

export interface RegulatoryCorrespondence {
  id: string;
  entityId: string;
  authority: string;
  correspondenceType: "NOTICE" | "QUERY" | "WARNING" | "PENALTY" | "INFORMATION_REQUEST";
  subject: string;
  receivedDate: string;
  responseDeadline: string | null;
  responseStatus: "PENDING" | "RESPONDED" | "ESCALATED" | "RESOLVED";
  severity: RiskSeverity;
  assignedTo: string;
  notes: string | null;
}

// ================================
// Policy & Standards
// ================================

export interface Policy {
  id: string;
  name: string;
  category: string;
  description: string;
  status: PolicyStatus;
  version: string;
  effectiveDate: string;
  reviewDate: string;
  owner: string;
  approvedBy: string;
  applicableEntities: string[];
  requiresAcknowledgement: boolean;
  acknowledgementCount: number;
  totalApplicable: number;
}

export interface PolicyMapping {
  id: string;
  policyId: string;
  entityId: string;
  acknowledged: boolean;
  acknowledgedBy: string | null;
  acknowledgedAt: string | null;
  deviation: boolean;
  deviationReason: string | null;
  deviationApprovedBy: string | null;
}

// ================================
// Third-Party & Advisors
// ================================

export interface ThirdPartyAdvisor {
  id: string;
  name: string;
  advisorType: AdvisorType;
  companyName: string;
  jurisdiction: string;
  email: string;
  phone: string;
  engagementStartDate: string;
  engagementEndDate: string | null;
  renewalDate: string | null;
  annualFee: number;
  currency: string;
  status: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "TERMINATED";
  assignedEntities: string[];
  servicesProvided: string[];
}

// ================================
// Evidence & Snapshots
// ================================

export interface PeriodSnapshot {
  id: string;
  period: string;
  snapshotDate: string;
  entityCount: number;
  totalObligations: number;
  filedOnTime: number;
  filedLate: number;
  pending: number;
  overallComplianceScore: number;
  isLocked: boolean;
  lockedBy: string | null;
  lockedAt: string | null;
}

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  entityId: string | null;
  action: string;
  objectType: string;
  objectId: string;
  performedBy: string;
  oldValue: string | null;
  newValue: string | null;
  ipAddress: string;
}

// ================================
// Dashboard & Analytics
// ================================

export interface ComplianceMetrics {
  healthScore: number;
  entitiesAtRisk: number;
  upcomingDeadlines: number;
  overdueObligations: number;
  auditReadiness: number;
  savingsGenerated: number;
}

export interface JurisdictionHeatmapCell {
  jurisdictionCode: string;
  jurisdictionName: string;
  entityCount: number;
  healthScore: number;
  riskLevel: JurisdictionRisk;
  overdueCount: number;
  upcomingCount: number;
}

export interface TimelineItem {
  id: string;
  entityId: string;
  entityName: string;
  obligationType: ObligationType;
  title: string;
  dueDate: string;
  daysUntilDue: number;
  status: FilingStatus;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  assignedTo: string;
}

export interface AIInsight {
  id: string;
  type: "RISK" | "OPPORTUNITY" | "PREDICTION" | "RECOMMENDATION";
  title: string;
  description: string;
  confidence: number;
  impact: "HIGH" | "MEDIUM" | "LOW";
  affectedEntities: string[];
  suggestedAction: string;
  createdAt: string;
}

// ================================
// Sample Data Generator
// ================================

const jurisdictions: Jurisdiction[] = [
  { code: "US-DE", name: "Delaware", country: "USA", region: "North America", riskLevel: "LOW", filingComplexity: "LOW", hasElectronicFiling: true },
  { code: "US-CA", name: "California", country: "USA", region: "North America", riskLevel: "LOW", filingComplexity: "MEDIUM", hasElectronicFiling: true },
  { code: "US-NY", name: "New York", country: "USA", region: "North America", riskLevel: "LOW", filingComplexity: "MEDIUM", hasElectronicFiling: true },
  { code: "US-TX", name: "Texas", country: "USA", region: "North America", riskLevel: "LOW", filingComplexity: "LOW", hasElectronicFiling: true },
  { code: "GB", name: "United Kingdom", country: "UK", region: "Europe", riskLevel: "LOW", filingComplexity: "MEDIUM", hasElectronicFiling: true },
  { code: "IE", name: "Ireland", country: "Ireland", region: "Europe", riskLevel: "LOW", filingComplexity: "MEDIUM", hasElectronicFiling: true },
  { code: "NL", name: "Netherlands", country: "Netherlands", region: "Europe", riskLevel: "LOW", filingComplexity: "HIGH", hasElectronicFiling: true },
  { code: "DE", name: "Germany", country: "Germany", region: "Europe", riskLevel: "LOW", filingComplexity: "HIGH", hasElectronicFiling: true },
  { code: "SG", name: "Singapore", country: "Singapore", region: "Asia Pacific", riskLevel: "LOW", filingComplexity: "LOW", hasElectronicFiling: true },
  { code: "HK", name: "Hong Kong", country: "Hong Kong", region: "Asia Pacific", riskLevel: "MEDIUM", filingComplexity: "MEDIUM", hasElectronicFiling: true },
  { code: "AU", name: "Australia", country: "Australia", region: "Asia Pacific", riskLevel: "LOW", filingComplexity: "MEDIUM", hasElectronicFiling: true },
  { code: "JP", name: "Japan", country: "Japan", region: "Asia Pacific", riskLevel: "LOW", filingComplexity: "HIGH", hasElectronicFiling: true },
  { code: "KY", name: "Cayman Islands", country: "Cayman Islands", region: "Caribbean", riskLevel: "MEDIUM", filingComplexity: "LOW", hasElectronicFiling: false },
  { code: "BVI", name: "British Virgin Islands", country: "BVI", region: "Caribbean", riskLevel: "MEDIUM", filingComplexity: "LOW", hasElectronicFiling: false },
  { code: "LU", name: "Luxembourg", country: "Luxembourg", region: "Europe", riskLevel: "LOW", filingComplexity: "HIGH", hasElectronicFiling: true },
];

const entities: Entity[] = [
  { id: "ENT-001", name: "Acme Corp", legalName: "Acme Corporation", entityType: "C-Corporation", jurisdictionCode: "US-DE", status: "ACTIVE", incorporationDate: "2015-03-15", fiscalYearEnd: "12-31", registrationNumber: "5123456", taxId: "12-3456789", registeredAddress: "1209 Orange Street, Wilmington, DE 19801", operatingAddress: "100 Tech Boulevard, San Francisco, CA 94105", parentEntityId: null, ownershipPercentage: null, reportingCurrency: "USD", localCurrency: "USD", healthScore: 94, complianceScore: 96, lastAuditDate: "2025-06-30", registeredAgentId: "RA-001" },
  { id: "ENT-002", name: "Acme Holdings UK", legalName: "Acme Holdings UK Limited", entityType: "Private Limited", jurisdictionCode: "GB", status: "ACTIVE", incorporationDate: "2017-08-22", fiscalYearEnd: "12-31", registrationNumber: "10123456", taxId: "GB123456789", registeredAddress: "10 Finsbury Square, London EC2A 1AF", operatingAddress: "10 Finsbury Square, London EC2A 1AF", parentEntityId: "ENT-001", ownershipPercentage: 100, reportingCurrency: "USD", localCurrency: "GBP", healthScore: 88, complianceScore: 92, lastAuditDate: "2025-06-30", registeredAgentId: "RA-002" },
  { id: "ENT-003", name: "Acme Ireland", legalName: "Acme Ireland Limited", entityType: "Private Limited", jurisdictionCode: "IE", status: "ACTIVE", incorporationDate: "2018-02-10", fiscalYearEnd: "12-31", registrationNumber: "612345", taxId: "IE1234567A", registeredAddress: "1 Grand Canal Square, Dublin 2", operatingAddress: "1 Grand Canal Square, Dublin 2", parentEntityId: "ENT-002", ownershipPercentage: 100, reportingCurrency: "USD", localCurrency: "EUR", healthScore: 91, complianceScore: 94, lastAuditDate: "2025-06-30", registeredAgentId: "RA-003" },
  { id: "ENT-004", name: "Acme Netherlands", legalName: "Acme Netherlands B.V.", entityType: "B.V.", jurisdictionCode: "NL", status: "ACTIVE", incorporationDate: "2019-05-18", fiscalYearEnd: "12-31", registrationNumber: "78901234", taxId: "NL123456789B01", registeredAddress: "Herengracht 500, 1017 CB Amsterdam", operatingAddress: "Herengracht 500, 1017 CB Amsterdam", parentEntityId: "ENT-002", ownershipPercentage: 100, reportingCurrency: "USD", localCurrency: "EUR", healthScore: 75, complianceScore: 78, lastAuditDate: "2025-03-31", registeredAgentId: "RA-004" },
  { id: "ENT-005", name: "Acme Singapore", legalName: "Acme Singapore Pte. Ltd.", entityType: "Private Limited", jurisdictionCode: "SG", status: "ACTIVE", incorporationDate: "2019-11-05", fiscalYearEnd: "12-31", registrationNumber: "201912345A", taxId: "201912345A", registeredAddress: "1 Raffles Place, #20-01, Singapore 048616", operatingAddress: "1 Raffles Place, #20-01, Singapore 048616", parentEntityId: "ENT-001", ownershipPercentage: 100, reportingCurrency: "USD", localCurrency: "SGD", healthScore: 96, complianceScore: 98, lastAuditDate: "2025-06-30", registeredAgentId: "RA-005" },
  { id: "ENT-006", name: "Acme Hong Kong", legalName: "Acme Hong Kong Limited", entityType: "Private Limited", jurisdictionCode: "HK", status: "ACTIVE", incorporationDate: "2020-03-20", fiscalYearEnd: "12-31", registrationNumber: "2876543", taxId: "HK2876543", registeredAddress: "28/F, One Pacific Place, 88 Queensway, Hong Kong", operatingAddress: "28/F, One Pacific Place, 88 Queensway, Hong Kong", parentEntityId: "ENT-005", ownershipPercentage: 100, reportingCurrency: "USD", localCurrency: "HKD", healthScore: 82, complianceScore: 85, lastAuditDate: "2025-06-30", registeredAgentId: "RA-006" },
  { id: "ENT-007", name: "Acme Australia", legalName: "Acme Australia Pty Ltd", entityType: "Pty Ltd", jurisdictionCode: "AU", status: "ACTIVE", incorporationDate: "2020-07-14", fiscalYearEnd: "06-30", registrationNumber: "123456789", taxId: "12345678901", registeredAddress: "Level 30, 25 Martin Place, Sydney NSW 2000", operatingAddress: "Level 30, 25 Martin Place, Sydney NSW 2000", parentEntityId: "ENT-005", ownershipPercentage: 100, reportingCurrency: "USD", localCurrency: "AUD", healthScore: 89, complianceScore: 91, lastAuditDate: "2025-06-30", registeredAgentId: "RA-007" },
  { id: "ENT-008", name: "Acme Germany", legalName: "Acme Deutschland GmbH", entityType: "GmbH", jurisdictionCode: "DE", status: "ACTIVE", incorporationDate: "2021-01-12", fiscalYearEnd: "12-31", registrationNumber: "HRB 12345", taxId: "DE123456789", registeredAddress: "Friedrichstraße 123, 10117 Berlin", operatingAddress: "Friedrichstraße 123, 10117 Berlin", parentEntityId: "ENT-002", ownershipPercentage: 100, reportingCurrency: "USD", localCurrency: "EUR", healthScore: 68, complianceScore: 72, lastAuditDate: "2025-03-31", registeredAgentId: "RA-008" },
  { id: "ENT-009", name: "Acme Japan", legalName: "Acme Japan K.K.", entityType: "K.K.", jurisdictionCode: "JP", status: "ACTIVE", incorporationDate: "2021-04-01", fiscalYearEnd: "03-31", registrationNumber: "0100-01-123456", taxId: "JP1234567890123", registeredAddress: "1-1-1 Marunouchi, Chiyoda-ku, Tokyo 100-0005", operatingAddress: "1-1-1 Marunouchi, Chiyoda-ku, Tokyo 100-0005", parentEntityId: "ENT-005", ownershipPercentage: 100, reportingCurrency: "USD", localCurrency: "JPY", healthScore: 85, complianceScore: 88, lastAuditDate: "2025-03-31", registeredAgentId: "RA-009" },
  { id: "ENT-010", name: "Acme Cayman", legalName: "Acme Cayman Ltd.", entityType: "Exempt Company", jurisdictionCode: "KY", status: "DORMANT", incorporationDate: "2018-06-30", fiscalYearEnd: "12-31", registrationNumber: "MC-123456", taxId: "N/A", registeredAddress: "PO Box 309, Ugland House, George Town", operatingAddress: "PO Box 309, Ugland House, George Town", parentEntityId: "ENT-001", ownershipPercentage: 100, reportingCurrency: "USD", localCurrency: "USD", healthScore: 55, complianceScore: 60, lastAuditDate: "2024-06-30", registeredAgentId: "RA-010" },
  { id: "ENT-011", name: "Acme California", legalName: "Acme California Inc.", entityType: "Corporation", jurisdictionCode: "US-CA", status: "ACTIVE", incorporationDate: "2022-02-15", fiscalYearEnd: "12-31", registrationNumber: "C4567890", taxId: "45-6789012", registeredAddress: "100 Tech Boulevard, San Francisco, CA 94105", operatingAddress: "100 Tech Boulevard, San Francisco, CA 94105", parentEntityId: "ENT-001", ownershipPercentage: 100, reportingCurrency: "USD", localCurrency: "USD", healthScore: 92, complianceScore: 95, lastAuditDate: "2025-06-30", registeredAgentId: "RA-011" },
  { id: "ENT-012", name: "Acme Texas", legalName: "Acme Texas LLC", entityType: "LLC", jurisdictionCode: "US-TX", status: "ACTIVE", incorporationDate: "2022-08-01", fiscalYearEnd: "12-31", registrationNumber: "0803456789", taxId: "56-7890123", registeredAddress: "500 Main Street, Suite 200, Houston, TX 77002", operatingAddress: "500 Main Street, Suite 200, Houston, TX 77002", parentEntityId: "ENT-001", ownershipPercentage: 100, reportingCurrency: "USD", localCurrency: "USD", healthScore: 90, complianceScore: 93, lastAuditDate: "2025-06-30", registeredAgentId: "RA-012" },
  { id: "ENT-013", name: "Acme Luxembourg", legalName: "Acme Luxembourg S.à r.l.", entityType: "S.à r.l.", jurisdictionCode: "LU", status: "ACTIVE", incorporationDate: "2020-09-25", fiscalYearEnd: "12-31", registrationNumber: "B123456", taxId: "LU12345678", registeredAddress: "2 Boulevard Royal, L-2449 Luxembourg", operatingAddress: "2 Boulevard Royal, L-2449 Luxembourg", parentEntityId: "ENT-002", ownershipPercentage: 100, reportingCurrency: "USD", localCurrency: "EUR", healthScore: 78, complianceScore: 81, lastAuditDate: "2025-03-31", registeredAgentId: "RA-013" },
  { id: "ENT-014", name: "Acme BVI", legalName: "Acme BVI Ltd.", entityType: "BC", jurisdictionCode: "BVI", status: "DORMANT", incorporationDate: "2017-12-01", fiscalYearEnd: "12-31", registrationNumber: "1876543", taxId: "N/A", registeredAddress: "Road Town, Tortola, British Virgin Islands", operatingAddress: "Road Town, Tortola, British Virgin Islands", parentEntityId: "ENT-001", ownershipPercentage: 100, reportingCurrency: "USD", localCurrency: "USD", healthScore: 50, complianceScore: 55, lastAuditDate: "2024-06-30", registeredAgentId: "RA-014" },
];

const officers: Officer[] = [
  { id: "OFF-001", entityId: "ENT-001", name: "John Smith", role: "CEO & President", appointmentDate: "2015-03-15", resignationDate: null, email: "john.smith@acme.com", isDirector: true, isShareholder: true, signatoryLevel: "A" },
  { id: "OFF-002", entityId: "ENT-001", name: "Sarah Johnson", role: "CFO", appointmentDate: "2016-06-01", resignationDate: null, email: "sarah.johnson@acme.com", isDirector: true, isShareholder: false, signatoryLevel: "A" },
  { id: "OFF-003", entityId: "ENT-001", name: "Michael Chen", role: "General Counsel", appointmentDate: "2018-01-15", resignationDate: null, email: "michael.chen@acme.com", isDirector: false, isShareholder: false, signatoryLevel: "B" },
  { id: "OFF-004", entityId: "ENT-002", name: "Emma Watson", role: "Director", appointmentDate: "2017-08-22", resignationDate: null, email: "emma.watson@acme.co.uk", isDirector: true, isShareholder: false, signatoryLevel: "A" },
  { id: "OFF-005", entityId: "ENT-002", name: "James Wilson", role: "Company Secretary", appointmentDate: "2017-09-01", resignationDate: null, email: "james.wilson@acme.co.uk", isDirector: false, isShareholder: false, signatoryLevel: "B" },
  { id: "OFF-006", entityId: "ENT-003", name: "Siobhan O'Brien", role: "Director", appointmentDate: "2018-02-10", resignationDate: null, email: "siobhan.obrien@acme.ie", isDirector: true, isShareholder: false, signatoryLevel: "A" },
  { id: "OFF-007", entityId: "ENT-005", name: "Wei Lin", role: "Managing Director", appointmentDate: "2019-11-05", resignationDate: null, email: "wei.lin@acme.sg", isDirector: true, isShareholder: false, signatoryLevel: "A" },
  { id: "OFF-008", entityId: "ENT-006", name: "Tony Chan", role: "Director", appointmentDate: "2020-03-20", resignationDate: null, email: "tony.chan@acme.hk", isDirector: true, isShareholder: false, signatoryLevel: "A" },
  { id: "OFF-009", entityId: "ENT-008", name: "Hans Mueller", role: "Geschäftsführer", appointmentDate: "2021-01-12", resignationDate: null, email: "hans.mueller@acme.de", isDirector: true, isShareholder: false, signatoryLevel: "A" },
  { id: "OFF-010", entityId: "ENT-009", name: "Takeshi Yamamoto", role: "Representative Director", appointmentDate: "2021-04-01", resignationDate: null, email: "takeshi.yamamoto@acme.jp", isDirector: true, isShareholder: false, signatoryLevel: "A" },
];

const obligations: Obligation[] = [
  { id: "OBL-001", entityId: "ENT-001", obligationType: "STATUTORY", name: "Delaware Annual Franchise Tax", description: "Annual franchise tax filing with Delaware Division of Corporations", authority: "Delaware Division of Corporations", frequency: "ANNUAL", dueDate: "2026-03-01", nextDueDate: "2026-03-01", filingStatus: "PENDING", approvalStatus: "NOT_REQUIRED", requiredForms: ["Annual Report"], requiresSignature: false, requiresApproval: false, evidenceAttached: false, assignedTo: "Sarah Johnson", lastFiledDate: "2025-03-01", lastFiledBy: "Sarah Johnson" },
  { id: "OBL-002", entityId: "ENT-001", obligationType: "TAX", name: "Federal Corporate Tax Return", description: "Form 1120 - U.S. Corporation Income Tax Return", authority: "IRS", frequency: "ANNUAL", dueDate: "2026-04-15", nextDueDate: "2026-04-15", filingStatus: "PENDING", approvalStatus: "PENDING_APPROVAL", requiredForms: ["Form 1120", "Schedule K-1"], requiresSignature: true, requiresApproval: true, evidenceAttached: false, assignedTo: "Sarah Johnson", lastFiledDate: "2025-04-15", lastFiledBy: "Sarah Johnson" },
  { id: "OBL-003", entityId: "ENT-002", obligationType: "STATUTORY", name: "Companies House Annual Return", description: "Annual confirmation statement filing", authority: "Companies House", frequency: "ANNUAL", dueDate: "2026-02-22", nextDueDate: "2026-02-22", filingStatus: "PENDING", approvalStatus: "NOT_REQUIRED", requiredForms: ["CS01"], requiresSignature: false, requiresApproval: false, evidenceAttached: false, assignedTo: "Emma Watson", lastFiledDate: "2025-02-22", lastFiledBy: "James Wilson" },
  { id: "OBL-004", entityId: "ENT-002", obligationType: "TAX", name: "UK Corporation Tax Return", description: "CT600 Corporation Tax Return", authority: "HMRC", frequency: "ANNUAL", dueDate: "2026-12-31", nextDueDate: "2026-12-31", filingStatus: "PENDING", approvalStatus: "PENDING_APPROVAL", requiredForms: ["CT600"], requiresSignature: true, requiresApproval: true, evidenceAttached: false, assignedTo: "Emma Watson", lastFiledDate: "2025-12-31", lastFiledBy: "Emma Watson" },
  { id: "OBL-005", entityId: "ENT-003", obligationType: "STATUTORY", name: "CRO Annual Return", description: "Annual return filing with Companies Registration Office", authority: "CRO Ireland", frequency: "ANNUAL", dueDate: "2026-02-10", nextDueDate: "2026-02-10", filingStatus: "OVERDUE", approvalStatus: "NOT_REQUIRED", requiredForms: ["B1"], requiresSignature: false, requiresApproval: false, evidenceAttached: false, assignedTo: "Siobhan O'Brien", lastFiledDate: "2025-02-10", lastFiledBy: "Siobhan O'Brien" },
  { id: "OBL-006", entityId: "ENT-004", obligationType: "STATUTORY", name: "KvK Annual Filing", description: "Chamber of Commerce annual registration update", authority: "Kamer van Koophandel", frequency: "ANNUAL", dueDate: "2026-05-18", nextDueDate: "2026-05-18", filingStatus: "PENDING", approvalStatus: "NOT_REQUIRED", requiredForms: ["Annual Accounts"], requiresSignature: true, requiresApproval: true, evidenceAttached: false, assignedTo: "External Advisor", lastFiledDate: "2025-05-18", lastFiledBy: "External Advisor" },
  { id: "OBL-007", entityId: "ENT-005", obligationType: "STATUTORY", name: "ACRA Annual Return", description: "Annual return filing with ACRA Singapore", authority: "ACRA", frequency: "ANNUAL", dueDate: "2026-02-28", nextDueDate: "2026-02-28", filingStatus: "FILED", approvalStatus: "APPROVED", requiredForms: ["Annual Return"], requiresSignature: false, requiresApproval: false, evidenceAttached: true, assignedTo: "Wei Lin", lastFiledDate: "2026-01-15", lastFiledBy: "Wei Lin" },
  { id: "OBL-008", entityId: "ENT-006", obligationType: "STATUTORY", name: "Annual Return - Hong Kong", description: "Companies Registry annual return", authority: "Companies Registry HK", frequency: "ANNUAL", dueDate: "2026-04-20", nextDueDate: "2026-04-20", filingStatus: "PENDING", approvalStatus: "NOT_REQUIRED", requiredForms: ["NAR1"], requiresSignature: false, requiresApproval: false, evidenceAttached: false, assignedTo: "Tony Chan", lastFiledDate: "2025-04-20", lastFiledBy: "Tony Chan" },
  { id: "OBL-009", entityId: "ENT-007", obligationType: "STATUTORY", name: "ASIC Annual Statement", description: "Annual company statement to ASIC", authority: "ASIC", frequency: "ANNUAL", dueDate: "2026-08-14", nextDueDate: "2026-08-14", filingStatus: "PENDING", approvalStatus: "NOT_REQUIRED", requiredForms: ["Form 484"], requiresSignature: false, requiresApproval: false, evidenceAttached: false, assignedTo: "External Advisor", lastFiledDate: "2025-08-14", lastFiledBy: "External Advisor" },
  { id: "OBL-010", entityId: "ENT-008", obligationType: "STATUTORY", name: "Handelsregister Annual Filing", description: "Commercial register update", authority: "Amtsgericht Berlin", frequency: "ANNUAL", dueDate: "2026-01-12", nextDueDate: "2026-01-12", filingStatus: "OVERDUE", approvalStatus: "PENDING_APPROVAL", requiredForms: ["Jahresabschluss"], requiresSignature: true, requiresApproval: true, evidenceAttached: false, assignedTo: "Hans Mueller", lastFiledDate: "2025-01-12", lastFiledBy: "Hans Mueller" },
  { id: "OBL-011", entityId: "ENT-001", obligationType: "GOVERNANCE", name: "Annual Board Meeting", description: "Required annual meeting of the Board of Directors", authority: "Internal", frequency: "ANNUAL", dueDate: "2026-03-15", nextDueDate: "2026-03-15", filingStatus: "PENDING", approvalStatus: "NOT_REQUIRED", requiredForms: ["Board Minutes", "Resolutions"], requiresSignature: true, requiresApproval: true, evidenceAttached: false, assignedTo: "Michael Chen", lastFiledDate: "2025-03-15", lastFiledBy: "Michael Chen" },
  { id: "OBL-012", entityId: "ENT-001", obligationType: "GOVERNANCE", name: "Annual Shareholder Meeting", description: "Required annual general meeting of shareholders", authority: "Internal", frequency: "ANNUAL", dueDate: "2026-05-15", nextDueDate: "2026-05-15", filingStatus: "PENDING", approvalStatus: "NOT_REQUIRED", requiredForms: ["AGM Minutes", "Proxy Statements"], requiresSignature: true, requiresApproval: true, evidenceAttached: false, assignedTo: "Michael Chen", lastFiledDate: "2025-05-15", lastFiledBy: "Michael Chen" },
];

const policies: Policy[] = [
  { id: "POL-001", name: "Delegation of Authority", category: "Corporate Governance", description: "Defines signing authority thresholds and approval requirements for contracts, banking, and filings", status: "ACTIVE", version: "3.0", effectiveDate: "2025-01-01", reviewDate: "2026-01-01", owner: "Michael Chen", approvedBy: "John Smith", applicableEntities: ["ENT-001", "ENT-002", "ENT-003", "ENT-004", "ENT-005", "ENT-006", "ENT-007", "ENT-008", "ENT-009"], requiresAcknowledgement: true, acknowledgementCount: 12, totalApplicable: 14 },
  { id: "POL-002", name: "Related Party Transactions", category: "Corporate Governance", description: "Guidelines for identifying, approving, and documenting related party transactions", status: "ACTIVE", version: "2.1", effectiveDate: "2024-07-01", reviewDate: "2025-07-01", owner: "Sarah Johnson", approvedBy: "John Smith", applicableEntities: ["ENT-001", "ENT-002", "ENT-003", "ENT-004", "ENT-005", "ENT-006", "ENT-007", "ENT-008", "ENT-009", "ENT-010", "ENT-011", "ENT-012", "ENT-013", "ENT-014"], requiresAcknowledgement: true, acknowledgementCount: 14, totalApplicable: 14 },
  { id: "POL-003", name: "Record Retention Policy", category: "Compliance", description: "Defines retention periods for corporate records, filings, and governance documents", status: "ACTIVE", version: "1.5", effectiveDate: "2024-01-01", reviewDate: "2026-01-01", owner: "Michael Chen", approvedBy: "Sarah Johnson", applicableEntities: ["ENT-001", "ENT-002", "ENT-003", "ENT-004", "ENT-005", "ENT-006", "ENT-007", "ENT-008", "ENT-009", "ENT-010", "ENT-011", "ENT-012", "ENT-013", "ENT-014"], requiresAcknowledgement: false, acknowledgementCount: 0, totalApplicable: 14 },
  { id: "POL-004", name: "Anti-Bribery and Corruption", category: "Risk & Ethics", description: "Zero tolerance policy for bribery and corrupt practices across all jurisdictions", status: "ACTIVE", version: "2.0", effectiveDate: "2024-06-01", reviewDate: "2025-06-01", owner: "Michael Chen", approvedBy: "John Smith", applicableEntities: ["ENT-001", "ENT-002", "ENT-003", "ENT-004", "ENT-005", "ENT-006", "ENT-007", "ENT-008", "ENT-009", "ENT-010", "ENT-011", "ENT-012", "ENT-013", "ENT-014"], requiresAcknowledgement: true, acknowledgementCount: 10, totalApplicable: 14 },
  { id: "POL-005", name: "Intercompany Agreement Governance", category: "Intercompany", description: "Framework for creating, approving, and maintaining intercompany agreements", status: "ACTIVE", version: "1.2", effectiveDate: "2024-09-01", reviewDate: "2025-09-01", owner: "Sarah Johnson", approvedBy: "Michael Chen", applicableEntities: ["ENT-001", "ENT-002", "ENT-003", "ENT-004", "ENT-005", "ENT-006", "ENT-007", "ENT-008", "ENT-009", "ENT-013"], requiresAcknowledgement: true, acknowledgementCount: 8, totalApplicable: 10 },
  { id: "POL-006", name: "Dividend Distribution Policy", category: "Capital Governance", description: "Guidelines for declaring and distributing dividends", status: "ACTIVE", version: "1.0", effectiveDate: "2025-01-01", reviewDate: "2026-01-01", owner: "Sarah Johnson", approvedBy: "John Smith", applicableEntities: ["ENT-001", "ENT-002", "ENT-003", "ENT-004", "ENT-005"], requiresAcknowledgement: true, acknowledgementCount: 4, totalApplicable: 5 },
  { id: "POL-007", name: "Whistleblower Policy", category: "Risk & Ethics", description: "Procedures for reporting suspected misconduct or violations", status: "ACTIVE", version: "1.3", effectiveDate: "2024-03-01", reviewDate: "2025-03-01", owner: "Michael Chen", approvedBy: "John Smith", applicableEntities: ["ENT-001", "ENT-002", "ENT-003", "ENT-004", "ENT-005", "ENT-006", "ENT-007", "ENT-008", "ENT-009", "ENT-010", "ENT-011", "ENT-012", "ENT-013", "ENT-014"], requiresAcknowledgement: true, acknowledgementCount: 11, totalApplicable: 14 },
  { id: "POL-008", name: "Statutory Filing Policy", category: "Compliance", description: "Standards for timely and accurate statutory filings across jurisdictions", status: "ACTIVE", version: "2.0", effectiveDate: "2025-01-01", reviewDate: "2026-01-01", owner: "External Advisor", approvedBy: "Michael Chen", applicableEntities: ["ENT-001", "ENT-002", "ENT-003", "ENT-004", "ENT-005", "ENT-006", "ENT-007", "ENT-008", "ENT-009", "ENT-010", "ENT-011", "ENT-012", "ENT-013", "ENT-014"], requiresAcknowledgement: false, acknowledgementCount: 0, totalApplicable: 14 },
];

const advisors: ThirdPartyAdvisor[] = [
  { id: "ADV-001", name: "Baker McKenzie", advisorType: "LEGAL_COUNSEL", companyName: "Baker McKenzie LLP", jurisdiction: "US-DE", email: "acme@bakermckenzie.com", phone: "+1-202-555-0100", engagementStartDate: "2015-03-15", engagementEndDate: null, renewalDate: "2026-03-15", annualFee: 250000, currency: "USD", status: "ACTIVE", assignedEntities: ["ENT-001", "ENT-011", "ENT-012"], servicesProvided: ["Corporate Law", "M&A", "Securities"] },
  { id: "ADV-002", name: "Deloitte", advisorType: "ACCOUNTANT", companyName: "Deloitte LLP", jurisdiction: "US-DE", email: "acme@deloitte.com", phone: "+1-212-555-0200", engagementStartDate: "2016-01-01", engagementEndDate: null, renewalDate: "2026-01-01", annualFee: 500000, currency: "USD", status: "ACTIVE", assignedEntities: ["ENT-001", "ENT-002", "ENT-003", "ENT-004", "ENT-005", "ENT-006", "ENT-007", "ENT-008", "ENT-009", "ENT-011", "ENT-012", "ENT-013"], servicesProvided: ["Audit", "Tax", "Advisory"] },
  { id: "ADV-003", name: "Ernst & Young", advisorType: "TAX_ADVISOR", companyName: "Ernst & Young LLP", jurisdiction: "GB", email: "acme@ey.com", phone: "+44-20-555-0300", engagementStartDate: "2017-08-22", engagementEndDate: null, renewalDate: "2026-08-22", annualFee: 180000, currency: "GBP", status: "ACTIVE", assignedEntities: ["ENT-002", "ENT-003", "ENT-004", "ENT-008", "ENT-013"], servicesProvided: ["Tax Compliance", "Transfer Pricing", "Tax Advisory"] },
  { id: "ADV-004", name: "Corporation Service Company", advisorType: "REGISTERED_AGENT", companyName: "CSC Global", jurisdiction: "US-DE", email: "acme@cscglobal.com", phone: "+1-302-555-0400", engagementStartDate: "2015-03-15", engagementEndDate: null, renewalDate: "2026-03-15", annualFee: 5000, currency: "USD", status: "ACTIVE", assignedEntities: ["ENT-001", "ENT-010", "ENT-011", "ENT-012", "ENT-014"], servicesProvided: ["Registered Agent", "Document Filing", "Compliance Reminders"] },
  { id: "ADV-005", name: "Vistra", advisorType: "CORPORATE_SECRETARY", companyName: "Vistra Corporate Services", jurisdiction: "SG", email: "acme@vistra.com", phone: "+65-6555-0500", engagementStartDate: "2019-11-05", engagementEndDate: null, renewalDate: "2026-11-05", annualFee: 25000, currency: "SGD", status: "ACTIVE", assignedEntities: ["ENT-005", "ENT-006", "ENT-007", "ENT-009"], servicesProvided: ["Corporate Secretarial", "Registered Office", "Annual Filings"] },
  { id: "ADV-006", name: "TMF Group", advisorType: "CORPORATE_SECRETARY", companyName: "TMF Group", jurisdiction: "NL", email: "acme@tmf-group.com", phone: "+31-20-555-0600", engagementStartDate: "2019-05-18", engagementEndDate: null, renewalDate: "2026-05-18", annualFee: 35000, currency: "EUR", status: "EXPIRING_SOON", assignedEntities: ["ENT-004", "ENT-008", "ENT-013"], servicesProvided: ["Corporate Secretarial", "Accounting", "Payroll"] },
];

const risks: ComplianceRisk[] = [
  { id: "RISK-001", entityId: "ENT-008", jurisdictionCode: "DE", riskType: "Filing Delay", title: "Overdue Annual Filing - Germany", description: "Handelsregister annual filing is overdue by 13 days. Potential late fees and regulatory scrutiny.", severity: "HIGH", likelihood: "LIKELY", impact: "MEDIUM", status: "OPEN", mitigationPlan: "Expedite filing with external advisor. Target completion within 5 business days.", owner: "Hans Mueller", dueDate: "2026-01-31", identifiedDate: "2026-01-13", lastReviewDate: "2026-01-20" },
  { id: "RISK-002", entityId: "ENT-003", jurisdictionCode: "IE", riskType: "Compliance Gap", title: "CRO Annual Return Overdue", description: "Irish annual return filing deadline missed. Entity at risk of strike-off if not resolved.", severity: "CRITICAL", likelihood: "LIKELY", impact: "HIGH", status: "OPEN", mitigationPlan: "Immediate filing required. Late filing fee applies. Confirm with CRO re: restoration timeline.", owner: "Siobhan O'Brien", dueDate: "2026-01-28", identifiedDate: "2026-01-11", lastReviewDate: "2026-01-20" },
  { id: "RISK-003", entityId: "ENT-010", jurisdictionCode: "KY", riskType: "Dormancy Risk", title: "Dormant Entity Review Required", description: "Acme Cayman has been dormant for 18 months. Consider dissolution or reactivation.", severity: "MEDIUM", likelihood: "POSSIBLE", impact: "LOW", status: "OPEN", mitigationPlan: "Schedule board review to determine future of entity. If no business purpose, initiate dissolution.", owner: "Michael Chen", dueDate: "2026-03-31", identifiedDate: "2025-12-01", lastReviewDate: "2026-01-15" },
  { id: "RISK-004", entityId: "ENT-014", jurisdictionCode: "BVI", riskType: "Dormancy Risk", title: "BVI Entity - Consider Dissolution", description: "Acme BVI has no active operations. Maintaining costs without business purpose.", severity: "LOW", likelihood: "POSSIBLE", impact: "LOW", status: "ACCEPTED", mitigationPlan: "Accepted as holding structure. Annual review scheduled.", owner: "Michael Chen", dueDate: "2026-06-30", identifiedDate: "2025-06-01", lastReviewDate: "2026-01-15" },
  { id: "RISK-005", entityId: null, jurisdictionCode: "DE", riskType: "Regulatory Change", title: "German Supply Chain Due Diligence Act", description: "New requirements for supply chain compliance reporting effective 2026. Acme Germany needs implementation plan.", severity: "HIGH", likelihood: "LIKELY", impact: "HIGH", status: "OPEN", mitigationPlan: "Engage external counsel for gap analysis. Develop implementation roadmap by Q1 2026.", owner: "Hans Mueller", dueDate: "2026-03-31", identifiedDate: "2025-11-01", lastReviewDate: "2026-01-10" },
  { id: "RISK-006", entityId: "ENT-004", jurisdictionCode: "NL", riskType: "Advisor Expiry", title: "TMF Engagement Expiring", description: "Corporate secretary engagement with TMF Group expiring in Q2. Need to renew or transition.", severity: "MEDIUM", likelihood: "LIKELY", impact: "MEDIUM", status: "OPEN", mitigationPlan: "Initiate renewal discussions. Evaluate alternative providers if fee increase proposed.", owner: "Sarah Johnson", dueDate: "2026-04-01", identifiedDate: "2026-01-05", lastReviewDate: "2026-01-20" },
];

const aiInsights: AIInsight[] = [
  { id: "AI-001", type: "RISK", title: "Filing Pattern Anomaly Detected", description: "Germany and Ireland entities showing consistent late filing patterns. Historical data suggests systemic process issues rather than one-off delays.", confidence: 87, impact: "HIGH", affectedEntities: ["ENT-003", "ENT-008"], suggestedAction: "Review local advisor capacity and consider centralized filing coordination.", createdAt: "2026-01-20T14:30:00Z" },
  { id: "AI-002", type: "PREDICTION", title: "Q1 Filing Cluster Alert", description: "12 statutory filings due in February-March 2026 across 8 jurisdictions. Higher than average concentration suggests resource planning needed.", confidence: 92, impact: "MEDIUM", affectedEntities: ["ENT-001", "ENT-002", "ENT-003", "ENT-005", "ENT-006", "ENT-007", "ENT-008", "ENT-009"], suggestedAction: "Pre-schedule advisor time and internal reviews. Consider staggered preparation.", createdAt: "2026-01-19T10:00:00Z" },
  { id: "AI-003", type: "OPPORTUNITY", title: "E-Filing Optimization Available", description: "4 jurisdictions now offer electronic filing that Acme is not utilizing. Potential to reduce filing time by 60% and eliminate courier costs.", confidence: 95, impact: "MEDIUM", affectedEntities: ["ENT-003", "ENT-004", "ENT-008", "ENT-013"], suggestedAction: "Enable e-filing with CRO Ireland, KvK Netherlands, Handelsregister Germany, and Luxembourg RCS.", createdAt: "2026-01-18T09:15:00Z" },
  { id: "AI-004", type: "RECOMMENDATION", title: "Dormant Entity Consolidation", description: "2 dormant entities (Cayman, BVI) cost approximately $35,000 annually to maintain with no active operations.", confidence: 88, impact: "LOW", affectedEntities: ["ENT-010", "ENT-014"], suggestedAction: "Schedule board review for Q2 to evaluate dissolution or purpose confirmation.", createdAt: "2026-01-17T16:45:00Z" },
  { id: "AI-005", type: "RISK", title: "Policy Acknowledgement Gap", description: "Anti-Bribery policy has 4 entities with pending acknowledgements. Audit risk if not resolved before Q1 close.", confidence: 91, impact: "HIGH", affectedEntities: ["ENT-010", "ENT-013", "ENT-014", "ENT-008"], suggestedAction: "Send reminder to entity directors and escalate to regional leads.", createdAt: "2026-01-16T11:30:00Z" },
];

const meetings: Meeting[] = [
  { id: "MTG-001", entityId: "ENT-001", meetingType: "BOARD", title: "Q4 2025 Board Meeting", scheduledDate: "2025-12-15T14:00:00Z", location: "100 Tech Boulevard, San Francisco", quorumRequired: 3, attendeesCount: 4, isQuorumMet: true, minutesApproved: true, agendaItems: ["Q4 Financial Review", "2026 Budget Approval", "Strategic Initiatives Update", "Compliance Report"], actionItems: [], status: "COMPLETED" },
  { id: "MTG-002", entityId: "ENT-001", meetingType: "BOARD", title: "Q1 2026 Board Meeting", scheduledDate: "2026-03-15T14:00:00Z", location: "100 Tech Boulevard, San Francisco", quorumRequired: 3, attendeesCount: 0, isQuorumMet: false, minutesApproved: false, agendaItems: ["Q1 Financial Review", "Compliance Update", "Risk Assessment", "Capital Allocation"], actionItems: [], status: "SCHEDULED" },
  { id: "MTG-003", entityId: "ENT-001", meetingType: "ANNUAL_GENERAL", title: "2026 Annual General Meeting", scheduledDate: "2026-05-15T10:00:00Z", location: "100 Tech Boulevard, San Francisco", quorumRequired: 2, attendeesCount: 0, isQuorumMet: false, minutesApproved: false, agendaItems: ["Financial Statements Approval", "Director Elections", "Auditor Appointment", "Dividend Declaration"], actionItems: [], status: "SCHEDULED" },
  { id: "MTG-004", entityId: "ENT-002", meetingType: "BOARD", title: "UK Holdings Board Meeting", scheduledDate: "2026-02-20T10:00:00Z", location: "10 Finsbury Square, London", quorumRequired: 2, attendeesCount: 0, isQuorumMet: false, minutesApproved: false, agendaItems: ["2025 Financial Review", "Companies House Filing Approval", "Intercompany Matters"], actionItems: [], status: "SCHEDULED" },
  { id: "MTG-005", entityId: "ENT-005", meetingType: "BOARD", title: "APAC Quarterly Review", scheduledDate: "2026-01-30T09:00:00Z", location: "1 Raffles Place, Singapore", quorumRequired: 2, attendeesCount: 0, isQuorumMet: false, minutesApproved: false, agendaItems: ["Regional Performance", "Compliance Status", "Expansion Plans"], actionItems: [], status: "SCHEDULED" },
];

const resolutions: Resolution[] = [
  { id: "RES-001", entityId: "ENT-001", title: "2026 Operating Budget Approval", resolutionType: "BOARD", status: "APPROVED", proposedDate: "2025-12-15", approvedDate: "2025-12-15", executedDate: "2025-12-16", proposedBy: "Sarah Johnson", approvers: ["John Smith", "Sarah Johnson", "Board Member 3", "Board Member 4"], votesFor: 4, votesAgainst: 0, abstentions: 0, documentUrl: "/docs/resolutions/RES-001.pdf", relatedMeetingId: "MTG-001" },
  { id: "RES-002", entityId: "ENT-001", title: "Q1 2026 Dividend Declaration", resolutionType: "BOARD", status: "DRAFT", proposedDate: "2026-03-15", approvedDate: null, executedDate: null, proposedBy: "Sarah Johnson", approvers: [], votesFor: 0, votesAgainst: 0, abstentions: 0, documentUrl: null, relatedMeetingId: "MTG-002" },
  { id: "RES-003", entityId: "ENT-001", title: "Officer Appointment - New VP Finance", resolutionType: "BOARD", status: "PENDING", proposedDate: "2026-01-20", approvedDate: null, executedDate: null, proposedBy: "John Smith", approvers: [], votesFor: 0, votesAgainst: 0, abstentions: 0, documentUrl: null, relatedMeetingId: null },
  { id: "RES-004", entityId: "ENT-002", title: "Intercompany Loan Agreement Approval", resolutionType: "BOARD", status: "APPROVED", proposedDate: "2025-11-10", approvedDate: "2025-11-12", executedDate: "2025-11-15", proposedBy: "Emma Watson", approvers: ["Emma Watson", "John Smith"], votesFor: 2, votesAgainst: 0, abstentions: 0, documentUrl: "/docs/resolutions/RES-004.pdf", relatedMeetingId: null },
  { id: "RES-005", entityId: "ENT-005", title: "Singapore Subsidiary Formation", resolutionType: "WRITTEN_CONSENT", status: "EXECUTED", proposedDate: "2025-10-01", approvedDate: "2025-10-05", executedDate: "2025-10-10", proposedBy: "Wei Lin", approvers: ["Wei Lin", "John Smith"], votesFor: 2, votesAgainst: 0, abstentions: 0, documentUrl: "/docs/resolutions/RES-005.pdf", relatedMeetingId: null },
];

const signatories: AuthorizedSignatory[] = [
  { id: "SIG-001", entityId: "ENT-001", officerId: "OFF-001", officerName: "John Smith", authorityType: "BANKING", signingLimit: null, currency: "USD", requiresCoSigner: false, coSignerRequired: null, effectiveDate: "2015-03-15", expiryDate: null, isActive: true, delegatedBy: null, delegationScope: null },
  { id: "SIG-002", entityId: "ENT-001", officerId: "OFF-002", officerName: "Sarah Johnson", authorityType: "BANKING", signingLimit: 1000000, currency: "USD", requiresCoSigner: false, coSignerRequired: null, effectiveDate: "2016-06-01", expiryDate: null, isActive: true, delegatedBy: null, delegationScope: null },
  { id: "SIG-003", entityId: "ENT-001", officerId: "OFF-002", officerName: "Sarah Johnson", authorityType: "CONTRACT", signingLimit: 500000, currency: "USD", requiresCoSigner: false, coSignerRequired: null, effectiveDate: "2016-06-01", expiryDate: null, isActive: true, delegatedBy: null, delegationScope: null },
  { id: "SIG-004", entityId: "ENT-001", officerId: "OFF-003", officerName: "Michael Chen", authorityType: "CONTRACT", signingLimit: 100000, currency: "USD", requiresCoSigner: true, coSignerRequired: "Sarah Johnson", effectiveDate: "2018-01-15", expiryDate: null, isActive: true, delegatedBy: "Sarah Johnson", delegationScope: "Legal contracts only" },
  { id: "SIG-005", entityId: "ENT-002", officerId: "OFF-004", officerName: "Emma Watson", authorityType: "BANKING", signingLimit: 500000, currency: "GBP", requiresCoSigner: false, coSignerRequired: null, effectiveDate: "2017-08-22", expiryDate: null, isActive: true, delegatedBy: null, delegationScope: null },
  { id: "SIG-006", entityId: "ENT-005", officerId: "OFF-007", officerName: "Wei Lin", authorityType: "BANKING", signingLimit: null, currency: "SGD", requiresCoSigner: false, coSignerRequired: null, effectiveDate: "2019-11-05", expiryDate: null, isActive: true, delegatedBy: null, delegationScope: null },
];

const changes: EntityChange[] = [
  { id: "CHG-001", entityId: "ENT-001", changeType: "OFFICER_CHANGE", description: "Appointment of new VP Finance", effectiveDate: "2026-02-01", requestedBy: "John Smith", requestedAt: "2026-01-15T10:00:00Z", approvedBy: null, approvedAt: null, status: "PENDING", oldValue: null, newValue: "Jennifer Lee - VP Finance", filingRequired: true, filingCompleted: false, relatedObligationId: null, auditTrail: ["2026-01-15: Request submitted by John Smith", "2026-01-16: Board notification sent"] },
  { id: "CHG-002", entityId: "ENT-007", changeType: "ADDRESS_CHANGE", description: "Registered office relocation", effectiveDate: "2026-03-01", requestedBy: "External Advisor", requestedAt: "2026-01-10T14:30:00Z", approvedBy: "Sarah Johnson", approvedAt: "2026-01-12T09:00:00Z", status: "APPROVED", oldValue: "Level 30, 25 Martin Place, Sydney NSW 2000", newValue: "Level 40, 50 Bridge Street, Sydney NSW 2000", filingRequired: true, filingCompleted: false, relatedObligationId: null, auditTrail: ["2026-01-10: Request submitted", "2026-01-12: Approved by Sarah Johnson", "2026-01-13: ASIC filing initiated"] },
  { id: "CHG-003", entityId: "ENT-010", changeType: "DISSOLUTION", description: "Voluntary dissolution of dormant entity", effectiveDate: "2026-06-30", requestedBy: "Michael Chen", requestedAt: "2025-12-20T11:00:00Z", approvedBy: null, approvedAt: null, status: "PENDING", oldValue: "DORMANT", newValue: "DISSOLVED", filingRequired: true, filingCompleted: false, relatedObligationId: null, auditTrail: ["2025-12-20: Dissolution proposal submitted", "2026-01-05: Pending board approval"] },
];

const snapshots: PeriodSnapshot[] = [
  { id: "SNAP-2025-12", period: "2025-12", snapshotDate: "2025-12-31T23:59:59Z", entityCount: 14, totalObligations: 45, filedOnTime: 42, filedLate: 2, pending: 1, overallComplianceScore: 93, isLocked: true, lockedBy: "Sarah Johnson", lockedAt: "2026-01-05T10:00:00Z" },
  { id: "SNAP-2025-11", period: "2025-11", snapshotDate: "2025-11-30T23:59:59Z", entityCount: 14, totalObligations: 38, filedOnTime: 36, filedLate: 2, pending: 0, overallComplianceScore: 95, isLocked: true, lockedBy: "Sarah Johnson", lockedAt: "2025-12-05T10:00:00Z" },
  { id: "SNAP-2025-10", period: "2025-10", snapshotDate: "2025-10-31T23:59:59Z", entityCount: 14, totalObligations: 40, filedOnTime: 39, filedLate: 1, pending: 0, overallComplianceScore: 98, isLocked: true, lockedBy: "Sarah Johnson", lockedAt: "2025-11-05T10:00:00Z" },
];

// ================================
// Filing Requirements Library (from regulatory databases)
// ================================

const filingRequirements: FilingRequirement[] = [
  // US Financial Services
  { id: "US-FS-001", filingName: "Form 10-K", jurisdiction: "USA", industry: "Financial Services", regulation: "SEC", frequency: "Annual", deadline: "60-90 days after fiscal year-end", leadTimeDays: 60, responsibleDepartment: "Finance/Investor Relations", penaltyLevel: "High", keyContent: "Financial statements, MD&A, risk factors" },
  { id: "US-FS-002", filingName: "Form 10-Q", jurisdiction: "USA", industry: "Financial Services", regulation: "SEC", frequency: "Quarterly", deadline: "40-90 days after quarter-end", leadTimeDays: 35, responsibleDepartment: "Finance/Investor Relations", penaltyLevel: "High", keyContent: "Unaudited financials, MD&A updates" },
  { id: "US-FS-003", filingName: "Form 8-K", jurisdiction: "USA", industry: "Financial Services", regulation: "SEC", frequency: "As Needed", deadline: "4 business days after event", leadTimeDays: "Immediate", responsibleDepartment: "Legal/Investor Relations", penaltyLevel: "High", keyContent: "Material agreements, acquisitions, changes" },
  { id: "US-FS-004", filingName: "Form 20-F", jurisdiction: "USA", industry: "Financial Services", regulation: "SEC", frequency: "Annual", deadline: "120 days after fiscal year-end", leadTimeDays: 100, responsibleDepartment: "Finance/Investor Relations", penaltyLevel: "High", keyContent: "Annual report for foreign private issuers" },
  { id: "US-FS-005", filingName: "Proxy Statement", jurisdiction: "USA", industry: "Financial Services", regulation: "SEC", frequency: "Annual", deadline: "Before shareholder meeting", leadTimeDays: 90, responsibleDepartment: "Investor Relations/Legal", penaltyLevel: "High", keyContent: "Executive compensation, director nominees" },
  { id: "US-FS-006", filingName: "Call Report", jurisdiction: "USA", industry: "Financial Services", regulation: "Banking", frequency: "Quarterly", deadline: "30 days after quarter-end", leadTimeDays: 25, responsibleDepartment: "Finance/Regulatory Affairs", penaltyLevel: "High", keyContent: "Assets, liabilities, capital, income" },
  { id: "US-FS-007", filingName: "Suspicious Activity Report", jurisdiction: "USA", industry: "Financial Services", regulation: "Banking", frequency: "As Needed", deadline: "30 days after detection", leadTimeDays: "Immediate", responsibleDepartment: "Compliance/AML", penaltyLevel: "Critical", keyContent: "Activity details, parties, suspected violation" },
  { id: "US-FS-008", filingName: "Form ADV", jurisdiction: "USA", industry: "Financial Services", regulation: "Investment Adviser", frequency: "Annual", deadline: "90 days after fiscal year-end", leadTimeDays: 75, responsibleDepartment: "Compliance/Legal", penaltyLevel: "High", keyContent: "Firm information, services, fees, conflicts" },
  
  // US Healthcare
  { id: "US-HC-001", filingName: "Medicare Cost Report", jurisdiction: "USA", industry: "Healthcare", regulation: "CMS", frequency: "Annual", deadline: "5 months after fiscal year-end", leadTimeDays: 120, responsibleDepartment: "Finance/Compliance", penaltyLevel: "High", keyContent: "Costs by department, patient statistics" },
  { id: "US-HC-002", filingName: "HIPAA Breach Notification", jurisdiction: "USA", industry: "Healthcare", regulation: "HIPAA", frequency: "As Needed", deadline: "60 days for large breaches", leadTimeDays: "Immediate", responsibleDepartment: "Compliance/Privacy", penaltyLevel: "Critical", keyContent: "Breach description, individuals affected" },
  { id: "US-HC-003", filingName: "Annual HIPAA Audit", jurisdiction: "USA", industry: "Healthcare", regulation: "HIPAA", frequency: "Continuous", deadline: "Ongoing", leadTimeDays: "Scheduled", responsibleDepartment: "Compliance/IT Security", penaltyLevel: "High", keyContent: "Privacy controls, security safeguards" },
  { id: "US-HC-004", filingName: "State Facility Licensing", jurisdiction: "USA", industry: "Healthcare", regulation: "State", frequency: "Annual", deadline: "30-90 days before expiration", leadTimeDays: 90, responsibleDepartment: "Compliance/Operations", penaltyLevel: "Critical", keyContent: "Facility info, compliance certifications" },
  
  // US Manufacturing
  { id: "US-MF-001", filingName: "OSHA Form 300A", jurisdiction: "USA", industry: "Manufacturing", regulation: "OSHA", frequency: "Annual", deadline: "February 1 - April 30", leadTimeDays: 30, responsibleDepartment: "Safety/HR", penaltyLevel: "Medium", keyContent: "Injury/illness summary, hours worked" },
  { id: "US-MF-002", filingName: "EPA Biennial Hazardous Waste", jurisdiction: "USA", industry: "Manufacturing", regulation: "EPA", frequency: "Biennial", deadline: "March 1 (even years)", leadTimeDays: 45, responsibleDepartment: "Environmental/EHS", penaltyLevel: "High", keyContent: "Waste type, quantity, management method" },
  { id: "US-MF-003", filingName: "EPCRA Tier II Report", jurisdiction: "USA", industry: "Manufacturing", regulation: "EPCRA", frequency: "Annual", deadline: "March 1", leadTimeDays: 45, responsibleDepartment: "Environmental/EHS", penaltyLevel: "High", keyContent: "Chemical inventory, storage location" },
  { id: "US-MF-004", filingName: "TRI Report", jurisdiction: "USA", industry: "Manufacturing", regulation: "EPCRA", frequency: "Annual", deadline: "July 1", leadTimeDays: 60, responsibleDepartment: "Environmental/EHS", penaltyLevel: "High", keyContent: "Chemical releases, transfers, waste" },
  
  // US Technology
  { id: "US-TK-001", filingName: "GDPR Breach Notification", jurisdiction: "USA", industry: "Technology", regulation: "GDPR", frequency: "As Needed", deadline: "72 hours to authority", leadTimeDays: "Immediate", responsibleDepartment: "Privacy/Legal", penaltyLevel: "Critical", keyContent: "Breach description, affected individuals" },
  { id: "US-TK-002", filingName: "CCPA Breach Notification", jurisdiction: "USA", industry: "Technology", regulation: "CCPA", frequency: "As Needed", deadline: "Without unreasonable delay", leadTimeDays: "Immediate", responsibleDepartment: "Privacy/Legal", penaltyLevel: "High", keyContent: "Breach description, affected individuals" },
  { id: "US-TK-003", filingName: "SOC 2 Type II Audit", jurisdiction: "USA", industry: "Technology", regulation: "SOC 2", frequency: "Annual", deadline: "30-60 days after audit", leadTimeDays: 180, responsibleDepartment: "IT Security/Compliance", penaltyLevel: "High", keyContent: "Security controls, availability, integrity" },
  { id: "US-TK-004", filingName: "ISO 27001 Certification", jurisdiction: "USA", industry: "Technology", regulation: "ISO", frequency: "Triennial", deadline: "3 years", leadTimeDays: 90, responsibleDepartment: "IT Security/Compliance", penaltyLevel: "High", keyContent: "Security policies, controls, audit results" },
  
  // Canada
  { id: "CA-FS-001", filingName: "Annual Financial Statements", jurisdiction: "Canada", industry: "Financial Services", regulation: "OSC", frequency: "Annual", deadline: "90-120 days after year-end", leadTimeDays: 60, responsibleDepartment: "Finance/Investor Relations", penaltyLevel: "High", keyContent: "Audited financials, MD&A, filed on SEDAR+" },
  { id: "CA-FS-002", filingName: "Interim Financial Reports", jurisdiction: "Canada", industry: "Financial Services", regulation: "OSC", frequency: "Quarterly", deadline: "45-60 days after quarter-end", leadTimeDays: 30, responsibleDepartment: "Finance/Investor Relations", penaltyLevel: "High", keyContent: "Unaudited financials, MD&A, filed on SEDAR+" },
  { id: "CA-FS-003", filingName: "Annual Information Form", jurisdiction: "Canada", industry: "Financial Services", regulation: "OSC", frequency: "Annual", deadline: "Same as AFS", leadTimeDays: 60, responsibleDepartment: "Legal/Investor Relations", penaltyLevel: "Medium", keyContent: "Comprehensive overview of the company" },
  
  // EU
  { id: "EU-ALL-001", filingName: "CSRD Reporting", jurisdiction: "EU", industry: "All", regulation: "CSRD", frequency: "Annual", deadline: "Varies (starting 2025)", leadTimeDays: 180, responsibleDepartment: "Sustainability/Finance", penaltyLevel: "High", keyContent: "Detailed sustainability and ESG reporting" },
  { id: "EU-ALL-002", filingName: "ESEF Filing", jurisdiction: "EU", industry: "All", regulation: "ESMA", frequency: "Annual", deadline: "Varies by member state", leadTimeDays: 60, responsibleDepartment: "Finance/Investor Relations", penaltyLevel: "Medium", keyContent: "Annual financial reports in xHTML/iXBRL" },
  
  // UK
  { id: "UK-ALL-001", filingName: "Annual Accounts", jurisdiction: "UK", industry: "All", regulation: "Companies House", frequency: "Annual", deadline: "6-9 months after year-end", leadTimeDays: 90, responsibleDepartment: "Finance/Legal", penaltyLevel: "High", keyContent: "Filed with Companies House" },
  { id: "UK-ALL-002", filingName: "Confirmation Statement", jurisdiction: "UK", industry: "All", regulation: "Companies House", frequency: "Annual", deadline: "14 days after review period", leadTimeDays: 14, responsibleDepartment: "Legal/Corporate Secretary", penaltyLevel: "Medium", keyContent: "Confirms company details are correct" },
  
  // UAE
  { id: "AE-ALL-001", filingName: "Corporate Tax Return", jurisdiction: "UAE", industry: "All", regulation: "FTA", frequency: "Annual", deadline: "9 months after year-end", leadTimeDays: 90, responsibleDepartment: "Finance/Tax", penaltyLevel: "High", keyContent: "Filed with the Federal Tax Authority" },
  { id: "AE-ALL-002", filingName: "ESR Report", jurisdiction: "UAE", industry: "All", regulation: "ESR", frequency: "Annual", deadline: "12 months after year-end", leadTimeDays: 90, responsibleDepartment: "Legal/Compliance", penaltyLevel: "High", keyContent: "Demonstrates economic substance" },
  { id: "AE-ALL-003", filingName: "UBO Filing", jurisdiction: "UAE", industry: "All", regulation: "UBO", frequency: "Annual", deadline: "Varies", leadTimeDays: 30, responsibleDepartment: "Legal/Corporate Secretary", penaltyLevel: "Medium", keyContent: "Disclosure of ultimate beneficial owners" },
  
  // Energy
  { id: "US-EN-001", filingName: "FERC Form 1", jurisdiction: "USA", industry: "Energy", regulation: "FERC", frequency: "Annual", deadline: "April 18", leadTimeDays: 60, responsibleDepartment: "Finance/Regulatory", penaltyLevel: "High", keyContent: "Financial statements, operational data" },
  { id: "US-EN-002", filingName: "Annual Compliance Certification", jurisdiction: "USA", industry: "Energy", regulation: "EPA", frequency: "Annual", deadline: "March 1", leadTimeDays: 60, responsibleDepartment: "Environmental/EHS", penaltyLevel: "High", keyContent: "Permit conditions, compliance status" },
  
  // Insurance
  { id: "US-IN-001", filingName: "Annual Financial Statement", jurisdiction: "USA", industry: "Insurance", regulation: "State", frequency: "Annual", deadline: "March 31", leadTimeDays: 60, responsibleDepartment: "Finance/Regulatory", penaltyLevel: "Critical", keyContent: "Assets, liabilities, capital, income" },
  { id: "US-IN-002", filingName: "Quarterly Financial Statement", jurisdiction: "USA", industry: "Insurance", regulation: "State", frequency: "Quarterly", deadline: "45 days after quarter-end", leadTimeDays: 20, responsibleDepartment: "Finance/Regulatory", penaltyLevel: "High", keyContent: "Unaudited financials, key metrics" },
  { id: "US-IN-003", filingName: "Annual Actuarial Opinion", jurisdiction: "USA", industry: "Insurance", regulation: "State", frequency: "Annual", deadline: "March 1", leadTimeDays: 60, responsibleDepartment: "Finance/Actuarial", penaltyLevel: "Critical", keyContent: "Reserve adequacy, assumptions, certification" },
  
  // Retail
  { id: "US-RT-001", filingName: "PCI DSS Assessment", jurisdiction: "USA", industry: "Retail", regulation: "PCI DSS", frequency: "Annual", deadline: "30-60 days after assessment", leadTimeDays: 90, responsibleDepartment: "IT Security/Compliance", penaltyLevel: "High", keyContent: "Security controls, vulnerability assessment" },
];

// ================================
// Export Functions
// ================================

export function getJurisdictions(): Jurisdiction[] {
  return jurisdictions;
}

export function getEntities(): Entity[] {
  return entities;
}

export function getEntity(id: string): Entity | undefined {
  return entities.find(e => e.id === id);
}

export function getOfficers(entityId?: string): Officer[] {
  if (entityId) {
    return officers.filter(o => o.entityId === entityId);
  }
  return officers;
}

export function getObligations(entityId?: string): Obligation[] {
  if (entityId) {
    return obligations.filter(o => o.entityId === entityId);
  }
  return obligations;
}

export function getFilingRequirements(filters?: { jurisdiction?: string; industry?: string; penaltyLevel?: PenaltyLevel }): FilingRequirement[] {
  let requirements = filingRequirements;
  if (filters?.jurisdiction) {
    requirements = requirements.filter(r => r.jurisdiction === filters.jurisdiction);
  }
  if (filters?.industry) {
    requirements = requirements.filter(r => r.industry === filters.industry || r.industry === "All");
  }
  if (filters?.penaltyLevel) {
    requirements = requirements.filter(r => r.penaltyLevel === filters.penaltyLevel);
  }
  return requirements;
}

export function getFilingRequirementsByJurisdiction(): Record<string, FilingRequirement[]> {
  const grouped: Record<string, FilingRequirement[]> = {};
  for (const req of filingRequirements) {
    if (!grouped[req.jurisdiction]) {
      grouped[req.jurisdiction] = [];
    }
    grouped[req.jurisdiction].push(req);
  }
  return grouped;
}

export function getFilingRequirementMetrics() {
  const jurisdictions = Array.from(new Set(filingRequirements.map(r => r.jurisdiction)));
  const industries = Array.from(new Set(filingRequirements.map(r => r.industry).filter(i => i !== "All")));
  const criticalCount = filingRequirements.filter(r => r.penaltyLevel === "Critical").length;
  const highCount = filingRequirements.filter(r => r.penaltyLevel === "High").length;
  return {
    totalRequirements: filingRequirements.length,
    jurisdictionCount: jurisdictions.length,
    jurisdictions,
    industryCount: industries.length,
    industries,
    criticalFilings: criticalCount,
    highPriorityFilings: highCount,
    annualFilings: filingRequirements.filter(r => r.frequency === "Annual").length,
    quarterlyFilings: filingRequirements.filter(r => r.frequency === "Quarterly").length,
  };
}

export function getPolicies(): Policy[] {
  return policies;
}

export function getAdvisors(): ThirdPartyAdvisor[] {
  return advisors;
}

export function getRisks(entityId?: string): ComplianceRisk[] {
  if (entityId) {
    return risks.filter(r => r.entityId === entityId || r.entityId === null);
  }
  return risks;
}

export function getAIInsights(): AIInsight[] {
  return aiInsights;
}

export function getMeetings(entityId?: string): Meeting[] {
  if (entityId) {
    return meetings.filter(m => m.entityId === entityId);
  }
  return meetings;
}

export function getResolutions(entityId?: string): Resolution[] {
  if (entityId) {
    return resolutions.filter(r => r.entityId === entityId);
  }
  return resolutions;
}

export function getSignatories(entityId?: string): AuthorizedSignatory[] {
  if (entityId) {
    return signatories.filter(s => s.entityId === entityId);
  }
  return signatories;
}

export function getChanges(entityId?: string): EntityChange[] {
  if (entityId) {
    return changes.filter(c => c.entityId === entityId);
  }
  return changes;
}

export function getSnapshots(): PeriodSnapshot[] {
  return snapshots;
}

export function getComplianceMetrics(): ComplianceMetrics {
  const activeEntities = entities.filter(e => e.status === "ACTIVE");
  const atRiskEntities = activeEntities.filter(e => e.healthScore < 80).length;
  const overdueObligations = obligations.filter(o => o.filingStatus === "OVERDUE").length;
  const upcomingDeadlines = obligations.filter(o => {
    const dueDate = new Date(o.dueDate);
    const now = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff >= 0 && daysDiff <= 30 && o.filingStatus === "PENDING";
  }).length;
  
  const avgHealthScore = Math.round(
    activeEntities.reduce((sum, e) => sum + e.healthScore, 0) / activeEntities.length
  );
  
  return {
    healthScore: avgHealthScore,
    entitiesAtRisk: atRiskEntities,
    upcomingDeadlines,
    overdueObligations,
    auditReadiness: 89,
    savingsGenerated: 127500,
  };
}

export function getJurisdictionHeatmap(): JurisdictionHeatmapCell[] {
  const jurisdictionMap = new Map<string, JurisdictionHeatmapCell>();
  
  for (const entity of entities) {
    const jurisdiction = jurisdictions.find(j => j.code === entity.jurisdictionCode);
    if (!jurisdiction) continue;
    
    const entityObligations = obligations.filter(o => o.entityId === entity.id);
    const overdueCount = entityObligations.filter(o => o.filingStatus === "OVERDUE").length;
    const upcomingCount = entityObligations.filter(o => {
      const dueDate = new Date(o.dueDate);
      const now = new Date();
      const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff <= 30 && o.filingStatus === "PENDING";
    }).length;
    
    if (jurisdictionMap.has(jurisdiction.code)) {
      const existing = jurisdictionMap.get(jurisdiction.code)!;
      existing.entityCount += 1;
      existing.healthScore = Math.round((existing.healthScore * (existing.entityCount - 1) + entity.healthScore) / existing.entityCount);
      existing.overdueCount += overdueCount;
      existing.upcomingCount += upcomingCount;
    } else {
      jurisdictionMap.set(jurisdiction.code, {
        jurisdictionCode: jurisdiction.code,
        jurisdictionName: jurisdiction.name,
        entityCount: 1,
        healthScore: entity.healthScore,
        riskLevel: jurisdiction.riskLevel,
        overdueCount,
        upcomingCount,
      });
    }
  }
  
  return Array.from(jurisdictionMap.values());
}

export function getTimeline(days: number = 90): TimelineItem[] {
  const now = new Date();
  const items: TimelineItem[] = [];
  
  for (const obligation of obligations) {
    const dueDate = new Date(obligation.dueDate);
    const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= -30 && daysDiff <= days) {
      const entity = entities.find(e => e.id === obligation.entityId);
      
      let priority: TimelineItem["priority"] = "LOW";
      if (obligation.filingStatus === "OVERDUE") priority = "CRITICAL";
      else if (daysDiff <= 7) priority = "HIGH";
      else if (daysDiff <= 14) priority = "MEDIUM";
      
      items.push({
        id: obligation.id,
        entityId: obligation.entityId,
        entityName: entity?.name || "Unknown",
        obligationType: obligation.obligationType,
        title: obligation.name,
        dueDate: obligation.dueDate,
        daysUntilDue: daysDiff,
        status: obligation.filingStatus,
        priority,
        assignedTo: obligation.assignedTo,
      });
    }
  }
  
  return items.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
}

// ================================
// Equity Tracker Sample Data
// ================================

const shareholders: Shareholder[] = [
  { id: "SH-001", entityId: "ENT-001", name: "Acme Founders Trust", shareholderType: "TRUST", shareClass: "COMMON", sharesHeld: 5000000, ownershipPercentage: 50, votingRights: 50, acquisitionDate: "2015-03-15" },
  { id: "SH-002", entityId: "ENT-001", name: "John Smith", shareholderType: "INDIVIDUAL", shareClass: "COMMON", sharesHeld: 2000000, ownershipPercentage: 20, votingRights: 20, acquisitionDate: "2015-03-15" },
  { id: "SH-003", entityId: "ENT-001", name: "Venture Partners III LP", shareholderType: "CORPORATE", shareClass: "PREFERRED", sharesHeld: 2000000, ownershipPercentage: 20, votingRights: 20, acquisitionDate: "2018-06-01" },
  { id: "SH-004", entityId: "ENT-001", name: "Employee Stock Pool", shareholderType: "TRUST", shareClass: "OPTIONS", sharesHeld: 1000000, ownershipPercentage: 10, votingRights: 0, acquisitionDate: "2016-01-01" },
  { id: "SH-005", entityId: "ENT-002", name: "Acme Corp", shareholderType: "CORPORATE", shareClass: "COMMON", sharesHeld: 1000, ownershipPercentage: 100, votingRights: 100, acquisitionDate: "2017-08-22" },
  { id: "SH-006", entityId: "ENT-003", name: "Acme Holdings UK", shareholderType: "CORPORATE", shareClass: "COMMON", sharesHeld: 100, ownershipPercentage: 100, votingRights: 100, acquisitionDate: "2018-02-10" },
  { id: "SH-007", entityId: "ENT-004", name: "Acme Holdings UK", shareholderType: "CORPORATE", shareClass: "COMMON", sharesHeld: 100, ownershipPercentage: 100, votingRights: 100, acquisitionDate: "2019-05-18" },
  { id: "SH-008", entityId: "ENT-005", name: "Acme Corp", shareholderType: "CORPORATE", shareClass: "COMMON", sharesHeld: 1000000, ownershipPercentage: 100, votingRights: 100, acquisitionDate: "2019-11-05" },
  { id: "SH-009", entityId: "ENT-006", name: "Acme Singapore", shareholderType: "CORPORATE", shareClass: "COMMON", sharesHeld: 10000, ownershipPercentage: 100, votingRights: 100, acquisitionDate: "2020-03-20" },
  { id: "SH-010", entityId: "ENT-007", name: "Acme Singapore", shareholderType: "CORPORATE", shareClass: "COMMON", sharesHeld: 1000, ownershipPercentage: 100, votingRights: 100, acquisitionDate: "2020-07-14" },
  { id: "SH-011", entityId: "ENT-008", name: "Acme Holdings UK", shareholderType: "CORPORATE", shareClass: "COMMON", sharesHeld: 25000, ownershipPercentage: 100, votingRights: 100, acquisitionDate: "2021-01-12" },
  { id: "SH-012", entityId: "ENT-009", name: "Acme Singapore", shareholderType: "CORPORATE", shareClass: "COMMON", sharesHeld: 100, ownershipPercentage: 100, votingRights: 100, acquisitionDate: "2021-04-01" },
];

const shareClasses: ShareClassDefinition[] = [
  { id: "SC-001", entityId: "ENT-001", className: "Common Stock", classCode: "COMMON", authorizedShares: 20000000, issuedShares: 7000000, parValue: 0.001, currency: "USD", votingRightsPerShare: 1, dividendRights: "PARTICIPATING", dividendRate: null, liquidationPreference: null, conversionRatio: null, isConvertible: false, restrictions: [], createdDate: "2015-03-15", lastModifiedDate: "2024-06-01" },
  { id: "SC-002", entityId: "ENT-001", className: "Series A Preferred", classCode: "PREFERRED", authorizedShares: 5000000, issuedShares: 2000000, parValue: 0.001, currency: "USD", votingRightsPerShare: 1, dividendRights: "PREFERRED", dividendRate: 8, liquidationPreference: 1.5, conversionRatio: 1, isConvertible: true, restrictions: ["Anti-dilution protection", "Board seat rights"], createdDate: "2018-06-01", lastModifiedDate: "2024-06-01" },
  { id: "SC-003", entityId: "ENT-001", className: "Stock Options Pool", classCode: "OPTIONS", authorizedShares: 2000000, issuedShares: 1000000, parValue: 0.001, currency: "USD", votingRightsPerShare: 0, dividendRights: "NON_PARTICIPATING", dividendRate: null, liquidationPreference: null, conversionRatio: 1, isConvertible: true, restrictions: ["Vesting schedule required", "Exercise price at FMV"], createdDate: "2016-01-01", lastModifiedDate: "2025-01-01" },
  { id: "SC-004", entityId: "ENT-002", className: "Ordinary Shares", classCode: "COMMON", authorizedShares: 10000, issuedShares: 1000, parValue: 1, currency: "GBP", votingRightsPerShare: 1, dividendRights: "PARTICIPATING", dividendRate: null, liquidationPreference: null, conversionRatio: null, isConvertible: false, restrictions: [], createdDate: "2017-08-22", lastModifiedDate: "2023-08-22" },
  { id: "SC-005", entityId: "ENT-003", className: "Ordinary Shares", classCode: "COMMON", authorizedShares: 1000, issuedShares: 100, parValue: 1, currency: "EUR", votingRightsPerShare: 1, dividendRights: "PARTICIPATING", dividendRate: null, liquidationPreference: null, conversionRatio: null, isConvertible: false, restrictions: [], createdDate: "2018-02-10", lastModifiedDate: "2023-02-10" },
  { id: "SC-006", entityId: "ENT-004", className: "Ordinary Shares", classCode: "COMMON", authorizedShares: 1000, issuedShares: 100, parValue: 1, currency: "EUR", votingRightsPerShare: 1, dividendRights: "PARTICIPATING", dividendRate: null, liquidationPreference: null, conversionRatio: null, isConvertible: false, restrictions: [], createdDate: "2019-05-18", lastModifiedDate: "2023-05-18" },
  { id: "SC-007", entityId: "ENT-005", className: "Ordinary Shares", classCode: "COMMON", authorizedShares: 10000000, issuedShares: 1000000, parValue: 1, currency: "SGD", votingRightsPerShare: 1, dividendRights: "PARTICIPATING", dividendRate: null, liquidationPreference: null, conversionRatio: null, isConvertible: false, restrictions: [], createdDate: "2019-11-05", lastModifiedDate: "2024-11-05" },
  { id: "SC-008", entityId: "ENT-006", className: "Ordinary Shares", classCode: "COMMON", authorizedShares: 100000, issuedShares: 10000, parValue: 1, currency: "HKD", votingRightsPerShare: 1, dividendRights: "PARTICIPATING", dividendRate: null, liquidationPreference: null, conversionRatio: null, isConvertible: false, restrictions: [], createdDate: "2020-03-20", lastModifiedDate: "2024-03-20" },
  { id: "SC-009", entityId: "ENT-008", className: "Ordinary Shares", classCode: "COMMON", authorizedShares: 100000, issuedShares: 25000, parValue: 1, currency: "EUR", votingRightsPerShare: 1, dividendRights: "PARTICIPATING", dividendRate: null, liquidationPreference: null, conversionRatio: null, isConvertible: false, restrictions: ["German commercial code restrictions"], createdDate: "2021-01-12", lastModifiedDate: "2024-01-12" },
];

const equityEvents: EquityEvent[] = [
  { id: "EE-001", entityId: "ENT-001", eventType: "ISSUANCE", eventDate: "2015-03-15", effectiveDate: "2015-03-15", shareClassId: "SC-001", shareClassName: "Common Stock", numberOfShares: 5000000, pricePerShare: 0.001, totalValue: 5000, currency: "USD", fromParty: null, toParty: "Acme Founders Trust", resolutionId: "RES-F001", resolutionDate: "2015-03-15", approvalStatus: "APPROVED", approvedBy: "Board of Directors", approvedDate: "2015-03-15", documents: ["Incorporation Documents", "Stock Certificates"], notes: "Founding shares issuance" },
  { id: "EE-002", entityId: "ENT-001", eventType: "ISSUANCE", eventDate: "2015-03-15", effectiveDate: "2015-03-15", shareClassId: "SC-001", shareClassName: "Common Stock", numberOfShares: 2000000, pricePerShare: 0.001, totalValue: 2000, currency: "USD", fromParty: null, toParty: "John Smith", resolutionId: "RES-F001", resolutionDate: "2015-03-15", approvalStatus: "APPROVED", approvedBy: "Board of Directors", approvedDate: "2015-03-15", documents: ["Stock Certificates"], notes: "Founder shares" },
  { id: "EE-003", entityId: "ENT-001", eventType: "ISSUANCE", eventDate: "2018-06-01", effectiveDate: "2018-06-01", shareClassId: "SC-002", shareClassName: "Series A Preferred", numberOfShares: 2000000, pricePerShare: 5, totalValue: 10000000, currency: "USD", fromParty: null, toParty: "Venture Partners III LP", resolutionId: "RES-2018-001", resolutionDate: "2018-05-28", approvalStatus: "APPROVED", approvedBy: "Board of Directors", approvedDate: "2018-05-30", documents: ["Series A Term Sheet", "Stock Purchase Agreement", "Investor Rights Agreement"], notes: "Series A financing round" },
  { id: "EE-004", entityId: "ENT-001", eventType: "ISSUANCE", eventDate: "2016-01-01", effectiveDate: "2016-01-01", shareClassId: "SC-003", shareClassName: "Stock Options Pool", numberOfShares: 1000000, pricePerShare: null, totalValue: 0, currency: "USD", fromParty: null, toParty: "Employee Stock Pool", resolutionId: "RES-2016-001", resolutionDate: "2016-01-01", approvalStatus: "APPROVED", approvedBy: "Board of Directors", approvedDate: "2016-01-01", documents: ["Stock Option Plan", "Board Resolution"], notes: "Employee stock option pool establishment" },
  { id: "EE-005", entityId: "ENT-002", eventType: "ISSUANCE", eventDate: "2017-08-22", effectiveDate: "2017-08-22", shareClassId: "SC-004", shareClassName: "Ordinary Shares", numberOfShares: 1000, pricePerShare: 1, totalValue: 1000, currency: "GBP", fromParty: null, toParty: "Acme Corp", resolutionId: null, resolutionDate: null, approvalStatus: "APPROVED", approvedBy: "Acme Corp Board", approvedDate: "2017-08-22", documents: ["Certificate of Incorporation", "Share Certificates"], notes: "Incorporation shares" },
  { id: "EE-006", entityId: "ENT-005", eventType: "CAPITAL_CONTRIBUTION", eventDate: "2022-06-15", effectiveDate: "2022-06-15", shareClassId: "SC-007", shareClassName: "Ordinary Shares", numberOfShares: 0, pricePerShare: null, totalValue: 5000000, currency: "SGD", fromParty: "Acme Corp", toParty: "Acme Singapore", resolutionId: "RES-2022-003", resolutionDate: "2022-06-10", approvalStatus: "APPROVED", approvedBy: "John Smith", approvedDate: "2022-06-12", documents: ["Capital Contribution Agreement", "Bank Transfer Confirmation"], notes: "Capital injection for APAC expansion" },
  { id: "EE-007", entityId: "ENT-005", eventType: "CAPITAL_CONTRIBUTION", eventDate: "2024-03-01", effectiveDate: "2024-03-01", shareClassId: "SC-007", shareClassName: "Ordinary Shares", numberOfShares: 0, pricePerShare: null, totalValue: 3000000, currency: "SGD", fromParty: "Acme Corp", toParty: "Acme Singapore", resolutionId: "RES-2024-001", resolutionDate: "2024-02-25", approvalStatus: "APPROVED", approvedBy: "Sarah Johnson", approvedDate: "2024-02-28", documents: ["Capital Contribution Agreement", "Board Resolution"], notes: "Additional funding for Japan operations" },
  { id: "EE-008", entityId: "ENT-008", eventType: "ISSUANCE", eventDate: "2021-01-12", effectiveDate: "2021-01-12", shareClassId: "SC-009", shareClassName: "Ordinary Shares", numberOfShares: 25000, pricePerShare: 1, totalValue: 25000, currency: "EUR", fromParty: null, toParty: "Acme Holdings UK", resolutionId: null, resolutionDate: null, approvalStatus: "APPROVED", approvedBy: "Emma Watson", approvedDate: "2021-01-12", documents: ["Notarial Deed", "Commercial Register Entry"], notes: "GmbH formation" },
];

const dividends: Dividend[] = [
  { id: "DIV-001", entityId: "ENT-005", dividendType: "CASH", status: "PAID", declarationDate: "2025-03-15", recordDate: "2025-03-31", paymentDate: "2025-04-15", amountPerShare: 0.50, totalAmount: 500000, currency: "SGD", shareClassId: "SC-007", shareClassName: "Ordinary Shares", fiscalYear: "2024", fiscalPeriod: "FY", resolutionId: "RES-2025-002", approvedBy: "Wei Lin", approvedDate: "2025-03-15", paidDate: "2025-04-15", paidBy: "Treasury", isIntercompany: true, recipientEntityId: "ENT-001", witholdingTaxRate: 0, witholdingTaxAmount: 0, netAmount: 500000, notes: "Annual dividend distribution to parent" },
  { id: "DIV-002", entityId: "ENT-002", dividendType: "CASH", status: "PAID", declarationDate: "2025-06-01", recordDate: "2025-06-15", paymentDate: "2025-06-30", amountPerShare: 100, totalAmount: 100000, currency: "GBP", shareClassId: "SC-004", shareClassName: "Ordinary Shares", fiscalYear: "2024", fiscalPeriod: "FY", resolutionId: "RES-2025-003", approvedBy: "Emma Watson", approvedDate: "2025-06-01", paidDate: "2025-06-30", paidBy: "Treasury", isIntercompany: true, recipientEntityId: "ENT-001", witholdingTaxRate: 0, witholdingTaxAmount: 0, netAmount: 100000, notes: "UK dividend repatriation" },
  { id: "DIV-003", entityId: "ENT-003", dividendType: "CASH", status: "APPROVED", declarationDate: "2025-12-15", recordDate: "2025-12-31", paymentDate: "2026-01-31", amountPerShare: 500, totalAmount: 50000, currency: "EUR", shareClassId: "SC-005", shareClassName: "Ordinary Shares", fiscalYear: "2025", fiscalPeriod: "FY", resolutionId: "RES-2025-008", approvedBy: "Siobhan O'Brien", approvedDate: "2025-12-15", paidDate: null, paidBy: null, isIntercompany: true, recipientEntityId: "ENT-002", witholdingTaxRate: 25, witholdingTaxAmount: 12500, netAmount: 37500, notes: "Irish dividend with WHT" },
  { id: "DIV-004", entityId: "ENT-006", dividendType: "CASH", status: "DECLARED", declarationDate: "2026-01-10", recordDate: "2026-01-31", paymentDate: "2026-02-28", amountPerShare: 10, totalAmount: 100000, currency: "HKD", shareClassId: "SC-008", shareClassName: "Ordinary Shares", fiscalYear: "2025", fiscalPeriod: "FY", resolutionId: "RES-2026-001", approvedBy: "Tony Chan", approvedDate: "2026-01-10", paidDate: null, paidBy: null, isIntercompany: true, recipientEntityId: "ENT-005", witholdingTaxRate: 0, witholdingTaxAmount: 0, netAmount: 100000, notes: "HK dividend to Singapore holding" },
  { id: "DIV-005", entityId: "ENT-001", dividendType: "CASH", status: "PROPOSED", declarationDate: "2026-02-01", recordDate: "2026-03-15", paymentDate: "2026-03-31", amountPerShare: 0.10, totalAmount: 900000, currency: "USD", shareClassId: "SC-001", shareClassName: "Common Stock", fiscalYear: "2025", fiscalPeriod: "FY", resolutionId: null, approvedBy: null, approvedDate: null, paidDate: null, paidBy: null, isIntercompany: false, recipientEntityId: null, witholdingTaxRate: null, witholdingTaxAmount: null, netAmount: 900000, notes: "Proposed annual dividend pending board approval" },
];

// ================================
// Startup Equity Sample Data
// ================================

const fundingRounds: FundingRound[] = [
  { id: "FR-001", entityId: "ENT-001", roundType: "SEED", roundName: "Seed Round", status: "CLOSED", targetAmount: 2000000, raisedAmount: 2500000, currency: "USD", preMoneyValuation: 8000000, postMoneyValuation: 10500000, pricePerShare: 1.05, shareClass: "Preferred A", openDate: "2022-03-01", closeDate: "2022-05-15", leadInvestor: "Sequoia Capital", boardSeatsOffered: 1, proRataRights: true, antiDilutionProvision: "BROAD_BASED", liquidationPreference: 1, participatingPreferred: false, notes: "Initial institutional round" },
  { id: "FR-002", entityId: "ENT-001", roundType: "SERIES_A", roundName: "Series A", status: "CLOSED", targetAmount: 10000000, raisedAmount: 12000000, currency: "USD", preMoneyValuation: 40000000, postMoneyValuation: 52000000, pricePerShare: 4.80, shareClass: "Preferred B", openDate: "2023-06-01", closeDate: "2023-08-20", leadInvestor: "Andreessen Horowitz", boardSeatsOffered: 1, proRataRights: true, antiDilutionProvision: "BROAD_BASED", liquidationPreference: 1, participatingPreferred: false, notes: "Growth round for product expansion" },
  { id: "FR-003", entityId: "ENT-001", roundType: "SERIES_B", roundName: "Series B", status: "CLOSING", targetAmount: 30000000, raisedAmount: 25000000, currency: "USD", preMoneyValuation: 150000000, postMoneyValuation: 180000000, pricePerShare: 15.00, shareClass: "Preferred C", openDate: "2025-09-01", closeDate: null, leadInvestor: "Tiger Global", boardSeatsOffered: 1, proRataRights: true, antiDilutionProvision: "BROAD_BASED", liquidationPreference: 1, participatingPreferred: false, notes: "International expansion round" },
  { id: "FR-004", entityId: "ENT-007", roundType: "PRE_SEED", roundName: "Pre-Seed", status: "CLOSED", targetAmount: 500000, raisedAmount: 600000, currency: "USD", preMoneyValuation: 2000000, postMoneyValuation: 2600000, pricePerShare: 0.26, shareClass: "Preferred A", openDate: "2024-01-15", closeDate: "2024-03-01", leadInvestor: "Y Combinator", boardSeatsOffered: 0, proRataRights: true, antiDilutionProvision: "NONE", liquidationPreference: 1, participatingPreferred: false, notes: "YC batch W24" },
  { id: "FR-005", entityId: "ENT-007", roundType: "SEED", roundName: "Seed Round", status: "OPEN", targetAmount: 3000000, raisedAmount: 1800000, currency: "USD", preMoneyValuation: 12000000, postMoneyValuation: 15000000, pricePerShare: 1.50, shareClass: "Preferred B", openDate: "2025-11-01", closeDate: null, leadInvestor: null, boardSeatsOffered: 1, proRataRights: true, antiDilutionProvision: "BROAD_BASED", liquidationPreference: 1, participatingPreferred: false, notes: "Post-YC seed extension" },
];

const fundingRoundInvestors: FundingRoundInvestor[] = [
  { id: "FRI-001", roundId: "FR-001", investorName: "Sequoia Capital", investorType: "VC", investmentAmount: 1500000, sharesIssued: 1428571, ownershipPercentage: 14.3, boardSeat: true, proRataRights: true, investmentDate: "2022-05-15", isLead: true },
  { id: "FRI-002", roundId: "FR-001", investorName: "First Round Capital", investorType: "VC", investmentAmount: 500000, sharesIssued: 476190, ownershipPercentage: 4.8, boardSeat: false, proRataRights: true, investmentDate: "2022-05-15", isLead: false },
  { id: "FRI-003", roundId: "FR-001", investorName: "Jason Calacanis", investorType: "ANGEL", investmentAmount: 250000, sharesIssued: 238095, ownershipPercentage: 2.4, boardSeat: false, proRataRights: false, investmentDate: "2022-04-20", isLead: false },
  { id: "FRI-004", roundId: "FR-001", investorName: "Naval Ravikant", investorType: "ANGEL", investmentAmount: 250000, sharesIssued: 238095, ownershipPercentage: 2.4, boardSeat: false, proRataRights: false, investmentDate: "2022-04-25", isLead: false },
  { id: "FRI-005", roundId: "FR-002", investorName: "Andreessen Horowitz", investorType: "VC", investmentAmount: 8000000, sharesIssued: 1666667, ownershipPercentage: 15.4, boardSeat: true, proRataRights: true, investmentDate: "2023-08-20", isLead: true },
  { id: "FRI-006", roundId: "FR-002", investorName: "Sequoia Capital", investorType: "VC", investmentAmount: 2000000, sharesIssued: 416667, ownershipPercentage: 3.8, boardSeat: false, proRataRights: true, investmentDate: "2023-08-20", isLead: false },
  { id: "FRI-007", roundId: "FR-002", investorName: "First Round Capital", investorType: "VC", investmentAmount: 1000000, sharesIssued: 208333, ownershipPercentage: 1.9, boardSeat: false, proRataRights: true, investmentDate: "2023-08-20", isLead: false },
  { id: "FRI-008", roundId: "FR-002", investorName: "Acme Ventures", investorType: "CORPORATE", investmentAmount: 1000000, sharesIssued: 208333, ownershipPercentage: 1.9, boardSeat: false, proRataRights: false, investmentDate: "2023-08-20", isLead: false },
  { id: "FRI-009", roundId: "FR-003", investorName: "Tiger Global", investorType: "VC", investmentAmount: 20000000, sharesIssued: 1333333, ownershipPercentage: 11.1, boardSeat: true, proRataRights: true, investmentDate: "2025-12-15", isLead: true },
  { id: "FRI-010", roundId: "FR-003", investorName: "Coatue Management", investorType: "VC", investmentAmount: 5000000, sharesIssued: 333333, ownershipPercentage: 2.8, boardSeat: false, proRataRights: true, investmentDate: "2025-12-20", isLead: false },
  { id: "FRI-011", roundId: "FR-004", investorName: "Y Combinator", investorType: "ACCELERATOR", investmentAmount: 500000, sharesIssued: 1923077, ownershipPercentage: 19.2, boardSeat: false, proRataRights: true, investmentDate: "2024-03-01", isLead: true },
  { id: "FRI-012", roundId: "FR-004", investorName: "Founder (Michael Chen)", investorType: "FOUNDER", investmentAmount: 100000, sharesIssued: 384615, ownershipPercentage: 3.8, boardSeat: false, proRataRights: false, investmentDate: "2024-01-15", isLead: false },
  { id: "FRI-013", roundId: "FR-005", investorName: "General Catalyst", investorType: "VC", investmentAmount: 1000000, sharesIssued: 666667, ownershipPercentage: 6.7, boardSeat: false, proRataRights: true, investmentDate: "2025-11-15", isLead: false },
  { id: "FRI-014", roundId: "FR-005", investorName: "Craft Ventures", investorType: "VC", investmentAmount: 500000, sharesIssued: 333333, ownershipPercentage: 3.3, boardSeat: false, proRataRights: true, investmentDate: "2025-12-01", isLead: false },
  { id: "FRI-015", roundId: "FR-005", investorName: "Sam Altman", investorType: "ANGEL", investmentAmount: 300000, sharesIssued: 200000, ownershipPercentage: 2.0, boardSeat: false, proRataRights: false, investmentDate: "2025-12-10", isLead: false },
];

const convertibleInstruments: ConvertibleInstrument[] = [
  { id: "CONV-001", entityId: "ENT-001", instrumentType: "SAFE", investorName: "TechStars", principalAmount: 150000, currency: "USD", issueDate: "2021-09-01", maturityDate: null, valuationCap: 5000000, discountRate: 20, interestRate: null, status: "CONVERTED", convertedToRoundId: "FR-001", convertedShares: 150000, convertedDate: "2022-05-15", mfnClause: true, proRataRights: false, notes: "Accelerator SAFE converted at seed" },
  { id: "CONV-002", entityId: "ENT-001", instrumentType: "SAFE", investorName: "Marc Benioff", principalAmount: 100000, currency: "USD", issueDate: "2021-11-15", maturityDate: null, valuationCap: 6000000, discountRate: 15, interestRate: null, status: "CONVERTED", convertedToRoundId: "FR-001", convertedShares: 85000, convertedDate: "2022-05-15", mfnClause: false, proRataRights: true, notes: "Angel SAFE with pro-rata rights" },
  { id: "CONV-003", entityId: "ENT-007", instrumentType: "SAFE", investorName: "Precursor Ventures", principalAmount: 200000, currency: "USD", issueDate: "2023-08-01", maturityDate: null, valuationCap: 8000000, discountRate: 20, interestRate: null, status: "CONVERTED", convertedToRoundId: "FR-004", convertedShares: 100000, convertedDate: "2024-03-01", mfnClause: true, proRataRights: true, notes: "Pre-YC SAFE" },
  { id: "CONV-004", entityId: "ENT-007", instrumentType: "SAFE", investorName: "K9 Ventures", principalAmount: 150000, currency: "USD", issueDate: "2025-06-15", maturityDate: null, valuationCap: 10000000, discountRate: 20, interestRate: null, status: "ACTIVE", convertedToRoundId: null, convertedShares: null, convertedDate: null, mfnClause: true, proRataRights: true, notes: "Bridge SAFE before seed extension" },
  { id: "CONV-005", entityId: "ENT-001", instrumentType: "CONVERTIBLE_NOTE", investorName: "Silicon Valley Bank", principalAmount: 500000, currency: "USD", issueDate: "2023-01-15", maturityDate: "2025-01-15", valuationCap: 35000000, discountRate: 20, interestRate: 5, status: "CONVERTED", convertedToRoundId: "FR-002", convertedShares: 130000, convertedDate: "2023-08-20", mfnClause: false, proRataRights: false, notes: "Venture debt note converted at Series A" },
  { id: "CONV-006", entityId: "ENT-007", instrumentType: "CONVERTIBLE_NOTE", investorName: "Lighter Capital", principalAmount: 250000, currency: "USD", issueDate: "2025-03-01", maturityDate: "2027-03-01", valuationCap: 15000000, discountRate: 15, interestRate: 8, status: "ACTIVE", convertedToRoundId: null, convertedShares: null, convertedDate: null, mfnClause: false, proRataRights: false, notes: "Revenue-based financing note" },
];

const optionPools: OptionPool[] = [
  { id: "POOL-001", entityId: "ENT-001", poolName: "2022 Equity Incentive Plan", authorizedShares: 2000000, issuedShares: 1450000, reservedShares: 350000, availableShares: 200000, shareClass: "Common Stock", createdDate: "2022-01-01", expirationDate: "2032-01-01", vestingScheduleDefault: "4 year with 1 year cliff", exercisePriceDefault: null },
  { id: "POOL-002", entityId: "ENT-001", poolName: "2024 Equity Incentive Plan", authorizedShares: 1500000, issuedShares: 320000, reservedShares: 180000, availableShares: 1000000, shareClass: "Common Stock", createdDate: "2024-01-01", expirationDate: "2034-01-01", vestingScheduleDefault: "4 year with 1 year cliff", exercisePriceDefault: 4.80 },
  { id: "POOL-003", entityId: "ENT-007", poolName: "2024 Stock Option Plan", authorizedShares: 1000000, issuedShares: 250000, reservedShares: 100000, availableShares: 650000, shareClass: "Common Stock", createdDate: "2024-02-01", expirationDate: "2034-02-01", vestingScheduleDefault: "4 year with 1 year cliff", exercisePriceDefault: 0.10 },
];

const optionGrants: OptionGrant[] = [
  { id: "OPT-001", entityId: "ENT-001", optionPoolId: "POOL-001", granteeName: "Sarah Johnson", granteeRole: "CEO", grantDate: "2022-02-01", sharesGranted: 500000, exercisePrice: 0.10, vestingStartDate: "2022-02-01", vestingSchedule: "4_YEAR_1_CLIFF", cliffMonths: 12, vestingMonths: 48, sharesVested: 500000, sharesExercised: 200000, sharesUnvested: 0, expirationDate: "2032-02-01", status: "FULLY_VESTED", exercisedDate: "2025-06-15", terminationDate: null, notes: "Founder grant" },
  { id: "OPT-002", entityId: "ENT-001", optionPoolId: "POOL-001", granteeName: "James Lee", granteeRole: "CTO", grantDate: "2022-02-01", sharesGranted: 400000, exercisePrice: 0.10, vestingStartDate: "2022-02-01", vestingSchedule: "4_YEAR_1_CLIFF", cliffMonths: 12, vestingMonths: 48, sharesVested: 400000, sharesExercised: 100000, sharesUnvested: 0, expirationDate: "2032-02-01", status: "FULLY_VESTED", exercisedDate: "2025-03-01", terminationDate: null, notes: "Founder grant" },
  { id: "OPT-003", entityId: "ENT-001", optionPoolId: "POOL-001", granteeName: "Emily Chen", granteeRole: "VP Engineering", grantDate: "2022-09-01", sharesGranted: 150000, exercisePrice: 1.05, vestingStartDate: "2022-09-01", vestingSchedule: "4_YEAR_1_CLIFF", cliffMonths: 12, vestingMonths: 48, sharesVested: 118750, sharesExercised: 0, sharesUnvested: 31250, expirationDate: "2032-09-01", status: "VESTING", exercisedDate: null, terminationDate: null, notes: "Post-seed hire" },
  { id: "OPT-004", entityId: "ENT-001", optionPoolId: "POOL-001", granteeName: "David Kim", granteeRole: "VP Sales", grantDate: "2023-03-15", sharesGranted: 120000, exercisePrice: 2.50, vestingStartDate: "2023-03-15", vestingSchedule: "4_YEAR_1_CLIFF", cliffMonths: 12, vestingMonths: 48, sharesVested: 70000, sharesExercised: 0, sharesUnvested: 50000, expirationDate: "2033-03-15", status: "VESTING", exercisedDate: null, terminationDate: null, notes: "Series A hire" },
  { id: "OPT-005", entityId: "ENT-001", optionPoolId: "POOL-001", granteeName: "Lisa Wang", granteeRole: "VP Marketing", grantDate: "2023-06-01", sharesGranted: 100000, exercisePrice: 2.50, vestingStartDate: "2023-06-01", vestingSchedule: "4_YEAR_1_CLIFF", cliffMonths: 12, vestingMonths: 48, sharesVested: 52083, sharesExercised: 0, sharesUnvested: 47917, expirationDate: "2033-06-01", status: "VESTING", exercisedDate: null, terminationDate: null, notes: "Series A hire" },
  { id: "OPT-006", entityId: "ENT-001", optionPoolId: "POOL-001", granteeName: "Alex Rodriguez", granteeRole: "Senior Engineer", grantDate: "2023-01-10", sharesGranted: 40000, exercisePrice: 1.50, vestingStartDate: "2023-01-10", vestingSchedule: "4_YEAR_1_CLIFF", cliffMonths: 12, vestingMonths: 48, sharesVested: 25000, sharesExercised: 0, sharesUnvested: 15000, expirationDate: "2033-01-10", status: "VESTING", exercisedDate: null, terminationDate: null, notes: null },
  { id: "OPT-007", entityId: "ENT-001", optionPoolId: "POOL-001", granteeName: "Maria Garcia", granteeRole: "Product Manager", grantDate: "2023-08-15", sharesGranted: 35000, exercisePrice: 4.80, vestingStartDate: "2023-08-15", vestingSchedule: "4_YEAR_1_CLIFF", cliffMonths: 12, vestingMonths: 48, sharesVested: 16042, sharesExercised: 0, sharesUnvested: 18958, expirationDate: "2033-08-15", status: "VESTING", exercisedDate: null, terminationDate: null, notes: "Post Series A hire" },
  { id: "OPT-008", entityId: "ENT-001", optionPoolId: "POOL-002", granteeName: "Chris Thompson", granteeRole: "CFO", grantDate: "2024-03-01", sharesGranted: 200000, exercisePrice: 4.80, vestingStartDate: "2024-03-01", vestingSchedule: "4_YEAR_1_CLIFF", cliffMonths: 12, vestingMonths: 48, sharesVested: 45833, sharesExercised: 0, sharesUnvested: 154167, expirationDate: "2034-03-01", status: "VESTING", exercisedDate: null, terminationDate: null, notes: "Executive hire pre-Series B" },
  { id: "OPT-009", entityId: "ENT-001", optionPoolId: "POOL-002", granteeName: "Rachel Brown", granteeRole: "Head of HR", grantDate: "2024-09-01", sharesGranted: 50000, exercisePrice: 8.00, vestingStartDate: "2024-09-01", vestingSchedule: "4_YEAR_1_CLIFF", cliffMonths: 12, vestingMonths: 48, sharesVested: 0, sharesExercised: 0, sharesUnvested: 50000, expirationDate: "2034-09-01", status: "GRANTED", exercisedDate: null, terminationDate: null, notes: "Pre-cliff" },
  { id: "OPT-010", entityId: "ENT-001", optionPoolId: "POOL-002", granteeName: "Tom Miller", granteeRole: "Lead Designer", grantDate: "2025-01-15", sharesGranted: 30000, exercisePrice: 10.00, vestingStartDate: "2025-01-15", vestingSchedule: "4_YEAR_1_CLIFF", cliffMonths: 12, vestingMonths: 48, sharesVested: 0, sharesExercised: 0, sharesUnvested: 30000, expirationDate: "2035-01-15", status: "GRANTED", exercisedDate: null, terminationDate: null, notes: "Series B prep hire" },
  { id: "OPT-011", entityId: "ENT-001", optionPoolId: "POOL-002", granteeName: "Kevin White", granteeRole: "Senior Engineer", grantDate: "2024-06-01", sharesGranted: 40000, exercisePrice: 5.50, vestingStartDate: "2024-06-01", vestingSchedule: "4_YEAR_1_CLIFF", cliffMonths: 12, vestingMonths: 48, sharesVested: 6667, sharesExercised: 0, sharesUnvested: 33333, expirationDate: "2034-06-01", status: "VESTING", exercisedDate: null, terminationDate: null, notes: null },
  { id: "OPT-012", entityId: "ENT-007", optionPoolId: "POOL-003", granteeName: "Michael Chen", granteeRole: "Founder/CEO", grantDate: "2024-02-15", sharesGranted: 150000, exercisePrice: 0.01, vestingStartDate: "2024-02-15", vestingSchedule: "4_YEAR_1_CLIFF", cliffMonths: 12, vestingMonths: 48, sharesVested: 37500, sharesExercised: 37500, sharesUnvested: 112500, expirationDate: "2034-02-15", status: "VESTING", exercisedDate: "2025-06-01", terminationDate: null, notes: "Founder options" },
  { id: "OPT-013", entityId: "ENT-007", optionPoolId: "POOL-003", granteeName: "Amy Lin", granteeRole: "Co-Founder/CTO", grantDate: "2024-02-15", sharesGranted: 100000, exercisePrice: 0.01, vestingStartDate: "2024-02-15", vestingSchedule: "4_YEAR_1_CLIFF", cliffMonths: 12, vestingMonths: 48, sharesVested: 25000, sharesExercised: 0, sharesUnvested: 75000, expirationDate: "2034-02-15", status: "VESTING", exercisedDate: null, terminationDate: null, notes: "Co-founder options" },
];

// ================================
// Equity Tracker Export Functions
// ================================

export function getShareholders(entityId?: string): Shareholder[] {
  if (entityId) {
    return shareholders.filter(s => s.entityId === entityId);
  }
  return shareholders;
}

export function getShareClasses(entityId?: string): ShareClassDefinition[] {
  if (entityId) {
    return shareClasses.filter(sc => sc.entityId === entityId);
  }
  return shareClasses;
}

export function getEquityEvents(entityId?: string): EquityEvent[] {
  if (entityId) {
    return equityEvents.filter(e => e.entityId === entityId);
  }
  return equityEvents.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
}

export function getDividends(entityId?: string): Dividend[] {
  if (entityId) {
    return dividends.filter(d => d.entityId === entityId);
  }
  return dividends.sort((a, b) => new Date(b.declarationDate).getTime() - new Date(a.declarationDate).getTime());
}

export function getEquityMetrics() {
  const totalAuthorizedShares = shareClasses.reduce((sum, sc) => sum + sc.authorizedShares, 0);
  const totalIssuedShares = shareClasses.reduce((sum, sc) => sum + sc.issuedShares, 0);
  const totalDividendsPaid = dividends.filter(d => d.status === "PAID").reduce((sum, d) => sum + d.totalAmount, 0);
  const pendingDividends = dividends.filter(d => d.status === "DECLARED" || d.status === "APPROVED");
  const recentEquityEvents = equityEvents.slice(0, 5);
  
  return {
    totalAuthorizedShares,
    totalIssuedShares,
    utilizationRate: Math.round((totalIssuedShares / totalAuthorizedShares) * 100),
    totalShareholders: shareholders.length,
    totalShareClasses: shareClasses.length,
    totalDividendsPaid,
    pendingDividendsCount: pendingDividends.length,
    pendingDividendsTotal: pendingDividends.reduce((sum, d) => sum + d.totalAmount, 0),
    recentEquityEvents,
    entitiesWithEquity: new Set(shareClasses.map(sc => sc.entityId)).size,
  };
}

export function getCapTableSummary(entityId: string) {
  const entityShareClasses = shareClasses.filter(sc => sc.entityId === entityId);
  const entityShareholders = shareholders.filter(s => s.entityId === entityId);
  
  const totalAuthorized = entityShareClasses.reduce((sum, sc) => sum + sc.authorizedShares, 0);
  const totalIssued = entityShareClasses.reduce((sum, sc) => sum + sc.issuedShares, 0);
  
  return {
    shareClasses: entityShareClasses,
    shareholders: entityShareholders,
    totalAuthorizedShares: totalAuthorized,
    totalIssuedShares: totalIssued,
    availableShares: totalAuthorized - totalIssued,
    utilizationRate: totalAuthorized > 0 ? Math.round((totalIssued / totalAuthorized) * 100) : 0,
  };
}

// ================================
// Startup Equity Export Functions
// ================================

export function getFundingRounds(entityId?: string): FundingRound[] {
  if (entityId) {
    return fundingRounds.filter(fr => fr.entityId === entityId);
  }
  return fundingRounds.sort((a, b) => new Date(b.openDate).getTime() - new Date(a.openDate).getTime());
}

export function getFundingRoundInvestors(roundId?: string): FundingRoundInvestor[] {
  if (roundId) {
    return fundingRoundInvestors.filter(fri => fri.roundId === roundId);
  }
  return fundingRoundInvestors;
}

export function getConvertibleInstruments(entityId?: string): ConvertibleInstrument[] {
  if (entityId) {
    return convertibleInstruments.filter(ci => ci.entityId === entityId);
  }
  return convertibleInstruments.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
}

export function getOptionPools(entityId?: string): OptionPool[] {
  if (entityId) {
    return optionPools.filter(op => op.entityId === entityId);
  }
  return optionPools;
}

export function getOptionGrants(entityId?: string, poolId?: string): OptionGrant[] {
  let grants = optionGrants;
  if (entityId) {
    grants = grants.filter(og => og.entityId === entityId);
  }
  if (poolId) {
    grants = grants.filter(og => og.optionPoolId === poolId);
  }
  return grants.sort((a, b) => new Date(b.grantDate).getTime() - new Date(a.grantDate).getTime());
}

export function getStartupEquityMetrics(entityId?: string) {
  const relevantRounds = entityId ? fundingRounds.filter(fr => fr.entityId === entityId) : fundingRounds;
  const relevantConvertibles = entityId ? convertibleInstruments.filter(ci => ci.entityId === entityId) : convertibleInstruments;
  const relevantPools = entityId ? optionPools.filter(op => op.entityId === entityId) : optionPools;
  const relevantGrants = entityId ? optionGrants.filter(og => og.entityId === entityId) : optionGrants;

  const totalRaised = relevantRounds.filter(fr => fr.status === "CLOSED").reduce((sum, fr) => sum + fr.raisedAmount, 0);
  const activeRounds = relevantRounds.filter(fr => fr.status === "OPEN" || fr.status === "CLOSING");
  const latestValuation = relevantRounds.filter(fr => fr.status === "CLOSED").sort((a, b) => new Date(b.closeDate || b.openDate).getTime() - new Date(a.closeDate || a.openDate).getTime())[0]?.postMoneyValuation || 0;

  const activeConvertibles = relevantConvertibles.filter(ci => ci.status === "ACTIVE");
  const totalConvertiblePrincipal = activeConvertibles.reduce((sum, ci) => sum + ci.principalAmount, 0);

  const totalOptionsAuthorized = relevantPools.reduce((sum, op) => sum + op.authorizedShares, 0);
  const totalOptionsIssued = relevantPools.reduce((sum, op) => sum + op.issuedShares, 0);
  const totalOptionsAvailable = relevantPools.reduce((sum, op) => sum + op.availableShares, 0);
  
  const totalVestedOptions = relevantGrants.reduce((sum, og) => sum + og.sharesVested, 0);
  const totalExercisedOptions = relevantGrants.reduce((sum, og) => sum + og.sharesExercised, 0);
  const totalUnvestedOptions = relevantGrants.reduce((sum, og) => sum + og.sharesUnvested, 0);

  return {
    totalRaised,
    activeRoundsCount: activeRounds.length,
    latestValuation,
    totalFundingRounds: relevantRounds.length,
    closedRounds: relevantRounds.filter(fr => fr.status === "CLOSED").length,
    activeConvertiblesCount: activeConvertibles.length,
    totalConvertiblePrincipal,
    totalOptionsAuthorized,
    totalOptionsIssued,
    totalOptionsAvailable,
    optionPoolUtilization: totalOptionsAuthorized > 0 ? Math.round((totalOptionsIssued / totalOptionsAuthorized) * 100) : 0,
    totalVestedOptions,
    totalExercisedOptions,
    totalUnvestedOptions,
    activeGrantees: new Set(relevantGrants.filter(og => og.status !== "CANCELLED" && og.status !== "EXPIRED").map(og => og.granteeName)).size,
  };
}
