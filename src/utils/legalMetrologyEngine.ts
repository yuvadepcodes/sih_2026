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

export const VALID_SI_UNITS = ['g', 'kg', 'ml', 'L', 'l', 'cm', 'm', 'N', 'U'];

export function evaluateLegalMetrologyCompliance(
  report: LegalMetrologyAuditReport
): InspectionSummary {
  const d = report.declarations;
  const checks: StatutoryRuleCheck[] = [];

  // 1. Manufacturer / Packer Details - Rule 6(1)(a)
  if (!d.manufacturer_or_packer.found) {
    checks.push({
      id: 'rule-6-1-a',
      ruleCitation: 'Rule 6(1)(a), LM(PC) Rules, 2011',
      ruleTitle: 'Manufacturer / Packer / Importer Identity & Address',
      description: 'The package must clearly declare the name and complete address of the manufacturer, packer, or importer.',
      status: 'VIOLATION',
      finding: 'Manufacturer or packer declaration was not detected on the packaging.',
      legalActSection: 'Section 36(1), Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Fine up to ₹25,000 for first offence under Section 36(1).'
    });
  } else if (!d.manufacturer_or_packer.qualifying_prefix) {
    checks.push({
      id: 'rule-6-1-a',
      ruleCitation: 'Rule 6(1)(a), LM(PC) Rules, 2011',
      ruleTitle: 'Manufacturer / Packer Qualifying Prefix',
      description: 'Must use unambiguous prefix such as "Mfg by", "Manufactured by", "Packed by", or "Imported by".',
      status: 'WARNING',
      finding: `Entity found ("${d.manufacturer_or_packer.entity_name || 'Declared'}") but lacks standard qualifying prefix ("Mfg by", "Packed by", "Mkt by").`,
      legalActSection: 'Rule 6(1)(a)',
      statutoryPenaltyNotice: 'Notice for clarification on manufacturer vs packer vs marketing entity.'
    });
  } else if (!d.manufacturer_or_packer.full_address) {
    checks.push({
      id: 'rule-6-1-a',
      ruleCitation: 'Rule 6(1)(a), LM(PC) Rules, 2011',
      ruleTitle: 'Complete Postal Address',
      description: 'The full postal address of the manufacturer/packer is mandatory.',
      status: 'VIOLATION',
      finding: 'Entity name detected, but complete physical postal address is absent.',
      legalActSection: 'Section 36(1), Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Statutory non-compliance under Rule 6(1)(a).'
    });
  } else {
    checks.push({
      id: 'rule-6-1-a',
      ruleCitation: 'Rule 6(1)(a), LM(PC) Rules, 2011',
      ruleTitle: 'Manufacturer / Packer Declaration',
      description: 'Name and complete address of manufacturer/packer.',
      status: 'COMPLIANT',
      finding: `Properly declared with prefix "${d.manufacturer_or_packer.qualifying_prefix}": ${d.manufacturer_or_packer.entity_name}.`,
    });
  }

  // 2. Country of Origin - Rule 6(1)(ea) & E-Commerce Rules
  if (!d.country_of_origin.found || !d.country_of_origin.country_name) {
    checks.push({
      id: 'rule-6-1-ea',
      ruleCitation: 'Rule 6(1)(ea), LM(PC) Rules, 2011',
      ruleTitle: 'Country of Origin / Manufacture',
      description: 'Mandatory declaration of the country of origin or manufacture.',
      status: 'VIOLATION',
      finding: 'Country of origin is missing or unidentifiable on the package/listing.',
      legalActSection: 'Section 36(1), Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Compounding penalty or fine up to ₹25,000 for missing origin disclosure.'
    });
  } else {
    checks.push({
      id: 'rule-6-1-ea',
      ruleCitation: 'Rule 6(1)(ea), LM(PC) Rules, 2011',
      ruleTitle: 'Country of Origin Declaration',
      description: 'Country of origin declaration.',
      status: 'COMPLIANT',
      finding: `Declared as "${d.country_of_origin.country_name}" (Raw text: "${d.country_of_origin.raw_text}").`,
    });
  }

  // 3. Common or Generic Name - Rule 6(1)(b)
  if (!d.common_or_generic_name.found || !d.common_or_generic_name.raw_text) {
    checks.push({
      id: 'rule-6-1-b',
      ruleCitation: 'Rule 6(1)(b), LM(PC) Rules, 2011',
      ruleTitle: 'Common or Generic Name of Commodity',
      description: 'Common or generic name of the commodity contained in the package.',
      status: 'VIOLATION',
      finding: 'Generic name of the pre-packaged commodity is missing.',
      legalActSection: 'Section 36(1), Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Actionable defect under Section 36(1).'
    });
  } else {
    checks.push({
      id: 'rule-6-1-b',
      ruleCitation: 'Rule 6(1)(b), LM(PC) Rules, 2011',
      ruleTitle: 'Generic Name of Commodity',
      description: 'Common or generic name of commodity.',
      status: 'COMPLIANT',
      finding: `Generic name declared as "${d.common_or_generic_name.raw_text}".`,
    });
  }

  // 4. Net Quantity & Statutory SI Units - Rule 6(1)(c)
  if (!d.net_quantity.found) {
    checks.push({
      id: 'rule-6-1-c',
      ruleCitation: 'Rule 6(1)(c), LM(PC) Rules, 2011',
      ruleTitle: 'Net Quantity Declaration',
      description: 'Mandatory net quantity in terms of standard unit of weight, measure or number.',
      status: 'VIOLATION',
      finding: 'Net quantity declaration was not found on the package.',
      legalActSection: 'Section 36(1) & Section 18, Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Prosecution under Section 36(1); fine up to ₹25,000.'
    });
  } else {
    const rawUnit = (d.net_quantity.declared_unit || '').trim();
    const isSI = d.net_quantity.is_standard_si_unit || VALID_SI_UNITS.includes(rawUnit);

    if (!isSI) {
      checks.push({
        id: 'rule-6-1-c',
        ruleCitation: 'Rule 6(1)(c) & Rule 12, LM(PC) Rules, 2011',
        ruleTitle: 'Standard SI Units Strict Compliance',
        description: 'Under Rule 6(1)(c), symbols must strictly be "g", "kg", "ml", "L", "l", "cm", "m", "N", "U". Non-standard symbols (e.g., "gms", "gm", "ltrs", "ml.") are statutory violations.',
        status: 'VIOLATION',
        finding: `Non-standard unit symbol detected: "${rawUnit}" in "${d.net_quantity.raw_text}". The law forbids symbols like "gms", "gm", or "ltrs".`,
        legalActSection: 'Section 36(1) in conjunction with Rule 6(1)(c)',
        statutoryPenaltyNotice: 'Strict liability offence. Fine up to ₹25,000 for using non-standard symbols.'
      });
    } else {
      checks.push({
        id: 'rule-6-1-c',
        ruleCitation: 'Rule 6(1)(c), LM(PC) Rules, 2011',
        ruleTitle: 'Net Quantity & SI Unit Compliance',
        description: 'Standard unit of weight/measure.',
        status: 'COMPLIANT',
        finding: `Compliant net quantity: ${d.net_quantity.numeric_value ?? ''} ${rawUnit} (Raw: "${d.net_quantity.raw_text}").`,
      });
    }
  }

  // 5. Maximum Retail Price (MRP) & Tax Inclusive Clause - Rule 6(1)(e)
  if (!d.mrp.found) {
    checks.push({
      id: 'rule-6-1-e',
      ruleCitation: 'Rule 6(1)(e), LM(PC) Rules, 2011',
      ruleTitle: 'Maximum Retail Price (MRP) Declaration',
      description: 'Retail sale price must be declared in Indian currency with MRP prefix.',
      status: 'VIOLATION',
      finding: 'Maximum Retail Price (MRP) declaration is missing.',
      legalActSection: 'Section 36(1), Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Severe statutory defect under Section 36(1).'
    });
  } else if (!d.mrp.has_tax_inclusive_clause) {
    checks.push({
      id: 'rule-6-1-e-tax',
      ruleCitation: 'Rule 6(1)(e), LM(PC) Rules, 2011',
      ruleTitle: 'Mandatory "Inclusive of all taxes" Clause',
      description: 'The declaration of MRP must mandatorily state "inclusive of all taxes" or "incl. of all taxes".',
      status: 'VIOLATION',
      finding: `MRP declared (${d.mrp.currency_symbol || '₹'}${d.mrp.numeric_amount ?? ''}) but missing the statutory clause "inclusive of all taxes" or "incl. of all taxes".`,
      legalActSection: 'Rule 6(1)(e), LM(PC) Rules, 2011',
      statutoryPenaltyNotice: 'Notice for misleading retail pricing under Section 36.'
    });
  } else {
    checks.push({
      id: 'rule-6-1-e',
      ruleCitation: 'Rule 6(1)(e), LM(PC) Rules, 2011',
      ruleTitle: 'MRP & Tax-Inclusive Declaration',
      description: 'MRP inclusive of all taxes.',
      status: 'COMPLIANT',
      finding: `Compliant MRP: ${d.mrp.currency_symbol || '₹'}${d.mrp.numeric_amount ?? ''} with tax clause ("${d.mrp.raw_tax_clause_text || 'inclusive of all taxes'}").`,
    });
  }

  // 6. Unit Sale Price (USP) - Rule 6(1)(e) Amendment
  if (!d.unit_sale_price.found || d.unit_sale_price.declared_unit_price === null) {
    checks.push({
      id: 'rule-6-1-e-usp',
      ruleCitation: 'Rule 6(1)(e) Amendment (w.e.f. Dec 2022)',
      ruleTitle: 'Unit Sale Price (USP) Declaration',
      description: 'Packages must declare Unit Sale Price (e.g. ₹/g, ₹/kg, ₹/ml, ₹/N) alongside MRP.',
      status: 'WARNING',
      finding: 'Unit Sale Price (USP) was not explicitly detected or declared on the package.',
      legalActSection: 'Rule 6(1)(e) Amendment',
      statutoryPenaltyNotice: 'Requires verification against packaging date (mandatory post December 2022).'
    });
  } else {
    checks.push({
      id: 'rule-6-1-e-usp',
      ruleCitation: 'Rule 6(1)(e) Amendment',
      ruleTitle: 'Unit Sale Price (USP)',
      description: 'Unit sale price declaration.',
      status: 'COMPLIANT',
      finding: `Declared USP: ₹${d.unit_sale_price.declared_unit_price} / ${d.unit_sale_price.declared_base_unit || 'unit'}.`,
    });
  }

  // 7. Date of Manufacture / Packaging - Rule 6(1)(d)
  if (!d.date_of_manufacture_or_pack.found) {
    checks.push({
      id: 'rule-6-1-d',
      ruleCitation: 'Rule 6(1)(d), LM(PC) Rules, 2011',
      ruleTitle: 'Month & Year of Manufacture or Packing',
      description: 'Month and year of manufacture or packing must be clearly declared.',
      status: 'VIOLATION',
      finding: 'Date / month and year of packaging not found.',
      legalActSection: 'Section 36(1), Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Violation under Rule 6(1)(d).'
    });
  } else {
    checks.push({
      id: 'rule-6-1-d',
      ruleCitation: 'Rule 6(1)(d), LM(PC) Rules, 2011',
      ruleTitle: 'Date of Manufacture / Packing',
      description: 'Month and year of packaging.',
      status: 'COMPLIANT',
      finding: `Declared as "${d.date_of_manufacture_or_pack.parsed_month_year || d.date_of_manufacture_or_pack.raw_text}".`,
    });
  }

  // 8. Consumer Care Details - Rule 6(1)(a) proviso
  const cc = d.consumer_care_details;
  if (!cc.found) {
    checks.push({
      id: 'rule-6-consumer-care',
      ruleCitation: 'Rule 6(1)(a) Proviso, LM(PC) Rules, 2011',
      ruleTitle: 'Consumer Care / Grievance Redressal Cell',
      description: 'Package must bear name, address, telephone number, and email address of person/office to be contacted for consumer grievances.',
      status: 'VIOLATION',
      finding: 'No consumer care cell details found on the packaging.',
      legalActSection: 'Section 36(1), Legal Metrology Act, 2009',
      statutoryPenaltyNotice: 'Violation under Rule 6(1)(a) proviso. Mandatory 4-point contact cell missing.'
    });
  } else {
    const missingElements: string[] = [];
    if (!cc.has_contact_person_or_office) missingElements.push('contact designation');
    if (!cc.has_postal_address) missingElements.push('postal address');
    if (!cc.has_phone_number) missingElements.push('telephone number');
    if (!cc.has_email_address) missingElements.push('email address');

    if (missingElements.length > 0) {
      checks.push({
        id: 'rule-6-consumer-care',
        ruleCitation: 'Rule 6(1)(a) Proviso, LM(PC) Rules, 2011',
        ruleTitle: 'Consumer Care Four-Point Contact Mandate',
        description: 'Under Rule 6, contact designation, address, telephone, and email are ALL four mandatory.',
        status: 'VIOLATION',
        finding: `Incomplete consumer care details. Missing mandatory items: ${missingElements.join(', ')}.`,
        legalActSection: 'Rule 6(1)(a) Proviso',
        statutoryPenaltyNotice: 'Non-compliance notice for defective grievance redressal declarations.'
      });
    } else {
      checks.push({
        id: 'rule-6-consumer-care',
        ruleCitation: 'Rule 6(1)(a) Proviso, LM(PC) Rules, 2011',
        ruleTitle: 'Consumer Care Cell Compliance',
        description: 'Complete 4-point grievance redressal cell.',
        status: 'COMPLIANT',
        finding: `All 4 elements present: Phone (${cc.extracted_phone || 'Yes'}), Email (${cc.extracted_email || 'Yes'}), Designation & Address verified.`,
      });
    }
  }

  // 9. Language Compliance - Rule 9
  const langs = report.detected_languages || [];
  const hasHindiOrEnglish = langs.some(l => l.toLowerCase().includes('english') || l.toLowerCase().includes('hindi'));
  if (langs.length > 0 && !hasHindiOrEnglish) {
    checks.push({
      id: 'rule-9-language',
      ruleCitation: 'Rule 9, LM(PC) Rules, 2011',
      ruleTitle: 'Language of Declarations',
      description: 'Declarations must be either in Hindi in Devanagari script or in English.',
      status: 'WARNING',
      finding: `Languages detected: ${langs.join(', ')}. Must include English or Hindi in Devanagari script.`,
      legalActSection: 'Rule 9, LM(PC) Rules, 2011',
      statutoryPenaltyNotice: 'Verify if bilingual label is present elsewhere on packaging.'
    });
  }

  // 10. Image Quality Assessment
  if (report.audit_metadata.image_quality_assessment !== 'CLEAR') {
    checks.push({
      id: 'audit-quality',
      ruleCitation: 'Section 15 / Inspection Protocol',
      ruleTitle: 'Image Legibility & Verification Quality',
      description: 'Physical label clarity for regulatory audit.',
      status: 'WARNING',
      finding: `Image quality flagged as "${report.audit_metadata.image_quality_assessment}". Some declarations may be partially obscured on physical sample.`,
      legalActSection: 'Inspector Discretion under Rule 33',
    });
  }

  const violations = checks.filter(c => c.status === 'VIOLATION').length;
  const warnings = checks.filter(c => c.status === 'WARNING').length;
  const total = checks.length;
  const compliant = checks.filter(c => c.status === 'COMPLIANT').length;

  const score = Math.max(0, Math.round((compliant / total) * 100));

  let status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL_REVIEW' = 'COMPLIANT';
  let penalty = 'No statutory fine applicable. Commodity complies with Legal Metrology (Packaged Commodities) Rules, 2011.';
  let verdict = 'PASSED: Label meets mandatory statutory requirements under Legal Metrology Act, 2009.';

  if (violations > 0) {
    status = 'NON_COMPLIANT';
    penalty = `Subject to prosecution under Section 36(1) of Legal Metrology Act, 2009. Statutory fine up to ₹25,000 for first offence, ₹50,000 for second offence, or compounding under Section 48.`;
    verdict = `DEFECTIVE: Identified ${violations} statutory violation(s) under Legal Metrology (Packaged Commodities) Rules, 2011. Notice under Section 36(1) recommended.`;
  } else if (warnings > 0 || report.audit_metadata.image_quality_assessment !== 'CLEAR') {
    status = 'PARTIAL_REVIEW';
    penalty = `Statutory warning notice under Rule 6 / Rule 9. Rectification required within 30 days.`;
    verdict = `CONDITIONAL: Mandatory fields present but with ${warnings} advisory warning(s) or image quality caution.`;
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
