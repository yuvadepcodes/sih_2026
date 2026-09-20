import { LegalMetrologyAuditReport, StatutoryRuleCheck } from '../types';

export interface InspectionSummary {
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL_REVIEW';
  complianceScore: number; // 0 - 100
  totalViolations: number;
  totalWarnings: number;
  ruleChecks: StatutoryRuleCheck[];
  statutoryPenaltyEstimate: string;
  inspectorVerdict: string;
}

export const VALID_SI_UNITS = ['g', 'kg', 'ml', 'L', 'l', 'cm', 'm', 'cm²', 'm²', 'N', 'U'];
export const FORBIDDEN_UNIT_SYMBOLS = ['gms', 'gm', 'kilo', 'ltrs', 'ltr', 'nos', 'pcs', 'ml.', 'g.'];

export function evaluateLegalMetrologyCompliance(
  report: LegalMetrologyAuditReport
): InspectionSummary {
  const d = report.declarations;
  const checks: StatutoryRuleCheck[] = [];

  // =========================================================================
  // 1. MANUFACTURER / PACKER / IMPORTER DETAILS (Rule 6(1)(a) & Explanations)
  // =========================================================================
  if (!d.manufacturer_or_packer.found) {
    checks.push({
      id: 'rule-6-1-a',
      ruleCitation: 'Rule 6(1)(a), LM(PC) Rules, 2011',
      ruleTitle: '1. Manufacturer / Packer / Importer Identity & Address',
      description: 'Must declare complete name and physical address of Manufacturer, Packer, or Importer.',
      status: 'VIOLATION',
      finding: 'Manufacturer or packer declaration was not detected on the packaging.',
      legalActSection: 'Section 36(1), Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Fine up to ₹25,000 for first offence under Section 36(1).'
    });
  } else if (!d.manufacturer_or_packer.qualifying_prefix) {
    checks.push({
      id: 'rule-6-1-a-prefix',
      ruleCitation: 'Rule 6(1)(a) & Explanations I/II, LM(PC) Rules, 2011',
      ruleTitle: '1. Statutory Qualifying Prefix Mandate',
      description: 'Must be explicitly qualified by accepted prefixes: "Mfg by", "Manufactured by", "Packed by", "Pre-packed by", "Imported by", or "Mkt by" / "Marketed by".',
      status: 'VIOLATION',
      finding: `Entity found ("${d.manufacturer_or_packer.entity_name || 'Declared'}") but corporate name is printed without mandatory qualifying prefix ("Mfg by", "Packed by", etc.).`,
      legalActSection: 'Rule 6(1)(a) Explanations I & II',
      statutoryPenaltyNotice: 'Non-compliant under Rule 6(1)(a); notice for lack of statutory attribution.'
    });
  } else if (!d.manufacturer_or_packer.full_address) {
    checks.push({
      id: 'rule-6-1-a-address',
      ruleCitation: 'Rule 6(1)(a), LM(PC) Rules, 2011',
      ruleTitle: '1. Complete Physical Address Mandate',
      description: 'The complete physical address of the manufacturer/packer/importer is mandatory.',
      status: 'VIOLATION',
      finding: `Entity name detected (${d.manufacturer_or_packer.entity_name || 'Declared'}), but complete physical postal address is absent or incomplete.`,
      legalActSection: 'Section 36(1), Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Actionable defect under Section 36(1); physical address is strictly non-negotiable.'
    });
  } else {
    checks.push({
      id: 'rule-6-1-a',
      ruleCitation: 'Rule 6(1)(a), LM(PC) Rules, 2011',
      ruleTitle: '1. Manufacturer / Packer / Importer Identity & Address',
      description: 'Name and complete address of manufacturer/packer.',
      status: 'COMPLIANT',
      finding: `Properly declared with statutory prefix "${d.manufacturer_or_packer.qualifying_prefix}": ${d.manufacturer_or_packer.entity_name} (${d.manufacturer_or_packer.full_address}).`,
    });
  }

  // =========================================================================
  // 2. COUNTRY OF ORIGIN (Rule 6(1)(aa))
  // =========================================================================
  if (!d.country_of_origin.found || !d.country_of_origin.country_name) {
    checks.push({
      id: 'rule-6-1-aa',
      ruleCitation: 'Rule 6(1)(aa), LM(PC) Rules, 2011',
      ruleTitle: '2. Country of Origin Declaration',
      description: 'Mandatory declaration stating "Country of Origin: [Country]", "Made in [Country]", or "Manufactured in [Country]".',
      status: 'VIOLATION',
      finding: 'Country of origin is missing or ambiguous on the package/listing.',
      legalActSection: 'Section 36(1), Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Mandatory disclosure breach. Compounding penalty or fine up to ₹25,000 under Section 36.'
    });
  } else {
    const rawOrigin = (d.country_of_origin.raw_text || '').toLowerCase();
    const isAmbiguous = rawOrigin.includes('designed in') && !rawOrigin.includes('made in') && !rawOrigin.includes('origin');

    if (isAmbiguous) {
      checks.push({
        id: 'rule-6-1-aa',
        ruleCitation: 'Rule 6(1)(aa), LM(PC) Rules, 2011',
        ruleTitle: '2. Country of Origin Syntax Validity',
        description: 'Must explicitly state origin country. Ambiguous statements like "Designed in USA" alone violate Rule 6(1)(aa).',
        status: 'VIOLATION',
        finding: `Ambiguous origin declaration: "${d.country_of_origin.raw_text}". Lacks explicit "Made in" / "Country of Origin" syntax.`,
        legalActSection: 'Rule 6(1)(aa), LM(PC) Rules, 2011',
        statutoryPenaltyNotice: 'Notice to rectify deceptive origin claim under Section 36.'
      });
    } else {
      checks.push({
        id: 'rule-6-1-aa',
        ruleCitation: 'Rule 6(1)(aa), LM(PC) Rules, 2011',
        ruleTitle: '2. Country of Origin Declaration',
        description: 'Mandatory country of origin disclosure.',
        status: 'COMPLIANT',
        finding: `Explicitly declared as "${d.country_of_origin.country_name}" (Raw text: "${d.country_of_origin.raw_text}").`,
      });
    }
  }

  // =========================================================================
  // 3. COMMON OR GENERIC PRODUCT NAME (Rule 6(1)(b))
  // =========================================================================
  if (!d.common_or_generic_name.found || !d.common_or_generic_name.raw_text) {
    checks.push({
      id: 'rule-6-1-b',
      ruleCitation: 'Rule 6(1)(b), LM(PC) Rules, 2011',
      ruleTitle: '3. Common or Generic Product Name',
      description: 'Clear generic name of the commodity must be visible; brand names alone are non-compliant.',
      status: 'VIOLATION',
      finding: 'Generic or common name of the pre-packaged commodity is missing.',
      legalActSection: 'Section 36(1), Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Actionable defect under Section 36(1).'
    });
  } else {
    checks.push({
      id: 'rule-6-1-b',
      ruleCitation: 'Rule 6(1)(b), LM(PC) Rules, 2011',
      ruleTitle: '3. Common or Generic Product Name',
      description: 'Common or generic name of commodity.',
      status: 'COMPLIANT',
      finding: `Generic name declared as "${d.common_or_generic_name.raw_text}".`,
    });
  }

  // =========================================================================
  // 4. NET QUANTITY & STANDARD SI UNITS (Rule 6(1)(c) & Rule 12)
  // =========================================================================
  if (!d.net_quantity.found) {
    checks.push({
      id: 'rule-6-1-c',
      ruleCitation: 'Rule 6(1)(c) & Rule 12, LM(PC) Rules, 2011',
      ruleTitle: '4. Net Quantity & Standard SI Units',
      description: 'Net quantity must be declared using ONLY standard SI metric symbols ("g", "kg", "ml", "L", "cm", "m", "N", "U").',
      status: 'VIOLATION',
      finding: 'Net quantity declaration was not found on the package.',
      legalActSection: 'Section 18 & Section 36(1), Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Strict liability offence. Fine up to ₹25,000 for omission of net quantity.'
    });
  } else {
    const rawUnit = (d.net_quantity.declared_unit || '').trim();
    const rawText = (d.net_quantity.raw_text || '').toLowerCase();
    
    // Check for forbidden abbreviations (e.g., "gms", "gm", "kilo", "ltrs", "nos", "pcs")
    const hasForbiddenUnit = FORBIDDEN_UNIT_SYMBOLS.some(u => 
      rawUnit.toLowerCase() === u || new RegExp(`\\b${u}\\b`, 'i').test(rawText)
    );

    const isSI = !hasForbiddenUnit && (d.net_quantity.is_standard_si_unit || VALID_SI_UNITS.includes(rawUnit));

    if (!isSI || hasForbiddenUnit) {
      checks.push({
        id: 'rule-6-1-c-si',
        ruleCitation: 'Rule 6(1)(c) & Rule 12, LM(PC) Rules, 2011',
        ruleTitle: '4. Standard SI Units Strict Compliance',
        description: 'Net quantity symbols must strictly be "g", "kg", "ml", "L", "l", "cm", "m", "N", or "U". Non-standard symbols ("gms", "gm", "kilo", "ltrs", "nos", "pcs") are strictly prohibited statutory violations.',
        status: 'VIOLATION',
        finding: `Non-standard unit abbreviation detected: "${rawUnit || d.net_quantity.raw_text}". The law strictly forbids symbols like "gms", "gm", "kilo", or "ltrs".`,
        legalActSection: 'Section 36(1) in conjunction with Rule 6(1)(c) & Rule 12',
        statutoryPenaltyNotice: 'Strict liability non-compliance. Compounding penalty or fine up to ₹25,000.'
      });
    } else {
      checks.push({
        id: 'rule-6-1-c',
        ruleCitation: 'Rule 6(1)(c) & Rule 12, LM(PC) Rules, 2011',
        ruleTitle: '4. Net Quantity & Standard SI Units',
        description: 'Standard unit of weight/measure.',
        status: 'COMPLIANT',
        finding: `Compliant net quantity: ${d.net_quantity.numeric_value ?? ''} ${rawUnit} (Raw: "${d.net_quantity.raw_text}"). Uses approved SI metric symbol.`,
      });
    }
  }

  // =========================================================================
  // 5. MAXIMUM RETAIL PRICE (MRP) & TAX CLAUSE (Rule 6(1)(e) & Rule 2(m))
  // =========================================================================
  if (!d.mrp.found) {
    checks.push({
      id: 'rule-6-1-e',
      ruleCitation: 'Rule 6(1)(e) & Rule 2(m), LM(PC) Rules, 2011',
      ruleTitle: '5. Maximum Retail Price (MRP) & Tax Clause',
      description: 'Price must be declared in Indian Rupees (₹ or Rs.) and explicitly state the tax-inclusive clause.',
      status: 'VIOLATION',
      finding: 'Maximum Retail Price (MRP) declaration is missing.',
      legalActSection: 'Section 36(1), Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Severe statutory defect under Section 36(1).'
    });
  } else if (!d.mrp.has_tax_inclusive_clause) {
    checks.push({
      id: 'rule-6-1-e-tax',
      ruleCitation: 'Rule 6(1)(e) & Rule 2(m), LM(PC) Rules, 2011',
      ruleTitle: '5. Mandatory "Inclusive of all taxes" Clause',
      description: 'Approved Formats: "MRP ₹ xx.xx (incl. of all taxes)" or "Max. Retail Price Rs. xx.xx inclusive of all taxes". Omission of tax clause is a direct statutory breach.',
      status: 'VIOLATION',
      finding: `MRP declared (${d.mrp.currency_symbol || '₹'}${d.mrp.numeric_amount ?? ''}) but omitted the mandatory statutory clause "inclusive of all taxes" or "incl. of all taxes".`,
      legalActSection: 'Rule 6(1)(e), LM(PC) Rules, 2011',
      statutoryPenaltyNotice: 'Prosecution notice for misleading retail pricing under Section 36(1).'
    });
  } else {
    checks.push({
      id: 'rule-6-1-e',
      ruleCitation: 'Rule 6(1)(e) & Rule 2(m), LM(PC) Rules, 2011',
      ruleTitle: '5. Maximum Retail Price (MRP) & Tax Clause',
      description: 'MRP inclusive of all taxes.',
      status: 'COMPLIANT',
      finding: `Compliant MRP: ${d.mrp.currency_symbol || '₹'}${d.mrp.numeric_amount ?? ''} with approved tax clause ("${d.mrp.raw_tax_clause_text || 'incl. of all taxes'}").`,
    });
  }

  // =========================================================================
  // 6. MONTH AND YEAR OF MANUFACTURE / PACKING (Rule 6(1)(d))
  // =========================================================================
  if (!d.date_of_manufacture_or_pack.found) {
    checks.push({
      id: 'rule-6-1-d',
      ruleCitation: 'Rule 6(1)(d), LM(PC) Rules, 2011',
      ruleTitle: '6. Month and Year of Manufacture / Packing',
      description: 'Must state the month and year in standard syntax ("MM/YYYY", "MM-YYYY", or "Month YYYY").',
      status: 'VIOLATION',
      finding: 'Month and year of manufacture or packing not found on the packaging.',
      legalActSection: 'Section 36(1), Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Violation under Rule 6(1)(d).'
    });
  } else {
    checks.push({
      id: 'rule-6-1-d',
      ruleCitation: 'Rule 6(1)(d), LM(PC) Rules, 2011',
      ruleTitle: '6. Month and Year of Manufacture / Packing',
      description: 'Month and year of packaging.',
      status: 'COMPLIANT',
      finding: `Declared as "${d.date_of_manufacture_or_pack.parsed_month_year || d.date_of_manufacture_or_pack.raw_text}".`,
    });
  }

  // =========================================================================
  // 7. CONSUMER CARE DETAILS QUAD CHECK (Rule 6(2))
  // =========================================================================
  const cc = d.consumer_care_details;
  if (!cc.found) {
    checks.push({
      id: 'rule-6-2-quad',
      ruleCitation: 'Rule 6(2), LM(PC) Rules, 2011',
      ruleTitle: '7. Consumer Care Details Quad Check',
      description: 'Must prominently declare ALL FOUR mandatory elements: 1. Contact Person/Designation, 2. Physical Postal Address, 3. Phone/Helpline, 4. Email ID.',
      status: 'VIOLATION',
      finding: 'Consumer care grievance cell details are completely missing.',
      legalActSection: 'Section 36(1), Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Violation under Rule 6(2). Missing mandatory 4-point grievance mechanism.'
    });
  } else {
    const missingQuad: string[] = [];
    if (!cc.has_contact_person_or_office) missingQuad.push('1. Contact Designation/Office');
    if (!cc.has_postal_address) missingQuad.push('2. Physical Postal Address');
    if (!cc.has_phone_number) missingQuad.push('3. Telephone / Helpline');
    if (!cc.has_email_address) missingQuad.push('4. Email Address');

    if (missingQuad.length > 0) {
      checks.push({
        id: 'rule-6-2-quad',
        ruleCitation: 'Rule 6(2), LM(PC) Rules, 2011',
        ruleTitle: '7. Consumer Care Details Quad Check (Partial Failure)',
        description: 'Mandate requires ALL FOUR parameters: Designation, Address, Telephone, and Email.',
        status: 'VIOLATION',
        finding: `Incomplete consumer care cell. Missing mandatory parameter(s): ${missingQuad.join(', ')}.`,
        legalActSection: 'Rule 6(2), LM(PC) Rules, 2011',
        statutoryPenaltyNotice: 'Notice under Section 36(1) for defective consumer grievance redressal cell.'
      });
    } else {
      checks.push({
        id: 'rule-6-2-quad',
        ruleCitation: 'Rule 6(2), LM(PC) Rules, 2011',
        ruleTitle: '7. Consumer Care Details Quad Check',
        description: 'Complete 4-point grievance redressal cell.',
        status: 'COMPLIANT',
        finding: `All 4 elements present and verified: Phone (${cc.extracted_phone || 'Present'}), Email (${cc.extracted_email || 'Present'}), Postal Address & Designation.`,
      });
    }
  }

  // =========================================================================
  // 8. UNIT SALE PRICE (USP) (Rule 6(11))
  // =========================================================================
  if (!d.unit_sale_price.found || d.unit_sale_price.declared_unit_price === null) {
    checks.push({
      id: 'rule-6-11-usp',
      ruleCitation: 'Rule 6(11), LM(PC) Rules, 2011',
      ruleTitle: '8. Unit Sale Price (USP) Declaration',
      description: 'Required alongside MRP for variable package sizes (per g/ml for <1kg/L; per kg/L for ≥1kg/L).',
      status: 'WARNING',
      finding: 'Unit Sale Price (USP) was not explicitly detected or declared on the package.',
      legalActSection: 'Rule 6(11), LM(PC) Rules, 2011',
      statutoryPenaltyNotice: 'Advisory notice for missing Unit Sale Price alongside retail MRP.'
    });
  } else {
    checks.push({
      id: 'rule-6-11-usp',
      ruleCitation: 'Rule 6(11), LM(PC) Rules, 2011',
      ruleTitle: '8. Unit Sale Price (USP) Declaration',
      description: 'Unit sale price declaration.',
      status: 'COMPLIANT',
      finding: `Declared USP: ₹${d.unit_sale_price.declared_unit_price} / ${d.unit_sale_price.declared_base_unit || 'unit'}.`,
    });
  }

  // =========================================================================
  // 9. FONT SIZE & READABILITY ANALYSIS (Rule 7 & Rule 9)
  // =========================================================================
  if (report.font_readability) {
    const fr = report.font_readability;
    if (!fr.is_font_height_compliant) {
      checks.push({
        id: 'rule-7-9-font',
        ruleCitation: 'Rule 7 & Rule 9, LM(PC) Rules, 2011',
        ruleTitle: '9. Font Size & Numeral Height Standards',
        description: `Numeral and letter height must meet minimum statutory height (${fr.minimum_required_height_mm} mm) based on net quantity & Principal Display Panel (PDP).`,
        status: 'VIOLATION',
        finding: `Estimated numeral height (~${fr.estimated_numeral_height_mm || 'insufficient'} mm) is below the statutory minimum of ${fr.minimum_required_height_mm} mm under the First Schedule of Rule 9.`,
        legalActSection: 'Rule 9, LM(PC) Rules, 2011',
        statutoryPenaltyNotice: 'Actionable defect: Sub-standard font size violates consumer readability mandate.'
      });
    } else {
      checks.push({
        id: 'rule-7-9-font',
        ruleCitation: 'Rule 7 & Rule 9, LM(PC) Rules, 2011',
        ruleTitle: '9. Font Size & Numeral Height Standards',
        description: 'Minimum numeral height under Rule 9.',
        status: 'COMPLIANT',
        finding: `Numeral height (~${fr.estimated_numeral_height_mm || fr.minimum_required_height_mm} mm) satisfies statutory minimum requirement of ${fr.minimum_required_height_mm} mm. Contrast rating: ${fr.contrast_evaluation}.`,
      });
    }
  }

  // =========================================================================
  // 10. MISLEADING OR DECEPTIVE PACKAGING (Rule 4 / Rule 26 / Sec 36)
  // =========================================================================
  if (report.misleading_packaging && report.misleading_packaging.is_misleading) {
    checks.push({
      id: 'rule-4-misleading',
      ruleCitation: 'Rule 4 & Rule 26, LM(PC) Rules, 2011 & Section 36 of Act',
      ruleTitle: '10. Prohibition of Misleading / Deceptive Declarations',
      description: 'Prohibits deceptive stickers, obscuring printed MRP, non-standard slack fill, or false declarations.',
      status: 'VIOLATION',
      finding: `Misleading packaging detected: ${report.misleading_packaging.findings.join('; ')}.`,
      legalActSection: 'Section 36, Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Severe penalty under Section 36; seizure of non-standard commodity packages.'
    });
  }

  // =========================================================================
  // COMPUTE OVERALL VERDICT & SCORING
  // =========================================================================
  const violations = checks.filter(c => c.status === 'VIOLATION').length;
  const warnings = checks.filter(c => c.status === 'WARNING').length;
  const total = checks.length;
  const compliant = checks.filter(c => c.status === 'COMPLIANT').length;

  const score = Math.max(0, Math.round((compliant / total) * 100));

  let status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL_REVIEW' = 'COMPLIANT';
  let penalty = 'No statutory fine applicable. Commodity complies with the Legal Metrology Act, 2009 and Packaged Commodities Rules, 2011.';
  let verdict = 'PASSED: Label meets all mandatory statutory requirements under the Legal Metrology Act, 2009.';

  if (violations > 0) {
    status = 'NON_COMPLIANT';
    penalty = `Subject to prosecution under Section 36(1) of Legal Metrology Act, 2009. Statutory fine up to ₹25,000 for first offence, ₹50,000 for second offence, or compounding under Section 48.`;
    verdict = `DEFECTIVE: Identified ${violations} statutory violation(s) under Legal Metrology (Packaged Commodities) Rules, 2011. Notice under Section 36(1) recommended.`;
  } else if (warnings > 0) {
    status = 'PARTIAL_REVIEW';
    penalty = `Statutory advisory notice under Rule 6 / Rule 11. Rectification required within 30 days.`;
    verdict = `CONDITIONAL: Mandatory fields present but with ${warnings} advisory warning(s).`;
  }

  return {
    status,
    complianceScore: score,
    totalViolations: violations,
    totalWarnings: warnings,
    ruleChecks: checks,
    statutoryPenaltyEstimate: penalty,
    inspectorVerdict: verdict
  };
}
