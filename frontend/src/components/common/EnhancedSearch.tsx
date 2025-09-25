import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  X,
  Calendar as CalendarIcon,
  SlidersHorizontal,
} from "lucide-react";

export interface FilterOption {
  key: string;
  label: string;
  type: "select" | "multiselect" | "date" | "daterange" | "number" | "text";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface SearchFilters {
  [key: string]: any;
}

interface EnhancedSearchProps {
  placeholder?: string;
  onSearch: (query: string, filters: SearchFilters) => void;
  filterOptions?: FilterOption[];
  showAdvancedFilters?: boolean;
  className?: string;
}

const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  placeholder = "Search...",
  onSearch,
  filterOptions = [],
  showAdvancedFilters = true,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string, currentFilters: SearchFilters) => {
      onSearch(query, currentFilters);
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchQuery, filters);
  }, [searchQuery, filters, debouncedSearch]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters };

    if (
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      delete newFilters[key];
      setActiveFilters((prev) => prev.filter((f) => f !== key));
    } else {
      newFilters[key] = value;
      if (!activeFilters.includes(key)) {
        setActiveFilters((prev) => [...prev, key]);
      }
    }

    setFilters(newFilters);
  };

  const clearFilter = (key: string) => {
    handleFilterChange(key, undefined);
  };

  const clearAllFilters = () => {
    setFilters({});
    setActiveFilters([]);
    setSearchQuery("");
  };

  const renderFilterInput = (option: FilterOption) => {
    const value = filters[option.key];

    switch (option.type) {
      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={(newValue) =>
              handleFilterChange(option.key, newValue)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={option.placeholder || `Select ${option.label}`}
              />
            </SelectTrigger>
            <SelectContent>
              {option.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multiselect":
        return (
          <div className="space-y-2">
            {option.options?.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${option.key}-${opt.value}`}
                  checked={(value || []).includes(opt.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || [];
                    const newValues = checked
                      ? [...currentValues, opt.value]
                      : currentValues.filter((v: string) => v !== opt.value);
                    handleFilterChange(option.key, newValues);
                  }}
                />
                <Label
                  htmlFor={`${option.key}-${opt.value}`} className="text-sm"
                >
                  {opt.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline" className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value
                  ? new Date(value).toLocaleDateString()
                  : option.placeholder || "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) =>
                  handleFilterChange(option.key, date?.toISOString())
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case "daterange":
        return (
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline" className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value?.start
                    ? new Date(value.start).toLocaleDateString()
                    : "Start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value?.start ? new Date(value.start) : undefined}
                  onSelect={(date) =>
                    handleFilterChange(option.key, {
                      ...value,
                      start: date?.toISOString(),
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline" className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value?.end
                    ? new Date(value.end).toLocaleDateString()
                    : "End date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value?.end ? new Date(value.end) : undefined}
                  onSelect={(date) =>
                    handleFilterChange(option.key, {
                      ...value,
                      end: date?.toISOString(),
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
            placeholder={option.placeholder || `Enter ${option.label}`}
            value={value || ""}
            onChange={(e) => handleFilterChange(option.key, e.target.value)}
          />
        );

      case "text":
        return (
          <Input
            type="text"
            placeholder={option.placeholder || `Enter ${option.label}`}
            value={value || ""}
            onChange={(e) => handleFilterChange(option.key, e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"
          />
        </div>

        {showAdvancedFilters && filterOptions.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)} className={showFilters ? "bg-primary text-primary-foreground" : ""}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        )}

        {(searchQuery || activeFilters.length > 0) && (
          <Button variant="outline" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((key) => {
            const option = filterOptions.find((opt) => opt.key === key);
            const value = filters[key];
            let displayValue = value;

            if (option?.type === "multiselect" && Array.isArray(value)) {
              displayValue = value.join(", ");
            } else if (option?.type === "date" && value) {
              displayValue = new Date(value).toLocaleDateString();
            } else if (option?.type === "daterange" && value) {
              displayValue = `${
                value.start ? new Date(value.start).toLocaleDateString() : ""
              } - ${value.end ? new Date(value.end).toLocaleDateString() : ""}`;
            }

            return (
              <Badge
                key={key}
                variant="secondary" className="flex items-center gap-1"
              >
                {option?.label}: {displayValue}
                <X className="h-3 w-3 cursor-pointer"
                  onClick={() => clearFilter(key)}
                />
              </Badge>
            );
          })}
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && filterOptions.length > 0 && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterOptions.map((option) => (
              <div key={option.key} className="space-y-2">
                <Label className="text-sm font-medium">{option.label}</Label>
                {renderFilterInput(option)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export default EnhancedSearch;
