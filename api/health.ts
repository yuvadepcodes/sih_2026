export default function handler(req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    service: 'Legal Metrology Packaging Inspection Engine (Vercel Serverless)',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
}
