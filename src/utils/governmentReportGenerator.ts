import { jsPDF } from 'jspdf';
import { LegalMetrologyAuditReport } from '../types';
import { InspectionSummary } from './legalMetrologyEngine';

export interface GovernmentReportMeta {
  fileNumber: string;
  inspectionDate: string;
  officerName: string;
  officerDesignation: string;
  districtZone: string;
  premisesName: string;
  commodityName: string;
  officialRemarks: string;
  recommendedAction: string;
}

export const DEFAULT_GOVT_META: GovernmentReportMeta = {
  fileNumber: `LM-PC/2026/INSP-${Math.floor(1000 + Math.random() * 9000)}`,
  inspectionDate: new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }),
  officerName: 'Shri A. K. Verma',
  officerDesignation: 'Inspector of Legal Metrology',
  districtZone: 'Central Enforcement Cell, Dept. of Consumer Affairs',
  premisesName: 'Retail & Pre-Packaging Establishment',
  commodityName: 'Pre-Packaged Retail Commodity',
  officialRemarks:
    'Inspection conducted in accordance with Rule 6, 9 & 12 of Legal Metrology (Packaged Commodities) Rules, 2011.',
  recommendedAction: 'Issue Statutory Notice under Section 36(1) of the Act',
};

// In-memory cache for rasterized logos so PDF export is instant
let cachedSihLogo: string | null = null;
let cachedEmblemLogo: string | null = null;

/**
 * Creates high-fidelity SIH 2026 Logo (Smart India Hackathon 2026)
 * with brain bulb (orange & green) and navy typography
 */
export function createSihLogoCanvas(width = 520, height = 200): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const scale = width / 520;
  ctx.save();
  ctx.scale(scale, scale);

  const ox = 95;
  const oy = 92;

  // Blue radiating rays
  ctx.strokeStyle = '#0B3B60';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const rays = [
    [ox, 18, ox, 34],
    [ox - 53, 35, ox - 41, 47],
    [ox - 75, oy - 5, ox - 59, oy - 5],
    [ox - 57, oy + 46, ox - 45, oy + 34],
    [ox + 53, 35, ox + 41, 47],
    [ox + 75, oy - 5, ox + 59, oy - 5],
    [ox + 57, oy + 46, ox + 45, oy + 34],
  ];
  rays.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  // Left Hemisphere - Orange (#F37023)
  ctx.fillStyle = '#F37023';
  ctx.beginPath();
  ctx.arc(ox - 26, oy - 38, 12, 0, Math.PI * 2);
  ctx.arc(ox - 35, oy - 16, 13, 0, Math.PI * 2);
  ctx.arc(ox - 33, oy + 8, 13, 0, Math.PI * 2);
  ctx.arc(ox - 17, oy + 30, 12, 0, Math.PI * 2);
  ctx.arc(ox - 14, oy - 48, 11, 0, Math.PI * 2);
  ctx.rect(ox - 24, oy - 52, 20, 84);
  ctx.fill();

  // White sulci lines in Orange
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(ox - 20, oy - 28, 8, 0.2 * Math.PI, 1.1 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(ox - 22, oy - 2, 9, 0.4 * Math.PI, 1.4 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(ox - 16, oy + 20, 7, 0.3 * Math.PI, 1.2 * Math.PI);
  ctx.stroke();

  // Right Hemisphere - Green (#00A651)
  ctx.fillStyle = '#00A651';
  ctx.beginPath();
  ctx.arc(ox + 26, oy - 38, 12, 0, Math.PI * 2);
  ctx.arc(ox + 35, oy - 16, 13, 0, Math.PI * 2);
  ctx.arc(ox + 33, oy + 8, 13, 0, Math.PI * 2);
  ctx.arc(ox + 17, oy + 30, 12, 0, Math.PI * 2);
  ctx.arc(ox + 14, oy - 48, 11, 0, Math.PI * 2);
  ctx.rect(ox + 4, oy - 52, 20, 84);
  ctx.fill();

  // White circuit / brain lines in Green
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(ox + 20, oy - 28, 8, -0.1 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(ox + 22, oy - 2, 9, -0.4 * Math.PI, 0.6 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(ox + 16, oy + 20, 7, -0.2 * Math.PI, 0.7 * Math.PI);
  ctx.stroke();

  // Center vertical divider
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(ox - 3, oy - 54, 6, 88);

  // Bulb Base (Navy #0B3B60)
  ctx.fillStyle = '#0B3B60';
  ctx.beginPath();
  ctx.moveTo(ox - 18, oy + 38);
  ctx.lineTo(ox + 18, oy + 38);
  ctx.lineTo(ox + 12, oy + 72);
  ctx.lineTo(ox - 12, oy + 72);
  ctx.closePath();
  ctx.fill();

  // Text "SIH" inside base
  ctx.fillStyle = '#FFFFFF';
  ctx.font = "900 16px 'Arial Black', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SIH', ox, oy + 56);

  // Bottom contact threads
  ctx.strokeStyle = '#F37023';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(ox, oy + 75, 8, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Typography Right Side: SMART INDIA HACKATHON 2026
  ctx.fillStyle = '#0B3B60';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = "900 32px 'Arial Black', -apple-system, sans-serif";
  ctx.fillText('SMART INDIA', 200, 68);
  ctx.fillText('HACKATHON', 200, 110);
  ctx.font = "900 40px 'Arial Black', -apple-system, sans-serif";
  ctx.fillText('2026', 200, 158);

  ctx.restore();
  return canvas.toDataURL('image/png');
}

/**
 * Loads an image from URL and rasterizes it to a clean PNG data URL
 */
export async function loadImageAsDataUrl(src: string, width = 400, height = 400): Promise<string> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return '';
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const timer = setTimeout(() => {
      resolve('');
    }, 2500);

    img.onload = () => {
      clearTimeout(timer);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/png'));
          return;
        }
      } catch (e) {
        console.warn('Canvas rasterize error:', e);
      }
      resolve('');
    };

    img.onerror = () => {
      clearTimeout(timer);
      fetch(src)
        .then((r) => r.text())
        .then((svg) => {
          const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const fbImg = new Image();
          fbImg.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(fbImg, 0, 0, width, height);
              URL.revokeObjectURL(url);
              resolve(canvas.toDataURL('image/png'));
              return;
            }
            URL.revokeObjectURL(url);
            resolve('');
          };
          fbImg.onerror = () => {
            URL.revokeObjectURL(url);
            resolve('');
          };
          fbImg.src = url;
        })
        .catch(() => resolve(''));
    };

    img.src = src;
  });
}

export async function getSihLogo(): Promise<string> {
  if (cachedSihLogo) return cachedSihLogo;
  try {
    const fromSvg = await loadImageAsDataUrl('/sih-2026-logo.svg', 520, 200);
    if (fromSvg) {
      cachedSihLogo = fromSvg;
      return cachedSihLogo;
    }
  } catch {
    // fallback
  }
  cachedSihLogo = createSihLogoCanvas(520, 200);
  return cachedSihLogo;
}

export async function getEmblemLogo(): Promise<string> {
  if (cachedEmblemLogo) return cachedEmblemLogo;
  try {
    const fromSvg = await loadImageAsDataUrl('/emblem-of-india.svg', 300, 480);
    if (fromSvg) {
      cachedEmblemLogo = fromSvg;
      return cachedEmblemLogo;
    }
  } catch {
    // fallback
  }
  return '';
}

/**
 * Generates an authentic Government of India Legal Metrology Inspection Notice & Report PDF
 */
export async function generateGovernmentPdf(
  report: LegalMetrologyAuditReport,
  summary: InspectionSummary,
  images: string[],
  meta: GovernmentReportMeta = DEFAULT_GOVT_META
) {
  const [sihLogo, emblemLogo] = await Promise.all([getSihLogo(), getEmblemLogo()]);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 13.5;

  const isCompliant = summary.status === 'COMPLIANT';

  // Helper function to check page overflow
  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = margin;
      drawPageBorder();
    }
  };

  const drawPageBorder = () => {
    doc.setDrawColor(20, 40, 80);
    doc.setLineWidth(0.4);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
  };

  drawPageBorder();

  // 1. OFFICIAL GOVT HEADER WITH LOGOS
  // TOP-LEFT: State Emblem of India
  if (emblemLogo) {
    try {
      doc.addImage(emblemLogo, 'PNG', 12, 9.5, 12.5, 20);
    } catch (e) {
      console.warn('Could not add State Emblem to PDF:', e);
    }
  }

  // TOP-RIGHT: SIH 2026 Logo
  if (sihLogo) {
    try {
      doc.addImage(sihLogo, 'PNG', pageWidth - 12 - 32, 10, 32, 12.3);
    } catch (e) {
      console.warn('Could not add SIH logo to PDF:', e);
    }
  }

  // TOP-CENTER: Government of India Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('GOVERNMENT OF INDIA', pageWidth / 2, y, { align: 'center' });
  y += 4.5;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION', pageWidth / 2, y, { align: 'center' });
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('DEPARTMENT OF CONSUMER AFFAIRS • LEGAL METROLOGY DIVISION', pageWidth / 2, y, { align: 'center' });
  y += 4.5;

  // Gold / Saffron divider rule
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // Title of Document
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('STATUTORY PACKAGING COMPLIANCE AUDIT REPORT', pageWidth / 2, y, { align: 'center' });
  y += 4.5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(
    '[Under The Legal Metrology Act, 2009 & Legal Metrology (Packaged Commodities) Rules, 2011]',
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 6;

  // 2. FILE REFERENCE & INSPECTION METADATA TABLE
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 20, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Reference File No:', margin + 3, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(meta.fileNumber, margin + 35, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('Date of Inspection:', margin + 105, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(meta.inspectionDate, margin + 138, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('Inspecting Officer:', margin + 3, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${meta.officerName}, ${meta.officerDesignation}`, margin + 35, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.text('Zone / Jurisdiction:', margin + 105, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(meta.districtZone.slice(0, 32), margin + 138, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.text('Premises / Seller:', margin + 3, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(meta.premisesName.slice(0, 75), margin + 35, y + 15);

  y += 24;

  // 3. STATUTORY VERDICT CALLOUT
  if (isCompliant) {
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(16, 185, 129);
    doc.rect(margin, y, contentWidth, 12, 'FD');
    doc.setTextColor(6, 95, 70);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('VERDICT: COMPLIANT (PASSED)', margin + 4, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Commodity satisfies all mandatory declarations under Rule 6, 9, 12 and Section 36 of the Act.', margin + 4, y + 9.5);
  } else {
    doc.setFillColor(255, 241, 242);
    doc.setDrawColor(244, 63, 94);
    doc.rect(margin, y, contentWidth, 13, 'FD');
    doc.setTextColor(159, 18, 57);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(`VERDICT: NON-COMPLIANT (DEFECTIVE - ${summary.totalViolations} VIOLATION(S))`, margin + 4, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('Packaging is non-standard / deficient. Liable for penal action under Section 36(1) of Legal Metrology Act, 2009.', margin + 4, y + 9.5);
  }
  y += 16;

  // 4. PARTICULARS OF PACKAGED COMMODITY
  ensureSpace(45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('1. PARTICULARS OF THE PRE-PACKAGED COMMODITY', margin, y);
  y += 4;

  const d = report.declarations;
  const commodityRows = [
    ['Generic Product Name', d.common_or_generic_name.raw_text || 'Not Declared', 'Rule 6(1)(b)'],
    [
      'Manufacturer / Packer',
      `${d.manufacturer_or_packer.qualifying_prefix || ''} ${d.manufacturer_or_packer.entity_name || 'Not Declared'} - ${d.manufacturer_or_packer.full_address || ''}`,
      'Rule 6(1)(a)',
    ],
    ['Country of Origin', d.country_of_origin.country_name || 'Not Declared', 'Rule 6(1)(aa)'],
    [
      'Net Quantity',
      `${d.net_quantity.numeric_value || ''} ${d.net_quantity.declared_unit || ''} (SI Valid: ${d.net_quantity.is_standard_si_unit ? 'Yes' : 'NO'})`,
      'Rule 6(1)(c) & 12',
    ],
    [
      'MRP (incl. of taxes)',
      `₹ ${d.mrp.numeric_amount !== null ? d.mrp.numeric_amount : 'N/A'} [Tax Clause: ${d.mrp.has_tax_inclusive_clause ? 'Present' : 'MISSING'}]`,
      'Rule 6(1)(e)',
    ],
    [
      'Unit Sale Price (USP)',
      d.unit_sale_price.found ? `₹ ${d.unit_sale_price.declared_unit_price} / ${d.unit_sale_price.declared_base_unit}` : 'Not Declared',
      'Rule 6(11)',
    ],
    ['Date of Manufacture / Pack', d.date_of_manufacture_or_pack.parsed_month_year || d.date_of_manufacture_or_pack.raw_text || 'Not Declared', 'Rule 6(1)(d)'],
    [
      'Consumer Care Cell',
      `Phone: ${d.consumer_care_details.extracted_phone || 'N/A'}, Email: ${d.consumer_care_details.extracted_email || 'N/A'}`,
      'Rule 6(2)',
    ],
  ];

  doc.setFontSize(7.5);
  commodityRows.forEach(([param, value, rule]) => {
    ensureSpace(6);
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 5.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(param, margin + 2, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const cleanVal = doc.splitTextToSize(value, 105);
    doc.text(cleanVal[0] || '', margin + 50, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(rule, margin + 158, y + 4);

    y += 5.5;
  });

  y += 5;

  // 5. CLASSIFICATION OF STATUTORY OFFENCES (MISSING, MISLEADING, NON-STANDARD)
  ensureSpace(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('2. AUDIT OF STATUTORY DEFECTS & OFFENCES DETECTED', margin, y);
  y += 4;

  const { missing, misleading, nonStandard } = summary.categorizedDefects;
  const allDefects = [
    ...missing.map((m) => ({ ...m, type: 'MISSING' })),
    ...misleading.map((m) => ({ ...m, type: 'MISLEADING' })),
    ...nonStandard.map((m) => ({ ...m, type: 'NON-STANDARD' })),
  ];

  if (allDefects.length === 0) {
    doc.setFillColor(240, 253, 244);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setTextColor(22, 101, 52);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text('NIL: No missing, misleading or non-standard declarations identified on the commodity.', margin + 3, y + 4.5);
    y += 10;
  } else {
    allDefects.forEach((defect, idx) => {
      ensureSpace(14);
      doc.setFillColor(defect.type === 'MISSING' ? 255 : defect.type === 'MISLEADING' ? 254 : 245, 245, 245);
      doc.setDrawColor(203, 213, 225);
      doc.rect(margin, y, contentWidth, 12, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(185, 28, 28);
      doc.text(`[${defect.type}] Issue #${idx + 1}: ${defect.ruleTitle}`, margin + 2, y + 4);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(doc.splitTextToSize(defect.finding, contentWidth - 6)[0] || '', margin + 2, y + 7.5);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Broken: ${defect.ruleCitation} • Penalty: Section 36(1) of Act (Fine up to ₹25,000)`, margin + 2, y + 10.5);

      y += 13.5;
    });
  }

  y += 3;

  // 6. EVIDENTIARY PHOTOGRAPHIC ANNEXURE (ANNEXURE A)
  if (images.length > 0) {
    ensureSpace(65);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`3. ANNEXURE A: ATTACHED PHOTOGRAPHIC EVIDENCE (${images.length} EXHIBITS)`, margin, y);
    y += 4;

    const imgWidth = 42;
    const imgHeight = 32;
    let imgX = margin;

    images.slice(0, 4).forEach((imgBase64, idx) => {
      try {
        doc.addImage(imgBase64, 'JPEG', imgX, y, imgWidth, imgHeight);
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`Exhibit A-${idx + 1}`, imgX + 2, y + imgHeight + 3.5);
        imgX += imgWidth + 4;
      } catch (err) {
        console.warn('Could not embed image in PDF:', err);
      }
    });

    y += imgHeight + 7;
  }

  // 7. OFFICER REMARKS & STATUTORY NOTICE DIRECTION
  ensureSpace(38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('4. OFFICER DIRECTIONS & STATUTORY RECOMMENDATION', margin, y);
  y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const remarks = doc.splitTextToSize(`Remarks: ${meta.officialRemarks}`, contentWidth);
  doc.text(remarks, margin, y);
  y += remarks.length * 3.5 + 2;

  const action = doc.splitTextToSize(`Action Prescribed: ${meta.recommendedAction}`, contentWidth);
  doc.setFont('helvetica', 'bold');
  doc.text(action, margin, y);
  y += 8;

  // 8. SIGNATURE & OFFICIAL SEAL BLOCK
  ensureSpace(28);
  doc.setDrawColor(148, 163, 184);
  doc.line(margin + 110, y + 14, pageWidth - margin, y + 14);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(meta.officerName, margin + 112, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(meta.officerDesignation, margin + 112, y + 21.5);
  doc.text('Seal of Legal Metrology Officer', margin + 112, y + 25);

  doc.text('Verified Digital Evidence Certificate', margin, y + 21.5);
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Report Ref: ${meta.fileNumber} | Generated on ${new Date().toISOString()}`, margin, y + 25);

  // Save the PDF
  const cleanFileName = `Govt_Legal_Metrology_Report_${meta.fileNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  doc.save(cleanFileName);
}

/**
 * Generates an editable Microsoft Word (.doc) format document with Government headers & tables
 */
export async function generateGovernmentWordDoc(
  report: LegalMetrologyAuditReport,
  summary: InspectionSummary,
  images: string[],
  meta: GovernmentReportMeta = DEFAULT_GOVT_META
) {
  const [sihLogo, emblemLogo] = await Promise.all([getSihLogo(), getEmblemLogo()]);
  const d = report.declarations;
  const isCompliant = summary.status === 'COMPLIANT';

  const rowsHtml = [
    ['Generic Commodity Name', d.common_or_generic_name.raw_text || 'Not Declared', 'Rule 6(1)(b)'],
    [
      'Manufacturer / Packer',
      `${d.manufacturer_or_packer.qualifying_prefix || ''} ${d.manufacturer_or_packer.entity_name || 'Not Declared'} - ${d.manufacturer_or_packer.full_address || ''}`,
      'Rule 6(1)(a)',
    ],
    ['Country of Origin', d.country_of_origin.country_name || 'Not Declared', 'Rule 6(1)(aa)'],
    [
      'Net Quantity',
      `${d.net_quantity.numeric_value || ''} ${d.net_quantity.declared_unit || ''} (SI Approved: ${d.net_quantity.is_standard_si_unit ? 'Yes' : 'NO'})`,
      'Rule 6(1)(c) & 12',
    ],
    [
      'Maximum Retail Price (MRP)',
      `₹ ${d.mrp.numeric_amount !== null ? d.mrp.numeric_amount : 'N/A'} [Tax Inclusive: ${d.mrp.has_tax_inclusive_clause ? 'Yes' : 'NO - Defect'}]`,
      'Rule 6(1)(e)',
    ],
    [
      'Unit Sale Price (USP)',
      d.unit_sale_price.found ? `₹ ${d.unit_sale_price.declared_unit_price} / ${d.unit_sale_price.declared_base_unit}` : 'Not Declared',
      'Rule 6(11)',
    ],
    ['Month & Year of Pack/Mfg', d.date_of_manufacture_or_pack.parsed_month_year || d.date_of_manufacture_or_pack.raw_text || 'Not Declared', 'Rule 6(1)(d)'],
    [
      'Consumer Grievance Cell',
      `Helpline: ${d.consumer_care_details.extracted_phone || 'Missing'}, Email: ${d.consumer_care_details.extracted_email || 'Missing'}`,
      'Rule 6(2)',
    ],
  ]
    .map(
      ([param, val, rule]) => `
      <tr>
        <td style="padding: 6px 10px; border: 1px solid #cbd5e1; font-weight: bold; width: 30%; background: #f8fafc;">${param}</td>
        <td style="padding: 6px 10px; border: 1px solid #cbd5e1; width: 50%;">${val}</td>
        <td style="padding: 6px 10px; border: 1px solid #cbd5e1; font-weight: bold; width: 20%; color: #1e3a8a;">${rule}</td>
      </tr>`
    )
    .join('');

  const { missing, misleading, nonStandard } = summary.categorizedDefects;
  const allDefects = [
    ...missing.map((m) => ({ ...m, type: 'MISSING' })),
    ...misleading.map((m) => ({ ...m, type: 'MISLEADING' })),
    ...nonStandard.map((m) => ({ ...m, type: 'NON-STANDARD' })),
  ];

  const defectsHtml =
    allDefects.length === 0
      ? `<p style="color: #166534; font-weight: bold; background: #f0fdf4; padding: 10px; border: 1px solid #86efac;">NIL: No missing, misleading or non-standard declarations identified.</p>`
      : allDefects
          .map(
            (def, i) => `
      <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #fca5a5; background: #fff1f2;">
        <div style="font-weight: bold; color: #991b1b;">[${def.type}] Defect #${i + 1}: ${def.ruleTitle}</div>
        <div style="margin-top: 4px; color: #1e293b;"><strong>Finding:</strong> ${def.finding}</div>
        <div style="margin-top: 4px; font-size: 11px; color: #475569;"><strong>Statutory Citation:</strong> ${def.ruleCitation} | <strong>Penalty Clause:</strong> ${def.statutoryPenaltyNotice || 'Section 36(1)'}</div>
      </div>`
          )
          .join('');

  const imagesHtml =
    images.length === 0
      ? `<p>No photographs attached.</p>`
      : `<div style="display: flex; gap: 15px; flex-wrap: wrap;">
        ${images
          .slice(0, 4)
          .map(
            (img, i) => `
          <div style="display: inline-block; margin-right: 15px; margin-bottom: 15px; text-align: center;">
            <img src="${img}" style="width: 220px; height: 160px; object-fit: contain; border: 1px solid #cbd5e1;" />
            <div style="font-weight: bold; font-size: 11px; margin-top: 4px;">Exhibit A-${i + 1}</div>
          </div>`
          )
          .join('')}
      </div>`;

  const wordContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Legal Metrology Inspection Notice</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 12pt; line-height: 1.4; color: #0f172a; }
        h1, h2, h3 { color: #0f172a; margin-bottom: 4px; }
        table { border-collapse: collapse; width: 100%; margin: 12px 0; }
        .header { text-align: center; border-bottom: 2px solid #b45309; padding-bottom: 8px; margin-bottom: 16px; }
      </style>
    </head>
    <body>
      <table style="width: 100%; border-bottom: 2px solid #b45309; padding-bottom: 8px; margin-bottom: 16px;">
        <tr>
          <td style="width: 25%; text-align: left; vertical-align: middle;">
            <img src="${emblemLogo || '/emblem-of-india.svg'}" style="height: 56px; width: auto; max-width: 60px;" alt="State Emblem of India" />
          </td>
          <td style="width: 50%; text-align: center; vertical-align: middle;">
            <h2 style="margin: 0; font-size: 15pt; color: #0f172a;">GOVERNMENT OF INDIA</h2>
            <h3 style="margin: 2px 0; font-size: 11.5pt; color: #1e293b;">MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION</h3>
            <p style="margin: 2px 0; font-size: 9pt; color: #475569;">DEPARTMENT OF CONSUMER AFFAIRS • LEGAL METROLOGY DIVISION</p>
          </td>
          <td style="width: 25%; text-align: right; vertical-align: middle;">
            <img src="${sihLogo || '/sih-2026-logo.svg'}" style="height: 48px; width: auto; max-width: 130px;" alt="Smart India Hackathon 2026" />
          </td>
        </tr>
      </table>

      <div style="text-align: center; margin-bottom: 16px;">
        <h3 style="margin: 0; font-size: 13.5pt; text-decoration: underline; color: #0f172a;">STATUTORY PACKAGING COMPLIANCE AUDIT NOTICE</h3>
        <p style="font-size: 9.5pt; margin: 2px 0 0 0; color: #64748b;">[Under The Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011]</p>
      </div>

      <table style="background: #f8fafc; border: 1px solid #cbd5e1; margin-bottom: 16px;">
        <tr>
          <td style="padding: 6px; font-weight: bold;">Notice Reference No:</td>
          <td style="padding: 6px;">${meta.fileNumber}</td>
          <td style="padding: 6px; font-weight: bold;">Date of Audit:</td>
          <td style="padding: 6px;">${meta.inspectionDate}</td>
        </tr>
        <tr>
          <td style="padding: 6px; font-weight: bold;">Inspecting Officer:</td>
          <td style="padding: 6px;">${meta.officerName}, ${meta.officerDesignation}</td>
          <td style="padding: 6px; font-weight: bold;">Zone / Jurisdiction:</td>
          <td style="padding: 6px;">${meta.districtZone}</td>
        </tr>
        <tr>
          <td style="padding: 6px; font-weight: bold;">Establishment:</td>
          <td colspan="3" style="padding: 6px;">${meta.premisesName}</td>
        </tr>
      </table>

      <div style="padding: 10px; background: ${isCompliant ? '#f0fdf4' : '#fff1f2'}; border: 2px solid ${isCompliant ? '#10b981' : '#f43f5e'}; margin-bottom: 16px;">
        <strong style="font-size: 14pt; color: ${isCompliant ? '#065f46' : '#9f1239'};">
          STATUTORY VERDICT: ${isCompliant ? 'COMPLIANT (PASSED)' : `NON-COMPLIANT (DEFECTIVE - ${summary.totalViolations} VIOLATIONS)`}
        </strong>
        <p style="margin: 4px 0 0 0; font-size: 10.5pt;">
          ${isCompliant ? 'Commodity packaging conforms to all statutory disclosure requirements.' : 'Commodity violates packaging rules and is actionable under Section 36(1) of Legal Metrology Act, 2009.'}
        </p>
      </div>

      <h3>1. Particulars of Pre-Packaged Commodity</h3>
      <table>
        <thead>
          <tr style="background: #e2e8f0;">
            <th style="padding: 6px 10px; border: 1px solid #cbd5e1; text-align: left;">Mandatory Parameter</th>
            <th style="padding: 6px 10px; border: 1px solid #cbd5e1; text-align: left;">Extracted Raw Observation</th>
            <th style="padding: 6px 10px; border: 1px solid #cbd5e1; text-align: left;">Statutory Citation</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <h3>2. Detailed Offence & Defect Findings</h3>
      ${defectsHtml}

      <h3>3. Annexure A: Evidentiary Packaging Photographs</h3>
      ${imagesHtml}

      <h3>4. Directions & Statutory Notice Action</h3>
      <p><strong>Remarks:</strong> ${meta.officialRemarks}</p>
      <p><strong>Prescribed Action:</strong> ${meta.recommendedAction}</p>

      <br><br>
      <div style="text-align: right; margin-top: 40px;">
        <p style="border-top: 1px solid #475569; display: inline-block; width: 250px; text-align: center; padding-top: 5px;">
          <strong>${meta.officerName}</strong><br>
          ${meta.officerDesignation}<br>
          Legal Metrology Officer Seal
        </p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', wordContent], {
    type: 'application/msword',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Govt_Legal_Metrology_Notice_${meta.fileNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
