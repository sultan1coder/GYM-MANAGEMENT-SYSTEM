import React, { useState, useEffect } from "react";
import {
  Filter,
  X,
  Search,
  Calendar,
  DollarSign,
  User,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Native date formatting utility to replace date-fns
const formatDate = (date: Date, formatStr: string): string => {
  const options: Intl.DateTimeFormatOptions = {};

  switch (formatStr) {
    case "PPP": // Pretty date format (e.g., "January 20, 2024")
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "MMM dd, yyyy": // Short date format (e.g., "Jan 20, 2024")
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    case "MMM dd": // Very short format (e.g., "Jan 20")
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
    default:
      return date.toLocaleDateString();
  }
};

export interface FilterOption {
  id: string;
  label: string;
  type: "text" | "select" | "date" | "dateRange" | "number" | "boolean";
  options?: { value: string; label: string }[];
  placeholder?: string;
  icon?: React.ReactNode;
}

export interface FilterValue {
  [key: string]: any;
}

interface AdvancedFilterProps {
  filters: FilterOption[];
  values: FilterValue;
  onChange: (values: FilterValue) => void;
  onClear: () => void;
  className?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  filters,
  values,
  onChange,
  onClear,
  className,
  showSearch = true,
  searchPlaceholder = "Search...",
  onSearch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [localValues, setLocalValues] = useState<FilterValue>(values);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const handleFilterChange = (key: string, value: any) => {
    const newValues = { ...localValues, [key]: value };
    setLocalValues(newValues);
    onChange(newValues);
  };

  const handleClear = () => {
    setLocalValues({});
    onClear();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const getActiveFiltersCount = () => {
    return Object.values(localValues).filter(
      (value) => value !== undefined && value !== null && value !== ""
    ).length;
  };

  const renderFilterInput = (filter: FilterOption) => {
    const value = localValues[filter.id] || "";

    switch (filter.type) {
      case "text":
        return (
          <Input
            placeholder={
              filter.placeholder || `Enter ${filter.label.toLowerCase()}`
            }
            value={value}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full"
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val) => handleFilterChange(filter.id, val)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  filter.placeholder || `Select ${filter.label.toLowerCase()}`
                }
              />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {value ? formatDate(new Date(value), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) =>
                  handleFilterChange(filter.id, date?.toISOString())
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case "dateRange":
        return (
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !value?.from && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {value?.from
                    ? formatDate(new Date(value.from), "PPP")
                    : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={value?.from ? new Date(value.from) : undefined}
                  onSelect={(date) =>
                    handleFilterChange(filter.id, {
                      ...value,
                      from: date?.toISOString(),
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !value?.to && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {value?.to ? formatDate(new Date(value.to), "PPP") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={value?.to ? new Date(value.to) : undefined}
                  onSelect={(date) =>
                    handleFilterChange(filter.id, {
                      ...value,
                      to: date?.toISOString(),
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder={
              filter.placeholder || `Enter ${filter.label.toLowerCase()}`
            }
            value={value}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full"
          />
        );

      case "boolean":
        return (
          <Select
            value={value?.toString()}
            onValueChange={(val) =>
              handleFilterChange(filter.id, val === "true")
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  filter.placeholder || `Select ${filter.label.toLowerCase()}`
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filter Toggle */}
      <div className="flex gap-2">
        {showSearch && (
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Advanced Filters</CardTitle>
                  {getActiveFiltersCount() > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="text-red-600 hover:text-red-700"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filters.map((filter) => (
                  <div key={filter.id} className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {filter.icon}
                      {filter.label}
                    </Label>
                    {renderFilterInput(filter)}
                  </div>
                ))}
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(localValues).map(([key, value]) => {
            if (!value || value === "") return null;

            const filter = filters.find((f) => f.id === key);
            if (!filter) return null;

            let displayValue = value;
            if (filter.type === "date") {
              displayValue = formatDate(new Date(value), "MMM dd, yyyy");
            } else if (filter.type === "dateRange") {
              displayValue = `${formatDate(
                new Date(value.from),
                "MMM dd"
              )} - ${formatDate(new Date(value.to), "MMM dd, yyyy")}`;
            } else if (filter.type === "boolean") {
              displayValue = value ? "Yes" : "No";
            } else if (filter.type === "select") {
              const option = filter.options?.find((opt) => opt.value === value);
              displayValue = option?.label || value;
            }

            return (
              <Badge
                key={key}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {filter.icon}
                <span className="font-medium">{filter.label}:</span>
                <span>{displayValue}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterChange(key, "")}
                  className="h-auto p-0 ml-1 hover:bg-transparent"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdvancedFilter;
