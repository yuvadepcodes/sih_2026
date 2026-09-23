/**
 * Client-Side Image Optimizer
 * Resizes high-resolution phone camera images (e.g., 48MP/12MP) to a fast, crystal-clear 1600px max dimension
 * and compresses to 85% JPEG. This drops payload size from ~15MB to ~250KB per image, making uploads 10x-20x faster
 * and avoiding serverless timeouts while preserving OCR text clarity.
 */
export async function optimizePackagingImage(
  dataUrlOrFile: string | File,
  maxDimension = 1600,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof dataUrlOrFile === 'string' ? dataUrlOrFile : '');
        return;
      }

      // Draw with smoothing for text crispness
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const optimized = canvas.toDataURL('image/jpeg', quality);
      resolve(optimized);
    };

    img.onerror = (err) => {
      console.warn('Image optimization fallback:', err);
      if (typeof dataUrlOrFile === 'string') {
        resolve(dataUrlOrFile);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || '');
        reader.onerror = reject;
        reader.readAsDataURL(dataUrlOrFile);
      }
    };

    if (typeof dataUrlOrFile === 'string') {
      img.src = dataUrlOrFile;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(dataUrlOrFile);
    }
  });
}
