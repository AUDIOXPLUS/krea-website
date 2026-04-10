import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

async function extractText(filePath) {
  const doc = await getDocument(filePath).promise;
  let text = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    text += `--- Page ${i} ---\n${pageText}\n\n`;
  }
  return text;
}

const files = [
  "C:\\Users\\Mmmo\\claude backup\\Resources\\KREA_SIGNATURE_Engineering_Manifesto-1.pdf",
  "C:\\Users\\Mmmo\\claude backup\\Resources\\KREA_ESSENTIAL_Engineering_Manifesto.pdf",
  "C:\\Users\\Mmmo\\claude backup\\Resources\\KREA_MONOLITE_Engineering_Manifesto.pdf",
];

for (const f of files) {
  const name = f.split("\\").pop();
  console.log("=".repeat(80));
  console.log(`FILE: ${name}`);
  console.log("=".repeat(80));
  try {
    const text = await extractText(f);
    console.log(text);
  } catch (e) {
    console.error(`Error processing ${name}: ${e.message}`);
  }
}
