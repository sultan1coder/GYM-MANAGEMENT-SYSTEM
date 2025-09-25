import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Search,
  BookOpen,
  Video,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  User,
  Settings,
  BarChart3,
  Users,
  CreditCard,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  lastUpdated: Date;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedReadTime: number;
  relatedArticles: string[];
}

interface HelpVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  url: string;
  category: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
}

// Mock data
const helpArticles: HelpArticle[] = [
  {
    id: "getting-started",
    title: "Getting Started with Gym Management System",
    content: `
# Getting Started

Welcome to the Gym Management System! This comprehensive guide will help you get up and running quickly.

## Initial Setup

1. **Login**: Use your admin credentials to access the system
2. **Dashboard**: Familiarize yourself with the main dashboard
3. **Settings**: Configure your gym's basic information
4. **Members**: Start adding your first members

## Key Features

- **Member Management**: Add, edit, and manage member profiles
- **Payment Processing**: Handle membership payments and billing
- **Equipment Tracking**: Monitor gym equipment status
- **Analytics**: View detailed reports and insights
- **Attendance**: Track member check-ins and usage

## Quick Tips

- Use the global search to quickly find any information
- Set up notifications to stay updated on important events
- Customize your dashboard to show the most relevant metrics
    `,
    category: "Getting Started",
    tags: ["setup", "basics", "tutorial"],
    lastUpdated: new Date("2024-01-15"),
    difficulty: "beginner",
    estimatedReadTime: 5,
    relatedArticles: ["user-roles", "dashboard-customization"],
  },
  {
    id: "member-management",
    title: "Complete Guide to Member Management",
    content: `
# Member Management Guide

Learn how to effectively manage your gym members with our comprehensive tools.

## Adding New Members

1. Navigate to Members → Add New Member
2. Fill in the required information
3. Upload a profile picture (optional)
4. Set membership type and duration
5. Save the member profile

## Member Profiles

Each member profile includes:
- Personal information
- Contact details
- Emergency contacts
- Membership details
- Payment history
- Attendance records

## Bulk Operations

- Import members from CSV files
- Export member data
- Send bulk emails
- Update multiple members at once
    `,
    category: "Member Management",
    tags: ["members", "profiles", "bulk-operations"],
    lastUpdated: new Date("2024-01-20"),
    difficulty: "intermediate",
    estimatedReadTime: 8,
    relatedArticles: ["bulk-import", "member-communication"],
  },
  {
    id: "payment-system",
    title: "Payment System and Billing",
    content: `
# Payment System Guide

Manage payments, billing, and financial tracking effectively.

## Payment Methods

- Credit/Debit Cards
- Bank Transfers
- Cash Payments
- Digital Wallets

## Setting Up Payments

1. Configure payment gateways
2. Set up recurring billing
3. Create payment plans
4. Set up automated reminders

## Financial Reports

- Revenue tracking
- Payment analytics
- Outstanding balances
- Refund management
    `,
    category: "Payments",
    tags: ["payments", "billing", "finance"],
    lastUpdated: new Date("2024-01-18"),
    difficulty: "intermediate",
    estimatedReadTime: 6,
    relatedArticles: ["payment-gateways", "financial-reports"],
  },
];

const helpVideos: HelpVideo[] = [
  {
    id: "dashboard-tour",
    title: "Dashboard Tour and Overview",
    description:
      "Take a complete tour of the main dashboard and learn about key features",
    duration: "5:32",
    thumbnail: "/api/placeholder/300/200",
    url: "https://example.com/video1",
    category: "Getting Started",
  },
  {
    id: "member-setup",
    title: "Setting Up Your First Member",
    description: "Step-by-step guide to adding and configuring member profiles",
    duration: "3:45",
    thumbnail: "/api/placeholder/300/200",
    url: "https://example.com/video2",
    category: "Member Management",
  },
  {
    id: "payment-config",
    title: "Payment Configuration",
    description: "How to set up payment processing and billing systems",
    duration: "7:12",
    thumbnail: "/api/placeholder/300/200",
    url: "https://example.com/video3",
    category: "Payments",
  },
];

const faqs: FAQ[] = [
  {
    id: "login-issues",
    question: "I forgot my password. How do I reset it?",
    answer:
      'Click on "Forgot Password" on the login page and enter your email address. You\'ll receive a reset link within a few minutes.',
    category: "Account",
    helpful: 45,
    notHelpful: 2,
  },
  {
    id: "member-import",
    question: "How do I import members from a CSV file?",
    answer:
      "Go to Members → Bulk Import, download the template, fill it with your data, and upload the file. The system will validate and import the data.",
    category: "Member Management",
    helpful: 38,
    notHelpful: 1,
  },
  {
    id: "payment-failed",
    question: "A payment failed. What should I do?",
    answer:
      "Check the payment details in the Payments section. You can retry the payment, contact the member, or mark it as resolved.",
    category: "Payments",
    helpful: 42,
    notHelpful: 3,
  },
];

const categories = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "member-management",
    name: "Member Management",
    icon: Users,
    color: "bg-green-100 text-green-800",
  },
  {
    id: "payments",
    name: "Payments",
    icon: CreditCard,
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "equipment",
    name: "Equipment",
    icon: Dumbbell,
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: BarChart3,
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    color: "bg-gray-100 text-gray-800",
  },
];

interface HelpSystemProps {
  className?: string;
}

const HelpSystem: React.FC<HelpSystemProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(
    null
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const filteredArticles = helpArticles.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            Help & Support
          </h1>
          <p className="text-gray-600">
            Find answers, tutorials, and support resources
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <MessageCircle className="w-4 h-4 mr-2" />
            Live Chat
          </Button>
          <Button variant="outline" size="sm">
            <Phone className="w-4 h-4 mr-2" />
            Call Support
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Email Us
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search help articles, videos, and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"
              />
            </div>
            <Button onClick={() => setSearchQuery("")} variant="outline">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "ghost"} className="w-full justify-start"
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Articles
                  </Button>
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={
                          selectedCategory === category.id ? "default" : "ghost"
                        } className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {category.name}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Articles List */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <Card
                    key={article.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {article.content
                              .split("\n")[0]
                              .replace("#", "")
                              .trim()}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.estimatedReadTime} min read
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {article.difficulty}
                            </span>
                            <span>
                              Updated {article.lastUpdated.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {article.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary" className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge className={getDifficultyColor(article.difficulty)}
                        >
                          {article.difficulty}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{video.duration}</Badge>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Watch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Collapsible key={faq.id}>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{faq.question}</h3>
                        {expandedSections.has(faq.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="mt-1">
                    <CardContent className="p-4 pt-0">
                      <p className="text-gray-700 mb-4">{faq.answer}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Was this helpful?</span>
                        <Button size="sm" variant="outline" className="h-7">
                          <Star className="w-3 h-3 mr-1" />
                          Yes ({faq.helpful})
                        </Button>
                        <Button size="sm" variant="outline" className="h-7">
                          No ({faq.notHelpful})
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Live Chat Support
                </CardTitle>
                <CardDescription>
                  Get instant help from our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Available Monday - Friday, 9 AM - 6 PM EST
                </p>
                <Button className="w-full">Start Live Chat</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Phone Support
                </CardTitle>
                <CardDescription>
                  Speak directly with our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Call us at: <strong>1-800-GYM-HELP</strong>
                </p>
                <Button variant="outline" className="w-full">
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Support
                </CardTitle>
                <CardDescription>Send us a detailed message</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Email: <strong>support@gymmanagement.com</strong>
                </p>
                <Button variant="outline" className="w-full">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Documentation
                </CardTitle>
                <CardDescription>
                  Comprehensive guides and API docs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Access our full documentation portal
                </p>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Docs
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{selectedArticle.title}</CardTitle>
                <CardDescription>
                  {selectedArticle.category} •{" "}
                  {selectedArticle.estimatedReadTime} min read
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedArticle(null)}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[60vh]">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm">
                  {selectedArticle.content}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HelpSystem;
