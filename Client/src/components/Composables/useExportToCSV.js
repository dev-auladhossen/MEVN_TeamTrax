// utils/exportToCSV.js
export function exportToCSV(data, filename = "report.csv") {
  if (!data || !data.length) return;

  const keys = Object.keys(data[0]);
  const csvContent = [
    keys.join(","), // header
    ...data.map((row) =>
      keys.map((key) => `"${(row[key] ?? "").toString().replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
