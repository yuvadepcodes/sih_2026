import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Increase JSON body limits for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy initializer for Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured.');
    }
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

const SYSTEM_EXTRACTION_PROMPT = `You are an expert AI Document Processing Engine and Senior Inspector for the Department of Consumer Affairs (Government of India), specializing in the Legal Metrology (Packaged Commodities) Rules, 2011 and Legal Metrology Act, 2009.

Your task is to analyze the attached image of a pre-packaged retail commodity, product label, or e-commerce listing image, extract all mandatory packaging declarations, and perform OCR text extraction.

You must strictly output a valid JSON object matching the schema below. Do not include introductory text, conversational chatter, or explanations outside the JSON object.

### EXTRACTION RULES:
1. Extract raw text exactly as printed on the package before normalizing fields.
2. If a declaration is missing, damaged, or unreadable, set its value to null or false as appropriate.
3. Check for specific legal keywords:
   - Manufacturer/Packer Prefix: Look for "Mfg by", "Manufactured by", "Packed by", "Mkt by", "Marketed by", "Imported by".
   - Tax Inclusive Clause: Look for exact phrases like "incl. of all taxes", "inclusive of all taxes", "incl. taxes".
   - Country of Origin: Look for "Made in", "Country of Origin:", "Product of".
4. Standard SI Units Check: Record the exact declared unit (e.g., "gms", "gm", "100g", "ltrs"). Standard SI units allowed under Rule 6(1)(c) are strictly: "g", "kg", "ml", "L", "l", "cm", "m", "N", "U".

### OUTPUT JSON SCHEMA:
{
  "audit_metadata": {
    "source_type": "physical_label_or_listing",
    "image_quality_assessment": "CLEAR"
  },
  "declarations": {
    "manufacturer_or_packer": {
      "found": true,
      "raw_text": "string or null",
      "qualifying_prefix": "string or null",
      "entity_name": "string or null",
      "full_address": "string or null"
    },
    "country_of_origin": {
      "found": true,
      "raw_text": "string or null",
      "country_name": "string or null"
    },
    "common_or_generic_name": {
      "found": true,
      "raw_text": "string or null"
    },
    "net_quantity": {
      "found": true,
      "raw_text": "string or null",
      "numeric_value": null,
      "declared_unit": "string or null",
      "is_standard_si_unit": true
    },
    "mrp": {
      "found": true,
      "raw_text": "string or null",
      "currency_symbol": "₹",
      "numeric_amount": null,
      "has_tax_inclusive_clause": true,
      "raw_tax_clause_text": "string or null"
    },
    "unit_sale_price": {
      "found": true,
      "raw_text": "string or null",
      "declared_unit_price": null,
      "declared_base_unit": "string or null"
    },
    "date_of_manufacture_or_pack": {
      "found": true,
      "raw_text": "string or null",
      "parsed_month_year": "MM/YYYY or null"
    },
    "expiry_or_best_before": {
      "found": true,
      "raw_text": "string or null"
    },
    "consumer_care_details": {
      "found": true,
      "raw_text": "string or null",
      "has_contact_person_or_office": true,
      "has_postal_address": true,
      "has_phone_number": true,
      "has_email_address": true,
      "extracted_phone": "string or null",
      "extracted_email": "string or null"
    }
  },
  "detected_languages": ["English"]
}`;

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Legal Metrology Packaging Inspection Engine',
    rules: 'Legal Metrology (Packaged Commodities) Rules, 2011 & Legal Metrology Act, 2009',
  });
});

// Packaging image analysis endpoint
app.post('/api/analyze-packaging', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', sourceType = 'physical_label_or_listing' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required (imageBase64)' });
    }

    // Strip data URI prefix if present (e.g. data:image/png;base64,)
    let cleanBase64 = imageBase64;
    let detectedMime = mimeType;
    if (imageBase64.includes(';base64,')) {
      const parts = imageBase64.split(';base64,');
      cleanBase64 = parts[1];
      const matchMime = parts[0].match(/data:(.*)/);
      if (matchMime && matchMime[1]) {
        detectedMime = matchMime[1];
      }
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: detectedMime,
              },
            },
            {
              text: `${SYSTEM_EXTRACTION_PROMPT}\n\nNote: The source type is: "${sourceType}". Inspect every statutory field strictly according to the Legal Metrology (Packaged Commodities) Rules, 2011. Return strictly the JSON object.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    let parsedJson;
    try {
      parsedJson = JSON.parse(rawText.trim());
    } catch {
      // Fallback: attempt regex extraction of JSON block
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedJson = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse model output as JSON.');
      }
    }

    return res.json({
      success: true,
      data: parsedJson,
      rawOutput: rawText,
    });
  } catch (error: any) {
    console.error('Packaging analysis error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process packaging image',
      details: error.toString(),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Legal Metrology Inspector Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
