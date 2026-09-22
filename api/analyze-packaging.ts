import type { IncomingMessage, ServerResponse } from 'http';
import { analyzePackagingImages } from '../src/server/geminiService.js';

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  // Enable CORS if needed
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { images, imageBase64, mimeType = 'image/jpeg', sourceType = 'physical_label_or_listing' } = req.body || {};

    const rawImages: string[] = Array.isArray(images) && images.length > 0
      ? images
      : (imageBase64 ? [imageBase64] : []);

    if (rawImages.length === 0) {
      return res.status(400).json({ error: 'At least one packaging image is required' });
    }

    const result = await analyzePackagingImages({
      rawImages,
      mimeType,
      sourceType,
    });

    return res.status(200).json({
      success: true,
      data: result.data,
      rawOutput: result.rawOutput,
    });
  } catch (error: any) {
    console.error('Packaging analysis error in Vercel function:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process packaging image with Gemini model',
      details: error.toString(),
    });
  }
}
