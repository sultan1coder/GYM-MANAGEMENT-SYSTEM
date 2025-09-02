import { toast } from "react-hot-toast";

export interface ExportOptions {
  filename?: string;
  format: "csv" | "json" | "xlsx" | "pdf";
  data: any[];
  headers?: string[];
  title?: string;
}

export class ExportManager {
  static async exportToCSV(
    data: any[],
    filename: string = "export.csv",
    headers?: string[]
  ) {
    try {
      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      // Generate headers if not provided
      const csvHeaders = headers || Object.keys(data[0]);

      // Convert data to CSV format
      const csvContent = [
        csvHeaders.join(","),
        ...data.map((row) =>
          csvHeaders
            .map((header) => {
              const value = row[header];
              // Handle values that contain commas, quotes, or newlines
              if (
                typeof value === "string" &&
                (value.includes(",") ||
                  value.includes('"') ||
                  value.includes("\n"))
              ) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value || "";
            })
            .join(",")
        ),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Data exported to ${filename}`);
    } catch (error) {
      console.error("CSV export error:", error);
      toast.error("Failed to export CSV file");
    }
  }

  static async exportToJSON(data: any[], filename: string = "export.json") {
    try {
      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Data exported to ${filename}`);
    } catch (error) {
      console.error("JSON export error:", error);
      toast.error("Failed to export JSON file");
    }
  }

  static async exportToExcel(
    data: any[],
    filename: string = "export.xlsx",
    headers?: string[]
  ) {
    try {
      // For now, we'll export as CSV since Excel requires additional libraries
      // In a real implementation, you'd use libraries like 'xlsx' or 'exceljs'
      await this.exportToCSV(data, filename.replace(".xlsx", ".csv"), headers);
      toast.info("Excel export converted to CSV format");
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Failed to export Excel file");
    }
  }

  static async exportToPDF(
    data: any[],
    filename: string = "export.pdf",
    title?: string
  ) {
    try {
      // For PDF export, you'd typically use libraries like 'jsPDF' or 'pdfmake'
      // For now, we'll show a placeholder implementation
      toast.info("PDF export feature coming soon");

      // Placeholder: Export as JSON for now
      const exportData = {
        title: title || "Export Report",
        generatedAt: new Date().toISOString(),
        data: data,
      };

      await this.exportToJSON([exportData], filename.replace(".pdf", ".json"));
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF file");
    }
  }

  static async exportData(options: ExportOptions) {
    const { data, format, filename, headers, title } = options;
    const timestamp = new Date().toISOString().split("T")[0];
    const defaultFilename = `export_${timestamp}`;

    switch (format) {
      case "csv":
        await this.exportToCSV(
          data,
          filename || `${defaultFilename}.csv`,
          headers
        );
        break;
      case "json":
        await this.exportToJSON(data, filename || `${defaultFilename}.json`);
        break;
      case "xlsx":
        await this.exportToExcel(
          data,
          filename || `${defaultFilename}.xlsx`,
          headers
        );
        break;
      case "pdf":
        await this.exportToPDF(
          data,
          filename || `${defaultFilename}.pdf`,
          title
        );
        break;
      default:
        toast.error("Unsupported export format");
    }
  }
}

// Utility functions for common export scenarios
export const exportMembers = async (
  members: any[],
  format: "csv" | "json" | "xlsx" = "csv"
) => {
  const headers = [
    "id",
    "name",
    "email",
    "phone_number",
    "age",
    "membershiptype",
    "createdAt",
  ];
  await ExportManager.exportData({
    data: members,
    format,
    filename: `members_${new Date().toISOString().split("T")[0]}.${format}`,
    headers,
    title: "Members Export Report",
  });
};

export const exportUsers = async (
  users: any[],
  format: "csv" | "json" | "xlsx" = "csv"
) => {
  const headers = [
    "id",
    "name",
    "email",
    "username",
    "role",
    "phone_number",
    "created_at",
  ];
  await ExportManager.exportData({
    data: users,
    format,
    filename: `users_${new Date().toISOString().split("T")[0]}.${format}`,
    headers,
    title: "Users Export Report",
  });
};

export const exportEquipment = async (
  equipment: any[],
  format: "csv" | "json" | "xlsx" = "csv"
) => {
  const headers = [
    "id",
    "name",
    "type",
    "category",
    "quantity",
    "available",
    "status",
    "brand",
    "model",
    "location",
  ];
  await ExportManager.exportData({
    data: equipment,
    format,
    filename: `equipment_${new Date().toISOString().split("T")[0]}.${format}`,
    headers,
    title: "Equipment Export Report",
  });
};

export const exportPayments = async (
  payments: any[],
  format: "csv" | "json" | "xlsx" = "csv"
) => {
  const headers = [
    "id",
    "memberId",
    "amount",
    "method",
    "status",
    "description",
    "createdAt",
  ];
  await ExportManager.exportData({
    data: payments,
    format,
    filename: `payments_${new Date().toISOString().split("T")[0]}.${format}`,
    headers,
    title: "Payments Export Report",
  });
};

export const exportAnalytics = async (
  analyticsData: any,
  format: "csv" | "json" | "xlsx" = "json"
) => {
  await ExportManager.exportData({
    data: [analyticsData],
    format,
    filename: `analytics_${new Date().toISOString().split("T")[0]}.${format}`,
    title: "Analytics Export Report",
  });
};

export default ExportManager;
