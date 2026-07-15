import { randomUUID } from "crypto";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

const IMAGE_MAX_WIDTH = 2400;
const IMAGE_WEBP_QUALITY = 90;
const TEAM_IMAGE_MAX_SIZE = 800;
const VIDEO_CRF = 18;

export function isVideoMime(mime: string) {
  return mime.startsWith("video/");
}

export function isImageMime(mime: string) {
  return mime.startsWith("image/");
}

export function formatTeamImageError(err: unknown) {
  if (!(err instanceof Error)) return "Image processing failed";
  const msg = err.message.toLowerCase();
  if (msg.includes("heif") || msg.includes("heic")) {
    return "HEIC photos are not supported. Please upload JPG or PNG.";
  }
  return err.message;
}

export async function compressImage(buffer: Buffer): Promise<{
  buffer: Buffer;
  contentType: string;
  ext: string;
}> {
  let pipeline = sharp(buffer).rotate();

  const meta = await pipeline.metadata();
  if (meta.width && meta.width > IMAGE_MAX_WIDTH) {
    pipeline = sharp(buffer)
      .rotate()
      .resize(IMAGE_MAX_WIDTH, undefined, { withoutEnlargement: true });
  }

  const output = await pipeline
    .webp({ quality: IMAGE_WEBP_QUALITY, effort: 4 })
    .toBuffer();

  return { buffer: output, contentType: "image/webp", ext: "webp" };
}

/** Team headshots: downscale first, then WebP (reliable on Vercel serverless). */
export async function compressTeamImage(buffer: Buffer): Promise<{
  buffer: Buffer;
  contentType: string;
  ext: string;
}> {
  const output = await sharp(buffer)
    .rotate()
    .resize(TEAM_IMAGE_MAX_SIZE, TEAM_IMAGE_MAX_SIZE, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ effort: 4 })
    .toBuffer();

  return { buffer: output, contentType: "image/webp", ext: "webp" };
}

async function runFfmpeg(
  inputPath: string,
  outputPath: string,
  options: string[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions(options)
      .save(outputPath)
      .on("end", () => resolve())
      .on("error", (err) => reject(err));
  });
}

export async function compressVideo(buffer: Buffer): Promise<{
  videoBuffer: Buffer;
  thumbnailBuffer: Buffer;
  videoContentType: string;
  videoExt: string;
}> {
  const dir = join(tmpdir(), `treku-${randomUUID()}`);
  await mkdir(dir, { recursive: true });

  const inputPath = join(dir, "input");
  const outputPath = join(dir, "output.mp4");
  const thumbPath = join(dir, "thumb.webp");

  await writeFile(inputPath, buffer);

  try {
    await runFfmpeg(inputPath, outputPath, [
      "-c:v libx264",
      `-crf ${VIDEO_CRF}`,
      "-preset slow",
      "-c:a aac",
      "-b:a 192k",
      "-movflags +faststart",
    ]);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(outputPath)
        .screenshots({
          timestamps: ["00:00:01"],
          filename: "thumb.png",
          folder: dir,
          size: "1280x?",
        })
        .on("end", () => resolve())
        .on("error", reject);
    });

    const thumbPng = await readFile(join(dir, "thumb.png"));
    const thumbnailBuffer = await sharp(thumbPng)
      .webp({ quality: 88 })
      .toBuffer();

    const videoBuffer = await readFile(outputPath);

    await unlink(join(dir, "thumb.png")).catch(() => {});

    return {
      videoBuffer,
      thumbnailBuffer,
      videoContentType: "video/mp4",
      videoExt: "mp4",
    };
  } finally {
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
    await unlink(thumbPath).catch(() => {});
  }
}

/** Lighter compression for homepage showreel (smaller file, 1080p max). */
export async function compressShowreelVideo(buffer: Buffer): Promise<{
  videoBuffer: Buffer;
  videoContentType: string;
  videoExt: string;
}> {
  const dir = join(tmpdir(), `treku-showreel-${randomUUID()}`);
  await mkdir(dir, { recursive: true });

  const inputPath = join(dir, "input");
  const outputPath = join(dir, "output.mp4");

  await writeFile(inputPath, buffer);

  try {
    await runFfmpeg(inputPath, outputPath, [
      "-c:v libx264",
      "-crf 23",
      "-preset medium",
      "-vf scale='min(1920,iw)':-2",
      "-c:a aac",
      "-b:a 128k",
      "-movflags +faststart",
    ]);

    const videoBuffer = await readFile(outputPath);
    return {
      videoBuffer,
      videoContentType: "video/mp4",
      videoExt: "mp4",
    };
  } finally {
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
}
