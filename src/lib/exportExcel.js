// Builds a styled .xlsx in the browser and downloads it.
// exceljs is loaded only when the admin clicks Export, so it doesn't slow the game.

const BRAND = "FF4A0508"; // maroon
const GOLD = "FFF5B82E";
const BORDER = { style: "thin", color: { argb: "FFD9C7A0" } };

/**
 * columns: [{ header, key, width?, align?: "left"|"center"|"right", type?: "text"|"number"|"date" }]
 * rows:    [{ [key]: value }]
 */
export async function downloadExcel({ fileName, sheetName, columns, rows }) {
  const ExcelJS = (await import("exceljs")).default;

  const wb = new ExcelJS.Workbook();
  wb.creator = "Masters Delight";
  wb.created = new Date();

  const ws = wb.addWorksheet(sheetName, {
    views: [{ state: "frozen", ySplit: 1 }], // keep header visible while scrolling
  });

  ws.columns = columns.map((c) => ({
    header: c.header,
    key: c.key,
    width: c.width ?? 16,
  }));

  rows.forEach((r) => ws.addRow(r));

  // ---- header row ----
  const head = ws.getRow(1);
  head.height = 30;
  head.eachCell((cell) => {
    cell.font = { bold: true, size: 12, color: { argb: GOLD } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND } };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cell.border = { top: BORDER, left: BORDER, bottom: BORDER, right: BORDER };
  });

  // ---- body rows ----
  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    row.height = 22;
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const col = columns[colNumber - 1];
      if (!col) return;
      cell.alignment = {
        vertical: "middle",
        horizontal: col.align ?? (col.type === "number" ? "center" : "left"),
      };
      cell.border = {
        top: BORDER,
        left: BORDER,
        bottom: BORDER,
        right: BORDER,
      };
      if (rowNumber % 2 === 0) {
        // zebra striping
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFF6DC" },
        };
      }
      if (col.type === "date") cell.numFmt = "dd-mmm-yyyy hh:mm";
      if (col.type === "text") cell.numFmt = "@"; // keeps numbers like mobiles as text
    });
  });

  // ---- filter dropdowns on the header ----
  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: columns.length },
  };

  // ---- download ----
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: fileName,
  });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
