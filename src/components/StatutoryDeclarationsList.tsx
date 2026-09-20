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
      {/* 1. Manufacturer / Packer */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  1. Manufacturer / Packer / Importer Identity
                </h4>
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.2 rounded font-mono font-semibold">
                  Rule 6(1)(a)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Complete corporate name, physical address, and qualifying prefix ("Mfg by", "Packed by", "Mkt by").
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border shrink-0 ${
              d.manufacturer_or_packer.found
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {d.manufacturer_or_packer.found ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                <span>Present</span>
              </>
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
                  Qualifying Prefix:
                </span>
                <p className="text-slate-900 font-semibold mt-0.5">
                  {d.manufacturer_or_packer.qualifying_prefix || (
                    <span className="text-rose-600 italic">None detected (Non-compliant omission)</span>
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

      {/* 2. Country of Origin */}
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
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.2 rounded font-mono font-semibold">
                  Rule 6(1)(ea)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Mandatory disclosure of country of origin or manufacture.
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border shrink-0 ${
              d.country_of_origin.found
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {d.country_of_origin.found ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                <span>Declared ({d.country_of_origin.country_name})</span>
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 text-rose-600" />
                <span>Violation: Missing</span>
              </>
            )}
          </span>
        </div>

        <div className="mt-2 text-xs">
          <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200 font-mono text-[11px] text-amber-950">
            <span className="text-[10px] uppercase font-bold text-amber-800 font-sans block mb-0.5">
              Verbatim Extracted OCR Text:
            </span>
            {d.country_of_origin.raw_text ? `"${d.country_of_origin.raw_text}"` : 'null'}
          </div>
        </div>
      </div>

      {/* 3. Common or Generic Name */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              <Tag className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  3. Common or Generic Name
                </h4>
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.2 rounded font-mono font-semibold">
                  Rule 6(1)(b)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                True generic commodity nomenclature on retail container.
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

      {/* 4. Net Quantity & Statutory SI Units */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  4. Net Quantity & Statutory SI Units
                </h4>
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.2 rounded font-mono font-semibold">
                  Rule 6(1)(c) & Rule 12
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Permitted SI symbols only: <strong className="text-slate-800 font-mono">g, kg, ml, L, l, cm, m, N, U</strong>. Symbols like "gms", "gm", "ltrs" are illegal.
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border shrink-0 ${
              d.net_quantity.is_standard_si_unit
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse'
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

      {/* 5. Maximum Retail Price (MRP) & Tax Inclusive Clause */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              <IndianRupee className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  5. MRP & Mandatory Tax-Inclusive Clause
                </h4>
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.2 rounded font-mono font-semibold">
                  Rule 6(1)(e)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Mandatory disclosure of <strong className="text-slate-800">"inclusive of all taxes"</strong> or <strong className="text-slate-800">"incl. of all taxes"</strong>.
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
                {d.mrp.raw_tax_clause_text || (d.mrp.has_tax_inclusive_clause ? 'Verified' : 'Omitted')}
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

      {/* 6. Unit Sale Price (USP) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              <Coins className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  6. Unit Sale Price (USP)
                </h4>
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.2 rounded font-mono font-semibold">
                  Rule 6(1)(e) Amendment
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Price per g, kg, ml, l, or number (mandatory w.e.f. Dec 2022).
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
              d.unit_sale_price.found
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            {d.unit_sale_price.found ? 'Declared' : 'Not Declared'}
          </span>
        </div>

        <div className="space-y-2 mt-3 pt-3 border-t border-slate-100 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Declared Unit Price:
              </span>
              <p className="text-slate-900 font-semibold mt-0.5">
                {d.unit_sale_price.declared_unit_price !== null
                  ? `₹ ${d.unit_sale_price.declared_unit_price}`
                  : '—'}
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Base Unit:
              </span>
              <p className="text-slate-900 font-semibold mt-0.5">
                {d.unit_sale_price.declared_base_unit || '—'}
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

      {/* 7 & 8. Manufacture Date & Expiry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-900" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                7. Date of Mfg / Pack
              </h4>
              <span className="text-[10px] text-blue-900 font-mono font-semibold">Rule 6(1)(d)</span>
            </div>
          </div>
          <div className="mt-2 space-y-1.5 text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Parsed MM/YYYY:
              </span>
              <p className="text-slate-900 font-semibold mt-0.5">
                {d.date_of_manufacture_or_pack.parsed_month_year || '—'}
              </p>
            </div>
            <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200 font-mono text-[11px] text-amber-950">
              "{d.date_of_manufacture_or_pack.raw_text}"
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-900" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                8. Expiry / Best Before
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">Consumer Disclosure</span>
            </div>
          </div>
          <div className="mt-2 space-y-1.5 text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Declaration:
              </span>
              <p className="text-slate-900 font-semibold mt-0.5">
                {d.expiry_or_best_before.found ? 'Found' : 'Not Declared'}
              </p>
            </div>
            <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200 font-mono text-[11px] text-amber-950">
              {d.expiry_or_best_before.raw_text ? `"${d.expiry_or_best_before.raw_text}"` : 'null'}
            </div>
          </div>
        </div>
      </div>

      {/* 9. Consumer Care Details (4-Point Mandate) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              <Headphones className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  9. Consumer Care Cell (4-Point Mandate)
                </h4>
                <span className="text-[10px] text-blue-900 bg-blue-50 px-1.5 py-0.2 rounded font-mono font-semibold">
                  Rule 6(1)(a) Proviso
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Contact person, postal address, telephone, and email address are all four statutory requirements.
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
            {d.consumer_care_details.found ? 'Audited' : 'Missing'}
          </span>
        </div>

        <div className="space-y-2.5 mt-3 pt-3 border-t border-slate-100 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-600 uppercase font-bold">
                Designation
              </span>
              {d.consumer_care_details.has_contact_person_or_office ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-rose-600" />
              )}
            </div>

            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-600 uppercase font-bold">
                Postal Address
              </span>
              {d.consumer_care_details.has_postal_address ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-rose-600" />
              )}
            </div>

            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-600 uppercase font-bold">
                Telephone No.
              </span>
              {d.consumer_care_details.has_phone_number ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-rose-600" />
              )}
            </div>

            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-600 uppercase font-bold">
                Email Address
              </span>
              {d.consumer_care_details.has_email_address ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-rose-600" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Extracted Telephone:
              </span>
              <p className="text-slate-900 font-mono mt-0.5">
                {d.consumer_care_details.extracted_phone || 'null'}
              </p>
            </div>

            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
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
    </div>
  );
};
