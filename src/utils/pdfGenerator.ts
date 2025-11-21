import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { saveAs } from 'file-saver';

export const capitalize = (str: string, lower = false): string =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );

export const generatePDF = async (name: string): Promise<void> => {
  try {
    const existingPdfBytes = await fetch('/cert.pdf').then((res) =>
      res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);

    const fontBytes = await fetch('/Sanchez-Regular.ttf').then((res) =>
      res.arrayBuffer()
    );

    const sanchezFont = await pdfDoc.embedFont(fontBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    firstPage.drawText(name, {
      x: 300,
      y: 270,
      size: 58,
      font: sanchezFont,
      color: rgb(0.2, 0.84, 0.67),
    });

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], {
      type: 'application/pdf;charset=utf-8',
    });

    saveAs(blob, 'Padhega India Subscription Certificate.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
