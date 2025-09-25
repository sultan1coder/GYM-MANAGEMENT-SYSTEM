import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Clock,
  Users,
  Dumbbell,
  CreditCard,
  FileText,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { memberAPI, userAPI, paymentAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  type: "member" | "staff" | "payment" | "equipment" | "attendance";
  title: string;
  subtitle: string;
  description?: string;
  icon: React.ReactNode;
  url: string;
  metadata?: Record<string, any>;
}

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  className,
  placeholder = "Search members, payments, equipment...",
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const updated = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Search function
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults: SearchResult[] = [];

      // Search members
      try {
        const membersResponse = await memberAPI.getAllMembers();
        if (membersResponse.data.isSuccess) {
          const members = membersResponse.data.data || [];
          const memberResults = members
            .filter(
              (member: any) =>
                member.name
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                member.email
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                member.phone_number?.includes(searchQuery)
            )
            .slice(0, 5)
            .map((member: any) => ({
              id: member.id,
              type: "member" as const,
              title: member.name,
              subtitle: member.email,
              description: `Phone: ${member.phone_number || "N/A"} • ${
                member.membershiptype
              }`,
              icon: <Users className="w-4 h-4" />,
              url: `/admin/members`,
              metadata: { member },
            }));
          searchResults.push(...memberResults);
        }
      } catch (error) {
        console.error("Error searching members:", error);
      }

      // Search payments
      try {
        const paymentsResponse = await paymentAPI.getAllPayments();
        if (paymentsResponse.data.isSuccess) {
          const payments = paymentsResponse.data.payment || [];
          const paymentResults = payments
            .filter(
              (payment: any) =>
                payment.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                payment.Member?.name
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                payment.method
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase())
            )
            .slice(0, 3)
            .map((payment: any) => ({
              id: payment.id,
              type: "payment" as const,
              title: `Payment #${payment.id.slice(-8)}`,
              subtitle: payment.Member?.name || "Unknown Member",
              description: `$${payment.amount} • ${payment.method} • ${payment.status}`,
              icon: <CreditCard className="w-4 h-4" />,
              url: `/admin/payments`,
              metadata: { payment },
            }));
          searchResults.push(...paymentResults);
        }
      } catch (error) {
        console.error("Error searching payments:", error);
      }

      // Search equipment (mock data for now)
      const equipmentResults = [
        {
          id: "eq-1",
          type: "equipment" as const,
          title: "Treadmill Pro 2000",
          subtitle: "Cardio Equipment",
          description: "Status: Operational • Last maintenance: 2 days ago",
          icon: <Dumbbell className="w-4 h-4" />,
          url: `/admin/equipments`,
          metadata: {},
        },
      ].filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );

      searchResults.push(...equipmentResults);

      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    } else if (e.key === "Enter" && results.length > 0) {
      handleResultClick(results[0]);
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    navigate(result.url);
    setIsOpen(false);
    setQuery("");
  };

  // Handle search input focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  // Get result type color
  const getResultTypeColor = (type: string) => {
    switch (type) {
      case "member":
        return "bg-green-100 text-green-800";
      case "payment":
        return "bg-blue-100 text-blue-800";
      case "equipment":
        return "bg-purple-100 text-purple-800";
      case "attendance":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-md", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown} className="pl-10 pr-10 w-full"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch} className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto shadow-lg border">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                Searching...
              </div>
            ) : query.trim() ? (
              results.length > 0 ? (
                <div className="py-2">
                  {results.map((result, index) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)} className="flex items-center gap-3 p-3 hover:bg-gray-50"
                    >
                      <div className="flex-shrink-0 text-gray-500">
                        {result.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">
                            {result.title}
                          </p>
                          <Badge
                            variant="secondary" className={cn(
                              "text-xs",
                              getResultTypeColor(result.type)
                            )}
                          >
                            {result.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {result.subtitle}
                        </p>
                        {result.description && (
                          <p className="text-xs text-gray-500">
                            {result.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm">Try different keywords</p>
                </div>
              )
            ) : (
              <div className="py-2">
                {recentSearches.length > 0 && (
                  <div className="px-3 py-2 border-b border-gray-200">
                    <p className="text-xs font-medium text-gray-500">
                      Recent Searches
                    </p>
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setQuery(search);
                          performSearch(search);
                        }} className="flex items-center gap-2 p-2 hover:bg-gray-50"
                      >
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-700">
                          {search}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="px-3 py-2">
                  <p className="text-xs font-medium text-gray-500">
                    Search Tips
                  </p>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>• Search by member name, email, or phone</p>
                    <p>• Find payments by amount or method</p>
                    <p>• Look up equipment by name or type</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearch;
