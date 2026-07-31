/**
 * PDF generation service.
 *
 * Recommended approach: server-side render the CV's HTML template
 * (cv_templates.preview_html, populated with user_cvs.content and
 * selected_color) and print it to PDF with headless Chromium.
 *
 * Swap the body of renderCvToPdf() for your actual implementation, e.g.:
 *
 *   const puppeteer = require('puppeteer');
 *   const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
 *   const page = await browser.newPage();
 *   await page.setContent(html, { waitUntil: 'networkidle0' });
 *   const buffer = await page.pdf({ format: 'A4', printBackground: true });
 *   await browser.close();
 *   // upload `buffer` to S3 / object storage, return its public URL
 *
 * For a simpler client-side alternative, the Angular "Download PDF"
 * button can instead use html2canvas + jsPDF directly in the browser
 * and skip this endpoint entirely — trade server load for lower fidelity.
 */
async function renderCvToPdf(cv) {
  // Placeholder: return a deterministic path until real rendering/storage
  // is wired up. Replace with the Puppeteer + object-storage flow above.
  const fileName = `cv-${cv.id}-${Date.now()}.pdf`;
  return { url: `/generated-pdfs/${fileName}` };
}

module.exports = { renderCvToPdf };
