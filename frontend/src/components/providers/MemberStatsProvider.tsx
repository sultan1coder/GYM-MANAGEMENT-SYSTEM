import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { memberAPI, subscriptionAPI } from "@/services/api";
import toast from "react-hot-toast";

interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newMembersThisMonth: number;
  membershipsExpiring: number;
  averageAge: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  membershipTypes: {
    monthly: number;
    daily: number;
  };
  topMembershipPlans: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  monthlyGrowth: number[];
  revenueByMonth: number[];
  topCities: Array<{
    city: string;
    state: string;
    count: number;
  }>;
  recentRegistrations: number;
  growthRate: string;
}

interface MemberStatsContextType {
  stats: MemberStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const MemberStatsContext = createContext<MemberStatsContextType | undefined>(
  undefined
);

export const useMemberStats = () => {
  const context = useContext(MemberStatsContext);
  if (!context) {
    throw new Error("useMemberStats must be used within a MemberStatsProvider");
  }
  return context;
};

interface MemberStatsProviderProps {
  children: ReactNode;
}

export const MemberStatsProvider: React.FC<MemberStatsProviderProps> = ({
  children,
}) => {
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemberStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch members data
      const membersResponse = await memberAPI.getAllMembers();
      const members = membersResponse.data.members || [];

      // Fetch subscription plans
      const plansResponse = await subscriptionAPI.getAllPlans();
      const plans = plansResponse.data.data || [];

      // Calculate statistics
      const totalMembers = members.length;
      const activeMembers = members.filter((m) => m.email_verified).length;
      const inactiveMembers = totalMembers - activeMembers;

      // Calculate new members this month
      const currentMonth = new Date();
      const newMembersThisMonth = members.filter((m) => {
        const joinDate = new Date(m.createdAt);
        return (
          joinDate.getMonth() === currentMonth.getMonth() &&
          joinDate.getFullYear() === currentMonth.getFullYear()
        );
      }).length;

      // Calculate expiring memberships (simplified - you can enhance this logic)
      const membershipsExpiring = Math.floor(totalMembers * 0.1); // 10% of total members

      // Calculate average age
      const averageAge =
        totalMembers > 0
          ? Math.round(
              members.reduce((sum, m) => sum + m.age, 0) / totalMembers
            )
          : 0;

      // Gender distribution (estimated - you can add gender field to your schema)
      const genderDistribution = {
        male: Math.round(totalMembers * 0.65),
        female: Math.round(totalMembers * 0.32),
        other: Math.round(totalMembers * 0.03),
      };

      // Membership types
      const membershipTypes = {
        monthly: members.filter((m) => m.membershiptype === "MONTHLY").length,
        daily: members.filter((m) => m.membershiptype === "DAILY").length,
      };

      // Top membership plans
      const topMembershipPlans = plans.map((plan) => ({
        name: plan.name,
        count: members.filter((m) => m.membershiptype === "MONTHLY").length,
        revenue:
          plan.price *
          members.filter((m) => m.membershiptype === "MONTHLY").length,
      }));

      // Monthly growth (last 12 months)
      const monthlyGrowth = Array.from({ length: 12 }, (_, i) => {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        return Math.floor(Math.random() * 50) + 10; // Mock data - replace with real calculation
      }).reverse();

      // Revenue by month
      const revenueByMonth = monthlyGrowth.map(
        (growth) => growth * plans.reduce((sum, plan) => sum + plan.price, 0)
      );

      // Top cities (if address data exists)
      const topCities = members
        .filter((m) => m.address)
        .reduce((acc, member) => {
          const cityKey = `${member.address?.city || "Unknown"}, ${
            member.address?.state || "Unknown"
          }`;
          const existing = acc.find(
            (c) =>
              c.city === member.address?.city &&
              c.state === member.address?.state
          );
          if (existing) {
            existing.count++;
          } else {
            acc.push({
              city: member.address?.city || "Unknown",
              state: member.address?.state || "Unknown",
              count: 1,
            });
          }
          return acc;
        }, [] as Array<{ city: string; state: string; count: number }>)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Recent registrations (last 7 days)
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const recentRegistrations = members.filter(
        (m) => new Date(m.createdAt) >= lastWeek
      ).length;

      // Growth rate (month over month)
      const growthRate =
        monthlyGrowth.length > 1
          ? (
              ((monthlyGrowth[monthlyGrowth.length - 1] -
                monthlyGrowth[monthlyGrowth.length - 2]) /
                monthlyGrowth[monthlyGrowth.length - 2]) *
              100
            ).toFixed(1)
          : "0.0";

      const memberStats: MemberStats = {
        totalMembers,
        activeMembers,
        inactiveMembers,
        newMembersThisMonth,
        membershipsExpiring,
        averageAge,
        genderDistribution,
        membershipTypes,
        topMembershipPlans,
        monthlyGrowth,
        revenueByMonth,
        topCities,
        recentRegistrations,
        growthRate,
      };

      setStats(memberStats);
    } catch (error) {
      console.error("Failed to fetch member statistics:", error);
      setError("Failed to load member statistics");
      toast.error("Failed to load member statistics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberStats();
  }, []);

  const refetch = async () => {
    await fetchMemberStats();
  };

  const value: MemberStatsContextType = {
    stats,
    isLoading,
    error,
    refetch,
  };

  return (
    <MemberStatsContext.Provider value={value}>
      {children}
    </MemberStatsContext.Provider>
  );
};
