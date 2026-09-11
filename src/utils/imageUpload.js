// ---------------------------------------------------------------------------
// IMAGE UPLOAD HELPER (temporary browser-storage implementation)
// ---------------------------------------------------------------------------
// Since this project has no backend/file storage yet, uploaded images are
// converted to compressed base64 data URLs and saved inline with the local
// content records. The records are stored in IndexedDB, which is appropriate
// for this larger structured data while the images remain browser-local.
//
// When a real backend exists, replace calls to this with an actual file
// upload request and store the returned URL instead.
// ---------------------------------------------------------------------------

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

export function fileToCompressedDataUrl(
  file,
  { maxDimension = MAX_DIMENSION, quality = JPEG_QUALITY } = {},
) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Not an image file"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode image"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          const scale = maxDimension / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // SVGs / already-small PNGs with transparency: keep PNG, otherwise JPEG.
        const useJpeg =
          file.type !== "image/png" && file.type !== "image/svg+xml";
        resolve(
          canvas.toDataURL(useJpeg ? "image/jpeg" : "image/png", quality),
        );
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
