import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { analyzePackagingImages } from './src/server/geminiService.js';

const app = express();
const PORT = 3000;

// Increase JSON body limits for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Legal Metrology Packaging Inspection Engine',
    rules: 'Legal Metrology (Packaged Commodities) Rules, 2011 & Legal Metrology Act, 2009',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Packaging image analysis endpoint (supports multiple angles of the package)
app.post('/api/analyze-packaging', async (req: Request, res: Response) => {
  try {
    const { images, imageBase64, mimeType = 'image/jpeg', sourceType = 'physical_label_or_listing' } = req.body;

    const rawImages: string[] = Array.isArray(images) && images.length > 0
      ? images
      : (imageBase64 ? [imageBase64] : []);

    if (rawImages.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one packaging image is required' });
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
    console.error('Packaging analysis error in Express server:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process packaging image with Gemini model',
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
