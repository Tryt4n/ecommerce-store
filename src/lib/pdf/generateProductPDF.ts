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
const CELL_PADDING = 5;
const TABLE_COLUMN_WIDTH = (PAGE_WIDTH - 2 * MARGIN) / 2;

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
    let currentLineY = y - headerHeight - FONT_SIZE / 2;
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

  // Function to wrap text in cell with break-word support
  function wrapTextInCell(text: string, maxWidth: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = "";

    for (let word of words) {
      // Handle very long words
      while (word.length * (FONT_SIZE * 0.5) > maxWidth) {
        const breakPoint = Math.floor(maxWidth / (FONT_SIZE * 0.5));
        const part = word.substring(0, breakPoint);
        word = word.substring(breakPoint);
        if (currentLine) {
          lines.push(currentLine);
          currentLine = "";
        }
        lines.push(part);
      }

      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length * (FONT_SIZE * 0.5) <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  // Function to draw table cell with wrapped text
  function drawTableCell(
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
    isHeader: boolean = false,
    isEvenRow: boolean = false
  ) {
    // Draw background for header
    if (isHeader) {
      page.drawRectangle({
        x,
        y: y - height,
        width,
        height,
        color: rgb(0.8, 0.8, 0.8),
      });
    } else if (isEvenRow) {
      page.drawRectangle({
        x,
        y: y - height,
        width,
        height,
        color: rgb(0.95, 0.95, 0.95),
      });
    }

    // Draw background for even rows
    if (isEvenRow && !isHeader) {
      page.drawRectangle({
        x,
        y: y - height,
        width,
        height,
        color: rgb(0.95, 0.95, 0.95),
      });
    }

    // Draw cell border
    page.drawRectangle({
      x,
      y: y - height,
      width,
      height,
      borderColor: handlePdfColorRGB("rgb(2, 8, 23)"),
      borderWidth: 1,
    });

    // Wrap and draw text
    const lines = wrapTextInCell(text, width - 2 * CELL_PADDING);

    // Calculate total height of the text
    const textHeight = lines.length * (FONT_SIZE + 5) - 5; // Subtract 5 because the last line does not need padding

    // Calculate starting position of the text to center it in the cell
    let textY = y - (height - textHeight) / 2 - FONT_SIZE;

    // For the header, add a slight offset up to make the text slightly higher
    if (isHeader) {
      textY += 2;
    }

    lines.forEach((line) => {
      page.drawText(line, {
        x: x + CELL_PADDING,
        y: textY,
        size: FONT_SIZE,
        color: handlePdfColorRGB("rgb(2, 8, 23)"),
      });
      textY -= FONT_SIZE + 5;
    });

    // Add additional padding at the bottom of the text
    if (lines.length === 1) {
      textY -= 5; // Additional padding for single line
    }
  }

  // Function to calculate cell height based on content
  function calculateCellHeight(text: string, width: number): number {
    const lines = wrapTextInCell(text, width - 2 * CELL_PADDING);
    return Math.max(
      ROW_HEIGHT,
      lines.length * (FONT_SIZE + 5) + 2 * CELL_PADDING
    );
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

  // Draw section header
  currentY = drawText("Specifications:", MARGIN, currentY, {
    size: FONT_SIZE_SECTION_HEADER,
    color: handlePdfColorRGB("rgb(2, 8, 23)"),
  });

  // Table headers
  const headerHeight = ROW_HEIGHT;
  const middleX = MARGIN + TABLE_COLUMN_WIDTH;

  // Draw headers
  drawTableCell(
    "Name",
    MARGIN,
    currentY,
    TABLE_COLUMN_WIDTH,
    headerHeight,
    true
  );
  drawTableCell(
    "Value",
    middleX,
    currentY,
    TABLE_COLUMN_WIDTH,
    headerHeight,
    true
  );

  currentY -= headerHeight;

  // Draw data rows
  product.specification.forEach((spec, index) => {
    // Calculate row height based on longer text
    const nameHeight = calculateCellHeight(spec.name, TABLE_COLUMN_WIDTH);
    const valueHeight = calculateCellHeight(spec.value, TABLE_COLUMN_WIDTH);
    const rowHeight = Math.max(nameHeight, valueHeight);

    // Check if new page is needed
    if (currentY - rowHeight < MARGIN) {
      addNewPage();
    }

    // Draw spec name and value cells
    drawTableCell(
      spec.name,
      MARGIN,
      currentY,
      TABLE_COLUMN_WIDTH,
      rowHeight,
      false,
      index % 2 === 0
    );
    drawTableCell(
      spec.value,
      middleX,
      currentY,
      TABLE_COLUMN_WIDTH,
      rowHeight,
      false,
      index % 2 === 0
    );

    currentY -= rowHeight;
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
