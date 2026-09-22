import { JanVishwasOffenseTier, JanVishwasPenaltyCalculation, LegalMetrologyAuditReport } from '../types';

/**
 * Evaluates Jan Vishwas statutory notice & penalty calculation
 */
export function calculateJanVishwasPenalty(
  report: LegalMetrologyAuditReport,
  priorOffensesCount = 0
): JanVishwasPenaltyCalculation {
  // Count violations
  const d = report.declarations;
  let violationCount = 0;

  if (!d.manufacturer_or_packer.found) violationCount++;
  if (!d.country_of_origin.found) violationCount++;
  if (!d.common_or_generic_name.found) violationCount++;
  if (!d.net_quantity.found || !d.net_quantity.is_standard_si_unit) violationCount++;
  if (!d.mrp.found || !d.mrp.has_tax_inclusive_clause) violationCount++;
  if (!d.unit_sale_price.found) violationCount++;
  if (!d.date_of_manufacture_or_pack.found) violationCount++;
  if (!d.expiry_or_best_before.found) violationCount++;
  if (
    !d.consumer_care_details.found ||
    (!d.consumer_care_details.has_phone_number && !d.consumer_care_details.has_email_address)
  ) {
    violationCount++;
  }
  if (report.font_readability && !report.font_readability.is_font_height_compliant) {
    violationCount++;
  }
  if (report.misleading_packaging && report.misleading_packaging.is_misleading) {
    violationCount += 2;
  }

  let tier: JanVishwasOffenseTier = 'FIRST_OFFENSE';
  let prescribedPenaltyInr = 0;
  let complianceWindowDays = 30;
  let statutoryNoticeType: 'IMPROVEMENT_NOTICE_SEC_36_1' | 'COMPOUNDED_CIVIL_PENALTY' | 'PROSECUTION_REFERRAL' =
    'IMPROVEMENT_NOTICE_SEC_36_1';
  let statutoryClause = 'Section 36(1) read with Rule 6, 9 & 18 of Legal Metrology (Packaged Commodities) Rules, 2011';
  let notes = '';

  if (priorOffensesCount === 0) {
    tier = 'FIRST_OFFENSE';
    statutoryNoticeType = 'IMPROVEMENT_NOTICE_SEC_36_1';
    prescribedPenaltyInr = 25000;
    complianceWindowDays = 30;
    notes =
      'First-time label default under Jan Vishwas Provisions: 30-day statutory compliance window granted to rectify packaging declarations. If compounded or complied within window, civil penalty may be waived or fixed at standard ₹25,000.';
  } else if (priorOffensesCount === 1) {
    tier = 'SECOND_OFFENSE';
    statutoryNoticeType = 'COMPOUNDED_CIVIL_PENALTY';
    prescribedPenaltyInr = 50000;
    complianceWindowDays = 15;
    notes =
      'Second offense within 3 years: Mandatory civil compounding penalty of ₹50,000 under amended Section 36(1). Hearing required before Adjudicating Officer.';
  } else {
    tier = 'REPEAT_OFFENSE';
    statutoryNoticeType = 'PROSECUTION_REFERRAL';
    prescribedPenaltyInr = 100000;
    complianceWindowDays = 7;
    notes =
      'Repeat/Habitual Offender: Maximum statutory civil penalty of ₹1,00,000. Recommended for suspension of packing license / referral to Chief Controller for criminal prosecution under Section 49 of the Act.';
  }

  return {
    tier,
    violationCount,
    statutoryNoticeType,
    prescribedPenaltyInr,
    complianceWindowDays,
    statutoryClause,
    isJanVishwasDecriminalized: true,
    notes,
  };
}
