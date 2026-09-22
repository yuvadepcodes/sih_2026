export type ImageQualityAssessment = 'CLEAR' | 'BLURRY' | 'PARTIALLY_OBSCURED';

export interface AuditMetadata {
  source_type: string;
  image_quality_assessment: ImageQualityAssessment;
}

export interface ManufacturerOrPackerDeclaration {
  found: boolean;
  raw_text: string | null;
  qualifying_prefix: string | null;
  entity_name: string | null;
  full_address: string | null;
}

export interface CountryOfOriginDeclaration {
  found: boolean;
  raw_text: string | null;
  country_name: string | null;
}

export interface CommonOrGenericNameDeclaration {
  found: boolean;
  raw_text: string | null;
}

export interface NetQuantityDeclaration {
  found: boolean;
  raw_text: string | null;
  numeric_value: number | null;
  declared_unit: string | null;
  is_standard_si_unit: boolean;
}

export interface MrpDeclaration {
  found: boolean;
  raw_text: string | null;
  currency_symbol: '₹' | 'Rs' | 'Rs.' | string | null;
  numeric_amount: number | null;
  has_tax_inclusive_clause: boolean;
  raw_tax_clause_text: string | null;
}

export interface UnitSalePriceDeclaration {
  found: boolean;
  raw_text: string | null;
  declared_unit_price: number | null;
  declared_base_unit: string | null;
}

export interface DateOfManufactureOrPackDeclaration {
  found: boolean;
  raw_text: string | null;
  parsed_month_year: string | null;
}

export interface ExpiryOrBestBeforeDeclaration {
  found: boolean;
  raw_text: string | null;
}

export interface ConsumerCareDetailsDeclaration {
  found: boolean;
  raw_text: string | null;
  has_contact_person_or_office: boolean;
  has_postal_address: boolean;
  has_phone_number: boolean;
  has_email_address: boolean;
  extracted_phone: string | null;
  extracted_email: string | null;
}

export interface FontReadabilityAnalysis {
  estimated_numeral_height_mm: number | null;
  minimum_required_height_mm: number;
  is_font_height_compliant: boolean;
  contrast_evaluation: 'HIGH' | 'ADEQUATE' | 'POOR';
  readability_score: number; // 0 - 100
  conspicuous_placement_compliant: boolean;
  observations: string;
}

export interface MisleadingPackagingCheck {
  is_misleading: boolean;
  has_deceptive_stickers: boolean;
  findings: string[];
}

export interface LegalMetrologyDeclarations {
  manufacturer_or_packer: ManufacturerOrPackerDeclaration;
  country_of_origin: CountryOfOriginDeclaration;
  common_or_generic_name: CommonOrGenericNameDeclaration;
  net_quantity: NetQuantityDeclaration;
  mrp: MrpDeclaration;
  unit_sale_price: UnitSalePriceDeclaration;
  date_of_manufacture_or_pack: DateOfManufactureOrPackDeclaration;
  expiry_or_best_before: ExpiryOrBestBeforeDeclaration;
  consumer_care_details: ConsumerCareDetailsDeclaration;
}

export interface LegalMetrologyAuditReport {
  audit_metadata: AuditMetadata;
  declarations: LegalMetrologyDeclarations;
  detected_languages: string[];
  font_readability?: FontReadabilityAnalysis;
  misleading_packaging?: MisleadingPackagingCheck;
}

export interface StatutoryRuleCheck {
  id: string;
  ruleCitation: string;
  ruleTitle: string;
  description: string;
  status: 'COMPLIANT' | 'VIOLATION' | 'WARNING' | 'NOT_APPLICABLE';
  finding: string;
  statutoryPenaltyNotice?: string;
  legalActSection?: string;
}

export interface EvidentiaryMetadata {
  inspectionId: string; // e.g. LM-2026-DL-0941
  timestamp: string; // ISO String
  formattedDateTimeIST: string;
  gpsCoordinates: {
    latitude: number;
    longitude: number;
    accuracyMeters: number;
    districtZone: string;
  } | null;
  deviceId: string; // Inspector Terminal ID e.g. LM-TAB-DL-402
  imageHashes: { [imageIndex: number]: string }; // SHA-256 hash per photo
  chainOfCustodyVerified: boolean;
  syncedToNationalRegister: boolean;
}

export type OfficerRole = 'INSPECTOR' | 'ADJUDICATING_OFFICER' | 'DIRECTOR';

export type JanVishwasOffenseTier = 'FIRST_OFFENSE' | 'SECOND_OFFENSE' | 'REPEAT_OFFENSE';

export interface JanVishwasPenaltyCalculation {
  tier: JanVishwasOffenseTier;
  violationCount: number;
  statutoryNoticeType: 'IMPROVEMENT_NOTICE_SEC_36_1' | 'COMPOUNDED_CIVIL_PENALTY' | 'PROSECUTION_REFERRAL';
  prescribedPenaltyInr: number;
  complianceWindowDays: number;
  statutoryClause: string;
  isJanVishwasDecriminalized: boolean;
  notes: string;
}

export interface ManufacturerRecidivismProfile {
  id: string;
  entityName: string;
  registrationNumber: string;
  state: string;
  totalInspections: number;
  totalViolations: number;
  riskRating: 'LOW' | 'MEDIUM' | 'CRITICAL_REPEAT_OFFENDER';
  lastInspectionDate: string;
  activeNotices: number;
  compoundedFeesPaidInr: number;
  violationHistory: {
    inspectionId: string;
    date: string;
    productName: string;
    violations: string[];
    actionTaken: string;
    penaltyInr: number;
    status: 'RESOLVED' | 'PENDING_REPLY' | 'HEARING_SCHEDULED' | 'ESCALATED';
  }[];
}

export interface OfflineInspectionDraft {
  id: string;
  inspectionId: string;
  createdAt: string;
  premiseName: string;
  commodityName: string;
  images: string[];
  evidence: EvidentiaryMetadata;
  auditReport?: LegalMetrologyAuditReport;
  summaryStatus?: 'COMPLIANT' | 'NON_COMPLIANT';
  violationsCount?: number;
  isSynced: boolean;
}

export interface GigwAccessibilitySettings {
  fontSizeLevel: 'normal' | 'large' | 'larger'; // 100%, 110%, 120%
  highContrast: boolean;
  language: 'en' | 'hi';
}

export interface SamplePackagingItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  badgeType: 'success' | 'danger' | 'warning';
  description: string;
  imageSrc: string;
  expectedResult: LegalMetrologyAuditReport;
}
