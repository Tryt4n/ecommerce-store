"use server";

import { PDFDocument, rgb } from "pdf-lib";
import { handlePdfColorRGB } from "./helpers";
import type { getProduct } from "@/db/userData/products";

const MARGIN = 50;
const PAGE_HEIGHT = 800;
const PAGE_WIDTH = 600;
const FONT_SIZE = 12;
const FONT_SIZE_SECTION_HEADER = 14;
const HEADER_SIZE = 24;
const ROW_HEIGHT = 20;

export async function generateProductPDF(
  product: NonNullable<Awaited<ReturnType<typeof getProduct>>> & {
    specification: { name: string; value: string }[];
    shortDescription: string;
  }
) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const { height } = page.getSize();
  let currentY = height - MARGIN;

  // Function to add new page and adjust
  function addNewPage() {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    currentY = height - MARGIN;
  }

  // Function to wrap text based on max width
  function wrapText(text: string, maxWidth: number) {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = (currentLine.length + word.length + 1) * (FONT_SIZE * 0.5);

      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    return lines;
  }

  // Function to draw text with check for new page and adjust position
  function drawText(text: string, x: number, y: number, options: any) {
    const availableWidth = PAGE_WIDTH - 2 * MARGIN;
    const lines = wrapText(text, availableWidth);
    const totalHeight = lines.length * (FONT_SIZE + 5);

    if (y - totalHeight < MARGIN) {
      addNewPage();
      y = currentY;
    }

    let currentLineY = y;
    lines.forEach((line) => {
      page.drawText(line, {
        x,
        y: currentLineY,
        ...options,
      });
      currentLineY -= FONT_SIZE + 5;
    });

    return currentLineY;
  }

  // Function to capitalize words
  function capitalize(word: string): string {
    return word
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  // Function to draw text with header
  function drawTextWithHeader(
    headerText: string,
    bodyText: string,
    x: number,
    y: number,
    options: any
  ) {
    const availableWidth = PAGE_WIDTH - 2 * MARGIN;
    const headerHeight = FONT_SIZE + 5;
    const bodyLines = wrapText(bodyText, availableWidth);
    const totalHeight = headerHeight + bodyLines.length * (FONT_SIZE + 5);

    // Check if the whole content (header + text) fits on the page
    if (y - totalHeight < MARGIN) {
      addNewPage();
      y = currentY;
    }

    // Draw header
    page.drawText(headerText, {
      x,
      y,
      ...options,
      size: FONT_SIZE_SECTION_HEADER,
    });

    // Draw body text
    let currentLineY = y - headerHeight - FONT_SIZE;
    bodyLines.forEach((line) => {
      page.drawText(line, {
        x,
        y: currentLineY,
        ...options,
      });
      currentLineY -= FONT_SIZE + 5;
    });

    return currentLineY;
  }

  // Draw Product Name
  currentY = drawText(product.name, MARGIN, currentY, {
    size: HEADER_SIZE,
    color: handlePdfColorRGB("rgb(2, 8, 23)"),
  });

  // Fetch and Add Main Image
  if (product.images.length > 0) {
    const mainImage =
      product.images.find((img) => img.isMainForProduct) || product.images[0];
    const imageBytes = await fetch(
      `${mainImage.url}?tr=w-800,h-800,fo-center,cm-pad_resize`
    ).then((res) => res.arrayBuffer());

    const image = await pdfDoc.embedJpg(imageBytes); // Assuming JPG
    const imageDims = image.scale(0.5); // Resize image

    if (currentY - imageDims.height < MARGIN) {
      addNewPage();
    }

    page.drawImage(image, {
      x: MARGIN,
      y: currentY - imageDims.height,
      width: PAGE_WIDTH - 2 * MARGIN,
      height: imageDims.height,
    });

    currentY -= imageDims.height + 20; // Update Y position
  }

  // Draw Short Description with dynamic spacing
  currentY = drawText(product.shortDescription, MARGIN, currentY, {
    size: FONT_SIZE,
    color: handlePdfColorRGB("rgb(2, 8, 23)"),
  });
  currentY -= 20; // Gap

  // Draw Categories
  currentY = drawText(
    // `${product.categories.length > 1 ? "Categories" : "Category"}: ${product.categories.join(" / ")}`,
    `${product.categories.length > 1 ? "Categories" : "Category"}: ${product.categories.map(capitalize).join(" / ")}`,
    MARGIN,
    currentY,
    { size: FONT_SIZE, color: handlePdfColorRGB("rgb(2, 8, 23)") }
  );
  currentY -= 20; // Gap

  // Draw Price
  currentY = drawText(
    `Price: ${(product.priceInCents / 100).toFixed(2)} zl`,
    MARGIN,
    currentY,
    {
      size: FONT_SIZE,
      color: handlePdfColorRGB("rgb(2, 8, 23)"),
    }
  );
  currentY -= 30; // Extra gap before description

  // Draw Description Header
  currentY = drawTextWithHeader(
    "Description:",
    product.description,
    MARGIN,
    currentY,
    {
      size: FONT_SIZE,
      color: handlePdfColorRGB("rgb(2, 8, 23)"),
    }
  );
  currentY -= 40; // Space between description and specifications

  // Draw Specification Table with dynamic position
  currentY = drawText("Specifications:", MARGIN, currentY, {
    size: FONT_SIZE_SECTION_HEADER,
    color: handlePdfColorRGB("rgb(2, 8, 23)"),
  });

  // Draw table headers
  page.drawRectangle({
    x: MARGIN,
    y: currentY - ROW_HEIGHT,
    width: PAGE_WIDTH - 2 * MARGIN,
    height: ROW_HEIGHT,
    color: rgb(0.8, 0.8, 0.8),
    borderColor: handlePdfColorRGB("rgb(2, 8, 23)"),
    borderWidth: 1,
  });

  // Calculate middle point for the vertical line
  const middleX = MARGIN + (PAGE_WIDTH - 2 * MARGIN) / 2;

  // Draw vertical line in header
  page.drawLine({
    start: { x: middleX, y: currentY },
    end: { x: middleX, y: currentY - ROW_HEIGHT },
    thickness: 1,
    color: handlePdfColorRGB("rgb(2, 8, 23)"),
  });

  // Draw header text
  page.drawText("Name", {
    x: MARGIN + 5,
    y: currentY - 15,
    size: FONT_SIZE,
    color: handlePdfColorRGB("rgb(2, 8, 23)"),
  });
  page.drawText("Value", {
    x: middleX + 5,
    y: currentY - 15,
    size: FONT_SIZE,
    color: handlePdfColorRGB("rgb(2, 8, 23)"),
  });

  currentY -= ROW_HEIGHT;

  // Draw specification data rows with consistent vertical lines
  product.specification.forEach((spec, index) => {
    if (currentY < MARGIN + ROW_HEIGHT) {
      addNewPage();
    }

    // Background for even rows
    if (index % 2 === 0) {
      page.drawRectangle({
        x: MARGIN,
        y: currentY - ROW_HEIGHT,
        width: PAGE_WIDTH - 2 * MARGIN,
        height: ROW_HEIGHT,
        color: rgb(0.95, 0.95, 0.95),
      });
    }

    // Draw spec name and value
    page.drawText(spec.name, {
      x: MARGIN + 5,
      y: currentY - 15,
      size: FONT_SIZE,
      color: handlePdfColorRGB("rgb(2, 8, 23)"),
    });
    page.drawText(spec.value, {
      x: middleX + 5,
      y: currentY - 15,
      size: FONT_SIZE,
      color: handlePdfColorRGB("rgb(2, 8, 23)"),
    });

    // Draw row borders
    page.drawRectangle({
      x: MARGIN,
      y: currentY - ROW_HEIGHT,
      width: PAGE_WIDTH - 2 * MARGIN,
      height: ROW_HEIGHT,
      borderColor: handlePdfColorRGB("rgb(2, 8, 23)"),
      borderWidth: 1,
    });

    // Draw vertical line for each row
    page.drawLine({
      start: { x: middleX, y: currentY },
      end: { x: middleX, y: currentY - ROW_HEIGHT },
      thickness: 1,
      color: handlePdfColorRGB("rgb(2, 8, 23)"),
    });

    currentY -= ROW_HEIGHT;
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
