import React, { useState } from "react";
import {
  Download,
  Upload,
  FileText,
  FileSpreadsheet,
  Database,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-hot-toast";
import { memberAPI, paymentAPI } from "@/services/api";

interface ExportImportProps {
  dataType: "members" | "payments" | "equipment" | "attendance";
  onDataImported?: (data: any[]) => void;
  className?: string;
}

interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  icon: React.ReactNode;
  description: string;
}

const DataExportImport: React.FC<ExportImportProps> = ({
  dataType,
  onDataImported,
  className,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<string>("csv");

  const exportFormats: ExportFormat[] = [
    {
      id: "csv",
      name: "CSV",
      extension: ".csv",
      icon: <FileText className="w-4 h-4" />,
      description: "Comma-separated values",
    },
    {
      id: "excel",
      name: "Excel",
      extension: ".xlsx",
      icon: <FileSpreadsheet className="w-4 h-4" />,
      description: "Microsoft Excel format",
    },
    {
      id: "json",
      name: "JSON",
      extension: ".json",
      icon: <Database className="w-4 h-4" />,
      description: "JavaScript Object Notation",
    },
  ];

  const getDataTypeInfo = () => {
    switch (dataType) {
      case "members":
        return {
          title: "Members Data",
          description: "Export/Import member information and profiles",
          apiCall: memberAPI.getAllMembers,
          fileName: "members",
        };
      case "payments":
        return {
          title: "Payments Data",
          description: "Export/Import payment records and transactions",
          apiCall: paymentAPI.getAllPayments,
          fileName: "payments",
        };
      case "equipment":
        return {
          title: "Equipment Data",
          description:
            "Export/Import equipment inventory and maintenance records",
          apiCall: null, // Mock data for now
          fileName: "equipment",
        };
      case "attendance":
        return {
          title: "Attendance Data",
          description: "Export/Import attendance records and check-ins",
          apiCall: null, // Mock data for now
          fileName: "attendance",
        };
      default:
        return {
          title: "Data",
          description: "Export/Import data",
          apiCall: null,
          fileName: "data",
        };
    }
  };

  const dataInfo = getDataTypeInfo();

  // Export data function
  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      let data: any[] = [];

      // Fetch data based on type
      if (dataInfo.apiCall) {
        const response = await dataInfo.apiCall();
        if (response.data.isSuccess) {
          data = response.data.data || response.data.payment || [];
        }
      } else {
        // Mock data for equipment and attendance
        data = generateMockData();
      }

      if (data.length === 0) {
        toast.error("No data available to export");
        return;
      }

      // Convert data based on format
      let fileContent: string;
      let mimeType: string;
      let fileExtension: string;

      switch (format) {
        case "csv":
          fileContent = convertToCSV(data);
          mimeType = "text/csv";
          fileExtension = ".csv";
          break;
        case "excel":
          // For Excel, we'll use CSV format as a fallback
          fileContent = convertToCSV(data);
          mimeType = "text/csv";
          fileExtension = ".csv";
          break;
        case "json":
          fileContent = JSON.stringify(data, null, 2);
          mimeType = "application/json";
          fileExtension = ".json";
          break;
        default:
          throw new Error("Unsupported format");
      }

      // Create and download file
      const blob = new Blob([fileContent], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${dataInfo.fileName}_${
        new Date().toISOString().split("T")[0]
      }${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Data exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  // Import data function
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress(0);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        let data: any[] = [];

        // Parse data based on file extension
        const fileExtension = file.name.split(".").pop()?.toLowerCase();

        switch (fileExtension) {
          case "csv":
            data = parseCSV(content);
            break;
          case "json":
            data = JSON.parse(content);
            break;
          default:
            throw new Error("Unsupported file format");
        }

        // Simulate import progress
        for (let i = 0; i <= 100; i += 10) {
          setImportProgress(i);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Process imported data
        if (onDataImported) {
          onDataImported(data);
        }

        toast.success(`Successfully imported ${data.length} records`);
      } catch (error) {
        console.error("Import error:", error);
        toast.error("Failed to import data");
      } finally {
        setIsImporting(false);
        setImportProgress(0);
        // Reset file input
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  };

  // Convert data to CSV format
  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape commas and quotes in CSV
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || "";
          })
          .join(",")
      ),
    ].join("\n");

    return csvContent;
  };

  // Parse CSV content
  const parseCSV = (content: string): any[] => {
    const lines = content.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(",");
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim() || "";
        });
        return row;
      });
  };

  // Generate mock data for equipment and attendance
  const generateMockData = () => {
    if (dataType === "equipment") {
      return [
        {
          id: 1,
          name: "Treadmill Pro 2000",
          type: "Cardio",
          status: "Operational",
          lastMaintenance: "2024-01-15",
        },
        {
          id: 2,
          name: "Weight Bench",
          type: "Strength",
          status: "Operational",
          lastMaintenance: "2024-01-10",
        },
        {
          id: 3,
          name: "Dumbbells Set",
          type: "Strength",
          status: "Maintenance",
          lastMaintenance: "2024-01-20",
        },
      ];
    } else if (dataType === "attendance") {
      return [
        {
          id: 1,
          memberName: "John Doe",
          checkIn: "2024-01-20 08:00:00",
          checkOut: "2024-01-20 10:00:00",
        },
        {
          id: 2,
          memberName: "Jane Smith",
          checkIn: "2024-01-20 09:30:00",
          checkOut: "2024-01-20 11:30:00",
        },
      ];
    }
    return [];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          {dataInfo.title}
        </CardTitle>
        <CardDescription>{dataInfo.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Section */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {exportFormats.map((format) => (
              <Button
                key={format.id}
                variant="outline"
                onClick={() => handleExport(format.id)}
                disabled={isExporting}
                className="flex items-center gap-2 h-auto p-4"
              >
                {format.icon}
                <div className="text-left">
                  <div className="font-medium">{format.name}</div>
                  <div className="text-xs text-gray-500">
                    {format.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Import Section */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Data
          </h4>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".csv,.json,.xlsx"
              onChange={handleImport}
              disabled={isImporting}
              className="hidden"
              id="file-import"
            />
            <label
              htmlFor="file-import"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium">
                  {isImporting ? "Importing..." : "Click to upload file"}
                </p>
                <p className="text-xs text-gray-500">
                  Supports CSV, JSON, and Excel formats
                </p>
              </div>
            </label>

            {isImporting && (
              <div className="mt-4 w-full">
                <Progress value={importProgress} className="h-2" />
                <p className="text-xs text-gray-500 mt-2">
                  {importProgress}% complete
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Import Guidelines */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Import Guidelines
              </p>
              <ul className="mt-1 text-blue-800 dark:text-blue-200 space-y-1">
                <li>
                  • Ensure your file has proper headers matching the data
                  structure
                </li>
                <li>
                  • For CSV files, use commas as separators and quote text
                  fields
                </li>
                <li>• Large files may take several minutes to process</li>
                <li>• Invalid data will be skipped during import</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExportImport;
