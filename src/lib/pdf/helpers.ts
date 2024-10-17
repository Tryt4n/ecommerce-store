import { rgb } from "pdf-lib";

export function handlePdfColorRGB(color: string) {
  // Delete the "rgb(" prefix and ")" suffix
  const cleanedColor = color.replace(/rgb\(|\)/g, "");

  // Divide the string into three components
  const [red, green, blue] = cleanedColor.split(",").map((c) => {
    const num = Number(c.trim());
    if (isNaN(num)) {
      throw new Error(`Invalid color component: ${c}`);
    }
    return num / 255;
  });

  return rgb(red, green, blue);
}
