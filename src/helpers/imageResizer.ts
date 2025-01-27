import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

/**
 * Resize an image into multiple sizes using Sharp's toBuffer method.
 * @param inputPath - The path to the original image.
 * @param outputDir - The directory where resized images will be saved.
 * @param sizes - Array of objects specifying width and corresponding output file names.
 * @returns A promise that resolves when resizing is complete.
 */
export const imageResizer = async (
  inputPath: string,
  outputDir: string,
  sizes: { width: number; fileName: string }[]
): Promise<void> => {
  try {
    // Read the original image into memory
    const imageBuffer = await fs.readFile(inputPath);

    // Ensure the output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Process each size
    for (const size of sizes) {
      const resizedBuffer = await sharp(imageBuffer)
        .resize({ width: size.width })
        .toBuffer();

      // Write the resized buffer to the output file
      const outputPath = path.join(outputDir, size.fileName);
      await fs.writeFile(outputPath, resizedBuffer);
    }

  } catch (error) {
    console.error("Error resizing image:", error);
    throw error;
  }
};

/**
 * Deletes the original image after processing.
 * @param inputPath - The path to the original image.
 */
export const deleteOriginalImage = async (inputPath: string): Promise<void> => {
  try {
    await fs.unlink(inputPath);
    console.log("Original image deleted successfully.");
  } catch (error) {
    console.error("Error deleting original image:", error);
    throw error;
  }
};
