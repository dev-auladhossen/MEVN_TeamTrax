// composables/useExportReport.js
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function useExportReport() {
  const getReportElement = () => document.getElementById("report-content");

  const exportPDF = () => {
    const el = getReportElement();
    if (!el) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: "project-report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(el)
      .save();
  };

  const exportImage = async () => {
    const el = getReportElement();
    if (!el) return;
    const canvas = await html2canvas(el);
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "project-report.png";
    link.click();
  };

  const exportExcel = () => {
    // Dummy table data – replace with real dynamic data if available
    const data = [
      ["Task", "Status", "Assignee"],
      ["Design UI", "Completed", "Alice"],
      ["Backend API", "In Progress", "Bob"],
      ["Testing", "Pending", "Charlie"],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Project Report");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "project-report.xlsx"
    );
  };

  return {
    exportPDF,
    exportImage,
    exportExcel,
  };
}
