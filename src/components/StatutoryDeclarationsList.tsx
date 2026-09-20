import React from 'react';
import {
  Building2,
  Globe2,
  Tag,
  Scale,
  IndianRupee,
  Coins,
  Calendar,
  Clock,
  Headphones,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { LegalMetrologyAuditReport } from '../types';

interface StatutoryDeclarationsListProps {
  auditReport: LegalMetrologyAuditReport;
}

export const StatutoryDeclarationsList: React.FC<StatutoryDeclarationsListProps> = ({
  auditReport,
}) => {
  const d = auditReport.declarations;

  return (
    <div className="space-y-3">
      {/* 1. Manufacturer / Packer / Importer Details (Rule 6(1)(a)) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  1. Manufacturer / Packer / Importer Details
                </h4>
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-semibold">
                  Rule 6(1)(a)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Complete corporate name, physical address, and statutory qualifying prefix ("Mfg by", "Packed by", "Mkt by").
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border shrink-0 ${
              d.manufacturer_or_packer.found && d.manufacturer_or_packer.qualifying_prefix && d.manufacturer_or_packer.full_address
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {d.manufacturer_or_packer.found ? (
              d.manufacturer_or_packer.qualifying_prefix && d.manufacturer_or_packer.full_address ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Compliant</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3 w-3 text-rose-600" />
                  <span>Deficient Details</span>
                </>
              )
            ) : (
              <>
                <XCircle className="h-3 w-3 text-rose-600" />
                <span>Missing</span>
              </>
            )}
          </span>
        </div>

        {d.manufacturer_or_packer.found ? (
          <div className="space-y-2 mt-3 pt-3 border-t border-slate-100 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Statutory Qualifying Prefix:
                </span>
                <p className="text-slate-900 font-semibold mt-0.5">
                  {d.manufacturer_or_packer.qualifying_prefix || (
                    <span className="text-rose-600 italic">None detected (Violates Explanation I/II to Rule 6(1)(a))</span>
                  )}
                </p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Entity Name:
                </span>
                <p className="text-slate-900 font-semibold mt-0.5 truncate">
                  {d.manufacturer_or_packer.entity_name || '—'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Declared Physical Address:
              </span>
              <p className="text-slate-800 mt-0.5 leading-relaxed">
                {d.manufacturer_or_packer.full_address || (
                  <span className="text-rose-600 italic">Incomplete or missing physical address</span>
                )}
              </p>
            </div>

            <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200 font-mono text-[11px] text-amber-950">
              <span className="text-[10px] uppercase font-bold text-amber-800 font-sans block mb-0.5">
                Verbatim Extracted OCR Text:
              </span>
              "{d.manufacturer_or_packer.raw_text}"
            </div>
          </div>
        ) : (
          <p className="text-xs text-rose-800 mt-2 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
            Statutory Violation under Section 36(1): Pre-packaged commodities cannot be offered for sale without manufacturer or packer identity.
          </p>
        )}
      </div>

      {/* 2. Country of Origin (Rule 6(1)(aa)) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              <Globe2 className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Country of Origin
                </h4>
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-semibold">
                  Rule 6(1)(aa)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Standard Syntax: "Country of Origin: [Country]", "Made in [Country]", or "Manufactured in [Country]".
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border shrink-0 ${
              d.country_of_origin.found && d.country_of_origin.country_name
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {d.country_of_origin.found && d.country_of_origin.country_name ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                <span>Present</span>
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 text-rose-600" />
                <span>Missing / Ambiguous</span>
              </>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              Parsed Origin Country:
            </span>
            <p className="text-slate-900 font-bold mt-0.5">
              {d.country_of_origin.country_name || (
                <span className="text-rose-600 italic">Not Declared / Ambiguous</span>
              )}
            </p>
          </div>

          <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200 font-mono text-[11px] text-amber-950 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-amber-800 font-sans block mb-0.5">
              Extracted Raw Text:
            </span>
            {d.country_of_origin.raw_text ? `"${d.country_of_origin.raw_text}"` : 'null'}
          </div>
        </div>
      </div>

      {/* 3. Common or Generic Product Name (Rule 6(1)(b)) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              <Tag className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  3. Common or Generic Product Name
                </h4>
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-semibold">
                  Rule 6(1)(b)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Clear generic name of commodity visible; brand names alone are non-compliant.
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
              d.common_or_generic_name.found
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {d.common_or_generic_name.found ? 'Present' : 'Missing'}
          </span>
        </div>

        <div className="mt-2 text-xs">
          <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200 font-mono text-[11px] text-amber-950">
            <span className="text-[10px] uppercase font-bold text-amber-800 font-sans block mb-0.5">
              Declared Generic Commodity Name:
            </span>
            {d.common_or_generic_name.raw_text ? `"${d.common_or_generic_name.raw_text}"` : 'null'}
          </div>
        </div>
      </div>

      {/* 4. Net Quantity & Standard SI Units (Rule 6(1)(c) & Rule 12) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  4. Net Quantity & Standard SI Units
                </h4>
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-semibold">
                  Rule 6(1)(c) & Rule 12
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Permitted SI symbols only: <strong className="text-slate-800 font-mono">g, kg, ml, L, l, cm, m, N, U</strong>. Symbols like "gms", "gm", "ltrs", "pcs" are illegal.
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border shrink-0 ${
              d.net_quantity.is_standard_si_unit
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {d.net_quantity.is_standard_si_unit ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                <span>SI Standard Unit</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3 text-rose-600" />
                <span>Non-SI Unit Violation</span>
              </>
            )}
          </span>
        </div>

        <div className="space-y-2 mt-3 pt-3 border-t border-slate-100 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Numeric Value:
              </span>
              <p className="text-slate-900 font-bold mt-0.5 text-sm">
                {d.net_quantity.numeric_value ?? 'null'}
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Declared Unit:
              </span>
              <p
                className={`font-mono font-bold mt-0.5 text-sm ${
                  d.net_quantity.is_standard_si_unit ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {d.net_quantity.declared_unit || 'null'}
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Statutory Status:
              </span>
              <p
                className={`text-[11px] font-bold mt-0.5 ${
                  d.net_quantity.is_standard_si_unit ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {d.net_quantity.is_standard_si_unit ? 'Complies with Rule 12' : 'Illegal Symbol under Act'}
              </p>
            </div>
          </div>

          <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200 font-mono text-[11px] text-amber-950">
            <span className="text-[10px] uppercase font-bold text-amber-800 font-sans block mb-0.5">
              Verbatim Extracted OCR Text:
            </span>
            "{d.net_quantity.raw_text}"
          </div>
        </div>
      </div>

      {/* 5. Maximum Retail Price (MRP) & Tax Clause (Rule 6(1)(e) & Rule 2(m)) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              <IndianRupee className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  5. Maximum Retail Price (MRP) & Tax Clause
                </h4>
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-semibold">
                  Rule 6(1)(e) & Rule 2(m)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Mandatory disclosure of <strong className="text-slate-800">"inclusive of all taxes"</strong> or <strong className="text-slate-800">"incl. of all taxes"</strong> in Indian Rupees.
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border shrink-0 ${
              d.mrp.has_tax_inclusive_clause
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {d.mrp.has_tax_inclusive_clause ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                <span>Tax Clause Present</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3 text-rose-600" />
                <span>Tax Clause Missing</span>
              </>
            )}
          </span>
        </div>

        <div className="space-y-2 mt-3 pt-3 border-t border-slate-100 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Currency:
              </span>
              <p className="text-slate-900 font-bold mt-0.5">
                {d.mrp.currency_symbol || 'None'}
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Numeric MRP:
              </span>
              <p className="text-slate-900 font-bold mt-0.5 text-sm">
                {d.mrp.numeric_amount !== null ? `₹ ${d.mrp.numeric_amount}` : 'null'}
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Tax Inclusive Clause:
              </span>
              <p
                className={`text-[11px] font-bold mt-0.5 ${
                  d.mrp.has_tax_inclusive_clause ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {d.mrp.raw_tax_clause_text || (d.mrp.has_tax_inclusive_clause ? 'Verified' : 'Omitted (Violation)')}
              </p>
            </div>
          </div>

          <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200 font-mono text-[11px] text-amber-950">
            <span className="text-[10px] uppercase font-bold text-amber-800 font-sans block mb-0.5">
              Verbatim Extracted OCR Text:
            </span>
            "{d.mrp.raw_text}"
          </div>
        </div>
      </div>

      {/* 6. Month and Year of Manufacture / Packing (Rule 6(1)(d)) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  6. Month & Year of Manufacture / Packing / Import
                </h4>
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-semibold">
                  Rule 6(1)(d)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Standard syntax ("MM/YYYY", "MM-YYYY", or "Month YYYY").
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
              d.date_of_manufacture_or_pack.found
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {d.date_of_manufacture_or_pack.found ? 'Present' : 'Missing'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              Parsed Packaging Date:
            </span>
            <p className="text-slate-900 font-bold mt-0.5">
              {d.date_of_manufacture_or_pack.parsed_month_year || 'Not Parsable'}
            </p>
          </div>

          <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200 font-mono text-[11px] text-amber-950 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-amber-800 font-sans block mb-0.5">
              Verbatim Extracted OCR Text:
            </span>
            {d.date_of_manufacture_or_pack.raw_text ? `"${d.date_of_manufacture_or_pack.raw_text}"` : 'null'}
          </div>
        </div>
      </div>

      {/* 7. Consumer Care Details Quad Check (Rule 6(2)) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              <Headphones className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  7. Consumer Care Details Quad Check
                </h4>
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-semibold">
                  Rule 6(2)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Contact person/designation, postal address, telephone/helpline, and email address are ALL FOUR statutory mandates.
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
              d.consumer_care_details.has_contact_person_or_office &&
              d.consumer_care_details.has_postal_address &&
              d.consumer_care_details.has_phone_number &&
              d.consumer_care_details.has_email_address
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {d.consumer_care_details.has_contact_person_or_office &&
            d.consumer_care_details.has_postal_address &&
            d.consumer_care_details.has_phone_number &&
            d.consumer_care_details.has_email_address
              ? '4/4 Quad Verified'
              : 'Quad Incomplete'}
          </span>
        </div>

        <div className="space-y-2.5 mt-3 pt-3 border-t border-slate-100 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-600 uppercase font-bold">
                1. Designation
              </span>
              {d.consumer_care_details.has_contact_person_or_office ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-rose-600" />
              )}
            </div>

            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-600 uppercase font-bold">
                2. Postal Address
              </span>
              {d.consumer_care_details.has_postal_address ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-rose-600" />
              )}
            </div>

            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-600 uppercase font-bold">
                3. Telephone No.
              </span>
              {d.consumer_care_details.has_phone_number ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-rose-600" />
              )}
            </div>

            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-600 uppercase font-bold">
                4. Email Address
              </span>
              {d.consumer_care_details.has_email_address ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-rose-600" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Extracted Telephone / Helpline:
              </span>
              <p className="text-slate-900 font-mono mt-0.5">
                {d.consumer_care_details.extracted_phone || 'null'}
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Extracted Email:
              </span>
              <p className="text-slate-900 font-mono mt-0.5 truncate">
                {d.consumer_care_details.extracted_email || 'null'}
              </p>
            </div>
          </div>

          <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200 font-mono text-[11px] text-amber-950">
            <span className="text-[10px] uppercase font-bold text-amber-800 font-sans block mb-0.5">
              Verbatim Extracted OCR Text:
            </span>
            "{d.consumer_care_details.raw_text}"
          </div>
        </div>
      </div>

      {/* 8. Unit Sale Price (USP) (Rule 6(11)) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              <Coins className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  8. Unit Sale Price (USP)
                </h4>
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-semibold">
                  Rule 6(11)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Required alongside MRP for variable package sizes (per g/ml for &lt;1kg/L; per kg/L for ≥1kg/L).
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
              d.unit_sale_price.found && d.unit_sale_price.declared_unit_price !== null
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            {d.unit_sale_price.found ? 'Declared' : 'Advisory / Not Found'}
          </span>
        </div>

        <div className="space-y-2 mt-3 pt-3 border-t border-slate-100 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Unit Price:
              </span>
              <p className="text-slate-900 font-bold mt-0.5">
                {d.unit_sale_price.declared_unit_price !== null
                  ? `₹ ${d.unit_sale_price.declared_unit_price}`
                  : 'null'}
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Base Unit:
              </span>
              <p className="text-slate-900 font-bold mt-0.5">
                {d.unit_sale_price.declared_base_unit || 'null'}
              </p>
            </div>
          </div>

          <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200 font-mono text-[11px] text-amber-950">
            <span className="text-[10px] uppercase font-bold text-amber-800 font-sans block mb-0.5">
              Verbatim Extracted OCR Text:
            </span>
            {d.unit_sale_price.raw_text ? `"${d.unit_sale_price.raw_text}"` : 'null'}
          </div>
        </div>
      </div>

      {/* 9. Expiry / Best Before Date (Rule 6(1)(f)) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  9. Expiry / Best Before Date
                </h4>
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-semibold">
                  Rule 6(1)(f)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Period of usability or consumer consumption validity.
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
              d.expiry_or_best_before.found
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}
          >
            {d.expiry_or_best_before.found ? 'Present' : 'Not Detected'}
          </span>
        </div>

        <div className="mt-2 text-xs">
          <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200 font-mono text-[11px] text-amber-950">
            <span className="text-[10px] uppercase font-bold text-amber-800 font-sans block mb-0.5">
              Extracted Best Before / Expiry:
            </span>
            {d.expiry_or_best_before.raw_text ? `"${d.expiry_or_best_before.raw_text}"` : 'null'}
          </div>
        </div>
      </div>
    </div>
  );
};
