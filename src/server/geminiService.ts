import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      'GEMINI_API_KEY is not configured in environment variables. Please add GEMINI_API_KEY in your Vercel Project Settings > Environment Variables, or in your .env file.'
    );
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

export const SYSTEM_EXTRACTION_PROMPT = `You are an expert Automated Enforcement Inspector for the Department of Consumer Affairs, Government of India, operating under the statutory framework of the Legal Metrology Act, 2009 and the Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011).

Your task is to thoroughly analyze the attached packaging image(s)/label(s), extract all mandatory packaging declarations, and accurately evaluate them against statutory standards. DO NOT hallucinate missing declarations or assume compliance if declarations are absent or non-compliant.

### STATUTORY MANDATES & VIOLATION TRIGGERS TO EVALUATE:
1. MANUFACTURER / PACKER / IMPORTER DETAILS (Rule 6(1)(a)):
   - Mandate: Must declare complete name and physical address of Manufacturer, Packer, or Importer.
   - Statutory Prefixes: Must be explicitly qualified by accepted prefixes: "Mfg by", "Manufactured by", "Packed by", "Pre-packed by", "Imported by", or "Mkt by" / "Marketed by".
   - Violation Trigger: Missing address, missing entity name, or corporate name printed without a qualifying prefix (violates Explanation I/II to Rule 6(1)(a)).

2. COUNTRY OF ORIGIN (Rule 6(1)(aa)):
   - Mandate: Mandatory for all pre-packaged commodities and marketplace listings.
   - Standard Syntax: Explicit "Country of Origin: [Country]", "Made in [Country]", OR domestic Indian origin clearly evident from an Indian manufacturer/packer address located in India.
   - For domestic products manufactured in India (e.g. by Britannia, Parle, ITC, Amul, Nestle India, etc. with Indian addresses/states), set found: true, country_name: "India", and extract the relevant text/address.
   - Violation Trigger: Ambiguous declarations (e.g., "Designed in USA" without explicit origin country) or imported goods omitting the country of origin.

3. COMMON OR GENERIC PRODUCT NAME (Rule 6(1)(b)):
   - Mandate: Clear generic or common name of the commodity must be visible; brand names alone are non-compliant.

4. NET QUANTITY & STANDARD SI UNITS (Rule 6(1)(c) & Rule 12):
   - Mandate: Net quantity must be declared using ONLY standard SI metric symbols:
     • Mass: "g", "kg", or "mg" (Note: "g" is standard, valid SI unit!)
     • Volume: "ml" or "L" / "l"
     • Area/Length: "cm", "m", "mm", "cm²", "m²"
     • Number/Count: "N" or "U"
   - When the packaging states "g" (e.g., "50 g" or "50g"), set is_standard_si_unit: true and declared_unit: "g".
   - Violation Trigger: Non-standard unit abbreviations like "gms", "gm", "kilo", "ltrs", "nos", or "pcs".

5. MAXIMUM RETAIL PRICE (MRP) & TAX CLAUSE (Rule 6(1)(e) & Rule 2(m)):
   - Mandate: Price must be declared in Indian Rupees (₹ or Rs.) and explicitly state the tax-inclusive clause.
   - Approved Formats: "MRP ₹ xx.xx (incl. of all taxes)" or "Max. Retail Price Rs. xx.xx inclusive of all taxes".
   - Violation Trigger: Omission of tax clause (e.g., printing "MRP ₹100" without tax text) or price alteration stickers over original printed MRP.

6. MONTH AND YEAR OF MANUFACTURE / PACKING / IMPORT (Rule 6(1)(d)):
   - Mandate: Must state the month and year in standard syntax ("MM/YYYY", "MM-YYYY", or "Month YYYY").
   - Exemption: Spare parts under warranty or loose garments.

7. CONSUMER CARE DETAILS QUAD CHECK (Rule 6(2)):
   - Mandate: Must prominently declare ALL FOUR mandatory elements for consumer grievances:
     1. Name or Designation of contact person/office (e.g., "Consumer Care Manager").
     2. Full physical postal address.
     3. Helpline / Phone number.
     4. Active Email address.
   - Violation Trigger: Absence of ANY of these 4 parameters.

8. UNIT SALE PRICE (USP) (Rule 6(11)):
   - Mandate: Required alongside MRP for variable package sizes (per g/ml for <1kg/L; per kg/L for >=1kg/L).

9. FONT SIZE & READABILITY ANALYSIS (Rule 7 & Rule 9):
   - Numeral & letter height must meet minimum mm table based on net quantity (Rule 9 Table: <=50g: 1mm; 50-100g: 1.5mm; 100-200g: 2mm; 200-500g: 4mm; >500g-1kg: 4mm; >1kg: 6mm).
   - High visual contrast against background without obscuration.

10. MISLEADING OR DECEPTIVE PACKAGING (Rule 4 / Rule 26 / Section 36):
   - Check for price alteration stickers, misleading pictorial representations, or deceptive packaging.

### OUTPUT JSON SCHEMA (STRICT JSON ONLY):
{
  "audit_metadata": {
    "source_type": "physical_label_or_listing",
    "image_quality_assessment": "CLEAR" | "BLURRY" | "PARTIALLY_OBSCURED"
  },
  "declarations": {
    "manufacturer_or_packer": {
      "found": boolean,
      "raw_text": string or null,
      "qualifying_prefix": string or null,
      "entity_name": string or null,
      "full_address": string or null
    },
    "country_of_origin": {
      "found": boolean,
      "raw_text": string or null,
      "country_name": string or null
    },
    "common_or_generic_name": {
      "found": boolean,
      "raw_text": string or null
    },
    "net_quantity": {
      "found": boolean,
      "raw_text": string or null,
      "numeric_value": number or null,
      "declared_unit": string or null,
      "is_standard_si_unit": boolean
    },
    "mrp": {
      "found": boolean,
      "raw_text": string or null,
      "currency_symbol": "₹" or "Rs." or null,
      "numeric_amount": number or null,
      "has_tax_inclusive_clause": boolean,
      "raw_tax_clause_text": string or null
    },
    "unit_sale_price": {
      "found": boolean,
      "raw_text": string or null,
      "declared_unit_price": number or null,
      "declared_base_unit": string or null
    },
    "date_of_manufacture_or_pack": {
      "found": boolean,
      "raw_text": string or null,
      "parsed_month_year": string or null
    },
    "expiry_or_best_before": {
      "found": boolean,
      "raw_text": string or null
    },
    "consumer_care_details": {
      "found": boolean,
      "raw_text": string or null,
      "has_contact_person_or_office": boolean,
      "has_postal_address": boolean,
      "has_phone_number": boolean,
      "has_email_address": boolean,
      "extracted_phone": string or null,
      "extracted_email": string or null
    }
  },
  "font_readability": {
    "estimated_numeral_height_mm": number or null,
    "minimum_required_height_mm": number,
    "is_font_height_compliant": boolean,
    "contrast_evaluation": "HIGH" | "ADEQUATE" | "POOR",
    "readability_score": number,
    "conspicuous_placement_compliant": boolean,
    "observations": string
  },
  "misleading_packaging": {
    "is_misleading": boolean,
    "has_deceptive_stickers": boolean,
    "findings": string[]
  },
  "detected_languages": string[]
}`;

export async function analyzePackagingImages(params: {
  rawImages: string[];
  mimeType?: string;
  sourceType?: string;
}) {
  const { rawImages, mimeType = 'image/jpeg', sourceType = 'physical_label_or_listing' } = params;

  if (!rawImages || rawImages.length === 0) {
    throw new Error('At least one packaging image is required');
  }

  // Process and clean each image
  const imageList: Array<{ data: string; mimeType: string }> = [];
  for (const rawImg of rawImages) {
    let cleanData = rawImg;
    let detectedMime = mimeType;
    if (rawImg.includes(';base64,')) {
      const parts = rawImg.split(';base64,');
      cleanData = parts[1];
      const matchMime = parts[0].match(/data:(.*)/);
      if (matchMime && matchMime[1]) {
        detectedMime = matchMime[1];
      }
    }
    imageList.push({ data: cleanData, mimeType: detectedMime });
  }

  const ai = getGeminiClient();

  const CANDIDATE_MODELS = [
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
  ];

  let response: any = null;
  let lastError: any = null;

  const contentParts: any[] = imageList.map((img) => ({
    inlineData: {
      data: img.data,
      mimeType: img.mimeType,
    },
  }));

  contentParts.push({
    text: `${SYSTEM_EXTRACTION_PROMPT}

### MULTI-PANEL / MULTI-ANGLE PACKAGING INSPECTION:
You are analyzing ${imageList.length} photo(s) showing different angles and panels of the product packaging (e.g., front face, back panel, sides, nutritional/declaration panels, flaps).
- Carefully extract and synthesize all statutory declarations found across ALL provided angles into one complete audit.
- If Net Quantity is on the front, Manufacturer on the back, and MRP with date on the bottom flap, combine them into the complete legal declaration record.
- If a declaration is MISSING or DEFECTIVE (such as using non-SI units 'gms', missing tax text, missing consumer care email/phone), accurately mark 'found: false' or flag the exact non-compliance.
- Context is "${sourceType}". Return strictly valid JSON conforming to the schema above.`,
  });

  for (const model of CANDIDATE_MODELS) {
    try {
      response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: contentParts,
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response && response.text) {
        break;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} error:`, err?.message || err);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  if (!response || !response.text) {
    throw new Error(
      lastError?.message ||
        'Failed to get a response from Gemini vision models. Please verify GEMINI_API_KEY or check network connectivity.'
    );
  }

  const rawText = response.text || '{}';
  let parsedJson;
  try {
    parsedJson = JSON.parse(rawText.trim());
  } catch {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsedJson = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse model output as JSON.');
    }
  }

  return {
    data: parsedJson,
    rawOutput: rawText,
  };
}
